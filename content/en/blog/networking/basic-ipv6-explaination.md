---
title: "The Basics and Benefits of IPv6"
date: 2025-02-14
slug: "basic-ipv6-explaination"
categories:
  - Networking
tags:
  - Concepts
description: >
  We hear it a lot these days and it's a very common network addressing protocol. On this page I will describe the basics and benefits of IPv6.
---
IPv6. We hear it a lot these days and it's a very common network addressing protocol and the successor of the older IPv4, but will not necessarily take over IPv4 100% (yet). On this page I will describe the basics, some tips and the benefits.

---

## Requirements

- Around 15 minutes of your time
- Basic networking knowledge is great

---

## IP addressing with IPv4 and IPv6

When we speak of a network, we speak of a set connected devices (we call them clients/nodes) where each device has its own use. Also there are some fundamental components every network has:

- Router (this device connects your network to other networks like the internet)
- Client

Like i said, your network contains several devices and each devices has to know how to connect to an other device. This will be done using an IP address. Using IP addresses enables you to have a very efficient network in terms of cabling. In the past there some coaxial based networks where every device was physically connected to each other.

You can pretty much compare IP addresses to sending a post card in real life. Your postal company has to know where your postcard must be delivered, but then in terms of finding the right device in your network.

## IP addresses examples

An IP address looks like the addresses below:

- 192.168.1.25 or 172.16.4.75 for **IPv4**
- fd00::1or fd85:28a1:f4fa::1 for **IPv6**

## IPv4 addressing

In the early ages of computers, a digital manner of adressing network devices was needed. After some research IPv4 was born. A very efficient addressing manner which is easily understandable by computers but also for humans. We humans like easy dont we?

The whole IPv4 addresses space contains 32 bits which means there are 4,3 billion (232) different addresses possible. In the early 80's when IPv4 was founded this was more than enough.

With the rapid increase in devices worldwide, the shortage of IPv4 addresses became increasingly apparent. This is not surprising, considering that the global number of people is nearly twice the number of available IPv4 addresses.

## IPv6 addressing

To fulfill the shortage of IP addresses, IPv6 was born in 1998 which has as primary goal to fulfill the requirement of having enough addresses available for everyone. Fortunately, they did not go way over the top and instead used a 128 bits (2128) address space. In this space, the total usable addresses in IPv6 are 340.282.366.920.938.463.463.374.607.431.768.211.456 (340 undecillion).

### Try it yourself: IPv6 and my website

Did you know my webserver is accessible though IPv6? You can test this yourself in CMD or Powershell

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
ping -6 justinverstijnen.nl
{{< /card >}}

This will ping my domain-name by using IPv6. The following will be the outcome:

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
Pinging justinverstijnen.nl [2a01:7c8:f0:1142:0:2:ca6:d853] with 32 bytes of data:
Request timed out.
{{< /card >}}

The ping request will fail because my webserver is configured to do so. This for security reasons. Lets continue our IPv6 journey.

---

## Addressing scheme

Both IPv4 and IPv6 use a similar addressing scheme which is similar to your physical home address and number:

|  |  |  |  |
| --- | --- | --- | --- |
| **Type** | **Network ID** | **Host ID** | **Full address** |
| IPv4 | 192.168.10.0/24 | .25 | 192.168.10.25 |
| IPv6 | fd12:3456:789a::/64 | ::100 | fd12:3456:789a::100 |

A great way to better understand this:

- **Network ID** represents the street, which is the same for all buildings in that street.

- **Host ID** represents the unique number of your building/house, which is different for each building in the same street.

---

## Differences between IPv4 and IPv6 and benefits

Most of the time in our job, a higher number means faster. Unfortunately this is not the case with IPv6. IPv6's main job is to create more possible addresses. It does have some great advantages because at the time of founding there was more knowledge, like real world scenario's where IPv4 weak points were.

|  |  |
| --- | --- |
| **Advantage IPv6** | **More information** |
| Larger address space | IPv6 has more than a million IP addresses available per person on earth and IPv4 has 0,5 IP addresses per person. |
| Better security with IPSec | IPv6 supports built in IPsec where every package is encrypted at sending and decrypted at receiving to prevent an attacker to steal packages and monitor your behaviour online. |
| Easy network setup with SLAAC | IPv4 requires DHCP or static adressing where IPv6 the device can assign a address itself using duplicate detection, router advertisements and auto assignment. |
| No NAT needed | Because we dont need to share IP addresses anymore, the need of NAT is eliminated. You can directly connect on a device (when the firewall is configured to do so of course). |
| Multicast instead of broadcast | In a network, some devices like Chromecast, Sonos and Airplay use broadcast to advertise themselves. This means it sends a package to all devices. Multicast in IPv6 sends only to specified devices to reduce network load. |

## Common IPv4 addresses in IPv6

When it comes to compare generic terms in networking, you can use the table below:

|  |  |  |
| --- | --- | --- |
| **Explaination** | **IPv4** | **IPv6** |
| Localhost address | 127.0.0.1 | ::1 |
| No DHCP server (APIPA) | 169.254.0.0/16 | fe80::/10 |
| Subnet mask | 255.255.255.0 | /64 |
| Types of network routing | Class A, B and C | 1 class |
| Type of notation | Decimal (0-9) with dots . | Hexadecimal (0-9 and A-F) with colons : |

---

## Summary

This page greatly explains how IPv4 and IPv6 addresses and their basics and benefits work, and there is a lot to also tell about. Obviously too much to include on a single page. Also i want the content to be readable and to stay within the best attention span of humans :).

{{< ads >}}

{{< article-footer >}}
