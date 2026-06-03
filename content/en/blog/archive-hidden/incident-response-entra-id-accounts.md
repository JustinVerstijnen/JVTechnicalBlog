---
title: "Incident Response for Entra ID Accounts"
slug: "incident-response-entra-id-accounts"
date: 2024-07-01
tags:
- Tools and Scripts
categories:
- Microsoft Entra
description: "In this guide, I will explain the steps you can follow when an Entra ID account is suspected to be compromised. This guide can also be used as a checklist during investigations to verify whether an account is healthy and to identify what actions an attacker may have performed."
---

### Overview

For suspected Entra ID account compromise incidents, I should work with the following five phases:

1. Detection phase
2. Blocking actions
3. Remediation actions
4. Investigation phase
5. Closure and reporting

<!-- draw.io diagram -->
<div class="drawio-white-background" style="background:#ffffff; padding:24px; border-radius:12px; overflow-x:auto;">
<div class="mxgraph" style="max-width:100%;border:1px solid transparent;background:#ffffff;" data-mxgraph="{&quot;highlight&quot;:&quot;#0000ff&quot;,&quot;nav&quot;:true,&quot;resize&quot;:true,&quot;dark-mode&quot;:&quot;light&quot;,&quot;toolbar&quot;:&quot;zoom layers tags lightbox&quot;,&quot;xml&quot;:&quot;&lt;mxfile host=\&quot;app.diagrams.net\&quot; agent=\&quot;Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0\&quot;&gt;\n  &lt;diagram id=\&quot;sPwiIYDdveJgUE_D-pUB\&quot; name=\&quot;Page-1\&quot;&gt;\n    &lt;mxGraphModel dx=\&quot;2426\&quot; dy=\&quot;1687\&quot; grid=\&quot;1\&quot; gridSize=\&quot;10\&quot; guides=\&quot;1\&quot; tooltips=\&quot;1\&quot; connect=\&quot;1\&quot; arrows=\&quot;1\&quot; fold=\&quot;1\&quot; page=\&quot;1\&quot; pageScale=\&quot;1\&quot; pageWidth=\&quot;413\&quot; pageHeight=\&quot;291\&quot; math=\&quot;0\&quot; shadow=\&quot;0\&quot;&gt;\n      &lt;root&gt;\n        &lt;mxCell id=\&quot;0\&quot; /&gt;\n        &lt;mxCell id=\&quot;1\&quot; parent=\&quot;0\&quot; /&gt;\n        &lt;mxCell id=\&quot;yhsBPEnZKp6a-6PUHvON-2\&quot; parent=\&quot;1\&quot; style=\&quot;shape=step;perimeter=stepPerimeter;whiteSpace=wrap;html=1;fixedSize=1;size=10;fillColor=#77B0DE;strokeColor=none;fontSize=17;fontColor=#FFFFFF;fontStyle=1;align=center;rounded=0;\&quot; value=\&quot;1. Detect\&quot; vertex=\&quot;1\&quot;&gt;\n          &lt;mxGeometry height=\&quot;30\&quot; width=\&quot;200\&quot; x=\&quot;-1230\&quot; y=\&quot;-570\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;yhsBPEnZKp6a-6PUHvON-3\&quot; parent=\&quot;1\&quot; style=\&quot;shape=step;perimeter=stepPerimeter;whiteSpace=wrap;html=1;fixedSize=1;size=10;fillColor=#9BA2C2;strokeColor=none;fontSize=17;fontColor=#FFFFFF;fontStyle=1;align=center;rounded=0;\&quot; value=\&quot;4. Investigation\&quot; vertex=\&quot;1\&quot;&gt;\n          &lt;mxGeometry height=\&quot;30\&quot; width=\&quot;200\&quot; x=\&quot;-630\&quot; y=\&quot;-570\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;yhsBPEnZKp6a-6PUHvON-4\&quot; parent=\&quot;1\&quot; style=\&quot;shape=step;perimeter=stepPerimeter;whiteSpace=wrap;html=1;fixedSize=1;size=10;fillColor=#C92727;strokeColor=none;fontSize=17;fontColor=#FFFFFF;fontStyle=1;align=center;rounded=0;\&quot; value=\&quot;2. Block\&quot; vertex=\&quot;1\&quot;&gt;\n          &lt;mxGeometry height=\&quot;30\&quot; width=\&quot;200\&quot; x=\&quot;-1030\&quot; y=\&quot;-570\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;yhsBPEnZKp6a-6PUHvON-5\&quot; parent=\&quot;1\&quot; style=\&quot;shape=step;perimeter=stepPerimeter;whiteSpace=wrap;html=1;fixedSize=1;size=10;fillColor=#88D484;strokeColor=#82b366;fontSize=17;fontStyle=1;align=center;rounded=0;\&quot; value=\&quot;&amp;lt;font style=&amp;quot;color: rgb(255, 255, 255);&amp;quot;&amp;gt;3. Remediate&amp;lt;/font&amp;gt;\&quot; vertex=\&quot;1\&quot;&gt;\n          &lt;mxGeometry height=\&quot;30\&quot; width=\&quot;200\&quot; x=\&quot;-830\&quot; y=\&quot;-570\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;yhsBPEnZKp6a-6PUHvON-6\&quot; parent=\&quot;1\&quot; style=\&quot;shape=step;perimeter=stepPerimeter;whiteSpace=wrap;html=1;fixedSize=1;size=10;fillColor=#AD93BD;strokeColor=none;fontSize=17;fontColor=#FFFFFF;fontStyle=1;align=center;rounded=0;\&quot; value=\&quot;5. Closing\&quot; vertex=\&quot;1\&quot;&gt;\n          &lt;mxGeometry height=\&quot;30\&quot; width=\&quot;200\&quot; x=\&quot;-430\&quot; y=\&quot;-570\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;yhsBPEnZKp6a-6PUHvON-7\&quot; parent=\&quot;1\&quot; style=\&quot;shape=rect;fillColor=#77B0DE;strokeColor=none;fontSize=12;html=1;whiteSpace=wrap;align=left;verticalAlign=top;spacing=5;rounded=0;\&quot; value=\&quot;&amp;lt;div&amp;gt;&amp;lt;font color=&amp;quot;#ffffff&amp;quot;&amp;gt;&amp;lt;span style=&amp;quot;font-size: 14px;&amp;quot;&amp;gt;1.1 Review sign-in attempts from the last 30 days&amp;lt;/span&amp;gt;&amp;lt;/font&amp;gt;&amp;lt;/div&amp;gt;\&quot; vertex=\&quot;1\&quot;&gt;\n          &lt;mxGeometry height=\&quot;60\&quot; width=\&quot;190\&quot; x=\&quot;-1230\&quot; y=\&quot;-530\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;yhsBPEnZKp6a-6PUHvON-8\&quot; parent=\&quot;1\&quot; style=\&quot;shape=rect;fillColor=#77B0DE;strokeColor=none;fontSize=12;html=1;whiteSpace=wrap;align=left;verticalAlign=top;spacing=5;rounded=0;\&quot; value=\&quot;&amp;lt;font style=&amp;quot;font-size: 14px; color: rgb(255, 255, 255);&amp;quot;&amp;gt;1.2 Review Risky Users&amp;lt;/font&amp;gt;\&quot; vertex=\&quot;1\&quot;&gt;\n          &lt;mxGeometry height=\&quot;56\&quot; width=\&quot;190\&quot; x=\&quot;-1230\&quot; y=\&quot;-466\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;yhsBPEnZKp6a-6PUHvON-11\&quot; parent=\&quot;1\&quot; style=\&quot;shape=rect;fillColor=#878CA8;strokeColor=none;fontSize=12;html=1;whiteSpace=wrap;align=left;verticalAlign=top;spacing=5;rounded=0;\&quot; value=\&quot;&amp;lt;font color=&amp;quot;#ffffff&amp;quot;&amp;gt;&amp;lt;span style=&amp;quot;font-size: 14px;&amp;quot;&amp;gt;4.1 Retrieve Audit Logs from Purview&amp;lt;/span&amp;gt;&amp;lt;/font&amp;gt;\&quot; vertex=\&quot;1\&quot;&gt;\n          &lt;mxGeometry height=\&quot;60\&quot; width=\&quot;190\&quot; x=\&quot;-630\&quot; y=\&quot;-530\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;yhsBPEnZKp6a-6PUHvON-13\&quot; parent=\&quot;1\&quot; style=\&quot;shape=rect;fillColor=#C92727;strokeColor=none;fontSize=12;html=1;whiteSpace=wrap;align=left;verticalAlign=top;spacing=5;rounded=0;\&quot; value=\&quot;&amp;lt;font style=&amp;quot;font-size: 14px; color: rgb(255, 255, 255);&amp;quot;&amp;gt;2.1 Disable the User Account&amp;lt;/font&amp;gt;\&quot; vertex=\&quot;1\&quot;&gt;\n          &lt;mxGeometry height=\&quot;60\&quot; width=\&quot;190\&quot; x=\&quot;-1030\&quot; y=\&quot;-530\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;yhsBPEnZKp6a-6PUHvON-14\&quot; parent=\&quot;1\&quot; style=\&quot;shape=rect;fillColor=#C92727;strokeColor=none;fontSize=12;html=1;whiteSpace=wrap;align=left;verticalAlign=top;spacing=5;rounded=0;\&quot; value=\&quot;&amp;lt;font style=&amp;quot;font-size: 14px; color: rgb(255, 255, 255);&amp;quot;&amp;gt;2.2 Revoke All Sessions&amp;lt;/font&amp;gt;\&quot; vertex=\&quot;1\&quot;&gt;\n          &lt;mxGeometry height=\&quot;56\&quot; width=\&quot;190\&quot; x=\&quot;-1030\&quot; y=\&quot;-466\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;yhsBPEnZKp6a-6PUHvON-15\&quot; parent=\&quot;1\&quot; style=\&quot;shape=rect;fillColor=#C92727;strokeColor=none;fontSize=12;html=1;whiteSpace=wrap;align=left;verticalAlign=top;spacing=5;rounded=0;\&quot; value=\&quot;&amp;lt;font style=&amp;quot;font-size: 14px; color: rgb(255, 255, 255);&amp;quot;&amp;gt;2.3 Reset the Password&amp;lt;/font&amp;gt;\&quot; vertex=\&quot;1\&quot;&gt;\n          &lt;mxGeometry height=\&quot;46\&quot; width=\&quot;190\&quot; x=\&quot;-1030\&quot; y=\&quot;-406\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;yhsBPEnZKp6a-6PUHvON-17\&quot; parent=\&quot;1\&quot; style=\&quot;shape=rect;fillColor=#7ABD75;strokeColor=none;fontSize=12;html=1;whiteSpace=wrap;align=left;verticalAlign=top;spacing=5;rounded=0;\&quot; value=\&quot;&amp;lt;font style=&amp;quot;font-size: 14px; color: rgb(255, 255, 255);&amp;quot;&amp;gt;3.1 Unblock the User Account&amp;lt;/font&amp;gt;\&quot; vertex=\&quot;1\&quot;&gt;\n          &lt;mxGeometry height=\&quot;60\&quot; width=\&quot;190\&quot; x=\&quot;-830\&quot; y=\&quot;-530\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;yhsBPEnZKp6a-6PUHvON-19\&quot; parent=\&quot;1\&quot; style=\&quot;shape=rect;fillColor=#A791BA;strokeColor=none;fontSize=12;html=1;whiteSpace=wrap;align=left;verticalAlign=top;spacing=5;rounded=0;\&quot; value=\&quot;&amp;lt;font style=&amp;quot;font-size: 14px; color: rgb(255, 255, 255);&amp;quot;&amp;gt;5.1 Collect results&amp;lt;/font&amp;gt;\&quot; vertex=\&quot;1\&quot;&gt;\n          &lt;mxGeometry height=\&quot;60\&quot; width=\&quot;190\&quot; x=\&quot;-430\&quot; y=\&quot;-530\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;yhsBPEnZKp6a-6PUHvON-20\&quot; parent=\&quot;1\&quot; style=\&quot;shape=rect;fillColor=#A791BA;strokeColor=none;fontSize=12;html=1;whiteSpace=wrap;align=left;verticalAlign=top;spacing=5;rounded=0;\&quot; value=\&quot;&amp;lt;font style=&amp;quot;font-size: 14px; color: rgb(255, 255, 255);&amp;quot;&amp;gt;5.2 Determine root cause&amp;lt;/font&amp;gt;\&quot; vertex=\&quot;1\&quot;&gt;\n          &lt;mxGeometry height=\&quot;56\&quot; width=\&quot;190\&quot; x=\&quot;-430\&quot; y=\&quot;-466\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;ztd7--43Vpx17IbSh5CJ-1\&quot; parent=\&quot;1\&quot; style=\&quot;shape=rect;fillColor=#7ABD75;strokeColor=none;fontSize=12;html=1;whiteSpace=wrap;align=left;verticalAlign=top;spacing=5;rounded=0;\&quot; value=\&quot;&amp;lt;font style=&amp;quot;font-size: 14px; color: rgb(255, 255, 255);&amp;quot;&amp;gt;3.2 Check Mailbox Rules&amp;lt;/font&amp;gt;\&quot; vertex=\&quot;1\&quot;&gt;\n          &lt;mxGeometry height=\&quot;46\&quot; width=\&quot;190\&quot; x=\&quot;-830\&quot; y=\&quot;-466\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;ztd7--43Vpx17IbSh5CJ-2\&quot; parent=\&quot;1\&quot; style=\&quot;shape=rect;fillColor=#7ABD75;strokeColor=none;fontSize=12;html=1;whiteSpace=wrap;align=left;verticalAlign=top;spacing=5;rounded=0;\&quot; value=\&quot;&amp;lt;font style=&amp;quot;font-size: 14px; color: rgb(255, 255, 255);&amp;quot;&amp;gt;3.3 Check Forwarding Rules&amp;lt;/font&amp;gt;\&quot; vertex=\&quot;1\&quot;&gt;\n          &lt;mxGeometry height=\&quot;46\&quot; width=\&quot;190\&quot; x=\&quot;-830\&quot; y=\&quot;-415\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;ztd7--43Vpx17IbSh5CJ-3\&quot; parent=\&quot;1\&quot; style=\&quot;shape=rect;fillColor=#7ABD75;strokeColor=none;fontSize=12;html=1;whiteSpace=wrap;align=left;verticalAlign=top;spacing=5;rounded=0;\&quot; value=\&quot;&amp;lt;font style=&amp;quot;font-size: 14px; color: rgb(255, 255, 255);&amp;quot;&amp;gt;3.4 Check Automatic Replies&amp;lt;/font&amp;gt;\&quot; vertex=\&quot;1\&quot;&gt;\n          &lt;mxGeometry height=\&quot;46\&quot; width=\&quot;190\&quot; x=\&quot;-830\&quot; y=\&quot;-364\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;ztd7--43Vpx17IbSh5CJ-4\&quot; parent=\&quot;1\&quot; style=\&quot;shape=rect;fillColor=#7ABD75;strokeColor=none;fontSize=12;html=1;whiteSpace=wrap;align=left;verticalAlign=top;spacing=5;rounded=0;\&quot; value=\&quot;&amp;lt;font style=&amp;quot;font-size: 14px; color: rgb(255, 255, 255);&amp;quot;&amp;gt;3.5 Check MFA Methods&amp;lt;/font&amp;gt;\&quot; vertex=\&quot;1\&quot;&gt;\n          &lt;mxGeometry height=\&quot;46\&quot; width=\&quot;190\&quot; x=\&quot;-830\&quot; y=\&quot;-313\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;ztd7--43Vpx17IbSh5CJ-5\&quot; parent=\&quot;1\&quot; style=\&quot;shape=rect;fillColor=#7ABD75;strokeColor=none;fontSize=12;html=1;whiteSpace=wrap;align=left;verticalAlign=top;spacing=5;rounded=0;\&quot; value=\&quot;&amp;lt;font style=&amp;quot;font-size: 14px; color: rgb(255, 255, 255);&amp;quot;&amp;gt;3.6 App Passwords&amp;lt;/font&amp;gt;\&quot; vertex=\&quot;1\&quot;&gt;\n          &lt;mxGeometry height=\&quot;46\&quot; width=\&quot;190\&quot; x=\&quot;-830\&quot; y=\&quot;-260\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;ztd7--43Vpx17IbSh5CJ-6\&quot; parent=\&quot;1\&quot; style=\&quot;shape=rect;fillColor=#7ABD75;strokeColor=none;fontSize=12;html=1;whiteSpace=wrap;align=left;verticalAlign=top;spacing=5;rounded=0;\&quot; value=\&quot;&amp;lt;font style=&amp;quot;font-size: 14px; color: rgb(255, 255, 255);&amp;quot;&amp;gt;3.7 Check 3rd-party application sign-ins&amp;lt;/font&amp;gt;\&quot; vertex=\&quot;1\&quot;&gt;\n          &lt;mxGeometry height=\&quot;59\&quot; width=\&quot;190\&quot; x=\&quot;-830\&quot; y=\&quot;-209\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;ztd7--43Vpx17IbSh5CJ-7\&quot; parent=\&quot;1\&quot; style=\&quot;shape=rect;fillColor=#7ABD75;strokeColor=none;fontSize=12;html=1;whiteSpace=wrap;align=left;verticalAlign=top;spacing=5;rounded=0;\&quot; value=\&quot;&amp;lt;font style=&amp;quot;font-size: 14px; color: rgb(255, 255, 255);&amp;quot;&amp;gt;3.8 Restore User Access&amp;lt;/font&amp;gt;\&quot; vertex=\&quot;1\&quot;&gt;\n          &lt;mxGeometry height=\&quot;46\&quot; width=\&quot;190\&quot; x=\&quot;-830\&quot; y=\&quot;-145\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;ztd7--43Vpx17IbSh5CJ-8\&quot; parent=\&quot;1\&quot; style=\&quot;shape=rect;fillColor=#878CA8;strokeColor=none;fontSize=12;html=1;whiteSpace=wrap;align=left;verticalAlign=top;spacing=5;rounded=0;\&quot; value=\&quot;&amp;lt;font color=&amp;quot;#ffffff&amp;quot;&amp;gt;&amp;lt;span style=&amp;quot;font-size: 14px;&amp;quot;&amp;gt;4.2 Further Investigate Entra ID Sign-in Logs&amp;lt;/span&amp;gt;&amp;lt;/font&amp;gt;\&quot; vertex=\&quot;1\&quot;&gt;\n          &lt;mxGeometry height=\&quot;56\&quot; width=\&quot;190\&quot; x=\&quot;-630\&quot; y=\&quot;-466\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;ztd7--43Vpx17IbSh5CJ-9\&quot; parent=\&quot;1\&quot; style=\&quot;shape=rect;fillColor=#878CA8;strokeColor=none;fontSize=12;html=1;whiteSpace=wrap;align=left;verticalAlign=top;spacing=5;rounded=0;\&quot; value=\&quot;&amp;lt;font color=&amp;quot;#ffffff&amp;quot;&amp;gt;&amp;lt;span style=&amp;quot;font-size: 14px;&amp;quot;&amp;gt;4.3 Review Users and Roles&amp;lt;/span&amp;gt;&amp;lt;/font&amp;gt;\&quot; vertex=\&quot;1\&quot;&gt;\n          &lt;mxGeometry height=\&quot;36\&quot; width=\&quot;190\&quot; x=\&quot;-630\&quot; y=\&quot;-406\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;ztd7--43Vpx17IbSh5CJ-12\&quot; parent=\&quot;1\&quot; style=\&quot;shape=rect;fillColor=#878CA8;strokeColor=none;fontSize=12;html=1;whiteSpace=wrap;align=left;verticalAlign=top;spacing=5;rounded=0;\&quot; value=\&quot;&amp;lt;font color=&amp;quot;#ffffff&amp;quot;&amp;gt;&amp;lt;span style=&amp;quot;font-size: 14px;&amp;quot;&amp;gt;4.4 Check Exchange Connectors&amp;lt;/span&amp;gt;&amp;lt;/font&amp;gt;\&quot; vertex=\&quot;1\&quot;&gt;\n          &lt;mxGeometry height=\&quot;44\&quot; width=\&quot;190\&quot; x=\&quot;-630\&quot; y=\&quot;-364\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;ztd7--43Vpx17IbSh5CJ-13\&quot; parent=\&quot;1\&quot; style=\&quot;shape=rect;fillColor=#878CA8;strokeColor=none;fontSize=12;html=1;whiteSpace=wrap;align=left;verticalAlign=top;spacing=5;rounded=0;\&quot; value=\&quot;&amp;lt;font color=&amp;quot;#ffffff&amp;quot;&amp;gt;&amp;lt;span style=&amp;quot;font-size: 14px;&amp;quot;&amp;gt;4.5 Investigate Backdoors in Enterprise Applications&amp;lt;/span&amp;gt;&amp;lt;/font&amp;gt;\&quot; vertex=\&quot;1\&quot;&gt;\n          &lt;mxGeometry height=\&quot;51\&quot; width=\&quot;190\&quot; x=\&quot;-630\&quot; y=\&quot;-313\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n      &lt;/root&gt;\n    &lt;/mxGraphModel&gt;\n  &lt;/diagram&gt;\n&lt;/mxfile&gt;\n&quot;}"></div>
</div>
<script type="text/javascript" src="https://viewer.diagrams.net/js/viewer-static.min.js"></script>

