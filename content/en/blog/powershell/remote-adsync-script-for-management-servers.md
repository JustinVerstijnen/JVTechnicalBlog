---
title: "Remote Entra Connect Sync script for management servers"
slug: "remote-entra-connect-sync-script-for-management-servers"
date: 2026-10-01
tags:
- Tools and Scripts
categories:
- PowerShell
description: "Sometimes you just want to trigger an Entra Connect sync quickly, without opening an RDP session to the Entra Connect server itself. For that reason I made a small PowerShell script that runs the sync remotely from a management server. It keeps the action simple: connect to the Entra Connect server, start a delta sync, show the result, and catch errors if something goes wrong."
hidden: false
---

You can find the script here:

<a class="btn btn-primary" href="https://github.com/JustinVerstijnen/JV-RemoteADSyncScript" target="_blank" rel="noreferrer">Download script from GitHub</a>

## What the script does

The script does five simple steps:

1. Connects remotely to the Entra Connect server using the existing authentication context
2. Starts a delta sync on the remote server
3. Prints the result on screen
4. Catches and shows errors if the action fails
5. Waits and shows possible errors for 15 seconds and closes the PowerShell window

---

## Script settings at a glance

There is only one setting you normally need to change:

| Variable | Example value | Purpose |
| --- | --- | --- |
| `$adconnectserver` | `JV-DC-SRV01.justinverstijnen.nl` | The FQDN of your Entra Connect server |

Open the script and change the `$adconnectserver` variable to the FQDN of your own Entra Connect server.

For example:

{{< card code=true header="**PowerShell**" lang="powershell" >}}
$adconnectserver = "YourEntraConnectServer.yourdomain.local"
{{< /card >}}

After that you can run the script from the management server which is joined to the same domain as your Entra Connect server.

---

## Let's test the script

Open PowerShell on your management server and run the script. You possibly need to bypass the PowerShell execution policy once:

{{< card code=true header="**PowerShell**" lang="powershell" >}}
Set-ExecutionPolicy -ExecutionPolicy Unrestricted -Scope Process -Force
{{< /card >}}

Then you can run the script without any errors for the duration of the PowerShell window:

{{< card code=true header="**Bash**" lang="bash" >}}
.\JV-RemoteADSyncScript.ps1
{{< /card >}}

This will look like this:

[![Screenshot 2026-06-29 163438.jpg](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/remote-entra-connect-sync-script-for-management-servers/jv-media-8517-c3ecebddfe07.jpg)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/remote-entra-connect-sync-script-for-management-servers/jv-media-8517-c3ecebddfe07.jpg)

If the remote connection works and the sync starts correctly, the script prints the returned result and checks whether the result equals `Success` followed by a green line that the synchronization has been successfully executed. Otherwise, the exact error will be printed as error into the same window. This gives you the chance to immediately fix that particular issue.

---

## Summary

This remote Entra Connect sync script is a simple way to trigger a delta sync from a management server. You only need to set the FQDN of your Entra Connect server, make sure remoting works, and run the script. It will start the sync, print the result, and show any error if something goes wrong.

If you want a quick and practical way to start a manual Entra Connect sync without logging on to the Entra Connect server itself, this script does exactly that.

Thank you for reading this post and I hope it was helpful!

### Sources

These sources helped me by writing and research for this post;

1. https://learn.microsoft.com/en-us/entra/identity/hybrid/connect/how-to-connect-sync-feature-scheduler
2. [https://learn.microsoft.com/en-us/powershell/scripting/learn/ps101/08-powershell-remoting?view=powershell-7.6](https://learn.microsoft.com/en-us/powershell/scripting/learn/ps101/08-powershell-remoting?view=powershell-7.6)

{{< ads >}}

{{< article-footer >}}