---
title: "5 - Azure IaaS + Azure Virtual Desktop"
slug: "5-azure-iaas-avd"
date: 2025-09-03
tags:
- Lab Objective
- Knowledge Check
categories:
description: "In this objective, you will learn about how to build and configure the required Azure resources in your own environment. Make sure you use your own Azure subscription, tenant, and resource groups when completing the tasks. The goal of this lab is to gain hands-on experience with setting up Azure infrastructure in a secure and structured, where the goal is to maximize the learning experience."
hidden: false
weight: 5
---

> Difficulty: Medium

## Introduction

In this lab, we will combine Azure Infrastructure as a Service with Azure Virtual Desktop. This is a more advanced lab objective than the previous IaaS lab, because we now add a remote work solution for 16 concurrent employees.

The environment will contain a domain controller, separate resource groups, multiple virtual networks, Azure Virtual Desktop session hosts and FSLogix profile containers stored on an Azure Storage Account.

This lab is not necessarily a complete step-by-step guide for every button in the Azure Portal. The main goal is to achieve the required end-state and understand how the resources depend on each other. Steps may vary as Microsoft updates the Azure Portal and Azure Virtual Desktop experience regularly.

---

## Requirements

- Around 4 to 6 hours of your time
- Access to an Azure subscription
- Basic knowledge of Azure IaaS
- Basic knowledge of Windows Server and Active Directory Domain Services
- Basic knowledge of Remote Desktop concepts
- A domain name to use for the Active Directory domain
- Test users which can sign in to Azure Virtual Desktop

---

## Minimizing Azure costs

This lab uses multiple virtual machines, Azure Virtual Desktop and Azure Storage. This means the lab can become more expensive than the previous labs if you keep resources running.

To minimize costs during this lab, use the following guidelines:

- Shutdown unused VMs
	- This includes the domain controller, application server and AVD session hosts
- Use a small VM size for testing
- Do not keep the AVD session hosts running longer than needed
- Remove the full lab environment when you are done
- Use resource groups to make cleanup easier
- Check the Cost analysis page in your Azure subscription
- Do not store large user profiles or unnecessary test data

My best recommendation is to complete the objective, validate the configuration, document your result and remove the resource groups afterwards.

---

## Lab objective

Justin Verstijnen Inc. wants to deploy a secure and future-ready network in Azure, including the ability for employees to work remotely using Azure Virtual Desktop. The environment must support 16 concurrent employees.

The remote work solution must use Azure Virtual Desktop, and user profiles must work across both session hosts by using FSLogix profile containers stored on Azure Files.

## Company domain

Use the following Active Directory domain for this lab:

`justinverstijnen.nl`

## Resource groups

Solutions should be separated into dedicated resource groups as much as possible.

| Resource group name | Purpose |
|---|---|
| JV-RG-Infrastructure | All resources for the general infrastructure |
| JV-RG-VirtualDesktop | All resources for Azure Virtual Desktop |
| JV-RG-Backups | All resources related to backups |

## Servers

Roles should be placed on separate servers as much as possible.

| Server name | IP address | Description |
|---|---:|---|
| JV-DC-SRV01 | 10.0.0.10 | Domain controller, DNS server |
| JV-APP-SRV01* | 10.0.0.11* | Application server* |

\* If there is sufficient time remaining.

## Azure Virtual Desktop

Use a single host pool for the Azure Virtual Desktop machines.

| Resource | Name | Purpose |
|---|---|---|
| Host pool | JV-AVD-Hostpool | General host pool for all 16 employees |
| Workspace | JV-AVD-Workspace | Workspace used by the employees |
| Application group | JV-AVD-DesktopAppGroup | Desktop application group |
| Session host 1 | JV-AVD-SH01 | First Azure Virtual Desktop session host |
| Session host 2 | JV-AVD-SH02 | Second Azure Virtual Desktop session host |

## Network

Different solutions should be placed in their own network where possible.

