---
title: "Match AD users using Entra Connect Sync and MSGraph"
date: 2025-08-18
slug: "match-active-directory-users-with-microsoft-365-using-entra-connect-sync-hard-match"
categories:
  - Microsoft Entra
tags:
  - Step by Step guides
description: >
  Sometimes, it is necessary to match an existing local Active Directory (AD) user through Entra Connect with an existing Entra ID user...
---
Sometimes, it is necessary to match an existing local Active Directory (AD) user through Entra Connect with an existing Entra ID user (formerly known as Azure AD). This process ensures that the account in both environments is aligned and maintains the same underlying configurations and settings across systems.

![Entra Connect sync](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/match-active-directory-users-with-microsoft-365-using-entra-connect-sync-hard-match-813/jv-media-813-da1d8fd6db71.png)

---

---

## What is soft-matching?

Most of the time the system itself will match the users automatically using soft-matching. Here the service will be matching users in both Entra ID and Active Directory by using known attributes like UserPrincipalName and ProxyAddresses.

## What is hard-matching?

In some cases, especially when you use different Active Directory and Entra ID domains, we need to give the final tip to match the users. We will tell Entra ID what the GUID of the on-premises user is by getting that value and encode it into Base64. Then we pass Entra ID this value so it understands what local user to link with what cloud user. This process is called "hard-matching".

---

## The process described

The steps to hard-match an Entra ID and Active Directory user are in short:

1. Determine the local and cloud user you want to match
2. On the on-premises Active Directory, run the command "Get-ADUser \*username\*"
3. Copy the GUID value
4. Run the command "[Convert]::ToBase64String([guid]::New("\*GUID\*").ToByteArray())" with \*GUID\* replaced by the GUID from step 3
5. Copy the Base64 value
6. Connect to Microsoft 365 by using "Connect-MSOLService"
7. Run the command "Set-MsolUser -UserPrincipalName user@domain.com -ImmutableId \*BASE64\*
8. Run a Entra Connect Sync

---

## Step 1: Fetching Active Directory GUID

To merge an existing on-premises user and an existing cloud user into one unified user account under the hood, follow these steps:

- Log in to your Active Directory management server

- Open **PowerShell**.

- Execute the following command:

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
Get-ADUser -Identity *username*
{{< /card >}}

Replace \*username\* by the username of the user you want to match.

The output of the command above will be something like this:

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
DistinguishedName : CN=administrator,OU=Users,DC=justinverstijnen,DC=nl
Enabled           : True
GivenName         : Administrator
Name              : administrator
ObjectClass       : user
ObjectGUID        : c97a6c98-ded8-472c-bfb6-87ed37d324f5
SamAccountName    : administrator
SID               : S-1-5-21-1534517208-3616448293-1356502261-1244
Surname           : Administrator
UserPrincipalName : administrator@justinverstijnen.nl
{{< /card >}}

Copy the value of the ObjectGUID, in this case:

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
c97a6c98-ded8-472c-bfb6-87ed37d324f5
{{< /card >}}

Because Active Directory uses GUID for a unique identifier of the user and Entra ID uses a Base64 value for a unique identifier, we need to convert the GUID string to a Base64 string. We can do this very easy with Powershell too:

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
[Convert]::ToBase64String([guid]::New("c97a6c98-ded8-472c-bfb6-87ed37d324f5").ToByteArray())
{{< /card >}}

We get a value like this:

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
mGx6ydjeLEe/toftN9Mk9Q==
{{< /card >}}

Now we have the identifier Entra ID needs. We change the ID of the cloud user to this value. This way the system knows which on-premises user to sync with which cloud user.

---

## Step 2: Logging into Entra ID with Microsoft Graph

To actually match the users, we need to login to Microsoft Graph in PowerShell, as we can there perform the actions. For installation instructions of the Microsoft Graph PowerShell module: <https://www.powershellgallery.com/packages/Microsoft.Graph/2.24.0>

Run the following command to login to Microsoft Entra ID with Microsoft Graph:

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
Connect-MgGraph -Scopes "User.ReadWrite.All"
{{< /card >}}

Login with your Microsoft Entra ID administrator account.

---

## Step 3: Set the new Immutable ID in Microsoft Entra

After succesfully logging into Microsoft Graph, run the command to set a (new) Immutable ID for your cloud user:

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
Update-MgUser -UserId "administrator@justinverstijnen.nl" -OnPremisesImmutableId "mGx6ydjeLEe/toftN9Mk9Q=="
{{< /card >}}

Now the user is hard matched. You need to run a Entra Connect synchronization to finish the process.

Log in to the server with AD Connect/Entra Connect sync installed and run the command:

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
Start-ADSyncSyncCycle -PolicyType Delta
{{< /card >}}

Now your on-premises user and cloud user have been matched!

---

## Summary

Hardmatching users is relatively easy, but requires some steps that are good to know. After doing this around 3 times you will perform this completely on "auto-pilot".

### Sources

These sources helped me by writing and research for this post;

1. <https://www.powershellgallery.com/packages/Microsoft.Graph/2.24.0>

{{< ads >}}

{{< article-footer >}}
