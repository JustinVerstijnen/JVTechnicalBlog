---
title: "What is Azure Firewall?"
date: 2025-07-03
slug: "what-is-azure-firewall"
categories:
  - Microsoft Azure
tags:
  - Concepts
description: >
  Azure Firewall is a Firewall which can be implemented in your Azure network. It acts as a Layer 3, 4 and 7 Firewall and so has more...
---
Azure Firewall is a cloud-native Firewall which can be implemented in your Azure network. It acts as a Layer 3, 4 and 7 Firewall and so has more administrative options than for example NSGs.

---

## Requirements

- Around 15 minutes of your time
- Basic knowledge of Azure
- Basic knowledge of networking and networking protocols

---

## What is Azure Firewall?

Azure Firewall is an cloud based firewall to secure and your cloud networking environment. It acts as point of access, a sort of castledoor, and can allow or block certain traffic from the internet to your environment and from environment to the internet. The firewall can mostly work on layers 3, 4 and 7 of the OSI model.

Some basic tasks Azure Firewall can do for us:

- Port Forward multiple servers through the same IP address (DNAT)
- Superseding the native NAT Gateway to have all your environment communicating through the same static outbound IP address
- Allowing or blocking traffic from and to your virtual networks and subnets
- Block outbound traffic for sensitive servers
- Configuring a DMZ part of your network
- Blocking certain categories of websites for users on Azure Virtual Desktop

---

## Azure Firewall overview

An overview of how this looks:

<!-- draw.io diagram -->
<div class="mxgraph" style="max-width:100%;border:1px solid transparent;" data-mxgraph="{&quot;highlight&quot;:&quot;#0000ff&quot;,&quot;nav&quot;:true,&quot;resize&quot;:true,&quot;dark-mode&quot;:&quot;auto&quot;,&quot;toolbar&quot;:&quot;zoom layers tags lightbox&quot;,&quot;xml&quot;:&quot;&lt;mxfile host=\&quot;Electron\&quot; agent=\&quot;Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) draw.io/26.2.15 Chrome/134.0.6998.205 Electron/35.2.1 Safari/537.36\&quot; version=\&quot;26.2.15\&quot;&gt;\n  &lt;diagram id=\&quot;b5JoGLbWru3YMP07z6eZ\&quot; name=\&quot;Pagina-1\&quot;&gt;\n    &lt;mxGraphModel dx=\&quot;1426\&quot; dy=\&quot;841\&quot; grid=\&quot;1\&quot; gridSize=\&quot;10\&quot; guides=\&quot;1\&quot; tooltips=\&quot;1\&quot; connect=\&quot;1\&quot; arrows=\&quot;1\&quot; fold=\&quot;1\&quot; page=\&quot;1\&quot; pageScale=\&quot;1\&quot; pageWidth=\&quot;1169\&quot; pageHeight=\&quot;827\&quot; math=\&quot;0\&quot; shadow=\&quot;0\&quot;&gt;\n      &lt;root&gt;\n        &lt;mxCell id=\&quot;0\&quot; /&gt;\n        &lt;mxCell id=\&quot;1\&quot; parent=\&quot;0\&quot; /&gt;\n        &lt;mxCell id=\&quot;w-muQDt6z7SxPLqJAEN1-1\&quot; value=\&quot;VNET01&amp;lt;div&amp;gt;10.0.0.0/16&amp;lt;/div&amp;gt;&amp;lt;div&amp;gt;Infrastructure&amp;lt;/div&amp;gt;\&quot; style=\&quot;image;aspect=fixed;html=1;points=[];align=center;fontSize=12;image=img/lib/azure2/networking/Virtual_Networks.svg;\&quot; vertex=\&quot;1\&quot; parent=\&quot;1\&quot;&gt;\n          &lt;mxGeometry x=\&quot;86.5\&quot; y=\&quot;430\&quot; width=\&quot;67\&quot; height=\&quot;40\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;w-muQDt6z7SxPLqJAEN1-19\&quot; value=\&quot;\&quot; style=\&quot;rounded=1;whiteSpace=wrap;html=1;shadow=1;fillColor=none;\&quot; vertex=\&quot;1\&quot; parent=\&quot;1\&quot;&gt;\n          &lt;mxGeometry x=\&quot;40\&quot; y=\&quot;520.04\&quot; width=\&quot;160\&quot; height=\&quot;280\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;w-muQDt6z7SxPLqJAEN1-20\&quot; value=\&quot;Server01\&quot; style=\&quot;image;aspect=fixed;html=1;points=[];align=center;fontSize=12;image=img/lib/azure2/compute/Virtual_Machine.svg;\&quot; vertex=\&quot;1\&quot; parent=\&quot;1\&quot;&gt;\n          &lt;mxGeometry x=\&quot;96.53999999999996\&quot; y=\&quot;589.52\&quot; width=\&quot;46.92\&quot; height=\&quot;43.52\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;w-muQDt6z7SxPLqJAEN1-21\&quot; value=\&quot;Server02\&quot; style=\&quot;image;aspect=fixed;html=1;points=[];align=center;fontSize=12;image=img/lib/azure2/compute/Virtual_Machine.svg;\&quot; vertex=\&quot;1\&quot; parent=\&quot;1\&quot;&gt;\n          &lt;mxGeometry x=\&quot;96.53999999999996\&quot; y=\&quot;659.52\&quot; width=\&quot;46.92\&quot; height=\&quot;43.52\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;w-muQDt6z7SxPLqJAEN1-22\&quot; value=\&quot;Server03\&quot; style=\&quot;image;aspect=fixed;html=1;points=[];align=center;fontSize=12;image=img/lib/azure2/compute/Virtual_Machine.svg;\&quot; vertex=\&quot;1\&quot; parent=\&quot;1\&quot;&gt;\n          &lt;mxGeometry x=\&quot;96.53999999999996\&quot; y=\&quot;729.52\&quot; width=\&quot;46.92\&quot; height=\&quot;43.52\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;w-muQDt6z7SxPLqJAEN1-23\&quot; value=\&quot;Subnet&amp;lt;div&amp;gt;10.0.0.0/24&amp;lt;/div&amp;gt;\&quot; style=\&quot;image;aspect=fixed;html=1;points=[];align=center;fontSize=12;image=img/lib/azure2/networking/Subnet.svg;\&quot; vertex=\&quot;1\&quot; parent=\&quot;1\&quot;&gt;\n          &lt;mxGeometry x=\&quot;102.69999999999999\&quot; y=\&quot;529.52\&quot; width=\&quot;34.6\&quot; height=\&quot;20.72\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;w-muQDt6z7SxPLqJAEN1-24\&quot; value=\&quot;VNET02&amp;lt;div&amp;gt;10.1.0.0/16&amp;lt;/div&amp;gt;&amp;lt;div&amp;gt;Workstations&amp;lt;/div&amp;gt;\&quot; style=\&quot;image;aspect=fixed;html=1;points=[];align=center;fontSize=12;image=img/lib/azure2/networking/Virtual_Networks.svg;\&quot; vertex=\&quot;1\&quot; parent=\&quot;1\&quot;&gt;\n          &lt;mxGeometry x=\&quot;326.5\&quot; y=\&quot;430\&quot; width=\&quot;67\&quot; height=\&quot;40\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;w-muQDt6z7SxPLqJAEN1-25\&quot; value=\&quot;\&quot; style=\&quot;rounded=1;whiteSpace=wrap;html=1;shadow=1;fillColor=none;\&quot; vertex=\&quot;1\&quot; parent=\&quot;1\&quot;&gt;\n          &lt;mxGeometry x=\&quot;280\&quot; y=\&quot;520.04\&quot; width=\&quot;160\&quot; height=\&quot;280\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;w-muQDt6z7SxPLqJAEN1-26\&quot; value=\&quot;Workstation01\&quot; style=\&quot;image;aspect=fixed;html=1;points=[];align=center;fontSize=12;image=img/lib/azure2/compute/Virtual_Machine.svg;\&quot; vertex=\&quot;1\&quot; parent=\&quot;1\&quot;&gt;\n          &lt;mxGeometry x=\&quot;336.53999999999996\&quot; y=\&quot;589.52\&quot; width=\&quot;46.92\&quot; height=\&quot;43.52\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;w-muQDt6z7SxPLqJAEN1-27\&quot; value=\&quot;Workstation02\&quot; style=\&quot;image;aspect=fixed;html=1;points=[];align=center;fontSize=12;image=img/lib/azure2/compute/Virtual_Machine.svg;\&quot; vertex=\&quot;1\&quot; parent=\&quot;1\&quot;&gt;\n          &lt;mxGeometry x=\&quot;336.53999999999996\&quot; y=\&quot;659.52\&quot; width=\&quot;46.92\&quot; height=\&quot;43.52\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;w-muQDt6z7SxPLqJAEN1-28\&quot; value=\&quot;Workstation03\&quot; style=\&quot;image;aspect=fixed;html=1;points=[];align=center;fontSize=12;image=img/lib/azure2/compute/Virtual_Machine.svg;\&quot; vertex=\&quot;1\&quot; parent=\&quot;1\&quot;&gt;\n          &lt;mxGeometry x=\&quot;336.53999999999996\&quot; y=\&quot;729.52\&quot; width=\&quot;46.92\&quot; height=\&quot;43.52\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;w-muQDt6z7SxPLqJAEN1-29\&quot; value=\&quot;Subnet&amp;lt;div&amp;gt;10.1.0.0/24&amp;lt;/div&amp;gt;\&quot; style=\&quot;image;aspect=fixed;html=1;points=[];align=center;fontSize=12;image=img/lib/azure2/networking/Subnet.svg;\&quot; vertex=\&quot;1\&quot; parent=\&quot;1\&quot;&gt;\n          &lt;mxGeometry x=\&quot;342.70000000000005\&quot; y=\&quot;529.52\&quot; width=\&quot;34.6\&quot; height=\&quot;20.72\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;w-muQDt6z7SxPLqJAEN1-31\&quot; value=\&quot;VNET03&amp;lt;div&amp;gt;172.16.0.0/16&amp;lt;/div&amp;gt;&amp;lt;div&amp;gt;Perimeter network&amp;lt;/div&amp;gt;\&quot; style=\&quot;image;aspect=fixed;html=1;points=[];align=center;fontSize=12;image=img/lib/azure2/networking/Virtual_Networks.svg;\&quot; vertex=\&quot;1\&quot; parent=\&quot;1\&quot;&gt;\n          &lt;mxGeometry x=\&quot;566.5\&quot; y=\&quot;430\&quot; width=\&quot;67\&quot; height=\&quot;40\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;w-muQDt6z7SxPLqJAEN1-32\&quot; value=\&quot;\&quot; style=\&quot;rounded=1;whiteSpace=wrap;html=1;shadow=1;fillColor=none;\&quot; vertex=\&quot;1\&quot; parent=\&quot;1\&quot;&gt;\n          &lt;mxGeometry x=\&quot;520\&quot; y=\&quot;520.04\&quot; width=\&quot;160\&quot; height=\&quot;280\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;w-muQDt6z7SxPLqJAEN1-33\&quot; value=\&quot;Webserver01\&quot; style=\&quot;image;aspect=fixed;html=1;points=[];align=center;fontSize=12;image=img/lib/azure2/compute/Virtual_Machine.svg;\&quot; vertex=\&quot;1\&quot; parent=\&quot;1\&quot;&gt;\n          &lt;mxGeometry x=\&quot;576.54\&quot; y=\&quot;589.52\&quot; width=\&quot;46.92\&quot; height=\&quot;43.52\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;w-muQDt6z7SxPLqJAEN1-34\&quot; value=\&quot;Webserver02\&quot; style=\&quot;image;aspect=fixed;html=1;points=[];align=center;fontSize=12;image=img/lib/azure2/compute/Virtual_Machine.svg;\&quot; vertex=\&quot;1\&quot; parent=\&quot;1\&quot;&gt;\n          &lt;mxGeometry x=\&quot;576.54\&quot; y=\&quot;659.52\&quot; width=\&quot;46.92\&quot; height=\&quot;43.52\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;w-muQDt6z7SxPLqJAEN1-35\&quot; value=\&quot;Webserver03\&quot; style=\&quot;image;aspect=fixed;html=1;points=[];align=center;fontSize=12;image=img/lib/azure2/compute/Virtual_Machine.svg;\&quot; vertex=\&quot;1\&quot; parent=\&quot;1\&quot;&gt;\n          &lt;mxGeometry x=\&quot;576.54\&quot; y=\&quot;729.52\&quot; width=\&quot;46.92\&quot; height=\&quot;43.52\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;w-muQDt6z7SxPLqJAEN1-36\&quot; value=\&quot;Subnet&amp;lt;div&amp;gt;172.16.0.0/24&amp;lt;/div&amp;gt;\&quot; style=\&quot;image;aspect=fixed;html=1;points=[];align=center;fontSize=12;image=img/lib/azure2/networking/Subnet.svg;\&quot; vertex=\&quot;1\&quot; parent=\&quot;1\&quot;&gt;\n          &lt;mxGeometry x=\&quot;582.7\&quot; y=\&quot;529.52\&quot; width=\&quot;34.6\&quot; height=\&quot;20.72\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;w-muQDt6z7SxPLqJAEN1-37\&quot; value=\&quot;Route through&amp;lt;div&amp;gt;firewall&amp;lt;/div&amp;gt;\&quot; style=\&quot;image;aspect=fixed;html=1;points=[];align=center;fontSize=12;image=img/lib/azure2/networking/Route_Tables.svg;\&quot; vertex=\&quot;1\&quot; parent=\&quot;1\&quot;&gt;\n          &lt;mxGeometry x=\&quot;187.78999999999996\&quot; y=\&quot;529.52\&quot; width=\&quot;22.21\&quot; height=\&quot;21.52\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;w-muQDt6z7SxPLqJAEN1-38\&quot; value=\&quot;Route through&amp;lt;div&amp;gt;firewall&amp;lt;/div&amp;gt;\&quot; style=\&quot;image;aspect=fixed;html=1;points=[];align=center;fontSize=12;image=img/lib/azure2/networking/Route_Tables.svg;\&quot; vertex=\&quot;1\&quot; parent=\&quot;1\&quot;&gt;\n          &lt;mxGeometry x=\&quot;428\&quot; y=\&quot;529.52\&quot; width=\&quot;22.21\&quot; height=\&quot;21.52\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;w-muQDt6z7SxPLqJAEN1-39\&quot; value=\&quot;Route through&amp;lt;div&amp;gt;firewall&amp;lt;/div&amp;gt;\&quot; style=\&quot;image;aspect=fixed;html=1;points=[];align=center;fontSize=12;image=img/lib/azure2/networking/Route_Tables.svg;\&quot; vertex=\&quot;1\&quot; parent=\&quot;1\&quot;&gt;\n          &lt;mxGeometry x=\&quot;666.79\&quot; y=\&quot;529.52\&quot; width=\&quot;22.21\&quot; height=\&quot;21.52\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;w-muQDt6z7SxPLqJAEN1-41\&quot; value=\&quot;\&quot; style=\&quot;endArrow=none;dashed=1;html=1;dashPattern=1 3;strokeWidth=2;rounded=0;flowAnimation=1;exitX=0.1;exitY=0.477;exitDx=0;exitDy=0;exitPerimeter=0;\&quot; edge=\&quot;1\&quot; parent=\&quot;1\&quot;&gt;\n          &lt;mxGeometry width=\&quot;50\&quot; height=\&quot;50\&quot; relative=\&quot;1\&quot; as=\&quot;geometry\&quot;&gt;\n            &lt;mxPoint x=\&quot;192.01099999999997\&quot; y=\&quot;539.78504\&quot; as=\&quot;sourcePoint\&quot; /&gt;\n            &lt;mxPoint x=\&quot;139.3\&quot; y=\&quot;539.78\&quot; as=\&quot;targetPoint\&quot; /&gt;\n          &lt;/mxGeometry&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;w-muQDt6z7SxPLqJAEN1-42\&quot; value=\&quot;\&quot; style=\&quot;endArrow=none;dashed=1;html=1;dashPattern=1 3;strokeWidth=2;rounded=0;flowAnimation=1;exitX=0.1;exitY=0.477;exitDx=0;exitDy=0;exitPerimeter=0;\&quot; edge=\&quot;1\&quot; parent=\&quot;1\&quot;&gt;\n          &lt;mxGeometry width=\&quot;50\&quot; height=\&quot;50\&quot; relative=\&quot;1\&quot; as=\&quot;geometry\&quot;&gt;\n            &lt;mxPoint x=\&quot;424.15999999999997\&quot; y=\&quot;540.6\&quot; as=\&quot;sourcePoint\&quot; /&gt;\n            &lt;mxPoint x=\&quot;381.46000000000004\&quot; y=\&quot;540.38\&quot; as=\&quot;targetPoint\&quot; /&gt;\n          &lt;/mxGeometry&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;w-muQDt6z7SxPLqJAEN1-43\&quot; value=\&quot;\&quot; style=\&quot;endArrow=none;dashed=1;html=1;dashPattern=1 3;strokeWidth=2;rounded=0;flowAnimation=1;exitX=0.1;exitY=0.477;exitDx=0;exitDy=0;exitPerimeter=0;\&quot; edge=\&quot;1\&quot; parent=\&quot;1\&quot;&gt;\n          &lt;mxGeometry width=\&quot;50\&quot; height=\&quot;50\&quot; relative=\&quot;1\&quot; as=\&quot;geometry\&quot;&gt;\n            &lt;mxPoint x=\&quot;664\&quot; y=\&quot;540\&quot; as=\&quot;sourcePoint\&quot; /&gt;\n            &lt;mxPoint x=\&quot;621.3\&quot; y=\&quot;539.78\&quot; as=\&quot;targetPoint\&quot; /&gt;\n          &lt;/mxGeometry&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;w-muQDt6z7SxPLqJAEN1-45\&quot; value=\&quot;&amp;lt;b&amp;gt;Internet&amp;lt;/b&amp;gt;\&quot; style=\&quot;ellipse;shape=cloud;whiteSpace=wrap;html=1;fillColor=light-dark(#1ac6ff, #ededed);shadow=1;opacity=70;\&quot; vertex=\&quot;1\&quot; parent=\&quot;1\&quot;&gt;\n          &lt;mxGeometry x=\&quot;300\&quot; y=\&quot;10\&quot; width=\&quot;120\&quot; height=\&quot;80\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;w-muQDt6z7SxPLqJAEN1-47\&quot; value=\&quot;\&quot; style=\&quot;rounded=1;whiteSpace=wrap;html=1;fillColor=none;\&quot; vertex=\&quot;1\&quot; parent=\&quot;1\&quot;&gt;\n          &lt;mxGeometry x=\&quot;40\&quot; y=\&quot;170\&quot; width=\&quot;640\&quot; height=\&quot;170\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;w-muQDt6z7SxPLqJAEN1-48\&quot; value=\&quot;&amp;lt;b&amp;gt;Azure Firewall&amp;lt;/b&amp;gt;&amp;lt;div&amp;gt;&amp;lt;b&amp;gt;172.172.172.172&amp;lt;/b&amp;gt;&amp;lt;/div&amp;gt;\&quot; style=\&quot;image;aspect=fixed;html=1;points=[];align=center;fontSize=12;image=img/lib/azure2/networking/Firewalls.svg;\&quot; vertex=\&quot;1\&quot; parent=\&quot;1\&quot;&gt;\n          &lt;mxGeometry x=\&quot;305\&quot; y=\&quot;200\&quot; width=\&quot;110\&quot; height=\&quot;92.96\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;w-muQDt6z7SxPLqJAEN1-49\&quot; value=\&quot;&amp;lt;b&amp;gt;Public IP&amp;lt;/b&amp;gt;&amp;lt;div&amp;gt;&amp;lt;b&amp;gt;172.172.172.172&amp;lt;/b&amp;gt;&amp;lt;/div&amp;gt;\&quot; style=\&quot;image;aspect=fixed;html=1;points=[];align=center;fontSize=12;image=img/lib/azure2/networking/Public_IP_Addresses.svg;\&quot; vertex=\&quot;1\&quot; parent=\&quot;1\&quot;&gt;\n          &lt;mxGeometry x=\&quot;465\&quot; y=\&quot;235.24\&quot; width=\&quot;28.1\&quot; height=\&quot;22.48\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;w-muQDt6z7SxPLqJAEN1-50\&quot; value=\&quot;\&quot; style=\&quot;endArrow=none;dashed=1;html=1;dashPattern=1 3;strokeWidth=2;rounded=0;flowAnimation=1;exitX=0.1;exitY=0.477;exitDx=0;exitDy=0;exitPerimeter=0;\&quot; edge=\&quot;1\&quot; parent=\&quot;1\&quot;&gt;\n          &lt;mxGeometry width=\&quot;50\&quot; height=\&quot;50\&quot; relative=\&quot;1\&quot; as=\&quot;geometry\&quot;&gt;\n            &lt;mxPoint x=\&quot;460.7\&quot; y=\&quot;250.22000000000003\&quot; as=\&quot;sourcePoint\&quot; /&gt;\n            &lt;mxPoint x=\&quot;418.00000000000006\&quot; y=\&quot;250\&quot; as=\&quot;targetPoint\&quot; /&gt;\n          &lt;/mxGeometry&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;w-muQDt6z7SxPLqJAEN1-51\&quot; value=\&quot;Firewall Policy\&quot; style=\&quot;image;aspect=fixed;html=1;points=[];align=center;fontSize=12;image=img/lib/azure2/networking/Azure_Firewall_Policy.svg;\&quot; vertex=\&quot;1\&quot; parent=\&quot;1\&quot;&gt;\n          &lt;mxGeometry x=\&quot;210\&quot; y=\&quot;240\&quot; width=\&quot;41.36\&quot; height=\&quot;30\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;w-muQDt6z7SxPLqJAEN1-52\&quot; value=\&quot;\&quot; style=\&quot;endArrow=none;dashed=1;html=1;dashPattern=1 3;strokeWidth=2;rounded=0;flowAnimation=1;\&quot; edge=\&quot;1\&quot; parent=\&quot;1\&quot;&gt;\n          &lt;mxGeometry width=\&quot;50\&quot; height=\&quot;50\&quot; relative=\&quot;1\&quot; as=\&quot;geometry\&quot;&gt;\n            &lt;mxPoint x=\&quot;258\&quot; y=\&quot;250.5\&quot; as=\&quot;sourcePoint\&quot; /&gt;\n            &lt;mxPoint x=\&quot;298\&quot; y=\&quot;250.5\&quot; as=\&quot;targetPoint\&quot; /&gt;\n          &lt;/mxGeometry&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;w-muQDt6z7SxPLqJAEN1-53\&quot; value=\&quot;\&quot; style=\&quot;endArrow=none;dashed=1;html=1;dashPattern=1 3;strokeWidth=2;rounded=0;entryX=0.5;entryY=1;entryDx=0;entryDy=0;flowAnimation=1;\&quot; edge=\&quot;1\&quot; parent=\&quot;1\&quot; source=\&quot;w-muQDt6z7SxPLqJAEN1-24\&quot; target=\&quot;w-muQDt6z7SxPLqJAEN1-47\&quot;&gt;\n          &lt;mxGeometry width=\&quot;50\&quot; height=\&quot;50\&quot; relative=\&quot;1\&quot; as=\&quot;geometry\&quot;&gt;\n            &lt;mxPoint x=\&quot;360\&quot; y=\&quot;400\&quot; as=\&quot;sourcePoint\&quot; /&gt;\n            &lt;mxPoint x=\&quot;620\&quot; y=\&quot;380\&quot; as=\&quot;targetPoint\&quot; /&gt;\n          &lt;/mxGeometry&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;w-muQDt6z7SxPLqJAEN1-54\&quot; value=\&quot;\&quot; style=\&quot;endArrow=none;dashed=1;html=1;dashPattern=1 3;strokeWidth=2;rounded=0;flowAnimation=1;\&quot; edge=\&quot;1\&quot; parent=\&quot;1\&quot;&gt;\n          &lt;mxGeometry width=\&quot;50\&quot; height=\&quot;50\&quot; relative=\&quot;1\&quot; as=\&quot;geometry\&quot;&gt;\n            &lt;mxPoint x=\&quot;119.5\&quot; y=\&quot;430\&quot; as=\&quot;sourcePoint\&quot; /&gt;\n            &lt;mxPoint x=\&quot;350\&quot; y=\&quot;340\&quot; as=\&quot;targetPoint\&quot; /&gt;\n            &lt;Array as=\&quot;points\&quot;&gt;\n              &lt;mxPoint x=\&quot;120\&quot; y=\&quot;400\&quot; /&gt;\n              &lt;mxPoint x=\&quot;350\&quot; y=\&quot;400\&quot; /&gt;\n            &lt;/Array&gt;\n          &lt;/mxGeometry&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;w-muQDt6z7SxPLqJAEN1-55\&quot; value=\&quot;\&quot; style=\&quot;endArrow=none;dashed=1;html=1;dashPattern=1 3;strokeWidth=2;rounded=0;flowAnimation=1;entryX=0.515;entryY=1.009;entryDx=0;entryDy=0;entryPerimeter=0;\&quot; edge=\&quot;1\&quot; parent=\&quot;1\&quot; target=\&quot;w-muQDt6z7SxPLqJAEN1-47\&quot;&gt;\n          &lt;mxGeometry width=\&quot;50\&quot; height=\&quot;50\&quot; relative=\&quot;1\&quot; as=\&quot;geometry\&quot;&gt;\n            &lt;mxPoint x=\&quot;599.5\&quot; y=\&quot;430\&quot; as=\&quot;sourcePoint\&quot; /&gt;\n            &lt;mxPoint x=\&quot;371\&quot; y=\&quot;339\&quot; as=\&quot;targetPoint\&quot; /&gt;\n            &lt;Array as=\&quot;points\&quot;&gt;\n              &lt;mxPoint x=\&quot;600\&quot; y=\&quot;400\&quot; /&gt;\n              &lt;mxPoint x=\&quot;370\&quot; y=\&quot;400\&quot; /&gt;\n            &lt;/Array&gt;\n          &lt;/mxGeometry&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;w-muQDt6z7SxPLqJAEN1-56\&quot; value=\&quot;\&quot; style=\&quot;endArrow=none;dashed=1;html=1;dashPattern=1 3;strokeWidth=2;rounded=0;entryX=0.447;entryY=0.915;entryDx=0;entryDy=0;entryPerimeter=0;flowAnimation=1;exitX=0.491;exitY=0.002;exitDx=0;exitDy=0;exitPerimeter=0;\&quot; edge=\&quot;1\&quot; parent=\&quot;1\&quot; source=\&quot;w-muQDt6z7SxPLqJAEN1-47\&quot; target=\&quot;w-muQDt6z7SxPLqJAEN1-45\&quot;&gt;\n          &lt;mxGeometry width=\&quot;50\&quot; height=\&quot;50\&quot; relative=\&quot;1\&quot; as=\&quot;geometry\&quot;&gt;\n            &lt;mxPoint x=\&quot;354\&quot; y=\&quot;165\&quot; as=\&quot;sourcePoint\&quot; /&gt;\n            &lt;mxPoint x=\&quot;353.76\&quot; y=\&quot;91.31999999999994\&quot; as=\&quot;targetPoint\&quot; /&gt;\n          &lt;/mxGeometry&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;w-muQDt6z7SxPLqJAEN1-57\&quot; value=\&quot;\&quot; style=\&quot;endArrow=none;dashed=1;html=1;dashPattern=1 3;strokeWidth=2;rounded=0;flowAnimation=1;exitX=0.573;exitY=0.955;exitDx=0;exitDy=0;exitPerimeter=0;\&quot; edge=\&quot;1\&quot; parent=\&quot;1\&quot; source=\&quot;w-muQDt6z7SxPLqJAEN1-45\&quot;&gt;\n          &lt;mxGeometry width=\&quot;50\&quot; height=\&quot;50\&quot; relative=\&quot;1\&quot; as=\&quot;geometry\&quot;&gt;\n            &lt;mxPoint x=\&quot;370.24\&quot; y=\&quot;90\&quot; as=\&quot;sourcePoint\&quot; /&gt;\n            &lt;mxPoint x=\&quot;369\&quot; y=\&quot;170\&quot; as=\&quot;targetPoint\&quot; /&gt;\n          &lt;/mxGeometry&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;w-muQDt6z7SxPLqJAEN1-58\&quot; value=\&quot;\&quot; style=\&quot;endArrow=none;dashed=1;html=1;dashPattern=1 3;strokeWidth=2;rounded=0;exitX=1.019;exitY=0.478;exitDx=0;exitDy=0;exitPerimeter=0;entryX=-0.025;entryY=0.478;entryDx=0;entryDy=0;entryPerimeter=0;flowAnimation=1;\&quot; edge=\&quot;1\&quot; parent=\&quot;1\&quot; source=\&quot;w-muQDt6z7SxPLqJAEN1-19\&quot; target=\&quot;w-muQDt6z7SxPLqJAEN1-25\&quot;&gt;\n          &lt;mxGeometry width=\&quot;50\&quot; height=\&quot;50\&quot; relative=\&quot;1\&quot; as=\&quot;geometry\&quot;&gt;\n            &lt;mxPoint x=\&quot;220\&quot; y=\&quot;659.52\&quot; as=\&quot;sourcePoint\&quot; /&gt;\n            &lt;mxPoint x=\&quot;270\&quot; y=\&quot;609.52\&quot; as=\&quot;targetPoint\&quot; /&gt;\n          &lt;/mxGeometry&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;w-muQDt6z7SxPLqJAEN1-59\&quot; value=\&quot;\&quot; style=\&quot;endArrow=none;dashed=1;html=1;dashPattern=1 3;strokeWidth=2;rounded=0;exitX=0;exitY=0.5;exitDx=0;exitDy=0;flowAnimation=1;entryX=1;entryY=0.5;entryDx=0;entryDy=0;\&quot; edge=\&quot;1\&quot; parent=\&quot;1\&quot; source=\&quot;w-muQDt6z7SxPLqJAEN1-25\&quot; target=\&quot;w-muQDt6z7SxPLqJAEN1-19\&quot;&gt;\n          &lt;mxGeometry width=\&quot;50\&quot; height=\&quot;50\&quot; relative=\&quot;1\&quot; as=\&quot;geometry\&quot;&gt;\n            &lt;mxPoint x=\&quot;213\&quot; y=\&quot;664\&quot; as=\&quot;sourcePoint\&quot; /&gt;\n            &lt;mxPoint x=\&quot;230\&quot; y=\&quot;710\&quot; as=\&quot;targetPoint\&quot; /&gt;\n          &lt;/mxGeometry&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;w-muQDt6z7SxPLqJAEN1-60\&quot; value=\&quot;&amp;lt;b&amp;gt;&amp;lt;font style=&amp;quot;font-size: 10px;&amp;quot;&amp;gt;Peering&amp;lt;/font&amp;gt;&amp;lt;/b&amp;gt;\&quot; style=\&quot;text;html=1;align=center;verticalAlign=middle;resizable=0;points=[];autosize=1;strokeColor=none;fillColor=none;\&quot; vertex=\&quot;1\&quot; parent=\&quot;1\&quot;&gt;\n          &lt;mxGeometry x=\&quot;210\&quot; y=\&quot;666.28\&quot; width=\&quot;60\&quot; height=\&quot;30\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;w-muQDt6z7SxPLqJAEN1-61\&quot; value=\&quot;\&quot; style=\&quot;shape=flexArrow;endArrow=classic;startArrow=classic;html=1;rounded=0;\&quot; edge=\&quot;1\&quot; parent=\&quot;1\&quot;&gt;\n          &lt;mxGeometry width=\&quot;100\&quot; height=\&quot;100\&quot; relative=\&quot;1\&quot; as=\&quot;geometry\&quot;&gt;\n            &lt;mxPoint x=\&quot;444.05\&quot; y=\&quot;658.52\&quot; as=\&quot;sourcePoint\&quot; /&gt;\n            &lt;mxPoint x=\&quot;514.05\&quot; y=\&quot;658.52\&quot; as=\&quot;targetPoint\&quot; /&gt;\n          &lt;/mxGeometry&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;w-muQDt6z7SxPLqJAEN1-62\&quot; value=\&quot;\&quot; style=\&quot;image;aspect=fixed;html=1;points=[];align=center;fontSize=12;image=img/lib/azure2/general/Globe_Error.svg;\&quot; vertex=\&quot;1\&quot; parent=\&quot;1\&quot;&gt;\n          &lt;mxGeometry x=\&quot;470.27\&quot; y=\&quot;620\&quot; width=\&quot;19.55\&quot; height=\&quot;23.04\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;w-muQDt6z7SxPLqJAEN1-63\&quot; value=\&quot;&amp;lt;font style=&amp;quot;font-size: 10px;&amp;quot;&amp;gt;No connection&amp;lt;/font&amp;gt;\&quot; style=\&quot;text;html=1;align=center;verticalAlign=middle;resizable=0;points=[];autosize=1;strokeColor=none;fillColor=none;fontStyle=1\&quot; vertex=\&quot;1\&quot; parent=\&quot;1\&quot;&gt;\n          &lt;mxGeometry x=\&quot;435.05\&quot; y=\&quot;673.04\&quot; width=\&quot;90\&quot; height=\&quot;30\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n      &lt;/root&gt;\n    &lt;/mxGraphModel&gt;\n  &lt;/diagram&gt;\n&lt;/mxfile&gt;\n&quot;}"></div>
<script type="text/javascript" src="https://viewer.diagrams.net/js/viewer-static.min.js"></script>

