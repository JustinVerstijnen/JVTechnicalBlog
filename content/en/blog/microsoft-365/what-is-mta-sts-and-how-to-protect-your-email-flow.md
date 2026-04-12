---
title: "What is MTA-STS and how to use it to protect your email flow"
date: 2026-01-08
slug: "what-is-mta-sts-and-how-to-protect-your-email-flow"
categories:
  - Microsoft 365
tags:
  - Concepts
  - Step by Step guides
description: >
  MTA-STS is a standard for ensuring TLS is always used for email transmission. This increases security and data protection because...
---
MTA-STS is a standard for ensuring TLS is always used for email transmission. This increases security and data protection because emails cannot be read by a Man in the Middle. It works like this for inbound and outbound email to ensure security is applied to all of the messages processed by your emailing solution and domains.

In this guide I will explain how it works. Because it is a domain specific configuration, it can work with any service and is not bound to for example Exchange Online. In this guide we use Azure to host our MTA-STS policy. I present you 2 different options for you to choose, and of course only one is needed. You can also choose to use another solution, its it supports HTTPS and hosting a single TXT file, it should work.

---

## Requirements

- Around 30 minutes of your time
- Access to your domains' DNS hosting to create DNS records
- An Azure Subscription if you want to publish your policy with a Static Web App
  - A Github account if you use this option
- An Azure Subscription if you want to publish your policy with a Function App
- Basic knowledge of DNS records
- Basic knowledge of Email security

---

## MTA-STS versus SMTP DANE

MTA-STS overlaps with the [newer SMTP DANE](https://justinverstijnen.nl/configure-dnssec-and-smtp-dane-with-exchange-online-microsoft-365/) option, and they both help securing your email flow but each in its own manner. Some differences:

|  |  |  |
| --- | --- | --- |
|  | **MTA-STS** | **SMTP DANE** |
| *Requires DNSSEC at DNS hosting* | No | Yes |
| *Requires hosting a TXT file* | Yes | No |
| *Secures inbound and outbound* | Yes | Yes |
| *Fallback option if DANE is not supported* | Yes | No |

The conclusion is;

- If you want to secure your email flow at all times: Configure both
- If you want to secure your email flow but your DNS hosting doesnt support DNSSEC: Configure MTA-STS
- If you want to secure your email flow without too much configuration and dependencies: Configure SMTP DANE

My advice is to configure both when possible, because not every email service does support SMTP DANE and MTA-STS is much more broadly supported. This will be used then as fallback. If the sender does not support MTA-STS, email will not be delivered and the sender gets an error message.

---

## Deep dive into how MTA-STS works

MTA-STS (Mail Transfer Agent Strict Transport Security) is a standard that improves email security by always using SMTP TLS encryption and validating certificates during email transmission. It's designed to prevent man-in-the-middle (MitM) attacks, ensuring email servers cannot be tricked into falling back to insecure delivery. This increases security and protects your data.

{{% alert color="info" %}}
MTA-STS works very similar to how HSTS works for webservers.
{{% /alert %}}

MTA-STS consists of the following components:

1. **Policy publication**: A domain publishes its MTA-STS policy by using a DNS record and a TXT file which is publicly accessable to publish its policy
2. **Policy fetching**: A mailserver that sends to our protected domain checks our DNS record and then our policy from the published TXT file
3. **Policy enforcement**: A mailserver that sends to our protected domain ensures that it matches our policy.
   - If it doesn't match, we can reject the mail based on the policy settings

---

## Steps to configure MTA-STS

Like described in the previous section, we must configure 2 things for MTA-STS to work:

- A DNS record
- A policy/TXT file

For the policy we can use Azure Static Web Apps or Azure Functions to publish the policy, but you can use any webhosting/HTTP service of choice. The steps will be different of course.

### Configure the DNS record

We log into our DNS hosting environment and we have to create a TXT record there. This must look like this:

{{< card code=true header="**JSON**" lang="json" >}}
_mta-sts.yourdomain.com. 3600 IN TXT v=STSv1; id=20250101000000Z;
{{< /card >}}

The first part must contain your domain instead of *yourdomain.com* and the last part after the ID contains the timestamp of the record being published.

{{% alert color="info" %}}
Tip: you can use my (Microsoft 365) DNS Record Generator tool for customizing your MTA-STS record: <https://tools.justinverstijnen.nl/365recordsgenerator>
{{% /alert %}}

I have logged in into the DNS hosting and added my TXT record there. My record looks like this:

{{< card code=true header="**JSON**" lang="json" >}}
_mta-sts.justinverstijnen.nl. 3600 IN TXT v=STSv1; id=20250511000000Z;
{{< /card >}}

After filling the form, it looks like this:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/what-is-mta-sts-and-how-to-protect-your-email-flow-2198/jv-media-2198-05d5e3e71051.png)

