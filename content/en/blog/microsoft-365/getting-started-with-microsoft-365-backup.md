---
title: "Getting started with Microsoft 365 Backup"
date: 2026-04-03
slug: "getting-started-with-microsoft-365-backup"
categories:
  - Microsoft 365
tags:
  - Step by Step guides
description: >
  Microsoft 365 Backup ensures that your data, accounts and email is safe and backed up into a separate storage space. A good and reliable...
---
Microsoft 365 Backup ensures that your data, accounts and email is safe and backed up into a separate storage space. A good and reliable back-up solution is crucial for any cloud service, even when having versioning and recycle bin options. Data in SharePoint or OneDrive stays data in one central place and any minor error is made within seconds.

In this guide, I will explain how Microsoft 365 Backup works and how you can start using it.

---

## Requirements

- A Microsoft 365 environment with Global Administrator permissions
- An Azure Subscription with PAYG capabilities
- Around 30 minutes of your time
- Basic knowledge of Microsoft 365

---

## What is Microsoft 365 Backup?

Microsoft 365 Backup is an integrated solution of Microsoft to backup Microsoft 365 items. This applies to these items:

- Exchange Mailboxes
- OneDrive accounts
- SharePoint sites/Teams

Microsoft 365 Backup can be used to extend the retention period of certain data. By default, spaces like SharePoint sites have a retention of 93 days if you count the recycle bin and versioning. But this is not really a backup, only some techniques to quicky restore a single file or folder. This doesn't include things like permissions, which Microsoft 365 Backup does.

If having any site-wide problems, data loss or change in permissions, you will be doomed.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/getting-started-with-microsoft-365-backup-8069/jv-media-8069-5d5842f0d6b3.png)

Microsoft 365 Backup has the following details:

- Retention up to 1 year
  - 10 minute backup retention of 14 days
  - Weekly backup retention of 365 days
- Backup frequency of every 10 minutes (RPO)
- 1TB to 3TB restore speed (RTO)

---

## Microsoft 365 Backup Pricing

The pricing of Microsoft 365 Backup is $0,15 per month per stored gigabyte. This means every gigabyte that is protected is being billed. This is billed using the payment method of Azure and will be on that invoice. You could also create a separate subscription to receive a separate invoice.

For example:

- 5 Mailbox of 25GB including deleted items

You will pay 5 x 25 x $0,15 per month which is $18,75 per month. The duplicate data that is being saved is not billed, as deduplication techiques are being used: Incremental backups.

An example of forecasted costs for an environment with backups enabled can be (with low and heavy users):

|  |  |  |  |  |
| --- | --- | --- | --- | --- |
| **Type** | **SharePoint size** | **Onedrive size** | **Mailboxes size** | **Total costs/month**\* |
| 5 users (low) | 25GB | 32,5GB | 32,5GB | $ 13,50 ($2,70/user) |
| 5 users (heavy) | 100GB | 125GB | 125GB | $ 52,50 ($10,50/user) |
| 25 users (low) | 100GB | 125GB | 125GB | $ 52,50 ($2,10/user) |
| 25 users (heavy) | 500GB | 625GB | 625GB | $ 262,50 ($10,50/user) |
| 250 users (low) | 500GB | 625GB | 625GB | $ 262,50 ($1,05/user) |
| 250 users (heavy) | 5000GB | 6.250GB | 6.250GB | $ 2.625,- ($10,50/user) |

\*$ 0,15 per GB/month

As you can see, it totally depends on how many data is backed up, and selecting only crucial sites/users is crucial. You have to create a cost estimate based on the items you need the extra retention for. Maybe for most of the users, like frontline workers or people with only an email address and some OneDrive, the recycle bin and versioning options with 93 days of retention is more than enough.

You can find currect usage easily through the Microsoft 365 Admin center (<https://admin.cloud.microsoft>) and then to "Reports" and then "Usage":

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/getting-started-with-microsoft-365-backup-8069/jv-media-8069-36baff867d1d.png)
{{% alert color="info" %}}
Tip: Calculate your actual data usage with this PowerShell scripts of Microsoft: <https://learn.microsoft.com/en-us/microsoft-365/backup/backup-pricing?view=o365-worldwide#finding-the-sizes-of-stored-data>
{{% /alert %}}

