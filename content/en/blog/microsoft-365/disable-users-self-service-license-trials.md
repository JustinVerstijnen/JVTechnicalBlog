---
title: "Disable users' self service license trials"
date: 2025-12-04
slug: "disable-users-self-service-license-trials"
categories:
  - Microsoft 365
tags:
  - Step by Step guides
description: >
  One day I came across an option in Microsoft 365 to disable the users' self service trials. You must have seen it happening in your ten...
---
One day I came across an option in Microsoft 365 to disable the users' self service trials. You must have seen it happening in your tenants, users with free licenses for Power Automate, Teams or Power BI. I will show you how to disable those and only let administrators buy and assign new licenses.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/disable-users-self-service-license-trials-5454/jv-media-5454-b2e8595ef8fb.png)

---

---

## Why should you disable trial licenses?

You can disable self service trial licenses if you want to avoid users to use un-accepted apps. This could result in shadow-it happening in your environment.

Let's say, your company uses Zoom to call with each other, and users are starting to use Microsoft Teams. Teams then is an application not accepted by your organization and users then should not be able to use it. If you give them the possibility, they will. This all of course assuming you don't have paid licenses for Microsoft Teams.

---

## How to disable self service purchases - GUI

To disable those purchases from happening in the GUI, open up Microsoft 365 admin center.

Then go to "Settings", "Org settings" and then "Self-service trials and purchases".

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/disable-users-self-service-license-trials-5454/jv-media-5454-9744e127ac83.png)

Here you get a list of all the possible products you could disable individually. Unfortunately, for disabling everything, you must do this manually for all (at the moment 27) items. The good thing is, PowerShell can actually do this for us.

Click on your license to be disabled, and click on "Do not allow". Then save the setting to apply it to your users.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/disable-users-self-service-license-trials-5454/jv-media-5454-68a5c44f6e6d.png)

---

## How to disable self service purchases - PowerShell

There is a PowerShell module available that contains multiple options for billing and commerce options. This is [the MSCommerce module](https://www.powershellgallery.com/packages/MSCommerce/2.3), and can be installed using ths command:

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
Install-Module -Name MSCommerce
{{< /card >}}

After this module is installed, run this commando to login into your environment:

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
Connect-MSCommerce
{{< /card >}}

Then login to your environment, complete the MFA challenge and you should be logged in.

Run this command to get all the trial license options:

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
Get-MSCommerceProductPolicies -PolicyId AllowSelfServicePurchase
{{< /card >}}

This will return the list of all possible trial licenses, just like you got in the GUI.

To disable all trial licenses at once, run this:

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
Get-MSCommerceProductPolicies -PolicyId AllowSelfServicePurchase |
    ForEach-Object {
        Update-MSCommerceProductPolicy -PolicyId AllowSelfServicePurchase `
                                       -ProductId $_.ProductId `
                                       -Enabled $false
    }
{{< /card >}}

PowerShell will now initiate a loop that sets the status of every license to "Disabled":

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/disable-users-self-service-license-trials-5454/jv-media-5454-1448fd2f43fb.png)

After the simple script has run succesfully, all trial license options should be disabled in the Microsoft 365 Portal:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/disable-users-self-service-license-trials-5454/jv-media-5454-c44f4f015f67.png)

And thank you once again PowerShell for saving a ton of clicks :)

---

## Summary

Disabling the trial licenses is generally a good idea to avoid users from using services you don't generally accept. You can technically still get trial licenses but an administrator has to approve them now by changing the status of the license.

Most of the time it's better to use a paid license as trial, because you would have access to all features.

Thank you for reading this guide and I hope it was helpful.

### Sources

These sources helped me by writing and research for this post;

1. <https://learn.microsoft.com/en-us/microsoft-365/commerce/subscriptions/manage-self-service-purchases-admins?view=o365-worldwide>
2. <https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/foreach-object?view=powershell-7.5>

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
