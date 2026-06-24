---
title: "3 - Virtual networking fundamentals"
slug: "3-virtual-networking-fundamentals"
date: 2025-06-24
tags:
- Lab Objective
categories:
- Microsoft Azure Labs
description: "In this objective, you will learn about how to build and configure the required Azure resources in your own environment. Make sure you use your own Azure subscription, tenant, and resource groups when completing the tasks. The goal of this lab is to gain hands-on experience with setting up Azure infrastructure in a secure and structured, where the goal is to maximize the learning experience."
hidden: false
weight:3
---

> Difficulty: Easy

## Introduction

In this lab, we will build the basic networking foundation for Justin Verstijnen Inc. in Microsoft Azure.

You will create a virtual network, configure custom DNS settings, create and associate a Network Security Group, and create a second virtual network. After that, you will configure VNet peering so that both virtual networks can communicate with each other.

This lab is not necessarily a complete step-by-step guide for every button in the Azure Portal. The main goal is to achieve the required end-state, understand what you are building and become more comfortable with Azure networking concepts.

The Azure Portal is updated regularly, so some buttons or menu names may be slightly different when you perform this lab.

---

## Requirements

- Around 30 minutes of your time
- Access to an Azure subscription
- Basic knowledge of the Azure Portal
- Basic understanding of IP addressing and subnets
- Basic understanding of firewall rules
- Basic understanding of DNS

---

## Minimizing Azure costs

This lab only uses networking resources, so the costs should be very low compared to virtual machines. However, you should still clean up resources when you are done testing.

To minimize costs during this lab, use the following guidelines:

- Use one lab resource group, so everything can be removed quickly
- Do not deploy virtual machines unless you need them for testing
- Review all resources before deleting the resource group
- Check the Cost analysis page in your Azure subscription

My best recommendation is to complete the lab, take screenshots or notes of your configuration, test if everything works and remove the resource group afterwards.

---

{{< ads >}}

## Lab objective

Justin Verstijnen Inc. wants to create a basic Azure network design with two virtual networks.

The first virtual network will be used as the main lab network. It must use a custom DNS configuration and have a Network Security Group attached to the subnet.

The second virtual network will be used to test VNet peering. After the peering is created, both virtual networks should be able to communicate with each other.

### Resource group

You need to use this resource group:

| Resource group name | Purpose |
| --- | --- |
| JV-LAB | All resources for this Azure networking lab |

If the resource group does not exist yet, you can create it before starting the lab.

### Virtual networks

You need to create the following virtual networks:

| Virtual network name | Address space | Subnet name | Subnet address range |
| --- | --- | --- | --- |
| JV-VNET01 | 10.69.0.0/16 | default | 10.69.0.0/24 |
| JV-VNET02 | 10.70.0.0/16 | default | 10.70.0.0/24 |

When working with subnets, you can use this subnet calculator:

https://tools.justinverstijnen.nl/subnetcalculator

### DNS configuration

Configure the following DNS servers on `JV-VNET01`:

| DNS server order | IP address | Description |
| --- | --- | --- |
| 1 | 10.69.0.4 | Custom DNS server |
| 2 | 168.63.129.16 | Azure-provided DNS / Azure platform IP |

> Important note: Azure reserves the first 3 IP addresses and last 2 in every subnet. In a real production environment, you should make sure the custom DNS IP address is actually usable and reachable. For this lab, configure the DNS settings according to the required objective.

### Network Security Group

Create this Network Security Group:

| Network Security Group name | Purpose |
| --- | --- |
| JV-NSG-VNET01 | NSG for the subnet in JV-VNET01 |

The NSG must contain two inbound allow rules:

| Rule name | Protocol | Port | Destination |
| --- | --- | --- | --- |
| Allow-HTTP-Inbound | TCP | 80 | 10.69.0.4 |
| Allow-HTTPS-Inbound | TCP | 443 | 10.69.0.4 |

The NSG must be associated with the `default` subnet in `JV-VNET01`.

---

## 3.1 Creating the resource group

Start by creating or opening the lab resource group.

- Open the Azure Portal
- Find and open "Resource groups"
- Create a new resource group
- Use the resource group name `JV-LAB`
- Place it in the region "West Europe"
- Finish the wizard

Use the following values as a guideline:

| Setting | Value |
| --- | --- |
| Resource group name | JV-LAB |
| Region | West Europe |

You can also create the resource group with Azure Cloud Shell.

{{< card code=true header="**Bash**" lang="bash" >}}
az group create \
  --name JV-LAB \
  --location westeurope
{{< /card >}}

---

## 3.2 Creating the first virtual network

Now create the first virtual network.

