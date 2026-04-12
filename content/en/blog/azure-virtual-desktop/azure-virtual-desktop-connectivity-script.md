---
title: "Test Azure Virtual Desktop connectivity and RTT"
date: 2025-05-22
slug: "azure-virtual-desktop-connectivity-script"
categories:
  - Azure Virtual Desktop
tags:
  - AI Generated Content
  - Tools and Scripts
description: >
  Sometimes, we need to check some basic connectivity from end user devices to a service like Azure Virtual Desktop.
---
Sometimes, we need to check some basic connectivity from end user devices to a service like Azure Virtual Desktop. Most networks have a custom firewall equipped where we must allow certain traffic to flow to the internet.

Previously there was a tool from Microsoft available, the Azure Virtual Desktop experience estimator, but they have discontinued that. This tested the Round Trip Time (RTT) to a specific Azure region and is a calculation of what the end user will get.

I created a script to test the connectivity, if it is allowed through Firewall and also test the RTT to the Azure Virtual Desktop service. The script then gives the following output:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-virtual-desktop-connectivity-script-1649/jv-media-1649-9617996da753.png)

---

---

## The script to test Azure Virtual Desktop connectivity

I have the script on my Github page which can be downloaded here:

[Download TestRTTAVDConnectivity script](https://github.com/JustinVerstijnen/TestRTTAVDConnectivity)

---

## What is Round Trip Time (RTT)?

The Round Trip Time is the time in milliseconds of an TCP packet from its source to it's destination and from destination back to the source. It is like ping, but added with the time back like described in the image below:

This is an great mechanism to test connectivity in some critical applications where continious traffic to both the source and destination is critical. These applications can be Remote Desktop but also in VoIP.

RTT and Remote Desktop experience:

- **Under 100ms RTT:** Very good connection
- **100 to 200ms RTT:** User can experience some lags in input. It feels different to a slow computer as the cursor and typing text might stutter and freeze
- **Above 200ms RTT:** This is very bad and some actions might be done.

---

## The script described

The script tests the connection to the required endpoints of Azure Virtual Desktop on the required ports. Azure Virtual Desktop heavily relies on port 443, and is the only port needed to open.

1. The script starts with the URLs which come from this Microsoft article: <https://learn.microsoft.com/en-us/azure/virtual-desktop/required-fqdn-endpoint?tabs=azure#end-user-devices>
2. Then it creates a custom function/command to do a TCP test on port 443 on all those URLs and then uses ICMP to also get an RTT time. We also want to know if an connection was succeeded, how long it took.
3. Then summarizes everything into a readable table. This is where the table marup is stated
4. Test the connectivity and write the output, and waits for 50 seconds

The script takes around 10 seconds to perform all those actions and to print those. If one or all of them are "Failed", then you know that something has to be changed in your Firewall configurations. If all of them succeeds then everything is alright, and the only factor can be a eventually low RTT.

---

## Summary

This script is really useful to test connectivity to Azure Virtual Desktop. It can be used in multiple scenario's, like initial setup, testing and troubleshooting.

Thank you for reading this guide and I hope it was useful.

### Sources

These sources helped me by writing and research for this post;

1. The old and discontinued "Azure Virtual Desktop Experience Estimator"
2. <https://learn.microsoft.com/en-us/azure/virtual-desktop/required-fqdn-endpoint?tabs=azure#end-user-devices>

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
