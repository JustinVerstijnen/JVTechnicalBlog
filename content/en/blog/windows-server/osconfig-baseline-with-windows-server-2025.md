---
title: "OSConfig Baseline with Windows Server 2025"
slug: "osconfig-baseline-with-windows-server-2025"
date: 2025-11-19
tags:
- Step by Step Guides
categories:
- Windows Server
description: "In this post, I will dive into OSConfig for Windows Server 2025, which provides a security baseline that can be used. I will cover the installation, usage and modifications to the current security baseline provided by Microsoft."
hidden: false
---

OSConfig is a configuration baseline engine for Windows Server 2025. This can be used to describe how a server needs to be configured, and OSConfig can help you enforce this configuration. When using Microsoft Azure, we can also leverage Azure Policy to enforce those configurations more easily.

This OSConfig baseline contains a set of 300+ settings to secure your Windows Server 2025 installation. The good thing about this is that it can be applied very quickly and will automatically correct settings to the baseline value if any drift occurs. Let's say somebody enables TLS 1.0 because of an insecure application, but the baseline only permits 1.2 and up. OSConfig will then block this change and keep the baseline setting as the effective setting.

OSConfig can be used in various setups:

- Standalone with PowerShell
- Azure Policy for Azure-hosted servers
- Azure Arc for on-premises servers connected to Azure

In this guide, I will dive into how to use OSConfig on standalone and Azure-hosted servers, as this will cover 95% of all three options.

---

## Requirements

- Around 30 minutes of your time
- Windows Server 2025 installation
- An Azure subscription with the Microsoft.GuestConfiguration resource provider registered if using Azure Policy

---

## Set up a Windows Server 2025 instance (optional)

If not already available, we need to set up an instance to experiment with OSConfig, which is only included in Windows Server 2025 and higher. I will set up this server on Azure and use it in standalone and Azure Policy modes for the purpose of this guide.

Open Microsoft Azure and create a resource group:

