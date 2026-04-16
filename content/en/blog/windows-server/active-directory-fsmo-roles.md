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
  Active Directory Domain Controllers are assigned 5 different FSMO roles, which all have their own function. We can separate them over multiple servers to create more redundancy, but make sure to handle those all as servers. All roles neeed a 24/7 uptime for your environment to work properly. In this guide, I will give a brief explaination of the roles, what their function is and how to move them to different servers to enhance availability and redundancy.

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

{{% alert color="info" %}}
For more information about the specifics of the roles, check out the official Microsoft page: <https://learn.microsoft.com/en-us/troubleshoot/windows-server/active-directory/fsmo-roles>
{{% /alert %}}

Depending on your environment, these roles can run on one or multiple domain controllers. If having an environment with a single domain controller, all roles will be done by that single server. As you might already guess, this is a single point of failure.

---

## An effective distribution of FSMO roles

In my environment, I have 3 domain controllers. This means we can separate all roles over the 3 servers. I also use Microsoft Azure to run them, and so placed the 3 servers into 3 availability zones.

|  |  |  |
| --- | --- | --- |
| **Server** | **Roles** | **Availability Zone** |
| JV-DC01.justinverstijnen.nl | Primary Domain Controller (PDC) & Infrastructure master | Zone 1 |
| JV-DC02.justinverstijnen.nl | Domain naming master & RID Master | Zone 2 |
| JV-DC03.justinverstijnen.nl | Schema Master & Entra Connect Sync | Zone 3 |

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

Make sure to change the \*server\* placeholder to the correct server names in your environment.

---

## Summary

Every now and then, we need to move some FSMO roles to other servers or we need this when setting up. Dividing the roles onto multiple servers ensure not the whole domain is interrupted with one server failing and so creates redundancy and availability for your users.

### Sources

These sources helped me by writing and research for this post;

1. <https://learn.microsoft.com/en-us/troubleshoot/windows-server/active-directory/fsmo-roles>

{{< ads >}}

{{< article-footer >}}
