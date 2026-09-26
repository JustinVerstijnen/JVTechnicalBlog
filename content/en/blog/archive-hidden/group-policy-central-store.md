---
title: "Creating and using a Group Policy Central Store in Active Directory"
slug: "creating-using-gpo-central-store-active-directory"
date: 2026-10-17
tags:
- Step by Step guides
categories:
- Windows Server
description: "In this guide, I will show how to create a Group Policy Central Store inside SYSVOL, how ADMX and ADML files work, and how to add new Administrative Templates to your Active Directory environment."
hidden: false
---

## Group Policy Central Store described

When you manage Group Policies in an Active Directory environment, you will probably use the **Administrative Templates** section quite often. These templates contain the policy settings which you can configure for Windows, Microsoft products, and many third-party applications.

By default, Group Policy Management can use the Administrative Template files which are installed locally on the computer where you edit your Group Policies.

This works, but can become confusing when multiple administrators or management servers are being used. One administrator could have newer Administrative Templates installed than another administrator.

This is where the **Group Policy Central Store** comes in.

The Central Store is a shared location inside the `SYSVOL` folder of your Active Directory domain where we can centrally store our `.admx` and `.adml` files.

Because SYSVOL is shared and replicated between the Domain Controllers, the same Administrative Templates can then be used when editing Group Policies throughout the domain.

**In simple words:**

1. Without a Central Store, your Group Policy editor can use the Administrative Templates installed locally on your computer.
2. We create one central `PolicyDefinitions` folder inside SYSVOL.
3. We copy our Windows ADMX and ADML files into this folder.
4. Group Policy Management will automatically start using these files.
5. When we later need new policies for Windows or another application, we add the new ADMX and ADML files to the same Central Store.

The Central Store that we are going to create in this guide will look something like this:

| File or folder | Purpose |
| --- | --- |
| `PolicyDefinitions` | Main Central Store folder |
| `.admx` files | Language-neutral policy definitions |
| `en-US` | English language resources |
| `.adml` files | Language-specific names and descriptions |
| SYSVOL | Replicates the Central Store throughout the Active Directory domain |

After completing this guide, we will have one central location from where our Administrative Templates can be managed.

---

## ADMX and ADML files described

Before creating the Central Store, it is useful to understand the two different file types we are going to work with.

An **ADMX file** contains the actual policy definition. It describes things like the policy category, supported operating systems, registry locations, and which settings can be configured.

The ADMX file itself is language-neutral.

The **ADML file** contains the language-specific text belonging to the ADMX file. This includes the policy names, descriptions, help texts, and other information you see inside the Group Policy Management Editor.

For example:

```text
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
```

The `.admx` files are placed directly inside `PolicyDefinitions`.

The `.adml` files are placed inside the folder belonging to their language. For English United States this is normally `en-US`.

If your administrators use another language, you can also have additional folders like:

```text
nl-NL
de-DE
fr-FR
```

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

```text
internal.justinverstijnen.nl
```

You will need to replace this with your own Active Directory domain name when following this guide in your own environment.

---

## Step 1: Checking if a Central Store already exists

Before creating anything, we should first check if the domain already has a Central Store.

Open File Explorer on your Domain Controller or management computer and browse to:

```text
\\<yourdomain>\SYSVOL\<yourdomain>\Policies
```

For my domain this is:

```text
\\internal.justinverstijnen.nl\SYSVOL\internal.justinverstijnen.nl\Policies
```

<!-- Screenshot: SYSVOL Policies folder -->

Inside the `Policies` folder, check if there is already a folder named:

```text
PolicyDefinitions
```

If the `PolicyDefinitions` folder already exists, your environment most likely already has a Central Store.

Do **not** create another `PolicyDefinitions` folder in that case. First check the existing files and make a backup before changing anything.

If there is no `PolicyDefinitions` folder yet, we can continue and create our new Central Store.

---

## Step 2: Checking the current Group Policy source

Before creating the Central Store, let's first check where Group Policy Management is currently getting its Administrative Templates from.

Open **Group Policy Management** by running:

```text
gpmc.msc
```

Expand your domain and edit an existing test Group Policy or create a temporary Group Policy for this check.

Navigate to:

```text
Computer Configuration
└── Policies
    └── Administrative Templates
```

<!-- Screenshot: Administrative Templates before Central Store -->

When no Central Store is configured, the Group Policy Management Editor can use the Administrative Templates available on the local management computer.

