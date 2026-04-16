---
title: "Upload multiple Github repositories into a single Azure Static Web App"
date: 2026-01-15
slug: "upload-multiple-github-repositories-into-a-single-azure-static-web-app"
categories:
  - GitHub
tags:
  - Step by Step guides
description: >
  In this guide, I will describe how I host multiple Github applications/tools into one single Static Web App environment in Azure. Ths...
---
In the past few weeks, I have been busy on scaling up my tools and the backend hosting of the tools. For the last year, I used multiple Static Web Apps on Azure for this, but this took a lot of time administering and creating them. I thought about a better and more scalable manner of hosting tools, minimizing the amount of hosts needed, uniforming URLs and shortcodes with Azure Front Door (guide coming up) andlinking multiple GitHub repositories into one for central management.

In this guide, I will describe how I now host multiple Github applications/tools into one single Static Web App environment in Azure. This mostly captures the simple, single task, tools which can be found on my website:

- <https://justinverstijnen.nl/tools> or [jvapp.nl](https://jvapp.nl) if you need a shortcut.

Because I started with a single tool, then built another and another and another one, I needed a sort of scalable way of doing this. Each tool means doing the following stuff:

- Creating a repo
- Creating a static web app
- Creating a DNS record

In this guide, I will describe the steps I have taken to accomplish what I've built now. A single Static Web App instance with all my tools running.

---

## The GitHub repository topology

To prepare for this setup, we need to have our GitHub repository topology right. I already had all my tools in place. Then I have built my repositories to be as the following diagram:

