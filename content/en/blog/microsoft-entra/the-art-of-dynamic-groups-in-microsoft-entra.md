---
title: "The art of Dynamic Groups in Microsoft Entra"
date: 2026-06-01
slug: "the-art-of-dynamic-groups-in-microsoft-entra"
categories:
  - Microsoft Entra
tags:
  - Concepts
description: >
  Dynamic Groups are really great for automating certain things. They are basically like groups like we know them for several years but they...
draft: true
---
Dynamic Groups are really great for automating certain things. They are basically like groups like we know them for several years but they always required some sort of manual action or assignment. Dynamic Groups will help us eliminating this.

I will give some examples how I implemented certain actions in production. I will also share the rules syntaxes which can be used directly into your environment and can be changed to your likings.

---

---

## How to create a Dynamic Group

In Microsoft Entra, you can create a Dynamic Group by heading to "Groups" and then click "+ New group":

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/the-art-of-dynamic-groups-in-microsoft-entra-6315/jv-media-6315-931642b7b77c.png)

Then click on the "Membership type":

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/the-art-of-dynamic-groups-in-microsoft-entra-6315/jv-media-6315-09b9c1a7aebd.png)

Here we can select 3 options:

- **Assigned**: Basically like traditional groups, manual assignment required
- **Dynamic User**: A dynamic group for Users
- **Dynamic Device**: A dynamic group for Devices

{{% alert color="info" %}}
For creating and using Dynamic Groups, you need at least one Microsoft Entra P1 license (included from 365 Business Premium and up).
{{% /alert %}}

---

## Rule syntaxes and membership check

To change the rules of the dynamic group, head to "Dynamic membership rules":

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/the-art-of-dynamic-groups-in-microsoft-entra-6315/jv-media-6315-3eb374bedbfe.png)

Here are 3 rules where a device must comply with to be added to the group:

1. The displayname has to begin with "vm-jv"
2. The device must be a Virtual Machine (rules out any physical device accidentaly being member)
3. The device must be MDM/Intune managed

To check if a device we want to be menber actually is added to the group, we can use the "Validate rules" tool:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/the-art-of-dynamic-groups-in-microsoft-entra-6315/jv-media-6315-458a9412b6ac.png)

This is basically a Yes/No tool where you can add any device (or user) and check the membership:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/the-art-of-dynamic-groups-in-microsoft-entra-6315/jv-media-6315-d758699a9f40.png)

This shows exactly which devices will be meber and which not. You can also click on "View details" to view the rules and appliance:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/the-art-of-dynamic-groups-in-microsoft-entra-6315/jv-media-6315-11faf2cf7d82.png)

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/the-art-of-dynamic-groups-in-microsoft-entra-6315/jv-media-6315-328425176fa5.png)

Really great overview of the rules and why a device will be member of the group.

---

## Option 1: Azure Virtual Desktop hosts

I have done multiple Azure Virtual Desktop implementations that needed a group for all the hosts. This for policies and other settings/scripts and FSLogix settings. Creating a Dynamic Group instead of an assigned group helps you with automation and avoids a manual action when enrolling a new machine and potentially forgetting this step, and then asking yourself why some policies are not applying.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/the-art-of-dynamic-groups-in-microsoft-entra-6315/jv-media-6315-93dcf3da4e8e.png)

This rule syntax is built up in these 3 rules:

1. The displayname has to begin with "vm-jv"
2. The device must be a Virtual Machine (rules out any physical device accidentaly being member)
3. The device must be MDM/Intune managed

### To use it in your environment

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/the-art-of-dynamic-groups-in-microsoft-entra-6315/jv-media-6315-49f8bf9f3e8d.png)

Change the "displayname" property to the starting string of your AVD hosts.

{{< card code=true header="**JSON**" lang="json" >}}
(device.displayName -startsWith "vm-jv") and (device.deviceModel -eq "Virtual Machine") and (device.managementType -eq "MDM")
{{< /card >}}

Above rule syntax can be copied to your group.

---

