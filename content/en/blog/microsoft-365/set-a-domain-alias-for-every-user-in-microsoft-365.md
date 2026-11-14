---
title: "Set a domain alias for every user in Microsoft 365"
date: 2024-12-13
slug: "set-a-domain-alias-for-every-user-in-microsoft-365"
categories:
  - Microsoft 365
tags:
  - Step by Step guides
description: "Sometimes we aquire a new domain for Microsoft 365 and we want to add this domain to every user as alias to receive mail on. This post explains how to add a new alias with another domain to every user in your Microsoft 365 tenant.
---

## The solution described

Let's say you have a primary domain in your Microsoft 365 tenant; justinverstijnen.nl for example. And you want to go internationally, and you aquire justinverstijnen.com. Users will not be able to receive mail on the .com if you don't configure this.

In this guide we will add an alias for the .com domain to every user based on their current .nl email address. They will be able to receive email on both domains but they can only send using their primary email address.

- Justin Verstijnen
    - Primary emailaddress: info@justinverstijnen.nl
    - Alias: info@justinverstijnen.com

---

## Step 1: Login to Exchange Online Powershell

To configure a alias for every user, we need to login into Exchange Online Powershell. If you didn't use this in the past or this module is not installed yet, run the following command to perform the installation of the module:

{{< card code=true header="**PowerShell**" lang="powershell" >}}
Install-Module ExchangeOnlineManagement -Scope CurrentUser
{{< /card >}}

After the installation has been succeeded, we can use this command to connect to our Microsoft 365 tenant using the Exchange Online PowerShell module:

{{< card code=true header="**PowerShell**" lang="powershell" >}}
Connect-ExchangeOnline
{{< /card >}}

After you logged in and authentication was been succesful, we will be ready to go:

[![jv-media-669-9a8877abbaff.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/set-a-domain-alias-for-every-user-in-microsoft-365/jv-media-669-9a8877abbaff.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/set-a-domain-alias-for-every-user-in-microsoft-365/jv-media-669-9a8877abbaff.png)

I just checked if I can fetch users to check authentication was completed.

---

## Step 2: Adding the 365 domain alias to every user

After succesfully logged in into Exchange Online PowerShell, run the following line:

{{< card code=true header="**PowerShell**" lang="powershell" >}}
$users=Get-Mailbox | Where-Object{$_.PrimarySMTPAddress -match "justinverstijnen.nl"}
{{< /card >}}

This will get all users which have the domain `justinverstijnen.nl` as primary domain and save it into the `$users` variable. We can see this happening by checking the contents of the `$users` variable:

[![jv-media-669-5e44455f283c.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/set-a-domain-alias-for-every-user-in-microsoft-365/jv-media-669-5e44455f283c.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/set-a-domain-alias-for-every-user-in-microsoft-365/jv-media-669-5e44455f283c.png)

This reports 3 mailboxes, my info@justinverstijnen.nl mailbox and 2 shared mailboxes including my reports@justinverstijnen.nl mailbox [from another guide](https://justinverstijnen.nl/enhance-email-security-with-spf-dkim-dmarc/#monitoring-using-dmarc).

Now we want to add "justinverstijnen.com" to those accounts as they need to receive email on both domains. Run the following simple script to perform this action:

{{< card code=true header="**PowerShell**" lang="powershell" >}}
foreach ($user in $users) {
    $newAlias = "smtp:$($user.Alias)@justinverstijnen.com"

    Set-Mailbox -Identity $user.Identity -EmailAddresses @{
        Add = $newAlias
    }
}
{{< /card >}}

This is a `foreach` loop which runs a command for each object in our `$users` variable.

If this doesn't show any error, the action is completed successfully.

[![jv-media-669-0c8fc18e47c1.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/set-a-domain-alias-for-every-user-in-microsoft-365/jv-media-669-0c8fc18e47c1.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/set-a-domain-alias-for-every-user-in-microsoft-365/jv-media-669-0c8fc18e47c1.png)

---

## Step 3: Checking the results

To check if everything is configured correctly, run the following command:

{{< card code=true header="**PowerShell**" lang="powershell" >}}
$users | ft PrimarySmtpAddress, EmailAddresses
{{< /card >}}

You can also check the Exchange Admin Center if the script has the correct outcome for your situation:

[![jv-media-669-92b3dd8c324c.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/set-a-domain-alias-for-every-user-in-microsoft-365/jv-media-669-92b3dd8c324c.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/set-a-domain-alias-for-every-user-in-microsoft-365/jv-media-669-92b3dd8c324c.png)

{{% alert title="Note" color="info" %}}
It can take up to 15 minutes for the aliasses to be shown and active.
{{% /alert %}}

---

## Summary

This guide explained how we can initially add a new domain as alias to every existing user. This can be needed if a company aquires a new domain which must be used while maintaining single accounts for users. While this works great, every new user must still get the new alias manually or you need to script or automate this. At least you know how to do it now.

Thank you for reading this post and I hope it was helpful!

{{% alert title="Sources 🕮" color="info" %}}
These sources helped me by writing and research for this post;

1. [https://learn.microsoft.com/en-us/powershell/module/exchangepowershell/set-mailbox?view=exchange-ps#example-7](https://learn.microsoft.com/en-us/powershell/module/exchangepowershell/set-mailbox?view=exchange-ps#example-7)
{{% /alert %}}

{{< ads >}}

{{< article-footer >}}