The goals of this framework are simple:

- Detect suspicious activity quickly
- Fast response by blocking the attacker as soon as possible
- Recover the account safely without major chances of another breach
- Investigate what happened
- Prevent it from happening again by analyzing the cause, learning from it and possible changes in policies

You can use the visual view above, and then use this page for the step-by-step instructions on how to get to the correct blades and setting-pages. You can also click on the exact steps in the Table of Contents section.

---

## 1. Detection Phase

{{% alert title="Actions" color="info" %}}
1.1 Review sign-in attempts from the last 30 days<br>
1.2 Review Risky Users
{{% /alert %}}

In the Detection-phase, we will suspect breach. An Entra ID account compromise can be detected in several ways. The main goal is to use as least time as possible during this phase, as an attacker might have access. Be sure to switch to the Block phase as soon as possible.

Common examples of suspected breach are:

- A user reports strange Outlook behavior like exceeding set limits or bulk emails
- The account is blocked by Conditional Access (best scenario)
- Contacts of the breached user receive spam or phishing emails
- Succesful sign-ins appear in the logs or SIEM from unusual locations and/or countries
- Microsoft flags the account as risky

Before taking recovery actions, we want to first confirm whether the account is actually compromised. This is the main goal of this phase, so focus on:

- Reviewing the last 30 days of sign-in logs
- Looking for succesful sign-in attempts from unusual locations or IP addresses
- Checking whether multiple users are affected

