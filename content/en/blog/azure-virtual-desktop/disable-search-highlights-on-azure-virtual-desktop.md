---
title: "Disable Search Highlights on Azure Virtual Desktop"
slug: "disable-search-highlights-azure-virtual-desktop"
date: 2025-09-26
tags:
- Step by Step Guides
categories:
- Azure Virtual Desktop
description: "In this post, I will show you how to disable Windows Search Highlights on Windows 365 Cloud PCs and Azure Virtual Desktop session hosts using Microsoft Intune or Group Policy."
hidden: false
---

## What are Search Highlights?

Search Highlights is a Windows feature that can show additional dynamic content inside Windows Search, for example information about special days, events and other highlighted content. You can normally see this in Windows 11 when opening Windows Search or clicking inside the Search box.

[![jv-media-8533-b9fcc625f69f.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/disable-search-highlights-azure-virtual-desktop/jv-media-8533-b9fcc625f69f.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/disable-search-highlights-azure-virtual-desktop/jv-media-8533-b9fcc625f69f.png)

On a personal computer, we can discuss if this is a nice feature, but on Windows 365 Cloud PCs and Azure Virtual Desktop session hosts I personally prefer a cleaner Search experience without all the additional content. Disabling such features saves some critical performance for users. Especially on Azure Virtual Desktop with pooled (shared) machines.

Microsoft gives us a policy called `Allow search highlights` which can be used to centrally control this feature.

In this post, I will show you how to disable Search Highlights using both Microsoft Intune and Group Policy, so you can use the method which fits your environment.

---

## Why disable Search Highlights?

There can be multiple reasons why you don't want to use Search Highlights on managed Windows devices.

The most important ones for me are:

- A cleaner and more business-focused Windows Search experience
- Less unnecessary dynamic content inside virtual desktops, taking up compute power and resulting in less performance
- Centrally controlling the Search experience instead of depending on every user's personal setting

Especially in shared Azure Virtual Desktop environments, I like keeping the Windows interface as clean as possible. Search Highlights is not required for normal Windows Search functionality. Disabling the feature only removes the Search Highlights experience and does not disable Windows Search itself.

We can configure this setting using Microsoft Intune or traditional Group Policy.

{{< ads >}}

---

## Option 1: Configure with Microsoft Intune

Let's start with Microsoft Intune. Open the Microsoft Intune admin center at `https://intune.microsoft.com`.

Then navigate to `Devices`, then `Windows` and open up `Configuration`.

From here, create a new policy by clicking `+ Create`.

[![jv-media-8533-7e054f0a094d.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/disable-search-highlights-azure-virtual-desktop/jv-media-8533-7e054f0a094d.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/disable-search-highlights-azure-virtual-desktop/jv-media-8533-7e054f0a094d.png)

Here use the Windows 10 or later platform and use the `Settings catalog` type.

[![jv-media-8533-0f103a444e3d.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/disable-search-highlights-azure-virtual-desktop/jv-media-8533-0f103a444e3d.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/disable-search-highlights-azure-virtual-desktop/jv-media-8533-0f103a444e3d.png)

Click `Create`.

[![jv-media-8533-e201f94cff96.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/disable-search-highlights-azure-virtual-desktop/jv-media-8533-e201f94cff96.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/disable-search-highlights-azure-virtual-desktop/jv-media-8533-e201f94cff96.png)

Give the policy a descriptive name and description and click Next. Then continue to `Configuration settings`, the next tab.

Click `+ Add settings`. and search for:

- Allow search highlights

[![jv-media-8533-35fe99654548.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/disable-search-highlights-azure-virtual-desktop/jv-media-8533-35fe99654548.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/disable-search-highlights-azure-virtual-desktop/jv-media-8533-35fe99654548.png)

From the right, select the `Allow Search Highlights` setting and on the left disable this by setting a `0` like I did.

- 0 means Disabled, Search Highlights are disabled in the Windows Start Menu
- 1 means Enabled, Search Highlights are enabled in the Windows Start Menu

Little bit dissapointing Microsoft did not made an easy switch which makes this more clear such as other settings but no big deal. The technical reason behind this is that Microsoft uses the following CSP setting behind this configuration:

```
./Device/Vendor/MSFT/Policy/Config/Search/AllowSearchHighlights
```

The value used for disabling Search Highlights is actually `0`.

Continue to the `Assignments` tab. Assign the policy to the device group containing your Windows 365 Cloud PCs or Azure Virtual Desktop session hosts.

[![jv-media-8533-abe41eb73d72.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/disable-search-highlights-azure-virtual-desktop/jv-media-8533-abe41eb73d72.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/disable-search-highlights-azure-virtual-desktop/jv-media-8533-abe41eb73d72.png)

Because this is a device policy, I recommend assigning it to the device group containing the computers where you want Search Highlights disabled. Continue through the wizard and create the configuration profile.

Intune will now deploy the configuration to the targeted devices during the next policy synchronization. They may need a re-login or reboot to actually apply these settings.

---

## Option 2: Configure with Group Policy

If your Azure Virtual Desktop session hosts or Windows devices are managed through Active Directory, we can configure exactly the same setting using Group Policy.

Open the Group Policy Management Console (`gpmc.msc`) on your Active Directory management server. Create a new Group Policy Object or re-use an existing policy where you configure your Windows user experience settings.

Navigate to:

`Computer Configuration > Policies > Administrative Templates > Windows Components > Search`

[![jv-media-8533-7832c1d10a3d.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/disable-search-highlights-azure-virtual-desktop/jv-media-8533-7832c1d10a3d.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/disable-search-highlights-azure-virtual-desktop/jv-media-8533-7832c1d10a3d.png)

Inside this folder, you can find the `Allow search highlights` policy setting which you can set to `Disabled` to get rid of the highlights from your search window.

Then click Apply and OK. Computers may need a re-login or reboot for the policy change to take effect.

---

## Option 3: Configure through Registry

You may not want to do this, but you can also configure this setting through Registry, so you know which key is altered with the Intune or Group Policy change.

{{< card code=true header="**PowerShell**" lang="powershell" >}}
reg.exe add "HKLM\SOFTWARE\Policies\Microsoft\Windows\Windows Search" /v "EnableDynamicContentInWSB" /t REG_DWORD /d 0 /f
{{< /card >}}

This is also a useful troubleshooting step if the configuration has been deployed but Search Highlights still seems to be visible. For deployment over multiple machine, I recommend using Intune or Group Policy.

---

## The results

After applying these changes and a computer reboot, the search menu looks like this. All cleaned up and snappy:

[![jv-media-8533-4ac7ecc13ef8.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/disable-search-highlights-azure-virtual-desktop/jv-media-8533-4ac7ecc13ef8.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/disable-search-highlights-azure-virtual-desktop/jv-media-8533-4ac7ecc13ef8.png)

We are not being distracted by non-work things as "World Tourism Day" or the best recipes for "Beef Stroganoff". But only files and applications we care about are being shown.

---

## Summary

Search Highlights adds dynamic content to Windows Search. This can be useful on personal computers, but on Windows 365 Cloud PCs and Azure Virtual Desktop session hosts I prefer a cleaner and more consistent Search experience and saving performance for the users.

Microsoft gives us the Allow search highlights policy to centrally manage this feature. Allow search highlights = Disabled.

Thank you for reading this post and I hope it was helpful!

{{% alert title="Sources 📖" color="info" %}}
These sources helped me by writing and research for this post;

1. https://learn.microsoft.com/en-us/windows/client-management/mdm/policy-csp-search
2. https://techcommunity.microsoft.com/blog/windows-itpro-blog/group-configuration-search-highlights-in-windows/3263989
{{% /alert %}}

{{< ads >}}

{{< article-footer >}}
