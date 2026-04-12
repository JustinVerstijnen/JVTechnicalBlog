---
title: "AMC - Module 3: Governance in Microsoft Azure"
date: 2024-11-07
slug: "amc-module-3-governance-in-microsoft-azure"
categories:
  - Azure Master Class
tags:
  - Concepts
description: >
  Governance in Azure refers to the enforcement of rules and the establishment of standards in solutions, naming conventions...
---
## Introduction to Govenance in Azure

Governance in Azure refers to the enforcement of rules and the establishment of standards in solutions, naming conventions, technology, etc. This is achieved through the management and importance of Management Groups, Subscriptions, Resource Groups, Policies, RBAC, and Budgets.

In the cloud, Governance is crucial because processes and behaviors differ significantly from on-premises hardware. Additionally, certain services can be made publicly accessible, which requires an extra layer of security.

---

---

## Azure Policy

With Azure Policy, you can set up rules that different subscriptions, resources, or resource groups need to follow. Some examples include:

- Always assigning certain tags
- Automatically adding a prefix (like a company or department abbreviation)
- Assigning specific permissions by default
- Blocking certain settings
- Limiting which regions can be used
- Applying locks to resource groups
- Automatically deploying the Log Analytics Agent if it’s not installed

The main goals of Azure Policy are:

- Making sure certain settings are enforced
- Giving insight and analysis on policy compliance
- Automating tasks (like deployifnotexists)

To better understand how Azure Policy works, here are its key components:

**Definitions**: A definition outlines what actions, configurations, or tasks are allowed or not. It can include multiple rules, so you can enforce or allow several things with one definition. Azure also offers many built-in definitions that you can use.

**Initiatives**: An initiative is a collection of definitions, so you can group policies together under a single initiative for things like company-wide policies or specific applications. Azure also has standard initiatives available, like checking if a subscription meets country regulations, NIST 800, or ISO 27001.

**Assignments**: These are the subscriptions that the policies apply to.

**Exemptions**: Exemptions are exceptions to a policy, like for a specific resource or type. You can also set an expiry date to make the exemption temporary. There are two types:

- **Mitigated**: The exemption is given because the policy's goal was met through a different method.
- **Waiver**: The exemption is given because the resource is temporarily allowed to not follow the policy.

---

## Tags

A Tag in Azure can be added to various types of resources to categorize them, making it easier to delegate or assign management to individuals or support teams. Tags can be added to resource groups, but the resources within these groups won’t automatically inherit the tags.

The main use of tags is to provide better organization, group resources, and are useful in scripts or other purposes. Tags consist of a name and a value, and they might look something like this for a resource group:

For example:

- **Tag Name**: Department
- **Tag Value**: IT

Here i have configured the tag on a resource group to show the outcome:

Write access to the resources is required to modify or add a tag. Additionally, a tag cannot contain special characters such as `?`, `<`, `>`, `,`, `/`, or `.`.

A maximum of 10,000 tags can be assigned per subscription.

Tags need to be added directly to objects; within the Tags section, you can only view the tags that have already been assigned.

---

## Azure Role structure and assignment

Access to specific components in Microsoft Azure is managed using Access Control (IAM):

In Microsoft Azure, there are hundreds of different roles for each service, but the basic structure is as follows, ranked from the fewest to the most permissions:

- **Reader**: This role allows access to view the entire configuration but does not grant permission to make any changes.
- **Contributor**: This role allows access to modify the entire configuration, but does not permit the user to change permissions at the assigned level.
- **Owner**: This role provides full access to modify the entire configuration, including the ability to manage permissions.

{{% alert color="info" %}}
The highest permissions are effective if multiple roles are assigned.
{{% /alert %}}

These roles define the scope of control users or groups have over resources in Azure, ensuring that access can be finely tuned based on the level of responsibility.

To learn more about Azure Roles and assignments, check out my easy Azure Roles guide: <https://justinverstijnen.nl/introduction-to-microsoft-azure-roles-rbac-iam-the-easy-way/>

