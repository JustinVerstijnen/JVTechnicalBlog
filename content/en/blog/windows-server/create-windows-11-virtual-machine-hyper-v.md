---
title: "Create a Windows 11 Virtual Machine in Hyper-V"
slug: "create-windows-11-virtual-machine-hyper-v"
date: 2024-11-25
tags:
- Step by Step guides
categories:
- Windows Server
description: "Learn how to create a Windows 11 virtual machine in Hyper-V with the required virtual hardware, Secure Boot and TPM 2.0 settings."
hidden: false
---

In this post, I will show you how to create a Windows 11 virtual machine using Hyper-V. Windows 11 has several minimum hardware requirements that also apply when you install it inside a virtual machine. The requirements of a Virtual Machine with Windows 11 on Hyper-V are:

- Generation 2
- At least two virtual processors
- 4096 MB of memory
- Secure Boot enabled
- TPM 2.0 enabled

If these requirements are not configured correctly, Windows Setup may report that the virtual machine cannot run Windows 11.

---

## Step 1: Run the New Virtual Machine Wizard

Assuming I don't have to explain how you download a Windows 11 ISO, Open `Hyper-V Manager` on the Hyper-V host.

In the left pane, select the Hyper-V host on which you want to create the virtual machine. Right-click the host and select `New`, followed by `Virtual Machine`.

The `New Virtual Machine Wizard` opens. Click `Next` to continue.

Enter a descriptive name for the virtual machine, for example:

- `Windows11-TestVM`

Click `Next`. At the next page, select `Generation 2` and click `Next`.

{{% alert title="Info" color="info" %}}
Generation 2 is required because Windows 11 needs `UEFI firmware`, `Secure Boot` support and `TPM 2.0`. These features are available to `Generation 2` virtual machines in Hyper-V. The generation cannot be changed through the normal Hyper-V settings after the virtual machine has been created. Make sure that Generation 2 is selected before continuing.
{{% /alert %}}

Enter at least 4096 MB of RAM, which is the minimum memory requirement for Windows 11. If the Hyper-V host has enough available memory, assigning 8192 MB provides more room for applications and updates.

Click `Next` and complete the rest of the create Virtual Machine wizard. On the Installation Options page, select Install an operating system from a bootable image file.

Click `Browse` and select the Windows 11 ISO file downloaded earlier. Click `Next`, review the selected settings and click `Finish`.

Do not start the virtual machine yet. TPM 2.0 and the required processor configuration must first be configured.

## Step 2: Configure TPM 2.0

In Hyper-V Manager, right-click the new virtual machine and select `Settings`.

Under `Hardware`, select `Processor` and ensure you configured at least `2 virtual processors`. While still in the virtual machine settings, select Security. Verify that Enable Secure Boot is selected and that the template is set to Microsoft Windows.

[![jv-media-8542-ee829fcc4f1f.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/create-windows-11-virtual-machine-hyper-v/jv-media-8542-ee829fcc4f1f.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/create-windows-11-virtual-machine-hyper-v/jv-media-8542-ee829fcc4f1f.png)

Next, select Enable Trusted Platform Module to provide the virtual machine with a virtual TPM 2.0 device.

Click `Apply` and then click `OK` to finish the Hyper-V configuration. Now you are ready to install Windows 11 which I think you don't need a step-by-step guide for.

---

## Summary

You have created a Generation 2 Windows 11 virtual machine in Hyper-V and configured the minimum required virtual hardware. The VM has two virtual processors, 4096 MB of memory, at least 64 GB for the virtual disk, Secure Boot and TPM 2.0 enabled.

Thank you for reading this post and I hope it was helpful!

{{% alert title="Sources 📖" color="info" %}}
These sources helped me by writing and research for this post;

1. https://www.microsoft.com/software-download/windows11
2. https://learn.microsoft.com/en-us/windows/whats-new/windows-11-requirements
3. https://learn.microsoft.com/en-us/windows-server/virtualization/hyper-v/get-started/create-a-virtual-machine-in-hyper-v
4. https://learn.microsoft.com/en-us/windows/security/hardware-security/tpm/trusted-platform-module-overview
{{% /alert %}}

{{< ads >}}

{{< article-footer >}}