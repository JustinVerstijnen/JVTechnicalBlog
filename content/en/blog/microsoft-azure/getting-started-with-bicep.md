---
title: "Getting started with Bicep"
slug: "getting-started-with-bicep"
date: 2026-10-01
tags:
- Step by Step guides
- Knowledge check
categories:
- Microsoft Azure
description: "In this guide, I show the path from installation to deployment: I install the needed Bicep software, I prepare my Azure login using Azure CLI, and then I run a single server Bicep setup so you can see the process end-to-end."
hidden: false
---

## Bicep described

Bicep is a framework from Microsoft that lets you manage Azure infrastructure with text files only. You can see Bicep as a more readable language for Azure Resource Manager deployments. Bicep is not a separate cloud platform and it does not replace Azure Resource Manager. Instead, Bicep is compiled into an ARM template and then Azure Resource Manager deploys the resources.

Bicep code is declarative code. This means you describe the desired end result instead of writing every manual step the system needs to take, like you would often do in a PowerShell script. In this case, we tell ARM to create a Virtual Machine with the name, IP address, network, security rules, and other settings we specify. It is a bit like telling a chef which dish you want and which ingredients to use, and then letting the chef prepare it for you.

Bicep is very similar to Terraform, but has less complex features and does not have multi-cloud support which Terraform has.

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

After the resources are deployed, a PowerShell script is executed in the VM to install the Active Directory role and to configure it.

In this guide, I will show how to install the requirements, prepare your Azure login, start using Bicep and run a single server Bicep setup I have made with the needed dependencies and security.

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

## My Bicep example project

For the purpose of this guide, I created a simple Bicep project which we can use to deploy using Azure CLI and Bicep. You can find the project here:

<a class="btn btn-primary" href="https://github.com/JustinVerstijnen/JV-Bicep-SingleWindowsServerActiveDirectory" target="_blank" rel="noreferrer">View on my GitHub page</a>

---

## Step 1: Installation of Azure CLI

We can start by installing Azure CLI if it is not already installed. Azure CLI is used to login to Microsoft Azure and to run the Bicep deployment. The Azure CLI shoots your Bicep file to the Azure Resource Manager, where this ARM converts it into an actual building plan and builds your written deployment.

The most easy way to install Azure CLI on Windows is through `winget`.

Open PowerShell as Administrator and run the command below:

{{< card code=true header="**PowerShell**" lang="powershell" >}}
winget install --exact --id Microsoft.AzureCLI
{{< /card >}}

The installation can take some time, so please have a little patience.