In this diagram, we have one Azure Firewall instance with an policy assigned, and we have 3 Azure virtual networks. These have each their own purpose. With Azure Firewall, all traffic of your machines and networks is going through the Firewall so we can define some policies there to restrict traffic.

To route your virtual network outbound traffic through Azure Firewall, a Route table must be created and assigned to your subnets.

---

## Azure Firewall Pricing

To not be 100% like Microsoft who are very often like: "Buy our stuff" and then be suprised about the pricing, I want to be clear about the pricing of this service. For the West Europe region, you pay at the moment of writing:

- Basic instance: 290 dollars per month
- Standard instance: 910 dollars per month
- Premium instance: 1280 dollars per month

This is purely the firewall, and no calculated data. This isn't that expensive, for the premium instance you pay around 20 dollars per Terabyte (1000GB).

---

## Types of rules

Let's deep further into the service itself. Azure Firewalls knows 3 types of rules you can create:

|  |  |  |
| --- | --- | --- |
| **Type** | **Goal** | **Example** |
| DNAT Rule | Allowing traffic from the internet | Port forwarding   Make your internal server available for the internet |
| Network Rule | Allowing/Disallowing traffic between whole networks/subnets | Block outbound traffic for one subnet   DMZ configuration |
| Application Rule | Allowing/Disallowing traffic to certain FQDNs or web categories | Blocking a website   Only allow certain websites/FQDN |

