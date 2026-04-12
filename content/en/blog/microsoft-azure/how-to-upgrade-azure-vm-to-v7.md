---
title: "How to upgrade an Azure VM to v7"
date: 2026-04-01
slug: "how-to-upgrade-azure-vm-to-v7"
categories:
  - Microsoft Azure
tags:
  - Step by Step guides
description: >
  As we now have V7 machines in Microsoft Azure with a new boot controller, we need to upgrade our VMs with some more administrative...
draft: true
---
As we now have V7 machines in Microsoft Azure with a new boot controller, we need to upgrade our VMs with some more administrative effort. We cannot upgrade V1 to V5 machines directly to V6 or V7 because of this boot controller change.

On this page, I will explain how to upgrade your Virtual Machine from V5 to V7 using manual actions, to better understand the steps needed to perform this upgrade.

As I already did some research on this topic with Azure Virtual Desktop, I also did some benchmarks, where V7 will have a CPU power gain of around 50% opposing to V5: <https://justinverstijnen.nl/azure-virtual-desktop-v6-v7-vms-imaging/>

---

---

## Requirements

- Basic knowledge of Azure
- An Azure subscription
- An Azure Virtual Machine from v1 to 5 based on generation 2
- Around 20 minutes of your time

---

## Brief description of the upgrade

We will perform this upgrade by hand using the portal only. This consists of the following steps:

1. Checking the dependencies
2. Removing the current Virtual Machine
3. Create a new Virtual Machine
   - Assign the disk to the new Virtual Machine
   - Assign the NSG to the new Virtual Machine
   - Assign the Public IP to the new Virtual Machine
4. Set correct IP address
5. Re-enable Azure Backup for the new Virtual Machine

As this will cause downtime for the virtual machine, this actions must be done outside of office hours. The good part is that we don't need to have to run scripts and such. However this is possible using scripts but I like a portal approach for this task.

---

## Step 1: Checking dependencies

We will start in the Azure Portal by reviewing some of the dependencies of the virtual machine. Such dependencies can be:

- The machine has a internal IP address
- The machine has a external IP address (Public IP)
- The machine has Azure Backup configured
- The machine has a Network Security Group assigned
- The machine possibly runs third party applications with IP address dependencies

For the purpose of this guide, I have created a dummy machine based on v5 which I will upgrade to v7:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/how-to-upgrade-azure-vm-to-v7-8281/jv-media-8281-4fc8b54b9668.png)

Let's check the dependencies of the existing machine now:

|  |  |
| --- | --- |
| **Dependency** | **Description** |
| Internal IP address | 10.0.0.69 |
| External IP address | 52.233.252.179, vm-jv-vmv5tov7-ip |
| Azure Backup | Configured to Recovery Services Vault rsv-jv-vmv5tov7 |
| Network Security Group | Yes, vm-jv-vmv5tov7-nsg |
| Third party applications | Web server |
| Logic Apps | No (but could be in your environment) |

Most dependencies can be found on the Virtual Machine overview page:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/how-to-upgrade-azure-vm-to-v7-8281/jv-media-8281-25e2e13440e5.png)

The backup information under the Backup blade:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/how-to-upgrade-azure-vm-to-v7-8281/jv-media-8281-5fe049d0df7e.png)

Make sure to note all these information as we have to partly rebuild the server using these settings.

And to simulate a dependency, I have quickly setup a IIS instance on the server with a simple webpage:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/how-to-upgrade-azure-vm-to-v7-8281/jv-media-8281-c4e39e52cba7.png)

And then hosted this simple website from an earlier project: <https://github.com/JustinVerstijnen/JV-RickRoll>

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/how-to-upgrade-azure-vm-to-v7-8281/jv-media-8281-1ce22b512f78.png)

So our v5 server is reachable using the IP address which has also opened port 80 in the NSG.

---

## Step 2: Remove the Virtual Machine

Now we have to remove the current virtual machine. Be sure that you only remove the VM instance and have a backup in place for a fast recovery. We cannot have 2 VMs with the same name simultaneously in our subscription.

Navigate to the virtual machine and then delete the VM, and be sure to only select the virtual machine:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/how-to-upgrade-azure-vm-to-v7-8281/jv-media-8281-ae9d50d908d2.png)

And then deselect everything to make sure no data is being lost:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/how-to-upgrade-azure-vm-to-v7-8281/jv-media-8281-d67a3e5f4399.png)

Now the machine will be gone but everything else has been retained:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/how-to-upgrade-azure-vm-to-v7-8281/jv-media-8281-8d1b6cc2e583.png)

Now navigate to "Network interfaces" to delete the old network interface. This will make things somewhat easier at the creation of a new virtual machine.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/how-to-upgrade-azure-vm-to-v7-8281/jv-media-8281-8b1715f57fc1.png)

This makes our Public IP freely assignable and our old NSG unassigned.

---

## Step 3: Create new virtual machine

