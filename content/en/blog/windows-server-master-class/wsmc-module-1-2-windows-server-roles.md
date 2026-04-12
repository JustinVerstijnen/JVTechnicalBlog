---
title: "WSMC \u2013 Module 1-2: Windows Server Roles"
date: 2026-03-09
slug: "wsmc-module-1-2-windows-server-roles"
categories:
  - Microsoft Azure
draft: true
---
---

## Windows Server Roles overview

On Windows Server, we can install some Server Roles. These are pre-defined actions the server can do. Let's look into some of these roles, where I did my best to order them based on usage, in descending order:

|  |  |
| --- | --- |
| **Server Role name** | **What it does** |
| **Active Directory Domain Services (AD DS)** | Provides centralized authentication, authorization, user/computer management, and domain control for Windows networks. |
| **DNS Server** | Resolves hostnames to IP addresses and is essential for Active Directory and nearly all network communication. |
| **File and Storage Services and Distributed File System (DFS)** | Enables file sharing (SMB), storage management, quotas, deduplication, and centralized data access. |
| **Web Server (IIS)** | Hosts websites, web applications, APIs, and services (ASP.NET, PHP, etc.). |
| **Remote Desktop Services (RDS)** | Allows users to remotely access desktops or applications hosted on the server. |
| **DHCP Server** | Automatically assigns IP addresses and network configuration to devices on the network. |
| **Hyper-V** | Provides virtualization, allowing multiple virtual machines to run on a single physical server. |
| **Print and Document Services** | Manages network printers and print queues centrally. |
| **Windows Server Update Services (WSUS)** | Controls and distributes Microsoft updates and patches to servers and client machines. |
| **Network Policy and Access Services (NPS)** | Provides RADIUS authentication, network access policies, and VPN/Wi-Fi authorization. |
| **Microsoft SQL Server** **(non-default)** | Microsoft SQL server is a database solution for running a SQL database on your Windows Server instance, used by several different applications |

For every role, I will give a small overview/tutorial to install the role yourself.

---

## Installing a role via the Server Manager

To install Server Roles on a Windows Server machine, we mostly use the Server Manager as our primary tool. You can also install roles via PowerShell or Windows Admin Center if you are more advanced.

On the Windows Server instance, open the Server Manager if not done already:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/WSMC-–-Module-1-2-Windows-Server-Roles-6342/jv-media-6342-c78d7bdc60a4.png)

In the top right corner, click "Manage" and then "Add Roles and Features":

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/WSMC-–-Module-1-2-Windows-Server-Roles-6342/jv-media-6342-a8a8c1153fe7.png)

You will get a first page, asking you if you have done your basic server configuration tasks:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/WSMC-–-Module-1-2-Windows-Server-Roles-6342/jv-media-6342-6bcd254cf4d9.png)

Click "Next".

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/WSMC-–-Module-1-2-Windows-Server-Roles-6342/jv-media-6342-b40d6fea7f05.png)

Then it asks you if you want to install a role or if you want to install Remote Desktop Services (which is a set of roles, possibly for multiple servers).

In the case of wanting to install a single role that is not Remote Desktop Services, choose the above option.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/WSMC-–-Module-1-2-Windows-Server-Roles-6342/jv-media-6342-83c822fdf47e.png)

Select the server to install the role on. In my case, I only have one server. Poor me.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/WSMC-–-Module-1-2-Windows-Server-Roles-6342/jv-media-6342-f86c91740097.png)

Here you can select what role(s) you want to install. Its basically that easy, select and click Next. Some roles need you to do some configurations which I will dive into for each role itself. On this page, I will explain how to install and configure each role and how to do it with PowerShell for automation (and save yourself some time).

---

## 1: Active Directory (AD DS)

This must be the most used role of Windows Server. Active Directory is a users/computers/group based authentication mechanism where you can facilitate multiple users logging into multiple computers. It also contains some basic management tools like Group Policy to alter the clients configuration. This has been the basic office network for the last 20 years.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/WSMC-–-Module-1-2-Windows-Server-Roles-6342/jv-media-6342-8bc620ad6f9a.png)

### Features of Active Directory

