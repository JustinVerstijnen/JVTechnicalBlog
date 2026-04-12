---
title: "How to properly secure Break Glass Accounts in your Entra ID"
date: 2026-03-01
slug: "how-to-properly-secure-break-glass-accounts-in-your-entra-id"
categories:
  - Microsoft Entra
tags:
  - Concepts
description: >
  In our environment, we will do everything to secure it as much as possible. We give users only the permissions they need and only at...
---
In our environment, we will do everything to secure it as much as possible. We give users only the permissions they need and only at given times, we enable Conditional Access to limit access to our data as much as possible.

But we also create Break Glass administrator accounts as our last resort, a method to login if everything else doesn't work. Security wise, this sounds against all rules but we prefer a account to login in emergency situations over a complete tenant lockout.

To help you secure break glass administrator accounts, I have 10 generic industry-known advices for these accounts which you can implement relatively easy. These help you on top of all other security mechanisms (CA/MFA/PIM/Least privilege) securing, decreasing the chance of lockouts and decrease the value for possible attackers.

---

## List of recommendations

The list of recommendations which I will describe further:

1. Have at least 2 accounts
2. Have the accounts cloud only -> not synced from Active Directory
3. Use the .onmicrosoft.com domain and no license
4. Exclude from all Conditional Access policies
5. Do not use licenses on Administrator accounts
6. Passwords must be at least 64 and max 256 characters
7. Avoid "break glass admin" or any tip to a high privileged account
8. Register FIDO2 key for the account
9. Setup Monitoring for login alerts
10. Test the accounts twice per year

---

## 1: Have at least 2 accounts with Global Administrator permissions

Very important to have at least 2 accounts (with a maximum of 4) with Global Administrator permissions. Most of the time, we will limit the amount of privileges but we need to have at least 2 accounts with those permissions.

- If one of the accounts won't work, the other mostly will

---

## 2: Use cloud only accounts

For administrator accounts, it is recommended to use cloud only accounts. This way, any compomise in local or cloud accounts doesn't mean the attack flows into the other direction.

If attackers manage to break into a active directory account, they will also get into your cloud environment which we want to limit.

---

## 3: Use .onmicrosoft.com domain only

For administrator accounts, and especially break glass administrator accounts, it is recommended to only use the .onmicrosoft.com domain. This domain is the ultimate fallback if something happens to your domain, or someone managed to make a (big) mistake in the DNS records. It can happen that user accounts fall back to the .onmicrosoft.com domain.

I have seen this happening in production, and so using the .onmicrosoft.com domain helps you gaining quicker access in case of emergency.

---

## 4: Exclude Break Glass administrator accounts from Conditional Access

To ensure Break Glass administrators are always permitted to login, ensure they are excluded from all blocking conditional access policies. If you make a sudden mistake in obe of the policies, and your Break glass administrator is included, there is no way to sign in anymore, and you'll be lcoked out.

---

## 5: Do not use licenses on Administrator accounts

Do not use licenses on Administrator accounts. Using licenses potentially make them a bigger target in recoinassance stages of an attack, they are easier to find and the licenses expose services of M365 further.

---

## 6: Use strong and big passwords

A great recommendation is to use long and strong passwords. Strong passwords consists of all 4 possible character types:

- Lowercase characters
- Uppercase characters
- Numbers
- Special characters

Use anywhere between 64 and 256 characters passwords for break glass administrator accounts. Save those in a safe place like an encrypted password storage.

{{% alert color="info" %}}
Tip: use my Password generator for generatng passwords: <https://password.jvapp.nl/>
{{% /alert %}}

---

## 7: Ensure proper naming

We have to name our break glass administrators well. During breaches, attackers will search for possible high-value targets to shift their attack to.

- Avoid terms like "admin", "breakglass" or "emergency", the attacker will instantly know where their gold is at

A good advice is to name break glass accounts to a person, a product you and your company likes or to a movie. Let you creativity be king on this one.

---

## 8: Register FIDO2 key for break glass adminstrators

You can also register FIDO2 keys for break glass administrators. These are a hardware key used as second factor which we can put in a safe or store somewhere else really safe. It must also be audited if anyone in the company gains access to the security key so everyone knows who, when and why it was last used.

---

## 9: Setup monitoring alerts for Break Glass administrators

As we don't want break glass administrator accounts to be used on a daily basis and being actively attacked, you might want to setup alerts for people logging in to the account.

To setup notifications like phone calls, I have this guide for you: [https://justinverstijnen.nl/get-notifications-when-entra-id-break-glass-admins-are-used](https://justinverstijnen.nl/?p=4337)

---

## 10: Test Break Glass administrator accounts twice per year

We create the break glass administrator accounts, but mostly never test them properly. It is important to test break glass accounts at least twice per year, and know exactly if they work properly and the correct roles and permissions are active.

To test this, login to the account and check if you still have the correct roles and that they are "Active", instead of the PIM "Eligible".

---

## Summary

It is really important to have back-up/break glass accounts available in your environment. You'll never know when someone makes a mistake or a account doesn't work because of some outage or other problem. Maybe your account is brute-forced and locked out for 30 minutes.

I hope this guide was helpful and thank you for reading.

### Sources

These sources helped me by writing and research for this post;

1. [Microsoft Cloud Security Benchmark](https://learn.microsoft.com/en-us/security/benchmark/azure/overview)
2. [CIS Benchmarks](https://www.cisecurity.org/cis-benchmarks)

{{< ads >}}

{{< article-footer >}}