[![jv-media-8517-87f539b93794.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/getting-started-with-bicep/jv-media-8517-87f539b93794.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/getting-started-with-bicep/jv-media-8517-87f539b93794.png)

After the installation is completed, close all open PowerShell and Visual Studio Code windows. This is needed so Windows can reload the new environment variables and initialize the commands needed.

Then open a new PowerShell window and check if Azure CLI is working:

{{< card code=true header="**PowerShell**" lang="powershell" >}}
az version
{{< /card >}}

If Azure CLI is installed correctly, the Azure CLI version information will be shown in the terminal.

{{< card code=true header="**PowerShell**" lang="powershell" >}}
PS C:\Users\InfoJustinVerstijnen> az version
{
  "azure-cli": "2.87.0",
  "azure-cli-core": "2.87.0",
  "azure-cli-telemetry": "1.1.0"
}
{{< /card >}}

[![jv-media-8517-d6311e2b4d87.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/getting-started-with-bicep/jv-media-8517-d6311e2b4d87.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/getting-started-with-bicep/jv-media-8517-d6311e2b4d87.png)

Azure CLI is now installed and ready to use. If you get any error on this step, the installation might not be fully completed. You will need to troubleshoot this first, restart PowerShell and restart your computer before going any further to save you some time.

---

## Step 2: Installation of Bicep

When you use Bicep together with Azure CLI, Azure CLI can install and use the Bicep CLI automatically. If Bicep is not installed yet, install it using:

{{< card code=true header="**PowerShell**" lang="powershell" >}}
az bicep install
{{< /card >}}

[![jv-media-8517-3fb9cd97bcb1.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/getting-started-with-bicep/jv-media-8517-3fb9cd97bcb1.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/getting-started-with-bicep/jv-media-8517-3fb9cd97bcb1.png)

Bicep will now be installed.

You can then check the Bicep installation by running this command:

{{< card code=true header="**PowerShell**" lang="powershell" >}}
az bicep version
{{< /card >}}

Now Bicep is ready to use from Azure CLI.

[![jv-media-8517-bb07f6c95b32.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/getting-started-with-bicep/jv-media-8517-bb07f6c95b32.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/getting-started-with-bicep/jv-media-8517-bb07f6c95b32.png)

For the best editing experience, also install the Bicep extension in Visual Studio Code. This gives you syntax highlighting, validation, and resource autocompletion while writing `.bicep` files. You can also execute the Bicep files directly using the built-in Terminal, so win-win.

[![jv-media-8517-54e86ff3e5d2.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/getting-started-with-bicep/jv-media-8517-54e86ff3e5d2.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/getting-started-with-bicep/jv-media-8517-54e86ff3e5d2.png)

Identifier: ms-azuretools.vscode-bicep

{{< ads >}}

---

## Step 3: Creating my Single Server Bicep setup

We will now prepare the Bicep example project for deployment. If you have not already downloaded the files yet, do this now.

Place the files on your computer on a good place, like your Desktop or C:\Temp. Then open Visual Studio and open the `main.bicep` file from my example project.

[![jv-media-8517-3c839608fff1.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/getting-started-with-bicep/jv-media-8517-3c839608fff1.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/getting-started-with-bicep/jv-media-8517-3c839608fff1.png)

[![jv-media-8517-8a7da4f662fc.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/getting-started-with-bicep/jv-media-8517-8a7da4f662fc.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/getting-started-with-bicep/jv-media-8517-8a7da4f662fc.png)

This `main.bicep` file deploys these resources into the resource group you target with Azure CLI. You can now take some time to review the content of the file as we are ready to change the project to your likings.

---

## Step 4: Changing the project parameters

As it can be a quite complex file, I will guide you through which values can be changed and on which Line they exist:

| Line | Parameter | Example value | Description |
| --- | --- | --- | --- |
| 6 | projectName | biceptst | Short project name used in the resource names |
| 12 | adminUsername | jvadmin | Local administrator username for the VM |
| 22 | vmSize | Standard_B2ms | Size of the Windows Server VM |
| 34 | domainName | jvlab.local | Active Directory domain name |
| 39 | domainNetbiosName | JVLAB | Active Directory NetBIOS name |

The password is passed as a secure string to Bicep and the source IP address is your Public IP address, which will be whitelisted only for RDP access for high security.

---

## Step 5: Validating the Bicep file

Before deploying the Bicep file, we can let Bicep build the file into an ARM template. This is a nice first check to see if the file can be parsed. In Visual Studio Code, open a new Terminal through the "Terminal" menu:

[![jv-media-8517-27ad68dce957.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/getting-started-with-bicep/jv-media-8517-27ad68dce957.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/getting-started-with-bicep/jv-media-8517-27ad68dce957.png)

This opens a terminal below your Bicep file, where we can execute the file and instantly change something if needed.

Navigate to the folder of your Bicep project in the Visual Studio Code terminal by using the `cd` command and paste in the folder location where your `.bicep` file is:

[![jv-media-8517-1ecf723fee8d.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/getting-started-with-bicep/jv-media-8517-1ecf723fee8d.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/getting-started-with-bicep/jv-media-8517-1ecf723fee8d.png)

Then run the command to build your Bicep project where the project is validated on errors, compatibility and such:

{{< card code=true header="**PowerShell**" lang="powershell" >}}
az bicep build --file .\main.bicep
{{< /card >}}

[![jv-media-8517-1928cf5b058a.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/getting-started-with-bicep/jv-media-8517-1928cf5b058a.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/getting-started-with-bicep/jv-media-8517-1928cf5b058a.png)

If the command finishes without errors, Bicep has created a generated `main.json` ARM template in the same folder. Let's check the file:

[![jv-media-8517-e49d7001244c.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/getting-started-with-bicep/jv-media-8517-e49d7001244c.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/getting-started-with-bicep/jv-media-8517-e49d7001244c.png)

This JSON file is the Azure-ready file. You don't need to change that file as this might break the deployment. The `.bicep` file is the file we maintain, and build a new JSON from if needed.

---

## Step 6: Deploying the Bicep project

Now we are finally ready to deploy our Bicep project to Azure. We will login to Azure CLI, create the target resource group, run a what-if check, and then deploy the Bicep file.

Let's sign in to Azure CLI within the Visual Studio Code terminal using this command:

{{< card code=true header="**PowerShell**" lang="powershell" >}}
az login
{{< /card >}}

Then login to your Azure account where the deployment must be done. Also be sure to perform the additional verification steps. The login window can appear behind any other windows, so be aware if executing the command and nothing happens.

If you have multiple subscriptions, set the subscription you want to use by typing the number:

[![jv-media-8517-d0a072f097be.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/getting-started-with-bicep/jv-media-8517-d0a072f097be.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/getting-started-with-bicep/jv-media-8517-d0a072f097be.png)

Now create the resource group for this demonstration deployment:

{{< card code=true header="**PowerShell**" lang="powershell" >}}
az group create --name "rg-jv-biceptst" --location "westeurope"
{{< /card >}}

[![jv-media-8517-ab3f0eedac67.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/getting-started-with-bicep/jv-media-8517-ab3f0eedac67.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/getting-started-with-bicep/jv-media-8517-ab3f0eedac67.png)

This successfully created the resource group for the deployment. Here is also where you choose the Azure region of the full deployment. Now we should run a what-if deployment. This is comparable to checking the plan before applying the change. This will give you an overview of what resources are being created. This also shows possible errors.

{{< card code=true header="**PowerShell**" lang="powershell" >}}
az deployment group what-if `
  --resource-group "rg-jv-biceptst" `
  --template-file .\main.bicep `
  --parameters `
    projectName="biceptst" `
    sourceIpAddress="1.2.3.4" `
    adminUsername="jvadmin" `
    adminPassword="YourPassw0rd!" `
    domainName="jvlab.local" `
    domainNetbiosName="JVLAB"
{{< /card >}}

After around 25 seconds, the output will be given and summarized how many resources there will be created:

[![jv-media-8517-901f8a475116.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/getting-started-with-bicep/jv-media-8517-901f8a475116.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/getting-started-with-bicep/jv-media-8517-901f8a475116.png)

6 resources; the network resources, public IP address, NIC, VM, OS disk, and VM extension.

Now let's deploy the project to Azure by executing this command block:

{{< card code=true header="**PowerShell**" lang="powershell" >}}
az deployment group create `
  --resource-group "rg-jv-biceptst" `
  --template-file .\main.bicep `
  --parameters `
    projectName="biceptst" `
    sourceIpAddress="1.2.3.4" `
    adminUsername="jvadmin" `
    adminPassword="YourPassw0rd!" `    domainName="jvlab.local" `
    domainNetbiosName="JVLAB"
{{< /card >}}

Azure will now start the full deployment based on your Bicep file and parameters.

[![jv-media-8517-fecfa3e52728.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/getting-started-with-bicep/jv-media-8517-fecfa3e52728.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/getting-started-with-bicep/jv-media-8517-fecfa3e52728.png)

The dependencies like disk, NIC, Public IP and NSG will be created first, then the VM. After that, the Custom Script Extension runs inside the VM. This extension installs the Active Directory Domain Services role, creates the new forest, installs DNS, and schedules a restart of the server. This makes the server ready for some Active Directory experiments.

Very fast after executing the create command, the resources will be visible in the Azure Portal:

[![jv-media-8517-59766e928950.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/getting-started-with-bicep/jv-media-8517-59766e928950.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/getting-started-with-bicep/jv-media-8517-59766e928950.png)

You can even watch the deployment live by clicking the "Deploying" button and then open the "main" deployment:

[![jv-media-8517-e92c4d1f7477.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/getting-started-with-bicep/jv-media-8517-e92c4d1f7477.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/getting-started-with-bicep/jv-media-8517-e92c4d1f7477.png)

You can now see much more than only "Running..". The total deployment takes about 8 minutes in total, where the after deployment script will take the most time.

[![jv-media-8517-21419b7b686c.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/getting-started-with-bicep/jv-media-8517-21419b7b686c.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/getting-started-with-bicep/jv-media-8517-21419b7b686c.png)

[![jv-media-8517-76b7721dc60f.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/getting-started-with-bicep/jv-media-8517-76b7721dc60f.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/getting-started-with-bicep/jv-media-8517-76b7721dc60f.png)

After the deployment is finished, Azure CLI shows the outputs configured in the Bicep file. These outputs include information like the public IP address and an example RDP command.

If you need to remove all the resources created in this guide, delete the resource group:

{{< card code=true header="**PowerShell**" lang="powershell" >}}
az group delete --name "rg-jv-biceptst" --yes --no-wait
{{< /card >}}

This removes the complete lab resource group in a single command.

---

## Step 7: The results

After the `az deployment group create` command finishes, Azure has built the resources defined in the Bicep setup. After the whole deployment was completed. the virtual machine restarts to complete the Active Directory installation.

Let's check the results:

- Check if the NSG and source IP address
- Check the resource names
- Login to the VM with RDP to check Active Directory status

[![jv-media-8517-58e2d9b2ba15.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/getting-started-with-bicep/jv-media-8517-58e2d9b2ba15.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/getting-started-with-bicep/jv-media-8517-58e2d9b2ba15.png)

As you can see, Active Directory has been successfully installed and configured.

---

## Step 8: Changes to the Bicep project (optional)

If you change something in the Bicep setup, for example the VM size, tags, or allowed RDP source IP address, you can update Azure again by running these commands:

{{< card code=true header="**PowerShell**" lang="powershell" >}}
az bicep build --file .\main.bicep
{{< /card >}}

And then deploy the project again:

{{< card code=true header="**PowerShell**" lang="powershell" >}}
az deployment group create `
  --resource-group "rg-jv-biceptst" `
  --template-file .\main.bicep `
  --parameters `
    projectName="biceptst" `
    sourceIpAddress="1.2.3.4" `
    adminUsername="jvadmin" `
    adminPassword="YourPassw0rd!" `
    domainName="jvlab.local" `
    domainNetbiosName="JVLAB"
{{< /card >}}

Azure Resource Manager will compare what is in your Bicep file with what already exists in the resource group, and then apply the changes.

Be aware that normal resource group deployments use incremental mode. This means Azure adds or updates the resources in the template, but it does not automatically delete every existing resource in the resource group that is missing from the Bicep file.

---

## Knowledge check

{{< quiz >}}
{
  "intro": "Answer these question(s) to test your understanding of this post. Your answers are not saved or sent anywhere; this is simply a personal knowledge check. If you refresh the page, your answers will be cleared.",
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
          "text": "You describe the desired end result(s)",
          "correct": true,
          "message": "Correct! With Bicep, you define what the infrastructure should look like, and Azure Resource Manager deploys that desired state."
        },
        {
          "text": "Bicep only creates documentation and does not deploy resources",
          "correct": false,
          "message": "Incorrect. Bicep files can be deployed to Azure through Azure Resource Manager."
        },
        {
          "text": "You define every action like a PowerShell script",
          "correct": false,
          "message": "Incorrect"
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
          "text": "az deployment group create",
          "correct": false,
          "message": "Incorrect. This will instantly start the deployment process."
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

The advantages of Bicep are readable Azure-native Infrastructure as Code, easy repeatable deployments, what-if previews, and a strong editing experience in Visual Studio Code. How I use Bicep is to easily and fastly deploy some servers with a set configuration to take away the manual work for a guide.

Bicep is very similar to Terraform and both have their advantages. I think Bicep is more easy and needs less dependencies to work. However, it also does have less features and less community support than Terraform.

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
