---
title: "Use Microsoft Defender for Endpoint with PowerShell"
date: 2026-06-30
slug: "use-microsoft-defender-for-endpoint-with-powershell"
categories:
  - Microsoft Defender XDR
tags:
  - Step by Step guides
description: >
  Microsoft Defender for Endpoint is a built-in antivirus and security solution that helps protect your Windows devices. Because we want as...
draft: true
---
Microsoft Defender for Endpoint is a built-in antivirus and security solution that helps protect your Windows devices. Because we want as less overhead as possible at certain moments, I though of using Defender with PowerShell. Using PowerShell, you can manage Defender by checking its status, running Full and Quick scans, updating protections, and handling detected threats.

In this guide, I will explain some PowerShell commands with simple steps to help you control Defender effectively from PowerShell, remotely or even to use in your scripts.

---

---

## Requirements

To follow this guide, you need the following things:

- A Windows 11/Server 2022 or 2025 device with Microsoft Defender for Endpoint enabled
- PowerShell running with Administrator privileges
- Basic knowledge of PowerShell

---

## Short introduction to Microsoft Defender for Endpoint

Microsoft Defender for Endpoint is a security solution that protects laptops, desktops, servers, and mobile devices against malicious software and threats. It can detect suspicious activity, help investigate attacks, and helps notifying you of threats happening on your devices. It is part of the broader Microsoft security ecosystem and supports platforms such as Windows, macOS, Linux, iOS, and Android.