- **Centralized identity management**: Administrators can create and manage user accounts, groups, and computers from one central pane of glass
- **Automatic replication of changes:** Changes one on one domain controller will be replicated seamlessly to other domain controllers in the same domain/forest so all servers have the same set of users, groups and computers
- **Authentication and authorization** provider: It verifies who a user is (authentication) and determines what resources they are allowed to access (authorization). Its also possible to link 3rd party applications to Active Directory
- **Domain management**: Devices and users are organized into domains, which makes it easier to control large networks and create trusts with other domains
- **Group Policy management**: Administrators can apply security and customization settings, software installations, Firewall settings and configuration rules to many computers or users at once through Group Policy
- **Resource organization**: Network resources like printers, shared folders, and servers can be structured and located within the directory and acts as a Database of these resources

### Installation of Active Directory (GUI)

Click here to expand the installation instructions

To install Active Directory, head to the Server Manager and follow the steps to install a role which described earlier.

Select the **Active Directory Domain Services** role from the list. The other roles I will describe furtherly in Chapter 3.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/WSMC-–-Module-1-2-Windows-Server-Roles-6342/jv-media-6342-422d9d7ea961.png)

Click "Next" here and also on the "Select features" and AD DS pages.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/WSMC-–-Module-1-2-Windows-Server-Roles-6342/jv-media-6342-bc3a3bbe16b2.png)

As this is a testing server, I selected the checkmark to directly restart the server when it has to.

The installation will take around 3 minutes, based on your servers' speed.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/WSMC-–-Module-1-2-Windows-Server-Roles-6342/jv-media-6342-7cf2fd0ab8ff.png)

Then we have to promote the server to a domain controller. This means it will be the boss-server of the network and "controls your domain". We also have to configure our domainname here, where we have several options:

- **yourcompany.local** or **corp.yourdomain.com** or **internal.yourdomain.com**-> This is a great seperator between your local and external addresses/UPNs, but extra UPN suffixes and domain links has to be made if using Entra ID. Also your real usernames would be ending with .local instead of external addresses like users' email addresses.
- **yourcompany.com** -> This will ensure Single Sign On and same UPN accounts for Active Directory and Entra ID, but can make your DNS setup a little bit harder. DNS wants to resolve your internal domain, so Split-Brain DNS must be used, which means creating every external DNS record for your domain also internally by hand.

In my case, I will use the internal.justinverstijnen.nl option.

Select the option "Add a new forest" as this is our first domain, and click "Next".

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/WSMC-–-Module-1-2-Windows-Server-Roles-6342/jv-media-6342-dfa8d21703d7.png)

Now select the Forest and Domain functional levels and type in your Directory Services Restore Mode (DSRM) password.

- **Forest** and **Domain** functional levels are the "version" of your Active Directory. The higher the level, the more functionality you have, but older servers can't join and work together with your domain.
- The **DSRM password** is a password you have to type in when using the restore mode. This is basically an recovery mode made for Active Directory, and can be set on every server. It's a local password, and not shared throughout the domain so be aware to secure it in a safe place.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/WSMC-–-Module-1-2-Windows-Server-Roles-6342/jv-media-6342-eebb23cfe7d9.png)

Select your functional levels and fill in your desired password, and click "Next".

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/WSMC-–-Module-1-2-Windows-Server-Roles-6342/jv-media-6342-7726326fdb67.png)

Click "Next" on this page, the notification is by design as I chose a forest name that doesn't exists yet.

On the NetBIOS page, select a NetBIOS name. This is a fallback name (older protocol) and a single label DNS name for your domain. In my case, I chose it to be "JUSTINVERS".

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/WSMC-–-Module-1-2-Windows-Server-Roles-6342/jv-media-6342-f32279113eaf.png)

This name is used in several components in Active Directory. After choosing your name, click "Next".

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/WSMC-–-Module-1-2-Windows-Server-Roles-6342/jv-media-6342-a0a765ad3f7b.png)

For production servers, its recommended to change the AD DS database, SYSVOL and log files to another volume/disk. This for performance and redundancy. In my case, I stick to the default settings.

