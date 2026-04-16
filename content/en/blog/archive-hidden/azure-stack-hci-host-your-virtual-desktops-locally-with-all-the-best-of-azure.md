---
title: "Azure Stack HCI - Host your Virtual Desktops locally"
date: 2024-10-03
slug: "azure-stack-hci-host-your-virtual-desktops-locally-with-all-the-best-of-azure"
categories:
  - Powershell
tags:
  - Step by Step guides
description: >
  Azure Stack HCI is a solution for Microsoft Azure to host Azure resources on your own hardware and location. This soun...
---
## Introduction to Azure Stack HCI

Azure Stack HCI is a solution for Microsoft Azure to host Azure resources on your own hardware and location. This sounds traditional but can help to boost your Azure resources for your customer and/or use case.

For example, with Azure Stack HCI it is possible to host some Azure Virtual Desktop hosts in your own network to boost performance by decreasing latency. Also it is possible to use GPU enabled software on this.

{{% alert color="info" %}}
Azure Stack HCI became part of Azure Local after writing this post, see more information here: <https://azure.microsoft.com/en-us/products/local>
{{% /alert %}}

---

## Supported Azure Services

The supported Azure services at the moment of writing are:

- Windows and Linux VMs
- Azure Virtual Desktop session hosts
- Containers
- AKS (Azure Kubernetes Services)
- SQL
- Azure Functions
- Logic Apps
- Event Grid
- And more: <https://azure.microsoft.com/en-us/products/azure-stack/hci/>

## Requirements to follow this guide

You need the following to follow this guide and make sure to minimize errors:

- 2 Physical/Virtual servers for Azure Stack HCI nodes (1 for the single node cluster setup further in this guide)
- 1 Domain Controller server
  - Powershell module AsHciADArtifactsPreCreationTool installed
  - Azure CLI installed
- An ISO for Azure Stack HCI (Download from Azure Portal)
- An Azure subscription where you have the following permissions
  - Key Vault Contributor
  - Windows Admin Center Admin Login
  - Contributor
- A resource group in Azure where you have the following permissions
  - Key Vault Data Access Administrator
  - Key Vault Secrets Officer
  - Key Vault Contributor
  - Storage Account Contributor
- A Azure storage account which is the cluster witness (needed for quorum)

In my guide, i will focus on creating a cluster with 2 nodes. I have included and tested the steps to create a single-server cluster too:

[Multi node cluster setup](#multi-node-cluster)
[Single node cluster setup](#single-node-cluster)

## My environment

My environment consists of one physical server with 3 VMs on it. In a production environment it is better to physically segment the HCI cluster nodes to multiple fault domains. This setup is purely for educational purposes. In production environments, one hardware error will result in 100% outage

I create a Multi-node server cluster to experiment with Stack HCI. The environment looks like this.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-stack-hci-host-your-virtual-desktops-locally-with-all-the-best-of-azure-374/jv-media-374-5d59b8a921eb.png)

- 2 nodes (HCI01 and HCI02)
- 1 domain controller (DC01)
- In Azure: 1 storage account

In Azure i have a single resource group where i want to deploy my cluster into:

---

## 1. Multi-node setup guide

### 1.1 Installing nodes for the cluster

The installation of Azure Stack HCI is very straight-forward, and the same as installing Windows 11 or Windows Server. At the time you follow this guide i think you understand how to do this.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-stack-hci-host-your-virtual-desktops-locally-with-all-the-best-of-azure-374/jv-media-374-8ebc1913b625.png)

Install Azure Stack HCI on both of the nodes. Sit back or get a cup of coffee because this will take around 15 minutes :). To not waste time, my advice is to prepare the Active Directory during the installation.

### 1.2 Prepare Active Directory

We have to prepare our Active Directory for the coming change, the introduction of a new Cluster. This cluster will be settled in its own OU for future machines. Unfortunately, this OU cant be created through the GUI and has to be created with PowerShell.

Create a new Active Directoy forest when you don't have one.

On the domain controller/management server, you have to first install the following Powershell module:

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
Install-Module AsHciADArtifactsPreCreationTool -Repository PSGallery -Force
{{< /card >}}

After that, create a new OU for your HCI nodes by using the HCI module (only possible with this module). Change the name of your desired OU to your needs. I created it with the command below:

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
New-HciAdObjectsPreCreation -AzureStackLCMUserCredential (Get-Credential) -AsHciOUName "OU=StackHCI,DC=justinverstijnen,DC=nl"
{{< /card >}}

