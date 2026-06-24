---
title: "2 - Create your first Azure VM"
slug: "2-azure-create-first-vm"
date: 2025-09-02
tags:
- Lab Objective
categories:
- Microsoft Azure Labs
description: "In this objective, you will learn about how to build and configure the required Azure resources in your own environment. Make sure you use your own Azure subscription, tenant, and resource groups when completing the tasks. The goal of this lab is to gain hands-on experience with setting up Azure infrastructure in a secure and structured, where the goal is to maximize the learning experience."
hidden: false
weight:2
---

> Difficulty: Easy

## Introduction

In this lab, we will build a very small Infrastructure as a Service environment in Azure. The goal is to create one Windows Server virtual machine for Justin Verstijnen Inc. and configure Remote Desktop access through a Network Security Group rule.

This lab is not necessarily a complete step-by-step guide for every button in the Azure Portal. The main goal is to achieve the required end-state, understand what you are building and become more comfortable with Azure IaaS resources. The Azure Portal is updated regularly, so some buttons or menu names may be slightly different when you perform this lab.

In the previous lab, we prepared the Azure environment and created our first resource group. In this lab, we will dive deeper, re-creating the resource group for our first virtual machine and setting basic NSG Firewall rules.

---

## Requirements

- Around 30 minutes of your time
- Access to an Azure subscription
- Basic knowledge of the Azure Portal
- Basic knowledge of Windows Server
- Your own public IP address
- Remote Desktop access from your own computer

---

## Minimizing Azure costs

This lab uses a virtual machine, which means the lab will cost more than only creating a resource group. As already mentioned in the introduction lab, you should remove resources when you are done testing.

To minimize costs during this lab, use the following guidelines:

- Shutdown the VM when you are not using it

	- VMs are the most expensive when running
	- When VMs are stopped, you still pay for disks and some attached resources
- Do not choose an oversized virtual machine
- Use one lab resource group, so everything can be removed quickly
- Remove the public IP address when you do not need it anymore
- Check the Cost analysis page in your Azure subscription

My best recommendation is to complete the lab, take screenshots or notes of your configuration, test if everything works and remove the resource group afterwards.

---

{{< ads >}}

## Lab objective

Justin Verstijnen Inc. wants to create its first server in Azure. The company needs one Windows Server virtual machine that can be managed remotely with Remote Desktop.

The server must be protected by a Network Security Group. Remote Desktop access should only be allowed from your own public IP address.

### Resource group

You need to create this resource group:

| Resource group name | Purpose |
| --- | --- |
| JV-LAB | All resources for this Azure VM lab |

If the resource group does not exist yet, you can create it during the virtual machine wizard. You can also use any existing resource group, but I advice you to use an empty resource group.

### Server

You need to create this virtual machine:

| Server name | Description |
| --- | --- |
| JV-DC-SRV01 | Windows Server virtual machine (2019/2022/2025) |

### Network

During the virtual machine wizard, you can create the network automatically, using default values. In a future guide, I will also require you to create the virtual network yourself.

---

## 2.1 Creating the virtual machine

Start by creating the virtual machine for this lab.

- Open the Azure Portal
- Find and open "Virtual machines"
- Create a new Azure virtual machine
- Use the resource group `JV-LAB`
- Use the virtual machine name `JV-DC-SRV01`
- Place it in the region "West Europe"
- Choose a Windows Server image, for example "Windows Server 2022"
- Choose a small VM size for this lab, for example D2as_V7
- Create a local administrator account
- Make sure a public IP address is created
- Do not open inbound ports during the VM wizard
- Finish the wizard

Use the following values as a guideline:

| Setting | Value |
| --- | --- |
| Resource group | JV-LAB |
| Virtual machine name | JV-DC-SRV01 |
| Region | West Europe |
| Image | Windows Server 2022 |
| Size | Small lab size, for example Standard D2as_v7 |
| Public IP address | Yes |
| Public inbound ports | None |
| Network Security Group | JV-NSG-DC-SRV01 |

The VM is now created, but Remote Desktop should not be reachable yet. This is expected, because we still need to create the inbound rule in the Network Security Group.

You can also create the VM with Azure Cloud Shell.

{{< card code=true header="**Bash**" lang="bash" >}}
az vm create \
  --resource-group JV-LAB \
  --name JV-DC-SRV01 \
  --image Win2022Datacenter \
  --size Standard_D2as \
  --admin-username azureadmin \
  --vnet-name JV-VNET01 \
  --subnet default \
  --public-ip-sku Standard \
  --nsg JV-NSG-DC-SRV01 \
  --nsg-rule NONE
{{< /card >}}

This creates a Windows Server VM without automatically opening RDP to the internet.

## 2.2 Finding your public IP address

The RDP rule should only allow access from your own public IP address. This is safer than allowing RDP from the entire internet.

You can find your public IP address by using this tool: https://tools.justinverstijnen.nl/iplookuptool. Copy the public IP address as will need it in the next step.

## 2.3 Creating the RDP rule in the Network Security Group

Now create an inbound security rule to allow Remote Desktop traffic to the virtual machine.

- Open the Azure Portal
- Find and open "Network Security Groups"
- Open `JV-NSG-DC-SRV01`
- Go to "Inbound security rules"
- Create a new rule
- Use the following values:

| Setting | Value |
| --- | --- |
| Source | IP Addresses |
| Source IP addresses/CIDR ranges | Your own public IP address, for example `1.2.3.4/32` |
| Source port ranges | `*` |
| Destination | Any |
| Service | RDP |
| Destination port ranges | `3389` |
| Protocol | TCP |
| Action | Allow |
| Priority | 1000 |
| Name | Allow-RDP-From-My-IP |

Be careful with opening RDP to the internet. For a real production environment, you should use a more secure management solution, like Azure Bastion, VPN or Just-in-time VM access.

You can also create the RDP rule with Azure Cloud Shell.

{{< card code=true header="**Bash**" lang="bash" >}}
MY_IP=$(curl -s https://api.ipify.org)

az network nsg rule create \
  --resource-group JV-LAB \
  --nsg-name JV-NSG-DC-SRV01 \
  --name Allow-RDP-From-My-IP \
  --priority 1000 \
  --direction Inbound \
  --access Allow \
  --protocol Tcp \
  --source-address-prefixes "$MY_IP/32" \
  --source-port-ranges '*' \
  --destination-address-prefixes '*' \
  --destination-port-ranges 3389
{{< /card >}}

This creates an inbound rule that only allows RDP from your own public IP address.

## 2.4 Connecting to the virtual machine

After the RDP rule is created, connect to the virtual machine.

- Open `JV-DC-SRV01` in the Azure Portal
- Open "Connect"
- Choose "RDP"
- Download the RDP file or copy the public IP address
- Open Remote Desktop Connection on your own computer
- Connect to the public IP address of the VM
- Log in with the local administrator account you created during the VM deployment

If the connection does not work, check the following items:

- The VM is running
- The VM has a public IP address
- The Network Security Group contains an inbound allow rule for TCP port `3389`
- The source IP address in the NSG rule matches your current public IP address
- Your local network allows outbound RDP traffic

You can test the RDP port from your own computer, outside of the RDP connection with PowerShell.

{{< card code=true header="**PowerShell**" lang="powershell" >}}
Test-NetConnection <public-ip-address> -Port 3389
{{< /card >}}

Replace `<public-ip-address>` with the public IP address of your virtual machine.

## 2.5 Testing the lab objective

Now validate if the environment meets the requirements.

Check the following items:

- `JV-DC-SRV01` exists
- The VM runs Windows Server 2022
- The VM has a public IP address
- The VM is connected to a virtual network
- The VM has a Network Security Group
- The NSG has an inbound rule for RDP on TCP port `3389`
- The RDP rule only allows access from your own public IP address
- You can log in to the VM using Remote Desktop

## 2.6 Cleaning up the lab

When you are done, remove the resource group to prevent unexpected costs.

- Open "Resource groups"
- Open `JV-LAB`
- Review all resources in the resource group
- Click "Delete resource group"
- Type the resource group name
- Confirm the deletion

You can also remove the resource group with Azure Cloud Shell.

{{< card code=true header="**Bash**" lang="bash" >}}
az group delete -n JV-LAB
{{< /card >}}

The lab is now done, let's check your knowledge!

---

## Knowledge check

{{< quiz >}}
{
  "intro": "Answer these question(s) to test your understanding of this post. Your answers are not saved or sent anywhere; this is simply a personal knowledge check. If you refresh the page, your answers will be cleared.",
  "questions": [
    {
      "question": "Which TCP port is used for Remote Desktop Protocol?",
      "reference": "2.3 Creating the RDP rule in the Network Security Group",
      "referenceUrl": "#23-creating-the-rdp-rule-in-the-network-security-group",
      "answers": [
        {
          "text": "3389",
          "correct": true,
          "message": "Correct! RDP uses TCP port 3389 by default."
        },
        {
          "text": "443",
          "correct": false,
          "message": "Incorrect. TCP port 443 is commonly used for HTTPS."
        },
        {
          "text": "53",
          "correct": false,
          "message": "Incorrect. TCP and UDP port 53 are commonly used for DNS."
        }
      ]
    },
    {
      "question": "Why should the RDP rule only allow your own public IP address?",
      "reference": "2.3 Creating the RDP rule in the Network Security Group",
      "referenceUrl": "#23-creating-the-rdp-rule-in-the-network-security-group",
      "answers": [
        {
          "text": "Because it reduces exposure compared to allowing RDP from the entire internet",
          "correct": true,
          "message": "Correct! Limiting the source IP address makes environments a lot safer."
        },
        {
          "text": "Because Azure does not support RDP from other IP addresses",
          "correct": false,
          "message": "Incorrect. Azure can allow other IP addresses, but that is not recommended."
        },
        {
          "text": "Because Windows Server cannot use a public IP address",
          "correct": false,
          "message": "Incorrect. Azure VMs can have a public IP address."
        }
      ]
    },
    {
      "question": "What type of cloud service is a Virtual Machine in Azure?",
      "reference": "Introduction",
      "referenceUrl": "#introduction",
      "answers": [
        {
          "text": "SaaS",
          "correct": false,
          "message": "Incorrect. Review the referenced section and try again."
        },
        {
          "text": "PaaS",
          "correct": false,
          "message": "Incorrect. Review the referenced section and try again."
        },
        {
          "text": "Iaas",
          "correct": true,
          "message": "Correct! This is the right answer."
        }
      ]
    }
  ]
}
{{< /quiz >}}

{{< ads >}}

{{< article-footer >}}