---
title: "Getting started with PowerShell"
slug: "getting-started-with-powershell"
date: 2024-07-27
tags:
- Concepts
- Knowledge check
categories:
- PowerShell
description: "PowerShell is a powerful command-line shell and scripting language that can help you inspect systems, automate repetitive tasks, and manage computers more efficiently. At first, a command-line interface can look intimidating. Fortunately, PowerShell is designed around a fairly consistent command structure, making it easier to learn than it may first appear. This article introduces the basic concepts of PowerShell and includes a few simple commands that you can try yourself."
---

## 1: What is PowerShell?

PowerShell is both a command-line shell and a scripting language. You can use it interactively by entering one command at a time, or you can combine multiple commands into scripts to automate larger tasks.

Common use cases include:

- Checking system information
- Managing files and folders
- Troubleshooting network connections
- Automating repetitive tasks
- Managing Windows environments
- Processing and exporting data

One of the most useful things about PowerShell is that its commands usually return objects instead of plain text. This means that the output can easily be filtered, sorted, selected, and passed to another command. I will dive into this later.

---

## 2: How PowerShell commands work

PowerShell commands are commonly called cmdlets. Almost all of those cmdlets follow a simple naming convention:

**Verb-Noun**

The verb describes the action, while the noun describes what the command works with separated by a - and mostly typed in CamelCase where every syllable starts with a capital letter.

Some examples of PowerShell commands include:

- `Get-Item`
- `Get-Process`
- `Get-Service`
- `Test-NetConnection`
- `Write-Output`

The `Get` verb is especially common because it is used to retrieve information. For example, the following command shows a list of running processes:

{{< card code=true header="**PowerShell**" lang="powershell" >}}
Get-Process
{{< /card >}}

You do not need to remember every PowerShell command. PowerShell can help you discover commands as you go.

To list available commands, use:

{{< card code=true header="**PowerShell**" lang="powershell" >}}
Get-Command
{{< /card >}}

To get help for a specific command you don't remember the options or variables for, use:

{{< card code=true header="**PowerShell**" lang="powershell" >}}
Get-Help Get-Process
{{< /card >}}

You see, PowerShell is a really simple approach for very deep and forcefull computer and server administration tasks.

---

## 3: Windows PowerShell and PowerShell

You may come across two different names:

- **Windows PowerShell**
- **PowerShell**

Windows PowerShell is the older Windows-only edition that is included with many Windows systems. Modern PowerShell (version 7 at the time of writing) is cross-platform and can run on Windows, Linux, and macOS. For basic commands, the experience is often very similar. Some Windows-specific commands, however, are only available on Windows.

You can check which version you are currently using with by printing this variable:

{{< card code=true header="**PowerShell**" lang="powershell" >}}
$PSVersionTable
{{< /card >}}

---

## 4: Demo time - Simple PowerShell commands to try

The best way to learn PowerShell is to try a few commands yourself. Open (Windows) PowerShell on your computer and type in these simple commands:

### 4.1: Show the computer name

The following command displays the name of the computer:

{{< card code=true header="**PowerShell**" lang="powershell" >}}
$env:COMPUTERNAME
{{< /card >}}

### 4.2 Show the current date and time

Use `Get-Date` to display the current date and time:

{{< card code=true header="**PowerShell**" lang="powershell" >}}
Get-Date
{{< /card >}}

You can also pre-format the output:

{{< card code=true header="**PowerShell**" lang="powershell" >}}
Get-Date -Format "yyyy-MM-dd HH:mm:ss"
{{< /card >}}

4.3 Show the current user

The following command displays the currently signed-in user:

{{< card code=true header="**PowerShell**" lang="powershell" >}}
$env:USERNAME
{{< /card >}}

### 4.4 Check free disk space

This command shows the available file system drives:

{{< card code=true header="**PowerShell**" lang="powershell" >}}
Get-PSDrive -PSProvider FileSystem
{{< /card >}}

The output includes the amount of used and free space.For a more readable overview in gigabytes, you can use:

