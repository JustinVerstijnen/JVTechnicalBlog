---
title: "1 - Azure Introduction"
slug: "1-azure-introduction"
date: 2025-09-01
tags:
- Lab Objective
- Knowledge Check
categories:
- Microsoft Azure Labs
description: "In this objective, you will learn about how to build and configure the required Azure resources in your own environment. Make sure you use your own Azure subscription, tenant, and resource groups when completing the tasks. The goal of this lab is to gain hands-on experience with setting up Azure infrastructure in a secure and structured, where the goal is to maximize the learning experience."
hidden: false
weight: 1
---

> Difficulty: Easy

## Introduction

In this lab, we will start-up and prepare our Azure environment to be able to do the Lab objectives. I will also aim to prepare you to understand the Azure Portal, even when having close to zero experience. In the further labs, some knowledge and experience is preferable. Steps may also vary as Websites and Portals are continuously updated.

These labs are not neccessarily step-by-step guides, but are more like "achieve this goal". Some objectives however can be found on my website, and I will reference them as much as possible where needed.

---

## Requirements

- Around 30 minutes of your time
- A credit-card which can be used to setup a Pay-as-you-go subscription
	- I will give you some tips about how to minimize the costs
- An email address which you can use
- A custom domain name for some objectives

---

## Minimizing Azure costs

As registering your creditcard to Azure might sound like paying a huge amount of bucks every month, but it's relatively cheap to try Azure and to perform some labs in it. You do have to adapt to this Pay-as-you-go structure. I will give you the following guidelines to minimize the costs:

- Shutdown unused VMs
	- VMs are the most expensive when running, when not running you still pay for disks and IP addresses
- Remove unused resources
- Place all testing resources in one resource group, which makes the deletion action very fast and easy
- Setup Budgets in your subscription

My best recommendation is to do a Lab objective, check if everything works, check your configuration and immediately remove all resources. Big chance you will not even pay 1 euro, dependent on how long you spent on the lab objective.

---

{{< ads >}}

---

## 1.1 Setting up Azure environment

- To start following these labs, sign up for an Azure environment at https://azure.com
- If you have any form of free Azure credits, like the trial, student or Visual Studio Enterprise, use that
- Link your Credit card to your Azure environment, effectively creating a subscription
- Rename your Azure subscription to your own desired value
- Set a budget (optional)
- Go to the subscription and review the cost analysis. This will still be empty but is a important overview to monitor costs during your objectives

## 1.2 Getting used to the portal

Before we dive further into the labs, let's get used to the portal itself and its features.

- In the top right corner, you have the settings wheel where you can set the language and some preferences, like menu items on the left always expanding (my favorite)
- Find and open "Microsoft Entra ID"
- Find and open "Virtual Machines"
- Find and open "Virtual Networks"
- Find and open "Storage Accounts"
- Find and open "Resource groups"

## 1.3 Creating your first resource group

Assuming you have never created a resource group before, let's create your first resource group, which is a grouped container of resources that host a service.

- Head back to "Resource groups"
- Create a new Resource Group
- Place it in the region "West Europe"
- Finish the wizard

## 1.4 Deleting the resource group

After we have created the resource group, let's now delete it. We simulate that we have placed all our resources of a objective in it and we want to delete it in a single go.

- Head back to "Resource groups"
- Open the resource group just created
- On the top, click "Delete resource group"
- Type "delete" and proceed with the removal action, after you reviewed possible resources which existed in that resource group

## 1.5 The Azure Cloud Shell

To add a bit to the Azure experience, Azure has a Cloud SHell in the top right corner. This cloud shell consists of two different CLI's:

- Bash (Linux based)
- Azure PowerShell

Every action we can possible do in the Portal can also be done using commands and scripts, used in automation purposes. I wanted to introduce you to this in advance, so we can do some deep dives further learning the shell and its features.

Ensure the "Bash" option is selected and type this command:

{{< card code=true header="**Bash**" lang="bash" >}}
az account list
{{< /card >}}

This shows all subscriptions (accounts) in JSON format.

We could also create a resource group with Azure CLI just to try the experience.

{{< card code=true header="**Bash**" lang="bash" >}}
az group create -l westeurope -n jv-az-lab-1
{{< /card >}}

This creates a resource group named "jv-az-lab-1" in the West Europe region.

Then run this command:

{{< card code=true header="**Bash**" lang="bash" >}}
az group delete -n jv-az-lab-1
{{< /card >}}

This deletes the just created resource group named "jv-az-lab-1".

Now we did some simple tasks with the Azure Cloud Shell which we will dive deeper into. The lab is now done, let's check your knowledge!

---

## Knowledge check

{{< quiz >}}
{
  "intro": "Answer these question(s) to test your understanding of this post. Your answers are not saved or sent anywhere; this is simply a personal knowledge check. If you refresh the page, your answers will be cleared.",
  "questions": [
    {
      "question": "What payment methods can be used to use Microsoft Azure?",
      "reference": "1.1 Setting up Azure environment",
      "referenceUrl": "#11-setting-up-azure-environment",
      "answers": [
        {
          "text": "Cash",
          "correct": false,
          "message": "Incorrect. Review the referenced section and try again."
        },
        {
          "text": "Credit card",
          "correct": true,
          "message": "Correct!"
        },
        {
          "text": "Debit card like Maestro",
          "correct": false,
          "message": "Incorrect. Review the referenced section and try again."
        }
      ]
    },
    {
      "question": "What is a Resource Group?",
      "reference": "1.3 Creating your first resource group",
      "referenceUrl": "#13-creating-your-first-resource-group",
      "answers": [
        {
          "text": "A logical container which contains all particular resources for a solution",
          "correct": true,
          "message": "Correct! This is the right answer."
        },
        {
          "text": "A group to add users which gives them access to resources",
          "correct": false,
          "message": "Incorrect, this is a security group."
        },
        {
          "text": "A container where your payment method is linked to",
          "correct": false,
          "message": "Incorrect, this is a subscription."
        }
      ]
    },
    {
      "question": "What CLI's are available in the Azure Cloud Shell?",
      "reference": "1.5 The Azure Cloud Shell",
      "referenceUrl": "#15-the-azure-cloud-shell",
      "answers": [
        {
          "text": "Bash and PowerShell",
          "correct": true,
          "message": "Correct! This is the right answer."
        },
        {
          "text": "Bash, PowerShell and CMD",
          "correct": false,
          "message": "Incorrect. Review the referenced section and try again."
        },
        {
          "text": "Bash only",
          "correct": false,
          "message": "Incorrect. Review the referenced section and try again."
        },
        {
          "text": "PowerShell only",
          "correct": false,
          "message": "Incorrect. Review the referenced section and try again."
        }
      ]
    },
    {
      "question": "What Azure CLI command is correct to create a resource group?",
      "reference": "1.5 The Azure Cloud Shell",
      "referenceUrl": "#15-the-azure-cloud-shell",
      "answers": [
        {
          "text": "az group resource create jv-az-lab-1 -l westeurope",
          "correct": false,
          "message": "Incorrect. Review the referenced section and try again."
        },
        {
          "text": "az group create -l westeurope -n jv-az-lab-1",
          "correct": true,
          "message": "Correct!"
        },
        {
          "text": "az account create group",
          "correct": false,
          "message": "Incorrect. Review the referenced section and try again."
        },
        {
          "text": "ipconfig /all",
          "correct": false,
          "message": "Incorrect. Review the referenced section and try again."
        }
      ]
    }
  ]
}
{{< /quiz >}}

{{< ads >}}

{{< article-footer >}}