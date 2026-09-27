---
title: "I tried the new Windows 365 Developer Configuration image"
date: 2026-10-01
slug: "i-tried-the-new-windows-365-developer-configuration-image"
categories:
  - Azure Virtual Desktop
tags:
  - Try Outs
description: "Microsoft Dev Box is being retired and Microsoft is moving its cloud developer workstation investments towards Windows 365. One of the interesting additions is the Windows 365 Developer Configuration image, which gives developers a ready-to-code Windows 11 Cloud PC including tools such as Visual Studio Code, Git, Python, Node.js, Azure CLI and WSL with Ubuntu. I deployed one myself and in this post I will show you what is included and how you can deploy one."
---

Microsoft has been investing quite a lot in cloud-based workstations over the last few years. For developers, one of these solutions was Microsoft Dev Box. Dev Box gave developers an easy way to create powerful development machines in Azure without having to build everything themselves.

But things changed.

Microsoft Dev Box is now being retired. The closing-down period started on September 14, 2026 and the service is scheduled to retire completely on September 18, 2028. Existing environments can still be used during this period, but Microsoft recommends moving developer workstation scenarios towards Windows 365.

And that makes the new **Windows 365 Developer Configuration image** quite interesting.

Instead of starting with an empty Windows 11 Cloud PC and spending your first hour installing tools, Microsoft now provides an image which already contains a pretty complete developer workstation.

Of course I wanted to try this myself. :)

---

## What is the Windows 365 Developer Configuration image?

The Developer Configuration image is a Windows 11 gallery image for Windows 365 which already contains most of the tools a developer normally installs after receiving a new machine.

Microsoft configured both Windows itself and WSL to give you a ready-to-code environment directly after provisioning the Cloud PC.

Some of the tools currently included are:

- PowerShell 7
- Visual Studio Code
- PowerToys
- Python
- Node.js
- npm
- nvm
- Git
- GitHub CLI
- GitHub Copilot CLI
- Oh My Posh
- Azure CLI
- .NET Runtime
- .NET SDK
- Windows Subsystem for Linux
- Ubuntu in WSL

There are also multiple Visual Studio Code extensions already installed for things such as PowerShell, Python, WSL, GitHub and Edge development.

Microsoft 365 Apps are included as well.

The exact versions can change because Microsoft updates the Windows 365 gallery images regularly.

<!-- Screenshot: Desktop directly after signing in to the new Cloud PC -->

After signing in for the first time the machine already looks much more like a developer workstation instead of a clean Windows installation.

---

## Microsoft Dev Box versus Windows 365

Before deploying the machine, it is important to understand that Windows 365 isn't simply Dev Box with a different name.

With Microsoft Dev Box we had concepts such as Dev Centers, Projects, Pools and Dev Box definitions. Developers could also create their own machines from the developer portal.

Windows 365 works differently.

The administrator configures a provisioning policy containing the image, network configuration and assignments. Windows 365 then provisions the Cloud PC for the developer before they start using it. Developers connect to their machine using Windows App or the browser.

So instead of:

**Dev Center > Project > Pool > Developer creates Dev Box**

We now have something more like:

**Windows 365 provisioning policy > User group > Cloud PC gets provisioned**

Personally I think this also makes the direction Microsoft is taking quite clear. Instead of maintaining a separate platform specifically for developer workstations, these scenarios are moving towards the existing Windows 365 platform.

---

## Deploying the Developer Configuration Cloud PC

One thing which can be slightly confusing is where we configure this.

Although the actual compute behind Windows 365 obviously runs in Microsoft Azure, we aren't deploying a normal virtual machine from the Azure Portal.

The Cloud PC is provisioned from **Microsoft Intune** using a Windows 365 provisioning policy.

Open the Microsoft Intune admin center and navigate to:

**Devices > Provision Cloud PCs > Provisioning policies**

From here, select **Create policy**.

<!-- Screenshot: Windows 365 Provisioning policies page with Create policy highlighted -->

On the General page we can configure the basic settings for our Cloud PC.

Give the provisioning policy a useful name and select the Windows 365 license type you want to use.

For this example I am using Windows 365 Enterprise.

<!-- Screenshot: General page of the provisioning policy -->

Configure the network and region according to your environment.

You can use a Microsoft hosted network or an Azure Network Connection depending on how your Windows 365 environment is configured.

After configuring everything, advance to the Image page.

---

## Selecting the Developer Configuration image

This is where things become interesting.

For **Image type**, select:

**Gallery image**

Click **Select** and search through the available Windows 365 images.

Here we can select the image containing the **Developer Configuration with Microsoft 365 Apps**.

<!-- Screenshot: Gallery image selection showing Developer Configuration -->

Select the image and continue.

This image is currently available for Windows 365 Enterprise and Windows 365 Flex Dedicated mode. Microsoft also notes that the image isn't supported on 2 vCPU or GPU licenses because the configuration requires nested virtualization.

So make sure you select a supported Cloud PC configuration.

---

## Configuring and assigning the Cloud PC

The remaining provisioning policy configuration is basically the same as a normal Windows 365 deployment.

Select your required language and region.

