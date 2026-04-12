---
title: "Use Azure Logic Apps to automatically start and stop VMs"
date: 2025-07-13
slug: "use-azure-logic-apps-to-automatically-start-and-stop-vms"
categories:
  - Microsoft Azure
tags:
  - Step by Step guides
description: >
  With Azure Logic apps we can save some money on compute costs. Azure Logic apps are flow based tasks that can be run on schedule, or on a...
---
With Azure Logic apps we can save some money on compute costs. Azure Logic apps are flow based tasks that can be run on schedule, or on a specific trigger like receiving a email message or Teams message. After the trigger has been started, we can choose what action to do. If you are familiar with Microsoft's Power Automate, Logic Apps is almost exactly the same but then hosted in Azure.

In this guide I will demonstrate some simple examples of what Logic Apps can do to save on compute costs.

---

---

## Azure Logic Apps

Azure Logic Apps is a solution to automate flows that we can run based on a trigger. After a certain trigger is being met, the Logic App can then perform some certain steps, like;

- Get data from database/SharePoint
- Process data
- Send email
- Start or Stop VM

To keep it simple, such logic app can looks like this:

In Logic Apps there are templates to help you starting out what the possibilities are:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/use-azure-logic-apps-to-automatically-start-and-stop-vms-2258/jv-media-2258-cb39a3173818.png)

---

## The Logic app to start and stop VMs

In this guide I will use a Logic app to start and stop the Minecraft Server VM [from a previous guide](https://justinverstijnen.nl/setup-a-minecraft-server-on-azure/). You can use any virtual machine in the Azure Portal with Logic Apps.

I will show some examples:

1. Starting the machine at a scheduled time
2. Starting the machine at a scheduled time and stop after X hours
3. Starting the machine when receiving a certain email message

---

## Creating the Logic App

In the Azure Portal, go to "Logic Apps" and create a new Logic app. I chose the multi-tenant option as this is the least we need and saves on processing costs.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/use-azure-logic-apps-to-automatically-start-and-stop-vms-2258/jv-media-2258-80421df63e9a.png)

Logic Apps are relatively cheap, most of the time we can save a lot more money on compute costs than the costs of the Logic App.

Advance to the next step.

Create the app by filling in the details and finish the wizard.

After finishing the wizard, we have our Logic App in place, and now we can configure our "flows" and the 3 examples.

---

## The Logic App designer

In every Logic App, we have a graphically designer to design our flow. Every flow has its own Logic App instance. If you need multiple flows, you have to create multiple Logic Apps, each for their own purpose.

When the Logic App is created, you can go to the "Logic App Designer" in your created Logic App to access the flow:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/use-azure-logic-apps-to-automatically-start-and-stop-vms-2258/jv-media-2258-c8dfca12d6d0.png)

We always start with a trigger, this is the definition of when the flow starts.

---

## Authentication from Logic App to Virtual Machines

We now have a Logic App created, but it cannot do something for us unless we give it permissions. My advice is to do this with a Managed Identity. This is a service-account like Identity that is linked to the Logic App. Then we will give it "Least-privilege" access to our resources.

In the Logic App, go to "Identity" and enable the System-assigned managed identity.

Now we have to give this Managed Identity permissions to a certain scope. Since my Minecraft server is in a specific Resource Group, I can assign the permissions there. If you create flows for one specific machine in a resource group with multiple machines, assign the permissions on the VM level instead.

In my example, I will assign the permissions at Resource Group level.

Go to the Resource group where your Virtual Machine resides, and open the option "Access Control (IAM)".

Add a new Role assignment here:

Select the role "Virtual Machine Contributor" or a custom role with the permissions:

- *"Microsoft.Compute/\*/read"*
- *"Microsoft.Compute/virtualMachines/start/action"*
- *"Microsoft.Compute/virtualMachines/deallocate/action"*

Click on "Next".

Select the option "Managed Identity" and select the Logic App identity:

Select the Managed Identity that we created.

Assign the role and that concludes the permissions-part.

---

## Example 1: Starting a Virtual Machine at a scheduled time

In Example 1, we will create a flow to automatically start one or more defined virtual machines at a scheduled time, without an action to shutdown a machine. You can use this in combination with the "Auto Shutdown" option in Azure.

Go to the Azure Logic App and then to the Designer;

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/use-azure-logic-apps-to-automatically-start-and-stop-vms-2258/jv-media-2258-945275aa0ed6.png)

Click on "Add a trigger".

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/use-azure-logic-apps-to-automatically-start-and-stop-vms-2258/jv-media-2258-8a89f57391bf.png)

Select the "Schedule" option.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/use-azure-logic-apps-to-automatically-start-and-stop-vms-2258/jv-media-2258-b1fb0db10814.png)

