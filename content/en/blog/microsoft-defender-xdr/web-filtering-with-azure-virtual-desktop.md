---
title: "Web filtering with Azure Virtual Desktop"
slug: "web-filtering-with-azure-virtual-desktop"
date: 2026-12-10
tags:
- Step by Step guides
- Concepts
categories:
- Microsoft Defender XDR
description: "Learn how to configure web filtering for Azure Virtual Desktop using Microsoft Defender for Endpoint and Microsoft Intune."
hidden: false
---

# Web filtering with Azure Virtual Desktop

When using Azure Virtual Desktop (AVD), users normally have full internet access from the session hosts. In many environments this is not always desired, especially in business and enterprise environments where we might want to block unsafe websites, enforce compliance policies or reduce distractions.

A common solution is using Microsoft Defender for Endpoint Web Content Filtering. This integrates well with Azure Virtual Desktop and works directly from the session hosts themselves. In this post I will explain:

- How web filtering works in Azure Virtual Desktop
- Which components are required
- How to configure Web Content Filtering
- How to apply filtering policies to AVD hosts
- Some practical recommendations for production environments

However this post is focussed on Azure Virtual Desktop, Web Filtering is available for any device managed by Intune and running Microsoft Defender for Endpoint.

## How web filtering works in Azure Virtual Desktop

Microsoft Defender for Endpoint includes a feature called Web Content Filtering and Network Protection. This allows you to block or audit websites based on categories.

Examples are:

- Adult content
- Gambling
- Social media
- Streaming media
- Malware websites
- Phishing websites
- Newly registered domains

The Defender agent runs directly inside the Azure Virtual Desktop session host. Every web request is evaluated locally on the machine itself.

The process roughly works like this:

1. A user browses to a website
2. Defender checks the URL reputation and category
3. The policy assigned to the session host is evaluated
4. The website is allowed, audited, or blocked

This works especially well for pooled host pools because every newly deployed session host automatically receives the same policies after onboarding. We can also use this to block websites on the physical devices with Intune, forbidding different types of websites like shadow IT tools or unsupported applications.

---

## Requirements

For this guide/setup, we need the following things:

- An Azure Virtual Desktop (testing) host + onboarded to Defender
- Defender for Endpoint P1+ license
- Around 30 minutes of your time

---

## Step 1: Enable Web Content Filtering

Open the Microsoft Defender portal at https://security.microsoft.com and go to `Settings`, and then click on `Endpoints`.

Here enable the following setting:

- `Web content filtering`

