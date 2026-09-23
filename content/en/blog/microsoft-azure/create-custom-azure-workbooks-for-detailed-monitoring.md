---
title: "Create custom Azure Workbooks for detailed monitoring"
slug: "create-custom-azure-workbooks-for-detailed-monitoring"
date: 2026-09-23
tags:
- Concepts
- Step by Step guides
categories:
- Microsoft Azure
description: "Azure Workbooks are a great way to bring monitoring data from different Azure resources together in one clear and customizable dashboard. In this guide, I will show you how to use the built-in Workbooks, import existing templates, and create your own dashboard for monitoring Virtual Machines."
hidden: false
---

## What are Azure Workbooks?

Azure Workbooks allow us to create customizable dashboards for monitoring our solutions, applications and infrastructure in Azure. Instead of jumping between different Azure resources and monitoring blades, we can combine different types of information into one workbook, such as:

- Metrics
- Log Analytics Workspaces
- Visualizations

This makes Workbooks useful for both a quick overview of your environment and more detailed monitoring which is highly customizable.

In this guide, I will first show you some of the Workbooks that Azure already provides. After that, we will import an existing Workbook and finally build our own custom dashboard.

[![jv-media-1468-2640911c236e.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/create-custom-azure-workbooks-for-detailed-monitoring-1468/jv-media-1468-2640911c236e.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/create-custom-azure-workbooks-for-detailed-monitoring-1468/jv-media-1468-2640911c236e.png)

---

## Step 1: Using the default Azure Workbooks

Before building something ourselves, it is useful to have a look at the Workbooks that are already available in Azure.

Many Azure resources have built-in Workbook templates which give us some basic information about the health and performance of the resource.

For example, open one of your Virtual Machines in the Azure portal.

Then select `Workbooks` and open `Overview`, or choose one of the other available templates.

[![jv-media-1468-718a21d9fa1c.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/create-custom-azure-workbooks-for-detailed-monitoring-1468/jv-media-1468-718a21d9fa1c.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/create-custom-azure-workbooks-for-detailed-monitoring-1468/jv-media-1468-718a21d9fa1c.png)

This already gives us a good idea of what is possible with Azure Workbooks. But of course, we are not limited to the templates that are available directly in the Azure portal and we will create our custom Workbook in this post later on.

---

## Step 2: Finding Workbook templates

Microsoft has a public GitHub repository containing many different Azure Workbook examples and templates. You can find that repository here:

[https://github.com/microsoft/Application-Insights-Workbooks/tree/master/Workbooks](https://github.com/microsoft/Application-Insights-Workbooks/tree/master/Workbooks)

There are hundreds of examples in this repository for different Azure services and monitoring scenarios. You can use the complete workbooks or some of the queries for some inspiration before creating your own Workbook.

[![jv-media-1468-054c08b65b8e.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/create-custom-azure-workbooks-for-detailed-monitoring-1468/jv-media-1468-054c08b65b8e.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/create-custom-azure-workbooks-for-detailed-monitoring-1468/jv-media-1468-054c08b65b8e.png)

---

## Step 3: Importing an existing Workbook

Instead of creating everything from scratch, we can also import an existing Workbook. Create a new Workbook in Azure and open the `Advanced Editor`.

[![jv-media-1468-b8f66398adf1.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/create-custom-azure-workbooks-for-detailed-monitoring-1468/jv-media-1468-b8f66398adf1.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/create-custom-azure-workbooks-for-detailed-monitoring-1468/jv-media-1468-b8f66398adf1.png)

The Advanced Editor allows us to edit the JSON behind the Workbook. We can now copy the JSON from one of the examples on GitHub.

[![jv-media-1468-bc401700d54b.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/create-custom-azure-workbooks-for-detailed-monitoring-1468/jv-media-1468-bc401700d54b.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/create-custom-azure-workbooks-for-detailed-monitoring-1468/jv-media-1468-bc401700d54b.png)

Paste the JSON into the Advanced Editor.

[![jv-media-1468-07bd89e2f08b.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/create-custom-azure-workbooks-for-detailed-monitoring-1468/jv-media-1468-07bd89e2f08b.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/create-custom-azure-workbooks-for-detailed-monitoring-1468/jv-media-1468-07bd89e2f08b.png)

After applying the JSON, the Workbook becomes available in your own Azure environment.

[![jv-media-1468-114a3e46f540.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/create-custom-azure-workbooks-for-detailed-monitoring-1468/jv-media-1468-114a3e46f540.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/create-custom-azure-workbooks-for-detailed-monitoring-1468/jv-media-1468-114a3e46f540.png)

This is probably one of the easiest ways to get started. You can import an existing Workbook and then change it until it fits your own environment.

---

## Step 4: Building our own custom Workbook

Now that we know how the existing Workbooks work, let's create our own.

When creating a custom Workbook, there are a few useful building blocks we can use:

- `Parameters` – filters, selectors, and dynamic views
- `Queries` – KQL queries against Log Analytics
- `Metrics` – information such as CPU, memory, disk, and network
- `Groups` – combine multiple components into sections

[![jv-media-1468-ddb3eaf80d17.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/create-custom-azure-workbooks-for-detailed-monitoring-1468/jv-media-1468-ddb3eaf80d17.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/create-custom-azure-workbooks-for-detailed-monitoring-1468/jv-media-1468-ddb3eaf80d17.png)

For this example, we will focus mostly on metrics for our Virtual Machines.

### 4.1: Adding CPU metrics

Let's start with CPU usage.

Create a new metric tile and configure it with the following settings:

- Resource type: `Virtual Machines`
- Scope: select one or more VMs
- Metric: `Percentage CPU`

[![jv-media-1468-c3134b9a392f.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/create-custom-azure-workbooks-for-detailed-monitoring-1468/jv-media-1468-c3134b9a392f.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/create-custom-azure-workbooks-for-detailed-monitoring-1468/jv-media-1468-c3134b9a392f.png)

We now have our first metric inside the Workbook.

### 4.2 Adding memory metrics

Next, we can add memory information to our dashboard.

For this example, use the following metric:

- `Available Memory Percentage`

[![jv-media-1468-115718ebd01e.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/create-custom-azure-workbooks-for-detailed-monitoring-1468/jv-media-1468-115718ebd01e.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/create-custom-azure-workbooks-for-detailed-monitoring-1468/jv-media-1468-115718ebd01e.png)

Now we can already see both CPU and available memory from the same Workbook.

### 4.3: Adding disk metrics

Disk activity is another useful thing to have in our dashboard.

For disk monitoring, we can add the following metrics:

- Disk Read Bytes
- Disk Read Operations/sec
- Disk Write Bytes
- Disk Write Operations/sec

For these metrics, use `Average` as the aggregation.

[![jv-media-1468-d2d1f9528460.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/create-custom-azure-workbooks-for-detailed-monitoring-1468/jv-media-1468-d2d1f9528460.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/create-custom-azure-workbooks-for-detailed-monitoring-1468/jv-media-1468-d2d1f9528460.png)

At this point, our Workbook already contains some of the most useful information for quickly checking the performance of our Virtual Machines.

---

## Step 5: Saving the Workbook

When you are happy with the first version of your Workbook, we can save it.

You can store the Workbook inside a dedicated monitoring resource group or place it alongside the application or resources you are monitoring.

[![jv-media-1468-074f695a16d4.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/create-custom-azure-workbooks-for-detailed-monitoring-1468/jv-media-1468-074f695a16d4.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/create-custom-azure-workbooks-for-detailed-monitoring-1468/jv-media-1468-074f695a16d4.png)

Now our custom Workbook is saved and we can start improving the layout.

---

## Step 6: Improving the visualizations

Getting the data into a Workbook is one thing, but displaying it in a useful way is just as important. There are a few simple changes we can make to improve the overview. Good data visualisations are simple and give a great overview within seconds.

### 6.1: Adding titles

When you have multiple graphs and metrics on the same page, clear titles make the Workbook much easier to understand. Open the `Advanced Settings` of a visualization and configure a title for the chart.

### 6.2: Changing the tile order and size

You can also move the different tiles around and change their width. For example, setting two tiles to a width of `50%` allows us to place two visualizations next to each other.

This is especially useful when you want to compare different metrics without making the Workbook unnecessarily long.

### 6.3: Using bar charts

Depending on the information you are displaying, a bar chart can give you a clearer overview than a line chart.

For quick health checks, this can make it easier to compare the different values in the Workbook.

[![jv-media-1468-580ef53592cd.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/create-custom-azure-workbooks-for-detailed-monitoring-1468/jv-media-1468-580ef53592cd.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/create-custom-azure-workbooks-for-detailed-monitoring-1468/jv-media-1468-580ef53592cd.png)

### Using a grid view

A grid view is useful when we want to see information from multiple Virtual Machines in one overview.

We can also add conditional formatting to make important values easier to recognize.

For example:

- CPU: Green → Red
- Memory Available: Red → Green

For percentages, I also like to round the values to zero decimals. This keeps the overview simple and readable.

With these small changes, the Workbook becomes much easier to use when you quickly want to check the state of your environment.

---

## Download the example Workbook

If you want to test the Workbook yourself, you can download my example from GitHub:

<a class="btn btn-primary" href="https://github.com/JustinVerstijnen/DemonstrationWorkBook/blob/main/wb-jv-customworkbook.workbook" target="_blank" rel="noreferrer">View on my GitHub page</a>

You can use this as a starting point and change the resources, metrics, and visualizations to match your own environment.

---

## Summary

Azure Workbooks give us a flexible way to bring different monitoring information together into one dashboard.

We can start with the default Workbooks that Azure already provides, import one of the many available examples, or build our own Workbook from scratch.

By combining metrics such as CPU, memory, and disk activity with a clear layout, we can create a dashboard that gives us a quick overview of our Azure resources without having to open every resource individually.

[![jv-media-1468-bea4d456f8dc.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/create-custom-azure-workbooks-for-detailed-monitoring-1468/jv-media-1468-bea4d456f8dc.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/create-custom-azure-workbooks-for-detailed-monitoring-1468/jv-media-1468-bea4d456f8dc.png)

Thank you for visiting my website and I hope it was helpful.

{{% alert title="Sources 🕮" color="info" %}}
These sources helped me by writing and research for this post;

1. https://learn.microsoft.com/en-us/azure/azure-monitor/visualize/workbooks-overview
2. https://learn.microsoft.com/en-us/azure/azure-monitor/visualize/workbooks-create-workbook
3. https://learn.microsoft.com/en-us/azure/azure-monitor/visualize/workbooks-data-sources
4. https://learn.microsoft.com/en-us/azure/azure-monitor/visualize/workbooks-visualizations
5. https://learn.microsoft.com/en-us/azure/azure-monitor/visualize/workbooks-parameters
6. https://github.com/microsoft/Application-Insights-Workbooks
{{% /alert %}}

{{< ads >}}

{{< article-footer >}}