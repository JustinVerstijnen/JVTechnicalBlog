---
title: "Create a Windows 11 Virtual Machine in Hyper-V"
slug: "create-windows-11-virtual-machine-hyper-v"
date: 2026-11-25
tags:
- Step by Step guides
categories: []
description: "Learn how to create a Windows 11 virtual machine in Hyper-V with the required virtual hardware, Secure Boot and TPM 2.0 settings."
hidden: false
---

In this post, I will show you how to create a Windows 11 virtual machine using Hyper-V. Windows 11 has several minimum hardware requirements that also apply when you install it inside a virtual machine.

The virtual machine must use Generation 2, at least two virtual processors, 4096 MB of memory, Secure Boot and TPM 2.0. If these requirements are not configured correctly, Windows Setup may report that the virtual machine cannot run Windows 11.

## Prerequisites

Before starting, make sure that:

- Hyper-V is installed and enabled on the host
- Hardware virtualization is enabled in the BIOS or UEFI
- The host has sufficient available processor, memory and storage capacity
- You have downloaded a Windows 11 ISO file

The following table shows the minimum configuration for this virtual machine:

| Setting | Minimum requirement |
| --- | --- |
| Virtual machine generation | Generation 2 |
| Virtual processors | 2 |
| Startup memory | 4096 MB |
| Virtual hard disk | 64 GB |
| Firmware | UEFI with Secure Boot |
| Trusted Platform Module | TPM 2.0 enabled |

These values are the minimum Windows 11 requirements. Depending on the intended workload and the available resources on the Hyper-V host, you can assign additional processors, memory and storage.

## Step 1: Download the Windows 11 ISO

Download the Windows 11 installation media from the official Microsoft website:

https://www.microsoft.com/software-download/windows11

On the download page, select the required Windows 11 ISO edition and language. Save the ISO file in a folder that is accessible from the Hyper-V host, for example:

```text
C:\ISOs\Windows11.iso
```

After downloading the ISO file, right-click it and select `Properties`. If the `Unblock` option is displayed, select it and click `Apply`.

## Step 2: Start the New Virtual Machine Wizard

Open `Hyper-V Manager` on the Hyper-V host.

In the left pane, select the Hyper-V host on which you want to create the virtual machine. Right-click the host and select `New`, followed by `Virtual Machine`.

The `New Virtual Machine Wizard` opens. Click `Next` to continue.

## Step 3: Specify the VM name and location

Enter a descriptive name for the virtual machine, for example:

```text
Windows11-TestVM
```

If you want to store the virtual machine in another location, select `Store the virtual machine in a different location` and enter the required path.

Click `Next`.

## Step 4: Select Generation 2

Select `Generation 2` and click `Next`.

Generation 2 is required because Windows 11 needs UEFI firmware, Secure Boot support and TPM 2.0. These features are available to Generation 2 virtual machines in Hyper-V.

The generation cannot be changed through the normal Hyper-V settings after the virtual machine has been created. Make sure that `Generation 2` is selected before continuing.

## Step 5: Assign memory

Enter at least:

```text
4096 MB
```

This is the minimum memory requirement for Windows 11. If the Hyper-V host has enough available memory, assigning 8192 MB provides more room for applications and updates.

You can enable `Use Dynamic Memory for this virtual machine` if you want Hyper-V to adjust memory usage dynamically. Make sure the configured startup memory remains at least 4096 MB.

Click `Next`.

## Step 6: Configure networking

Select the virtual switch that the virtual machine should use.

For a test virtual machine on a Windows client, you can select `Default Switch`. This switch uses NAT and normally provides the virtual machine with network access through the host.

You can also select a custom virtual switch if the virtual machine must connect to a specific physical network, VLAN or isolated test environment.

Click `Next`.

## Step 7: Create the virtual hard disk

Create a new virtual hard disk and configure a size of at least:

```text
64 GB
```

Windows 11 requires at least 64 GB of storage. Select a larger disk if you plan to install applications, store test data or keep multiple Windows updates on the virtual machine.

Click `Next`.

## Step 8: Attach the Windows 11 ISO

On the `Installation Options` page, select `Install an operating system from a bootable image file`.

Click `Browse` and select the Windows 11 ISO file downloaded earlier, for example:

```text
C:\ISOs\Windows11.iso
```

Click `Next`, review the selected settings and click `Finish`.

Do not start the virtual machine yet. TPM 2.0 and the required processor configuration must first be configured.

## Step 9: Configure the virtual processors

In Hyper-V Manager, right-click the new virtual machine and select `Settings`.

Under `Hardware`, select `Processor` and configure at least:

```text
2
```

Click `Apply`.

Windows 11 requires a compatible 64-bit processor with at least two cores. In Hyper-V, this means assigning at least two virtual processors to the virtual machine.

## Step 10: Enable Secure Boot and TPM 2.0

While still in the virtual machine settings, select `Security`.

Verify that `Enable Secure Boot` is selected and that the template is set to `Microsoft Windows`.

Next, select `Enable Trusted Platform Module` to provide the virtual machine with a virtual TPM 2.0 device.

Click `Apply` and then click `OK`.

The virtual machine now has the minimum required configuration for Windows 11:

- Generation 2
- Two virtual processors
- 4096 MB startup memory
- 64 GB virtual hard disk
- Secure Boot enabled
- TPM 2.0 enabled

You can now start the virtual machine and continue with the normal Windows 11 installation.

## Summary

You have created a Generation 2 Windows 11 virtual machine in Hyper-V and configured the minimum required virtual hardware. The VM has two virtual processors, 4096 MB of memory, a 64 GB virtual disk, Secure Boot and TPM 2.0 enabled.

Thank you for reading this post and I hope it was helpful!

### Sources

{% alert title="Sources 📖" color="info" %}
These sources helped me by writing and research for this post;

1. https://www.microsoft.com/software-download/windows11
2. https://learn.microsoft.com/en-us/windows/whats-new/windows-11-requirements
3. https://learn.microsoft.com/en-us/windows-server/virtualization/hyper-v/get-started/create-a-virtual-machine-in-hyper-v
4. https://learn.microsoft.com/en-us/windows/security/hardware-security/tpm/trusted-platform-module-overview

{{% /alert %}}

{{< ads >}}
{{< article-footer >}}