Select the "Recurrence" trigger option to let this task recur every 1 day:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/use-azure-logic-apps-to-automatically-start-and-stop-vms-2258/jv-media-2258-42973c6523f9.png)

Then define the interval -> when must the task run, the timezone and the "At these Hours" to start the schedule on a set time, for example 8 o'clock. The blue block below it shows exactly when the schedule will run.

Save the trigger and now we have to add actions to perform after the trigger.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/use-azure-logic-apps-to-automatically-start-and-stop-vms-2258/jv-media-2258-f4da910cef43.png)

Click on the "+" under Recurrence and then "add a task" to link a task to the recurrence.

Search for: "virtual machine"

Select the option "Start virtual machine".

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/use-azure-logic-apps-to-automatically-start-and-stop-vms-2258/jv-media-2258-24d0dbbf18c6.png)

Select the Managed Identity and give the connection a name. Then click on "Create new".

Now select the machine you want to start at your scheduled time:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/use-azure-logic-apps-to-automatically-start-and-stop-vms-2258/jv-media-2258-cc294d8f53a2.png)

Save the Logic App and it should look like this:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/use-azure-logic-apps-to-automatically-start-and-stop-vms-2258/jv-media-2258-ccb3e379965c.png)

### Testing the logic app

You can test in the portal with the "Run" option, or temporarily change the recurrence time to some minutes in the future.

Now we wait till the schedule has reached the defined time, and we will look what happens to the virtual machine:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/use-azure-logic-apps-to-automatically-start-and-stop-vms-2258/jv-media-2258-210c599a138d.png)

The machine is starting according to our Logic App.

---

## Example 2: Starting a Virtual Machine at a scheduled time and stopping it after X hours

Example 2 is an addition on Example 1, so follow Example 1 and then the steps below for the stop-action.

Go to the Logic app designer:

Under the "Start virtual machine" step, click on the "+" to add an action:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/use-azure-logic-apps-to-automatically-start-and-stop-vms-2258/jv-media-2258-db420741336c.png)

Search for "Delay" to add an delay to the flow.

In my example, I will shutdown the virtual machine after 4 hours:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/use-azure-logic-apps-to-automatically-start-and-stop-vms-2258/jv-media-2258-5e47ccabe739.png)

Fill in 4 and select hours or change to your preference.

Add another step under the Delay step:

Search for "Deallocate" and select the "Deallocate virtual machine"

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/use-azure-logic-apps-to-automatically-start-and-stop-vms-2258/jv-media-2258-e6093862024c.png)

Fill in the form to select your virtual machine. It uses the same connection as the "Start" action:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/use-azure-logic-apps-to-automatically-start-and-stop-vms-2258/jv-media-2258-422930fc06a9.png)

After this save the Logic app. Now the Logic App will start the virtual machine at 8:00 AM and after 4 hours it will stop the machine. I used the "Deallocate" action because this ensures the machine uses minimal costs. Stop will only stop the VM but keeps it allocated which means it still costs money.

---

## Example 3: Start machine after receiving email

For Example 3 we start with a new flow. Add a new trigger:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/use-azure-logic-apps-to-automatically-start-and-stop-vms-2258/jv-media-2258-945275aa0ed6.png)

Now search for "When a new email arrives (V3)" and choose the Office 365 Outlook option:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/use-azure-logic-apps-to-automatically-start-and-stop-vms-2258/jv-media-2258-11216b83514f.png)

Now we must create a connection to a certain mailbox, we have to login to the mailbox.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/use-azure-logic-apps-to-automatically-start-and-stop-vms-2258/jv-media-2258-f27bc82f071b.png)

We can define how the mail should look to trigger the events:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/use-azure-logic-apps-to-automatically-start-and-stop-vms-2258/jv-media-2258-011299ffaed4.png)

After the incoming email step, we can add an action with the "+" button:

Click on the "+" under Recurrence and then "add a task" to link a task to the recurrence.

Search for: "virtual machine"

Select the option "Start virtual machine".

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/use-azure-logic-apps-to-automatically-start-and-stop-vms-2258/jv-media-2258-24d0dbbf18c6.png)

Select the Managed Identity and give the connection a name. Then click on "Create new".

Now select the machine you want to start at your scheduled time:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/use-azure-logic-apps-to-automatically-start-and-stop-vms-2258/jv-media-2258-cc294d8f53a2.png)

Save the Logic App and it should look like this:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/use-azure-logic-apps-to-automatically-start-and-stop-vms-2258/jv-media-2258-ccb3e379965c.png)

Now we have finished Example 3 and you can test the flow.

---

## Summary

Azure Logic Apps are an excellent cloud-native way to automate recurring tasks in Azure. It is relatively easy to configure and can help limiting the uptime of virtual machines and so costs.

I hope this guide was very useful and thank you for reading.

{{< ads >}}

{{< article-footer >}}
