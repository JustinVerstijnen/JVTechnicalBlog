---
title: "Monitor unauthorized changes to Azure Diagnostic Settings with Log Analytics"
date: 2026-10-31
slug: "monitor-unauthorized-azure-diagnostic-settings-changes"
draft: true
categories:
  - Microsoft Azure
  - Microsoft Defender XDR
tags:
  - Step by Step guides
  - Knowledge check
description: >
  In this guide I describe how to monitor Azure Diagnostic Settings changes using subscription Activity Logs, a Log Analytics workspace, KQL queries and Azure Monitor alert rules.
---

In this guide I will dive into how we can monitor changes to Azure Diagnostic Settings by using Azure Monitor, Log Analytics and some Kusto Query Language (KQL). We will export the Azure Activity Log to a Log Analytics workspace, search for changes to diagnostic settings and create an alert when somebody modifies or removes a configuration.

I will also add some optional security improvements, because logging is one of the first things you want to have available when investigating an incident. If somebody changes the settings that collect your security logs, you want to know about it as soon as possible.

{{% alert color="warning" %}}
This is a **research-based deployment guide**. The KQL queries use documented AzureActivity fields and are intended to be tested against your own subscription. **Not every change is unauthorized:** the alert detects changes, while your change-management process and an independent configuration baseline determine whether a change is approved. Validate the resulting audit events before publishing screenshots or making a detection guarantee.
{{% /alert %}}

---

## The solution described

Azure Diagnostic Settings tell Azure which platform logs and metrics should be forwarded to destinations such as a Log Analytics workspace, Azure Storage or Event Hubs.

For example, you can configure an Azure Key Vault to send its audit events to Log Analytics for investigation and monitoring.

But what happens when an administrator, automation account or a compromised identity disables the diagnostic settings? Your resource logs might stop arriving at the monitoring destination, which reduces visibility into what happens next.

To detect those changes, we can use the **Azure Activity Log**. This log records Azure Resource Manager control-plane operations, including the creation, update and deletion of many diagnostic settings.

For our example I will use the following setup:

| Resource | Purpose |
| --- | --- |
| Azure subscription | Contains the resources we want to monitor |
| Log Analytics workspace | Receives subscription Activity Log entries |
| Subscription diagnostic setting | Exports Administrative activity events |
| Test resource with diagnostic settings | Generates a harmless configuration-change event |
| KQL query | Finds Diagnostic Settings write/delete operations |
| Azure Monitor log search alert | Notifies administrators of detected changes |
| Action group | Delivers an email or other notification |

<!-- Diagram to create: Azure resource Diagnostic Settings change -> Subscription Activity Log -> subscription-level export -> Log Analytics AzureActivity -> KQL / Azure Monitor alert -> Action Group. Include an independent Activity Log alert as an optional path. -->

### Resource logs versus Activity Logs

This difference is important:

- **Resource logs** provide information about activity **inside** a service, such as Key Vault audit operations. These generally require a diagnostic setting to be exported.
- **Activity Logs** record **control-plane** operations against Azure resources, such as changing a resource configuration. The subscription Activity Log is collected by Azure without first creating a resource diagnostic setting. Exporting it to Log Analytics gives us longer retention and more flexible KQL analysis.

We will therefore monitor changes to resource diagnostic settings through a **subscription-level Activity Log export**, rather than depending only on the logs produced by the resource we are protecting.

---

## 1: Prepare the Log Analytics workspace

We will first create or select a Log Analytics workspace in which the management events can be collected.

Go to the Azure Portal: <https://portal.azure.com>.

Search for **Log Analytics workspaces** and click **Create**.

For this guide I will use these example settings:

| Setting | Value |
| --- | --- |
| Resource group | `rg-monitoring-security` |
| Workspace name | `law-azure-activity-security` |
| Region | A suitable supported region for your organization |
| Retention | According to your security and compliance requirements |

<!-- Screenshot to capture: Creating the Log Analytics workspace. -->

Finish the creation wizard and open the workspace.

For production environments I recommend using a workspace with restricted administrator permissions. If the same identity can both disable diagnostic settings and delete or change the monitoring destination, it can affect your ability to investigate an incident.

{{% alert color="info" %}}
A separate monitoring subscription can be useful for stronger separation of responsibilities. However, this is not automatically tamper-proof: permissions, alert configuration and the subscription-level export still need to be protected.
{{% /alert %}}

