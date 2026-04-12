---
title: "Automatic resource tagging with Azure Policy"
date: 2026-05-07
slug: "automatic-resource-tagging-with-azure-policy"
categories:
  - Microsoft Azure
tags:
  - Step by Step guides
description: >
  In Azure we can link tags onto different resources, resource groups and subscriptions. We can use resource tagging for various reasons...
draft: true
---
In Azure we can link tags onto different resources, resource groups and subscriptions. We can use resource tagging for various reasons. With Azure Policy we can automate this process even further, linking different resources automatically based on what we want to achieve. For example, giving every resource in a specific resource group a tag.

For some inspiration on to how to actually use Azure Tags, check out my earlier blog: <https://justinverstijnen.nl/10-ways-to-use-tags-in-microsoft-azure/>

---

---

## The solution described

The solution we are going to build in this post, is simply a Azure Policy which we will link to a specific resource group in Azure. This simply looks like this:

In this Azure Policy, we will define that we want resource groups and underlying resources a specific tag based on certain conditions. Conditions like:

- Resource group
- Production or Testing environment
- Region of the resource

---

## Step 1: Create the Azure Policy definition

We can now create our Azure Policy that alters the resources and adds a tag just like we want to.

Open the Azure Portal and go to “Policy”. We will land on the Policy compliancy dashboard:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/automatic-resource-tagging-with-azure-policy-5017/jv-media-5017-70eb6b5c15f1.png)

As for this purpose, Microsoft has already two templates ready which we can use. You can also choose to start from scratch. There are many more policy templates available from here, but they all need to be implemented the same as this guide.

<https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/tag-policies>

I selected the "**Add a tag to resources**" policy template. Now we can select a scope, from where the policy must apply. We can also give it a custon name and description and possible exclusions.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/automatic-resource-tagging-with-azure-policy-5017/jv-media-5017-fef734887c07.png)

Click "Next".

On the "Parameters" tab, fill in the tag name (1st) and tag value (2nd) part of the tag to assign:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/automatic-resource-tagging-with-azure-policy-5017/jv-media-5017-a33279b2ff66.png)

For example, my testing resource group:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/automatic-resource-tagging-with-azure-policy-5017/jv-media-5017-bc29218b800c.png)

Click "Next" and you reach the "Remediation" tab.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/automatic-resource-tagging-with-azure-policy-5017/jv-media-5017-ff1a4e8bf80b.png)

The remediation task is the actual task that applies the tags. The definition is only stating what you want, the remediation task is the executor.

Enable the checkbox and select the policy you just selected.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/automatic-resource-tagging-with-azure-policy-5017/jv-media-5017-e28b03c5ac1a.png)

On the "Managed Identity" tab, select to use a System assigned managed identity and finish the wizard.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/automatic-resource-tagging-with-azure-policy-5017/jv-media-5017-059dde37ebb3.png)

---

## Step 2: Create a dummy resource

Now I created a dummy resource, just to check if it gets a tags assigned and test our current configuration. I created a public IP address as this is a easy and cheap resource which is deployed instantly.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/automatic-resource-tagging-with-azure-policy-5017/jv-media-5017-252c314b6547.png)

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/automatic-resource-tagging-with-azure-policy-5017/jv-media-5017-8df378386419.png)

Now we have to wait for some time, as the remediation task can take up to an hour to actually add the tag. In my case, it took a few minutes.

---

## Step 3: Let's test the results

In the Policy, the remediation task is now showing as running:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/automatic-resource-tagging-with-azure-policy-5017/jv-media-5017-f5e84325e50b.png)

Now I will go back to the Public IP address and check the results:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/automatic-resource-tagging-with-azure-policy-5017/jv-media-5017-2cbd795d7a95.png)

It indeed got the tag assigned automatically after about 5 minutes. This is really cool.

---

## Summary

Assigning tags automatically with Azure Policy is a great way to automate the process. It ensures every resource is tagged and no manual intervention is needed where a person can forget to link things or make a minor mistake.

Thank you for reading this blog and I hope it was helpful.

### Sources

These sources helped me by writing and research for this post;

1. <https://justinverstijnen.nl/10-ways-to-use-tags-in-microsoft-azure/>
2. <https://justinverstijnen.nl/deploy-resource-group-locks-automatically-with-azure-policy/>
3. <https://justinverstijnen.nl/automatic-azure-boot-diagnostics-monitoring-with-azure-policy/>

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