Do not spend too much time in this phase. If compromise is confirmed, move to blocking actions immediately. If you already know by certain behaviour that an account is possibly breached, skip the detection phase and instead directly head to blocking.

As an attacker can be hiding in plain sight and you are not able to detect any suspicious behaviour at this stage, my recommendation is to still follow the steps below. Better safe than sorry.

### 1.1 Review Sign-in Attempts from the Last 30 Days

Open the Entra ID sign-in logs and review the last 30 days.

Use the following filters:

- Time range: 30 days
- Username: affected user account

Sort the results by:

- IP address
- Location

Healthy sign-in behavior usually shows:

- Consistent locations
- Expected IP addresses
- Trusted environments such as AVD or Windows 365

Unhealthy sign-in behavior may include:

- Sign-ins from unexpected countries
- Impossible travel activity
- Failed sign-ins followed by successful sign-ins

If no successful malicious sign-ins are found:

- Reset the password as precaution
- Monitor the account
- No further actions may be required

If malicious sign-ins are confirmed, continue with the next steps.

### 1.2 Review Risky Users

Open the Risky Users page in Entra ID.

This page shows accounts Microsoft identified as potentially compromised.

Verify:

- Whether the affected account appears in the list
- Whether multiple users are affected

Any user that appeared as risky in the last 14 days should be included in the recovery actions.

