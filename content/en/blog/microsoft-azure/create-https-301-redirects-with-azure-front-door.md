---
title: "Create HTTPS 301 redirects with Azure Front Door"
date: 2026-02-19
slug: "create-https-301-redirects-with-azure-front-door"
categories:
  - Microsoft Azure
tags:
  - Step by Step guides
description: >
  In this post, I will explain how I redirect my domains and subdomains to websites and parts of my website. If you ever visited my tools...
---
In this post, I will explain how I redirect my domains and subdomains to websites and parts of my website. If you ever visited my tools page at <https://justinverstijnen.nl/tools>, you will see I have shortcuts to my tools themselves, although they are not directly linked to the instances.

In this post I will explain how this is done, how to setup Azure Front Door to do this and how to create your own redirects from the Azure Portal.

---

## Requirements

For this solution, you need the following stuff:

- An Azure Subscription
- A domain name or multiple domain names, which may also be subdomains (subdomain.domain.com)
- Some HTTPS knowledge
- Some Azure knowledge

---

## The solution explained

I will explain how I have made the shortcuts to my tools at <https://justinverstijnen.nl/tools>, as this is something what Azure Front Door can do for you.

In short, Azure Front Door is a load balancer/CDN application with a lot of load balancing options to distribute load onto your backend. In this guide we will use a simple part, only redirecting traffic using 301 rules, but if interested, its a very nice application.

