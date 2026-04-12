---
title: "Stop OneNote printer from being default printer in AVD"
date: 2025-01-10
slug: "stop-onenote-printer-from-being-default-printer-in-avd"
categories:
  - Azure Virtual Desktop
tags:
  - Step by Step guides
description: >
  If you have the Office Apps installed with OneNote included, sometimes the OneNote printer will be installed as default...
---
If you have the Office Apps installed with OneNote included, sometimes the OneNote printer will be installed as default:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/stop-onenote-printer-from-being-default-printer-in-avd-4308/jv-media-4308-b6757651a8fd.png)

This can be very annoying for our end users and ourselves as we want real printers to be the default printer. Today I will show you how to delete this printer for current and new session hosts permanently.

---

---

## The issue itself

The issue is that OneNote automatically creates a printer queue in Windows at installation for users to send information to OneNote. This will be something they use sometimes, but a physical printer will be used much more often. The most annoying part is that the software printer for OneNote will be marked as default printer every day which is annoying for the end users.

Advance through this page to see how I solved this problem many times, as our users don't use the OneNote printer. Why keeping something as we don't use it.

---

## My solution

My solution to fix this problem is to create a delete-printer rule with Group Policy Printers. These are very great as they will remove the printer now, but also if we roll out new session hosts in a few months. This will be a permanent fix until we delete the GPO.

Create a new Group Policy Object at yourt Active Directory Management server:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/stop-onenote-printer-from-being-default-printer-in-avd-4308/jv-media-4308-4c198b20eb50.png)

Choose "Create a GPO in this domain and Link it here..." or use your existing printers-GPO if applicable. The GPO must target users using the Azure Virtual Desktop environment.

Navigate to *User Configuration -> Preferences -> Control Panel Settings -> Printers*

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/stop-onenote-printer-from-being-default-printer-in-avd-4308/jv-media-4308-627f56d35f32.png)

Right-click on the empty space and select New -> Local Printer

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/stop-onenote-printer-from-being-default-printer-in-avd-4308/jv-media-4308-18661f3757b3.png)

The select "Delete" as action and type in exactly the name of the printer to be deleted, in this case:

{{< card code=true header="**JSON**" lang="json" >}}
OneNote (Desktop)
{{< /card >}}

Just like below:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/stop-onenote-printer-from-being-default-printer-in-avd-4308/jv-media-4308-2e2d2ea48430.png)

Click OK and check the settings for the last time:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/stop-onenote-printer-from-being-default-printer-in-avd-4308/jv-media-4308-a58c0aaf587e.png)

Now we are done and at the next login or Group Policy refresh interval, the OneNote printer will be completely deleted from the users' printers list.

---

## Summary

This is a very strange thing to happen but a relatively easy solution. I also tried deleting the printer through registery keys but this was very hard without success. Then I though of a better and easier solution as most deployments still need Active Directory.

Thank you for reading this guide and I hope it was helpful.

### Sources

These sources helped me by writing and research for this post;

1. <https://learn.microsoft.com/en-us/answers/questions/4915924/permanently-remove-send-to-onenote-printer-(set-as>

{{< ads >}}

{{< article-footer >}}
