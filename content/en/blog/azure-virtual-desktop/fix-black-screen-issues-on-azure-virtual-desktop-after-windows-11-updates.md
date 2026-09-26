---
title: "Fix Black Screen Issues on Azure Virtual Desktop after Windows 11 Updates"
slug: "fix-black-screen-azure-virtual-desktop-windows-11"
date: 2026-09-26
tags:
- Step by Step Guides
categories:
- Azure Virtual Desktop
description: "Microsoft has confirmed a new Windows 11 issue which can cause a black screen directly after signing in to an Azure Virtual Desktop session. The issue is mainly seen on AVD session hosts using FSLogix and seems to occur more frequently with existing user profiles.The problem can occur after installing the August 2026 Windows non-security preview update **KB5120998** or subsequent Windows updates. In this post I will explain what happens and which workarounds we can currently use until Microsoft releases a permanent fix."
hidden: false
---

## What is the problem?

After installing KB5120998 or a later Windows update, some Azure Virtual Desktop users can sign in successfully but the Windows desktop does not load automatically.

The following symptoms can occur:

1. A black screen appears directly after sign-in
2. The Windows desktop and wallpaper does not load automatically
3. The Application event log can show crashes of `explorer.exe`

Microsoft states that the problem has mainly been observed on Azure Virtual Desktop session hosts using FSLogix. Existing user profiles seem to be affected more often than newly created profiles.

{{% alert title="Affected Windows versions" color="warning" %}}
The issue affects Windows 11 version 24H2, Windows 11 version 25H2 and Windows 11 version 26H1. Windows Server is currently not listed/known as affected by this specific issue.

