---
title: "Setup a Public Image storage with Azure Blob"
slug: "setup-a-public-image-storage-with-azure-blob"
date: 2026-09-14
tags:
- Concepts
categories:
- Microsoft Azure
description: "If you need a simple place to host images for a website or app, Azure Blob Storage can work really well. You can make the images readable by anyone on your Azure cloud. The website you are now visiting is also using Azure Blob Storage for the storage of images."
---

## The setup described

The setup I will build today consists of these resources and items:

- **Storage account** : This is what we can call the "file server" in Azure
- **Container** : This is the folder inside of the storage account which can be private or publicly available
- **Blobs** : The actual files inside the container (your images)

<!-- draw.io diagram -->
<div class="drawio-white-background" style="background:#ffffff; padding:24px; border-radius:12px; overflow-x:auto;">
<div class="mxgraph" style="max-width:100%;border:1px solid transparent;" data-mxgraph="{&quot;highlight&quot;:&quot;#0000ff&quot;,&quot;lightbox&quot;:false,&quot;nav&quot;:true,&quot;resize&quot;:true,&quot;dark-mode&quot;:&quot;auto&quot;,&quot;toolbar&quot;:&quot;zoom layers tags&quot;,&quot;edit&quot;:&quot;_blank&quot;,&quot;xml&quot;:&quot;&lt;mxfile host=\&quot;app.diagrams.net\&quot; agent=\&quot;Mozilla/5.0\&quot;&gt;\n  &lt;diagram id=\&quot;public-image-repo\&quot; name=\&quot;Public image repository\&quot;&gt;\n    &lt;mxGraphModel dx=\&quot;1199\&quot; dy=\&quot;1105\&quot; grid=\&quot;1\&quot; gridSize=\&quot;10\&quot; guides=\&quot;1\&quot; tooltips=\&quot;1\&quot; connect=\&quot;1\&quot; arrows=\&quot;1\&quot; fold=\&quot;1\&quot; page=\&quot;1\&quot; pageScale=\&quot;1\&quot; pageWidth=\&quot;900\&quot; pageHeight=\&quot;450\&quot; math=\&quot;0\&quot; shadow=\&quot;0\&quot;&gt;\n      &lt;root&gt;\n        &lt;mxCell id=\&quot;0\&quot; /&gt;\n        &lt;mxCell id=\&quot;1\&quot; parent=\&quot;0\&quot; /&gt;\n        &lt;mxCell id=\&quot;XPXoY8YGnE_26344eSnw-1\&quot; parent=\&quot;1\&quot; style=\&quot;image;aspect=fixed;html=1;points=[];align=center;fontSize=12;image=img/lib/azure2/storage/Storage_Accounts.svg;\&quot; value=\&quot;Storage Account\&quot; vertex=\&quot;1\&quot;&gt;\n          &lt;mxGeometry height=\&quot;52\&quot; width=\&quot;65\&quot; x=\&quot;40\&quot; y=\&quot;44\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;XPXoY8YGnE_26344eSnw-3\&quot; parent=\&quot;1\&quot; style=\&quot;image;aspect=fixed;html=1;points=[];align=center;fontSize=12;image=img/lib/azure2/general/Blob_Page.svg;\&quot; value=\&quot;image.jpg\&quot; vertex=\&quot;1\&quot;&gt;\n          &lt;mxGeometry height=\&quot;52\&quot; width=\&quot;65\&quot; x=\&quot;480\&quot; y=\&quot;44\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;XPXoY8YGnE_26344eSnw-4\&quot; parent=\&quot;1\&quot; style=\&quot;sketch=0;aspect=fixed;pointerEvents=1;shadow=0;dashed=0;html=1;strokeColor=#6c8ebf;labelPosition=center;verticalLabelPosition=bottom;verticalAlign=top;align=center;shape=mxgraph.mscae.enterprise.website_generic;fillColor=light-dark(#a6c1e8, #1d293b);\&quot; value=\&quot;Website\&quot; vertex=\&quot;1\&quot;&gt;\n          &lt;mxGeometry height=\&quot;64\&quot; width=\&quot;72.73\&quot; x=\&quot;700\&quot; y=\&quot;44\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;XPXoY8YGnE_26344eSnw-5\&quot; edge=\&quot;1\&quot; parent=\&quot;1\&quot; style=\&quot;endArrow=none;dashed=1;html=1;dashPattern=1 3;strokeWidth=2;rounded=0;flowAnimation=1;strokeColor=default;\&quot; value=\&quot;\&quot;&gt;\n          &lt;mxGeometry height=\&quot;50\&quot; relative=\&quot;1\&quot; width=\&quot;50\&quot; as=\&quot;geometry\&quot;&gt;\n            &lt;mxPoint x=\&quot;105\&quot; y=\&quot;69\&quot; as=\&quot;sourcePoint\&quot; /&gt;\n            &lt;mxPoint x=\&quot;259\&quot; y=\&quot;69\&quot; as=\&quot;targetPoint\&quot; /&gt;\n          &lt;/mxGeometry&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;XPXoY8YGnE_26344eSnw-6\&quot; edge=\&quot;1\&quot; parent=\&quot;1\&quot; style=\&quot;endArrow=none;dashed=1;html=1;dashPattern=1 3;strokeWidth=2;rounded=0;flowAnimation=1;strokeColor=default;\&quot; value=\&quot;\&quot;&gt;\n          &lt;mxGeometry height=\&quot;50\&quot; relative=\&quot;1\&quot; width=\&quot;50\&quot; as=\&quot;geometry\&quot;&gt;\n            &lt;mxPoint x=\&quot;325\&quot; y=\&quot;69\&quot; as=\&quot;sourcePoint\&quot; /&gt;\n            &lt;mxPoint x=\&quot;479\&quot; y=\&quot;69\&quot; as=\&quot;targetPoint\&quot; /&gt;\n          &lt;/mxGeometry&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;XPXoY8YGnE_26344eSnw-7\&quot; parent=\&quot;1\&quot; style=\&quot;text;html=1;whiteSpace=wrap;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;rounded=0;\&quot; value=\&quot;&amp;lt;i&amp;gt;Public URL&amp;lt;/i&amp;gt;\&quot; vertex=\&quot;1\&quot;&gt;\n          &lt;mxGeometry height=\&quot;30\&quot; width=\&quot;150\&quot; x=\&quot;550\&quot; y=\&quot;40\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;XPXoY8YGnE_26344eSnw-8\&quot; parent=\&quot;1\&quot; style=\&quot;image;aspect=fixed;html=1;points=[];align=center;fontSize=12;image=img/lib/azure2/general/Blob_Block.svg;\&quot; value=\&quot;Container&amp;lt;br&amp;gt;(blog)\&quot; vertex=\&quot;1\&quot;&gt;\n          &lt;mxGeometry height=\&quot;52\&quot; width=\&quot;65\&quot; x=\&quot;260\&quot; y=\&quot;44\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;XPXoY8YGnE_26344eSnw-9\&quot; edge=\&quot;1\&quot; parent=\&quot;1\&quot; style=\&quot;endArrow=none;dashed=1;html=1;dashPattern=1 3;strokeWidth=2;rounded=0;flowAnimation=1;strokeColor=default;\&quot; value=\&quot;\&quot;&gt;\n          &lt;mxGeometry height=\&quot;50\&quot; relative=\&quot;1\&quot; width=\&quot;50\&quot; as=\&quot;geometry\&quot;&gt;\n            &lt;mxPoint x=\&quot;550\&quot; y=\&quot;69\&quot; as=\&quot;sourcePoint\&quot; /&gt;\n            &lt;mxPoint x=\&quot;704\&quot; y=\&quot;69\&quot; as=\&quot;targetPoint\&quot; /&gt;\n          &lt;/mxGeometry&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;XPXoY8YGnE_26344eSnw-11\&quot; parent=\&quot;1\&quot; style=\&quot;text;html=1;whiteSpace=wrap;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;rounded=0;\&quot; value=\&quot;&amp;lt;i&amp;gt;Read-only access&amp;lt;/i&amp;gt;\&quot; vertex=\&quot;1\&quot;&gt;\n          &lt;mxGeometry height=\&quot;30\&quot; width=\&quot;170\&quot; x=\&quot;540\&quot; y=\&quot;66\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;XPXoY8YGnE_26344eSnw-12\&quot; parent=\&quot;1\&quot; style=\&quot;image;aspect=fixed;html=1;points=[];align=center;fontSize=12;image=img/lib/azure2/identity/Users.svg;\&quot; value=\&quot;Administrative user\&quot; vertex=\&quot;1\&quot;&gt;\n          &lt;mxGeometry height=\&quot;70\&quot; width=\&quot;64\&quot; x=\&quot;40\&quot; y=\&quot;220\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;XPXoY8YGnE_26344eSnw-13\&quot; edge=\&quot;1\&quot; parent=\&quot;1\&quot; style=\&quot;endArrow=none;dashed=1;html=1;dashPattern=1 3;strokeWidth=2;rounded=0;flowAnimation=1;strokeColor=default;\&quot; value=\&quot;\&quot;&gt;\n          &lt;mxGeometry height=\&quot;50\&quot; relative=\&quot;1\&quot; width=\&quot;50\&quot; as=\&quot;geometry\&quot;&gt;\n            &lt;mxPoint x=\&quot;71.5\&quot; y=\&quot;225\&quot; as=\&quot;sourcePoint\&quot; /&gt;\n            &lt;mxPoint x=\&quot;71.5\&quot; y=\&quot;115\&quot; as=\&quot;targetPoint\&quot; /&gt;\n          &lt;/mxGeometry&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;XPXoY8YGnE_26344eSnw-14\&quot; parent=\&quot;1\&quot; style=\&quot;text;html=1;whiteSpace=wrap;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;rounded=0;\&quot; value=\&quot;Entra ID Authentication\&quot; vertex=\&quot;1\&quot;&gt;\n          &lt;mxGeometry height=\&quot;30\&quot; width=\&quot;170\&quot; x=\&quot;80\&quot; y=\&quot;190\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n      &lt;/root&gt;\n    &lt;/mxGraphModel&gt;\n  &lt;/diagram&gt;\n&lt;/mxfile&gt;\n&quot;}"></div>
<script type="text/javascript" src="https://viewer.diagrams.net/js/viewer-static.min.js"></script>
</div>

