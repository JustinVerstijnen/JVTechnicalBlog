---
title: "Azure Key Vault"
date: 2024-11-26
slug: "azure-key-vault"
categories:
  - Microsoft Azure
tags:
  - Concepts
description: >
  Azure Key Vault is a type of vault used to store sensitive technical information, such as: Certificates, Secrets and Keys. What sets Azure...
---
Azure Key Vault is a type of vault used to store sensitive technical information, such as:

- Certificates
- Secrets
- Keys

What sets Azure Key Vault apart from a traditional password manager is that it allows software to integrate with the vault. Instead of hardcoding a secret, the software can retrieve it from the vault. Additionally, it is possible to rotate a secret every month, enabling the application to use a different secret each month.

Practical use cases include:

- Storing BitLocker encryption keys for virtual machines
- Storing Azure Disk Encryption keys
- Storing the secret of an Entra ID app registration
- Storing API keys

## How does Azure Key Vault work?

The sensitive information can be retrieved via a unique URL for each entry. This URL is then used in the application code, and the secret is only released if sufficient permissions are granted.

To retrieve information from a Key Vault, a **Managed Identity** is used. This is considered a best practice since it is linked to a resource.

Access to Azure Key Vault can be managed in two ways:

1. **Access Policies**
   - Provides access to a specific category but not individual entries.
2. **RBAC (Recommended Option)**
   - Allows access to be granted at the entry level.

A Managed Identity can also be used in languages like PHP. In this case, you first request an access token, which then provides access to the information in the vault.

There is also a **Premium** option, which ensures that Keys in a Key Vault are stored on a hardware security module (HSM). This allows the use of a higher level of encryption keys and meets certain compliance standards that require this level of security.

{{< ads >}}

{{< article-footer >}}
