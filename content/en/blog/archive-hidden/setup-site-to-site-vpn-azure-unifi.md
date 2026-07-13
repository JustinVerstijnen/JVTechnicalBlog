---
title: "Setup a Site-to-Site VPN between Azure and UniFi"
slug: "setup-site-to-site-vpn-azure-unifi"
date: 2026-10-01
tags:
- Step by Step guides
categories:
- Microsoft Azure
- Networking
description: "Configure and test a route-based Site-to-Site VPN between Microsoft Azure and a UniFi gateway using IPsec and IKEv2."
---

## Introduction

In Azure, you can use a Virtual Network Gateway to create a Site-to-Site VPN connection with a hardware firewall. This allows you to connect a company's local network to your network in Azure.

The protocol used for this is IPsec with IKEv2. Most firewalls support this.

---

## Terminology

- **Virtual Network Gateway:** The VPN router in Azure.
- **Local Network Gateway:** The configuration that represents a specific physical network or site.

---

## Azure-side guide

This section explains the configuration on the Azure side. Existing configurations that are currently in use also comply with these settings.

### Step 1: Create the GatewaySubnet

We start by creating a GatewaySubnet in the virtual network where the Virtual Network Gateway will be placed. Open the virtual network and go to **Settings > Subnets**.

[![Open the Subnets settings of the Azure virtual network](/images/azure-unifi-site-to-site-vpn/image-20250523-121640.png)](/images/azure-unifi-site-to-site-vpn/image-20250523-121640.png)

Check whether the virtual network already has a subnet named `GatewaySubnet`. If it does not, follow these steps:

1. Click **+ Subnet**.
2. Under **Subnet purpose**, select **Virtual Network Gateway**. This acts as a template for the subnet.
3. Adjust the IP address range as required.

My advice is to select an address range that is well outside the range you may use for future expansion. For example, for the network `10.69.0.0/16`, you could use `10.69.255.0` as the range. This leaves ranges 0 through 254 available for possible growth.

The subnet must be at least `/27`. A prefix closer to `/0` creates a larger subnet, while a prefix closer to `/32` creates a smaller subnet based on the number of available addresses.

Save the subnet and check the settings. Then continue with step 2.

### Step 2: Create the Virtual Network Gateway

In Azure, you need to create a resource called a **Virtual Network Gateway**. This is the resource type with the blue lock icon:

[![Azure Virtual Network Gateway resource type](/images/azure-unifi-site-to-site-vpn/Naamloos-20250523-120700.png)](/images/azure-unifi-site-to-site-vpn/Naamloos-20250523-120700.png)

If your virtual network does not yet have a Virtual Network Gateway, create one. A VNet can have only one Virtual Network Gateway, but you can use peerings to connect multiple VNets to a hub network.

{{% alert title="Info" color="info" %}}
Creating a Virtual Network Gateway takes approximately 45 minutes.
{{% /alert %}}

### Step 3: Create the Local Network Gateway

Once you have a Virtual Network Gateway, search for **Local Network Gateway** and create one for the company. A Local Network Gateway represents a physical site and contains the WAN IP address and the local network address ranges:

[![Example Local Network Gateway configuration in Azure](/images/azure-unifi-site-to-site-vpn/image-20250523-120929.png)](/images/azure-unifi-site-to-site-vpn/image-20250523-120929.png)

The example shows a Local Network Gateway for Fiskano's new location with WAN IP address `178.229.218.44` and the following local address ranges:

- `172.16.20.0/24`
- `172.16.40.0/24`

Create the Local Network Gateway and enter the information for the relevant customer.

### Step 4: Create the connection

Now that all prerequisites are in place, we can create the VPN connection. We start in Azure and configure UniFi afterwards.

Open your Virtual Network Gateway:

[![Open the Azure Virtual Network Gateway](/images/azure-unifi-site-to-site-vpn/image-20250523-122444.png)](/images/azure-unifi-site-to-site-vpn/image-20250523-122444.png)

Make a note of the following value:

- The public IP address.

Under **Settings**, go to **Connections**. Click **+ Add** to add a VPN connection.