<!-- draw.io diagram -->
<div class="mxgraph" style="max-width:100%;border:1px solid transparent;" data-mxgraph="{&quot;highlight&quot;:&quot;#0000ff&quot;,&quot;nav&quot;:true,&quot;resize&quot;:true,&quot;dark-mode&quot;:&quot;auto&quot;,&quot;toolbar&quot;:&quot;zoom layers tags lightbox&quot;,&quot;xml&quot;:&quot;&lt;mxfile host=\&quot;app.diagrams.net\&quot; agent=\&quot;Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0\&quot; version=\&quot;29.2.6\&quot;&gt;\n  &lt;diagram name=\&quot;Pagina-1\&quot; id=\&quot;kgMNGjOKfP83IaQQGoJy\&quot;&gt;\n    &lt;mxGraphModel dx=\&quot;1668\&quot; dy=\&quot;889\&quot; grid=\&quot;1\&quot; gridSize=\&quot;10\&quot; guides=\&quot;1\&quot; tooltips=\&quot;1\&quot; connect=\&quot;1\&quot; arrows=\&quot;1\&quot; fold=\&quot;1\&quot; page=\&quot;1\&quot; pageScale=\&quot;1\&quot; pageWidth=\&quot;1169\&quot; pageHeight=\&quot;827\&quot; math=\&quot;0\&quot; shadow=\&quot;0\&quot;&gt;\n      &lt;root&gt;\n        &lt;mxCell id=\&quot;0\&quot; /&gt;\n        &lt;mxCell id=\&quot;1\&quot; parent=\&quot;0\&quot; /&gt;\n        &lt;mxCell id=\&quot;XSxGGIhykkzDO1VBaNjo-5\&quot; parent=\&quot;1\&quot; style=\&quot;dashed=0;outlineConnect=0;html=1;align=center;labelPosition=center;verticalLabelPosition=bottom;verticalAlign=top;shape=mxgraph.webicons.github;gradientColor=#DFDEDE\&quot; value=\&quot;&amp;lt;span style=&amp;quot;background-color: light-dark(#ffffff, var(--ge-dark-color, #121212));&amp;quot;&amp;gt;DNSMegaTool&amp;lt;/span&amp;gt;\&quot; vertex=\&quot;1\&quot;&gt;\n          &lt;mxGeometry height=\&quot;102.4\&quot; width=\&quot;102.4\&quot; x=\&quot;213\&quot; y=\&quot;60\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;XSxGGIhykkzDO1VBaNjo-6\&quot; parent=\&quot;1\&quot; style=\&quot;dashed=0;outlineConnect=0;html=1;align=center;labelPosition=center;verticalLabelPosition=bottom;verticalAlign=top;shape=mxgraph.webicons.github;gradientColor=#DFDEDE\&quot; value=\&quot;&amp;lt;span style=&amp;quot;background-color: light-dark(#ffffff, var(--ge-dark-color, #121212));&amp;quot;&amp;gt;SubnetCalculator&amp;lt;/span&amp;gt;\&quot; vertex=\&quot;1\&quot;&gt;\n          &lt;mxGeometry height=\&quot;102.4\&quot; width=\&quot;102.4\&quot; x=\&quot;373\&quot; y=\&quot;60\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;XSxGGIhykkzDO1VBaNjo-7\&quot; parent=\&quot;1\&quot; style=\&quot;dashed=0;outlineConnect=0;html=1;align=center;labelPosition=center;verticalLabelPosition=bottom;verticalAlign=top;shape=mxgraph.webicons.github;gradientColor=#DFDEDE\&quot; value=\&quot;&amp;lt;span style=&amp;quot;background-color: light-dark(#ffffff, var(--ge-dark-color, #121212));&amp;quot;&amp;gt;365RecordsGenerator&amp;lt;/span&amp;gt;\&quot; vertex=\&quot;1\&quot;&gt;\n          &lt;mxGeometry height=\&quot;102.4\&quot; width=\&quot;102.4\&quot; x=\&quot;533\&quot; y=\&quot;60\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;XSxGGIhykkzDO1VBaNjo-8\&quot; parent=\&quot;1\&quot; style=\&quot;dashed=0;outlineConnect=0;html=1;align=center;labelPosition=center;verticalLabelPosition=bottom;verticalAlign=top;shape=mxgraph.webicons.github;gradientColor=#DFDEDE\&quot; value=\&quot;&amp;lt;span style=&amp;quot;background-color: light-dark(#ffffff, var(--ge-dark-color, #121212));&amp;quot;&amp;gt;PasswordGenerator&amp;lt;/span&amp;gt;\&quot; vertex=\&quot;1\&quot;&gt;\n          &lt;mxGeometry height=\&quot;102.4\&quot; width=\&quot;102.4\&quot; x=\&quot;703\&quot; y=\&quot;60\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;XSxGGIhykkzDO1VBaNjo-9\&quot; parent=\&quot;1\&quot; style=\&quot;dashed=0;outlineConnect=0;html=1;align=center;labelPosition=center;verticalLabelPosition=bottom;verticalAlign=top;shape=mxgraph.webicons.github;gradientColor=#DFDEDE\&quot; value=\&quot;&amp;lt;span style=&amp;quot;background-color: light-dark(#ffffff, var(--ge-dark-color, #121212));&amp;quot;&amp;gt;TenantLookup&amp;lt;/span&amp;gt;\&quot; vertex=\&quot;1\&quot;&gt;\n          &lt;mxGeometry height=\&quot;102.4\&quot; width=\&quot;102.4\&quot; x=\&quot;853\&quot; y=\&quot;60\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;XSxGGIhykkzDO1VBaNjo-10\&quot; edge=\&quot;1\&quot; parent=\&quot;1\&quot; style=\&quot;endArrow=none;dashed=1;html=1;dashPattern=1 3;strokeWidth=2;rounded=0;flowAnimation=1;strokeColor=light-dark(#000000,#000000);\&quot; target=\&quot;XSxGGIhykkzDO1VBaNjo-15\&quot; value=\&quot;\&quot;&gt;\n          &lt;mxGeometry height=\&quot;50\&quot; relative=\&quot;1\&quot; width=\&quot;50\&quot; as=\&quot;geometry\&quot;&gt;\n            &lt;Array as=\&quot;points\&quot;&gt;\n              &lt;mxPoint x=\&quot;264\&quot; y=\&quot;413\&quot; /&gt;\n            &lt;/Array&gt;\n            &lt;mxPoint x=\&quot;263.7\&quot; y=\&quot;190\&quot; as=\&quot;sourcePoint\&quot; /&gt;\n            &lt;mxPoint x=\&quot;263.7\&quot; y=\&quot;290\&quot; as=\&quot;targetPoint\&quot; /&gt;\n          &lt;/mxGeometry&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;XSxGGIhykkzDO1VBaNjo-11\&quot; edge=\&quot;1\&quot; parent=\&quot;1\&quot; style=\&quot;endArrow=none;dashed=1;html=1;dashPattern=1 3;strokeWidth=2;rounded=0;flowAnimation=1;strokeColor=light-dark(#000000,#000000);\&quot; target=\&quot;XSxGGIhykkzDO1VBaNjo-15\&quot; value=\&quot;\&quot;&gt;\n          &lt;mxGeometry height=\&quot;50\&quot; relative=\&quot;1\&quot; width=\&quot;50\&quot; as=\&quot;geometry\&quot;&gt;\n            &lt;Array as=\&quot;points\&quot;&gt;\n              &lt;mxPoint x=\&quot;424\&quot; y=\&quot;413\&quot; /&gt;\n            &lt;/Array&gt;\n            &lt;mxPoint x=\&quot;423.7\&quot; y=\&quot;190\&quot; as=\&quot;sourcePoint\&quot; /&gt;\n            &lt;mxPoint x=\&quot;423.7\&quot; y=\&quot;290\&quot; as=\&quot;targetPoint\&quot; /&gt;\n          &lt;/mxGeometry&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;XSxGGIhykkzDO1VBaNjo-12\&quot; edge=\&quot;1\&quot; parent=\&quot;1\&quot; style=\&quot;endArrow=none;dashed=1;html=1;dashPattern=1 3;strokeWidth=2;rounded=0;flowAnimation=1;strokeColor=light-dark(#000000,#000000);\&quot; target=\&quot;XSxGGIhykkzDO1VBaNjo-15\&quot; value=\&quot;\&quot;&gt;\n          &lt;mxGeometry height=\&quot;50\&quot; relative=\&quot;1\&quot; width=\&quot;50\&quot; as=\&quot;geometry\&quot;&gt;\n            &lt;mxPoint x=\&quot;584\&quot; y=\&quot;190\&quot; as=\&quot;sourcePoint\&quot; /&gt;\n            &lt;mxPoint x=\&quot;584\&quot; y=\&quot;290\&quot; as=\&quot;targetPoint\&quot; /&gt;\n          &lt;/mxGeometry&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;XSxGGIhykkzDO1VBaNjo-13\&quot; edge=\&quot;1\&quot; parent=\&quot;1\&quot; style=\&quot;endArrow=none;dashed=1;html=1;dashPattern=1 3;strokeWidth=2;rounded=0;flowAnimation=1;strokeColor=light-dark(#000000,#000000);\&quot; target=\&quot;XSxGGIhykkzDO1VBaNjo-15\&quot; value=\&quot;\&quot;&gt;\n          &lt;mxGeometry height=\&quot;50\&quot; relative=\&quot;1\&quot; width=\&quot;50\&quot; as=\&quot;geometry\&quot;&gt;\n            &lt;Array as=\&quot;points\&quot;&gt;\n              &lt;mxPoint x=\&quot;754\&quot; y=\&quot;413\&quot; /&gt;\n            &lt;/Array&gt;\n            &lt;mxPoint x=\&quot;753.7\&quot; y=\&quot;190\&quot; as=\&quot;sourcePoint\&quot; /&gt;\n            &lt;mxPoint x=\&quot;753.7\&quot; y=\&quot;290\&quot; as=\&quot;targetPoint\&quot; /&gt;\n          &lt;/mxGeometry&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;XSxGGIhykkzDO1VBaNjo-14\&quot; edge=\&quot;1\&quot; parent=\&quot;1\&quot; style=\&quot;endArrow=none;dashed=1;html=1;dashPattern=1 3;strokeWidth=2;rounded=0;flowAnimation=1;strokeColor=light-dark(#000000,#000000);\&quot; target=\&quot;XSxGGIhykkzDO1VBaNjo-15\&quot; value=\&quot;\&quot;&gt;\n          &lt;mxGeometry height=\&quot;50\&quot; relative=\&quot;1\&quot; width=\&quot;50\&quot; as=\&quot;geometry\&quot;&gt;\n            &lt;Array as=\&quot;points\&quot;&gt;\n              &lt;mxPoint x=\&quot;904\&quot; y=\&quot;413\&quot; /&gt;\n            &lt;/Array&gt;\n            &lt;mxPoint x=\&quot;903.7\&quot; y=\&quot;190\&quot; as=\&quot;sourcePoint\&quot; /&gt;\n            &lt;mxPoint x=\&quot;903.7\&quot; y=\&quot;290\&quot; as=\&quot;targetPoint\&quot; /&gt;\n          &lt;/mxGeometry&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;XSxGGIhykkzDO1VBaNjo-15\&quot; parent=\&quot;1\&quot; style=\&quot;dashed=0;outlineConnect=0;html=1;align=center;labelPosition=center;verticalLabelPosition=bottom;verticalAlign=top;shape=mxgraph.webicons.github;fillColor=#fad9d5;strokeColor=#ae4132;\&quot; value=\&quot;&amp;lt;span style=&amp;quot;background-color: light-dark(#ffffff, var(--ge-dark-color, #121212));&amp;quot;&amp;gt;swa-jv-tools&amp;lt;/span&amp;gt;\&quot; vertex=\&quot;1\&quot;&gt;\n          &lt;mxGeometry height=\&quot;102.4\&quot; width=\&quot;97\&quot; x=\&quot;533\&quot; y=\&quot;400\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;XSxGGIhykkzDO1VBaNjo-17\&quot; edge=\&quot;1\&quot; parent=\&quot;1\&quot; style=\&quot;endArrow=none;dashed=1;html=1;dashPattern=1 3;strokeWidth=2;rounded=0;flowAnimation=1;strokeColor=light-dark(#000000,#000000);\&quot; value=\&quot;\&quot;&gt;\n          &lt;mxGeometry height=\&quot;50\&quot; relative=\&quot;1\&quot; width=\&quot;50\&quot; as=\&quot;geometry\&quot;&gt;\n            &lt;mxPoint x=\&quot;585\&quot; y=\&quot;530\&quot; as=\&quot;sourcePoint\&quot; /&gt;\n            &lt;mxPoint x=\&quot;585\&quot; y=\&quot;630\&quot; as=\&quot;targetPoint\&quot; /&gt;\n          &lt;/mxGeometry&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;XSxGGIhykkzDO1VBaNjo-18\&quot; parent=\&quot;1\&quot; style=\&quot;image;aspect=fixed;html=1;points=[];align=center;fontSize=12;image=img/lib/azure2/preview/Static_Apps.svg;\&quot; value=\&quot;swa-jv-tools\&quot; vertex=\&quot;1\&quot;&gt;\n          &lt;mxGeometry height=\&quot;54\&quot; width=\&quot;68\&quot; x=\&quot;551\&quot; y=\&quot;640\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;XSxGGIhykkzDO1VBaNjo-19\&quot; parent=\&quot;1\&quot; style=\&quot;text;html=1;whiteSpace=wrap;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;rounded=0;rotation=90;\&quot; value=\&quot;&amp;lt;span style=&amp;quot;background-color: light-dark(#ffffff, var(--ge-dark-color, #121212));&amp;quot;&amp;gt;GitHub Action&amp;lt;/span&amp;gt;\&quot; vertex=\&quot;1\&quot;&gt;\n          &lt;mxGeometry height=\&quot;30\&quot; width=\&quot;130\&quot; x=\&quot;185.4\&quot; y=\&quot;270\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;XSxGGIhykkzDO1VBaNjo-20\&quot; parent=\&quot;1\&quot; style=\&quot;text;html=1;whiteSpace=wrap;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;rounded=0;rotation=90;\&quot; value=\&quot;&amp;lt;span style=&amp;quot;background-color: light-dark(#ffffff, var(--ge-dark-color, #121212));&amp;quot;&amp;gt;GitHub Action&amp;lt;/span&amp;gt;\&quot; vertex=\&quot;1\&quot;&gt;\n          &lt;mxGeometry height=\&quot;30\&quot; width=\&quot;130\&quot; x=\&quot;345.4\&quot; y=\&quot;270\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;XSxGGIhykkzDO1VBaNjo-21\&quot; parent=\&quot;1\&quot; style=\&quot;text;html=1;whiteSpace=wrap;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;rounded=0;rotation=90;\&quot; value=\&quot;&amp;lt;span style=&amp;quot;background-color: light-dark(#ffffff, var(--ge-dark-color, #121212));&amp;quot;&amp;gt;GitHub Action&amp;lt;/span&amp;gt;\&quot; vertex=\&quot;1\&quot;&gt;\n          &lt;mxGeometry height=\&quot;30\&quot; width=\&quot;130\&quot; x=\&quot;500\&quot; y=\&quot;270\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;XSxGGIhykkzDO1VBaNjo-22\&quot; parent=\&quot;1\&quot; style=\&quot;text;html=1;whiteSpace=wrap;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;rounded=0;rotation=90;\&quot; value=\&quot;&amp;lt;span style=&amp;quot;background-color: light-dark(#ffffff, var(--ge-dark-color, #121212));&amp;quot;&amp;gt;GitHub Action&amp;lt;/span&amp;gt;\&quot; vertex=\&quot;1\&quot;&gt;\n          &lt;mxGeometry height=\&quot;30\&quot; width=\&quot;130\&quot; x=\&quot;670\&quot; y=\&quot;270\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;XSxGGIhykkzDO1VBaNjo-23\&quot; parent=\&quot;1\&quot; style=\&quot;text;html=1;whiteSpace=wrap;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;rounded=0;rotation=90;\&quot; value=\&quot;&amp;lt;span style=&amp;quot;background-color: light-dark(#ffffff, var(--ge-dark-color, #121212));&amp;quot;&amp;gt;GitHub Action&amp;lt;/span&amp;gt;\&quot; vertex=\&quot;1\&quot;&gt;\n          &lt;mxGeometry height=\&quot;30\&quot; width=\&quot;130\&quot; x=\&quot;825.4\&quot; y=\&quot;270\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;XSxGGIhykkzDO1VBaNjo-24\&quot; parent=\&quot;1\&quot; style=\&quot;text;html=1;whiteSpace=wrap;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;rounded=0;rotation=90;\&quot; value=\&quot;&amp;lt;span style=&amp;quot;background-color: light-dark(#ffffff, var(--ge-dark-color, #121212));&amp;quot;&amp;gt;GitHub Action&amp;lt;/span&amp;gt;\&quot; vertex=\&quot;1\&quot;&gt;\n          &lt;mxGeometry height=\&quot;30\&quot; width=\&quot;130\&quot; x=\&quot;505.4\&quot; y=\&quot;560\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n      &lt;/root&gt;\n    &lt;/mxGraphModel&gt;\n  &lt;/diagram&gt;\n&lt;/mxfile&gt;\n&quot;}"></div>
<script type="text/javascript" src="https://viewer.diagrams.net/js/viewer-static.min.js"></script>