- Open the Azure Portal
- Find and open "Virtual networks"
- Create a new virtual network
- Use the resource group `JV-LAB`
- Use the virtual network name `JV-VNET01`
- Place it in the region "West Europe"
- Configure the address space `10.69.0.0/16`
- Create a subnet named `default`
- Configure the subnet address range `10.69.0.0/24`
- Finish the wizard

Use the following values as a guideline:

| Setting | Value |
| --- | --- |
| Resource group | JV-LAB |
| Virtual network name | JV-VNET01 |
| Region | West Europe |
| Address space | 10.69.0.0/16 |
| Subnet name | default |
| Subnet address range | 10.69.0.0/24 |

You can also create the virtual network with Azure Cloud Shell.

{{< card code=true header="**Bash**" lang="bash" >}}
az network vnet create \
  --resource-group JV-LAB \
  --name JV-VNET01 \
  --location westeurope \
  --address-prefixes 10.69.0.0/16 \
  --subnet-name default \
  --subnet-prefixes 10.69.0.0/24
{{< /card >}}

---

## 3.3 Configuring custom DNS on JV-VNET01

After creating the first virtual network, configure the DNS servers.

- Open the Azure Portal
- Find and open "Virtual networks"
- Open `JV-VNET01`
- Go to "DNS servers"
- Choose "Custom"
- Add the following DNS servers:

| Order | DNS server |
| --- | --- |
| 1 | 10.69.0.1 |
| 2 | 168.63.129.16 |

- Save the configuration

The first DNS server is the custom DNS server for this lab. The second DNS server is the Azure platform DNS IP address.

You can also configure the DNS settings with Azure Cloud Shell.

{{< card code=true header="**Bash**" lang="bash" >}}
az network vnet update \
  --resource-group JV-LAB \
  --name JV-VNET01 \
  --dns-servers 10.69.0.1 168.63.129.16
{{< /card >}}

If virtual machines are already connected to this virtual network, they may need to be restarted before they use the new DNS configuration.

---

## 3.4 Creating the Network Security Group

Now create the Network Security Group for the first virtual network.

- Open the Azure Portal
- Find and open "Network Security Groups"
- Create a new Network Security Group
- Use the resource group `JV-LAB`
- Use the name `JV-NSG-VNET01`
- Place it in the region "West Europe"
- Finish the wizard

Use the following values as a guideline:

| Setting | Value |
| --- | --- |
| Resource group | JV-LAB |
| Network Security Group name | JV-NSG-VNET01 |
| Region | West Europe |

You can also create the Network Security Group with Azure Cloud Shell.

{{< card code=true header="**Bash**" lang="bash" >}}
az network nsg create \
  --resource-group JV-LAB \
  --name JV-NSG-VNET01 \
  --location westeurope
{{< /card >}}

---

## 3.5 Creating the HTTP and HTTPS rules

Create two inbound security rules in the Network Security Group.

The first rule allows HTTP traffic to `10.69.0.4`.

- Open the Azure Portal
- Find and open "Network Security Groups"
- Open `JV-NSG-VNET01`
- Go to "Inbound security rules"
- Create a new rule
- Use the following values:

| Setting | Value |
| --- | --- |
| Source | Any |
| Source port ranges | * |
| Destination | IP Addresses |
| Destination IP addresses/CIDR ranges | 10.69.0.4 |
| Service | Custom |
| Destination port ranges | 80 |
| Protocol | TCP |
| Action | Allow |
| Priority | 1000 |
| Name | Allow-HTTP-Inbound |

Now create the second rule for HTTPS.

| Setting | Value |
| --- | --- |
| Source | Any |
| Source port ranges | * |
| Destination | IP Addresses |
| Destination IP addresses/CIDR ranges | 10.69.0.4 |
| Service | Custom |
| Destination port ranges | 443 |
| Protocol | TCP |
| Action | Allow |
| Priority | 1010 |
| Name | Allow-HTTPS-Inbound |

You can also create both rules with Azure Cloud Shell.

{{< card code=true header="**Bash**" lang="bash" >}}
az network nsg rule create \
  --resource-group JV-LAB \
  --nsg-name JV-NSG-VNET01 \
  --name Allow-HTTP-Inbound \
  --priority 1000 \
  --direction Inbound \
  --access Allow \
  --protocol Tcp \
  --source-address-prefixes '*' \
  --source-port-ranges '*' \
  --destination-address-prefixes 10.69.0.4 \
  --destination-port-ranges 80

az network nsg rule create \
  --resource-group JV-LAB \
  --nsg-name JV-NSG-VNET01 \
  --name Allow-HTTPS-Inbound \
  --priority 1010 \
  --direction Inbound \
  --access Allow \
  --protocol Tcp \
  --source-address-prefixes '*' \
  --source-port-ranges '*' \
  --destination-address-prefixes 10.69.0.4 \
  --destination-port-ranges 443
{{< /card >}}

