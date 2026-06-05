---
title: "Must-have PowerShell Modules for Azure and Microsoft 365 Administrators"
date: 2026-07-23
slug: "must-have-powershell-modules-for-azure-and-microsoft-365-administrators"
description: "When you reinstall your admin workstation or setup a fresh workstation, there are always a couple of PowerShell modules and tools must be installed install directly. These modules save a lot of time and make managing Azure and Microsoft 365 environments much easier but you always have to remember them correctly to actually install them."
categories:
  - PowerShell
tags:
  - Concepts
---

In this post I have summed up all modules I personally prefer to install almost every time on a clean Windows installation and I can recommend to every other Azure or Microsoft 365 administrator. It's purpose is to have a live overview of the modules most administrators need and use often.

---

## 1: Microsoft Graph PowerShell SDK

The Microsoft Graph PowerShell SDK is basically the modern management module for Microsoft 365 and Entra ID. More and more older modules are replaced by Microsoft Graph. You can use it for users, groups, Conditional Access, devices, Intune, licensing, authentication methods and much more.

I use this module almost daily because many modern Microsoft 365 automation tasks now needs Graph.

<a class="btn btn-primary" href="https://www.powershellgallery.com/packages/Microsoft.Graph" target="_blank" rel="noreferrer">Open Microsoft Graph in PowerShell Gallery</a>

To install this PowerShell module on your computer, run the following command:

{{< card code=true header="**PowerShell**" lang="powershell" >}}
Install-Module Microsoft.Graph -Scope CurrentUser
{{< /card >}}

To connect with this module to your Microsoft tenant, use this command:

{{< card code=true header="**PowerShell**" lang="powershell" >}}
Connect-MgGraph
{{< /card >}}

---

## 2: Exchange Online PowerShell

The Exchange Online module is still a must-have when managing mailboxes, mail flow, shared mailboxes and Exchange permissions. Even though a lot can be done through the portal, PowerShell stays much faster for bulk changes and reporting. Some more advanced options however require you to use PowerShell.

<a class="btn btn-primary" href="https://www.powershellgallery.com/packages/ExchangeOnlineManagement" target="_blank" rel="noreferrer">Open Exchange Online module in PowerShell Gallery</a>

To install this PowerShell module on your computer, run the following command:

{{< card code=true header="**PowerShell**" lang="powershell" >}}
Install-Module ExchangeOnlineManagement -Scope CurrentUser
{{< /card >}}

To connect with this module to your Microsoft tenant, use this command:

{{< card code=true header="**PowerShell**" lang="powershell" >}}
Connect-ExchangeOnline
{{< /card >}}

---

## 3: Azure PowerShell (Az module)

The Az module is the main PowerShell module for managing Microsoft Azure resources.It contains hundreds of commands for virtual machines, networking, storage, RBAC, Azure Virtual Desktop, backups and much more. For automation and scripting in Azure, this module is almost impossible to miss.

<a class="btn btn-primary" href="https://www.powershellgallery.com/packages/Az" target="_blank" rel="noreferrer">Open Az module in PowerShell Gallery</a>

To install this PowerShell module on your computer, run the following command:

{{< card code=true header="**PowerShell**" lang="powershell" >}}
Install-Module Az -Scope CurrentUser
{{< /card >}}

To connect with this module to your Microsoft tenant, use this command:

{{< card code=true header="**PowerShell**" lang="powershell" >}}
Connect-AzAccount
{{< /card >}}

---

## 4: Azure CLI

Even though this is not a PowerShell module, I still install Azure CLI on every management workstation. Some Microsoft documentation examples are written for Azure CLI and sometimes certain preview or newer features arrive there first. It is also heavily used in automation, DevOps pipelines and Terraform deployments.

<a class="btn btn-primary" href="https://learn.microsoft.com/en-us/cli/azure/" target="_blank" rel="noreferrer">Open Azure CLI documentation</a>

To install this module on your computer, run the following command:

{{< card code=true header="**PowerShell**" lang="powershell" >}}
winget install --exact --id Microsoft.AzureCLI
{{< /card >}}

To connect with this module to your Microsoft tenant, use this command:

{{< card code=true header="**PowerShell**" lang="powershell" >}}
az login
{{< /card >}}

---

## 5: Microsoft Teams PowerShell

