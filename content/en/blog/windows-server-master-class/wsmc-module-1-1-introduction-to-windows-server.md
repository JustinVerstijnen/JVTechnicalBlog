---
title: "WSMC - Module 1-1: Introduction to Windows Server"
date: 2026-03-04
slug: "wsmc-module-1-1-introduction-to-windows-server"
categories:
  - Windows Server Master Class
tags:
  - Concepts
draft: true
---
---

## Introduction to Windows Server

Windows Server is a networking operating system used to set up a reliable environment for apps, file sharing, or virtualization at home or in a business. It’s basically a Windows version, but then specifically designed for servers (computers that run 24/7).

The biggest difference between Windows 11 and Windows Server 2025 is that we have a Server Manager with the ability to install different roles, which we will dive deeper into in the coming modules.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/WSMC-Module-1-1-Introduction-to-Windows-Server-5721/jv-media-5721-c459f6e05624.png)

This is how Windows Server 2025 looks, with the Server Manager open.

---

## Windows Server 2025 system requirements

The typical Windows Server 2025 requirements, which also count for Windows Server 2022, 2019 and 2016 are at least:

- 1.4 GHz 64-bit CPU
- 2 GB RAM minimum
  - 4 GB or more is highly recommended
- 32 GB SSD-based storage
- Gigabit Networking
- TPM 2.0
- Secure Boot and UEFI capable BIOS
- Support for NX and DEP
- Support for CMPXCHG16b, LAHF/SAHF, and PrefetchW
- Support for Second Level Address Translation (EPT or NPT)

For different workloads, you'll need a different kind of configuration. For a file server for 10 users for example, you need sufficient storage but you don't need that much of CPU and memory power. For a SQL database that servers 250 daily users, you definitely want much more as states above. Always refer to the workloads, and applications you plan to install and make sure you comply with at least their recommended specs. Bad infrastructure is more expensive than good infrastructure.

---

## Windows Server 2025 editions

Windows Server 2025 comes in different editions:

1. Windows Server 2025: Essentials
2. Windows Server 2025: Standard
3. Windows Server 2025: Datacenter
4. Windows Server 2025: Datacenter Azure Edition

These editions are designed for different use cases and have their own unique pricing:

| Edition | Pricing | When to use |
| --- | --- | --- |
| Essentials | $ 499,- | Small organizations (single server, max 25 users and 50 devices) |
| Standard | $ 1.999,- | Small to medium-sized organisations needing multiple servers and more capabilities with limited virtualization |
| Datacenter | $ 3.999,- | Large organisations or data-centers with heavy virtualization / modern infrastructure needs |
| Datacenter: Azure Edition | Consumption-based | Designed for cloud / hybrid-cloud / Azure-optimised deployments ([Microsoft Learn](https://learn.microsoft.com/en-us/windows-server/get-started/azure-edition?utm_source=chatgpt.com)) |

As you can see, planning for the right edition can be key for a new architecture. I also have an overview of the specific differences between the editions:

**Essentials:**

- 1 license for 1 machine
- Includes CALs for 25 users and 50 devices
- Inexpensive, interesting for small environments
- You can run 3rd party applications
- May only be the single Domain Controller and must hold all FSMO roles which makes it a single point of failure
- No “two-way” trusts, so it cannot be used together with other domains
- Includes Storage Migration Services
- System Insights
- No Essentials Experience server role; this is replaced by Windows Admin Center

**Standard:**

- Designed for physical or small virtualized environments.
- Maximum of 2 virtual machines per license in Hyper-V. 3 Standard licenses therefore give you access to 6 virtual machines or 3 physical installations
- Affordable for medium-sized companies.
- Uses CAL model

**Datacenter:**

- Designed for virtualized datacenters and cloud environments.
- Unlimited virtual machines in Hyper-V.
- Much more expensive than Standard or Essentials due to its advanced features.
- The advanced features include, for example, shielded VMs, Storage Replica, Storage Spaces Direct, and Software-Defined Networking.
- Uses CAL model

---

## User and Device CALs for Windows Server

Windows Server knows extra licenses named "Client Access Licenses". These are licenses you have to buy for computers or users which connect to your server. The rule of thumb is to license the least amount (this is the cheapest):

- If you have *more users* than computers, buy **Device CALs**
- If you have *more computers* than users, buy **User CALs**

1. **User CALs** are often the best and cheapest option, because you usually have more devices than employees. For example, if 1 employee uses a laptop, desktop, and tablet (and possibly a phone), you would need to purchase 4 Device CALs. In this case, you only buy 1 User CAL. User CALs cost around 200 euros for 5 CALs.
2. **Device CALs** are interesting if, for example, you have 5 shared PC's and 25 users. Think of this as a shared PC setup. Device CALs cost around 150 euros for 5 CALs.

Some important notes about User/Device CALs

- You have to buy those CALs for Windows Server Standard and Datacenter editions.
- For Azure hosted environments, CALs are included in your consumption costs.
- The Windows Server Essentials edition contains CALs for 25 users and 50 devices at max.
- You don't activate CALs like a Windows license. You just buy CALs and leave them in a physical vault. Sometimes it includes a sticker which you can put on the up side of the server.

---

## Plan for Windows Server 2025

When you plan for a Windows Server 2025 machine, you should always ask yourself the following questions beforehand:

1. **Edition:** Which edition are you going to use and purchase?
2. **Roles and features:** Which roles and features do you need, which third-party programs will run on it, and how high will the machine’s workload be? Will it perhaps become a database server or a web server?
3. **3rd party software:** What 3rd party software is going to run on the server? Do I comply with their recommended specs and configuration?
4. **Physical or virtual:** If you want easy backups, or if you want to clone or migrate a machine easily, it’s best to go virtual. Virtual setups are overall more expensive than physical ones, considering the extra licensing costs and potentially higher hardware costs due to increased requirements.
5. **Installation options:** Are you going for Desktop Experience (GUI) or Server Core? A Server Core theoretically delivers higher performance because it uses fewer resources than the “heavy” desktop variant. You also have a Nano Server option; this is new in Windows Server 2016, but it is harder to set up and not easy to install.

---

## Windows Server 2025 installation options

Windows Server 2025 has the following installation options:

**Desktop Experience (GUI):**
This one is used most often, because it gives you a server with a graphical interface. It is easier to install and manage than a server with only a Command Prompt or PowerShell window. However, this variant uses the most resources on the server.

This, obviously, looks like this:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/WSMC-Module-1-1-Introduction-to-Windows-Server-5721/jv-media-5721-c459f6e05624.png)

**Server Core (CLI):**
You see this one less often. It is a command-line edition of Windows Server. It is harder to install, but after installation it can still be managed with remote tools in a GUI server. The performance of this edition is higher than Desktop Experience because it does not have a GUI and so needs to process a lot less.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/WSMC-Module-1-1-Introduction-to-Windows-Server-5721/jv-media-5721-00823389522a.png)

