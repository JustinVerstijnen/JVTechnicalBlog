---
title: "Rename name-tags to resource groups and resources"
date: 2024-06-18
slug: "renameable-name-tags-to-resource-groups-and-resources"
categories:
  - Microsoft Azure
tags:
  - Concepts
description: >
  By default, resource names in Azure aren't renameable. Luckily there now is a workaround for this with tags and i will explain you how to...
---
When it comes to naming your Azure Resource Groups and resources, most of them are not renameable. This due to limitations on the platform and maybe some underlying technical limitations. However, it is possible to assign a renameable tag to a resource in Azure which can be changed or used to clarify its role. This looks like this:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/renameable-name-tags-to-resource-groups-and-resources-164/jv-media-164-908f6f61e062.png)

---

---

## How to add those renameable tags in the Azure Portal?

You can add this name tag by using a tag in Microsoft Azure. In the portal, go to your resource and go to tags. Here you can add a new tag:

| **Na**me | **Value** |
| --- | --- |
| hidden-title | “This can be renamed“ |

An example of how this looks in the Azure Portal:

---

## Summary

I thought of how this renameable titels can be used in production. I can think of the following:

- New naming structure without deploying new resources
- Use complex naming tags and a human readable version as name tag
- More overview
- Documentation-purposes
- Add critical warning to resource

### Sources

These sources helped me by writing and research for this post;

1. <https://learn.microsoft.com/en-us/community/content/hidden-tags-azure>

{{< ads >}}

{{< article-footer >}}
