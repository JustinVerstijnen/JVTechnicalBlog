---
title: "Deploy Resource Group locks automatically with Azure Policy"
date: 2025-04-17
slug: "deploy-resource-group-locks-automatically-with-azure-policy"
categories:
  - Microsoft Azure
tags:
  - Step by Step guides
description: >
  Locks in Azure are a great way to prevent accidental deletion or modify resources or resource groups. This helps further securing your...
---
Locks in Azure are a great way to prevent accidental deletion or modify resources or resource groups. This helps further securing your environment and make it somewhat more "fool proof".

Now with Azure Policy we can automatically deploy Locks to Resource Groups to secure them from deleting or read-only resources. In this guide I will explain how this can be done and how it works.

{{% alert color="info" %}}
Note: Locks on Resource Groups can stop some automations. If you use read-only locks on a Azure Virtual Desktop resource group for example.

Take care before creating them and assigning this policy to such subscription.
{{% /alert %}}

---

---

## The solution described

This solution consists of an Azure Policy Definition, that is assigned to the subscription where this must be executed. It also consists of a custom role that only gives the needed permissions, and nothing more.

The Azure Policy evaluates the resource groups regularly and puts the lock on the resource groups. No need for manual lock deployment anymore.

It can take up to 30 minutes before a (new) resource group gets the lock assigned automatically, but most of the time it happens a lot faster.

---

## Step 1: Creating the custom role

Before we can use the policy and automatic remediation, we need to set the correct permissions. As this must be done on subscription-level, the normal permissions would be very high. In our case, we will create a custom role to achieve this with a much lower privileged identity.

Go to "Subscriptions", and select the subscription where you want the policy to be active. Now you are here, copy the "Subscription ID":

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/deploy-resource-group-locks-automatically-with-azure-policy-4361/jv-media-4361-db8f5729387c.png)

Go to "Access control (IAM)". Then click on "+ Add" and then "Add custom role".

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/deploy-resource-group-locks-automatically-with-azure-policy-4361/jv-media-4361-0693d9e60bbd.png)

Here go directly to the "JSON" tab, click "Edit" and paste the code below, and then paste the subscription ID on the placeholder on line 6:

{{< card code=true header="**JSON**" lang="json" >}}
{
  "properties": {
    "roleName": "JV-CR-AutomaticLockRGs",
    "description": "Allows to place locks on every resource group in the scope subscription.",
    "assignableScopes": [
      "/subscriptions/*subscriptionid*"
    ],
    "permissions": [
      {
        "actions": [
          "Microsoft.Authorization/locks/*",
	        "Microsoft.Resources/deployments/*",
          "Microsoft.Resources/subscriptions/resourceGroups/read"
        ],
        "notActions": [],
        "dataActions": [],
        "notDataActions": []
      }
    ]
  }
}
{{< /card >}}

Or view the custom role template on my GitHub page:

[View code on GitHub](https://github.com/JustinVerstijnen/JV-POL-AutomaticLockRGs/blob/main/customrole.json)

Then head back to the "Basics" tab and customize the name and description if needed. After that, create the custom role.

---

## Step 2: Create the Policy Definition

Now we can create the Policy Deinition in Azure. This is the definition or let's say, the set of settings to deploy with Azure Policy. The definition is then what is assigned to a determined scope which we will do in the next step.

Open the Azure Portal, and go to "Policy".

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/deploy-resource-group-locks-automatically-with-azure-policy-4361/jv-media-4361-593b8efbe00c.png)

Then under "Authoring" click on "Definitions". Then click "+ Policy Definition" to create a new policy definition.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/deploy-resource-group-locks-automatically-with-azure-policy-4361/jv-media-4361-8fd59ea01326.png)

In the "Definition Location", select the subscription where the policy must place locks. Then give the definition a name, description and select a category. Make sure to select a subscription and not a management group, otherwise it will not work.

After that, we must paste the code into the Policy Rule field. I have the fully prepared code template here:

[View code on GitHub](https://github.com/JustinVerstijnen/JV-POL-AutomaticLockRGs/blob/main/policy.json)

Open the link and click this button to copy all code:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/deploy-resource-group-locks-automatically-with-azure-policy-4361/jv-media-4361-ce82441db80d.png)

Then paste the code above into the Policy rule field in Azure:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/deploy-resource-group-locks-automatically-with-azure-policy-4361/jv-media-4361-07767fa3f9f0.png)

After that, save the policy definition and we are done with creating the policy definition.

---

## Step 3: Assign the Policy to your subscription(s)

