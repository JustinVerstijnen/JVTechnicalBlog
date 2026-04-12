---
title: "Using and configuring Windows Backup for Organizations in Intune"
date: 2025-11-01
slug: "configure-windows-backup-for-organizations-in-intune"
categories:
  - Intune
tags:
  - Step by Step guides
description: >
  Microsoft just released a new feature, Windows Backup for Organizations, which is a revolution on top of the older Enterprise State Roaming.
---
Microsoft just released a new feature, Windows Backup for Organizations, which is a revolution on top of the older Enterprise State Roaming.

Windows Backup for Organizations will help you and your users by saving different components of your Windows installation to make a the proces of a new installation or computer much easier. Especially when used with Windows Autopilot, this is a great addition to the whole Windows/Intune ecosystem.

In this guide I will dive into how it works, what is backed up and excluded and how to configure and use it.

---

---

## Requirements

- Windows 11 [with the latest feature updates installed](https://learn.microsoft.com/en-us/windows/configuration/windows-backup/?tabs=intune#backup-requirements) for both creating and restoring backups
- Entra ID joined or Entra Hybrid joined device
- Microsoft Intune-capable license
- Around 15 minutes of your time

---

## What is Windows Backup for Organizations?

Windows Backup for Organizations is a feature where Windows creates a backup of your Windows settings and Windows Store applications every 8 days. This will be saved to your Microsoft business account. If ever having to re-install your device or to use a new device, you can easily restore your old configuration. This is a revolution on top of the older Enterprise State Roaming feature, who did around 20% of this.

---

## Enterprise State Roaming vs. Windows Backup for Organizations

Let's compare what is included in this new Windows Backup for Organizations feature versus Enterprise State Roaming

|  |  |  |
| --- | --- | --- |
| **Item** | **Windows Backup** **for Organizations** | **Enterprise State Roaming** |
| Windows Settings | ✅ | ✅ |
| Windows Personalization | ✅ | ❌ |
| Windows Store apps and data | ✅ | ❌ |
| Windows Desktop applications (Win32) | ❌ | ❌ |

---

## Step 1: Enable Windows Backup for Organizations

To configure this new and great setting, go to Microsoft Intune and create a new configuration policy for Windows devices:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/configure-windows-backup-for-organizations-in-intune-4926/jv-media-4926-356f5c27290c.png)

Then select Windows 10 and later, and the profile type "Settings catalog".

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/configure-windows-backup-for-organizations-in-intune-4926/jv-media-4926-7565b07545fc.png)

Then click on create. Give the policy a name and a good description for your own documentation.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/configure-windows-backup-for-organizations-in-intune-4926/jv-media-4926-0afd9aed7a77.png)

Click Next.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/configure-windows-backup-for-organizations-in-intune-4926/jv-media-4926-96bd918a4c3e.png)

On the "Configuration settings" tab, click on "+ Add settings". Navigate to this setting:

*Administrative Templates -> Windows Components -> Sync your settings*

Then lookup the setting-name: "Enable Windows Backup" and select it.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/configure-windows-backup-for-organizations-in-intune-4926/jv-media-4926-7de5f7fed5a9.png)

You can now enable the setting which will enable it on your device.

Then click "Next", assign the policy to your devices.

---

## Step 2: How to enable the restore of Windows Backup for Organizations

After enabling the the devices to make their back-up, we also need to configure that Windows shows automatically the older backups at the initial start (OOBE).

Head to Windows Devices -> Enrollment -> Windows Backup and Restore (preview)

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/configure-windows-backup-for-organizations-in-intune-4926/jv-media-4926-09fe9f14892e.png)

Select "On" to show the restore page. This will prompt the user (when an active backup is made) to restore their old configuration ath the Windows Out of the Box experience screen (OOBE)

Save the configuration to make this active.

---

## Client-side configuration

Users can also manually configure this new Backup in the Windows Settings:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/configure-windows-backup-for-organizations-in-intune-4926/jv-media-4926-6a51e24ace0f.png)

