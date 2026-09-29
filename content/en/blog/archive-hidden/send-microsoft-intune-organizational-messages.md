---
title: "Send Organizational Messages with Microsoft Intune"
slug: "send-organizational-messages-with-microsoft-intune"
date: 2026-10-29
tags:
- Step by Step guides
- Knowledge check
categories:
- Microsoft Intune
description: "In this post, I will configure Organizational Messages using Microsoft Intune and the Microsoft 365 admin center to communicate directly with users through native Windows experiences such as the Taskbar, Notification Center and Windows Spotlight."
hidden: false
---

## Why use Organizational Messages?

Communication with end users is an important part of IT management.

We can configure devices, deploy applications and enforce security settings with Microsoft Intune, but sometimes we simply need to tell our users something.

Of course, we can send an email or post something in Microsoft Teams. But let's be honest, not every email gets read and important IT communication can easily disappear between all the other messages users receive during the day.

This is where **Organizational Messages** can be very useful.

Organizational Messages allow us to communicate directly with users through locations they already interact with in Windows and Microsoft 365.

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

Organizational Messages have changed quite a bit since Microsoft originally introduced the feature.

The messages were originally created from Microsoft Intune, but Microsoft now provides a centralized **Organizational Messages** experience in the Microsoft 365 admin center.

This means we basically have two parts:

| Platform | Purpose |
| --- | --- |
| Microsoft Intune | Configure Windows policies required to allow Organizational Messages |
| Microsoft 365 admin center | Create, schedule, target and monitor Organizational Messages |

This separation actually makes sense.

Microsoft Intune controls whether the Windows device is technically allowed to display the messages, while the Microsoft 365 admin center is used to manage the communication itself.

{{% alert title="Important" color="info" %}}
Older articles might show Organizational Messages directly under **Tenant administration** in Microsoft Intune. The current centralized authoring experience is available from the **Microsoft 365 admin center**.
{{% /alert %}}

---

## Requirements

Before we start configuring Organizational Messages, there are some requirements we need to take into account.

For Windows messages, the devices need to meet the applicable Windows requirements and must be:

- Microsoft Entra ID joined, or
- Microsoft Entra hybrid joined

The Organizational Messages platform also needs access to these endpoints:

- `fd.api.orgmsg.microsoft.com`
- `ris.prod.api.personalization.ideas.microsoft.com`

For creating messages, the administrator needs the **Organizational Messages Writer** role.

If custom messages need to go through an approval workflow, another administrator can be assigned the **Organizational Messages Approver** role.

Custom Windows messages require one of the supported licenses, such as:

- Windows Enterprise E3
- Windows Enterprise E5
- Microsoft 365 E3
- Microsoft 365 E5

Some pre-made messages can still be available without these advanced licensing requirements.

{{% alert title="Note" color="warning" %}}
The available message locations and features can depend on the Windows version, installed Windows updates and licensing in your tenant. Always check the latest Microsoft documentation before rolling this out organization-wide.
{{% /alert %}}

---

## Step 1: Assign the Organizational Messages Writer role

Let's first make sure our administrator has permissions to create Organizational Messages.

Open the Microsoft 365 admin center:

