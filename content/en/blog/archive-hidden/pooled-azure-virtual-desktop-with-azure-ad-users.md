---
title: "Pooled Azure Virtual Desktop with Azure AD cloud users only"
date: 2025-06-12
slug: "pooled-azure-virtual-desktop-with-azure-ad-users"
categories:
  - Azure Virtual Desktop
tags:
  - Step by Step guides
description: >
  Since the beginning of Azure Virtual Desktop, it is mandatory to run it with an Active Directory. This because when using pooled sess...
---
{{% alert color="info" %}}
This deployment option is superseded by the more easy and secure Entra Kerberos option, check out the updated deployment guide here: <https://justinverstijnen.nl/azure-virtual-desktop-fslogix-and-native-kerberos-authentication/>
{{% /alert %}}

Since the beginning of Azure Virtual Desktop, it is mandatory to run it with an Active Directory. This because when using pooled session hosts, there has to be some sort of NTFS permission for FSLogix to reach the users' profile disks. This permission is done using NTFS with Kerberos authentication. Something Azure AD doesn't support.

But what if I tell you this is technically possible to do now? We can use Azure Virtual Desktop in a complete cloud-only setup, where we use Azure for our session hosts, a storage account for the storage of the disks, Intune for our centralized configurations and Azure AD/Entra ID for our authentication! All of this without Active Directory, Entra Domain Services of any sort of Entra Connect Sync. Let's follow this guide to find out.

---

## Requirements

- Basic understanding of Azure
- Basic understanding of Entra ID
- Basic understanding of Azure Virtual Desktop and FSLogix
- Licenses for Intune and Azure Virtual Desktop (365 Business Premium and up)
- An Pay as you go (PAYG) Azure subscription to follow the step by step guide
- Around 60 minutes of your time

---

## How does the traditional setup work?

In traditional environments we built or used an existing Active Directory and we joined the Azure storage account to it with Powershell. This makes Kerberos authentication possible to the fileshare of the storage account and for NTFS as well:

### Topology

This means we have to host an Active Directory domain ourselves, and mean we have to patch and maintain those servers as well. Also, in bigger environments we are not done with only one server because of availability reasons.