| Network name | Network | Purpose |
|---|---:|---|
| JV-VNET01 | 10.0.0.0/16 | Infrastructure network |
| JV-VNET02 | 10.1.0.0/16 | Azure Virtual Desktop network |

Recommended subnets:

| Subnet name | Network | Purpose |
|---|---:|---|
| infrastructure | 10.0.0.0/24 | Domain controller and optional application server |
| avd-sessionhosts | 10.1.0.0/24 | Azure Virtual Desktop session hosts |

---

## 3.1 Creating the resource groups

Start by creating the resource groups for this lab.

Create the following resource groups in the West Europe region:

- `JV-RG-Infrastructure`
- `JV-RG-VirtualDesktop`
- `JV-RG-Backups`

You can also create the resource groups with Azure Cloud Shell.

{{< card code=true header="**Bash**" lang="bash" >}}
az group create -l westeurope -n JV-RG-Infrastructure
az group create -l westeurope -n JV-RG-VirtualDesktop
az group create -l westeurope -n JV-RG-Backups
{{< /card >}}

After creating the resource groups, check if they are visible in the Azure Portal.

## 3.2 Creating the virtual networks

Create two virtual networks. One virtual network will be used for the infrastructure servers, and one virtual network will be used for the Azure Virtual Desktop session hosts.

Create the infrastructure virtual network:

{{< card code=true header="**Bash**" lang="bash" >}}
az network vnet create \
  --resource-group JV-RG-Infrastructure \
  --name JV-VNET01 \
  --address-prefix 10.0.0.0/16 \
  --subnet-name infrastructure \
  --subnet-prefix 10.0.0.0/24
{{< /card >}}

Create the Azure Virtual Desktop virtual network:

{{< card code=true header="**Bash**" lang="bash" >}}
az network vnet create \
  --resource-group JV-RG-VirtualDesktop \
  --name JV-VNET02 \
  --address-prefix 10.1.0.0/16 \
  --subnet-name avd-sessionhosts \
  --subnet-prefix 10.1.0.0/24
{{< /card >}}

Review both virtual networks before continuing.

## 3.3 Creating virtual network peering

The two virtual networks must be able to communicate with each other. This is needed because the Azure Virtual Desktop session hosts must be able to reach the domain controller.

Create peering from `JV-VNET01` to `JV-VNET02`:

{{< card code=true header="**Bash**" lang="bash" >}}
az network vnet peering create \
  --resource-group JV-RG-Infrastructure \
  --vnet-name JV-VNET01 \
  --name JV-VNET01-to-JV-VNET02 \
  --remote-vnet /subscriptions/$(az account show --query id -o tsv)/resourceGroups/JV-RG-VirtualDesktop/providers/Microsoft.Network/virtualNetworks/JV-VNET02 \
  --allow-vnet-access
{{< /card >}}

Create peering from `JV-VNET02` to `JV-VNET01`:

{{< card code=true header="**Bash**" lang="bash" >}}
az network vnet peering create \
  --resource-group JV-RG-VirtualDesktop \
  --vnet-name JV-VNET02 \
  --name JV-VNET02-to-JV-VNET01 \
  --remote-vnet /subscriptions/$(az account show --query id -o tsv)/resourceGroups/JV-RG-Infrastructure/providers/Microsoft.Network/virtualNetworks/JV-VNET01 \
  --allow-vnet-access
{{< /card >}}

After creating both peerings, open both virtual networks in the Azure Portal and check the peering status.

## 3.4 Creating the domain controller VM

Create the domain controller in the infrastructure resource group and infrastructure virtual network.

Use the following values:

| Setting | Value |
|---|---|
| Resource group | JV-RG-Infrastructure |
| Virtual machine name | JV-DC-SRV01 |
| Region | West Europe |
| Image | Windows Server 2025 |
| Virtual network | JV-VNET01 |
| Subnet | infrastructure |
| Private IP address | 10.0.0.10 |

