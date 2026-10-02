---
title: "Group Policy Central Store and Active Directory"
slug: "gpo-central-store-and-active-directory"
date: 2025-10-17
tags:
- Step by Step guides
categories:
- Windows Server
description: "In this guide, I will show how to create a Group Policy Central Store inside SYSVOL, how ADMX and ADML files work, and how to add new Administrative Templates to your Active Directory environment."
hidden: false
---

## Group Policy Central Store described

When you manage Group Policies in an Active Directory environment, big chance you use the Administrative Templates quite often. These templates contain the policy settings which you can configure for Windows, Microsoft products, and many third-party applications like FSLogix and Google Chrome. 

By default, Group Policy Management can use the Administrative Template files which are installed locally on the computer where you edit your Group Policies. This works, but can become confusing when multiple administrators or management servers are being used. One administrator could have newer or different sets of Administrative Templates installed than another admin. This is where the `Group Policy Central Store` comes in.

The Central Store is a shared location inside the `SYSVOL` folder of your Active Directory domain where we can centrally store our `.admx` and `.adml` files. All servers and clients can then fetch the configured policies from there ,because SYSVOL is shared and replicated between the Domain Controllers, the same Administrative Templates can then be used when editing Group Policies throughout the domain. The replication of these files work with Distributed File System (DFS).

In this guide, we will create one central location from where our Administrative Templates can be managed. This is crucial if having multiple domain controllers and/or management servers.

---

## ADMX and ADML files described

Before creating the Central Store, it is useful to understand the two different file types we are going to work with.

- **ADMX file:** contains the actual policy definition, which describes things like the policy category, supported operating systems, registry locations, and which settings can be configured
- **ADML file:** contains the language-specific text belonging to the ADMX file. This includes the policy names, descriptions, help texts, and other information you see inside the Group Policy Management Editor

For example:

{{< card code=true header="**Plain text**" lang="text" >}}
PolicyDefinitions
│
├── WindowsUpdate.admx
├── TerminalServer.admx
├── WindowsDefender.admx
│
└── en-US
    ├── WindowsUpdate.adml
    ├── TerminalServer.adml
    └── WindowsDefender.adml
{{< /card >}}

It is important that the ADMX and ADML files belong together. Copying a new ADMX file without the matching language file can result in errors or missing descriptions inside Group Policy Management.

---

## Requirements

- Around 20 minutes of your time
- An Active Directory domain
- Access to a Domain Controller
- Permissions to modify the SYSVOL Policies folder
- Group Policy Management Console
- A Windows 10 or Windows 11 computer with the Administrative Templates you want to use
- Basic knowledge of Active Directory and Group Policy

For this guide, I will use my Active Directory domain:

{{< card code=true header="**Plain text**" lang="text" >}}
internal.justinverstijnen.nl
{{< /card >}}

You will need to replace this with your own Active Directory domain name when following this guide in your own environment.

---

## Step 1: Checking if a Central Store already exists

Before we start to create anything, we should first check if the domain already has a Central Store. Open File Explorer on your Domain Controller or management computer and browse to:

{{< card code=true header="**Plain text**" lang="text" >}}
\\<yourdomain>\SYSVOL\<yourdomain>\Policies
{{< /card >}}

For my domain this is:

{{< card code=true header="**Plain text**" lang="text" >}}
\\internal.justinverstijnen.nl\SYSVOL\internal.justinverstijnen.nl\Policies
{{< /card >}}