We are going to change this by creating the shared `PolicyDefinitions` folder inside SYSVOL.

Close the Group Policy Management Editor before continuing.

---

## Step 3: Preparing the Administrative Templates

We now need a source for the Administrative Templates that we are going to place inside our Central Store.

On a current Windows computer, the local Administrative Templates can normally be found here:

```text
C:\Windows\PolicyDefinitions
```

Open the folder.

<!-- Screenshot: C:\Windows\PolicyDefinitions -->

You will see a large amount of `.admx` files.

You will also see one or more language folders, for example:

```text
en-US
```

If you open the `en-US` folder, you will see the corresponding `.adml` files.

<!-- Screenshot: ADMX files and en-US folder -->

For a new Central Store, we want to start with a complete and consistent set of Administrative Templates instead of copying only a few random files.

Before using the templates from a Windows computer, make sure that computer is fully updated so we are not starting our Central Store with unnecessary outdated templates.

Administrative Template packages downloaded separately from Microsoft can also contain their own `PolicyDefinitions` folder. In that situation, we can use the files from that package instead.

---

## Step 4: Creating the Central Store

We are now ready to create the actual Central Store.

Browse back to:

```text
\\internal.justinverstijnen.nl\SYSVOL\internal.justinverstijnen.nl\Policies
```

Create a new folder with exactly this name:

```text
PolicyDefinitions
```

<!-- Screenshot: Creating PolicyDefinitions folder -->

The complete path should now be:

```text
\\internal.justinverstijnen.nl\SYSVOL\internal.justinverstijnen.nl\Policies\PolicyDefinitions
```

This folder is our Group Policy Central Store.

Because the folder is stored inside SYSVOL, it becomes part of the domain's SYSVOL data.

For environments with multiple Domain Controllers, these files will also be replicated to the other Domain Controllers.

At this moment our Central Store is still empty, so let's populate it.

---

## Step 5: Copying the ADMX files

Open the local source folder we prepared earlier:

```text
C:\Windows\PolicyDefinitions
```

Select the `.admx` files inside this folder.

Copy these files to:

```text
\\internal.justinverstijnen.nl\SYSVOL\internal.justinverstijnen.nl\Policies\PolicyDefinitions
```

<!-- Screenshot: Copying ADMX files -->

After copying, the Central Store should contain files similar to:

```text
AppxPackageManager.admx
ControlPanel.admx
Desktop.admx
GroupPolicy.admx
StartMenu.admx
WindowsUpdate.admx
```

These names are only examples. The exact files available depend on the Administrative Template version you are using.

We now have the policy definitions, but we are not finished yet.

The matching language files are also needed.

---

## Step 6: Copying the ADML language files

Go back to the source:

```text
C:\Windows\PolicyDefinitions
```

For this guide, I am using the English United States language files, which are stored inside:

```text
C:\Windows\PolicyDefinitions\en-US
```

Copy the complete `en-US` folder to the Central Store.

The result should be:

```text
\\internal.justinverstijnen.nl\SYSVOL\internal.justinverstijnen.nl\Policies\PolicyDefinitions\en-US
```

<!-- Screenshot: Copying en-US folder -->

The folder structure should now look something like this:

```text
PolicyDefinitions
│
├── AppxPackageManager.admx
├── ControlPanel.admx
├── Desktop.admx
├── GroupPolicy.admx
├── StartMenu.admx
├── WindowsUpdate.admx
│
└── en-US
    ├── AppxPackageManager.adml
    ├── ControlPanel.adml
    ├── Desktop.adml
    ├── GroupPolicy.adml
    ├── StartMenu.adml
    └── WindowsUpdate.adml
```

If you need multiple languages for your Group Policy administrators, copy the additional language folders as well.

An important thing to remember is:

```text
ADMX -> PolicyDefinitions
ADML -> PolicyDefinitions\<language>
```

So do not place the ADML files directly next to the ADMX files.

{{< ads >}}

---

## Step 7: Checking if the Central Store is being used

Now that the files are in place, let's check if Group Policy Management is actually using our Central Store.

Close any Group Policy Management Editor windows that are still open and open:

```text
gpmc.msc
```

Edit an existing test Group Policy again.

Navigate to:

```text
Computer Configuration
└── Policies
    └── Administrative Templates
```

Select **Administrative Templates**.

<!-- Screenshot: Retrieved from the Central Store -->

