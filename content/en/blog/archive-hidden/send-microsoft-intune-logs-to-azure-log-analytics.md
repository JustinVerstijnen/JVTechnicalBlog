---
title: "Send Microsoft Intune logs to Azure Log Analytics"
slug: "send-microsoft-intune-logs-to-azure-log-analytics"
date: 2026-12-03
tags:
- Step by Step guides
- Tools and Scripts
categories:
- Microsoft Intune
- Microsoft Azure
description: "Learn how to send Microsoft Intune audit, operational, compliance, and device logs to an Azure Log Analytics workspace."
hidden: false
---

Microsoft Intune contains useful information about administrator activities, device enrollment, compliance, and managed devices. You can view most of this information in the Intune admin center, but the built-in reports are not always flexible enough when you want to combine information, create your own queries, or configure monitoring.

Using the Intune diagnostic settings, we can send this data to an Azure Log Analytics workspace. This allows us to search the collected information using Kusto Query Language, better known as KQL.

For example, we can use Log Analytics to retrieve information about:

- Changes made by Intune administrators
- Created, updated, assigned, or deleted policies
- Remote actions performed on devices
- Successful or failed device enrollments
- Noncompliant devices
- Device operating systems and versions
- Device manufacturers and models
- Encryption status
- The last time devices contacted Intune

Another advantage is that the retention period in Log Analytics can be configured separately. This makes it possible to keep the exported Intune logs available for longer-term reporting and investigations instead of depending only on the history and filtering offered by the individual Intune reports.

In this guide, I will create a Log Analytics workspace, connect Microsoft Intune to this workspace, and provide several example queries to show which information can be retrieved.

## Requirements

Before starting, make sure you have:

- A Microsoft Intune environment
- An Azure subscription
- The `Intune Administrator` Microsoft Entra role
- Sufficient permissions to create or select a Log Analytics workspace
- Devices enrolled in Microsoft Intune

Microsoft Intune can send four different log categories to Log Analytics:

| Log category | Log Analytics table | Purpose |
| --- | --- | --- |
| Audit logs | IntuneAuditLogs | Administrative changes and remote actions |
| Operational logs | IntuneOperationalLogs | Enrollment results and noncompliant device events |
| Device compliance organizational logs | IntuneDeviceComplianceOrg | Device compliance information |
| Intune devices | IntuneDevices | Device inventory and management information |

The audit and operational logs are event-based. After Azure Monitor receives the data, it typically becomes available within 30 minutes.

The device compliance and Intune device reports are exported once every 24 hours. It can take up to 48 hours before this information becomes available in Log Analytics.

## Step 1: Create a Log Analytics workspace

First, we need a Log Analytics workspace to store and query our Intune data.

Open the Azure Portal at https://portal.azure.com, search for `Log Analytics workspaces`, and select `Create`.

Configure the workspace using the following settings:

| Setting | Example value |
| --- | --- |
| Subscription | Your Azure subscription |
| Resource group | rg-monitoring |
| Name | log-intune-prod |
| Region | West Europe |

Select `Review + create` and then select `Create`.

After the deployment has completed, open the new Log Analytics workspace. We do not have to create the Intune tables manually. The tables are automatically made available after Intune starts sending data to the workspace.

## Step 2: Configure the Intune diagnostic settings

Open the Microsoft Intune admin center at https://intune.microsoft.com and go to `Tenant administration` > `Diagnostics settings`.

Select `Add diagnostic setting`.

Enter a recognizable name, such as:

```text
Send Intune logs to Log Analytics
```

Under `LOG`, enable the following categories:

- `AuditLogs`
- `OperationalLogs`
- `DeviceComplianceOrg`
- `IntuneDevices`

Enable `Send to Log Analytics workspace` and select the Azure subscription and Log Analytics workspace created in the previous step.

Select `Save` to activate the diagnostic setting.

Microsoft Intune will now start sending the selected information to the Log Analytics workspace. Existing historical data is not added retroactively. The workspace starts receiving new data after the diagnostic setting has been configured.

## Step 3: Verify the incoming Intune logs

Open the Azure Portal at https://portal.azure.com, go to `Log Analytics workspaces`, and open the workspace.

Under `General`, select `Logs`.

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

## Step 4: Example queries for Intune information

Now that the data is available, we can use KQL queries to retrieve information from the different Intune tables.

### Recent administrator activities

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

### Activities performed by a specific administrator

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

### Deleted Intune objects

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

### Operational events and enrollment results

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

### Noncompliant devices

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

### Compliance overview by operating system

This query counts devices by operating system and compliance state:

```kusto
IntuneDeviceComplianceOrg
| summarize Devices=count() by OS, ComplianceState
| order by OS asc, ComplianceState asc
```

This can be useful when you want to compare the compliance status of Windows, Android, iOS, and macOS devices.

### Intune device inventory

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

### Windows devices without a reported encrypted state

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

### Operating system versions

The following query shows which operating systems and versions are reported by your managed devices:

```kusto
IntuneDevices
| summarize Devices=count() by OS, OSVersion
| order by OS asc, Devices desc
```

This provides a quick overview of outdated or uncommon operating system versions in the environment.

## Summary

By sending Microsoft Intune logs to an Azure Log Analytics workspace, we can centrally search administrator activities, operational events, compliance information, and device inventory. We configured the Intune diagnostic settings, verified the available tables, and used example KQL queries to show which information can be retrieved. The Log Analytics retention configuration also makes the collected data suitable for longer-term reporting and investigations.

Thank you for reading this post and I hope it was helpful!

### Sources

These sources helped me by writing and research for this post;

1. https://learn.microsoft.com/en-us/intune/governance/integrate-azure-monitor
2. https://learn.microsoft.com/en-us/intune/governance/monitor-audit-logs
3. https://learn.microsoft.com/en-us/azure/azure-monitor/reference/tables/IntuneAuditLogs
4. https://learn.microsoft.com/en-us/azure/azure-monitor/reference/tables/IntuneOperationalLogs
5. https://learn.microsoft.com/en-us/azure/azure-monitor/reference/tables/IntuneDeviceComplianceOrg
6. https://learn.microsoft.com/en-us/azure/azure-monitor/reference/tables/IntuneDevices
7. https://learn.microsoft.com/en-us/azure/azure-monitor/logs/data-retention-configure

{{< ads >}}
{{< article-footer >}}