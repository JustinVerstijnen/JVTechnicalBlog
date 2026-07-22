---
title: "Microsoft Foundry"
date: 2025-01-10
slug: "microsoft-foundry-agent"
categories:
  - Microsoft Azure
tags:
  - Concepts
description: >
  When being introduced to Azure, I learned about tags very quickly. However, this is something you can use in practice but is no requirement to make stuff actually work. Now some years ahead in my Azure journey, I can recommend (at least) 10 ways to use them properly and to make them actually useful in your environment. I will explain these ways in this article.
build:
  render: always
  list: never
---

# Getting started with Microsoft Foundry: build a “one public website” Teams agent

If you’ve been looking at Microsoft Foundry and wondered: “How do we use this in a practical, safe way?”, here’s a simple starting point.

In this post I’ll show you how to build a **Microsoft Foundry agent** that can answer questions **only** from **one specific public website** (for example your support site). The agent runs in **Microsoft Teams**, so employees can ask questions in the place they already work.

---

## What this setup is (and why it’s useful)

**Microsoft Foundry Agent Service** is a managed platform for building, deploying, and scaling AI agents. [[1]]

The pattern we’ll build is:

Public website  
→ Grounding with Bing Custom Search (restricted to your domain)  
→ Microsoft Foundry agent (strict instructions)  
→ Microsoft Teams (publishing)

For the “one public website only” requirement, the key piece is **Grounding with Bing Custom Search**. It lets you ground responses using a configurable set of public web domains/subdomains, so you don’t have to rely on unrestricted web content. [[2]]

---

## Important limitation (please read)

This approach only works well when the website content is truly public.

The pages should be:
- Publicly reachable
- Searchable by Bing (so they can be found)
- Not hidden behind a login
- Not blocked by robots.txt
- Not only available inside a CMS/backend

If the information is private, internal, customer-specific, or behind authentication, you should not use this public-website grounding approach. Instead, use a private knowledge source (for example a controlled document source + a private indexing/search approach such as Azure AI Search), then ground the agent with that.

Also note: Grounding with Bing uses public web data, so it’s designed for publicly available information. [[3]]

---

## Recommended MVP

Build this first:

- A Teams agent that answers questions only from **one public website domain**

Use this setup:
- Microsoft Foundry Agent Service
- Grounding with Bing Custom Search
- one allowed website domain/path
- strict agent instructions
- Microsoft Teams publishing

---

## Step 1: Decide the website scope

Pick exactly which website or section the agent may use.

Start small. For example:
- `https://www.example.com/support`
- `https://www.example.com/faq`
- `https://www.example.com/knowledge-base`

Good idea for your first version:
- keep the allowed paths narrow (support, FAQ, knowledge base)

Avoid starting with:
- `https://www.example.com` (too broad → higher chance of irrelevant content)

---

## Step 2: Create or open a Microsoft Foundry project

1. Open **Microsoft Foundry** (Foundry portal).
2. Create a new project, or open an existing project.
3. Make sure you have a model deployed/available in the project.
4. Create a new agent.
5. Name it clearly.

Projects are how you organize work (agents, evaluations, files, and more) inside Foundry. [[4]]

If you’re not sure how to get started with projects + models, use the Foundry quickstart that covers setting up resources and a project connection. [[5]]

---

## Step 3: Add web grounding (restricted web access)

For this “one public website only” use case, don’t use unrestricted web search.

Use:
- **Grounding with Bing Custom Search**

Grounding tools are used to help agents retrieve public web data and include source attribution. [[6]]

At a high level, you’ll need:
- an Azure subscription
- permission to create the Grounding resource
- the Grounding with Bing Custom Search resource
- a connection between that resource and your Foundry project

---

## Step 4: Configure Bing Custom Search (domain/path allow-list)

Configure your Bing Custom Search so it only searches your allowed content.

Typical configuration concept:
- Allowed domain: `example.com`
- Optional allowed paths: `/support`, `/knowledge-base`, `/faq`

Recommended rule:
- Only allow the domains/paths you want the agent to use as sources.

Microsoft’s guidance for Bing Custom Search is that it grounds responses using a configurable set of public domains/subdomains, and it includes a Foundry portal configuration step to restrict content to what users care about. [[7]]

---

## Step 5: Create strict agent instructions (so it refuses when it can’t verify)

This is the part that makes your agent behave predictably.

Use instructions like this (English):

    You are a website support assistant.

    You answer questions only by using information from the configured website search source.

    Rules:
    - Use only the configured website as your source.
    - Do not answer from general knowledge when the website does not contain the answer.
    - If the answer cannot be verified from the website, say:
      “I cannot verify this from the available website information.”
    - Keep answers short and practical.
    - Include the source page or citation when available.
    - Do not invent prices, conditions, procedures, product specifications, dates, or contact details.
    - Answer in English unless the user asks in another language.

