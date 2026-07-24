---
title: "How I bumped up Microsoft Secure Score towards 100%"
date: 2026-04-30
description: "In this post series, I will demonstrate how I bumped up the Microsoft Secure Score of my tenant up to 100% (98,78% to be exact). This can be used to change the settings of your own tenant and have a better security posture.However, 100% secure score will definitely not mean that you are not hackable. It only means you use 100% of the Microsoft toolbox to defend your digital fortress. Spending more resources on awareness training for employees is a good approach on top of these settings. They are often the weakest factor."
tags:
- Step by Step guides
categories:
- Secure Score
---

## My Microsoft Secure Score subpages

These subpages contains the different pillars to address:

<a class="btn btn-primary" href="/microsoft-secure-score-identity/" target="_blank" rel="noreferrer">1. Identity</a>

<a class="btn btn-primary" href="/microsoft-secure-score-devices/" target="_blank" rel="noreferrer">2. Devices</a>

<a class="btn btn-primary" href="/microsoft-secure-score-apps/" target="_blank" rel="noreferrer">3. Apps</a>

<a class="btn btn-primary" href="/microsoft-secure-score-data/" target="_blank" rel="noreferrer">4. Data</a>

On these pages I did the recommendations step-by-step and added some non-counting advices of myself and some things I found out in my work. You can also find all pages on the left side in the sidebar under "Secure Score".

---

## What is the Microsoft Secure Score?

The Microsoft Secure Score is a dynamic index number on scale of 0% to 100% that automatically scans your Microsoft tenant for possible enhancements on the security area. It gives several recommendations for us administrators to strengthen the security, based on zero trust, and based on those 4 pillars:

- Identity
- Data
- Devices/Endpoints
- Apps

The recommendations Microsoft gives are based on years of experience, cybersecurity trends and industry accepted benchmarks ([like CIS](https://www.cisecurity.org/cis-benchmarks)). Some of the recommendations arrived from the older Active Directory era, but also from modern solutions and 3rd party community benchmarks like CIS and ISO 27001. The recommendations will dive into several different attack vectors:

- Protection against insider risks
- Protection against attackers
- Disabling unsafe protocols or features
- Blocking unsafe logins
- Classify your sensitive data

By getting your Secure Score to 100% means you are using 100% of the Microsoft Security toolbox. This doesn't mean that you are unhackable, which you technically would never be able to achieve.

{{< ads >}}

---

## Starting point

When started out, my tenant contained around 8 users and 2 devices and have Business Premium licenses assigned to the users with Entra P1 included. My total secure score was 31,65% and the Identity pillar was 42,42%:

[![jv-media-5293-cf5c9fb82ed1.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/how-i-bumped-up-microsoft-secure-score-towards-100-5293/jv-media-5293-cf5c9fb82ed1.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/how-i-bumped-up-microsoft-secure-score-towards-100-5293/jv-media-5293-cf5c9fb82ed1.png)

[![jv-media-5293-a44012a62c4d.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/how-i-bumped-up-microsoft-secure-score-towards-100-5293/jv-media-5293-a44012a62c4d.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/how-i-bumped-up-microsoft-secure-score-towards-100-5293/jv-media-5293-a44012a62c4d.png)

While I mostly use the Secure Score of the security.microsoft.com portal, as this contains every pillar we also have the secure score from the Entra portal. As you can see, they are a bit inconsistent. For Zero Trust to work, we have to defend ourselves on every pillar.

{{< ads >}}

---

## Licensing requirements

All the stuff we do on this pages needs the following licenses:

- Microsoft 365 Business Premium
- Windows 11 Enterprise / Education licenses
- Microsoft Defender for Endpoint P2
- Microsoft Entra ID P2
- Microsoft 365 E5 for the Apps recommendations (optional)

We can do most of the stuff with Business Premium licenses, which most small and bigger business should use. For the guides I ordered some standalone licenses to gain access to every setting available.

[![jv-media-5293-dca97b71a997.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/how-i-bumped-up-microsoft-secure-score-towards-100-5293/jv-media-5293-dca97b71a997.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/how-i-bumped-up-microsoft-secure-score-towards-100-5293/jv-media-5293-dca97b71a997.png)

And for optimal Identity security, we need Entra ID Premium Plan 2 licenses assigned to every user:

[![jv-media-5293-dcb05c94b2bc.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/how-i-bumped-up-microsoft-secure-score-towards-100-5293/jv-media-5293-dcb05c94b2bc.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/how-i-bumped-up-microsoft-secure-score-towards-100-5293/jv-media-5293-dcb05c94b2bc.png)

It is not essentially required to have those licenses, but it will drastically expand our toolbox to secure all Zero Trust pillars.

---

## My final Microsoft Secure Score (after the guides)

As I did not implement every single setting, my Secure Score was hanging at 98,7% which is still a great score. In my environment, I did not have any Windows Enterprise or Education devices, so some of the recommendations were not achievable.

[![jv-media-5293-0f017efcd3d5.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/how-i-bumped-up-microsoft-secure-score-towards-100-5293/jv-media-5293-0f017efcd3d5.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/how-i-bumped-up-microsoft-secure-score-towards-100-5293/jv-media-5293-0f017efcd3d5.png)

[![jv-media-5293-637f95350ee6.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/how-i-bumped-up-microsoft-secure-score-towards-100-5293/jv-media-5293-637f95350ee6.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/how-i-bumped-up-microsoft-secure-score-towards-100-5293/jv-media-5293-637f95350ee6.png)

---

## Summary

Getting the Secure Score of my tenant was a very fun and interesting experience. Still I found out some settings I have never heard about before and did understand some admin centers a bit better.

Altough, some settings feel more like a compliance thing than actually getting your security level up, but nevertheless it was very fun.

Thank you for visiting this page and I hope it was helpful.

{{< ads >}}

{{< article-footer >}}