Select the correct resource group and choose **Site-to-Site (IPsec)** as the **Connection type**:

[![Select the Site-to-Site IPsec connection type](/images/azure-unifi-site-to-site-vpn/image-20250523-125726.png)](/images/azure-unifi-site-to-site-vpn/image-20250523-125726.png)

Give the connection an appropriate name according to the naming policy, then continue to the **Settings** tab.

Select the Virtual Network Gateway and Local Network Gateway that you want to use for the connection:

[![Select the Virtual Network Gateway and Local Network Gateway](/images/azure-unifi-site-to-site-vpn/image-20250523-125958.png)](/images/azure-unifi-site-to-site-vpn/image-20250523-125958.png)

Generate a complex pre-shared key (PSK) containing different character types and with a length of 50 to 64 characters. UniFi has a maximum limit of 64 characters.

Store this PSK in 1Password. You will also need it when configuring UniFi. The PSK acts as a connection password and prevents just anyone on the internet from connecting to your VPN router.

Select **IKEv2** as the IKE protocol.

For **IPsec / IKE policy**, select **Custom**. The default settings in UniFi and Azure are different. We therefore do not use either platform's defaults and configure the same secure policy on both sides.

Configure the settings as follows:

[![Custom IPsec and IKE policy settings in Azure](/images/azure-unifi-site-to-site-vpn/image-20250523-130403.png)](/images/azure-unifi-site-to-site-vpn/image-20250523-130403.png)

- **IKE phase 1:**
  - AES256
  - SHA256
  - DHGroup24
- **IKE phase 2:**
  - AES256
  - SHA256
  - PFS24

Set **IPsec SA lifetime in seconds** to `3600`, which is one hour. Leave the remaining settings unchanged.

The complete page should now look like this:

[![Complete Azure connection settings](/images/azure-unifi-site-to-site-vpn/image-20250523-130620.png)](/images/azure-unifi-site-to-site-vpn/image-20250523-130620.png)

{{% alert title="Info" color="info" %}}
The error shown under **Local network gateway** is present because I created a copy of the configuration. This error should not occur in a real deployment because you will not create a duplicate tunnel.
{{% /alert %}}

Incorrect settings on either side will result in no VPN connection or no IP traffic. Check all settings carefully before continuing.

Create the connection in Azure. This takes approximately 60 seconds. You can immediately continue with the UniFi configuration.

---

## UniFi-side guide

The following steps must be completed in UniFi.

### Step 1: Create the VPN tunnel

In UniFi, go to **Settings > VPN > Site-to-Site VPN**.

[![Open Site-to-Site VPN settings in UniFi](/images/azure-unifi-site-to-site-vpn/image-20250523-130903.png)](/images/azure-unifi-site-to-site-vpn/image-20250523-130903.png)

Create a new tunnel.

Give the tunnel a name and select the primary WAN connection:

[![Enter the tunnel name and select the primary WAN connection](/images/azure-unifi-site-to-site-vpn/image-20250523-130949.png)](/images/azure-unifi-site-to-site-vpn/image-20250523-130949.png)

The VPN connection type must be **IPsec**.

Under **Remote IP / Hostname**, enter the public IP address of the Azure Virtual Network Gateway. You should have written this down at the beginning of step 4 in the Azure-side guide.

The VPN method must be **Route-based**.

[![Configure the UniFi VPN as route-based](/images/azure-unifi-site-to-site-vpn/image-20250523-131125.png)](/images/azure-unifi-site-to-site-vpn/image-20250523-131125.png)

We are not using the tunnel IP option at this time, although we may use it in the future.

Under **Remote Networks**, enter all Azure networks that you want to connect. If Azure contains isolated networks that should not be reachable through this tunnel, do not include them.

In this example, we connect one complete test network with the address space `10.69.0.0/16` to UniFi. If a production environment contains multiple networks, add all networks that must be accessible.

[![Configure the remote Azure networks in UniFi](/images/azure-unifi-site-to-site-vpn/image-20250523-131320.png)](/images/azure-unifi-site-to-site-vpn/image-20250523-131320.png)

