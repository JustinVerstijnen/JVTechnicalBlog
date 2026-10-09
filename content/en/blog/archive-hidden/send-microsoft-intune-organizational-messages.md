---
title: "Send Organizational Messages with Microsoft Intune"
slug: "send-organizational-messages-with-microsoft-intune"
date: 2026-10-29
tags:
- Step by Step guides
categories:
- Microsoft Intune
description: "In this post, I will configure Organizational Messages using Microsoft Intune and the Microsoft 365 admin center to communicate directly with users through native Windows experiences such as the Taskbar, Notification Center and Windows Spotlight."
hidden: false
---

## Why use Organizational Messages?

Communication with end users is an important part of IT management. We can configure devices, deploy applications and enforce security settings with Microsoft Intune, but sometimes we simply need to tell our users something or announce an application update.

Of course, we can send an email or post something in Microsoft Teams. But let's be honest, not every email gets read and important IT communication can easily disappear between all the other messages users receive during the day. This is where Organizational Messages can be very useful as Organizational Messages allow us to communicate directly with users through locations they already use in Windows and Microsoft 365.

Some examples are:

- **Notification Center:** Show messages directly inside the Windows Notification Center
- **Taskbar:** Display a message above the Windows taskbar
- **Windows Spotlight:** Show organizational communication through Windows Spotlight
- **Microsoft Teams:** Display messages inside Microsoft Teams
- **Email:** Send supported organizational messages by email

This gives IT departments another communication channel without requiring users to install another application.

<!-- SCREENSHOT: Example of Organizational Message on Windows -->

In this post, I will configure Organizational Messages for Windows using Microsoft Intune and the Microsoft 365 admin center. We will configure the required Intune policy, create a message and check the end-user experience.

---

## How Organizational Messages work

Organizational Messages have changed quite a bit since Microsoft originally introduced the feature. The messages were originally created from Microsoft Intune, but Microsoft now provides a centralized Organizational Messages experience in the Microsoft 365 admin center as this is a feature that spans Microsoft 365 and Windows.

This means we basically have two parts:

| Platform | Purpose |
| --- | --- |
| Microsoft Intune | Configure Windows policies required to allow Organizational Messages |
| Microsoft 365 admin center | Create, schedule, target and monitor Organizational Messages |

Messages created in the Microsoft 365 admin center are being delivered within the first 24 hours of scheduling the message, but can take up loner. As far as I could found there is no way to force the notification to show by syncing or restarting the computer.

---

## Requirements

Before we start configuring Organizational Messages, there are some requirements we need to take into account.

For Windows messages, the devices need to meet the applicable Windows requirements and must be:

- Microsoft Entra ID joined or Entra hybrid joined
- Windows Enterprise license on client devices
- Microsoft 365 E3 or E5 licenses
- Organizational Messages Writer role

---

## Step 1: Allow Organizational Messages using Microsoft Intune