In every repository I have placed a new YML GitHub Action file, stating that the content of the repository must be mirrored to another repository, instead of pushing it to Azure. All of the repos at the top have this Action in place an they all mirror to the repository at the bottom: "swa-jv-tools" which is my collective repository. This is the only repository connected to Azure.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/upload-multiple-github-repositories-into-a-single-azure-static-web-app-6382/jv-media-6382-88bd8bcff81c.png)

---

## What are GitHub Actions?

GitHub Actions are automated scripts that can run every time a repository is updated or on schedule. It basically has a trigger, and then does an action. This can be mirroring the repository to another or to upload the complete repository to a Static Web App instance on Microsoft Azure.

GitHub Actions are stored in your Repository under the .Github folder and then Workflows:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/upload-multiple-github-repositories-into-a-single-azure-static-web-app-6382/jv-media-6382-6b972427a005.png)

In this guide, I will show you how to create your first GitHub Action.

---

## Step 1: Prepare your collective repository

To configure one Repository to act as a collective repository, we must first prepare our collective repository. The other repos must have access to write to their destination, which we will do with a Personal Access Token (PAT).

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/upload-multiple-github-repositories-into-a-single-azure-static-web-app-6382/jv-media-6382-9f6dd0462989.png)

In Github, go to your Settings, and then scroll down to "Developer settings".

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/upload-multiple-github-repositories-into-a-single-azure-static-web-app-6382/jv-media-6382-ca4fe74e1b69.png)

