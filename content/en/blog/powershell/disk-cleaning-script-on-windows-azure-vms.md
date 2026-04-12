---
title: "Disk cleaning script on Windows Azure VMs"
date: 2025-06-28
slug: "disk-cleaning-script-on-windows-azure-vms"
categories:
  - Powershell
tags:
  - Tools and Scripts
description: >
  On Windows Servers, a critical point is maintaining the disk space. If a disk fills up to the end, several errors can occur and impacting...
---
On Windows Servers, a critical point is maintaining the disk space. If a disk fills up to the end, several errors can occur and impacting the end-users experience of your applications. Something we definitely not want.

To help reducing this chance, I have created a PowerShell script that cleans up your server using built in tools of Windows. In this post, I will explain what the script does, how to install it and how to use it.

---

---

## Where do download this script?

For the fast pass, my script can be downloaded here:

[Download script from GitHub](https://github.com/JustinVerstijnen/JV-ServerPeriodicDiskCleanup)

---

## What does the disk cleanup script do?

The script I have made focusses primarily on cleaning up some folders we don't need for the server to work. This consists of:

- Windows Update download cache of already installed updates
- TEMP folders
- Unused drivers
- Unused Event logs
- Google Chrome browsing cache
- Microsoft Edge browsing cache
- Recycle bins

The script itself has 6 steps:

1. Ensuring it runs as Administrator
2. Enable logging
   - Saves a log file in the same directory and with 100KB limit
3. Running Windows Cleanmgr-tool
4. Simulating the Cleanmgr tool for all other local drives
5. Deleting unused device drivers
6. Removing cache for Chrome and Edge
7. Rebooting the server.

---

## How to install the Disk cleaning script Automatically

For installation with Task Scheduler I included an installation script that, by default, configures a task in the Windows Task Scheduler that runs it;

- Every first day of the month
- At hour 03:00

If these settings are great for you, you can leave them as-is.

The Installation script creates a folder in C:\ named "Scripts" if not already there and places the cleaning script there.

### Installation

Click on the blue button above. You now are on the Github page of the script.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/disk-cleaning-script-on-windows-azure-vms-1276/jv-media-1276-124a84eaa9eb.png)

Click on "Code" and then "Download ZIP".

Now place the files on the server where you want to install the script.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/disk-cleaning-script-on-windows-azure-vms-1276/jv-media-1276-ddcc9123190d.png)

Unzip the file and then we can run the "Install" script. This must be run as administrator and temporarily without Execution Policy.

Open Powershell ISE as administrator.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/disk-cleaning-script-on-windows-azure-vms-1276/jv-media-1276-abb9c2951099.png)

Now open the "Install" script.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/disk-cleaning-script-on-windows-azure-vms-1276/jv-media-1276-2af30938721b.png)

Review it's default settings and if you feel at home in PowerShell, review the rest of the script to understand what it does.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/disk-cleaning-script-on-windows-azure-vms-1276/jv-media-1276-f3c0b123c54a.png)

You can change the schedule very easily by changing the runtime: 0:00 till 23:59 and the day of month to specify the day number of the month (1-31).

After your schedule is ready, let's ensure we temporarily bypass the Execution Policy by typing the command in the blue window below:

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
Set-ExecutionPolicy Unrestricted -Scope Process
{{< /card >}}

This way the execution policy stays enabled but for this session only it's been lowered. When you close the window, you have to type this again before be able to run scripts.

Execute the command, and when prompted to lower the policy, click Yes.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/disk-cleaning-script-on-windows-azure-vms-1276/jv-media-1276-6339e6e403bb.png)

Now execute the Install script by clicking the green "Run" button:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/disk-cleaning-script-on-windows-azure-vms-1276/jv-media-1276-0c76057f8ec1.png)

After executing the script, we get the message that the task has been created succesfully:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/disk-cleaning-script-on-windows-azure-vms-1276/jv-media-1276-1f68c43db92c.png)

Let's check this in the Windows Task Scheduler:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/disk-cleaning-script-on-windows-azure-vms-1276/jv-media-1276-c97dc8c16bfa.png)