[![jv-media-8537-8ec20b9f0740.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/osconfig-baseline-with-windows-server-2025/jv-media-8537-8ec20b9f0740.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/osconfig-baseline-with-windows-server-2025/jv-media-8537-8ec20b9f0740.png)

Then create a simple server to test OSConfig on and use the Windows Server 2025 image:

[![jv-media-8537-eb676e4573e0.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/osconfig-baseline-with-windows-server-2025/jv-media-8537-eb676e4573e0.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/osconfig-baseline-with-windows-server-2025/jv-media-8537-eb676e4573e0.png)

After a few minutes, our newly created server will be ready to be used.

---

## Option 1: Using OSConfig in Standalone mode

To start using OSConfig on Windows Server 2025, let's log in to our server and install the required PowerShell module.

Run this command to install the module:

{{< card code=true header="**PowerShell**" lang="powershell" >}}
Install-Module -Name Microsoft.OSConfig -Scope AllUsers -Force
{{< /card >}}

If any further action is required, proceed to install the module, and the installation will start accordingly.

[![jv-media-8537-1aeb6fb42987.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/osconfig-baseline-with-windows-server-2025/jv-media-8537-1aeb6fb42987.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/osconfig-baseline-with-windows-server-2025/jv-media-8537-1aeb6fb42987.png)

After about 45 seconds, the installation will be complete and we can start using the module.

Now that the module is active, we can start configuring the server(s) by using the `Set-OSConfigDesiredConfiguration` command, which supports parameters. We could enable the complete baseline for our server, which makes it very secure instantly, but this would not be the best option on live servers. You can make customizations to the actual baseline to suit your needs.

To enable OSConfig on a standalone server (no domain), use this command:

{{< card code=true header="**PowerShell**" lang="powershell" >}}
Set-OSConfigDesiredConfiguration -Scenario SecurityBaseline/WindowsServer/2025/WorkgroupMember -Default
{{< /card >}}

To enable OSConfig on a domain controller server, use this command:

{{< card code=true header="**PowerShell**" lang="powershell" >}}
Set-OSConfigDesiredConfiguration -Scenario SecurityBaseline/WindowsServer/2025/DomainController -Default
{{< /card >}}

And to enable OSConfig on a member server, use this command:

{{< card code=true header="**PowerShell**" lang="powershell" >}}
Set-OSConfigDesiredConfiguration -Scenario SecurityBaseline/WindowsServer/2025/MemberServer -Default
{{< /card >}}

So OSConfig has different baselines for the type of server you are using. In my case, I don't have Active Directory installed on the server, so I will use the WorkgroupMember baseline:

[![jv-media-8537-0e16b8631e7b.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/osconfig-baseline-with-windows-server-2025/jv-media-8537-0e16b8631e7b.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/osconfig-baseline-with-windows-server-2025/jv-media-8537-0e16b8631e7b.png)

So this applies the full baseline with, at the time of writing, 317 settings that secure our server. These are settings such as:

- Windows Firewall enabled on Domain, Private, and Public profiles
- SMBv1 disabled and a minimum of SMB 3.0 enforced
- TLS 1.2 or higher required
- Local password policy hardened, like a minimum password length of 14 characters
- Anonymous and guest access restricted, including blocking anonymous SAM enumeration and disabling insecure guest logons
- Credential protections enabled, such as Credential Guard / LSASS protection where supported
- Advanced auditing enabled, including logon events, account management, process creation, file shares, and firewall activity

A full list of the baseline configuration options is available here: [https://learn.microsoft.com/en-us/azure/osconfig/server2025machineconfigdoc](https://learn.microsoft.com/en-us/azure/osconfig/server2025machineconfigdoc)

### 1.1 Exclusion on the baseline

Now we can also set exclusions on top of the complete baseline. Let's say we don't want the minimum password length to be 14 characters, but 10 characters instead, while keeping the rest of the baseline applied. We can view the settings graphically using `secpol.msc`:

[![jv-media-8537-2fd52cf4d48a.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/osconfig-baseline-with-windows-server-2025/jv-media-8537-2fd52cf4d48a.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/osconfig-baseline-with-windows-server-2025/jv-media-8537-2fd52cf4d48a.png)

We could run the following command to apply an exclusion to the baseline and set it to 10 characters:

{{< card code=true header="**PowerShell**" lang="powershell" >}}
Set-OSConfigDesiredConfiguration -Scenario SecurityBaseline/WindowsServer/2025/WorkgroupMember -Setting DeviceLockMinimumPasswordLength -Value 10
{{< /card >}}

Running this will change the baseline and correct it to this value if configuration drift occurs:

[![jv-media-8537-bb661156e7f7.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/osconfig-baseline-with-windows-server-2025/jv-media-8537-bb661156e7f7.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/osconfig-baseline-with-windows-server-2025/jv-media-8537-bb661156e7f7.png)

Restart the server (again) to make the changes effective.

---

## Option 2: Using OSConfig with Azure Policy

The second option for using OSConfig on Windows Server 2025 is Azure Policy. This is more scalable than configuring a single server and manually running the commands on the various servers you use.

### 2.1 Deploying the Prerequisites policy

We first need to deploy some prerequisites for Azure to be able to perform configuration updates. This includes some VM extensions and a Managed Identity.

Open the Azure Portal (https://portal.azure.com), if you haven't already, and open `Policy`.

[![jv-media-8537-d5424d430ea2.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/osconfig-baseline-with-windows-server-2025/jv-media-8537-d5424d430ea2.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/osconfig-baseline-with-windows-server-2025/jv-media-8537-d5424d430ea2.png)

In `Policy`, open `Definitions` from the left and search for:

- Deploy prerequisites to enable Guest Configuration policies on virtual machines

[![jv-media-8537-0bb793e000e4.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/osconfig-baseline-with-windows-server-2025/jv-media-8537-0bb793e000e4.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/osconfig-baseline-with-windows-server-2025/jv-media-8537-0bb793e000e4.png)

Open the `Definition` and then click on `Assign initiative` to assign this policy template to our server(s):

[![jv-media-8537-29e42eeeb412.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/osconfig-baseline-with-windows-server-2025/jv-media-8537-29e42eeeb412.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/osconfig-baseline-with-windows-server-2025/jv-media-8537-29e42eeeb412.png)

Under `Scope`, we can scope the policy to one or multiple resource groups, depending on our Azure architecture. If multiple similar servers are running for a particular solution, there is a good chance that they are in the same resource group.

[![jv-media-8537-88f7bb23cd4b.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/osconfig-baseline-with-windows-server-2025/jv-media-8537-88f7bb23cd4b.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/osconfig-baseline-with-windows-server-2025/jv-media-8537-88f7bb23cd4b.png)

Click `Next` in the wizard until you get to the `Remediation` tab. Enable the `Create a remediation task` checkbox to allow Azure to deploy the prerequisites.

[![jv-media-8537-43cdff31ebdf.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/osconfig-baseline-with-windows-server-2025/jv-media-8537-43cdff31ebdf.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/osconfig-baseline-with-windows-server-2025/jv-media-8537-43cdff31ebdf.png)

Click `Next` until you get to the `Managed Identity` tab and also check the option to create a Managed Identity. This is needed for Azure to have the correct permissions and scope to perform the installation of the prerequisites of OSConfig.

[![jv-media-8537-11d17b603aab.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/osconfig-baseline-with-windows-server-2025/jv-media-8537-11d17b603aab.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/osconfig-baseline-with-windows-server-2025/jv-media-8537-11d17b603aab.png)

Then you can finish the wizard to enable the prerequisites policy.

### 2.2 Deploy the Security Baseline in Azure Policy

Now we can deploy the actual policy in Azure Policy. Go back to `Policy` and open `Machine Configuration`. Then click `+ Enable`.

[![jv-media-8537-13c40deb8fe7.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/osconfig-baseline-with-windows-server-2025/jv-media-8537-13c40deb8fe7.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/osconfig-baseline-with-windows-server-2025/jv-media-8537-13c40deb8fe7.png)

Select the subscription to enable Machine Configuration for the subscription.

[![jv-media-8537-02b9d50f0ff5.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/osconfig-baseline-with-windows-server-2025/jv-media-8537-02b9d50f0ff5.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/osconfig-baseline-with-windows-server-2025/jv-media-8537-02b9d50f0ff5.png)

Then enable the `Managed Identity` and select the desired region.

[![jv-media-8537-8916e9db1324.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/osconfig-baseline-with-windows-server-2025/jv-media-8537-8916e9db1324.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/osconfig-baseline-with-windows-server-2025/jv-media-8537-8916e9db1324.png)

Then go back to `Definitions` and search for the correct policy definition to apply the benchmark:

- Windows machines should meet requirements of the Azure compute security baseline

[![jv-media-8537-5186773f45fd.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/osconfig-baseline-with-windows-server-2025/jv-media-8537-5186773f45fd.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/osconfig-baseline-with-windows-server-2025/jv-media-8537-5186773f45fd.png)

From there, click `Assign policy` to assign the policy to our resource group.

[![jv-media-8537-f648e8cc6273.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/osconfig-baseline-with-windows-server-2025/jv-media-8537-f648e8cc6273.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/osconfig-baseline-with-windows-server-2025/jv-media-8537-f648e8cc6273.png)

And select the correct resource group:

[![jv-media-8537-bb15bc98d3be.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/osconfig-baseline-with-windows-server-2025/jv-media-8537-bb15bc98d3be.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/osconfig-baseline-with-windows-server-2025/jv-media-8537-bb15bc98d3be.png)

Then finish the policy assignment. It will become effective within 60 minutes.

If you want to change anything in the baseline, you could modify the baseline in the `Machine Configuration` section:

[![jv-media-8537-d168fab0e892.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/osconfig-baseline-with-windows-server-2025/jv-media-8537-d168fab0e892.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/osconfig-baseline-with-windows-server-2025/jv-media-8537-d168fab0e892.png)

---

## Summary

This guide explained how to use the OSConfig baseline tool in standalone mode and via Azure Policy. OSConfig is a great tool to further secure our Windows Server 2025 installation with some industry-accepted security settings like CIS benchmarks.

OSConfig can be used standalone within minutes or can be configured at scale via Azure Policy.

{{% alert title="Sources 🕮" color="info" %}}
These sources helped me with the writing and research for this post:

1. [https://learn.microsoft.com/en-us/windows-server/security/osconfig/osconfig-overview](https://learn.microsoft.com/en-us/windows-server/security/osconfig/osconfig-overview)
2. [https://learn.microsoft.com/en-us/training/modules/understand-active-directory-security-policies/8-design-deploy-manage-security-settings-at-scale](https://learn.microsoft.com/en-us/training/modules/understand-active-directory-security-policies/8-design-deploy-manage-security-settings-at-scale)
3. [https://learn.microsoft.com/en-us/azure/osconfig/server2025machineconfigdoc](https://learn.microsoft.com/en-us/azure/osconfig/server2025machineconfigdoc)
{{% /alert %}}

{{< ads >}}

{{< article-footer >}}
