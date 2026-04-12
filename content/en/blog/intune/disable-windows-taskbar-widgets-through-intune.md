---
title: "Disable Windows Taskbar Widgets through Intune"
date: 2025-11-06
slug: "disable-windows-taskbar-widgets-through-intune"
categories:
  - Intune
tags:
  - Step by Step guides
description: >
  Today a short guide on how to disable Windows Taskbar widgets through Intune. I mean this part of the Windows 11 taskbar:
---
Today a short guide on how to disable Windows Taskbar widgets through Intune. I mean this part of the Windows 11 taskbar:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/disable-windows-taskbar-widgets-through-intune-5551/jv-media-5551-0e5b331ce973.png)

---

---

## Method 1: Settings Catalog

The easiest way to disable these widgets is through a Settings Catalog policy. Open up Microsoft Intune admin center and create a new policy through the Settings Catalog.

Search for "widget" and these options are available:

- News and Interests: Disable Widgets on Lockscreen
- News and Interests: Disable Widgets Board
- Widgets: Allow Widgets

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/disable-windows-taskbar-widgets-through-intune-5551/jv-media-5551-81938df80595.png)

In my case, I have set all three options to disabled/Not allowed.

After you have assigned this to the device, all Widgets options are gone and the user experience will be a bit better. The endpoint must restart to apply the changes.

---

## Method 2: Registry/PowerShell

You can achieve the settings also through PowerShell which does some registry changes. You can use this simple script:

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
$JVRegPath = "HKLM:\SOFTWARE\Policies\Microsoft\Dsh"

# Checking/creating path
If (!(Test-Path $JVRegPath)) {
    New-Item -Path $JVRegPath -Force | Out-Null
}

# 1. Disable Widgets Board
Set-ItemProperty -Path $JVRegPath -Name "AllowNewsAndInterests" -Type DWord -Value 0

# 2. Disable Widgets on Lock Screen
Set-ItemProperty -Path $JVRegPath -Name "AllowWidgetsOnLockscreen" -Type DWord -Value 0

# 3. Disable Widgets on Taskbar
Set-ItemProperty -Path $JVRegPath -Name "AllowWidgets" -Type DWord -Value 0
{{< /card >}}

This sets 3 registry keys to the desired setting. In this case disabling widgets on the taskbar and lockscreen.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/disable-windows-taskbar-widgets-through-intune-5551/jv-media-5551-dbc6f1861166.png)

After these keys are set, the computer must reboot to apply the changes.

---

## Summary

This short page explains 2 methods of disabling Widgets from the Windows Taskbar. This is something almost nobody uses and everyone dislikes.

Disabling this speeds up the device and enhances user experience.

Thank you for reading this guide and I hope it was helpful.

### Sources

These sources helped me by writing and research for this post;

- None

{{< ads >}}

{{< article-footer >}}