### Rule processing order

Like standard firewalls, Azure Firewall has a processing order of processing those rules which you have to keep in mind when designing and configuring the different rules:

1. DNAT
2. Network
3. Application

The golden rule of Azure Firewall is: the first rule that matches, is being used.

This means that if you create a network rule that allows your complete Azure network outbound traffic to the internet but you want to block something with application rules, that this is not possible. This because there is a broad rule that already allowed the traffic and so the other rules aren't processed.

---

## Rule Collections

Azure Firewall works with "Rule Collections". This is a set of rules which can be applied to the firewall instances. Rule Collections are then categorized into Rule Collection Groups which are the default groups:

- DefaultDNATRuleCollectionGroup
- DefaultNetworkRuleCollectionGroup
- DefaultApplicationRuleCollectionGroup

How this translates into the different aspects is shown by the diagram below:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/what-is-azure-firewall-2107/jv-media-2107-0f8dfd879dc3.png)

---

## Firewall and Policies

Azure Firewall works with Firewall Policies. A policy is the set with rules that your firewall must use to filter traffic and can be re-used over multiple Azure Firewall instances. You can only assign one policy per Firewall instance. This is by design of course.

---

## Extra security options (Premium only)

When using the more expensive Premium SKU of Azure Firewall, we have the 3 extra options below available to use.

