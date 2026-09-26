---
title: "Disable Search Highlights on Azure Virtual Desktop"
slug: "disable-search-highlights-azure-virtual-desktop"
date: 2026-09-26
tags:
- Step by Step Guides
categories:
- Azure Virtual Desktop
description: "In this post, I will show you how to disable Windows Search Highlights on Windows 365 Cloud PCs and Azure Virtual Desktop session hosts using Microsoft Intune or Group Policy."
hidden: false
---

## What are Search Highlights?

Search Highlights is a Windows feature that can show additional dynamic content inside Windows Search, for example information about special days, events and other highlighted content.

You can normally see this when opening Windows Search or clicking inside the Search box.

<!-- Screenshot: Windows Search with Search Highlights enabled -->

On a personal computer this can be a nice feature, but on Windows 365 Cloud PCs and Azure Virtual Desktop session hosts I personally prefer a cleaner Search experience without all the additional content.

Microsoft gives us a policy called **Allow search highlights** which can be used to centrally control this feature.

In this post, I will show you how to disable Search Highlights using both Microsoft Intune and Group Policy, so you can use the method which fits your environment.

**In simple words:**

| Policy state | Result |
| --- | --- |
| Enabled | Search Highlights are enabled |
| Disabled | Search Highlights are disabled |
| Not configured | Search Highlights are enabled by default |

We will configure the policy as **Disabled**.

---

## Why disable Search Highlights?

There can be multiple reasons why you don't want to use Search Highlights on managed Windows devices.

The most important ones for me are:

- A cleaner and more business-focused Windows Search experience
- Less unnecessary dynamic content inside virtual desktops
- A more consistent user experience between different session hosts
- Centrally controlling the Search experience instead of depending on every user's personal setting

Especially in shared Azure Virtual Desktop environments, I like keeping the Windows interface as clean as possible.

Search Highlights is not required for normal Windows Search functionality. Disabling the feature only removes the Search Highlights experience and does not disable Windows Search itself.

We can configure this setting using Microsoft Intune or traditional Group Policy.

---

## Requirements

Depending on which method you want to use, you need:

- Windows 10 or Windows 11
- Microsoft Intune enrollment for the Intune method
- An Active Directory environment for the Group Policy method
- Permissions to create configuration profiles or Group Policies
- Windows 365 Cloud PCs or Azure Virtual Desktop session hosts you want to configure

Microsoft documents **Allow search highlights** as a device policy, so in this guide we will target our Windows devices instead of individual users.

---

## Option 1: Configure with Microsoft Intune

Let's start with Microsoft Intune.

Open the Microsoft Intune admin center:

https://intune.microsoft.com

Head to:

```text
Devices
└── Windows
    └── Configuration
```

From here, create a new policy.

<!-- Screenshot: Intune Windows Configuration -->

Use the following configuration:

| Setting | Value |
| --- | --- |
| Platform | Windows 10 and later |
| Profile type | Settings catalog |

Click **Create**.

<!-- Screenshot: Create Settings Catalog profile -->

Give the policy a descriptive name.

For example:

```text
Disable Search Highlights
```

You can also add a description such as:

```text
Disables Windows Search Highlights on managed Windows devices.
```

Then continue to **Configuration settings**.

---

## Adding the Search Highlights setting

Click **+ Add settings**.

Search for:

```text
Allow search highlights
```

<!-- Screenshot: Search for Allow search highlights -->

The configuration can be found under the **Search** category.

Select:

```text
Search
└── Allow search highlights
```

Add the setting to the policy.

<!-- Screenshot: Allow Search Highlights selected -->

Set **Allow search highlights** to:

```text
Disabled
```

This might sound a little confusing at first because we are disabling a setting called **Allow search highlights**.

But this is exactly what we want:

```text
Allow search highlights = Disabled
```

which means:

```text
Search Highlights = Disabled
```

Microsoft uses the following CSP setting behind this configuration:

```text
./Device/Vendor/MSFT/Policy/Config/Search/AllowSearchHighlights
```

The value used for disabling Search Highlights is:

```text
0
```

---

## Assigning the Intune policy

Continue to the **Assignments** tab.

Assign the policy to the device group containing your Windows 365 Cloud PCs or Azure Virtual Desktop session hosts.

<!-- Screenshot: Intune Assignments -->

Because this is a device policy, I recommend assigning it to the device group containing the computers where you want Search Highlights disabled.

For Azure Virtual Desktop, this could for example be a group containing all your session hosts.

For Windows 365, this could be a group containing your Cloud PCs.

Continue through the wizard and create the configuration profile.

Intune will now deploy the configuration to the targeted devices during the next policy synchronization.

---

## Checking the Intune result

After the policy has been applied, log in to one of your Windows 365 Cloud PCs or Azure Virtual Desktop session hosts.

Open Windows Search.

<!-- Screenshot: Search Highlights disabled -->

The additional Search Highlights content should now be removed from Windows Search.

You can also check the deployment status from Microsoft Intune.

Open the configuration profile we created and check the **Device and user check-in status**.

<!-- Screenshot: Intune policy succeeded -->

The targeted device should eventually report the configuration as successfully applied.

If the Search interface was already open during the policy change, close it and open it again. Signing out and back in can also help refresh the Windows interface after changing this configuration.

---

## Option 2: Configure with Group Policy

If your Azure Virtual Desktop session hosts or Windows devices are managed through Active Directory, we can configure exactly the same setting using Group Policy.

