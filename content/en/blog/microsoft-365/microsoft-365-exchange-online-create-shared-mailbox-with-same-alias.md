---
title: "Microsoft 365 create a shared mailbox with same alias"
date: 2024-06-06
slug: "microsoft-365-exchange-online-create-shared-mailbox-with-same-alias"
categories:
  - Microsoft 365
tags:
  - Step by Step guides
description: >
  By default it is not possible to create multiple shared mailboxes with the same name/alias. In this guide i will explain how to reach...
---
When using Microsoft 365 and using multiple custom domains, sometimes you are unable to create a shared mailbox that uses the same alias as an existing mailbox.

In this guide I will explain this problem and show how to still get the job done.

---

---

## The problem of multiple shared mailboxes with same alias

Let's say, we have a Microsoft 365 tenant with 3 domains;

- domain1.com
- domain2.com
- domain3.com

When you already have a mailbox called "info@domain1.com" you are unable to create a "info@domain2.com" in the portal. The cause of this problem is that every mailbox has a underlying "alias" and that this alias is the same when created in the portal. I have tried this in the Microsoft 365 admin center, Exchange Online admin center and Powershell. I get the following error:

{{< card code=true header="**MARKDOWN**" lang="markdown" >}}
Write-ErrorMessage: ExB10BE9|Microsoft.Exchange.Management.Tasks.WLCDManagedMemberExistsException|The proxy address "SMTP:info@domain1.com" is already being used by the proxy addresses or LegacyExchangeDN. Please choose another proxy address.
{{< /card >}}

---

## The cause of this problem

The cause of the problem is that even if you select another domain in the shared mailbox creation wizard, it wants to create a underlying UPN in your default domain.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/microsoft-365-exchange-online-create-shared-mailbox-with-same-alias-288/jv-media-288-b5699773e4da.png)

We get an error stating: Email address not available because it's used by XXX, which is actually true.

---

## How to create those mailboxes?

Luckily I found out that the solution is very easy and that is to create the new mailbox using the Exchange Online Powershell module. I will explain how this works.

For my tutorial, i stick to the example given above, where i described 3 domains, domain1, domain2 and domain3.

First, ensure that you have installed the Exchange Online Powershell module by running the following command in an elevated Windows Powershell window:

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
Install-Module ExchangeOnlineManagement
{{< /card >}}

After around 30 seconds, you are ready to login into Exchange Online by using th efollowing command:

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
Connect-ExchangeOnline
{{< /card >}}

Log in into your account which has sufficient permissions to manage mailboxes.

After logging in, you have to run the following command:

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
New-Mailbox -Shared -Name "NAME" -DisplayName "DISPLAYNAME" -PrimarySMTPAddress "info@domain.com" -Alias "info_domainname"
{{< /card >}}

Here, we create a new shared mailbox:

- **Name:** Name of the mailbox (everything before the @domain.com)
- **Displayname:** The displayname of the mailbox how it is shown for contacts, users and in the portal
- **PrimarySMTPAddress:** The primary emailaddress for the mailbox
- **Alias:** A internal name for the mailbox which has to be unique (I often use info\_domainname)

You can create all mailboxes like this, and we have to tell Exchange Online exactly how to create the mailbox. After creating the mailbox, it looks like this in Exchange Admin center;

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/microsoft-365-exchange-online-create-shared-mailbox-with-same-alias-288/jv-media-288-8fbbe652547f.png)

---

## Summary

So creating multiple shared mailboxes with the same alias is not possible in the admin portals which is very stupid. It looks like a way Microsoft wants you to still use their Powershell modules.

I hope Microsoft publishes a new solution for this where we can create those mailboxes in the admin portals and not having to create them using Powershell.

---

## End of the page 🎉

You have reached the end of the page. You can select a category, share this post on X, LinkedIn and Reddit or return to the blog posts collection page. Thank you for visiting this post.

If you think something is wrong with this post or you want to know more, you can send me a message to one of my social profiles at: <https://justinverstijnen.nl/about/>

[Go back to Blog](https://justinverstijnen.nl/blog/)

If you find this page and blog very useful and you want to leave a donation, you can use the button below to buy me a beer. Thank you in advance and cheers :)

[![](https://img.buymeacoffee.com/button-api/?text=Buy me a beer&emoji=🍺&slug=justinverstijnen&button_colour=FFDD00&font_colour=000000&font_family=Arial&outline_colour=000000&coffee_colour=ffffff)](https://www.buymeacoffee.com/justinverstijnen)

[![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/about-66/jv-media-66-36a3c69c96cb.png)](https://buymeacoffee.com/justinverstijnen)

The [terms and conditions](https://justinverstijnen.nl/terms-conditions/) apply to this post.

Page visitors:
No page-counter data available yet.
