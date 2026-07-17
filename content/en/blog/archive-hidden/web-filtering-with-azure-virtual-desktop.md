---
title: "Web filtering with Azure Virtual Desktop"
slug: "web-filtering-with-azure-virtual-desktop"
date: 2026-09-17
tags:
- Step by Step guides
- Concepts
categories:
- Azure Virtual Desktop
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

## How web filtering works in Azure Virtual Desktop

Microsoft Defender for Endpoint includes a feature called Web Content Filtering. This allows you to block or audit websites based on categories.

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

This works especially well for pooled host pools because every newly deployed session host automatically receives the same policies after onboarding.

---

## Requirements

For this guide/setup, we need the following things:

- An Azure Virtual Desktop (testing) host + onboarded to Defender
- Defender for Endpoint P1+ license
- Around 30 minutes of your time

---

## Step 1: Enable Web Content Filtering

Open the Microsoft Defender portal at https://security.microsoft.com and go to "Settings", select "Endpoints", and then open "Advanced features".

Enable the following setting:

- Web content filtering

[![jv-media-8522-3e220e8eeb85.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/web-filtering-with-azure-virtual-desktop/jv-media-8522-3e220e8eeb85.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/web-filtering-with-azure-virtual-desktop/jv-media-8522-3e220e8eeb85.png)

After enabling the feature, it can take several minutes before the configuration becomes available in the Defender portal. In the meanwhile, you could grab a coffee or another favorite drink.

---

## Step 2: Create device groups (optional)

As we have to apply the web filtering configurations to groups, we can now create device groups to apply the settings to. Using device groups makes management much easier in larger environments. These Defender Device groups are different groups as Entra ID groups.

You can do a phased approach, where you first apply the settings to a subset of the hosts or do a broad application. For the purpose of this guide, I will use a single group with all my session hosts for demonstration.

Open the Microsoft Defender portal at https://security.microsoft.com and go to "Settings", select "Endpoints", and then open "Device groups". Here create a new device group and configure rules based on:

- Device name
- Tags
- Operating system
- Domain membership

[![jv-media-8522-3e9f161af3d1.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/web-filtering-with-azure-virtual-desktop/jv-media-8522-3e9f161af3d1.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/web-filtering-with-azure-virtual-desktop/jv-media-8522-3e9f161af3d1.png)

You can play around with the rules to ensure only the right devices are added automatically to your device group. This works very similar to Entra ID Dynamic Groups. I have only filtered on the name -> starts with option:

[![jv-media-8522-da0db325ac19.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/web-filtering-with-azure-virtual-desktop/jv-media-8522-da0db325ac19.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/web-filtering-with-azure-virtual-desktop/jv-media-8522-da0db325ac19.png)

---

## Step 3: Configure the Web Content Filtering policy

Now we can configure the actual web filtering policies themselves. Open the Microsoft Defender portal at https://security.microsoft.com and go to "Settings", then "Endpoints" and under "Rules"open "Web content filtering".

Here select "+ Add policy". Give the policy a good and descriptive name and click "Next".

[![jv-media-8522-c31edda7a3f0.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/web-filtering-with-azure-virtual-desktop/jv-media-8522-c31edda7a3f0.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/web-filtering-with-azure-virtual-desktop/jv-media-8522-c31edda7a3f0.png)

Here we can select the blocked categories on this device group. For the purpose of this guide, I will block all adult content of the built-in categories:

[![jv-media-8522-dcc9e769bfa9.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/web-filtering-with-azure-virtual-desktop/jv-media-8522-dcc9e769bfa9.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/web-filtering-with-azure-virtual-desktop/jv-media-8522-dcc9e769bfa9.png)

Assign the policy to the Azure Virtual Desktop device group. In my experience, this took a relogin for my device group to actually show up at this step.

{{% alert title="Warning" color="warning" %}}
If you are using Microsoft 365 Business Premium or Microsoft Defender for Business, you can only define a single web content filtering policy for your environment.
{{% /alert %}}

After applying the policy, blocked websites will display a Microsoft Defender block page.

---

## Step 4: Enable Microsoft Edge Smartscreen

We now must enable Microsoft Edge SmartScreen. This must be done for every browser you use in your organization but I will do the demonstration of Microsoft Edge.

Open the Microsoft Intune admin center at https://intune.microsoft.com and go to "Devices", and then "Windows". Create a new policy here.

[![jv-media-8522-5d15f5cab16e.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/web-filtering-with-azure-virtual-desktop/jv-media-8522-5d15f5cab16e.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/web-filtering-with-azure-virtual-desktop/jv-media-8522-5d15f5cab16e.png)

Give the policy a descriptive name and description and advance to the "Configuration settings" tab.

Now search for the "Configure Microsoft Defender SmartScreen" option and enable it.

[![jv-media-8522-97f400aac45b.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/web-filtering-with-azure-virtual-desktop/jv-media-8522-97f400aac45b.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/web-filtering-with-azure-virtual-desktop/jv-media-8522-97f400aac45b.png)

Then apply the policy to your group containing the session hosts.

---

## Step 5: Enable Network Protection

Network Protection is a great feature to extends filtering capabilities outside Microsoft Edge. Without Network Protection, filtering is more limited and doesnt work in for example Google Chrome or other applications.

Open the Microsoft Intune admin center at https://intune.microsoft.com and go to "Endpoint security", select "Antivirus", and then select "Create Policy".

Use the Windows platform and the profile Microsoft Defender Antivirus:

[![jv-media-8522-bc7ffb1c257c.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/web-filtering-with-azure-virtual-desktop/jv-media-8522-bc7ffb1c257c.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/web-filtering-with-azure-virtual-desktop/jv-media-8522-bc7ffb1c257c.png)

Give the policy a name and clear description.

[![jv-media-8522-884058fe5165.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/web-filtering-with-azure-virtual-desktop/jv-media-8522-884058fe5165.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/web-filtering-with-azure-virtual-desktop/jv-media-8522-884058fe5165.png)

Under the Attack Surface Reduction rules, look up Network Protection and enable this in Block mode.

[![jv-media-8522-596a60e0ab76.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/web-filtering-with-azure-virtual-desktop/jv-media-8522-596a60e0ab76.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/web-filtering-with-azure-virtual-desktop/jv-media-8522-596a60e0ab76.png)

Then assign the policy to your Azure Virtual Desktop session hosts and wait for a few hours to automatically apply this setting on the devices.

---

## Step 6: Test the filtering

After policy deployment:

1. Connect to an Azure Virtual Desktop session
2. Open a web browser
3. Browse to a blocked website category
4. Verify the block page appears

You can also verify events inside:

- Device timeline
- Advanced Hunting
- Defender reporting

I usually recommend starting with audit mode first before switching directly to blocking mode in production.

---

## Summary

Web filtering with Azure Virtual Desktop is a strong way to improve security and control internet access on shared session hosts. Microsoft Defender for Endpoint integrates nicely with Azure Virtual Desktop and Microsoft Intune, making management relatively straightforward in both smaller and enterprise environments.

By combining Defender Web Content Filtering with proper onboarding, Network Protection, and centralized policy management, you can build a more secure Azure Virtual Desktop environment without needing additional third-party filtering appliances.

Thank you for reading this post and I hope it was helpful!

### Sources

These sources helped me by writing and research for this post;

1. https://learn.microsoft.com/en-us/defender-endpoint/web-content-filtering
2. https://learn.microsoft.com/en-us/defender-endpoint/web-protection-overview

{{< ads >}}

{{< article-footer >}}