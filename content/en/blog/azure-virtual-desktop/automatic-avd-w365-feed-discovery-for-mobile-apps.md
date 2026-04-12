---
title: "Automatic AVD/W365 Feed discovery for mobile apps"
date: 2024-10-09
slug: "automatic-avd-w365-feed-discovery-for-mobile-apps"
categories:
  - Azure Virtual Desktop
tags:
  - Step by Step guides
description: >
  When using Azure Virtual Desktop (AVD) or Windows (W365), we sometimes use the mobile apps for Android, MacOS or iOS. But those apps rely...
---
When using Azure Virtual Desktop (AVD) or Windows (W365), we sometimes use the mobile apps for Android, MacOS or iOS. But those apps rely on filling in a Feed Discovery URL instead of simply a Email address and a password.

Did you know we can automate this process? I will explain how to do this!

Fast path for URL: https://rdweb.wvd.microsoft.com/api/arm/feeddiscovery

---

---

## The problem explained

When downloading the apps for your mobile devices, we get this window after installing:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/automatic-avd-w365-feed-discovery-for-mobile-apps-4725/jv-media-4725-cbe412d3fee2.png)

After filling in our emailadress that has access to a Azure Virtual Desktop hostpool or Windows 365 machine, we still get this error:

- *We couldn't find any Workspaces associated with this email address. Try providing a URL instead.*

Now the client wants a URL, but we don't want to fill in this URL for every device we configure. We can automate this through DNS.

---

## How to configure the Feed Discovery DNS record

To configure your automatic Feed Discovery, we must create this DNS record:

|  |  |  |
| --- | --- | --- |
| **Record type** | **Host** | **Value** |
| TXT | \_msradc | https://rdweb.wvd.microsoft.com/api/arm/feeddiscovery |

Small note, we must configure this record for every domain which is used for one of the 2 remote desktop solutions. If your company uses e.g.:

- justinverstijnen.nl
- justinverstijnen.com
- justinverstijnen.tech

We must configure this 3 times.

Let's login to our DNS hosting for the domain, and create the record:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/automatic-avd-w365-feed-discovery-for-mobile-apps-4725/jv-media-4725-4d1ba0d66799.png)

Then save your configuration and wait for a few minutes.

---

## Let's test the configuration

Now that our DNS record is in place, we can test this by again, typing our email address into the application:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/automatic-avd-w365-feed-discovery-for-mobile-apps-4725/jv-media-4725-ba13d135b117.png)

Now the application automatically finds the domain and imports the feed discovery URL into the application. This minor change solves a lot of headache.

---

## Summary

Creating this DNS record saves a lot of problems and headache for users and administrators of Azure Virtual Desktop and/or Windows 365. I hope I explained clearly how to configure this record and described the problem.

### Sources

These sources helped me by writing and research for this post;

1. <https://learn.microsoft.com/en-us/windows-server/remote/remote-desktop-services/rds-email-discovery>

Thank you for visiting this website!

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
