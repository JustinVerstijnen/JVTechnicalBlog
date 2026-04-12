---
title: "Azure Virtual Desktop V6/V7 VMs imaging"
date: 2026-03-12
slug: "azure-virtual-desktop-v6-v7-vms-imaging"
categories:
  - Azure Virtual Desktop
tags:
  - Step by Step guides
description: >
  When I first chose to use V6 or V7 machines with Azure Virtual Desktop, I ran into some boot controller errors about the boot...
---
When I first chose to use V6 or V7 machines with Azure Virtual Desktop, I ran into some boot controller errors about the boot controller not supporting SCSI images.

- *The VM size 'Standard\_E4as\_v7' cannot boot with OS image or disk. Please check that disk controller types supported by the OS image or disk is one of the supported disk controller types for the VM size 'Standard\_E4as\_v7'. Please query sku api at <https://aka.ms/azure-compute-skus> to determine supported disk controller types for the VM size. (Code: InvalidParameter)*
- *This size is not available because it does not support the SCSI disk controller type.*

Because I really wanted to use higher version VMs, I went to research on how to solve this problem. I will describe the process from creating the initial imaging VM, to capture and installing new AVD hosts with our new image.

---

## The problem described

When using V6 and higher version Virtual Machines in Azure, the Boot Controller will also change from the older SCSI to NVMe. When using local VM storage, this could give a pretty disk performance increase but not really for Azure Virtual Desktop. We mostly use managed disks here so we don't use that storage.

This change means that we have to also use a NVMe capable image storage, and this brings us to Azure Compute Gallery. With this Azure solution, we are able to do image versioning and has support for NVMe enabled VMs.

I used the managed images option in the past, as this was the most efficient option to deploy images very fast. However, NVMe controller VMs are **not** supported by those managed images and we can install up to V5 only.

|  |  |
| --- | --- |
| **VM Version** | **Boot controller** |
| v1-4 | SCSI |
| v5 | SCSI |
| v6 | NVMe |
| v7 | NVMe |

---

## CPU performance v5 and v7 machines

Because I wondered what the performance difference could be between similar v5 and v7 machines in Azure, I did two benchmark tests on both machines. Both using these software:

- Geekbench 6
- Passmark PerformanceTest

This gave pretty interesting results:

|  |  |  |
| --- | --- | --- |
| **Benchmark software** | [**E4s\_v5**](https://browser.geekbench.com/v6/cpu/16996706) | [**E4as\_v7**](https://browser.geekbench.com/v6/cpu/16986414) |
| Geekbench 6 Single Core | 1530 | 2377 |
| Geekbench 6 Multi Core | 3197 | 5881 |
| Passmark CPU | 5950 | 9092 |

This result would indicate a theoretical CPU performance increase of around 55%.

Click here for benchmark results

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-virtual-desktop-v6-v7-vms-imaging-7340/jv-media-7340-52f0abf87f8e.png)

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-virtual-desktop-v6-v7-vms-imaging-7340/jv-media-7340-ad2552f93fe3.png)

---

## Step 1: Creating an imaging PC

Let's start by creating our imaging PC. This is a temporary VM which we will do all our configurations on before mass deployment. Think of:

- Installing applications
- Installing dependencies
- Installing latest Windows Updates
- Optimizations
- Configuring the correct language

In the Azure Portal (<https://portal.azure.com>), create a resource group if not already having one for this purpose.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-virtual-desktop-v6-v7-vms-imaging-7340/jv-media-7340-54a751e40db9.png)

Now let's go to "Virtual Machines" to create a temporary virtual machine. My advice is to always use the exact same size/specs as you will roll out in the future.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-virtual-desktop-v6-v7-vms-imaging-7340/jv-media-7340-d0fd836251b7.png)

Create a new virtual machine using your settings. I chose the RDP top be opened so we can login to the virtual machine to install applications and such. Ensure you select the Multi-session marketplace image if you use a Pooled hostpool.

The option "Trusted launch virtual machines" is mandatory for these NVMe based VM sizes, so keep this option configured.

This VM creation process takes around 5 minutes.

---

## Step 2: Virtual Machine customizations

Now we need to do our customizations. I would advise to do this in this order:

1. Execute [Virtual Desktop Optimization Tool](https://github.com/The-Virtual-Desktop-Team/Virtual-Desktop-Optimization-Tool) (VDOT)
2. Configuring the right system language
3. Install 3rd party applications

Connect to the virtual machine using RDP. You can use the Public IP assigned to the virtual machine to connect to:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-virtual-desktop-v6-v7-vms-imaging-7340/jv-media-7340-be1658b4910c.png)

After logging in with the credentials you spefidied in the Azure VM wizard we are connected.

First I executed the Virtual Desktop Optimization tool:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-virtual-desktop-v6-v7-vms-imaging-7340/jv-media-7340-aba47fc32746.png)