---

## 2. Blocking Actions

{{% alert title="Actions" color="info" %}}
2.1 Disable the User Account<br>
2.2 Revoke All Sessions<br>
2.3 Reset the Password
{{% /alert %}}

After compromise is confirmed, block the attacker as quickly as possible. The goal in this phase is to stop all active access immediately by revoking the current session and the possibility to the attacker to obtain new tokens. Only blocking access or only changing the password will not stop active sessions for the attacker.

### 2.1 Disable the User Account

Disable the affected account directly.

This prevents the attacker from continuing activity inside the environment.

Attackers often attempt to move toward:

- Administrator accounts
- Executive accounts
- Sensitive mailboxes

Disabling the account immediately limits new sign-in attempts. This can be done in:

- Microsoft 365 Admin Center
- Entra ID Admin Center

Use the option:

- Block sign-in

### 2.2 Revoke All Sessions

Revoke all active sessions in Entra ID. This invalidates all existing authentication tokens by Entra ID, and will ultimately revoke access to the attacker. This ensures:

- Existing sessions stop working
- Browser refreshes fail
- Mobile applications reconnect with new authentication

This step is important because some sessions may remain active for a period of time even after blocking sign-in. This is because of the tokens released by Entra ID are still active as they have a certain lifetime. Revoking sessions and tokens will instantly make these tokens invalid, blocking any action for the attackers.