You can optionally configure a device naming template and scope tags.

<!-- Screenshot: Configuration page -->

After this, assign the provisioning policy to the Microsoft Entra ID group containing your developers.

<!-- Screenshot: Assignment page with developer group -->

Review the configuration and create the provisioning policy.

Windows 365 will now automatically start provisioning Cloud PCs for users that meet the licensing and assignment requirements.

<!-- Screenshot: Provisioning policy successfully created -->

Now we wait for our Cloud PC to become available.

---

## Connecting to the machine

After provisioning completed, my new Cloud PC appeared and I could connect to it just like any other Windows 365 machine.

Developers can use Windows App to access their Cloud PC.

<!-- Screenshot: Developer Cloud PC visible in Windows App -->

After connecting, we finally get to see what Microsoft actually prepared for us.

---

## Looking at the developer tools

The first thing I noticed is that quite a lot has already been configured.

Visual Studio Code is installed and already contains several useful extensions.

<!-- Screenshot: Visual Studio Code with installed extensions -->

PowerShell 7 is installed as well:

<!-- Screenshot: PowerShell 7 showing $PSVersionTable -->

Git and GitHub CLI are available:

<!-- Screenshot: git --version and gh --version -->

And the same goes for tools such as Node.js, npm, Python, Azure CLI and the .NET SDK.

<!-- Screenshot: Terminal showing node --version, npm --version, python --version, az --version and dotnet --version -->

This is exactly the kind of stuff I would normally install immediately after receiving a new development machine.

Having all of this available immediately definitely saves some time.

---

## Windows Subsystem for Linux

One of the more interesting parts of this image is WSL.

The Developer Configuration image doesn't only install WSL, but also deploys Ubuntu and configures development tooling inside the Linux environment.

We can verify this by running:

```powershell
wsl --list --verbose
```

<!-- Screenshot: wsl --list --verbose showing Ubuntu -->

Opening Ubuntu gives us a Linux environment directly inside our Windows 365 Cloud PC.

<!-- Screenshot: Ubuntu terminal inside WSL -->

For developers working with both Windows and Linux tooling, this makes the machine much more useful directly after provisioning.

---

## Something to keep in mind

There is one thing I think is important before deploying this image everywhere.

Microsoft includes quite a few third-party development tools inside the image, but you are still responsible for maintaining these applications.

Microsoft specifically mentions that the preinstalled third-party applications aren't currently manageable through Intune as individually packaged applications.

If your organization requires full application lifecycle management through Intune, Microsoft recommends removing the preinstalled versions and deploying those applications yourself through Intune.

The Windows 365 gallery images themselves are updated monthly. Newly provisioned Cloud PCs use the latest image, while existing Cloud PCs don't automatically get replaced with the newer base image. Reprovisioning is required when you specifically want the newest gallery image applied to an existing Cloud PC.

Something worth keeping in mind when using this in a managed enterprise environment.

---

## Is this the replacement for Microsoft Dev Box?

For me this is probably the most interesting question.

Microsoft itself describes Windows 365 as the recommended path forward for virtualized developer environments after Dev Box. The Developer Configuration image is clearly an important part of that strategy.

It isn't a one-to-one replacement though.

Dev Box was really focused around developers creating development environments themselves from projects and pools.

Windows 365 is much more IT-managed. We create the provisioning policies, determine the image, configure the network, assign the licenses and the developer receives their Cloud PC.

But if the requirement simply is:

*"Give my developers a powerful Windows development workstation in the cloud which is ready to use."*

Windows 365 combined with this Developer Configuration image comes pretty close.

And because Windows 365 already integrates with Intune, Microsoft Entra ID, Conditional Access and the rest of the Microsoft 365 management stack, I can understand why Microsoft decided to move in this direction.

---

## Summary

I really like the idea behind this image.

Deploying a normal Windows 365 Cloud PC and installing all developer tooling afterwards isn't difficult, but every step you can remove from the onboarding process helps.

With this image you receive a Windows 11 machine with Visual Studio Code, Git, Python, Node.js, Azure CLI, PowerShell 7, .NET and a configured WSL Ubuntu environment directly after provisioning.

That is quite a good starting point.

Microsoft Dev Box isn't disappearing overnight, but its direction is clear. The service is being retired and Microsoft's investments in virtual developer workstations are moving towards Windows 365.

For organizations already using Windows 365, the Developer Configuration image makes this transition even more interesting.

And for me?

I will definitely keep this machine around for some more testing. :)

{{% alert title="Sources 📖" color="info" %}}
These sources helped me by writing and research for this post;

1. https://learn.microsoft.com/en-us/windows-365/enterprise/device-images
2. https://learn.microsoft.com/en-us/windows-365/enterprise/create-provisioning-policy
3. https://learn.microsoft.com/en-us/windows-365/enterprise/devbox-transition-to-w365
4. https://learn.microsoft.com/en-us/azure/dev-box/dev-box-roadmap
5. https://blogs.windows.com/windowsdeveloper/2026/09/14/build-anywhere-stay-in-flow-with-windows-365/
{{% /alert %}}

{{< ads >}}

{{< article-footer >}}