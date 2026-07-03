---
title: "6: Windows Admin Center"
slug: "6-windows-admin-center"
date: 2025-01-01
tags:
categories:
description: "In this objective, you will learn how to enable and use Windows Admin Center in Microsoft Azure to manage the guest operating system of a Windows Server virtual machine. Make sure you use your own Azure subscription, tenant, and resource groups when completing the tasks. The goal of this lab is to gain hands-on experience with secure server management in Azure."
hidden: false
weight: 6
---

> Difficulty: Easy to Medium

## Introduction

In this lab, we will use Windows Admin Center to manage a Windows Server virtual machine in Azure.

In the previous labs, we created Azure resources such as resource groups, virtual networks, Network Security Groups, Windows Server virtual machines, Active Directory Domain Services and an application server. In this lab, we will build on that environment and add a management layer inside the Azure Portal.

The Azure Portal is very useful for managing Azure resources, such as the virtual machine object, disks, networking and access control. Windows Admin Center goes one layer deeper. It allows you to manage parts of the guest operating system of a Windows Server VM, such as updates, roles and features, PowerShell, registry, scheduled tasks, storage and files.

This lab is not necessarily a complete step-by-step guide for every button in the Azure Portal. The main goal is to achieve the required end-state, understand why Windows Admin Center is useful and learn how to access it securely.

---

## Requirements

- Around 45 to 60 minutes of your time
- Access to an Azure subscription
- Basic knowledge of the Azure Portal
- Basic knowledge of Windows Server
- A Windows Server VM in Azure
- Access to assign Azure RBAC roles
- Your own public IP address
- Remote Desktop access as backup management option

For the best learning experience, complete Lab 4 before starting this lab. This lab assumes that the following virtual machines already exist:

| Server name | IP address | Description |
| --- | --- | --- |
| JV-VM-DC | 10.69.0.100 | Domain controller, DNS server |
| JV-VM-APP | 10.69.0.101 | Application server, IIS |

Windows Admin Center will be enabled on `JV-VM-APP` in this lab.

---

## Minimizing Azure costs

As registering your creditcard to Azure might sound like paying a huge amount of bucks every month, but it's relatively cheap to try Azure and to perform some labs in it. You do have to adapt to this Pay-as-you-go structure. I will give you the following guidelines to minimize the costs:

- Shutdown unused VMs
	- VMs are the most expensive when running, when not running you still pay for disks and IP addresses
- Remove unused resources
- Place all testing resources in one resource group, which makes the deletion action very fast and easy
- Setup Budgets in your subscription

My best recommendation is to do a Lab objective, check if everything works, check your configuration and immediately remove all resources. Big chance you will not even pay 1 euro, dependent on how long you spent on the lab objective.

---

{{< ads >}}

## Lab objective

Justin Verstijnen Inc. wants to manage Windows Server virtual machines in Azure without relying only on Remote Desktop.

The company already has a domain controller and an application server in Azure. The application server must be manageable through Windows Admin Center in the Azure Portal.

The solution must meet the following requirements:

- Windows Admin Center must be enabled on `JV-VM-APP`
- The correct Azure role must be assigned to the administrator
- Access to Windows Admin Center must be restricted where possible
- The administrator must be able to connect to Windows Admin Center from the Azure Portal
- The administrator must validate guest OS management features
- The environment must be tested and cleaned up after the lab

## Existing resource group

Use the resource group from the previous Azure IaaS lab.

| Resource group name | Purpose |
| --- | --- |
| JV-RG-LAB | All resources for this Azure IaaS lab |

## Existing servers

| Server name | Role | Windows Admin Center usage |
| --- | --- | --- |
| JV-VM-DC | Domain controller, DNS server | Do not change unless needed |
| JV-VM-APP | Application server, IIS | Enable Windows Admin Center here |

## Windows Admin Center settings

| Setting | Value |
| --- | --- |
| Target VM | JV-VM-APP |
| Azure role | Windows Admin Center Administrator Login |
| Windows Admin Center port | TCP 6516 |
| Recommended source | Your own public IP address |

---

## 6.1 Checking the existing lab environment

Start by checking if the required virtual machines still exist.

- Open the Azure Portal
- Find and open "Virtual machines"
- Check if `JV-VM-DC` exists
- Check if `JV-VM-APP` exists
- Make sure both VMs are running

You can also check the VMs with Azure Cloud Shell.

{{< card code=true header="**Bash**" lang="bash" >}}
az vm list \
  --resource-group JV-RG-LAB \
  --show-details \
  --query "[].{Name:name, PowerState:powerState, Location:location}" \
  --output table
{{< /card >}}