---

## Effective access tool

At every level in Microsoft Azure, it's possible to check the access permissions for a specific user or group. In the **Access Control (IAM)** blade of any level (such as subscription, resource group, or resource), you can click on the **"Check Access"** tab, and then on the **"Check Access"** button.

Azure will then display a clear overview of the roles assigned to the user and the associated permissions. This feature helps ensure that you can easily verify who has access to what resources and at what level of control.

## Creating custom Azure roles for more granular access

In Azure, you can also create custom roles to allow or restrict specific actions with a role. This can be done in any window where you see Access Control (IAM).

A role in Azure is structured as follows:

1. **Role Name:** This is the name of the role, used to locate the role within the system and for documentation purposes.
2. **Resource Permissions:** Permissions are assigned in two basic ways: *Actions* and *notActions*. Permissions are granted based on the resource providers in Azure (more on this later).
   - **Actions** are the actions a user is allowed to perform (whitelist).
   - **notActions** are the actions a user is not allowed to perform. This option takes precedence over Actions. (If a user has multiple roles where the same action is defined in both Actions and notActions, access to this action will be blocked) (blacklist).
3. **Data Permissions:** For SQL/Storage accounts, *DataActions* and *notDataActions* are used, following the same principles but applying to underlying data rather than at the resource level.
4. **Scope:** The level at which the role assignment should be applied.

---

## Role assignment scopes

Built-in and custom roles in Microsoft Azure can be assigned to:

- Users
- Groups
- Service Principals
- Managed Identities

## Azure Role-Based Access Control (RBAC) and hierarchy

With Azure RBAC, you ensure that a specific user only has access to the services/resources they need. In Azure, there are various predefined roles, and you can also create custom roles. These roles can then be applied at different levels.

In this diagram, several levels are illustrated:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/amc-module-3-governance-in-microsoft-azure-482/jv-media-482-c11cead7db6d.png)

- **Microsoft Entra ID:** Microsoft Entra ID is the Identity Provider (IdP) for Microsoft Azure.
- **Root Management Group:** The Root Management Group is automatically created when you start setting up management groups. This is the highest level where permissions can be assigned. By default, all subscriptions are also members of this Management Group.
- **Management Group:** A management group is a grouping where permissions can be granted, and subscriptions can be added. Management groups can go up to a maximum of 6 levels deep. The primary purpose is to organize subscriptions into management groups, ensuring permissions are inherited downward but not upward.Management groups can be based on organizational units, partners, etc.
- **Subscription:** A subscription is a logical container for all resource groups, where billing is managed. With multiple subscriptions, you can also have multiple billing methods.
- **Resource Group:** A resource group is a logical container for storing resources to host a particular application. Think of it as a server cabinet with resources for a specific application. Every resource created is a member of a resource group.
- **Resource:** A resource is a virtual entity, such as a disk, virtual machine, virtual network, storage account, SQL server, Log Analytics workspace, etc.

Each level serves to organize and control access within Azure, with permissions flowing from higher to lower levels to manage resources efficiently.

### Inheritance of roles

Please note, role assignments will always propagate to underlying levels. There is no "Block-inheritance" option. Therefore, determining the level at which roles are applied is very important.

Please take a look at the following image for a practice example:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/amc-module-3-governance-in-microsoft-azure-482/jv-media-482-43c0c16a53d9.png)

1. **Azure Account**: At the top, we have the main Azure Account, which can be self-managed or provided through a Cloud Solution Provider (CSP).
2. **Root Tenant**: Under the Azure Account is the Root Tenant, which serves as the primary identity and management boundary within Azure. This is typically linked to **Microsoft Entra ID** and represents the overall organization.
3. **Management Groups**: Below the Root Tenant are Management Groups, which are used to organize subscriptions into logical groups, often aligned by departments, business functions, or regions. These groups enable centralized management and control. In this example, there are three management groups:
   - **IT**: Used to manage resources related to IT infrastructure.
   - **Business**: Focused on resources that support business operations.
   - **Location**: Organized by specific locations, potentially representing geographical groupings.