### 2.3 Reset the Password

Reset the password after the attacker is blocked. Use a strong password:

- Minimum 16 characters
- No dictionary words
- Different from previous passwords

Store the temporary password securely until the recovery phase is completed, as we are not done yet, but we now have prevented further damage.

---

## 3. Recovery Actions

{{% alert title="Actions" color="info" %}}
3.1 Unblock the User Account<br>
3.2 Check Mailbox Rules<br>
3.3 Check Forwarding Rules<br>
3.4 Check Automatic Replies<br>
3.5 Check MFA Methods<br>
3.6 App Passwords<br>
3.7 Check 3rd-party application sign-ins<br>
3.8 Restore User Access
{{% /alert %}}

At this stage, the attacker should no longer have access. We will now verify whether persistence or backdoors were left behind. Do not allow the user to continue working yet during this phase as possible backdoors or other manipulations can be possibly active.

### 3.1 Unblock the User Account (NOG NAAR KIJKEN)

Unblock the account temporarily for recovery actions. Then we can sign in as the user to inspect the environment.

### 3.2 Check Mailbox Rules

Attackers often create mailbox rules to hide activity. 

If having access to the users' environment, Open Outlook on the Web and review all inbox rules.

Look for suspicious rules such as:

- Automatically deleting emails
- Forwarding emails
- Moving emails to RSS or Deleted Items folders