If the VMs do not exist, complete the previous Azure IaaS lab first or create a new Windows Server VM for this lab.

---

## 6.2 Checking access to the application server

Before enabling Windows Admin Center, make sure you can still manage the application server with Remote Desktop. This gives you a backup option if something does not work as expected.

- Open `JV-VM-APP` in the Azure Portal
- Open "Connect"
- Choose "RDP"
- Connect to the VM
- Log in with a local administrator account or domain administrator account

After logging in, run the following commands in PowerShell.

{{< card code=true header="**PowerShell**" lang="powershell" >}}
hostname
whoami
ipconfig /all
Get-ComputerInfo | Select-Object CsName, WindowsProductName, WindowsVersion, OsHardwareAbstractionLayer
{{< /card >}}

Confirm that you are connected to `JV-VM-APP` before continuing.

---

## 6.3 Enabling Windows Admin Center on the application server

Windows Admin Center can be enabled from the Azure Portal as an extension on the virtual machine.

- Open the Azure Portal
- Find and open "Virtual machines"
- Open `JV-VM-APP`
- In the left menu, find and open "Windows Admin Center"
- Click "Install"
- Wait until the installation has completed

The installation adds Windows Admin Center functionality to the selected virtual machine. After the extension is installed, the Azure Portal can connect to the Windows Admin Center service for that server.

You can check the VM extensions with Azure Cloud Shell.

{{< card code=true header="**Bash**" lang="bash" >}}
az vm extension list \
  --resource-group JV-RG-LAB \
  --vm-name JV-VM-APP \
  --output table
{{< /card >}}

Review the output and check if a Windows Admin Center related extension is listed.

---

## 6.4 Assigning the Windows Admin Center role

Installing Windows Admin Center is not enough. The user who connects to Windows Admin Center must also have the correct Azure RBAC role.

Assign the following role to the administrator who needs to use Windows Admin Center:

`Windows Admin Center Administrator Login`

For this lab, assign the role at the resource group level.

- Open the Azure Portal
- Open "Resource groups"
- Open `JV-RG-LAB`
- Open "Access Control (IAM)"
- Click "+ Add"
- Click "Add role assignment"
- Search for `Windows Admin Center Administrator Login`
- Select the role
- Select the user or group that needs access
- Review and assign the role

After assigning the role, wait a few minutes before testing the connection. Azure RBAC changes are not always active immediately.

---

## 6.5 Restricting access to Windows Admin Center

Windows Admin Center uses TCP port `6516`. If the server has a Network Security Group, firewall or another network security layer in front of it, make sure access is restricted.

For this lab, only allow access from your own public IP address.

You can find your public IP address by using this tool:

https://tools.justinverstijnen.nl/iplookuptool

Create an inbound rule on the Network Security Group of `JV-VM-APP`.

Use the following values:

| Setting | Value |
| --- | --- |
| Source | IP Addresses |
| Source IP addresses/CIDR ranges | Your own public IP address, for example `1.2.3.4/32` |
| Source port ranges | `*` |
| Destination | Any |
| Service | Custom |
| Destination port ranges | `6516` |
| Protocol | TCP |
| Action | Allow |
| Priority | 1020 |
| Name | Allow-WAC-From-My-IP |

You can also create the rule with Azure Cloud Shell.

