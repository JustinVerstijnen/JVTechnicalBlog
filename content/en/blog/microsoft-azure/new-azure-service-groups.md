---
title: "New: Azure Service Groups"
date: 2025-09-01
slug: "new-azure-service-groups"
categories:
  - Microsoft Azure
tags:
  - Concepts
description: >
  We now have a new feature in Microsoft Azure; Service Groups. In this guide, we will dive a bit deeper into Service Groups and what we can...
---
A new feature in Microsoft Azure rised up on the Microsoft pages; Service Groups. In this guide, we will dive a bit deeper into Service Groups and what we can do with them in practice.

At the time of writing, this feature is in public preview and anyone can use it now.

---

---

## What are these new Service Groups in Azure?

Service Groups are a parralel type of group to group resources and separate permissions to them. In this manner we can assign multiple resources of different resource groups and put them into a overshadowing Service Group to apply permissions. This eliminates the need to move resources into specific resource groups with all broken links that comes with it.

This looks like this:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/new-azure-service-groups-3200/jv-media-3200-edbad5477c81.png)

You can see these new service groups as a parallel Management Group, but then for resources.

---

## Features

- Logical grouping of your Azure solutions
- Multiple hierarchies
- Flexible membership
- Least privileges
- Service Group Nesting (placing them in each other)

---

## Service Groups in practice

Update 1 September 2025, the feature is in public preview, so I can do a little demonstration of this new feature.

In the Azure Portal, go to "Service Groups":

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/new-azure-service-groups-3200/jv-media-3200-5a752ecc22bd.png)

Then create a new Service Group.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/new-azure-service-groups-3200/jv-media-3200-39e86b19b65c.png)

Here I have created a service group for my tools which are on my website. These reside in different resource groups so it's a nice candidate to test with. The parent service group is the tenant service group which is the top level.

Now open your just created service group and add members to it, which can be subscriptions, resource groups and resources:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/new-azure-service-groups-3200/jv-media-3200-aba2bbb85c68.png)

Like I did here:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/new-azure-service-groups-3200/jv-media-3200-343454a44100.png)

---

## Summary

Service Groups are an great addition for managing permissions to our Azure resources. It delivers us a manner to give a person or group unified permissions across multiple resources that are not in the same resource group.

This can now be done, only with inheriting permissions flowing down, which means big privileges and big scopes. With this new function we can only select the underlying resources we want and so permit a limited set of permissions. This provider much more granular premissions assignments, and all of that free of charge!

### Sources

These sources helped me by writing and research for this post;

1. <https://learn.microsoft.com/en-us/azure/governance/service-groups/overview>

{{< ads >}}

{{< article-footer >}}
