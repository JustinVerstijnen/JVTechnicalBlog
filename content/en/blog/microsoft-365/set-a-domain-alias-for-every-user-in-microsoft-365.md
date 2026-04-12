---
title: "Set a domain alias for every user in Microsoft 365"
date: 2024-12-13
slug: "set-a-domain-alias-for-every-user-in-microsoft-365"
categories:
  - Microsoft 365
tags:
  - Step by Step guides
description: >
  In this guide i will explain how to add a alias of a domain to every user in Microsoft 365/Exchange Online.
---
Sometimes, we add a new domain to Microsoft 365 and we want to have a domain alias for multiple or every user.

---

## Logging in Exchange Online Powershell

To configure a alias for every user, we need to login into Exchange Online Powershell:

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
Connect-ExchangeOnline
{{< /card >}}

If you don't have the module already installed on your computer, run the following command on an elevated window:

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
Install-Module ExchangeOnlineManagement
{{< /card >}}

Source: <https://www.powershellgallery.com/packages/ExchangeOnlineManagement/3.7.2>

## Adding the 365 domain alias to every user

After succesfully logged in, run the following command:

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
$users=Get-Mailbox | Where-Object{$_.PrimarySMTPAddress -match "justinverstijnen.nl"}
{{< /card >}}

Here our current domain is "justinverstijnen.nl" but let's say that we want to add "justinverstijnen.com". Run the following command to do this:

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
foreach($user in $users){Set-Mailbox $user.PrimarySmtpAddress -EmailAddresses @{add="$($user.Alias)@justinverstijnen.com"}}
{{< /card >}}

Now we have added the alias to every user. To check if everything is configured correctly, run the following command:

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
$users | ft PrimarySmtpAddress, EmailAddresses
{{< /card >}}

{{< ads >}}

{{< article-footer >}}
