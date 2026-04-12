---
title: "Change Evaluation version to Standard/Datacenter version"
date: 2023-05-03
slug: "windows-server-evaluation-to-standard"
categories:
  - Windows Server
tags:
  - Step by Step guides
description: >
  When you install a fresh Windows Server Evaluation installation from a .iso file, it will be installing the OS as a Evaluation version...
---
![Powershell script](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/windows-server-evaluation-to-standard-71/jv-media-71-30eb3963ce1a.jpg)

When you install a fresh Windows Server installation from a .iso file, it will be installing the OS as a Evaluation version. When you want to activate the installation with a key you need to rebuild the OS and set the edition to Standard.

Microsoft considers Standard and Standard Evaluation as different editions of Windows, because of this we have to change the edition before you can activate the installation. When you want to use the edition Datacenter, you can change the command to Datacenter which also works.

You can download the ISO file for Windows Server 2025 Evaluation here: <https://www.microsoft.com/en-us/evalcenter/evaluate-windows-server-2025>

---

---

## Requirements

- A valid product key for Windows Server Standard
- 15 minutes of your time

---

## Step 1: Install and prepare

You first have to install your instance of Windows Server Evaluation. After this you can install the latest updates and configure the rest of your needs.

---

## Step 2: Upgrade Evaluation to Datacenter/Standard

After finishing up the configuration of your server, we need to run a command to upgrade the edition of Windows Server.

Open a command prompt window, and run the following command:

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
DISM /online /Set-Edition:ServerStandard /ProductKey:XXXXX-XXXXX-XXXXX-XXXXX-XXXXX /AcceptEula
{{< /card >}}

Here you have to use your own product key for Standard/Datacenter depending on your version. Replace this with the XXXXX-XXXXX placeholder. Also, you can choose your target edition by changing the edition:

- Windows Server Standard: **ServerStandard**
- Windows Server Datacenter: **ServerDatacenter**

---

## Summary

When installing a Windows Server instance, your edition could be an evaluation version. This is considered as a different edition, and for some features, it must be upgraded.

I hope I helped you upgrading your edition to a non-evaluation version.

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
