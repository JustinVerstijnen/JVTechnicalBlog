---
title: "Microsoft Secure Score \u2013 Data"
date: 2026-04-23
slug: "microsoft-secure-score-data"
categories:
  - Secure Score
tags:
  - Step by Step guides
description: >
  This guide explains how I configured the Secure Score recommendations related to Microsoft Information Protection and Purview.
draft: true
---
This guide explains how I configured the Secure Score recommendations related to Microsoft Information Protection and Purview.

Make sure that to target those recommendations, you will need at least Microsoft 365 E5 licenses (or separate licenses that do the job).

---

## Before we begin

I collected all the options of the Microsoft Entra ID Identity Secure Score on this page, and we will address them all. I also added some industry-accepted options which are not in the secure score framework but are really helpful in avoiding or minimizing attacks in your environment.

You can use all options, or only use a subset of the options. This is up to you :)

Remember, having a secure score of 100% doesn't mean 100% security. This only means you are using 100% of the security toolbox.

Starting this page, my Secure Score overview is this:

---

## The Data pillar recommendations

Let's check first which requirements we have to address. Go to <https://security.microsoft.com/securescore> and select the Data recommendations only:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/microsoft-secure-score-data-6883/jv-media-6883-dd4a5aa39d22.png)

This gives us these four recommendation we must address:

- Data #1: Ensure DLP policies are enabled
- Data #2: Publish M365 sensitivity label data classification policies
- Data #3: Extend M365 sensitivity labeling to assets in Microsoft Purview data map
- Data #4: Ensure that Auto-labeling data classification policies are set up and used

Let's solve them step-by-step.

---

## Data #1: Ensure DLP policies are enabled

Data Loss Prevention (DLP) policies help prevent sensitive information from being shared outside your organization or used improperly. Examples of using DLP are to forbid sending creditcard information, personal information or to notify users of the potential data they sent, creating a little extra awareness.

To create and enable an DLP policy, let's open the Purview Compliance Portal (<https://purview.microsoft.com>).

Then navigate to Data loss prevention:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/microsoft-secure-score-data-6883/jv-media-6883-9eac8c845d2d.png)

Click "+ Create policy" to create a new DLP policy.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/microsoft-secure-score-data-6883/jv-media-6883-30fd17d0dfcc.png)

Choose the option "Enterprise & devices"

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/microsoft-secure-score-data-6883/jv-media-6883-2e8b8de796ab.png)

You can start from a template or start from scratch at the first step. Think of what you want to do.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/microsoft-secure-score-data-6883/jv-media-6883-9199460ce2cd.png)

Click "Next". Give the policy a name and description according to your documentation.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/microsoft-secure-score-data-6883/jv-media-6883-0894781f4c53.png)

Click "Next". You can now decide if you want to use administrative units of Entra ID. In my case, I skipped this step.

Now you can decide where to apply the policy. To make it the most effective, assign it to all locations, which is by default.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/microsoft-secure-score-data-6883/jv-media-6883-1e6909f0dba9.png)

Click "Next" twice. Now we can create some advanced rules. This is up to you of course, but I will make some rules to give a basic example of the possibilities.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/microsoft-secure-score-data-6883/jv-media-6883-420a53757663.png)

I clicked "+ Create rule" and gave it a name and description. Then I added 2 sensitive information types and stated that they are sent externally:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/microsoft-secure-score-data-6883/jv-media-6883-f63b7834e343.png)

At the "Actions" section, we are able to block the action:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/microsoft-secure-score-data-6883/jv-media-6883-0c8249388fc4.png)

Save the policy, assign it to a group of users (All company group) and that should be it for this recommendation.

---

## Data #2: Publish M365 sensitivity label data classification policies

Sensitivity labels are used to classify content (Public, Internal, Confidential) and apply protection based on the classification. This means users must label their documents, or we can do this with automatic policies.

To create and enable sensitivity label, let's open the Purview Compliance Portal (<https://purview.microsoft.com>).

Then navigate to: Information protection

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/microsoft-secure-score-data-6883/jv-media-6883-37b7a6dfc125.png)

