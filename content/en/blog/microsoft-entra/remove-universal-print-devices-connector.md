---
title: "Remove Universal Print Devices/Connectors"
slug: "remove-universal-print-devices-connector"
date: 2025-10-25
tags:
- Step by Step guides
categories:
- Microsoft Entra
description: "In this guide, I’ll show you how to remove Universal Print connectors using PowerShell, because this cannot be done from the Universal Print portal."
---

## Introduction

In Universal Print, a connector is the link between your local print environment and Universal Print. Over time, you may end up with connectors that are no longer used. For example, after replacing a print server, changing your print setup, or cleaning up old test configurations. These connectors will store your devices in Entra ID, so over time this list will fill up with old devices and connectors.

[![Image](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/remove-universal-print-devices-connector/jv-media-8508-5a65ef1676df.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/remove-universal-print-devices-connector/jv-media-8508-5a65ef1676df.png)

Universal Print portal does not provide an option to eventually remove connectors in the portal at [https://aka.ms/UPPortal](https://aka.ms/UPPortal). So if you want to clean them up, you need to use PowerShell.

In this guide, I’ll walk you through the steps to remove a Universal Print connector.

---

## Step 1: Install the Universal Print PowerShell module

First, we need to install the Universal Print PowerShell module. This module contains the cmdlets we need to manage Universal Print from PowerShell.

Open up your PowerShell window and execute this command to install this module:

{{< card code=true header="**PowerShell**" lang="powershell" >}}
Install-Module UniversalPrintManagement -Scope CurrentUser
{{< /card >}}

If PowerShell asks you to trust the repository, confirm this if you trust the source.

The Module installation can take up to some minutes, in my case this was around 3 minutes to completely finish.

---

## Step 2: Connect to Universal Print

Now that we have our module installed, we are ready to connect your PowerShell session to Universal Print. Run this command to connect to your Microsoft Entra tenant:

{{< card code=true header="**PowerShell**" lang="powershell" >}}
Connect-UPService
{{< /card >}}

A sign-in window will appear. Sign in with an account that has the required permissions to manage Universal Print in your tenant.

If the sign-in was succesful, you will not receive any further error messages and we are ready to go to the next step.

{{< ads >}}

---

## Step 3: Remove the connector

Before we can remove the connector, make sure you have the correct ConnectorId. You can find the ConnectorId in the Universal Print connector details in the Azure portal ([https://aka.ms/UPPortal](https://aka.ms/UPPortal)).

[![Image](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/remove-universal-print-devices-connector/jv-media-8508-0cc132eb026f.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/remove-universal-print-devices-connector/jv-media-8508-0cc132eb026f.png)

Copy this value as we will need this Id in our PowerShell command. Please double check if you have the right connector in case of multiple connectors.

Now remove the connector by running the command below. Replace the example ConnectorId with the ConnectorId of the connector you want to remove.

{{< card code=true header="**PowerShell**" lang="powershell" >}}
Remove-UPConnector -ConnectorId c9af1827-e34a-4292-9614-8a892c332e54
{{< /card >}}

[![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/remove-universal-print-devices-connector/jv-media-8508-29c42fb4e502.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/remove-universal-print-devices-connector/jv-media-8508-29c42fb4e502.png)

After running the command, the connector will be removed from the Universal Print portal:

[![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/remove-universal-print-devices-connector/jv-media-8508-5d3cc238919b.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/remove-universal-print-devices-connector/jv-media-8508-5d3cc238919b.png)

That’s it. Your unused Universal Print connector should now be removed!

---

## Summary

Universal Print connectors cannot be removed from the Universal Print portal. If you want to clean up old or unused connectors, you need to remove them with PowerShell. In this guide we followed the relatively easy steps to achieve this goal.

The process is simple:

1. Install the Universal Print PowerShell module.
2. Connect to Universal Print.
3. Find the correct ConnectorId.
4. Remove the connector with the Remove-UPConnector command.

Thank you for reading this post and I hope it was helpful!

### Sources

These sources helped me with writing and research for this post:

1. https://learn.microsoft.com/en-us/universal-print/fundamentals/universal-print-remove-connector-howto

{{< ads >}}

{{< article-footer >}}