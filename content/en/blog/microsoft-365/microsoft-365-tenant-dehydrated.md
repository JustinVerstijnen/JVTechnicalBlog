---
title: "Solved - Microsoft 365 tenant dehydrated"
date: 2024-09-20
slug: "microsoft-365-tenant-dehydrated"
categories:
  - Microsoft 365
tags:
  - Step by Step guides
description: >
  Microsoft will sometimes "pause" tenants to reduce infrastructure costs. You will then get an error which contains "tenant dehydrated".
---
Microsoft will sometimes "pause" tenants to reduce infrastructure costs. You will then get an error which contains "tenant dehydrated". What this means and how to solve it, I will explain in this post.

---

---

## What is "Tenant dehydrated"?

Microsoft sometimes will dehydrate Microsoft 365 tenants where things will not often change to the tenant. This closes some parts of the tenant for changing, even if you have Global Administrator permissions.

The cause of this is for Microsoft to save on infrastructure cost. They will set the tenant in this sort of "sleep mode" where everything works properly but some configuration changes cannot be done. You can get this error with all sorts of changes:

- Creating a new group
- Creating a new management role assignment
- Creating a new role assignment policy
- Modifying a built-in role assignment policy
- Creating a new Outlook mailbox policy
- Creating a new sharing policy
- Creating a new retention policy

---

## How to undo this dehydration

Fortunately, we can undo this with some Powershell commands, which I will show you:

Start by logging into Exchange Online PowerShell. If you don't have this installed, [click here for instructions](https://learn.microsoft.com/en-us/powershell/exchange/exchange-online-powershell-v2?view=exchange-ps#install-and-maintain-the-exchange-online-powershell-module).

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
Connect-ExchangeOnline
{{< /card >}}

Then fill in your credentials and finish MFA.

## Check status

When logged in, we can check the tenant dehydration status with this command:

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
Get-OrganizationConfig | ft Identity,IsDehydrated
{{< /card >}}

This will show something like this:

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
Get-OrganizationConfig | ft Identity,IsDehydrated

Identity                               IsDehydrated
--------                               ------------
justinverstijnen.onmicrosoft.com       True
{{< /card >}}

This outputs the status "True", which means we cannot change some settings in our tenant and is in a sleep mode.

## Disable dehydration

The following command disables this mode and makes us able to change things again (when still logged in to Exchange Online Powershell):

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
Enable-OrganizationCustomization
{{< /card >}}

This command takes a few seconds to process, and after this commando we can check the ststua again:

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
Get-OrganizationConfig | ft Identity,IsDehydrated

Identity                               IsDehydrated
--------                               ------------
justinverstijnen.onmicrosoft.com       False
{{< /card >}}

---

## Summary

Sometimes, this error will occur what is very unfortunate but it's not a really complex fix. We have to agree with Microsoft. They host millions of tenants which will almost never get any changes so putting them in this sleep mode is completely acceptable.

Thank you for reading this guide and I hope I helped you out fixing this problem.

{{< ads >}}

{{< article-footer >}}