Then on the left, select "Personal access tokens" and then "Fine-grained tokens".

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/upload-multiple-github-repositories-into-a-single-azure-static-web-app-6382/jv-media-6382-c7c5730738c4.png)

Click on the "Generate new token" button here to create a new token.

Fill in the details and select the Expiration date as you want.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/upload-multiple-github-repositories-into-a-single-azure-static-web-app-6382/jv-media-6382-fd937019cd33.png)

Then scroll down to "Repository access" and select "Only selected repositories". We will create a token that only writes to a certain repository. We will select our destination repository only.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/upload-multiple-github-repositories-into-a-single-azure-static-web-app-6382/jv-media-6382-8479c2977cab.png)

Under permissions, add the Actions permission and set the access scope to "Read and write".

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/upload-multiple-github-repositories-into-a-single-azure-static-web-app-6382/jv-media-6382-3113f6827640.png)

Then create your token and save this in sa safe place (like a password manager).

---

## Step 2: Insert PAT into every source repository

Now that we have our secret/PAT created with permissions on the destination, we will have to give our source repos access by setting this secret.

For every source repository, perform these actions:

In your source repo, go to "Settings" and then "Secrets and variables" and click "Actions".

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/upload-multiple-github-repositories-into-a-single-azure-static-web-app-6382/jv-media-6382-400df1dc8e0d.png)

