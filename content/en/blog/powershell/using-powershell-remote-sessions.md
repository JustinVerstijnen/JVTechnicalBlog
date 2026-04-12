---
title: "Using PowerShell remote sessions"
date: 2024-04-10
slug: "using-powershell-remote-sessions"
categories:
  - Powershell
tags:
  - Step by Step guides
description: >
  In this guide i explain how to use PowerShell remote sessions, what they are and how to configure your systems to use this. Also some...
---
PowerShell Remote Sessions can be a great way to administer your virtual machines, cluster-nodes or physical Windows-based devices. With a Powershell remote session you can execute powershell commands on a remote device.

It works the best with servers in a specific management subnet. I do not recommend to administer client devices with Powershell because this can be a huge security risk.

---

---

## Requirements

- Management computer/Priveleged Access Workstation
- 15-20 minutes of your time
- Management server and endpoints are Active Directory joined

---

## Starting out

Before we can use Powershell to administer remote computers, we need to enable two things:

- **1. WinRM service (Endpoint):** This is a service in Windows that enables remote management. Powershell Remote relies greatly on this service so we have to enable this on the endpoint. By default it is disabled due to its security reasons.
- **2. Trusted Hosts (Management server):** This has to be configured on your management server. This is a whitelist to protect against security threats who can abuse this option. Here you configure to what machines (name/IP-address) you can connect to.

---

## 1. Configure Windows Remote Management (WinRM)

On the endpoint you have to enable WinRM. This can be done manually with one simple command, or at scale with Group Policy.

Simple and one command:

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
winrm quickconfig
{{< /card >}}

At scale with Group Policy:

Create a new or use an existing Group Policy object and go to:

*Computer Configuration > Policies > Administrative Templates > Windows Components > Windows Remote Management (WinRM) > WinRM Service.*

Pick the option: "Allow remote server management through WinRM"

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/using-powershell-remote-sessions-527/jv-media-527-9a922997a7e6.png)

Here we can define from what IP-addresses we can use WinRM for a more secure use of WinRM.

After this option we have to allow WinRM access in the Windows Firewall to work. This also has to be done on the endpoint.

In the GPO, go to:

*Computer Configuration -> Policies -> Windows Settings -> Windows Defender Firewall with Advanced Security*

Create a new Inbound rule based on a Predefined rule:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/using-powershell-remote-sessions-527/jv-media-527-2d7249a5ee50.png)

Click next till the wizard is done.

Now we have a GPO to enable WinRM on all endpoints. Apply this to the OU with the endpoints and wait for the GPO to apply. In the meantime we can configure TrustedHosts on our management workstation.

---

## 2. Configure TrustedHosts

To configure your trustedhosts you can use a simple command on your management server:

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
Set-Item WSMan:\localhost\Client\TrustedHosts #IP-address#
{{< /card >}}

You can use IP-addresses, DNS-names, FQDNs and wildcards. To add a whole subnet (like 10.20.0.0/24) to your trustedhosts list, use the following command:

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
Set-Item WSMan:\localhost\Client\TrustedHosts -Value "10.20.0.*"
{{< /card >}}

Another really unsafe option is to add everything to your TrustedHosts list (not recommended):

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
Set-Item WSMan:\localhost\Client\TrustedHosts -Value "*"
{{< /card >}}

One small note: we use the command Set-Item. This will set the complete TrustedHosts setting to the setting in your command and will overwrite all existing entries. We can also use the following command to add an entry with keeping the current configuration:

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
Add-Item WSMan:\localhost\Client\TrustedHosts -Value "10.20.0.*"
{{< /card >}}

If you have set this up like one of the methods above, we are all set and done.

---

## 3. Setting up an PowerShell Remote session

To start using a PowerShell remote session after you have done all the prerequisites, use the command below:

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
Enter-PSSession -ComputerName 10.20.0.1
{{< /card >}}

You get a prompt to logon with your credentials. The account has to be member of the local Administrators group.

Now we are logged in and we can execute commands like being locally on the server.

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
[JV-TEST-SERVER]: PS C:\Users\justinverstijnen\Documents>
{{< /card >}}

---

## 4. Managing multiple endpoints remotely

To automate some tasks, we can execute commands on our management server on multiple remote endpoints. Think about a group policy update, starting a service or a script that has to be executed directly without restarting the servers to make it work.

We can do this with the Invoke-Command command. In the brackets we can paste our script or command to execute on the endpoints.

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
Invoke-Command -Computername Server1,Server2,Server3,Server4,Server5 -Scriptblock {gpupdate /force}
{{< /card >}}

---

## 5. Multiple sessions and session persistence

With Powershell remoting we can also save sessions in a parameter. We mostly use this to execute a script on multiple servers. This can also be done to use it with the Invoke-Command above This works like:

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
$sessions = New-PSSession -ComputerName Server01, Server02, Server03

Invoke-Command -Session $sessions -ScriptBlock { gpupdate /force }
{{< /card >}}

The way this works is that you save the connections in a variable and you use this as a whole to execute your commands. Makes it simple for executing commands at scale.

---

## Summary

PowerShell remote is a very handy tool to remote connect to a endpoint/server. In practice we want to use simple and GUI-based tools but we have to dig into console commands at some point. For example, if you accidentally stop the Remote Desktop service or during a system outage.

{{< ads >}}

{{< article-footer >}}