[![jv-media-8522-3e220e8eeb85.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/web-filtering-with-azure-virtual-desktop/jv-media-8522-3e220e8eeb85.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/web-filtering-with-azure-virtual-desktop/jv-media-8522-3e220e8eeb85.png)

After enabling the feature, it can take several minutes before the configuration becomes available in the Defender portal. In the meanwhile, you could grab a coffee or another favorite drink. Great tip.

---

## Step 2: Create device groups (optional)

As we have to apply the web filtering configurations to groups, we can create device groups to apply the settings to. Using device groups makes management much easier in larger environments. These Defender Device groups are different groups as Entra ID groups, and are based on dynamic presets. We can also choose to block certain stuff on all devices, but it's up to you.

You can do a phased approach, where you first apply the settings to a subset of the hosts or do a broad application. For the purpose of this guide, I will use a single group with all my session hosts for demonstration.

Open the Microsoft Defender portal at https://security.microsoft.com and go to `Settings`, select `Endpoints`, and then open `Device groups`. Here create a new device group and configure rules based on:

- Device name
- Tags
- Operating system
- Domain membership

[![jv-media-8522-3e9f161af3d1.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/web-filtering-with-azure-virtual-desktop/jv-media-8522-3e9f161af3d1.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/web-filtering-with-azure-virtual-desktop/jv-media-8522-3e9f161af3d1.png)

You can play around with the rules to ensure only the right devices are added automatically to your device group. This works very similar to Entra ID Dynamic Groups. I have only filtered on the name -> starts with option:

[![jv-media-8522-da0db325ac19.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/web-filtering-with-azure-virtual-desktop/jv-media-8522-da0db325ac19.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/web-filtering-with-azure-virtual-desktop/jv-media-8522-da0db325ac19.png)

---

## Step 3: Enable Microsoft Edge Smartscreen

We now must enable Microsoft Edge SmartScreen. This must be done for every browser you use in your organization but I will do the demonstration of Microsoft Edge.

Open the Microsoft Intune admin center at https://intune.microsoft.com and go to `Devices`, and then `Windows` and create a new policy here.

[![jv-media-8522-5d15f5cab16e.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/web-filtering-with-azure-virtual-desktop/jv-media-8522-5d15f5cab16e.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/web-filtering-with-azure-virtual-desktop/jv-media-8522-5d15f5cab16e.png)

Give the policy a descriptive name and description and advance to the `Configuration settings` tab.

Now search for the `Configure Microsoft Defender SmartScreen` option and enable it.

[![jv-media-8522-97f400aac45b.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/web-filtering-with-azure-virtual-desktop/jv-media-8522-97f400aac45b.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/web-filtering-with-azure-virtual-desktop/jv-media-8522-97f400aac45b.png)

Keep the policy window open because Step 4 also needs to be configured here.

---

## Step 4: Enable Network Protection

Network Protection is a great feature to extends filtering capabilities outside Microsoft Edge. Without Network Protection, filtering is more limited and doesnt work in for example Google Chrome or other applications.

In the same window/policy as where you configured Microsoft Edge SmartScreen, you could configure network protection. You could also use the the method below.

{{% alert title="Info" color="info" %}}
Open the Microsoft Intune admin center at https://intune.microsoft.com and go to Endpoint security, select Antivirus, and then select Create Policy. Use the Windows platform and the profile Microsoft Defender Antivirus. Under the Attack Surface Reduction rules, look up Network Protection and enable this in Block mode.
{{% /alert %}}

If configuring the Network Protection setting in the same policy, search for `Network Protection` and select it. Then select the `Enabled (block mode)` setting like here:

[![jv-media-8522-99fb3af5df9a.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/web-filtering-with-azure-virtual-desktop/jv-media-8522-99fb3af5df9a.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/web-filtering-with-azure-virtual-desktop/jv-media-8522-99fb3af5df9a.png)

Then assign the policy to your Azure Virtual Desktop session hosts and wait for a few hours to automatically apply this setting on the devices.

---

## Step 5: Block websites based on categories

Now we can configure the actual web filtering policies themselves. Open the Microsoft Defender portal at https://security.microsoft.com and go to `Settings`, then `Endpoints` and under `Rules` open `Web content filtering`.

Here select `+ Add policy`. Give the policy a good and descriptive name and click `Next`.

[![jv-media-8522-c31edda7a3f0.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/web-filtering-with-azure-virtual-desktop/jv-media-8522-c31edda7a3f0.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/web-filtering-with-azure-virtual-desktop/jv-media-8522-c31edda7a3f0.png)

Here we can select the blocked categories on this device group. For the purpose of this guide, I will block all adult content of the built-in categories:

[![jv-media-8522-dcc9e769bfa9.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/web-filtering-with-azure-virtual-desktop/jv-media-8522-dcc9e769bfa9.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/web-filtering-with-azure-virtual-desktop/jv-media-8522-dcc9e769bfa9.png)

Assign the policy to the Azure Virtual Desktop device group. In my experience, this took a re-login for my device group to actually show up at this step.

[![jv-media-8522-90f6d76b96fb.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/web-filtering-with-azure-virtual-desktop/jv-media-8522-90f6d76b96fb.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/web-filtering-with-azure-virtual-desktop/jv-media-8522-90f6d76b96fb.png)

Select the required Device Group and then click `Next`.

[![jv-media-8522-b47ce7a9e51b.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/web-filtering-with-azure-virtual-desktop/jv-media-8522-b47ce7a9e51b.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/web-filtering-with-azure-virtual-desktop/jv-media-8522-b47ce7a9e51b.png)

{{% alert title="Warning" color="warning" %}}
If you are using Microsoft 365 Business Premium or Microsoft Defender for Business, you can only define a single web content filtering policy for your environment.
{{% /alert %}}

After applying the policy, blocked websites will display a Microsoft Defender block page.

---

## Step 6: Block specific websites

We can also block specific websites/IP addresses or hashes, if we want some websites to be blocked. For example some shadow IT tool which you don't want to support or unsupported AI websites where employees possibly can upload sensitive information.

In the Microsoft Defender portal, go to `Settings` , then to `Optional features` and enable `Custom network indicators`. These are items we can configure ourselves and contain an IP-adress, domain, URL, file hash or certificate.

[![jv-media-8522-eb91a414c27a.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/web-filtering-with-azure-virtual-desktop/jv-media-8522-eb91a414c27a.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/web-filtering-with-azure-virtual-desktop/jv-media-8522-eb91a414c27a.png)

After we have enabled this feature, click on `Indicators` on the left and then on  `URLs/Domains`. We will now configure a policy to block one specific website for demonstration purposes.

Click `+ Add item` to add a new website.

[![jv-media-8522-746dedc31530.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/web-filtering-with-azure-virtual-desktop/jv-media-8522-746dedc31530.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/web-filtering-with-azure-virtual-desktop/jv-media-8522-746dedc31530.png)

For this demonstration, I will block  the website apple.com.

[![jv-media-8522-46bbecea48b0.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/web-filtering-with-azure-virtual-desktop/jv-media-8522-46bbecea48b0.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/web-filtering-with-azure-virtual-desktop/jv-media-8522-46bbecea48b0.png)

Fill in your desired blocking URL/website and fill in the title/description and click `Next`.

[![jv-media-8522-d2d30630d08d.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/web-filtering-with-azure-virtual-desktop/jv-media-8522-d2d30630d08d.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/web-filtering-with-azure-virtual-desktop/jv-media-8522-d2d30630d08d.png)

On the next page, select the option `Block execution` which means any request to the domain apple.com is being blocked by Microsoft Defender.

[![jv-media-8522-f4e541076fa4.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/web-filtering-with-azure-virtual-desktop/jv-media-8522-f4e541076fa4.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/web-filtering-with-azure-virtual-desktop/jv-media-8522-f4e541076fa4.png)

You could also receive any alerts about one or more endpoints requesting a certain domain/URL, but I don't want to dive too deep into this. I have set this to not generate any alerts.

[![jv-media-8522-03b0e987b02b.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/web-filtering-with-azure-virtual-desktop/jv-media-8522-03b0e987b02b.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/web-filtering-with-azure-virtual-desktop/jv-media-8522-03b0e987b02b.png)

Select your device group and finish the wizard to apply the indicator and policy to Microsoft Defender.

---

## Step 7: Test the filtering

After the websites have been added to the block lists, we must wait up to 2 hours for the policies to actually be active. In my case this actually took about two hours for the block rules to be active.

I visited unibet.com as an example as we blocked Gambling websites in Step 5. After around 2 hours after creating the block policy, this warning started to show up:

[![jv-media-8522-fd8240ec763b.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/web-filtering-with-azure-virtual-desktop/jv-media-8522-fd8240ec763b.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/web-filtering-with-azure-virtual-desktop/jv-media-8522-fd8240ec763b.png)

No way to actually visit the website, which is what we wanted. Then I tried the website we blocked by URL; apple.com:

[![jv-media-8522-bbf59de44ab9.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/web-filtering-with-azure-virtual-desktop/jv-media-8522-bbf59de44ab9.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/web-filtering-with-azure-virtual-desktop/jv-media-8522-bbf59de44ab9.png)

We can also check the categories/visiting reports on this blade:

- [https://security.microsoft.com/webprotection](https://security.microsoft.com/webprotection)

Or you can find it under `Reports`, `Endpoints` and then `Web protection`.

[![jv-media-8522-9405220ed4f0.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/web-filtering-with-azure-virtual-desktop/jv-media-8522-9405220ed4f0.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/web-filtering-with-azure-virtual-desktop/jv-media-8522-9405220ed4f0.png)

Here are possible hits (blocked website visits) by endpoints reported or you can find the results of any `Audit` policies. However, this content is updated only once a day, so this doesnt show live data going on your endpoints.

---

## Summary

Web filtering with Azure Virtual Desktop or generic devices is a strong way to improve security and control internet access on company devices. Microsoft Defender for Endpoint integrates nicely with Azure Virtual Desktop and Microsoft Intune alongside to Windows, making management relatively straight forward in both smaller and enterprise environments.

By combining Defender Web Content Filtering with proper onboarding, Network Protection, and centralized policy management, you can build a more secure Azure Virtual Desktop environment without needing additional third-party filtering appliances or a expensive firewall in your setup. If using this method on company endpoints, you can restrict visiting certain websites with the company devices, no matter the network the device is connected to.

Thank you for reading this post and I hope it was helpful!

{{% alert title="Sources 🕮" color="info" %}}
These sources helped me by writing and research for this post;

1. [https://learn.microsoft.com/en-us/defender-endpoint/web-protection-overview](https://learn.microsoft.com/en-us/defender-endpoint/web-protection-overview)
2. [https://learn.microsoft.com/en-us/defender-endpoint/web-content-filtering](https://learn.microsoft.com/en-us/defender-endpoint/web-content-filtering)
{{% /alert %}}

{{< ads >}}

{{< article-footer >}}