Create a new Repository secret here. I have named all secrets: "COLLECTIVE\_TOOLS\_REPO" but you can use your own name. It must be set later on in the Github Action in Step 3.

Paste the secret value you have copied during Step 1 and click "Add secret".

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/upload-multiple-github-repositories-into-a-single-azure-static-web-app-6382/jv-media-6382-e94fdf1afaac.png)

After this is done, go to Step 3.

---

## Step 3: Insert GitHub Actions file

Now the Secret has been added to the repository, we can insert the GitHub Actions file into the repo. Go to the Code tab and create a new file:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/upload-multiple-github-repositories-into-a-single-azure-static-web-app-6382/jv-media-6382-b5d2ce98ce1b.png)

Type in:

- .github/workflows/your-desired-name.yml

Github automatically will put you in the subfolders while typing.

There paste the whole content of this code block:

{{< card code=true header="**YAML**" lang="yaml" >}}
name: Mirror repo A into subdirectory of repo B

on:
  push:
    branches:
      - main
  workflow_dispatch: {}

permissions:
  contents: read

jobs:
  mirror:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout source repo (repo A)
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Checkout target repo (repo B)
        uses: actions/checkout@v4
        with:
          repository: JustinVerstijnen/swa-jv-toolspage
          token: ${{ secrets.COLLECTIVE_TOOLS_REPO }}
          path: target
          ref: main
          fetch-depth: 0

      - name: Sync repo A into subfolder in repo B (lowercase name)
        shell: bash
        run: |
          set -euo pipefail

          # Get name for organization in target repo
          REPO_NAME="${GITHUB_REPOSITORY##*/}"

          # Set lowercase
          REPO_NAME_LOWER="${REPO_NAME,,}"

          TARGET_DIR="target/${REPO_NAME_LOWER}"

          mkdir -p "$TARGET_DIR"

          rsync -a --delete \
            --exclude ".git/" \
            --exclude "target/" \
            --exclude ".github/" \
            ./ "$TARGET_DIR/"

      - name: Commit &amp; push changes to repo B
        shell: bash
        run: |
          set -euo pipefail
          cd target

          if git status --porcelain | grep -q .; then
            git config user.name  "github-actions[bot]"
            git config user.email "github-actions[bot]@users.noreply.github.com"

            git add -A
            git commit -m "Mirror ${GITHUB_REPOSITORY}@${GITHUB_SHA}"
            git push origin HEAD:main
          else
            echo "No changes to push."
          fi
{{< /card >}}

