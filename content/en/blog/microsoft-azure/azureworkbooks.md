---

title: "Create Custom Azure Workbooks for Detailed Monitoring"
date: 2026-04-16
slug: create-custom-azure-workbooks-for-detailed-monitoring
categories:

* Azure
* Monitoring
  tags:
* Azure Workbooks
* Azure Monitor
* Virtual Machines
* Observability
  draft: false

---

## Introduction

Azure Workbooks are a powerful way to build customizable dashboards for monitoring applications and infrastructure. They can combine multiple data sources such as:

* Metrics
* Log Analytics Workspaces
* Visualizations

They are flexible enough for quick performance overviews or deep investigations.

![Azure Workbook Overview](jv-media-1468-2640911c236e.png)

## Using Default Azure Workbooks

Many Azure resources include built-in workbook templates with basic health and performance insights.

1. Open your Virtual Machine.
2. Select **Workbooks**.
3. Choose **Overview** or another template.

![Default Workbook](jv-media-1468-718a21d9fa1c.png)

## Workbook Templates and Examples

Microsoft maintains a public repository with workbook templates:

* [https://github.com/microsoft/Application-Insights-Workbooks/tree/master/Workbooks](https://github.com/microsoft/Application-Insights-Workbooks/tree/master/Workbooks)

This library contains hundreds of ready-to-use workbooks that can also be reused in your own custom dashboards.

![Workbook Templates](jv-media-1468-054c08b65b8e.png)

## Import a Predefined Workbook

Create a new workbook in Azure and open the **Advanced Editor** to paste workbook JSON from GitHub.

![Create Workbook](jv-media-1468-b8f66398adf1.png)
![Advanced Editor](jv-media-1468-bc401700d54b.png)
![Empty Workbook JSON](jv-media-1468-07bd89e2f08b.png)

After applying the JSON, the workbook becomes available in your tenant.

![Imported Workbook](jv-media-1468-114a3e46f540.png)

## Build Your Own Custom Workbook

Useful building blocks:

* **Parameters** – filters, selectors, dynamic views
* **Queries** – KQL queries against Log Analytics
* **Metrics** – CPU, memory, disk, network
* **Groups** – combine components into sections

![Workbook Components](jv-media-1468-ddb3eaf80d17.png)

### Add CPU Metrics

Create a new metric tile:

* Resource type: **Virtual Machines**
* Scope: select one or more VMs
* Metric: **Percentage CPU**

![CPU Metric](jv-media-1468-c3134b9a392f.png)

### Add Memory Metrics

Use:

* **Available Memory Percentage**

![Memory Metric](jv-media-1468-115718ebd01e.png)

### Add Disk Metrics

Recommended metrics:

* Disk Read Bytes
* Disk Read Operations/sec
* Disk Write Bytes
* Disk Write Operations/sec

Use **Average** aggregation.

![Disk Metrics](jv-media-1468-d2d1f9528460.png)

## Save the Workbook

Store workbooks in a dedicated monitoring resource group or alongside the application.

![Save Workbook](jv-media-1468-074f695a16d4.png)

## Improve Visualizations

### Add Titles

Use **Advanced Settings** to define chart titles.

### Tile Order and Size

Reorder tiles and set width percentages (for example 50%) to create two-column layouts.

### Use Bar Charts

Bar charts are often clearer than line charts for quick health checks.

![Bar Charts](jv-media-1468-580ef53592cd.png)

### Grid View for Operations

Grid views are ideal for incident response and multi-VM overviews.

Add conditional formatting such as:

* CPU: Green → Red
* Memory Available: Red → Green

Round percentages to zero decimals for readability.

## Download Example Workbook

You can download the original sample workbook here:

* [https://github.com/JustinVerstijnen/DemonstrationWorkBook/blob/main/wb-jv-customworkbook.workbook](https://github.com/JustinVerstijnen/DemonstrationWorkBook/blob/main/wb-jv-customworkbook.workbook)

## Summary

Azure Workbooks provide a flexible and scalable way to visualize operational data in Azure. Start with templates, then evolve toward dashboards tailored to your own workloads.

![Final Dashboard](jv-media-1468-bea4d456f8dc.png)