<!-- draw.io diagram -->
<div class="mxgraph" style="max-width:100%;border:1px solid transparent;" data-mxgraph="{&quot;highlight&quot;:&quot;#0000ff&quot;,&quot;nav&quot;:true,&quot;resize&quot;:true,&quot;dark-mode&quot;:&quot;auto&quot;,&quot;toolbar&quot;:&quot;zoom layers tags lightbox&quot;,&quot;xml&quot;:&quot;&lt;mxfile host=\&quot;Electron\&quot; agent=\&quot;Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) draw.io/29.2.9 Chrome/140.0.7339.249 Electron/38.7.2 Safari/537.36\&quot; version=\&quot;29.2.9\&quot;&gt;\n  &lt;diagram name=\&quot;Page-1\&quot; id=\&quot;oPxF6FM6g9PLCuX1oC1M\&quot;&gt;\n    &lt;mxGraphModel dx=\&quot;1426\&quot; dy=\&quot;841\&quot; grid=\&quot;1\&quot; gridSize=\&quot;10\&quot; guides=\&quot;1\&quot; tooltips=\&quot;1\&quot; connect=\&quot;1\&quot; arrows=\&quot;1\&quot; fold=\&quot;1\&quot; page=\&quot;1\&quot; pageScale=\&quot;1\&quot; pageWidth=\&quot;583\&quot; pageHeight=\&quot;413\&quot; math=\&quot;0\&quot; shadow=\&quot;0\&quot;&gt;\n      &lt;root&gt;\n        &lt;mxCell id=\&quot;0\&quot; /&gt;\n        &lt;mxCell id=\&quot;1\&quot; parent=\&quot;0\&quot; /&gt;\n        &lt;mxCell id=\&quot;0KtzIqHoexxdDds4-QD--1\&quot; parent=\&quot;1\&quot; style=\&quot;image;aspect=fixed;html=1;points=[];align=center;fontSize=12;image=img/lib/azure2/preview/Static_Apps.svg;\&quot; value=\&quot;7. DNSMegatool&amp;lt;div&amp;gt;&amp;lt;span style=&amp;quot;background-color: light-dark(#ffffff, var(--ge-dark-color, #121212)); color: light-dark(rgb(0, 0, 0), rgb(255, 255, 255));&amp;quot;&amp;gt;(tools.justinverstijnen.nl/dnsmegatool)&amp;lt;/span&amp;gt;&amp;lt;/div&amp;gt;\&quot; vertex=\&quot;1\&quot;&gt;\n          &lt;mxGeometry height=\&quot;54\&quot; width=\&quot;68\&quot; x=\&quot;960\&quot; y=\&quot;63.000000000000014\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;0KtzIqHoexxdDds4-QD--2\&quot; parent=\&quot;1\&quot; style=\&quot;image;aspect=fixed;html=1;points=[];align=center;fontSize=12;image=img/lib/azure2/networking/Front_Doors.svg;\&quot; value=\&quot;5. Azure Front Door\&quot; vertex=\&quot;1\&quot;&gt;\n          &lt;mxGeometry height=\&quot;60\&quot; width=\&quot;68\&quot; x=\&quot;630\&quot; y=\&quot;59.999999999999986\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;0KtzIqHoexxdDds4-QD--3\&quot; parent=\&quot;1\&quot; style=\&quot;points=[[0.13,0.02,0],[0.5,0,0],[0.87,0.02,0],[0.885,0.4,0],[0.985,0.985,0],[0.5,1,0],[0.015,0.985,0],[0.115,0.4,0]];verticalLabelPosition=bottom;sketch=0;html=1;verticalAlign=top;aspect=fixed;align=center;pointerEvents=1;shape=mxgraph.cisco19.laptop2;fillColor=#fafafa;strokeColor=#005073;\&quot; value=\&quot;1. Client\&quot; vertex=\&quot;1\&quot;&gt;\n          &lt;mxGeometry height=\&quot;67\&quot; width=\&quot;95.71\&quot; x=\&quot;50\&quot; y=\&quot;62.55\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;0KtzIqHoexxdDds4-QD--4\&quot; edge=\&quot;1\&quot; parent=\&quot;1\&quot; style=\&quot;shape=flexArrow;endArrow=classic;html=1;rounded=0;fillColor=#1ba1e2;strokeColor=#006EAF;flowAnimation=1;\&quot; value=\&quot;\&quot;&gt;\n          &lt;mxGeometry height=\&quot;50\&quot; relative=\&quot;1\&quot; width=\&quot;50\&quot; as=\&quot;geometry\&quot;&gt;\n            &lt;mxPoint x=\&quot;170\&quot; y=\&quot;89.55\&quot; as=\&quot;sourcePoint\&quot; /&gt;\n            &lt;mxPoint x=\&quot;334.29\&quot; y=\&quot;89.55\&quot; as=\&quot;targetPoint\&quot; /&gt;\n          &lt;/mxGeometry&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;0KtzIqHoexxdDds4-QD--5\&quot; parent=\&quot;1\&quot; style=\&quot;text;html=1;whiteSpace=wrap;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;rounded=0;\&quot; value=\&quot;2. Types in:&amp;lt;div&amp;gt;dnsmegatool.jvapp.nl&amp;lt;/div&amp;gt;\&quot; vertex=\&quot;1\&quot;&gt;\n          &lt;mxGeometry height=\&quot;30\&quot; width=\&quot;60\&quot; x=\&quot;220\&quot; y=\&quot;109.55\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;0KtzIqHoexxdDds4-QD--6\&quot; parent=\&quot;1\&quot; style=\&quot;points=[];aspect=fixed;html=1;align=center;shadow=0;dashed=0;fillColor=#1ba1e2;strokeColor=#006EAF;shape=mxgraph.alibaba_cloud.dns_domain_name_system;fontColor=#ffffff;\&quot; value=\&quot;&amp;lt;div&amp;gt;&amp;lt;font style=&amp;quot;color: rgb(255, 255, 255);&amp;quot;&amp;gt;&amp;lt;br&amp;gt;&amp;lt;/font&amp;gt;&amp;lt;/div&amp;gt;&amp;lt;div&amp;gt;&amp;lt;font style=&amp;quot;color: rgb(255, 255, 255);&amp;quot;&amp;gt;&amp;lt;br&amp;gt;&amp;lt;/font&amp;gt;&amp;lt;/div&amp;gt;&amp;lt;div&amp;gt;&amp;lt;font style=&amp;quot;color: rgb(255, 255, 255);&amp;quot;&amp;gt;&amp;lt;br&amp;gt;&amp;lt;/font&amp;gt;&amp;lt;/div&amp;gt;&amp;lt;div&amp;gt;&amp;lt;font style=&amp;quot;color: rgb(255, 255, 255);&amp;quot;&amp;gt;&amp;lt;br&amp;gt;&amp;lt;/font&amp;gt;&amp;lt;/div&amp;gt;&amp;lt;div&amp;gt;&amp;lt;font style=&amp;quot;color: rgb(255, 255, 255);&amp;quot;&amp;gt;&amp;lt;br&amp;gt;&amp;lt;/font&amp;gt;&amp;lt;/div&amp;gt;&amp;lt;div&amp;gt;&amp;lt;font style=&amp;quot;color: rgb(255, 255, 255);&amp;quot;&amp;gt;&amp;lt;br&amp;gt;&amp;lt;/font&amp;gt;&amp;lt;/div&amp;gt;&amp;lt;div&amp;gt;&amp;lt;font style=&amp;quot;color: rgb(255, 255, 255);&amp;quot;&amp;gt;&amp;lt;br&amp;gt;&amp;lt;/font&amp;gt;&amp;lt;/div&amp;gt;&amp;lt;div&amp;gt;&amp;lt;font style=&amp;quot;color: rgb(255, 255, 255);&amp;quot;&amp;gt;&amp;lt;br&amp;gt;&amp;lt;/font&amp;gt;&amp;lt;/div&amp;gt;&amp;lt;div&amp;gt;&amp;lt;font style=&amp;quot;color: rgb(255, 255, 255);&amp;quot;&amp;gt;3. DNS resolves to&amp;lt;/font&amp;gt;&amp;lt;/div&amp;gt;&amp;lt;div&amp;gt;&amp;lt;font style=&amp;quot;color: rgb(255, 255, 255);&amp;quot;&amp;gt;Azure Front Door&amp;lt;/font&amp;gt;&amp;lt;/div&amp;gt;\&quot; vertex=\&quot;1\&quot;&gt;\n          &lt;mxGeometry height=\&quot;54.900000000000006\&quot; width=\&quot;55.800000000000004\&quot; x=\&quot;370\&quot; y=\&quot;62.55\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;0KtzIqHoexxdDds4-QD--7\&quot; edge=\&quot;1\&quot; parent=\&quot;1\&quot; style=\&quot;shape=flexArrow;endArrow=classic;html=1;rounded=0;fillColor=#1ba1e2;strokeColor=#006EAF;flowAnimation=1;\&quot; value=\&quot;\&quot;&gt;\n          &lt;mxGeometry height=\&quot;50\&quot; relative=\&quot;1\&quot; width=\&quot;50\&quot; as=\&quot;geometry\&quot;&gt;\n            &lt;mxPoint x=\&quot;450\&quot; y=\&quot;89.49999999999999\&quot; as=\&quot;sourcePoint\&quot; /&gt;\n            &lt;mxPoint x=\&quot;614.29\&quot; y=\&quot;89.49999999999999\&quot; as=\&quot;targetPoint\&quot; /&gt;\n          &lt;/mxGeometry&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;0KtzIqHoexxdDds4-QD--8\&quot; parent=\&quot;1\&quot; style=\&quot;text;html=1;whiteSpace=wrap;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;rounded=0;\&quot; value=\&quot;4. DNS leads client to&amp;lt;div&amp;gt;Azure Front Door&amp;lt;/div&amp;gt;\&quot; vertex=\&quot;1\&quot;&gt;\n          &lt;mxGeometry height=\&quot;30\&quot; width=\&quot;130\&quot; x=\&quot;460\&quot; y=\&quot;109.55\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;0KtzIqHoexxdDds4-QD--9\&quot; edge=\&quot;1\&quot; parent=\&quot;1\&quot; style=\&quot;shape=flexArrow;endArrow=classic;html=1;rounded=0;fillColor=#1ba1e2;strokeColor=#006EAF;flowAnimation=1;\&quot; value=\&quot;\&quot;&gt;\n          &lt;mxGeometry height=\&quot;50\&quot; relative=\&quot;1\&quot; width=\&quot;50\&quot; as=\&quot;geometry\&quot;&gt;\n            &lt;mxPoint x=\&quot;720\&quot; y=\&quot;89.49999999999999\&quot; as=\&quot;sourcePoint\&quot; /&gt;\n            &lt;mxPoint x=\&quot;940\&quot; y=\&quot;89.55\&quot; as=\&quot;targetPoint\&quot; /&gt;\n          &lt;/mxGeometry&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;0KtzIqHoexxdDds4-QD--10\&quot; parent=\&quot;1\&quot; style=\&quot;text;html=1;whiteSpace=wrap;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;rounded=0;\&quot; value=\&quot;6. AFD rule set leads client with 301 to correct instance\&quot; vertex=\&quot;1\&quot;&gt;\n          &lt;mxGeometry height=\&quot;30\&quot; width=\&quot;150\&quot; x=\&quot;730\&quot; y=\&quot;109.55\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n      &lt;/root&gt;\n    &lt;/mxGraphModel&gt;\n  &lt;/diagram&gt;\n&lt;/mxfile&gt;\n&quot;}"></div>
<script type="text/javascript" src="https://viewer.diagrams.net/js/viewer-static.min.js"></script>

