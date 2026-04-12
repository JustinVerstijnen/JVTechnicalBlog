---
title: "Dynamic Distribution Groups in Microsoft 365"
date: 2023-10-21
slug: "dynamic-distribution-groups-in-microsoft-365"
categories:
  - Microsoft 365
tags:
  - Step by Step guides
description: >
  This guide explains how Exchange Online Dynamic Distribution Groups work, how to create and maintain them with Microsoft 365.
---
Sometimes you want to have a distribution group with all your known mailboxes in it. For example an employees@justinverstijnen.nl or all@justinverstijnen.nl address to send a mail company wide. A normal distribution group is possible, but requires a lot of manual maintenance, like adding and removing users.

To apply a little more automation you can use the Dynamic Distribution Group feature of Exchange Online. This is a feature like the Dynamic groups feature of Microsoft Entra which automatically adds new user mailboxes after they are created to make sure every new employee is added automatically.

---

---

## Requirements

- Around 15 minutes
- Exchange Online Powershell module

---

## Creating a Dynamic Distribution Group

To create a dynamic distribution group, go to the Exchange Online Admin center (admin.exchange.microsoft.com)

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/create-a-catch-all-mailbox-in-exchange-online-2480/jv-media-2480-ef62a128709c.png)

When you create a group, select the option "Dynamic distribution" and fill in the details.

At the step "Users" you have to select "Users with Exchange mailboxes" to only include users, no shared mailboxes, external/guest users or resource mailboxes.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/introduction-to-networks-940/jv-media-940-8f8766ca136e.png)

Define an email address and finish the wizard.

---

## Delivery Management whitelist

To define which users are allowed to email to the group, you can configure delivery management which acts as a whitelist for the dynamic distribution group. Only the users defined may send to the group.

After creating the mailbox, go to Groups and then Dynamic distribution list and select the group.

Go to the tab "Settings" and click "edit delivery management".

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/dynamic-distribution-groups-in-microsoft-365-251/jv-media-251-c338a1c8a9c6.png)

Here you can define the users who may send and a general advice to restrict mailing only from the same orgainzation.

---

## How to exclude mailboxes from the dynamic

It is possible to exclude mailboxes from the dynamic distribution group, but it is not possible in the Admin center. This is possible with Powershell.

My way to do it is to use the attribute field CustomAttribute1 and put "exclude\_from\_employees" in it without the quotes. In the filter of the dynamic distribution group we select all user mailboxes but not when they have the attribute "exclude\_from\_employees".

To configure the attribute filter, we login into Exchange Online Powershell:

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
Connect-ExchangeOnline
{{< /card >}}

To configure the filter itself, we run the following script:

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
$employees = "Name of distributiongroup"
Set-DynamicDistributionGroup -Identity $employees -RecipientFilter "(Recip
ientTypeDetails -eq 'UserMailbox') -and (CustomAttribute1 -ne 'exclude_from_employees')"
{{< /card >}}

After running these commands succesfully you can add the attribute from the Exchange Online admin center in a mailbox. To add this attribute, open a mailbox;

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/dynamic-distribution-groups-in-microsoft-365-251/jv-media-251-f2b6b9769301.png)

Go to "Custom Attributes" and add the attribute like shown below;

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/dynamic-distribution-groups-in-microsoft-365-251/jv-media-251-f6fe3e17bc86.png)

When a mailbox had this attribute in field 1, it will be excluded from the dynamic distribution group.

---

## Check recipients of dynamic distribution group

To check all recipients of the distribution group, you can run the following command when logged in into Exchange Online Powershell:

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
$employees = Get-DynamicDistributionGroup -Identity *EMAILADDRESS*
Get-Recipient -RecipientPreviewFilter ($employees.RecipientFilter)
{{< /card >}}

Just change the Email Address to your own created dynamic distribution group and all recipients will show. Now you have the list of all email addresses the system considers as "members".

---

## Check excluded recipients of dynamic distribution group

To check which mailboxes does not receive email from the dynamic distribution group, you can run the following;

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
Get-Mailbox | where {$_.CustomAttribute1 -eq "exclude_from_employees"}
{{< /card >}}

This command will return all users with the created attribute and who does not receive the email.

---

## Summary

Dynamic Distribution Groups are an excellent way to minimize administrative effort while maintaining some internal addresses for users to send mail to. It is really good as a "all-employees" distribution group where you never have to add or remove users from when employees come and leave. The more automation, the better.

I hope this guide was helpful and thank you for reading!

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