Microsoft Defender is installed automatically with Windows today, but we also need to link Defender to our tenant. The user account using the computer also must have a Defender license (P`1/P2) or included with Business Premium and higher.

In coorperation with Microsoft Intune we can manage devices and enforce security policies. When the two are integrated, Defender for Endpoint can share device risk information with Intune in real time. Intune can then use that risk level in compliance policies, for example by marking a device as noncompliant and helping block access to company apps or data until the issue is resolved.

Defender for Endpoint works by default with the defaults of Microsoft, which is very broad and widely compatible. This means it secures your device a bit but we don't get every penny out of it. This is why you want to create your own configurations with Microsoft Intune which we can do through the Intune Admin center (<https://intune.microsoft.com>).

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/use-microsoft-defender-for-endpoint-with-powershell-7360/jv-media-7360-ac4cfa8cf2ed.png)

To learn more about configuring Microsoft Defender with Intune, check out this guide: [https://justinverstijnen.nl/microsoft-secure-score-devices](https://justinverstijnen.nl/?p=5375)

---

## Starting out with PowerShell and Microsoft Defender

Now we are ready to use Microsoft Defender on our client device and execute some PowerShell commands. I have collected some PowerShell commands which we will often use for getting information, attacking threats, executing scans, checking the event logs and double check that what we see in the admin centers are aliging with the real scenario.

To start out, go to the client device or use remote PowerShell and start by executing this command to check if everything is ready:

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
Get-MpComputerStatus
{{< /card >}}

This will give you an overview of all Defender information available on the device like latest signature updates, enabled/disabled status:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/use-microsoft-defender-for-endpoint-with-powershell-7360/jv-media-7360-9468534ec20d.png)
{{% alert color="info" %}}
If this command doesn't work, check if the module is imported correctly:

PowerShell

```powershell
Import-Module Defender
```

If this doesn't help anything you can run this command to install the module:

PowerShell

```powershell
Get-Module -ListAvailable Defender | Install-Module
```
{{% /alert %}}

### Microsoft Defender admin center

To check out your devices in Microsoft Defender admin center, go to: <https://security.microsoft.com/machines>

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/use-microsoft-defender-for-endpoint-with-powershell-7360/jv-media-7360-4b5d28f4f8bf.png)

### Onboard new devices to Microsoft Defender for Endpoint

To onboard a new device in Microsoft Defender, go to:

<https://security.microsoft.com/securitysettings/endpoints/onboarding>

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/use-microsoft-defender-for-endpoint-with-powershell-7360/jv-media-7360-4f88a35445d0.png)

For 1 or 2 devices, the local script option is faster. If having more than 2 devices I would advise to onboard them using Intune or Group Policy.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/use-microsoft-defender-for-endpoint-with-powershell-7360/jv-media-7360-0f67cb86a170.png)

Run the script on the target machine as Administrator to link the local Defender instance with Defender XDR in your Microsoft 365 tenant.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/use-microsoft-defender-for-endpoint-with-powershell-7360/jv-media-7360-ad914c1616da.png)

---

## 1. Viewing recent Defender events

Assuming you followed the previous steps to test the Defender module in PowerShell, we can now start executing some commands against the local Defender engine.

To get an overview of the 20 recent logs of Defender, execute this command:

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
Get-WinEvent -LogName "Microsoft-Windows-Windows Defender/Operational" | Select -First 20
{{< /card >}}

This will give us an overview of the latest logs of the Defender engine. You can also choose other options than 20, like 100 or 500 but this can take a while to retrieve information.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/use-microsoft-defender-for-endpoint-with-powershell-7360/jv-media-7360-d0ade1f5a138.png)

---

## 2. Viewing recent scanning events

We can further filter the logs used above to only see scanning events. We can check this way if our scan has happened for troubleshooting and checking purposes.

To filter only on Microsoft Defender scanning events, execute this command:

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
Get-WinEvent -LogName "Microsoft-Windows-Windows Defender/Operational" |
Where-Object { $_.Id -in 1000,1001,1002 } |
Select TimeCreated, Id, Message -First 20
{{< /card >}}

To focus only on key scan events, filter by event IDs 1000, 1001, and 1002 To give a better understanding why:

- **Event ID** **1000**: Defender scan has started
- **Event ID** **1001**: Defender scan has completed
- **Event ID** **1002**: Defender scan cancelled or interrupted

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/use-microsoft-defender-for-endpoint-with-powershell-7360/jv-media-7360-11087c491dd1.png)

As you can see, this perfectly correspond to what we see in the GUI of Defender.

---

## 3. Checking Defender scan status overview

To simply check when the last full and quick Defender scans ran, execute this command:

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
Get-MpComputerStatus | Select FullScanStartTime, QuickScanStartTime
{{< /card >}}
![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/use-microsoft-defender-for-endpoint-with-powershell-7360/jv-media-7360-799afb8f2cb8.png)

You can use this to get a simple overview of the latest scans executed. This can be used in incident responses or to simply check/troubleshoot your Defender confgiuration.

---

## 4. Updating Defender Virus Definitions

Keep Defender up-to-date by downloading the latest virus and malware definitions:

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
Update-MpSignature
{{< /card >}}

The signatures/virus definitions are literally hashes/signatures of trending virus files which are known by Microsoft. This way Defender instantly knows new virusses as it knows them in it's database.

I advise you to always first update these signatures before doing any scans. This way you ensure that we use the latest information available in certain scenarios. The command is almost always done in around 15 seconds.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/use-microsoft-defender-for-endpoint-with-powershell-7360/jv-media-7360-684d63a48862.png)

---

## 5. Running Defender scans manually

Sometimes we need to execute Defender scans manually. We can do this using 2 separate commands. If doing an incident response, or you expect the endpoint having malicious software -> always do a full scan.

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
Start-MpScan -ScanType FullScan
{{< /card >}}
{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
Start-MpScan -ScanType QuickScan
{{< /card >}}

You can start scans anytime using PowerShell without waiting for Intune/Defender for syncing with your device for a faster incident response.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/use-microsoft-defender-for-endpoint-with-powershell-7360/jv-media-7360-b29c9d064585.png)

---

## 6. Viewing and managing threats

To view recently detected threats with their details, execute this command:

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
Get-MpThreatDetection | Select-Object ThreatName, InitialDetectionTime, ActionSuccess, Resources
{{< /card >}}

To remove all threats detected on your device, execute this command:

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
Remove-MpThreat -All
{{< /card >}}

Remove a specific threat by its ID (replace `ThreatID` with the actual ID), execute this command:

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
Remove-MpThreat -ThreatID *ThreatID*
{{< /card >}}

To remove all detected detected threats instantly, execute this command:

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
Get-MpThreatDetection | Remove-MpThreat
{{< /card >}}
![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/use-microsoft-defender-for-endpoint-with-powershell-7360/jv-media-7360-a7b5c6eb58e2.png)

---

## 7. Checking Defender settings

To view Defender’s current settings such as real-time monitoring and scanning preferences, execute this command:

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
Get-MpPreference
{{< /card >}}

You can use this to check any Intune or Group Policy configurations with this command and see the endpoint uses your latest settings.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/use-microsoft-defender-for-endpoint-with-powershell-7360/jv-media-7360-572b2ad49a1d.png)

---

## 8. Checking signature items

To get an overview of the current known signatures, execute this command:

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
Get-MpThreatCatalog
{{< /card >}}

This will give you a list of millions of signature items Microsoft has in its database. You could use this to lookup a single definition in it, rather than executing the command and get the millions of items.

[](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/use-microsoft-defender-for-endpoint-with-powershell-7360/jv-media-7360-e45a2402644e.mp4)

---

## 9. Simple full scan script

You could setup a simple script with all commands above that does a definitions update and then do a scan. You can schedule this using the Windows Task Scheduler.

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
# 4: Updating Virus definitions/signatures
Update-MpSignature

# 5: Executing a Full Scan
Start-MpScan -ScanType FullScan

# 6: Remove all threats
Get-MpThreatDetection | Remove-MpThreat
{{< /card >}}

This can work in smaller environenments of course. If managing environments with more devices and servers I would still advise you tu use Microsoft Intune and or Group Policies to schedule quick and full scans instead.

---

## Summary

PowerShell allows easy and powerful management of Microsoft Defender for Endpoint. You can view scan events, start scans manually, update virus definitions, control protection settings, and handle detected threats. Always keep virus definitions updated and be cautious when changing security settings like turning off real-time protection.

I only described the operational commands of using Defender in case of incident response. For the configuration of Defender for Endpoint, I highly advise to use Microsoft Intune for central and mass configuration options. I have a guide on some Defender settings and the Microsft Secure Score here: [https://justinverstijnen.nl/microsoft-secure-score-devices](https://justinverstijnen.nl/?p=5375)

Thank you for reading this guide and I hope it was helpful.

### Sources

These sources helped me by writing and research for this post;

- <https://learn.microsoft.com/en-us/powershell/module/defender/>

{{< ads >}}

{{< article-footer >}}