After creating the VM, open the Network Interface of the VM and make sure the private IP address is static.

## 3.5 Installing Active Directory Domain Services

Log in to `JV-DC-SRV01` using Remote Desktop.

Open PowerShell as Administrator and install the Active Directory Domain Services role.

{{< card code=true header="**PowerShell**" lang="powershell" >}}
Install-WindowsFeature AD-Domain-Services -IncludeManagementTools
{{< /card >}}

After the role is installed, promote the server to a domain controller and create a new forest.

{{< card code=true header="**PowerShell**" lang="powershell" >}}
Install-ADDSForest `
  -DomainName "justinverstijnen.nl" `
  -DomainNetbiosName "JV" `
  -InstallDns:$true
{{< /card >}}

You will be asked to enter a Directory Services Restore Mode password. After the configuration is completed, the server will reboot.

After the reboot, log in with the domain administrator account.

## 3.6 Configuring DNS for both virtual networks

The infrastructure network and the Azure Virtual Desktop network must both use the domain controller as DNS server.

Configure `JV-VNET01` to use `10.0.0.10` as DNS server.

{{< card code=true header="**Bash**" lang="bash" >}}
az network vnet update \
  --resource-group JV-RG-Infrastructure \
  --name JV-VNET01 \
  --dns-servers 10.0.0.10
{{< /card >}}

Configure `JV-VNET02` to use `10.0.0.10` as DNS server.

{{< card code=true header="**Bash**" lang="bash" >}}
az network vnet update \
  --resource-group JV-RG-VirtualDesktop \
  --name JV-VNET02 \
  --dns-servers 10.0.0.10
{{< /card >}}

After changing DNS settings, restart existing VMs or renew the network configuration inside the VMs.

## 3.7 Creating test users

Create a test group and test users for Azure Virtual Desktop access.

On the domain controller, open PowerShell as Administrator and run:

{{< card code=true header="**PowerShell**" lang="powershell" >}}
New-ADOrganizationalUnit -Name "Lab Users" -Path "DC=justinverstijnen,DC=nl"
New-ADGroup -Name "JV-AVD-Users" -GroupScope Global -GroupCategory Security -Path "OU=Lab Users,DC=justinverstijnen,DC=nl"

New-ADUser -Name "AVD User 01" -SamAccountName "avduser01" -UserPrincipalName "avduser01@justinverstijnen.nl" -Path "OU=Lab Users,DC=justinverstijnen,DC=nl" -AccountPassword (Read-Host -AsSecureString "Password") -Enabled $true
Add-ADGroupMember -Identity "JV-AVD-Users" -Members "avduser01"
{{< /card >}}

You can create more users if you want to test multiple sessions.

## 3.8 Creating the Azure Storage Account for FSLogix

User profiles must work on both AVD machines. For this lab, the FSLogix profiles will be stored on an Azure Files share.

Create a Storage Account in the `JV-RG-VirtualDesktop` resource group.

Use a globally unique storage account name. For example:

`jvavdprofiles001`

Create a file share named:

`profiles`

Recommended settings for this lab:

| Setting | Value |
|---|---|
| Resource group | JV-RG-VirtualDesktop |
| Storage account name | jvavdprofiles001 or another globally unique name |
| Region | West Europe |
| File share name | profiles |
| Protocol | SMB |

Make sure the session hosts can access the storage account over the network. For a real production environment, you should review private endpoints, firewall settings and identity-based access carefully.

## 3.9 Preparing FSLogix profile permissions

FSLogix needs a profile location and the right permissions. In this lab, the user profile path will use the Azure Files share.

Example profile path:

`\\jvavdprofiles001.file.core.windows.net\profiles`

Make sure the users who will log in to Azure Virtual Desktop have the correct permissions on the file share and inside the NTFS permissions of the share.

A common lab approach is:

- Give the AVD users access to the Azure Files share
- Configure the required share permissions
- Configure NTFS permissions from a domain joined server
- Test access with a normal AVD test user before configuring FSLogix

From a domain joined server, you can test access to the share with:

{{< card code=true header="**PowerShell**" lang="powershell" >}}
Test-Path "\\jvavdprofiles001.file.core.windows.net\profiles"
{{< /card >}}

Replace `jvavdprofiles001` with your own storage account name.

## 3.10 Creating the Azure Virtual Desktop host pool

Now create the Azure Virtual Desktop host pool.

Use the following values:

| Setting | Value |
|---|---|
| Resource group | JV-RG-VirtualDesktop |
| Host pool name | JV-AVD-Hostpool |
| Host pool type | Pooled |
| Load balancing | Breadth-first |
| Max session limit | 8 |
| Number of session hosts | 2 |
| Workspace | JV-AVD-Workspace |
| Application group | JV-AVD-DesktopAppGroup |

Because the environment must support 16 concurrent employees and the lab requires 2 AVD machines, use a max session limit of 8 users per session host.

## 3.11 Creating the session hosts

Create two Azure Virtual Desktop session hosts in `JV-VNET02`.

Use the following values:

| Setting | Value |
|---|---|
| Resource group | JV-RG-VirtualDesktop |
| Session host 1 | JV-AVD-SH01 |
| Session host 2 | JV-AVD-SH02 |
| Virtual network | JV-VNET02 |
| Subnet | avd-sessionhosts |
| Domain join | justinverstijnen.nl |
| Host pool | JV-AVD-Hostpool |

Make sure both session hosts can communicate with the domain controller before or during the domain join process.

Useful checks from a session host:

{{< card code=true header="**PowerShell**" lang="powershell" >}}
Resolve-DnsName justinverstijnen.nl
Test-Connection 10.0.0.10
nltest /dsgetdc:justinverstijnen.nl
{{< /card >}}

If these checks fail, review virtual network peering, DNS settings and Network Security Group rules.

## 3.12 Assigning users to the Desktop Application Group

Users must be assigned to the Azure Virtual Desktop Application Group before they can see and start the desktop.

- Open Azure Virtual Desktop
- Open Application groups
- Open `JV-AVD-DesktopAppGroup`
- Go to "Assignments"
- Assign the group or users that should access the desktop

In this lab, assign the test users or the group `JV-AVD-Users`.

## 3.13 Configuring FSLogix on the session hosts

FSLogix is used so that user profiles are available on both session hosts. Without FSLogix, users might get a different local profile when they connect to another session host.

On both session hosts, configure the FSLogix profile container location.

Open PowerShell as Administrator and run:

{{< card code=true header="**PowerShell**" lang="powershell" >}}
New-Item -Path "HKLM:\SOFTWARE\FSLogix\Profiles" -Force
New-ItemProperty -Path "HKLM:\SOFTWARE\FSLogix\Profiles" -Name "Enabled" -PropertyType DWord -Value 1 -Force
New-ItemProperty -Path "HKLM:\SOFTWARE\FSLogix\Profiles" -Name "VHDLocations" -PropertyType MultiString -Value "\\jvavdprofiles001.file.core.windows.net\profiles" -Force
{{< /card >}}

Replace `jvavdprofiles001` with your own storage account name.

Restart both session hosts after configuring FSLogix.

## 3.14 Testing Azure Virtual Desktop

Now test the complete Azure Virtual Desktop flow.

Check the following items:

- The user can see the desktop in the Azure Virtual Desktop client or web client
- The user can start a desktop session
- The user lands on one of the two session hosts
- A profile container is created in the Azure Files share
- The user can sign out and sign in again
- The profile is available when the user lands on the other session host

Useful commands on a session host:

{{< card code=true header="**PowerShell**" lang="powershell" >}}
quser
hostname
whoami
Get-ItemProperty -Path "HKLM:\SOFTWARE\FSLogix\Profiles"
{{< /card >}}

Useful checks for FSLogix:

- Check if a `.vhd` or `.vhdx` file is created in the profile share
- Check the FSLogix event logs on the session hosts
- Check if the user profile is not stored only locally on one session host

## 3.15 Creating the optional application server

If there is sufficient time remaining, create the optional application server.

Use the following values:

| Setting | Value |
|---|---|
| Resource group | JV-RG-Infrastructure |
| Virtual machine name | JV-APP-SRV01 |
| Region | West Europe |
| Image | Windows Server 2025 |
| Virtual network | JV-VNET01 |
| Subnet | infrastructure |
| Private IP address | 10.0.0.11 |

Join the application server to the domain and install IIS.

{{< card code=true header="**PowerShell**" lang="powershell" >}}
Add-Computer -DomainName "justinverstijnen.nl" -Restart
{{< /card >}}

After the reboot, install IIS.

{{< card code=true header="**PowerShell**" lang="powershell" >}}
Install-WindowsFeature Web-Server -IncludeManagementTools
{{< /card >}}

## 3.16 Creating backups

Create backup resources in the `JV-RG-Backups` resource group.

For this lab, the minimum objective is to create a backup structure and understand which resources should be protected.

Recommended backup scope:

| Resource | Backup recommendation |
|---|---|
| JV-DC-SRV01 | Azure VM backup |
| JV-APP-SRV01 | Azure VM backup, if created |
| FSLogix profile share | Azure Files backup or another tested backup method |

Create a Recovery Services vault in `JV-RG-Backups` and configure backup for the VMs which should be protected.

Do not assume a backup works just because it is configured. Always check if restore points are created and test restore procedures in a real environment.

## 3.17 Testing the lab objective

Now validate if the environment meets the requirements.

Check the following items:

- `JV-RG-Infrastructure`, `JV-RG-VirtualDesktop` and `JV-RG-Backups` exist
- `JV-VNET01` exists with address space `10.0.0.0/16`
- `JV-VNET02` exists with address space `10.1.0.0/16`
- Both virtual networks are peered and can communicate with each other
- `JV-DC-SRV01` runs Windows Server 2025
- `JV-DC-SRV01` is a domain controller for `justinverstijnen.nl`
- `JV-AVD-Hostpool` exists
- The host pool contains two session hosts
- The max session limit matches the 16 concurrent employee requirement
- Users can access the desktop through Azure Virtual Desktop
- FSLogix profiles are stored on Azure Files
- A backup structure exists in `JV-RG-Backups`

Useful validation commands:

{{< card code=true header="**PowerShell**" lang="powershell" >}}
Resolve-DnsName justinverstijnen.nl
Test-Connection 10.0.0.10
nltest /dsgetdc:justinverstijnen.nl
quser
hostname
whoami
{{< /card >}}

## 3.18 Cleaning up the lab

When you are done, remove the resource groups to prevent unexpected costs.

Review the resources before deleting them. Make sure you do not remove resources from another lab or production environment.

You can remove the lab resource groups with Azure Cloud Shell.

{{< card code=true header="**Bash**" lang="bash" >}}
az group delete -n JV-RG-VirtualDesktop
az group delete -n JV-RG-Infrastructure
az group delete -n JV-RG-Backups
{{< /card >}}

The lab is now done, let's check your knowledge!

---

## Knowledge check

{{< quiz >}}
{
  "intro": "Answer these question(s) to test your understanding of this post. Your answers are not saved or sent anywhere; this is simply a personal knowledge check. If you refresh the page, your answers will be cleared.",
  "questions": [
    {
      "question": "Why are multiple resource groups used in this lab?",
      "reference": "Resource groups",
      "referenceUrl": "#resource-groups",
      "answers": [
        {
          "text": "To separate infrastructure, Azure Virtual Desktop and backup resources",
          "correct": true,
          "message": "Correct! Separating resources makes the environment easier to manage."
        },
        {
          "text": "Because Azure Virtual Desktop cannot work with one resource group",
          "correct": false,
          "message": "Incorrect. Azure Virtual Desktop can use resources in resource groups, but the separation is a design requirement for this lab."
        },
        {
          "text": "Because every virtual machine must always have its own resource group",
          "correct": false,
          "message": "Incorrect. This is not required."
        }
      ]
    },
    {
      "question": "Why is virtual network peering needed?",
      "reference": "3.3 Creating virtual network peering",
      "referenceUrl": "#33-creating-virtual-network-peering",
      "answers": [
        {
          "text": "Because the AVD session hosts must be able to reach the domain controller in another virtual network",
          "correct": true,
          "message": "Correct! The session hosts need connectivity to the domain controller."
        },
        {
          "text": "Because peering creates the Active Directory domain",
          "correct": false,
          "message": "Incorrect. Active Directory is created on the domain controller."
        },
        {
          "text": "Because peering replaces DNS",
          "correct": false,
          "message": "Incorrect. DNS is still required."
        }
      ]
    },
    {
      "question": "Which server is used as DNS server for both virtual networks?",
      "reference": "3.6 Configuring DNS for both virtual networks",
      "referenceUrl": "#36-configuring-dns-for-both-virtual-networks",
      "answers": [
        {
          "text": "JV-DC-SRV01 with IP address 10.0.0.10",
          "correct": true,
          "message": "Correct! The domain controller also provides DNS for the domain."
        },
        {
          "text": "JV-AVD-SH01 with IP address 10.1.0.10",
          "correct": false,
          "message": "Incorrect. This is a session host, not the DNS server."
        },
        {
          "text": "The storage account",
          "correct": false,
          "message": "Incorrect. A storage account does not act as the DNS server for the Active Directory domain."
        }
      ]
    },
    {
      "question": "How many Azure Virtual Desktop session hosts are required in this lab?",
      "reference": "Azure Virtual Desktop",
      "referenceUrl": "#azure-virtual-desktop",
      "answers": [
        {
          "text": "2",
          "correct": true,
          "message": "Correct! The lab requires two AVD machines."
        },
        {
          "text": "1",
          "correct": false,
          "message": "Incorrect. The lab requires two session hosts."
        },
        {
          "text": "16",
          "correct": false,
          "message": "Incorrect. The lab must support 16 concurrent employees, but it requires two AVD machines."
        }
      ]
    },
    {
      "question": "What is the purpose of FSLogix in this lab?",
      "reference": "3.13 Configuring FSLogix on the session hosts",
      "referenceUrl": "#313-configuring-fslogix-on-the-session-hosts",
      "answers": [
        {
          "text": "To make user profiles available across both AVD session hosts",
          "correct": true,
          "message": "Correct! FSLogix stores the user profile in a container so it can follow the user."
        },
        {
          "text": "To create virtual network peering",
          "correct": false,
          "message": "Incorrect. Virtual network peering is configured in Azure networking."
        },
        {
          "text": "To install Active Directory Domain Services",
          "correct": false,
          "message": "Incorrect. Active Directory Domain Services is installed on the domain controller."
        }
      ]
    },
    {
      "question": "Where are the FSLogix profile containers stored in this lab?",
      "reference": "3.8 Creating the Azure Storage Account for FSLogix",
      "referenceUrl": "#38-creating-the-azure-storage-account-for-fslogix",
      "answers": [
        {
          "text": "On an Azure Files share in an Azure Storage Account",
          "correct": true,
          "message": "Correct! The profiles share is used for FSLogix profile containers."
        },
        {
          "text": "Only on the local disk of each session host",
          "correct": false,
          "message": "Incorrect. That would not make the profile available across both session hosts."
        },
        {
          "text": "In the Network Security Group",
          "correct": false,
          "message": "Incorrect. A Network Security Group controls network traffic and does not store profiles."
        }
      ]
    }
  ]
}
{{< /quiz >}}

{{< ads >}}

{{< article-footer >}}