After configuration the files can be reached through a URL. For example this is what the URL can look like:

- https://sajvwebsiteblobstorage.blob.core.windows.net/blog/header-photo-200/jv-media-200-5280d899415e.jpg

To separate the URL more clearly:

| Protocol | Storage account name | Azure Blob suffix | Container | Folder | File (Blob) |
| --- | --- | --- | --- | --- | --- |
| https:// | sajvwebsiteblobstorage | blob.core.windows.net | blog | header-photo-200 | jv-media-200-5280d899415e.jpg |

This blob looks like this in the Azure Portal:

[![jv-media-8521-1784996bfa0b.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/public-image-repository-with-azure-blob-storage/jv-media-8521-1784996bfa0b.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/public-image-repository-with-azure-blob-storage/jv-media-8521-1784996bfa0b.png)

You can use a custom domain, but this also requires Azure Front Door. In this guide, I will use the service without a custom domain.

---

## Step 1: Create a container for your images

Open the Azure Portal at https://portal.azure.com and go to "Storage accounts". Create a new storage account at this page:

[![jv-media-8521-c1605da04733.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/public-image-repository-with-azure-blob-storage/jv-media-8521-c1605da04733.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/public-image-repository-with-azure-blob-storage/jv-media-8521-c1605da04733.png)

Fill in the details and use the preferred storage option "Azure Blob Storage". Then go to the next page:

[![jv-media-8521-c90ef72e149a.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/public-image-repository-with-azure-blob-storage/jv-media-8521-c90ef72e149a.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/public-image-repository-with-azure-blob-storage/jv-media-8521-c90ef72e149a.png)

I use the Hot tier, as this is the most cost-effective option. The images will be accessed regularly, so the access costs are very important. Especially on public websites where bots and scrapers are active.

Then finish the Storage Account creation.

---

## Step 2: RBAC roles for Azure Blobs administration

Before we can manage the Storage account and Blobs using our user accounts, we need to assign the required roles to the accounts. By default in this setup, we need to assign different roles as we will use Microsoft Entra authentication only. Already having subscription or resource group Owner permissions is not enough as we also need a role to access the data (DataRole).

Navigate to the created Storage Account and open the "Access Control (IAM)" blade.

[![jv-media-8521-a914cd8a1b3b.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/public-image-repository-with-azure-blob-storage/jv-media-8521-a914cd8a1b3b.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/public-image-repository-with-azure-blob-storage/jv-media-8521-a914cd8a1b3b.png)

Click on "+ Add" and then choose "Add role assignment".

Then search for this role:

- **Storage Blob Data Contributor**

[![jv-media-8521-1a1687dbe358.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/public-image-repository-with-azure-blob-storage/jv-media-8521-1a1687dbe358.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/public-image-repository-with-azure-blob-storage/jv-media-8521-1a1687dbe358.png)

Select the role and click "Next". Now select the required user:

[![jv-media-8521-873bc9c79df3.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/public-image-repository-with-azure-blob-storage/jv-media-8521-873bc9c79df3.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/public-image-repository-with-azure-blob-storage/jv-media-8521-873bc9c79df3.png)

After this step complete the wizard to finish assigning the role.

---

## Step 3: Storage Account Security

Now we will apply some storage account security which I highly recommend to perform. As this blob storage must be publicly available, we will not set anything in the Firewall but we will set these settings:

| Setting | Status | Explanation |
| --- | --- | --- |
| Secure transfer required | Enabled | This requires a high level of security in the transfer to Blobs, basically requiring HTTPS |
| Allow Blob anonymous access | Enabled | Enables public access for anonymous users, for users without authentication |
| Allow storage account key access | Disabled | Disables the storage access key to be used on the storage account, making the Entra ID authentication the primary and only authentication method |
| Default to Microsoft Entra authorization in the Azure portal | Enabled | Makes Microsoft Entra the default method in the portal, prevents errors that your storage account access key doesn't work |

This should look like this:

[![jv-media-8521-46a8affd3603.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/public-image-repository-with-azure-blob-storage/jv-media-8521-46a8affd3603.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/public-image-repository-with-azure-blob-storage/jv-media-8521-46a8affd3603.png)

---

## Step 4: Create a container

Now we can create a container to store the blobs in. This is like creating a folder on your computer in simple terms. Navigate to your storage account, and open "Containers" and click "+ Add container".

Give the container a URL-friendly name, so lowercase, no spaces or special characters and select the "Blob" option for the anonymous access level. This is the most restrictive option, only giving read access on the blobs in the containers, not to the container itself.

[![jv-media-8521-b47b569921f2.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/public-image-repository-with-azure-blob-storage/jv-media-8521-b47b569921f2.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/public-image-repository-with-azure-blob-storage/jv-media-8521-b47b569921f2.png)

Finish the creation of the container. Now you can upload a file and check if you can view this file in your browser. If this works, your setup is completed.

[![jv-media-8521-1df0681ca690.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/public-image-repository-with-azure-blob-storage/jv-media-8521-1df0681ca690.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/public-image-repository-with-azure-blob-storage/jv-media-8521-1df0681ca690.png)

It works, but also check other browsers and devices to be sure of the public access.

Now you can create files and folders in the blob storage. This is so easy, where I think if you made it this far into the guide, this should not need a step-by-step description.

---

## Step 5: Check storage account usage (optional)

You can check the current storage usage in the Azure Portal. Go to the storage account, and open the "Insights" blade from the left. Then open the "Capacity" tab.

[![jv-media-8521-eed247bad10c.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/public-image-repository-with-azure-blob-storage/jv-media-8521-eed247bad10c.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/public-image-repository-with-azure-blob-storage/jv-media-8521-eed247bad10c.png)

This shows the actual usage of the storage account. You can also use [your own workbooks](https://justinverstijnen.nl/create-custom-azure-workbooks-for-detailed-monitoring/) to measure the capacity or the amount of files.

---

## Summary

To build a public image repository with Azure Blob Storage, create a container, change anonymous access from Private to Blob so browsers can read your images, and keep uploads and administration restricted using Access Key, SAS, or Entra ID (RBAC).

Thank you for reading this post and I hope it was helpful!

### Sources

These sources helped me with writing and research for this post:

1. https://learn.microsoft.com/en-us/azure/storage/blobs/blob-containers-portal
2. https://learn.microsoft.com/en-us/azure/storage/blobs/anonymous-read-access-overview
3. https://learn.microsoft.com/en-us/azure/storage/common/storage-account-keys-manage

{{< ads >}}

{{< article-footer >}}
