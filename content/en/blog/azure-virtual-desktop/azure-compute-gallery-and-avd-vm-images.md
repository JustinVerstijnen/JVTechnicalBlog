---
title: "Azure Compute Gallery and (AVD) VM images"
date: 2025-10-09
slug: "azure-compute-gallery-and-avd-vm-images"
categories:
  - Azure Virtual Desktop
tags:
  - Concepts
description: >
  Azure Compute Gallery is a great service in Azure to store, capture and maintain your VM images. This post explains how to work through these steps and how this works.
---
Azure Compute Gallery is a great service in Azure to store, capture and maintain your VM images. This can be helpful when deploying multiple similar VMs. Use cases of this can be [VM Scale Sets](https://justinverstijnen.nl/amc-module-7-virtual-machines-and-scale-sets/#virtual-machine-scale-sets-vmss), webservers , containers or Azure Virtual Desktop session hosts.

In this blog post, I will tell more about Azure Compute Gallery, how to use it when imaging VMs and how it can help you storing and maintaining images for your VMs.

---

## Requirements

- Around 40 minutes of your time
- Basic knowledge of (Windows) VMs
- Basic knowledge of Azure
- An Azure subscription to test the functionality

---

## What is Azure Compute Gallery?

Azure Compute Gallery (ACG) is a service in Azure that helps you storing, categorizing and maintaining images of your virtual machines. This can be really helpful when needing to deploy similar virtual machines, which we do for Virtual Machine Scale Sets but also for Azure Virtual Desktop. Those are 2 services where similar images needs to be deployed. You can also build "specialized" images for different use cases where similarity is not a requirement, like Active Directory Domain Controllers or SQL/Application servers.

The features of Azure Compute Gallery:

- **Image versioning:** We can build our own versioning and numbering for images, storing newer images under a new version number for documentation and testing purposes. This makes it easy to rollback to a previous version if something is wrong.
- **Global Replication:** Images can be distributed across multiple regions for more availability and faster deployment
- **Sharing of images:** You can share Azure Compute Gallery images with tenants outside of your own organization, especially useful when you have Azure Landing Zones
- **Security and Access control:** Access to different images and versions can be restricted through [Azure RBAC](https://justinverstijnen.nl/introduction-to-microsoft-azure-roles-rbac-iam-the-easy-way/).

---

## How does Azure Compute Gallery work?

Azure Compute Gallery itself is a sort specialized storage account for storing images only. In the gallery, you have a VM definition, which is a group of images for a specific use case and under the definitions, we put the images itself. All of this looks like this:

<!-- draw.io diagram -->
<div class="drawio-white-background" style="background:#ffffff; padding:24px; border-radius:12px; overflow-x:auto;">
<div class="mxgraph" style="max-width:100%;border:1px solid transparent;background:#ffffff;" data-mxgraph="{&quot;highlight&quot;:&quot;#0000ff&quot;,&quot;nav&quot;:true,&quot;resize&quot;:true,&quot;dark-mode&quot;:&quot;light&quot;,&quot;toolbar&quot;:&quot;zoom layers tags lightbox&quot;,&quot;xml&quot;:&quot;&lt;mxfile host=\&quot;app.diagrams.net\&quot; agent=\&quot;Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0\&quot; version=\&quot;27.1.6\&quot;&gt;\n  &lt;diagram name=\&quot;Pagina-1\&quot; id=\&quot;HubWzr2QccLLdvSIAkE2\&quot;&gt;\n    &lt;mxGraphModel dx=\&quot;1434\&quot; dy=\&quot;692\&quot; grid=\&quot;1\&quot; gridSize=\&quot;10\&quot; guides=\&quot;1\&quot; tooltips=\&quot;1\&quot; connect=\&quot;1\&quot; arrows=\&quot;1\&quot; fold=\&quot;1\&quot; page=\&quot;1\&quot; pageScale=\&quot;1\&quot; pageWidth=\&quot;400\&quot; pageHeight=\&quot;156\&quot; math=\&quot;0\&quot; shadow=\&quot;0\&quot;&gt;\n      &lt;root&gt;\n        &lt;mxCell id=\&quot;0\&quot; /&gt;\n        &lt;mxCell id=\&quot;1\&quot; parent=\&quot;0\&quot; /&gt;\n        &lt;mxCell id=\&quot;KDslBvjNO1J71vhcfkAz-1\&quot; value=\&quot;&amp;lt;span&amp;gt;&amp;lt;b&amp;gt;Azure Compute Gallery&amp;lt;/b&amp;gt;&amp;lt;/span&amp;gt;\&quot; style=\&quot;image;aspect=fixed;html=1;points=[];align=center;fontSize=12;image=img/lib/azure2/compute/Azure_Compute_Galleries.svg;\&quot; vertex=\&quot;1\&quot; parent=\&quot;1\&quot;&gt;\n          &lt;mxGeometry x=\&quot;-119\&quot; y=\&quot;-140\&quot; width=\&quot;68\&quot; height=\&quot;68\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;KDslBvjNO1J71vhcfkAz-2\&quot; value=\&quot;&amp;lt;b&amp;gt;ImageDefinition-AzureVirtualDesktop&amp;lt;/b&amp;gt;\&quot; style=\&quot;image;aspect=fixed;html=1;points=[];align=center;fontSize=12;image=img/lib/azure2/other/Image_Definition.svg;\&quot; vertex=\&quot;1\&quot; parent=\&quot;1\&quot;&gt;\n          &lt;mxGeometry x=\&quot;-285\&quot; y=\&quot;-30\&quot; width=\&quot;68\&quot; height=\&quot;64\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;KDslBvjNO1J71vhcfkAz-3\&quot; value=\&quot;&amp;lt;b&amp;gt;Version 1.0.0&amp;lt;/b&amp;gt;&amp;lt;div&amp;gt;&amp;lt;b&amp;gt;Windows 11 23H2&amp;lt;/b&amp;gt;&amp;lt;/div&amp;gt;\&quot; style=\&quot;image;aspect=fixed;html=1;points=[];align=center;fontSize=12;image=img/lib/azure2/other/Image_Version.svg;\&quot; vertex=\&quot;1\&quot; parent=\&quot;1\&quot;&gt;\n          &lt;mxGeometry x=\&quot;-375\&quot; y=\&quot;100\&quot; width=\&quot;68\&quot; height=\&quot;68\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;KDslBvjNO1J71vhcfkAz-4\&quot; value=\&quot;&amp;lt;b&amp;gt;ImageDefinition-WebServers&amp;lt;/b&amp;gt;\&quot; style=\&quot;image;aspect=fixed;html=1;points=[];align=center;fontSize=12;image=img/lib/azure2/other/Image_Definition.svg;\&quot; vertex=\&quot;1\&quot; parent=\&quot;1\&quot;&gt;\n          &lt;mxGeometry x=\&quot;75\&quot; y=\&quot;-30\&quot; width=\&quot;68\&quot; height=\&quot;64\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;KDslBvjNO1J71vhcfkAz-5\&quot; value=\&quot;&amp;lt;b&amp;gt;Version 1.1.0&amp;lt;/b&amp;gt;&amp;lt;div&amp;gt;&amp;lt;b&amp;gt;Windows 11 24H2&amp;lt;/b&amp;gt;&amp;lt;/div&amp;gt;\&quot; style=\&quot;image;aspect=fixed;html=1;points=[];align=center;fontSize=12;image=img/lib/azure2/other/Image_Version.svg;\&quot; vertex=\&quot;1\&quot; parent=\&quot;1\&quot;&gt;\n          &lt;mxGeometry x=\&quot;-217\&quot; y=\&quot;100\&quot; width=\&quot;68\&quot; height=\&quot;68\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;KDslBvjNO1J71vhcfkAz-6\&quot; value=\&quot;&amp;lt;b&amp;gt;Version 1.0.0&amp;lt;/b&amp;gt;&amp;lt;div&amp;gt;&amp;lt;b&amp;gt;WebServers March 2025&amp;lt;/b&amp;gt;&amp;lt;/div&amp;gt;\&quot; style=\&quot;image;aspect=fixed;html=1;points=[];align=center;fontSize=12;image=img/lib/azure2/other/Image_Version.svg;\&quot; vertex=\&quot;1\&quot; parent=\&quot;1\&quot;&gt;\n          &lt;mxGeometry x=\&quot;-5\&quot; y=\&quot;100\&quot; width=\&quot;68\&quot; height=\&quot;68\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;KDslBvjNO1J71vhcfkAz-7\&quot; value=\&quot;&amp;lt;b&amp;gt;Version 1.0.1&amp;lt;/b&amp;gt;&amp;lt;div&amp;gt;&amp;lt;b&amp;gt;WebServers April 2025&amp;lt;/b&amp;gt;&amp;lt;/div&amp;gt;\&quot; style=\&quot;image;aspect=fixed;html=1;points=[];align=center;fontSize=12;image=img/lib/azure2/other/Image_Version.svg;\&quot; vertex=\&quot;1\&quot; parent=\&quot;1\&quot;&gt;\n          &lt;mxGeometry x=\&quot;143\&quot; y=\&quot;100\&quot; width=\&quot;68\&quot; height=\&quot;68\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;KDslBvjNO1J71vhcfkAz-8\&quot; value=\&quot;Gallery-level\&quot; style=\&quot;text;html=1;align=center;verticalAlign=middle;resizable=0;points=[];autosize=1;strokeColor=none;fillColor=none;fontStyle=1\&quot; vertex=\&quot;1\&quot; parent=\&quot;1\&quot;&gt;\n          &lt;mxGeometry x=\&quot;175\&quot; y=\&quot;-121\&quot; width=\&quot;90\&quot; height=\&quot;30\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;KDslBvjNO1J71vhcfkAz-9\&quot; value=\&quot;Definition-level\&quot; style=\&quot;text;html=1;align=center;verticalAlign=middle;resizable=0;points=[];autosize=1;strokeColor=none;fillColor=none;fontStyle=1\&quot; vertex=\&quot;1\&quot; parent=\&quot;1\&quot;&gt;\n          &lt;mxGeometry x=\&quot;250\&quot; y=\&quot;-3\&quot; width=\&quot;100\&quot; height=\&quot;30\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;KDslBvjNO1J71vhcfkAz-10\&quot; value=\&quot;Image-level\&quot; style=\&quot;text;html=1;align=center;verticalAlign=middle;resizable=0;points=[];autosize=1;strokeColor=none;fillColor=none;fontStyle=1\&quot; vertex=\&quot;1\&quot; parent=\&quot;1\&quot;&gt;\n          &lt;mxGeometry x=\&quot;310\&quot; y=\&quot;119\&quot; width=\&quot;90\&quot; height=\&quot;30\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;KDslBvjNO1J71vhcfkAz-11\&quot; value=\&quot;\&quot; style=\&quot;endArrow=none;dashed=1;html=1;dashPattern=1 3;strokeWidth=2;rounded=0;flowAnimation=1;exitX=0.047;exitY=1.024;exitDx=0;exitDy=0;exitPerimeter=0;\&quot; edge=\&quot;1\&quot; parent=\&quot;1\&quot; source=\&quot;KDslBvjNO1J71vhcfkAz-1\&quot; target=\&quot;KDslBvjNO1J71vhcfkAz-2\&quot;&gt;\n          &lt;mxGeometry width=\&quot;50\&quot; height=\&quot;50\&quot; relative=\&quot;1\&quot; as=\&quot;geometry\&quot;&gt;\n            &lt;mxPoint x=\&quot;-115\&quot; y=\&quot;-80\&quot; as=\&quot;sourcePoint\&quot; /&gt;\n            &lt;mxPoint x=\&quot;-145\&quot; y=\&quot;-44\&quot; as=\&quot;targetPoint\&quot; /&gt;\n          &lt;/mxGeometry&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;KDslBvjNO1J71vhcfkAz-12\&quot; value=\&quot;\&quot; style=\&quot;endArrow=none;dashed=1;html=1;dashPattern=1 3;strokeWidth=2;rounded=0;flowAnimation=1;exitX=1.024;exitY=1.012;exitDx=0;exitDy=0;exitPerimeter=0;\&quot; edge=\&quot;1\&quot; parent=\&quot;1\&quot; source=\&quot;KDslBvjNO1J71vhcfkAz-1\&quot;&gt;\n          &lt;mxGeometry width=\&quot;50\&quot; height=\&quot;50\&quot; relative=\&quot;1\&quot; as=\&quot;geometry\&quot;&gt;\n            &lt;mxPoint x=\&quot;177\&quot; y=\&quot;-82\&quot; as=\&quot;sourcePoint\&quot; /&gt;\n            &lt;mxPoint x=\&quot;75\&quot; y=\&quot;-20\&quot; as=\&quot;targetPoint\&quot; /&gt;\n          &lt;/mxGeometry&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;KDslBvjNO1J71vhcfkAz-13\&quot; value=\&quot;\&quot; style=\&quot;endArrow=none;dashed=1;html=1;dashPattern=1 3;strokeWidth=2;rounded=0;flowAnimation=1;exitX=0.324;exitY=0.969;exitDx=0;exitDy=0;exitPerimeter=0;\&quot; edge=\&quot;1\&quot; parent=\&quot;1\&quot; source=\&quot;KDslBvjNO1J71vhcfkAz-2\&quot;&gt;\n          &lt;mxGeometry width=\&quot;50\&quot; height=\&quot;50\&quot; relative=\&quot;1\&quot; as=\&quot;geometry\&quot;&gt;\n            &lt;mxPoint x=\&quot;-234\&quot; y=\&quot;46\&quot; as=\&quot;sourcePoint\&quot; /&gt;\n            &lt;mxPoint x=\&quot;-335\&quot; y=\&quot;100\&quot; as=\&quot;targetPoint\&quot; /&gt;\n          &lt;/mxGeometry&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;KDslBvjNO1J71vhcfkAz-14\&quot; value=\&quot;\&quot; style=\&quot;endArrow=none;dashed=1;html=1;dashPattern=1 3;strokeWidth=2;rounded=0;flowAnimation=1;entryX=0.194;entryY=-0.024;entryDx=0;entryDy=0;entryPerimeter=0;\&quot; edge=\&quot;1\&quot; parent=\&quot;1\&quot; target=\&quot;KDslBvjNO1J71vhcfkAz-5\&quot;&gt;\n          &lt;mxGeometry width=\&quot;50\&quot; height=\&quot;50\&quot; relative=\&quot;1\&quot; as=\&quot;geometry\&quot;&gt;\n            &lt;mxPoint x=\&quot;-265\&quot; y=\&quot;30\&quot; as=\&quot;sourcePoint\&quot; /&gt;\n            &lt;mxPoint x=\&quot;-115\&quot; y=\&quot;78\&quot; as=\&quot;targetPoint\&quot; /&gt;\n          &lt;/mxGeometry&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;KDslBvjNO1J71vhcfkAz-15\&quot; value=\&quot;\&quot; style=\&quot;endArrow=none;dashed=1;html=1;dashPattern=1 3;strokeWidth=2;rounded=0;flowAnimation=1;entryX=0.241;entryY=0;entryDx=0;entryDy=0;entryPerimeter=0;exitX=0.338;exitY=0.975;exitDx=0;exitDy=0;exitPerimeter=0;\&quot; edge=\&quot;1\&quot; parent=\&quot;1\&quot; source=\&quot;KDslBvjNO1J71vhcfkAz-4\&quot; target=\&quot;KDslBvjNO1J71vhcfkAz-7\&quot;&gt;\n          &lt;mxGeometry width=\&quot;50\&quot; height=\&quot;50\&quot; relative=\&quot;1\&quot; as=\&quot;geometry\&quot;&gt;\n            &lt;mxPoint x=\&quot;95\&quot; y=\&quot;40\&quot; as=\&quot;sourcePoint\&quot; /&gt;\n            &lt;mxPoint x=\&quot;176\&quot; y=\&quot;100\&quot; as=\&quot;targetPoint\&quot; /&gt;\n          &lt;/mxGeometry&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;KDslBvjNO1J71vhcfkAz-16\&quot; value=\&quot;\&quot; style=\&quot;endArrow=none;dashed=1;html=1;dashPattern=1 3;strokeWidth=2;rounded=0;flowAnimation=1;exitX=0.324;exitY=0.969;exitDx=0;exitDy=0;exitPerimeter=0;\&quot; edge=\&quot;1\&quot; parent=\&quot;1\&quot;&gt;\n          &lt;mxGeometry width=\&quot;50\&quot; height=\&quot;50\&quot; relative=\&quot;1\&quot; as=\&quot;geometry\&quot;&gt;\n            &lt;mxPoint x=\&quot;97\&quot; y=\&quot;34\&quot; as=\&quot;sourcePoint\&quot; /&gt;\n            &lt;mxPoint x=\&quot;25\&quot; y=\&quot;102\&quot; as=\&quot;targetPoint\&quot; /&gt;\n          &lt;/mxGeometry&gt;\n        &lt;/mxCell&gt;\n      &lt;/root&gt;\n    &lt;/mxGraphModel&gt;\n  &lt;/diagram&gt;\n&lt;/mxfile&gt;\n&quot;}"></div>
</div>
<script type="text/javascript" src="https://viewer.diagrams.net/js/viewer-static.min.js"></script>

This is an example of a use-case of Azure Compute Gallery, where we store images for Azure Virtual Desktop VMs and for our Webservers, which we re-image every month in this case.

---

## Azure Compute Gallery vs Managed Images

Azure Compute Gallery has some advantages over the "older" and more basic Managed Images which you may use. Let's dive into the key differences:

|  |  |  |
| --- | --- | --- |
| **Feature** | **Azure Compute Gallery** | **Managed Images** |
| Creating and storing generalized and specialized images | ✅ | ✅ |
| Region availability | ✅ | ❌ |
| Versioning | ✅ | ❌ |
| Trusted Launch VMs (TPM/Secure Boot) | ✅ | ❌ |
|  |  |  |

## Pricing of Azure Compute Gallery

The costs of Azure Compute Gallery is based on:

- How much images you store
- How many regions you store a copy for availability
- The storage tier you run the images on

In my exploratory example, I had a compute gallery active for around 24 hours on Premium SSD storage with one replica, and the costs of this were 2 cents:

[![jv-media-3436-d0ffde159f03.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-compute-gallery-and-avd-vm-images-3436/jv-media-3436-d0ffde159f03.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-compute-gallery-and-avd-vm-images-3436/jv-media-3436-d0ffde159f03.png)

This was a VM image with almost nothing installed, but let it increase to 15 cents per 24 hours (5 euro per month) and it still is 100% worth the money.

---

## Step 1: Create a Azure Compute Gallery

Let's dive into the Azure Portal, and navigate to "Azure Compute Gallery" to create a new gallery:

[![jv-media-3436-ec4ec96b7d35.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-compute-gallery-and-avd-vm-images-3436/jv-media-3436-ec4ec96b7d35.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-compute-gallery-and-avd-vm-images-3436/jv-media-3436-ec4ec96b7d35.png)

Give the gallery a name, place it in a resource group and give it a clear description. Then go to "Sharing method".

[![jv-media-3436-f97578348def.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-compute-gallery-and-avd-vm-images-3436/jv-media-3436-f97578348def.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-compute-gallery-and-avd-vm-images-3436/jv-media-3436-f97578348def.png)

Here we have 3 options, where we will cover only 2:

- **Role based access contol (RBAC):** The gallery and images are only available to the people you give access to in the same tenant
- **RBAC + share to public community gallery:** The gallery and images can be published to the community gallery to be used by everyone using Azure, found here:

[![jv-media-3436-bb2023c885c7.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-compute-gallery-and-avd-vm-images-3436/jv-media-3436-bb2023c885c7.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-compute-gallery-and-avd-vm-images-3436/jv-media-3436-bb2023c885c7.png)

After you made your choice, proceed to the last page of the wizard and create the gallery.

---

## Step 2: Create a VM image definition

{{% alert color="info" %}}
VM image definitions can be created manually like this step, but also through a image you capture. Most of the information will be filled in automatically when choosing the second option.

I will showcase both of the options.
{{% /alert %}}

After creating the gallery itself, the place to store the images, we can now manually create a VM image definition. The category of images that we can store.

Click on "+ Add" and then "VM image definition":

[![jv-media-3436-990d0644519d.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-compute-gallery-and-avd-vm-images-3436/jv-media-3436-990d0644519d.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-compute-gallery-and-avd-vm-images-3436/jv-media-3436-990d0644519d.png)

Here we need to define which type of VMs we will be storing into our gallery:

[![jv-media-3436-d345154e6afb.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-compute-gallery-and-avd-vm-images-3436/jv-media-3436-d345154e6afb.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-compute-gallery-and-avd-vm-images-3436/jv-media-3436-d345154e6afb.png)

Here I named it "ImageDefinition-AzureVirtualDesktop", the left side of the topology I showed earlier.

[![jv-media-3436-492bb1211013.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-compute-gallery-and-avd-vm-images-3436/jv-media-3436-492bb1211013.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-compute-gallery-and-avd-vm-images-3436/jv-media-3436-492bb1211013.png)

The last part can be named as you wish. This is meant for having more information for the image available for documentation purposes. Then go to the next page.

Here you can define the versioning, region and end date of using the image version. A EOL (End-of-Life) for your image.

[![jv-media-3436-336af49735d2.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-compute-gallery-and-avd-vm-images-3436/jv-media-3436-336af49735d2.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-compute-gallery-and-avd-vm-images-3436/jv-media-3436-336af49735d2.png)

We can also select a managed image here, which makes migrating from Managed Images to Azure Compute Gallery really easy. After filling in the details go to the next page.

On the "Publishing options" page we can define more information for publishing and documentation including guidelines for VM sizes:

[![jv-media-3436-bae1f00d370c.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-compute-gallery-and-avd-vm-images-3436/jv-media-3436-bae1f00d370c.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-compute-gallery-and-avd-vm-images-3436/jv-media-3436-bae1f00d370c.png)

[![jv-media-3436-514b551da92a.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-compute-gallery-and-avd-vm-images-3436/jv-media-3436-514b551da92a.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-compute-gallery-and-avd-vm-images-3436/jv-media-3436-514b551da92a.png)

After defining everything, we can advance to the last page of the wizard and create the definition.

[![jv-media-3436-e784eb588a24.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-compute-gallery-and-avd-vm-images-3436/jv-media-3436-e784eb588a24.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-compute-gallery-and-avd-vm-images-3436/jv-media-3436-e784eb588a24.png)

{{< ads >}}

---

## Step 3: Capture a VM and store it in the gallery

For demonstrating how to capture a virtual machine into the gallery/definition, I already created a ready virtual machine with Windows Server 2025. Let's perform some pre-capturing tasks in the VM:

- Disabling IE Enhanced Security Configuration
- Installing latest Windows updates
- Installing Google Chrome

### Sysprep

Sysprep is a application which is shipped with Windows which cleanes a Windows installation from specific ID's, drivers and such and makes the installation ready for mass deployment. You must only use this for temporary machines you want to images, as this is a semi-destructive action for Windows. A generalized VM in Azure cannot be booted, so caution is needed.

After finishing those pre-capturing tasks, clean up the VM by cleaning the installation files etc. Then run the application Sysprep which can be found here: *C:\Windows\System32\Sysprep*

[![jv-media-3436-2eb8ad66597c.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-compute-gallery-and-avd-vm-images-3436/jv-media-3436-2eb8ad66597c.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-compute-gallery-and-avd-vm-images-3436/jv-media-3436-2eb8ad66597c.png)

Open the application and select "Generalize" and the as Shutdown option: "Shutdown".

[![jv-media-3436-88ac9780f955.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-compute-gallery-and-avd-vm-images-3436/jv-media-3436-88ac9780f955.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-compute-gallery-and-avd-vm-images-3436/jv-media-3436-88ac9780f955.png)

Click "OK" and wait till the virtual machine performs the shutdown action.

[![jv-media-3436-95db64f6f21e.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-compute-gallery-and-avd-vm-images-3436/jv-media-3436-95db64f6f21e.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-compute-gallery-and-avd-vm-images-3436/jv-media-3436-95db64f6f21e.png)
{{% alert color="info" %}}
If you get an error during this stage that states Bitlocker is activated, you need to disable it temporarily. At deployment of the image, this will be re-activated.

```powershell
Disable-BitLocker -MountPoint "C:"
```
{{% /alert %}}

### Capturing the image in Azure

After the virtual machine is sysprepped/generalized succesfully, we can go to the virtual machine in the Azure Portal to capture it and store it in our newly created Compute gallery.

[![jv-media-3436-1d46b40a4623.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-compute-gallery-and-avd-vm-images-3436/jv-media-3436-1d46b40a4623.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-compute-gallery-and-avd-vm-images-3436/jv-media-3436-1d46b40a4623.png)

First clikc on "Stop" to actually deallocate the virtual machine. Then click on "Capture" and select "Image".

[![jv-media-3436-8215b6801434.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-compute-gallery-and-avd-vm-images-3436/jv-media-3436-8215b6801434.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-compute-gallery-and-avd-vm-images-3436/jv-media-3436-8215b6801434.png)

Select the option "Yes, share it to a gallery as a VM image version" if not already selected. Then scroll down and select your compute gallery as storage.

### Creating the VM image definition automatically

Scroll down on the first page to "Target VM image definition". We can create a VM image definition here based on the image we give Azure:

[![jv-media-3436-1f1ccd2597c1.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-compute-gallery-and-avd-vm-images-3436/jv-media-3436-1f1ccd2597c1.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-compute-gallery-and-avd-vm-images-3436/jv-media-3436-1f1ccd2597c1.png)

We don't have to fill in that much. A name for the image is enough.

After that, click on "Add" and fill in the version numer and End of life date:

[![jv-media-3436-a7082405da09.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-compute-gallery-and-avd-vm-images-3436/jv-media-3436-a7082405da09.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-compute-gallery-and-avd-vm-images-3436/jv-media-3436-a7082405da09.png)

Then scroll down to the redundancy options. You can define here what type of replication you want and what type of storage:

[![jv-media-3436-3a5f2ecc393d.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-compute-gallery-and-avd-vm-images-3436/jv-media-3436-3a5f2ecc393d.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-compute-gallery-and-avd-vm-images-3436/jv-media-3436-3a5f2ecc393d.png)

I changed the options to make it more available:

[![jv-media-3436-8258d0ddd5c9.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-compute-gallery-and-avd-vm-images-3436/jv-media-3436-8258d0ddd5c9.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-compute-gallery-and-avd-vm-images-3436/jv-media-3436-8258d0ddd5c9.png)

Only the latest versions will be available in the regions you choose here. Older versions are only available in the primary region (The region you can't change).

After that finish the wizard, and the virtual machine will now be imaged and stored in Azure Compute Gallery.

---

## Summary

Azure Compute Gallery is a great way to stora and maintain images in a fairly easy way. At first it can be overwhelming but after this post, I am sure you know the basics of it, how to use it and how it works.

If you already know the process with Managed Images, the only thing changed is the location of where you store the images. I think Azure Compute Gallery is the better option because of centralizing storage of images instead of random in your resource group and having support for trusted launch.

### Sources

These sources helped me by writing and research for this post;

1. <https://learn.microsoft.com/en-us/azure/virtual-machines/azure-compute-gallery>

Thank you for reading and I hope it was helpful.

{{< ads >}}

{{< article-footer >}}
