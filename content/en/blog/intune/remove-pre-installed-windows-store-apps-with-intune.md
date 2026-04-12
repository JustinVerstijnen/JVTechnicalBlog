---
title: "Remove Pre-installed Windows Store Apps with Intune"
date: 2025-10-21
slug: "remove-pre-installed-windows-store-apps-with-intune"
categories:
  - Intune
tags:
  - Step by Step guides
description: >
  Since the latest Windows 25H2 update, we have a great new feature. We can now remove pre-installed Windows Store Applications which we...
---
Since the latest Windows 25H2 update, we have a great new feature. We can now remove pre-installed Windows Store Applications which we don't want to ship with our devices. This helps us alot with both Windows 365 and Azure Virtual Desktop Personal deployments as with normal Intune-joined devices. The only downside is that Pooled Azure Virtual Desktop Deployments are not supported.

In this guide I will dive into this new setting and explain how to configure this and why this is a great update. The step-by-step guide shows how I have configured a policy that removes most of the non-productive apps from my PC.

---

---

## The new feature described

In Intune we can now select which default shipped apps must be removed from Windows clients. Before, this was a complete package we had to use or remove with custom scripts, but now we can select the apps to remove (and deselect to keep).

Keep in mind, we have the following requirements for this new feature:

- Windows 11 25H2
- Education or Enterprise version

Also worth mentioning, removing an application needs a manual reinstall, which is easy to do.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/remove-pre-installed-windows-store-apps-with-intune-4861/jv-media-4861-bc2d5b646894.png)

---

## Step by step configuration

We can configure the removal of these apps with a configuration profile in Microsoft Intune. I will create this from A to Z in this guide to fully explain how this works:

Open up Microsoft Intune Admin center (intune.microsoft.com).

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/remove-pre-installed-windows-store-apps-with-intune-4861/jv-media-4861-e2b774ec6877.png)

Then go to your Devices, and then Windows.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/remove-pre-installed-windows-store-apps-with-intune-4861/jv-media-4861-59fe5bb3fe88.png)

Then click on "Configuration" to view all the Windows-based Configuration Profiles. Here we can create a new profile for this setting. Click on "+ Create" and then "New Policy".

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/remove-pre-installed-windows-store-apps-with-intune-4861/jv-media-4861-4adbd2ef9d0a.png)

Select for Platform the "**Windows 10 and later option**", and for Profile Type "**Settings catalog**".

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/remove-pre-installed-windows-store-apps-with-intune-4861/jv-media-4861-0e6660b57a1d.png)

Then give the policy a recognizable name and description.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/remove-pre-installed-windows-store-apps-with-intune-4861/jv-media-4861-3cae757bbfb5.png)

Then click "Next". On the "Configuration settings" page, click on the "+ Add settings" button:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/remove-pre-installed-windows-store-apps-with-intune-4861/jv-media-4861-8e77073bd9fc.png)

Then search for the setting in this location:

*Administrative Templates -> Windows Components -> App Package Deployment*

Then select the "Remove Default Microsoft Store packages from the system" option.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/remove-pre-installed-windows-store-apps-with-intune-4861/jv-media-4861-b847a03f60c6.png)

At the left side, flick the switch to "Enabled" and now we can select all apps to remove from Windows client devices.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/remove-pre-installed-windows-store-apps-with-intune-4861/jv-media-4861-9b712f1ea4a9.png)

In this configuration, I want to leave all helpful tools installed, but want to remove non-business related applications like Xbox , Solitaire collection and Clipchamp.

You can make your own selection of course. After your apps to remove are selected, click "Next". Then click "Next" again to assign the configuration profile to your devices. In my case, I select "All devices" but you can also use a manual or [Dynamic group](https://justinverstijnen.nl/dynamic-group-for-access-to-windows-365/).

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/remove-pre-installed-windows-store-apps-with-intune-4861/jv-media-4861-cebb4743d704.png)

Now the policy is assigned and the actions will be applied the next time your device synchronizes with Microsoft Intune.

---

## No Enterprise or Education?

In you don't have Enterprise or Education licenses for Windows, I can highly recommend using this debloat script: <https://github.com/Raphire/Win11Debloat>

This script will help you in the Windows Experience by removing the selected apps, and helps with Windows Explorer settings.

---

## Summary

This new feature is one of the greater updates to the Windows 11 operating system. Deleting applications you don't need frees up some disk space and compute resources. Also, end-uders are not presented apps they should not use which makes the overall device experience alot better.

I hope I have made this clear to use and thank you for reading my post.

### Sources

These sources helped me by writing and research for this post;

1. <https://support.microsoft.com/en-us/topic/policy-based-removal-of-pre-installed-microsoft-store-apps-e1d41a92-b658-4511-95a6-0fbcc02b4e9c>

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
