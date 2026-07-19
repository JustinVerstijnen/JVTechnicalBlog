---
title: "Session Shadowing with Entra ID on Azure Virtual Desktop"
slug: "shadowing-entra-id-azure-virtual-desktop"
date: 2026-07-23
tags:
- Step by Step Guides
categories:
- Azure Virtual Desktop
description: "In this post, I will be showing how to use Session Shadowing with Azure Virtual Desktop using Microsoft Entra ID only (for example in the new Kerberos cloud setup). Shadowing is a option we had in the past with Remote Desktop Services, and before that Terminal Services."
hidden: false
---

We can use Session Shadowing to help a user by taking over their Azure Virtual Desktop session without the use of 3rd party software. However, this is disabled by default for security reasons, but in this post I will show you how to configure Session Shadowing and how we can use it.

Session Shadowing works perfectly fine from an AD joined management server and AD joined Azure Virtual Desktop environment, but I thought of how to get this to our [Entra ID joined only AVD environment](https://justinverstijnen.nl/azure-virtual-desktop-fslogix-and-native-kerberos-authentication/), so we can accelerate our focus to use AVD without any form of the legacy AD DS anymore.

In my research, I tested with a separate and standalone management server to make this work but quickly stopped due to the missing authentications, like no Kerberos and trusts like we have on AD DS. The best and most cost effective way I got this to work was by using this on the local session host.

In this post I will describe how I got this to work.

---

## Requirements

- Around 30 minutes of your time
- An Entra ID joined only AVD environment like [described in this post](https://justinverstijnen.nl/azure-virtual-desktop-fslogix-and-native-kerberos-authentication/)
- AVD host configuration management with Microsoft Intune

---

## Step 1: Create a security group for allowed Shadow users

We must first create a security group which members of are allowed to use Shadowing. In my case, I have a AVD Admins group which I will use, but you can also be just more granular by creating a group for only this cause.

I created a group in Entra ID with all the AVD admins in it, we can use this group for the permissions.

[![jv-media-8523-5c98f26d2864.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/shadowing-entra-id-azure-virtual-desktop/jv-media-8523-5c98f26d2864.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/shadowing-entra-id-azure-virtual-desktop/jv-media-8523-5c98f26d2864.png)

The group can be either assigned or dynamic. It must be a security group, not a Microsoft 365 group.

---

## Step 2: Configure the Session Shadow policy

We must then enable Session Shadowing in the policies of the session hosts. In this policy you can also state what shadow permissions are available:

- View only
- View and control
- If user permission is required (recommended in organizations where sensitive information is processed)

In Microsoft Intune, we can set this same setting by creating a new policy or to use an existing one. Then navigate to the right folder (or simply search for the setting):

_Administrative Templates - Windows Components - Remote Desktop Services - Remote Desktop Session Hosts - Connections_

Here select the setting "Set rules for remote control of Remote Desktop Services user sessions":

[![jv-media-8521-896a8b50185e.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/use-shadowing-with-azure-virtual-desktop/jv-media-8521-896a8b50185e.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/use-shadowing-with-azure-virtual-desktop/jv-media-8521-896a8b50185e.png)

Here we can enable the setting and which permissions are linked to this. I will choose the Full Control without user's permission here for the demonstration of this guide.

[![jv-media-8521-0cdba2d99df5.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/use-shadowing-with-azure-virtual-desktop/jv-media-8521-0cdba2d99df5.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/use-shadowing-with-azure-virtual-desktop/jv-media-8521-0cdba2d99df5.png)

Save the policy and apply this to the group containing your Azure Virtual Desktop session hosts.

---

## Step 3: Add group membership to Administrators group

As the hosts are joined to Microsoft Entra, we can not use a group directly for this permission. We need to add the users of a Entra ID group to a local group (on the session host) to apply the permissions to the local group. I will use the Administrators group for this, as being able to shadow, you already have relatively high privileges.

In Microsoft Intune, go to "Endpoint security", and then to "Account protection" and create a new policy here.

[![jv-media-8523-6a06ddd1852a.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/shadowing-entra-id-azure-virtual-desktop/jv-media-8523-6a06ddd1852a.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/shadowing-entra-id-azure-virtual-desktop/jv-media-8523-6a06ddd1852a.png)

Select "Windows" and then "Local user group membership" as profile. Then give the policy a descriptive anme and description.

[![jv-media-8523-774a6a1a3007.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/shadowing-entra-id-azure-virtual-desktop/jv-media-8523-774a6a1a3007.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/shadowing-entra-id-azure-virtual-desktop/jv-media-8523-774a6a1a3007.png)

Then go to the tab "Configuration settings" and copy this configuration:

[![jv-media-8523-4e9841e45b41.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/shadowing-entra-id-azure-virtual-desktop/jv-media-8523-4e9841e45b41.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/shadowing-entra-id-azure-virtual-desktop/jv-media-8523-4e9841e45b41.png)

- Local group: Administrators
- Group and user action: Add (update)
- Selected users/groups: Your AVD admins group

This will add the users in the Entra ID group **JV-SG-U-AVD-Admins** to the local group **Administrators** on the session hosts, making us local admin and also to prepare for step 4, the actual shadow permissions.

Assign the policy to your group containins AVD session hosts:

[![jv-media-8523-3e47b481c24f.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/shadowing-entra-id-azure-virtual-desktop/jv-media-8523-3e47b481c24f.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/shadowing-entra-id-azure-virtual-desktop/jv-media-8523-3e47b481c24f.png)

And save the policy to assign them to the session hosts.

---

## Step 4: Execute script for Shadow permissions

Now we have to give the user group permissions to use Shadow on the AVD session hosts. Unfortunately we don't have a policy for this but this has to be done with a PowerShell script.

The script we need to deploy looks like this:

{{< card code=true header="**PowerShell**" lang="powershell" >}}
$groupname = "Administrators" # The name of the group to add
$PermissionPreSet = "2" # Corresponds with the setting numbers in the GUI

(Get-CimInstance -Namespace "root\CIMV2\TerminalServices" -ClassName Win32_TSPermissionsSetting -Filter "TerminalName like 'RDP-sxs%'")
Invoke-CimMethod -MethodName AddAccount -Arguments @{AccountName=$groupname; PermissionPreSet=$PermissionPreSet}
{{< /card >}}

Open up Microsoft Intune on [https://intune.microsoft.com](https://intune.microsoft.com) and head to "Devices", "Windows" and click on "Scripts and remediations". Here select the "Platform scripts" tab.

Add a new script here by clicking "+ Add":

[![jv-media-8521-56568b84febc.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/use-shadowing-with-azure-virtual-desktop/jv-media-8521-56568b84febc.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/use-shadowing-with-azure-virtual-desktop/jv-media-8521-56568b84febc.png)

Give the script a name and description and head to the "Script settings" tab. Then download the ready-to-use script from my GitHub page:

<a class="btn btn-primary" href="https://github.com/JustinVerstijnen/JV-SCR-D-WIN-AVDShadowing/blob/main/JV-SCR-D-WIN-AVDShadowing-EntraID.ps1" target="_blank" rel="noreferrer">View on my GitHub page</a>

Use these script settings:

1. Run this script using the logged on credentials: No
2. Enforce script signature check: No
3. Run script in 64 bit PowerShell Host: Yes

[![jv-media-8521-1e520806bf5b.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/use-shadowing-with-azure-virtual-desktop/jv-media-8521-1e520806bf5b.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/use-shadowing-with-azure-virtual-desktop/jv-media-8521-1e520806bf5b.png)

Assign the script to your AVD Session Hosts group and then save the script to apply it.

[![jv-media-8521-d9d4a271b72b.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/use-shadowing-with-azure-virtual-desktop/jv-media-8521-d9d4a271b72b.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/use-shadowing-with-azure-virtual-desktop/jv-media-8521-d9d4a271b72b.png)

Now the AVD session hosts must now be rebooted to apply this script and the other changes we did in Microsoft Intune.

---

## Step 5: Using Shadowing with AVD

Now you can setup a shadow session by logging your administrator into the WIndows app or by the web client at: https://windows.cloud.microsoft

Here you can login with your administrator account and then we can setup a shadow session by running this command:

{{< card code=true header="**Bash**" lang="bash" >}}
mstsc /v:vm-jv-sh-1 /control /shadow:2 /noconsentprompt
{{< /card >}}

First we need to know which session ID is assigned to the user we want to take over. This can be done through the Azure Portal:

[![jv-media-8523-8b2ac22388f9.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/shadowing-entra-id-azure-virtual-desktop/jv-media-8523-8b2ac22388f9.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/shadowing-entra-id-azure-virtual-desktop/jv-media-8523-8b2ac22388f9.png)

Or by simply typing this into the same CMD window:

{{< card code=true header="**cmd**" lang="cmd" >}}
qwinsta
{{< /card >}}

[![jv-media-8523-81fb44d0dbeb.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/shadowing-entra-id-azure-virtual-desktop/jv-media-8523-81fb44d0dbeb.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/shadowing-entra-id-azure-virtual-desktop/jv-media-8523-81fb44d0dbeb.png)

Session ID is 2, so we can use this into our command. Run this command from a elevated command prompt or PowerShell window:

[![jv-media-8523-af68f2d81ceb.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/shadowing-entra-id-azure-virtual-desktop/jv-media-8523-af68f2d81ceb.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/shadowing-entra-id-azure-virtual-desktop/jv-media-8523-af68f2d81ceb.png)

{{< card code=true header="**cmd**" lang="cmd" >}}
mstsc /v:vm-jv-sh-1 /control /shadow:2 /noconsentprompt
{{< /card >}}

After connecting for a few seconds we have successfully setup a Shadow session to our user account and we can control the session and help the user with possible problems.

[![jv-media-8523-901af34fde87.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/shadowing-entra-id-azure-virtual-desktop/jv-media-8523-901af34fde87.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/shadowing-entra-id-azure-virtual-desktop/jv-media-8523-901af34fde87.png)

You can also leave the /noconsentprompt parameter alone to ask the user permissions for taking over the session. This looks like this for the user:
[![jv-media-8523-16d65977da58.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/shadowing-entra-id-azure-virtual-desktop/jv-media-8523-16d65977da58.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/shadowing-entra-id-azure-virtual-desktop/jv-media-8523-16d65977da58.png)

---

## Summary

Using Shadow can help you a lot when assisting users with possible problems in their AVD sessions without using 3rd party software. You are completely in control who can control those AVD session hosts and sessions with assigning the users to the group. The great thing is, is that we have converted the technique already available to our Entra ID joined session hosts, so we can still leverage this feature while ditching our old and traditional Active Directory.

I hope we get this option in the Azure Portal in the future, as we can already sign off and message users from the host pool sessions. It would be really nice to have a option there for shadowing, including the requirement to have a specific Azure role, which can eliminate the configuration steps needed from this post.

Thank you for reading this post and I hope it was helpful!

### Sources

1. [https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/shadow](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/shadow)
2. [https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/mstsc](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/mstsc)

{{< ads >}}

{{< article-footer >}}