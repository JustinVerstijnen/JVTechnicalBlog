---
title: "Solved - Windows Store applications on FSLogix/Azure Virtual Desktop"
slug: "microsoft-store-applications-on-azure-virtual-desktop-fslogix"
date: 2026-07-01
tags:
- Step by Step guides
categories:
- Azure Virtual Desktop
description: "By default, Microsoft Store applications are not supported when using FSLogix. The root cause is that Windows stores some metadata that is not roamed in the profile folder and cleared at every new logon. You will encounter this behaviour in every environment where you use FSLogix. Now a long time I told our end users that there unfortunately is no solution possible to install apps (like WhatsApp) and make them persistent across Azure Virtual Desktop sessions but someday I found a workaround to deal with this problem. I will explain this workaround at this page."
hidden: false
---

## Requirements

- Around 15 minutes of your time
- An Azure Virtual Desktop or Remote Desktop Services environment with FSLogix
- Some basic knowledge about Windows, Azure and Active Directory
- Session host must have winget installed

---

## The problem described

So the problem with Microsoft Store applications on any FSLogix based system is that the application can be installed like expected and they will work. After signing out of the session and logging in again, the applications will be gone. Under water, the applications are still installed on the computer, only Windows doesn't know to show them to the user.

The fun fact is, the application data is stored in the user profile. You can test this by for example download the application WhatsApp and login to your WhatsApp account. Log off the machine and sign in again. Download the application and you will be logged into WhatsApp automatically.

So, the application manifest of Windows which contains what applications are available to the user cleans up after logging out, but the data is persistent.