## Option 2: All enabled internal users (exclude guests and shared mailboxes)

This group will contain all active internal employees. Guests, shared mailboxes and disabled accounts are automatically excluded from this group.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/the-art-of-dynamic-groups-in-microsoft-entra-6315/jv-media-6315-8630745ee211.png)

The rule syntax is built up in these rules:

1. The account must be enabled
2. The User-type must be "Member" (rules out shared mailboxes and guest accounts)

### To use it in your environment

{{< card code=true header="**JSON**" lang="json" >}}
(user.accountEnabled -eq True) and (user.userType -eq "Member")
{{< /card >}}

---

## Option 3: Specific domain name

In some cases, we need to have all accounts ending with a specific domain name in a group. We can do this with the options below:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/the-art-of-dynamic-groups-in-microsoft-entra-6315/jv-media-6315-bece6e554f78.png)

The rule syntax is built up in these rules:

1. The User Principal Name (Username+domain) must end with the domain confgured

### To use it in your environment

{{< card code=true header="**JSON**" lang="json" >}}
(user.userPrincipalName -endsWith "justinverstijnen.nl")
{{< /card >}}

---

## Option 4: Department

We can also do group memberships based on the department of the user. This makes it possible to create different access packages on groups based on te department.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/the-art-of-dynamic-groups-in-microsoft-entra-6315/jv-media-6315-33f8a5e2c9d9.png)

The rule syntax is built up in these rules:

1. Department of the user must be "IT"

### To use it in your environment

{{< card code=true header="**JSON**" lang="json" >}}
(user.department -eq "IT")
{{< /card >}}

---

## Option 5: Synced using Entra Connect

We can also put all synchronized user accounts in a group if they are being synced using Entra Connect Sync.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/the-art-of-dynamic-groups-in-microsoft-entra-6315/jv-media-6315-3c8e19d86c79.png)

The rule syntax is built up in these rules:

1. The dirSyncEnabled flag must be: true

### To use it in your environment

{{< card code=true header="**JSON**" lang="json" >}}
(user.dirSyncEnabled -eq true)
{{< /card >}}

---

## Option 6: Location or branch

We can create rules to only have members from certain locations. We can use different options for this as well:

1. Country
2. Postal code
3. State
4. Street address
5. City
6. Usage location (Country)

I know a case where a company has multiple branches and needed this for security controls and access to certain applications. In this way we could have all users from a specific branch in a group and apply policies and access to the application specific to that branch.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/the-art-of-dynamic-groups-in-microsoft-entra-6315/jv-media-6315-2903771f8da2.png)

### The rule syntax is built up in these rules:

{{< card code=true header="**JSON**" lang="json" >}}
(user.country -eq "Netherlands") and (user.city -eq "Amsterdam") or (user.city -eq "Den Haag")
{{< /card >}}

---

## Option 7: Users time based (EmployeeHireDate)

We can also do group memberships based on the time they are hired. This is the field "Employee Hire Date".

I don't know an actual use case for this but it can be used for time-based group memberships for temporary workers.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/the-art-of-dynamic-groups-in-microsoft-entra-6315/jv-media-6315-26293aefd064.png)

The rule syntax is built up in these rules:

1. User is member if created January 1 2025 or later (greater means later in this context)

### To use it in your environment

{{< card code=true header="**JSON**" lang="json" >}}
(user.employeeHireDate -ge 2025-01-01)
{{< /card >}}

---

## Option 8: Based on OS

We can do memberships based on the OS of the device. In this example, I created a rule set to get Windows devices into a group and only if they have a version equal or higher than configured:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/the-art-of-dynamic-groups-in-microsoft-entra-6315/jv-media-6315-caf6ed4ff092.png)

The rule syntax is built up in these rules:

1. The OS must be Windows
2. The version must be 10.0.26200.7462 or higher

### To use it in your environment

{{< card code=true header="**JSON**" lang="json" >}}
(device.deviceOSType -eq "Windows") and (device.deviceOSVersion -ge "10.0.26200.7462")
{{< /card >}}