We also need to configure the Windows devices to actually receive organizational messages. Open the Microsoft Intune admin center: [https://intune.microsoft.com](https://intune.microsoft.com)

Then go to: `Devices > Configuration`  and click:  `+ Create > New policy` and configure the profile like this:

| Option | Value |
| --- | --- |
| Platform | Windows 10 and later |
| Profile type | Settings catalog |

Give the policy a recognizable name and description:

[![jv-media-8538-14bfad3552a1.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/send-organizational-messages-with-microsoft-intune/jv-media-8538-14bfad3552a1.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/send-organizational-messages-with-microsoft-intune/jv-media-8538-14bfad3552a1.png)

Continue to `Configuration settings` and click on `+ Add settings` . Then search for the  ``Experience` category.

We need to configure several settings because Windows features such as Notification Center and Windows Spotlight can otherwise block the messages.

Add the following settings and sub-settings in this order:

- Allow Windows Spotlight (User)
-
    - Allow Windows Spotlight on Action Center (User)
    - Allow Windows Tips
    - Configure Windows Spotlight on Lock Screen (User)
- Disable Cloud Optimized Content
- Enable delivery of organizational messages (User

[![jv-media-8538-ac90f7abe9d5.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/send-organizational-messages-with-microsoft-intune/jv-media-8538-ac90f7abe9d5.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/send-organizational-messages-with-microsoft-intune/jv-media-8538-ac90f7abe9d5.png)

Configure them like I have done:

| Setting | Configuration |
| --- | --- |
| Disable Cloud Optimized Content | Disabled |
| Allow Windows Spotlight (User) | Allow |
| Allow Windows Spotlight on Action Center (User) | Allow |
| Allow Windows Tips | Allow |
| Configure Windows Spotlight on Lock Screen (User) | Windows spotlight enabled |
| Enable delivery of organizational messages (User) | Allow |

{{% alert title="Important" color="warning" %}}
Existing Device Restriction or Settings Catalog policies can block Organizational Messages. Double check conflicting policies disabling Windows Spotlight, Windows Tips or organizational messages. Intune will show possible conflicts in Policy assignments.
{{% /alert %}}

Continue through the wizard and assign the policy to the devices that should be able to receive Organizational Messages. In my case, this is the group containing all my Windows Endpoints.

[![jv-media-8538-ba84c9d45954.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/send-organizational-messages-with-microsoft-intune/jv-media-8538-ba84c9d45954.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/send-organizational-messages-with-microsoft-intune/jv-media-8538-ba84c9d45954.png)

Finish the wizard by clicking `Create`.

---

## Step 2: Check the Intune policy deployment

Before creating our first message, let's verify that the configuration policy is successfully applied to our devices. Open the policy we just created and check:

`Device and user check-in status`

After creating the policy, this will show no results yet but this can take up to 60 minutes and a possible reboot of one of the endpoints:

[![jv-media-8538-53fe4e91f0a6.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/send-organizational-messages-with-microsoft-intune/jv-media-8538-53fe4e91f0a6.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/send-organizational-messages-with-microsoft-intune/jv-media-8538-53fe4e91f0a6.png)

Let's synchronize the latest settings to my testing machine:

[![jv-media-8538-5d2a0397d1c0.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/send-organizational-messages-with-microsoft-intune/jv-media-8538-5d2a0397d1c0.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/send-organizational-messages-with-microsoft-intune/jv-media-8538-5d2a0397d1c0.png)

After around 15 minutes and a reboot of my computer, the status shows this and the policies are active and Organizational Messages are ready to be sent:

[![jv-media-8538-39e7343a755f.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/send-organizational-messages-with-microsoft-intune/jv-media-8538-39e7343a755f.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/send-organizational-messages-with-microsoft-intune/jv-media-8538-39e7343a755f.png)

---

## Step 3: Create Organizational Messages

Now comes the fun part: creating our actual message to send to our end users. Open the Microsoft 365 admin center: [https://admin.microsoft.com](https://admin.microsoft.com)

And then go to: `Reports > Organizational messages`

[![jv-media-8538-8def376141b4.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/send-organizational-messages-with-microsoft-intune/jv-media-8538-8def376141b4.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/send-organizational-messages-with-microsoft-intune/jv-media-8538-8def376141b4.png)

The Organizational Messages page is basically the central location for everything related to the messages. From here we have three important options:

- **Create a message:**Create a message is logically where we create new communication
- **Manage messages:**Manage messages shows messages that are currently active, scheduled or still saved as drafts
- **Review activity:**Review activity gives us statistics about the messages after they have been delivered.

Let's click `Create a message`.

[![jv-media-8538-5335f2b76798.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/send-organizational-messages-with-microsoft-intune/jv-media-8538-5335f2b76798.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/send-organizational-messages-with-microsoft-intune/jv-media-8538-5335f2b76798.png)

We must first tell Microsoft 365 what the goal of our message is. The objectives can include subjects such as:

- Adoption
- Onboarding
- Sustainability
- Tech updates

[![jv-media-8538-fc5115a783a3.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/send-organizational-messages-with-microsoft-intune/jv-media-8538-fc5115a783a3.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/send-organizational-messages-with-microsoft-intune/jv-media-8538-fc5115a783a3.png)

For this example, I will create a message about an upcoming IT change, the Windows 11 update to 26H2. This is not a very big change but is fun to have a use case for this guide. I have selected the `Tech updates` objective.

The next step is selecting where the message should be displayed. For Windows, some of the most interesting locations are:

- Windows Spotlight
- Taskbar
- Notification Center

I selected the `Notifications area` just to test the message:

[![jv-media-8538-c35f59af97c1.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/send-organizational-messages-with-microsoft-intune/jv-media-8538-c35f59af97c1.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/send-organizational-messages-with-microsoft-intune/jv-media-8538-c35f59af97c1.png)

This is probably one of the easiest locations to start testing with because users are already familiar with Windows notifications. Select your preferred location and continue.

Now we have to select a premade template which we can use. I will use the `Software` template as we will inform users about the Windows 11 26H2 update which is rolling out at the time of writing. You can fully customize your messages sent, but I don't have all the required licenses in my tenant ready for this option, which is greyed out.

[![jv-media-8538-3eb123f50d80.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/send-organizational-messages-with-microsoft-intune/jv-media-8538-3eb123f50d80.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/send-organizational-messages-with-microsoft-intune/jv-media-8538-3eb123f50d80.png)

Now we have some predefined messages we can choose:

[![jv-media-8538-a91c4107490d.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/send-organizational-messages-with-microsoft-intune/jv-media-8538-a91c4107490d.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/send-organizational-messages-with-microsoft-intune/jv-media-8538-a91c4107490d.png)

And on the next step we can customize the message completely, adding a link to your organization's website or messages/helpdesk ticket or articles and a logo:

[![jv-media-8538-1006c9b0ac09.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/send-organizational-messages-with-microsoft-intune/jv-media-8538-1006c9b0ac09.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/send-organizational-messages-with-microsoft-intune/jv-media-8538-1006c9b0ac09.png)

We can then target different users in our organization. As I am the only user in my organization, I will use the `All company` group, but you could create a more granular group or use a department attribute.

[![jv-media-8538-23d3b5a81192.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/send-organizational-messages-with-microsoft-intune/jv-media-8538-23d3b5a81192.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/send-organizational-messages-with-microsoft-intune/jv-media-8538-23d3b5a81192.png)

Then we can configure the schedule, setting this starting today and the rest for the month and once a week:

[![jv-media-8538-50752baac735.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/send-organizational-messages-with-microsoft-intune/jv-media-8538-50752baac735.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/send-organizational-messages-with-microsoft-intune/jv-media-8538-50752baac735.png)

Now we can review the complete message and spot any possible errors before publishing:

[![jv-media-8538-55b66bd94662.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/send-organizational-messages-with-microsoft-intune/jv-media-8538-55b66bd94662.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/send-organizational-messages-with-microsoft-intune/jv-media-8538-55b66bd94662.png)

Then finish the wizard and the message is ready to be sent to your users and devices which will happen automatically.

[![jv-media-8538-02441dab56dc.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/send-organizational-messages-with-microsoft-intune/jv-media-8538-02441dab56dc.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/send-organizational-messages-with-microsoft-intune/jv-media-8538-02441dab56dc.png)

---

## The result on the client side

After the message becomes active and Windows retrieves the message, it will be shown to the targeted user.

For a Notification Center message, the experience looks like a normal Windows notification but with the organizational content we configured earlier.

The user can interact with the message and open the URL we configured.

I really like this approach because the communication becomes part of the operating system instead of yet another email.

But don't overdo it.

If users receive organizational messages all the time, they will eventually start ignoring them just like emails and other notifications.

Use them for communication that actually provides value.

---

## Summary

Organizational Messages give IT administrators another way to communicate directly with users without completely relying on email or Microsoft Teams.

The configuration consists of two main parts. We use Microsoft Intune to configure the required Windows policies and the Microsoft 365 admin center to create, target, schedule and monitor the actual messages.

I especially like the fact that the messages can appear directly inside Windows. This makes Organizational Messages useful for things like IT maintenance, security communication, application rollouts and user adoption.

The reporting functionality is also a welcome addition, as we can actually see whether messages are being viewed and clicked.

Just make sure not to turn every small IT announcement into an Organizational Message. If we keep the messages relevant, they can become a useful additional communication channel instead of another notification users automatically dismiss.

I hope this post was helpful and thank you for reading!

{{% alert title="Sources 📖" color="info" %}}
These sources helped me by writing and research for this post;

1. https://learn.microsoft.com/en-us/microsoft-365/admin/misc/organizational-messages-microsoft-365
2. https://learn.microsoft.com/en-us/microsoft-365/admin/misc/organizational-messages-microsoft-365-faq
3. https://learn.microsoft.com/windows/client-management/mdm/policy-csp-experience
{{% /alert %}}

{{< ads >}}

{{< article-footer >}}