<!-- draw.io diagram -->
<div class="mxgraph" style="max-width:100%;border:1px solid transparent;" data-mxgraph="{&quot;highlight&quot;:&quot;#0000ff&quot;,&quot;nav&quot;:true,&quot;resize&quot;:true,&quot;page&quot;:0,&quot;dark-mode&quot;:&quot;auto&quot;,&quot;toolbar&quot;:&quot;pages zoom layers tags lightbox&quot;,&quot;xml&quot;:&quot;&lt;mxfile host=\&quot;app.diagrams.net\&quot; agent=\&quot;Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 Edg/135.0.0.0\&quot; version=\&quot;26.2.14\&quot; pages=\&quot;2\&quot;&gt;\n  &lt;diagram name=\&quot;Traditional setup\&quot; id=\&quot;Ru-RAAyF32au7Hvwx1fT\&quot;&gt;\n    &lt;mxGraphModel dx=\&quot;1877\&quot; dy=\&quot;1078\&quot; grid=\&quot;1\&quot; gridSize=\&quot;10\&quot; guides=\&quot;1\&quot; tooltips=\&quot;1\&quot; connect=\&quot;1\&quot; arrows=\&quot;1\&quot; fold=\&quot;1\&quot; page=\&quot;1\&quot; pageScale=\&quot;1\&quot; pageWidth=\&quot;400\&quot; pageHeight=\&quot;156\&quot; math=\&quot;0\&quot; shadow=\&quot;0\&quot;&gt;\n      &lt;root&gt;\n        &lt;mxCell id=\&quot;0\&quot; /&gt;\n        &lt;mxCell id=\&quot;1\&quot; parent=\&quot;0\&quot; /&gt;\n        &lt;mxCell id=\&quot;9mR7YrU1p4Kd-DwnpqKB-1\&quot; value=\&quot;Active Directory&amp;lt;div&amp;gt;Domain&amp;lt;/div&amp;gt;\&quot; style=\&quot;image;aspect=fixed;html=1;points=[];align=center;fontSize=12;image=img/lib/azure2/identity/Azure_AD_Domain_Services.svg;\&quot; vertex=\&quot;1\&quot; parent=\&quot;1\&quot;&gt;\n          &lt;mxGeometry x=\&quot;-57.03999999999999\&quot; y=\&quot;-104\&quot; width=\&quot;59.07\&quot; height=\&quot;54\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;9mR7YrU1p4Kd-DwnpqKB-3\&quot; value=\&quot;Storage account\&quot; style=\&quot;image;aspect=fixed;html=1;points=[];align=center;fontSize=12;image=img/lib/azure2/storage/Storage_Accounts.svg;\&quot; vertex=\&quot;1\&quot; parent=\&quot;1\&quot;&gt;\n          &lt;mxGeometry x=\&quot;-60\&quot; y=\&quot;47\&quot; width=\&quot;65\&quot; height=\&quot;52\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;9mR7YrU1p4Kd-DwnpqKB-4\&quot; value=\&quot;Session host\&quot; style=\&quot;image;aspect=fixed;html=1;points=[];align=center;fontSize=12;image=img/lib/azure2/compute/Virtual_Machine.svg;\&quot; vertex=\&quot;1\&quot; parent=\&quot;1\&quot;&gt;\n          &lt;mxGeometry x=\&quot;-400\&quot; y=\&quot;50\&quot; width=\&quot;69\&quot; height=\&quot;64\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;9mR7YrU1p4Kd-DwnpqKB-5\&quot; value=\&quot;fslogix-profiles\&quot; style=\&quot;sketch=0;aspect=fixed;pointerEvents=1;shadow=0;dashed=0;html=1;strokeColor=none;labelPosition=center;verticalLabelPosition=bottom;verticalAlign=top;align=center;fillColor=light-dark(#7088ff, #bfd3ff);shape=mxgraph.mscae.enterprise.shared_folder\&quot; vertex=\&quot;1\&quot; parent=\&quot;1\&quot;&gt;\n          &lt;mxGeometry x=\&quot;150\&quot; y=\&quot;48\&quot; width=\&quot;43\&quot; height=\&quot;50\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;9mR7YrU1p4Kd-DwnpqKB-6\&quot; value=\&quot;userprofile.vhdx\&quot; style=\&quot;image;aspect=fixed;html=1;points=[];align=center;fontSize=12;image=img/lib/azure2/compute/Disks.svg;\&quot; vertex=\&quot;1\&quot; parent=\&quot;1\&quot;&gt;\n          &lt;mxGeometry x=\&quot;290\&quot; y=\&quot;51\&quot; width=\&quot;50.89\&quot; height=\&quot;50\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;9mR7YrU1p4Kd-DwnpqKB-10\&quot; value=\&quot;\&quot; style=\&quot;endArrow=classic;html=1;rounded=0;exitX=0.503;exitY=1.004;exitDx=0;exitDy=0;exitPerimeter=0;entryX=0.499;entryY=0.994;entryDx=0;entryDy=0;entryPerimeter=0;flowAnimation=1;\&quot; edge=\&quot;1\&quot; parent=\&quot;1\&quot; source=\&quot;9mR7YrU1p4Kd-DwnpqKB-6\&quot; target=\&quot;9mR7YrU1p4Kd-DwnpqKB-4\&quot;&gt;\n          &lt;mxGeometry width=\&quot;50\&quot; height=\&quot;50\&quot; relative=\&quot;1\&quot; as=\&quot;geometry\&quot;&gt;\n            &lt;mxPoint x=\&quot;100\&quot; y=\&quot;10\&quot; as=\&quot;sourcePoint\&quot; /&gt;\n            &lt;mxPoint x=\&quot;-300\&quot; y=\&quot;170\&quot; as=\&quot;targetPoint\&quot; /&gt;\n            &lt;Array as=\&quot;points\&quot;&gt;\n              &lt;mxPoint x=\&quot;316\&quot; y=\&quot;170\&quot; /&gt;\n              &lt;mxPoint x=\&quot;-366\&quot; y=\&quot;170\&quot; /&gt;\n            &lt;/Array&gt;\n          &lt;/mxGeometry&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;9mR7YrU1p4Kd-DwnpqKB-11\&quot; value=\&quot;\&quot; style=\&quot;endArrow=classic;html=1;rounded=0;flowAnimation=1;\&quot; edge=\&quot;1\&quot; parent=\&quot;1\&quot;&gt;\n          &lt;mxGeometry width=\&quot;50\&quot; height=\&quot;50\&quot; relative=\&quot;1\&quot; as=\&quot;geometry\&quot;&gt;\n            &lt;mxPoint x=\&quot;-320\&quot; y=\&quot;73\&quot; as=\&quot;sourcePoint\&quot; /&gt;\n            &lt;mxPoint x=\&quot;-70\&quot; y=\&quot;73\&quot; as=\&quot;targetPoint\&quot; /&gt;\n          &lt;/mxGeometry&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;9mR7YrU1p4Kd-DwnpqKB-13\&quot; value=\&quot;\&quot; style=\&quot;verticalLabelPosition=bottom;html=1;verticalAlign=top;align=center;strokeColor=none;fillColor=#00BEF2;shape=mxgraph.azure.user;\&quot; vertex=\&quot;1\&quot; parent=\&quot;1\&quot;&gt;\n          &lt;mxGeometry x=\&quot;-389.25\&quot; y=\&quot;-4\&quot; width=\&quot;47.5\&quot; height=\&quot;50\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;9mR7YrU1p4Kd-DwnpqKB-14\&quot; value=\&quot;\&quot; style=\&quot;endArrow=classic;html=1;rounded=0;flowAnimation=1;\&quot; edge=\&quot;1\&quot; parent=\&quot;1\&quot;&gt;\n          &lt;mxGeometry width=\&quot;50\&quot; height=\&quot;50\&quot; relative=\&quot;1\&quot; as=\&quot;geometry\&quot;&gt;\n            &lt;mxPoint x=\&quot;-38\&quot; y=\&quot;40\&quot; as=\&quot;sourcePoint\&quot; /&gt;\n            &lt;mxPoint x=\&quot;-38\&quot; y=\&quot;-10\&quot; as=\&quot;targetPoint\&quot; /&gt;\n          &lt;/mxGeometry&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;9mR7YrU1p4Kd-DwnpqKB-15\&quot; value=\&quot;\&quot; style=\&quot;endArrow=classic;html=1;rounded=0;flowAnimation=1;\&quot; edge=\&quot;1\&quot; parent=\&quot;1\&quot;&gt;\n          &lt;mxGeometry width=\&quot;50\&quot; height=\&quot;50\&quot; relative=\&quot;1\&quot; as=\&quot;geometry\&quot;&gt;\n            &lt;mxPoint x=\&quot;-20\&quot; y=\&quot;-10\&quot; as=\&quot;sourcePoint\&quot; /&gt;\n            &lt;mxPoint x=\&quot;-20\&quot; y=\&quot;40\&quot; as=\&quot;targetPoint\&quot; /&gt;\n          &lt;/mxGeometry&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;9mR7YrU1p4Kd-DwnpqKB-19\&quot; value=\&quot;\&quot; style=\&quot;rounded=0;whiteSpace=wrap;html=1;fillColor=#dae8fc;strokeColor=#6c8ebf;\&quot; vertex=\&quot;1\&quot; parent=\&quot;1\&quot;&gt;\n          &lt;mxGeometry x=\&quot;-162.5\&quot; y=\&quot;-280\&quot; width=\&quot;270\&quot; height=\&quot;115\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;9mR7YrU1p4Kd-DwnpqKB-20\&quot; value=\&quot;DC01\&quot; style=\&quot;image;aspect=fixed;html=1;points=[];align=center;fontSize=12;image=img/lib/azure2/compute/Virtual_Machine.svg;\&quot; vertex=\&quot;1\&quot; parent=\&quot;1\&quot;&gt;\n          &lt;mxGeometry x=\&quot;-149.5\&quot; y=\&quot;-267\&quot; width=\&quot;69\&quot; height=\&quot;64\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;9mR7YrU1p4Kd-DwnpqKB-21\&quot; value=\&quot;DC02\&quot; style=\&quot;image;aspect=fixed;html=1;points=[];align=center;fontSize=12;image=img/lib/azure2/compute/Virtual_Machine.svg;\&quot; vertex=\&quot;1\&quot; parent=\&quot;1\&quot;&gt;\n          &lt;mxGeometry x=\&quot;-61.5\&quot; y=\&quot;-267\&quot; width=\&quot;69\&quot; height=\&quot;64\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;9mR7YrU1p4Kd-DwnpqKB-22\&quot; value=\&quot;DC03\&quot; style=\&quot;image;aspect=fixed;html=1;points=[];align=center;fontSize=12;image=img/lib/azure2/compute/Virtual_Machine.svg;\&quot; vertex=\&quot;1\&quot; parent=\&quot;1\&quot;&gt;\n          &lt;mxGeometry x=\&quot;25.5\&quot; y=\&quot;-267\&quot; width=\&quot;69\&quot; height=\&quot;64\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;9mR7YrU1p4Kd-DwnpqKB-23\&quot; value=\&quot;Domain Controllers\&quot; style=\&quot;text;html=1;align=center;verticalAlign=middle;resizable=0;points=[];autosize=1;strokeColor=none;fillColor=none;fontStyle=1\&quot; vertex=\&quot;1\&quot; parent=\&quot;1\&quot;&gt;\n          &lt;mxGeometry x=\&quot;-92.5\&quot; y=\&quot;-290\&quot; width=\&quot;130\&quot; height=\&quot;30\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;9mR7YrU1p4Kd-DwnpqKB-24\&quot; value=\&quot;\&quot; style=\&quot;endArrow=classic;html=1;rounded=0;flowAnimation=1;\&quot; edge=\&quot;1\&quot; parent=\&quot;1\&quot;&gt;\n          &lt;mxGeometry width=\&quot;50\&quot; height=\&quot;50\&quot; relative=\&quot;1\&quot; as=\&quot;geometry\&quot;&gt;\n            &lt;mxPoint x=\&quot;-36.5\&quot; y=\&quot;-106\&quot; as=\&quot;sourcePoint\&quot; /&gt;\n            &lt;mxPoint x=\&quot;-36.5\&quot; y=\&quot;-156\&quot; as=\&quot;targetPoint\&quot; /&gt;\n          &lt;/mxGeometry&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;9mR7YrU1p4Kd-DwnpqKB-25\&quot; value=\&quot;\&quot; style=\&quot;endArrow=classic;html=1;rounded=0;flowAnimation=1;\&quot; edge=\&quot;1\&quot; parent=\&quot;1\&quot;&gt;\n          &lt;mxGeometry width=\&quot;50\&quot; height=\&quot;50\&quot; relative=\&quot;1\&quot; as=\&quot;geometry\&quot;&gt;\n            &lt;mxPoint x=\&quot;-18.5\&quot; y=\&quot;-156\&quot; as=\&quot;sourcePoint\&quot; /&gt;\n            &lt;mxPoint x=\&quot;-18.5\&quot; y=\&quot;-106\&quot; as=\&quot;targetPoint\&quot; /&gt;\n          &lt;/mxGeometry&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;9mR7YrU1p4Kd-DwnpqKB-26\&quot; value=\&quot;\&quot; style=\&quot;endArrow=classic;html=1;rounded=0;flowAnimation=1;\&quot; edge=\&quot;1\&quot; parent=\&quot;1\&quot;&gt;\n          &lt;mxGeometry width=\&quot;50\&quot; height=\&quot;50\&quot; relative=\&quot;1\&quot; as=\&quot;geometry\&quot;&gt;\n            &lt;mxPoint x=\&quot;9\&quot; y=\&quot;73\&quot; as=\&quot;sourcePoint\&quot; /&gt;\n            &lt;mxPoint x=\&quot;140\&quot; y=\&quot;73\&quot; as=\&quot;targetPoint\&quot; /&gt;\n          &lt;/mxGeometry&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;9mR7YrU1p4Kd-DwnpqKB-27\&quot; value=\&quot;\&quot; style=\&quot;endArrow=classic;html=1;rounded=0;flowAnimation=1;\&quot; edge=\&quot;1\&quot; parent=\&quot;1\&quot;&gt;\n          &lt;mxGeometry width=\&quot;50\&quot; height=\&quot;50\&quot; relative=\&quot;1\&quot; as=\&quot;geometry\&quot;&gt;\n            &lt;mxPoint x=\&quot;210\&quot; y=\&quot;75.5\&quot; as=\&quot;sourcePoint\&quot; /&gt;\n            &lt;mxPoint x=\&quot;285\&quot; y=\&quot;75.5\&quot; as=\&quot;targetPoint\&quot; /&gt;\n          &lt;/mxGeometry&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;9mR7YrU1p4Kd-DwnpqKB-28\&quot; value=\&quot;1. User logs in\&quot; style=\&quot;text;html=1;align=center;verticalAlign=middle;resizable=0;points=[];autosize=1;strokeColor=none;fillColor=none;fontStyle=1\&quot; vertex=\&quot;1\&quot; parent=\&quot;1\&quot;&gt;\n          &lt;mxGeometry x=\&quot;-250\&quot; y=\&quot;40\&quot; width=\&quot;100\&quot; height=\&quot;30\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;9mR7YrU1p4Kd-DwnpqKB-29\&quot; value=\&quot;2. Authentication attempt is sent to Active Directory\&quot; style=\&quot;text;html=1;align=center;verticalAlign=middle;resizable=0;points=[];autosize=1;strokeColor=none;fillColor=none;fontStyle=1\&quot; vertex=\&quot;1\&quot; parent=\&quot;1\&quot;&gt;\n          &lt;mxGeometry x=\&quot;-370.5\&quot; y=\&quot;-80\&quot; width=\&quot;290\&quot; height=\&quot;30\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;9mR7YrU1p4Kd-DwnpqKB-30\&quot; value=\&quot;\&quot; style=\&quot;sketch=0;html=1;aspect=fixed;strokeColor=none;shadow=0;align=center;fillColor=#2D9C5E;verticalAlign=top;labelPosition=center;verticalLabelPosition=bottom;shape=mxgraph.gcp2.check\&quot; vertex=\&quot;1\&quot; parent=\&quot;1\&quot;&gt;\n          &lt;mxGeometry x=\&quot;-10\&quot; y=\&quot;-140\&quot; width=\&quot;25\&quot; height=\&quot;20\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;9mR7YrU1p4Kd-DwnpqKB-31\&quot; value=\&quot;3. User is authenticated successfully\&quot; style=\&quot;text;html=1;align=center;verticalAlign=middle;resizable=0;points=[];autosize=1;strokeColor=none;fillColor=none;fontStyle=1\&quot; vertex=\&quot;1\&quot; parent=\&quot;1\&quot;&gt;\n          &lt;mxGeometry x=\&quot;20.5\&quot; y=\&quot;-80\&quot; width=\&quot;220\&quot; height=\&quot;30\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;9mR7YrU1p4Kd-DwnpqKB-32\&quot; value=\&quot;4. User is authorized&amp;lt;div&amp;gt;through NTFS&amp;lt;/div&amp;gt;\&quot; style=\&quot;text;html=1;align=center;verticalAlign=middle;resizable=0;points=[];autosize=1;strokeColor=none;fillColor=none;fontStyle=1\&quot; vertex=\&quot;1\&quot; parent=\&quot;1\&quot;&gt;\n          &lt;mxGeometry x=\&quot;15\&quot; y=\&quot;35\&quot; width=\&quot;130\&quot; height=\&quot;40\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;9mR7YrU1p4Kd-DwnpqKB-33\&quot; value=\&quot;5. Profile disk is mounted\&quot; style=\&quot;text;html=1;align=center;verticalAlign=middle;resizable=0;points=[];autosize=1;strokeColor=none;fillColor=none;fontStyle=1\&quot; vertex=\&quot;1\&quot; parent=\&quot;1\&quot;&gt;\n          &lt;mxGeometry x=\&quot;-107\&quot; y=\&quot;170\&quot; width=\&quot;160\&quot; height=\&quot;30\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n      &lt;/root&gt;\n    &lt;/mxGraphModel&gt;\n  &lt;/diagram&gt;\n  &lt;diagram id=\&quot;MBvYcN8Ojx7u8KXp0AiT\&quot; name=\&quot;Cloud Only Setup\&quot;&gt;\n    &lt;mxGraphModel dx=\&quot;1616\&quot; dy=\&quot;787\&quot; grid=\&quot;1\&quot; gridSize=\&quot;10\&quot; guides=\&quot;1\&quot; tooltips=\&quot;1\&quot; connect=\&quot;1\&quot; arrows=\&quot;1\&quot; fold=\&quot;1\&quot; page=\&quot;1\&quot; pageScale=\&quot;1\&quot; pageWidth=\&quot;400\&quot; pageHeight=\&quot;156\&quot; math=\&quot;0\&quot; shadow=\&quot;0\&quot;&gt;\n      &lt;root&gt;\n        &lt;mxCell id=\&quot;0\&quot; /&gt;\n        &lt;mxCell id=\&quot;1\&quot; parent=\&quot;0\&quot; /&gt;\n        &lt;mxCell id=\&quot;I8O79UHgh5rET7-c4sSl-2\&quot; value=\&quot;Storage account\&quot; style=\&quot;image;aspect=fixed;html=1;points=[];align=center;fontSize=12;image=img/lib/azure2/storage/Storage_Accounts.svg;\&quot; vertex=\&quot;1\&quot; parent=\&quot;1\&quot;&gt;\n          &lt;mxGeometry x=\&quot;-60\&quot; y=\&quot;47\&quot; width=\&quot;65\&quot; height=\&quot;52\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;I8O79UHgh5rET7-c4sSl-3\&quot; value=\&quot;Session host\&quot; style=\&quot;image;aspect=fixed;html=1;points=[];align=center;fontSize=12;image=img/lib/azure2/compute/Virtual_Machine.svg;\&quot; vertex=\&quot;1\&quot; parent=\&quot;1\&quot;&gt;\n          &lt;mxGeometry x=\&quot;-400\&quot; y=\&quot;50\&quot; width=\&quot;69\&quot; height=\&quot;64\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;I8O79UHgh5rET7-c4sSl-4\&quot; value=\&quot;fslogix-profiles\&quot; style=\&quot;sketch=0;aspect=fixed;pointerEvents=1;shadow=0;dashed=0;html=1;strokeColor=none;labelPosition=center;verticalLabelPosition=bottom;verticalAlign=top;align=center;fillColor=light-dark(#7088ff, #bfd3ff);shape=mxgraph.mscae.enterprise.shared_folder\&quot; vertex=\&quot;1\&quot; parent=\&quot;1\&quot;&gt;\n          &lt;mxGeometry x=\&quot;150\&quot; y=\&quot;48\&quot; width=\&quot;43\&quot; height=\&quot;50\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;I8O79UHgh5rET7-c4sSl-5\&quot; value=\&quot;userprofile.vhdx\&quot; style=\&quot;image;aspect=fixed;html=1;points=[];align=center;fontSize=12;image=img/lib/azure2/compute/Disks.svg;\&quot; vertex=\&quot;1\&quot; parent=\&quot;1\&quot;&gt;\n          &lt;mxGeometry x=\&quot;290\&quot; y=\&quot;51\&quot; width=\&quot;50.89\&quot; height=\&quot;50\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;I8O79UHgh5rET7-c4sSl-6\&quot; value=\&quot;\&quot; style=\&quot;endArrow=classic;html=1;rounded=0;exitX=0.503;exitY=1.004;exitDx=0;exitDy=0;exitPerimeter=0;entryX=0.499;entryY=0.994;entryDx=0;entryDy=0;entryPerimeter=0;flowAnimation=1;\&quot; edge=\&quot;1\&quot; parent=\&quot;1\&quot; source=\&quot;I8O79UHgh5rET7-c4sSl-5\&quot; target=\&quot;I8O79UHgh5rET7-c4sSl-3\&quot;&gt;\n          &lt;mxGeometry width=\&quot;50\&quot; height=\&quot;50\&quot; relative=\&quot;1\&quot; as=\&quot;geometry\&quot;&gt;\n            &lt;mxPoint x=\&quot;100\&quot; y=\&quot;10\&quot; as=\&quot;sourcePoint\&quot; /&gt;\n            &lt;mxPoint x=\&quot;-300\&quot; y=\&quot;170\&quot; as=\&quot;targetPoint\&quot; /&gt;\n            &lt;Array as=\&quot;points\&quot;&gt;\n              &lt;mxPoint x=\&quot;316\&quot; y=\&quot;170\&quot; /&gt;\n              &lt;mxPoint x=\&quot;-366\&quot; y=\&quot;170\&quot; /&gt;\n            &lt;/Array&gt;\n          &lt;/mxGeometry&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;I8O79UHgh5rET7-c4sSl-7\&quot; value=\&quot;\&quot; style=\&quot;endArrow=classic;html=1;rounded=0;flowAnimation=1;\&quot; edge=\&quot;1\&quot; parent=\&quot;1\&quot;&gt;\n          &lt;mxGeometry width=\&quot;50\&quot; height=\&quot;50\&quot; relative=\&quot;1\&quot; as=\&quot;geometry\&quot;&gt;\n            &lt;mxPoint x=\&quot;-320\&quot; y=\&quot;73\&quot; as=\&quot;sourcePoint\&quot; /&gt;\n            &lt;mxPoint x=\&quot;-70\&quot; y=\&quot;73\&quot; as=\&quot;targetPoint\&quot; /&gt;\n          &lt;/mxGeometry&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;I8O79UHgh5rET7-c4sSl-8\&quot; value=\&quot;\&quot; style=\&quot;verticalLabelPosition=bottom;html=1;verticalAlign=top;align=center;strokeColor=none;fillColor=#00BEF2;shape=mxgraph.azure.user;\&quot; vertex=\&quot;1\&quot; parent=\&quot;1\&quot;&gt;\n          &lt;mxGeometry x=\&quot;-389.25\&quot; y=\&quot;-4\&quot; width=\&quot;47.5\&quot; height=\&quot;50\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;I8O79UHgh5rET7-c4sSl-9\&quot; value=\&quot;\&quot; style=\&quot;endArrow=classic;html=1;rounded=0;flowAnimation=1;\&quot; edge=\&quot;1\&quot; parent=\&quot;1\&quot;&gt;\n          &lt;mxGeometry width=\&quot;50\&quot; height=\&quot;50\&quot; relative=\&quot;1\&quot; as=\&quot;geometry\&quot;&gt;\n            &lt;mxPoint x=\&quot;-38\&quot; y=\&quot;40\&quot; as=\&quot;sourcePoint\&quot; /&gt;\n            &lt;mxPoint x=\&quot;-38\&quot; y=\&quot;-10\&quot; as=\&quot;targetPoint\&quot; /&gt;\n          &lt;/mxGeometry&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;I8O79UHgh5rET7-c4sSl-10\&quot; value=\&quot;\&quot; style=\&quot;endArrow=classic;html=1;rounded=0;flowAnimation=1;\&quot; edge=\&quot;1\&quot; parent=\&quot;1\&quot;&gt;\n          &lt;mxGeometry width=\&quot;50\&quot; height=\&quot;50\&quot; relative=\&quot;1\&quot; as=\&quot;geometry\&quot;&gt;\n            &lt;mxPoint x=\&quot;-20\&quot; y=\&quot;-10\&quot; as=\&quot;sourcePoint\&quot; /&gt;\n            &lt;mxPoint x=\&quot;-20\&quot; y=\&quot;40\&quot; as=\&quot;targetPoint\&quot; /&gt;\n          &lt;/mxGeometry&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;I8O79UHgh5rET7-c4sSl-18\&quot; value=\&quot;\&quot; style=\&quot;endArrow=classic;html=1;rounded=0;flowAnimation=1;\&quot; edge=\&quot;1\&quot; parent=\&quot;1\&quot;&gt;\n          &lt;mxGeometry width=\&quot;50\&quot; height=\&quot;50\&quot; relative=\&quot;1\&quot; as=\&quot;geometry\&quot;&gt;\n            &lt;mxPoint x=\&quot;9\&quot; y=\&quot;73\&quot; as=\&quot;sourcePoint\&quot; /&gt;\n            &lt;mxPoint x=\&quot;140\&quot; y=\&quot;73\&quot; as=\&quot;targetPoint\&quot; /&gt;\n          &lt;/mxGeometry&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;I8O79UHgh5rET7-c4sSl-19\&quot; value=\&quot;\&quot; style=\&quot;endArrow=classic;html=1;rounded=0;flowAnimation=1;\&quot; edge=\&quot;1\&quot; parent=\&quot;1\&quot;&gt;\n          &lt;mxGeometry width=\&quot;50\&quot; height=\&quot;50\&quot; relative=\&quot;1\&quot; as=\&quot;geometry\&quot;&gt;\n            &lt;mxPoint x=\&quot;210\&quot; y=\&quot;75.5\&quot; as=\&quot;sourcePoint\&quot; /&gt;\n            &lt;mxPoint x=\&quot;285\&quot; y=\&quot;75.5\&quot; as=\&quot;targetPoint\&quot; /&gt;\n          &lt;/mxGeometry&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;I8O79UHgh5rET7-c4sSl-20\&quot; value=\&quot;1. User logs in\&quot; style=\&quot;text;html=1;align=center;verticalAlign=middle;resizable=0;points=[];autosize=1;strokeColor=none;fillColor=none;fontStyle=1\&quot; vertex=\&quot;1\&quot; parent=\&quot;1\&quot;&gt;\n          &lt;mxGeometry x=\&quot;-250\&quot; y=\&quot;40\&quot; width=\&quot;100\&quot; height=\&quot;30\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;I8O79UHgh5rET7-c4sSl-24\&quot; value=\&quot;4. User is authorized&amp;lt;div&amp;gt;through NTFS&amp;lt;/div&amp;gt;\&quot; style=\&quot;text;html=1;align=center;verticalAlign=middle;resizable=0;points=[];autosize=1;strokeColor=none;fillColor=none;fontStyle=1\&quot; vertex=\&quot;1\&quot; parent=\&quot;1\&quot;&gt;\n          &lt;mxGeometry x=\&quot;15\&quot; y=\&quot;35\&quot; width=\&quot;130\&quot; height=\&quot;40\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;I8O79UHgh5rET7-c4sSl-25\&quot; value=\&quot;5. Profile disk is mounted\&quot; style=\&quot;text;html=1;align=center;verticalAlign=middle;resizable=0;points=[];autosize=1;strokeColor=none;fillColor=none;fontStyle=1\&quot; vertex=\&quot;1\&quot; parent=\&quot;1\&quot;&gt;\n          &lt;mxGeometry x=\&quot;-107\&quot; y=\&quot;170\&quot; width=\&quot;160\&quot; height=\&quot;30\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;I8O79UHgh5rET7-c4sSl-26\&quot; value=\&quot;Entra ID\&quot; style=\&quot;shape=image;verticalLabelPosition=bottom;labelBackgroundColor=default;verticalAlign=top;aspect=fixed;imageAspect=0;image=https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Microsoft_Entra_ID_color_icon.svg/2048px-Microsoft_Entra_ID_color_icon.svg.png;\&quot; vertex=\&quot;1\&quot; parent=\&quot;1\&quot;&gt;\n          &lt;mxGeometry x=\&quot;-62\&quot; y=\&quot;-113\&quot; width=\&quot;70\&quot; height=\&quot;70\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;I8O79UHgh5rET7-c4sSl-27\&quot; value=\&quot;2. Authentication attempt is sent to Entra ID\&quot; style=\&quot;text;html=1;align=center;verticalAlign=middle;resizable=0;points=[];autosize=1;strokeColor=none;fillColor=none;fontStyle=1\&quot; vertex=\&quot;1\&quot; parent=\&quot;1\&quot;&gt;\n          &lt;mxGeometry x=\&quot;-341.75\&quot; y=\&quot;-93\&quot; width=\&quot;250\&quot; height=\&quot;30\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;I8O79UHgh5rET7-c4sSl-28\&quot; value=\&quot;3. User is authenticated successfully\&quot; style=\&quot;text;html=1;align=center;verticalAlign=middle;resizable=0;points=[];autosize=1;strokeColor=none;fillColor=none;fontStyle=1\&quot; vertex=\&quot;1\&quot; parent=\&quot;1\&quot;&gt;\n          &lt;mxGeometry x=\&quot;55\&quot; y=\&quot;-93\&quot; width=\&quot;220\&quot; height=\&quot;30\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n      &lt;/root&gt;\n    &lt;/mxGraphModel&gt;\n  &lt;/diagram&gt;\n&lt;/mxfile&gt;\n&quot;}"></div>
<script type="text/javascript" src="https://viewer.diagrams.net/js/viewer-static.min.js"></script>

