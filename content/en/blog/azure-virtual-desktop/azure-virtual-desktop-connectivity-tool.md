---
title: "Test Azure Virtual Desktop RTT with my AVD Experience Estimator"
date: 2026-11-05
slug: "azure-virtual-desktop-connectivity-tool"
categories:
  - Azure Virtual Desktop
tags:
  - Tools and Scripts
  - Concepts
description: "Sometimes we need to compare the connection from an end user device to different Azure regions when using Azure Virtual Desktop. Microsoft previously offered the Azure Virtual Desktop Experience Estimator, but this tool has been discontinued. I created and designed an online alternative to compare browser-based HTTPS round-trip times and estimated latency to Azure regions to give a basic estimation of the connection from your device to various regions in real-time.."
---

Sometimes, we need to check the connection from end user devices to a service like Azure Virtual Desktop. Especially when users are working from different locations, it can be useful to compare the response times to different Azure regions. Previously there was a tool from Microsoft available, the Azure Virtual Desktop Experience Estimator, but they have discontinued that.

I created my own simple and online `AVD Experience Estimator` to compare Azure regions directly from a web browser. There is no need to download or run a script. The tool displays the measured HTTPS Round Trip Time (RTT) and an estimated latency for each tested region.

In the past I used a custom script which kind of did the same but always requires multiple steps. Downloading a script, taking it to the affected computer, dealing with administrator permissions and the PowerShell Execution Policy and such: https://justinverstijnen.nl/azure-virtual-desktop-connectivity-script/. I wanted to make it much easier to just check the connectivity in a way just like Microsoft did previously.

---

## The online AVD Experience Estimator

I have the open-source tool available on my website, which can be opened here:

[Open AVD Experience Estimator](https://tools.justinverstijnen.nl/avdexperienceestimator/)

[![tool-avdexperienceestimator.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/tools-2375/tool-avdexperienceestimator.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/tools-2375/tool-avdexperienceestimator.png)

---

## What is Round Trip Time (RTT)?

The Round Trip Time is the time in milliseconds that a request needs to travel from its source to its destination and back to the source. In applications like Remote Desktop, a higher RTT can make actions like typing, clicking and moving windows feel less responsive.

According to Microsoft, an actual Azure Virtual Desktop connection with an RTT below `100ms` is generally ideal, while a connection above `200ms` can impact the user experience. Keep in mind that these are guidelines for actual AVD connections, not direct thresholds for the HTTPS measurements from this tool.

{{% alert title="Source" color="info" %}}
[https://learn.microsoft.com/en-us/troubleshoot/azure/virtual-desktop/troubleshoot-connection-quality#addressing-round-trip-time](https://learn.microsoft.com/en-us/troubleshoot/azure/virtual-desktop/troubleshoot-connection-quality#addressing-round-trip-time)
{{% /alert %}}

---

## The online estimator described

The tool compares HTTPS response times to Azure regions from the device and browser you are using. It works as follows:

1. When opening the website, the tool automatically starts a lookup of the first `5` available regions with configured test endpoints.
2. By clicking `Start full lookup`, the tool checks all regions that have a configured test endpoint. Multiple regions are tested in parallel.
3. The results are displayed in a table with the Azure region, `Latency (est.)` and `RTT (HTTPS)`.
4. You can sort the results by clicking on the column headers, for example to find the region with the lowest measured response time.
5. By clicking `Export`, you can export the results to a JSON file for further analysis.

The `RTT (HTTPS)` value is the median timing of browser HTTPS requests after a warmup. The `Latency (est.)` value is calculated as half of this RTT. This is only a rough estimate of one-way latency and is not a direct measurement.

It is important to know that the tool does not measure the actual RTT of an RDP session or use ICMP ping. Factors like your internet connection, browser, VPN, proxy and the network path can influence the results. The tool also does not test all required Azure Virtual Desktop firewall endpoints. An unavailable result therefore does not automatically mean that Azure Virtual Desktop is blocked.

---

## Summary

This online tool is useful to get a first impression of the response times to different Azure regions. It can be used during an initial setup, when comparing regions or as a first step during troubleshooting. For troubleshooting an existing Azure Virtual Desktop session, I recommend checking the actual connection data in Azure Virtual Desktop Insights as well as they give you the actual measured data. This tool can be used to give a basic understanding of the realtime experience from a certain network/device to one of the regions.

Thank you for reading this guide and I hope it was useful.

{{% alert title="Sources 📖" color="info" %}}
These sources helped me by writing and research for this post;

1. https://tools.justinverstijnen.nl/avdexperienceestimator/
2. https://learn.microsoft.com/en-us/troubleshoot/azure/virtual-desktop/troubleshoot-connection-quality#addressing-round-trip-time
3. https://learn.microsoft.com/en-us/troubleshoot/azure/virtual-desktop/troubleshoot-connection-quality
4. https://learn.microsoft.com/en-us/azure/virtual-desktop/insights-use-cases
{{% /alert %}}

{{< ads >}}

{{< article-footer >}}
