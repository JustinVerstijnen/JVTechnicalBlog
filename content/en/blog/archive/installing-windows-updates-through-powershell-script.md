---
title: "Installing Windows Updates through PowerShell (script)"
date: 2025-07-27
slug: "installing-windows-updates-through-powershell-script"
categories:
  - Powershell
tags:
  - Tools and Scripts
---
Sometimes we want to install updates by hand because of the need for fast patching. But logging into every server and installing them manually is a hell of a task and takes a lot of time.

I have made a very simple script to install Windows Updates by hand using PowerShell including logging to exactly know which updates there were installed for monitoring later on.

The good part about this script/PowerShell module is that it does support both Windows Client and Windows Server installations.

---

## Where to download this script?

For the fast pass, my script can be downloaded here:

[Download script from GitHub](https://github.com/JustinVerstijnen/JV-ServerPeriodicInstallUpdates)

---

## What does the Windows Updates script do?

The script I have made focusses primarily on searching for and installing the latest Windows Updates. It also creates a log file to exactly know what updates were installed for monitoring and documentation purposes.

The script itself has 6 steps:

1. Ensuring it runs as Administrator
2. Enable logging
   - Saves a log file in the same directory and with 100KB limit
3. Searching Windows Updates and installing them
4. Rebooting server to apply latest updates

---

## How to install the Windows Updates script automatically

For installation with Task Scheduler I included an installation script that, by default, configures a task in the Windows Task Scheduler that runs it;

- Every first day of the month
- At hour 03:00

If these settings are great for you, you can leave them as-is.

The Installation script creates a folder in C:\ named "Scripts" if not already there and places the cleaning script there.

### Installation

Click on the blue button above. You now are on the Github page of the script.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/installing-windows-updates-through-powershell-script-3614/jv-media-3614-0ceb1a8a2ba0.png)

Click on "Code" and then "Download ZIP".

Now place the files on the server where you want to install the script.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/installing-windows-updates-through-powershell-script-3614/jv-media-3614-754a4eca6afa.png)

Unzip the file and then we can run the "Install" script. This must be run as administrator and temporarily without Execution Policy.

Open Powershell ISE as administrator.

Now open the "Install" script.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/installing-windows-updates-through-powershell-script-3614/jv-media-3614-06723875d442.png)

Review it's default settings and if you feel at home in PowerShell, review the rest of the script to understand what it does.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/installing-windows-updates-through-powershell-script-3614/jv-media-3614-10c2ae562340.png)

You can change the schedule very easily by changing the runtime: 0:00 till 23:59 and the day of month to specify the day number of the month (1-31).

After your schedule is ready, let's ensure we temporarily bypass the Execution Policy by typing the command in the blue window below:

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
Set-ExecutionPolicy Unrestricted -Scope Process
{{< /card >}}

This way the execution policy stays enabled but for this session only it's been lowered. When you close the window, you have to type this again before be able to run scripts.

Execute the command, and when prompted to lower the policy, click Yes.

Now execute the Install script by clicking the green "Run" button:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/installing-windows-updates-through-powershell-script-3614/jv-media-3614-2f79db1ca1e7.png)

After executing the script, we get the message that the task has been created succesfully:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/installing-windows-updates-through-powershell-script-3614/jv-media-3614-edc5506b3c66.png)

Let's check this in the Windows Task Scheduler:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/installing-windows-updates-through-powershell-script-3614/jv-media-3614-d784dbdb3f5d.png)

As you can see, the script is succesfully installed to Task Scheduler. This ensures it runs every first of the month at 03:00 (or at your own defined schedule). Also, the script has been placed in C:\Scripts for a good overview of the scripts of the system.

---

## How to install the Windows Update script manually

If you want to define your own schedule and script location, it can be better to install the script yourself or only using it when you need it.

Click on the blue Download button at the beginning of the page.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/installing-windows-updates-through-powershell-script-3614/jv-media-3614-0ceb1a8a2ba0.png)

Click on "Code" and then "Download ZIP".

Then place the ZIP file on the server where you want to install the disk cleanup script.

### Move the script to the right location

Select the script and place it in your preferred location. My advice is to not install this in a user profile, but in a location accessible for all users. Like C:\Scripts.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/installing-windows-updates-through-powershell-script-3614/jv-media-3614-e6f20bd4ff30.png)

I have placed the scipt into the correct folder. If you also want the script to run on a schedule, open up the "Task Scheduler" (taskschd.msc).

### Creating the scheduled task

Do a "Right-mouse click" on the empty space and click on "Create New Task...".

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/installing-windows-updates-through-powershell-script-3614/jv-media-3614-52c360ba7351.png)

Give the task a name and description that alings with your documentation.

Then change the user to "SYSTEM" to run this in SYSTEM context for the highest privileges:

Then check the "Run with highest privileges" and select the highest OS possible in the "Configure for" dropdown menu.

### Configure script trigger

Go to the "Triggers" tab and add a new trigger.

Select "Monthly" and select all months. Then change the "Days" field to 1 to run it on the first day.

{{% alert color="info" %}}
You can defer from this schedule if your environment needs that. This is just an example.
{{% /alert %}}

Now the page looks like this:

### Configure script action

Click "OK" and go to the "Actions" tab. Create a new action.

In the "Program/Script" field, type in the following:

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
powershell.exe
{{< /card >}}

In the "Add arguments (optional):" field, type in the following:

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
-ExecutionPolicy Bypass -File C:\Scripts\JV-ServerPeriodicInstallUpdates.ps1
{{< /card >}}

Now click on "OK" twice to create the task.

### Testing the task

Now we can manually run the task to ensure it runs on a schedule too. Right click the task and click on "Run" to start the task.

As we can see, the script runs succesfully as it still runs after 30 seconds. This means the task and permissions are correct.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/installing-windows-updates-through-powershell-script-3614/jv-media-3614-862330fa7685.png)

The script can take up to several hours when cleaning everything, depending on the server size.

In the folder of the script, a log file is created:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/installing-windows-updates-through-powershell-script-3614/jv-media-3614-ee84aab2d2f6.png)

Every update installed will be logged for documentation and monitoring purposes. This can come in handy when an update unfortunately brings bugs with it so we can search for and remove this update.

---

## Summary

Installing Windows Updates is critical for maintaining and securing your servers. In the history of IT, we did very often wait till we installed updates because of possible errors or misfunctioning with our applications but the price you pay with this approach, not being secured against zero day threats and vulnerabilities is much higher. We can't install updates to much.

This script is useful when doing update installations by hand. When searching for automatic installation of Windows Updates in Azure, I would recommend using [Azure Update Manager](https://justinverstijnen.nl/using-azure-update-manager-to-manage-updates-at-scale/).

### Sources

These sources helped me by writing and research for this post;

1. <https://www.powershellgallery.com/packages/pswindowsupdate/2.2.1.5>

{{< ads >}}

{{< article-footer >}}
