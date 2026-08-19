---
title: "ARM templates deployment via URL"
slug: "arm-templates-deployment-via-url"
date: 2026-09-28
tags:
- Step by Step guides
- Knowledge check
categories:
- Microsoft Azure
description: "In this post I will show you how to deploy ARM templates directly from a public URL, how to create a Deploy to Azure button, and why converting Bicep to ARM JSON is the easy part."
---

Some time ago, I [s](https://justinverstijnen.nl/arm-templates-and-azure-vm-script-deployment/)[pent some time on ARM templates](https://justinverstijnen.nl/arm-templates-and-azure-vm-script-deployment/) and creating them through the portal and then redeploying them to save time. As I need to test some things very often for blog posts, for example updates for FSLogix and AVD, I needed a way to deploy some resources into Azure much faster. Here I want to save much of the clickwork and actually have more time on to the tesing and research themselves. Therefore, we will create template for these buttons:

<a href="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FJustinVerstijnen%2FAzureDeploymentTemplates%2Frefs%2Fheads%2Fmain%2Fazurevirtualdesktopkerberos%2Fmain.json" target="_blank" rel="noopener noreferrer"><img src="https://aka.ms/deploytoazurebutton" alt="Deploy to Azure" /></a>

After some testing and successfully be able to deploy different ARM templates, I dived even deeper in this world and was able to deploy them through a URI. This gave me inspiration to make my own gallery of ARM templates for fast deployment. It works like, you go to the URL, click on the Deploy to Azure button and you will be redirected to Azure and make minor customizations before deploying it into your environment.

In this guide, I will explain how this actually works and how you could setup this yourself.

<a class="btn btn-primary" href="https://tools.justinverstijnen.nl/azuredeploymenttemplates/" target="_blank" rel="noreferrer">Visit Deployment Templates gallery</a>

[![tool-azuredeploymenttemplates.jpg](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/tools-2375/tool-azuredeploymenttemplates.jpg)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/tools-2375/tool-azuredeploymenttemplates.jpg)

---

## Requirements

For this method you need the following:

- An Azure subscription
- Basic to Moderate knowledge of ARM
- A GitHub account or alternative public way of hosting JSON files
- An existing Bicep template is great

---

## How ARM templates work

As Azure has Azure Resource Manager which can build its resources from a JSON file. We can say that the JSON file is a recipe/cookbook which we pass to Azure Resource Manager and he will build the environment based on our cookbook. If we have a correct template, this saves us a lot of time clicking through the portal and deploying the resources by hand. Also we cannot forget some crucial settings and saves us a lot of time, and can help us if we need to deploy a specific resource/setup into multiple environments.

<!-- draw.io diagram -->
<div class="drawio-white-background" style="background:#ffffff; padding:24px; border-radius:12px; overflow-x:auto;">
<div class="mxgraph" style="max-width:100%;border:1px solid transparent;" data-mxgraph="{&quot;highlight&quot;:&quot;#0000ff&quot;,&quot;nav&quot;:true,&quot;resize&quot;:true,&quot;dark-mode&quot;:&quot;auto&quot;,&quot;toolbar&quot;:&quot;zoom layers tags lightbox&quot;,&quot;xml&quot;:&quot;&lt;mxfile host=\&quot;app.diagrams.net\&quot; agent=\&quot;Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36 Edg/150.0.0.0\&quot; version=\&quot;28.2.5\&quot;&gt;\n  &lt;diagram id=\&quot;azure-arm-flowchart\&quot; name=\&quot;Azure ARM Flowchart\&quot;&gt;\n    &lt;mxGraphModel dx=\&quot;2940\&quot; dy=\&quot;1580\&quot; grid=\&quot;1\&quot; gridSize=\&quot;10\&quot; guides=\&quot;1\&quot; tooltips=\&quot;1\&quot; connect=\&quot;1\&quot; arrows=\&quot;1\&quot; fold=\&quot;1\&quot; page=\&quot;1\&quot; pageScale=\&quot;1\&quot; pageWidth=\&quot;2400\&quot; pageHeight=\&quot;800\&quot; background=\&quot;#FFFFFF\&quot; math=\&quot;0\&quot; shadow=\&quot;0\&quot;&gt;\n      &lt;root&gt;\n        &lt;mxCell id=\&quot;0\&quot; /&gt;\n        &lt;mxCell id=\&quot;1\&quot; parent=\&quot;0\&quot; /&gt;\n        &lt;mxCell id=\&quot;card1\&quot; value=\&quot;\&quot; style=\&quot;rounded=1;whiteSpace=wrap;html=1;arcSize=12;fillColor=#F4FAFF;strokeColor=#0078D4;strokeWidth=3;shadow=1;\&quot; parent=\&quot;1\&quot; vertex=\&quot;1\&quot;&gt;\n          &lt;mxGeometry x=\&quot;10\&quot; y=\&quot;10\&quot; width=\&quot;300\&quot; height=\&quot;280\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;n1\&quot; value=\&quot;1\&quot; style=\&quot;text;html=1;strokeColor=none;fillColor=none;fontSize=42;fontStyle=1;fontColor=#0078D4;align=center;verticalAlign=middle;\&quot; parent=\&quot;card1\&quot; vertex=\&quot;1\&quot;&gt;\n          &lt;mxGeometry y=\&quot;20\&quot; width=\&quot;300\&quot; height=\&quot;55\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;label1\&quot; value=\&quot;Create JSON file\&quot; style=\&quot;text;html=1;strokeColor=none;fillColor=none;fontSize=20;fontStyle=1;fontColor=#0F172A;align=center;verticalAlign=middle;whiteSpace=wrap;\&quot; parent=\&quot;card1\&quot; vertex=\&quot;1\&quot;&gt;\n          &lt;mxGeometry x=\&quot;10\&quot; y=\&quot;222\&quot; width=\&quot;280\&quot; height=\&quot;40\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;doc1\&quot; value=\&quot;{ }\&quot; style=\&quot;shape=note;whiteSpace=wrap;html=1;backgroundOutline=1;darkOpacity=0.05;size=25;fillColor=#EAF4FF;strokeColor=#0078D4;strokeWidth=2;fontSize=28;fontStyle=1;fontColor=#0078D4;align=center;verticalAlign=middle;\&quot; parent=\&quot;card1\&quot; vertex=\&quot;1\&quot;&gt;\n          &lt;mxGeometry x=\&quot;110\&quot; y=\&quot;100\&quot; width=\&quot;80\&quot; height=\&quot;78\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;card2\&quot; value=\&quot;\&quot; style=\&quot;rounded=1;whiteSpace=wrap;html=1;arcSize=12;fillColor=#F4FAFF;strokeColor=#0078D4;strokeWidth=3;shadow=1;\&quot; parent=\&quot;1\&quot; vertex=\&quot;1\&quot;&gt;\n          &lt;mxGeometry x=\&quot;380\&quot; y=\&quot;10\&quot; width=\&quot;300\&quot; height=\&quot;280\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;n2\&quot; value=\&quot;2\&quot; style=\&quot;text;html=1;strokeColor=none;fillColor=none;fontSize=42;fontStyle=1;fontColor=#0078D4;align=center;verticalAlign=middle;\&quot; parent=\&quot;card2\&quot; vertex=\&quot;1\&quot;&gt;\n          &lt;mxGeometry y=\&quot;20\&quot; width=\&quot;300\&quot; height=\&quot;55\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;label2\&quot; value=\&quot;Host JSON file\&quot; style=\&quot;text;html=1;strokeColor=none;fillColor=none;fontSize=20;fontStyle=1;fontColor=#0F172A;align=center;verticalAlign=middle;whiteSpace=wrap;\&quot; parent=\&quot;card2\&quot; vertex=\&quot;1\&quot;&gt;\n          &lt;mxGeometry x=\&quot;10\&quot; y=\&quot;222\&quot; width=\&quot;280\&quot; height=\&quot;40\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;cloud2\&quot; value=\&quot;\&quot; style=\&quot;shape=cloud;whiteSpace=wrap;html=1;fillColor=#EAF4FF;strokeColor=#0078D4;strokeWidth=2;\&quot; parent=\&quot;card2\&quot; vertex=\&quot;1\&quot;&gt;\n          &lt;mxGeometry x=\&quot;80\&quot; y=\&quot;105\&quot; width=\&quot;140\&quot; height=\&quot;70\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;server2\&quot; value=\&quot;\&quot; style=\&quot;rounded=1;whiteSpace=wrap;html=1;arcSize=8;fillColor=#BFE4FF;strokeColor=#0078D4;strokeWidth=2;\&quot; parent=\&quot;card2\&quot; vertex=\&quot;1\&quot;&gt;\n          &lt;mxGeometry x=\&quot;120\&quot; y=\&quot;138\&quot; width=\&quot;60\&quot; height=\&quot;52\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;server2line1\&quot; value=\&quot;\&quot; style=\&quot;shape=line;html=1;strokeColor=#0078D4;strokeWidth=2;\&quot; parent=\&quot;card2\&quot; vertex=\&quot;1\&quot;&gt;\n          &lt;mxGeometry x=\&quot;131\&quot; y=\&quot;154\&quot; width=\&quot;38\&quot; height=\&quot;1\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;server2line2\&quot; value=\&quot;\&quot; style=\&quot;shape=line;html=1;strokeColor=#0078D4;strokeWidth=2;\&quot; parent=\&quot;card2\&quot; vertex=\&quot;1\&quot;&gt;\n          &lt;mxGeometry x=\&quot;131\&quot; y=\&quot;168\&quot; width=\&quot;38\&quot; height=\&quot;1\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;card3\&quot; value=\&quot;\&quot; style=\&quot;rounded=1;whiteSpace=wrap;html=1;arcSize=12;fillColor=#F4FAFF;strokeColor=#0078D4;strokeWidth=3;shadow=1;\&quot; parent=\&quot;1\&quot; vertex=\&quot;1\&quot;&gt;\n          &lt;mxGeometry x=\&quot;750\&quot; y=\&quot;10\&quot; width=\&quot;300\&quot; height=\&quot;280\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;n3\&quot; value=\&quot;3\&quot; style=\&quot;text;html=1;strokeColor=none;fillColor=none;fontSize=42;fontStyle=1;fontColor=#0078D4;align=center;verticalAlign=middle;\&quot; parent=\&quot;card3\&quot; vertex=\&quot;1\&quot;&gt;\n          &lt;mxGeometry y=\&quot;20\&quot; width=\&quot;300\&quot; height=\&quot;55\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;label3\&quot; value=\&quot;Pass JSON to ARM\&quot; style=\&quot;text;html=1;strokeColor=none;fillColor=none;fontSize=20;fontStyle=1;fontColor=#0F172A;align=center;verticalAlign=middle;whiteSpace=wrap;\&quot; parent=\&quot;card3\&quot; vertex=\&quot;1\&quot;&gt;\n          &lt;mxGeometry x=\&quot;10\&quot; y=\&quot;222\&quot; width=\&quot;280\&quot; height=\&quot;40\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;cloud3\&quot; value=\&quot;\&quot; style=\&quot;shape=cloud;whiteSpace=wrap;html=1;fillColor=#EAF4FF;strokeColor=#0078D4;strokeWidth=2;\&quot; parent=\&quot;card3\&quot; vertex=\&quot;1\&quot;&gt;\n          &lt;mxGeometry x=\&quot;70\&quot; y=\&quot;105\&quot; width=\&quot;160\&quot; height=\&quot;75\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;azureA3\&quot; value=\&quot;A\&quot; style=\&quot;text;html=1;strokeColor=none;fillColor=none;fontSize=44;fontStyle=1;fontColor=#0078D4;align=center;verticalAlign=middle;\&quot; parent=\&quot;card3\&quot; vertex=\&quot;1\&quot;&gt;\n          &lt;mxGeometry x=\&quot;120\&quot; y=\&quot;116\&quot; width=\&quot;60\&quot; height=\&quot;50\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;card4\&quot; value=\&quot;\&quot; style=\&quot;rounded=1;whiteSpace=wrap;html=1;arcSize=12;fillColor=#F4FAFF;strokeColor=#0078D4;strokeWidth=3;shadow=1;\&quot; parent=\&quot;1\&quot; vertex=\&quot;1\&quot;&gt;\n          &lt;mxGeometry x=\&quot;1120\&quot; y=\&quot;10\&quot; width=\&quot;300\&quot; height=\&quot;280\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;n4\&quot; value=\&quot;4\&quot; style=\&quot;text;html=1;strokeColor=none;fillColor=none;fontSize=42;fontStyle=1;fontColor=#0078D4;align=center;verticalAlign=middle;\&quot; parent=\&quot;card4\&quot; vertex=\&quot;1\&quot;&gt;\n          &lt;mxGeometry y=\&quot;20\&quot; width=\&quot;300\&quot; height=\&quot;55\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;label4\&quot; value=\&quot;Customize\&quot; style=\&quot;text;html=1;strokeColor=none;fillColor=none;fontSize=20;fontStyle=1;fontColor=#0F172A;align=center;verticalAlign=middle;whiteSpace=wrap;\&quot; parent=\&quot;card4\&quot; vertex=\&quot;1\&quot;&gt;\n          &lt;mxGeometry x=\&quot;10\&quot; y=\&quot;222\&quot; width=\&quot;280\&quot; height=\&quot;40\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;gear4\&quot; value=\&quot;⚙\&quot; style=\&quot;ellipse;whiteSpace=wrap;html=1;fillColor=#BFE4FF;strokeColor=#0078D4;strokeWidth=2;fontSize=50;fontColor=#0078D4;align=center;verticalAlign=middle;\&quot; parent=\&quot;card4\&quot; vertex=\&quot;1\&quot;&gt;\n          &lt;mxGeometry x=\&quot;103\&quot; y=\&quot;102\&quot; width=\&quot;94\&quot; height=\&quot;94\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;wrench4\&quot; value=\&quot;⌕\&quot; style=\&quot;text;html=1;strokeColor=none;fillColor=none;fontSize=28;fontStyle=1;fontColor=#0078D4;align=center;verticalAlign=middle;rotation=45;\&quot; parent=\&quot;card4\&quot; vertex=\&quot;1\&quot;&gt;\n          &lt;mxGeometry x=\&quot;145\&quot; y=\&quot;140\&quot; width=\&quot;48\&quot; height=\&quot;48\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;card5\&quot; value=\&quot;\&quot; style=\&quot;rounded=1;whiteSpace=wrap;html=1;arcSize=12;fillColor=#F4FAFF;strokeColor=#0078D4;strokeWidth=3;shadow=1;\&quot; parent=\&quot;1\&quot; vertex=\&quot;1\&quot;&gt;\n          &lt;mxGeometry x=\&quot;1490\&quot; y=\&quot;10\&quot; width=\&quot;300\&quot; height=\&quot;280\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;n5\&quot; value=\&quot;5\&quot; style=\&quot;text;html=1;strokeColor=none;fillColor=none;fontSize=42;fontStyle=1;fontColor=#0078D4;align=center;verticalAlign=middle;\&quot; parent=\&quot;card5\&quot; vertex=\&quot;1\&quot;&gt;\n          &lt;mxGeometry y=\&quot;20\&quot; width=\&quot;300\&quot; height=\&quot;55\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;label5\&quot; value=\&quot;Resource deployment\&quot; style=\&quot;text;html=1;strokeColor=none;fillColor=none;fontSize=20;fontStyle=1;fontColor=#0F172A;align=center;verticalAlign=middle;whiteSpace=wrap;\&quot; parent=\&quot;card5\&quot; vertex=\&quot;1\&quot;&gt;\n          &lt;mxGeometry x=\&quot;10\&quot; y=\&quot;222\&quot; width=\&quot;280\&quot; height=\&quot;40\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;cube5\&quot; value=\&quot;\&quot; style=\&quot;shape=cube;whiteSpace=wrap;html=1;boundedLbl=1;backgroundOutline=1;darkOpacity=0.05;size=15;fillColor=#BFE4FF;strokeColor=#0078D4;strokeWidth=2;\&quot; parent=\&quot;card5\&quot; vertex=\&quot;1\&quot;&gt;\n          &lt;mxGeometry x=\&quot;125\&quot; y=\&quot;80\&quot; width=\&quot;50\&quot; height=\&quot;50\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;line5v\&quot; value=\&quot;\&quot; style=\&quot;shape=line;html=1;strokeColor=#0078D4;strokeWidth=2;\&quot; parent=\&quot;card5\&quot; vertex=\&quot;1\&quot;&gt;\n          &lt;mxGeometry x=\&quot;149\&quot; y=\&quot;130\&quot; width=\&quot;1\&quot; height=\&quot;30\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;line5h\&quot; value=\&quot;\&quot; style=\&quot;shape=line;html=1;strokeColor=#0078D4;strokeWidth=2;\&quot; parent=\&quot;card5\&quot; vertex=\&quot;1\&quot;&gt;\n          &lt;mxGeometry x=\&quot;99\&quot; y=\&quot;160\&quot; width=\&quot;102\&quot; height=\&quot;1\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;sq50\&quot; value=\&quot;\&quot; style=\&quot;rounded=1;whiteSpace=wrap;html=1;arcSize=8;fillColor=#BFE4FF;strokeColor=#0078D4;strokeWidth=2;\&quot; parent=\&quot;card5\&quot; vertex=\&quot;1\&quot;&gt;\n          &lt;mxGeometry x=\&quot;86\&quot; y=\&quot;160\&quot; width=\&quot;32\&quot; height=\&quot;32\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;sq51\&quot; value=\&quot;\&quot; style=\&quot;rounded=1;whiteSpace=wrap;html=1;arcSize=8;fillColor=#BFE4FF;strokeColor=#0078D4;strokeWidth=2;\&quot; parent=\&quot;card5\&quot; vertex=\&quot;1\&quot;&gt;\n          &lt;mxGeometry x=\&quot;134\&quot; y=\&quot;160\&quot; width=\&quot;32\&quot; height=\&quot;32\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;sq52\&quot; value=\&quot;\&quot; style=\&quot;rounded=1;whiteSpace=wrap;html=1;arcSize=8;fillColor=#BFE4FF;strokeColor=#0078D4;strokeWidth=2;\&quot; parent=\&quot;card5\&quot; vertex=\&quot;1\&quot;&gt;\n          &lt;mxGeometry x=\&quot;182\&quot; y=\&quot;160\&quot; width=\&quot;32\&quot; height=\&quot;32\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;card6\&quot; value=\&quot;\&quot; style=\&quot;rounded=1;whiteSpace=wrap;html=1;arcSize=12;fillColor=#F4FAFF;strokeColor=#0078D4;strokeWidth=3;shadow=1;\&quot; parent=\&quot;1\&quot; vertex=\&quot;1\&quot;&gt;\n          &lt;mxGeometry x=\&quot;1860\&quot; y=\&quot;10\&quot; width=\&quot;300\&quot; height=\&quot;280\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;n6\&quot; value=\&quot;6\&quot; style=\&quot;text;html=1;strokeColor=none;fillColor=none;fontSize=42;fontStyle=1;fontColor=#0078D4;align=center;verticalAlign=middle;\&quot; parent=\&quot;card6\&quot; vertex=\&quot;1\&quot;&gt;\n          &lt;mxGeometry y=\&quot;20\&quot; width=\&quot;300\&quot; height=\&quot;55\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;label6\&quot; value=\&quot;Testing\&quot; style=\&quot;text;html=1;strokeColor=none;fillColor=none;fontSize=20;fontStyle=1;fontColor=#0F172A;align=center;verticalAlign=middle;whiteSpace=wrap;\&quot; parent=\&quot;card6\&quot; vertex=\&quot;1\&quot;&gt;\n          &lt;mxGeometry x=\&quot;10\&quot; y=\&quot;222\&quot; width=\&quot;280\&quot; height=\&quot;40\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;check6\&quot; value=\&quot;✓\&quot; style=\&quot;ellipse;whiteSpace=wrap;html=1;fillColor=#0078D4;strokeColor=#66BFFF;strokeWidth=3;fontSize=52;fontStyle=1;fontColor=#FFFFFF;align=center;verticalAlign=middle;\&quot; parent=\&quot;card6\&quot; vertex=\&quot;1\&quot;&gt;\n          &lt;mxGeometry x=\&quot;105\&quot; y=\&quot;105\&quot; width=\&quot;90\&quot; height=\&quot;90\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;eObMedkfIy1sSbKcw3yl-2\&quot; value=\&quot;\&quot; style=\&quot;endArrow=none;dashed=1;html=1;dashPattern=1 3;strokeWidth=6;rounded=0;flowAnimation=1;fillColor=#dae8fc;strokeColor=#6c8ebf;\&quot; edge=\&quot;1\&quot; parent=\&quot;1\&quot;&gt;\n          &lt;mxGeometry width=\&quot;50\&quot; height=\&quot;50\&quot; relative=\&quot;1\&quot; as=\&quot;geometry\&quot;&gt;\n            &lt;mxPoint x=\&quot;310\&quot; y=\&quot;149.29000000000002\&quot; as=\&quot;sourcePoint\&quot; /&gt;\n            &lt;mxPoint x=\&quot;380\&quot; y=\&quot;149\&quot; as=\&quot;targetPoint\&quot; /&gt;\n          &lt;/mxGeometry&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;eObMedkfIy1sSbKcw3yl-3\&quot; value=\&quot;\&quot; style=\&quot;endArrow=none;dashed=1;html=1;dashPattern=1 3;strokeWidth=6;rounded=0;flowAnimation=1;fillColor=#dae8fc;strokeColor=#6c8ebf;\&quot; edge=\&quot;1\&quot; parent=\&quot;1\&quot;&gt;\n          &lt;mxGeometry width=\&quot;50\&quot; height=\&quot;50\&quot; relative=\&quot;1\&quot; as=\&quot;geometry\&quot;&gt;\n            &lt;mxPoint x=\&quot;680\&quot; y=\&quot;149.58000000000004\&quot; as=\&quot;sourcePoint\&quot; /&gt;\n            &lt;mxPoint x=\&quot;750\&quot; y=\&quot;149.29000000000002\&quot; as=\&quot;targetPoint\&quot; /&gt;\n          &lt;/mxGeometry&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;eObMedkfIy1sSbKcw3yl-4\&quot; value=\&quot;\&quot; style=\&quot;endArrow=none;dashed=1;html=1;dashPattern=1 3;strokeWidth=6;rounded=0;flowAnimation=1;fillColor=#dae8fc;strokeColor=#6c8ebf;\&quot; edge=\&quot;1\&quot; parent=\&quot;1\&quot;&gt;\n          &lt;mxGeometry width=\&quot;50\&quot; height=\&quot;50\&quot; relative=\&quot;1\&quot; as=\&quot;geometry\&quot;&gt;\n            &lt;mxPoint x=\&quot;1050\&quot; y=\&quot;149.57999999999998\&quot; as=\&quot;sourcePoint\&quot; /&gt;\n            &lt;mxPoint x=\&quot;1120\&quot; y=\&quot;149.29000000000002\&quot; as=\&quot;targetPoint\&quot; /&gt;\n          &lt;/mxGeometry&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;eObMedkfIy1sSbKcw3yl-5\&quot; value=\&quot;\&quot; style=\&quot;endArrow=none;dashed=1;html=1;dashPattern=1 3;strokeWidth=6;rounded=0;flowAnimation=1;fillColor=#dae8fc;strokeColor=#6c8ebf;\&quot; edge=\&quot;1\&quot; parent=\&quot;1\&quot;&gt;\n          &lt;mxGeometry width=\&quot;50\&quot; height=\&quot;50\&quot; relative=\&quot;1\&quot; as=\&quot;geometry\&quot;&gt;\n            &lt;mxPoint x=\&quot;1420\&quot; y=\&quot;149.57999999999993\&quot; as=\&quot;sourcePoint\&quot; /&gt;\n            &lt;mxPoint x=\&quot;1490\&quot; y=\&quot;149.28999999999996\&quot; as=\&quot;targetPoint\&quot; /&gt;\n          &lt;/mxGeometry&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;eObMedkfIy1sSbKcw3yl-6\&quot; value=\&quot;\&quot; style=\&quot;endArrow=none;dashed=1;html=1;dashPattern=1 3;strokeWidth=6;rounded=0;flowAnimation=1;fillColor=#dae8fc;strokeColor=#6c8ebf;\&quot; edge=\&quot;1\&quot; parent=\&quot;1\&quot;&gt;\n          &lt;mxGeometry width=\&quot;50\&quot; height=\&quot;50\&quot; relative=\&quot;1\&quot; as=\&quot;geometry\&quot;&gt;\n            &lt;mxPoint x=\&quot;1790\&quot; y=\&quot;149.57999999999998\&quot; as=\&quot;sourcePoint\&quot; /&gt;\n            &lt;mxPoint x=\&quot;1860\&quot; y=\&quot;149.29000000000002\&quot; as=\&quot;targetPoint\&quot; /&gt;\n          &lt;/mxGeometry&gt;\n        &lt;/mxCell&gt;\n      &lt;/root&gt;\n    &lt;/mxGraphModel&gt;\n  &lt;/diagram&gt;\n&lt;/mxfile&gt;\n&quot;}"></div>
<script type="text/javascript" src="https://viewer.diagrams.net/js/viewer-static.min.js"></script>
</div>

What is also very nice is that we cannot only automate the deployment of resources, but also enabling managed identities and setting role assignments. For the example which I will demonstrate later on in this guide, I have built a demo Azure Virtual Desktop environment with variables built in to assign the correct roles to user groups.

This JSON file can be created through at least 3 ways:

- A deployment in the Portal and downloading the automation template
- Building a Bicep template which actually generates the JSON file
- Write the JSON yourself or generate a template by using Artificial Intelligence

	- Note here to test the template thoroughly before using in production

---

## Step 1: Create a JSON file

Before we can deploy any template, we must first have a JSON file which contains the cookbook for Azure Resource Manager and the instructions on what to build, what settings must be used and which name structure you want. The most easiest way to get an ARM template is by configuring a resource in the Azure Portal, and then clicking the "Download a template for automation" button below:

[![jv-media-8519-5346b0a7c45b.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/arm-templates-deployment-via-url/jv-media-8519-5346b0a7c45b.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/arm-templates-deployment-via-url/jv-media-8519-5346b0a7c45b.png)

I created a simple virtual network for the purpose of this guide. We can now view the cookbook/code itself which Azure uses:

[![jv-media-8519-5a300df83664.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/arm-templates-deployment-via-url/jv-media-8519-5a300df83664.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/arm-templates-deployment-via-url/jv-media-8519-5a300df83664.png)

This can be your ARM template to deploy on Azure, but will be really simple. If you already have a Bicep template of your deployment, then you get a JSON during building which is what ARM can build. You can then use that as your template.

[![jv-media-8519-ca518b4b4ee9.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/arm-templates-deployment-via-url/jv-media-8519-ca518b4b4ee9.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/arm-templates-deployment-via-url/jv-media-8519-ca518b4b4ee9.png)

Here I have a Bicep template for Azure Virtual Desktop I created earlier, and built the JSON file using the Bicep deployment. If you want to learn more about Bicep, [check out this guide](http://justinverstijnen.nl/getting-started-with-bicep).

---

## Step 2: Host the ARM template

We now need to host the ARM JSON file on a public location. You can use any service for this, but I will be using GitHub. Any public GitHub repository can host files publically so this is an easy way.

Create a GitHub repository and place the files into the repository.

[![jv-media-8519-eec3381be6f9.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/arm-templates-deployment-via-url/jv-media-8519-eec3381be6f9.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/arm-templates-deployment-via-url/jv-media-8519-eec3381be6f9.png)

Then click on the JSON file and click on the "Raw" button. This gives you the raw file without any HTML styles, which we could pass to Azure.

[![jv-media-8519-1e0630a8d438.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/arm-templates-deployment-via-url/jv-media-8519-1e0630a8d438.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/arm-templates-deployment-via-url/jv-media-8519-1e0630a8d438.png)

This will give you an URL like "[https://raw.githubusercontent.com/JustinVerstijnen/AzureDeploymentTemplates/refs/heads/main/azurevirtualdesktopkerberos/main.json](https://raw.githubusercontent.com/JustinVerstijnen/AzureDeploymentTemplates/refs/heads/main/azurevirtualdesktopkerberos/main.json)". That is the URL which we can pass to Azure.

---

## Step 3: Azure Deployment URL

Now we need to place the Deploy to Azure button somewhere. This can also be a website [on GitHub Pages](https://justinverstijnen.nl/getting-started-with-github-pages/) or elsewhere. Even local HTML files. We need to create a link to Azure with our hosted file as encoded suffix. I will guide you through the steps.

The base URL is this:

{{< card code=true header="**Plain text**" lang="text" >}}
https://portal.azure.com/#create/Microsoft.Template/uri/
{{< /card >}}

After the `uri/` part, we need to paste our encoded URL part. You can use this easy tool to convert the just copied Raw GitHub file to this encoded URL: [https://meyerweb.com/eric/tools/dencoder/](https://meyerweb.com/eric/tools/dencoder/)

[![jv-media-8519-3fd1db343761.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/arm-templates-deployment-via-url/jv-media-8519-3fd1db343761.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/arm-templates-deployment-via-url/jv-media-8519-3fd1db343761.png)

Paste in your URL into that tool, and click "Encode". Then copy and paste that value in yo create a full URL like done below:

{{< card code=true header="**JSON**" lang="json" >}}
https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FJustinVerstijnen%2FAzureDeploymentTemplates%2Frefs%2Fheads%2Fmain%2Fazurevirtualdesktopkerberos%2Fmain.json
{{< /card >}}

`portal.azure/uri/your-pasted-url`

Now you can check this URL already by pasting it into your Webbrowser. You should be redirected to the Azure Portal and then to a custom deployment:

[![Schermafbeelding 2026-07-05 114846.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/arm-templates-deployment-via-url/jv-media-8519-573f71e24489.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/arm-templates-deployment-via-url/jv-media-8519-573f71e24489.png)

The URL works, which is fantastic. Now let's dive into how to get that nice "Deploy to Azure" button.

---

## Step 4: Deploy to Azure button HTML

We now need to turn the URL into a nice and tailored Deploy to Azure button. You can do this in HTML and Markdown using this HTML code:

{{< card code=true header="**HTML**" lang="html" >}}
<a href="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FJustinVerstijnen%2FJV-Azure-Deployment-Templates%2Frefs%2Fheads%2Fmain%2Fazurevirtualdesktopkerberos%2Fmain.json" target="_blank" rel="noopener noreferrer">
<img src="https://aka.ms/deploytoazurebutton" alt="Deploy to Azure"/>
</a>
{{< /card >}}

Replace my URL on the first line between the quotes for your full working URL from step 3. If you now open this as HTML visual view, this should look like this:

[![jv-media-8519-1a84275150e8.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/arm-templates-deployment-via-url/jv-media-8519-1a84275150e8.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/arm-templates-deployment-via-url/jv-media-8519-1a84275150e8.png)

I added the code source view to be able to see the URL. You can now use this button for various goals:

- On a GitHub README or your documentation
- On a blog
- On a page with multiple templates like I have done

---

## Step 5: Performing the deployment

Like everything we can automate in IT, we need to test the template thoroughly before publishing it. Click the button from your documentation or website and check if you are redirected to Azure and your custom deployment.

[![jv-media-8519-573f71e24489.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/arm-templates-deployment-via-url/jv-media-8519-573f71e24489.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/arm-templates-deployment-via-url/jv-media-8519-573f71e24489.png)

Fill in the fields that needs filling and then head to Review + create. This will start the deployment sequence, deploying everything that is in your JSON file into Azure:

[![Schermafbeelding 2026-07-05 114829.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/arm-templates-deployment-via-url/jv-media-8519-76907fec452f.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/arm-templates-deployment-via-url/jv-media-8519-76907fec452f.png)

In my case, the deployment took about 15 minutes. This is because a virtual machine with some after deployment configurations must be done but most deployments will happen much faster.

---

## Step 6: Testing the deployment

Now I will test the deployment after it has finished:

[![Schermafbeelding 2026-07-05 115959.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/arm-templates-deployment-via-url/jv-media-8519-48f0f4d96f62.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/arm-templates-deployment-via-url/jv-media-8519-48f0f4d96f62.png)

I wanted the template to comply to these things:

- The Azure Virtual Desktop deployment works and logging in is working including FSLogix
- The RDP settings are correctly according [the Kerberos cloud AVD setup](https://justinverstijnen.nl/azure-virtual-desktop-fslogix-and-native-kerberos-authentication/)
- The names of resources are as wanted

Let's test logging in first:

[![Schermafbeelding 2026-07-05 121007.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/arm-templates-deployment-via-url/jv-media-8519-6295b7ec6104.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/arm-templates-deployment-via-url/jv-media-8519-6295b7ec6104.png)

This is the Entra SSO prompt which I have accepted. Then logging in worked perfectly and we are able to navigate to the storage account with the FSLogix profile in use:

[![Schermafbeelding 2026-07-05 121430.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/arm-templates-deployment-via-url/jv-media-8519-6db182ac1fbe.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/arm-templates-deployment-via-url/jv-media-8519-6db182ac1fbe.png)

And let's check the resource names in the Azure Portal:

[![azurevirtualdesktopkerberos.png.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/arm-templates-deployment-via-url/jv-media-8519-9c4776462c5c.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/arm-templates-deployment-via-url/jv-media-8519-9c4776462c5c.png)

All looking pretty good and happy with the results.

---

## Knowledge check

{{< quiz >}}
{
  "intro": "Answer these question(s) to test your understanding of this post. Your answers are not saved or sent anywhere; this is simply a personal knowledge check. If you refresh the page, your answers will be cleared.",
  "questions": [
    {
      "question": "What is the Base URL for deploying custom ARM templates?",
      "reference": "Step 3: Azure Deployment URL",
      "referenceUrl": "#step3-azure-deployment-url",
      "answers": [
        {
          "text": "https://portal.azure.com/#create/Microsoft.Template/uri/",
          "correct": true,
          "message": "Correct! This is the right answer."
        },
        {
          "text": "https://portal.azure.com/deploy",
          "correct": false,
          "message": "Incorrect. Review the referenced section and try again."
        },
        {
          "text": "https://arm.azure.com/#create/Microsoft.Template/",
          "correct": false,
          "message": "Incorrect. Review the referenced section and try again."
        }
      ]
    },
    {
      "question": "What is NOT a way to publish the ARM template?",
      "reference": "Step 4: Deploy to Azure button HTML",
      "referenceUrl": "#step4-deploy-to-azure-button-html",
      "answers": [
        {
          "text": "On a GitHub README or your documentation",
          "correct": false,
          "message": "Incorrect. Review the referenced section and try again."
        },
        {
          "text": "On a blog",
          "correct": false,
          "message": "Incorrect. Review the referenced section and try again."
        },
        {
          "text": "On a page with multiple templates",
          "correct": false,
          "message": "Incorrect. Review the referenced section and try again."
        },
        {
          "text": "On the Azure Marketplace",
          "correct": true,
          "message": "Correct! Only verified publishers can publish templates on the Azure Marketplace."
        }
      ]
    }
  ]
}
{{< /quiz >}}

---

## Summary

ARM template deployment via URL is a very practical way to make your Azure templates easy to use. The main thing to remember is that the deploy button expects an ARM JSON file at a public URL. So if you build your templates in Bicep, just convert them to `main.json`, publish that file, URL-encode the raw link, and place it behind the Azure portal deployment URL or a Deploy to Azure button.

For me this is one of the easiest ways to share reusable Azure deployments. It keeps the process simple:

- Write in Bicep if you want
- Build to ARM JSON
- Store the JSON in GitHub
- Generate one deployment link
- Place a button anywhere you like

Thank you for reading this post and I hope it was helpful!

### Sources

These sources helped me by writing and research for this post;

1. https://learn.microsoft.com/en-us/azure/azure-resource-manager/templates/deploy-to-azure-button
2. https://learn.microsoft.com/en-us/azure/azure-resource-manager/bicep/bicep-cli
3. https://learn.microsoft.com/en-us/azure/azure-resource-manager/templates/deploy-portal

{{< ads >}}

{{< article-footer >}}