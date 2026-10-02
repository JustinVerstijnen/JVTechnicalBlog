---
title: "Automatically accept SSO prompt on Windows"
slug: "automatically-accept-sso-prompt-on-windows"
date: 2026-07-02
tags:
- Step by Step Guides
categories:
- Microsoft Intune
description: "In this post, I will show you how to automatically accept the SSO prompt on managed Windows 11 devices using Microsoft Intune, Group Policy or directly through the Windows Registry."
hidden: false
---

## What is the Continue to sign in prompt?

If you are managing Windows 11 devices, you may have noticed the `Continue to sign in?` prompt when a user opens an application such as Microsoft Company Portal or another Microsoft application.

The prompt asks the user if Windows can use their signed-in Microsoft Entra ID account to automatically sign in to other Microsoft apps and services.

This behavior is especially noticeable in the European Economic Area (EEA), where Microsoft changed the Windows sign-in experience to give users more control over automatically using their Windows account in other applications.

<!-- Add screenshot: Continue to sign in prompt -->

On a personal device this isn't really a problem. The user can simply click Continue and normally won't be asked again.

On managed devices however, especially freshly installed Microsoft Intune and Windows Autopilot devices, this can interrupt the seamless onboarding experience. For example, Company Portal can automatically start but still waits for the user to accept the SSO permission before it can continue signing in.

Luckily Microsoft has now introduced a supported setting called:

`AutoAcceptSsoPermission`

With this policy configured, Windows can automatically accept the SSO permission for Microsoft Entra ID accounts on supported managed devices.

In this post, I will show you three different ways to configure it:

- Microsoft Intune
- Group Policy
- Windows Registry

---

## Requirements

Before configuring this setting, make sure your devices meet the following requirements:

- Windows 11 version 24H2 or 25H2
- July 2026 monthly security update (KB5101650) or newer installed
- A managed enterprise Windows device
- Microsoft Entra ID account
- Administrative permissions for the configuration method you are using

Personal Microsoft accounts are not affected by this policy. The prompt will also remain on unmanaged devices.

The setting we are going to configure is:

`HKLM\SOFTWARE\Policies\Microsoft\Windows\AAD`

With the following value:

`AutoAcceptSsoPermission = 1`

{{< ads >}}

---

## Option 1: Configure with Microsoft Intune

Let's start with Microsoft Intune.

At the moment, Microsoft provides `AutoAcceptSsoPermission` as a registry-based policy. Because there is no native Settings Catalog setting available for it yet, we can deploy the registry configuration using a PowerShell script.

Open the Microsoft Intune admin center and navigate to:

`Devices > Scripts and remediations > Platform scripts`

Click `+ Add` and select `Windows 10 and later`.

<!-- Add screenshot: Intune Platform scripts -->

Give the script a descriptive name. For example:

`Enable Auto Accept SSO Permission`

For the description I like using something like:

`Automatically accepts the Windows SSO permission for managed Microsoft Entra ID accounts.`

Continue to the `Script settings` page.

Create a `.ps1` file with the following script and upload it:

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
$AADPath = "HKLM:\SOFTWARE\Policies\Microsoft\Windows\AAD"
$ValueName = "AutoAcceptSsoPermission"
$ValueData = 1

if (-not (Test-Path -LiteralPath $AADPath)) {
    New-Item -Path $AADPath -Force | Out-Null
}

New-ItemProperty `
    -Path $AADPath `
    -Name $ValueName `
    -PropertyType DWord `
    -Value $ValueData `
    -Force | Out-Null

$ConfiguredValue = Get-ItemPropertyValue `
    -Path $AADPath `
    -Name $ValueName `
    -ErrorAction SilentlyContinue

if ($ConfiguredValue -eq 1) {
    Write-Output "AutoAcceptSsoPermission has been configured successfully."
    exit 0
}
else {
    Write-Error "AutoAcceptSsoPermission could not be configured."
    exit 1
}
{{< /card >}}

Then configure the script settings:

- **Run this script using the logged on credentials:** No
- **Enforce script signature check:** Configure this according to your own environment
- **Run script in 64-bit PowerShell host:** Yes

It is important to run the script using the `SYSTEM` context because we are changing a registry value inside the `HKEY_LOCAL_MACHINE` hive.

<!-- Add screenshot: Intune script settings -->

Continue to `Assignments` and assign the script to the device group containing the Windows 11 devices where you want to automatically accept the SSO permission.

Finish the wizard and create the script.

Microsoft Intune will now deploy the script through the Intune Management Extension.

After the script has been executed, the following registry configuration should exist on the device:

`HKLM\SOFTWARE\Policies\Microsoft\Windows\AAD\AutoAcceptSsoPermission`

With a DWORD value of:

`1`

---

## Option 2: Configure with Group Policy

If your Windows devices are managed using Active Directory and traditional Group Policy, we can configure exactly the same registry setting through a GPO.

Because `AutoAcceptSsoPermission` is a registry-based policy, we can use Group Policy Preferences to configure the required registry value.

Open the Group Policy Management Console:

`gpmc.msc`

Create a new Group Policy Object or use an existing GPO containing your Windows device configuration.

Edit the GPO and navigate to:

`Computer Configuration > Preferences > Windows Settings > Registry`

<!-- Add screenshot: Group Policy Registry -->

Right-click `Registry` and select:

`New > Registry Item`

Configure the following settings:

| Setting | Value |
| --- | --- |
| Action | Update |
| Hive | HKEY_LOCAL_MACHINE |
| Key Path | SOFTWARE\Policies\Microsoft\Windows\AAD |
| Value name | AutoAcceptSsoPermission |
| Value type | REG_DWORD |
| Value data | 1 |