At the credential section, you have to specify a new user who can manage the HCI cluster and is used as service account. The user must comply with the following requirements:

- No special characters in username
- Password must me 12 characters at minimum
- Username may NOT be in DOMAIN\User or USER@DOMAIN format

I created my user like shown below:

The module accepted my account:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-stack-hci-host-your-virtual-desktops-locally-with-all-the-best-of-azure-374/jv-media-374-ac11ecffbc71.png)

When going to the Active Directory Users and Computers center, you see the changes are processed succesfully:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-stack-hci-host-your-virtual-desktops-locally-with-all-the-best-of-azure-374/jv-media-374-1bf9c102e1c5.png)

Now we have configured the Active Directory and we can go on to configure the cluster nodes.

### 1.3 Preparing the cluster nodes

After the installation and preparation of the nodes we can perform a default configuration of the nodes through sconfig:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-stack-hci-host-your-virtual-desktops-locally-with-all-the-best-of-azure-374/jv-media-374-95dfefc3a1d5.png)

This menu is the same as on server-core installations of Windows Server. Navigate through the menu by using the numbers and the extra options you get afterwards.

I have done the following steps on both of the nodes:

- Changed computer-name
- Downloaded the latest updates
- Enabled remote-management and enabled response to Ping (4 -> 3)
- Changed DNS server to:
  - Preferred server: my domain controller
  - Alternate server: DNS of my ISP provider

Note: do NOT join your nodes to Active Directory, otherwise the wizard to create a cluster will fail.

The result after these steps.

After the basic configuration of the nodes is complete, we have to do the following pre-configuration steps on every node:

Install Hyper-V (needed for virtualization purposes)

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
Enable-WindowsOptionalFeature -Online -FeatureName Microsoft-Hyper-V -All
{{< /card >}}

After installation of this feature, restart the node. You can do this with the following command:

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
Restart-Computer
{{< /card >}}

When the node is restarted, install the needed Powershell modules. Install these on all of the nodes.

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
Install-Module AzsHCI.ARCinstaller -Force
Install-Module Az.Accounts -Force
Install-Module Az.ConnectedMachine -Force
Install-Module Az.Resources -Force
{{< /card >}}

After installing all the needed modules, we can register every node to Azure Arc. We can perform this by running the commands below and change the parameters:

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
$AzureSubscription = "SUBSCRIPTION ID"
$AzureTenantID = "TENANT ID"

Connect-AzAccount -SubscriptionId $AzureSubscription -TenantId $AzureTenantID -DeviceCode
{{< /card >}}

Now you have to login via the Device code on a browser on your local computer or management server. This is because the Azure Stack HCI operating system doesn't have a browser and doesn't support interactive login.

Now we have to run another command with parameters:

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
$AzureResourceGroup = "Resource Group Name"
$AzureARMtoken = (Get-AzAccessToken).Token
$AzureAccountID = (Get-AzContext).Account.Id

Invoke-AzStackHciArcInitialization -SubscriptionId $AzureSubscription -ResourceGroup $AzureResourceGroup -TenantId $AzureTenantID -Region westeurope -ArmAccessToken $AzureARMtoken -AccountID $AzureAccountID -Cloud "AzureCloud"
{{< /card >}}

Now the node will be registered to Azure Arc. This will take around 10 minutes.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-stack-hci-host-your-virtual-desktops-locally-with-all-the-best-of-azure-374/jv-media-374-c94bc186464e.png)

After some minutes, the nodes appear in the Azure portal:

Now we have achieved this, we don't need the nodes anymore and we can close the connections to it. The rest of the cluster/node configuration will be done in the Azure Portal. This was just the setup of the nodes itself.

After the machines appear in the Azure Portal, the service will install the needed extensions on all of the cluster nodes. You can't go further before all the extensions are installed. You can follow the status by clicking on one of the cluster nodes and the open the blade "Extensions".

All of the nodes must have at least 3 extensions and the status must be "Succeded".

---

### 1.4 Creating the cluster in the Azure Portal

Now we have prepared everything, and we can create the cluster in the Azure portal now.

Go to Azure Arc and open the blade "Azure Stack HCI":

Select the option "Deploy cluster"

We now have to fill in some details. Next to a HCI cluster, Azure needs a Key Vault to store some secrets for encryption purposes. We have to create that in this wizard:

After that, we have to validate our cluster nodes by Azure to check if all pre-requisites are done:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-stack-hci-host-your-virtual-desktops-locally-with-all-the-best-of-azure-374/jv-media-374-93856e9ac8aa.png)

