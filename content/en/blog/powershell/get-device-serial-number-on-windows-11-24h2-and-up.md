---
title: "Get Device serial number on Windows 11 24H2 and up"
date: 2025-01-22
slug: "get-device-serial-number-on-windows-11-24h2-and-up"
categories:
  - Powershell
tags:
  - Concepts
description: >
  With Windows 24H2 and the deprecation of WMIC, a easy command to find your devices' serial number is gone. However, we can still look this up with Powershell.
---
With Windows 24H2 and the deprecation of WMIC, a easy command to find your devices' serial number is gone. However, we can still look this up with Powershell.

Use the following command:

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
Get-WmiObject win32_bios | select SerialNumber
{{< /card >}}

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