Remove all suspicious rules immediately.

If not having access to the users' environment, we can use Exchange Online PowerShell to check these rules.

### 3.3 Check Forwarding Rules

Check whether mailbox forwarding is enabled.

Unauthorized forwarding can allow attackers to continue receiving emails silently.

Remove all unauthorized forwarding settings.

### 3.4 Check Automatic Replies

Verify whether automatic replies are enabled.

Attackers sometimes configure malicious replies to redirect contacts.

Disable all suspicious automatic replies.

### 3.5 Check MFA Methods

Attackers may register their own MFA method as persistence.

Open the user MFA methods page and verify all registered methods.

Remove:

- Unknown devices
- Unknown phone numbers
- Unknown authenticator applications

Only trusted MFA methods should remain.

### 3.6 App Passwords

App passwords can bypass MFA in older applications.

Follow a Zero Trust approach and remove anything unnecessary.

Verify whether app passwords are enabled in Entra ID.

Possible situations:

- “Do not allow users to create app passwords”
- “Allow users to create app passwords”

If app passwords are enabled:

- Review usage
- Remove unnecessary app passwords
- Disable the feature if possible

Disabling app passwords invalidates all existing app passwords immediately.

### 3.7 Check 3rd-party application sign-ins

Verify:

- User sign-ins
- Suspicious activity
- Malware presence
- General environment health