### TLS inspection

TLS inspection allows the firewall to decrypt, inspect, and then re-encrypt HTTPS (TLS) traffic passing through it. The key point of this inspection task is to inspect the traffic and block threats, even when the traffic is normally encrypted.

How it works in simplified steps:

1. Client sends HTTPS request and Azure Firewall intercepts it
2. Firewall presents its own certificate to the client (it acts as a man-in-the-middle proxy)
3. Traffic is decrypted and inspected for threats using threat intelligence, signature-based detection, etc
4. The Firewall re-encrypts the traffic and forwards it to the destination

This requires you to setup an Public Key Infrastructure and is not used very often.

### IDPS

IDPS stands for Intrusion Detection and Preventing System and is mostly used to defend against security threats. It uses a signature-based database of well-known threats and can so very fast determine if specific packets must be blocked.

It very much does:

1. Packet Inspection of inbound and outbound traffic
2. Signature matching
3. Alert generation of discovered matches
4. Blocking the traffic

### Threat Intelligence

Threat Intelligence is an option in the Azure Firewall Premium SKU and block and alerts traffic from or to malicious IP addresses and domains. This list of known malicious IP addresses, FQDNs and domains are sourced by Microsoft themselves.

It is basically an option you can enable or disable. You can use it for testing with the "Alert only" option.

---

## Private IP Ranges (SNAT)

You can configure Source Network Address Translation (SNAT) in Azure Firewall. This means that your internal IP address is translated to your outbound IP address. A remote server in another country can do nothing with your internal IP addresses, so it has to be translated.

To clarify this process:

Your workstation in Azure has private IP 10.1.0.5, and when communicating to another server on the internet this address has to be translated. This is because 10.1.0.5 is in the private IP addresses range of RFC1918. Azure Firewall automatically translates this into his public IP addresses so the remote host only sees the assigned public IP address, in this case the fictional 172.172.172.172 address.

Your home router from your provider does the same thing. Translating internal IP addresses to External IP addresses.

---

## Summary

Azure Firewall is a great cloud-native firewalling solution if your network needs one. It works without an extra, completely different interface like a 3rd party firewall.

In my honest opinion, I like the Firewall solution but for what it is capable of but is very expensive. You must have a moderate to big network in Azure to make it profitable and not be more expensive than your VMs and VPN gateway alone.

Thank you for reading this guide. Next week we will do a deep dive into the Azure Firewall deployment, configuration and setup in Azure.

{{< ads >}}

{{< article-footer >}}