A good point to remember is that this all works in one flow. The user is authenticated in Active Directory and then authorized with that credential/ticket for the NTFS permissions. Basically how Kerberos works.

---

## How does the cloud only setup work?

In the cloud only setup there are 2 seperate authentication flows. The user will first be authenticated to Entra ID. When the user is authenticated there will be checked if it has the required Azure roles to login into a Entra joined machine.

After that is completed, there will be another authentication flow from the session host to the storage account to verify if the storage access key the session host knows is correct. The session host has [the FSLogix setting enabled](https://learn.microsoft.com/en-us/fslogix/reference-configuration-settings?tabs=profiles#accessnetworkascomputerobject) to access the network as computer account.

### Topology

As you might think, there are indeed some security risks with this setup;

<!-- draw.io diagram -->
<div class="mxgraph" style="max-width:100%;border:1px solid transparent;" data-mxgraph="{&quot;highlight&quot;:&quot;#0000ff&quot;,&quot;nav&quot;:true,&quot;resize&quot;:true,&quot;page&quot;:1,&quot;dark-mode&quot;:&quot;auto&quot;,&quot;toolbar&quot;:&quot;pages zoom layers tags lightbox&quot;,&quot;xml&quot;:&quot;&lt;mxfile host=\&quot;app.diagrams.net\&quot; agent=\&quot;Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 Edg/135.0.0.0\&quot; version=\&quot;26.2.14\&quot; pages=\&quot;2\&quot;&gt;\n  &lt;diagram name=\&quot;Traditional setup\&quot; id=\&quot;Ru-RAAyF32au7Hvwx1fT\&quot;&gt;\n    &lt;mxGraphModel dx=\&quot;1877\&quot; dy=\&quot;1078\&quot; grid=\&quot;1\&quot; gridSize=\&quot;10\&quot; guides=\&quot;1\&quot; tooltips=\&quot;1\&quot; connect=\&quot;1\&quot; arrows=\&quot;1\&quot; fold=\&quot;1\&quot; page=\&quot;1\&quot; pageScale=\&quot;1\&quot; pageWidth=\&quot;400\&quot; pageHeight=\&quot;156\&quot; math=\&quot;0\&quot; shadow=\&quot;0\&quot;&gt;\n      &lt;root&gt;\n        &lt;mxCell id=\&quot;0\&quot; /&gt;\n        &lt;mxCell id=\&quot;1\&quot; parent=\&quot;0\&quot; /&gt;\n        &lt;mxCell id=\&quot;9mR7YrU1p4Kd-DwnpqKB-1\&quot; value=\&quot;Active Directory&amp;lt;div&amp;gt;Domain&amp;lt;/div&amp;gt;\&quot; style=\&quot;image;aspect=fixed;html=1;points=[];align=center;fontSize=12;image=img/lib/azure2/identity/Azure_AD_Domain_Services.svg;\&quot; vertex=\&quot;1\&quot; parent=\&quot;1\&quot;&gt;\n          &lt;mxGeometry x=\&quot;-57.03999999999999\&quot; y=\&quot;-104\&quot; width=\&quot;59.07\&quot; height=\&quot;54\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;9mR7YrU1p4Kd-DwnpqKB-3\&quot; value=\&quot;Storage account\&quot; style=\&quot;image;aspect=fixed;html=1;points=[];align=center;fontSize=12;image=img/lib/azure2/storage/Storage_Accounts.svg;\&quot; vertex=\&quot;1\&quot; parent=\&quot;1\&quot;&gt;\n          &lt;mxGeometry x=\&quot;-60\&quot; y=\&quot;47\&quot; width=\&quot;65\&quot; height=\&quot;52\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;9mR7YrU1p4Kd-DwnpqKB-4\&quot; value=\&quot;Session host\&quot; style=\&quot;image;aspect=fixed;html=1;points=[];align=center;fontSize=12;image=img/lib/azure2/compute/Virtual_Machine.svg;\&quot; vertex=\&quot;1\&quot; parent=\&quot;1\&quot;&gt;\n          &lt;mxGeometry x=\&quot;-400\&quot; y=\&quot;50\&quot; width=\&quot;69\&quot; height=\&quot;64\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;9mR7YrU1p4Kd-DwnpqKB-5\&quot; value=\&quot;fslogix-profiles\&quot; style=\&quot;sketch=0;aspect=fixed;pointerEvents=1;shadow=0;dashed=0;html=1;strokeColor=none;labelPosition=center;verticalLabelPosition=bottom;verticalAlign=top;align=center;fillColor=light-dark(#7088ff, #bfd3ff);shape=mxgraph.mscae.enterprise.shared_folder\&quot; vertex=\&quot;1\&quot; parent=\&quot;1\&quot;&gt;\n          &lt;mxGeometry x=\&quot;150\&quot; y=\&quot;48\&quot; width=\&quot;43\&quot; height=\&quot;50\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;9mR7YrU1p4Kd-DwnpqKB-6\&quot; value=\&quot;userprofile.vhdx\&quot; style=\&quot;image;aspect=fixed;html=1;points=[];align=center;fontSize=12;image=img/lib/azure2/compute/Disks.svg;\&quot; vertex=\&quot;1\&quot; parent=\&quot;1\&quot;&gt;\n          &lt;mxGeometry x=\&quot;290\&quot; y=\&quot;51\&quot; width=\&quot;50.89\&quot; height=\&quot;50\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;9mR7YrU1p4Kd-DwnpqKB-10\&quot; value=\&quot;\&quot; style=\&quot;endArrow=classic;html=1;rounded=0;exitX=0.503;exitY=1.004;exitDx=0;exitDy=0;exitPerimeter=0;entryX=0.499;entryY=0.994;entryDx=0;entryDy=0;entryPerimeter=0;flowAnimation=1;\&quot; edge=\&quot;1\&quot; parent=\&quot;1\&quot; source=\&quot;9mR7YrU1p4Kd-DwnpqKB-6\&quot; target=\&quot;9mR7YrU1p4Kd-DwnpqKB-4\&quot;&gt;\n          &lt;mxGeometry width=\&quot;50\&quot; height=\&quot;50\&quot; relative=\&quot;1\&quot; as=\&quot;geometry\&quot;&gt;\n            &lt;mxPoint x=\&quot;100\&quot; y=\&quot;10\&quot; as=\&quot;sourcePoint\&quot; /&gt;\n            &lt;mxPoint x=\&quot;-300\&quot; y=\&quot;170\&quot; as=\&quot;targetPoint\&quot; /&gt;\n            &lt;Array as=\&quot;points\&quot;&gt;\n              &lt;mxPoint x=\&quot;316\&quot; y=\&quot;170\&quot; /&gt;\n              &lt;mxPoint x=\&quot;-366\&quot; y=\&quot;170\&quot; /&gt;\n            &lt;/Array&gt;\n          &lt;/mxGeometry&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;9mR7YrU1p4Kd-DwnpqKB-11\&quot; value=\&quot;\&quot; style=\&quot;endArrow=classic;html=1;rounded=0;flowAnimation=1;\&quot; edge=\&quot;1\&quot; parent=\&quot;1\&quot;&gt;\n          &lt;mxGeometry width=\&quot;50\&quot; height=\&quot;50\&quot; relative=\&quot;1\&quot; as=\&quot;geometry\&quot;&gt;\n            &lt;mxPoint x=\&quot;-320\&quot; y=\&quot;73\&quot; as=\&quot;sourcePoint\&quot; /&gt;\n            &lt;mxPoint x=\&quot;-70\&quot; y=\&quot;73\&quot; as=\&quot;targetPoint\&quot; /&gt;\n          &lt;/mxGeometry&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;9mR7YrU1p4Kd-DwnpqKB-13\&quot; value=\&quot;\&quot; style=\&quot;verticalLabelPosition=bottom;html=1;verticalAlign=top;align=center;strokeColor=none;fillColor=#00BEF2;shape=mxgraph.azure.user;\&quot; vertex=\&quot;1\&quot; parent=\&quot;1\&quot;&gt;\n          &lt;mxGeometry x=\&quot;-389.25\&quot; y=\&quot;-4\&quot; width=\&quot;47.5\&quot; height=\&quot;50\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;9mR7YrU1p4Kd-DwnpqKB-14\&quot; value=\&quot;\&quot; style=\&quot;endArrow=classic;html=1;rounded=0;flowAnimation=1;\&quot; edge=\&quot;1\&quot; parent=\&quot;1\&quot;&gt;\n          &lt;mxGeometry width=\&quot;50\&quot; height=\&quot;50\&quot; relative=\&quot;1\&quot; as=\&quot;geometry\&quot;&gt;\n            &lt;mxPoint x=\&quot;-38\&quot; y=\&quot;40\&quot; as=\&quot;sourcePoint\&quot; /&gt;\n            &lt;mxPoint x=\&quot;-38\&quot; y=\&quot;-10\&quot; as=\&quot;targetPoint\&quot; /&gt;\n          &lt;/mxGeometry&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;9mR7YrU1p4Kd-DwnpqKB-15\&quot; value=\&quot;\&quot; style=\&quot;endArrow=classic;html=1;rounded=0;flowAnimation=1;\&quot; edge=\&quot;1\&quot; parent=\&quot;1\&quot;&gt;\n          &lt;mxGeometry width=\&quot;50\&quot; height=\&quot;50\&quot; relative=\&quot;1\&quot; as=\&quot;geometry\&quot;&gt;\n            &lt;mxPoint x=\&quot;-20\&quot; y=\&quot;-10\&quot; as=\&quot;sourcePoint\&quot; /&gt;\n            &lt;mxPoint x=\&quot;-20\&quot; y=\&quot;40\&quot; as=\&quot;targetPoint\&quot; /&gt;\n          &lt;/mxGeometry&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;9mR7YrU1p4Kd-DwnpqKB-19\&quot; value=\&quot;\&quot; style=\&quot;rounded=0;whiteSpace=wrap;html=1;fillColor=#dae8fc;strokeColor=#6c8ebf;\&quot; vertex=\&quot;1\&quot; parent=\&quot;1\&quot;&gt;\n          &lt;mxGeometry x=\&quot;-162.5\&quot; y=\&quot;-280\&quot; width=\&quot;270\&quot; height=\&quot;115\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;9mR7YrU1p4Kd-DwnpqKB-20\&quot; value=\&quot;DC01\&quot; style=\&quot;image;aspect=fixed;html=1;points=[];align=center;fontSize=12;image=img/lib/azure2/compute/Virtual_Machine.svg;\&quot; vertex=\&quot;1\&quot; parent=\&quot;1\&quot;&gt;\n          &lt;mxGeometry x=\&quot;-149.5\&quot; y=\&quot;-267\&quot; width=\&quot;69\&quot; height=\&quot;64\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;9mR7YrU1p4Kd-DwnpqKB-21\&quot; value=\&quot;DC02\&quot; style=\&quot;image;aspect=fixed;html=1;points=[];align=center;fontSize=12;image=img/lib/azure2/compute/Virtual_Machine.svg;\&quot; vertex=\&quot;1\&quot; parent=\&quot;1\&quot;&gt;\n          &lt;mxGeometry x=\&quot;-61.5\&quot; y=\&quot;-267\&quot; width=\&quot;69\&quot; height=\&quot;64\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;9mR7YrU1p4Kd-DwnpqKB-22\&quot; value=\&quot;DC03\&quot; style=\&quot;image;aspect=fixed;html=1;points=[];align=center;fontSize=12;image=img/lib/azure2/compute/Virtual_Machine.svg;\&quot; vertex=\&quot;1\&quot; parent=\&quot;1\&quot;&gt;\n          &lt;mxGeometry x=\&quot;25.5\&quot; y=\&quot;-267\&quot; width=\&quot;69\&quot; height=\&quot;64\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;9mR7YrU1p4Kd-DwnpqKB-23\&quot; value=\&quot;Domain Controllers\&quot; style=\&quot;text;html=1;align=center;verticalAlign=middle;resizable=0;points=[];autosize=1;strokeColor=none;fillColor=none;fontStyle=1\&quot; vertex=\&quot;1\&quot; parent=\&quot;1\&quot;&gt;\n          &lt;mxGeometry x=\&quot;-92.5\&quot; y=\&quot;-290\&quot; width=\&quot;130\&quot; height=\&quot;30\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;9mR7YrU1p4Kd-DwnpqKB-24\&quot; value=\&quot;\&quot; style=\&quot;endArrow=classic;html=1;rounded=0;flowAnimation=1;\&quot; edge=\&quot;1\&quot; parent=\&quot;1\&quot;&gt;\n          &lt;mxGeometry width=\&quot;50\&quot; height=\&quot;50\&quot; relative=\&quot;1\&quot; as=\&quot;geometry\&quot;&gt;\n            &lt;mxPoint x=\&quot;-36.5\&quot; y=\&quot;-106\&quot; as=\&quot;sourcePoint\&quot; /&gt;\n            &lt;mxPoint x=\&quot;-36.5\&quot; y=\&quot;-156\&quot; as=\&quot;targetPoint\&quot; /&gt;\n          &lt;/mxGeometry&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;9mR7YrU1p4Kd-DwnpqKB-25\&quot; value=\&quot;\&quot; style=\&quot;endArrow=classic;html=1;rounded=0;flowAnimation=1;\&quot; edge=\&quot;1\&quot; parent=\&quot;1\&quot;&gt;\n          &lt;mxGeometry width=\&quot;50\&quot; height=\&quot;50\&quot; relative=\&quot;1\&quot; as=\&quot;geometry\&quot;&gt;\n            &lt;mxPoint x=\&quot;-18.5\&quot; y=\&quot;-156\&quot; as=\&quot;sourcePoint\&quot; /&gt;\n            &lt;mxPoint x=\&quot;-18.5\&quot; y=\&quot;-106\&quot; as=\&quot;targetPoint\&quot; /&gt;\n          &lt;/mxGeometry&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;9mR7YrU1p4Kd-DwnpqKB-26\&quot; value=\&quot;\&quot; style=\&quot;endArrow=classic;html=1;rounded=0;flowAnimation=1;\&quot; edge=\&quot;1\&quot; parent=\&quot;1\&quot;&gt;\n          &lt;mxGeometry width=\&quot;50\&quot; height=\&quot;50\&quot; relative=\&quot;1\&quot; as=\&quot;geometry\&quot;&gt;\n            &lt;mxPoint x=\&quot;9\&quot; y=\&quot;73\&quot; as=\&quot;sourcePoint\&quot; /&gt;\n            &lt;mxPoint x=\&quot;140\&quot; y=\&quot;73\&quot; as=\&quot;targetPoint\&quot; /&gt;\n          &lt;/mxGeometry&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;9mR7YrU1p4Kd-DwnpqKB-27\&quot; value=\&quot;\&quot; style=\&quot;endArrow=classic;html=1;rounded=0;flowAnimation=1;\&quot; edge=\&quot;1\&quot; parent=\&quot;1\&quot;&gt;\n          &lt;mxGeometry width=\&quot;50\&quot; height=\&quot;50\&quot; relative=\&quot;1\&quot; as=\&quot;geometry\&quot;&gt;\n            &lt;mxPoint x=\&quot;210\&quot; y=\&quot;75.5\&quot; as=\&quot;sourcePoint\&quot; /&gt;\n            &lt;mxPoint x=\&quot;285\&quot; y=\&quot;75.5\&quot; as=\&quot;targetPoint\&quot; /&gt;\n          &lt;/mxGeometry&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;9mR7YrU1p4Kd-DwnpqKB-28\&quot; value=\&quot;1. User logs in\&quot; style=\&quot;text;html=1;align=center;verticalAlign=middle;resizable=0;points=[];autosize=1;strokeColor=none;fillColor=none;fontStyle=1\&quot; vertex=\&quot;1\&quot; parent=\&quot;1\&quot;&gt;\n          &lt;mxGeometry x=\&quot;-250\&quot; y=\&quot;40\&quot; width=\&quot;100\&quot; height=\&quot;30\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;9mR7YrU1p4Kd-DwnpqKB-29\&quot; value=\&quot;2. Authentication attempt is sent to Active Directory\&quot; style=\&quot;text;html=1;align=center;verticalAlign=middle;resizable=0;points=[];autosize=1;strokeColor=none;fillColor=none;fontStyle=1\&quot; vertex=\&quot;1\&quot; parent=\&quot;1\&quot;&gt;\n          &lt;mxGeometry x=\&quot;-370.5\&quot; y=\&quot;-80\&quot; width=\&quot;290\&quot; height=\&quot;30\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;9mR7YrU1p4Kd-DwnpqKB-30\&quot; value=\&quot;\&quot; style=\&quot;sketch=0;html=1;aspect=fixed;strokeColor=none;shadow=0;align=center;fillColor=#2D9C5E;verticalAlign=top;labelPosition=center;verticalLabelPosition=bottom;shape=mxgraph.gcp2.check\&quot; vertex=\&quot;1\&quot; parent=\&quot;1\&quot;&gt;\n          &lt;mxGeometry x=\&quot;-10\&quot; y=\&quot;-140\&quot; width=\&quot;25\&quot; height=\&quot;20\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;9mR7YrU1p4Kd-DwnpqKB-31\&quot; value=\&quot;3. User is authenticated successfully\&quot; style=\&quot;text;html=1;align=center;verticalAlign=middle;resizable=0;points=[];autosize=1;strokeColor=none;fillColor=none;fontStyle=1\&quot; vertex=\&quot;1\&quot; parent=\&quot;1\&quot;&gt;\n          &lt;mxGeometry x=\&quot;20.5\&quot; y=\&quot;-80\&quot; width=\&quot;220\&quot; height=\&quot;30\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;9mR7YrU1p4Kd-DwnpqKB-32\&quot; value=\&quot;4. User is authorized&amp;lt;div&amp;gt;through NTFS&amp;lt;/div&amp;gt;\&quot; style=\&quot;text;html=1;align=center;verticalAlign=middle;resizable=0;points=[];autosize=1;strokeColor=none;fillColor=none;fontStyle=1\&quot; vertex=\&quot;1\&quot; parent=\&quot;1\&quot;&gt;\n          &lt;mxGeometry x=\&quot;15\&quot; y=\&quot;35\&quot; width=\&quot;130\&quot; height=\&quot;40\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;9mR7YrU1p4Kd-DwnpqKB-33\&quot; value=\&quot;5. Profile disk is mounted\&quot; style=\&quot;text;html=1;align=center;verticalAlign=middle;resizable=0;points=[];autosize=1;strokeColor=none;fillColor=none;fontStyle=1\&quot; vertex=\&quot;1\&quot; parent=\&quot;1\&quot;&gt;\n          &lt;mxGeometry x=\&quot;-107\&quot; y=\&quot;170\&quot; width=\&quot;160\&quot; height=\&quot;30\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n      &lt;/root&gt;\n    &lt;/mxGraphModel&gt;\n  &lt;/diagram&gt;\n  &lt;diagram id=\&quot;MBvYcN8Ojx7u8KXp0AiT\&quot; name=\&quot;Cloud Only Setup\&quot;&gt;\n    &lt;mxGraphModel dx=\&quot;1616\&quot; dy=\&quot;787\&quot; grid=\&quot;1\&quot; gridSize=\&quot;10\&quot; guides=\&quot;1\&quot; tooltips=\&quot;1\&quot; connect=\&quot;1\&quot; arrows=\&quot;1\&quot; fold=\&quot;1\&quot; page=\&quot;1\&quot; pageScale=\&quot;1\&quot; pageWidth=\&quot;400\&quot; pageHeight=\&quot;156\&quot; math=\&quot;0\&quot; shadow=\&quot;0\&quot;&gt;\n      &lt;root&gt;\n        &lt;mxCell id=\&quot;0\&quot; /&gt;\n        &lt;mxCell id=\&quot;1\&quot; parent=\&quot;0\&quot; /&gt;\n        &lt;mxCell id=\&quot;I8O79UHgh5rET7-c4sSl-2\&quot; value=\&quot;Storage account\&quot; style=\&quot;image;aspect=fixed;html=1;points=[];align=center;fontSize=12;image=img/lib/azure2/storage/Storage_Accounts.svg;\&quot; vertex=\&quot;1\&quot; parent=\&quot;1\&quot;&gt;\n          &lt;mxGeometry x=\&quot;235\&quot; y=\&quot;-40.5\&quot; width=\&quot;65\&quot; height=\&quot;52\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;I8O79UHgh5rET7-c4sSl-3\&quot; value=\&quot;Session host\&quot; style=\&quot;image;aspect=fixed;html=1;points=[];align=center;fontSize=12;image=img/lib/azure2/compute/Virtual_Machine.svg;\&quot; vertex=\&quot;1\&quot; parent=\&quot;1\&quot;&gt;\n          &lt;mxGeometry x=\&quot;-300\&quot; y=\&quot;-36\&quot; width=\&quot;69\&quot; height=\&quot;64\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;I8O79UHgh5rET7-c4sSl-4\&quot; value=\&quot;fslogix-profiles\&quot; style=\&quot;sketch=0;aspect=fixed;pointerEvents=1;shadow=0;dashed=0;html=1;strokeColor=none;labelPosition=center;verticalLabelPosition=bottom;verticalAlign=top;align=center;fillColor=light-dark(#7088ff, #bfd3ff);shape=mxgraph.mscae.enterprise.shared_folder\&quot; vertex=\&quot;1\&quot; parent=\&quot;1\&quot;&gt;\n          &lt;mxGeometry x=\&quot;400\&quot; y=\&quot;-39.5\&quot; width=\&quot;43\&quot; height=\&quot;50\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;I8O79UHgh5rET7-c4sSl-5\&quot; value=\&quot;userprofile.vhdx\&quot; style=\&quot;image;aspect=fixed;html=1;points=[];align=center;fontSize=12;image=img/lib/azure2/compute/Disks.svg;\&quot; vertex=\&quot;1\&quot; parent=\&quot;1\&quot;&gt;\n          &lt;mxGeometry x=\&quot;540\&quot; y=\&quot;-36.5\&quot; width=\&quot;50.89\&quot; height=\&quot;50\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;I8O79UHgh5rET7-c4sSl-6\&quot; value=\&quot;\&quot; style=\&quot;endArrow=classic;html=1;rounded=0;flowAnimation=1;\&quot; edge=\&quot;1\&quot; parent=\&quot;1\&quot;&gt;\n          &lt;mxGeometry width=\&quot;50\&quot; height=\&quot;50\&quot; relative=\&quot;1\&quot; as=\&quot;geometry\&quot;&gt;\n            &lt;mxPoint x=\&quot;566\&quot; y=\&quot;40\&quot; as=\&quot;sourcePoint\&quot; /&gt;\n            &lt;mxPoint x=\&quot;-266\&quot; y=\&quot;50\&quot; as=\&quot;targetPoint\&quot; /&gt;\n            &lt;Array as=\&quot;points\&quot;&gt;\n              &lt;mxPoint x=\&quot;566\&quot; y=\&quot;94\&quot; /&gt;\n              &lt;mxPoint x=\&quot;150\&quot; y=\&quot;94\&quot; /&gt;\n              &lt;mxPoint x=\&quot;-266\&quot; y=\&quot;94\&quot; /&gt;\n            &lt;/Array&gt;\n          &lt;/mxGeometry&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;I8O79UHgh5rET7-c4sSl-7\&quot; value=\&quot;\&quot; style=\&quot;endArrow=classic;html=1;rounded=0;flowAnimation=1;\&quot; edge=\&quot;1\&quot; parent=\&quot;1\&quot;&gt;\n          &lt;mxGeometry width=\&quot;50\&quot; height=\&quot;50\&quot; relative=\&quot;1\&quot; as=\&quot;geometry\&quot;&gt;\n            &lt;mxPoint x=\&quot;-220\&quot; y=\&quot;-36.18\&quot; as=\&quot;sourcePoint\&quot; /&gt;\n            &lt;mxPoint x=\&quot;30\&quot; y=\&quot;-36.18\&quot; as=\&quot;targetPoint\&quot; /&gt;\n          &lt;/mxGeometry&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;I8O79UHgh5rET7-c4sSl-8\&quot; value=\&quot;\&quot; style=\&quot;verticalLabelPosition=bottom;html=1;verticalAlign=top;align=center;strokeColor=none;fillColor=#00BEF2;shape=mxgraph.azure.user;\&quot; vertex=\&quot;1\&quot; parent=\&quot;1\&quot;&gt;\n          &lt;mxGeometry x=\&quot;-289.25\&quot; y=\&quot;-90\&quot; width=\&quot;47.5\&quot; height=\&quot;50\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;I8O79UHgh5rET7-c4sSl-19\&quot; value=\&quot;\&quot; style=\&quot;endArrow=classic;html=1;rounded=0;flowAnimation=1;\&quot; edge=\&quot;1\&quot; parent=\&quot;1\&quot;&gt;\n          &lt;mxGeometry width=\&quot;50\&quot; height=\&quot;50\&quot; relative=\&quot;1\&quot; as=\&quot;geometry\&quot;&gt;\n            &lt;mxPoint x=\&quot;460\&quot; y=\&quot;-12\&quot; as=\&quot;sourcePoint\&quot; /&gt;\n            &lt;mxPoint x=\&quot;535\&quot; y=\&quot;-12\&quot; as=\&quot;targetPoint\&quot; /&gt;\n          &lt;/mxGeometry&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;I8O79UHgh5rET7-c4sSl-20\&quot; value=\&quot;1. User logs in\&quot; style=\&quot;text;html=1;align=center;verticalAlign=middle;resizable=0;points=[];autosize=1;strokeColor=none;fillColor=none;fontStyle=1\&quot; vertex=\&quot;1\&quot; parent=\&quot;1\&quot;&gt;\n          &lt;mxGeometry x=\&quot;-150\&quot; y=\&quot;-66.18\&quot; width=\&quot;100\&quot; height=\&quot;30\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;I8O79UHgh5rET7-c4sSl-25\&quot; value=\&quot;5. Profile disk is mounted\&quot; style=\&quot;text;html=1;align=center;verticalAlign=middle;resizable=0;points=[];autosize=1;strokeColor=none;fillColor=none;fontStyle=1\&quot; vertex=\&quot;1\&quot; parent=\&quot;1\&quot;&gt;\n          &lt;mxGeometry x=\&quot;75\&quot; y=\&quot;94\&quot; width=\&quot;160\&quot; height=\&quot;30\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;I8O79UHgh5rET7-c4sSl-26\&quot; value=\&quot;Entra ID\&quot; style=\&quot;shape=image;verticalLabelPosition=bottom;labelBackgroundColor=default;verticalAlign=top;aspect=fixed;imageAspect=0;image=https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Microsoft_Entra_ID_color_icon.svg/2048px-Microsoft_Entra_ID_color_icon.svg.png;\&quot; vertex=\&quot;1\&quot; parent=\&quot;1\&quot;&gt;\n          &lt;mxGeometry x=\&quot;35\&quot; y=\&quot;-78\&quot; width=\&quot;70\&quot; height=\&quot;70\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;I8O79UHgh5rET7-c4sSl-28\&quot; value=\&quot;2. User is authenticated successfully\&quot; style=\&quot;text;html=1;align=center;verticalAlign=middle;resizable=0;points=[];autosize=1;strokeColor=none;fillColor=none;fontStyle=1\&quot; vertex=\&quot;1\&quot; parent=\&quot;1\&quot;&gt;\n          &lt;mxGeometry x=\&quot;-200\&quot; y=\&quot;-28\&quot; width=\&quot;220\&quot; height=\&quot;30\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;0-JxYI6A8gHYjIfGkcxg-2\&quot; value=\&quot;\&quot; style=\&quot;endArrow=classic;html=1;rounded=0;flowAnimation=1;\&quot; edge=\&quot;1\&quot; parent=\&quot;1\&quot;&gt;\n          &lt;mxGeometry width=\&quot;50\&quot; height=\&quot;50\&quot; relative=\&quot;1\&quot; as=\&quot;geometry\&quot;&gt;\n            &lt;mxPoint x=\&quot;25\&quot; y=\&quot;-25.999999999999993\&quot; as=\&quot;sourcePoint\&quot; /&gt;\n            &lt;mxPoint x=\&quot;-225\&quot; y=\&quot;-25.999999999999993\&quot; as=\&quot;targetPoint\&quot; /&gt;\n          &lt;/mxGeometry&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;0-JxYI6A8gHYjIfGkcxg-3\&quot; value=\&quot;\&quot; style=\&quot;endArrow=classic;html=1;rounded=0;flowAnimation=1;\&quot; edge=\&quot;1\&quot; parent=\&quot;1\&quot; target=\&quot;I8O79UHgh5rET7-c4sSl-2\&quot;&gt;\n          &lt;mxGeometry width=\&quot;50\&quot; height=\&quot;50\&quot; relative=\&quot;1\&quot; as=\&quot;geometry\&quot;&gt;\n            &lt;mxPoint x=\&quot;-230\&quot; y=\&quot;4\&quot; as=\&quot;sourcePoint\&quot; /&gt;\n            &lt;mxPoint x=\&quot;180\&quot; y=\&quot;24\&quot; as=\&quot;targetPoint\&quot; /&gt;\n            &lt;Array as=\&quot;points\&quot;&gt;\n              &lt;mxPoint x=\&quot;-120\&quot; y=\&quot;24\&quot; /&gt;\n              &lt;mxPoint x=\&quot;170\&quot; y=\&quot;24\&quot; /&gt;\n            &lt;/Array&gt;\n          &lt;/mxGeometry&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;0-JxYI6A8gHYjIfGkcxg-4\&quot; value=\&quot;3. Session host uses storage account access key\&quot; style=\&quot;text;html=1;align=center;verticalAlign=middle;resizable=0;points=[];autosize=1;strokeColor=none;fillColor=none;fontStyle=1;rotation=0;\&quot; vertex=\&quot;1\&quot; parent=\&quot;1\&quot;&gt;\n          &lt;mxGeometry x=\&quot;-130\&quot; y=\&quot;28\&quot; width=\&quot;290\&quot; height=\&quot;30\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;0-JxYI6A8gHYjIfGkcxg-5\&quot; value=\&quot;\&quot; style=\&quot;endArrow=classic;html=1;rounded=0;flowAnimation=1;\&quot; edge=\&quot;1\&quot; parent=\&quot;1\&quot;&gt;\n          &lt;mxGeometry width=\&quot;50\&quot; height=\&quot;50\&quot; relative=\&quot;1\&quot; as=\&quot;geometry\&quot;&gt;\n            &lt;mxPoint x=\&quot;310\&quot; y=\&quot;-13.590000000000003\&quot; as=\&quot;sourcePoint\&quot; /&gt;\n            &lt;mxPoint x=\&quot;385\&quot; y=\&quot;-13.590000000000003\&quot; as=\&quot;targetPoint\&quot; /&gt;\n          &lt;/mxGeometry&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;0-JxYI6A8gHYjIfGkcxg-6\&quot; value=\&quot;4. Session host has correct storage account key\&quot; style=\&quot;text;html=1;align=center;verticalAlign=middle;resizable=0;points=[];autosize=1;strokeColor=none;fillColor=none;fontStyle=1\&quot; vertex=\&quot;1\&quot; parent=\&quot;1\&quot;&gt;\n          &lt;mxGeometry x=\&quot;280\&quot; y=\&quot;-78\&quot; width=\&quot;280\&quot; height=\&quot;30\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n      &lt;/root&gt;\n    &lt;/mxGraphModel&gt;\n  &lt;/diagram&gt;\n&lt;/mxfile&gt;\n&quot;}"></div>
<script type="text/javascript" src="https://viewer.diagrams.net/js/viewer-static.min.js"></script>

- The session host has full control over all user disks, not locked down to user1 only access to disk of user1 etc.
- The storage account access key is saved in the machine and does not rotate periodically



However, we want to learn something so we are still going to configure this cloud only setup. But take great care when bringing this into production.

---

## Step 1: Resources and Hostpool

My environment looks like this before the guide. I already have created the needed resources to perform the tasks:

So I created the hostpool, a network, the workspace and a demo VM to test this configuration with.

The hostpool must be an Entra ID joined hostpool, which you can configure at the creation wizard of the hostpool:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/pooled-azure-virtual-desktop-with-azure-ad-users-1947/jv-media-1947-44beae2aa00a.png)