<!-- Add screenshot: AutoAcceptSsoPermission GPO registry item -->

Click `Apply` and `OK`.

Then link the Group Policy Object to the Organizational Unit containing the computers where you want to configure this setting.

You can wait for the normal Group Policy refresh or manually force an update on a test device:

{{< card code=true header="**COMMAND PROMPT**" lang="cmd" >}}
gpupdate /force
{{< /card >}}

After the Group Policy has been applied, check the following registry location:

`HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\Windows\AAD`

You should now see:

`AutoAcceptSsoPermission`

With a value of:

`1`

---

## Option 3: Configure directly through Registry

Of course, we can also configure the setting directly in the Windows Registry.

I would mainly use this option for testing or troubleshooting. When deploying this configuration to multiple managed devices, I recommend using Microsoft Intune or Group Policy instead.

Open PowerShell or Command Prompt with administrative permissions and run:

{{< card code=true header="**COMMAND PROMPT**" lang="cmd" >}}
reg.exe add "HKLM\SOFTWARE\Policies\Microsoft\Windows\AAD" /v "AutoAcceptSsoPermission" /t REG_DWORD /d 1 /f
{{< /card >}}

Or if you prefer PowerShell:

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
$AADPath = "HKLM:\SOFTWARE\Policies\Microsoft\Windows\AAD"

if (-not (Test-Path -LiteralPath $AADPath)) {
    New-Item -Path $AADPath -Force | Out-Null
}

New-ItemProperty `
    -Path $AADPath `
    -Name "AutoAcceptSsoPermission" `
    -PropertyType DWord `
    -Value 1 `
    -Force | Out-Null

Get-ItemProperty `
    -Path $AADPath `
    -Name "AutoAcceptSsoPermission"
{{< /card >}}

You can also manually check this by opening Registry Editor (`regedit.exe`) and navigating to:

`Computer\HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\Windows\AAD`

<!-- Add screenshot: Registry AutoAcceptSsoPermission -->

The `AutoAcceptSsoPermission` DWORD should have a value of `1`.

---

## What does AutoAcceptSsoPermission actually do?

With `AutoAcceptSsoPermission` configured to `1`, Windows can automatically accept the SSO permission for Microsoft Entra ID accounts on eligible managed devices.

Instead of this flow:

`User signs in to Windows`

↓

`Microsoft application requests the Windows account`

↓

`Continue to sign in? prompt appears`

↓

`User clicks Continue`

↓

`Application continues signing in`

We now get:

`User signs in to Windows`

↓

`Microsoft application requests the Windows account`

↓

`Windows automatically accepts the managed SSO permission`

↓

`Application continues signing in`

This is especially useful for automated Windows Autopilot deployments where applications such as Company Portal need to use the signed-in Microsoft Entra ID account without another user interaction.

It is important to understand that this does not disable the Windows SSO functionality or remove the prompt globally.

The setting only provides administrator control for supported managed enterprise devices using Microsoft Entra ID accounts. Personal Microsoft accounts and unmanaged Windows devices keep the normal user prompt.

{{< ads >}}

---

## Verify the configuration

After deploying the configuration, we can quickly check if the setting is active.

Open PowerShell as administrator and run:

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
$RegistryPath = "HKLM:\SOFTWARE\Policies\Microsoft\Windows\AAD"
$ValueName = "AutoAcceptSsoPermission"

if (Test-Path -LiteralPath $RegistryPath) {
    $Value = Get-ItemPropertyValue `
        -Path $RegistryPath `
        -Name $ValueName `
        -ErrorAction SilentlyContinue

    if ($Value -eq 1) {
        Write-Output "AutoAcceptSsoPermission is enabled."
    }
    else {
        Write-Output "AutoAcceptSsoPermission is not enabled."
    }
}
else {
    Write-Output "The Windows AAD policy registry path does not exist."
}
{{< /card >}}

When everything is configured correctly, the result should be:

`AutoAcceptSsoPermission is enabled.`

Keep in mind that simply creating this registry value on an older Windows build does not add support for the feature. The device must also have a supported Windows 11 version and the required security updates installed.

---

## The result

After configuring `AutoAcceptSsoPermission`, supported managed Windows devices no longer require the user to manually accept the SSO permission for their Microsoft Entra ID account.

This results in a cleaner sign-in experience and is especially useful during automated device onboarding.

For example, when Company Portal automatically starts after an Autopilot deployment, the application can continue using the connected Windows account without stopping at the `Continue to sign in?` prompt first.

This small registry setting can therefore remove another manual step from the Windows Autopilot and Microsoft Intune onboarding experience.

---

## Summary

Microsoft introduced the `AutoAcceptSsoPermission` policy to give administrators control over the Windows `Continue to sign in?` SSO prompt on managed Windows devices.

The setting is pretty simple:

`HKLM\SOFTWARE\Policies\Microsoft\Windows\AAD\AutoAcceptSsoPermission = DWORD 1`

We can deploy this setting using Microsoft Intune, Group Policy or directly through the Windows Registry.

For Microsoft Intune environments I prefer deploying the setting using a device-context PowerShell script. For traditional Active Directory environments, Group Policy Preferences is an easy way to configure exactly the same registry value.

After applying the policy, supported managed Windows devices can automatically accept the SSO permission for Microsoft Entra ID accounts, making the sign-in and onboarding experience a little bit more seamless.

Thank you for reading this post and I hope it was helpful!

{{% alert title="Sources 📖" color="info" %}}
These sources helped me by writing and research for this post;

1. https://learn.microsoft.com/en-us/entra/identity/devices/sso-admin-control
2. https://learn.microsoft.com/en-us/intune/device-management/tools/run-powershell-scripts-windows
{{% /alert %}}

{{< ads >}}

{{< article-footer >}}