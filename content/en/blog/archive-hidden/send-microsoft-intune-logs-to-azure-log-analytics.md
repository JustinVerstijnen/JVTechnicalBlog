---
title: "Monitoring Microsoft Intune with Log Analytics"
slug: "monitoring-microsoft-intune-with-log-analytics"
date: 2026-12-03
tags:
- Step by Step guides
categories:
- Microsoft Intune
description: "In this post I will dive into sending Microsoft Intune audit, operational, compliance, and device logs to an Azure Log Analytics workspace and be able to write some custom queries."
hidden: false
---

In Microsoft Intune we can view some basic information about devices, the status of devices, operating systems and last connection time. For the most basic stuff this will be sufficient but we can retrieve some advanced information out of Intune and create custom reports or [even Azure Workbooks](https://justinverstijnen.nl/create-custom-azure-workbooks-for-detailed-monitoring/) from the data of Intune.

Most of the information Microsoft stores for you will be retained for 30 days like sign-in logs and activity logs. Some companies want to increase this period which is also possible with Log Analytics.

In this guide I will be using the Intune diagnostic settings to send this data to an Azure Log Analytics workspace and give a basic turorial on how to search the collected information using Kusto Query Language, better known as KQL. Then I will give some example queries:

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

The device compliance and Intune device reports are exported once every 24 hours. It can take up to 48 hours before this information becomes available in Log Analytics. Other information is near-realtime sent to Log Analytics.

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

Here you can check if any Tables are there. These tables are created automatically if the data from Intune is sent to the workspace. In my case, I did this within 5 minutes of enabling data ingestion to Log Analytics so nothing is here yet. This can

Close the welcome or queries window if it opens automatically. Make sure that `KQL mode` is selected and run the following query:

```kusto
IntuneAuditLogs
| take 10
```

If audit activities have reached the workspace, the query returns ten available records from the table.

We can also verify all four Intune tables using one query:

```kusto
union withsource=TableName
    IntuneAuditLogs,
    IntuneOperationalLogs,
    IntuneDeviceComplianceOrg,
    IntuneDevices
| summarize Records=count() by TableName
| order by TableName asc
```

This query combines the four tables and shows how many records are currently available in each table.

Do not be surprised if `IntuneDeviceComplianceOrg` and `IntuneDevices` are still empty. These reports can take up to 48 hours to appear.

---

## Step 5: Example queries for this solution

Now that the data is available, we can use KQL queries to retrieve information from the different Intune tables.

### 5.1 Recent administrator activities

The following query shows recent changes and remote actions recorded by Intune:

```kusto
IntuneAuditLogs
| where TimeGenerated >= ago(30d)
| project
    TimeGenerated,
    Identity,
    OperationName,
    Category,
    ResultType,
    ResultDescription
| order by TimeGenerated desc
```

The `Identity` column shows who or what performed the activity. `OperationName` describes the operation that was performed.

### 5.2 Activities performed by a specific administrator

Replace the example account with the user principal name of the administrator you want to investigate:

```kusto
IntuneAuditLogs
| where TimeGenerated >= ago(90d)
| where Identity contains "admin@contoso.com"
| project
    TimeGenerated,
    Identity,
    OperationName,
    Category,
    ResultType,
    ResultDescription
| order by TimeGenerated desc
```

Because the data is stored in Log Analytics, the query can cover the period available within the configured workspace retention.

### 5.3 Deleted Intune objects

This query searches the audit logs for operations containing the word `Delete`:

```kusto
IntuneAuditLogs
| where TimeGenerated >= ago(30d)
| where OperationName contains "Delete"
| project
    TimeGenerated,
    Identity,
    OperationName,
    Category,
    ResultType,
    ResultDescription,
    Properties
| order by TimeGenerated desc
```

The `Properties` column can contain additional information about the affected Intune object.

### 5.4 Operational events and enrollment results

The following query provides an overview of the operational events and their results:

```kusto
IntuneOperationalLogs
| where TimeGenerated >= ago(30d)
| summarize Events=count() by OperationName, Result
| order by Events desc
```

To focus on device enrollment events, we can filter the operation name:

```kusto
IntuneOperationalLogs
| where TimeGenerated >= ago(30d)
| where OperationName contains "Enrollment"
| project
    TimeGenerated,
    OperationName,
    Category,
    Result,
    Properties
| order by TimeGenerated desc
```

The exact operation names depend on the activities recorded in your Intune environment.

### 5.5 Noncompliant devices

The `IntuneDeviceComplianceOrg` table can be used to find devices that are not reported as compliant:

```kusto
IntuneDeviceComplianceOrg
| where ComplianceState !~ "Compliant"
| project
    TimeGenerated,
    DeviceName,
    UPN,
    OS,
    OSVersion,
    ComplianceState,
    DeviceHealthThreatLevel,
    LastContact
| order by DeviceName asc
```

Remember that this table is exported once every 24 hours and is not a real-time event stream.

### 5.6 Compliance overview by operating system

This query counts devices by operating system and compliance state:

```kusto
IntuneDeviceComplianceOrg
| summarize Devices=count() by OS, ComplianceState
| order by OS asc, ComplianceState asc
```

This can be useful when you want to compare the compliance status of Windows, Android, iOS, and macOS devices.

### 5.7 Intune device inventory

The following query creates an inventory containing the most useful device properties:

```kusto
IntuneDevices
| project
    DeviceName,
    UPN,
    Manufacturer,
    Model,
    OS,
    OSVersion,
    CompliantState,
    EncryptionStatusString,
    Ownership,
    JoinType,
    LastContact
| order by DeviceName asc
```

### 5.8 Windows devices without a reported encrypted state

We can use the device inventory to find Windows devices that are not reported as encrypted:

```kusto
IntuneDevices
| where OS =~ "Windows"
| where EncryptionStatusString !~ "Encrypted"
| project
    DeviceName,
    UPN,
    Manufacturer,
    Model,
    OSVersion,
    EncryptionStatusString,
    CompliantState,
    LastContact
| order by DeviceName asc
```

Before using this query for reporting, check which encryption values exist in your environment:

```kusto
IntuneDevices
| summarize Devices=count() by EncryptionStatusString
| order by Devices desc
```

### 5.9 Operating system versions

The following query shows which operating systems and versions are reported by your managed devices:

```kusto
IntuneDevices
| summarize Devices=count() by OS, OSVersion
| order by OS asc, Devices desc
```

This provides a quick overview of outdated or uncommon operating system versions in the environment.

---

## Summary

By sending Microsoft Intune logs to an Azure Log Analytics workspace, we can centrally search administrator activities, operational events, compliance information, device inventory and extend our logs' retention. We created a Log Analytics workspace in Azure and configured the Intune diagnostic settings, verified the available tables, and used example KQL queries to show which information can be retrieved.

The Log Analytics retention configuration also makes the collected data suitable for longer-term reporting and investigations and even available for SIEM tools like Microsoft Sentinel or other third-party solutions.

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
