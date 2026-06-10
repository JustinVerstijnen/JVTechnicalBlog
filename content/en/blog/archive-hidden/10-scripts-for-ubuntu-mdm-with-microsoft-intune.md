---
title: "10 scripts for Ubuntu MDM with Microsoft Intune"
slug: "10-scripts-for-ubuntu-mdm-with-microsoft-intune"
date: 2026-06-18
tags:
- Step by Step guides
- Tools and Scripts
categories:
- Microsoft Intune
description: "In this post I will share 10 simple scripts for basic device administration tasks on Ubuntu endpoints."
hidden: false
---

## Adding a custom script to Microsoft Intune

As all 10 scripts of this post must be added in the same way, I will explain this once. The process is really simple.

Open up Microsoft Intune from [https://intune.microsoft.com](https://intune.microsoft.com) and navigate to "Devices", then to "Linux" and at last to "Scripts". Here click "+ Add" to add a new script.

[![jv-media-8512-cfa47a8b47fd.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/10-scripts-for-ubuntu-mdm-with-microsoft-intune/jv-media-8512-cfa47a8b47fd.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/10-scripts-for-ubuntu-mdm-with-microsoft-intune/jv-media-8512-cfa47a8b47fd.png)

Then fill in the details of your script for documentation in Microsoft Intune.

[![jv-media-8512-a5f1ed94e730.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/10-scripts-for-ubuntu-mdm-with-microsoft-intune/jv-media-8512-a5f1ed94e730.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/10-scripts-for-ubuntu-mdm-with-microsoft-intune/jv-media-8512-a5f1ed94e730.png)

On the "Configuration settings" tab, unfold the Linux Custom Configuration blade and configure this:

| Option | Set this |
| --- | --- |
| Execution context | Root |
| Execution frequency | Every 1 day |
| Execution retries | 3 times |
| Execution Script | Select the downloaded script here |

This must look similar to this, where you can change your settings depending on your situation of course:

[![jv-media-8512-3ef7b59beb1b.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/10-scripts-for-ubuntu-mdm-with-microsoft-intune/jv-media-8512-3ef7b59beb1b.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/10-scripts-for-ubuntu-mdm-with-microsoft-intune/jv-media-8512-3ef7b59beb1b.png)

Then advance to the "Assignments" tab and select your group containing the Linux endpoints:

[![jv-media-8512-816f88d80e55.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/10-scripts-for-ubuntu-mdm-with-microsoft-intune/jv-media-8512-816f88d80e55.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/10-scripts-for-ubuntu-mdm-with-microsoft-intune/jv-media-8512-816f88d80e55.png)

Then finish the assignment and the script will be executed at the endpoint at the first sync.

---

## The scripts

You can find the scripts I used in this guide here:

<a class="btn btn-primary" href="https://github.com/JustinVerstijnen/JV-Linux-DeviceManagement" target="_blank" rel="noreferrer">View on my GitHub page</a>

After some click-work, I have manually imported the scripts to Microsoft Intune and assigned them to my Ubuntu device:

[![jv-media-8512-ad694896e6f0.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/10-scripts-for-ubuntu-mdm-with-microsoft-intune/jv-media-8512-ad694896e6f0.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/10-scripts-for-ubuntu-mdm-with-microsoft-intune/jv-media-8512-ad694896e6f0.png)

---

## 1. Enable Ubuntu Firewall (UFW)

The first script will enable the Ubuntu Firewall. This because Ubuntu has by default the Ubuntu Firewall disabled:

[![jv-media-8512-291d9103c0dd.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/10-scripts-for-ubuntu-mdm-with-microsoft-intune/jv-media-8512-291d9103c0dd.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/10-scripts-for-ubuntu-mdm-with-microsoft-intune/jv-media-8512-291d9103c0dd.png)

Enabling the Firewall will block incoming connections that are not defined by a rule and keeps your device a bit more secure.

---

## 2. Deploy a Wi-Fi network

Deploying a Wi-Fi network is also something we often do with Microsoft Intune and generic MDM solutions. This speeds up the deployment and eliminates the need to spread keys into the organization.

You can set your own network:

- SSID (Network name): Line 17
- WPA-PSK (Network password): Line 18

The connection name on Line 19 is a displayname in Ubuntu which you can change if you want, but is not required for the script to work.

---

## 3. Deploy wallpaper

Deploying a wallpaper is also something we often to with Microsoft Intune. In this script, we set a Wallpaper URL which must be available to the device and sets it as desktop wallpeper by saving it locally. Updating the wallpaper server-side will also result in a wallpaper update on the endpoints, which is very nice.

You can change the wallpaper on Line 16 of the script.

---

## 4. Install Microsoft Defender for Endpoint

Securing Ubuntu devices is just as important as securing Microsoft Windows devices. This is why I included a script to install MIcrosoft Defender for Endpoint to use our existing security tools.

---

## 5. OneDrive

This script opens Microsoft OneDrive for a quick installation and access to personal and shared company files.

---

## 6. Configure homepage for Firefox

As Firefox is the default browser on Ubuntu, we can also configure a default homepage which we can set to a particular URL.

You can change this URL on Line 16 of this script.

---

## 7. Set color theme

We can also set the color theme of Ubuntu with this script. You must first select a Hex color in #FFFFFF format and paste it into this script and then upload it to Microsoft Intune.

This must be set on Line 16.

---

## 8. Configure screen timeout/lock

Something we often configure with Microsoft Intune is the screen timeout and locing options. After we walk away from the device and no input is done, the device will lock after 5 minutes, but can be changed in the script to your own value.

You can change this value in seconds on Line 15, where the default is 5 minutes, 300 seconds.

---

## 9. Enable Automatic Security Updates

This script will automatically install security updates on the device to enhance the device security. It only does security updates, no major upgrades or such.

---

## 10. Set Timezone/NTP

We can set the Timezone and NTP server with this script. This ensures the time/date is being synchronized with servers on the internet and minimizes the chance of causing problems in a time de-synchronization.

You can change the timezone on Line 16 of this script.

---

## Summary

### Sources

{{< ads >}}

{{< article-footer >}}