---
title: "ARM templates deployment via URL"
slug: "arm-templates-deployment-via-url"
date: 2026-10-04
tags:
- Step by Step guides
- Tools and Scripts
categories:
- Microsoft Azure
description: "In this post I will show you how to deploy ARM templates directly from a public URL, how to create a Deploy to Azure button, and why converting Bicep to ARM JSON is the easy part."
hidden: false
---

Some time ago, I [s](https://justinverstijnen.nl/arm-templates-and-azure-vm-script-deployment/)[pent some time on ARM templates](https://justinverstijnen.nl/arm-templates-and-azure-vm-script-deployment/) and creating them through the portal and then redeploying them to save time. As I need to test some things very often for blog posts, for example updates for FSLogix and AVD, I needed a way to deploy some resources into Azure much faster. Here I want to save much of the clickwork and actually have more time on to the tesing and research themselves.

After some testing and successfully be able to deploy different ARM templates, I dived even deeper in this world and was able to deploy them through a URI. This gave me inspiration to make my own gallery of ARM templates for fast deployment. It works like, you go to the URL, click on the Deploy to Azure button and you will be redirected to Azure and make minor customizations before deploying it into your environment.

In this guide, I will explain how this actually works and how you could setup this yourself.

<a class="btn btn-primary" href="https://tools.justinverstijnen.nl/azuredeploymenttemplates/" target="_blank" rel="noreferrer">Visit Deployment Templates gallery</a>

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

---

## Step 2:

Host the ARM JSON file on a public location.

For GitHub, the easiest way is to place `main.json` in your repository and use the raw file URL. Open GitHub, browse to your `main.json` file, click "Raw", and copy that URL.

Make sure you copy the raw URL and not the normal GitHub page URL. Azure must be able to load the JSON file directly.

For this simple GitHub method, the repository must be public.

{{% alert title="Info" color="info" %}}
If your template is still only a `.bicep` file in GitHub, the Deploy to Azure button will not load it directly. Build the file to `main.json` first and publish that JSON file.
{{% /alert %}}

---

## Step 3:

Create the Azure portal deployment URL.

The base URL is this:

{{< card code=true header="**Plain text**" lang="text" >}}
https://portal.azure.com/#create/Microsoft.Template/uri/
{{< /card >}}

After that base URL, append your URL-encoded raw `main.json` URL.

So the full result looks like this structure:

{{< card code=true header="**Plain text**" lang="text" >}}
https://portal.azure.com/#create/Microsoft.Template/uri/<URL-ENCODED-RAW-JSON-URL>
{{< /card >}}

This is the full trick. Once you have this link, you can already use it directly in documentation, emails, a GitHub README or on your own website.

---

## Step 4:

Turn the link into a Deploy to Azure button.

Microsoft provides the button image already, so we only have to wrap the Azure deployment link around it.

Below is an example HTML snippet you can host on a page or place in a README that supports HTML:

{{< card code=true header="**HTML**" lang="html" >}}
<a href="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FJustinVerstijnen%2FJV-Azure-Deployment-Templates%2Frefs%2Fheads%2Fmain%2Fazurevirtualdesktopkerberos%2Fmain.json" target="_blank" rel="noopener noreferrer">
<img src="https://aka.ms/deploytoazurebutton" alt="Deploy to Azure"/>
</a>
{{< /card >}}

If you prefer not to use a button, you can also just share the direct Azure portal link itself.

A nice extra thing is that you can place this button in multiple places:

- On a GitHub README
- On an internal documentation page
- On a public blog post
- On a tools page with multiple templates

That makes sharing templates much easier than telling someone to manually download files and go through the editor by hand.

---

## Step 5:

Test the deployment.

Open the Azure Portal at https://portal.azure.com and open your deployment link or click the button. Azure should open the custom deployment page and load the template automatically.

From there, review the parameters, choose the correct subscription and resource group, and start the deployment.

If the template does not load, check these items first:

| Problem | Most likely cause | What to check |
| --- | --- | --- |
| Azure opens but the template is not loaded | Wrong link format | Check the `#create/Microsoft.Template/uri/` part |
| Azure cannot read the template | Wrong or broken raw URL | Open the raw URL directly in a browser and see if the JSON loads |
| The link opens GitHub instead of JSON | Normal GitHub URL used instead of raw URL | Go back to GitHub and copy the "Raw" link |
| The button does not work with your file | You pointed to a Bicep file | Build and publish `main.json` first |
| Others cannot use the button | Repository is private | Use a public repo for this simple method |

---

## Why I like this method

For me this is one of the easiest ways to share reusable Azure deployments.

It keeps the process simple:

- Write in Bicep if you want
- Build to ARM JSON
- Store the JSON in GitHub
- Generate one deployment link
- Place a button anywhere you like

That means less clicking around, less manual importing, and a much easier experience for anyone who needs to deploy the template.

---

## Summary

ARM template deployment via URL is a very practical way to make your Azure templates easy to use. The main thing to remember is that the deploy button expects an ARM JSON file at a public URL. So if you build your templates in Bicep, just convert them to `main.json`, publish that file, URL-encode the raw link, and place it behind the Azure portal deployment URL or a Deploy to Azure button.

### Sources

These sources helped me by writing and research for this post;

1. Deploy to Azure button - Azure Resource Manager | Microsoft Learn - https://learn.microsoft.com/en-us/azure/azure-resource-manager/templates/deploy-to-azure-button
2. Bicep CLI commands - Azure Resource Manager | Microsoft Learn - https://learn.microsoft.com/en-us/azure/azure-resource-manager/bicep/bicep-cli
3. Deploy resources with ARM templates and Azure portal | Microsoft Learn - https://learn.microsoft.com/en-us/azure/azure-resource-manager/templates/deploy-portal
4. Decompile a JSON Azure Resource Manager template to Bicep | Microsoft Learn - https://learn.microsoft.com/en-us/azure/azure-resource-manager/bicep/decompile
5. GitHub repository - https://github.com/JustinVerstijnen/AzureDeploymentTemplates
6. Azure deployment templates tool - https://tools.justinverstijnen.nl/azuredeploymenttemplates/

If you already have reusable Bicep templates in GitHub, this is really one of the easiest next steps to make them deployable for yourself and others in just one click. Thank you for reading this post and I hope it was helpful!
