---
title: "AMC - Module 8: Application Services and Containers"
date: 2025-03-06
slug: "amc-module-8-application-services-and-containers"
categories:
  - Azure Master Class
tags:
  - AI Generated Content
  - Concepts
description: >
  This module is about application services and containers in Microsoft Azure. It mainly focuses on containers and containerized...
---
This module is about application services in Microsoft Azure. It mainly focuses on containers and containerized solutions but also explores other serverless solutions. These are solutions where, as a customer or consumer of Microsoft Azure, you do not need to manage a server.

---

---

## Statefull vs. Stateless

We can categorize servers/VMs into two categories: Stateful and Stateless:

**Stateful:** Stateful servers are uniquely configured and have a specific role, for example:

- SQL servers
- Domain Controllers with FSMO roles
- Application servers

**Stateless:** Stateless servers do not have a unique role and can be easily replicated, for example:

- Web servers that connect to a database
- Application servers that connect to a database

---

## Containers

Containers represent a new generation of virtualization. With Hyper-V, Azure, and VMware, we virtualize hardware, but with Containers, we virtualize the operating system. The goal is to quickly and efficiently host scalable applications.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/amc-module-8-application-services-and-containers-1224/jv-media-1224-d663d6173042.png)

Some key features and benefits of using containers are:

- Containers virtualize the operating system (OS) and deploy within seconds.
- A container hosts a process/application alongside multiple containers, sharing the lifecycle.
- High availability at the software level.
- High scalability and the ability to “burst” when needed.
- Tasks can be automated.
- Smaller footprint per solution compared to virtual machines.

Microsoft Azure offers the following container solutions:

- Azure Container Registry
- Azure Container Instance
- Azure Kubernetes Service
- Azure Container Apps
- Azure Spring Apps

## Container Architecture

The configuration of containers in blocks is structured as follows:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/amc-module-8-application-services-and-containers-1224/jv-media-1224-495e879b6592.png)

The main advantage of containers over virtual machines is that you don’t need to configure a separate operating system, network configuration, and instance settings for each deployment. All containers on the container host share the same kernel.

## Isolated containers (Hyper-V containers)

Instead of creating normal, software based containers it is also possible to create isolated containers. This also virtualizes the hardware. This is an option used often when on shared environments or data-protected environments:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/amc-module-8-application-services-and-containers-1224/jv-media-1224-b3c639759012.png)

---

## Docker

Docker is a container runtime solution that allows you to create and manage containers. This container solution can be managed via PowerShell and does not have a GUI, as it is purely a tool designed for technical professionals.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/what-is-mta-sts-and-how-to-protect-your-email-flow-2198/jv-media-2198-9553dc6e01c0.png)

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/amc-module-8-application-services-and-containers-1224/jv-media-1224-56bd299944f8.png)

### Azure Container Registery

Azure Container Registry is a Microsoft Azure service that allows you to store Docker images that you have built for later use. Before this service existed, this was a standalone server role that needed to be installed.

Azure Container Registry ensures that images are stored with the following benefits:

- High availability
- Secure access with RBAC (Role-Based Access Control)
- Centralized management of images

## Container maintenance/rebuilding

A completely different approach to maintaining containers is that containers are based on the container host they run on.

With virtual machines, each VM installs updates individually, and every update needs to be installed separately on each VM. Containers, however, work differently. Instead of updating each container separately, you update the container host and then rebuild all containers. This ensures that your application is hosted with the latest features and security updates across all containers immediately.

## Azure Container Instances (ACI)

Azure Container Instances (ACI) is the simplest Azure solution for running containers as a Platform-as-a-Service (PaaS) offering. With ACI, customers are not responsible for the infrastructure or operating system— only the container and how their application runs on ACI.

Azure Container Instances support both Windows and Linux, with Linux offering the most features.

### Key Features of Azure Container Instances:

- You can select an image from your own repository or the Azure Marketplace.
- The container receives a Public or Private IP address, allowing access either from the internet or only within an Azure Virtual Network.
- The container gets a restart policy, which can be configured to either:
  - Restart immediately on failure.
  - Restart at a scheduled time.
- Isolation by default: ACI does not share the kernel between containers, ensuring security.
- A fast and cost-effective way to deploy multiple containers without managing a Kubernetes cluster.

## Azure Kubernetes Service (AKS) (K8S)

Azure Kubernetes Service (AKS) is a managed service in Microsoft Azure designed to manage multiple containers efficiently. Often, a service consists of multiple containers to enhance resilience and scalability, using load balancers to distribute traffic. AKS offers a much more advanced solution compared to Azure Container Instances (ACI).

