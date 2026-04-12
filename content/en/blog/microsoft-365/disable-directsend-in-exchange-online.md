---
title: "Disable DirectSend in Exchange Online"
date: 2025-05-04
slug: "disable-directsend-in-exchange-online"
categories:
  - Microsoft 365
description: >
  Microsoft has published a new command to completely disable the unsafe DirectSend protocol in your Microsoft 365 environment. In this...
---
Microsoft has published a new command to completely disable the unsafe DirectSend protocol in your Microsoft 365 environment. In this guide I will explain what DirectSend is, why you should disable this and how we can achieve this.

---

---

## What is DirectSend?

DirectSend (Microsoft 365) lets devices or applications (like printers, scanners, or internal apps) send email directly to users inside your organization without authentication. Instead of using authentication, it uses your MX record directly with port 25.

Some details about DirectSend:

- Only works for internal recipients (same tenant)
- No mailbox or license required for the sending device/app
- Uses SMTP to your tenant’s MX endpoint
- Commonly used for scanners, alerts, and legacy systems
- Does not support sending to external email addresses
- Possibly exposing public IP addresses in your DNS records

We can see it like a internal relay, possible to send email to all users in your tenant, which is actively used to distribute malicious activity. This consists of sending mailware or credential harvesting, bypassing different security controls active on normal email.

---

## Why DirectSend is a security risk

Lets take a look into DirectSend en why this is a security risk, and a protocol which we must have disabled:

- No authentication is required, so any device or system that can reach your MX endpoint may be able to send email as your domain
- This makes it easier to spoof internal senders, which can be abused for phishing or social-engineering attacks
- Compromised devices (printers, scanners, servers) can be used to send malicious emails internally without triggering normal account protections
- There’s no user identity, so auditing and tracing who actually sent a message is harder
- It bypasses protections like MFA and Conditional Access, since no sign-in happens
- If network access is misconfigured, outsiders could potentially abuse Direct Send

---

## Disable DirectSend with Exchange Online PowerShell

Let's get into the part of disabling DirectSend for Exchange Online. First, ensure you have the [Exchange Online Management PowerShell module installed.](https://www.powershellgallery.com/packages/ExchangeOnlineManagement/3.2.0)

Let's connect to your Microsoft 365 environment using the command below:

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
Connect-ExchangeOnline
{{< /card >}}

Login to your account with Global Administrator permissions.

Then execute this command to disable DirectSend tenant-wide:

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
Set-OrganizationConfig -RejectDirectSend $true
{{< /card >}}
{{% alert color="info" %}}
To re-enable DirectSend, just change the $true boolean to $false.
{{% /alert %}}

If you want to check the status before or after the set command, you can use this command:

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
Get-OrganizationConfig | Select -Expand RejectDirectSend
{{< /card >}}

Thats all. :)

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/disable-directsend-in-exchange-online-6827/jv-media-6827-b418a4a00a96.png)

If an email is now sent using DirectSend, the following error will occur:

```text
550 5.7.68 TenantInboundAttribution; Direct Send not allowed for this organization from unauthorized sources
```

Exactly what we wanted to achieve.

---

## Summary

Disabling DirectSend on your Microsoft 365 tenant enhances your email security for a bit, and helps your users being secure. If you are planning on disabling DirectSend, I recommend doing this outside of business hours, giving you time to fix possible email disruptions.

We cannot disable DirectSend on specific users first, this is because its an tenant-wide setting. Because we have no authentication, this would theoretically impossible.

Thank you for reading this guide and I hope it was helpful.

### Sources

These sources helped me by writing and research for this post;

1. <https://techcommunity.microsoft.com/blog/exchange/introducing-more-control-over-direct-send-in-exchange-online/4408790>

{{< ads >}}

{{< article-footer >}}
