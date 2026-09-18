---
title: "New: 100GB mailbox size for Microsoft 365 Business Mailboxes"
slug: "new-100gb-mailbox-size-365-business"
date: 2026-09-13
tags:
- Concepts
categories:
- Microsoft 365
description: "Microsoft 365 Business Basic, Standard, and Premium mailboxes now support up to 100 GB of primary mailbox storage."
hidden: false
---

Microsoft has increased the mailbox size for Microsoft 365 Business subscriptions. And this is actually a pretty nice change! Users with Microsoft 365 Business Basic, Business Standard, or Business Premium can now have a primary mailbox of up to `100 GB`.

Previously, these subscriptions were limited to 50 GB. If you needed a bigger primary mailbox, an `Exchange Online Plan 2` license was often added just to get that extra storage. With this change, that is no longer needed in many situations.

---

## Which Microsoft 365 subscriptions receive 100 GB?

The nice thing about this change is that all three Microsoft 365 Business subscriptions get the larger mailbox. There is no additional license or configuration needed just to become eligible for it.

| Microsoft 365 subscription | Previous mailbox limit | New mailbox limit |
| --- | --- | --- |
| Microsoft 365 Business Basic | 50 GB | 100 GB |
| Microsoft 365 Business Standard | 50 GB | 100 GB |
| Microsoft 365 Business Premium | 50 GB | 100 GB |

With the new 100 GB mailbox, Microsoft also uses the following quota limits:

| Mailbox status | Quota |
| --- | --- |
| Warning | 98 GB |
| Prohibit sending | 99 GB |
| Prohibit sending and receiving | 100 GB |

So there is still some room between the first warning and a completely full mailbox. At 98 GB, the user will receive a warning that the mailbox is almost full.

When the mailbox reaches 99 GB, the user can still receive mail but can no longer send new messages. At 100 GB, Exchange Online blocks both sending and receiving until some space is made available again.

Good to know: Microsoft notes that service limit changes can take some time before they are available for every existing customer. So don't be surprised when one tenant or mailbox already shows 100 GB while another one still shows the old 50 GB limit.

---

## Exchange Online Plan 1 remains different

There is one important thing to keep in mind here. This change applies to the eligible Microsoft 365 Business subscriptions. It does **not** mean that Exchange Online Plan 1 suddenly also gets a 100 GB mailbox.

| Subscription or plan | Primary mailbox limit |
| --- | --- |
| Microsoft 365 Business Basic | 100 GB |
| Microsoft 365 Business Standard | 100 GB |
| Microsoft 365 Business Premium | 100 GB |
| Exchange Online Plan 1 | 50 GB |
| Exchange Online Plan 2 | 100 GB |

So when checking your licenses, make sure you look at the actual license assigned to the user.

A standalone Exchange Online Plan 1 license still gives you a 50 GB primary mailbox. Exchange Online Plan 2 still provides 100 GB. The change here is mainly that the Microsoft 365 Business licenses now also have that same 100 GB primary mailbox size.

---

## How to verify the effective mailbox quota

Of course, we don't just want to assume that the new quota is already active. We can easily check this with Exchange Online PowerShell.

First, install the Exchange Online PowerShell module if it is not already available:

{{< card code=true header="**PowerShell**" lang="powershell" >}}

Install-Module ExchangeOnlineManagement -Scope CurrentUser

{{< /card >}}

Then connect to Exchange Online:

{{< card code=true header="**PowerShell**" lang="powershell" >}}

Connect-ExchangeOnline

{{< /card >}}

Now specify the user principal name of the mailbox you want to check and retrieve its current quota:

{{< card code=true header="**PowerShell**" lang="powershell" >}}

$userId = "user@justinverstijnen.nl"

Get-Mailbox -Identity $userId |
    Format-List DisplayName,
        IssueWarningQuota,
        ProhibitSendQuota,
        ProhibitSendReceiveQuota,
        UseDatabaseQuotaDefaults

{{< /card >}}

Replace `user@justinverstijnen.nl` with the user principal name or email address of the mailbox you want to check.

When the mailbox has received the new limits, you should see something similar to this:

{{< card code=true header="**Plain text**" lang="text" >}}

IssueWarningQuota        : 98 GB
ProhibitSendQuota        : 99 GB
ProhibitSendReceiveQuota : 100 GB

{{< /card >}}

The most important value here is `ProhibitSendReceiveQuota`. This is the actual point where Exchange Online stops the mailbox from both sending and receiving messages.