The domain is automatically added by the DNS protocol and from v=STSv1 to the 0's and the Z; is the value part.

### Configure the Policy

Now we must configure the policy for MTA-STS. We start by creating the TXT file and defining our policy. The TXT file must contain the information below:

{{< card code=true header="**JSON**" lang="json" >}}
version: STSv1
mode: enforce
mx: justinverstijnen-nl.r-v1.mx.microsoft
max_age: 1209600
{{< /card >}}

- The version must be v1 and exactly the same.
- The mode can be **enforce**, **testing** and **none**. Use enforce to get the most out of the configuration.
- **MX record**: this is the MX record for your domain. You can copy and paste this from your DNS hosting panel. Make sure you dont copy the "priority" part.
  - You can find your MX record in Microsoft 365 or look it up with: <https://tools.justinverstijnen.nl/dnsmegatool>
- Max\_age: This is the time in seconds a sender may cache your MTA-STS in their policy. Best practice is to use between 7 and 30 days. I use 14 days here (3600 seconds x 24 hours x 14 days)

Save this information to a TXT file named "mta-sts.txt" and now we must publish this on a webserver, so when a visitor goes to https://mta-sts.yourdomain.com/.well-known/mta-sts.txt, they will see this TXT file.

---

## Hosting option 1: Azure Static Web Apps

My first option is the most simple way to host your TXT file for your MTA-STS policy. We will do this with Azure Static Web Apps in coorperation with GitHub. This sounds complex but is very easy.

### Creating the repository on Github

Before we dive into Azure, we will start by creating a reposiroty on Github. This is a space where all files of your application resides. In this case, this will only be the TXT file.

Create an account on Github or login to proceed.

Create a new repository:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/what-is-mta-sts-and-how-to-protect-your-email-flow-2198/jv-media-2198-9553dc6e01c0.png)

Give it a name and description and decide if you want the repository to be public. Note that the TXT will be public in any case.

Create the repository.

### Prepare the repository

I have my repository public, and you can check out that to have an example of the correct configuration. We must download the index.html file from here: <https://github.com/JustinVerstijnen/MTA-STS>

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/what-is-mta-sts-and-how-to-protect-your-email-flow-2198/jv-media-2198-07d1f2c07212.png)

Click on the index.html file and download this. You can also copy the content and create the file with this content in your own repository.

Now go back to your own, newly created repository on Github.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/what-is-mta-sts-and-how-to-protect-your-email-flow-2198/jv-media-2198-97dcff978151.png)

Click on the "Add file" button and then on "Create a new file".

Now we must create the folder and the TXT file. First type in: ".well-known", then press "/" and then enter "mta-sts.txt". This creates the folder and then the file.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/what-is-mta-sts-and-how-to-protect-your-email-flow-2198/jv-media-2198-21fa67a7b02a.png)

Now we can paste in the information of our defined policy:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/what-is-mta-sts-and-how-to-protect-your-email-flow-2198/jv-media-2198-78027d8fbbc7.png)

Now commit the changes, which is basically saving the file.

### Upload simple redirect page

Now because a Static Web App requires you to have a Index.html at all time (because it is a website), we need to upload the prepared Index.html from my repository you downloaded earlier.

Click on "Add file" and then on "Upload files". Then click on "Select your files" and select the downloaded Index.html file.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/what-is-mta-sts-and-how-to-protect-your-email-flow-2198/jv-media-2198-a39fbc6700ae.png)

Commit the change. After committing the change, click on the Index.html file. We must make some changes to this file to change it to your own website:

Change the URLs on line 5 and 7 to your own domain. the mta-sts part on the beginning must stay intact and the part from .well-known too.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/what-is-mta-sts-and-how-to-protect-your-email-flow-2198/jv-media-2198-1809477fc3ed.png)

As you can see, its a simple HTML file that redirects every visitor directly to the correct file in the .well-known folder. This is purely for Azure which always must have a *index.html* but it makes your life a bit easier too.

Proceed to the next steps in Azure.

