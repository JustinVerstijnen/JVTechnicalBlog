---
title: "The Zero Trust-model"
date: 2024-11-25
slug: "the-zero-trust-model"
categories:
  - Microsoft Entra
tags:
  - Concepts
description: >
  The Zero Trust model is a widely approved approach to secure an IT environment. What is it and what does it stand for? You read it in this guide.
---
The Zero Trust model is a security model to enhance your security posture by using 3 basic principles, and segmenting aspects of your IT environment into pillars.

The 3 primary principles are:

- Verify Explicitly
- Least privileged access
- Assume Breach

At first, those terms seem very unclear to me. To further clarify the principles, i have added some practice examples to further understand what they mean:

|  |  |
| --- | --- |
| **Principle** | **Outcomes** |
| Verify Explicity | Ensure people are really who they say they are   Audit every login attempt from specific users   Audit login attempts   Block access from non-approved countries |
| Least privileged access | Assign users only the permissions they need, not more   Assign only the roles when they need them using PIM   Use custom roles when default roles expose too much permissions |
| Assume breach | At every level, think about possible breaches   Segment your network   Password-based authentication only is too weak |

The model is the best illustrated like this:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/the-zero-trust-model-555/jv-media-555-ee4818ad868b.png)

Your security posture can be seen as a building. The principles are the foundation, and all aspects in a organization are the pillars.

The fun fact in this model is, that if the foundation and/or one of the pillars are not secured enough, your security posture collapses like a unstable building.

A fun example of this can be a 5 million dollar cybersecurity budget, but users are not using strong authentication to logon and are getting compromised.

---

## Zero Trust vs Traditional approaches

The last 20 years, the network was the primairy pillar. If a malicious user or device doesn't have access to your network, no breach is possible.

The last 5 years, especially now in the post-COVID19 period, more people tend to work remotely. Also are companies shifting to cloud applications and infrastructure. This makes the pillar of Identity now the primary pillar, because this is the way users connecto to their infrastructure, applications and data. Breaching one of the pillar can give access to all.

The stupid part is, the Identity pillar is the pillar where the most people come along. People make mistakes and that is exactly where attackers are searching for. The path of the least resistance.

---

## How to ramp up Zero Trust

Changes to your infrastructure, especially when talking about Security can take up very much of your time and can get complex very fast. Most companies will disregard the changes and go on, when still using unsecured systems until a great company-devastating breach.

To roll out the most critical Zero trust principles in a short timely manner, you can use the RaMP plan which is a Rapid Modernization plan. This gives you a kickstart, but leaves the more complex and time-consuming changes for the near-future.

To further expand your Zero Trust vision and security posture, a great resource is to use the following 2 references by Microsoft:

- **Azure Cybersecurity Benchmark:** <https://learn.microsoft.com/en-us/security/benchmark/azure/overview-v3>
  - This contains monthly updated benchmark points which you can lay against your organizations operations. These are all best practices from a security standpoint to secure the environment on all aspects and pillars

- **Azure Cybersecurity Reference Architectures:** <https://github.com/MicrosoftDocs/security/blob/main/Downloads/mcra-december-2023.pptx?raw=true>
  - To get some inspiration about how to build your cybersecurity architecture

{{< ads >}}

{{< article-footer >}}