The Group Policy Management Editor should now indicate that the policy definitions are being retrieved from the **Central Store**.

This confirms that the `PolicyDefinitions` folder inside SYSVOL has been detected.

From this moment, the Central Store becomes the main location for the Administrative Templates used when we edit domain Group Policies.

This is also something to keep in mind later.

Installing a new Administrative Template locally on your management computer does not automatically mean that the new policy will become available inside the domain Group Policy editor.

When a Central Store exists, we should maintain the templates inside the Central Store.

---

## Step 8: Adding new ADMX and ADML policies

Our Central Store is working, but over time we will probably need additional Administrative Templates.

This can happen when:

- Microsoft releases new Windows policies
- Microsoft releases new Office policies
- Microsoft Edge Administrative Templates are updated
- An application provides its own Group Policy templates
- A third-party product adds new management settings

The downloaded Administrative Template package will normally contain one or more `.admx` files and matching `.adml` language files.

For example, a package could look like this:

```text
Administrative Templates
│
├── ExampleApplication.admx
│
└── en-US
    └── ExampleApplication.adml
```

The first thing I recommend before changing the Central Store is making a backup of the current `PolicyDefinitions` folder.

<!-- Screenshot: Backup Central Store -->

Then locate the new `.admx` file.

Copy the ADMX file to:

```text
\\internal.justinverstijnen.nl\SYSVOL\internal.justinverstijnen.nl\Policies\PolicyDefinitions
```

<!-- Screenshot: Copying new ADMX -->

Then locate the matching `.adml` file.

For an English United States template, copy the ADML file to:

```text
\\internal.justinverstijnen.nl\SYSVOL\internal.justinverstijnen.nl\Policies\PolicyDefinitions\en-US
```

<!-- Screenshot: Copying new ADML -->

Our example would then become:

```text
PolicyDefinitions
│
├── ExampleApplication.admx
│
└── en-US
    └── ExampleApplication.adml
```

The same principle applies to larger Administrative Template packages containing multiple files.

If the vendor supplies multiple ADMX files, check the documentation from that vendor and copy the complete required set instead of assuming that only one file is needed.

---

## Step 9: Checking the newly added policies

After copying the new ADMX and ADML files, close the Group Policy Management Editor if it was still open.

Then reopen the Group Policy Management Console:

```text
gpmc.msc
```

Edit your test Group Policy and navigate to the Administrative Templates section again.

Depending on the template you installed, a new category or new policies should now be available.

<!-- Screenshot: New Administrative Template visible -->

For example, third-party applications can create their own category under:

```text
Computer Configuration
└── Policies
    └── Administrative Templates
```

or:

```text
User Configuration
└── Policies
    └── Administrative Templates
```

The exact location depends on how the vendor created the Administrative Template.

If the new policies are visible, the ADMX and ADML files have been successfully added to the Central Store.

Adding the templates itself does not automatically configure a Group Policy setting. It only makes the new Administrative Template settings available to administrators.

We can now configure the required setting inside a GPO like any other Administrative Template policy.

---

## Step 10: Understanding the replication

Because the Central Store exists inside SYSVOL, it is not just a normal folder on one Domain Controller.

In an Active Directory environment with multiple Domain Controllers, SYSVOL is replicated between those Domain Controllers.

This means that when we add a new ADMX or ADML file to the Central Store, the files will also become available on the other Domain Controllers after replication has completed.

You can check this by opening the SYSVOL location on another Domain Controller:

```text
C:\Windows\SYSVOL\sysvol\internal.justinverstijnen.nl\Policies\PolicyDefinitions
```

<!-- Screenshot: PolicyDefinitions on second Domain Controller -->

Check if the newly copied ADMX file and language file are also available there.

This is especially useful in larger environments because administrators no longer need to manually maintain the Administrative Templates on every management computer.

They can all work with the same template set stored in the domain.

---

## Step 11: Updating the Windows Administrative Templates

Adding one application template is quite simple, but at some point you will also want to update the complete Windows Administrative Template set.

I recommend being a little more careful with this than simply replacing random files inside the production Central Store.

Microsoft recommends preparing a new version of the `PolicyDefinitions` folder first.

For example:

```text
PolicyDefinitions-25H2
```

Populate this new folder with the complete newer Administrative Template set, including the required language folders.

It could look like this:

```text
Policies
│
├── PolicyDefinitions
│
└── PolicyDefinitions-25H2
```

The current `PolicyDefinitions` folder is still the production Central Store.