Open the **Group Policy Management Console** on your management server:

```text
gpmc.msc
```

<!-- Screenshot: Group Policy Management Console -->

Create a new Group Policy Object or use an existing policy where you configure your Windows user experience settings.

For this demonstration, I will create a policy called:

```text
Disable Search Highlights
```

Edit the policy.

Navigate to:

```text
Computer Configuration
└── Policies
    └── Administrative Templates
        └── Windows Components
            └── Search
```

<!-- Screenshot: Group Policy Search folder -->

Inside this folder, find:

```text
Allow search highlights
```

Open the policy.

<!-- Screenshot: Allow search highlights policy -->

Configure the policy as:

```text
Disabled
```

Then click **Apply** and **OK**.

This will disable Search Highlights for computers receiving this Group Policy.

---

## What if the Group Policy setting is missing?

The **Allow search highlights** policy is stored inside the Windows `Search.admx` Administrative Template.

If you are using an Active Directory Group Policy Central Store and you cannot find the setting, check if the Administrative Templates inside your Central Store are up to date.

The relevant ADMX file is:

```text
Search.admx
```

The matching language file for an English Central Store is located in the language folder and is normally:

```text
en-US\Search.adml
```

For my Active Directory domain, the Central Store is located here:

```text
\\internal.justinverstijnen.nl\SYSVOL\internal.justinverstijnen.nl\Policies\PolicyDefinitions
```

So the files would normally exist here:

```text
\\internal.justinverstijnen.nl\SYSVOL\internal.justinverstijnen.nl\Policies\PolicyDefinitions\Search.admx
```

and:

```text
\\internal.justinverstijnen.nl\SYSVOL\internal.justinverstijnen.nl\Policies\PolicyDefinitions\en-US\Search.adml
```

If the setting is missing, you may need to update these Administrative Templates.

Do not just replace one file without checking its dependencies and matching language file. I recommend updating the templates using the same method as described in my Group Policy Central Store guide.

---

## Assigning the Group Policy

Now we need to apply the Group Policy to our computers.

Link the policy to the Organizational Unit containing your Azure Virtual Desktop session hosts or other Windows computers.

For example:

```text
internal.justinverstijnen.nl
└── Servers
    └── Azure Virtual Desktop
```

<!-- Screenshot: GPO linked to AVD OU -->

After linking the policy, Windows will process it during the normal Group Policy refresh.

For testing purposes, you can force a Group Policy refresh on a session host.

Open PowerShell or Command Prompt as Administrator and run:

{{< card code=true header="**PowerShell**" lang="powershell" >}}
gpupdate /force
{{< /card >}}

<!-- Screenshot: gpupdate successful -->

After the policy has been applied, sign out and sign back in if Search Highlights is still visible in the existing session.

---

## Checking the configured policy

Microsoft maps the **Allow search highlights** policy to the following registry location:

```text
HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\Windows\Windows Search
```

The registry value is:

```text
EnableDynamicContentInWSB
```

When Search Highlights is disabled, the value should be:

```text
0
```

We can easily check this with PowerShell:

{{< card code=true header="**PowerShell**" lang="powershell" >}}
Get-ItemProperty `
    -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\Windows Search" `
    -Name "EnableDynamicContentInWSB"
{{< /card >}}

If the policy has been applied successfully, the output should show:

```text
EnableDynamicContentInWSB : 0
```

<!-- Screenshot: PowerShell registry check -->

This is also a useful troubleshooting step if the configuration has been deployed but Search Highlights still seems to be visible.

---

## Intune vs Group Policy

Both configuration methods ultimately control the same Windows functionality.

The method you choose mainly depends on how your devices are managed.

| Environment | Method |
| --- | --- |
| Intune managed Windows 365 Cloud PCs | Microsoft Intune |
| Intune managed Azure Virtual Desktop | Microsoft Intune |
| Active Directory joined Azure Virtual Desktop | Group Policy |
| Traditional Active Directory computers | Group Policy |
| Hybrid environment | Intune or Group Policy |

I would not configure the same setting through both solutions unless there is a specific reason to do this.

Keeping ownership of a setting inside one management solution makes troubleshooting much easier later.

{{< ads >}}

---

## Summary

Search Highlights adds dynamic content to Windows Search. This can be useful on personal computers, but on Windows 365 Cloud PCs and Azure Virtual Desktop session hosts I prefer a cleaner and more consistent Search experience.

Microsoft gives us the **Allow search highlights** policy to centrally manage this feature.

With Microsoft Intune, we configured:

```text
Search
└── Allow search highlights = Disabled
```

With Group Policy, we configured:

```text
Computer Configuration
└── Policies
    └── Administrative Templates
        └── Windows Components
            └── Search
                └── Allow search highlights = Disabled
```

Both methods disable the Search Highlights experience while keeping normal Windows Search functionality available.

For Group Policy environments, keep in mind that the setting depends on the `Search.admx` Administrative Template. If the setting is not available, check the Administrative Templates in your Group Policy Central Store.

Thank you for reading this post and I hope it was helpful!

{{% alert title="Sources 📖" color="info" %}}
These sources helped me by writing and research for this post;

1. https://learn.microsoft.com/en-us/windows/client-management/mdm/policy-csp-search
2. https://techcommunity.microsoft.com/blog/windows-itpro-blog/group-configuration-search-highlights-in-windows/3263989
{{% /alert %}}

{{< ads >}}

{{< article-footer >}}