{{% alert title="Info" color="info" %}}
Source: [https://learn.microsoft.com/en-us/fslogix/troubleshooting-appx-issues](https://learn.microsoft.com/en-us/fslogix/troubleshooting-appx-issues)
{{% /alert %}}

---

## My solution described

Now that we know more about the underlying problem, we can come to a solution to it. My solution is relatively simple; a log-on script that uses winget and installs all the needed packages at sign in of the user. This also has some advantages because we of IT are in control what people and install or not. We can completely disable the Microsoft Store and only use this "allowed" packages.

For installing this Microsoft Store applications, we use Winget. This is a built-in (from 24H2) package manager for Windows which can download and install these applications.

<!-- draw.io diagram -->
<div class="drawio-white-background" style="background:#ffffff; padding:24px; border-radius:12px; overflow-x:auto;">
<iframe frameborder="0" style="width:100%;height:232px;" src="https://app.diagrams.net/?tags=%7B%7D&amp;title=Diagram%20zonder%20titel.drawio&amp;dark=auto#R%3Cmxfile%3E%3Cdiagram%20name%3D%22Pagina-1%22%20id%3D%22G-B0GiIbyG5q_R7ckI7L%22%3E7Vpdc5s4FP01flyP%2BMaPtpN2u5PudNezbdMXjwwyaAKIARE7%2FfWrL2yQcOxk7NSZaSaJ0RW6wL1H5x4Jj5x5vv1YwTL9TGKUjWwQb0fOzci2beD67INbnqTFsoCyJBWOlW1vWOCfSBmBsjY4RnXvREpIRnHZN0akKFBEezZYVWTTP21Nsv5VS5ggw7CIYGZav%2BGYpu1j%2BJN9x58IJ6m6dGgHsiOH7cnqSeoUxmTTMTm3I2deEULlUb6do4xHr42LHPfhQO%2FuxipU0FMGLP5d2vn91x%2FN%2Bq%2B%2FV9Pmn%2FuPt4s%2FBrwoU02f2hjgXARpButShniNt4h5naU0z1jT4n0ZTgp2HDE%2FqGKGNSmoSqfFnnWmnNzgPGH3mOEV%2Bw9%2FNhXitxyRvGwoYkdfcUUbmC0%2FwyjFBRrXjwkbXBJcUJFJb8Z%2Bwdgb2XMg%2Fjx2h%2FOdzerbeEud29qsARsYT0JhGQMOz15PMOB2bA8ZgWX4YL%2FOLIMrlH1BFc6RCI2IlwzyI8waFWRlQBVF204iVC4%2FIsJGV0%2FslLSDNt%2BVwzZ7aLbAVE488azc0M7AFo9QzYxk53oPHnag8PMCLNnXgSVxsKwpjB5Y678aVctFs6qjCpcUk6I%2BBCnX8Q%2BAagePLgKAOwykSSjtk4nW4wNbwsPXxwjO4FeZBDqkbOlt4uuwtH0FtuCtsOb4BtacYAz6cLOAgTc3vBDenFPwxp6Q9tG1STFFixJG%2FIwNK1vMVtOKPKA5yQiPWUEKDtE1zjLNZCCTxxCzajFVHTmOY37pWUWaIubAvgFDGeCwZJaMJDV%2FzEKUNfZvysHLPr9%2BEjTIjm5Q%2FUBJ%2BbqUASNlVgB66dkV2rOnR1ETio0Ca%2BaLNFWEjlNLJ6%2BoiKe8vO9zE8M6FQG3%2BvnuZyJGa9hk9I7PkxmjiER0t2mWakDNIhjHuEjEOD7bGSAyspkWjHw4jyjvEjmtNODkhLaYfuejBKPI9r26Oj%2B%2B2XYbT51Gd94KW8Hy8L3buJd%2BQ6s17J2J1lO3pbtT6glWCaLPxNobpIvngeYpEFUoY8F57Ce8gz7vGbCpK3zhvNwhFLOA6YQi0aPGdQWQ5soOj7qSwTFcCfzvHv31U8K7jgq5V1uLiE2ZJkPxcho9WxxVsdGrkDQHwZDs4ig1hVfgGHUxlHXRskK9Lg5qLwAccX7oGNXS0h1dXH%2BFpv4KewXRnhigs%2FwLMa7%2FjgviHUmIqIKwfuBE0hS8MErVdrba54J%2BblxPy40NnAvlJjglN%2FUDolGqQqTPwQFxah9aBum2wDRa5mmnLnSGbANT1TqwHrO9AeOQLRhaudnHl3OWNlqwwO9wnjWcpKEZW5%2FPd9suQCOIke3EEIXryGAT1uNHIVqtu6INdLhDiLMvpMZKZ60IpSQfIBeuiwc4qMNtel0UbTXhwFCRrVNY8s58m%2FAdrTHc1O64QlJjfIr4%2FcxYUx71z2JlNYdFvORxWWJ%2BL2vBqW%2B9AeD2SM4NLKMAXWpFFr5A8r8HKX9VSthxz6aE3eBXK%2BHJKcC4UqnyjUEJ0Y46AWiLIiao67MJFacvVFwnfDOh0u4HPJ%2BaHm8P1oLnViuZRvBGSl5YAXTS3qBVxvRkPd6kkNawLM3aBMCtH%2FhDtSkWP5elbTcYm8Tt9ZPum5PUDscXS7v1m7svx92eo680Xs3dvn%2FU1YW52zppo%2F9aybtlBPaQcuu1pjDL2IBzcbetTWMj9Rfk7pO2xM1VJqpuH5FcHVmSTuWbSqAr9E42D2v6Q6uAc7P%2BYNkxgKLXBrJe4wiNY%2FTIPupxCqt4GeP64WTC%2F7C4IwneMqMY9hrY2Cb5a6gJ%2BpBx3Esh5iW79O%2BB9s%2B3%2B35VBSR0j73GPbV%2BGJ58zdGlq4f%2FAsQdey%2FUitUrhKa8saNvW1rK%2FjU4Y5GCT50T1CbZQRj6E72YqS%2F47EEiXR6QQZ4%2BXL%2FDk1UQ2Hl6K9yetIN7papnWpYZGyfgyeoWpLDVPxULC0aPXP%2BAdcWqLXvCirB7QWcTRH6%2FtDmOsa55%2BSto1tx%2Fc0qmeP8FNOf2fw%3D%3D%3C%2Fdiagram%3E%3C%2Fmxfile%3E"></iframe>
</div>

---

## Step 1: Preparing the script

In this step we will prepare our environment for the script/solution. Every session host needs to have winget installed. If this is not installed yet, this command must be run once per session host:

{{< card code=true header="**PowerShell**" lang="powershell" >}}
Add-AppxPackage -RegisterByFamilyName -MainPackage Microsoft.DesktopAppInstaller_8wekyb3d8bbwe
{{< /card >}}

This will be done in a few seconds and installs winget on the machine. Then we need to get all the applications we want to install. You can search for applications using winget by using this command:

{{< card code=true header="**PowerShell**" lang="powershell" >}}
winget search applicationname
{{< /card >}}

Where `applicationname` is the name of the application you want to search for. Let's say we want to lookup WhatsApp:

{{< card code=true header="**PowerShell**" lang="powershell" >}}
winget search whatsapp

Agree: Y

Name                            Id                            Version         Match         Source
---------------------------------------------------------------------------------------------------
WhatsApp                        9NKSQGP7F2NH                  Unknown                       msstore
WhatsApp Beta                   9NBDXK71NK08                  Unknown                       msstore
Altus                           AmanHarwara.Altus             5.5.2           Tag: whatsapp winget
Beeper                          Beeper.Beeper                 3.110.1         Tag: whatsapp winget
Wondershare MobileTrans         Wondershare.MobileTrans       4.5.40          Tag: whatsapp winget
ttth                            yafp.ttth                     1.8.0           Tag: whatsapp winget
WhatsappTray                    D4koon.WhatsappTray           1.9.0.0                       winget
{{< /card >}}

Now we have the ID of the correct application, which is `9NKSQGP7F2NH` for WhatsApp, we can install the WhatsApp Microsoft Store application with Winget with the following command:

{{< card code=true header="**PowerShell**" lang="powershell" >}}
winget install 9NKSQGP7F2NH --silent --accept-package-agreements --accept-source-agreements
{{< /card >}}

Notice that WhatsApp will be available in your Windows Start Menu in a few seconds.

Now you need to do this for every app you want to install, but be careful not to blast too much apps into this scrip as this is being performed at every logon of every user.

---

## Step 2: Creating the login script

Now we know how to install your own chosen apps using winget, we can create a script which installs the applications for us. This script will be very easy to build and maintain. An example of a script I used in the past:

{{< card code=true header="**Bash**" lang="bash" >}}
rem WhatsAppwinget install 9NKSQGP7F2NH --silent --accept-package-agreements --accept-source-agreementsrem Copilotwinget install Microsoft.365Copilot --silent --accept-package-agreements --accept-source-agreements
{{< /card >}}

Then save this script as a .cmd file. Now we need to place this on a readable shared network location, like a server or on the SYSVOL folder of the domain like I've done here:

[![jv-media-997-2540d603dab4.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/microsoft-store-applications-on-azure-virtual-desktop-fslogix-997/jv-media-997-2540d603dab4.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/microsoft-store-applications-on-azure-virtual-desktop-fslogix-997/jv-media-997-2540d603dab4.png)

Then we need to create a Group Policy with the script as logon action. Open the Group Policy Management Console on `gpmc.msc` and create a new Group Policy or recycle an existing one.

Then go to:

`User Configuration -> Policies -> Windows Settings -> Scripts (Logon)`

[![jv-media-997-5eb06a2f9530.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/microsoft-store-applications-on-azure-virtual-desktop-fslogix-997/jv-media-997-5eb06a2f9530.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/microsoft-store-applications-on-azure-virtual-desktop-fslogix-997/jv-media-997-5eb06a2f9530.png)

Add your script there which must be on a readable Network location for users and computers.

[![jv-media-997-df85767a91bd.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/microsoft-store-applications-on-azure-virtual-desktop-fslogix-997/jv-media-997-df85767a91bd.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/microsoft-store-applications-on-azure-virtual-desktop-fslogix-997/jv-media-997-df85767a91bd.png)

The SYSVOL folder is a great example of such folder and would work. After creating the logon action close the applications and head over to your AVD connection.

---

## Step 3: Testing the login script

After succesfully logging in to Azure Virtual Desktop (relogin required after changing policy), our scripted applications should be available and installed in the background. After around 30 seconds you can find the applications in the start menu.

[![jv-media-997-03babc8d9509.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/microsoft-store-applications-on-azure-virtual-desktop-fslogix-997/jv-media-997-03babc8d9509.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/microsoft-store-applications-on-azure-virtual-desktop-fslogix-997/jv-media-997-03babc8d9509.png)

Fun fact is that the data is stored in the profile, so after installing the app it can be used directly and with the data from an earlier login. In the case of WhatsApp, no reconnection with your phone/account should be needed.

---

## Summary

Now this guide shows how I solved the problem of users not able to use apps on Azure Virtual Desktop without re-installing them every session.

In my opinion, I think its the best way to handle the applications. If the application has an option to install through a .exe or .msi file, that will work much better. I use this only for some applications that can be downloaded exclusively from the Windows Store.

{{% alert title="Sources 📖" color="info" %}}
These sources helped me by writing and research for this post;

1. https://learn.microsoft.com/en-us/fslogix/troubleshooting-appx-issues
2. [https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-server-2012-r2-and-2012/dn789196(v=ws.11)#how-to-assign-user-logon-scripts](https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-server-2012-r2-and-2012/dn789196(v=ws.11)#how-to-assign-user-logon-scripts)
{{% /alert %}}

{{< ads >}}

{{< article-footer >}}
