---
title: "Session Shadowing with Entra ID on Azure Virtual Desktop"
slug: "shadowing-entra-id-azure-virtual-desktop"
date: 2026-07-23
tags:
- Step by Step Guides
categories:
- Azure Virtual Desktop
description: "In this post, I will be showing how to use Session Shadowing with Azure Virtual Desktop using Microsoft Entra ID only (for example, in the new Kerberos cloud setup). Shadowing is an option we had in the past with Remote Desktop Services, and before that, Terminal Services."
hidden: false
---

We can use Session Shadowing to help a user by taking over their Azure Virtual Desktop session without the use of third-party software. This is disabled by default for security reasons, but in this post, I will show you how to configure Session Shadowing and how we can use it.

Session Shadowing works perfectly fine from an AD-joined management server and an AD-joined Azure Virtual Desktop environment, but I thought about how to bring this to our [Entra ID-only AVD environment](https://justinverstijnen.nl/azure-virtual-desktop-fslogix-and-native-kerberos-authentication/), so we can accelerate our move toward using AVD without any form of legacy AD DS.

In my research, I tested a separate, standalone management server to make this work, but quickly stopped due to the lack of authentication mechanisms, such as Kerberos, and the trusts we have with AD DS. The best and most cost-effective way I got this to work was by running it on the local session host.

In this post, I will describe how I got this to work.

---

## Requirements

- Around 30 minutes of your time
- An Entra ID-only AVD environment like [described in this post](https://justinverstijnen.nl/azure-virtual-desktop-fslogix-and-native-kerberos-authentication/)
- AVD host configuration management with Microsoft Intune

---

## Step 1: Create a security group for users allowed to use Shadowing

We must first create a security group whose members are allowed to use Shadowing. In my case, I have an AVD Admins group that I will use, but you can also be more granular by creating a group specifically for this purpose.

I created a group in Entra ID with all the AVD admins in it. We can use this group for the permissions.

[![jv-media-8523-5c98f26d2864.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/shadowing-entra-id-azure-virtual-desktop/jv-media-8523-5c98f26d2864.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/shadowing-entra-id-azure-virtual-desktop/jv-media-8523-5c98f26d2864.png)

The group can be either assigned or dynamic. It must be a security group, not a Microsoft 365 group.

---

## Step 2: Configure the Session Shadow policy

We must then enable Session Shadowing in the policies of the session hosts. In this policy, you can also specify which shadow permissions are available:

- View only
- View and control
- Whether user permission is required (recommended in organizations where sensitive information is processed)

In Microsoft Intune, we can configure this setting by creating a new policy or using an existing one. Then navigate to the correct folder (or simply search for the setting):

_Administrative Templates - Windows Components - Remote Desktop Services - Remote Desktop Session Hosts - Connections_

Here, select the setting "Set rules for remote control of Remote Desktop Services user sessions":

[![jv-media-8521-896a8b50185e.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/use-shadowing-with-azure-virtual-desktop/jv-media-8521-896a8b50185e.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/use-shadowing-with-azure-virtual-desktop/jv-media-8521-896a8b50185e.png)

Here, we can enable the setting and select which permissions are linked to it. I will choose "Full Control without user's permission" for the demonstration in this guide.

[![jv-media-8521-0cdba2d99df5.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/use-shadowing-with-azure-virtual-desktop/jv-media-8521-0cdba2d99df5.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/use-shadowing-with-azure-virtual-desktop/jv-media-8521-0cdba2d99df5.png)

Save the policy and apply it to the group containing your Azure Virtual Desktop session hosts.

---

## Step 3: Add group membership to the Administrators group

As the hosts are joined to Microsoft Entra, we cannot use an Entra ID group directly for this permission. We need to add the users from an Entra ID group to a local group on the session host so the local group's permissions apply to them. I will use the Administrators group for this because users who can shadow sessions already have relatively high privileges.

In Microsoft Intune, go to "Endpoint security", then to "Account protection", and create a new policy.

[![jv-media-8523-6a06ddd1852a.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/shadowing-entra-id-azure-virtual-desktop/jv-media-8523-6a06ddd1852a.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/shadowing-entra-id-azure-virtual-desktop/jv-media-8523-6a06ddd1852a.png)

Select "Windows" and then "Local user group membership" as the profile. Then give the policy a descriptive name and description.

[![jv-media-8523-774a6a1a3007.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/shadowing-entra-id-azure-virtual-desktop/jv-media-8523-774a6a1a3007.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/shadowing-entra-id-azure-virtual-desktop/jv-media-8523-774a6a1a3007.png)

Then go to the tab "Configuration settings" and copy this configuration:

[![jv-media-8523-4e9841e45b41.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/shadowing-entra-id-azure-virtual-desktop/jv-media-8523-4e9841e45b41.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/shadowing-entra-id-azure-virtual-desktop/jv-media-8523-4e9841e45b41.png)

- Local group: Administrators
- Group and user action: Add (update)
- Selected users/groups: Your AVD admins group

This will add the users in the Entra ID group **JV-SG-U-AVD-Admins** to the local group **Administrators** on the session hosts, making them local administrators and preparing them for step 4: the actual shadow permissions.

Assign the policy to your group containing the AVD session hosts:

[![jv-media-8523-3e47b481c24f.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/shadowing-entra-id-azure-virtual-desktop/jv-media-8523-3e47b481c24f.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/shadowing-entra-id-azure-virtual-desktop/jv-media-8523-3e47b481c24f.png)

Then save the policy to apply it to the session hosts.

---

## Step 4: Execute a script for Shadow permissions

Now we have to give the user group permission to use Shadow on the AVD session hosts. Unfortunately, we do not have a policy for this, so it must be done with a PowerShell script.

The script we need to deploy looks like this:

{{< card code=true header="**PowerShell**" lang="powershell" >}}
$GroupName = "Administrators"
$PermissionPreSet = [uint32]2

Get-CimInstance `
    -Namespace "root\CIMV2\TerminalServices" `
    -ClassName "Win32_TSPermissionsSetting" `
    -Filter "TerminalName LIKE 'RDP-sxs%'" |
Invoke-CimMethod `
    -MethodName "AddAccount" `
    -Arguments @{
        AccountName      = $GroupName
        PermissionPreSet = $PermissionPreSet
    }
{{< /card >}}

Open Microsoft Intune at [https://intune.microsoft.com](https://intune.microsoft.com), go to "Devices" and then "Windows", and click "Scripts and remediations". Here, select the "Platform scripts" tab.

Add a new script here by clicking "+ Add":

[![jv-media-8521-56568b84febc.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/use-shadowing-with-azure-virtual-desktop/jv-media-8521-56568b84febc.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/use-shadowing-with-azure-virtual-desktop/jv-media-8521-56568b84febc.png)

Give the script a name and description, and go to the "Script settings" tab. Then download the ready-to-use script from my GitHub page:

<a class="btn btn-primary" href="https://github.com/JustinVerstijnen/JV-SCR-D-WIN-AVDShadowing/blob/main/JV-SCR-D-WIN-AVDShadowing-EntraID.ps1" target="_blank" rel="noreferrer">View on my GitHub page</a>

Use these script settings:

1. Run this script using the logged on credentials: No
2. Enforce script signature check: No
3. Run script in 64 bit PowerShell Host: Yes

[![jv-media-8521-1e520806bf5b.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/use-shadowing-with-azure-virtual-desktop/jv-media-8521-1e520806bf5b.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/use-shadowing-with-azure-virtual-desktop/jv-media-8521-1e520806bf5b.png)

Assign the script to your AVD Session Hosts group and then save the script to apply it.

[![jv-media-8521-d9d4a271b72b.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/use-shadowing-with-azure-virtual-desktop/jv-media-8521-d9d4a271b72b.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/use-shadowing-with-azure-virtual-desktop/jv-media-8521-d9d4a271b72b.png)

Now the AVD session hosts must be rebooted to apply this script and the other changes we made in Microsoft Intune.

---

## Step 5: Using Shadowing with AVD

Now you can set up a shadow session by logging in with your administrator account through the Windows app or the web client at https://windows.cloud.microsoft

Here, you can log in with your administrator account and then set up a shadow session by running this command:

{{< card code=true header="**cmd**" lang="cmd" >}}
mstsc /v:vm-jv-sh-1 /control /shadow:2 /noconsentprompt
{{< /card >}}

First, we need to know which session ID is assigned to the user we want to take over. This can be done through the Azure Portal:

[![jv-media-8523-8b2ac22388f9.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/shadowing-entra-id-azure-virtual-desktop/jv-media-8523-8b2ac22388f9.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/shadowing-entra-id-azure-virtual-desktop/jv-media-8523-8b2ac22388f9.png)

Or by simply entering this in the same CMD window:

{{< card code=true header="**cmd**" lang="cmd" >}}
qwinsta
{{< /card >}}

[![jv-media-8523-81fb44d0dbeb.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/shadowing-entra-id-azure-virtual-desktop/jv-media-8523-81fb44d0dbeb.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/shadowing-entra-id-azure-virtual-desktop/jv-media-8523-81fb44d0dbeb.png)

The session ID is 2, so we can use it in our command. Run this command from an elevated Command Prompt or PowerShell window:

[![jv-media-8523-af68f2d81ceb.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/shadowing-entra-id-azure-virtual-desktop/jv-media-8523-af68f2d81ceb.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/shadowing-entra-id-azure-virtual-desktop/jv-media-8523-af68f2d81ceb.png)

{{< card code=true header="**cmd**" lang="cmd" >}}
mstsc /v:vm-jv-sh-1 /control /shadow:2 /noconsentprompt
{{< /card >}}

After connecting for a few seconds, we have successfully set up a Shadow session for the user account, and we can control the session and help the user with possible problems.

[![jv-media-8523-901af34fde87.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/shadowing-entra-id-azure-virtual-desktop/jv-media-8523-901af34fde87.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/shadowing-entra-id-azure-virtual-desktop/jv-media-8523-901af34fde87.png)

You can also leave out the /noconsentprompt parameter to ask the user for permission to take over the session. This is what it looks like to the user:

[![jv-media-8523-16d65977da58.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/shadowing-entra-id-azure-virtual-desktop/jv-media-8523-16d65977da58.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/shadowing-entra-id-azure-virtual-desktop/jv-media-8523-16d65977da58.png)

---

## Summary

Using Shadow can help you a lot when assisting users with possible problems in their AVD sessions without using third-party software. You are completely in control of who can control the AVD session hosts and user sessions by assigning users to the group. The great thing is that we have adapted this existing technique for our Entra ID-joined session hosts, so we can still leverage this feature while ditching our old, traditional Active Directory.

I hope we get this option in the Azure Portal in the future, as we can already sign off and message users from the host pool sessions. It would be really nice to have an option there for shadowing, including a requirement for a specific Azure role, which could eliminate the configuration steps described in this post.

Thank you for reading this post, and I hope it was helpful!

### Sources

1. [https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/shadow](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/shadow)
2. [https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/mstsc](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/mstsc)

{{< ads >}}

{{< article-footer >}}