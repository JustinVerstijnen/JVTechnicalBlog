---
title: "Initial Installation script for Windows Azure VMs"
date: 2025-08-10
slug: "initial-installation-script-for-windows-azure-vms"
categories:
  - Powershell
tags:
  - Tools and Scripts
description: >
  When deploying Windows VMs in Azure, we get the default settings. This means we get a 12-hour clock, standard UTC/Zulu timezone and such...
---
When deploying Windows VMs in Azure, we get the default settings. This means we get a 12-hour clock, standard UTC/Zulu timezone and such. For users like us in the Netherlands we want to change this but not by hand.

For this purpose I built this script. It sets the timezone for Western Europe and sets the clock to 24-hour system. It also does some bonusses like responding to ping and disabling the IE Enhanced Security as it's mostly server focussed. We don't change the Windows language and this stays English.

---

---

## Where to download this script?

For the fast pass, my script can be downloaded here:

[Download script from GitHub](https://github.com/JustinVerstijnen/JV-ServersInitialInstall)

---

## What does the Initial server installation script do?

The script itself has 6 steps:

1. Ensuring it runs as Administrator
2. Enable logging
   - Saves a log file in the same directory and with 100KB limit
3. Setting the timezone to Western Euopean time ([Amsterdam time](https://www.timeanddate.com/worldclock/netherlands/amsterdam))
4. Setting regional settings for 24 hours clock
5. Disables IE Enhanced Security
6. Enables response to ping for local networks
7. Reboots the server

---

## Using the initial server installation script

To use the script, we must first download it from the Github page:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/initial-installation-script-for-windows-azure-vms-3616/jv-media-3616-cc79aadbe302.png)

Click on "Code" and then "Download ZIP".

Now place the script on the machine where it must run, If not already done so.

To run this in the most user-friendly way possible, open the PowerShell ISE as administrator:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/initial-installation-script-for-windows-azure-vms-3616/jv-media-3616-d4b54450c379.png)

Type in your credentials and advance.

Now open the script by using the "Open" function:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/initial-installation-script-for-windows-azure-vms-3616/jv-media-3616-c9cbad0236b0.png)

Before we can run, we must change the Powershell Execution policy temporarily. We can do this by typing the command in the blue window below:

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
Set-ExecutionPolicy Unrestricted -Scope Process
{{< /card >}}

This way the execution policy stays enabled but for this session only it's been lowered. When you close the window, you have to type this again before be able to run scripts.

Execute the command, and when prompted to lower the policy, click Yes.

Now we are ready to execute the script. Double check the parameters section (Line 13 to 18) of the script to ensure this complies with your desired settings.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/initial-installation-script-for-windows-azure-vms-3616/jv-media-3616-eb61e387156a.png)

Then run the script:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/initial-installation-script-for-windows-azure-vms-3616/jv-media-3616-3a4f47e6e796.png)

This shows that the script runs and sets every setting correctly. After running correctly, the server will instantly reboot to apply all settings:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/initial-installation-script-for-windows-azure-vms-3616/jv-media-3616-97e8e90de29a.png)

---

## Summary

This is a great script to use for installing Windows Servers on initial. These are some settings we must do by hand normally but we can now to with a simple script. Also setting the correct timezone can sometimes be stupid as the timezone may roll back to the Azure default. This script ensures this doesn't happen.

Thank you for reading the post and I hope the script is useful.

### Sources

These sources helped me by writing and research for this post;

1. <https://learn.microsoft.com/en-us/windows/win32/intl/table-of-geographical-locations>
2. <https://learn.microsoft.com/en-us/powershell/module/international/set-culture?view=windowsserver2025-ps>
3. <https://learn.microsoft.com/en-us/powershell/module/international/set-culture?view=windowsserver2025-ps>

{{< ads >}}

{{< article-footer >}}
