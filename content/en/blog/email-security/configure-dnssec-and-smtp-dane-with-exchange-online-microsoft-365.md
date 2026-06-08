---
title: "Configure DNSSEC and SMTP DANE Microsoft 365"
date: 2024-10-31
slug: "configure-dnssec-and-smtp-dane-with-exchange-online-microsoft-365"
categories:
  - Email security
  - Microsoft 365
tags:
  - Concepts
  - Step by Step guides
description: >
  Recently, Microsoft announced the general availability of 2 new security protocol when using Microsoft 365 and the service Exchange Online in particular. SMTP DANE and DNSSEC. What are these protocols, what is the added value and how can they help you secure your organization? Lets find out.
---

## Domain Name System Security Extensions (DNSSEC)

DNSSEC is a feature where a client can validate the DNS records received by a DNS server to ensure a record is originated from the DNS server and not manipulated by a Man in the Middle attack.

DNSSEC is developed to prevent attacks like in the topology below:

[![jv-media-499-1494f13639ce.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/configure-dnssec-and-smtp-dane-with-exchange-online-microsoft-365-499/jv-media-499-1494f13639ce.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/configure-dnssec-and-smtp-dane-with-exchange-online-microsoft-365-499/jv-media-499-1494f13639ce.png)

Here a attacker injects a fake DNS record and sends the user to a different IP-address, not the actual IP-address of the real website but a fake, mostly spoofed website. This way, a user sees for example https://portal.azure.com in his address bar but is actually on a malicious webserver. This makes the user far more vulnerable to credential harvesting or phising attacks.

With DNSSEC, the client receives the malicious and fake DNS entry, validates it at the authorative DNS server for the domain and sees its fake. The user will be presented a error message and we have prevented just another breach.

## SMTP DNS Authentication of Named Entities (DANE)

SMTP DANE is an addition to DNSSEC which actually brings the extra security measures to sending email messages. It helps by performing 3 steps:

1. When sending an email message, SMTP DANE requires a TLS connection and certificate and doesn't send email when this is not possible
2. SMTP DANE validates the emailserver to ensure an email message originates from the server of the given domain
3. SMTP DANE doesn't use external Certificate Authorities but uses the systems available to generate certificates which the receiver can validate.

## SMTP DANE and DKIM (DomainKeys Identified Mail)

SMTP DANE and DKIM sounded the same security to me when i first read about it. However, both are needed to secure your outbound email traffic, but they help in another way:

- DKIM helps by generating a signature at sending the email which a receiver can validate through a public DNS record
  - The receiver knows that the message is not modified by an attacker
- SMTP DANE helps securing the transport of the email, and ensures the connection itself is secure. See this like a HTTPS connection
  - The receiver knows that the message and connection is not re-routed by an man in the middle.

---

## Requirements

- A Microsoft 365 tenant
- A DNSSEC capable DNS-hosting or server
  - Check here: <https://tools.justinverstijnen.nl/dnsmegatool/>
  - Does your DNS hosting not support DNSSEC? Check out this guide: <https://justinverstijnen.nl/what-is-mta-sts-and-how-to-protect-your-email-flow/>
- Exchange Online PowerShell module
- Some basic knowledge about SPF/DKIM/DMARC
  - Check out this page for a basic understanding: <https://justinverstijnen.nl/configure-dnssec-and-smtp-dane-with-exchange-online-microsoft-365/>
- 30 minutes of your time

---

## Step 1: Check your DNSSEC configuration

When starting out, your DNS hosting must support and enabled DNSSEC on your domain. Without this, those protocols don't work. You can check out your domain and DNSSEC status with my DNS MEGAtool:

<https://tools.justinverstijnen.nl/dnsmegatool/>

My domain is DNSSEC capable and a DS record is published from the registrar to the DNS hosting and is ready to go to the next phase:

[![jv-media-499-b3f0ac5317c4.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/configure-dnssec-and-smtp-dane-with-exchange-online-microsoft-365-499/jv-media-499-b3f0ac5317c4.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/configure-dnssec-and-smtp-dane-with-exchange-online-microsoft-365-499/jv-media-499-b3f0ac5317c4.png)

You can find this on the last row of the table in the DNS MEGAtool. If the status is red or an error is in the value field, the configuration of your domain is not correct.

---

## Step 2: Login into Microsoft Exchange Online Powershell

The only way to enable those features at this moment are to configure those on Exchange Online Powershell. The good part is, it is not that hard. Let me show you.

First, login into Exchange Online Powershell:

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
Connect-ExchangeOnline
{{< /card >}}


Login with your credentials, and we are ready.

---

## Step 3: Enable DNSSEC

We have to enable DNSSEC to each of our domains managed in Microsoft 365. In my environment, i have only one domain. Run the following command to enable DNSSEC:

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
Enable-DnssecForVerifiedDomain -DomainName "justinverstijnen.nl"
{{< /card >}}

[![jv-media-499-2c556bcd39f4.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/configure-dnssec-and-smtp-dane-with-exchange-online-microsoft-365-499/jv-media-499-2c556bcd39f4.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/configure-dnssec-and-smtp-dane-with-exchange-online-microsoft-365-499/jv-media-499-2c556bcd39f4.png)

The output of the command gives us a new, DNSSEC enabled MX-record.

---

## Step 4: Configure DNSSEC enabled MX record

Now PowerShell gives us a new MX record which we must configure. This is the new "DANE"-enabled MX-record

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
DnssecMxValue                         Result  ErrorData
-------------                         ------  ---------
justinverstijnen-nl.r-v1.mx.microsoft Success
{{< /card >}}

Let's change this in the DNS hosting of your domain and it has to be the new primary MX-record (the one with the highest priority -> lowest number). I added it to the list of DNS records with a priority of 5, and switched the records outside of business hours to minimize service disruption.

Here an example of my configuration before switching to the new DNSSEC enabled MX record as primary.

[![jv-media-499-8351f98c1ca0.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/configure-dnssec-and-smtp-dane-with-exchange-online-microsoft-365-499/jv-media-499-8351f98c1ca0.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/configure-dnssec-and-smtp-dane-with-exchange-online-microsoft-365-499/jv-media-499-8351f98c1ca0.png)

When you change your MX record it can take up to 72 hours before the whole world knows your new MX record.

---

## Step 5: Test new DNSSEC MX record

We can test our new MX record and the working of our change with the following tool: <https://testconnectivity.microsoft.com/tests/O365InboundSmtp/input>

Fill in your emailaddress and log into the service:

[![jv-media-499-5c2e85ebc77f.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/configure-dnssec-and-smtp-dane-with-exchange-online-microsoft-365-499/jv-media-499-5c2e85ebc77f.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/configure-dnssec-and-smtp-dane-with-exchange-online-microsoft-365-499/jv-media-499-5c2e85ebc77f.png)

After that you get an test report:

[![jv-media-499-4cfdcfe48393.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/configure-dnssec-and-smtp-dane-with-exchange-online-microsoft-365-499/jv-media-499-4cfdcfe48393.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/configure-dnssec-and-smtp-dane-with-exchange-online-microsoft-365-499/jv-media-499-4cfdcfe48393.png)

I did this test before flipping the MX records. You can test this anytime.

After the MX records are fine, we can test our DNSSEC. The DNSSEC enabled MX record has to be primary at this point.

[![jv-media-499-90943131a4aa.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/configure-dnssec-and-smtp-dane-with-exchange-online-microsoft-365-499/jv-media-499-90943131a4aa.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/configure-dnssec-and-smtp-dane-with-exchange-online-microsoft-365-499/jv-media-499-90943131a4aa.png)

After the test is completed you get the results and possible warnings and errors:

[![jv-media-499-7e97f59d39f9.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/configure-dnssec-and-smtp-dane-with-exchange-online-microsoft-365-499/jv-media-499-7e97f59d39f9.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/configure-dnssec-and-smtp-dane-with-exchange-online-microsoft-365-499/jv-media-499-7e97f59d39f9.png)

---

## Step 6: Enable SMTP DANE

After we configured DNSSEC, we can enable SMTP DANE in the same Exchange Online Powershell window by using the following command:

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
Enable-SmtpDaneInbound -DomainName "justinverstijnen.nl"
{{< /card >}}

[![jv-media-499-8598a10ef5c0.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/configure-dnssec-and-smtp-dane-with-exchange-online-microsoft-365-499/jv-media-499-8598a10ef5c0.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/configure-dnssec-and-smtp-dane-with-exchange-online-microsoft-365-499/jv-media-499-8598a10ef5c0.png)

This is only a command to enable SMTP DANE for inbound email, here is no additional DNS change needed.

---

## Step 7: Test inbound SMTP DANE

After enabling the SMTP DANE option, you will have to wait some time to fully enable and make it work on the internet. It can take up to an hour, but in my case it took around 10 minutes.

You can test the outcome by using this tool: <https://testconnectivity.microsoft.com/tests/O365DaneValidation/input>

Fill in your domain, and select the "DANE-validation" including DNSSEC to test both of your implemented mechanisms:

[![jv-media-499-1674b02f9a11.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/configure-dnssec-and-smtp-dane-with-exchange-online-microsoft-365-499/jv-media-499-1674b02f9a11.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/configure-dnssec-and-smtp-dane-with-exchange-online-microsoft-365-499/jv-media-499-1674b02f9a11.png)

---

## Knowledge check

{{< quiz >}}
{
  "intro": "Answer these questions to test your understanding of this post. Your answers are not saved or sent anywhere; this is simply a personal knowledge check. If you refresh the page, your answers will be cleared.",
  "questions": [
    {
      "question": "What does the SMTP DANE protocol do?",
      "reference": "See the section: SMTP DNS Authentication of Named Entities (DANE)",
      "referenceUrl": "#smtp-dns-authentication-of-named-entities-dane",
      "answers": [
        {
          "text": "Leveraging DNSSEC protocol and requiring TLS connections for outbound messages",
          "correct": true,
          "message": "Great job! This is the right answer."
        },
        {
          "text": "Adding a signature to your sent email messages",
          "correct": false,
          "message": "Incorrect. SMTP DANE uses DNSSEC and TLS connections for outbound email messages."
        },
        {
          "text": "Blocks incoming spam from unverified senders",
          "correct": false,
          "message": "Incorrect. SMTP DANE uses DNSSEC and TLS connections for outbound email messages."
        },
        {
          "text": "Leveraging DNSSEC protocol and requiring TLS connections for inbound messages",
          "correct": false,
          "message": "Incorrect. SMTP DANE uses DNSSEC and TLS connections for OUTbound email messages."
        }
      ]
    },
    {
      "question": "What does the DNSSEC protocol do?",
      "reference": "See the section: Domain Name System Security Extensions (DNSSEC)",
      "referenceUrl": "#domain-name-system-security-extensions-dnssec",
      "answers": [
        {
          "text": "Checking for malware manipulating your computers' DNS cache",
          "correct": false,
          "message": "Incorrect. DNSSEC helps securing/validating your domains' DNS records and origin."
        },
        {
          "text": "Validating the origin of the DNS records and ensures records are not manipulated",
          "correct": true,
          "message": "Correct! This is the right answer."
        },
        {
          "text": "Securing your domains' DNS servers",
          "correct": false,
          "message": "Incorrect. DNSSEC helps securing/validating your domains' DNS records and origin."
        }
      ]
    },
    {
      "question": "What must be done first before configuring SMTP DANE for Microsoft 365?",
      "reference": "See the section: Step 1: Check your DNSSEC configuration",
      "referenceUrl": "#step-1-check-your-dnssec-configuration",
      "answers": [
        {
          "text": "Configure DNSSEC on your domain",
          "correct": true,
          "message": "Correct! This is the right answer."
        },
        {
          "text": "Enabling DNSSEC in the Microsoft Exchange admin center",
          "correct": false,
          "message": "Incorrect. There is no DNSSEC-like option in the Exchange admin center."
        },
        {
          "text": "Connect to Exchange Online using PowerShell",
          "correct": false,
          "message": "Incorrect. We must first configure something on our domain/DNS hosting."
        }
      ]
    }
  ]
}
{{< /quiz >}}

---

## Summary

After this guide you are using DNSSEC and SMTP DANE on your Exchange Online environment. This improves your security posture at that point. My advice is to enable this options when possible. When DNSSEC is not an option, I highly recommend to configure this: <https://justinverstijnen.nl/what-is-mta-sts-and-how-to-protect-your-email-flow/>

Thank you for reading this post and I hope I helped you out securing your email flow and data in transfer.

{{< ads >}}

{{< article-footer >}}
