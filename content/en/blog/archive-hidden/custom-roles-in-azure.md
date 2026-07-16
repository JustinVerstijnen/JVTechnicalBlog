---
title: "Custom roles in Azure (Azure RBAC): least privilege with Actions and NotActions"
slug: "custom-roles-in-azure-azure-rbac"
date: 2026-07-12
tags:
- Step by Step guides
- Concepts
categories:
- Microsoft Azure
description: "Use Azure RBAC custom roles for least privilege by building roles with Actions, DataActions, NotActions, and NotDataActions, with practical examples and a portal walkthrough."
hidden: false
---

## Introduction

Custom roles in Azure RBAC help you apply least privilege.

Built-in roles are convenient, but they can still grant far more permissions than your service desk, application admin, or external supplier needs. Microsoft recommends custom roles when the built-in role does not match the exact combination of required `Actions`, `DataActions`, and the exclusions in `NotActions` and `NotDataActions`.

In this post, I will first use your real-world scenarios as examples, then explain how `Actions` and `NotActions` behave, and finally walk you through creating a custom role in the Azure portal.

For the basics of RBAC, scope, and role assignments, refer to: https://justinverstijnen.nl/introduction-to-microsoft-azure-roles-rbac-iam-the-easy-way/

---

## Role examples you can map to custom roles

### 1) Virtual Machine Power Operator (power only)

**Practical scenario:** The service desk can start, stop, deallocate, and restart virtual machines. They must not change VM configuration.

**Allowed (examples):**

```
Microsoft.Compute/virtualMachines/read
Microsoft.Compute/virtualMachines/start/action
Microsoft.Compute/virtualMachines/restart/action
Microsoft.Compute/virtualMachines/powerOff/action
Microsoft.Compute/virtualMachines/deallocate/action
Microsoft.Resources/subscriptions/resourceGroups/read
```

**Not allowed (examples):** create or delete VMs, change VM size, modify disks or network interfaces, install extensions, reset passwords, and run scripts through Run Command.

**Why custom role:** Built-in roles like Virtual Machine Contributor are usually too broad for “power operator” responsibilities.

---

### 2) DNS Record Editor without DNS zone management

**Practical scenario:** An application administrator can modify a limited set of DNS records, for example CNAME records, but must not delete or manage DNS zones.

**Custom role concept:** allow only the record operations you need, and keep zone-level management out.

For example, CNAME-only operations could be modeled like this:

```
Microsoft.Network/dnsZones/read
Microsoft.Network/dnsZones/CNAME/read
Microsoft.Network/dnsZones/CNAME/write
Microsoft.Network/dnsZones/CNAME/delete
```

**Why custom role:** built-in “DNS zone” roles often cover zone management plus all record set management, which can become too risky.

---

### 3) NSG Security Rule Editor (security rules only)

**Practical scenario:** A security team or service desk can edit firewall rules in existing Network Security Groups (NSGs), but must not manage the broader network building blocks.

**Custom role concept:** allow NSG security rule operations and service tag reads, but exclude actions that modify VNets, subnets, public IPs, route tables, and other networking components.

Example building blocks:

```
Microsoft.Network/networkSecurityGroups/read
Microsoft.Network/networkSecurityGroups/securityRules/read
Microsoft.Network/networkSecurityGroups/securityRules/write
Microsoft.Network/networkSecurityGroups/securityRules/delete
Microsoft.Network/locations/serviceTags/read
Microsoft.Network/locations/serviceTagDetails/read
```

**Why custom role:** the built-in Network Contributor role is often too broad for this delegation model.

---

### 4) Storage Blob Uploader without delete permissions (upload without destroy)

**Practical scenario:** An application uploads blobs, optionally overwrites them, but must not delete blobs or containers.

**Key concept:** for this kind of “write without delete” model you typically need a custom data-plane role using `DataActions`, excluding delete-like permissions using `NotDataActions`.

**Important warning:** overwrite can have almost the same effect as delete in some workflows. For real ransomware resilience, you should also use blob versioning, soft delete, immutable storage, and other controls.

---

### 5) Key Vault Secret Rotator without read permissions

**Practical scenario:** An application can create new secret versions, but it must not read the current secret values.

**Why custom role:** many built-in Key Vault roles are built as a mix of read and write responsibilities, which does not match “rotate without getSecret” cleanly.

**Testing note:** some tools read secret metadata before they write a new version. Test whether you need metadata read permissions, without granting secret value read.

---

## How Actions and NotActions work (the part that matters)

In a custom RBAC role definition, permissions are built from four lists:

- **Actions** : control-plane operations you allow
- **NotActions** : control-plane operations you exclude
- **DataActions** : data-plane operations you allow
- **NotDataActions** : data-plane operations you exclude

### Actions and DataActions are allow lists

If an operation matches an entry in `Actions` or `DataActions`, it is included in what the role can do.

### NotActions and NotDataActions are exclusions inside the same role

If an operation matches an entry in `NotActions` or `NotDataActions`, it is removed from the permissions granted by that role definition.

### Important limitation: NotActions is not a global deny

`NotActions` and `NotDataActions` do not act like an explicit deny across the whole tenant.

Azure RBAC is additive. If the same identity also has broader permissions through another role assignment, the excluded operation can still be allowed.

That means you must verify:

