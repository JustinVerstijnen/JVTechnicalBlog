---
title: "Create custom Azure Workbooks for detailed monitoring"
date: 2025-05-08
slug: "create-custom-azure-workbooks-for-detailed-monitoring"
categories:
  - Microsoft Azure
tags:
  - Concepts
  - Step by Step guides
description: >
  Azure Workbooks are an excellent way to monitor your application and dependencies in a nice and customizable dashboard. Workbooks can...
---
Azure Workbooks are an excellent way to monitor your application and dependencies in a nice and customizable dashboard. Workbooks can contain technical information from multiple sources, like:

- Metrics
- Log Analytics Workspaces
- Visualisations

They’re highly flexible and can be used for anything from a simple performance report to a full-on investigative analysis tool. A workbook can look like this:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/create-custom-azure-workbooks-for-detailed-monitoring-1468/jv-media-1468-2640911c236e.png)

---

## Using the default Azure Workbooks

In Azure we can use the default workbooks in multiple resources that contain basic information about a resource and it's performance. You can find those under the resource itself.

Go to the virtual machine, then to "Workbooks" and then "Overview" (or one of the others):

This is a very basic workbook that can be useful, but we want to see more.

---

## Source for templates and example Workbooks

To start off creating your own Workbooks, you can use this Github page for excellent templates/examples of how Workbooks can be:

- <https://github.com/microsoft/Application-Insights-Workbooks/tree/master/Workbooks>

This repository contains hunderds of workbooks that are ready to use. We can also use parts of those workbooks for our own, customized, workbook that monitors a whole application.

Here we can download and view some workbooks that are related to the Virtual Machines service.

In Azure itself, there is a "templates" page too but it contains far less templates than the above Github page. For me the Github page was far more useful.

---

## Use a pre-defined workbook

Let's say, we want to use some of the workbooks found on the Github page above or elsewhere. We have to import this into our environment so it can monitor resources in our environment.

In Azure, go to "Workbooks" and create a new Workbook.

We start with a completely empty workbook. In the menu bar, you have an option, the "Advanced editor". Click on that to open the code view:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/create-custom-azure-workbooks-for-detailed-monitoring-1468/jv-media-1468-bc401700d54b.png)

Now we see the code of an empty Workbook:

On the Github page, I found the [Virtual Machine At Scale workbook](https://github.com/microsoft/Application-Insights-Workbooks/blob/master/Workbooks/Virtual%20Machines/At-scale%20Metrics/Key%20Metrics.workbook) which I want to deploy into my environment. On the Github page we can view the code and copy all of it.

We can paste this code into the Azure Workbook editor and then click on "Apply".

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/create-custom-azure-workbooks-for-detailed-monitoring-1468/jv-media-1468-3183696d71a6.png)

We now have a pre-defined Azure Workbook in our environment, which is basic but does the job:

---

## Creating our custom workbook

We now want to create some of our own queries to monitor one or multiple VMs, which is the basic reason you may want to have a workbook for.

In a new workbook we can add multiple different things:

The most important types are:

- **Parameters**: A parameter can be defined to do a certain thing, like defining a page and what we want to hide or show or a type or group of resources
- **Queries**: A query is a Log Analytics KQL query that gets information from there and visualizes it to your needs
- **Metrics**: Metrics are performance information from your resources like CPU, RAM, Disk and Network usage
- **Groups**: Groups are groups of the above blocks and can be combined for a better or linked view

### Adding CPU metrics

Let's start by adding a visualization for our CPU usage. Click on "New" and then on "Add metric"

Now we have to define everything for our virtual machine. Start by selecting the "Virtual Machines" resource type:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/create-custom-azure-workbooks-for-detailed-monitoring-1468/jv-media-1468-c62a0fde9d2e.png)

Then select the resource scope and then the virtual machine itself: (You can select multiple VMs here)

Now that we selected the scope, we can configure a metric itself. Click on "Add metric" and select the "Metric" drop-down menu. Select the "Percentage CPU" metric here.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/create-custom-azure-workbooks-for-detailed-monitoring-1468/jv-media-1468-a89aefde0fce.png)

Then click on Save and then "Run metrics" to view your information.

No worries, we will polish up [the visualizations later](#visualizations).

Save the metric.

### Adding the RAM metrics

We can add a metric for our RAM usage in mostly the same manner. Click on "Add" and the "Add metric"

Then perform the same steps to select your virtual machines and subscription.

Now add a metric named "Available Memory Percentage"

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/create-custom-azure-workbooks-for-detailed-monitoring-1468/jv-media-1468-115718ebd01e.png)

Now click on "Run metrics"

We have now a metric for the memory usage too.

Save the metric.

### Adding the Disk metrics

Now we can add a disk metric also, but the disk metrics are seperated into 4 categories (per disk):

- Disk Read Bytes and Read Operations
- Disk Write Bytes and Write Operations

This means we have to select all those 4 metrics in order to fully monitor our disk usage.

Add a new metric as we did before and select the virtual machine.

- Click on "Add metric" and select "Disk Read Bytes" and click on "Save"

- Then click on "Add metric" and select "Disk Read Operations/sec" and click on "Save"

- After that click on "Add metric" and select "Disk Write Bytes" and click on "Save"