After succesfully validating the nodes, we can go further in the wizard.

On the tab "Configuration", i chose for a new configuration:

On the tab "Networking", i chose for "Network switch for storage". This means if there is a network switch between the servers. In my environment, i am using VMware as Hypervisor for my cluster nodes. This has a internal switching system and has no direct link to the PCIe connected network interface.

Further, you have the option to segment your cluster network by using different network links for:

- Management
- Traffic between nodes
- Storage network

In my environment i chose to group all traffic. In real world and business critical environments, it is often better to segment the traffic to increase performance and security.

After that step, we have to configure network connectivity. Select the network interface and at the IP configuration section, keep in mind at the DNS servers you need connection to your domain controller.

When everything is filled in correctly, we can advance to the "Management" tab.

At the Management Tab, you can define a location name tag. After that you need to define your storage account which will be used to keep the cluster online when a node is offline. In clustering, you always need to have your cluster online for 50% of your nodes + 1 witness.

Then we have to configure our Active Directory domain and OU. The OU has to be the distinguished name which you can find by using the "Attribute Editor" tab on a OU in Active Directory.

Also we have a deployment account and a local administrator account:

- Deployment account: is the account we created in step 1.2
- Local administrator: is the account on the cluster nodes we created after installation of Stack HCI OS

Fill in those details and click Next: Security

We want the highest level of security, so we choose the recommended settings:

After that we can go to the tab "Validation". Here we have to validate the complete configuration of the cluster:

---

## 2. Steps for creating a single-node cluster

Microsoft doesn't officially support a single node cluster, but you can create this. When you want to configure this, most of the steps must be done in PowerShell.

For testing, this is a great way to explore the service. My advice in a production environment is to use 2 or more nodes at minimum.

### 2.1 Testing cluster configuration prior to creating

To test your current configuration of all nodes, run a pre-creation check. A cluster has to succeed all the validation tests, otherwise the configuration is not supported by Microsoft and therefore not production-ready.

On the Management-server, run the following command:

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
Test-Cluster -Node HCI01 -Include "Storage Spaces Direct", "Inventory", "Network", "System Configuration"
{{< /card >}}

Te result i got is the following:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-stack-hci-host-your-virtual-desktops-locally-with-all-the-best-of-azure-374/jv-media-374-bac5c94f883e.png)

It gives us the steps we have to fix first before creating the cluster. We get the warnings because at this point we didn't have everything configured. The following components needs configuration

- Active Directory
- Operating System version
- Storage Spaces Direct

### 2.2 Prepare Active Directory

Create a new Active Directoy forest when you don't have one.

Then, install the needed HCI Powershell module when you don't have it already:

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
Install-Module AsHciADArtifactsPreCreationTool -Repository PSGallery -Force
{{< /card >}}

After that, create a new OU for your HCI nodes by using the HCI module (only possible with this module). Change the name of your desired OU to your needs. I created it with the command below:

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
New-HciAdObjectsPreCreation -AzureStackLCMUserCredential (Get-Credential) -AsHciOUName "OU=StackHCI,DC=justinverstijnen,DC=nl"
{{< /card >}}

At the credential section, you have to specify a new user who can manage the HCI cluster and is used as service account. The user must comply with the following requirements:

- No special characters in username
- Password must me 12 characters at minimum
- Username may NOT be in DOMAIN\User or USER@DOMAIN format

I created my user like shown below:

The module accepted my account:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-stack-hci-host-your-virtual-desktops-locally-with-all-the-best-of-azure-374/jv-media-374-ba8b6a4f3cee.png)

### 2.3 Prepare the drives

Before creating the cluster we have to prepare the drives for using Storage Spaces Direct. THis means, clearing them, setting them to read/write mode and setting them as "Primordial"

This can be done with the following commands:

On the management-server, define all your cluster nodes by using their computer name of Active Directory:

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
$ServerList = "HCI01"
{{< /card >}}

