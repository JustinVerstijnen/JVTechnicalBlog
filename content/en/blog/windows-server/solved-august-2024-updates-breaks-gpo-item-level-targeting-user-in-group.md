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

---

## End of the page 🎉

You have reached the end of the page. You can select a category, share this post on X, LinkedIn and Reddit or return to the blog posts collection page. Thank you for visiting this post.

If you think something is wrong with this post or you want to know more, you can send me a message to one of my social profiles at: <https://justinverstijnen.nl/about/>

[Go back to Blog](https://justinverstijnen.nl/blog/)

If you find this page and blog very useful and you want to leave a donation, you can use the button below to buy me a beer. Thank you in advance and cheers :)

[![](https://img.buymeacoffee.com/button-api/?text=Buy me a beer&emoji=🍺&slug=justinverstijnen&button_colour=FFDD00&font_colour=000000&font_family=Arial&outline_colour=000000&coffee_colour=ffffff)](https://www.buymeacoffee.com/justinverstijnen)

[![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/about-66/jv-media-66-36a3c69c96cb.png)](https://buymeacoffee.com/justinverstijnen)

The [terms and conditions](https://justinverstijnen.nl/terms-conditions/) apply to this post.

Page visitors:
No page-counter data available yet.
