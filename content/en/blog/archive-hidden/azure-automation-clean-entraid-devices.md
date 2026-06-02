---
title: "Automatically clean up inactive Entra ID devices using Azure Automation"
slug: "azure-automation-clean-entra-id-devices"
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
- PowerShell 7 installed
- [Microsoft Graph PowerShell module](https://www.powershellgallery.com/packages/Microsoft.Graph) installed
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

Now we have to configure the managed identity for this solution to work. This is a sort of service account the script uses to gain least privileges and having access to your Entra ID from the Azure platform.

Go to your Automation Account, then open up "Identity" from the left:

[![Image](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-automation-clean-entra-id-devices/jv-media-8511-133bb8f36704.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-automation-clean-entra-id-devices/jv-media-8511-133bb8f36704.png)

Here we must copy the Object ID of the Managed Identity, as we need this in our script to give the required permissions. As we need to provide permissions to a Service Principal, this must be done through PowerShell. A Managed Identity is not managed through the portal like a normal App Registration.

On the GitHub page, you can find the "Setup-Script.ps1". Download this as we have to run it with PowerShell 7.

[https://github.com/JustinVerstijnen/JV-AA-CleanEntraIDDevices/tree/main](https://github.com/JustinVerstijnen/JV-AA-CleanEntraIDDevices/tree/main) 

Change the Managed Identity ID on line 4:

[![Image](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-automation-clean-entra-id-devices/jv-media-8511-25eefd0f6b09.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-automation-clean-entra-id-devices/jv-media-8511-25eefd0f6b09.png)

Now we can run the script in PowerShell 7 by executing it and then logging in to the tenant where you placed the automation account.

[![Image](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-automation-clean-entra-id-devices/jv-media-8511-48ee37b285b3.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-automation-clean-entra-id-devices/jv-media-8511-48ee37b285b3.png)

After logging in successfully, the correct permissions are assigned to the Managed Identity and the Automation Account can now be tested.

- _Device.ReadWrite.All_

---

## Step 3: Install the needed modules

Now we have to install some PowerShell modules on our Automation Account. The script uses some modules which are not shipped by default on the Automation Account PowerShell runtime, but we can install this manually through the Azure Portal.

Navigate to the Automation Account in Azure and open up "Modules" from the left. From there, click on "Browse gallery" to add new PowerShell modules directly from the PowerShell Gallery into your Automation Account.

[![Image](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-automation-clean-entra-id-devices/jv-media-8511-1e4c8b985ce2.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-automation-clean-entra-id-devices/jv-media-8511-1e4c8b985ce2.png)

Here install these two modules:

- Microsoft.Graph.Authentication
- Microsoft.Graph.Identity.DirectoryManagement

***VERDER AANVULLEN

---

## Step 4: Create the PowerShell Runbook

Now we can create the PowerShell runbook itself. This is the task where the script is launched to clean the Entra ID devices. Navigate to your Automation Account  and open up "Runbooks" from the left. From there, click on "+ Create a runbook" to create a new runbook with our desired settings.

[![Image](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-automation-clean-entra-id-devices/jv-media-8511-5ba8e219dbfe.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-automation-clean-entra-id-devices/jv-media-8511-5ba8e219dbfe.png)

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