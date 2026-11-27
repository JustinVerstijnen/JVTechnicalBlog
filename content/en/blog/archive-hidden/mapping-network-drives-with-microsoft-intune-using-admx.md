---
title: "Mapping Network Drives with Microsoft Intune using ADMX"
slug: "mapping-network-drives-with-microsoft-intune-using-admx"
date: 2026-12-16
tags:
- Step by Step guides
categories:
- Microsoft Intune
description: "In this post, I will dive into how to map traditional SMB network drives on Windows devices with Microsoft Intune by importing and configuring a custom ADMX policy and how to configure the drives through there."
hidden: false
---

When moving from traditional Active Directory management to Microsoft Intune in combination with Microsoft Entra, there are still some Group Policy configurations that we somehow need to replace. Network drive mappings are a good example, which are not really

In a traditional environment, we would normally configure drive mappings through Group Policy Preferences. On Microsoft Entra joined devices managed with Intune, those Group Policies are no longer available.

Fortunately, Windows supports ADMX-backed policies through MDM. In this post, I will show how we can use a custom Drive Mapping ADMX template to deploy traditional SMB network drives with Microsoft Intune.

---

## How does this work?

ADMX files define Administrative Template policy settings like it was on Active Directory:

- The ADMX file contains the policy definitions
- The ADML file contains the language-specific text displayed to administrators

Intune allows custom ADMX and ADML templates to be imported. Once imported, the settings from the template can be used in an Intune configuration profile and deployed to Windows devices.

For our drive mappings, we can therefore use an ADMX template that defines Windows drive letters and their corresponding UNC paths.

For example:

- H: -> \\jv-file-srv01\home
- P: -> \\jv-file-srv01\projects
- S: -> \\jv-file-srv01\scans