Source: [https://learn.microsoft.com/en-us/windows/release-health/status-windows-11-25h2#5006msgdesc](https://learn.microsoft.com/en-us/windows/release-health/status-windows-11-25h2#5006msgdesc)
{{% /alert %}}

{{< ads >}}

---

## Workaround 1: Apply the Known Issue Rollback

For environments where this happens too often, Microsoft has released a Known Issue Rollback package (KIR). A KIR disables only the Windows change which is causing the problem instead of uninstalling the complete Windows update. Microsoft provides a different KIR package depending on the Windows 11 version you use.

| Windows 11 24H2 | Windows 11 25H2 | Windows 11 26H1 |
| --- | --- | --- |

| <a class="btn btn-primary" href="https://download.microsoft.com/download/8c71622d-e0eb-4838-b25c-ddb99a7bf971/Windows%2011%2024H2%2C%20Windows%2011%2025H2%20and%20Windows%20Server%202025%20KB5124010%20260924_20021%20Known%20Issue%20Rollback.msi" target="_blank" rel="noreferrer">Download KIR for Windows 11 24H2 / 25H2</a>

| <a class="btn btn-primary" href="https://download.microsoft.com/download/8c71622d-e0eb-4838-b25c-ddb99a7bf971/Windows%2011%2024H2%2C%20Windows%2011%2025H2%20and%20Windows%20Server%202025%20KB5124010%20260924_20021%20Known%20Issue%20Rollback.msi" target="_blank" rel="noreferrer">Download KIR for Windows 11 24H2 / 25H2</a>

| <a class="btn btn-primary" href="https://download.microsoft.com/download/09efb4c6-54f4-4e63-83c7-4314187230bf/Windows%2011%2026H1%20KB5124006%20260924_20071%20Known%20Issue%20Rollback.msi" target="_blank" rel="noreferrer">Download KIR for Windows 11 26H1</a>

|

### Windows 11 24H2 and 25H2

Use the following Microsoft KIR package:

<a class="btn btn-primary" href="https://download.microsoft.com/download/8c71622d-e0eb-4838-b25c-ddb99a7bf971/Windows%2011%2024H2%2C%20Windows%2011%2025H2%20and%20Windows%20Server%202025%20KB5124010%20260924_20021%20Known%20Issue%20Rollback.msi" target="_blank" rel="noreferrer">Download KIR for Windows 11 24H2 / 25H2</a>

### Windows 11 26H1

Use this package when your AVD session hosts are running Windows 11 26H1:

<a class="btn btn-primary" href="https://download.microsoft.com/download/09efb4c6-54f4-4e63-83c7-4314187230bf/Windows%2011%2026H1%20KB5124006%20260924_20071%20Known%20Issue%20Rollback.msi" target="_blank" rel="noreferrer">Download KIR for Windows 11 26H1</a>

---

## Deploy the KIR using Group Policy

Download the correct MSI package for your Windows version and install it on the computer you use to manage Group Policy.

The policy definition will be installed in:

{{< card code=true header="**Plain text**" lang="text" >}}
C:\Windows\PolicyDefinitions
{{< /card >}}

If you use a Group Policy Central Store, copy the installed ADMX and ADML files to your Central Store as you would with other administrative templates.

Now open the Group Policy Management Console (**gpmc.msc**) and create a new Group Policy or use an existing policy which is assigned to your Azure Virtual Desktop session hosts.

Navigate to:

_Computer Configuration - Administrative Templates - Known Issue Rollback policy installed by the KIR package_

Open the rollback policy and set it to **Disabled**. This disables the Windows change which is causing the issue and therefore activates the Known Issue Rollback.

Save the Group Policy and apply it to the affected AVD session hosts.

You can force a Group Policy refresh using:

{{< card code=true header="**PowerShell**" lang="powershell" >}}
gpupdate /force
{{< /card >}}

The session hosts must be **restarted** after receiving the policy before the Known Issue Rollback becomes active.

{{% alert title="Important" color="info" %}}
The Known Issue Rollback is a temporary mitigation. Microsoft is working on a permanent resolution which will be released in a future Windows update.
{{% /alert %}}

{{< ads >}}

---

## Workaround 2: Start Windows Explorer manually

A temporary workaround for an affected user is to manually start Windows Explorer after signing in.

Open Task Manager using:

{{< card code=true header="**Plain text**" lang="text" >}}
Ctrl + Shift + Esc
{{< /card >}}

Click **Run new task** and enter:

{{< card code=true header="**PowerShell**" lang="powershell" >}}
explorer.exe
{{< /card >}}

Click **OK**. Windows Explorer should now start and the desktop should become available for the user.

This is only a temporary workaround and must be repeated when the problem happens again.

---

## What about Microsoft Intune?

Microsoft also supports deploying Known Issue Rollback policies to Intune-managed devices. This is done using ADMX ingestion and a Custom configuration profile.

If your Azure Virtual Desktop session hosts are managed using Active Directory Group Policy, you can deploy the supplied KIR through Group Policy. If your AVD session hosts are managed through Microsoft Intune, Microsoft documents how to ingest the supplied ADMX policy and configure the rollback through a Custom profile.

---

## Current status

Microsoft opened the known issue on **September 24, 2026** and currently lists the issue as **Mitigated**.

The current workaround is either to manually start **explorer.exe** for an affected user or to deploy the Microsoft Known Issue Rollback to centrally managed devices. Microsoft is working on a permanent resolution which will be included in a future Windows update.

---

## Summary

If users suddenly receive a black screen after signing in to Azure Virtual Desktop, and your session hosts are running Windows 11 with FSLogix, this known issue is something you should check first. Especially environments which installed KB5120998 or a newer Windows update can be affected.

For a temporary workaround, users can manually start **explorer.exe** from Task Manager. For centrally managed AVD environments, Microsoft provides a Known Issue Rollback which can be deployed to the affected session hosts, followed by a restart.

Once Microsoft releases a permanent fix, the KIR will no longer be necessary.

Thank you for reading this post and I hope it was helpful!

{{% alert title="Sources 🕮" color="info" %}}
These sources helped me by writing and research for this post;

1. https://learn.microsoft.com/en-us/windows/release-health/status-windows-11-25h2#devices-might-experience-a-black-screen-or-desktop-loading-issues-after-sign-in
2. https://learn.microsoft.com/en-us/troubleshoot/windows-client/group-policy/use-group-policy-to-deploy-known-issue-rollback
3. https://www.dutchitchannel.nl/news/761079/windows-11-update-veroorzaakt-zwarte-schermen-op-azure-virtual-desktop
{{% /alert %}}

{{< ads >}}

{{< article-footer >}}
