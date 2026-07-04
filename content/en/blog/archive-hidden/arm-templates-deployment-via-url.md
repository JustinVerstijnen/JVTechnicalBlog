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
---

Sometimes you do not want to explain a full deployment process to someone. You just want to send a link or place a button on a webpage, and let Azure open the deployment screen with your template already loaded.

That is exactly what ARM template deployment via URL does.

This is especially nice when you store your templates in GitHub and want to share them fast with colleagues, customers or for your own lab work. And if your template is written in Bicep first, that is no problem at all. Bicep to ARM is super easy, and after that you can use the normal Deploy to Azure button method.

For this post I used my own repository and tool as inspiration:

<p><a class="btn btn-primary" href="https://github.com/JustinVerstijnen/AzureDeploymentTemplates" target="_blank" rel="noreferrer">View templates on GitHub</a>&nbsp;<a class="btn btn-primary" href="https://tools.justinverstijnen.nl/azuredeploymenttemplates/" target="_blank" rel="noreferrer">Open deployment templates tool</a></p>

---

## Requirements

For this method you need the following:

- An Azure subscription
- A public GitHub repository or another public location to host the ARM JSON file
- A template in ARM JSON, or a Bicep file that you convert first
- Basic knowledge of Azure and GitHub

---

## How this works

The flow is actually very simple:

| Part | What it does |
| --- | --- |
| `main.bicep` | Your source template if you write in Bicep |
| `main.json` | The ARM JSON file that Azure loads through the URL |
| Raw GitHub URL | Public direct link to the JSON file |
| URL-encoded raw URL | Needed because the raw URL is placed inside the Azure portal link |
| Azure portal deployment link | Opens the deployment screen with your template loaded |
| Deploy to Azure button | A nicer way to present that same portal link |

The important part to remember is this: the simple Deploy to Azure button method works with a remote ARM JSON template, not with a remote Bicep file.

---

## Step 1:

Prepare your template first.

If you already have a working ARM template in JSON format, you can skip to the next step.

If you work with Bicep, convert it to ARM JSON first. This is the easy part and takes one command. Open a terminal in the folder where your Bicep file lives and run:

{{< card code=true header="**PowerShell**" lang="powershell" >}}
az bicep build --file main.bicep --outfile main.json
{{< /card >}}

This creates the `main.json` file that you can publish and use for the deployment URL.

If you prefer, you can keep the Bicep file for editing and only use `main.json` for the button and portal deployment link.

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

{{< card code=true header="**TEXT**" lang="text" >}}
https://portal.azure.com/#create/Microsoft.Template/uri/
{{< /card >}}

After that base URL, append your URL-encoded raw `main.json` URL.

So the full result looks like this structure:

{{< card code=true header="**TEXT**" lang="text" >}}
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