Then select "Sensitivity labels" from the left and click "+ Create a label"

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/microsoft-secure-score-data-6883/jv-media-6883-05e895c5b44e.png)

You must now create a label to classify certain data to a certain type of information. Some examples of things you can do are:

1. Public content
2. Confidential -> Business Secrets
3. Confidential -> Personally Identifiable Information (PII)

For this guide, I will make a label for Personally Identifiable Information (PII).

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/microsoft-secure-score-data-6883/jv-media-6883-016f5d0a0cc7.png)

I also selected the red color as color of danger. Then click "Next" twice.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/microsoft-secure-score-data-6883/jv-media-6883-aa0ab402586e.png)

Then I selected the credit card and Netherlands Citizen (BSN) number as information that it must contain before auto labeling the documents, but you can customize this to your own needs.

Finish the wizard.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/microsoft-secure-score-data-6883/jv-media-6883-4d9441873403.png)

After creating the label, Purview asks you if you want to publish the label, which is a requirement for succeeding in this recommendation.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/microsoft-secure-score-data-6883/jv-media-6883-4cb52a5ce7f1.png)

Select an existing label policy or create a new one by clicking "Create new label policy". For finishing this guide, I will create a new label policy.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/microsoft-secure-score-data-6883/jv-media-6883-32349ff95663.png)

Select the labels to publish and click "Next".

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/microsoft-secure-score-data-6883/jv-media-6883-ffa69c50a53a.png)

Select the users and groups for the label to apply and click "Next".

You can now decide to use one of these advanced options:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/microsoft-secure-score-data-6883/jv-media-6883-348f35d1a9c1.png)

I chose the first option, because we want that for complaince and auditing reasons. Then click "Next".

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/microsoft-secure-score-data-6883/jv-media-6883-a0f2bc9210ff.png)

Select the label just created, and repeat this for every type on the left. You can use "Same as document" for a speedy finishing of the wizard.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/microsoft-secure-score-data-6883/jv-media-6883-0917c3ef8252.png)

Click "Next" and after that "Finish" to publish the label. That should be it for this recommendation.

---

## Data #3: Extend M365 sensitivity labeling to assets in Microsoft Purview data map

This recommendation allows sensitivity labels to apply to data sources discovered in Purview (Azure SQL, Storage, etc.). The fun fact is that if you followed the guide till here, you already configured it.

In the label itself, you must have this enabled:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/microsoft-secure-score-data-6883/jv-media-6883-bf3736a5ef47.png)

And in the labeling policy, you must have the label selected at this page:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/microsoft-secure-score-data-6883/jv-media-6883-d40baf3737c2.png)

---

## Data #4: Ensure that Auto-labeling data classification policies are set up and used

This recommendation wants us to configure automatically applying sensitivity labels based on detected content. The fun fact is again, we already configured this in recommendation 1 and 2:

In the labeling policy, we must configure this:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/microsoft-secure-score-data-6883/jv-media-6883-c28b90debfcb.png)

And in the label itself, we must configure this:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/microsoft-secure-score-data-6883/jv-media-6883-4859d386b023.png)

---

## The result

After I did all the configurations described on this page, my Data secure score was at the full max, 100%:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/microsoft-secure-score-data-6883/jv-media-6883-ff61bbb1a096.png)

---

## Summary

Configuring these data protection measures is an important step in preventing data leaks and protecting sensitive information. It also helps you become more aware of which data needs extra care, and where users should be more cautious in their daily work. The last thing anyone wants is to lose personal or business-critical data, especially with all the compliance implications and potential damage that can follow.

Thank you for taking the time to read this guide. I hope it was helpful and gives you a solid starting point for improving your data protection setup.

### Sources

These sources helped me by writing and research for this post;

1. <https://learn.microsoft.com/en-us/purview/data-map-sensitivity-labels>
2. <https://learn.microsoft.com/en-us/purview/data-map-sensitivity-labels-apply>
3. <https://learn.microsoft.com/en-us/purview/dlp-overview-plan-for-dlp>

{{< ads >}}

{{< article-footer >}}
