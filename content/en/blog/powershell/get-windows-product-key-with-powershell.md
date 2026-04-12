---
title: "Get Windows Product Key with PowerShell"
date: 2024-07-28
slug: "get-windows-product-key-with-powershell"
categories:
  - Powershell
tags:
  - Tools and Scripts
description: >
  Sometimes we need to have the original installed Windows Product Key just for documentation purposes. We simple can do this with...
---
Sometimes we need to have the original installed Windows Product Key just for documentation purposes. We simple can do this with one command in PowerShell:

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
(Get-ItemProperty -Path "HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion\SoftwareProtectionPlatform").BackupProductKeyDefault
{{< /card >}}
![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/get-windows-product-key-with-powershell-3681/jv-media-3681-3a0bbc0e5409.png)

Please note that I am not encouraging software abuse or pirating, just sharing a tip to make our IT life a bit easier. It happens that a server or computer gets installed and we forget to document the product key or just to match it with our known information.

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
