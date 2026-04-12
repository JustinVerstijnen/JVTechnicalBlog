---
title: "AMC - Module 9: Databases &amp; AI"
date: 2025-03-13
slug: "amc-module-9-databases-ai"
categories:
  - Azure Master Class
tags:
  - AI Generated Content
  - Concepts
description: >
  In this module we will explore various possibilities of Databases and AI in Microsoft Azure.
---
In this we will explore various possibilities of Databases and AI in Microsoft Azure.

---

---

## Types of data and structures

Data in general can be stored in different ways for various purposes.

- **Relational:** Relational data consists of rows and columns following a predefined schema. The schema is represented as a table, which is essentially a type of spreadsheet where the rows contain entities and the columns store properties. For example, in an online webshop, orders would be represented as rows (entities), while columns would contain data such as the order ID, customer address, timestamp, payment method, etc.
  - Examples: SQL Server, MySQL, PostgreSQL
- **Non-relational:** Non-relational data is less structured, such as a document or a JSON file. However, it is self-descriptive, meaning the file itself makes it clear how the data is stored.
  - Examples: NoSQL, MongoDB, Gremlin, Cosmos DB
- **Unstructured:** Unstructured data consists of various file types where the structure is not clearly defined.
  - Examples:.docx, .xlsx, .jpg, .mp4 and other standalone files

---

## Databases in Microsoft Azure

In Microsoft Azure, there are different ways to deploy a database where each type has it's own charasteristics and requirements:

- Microsoft SQL-based
- Azure Database for PostgreSQL/MySQL/MariaDB
- Azure Cosmos DB

We will take a further look into each type of database and the features there.

---

### Microsoft SQL-based

These SQL solutions are all based on the Microsoft SQL protocol. This means they all have support to replace the installation based SQL server and talk with the same protocol. However, note that some applications may not support all of those options.

#### SQL Server on a Virtual Machine (IaaS)

It is possible to build an SQL database within a virtual machine. This provides a high level of compatibility, but as a customer, you are responsible for all aspects from the operating system onwards, including security, availability, backups, disaster recovery, updates, and performance tuning. It is possible to install an extension for the virtual machine, which allows Azure to monitor, back up, patch, and manage the SQL Server within the VM.

This option has the most supported 3rd party solutions because it is not very different from an on-premises server with SQL installed.

#### **Azure SQL Database (PaaS)**

In Microsoft Azure, you can create a serverless SQL Server, where Microsoft manages the host, and you, as the customer, only manage the database itself. This service can be deployed in four options:

- Full PaaS
- Serverless
- Single Database
- Elastic Pool

After creating a Azure SQL server with an Database on it, you can connect with your applications to the database. Table level changes has to be done through a management computer with the SQL Management Tools installed.

This option has the least generic support with using 3rd party applications, but this has increased substantially.

#### Azure SQL Managed Instance (PaaS)

With Azure SQL Managed Instance, Microsoft provides a managed virtual machine, but you do not need to manage the VM itself. Your only concern is the data within the database and its data flow. A managed instance also comes with a dedicated IP address in your virtual network.

You can manage the database on table-level with the Microsoft SQL Management Tools

#### Azure SQL Hyperscale

Azure SQL Hyperscale is a Microsoft Azure service that provides an SQL Server with high performance and scalability, designed for demanding workloads requiring rapid scaling. This option is comparable with Azure SQL but at a higher cost and a better SLA.

---

### Azure Database for PostgreSQL/MySQL/MariaDB

Azure also offers options for open-source database software. These are the following solutions, but hosted and managed by Microsoft:

- PostgreSQL
- MySQL
- MariaDB

These are mostly for custom applications and Linux based solutions.

### Azure Cosmos DB

Azure Cosmos DB is a cloud-focused database solution designed for global distribution. It supports multiple regions with replication options that you can configure according to your needs. It also is a NoSQL database and supports multiple Database models which may not be supported on the other options.

Some charasteristics about Azure Cosmos DB:

- **Globally Distributed:** Supports multi-region replication with low-latency access.
- **Fully Managed:** Serverless and PaaS-based, with no infrastructure management required.
- **Built-in Indexing:** Automatically indexes all data for fast queries without manual tuning.
- **Guaranteed Performance:** Offers 99.999% availability with low latency (single-digit milliseconds).
- **Practical Cases:** Ideal for IoT, real-time analytics, e-commerce, gaming, and AI-powered applications

---

## Database Encryption in Azure

All databases can be encrypted using either a Microsoft-managed key or a customer-managed key.

