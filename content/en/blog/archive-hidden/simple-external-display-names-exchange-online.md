---
title: "Simple external display names Exchange Online"
slug: "simple-external-display-names-exchange-online"
date: 2026-10-01
tags:
- Microsoft 365
- Exchange Online
- Email Security
categories:
- Microsoft 365
---

When working in a multi-company organization, external email tagging in Exchange Online can quickly become messy.

A common setup is adding a warning or prefix like:

- `[External]`
- `[EXTERNAL EMAIL]`
- `[Outside Organization]`

This works fine for most environments, but it becomes confusing when users constantly communicate between sister companies, subsidiaries, MSP tenants or acquired organizations.

For example:

- Company A users email Company B daily
- Both companies are owned by the same group
- Users trust each other already
- But Exchange Online still marks every message as external

The result is users slowly ignoring external warnings completely, which is not what we want from a security perspective.

In this post I will explain a cleaner way to handle external display names in Exchange Online while still keeping visibility for truly external senders.

---

## The problem with default external tagging

Microsoft 365 can prepend external sender labels automatically or through mail flow rules.

This is useful because users immediately see when an email comes from outside the tenant.

The issue starts when:

- multiple tenants work closely together
- users communicate across tenants all day
- mergers and acquisitions exist
- MSP environments manage separate tenants
- hybrid business structures are used

In those situations, users constantly see external warnings for trusted partner organizations.

Eventually users stop paying attention.

That reduces the value of external sender identification completely.

---

## A better approach

Instead of treating every external sender the same, we can separate trusted organizations from unknown external senders.

The idea is simple:

- Trusted partner companies get a cleaner display name
- Real external senders still receive warning labels

This keeps security awareness useful instead of noisy.

For example:

| Sender type | Example |
| --- | --- |
| Trusted sister company | `John Smith (CompanyB)` |
| Unknown external sender | `[External] John Smith` |

This gives users much better context.

---

## Using Exchange Online mail flow rules

One practical way to handle this is with Exchange Online mail flow rules.

You can create exceptions for trusted domains.

For example:

- companyb.com
- subsidiary.local
- trustedpartner.nl

Messages from those domains can bypass the aggressive external warning.

Meanwhile all other external mail still gets tagged.

---

## Example setup

A common setup looks like this:

### Rule 1: Trusted external organizations

Conditions:

- Sender domain matches trusted domains

Actions:

- Set a cleaner subject or display handling
- Skip external warning prepend

### Rule 2: All other external senders

Conditions:

- Sender is external

Actions:

- Prepend `[External]`
- Apply warning banner
- Add mail tip or disclaimer

This creates a much cleaner experience for users.

---

## Example PowerShell commands

You can manage mail flow rules from Exchange Online PowerShell.

Example for creating an external warning rule:

{{< card code=true header="**PowerShell**" lang="powershell" >}}
New-TransportRule `
-Name "External Email Warning" `
-FromScope NotInOrganization `
-ExceptIfSenderDomainIs "companyb.com","subsidiary.nl" `
-PrependSubject "[External] "
{{< /card >}}

This example excludes trusted domains from the warning prefix.

You can also combine this with HTML disclaimers or mail tips if needed.

---

## Things to keep in mind

A few practical recommendations:

- Keep the trusted domain list small
- Review the list regularly
- Do not blindly trust every external partner
- Combine this with phishing protection policies
- Educate users about what the labels mean

Also remember that external tagging is only one layer of protection.

Microsoft Defender for Office 365, anti-phishing policies and user awareness remain important as well.

---

## My opinion on this setup

I personally think this approach works much better in larger organizations and MSP environments.

Users still see warnings for unknown senders, but daily collaboration between trusted organizations becomes much cleaner and easier to read.

Especially in environments with:

- multiple Microsoft 365 tenants
- shared projects
- acquisitions
- B2B collaboration

this can remove a lot of unnecessary noise from Outlook.

---

## Summary

External email tagging in Exchange Online is useful, but in multi-company organizations it can quickly become overwhelming for users.

By separating trusted partner organizations from unknown external senders, you can keep the warning system useful while improving the user experience significantly.

A small adjustment in Exchange Online mail flow rules can make Outlook much cleaner and help users focus on actual suspicious emails instead of ignoring every external warning they see.

### Sources

These sources helped me by writing and research for this post;

1. Microsoft Learn - Mail flow rules (transport rules) in Exchange Online - https://learn.microsoft.com/exchange/security-and-compliance/mail-flow-rules/mail-flow-rules
2. Microsoft Learn - Exchange Online PowerShell - https://learn.microsoft.com/powershell/exchange/connect-to-exchange-online-powershell
3. https://alexhaynes.com/blog/simplifying-external-email-display-names-in-exchange-online-for-multi-company-organizations/146

Thank you for reading this post and I hope it was helpful!

{{< ads >}}

{{< article-footer >}}