Then prepare the drives with these commands (run all at once) with the following commands:

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
Invoke-Command ($ServerList) {
    Update-StorageProviderCache
    Get-StoragePool | ? IsPrimordial -eq $false | Set-StoragePool -IsReadOnly:$false -ErrorAction SilentlyContinue
    Get-StoragePool | ? IsPrimordial -eq $false | Get-VirtualDisk | Remove-VirtualDisk -Confirm:$false -ErrorAction SilentlyContinue
    Get-StoragePool | ? IsPrimordial -eq $false | Remove-StoragePool -Confirm:$false -ErrorAction SilentlyContinue
    Get-PhysicalDisk | Reset-PhysicalDisk -ErrorAction SilentlyContinue
    Get-Disk | ? Number -ne $null | ? IsBoot -ne $true | ? IsSystem -ne $true | ? PartitionStyle -ne RAW | % {
        $_ | Set-Disk -isoffline:$false
        $_ | Set-Disk -isreadonly:$false
        $_ | Clear-Disk -RemoveData -RemoveOEM -Confirm:$false
        $_ | Set-Disk -isreadonly:$true
        $_ | Set-Disk -isoffline:$true
    }
    Get-Disk | Where Number -Ne $Null | Where IsBoot -Ne $True | Where IsSystem -Ne $True | Where PartitionStyle -Eq RAW | Group -NoElement -Property FriendlyName
} | Sort -Property PsComputerName, Count
{{< /card >}}

This will give no output when succeeded:

### 2.4 Creating the cluster

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-stack-hci-host-your-virtual-desktops-locally-with-all-the-best-of-azure-374/jv-media-374-7c36ca1edcd8.png)
{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
New-Cluster -Name HCI-CLUSTER01 -Node HCI01 -NOSTORAGE -StaticAddress 172.17.90.249
{{< /card >}}

After creating the cluster, we have to enable Storage Spaces Direct, but without Cache. We do this with the following command:

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
Enable-ClusterStorageSpacesDirect -CacheState Disabled
{{< /card >}}
![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-stack-hci-host-your-virtual-desktops-locally-with-all-the-best-of-azure-374/jv-media-374-6886811d3057.png)

The output shows the command has been processed succesfully.

### 2.5 Update Cluster Functional Level

To fully let your cluster work, you have to update the functional level of the cluster. This is a version of the language the nodes use to speak with each other.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-stack-hci-host-your-virtual-desktops-locally-with-all-the-best-of-azure-374/jv-media-374-3555d88afec1.png)

### 2.6 Creating Cluster Shared Volume

After everything for the cluster has been created, we have to create a Cluster Shared Volume (CSV). We can also do this from Powershell but can also be done with the Server Manager.

For Powershell, run the following command:

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
New-VirtualDisk -StoragePoolFriendlyName S2D* -FriendlyName CSVDisk -Size 240GB -ResiliencySettingName Simple
{{< /card >}}

My output was:

### 2.7 Register the cluster to Azure Stack HCI

After you configured everything of the local server we have to register the cluster to Azure Arc/Stack HCI. We can do this by following these steps:

First, register the needed resource providers in the Azure Portal. You can find this under your active subscription where you want to register the Cluster.

Register the following resource providers here:

- *Microsoft.AzureStackHCI*
- *Microsoft.HybridCompute*
- *Microsoft.HybridConnectivity*
- *Microsoft.GuestConfiguration*

By registering the resource providers, you enable every setting needed to use the service in your subscription. Microsoft does not enable everything by default to save its infrastucture from unneeded load.

After the Resource Providers are registered, we can finally register our cluster to Azure Arc. Go back to your HCI nodes and install the Azure StackHCI Powershell module:

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
Install-Module -Name Az.StackHCI
{{< /card >}}

After installing the module on every HCI cluster node, we can register the cluster node to Azure. You have to do this on every node, and this cannot be done through Powershell Remote.

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
Register-AzStackHCI  -SubscriptionId "SUBSCRIPTION ID" -ResourceGroupName jv-test-stackhci -TenantId "TENANT ID" -Region westeurope -ResourceName HCI01
{{< /card >}}

Here you need to login via <https://microsoft.com/devicelogin>

After that step, you have to wait around 10 minutes for the registration to be done.

### 2.8 Azure Stack HCI in the Azure Portal

You can access Azure Stack HCI in the Azure Portal:

Here you can manage the nodes and clusters.

To actually create resources on the hardware on-premises through Azure Stack HCI, you have to configure a Arc Resource Bridge. This is a connection between the host OS of the cluster nodes and Azure. We can configure this through Windows Admin Center, which can be enabled on the cluster nodes.

---

## Summary

Azure Stack HCI is the newest evolution in hybrid setups, where you want to leverage as much as possible from the Azure services, but want the flexibility of using your own hardware and increasing security and performance. Another pro of this setup is that you can save costs by not using the expensive servers on Azure with certain needs, like GPU-enabled machines.

{{< ads >}}

{{< article-footer >}}