I also highly recommend using the "Enroll VM with Intune" option so we can manage the session hosts with Intune, as we don't have Group Policies in this cloud only setup.

---

## Step 2: Create a test user and assign roles

The cloud only setup need different role assignments and we will create a test user and assign him one of these roles:

- **Virtual Machine User Login** on all session hosts -> Resource group
  - For default, non administrative users
- **Virtual Machine Administrator Login** on all session hosts -> Resource group
  - For administrative users

In addition, our test user must have access to the Desktop application group in the Azure Virtual Desktop hostpool.

In this case, we are going to create our test user and assign him the default, non administrative role:

Now that the user is created, go to the Azure Portal, and then to the resource group where your session hosts lives:

Click on "+ Add" and then on "add role assignment":

Then click on "Next" and under "User, group or service principal" select your user or user group:

Click on "Review + assign" to assign the role to your users.

This is an great example of why we place our resources in different resource groups. These users can login into every virtual machine in this resource group. By placing only the correct virtual machines in this resource group, the access is limited.

Now we navigate to our Hostpool to give our user access to the desktops.

Go to "Application Groups", and then to our Hostpool DAG:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/pooled-azure-virtual-desktop-with-azure-ad-users-1947/jv-media-1947-ff00e0e18dda.png)

Click on "+ Add" to add our user or user group here:

Select your user or group here and save. The user/group is now allowed to logon to the hostpool and get the workspace in the Windows App.

---

## Step 3: Create a dynamic group for session hosts (optional)

{{% alert color="info" %}}
Using dynamic groups require a Microsoft Entra Premium P1 tenant. If you don't have this license, you can use an assigned group instead.
{{% /alert %}}

Before we can configure the session hosts in Microsoft Intune, we need to have a group for all our session hosts. I really like the use of dynamic group for this sort of configurations, because the settings will be automatically done. Otherwise we configure a new session host in about 3 months later and forget about the group assignment.

Go to Microsoft Entra and then to groups:

Create a new "Dynamic Device" security group and add the following query:

{{< card code=true header="**V**" lang="v" >}}
(device.displayName -startsWith "jv-vm-avd") and (device.deviceModel -eq "Virtual Machine") and (device.managementType -eq "MDM")
{{< /card >}}

This ensures no other device comes into the group by accident or by a wrong name. Only Virtual Machines starting with this name and managed by Intune will join the group.

This looks like this:

Validate your rule by testing these rules on the "Validate Rules" tab:

Now we are 100% sure our session host will join the group automatically but a Windows 11 laptop for example not.

---

## Step 4: Configure FSLogix

We can now configure FSLogix in Intune. I do this by using configuration profiles from settings catalogs. These are easy to configure and can be imported and exported. Therefore I added a download link for you:

[Download FSLogix configuration template](https://github.com/JustinVerstijnen/AVDCloudOnlyFSLogix)

{{% alert color="info" %}}
If you choose to download the FSLogix configuration template, you need to change the VHD location to your own storage account and share name.
{{% /alert %}}

To configure this manually create a new configuration template from scratch for Windows 10 and higher and use the "Settings catalog"

Give the profile a name and description and advance.

Click on "Add settings" and navigate to the FSLogix policy settings.

### Profile Container settings

Under FSLogix -> Profile Containers, select the following settings, enable them and configure them:

|  |  |
| --- | --- |
| **Setting name** | **Value** |
| Access Network as Computer Object | Enabled |
| Delete Local Profile When VHD Should Apply | Enabled |
| Enabled | Enabled |
| Is Dynamic (VHD) | Enabled |
| Keep Local Directory (after logoff) | Enabled |
| Prevent Login With Failure | Enabled |
| Roam Identity | Enabled |
| Roam Search | Disabled |
| VHD Locations | Your storage account and share in UNC. Mine is here:      \\sajvavdcloudonly.file.core.windows.net\fslogix-profiles |

### Container naming settings

Under FSLogix -> Profile Containers -> Container and Directory Naming, select the following settings, enable them and configure them:

|  |  |
| --- | --- |
| **Setting name** | **Value** |
| No Profile Containing Folder | Enable |
| VHD Name Match | %username% |
| VHD Name Pattern | %username% |
| Volume Type (VHD or VHDX) | VHDX |

You can defer from this configuration to fit your needs, this is purely how I configured FSLogix.

After configuring the settings, advance to the "Assignments" tab:

Select your group here as "Included group" and save.

---

## Step 5: Create Powershell script for connection to Storage account

We now have to create a Powershell script to connect the session hosts to our storage account and share. This is to automate this task and for each session host in the future you add that it works right out of the box.

In this script, there is an credential created to access the storage account, an registery key to enable the credential in the profile and an additional registery key if you use Windows 11 22H2 to make it work.

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
# PARAMETERS
# Change these 3 settings to your own settings

# Storage account FQDN
$fileServer = "yourstorageaccounthere.file.core.windows.net"

# Share name
$profilesharename = "yoursharehere"

# Storage access key 1 or 2
$storageaccesskey = "yourkeyhere"

# END PARAMETERS

# Don't change anything under this line ---------------------------------

# Formatting user input to script
$profileShare="\\$($fileServer)\$profilesharename"
$fileServerShort = $fileServer.Split('.')[0]
$user="localhost\$fileServerShort"

# Insert credentials in profile
New-Item -Path "HKLM:\Software\Policies\Microsoft" -Name "AzureADAccount" -ErrorAction Ignore
New-ItemProperty -Path "HKLM:\Software\Policies\Microsoft\AzureADAccount" -Name "LoadCredKeyFromProfile" -Value 1 -force

# Create the credentials for the storage account
cmdkey.exe /add:$fileServer /user:$($user) /pass:$($storageaccesskey)
New-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\Lsa" -Name "LsaCfgFlags" -Value 0 -force
{{< /card >}}

Change the information on line 5, 8 and 11 and save the script as .ps1 file or download it here:

[Download Cloud Only Powershell script](https://github.com/JustinVerstijnen/AVDCloudOnlyFSLogix)

You can find the information for line 5 and 11 in the Azure Portal by going to your Storage Account, and then "Access Keys":

For line 8, you can go to Data Storage -> File Shares:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/pooled-azure-virtual-desktop-with-azure-ad-users-1947/jv-media-1947-bd668f70132f.png)

If you don't have a fileshare yet, this is the time to create one.

Paste this information in the script and save the script. It should look like this:

Go to Intune and navigate to the "Scripts and Remediations" and then to the tab "Platform scripts". Then add a new script:

Give the script a name and description and advance.

Select the script and change the options shown in the image and as follows:

- **Run this script using the logged on credentials:** No
  - This runs the script as system account
- **Enforce script signature check:** No
- **Run script in 64 bit PowerShell Host:** Yes

Advance to the "Assignments" tab:

Select your session hosts dynamic group and save the script:

---

## Step 6: Let's test the result!

Now we are done with all of the setups and we can test our configuration. The session host must be restarted and fully synced before we can login. We can check the status in Intune under our Configuration Profile and Powershell Script.

Configuration Profile:

PowerShell script: (This took about 30 minutes to sync into the Intune portal)

Now that we know for sure everything is fully synchronized and performed, let's download the new Windows App to connect to our hostpool.

After connecting we can see the session host indeed uses FSLogix to mount the profile to Windows:

Also we can find a new file in the FSLogix folder on the Azure Storage Account:

We have now successfully configured the Cloud only setup for Azure Virtual Desktop.

---

## Testing the session host and security

We can test navigating to the Azure Storage account from the session host, we will get this error:

This is because we try it through the context of the user which doesn't have access. So users cannot navigate to the fileshare of FSLogix because only our session host has access as system.

This means that you can only navigate to the fileshare on the PC when having local administrator permissions on the session host. This because a local administrator can traverse the SYSTEM account and navigate to the fileshare. However, local administrator permissions is something you don't give to end users, so in this case it's safe.

I tried several things to find the storage access key on the machine in registry and cmdkey commands but no success. It is secured enough but it is still a security concern.

---

## Security recommendations for session hosts

I have some security recommendations for session hosts, not only for this cloud only setup but in general:

- Use Microsoft Defender for Endpoint
- Use the firewall on your Storage account so it can only be accessed from your session hosts' subnet
- Block critical Windows tools like CMD/Powershell/Scripts/Control panel and access to power off/reboot in the VM

---

## Summary

While this cloud only setup is very great, there are also some security risks that come with it. I really like to use as much serverless options as possible but for production environments, I still would recommend to use an Active Directory or take a look at personal desktop options. Also, Windows 365 might still be a great option if you want to eliminate Active Directory but still use modern desktops.

Please use the Powershell script very carefully, this contains the credentials to full controll access to the storage account. Upload to Intune and delete from your computer or save it and remove the key.

I hope this guide was very helpful and thank you for reading!

### Sources

These sources helped me by writing and research for this post;

1. <https://learn.microsoft.com/en-us/azure/virtual-desktop/authentication>
2. <https://learn.microsoft.com/en-us/azure/virtual-desktop/configure-single-sign-on>

{{< ads >}}

{{< article-footer >}}
