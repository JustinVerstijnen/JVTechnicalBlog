---
title: "Create a Catch all mailbox in Exchange Online"
date: 2024-07-11
slug: "create-a-catch-all-mailbox-in-exchange-online"
categories:
  - Microsoft 365
tags:
  - Step by Step guides
description: >
  Sometimes a company wants to receive all email, even when addresses don't really exist in Exchange. Now we call this a Catch all mailbox...
---
Sometimes a company wants to receive all email, even when addresses don't really exist in Exchange. Now we call this a Catch all mailbox, where all inbound email is being catched that is not pointed to a known recipient. Think of a sort of \*@domain.com.

In this guide I will explain how to configure this in Exchange Online and how to maintain this by limiting our administrative effort. I also created a full customizable PowerShell script for this task which you can find here:

[Powershell script](#script)

---

---

## Requirements

- Around 20 minutes of your time
- A Microsoft 365 environment
- Basic knowledge of Exchange Online
- Basic knowledge of PowerShell

---

## How does this solution work?

The solution described in this guide works with 3 components:

- **A mailbox or shared mailbox**
- **Dynamic Distribution List**
- **Mailflow rule**

We create a standalone mailbox that is the catch all mailbox, this is the mailbox where everything will be stored. This must have a license for mailflow rules to work. This can also be a free shared mailbox to give multiple users permissions.

Then we create a Dynamic Distribution list which contains all of our users and is automatically refreshed when new users are created. We don't want the rule of the Catch all superseding our users and all of our email redirected to the catch all mailbox with users not receiving anything.

After the group is created, this will be used as a exception in our created Mailflow rule which states: "Mail to address, member of distribution list, deliver to user. Not member of the list? Deliver to Catch all mailbox." To have a more clear understanding, I created a diagram of the process:

Note that internal messages will not be hit by this rule, as there is no point of catching internal messages, but you can change this in your rule to suit your needs.

---

## Step 1: Create the Catch all mailbox using Microsoft 365

Now we have to create a mailbox in Microsoft 365. Login to <https://admin.microsoft.com>

Go to Users and create a new user, and make it clear that this is the Catch-All user:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/create-a-catch-all-mailbox-in-exchange-online-2480/jv-media-2480-16ef4a9c580e.png)

Advance to the next tab and assign at least a Exchange Online P1 license and finish creating the user.

### Create the Catch all mailbox using Powershell

You can also create the mailbox with Exchange PowerShell with this simple script:

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
$catchalladdress = "catchall@domain.com"
$displayName = "New User"
$password = ConvertTo-SecureString -String "Password01" -AsPlainText -Force

# Create mailbox itself
New-Mailbox -UserPrincipalName $catchalladdress `
            -DisplayName $displayName `
            -Password $password `
            -FirstName "New" `
            -LastName "User"
{{< /card >}}

Fill in the parameters on line 1, 2 and 3 and execute the script in Exchange Online Powershell. Make sure to first login to your tenant.

If you want to go with the free non-license option, then we can create a shared mailbox instead:

---

## Step 2: Create the Dynamic Distribution Group

Now we have to create the Dynamic Distribution Group. Go to Exchange Admin Center (as this option only exists there). <https://admin.exchange.microsoft.com>

{{% alert color="info" %}}
In my guide, I create one group for excluding only. You can also create a group for all@domain.com for a internal mailing list with all employees.
{{% /alert %}}

Go to "Recipients" and then "Groups". Then open the tab "Dynamic distribution list"

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/create-a-catch-all-mailbox-in-exchange-online-2480/jv-media-2480-58a228307c9a.png)

Click on "Add a group" to create a new group.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/create-a-catch-all-mailbox-in-exchange-online-2480/jv-media-2480-3013a5d8a7ef.png)

Select the option "Dynamic distribution" and click on "Next".

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/create-a-catch-all-mailbox-in-exchange-online-2480/jv-media-2480-c2c4dae9fbbf.png)

Fill in a good name and description for the Dynamic distribution group.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/create-a-catch-all-mailbox-in-exchange-online-2480/jv-media-2480-40cd088cc4b5.png)

Now for the owner select your admin account(s) and for the members define which types of addresses you want to include. In my case, I only selected Users with Exchange mailboxes. Then click on "Next".

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/create-a-catch-all-mailbox-in-exchange-online-2480/jv-media-2480-3b6112c103f6.png)

Now define the email address name of the Dynamic Distribution group.

Finish the wizard to create the group.

### Create the exclusion Dynamic Distribution group with PowerShell

You can also create this Dynamic Distribution Group with PowerShell by using this simple script;

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
$distributiongroup = "Exclude from Catch All"
$aliasdistributiongroup = "exclude-from-catchall"

New-DynamicDistributionGroup -Name '$distributiongroup' -Alias '$aliasdistributiongroup' -OrganizationalUnit $null -IncludedRecipients 'MailboxUsers'
{{< /card >}}