You see, this definitely needs some planning before deploying.

---

## Physical versus virtualization

A topic that is much determined when installing Windows Server on-premises, is if you go physical or go virtual. Both have their advantages and dis-advantages.

**Physical:**
The performance of a physical environment is often higher than that of a virtual environment because one layer is missing. The security is also somewhat higher. If using a single server, or performance is a thing, go physical.

**Virtual:**
The performance of a virtual environment is slightly lower than a physical one because it runs on top of an additional layer. However, virtualization offers far more flexibility. If you need easy backups, fast deployment, scalability or the ability to run multiple machines on the same hardware, go virtual.

---

## Windows Server 2025 Installation instructions

Here a small guide on how to install Windows Server 2025 on your virtual machine, server or PC. It's mostly the same as Windows 11, or any Windows client software.

Write the ISO to an USB or mount your ISO file downloaded from here: <https://www.microsoft.com/en-us/evalcenter/evaluate-windows-server-2025>

Then boot your device from this ISO/USB device.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/WSMC-Module-1-1-Introduction-to-Windows-Server-5721/jv-media-5721-5b8fc8e2f68d.png)

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/WSMC-Module-1-1-Introduction-to-Windows-Server-5721/jv-media-5721-3ce35a0e7bfe.png)

After some time the installation will boot:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/WSMC-Module-1-1-Introduction-to-Windows-Server-5721/jv-media-5721-2d8310333e76.png)

Select your language and click "Next" twice.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/WSMC-Module-1-1-Introduction-to-Windows-Server-5721/jv-media-5721-47110208391c.png)

Select the default option, select "I agree..and settings" and click "Next".

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/WSMC-Module-1-1-Introduction-to-Windows-Server-5721/jv-media-5721-bf8317560351.png)

Now select the edition and installation option you want, and click "Next". Notice that we have two options per edition: Server Core and Desktop Experience as [we already discussed here](#installation-options).

Then click "Accept".

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/WSMC-Module-1-1-Introduction-to-Windows-Server-5721/jv-media-5721-37357b63eb2c.png)

Select the disk where you want to install Windows and click "Next". Then click "Install".

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/WSMC-Module-1-1-Introduction-to-Windows-Server-5721/jv-media-5721-0a6257563af9.png)

The software will now be installed. After a while, we have to create a password for the local Administrator account:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/WSMC-Module-1-1-Introduction-to-Windows-Server-5721/jv-media-5721-64a6189841f5.png)

After that, our installation is ready and you are ready to follow the Windows Server Master Class!

---

## Summary

This was a first introduction to Windows Server (2025). We have described a lot of information from server specifications till deployment and installation options which can be sound like a lot. But it will fall into place anytime soon.

We also installed Windows Server at the end of the guide, so we are ready to do the rest of the Windows Server Master Class and you can click around.

Next module, I will describe very much everything about the different server roles available for Windows Server and how to install them through the Desktop Experience and PowerShell.

Thank you for reading this post and I hope it was helpful.

{{< ads >}}

{{< article-footer >}}