{{< card code=true header="**PowerShell**" lang="powershell" >}}
Get-PSDrive -PSProvider FileSystem |
    Select-Object Name,
        @{Name="UsedGB"; Expression={[math]::Round($_.Used / 1GB, 2)}},
        @{Name="FreeGB"; Expression={[math]::Round($_.Free / 1GB, 2)}}
{{< /card >}}

### 4.5 Show running processes

To view running processes:

{{< card code=true header="**PowerShell**" lang="powershell" >}}
Get-Process
{{< /card >}}

You can for example sort the processes by memory usage:

{{< card code=true header="**PowerShell**" lang="powershell" >}}
Get-Process |
    Sort-Object WorkingSet -Descending |
    Select-Object -First 10 Name, Id, WorkingSet
{{< /card >}}

### 4.6 Test a network connection

You can use PowerShell to test whether a remote system is reachable:

{{< card code=true header="**PowerShell**" lang="powershell" >}}
Test-NetConnection justinverstijnen.nl
{{< /card >}}

To test a specific TCP port:

{{< card code=true header="**PowerShell**" lang="powershell" >}}
Test-NetConnection justinverstijnen.nl -Port 443
{{< /card >}}

This can be useful when troubleshooting network or application connectivity. The `Test-NetConnection` command also has a more simpeler alias which does the same but saves you some typing:

{{< card code=true header="**Bash**" lang="bash" >}}
tnc justinverstijnen.nl -Port 443
{{< /card >}}

---

## 5. The pipeline

One of the most important PowerShell concepts is the pipeline. The pipeline uses the `|` character to send the output of one command to another command.

For example:

{{< card code=true header="**PowerShell**" lang="powershell" >}}
Get-Process | Sort-Object CPU -Descending
{{< /card >}}

This command:

1. Retrieves the running processes.
2. Sends those processes to `Sort-Object`.
3. Sorts them by CPU usage.

You can continue adding commands to the pipeline. For example, this displays the five processes with the highest CPU value:

{{< card code=true header="**PowerShell**" lang="powershell" >}}
Get-Process |
    Sort-Object CPU -Descending |
    Select-Object -First 5
{{< /card >}}

---

## 6. Variables

A variable stores a value so that you can use it again later. PowerShell variables start with a `$` symbol.

For example:

{{< card code=true header="**PowerShell**" lang="powershell" >}}
$ComputerName = $env:COMPUTERNAME

Write-Output "This computer is called $ComputerName"
{{< /card >}}

Variables can contain many different types of data, including:

| Type | Description | Example |
| --- | --- | --- |
| String | Text | `"Hello"` |
| Integer | A whole number | `42` |
| Boolean | True or false | `$true` |
| Array | A collection of values | `1, 2, 3` |
| Object | Structured data returned by PowerShell commands | `Get-Process` |

---

## 7. Commands and scripts

You can use PowerShell interactively by entering commands one at a time. This is useful for quick checks and troubleshooting. When you need to repeat the same steps, you can save the commands in a PowerShell script with the `.ps1` file extension.

For example, the following script creates a small system summary:

{{< card code=true header="**PowerShell**" lang="powershell" >}}
$ComputerName = $env:COMPUTERNAME
$UserName = $env:USERNAME
$CurrentTime = Get-Date

Write-Output "Computer name: $ComputerName"
Write-Output "Current user: $UserName"
Write-Output "Current time: $CurrentTime"
{{< /card >}}

A script can start very small. Over time, you can add variables, conditions, loops, functions, logging, and error handling.

---

## 8. A simple example with a condition

PowerShell can make decisions by using an `if` statement. The following example checks the free space on the `C:` drive:

{{< card code=true header="**PowerShell**" lang="powershell" >}}
$Drive = Get-PSDrive -Name C
$FreeSpaceGB = [math]::Round($Drive.Free / 1GB, 2)

if ($FreeSpaceGB -lt 20) {
    Write-Output "Warning: Only $FreeSpaceGB GB of free space remains."
}
else {
    Write-Output "There is $FreeSpaceGB GB of free space available."
}
{{< /card >}}

This is a simple example of how PowerShell can retrieve information, evaluate it, and return a different result depending on the situation.

---

## 9. Useful tools for writing PowerShell

