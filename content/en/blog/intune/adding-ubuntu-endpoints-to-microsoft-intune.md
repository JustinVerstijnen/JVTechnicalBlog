---
title: "Adding Ubuntu endpoints to Microsoft Intune"
slug: "adding-ubuntu-endpoints-to-intune"
date: 2026-06-11
tags:
- Step by Step guides
- Knowledge check
categories:
- Microsoft Intune
description: "In this post, I will be installing an Ubuntu Desktop instance and join it to Microsoft Intune to leverage Device Management on Ubuntu devices including some extra steps for proper device management."
hidden: false
---

## Why add your Ubuntu endpoints to Microsoft Intune?

This question has a very simple answer: compliance, management, and security.

As IT professionals, we want to manage every endpoint from a single pane of glass while keeping compliance and security at a consistently high level. Linux endpoints are often overlooked in IT departments, especially compared to Windows and macOS devices. This makes them an interesting attack vector, because they are not always properly managed, monitored, or secured.

Some important reasons to manage Linux endpoints with Intune are:

- **Centralized device visibility:** IT teams can see which Linux devices are used within the organization and who is using them
- **Compliance monitoring:** Devices can be checked against compliance requirements, such as operating system version, encryption status, and security settings
- **Conditional Access integration:** Access to company resources can be based on device compliance. This means that only trusted and compliant devices can access sensitive data
- **Support for audits and reporting:** Having Linux devices enrolled in Intune makes it easier to prove that endpoints are known, monitored, and managed
- **Reduced shadow IT risk:** Linux devices are sometimes used by developers, administrators, or technical users without the same level of IT oversight. Intune helps bring these devices back into the managed environment

In this post, I will add an Ubuntu Desktop device to Microsoft Intune and apply some basic settings to make it a lot more secure.

---

## Supported Linux versions

The Linux versions that are supported by Microsoft Intune are these:

| Linux distribution | Supported versions |
| --- | --- |
| Ubuntu Desktop / Ubuntu LTS | 24.04 LTS and 26.04 LTS |
| Red Hat Enterprise Linux | RHEL 9 and RHEL 10 |

