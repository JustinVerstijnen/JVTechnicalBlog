---
title: "Disable Teams Premium Trial Button"
slug: "disable-teams-premium-trial-button"
date: 2026-06-06
tags:
- Step by Step Guides
categories:
- Microsoft 365
description: "If you see an “Unlock Teams Premium” button in Microsoft Teams, you’ll probably also have users who click it right away and start a trial. For most orgs, that’s not the experience you want. In this post, I’ll show you two ways to remove that button, through the 365 Admin Center and PowerShell"
hidden: false
---

If we talk about the "Unlock Teams Premium" button, I mean this button which users get in their Teams client:

[![jv-media-8020-34fced7eb1b1.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/disable-teams-premium-trial-button/jv-media-8020-34fced7eb1b1.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/disable-teams-premium-trial-button/jv-media-8020-34fced7eb1b1.png)

Let's show how to disable this button. Disabling the button can take up to 48 hours to process and to see results at your end users' clients, so a little patience is needed.

## Option 1: Microsoft 365 Admin Center

Like I have already done [in an earlier guide](https://justinverstijnen.nl/disable-users-self-service-license-trials/), we can disable self service licenses through the self-service trials menu in the Microsoft 365 admin center.

Open the Microsoft 365 admin center at https://admin.microsoft.com

Then go to "Settings", then "Org settings" and search for "Self-service trials and purchases". Then click on "Microsoft Teams Premium"

[![jv-media-8020-babad93e1a8c.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/disable-teams-premium-trial-button/jv-media-8020-babad93e1a8c.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/disable-teams-premium-trial-button/jv-media-8020-babad93e1a8c.png)

Then click on "Do not allow" and click "Save changes". This will now be processed through your tenant.

---

## Option 2: PowerShell

We can also disable this “Unlock Teams Premium” button with PowerShell and the MSCommerce module.

To install the MSCommerce PowerShell module, run:

{{< card code=true header="**PowerShell**" lang="powershell" >}}
Install-Module -Name MSCommerce -Force
{{< /card >}}

After the installation has been completed, run this command to connect to your Microsoft 365 tenant:

{{< card code=true header="**PowerShell**" lang="powershell" >}}
Connect-MSCommerce
{{< /card >}}

After connecting to your tenant and finishing the authentication, run this block to set Teams Premium to Disabled:

{{< card code=true header="**PowerShell**" lang="powershell" >}}
Get-MSCommerceProductPolicies -PolicyId AllowSelfServicePurchase | Where-Object { $_.ProductName -like "*Teams Premium*" } | ForEach-Object { Update-MSCommerceProductPolicy -PolicyId AllowSelfServicePurchase -ProductId $_.ProductId -Enabled $false }
{{< /card >}}

Then you can check the current status again with PowerShell or in the Microsoft 365 Admin Center:

{{< card code=true header="**PowerShell**" lang="powershell" >}}
Get-MSCommerceProductPolicies -PolicyId AllowSelfServicePurchase | Where-Object { $_.ProductName -like "*Teams Premium*" }
{{< /card >}}

Again an note here that the processing time can take up to **48 hours** for the button to be deleted in the Teams environment of end users.

---

## Summary

Disabling self-service trials and purchases for Microsoft Teams Premium removes the “Unlock Teams Premium” button from Microsoft Teams for your users (or prevents it from appearing after refresh). It also helps you keep license trials from starting by accident and reduces support questions from users.

Thank you for reading this post and I hope it was helpful!

### Sources

These sources helped me by writing and research for this post;

1. https://learn.microsoft.com/en-us/microsoft-365/commerce/subscriptions/manage-self-service-purchases-admins?view=o365-worldwide
2. https://learn.microsoft.com/en-us/microsoft-365/commerce/subscriptions/allowselfservicepurchase-powershell?view=o365-worldwide
3. https://www.powershellgallery.com/packages/MSCommerce/3.0

{{< ads >}}

{{< article-footer >}}