4. **Subscriptions**: Within each Management Group, there are individual **Subscriptions**. Subscriptions act as containers for billing and access control and are aligned with different environments or purposes:
   - **IT Core** and **IT IaaS** under the IT Management Group.
   - **Business Prod** under the Business Management Group, used for production-related resources.
   - **Business Sandbox** under the Location Management Group, likely used for testing and sandbox purposes.
5. **Resource Groups**: Each subscription contains **Resource Groups**. These are logical containers to host specific sets of related resources that work together on a particular application or project.
6. **Azure Resources**: Finally, within each Resource Group are the actual **Azure Resources**. These can include:
   - Compute resources (e.g., Virtual Machines, Kubernetes clusters),
   - Storage accounts,
   - SQL databases,
   - Networking components, and more.

---

## Attribute Based Access Control

A relatively new feature of Microsoft Entra ID (formerly Azure AD) is attribute-based access. In the Microsoft Entra admin center, it is possible to create custom attributes and assign them to users. Permissions can then be applied based on these attributes.

## Azure Budget

In an Azure Subscription, it is possible to create a budget. This helps ensure that costs stay within certain limits and do not exceed them.

## Azure Resource locking

In Azure, you can apply locks to resource groups and resources. Locks are designed to provide extra protection against accidental deletion or modification of resource groups and resources. A lock always takes precedence over the permissions/roles of certain users or administrators. There are two types of locks:

- **ReadOnly:** A ReadOnly lock ensures that a resource can only be viewed.
- **Delete:** A Delete lock prevents a resource from being deleted.

These locks add an extra layer of security to help prevent unintended changes to critical resources.

## Azure Resource Manager (ARM)

Azure Resource Manager (ARM) is the management layer for your resources, providing an easy way to deploy resources in sets. Additionally, it allows the creation of templates to deploy a specific configuration across multiple environments. Deploying a solution via the Azure Marketplace is also a responsibility of ARM.

Azure Resource Manager ensures that all resources comply with defined Azure Policies and that security configurations set with RBAC function correctly on a technical level. ARM is a built-in service in Azure, not a standalone resource that requires management.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/amc-module-3-governance-in-microsoft-azure-482/jv-media-482-8950416e9910.png)

---

## Azure Resource Provider

Azure Resource Providers are technical (REST) definitions at the Subscription level for the resources that are available. They are represented in the following format:

| **Azure Service** | **Azure Resource Provider** |
| --- | --- |
| Virtual Machines | Microsoft.Compute/virtualMachines |
| Availability Sets | Microsoft.Compute/availabilitySets |

These definitions are used, for instance, when creating custom roles to determine the scope of an action.

Before a resource provider can be used within your Azure subscription, it must be registered. The resource creation wizard will automatically prompt you to register a provider if necessary. This is "by design" to prevent unused resource providers from being exploited by malicious users.

In a given subscription, you can view an overview of which providers are registered and which are not.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/amc-module-3-governance-in-microsoft-azure-482/jv-media-482-13b62ef427df.png)

---

## Ways to save costs in Microsoft Azure

When using Microsoft Azure, there are multiple ways to save money:

- Using the right sizes and specifications
- Using serverless solutions rather than using in VM solutions
- Using Reserved instances for virtual machines
  - You reserve your size VM for 1 or 3 years for a 40% or 60% discount, but you can't stop, upgrade or downgrade your VM
- Using Azure Savings Plans for flexible savings

---

## Summary

Governance in Azure ensures that your cloud resources are used effectively and securely, aligned with organizational policies and compliance requirements. You can reach this outcomes by using the solutions defined on this page.

To go back to the navigation page: <https://justinverstijnen.nl/microsoft-azure-master-class-navigation/>

{{< ads >}}

{{< article-footer >}}
