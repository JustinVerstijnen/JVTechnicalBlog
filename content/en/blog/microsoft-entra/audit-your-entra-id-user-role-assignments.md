---
title: "Audit your Entra ID user role assignments"
date: 2025-07-01
slug: "audit-your-entra-id-user-role-assignments"
categories:
  - Microsoft Entra
tags:
  - Tools and Scripts
description: >
  Today I have a relatively short blog post. I have created a script that exports all Entra ID user role assignments with Microsoft Graph.
---
Today I have a relatively short blog post. I have created a script that exports all Entra ID user role assignments with Microsoft Graph. This can come in handy when auditing your users, but then realizing the portals doesn't always show you the information in the most efficient way.

Therefore, I have created a script that only gets all Entra ID role assignments to users of every role and exports it to a nice and readable CSV file.

---

---

## Requirements

- Microsoft Graph PowerShell module
- Entra P2 or Governance license for PIM
  - *Only required for fetching PIM specific data. Script can run without licenses.*

---

## Entra ID User role assignments script

To start off with the fast pass, my script can be downloaded here from my Github page:

[Download script from Github](https://github.com/JustinVerstijnen/JV-EntraIDGetAssignedRoles)

---

## Using the Entra ID User role assignments script

I have already downloaded the script, and have it ready to execute:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/audit-your-entra-id-user-role-assignments-3495/jv-media-3495-bdde85acb7c6.png)

When executed, it asks to login to a tenant. Here you have to login to the tenant you want to audit. After that it will be performing the checks. This can take a while with several users and role assignments.

{{% alert color="info" %}}
When prompted that the Execution Policy is restricted, you can use this command for a one-time bypass (till the window closes):

PowerShell

```powershell
Set-ExecutionPolicy Unrestricted -Scope Process
```
{{% /alert %}}

After the script finishes all the checks, it puts out a CSV file in the same folder as the script which we can now open to review all the Entra ID user role assignments:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/audit-your-entra-id-user-role-assignments-3495/jv-media-3495-9f1098440589.png)

As you can see, this shows crystal clear what users and assigned roles this environment has.

### Using the script without PIM licenses

If your environment doesn't have any licenses for Privileged Identity Management (PIM), we can still use the script, but an error will be printed in the processing of the script:

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
⚠️  Eligible (PIM) role assignments could not be retrieved.
Microsoft Entra ID P2 or Governance license is required. Script will continue to fetch the rest...
{{< /card >}}

---

## Summary

This very short blog post shows the capabilities of this users script. In my opnion, the GUI shows most of the information, but is not particularly good at summarizing information from multiple pages. Powershell is, as we can get information from everywhere and put it in one single file.

### Sources

These sources helped me by writing and research for this post;

1. <https://learn.microsoft.com/en-us/entra/identity/role-based-access-control/permissions-reference>

I hope my script is useful and thank you for reading.

{{< ads >}}

{{< article-footer >}}