## Required permissions for Microsoft 365 Backup

To be more prepared, let's review the permissions/roles you need to configure and restore with Microsoft 365 Backup.

- SharePoint Administrator (least-privileged)
- Global Administrator (the boss of the tenant)

If you want to use **the file level restore options**, you need to have these roles assigned, even with Global Administrator permissions already assigned, keep this in mind:

- SharePoint Backup Administrator
- Exchange Backup Administrator

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/getting-started-with-microsoft-365-backup-8069/jv-media-8069-6dba4232b7f4.png)

---

## Step 1: Create a designated resource group

First we will creeate a separate resource group for our Microsoft 365 Backup policy. Go to the Azure Portal (<https://portal.azure.com>).

Then create a new resource group in your subscription:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/getting-started-with-microsoft-365-backup-8069/jv-media-8069-05f74f7952c6.png)

After creating the resource group, it will be ready to deploy resources into.

---

## Step 2: Create a Billing policy

Now we can start by preparing Microsoft 365 Backup in your tenant. Go to the Microsoft 365 Admin center (or directly to: <https://admin.cloud.microsoft/?#/Settings/enhancedRestore>)

Then go to Settings -> Microsoft 365 Backup

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/getting-started-with-microsoft-365-backup-8069/jv-media-8069-896c7b69a28e.png)

Then click on the "Go to setup page" button and you will be redirected to the billing options.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/getting-started-with-microsoft-365-backup-8069/jv-media-8069-d3905deb50ef.png)

Click on the "Services" tab here and there we have Microsoft 365 Backup. To actually use Microsoft 365 Backup, we need to create a billing policy.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/getting-started-with-microsoft-365-backup-8069/jv-media-8069-557a645a2099.png)

Click the "create a billing policy" button to create one.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/getting-started-with-microsoft-365-backup-8069/jv-media-8069-7b11e8d15bf5.png)

Fill in the details, and select your Azure subscription and just created resource group. The region can be any region of choice. Preferrably the closest one to you or what you need in terms of regulatory compliance.

Click "Next".

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/getting-started-with-microsoft-365-backup-8069/jv-media-8069-48514724c618.png)

On the "Choose users" page choose one of the two options. I chose "All users". Then click "Next".

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/getting-started-with-microsoft-365-backup-8069/jv-media-8069-8e8464e6c44a.png)

On the "Budget" page, you can set a budget, or maximum amount of money you want to spend on this solution.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/getting-started-with-microsoft-365-backup-8069/jv-media-8069-429afd56b62c.png)

Finish the policy and we are ready to go.

---

## Step 3: Connect Microsoft 365 Backup service to billing policy

Now that we have our billing policy in place, we can now connect the Microsoft 365 Backup service to this policy. On the "Billing policies page, click "Services" and then "Microsoft 365 Backup".

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/getting-started-with-microsoft-365-backup-8069/jv-media-8069-1995838dc473.png)

A blade will now come from the right. Select the "Billing policies" tab there and enable the switch to connect the service to your created billing policy.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/getting-started-with-microsoft-365-backup-8069/jv-media-8069-bcc4f2b9a2a4.png)

After enabling this and saving, the service is now linked to your billing policy.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/getting-started-with-microsoft-365-backup-8069/jv-media-8069-82e38d60ff51.png)

And as we can see in Azure, a policy is now deployed to our resource group:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/getting-started-with-microsoft-365-backup-8069/jv-media-8069-0b9f621456d0.png)

---

## Step 4: Configure Microsoft 365 Backup for SharePoint

Now that we have connected the service to our Azure subscription, we actually enabled the service but without any configuration. By going again to the Microsoft 365 Backup blade, we will be shown this:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/getting-started-with-microsoft-365-backup-8069/jv-media-8069-19d5ac1bdb3d.png)

We will first configure a policy for SharePoint. Click on "+ Set up policy". After that, click Next on the SharePoint backup policy page.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/getting-started-with-microsoft-365-backup-8069/jv-media-8069-5d535942eb80.png)
{{% alert color="info" %}}
You can use the "filters" option, but you always need to add new sites manually. This is not a dynamic option. Therefore, the "Individual" option is more easy.
{{% /alert %}}