### Create the Azure Static Web App

Now we must create the Azure Static Web App in Azure to host this file. Search for "Static Web Apps" in the Azure Portal and create a new app:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/what-is-mta-sts-and-how-to-protect-your-email-flow-2198/jv-media-2198-d51e3d43ea77.png)

Place it in the desired resource group, give it a name (cannot be changed) and select a plan. You can use a free plan for this. The only limit is the custom domains you can link, which is 2 custom domain names per app.

Then scroll down on the page till you see the Deployment type:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/what-is-mta-sts-and-how-to-protect-your-email-flow-2198/jv-media-2198-fad07abb0af6.png)

Link your Github account to Azure so Azure can get the information from your repository and put it in the Static Web App. Select your Repository after linking and complete the wizard. There is no need to change anything else in this wizard to make it work.

After completing the wizard, the app will be created and then your repository files will be placed onto the Static Web App Host. This process completes in about 3 minutes.

After around 3 minutes, your website is uploaded into Azure and it will show:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/what-is-mta-sts-and-how-to-protect-your-email-flow-2198/jv-media-2198-cf0e9b99961b.png)

If you now click on "visit your site", it will redirect you to the file. However, we didn't link our custom domain yet, so it will not show our policy yet. The redirection will work fine.

### Linking our custom domain to Azure Static Web App

Now we can link our custom domain to our created Azure Static Web App in the Azure portal. Go to "Custom domains" in the settings of the Static Web App and click on "+ Add".

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/what-is-mta-sts-and-how-to-protect-your-email-flow-2198/jv-media-2198-dc64268e5bbd.png)

Select the option "Custom domain on other DNS", the middle option.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/what-is-mta-sts-and-how-to-protect-your-email-flow-2198/jv-media-2198-bba293144ef1.png)

Now fill in mta-sts.yourdomain.com, for my environment this will be:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/what-is-mta-sts-and-how-to-protect-your-email-flow-2198/jv-media-2198-abada43feef5.png)

Click on "Next". Now we have to validate that we are the owner of the domain. I recommend the default CNAME option, as this is a validation and alias/redirection in one record.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/what-is-mta-sts-and-how-to-protect-your-email-flow-2198/jv-media-2198-e08758cffa40.png)

Copy the Value of the CNAME record which is the project-name of the Static Web App and we now have to create a DNS record for our domain.

Go to your DNS hosting service and login. Then go to your DNS records overview.

Create a new CNAME record with the name "mta-sts" and paste the value you copied from the Azure Portal. Add a dot "." to the value of the record because it is a external domain. In my case, the value is:

{{< card code=true header="**V**" lang="v" >}}
orange-coast-05c818d03.6.azurestaticapps.net.
{{< /card >}}

Save the DNS record and go back to Azure, and click "Add" to validate the record. This process will be done automatically and ready after 5 minutes most of the time.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/what-is-mta-sts-and-how-to-protect-your-email-flow-2198/jv-media-2198-5930d37c8754.png)

Now we can test our site in the Azure Portal by again using the "Visit your site" button:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/what-is-mta-sts-and-how-to-protect-your-email-flow-2198/jv-media-2198-18de7db5b1be.png)

Now the website will show your MTA-STS policy:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/what-is-mta-sts-and-how-to-protect-your-email-flow-2198/jv-media-2198-43811f05bf13.png)

We are now succesfully hosting our MTA-STS policy on a Azure Static Web App instance. We also using a mandatory index.html to redirect to the correct sub-location. If your repository doesn't have a index.html file in the root, the upload to Azure action will fail.

You can skip option 2 and proceed to "[Testing the MTA-STS configuration](#testing)"

---

## Hosting option 2: Azure Functions

My second option is to host the TXT file with an Azure Function. This is a bit more complicated than option 1, but I will guide you through.

### Creating the Azure Function

In this guide I will use an Azure Function to publish the MTA-STS policy to the internet.

Let's go to the Azure Portal and create a new Function App:

Here you can select:

- Operating system: Windows
- Runtime stack: .NET
- Version: 8 in-process model (this enables editing in the portal for easy access)
- Region: Of your choice

Create the app by finishing the wizard.

After creating the app, we must do a change to the host.json file in the Azure Function. Paste the code below on the first part of the json file:

{{< card code=true header="**JSON**" lang="json" >}}
{
  "version": "2.0",
  "extensions": {
  "http": {
    "routePrefix": ""
  }
},
{{< /card >}}

It should look like this:

Save the file, and now it is prepared to host a MTA-STS policy for us.

---

### Publishing the MTA-STS policy

Create a new Function in the function app:

Select the HTTP trigger, give it a name and select the "Anonymous" authorization level.

Now we can paste some code into the function. We have to wrap this into a .NET website:

{{< card code=true header="**CSHARP**" lang="csharp" >}}
#r "Newtonsoft.Json"

using System.Net;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Primitives;
using Newtonsoft.Json;

public static async Task&lt;IActionResult> Run(HttpRequest req, ILogger log)
{
    log.LogInformation("C# HTTP trigger function processed a request.");

    string responseMessage = "version: STSv1\nmode: enforce\nmx: justinverstijnen-nl.r-v1.mx.microsoft.\nmax_age: 1209600";

    return new OkObjectResult(responseMessage);
}

{{< /card >}}

On line 12 there is the policy where you need to paste your settings in. Paste the final code into the Azure Portal and save/publish the function.

Now go to the "Integration" tab:

Click in the "Trigger" section on "HTTP(req)".

Here we can define how the HTTP trigger is and the file/path of the MTA-STS policy:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/what-is-mta-sts-and-how-to-protect-your-email-flow-2198/jv-media-2198-eb45d8a80fa4.png)

Change the values as below:

- req (Dont change this)
- Route template: .well-known/mta-sts.txt
- Authorization level: Anonymous
- Selected HTTP methods: GET

We are have bound the URL WEBSITE/.well-known/mta-sts.txt to our function and that kicks off our code which contains the policy. Very creative solution for this use case.

We can now test if this works by forming the URL with the function app and the added route:

- <https://jv-mta-sts.azurewebsites.net/.well-known/mta-sts.txt>

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/what-is-mta-sts-and-how-to-protect-your-email-flow-2198/jv-media-2198-4c9178b13e2c.png)

It works not by going to the Function App URL but we now need to add our custom domain.

---

### Redirect your custom domain to Function App

Now we need to link our domain to the function app. Go to "Custom domains" and add your custom domain:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/what-is-mta-sts-and-how-to-protect-your-email-flow-2198/jv-media-2198-c08341234aca.png)

Choose "All other domain services" at the Domain provider part.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/what-is-mta-sts-and-how-to-protect-your-email-flow-2198/jv-media-2198-6a7c793357e3.png)

Fill in your custom domain, this must start with mta-sts because of the hard URL requirement for MTA-STS to work.

We now get 2 validation records, these must be created at your DNS hosting provider.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/what-is-mta-sts-and-how-to-protect-your-email-flow-2198/jv-media-2198-c7b7f8480a05.png)

Here I created them:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/what-is-mta-sts-and-how-to-protect-your-email-flow-2198/jv-media-2198-c8b316be3d1e.png)

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/what-is-mta-sts-and-how-to-protect-your-email-flow-2198/jv-media-2198-39b6a0ca3b78.png)

Now hit "Validate" and let Azure check the records. This can take up to 1 hour before Azure knows your records due to DNS propagation processes. In my case, this worked after 3 minutes.

Now we can check if the full URL works like expected: <https://mta-sts.justinverstijnen.nl/.well-known/mta-sts.txt>

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/what-is-mta-sts-and-how-to-protect-your-email-flow-2198/jv-media-2198-a9faf38fe8cd.png)

As you can see, our policy is succesfully published.

---

## Testing the MTA-STS configuration

From here, you can test with all sorts of hosting the policy, like the 2 options I described and your custom hosting.

You can test your current MTA-STS configuration with my DNS MEGAtool:

- <https://tools.justinverstijnen.nl/dnsmegatool>

This tests our configuration of MTA-STS and tells us exactly what is wrong in case of an error:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/what-is-mta-sts-and-how-to-protect-your-email-flow-2198/jv-media-2198-866f746cfcb5.png)

The tool checks MTA-STS for both the TXT record value and the website. In my case, everything is green so good to go and this means you did the configuration correctly.

After configuring everything, it can take up to 60 minutes before everything shows green, please have a little patience.

---

## Summary

MTA-STS is a great way to enhance our email security and protect them from being stolen or read in transit. It also offers a great way of protection when DNSSEC/SMTP DANE is no option in your domain.

Thank you for reading this guide and I hope it was helpful.

{{< ads >}}

{{< article-footer >}}
