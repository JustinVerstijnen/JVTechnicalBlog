---

title: "Module 1: Fundaments of Cloud and Azure"  
date: 2024-10-17  
slug: "amc-module-1-fundamentals-of-cloud-and-microsoft-azure"  
categories:
- Azure Master Class
tags:
- Concepts
description: >  
    This chapter is about the term "Cloud" and the fundamentals of Microsoft Azure and Cloud Services in general.

---

This chapter is about the term "Cloud" and the fundamentals of Microsoft Azure and Cloud Services in general.

## What is "the Cloud"?

The Cloud is a widely used term to say, "That runs elsewhere on the internet." There are many different definitions, but the National Institute of Standards and Technology (NIST) in the United States has identified five characteristics that a service/solution must meet to call itself a cloud service:

1.  On-demand self-service
2.  Broad network access
3.  Resource pooling and pay-per-use
4.  Rapid elasticity or flexible up/downscaling
5.  Measured service

---

## Public Cloud, Private Cloud, and Community Cloud

Within cloud services, we have two different concepts of the Cloud: Public Cloud and Private Cloud:

**Public Cloud:** In the case of a Public Cloud, we refer to a cloud service such as Microsoft Azure, Google Cloud, or Amazon Web Services. With these services, servers are shared among different customers. Hence the term "Public Cloud." However, data security is well-managed to ensure that sensitive business data doesn't become publicly exposed, and various security options are available. In the case of the Public Cloud, you run your workload on servers in a data center owned by the Cloud Service Provider.

**Private Cloud:** With a Private Cloud/On-premises solution, a company hosts its own servers on its premises or in a rented data center. The customer is also responsible for resolving outages, designing the appropriate hardware configurations, managing the correct licenses, software, maintenance, and security.

**Community Cloud:** In a Community Cloud, a cloud provider makes part of the infrastructure available to, for example, government agencies and other non-profit organizations. These may be further isolated, and different pricing models apply, often with fixed pricing agreements.

---

## Different types of services (IaaS/PaaS/SaaS)

When we talk about cloud or "As-a-service," we mean that we are purchasing a specific service. In the past, you would often buy a server, a software package, or a certain license. In an as-a-service model, you pay monthly or annually for its use.

What is important to understand about different cloud services is that as a customer, even though you are using a service, you are still responsible for certain areas. See the matrix below; for example, with IaaS services, you are always responsible for the operating system, applications, and data.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/amc-module-1-fundamentals-of-cloud-and-microsoft-azure-450/jv-media-450-b887946fbc82.png)

In general, there are three main types of cloud services:

**Infrastructure-as-a-Service (IaaS):** With IaaS, a company/customer is only responsible for the operating system layer and above. The infrastructure is provided as a service and is managed by the provider.

*   _Examples:_ Virtual machines, Virtual Desktop, Virtual network, SQL on VM

**Platform-as-a-Service (PaaS):** With PaaS, a company/customer is only responsible for the applications and data.

*   _Examples:_ Azure SQL, Cosmos DB

**Software-as-a-Service (SaaS):** With SaaS, a company/customer is only responsible for the configuration and permissions of the software. All underlying infrastructure and software are managed by the provider.

*   _Examples:_ Microsoft 365, Dynamics 365, Power Platform, AFAS Online, TOPdesk

And we call self hosted servers:

*   **On-premises:** With on-premises, a company/customer is 100% responsible for all components but also has the most information and control.
    *   _Examples:_ Own servers/hypervisors

---

## When to choose Public or Private Cloud?

There is no definitive answer to this question. Companies often have their own reasons for keeping certain servers on-site, such as sensitive data, outdated applications, or specific (hardware-related) integrations.

Different companies also have different priorities. One company may prefer a large hardware replacement cycle every 3 to 5 years with the high associated costs but lower operational expenses. Another company may prefer the opposite approach.

Good consultation with the customer and solid technical insight will help provide an answer to this question.

Other good scenarios for choosing the Public Cloud include:

*   **Predicted or unpredictable scaling**
*   **Rapidly growing companies**
*   **On-and-off scenarios**, such as seasons, during the Olympics or the FIFA World Cup.

---

## Explaining the cloud to customers

This is because prices may initially seem quite high. However, when you take into account all the factors, such as those in the image below, you’ll see that the Cloud isn’t such a crazy option after all:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/amc-module-1-fundamentals-of-cloud-and-microsoft-azure-450/jv-media-450-06b04e44b2a7.png)

For on-premises (local) servers, for example, you incur the following costs that you don't have in the cloud:

*   Applying patches/updates to hardware
*   Daily/weekly/monthly maintenance of physical hardware
*   Downtime
*   Electricity costs
*   Backup power supply
*   Cooling systems
*   Tuning performance

---

## What is Microsoft Azure?

Microsoft Azure is an Infrastructure-as-a-Service (IaaS) cloud service designed to run compute and storage solutions.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/amc-module-1-fundamentals-of-cloud-and-microsoft-azure-450/jv-media-450-b0a5c2995fdf.png)

It can serve as a replacement for physical servers and consists of dozens of different services, such as:

