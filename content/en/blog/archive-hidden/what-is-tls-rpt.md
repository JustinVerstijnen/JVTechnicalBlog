---
title: "What is TLS-RPT and Why Should You Use It?"
slug: "what-is-tls-rpt"
date: 2026-06-01
tags:
- Concepts
- Step by Step guides
categories:
- Microsoft 365
description: "In this post I will explain TLS-RPT which is an email security reporting mechanism that gives you reports about TLS encryption problems for incoming email to your domain. In this guide, I will explain what TLS-RPT is, how it works and how you can configure it easily for your domains."
hidden: false
---

## What is TLS-RPT

TLS-RPT stands for **SMTP TLS Reporting**. It is an email security reporting mechanism that gives you reports about TLS encryption problems for incoming email to your domain. The main goal is simple: it helps you see if other mail servers can securely connect to your mail environment using TLS and where problems happen. In simple terms, TLS-RPT is a reporting layer for secure mail transport.

We can enable SMTP TLS Reporting by publishing a TXT record on our domain, stating on what email address the recipient can deliver the reports to.

[![jv-media-8510-fa0d41508183.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/what-is-tls-rpt/jv-media-8510-fa0d41508183.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/what-is-tls-rpt/jv-media-8510-fa0d41508183.png)

_TLS-RPT as defined in RFC 8460._

---

## TLS-RPT versus other email security technologies

Different email security technologies all have their own purpose.

| Technology | Purpose |
| --- | --- |
| SPF / DKIM / DMARC | Checks if the sender is legitimate |
| TLS | Encrypts the connection between mail servers |
| MTA-STS / DANE | Tells sending servers to use secure TLS |
| TLS-RPT | Reports if secure delivery succeeds or fails |

Important to know:

TLS-RPT does not secure or enforce anything by itself. It only sends reports.

The actual enforcement is normally done by technologies like MTA-STS or DANE.

---

## How TLS-RPT Works

To use TLS-RPT, you publish a DNS TXT record on:

```
_smtp._tls.yourdomain.com
```

Example:

```
v=TLSRPTv1; rua=mailto:tlsrpt@yourdomain.com
```

You can also use HTTPS reporting:

```
v=TLSRPTv1; rua=https://reporting.yourdomain.com/v1/tlsrpt
```

The `rua` value defines where the reports should be sent.

TLS-RPT supports reporting through:

- mailto:
- https:

---

## What Happens After Enabling TLS-RPT

When another mail server tries to send email to your domain, it can detect your TLS-RPT DNS record.

If that sending server supports TLS-RPT, it can send periodic reports, usually daily, to the address or HTTPS endpoint you configured.

These reports contain information like:

| Information | Meaning |
| --- | --- |
| Successful TLS sessions | Secure connection worked |
| Failed TLS sessions | TLS failed or certificate issues happened |
| MTA-STS status | Which policy was detected and applied |
| MX host | Which mail server received the mail |
| Error type | Certificate issue, DNS issue or policy mismatch |
| Counts | How many successful or failed connections happened |

Reports can also include issues related to:

- DNS resolution
- STARTTLS negotiation
- DANE validation
- MTA-STS validation
- Routing problems

---

## What TLS-RPT Helps You Detect

TLS-RPT helps you understand if email delivery to your domain is secure and working correctly.

Common problems it can detect:

| Problem | Example |
| --- | --- |
| Expired certificate | External servers no longer trust your certificate |
| Wrong certificate | Certificate name does not match the MX host |
| MTA-STS issue | Policy contains different MX records than your actual mail flow |
| TLS unavailable | Receiving server does not support proper TLS |
| DNS or configuration issue | External servers cannot find your policy or mail server correctly |

Google also mentions problems like:

- Expired TLS certificates
- Invalid certificate names
- Untrusted certificates
- Missing support for secure protocols

---

## Simple Microsoft 365 Example

Imagine your domain is:

```
bedrijf.nl
```

Your email runs through Microsoft 365:

```
bedrijf-nl.mail.protection.outlook.com
```

You enable TLS-RPT with this DNS record:

```
_smtp._tls.bedrijf.nl TXT "v=TLSRPTv1; rua=mailto:tlsrpt@bedrijf.nl"
```

After this, supported sending mail servers can report whether they could securely deliver email to `bedrijf.nl`.

---

## TLS-RPT and MTA-STS

TLS-RPT is commonly used together with MTA-STS.

MTA-STS basically says:

> “Mail for my domain must use TLS, a valid certificate and the correct MX servers.”

TLS-RPT says:

> “Send me reports if this succeeds or fails.”

Microsoft describes MTA-STS as a method where a domain publishes TLS support, expected MX records and certificate requirements through DNS and an HTTPS policy file.

---

## Should You Use TLS-RPT

For professional domains, the answer is usually yes.

Especially if you use:

- Microsoft 365
- Google Workspace
- A third-party email gateway
- Your own mail infrastructure

A practical approach is:

1. Enable TLS-RPT first
2. Monitor the reports for some time
3. Configure MTA-STS in testing mode
4. Move MTA-STS to enforce after everything works correctly

This helps you avoid blocking legitimate email because of configuration mistakes.

---

## Summary

TLS-RPT is basically DMARC-style reporting for TLS and secure mail transport. It helps you understand whether other mail servers can securely deliver email to your domain using TLS. TLS-RPT itself does not stop attacks or enforce encryption, but it gives visibility into certificate problems, downgrade risks, DNS issues and MTA-STS problems. Enabling the option therefore does not make your environment more secure. Its more a reporting mechanism for more insights of possible delivery failures.

Thank you for reading this post and I hope it was helpful!

### Sources

These sources helped me by writing and research for this post;

1. https://datatracker.ietf.org/doc/html/rfc8460
2. https://support.google.com/a/answer/10032169
3. https://learn.microsoft.com/en-us/exchange/security-and-compliance/mail-flow-best-practices/mta-sts-and-tls-reporting
4. https://datatracker.ietf.org/doc/html/rfc8461

{{< ads >}}

{{< article-footer >}}