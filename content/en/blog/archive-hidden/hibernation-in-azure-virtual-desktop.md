---
title: "Getting started with Hibernation in Azure Virtual Desktop"
date: 2026-10-31
slug: "hibernation-in-azure-virtual-desktop"
draft: true
categories:
  - Azure Virtual Desktop
tags:
  - Step by Step guides
  - Knowledge check
description: >
  In this guide I describe how I would configure and validate hibernation for a personal Azure Virtual Desktop host pool, how to use scaling plans, and the main differences compared with Windows 365.
---

In this guide I will dive into Azure Virtual Desktop (AVD) hibernation and how this can be used to reduce compute costs while keeping the state of a personal desktop. We will prepare a personal host pool, enable hibernation on a session host, test the suspend and resume process and finally configure autoscale.

I also added a small section about Windows 365, where Microsoft uses a similar technology, but where the management of the Cloud PC is different from Azure Virtual Desktop.

{{% alert color="warning" %}}
**Important before you start:** Azure Virtual Desktop hibernation is supported for **personal host pools**, not pooled host pools. Microsoft also states that **FSLogix and App Attach do not currently support hibernation**. Do not follow this guide on personal desktops that rely on those features. This article is a research-based lab guide; screenshots and performance results still need to be captured in a real test environment.
{{% /alert %}}

---

## The solution described

Most Azure Virtual Desktop environments use a scaling plan to power off session hosts when they are no longer required. This helps reduce costs, but after starting the virtual machine again, Windows needs to boot normally and any applications must be opened again.

With hibernation, Azure saves the contents of a virtual machine's memory to the OS disk. The VM is then deallocated, so compute usage stops being billed while it is hibernated. When starting the VM again, Azure restores the saved memory state, including applications and processes that were running before hibernation.

This makes hibernation an interesting option for personal desktops where one user is assigned to one virtual machine.

The environment used in this guide is intentionally simple:

| Resource | Configuration |
| --- | --- |
| Host pool | Personal Azure Virtual Desktop host pool |
| Session host | One supported Windows 11 Enterprise VM |
| VM image | Supported Azure Marketplace image |
| VM size | A hibernation-supported size for the selected region |
| User assignment | One test user assigned to the personal desktop |
| Profile management | Local profile; no FSLogix |
| Scaling | Personal scaling plan with hibernate action |

<!-- Diagram to create: Assigned user -> personal AVD session host -> OS disk holding saved memory -> hibernated/deallocated -> resume. -->

### Hibernation versus shutdown

| Action | Memory state saved | Compute billing stops after deallocation | Applications still open after return |
| --- | --- | --- | --- |
| Restart | No | No | No |
| Stop (allocated) | No | No — allocated compute remains billed | No |
| Stop (deallocate) | No | Yes | No |
| Hibernate (deallocated) | Yes | Yes | Usually resumes the saved state, subject to support and application behavior |

Storage and relevant networking charges can still apply to deallocated or hibernated VMs. Hibernation is not the same as a backup and should not be used as a replacement for one.