By default, Microsoft-managed keys provide encryption for databases without requiring user intervention. However, customer-managed keys (CMK) allow organizations to have full control over encryption, offering additional security and compliance benefits.

### Encryption Options in Azure Databases

1. **Transparent Data Encryption (TDE)**
   - Encrypts data at rest automatically.
   - Protects against unauthorized access to storage.
   - Works without requiring application changes.
2. **Always Encrypted**
   - Ensures end-to-end encryption, so even database administrators cannot view sensitive data.
   - Uses client-side encryption with keys stored externally.
3. **Data Masking**
   - Dynamically obscures sensitive data in query results.
   - Used to protect personal data such as credit card numbers, email addresses, and phone numbers.
4. **TLS Encryption for Data in Transit**
   - Encrypts all data transfers between the database and the client using Transport Layer Security (TLS).
   - Protects against man-in-the-middle (MITM) attacks and ensures secure connections.

### Customer-Managed Keys (CMK) for Database Encryption

The primary use-case of customer managed keys is to let the customer have full control over the key lifecycle. This means you can adjust the encryption standard and rotation to your needs. Some companies require this or are bound within some regulations that require some of these features.

A summary of the advantages of Customer-managed keys

- Create, rotate, disable, or revoke keys at any time.
- Ensure compliance with security regulations such as GDPR, HIPAA, and ISO.
- Enforce strict access control, limiting who can view or modify encryption settings.
- Monitor key usage using Azure Security Center and Key Vault logs.

This level of control is particularly useful for finance, healthcare, and government sectors, where data privacy and regulatory compliance are critical.

---

## Data Warehouse & Analytics with Azure Synapse

Azure offers Azure Synapse as a data warehouse and analytics solution. It is a fully managed service that enables big data processing, data integration, and real-time analytics. Azure Synapse allows users to query and analyze large datasets using SQL, Spark, and built-in AI capabilities. It integrates seamlessly with Azure Data Lake, Power BI, and Azure Machine Learning for advanced analytics and visualization. The platform supports both on-demand and provisioned compute resources, optimizing performance and cost. With built-in security, role-based access control, and encryption, Azure Synapse ensures data privacy and compliance.

### Practice example

A cool practice example of Azure Synapse is as follows:

A global e-commerce company wants to analyze customer behavior, sales trends, and supply chain efficiency. Here comes Azure Synapse into play and can solve the following challenges:

- Ingest data from point-of-sale (POS) systems, online transactions, and customer reviews into Azure Synapse
- Use SQL and Spark analytics to identify shopping patterns and predict inventory needs
- Integrate with Power BI to create real-time sales dashboards

The practical outcome is that all live data from the databases are ingested into human-readable dashboards with Power BI to analyze and find trends for the future.

---

## Artificial Intelligence

In 2025, you must heard of the term Artificial Intelligence (AI) and Azure has not missed the boat.

AI stands for Artificial Intelligence, a term used to describe the ability of computers to make predictions, calculations, and assessments, mimicking human thought processes. Machine Learning is a subset of AI, where the system learns from input data to improve its performance over time.

Azure offers Artificial Intelligence services in multiple areas, including the following:

- **Azure Cognitive Services**: Azure Cognitive Services is a service in Azure for developing AI-powered solutions. The following options are available within a Cognitive Services workspace.
- **Anomaly Detection**: Detects irregularities in data or unusual patterns, which can help identify fraud, system failures, or security threats.
- **Computer Vision**: Enables visual processing capabilities, such as image recognition, object detection, and text extraction from images. Microsoft’s Seeing AI app helps visually impaired users identify objects and surroundings.
- **Natural Language Processing (NLP)**: Allows AI to understand, interpret, and process spoken and written language, enabling applications such as chatbots, voice assistants, and text analytics.
- **Knowledge Mining**: Extracts valuable information from large volumes of unstructured data, helping build a searchable knowledge base from documents, images, and databases.

### Anomaly detection

Anomaly Detection is a term in AI that can detect inconsistencies in data or find unusual patterns, which may indicate fraud or other causes.

- **Example 1:** In motorsports, Anomaly Detection can be used to identify a mechanical problem before it becomes critical.
- **Example 2:** An application that monitors an automated production line and can detect errors at different time intervals.

Different actions can be performed on the “anomalies” that this service can detect, such as sending a notification or executing an action/script to resolve the issue.

### Computer Vision

Computer Vision is a part of AI that can perform visual processing. Microsoft, for example, has the Seeing AI app, which can inform blind or visually impaired people about things around them.

It can perform tasks like:

- Describe an image in one sentence with a maximum of 10 words
- Read aloud text that you scan or photograph
- Read out currency
- Scan barcodes and provide information about the product
- Recognize people

### Natural Language Processing (NLP)

Natural Language Processing is the part of Azure AI that can understand and recognize spoken and written language. This can be used for the following applications:

- Analyzing and interpreting text in documents, emails, and other sources
- Interpreting spoken language and providing responses
- Automatically translating spoken or written sentences between languages
- Understanding commands and executing associated actions

A great example of an AI application combined with the Natural Language Processing feature is Starship Commander. This is a VR game set in a futuristic world. The game uses NLP to provide players with an interactive experience and to respond to in-game systems. Examples include:

- The game reacts to the player, allowing the player to speak with characters in the game
- The game responds personally to what the player says to the in-game characters

### Knowledge Mining

Knowledge mining is a term used to describe the process of extracting information from large volumes of data and unstructured data to build a searchable knowledge base.

Azure offers a service called Azure Cognitive Search. This solution includes tools to build an index, which can be used for internal use or made searchable through a secure internet-facing server.

With this approach, Azure can process images, extract content, or retrieve information from documents. A great example of this concept is Microsoft 365 Copilot.

---

## Artificial Intelligence Guiding Principles

Microsoft has established several guidelines and recommendations for implementing and handling AI solutions to ensure the are ethically responsible:

- **Fairness**:
  - AI must not discriminate and should ensure fairness for all users.
  - Example: A machine learning model approving loans should not consider gender, ethnicity, or religion.
- **Reliability and Safety**:
  - AI systems must be reliable and safe to avoid harmful consequences.
  - Example: AI used in autonomous vehicles or medical diagnosis must be rigorously tested before deployment.
- **Privacy and Security**:
  - AI solutions must protect sensitive personal data and respect privacy regulations.
  - Even after deployment, data security and privacy monitoring should continue.
- **Inclusiveness**:
  - AI should be beneficial to everyone, regardless of gender, ethnicity, or physical accessibility.
  - It should support and enhance human capabilities rather than exclude certain groups.
- **Transparency**:
  - AI systems must be understandable and transparent.
  - Users should be aware of how the AI works, its purpose, and its limitations.
- **Accountability**:
  - Humans remain responsible for AI decisions and outcomes.
  - Developers must follow ethical frameworks and organizational principles to ensure responsible AI usage.

## Machine Learning

Machine Learning is a term used to describe software that learns from the data it receives. It is considered the foundation of most AI solutions. To build an intelligent solution, Machine Learning is often the starting point, as it allows the system to be trained with data and make predictions or decisions.

### **Examples of Machine Learning in Practice**

- **Example 1:** After analyzing 15 images of apples, the software can recognize an apple. By adding more images, it can determine how ripe or rotten an apple is with a certain percentage of accuracy. In a production/sorting process, this can be used to automatically classify apples as B-grade and filter them accordingly.
- **Example 2:** If multiple photos of a particular flower species are imported, the software can identify the flower in different images or through cameras.

### **Azure Machine Learning Capabilities**

- **Automated Machine Learning:** Allows non-experts to quickly create a machine learning model using data.
- **Azure Machine Learning Designer:** A graphical interface for no-code development of machine learning solutions.
- **Data and Compute Management:** A cloud-based storage solution for data analysts to run large-scale experiments.
- **Pipelines:** Enables data analysts, software developers, and IT specialists to define pipelines for model training and management tasks.

### **Two Types of Machine Learning Outcomes**

- **Regression:** Used to predict a continuous value, such as daily sales numbers, inventory forecasting, or monthly/yearly revenue.
- **Classification:** Used to categorize values, such as weather predictions or diagnosing medical conditions.

## Azure Machine Learning Studio

Azure has a dedicated management tool for Machine Learning, available at <https://ml.azure.com>.

In Machine Learning Studio, you need to create a workspace. There are four types of compute resources available for your workspace:

- **Compute Instances**: Development environments that data analysts can use to work with data and models.
- **Compute Clusters**: Clusters of virtual machines for scalability and on-demand processing.
- **Inference Clusters**: Used for running predictive services that support your models.
- **Attached Compute**: Enables connections to existing Azure compute resources, such as VMs or Databricks.

---

## Summary

In Azure, the possibilities are endless in terms of Databases and AI are almost limitless. I hope i gave a good understanding of all the services and features possible.

Thank you for reading this page.

To go back to the navigation page: <https://justinverstijnen.nl/microsoft-azure-master-class-navigation/>

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