{{< card code=true header="**Bash**" lang="bash" >}}
MY_IP=$(curl -s https://api.ipify.org)

az network nsg rule create \
  --resource-group JV-RG-LAB \
  --nsg-name JV-NSG-APP \
  --name Allow-WAC-From-My-IP \
  --priority 1020 \
  --direction Inbound \
  --access Allow \
  --protocol Tcp \
  --source-address-prefixes "$MY_IP/32" \
  --source-port-ranges '*' \
  --destination-address-prefixes '*' \
  --destination-port-ranges 6516
{{< /card >}}

Be careful with opening management ports to the internet. For a real production environment, review whether you can keep management access private by using Azure Portal access, Azure Bastion, VPN, private networking or another secure management method.

---

## 6.6 Connecting to Windows Admin Center

Now test the Windows Admin Center connection.

- Open the Azure Portal
- Open `JV-VM-APP`
- In the left menu, open "Windows Admin Center"
- Click "Connect"
- Wait until the Windows Admin Center blade opens

If the connection does not work, check the following items:

- The VM is running
- The Windows Admin Center extension is installed
- Your account has the `Windows Admin Center Administrator Login` role
- The Network Security Group allows TCP port `6516` from your source IP address
- Your public IP address has not changed
- The Windows Firewall inside the VM is not blocking the connection

You can test if port `6516` is reachable from your own computer with PowerShell.

{{< card code=true header="**PowerShell**" lang="powershell" >}}
Test-NetConnection <public-ip-address> -Port 6516
{{< /card >}}

Replace `<public-ip-address>` with the public IP address of `JV-VM-APP`.

---

## 6.7 Exploring Windows Admin Center features

After connecting, explore the Windows Admin Center blade.

Check at least the following sections:

- Overview
- Updates
- Roles & features
- PowerShell
- Registry
- Scheduled tasks
- Storage
- Files

Do not randomly change production-like settings. The purpose of this lab is to understand what Windows Admin Center can manage and how it is different from managing only the Azure VM object.

To give a better overview of the tool, watch this video where I am clicking through the admin panel and showing the features and blades:

<iframe
width="960"
height="540"
src="https://www.youtube.com/embed/jCInuPETL10?autoplay=1&mute=1&playsinline=1"
title="JV video player"
frameborder="0"
allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
allowfullscreen>
</iframe>

---

## 6.8 Running PowerShell through Windows Admin Center

Open the PowerShell tool inside Windows Admin Center and run the following commands.

{{< card code=true header="**PowerShell**" lang="powershell" >}}
hostname
whoami
Get-Service | Sort-Object Status, Name | Select-Object -First 10
Get-WindowsFeature Web-Server
Get-Volume
{{< /card >}}

Now create a small test folder and file.

{{< card code=true header="**PowerShell**" lang="powershell" >}}
New-Item -Path "C:\WAC-Lab" -ItemType Directory -Force
Set-Content -Path "C:\WAC-Lab\wac-test.txt" -Value "Windows Admin Center lab test file"
Get-Content -Path "C:\WAC-Lab\wac-test.txt"
{{< /card >}}

This proves that you are not only viewing Azure resource information, but also managing the guest operating system inside the VM.

---

## 6.9 Checking Windows Updates

Open the "Updates" section in Windows Admin Center.

Check the following items:

- Can Windows Admin Center read the update status?
- Are updates available?
- Is a reboot required?
- Can you see update history?

For a lab environment, you may install updates if you have enough time. Be aware that installing updates can take a while and may require a reboot.

Do not assume a server is patched because the VM exists in Azure. The Azure VM resource and the Windows guest OS must both be managed.

---

## 6.10 Checking roles and features

Open the "Roles & features" section in Windows Admin Center.

Check if the IIS role is installed on `JV-VM-APP`.

The role is named:

`Web Server (IIS)`

You can also validate this with PowerShell.

{{< card code=true header="**PowerShell**" lang="powershell" >}}
Get-WindowsFeature Web-Server
{{< /card >}}

If IIS is not installed yet, install it from Windows Admin Center or with PowerShell.

{{< card code=true header="**PowerShell**" lang="powershell" >}}
Install-WindowsFeature Web-Server -IncludeManagementTools
{{< /card >}}

After installation, test the local website.

{{< card code=true header="**PowerShell**" lang="powershell" >}}
Invoke-WebRequest http://localhost
{{< /card >}}

---

## 6.11 Checking storage and files

Open the "Storage" section in Windows Admin Center.

Check the following items:

- Operating system disk
- Volume size
- Free space
- File system
- Health status

Then open the "Files" section and browse to:

`C:\WAC-Lab`

Check if the file `wac-test.txt` exists.

This confirms that Windows Admin Center can be used to inspect and manage files on the server.

---

## 6.12 Optional: Creating a scheduled task

Open the "Scheduled tasks" section in Windows Admin Center.

Create a simple scheduled task or review the existing tasks. If you create a task, keep it harmless and easy to remove.

Example action for a test task:

{{< card code=true header="**PowerShell**" lang="powershell" >}}
powershell.exe -Command "Get-Date | Out-File C:\WAC-Lab\scheduled-task-test.txt"
{{< /card >}}

After testing, remove the scheduled task again.

---

## 6.13 Testing the lab objective

Now validate if the environment meets the requirements.

Check the following items:

- `JV-VM-APP` exists and is running
- Windows Admin Center is installed on `JV-VM-APP`
- Your user has the `Windows Admin Center Administrator Login` role
- TCP port `6516` is only allowed from a trusted source where needed
- You can connect to Windows Admin Center from the Azure Portal
- You can open the Updates section
- You can open the Roles & features section
- You can open the PowerShell section
- You can run PowerShell commands through Windows Admin Center
- You can see storage information
- You can browse to `C:\WAC-Lab` in the Files section

Useful validation commands:

{{< card code=true header="**PowerShell**" lang="powershell" >}}
hostname
whoami
Get-WindowsFeature Web-Server
Get-Volume
Test-Path "C:\WAC-Lab\wac-test.txt"
{{< /card >}}

---

## 6.14 Cleaning up the lab

When you are done, clean up the test configuration.

Inside `JV-VM-APP`, remove the test folder if you no longer need it.

{{< card code=true header="**PowerShell**" lang="powershell" >}}
Remove-Item -Path "C:\WAC-Lab" -Recurse -Force
{{< /card >}}

If you created an inbound NSG rule for Windows Admin Center, remove it when you no longer need it.

{{< card code=true header="**Bash**" lang="bash" >}}
az network nsg rule delete \
  --resource-group JV-RG-LAB \
  --nsg-name JV-NSG-APP \
  --name Allow-WAC-From-My-IP
{{< /card >}}

If this lab environment is no longer needed, remove the complete resource group to prevent unexpected costs.

{{< card code=true header="**Bash**" lang="bash" >}}
az group delete -n JV-RG-LAB
{{< /card >}}

The lab is now done, let's check your knowledge!

---

## Knowledge check

{{< quiz >}}
{
  "intro": "Answer these question(s) to test your understanding of this post. Your answers are not saved or sent anywhere; this is simply a personal knowledge check. If you refresh the page, your answers will be cleared.",
  "questions": [
    {
      "question": "What role must an administrator have to manage a Virtual Machine using Windows Admin Center?",
      "reference": "Step 2: Assigning the correct permissions",
      "referenceUrl": "#step-2-assigning-the-correct-permissions",
      "answers": [
        {
          "text": "Windows Admin Center Administrator Login",
          "correct": true,
          "message": "Correct! This is the right answer."
        },
        {
          "text": "Reader",
          "correct": false,
          "message": "Incorrect. Review the referenced section and try again."
        },
        {
          "text": "Owner",
          "correct": false,
          "message": "Incorrect. It cloud assign the correct role itself, but Owner permissions is not correct."
        },
        {
          "text": "Contributor",
          "correct": false,
          "message": "Incorrect. Review the referenced section and try again."
        },
        {
          "text": "Administrator",
          "correct": false,
          "message": "Incorrect. Review the referenced section and try again."
        }
      ]
    },
    {
      "question": "What port does Windows Admin Center use?",
      "reference": "Step 3: Open up the ports (optional)",
      "referenceUrl": "#step-3-open-up-the-ports-optional",
      "answers": [
        {
          "text": "TCP 6516",
          "correct": true,
          "message": "Correct! This is the right answer."
        },
        {
          "text": "TCP 3389",
          "correct": false,
          "message": "Incorrect. Review the referenced section and try again."
        },
        {
          "text": "TCP 80/443",
          "correct": false,
          "message": "Incorrect. Review the referenced section and try again."
        },
        {
          "text": "UDP 53",
          "correct": false,
          "message": "Incorrect. Review the referenced section and try again."
        }
      ]
    },
    {
      "question": "What feature is NOT available in the Windows Admin Center blade?",
      "reference": "Step 4: Connecting to Windows Admin Center",
      "referenceUrl": "#step-4-connecting-to-windows-admin-center",
      "answers": [
        {
          "text": "Removing software",
          "correct": false,
          "message": "Incorrect. Review the referenced section and try again."
        },
        {
          "text": "Adding registry keys",
          "correct": false,
          "message": "Incorrect. Review the referenced section and try again."
        },
        {
          "text": "Changing Group Policy settings",
          "correct": true,
          "message": "Correct! This is the right answer."
        },
        {
          "text": "Checking and installing Windows Updates",
          "correct": false,
          "message": "Incorrect. Review the referenced section and try again."
        },
        {
          "text": "Installing and removing Server Roles",
          "correct": false,
          "message": "Incorrect. Review the referenced section and try again."
        }
      ]
    }
  ]
}
{{< /quiz >}}

---

## Summary

In this lab, you enabled Windows Admin Center for a Windows Server VM in Azure. You assigned the correct Azure role, reviewed the required management port, connected from the Azure Portal and tested several guest OS management features.

Windows Admin Center is useful because it reduces the need to use Remote Desktop for every management task. You can manage updates, roles and features, PowerShell, registry, scheduled tasks, storage and files from a browser-based management interface in the Azure Portal.

### Sources

1. [https://learn.microsoft.com/en-us/windows-server/manage/windows-admin-center/azure/manage-vm](https://learn.microsoft.com/en-us/windows-server/manage/windows-admin-center/azure/manage-vm)

{{< ads >}}

{{< article-footer >}}