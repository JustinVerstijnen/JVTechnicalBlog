---
title: "Email security"
description: "This category contains some pages about how to increase your email security across all your owned domains by using various security mechanisms."
date: 2024-06-19
slug: "email-security"
tags:
  - Concepts
weight: 23
---

Email security is becoming more and more important, because email is still one of the main ways attackers try to get access to organizations.

Attackers know that email can be a very direct route to sensitive data, systems, and sometimes even privileged access. This often happens through users who are not aware of the risks, or who accidentally click something, share information, or approve access they should not.

To reduce the most basic risks, I’ve created a dedicated category with essential email security settings that should be applied to every domain we own. This also includes domains that are not actively used for sending or receiving email, because attackers can still abuse those domains for spoofing or impersonation.

In the pages in this category, I dive into how to configure different security mechanisms to enhance your email security, get the lowest amount of possible messages marked as spam and minimize the risk of your domain(s) being spoofed in various attacks happening every minute of the day.

---

## Check you domains' email security posture

To check your domains' email security posture based on configurations, I have made the DNS MEGAtool where you get an overview of the configuration within seconds.

<a class="btn btn-primary" href="https://tools.justinverstijnen.nl/dnsmegatool" target="_blank" rel="noreferrer">Use the DNS MEGAtool</a>

[![Image](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/what-is-tls-rpt/jv-media-8510-8d5e8234af20.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/what-is-tls-rpt/jv-media-8510-8d5e8234af20.png)

---

## Configure on any domain

The underlying security mechanisms must be configured on any domain you own in my opinion. Most companies have various stale/stand-by domains. Even there you should configure at least the basics. This will help you prevent spoofing and similar attacks.

### 1. SPF record

On all your domains, make sure you use an SPF record with a Hardfail policy active. If having stale/stand-by domains, configure the following:

{{< card code=true header="**Plain text**" lang="text" >}}v=spf1 -all{{< /card >}}

This says that no entity is trusted to send through your domain. Without this record, every entity on the internet is possibly trusted as you did not release any list of trusted senders. This depends on the configuration of recipients.

To configure SPF records for active domains, refer to my SPF guide:

<a class="btn btn-primary" href="https://justinverstijnen.nl/enhance-email-security-with-spf-dkim-dmarc/#spf---sender-policy-framework" target="_blank" rel="noreferrer">SPF record configuration guide</a>

### 2. DMARC record

On all your domains, make sure you use an DMARC record with a reject policy active. If having stale/stand-by domains, configure the following:

{{< card code=true header="**Plain text**" lang="text" >}}v=DMARC1; p=reject;{{< /card >}}

This will ensure that your domain is not available for spoofing anymore, as you released a policy that says: "If this domain is being used outside of my SPF and DKIM mechanisms, reject the email messages".

To configure DMARC records for active domains, refer to my DMARC guide:

<a class="btn btn-primary" href="https://justinverstijnen.nl/enhance-email-security-with-spf-dkim-dmarc/#dmarc---domain-based-message-authentication-reporting-and-conformance" target="_blank" rel="noreferrer">DMARC record configuration guide</a>

---

## Configure on sending/receiving domains

These records only have to be configured on domains where you send and receive email messages. They are all related to sending and receiving email messages.

### 3. DKIM record

Configure DKIM records for every service that sends email on your domain. Refer to my setup guide on to how to configure this and how DKIM helps you preventing man in the middle attacks by email.

<a class="btn btn-primary" href="https://justinverstijnen.nl/enhance-email-security-with-spf-dkim-dmarc/#dkim---domain-keys-identified-mail" target="_blank" rel="noreferrer">DKIM record configuration guide</a>

### 4. TLS-RPT record

Configure a TLS-RPT record to receive TLS deliverability reports by senders to your domain to detect possible email deliverability problems before they cost you customers and possible projects.

<a class="btn btn-primary" href="https://justinverstijnen.nl/what-is-tls-rpt/" target="_blank" rel="noreferrer">TLS-RPT record configuration guide</a>

### 5. MTA-STS record

Configure a MTA-STS record including policy to increase email security by leveraging the MTA-STS protocol.

<a class="btn btn-primary" href="https://justinverstijnen.nl/what-is-mta-sts-and-how-to-protect-your-email-flow/" target="_blank" rel="noreferrer">MTA-STS record configuration guide</a>

### 6. SMTP DANE (supported services only)

If using Microsoft 365, configure SMTP DANE to further increase email security by leveraging the DNSSEC protocol.

<a class="btn btn-primary" href="https://justinverstijnen.nl/configure-dnssec-and-smtp-dane-with-exchange-online-microsoft-365/" target="_blank" rel="noreferrer">SMTP DANE record configuration guide</a>

{{< ads >}}

---