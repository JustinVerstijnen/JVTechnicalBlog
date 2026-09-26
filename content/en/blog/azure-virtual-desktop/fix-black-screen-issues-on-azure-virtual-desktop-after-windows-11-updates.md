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

In this post, I will give a temporary fix which helps minimize this problem. However, this is only possible through Group Policy at this time.

{{< ads >}}

---

## What is causing the black screen?

As we want to know the technical reason of this problem, the black screen itself is not caused by the Azure Virtual Desktop connection failing. The user is already signed in to Windows, but the Windows shell does not start correctly.

Microsoft has confirmed that the black screen is caused by explorer.exe crashing during shell startup. Explorer.exe is responsible for loading important parts of the Windows desktop, including the taskbar, Start menu and File Explorer.

When explorer.exe crashes during the sign-in process, the AVD session itself can remain active but Windows never finishes loading the desktop. This explains why manually starting explorer.exe from Task Manager can immediately make the desktop available again.

The issue has mainly been observed on Azure Virtual Desktop session hosts using FSLogix, and Microsoft states that it seems to occur more frequently with some existing user profiles.

{{% alert title="Root cause" color="info" %}}
At the time of writing, Microsoft has not published the root cause yet. It is confirmed that a Windows change introduced with update KB5120998 and included in subsequent updates can cause explorer.exe to crash during shell startup. Microsoft has also confirmed the higher occurrence in AVD environments using FSLogix, but has not documented exactly why FSLogix profiles trigger the problem more frequently. We hope to learn more from Microsoft in the near future.
{{% /alert %}}

---

## Workaround 1: Apply the Known Issue Rollback

For environments where this happens too often, Microsoft has released a Known Issue Rollback package (KIR). A KIR disables only the Windows change which is causing the problem instead of uninstalling the complete Windows update. Microsoft provides a different KIR package depending on the Windows 11 version you use.

<a class="btn btn-primary" href="https://download.microsoft.com/download/8c71622d-e0eb-4838-b25c-ddb99a7bf971/Windows%2011%2024H2%2C%20Windows%2011%2025H2%20and%20Windows%20Server%202025%20KB5124010%20260924_20021%20Known%20Issue%20Rollback.msi" target="_blank" rel="noreferrer">Windows 11 24H2</a><a class="btn btn-primary" href="https://download.microsoft.com/download/8c71622d-e0eb-4838-b25c-ddb99a7bf971/Windows%2011%2024H2%2C%20Windows%2011%2025H2%20and%20Windows%20Server%202025%20KB5124010%20260924_20021%20Known%20Issue%20Rollback.msi" target="_blank" rel="noreferrer">Windows 11 25H2</a><a class="btn btn-primary" href="https://download.microsoft.com/download/09efb4c6-54f4-4e63-83c7-4314187230bf/Windows%2011%2026H1%20KB5124006%20260924_20071%20Known%20Issue%20Rollback.msi" target="_blank" rel="noreferrer">Windows 11 26H1</a>

After downloading the package, proceed to the next steps.

### Deploy the KIR using Group Policy

Download the correct MSI package for your Windows version and install it on your management server which you use to manage Group Policy. The policy definition will be installed in:

- C:\Windows\PolicyDefinitions

If you use a Group Policy Central Store, copy the installed ADMX and ADML files to your Central Store (`\\domain.local\SYSVOL\domain.local\Policies\PolicyDefinitions\`) as you would with other administrative templates.

Now open the Group Policy Management Console (`gpmc.msc`) and create a new Group Policy or use an existing policy which is assigned to your Azure Virtual Desktop session hosts.

Navigate to:

`Computer Configuration - Administrative Templates - Known Issue Rollback policy installed by the KIR package`

Open the rollback policy and set it to Disabled. This disables the Windows change which is causing the issue and therefore activates the Known Issue Rollback. Then save the Group Policy and apply it to the affected AVD session hosts.

You can force a Group Policy refresh on the client side using:

{{< card code=true header="**cmd**" lang="cmd" >}}
gpupdate /force
{{< /card >}}

Then the session hosts must first be restarted after receiving the policy before the Known Issue Rollback becomes active.

{{% alert title="Important" color="info" %}}
The Known Issue Rollback is a temporary fix. Microsoft is working on a permanent resolution which will be released automatically in a future Windows update.
{{% /alert %}}

{{< ads >}}

---

## Workaround 2: Start Windows Explorer manually

A temporary workaround for an affected user is to manually start Windows Explorer after signing in. However this will work, this will not be our preferred way for end users to "fix" this problem.

On the black login screen. open Task Manager using:

- Ctrl + Shift + Esc

Click `Run new task` and enter:

{{< card code=true header="**PowerShell**" lang="powershell" >}}
explorer.exe
{{< /card >}}

Click OK and Windows Explorer should now start and the desktop should become available for the user. This is only a temporary workaround and must be repeated when the problem happens again at the next logon(s).

---

## What about Microsoft Intune?

Microsoft also supports deploying Known Issue Rollback policies to Intune-managed devices. This is done using ADMX ingestion and a Custom configuration profile.

If your Azure Virtual Desktop session hosts are managed using Active Directory Group Policy, you can deploy the supplied KIR through Group Policy. If your AVD session hosts are managed through Microsoft Intune, Microsoft documents how to ingest the supplied ADMX policy and configure the rollback through a Custom profile.

---

## Summary

If users suddenly receive a black screen after signing in to Azure Virtual Desktop, and your session hosts are running Windows 11 with FSLogix, this known issue is something you should check first. Especially environments which installed KB5120998 or a newer Windows update can be affected.

For a temporary workaround, users can manually start `explorer.exe` from Task Manager. For centrally managed AVD environments, Microsoft provides a Known Issue Rollback which can be deployed to the affected session hosts, followed by a restart.

Once Microsoft releases a permanent fix, this KIR will no longer be necessary and this post will be obsolete.

Thank you for reading this post and I hope it was helpful!

{{% alert title="Sources📖" color="info" %}}
These sources helped me by writing and research for this post;

1. https://learn.microsoft.com/en-us/windows/release-health/status-windows-11-25h2#devices-might-experience-a-black-screen-or-desktop-loading-issues-after-sign-in
2. https://learn.microsoft.com/en-us/troubleshoot/windows-client/group-policy/use-group-policy-to-deploy-known-issue-rollback
{{% /alert %}}

{{< ads >}}

{{< article-footer >}}