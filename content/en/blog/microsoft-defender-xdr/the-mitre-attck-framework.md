---
title: "The MITRE ATTACK Framework"
date: 2024-11-25
slug: "the-mitre-attck-framework"
categories:
  - Microsoft Defender XDR
tags:
  - Concepts
description: >
  How does the MITRE ATTACK framework work? Let's find out in this guide.
---
The MITRE ATTACK (ATT&CK) Framework is a framework which describes all stages and methods cyberattacks attacks are launched on companies in the last 15 years. The main purpose of the framework is to help Red and Blue security teams to harden their systems and to provide a library of known attacks to help mitigate them.

MITRE is the organization who is in charge of this community-driven framework and is a non-profit organization. ATT&CK stands for:

- Adversary -> Our opponents
- Tactics
- Techniques
- Common Knowledge

The framework itself can help organizations help to secure their environment really good, but keep in mind that the framework is built based on known attacks and techniques. It doesn't cover new techniques where an organization can be vulnerable to.

---

## The framework itself

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/create-a-catch-all-mailbox-in-exchange-online-2480/jv-media-2480-dfde3a7edc08.png)

The framework can be found on this website: [MITRE ATT&CK®](https://attack.mitre.org/)

---

## The stages of a cyberattack

Each cybersecurity attack follows multiple or all stages below. Also, i added a summary of that the stage contains:

|  |  |
| --- | --- |
| **Stage** | **Primary goal** |
| Reconnaissance | Gathering information prior to the attack |
| Resource Development | Aquiring the components to perform the attack |
| Initial Access | Initial attempts to get access, the attack starts |
| Execution | Custom-made code (if applicable) will be executed by the adversary |
| Persistence | The attacker wants to keep access to the systems by creating backdoors |
| Privilege Escalation | The attacker tries to get more permissions than he already has |
| Defense Evasion | The attacker wants to avoid detection for a "louder bang" |
| Credential Access | Stealing account names and passwords |
| Discovery | Performing a discovery of the network |
| Lateral Movement | Aquire access to critical systems |
| Collection | Collecting data which often is sensitive/PII\* data |
| Command and Control | The attacker has full control over the systems and can install malware |
| Exfiltration | The attacker copies the collected data out of the victims network to his own storage |
| Impact | The attacker destroys your systems and data |

*\*PII: Personal Identifible Information*, *like birth names and citizen service numbers*

The attack stages are described very consise, but the full explaination can be found on the official website.

---

## Summary

The MITRE ATT&CK framework is a very great framework to get a clear understanding about what techniques and tactices an attacker may use. This is can be a huge improvement by securing your systems by thinking like a attacker.

The best part about the framework are the mitigation steps where you can implement changes to prevent attacks that already happend with a big impact.

{{< ads >}}

{{< article-footer >}}
