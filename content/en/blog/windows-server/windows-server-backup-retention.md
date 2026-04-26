---
title: "Windows Server Backup Retention"
date: 2024-04-30
tags:
- Step by Step Guides
categories:
- Windows Server
slug: "windows-server-backup-retention"
---

For more information about the wbadmin tool, see:

[https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/wbadmin](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/wbadmin)

## The Script

With this small script based on wbadmin we can remove old backups while keeping the last 30 items for example. This retains the data for 30 days while also keeping your storage nice and clean.

The script itself consists of the following command:

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
wbadmin delete backup -keepVersions:30 -quiet
{{< /card >}}

### Explanation of the command

- **wbadmin:** The command-line tool that makes this solution possible. It is part of Windows Server Backup.
- **delete:** Indicates that a delete operation should be performed.
- **backup:** Specifies what should be deleted: backups.
- **-keepVersions:30** Keeps the 30 most recent backups and deletes all older backups.
- **-quiet:** Prevents confirmation prompts (Y/N) and avoids showing a command window to interactive users.

You can change the amount of backups to keep according to your needs and storage by changing the 30 to a lower or higher number.

## Scheduled Task

Using this script, you can create a scheduled task that runs the cleanup automatically at a fixed interval.

Make sure the task runs outside the regular backup window, as running it during an active backup may cause issues. Preferably before creating backups so the storage is cleaned prior to writing new data on it.

To open the Windows Task Scheduler:

- Type “Task Scheduler” in the Start menu, or
- Run taskschd.msc

The perform the following tasks:

- Configure the task schedule according to your maintenance window
- Configure the task action to run the batch file located in C:\Scripts

{{< ads >}}

{{< article-footer >}}