*   Virtual Machines
*   Azure Storage
*   Azure SQL
*   Azure Cosmos DB
*   Azure Virtual Desktop
*   Azure Firewall
*   Azure Virtual Network
*   Azure Backup (with Recovery Services)

Most services in Microsoft Azure are "serverless." This means you use a service without needing to manage or secure a server. Serverless solutions require the least maintenance, and Microsoft manages them for us and the customer.

---

## Costs management in Microsoft Azure

**Microsoft Azure works with the "Pay-as-you-go" model.** This means you pay based on the usage of the cloud service and its resources. This makes the platform very flexible in terms of pricing.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/amc-module-1-fundamentals-of-cloud-and-microsoft-azure-450/jv-media-450-150ee8daf588.png)

Billing by Azure to a customer or reseller happens at the **Subscription level**, and payment methods are quite limited, usually to various types of credit cards.

To get an idea of what a specific service with your custom configuration costs, you can use the official Azure calculator, which can be found here: [Pricing Calculator | Microsoft Azure](https://azure.microsoft.com/en-us/pricing/calculator/).

---

## Access and manage Microsoft Azure

Microsoft Azure has its own management portal. If an organization already has Microsoft 365, Microsoft Azure will already be set up, and you’ll only need a subscription and a payment method.

If an organization does not yet have Microsoft Azure, you can create an account and then set up a subscription.

The management portal is: [Microsoft Azure](https://azure.microsoft.com/). (https://portal.azure.com)

---

## Limits and Quotas in Microsoft Azure

In Microsoft Azure, there are limits and quotas on what a specific organization can use. By default, the limits/quotas are quite low, but they can be increased. Microsoft wants to maintain control over which organizations can use large amounts of power and which cannot, while also dealing with the physical hardware that needs to be available for this. The purpose of quotas is to ensure the best experience for every Microsoft Azure customer.

Quotas can easily be increased via the Azure Portal → Quotas → Request quota increase. Here, you can submit a support request to increase a specific quota, and 9 out of 10 times, it will be increased within 5 minutes. If you submit a large request, it may take 2 to 3 business days.

---

## Hierarchy of availability in Microsoft Azure

Connecting many data centers and servers together requires a solid hierarchy and grouping. Additionally, it’s helpful to understand how the service is structured to identify any weaknesses in terms of resilience and redundancy.

Azure is structured as follows:

*   **Continents/Global:** The world consists of different continents with several Azure Regions. Some Azure services are global.
*   **Azure Regions:** Across various continents around the world, Azure has designed several regions.
*   **Availability Zones:** In different Azure regions, Microsoft has divided data centers into Availability Zones. These are logical groups of data centers with independent power, cooling, networking, and other essentials, but with extremely fast interconnections of \<2 ms latency.
*   **Data Centers:** Within the different Availability Zones, the data centers are divided. A data center is a large building housing a collection of servers, sometimes up to 5,000 servers per building.
*   **Servers:** Inside the Azure data centers are the physical servers that host the full range of Microsoft Azure services.

---

## Services and Availability levels

Microsoft Azure puts a lot of effort into ensuring the best availability for its customers and has the best options in place for this. However, there are differences in how Azure services are available or can be made available. This is important to consider when designing a solution architecture on Azure.

*   **Global:** A global service is an Azure service that operates Azure-wide and is not deployed in a specific region. A failure in an Azure region will not cause issues for global services.
*   **Regional:** A regional service is an Azure service deployed in a specific region. Failure of this region will mean an interruption of the service.
*   **Zone-redundant:** A zone-redundant service is an Azure service distributed across the 3 availability zones within a single region. This makes the service redundant and able to withstand the failure of one or more data centers but not the complete region. However, this extra redundancy must always be configured and selected.
*   **Zonal:** A zonal service is an Azure service deployed in a specific availability zone, or a service that can be deployed in Availability Zones but isn’t. Failure of a data center in this case would mean an interruption of the service.

The table below shows which services can be categorized under the above concepts:

| **Global** | **Regional** | **Zone-redundant** | **Zonal** |
| --- | --- | --- | --- |
| Azure AD | Azure Virtual Networks | Azure Virtual Machines | Azure Virtual Machines |
| Azure Traffic Manager | Azure Functions | Azure Managed Disks | Azure SQL Database |
| Azure Front Door | Azure Key Vault | Azure Blob Storage | Azure VPN Gateway |
| Azure CDN | Azure Storage | Azure SQL Databases |   |
| Azure Cosmos DB (with multi-master) | Azure Load Balancer | Azure Kubernetes Services |   |
| Azure DevOps Services | Azure Service Bus | Azure Key Vault |   |
|   | Azure Search | Azure Application Gateway |   |
|   | Azure Event Hub | Azure Load Balancer |   |
|   |   | Azure Firewall |   |

---

## Summary Module 1

Microsoft Azure is a Infrastructure-as-a-service platform which is cloud based. It focusses primairly on replacing your infrastructure and hosting it in the cloud. This goes further than hosting a virtual machine or hosting a file storage.

To go back to the navigation page: <https://justinverstijnen.nl/blog/azure-master-class/>

{{< ads >}}

{{< article-footer >}}