The Microsoft Teams module is useful for managing Teams policies, calling configurations, meeting settings and Teams automation.

I mostly use it for reporting and bulk configuration changes.

<a class="btn btn-primary" href="https://www.powershellgallery.com/packages/MicrosoftTeams" target="_blank" rel="noreferrer">Open Microsoft Teams module in PowerShell Gallery</a>

To install this PowerShell module on your computer, run the following command:

{{< card code=true header="**PowerShell**" lang="powershell" >}}
Install-Module MicrosoftTeams -Scope CurrentUser
{{< /card >}}

To connect with this module to your Microsoft tenant, use this command:

{{< card code=true header="**PowerShell**" lang="powershell" >}}
Connect-MicrosoftTeams
{{< /card >}}

---

## 6: Microsoft SharePoint Online Management Shell

This module is useful for managing SharePoint Online sites and settings.

For example:

- SharePoint administration
- Site collections
- Storage limits
- External sharing settings
- OneDrive management

<a class="btn btn-primary" href="https://www.powershellgallery.com/packages/microsoft.online.sharepoint.powershell" target="_blank" rel="noreferrer">Open SharePoint Online module in PowerShell Gallery</a>

To install this PowerShell module on your computer, run the following command:

{{< card code=true header="**PowerShell**" lang="powershell" >}}
Install-Module Microsoft.Online.SharePoint.PowerShell -Scope CurrentUser
{{< /card >}}

To connect with this module to your Microsoft tenant, use this command:

{{< card code=true header="**PowerShell**" lang="powershell" >}}
Connect-SPOService -Url https://contoso-admin.sharepoint.com
{{< /card >}}

---

## 7: Maester

A great honorable mention is Maester, which is a really interesting third-party PowerShell module focused on Microsoft 365 security testing and validation. It can help checking security configurations and detecting security gaps in your tenant. I especially like this module because it makes reviewing Microsoft 365 security settings much easier and more structured. This module can be used to set up a plan for your organization to use more security options and to get a basic understanding

This is one of those tools that is really useful for MSPs and security reviews.

<a class="btn btn-primary" href="https://www.powershellgallery.com/packages/maester" target="_blank" rel="noreferrer">Open Maester in PowerShell Gallery</a>

{{< card code=true header="**PowerShell**" lang="powershell" >}}
Install-Module Maester -Scope CurrentUser
{{< /card >}}

To connect with this module to your Microsoft tenant, use this command:

{{< card code=true header="**PowerShell**" lang="powershell" >}}
Invoke-Maester
{{< /card >}}

---

## Bulk installation

If you want to prepare a fresh management workstation quickly, you can use the script below to install everything directly. This installs the latest stable versions available from the PowerShell Gallery and Azure CLI through Winget.

{{< card code=true header="**PowerShell**" lang="powershell" >}}
# Install PowerShell modules
Install-Module Microsoft.Graph -Scope CurrentUser
Install-Module ExchangeOnlineManagement -Scope CurrentUser
Install-Module Az -Scope CurrentUser
Install-Module MicrosoftTeams -Scope CurrentUser
Install-Module Microsoft.Online.SharePoint.PowerShell -Scope CurrentUser
Install-Module Maester -Scope CurrentUser

# Install Azure CLI
winget install --exact --id Microsoft.AzureCLI
{{< /card >}}

Depending on device, this can take a couple of minutes to complete.

---

## Summary

These modules and tools are part of my default setup when preparing a new laptop, VM or management server. They make Azure and Microsoft 365 administration much easier and save a lot of time when automating or troubleshooting environments.

Especially Microsoft Graph, Az PowerShell and Exchange Online PowerShell are modules I use almost every day.

Thank you for reading this post and I hope it was helpful!

### Sources

These sources helped me by writing and research for this post;

1. https://www.powershellgallery.com/packages/Microsoft.Graph
2. https://www.powershellgallery.com/packages/ExchangeOnlineManagement
3. https://www.powershellgallery.com/packages/Az
4. https://learn.microsoft.com/en-us/cli/azure/
5. https://www.powershellgallery.com/packages/MicrosoftTeams
6. https://www.powershellgallery.com/packages/microsoft.online.sharepoint.powershell
7. https://www.powershellgallery.com/packages/maester