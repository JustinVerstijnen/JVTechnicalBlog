---
title: "Getting started with Bicep"
slug: "getting-started-with-bicep"
date: 2026-07-03
tags:
- Step by Step guides
- Knowledge check
categories:
- Microsoft Azure
description: "In this guide, I show the path from installation to deployment: I install the needed Bicep tooling, I prepare my Azure login using Azure CLI, and then I run a single server Bicep setup so you can see the process end-to-end."
hidden: false
---

## Bicep described

Bicep is a framework from Microsoft that lets you manage Azure infrastructure with text files only. You can see Bicep as a more readable language for Azure Resource Manager deployments. Bicep is not a separate cloud platform and it does not replace Azure Resource Manager. Instead, Bicep is compiled into an ARM template and then Azure Resource Manager deploys the resources.

Bicep code is declarative code. This means you describe the desired end result instead of writing every manual step the system needs to take, like you would often do in a PowerShell script. In this case, we tell ARM to create a Virtual Machine with the name, IP address, network, security rules, and other settings we specify. It is a bit like telling a chef which dish you want and which ingredients to use, and then letting the chef prepare it for you.

**In simple words:**

1. You write what you want in a `.bicep` file, for example: “make a server, with a public IP linked and a NSG”.
2. Azure can show a “what-if” result to show what it will do before touching your cloud environment.
3. Then Azure CLI deploys the Bicep file through Azure Resource Manager to build or change the Azure resources according to your file.

The topology of the resources we will deploy in this guide is:

| Resource type | Resource name |
| --- | --- |
| Resource group | rg-jv-<project> |
| OS disk | osdisk-jv-<project> |
| VNET | vnet-jv-<project> |
| Subnet | snet-jv-<project> |
| NIC | nic-jv-<project> |
| Public IP | pip-jv-<project> |
| NSG | nsg-jv-<project> |
| VM | vm-jv-<project> |
| VM extension | install-ad-ds |

After the resources are deployed, a Custom Script Extension is executed in the VM to install the Active Directory Domain Services role and to configure a new forest.

In this guide, I will show how to install the needed Bicep tooling, prepare your Azure login, start using Bicep, and run a single server Bicep setup I have made with the needed dependencies and basic security.

> This setup is made as a lab example. The VM receives a public IP address, but RDP is limited to the IP address you configure. For production environments, consider using Azure Bastion, VPN, Just-in-Time access, or another secure management method instead of exposing RDP.

---

## Requirements

- Around 30 minutes of your time
- Moderate knowledge of Azure and PowerShell
- Basic knowledge of Bicep and Infrastructure as Code
- Visual Studio Code
- Bicep extension for Visual Studio Code
- Azure CLI
- An Azure subscription where you are allowed to create resources

---

## Step 1: Installation of Azure CLI

We can start by installing Azure CLI if it is not already installed. Azure CLI is used to login to Microsoft Azure and to run the Bicep deployment.

The most easy way to install Azure CLI on Windows is through `winget`.

Open PowerShell as Administrator and run the command below:

{{< card code=true header="**PowerShell**" lang="powershell" >}}
winget install --exact --id Microsoft.AzureCLI
{{< /card >}}

The installation can take some time, so please have a little patience.

After the installation is completed, close all open PowerShell and Visual Studio Code windows. This is needed so Windows can reload the new environment variables and initialize the commands needed.

Then open a new PowerShell window and check if Azure CLI is working:

{{< card code=true header="**PowerShell**" lang="powershell" >}}
az version
{{< /card >}}

If Azure CLI is installed correctly, the Azure CLI version information will be shown in the terminal.

{{< card code=true header="**PowerShell**" lang="powershell" >}}
PS C:\Users\InfoJustinVerstijnen> az version
{
  "azure-cli": "2.86.0",
  "azure-cli-core": "2.86.0",
  "azure-cli-telemetry": "1.1.0"
}
{{< /card >}}

Azure CLI is now installed and ready to use.

---

## Step 2: Checking Bicep on your computer

When you use Bicep together with Azure CLI, Azure CLI can install and use the Bicep CLI automatically. You can check if the Bicep command is available by running this command:

{{< card code=true header="**PowerShell**" lang="powershell" >}}
az bicep version
{{< /card >}}

If Bicep is not installed yet, install it using:

{{< card code=true header="**PowerShell**" lang="powershell" >}}
az bicep install
{{< /card >}}

If Bicep is already installed but you want to update it, run:

{{< card code=true header="**PowerShell**" lang="powershell" >}}
az bicep upgrade
{{< /card >}}

Now Bicep is ready to use from Azure CLI.

For the best editing experience, also install the Bicep extension in Visual Studio Code. This gives you syntax highlighting, IntelliSense, validation, and resource autocompletion while writing `.bicep` files.

---

## Step 3: Creating my Single Server Bicep setup

For the ease of this guide, I have a full template available that deploys the resources as stated in the description at the top of the page. We only need to change some parameters to your likings.

Create a new folder on your computer, for example:

{{< card code=true header="**PowerShell**" lang="powershell" >}}
New-Item -Path "C:\Temp\JV-Bicep-SingleWindowsServerActiveDirectory" -ItemType Directory
{{< /card >}}

Open this folder in Visual Studio Code and create a new file named:

{{< card code=true header="**File name**" lang="text" >}}
main.bicep
{{< /card >}}

The setup contains one file:

| File name | Contains |
| --- | --- |
| main.bicep | The resources, variables, parameters, security rule, VM, and the Custom Script Extension that installs Active Directory Domain Services |

The `main.bicep` file deploys these resources into the resource group you target with Azure CLI.

> In this guide, the resource group is created with Azure CLI first. This keeps the Bicep file simple and easy to understand. Bicep can also create resource groups from subscription scope, but for this beginner guide I keep all resources in a single resource group deployment.

Now we are ready to change the project to your likings.

---

## Step 4: Changing the project parameters

At the top of the `main.bicep` file, you can change the project parameters. These parameters are where you set values like the project name, IP address, VM size, and Active Directory domain details.

The most important parameters are:

| Parameter | Example value | Description |
| --- | --- | --- |
| projectName | biceplab | Short project name used in the resource names |
| location | westeurope | Azure region where the resources are created |
| adminUsername | jvadmin | Local administrator username for the VM |
| adminPassword | Use a strong password | Local administrator password and DSRM password |
| sourceIpAddress | 1.2.3.4 | Your public IP address for RDP whitelisting |
| vmSize | Standard_B2ms | Size of the Windows Server VM |
| domainName | jvlab.local | Active Directory domain name |
| domainNetbiosName | JVLAB | Active Directory NetBIOS name |

The things you are required to change before deployment are:

- Resource group name in the Azure CLI command
- `projectName`
- `sourceIpAddress`
- `adminUsername`
- `adminPassword`
- `domainName`
- `domainNetbiosName`

Do not store real passwords in GitHub or in screenshots. For this guide, the password is passed as a secure Bicep parameter.

---

## Step 5: Validating the Bicep file

Before deploying the Bicep file, we can let Bicep build the file into an ARM template. This is a nice first check to see if the file can be parsed.

Navigate to the folder of your Bicep project in the Visual Studio Code terminal and run:

{{< card code=true header="**PowerShell**" lang="powershell" >}}
az bicep build --file .\main.bicep
{{< /card >}}

If the command finishes without errors, Bicep has created a generated `main.json` ARM template in the same folder.

You do not have to edit this JSON file. The `.bicep` file is the file we maintain.

---

## Step 6: Deploying the Bicep project

Now we are finally ready to deploy our Bicep project to Azure. We will login to Azure CLI, create the target resource group, run a what-if check, and then deploy the Bicep file.

Let's sign in to Azure CLI using this command:

{{< card code=true header="**PowerShell**" lang="powershell" >}}
az login
{{< /card >}}

Then login to your Azure account where the deployment must be done. Also be sure to perform the additional verification steps.

If you have multiple subscriptions, set the subscription you want to use:

{{< card code=true header="**PowerShell**" lang="powershell" >}}
az account set --subscription "<subscription-id>"
{{< /card >}}

Now create the resource group for this deployment:

{{< card code=true header="**PowerShell**" lang="powershell" >}}
az group create --name "rg-jv-biceplab" --location "westeurope"
{{< /card >}}

Now run a what-if deployment. This is comparable to checking the plan before applying the change.