1. Our client is our desktop, laptop or mobile phone with an internet browser
2. This client will request the URL [dnsmegatool.jvapp.nl](https://dnsmegatool.jvapp.nl)
3. A simple DNS lookup explains this (sub)domain can be found on Azure (*jvshortcuts-to-jvtools-eha7cua0hqhnd4gk.z01.azurefd.net*)
4. The client will lookup Azure as he now knows the address
5. Azure Front Door accepted the request and will route the request to the rule set
6. The rule set will be checked if any rule exists with this parameters
7. The rule has been found and the client will get a HTTPS 301 redirect to the correct URL: tools.justinverstijnen.nl/dnsmegatool.nl

This effectively results in this (check the URL being changed automatically):

[Video](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/create-https-301-redirects-with-azure-front-door-6467/jv-media-6467-f3dc4c1b1788.mp4)

Now that we know what happens under the hood, let's configure this cool stuff.

---

## Step 1: Create Azure Front Door

At first we must configure our Azure Front Door instance as this will be our hub and configuration plane for 301 redirects and managing our load distribution.

Open up the Azure Portal and go to "Azure Front Door". Create a new instance there.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/create-https-301-redirects-with-azure-front-door-6467/jv-media-6467-70a1d9da49e2.png)

As the note describes, every change will take up to 45 minutes to be effective. This was also the case when I was configuring it, so we must have a little patience but it will be worth it.