If you want to check all user mailboxes in the tenant at once, we can also do that:

{{< card code=true header="**PowerShell**" lang="powershell" >}}

Get-Mailbox -RecipientTypeDetails UserMailbox -ResultSize Unlimited |
    Select-Object DisplayName,
        UserPrincipalName,
        IssueWarningQuota,
        ProhibitSendQuota,
        ProhibitSendReceiveQuota

{{< /card >}}

This gives you a quick overview of the quotas currently applied to all user mailboxes. Pretty useful when you want to check whether Microsoft has already rolled out the new limits across your tenant.

---

## Custom mailbox quotas still apply

There is one thing that can make the results a little confusing: custom mailbox quotas.

The license determines how large the mailbox is allowed to become, but an administrator can still configure a lower quota manually.

For example, a mailbox can be eligible for 100 GB while someone previously configured the mailbox with a maximum size of 20 GB. In that case, the mailbox will not suddenly jump to 100 GB just because the license now supports it.

We can check this with PowerShell as well:

{{< card code=true header="**PowerShell**" lang="powershell" >}}

$userId = "user@justinverstijnen.nl"

Get-Mailbox -Identity $userId |
    Select-Object DisplayName,
        UseDatabaseQuotaDefaults,
        IssueWarningQuota,
        ProhibitSendQuota,
        ProhibitSendReceiveQuota

{{< /card >}}

If the returned quota is still lower than expected, it is worth checking whether someone manually configured a custom quota on the mailbox in the past.

If needed, the following command can be used to configure the mailbox with the new limits. Before doing this, make sure you have the correct mailbox and verify that the assigned subscription actually supports a 100 GB primary mailbox.

{{< card code=true header="**PowerShell**" lang="powershell" >}}

$userId = "user@justinverstijnen.nl"

Set-Mailbox -Identity $userId `
    -IssueWarningQuota 98GB `
    -ProhibitSendQuota 99GB `
    -ProhibitSendReceiveQuota 100GB

{{< /card >}}

---

## Primary mailbox storage only

Another important detail: the new 100 GB limit is specifically for the user's `primary mailbox`.

It does not suddenly give the user a larger archive mailbox and it also does not add archive functionality to a subscription that did not already have it.

Shared mailboxes also have their own licensing rules. An unlicensed shared mailbox is still limited to `50 GB`. If you need a shared mailbox of up to `100 GB`, you will need to assign a suitable Exchange Online license to it.

So while 100 GB is becoming much more common now, it does not mean that every type of mailbox automatically gets 100 GB.

---

## What this means for administrators

For administrators, I think this is mainly a good moment to check why certain users currently have additional Exchange Online licensing.

If an eligible Microsoft 365 Business user received `Exchange Online Plan 2` only because the 50 GB primary mailbox was too small, that additional license might no longer be required now that the Business license itself supports 100 GB.

But don't immediately start removing all your Exchange Online Plan 2 licenses. Plan 2 contains more functionality than just a larger primary mailbox, so always check why the license was assigned before removing or changing anything.

The easiest approach is to first check the effective mailbox quota with PowerShell and then review the additional licenses for users that were only using them for mailbox capacity.

---

## Summary

Microsoft 365 Business Basic, Business Standard, and Business Premium now support primary mailboxes of up to 100 GB. Previously these subscriptions were limited to 50 GB, so this is a pretty nice free upgrade from Microsoft.

Administrators can use Exchange Online PowerShell to check whether the new quota is already active and to see if any custom mailbox quotas are still limiting the mailbox.

Especially for users who previously needed Exchange Online Plan 2 just to get a 100 GB primary mailbox, this change can be useful. Just make sure the Plan 2 license is not being used for any of its other features before removing it.

Overall, I really like this change. From Microsoft 365 Business Basic and up, we now have the same 100 GB primary mailbox size, which makes licensing a little easier as well.

Thank you for reading this post and I hope it was helpful!

### Sources

These sources helped me by writing and research for this post;

1. [https://learn.microsoft.com/en-us/office365/servicedescriptions/exchange-online-service-description/exchange-online-limits](https://learn.microsoft.com/en-us/office365/servicedescriptions/exchange-online-service-description/exchange-online-limits)
2. [https://learn.microsoft.com/en-us/troubleshoot/exchange/user-and-shared-mailboxes/increase-or-customize-mailbox-size](https://learn.microsoft.com/en-us/troubleshoot/exchange/user-and-shared-mailboxes/increase-or-customize-mailbox-size)

{{< ads >}}

{{< article-footer >}}