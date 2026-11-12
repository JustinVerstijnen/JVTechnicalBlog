---
title: "Solved - Windows Store applications on FSLogix/Azure Virtual Desktop"
slug: "microsoft-store-applications-on-azure-virtual-desktop-fslogix"
date: 2026-07-01
tags:
- Step by Step guides
categories:
- Azure Virtual Desktop
description: "By default, Microsoft Store applications are not supported when using FSLogix. The root cause is that Windows stores some metadata that is not roamed in the profile folder and cleared at every new logon. You will encounter this behaviour in every environment where you use FSLogix. Now a long time I told our end users that there unfortunately is no solution possible to install apps (like WhatsApp) and make them persistent across Azure Virtual Desktop sessions but someday I found a workaround to deal with this problem. I will explain this workaround at this page."
hidden: false
---

## Requirements

- Around 15 minutes of your time
- An Azure Virtual Desktop or Remote Desktop Services environment with FSLogix
- Some basic knowledge about Windows, Azure and Active Directory
- Session host must have winget installed

---

## The problem described

So the problem with Microsoft Store applications on any FSLogix based system is that the application can be installed like expected and they will work. After signing out of the session and logging in again, the applications will be gone. Under water, the applications are still installed on the computer, only Windows doesn't know to show them to the user.

The fun fact is, the application data is stored in the user profile. You can test this by for example download the application WhatsApp and login to your WhatsApp account. Log off the machine and sign in again. Download the application and you will be logged into WhatsApp automatically.

So, the application manifest of Windows which contains what applications are available to the user cleans up after logging out, but the data is persistent.

