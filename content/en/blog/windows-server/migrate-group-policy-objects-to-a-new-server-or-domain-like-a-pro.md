---

title: "Migrate Group Policies to a new server or domain like a pro"  
date: 2024-08-07  
slug: "migrate-group-policy-objects-to-a-new-server-or-domain-like-a-pro"  
categories:
- Windows Server  
tags:
- AI Generated Content
- Step by Step guides  
description: >  
    Once in a while, we as IT administrators need to migrate our Group Policies of Windows Server to another server. Sometimes to...

---

Once in a while, we as IT administrators need to export and import our Group Policies of Windows Server to another server. Sometimes to copy a great policy you've built, or to migrate a customer to a new server.

By default, the only option Microsoft has built in into Group Policy Management (gpmc.msc) is the backup option. This creates some administrative tasks.

---

## The Export and Import scripts

I have created two scripts with Powershell that fully exports and imports all Group Policy Objects (GPOs). This with 2 seperate scripts. These can be found and downloaded from my Github page:

[Export script](https://github.com/JustinVerstijnen/MigrateGroupPoliciesScripts/blob/main/ExportGroupPolicies.ps1)  
[Import script](https://github.com/JustinVerstijnen/MigrateGroupPoliciesScripts/blob/main/ImportGroupPolicies.ps1)

---

## Using the Export script to migrate Group Policies

When having our Group Policies in place on a server, create a new folder on a preferred place like Desktop.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/migrate-group-policy-objects-to-a-new-server-or-domain-like-a-pro-324/jv-media-324-2d71683c68b3.png)

Save my Export script to a .ps1 file and place that into the newly created folder.

If you haven't changed your Powershell script execution policy yet, do a shift + right click on a empty space in the folder, and run the command:

{{\< card code=true header="\*\*POWERSHELL\*\*" lang="powershell" >}}  
Set-ExecutionPolicy Unrestricted -Scope Process  
{{\< /card >}}

After that you can run the script by typing .\\\*tab button\*

{{\< card code=true header="\*\*POWERSHELL\*\*" lang="powershell" >}}  
.\\ExportGroupPolicies.ps1  
{{\< /card >}}

This will temporarily accept our script and other scripts till we close the Powershell window. This is the best and most secure way handling the Execution Policy of Powershell.

Now lets run our script to export all non-default Group Policy objects:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/migrate-group-policy-objects-to-a-new-server-or-domain-like-a-pro-324/jv-media-324-463aa6493bb1.png)

It will save all needed files in this folder, so you can copy the whole folder and start the importing process on the destination server:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/migrate-group-policy-objects-to-a-new-server-or-domain-like-a-pro-324/jv-media-324-2d71683c68b3.png)

---

## Using the import script to migrate Group Policies

Lets say, we have just created our new forest and promoted our first server to a domain controller. We now want to import the GPOs we exported using this export script to this new server.

I have saved the script as .ps1 file for quick execution, and have saved in the same folder as my export script saved the GPO's:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/migrate-group-policy-objects-to-a-new-server-or-domain-like-a-pro-324/jv-media-324-8a4864724459.png)

When checking our Group Policy Management console, it is completely empty and clean:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/migrate-group-policy-objects-to-a-new-server-or-domain-like-a-pro-324/jv-media-324-cd78cac50b4b.png)

We now execute the script to import the Group Policies:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/migrate-group-policy-objects-to-a-new-server-or-domain-like-a-pro-324/jv-media-324-d9ee1292e70a.png)

If you haven't temporarily disabled your PowerShell execution policy yet, [do this just like in the exporting action.](#using-the-export-script-to-migrate-group-policies)

After succesfully executing the script, our GPO is available and ready to link to our OU. This is the only task what we have to do manually.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/migrate-group-policy-objects-to-a-new-server-or-domain-like-a-pro-324/jv-media-324-60f5fff319c8.png)

---

## Summary

These 2 scripts will export and import our Group Policy easy for migration. Unfortunately Microsoft does not offer a native and easy solution for this.

I have used this script multiple times and I am very satisfied.

Thank you for reading this page and hope it was interesting and helpful.

{{\< ads >}}

{{\< article-footer >}}