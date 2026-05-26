---
title: "Microsoft Defender External Attack Surface Management (EASM)"
date: 2026-07-04
description: "Microsoft Defender External Attack Surface Management (EASM) is a separate Defender solution which can be used to defend and monitor some of your external attack surfaces like websites, servers, SSL certificates and domains. All of this is achieved through a single admin panel in your Azure Portal."
tags:
- Step by Step guides
- Concepts
categories:
- Microsoft Defender XDR
---

## What is Defender External Attack Surface Management (EASM)?

Microsoft Defender External Attack Surface Management (EASM) is a separate Defender solution which can be used to defend and monitor some of your external attack surfaces, like:

- Websites
- IP addresses
- Domains
- SSL certificates
- Other digital assets

In addition to these components, EASM can also forward all relevant information and logs to SIEM solutions such as Microsoft Sentinel. It is also possible to manually input company-specific data, such as all domain names and IP addresses associated with its services.

[![jv-media-8503-b582bf706272.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/microsoft-defender-external-attack-surface-management/jv-media-8503-b582bf706272.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/microsoft-defender-external-attack-surface-management/jv-media-8503-b582bf706272.png)

_Source: Microsoft_

---

## Best features of Microsoft Defender EASM

The best features of Defender EASM are:

- Open port scanning on IP addresses
- SSL certificate monitoring + expiration date checks
- Domain name checks + expiration date verification
- Active scanning for known CVE score vulnerabilities
- Identifying common administrative misconfigurations
- Web server assessments based on OWASP guidelines
- Tracking changes in assets
- 30 days free trial of the solution (30 days no billing)

### Estimated costs of Defender EASM

The costs for this solution are relatively minimal; you pay €0.01 per day per host, domain, or IP address which is added.

For example, I configured it with **10 instances of each**, resulting in a total monthly cost of **€9.17**. The costs are billed on your Azure invoice of your subscription. This makes the solution relatively cheap.

---

## Step 1: Deploy the EASM workspace

To get started using this solution, we navigate to the Azure Portal and search for "Defender EASM".

[![jv-media-8503-8a586e6fa807.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/microsoft-defender-external-attack-surface-management/jv-media-8503-8a586e6fa807.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/microsoft-defender-external-attack-surface-management/jv-media-8503-8a586e6fa807.png)

Then we create a new workspace in this Azure environment. Click "+ Create" to create a new workspace.

[![jv-media-8503-bdeabfa26a3f.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/microsoft-defender-external-attack-surface-management/jv-media-8503-bdeabfa26a3f.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/microsoft-defender-external-attack-surface-management/jv-media-8503-bdeabfa26a3f.png)

Give the workspace a name which only contains letters and numbers and finish the wizard. The workspace will now be deployed.

[![jv-media-8503-734ad4ba92ae.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/microsoft-defender-external-attack-surface-management/jv-media-8503-734ad4ba92ae.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/microsoft-defender-external-attack-surface-management/jv-media-8503-734ad4ba92ae.png)

---

## Step 2: Filling the EASM inventory

Now that we have the EASM workspace in place, we now need to fill it with our resources. This enables Defender EASM to scan and monitor them.

Navigate to the newly created EASM workspace and open the "Inventory" blade. Here you can choose to automatically discover your assets but I will add them manually for the purpose of this guide.

Click on the "Create a custom attack surface" button to add items to the inventory:

[![jv-media-8503-f71f3f48cf52.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/microsoft-defender-external-attack-surface-management/jv-media-8503-f71f3f48cf52.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/microsoft-defender-external-attack-surface-management/jv-media-8503-f71f3f48cf52.png)

We can fill in our information here. As this unfortunately doesnt have any import-feature we have to type them all in by hand.

[![jv-media-8503-d399516dd102.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/microsoft-defender-external-attack-surface-management/jv-media-8503-d399516dd102.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/microsoft-defender-external-attack-surface-management/jv-media-8503-d399516dd102.png)

I have added some of my domains and emailaddresses for the purpose of this guide.

[![jv-media-8503-6a2d4f11a388.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/microsoft-defender-external-attack-surface-management/jv-media-8503-6a2d4f11a388.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/microsoft-defender-external-attack-surface-management/jv-media-8503-6a2d4f11a388.png)

Now we can click confirm to add all the assets to the workspace. It will automatically start scanning your resources, but this initial scanning can take up to 48 hours. You can check the status on the EASM workspace, in my case the first numbers already arrived within 5 minutes.

---

## Step 3: Checking the status of the assets

After the EASM workspace have scanned your domain names and hosts, it will present them on the workspace-homepage.

[![jv-media-8503-35fdbde4e3a9.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/microsoft-defender-external-attack-surface-management/jv-media-8503-35fdbde4e3a9.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/microsoft-defender-external-attack-surface-management/jv-media-8503-35fdbde4e3a9.png)

We can now click through all these blocks to view what the solution has found. It immediately starts searching for vulnerabilities and possible attack vectors. The inventory shows all the found assets:

[![jv-media-8503-d06905233742.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/microsoft-defender-external-attack-surface-management/jv-media-8503-d06905233742.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/microsoft-defender-external-attack-surface-management/jv-media-8503-d06905233742.png)

---

## Step 4: Check for possible vulnerabilities

As we now have added our assets and the discovery process has been completed, we can now check if any of our assets is vulnerable to any known vulnerabilities and threats. You can find the exposure under the "Dashboards" category. The "Attack surface summary" shows the most information:

[![jv-media-8503-828e71ba8b4a.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/microsoft-defender-external-attack-surface-management/jv-media-8503-828e71ba8b4a.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/microsoft-defender-external-attack-surface-management/jv-media-8503-828e71ba8b4a.png)

---

## Step 5: Adding resources after discovery (optional)

After the initial discovery it's still possible to add more resources for scanning with Defender EASM. To add more assets, navigate to "Discovery" and open the Discovery group.

[![jv-media-8503-023889c8d421.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/microsoft-defender-external-attack-surface-management/jv-media-8503-023889c8d421.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/microsoft-defender-external-attack-surface-management/jv-media-8503-023889c8d421.png)

Then click the "Edit" button.

[![jv-media-8503-6f1225401b7e.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/microsoft-defender-external-attack-surface-management/jv-media-8503-6f1225401b7e.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/microsoft-defender-external-attack-surface-management/jv-media-8503-6f1225401b7e.png)

And there are the fields you also filled in earlier.

[![jv-media-8503-a1f04a8532bf.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/microsoft-defender-external-attack-surface-management/jv-media-8503-a1f04a8532bf.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/microsoft-defender-external-attack-surface-management/jv-media-8503-a1f04a8532bf.png)

---

## Testing the solution

To test the detections of Defender EASM, I have deployed a virtual machine with the "Damn Vulnerable Web App" image off the Azure Marketplace. This will become our Honeypot, an intended vulnerable attacking machine. We will then add this to the Defender EASM configuration and scan the host. We are certainly sure that it must find "some" vulnerabilities.

[![jv-media-8503-5425ab73e0f2.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/microsoft-defender-external-attack-surface-management/jv-media-8503-5425ab73e0f2.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/microsoft-defender-external-attack-surface-management/jv-media-8503-5425ab73e0f2.png)

I have added the IP address of the newly created virtual machine and created an A record to point to the VM, to scan on two hosts: both on the IP and on the application level. Now let's wait on the results of Defender EASM. The machine itself is online during the scanning:

[![jv-media-8503-4a1cb9512a5b.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/microsoft-defender-external-attack-surface-management/jv-media-8503-4a1cb9512a5b.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/microsoft-defender-external-attack-surface-management/jv-media-8503-4a1cb9512a5b.png)

_The web-login of the intended vulnerable Web-app._

The overview of the vulnerable server looks like this:

[![jv-media-8503-c968ff9e90c0.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/microsoft-defender-external-attack-surface-management/jv-media-8503-c968ff9e90c0.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/microsoft-defender-external-attack-surface-management/jv-media-8503-c968ff9e90c0.png)

The open ports/services of the server:

[![jv-media-8503-d2664c1586f9.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/microsoft-defender-external-attack-surface-management/jv-media-8503-d2664c1586f9.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/microsoft-defender-external-attack-surface-management/jv-media-8503-d2664c1586f9.png)

And after scanning, the solution has scanned all vulnerabilities in terms of open ports and services and vulnerabilities to be scanned:

[![jv-media-8503-62ff1e32cc35.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/microsoft-defender-external-attack-surface-management/jv-media-8503-62ff1e32cc35.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/microsoft-defender-external-attack-surface-management/jv-media-8503-62ff1e32cc35.png)

---

## Summary

Defender EASM is a nice solution for actively scanning your asset inventory for known vulnerabilities. This can be used as an extra control plane for overviewing those and be informed about the exposure. Limiting this exposure also decreases your attacking possibilities for hackers.

This solution is great to use and not that expensive for the additional security it can provide. However, you must use it as a tool to increase your security. Only enabling it and paying the money does nothing.

Thank you for visiting this page and I hope it was helpful!

{{< ads >}}

{{< article-footer >}}