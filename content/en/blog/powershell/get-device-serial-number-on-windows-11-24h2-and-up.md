---
title: "Get Device serial number on Windows 11 24H2 and up"
date: 2025-01-22
slug: "get-device-serial-number-on-windows-11-24h2-and-up"
categories:
  - Powershell
tags:
  - Concepts
description: >
  With Windows 24H2 and the deprecation of WMIC, a easy command to find your devices' serial number is gone. However, we can still look this up with Powershell.
---
With Windows 24H2 and the deprecation of WMIC, a easy command to find your devices' serial number is gone. However, we can still look this up with Powershell.

Use the following command:

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
Get-WmiObject win32_bios | select SerialNumber
{{< /card >}}

{{< ads >}}

{{< article-footer >}}