The actual SMB file server must of course still be reachable from the Windows device. Intune is responsible for delivering the configuration, not for providing connectivity to the file server. If you work with Entra joined endpoints, but have SMB shares running on the Active Directory, I would advise you to look into Kerberos Cloud Trust: [https://learn.microsoft.com/en-us/windows/security/identity-protection/hello-for-business/deploy/hybrid-cloud-kerberos-trust?tabs=intune](https://learn.microsoft.com/en-us/windows/security/identity-protection/hello-for-business/deploy/hybrid-cloud-kerberos-trust?tabs=intune)

---

## Requirements

For this configuration, we need:

- About 25 minutes of your time
- Windows devices managed through Microsoft Intune
- Access to the Microsoft Intune admin center at https://intune.microsoft.com
- An account with sufficient permissions to manage configuration policies
- A Drive Mapping ADMX and matching en-US ADML file
- Network and authentication access to the SMB file server
- UNC paths for the shares we want to map

Microsoft currently documents custom ADMX/ADML import in Intune as a Public Preview feature. Microsoft also documents a maximum of 20 imported ADMX files, with each ADMX file limited to 1 MB. Only one ADML file can be uploaded for each ADMX file, and the supported ADML language is en-US.

The Drive Mapping ADMX and ADML used as the basis for this configuration can be downloaded from the Call4Cloud article referenced in the Sources section.

---

## Step 1: Download the Drive Mapping ADMX files

First, download the Drive Mapping template.

The package contains the ADMX policy definition and its accompanying ADML language file. We need both files because Intune imports the policy definition together with its language resources.

Extract the downloaded package before continuing.

You should now have the files required for importing the custom Administrative Template into Intune.

---

## Step 2: Import the ADMX template

Open the [Microsoft Intune admin center](https://intune.microsoft.com).

Navigate to **"Devices" > "Manage devices" > "Configuration"**, open **"Import ADMX"**, and select **"Import"**.

Upload the Drive Mapping `.admx` file and its corresponding `.adml` file.

Wait until the imported template reports that it is available before trying to use it in a policy.

One thing to keep in mind is that custom ADMX files can have dependencies on other ADMX files. Microsoft recommends importing these dependencies first.

You can identify dependencies by opening the ADMX in a text editor and checking the `policyNamespaces` section for `using` entries.

For example:

```xml
<policyNamespaces>
  <target prefix="example" namespace="Example.Policies" />
  <using prefix="windows" namespace="Microsoft.Policies.Windows" />
</policyNamespaces>
```

In this example, the template has a dependency on the Windows namespace. Microsoft specifically notes that some custom templates require `Windows.admx` to be imported first.

---

## Step 3: Create the configuration profile

Once the template has successfully been imported, we can create a configuration profile using its settings.

In the [Microsoft Intune admin center](https://intune.microsoft.com), navigate to **"Devices" > "Manage devices" > "Configuration" > "Create" > "New policy"**.

Configure:

| Setting | Value |
| --- | --- |
| Platform | Windows 10 and later |
| Profile type | Settings catalog |

Select **"Create"** and provide a recognizable name, for example:

```
Windows - Drive Mappings
```

Continue to the configuration settings.

---

## Step 4: Configure the drive mapping

Select **"Add settings"** and locate the settings belonging to the imported Drive Mapping Administrative Template.

Configure the drive letter that you want to deploy and specify its UNC path.

For example:

```
Drive letter: H:
Remote path: \\fileserver\home
```

Additional drive letters can be configured in the same profile:

```
P: -> \\fileserver\projects
S: -> \\fileserver\shared
```

Make sure that the UNC paths are reachable from the devices receiving the configuration. Devices outside the corporate network may therefore require something such as a VPN connection before the mapped drives become usable.

---

## Step 5: Assign the policy

After configuring the required drive mappings, continue to **"Assignments"**.

Assign the policy to the Microsoft Entra ID group containing the users or devices that need the mapped drives.

Finish creating the policy.

Intune will now deliver the configuration to the targeted Windows devices during MDM synchronization.

---

## Step 6: Verify the drive mapping

Once the policy has applied, sign out and sign back into Windows if the drive doesn't appear immediately.

Open File Explorer and select **"This PC"**.

The configured network drive should now be visible with the drive letter that was configured in the Intune policy.

For our example, this would give us something similar to:

```
H: \\fileserver\home
P: \\fileserver\projects
S: \\fileserver\shared
```

Opening one of these drives should connect the user to the corresponding SMB share.

---

## Why use an ADMX instead of a PowerShell script?

You could deploy drive mappings using PowerShell, but using an ADMX-backed policy keeps the configuration inside Intune's policy management model.

ADMX-backed policies allow settings normally represented by Administrative Templates to be exposed through MDM. Windows then processes these policies through the Policy configuration service provider instead of requiring the traditional Group Policy infrastructure.

This fits nicely in environments where Windows devices are Entra joined and Intune managed, but users still depend on traditional file servers during a migration towards cloud storage.

It also makes the drive mappings easier to manage as configuration rather than relying on a script that needs to create the mappings separately.

---

## Summary

Traditional network drives can still be used on Microsoft Entra joined and Intune-managed Windows devices. By importing a custom Drive Mapping ADMX and ADML template into Intune, we can expose drive mapping settings as an Intune configuration policy and assign the required drive letters and UNC paths to our users or devices. This can be especially useful during a transition from traditional Active Directory management to cloud-native endpoint management while SMB file shares are still in use.

In my opinion this is the best scenario to add SMB network drives to your Entra joined endpoints. I have tried multiple setups and concluded that this works te best, at least for my requirements.

Thank you for reading this post and I hope it was helpful!

{{% alert title="Sources 📖" color="info" %}}
These sources helped me by writing and research for this post;

1. https://learn.microsoft.com/en-us/intune/device-configuration/settings-catalog/import-custom-admx-templates
2. https://learn.microsoft.com/en-us/windows/client-management/understanding-admx-backed-policies
{{% /alert %}}

{{< ads >}}

{{< article-footer >}}