As you can see, the script is succesfully installed to Task Scheduler. This ensures it runs every first of the month at 03:00 (or at your own defined schedule). Also, the script has been places in C:\Scripts for a good overview of the scripts of the system.

---

## How to install the Disk cleaning script manually

If you want to define your own schedule and script location, it can be better to install the script yourself or only using it when you need it.

Click on the blue Download button at the beginning of the page.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/disk-cleaning-script-on-windows-azure-vms-1276/jv-media-1276-124a84eaa9eb.png)

Click on "Code" and then "Download ZIP".

Then place the ZIP file on the server where you want to install the disk cleanup script.

### Move the script to the right location

Select the script and place it in your preferred location. My advice is to not install this in a user profile, but in a location accessible for all users. Like C:\Scripts.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/disk-cleaning-script-on-windows-azure-vms-1276/jv-media-1276-f1add1017f51.png)

I have placed the scipt into the correct folder. If you also want the script to run on a schedule, open up the "Task Scheduler" (taskschd.msc).

### Creating the scheduled task

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/disk-cleaning-script-on-windows-azure-vms-1276/jv-media-1276-1df7d56f3806.png)

Do a "Right-mouse click" on the empty space and click on "Create New Task...".

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/disk-cleaning-script-on-windows-azure-vms-1276/jv-media-1276-348875edb112.png)

Give the task a name and description that alings with your documentation.

Then change the user to "SYSTEM" to run this in SYSTEM context for the highest privileges:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/disk-cleaning-script-on-windows-azure-vms-1276/jv-media-1276-c6c18f9fa7db.png)

Then check the "Run with highest privileges" and select the highest OS possible in the "Configure for" dropdown menu.

### Configure script trigger

Go to the "Triggers" tab and add a new trigger.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/disk-cleaning-script-on-windows-azure-vms-1276/jv-media-1276-fafe7b477e51.png)

Select "Monthly" and select all months. Then change the "Days" field to 1 to run it on the first day.

{% alert color="info" %}
You can defer from this schedule if your environment needs that. This is just an example.
{% /alert %}

Now the page looks like this:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/disk-cleaning-script-on-windows-azure-vms-1276/jv-media-1276-8e35e0f371e5.png)

### Configure script action

Click "OK" and go to the "Actions" tab. Create a new action.

In the "Program/Script" field, type in the following:

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
powershell.exe
{{< /card >}}

In the "Add arguments (optional):" field, type in the following:

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
-ExecutionPolicy Bypass -File C:\Scripts\JV-ServerPeriodicDiskCleanup.ps1
{{< /card >}}
![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/disk-cleaning-script-on-windows-azure-vms-1276/jv-media-1276-e54f48edbd99.png)

Now click on "OK" twice to create the task.

### Testing the task

Now we can manually run the task to ensure it runs on a schedule too. Right click the task and click on "Run" to start the task.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/disk-cleaning-script-on-windows-azure-vms-1276/jv-media-1276-33d36f0fd528.png)

As we can see, the script runs succesfully as it still runs after 30 seconds. This means the task and permissions are correct.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/disk-cleaning-script-on-windows-azure-vms-1276/jv-media-1276-0a1b4dc58c68.png)

The script can take up to several hours when cleaning everything, depending on the server size.

In the folder of the script, a log file is created:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/disk-cleaning-script-on-windows-azure-vms-1276/jv-media-1276-2acc74f58076.png)

---

## Summary

I think it's a great way to use scripts like these once per month on your server. We can better be pro-actively cleaning up our servers than waiting till some issue occurs. However, my advice is to not run this script too often. Once or twice per month is good enough.

We IT guys' work is to minimize disruptions and ensure end users don't need to call us. If we IT guys are completely invisible and users think: "What are those guys even doing?", then we do your jobs correctly.

Thank you for reading this post and I hope it was helpful.

### Sources

These sources helped me by writing and research for this post;

1. <https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/cleanmgr>

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
