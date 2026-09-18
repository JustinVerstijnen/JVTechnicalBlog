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

Microsoft has increased the mailbox storage limit for Microsoft 365 Business subscriptions. Users with Microsoft 365 Business Basic, Business Standard, or Business Premium can now have a primary mailbox of up to `100 GB`. Previously, these subscriptions supported a primary mailbox of up to 50 GB. This change gives users more space without requiring an `Exchange Online Plan 2` subscription solely to obtain a larger primary mailbox.

## Which Microsoft 365 subscriptions receive 100 GB?

Every Microsoft 365 Business license will benefit from this free gift of Microsoft:

| Microsoft 365 subscription | Previous mailbox limit | New mailbox limit |
| --- | --- | --- |
| Microsoft 365 Business Basic | 50 GB | 100 GB |
| Microsoft 365 Business Standard | 50 GB | 100 GB |
| Microsoft 365 Business Premium | 50 GB | 100 GB |

The new capacity limits are:

| Mailbox status | Quota |
| --- | --- |
| Warning | 98 GB |
| Prohibit sending | 99 GB |
| Prohibit sending and receiving | 100 GB |

Good to know: when a mailbox reaches 98 GB, the user receives only a warning. At 99 GB, the user can no longer send new messages. When the mailbox reaches 100 GB, Exchange Online prevents the mailbox from sending and receiving messages until sufficient space is available again.

Microsoft notes that service limit changes can take time to reach all existing customers. This means that administrators might not immediately see the new quota on every eligible mailbox.

## Exchange Online Plan 1 remains different

The new limit is connected to the eligible Microsoft 365 Business subscriptions. It does not change the standalone Exchange Online Plan 1 mailbox limit.

| Subscription or plan | Primary mailbox limit |
| --- | --- |
| Microsoft 365 Business Basic | 100 GB |
| Microsoft 365 Business Standard | 100 GB |
| Microsoft 365 Business Premium | 100 GB |
| Exchange Online Plan 1 | 50 GB |
| Exchange Online Plan 2 | 100 GB |

This distinction is important when reviewing user licenses. A standalone Exchange Online Plan 1 license continues to provide a 50 GB primary mailbox, while Exchange Online Plan 2 provides a 100 GB primary mailbox.

## Verify the effective mailbox quota

Administrators can use Exchange Online PowerShell to check the quota currently applied to a mailbox.

First, install the Exchange Online PowerShell module if it is not already available:

{{< card code=true header="**PowerShell**" lang="powershell" >}}
Install-Module ExchangeOnlineManagement -Scope CurrentUser
{{< /card >}}

Connect to Exchange Online:

{{< card code=true header="**PowerShell**" lang="powershell" >}}
Connect-ExchangeOnline
{{< /card >}}

Specify the user principal name of the mailbox and retrieve its quota:

{{< card code=true header="**PowerShell**" lang="powershell" >}}
$userId = "user@justinverstijnen.nl"

Get-Mailbox -Identity $userId |
    Format-List DisplayName,
        IssueWarningQuota,
        ProhibitSendQuota,
        ProhibitSendReceiveQuota,
        UseDatabaseQuotaDefaults
{{< /card >}}

Replace `user@justinverstijnen.nl` with your user principal name or email address of the mailbox you want to check.

For a mailbox that has received the new limits, the output should show values similar to:

{{< card code=true header="**Plain text**" lang="text" >}}
IssueWarningQuota        : 98 GB
ProhibitSendQuota        : 99 GB
ProhibitSendReceiveQuota : 100 GB
{{< /card >}}

The `ProhibitSendReceiveQuota` property represents the point at which Exchange Online prevents the mailbox from sending and receiving messages.

To check the effective quota for all user mailboxes, run:

{{< card code=true header="**PowerShell**" lang="powershell" >}}
Get-Mailbox -RecipientTypeDetails UserMailbox -ResultSize Unlimited |
    Select-Object DisplayName,
        UserPrincipalName,
        IssueWarningQuota,
        ProhibitSendQuota,
        ProhibitSendReceiveQuota
{{< /card >}}

This provides an overview of the quotas applied to each user mailbox and helps identify mailboxes that still use the previous limits.

## Custom mailbox quotas still apply

The license determines the maximum supported mailbox size, but administrators can configure a lower custom quota for an individual mailbox.

For example, a mailbox might be eligible for 100 GB while still having a manually configured limit of 20 GB. The higher license entitlement does not automatically remove that custom configuration.

You can check for custom quota values with:

{{< card code=true header="**PowerShell**" lang="powershell" >}}
$userId = "user@justinverstijnen.nl"

Get-Mailbox -Identity $userId |
    Select-Object DisplayName,
        UseDatabaseQuotaDefaults,
        IssueWarningQuota,
        ProhibitSendQuota,
        ProhibitSendReceiveQuota
{{< /card >}}

If the returned quota remains lower than expected, review whether a custom quota was previously assigned to the mailbox. The following command changes the mailbox quota. Verify the mailbox identity and confirm that its assigned subscription supports a 100 GB primary mailbox before running it.

{{< card code=true header="**PowerShell**" lang="powershell" >}}
$userId = "user@justinverstijnen.nl"

Set-Mailbox -Identity $userId `
    -IssueWarningQuota 98GB `
    -ProhibitSendQuota 99GB `
    -ProhibitSendReceiveQuota 100GB
{{< /card >}}

## Primary mailbox storage only

The new 100 GB limit applies to the user's `primary mailbox`. It does not increase archive mailbox storage or add archive functionality to a subscription.

Shared mailboxes follow separate licensing rules. An unlicensed shared mailbox is limited to `50 GB`. A suitable Exchange Online license is required when a shared mailbox needs a capacity of up to `100 GB`.

## What this means for administrators

Administrators should check whether eligible Microsoft 365 Business mailboxes have received the updated quota before assigning additional licensing solely for mailbox capacity.

Users who previously received `Exchange Online Plan 2` only to increase their primary mailbox from 50 GB to 100 GB might no longer need that additional plan. However, Exchange Online Plan 2 includes other capabilities, so review the complete licensing requirements before removing or changing an existing license.

## Summary

Microsoft 365 Business Basic, Business Standard, and Business Premium now support primary mailboxes of up to 100 GB. Administrators can use Exchange Online PowerShell to verify the effective quota and identify custom mailbox settings that might prevent an eligible mailbox from using the updated capacity. This is great so every mailbox now has the same size from 365 Business Basic and up.

Thank you for reading this post and I hope it was helpful!

### Sources

These sources helped me by writing and research for this post;

1. https://learn.microsoft.com/en-us/office365/servicedescriptions/exchange-online-service-description/exchange-online-limits
2. https://learn.microsoft.com/en-us/troubleshoot/exchange/user-and-shared-mailboxes/increase-or-customize-mailbox-size

{{< ads >}}

{{< article-footer >}}