### What is Kubernetes itself?

Kubernetes is an orchestration tool for managing multiple containers. It handles:

- Deployment of containers
- Scaling based on demand
- Updating containers with minimal downtime
- Maintenance and auto-healing of containerized applications

Kubernetes has become the industry standard for container management. With Azure Kubernetes Service (AKS), you get all the benefits of Kubernetes as a fully managed PaaS solution in Microsoft Azure, reducing the complexity of setting up and maintaining a Kubernetes cluster manually.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/what-is-mta-sts-and-how-to-protect-your-email-flow-2198/jv-media-2198-adefb3e8e3e0.png)

## Azure Kubernetes plans

AKS is available in two pricing tiers in Microsoft Azure:

|  |  |
| --- | --- |
| **Free (AKS Free)** | **Standard (AKS Standard)** |
| The Kubernetes control plane is free, meaning you don't pay for the management and orchestration services. | Includes an SLA-backed Kubernetes control plane for higher availability and reliability. |
| You only pay for the underlying virtual machines (VMs), storage, and networking used by your worker nodes. | Advanced security features, including Azure Defender for Kubernetes and private cluster options. |
| No Service Level Agreement (SLA) is provided for the uptime of the control plane. | Enhanced scalability and performance options. |
|  | Ideal for production workloads requiring enterprise-grade support and uptime guarantees. |
| Price: Free | Price: $0.10 per cluster per hour + Pay as you go pricing for other resources |

## Azure Kubernetes Management

In Azure Kubernetes Service (AKS), users can manage their Kubernetes clusters through two primary methods:

### **Azure Kubernetes UI (Web Interface)**

- Available via the Azure Portal, providing a graphical overview of AKS clusters.
- Enables users to:
  - View cluster health, node status, and deployed applications.
  - Manage and scale workloads.
  - Access logs and monitoring insights via Azure Monitor and Log Analytics.
- Ideal for users who prefer a visual interface and need basic Kubernetes management without the CLI.

### **KubeCTL CLI (Command-Line Interface)**

- The kubectl CLI is used for managing AKS clusters via Azure Cloud Shell, PowerShell, or a local terminal.
- Provides full control over Kubernetes resources, allowing users to:
  - Deploy, scale, and update applications running in AKS.
  - View and modify cluster configurations.
  - Manage networking, secrets, and storage within the AKS environment.
- Ideal for DevOps engineers and those who need automation and scripting capabilities for Kubernetes workloads.

The key points for using the tools are:

- Use the UI if you need a quick and visual way to check cluster health and manage deployments.
- Use KubeCTL CLI if you need full automation, advanced configuration, and scripting capabilities for AKS.

## Kubernetes Control Plane

The control plane of Kubernetes is the brain behind managing Kubernetes. The control plane is divided into four services:

- **API Server:** The API server is the core service that runs the Kubernetes API. This allows Kubernetes to be managed from the web interface or the KubeCTL command-line interface.
- **Scheduler:** The Scheduler is the service that determines where there is available space to place a container. This service is aware of which nodes and pods have available resources.
- **Controller-Manager:** The Controller-Manager is the service that runs controller processes. This service is consolidated so that a single service takes care of all controller tasks.
- **ETCD Database:** ETCD is a database where all cluster data is stored. It is considered a "key-value" database.

{% alert color="info" %}
For more information, check out this website: <https://kubernetes.io/docs/concepts/overview/components/>
{% /alert %}

The above services are managed by Microsoft Azure in Azure Kubernetes Services.

## Kubernetes Worker Nodes

Kubernetes will distribute a workload across Nodes. These are virtual machines where the Pods, containing the containers, will run. The Node is a standalone environment that runs Docker for the actual deployment and building of the containers.

## Kubernetes Pods

In the Pods, all containers run that host an application or a part of the application.

---

## Azure Container Apps

Azure Container Apps are microservices that are deployed in containers. This means that a large application is divided into containers, allowing each component to be scaled independently while also minimizing the impact on the overall application.

Some key points of Azure Container Apps are:

### **1. Serverless Containers**

- Azure Container Apps provide a fully managed serverless platform for running containers without managing infrastructure
- Unlike Azure Kubernetes Service (AKS), you don't need to configure nodes, scaling, or networking manually. This is all managed by the service itself

### **2. Microservices and Event-driven Architecture**

- Container Apps are designed for microservices architectures, allowing independent deployment and scaling of services
- They integrate well with event-driven processing, making them ideal for applications with real-time event handling

### **3. Autoscaling with KEDA**