A compromised account can provide direct access to these systems.

### 3.8 Restore User Access

After all recovery actions are completed, restore access to the user.

Only communicate the new credentials:

- By phone
- In person

Avoid sending passwords through email.

---

## 4. Investigation Phase

{{% alert title="Actions" color="info" %}}
4.1 Retrieve Audit Logs from Purview<br>
4.2 Further Investigate Entra ID Sign-in Logs<br>
4.3 Review Users and Roles<br>
4.4 Check Exchange Connectors<br>
4.5 Investigate Backdoors in Enterprise Applications
{{% /alert %}}

After containment and recovery, investigate how the compromise happened.

This helps improve security and reduce future incidents.

### 4.1 Retrieve Audit Logs from Purview

If auditing was enabled beforehand:

- Open Microsoft Purview
- Search the last 14 days
- Filter on affected users

Review:

- Mailbox activity
- File activity
- Sign-ins
- Permission changes

Export the logs if needed for documentation.

### 4.2 Further Investigate Entra ID Sign-in Logs

Revisit the sign-in logs for deeper analysis.

Investigate:

- Source countries
- IP addresses
- Authentication methods
- Conditional Access gaps

Consider whether Conditional Access policies could prevent similar attacks in the future.

Examples include:

- Blocking risky countries
- Requiring compliant devices
- Blocking legacy authentication