{{< card code=true header="**PowerShell**" lang="powershell" >}}
az deployment group what-if `
  --resource-group "rg-jv-biceplab" `
  --template-file .\main.bicep `
  --parameters `
    projectName="biceplab" `
    sourceIpAddress="<your-public-ip>" `
    adminUsername="jvadmin" `
    adminPassword="<strong-password>" `
    domainName="jvlab.local" `
    domainNetbiosName="JVLAB"
{{< /card >}}

Review the what-if output. It should show that Azure will create the network resources, public IP address, NIC, VM, OS disk, and VM extension.

If the what-if output looks correct, start the deployment:

{{< card code=true header="**PowerShell**" lang="powershell" >}}
az deployment group create `
  --resource-group "rg-jv-biceplab" `
  --template-file .\main.bicep `
  --parameters `
    projectName="biceplab" `
    sourceIpAddress="<your-public-ip>" `
    adminUsername="jvadmin" `
    adminPassword="<strong-password>" `
    domainName="jvlab.local" `
    domainNetbiosName="JVLAB"
{{< /card >}}

Azure will now start the full deployment based on your Bicep file and parameters.

The VM is created first. After that, the Custom Script Extension runs inside the VM. This extension installs the Active Directory Domain Services role, creates the new forest, installs DNS, and schedules a restart of the server.

After the deployment is finished, Azure CLI shows the outputs configured in the Bicep file. These outputs include information like the public IP address and an example RDP command.

If you need to remove all the resources created in this guide, delete the resource group:

{{< card code=true header="**PowerShell**" lang="powershell" >}}
az group delete --name "rg-jv-biceplab" --yes --no-wait
{{< /card >}}

This removes the complete lab resource group.

---

## Step 7: The results

After `az deployment group create` finishes, Azure has built the resources defined in the Bicep setup. In my case, this type of deployment should only take several minutes, after which the virtual machine restarts to complete the Active Directory installation.

Let's check the results:

- check the output shown by Azure CLI in your terminal,
- check the Azure resources in the Azure Portal for the resource group that was created,
- check if the VM has a private IP address that matches the DNS server configured in the VNET,
- check if the Custom Script Extension has completed,
- and after the restart, test signing in to the VM.

The deployed resource group should contain the dependent resources like the VM, OS disk, NIC, NSG, VNET, and public IP address.

The VNET DNS server is also changed to the private IP address of the created server. This makes the server usable as the DNS server for this lab network.

Pretty cool and much faster and more according to plan than deploying everything by hand.

---

## Step 8: Changes to the Bicep project (optional)

If you change something in the Bicep setup, for example the VM size, tags, or allowed RDP source IP address, you can update Azure again by running these commands:

{{< card code=true header="**PowerShell**" lang="powershell" >}}
az deployment group what-if `
  --resource-group "rg-jv-biceplab" `
  --template-file .\main.bicep `
  --parameters `
    projectName="biceplab" `
    sourceIpAddress="<your-public-ip>" `
    adminUsername="jvadmin" `
    adminPassword="<strong-password>" `
    domainName="jvlab.local" `
    domainNetbiosName="JVLAB"

az deployment group create `
  --resource-group "rg-jv-biceplab" `
  --template-file .\main.bicep `
  --parameters `
    projectName="biceplab" `
    sourceIpAddress="<your-public-ip>" `
    adminUsername="jvadmin" `
    adminPassword="<strong-password>" `
    domainName="jvlab.local" `
    domainNetbiosName="JVLAB"
{{< /card >}}

Azure Resource Manager will compare what is in your Bicep file with what already exists in the resource group, and then apply the changes.

Be aware that normal resource group deployments use incremental mode. This means Azure adds or updates the resources in the template, but it does not automatically delete every existing resource in the resource group that is missing from the Bicep file.

If you want to remove everything completely, delete the resource group:

{{< card code=true header="**PowerShell**" lang="powershell" >}}
az group delete --name "rg-jv-biceplab" --yes --no-wait
{{< /card >}}

---

## Knowledge check