---

## 2: Export the subscription Activity Log

Now that we have the workspace, we will configure the subscription to export Activity Log entries to this workspace.

In the Azure Portal, search for **Monitor**.

Navigate to **Activity log** and click **Export Activity Logs**. Select the subscription we want to monitor, then click **Add diagnostic setting**.

This is the diagnostic setting on the **subscription Activity Log**, not the diagnostic setting of an individual storage account, virtual machine or Key Vault.

Configure the following:

| Setting | Value |
| --- | --- |
| Diagnostic setting name | `diag-subscription-activity-security` |
| Log category | **Administrative** (required for this guide) |
| Other Activity Log categories | Optional, based on your monitoring requirements |
| Destination | **Send to Log Analytics workspace** |
| Log Analytics workspace | `law-azure-activity-security` |

<!-- Screenshot to capture: Subscription Activity Log export with Administrative checked and the workspace selected. -->

Click **Save**.

From this moment onward, new matching events can be exported to the workspace. Allow some time for the initial configuration and ingestion. Azure logging is not always instantaneous.

If your organization needs a complete Activity Log history for security or operations, consider exporting additional subscription categories rather than only Administrative events. These additional categories are not required for the specific detection described in this guide.

---

## 3: Verify that Activity Logs arrive in Log Analytics

We will first verify that our subscription is sending data before creating any detection queries.

Open the Log Analytics workspace and select **Logs**.

Run the following KQL query:

{{< card code=true header="**KQL**" lang="kusto" >}}
AzureActivity
| where TimeGenerated > ago(24h)
| summarize Events = count(), LastEvent = max(TimeGenerated) by SubscriptionId
| order by LastEvent desc
{{< /card >}}

This query shows the number of Activity Log entries received per subscription over the past 24 hours, together with the last received event.

<!-- Screenshot to capture: AzureActivity table with events and LastEvent values. -->

If no results are returned, verify that:

- You selected the correct subscription in the export configuration.
- The **Administrative** category is enabled.
- The destination workspace is correct.
- You have enough permissions to read data from the workspace.
- Enough time has passed for the export to start and logs to be ingested.
- A relevant management operation actually occurred during the selected time range.

A quiet subscription can legitimately have very few Administrative events. If necessary, perform an approved, harmless test change in a test resource to generate a new event.

---

## 4: Find Diagnostic Settings changes with KQL

Azure Diagnostic Settings are managed through operations under the **Microsoft.Insights/diagnosticSettings** resource provider.

For this guide we will look for two control-plane operations:

| Operation | Meaning |
| --- | --- |
| `Microsoft.Insights/diagnosticSettings/write` | A diagnostic setting was created or updated |
| `Microsoft.Insights/diagnosticSettings/delete` | A diagnostic setting was deleted |

We can search for them using this complete KQL query:

{{< card code=true header="**KQL**" lang="kusto" >}}
AzureActivity
| where TimeGenerated > ago(7d)
| where CategoryValue =~ "Administrative"
| extend Operation = tolower(OperationNameValue)
| where Operation in (
    "microsoft.insights/diagnosticsettings/write",
    "microsoft.insights/diagnosticsettings/delete"
)
| project
    TimeGenerated,
    SubscriptionId,
    ResourceGroup,
    TargetResourceId = _ResourceId,
    Operation,
    ActivityStatusValue,
    Caller,
    CorrelationId,
    Properties_d
| order by TimeGenerated desc
{{< /card >}}

The query uses `tolower()` because the case of values stored in AzureActivity can vary. This is especially useful when comparing resource provider operations.

<!-- Screenshot to capture: KQL results showing the diagnosticSettings/write and /delete operations. -->

### Understanding the result

| Column | Description |
| --- | --- |
| `TimeGenerated` | Timestamp associated with the event (not necessarily the ingestion time) |
| `SubscriptionId` | Subscription containing the operation |
| `TargetResourceId` | Resource identifier reported with the Activity Log event |
| `Operation` | Create/update or delete operation |
| `ActivityStatusValue` | Operation status, such as Started or Succeeded/Success |
| `Caller` | Identity reported by Azure for the operation |
| `CorrelationId` | Helps relate records belonging to the same operation |
| `Properties_d` | Additional details supplied with the event, where available |

