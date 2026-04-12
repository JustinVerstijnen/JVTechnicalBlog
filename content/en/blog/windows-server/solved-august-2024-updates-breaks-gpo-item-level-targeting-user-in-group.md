---
title: "Solved: August 2024 updates breaks GPO Item level targeting - user in group"
date: 2024-09-09
slug: "solved-august-2024-updates-breaks-gpo-item-level-targeting-user-in-group"
categories:
  - Windows Server
tags:
  - Step by Step guides
description: >
  Also impacted by the update where you can't select users to filter your Group Policies (GPO)? Read this guide for a temporary solution.
---
If you are managing Windows Servers, Group Policies are a great way to distribute settings to your endpoints. However, a recent update of August 2024 in Windows Server 2022 and 2019 breaks user filtering in Group Policy (GPO) Item Level Targeting

---

## The problem itself

When applying printers, registery settings or drive maps to users, we use Group Policy Item level targeting to filter users so only users with a group membership gets the policy applied.

Since the updates of August 2024 this isn't working anymore:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/solved-august-2024-updates-breaks-gpo-item-level-targeting-user-in-group-342/jv-media-342-4e468d1e17b1.png)

We cannot select "User in group", only "computer in group". This applies only to new and existing policies. If you already have policies in place with "User in group" selected before the updates, this will still work as expected.

---

## The cause and solution of User GPO break

The cause of this problem are two updates which have to be removed to make it work again:

|  |  |
| --- | --- |
| **Operating System** | **Update (KB)** |
| Windows Server 2019 | KB5042350 |
| Windows Server 2022 | KB5041160 |

This update has to be removed on the server where you manage your Active Directory and/or Group Policies. You can keep the update installed on all other critical servers.

To remove this update, open Control Panel -> Programs and Features (appwiz.cpl)

Click on "View installed updates"

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/solved-august-2024-updates-breaks-gpo-item-level-targeting-user-in-group-342/jv-media-342-dc70be5d79a7.png)

Select the right update for your OS and click "Uninstall". After uninstalling the update the server has to be restarted. Make sure you perform this action in your maintenance window to decrease impact of this change.

Please note that this is a temporary solution, and not a persistent solution. Microsoft has to fix this in the coming update wave.

---

## My advice

My advice is to leave the update installed. Uninstalling a update can do more than letting it installed. My advice is to only remove the update when you must configure such policies. If all your policies are in place and working and you don't have to change anything, my advice is to leave the server alone and wait for the next update wave and hope for a solution from Microsoft.

{{< ads >}}

{{< article-footer >}}
