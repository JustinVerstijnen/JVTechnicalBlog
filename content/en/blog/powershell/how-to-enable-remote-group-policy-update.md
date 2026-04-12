---
title: "How to enable Remote Group Policy update"
date: 2024-01-10
slug: "how-to-enable-remote-group-policy-update"
categories:
  - Powershell
tags:
  - Step by Step guides
description: >
  This guide explains how to perform Remote Group Policy updates and how to do the initial configuration needed.
---
## Group Policy update to multiple computers

Sometimes you want to force a group policy update on multiple computers. Often when i am configuring Azure Virtual Desktop Session Hosts i need this option instead of logging into all hosts and executing the command manually.

There is a option in Group Policy management to force a group policy update to all computers in a OU:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/how-to-enable-remote-group-policy-update-534/jv-media-534-b7954db3f633.png)

Actually, this only works after you configured this on the remote computers. The good part is, there is a way to do this with Group Policy!

---

## Errors explained

When you do not configure remote group policy update, you get errors like:

- 0x8007071a
- The remote procedure call was cancelled

These state that access to the remote computer cannot be established, which is actually because of security reasons.

---

## Enable remote Group Policy update

To enable remote Group Policy update with a GPO, create a new GPO or use an existing one:

Go to the settings for the Windows Firewall:

*Computer Configuration -> Policies -> Windows Settings -> Security Settings -> Windows Defender Firewall with Advanced Security*

Create 2 new inbound rules based on a predefined sets:

- Remote Scheduled Tasks Management
- Windows Management Instrumentation

Select all rules of both of the predefined rulesets.

After this link the GPO to the right OU and do a last manual GPupdate or wait for the scheduled GPupdate to finish.

---

## Performing remote Group Policy updates

You can use the Group Policy update option in Group Policy Management (gpmc.msc) to perform a group policy update on all computers in a OU.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/how-to-enable-remote-group-policy-update-534/jv-media-534-fec510b3d91d.png)

After that you will get succeeded notifications:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/how-to-enable-remote-group-policy-update-534/jv-media-534-27861d74e1b9.png)

---

## Summary

Remote Group Policy update is an excellent way to manage traditional Active Directory computers and updating them remotely instead of physically walk to the computers to perform the update yourself. Even on Microsoft Azure servers, it is a very handy tool because updating policies can be done through your central management server.

Thank you for reading this guide!

{{< ads >}}

{{< article-footer >}}
