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
hidden: false
---

## Introduction

In Azure, you can use a Virtual Network Gateway to create a Site-to-Site VPN connection with a hardware firewall. This allows you to connect a company's local network to your network in Azure. As we have to deal with 2 systems and linking them to each other, I will describe the configurations in each system, categorized in their own list.

The protocol used for this is IPsec with IKEv2. Most firewalls support this.

---

## 1. Azure-side guide

This section explains the configuration on the Azure side. Existing configurations that are currently in use also comply with these settings.

### Step 1.1: Create the GatewaySubnet

We start by creating a GatewaySubnet in the virtual network where the Virtual Network Gateway will be placed. Open the virtual network and open "Settings**"**and then "Subnets**"**from the left.

[![jv-media-5716-9f6a27ec264d.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/setup-site-to-site-vpn-azure-unifi/jv-media-5716-9f6a27ec264d.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/setup-site-to-site-vpn-azure-unifi/jv-media-5716-9f6a27ec264d.png)

Check whether the virtual network already has a subnet named `GatewaySubnet`. If it does not, follow these steps:

1. Click on "+ Subnet **"** .
2. Under "Subnet purpose", select "Virtual Network Gateway **"** . This acts as a template for the subnet.
3. Adjust the IP address range as required.

[![jv-media-5716-2e0a1a5d68df.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/setup-site-to-site-vpn-azure-unifi/jv-media-5716-2e0a1a5d68df.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/setup-site-to-site-vpn-azure-unifi/jv-media-5716-2e0a1a5d68df.png)

In my case the subnet already exists, but for the purpose of this guide, you should be able to create the subnet this way.

For the IP-range, my advice is to select an address range that is well outside the range you may use for future expansion. For example, for the network `10.69.0.0/16`, you could use `10.69.255.0` as the range. This leaves ranges 0 through 254 available for possible growth.

The subnet must be at least `/27`. A prefix closer to `/0` creates a larger subnet, while a prefix closer to `/32` creates a smaller subnet based on the number of available addresses.

Save the subnet and check the settings. Then continue with step 2.

### Step 1.2: Create the Virtual Network Gateway

In Azure, you need to create a resource called a "Virtual Network Gateway". This is the resource type with the blue lock icon:

[![jv-media-5716-4bc9a803cfdf.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/setup-site-to-site-vpn-azure-unifi/jv-media-5716-4bc9a803cfdf.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/setup-site-to-site-vpn-azure-unifi/jv-media-5716-4bc9a803cfdf.png)

If your virtual network does not yet have a Virtual Network Gateway, we have to create one. A VNet can have only one Virtual Network Gateway, but you can use peerings to connect multiple VNets to a hub network where a Virtual Network Gateway.

{{% alert title="Info" color="info" %}}
Creating a Virtual Network Gateway takes approximately 45 minutes. This is why I start with the Azure configuration, so you can use part of the time to configure Unifi in the meanwhile.
{{% /alert %}}

On the Virtual Network Gateway page, click "+ New" to create a new gateway for your network.

[![jv-media-5716-02967f95fe01.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/setup-site-to-site-vpn-azure-unifi/jv-media-5716-02967f95fe01.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/setup-site-to-site-vpn-azure-unifi/jv-media-5716-02967f95fe01.png)

After creating the gateway, the deployment will take around 45 minutes to complete. You can continue to follow the steps, but you will not be able to create the connection itself yet.

### Step 1.3: Create the Local Network Gateway

Once you have a Virtual Network Gateway ready or deploying, search for "Local Network Gateway" and create one for the company. A Local Network Gateway represents a physical site and contains the WAN IP address and the local network address ranges which are available in your Unifi environment:

[![jv-media-5716-44a376421623.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/setup-site-to-site-vpn-azure-unifi/jv-media-5716-44a376421623.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/setup-site-to-site-vpn-azure-unifi/jv-media-5716-44a376421623.png)

In this example, my Unifi IP-range is 10.69.0.0/24 and the WAN IP-address is 1.2.3.4. Then create the Local Network Gateway.

### Step 1.4: Create the connection

If your Virtual Network Gateway is deployed and ready, you can create the VPN connection and finish this step. If the deployment is not ready yet, continue the guide and we will do this again in Step 3.

Open your Virtual Network Gateway:

[![jv-media-5716-5c4f0cfa643a.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/setup-site-to-site-vpn-azure-unifi/jv-media-5716-5c4f0cfa643a.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/setup-site-to-site-vpn-azure-unifi/jv-media-5716-5c4f0cfa643a.png)

Make a note of the following value:

- The **public IP address** of the Virtual Network Gateway, as shown on the screenshot above

To create the connection, Under "Settings", go to "Connections". Click "+ Add**"** to add a VPN connection. Select the correct resource group and choose "Site-to-Site (IPsec)**"** as the Connection type:

Give the connection an appropriate name according to the naming policy, then continue to the "Settings" tab.

Select the Virtual Network Gateway and Local Network Gateway that you want to use for the connection:

[![Select the Virtual Network Gateway and Local Network Gateway](/images/azure-unifi-site-to-site-vpn/image-20250523-125958.png)](/images/azure-unifi-site-to-site-vpn/image-20250523-125958.png)

Generate a complex pre-shared key (PSK) containing different character types and with a length of 50 to 64 characters. UniFi has a maximum limit of 64 characters, so let's stay under this value. Store the PSK in a good and safe place like a password pamaner. You will also need it when configuring UniFi. The PSK acts as a connection password and prevents just anyone on the internet from connecting to your VPN router.

Select "IKEv2" as the IKE protocol and for IPsec / IKE policy, select "Custom**"**. The default settings in UniFi and Azure are different. We therefore do not use either platform's defaults and configure the same much more secure policy on both sides.

Configure the settings like shown below:

[![jv-media-5716-dd9030a0171f.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/setup-site-to-site-vpn-azure-unifi/jv-media-5716-dd9030a0171f.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/setup-site-to-site-vpn-azure-unifi/jv-media-5716-dd9030a0171f.png)

| IKE Phase | Encryption | Integrity | DH & PFS Group |
| --- | --- | --- | --- |
| Phase 1 | AES256 | SHA256 | DHGroup24 |
| Phase 2 | AES256 | SHA256 | PFS24 |

Then set IPsec SA lifetime in seconds to `3600`, which is one hour. Leave the remaining settings unchanged.

The complete page should now look like this:

[![Complete Azure connection settings](/images/azure-unifi-site-to-site-vpn/image-20250523-130620.png)](/images/azure-unifi-site-to-site-vpn/image-20250523-130620.png)

{{% alert title="Info" color="info" %}}
The error shown under **Local network gateway** is present because I created a copy of the configuration. This error should not occur in a real deployment because you will not create a duplicate tunnel.
{{% /alert %}}

Incorrect settings on either side will result in no VPN connection or no IP traffic. Check all settings carefully before continuing.

Create the connection in Azure. This takes approximately 60 seconds. You can immediately continue with the UniFi configuration.

---

## 2. UniFi-side guide

The following steps must be completed in UniFi, so open up your UniFi environment and follow these steps to configure the VPN tunnel in UniFi.

### Step 2.1: Create the VPN tunnel

In UniFi, go to "Settings", then to "VPN" and select "Site-to-Site VPN". Here we can configure a new VPN tunnel to our Azure environment.

[![jv-media-5716-614b77d5f3f7.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/setup-site-to-site-vpn-azure-unifi/jv-media-5716-614b77d5f3f7.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/setup-site-to-site-vpn-azure-unifi/jv-media-5716-614b77d5f3f7.png)

Click on "Create Site-to-Site VPN", give the tunnel a name and select the primary WAN connection:

[![jv-media-5716-1b752b3e9902.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/setup-site-to-site-vpn-azure-unifi/jv-media-5716-1b752b3e9902.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/setup-site-to-site-vpn-azure-unifi/jv-media-5716-1b752b3e9902.png)

- The VPN connection type must be IPSec
- Give the tunnel a name and generate a Pre-Shared Key (PSK)
- The local IP must be your WAN connection of Unifi
- Under "Remote IP / Hostname", enter the public IP address of the Azure Virtual Network Gateway
- The VPN method must be "Route-based"
- Add all your Azure subnets to the subnets section. You can also choose to add the whole address space including all subnets

In Step 2.2 we will configure the advanced cryptographic settings.

### Step 2.2: Configure the advanced cryptographic settings

In UniFi, we now need to copy the IPsec policy that we configured in Azure because the settings must match exactly. Otherwise, the tunnel will not come online or it may come online without forwarding any traffic or any combination of errors will occur.

IPsec works in two phases:

- **Phase 1: Establishing the connection**

	- The devices exchange keys, or their secret language, to create a secure tunnel.
- **Phase 2: Maintaining the connection through encapsulation**

	- The devices communicate using the secret language established in phase 1. This applies to every TCP/IP packet that travels through the tunnel.

Enough secret language. The tunnel's cryptographic settings must be configured as shown below, scroll down on the tunnel configuration page and set "Advanced" to "Manual".

[![jv-media-5716-ba57dc2a3c35.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/setup-site-to-site-vpn-azure-unifi/jv-media-5716-ba57dc2a3c35.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/setup-site-to-site-vpn-azure-unifi/jv-media-5716-ba57dc2a3c35.png)

Set the connection to use **IKEv2**.

Under **IKE**, select the following options:

- AES-256 for encryption.
- SHA256 for hashing.
- DH group 24.
- Lifetime: `28800` seconds, which is 8 hours.

Under **ESP**, select the following options:

- AES-256 for encryption.
- SHA256 for hashing.
- DH group 24.
- Lifetime: `3600` seconds, which is 1 hour.

At the bottom of the page, enable "Perfect Forward Secrecy (PFS)". Other settings can be left default and save the connection in UniFi.

Wait approximately 30 seconds and connection should come be online if the connection is already created in Azure. If not, first follow Step 3 to create this connection afterwards.

[![jv-media-5716-a94be4efb123.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/setup-site-to-site-vpn-azure-unifi/jv-media-5716-a94be4efb123.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/setup-site-to-site-vpn-azure-unifi/jv-media-5716-a94be4efb123.png)

And after the connection has been stablished:

[![jv-media-5716-c333fcfcb711.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/setup-site-to-site-vpn-azure-unifi/jv-media-5716-c333fcfcb711.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/setup-site-to-site-vpn-azure-unifi/jv-media-5716-c333fcfcb711.png)

---

## Step 3: Create the connection (optional)

If continued during the Virtual Network Gateway tunnel in step 1.4, we need to create the connection at this point.

## 

---

## Step 4: Testing the connection

Seeing "Online" or "Connected" on both sides does not automatically mean that traffic is passing through the tunnel. Test several things to confirm that the VPN connection works correctly.

### Step 4.1: Ping from Azure to the local network

Ping an address on the local network from a machine in Azure:

[![jv-media-5716-b17f67d80e3d.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/setup-site-to-site-vpn-azure-unifi/jv-media-5716-b17f67d80e3d.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/setup-site-to-site-vpn-azure-unifi/jv-media-5716-b17f67d80e3d.png)

### Step 4.2: Ping from the local network to Azure

Ping a machine in Azure from a local machine at the physical site:

[![jv-media-5716-46f61d4e1b19.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/setup-site-to-site-vpn-azure-unifi/jv-media-5716-46f61d4e1b19.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/setup-site-to-site-vpn-azure-unifi/jv-media-5716-46f61d4e1b19.png)

### Step 4.3: Test an Azure service from the local network

Test a service hosted on an Azure server from a local device. This is especially useful when ping is disabled or does not work.

A server is often used as a print server, file server or web server. Test one of these services.

In my case, the test server is an IIS web server with a simple website to test a service on Azure.

[![jv-media-5716-714f38286cd6.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/setup-site-to-site-vpn-azure-unifi/jv-media-5716-714f38286cd6.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/setup-site-to-site-vpn-azure-unifi/jv-media-5716-714f38286cd6.png)

If ping works and you can access a service on the Azure server, the connection has been configured successfully and is workling like expected.

---

## Summary

You have created a route-based Site-to-Site VPN between an Azure Virtual Network Gateway and a UniFi gateway. Both sides use matching IPsec and IKEv2 settings, and the connection has been tested in both directions.

This connection allows systems at the physical site to communicate securely with selected Azure networks and services.

### Sources

1. [UniFi OS Dream Machines 4.3.6 release discussion](https://community.ui.com/releases/UniFi-OS-Dream-Machines-4-3-6/57589c0c-a1e6-41d7-ac93-8dd24f45f358#comment/73278a95-8354-4f57-b657-8a5cd0532469)

{{< ads >}}

{{< article-footer >}}