Blocking only IP addresses is usually insufficient because attackers can change IP addresses easily.

### 4.3 Review Users and Roles

Review all privileged role assignments.

Use PowerShell to retrieve all administrative role assignments.

{{< card code=true header="**PowerShell**" lang="powershell" >}}
Connect-AzureAD

Get-AzureADDirectoryRole | % {
    $role = $_
    Get-AzureADDirectoryRoleMember -ObjectId $role.ObjectId | % {
        [pscustomobject]@{
            DisplayName       = $_.DisplayName
            UserPrincipalName = $_.UserPrincipalName
            RoleName          = $role.DisplayName
        }
    }
}
{{< /card >}}

Review the results carefully and remove unauthorized role assignments.

Only approved administrative accounts should have elevated permissions.

### 4.4 Check Exchange Connectors

Compromised administrator accounts may create Exchange connectors for abuse.

Open:

- Exchange Admin Center
- Mail flow
- Connectors

Review all configured connectors and remove anything suspicious.

### 4.5 Investigate Backdoors in Enterprise Applications

Attackers sometimes create malicious Enterprise Applications or Service Principals with permissions inside the tenant.

Use Microsoft Graph PowerShell to review application permissions.

{{< card code=true header="**PowerShell**" lang="powershell" >}}
Connect-MgGraph -Scopes "Application.Read.All", "Directory.Read.All" -NoWelcome
$now = Get-Date
$permissionsLookup = @{}
Get-MgServicePrincipal -All | ForEach-Object {
    $sp = $_
    @($sp.Oauth2PermissionScopes) + @($sp.AppRoles) | Where-Object Id | ForEach-Object {
        $permissionsLookup["$($sp.AppId)|$($_.Id)"] = $_.Value
    }
}

Get-MgApplication -All | ForEach-Object {
    $app = $_
    $hasSecret = [bool]($app.PasswordCredentials | Where-Object { $_.EndDateTime -gt $now })
    $hasCert   = [bool]($app.KeyCredentials      | Where-Object { $_.EndDateTime -gt $now })

    $app.RequiredResourceAccess | ForEach-Object {
        $resourceAccess = $_

        $resourceAccess.ResourceAccess | ForEach-Object {
            [pscustomobject]@{
                ApplicationId   = $app.AppId
                DisplayName     = $app.DisplayName
                PermissionType  = if ($_.Type -eq "Role") { "Application" } else { "Delegated" }
                PermissionName  = $permissionsLookup["$($resourceAccess.ResourceAppId)|$($_.Id)"]
                HasClientSecret = $hasSecret
                HasCertificate  = $hasCert
            }
        }
    }
} | Export-Csv "EntraID_AppPermissions_WithNames.csv" -NoTypeInformation -Encoding UTF8 -Delimiter ";"
{{< /card >}}

Review all applications carefully and remove anything suspicious or unnecessary.

---

## 5. Closure and Reporting

After the investigation is completed, share the findings with the customer or internal organization.

The report should explain:

- What happened
- What was affected
- What actions were taken
- What improvements are recommended

This phase is important for awareness and future prevention.

Use the collected information from:

- Sign-in logs
- Audit logs
- Exchange investigation
- MFA review
- Enterprise Application review

---

## Summary

In this guide, we reviewed a complete incident response process for compromised Entra ID accounts.

The most important parts are:

- Detect suspicious activity quickly
- Block attacker access immediately
- Remove persistence methods
- Investigate how the compromise happened
- Improve security controls afterward

Following a structured response process helps reduce damage and improves recovery time during security incidents.

### Sources

These sources helped me by writing and research for this post;

1. https://learn.microsoft.com/en-us/entra/identity/
2. https://learn.microsoft.com/en-us/entra/identity/users/users-revoke-access
3. https://learn.microsoft.com/en-us/purview/audit-search
4. https://learn.microsoft.com/en-us/exchange/monitoring/mail-flow-insights/connectors-report
5. https://learn.microsoft.com/en-us/graph/powershell/get-started

{{< ads >}}

{{< article-footer >}}