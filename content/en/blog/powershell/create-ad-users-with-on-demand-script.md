---
title: "Create AD users with on demand script"
date: 2024-12-27
slug: "create-ad-users-with-on-demand-script"
categories:
  - Powershell
tags:
  - Tools and Scripts
description: >
  Today I have a PowerShell script that creates users by asking the user what to fill in. This works by having a fully prepared "New-ADUser" command with all the properties filled in to have all users using the same attributes.
---
Today I have a PowerShell script that creates users by asking the user what to fill in. This works by having a fully prepared "New-ADUser" command with all the properties filled in to have all users using the same attributes.

I will explain how this script works on this page.

---

---

## The create AD users on demand script

For the fast pass, the script can be downloaded from my GitHub page:

[Download script from GitHub](https://github.com/JustinVerstijnen/JV-CreateADUsersOnDemand)

---

## The script described

The script is relatively easy and consists of 4 steps:

1. Importing the modules needed
2. Asking the user about on what details the user must be created
3. Making everything ready, creates the user and adds him to the defined security groups
4. Prints everything in the command window for a summary

---

## Parameters and Attributes

The script contains a set of pre-defined attributes which you can change to your own settings:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/create-ad-users-with-on-demand-script-3685/jv-media-3685-708348197460.png)

You can change all of these settings, but I advice you to not change any $variables because that will break the script.

On line 12 to 14, you have a parameter that specifies the OU to create the user in:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/create-ad-users-with-on-demand-script-3685/jv-media-3685-b6fda0ca6fba.png)

Change this to your own OU when using. You can find this by enabling the "Advanced Features" in the "View" menu and then going to the OU properties and the "Attributes".

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/create-ad-users-with-on-demand-script-3685/jv-media-3685-8e0911209cc4.png)

Search for the "DistinguishedName" attribute and copy that value.

---

## Using the create AD users on demand script

To use my create ad users script, go to my GitHub page and download the script there:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/create-ad-users-with-on-demand-script-3685/jv-media-3685-b8ebf60bbf7d.png)

Click on "Code" and then on "Download ZIP".

Then place the ZIP file on your Active Directory management server.

Open PowerShell ISE as Administrator:

Verify your credentials if needed and then use the "Open" function of PowerShell ISE and open the script file:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/create-ad-users-with-on-demand-script-3685/jv-media-3685-ad901a5a5b5a.png)

Review:

1. The parameters and set the correct OU (line 12 to 14)
2. The attributes for the user (line 41 to 57)

Correct those if needed.

Before we can run the script, we have to do a one-time bypass for the Powershell Execution Policy by typing the command in the blue window below:

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
Set-ExecutionPolicy Unrestricted -Scope Process
{{< /card >}}

This way the execution policy stays enabled but for this session only it's been lowered. When you close the window, you have to type this again before be able to run scripts.

Execute the command, and when prompted to lower the policy, click Yes.

Now we can run the script itself by clicking the green "Play" button.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/create-ad-users-with-on-demand-script-3685/jv-media-3685-8ccaaddd148b.png)

Now the script will ask the details for the user:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/create-ad-users-with-on-demand-script-3685/jv-media-3685-16d98a8d268c.png)

After filling this in and hit Enter, the user will be created almost instantly:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/create-ad-users-with-on-demand-script-3685/jv-media-3685-ab212d3eb337.png)

Now let's take a look in the Active Directory Users and Computers snap-in (dsa.msc):

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/create-ad-users-with-on-demand-script-3685/jv-media-3685-af4be77dd486.png)

The user is succesfully created in the desired OU and Group1 has been added to the member of list. Also the extra attributes has been added to the user:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/create-ad-users-with-on-demand-script-3685/jv-media-3685-ad4376d5a168.png)

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/create-ad-users-with-on-demand-script-3685/jv-media-3685-acb968679fbf.png)

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/create-ad-users-with-on-demand-script-3685/jv-media-3685-6759df29e1fc.png)

---

## Summary

This script can ultimately be used when all users must be created in the same way. Let's say, the emailaddress field must always be filled in, or the address or department. Those are steps that often will be skipped in real life. Using a pre-determined script will ensure this is always filled in.

Thank you for reading this post and I hope it is helpful.

### Sources

These sources helped me by writing and research for this post;

1. <https://learn.microsoft.com/en-us/powershell/module/activedirectory/new-aduser?view=windowsserver2025-ps>

{{< ads >}}

{{< article-footer >}}