Here we can select how we want to select our SharePoint sites. I will use the "Individual" option here. Then select the sites you want to backup.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/getting-started-with-microsoft-365-backup-8069/jv-media-8069-1bd35f3737bf.png)

Then proceed to the "Backup settings" and give your policy a name.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/getting-started-with-microsoft-365-backup-8069/jv-media-8069-66ac392659e2.png)

Then finish the wizard. The policy will directly start backing up your data:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/getting-started-with-microsoft-365-backup-8069/jv-media-8069-dda05d818490.png)

---

## Step 5: Configure Microsoft 365 Backup for OneDrive

Now we can configure the backup for OneDrive accounts. Click on the "+ Set up policy" button under "OneDrive". Proceed to the wizard.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/getting-started-with-microsoft-365-backup-8069/jv-media-8069-a0e193298a4b.png)

At the "Choose selection method" select the "Dynamic rule" option, as we want to automatically backup new accounts instead of changing the scope every time.

We can select two types here:

- Distribution lists
- Security groups

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/getting-started-with-microsoft-365-backup-8069/jv-media-8069-726d1e45728d.png)

In my case, I created a dynamic security group containing all users. Then click "Next".

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/getting-started-with-microsoft-365-backup-8069/jv-media-8069-a8b5d6bdd6d2.png)

Give the policy a name and finish the wizard.

Now we have 2 policies in place:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/getting-started-with-microsoft-365-backup-8069/jv-media-8069-5fe34f0f5fd1.png)

---

## Step 6: Configure Microsoft 365 Backup for Exchange

Now we can configure the backup for Exchange accounts. Click on the "+ Set up policy" button under "Exchange". Proceed to the wizard.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/getting-started-with-microsoft-365-backup-8069/jv-media-8069-e4e1d4504e9c.png)

I once again use the dynamic rule option, to actually backup newly created accounts.

Here we can select two types of user sources similar to the OneDrive accounts:

- Distribution lists
- Security groups

In my case, I created a dynamic security group containing all users. Then click "Next".

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/getting-started-with-microsoft-365-backup-8069/jv-media-8069-2c02a77a2dd9.png)

Click "Next".

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/getting-started-with-microsoft-365-backup-8069/jv-media-8069-8e75b07b11b7.png)

Give the policy a name and finish the wizard.

Now we have 3 policies in place:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/getting-started-with-microsoft-365-backup-8069/jv-media-8069-29e8c0e8bdd3.png)

---

## Step 7: Restoring a full SharePoint Site

To actually test the backup method, we will place a file on the SharePoint site and restore the site. I placed a .zip file of around 200MB on the site I just selected and wait for Microsoft 365 Backup to backup the site:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/getting-started-with-microsoft-365-backup-8069/jv-media-8069-02b4c6587d62.png)

After around 10 minutes, this starts backing up:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/getting-started-with-microsoft-365-backup-8069/jv-media-8069-dd531899a222.png)

And waiting for a few minutes will ensure the task has been completed:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/getting-started-with-microsoft-365-backup-8069/jv-media-8069-7ff4ab663248.png)

Now we will delete the file from the SharePoint site:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/getting-started-with-microsoft-365-backup-8069/jv-media-8069-dd22bdbdffbc.png)

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/getting-started-with-microsoft-365-backup-8069/jv-media-8069-153395c2b74c.png)

And let's head back to Microsoft 365 Backup to actually restore the file. Under "SharePoint" I clicked on "Restore"

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/getting-started-with-microsoft-365-backup-8069/jv-media-8069-6c9e086f9740.png)

Follow the wizard by selecting your site where you want to recover files

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/getting-started-with-microsoft-365-backup-8069/jv-media-8069-ad6ed30d6c6f.png)

Select your desired restore point, which will be obviously before any error or problem occurred. In my case, I deleted the file after 10:30 AM.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/getting-started-with-microsoft-365-backup-8069/jv-media-8069-6926fddbda1b.png)

