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

---

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
