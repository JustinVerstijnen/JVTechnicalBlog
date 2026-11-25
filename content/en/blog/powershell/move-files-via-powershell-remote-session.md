---
title: "Move files via PowerShell Remote Session"
slug: "move-files-via-powershell-remote-session"
date: 2024-02-18
tags:
- Sep by Step Guides
categories: 
- PowerShell
description: "This simple tutorial tells how to transfer files via PowerShell from our computer to a remote server. Simply by only using PowerShell, without any GUI or third-party tools."
hidden: false
---

Sometimes we need to transfer a file from one location to another with PowerShell. In my testing lab, I use a Hyper-V Server without any GUI but I need to be able to transfer ISO files to the server. I will explain step-by-step how to perform this action.

We can do this using the commands below.

First setup the PowerShell remote connection by saving it in the `$ExternalServer` variable.

{{< card code=true header="**PowerShell**" lang="powershell" >}}
$ExternalServer = New-PSSession -ComputerName "JV-DC01.justinverstijnen.nl"
{{< /card >}}

Replace the computername `JV-DC01.justinverstijnen.nl` with the computer name of your server. Log in when needed/being asked to.

Then you should have a connection to the remote server. Now we can setup our parameters, like the source file and the destination path:

{{< card code=true header="**PowerShell**" lang="powershell" >}}
$SourceFile = "C:\Temp\Windows.iso"
$Destination = "D:\ISO-files"
{{< /card >}}

Now we have setup these settings. Note that I place the file on the `D:` volume on the remote server. Now we can run the command below to copy the file from the local machine right onto the server:

{{< card code=true header="**PowerShell**" lang="powershell" >}}
Copy-Item $SourceFile -Destination $Destination -ToSession $ExternalServer
{{< /card >}}

This copy action can take a while, depending on your servers and connection between them.

{{< ads >}}

{{< article-footer >}}