- Azure Container Apps use KEDA (Kubernetes Event-Driven Autoscaling) to scale containers automatically based on:
  - HTTP requests
  - CPU/memory usage
  - Message queue events (e.g., Azure Service Bus, Kafka)
  - Custom event triggers

### **4. Ingress Traffic Control**

- Built-in ingress supports internal and external traffic routing
- Supports HTTP/HTTPS-based ingress for securely exposing services
- Fully compatible with Azure API Management for API gateways

### **5. Integrated Dapr Support**

- Dapr (Distributed Application Runtime) is built-in, enabling service-to-service communication, state management, pub/sub messaging, and secret management
- Helps developers build resilient and portable microservices

### **6. Secure and Managed Environment**

- Supports managed identity for authentication and access to other Azure services
- Secure connections to Azure Key Vault, Azure Monitor, and Application Insights
- Private networking with VNET integration

### **7. Flexible Deployment Options**

- Supports container images from Azure Container Registry (ACR), Docker Hub, or other registries
- Can be deployed via CI/CD pipelines, Bicep, Terraform, or Azure CLI

### **8. Built-in Logging & Monitoring**

- Native integration with Azure Monitor, Log Analytics, and Application Insights for real-time observability
- Provides structured logging, distributed tracing, and application performance monitoring

---

## Azure Spring Apps

Azure Spring Apps is a Spring Cloud service built on top of Azure Kubernetes Service (AKS), providing a fully managed microservices framework for deploying and scaling Spring Boot applications.

However, it is a premium enterprise service, making it relatively expensive, as it is designed for large-scale enterprise-grade applications requiring high availability, security, and scalability.

## Azure App Services

Microsoft Azure originally started with App Services as a Platform-as-a-Service (PaaS) offering, and it has since grown into one of the many services available in Azure. Azure App Services primarily focus on running web applications without requiring customers to manage the underlying server infrastructure.

In Azure App Services, you can run the following types of applications:

1. From Code
   - Deploy applications written in .NET, Java, Node.js, Python, PHP, and Ruby.
   - Supports CI/CD pipelines for automated deployments.
2. From Containers
   - Run web apps in Docker containers using Linux or Windows-based images.
   - Supports Azure Container Registry (ACR) and Docker Hub.
3. Static Web Apps
   - Ideal for Jamstack applications and front-end frameworks like React, Angular, and Vue.js.
   - Supports serverless APIs with Azure Functions.

### **Key Advantages of Azure App Services**

- Simplicity:
  - Setting up a web server is easy – you simply create an App Service resource and upload your website files via FTP, Git, or Azure DevOps.
- Built-in Scaling & Redundancy:
  - Supports Auto-Scaling, Load Balancing, and Geo-Redundancy for high availability.
  - Can scale up/down based on traffic demand.

## App Service Plans

Azure App Services are sold through an App Service Plan, which defines the quotas, functionality, and pricing of one or more App Services.

- The cost of an App Service is based on the chosen App Service Plan.
- The higher the scalability and functionality, the higher the cost.
- Pricing is determined by compute power (CPU, memory), storage, and networking capabilities.
- When you purchase an App Service Plan, you get a fixed amount of compute resources.
- Resources are distributed across all App Services running within that plan.
- Supports auto-scaling and manual scaling based on traffic demand.

The available App Service Plans summarized:

| App Service Plan | Scaling Options | Features | Pricing |
| --- | --- | --- | --- |
| Free (F1) | None | N/A | Free |
| Shared (D1) | None | Custom Domains | Low |
| Basic (B1; B2; B3) | Manual | Hybrid Connections, Custom Domains | Moderate |
| Standard (S1; S2; S3) | Auto-Scaling | Custom Domains, VNET integration, Custom Domains, SSL | Higher |
| Premium (P1V3; P2V3; P3V3) | Auto-Scaling | Custom Domains, VNET integration, Custom Domains, SSL | Premium |
| Isolated (I1; I2; I3 - ASE) | Auto-Scaling | Custom Domains, VNET integration, Custom Domains, SSL | Enterprise-Level |

As seen in the table above, for a production environment, it is highly recommended to choose at least the Standard Plan due to its advanced functionality.

### Deployment slots in App Services

Deployment slots in App Services are intended to create a test/acceptance environment within your App Service Plan. This allows you to roll out a new version of the application to this instance without impacting the production environment. It is also possible, using a "Virtual-IP," to swap the IP address of the production application and the test/acceptance application to test the app in a real-world scenario.

---

## Azure Functions

Azure Functions are scripts in Azure that can be executed based on a trigger/event or according to a schedule (e.g., every 5/15 minutes, daily, etc.). These functions are serverless and utilize Microsoft Azure’s infrastructure resources.