[![jv-media-7252-688112abfa21.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/gpo-central-store-and-active-directory/jv-media-7252-688112abfa21.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/gpo-central-store-and-active-directory/jv-media-7252-688112abfa21.png)

Inside the `Policies` folder, check if there is already a folder named `PolicyDefinitions`.

If the `PolicyDefinitions` folder already exists, your environment already has a Central Store. Do not create another `PolicyDefinitions` folder in that case. First check the existing files and make a backup before changing anything.

If there is no `PolicyDefinitions` folder yet, we can continue and create our new Central Store by following the steps below.

You could also check the location of the current Group Policy store in the Group Policy Management Console:

[![jv-media-7252-e5b61f1a31ca.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/gpo-central-store-and-active-directory/jv-media-7252-e5b61f1a31ca.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/gpo-central-store-and-active-directory/jv-media-7252-e5b61f1a31ca.png)

---

## Step 2: Moving the current Policy store

Let's move our store to the shared domain location. In your domain, you should have a server where you manage the group policies. This will be your management server or (single) domain controller.

Go to the folder `C:\Windows` on that server and on that location we have a folder called `PolicyDefinitions`.

[![jv-media-7252-a767b51e7eff.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/gpo-central-store-and-active-directory/jv-media-7252-a767b51e7eff.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/gpo-central-store-and-active-directory/jv-media-7252-a767b51e7eff.png)

We will copy this folder `PolicyDefinitions` to the following location:

[![jv-media-7252-ed92b4cd9f41.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/gpo-central-store-and-active-directory/jv-media-7252-ed92b4cd9f41.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/gpo-central-store-and-active-directory/jv-media-7252-ed92b4cd9f41.png)

Click `Copy`. Then navigate back to your SYSVOL folder:

{{< card code=true header="**Plain text**" lang="text" >}}
\\internal.justinverstijnen.nl\SYSVOL\internal.justinverstijnen.nl\Policies
{{< /card >}}

Paste the folder there:

[![jv-media-7252-bebf7529ee0d.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/gpo-central-store-and-active-directory/jv-media-7252-bebf7529ee0d.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/gpo-central-store-and-active-directory/jv-media-7252-bebf7529ee0d.png)

Now the folder is in the correct location and picked up by all servers in the domain.

[![jv-media-7252-a2c68fb5e074.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/gpo-central-store-and-active-directory/jv-media-7252-a2c68fb5e074.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/gpo-central-store-and-active-directory/jv-media-7252-a2c68fb5e074.png)

---

## Step 3: Check the Central Store

Now we will check if the Central Store actually works. Let's again open a random Group Policy Object in the Group Policy Management Console.

From there open the `Administrative Templates`. This will take some seconds if the Central Store works:

[![jv-media-7252-588d362fde85.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/gpo-central-store-and-active-directory/jv-media-7252-588d362fde85.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/gpo-central-store-and-active-directory/jv-media-7252-588d362fde85.png)

It will now show you that the Central Store is being used. Now we have one single store of ADMX/ADML files which is replicated with Distributed File System (DFS).

---

## Step 4: Adding new ADMX and ADML policies

Our Central Store is working, but over time we will probably need additional Administrative Templates or update the existing files when:

- Microsoft releases new Windows or Office policies
- Microsoft Edge Administrative Templates are updated
- New FSLogix policies for AVD
- A third party application provides its own Group Policy templates, for example Google Chrome Enterprise

The downloaded Administrative Template package will normally contain one or more `.admx` files and matching `.adml` language files. For example, a package could look like this:

{{< card code=true header="**Plain text**" lang="text" >}}
Administrative Templates
│
├── ExampleApplication.admx
│
└── en-US
    └── ExampleApplication.adml
{{< /card >}}

The ADMX file must be placed in the `PolicyDefinitions` folder with the ADML file in the target subfolder of the preferred language. For my example, I will be installing the FSLogix Administrative Templates, which I downloaded from here: https://aka.ms/fslogix-latest

[![jv-media-7252-11a2cc59a01d.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/gpo-central-store-and-active-directory/jv-media-7252-11a2cc59a01d.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/gpo-central-store-and-active-directory/jv-media-7252-11a2cc59a01d.png)

To install a United States policy, we can create a `en-US` folder at forehand.

[![jv-media-7252-c268d84e04f6.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/gpo-central-store-and-active-directory/jv-media-7252-c268d84e04f6.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/gpo-central-store-and-active-directory/jv-media-7252-c268d84e04f6.png)

Then move the .ADML into the newly created `en-US` folder.

[![jv-media-7252-ed220e1ecb7e.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/gpo-central-store-and-active-directory/jv-media-7252-ed220e1ecb7e.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/gpo-central-store-and-active-directory/jv-media-7252-ed220e1ecb7e.png)

Now we can simply hold CTRL and select both files and copy them to this folder:

{{< card code=true header="**Plain text**" lang="text" >}}
\\internal.justinverstijnen.nl\SYSVOL\internal.justinverstijnen.nl\Policies\PolicyDefinitions
{{< /card >}}

Paste the files there and overwrite them when needed.

[![jv-media-7252-9689c2eea252.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/gpo-central-store-and-active-directory/jv-media-7252-9689c2eea252.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/gpo-central-store-and-active-directory/jv-media-7252-9689c2eea252.png)

Then we can check the Group Policy Management Console again if FSLogix policies are being retrieved:

[![jv-media-7252-1228d4bf8b52.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/gpo-central-store-and-active-directory/jv-media-7252-1228d4bf8b52.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/gpo-central-store-and-active-directory/jv-media-7252-1228d4bf8b52.png)

We now have the FSLogix policies, so the Central Store is working as expected.

---

## Knowledge check

{{< quiz >}}
{
  "intro": "Answer these question(s) to test your understanding of this post. Your answers are not saved or sent anywhere; this is simply a personal knowledge check. If you refresh the page, your answers will be cleared.",
  "questions": [
    {
      "question": "What is the main purpose of the Group Policy Central Store?",
      "reference": "See the section: Group Policy Central Store described",
      "referenceUrl": "#group-policy-central-store-described",
      "answers": [
        {
          "text": "To store all Active Directory users in SYSVOL",
          "correct": false,
          "message": "Incorrect. Active Directory users are not stored inside the Group Policy Central Store."
        },
        {
          "text": "To centrally store the Administrative Templates used when managing domain Group Policies",
          "correct": true,
          "message": "Correct! The Central Store provides a shared location for the ADMX and ADML files used by Group Policy Management."
        },
        {
          "text": "To replace the complete SYSVOL folder",
          "correct": false,
          "message": "Incorrect. The Central Store is only a PolicyDefinitions folder located inside SYSVOL."
        },
        {
          "text": "To store backups of all Group Policy Objects",
          "correct": false,
          "message": "Incorrect. The Central Store contains Administrative Templates and is not a GPO backup location."
        }
      ]
    },
    {
      "question": "Where should an ADML file normally be placed inside the Central Store?",
      "reference": "See the section: Step 4: Adding new ADMX and ADML policies",
      "referenceUrl": "#step-4-adding-new-admx-and-adml-policies",
      "answers": [
        {
          "text": "Directly inside the root of SYSVOL",
          "correct": false,
          "message": "Incorrect. ADML files belong inside the language folder of PolicyDefinitions."
        },
        {
          "text": "Inside the matching language folder, for example PolicyDefinitions\\en-US",
          "correct": true,
          "message": "Correct! ADML files contain the language-specific resources and are stored inside folders such as en-US."
        },
        {
          "text": "Inside every individual Group Policy Object",
          "correct": false,
          "message": "Incorrect. ADML files are stored centrally when using a Central Store."
        },
        {
          "text": "Inside C:\\Windows\\System32 only",
          "correct": false,
          "message": "Incorrect. The Central Store uses the language folders inside PolicyDefinitions."
        }
      ]
    },
    {
      "question": "What should you copy when adding a new Administrative Template to the Central Store?",
      "reference": "See the section: Step 4: Adding new ADMX and ADML policies",
      "referenceUrl": "#step-4-adding-new-admx-and-adml-policies",
      "answers": [
        {
          "text": "Only the ADML file",
          "correct": false,
          "message": "Incorrect. The ADMX policy definition is also required."
        },
        {
          "text": "Only the ADMX file because language files are never needed",
          "correct": false,
          "message": "Incorrect. The matching ADML language file is normally required to display the policy names and descriptions correctly."
        },
        {
          "text": "The required ADMX file or files and their matching ADML language files",
          "correct": true,
          "message": "Correct! Copy the ADMX files to PolicyDefinitions and the matching ADML files to the correct language folder."
        },
        {
          "text": "The complete Group Policy Object from another domain",
          "correct": false,
          "message": "Incorrect. Administrative Templates are added using ADMX and ADML files."
        }
      ]
    }
  ]
}
{{< /quiz >}}

---

## Summary

The Group Policy Central Store gives us one central location for the Administrative Templates used to manage Group Policies inside an Active Directory domain. Instead of depending on the local `PolicyDefinitions` folder of each management computer, we created a shared `PolicyDefinitions` folder inside SYSVOL and populated it with the required ADMX and ADML files. This folder is then replicated throughout the Active Directory domain.

When we need additional Administrative Templates later, we download the new templates, create a backup of the Central Store, copy the ADMX files to the root of `PolicyDefinitions`, and copy the matching ADML files into the correct language folder.

The biggest advantage for me is that all administrators now work with the same Administrative Templates instead of depending on which templates happen to be installed on their local management computer.

Thank you for reading this post and I hope it was helpful!

{{% alert title="Sources 📖" color="info" %}}
These sources helped me by writing and research for this post;

1. https://learn.microsoft.com/en-us/troubleshoot/windows-client/group-policy/create-and-manage-central-store
2. https://learn.microsoft.com/en-us/windows/powertoys/grouppolicy
{{% /alert %}}

{{< ads >}}

{{< article-footer >}}