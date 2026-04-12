---
title: "Bulk create Active Directory users with Powershell"
date: 2023-03-20
slug: "bulk-create-active-directory-users-with-powershell"
categories:
  - Powershell
tags:
  - AI Generated Content
  - Step by Step guides
description: >
  This page will share a PowerShell script to create bulk AD users with Powershell. Click here for more information...
---
When it comes to creating users for Active Directory, especially in new implementations, you want to minimize the time needed to create the accounts. This is possible by creating the AD users with Powershell.

---

---

## Requirements

- Minimal knowledge of Powershell
- An Active Directory environment

---

## Full script for creating AD users

Here is the full script including CSV that creates the ad users:

[Show PowerShell script on Github](https://github.com/JustinVerstijnen/BulkCreateADDSUser)

---

## Step 1: Prepare CSV

Fill in the CSV file with all required information.

The script I am using and sharing at this page has the following headings:

{{< card code=true header="**CSV**" lang="text" >}}
firstname,lastname,username,password
{{< /card >}}

This is a very simple and effective manner where the script will base additional information like the emailaddress and proxyaddress attributes on the username.

## Step 2: Change parameters

The script has the domain *justinverstijnen.nl* everywhere in it. This has to be changed at the following lines to your own preference:

- UserPrincipalName
- Path (Distinguished Name of OU)
- EmailAddress
- OtherAttributes

---

## Step 3: Run PowerShell script to create AD users

Download the script file and copy the script and csv file to the same folder on the destination server. After that run the script and it will create the users.

{% alert color="info" %}
Note: If you want to bypass the Powershell Execution Policy in the most effective and secure way possible, use the following command:
{% /alert %}
{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
Set-ExecutionPolicy RemoteSigned -Scope Process
{{< /card >}}

This will allow all scripts to be runned in the Powershell window till it is closed. After closing the window, running scripts will be blocked again till running this command again.

After running this command you can navigate to the folder where the CSV file and PS1 file are located and run the script by using:

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
.\bulk_user.ps1
{{< /card >}}

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
