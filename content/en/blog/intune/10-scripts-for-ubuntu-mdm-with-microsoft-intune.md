---
title: "10 scripts for Ubuntu MDM with Microsoft Intune"
slug: "10-scripts-for-ubuntu-mdm-with-microsoft-intune"
date: 2025-06-18
tags:
- Step by Step guides
- Tools and Scripts
categories:
- Microsoft Intune
description: "In this post I will share 10 simple scripts for basic device administration tasks on Ubuntu endpoints."
hidden: false
---

Last week I described how to add Ubuntu endpoints to Microsoft Intune and to increase manageability for these devices. This guide can be found here: [https://justinverstijnen.nl/adding-ubuntu-endpoints-to-intune](https://justinverstijnen.nl/adding-ubuntu-endpoints-to-intune)

This guide is a sort of "part 2", for extra customization to Ubuntu endpoints which we can enroll with Microsoft Intune on top of what's already described in the first guide which can be used if needed.

---

## The scripts

You can find the scripts I used in this guide here on GitHub:

<a class="btn btn-primary" href="https://github.com/JustinVerstijnen/JV-Linux-DeviceManagement" target="_blank" rel="noreferrer">View on my GitHub page</a>

After some click-work, I have manually imported the scripts to Microsoft Intune and assigned them to my Ubuntu device:

[![jv-media-8512-e03e422db6b1.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/10-scripts-for-ubuntu-mdm-with-microsoft-intune/jv-media-8512-e03e422db6b1.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/10-scripts-for-ubuntu-mdm-with-microsoft-intune/jv-media-8512-e03e422db6b1.png)

---

## Adding a custom script to Microsoft Intune

As all 10 scripts of this post must be added in the exact same way, I will explain this once. The process is really simple.

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

Then upload the script after you made some adjustments which should appear in the text box below. This must look similar to this, where you can change your settings depending on your situation of course:

[![jv-media-8512-3ef7b59beb1b.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/10-scripts-for-ubuntu-mdm-with-microsoft-intune/jv-media-8512-3ef7b59beb1b.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/10-scripts-for-ubuntu-mdm-with-microsoft-intune/jv-media-8512-3ef7b59beb1b.png)

Then advance to the "Assignments" tab and select your group containing the Linux endpoints:

[![jv-media-8512-816f88d80e55.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/10-scripts-for-ubuntu-mdm-with-microsoft-intune/jv-media-8512-816f88d80e55.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/10-scripts-for-ubuntu-mdm-with-microsoft-intune/jv-media-8512-816f88d80e55.png)

Then finish the assignment and the script will be executed at the endpoint at the first sync.

---

## Changing script settings

The scripts which have custom settings can be configured at the top. There you have some variables you can set to your own needs:

[![jv-media-8512-9412153084fe.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/10-scripts-for-ubuntu-mdm-with-microsoft-intune/jv-media-8512-9412153084fe.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/10-scripts-for-ubuntu-mdm-with-microsoft-intune/jv-media-8512-9412153084fe.png)

Download the script, then change them in your favorite text-editor and then upload them to Microsoft Intune and you will be ready to go.

---

## 1. Enable Ubuntu Firewall (UFW)

The first script will enable the Ubuntu Firewall. This because Ubuntu has the Ubuntu Firewall disabled by default:

[![jv-media-8512-291d9103c0dd.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/10-scripts-for-ubuntu-mdm-with-microsoft-intune/jv-media-8512-291d9103c0dd.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/10-scripts-for-ubuntu-mdm-with-microsoft-intune/jv-media-8512-291d9103c0dd.png)

Enabling the Firewall will block incoming connections that are not defined by a rule and keeps your device a bit more secure. After the script has ran to enable the firewall, this will be enabled automatically with no need for manual configuration:

[![jv-media-8512-4316e53c4051.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/10-scripts-for-ubuntu-mdm-with-microsoft-intune/jv-media-8512-4316e53c4051.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/10-scripts-for-ubuntu-mdm-with-microsoft-intune/jv-media-8512-4316e53c4051.png)

As you can see, the status is now "active".

---

## 2. Deploy a Wi-Fi network

Deploying a Wi-Fi network is also something we often do with Microsoft Intune and generic MDM solutions. This speeds up the deployment and eliminates the need to spread keys into the organization.

You can set your own network:

- SSID (Network name): Line 17
- WPA-PSK (Network password): Line 18

[![jv-media-8512-c98a94626aeb.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/10-scripts-for-ubuntu-mdm-with-microsoft-intune/jv-media-8512-c98a94626aeb.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/10-scripts-for-ubuntu-mdm-with-microsoft-intune/jv-media-8512-c98a94626aeb.png)

The connection name on Line 19 is a display name in Ubuntu which you can change if you want, but is not required for the script to work. You could upload this script to Microsoft Intune multiple times if using multiple networks.

[![jv-media-8512-0057c413c807.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/10-scripts-for-ubuntu-mdm-with-microsoft-intune/jv-media-8512-0057c413c807.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/10-scripts-for-ubuntu-mdm-with-microsoft-intune/jv-media-8512-0057c413c807.png)

---

## 3. Deploy wallpaper

Deploying a wallpaper is also something we often to with Microsoft Intune. In this script, we set a Wallpaper URL which must be available to the device and sets it as desktop wallpeper by saving it locally. Updating the wallpaper server-side will also result in a wallpaper update on the endpoints, which is very nice.

You can change the wallpaper on Line 16 of the script.

[![jv-media-8512-9412153084fe.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/10-scripts-for-ubuntu-mdm-with-microsoft-intune/jv-media-8512-9412153084fe.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/10-scripts-for-ubuntu-mdm-with-microsoft-intune/jv-media-8512-9412153084fe.png)

---

## 4. Install PowerShell 7

It is also possible to install PowerShell 7 from the Ubuntu App Center with a script, which can also be used to install any application from there.

[![jv-media-8512-b2e78ee12652.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/10-scripts-for-ubuntu-mdm-with-microsoft-intune/jv-media-8512-b2e78ee12652.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/10-scripts-for-ubuntu-mdm-with-microsoft-intune/jv-media-8512-b2e78ee12652.png)

This way you can also run PowerShell modules and scripts to manage cloud services.

---

## 5. GNOME Privacy Settings

This script has various settings for the GNOME Desktop Environment which can be set. I also have a table for you on what options are available:

| Options | Default value | Supported values | Notes |
| --- | --- | --- | --- |
| DISABLELOCATIONSERVICES | `true` | `true`, `false` | Uses the GNOME location setting where available. Some apps may behave differently depending on desktop environment and installed services |
| DISABLERECENTFILE_HISTORY | `true` | `true`, `false` | GNOME exposes file history controls in Privacy & Security settings |
| CLEAREXISTINGRECENTFILEHISTORY | `true` | `true`, `false` | This removes the existing `recently-used.xbel` file where present |
| DISABLELOCKSCREEN_NOTIFICATIONS | `true` | `true`, `false` | Ubuntu documents this as the dconf key `/org/gnome/desktop/notifications/show-in-lock-screen` |
| REMOVEOLDTEMP_FILES | `true` | `true`, `false` | Uses GNOME privacy settings where available |
| REMOVEOLDTRASH_FILES | `true` | `true`, `false` | Uses GNOME privacy settings where available |
| OLDFILESAGE_DAYS | `30` | Number of days, for example `7`, `14`, `30` | Only relevant when old temp or trash cleanup is enabled |
| LOCKPRIVACYSETTINGS | `false` | `true`, `false` | Useful for strict policy enforcement. Leave disabled for a softer baseline |
| APPLYTOACTIVE_USERS | `true` | `true`, `false` | If no GNOME session is active, system defaults still apply on next login |

The settings can be set on the start of the script, at line 4 to 12.

---

## 6. Configure homepage for Firefox

As Firefox is the default browser on Ubuntu, we can also configure a default homepage which we can set to a particular URL.

[![jv-media-8512-0699e2fa647b.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/10-scripts-for-ubuntu-mdm-with-microsoft-intune/jv-media-8512-0699e2fa647b.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/10-scripts-for-ubuntu-mdm-with-microsoft-intune/jv-media-8512-0699e2fa647b.png)

You can change this URL on Line 16 of this script.

[![jv-media-8512-2facf3f453a7.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/10-scripts-for-ubuntu-mdm-with-microsoft-intune/jv-media-8512-2facf3f453a7.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/10-scripts-for-ubuntu-mdm-with-microsoft-intune/jv-media-8512-2facf3f453a7.png)

---

## 7. Set color theme

We can also set the color theme of Ubuntu with this script. You must first select a Hex color in #FFFFFF format and paste it into this script and then upload it to Microsoft Intune.

[![jv-media-8512-d5d2c8232e71.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/10-scripts-for-ubuntu-mdm-with-microsoft-intune/jv-media-8512-d5d2c8232e71.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/10-scripts-for-ubuntu-mdm-with-microsoft-intune/jv-media-8512-d5d2c8232e71.png)

This must be set on Line 4, where you can select one of these options:

- Blue
- Teal
- Green
- Yellow
- Orange
- Red
- Pink
- Purple
- Slate

[![jv-media-8512-c0ed9ab896b1.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/10-scripts-for-ubuntu-mdm-with-microsoft-intune/jv-media-8512-c0ed9ab896b1.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/10-scripts-for-ubuntu-mdm-with-microsoft-intune/jv-media-8512-c0ed9ab896b1.png)

---

## 8. Configure screen timeout/lock

Something we often configure with Microsoft Intune is the screen timeout and locing options. After we walk away from the device and no input is done, the device will lock after 5 minutes, but can be changed in the script to your own value.

You can change this value in seconds on Line 15, where the default is 5 minutes, 300 seconds.

[![jv-media-8512-7cab8eab47de.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/10-scripts-for-ubuntu-mdm-with-microsoft-intune/jv-media-8512-7cab8eab47de.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/10-scripts-for-ubuntu-mdm-with-microsoft-intune/jv-media-8512-7cab8eab47de.png)

For demonstration purposes, I have set the time-out to 8 minutes as 5 minutes was the default option.

---

## 9. Enable Automatic Security Updates

This script enables automatic security updates on an Ubuntu device. It installs unattended-upgrades, configures the system to check for package updates daily, and automatically installs security-related updates. It also removes unused dependencies and writes the output to a log file for troubleshooting. Automatic reboot is disabled to prevent unexpected restarts, but a reboot time is already prepared in case this is enabled later.

---

## 10. Set Timezone/NTP

We can set the Timezone and NTP server with this script. This ensures the time/date is being synchronized with servers on the internet and minimizes the chance of causing problems in a time de-synchronization.

You can change the timezone on Line 16 of this script.

[![jv-media-8512-90f30d35ed12.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/10-scripts-for-ubuntu-mdm-with-microsoft-intune/jv-media-8512-90f30d35ed12.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/10-scripts-for-ubuntu-mdm-with-microsoft-intune/jv-media-8512-90f30d35ed12.png)

---

## Troubleshooting

All scripts will write a log file to the /var/log folder. All scripts are tested and working on Ubuntu 26.04, but may this give errors on your end, you can review the logs to check what errors are there.

- /var/log

You can use the two built-in Ubuntu/Linux commands to review the contents:

- cat *filename.log (read)
- nano *filename.log (read/edit)

[![jv-media-8512-1f6787148130.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/10-scripts-for-ubuntu-mdm-with-microsoft-intune/jv-media-8512-1f6787148130.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/10-scripts-for-ubuntu-mdm-with-microsoft-intune/jv-media-8512-1f6787148130.png)

---

## Downsides of Linux devices in Microsoft Intune

One of the downsides I find with Ubuntu devices in Intune is that everything must be confirmed by the user itself by typing in their password. When new scripts are uploaded and assigned, you get this window:

[![jv-media-8512-7303a1af5261.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/10-scripts-for-ubuntu-mdm-with-microsoft-intune/jv-media-8512-7303a1af5261.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/10-scripts-for-ubuntu-mdm-with-microsoft-intune/jv-media-8512-7303a1af5261.png)

Not a very big problem, but not like how device management works on Windows devices. There we can update policies and install applications without user interaction.

Another downside is that management is very limited. We cannot wipe devices from the portal and support is limited to Ubuntu only. Most people who use Linux distributions do not only use Ubuntu, but want more customization with other distro's, but there is not support for them yet.

### Sources

These sources helped me by writing and research for this post;

1. [https://learn.microsoft.com/en-us/intune/device-security/compliance/custom-settings](https://learn.microsoft.com/en-us/intune/device-security/compliance/custom-settings)
2. [https://learn.microsoft.com/en-us/intune/user-help/enrollment/enroll-linux](https://learn.microsoft.com/en-us/intune/user-help/enrollment/enroll-linux)
3. [https://learn.microsoft.com/en-us/intune/user-help/enrollment/enroll-linux#system-requirements](https://learn.microsoft.com/en-us/intune/user-help/enrollment/enroll-linux#system-requirements)

{{< ads >}}

{{< article-footer >}}