---

## Option 9: Device Manufacturer

We can also filter on different device manufacturers to only be member. This is a great addition to the OS. Sometimes, we need to have all Windows devices but want to exclude other devices like Windows based scanners or Teams Rooms devices. In this case we can filter this out.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/the-art-of-dynamic-groups-in-microsoft-entra-6315/jv-media-6315-7fff925f805f.png)

The rule syntax is built up in these rules:

1. Manufacturer must be "Dell"
2. OR Manufacturer must be "HP"

### To use it in your environment

{{< card code=true header="**JSON**" lang="json" >}}
(device.deviceManufacturer -eq "Dell") or (device.deviceManufacturer -eq "HP")
{{< /card >}}

---

## Option 10: User groups based on assigned license (Windows 365)

We can build a dynamic group query based on users' assigned licenses. Instead of the friendly name of a license, we will use the Service Plan ID, which is a GUID:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/the-art-of-dynamic-groups-in-microsoft-entra-6315/jv-media-6315-c114f9603aab.png)

I have done this multiple times for Windows 365 environments, where we want a machine automatically to be deployed when a license is assigned. By default, after assigning a license, you have to assign the user to a group before a machine will deploy (Enrollment profile).

{{% alert color="info" %}}
For more information about this setup, visit: <https://justinverstijnen.nl/dynamic-group-for-access-to-windows-365/>
{{% /alert %}}

Before you can make a query to find your service plans, you need to find the service plan id in your environment, you can find this by following these steps:

### How to find Service Plan ID's in my environment?

Now is the page of Microsoft filled with every single Service Plan ID available which is a mess. You can find all Service Plan ID's in your environment easily with Azure AD Powershell. I will tell you how.

Log into Azure AD with Powershell:

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
Connect-AzureAD
{{< /card >}}

We can find all licenses and referring Service Plan ID's which your environment is subscribed to by using the following command:

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
Get-AzureADSubscribedSku | Select-Object -ExpandProperty ServicePlans
{{< /card >}}

You can also search all Service Plans referring to Windows 365 Cloud PC with the following commands (or different licenses by changing the search string):

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
$searchstring = "*CPC*"
Get-AzureADSubscribedSku | Select-Object -ExpandProperty ServicePlans | Where-Object {$_.ServicePlanName -like $searchstring} | Select-Object ServicePlanId, ServicePlanName
{{< /card >}}

You will get a output like this with the Service Plan ID's you need.

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
ServicePlanId                        ServicePlanName
-------------                        ---------------
3efff3fe-528a-4fc5-b1ba-845802cc764f CPC_2
2de9c682-ca3f-4f2b-b360-dfc4775db133 CPC_E_4C_16GB_128GB​
{{< /card >}}

As you can see, I did this for Windows 365, but you can perform this action with every license available in your environment.

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
(user.assignedPlans -any (assignedPlan.servicePlanId -eq "3efff3fe-528a-4fc5-b1ba-845802cc764f" -and assignedPlan.capabilityStatus -eq "Enabled"))
{{< /card >}}

And you can use multiple licenses by adding -OR rules:

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
(user.assignedPlans -any (assignedPlan.servicePlanId -eq "2de9c682-ca3f-4f2b-b360-dfc4775db133" -and assignedPlan.capabilityStatus -eq "Enabled")) -or (user.assignedPlans -any (assignedPlan.servicePlanId -eq "9ecf691d-8b82-46cb-b254-cd061b2c02fb" -and assignedPlan.capabilityStatus -eq "Enabled"))
{{< /card >}}

---

## Summary

Dynamic Groups are an excellent way to automate some things in your Microsoft Entra tenant. The more we can automate, the better. I also hope I gave you a better idea of how those groups work and how they can increase value to your environment.

Thank you for visiting this website!

### Sources

These sources helped me by writing and research for this post;

- <https://justinverstijnen.nl/dynamic-group-for-access-to-windows-365/>

{{< ads >}}

{{< article-footer >}}