You can write PowerShell commands and scripts in many different editors. Common options include:

- Windows Notepad
- Notepad++
- Visual Studio Code
- Windows PowerShell ISE

For beginners, Visual Studio Code is a popular option because it provides syntax highlighting, suggestions, and extensions for working with PowerShell. For very small commands, however, the PowerShell terminal itself is often enough.

---

## 10. A few tips for beginners

Start with small commands and inspect the output before building larger scripts. Scripts doesn't have to be that complex at first. Use `Get-Help` when you want to learn how a command works:

{{< card code=true header="**PowerShell**" lang="powershell" >}}
Get-Help Get-Process -Examples
{{< /card >}}

Use `Get-Member` to discover which properties and methods an object contains:

{{< card code=true header="**PowerShell**" lang="powershell" >}}
Get-Process | Get-Member
{{< /card >}}

And remember: you do not need to memorize everything. Knowing how to discover commands and inspect their output is one of the most important PowerShell skills.

{{% alert title="Info" color="info" %}}
Be careful when running commands that change or remove data. Before using an unfamiliar command, read its help documentation and test it in a safe environment whenever possible.
{{% /alert %}}

---

## Knowledge check

{{< quiz >}}
{
  "intro": "Answer these question(s) to test your understanding of this post. Your answers are not saved or sent anywhere; this is simply a personal knowledge check. If you refresh the page, your answers will be cleared.",
  "questions": [
    {
      "question": "What is PowerShell?",
      "reference": "What is PowerShell?",
      "referenceUrl": "#what-is-powershell?",
      "answers": [
        {
          "text": "A command-line shell and a scripting language",
          "correct": true,
          "message": "Correct! This is the right answer."
        },
        {
          "text": "A CLI interface only",
          "correct": false,
          "message": "Incorrect. Review the referenced section and try again."
        },
        {
          "text": "A scripting language only",
          "correct": false,
          "message": "Incorrect. Review the referenced section and try again."
        }
      ]
    },
    {
      "question": "What is the basic convention of PowerShell commands?",
      "reference": "How PowerShell commands work",
      "referenceUrl": "#how-powershell-commands-work",
      "answers": [
        {
          "text": "A Noun-Verb convention",
          "correct": false,
          "message": "Incorrect, reversed."
        },
        {
          "text": "An action",
          "correct": false,
          "message": "Incorrect. Review the referenced section and try again."
        },
        {
          "text": "A single-label command like ipconfig",
          "correct": false,
          "message": "Incorrect, this is how CMD did this in the past."
        },
        {
          "text": "A Verb separated by a - and followed by a Noun",
          "correct": true,
          "message": "Correct! This is the right answer."
        }
      ]
    },
    {
      "question": "What is NOT a correct PowerShell command?",
      "reference": "How PowerShell commands work",
      "referenceUrl": "#how-powershell-commands-work",
      "answers": [
        {
          "text": "Get-Item",
          "correct": false,
          "message": "Incorrect. Review the referenced section and try again."
        },
        {
          "text": "Get-Process",
          "correct": false,
          "message": "Incorrect. Review the referenced section and try again."
        },
        {
          "text": "net use * /delete",
          "correct": true,
          "message": "Correct! This is the right answer."
        },
        {
          "text": "Test-NetConnection",
          "correct": false,
          "message": "Incorrect. Review the referenced section and try again."
        },
        {
          "text": "Write-Host",
          "correct": false,
          "message": "Incorrect. Review the referenced section and try again."
        }
      ]
    }
  ]
}
{{< /quiz >}}

---

## Summary

PowerShell can be used for anything from a quick system check to large-scale automation.

The most important concepts to remember are:

- Commands usually follow the `Verb-Noun` naming convention.
- PowerShell works with objects.
- The pipeline connects commands.
- Variables store values for later use.
- Scripts allow you to repeat and automate tasks.

You do not need to start with complex automation. A few simple commands are enough to begin learning how PowerShell works. Try checking your computer name, the current time, your free disk space, or the running processes. From there, you can gradually combine commands and build your own scripts.

Thank you for reading this post and I hope it was helpful!

{{< ads >}}

{{< article-footer >}}