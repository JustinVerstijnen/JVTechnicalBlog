---
title: "Deploy Google Chrome Single Sign On with Intune"
date: 2025-12-11
slug: "deploy-google-chrome-single-sign-on-with-intune"
categories:
  - Intune
tags:
  - Step by Step guides
description: >
  When deploying Google Chrome with Microsoft Intune, users still have to manually login with their credentials into Microsoft Online websites.
---
When deploying Google Chrome with Microsoft Intune, users still have to manually login with their credentials into Microsoft Online websites. Microsoft Edge has built-in Single Sign On (SSO) for users who already logged in with their Microsoft account to their computer.

However, there is a Chrome extension published by Microsoft themselves which allows users to also have this Single Sign On experience into Google Chrome.

On this page I will show how this extension works, what the advantages are and how we can deploy this with Microsoft Intune. I will share both a Configuration Policy and a PowerShell script option where you may choose which one to use.

---

## How the extension works

The Microsoft SSO extension for Google Chrome uses the same token/session you already have when you have your device Entra ID joined. It will send that to every Microsoft Online webpage to show you are already authenticated and have a valid token. This makes the user experience a lot better as they don't have to authenticate first before starting to use the web applications.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/deploy-google-chrome-single-sign-on-with-intune-5787/jv-media-5787-dfb8bd0274e3.png)

The extension can be manually downloaded from here: <https://chromewebstore.google.com/detail/microsoft-single-sign-on/ppnbnpeolgkicgegkbkbjmhlideopiji?pli=1>

---

## The fast pass

I have both the Configuration Profile and PowerShell script for you to download and implement easily on my Github page. You can download them there:

[Download Configuration Profile and Script](https://github.com/JustinVerstijnen/JV-CP-MicrosoftSSOGoogleChrome)

---

## How to deploy the extension with Intune Configuration Policies

To deploy the extension with Intune, login to the Microsoft Intune Admin Center: <https://intune.microsoft.com>

From there, navigate to Devices -> Windows -> Configuration and create a new policy.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/deploy-google-chrome-single-sign-on-with-intune-5787/jv-media-5787-e9e7afb2921f.png)

Select Windows 10 and later for "Platform" and use the "Settings catalog" profile type. Then click on "Create".

Now define a name and description for this new policy, defining what this actually does.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/deploy-google-chrome-single-sign-on-with-intune-5787/jv-media-5787-b5ef254bab01.png)

Then click on "Next".

Now click on "+ Add settings", search for Google. Click it open to go down to "Google Chrome" and then "Extensions".

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/deploy-google-chrome-single-sign-on-with-intune-5787/jv-media-5787-5085cfade852.png)

Select the option "Configure the list of force-installed apps and extensions".

{{% alert color="info" %}}
The same option exists with (User) attached, using that option means a user is able to delete the extension.
{{% /alert %}}

Now we can configure that option by setting the switch to "Enabled".

We have to paste the Extension IDs here. You can find this in the Chrome Web Store in the URL (the part after the last /):

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/deploy-google-chrome-single-sign-on-with-intune-5787/jv-media-5787-7c60c6bee8e6.png)

So we paste this value in the field, but you can add any extension, like ad blockers, password managers or others.

{{< card code=true header="**YAML**" lang="yaml" >}}
ppnbnpeolgkicgegkbkbjmhlideopiji
{{< /card >}}
![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/deploy-google-chrome-single-sign-on-with-intune-5787/jv-media-5787-63cb74237658.png)

Click on "Next" twice. We can now assign this new policy to our devices. I picked the All Devices option here as I want this extension to be installed on all Windows devices.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/deploy-google-chrome-single-sign-on-with-intune-5787/jv-media-5787-63fde4899fd3.png)

Create the policy by finishing the wizard. [Let's check the results here](#results).

---

## How to deploy the extension with Intune Platform Scripts

We can also deploy the extension through a PowerShell script. This is recommended if using other MDM solutions than Microsoft Intune. However, we can also deploy it in Intune as script by going to the Microsoft Intune Admin Center: <https://intune.microsoft.com>

From there, go to Devices -> Windows ->Scripts and remediations and then the tab "Platform scripts". These are scripts that are automatically run once.

Create a new script for Windows 10 and later here.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/deploy-google-chrome-single-sign-on-with-intune-5787/jv-media-5787-8811679b67ba.png)

Give it a name and description of the script:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/deploy-google-chrome-single-sign-on-with-intune-5787/jv-media-5787-3f17ea79413d.png)

Click "Next" to open the script settings. To download my script, go to <https://github.com/JustinVerstijnen/JV-CP-MicrosoftSSOGoogleChrome> and download the .ps1 file.

Here import the script you just downloaded from my Github page.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/deploy-google-chrome-single-sign-on-with-intune-5787/jv-media-5787-8a6b6806a3df.png)

Then set the script options as this:

1. Run this script using the logged on credentials: No
2. Enforce script signature check: No
3. Run script in 64 bit PowerShell Host: Yes

{{% alert color="info" %}}
The script targets the whole machine by creating a registry key in the HKEY\_LOCAL\_MACHINE hive.
{{% /alert %}}

Then click "Next" and assign it to your devices. In my case, I selected "All devices".

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/deploy-google-chrome-single-sign-on-with-intune-5787/jv-media-5787-3bd8486ec056.png)

Click "Next" and then "Create" to deploy the script that will install the extension.

---

## The results on the client machine

After assigning the configuration profile or PowerShell script to the machine, this will automatically be installed silently. After the processing is done, the extension will be available on the client machine:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/deploy-google-chrome-single-sign-on-with-intune-5787/jv-media-5787-db1fa76cc3cf.png)

This doesn't have to do much. We don't need to configure it either, its only a pass of the token to certain Microsoft websites.

When going to the extensions, you see that it also cannot be deleted by the user:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/deploy-google-chrome-single-sign-on-with-intune-5787/jv-media-5787-6ab06403e3e8.png)

---

## Summary

The Google Chrome Microsoft SSO extension is a great way to enhance the user experience for end users. They now can login to Microsoft websites using their already received token and don't need to get a new one by having to login again and doing MFA. We want to keep our systems secure, but too many authentication requests is annoying for the user.

Also the guide can be used to deploy other extensions for Google Chrome and Edge.

Thank you for reading this guide and I hope it was helpful.

### Sources

These sources helped me by writing and research for this post;

1. <https://support.google.com/chrome/a/answer/12129062?hl=en>

{{< ads >}}

{{< article-footer >}}
