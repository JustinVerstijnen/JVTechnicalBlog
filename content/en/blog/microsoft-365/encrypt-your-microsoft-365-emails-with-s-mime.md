---
title: "Encrypt your Microsoft 365 emails with S/MIME"
date: 2026-04-05
slug: "encrypt-your-microsoft-365-emails-with-s-mime"
categories:
  - Microsoft 365
draft: true
---
A great way to encrypt your Microsoft 365 outbound emails using a similar technique as SSL is to use S/MIME. In this guide I will show you how to get certificates and configure S/MIME for your users.

---

---

## Requirements

- Around 30 minutes of your time
- [Exchange Online Powershell module](https://www.powershellgallery.com/packages/ExchangeOnlineManagement/3.9.0) installed
- S/MIME certificate for your mailbox
- Microsoft 365 tenant/mailbox to configure S/MIME

---

## S/MIME explained

S/MIME means Secure / Multipurpose Internet Mail Extensions. It’s an email security standard defined by the Internet Engineering Task Force which allows you to encrypt your email messages and attachments sent. In simple terms:

- It encrypts emails and attachments so only the intended recipient should read them
- It digitally signs emails so the recipient knows:
  - who sent the message
  - that the content was not altered

S/MIME works using personal certificates (public/private keys), just like SSL certificates for web servers which will be handled automatically by most email clients.

---

## S/MIME versus DKIM

In the beginning, I found S/MIME be really similar to [what DKIM does](https://justinverstijnen.nl/enhance-email-security-with-spf-dkim-dmarc/#dkim), so I did a little research about the differences, and it has some clear takeaways:

- **DKIM** proves an email came from a specific domain/mailserver
  - Keyword: Verification
- **S/MIME** proves an email came from a specific person and keeps the content private for Man in the middle attacks
  - Keyword: Encryption

And I made a little overview about the features of both security protocols:

| Feature | S/MIME | DKIM |
| --- | --- | --- |
| Encrypts email content | Yes | No |
| Digitally signs messages | Yes | Yes |
| Verifies *individual sender* | Yes | No |
| Verifies sending domain | No | Yes |
| End-to-end protection | Yes | No |
| Prevents mail server access to content | Yes | No |
| Detects content tampering | Yes | Yes |
| Protects message after delivery | Yes | No |

---

## Step 1: Purchasing your S/MIME certificate(s)

---

## Step 2: Downloading your certificate

---

## Step 3: Installing the certificate

Now we have purchased and downloaded the S/MIME certificate, we need to install this on our Windows machine. You can also do this through Microsoft Intune, but I will do the manual option for now.

Open your local Certificates manager (certmgr.msc)

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/Encrypt-your-Microsoft-365-emails-with-S/MIME-6845/jv-media-6845-a87f74d57611.png)

Open the application.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/Encrypt-your-Microsoft-365-emails-with-S/MIME-6845/jv-media-6845-f75b4758ca59.png)

Navigate to your Personal storage and click "Action -> All tasks -> Import..."

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/Encrypt-your-Microsoft-365-emails-with-S/MIME-6845/jv-media-6845-d2eae875abad.png)

Click "Next". Now select the certificate you downloaded and purchased.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/Encrypt-your-Microsoft-365-emails-with-S/MIME-6845/jv-media-6845-45c266d3beee.png)

Click "Next". Now insert the password if you have received this. If you did not get a password from your certificate issuer, leave this blank.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/Encrypt-your-Microsoft-365-emails-with-S/MIME-6845/jv-media-6845-5c1c94e0b9b0.png)

Click "Next" twice and then finish. The certificate should now be in your Personal certificate storage:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/Encrypt-your-Microsoft-365-emails-with-S/MIME-6845/jv-media-6845-04768d6d604c.png)

---

## Step 4: Export certificate information to file

We must now export our certificate provider information to a single file. We can use that file to give it to Exchange Online to trust our certificates and be able to setup the secure, encrypted connection.

On the computer where you installed the S/MIME certificate, open PowerShell.

Then paste this simple script:

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
$sst = "C:\JV-Exported-Certs.sst"
$root = Get-ChildItem Cert:\LocalMachine\Root |
    Where-Object { $_.Subject -like "*Actalis Authentication Root CA*" } |
    Select-Object -First 1