{{< quiz >}}
{
  "intro": "Answer these questions to test your understanding of this post. Your answers are not saved or sent anywhere; this is simply a personal knowledge check. If you refresh the page, your answers will be cleared.",
  "questions": [
    {
      "question": "What does it mean that Bicep code is declarative?",
      "reference": "See the section: Bicep described",
      "referenceUrl": "#bicep-described",
      "answers": [
        {
          "text": "You write every manual Azure Portal click as a separate command",
          "correct": false,
          "message": "Incorrect. Declarative code means you describe the desired end result, not every individual manual step."
        },
        {
          "text": "You describe the desired end result, and Azure Resource Manager figures out how to create or change the resources",
          "correct": true,
          "message": "Correct! With Bicep, you define what the infrastructure should look like, and Azure Resource Manager deploys that desired state."
        },
        {
          "text": "Bicep only creates documentation and does not deploy resources",
          "correct": false,
          "message": "Incorrect. Bicep files can be deployed to Azure through Azure Resource Manager."
        },
        {
          "text": "Bicep only works after resources are created manually first in the Azure Portal",
          "correct": false,
          "message": "Incorrect. Bicep is used to deploy and manage resources from code."
        }
      ]
    },
    {
      "question": "Which Azure CLI command can be used to preview changes before deploying a Bicep file?",
      "reference": "See the section: Step 6: Deploying the Bicep project",
      "referenceUrl": "#step-6-deploying-the-bicep-project",
      "answers": [
        {
          "text": "az bicep version",
          "correct": false,
          "message": "Incorrect. az bicep version only shows the installed Bicep version."
        },
        {
          "text": "az deployment group what-if",
          "correct": true,
          "message": "Correct! The what-if operation previews the changes before you deploy the Bicep file."
        },
        {
          "text": "az group delete",
          "correct": false,
          "message": "Incorrect. az group delete removes the resource group."
        },
        {
          "text": "az logout",
          "correct": false,
          "message": "Incorrect. az logout signs out from Azure CLI and does not preview a deployment."
        }
      ]
    },
    {
      "question": "Why does this guide create the resource group with Azure CLI before deploying the Bicep file?",
      "reference": "See the section: Step 3: Creating my Single Server Bicep setup",
      "referenceUrl": "#step-3-creating-my-single-server-bicep-setup",
      "answers": [
        {
          "text": "Because Bicep cannot deploy anything to Azure",
          "correct": false,
          "message": "Incorrect. Bicep can deploy Azure resources. This guide keeps the template resource-group-scope for simplicity."
        },
        {
          "text": "Because this beginner setup deploys all resources into one target resource group, keeping the Bicep file simple",
          "correct": true,
          "message": "Correct! The resource group is created first, and then the Bicep file deploys the lab resources into that resource group."
        },
        {
          "text": "Because Azure CLI does not support Bicep files",
          "correct": false,
          "message": "Incorrect. Azure CLI can deploy Bicep files."
        },
        {
          "text": "Because virtual machines cannot be created in Bicep",
          "correct": false,
          "message": "Incorrect. Virtual machines can be created with Bicep."
        }
      ]
    }
  ]
}
{{< /quiz >}}

---

## Summary

Bicep helps you deploy Azure resources in a repeatable way using Infrastructure as Code. With the steps above, you installed Azure CLI, checked Bicep, prepared your settings, then used `az bicep build`, `az deployment group what-if`, and `az deployment group create` to deploy your single server setup.

The advantages of Bicep are readable Azure-native Infrastructure as Code, easy repeatable deployments, what-if previews, and a strong editing experience in Visual Studio Code.

Thank you for reading this post and I hope it was helpful!

### Sources

These sources helped me by writing and research for this post:

1. [https://learn.microsoft.com/en-us/azure/azure-resource-manager/bicep/overview](https://learn.microsoft.com/en-us/azure/azure-resource-manager/bicep/overview)
2. [https://learn.microsoft.com/en-us/azure/azure-resource-manager/bicep/install](https://learn.microsoft.com/en-us/azure/azure-resource-manager/bicep/install)
3. [https://learn.microsoft.com/en-us/azure/azure-resource-manager/bicep/deploy-cli](https://learn.microsoft.com/en-us/azure/azure-resource-manager/bicep/deploy-cli)
4. [https://learn.microsoft.com/en-us/azure/azure-resource-manager/bicep/deploy-what-if](https://learn.microsoft.com/en-us/azure/azure-resource-manager/bicep/deploy-what-if)
5. [https://learn.microsoft.com/en-us/azure/azure-resource-manager/bicep/visual-studio-code](https://learn.microsoft.com/en-us/azure/azure-resource-manager/bicep/visual-studio-code)

{{< ads >}}

{{< article-footer >}}