- other role assignments at subscription, resource group, or resource level
- access inherited via groups
- broader roles like Contributor or Owner
- eligible or active privileged access patterns if you use PIM

For the operational result, always validate with “Check access”.

---

---

## Step 1: Choose the scope where the custom role can be assigned

Open the Azure portal at `https://portal.azure.com` and go to the scope you want to control (for example a subscription or resource group). Then open **"Access control (IAM)"**.

This scope decision matters because it controls where the custom role can be assigned, and how access can flow down to lower levels.

---

---

## Step 2: Create the custom role by cloning a built-in role

In **"Access control (IAM)"**, select **"Roles"**.

Find a built-in role that is close to your scenario, then use the role action menu (ellipsis, **"..."**) and select **"Clone"**.

Cloning is usually safer than starting from scratch, because you can later remove permissions you do not need.

---

---

## Step 3: Edit permissions with Actions, NotActions, DataActions, and NotDataActions

In the custom role editor, update the permission lists to match the scenario.

A practical way to work:

- Start with a small set of required operations
- Add only the operations you need into `Actions` and `DataActions`
- Use `NotActions` and `NotDataActions` only as exclusions for operations you must not allow

Example mapping to your scenarios:

- VM power operator: put the VM power operations into `Actions`, and exclude anything like extension install or Run Command style actions
- DNS CNAME editor: include only the specific CNAME record operations, and exclude zone management style operations
- NSG rule editor: include `securityRules` read and write, and exclude operations that modify the wider network
- Blob upload without delete: model as data-plane operations with `DataActions`, and exclude delete with `NotDataActions`
- Key Vault rotate without read: model data operations for creating new secret versions, and exclude secret value read operations

---

---

## Step 4: Set assignable scopes, then save

In the custom role definition, configure **assignable scopes** so the role can only be assigned where you actually want it.

Then select **"Save"**.

---

---

## Step 5: Assign the role and validate with “Check access”

Assign your new custom role to the intended identity (user, group, service principal, or managed identity) at the correct scope.

Then validate the effective permissions by going to **"Access control (IAM)"** and using **"Check access"**.

This is the step that confirms whether exclusions in `NotActions` or `NotDataActions` actually achieve the least-privilege outcome in your environment, given additive role assignments.

---

## Knowledge check

{{< quiz >}}
{
  "intro": "Answer these question(s) to test your understanding of this post. Your answers are not saved or sent anywhere; this is simply a personal knowledge check. If you refresh the page, your answers will be cleared.",
  "questions": [
    {
      "question": "What is the primary purpose of NotActions and NotDataActions in a custom Azure RBAC role?",
      "reference": "The section 'How Actions and NotActions work (the part that matters)'",
      "referenceUrl": "#how-actions-and-notactions-work-the-part-that-matters",
      "answers": [
        {
          "text": "They exclude matching operations inside the custom role definition.",
          "correct": true,
          "message": "Correct. They remove permissions from the role definition you are building."
        },
        {
          "text": "They create a tenant-wide explicit deny for the excluded operation.",
          "correct": false,
          "message": "Not correct. Azure RBAC exclusions are not a global deny across all role assignments."
        }
      ]
    },
    {
      "question": "Why do you need 'Check access' after you create a custom role?",
      "reference": "The section 'How Actions and NotActions work (the part that matters)'",
      "referenceUrl": "#how-actions-and-notactions-work-the-part-that-matters",
      "answers": [
        {
          "text": "Because other role assignments can still allow operations that you excluded in your custom role.",
          "correct": true,
          "message": "Correct. RBAC is additive, so you must validate effective access."
        },
        {
          "text": "Because Check access shows the raw role JSON only, without evaluating effective access.",
          "correct": false,
          "message": "Not correct. Check access evaluates effective permissions."
        }
      ]
    },
    {
      "question": "For upload-only blob scenarios (write without delete), which permission list is typically used?",
      "reference": "The section 'Role examples you can map to custom roles'",
      "referenceUrl": "#role-examples-you-can-map-to-custom-roles",
      "answers": [
        {
          "text": "DataActions and NotDataActions.",
          "correct": true,
          "message": "Correct. Blob data operations are modeled using data-plane permissions."
        },
        {
          "text": "Actions and NotActions.",
          "correct": false,
          "message": "Not correct. For blob data operations, the data-plane model is used."
        }
      ]
    }
  ]
}
{{< /quiz >}}

---

## Summary

Custom roles in Azure RBAC help you reduce permission sprawl by building roles with the exact combination of `Actions`, `DataActions`, and exclusions in `NotActions` and `NotDataActions`. The main limitation is that exclusions are not global denies, so you should always validate effective access with “Check access”, because Azure RBAC is additive across role assignments and scopes.

---

### Sources

These sources helped me by writing and research for this post;

1. https://learn.microsoft.com/en-us/azure/role-based-access-control/custom-roles
2. https://learn.microsoft.com/en-us/azure/role-based-access-control/custom-roles-portal
3. https://learn.microsoft.com/en-us/azure/role-based-access-control/role-definitions
4. https://justinverstijnen.nl/introduction-to-microsoft-azure-roles-rbac-iam-the-easy-way/

Thank you for reading this post and I hope it was helpful!

{{< ads >}}

{{< article-footer >}}