In practice, Azure Functions can perform actions such as:

- Turning virtual machines on/off according to a schedule
- Retrieving information from a server and transferring it via FTP/SCP
- Clean Azure Storage accounts based on rules

It is possible to run Azure Functions as part of an App Service Plan. However, the default option is based on consumption, meaning you only pay for the resources needed to run the function.

The scripting languages supported by Azure Functions are:

- C#
- JavaScript
- F#
- Java
- PowerShell
- Python
- TypeScript

---

## Azure Logic Apps

Azure Logic Apps are similar to Azure Functions, but instead of being based on code/scripts, they use a graphical interface. Like Azure Functions, they operate with triggers that execute an action.

Logic Apps function as a low-code/no-code solution, similar to Power Automate, which itself is based on Azure Logic Apps. Additionally, Logic Apps offer the ability to configure connectors with external applications and services.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/amc-module-8-application-services-and-containers-1224/jv-media-1224-41f2b2a0e962.png)

Examples of what you can do with Logic Apps:

- Send a monthly email report on the uptime of virtual machines
- Automate emails for monitoring purposes within Azure
- Execute Sentinel Playbooks

---

## Azure Static Web Apps

Azure Static Web Apps is a service for static, pre-defined web pages that are scalable but require minimal functionality. This is also the cheapest way to host a website in Microsoft Azure, with a paid option of €9 per month and a free option available for hobbyists.

This service does have limitations, as websites must be pre-defined. This means that the website cannot perform server-side calculations. Static Web Apps are therefore limited to the following technologies:

- HTML
- JavaScript
- CSS

However, it is possible to perform server-side calculations using Azure Functions, which can be added as an extension to a Static Web App.

---

## Azure Event Grid

Azure Event Grid is a fully managed event routing service that enables event-driven architectures by delivering events from various Azure services services such as AKS, ACI, App Services, Blobs and custom sources to event handlers or subscribers. It uses a publish-subscribe model, ensuring reliable, scalable, and real-time event delivery.

### **Key Features of Azure Event Grid**

- Event-driven: Enables real-time communication between services without polling.
- Fully managed: No need to set up or maintain infrastructure.
- Scalable: Handles millions of events per second.
- Reliable: Built-in retry policies ensure event delivery.
- Secure: Supports authentication and role-based access control (RBAC).
- Flexible event routing: Supports various event sources and destinations.

Some use cases of Azure Event Grid are:

- Storage Event Handling
  - Automatically trigger an Azure Function when a new file is uploaded to Azure Blob Storage.
- Serverless Workflows
  - Combine Event Grid with Logic Apps to create automated workflows, such as sending notifications when an event occurs.
- Kubernetes Event Monitoring
  - Collect AKS (Azure Kubernetes Service) events and send alerts or logs to a monitoring service.
- Automated Deployment Triggers
  - Notify a CI/CD pipeline when a new container image is pushed to Azure Container Registry (ACR).
- IoT Event Processing
  - Route IoT device telemetry data to a Stream Analytics service for processing.
- Audit and Security Alerts
  - Capture and forward Azure Security Center alerts to a SIEM (Security Information and Event Management) system.

---

## Summary

This chapter is very based on microservices and automation, this all with serverless applications. This minimizes attack surface and so increases security, availability and reliability of your services. For custom applications this works great.

However, some legacy systems and applications that require Windows Servers to run cannot be run on these serverless applications.

To go back to the navigation page: <https://justinverstijnen.nl/microsoft-azure-master-class-navigation/>

---

---

## End of the page 🎉

You have reached the end of the page. You can select a category, share this post on X, LinkedIn and Reddit or return to the blog posts collection page. Thank you for visiting this post.

If you think something is wrong with this post or you want to know more, you can send me a message to one of my social profiles at: <https://justinverstijnen.nl/about/>

[Go back to Blog](https://justinverstijnen.nl/blog/)

If you find this page and blog very useful and you want to leave a donation, you can use the button below to buy me a beer. Thank you in advance and cheers :)

[![](https://img.buymeacoffee.com/button-api/?text=Buy me a beer&emoji=🍺&slug=justinverstijnen&button_colour=FFDD00&font_colour=000000&font_family=Arial&outline_colour=000000&coffee_colour=ffffff)](https://www.buymeacoffee.com/justinverstijnen)

[![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/about-66/jv-media-66-36a3c69c96cb.png)](https://buymeacoffee.com/justinverstijnen)

The [terms and conditions](https://justinverstijnen.nl/terms-conditions/) apply to this post.

Page visitors:
No page-counter data available yet.