A `write` event does **not** automatically mean that logging was disabled. It could also be a legitimate configuration update. The Activity Log is our starting point for investigation, not always a full before-and-after record of every changed property.

---

## 5: Focus on successful configuration changes

The first query also displays operations that were started or failed. For a monitoring rule that looks for completed changes, we can narrow the result to successful operations.

Run the following query:

{{< card code=true header="**KQL**" lang="kusto" >}}
AzureActivity
| where TimeGenerated > ago(7d)
| where CategoryValue =~ "Administrative"
| extend Operation = tolower(OperationNameValue)
| where Operation in (
    "microsoft.insights/diagnosticsettings/write",
    "microsoft.insights/diagnosticsettings/delete"
)
| where ActivityStatusValue in~ ("Success", "Succeeded")
| project
    TimeGenerated,
    Caller,
    Operation,
    SubscriptionId,
    TargetResourceId = _ResourceId,
    CorrelationId
| order by TimeGenerated desc
{{< /card >}}

The exact status values should be verified against events from your own subscription. Microsoft examples commonly use `Success` in the `AzureActivity` table. The query allows both `Success` and `Succeeded` to avoid relying on one representation.

If this query returns fewer events than the first query, inspect the **ActivityStatusValue** column in the original results to see which events were excluded.

---

## 6: Separate approved and unexpected changes (optional)

When we start monitoring all changes, we will probably also receive events from legitimate administrators and deployment pipelines.

One way to prioritize unexpected changes is to compare the recorded caller against a small list of approved deployment identities.

The following example uses a **demonstration allowlist**. Replace the sample values with your own identities before running it.

{{< card code=true header="**KQL**" lang="kusto" >}}
let ApprovedCallers = dynamic([
    "azure-deployment@contoso.com",
    "security-admin@contoso.com"
]);
AzureActivity
| where TimeGenerated > ago(7d)
| where CategoryValue =~ "Administrative"
| extend Operation = tolower(OperationNameValue)
| where Operation in (
    "microsoft.insights/diagnosticsettings/write",
    "microsoft.insights/diagnosticsettings/delete"
)
| where ActivityStatusValue in~ ("Success", "Succeeded")
| extend CallerNormalized = tolower(tostring(Caller))
| where CallerNormalized !in (ApprovedCallers)
| project
    TimeGenerated,
    Caller,
    Operation,
    SubscriptionId,
    TargetResourceId = _ResourceId,
    CorrelationId
| order by TimeGenerated desc
{{< /card >}}

{{% alert color="warning" %}}
An approved caller can still make an unauthorized change if its account is compromised or the change was never approved. Similarly, a legitimate change may come from an identity not on this list. Use this query to **prioritize review**, not to make a final security determination.
{{% /alert %}}

For higher assurance, combine this with a change request, a known-good configuration export and periodic comparison of the current Diagnostic Settings configuration.

---

## 7: Create an Azure Monitor alert rule

Now we can automate detection using an Azure Monitor **Log search alert**.

Open the Log Analytics workspace, go to **Logs** and run the successful-changes query from step 5. Then select **New alert rule** from the query editor, or create a new alert from **Monitor** -> **Alerts** -> **Create** and target the workspace.

Use this complete KQL query for the alert. It returns **one row per detected operation**, which works well when using the **Table rows** measurement.

{{< card code=true header="**KQL**" lang="kusto" >}}
AzureActivity
| where TimeGenerated > ago(15m)
| where CategoryValue =~ "Administrative"
| extend Operation = tolower(OperationNameValue)
| where Operation in (
    "microsoft.insights/diagnosticsettings/write",
    "microsoft.insights/diagnosticsettings/delete"
)
| where ActivityStatusValue in~ ("Success", "Succeeded")
| project
    TimeGenerated,
    Caller,
    Operation,
    SubscriptionId,
    TargetResourceId = _ResourceId,
    CorrelationId
{{< /card >}}

Configure the condition in the alert rule using these example values:

| Setting | Value |
| --- | --- |
| Signal | Custom log search |
| Measure | Table rows / Number of results |
| Operator | Greater than |
| Threshold value | `0` |
| Evaluation frequency | `5 minutes` |
| Lookback / query time range | `15 minutes` |
| Severity | Choose according to your incident process, e.g. Sev 2 |