Now we get a summary of our configuration, and we can finish the wizard. We also can choose "View script" to check out how this could be done with PowerShell.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/WSMC-–-Module-1-2-Windows-Server-Roles-6342/jv-media-6342-dbbc009f2263.png)

After the role is installed, the server must restart, and then our role is installed:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/WSMC-–-Module-1-2-Windows-Server-Roles-6342/jv-media-6342-8bc620ad6f9a.png)

### Installation of Active Directory (PowerShell)

Click here to expand the installation instructions

To install and configure Active Directory on your server using PowerShell, use this code block:

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
Install-WindowsFeature AD-Domain-Services,DNS -IncludeManagementTools

Import-Module ADDSDeployment

$DomainName = "internal.justinverstijnen.nl"
$NetbiosName = "JUSTINVERS"
$SafeModePassword = Read-Host "DSRM password" -AsSecureString

Install-ADDSForest `
  -DomainName $DomainName `
  -DomainNetbiosName $NetbiosName `
  -InstallDNS `
  -SafeModeAdministratorPassword $SafeModePassword `
  -CreateDnsDelegation:$false `
  -DatabasePath "C:\Windows\NTDS" `
  -LogPath "C:\Windows\NTDS" `
  -SysvolPath "C:\Windows\SYSVOL" `
  -Force
{{< /card >}}

Change the parameters between quotes on line 5, 6 and 7 to your own setup. This will install the Active Directory role and creates a simple domain/forest to start using the role.

I started with the first line.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/WSMC-–-Module-1-2-Windows-Server-Roles-6342/jv-media-6342-2b09123be019.png)

Then the rest of the block:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/WSMC-–-Module-1-2-Windows-Server-Roles-6342/jv-media-6342-ec13070209ae.png)

You only need to fill in your desired DSRM password and the rest will be installed and configured automatically:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/WSMC-–-Module-1-2-Windows-Server-Roles-6342/jv-media-6342-f6fa06405f8b.png)

After the restart is done, the role is installed automatically.

---

## 2: Domain Name System (DNS)

DNS (Domain Name System) is a protocol that translates human-readable domain names into IP addresses so computers can locate each other on a network or on the internet. When you visit an website, just like you are doing now, the website is actually located on an IP address. However, remembering all IP addresses for every website is not that efficient. We can see DNS as a phonebook but then for websites and IP addresses.

If we visit the website www.justinverstijnen.nl, we are actually visiting 80.69.67.10. Using a simple tool in Windows, you can find the underlying IP address:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/WSMC-–-Module-1-2-Windows-Server-Roles-6342/jv-media-6342-43ce64a23a79.png)

Domain Name System (DNS) is a role which we can also install on Windows Server. We can then host our own DNS server for our own domain but can also use it alongside Active Directory. Active Directory relies heavily on DNS.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/WSMC-–-Module-1-2-Windows-Server-Roles-6342/jv-media-6342-1dbcd9656158.png)

### Features of DNS

- **Name resolution**: DNS converts a domain name (for example justinverstijnen.nl) into the corresponding IP address (such as 80.69.67.10)
- **Phonebook for the internet**: The system knows exactly where to find a certain website or service
- **Hierarchical structure**: DNS is organized in levels (root, top-level domains like .com, and individual domains)
- **Distributed system**: DNS servers are spread across many locations instead of being stored in one central place
- **Caching**: DNS servers and devices temporarily store results to make future lookups faster

If already having Active Directory, separate installation of DNS Server is not needed on that server.

### Installation of Domain Name System (GUI)

Click here to expand the installation instructions

### Installation of Domain Name System (PowerShell)

Click here to expand the installation instructions

To install the role itself, execute this command:

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
Install-WindowsFeature DNS -IncludeManagementTools
{{< /card >}}
![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/WSMC-–-Module-1-2-Windows-Server-Roles-6342/jv-media-6342-b4b88a2580c0.png)

Now we have to configure the role by configuring a primary domain:

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
$ZoneName = "internal.justinverstijnen.nl"
Add-DnsServerPrimaryZone -Name $ZoneName -ZoneFile "$ZoneName.dns" -DynamicUpdate Secure
{{< /card >}}

Change the domain on line 1 to your own domain.

---

## 3: File and Storage Services and Distributed File System (DFS)

The File and Storage Services is a big role in Windows Server with different subroles including in it. These are all available roles in the File and Storage Services role itself:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/WSMC-–-Module-1-2-Windows-Server-Roles-6342/jv-media-6342-a96a05eca2f4.png)

In this guide, I will only stick to those 3 components as they are the most used roles in real world scenario's:

- DFS Namespaces
- DFS Replication
- File Server Resource Manager

### Installation of File and Storage Services (GUI)

Click here to expand the installation instructions

### Installation of File and Storage Services (PowerShell)

Click here to expand the installation instructions

---

## 4: Internet Information Services (IIS/Web server)

The Internet Information Services (IIS) module in Windows Server is a role to host websites on your Windows Server instance. Think of it as a web engine that:

- Receives website requests from users
- Finds the right files (like HTML, images, scripts)
- Sends them back to the user’s browser

The Internet Information Services management console looks like this:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/WSMC-–-Module-1-2-Windows-Server-Roles-6342/jv-media-6342-b5e3ae891784.png)

The default website of Internet Information Services is this, pretty sure you came across it in the real world:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/WSMC-–-Module-1-2-Windows-Server-Roles-6342/jv-media-6342-ca4c4ca67962.png)

### Installation of Internet Information Services (GUI)

Click here to expand the installation instructions

To install the Internet Information Services role, open up the Server Manager and go to "Manage", and then click "Add roles and Features".

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/WSMC-–-Module-1-2-Windows-Server-Roles-6342/jv-media-6342-e4846c8c5eb8.png)

Then follow the wizard till you got to "Server roles". Select the Web Server (IIS) role here:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/WSMC-–-Module-1-2-Windows-Server-Roles-6342/jv-media-6342-650592c7a589.png)

Then click "Add features" to select the role and included management tools.

Click next for multiple times and click "Install "to finish the wizard and start the installation.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/WSMC-–-Module-1-2-Windows-Server-Roles-6342/jv-media-6342-daeeae6300ba.png)

### Installation of Internet Information Services (PowerShell)

Click here to expand the installation instructions

To install the IIS role using PowerShell, this can be done with one command:

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
Install-WindowsFeature -Name Web-Server -IncludeManagementTools
{{< /card >}}

The role will now be installed on your server:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/WSMC-–-Module-1-2-Windows-Server-Roles-6342/jv-media-6342-2dc7215caeb6.png)

After around 1 minute the role is succesfully installed:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/WSMC-–-Module-1-2-Windows-Server-Roles-6342/jv-media-6342-e7b61dcd9524.png)

---

## 5: Remote Desktop Services (RDS)

---

## 6: DHCP Server

---

## 7: Hyper-V

---

## 8: Print and Document Services

---

## 9: Windows Server Update Services (WSUS)

---

## 10: Network Policy and Access Services (NPS)

---

## 11: Microsoft SQL Server (non-default)

---

## Summary

---

## End of the page 🎉

You have reached the end of the page. You can select a category, share this post on X, LinkedIn and Reddit or return to the blog posts collection page. Thank you for visiting this post.

If you think something is wrong with this post or you want to know more, you can send me a message to one of my social profiles at: <https://justinverstijnen.nl/about/>

[Go back to Blog](https://justinverstijnen.nl/blog/)

If you find this page and blog very useful and you want to leave a donation, you can use the button below to buy me a beer. Thank you in advance and cheers :)

[![](https://img.buymeacoffee.com/button-api/?text=Buy me a beer&emoji=🍺&slug=justinverstijnen&button_colour=FFDD00&font_colour=000000&font_family=Arial&outline_colour=000000&coffee_colour=ffffff)](https://www.buymeacoffee.com/justinverstijnen)

[![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/about-66/jv-media-66-36a3c69c96cb.png)](https://buymeacoffee.com/justinverstijnen)

The [terms and conditions](https://justinverstijnen.nl/terms-conditions/) apply to this post.

Page visitors:
No page-counter data available yet.