Now that we have made the definition, we can assign this to our subscription(s). You can do this by clicking on "Assign policy" directly after creating the definition, or by going back to "Policy" and selecting "Assignments":

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/deploy-resource-group-locks-automatically-with-azure-policy-4361/jv-media-4361-15f84c51bf69.png)

Click on "Assignments" and then on "Assign Policy".

At the scope level, you can determine which subscription to use. Then you could set some exclusions to exclude some resouce groups in that subscription.

At the Policy definition field, select the just created definition to assign it, and give it a name and description.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/deploy-resource-group-locks-automatically-with-azure-policy-4361/jv-media-4361-8565829f0600.png)

Then advance to the tab "Remediation". The remediation task is where Azure automatically ensures that resources (or resource groups in this case) are compliant with your policy. This by automatically placing the lock.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/deploy-resource-group-locks-automatically-with-azure-policy-4361/jv-media-4361-f52f3537ee25.png)

Enable "Create a remediation task" and the rest can be left default settings. You could use a user assigned managed identity if needed.

Finish the assignment and the policy will be active.

---

## Step 4: Assign the custom role to your managed identity

Now that we have assigned the managed identity to our remediation task, we can assign new permissions to it. By default, Microsoft assigns the lock contributor role, but is unfortunately not enough.

Go to your subscription, and once again to "Access control (IAM)". Then select the tab "Role assignments":

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/deploy-resource-group-locks-automatically-with-azure-policy-4361/jv-media-4361-cd70761245fb.png)

Search for the managed identity Azure just made. It will be under the "Lock Contributor" category:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/deploy-resource-group-locks-automatically-with-azure-policy-4361/jv-media-4361-b62d22a11bcf.png)

Copy or write down the name and click "+ Add" and add a role to the subscription.

On the "Role" tab, select type: "Custom role" to only view custom roles and select your just created role:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/deploy-resource-group-locks-automatically-with-azure-policy-4361/jv-media-4361-09683c386770.png)

Click next.

Make sure "User, group or service principal" is selected, click "+ Select members" and paste in the name of the identity you have just copied.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/deploy-resource-group-locks-automatically-with-azure-policy-4361/jv-media-4361-e25c212179aa.png)

While Azure call this a managed identity, it is really a service principal which can sound very strange. WHy this is is really simple, it is not linked to a resource. Managed Identities are linked to resources so a resource has permissions. In this case, it's only Azure Policy.

Select the Service principal and complete the role assignment.

---

## Step 5: Let's test the outcome

After configuring everything, we have to wait around 15 minutes for the policy to become active and the remediation task to put locks on every resource group.

After the 15 minute window we can check the status of the remediation task:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/deploy-resource-group-locks-automatically-with-azure-policy-4361/jv-media-4361-abb611d27fd2.png)

Looks promising! Let's take a look into the resource groups itself:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/deploy-resource-group-locks-automatically-with-azure-policy-4361/jv-media-4361-8e6ac47c5291.png)

Looks great and exactly what we wanted to achieve.

---

## Step 6: Exclude resource groups from getting locks (optional)

Now with this Azure Policy solution, every resource group created automatically gets a Delete lock type. To exclude resource groups in your subscription to get a lock, go back to the policy assignment:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/deploy-resource-group-locks-automatically-with-azure-policy-4361/jv-media-4361-fb5c3972fc19.png)

Then click on your policy assignment and then on "Edit assignment":

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/deploy-resource-group-locks-automatically-with-azure-policy-4361/jv-media-4361-ee044fd54189.png)

And then click on the "Exclusions" part of this page:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/deploy-resource-group-locks-automatically-with-azure-policy-4361/jv-media-4361-5bf3e631e011.png)

Here you can select the resource groups to be excluded from this automatic locking solution. Recommended is to select the resource groups here where you do some sort of automation on it. A prevent delete lock prevents automations from deleting resources in the resource group.

After selecting your resource groups to be excluded, save the configuration.

---

## Summary

Locks in Azure are a great way to prevent some resource groups from accidental deletion and change of resource groups. It also helps by protecting the containing resources to be deleted or changed for a great inheritance-like experience. However they can be useful and great, take care on what resource group to place what lock because they can disrupt some automation tasks.

Azure Policy helps you on top of locks themselves to place Locks automatically on the resouce groups in case you forgot them.

Thank you for reading this guide and I hope it was helpful.

### Sources

These sources helped me by writing and research for this post;

1. <https://learn.microsoft.com/en-us/azure/governance/policy/concepts/effect-deploy-if-not-exists>
2. <https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/lock-resources?tabs=json>
3. <https://learn.microsoft.com/nl-nl/azure/governance/policy/how-to/remediate-resources?tabs=azure-portal#how-remediation-security-works>

{{< ads >}}

{{< article-footer >}}
