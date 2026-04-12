---
title: "Get Windows Product Key with PowerShell"
date: 2024-07-28
slug: "get-windows-product-key-with-powershell"
categories:
  - Powershell
tags:
  - Tools and Scripts
description: >
  Sometimes we need to have the original installed Windows Product Key just for documentation purposes. We simple can do this with...
---
Sometimes we need to have the original installed Windows Product Key just for documentation purposes. We simple can do this with one command in PowerShell:

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
(Get-ItemProperty -Path "HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion\SoftwareProtectionPlatform").BackupProductKeyDefault
{{< /card >}}
![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/get-windows-product-key-with-powershell-3681/jv-media-3681-3a0bbc0e5409.png)

Please note that I am not encouraging software abuse or pirating, just sharing a tip to make our IT life a bit easier. It happens that a server or computer gets installed and we forget to document the product key or just to match it with our known information.

{{< ads >}}

{{< article-footer >}}