The official support is listed here and could be updated in the future: [https://learn.microsoft.com/en-us/intune/fundamentals/ref-supported-platforms#linux](https://learn.microsoft.com/en-us/intune/fundamentals/ref-supported-platforms#linux)

What happens if we try to join unsupported Linux OS versions? I tried this just for fun with Zorin OS (which is based on Ubuntu) but an error is presented unfortunately:

[![jv-media-8511-3c2946a69abb.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/adding-ubuntu-endpoints-to-microsoft-intune/jv-media-8511-3c2946a69abb.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/adding-ubuntu-endpoints-to-microsoft-intune/jv-media-8511-3c2946a69abb.png)

*Error: zorin is not a supported distribution. Supported: Ubuntu 22.04/24.04/26.04, RHEL/AlmaLinux 8/9/10*

So only supported OS versions and distributions can actually work with Microsoft Intune.

---

## Supported options in Microsoft Intune

While support is available for Linux/Ubuntu devices, the functionality is very limited. The only options we have are:

- Compliance Policies
- Custom scripts

With the custom scripts option, it's possible to basically do everything at root level which is nice but the end user has the permissions to block this potentially. I hope to see more features in the future like device encryption, wipe and locking down some users' permissions on Linux.

---

## Step 1: Installing Ubuntu Desktop (optional)

Assuming you might already have Ubuntu or a supported version installed already, this step will be optional. If not, you can also follow Step 1. Otherwise, skip this step.

In the first step, I will be installing my demo laptop with Ubuntu Desktop 26.04. This can be installed from here: [https://ubuntu.com/download/desktop](https://ubuntu.com/download/desktop)

[![jv-media-8512-fdc11bf30cb0.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/adding-ubuntu-endpoints-to-microsoft-intune/jv-media-8512-fdc11bf30cb0.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/adding-ubuntu-endpoints-to-microsoft-intune/jv-media-8512-fdc11bf30cb0.png)

Then we must "burn" this ISO image in a USB drive. I have used Rufus for years for this purpose and will also do it now. You can download this simple, no nonsense tool here: [https://rufus.ie/en/](https://rufus.ie/en/)

[![jv-media-8512-2e9f46c8aaf1.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/adding-ubuntu-endpoints-to-microsoft-intune/jv-media-8512-2e9f46c8aaf1.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/adding-ubuntu-endpoints-to-microsoft-intune/jv-media-8512-2e9f46c8aaf1.png)

We should have those 2 files now:

[![jv-media-8512-b50d8f81a51b.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/adding-ubuntu-endpoints-to-microsoft-intune/jv-media-8512-b50d8f81a51b.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/adding-ubuntu-endpoints-to-microsoft-intune/jv-media-8512-b50d8f81a51b.png)

Open Rufus and select the ISO image. Then hit Start and I selected the default ISO mode.

[![jv-media-8512-9a44d767a779.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/adding-ubuntu-endpoints-to-microsoft-intune/jv-media-8512-9a44d767a779.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/adding-ubuntu-endpoints-to-microsoft-intune/jv-media-8512-9a44d767a779.png)

The ISO will now be "burned" to the USB drive, resulting in a full data loss of everything on the USB drive.

After the ISO has been written to the USB drive, I have connected it to the testing device and booted it from USB. Then I have followed the default installation of Ubuntu, which is pretty straightforward.

[![jv-media-8512-08a6eeb10a72.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/adding-ubuntu-endpoints-to-microsoft-intune/jv-media-8512-08a6eeb10a72.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/adding-ubuntu-endpoints-to-microsoft-intune/jv-media-8512-08a6eeb10a72.png)

During the installation, you can proceed with Step 2, as we have to wait for a few minutes. This makes the process a bit more efficient.

{{% alert title="Warning" color="warning" %}}
During the installation, it's recommended to enable **Device Encryption** as this cannot be done through Microsoft Intune Policies.
{{% /alert %}}

---

## Step 2: Create dynamic device security group

We can prepare our Intune environment by creating a dynamic security group for Linux devices. I like dynamic security groups in Intune as assignments are done automatically and eliminating the need for us to manually add devices to groups. Policies and Compliance will also automatically apply.

Open Microsoft Intune admin center on [https://intune.microsoft.com](https://intune.microsoft.com) and open up "Groups" from the left and then click "New group".

[![jv-media-8512-815dfb116639.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/adding-ubuntu-endpoints-to-microsoft-intune/jv-media-8512-815dfb116639.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/adding-ubuntu-endpoints-to-microsoft-intune/jv-media-8512-815dfb116639.png)

Fill in the details of the group and select the Membership type "Dynamic Device".

[![jv-media-8512-3542c1a09d25.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/adding-ubuntu-endpoints-to-microsoft-intune/jv-media-8512-3542c1a09d25.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/adding-ubuntu-endpoints-to-microsoft-intune/jv-media-8512-3542c1a09d25.png)

Then click "Add dynamic query" to add filtering on what devices must be added to the group. First, select the **deviceOSType** to equal to Linux and then add another expression, called **deviceManagementAppId** to equal 0000000a-0000-0000-c000-000000000000. This means only Intune joined devices, which filters out Entra registered Linux devices. Check the screenshot below for reference.

[![jv-media-8512-3a1222686033.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/adding-ubuntu-endpoints-to-microsoft-intune/jv-media-8512-3a1222686033.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/adding-ubuntu-endpoints-to-microsoft-intune/jv-media-8512-3a1222686033.png)

You can also walk the fast path and copy the complete Rule syntax below into your Dynamic rule syntax:

{{< card code=true header="**JSON**" lang="json" >}}
(device.deviceOSType -eq "Linux") and (device.deviceManagementAppId -eq "0000000a-0000-0000-c000-000000000000")
{{< /card >}}

Save the group and go to the next step.

---

## Step 3: Join Ubuntu device to Microsoft Intune

After the installation is done of the Ubuntu device, we can now join the device to Microsoft Intune.

[![jv-media-8512-104ccd85b546.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/adding-ubuntu-endpoints-to-microsoft-intune/jv-media-8512-104ccd85b546.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/adding-ubuntu-endpoints-to-microsoft-intune/jv-media-8512-104ccd85b546.png)

This can be done by performing these 3 actions:

- Install Microsoft Edge
- Install Microsoft Intune App [with installer script](https://github.com/microsoft/shell-intune-samples/tree/master/Linux/Intune%20Installer)
- Enroll device

Let's go through these tasks in this step.

On the Ubuntu device, open up the web browser and download Microsoft Edge from this site: [https://www.microsoft.com/en-us/edge/download](https://www.microsoft.com/en-us/edge/download). Here scroll down and click the link "Download for Linux (.deb)".

[![jv-media-8512-c4aea800c3ed.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/adding-ubuntu-endpoints-to-microsoft-intune/jv-media-8512-c4aea800c3ed.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/adding-ubuntu-endpoints-to-microsoft-intune/jv-media-8512-c4aea800c3ed.png)

Then head to the "Downloads" folder on your device and right-click the just downloaded .deb file and open it with the App Center. This is a nice and easy way to install the package without the need to open the Terminal (just yet).

[![jv-media-8512-382fedfc0f01.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/adding-ubuntu-endpoints-to-microsoft-intune/jv-media-8512-382fedfc0f01.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/adding-ubuntu-endpoints-to-microsoft-intune/jv-media-8512-382fedfc0f01.png)

Click through the windows stating that it might be a potentially unsafe application and proceed.

[![jv-media-8512-8ee9390bc31b.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/adding-ubuntu-endpoints-to-microsoft-intune/jv-media-8512-8ee9390bc31b.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/adding-ubuntu-endpoints-to-microsoft-intune/jv-media-8512-8ee9390bc31b.png)

After Microsoft Edge has been installed, open this GitHub repository and download the installer.sh script. This script installs the Microsoft Intune application used to register and enroll your device.

<a class="btn btn-primary" href="https://github.com/microsoft/shell-intune-samples/tree/master/Linux/Intune%20Installer" target="_blank" rel="noreferrer">Intune Installer.sh script</a>

[![jv-media-8512-8d8052eecb8a.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/adding-ubuntu-endpoints-to-microsoft-intune/jv-media-8512-8d8052eecb8a.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/adding-ubuntu-endpoints-to-microsoft-intune/jv-media-8512-8d8052eecb8a.png)

Click on the installer.sh script and then download the file. It will be logically saved into the Downloads folder, so again open up the File Explorer and open "Downloads".

From there, right-click unused space and select "Open with Terminal" to open the Terminal app straight to this folder.

[![jv-media-8512-b232da4cf8bf.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/adding-ubuntu-endpoints-to-microsoft-intune/jv-media-8512-b232da4cf8bf.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/adding-ubuntu-endpoints-to-microsoft-intune/jv-media-8512-b232da4cf8bf.png)

Now run this command in the Terminal to make the just downloaded script ready to be executed:

{{< card code=true header="**Bash**" lang="bash" >}}
chmod +x installer.sh
{{< /card >}}

Then run this command to actually run the script:

{{< card code=true header="**Bash**" lang="bash" >}}
./installer.sh --verbose
{{< /card >}}

Then authenticate with your credentials and wait for the script to finish. This is mostly done within 45 seconds.

[![jv-media-8512-8611af085039.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/adding-ubuntu-endpoints-to-microsoft-intune/jv-media-8512-8611af085039.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/adding-ubuntu-endpoints-to-microsoft-intune/jv-media-8512-8611af085039.png)

The script gave an error but proceeded and still finished, and everything was working as intended after that, so I chose to ignore it. The Intune Application was now ready to be used:

[![jv-media-8512-387b603de4d6.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/adding-ubuntu-endpoints-to-microsoft-intune/jv-media-8512-387b603de4d6.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/adding-ubuntu-endpoints-to-microsoft-intune/jv-media-8512-387b603de4d6.png)

Open up the Microsoft Intune app, log in to your account and the rest will be pretty straightforward as shown in this animation:

[![jv-media-8512-cbb0f7549324.gif](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/adding-ubuntu-endpoints-to-microsoft-intune/jv-media-8512-cbb0f7549324.gif)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/adding-ubuntu-endpoints-to-microsoft-intune/jv-media-8512-cbb0f7549324.gif)

All screenshots were taken within 30 seconds of each other, showing the simplicity of this process.

---

## Step 4: Checking status in Microsoft Intune

After the device has been enrolled, I waited for a few minutes (at max 10 minutes), and then checked the Microsoft Intune admin center:

[![jv-media-8512-e412cf6a239a.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/adding-ubuntu-endpoints-to-microsoft-intune/jv-media-8512-e412cf6a239a.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/adding-ubuntu-endpoints-to-microsoft-intune/jv-media-8512-e412cf6a239a.png)

The device has just been added to the list. Opening the device and checking the "Group memberships" also shows that the device is successfully added to our earlier created dynamic security group.

[![jv-media-8512-0a26d2f57822.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/adding-ubuntu-endpoints-to-microsoft-intune/jv-media-8512-0a26d2f57822.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/adding-ubuntu-endpoints-to-microsoft-intune/jv-media-8512-0a26d2f57822.png)

The device options and information are somewhat limited, as we cannot wipe the device from Intune and most basic information is also not filled which is somewhat disappointing.

[![jv-media-8512-3a258e5c6e60.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/adding-ubuntu-endpoints-to-microsoft-intune/jv-media-8512-3a258e5c6e60.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/adding-ubuntu-endpoints-to-microsoft-intune/jv-media-8512-3a258e5c6e60.png)

---

## Step 5: Creating a Compliance Policy for Linux

So let's zoom in on the features that are available for Linux. Under "Linux devices", open up "Compliance" and let's create a Compliance policy:

[![jv-media-8512-ee6fd2c8ca18.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/adding-ubuntu-endpoints-to-microsoft-intune/jv-media-8512-ee6fd2c8ca18.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/adding-ubuntu-endpoints-to-microsoft-intune/jv-media-8512-ee6fd2c8ca18.png)

Don't bother to select the profile type "Templates" as they are not available (yet). Select "Settings catalog".

[![jv-media-8512-eba20cd7d370.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/adding-ubuntu-endpoints-to-microsoft-intune/jv-media-8512-eba20cd7d370.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/adding-ubuntu-endpoints-to-microsoft-intune/jv-media-8512-eba20cd7d370.png)

Give the policy a name and description and advance to the next tab.

These are the options we have, and I configured a basic set of them for the purpose of this guide:

[![jv-media-8512-342db50900f7.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/adding-ubuntu-endpoints-to-microsoft-intune/jv-media-8512-342db50900f7.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/adding-ubuntu-endpoints-to-microsoft-intune/jv-media-8512-342db50900f7.png)

Then assign the policy to the created group and finish the wizard.

[![jv-media-8512-f6e4c2c9e7a8.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/adding-ubuntu-endpoints-to-microsoft-intune/jv-media-8512-f6e4c2c9e7a8.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/adding-ubuntu-endpoints-to-microsoft-intune/jv-media-8512-f6e4c2c9e7a8.png)

Intune will now scan the Linux devices if they are compliant with the rules we have configured here, but will not remediate them. This looks like this after around 15 minutes:

[![jv-media-8511-2cedd18d5748.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/adding-ubuntu-endpoints-to-microsoft-intune/jv-media-8511-2cedd18d5748.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/adding-ubuntu-endpoints-to-microsoft-intune/jv-media-8511-2cedd18d5748.png)

This is as intended as I did not enable encryption at the installation, just for checking if this will be found by Microsoft Intune.

---

## Step 6: Deploy custom scripts

Another option we have for Linux devices is to deploy custom scripts, just like we can do with PowerShell scripts on Windows. We can do very advanced stuff with this which is nice, but requires some knowledge about Bash and Ubuntu itself.

For the purpose of this guide, I created a simple script to download and install these three applications:

- Google Chrome
- Spotify
- Visual Studio Code

Download the script below and let's create the script in Microsoft Intune.

<a class="btn btn-primary" href="https://github.com/JustinVerstijnen/JV-Linux-InstallApplications/tree/main" target="_blank" rel="noreferrer">Download script from GitHub</a>

In Microsoft Intune, go to "Linux" and from there go to "Scripts" and click "+ Add".

[![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/adding-ubuntu-endpoints-to-microsoft-intune/jv-media-8512-085929d9d343.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/adding-ubuntu-endpoints-to-microsoft-intune/jv-media-8512-085929d9d343.png)

Give the script a name and clear description and advance to the next tab.

[![jv-media-8512-57280e43fa17.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/adding-ubuntu-endpoints-to-microsoft-intune/jv-media-8512-57280e43fa17.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/adding-ubuntu-endpoints-to-microsoft-intune/jv-media-8512-57280e43fa17.png)

On the "Configuration settings" tab, unfold the Linux Custom Configuration blade and configure this:

| Option | Set this |
| --- | --- |
| Execution context | Root |
| Execution frequency | Every 1 day |
| Execution retries | 3 times |
| Execution Script | Select the downloaded script here |

This must look similar to this, where you can change your settings depending on your situation of course:

[![jv-media-8512-eee8e61ef68f.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/adding-ubuntu-endpoints-to-microsoft-intune/jv-media-8512-eee8e61ef68f.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/adding-ubuntu-endpoints-to-microsoft-intune/jv-media-8512-eee8e61ef68f.png)

Once again, assign the custom script to your dynamic devices group:

[![jv-media-8512-d8925152a4ce.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/adding-ubuntu-endpoints-to-microsoft-intune/jv-media-8512-d8925152a4ce.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/adding-ubuntu-endpoints-to-microsoft-intune/jv-media-8512-d8925152a4ce.png)

Now we have to wait for a few minutes before the script will be pushed to Microsoft Intune. In my case, it took after one reboot and saving the policy for the script to actually apply on Ubuntu where I was surprised at the speed. Faster than on Windows in some cases.

[![jv-media-8512-a81ec82a8d35.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/adding-ubuntu-endpoints-to-microsoft-intune/jv-media-8512-a81ec82a8d35.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/adding-ubuntu-endpoints-to-microsoft-intune/jv-media-8512-a81ec82a8d35.png)

The applications are successfully installed after the first reboot.

---

## Knowledge check

{{< quiz >}}
{
  "intro": "Answer these question(s) to test your understanding of this post. Your answers are not saved or sent anywhere; this is simply a personal knowledge check. If you refresh the page, your answers will be cleared.",
  "questions": [
    {
      "question": "What items are possible to push to Linux devices managed by Microsoft Intune?",
      "reference": "Supported options in Microsoft Intune",
      "referenceUrl": "#supported-options-in-microsoft-intune",
      "answers": [
        {
          "text": "Compliance Policies and Scripts",
          "correct": true,
          "message": "Correct! This is the right answer."
        },
        {
          "text": "Compliance Policies and Configuration Profiles",
          "correct": false,
          "message": "Incorrect. Review the referenced section and try again."
        },
        {
          "text": "Custom Scripts and Applications",
          "correct": false,
          "message": "Incorrect. Review the referenced section and try again."
        },
        {
          "text": "Only custom scripts",
          "correct": false,
          "message": "Incorrect. Review the referenced section and try again."
        }
      ]
    },
    {
      "question": "What Linux distribution is NOT supported by Microsoft Intune?",
      "reference": "Supported Linux versions",
      "referenceUrl": "#supported-linux-versions",
      "answers": [
        {
          "text": "Ubuntu Desktop",
          "correct": false,
          "message": "Incorrect. Review the referenced section and try again."
        },
        {
          "text": "Red Hat Enterprise Linux",
          "correct": false,
          "message": "Incorrect. Review the referenced section and try again."
        },
        {
          "text": "Fedora",
          "correct": true,
          "message": "Correct! This is the right answer."
        },
        {
          "text": "Ubuntu LTS",
          "correct": false,
          "message": "Incorrect. Review the referenced section and try again."
        }
      ]
    }
  ]
}
{{< /quiz >}}

---

## Summary

Adding Ubuntu endpoints to Microsoft Intune is a simple but valuable step toward bringing Linux devices into the same endpoint management strategy as Windows, macOS, iOS, and Android devices. If we want to keep a high level of compliance and security, this is a must for your organization.

Hopefully, Microsoft will continue to expand Linux support in Intune with more configuration, encryption, and remote management options. But even with the current feature set, enrolling Ubuntu devices is a good first step toward a more complete and secure endpoint management approach. With the custom scripts option, we can have basically any option available with some deep knowledge.

I hope this post was helpful and thank you for reading!

### Sources

1. [https://learn.microsoft.com/en-us/intune/fundamentals/ref-supported-platforms#linux](https://learn.microsoft.com/en-us/intune/fundamentals/ref-supported-platforms#linux)
2. [https://rufus.ie/en/](https://rufus.ie/en/)
3. [https://learn.microsoft.com/en-us/intune/device-enrollment/guide-linux](https://learn.microsoft.com/en-us/intune/device-enrollment/guide-linux)

{{< ads >}}

{{< article-footer >}}