{{% alert color="info" %}}
Microsoft describes the suspend-to-disk process in [Hibernation for Azure virtual machines](https://learn.microsoft.com/en-us/azure/virtual-machines/hibernate-resume) and the [AVD autoscale prerequisites](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-create-assign-scaling-plan).
{{% /alert %}}

---

## 1: Check the hibernation requirements

Before configuring anything, we must check if our environment is supported.

For this guide we need:

- A **personal** Azure Virtual Desktop host pool.
- A Windows version that supports Azure VM hibernation. For example, Windows 11 Enterprise or Windows 11 Enterprise multi-session is listed as supported at Azure VM level; use an appropriate supported image for your personal AVD scenario.
- A VM size and Azure region with hibernation support.
- An OS disk with enough free space for the hibernation file.
- The Windows page file located on the **C:** drive, not the temporary disk.
- The Azure VM Agent and Azure-managed Windows Hibernate extension, where applicable.
- Sufficient permissions for VM configuration and, if configuring autoscale, the necessary AVD permissions.
- **No FSLogix or App Attach** on the personal session host used in this guide.

One important thing is that Azure's hibernation support depends on both the VM size and the guest configuration. Don't assume that every D-series or every Windows 11 virtual machine supports the feature.

If you use Virtualization-Based Security (VBS), Credential Guard or similar components, verify the additional requirements for Trusted Launch, nested virtualization and Windows build support in Microsoft's latest documentation.

<!-- Screenshot to capture: VM size selection showing a hibernation-supported size. -->

---

## 2: Create or prepare a personal AVD host pool

We will start with a personal host pool. If you already have a personal host pool with a supported VM, you can review its settings and continue to the next step.

Go to the Azure Portal: <https://portal.azure.com>.

Search for **Azure Virtual Desktop** and select **Host pools**. Click **Create** to create a new host pool.

Configure the basic settings:

| Setting | Value |
| --- | --- |
| Host pool name | `hp-avd-hibernate-lab` |
| Host pool type | **Personal** |
| Assignment | Automatic or direct assignment to your test user |
| Validation environment | Set according to your normal testing policy |

<!-- Screenshot to capture: Host pool creation with Personal selected. -->

Continue to the virtual machine configuration page.

Select a supported Windows image, an eligible VM size, your network and the required join type. Use the normal AVD requirements for authentication and user access.

The important setting for this guide is **Hibernate**. Enable the hibernation option when adding the session host. Microsoft documents this option for personal host pools in the session host deployment wizard.

<!-- Screenshot to capture: Add session hosts page with the Hibernate checkbox enabled. -->

Finish the deployment and give the session host time to become available in the host pool.

{{% alert color="warning" %}}
Enabling hibernation on a pooled host pool isn't a supported way to reduce costs for multiple-user session hosts. If you use pooled AVD with FSLogix, keep using the supported autoscale power management options instead.
{{% /alert %}}

---

## 3: Verify the Windows configuration

Once the session host is available, connect to it using your test account. We will check if Windows is configured to support hibernation.

Open PowerShell or Command Prompt on the session host and run:

{{< card code=true header="**CMD**" lang="powershell" >}}
powercfg /a
{{< /card >}}

The result lists the available sleep states. Review whether the Hibernate (S4) state is available and check for any reported reasons if it isn't.

<!-- Screenshot to capture: powercfg /a showing the available sleep states. -->

Now check the Windows page file configuration. The page file should be on the C: drive for Azure VM hibernation.

You can inspect the current page file configuration with:

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
Get-CimInstance -ClassName Win32_PageFileUsage |
    Select-Object Name, AllocatedBaseSize, CurrentUsage
{{< /card >}}

If the page file is configured on a temporary disk, correct the configuration according to Microsoft's guidance and restart the machine before testing hibernation.

When hibernation is enabled during VM creation, Azure normally installs the **Microsoft.CPlat.Core.WindowsHibernateExtension** and configures the guest automatically. This is a platform-managed extension. Don't remove or manually change it as part of normal administration.

---

## 4: Test hibernation manually

Before using autoscale, we will test the VM manually to find out whether the hibernate and resume operations work correctly.

Sign in to the personal desktop and open some simple applications, such as Notepad and File Explorer. Add some text to an unsaved Notepad document as an easy test of session state.

Disconnect from the AVD session. **Do not sign out**, because signing out closes the user session and its applications.

In the Azure Portal, navigate to **Virtual machines** and select the personal AVD session host. On the virtual machine overview, click **Hibernate**.

Make sure you're selecting Hibernate and not the regular Stop action.

<!-- Screenshot to capture: Virtual machine Overview blade showing the Hibernate action. -->

The virtual machine should eventually report **Hibernated (deallocated)**.

At this point, the machine is no longer using billed compute capacity, although storage and some networking charges remain.

Now click **Start** to resume the virtual machine. Wait until the AVD session host becomes available again, connect through Windows App and review your test application.

For a successful suspend/resume cycle, the saved desktop state should return rather than presenting a fresh Windows boot session. Some applications and network connections may still need to recover after resume.

<!-- Screenshot to capture: VM status Hibernated (deallocated), then the resumed Notepad application. -->

### Test the same action with PowerShell (optional)

If you prefer using PowerShell, below is a **complete script** with a selectable action to hibernate or resume the test VM. Update the three configuration values before running it.

{{% alert color="warning" %}}
This script performs an actual power operation. Only run it on a dedicated test VM after disconnecting your test session. It does not check AVD session activity or save application data on your behalf.
{{% /alert %}}

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
#Requires -Modules Az.Accounts, Az.Compute

$ErrorActionPreference = 'Stop'

# Edit these values for your own test environment.
$SubscriptionId    = '<subscription-id>'
$ResourceGroupName = 'rg-avd-hibernate-lab'
$VMName            = 'vm-avd-hibernate-01'
$Action            = 'Status' # Status, Hibernate, or Resume

Connect-AzAccount
Set-AzContext -SubscriptionId $SubscriptionId | Out-Null

$vm = Get-AzVM -ResourceGroupName $ResourceGroupName -Name $VMName

if ($Action -notin @('Status', 'Hibernate', 'Resume')) {
    throw "Unsupported action: $Action. Use Status, Hibernate, or Resume."
}

if ($Action -eq 'Hibernate') {
    if (-not $vm.AdditionalCapabilities.HibernationEnabled) {
        throw 'Hibernation is not enabled on this Azure VM.'
    }

    Write-Host "Requesting hibernation for $VMName..."
    Stop-AzVM -ResourceGroupName $ResourceGroupName -Name $VMName -Hibernate -Force
}
elseif ($Action -eq 'Resume') {
    Write-Host "Starting $VMName..."
    Start-AzVM -ResourceGroupName $ResourceGroupName -Name $VMName
}

Write-Host 'Current VM instance status:'
Get-AzVM -ResourceGroupName $ResourceGroupName -Name $VMName -Status |
    Select-Object ResourceGroupName, Name, Statuses |
    Format-List
{{< /card >}}

Set `$Action` to `Status` if you only want to inspect the VM, `Hibernate` for a real hibernate request, or `Resume` to start it again. Make sure the necessary Az modules are installed first.

---

## 5: Create a personal scaling plan

After manually validating the VM, we can configure autoscale to perform the action based on the user session state.

In the Azure Portal, go to **Azure Virtual Desktop** -> **Scaling plans** and click **Create**.

Use the following example:

| Setting | Value |
| --- | --- |
| Name | `sp-avd-hibernate-lab` |
| Host pool type | **Personal** |
| Time zone | Your local business time zone |
| Host pool | `hp-avd-hibernate-lab` |

The scaling plan region needs to meet the host pool configuration location requirements.

Before enabling the plan, confirm that the Azure Virtual Desktop service has the required permissions to manage the VM power state. Follow Microsoft's current autoscale role assignment instructions for your deployment.

<!-- Screenshot to capture: Personal Scaling Plan creation wizard. -->

---

## 6: Configure hibernation in the schedule

We will now configure the actions taken when a user disconnects or signs out of the personal desktop.

Add a schedule and choose the required days and times for your environment.

For a simple lab, use these example values during the relevant schedule phase:

| Setting | Example value |
| --- | --- |
| Start VM on Connect | Enabled |
| When disconnected for | 30 minutes |
| Perform after disconnect | **Hibernate** |
| When logged off for | 30 minutes |
| Perform after sign-out | **Hibernate** |

These are example lab settings, not universal production recommendations. Adjust the times based on your working hours and the user's normal behavior. In some environments deallocating after sign-out may be more appropriate than saving a session state that has already ended.

<!-- Screenshot to capture: Personal scaling schedule with the Hibernate action. -->

Assign the scaling plan to the host pool and enable the scaling plan after validating the schedule.

With **Start VM on Connect** enabled for the relevant schedule phase, AVD can start the personal desktop when the assigned user tries to connect. This is an important part of making hibernation practical for end users.

{{% alert color="warning" %}}
If you choose Hibernate in a personal scaling plan but hibernation is **not enabled on the VM**, Microsoft documents that autoscale doesn't hibernate **or** deallocate that session host for the action. This may leave the VM running and increase costs.
{{% /alert %}}

---

## 7: Verify the automatic hibernation process

For this test, connect to the personal desktop and open Notepad. Save any real work, then disconnect from Windows App without signing out.

Wait until the configured disconnect interval has passed and check the VM power state in the Azure Portal.

Confirm the following:

1. The user session became disconnected rather than signed out.
2. The scaling plan was enabled and assigned to the correct host pool.
3. The VM was hibernation-enabled.
4. The VM eventually changed to **Hibernated (deallocated)**.
5. When reconnecting, the VM resumed and the desktop state was retained as expected.

<!-- Screenshot to capture: Autoscale event history / AVD diagnostics and the VM power state. -->

You can also check **Azure Activity Log** for the VM power operations and AVD autoscale diagnostics for related scaling activity.

For a fair comparison, measure at least two actions in your own test environment:

| Measurement | Stop (deallocate) | Hibernate |
| --- | --- | --- |
| Time until the desktop is available | Record test result | Record test result |
| Application state after connection | Record test result | Record test result |
| Compute billed while inactive | Not billed once deallocated | Not billed once hibernated |
| Disk and networking cost | Still applies where relevant | Still applies where relevant |

I have intentionally not added any made-up benchmark numbers here. The actual performance depends on your selected VM size, disk, image, applications and session host configuration.

---

## 8: A small note about Windows 365 hibernation

Windows 365 Cloud PCs use Azure infrastructure, but the management model is different. With Azure Virtual Desktop we manage the personal host pool, the underlying Azure VMs and our own scaling plan. With Windows 365, Microsoft manages the underlying Cloud PC infrastructure as part of the service.

Microsoft documents that it may hibernate Cloud PCs during off-hours for platform management. The VM's state is written to `hiberfil.sys` and restored later. This means a disconnected Cloud PC isn't necessarily continuing to execute background tasks while the user is away.

There is also **Session State Retention** for eligible **Windows 365 Flex dedicated Cloud PCs**. According to Microsoft's October 2026 documentation, this feature is generally available for eligible devices and is designed to preserve a disconnected user's session rather than simply powering it off.

Don't confuse those Windows 365 service-managed behaviors with a customer-managed **AVD personal scaling plan**. You don't create an AVD scaling plan to control a Windows 365 Cloud PC.

{{% alert color="info" %}}
A useful practical investigation into Windows 365 Cloud PC hibernation was published by [ITProCloud](https://blog.itprocloud.de/The-secret-of-the-hibernation-of-windows-365-cloud-pc/). The observed sleep times in that article are from the author's own Cloud PC and should not be treated as a fixed Microsoft schedule for every device.
{{% /alert %}}

---

## 9: Troubleshooting (optional)

### The Hibernate option is missing

Check whether the VM belongs to a **personal** host pool, whether the selected VM size and OS image support hibernation and whether the VM itself has hibernation enabled. For an existing VM, check the Azure VM configuration and OS disk support using Microsoft's documented procedure.

### Windows reports that hibernation isn't available

Run `powercfg /a` and investigate the reason Windows provides. Verify the page file is on C:, sufficient disk space is available, and the Azure-managed Hibernate extension is healthy. Check VBS and OS build requirements if relevant.

### Autoscale does not hibernate the personal desktop

Check that the correct scaling plan is assigned, enabled and configured for the relevant schedule phase. Verify the user's actual session state and the VM's hibernation capabilities. Microsoft documents that an ineligible VM won't be automatically deallocated as a fallback for a Hibernate action.

### The desktop doesn't reconnect after resume

Inspect the VM Activity Log and the AVD session host status. Check the Remote Desktop Agent services if the machine resumes at Azure compute level but remains unavailable in the host pool. If hibernate/resume is unstable, stop using it in that environment until the cause is understood and prefer a supported deallocation configuration.

### My application doesn't continue as expected

Hibernation preserves VM memory state, but applications using expiring sessions, disconnected network services, credentials or external resources may need to re-establish connections. Test every important business application, not just Notepad, before deciding whether hibernation is suitable.

---

## Knowledge check

{{< quiz >}}
{
  "intro": "Answer these question(s) to test your understanding of this post. Your answers are not saved or sent anywhere; this is simply a personal knowledge check. If you refresh the page, your answers will be cleared.",
  "questions": [
    {
      "question": "Which Azure Virtual Desktop host pool type supports hibernation?",
      "reference": "See the section: 1: Check the hibernation requirements",
      "referenceUrl": "#1-check-the-hibernation-requirements",
      "answers": [
        {"text": "Personal host pools", "correct": true, "message": "Correct! AVD hibernation is available for personal host pools."},
        {"text": "Pooled host pools with FSLogix", "correct": false, "message": "Incorrect. Hibernation isn't supported for pooled AVD hosts."},
        {"text": "Both pooled and personal host pools", "correct": false, "message": "Incorrect. The current AVD support is for personal host pools."}
      ]
    },
    {
      "question": "What happens when an Azure VM hibernates?",
      "reference": "See the section: The solution described",
      "referenceUrl": "#the-solution-described",
      "answers": [
        {"text": "Windows memory state is saved to the OS disk and the VM is deallocated", "correct": true, "message": "Correct! The compute resources are released while the memory state is retained."},
        {"text": "Only the monitor turns off", "correct": false, "message": "Incorrect. This is much more than a display sleep state."},
        {"text": "All files and applications are deleted", "correct": false, "message": "Incorrect. The idea is to retain the prior state, not delete it."}
      ]
    },
    {
      "question": "Which profile solution does Microsoft currently identify as incompatible with AVD personal hibernation?",
      "reference": "See the section: 1: Check the hibernation requirements",
      "referenceUrl": "#1-check-the-hibernation-requirements",
      "answers": [
        {"text": "FSLogix", "correct": true, "message": "Correct! Microsoft explicitly says not to use hibernation with FSLogix or App Attach."},
        {"text": "Local Windows profiles", "correct": false, "message": "Incorrect. This guide uses a local profile in the lab."},
        {"text": "Notepad", "correct": false, "message": "Incorrect. Notepad is only used to demonstrate saved application state."}
      ]
    }
  ]
}
{{< /quiz >}}

---

## Summary

Hibernation is an interesting option for personal Azure Virtual Desktop environments where users want to return to their desktop without starting all applications again. It also allows Azure to deallocate the VM so compute charges stop while the VM is hibernated.

However, this is not a replacement for normal AVD scaling everywhere. The current support is limited to **personal host pools** and it does **not** support environments using **FSLogix or App Attach**. These limitations are especially important if you mainly work with pooled AVD environments.

My advice is to validate the hibernate/resume cycle manually first and only then create a personal scaling plan. Measure the user experience in your own environment and keep a normal deallocation configuration available if hibernation isn't stable enough.

Thank you for reading this page and I hope it was helpful.

{{% alert title="Sources 📖" color="info" %}}
These sources helped me by writing and research for this post:
1. https://learn.microsoft.com/en-us/azure/virtual-machines/hibernate-resume
2. https://learn.microsoft.com/en-us/azure/virtual-machines/windows/hibernate-resume-windows
3. https://learn.microsoft.com/en-us/azure/virtual-desktop/deploy-azure-virtual-desktop
4. https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-create-assign-scaling-plan
5. https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-faq
6. https://learn.microsoft.com/en-us/windows-365/enterprise/resilience
7. https://learn.microsoft.com/en-us/windows-365/enterprise/whats-new
{{% /alert %}}

{{< ads >}}

{{< article-footer >}}