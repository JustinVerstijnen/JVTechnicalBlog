---
title: "Custom roles in Azure/RBAC"
slug: "custom-roles-in-azure-rbac"
date: 2024-01-12
tags:
  - Step by Step guides
  - Concepts
categories:
  - Microsoft Azure
description: "In this guide, I will explain how custom roles and their permissions work in Azure and show you how to create your own role using the Azure Portal."
hidden: false
---

## Introduction

When managing permissions in Microsoft Azure, you will probably use a lot of built-in roles. In most cases these roles will do the job, but what if you want to give someone a little less permissions than a built-in role provides?

For example, you have a service desk employee who needs to restart a virtual machine when something goes wrong. You could assign the Virtual Machine Contributor role to this employee, but this also allows the employee to change a lot of settings of the virtual machine including lateral movement to inside of the VM. Is that really what you want?

This is where custom roles in Azure come in useful. With a custom role you can define what permissions someone needs to do their job, which is part of the principle of least privilege.

In this guide, I want to explain when you might want to use custom roles, how the different types of permissions in a role work and how you can create your own role using the Azure Portal.

If you are not yet familiar with roles, scopes and role assignments in Azure, you can read my previous post for a brief introduction: [Introduction to Azure roles and permissions (RBAC/IAM)](https://justinverstijnen.nl/introduction-to-microsoft-azure-roles-rbac-iam-the-easy-way/).

---

## 1. Role examples you can map to custom roles

Before we start building a custom role, I want to give you some practical examples of situations where a built-in role might give someone more permissions than needed. This will also give you an idea of what you can do with custom roles in your own Azure environment.

### 1.1 Virtual Machine Power Operator (power only)

Let's say you have a service desk which is responsible for the daily support of your virtual machines. You want them to be able to start, stop, deallocate and restart virtual machines, but you do not want them to change the configuration of those machines.

Some of the permissions you would need in this custom role are:

```
Microsoft.Compute/virtualMachines/read
Microsoft.Compute/virtualMachines/start/action
Microsoft.Compute/virtualMachines/restart/action
Microsoft.Compute/virtualMachines/powerOff/action
Microsoft.Compute/virtualMachines/deallocate/action
Microsoft.Resources/subscriptions/resourceGroups/read
```

With the permissions above, you are not giving them permissions through this role to do things like:

- Create or delete virtual machines.
- Change the size of a virtual machine.
- Make changes to disks or network interfaces.
- Install VM extensions, reset passwords or execute scripts using Run Command.

You could use the built-in Virtual Machine Contributor role, but since your service desk only needs to manage the power state of the virtual machines, a custom role makes more sense in this case.

---

### 1.2 DNS Record Editor without DNS zone management

Another example is an application administrator who needs to manage CNAME records in an Azure DNS zone. You want this administrator to be able to add, change and delete CNAME records, but not to manage or delete the DNS zone itself.

In this case, you could use the following permissions as a starting point for your custom role:

```
Microsoft.Network/dnsZones/read
Microsoft.Network/dnsZones/CNAME/read
Microsoft.Network/dnsZones/CNAME/write
Microsoft.Network/dnsZones/CNAME/delete
```

As you can see, we allow the administrator to read the DNS zone and manage CNAME records. We do not give permissions through this role to manage the zone itself or other types of DNS records.

The built-in DNS Zone Contributor rolee gives you a lot more permissions than this, which you might not want to give to an application administrator. Keep in mind that the scope of your role assignment also matters if you only want the administrator to manage specific records.

---

### 1.3 NSG Security Rule Editor (security rules only)

You might have a security team or service desk which is responsible for managing the security rules in your Network Security Groups (NSGs). However, you have another team which is responsible for managing the rest of your Azure network. For the team managing the security rules, you could build a custom role with permissions like the ones below:

{{% alert title="Info" color="info" %}}
Microsoft.Network/networkSecurityGroups/read

Microsoft.Network/networkSecurityGroups/securityRules/read

Microsoft.Network/networkSecurityGroups/securityRules/write

Microsoft.Network/networkSecurityGroups/securityRules/delete

Microsoft.Network/locations/serviceTags/read

Microsoft.Network/locations/serviceTagDetails/read
{{% /alert %}}

With this custom role, the team can manage security rules in existing NSGs without receiving permissions from this role to manage virtual networks, subnets, public IP addresses or route tables.

Assigning the built-in Network Contributor role would give them permissions to manage a lot more of your network, while they only need to manage the security rules.

---

### 1.4 Storage Blob Uploader without delete permissions (upload without destroy)

Let's say you have an application which uploads files to a Storage Account in Azure. You want this application to be able to upload new blobs and possibly overwrite existing ones, but you do not want the application to delete blobs or containers.

Since we are mainly talking about the data in the Storage Account and not the Storage Account itself, we need to look at the `DataActions` of a role. You can add the required blob write permissions and, if you start with a broader permission, use `NotDataActions` to exclude delete operations.

One thing to keep in mind here: if your application can overwrite a file, the original content of that file can still be lost. Not giving the application delete permissions is therefore only one part of protecting your data against ransomware. You should also look into Blob Versioning, Soft Delete, Immutable Storage and other measures to protect your data.

---

### 1.5 Key Vault Secret Rotator without read permissions

Another situation where a custom data role can be useful is when you have an application which is responsible for rotating secrets in an Azure Key Vault. The application needs permissions to create a new version of a secret, but does not need to read the current value of that secret.

Some built-in Key Vault roles give you both read and write permissions on secrets. In this case we only want to give the application the permissions it needs to set a new secret version, without giving it permissions to retrieve the secret value.

Depending on the tool or application you use, it might also need to read some basic information (metadata) about the secret before creating a new version. Test this first and check whether those extra permissions are actually needed. Reading the metadata is not the same as reading the value of a secret.

---

## 2. How Actions and NotActions work (the part that matters)

Now that you have seen some examples of custom roles, let's have a look at how the permissions of a role in Azure actually work.

When looking at the permissions in a role definition, you will come across the following four terms:

- **Actions:** What you are allowed to do with an Azure resource (control plane).
- **NotActions:** What you exclude from the permissions defined in Actions.
- **DataActions:** What you are allowed to do with the data in an Azure resource (data plane).
- **NotDataActions:** What you exclude from the permissions defined in DataActions.

### Actions and DataActions are allow lists

The basic difference between Actions and DataActions is whether you want to give someone permissions to manage a resource or to work with the data of that resource.

For example, giving someone permissions to manage the configuration of a Storage Account is not the same as giving someone permissions to read the files stored in that Storage Account. For managing the resource we look at Actions, and for working with the data we look at DataActions.

### NotActions and NotDataActions are exclusions inside the same role

You can also exclude permissions from a role. This is where NotActions and NotDataActions come in.

Think of this as subtracting permissions from a collection of permissions. If you have added a wildcard (`*`) which includes multiple operations, you can use NotActions or NotDataActions to remove certain operations from that collection.

If you have only added the specific permissions you need, you do not have to exclude all the other permissions. They are already not included in your role.

### Important limitation: NotActions is not a global deny

Something that is very important to understand when working with custom roles is that NotActions and NotDataActions are not the same as denying access to a resource or its data across all roles.

Azure RBAC works by combining permissions from multiple role assignments. Let's say you assign the Virtual Machine Power Operator role to an employee, but this employee also has the Virtual Machine Contributor role on the same resource group. Even if you have excluded a permission from your custom role, the employee might still have that permission through the other role.

When checking the permissions of a principal, you should also take the following into consideration:

- Other roles assigned on the subscription, resource group or resource level.
- Roles assigned to groups the principal is a member of.
- Roles with broader permissions, like Contributor or Owner.
- Eligible and active role assignments when using Privileged Identity Management (PIM).

You can use the "Check access" functionality in the Azure Portal to review these role assignments. I will come back to this at the end of the guide.

---

## Step 1: Choose the scope where the custom role can be assigned

To begin, go to the [Azure Portal](https://portal.azure.com) and navigate to the subscription or resource group where you want your custom role to be available. From there, go to "Access control (IAM)".

Keep in mind that permissions in Azure can inherit from a higher scope. You can make a custom role available at the subscription level and still assign this role to someone on a specific resource group or resource. You do not have to give this person permissions to the entire subscription.

We can assign permissions on the following scopes:

- Management groups
- Subscriptions
- Resource groups
- Resources

---

## Step 2: Create the custom role by cloning a built-in role

In the "Access control (IAM)" blade, go to the tab "Roles". Here you will find the available built-in roles and any custom roles you already have in your Azure environment.

Search for a role which is close to what you want to achieve. For example, if you want to create a role to manage the power state of virtual machines, you could start with the Virtual Machine Contributor role.

Click the three dots ("...") next to the role and click "Clone". This will open the custom role editor with the permissions of that role as a starting point.

On the "Basics" tab, give your custom role a name and a description so that other administrators can easily understand what the role is used for.

You can also start building a role from scratch. My advice is to use whichever option makes it easiest to end up with only the permissions you need. When cloning a role, make sure to review all the permissions you have copied.

{{< ads >}}

---

## Step 3: Edit permissions with Actions, NotActions, DataActions, and NotDataActions

Now go to the "Permissions" tab in the custom role editor. From here you can add, remove or exclude permissions from your role.

My advice is to start by thinking about what the person or application needs to be able to do, instead of trying to think of everything they should not be allowed to do.

- Add the required resource permissions to `Actions` and the required data permissions to `DataActions`.
- Remove permissions from the cloned role which are not needed.
- Use `NotActions` and `NotDataActions` if you need to subtract operations from a broader permission.

If we look back at the examples at the beginning of this guide, this would mean:

- Virtual Machine Power Operator: add the power-related VM operations to Actions, without granting permissions to install extensions or use Run Command.
- DNS CNAME Editor: add the permissions for managing CNAME records, without granting permissions to manage the DNS zone itself.
- NSG Security Rule Editor: add the required security rule operations, without granting permissions to manage the rest of the network.
- Storage Blob Uploader: add the required blob write operations to DataActions and leave out delete operations (or exclude them from a broader permission using NotDataActions).
- Key Vault Secret Rotator: add the required data permissions for setting a new secret version, without granting permissions to retrieve secret values.

You can also go to the "JSON" tab to have a look at the complete role definition before creating the role.

---

## Step 4: Set assignable scopes, then save

Go to the tab "Assignable scopes". Here you can define where the custom role should be available to assign.

For example, if you only want to use this role within one subscription, you can configure that subscription as an assignable scope. This does not give anyone permissions to the subscription yet. You still need to create a role assignment, which we will do in the next step.

Once you have configured the assignable scopes, go to "Review + create", review your settings and click "Create".

---

## Step 5: Assign the role and validate with “Check access”

Now that we have created our own role, we can assign it to a principal just like we would do with a built-in role.

Go to the resource, resource group or other appropriate scope where you want to give someone permissions. Go to "Access control (IAM)" and assign your custom role to the user, group, service principal or managed identity.

Once you have assigned the role, go to the tab "Check access" and look up the principal. Here you can review which roles the principal has at that scope, including roles inherited from a higher scope.

Remember the example with the Virtual Machine Power Operator and Virtual Machine Contributor roles? This is why it is important to check the other role assignments as well. I also advise you to test the intended operations and some operations that should not be allowed, using the principal in a test environment. This way you can check whether the permissions work as intended.

---

## Summary

So, when would you want to use custom roles in Azure? Built-in roles are perfectly fine in a lot of situations, but sometimes they give someone more permissions than they actually need. With a custom role you can be more specific about which permissions you want to give to a person or application.

To summarize the four permission types in a role:

- **Actions:** Permissions to manage Azure resources.
- **NotActions:** Permissions you subtract from Actions.
- **DataActions:** Permissions to work with the data of Azure resources.
- **NotDataActions:** Permissions you subtract from DataActions.

The most important thing to take away from this guide is that excluding a permission from a role does not mean that someone cannot get that permission through another role. Always check the other role assignments of your principal and test whether your custom role works the way you want it to.

Building and maintaining custom roles does take some extra time. My advice is to use built-in roles where they match your requirements, and create a custom role when you need more granular permissions in your Azure environment.

Thank you for reading this post and I hope it was helpful!

{{% alert title="Sources 🕮" color="info" %}}
These sources helped me by writing and research for this post;

1. [https://learn.microsoft.com/en-us/azure/role-based-access-control/custom-roles](https://learn.microsoft.com/en-us/azure/role-based-access-control/custom-roles)
2. [https://learn.microsoft.com/en-us/azure/role-based-access-control/custom-roles-portal](https://learn.microsoft.com/en-us/azure/role-based-access-control/custom-roles-portal)
3. [https://learn.microsoft.com/en-us/azure/role-based-access-control/role-definitions](https://learn.microsoft.com/en-us/azure/role-based-access-control/role-definitions)
4. [https://justinverstijnen.nl/introduction-to-microsoft-azure-roles-rbac-iam-the-easy-way/](https://justinverstijnen.nl/introduction-to-microsoft-azure-roles-rbac-iam-the-easy-way/)
{{% /alert %}}

{{< ads >}}

{{< article-footer >}}