---
title: "Automatically clean up inactive Entra ID devices using Azure Automation"
slug: "azure-automation-clean-entra-id-devices"
date: 2026-06-27
tags:
- Step by Step guides
- Tools and Scripts
categories:
- Microsoft Azure
description: "Over time, Microsoft Entra ID environments often become filled with old and inactive devices. These can be devices from former employees, reinstalled systems, test devices or machines that simply no longer exist. Cleaning up these devices manually takes time and is easy to forget. By using Azure Automation, we can fully automate this process and remove devices that have been inactive for more than 180 days. Azure Automation is a service in Azure that allows you to automate tasks. Automation tasks usually work with schedules/timers and scripts and normally require infrastructure to run. In traditional environments this often means deploying and maintaining servers or virtual machines. In the cloud era we naturally want to avoid this as much as possible. With Azure Automation you can run different types of scripts whenever you want. These scripts run directly on the Azure platform without the need to deploy, design, maintain or secure your own server. This makes it a very robust solution. Azure Automation can also run in the context of a Managed Identity connected to the Automation Account. This removes the need for separate service accounts."
hidden: false
---

## Requirements

- An Azure subscription
- PowerShell 7 installed
- [Microsoft Graph PowerShell module](https://www.powershellgallery.com/packages/Microsoft.Graph) installed
- Basic knowledge of PowerShell
- Basic knowledge of Microsoft Graph
- Around 30 minutes of your time

---

## Azure Automation vs. Logic Apps

Azure Automation looks similar to Logic Apps. Personally, I think Azure Automation is better for more complex tasks. Logic Apps are very good for quickly creating smaller workflows by using connectors and predefined actions. However, you are more limited in customization. With Azure Automation you can fully design and test your own scripts and use custom PowerShell modules but also Python. This gives you much more flexibility and control.

---

## How does Azure Automation work?

Azure Automation works by creating an Automation Account in Azure. This acts as a container where different runbooks can run.

The runbooks are the actual scripts or tasks which can run manually or based on a schedule.

In this guide we will use:

- An Automation Account
- A PowerShell runbook
- A Managed Identity
- Microsoft Graph permissions
- A schedule to run automatically

<!-- draw.io diagram with fixed white background -->
<div style="background:#ffffff; padding:24px; border-radius:12px; overflow:auto;">
<div class="mxgraph" style="max-width:100%;border:1px solid transparent;background:#ffffff;" data-mxgraph="{&quot;highlight&quot;:&quot;#0000ff&quot;,&quot;nav&quot;:true,&quot;resize&quot;:true,&quot;dark-mode&quot;:&quot;auto&quot;,&quot;toolbar&quot;:&quot;zoom layers tags lightbox&quot;,&quot;xml&quot;:&quot;&lt;mxfile host=\&quot;app.diagrams.net\&quot;&gt;\n  &lt;diagram name=\&quot;Pagina-1\&quot; id=\&quot;d3W8X3ooqd3V1298DNCu\&quot;&gt;\n    &lt;mxGraphModel dx=\&quot;1204\&quot; dy=\&quot;1105\&quot; grid=\&quot;1\&quot; gridSize=\&quot;10\&quot; guides=\&quot;1\&quot; tooltips=\&quot;1\&quot; connect=\&quot;1\&quot; arrows=\&quot;1\&quot; fold=\&quot;1\&quot; page=\&quot;1\&quot; pageScale=\&quot;1\&quot; pageWidth=\&quot;1169\&quot; pageHeight=\&quot;827\&quot; math=\&quot;0\&quot; shadow=\&quot;0\&quot;&gt;\n      &lt;root&gt;\n        &lt;mxCell id=\&quot;0\&quot; /&gt;\n        &lt;mxCell id=\&quot;1\&quot; parent=\&quot;0\&quot; /&gt;\n        &lt;mxCell id=\&quot;cpF91BPfRY1keDCnctWe-1\&quot; parent=\&quot;1\&quot; style=\&quot;image;aspect=fixed;html=1;points=[];align=center;fontSize=12;image=img/lib/azure2/management_governance/Automation_Accounts.svg;\&quot; value=\&quot;1. Automation Account\&quot; vertex=\&quot;1\&quot;&gt;\n          &lt;mxGeometry height=\&quot;68\&quot; width=\&quot;68\&quot; x=\&quot;40\&quot; y=\&quot;148\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;cpF91BPfRY1keDCnctWe-2\&quot; parent=\&quot;1\&quot; style=\&quot;image;aspect=fixed;html=1;points=[];align=center;fontSize=12;image=img/lib/azure2/general/Scheduler.svg;\&quot; value=\&quot;3. Schedule&amp;lt;br&amp;gt;First of the month at 3:00 AM\&quot; vertex=\&quot;1\&quot;&gt;\n          &lt;mxGeometry height=\&quot;39.56\&quot; width=\&quot;39.56\&quot; x=\&quot;325.22\&quot; y=\&quot;8\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;cpF91BPfRY1keDCnctWe-3\&quot; parent=\&quot;1\&quot; style=\&quot;image;aspect=fixed;html=1;points=[];align=center;fontSize=12;image=img/lib/azure2/identity/Entra_Managed_Identities.svg;\&quot; value=\&quot;5. Managed Identity\&quot; vertex=\&quot;1\&quot;&gt;\n          &lt;mxGeometry height=\&quot;60.440000000000005\&quot; width=\&quot;68\&quot; x=\&quot;540\&quot; y=\&quot;151.77999999999997\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;cpF91BPfRY1keDCnctWe-4\&quot; parent=\&quot;1\&quot; style=\&quot;shadow=0;dashed=0;html=1;strokeColor=none;fillColor=#4495D1;labelPosition=center;verticalLabelPosition=bottom;verticalAlign=top;align=center;outlineConnect=0;shape=mxgraph.veeam.script;\&quot; value=\&quot;2. Runbook\&quot; vertex=\&quot;1\&quot;&gt;\n          &lt;mxGeometry height=\&quot;68\&quot; width=\&quot;70\&quot; x=\&quot;310\&quot; y=\&quot;148\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;cpF91BPfRY1keDCnctWe-5\&quot; parent=\&quot;1\&quot; style=\&quot;verticalLabelPosition=bottom;html=1;verticalAlign=top;align=center;strokeColor=none;fillColor=#878CA8;shape=mxgraph.azure.script_file;pointerEvents=1;\&quot; value=\&quot;4. Clean-script.ps1\&quot; vertex=\&quot;1\&quot;&gt;\n          &lt;mxGeometry height=\&quot;50\&quot; width=\&quot;47.5\&quot; x=\&quot;321.25\&quot; y=\&quot;298\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;cpF91BPfRY1keDCnctWe-6\&quot; parent=\&quot;1\&quot; style=\&quot;image;aspect=fixed;html=1;points=[];align=center;fontSize=12;image=img/lib/azure2/other/Entra_Identity.svg;\&quot; value=\&quot;Entra ID\&quot; vertex=\&quot;1\&quot;&gt;\n          &lt;mxGeometry height=\&quot;90.44\&quot; width=\&quot;101.75\&quot; x=\&quot;810\&quot; y=\&quot;124\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;cpF91BPfRY1keDCnctWe-7\&quot; parent=\&quot;1\&quot; style=\&quot;image;sketch=0;aspect=fixed;html=1;points=[];align=center;fontSize=12;image=img/lib/mscae/Devices_Groups.svg;\&quot; value=\&quot;\&quot; vertex=\&quot;1\&quot;&gt;\n          &lt;mxGeometry height=\&quot;50\&quot; width=\&quot;50\&quot; x=\&quot;835.88\&quot; y=\&quot;245.22000000000003\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;cpF91BPfRY1keDCnctWe-8\&quot; parent=\&quot;1\&quot; style=\&quot;image;sketch=0;aspect=fixed;html=1;points=[];align=center;fontSize=12;image=img/lib/mscae/Devices_Groups.svg;\&quot; value=\&quot;\&quot; vertex=\&quot;1\&quot;&gt;\n          &lt;mxGeometry height=\&quot;50\&quot; width=\&quot;50\&quot; x=\&quot;836\&quot; y=\&quot;303.22\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;cpF91BPfRY1keDCnctWe-9\&quot; parent=\&quot;1\&quot; style=\&quot;image;sketch=0;aspect=fixed;html=1;points=[];align=center;fontSize=12;image=img/lib/mscae/Devices_Groups.svg;\&quot; value=\&quot;\&quot; vertex=\&quot;1\&quot;&gt;\n          &lt;mxGeometry height=\&quot;50\&quot; width=\&quot;50\&quot; x=\&quot;836\&quot; y=\&quot;363.22\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;cpF91BPfRY1keDCnctWe-13\&quot; parent=\&quot;1\&quot; style=\&quot;shape=image;html=1;verticalAlign=top;verticalLabelPosition=bottom;labelBackgroundColor=#ffffff;imageAspect=0;aspect=fixed;image=https://icons.diagrams.net/icon-cache1/Essentials-2479/039_-_Cross-1213.svg\&quot; value=\&quot;\&quot; vertex=\&quot;1\&quot;&gt;\n          &lt;mxGeometry height=\&quot;24\&quot; width=\&quot;24\&quot; x=\&quot;870\&quot; y=\&quot;271.22\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;cpF91BPfRY1keDCnctWe-14\&quot; parent=\&quot;1\&quot; style=\&quot;shape=image;html=1;verticalAlign=top;verticalLabelPosition=bottom;labelBackgroundColor=#ffffff;imageAspect=0;aspect=fixed;image=https://icons.diagrams.net/icon-cache1/Essentials-2479/039_-_Cross-1213.svg\&quot; value=\&quot;\&quot; vertex=\&quot;1\&quot;&gt;\n          &lt;mxGeometry height=\&quot;24\&quot; width=\&quot;24\&quot; x=\&quot;870.12\&quot; y=\&quot;329.22\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;cpF91BPfRY1keDCnctWe-15\&quot; parent=\&quot;1\&quot; style=\&quot;shape=image;html=1;verticalAlign=top;verticalLabelPosition=bottom;labelBackgroundColor=#ffffff;imageAspect=0;aspect=fixed;image=https://icons.diagrams.net/icon-cache1/Essentials-2479/039_-_Cross-1213.svg\&quot; value=\&quot;\&quot; vertex=\&quot;1\&quot;&gt;\n          &lt;mxGeometry height=\&quot;24\&quot; width=\&quot;24\&quot; x=\&quot;870.12\&quot; y=\&quot;389.22\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;cpF91BPfRY1keDCnctWe-16\&quot; parent=\&quot;1\&quot; style=\&quot;text;html=1;whiteSpace=wrap;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;rounded=0;\&quot; value=\&quot;Last Activity: 189 days ago\&quot; vertex=\&quot;1\&quot;&gt;\n          &lt;mxGeometry height=\&quot;30\&quot; width=\&quot;160\&quot; x=\&quot;899\&quot; y=\&quot;245.22000000000003\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;cpF91BPfRY1keDCnctWe-17\&quot; parent=\&quot;1\&quot; style=\&quot;text;html=1;whiteSpace=wrap;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;rounded=0;\&quot; value=\&quot;Last Activity: 197 days ago\&quot; vertex=\&quot;1\&quot;&gt;\n          &lt;mxGeometry height=\&quot;30\&quot; width=\&quot;160\&quot; x=\&quot;899.12\&quot; y=\&quot;308.22\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;cpF91BPfRY1keDCnctWe-18\&quot; parent=\&quot;1\&quot; style=\&quot;text;html=1;whiteSpace=wrap;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;rounded=0;\&quot; value=\&quot;Last Activity: 211 days ago\&quot; vertex=\&quot;1\&quot;&gt;\n          &lt;mxGeometry height=\&quot;30\&quot; width=\&quot;160\&quot; x=\&quot;899.12\&quot; y=\&quot;369.22\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;cpF91BPfRY1keDCnctWe-19\&quot; parent=\&quot;1\&quot; style=\&quot;text;html=1;whiteSpace=wrap;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;rounded=0;\&quot; value=\&quot;DELETE\&quot; vertex=\&quot;1\&quot;&gt;\n          &lt;mxGeometry height=\&quot;30\&quot; width=\&quot;60\&quot; x=\&quot;760\&quot; y=\&quot;249.22000000000003\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;cpF91BPfRY1keDCnctWe-20\&quot; parent=\&quot;1\&quot; style=\&quot;text;html=1;whiteSpace=wrap;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;rounded=0;\&quot; value=\&quot;DELETE\&quot; vertex=\&quot;1\&quot;&gt;\n          &lt;mxGeometry height=\&quot;30\&quot; width=\&quot;60\&quot; x=\&quot;760\&quot; y=\&quot;308.22\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;cpF91BPfRY1keDCnctWe-21\&quot; parent=\&quot;1\&quot; style=\&quot;text;html=1;whiteSpace=wrap;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;rounded=0;\&quot; value=\&quot;DELETE\&quot; vertex=\&quot;1\&quot;&gt;\n          &lt;mxGeometry height=\&quot;30\&quot; width=\&quot;60\&quot; x=\&quot;760\&quot; y=\&quot;369.22\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;cpF91BPfRY1keDCnctWe-22\&quot; edge=\&quot;1\&quot; parent=\&quot;1\&quot; style=\&quot;endArrow=none;dashed=1;html=1;dashPattern=1 3;strokeWidth=2;rounded=0;flowAnimation=1;\&quot; target=\&quot;cpF91BPfRY1keDCnctWe-4\&quot; value=\&quot;\&quot;&gt;\n          &lt;mxGeometry height=\&quot;50\&quot; relative=\&quot;1\&quot; width=\&quot;50\&quot; as=\&quot;geometry\&quot;&gt;\n            &lt;mxPoint x=\&quot;110\&quot; y=\&quot;181.5\&quot; as=\&quot;sourcePoint\&quot; /&gt;\n            &lt;mxPoint x=\&quot;280\&quot; y=\&quot;181.5\&quot; as=\&quot;targetPoint\&quot; /&gt;\n          &lt;/mxGeometry&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;cpF91BPfRY1keDCnctWe-23\&quot; edge=\&quot;1\&quot; parent=\&quot;1\&quot; style=\&quot;endArrow=none;dashed=1;html=1;dashPattern=1 3;strokeWidth=2;rounded=0;flowAnimation=1;\&quot; value=\&quot;\&quot;&gt;\n          &lt;mxGeometry height=\&quot;50\&quot; relative=\&quot;1\&quot; width=\&quot;50\&quot; as=\&quot;geometry\&quot;&gt;\n            &lt;mxPoint x=\&quot;380\&quot; y=\&quot;182\&quot; as=\&quot;sourcePoint\&quot; /&gt;\n            &lt;mxPoint x=\&quot;540\&quot; y=\&quot;182\&quot; as=\&quot;targetPoint\&quot; /&gt;\n          &lt;/mxGeometry&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;cpF91BPfRY1keDCnctWe-24\&quot; edge=\&quot;1\&quot; parent=\&quot;1\&quot; style=\&quot;endArrow=none;dashed=1;html=1;dashPattern=1 3;strokeWidth=2;rounded=0;flowAnimation=1;\&quot; target=\&quot;cpF91BPfRY1keDCnctWe-4\&quot; value=\&quot;\&quot;&gt;\n          &lt;mxGeometry height=\&quot;50\&quot; relative=\&quot;1\&quot; width=\&quot;50\&quot; as=\&quot;geometry\&quot;&gt;\n            &lt;mxPoint x=\&quot;345\&quot; y=\&quot;88\&quot; as=\&quot;sourcePoint\&quot; /&gt;\n            &lt;mxPoint x=\&quot;550\&quot; y=\&quot;108.5\&quot; as=\&quot;targetPoint\&quot; /&gt;\n          &lt;/mxGeometry&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;cpF91BPfRY1keDCnctWe-25\&quot; edge=\&quot;1\&quot; parent=\&quot;1\&quot; style=\&quot;endArrow=none;dashed=1;html=1;dashPattern=1 3;strokeWidth=2;rounded=0;flowAnimation=1;\&quot; value=\&quot;\&quot;&gt;\n          &lt;mxGeometry height=\&quot;50\&quot; relative=\&quot;1\&quot; width=\&quot;50\&quot; as=\&quot;geometry\&quot;&gt;\n            &lt;mxPoint x=\&quot;345\&quot; y=\&quot;238\&quot; as=\&quot;sourcePoint\&quot; /&gt;\n            &lt;mxPoint x=\&quot;344.5\&quot; y=\&quot;292\&quot; as=\&quot;targetPoint\&quot; /&gt;\n          &lt;/mxGeometry&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;cpF91BPfRY1keDCnctWe-26\&quot; edge=\&quot;1\&quot; parent=\&quot;1\&quot; style=\&quot;endArrow=none;dashed=1;html=1;dashPattern=1 3;strokeWidth=2;rounded=0;flowAnimation=1;entryX=0;entryY=0.5;entryDx=0;entryDy=0;\&quot; target=\&quot;cpF91BPfRY1keDCnctWe-19\&quot; value=\&quot;\&quot;&gt;\n          &lt;mxGeometry height=\&quot;50\&quot; relative=\&quot;1\&quot; width=\&quot;50\&quot; as=\&quot;geometry\&quot;&gt;\n            &lt;Array as=\&quot;points\&quot;&gt;\n              &lt;mxPoint x=\&quot;700\&quot; y=\&quot;323\&quot; /&gt;\n            &lt;/Array&gt;\n            &lt;mxPoint x=\&quot;380\&quot; y=\&quot;322.5\&quot; as=\&quot;sourcePoint\&quot; /&gt;\n            &lt;mxPoint x=\&quot;770\&quot; y=\&quot;288\&quot; as=\&quot;targetPoint\&quot; /&gt;\n          &lt;/mxGeometry&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;cpF91BPfRY1keDCnctWe-27\&quot; edge=\&quot;1\&quot; parent=\&quot;1\&quot; style=\&quot;endArrow=none;dashed=1;html=1;dashPattern=1 3;strokeWidth=2;rounded=0;flowAnimation=1;entryX=0;entryY=0.5;entryDx=0;entryDy=0;\&quot; target=\&quot;cpF91BPfRY1keDCnctWe-20\&quot; value=\&quot;\&quot;&gt;\n          &lt;mxGeometry height=\&quot;50\&quot; relative=\&quot;1\&quot; width=\&quot;50\&quot; as=\&quot;geometry\&quot;&gt;\n            &lt;mxPoint x=\&quot;700\&quot; y=\&quot;322.5\&quot; as=\&quot;sourcePoint\&quot; /&gt;\n            &lt;mxPoint x=\&quot;820\&quot; y=\&quot;323\&quot; as=\&quot;targetPoint\&quot; /&gt;\n          &lt;/mxGeometry&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;cpF91BPfRY1keDCnctWe-28\&quot; edge=\&quot;1\&quot; parent=\&quot;1\&quot; style=\&quot;endArrow=none;dashed=1;html=1;dashPattern=1 3;strokeWidth=2;rounded=0;flowAnimation=1;entryX=0;entryY=0.5;entryDx=0;entryDy=0;\&quot; target=\&quot;cpF91BPfRY1keDCnctWe-21\&quot; value=\&quot;\&quot;&gt;\n          &lt;mxGeometry height=\&quot;50\&quot; relative=\&quot;1\&quot; width=\&quot;50\&quot; as=\&quot;geometry\&quot;&gt;\n            &lt;mxPoint x=\&quot;700\&quot; y=\&quot;326.22\&quot; as=\&quot;sourcePoint\&quot; /&gt;\n            &lt;mxPoint x=\&quot;760\&quot; y=\&quot;356.22\&quot; as=\&quot;targetPoint\&quot; /&gt;\n          &lt;/mxGeometry&gt;\n        &lt;/mxCell&gt;\n      &lt;/root&gt;\n    &lt;/mxGraphModel&gt;\n  &lt;/diagram&gt;\n&lt;/mxfile&gt;\n&quot;}"></div>
</div>
<script type="text/javascript" src="https://viewer.diagrams.net/js/viewer-static.min.js"></script>

The script will check all Entra ID devices and delete devices that have been inactive for more than 180 days.

---

## The scripts and description

I already created the preparation files and scripts which can be found here:

https://github.com/JustinVerstijnen/JV-AA-CleanEntraIDDevices/tree/main

Here are two scripts:

- **Setup-script**: This is the script needed for the setup of the automation account, only the first time after creating an Automation Account
- **Clean-script**: This is the script that runs on schedule

1. The script connects to Microsoft Entra ID using the Microsoft Graph PowerShell module
2. It looks for devices that have been inactive for more than 180 days based on their Last activity date shown in Entra ID
3. Devices that do not have a Last activity / Last sign-in date are ignored and will not be disabled or deleted because the setting `$SkipDevicesWithoutLastSignIn = $true` is enabled
4. Hybrid Azure AD joined devices are skipped and will not be processed
5. The script generates a list of stale devices that meet the criteria
6. With the current setting (`$Action = "Report"`), the script only creates a report and does not make any changes to devices
7. If the action is changed to Disable, the matching stale devices will be disabled
8. If the action is changed to Delete, only devices that are already disabled can be deleted, providing an additional safety measure. This is the default option for now

---

## Step 1: Create an Automation Account:

Open the Azure Portal and navigate to: "Automation Accounts". Then create a new Automation Account.

[![Image](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-automation-clean-entra-id-devices/jv-media-8511-82c205a3b934.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-automation-clean-entra-id-devices/jv-media-8511-82c205a3b934.png)

Give the Automation Account a name and place it in your desired resource group.

[![Image](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-automation-clean-entra-id-devices/jv-media-8511-26e422ef0a7c.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-automation-clean-entra-id-devices/jv-media-8511-26e422ef0a7c.png)

Then advance to the "Advanced" page.

[![Image](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-automation-clean-entra-id-devices/jv-media-8511-ee616f0fb4d3.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-automation-clean-entra-id-devices/jv-media-8511-ee616f0fb4d3.png)

Here enable the "System assigned" identity option to enable an identity for the Automation Account.

Leave the rest of the wizard as-is and complete it to create the Automation Account.

[![Image](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-automation-clean-entra-id-devices/jv-media-8511-1e91ce5564cf.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-automation-clean-entra-id-devices/jv-media-8511-1e91ce5564cf.png)

---

## Step 2: Configure the Managed Identity

Now we have to configure the managed identity for this solution to work. This is a sort of service account the script uses to gain least privileges and having access to your Entra ID from the Azure platform.

Go to your Automation Account, then open up "Identity" from the left:

[![Image](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-automation-clean-entra-id-devices/jv-media-8511-133bb8f36704.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-automation-clean-entra-id-devices/jv-media-8511-133bb8f36704.png)

Here we must copy the Object ID of the Managed Identity, as we need this in our script to give the required permissions. As we need to provide permissions to a Service Principal, this must be done through PowerShell. A Managed Identity is not managed through the portal like a normal App Registration.

On the GitHub page, you can find the "Setup-Script.ps1". Download this as we have to run it with PowerShell 7.

[https://github.com/JustinVerstijnen/JV-AA-CleanEntraIDDevices/tree/main](https://github.com/JustinVerstijnen/JV-AA-CleanEntraIDDevices/tree/main)

Change the Managed Identity ID on line 4:

[![Image](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-automation-clean-entra-id-devices/jv-media-8511-25eefd0f6b09.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-automation-clean-entra-id-devices/jv-media-8511-25eefd0f6b09.png)

Now we can run the script in PowerShell 7 by executing it and then logging in to the tenant where you placed the automation account.

[![Image](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-automation-clean-entra-id-devices/jv-media-8511-48ee37b285b3.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-automation-clean-entra-id-devices/jv-media-8511-48ee37b285b3.png)

After logging in successfully, the correct permissions are assigned to the Managed Identity and the Automation Account can now be tested.

- _Device.ReadWrite.All_

---

## Step 3: Install the needed modules

Now we have to install some PowerShell modules on our Automation Account. The script uses some modules which are not shipped by default on the Automation Account PowerShell runtime, but we can install this manually through the Azure Portal.

Navigate to the Automation Account in Azure and open up "Modules" from the left. From there, click on "Browse gallery" to add new PowerShell modules directly from the PowerShell Gallery into your Automation Account.

[![Image](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-automation-clean-entra-id-devices/jv-media-8511-1e4c8b985ce2.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-automation-clean-entra-id-devices/jv-media-8511-1e4c8b985ce2.png)

Here we need to install these two modules:

- **Microsoft.Graph.Authentication**
- **Microsoft.Graph.Identity.DirectoryManagement**

We can find them by searching for their names in the search bar:

[![Image](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-automation-clean-entra-id-devices/jv-media-8510-1ff24a6a113c.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-automation-clean-entra-id-devices/jv-media-8510-1ff24a6a113c.png)

[![Image](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-automation-clean-entra-id-devices/jv-media-8510-c536a60ea6e2.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-automation-clean-entra-id-devices/jv-media-8510-c536a60ea6e2.png)

And then select the PowerShell 7.2 runtime version for both modules:

[![Image](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-automation-clean-entra-id-devices/jv-media-8510-844f6f026241.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-automation-clean-entra-id-devices/jv-media-8510-844f6f026241.png)

Then click "Next" to install the modules into the Automation Account. After a few minutes the modules should be ready to use:

[![Image](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-automation-clean-entra-id-devices/jv-media-8510-8b9abb479dd5.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-automation-clean-entra-id-devices/jv-media-8510-8b9abb479dd5.png)

Now we can proceed to Step 4 where we create the task itself.

---

## Step 4: Create the PowerShell Runbook

In this step we can create the PowerShell runbook itself. This is the task where the script is launched to clean the Entra ID devices. Navigate to your Automation Account  and open up "Runbooks" from the left. From there, click on "+ Create a runbook" to create a new runbook with our desired settings.

[![Image](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-automation-clean-entra-id-devices/jv-media-8511-5ba8e219dbfe.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-automation-clean-entra-id-devices/jv-media-8511-5ba8e219dbfe.png)

Create a new Runbook by giving it a name and description and select these properties:

- **Runbook type:** PowerShell
- **Runtime version** : 7.2

[![Image](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-automation-clean-entra-id-devices/jv-media-8510-5cd475ecf5e1.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-automation-clean-entra-id-devices/jv-media-8510-5cd475ecf5e1.png)

Then finish the create Runbook wizard. We will now be presented a online code editor where we can place the PowerShell script itself. Here paste the contents of the "Clean-scipt.ps1" file from the GitHub Repo:

<a class="btn btn-primary" href="https://github.com/JustinVerstijnen/JV-AA-CleanEntraIDDevices/blob/main/Clean-Script.ps1" target="_blank" rel="noreferrer">Clean script on GitHub</a>

Here we can change two parameters for the script based on your preferences:

- **Line 8**: The amount of days for a device to be inactive
- **Line 14**: The action, if it must only report or directly delete the devices

[![Image](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-automation-clean-entra-id-devices/jv-media-8510-a7b117d798c1.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-automation-clean-entra-id-devices/jv-media-8510-a7b117d798c1.png)

After you have changed the script to your preferences, save the script and then publish it to the Automation Account.

[![Image](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-automation-clean-entra-id-devices/jv-media-8510-3cfb8c825e6e.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-automation-clean-entra-id-devices/jv-media-8510-3cfb8c825e6e.png)

And then publish it by clicking "Publish".

[![Image](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-automation-clean-entra-id-devices/jv-media-8510-de17c41ab234.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-automation-clean-entra-id-devices/jv-media-8510-de17c41ab234.png)

---

## Step 5: Testing the Runbook script

Before we can fully automate the process, we must test the Runbook manually. We must verify if the script works and if we have configured the account, runbook and permissions correctly for the script to run unattended.

Open the Runbook from the Automation Account:

[![Image](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-automation-clean-entra-id-devices/jv-media-8510-720df9a5608d.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-automation-clean-entra-id-devices/jv-media-8510-720df9a5608d.png)

From there, start the Runbook manually by clicking the "Start" button:

[![Image](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-automation-clean-entra-id-devices/jv-media-8510-dd3d26b5428a.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-automation-clean-entra-id-devices/jv-media-8510-dd3d26b5428a.png)

We will now be redirected to a new pane where we can check the state of the script:

- **Input** : This shows possible customizable parameters you gave the script (not applicable for this script)
- **Output** : This shows the output PowerShell gave just like how you get the information when performing the tasks manually
- **Errors and Warnings** : This shows possible errors and warnings during performing the script
- **All logs** : Here you can view a verbose-like view of the automation account

As you can see, the script has ran successfully:

[![Image](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-automation-clean-entra-id-devices/jv-media-8510-34298e1b78d4.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-automation-clean-entra-id-devices/jv-media-8510-34298e1b78d4.png)

On the "Output" tab, all devices that has been deleted with this task will be shown:

[![Image](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-automation-clean-entra-id-devices/jv-media-8510-a3268e231a92.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-automation-clean-entra-id-devices/jv-media-8510-a3268e231a92.png)

In this case, no stale/inactive devices are available which is being shown by PowerShell. Let's try with 120 days:

[![Image](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-automation-clean-entra-id-devices/jv-media-8510-441f70a3661e.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-automation-clean-entra-id-devices/jv-media-8510-441f70a3661e.png)

The script now deleted 4 stale devices.

---

## Step 6: Create a schedule and link it to the Runbook

Once our test is completed successfully, we can schedule our script to perform this task on a schedule. As this task checks for devices inactive for 180 days, we can run this script once per month. This gives us a maximum of 30 days on top of the 180 days of the script. This can be changed to your preferences of course.

To create a schedule, navigate to the Automation Account and open up "Schedules" from the left:

[![Image](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-automation-clean-entra-id-devices/jv-media-8510-937e972953d2.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-automation-clean-entra-id-devices/jv-media-8510-937e972953d2.png)

Then click on "+ Add a schedule" to add a new schedule. I will demonstrate a schedule for the first day of the month.

Give the schedule a name and description. Then configure the schedule to when you want the runbook/script to clean the devices. I have set the first day of the month at 3:00 AM, and set it to repeat every month.

[![Image](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-automation-clean-entra-id-devices/jv-media-8510-5e93134edda2.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-automation-clean-entra-id-devices/jv-media-8510-5e93134edda2.png)

Then click "Create" to create the schedule. We must now link the schedule to the runbook, so the task will actually run on your configured schedule. Re-open the "Runbooks" from the Automation Account again and open up your created Runbook.

[![Image](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-automation-clean-entra-id-devices/jv-media-8510-720df9a5608d.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-automation-clean-entra-id-devices/jv-media-8510-720df9a5608d.png)

Click on "Link to schedule" in your Runbook.

[![Image](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-automation-clean-entra-id-devices/jv-media-8510-1fc146f17002.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-automation-clean-entra-id-devices/jv-media-8510-1fc146f17002.png)

From there select your just created schedule and save the configuration.

[![Image](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-automation-clean-entra-id-devices/jv-media-8510-af10fbe0a406.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-automation-clean-entra-id-devices/jv-media-8510-af10fbe0a406.png)

Then click "OK" to apply the configuration and set the runbook to run on a schedule. We are now done with the configuration work.

---

## Summary

Using Azure Automation together with Microsoft Graph is a powerful and clean way to automatically remove inactive Entra ID devices. Using Azure Automation for device cleanup provides several benefits:

- No servers required
- Fully automated process
- Uses Managed Identity instead of service accounts
- Easy to maintain
- Scalable
- Low operational overhead

Because the solution runs fully in Azure and uses Managed Identity authentication, there is no need for extra infrastructure or service accounts. This keeps the solution secure, modern and easy to maintain. Automatically deleting devices can have impact if devices are still in use. Before enabling automatic cleanup:

- Validate your inactivity period
- Exclude special devices if needed
- Test carefully
- Monitor logs regularly

180 days is often a safe balance for many environments, but of course every organization is different and in special cases, devices can be offline for 180+ days before coming online again.

Thank you for reading this post and I hope it was helpful!

### Sources

These sources helped me by writing and research for this post;

1. https://learn.microsoft.com/en-us/azure/automation/overview
2. https://learn.microsoft.com/en-us/powershell/microsoftgraph/overview
3. https://learn.microsoft.com/en-us/entra/identity/devices/manage-stale-devices
4. https://github.com/JustinVerstijnen/JV-AA-CleanEntraIDDevices/tree/main
5. https://learn.microsoft.com/en-us/azure/automation/enable-managed-identity-for-automation