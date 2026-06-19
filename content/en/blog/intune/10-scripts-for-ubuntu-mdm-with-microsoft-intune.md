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

Last week I described how to add Ubuntu endpoints to Microsoft Intune and improve their manageability. This guide can be found here: [https://justinverstijnen.nl/adding-ubuntu-endpoints-to-intune](https://justinverstijnen.nl/adding-ubuntu-endpoints-to-intune)

This guide is a sort of "Part 2" and covers additional customization options for Ubuntu endpoints enrolled in Microsoft Intune, building on the configuration described in the first guide.

---

## The scripts

You can find the scripts I used in this guide here on GitHub:

<a class="btn btn-primary" href="https://github.com/JustinVerstijnen/JV-Linux-DeviceManagement" target="_blank" rel="noreferrer">View on my GitHub page</a>

After a few clicks, I manually imported the scripts into Microsoft Intune and assigned them to my Ubuntu device:

[![jv-media-8512-e03e422db6b1.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/10-scripts-for-ubuntu-mdm-with-microsoft-intune/jv-media-8512-e03e422db6b1.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/10-scripts-for-ubuntu-mdm-with-microsoft-intune/jv-media-8512-e03e422db6b1.png)

---

## Adding a custom script to Microsoft Intune

As all 10 scripts in this post must be added in exactly the same way, I will explain the process once. The process is really simple.

Open Microsoft Intune at [https://intune.microsoft.com](https://intune.microsoft.com) and navigate to "Devices", then to "Linux", and finally to "Scripts". Here, click "+ Add" to add a new script.

[![jv-media-8512-cfa47a8b47fd.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/10-scripts-for-ubuntu-mdm-with-microsoft-intune/jv-media-8512-cfa47a8b47fd.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/10-scripts-for-ubuntu-mdm-with-microsoft-intune/jv-media-8512-cfa47a8b47fd.png)

Then fill in the details of your script for documentation purposes in Microsoft Intune.

[![jv-media-8512-a5f1ed94e730.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/10-scripts-for-ubuntu-mdm-with-microsoft-intune/jv-media-8512-a5f1ed94e730.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/10-scripts-for-ubuntu-mdm-with-microsoft-intune/jv-media-8512-a5f1ed94e730.png)

On the "Configuration settings" tab, expand the Linux Custom Configuration blade and configure the following:

| Option | Set this |
| --- | --- |
| Execution context | Root |
| Execution frequency | Every 1 day |
| Execution retries | 3 times |

Then upload the script after making any necessary adjustments. It should appear in the text box below. It should look similar to this, although you can change the settings depending on your situation, of course:

[![jv-media-8512-3ef7b59beb1b.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/10-scripts-for-ubuntu-mdm-with-microsoft-intune/jv-media-8512-3ef7b59beb1b.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/10-scripts-for-ubuntu-mdm-with-microsoft-intune/jv-media-8512-3ef7b59beb1b.png)

Then advance to the "Assignments" tab and select your group containing the Linux endpoints:

[![jv-media-8512-816f88d80e55.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/10-scripts-for-ubuntu-mdm-with-microsoft-intune/jv-media-8512-816f88d80e55.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/10-scripts-for-ubuntu-mdm-with-microsoft-intune/jv-media-8512-816f88d80e55.png)

Then finish the assignment, and the script will be executed on the endpoint during the first sync.

---

## Changing script settings

The scripts that have custom settings can be configured at the top. There, you will find several variables that you can adjust to your needs:

[![jv-media-8512-9412153084fe.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/10-scripts-for-ubuntu-mdm-with-microsoft-intune/jv-media-8512-9412153084fe.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/10-scripts-for-ubuntu-mdm-with-microsoft-intune/jv-media-8512-9412153084fe.png)

Download the script, change the variables in your favorite text editor, and then upload it to Microsoft Intune. You will then be ready to go.

---

## 1. Enable Ubuntu Firewall (UFW)

The first script will enable the Ubuntu firewall. This is because Ubuntu has the firewall disabled by default:

[![jv-media-8512-291d9103c0dd.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/10-scripts-for-ubuntu-mdm-with-microsoft-intune/jv-media-8512-291d9103c0dd.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/10-scripts-for-ubuntu-mdm-with-microsoft-intune/jv-media-8512-291d9103c0dd.png)

Enabling the firewall will block incoming connections that are not defined by a rule and keep your device a bit more secure. After the script has run to enable the firewall, it will be enabled automatically with no need for manual configuration:

[![jv-media-8512-4316e53c4051.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/10-scripts-for-ubuntu-mdm-with-microsoft-intune/jv-media-8512-4316e53c4051.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/10-scripts-for-ubuntu-mdm-with-microsoft-intune/jv-media-8512-4316e53c4051.png)

As you can see, the status is now "active".

---

## 2. Deploy a Wi-Fi network

Deploying a Wi-Fi network is also something we often do with Microsoft Intune and generic MDM solutions. This speeds up deployment and eliminates the need to distribute keys throughout the organization.

You can set your own network:

- SSID (Network name): Line 17
- WPA-PSK (Network password): Line 18

[![jv-media-8512-c98a94626aeb.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/10-scripts-for-ubuntu-mdm-with-microsoft-intune/jv-media-8512-c98a94626aeb.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/10-scripts-for-ubuntu-mdm-with-microsoft-intune/jv-media-8512-c98a94626aeb.png)

The connection name on Line 19 is a display name in Ubuntu that you can change if you want, but it is not required for the script to work. You could upload this script to Microsoft Intune multiple times when using multiple networks.

[![jv-media-8512-0057c413c807.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/10-scripts-for-ubuntu-mdm-with-microsoft-intune/jv-media-8512-0057c413c807.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/10-scripts-for-ubuntu-mdm-with-microsoft-intune/jv-media-8512-0057c413c807.png)

---

## 3. Deploy wallpaper

Deploying a wallpaper is also something we often do with Microsoft Intune. In this script, we set a wallpaper URL that must be accessible to the device and configure it as the desktop wallpaper by saving it locally. Updating the wallpaper server-side will also result in a wallpaper update on the endpoints, which is very convenient.

You can change the wallpaper on Line 16 of the script.

[![jv-media-8512-9412153084fe.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/10-scripts-for-ubuntu-mdm-with-microsoft-intune/jv-media-8512-9412153084fe.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/10-scripts-for-ubuntu-mdm-with-microsoft-intune/jv-media-8512-9412153084fe.png)

---

## 4. Install PowerShell 7

It is also possible to install PowerShell 7 from the Ubuntu App Center with a script. This method can also be used to install any application from there.

[![jv-media-8512-b2e78ee12652.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/10-scripts-for-ubuntu-mdm-with-microsoft-intune/jv-media-8512-b2e78ee12652.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/10-scripts-for-ubuntu-mdm-with-microsoft-intune/jv-media-8512-b2e78ee12652.png)

This way you can also run PowerShell modules and scripts to manage cloud services.

---

## 5. GNOME Privacy Settings

This script has various configurable settings for the GNOME Desktop Environment. The table below shows the available options:

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

The settings can be configured at the start of the script, on Lines 4 through 12.

---

## 6. Configure homepage for Firefox

As Firefox is the default browser on Ubuntu, we can also configure a default homepage and set it to a particular URL.

[![jv-media-8512-0699e2fa647b.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/10-scripts-for-ubuntu-mdm-with-microsoft-intune/jv-media-8512-0699e2fa647b.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/10-scripts-for-ubuntu-mdm-with-microsoft-intune/jv-media-8512-0699e2fa647b.png)

You can change this URL on Line 16 of this script.

[![jv-media-8512-2facf3f453a7.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/10-scripts-for-ubuntu-mdm-with-microsoft-intune/jv-media-8512-2facf3f453a7.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/10-scripts-for-ubuntu-mdm-with-microsoft-intune/jv-media-8512-2facf3f453a7.png)

---

## 7. Set color theme

We can also set the color theme of Ubuntu with this script. You must first select a hex color in the #FFFFFF format, paste it into the script, and then upload it to Microsoft Intune.

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

Something we often configure with Microsoft Intune is the screen timeout and locking options. When we walk away from the device and no input is received, the device will lock after 5 minutes. This value can be changed in the script.

You can change this value in seconds on Line 15. The default is 5 minutes, or 300 seconds.

[![jv-media-8512-7cab8eab47de.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/10-scripts-for-ubuntu-mdm-with-microsoft-intune/jv-media-8512-7cab8eab47de.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/10-scripts-for-ubuntu-mdm-with-microsoft-intune/jv-media-8512-7cab8eab47de.png)

For demonstration purposes, I have set the timeout to 8 minutes, as 5 minutes was the default option.

---

## 9. Enable Automatic Security Updates

This script enables automatic security updates on an Ubuntu device. It installs unattended-upgrades, configures the system to check for package updates daily, and automatically installs security-related updates. It also removes unused dependencies and writes the output to a log file for troubleshooting. Automatic rebooting is disabled to prevent unexpected restarts, but a reboot time has already been configured in case this option is enabled later.

---

## 10. Set timezone/NTP

We can set the timezone and NTP server with this script. This ensures the time and date are synchronized with time servers on the internet and minimizes the risk of issues caused by time synchronization problems.

You can change the timezone on Line 16 of this script.

[![jv-media-8512-90f30d35ed12.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/10-scripts-for-ubuntu-mdm-with-microsoft-intune/jv-media-8512-90f30d35ed12.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/10-scripts-for-ubuntu-mdm-with-microsoft-intune/jv-media-8512-90f30d35ed12.png)

---

## Troubleshooting

All scripts will write a log file to the /var/log folder. All scripts have been tested and are working on Ubuntu 26.04. However, if you encounter errors on your end, you can review the logs to identify the cause.

- /var/log

You can use these two built-in Ubuntu/Linux commands to review the contents:

- cat *filename.log (read)
- nano *filename.log (read/edit)

[![jv-media-8512-1f6787148130.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/10-scripts-for-ubuntu-mdm-with-microsoft-intune/jv-media-8512-1f6787148130.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/10-scripts-for-ubuntu-mdm-with-microsoft-intune/jv-media-8512-1f6787148130.png)

---

## Downsides of Linux devices in Microsoft Intune

One of the downsides I find with Ubuntu devices in Intune is that users must confirm everything themselves by entering their password. When new scripts are uploaded and assigned, they see this window:

[![jv-media-8512-7303a1af5261.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/10-scripts-for-ubuntu-mdm-with-microsoft-intune/jv-media-8512-7303a1af5261.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/10-scripts-for-ubuntu-mdm-with-microsoft-intune/jv-media-8512-7303a1af5261.png)

This is not a major problem, but it differs from device management on Windows devices. There, we can update policies and install applications without user interaction.

Another downside is that management is very limited. We cannot wipe devices from the portal and support is limited to Ubuntu only. Most people who use Linux distributions do not use only Ubuntu and may want more customization with other distros, but these are not yet supported.

### Sources

These sources helped me with the writing and research for this post:

1. [https://learn.microsoft.com/en-us/intune/device-security/compliance/custom-settings](https://learn.microsoft.com/en-us/intune/device-security/compliance/custom-settings)
2. [https://learn.microsoft.com/en-us/intune/user-help/enrollment/enroll-linux](https://learn.microsoft.com/en-us/intune/user-help/enrollment/enroll-linux)
3. [https://learn.microsoft.com/en-us/intune/user-help/enrollment/enroll-linux#system-requirements](https://learn.microsoft.com/en-us/intune/user-help/enrollment/enroll-linux#system-requirements)

{{< ads >}}

{{< article-footer >}}