For a Dutch organization, use this refusal sentence:

    Ik kan dit niet verifiëren op basis van de beschikbare website-informatie.

Tip: If your website has many pages, also keep your answers short and point people to the specific source page when possible.

---

## Step 6: Test the agent in Microsoft Foundry (before publishing)

Before you publish to Teams, test inside Foundry.

Test questions that should be answerable from the website:
- “What services does the company offer?”
- “Where can I find support information?”
- “What does the website say about Microsoft 365?”
- “How can I contact support?”
- “What are the opening hours?”
- “Which products are mentioned on the website?”

Also test questions that should NOT be answerable from that public website:
- “What is the internal escalation process?”
- “What is the private customer SLA?”
- “What is the admin password?”
- “What does the company charge this customer?”
- “Can you give me information from the backend?”

Expected behavior:
- The agent answers only when it can verify from the allowed website content.
- If it can’t verify, it uses your refusal text.

---

## Step 7: Check source references (don’t allow “maybe” answers)

If your agent can include sources/citations, verify that it does.

Good:
- Clear answer + clear source page

Bad:
- “Probably …” or a guess without where it came from

If the agent gives answers without a clear grounding path, tighten your instructions and/or reduce the allowed scope so the tool returns more relevant pages.

---

## Step 8: Publish the agent to Microsoft Teams

After testing, publish.

In Foundry:
1. Open the agent.
2. Select **Publish**.
3. Choose the **Teams or Microsoft 365 Copilot** publishing option.
4. Fill in the required app information.

Microsoft documents that publishing connects your agent to Microsoft 365 Copilot and Microsoft Teams from the Foundry portal, and that it publishes the agent’s stable endpoint so users interact with a consistent agent entity. [[8]]

---

## Step 9: Test in Teams with a small group

Don’t roll out to everyone immediately.

Recommended test group: 3 to 5 users

Ask them to test:
- Can the agent find correct information?
- Does it cite the right source pages?
- Does it refuse questions that are not on the website?
- Does it stay inside your site scope (no “too broad” answers)?
- Are answers actually useful for normal employees?

Collect feedback for a few days, then expand gradually.

---

## Step 10: Improve the website content and/or scope (most problems are not “agent logic”)

If answers are bad, the issue is often one of these:

| Problem | Likely cause | Fix |
|---|---|---|
| Agent cannot find the page | Page not indexed or not publicly reachable | Check public access and visibility |
| Agent gives old information | Index/search content is outdated | Update website content and wait for refresh |
| Agent answers too vaguely | Website content is too short/unclear | Improve page text |
| Agent answers outside the site | Scope too broad | Tighten allowed domain/path |
| Agent can’t access the content | Page behind login | Use private knowledge sources instead |
| Agent gives wrong details | Outdated/conflicting website content | Clean up website pages |

---

## Example MVP scope (copy/paste style)

Example:

Website:
- `https://www.example.com`

Allowed content:
- Services pages
- FAQ pages
- Support pages
- Contact page
- Knowledge base articles

Excluded content:
- Old blog posts
- Outdated news articles
- Login-only pages
- Customer-specific information
- Internal procedures

---

## Example agent behavior

User asks:
- “What does the website say about Microsoft 365 support?”

Good agent answer:
- The website says that support includes the relevant topics your site lists.
- Source: the exact support page.

User asks:
- “What is the internal escalation process for priority 1 incidents?”

Good agent answer:
- “I cannot verify this from the available website information.”
(or Dutch refusal text)

This behavior is exactly what your strict instructions are meant to enforce.

---

## Security and compliance notes

This public-website grounding approach is suitable for:
- publicly available company information

Not recommended for:
- private customer data
- internal company procedures
- contracts
- sensitive pricing agreements
- HR information
- security documentation
- tenant-specific Microsoft 365 information
- anything behind a login

For private/sensitive information, use a private data architecture such as:
Private documents / SharePoint / CMS export  
→ private indexing/search (for example Azure AI Search)  
→ Microsoft Foundry agent  
→ Teams

Also remember that Foundry web grounding tools are designed for public web data. [[9]]

---

## Summary

Start simple: one public website domain, Grounding with Bing Custom Search, strict instructions, and Teams publishing. Test in Foundry first, verify refusals and source citations, and then expand scope only when the agent is reliable.

Thank you for reading this post and I hope it was helpful!

### Sources
These sources helped me by writing and research for this post;
1. https://learn.microsoft.com/en-us/azure/foundry/agents/overview
2. https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/tools/bing-tools
3. https://learn.microsoft.com/en-us/azure/foundry-classic/agents/how-to/tools-classic/bing-custom-search
4. https://learn.microsoft.com/en-us/azure/f://learn.microsoft.com/en-us/azure/foundry/agents/how-to/publish-copilot
6. https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/tools/web-overview
7. https://learn.microsoft.com/en-us/azure/foundry/tutorials/quickstart-create-foundry-resources
8. https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/manage-grounding-with-bing