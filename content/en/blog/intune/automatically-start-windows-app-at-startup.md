---
title: "Automatically start Windows App at startup"
date: 2025-12-25
slug: "automatically-start-windows-app-at-startup"
categories:
  - Intune
tags:
  - Step by Step guides
description: >
  In some cases we want to automatically start the Windows App for connections to AVD and Windows 365 at startup. We can achieve this through different ways which I will describe in this post.
---
In some cases we want to automatically start the Windows App for connections to AVD and Windows 365 at startup. We can achieve this through different ways which I will describe in this post.

---

## Creating the Intune script

We can achieve this with Intune using a PowerShell script. As Intune doesn't support login/startup scripts, we have to create a Platform script that creates a Scheduled Task in Windows for us. This is a great way, as this is visible at the client side and can be disabled pretty easily.

To create this task/script, go to the Intune Admin center: <https://intune.microsoft.com>

Go to Devices -> Windows -> Scripts and remediations, then open the tab "Platform scripts".

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/automatically-start-windows-app-at-startup-6832/jv-media-6832-51c9912fd07e.png)

Click on "+ Add" and select "Windows 10 and later" to create a new script.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/automatically-start-windows-app-at-startup-6832/jv-media-6832-3490973267f0.png)

Click "Next".

Then download my script here that does the magic for you:

[Download script from GitHub](https://github.com/JustinVerstijnen/JV-AutoStartWindowsApp/blob/main/JV-AutoStartWindowsApp.ps1)

Or create a new file in Windows and paste the contents below into a file save it to a .ps1 file.

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
$TaskName = "JV-StartWindowsApp"

$Action = New-ScheduledTaskAction `
    -Execute "explorer.exe" `
    -Argument "shell:AppsFolder\MicrosoftCorporationII.Windows365_8wekyb3d8bbwe!Windows365"

$Trigger = New-ScheduledTaskTrigger -AtLogOn

$Principal = New-ScheduledTaskPrincipal `
    -GroupId "BUILTIN\Users" `
    -RunLevel Limited

Register-ScheduledTask `
    -TaskName $TaskName `
    -Action $Action `
    -Trigger $Trigger `
    -Principal $Principal `
    -Force
{{< /card >}}

Upload the script to Intune and set the following options:

1. Run this script using the logged on credentials: No
2. Enforce script signature check: No
3. Run script in 64 bit PowerShell Host: Yes

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/automatically-start-windows-app-at-startup-6832/jv-media-6832-0bf1f24d2233.png)

Then click "Next".

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/automatically-start-windows-app-at-startup-6832/jv-media-6832-9f052328860d.png)

Assign the script to the group containing your devices where you want to autostart the Windows App. Then save the script.

---

## The results

After the script has been applied, which may take up to 30 minutes, and the computer has been restarted, the Windows app will start automatically when the user logs in, automating the process and eliminating the startup wait time.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/automatically-start-windows-app-at-startup-6832/jv-media-6832-9c54e9225ca2.png)

---

## Summary

Automatically startint the Windows App can help end users to automate a bit of their daily work. They don't have to open it after turning on their PC and can sign-in directly to their cloud device.

Thank you for visiting my website and I hope it was helpful.

### Sources

These sources helped me by writing and research for this post;

- None

{{< ads >}}

{{< article-footer >}}
