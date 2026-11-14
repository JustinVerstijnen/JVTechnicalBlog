---
title: "Disable Windows Taskbar Widgets through Intune"
date: 2025-11-06
slug: "disable-windows-taskbar-widgets-through-intune"
categories:
  - Microsoft Intune
tags:
  - Step by Step guides
description: "In this guide I will describe how to disable the Windows Taskbar Widgets using Microsoft Intune, Group Policy or Registry."
---

Today a relatively short guide on how to disable Windows Taskbar widgets through Intune, Group Policy or registry. I mean the part of the Windows 11 taskbar as shown in the image below:

[![jv-media-5551-0e5b331ce973.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/disable-windows-taskbar-widgets-through-intune-5551/jv-media-5551-0e5b331ce973.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/disable-windows-taskbar-widgets-through-intune-5551/jv-media-5551-0e5b331ce973.png)

Let's dive into one of the options to disable this option on scale, where you can use the option that meet your management tools and/or requirements.

---

## Option 1: Settings Catalog

The easiest way to disable these widgets is through a Settings Catalog policy. Open up Microsoft Intune admin center and create a new policy through the Settings Catalog.

Search for `widget` and these options are available:

- News and Interests: Disable Widgets on Lockscreen
- News and Interests: Disable Widgets Board
- Widgets: Allow Widgets

[![jv-media-5551-81938df80595.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/disable-windows-taskbar-widgets-through-intune-5551/jv-media-5551-81938df80595.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/disable-windows-taskbar-widgets-through-intune-5551/jv-media-5551-81938df80595.png)

In my case, I have set all three options to disabled/Not allowed.

After you have assigned this to the device, all Widgets options are gone and the user experience will be a bit better. The endpoint must restart to apply the changes.

---

## Option 2: Group Policy

If the Windows devices are managed through Active Directory, you can disable Widgets by using Group Policy. Open the Group Policy Management Console via `gpmc.msc` and create a new Group Policy Object or add the following configuration to an existing one that applies to the Windows devices. Navigate to:

`Computer Configuration -> Administrative Templates -> Windows Components -> Widgets`

Open the Allow widgets policy and configure it as `Disabled`. The apply and save the setting. You can refresh the computer policies at the client machine by running the following command from an elevated Command Prompt or PowerShell window:

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
gpupdate /force
{{< /card >}}

A restart is required to apply this change.

{{< ads >}}

---

## Option 3: Registry/PowerShell

You can achieve the settings also through PowerShell which does some registry changes. You can use this simple script:

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
$JVRegPath = "HKLM:\SOFTWARE\Policies\Microsoft\Dsh"

# Checking/creating path
If (!(Test-Path $JVRegPath)) {
    New-Item -Path $JVRegPath -Force | Out-Null
}

# 1. Disable Widgets Board
Set-ItemProperty -Path $JVRegPath -Name "AllowNewsAndInterests" -Type DWord -Value 0

# 2. Disable Widgets on Lock Screen
Set-ItemProperty -Path $JVRegPath -Name "AllowWidgetsOnLockscreen" -Type DWord -Value 0

# 3. Disable Widgets on Taskbar
Set-ItemProperty -Path $JVRegPath -Name "AllowWidgets" -Type DWord -Value 0

{{< /card >}}

This sets 3 registry keys to the desired setting. In this case disabling widgets on the taskbar and lockscreen.

[![jv-media-5551-dbc6f1861166.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/disable-windows-taskbar-widgets-through-intune-5551/jv-media-5551-dbc6f1861166.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/disable-windows-taskbar-widgets-through-intune-5551/jv-media-5551-dbc6f1861166.png)

After these keys are set, the computer must reboot to apply the changes.

---

## Summary

This short page explains 2 methods of disabling Widgets from the Windows Taskbar. This is something almost nobody uses and everyone dislikes.

Disabling this speeds up the device and enhances user experience.

Thank you for reading this guide and I hope it was helpful.

{{% alert title="Sources 📖" color="info" %}}
These sources helped me by writing and research for this post;
1. https://learn.microsoft.com/en-us/windows/client-management/mdm/policy-csp-newsandinterests
{{% /alert %}}

{{< ads >}}

{{< article-footer >}}