<!-- Screenshot to capture: Azure Monitor log alert condition showing Table rows and threshold > 0. -->

Be aware that a 15-minute lookback evaluated every 5 minutes can result in overlapping detections for the same event. Configure alert suppression/handling and deduplication according to your requirements. Don't assume every email corresponds to a unique change.

{{% alert color="info" %}}
If you use `summarize count()` without filtering out zero results and then alert on **Table rows greater than 0**, your query might always return one row, even if the count is zero. That's why this example returns the actual matching events instead.
{{% /alert %}}

---

## 8: Create an Action Group

We now need an Action Group so the alert can notify somebody.

From the alert creation wizard, go to **Actions** and select **Create action group** if you don't have one already.

For example:

| Setting | Value |
| --- | --- |
| Action group name | `ag-security-diagnostic-settings` |
| Display name | `AzureDiag` |
| Notification type | Email |
| Recipient | Your monitored security or operations mailbox |

<!-- Screenshot to capture: Action Group configuration with the notification method. -->

Save the Action Group and return to the alert rule. Give the alert a clear name, such as **Azure Diagnostic Settings configuration changed**.

Add a description explaining that the alert detects create/update/delete operations and that the receiving team needs to check whether the change was authorized.

Save the alert rule and ensure that it is enabled.

---

## 9: Test the alert with a harmless change

We will now verify the complete path from an Azure configuration change to the alert notification.

Do **not** test this by disabling the logging of a production security resource.

Instead, create or select a disposable test resource, for example a test storage account. Open the resource and navigate to **Monitoring** -> **Diagnostic settings**.

If the resource has no diagnostic setting yet, create one using a supported log or metric category and a permitted destination. Otherwise, use a **disposable** diagnostic setting and make a small approved configuration adjustment, such as modifying its selected categories when supported.

<!-- Screenshot to capture: The test resource Diagnostic Settings page before and after an approved change. -->

Now return to Log Analytics and run the query from step 4. Verify that a new `diagnosticSettings/write` operation appears.

Next, verify that the alert evaluates the operation and that your Action Group receives the notification.

If you also want to test `diagnosticSettings/delete`, delete **only the disposable test diagnostic setting** and repeat the validation. Never delete a production security logging configuration simply to demonstrate an alert.

Finally, confirm that your test resource is left in the intended state and that any test resources no longer needed are removed.

---

## 10: Additional security recommendations (optional)

This solution is useful, but we can make it more resilient by taking a few additional measures.

### Separate the monitoring destination

Store the exported Activity Logs in a workspace with restricted access, ideally managed by a separate security or monitoring team. Review who can change the workspace, its retention, the diagnostic export and the alert rules.

### Protect the subscription Activity Log export

Remember that the export itself is also configured using Diagnostic Settings. If somebody removes that export, Log Analytics can stop receiving new entries, even though the Azure subscription Activity Log still exists.

For critical environments, configure an **independent Azure Monitor Activity Log alert** for changes to the subscription-level diagnostic setting, and consider an additional independent destination such as a central Event Hub or Storage account when appropriate. Test what happens when an export route is removed.

### Check for missing events

A no-results query is not proof that everything is safe. Investigate unexpected gaps in the event stream and periodically verify that subscription Activity Logs are still arriving. For quiet subscriptions, use an approved heartbeat or controlled change rather than assuming there will always be administrative activity.

### Compare with a known-good baseline

Create a periodic inventory of the expected diagnostic settings and their destinations. A log event can show **who performed a write operation**, but the inventory helps confirm **what is configured now** and what differs from the approved baseline.

### Use least privilege

Restrict who can create, update and delete Diagnostic Settings, and who can change the Log Analytics workspace or the alert rule. Be careful with highly privileged accounts and automated identities that have broad Azure resource permissions.

---

## 11: Troubleshooting (optional)

### The AzureActivity table is empty

Check the subscription Activity Log export, the Administrative category, the destination workspace, permissions and ingestion delay. Confirm that an approved activity occurred after the export was configured.

### I see the change in Activity Log, but not in the KQL query

Run the broader query from step 4. Inspect the exact `OperationNameValue`, `ActivityStatusValue`, `Caller` and resource identifier fields of the record. Check the query time range and whether the record reached the correct Log Analytics workspace.

### The query shows more results than expected

