---
title: "Monitoring Microsoft Intune with Log Analytics"
slug: "monitoring-microsoft-intune-with-log-analytics"
date: 2025-12-03
tags:
- Step by Step guides
categories:
- Microsoft Intune
description: "In this post I will dive into sending Microsoft Intune audit, operational, compliance, and device logs to an Azure Log Analytics workspace and be able to write some custom queries."
hidden: false
---

In Microsoft Intune we can view some basic information about devices, the status of devices, operating systems and last connection time. For the most basic stuff this will be sufficient but we can retrieve some advanced information out of Intune and create custom reports or [even Azure Workbooks](https://justinverstijnen.nl/create-custom-azure-workbooks-for-detailed-monitoring/) from the data of Intune.

Most of the information Microsoft stores for you will be retained for 30 days like sign-in logs and activity logs. Some companies want to increase this period which is also possible with Log Analytics.

In this guide I will be using the Intune diagnostic settings to send this data to an Azure Log Analytics workspace and give a basic turotial on how to search the collected information using Kusto Query Language, better known as KQL. Then I will give some example queries:

- Changes made by Intune administrators
- Created, updated, assigned, or deleted policies
- Remote actions performed on devices
- Successful or failed device enrollments
- Noncompliant devices
- Device operating systems and versions
- Device manufacturers and models
- Encryption status
- The last time devices contacted Intune

---

## Requirements

- A Microsoft Intune environment
- An Azure subscription
- At least the `Intune Administrator` Microsoft Entra role
- Sufficient permissions to create (Contributor) or select a Log Analytics workspace
- Devices enrolled in Microsoft Intune

---

## The log categories explained

In Microsoft Intune we can send these four different log categories to Log Analytics:

| Log category | Log Analytics table | Purpose |
| --- | --- | --- |
| Audit logs | IntuneAuditLogs | Administrative changes and remote actions |
| Operational logs | IntuneOperationalLogs | Enrollment results and noncompliant device events |
| Device compliance organizational logs | IntuneDeviceComplianceOrg | Device compliance information |
| Intune devices | IntuneDevices | Device inventory and management information |

_(Windows 365 logs are excluded from this guide)_

The device compliance and Intune device reports are exported once every 24 hours. It can take up to 48 hours before this information becomes available in Log Analytics. Other information is near real-time sent to Log Analytics.

Log Analytics is if you don't know yet, a database in Azure where we can store various information like logs, metrics and other diagnostic information and we are able to retrieve the data from it which we can fully customize how this should look.

---

## Step 1: Create a Log Analytics workspace

First, we need a Log Analytics workspace to store and query our Intune data.

Open the Azure Portal at [https://portal.azure.com](https://portal.azure.com) and create a resource group for this cause, if this does not already exists in your tenant.

[![jv-media-8541-776bd96dd020.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/monitoring-microsoft-intune-with-log-analytics/jv-media-8541-776bd96dd020.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/monitoring-microsoft-intune-with-log-analytics/jv-media-8541-776bd96dd020.png)

Then finish the wizard to create the resource group. Now search for `Log Analytics workspaces` in the bar above and select `+Create`.

[![jv-media-8541-5d8456bbac49.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/monitoring-microsoft-intune-with-log-analytics/jv-media-8541-5d8456bbac49.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/monitoring-microsoft-intune-with-log-analytics/jv-media-8541-5d8456bbac49.png)

Give the workspace a descriptive name and place it in the correct region and resource group and click `Review + create` and then select `Create`.

[![jv-media-8541-ceb0917fd7a8.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/monitoring-microsoft-intune-with-log-analytics/jv-media-8541-ceb0917fd7a8.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/monitoring-microsoft-intune-with-log-analytics/jv-media-8541-ceb0917fd7a8.png)

After the deployment has completed, open the new Log Analytics workspace. We do not have to create the Intune tables manually. The tables are automatically made available after Intune starts sending data to the workspace which we will do in the next steps.

---

## Step 2: Configure the data retention of Log Analytics

One of the major errors made when implementing Log Analytics is misconfiguring the retention of the Log Analytics data. There are basically 2 major errors you can make which I want you to avoid:

- Setting the retention too short -> loss of possible valuable data
- Setting the retention too long -> results is high costs

Open the Log Analytics workspace and on the left select `Usage and estimated costs`:

[![jv-media-8541-78d8d84eae0c.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/monitoring-microsoft-intune-with-log-analytics/jv-media-8541-78d8d84eae0c.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/monitoring-microsoft-intune-with-log-analytics/jv-media-8541-78d8d84eae0c.png)

Click `Data retention` and set the retention to any wanted value. 30 days is the default which is already the period of Intune itself so maybe you want to set this higher if your environment requires this.

After we have set the retention, we can set the `Daily cap` to be precise at how many data is allowed to store. This is not exactly and can store more, so keep a buffer for yourself in mind:

[![jv-media-8541-e4d5e4ccbdbb.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/monitoring-microsoft-intune-with-log-analytics/jv-media-8541-e4d5e4ccbdbb.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/monitoring-microsoft-intune-with-log-analytics/jv-media-8541-e4d5e4ccbdbb.png)

In my environment, I have set this to `1GB` per day, with a retention of 180 days. This will cost me at the maximum about 80$ a month after one year.

{{% alert title="Source" color="info" %}}
[https://azure.microsoft.com/en-us/pricing/details/monitor/](https://azure.microsoft.com/en-us/pricing/details/monitor/)
{{% /alert %}}

So first carefully think about how much you want to retain and for what period. 1GB a day is a lot of data, as we care storing plain text into the workspace. Queries from the workspace are included with the pricing.

---

## Step 3: Configure the Intune diagnostic settings

After we fully prepared our Log Analytics workspace, we can configure Intune to send the data to our workspace running in Azure. Open the Microsoft Intune admin center at https://intune.microsoft.com and go to `Tenant administration` > `Diagnostics settings`.

On this page, click the `+Add diagnostic setting` button.

[![jv-media-8541-59bf64a54a25.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/monitoring-microsoft-intune-with-log-analytics/jv-media-8541-59bf64a54a25.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/monitoring-microsoft-intune-with-log-analytics/jv-media-8541-59bf64a54a25.png)

Now enter a descriptive name. Then under `LOG`, enable the following categories:

- `AuditLogs`
- `OperationalLogs`
- `DeviceComplianceOrg`
- `IntuneDevices`

You could also include Windows 365 logs during this step if your environment has Windows 365 machines. In this guide, I will not dive into this topic.

Enable the option `Send to Log Analytics workspace` and select the Azure subscription and Log Analytics workspace created in Step 1. Take a look at my example below:

[![jv-media-8541-6d8b375ab368.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/monitoring-microsoft-intune-with-log-analytics/jv-media-8541-6d8b375ab368.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/monitoring-microsoft-intune-with-log-analytics/jv-media-8541-6d8b375ab368.png)

Then hit `Save` to activate the diagnostic setting.

[![jv-media-8541-6718b6bfe12b.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/monitoring-microsoft-intune-with-log-analytics/jv-media-8541-6718b6bfe12b.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/monitoring-microsoft-intune-with-log-analytics/jv-media-8541-6718b6bfe12b.png)

Microsoft Intune will now start sending the selected information to the Log Analytics workspace. Existing historical data is not added retroactively. The workspace starts receiving new data only after the diagnostic setting has been configured. So the maybe 180 days of retention you have selected starts from this moment on.

In the previous blade under `Diagnostic settings` the created setting will be there:

[![jv-media-8541-f1c0fd743280.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/monitoring-microsoft-intune-with-log-analytics/jv-media-8541-f1c0fd743280.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/monitoring-microsoft-intune-with-log-analytics/jv-media-8541-f1c0fd743280.png)

---

## Step 4: Verify incoming Intune logs in Log Analytics

After telling Intune to send the logs to Log Analytics we can check our workspace if any data is received. Return to the Azure Portal at [https://portal.azure.com](https://portal.azure.com) and once again go to `Log Analytics workspaces`, and open the created workspace.

Under `General`, select `Logs`

[![jv-media-8541-b8cc0b216617.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/monitoring-microsoft-intune-with-log-analytics/jv-media-8541-b8cc0b216617.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/monitoring-microsoft-intune-with-log-analytics/jv-media-8541-b8cc0b216617.png)

Here you can check if any Tables are there. These tables are created automatically if the data from Intune is sent to the workspace. In my case, I did this within 5 minutes of enabling data ingestion to Log Analytics so nothing is here yet. This can take up to 48 hours. In my case, the first real logs were available after around 15 hours.

Open the Azure Portal and then the Log Analytics workspace again, click on `Logs` on the left and make sure that `KQL mode` is selected on the right:

[![jv-media-8541-5f220f2e3c8b.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/monitoring-microsoft-intune-with-log-analytics/jv-media-8541-5f220f2e3c8b.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/monitoring-microsoft-intune-with-log-analytics/jv-media-8541-5f220f2e3c8b.png)

We can now perform some Kusto Query Language (KQL) queries to find specific information from the logs sent by Intune. It works similar to SQL, where if we type the name of a table, we get all information of that table presented:

In the Query window, type only the text below and click `Run`.

```
IntuneDevices
```

We will be presented with some information about our devices which we can expand and review:

[![jv-media-8541-656703d68a5b.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/monitoring-microsoft-intune-with-log-analytics/jv-media-8541-656703d68a5b.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/monitoring-microsoft-intune-with-log-analytics/jv-media-8541-656703d68a5b.png)

Now we could filter really easily the information we need. Let's say, we only want to see the coloms DeviceName, UPN, OS and Model. We could run this query:

{{< card code=true header="**Plain text**" lang="text" >}}
IntuneDevices
| project DeviceName, UPN, OS, Model
{{< /card >}}

This will only fetch the needed information and filters out all other information:

[![jv-media-8541-1d3ef6d1daeb.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/monitoring-microsoft-intune-with-log-analytics/jv-media-8541-1d3ef6d1daeb.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/monitoring-microsoft-intune-with-log-analytics/jv-media-8541-1d3ef6d1daeb.png)

This is a simple introduction to Kusto and the information retrieved. Now I will show you some more advanced queries where the value of this solution will become more clear.

---

## Step 5: Some example queries

Now that we verified the data is available, we can use KQL queries to retrieve information from the different Intune tables. In this step I will give you some examples of queries you can run to retrieve information you want. You can also add or remove some columns based on your preference.

### 5.1 Intune Device Inventory

This query shows a list of all devices in Intune with the most important columns which I added some formattings to:

{{< card code=true header="**Plain text**" lang="text" >}}
IntuneDevices
| where OS =~ "Windows" and EncryptionStatusString !~ "Encrypted"
| extend Compliance = strcat(iff(CompliantState =~ "Compliant", "✅ ", "❌ "), CompliantState)
| extend Encryption = case(tostring(EncryptionStatusString) in~ ("True", "Encrypted"), "✅ Encrypted", tostring(EncryptionStatusString) =~ "False", "❌ Not Encrypted", strcat("❌ ", EncryptionStatusString))
| extend LastSeen = format_datetime(todatetime(LastContact), "dd-MM-yyyy HH:mm")
| project DeviceName, UPN, Manufacturer, Model, SerialNumber, ['Operating System'] = OSVersion, Encryption, Compliance, LastSeen
| order by DeviceName asc
{{< /card >}}

[![jv-media-8541-f7e9d069ffbc.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/monitoring-microsoft-intune-with-log-analytics/jv-media-8541-f7e9d069ffbc.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/monitoring-microsoft-intune-with-log-analytics/jv-media-8541-f7e9d069ffbc.png)

This gives a really nice overview of how active devices are, their Encryption status and their Compliance status. Any device who has one of the two red needs some attention. You can also change the last line to order devices on another column, like LastSeen:

{{< card code=true header="**Plain text**" lang="text" >}}
| order by LastSeen asc
{{< /card >}}

This will order the devices on ascending Last Seen status, most inactive devices first.

### 5.2 Intune devices by platform

This query shows a bar diagram of all devices per platform:

{{< card code=true header="**Plain text**" lang="text" >}}
IntuneDevices
| summarize DeviceCount = count() by Platform = tostring(OS)
| order by DeviceCount desc
| render barchart with (title="5.2 Intune Devices by Platform", xcolumn=Platform, ycolumns=DeviceCount)
{{< /card >}}

[![jv-media-8541-a922859e879d.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/monitoring-microsoft-intune-with-log-analytics/jv-media-8541-a922859e879d.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/monitoring-microsoft-intune-with-log-analytics/jv-media-8541-a922859e879d.png)

### 5.3 Compliance overview by operating system

This query shows a circle diagram and the device compliance status per platform. In my case, only one device is available and shows as Compliant:

{{< card code=true header="**Plain text**" lang="text" >}}
IntuneDeviceComplianceOrg
| where isnotempty(OS)
| summarize Devices = count() by OS, ComplianceState
| extend Category = strcat(OS, " - ", ComplianceState)
| project Category, Devices
| render piechart with (title="5.3 Compliance overview by operating system")
{{< /card >}}

[![jv-media-8541-e64ee74f9988.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/monitoring-microsoft-intune-with-log-analytics/jv-media-8541-e64ee74f9988.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/monitoring-microsoft-intune-with-log-analytics/jv-media-8541-e64ee74f9988.png)

### 5.4 Administrator activities

Now we will dive deeper into Administrator activities, as this is one of the core enhancements. We can find all information by simply typing the name of the table, this shows what information is available for creating custom queries on:

{{< card code=true header="**Plain text**" lang="text" >}}
IntuneAuditLogs
{{< /card >}}

This reported two activities on my end as I have performed those after enabling the log to be sent to the workspace. Only activities after this action are recorded:

[![jv-media-8541-441cbf04e2ff.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/monitoring-microsoft-intune-with-log-analytics/jv-media-8541-441cbf04e2ff.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/monitoring-microsoft-intune-with-log-analytics/jv-media-8541-441cbf04e2ff.png)

We could dive deeper into the information itself to find what action exactly was performed:

[![jv-media-8541-211b81ce82e3.jpg](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/monitoring-microsoft-intune-with-log-analytics/jv-media-8541-211b81ce82e3.jpg)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/monitoring-microsoft-intune-with-log-analytics/jv-media-8541-211b81ce82e3.jpg)

As we can see, a Configuration Policy was created and assigned to a group. This was indeed an action I've done:

[![jv-media-8541-00ab1f69c904.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/monitoring-microsoft-intune-with-log-analytics/jv-media-8541-00ab1f69c904.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/monitoring-microsoft-intune-with-log-analytics/jv-media-8541-00ab1f69c904.png)

We could now perform a search into the logs of the last 180 days with this query:

{{< card code=true header="**Plain text**" lang="text" >}}
IntuneAuditLogs
| where TimeGenerated >= ago(180d)
| project TimeGenerated, Identity, OperationName, Category, ResultType, ResultDescription
| order by TimeGenerated desc
{{< /card >}}

As you just enabled the workspace and data ingestion, not much will show but after some weeks or months this will be really valuable information.

### 5.5 Deleted Intune objects

We could also look for deleted Intune objects in the logs by firing this query which search the audit logs for operations containing the word `Delete`:

{{< card code=true header="**Plain text**" lang="text" >}}
IntuneAuditLogs
| where TimeGenerated >= ago(180d)
| where OperationName contains "Delete"
| project TimeGenerated, Identity, OperationName, Category, ResultType, ResultDescription, Properties
| order by TimeGenerated desc
{{< /card >}}

[![jv-media-8541-cdb8bc59640d.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/monitoring-microsoft-intune-with-log-analytics/jv-media-8541-cdb8bc59640d.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/monitoring-microsoft-intune-with-log-analytics/jv-media-8541-cdb8bc59640d.png)

In my environment, this shows the configuration profile I created for the cause of this guide and after that deleted it.

---

## Step 6: Azure Workbook with these queries (optional)

To give you a nice and clear overview in Azure with my queries, I have created an Azure Workbook which you can download and utilize as an example of what is possible with this solution.

First download my example Workbook from GitHub:

<a class="btn btn-primary" href="https://github.com/JustinVerstijnen/JVIntuneWorkbook/blob/main/JVIntuneWorkbook.json" target="_blank" rel="noreferrer">View on my GitHub page</a>

Then download this file or copy the contents, just what you like.

Head back to Azure and search for `Workbooks`. On the Azure Workbooks page, click on `+ Create`.

[![jv-media-8541-02681cb2bc9a.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/monitoring-microsoft-intune-with-log-analytics/jv-media-8541-02681cb2bc9a.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/monitoring-microsoft-intune-with-log-analytics/jv-media-8541-02681cb2bc9a.png)

On the page after that, click on `+ New` to create a new workbook from scratch. Then click on the `</>` button to paste custom workbook code:

[![jv-media-8541-46e48cc47589.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/monitoring-microsoft-intune-with-log-analytics/jv-media-8541-46e48cc47589.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/monitoring-microsoft-intune-with-log-analytics/jv-media-8541-46e48cc47589.png)

On this page, select all current text and replace it with my template Workbook file to get my workbook in your environment which is already ready to go.

[![jv-media-8541-19962c1e83ac.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/monitoring-microsoft-intune-with-log-analytics/jv-media-8541-19962c1e83ac.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/monitoring-microsoft-intune-with-log-analytics/jv-media-8541-19962c1e83ac.png)

Make sure to replace all text here. My advice is to click somewhere in the code field, press `CTRL + A` and then paste the code to replace everything. Now you can click the `Apply` button and save the workbook and start using it.

[![jv-media-8541-818bfc042351.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/monitoring-microsoft-intune-with-log-analytics/jv-media-8541-818bfc042351.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/monitoring-microsoft-intune-with-log-analytics/jv-media-8541-818bfc042351.png)

The workbook contains all the queries I have explained above and are linked to the Time Range setting at the top of the workbook. This is an example of how the information from the Log Analytics workspace can be used for further investigation.

---

## Summary

By sending Microsoft Intune logs to an Azure Log Analytics workspace, we can centrally search administrator activities, operational events, compliance information, device inventory and extend our logs' retention. We created a Log Analytics workspace in Azure and configured the Intune diagnostic settings, verified the available tables, and used example KQL queries to show which information can be retrieved.

The Log Analytics retention configuration also makes the collected data suitable for longer-term reporting and investigations and even available for SIEM tools like Microsoft Sentinel or other third-party solutions.

In my opinion, you should use this if you have certain specific requirements only. The default sets of reports you get in Microsoft Intune are sufficient for most companies and people. I should only use this setup if you require to save audit logs for more than 30 days, you need detailed reporting/overview or you need to link a SIEM tool to your solutions. Otherwise, I should stick to the default options available.

Thank you for reading this post and I hope it was helpful!

{{% alert title="Sources 🕮" color="info" %}}
These sources helped me by writing and research for this post;

1. [https://learn.microsoft.com/en-us/intune/governance/integrate-azure-monitor](https://learn.microsoft.com/en-us/intune/governance/integrate-azure-monitor)
2. [https://learn.microsoft.com/en-us/intune/governance/monitor-audit-logs](https://learn.microsoft.com/en-us/intune/governance/monitor-audit-logs)
3. [https://learn.microsoft.com/en-us/azure/azure-monitor/reference/tables/IntuneAuditLogs](https://learn.microsoft.com/en-us/azure/azure-monitor/reference/tables/IntuneAuditLogs)
4. [https://learn.microsoft.com/en-us/azure/azure-monitor/reference/tables/IntuneOperationalLogs](https://learn.microsoft.com/en-us/azure/azure-monitor/reference/tables/IntuneOperationalLogs)
5. [https://learn.microsoft.com/en-us/azure/azure-monitor/reference/tables/IntuneDeviceComplianceOrg](https://learn.microsoft.com/en-us/azure/azure-monitor/reference/tables/IntuneDeviceComplianceOrg)
6. [https://learn.microsoft.com/en-us/azure/azure-monitor/reference/tables/IntuneDevices](https://learn.microsoft.com/en-us/azure/azure-monitor/reference/tables/IntuneDevices)
7. [https://learn.microsoft.com/en-us/azure/azure-monitor/logs/data-retention-configure](https://learn.microsoft.com/en-us/azure/azure-monitor/logs/data-retention-configure)
{{% /alert %}}

{{< ads >}}

{{< article-footer >}}