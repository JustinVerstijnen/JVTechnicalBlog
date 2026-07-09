---
title: "Page title"
slug: "page-title"
date: 2026-07-09
tags:
- Step by Step guides
categories:
- Microsoft Azure
description: "Brief description of the goal of the guide in max 30 words."
---

## Introduction

Briefly explain what this post is about, who it is for, and what the reader will achieve.

---

## Text blocks

### Heading level 3

#### Heading level 4

##### Heading level 5

###### Heading level 6

Paragraph text with **bold text**, _italic text_, and a [link to documentation](https://example.com).

> This is a blockquote. Use this for short notes, quotes, or important context that should stand apart from normal text.

- Bullet point one
- Bullet point two
- Bullet point three

1. Numbered step one
2. Numbered step two
3. Numbered step three

---

## Image block

[![Image alt text](/images/example-image.png)](/images/example-image.png)

_Optional image caption_

---

## Table block

| Setting | Example value | Notes |
| --- | --- | --- |
| Tenant | Contoso | Replace with the customer or environment name. |
| Service | Microsoft Azure | Replace with the relevant service. |
| Status | Enabled | Replace with the actual status. |

---

## Buttons

<a class="btn btn-primary btn-lg" href="/docs/" target="_blank" rel="noreferrer">Read the documentation</a>

<a class="btn btn-primary" href="/blog/">Go back to Blog homepage</a>

<a class="btn btn-secondary" href="/docs/" target="_blank" rel="noreferrer">Secondary button</a>

<a class="btn btn-outline-primary" href="/docs/" target="_blank" rel="noreferrer">Outline primary button</a>

<a class="btn btn-primary" href="https://github.com/example/repository" target="_blank" rel="noreferrer">View on my GitHub page</a>

---

## Docsy code blocks

{{< card code=true header="**PowerShell**" lang="powershell" >}}
Get-Command
{{< /card >}}

{{< card code=true header="**Bash**" lang="bash" >}}
echo "Hello world"
{{< /card >}}

{{< card code=true header="**Azure CLI**" lang="bash" >}}
az account show
{{< /card >}}

{{< card code=true header="**JSON**" lang="json" >}}
{
  "setting": "value",
  "enabled": true
}
{{< /card >}}

{{< card code=true header="**HTML**" lang="html" >}}
<section class="custom-block">
  <h2>Custom HTML example</h2>
  <p>Edit this HTML code block.</p>
</section>
{{< /card >}}

{{< card code=true header="**Plain text**" lang="text" >}}
Use this block for plain text, logs, command output, or configuration snippets without syntax highlighting.
{{< /card >}}

---

## Docsy raw HTML block

<section class="custom-block">
  <h2>Custom HTML</h2>
  <p>Edit this raw HTML block.</p>
</section>

---

## Docsy alert blocks

{{% alert title="Info" color="info" %}}
This is an info alert block.
{{% /alert %}}

{{% alert title="Warning" color="warning" %}}
This is a warning alert block.
{{% /alert %}}

{{% alert title="Failure" color="danger" %}}
This is a failure block.
{{% /alert %}}

{{% alert title="Success" color="success" %}}
This is a success block.
{{% /alert %}}

---

## Docsy page info

{{% pageinfo color="primary" %}}
This page contains extra context.
{{% /pageinfo %}}

---

## Docsy tabs

{{< tabpane text=true >}}
  {{% tab header="Step 1" %}}
  Content for step 1.
  {{% /tab %}}
  {{% tab header="Step 2" %}}
  Content for step 2.
  {{% /tab %}}
{{< /tabpane >}}

---

## Docsy cover

{{< blocks/cover title="Welcome" height="auto td-below-navbar" color="primary" >}}
Write your hero text here.
{{< /blocks/cover >}}

---

## Docsy section

{{< blocks/section color="light" type="container" >}}
## Section title

Write your section content here.
{{< /blocks/section >}}

---

## Docsy quiz

{{< quiz >}}
{
  "intro": "Answer these question(s) to test your understanding of this post. Your answers are not saved or sent anywhere; this is simply a personal knowledge check. If you refresh the page, your answers will be cleared.",
  "questions": [
    {
      "question": "Add your question here",
      "reference": "See the section: Section title",
      "referenceUrl": "#section-title",
      "answers": [
        {
          "text": "Correct answer",
          "correct": true,
          "message": "Correct! This is the right answer."
        },
        {
          "text": "Incorrect answer",
          "correct": false,
          "message": "Incorrect. Review the referenced section and try again."
        }
      ]
    }
  ]
}
{{< /quiz >}}

---

## Summary

Short summary of the post and what the organization wins using the information in this post.

### Sources

1. Add links to official documentation sources here.

{{< ads >}}

{{< article-footer >}}
