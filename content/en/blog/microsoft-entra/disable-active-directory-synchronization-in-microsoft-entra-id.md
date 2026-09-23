---
title: "Disable Active Directory synchronization in Microsoft Entra ID (company-wide)"
slug: "disable-active-directory-synchronization-in-microsoft-entra-id"
date: 2024-09-23
tags:
- Step by Step guides
categories:
- Microsoft Entra
description: "This guide describes on how to disable Entra ID synchronization company-wide without the need of restoring users from the recycle bin. Therefore instructing you further on how to phase out Entra Connect Sync."
---

## The process described

The correct way to disable Active Directory synchronization with Microsoft Entra ID is to follow the steps in the Microsoft article on how to uninstall Microsoft Entra Connect Sync. We will disable the Synchronization on the Microsoft Entra ID side, which prevents any users from being moved to the recycle bin. After all these steps described, the software can be removed from your server.

If your on-premises AD environment is offline or unreachable then you cannot do the uninstallation of the server. In that case, you can disable the sync setting only in Microsoft Entra ID forcing this process. We are assuming that the server won't be online again in this case.

---

## Step 1. Install and Connect with Microsoft Graph

We first need to install the Microsoft Graph PowerShell module, if you don't already have it installed. Let's open up PowerShell on your computer and run the command below:

{{< card code=true header="**PowerShell**" lang="powershell" >}}
Install-Module Microsoft.Graph -Force
{{< /card >}}

If you already have [this module](https://www.powershellgallery.com/packages/Microsoft.Graph) installed, you can skip this step. Let's connect to Microsoft Graph PowerShell using the required scopes, which are the permissions you request:

{{< card code=true header="**PowerShell**" lang="powershell" >}}
Connect-MgGraph -Scopes "Organization.ReadWrite.All"
{{< /card >}}

If being asked to grant consent to the Microsoft Graph Command Line Tools, grant this as we need those permissions to execute the actions after this.

[![jv-media-8505-ae89186942fb.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/disable-active-directory-synchronization-in-microsoft-entra-id/jv-media-8505-ae89186942fb.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/disable-active-directory-synchronization-in-microsoft-entra-id/jv-media-8505-ae89186942fb.png)

After this has been completed, check if you are logged in correctly by using this command:

{{< card code=true header="**PowerShell**" lang="powershell" >}}
Get-MgContext
{{< /card >}}

This should result in a list of details of your account and sign-in:

[![jv-media-8505-546b0d6e704c.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/disable-active-directory-synchronization-in-microsoft-entra-id/jv-media-8505-546b0d6e704c.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/disable-active-directory-synchronization-in-microsoft-entra-id/jv-media-8505-546b0d6e704c.png)

We are now ready to perform the further steps. If this doesnt show a list similar to the list above, then you are not logged in or the PowerShell module is not installed correctly.

---

## Step 2. Check current on-premises sync status

Now we are logged in to Microsoft Graph, let's check the current status of the sync in Microsoft Entra ID:

{{< card code=true header="**PowerShell**" lang="powershell" >}}
Get-MgOrganization | Select-Object DisplayName, OnPremisesSyncEnabled
{{< /card >}}

This results in a list of your tenants with the actual sync status:

[![jv-media-8505-c6bfc31914cb.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/disable-active-directory-synchronization-in-microsoft-entra-id/jv-media-8505-c6bfc31914cb.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/disable-active-directory-synchronization-in-microsoft-entra-id/jv-media-8505-c6bfc31914cb.png)

If this list shows a "Yes" or "Enabled" at the OnPremisesSyncEnabled coloumn, then synchronization is enabled. In my case, Entra Connect Sync is already disabled.

---

## Step 3. Disable on-premises directory synchronization

Now we can disable the on-premises ADSync with this simple script below. Copy and run these commands to disable the synchronization.

{{< card code=true header="**PowerShell**" lang="powershell" >}}
$OrganizationID = (Get-MgOrganization).Id
$param = @{onPremisesSyncEnabled = $false}
Update-MgOrganization -OrganizationId $OrganizationID -BodyParameter $param
{{< /card >}}

This gives not any output as the execution was succesful. You can now check the status again just like in the previous steps:

[![jv-media-8505-d8d3b30e0ebe.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/disable-active-directory-synchronization-in-microsoft-entra-id/jv-media-8505-d8d3b30e0ebe.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/disable-active-directory-synchronization-in-microsoft-entra-id/jv-media-8505-d8d3b30e0ebe.png)

{{< card code=true header="**PowerShell**" lang="powershell" >}}
Get-MgOrganization | Select-Object DisplayName, OnPremisesSyncEnabled
{{< /card >}}

{{% alert title="Be aware" color="success" %}}
- Disabling the synchronization can take up to 72 hours to complete
- Wait for the process to fully complete before performing any other organization wide action
- Once the disable process has started, it cannot be canceled so use it with care
{{% /alert %}}

After that we can also check the status in the Microsoft 365 Admin center and Entra ID Admin center. Make sure to check it on a subset of users which had synchronization enabled before:

**Microsoft 365 Admin Center:**

[![jv-media-8505-4d13db7668f9.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/disable-active-directory-synchronization-in-microsoft-entra-id/jv-media-8505-4d13db7668f9.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/disable-active-directory-synchronization-in-microsoft-entra-id/jv-media-8505-4d13db7668f9.png)

Make sure to enable the Sync status column:

[![jv-media-8505-bda435c25a4a.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/disable-active-directory-synchronization-in-microsoft-entra-id/jv-media-8505-bda435c25a4a.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/disable-active-directory-synchronization-in-microsoft-entra-id/jv-media-8505-bda435c25a4a.png)

**Entra ID Admin Center:**

[![jv-media-8505-813185244b50.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/disable-active-directory-synchronization-in-microsoft-entra-id/jv-media-8505-813185244b50.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/disable-active-directory-synchronization-in-microsoft-entra-id/jv-media-8505-813185244b50.png)

This shows the user is now a full cloud-only user, which makes the disable action a success. You can now remove the Entra Connect Sync application from your servers as no further action is needed there. Re-enable the synchronization needs consent from a Global Administrator account.

---

## Summary

In this post, I showed how to disable Active Directory synchronization in Microsoft Entra ID which can be used to phase this synchronization out and fully leverage all features of Entra ID. This action prevents any users from getting moved to the recycle bin which is also nice. If we were to disable the synchronization of the users in AD first, then all users will be moved to the recycle bin in the cloud, and needing manual action to recover them.

Thank you for reading this post and I hope it was helpful!

{{% alert title="Sources 🕮" color="info" %}}
These sources helped me by writing and research for this post;
1. https://learn.microsoft.com/entra/identity/hybrid/connect/how-to-uninstall-entra-connect
2. https://learn.microsoft.com/powershell/module/microsoft.graph.identity.directorymanagement/update-mgorganization
{{% /alert %}}

{{< ads >}}

{{< article-footer >}}