On line 25 and 26, paste the name of your own User/Repository and Secret name. These are just the values I used.

Save the file by commiting and the Action will run for the first time.

On the "Actions" tab, you can check the status:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/upload-multiple-github-repositories-into-a-single-azure-static-web-app-6382/jv-media-6382-072ddb6c9f6f.png)

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/upload-multiple-github-repositories-into-a-single-azure-static-web-app-6382/jv-media-6382-479f5daba043.png)

I created a file and deleted it to trigger the action.

You will now see that the folder is mirrored to the collective repository:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/upload-multiple-github-repositories-into-a-single-azure-static-web-app-6382/jv-media-6382-60cdb4f31954.png)

---

## Step 4: Linking collective repository to Azure Static Web App

Now we have to head over to Microsoft Azure, to create a Static Web App:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/upload-multiple-github-repositories-into-a-single-azure-static-web-app-6382/jv-media-6382-4fdd574e55dc.png)

Place it in a resource group of your likings and give it a name:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/upload-multiple-github-repositories-into-a-single-azure-static-web-app-6382/jv-media-6382-9037a3e2a3c0.png)

Scroll down to "Deployment details" and here we have to make a connection between GitHub and Azure which is basically logging in and giving permissions.

Then select the right GitHub repository from the list:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/upload-multiple-github-repositories-into-a-single-azure-static-web-app-6382/jv-media-6382-35a86dfd19dc.png)