$intermediate = Get-ChildItem Cert:\LocalMachine\CA |
    Where-Object { $_.Subject -like "*Client Authentication CA G3*" } |
    Select-Object -First 1

if (-not $root -or -not $intermediate) {
    Write-Host "Root or Intermediate certificate not found"
    return
}

# Build and export sst
$collection = New-Object System.Security.Cryptography.X509Certificates.X509Certificate2Collection
$collection.Add($root) | Out-Null
$collection.Add($intermediate) | Out-Null
$bytes = $collection.Export([System.Security.Cryptography.X509Certificates.X509ContentType]::SerializedStore)
[System.IO.File]::WriteAllBytes($sst, $bytes)
$verify = New-Object System.Security.Cryptography.X509Certificates.X509Certificate2Collection
$verify.Import($sst)
Write-Host "SST contains:"
$verify | Select Subject, Issuer | Format-Table -AutoSize
Write-Host "Certificate count:" $verify.Count
{{< /card >}}

Change the Text *CertProviderName* to your certificate provider name. It only must contain a part of the name.

This script exports all root certificate information from your certificate provider to a single file. We must upload this file to Exchange Online so Microsoft trusts our certificates.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/Encrypt-your-Microsoft-365-emails-with-S/MIME-6845/jv-media-6845-e416169b6ca8.png)

You can now find the file in the C:\ root directory:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/Encrypt-your-Microsoft-365-emails-with-S/MIME-6845/jv-media-6845-4f7a1619e9b2.png)

Now we are ready to go to the next step.

---

## Step 5: Upload certificate provider information to Exchange Online

Now we have the file with all the information ready to be uploaded, let's make a connection to Exchange Online with PowerShell. If you need to install the module, follow this guide: <https://www.powershellgallery.com/packages/ExchangeOnlineManagement/3.9.0>

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
Connect-ExchangeOnline
{{< /card >}}

Then login to your tenant/account with at least Exchange administrator permissions.

Then execute this command to tell Exchange Online which certificate provider you use.

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
Set-SmimeConfig -SMIMECertificateIssuingCA ([System.IO.File]::ReadAllBytes('C:\JV-Exported-Certs.sst'))
{{< /card >}}

This command should run without any output, which means it completed successfully.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/Encrypt-your-Microsoft-365-emails-with-S/MIME-6845/jv-media-6845-95dea0305eae.png)

After running that command, you can check if the certificate is added succesfully with these commands:

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
$cfg = Get-SmimeConfig

$col = New-Object System.Security.Cryptography.X509Certificates.X509Certificate2Collection
$col.Import($cfg.SMIMECertificateIssuingCA)

$col | Select Subject,Issuer | Format-Table -AutoSize
{{< /card >}}

You will get the complete names of the certificates uploaded:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/Encrypt-your-Microsoft-365-emails-with-S/MIME-6845/jv-media-6845-526800d2b71d.png)

Wait for around 10 to 15 minutes before changing anything in your Email clients for this new configuration to propagate.

---

## Step 6: Enable digital signatures in Outlook

Now we can go out of PowerShell and actually test if this email encryption works. Open your Outlook, go to Settings, and then Mail -> S/MIME.

First enable the "Digital signatures" option without enabling the Encrypt contents option yet. Enabling this will break your email sending capabilities.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/Encrypt-your-Microsoft-365-emails-with-S/MIME-6845/jv-media-6845-e49b113aeec3.png)

---

## The result

After the certificate is added and trusted and the first email is sent, you will see what happens at the receiver side. They will get an notification that the email is digitally signed:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/Encrypt-your-Microsoft-365-emails-with-S/MIME-6845/jv-media-6845-feb216e1c488.png)

However, if you want to encrypt the email messages, you must have the public key of your receiver to create a secure channel. This is done by receiving an email from your receiver first with the digital signature. This will be saved into your address book and then you can reply with encryption.

---

## Summary

### Sources

These sources helped me by writing and research for this post;

1. <https://learn.microsoft.com/en-us/exchange/security-and-compliance/smime-exo/configure-smime-exo>

{{< ads >}}

{{< article-footer >}}
