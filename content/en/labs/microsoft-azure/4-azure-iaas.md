---
title: "4: Azure Virtual Machines setup"
slug: "4-azure-virtual-machines-setup"
date: 2025-01-01
tags:
- Lab Objective
- Knowledge Check
categories: []
description: "In this objective, you will learn about how to build and configure the required Azure resources in your own environment. Make sure you use your own Azure subscription, tenant, and resource groups when completing the tasks. The goal of this lab is to gain hands-on experience with setting up Azure infrastructure in a secure and structured, where the goal is to maximize the learning experience."
hidden: false
---

> Difficulty: Easy to Medium

## Introduction

In this lab, we will build our first real Infrastructure as a Service environment in terms of a Virtual Machine in Azure. The goal is to create a small but useful server environment for Justin Verstijnen Inc. using Azure Virtual Machines, a Virtual Network, Active Directory Domain Services and an application server.

This lab is not necessarily a complete step-by-step guide for every button in the Azure Portal. The main goal is to achieve the required end-state, understand what you are building and become more comfortable with Azure IaaS resources. The Azure Portal is updated regularly, so some buttons or menu names may be slightly different when you perform this lab.

In the previous lab, we prepared the Azure environment and created our first resource group. In this lab, we will now start using the resource group for actual infrastructure.

---

## Requirements

- Around 60 to 120 minutes of your time
- Access to an Azure subscription
- Basic knowledge of the Azure Portal
- Basic knowledge of Windows Server
- A domain name to use for the Active Directory domain
- Remote Desktop access to the created virtual machines

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

## Lab objective

Justin Verstijnen Inc. wants to deploy a secure and manageable network in Azure. The company needs a domain controller to manage Active Directory and DNS, and a separate application server to host business applications.

Both servers must be located in the same virtual network, joined to the same Active Directory domain and configured with the required roles. The DC server must have the Active DIrectory roles installed and the second server must be joined to the domain as member server.

## Company domain

Use the following Active Directory domain for this lab:

`justinverstijnen.nl`

## Resource group

All resources can be created in one resource group.

| Resource group name | Purpose |
| --- | --- |
| JV-RG-LAB | All resources for this Azure IaaS lab |

## Servers

| Server name | IP address | Description |
| --- | --- | --- |
| JV-VM-DC | 10.69.0.100 | Domain controller, DNS server |
| JV-VM-APP | 10.69.0.101 | Application server, IIS |

## Network

The network should remain as simple as possible, using a single virtual network and a single subnet.

| Network name | Network |
| --- | --- |
| JV-VNET01 | 10.69.0.0/16 |

Recommended subnet:

| Subnet name | Network |
| --- | --- |
| subnet-0 | 10.69.0.0/24 |

---

## 4.1 Creating the resource group

Start by creating the resource group for this lab.

- Open the Azure Portal
- Find and open "Resource groups"
- Create a new Resource Group
- Use the name `JV-RG-LAB`
- Place it in the region "West Europe"
- Finish the wizard

You can also create the resource group with Azure Cloud Shell.

{{< card code=true header="**Bash**" lang="bash" >}}
az group create -l westeurope -n JV-RG-LAB
{{< /card >}}

This creates the resource group named `JV-RG-LAB` in the West Europe region.

## 4.2 Creating the virtual network

Now create the virtual network where the servers will be connected.

- Find and open "Virtual networks"
- Create a new Virtual Network
- Place it in the `JV-RG-LAB` resource group
- Use the name `JV-VNET01`
- Use the address space `10.69.0.0/16`
- Create a subnet named `subnet-0`
- Use the subnet range `10.69.0.0/24`
- Finish the wizard

You can also create the virtual network with Azure Cloud Shell.

{{< card code=true header="**Bash**" lang="bash" >}}
az network vnet create \
  --resource-group JV-RG-LAB \
  --name JV-VNET01 \
  --address-prefix 10.69.0.0/16 \
  --subnet-name subnet-0 \
  --subnet-prefix 10.69.0.0/24
{{< /card >}}

After creating the virtual network, review the subnet and check if the address ranges are correct.

## 4.3 Creating dedicated Network Security Groups

Each server must have its own dedicated Network Security Group. This makes it easier to understand which security rules apply to which server.

Create the following Network Security Groups:

| NSG name | Purpose |
| --- | --- |
| JV-NSG-DC | Network Security Group for the domain controller |
| JV-NSG-APP | Network Security Group for the application server |

Recommended inbound rules for this lab:

| Rule | Purpose | Recommendation |
| --- | --- | --- |
| RDP | Remote management | Only allow from your own public IP address |
| ICMP | Testing ping between servers | Only allow inside the virtual network |
| HTTP | Testing IIS on the application server | Only allow where needed |

Be careful with opening RDP to the internet. For a real production environment, you should use a more secure management solution, like Azure Bastion, VPN or Just-in-time VM access.

## 4.4 Creating the domain controller VM

Create the first virtual machine. This server will become the domain controller and DNS server.

Use the following values:

| Setting | Value |
| --- | --- |
| Resource group | JV-RG-LAB |
| Virtual machine name | JV-VM-DC |
| Region | West Europe |
| Image | Windows Server 2022 |
| Virtual network | JV-VNET01 |
| Subnet | subnet-0 |
| Private IP address | 10.69.0.100 |
| Network Security Group | JV-NSG-DC |

After creating the VM, open the Network Interface of the VM and make sure the private IP address is static and set to the desired IP address.

The domain controller should always keep the same IP address, because DNS and domain services depend on it.

## 4.5 Creating inbound RDP NSG rules

To actually be able to connect to your VMs, you must create an inbound RDP rule and add your IP address to the source IP addresses. This increases security as you do not expose the RDP service to the internet.

Go to your Network Security Group, create an inbound RDP rule and set your IP addresses as source. You may give this rule any name, as long as it is clear what it's purpose is.

## 4.6 Installing Active Directory Domain Services

Log in to `JV-VM-DC` using Remote Desktop.

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

## 4.7 Configuring DNS for the virtual network

The application server must use the domain controller as DNS server. Otherwise, it will not be able to find the Active Directory domain.

- Open `JV-VNET01`
- Go to "DNS servers"
- Select "Custom"
- Add `10.69.0.100`
- Save the configuration

After changing the DNS server of the virtual network, restart the VMs or renew the network configuration inside the VMs.

You can also configure the DNS server with Azure Cloud Shell.

{{< card code=true header="**Bash**" lang="bash" >}}
az network vnet update \
  --resource-group JV-RG-LAB \
  --name JV-VNET01 \
  --dns-servers 10.69.0.100
{{< /card >}}

## 4.8 Creating the application server VM

Create the second virtual machine. This server will become the application server.

Use the following values:

| Setting | Value |
| --- | --- |
| Resource group | JV-RG-LAB |
| Virtual machine name | JV-VM-APP |
| Region | West Europe |
| Image | Windows Server 2022 |
| Virtual network | JV-VNET01 |
| Subnet | subnet-0 |
| Private IP address | 10.69.0.101 |
| Network Security Group | JV-NSG-APP |

After creating the VM, open the Network Interface of the VM and make sure the private IP address is static.

## 4.9 Joining the application server to the domain

Log in to `JV-VM-APP` using Remote Desktop.

Before joining the domain, check if the server can resolve the domain name.

{{< card code=true header="**PowerShell**" lang="powershell" >}}
Resolve-DnsName justinverstijnen.nl
{{< /card >}}

Also test if the domain controller can be reached.

{{< card code=true header="**PowerShell**" lang="powershell" >}}
Test-Connection 10.69.0.100
{{< /card >}}

If DNS and network connectivity work, join the server to the domain.

{{< card code=true header="**PowerShell**" lang="powershell" >}}
Add-Computer -DomainName "justinverstijnen.nl" -Restart
{{< /card >}}

After the reboot, log in using a domain account.

## 4.10 Installing IIS on the application server

The application server must host a basic web service. We will use IIS for this lab.

Open PowerShell as Administrator on `JV-VM-APP` and run the following command:

{{< card code=true header="**PowerShell**" lang="powershell" >}}
Install-WindowsFeature Web-Server -IncludeManagementTools
{{< /card >}}

After the installation, test the IIS subnet-0 website locally.

{{< card code=true header="**PowerShell**" lang="powershell" >}}
Invoke-WebRequest http://localhost
{{< /card >}}

You can also browse to the private IP address of the application server from the domain controller.

{{< card code=true header="**PowerShell**" lang="powershell" >}}
Invoke-WebRequest http://10.69.0.101
{{< /card >}}

You can also check the default wehsite in the webbrowser at: localhost/ on the APP server and at 10.69.0.101 from the DC server. You can also host your own website by pasting any index.html file into the `C:\inetpub\wwwroot` folder.

## 4.11 Testing the lab objective

Now validate if the environment meets the requirements.

Check the following items:

- `JV-VM-DC` exists and has private IP address `10.69.0.100`
- `JV-VM-APP` exists and has private IP address `10.69.0.101`
- Both servers run Windows Server 2022
- Both servers are connected to `JV-VNET01`
- Both servers can ping each other
- `JV-VM-DC` is a domain controller for `justinverstijnen.nl`
- `JV-VM-APP` is joined to `justinverstijnen.nl`
- IIS is installed on `JV-VM-APP`
- Both servers have their own dedicated Network Security Group

Useful validation commands:

{{< card code=true header="**PowerShell**" lang="powershell" >}}
whoami
hostname
ipconfig /all
Test-Connection 10.69.0.100
Test-Connection 10.69.0.101
{{< /card >}}

Run this command on the domain controller to check if the application server is known in Active Directory.

{{< card code=true header="**PowerShell**" lang="powershell" >}}
Get-ADComputer -Filter * | Select-Object Name, Enabled
{{< /card >}}

## 4.12 Cleaning up the lab

When you are done, remove the resource group to prevent unexpected costs.

- Open "Resource groups"
- Open `JV-RG-LAB`
- Review all resources in the resource group
- Click "Delete resource group"
- Type the resource group name
- Confirm the deletion

You can also remove the resource group with Azure Cloud Shell.

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
      "question": "What is the main purpose of Azure IaaS in this lab?",
      "reference": "Introduction",
      "referenceUrl": "#introduction",
      "answers": [
        {
          "text": "To host and manage virtual machines and network resources in Azure",
          "correct": true,
          "message": "Correct! This is the right answer."
        },
        {
          "text": "To only create users in Microsoft Entra ID",
          "correct": false,
          "message": "Incorrect. Microsoft Entra ID is not the main focus of this lab."
        },
        {
          "text": "To create a website without servers",
          "correct": false,
          "message": "Incorrect. This lab uses virtual machines."
        }
      ]
    },
    {
      "question": "Which server becomes the domain controller in this lab?",
      "reference": "Servers",
      "referenceUrl": "#servers",
      "answers": [
        {
          "text": "JV-VM-DC",
          "correct": true,
          "message": "Correct! This server is used as the domain controller and DNS server."
        },
        {
          "text": "JV-VM-APP",
          "correct": false,
          "message": "Incorrect. This server is used as the application server."
        },
        {
          "text": "JV-VNET01",
          "correct": false,
          "message": "Incorrect. This is the virtual network."
        }
      ]
    },
    {
      "question": "Why should the domain controller use a static private IP address?",
      "reference": "2.4 Creating the domain controller VM",
      "referenceUrl": "#24-creating-the-domain-controller-vm",
      "answers": [
        {
          "text": "Because we wanted to have a custom, static IP address based on the scenario",
          "correct": true,
          "message": "Correct! The domain controller should keep a predictable and static IP address."
        },
        {
          "text": "Because Azure VMs cannot use dynamic IP addresses",
          "correct": false,
          "message": "Incorrect. Azure VMs can use dynamic private IP addresses, but this is not recommended for a domain controller."
        },
        {
          "text": "Because IIS requires the domain controller to have a public IP address",
          "correct": false,
          "message": "Incorrect. IIS does not require the domain controller to have a public IP address."
        },
        {
          "text": "To make DNS resolving mechanisms work",
          "correct": false,
          "message": "Partly true but not the core of the goal."
        }
      ]
    },
    {
      "question": "Which DNS server should the virtual network primarily use after the domain controller is configured?",
      "reference": "2.6 Configuring DNS for the virtual network",
      "referenceUrl": "#26-configuring-dns-for-the-virtual-network",
      "answers": [
        {
          "text": "10.69.0.100",
          "correct": true,
          "message": "Correct! This is the private IP address of the domain controller."
        },
        {
          "text": "10.69.0.101",
          "correct": false,
          "message": "Incorrect. This is the application server."
        },
        {
          "text": "8.8.8.8 only",
          "correct": false,
          "message": "Incorrect. The application server must be able to find the Active Directory domain."
        }
      ]
    },
    {
      "question": "Which role is installed on the application server?",
      "reference": "2.9 Installing IIS on the application server",
      "referenceUrl": "#29-installing-iis-on-the-application-server",
      "answers": [
        {
          "text": "IIS Web Server",
          "correct": true,
          "message": "Correct! IIS is installed on the application server."
        },
        {
          "text": "Active Directory Domain Services",
          "correct": false,
          "message": "Incorrect. Active Directory Domain Services is installed on the domain controller."
        },
        {
          "text": "Azure Virtual Desktop Host Pool",
          "correct": false,
          "message": "Incorrect. Azure Virtual Desktop is not part of this lab."
        }
      ]
    }
  ]
}
{{< /quiz >}}

{{< ads >}}

{{< article-footer >}}