Then ran my script to change the language which you can find here: <https://justinverstijnen.nl/set-correct-language-and-timezone-on-azure-vm/>

And finally installed the latest updates and applications. I dont like preview updates in production environments so not installed the update awaiting.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-virtual-desktop-v6-v7-vms-imaging-7340/jv-media-7340-93699f654fec.png)

---

## Step 3: Sysprepping the Virtual Machine

Now that we have our machine ready, it's time to execute an application called sysprep. This makes the installation ready for mass deployment, eliminating every driver, (S)ID and other specific information to this machine.

You can find this here:

- *C:\Windows\System32\Sysprep\sysprep.exe*

Put this line into the "Run" window and the applications opens itself.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-virtual-desktop-v6-v7-vms-imaging-7340/jv-media-7340-6632f04fa2c5.png)

Select "Generalize" and choose the option to shutdown the machine after completing.

{{% alert color="info" %}}
If getting an error that Bitlocker Drive Encryption is enabled, execute this command to disable it (you can re-enable it after deployment):

PowerShell

```powershell
manage-bde -off C:
```

Wait for around 15 minutes to finish decryption, then try Sysprep again.
{{% /alert %}}

The machine will now clean itself up and then shutdown. This process can take up to 20 minutes, in the meanwhile you can advance with step 4.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-virtual-desktop-v6-v7-vms-imaging-7340/jv-media-7340-25754a9739b5.png)

---

## Step 4: Create Azure Compute Gallery instance

Before we can capture the VM, we must first create a space for it. This is the Azure Compute Gallery, a managed image repository inside of your Azure environment.

Go to "Azure compute galleries" and create a new ACG.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-virtual-desktop-v6-v7-vms-imaging-7340/jv-media-7340-abf230d21ce6.png)

Give the ACG a name and place it in the right Subscription/Resouce Group.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-virtual-desktop-v6-v7-vms-imaging-7340/jv-media-7340-e210831c54d0.png)

Then click "Next".

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-virtual-desktop-v6-v7-vms-imaging-7340/jv-media-7340-ba5647019f2c.png)

I use the default "RBAC" option at the "Sharing" tab as I dont want to publicy share this image. With the other options, you could share images acros other tenants if you want.

After finishing the wizard, create the Compute Gallery and wait for it to deploy which takes several seconds.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-virtual-desktop-v6-v7-vms-imaging-7340/jv-media-7340-aa2d1ab20d6b.png)

---

## Step 5: Capture VM image and create VM definition

We can now finally capture our VM image and store it in the just created ACG. Go back to the virtual machine you have sysprepped.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-virtual-desktop-v6-v7-vms-imaging-7340/jv-media-7340-2b087e9a2137.png)

As it is "Stopped" but not "Deallocated", we must first click "Stop" to deallocate the VM. This is because the OS itself gave the shutdown command but this does not really de-allocate the machine, and is still stand-by.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-virtual-desktop-v6-v7-vms-imaging-7340/jv-media-7340-afed8343bb0a.png)

Now click "Capture" and select the "Image" option.

Now we get a wizard where we have to select our ACG and define our image:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-virtual-desktop-v6-v7-vms-imaging-7340/jv-media-7340-1f40181c2948.png)

Click on "Create new" to create a new image definition:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-virtual-desktop-v6-v7-vms-imaging-7340/jv-media-7340-6543c6812cd8.png)

