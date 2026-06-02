---
title: "Automatically clean up inactive Entra ID devices using Azure Automation"
slug: "azure-automation-clean-entraid-devices"
date: 2026-04-27
tags:
- Step by Step guides
- Tools and Scripts
categories:
- Microsoft Azure
description: "Over time, Microsoft Entra ID environments often become filled with old and inactive devices. These can be devices from former employees, reinstalled systems, test devices or machines that simply no longer exist. Cleaning up these devices manually takes time and is easy to forget. By using Azure Automation, we can fully automate this process and remove devices that have been inactive for more than 180 days. Azure Automation is a service in Azure that allows you to automate tasks. Automation tasks usually work with schedules/timers and scripts and normally require infrastructure to run. In traditional environments this often means deploying and maintaining servers or virtual machines. In the cloud era we naturally want to avoid this as much as possible. With Azure Automation you can run different types of scripts whenever you want. These scripts run directly on the Azure platform without the need to deploy, design, maintain or secure your own server. This makes it a very robust solution. Azure Automation can also run in the context of a Managed Identity connected to the Automation Account. This removes the need for separate service accounts."
hidden: false
---

## Requirements

- An Azure subscription
- Basic knowledge of PowerShell
- Basic knowledge of Microsoft Graph
- Around 30 minutes of your time

---

## Azure Automation vs. Logic Apps

Azure Automation looks similar to Logic Apps. Personally, I think Azure Automation is better for more complex tasks. Logic Apps are very good for quickly creating smaller workflows by using connectors and predefined actions. However, you are more limited in customization. With Azure Automation you can fully design and test your own scripts and use custom PowerShell modules but also Python. This gives you much more flexibility and control.

---

## How does Azure Automation work?

Azure Automation works by creating an Automation Account in Azure. This acts as a container where different runbooks can run.

The runbooks are the actual scripts or tasks which can run manually or based on a schedule.

In this guide we will use:

- An Automation Account
- A PowerShell runbook
- A Managed Identity
- Microsoft Graph permissions
- A schedule to run automatically

The script will check all Entra ID devices and remove devices that have been inactive for more than 180 days.

---

## The scripts needed

I already created the preparation files and scripts which can be found here:

https://github.com/JustinVerstijnen/JV-AA-CleanEntraIDDevices/tree/main

Here are two scripts:

- Setup-script: This is the script needed for the setup of the automation account, only the first time after creating an Automation Account
- Clean-script: This is the script that runs on schedule

---

## Step 1: Create an Automation Account:

Open the Azure Portal and navigate to: "Automation Accounts". Then create a new Automation Account.

[![Image](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-automation-clean-entra-id-devices/jv-media-8511-82c205a3b934.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-automation-clean-entra-id-devices/jv-media-8511-82c205a3b934.png)

Give the Automation Account a name and place it in your desired resource group.

[![Image](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-automation-clean-entra-id-devices/jv-media-8511-26e422ef0a7c.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-automation-clean-entra-id-devices/jv-media-8511-26e422ef0a7c.png)

Then advance to the "Advanced" page.

[![Image](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-automation-clean-entra-id-devices/jv-media-8511-ee616f0fb4d3.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-automation-clean-entra-id-devices/jv-media-8511-ee616f0fb4d3.png)

Here enable the "System assigned" identity option to enable an identity for the Automation Account.

Leave the rest of the wizard as-is and complete it to create the Automation Account.

[![Image](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-automation-clean-entra-id-devices/jv-media-8511-1e91ce5564cf.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-automation-clean-entra-id-devices/jv-media-8511-1e91ce5564cf.png)

---

## Step 2: Configure the Managed Identity

Now we have to configure the managed identity for this solution to work. This is a sort of service account the script uses to gain least privileges.

The script uses Microsoft Graph PowerShell modules.

Navigate to:

`Automation Account -> Modules`

Import the following modules if they are not already available:

- Microsoft.Graph.Authentication
- Microsoft.Graph.Identity.DirectoryManagement

You can import these directly from the PowerShell Gallery.

Wait until all modules are successfully imported before continuing.

---

## Step 3: Assign permissions to the Managed Identity:

The Automation Account Managed Identity needs permissions to read and remove devices in Entra ID.

Navigate to:

`Automation Account -> Identity`

Copy the Object ID of the Managed Identity.

Now open:

`Microsoft Entra Admin Center -> Enterprise Applications`

Search for the Automation Account identity.

Assign the following Microsoft Graph Application permissions:

- Device.ReadWrite.All
- Directory.Read.All

After assigning the permissions, make sure to grant admin consent.

Without admin consent the script will not work.

---

## Step 4: Create the PowerShell Runbook:

Navigate to:

`Automation Account -> Runbooks`

Create a new Runbook.

Recommended settings:

- Runbook type: PowerShell
- Runtime version: PowerShell 7

Upload or paste the PowerShell script from the GitHub repository.

The script checks the device last sign-in activity and removes devices inactive for more than 180 days.

Example logic used in the script:

- Connect to Microsoft Graph using Managed Identity
- Retrieve Entra ID devices
- Check last sign-in timestamp
- Compare inactivity against 180 days
- Remove inactive devices

After uploading the script, publish the Runbook.

---

## Step 5: Test the Runbook:

Before fully automating the process, always test the Runbook manually.

Open the Runbook and click:

`Start`

Monitor the job output and verify:

- Graph authentication works
- Devices are retrieved correctly
- Inactive devices are detected properly
- Devices are removed successfully

It is recommended to first test against a lab or test tenant.

---

## Step 6: Create a schedule:

Once testing is complete, configure automatic execution.

Navigate to:

`Runbook -> Schedules`

Create a new schedule.

Recommended example:

- Recurrence: Weekly
- Time: Outside business hours

Link the schedule to the Runbook.

From now on the cleanup process runs automatically.

---

## Important considerations

Automatically deleting devices can have impact if devices are still in use.

Before enabling automatic cleanup:

- Validate your inactivity period
- Exclude special devices if needed
- Test carefully
- Monitor logs regularly

180 days is often a safe balance for many environments, but every organization is different.

---

## Benefits of this solution

Using Azure Automation for device cleanup provides several benefits:

- No servers required
- Fully automated process
- Uses Managed Identity instead of service accounts
- Easy to maintain
- Scalable
- Low operational overhead

It also helps keeping Entra ID clean and easier to manage.

---

## Summary

Using Azure Automation together with Microsoft Graph is a powerful and clean way to automatically remove inactive Entra ID devices.

Because the solution runs fully in Azure and uses Managed Identity authentication, there is no need for extra infrastructure or service accounts. This keeps the solution secure, modern and easy to maintain.

Thank you for reading this post and I hope it was helpful!

### Sources

These sources helped me by writing and research for this post;

1. https://learn.microsoft.com/en-us/azure/automation/overview
2. https://learn.microsoft.com/en-us/powershell/microsoftgraph/overview
3. https://learn.microsoft.com/en-us/entra/identity/devices/manage-stale-devices
4. https://github.com/JustinVerstijnen/JV-AA-CleanEntraIDDevices/tree/main
5. https://learn.microsoft.com/en-us/azure/automation/enable-managed-identity-for-automation