### Step 2: Configure the advanced cryptographic settings

In UniFi, we now need to copy the IPsec policy that we configured in Azure because the settings must match exactly. Otherwise, the tunnel will not come online or it may come online without forwarding any traffic.

IPsec works in two phases:

- **Phase 1: Establishing the connection**
  - The devices exchange keys, or their secret language, to create a secure tunnel.
- **Phase 2: Maintaining the connection through encapsulation**
  - The devices communicate using the secret language established in phase 1. This applies to every TCP/IP packet that travels through the tunnel.

Enough secret language. The tunnel's cryptographic settings must be configured as follows.

Set **Advanced** to **Manual**.

[![Set the advanced UniFi VPN settings to Manual](/images/azure-unifi-site-to-site-vpn/image-20250523-131823.png)](/images/azure-unifi-site-to-site-vpn/image-20250523-131823.png)

Set the connection to use **IKEv2**.

Under **IKE**, select the following options:

- AES-256 for encryption.
- SHA256 for hashing.
- DH group 24.
- Lifetime: `28800` seconds, or 8 hours.

Under **ESP**, select the following options:

- AES-256 for encryption.
- SHA256 for hashing.
- DH group 24.
- Lifetime: `3600` seconds, or 1 hour.

At the bottom of the page, enable **Perfect Forward Secrecy (PFS)**.

Save the connection in UniFi.

Wait approximately 30 seconds. The connection should now be online:

[![Online Site-to-Site VPN tunnel in UniFi](/images/azure-unifi-site-to-site-vpn/image-20250523-132136.png)](/images/azure-unifi-site-to-site-vpn/image-20250523-132136.png)

---

## Test the connection

Seeing **Online** and **Connected** on both sides does not automatically mean that traffic is passing through the tunnel. Test several things to confirm that the VPN connection works correctly.

### Ping from Azure to the local network

Ping an address on the local network from a machine in Azure:

[![Successful ping from Azure to the local network](/images/azure-unifi-site-to-site-vpn/image-20250523-132329.png)](/images/azure-unifi-site-to-site-vpn/image-20250523-132329.png)

### Ping from the local network to Azure

Ping a machine in Azure from a local machine at the physical site:

[![Successful ping from the local network to Azure](/images/azure-unifi-site-to-site-vpn/image-20250523-132403.png)](/images/azure-unifi-site-to-site-vpn/image-20250523-132403.png)

### Test an Azure service from the local network

Test a service hosted on an Azure server from a local device. This is especially useful when ping is disabled or does not work.

A server is often used as a print server, file server or web server. Test one of these services.

In my case, the test server is an IIS web server:

[![Testing an IIS web server in Azure from the local network](/images/azure-unifi-site-to-site-vpn/image-20250523-132756.png)](/images/azure-unifi-site-to-site-vpn/image-20250523-132756.png)

If ping works and you can access a service on the Azure server, the connection has been configured successfully.

---

## DNS for Active Directory

Are you using Active Directory with DNS? In UniFi firewalls, you can create A records that resolve to the correct IP addresses. This can be used as a basic form of conditional forwarding.

[![Active Directory DNS records configured in UniFi](/images/azure-unifi-site-to-site-vpn/image-20250731-082110.png)](/images/azure-unifi-site-to-site-vpn/image-20250731-082110.png)

Create an A record for every domain controller. UniFi will automatically load-balance between them.

---

## Summary

You have created a route-based Site-to-Site VPN between an Azure Virtual Network Gateway and a UniFi gateway. Both sides use matching IPsec and IKEv2 settings, and the connection has been tested in both directions.

This connection allows systems at the physical site to communicate securely with selected Azure networks and services.

### Sources

1. [UniFi OS Dream Machines 4.3.6 release discussion](https://community.ui.com/releases/UniFi-OS-Dream-Machines-4-3-6/57589c0c-a1e6-41d7-ac93-8dd24f45f358#comment/73278a95-8354-4f57-b657-8a5cd0532469)

{{< ads >}}

{{< article-footer >}}