Then in the "Build details" section, I have set "/" as app location, telling Azure that all the required files start in the root of the repository.

Click "Review + create" to create the static web app and that will automatically create a new GitHub action that uploads everything from the repository into the new created Static Web App.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/upload-multiple-github-repositories-into-a-single-azure-static-web-app-6382/jv-media-6382-d56bcfa08169.png)

---

## Step 5: Link custom domain name (optional)

An optional step but highly recommended is to add a custom domain name to the Static Web App. So your users can access your great stuff with a nice and whitelabeled URL instead of e.g. happy-bush-0a245ae03.6.azurestaticapps.net.

In the Static Web App go to "Custom Domains".

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/upload-multiple-github-repositories-into-a-single-azure-static-web-app-6382/jv-media-6382-bc6b6419ce08.png)

Click on "+ Add" to add a new custom domain you own, and copy the CNAME record. Then head to your DNS hosting company and create this CNAME record to send all traffic to the Static Web App:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/upload-multiple-github-repositories-into-a-single-azure-static-web-app-6382/jv-media-6382-0baba255d85a.png)

Do not forget to add a trailing dot "." at the end as this is an external hostname.

Then in Azure we can finish the domain verification and the link will now be active.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/upload-multiple-github-repositories-into-a-single-azure-static-web-app-6382/jv-media-6382-955d37eef3e1.png)

After this step, wait for around 15 minutes for Azure to process everything. It also takes a few minutes before Azure has added a SSL certificate to visit your web application without problems.

---

## Summary

This new setup helps me utilizing Github and Azure Static Web Apps way better in a more scalable way. If I want to add different tools, I have to do less steps to accomplish this, while maintaining overview and a clean Azure environment.

Thank you for reading this post and I hope it was helpful.

### Sources

These sources helped me by writing and research for this post;

1. https://github.com/features/actions

{{< ads >}}

{{< article-footer >}}
