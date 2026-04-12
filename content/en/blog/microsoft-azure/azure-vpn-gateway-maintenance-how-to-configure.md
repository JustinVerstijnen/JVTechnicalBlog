---
title: "Azure VPN Gateway Maintenance - How to configure"
date: 2025-01-01
slug: "azure-vpn-gateway-maintenance-how-to-configure"
categories:
  - Microsoft Azure
tags:
  - Step by Step guides
description: >
  Most companies who use Microsoft Azure in a hybrid setup have a Site-to-Site VPN gateway between the network in Azure and on-premises. This...
---
Most companies who use Microsoft Azure in a hybrid setup have a Site-to-Site VPN gateway between the network in Azure and on-premises. This connection becomes mission critical for this company as a disruption mostly means a disruption in work or processes.

But sometimes, Microsoft has to perform updates to these gateways to keep them up-to-date and secure. We can now define when this will be exactly, so we can configure the gateways to update only outside of business hours. In this guide I will explain how to configure this.

---

## Why configure a maintenance configuration?

We would want to configure a maintenance configuration for our VPN gateway to Azure to prevent unwanted updates during business hours. Microsoft doesn’t publish when they perform updates to their infrastructure, so this could be any moment.

Microsoft has to patch or replace their hardware regularly, and by configuring this maintenance configuration, we tell them: “Hey, please only do this for us in this window“. You could understand that configuring this is essential for availability reasons, but also don’t postpone updates too long for security and continuity reasons. My advice is to schedule these updates daily or weekly.

If the gateway is already up-to-date during the maintenance window, nothing will happen.

---

## How to configure a maintenance configuration

Let’s dive into how to configure this VPN gateway maintenance configuration. Open up the Azure Portal.

Then go to “VPN gateways“.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-vpn-gateway-maintenance-how-to-configure-4880/jv-media-4880-b59f33f9b766.png)

If this list is empty, you will have to select “VPN gateways“ in the menu on the left:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-vpn-gateway-maintenance-how-to-configure-4880/jv-media-4880-b0e937f538b8.png)

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-vpn-gateway-maintenance-how-to-configure-4880/jv-media-4880-63dee33f3210.png)

Open your VPN gateway and select “Maintenance“.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-vpn-gateway-maintenance-how-to-configure-4880/jv-media-4880-9019a9cd1f70.png)

Then click on “Create new configuration“.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-vpn-gateway-maintenance-how-to-configure-4880/jv-media-4880-b9002f544a37.png)

Fill in your details, select Resource at Maintenance Scope and Network Gateways for Maintenance subscope and then click “Add a schedule“.

Here I created a schedule that starts on Sunday at 00:00 hours and takes up to 6 hours:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-vpn-gateway-maintenance-how-to-configure-4880/jv-media-4880-91289c06a700.png)

This must obviously be scheduled at a time then the VPN gateway may be offline, so outside of business hours. This could also be every day, depending on your wishes and needs.

After configuring the schedule, save the schedule and advance to the “Resources“ tab:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-vpn-gateway-maintenance-how-to-configure-4880/jv-media-4880-613f3515184b.png)

Click the “+ Add resources“ button to add the virtual network gateway.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-vpn-gateway-maintenance-how-to-configure-4880/jv-media-4880-71f38e9192a6.png)

Then you can finish the wizard and the maintenance configuration will be applied to the VPN gateway.

---

## Summary

Configuring maintenance configuration is relatively easy to do and it helps your environment to be more predictable. However this may never be the case, we know for sure that Microsoft doesn’t apply updates to our VPN gateway during business hours.

### Sources

These sources helped me by writing and research for this post;

1. <https://learn.microsoft.com/en-us/azure/vpn-gateway/customer-controlled-gateway-maintenance>

{{< ads >}}

{{< article-footer >}}