I selected the "Custom create" option here, as we need a minimal instance.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/create-https-301-redirects-with-azure-front-door-6467/jv-media-6467-33968d72ccf6.png)

At the first page, fill in your details and select a Tier. I will use the Standard tier. The costs will be around:

- 35$ per month for Standard
- 330$ per month for Premium

Source: <https://azure.microsoft.com/en-in/pricing/details/frontdoor/?msockid=0e4eda4e5e6161d61121ccd95f0d60f5>

Go to the "Endpoint" tab.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/create-https-301-redirects-with-azure-front-door-6467/jv-media-6467-8a553473ac1c.png)

Give your Endpoint a name. This is the name you will redirect your hostname (CNAME) records to.

After creating the Endpoint, we must create a route.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/create-https-301-redirects-with-azure-front-door-6467/jv-media-6467-95eb69784a00.png)

Click "+ Add a route" to create a new route.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/create-https-301-redirects-with-azure-front-door-6467/jv-media-6467-c3a8b8be5fde.png)

Give the route a name and fill in the following fields:

- **Patterns to match:** /\*
- **Accepted protocols:** HTTP and HTTPS
- **Redirect all traffic to use HTTPS:** Enabled

Then create a new origin group. This doesn't do anything in our case but must be created.

After creating the origin group, finish the wizard to create the Azure Front Door instance, and we will be ready to go.

---

## Step 2: Configure the rule set

After the Azure Front Door instance has finished deploying, we can create a Rule set. This can be found in the Azure Portal under your instance:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/create-https-301-redirects-with-azure-front-door-6467/jv-media-6467-93f2b52953ee.png)

Create a new rule set here by clicking "+ Add". Give the set a name after that.

The rule set is exactly what it is called, a set of rules your load balancing solution will follow. We will create the redirection rules here by basically saying:

- Client request: dnsmegatool.jvapp.nl
- Redirect to: tools.justinverstijnen.nl/dnsmegatool

Basically a if-then (do that) strategy. Let's create such rule step by step.

Click the "+ Add rule" button. A new block will appear.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/create-https-301-redirects-with-azure-front-door-6467/jv-media-6467-5f3b11583466.png)