This is the overview after I have configured it in Intune and synced to my device. It automatically enabled the feature and should be ready to restore in case I'll do a reinstall of my computer.

---

## Restoring a backup (Step-by-step)

To restore the back-up made by Windows Backup for Organizations, let's install a second laptop (JV-LPT-002) with the latest Windows updates (25H2).

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/configure-windows-backup-for-organizations-in-intune-4926/jv-media-4926-e431ba6f8116.png)

Now I will login to Windows with the same account as I logged in to the first laptop (JV-LPT-001).

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/configure-windows-backup-for-organizations-in-intune-4926/jv-media-4926-0fda63498d22.png)

After succeeding the MFA challenge, Windows will process the changes and will get the additional information from our tenant.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/configure-windows-backup-for-organizations-in-intune-4926/jv-media-4926-f1ed2fb6d291.png)

Then Windows will present you the options to restore a previously made backup. To get a better picture, I have made a second backup on a VM.

Now I will select the backup from the first laptop and click "Continue".

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/configure-windows-backup-for-organizations-in-intune-4926/jv-media-4926-2b3eca55c5e2.png)

Now the backup will be restored.

---

## Result/after restoring backup

After the backup has been restored, this was the state on the laptop without any manual change. It synced the dark mode I configured, the installed Windows Store apps, the Windows taskbar to the left and my nice holiday picture. All without any manual action after restoring.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/configure-windows-backup-for-organizations-in-intune-4926/jv-media-4926-fd1f6406587c.png)

As you can see, installing an new computer is alot easier with this new feature. We can easily restore an this configuration and minimizes the configuration we need to do for our new computer or installation.

---

## Bonus: Create screenshots at Windows OOBE

The Windows Out of the Box experience screen is the first you'll see when going to a fresh Windows installation. We can take screenshots here but with a little difficult.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/configure-windows-backup-for-organizations-in-intune-4926/jv-media-4926-8d8d7f87f097.png)

You can do this by pressing Shift + F10 or Shift + Fn + F10. A cmd window will the open.

Type in PowerShell, and the use this command to take a screenshot:

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
Add-Type -AssemblyName System.Windows.Forms; Add-Type -AssemblyName System.Drawing; $width = 1920; $height = 1080; $bmp = New-Object Drawing.Bitmap($width, $height); $graphics = [Drawing.Graphics]::FromImage($bmp); $graphics.CopyFromScreen(0,0,0,0,$bmp.Size); $bmp.Save("C:\OOBE.png")
{{< /card >}}

Screenshots will be saved to C:\ to be backed-up after the OOBE flow.

---

## Summary

Windows Backup for Organizations is a great feature, especially for end users to keep their personal Windows Settings saved into their account. This in combination with OneDrive will make reinstalls pretty easy as we only have to install applications. The rest will be handled by Microsoft in this way.

### Sources

These sources helped me by writing and research for this post;

1. <https://learn.microsoft.com/en-us/intune/intune-service/enrollment/windows-backup-restore?tabs=backup>

---

## End of the page 🎉

You have reached the end of the page. You can select a category, share this post on X, LinkedIn and Reddit or return to the blog posts collection page. Thank you for visiting this post.

If you think something is wrong with this post or you want to know more, you can send me a message to one of my social profiles at: <https://justinverstijnen.nl/about/>

[Go back to Blog](https://justinverstijnen.nl/blog/)

If you find this page and blog very useful and you want to leave a donation, you can use the button below to buy me a beer. Thank you in advance and cheers :)

[![](https://img.buymeacoffee.com/button-api/?text=Buy me a beer&emoji=🍺&slug=justinverstijnen&button_colour=FFDD00&font_colour=000000&font_family=Arial&outline_colour=000000&coffee_colour=ffffff)](https://www.buymeacoffee.com/justinverstijnen)

[![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/about-66/jv-media-66-36a3c69c96cb.png)](https://buymeacoffee.com/justinverstijnen)

The [terms and conditions](https://justinverstijnen.nl/terms-conditions/) apply to this post.

Page visitors:
No page-counter data available yet.