I selected this restore point and clicked "Next".

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/getting-started-with-microsoft-365-backup-8069/jv-media-8069-43793d35b868.png)

Now you can select to create a new copy SharePoint site with all the filed in it or to just restore it to the current site.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/getting-started-with-microsoft-365-backup-8069/jv-media-8069-0a4b8ad66cbb.png)

Now the restore action will be executed. In my case this took a while. Actually, around 3 hours:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/getting-started-with-microsoft-365-backup-8069/jv-media-8069-f0be01324f73.png)

And as you can see, the file is back:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/getting-started-with-microsoft-365-backup-8069/jv-media-8069-70794559b7a2.png)

---

## Step 8: Restoring a single file on OneDrive

Because we want also be able to restore a single file, let's try to restore one single file in a OneDrive folder either.

Once again the reminder that your account needs these permissions to perform single-file restore actions for OneDrive:

- SharePoint Backup Administrator

In the Microsoft 365 Backup pane, under "Onedrive" click on "Restore":

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/getting-started-with-microsoft-365-backup-8069/jv-media-8069-7572e51762b8.png)

Use the "Restore specific files or folders" option.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/getting-started-with-microsoft-365-backup-8069/jv-media-8069-788d6faa8dee.png)

Then navigate to the account, desired restore point and file/folder. This would be pretty straight forward.

For the demonstration, I will delete the top folder (called Post 1462 - SPF-DKIM-DMARC), containing some files of an earlier blog post (around 40MB):

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/getting-started-with-microsoft-365-backup-8069/jv-media-8069-f46877b94e82.png)

Thats gone.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/getting-started-with-microsoft-365-backup-8069/jv-media-8069-961154f2789f.png)

Now let's resume the restore action in the Microsoft 365 Backup portal.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/getting-started-with-microsoft-365-backup-8069/jv-media-8069-ab6c93207ada.png)

And the portal will inform us the restoration task has been started.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/getting-started-with-microsoft-365-backup-8069/jv-media-8069-00e00b84d5c4.png)

Now we can review the status of the restore action under the tab "Restorations".

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/getting-started-with-microsoft-365-backup-8069/jv-media-8069-3ce82f8d1940.png)

After a minute, the service has placed our files in a new folder in the root of the OneDrive folder, allowing us to manually place back the files. This is by design to prevent data loss.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/getting-started-with-microsoft-365-backup-8069/jv-media-8069-eb418673fb81.png)

And the folder contains our selected folder:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/getting-started-with-microsoft-365-backup-8069/jv-media-8069-6e47978c4f2e.png)

---

## Downsides of Microsoft 365 Backup

As I researched this solution, I wanted to know the upsides and downsides of this solution. As no solution is perfect, you have to align with what you want and need for your workloads. I came with the following downsides of Microsoft 365 Backup:

- SharePoint sites must be selected manually, even when using dynamic filters
- Restore actions of a complete site are a bit slow
- Pricing is based on usage, where price per user would be more predictable
  - This can be cheaper than 3rd party solutions but also more expensive
- As this is an integrated solution, this can be seen (by regulatory compliance) as single point of failure. Locked out of your tenant means no access to backups either

---

## Summary

Microsoft 365 Backup is a great solution for organizations and people that need more restore options than the default recycle bin (93 days) and versioning. It greatly integrates with your Microsoft 365 environment and is easy to setup, using your current Azure subscription as billing method.

I honestly see this as a last resort, when actions are too destructive to rely on the built in recycle bin options where you want to restore a complete account/mailbox/site. If within 93 days of deletion, the recycle bin would be a much faster option. But its a great feature to extend the retention from 93 days to 365 days for organizations who need this.

Thank you for visiting this page and I hope it was helpful.

### Sources

These sources helped me by writing and research for this post;

1. <https://learn.microsoft.com/en-us/microsoft-365/backup/backup-pricing?view=o365-worldwide>
2. <https://learn.microsoft.com/en-us/microsoft-365/backup/backup-setup?view=o365-worldwide>
3. <https://learn.microsoft.com/en-us/microsoft-365/backup/backup-restore-data?view=o365-worldwide&tabs=onedrive>

{{< ads >}}

{{< article-footer >}}