---

## 3.6 Associating the NSG with the subnet

A Network Security Group is not directly associated with an entire virtual network. Instead, it is associated with a subnet or a network interface.

For this lab, associate `JV-NSG-VNET01` with the `default` subnet in `JV-VNET01`.

- Open the Azure Portal
- Find and open "Virtual networks"
- Open `JV-VNET01`
- Go to "Subnets"
- Open the `default` subnet
- Select the Network Security Group `JV-NSG-VNET01`
- Save the subnet configuration

You can also associate the NSG with the subnet using Azure Cloud Shell.

{{< card code=true header="**Bash**" lang="bash" >}}
az network vnet subnet update \
  --resource-group JV-LAB \
  --vnet-name JV-VNET01 \
  --name default \
  --network-security-group JV-NSG-VNET01
{{< /card >}}

---

## 3.7 Creating the second virtual network

Now create the second virtual network.

- Open the Azure Portal
- Find and open "Virtual networks"
- Create a new virtual network
- Use the resource group `JV-LAB`
- Use the virtual network name `JV-VNET02`
- Place it in the region "West Europe"
- Configure the address space `10.70.0.0/16`
- Create a subnet named `default`
- Configure the subnet address range `10.70.0.0/24`
- Finish the wizard

Use the following values as a guideline:

| Setting | Value |
| --- | --- |
| Resource group | JV-LAB |
| Virtual network name | JV-VNET02 |
| Region | West Europe |
| Address space | 10.70.0.0/16 |
| Subnet name | default |
| Subnet address range | 10.70.0.0/24 |

You can also create the second virtual network with Azure Cloud Shell.

{{< card code=true header="**Bash**" lang="bash" >}}
az network vnet create \
  --resource-group JV-LAB \
  --name JV-VNET02 \
  --location westeurope \
  --address-prefixes 10.70.0.0/16 \
  --subnet-name default \
  --subnet-prefixes 10.70.0.0/24
{{< /card >}}

---

## 3.8 Creating VNet peering from JV-VNET01 to JV-VNET02

Now configure VNet peering from `JV-VNET01` to `JV-VNET02`. A Peering is a link between multiple networks over the Azure backbone. This ensures a fast and low latency but unencrypted connection.

- Open the Azure Portal
- Find and open "Virtual networks"
- Open `JV-VNET01`
- Go to "Peerings"
- Create a new peering
- Use the following values:

| Setting | Value |
| --- | --- |
| Peering link name from JV-VNET01 to remote virtual network | JV-VNET01-to-JV-VNET02 |
| Remote virtual network | JV-VNET02 |
| Peering link name from remote virtual network to JV-VNET01 | JV-VNET02-to-JV-VNET01 |
| Allow JV-VNET01 to access JV-VNET02 | Enabled |
| Allow JV-VNET02 to access JV-VNET01 | Enabled |
| Allow forwarded traffic | Disabled |
| Allow gateway transit | Disabled |
| Use remote gateway | Disabled |

Finish the wizard.

If both virtual networks are in the same subscription and region, the Azure Portal can create both peering directions during the same wizard.

You can also create the peerings with Azure Cloud Shell.

{{< card code=true header="**Bash**" lang="bash" >}}
VNET01_ID=$(az network vnet show \
  --resource-group JV-LAB \
  --name JV-VNET01 \
  --query id \
  --output tsv)

VNET02_ID=$(az network vnet show \
  --resource-group JV-LAB \
  --name JV-VNET02 \
  --query id \
  --output tsv)

az network vnet peering create \
  --resource-group JV-LAB \
  --vnet-name JV-VNET01 \
  --name JV-VNET01-to-JV-VNET02 \
  --remote-vnet "$VNET02_ID" \
  --allow-vnet-access

az network vnet peering create \
  --resource-group JV-LAB \
  --vnet-name JV-VNET02 \
  --name JV-VNET02-to-JV-VNET01 \
  --remote-vnet "$VNET01_ID" \
  --allow-vnet-access
{{< /card >}}

---

## 3.9 Testing the lab objective

Now validate if the environment meets the requirements.

Check the following items:

- The resource group `JV-LAB` exists
- The virtual network `JV-VNET01` exists
- `JV-VNET01` uses address space `10.69.0.0/16`
- `JV-VNET01` contains the subnet `default`
- The subnet in `JV-VNET01` uses address range `10.69.0.0/24`
- `JV-VNET01` has custom DNS configured
- The first DNS server is `10.69.0.1`
- The second DNS server is `168.63.129.16`
- The Network Security Group `JV-NSG-VNET01` exists
- The NSG is associated with the `default` subnet in `JV-VNET01`
- The NSG contains an inbound rule for HTTP on TCP port `80`
- The HTTP rule allows traffic to `10.69.0.4`
- The NSG contains an inbound rule for HTTPS on TCP port `443`
- The HTTPS rule allows traffic to `10.69.0.4`
- The virtual network `JV-VNET02` exists
- `JV-VNET02` uses address space `10.70.0.0/16`
- `JV-VNET02` contains the subnet `default`
- The subnet in `JV-VNET02` uses address range `10.70.0.0/24`
- VNet peering exists from `JV-VNET01` to `JV-VNET02`
- VNet peering exists from `JV-VNET02` to `JV-VNET01`
- Both peering connections show as connected

If you have virtual machines in both networks, you can also test connectivity between them.

For example, from a VM in `JV-VNET01`, test a VM in `JV-VNET02`:

{{< card code=true header="**PowerShell**" lang="powershell" >}}
Test-NetConnection <private-ip-address-in-JV-VNET02>
{{< /card >}}

Replace `<private-ip-address-in-JV-VNET02>` with the private IP address of a virtual machine in `JV-VNET02`.

---

## 3.10 Cleaning up the lab

When you are done, remove the resource group to prevent unexpected costs.

- Open "Resource groups"
- Open `JV-LAB`
- Review all resources in the resource group
- Click "Delete resource group"
- Type the resource group name
- Confirm the deletion

You can also remove the resource group with Azure Cloud Shell.

{{< card code=true header="**Bash**" lang="bash" >}}
az group delete \
  --name JV-LAB
{{< /card >}}

The lab is now done, let's check your knowledge!

---

## Knowledge check

{{< quiz >}}
{
  "intro": "Answer these question(s) to test your understanding of this post. Your answers are not saved or sent anywhere; this is simply a personal knowledge check. If you refresh the page, your answers will be cleared.",
  "questions": [
    {
      "question": "Which Azure IP address is configured as the second DNS server in this lab?",
      "reference": "3.3 Configuring custom DNS on JV-VNET01",
      "referenceUrl": "#33-configuring-custom-dns-on-jv-vnet01",
      "answers": [
        {
          "text": "168.63.129.16",
          "correct": true,
          "message": "Correct! 168.63.129.16 is the Azure platform DNS IP address used in this lab."
        },
        {
          "text": "8.8.8.8",
          "correct": false,
          "message": "Incorrect. 8.8.8.8 is a public DNS resolver, but it is not the required second DNS server in this lab."
        },
        {
          "text": "10.70.0.1",
          "correct": false,
          "message": "Incorrect. This is not the second DNS server configured in this lab."
        },
        {
          "text": "8.8.4.4",
          "correct": false,
          "message": "Incorrect. 8.8.4.4 is a public DNS resolver, but it is not the required second DNS server in this lab."
        }
      ]
    },
    {
      "question": "Where can a Network Security Group be associated in Azure?",
      "reference": "3.6 Associating the NSG with the subnet",
      "referenceUrl": "#36-associating-the-nsg-with-the-subnet",
      "answers": [
        {
          "text": "Directly to an entire virtual network only",
          "correct": false,
          "message": "Incorrect. An NSG is associated with a subnet or a network interface, not directly with an entire virtual network."
        },
        {
          "text": "To a subnet or a network interface",
          "correct": true,
          "message": "Correct! In this lab, the NSG is associated with the subnet."
        },
        {
          "text": "Only to a public IP address",
          "correct": false,
          "message": "Incorrect. NSGs are not associated directly with public IP addresses."
        }
      ]
    },
    {
      "question": "Why do you need VNet peering in this lab?",
      "reference": "3.8 Creating VNet peering from JV-VNET01 to JV-VNET02",
      "referenceUrl": "#38-creating-vnet-peering-from-jv-vnet01-to-jv-vnet02",
      "answers": [
        {
          "text": "To allow multiple virtual networks to connect to each other",
          "correct": true,
          "message": "Correct! VNet peering connects the two virtual networks so resources can communicate using private IP addresses."
        },
        {
          "text": "To automatically create virtual machines",
          "correct": false,
          "message": "Incorrect. VNet peering does not create virtual machines."
        },
        {
          "text": "To replace the Network Security Group",
          "correct": false,
          "message": "Incorrect. VNet peering and NSGs have different purposes."
        },
        {
          "text": "To allow multiple subnets to connect to each other over a encrypted connection",
          "correct": false,
          "message": "Incorrect. Peerings are not encrypted and does not connect only subnets but complete virtual networks."
        }
      ]
    }
  ]
}
{{< /quiz >}}

{{< ads >}}

{{< article-footer >}}
