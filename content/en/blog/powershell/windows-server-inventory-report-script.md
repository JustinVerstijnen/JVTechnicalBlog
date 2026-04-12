---
title: "Windows Server Inventory Report Script"
date: 2025-11-13
slug: "windows-server-inventory-report-script"
categories:
  - Powershell
tags:
  - Tools and Scripts
description: >
  To help us IT identifying certain configurations on a server and possible misconfigurations I have made a PowerShell script which creates a...
---
To help us IT identifying certain configurations on a server and possible misconfigurations I have made a PowerShell script which creates a complete overview of the current server configuration and exports it as a single HTML file.

In this post I will explain how to use it and how the script works.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/windows-server-inventory-report-script-3866/jv-media-3866-047721edba6f.png)

An example of the output of the script.

---

---

## Where to download this script?

For the fast pass, my script can be downloaded here:

[Download script from GitHub](https://github.com/JustinVerstijnen/JV-ServerInventoryReport/blob/main/JV-ServerInventoryReport.ps1)

---

## What does the Server Inventory script do?

The script I have made creates a full system configuration report which shows us a lot of information:

- Generic System information
- Network information
- Firewall configuration and Ports
- Storage information
- Applications
- Server roles, SQL and IIS configuration
- Services
- Configured shares
- Installed printers

---

## How to use the script with Powershell Gallery

I have uploaded this script to the PowerShell Gallery for quick and easy installation/use. You can download and install the script by typing this into your PowerShell window:

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
Install-Script JV-ServerInventoryReport
{{< /card >}}

At the question for the untrusted repository, answer "Yes to all" (A).

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/windows-server-inventory-report-script-3866/jv-media-3866-73da7b39246d.png)

Now the script is installed, and we can execute it by running:

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
JV-ServerInventoryReport
{{< /card >}}

This immediately runs the script and saves the output to your desktop folder.

---

## How to use the script manually

To use the script, we need to do some steps. You can do it in your own way, but I show the most easiest way to run the script without compromising system security.

First download the script from GitHub:

[Download script from GitHub](https://github.com/JustinVerstijnen/JV-ServerInventoryReport/tree/main)

Click on the blue button above. You now are on the GitHub page of the script.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/windows-server-inventory-report-script-3866/jv-media-3866-49e7d848560d.png)

Click on "Code" and then "Download ZIP".

Now place the files on the server where you want to install the script.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/windows-server-inventory-report-script-3866/jv-media-3866-7b76c7b8117c.png)

Unzip the file and then we can run the "Install" script. This must be run as administrator and temporarily without Execution Policy.

Open Powershell ISE as administrator.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/windows-server-inventory-report-script-3866/jv-media-3866-4baa015038fe.png)

After opening PowerShell ISE and after authenticating, open the "Install" script.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/windows-server-inventory-report-script-3866/jv-media-3866-a00421852055.png)

Review the script to understand what it does. This is always a recommendation before executing unknown scripts.

After reviewing, run the following command to temporarily disable the PowerShell execution policy:

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
Set-ExecutionPolicy Unrestricted -Scope Process
{{< /card >}}

This disables the default PowerShell execution policy for only the duration of your PowerShell window. After closing PowerShell, every other window will have this enabled again.

Then run the script by clicking the "Play" button:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/windows-server-inventory-report-script-3866/jv-media-3866-e70383784fc0.png)

The script will run. This takes about 30 seconds. After it has been succesfully completed, the HTML-file will be placed on the desktop (or other location if you specify this while running).

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
PS C:\Users\justin-admin> Set-ExecutionPolicy Unrestricted -Scope Process

PS C:\Users\justin-admin> C:\Users\justin-admin\Downloads\JV-ServerInventoryReport-main\JV-ServerInventoryReport.ps1
Script made by...
     _           _   _        __     __            _   _  _
    | |_   _ ___| |_(_)_ __   \ \   / /__ _ __ ___| |_(_)(_)_ __   ___ _ __
 _  | | | | / __| __| | '_ \   \ \ / / _ \ '__/ __| __| || | '_ \ / _ \ '_ \
| |_| | |_| \__ \ |_| | | | |   \ V /  __/ |  \__ \ |_| || | | | |  __/ | | |
 \___/ \__,_|___/\__|_|_| |_|    \_/ \___|_|  |___/\__|_|/ |_| |_|\___|_| |_|
                                                       |__/
Report written to: C:\Users\justin-admin\Desktop\Server-Inventory_20250821_101816.html
{{< /card >}}
![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/windows-server-inventory-report-script-3866/jv-media-3866-361f5c88aa16.png)

Then you can open this file with your favorite webbrowser and review the information.

---

## Summary

This script provides a great and simple overview of the full server configuration. It places everything in nice and clear tables, while still granting access to the raw outputs it used to markup the tables.

Everything is placed in nice and clear tabs so information is categorized, and the information can be easily exported.

I hope my script is helpful for you and thank you for viewing.

### Sources

These sources helped me by writing and research for this post;

1. <https://learn.microsoft.com/en-us/powershell/scripting/learn/ps101/09-functions?view=powershell-7.5>
2. <https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.utility/convertto-html?view=powershell-7.5>

{{< ads >}}

{{< article-footer >}}
