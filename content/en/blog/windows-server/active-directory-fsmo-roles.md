---
title: "Active Directory FSMO roles"
date: 2025-02-04
slug: "active-directory-fsmo-roles"
categories:
  - Windows Server
tags:
  - Concepts
  - Step by Step guides
description: >
  Active Directory Domain Controllers are assigned 5 different FSMO roles, which all have their own function. We can separate them over multiple...
---
Active Directory Domain Controllers are assigned 5 different FSMO roles, which all have their own function. We can separate them over multiple servers to create more redundancy, but make sure to handle those all as servers. All roles neeed a 24/7 uptime for your environment to work properly.

In this guide, I will give a brief explaination of the roles, what their function is and how to move them to different servers to enhance availability and redundancy.

---

---

## What are the FSMO roles of Active Directory?

FSMO stands for Flexible Single Master Operations. Active Directory is normally multi-master, meaning changes can be made on any domain controller. However, some operations must be handled by one specific domain controller at a time to avoid conflicts. These special responsibilities are called the FSMO roles.

There are five FSMO roles:

- Two forest-wide roles
- Three domain-wide roles

Let's look at them all and explain what their function is:

| FSMO Role | Scope | Primary Responsibilities |
| --- | --- | --- |
| **Schema Master** | Forest | Manages Schema updates |
| **Domain Naming Master** | Forest | Adds/removes domains |
| **PDC Emulator** | Domain | Time service, password updates, Group Policy |
| **RID Master** | Domain | Assigns RID pools for unique SIDs |
| **Infrastructure Master** | Domain | Maintains cross-domain references |

{% alert color="info" %}
For more information about the specifics of the roles, check out the official Microsoft page: <https://learn.microsoft.com/en-us/troubleshoot/windows-server/active-directory/fsmo-roles>
{% /alert %}

Depending on your environment, these roles can run on one or multiple domain controllers. If having an environment with a single domain controller, all roles will be done by that single server. As you might already guess, this is a single point of failure.

---

## An effective distribution of FSMO roles

In my environment, I have 3 domain controllers. This means we can separate all roles over the 3 servers. I also use Microsoft Azure to run them, and so placed the 3 servers into 3 availability zones.

|  |  |  |
| --- | --- | --- |
| **Server** | **Roles** | **Availability Zone** |
| JV-DC01.justinverstijnen.nl | Primary Domain Controller (PDC)   Infrastructure master | Zone 1 |
| JV-DC02.justinverstijnen.nl | Domain naming master   RID Master | Zone 2 |
| JV-DC03.justinverstijnen.nl | Schema Master   Entra Connect Sync | Zone 3 |

Because Entra Connect Sync is also a critical function of my domain, I placed this on my third server to give all 3 servers 2 dedicated roles.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/active-directory-fsmo-roles-5732/jv-media-5732-95408e56dc1d.png)

---

## Get the actual separation of roles

To view how the roles are separated at this time, run this command at one of your AD management servers (or domain controllers):

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
netdom query fsmo
{{< /card >}}

You will get an output like this:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/active-directory-fsmo-roles-5732/jv-media-5732-9faa4c6b46b6.png)

Here I have separated the roles onto 3 different servers. In Microsoft Azure, I have the servers set-up in different availability zones to also defend my environment to datacenter-outages.

---

## Move FSMO roles with PowerShell (one by one)

We can move those roles with PowerShell by using those commands:

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
Move-ADDirectoryServerOperationMasterRole -Identity *server* -OperationMasterRole PDCEmulator -Confirm:$false
{{< /card >}}

Make sure to change the \*server\* placeholder to your server name.

---

## Move FSMO roles with PowerShell (bulk)

To move all roles to predetermined servers, you can also run all commands at once:

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
Move-ADDirectoryServerOperationMasterRole -Identity *server* -OperationMasterRole PDCEmulator -Confirm:$false
Move-ADDirectoryServerOperationMasterRole -Identity *server* -OperationMasterRole InfrastructureMaster -Confirm:$false
Move-ADDirectoryServerOperationMasterRole -Identity *server* -OperationMasterRole RIDMaster -Confirm:$false
Move-ADDirectoryServerOperationMasterRole -Identity *server* -OperationMasterRole DomainNamingMaster -Confirm:$false
Move-ADDirectoryServerOperationMasterRole -Identity *server* -OperationMasterRole SchemaMaster -Confirm:$false
{{< /card >}}

Make sure to change the \*server\* placeholder to your server names.

---

## Summary

Every now and then, we need to move some FSMO roles to other servers or we need this when setting up. Dividing the roles onto multiple servers ensure not the whole domain is interrupted with one server failing and so creates redundancy and availability for your users.

### Sources

These sources helped me by writing and research for this post;

1. <https://learn.microsoft.com/en-us/troubleshoot/windows-server/active-directory/fsmo-roles>

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