---

## Step 3: Create the Mailflow Rule

Now we have to create the Mailflow rule in Exchange Admin Center. Go to "Mail flow" and then to "Rules".

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/create-a-catch-all-mailbox-in-exchange-online-2480/jv-media-2480-8c8f32e4ab5d.png)

Click on "+ Add a rule" and then on "Create a new rule" to create a new rule from scratch.

Now we have to define the rule by hand:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/create-a-catch-all-mailbox-in-exchange-online-2480/jv-media-2480-dfde3a7edc08.png)

Give the rule a clear name. I called the rule "JV-NL-Catchall" which contains the domain abbreviation and the TLD of the domain. Then specified that its a Catchall rule.

- For the first part: "*Apply this rule if*", select The sender, and then "is external/internal". You can then select "Not in the Organization".
- For the second part: "*Do the following*", select "Do the following" and select "these recipients". Then select your Catch all mailbox.
- For the third part: "*Except if*", select "The recipient" and then "Member of this group", and select the distribution group we created earlier.

The rule must look like this:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/create-a-catch-all-mailbox-in-exchange-online-2480/jv-media-2480-51c46350321e.png)

Click on "Next".

Now for the rule settings, select "Stop processing more rules" to ensure this rule is hit.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/create-a-catch-all-mailbox-in-exchange-online-2480/jv-media-2480-a1dcfb0f21db.png)

Then give the rule a good description/comment and save the rule.

After creating the rule, we can activate the rule if not already done. Click on the "Disabled" part of the rule and click on the switch to enable the rule.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/create-a-catch-all-mailbox-in-exchange-online-2480/jv-media-2480-ef62a128709c.png)

As you can see, my rule is enabled.

### Create the Mailflow Rule with PowerShell

With this PowerShell script you can create the Mailflow rule with Powershell.

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
$catchalladdress = "catchall@domain.com"
$distributiongroup = "Exclude from Catch All"
$aliasdistributiongroup = "exclude-from-catchall"
$catchallalias = (Get-EXOMailbox -Identity $catchalladdress).Alias
$flowruletitle = "JV-NL-Catchall"
$flowruledesc = "Your rule description"

# Create the rule itself with given parameters
New-TransportRule -FromScope 'NotInOrganization' -RedirectMessageTo '$doelalias' -ExceptIfSentToMemberOf $distributiongroup -Name 'AllMailboxes' -StopRuleProcessing:$false -Mode 'Enforce' -Comments $flowruledesc -RuleErrorAction 'Ignore' -SenderAddressLocation 'Header'
{{< /card >}}

Make sure to change all parameters. I have added the parameters from earlier tasks above, you can exclude them if already specified in your command window. The command is built on the settings shown in the GUI part.

---

## Step 4: Set the domain as Internal Relay

For Exchange be able to redirect messages to a email addresses that doesn't really exist, we must enable "Internal Relay" for every domain that must do a Catch all configuration.

You can enable this in Exchange Admin Center, by going to "Mail flow" and then to "Accepted domains":

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/create-a-catch-all-mailbox-in-exchange-online-2480/jv-media-2480-3b1af94bf2bc.png)

Select your domain and click on it. A window will be opened to the right:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/create-a-catch-all-mailbox-in-exchange-online-2480/jv-media-2480-081b7973420c.png)

Select the option "Internal Relay" and save the configuration.

### Set the domain as Internal Relay with Powershell

This simple Powershell script will set the relay option of the domain to internal.

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
$catchalldomain = "Your domainname"

# Set the relay of Internal
Set-AcceptedDomain -Identity $catchalldomain -DomainType InternalRelay
{{< /card >}}

---

## Step 5: Testing the configuration

We will now test the configuration. Let's test from an emailaddress outside of your Microsoft 365 tenant (such as Gmail or Hotmail/Outlook.com)

I have sent a message from Hotmail to no-reply@justinverstijnen.nl which is a non-existent emailaddress in my tenant. This message should be delivered to my Catch All mailbox.

And it did!

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/create-a-catch-all-mailbox-in-exchange-online-2480/jv-media-2480-d94a8d4b8796.png)

Now you should test normal email flow too, and ensure not all email is sent to your catch all mailbox. If this works, then the solution is working 100%.

---

## Complete PowerShell script

To minimize errors for your configuration, I created a PowerShell script to automate this setup. You can view and download the script here:

[Powershell script](https://github.com/JustinVerstijnen/M365CatchAllScript/blob/main/M365CatchAllScript.ps1)

---

## Summary

This solution is a great way for having a catch all mailbox in your Microsoft 365 environment. I also added a PowerShell script for performing this task correctly, because one simple mistake can disrupt the complete mailflow.

Thank you for following this guide and I hope it was helpful.

{{< ads >}}

{{< article-footer >}}