We will now re-create our virtual machine, based on v7 and our existing disk. Navigate to the disk through the resource group, or search for "Disks" and select your existing disk from the old machine.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/how-to-upgrade-azure-vm-to-v7-8281/jv-media-8281-2227a0badc41.png)

From the disk, click "+ Create VM" to create a new VM based on this existing OS disk.

Make sure to have every setting similar to your old machine, especially these settings:

- VM name
- Security settings

And select a v7 based size.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/how-to-upgrade-azure-vm-to-v7-8281/jv-media-8281-7577955cc0df.png)

Click "Next". We cant change anything on the Disks page, as we create this VM based on a existing disk. Advance to the "Networking" page.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/how-to-upgrade-azure-vm-to-v7-8281/jv-media-8281-afb0b701626b.png)

Select the existing Public IP and the Network Security Group already existing. You have to select the "Advanced" NSG option. This both will not create new instances but use your resources from the old virtual machine.

Now you can finish the creation of the virtual machine and this deployment will be done in seconds:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/how-to-upgrade-azure-vm-to-v7-8281/jv-media-8281-e3f988d09684.png)

---

## Step 4: Set correct IP address

If the IP address has been changed by Azure due to the assignment, you can now change this to your own value. My v5 machine has an IP address of 10.0.0.69. Let's configure this again:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/how-to-upgrade-azure-vm-to-v7-8281/jv-media-8281-87b038d33c82.png)

Go to the Virtual Machine and then to the "Networking" blade. Then open up the IP configuration settings. Note that the IP address is now 10.0.0.4.

Click "ipconfig1" to configure the IP address.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/how-to-upgrade-azure-vm-to-v7-8281/jv-media-8281-99e4071ab62f.png)

Select the "Static" allocation option and fill in your desired IP addrress. The VM must restart to apply this settings.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/how-to-upgrade-azure-vm-to-v7-8281/jv-media-8281-881473c435f1.png)

Then navigate to your VM and restart the VM:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/how-to-upgrade-azure-vm-to-v7-8281/jv-media-8281-93cf6fc11118.png)

---

## Step 5: Re-enable Backup for the Virtual Machine

As the virtual machine instance has changed, there is a possibility that some services linked to the VM must be re-configured. Something like this is the backup and/or Logic Apps.

For the Backup, go to the virtual machine and check "Backup".

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/how-to-upgrade-azure-vm-to-v7-8281/jv-media-8281-5f905489d932.png)

However, in my case the backup was already enabled. I like to include this in the list of steps to be sure that your backup doesn't interrupt and prevent loss of data.

---

## Step 6: After upgrade testing

Now that we completely upgraded our VM instance, we can test some things to check if the upgrade went like we expected.

Let's login to our VM:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/how-to-upgrade-azure-vm-to-v7-8281/jv-media-8281-2a984925279f.png)

As you can see we are now on AMD based CPU's like we selected. On the v5 I had Intel based CPUs. This is the "a" in the VM size.

The VM itself works like expected. Even the webpage on the VM was available again on the same IP after the upgrade, like we configured:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/how-to-upgrade-azure-vm-to-v7-8281/jv-media-8281-ee7d51840f64.png)

And the machine is completely the same, but now on the faster v7 size:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/how-to-upgrade-azure-vm-to-v7-8281/jv-media-8281-ed5ce7bb3f12.png)

---

## Summary

Upgrading your VMs to the latest size and version available will keep them up to speed. Newer sizes are almost always faster, in this case around 50% more CPU performance according to benchmarks which I already found out in an earlier blog: <https://justinverstijnen.nl/azure-virtual-desktop-v6-v7-vms-imaging/>

Using this guide enables you to upgrade an VM in a few minutes and gets your server on the latest hardware. When using domain environments, this will also give no huge errors as the SID and installation ID of the machine stays the same.

Thank you for visiting this page and I hope it was helpful.

### Sources

These sources helped me by writing and research for this post;

1. <https://learn.microsoft.com/en-us/azure/virtual-machines/vm-naming-conventions#naming-convention-explanation>

---

## End of the page 🎉

You have reached the end of the page. You can select a category, share this post on X, LinkedIn and Reddit or return to the blog posts collection page. Thank you for visiting this post.

If you think something is wrong with this post or you want to know more, you can send me a message to one of my social profiles at: <https://justinverstijnen.nl/about/>

[Go back to Blog](https://justinverstijnen.nl/blog/)

If you find this page and blog very useful and you want to leave a donation, you can use the button below to buy me a beer. Thank you in advance and cheers :)

[![](https://img.buymeacoffee.com/button-api/?text=Buy me a beer&emoji=🍺&slug=justinverstijnen&button_colour=FFDD00&font_colour=000000&font_family=Arial&outline_colour=000000&coffee_colour=ffffff)](https://www.buymeacoffee.com/justinverstijnen)

[![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/about-66/jv-media-66-36a3c69c96cb.png)](https://buymeacoffee.com/justinverstijnen)

The [terms and conditions](https://justinverstijnen.nl/terms-conditions/) apply to this post.

Page visitors:
No page-counter data available yet.