{{% alert title="Info" color="info" %}}
Source: [https://learn.microsoft.com/en-us/fslogix/troubleshooting-appx-issues](https://learn.microsoft.com/en-us/fslogix/troubleshooting-appx-issues)
{{% /alert %}}

---

## My solution described

Now that we know more about the underlying problem, we can come to a solution to it. My solution is relatively simple; a log-on script that uses winget and installs all the needed packages at sign in of the user. This also has some advantages because we of IT are in control what people and install or not. We can completely disable the Microsoft Store and only use this "allowed" packages.

For installing this Microsoft Store applications, we use Winget. This is a built-in (from 24H2) package manager for Windows which can download and install these applications.

<!-- draw.io diagram -->
<div class="drawio-white-background" style="background:#ffffff; padding:24px; border-radius:12px; overflow-x:auto;">
<!--[if IE]><meta http-equiv="X-UA-Compatible" content="IE=5,IE=9" ><![endif]-->
<!DOCTYPE html>
<html>
<head>
<title>Diagram zonder titel</title>
<meta charset="utf-8"/>
</head>
<body><div class="mxgraph" style="max-width:100%;border:1px solid transparent;" data-mxgraph="{&quot;highlight&quot;:&quot;#0000ff&quot;,&quot;lightbox&quot;:false,&quot;nav&quot;:true,&quot;resize&quot;:true,&quot;dark-mode&quot;:&quot;auto&quot;,&quot;toolbar&quot;:&quot;zoom layers tags&quot;,&quot;edit&quot;:&quot;_blank&quot;,&quot;xml&quot;:&quot;&lt;mxfile host=\&quot;app.diagrams.net\&quot;&gt;\n  &lt;diagram name=\&quot;Pagina-1\&quot; id=\&quot;G-B0GiIbyG5q_R7ckI7L\&quot;&gt;\n    &lt;mxGraphModel dx=\&quot;2046\&quot; dy=\&quot;1106\&quot; grid=\&quot;1\&quot; gridSize=\&quot;10\&quot; guides=\&quot;1\&quot; tooltips=\&quot;1\&quot; connect=\&quot;1\&quot; arrows=\&quot;1\&quot; fold=\&quot;1\&quot; page=\&quot;1\&quot; pageScale=\&quot;1\&quot; pageWidth=\&quot;1169\&quot; pageHeight=\&quot;827\&quot; math=\&quot;0\&quot; shadow=\&quot;0\&quot;&gt;\n      &lt;root&gt;\n        &lt;mxCell id=\&quot;0\&quot; /&gt;\n        &lt;mxCell id=\&quot;1\&quot; parent=\&quot;0\&quot; /&gt;\n        &lt;mxCell id=\&quot;SR_2mYVZufJNbAuQYGES-1\&quot; parent=\&quot;1\&quot; style=\&quot;image;aspect=fixed;html=1;align=center;fontSize=12;image=img/lib/azure2/compute/Virtual_Machine.svg;points=[[0.5,0,0],[0.5,1,0],[0,0.5,0],[1,0.5,0],[0.985,0.006,0],[0.75,1,0],[0.25,1,0],[0.015,0.006,0]];labelPerimeter=1;\&quot; value=\&quot;\&quot; vertex=\&quot;1\&quot;&gt;\n          &lt;mxGeometry height=\&quot;64\&quot; width=\&quot;69\&quot; x=\&quot;50.5\&quot; y=\&quot;120\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;SR_2mYVZufJNbAuQYGES-2\&quot; parent=\&quot;1\&quot; style=\&quot;image;aspect=fixed;html=1;align=center;fontSize=12;image=img/lib/azure2/azure_stack/User_Subscriptions.svg;points=[[0.436,0,0],[0.5,0.985,0],[0.204,0.5,0],[0.998,0.599,0],[0.602,0.065,0],[0.827,0.997,0],[0.028,0.966,0],[0.265,0.07,0]];labelPerimeter=1;\&quot; value=\&quot;\&quot; vertex=\&quot;1\&quot;&gt;\n          &lt;mxGeometry height=\&quot;36\&quot; width=\&quot;37.09\&quot; x=\&quot;100.5\&quot; y=\&quot;148\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;SR_2mYVZufJNbAuQYGES-3\&quot; parent=\&quot;1\&quot; style=\&quot;text;html=1;whiteSpace=wrap;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;rounded=0;\&quot; value=\&quot;User logs in to Azure VIrtual Desktop\&quot; vertex=\&quot;1\&quot;&gt;\n          &lt;mxGeometry height=\&quot;30\&quot; width=\&quot;170\&quot; y=\&quot;210\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;SR_2mYVZufJNbAuQYGES-4\&quot; edge=\&quot;1\&quot; parent=\&quot;1\&quot; source=\&quot;SR_2mYVZufJNbAuQYGES-2\&quot; style=\&quot;endArrow=none;dashed=1;html=1;rounded=0;defaultLabelBackgroundColor=page;labelPadding=0 4;flowAnimation=1;strokeWidth=2;exitX=0.436;exitY=0;exitDx=0;exitDy=0;exitPerimeter=0;entryX=0;entryY=0.481;entryDx=0;entryDy=0;entryPerimeter=0;\&quot; target=\&quot;SR_2mYVZufJNbAuQYGES-5\&quot; value=\&quot;\&quot;&gt;\n          &lt;mxGeometry height=\&quot;50\&quot; relative=\&quot;1\&quot; width=\&quot;50\&quot; as=\&quot;geometry\&quot;&gt;\n            &lt;mxPoint x=\&quot;150.5\&quot; y=\&quot;148\&quot; as=\&quot;sourcePoint\&quot; /&gt;\n            &lt;mxPoint x=\&quot;280.5\&quot; y=\&quot;148\&quot; as=\&quot;targetPoint\&quot; /&gt;\n          &lt;/mxGeometry&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;SR_2mYVZufJNbAuQYGES-5\&quot; parent=\&quot;1\&quot; style=\&quot;image;aspect=fixed;html=1;align=center;fontSize=12;image=img/lib/azure2/compute/Scheduled_Actions.svg;points=[[0.5,0.06,0],[0.5,0.771,0],[0,0.481,0],[1,0.739,0],[0.682,0.118,0],[0.875,1,0],[0.003,0.837,0],[0.01,0.118,0]];labelPerimeter=1;\&quot; value=\&quot;\&quot; vertex=\&quot;1\&quot;&gt;\n          &lt;mxGeometry height=\&quot;68\&quot; width=\&quot;68\&quot; x=\&quot;290.5\&quot; y=\&quot;116\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;SR_2mYVZufJNbAuQYGES-6\&quot; parent=\&quot;1\&quot; style=\&quot;text;html=1;whiteSpace=wrap;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;rounded=0;\&quot; value=\&quot;Logon task runs script\&quot; vertex=\&quot;1\&quot;&gt;\n          &lt;mxGeometry height=\&quot;30\&quot; width=\&quot;140\&quot; x=\&quot;245.5\&quot; y=\&quot;203\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;SR_2mYVZufJNbAuQYGES-7\&quot; parent=\&quot;1\&quot; style=\&quot;sketch=0;points=[[0,0,0],[0.25,0,0],[0.5,0,0],[0.75,0,0],[1,0,0],[0,1,0],[0.25,1,0],[0.5,1,0],[0.75,1,0],[1,1,0],[0,0.25,0],[0,0.5,0],[0,0.75,0],[1,0.25,0],[1,0.5,0],[1,0.75,0]];points=[[0,0,0],[0.25,0,0],[0.5,0,0],[0.75,0,0],[1,0,0],[0,1,0],[0.25,1,0],[0.5,1,0],[0.75,1,0],[1,1,0],[0,0.25,0],[0,0.5,0],[0,0.75,0],[1,0.25,0],[1,0.5,0],[1,0.75,0]];outlineConnect=0;fillColor=#dae8fc;strokeColor=#6c8ebf;dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=12;fontStyle=0;aspect=fixed;shape=mxgraph.aws4.resourceIcon;resIcon=mxgraph.aws4.command_line_interface;labelPerimeter=1;\&quot; value=\&quot;\&quot; vertex=\&quot;1\&quot;&gt;\n          &lt;mxGeometry height=\&quot;64\&quot; width=\&quot;64\&quot; x=\&quot;471.5\&quot; y=\&quot;118\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;SR_2mYVZufJNbAuQYGES-8\&quot; edge=\&quot;1\&quot; parent=\&quot;1\&quot; style=\&quot;endArrow=none;dashed=1;html=1;rounded=0;defaultLabelBackgroundColor=page;labelPadding=0 4;flowAnimation=1;strokeWidth=2;\&quot; value=\&quot;\&quot;&gt;\n          &lt;mxGeometry height=\&quot;50\&quot; relative=\&quot;1\&quot; width=\&quot;50\&quot; as=\&quot;geometry\&quot;&gt;\n            &lt;mxPoint x=\&quot;340.5\&quot; y=\&quot;148\&quot; as=\&quot;sourcePoint\&quot; /&gt;\n            &lt;mxPoint x=\&quot;470.5\&quot; y=\&quot;148\&quot; as=\&quot;targetPoint\&quot; /&gt;\n          &lt;/mxGeometry&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;SR_2mYVZufJNbAuQYGES-9\&quot; parent=\&quot;1\&quot; style=\&quot;text;html=1;whiteSpace=wrap;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;rounded=0;\&quot; value=\&quot;Winget script executes\&quot; vertex=\&quot;1\&quot;&gt;\n          &lt;mxGeometry height=\&quot;30\&quot; width=\&quot;130\&quot; x=\&quot;438.5\&quot; y=\&quot;203\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;SR_2mYVZufJNbAuQYGES-10\&quot; parent=\&quot;1\&quot; style=\&quot;dashed=0;outlineConnect=0;html=1;align=center;labelPosition=center;verticalLabelPosition=bottom;verticalAlign=top;shape=mxgraph.weblogos.whatsapp;fillColor=#00E676;strokeColor=#dddddd;labelPerimeter=1;\&quot; value=\&quot;\&quot; vertex=\&quot;1\&quot;&gt;\n          &lt;mxGeometry height=\&quot;47.4\&quot; width=\&quot;50\&quot; x=\&quot;670.5\&quot; y=\&quot;128.3\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;SR_2mYVZufJNbAuQYGES-11\&quot; edge=\&quot;1\&quot; parent=\&quot;1\&quot; style=\&quot;endArrow=none;dashed=1;html=1;rounded=0;defaultLabelBackgroundColor=page;labelPadding=0 4;flowAnimation=1;strokeWidth=2;\&quot; value=\&quot;\&quot;&gt;\n          &lt;mxGeometry height=\&quot;50\&quot; relative=\&quot;1\&quot; width=\&quot;50\&quot; as=\&quot;geometry\&quot;&gt;\n            &lt;mxPoint x=\&quot;535.5\&quot; y=\&quot;148\&quot; as=\&quot;sourcePoint\&quot; /&gt;\n            &lt;mxPoint x=\&quot;665.5\&quot; y=\&quot;148\&quot; as=\&quot;targetPoint\&quot; /&gt;\n          &lt;/mxGeometry&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;SR_2mYVZufJNbAuQYGES-12\&quot; parent=\&quot;1\&quot; style=\&quot;text;html=1;whiteSpace=wrap;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;rounded=0;\&quot; value=\&quot;Whatsapp is installed\&quot; vertex=\&quot;1\&quot;&gt;\n          &lt;mxGeometry height=\&quot;30\&quot; width=\&quot;120\&quot; x=\&quot;635.5\&quot; y=\&quot;203\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;SR_2mYVZufJNbAuQYGES-13\&quot; parent=\&quot;1\&quot; style=\&quot;sketch=0;pointerEvents=1;shadow=0;dashed=0;html=1;strokeColor=#6c8ebf;fillColor=#dae8fc;labelPosition=center;verticalLabelPosition=bottom;verticalAlign=top;outlineConnect=0;align=center;shape=mxgraph.office.devices.hard_disk;labelPerimeter=1;\&quot; value=\&quot;FSLogix disk\&quot; vertex=\&quot;1\&quot;&gt;\n          &lt;mxGeometry height=\&quot;24\&quot; width=\&quot;20\&quot; x=\&quot;75\&quot; y=\&quot;34\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;SR_2mYVZufJNbAuQYGES-14\&quot; edge=\&quot;1\&quot; parent=\&quot;1\&quot; style=\&quot;endArrow=none;dashed=1;html=1;rounded=0;defaultLabelBackgroundColor=page;labelPadding=0 4;flowAnimation=1;strokeWidth=2;exitX=0.436;exitY=0;exitDx=0;exitDy=0;exitPerimeter=0;\&quot; value=\&quot;\&quot;&gt;\n          &lt;mxGeometry height=\&quot;50\&quot; relative=\&quot;1\&quot; width=\&quot;50\&quot; as=\&quot;geometry\&quot;&gt;\n            &lt;mxPoint x=\&quot;84.5\&quot; y=\&quot;120\&quot; as=\&quot;sourcePoint\&quot; /&gt;\n            &lt;mxPoint x=\&quot;84.5\&quot; y=\&quot;60\&quot; as=\&quot;targetPoint\&quot; /&gt;\n          &lt;/mxGeometry&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;SR_2mYVZufJNbAuQYGES-16\&quot; edge=\&quot;1\&quot; parent=\&quot;1\&quot; source=\&quot;SR_2mYVZufJNbAuQYGES-10\&quot; style=\&quot;endArrow=none;dashed=1;html=1;rounded=0;defaultLabelBackgroundColor=page;labelPadding=0 4;flowAnimation=1;\&quot; target=\&quot;SR_2mYVZufJNbAuQYGES-13\&quot; value=\&quot;\&quot;&gt;\n          &lt;mxGeometry height=\&quot;50\&quot; relative=\&quot;1\&quot; width=\&quot;50\&quot; as=\&quot;geometry\&quot;&gt;\n            &lt;Array as=\&quot;points\&quot;&gt;\n              &lt;mxPoint x=\&quot;695.5\&quot; y=\&quot;46\&quot; /&gt;\n            &lt;/Array&gt;\n            &lt;mxPoint x=\&quot;555.5\&quot; y=\&quot;50\&quot; as=\&quot;sourcePoint\&quot; /&gt;\n            &lt;mxPoint x=\&quot;605.5\&quot; as=\&quot;targetPoint\&quot; /&gt;\n          &lt;/mxGeometry&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;SR_2mYVZufJNbAuQYGES-17\&quot; parent=\&quot;1\&quot; style=\&quot;text;html=1;whiteSpace=wrap;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;rounded=0;\&quot; value=\&quot;Application data is retrieved from profile\&quot; vertex=\&quot;1\&quot;&gt;\n          &lt;mxGeometry height=\&quot;30\&quot; width=\&quot;160\&quot; x=\&quot;330.5\&quot; y=\&quot;10\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n      &lt;/root&gt;\n    &lt;/mxGraphModel&gt;\n  &lt;/diagram&gt;\n&lt;/mxfile&gt;\n&quot;}"></div>
<script type="text/javascript" src="https://viewer.diagrams.net/js/viewer-static.min.js"></script>
</body>
</html>
</div>

---

## Step 1: Preparing the script

In this step we will prepare our environment for the script/solution. Every session host needs to have winget installed. If this is not installed yet, this command must be run once per session host:

{{< card code=true header="**PowerShell**" lang="powershell" >}}
Add-AppxPackage -RegisterByFamilyName -MainPackage Microsoft.DesktopAppInstaller_8wekyb3d8bbwe
{{< /card >}}

This will be done in a few seconds and installs winget on the machine. Then we need to get all the applications we want to install. You can search for applications using winget by using this command:

{{< card code=true header="**PowerShell**" lang="powershell" >}}
winget search applicationname
{{< /card >}}

Where `applicationname` is the name of the application you want to search for. Let's say we want to lookup WhatsApp:

{{< card code=true header="**PowerShell**" lang="powershell" >}}
winget search whatsapp

Agree: Y

Name                            Id                            Version         Match         Source
---------------------------------------------------------------------------------------------------
WhatsApp                        9NKSQGP7F2NH                  Unknown                       msstore
WhatsApp Beta                   9NBDXK71NK08                  Unknown                       msstore
Altus                           AmanHarwara.Altus             5.5.2           Tag: whatsapp winget
Beeper                          Beeper.Beeper                 3.110.1         Tag: whatsapp winget
Wondershare MobileTrans         Wondershare.MobileTrans       4.5.40          Tag: whatsapp winget
ttth                            yafp.ttth                     1.8.0           Tag: whatsapp winget
WhatsappTray                    D4koon.WhatsappTray           1.9.0.0                       winget
{{< /card >}}

Now we have the ID of the correct application, which is `9NKSQGP7F2NH` for WhatsApp, we can install the WhatsApp Microsoft Store application with Winget with the following command:

{{< card code=true header="**PowerShell**" lang="powershell" >}}
winget install 9NKSQGP7F2NH --silent --accept-package-agreements --accept-source-agreements
{{< /card >}}

Notice that WhatsApp will be available in your Windows Start Menu in a few seconds.

Now you need to do this for every app you want to install, but be careful not to blast too much apps into this scrip as this is being performed at every logon of every user.

---

## Step 2: Creating the login script

Now we know how to install your own chosen apps using winget, we can create a script which installs the applications for us. This script will be very easy to build and maintain. An example of a script I used in the past:

{{< card code=true header="**Bash**" lang="bash" >}}
rem WhatsApp
winget install 9NKSQGP7F2NH --silent --accept-package-agreements --accept-source-agreements

rem Copilot
winget install Microsoft.365Copilot --silent --accept-package-agreements --accept-source-agreements
{{< /card >}}

Then save this script as a .cmd file. Now we need to place this on a readable shared network location, like a server or on the SYSVOL folder of the domain like I've done here:

[![jv-media-997-2540d603dab4.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/microsoft-store-applications-on-azure-virtual-desktop-fslogix-997/jv-media-997-2540d603dab4.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/microsoft-store-applications-on-azure-virtual-desktop-fslogix-997/jv-media-997-2540d603dab4.png)

Then we need to create a Group Policy with the script as logon action. Open the Group Policy Management Console on `gpmc.msc` and create a new Group Policy or recycle an existing one.

Then go to:

`User Configuration -> Policies -> Windows Settings -> Scripts (Logon)`

[![jv-media-997-5eb06a2f9530.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/microsoft-store-applications-on-azure-virtual-desktop-fslogix-997/jv-media-997-5eb06a2f9530.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/microsoft-store-applications-on-azure-virtual-desktop-fslogix-997/jv-media-997-5eb06a2f9530.png)

Add your script there which must be on a readable Network location for users and computers.

[![jv-media-997-df85767a91bd.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/microsoft-store-applications-on-azure-virtual-desktop-fslogix-997/jv-media-997-df85767a91bd.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/microsoft-store-applications-on-azure-virtual-desktop-fslogix-997/jv-media-997-df85767a91bd.png)

The SYSVOL folder is a great example of such folder and would work. After creating the logon action close the applications and head over to your AVD connection.

---

## Step 3: Testing the login script

After succesfully logging in to Azure Virtual Desktop (relogin required after changing policy), our scripted applications should be available and installed in the background. After around 30 seconds you can find the applications in the start menu.

[![jv-media-997-03babc8d9509.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/microsoft-store-applications-on-azure-virtual-desktop-fslogix-997/jv-media-997-03babc8d9509.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/microsoft-store-applications-on-azure-virtual-desktop-fslogix-997/jv-media-997-03babc8d9509.png)

Fun fact is that the data is stored in the profile, so after installing the app it can be used directly and with the data from an earlier login. In the case of WhatsApp, no reconnection with your phone/account should be needed.

---

## Summary

Now this guide shows how I solved the problem of users not able to use apps on Azure Virtual Desktop without re-installing them every session.

In my opinion, I think its the best way to handle the applications. If the application has an option to install through a .exe or .msi file, that will work much better. I use this only for some applications that can be downloaded exclusively from the Windows Store.

{{% alert title="Sources 📖" color="info" %}}
These sources helped me by writing and research for this post;

1. https://learn.microsoft.com/en-us/fslogix/troubleshooting-appx-issues
2. [https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-server-2012-r2-and-2012/dn789196(v=ws.11)#how-to-assign-user-logon-scripts](https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-server-2012-r2-and-2012/dn789196(v=ws.11)#how-to-assign-user-logon-scripts)
{{% /alert %}}

{{< ads >}}

{{< article-footer >}}
