---
title: "Microsoft Defender External Attack Surface Management (EASM)"
date: 2024-12-01
slug: "microsoft-defender-external-attack-surface-management"
categories:
  - Microsoft Defender XDR
tags:
  - Concepts
description: >
  Microsoft Defender External Attack Surface Management (EASM) is a security solution for an organization's external attack surfaces. It ope...
---
**Microsoft Defender External Attack Surface Management (EASM)** is a security solution for an organization's external attack surfaces. It operates by monitoring security and operational integrity across the following assets:

- Websites
- IP addresses
- Domains
- SSL certificates
- Other digital assets

In addition to these components, EASM can also forward all relevant information and logs to SIEM solutions such as Microsoft Sentinel.

It is also possible to manually input company-specific data, such as all domain names and IP addresses associated with its services.

The costs for this solution are minimal; you pay €0.01 per day per host, domain, or IP address added. For example, I configured it with **10 instances of each**, resulting in a total monthly cost of **€9.17**. The costs are billed on your Azure invoice.

---

## Best features of Microsoft Defender EASM

The best features of this solution include:

- Open port scanning on IP addresses
- SSL certificate monitoring + expiration date checks
- Domain name checks + expiration date verification
- Scanning for potential CVE score vulnerabilities
- Identifying common administrative misconfigurations
- Web server assessments based on OWASP guidelines
- Tracking changes in assets

Here, for example, you can see a common vulnerability detected in servers, even when running in environments such as Amazon Web Services (AWS):

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/create-a-catch-all-mailbox-in-exchange-online-2480/jv-media-2480-a1dcfb0f21db.png)

---

## Summary

To summarize this solution, its a must-need for organizations who want security on every level. Security is like a team sport, it has to be great on every level. Not just one level. This solution will help you achieve this.

{{< ads >}}

{{< article-footer >}}