Now click the "Add a condition" button to add a trigger, which will be "Request header"

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/create-https-301-redirects-with-azure-front-door-6467/jv-media-6467-647ae4abeb06.png)

Fill in the fields as following:

- **Header name:** Host
- **Operator:** Equal
- **Header value:** dnsmegatool.jvapp.nl (the URL before redirect)

It will look like this:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/create-https-301-redirects-with-azure-front-door-6467/jv-media-6467-235030dc5c99.png)

The click the "+ Add an action" button to decide on what to do when a client requests your URL:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/create-https-301-redirects-with-azure-front-door-6467/jv-media-6467-48cbb62f499d.png)

Select the "URL redirect" option and fill in the fields:

- **Redirect type:** Moved (301)
- **Redirect protocol:** HTTPS
- **Destination host:** tools.justinverstijnen.nl
- **Destination path:** /dnsmegatool (only use this if the site is not at the top level of the domain)

Then enable the "Stop evaluating remaining rules" option to stop processing after this rule has applied.

The full rule looks like this:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/create-https-301-redirects-with-azure-front-door-6467/jv-media-6467-34b27ecbb5d7.png)

Now we can update the rule/rule set and do the rest of the configurations.

---

## Step 3: Custom domain configuration

How we have configured that we want domain A to link to domain B, but Azure requires us to validate the ownership of domain A before able to set redirections.

In the Azure Front Door instance, go to "Domains" and "+ Add" a domain here.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/create-https-301-redirects-with-azure-front-door-6467/jv-media-6467-06341a4bc05e.png)

Fill in your desired domain name and click on "Add". We now have to do a validation step on your domain by creating a TXT record.

Wait for a minute or so for the portal to complete the domain add action, and go to the "Domain validation section":

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/create-https-301-redirects-with-azure-front-door-6467/jv-media-6467-f8659a2f2d88.png)

Click on the Pending state to unveil the steps and information for the validation:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/create-https-301-redirects-with-azure-front-door-6467/jv-media-6467-2a3ba77584ad.png)

In this case, we must create a TXT record at our DNS hosting with this information:

- **Record name**: \_dnsauth.dnsmegatool (domain will automatically be filled in)
- **Record value:** \_lc61dvdc5cbbuco7ltdmiw6xls94ec4

Let's do this:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/create-https-301-redirects-with-azure-front-door-6467/jv-media-6467-7a16d15cac67.png)

Save the record, and wait for a few minutes. The Azure Portal will automatically validate your domain. This can take up to 24 hours.

In the meanwhile, now we have all our systems open, we can also create the CNAME record which will route our domain to Azure Front Door. In Azure Front Door collect your full Endpoint hostname, which is on the Overview page:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/create-https-301-redirects-with-azure-front-door-6467/jv-media-6467-7ce388a20704.png)

Copy that value and head back to your DNS hosting.

Create a new CNAME record with this information:

- **Name:** dnsmegatool
- **Type:** CNAME
- **Value:** jvshortcuts-to-jvtools-eha7cua0hqhnd4gk.z01.azurefd.net**.**

{{% alert color="info" %}}
Make sure to end the value with a **trailing dot** (.), as this is a hostname externally to your DNS zone.
{{% /alert %}}
![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/create-https-301-redirects-with-azure-front-door-6467/jv-media-6467-b7b8339fc864.png)

Save the DNS configuration, and your complete setup will now work in around 45 to 60 minutes.

This domain configuration has to be done for every domain and subdomain Azure Front Door must redirect. This is by design due to domain security.

---

## Summary

Azure Front Door is a great solution for managing redirects for your webservers and tools in a central dashboard. Its a serverless solution so no patching or maintenance is needed. Only the configuration has to be done.

Azure Front Door does also manage your SSL certificates used in the redirections which is really nice.

Thank you for visiting this guide and I hope it wass helpful.

### Sources

These sources helped me by writing and research for this post;

1. <https://azure.microsoft.com/en-in/pricing/details/frontdoor/?msockid=0e4eda4e5e6161d61121ccd95f0d60f5>
2. <https://learn.microsoft.com/en-us/azure/frontdoor/front-door-url-redirect?pivots=front-door-standard-premium>

{{< ads >}}

{{< article-footer >}}
