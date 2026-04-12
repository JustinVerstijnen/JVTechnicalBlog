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

---

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