- Finally click on "Add metric" and select "Disk Write Operations/sec" and click on "Save"

Select "Average" on all those metric settings for the best view.

Your metric should look like this:

Save the metric.

### Saving the workbook

Now that we have 3 queries ready we can save our workbook. Give it a name, and my advice is to save it to a dedicated monitoring resource group or to group the workbook together with the application. This way access control is defined to the resource too.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/create-custom-azure-workbooks-for-detailed-monitoring-1468/jv-media-1468-074f695a16d4.png)

---

## Visualize your metrics

Now that we have some raw data, we can now visualise this the way we want. The workbook on my end looks like this:

### Add titles to your queries

We can now add some titles to our queries and visualisations to better understand the data we are looking at. Edit the query and open it's Advanced settings.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/create-custom-azure-workbooks-for-detailed-monitoring-1468/jv-media-1468-748eb372c0b9.png)

Here we can give it a title under the "Chart title" option. Then save the query by clicking on "Done Editing".

Do this for all metrics you have made.

### Tile order

You can also change the tile order of the workbook. You can change the order of the queries with these buttons:

This changes the order of the tiles.

### Tile size

You can change the tile size in the query itself. Edit a query and go to the "Style" tab:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/create-custom-azure-workbooks-for-detailed-monitoring-1468/jv-media-1468-3d2ba6a090f4.png)

Select the option to make it a custom width, and change the Percent width option to 50. This allows 50 percent of the view pane available for this query.

Pick the second query and do the same. The queries are now next to each other:

### Bar charts and color pallettes

Now we have the default "Line" graph but we want to make the information more eye-catching and to the point. We can do this with a bar chart.

Edit your query and set the visualization to "Bar chart". We can also select a color pallette here:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/create-custom-azure-workbooks-for-detailed-monitoring-1468/jv-media-1468-af62ebe6700a.png)

Now our workbook looks like this:

Much more clear and eye-catching isn't it?

### Grid option

The grid visualization is much more functional and scalable but less visual and eye catching. I use this more in forensic research when there are issues on one or multiple machines to have much information in one view.

I have created a new tile with all the querys above in one tile and selected the "Grid" visualization:

Now you have a list of your virtual machines in one tile and on the right all the technical information. This works but looks very boring.

Grid visualizations allows for great customization and conditional formatting. We can do this by editing the tile and then click on "Column settings".

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/create-custom-azure-workbooks-for-detailed-monitoring-1468/jv-media-1468-1a4262fa4aa1.png)

Now this are the settings of how the information of the Grid/table is displayed. First, go to the tab "Labels".

Here we can give each column a custom name to make the grid/table more clear:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/create-custom-azure-workbooks-for-detailed-monitoring-1468/jv-media-1468-7df2dc81aff0.png)

You can rename all names in the "Column Label" row to your own preferred value. Save and let's take a look at the grid now:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/create-custom-azure-workbooks-for-detailed-monitoring-1468/jv-media-1468-51bc96c0abe0.png)

This is a lot better.

### Grids and conditional formatting

Now we can use conditional formatting to further clarify the information in the grid. Again, edit the grid and go to "Column settings".

For example, pick the "Percentage CPU", this is the first metric of the virtual machines:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/create-custom-azure-workbooks-for-detailed-monitoring-1468/jv-media-1468-3a079ed7ad64.png)

Change the "Column renderer" to "Heatmap". Make the Color pallette "Green to Red" and put in a minimum value of 0 and a maximum value of 100.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/create-custom-azure-workbooks-for-detailed-monitoring-1468/jv-media-1468-cbfa84135230.png)

This makes a scale for the tile to go fully green when 0 or close to zero and gradually go to red when going to 100% CPU usage.

Save the grid and let's check:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/create-custom-azure-workbooks-for-detailed-monitoring-1468/jv-media-1468-ac93663e003e.png)

The CPU block is now green, as the CPU usage is "just" 1,3%.

We can do the same for the RAM usage, but be aware that the RAM metric is available and not the usage like CPU. The metrics for the RAM usage has to be flipped. We can do this easily by using "Red to Green" instead of "Green to Red":

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/create-custom-azure-workbooks-for-detailed-monitoring-1468/jv-media-1468-ba4645e4590a.png)

The grid now looks like this:

### Rounding grid numbers

For the real perfectionists we can round the grid numbers. Now we see values like 1,326% and 89,259%. We want to see 1% and 89%.

Open the grid once again and open the "Column Settings".

Go down under the "Number Format Settings" and fill in a maximum fractional digit of "0".

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/create-custom-azure-workbooks-for-detailed-monitoring-1468/jv-media-1468-32f5e7e71d72.png)

Do this for each column and save the tile.

Now the grid looks like this:

---

## Download my Workbook

To further clarify what I have exactly done, I have published my Workbook of this guide on my Github page. You can download and use this for free.

[Download Workbook](https://github.com/JustinVerstijnen/DemonstrationWorkBook/blob/main/wb-jv-customworkbook.workbook)

---

## Summary

Azure Workbooks are an excellent and advanced way to monitor and visualize what is happening in your Azure environment. They can be tough at the start but it will become more easy when time goes by. By following this guide you have a workbook that look similar to this:

Thank you for reading this guide and I hope it was helpful.

{{< ads >}}

{{< article-footer >}}