The versioned folder can first be prepared and checked before it becomes the active version.

When you are ready to replace the current set, the existing folder can temporarily be renamed, for example:

```text
PolicyDefinitions-Previous
```

and the newly prepared folder can be renamed to:

```text
PolicyDefinitions
```

<!-- Screenshot: Versioned PolicyDefinitions folders -->

This gives us a much cleaner rollback option compared to overwriting hundreds of files directly.

After the new templates have been tested successfully, the old version can be archived outside SYSVOL.

This is especially useful when managing a production Active Directory environment where Group Policy is important for many computers and users.

---

## Step 12: Troubleshooting ADMX and ADML problems

If Group Policy Management gives an error after adding new templates, there are a few things I would check first.

### Check the file locations

The ADMX file must be placed in:

```text
PolicyDefinitions
```

The ADML file must be placed in the correct language folder, for example:

```text
PolicyDefinitions\en-US
```

### Check if the ADMX and ADML versions match

Do not mix a new ADMX file with a very old ADML file with the same name.

Both files should preferably come from the same Administrative Template package.

### Check dependencies

Some Administrative Templates reference categories or resources from another ADMX file.

When a vendor supplies multiple ADMX files, copying only one of them can therefore result in an error.

### Check your language folder

If you use English Administrative Templates, make sure the matching files actually exist inside:

```text
en-US
```

If you use another language, check the corresponding language folder.

### Reopen Group Policy Management

Close the Group Policy Management Editor completely and open the GPO again after adding or replacing Administrative Templates.

### Check SYSVOL replication

When you have multiple Domain Controllers, make sure the new files have replicated before troubleshooting the Group Policy settings on another Domain Controller.

---

## Central Store overview

After completing all steps, our setup now looks like this:

```text
Active Directory
│
└── SYSVOL
    │
    └── internal.justinverstijnen.nl
        │
        └── Policies
            │
            └── PolicyDefinitions
                │
                ├── Windows ADMX files
                ├── Microsoft ADMX files
                ├── Third-party ADMX files
                │
                ├── en-US
                │   └── ADML files
                │
                └── Other language folders
                    └── ADML files
```

The workflow for adding a new Administrative Template is now also quite simple:

```text
Download Administrative Template
        ↓
Locate ADMX and ADML files
        ↓
Backup Central Store
        ↓
Copy ADMX to PolicyDefinitions
        ↓
Copy ADML to the language folder
        ↓
Open Group Policy Management
        ↓
Check if the new policies are available
```

This gives us one predictable location to maintain our Group Policy Administrative Templates.

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
      "reference": "See the section: Step 6: Copying the ADML language files",
      "referenceUrl": "#step-6-copying-the-adml-language-files",
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
      "reference": "See the section: Step 8: Adding new ADMX and ADML policies",
      "referenceUrl": "#step-8-adding-new-admx-and-adml-policies",
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

The Group Policy Central Store gives us one central location for the Administrative Templates used to manage Group Policies inside an Active Directory domain.

Instead of depending on the local `PolicyDefinitions` folder of each management computer, we created a shared `PolicyDefinitions` folder inside SYSVOL and populated it with the required ADMX and ADML files.

For the domain used in this guide, the most important thing to remember is the folder structure:

```text
ADMX -> \\internal.justinverstijnen.nl\SYSVOL\internal.justinverstijnen.nl\Policies\PolicyDefinitions

ADML -> \\internal.justinverstijnen.nl\SYSVOL\internal.justinverstijnen.nl\Policies\PolicyDefinitions\<language>
```

When we need additional Administrative Templates later, we download the new templates, create a backup of the Central Store, copy the ADMX files to the root of `PolicyDefinitions`, and copy the matching ADML files into the correct language folder.

For larger Windows Administrative Template updates, preparing a completely new version of the `PolicyDefinitions` folder first gives us a cleaner way to test and roll back the change.

The biggest advantage for me is that all administrators now work with the same Administrative Templates instead of depending on which templates happen to be installed on their local management computer.

Thank you for reading this post and I hope it was helpful!

{{% alert title="Sources 📖" color="info" %}}
These sources helped me by writing and research for this post;

1. https://learn.microsoft.com/en-us/troubleshoot/windows-client/group-policy/create-and-manage-central-store
2. https://learn.microsoft.com/en-us/windows/powertoys/grouppolicy
{{% /alert %}}

{{< ads >}}

{{< article-footer >}}