[https://admin.microsoft.com](https://admin.microsoft.com)

Go to:

**Users > Active users**

Select the administrator that should be allowed to create messages and open **Manage roles**.

<!-- SCREENSHOT: Active users and Manage roles -->

Under the available administrator roles, look for:

**Organizational Messages Writer**

Enable the role and save the changes.

<!-- SCREENSHOT: Organizational Messages Writer role -->

If your organization wants to use approval workflows for custom messages, you can also assign another administrator the:

**Organizational Messages Approver**

role.

I recommend separating the Writer and Approver roles when you are going to use Organizational Messages for larger environments. This prevents one administrator from creating and approving their own communication.

---

## Step 2: Allow Organizational Messages using Microsoft Intune

Now we can configure the Windows devices.

Open the Microsoft Intune admin center:

[https://intune.microsoft.com](https://intune.microsoft.com)

Then go to:

**Devices > Configuration**

Click:

**+ Create > New policy**

<!-- SCREENSHOT: Create new configuration policy -->

Configure the profile like this:

| Option | Value |
| --- | --- |
| Platform | Windows 10 and later |
| Profile type | Settings catalog |

Click **Create**.

Give the policy a recognizable name. For example:

**Windows - Organizational Messages**

For the description I used:

**Enables the required Windows settings to allow Organizational Messages.**

<!-- SCREENSHOT: Basics settings -->

Continue to **Configuration settings** and click **+ Add settings**.

Search for the **Experience** category.

We need to configure several settings because Windows features such as Notification Center and Windows Spotlight can otherwise block the messages.

Add the following settings:

- Enable delivery of organizational messages (User)
- Allow Windows Spotlight (User)
- Allow Windows Spotlight on Action Center (User)
- Allow Windows Tips
- Disable Cloud Optimized Content
- Configure Windows Spotlight on Lock Screen (User)

<!-- SCREENSHOT: Settings picker with Organizational Messages -->

Configure them like this:

| Setting | Configuration |
| --- | --- |
| Enable delivery of organizational messages (User) | Allow |
| Allow Windows Spotlight (User) | Allow |
| Allow Windows Spotlight on Action Center (User) | Allow |
| Allow Windows Tips | Allow |
| Disable Cloud Optimized Content | Disabled |
| Configure Windows Spotlight on Lock Screen (User) | Windows spotlight enabled |

<!-- SCREENSHOT: Configured Settings Catalog options -->

{{% alert title="Important" color="warning" %}}
Existing Device Restriction or Settings Catalog policies can block Organizational Messages. Make sure there are no conflicting policies disabling Windows Spotlight, Windows Tips or organizational messages.
{{% /alert %}}

Continue through the wizard and assign the policy to the users or devices that should be able to receive Organizational Messages.

For testing purposes, I recommend starting with a small test group instead of assigning the policy to the complete organization immediately.

Finish the wizard by clicking **Create**.

---

## Step 3: Check the Intune policy deployment

Before creating our first message, let's verify that the configuration policy is successfully applied.

Open the policy we just created and check:

**Device and user check-in status**

<!-- SCREENSHOT: Intune policy deployment status -->

The targeted test device should eventually show the policy as **Succeeded**.

You can also check the configuration locally on a Windows device if troubleshooting is required.

Open:

**Settings > Accounts > Access work or school**

Select your connected organizational account and export the management logs.

Windows saves these files to:

{{< card code=true header="**Path**" lang="text" >}}
C:\Users\Public\Documents\MDMDiagnostics
{{< /card >}}

These logs can be useful when Organizational Messages are not showing up even though the configuration looks correct in Microsoft Intune.

---

## Step 4: Open Organizational Messages

Now comes the fun part: creating our actual message.

Open the Microsoft 365 admin center:

[https://admin.microsoft.com](https://admin.microsoft.com)

Go to:

**Reports > Organizational messages**

<!-- SCREENSHOT: Organizational Messages overview -->

The Organizational Messages page is basically the central location for everything related to the messages.

From here we have three important options:

- **Manage messages**
- **Create a message**
- **Review activity**

Manage messages shows messages that are currently active, scheduled or still saved as drafts.

Create a message is logically where we create new communication.

Review activity gives us statistics about the messages after they have been delivered.

Let's click **Create a message**.

---

## Step 5: Create an Organizational Message

The creation wizard guides us through the complete process.

The first option is the **Objective**.

Depending on the features currently available in your tenant, objectives can include subjects such as:

- Adoption
- Onboarding
- Sustainability
- Tech updates

<!-- SCREENSHOT: Objective selection -->

For this example, I will create a message about an upcoming IT change.

Select the appropriate objective and continue.

The next step is selecting where the message should be displayed.

For Windows, some of the most interesting locations are:

- Windows Spotlight
- Taskbar
- Notification Center

<!-- SCREENSHOT: Select message location -->

For this example, I will use the **Notification Center**.

This is probably one of the easiest locations to start testing with because users are already familiar with Windows notifications.

Select the location and continue.

---

## Step 6: Select a template or create your own message

Depending on your licensing and selected location, Microsoft provides different options for the actual content.

We can use a pre-made Microsoft message or create our own custom message.

For our example, I want full control over the communication, so I will use:

**Create your own**

<!-- SCREENSHOT: Template selection -->

Now we can configure the actual message.

For example:

**Title:**

IT maintenance scheduled

**Message:**

Maintenance will be performed on our IT environment this Friday evening. Save your work before leaving the office.

We can also provide a URL where users can find additional information.

<!-- SCREENSHOT: Custom message configuration -->

This is especially useful because the Organizational Message itself can remain short and clean while a knowledge base, SharePoint page or service portal contains the complete information.

{{% alert title="Tip" color="info" %}}
Keep Organizational Messages short and actionable. Users should immediately understand why they are seeing the message and what you expect them to do.
{{% /alert %}}

---

## Step 7: Select the recipients

Next, we need to decide who should receive the message.

Organizational Messages can target Microsoft Entra groups.

Depending on the licensing and features enabled in the tenant, advanced targeting can also become available based on organizational information such as:

- Company
- Department
- Location
- Usage

<!-- SCREENSHOT: Recipients selection -->

For this guide, I will simply select my test group.

Again, testing with a limited number of users before targeting the complete organization is something I strongly recommend.

This gives us the chance to verify:

- The message formatting
- The configured URL
- The Windows user experience
- Delivery
- Language
- Frequency

before showing the message to hundreds or thousands of users.

---

## Step 8: Configure the schedule

Now we can configure when the message should be displayed.

Organizational Messages support a start and end date and, depending on the message type, a frequency.

<!-- SCREENSHOT: Schedule options -->

This is very useful compared to a traditional email.

Instead of sending one email and hoping the user notices it, Windows can display the message again depending on the configured schedule and user interaction.

Configure the schedule that fits your use case and continue.

{{% alert title="Note" color="warning" %}}
Organizational Messages should not be treated as a guaranteed instant notification platform. Windows retrieves messages using a pull mechanism and normal messages can take time before they appear on the endpoint.
{{% /alert %}}

Microsoft also provides an **Urgent message** option for supported Windows locations.

Urgent messages are intended for time-sensitive communication and can currently be used with locations such as:

- Taskbar
- Notification Center

Even with urgent delivery, message delivery is still best effort and should not replace emergency communication systems.

---

## Step 9: Review and create the message

The final page gives us the option to review everything we configured.

Check:

- Objective
- Location
- Message
- URL
- Recipients
- Schedule

<!-- SCREENSHOT: Review message -->

If everything looks correct, finish the wizard.

Pre-made messages can be scheduled directly.

Custom messages can require approval when your organization uses the Organizational Messages approval workflow.

Once submitted, the message will receive a status.

Some statuses you might see are:

| Status | Meaning |
| --- | --- |
| Draft | Message is saved but not yet completed |
| Pending approval | Waiting for an approver |
| Scheduled | Message is ready and waiting for its configured start |
| Active | Message is currently being delivered |
| Completed | Delivery period has finished |
| Failed | Message couldn't be registered correctly |
| Canceled | Message was canceled by an administrator |

---

## Step 10: End-user experience

After the message becomes active and Windows retrieves the message, it will be shown to the targeted user.

For a Notification Center message, the experience looks like a normal Windows notification but with the organizational content we configured earlier.

<!-- SCREENSHOT: End-user Notification Center message -->

The user can interact with the message and open the URL we configured.

A Taskbar message is more noticeable and appears directly around the Windows taskbar area.

<!-- SCREENSHOT: End-user Taskbar message -->

Windows Spotlight provides another option for communication directly through Windows.

<!-- SCREENSHOT: Windows Spotlight Organizational Message -->

I really like this approach because the communication becomes part of the operating system instead of yet another email.

But don't overdo it.

If users receive organizational messages all the time, they will eventually start ignoring them just like emails and other notifications.

Use them for communication that actually provides value.

{{< ads >}}

---

## Monitoring Organizational Messages

Creating messages is one thing, but we also want to know whether users actually see them.

Open:

**Reports > Organizational messages > Review activity**

<!-- SCREENSHOT: Review activity -->

Microsoft provides reporting information for Organizational Messages, including metrics such as:

- Messages seen
- Clicks
- Clickthrough rate

This makes Organizational Messages especially interesting for communication campaigns.

For example, imagine that we announce a new Company Portal, security training or Copilot rollout.

Instead of simply sending an email, we can now get an indication of whether users actually saw and interacted with the communication.

The results can also help us decide if another communication method is needed.

---

## Allow Organizational Messages but block Microsoft messages

There is another interesting option.

Organizations might want to use their own Organizational Messages but don't necessarily want additional Microsoft messages to appear through the same platform.

This can be configured separately.

Open:

**Microsoft 365 admin center > Reports > Organizational messages**

Click the **Settings** icon.

From there, disable:

**Allow Microsoft messages to display**

<!-- SCREENSHOT: Allow Microsoft messages setting -->

Your own organizational messages can then remain available while Microsoft-generated messages are disabled.

This gives us a little more control over what users actually see.

---

## When should you use Organizational Messages?

I wouldn't replace all other communication channels with Organizational Messages.

Instead, I see them as another useful tool in the communication toolbox.

Some good use cases could be:

- Planned IT maintenance
- A new application rollout
- Security awareness
- Introducing Microsoft Copilot
- Company Portal adoption
- Windows upgrade communication
- New employee onboarding
- Training announcements
- Important IT changes
- Links to internal documentation

An email can still contain all the details, but an Organizational Message can make sure users actually notice that something is happening.

And because the messages appear directly inside Windows, they can be especially useful for IT-related communication.

---

## Knowledge check

{{< quiz >}}
{
  "intro": "Answer these question(s) to test your understanding of this post. Your answers are not saved or sent anywhere; this is simply a personal knowledge check. If you refresh the page, your answers will be cleared.",
  "questions": [
    {
      "question": "Where are Organizational Messages currently created and centrally managed?",
      "reference": "How Organizational Messages work",
      "referenceUrl": "#how-organizational-messages-work",
      "answers": [
        {
          "text": "Microsoft 365 admin center",
          "correct": true,
          "message": "Correct! This is the right answer."
        },
        {
          "text": "Microsoft Defender portal",
          "correct": false,
          "message": "Incorrect. Review the referenced section and try again."
        },
        {
          "text": "Microsoft Entra admin center",
          "correct": false,
          "message": "Incorrect. Review the referenced section and try again."
        },
        {
          "text": "Windows Settings",
          "correct": false,
          "message": "Incorrect. Review the referenced section and try again."
        }
      ]
    },
    {
      "question": "What role is required to create Organizational Messages?",
      "reference": "Step 1: Assign the Organizational Messages Writer role",
      "referenceUrl": "#step-1-assign-the-organizational-messages-writer-role",
      "answers": [
        {
          "text": "Organizational Messages Writer",
          "correct": true,
          "message": "Correct! This is the right answer."
        },
        {
          "text": "Intune Help Desk Operator",
          "correct": false,
          "message": "Incorrect. This role doesn't provide the required authoring permissions."
        },
        {
          "text": "Security Reader",
          "correct": false,
          "message": "Incorrect. Review the referenced section and try again."
        },
        {
          "text": "Reports Reader",
          "correct": false,
          "message": "Incorrect. Review the referenced section and try again."
        }
      ]
    },
    {
      "question": "Which Microsoft Intune profile type can we use to enable Organizational Messages on Windows?",
      "reference": "Step 2: Allow Organizational Messages using Microsoft Intune",
      "referenceUrl": "#step-2-allow-organizational-messages-using-microsoft-intune",
      "answers": [
        {
          "text": "Settings catalog",
          "correct": true,
          "message": "Correct! This is the right answer."
        },
        {
          "text": "Compliance policy",
          "correct": false,
          "message": "Incorrect. Compliance policies aren't used for this configuration."
        },
        {
          "text": "Endpoint detection and response",
          "correct": false,
          "message": "Incorrect."
        },
        {
          "text": "App configuration policy",
          "correct": false,
          "message": "Incorrect."
        }
      ]
    },
    {
      "question": "Which of these is a supported Windows location for Organizational Messages?",
      "reference": "Step 5: Create an Organizational Message",
      "referenceUrl": "#step-5-create-an-organizational-message",
      "answers": [
        {
          "text": "Notification Center",
          "correct": true,
          "message": "Correct! This is the right answer."
        },
        {
          "text": "Windows Registry Editor",
          "correct": false,
          "message": "Incorrect."
        },
        {
          "text": "Task Manager",
          "correct": false,
          "message": "Incorrect."
        },
        {
          "text": "Device Manager",
          "correct": false,
          "message": "Incorrect."
        }
      ]
    }
  ]
}
{{< /quiz >}}

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
4. https://inthecloud247.com/microsoft-intune-organizational-messages-preview/
{{% /alert %}}

{{< ads >}}

{{< article-footer >}}