You may see multiple events for the same operation, such as Started and Success. Use the successful-events query and inspect the `CorrelationId` to relate records. Also check whether more than one subscription is exporting to your workspace.

### The alert doesn't fire

Verify the alert rule is enabled and targets the correct workspace. Check the measurement (**Table rows**), threshold, evaluation interval, query time range and Action Group. Confirm that the expected event is visible inside the alert rule's evaluation window.

### The alert identifies a familiar administrator

That does not automatically make the change authorized. Verify the change ticket, timing and expected diagnostic configuration. If the identity or action is unexpected, investigate it according to your incident response process.

---

## Knowledge check

{{< quiz >}}
{
  "intro": "Answer these question(s) to test your understanding of this post. Your answers are not saved or sent anywhere; this is simply a personal knowledge check. If you refresh the page, your answers will be cleared.",
  "questions": [
    {
      "question": "Which log source is used to detect Azure Diagnostic Settings configuration changes in this guide?",
      "reference": "See the section: The solution described",
      "referenceUrl": "#the-solution-described",
      "answers": [
        {"text": "Azure subscription Activity Log", "correct": true, "message": "Correct! Activity Logs record management operations on Azure resources."},
        {"text": "Only the application logs of the monitored resource", "correct": false, "message": "Incorrect. The configuration change is a control-plane operation."},
        {"text": "Windows Security Event Log", "correct": false, "message": "Incorrect. That is not the source used for Azure Resource Manager diagnostic setting changes."}
      ]
    },
    {
      "question": "What does Microsoft.Insights/diagnosticSettings/delete represent?",
      "reference": "See the section: 4: Find Diagnostic Settings changes with KQL",
      "referenceUrl": "#4-find-diagnostic-settings-changes-with-kql",
      "answers": [
        {"text": "A delete operation against a diagnostic setting", "correct": true, "message": "Correct! This is a relevant event to investigate."},
        {"text": "A successful user sign-in", "correct": false, "message": "Incorrect. Sign-ins are different events."},
        {"text": "A Windows shutdown event", "correct": false, "message": "Incorrect. This is an Azure management operation."}
      ]
    },
    {
      "question": "Does a familiar Caller value prove that a change was authorized?",
      "reference": "See the section: 6: Separate approved and unexpected changes (optional)",
      "referenceUrl": "#6-separate-approved-and-unexpected-changes-optional",
      "answers": [
        {"text": "No, it needs to be compared with approvals and expected configuration", "correct": true, "message": "Correct! The caller alone isn't enough to determine authorization."},
        {"text": "Yes, administrator identities can never be compromised", "correct": false, "message": "Incorrect. Privileged identity compromise is an important risk."},
        {"text": "Yes, as long as the event is in Log Analytics", "correct": false, "message": "Incorrect. Logging an event doesn't make the activity approved."}
      ]
    }
  ]
}
{{< /quiz >}}

---

## Summary

With Azure Activity Logs, Log Analytics and a few KQL queries we can build a simple solution to monitor changes to Azure Diagnostic Settings. We can see which identities performed management operations, when they happened and which resources were involved.

The biggest advantage is that we can monitor control-plane changes independently from the resource logs that a diagnostic setting forwards. This gives us another source of information when a resource stops sending logs to our monitoring environment.

But remember that **detecting a change is not the same as proving it was unauthorized**. A good monitoring solution also needs restricted permissions, a reliable export path, an approved configuration baseline and an incident response process.

Thank you for reading this page and I hope it was helpful.

{{% alert title="Sources 📖" color="info" %}}
These sources helped me by writing and research for this post:
1. https://learn.microsoft.com/en-us/azure/azure-monitor/fundamentals/activity-log
2. https://learn.microsoft.com/en-us/azure/azure-monitor/data-collection/diagnostic-settings
3. https://learn.microsoft.com/en-us/azure/azure-monitor/reference/queries/azureactivity
4. https://learn.microsoft.com/en-us/azure/azure-monitor/alerts/alerts-types
5. https://learn.microsoft.com/en-us/azure/azure-monitor/alerts/alerts-create-activity-log-alert-rule
6. https://learn.microsoft.com/en-us/azure/azure-monitor/alerts/alerts-create-log-alert-rule
{{% /alert %}}

{{< ads >}}

{{< article-footer >}}
