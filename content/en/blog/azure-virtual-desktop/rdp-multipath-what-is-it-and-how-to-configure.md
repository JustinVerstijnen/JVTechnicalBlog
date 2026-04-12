---
title: "RDP Multipath - What is it and how to configure?"
date: 2025-07-16
slug: "rdp-multipath-what-is-it-and-how-to-configure"
categories:
  - Azure Virtual Desktop
tags:
  - Step by Step guides
description: >
  RDP Multipath is a new protocol for Azure Virtual Desktop and ensures the user always has a good and stable connection. It improves the...
---
RDP Multipath is a new protocol for Azure Virtual Desktop and ensures the user always has a good and stable connection. It improves the connection by connecting via the best path and reduces random disconnections between session hosts and users.

Let's take a look what RDP Multipath adds to your connections:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/rdp-multipath-what-is-it-and-how-to-configure-3778/jv-media-3778-6509addb3606.png)

**Green:** The normal paths of connecting with RDP/Shortpath
**Purple:** The paths added by RDP Multipath

This adds extra ways of connecting session hosts to the end device, selects the most reliable one and therefore adds stability and decreases latency.

RDP Multipath now has to be configured manually, but the expectation is that it will be added to new AVD/Multi Session images shortly, just ad RDP Shortpath did at the time.

The RDP Multipath function is exclusively for Azure Virtual Desktop and Windows 365 and requires you to use at least one of the supported clients and versions:

- Remote Desktop (MSRDC): [1.2.6074](https://learn.microsoft.com/en-us/previous-versions/remote-desktop-client/whats-new-windows?tabs=windows-msrdc-msi)
- Windows App: [2.0.366.0](https://learn.microsoft.com/en-us/windows-app/whats-new?tabs=windows)

---

## Option 1: Configure RDP Multipath using Group Policy

RDP Multipath can be configured by adding a registry key to your sessionhosts. This can be done through Group Policy by following these steps:

Open Group Policy Management (gpmc.msc) on your Active Directory Management server and create a new Group Policy that targets all AVD machines or use an existing GPO.

Go to: *Computer Configuration \ Preferences \ Windows Settings \ Registry*

Create a new registry item:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/rdp-multipath-what-is-it-and-how-to-configure-3778/jv-media-3778-1dc01889c8d9.png)

Choose the hive "HKEY\_LOCAL\_MACHINE" and in the Key Path, fill in:

- *SYSTEM\CurrentControlSet\Control\Terminal Server\RdpCloudStackSettings*

Then, fill in the following value in the Value field:

- *SmilesV3ActivationThreshold*

Then select "REG\_DWORD" as value type and type in "100" in the value data field. Let the "Base" option be on "Decimal".

The correct configuration must look like this:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/rdp-multipath-what-is-it-and-how-to-configure-3778/jv-media-3778-e3704aee3db3.png)

Now save this key, close the Group Policy Management console, reboot or GPupdate your session host and let's test this configuration!

---

## Option 2: Configure RDP Multipath manually through Registry Editor

You can configure RDP Multipath through registry editor on all session hosts.

Then go to:

- *Computer\HKEY\_LOCAL\_MACHINE\SYSTEM\CurrentControlSet\Control\Terminal Server*

Create a new key here, named "**RdpCloudStackSettings**"

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/rdp-multipath-what-is-it-and-how-to-configure-3778/jv-media-3778-c95f19fa427d.png)

Then create a new DWORD value:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/rdp-multipath-what-is-it-and-how-to-configure-3778/jv-media-3778-cc65a3bbb898.png)

Name it "**SmilesV3ActivationThreshold**" and give it a value of 100 and set the Base to "Decimal":

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/rdp-multipath-what-is-it-and-how-to-configure-3778/jv-media-3778-5a6ef3075170.png)

Save the key and close registry editor.

Now a new session to the machine must be made to make RDP Multipath active.

---

## Option 3: Configure RDP Multipath using Microsoft Intune/Powershell Script

RDP Multipath can also be configured by running my PowerShell script. This can be run manually or by deploying via Intune. The script can be downloaded from my GitHub page:

[Download script from Github](https://github.com/JustinVerstijnen/JV-AVDRDPMultipath)

Open Microsoft Intune, go to Windows, then go to "Scripts and Remediations" amd then "Platform Scripts".

Click on "+ Add" to add a new script:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/rdp-multipath-what-is-it-and-how-to-configure-3778/jv-media-3778-efb395ed393e.png)

Give the script a name and description and click on "Next".

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/rdp-multipath-what-is-it-and-how-to-configure-3778/jv-media-3778-66288951f95a.png)

Upload my script and then select the following options:

Select the script and change the options shown in the image and as follows:

- **Run this script using the logged on credentials:** No
  - This runs the script as system account
- **Enforce script signature check:**No
- **Run script in 64 bit PowerShell Host:** Yes

Click next and assign the script to a group that contains your session hosts. Then save the script.

After this action, the script will be runned after synchronizing on your running sessionhosts, and then will be active. There is no reboot needed, only a new connection to the session host to make it work.

---

## The results

After you configured RDP Multipath, you should see this in your connection window:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/rdp-multipath-what-is-it-and-how-to-configure-3778/jv-media-3778-1afec4f49317.png)

If Multipath is mentioned here, it means that the connection uses Multipath to connect to your session host. Please note that this may take up to 50 seconds prior to connectiong before this is visible. Your connection is first routed through the gateway and then switches to Shortpath or Multipath based on your settings.

---

## Summary

Configuring RDP Multipath will enhance the user experience. With some minor network outages, the connection will be more stable. Also, it will help by always choosing the most efficient path to the end users' computer.

Thank you for reading this guide and I hope it was helpful.

### Sources

These sources helped me by writing and research for this post;

1. <https://learn.microsoft.com/en-us/azure/virtual-desktop/rdp-multipath>
2. <https://www.youtube.com/watch?v=fkXZZixOMjc>

{{< ads >}}

{{< article-footer >}}