Give this a name and ensure that the check for "NVMe" is checked. Checking this mark enables NVMe support, while also still maintaining the SCSI support. Finish the versioning of the image and then advance through the wizard:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-virtual-desktop-v6-v7-vms-imaging-7340/jv-media-7340-4b28f0e58e67.png)

The image will then be created:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-virtual-desktop-v6-v7-vms-imaging-7340/jv-media-7340-3fd2940a9eb3.png)

### Checking image disk controller types

If you want, you can check the VM support of your image using this simple Azure PowerShell scipt:

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
$rg = "your resourcegroup"
$gallery = "your gallery"
$imageDef = "your image definition"

$def = Get-AzGalleryImageDefinition `
    -ResourceGroupName $rg `
    -GalleryName $gallery `
    -Name $imageDef

$def.Features | Format-Table Name, Value -AutoSize
{{< /card >}}

This will result something like this:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-virtual-desktop-v6-v7-vms-imaging-7340/jv-media-7340-ab54a35d32d8.png)

This states at the DiskControllerTypes that it supports both SCSI and NVMe for a broad support.

---

## Step 6: Deploy the new NVMe image

After the image has captured, I removed the imaging PC from my environment as you can do in the image capture wizard. I ended up having these 3 resources left:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-virtual-desktop-v6-v7-vms-imaging-7340/jv-media-7340-491499c03840.png)

These resources should be kept, where the VM image version will get newer instances as you capture more images during the lifecycle.

We will now deploy a Azure Virtual Desktop hostpool with one VM in it, to test if we can select V7 machines at the wizard. Go to "host pools" and create a new hostpool if not done so already. Adding VMs to an existing hostpool is also possible.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-virtual-desktop-v6-v7-vms-imaging-7340/jv-media-7340-b0d447337788.png)

The next tab is more important, as we have to actually add the virtual machines there:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-virtual-desktop-v6-v7-vms-imaging-7340/jv-media-7340-f7c5371d4aa9.png)

At the "Image" section, click on "see all images", and then select your shared image definition. This will automatically pick the newest version from the list you saved there.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-virtual-desktop-v6-v7-vms-imaging-7340/jv-media-7340-f1939888cfed.png)

Now advance through the Azure Virtual Desktop hostpool wizard and finish.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-virtual-desktop-v6-v7-vms-imaging-7340/jv-media-7340-816587fc6379.png)

This will create a hostpool with the machines in it with the best specifications and highest security options available at this moment.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-virtual-desktop-v6-v7-vms-imaging-7340/jv-media-7340-1ee55ab9aa01.png)

---

## Step 7: Testing the virtual machine

After the hostpool is deployed, we can check how this works now. The hostpool and machine are online:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-virtual-desktop-v6-v7-vms-imaging-7340/jv-media-7340-493b01a43573.png)

And looking into the VM itself, we can check if this is a newer generation of virtual machine:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-virtual-desktop-v6-v7-vms-imaging-7340/jv-media-7340-40a3dd273fdb.png)

Now I have finished the configuration of the hostpool as described in my AVD implementation guide: <https://justinverstijnen.nl/azure-virtual-desktop-fslogix-and-native-kerberos-authentication/#9-preparing-the-hostpool>

---

## Summary

If you want to use newer V6 or V7 AVD machines, you need to switch to an NVMe-compatible image workflow with Azure Compute Gallery. That is the supported way to build, version, and deploy modern AVD session hosts.

I hope I also informed you a bit on how these newer VMs work and why you cloud get the errors in the first place. Simply by still using a method Microsoft wants you to stop doing. I really think the Azure Compute Gallery is the better option right now, but takes a bit more configuration.

Thank you for reading this guide and I hope it was helpful.

### Sources

These sources helped me by writing and research for this post;

1. <https://learn.microsoft.com/en-us/azure/virtual-machines/shared-image-galleries>
2. <https://learn.microsoft.com/en-us/azure/virtual-machines/nvme-overview>
3. <https://learn.microsoft.com/en-us/azure/virtual-machines/enable-nvme-interface>
4. <https://justinverstijnen.nl/azure-compute-gallery-and-avd-vm-images/>

{{< ads >}}

{{< article-footer >}}
