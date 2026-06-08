---
title: "Getting started with GitHub Pages"
date: 2026-03-19
slug: "getting-started-with-github-pages"
categories:
  - Github
tags:
  - Concepts
  - Step by Step guides
  - Knowledge check
description: >
  With GitHub Pages, we can host some free websites for personal use. This is really great as we mostly already use GitHub to store our code and assets for websites. The website you see now is also hosted on GitHub Pages. In this guide, I will explain some of the advantages of GitHub Pages, and how to get started by using the service. Let's dive into it!
---

## Requirements

- A GitHub account (free)
- A domain name for your website, or you can use the default domain name of GitHub
  - `youraccount.github.io`
- A template website to upload to your domain name
- Some basic knowledge about websites and DNS

---

## What is GitHub Pages?

GitHub Pages allows you to host a static website directly from a GitHub repository. This can be done without managing a server, infrastructure, or hosting provider. The only thing you do is create a repository, upload a website, and optionally connect it to a domain name of your choice. We can compare this to Azure Static Web Apps if you are familiar with that.

GitHub Pages supports static websites, which means it can only do frontend code like:

- HTML
- CSS
- JavaScript
- Markdown

You cannot host complex websites with PHP, APIs, Node.js, or Python, or other complex code. For that, I would advise using Azure or your own hosting service.

---

## Step 1: Creating a repository

To start hosting a website on GitHub, we need to create a repository. This is a space where we place all code used for a certain solution, like frontend code and assets. This will be clear in a few minutes.

Open GitHub at <https://github.com/> and log in to your account.

Now in the top-right corner, click on the "+" and create a new repository.

[![jv-media-7057-71544fa6f0c0.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/getting-started-with-github-pages-7057/jv-media-7057-71544fa6f0c0.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/getting-started-with-github-pages-7057/jv-media-7057-71544fa6f0c0.png)

Now give the repository a name and description.

[![jv-media-7057-336ab69806c6.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/getting-started-with-github-pages-7057/jv-media-7057-336ab69806c6.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/getting-started-with-github-pages-7057/jv-media-7057-336ab69806c6.png)

Now the creation of the repository is finished.

---

## Step 2: Uploading the template site

I will create a template site with a Rick Roll meme on it, to make the guide a little bit fun. This is a very simple website with a GIF and sound which you can download and also use. You can also choose to run your own website code of course.

Now finish the repository creation wizard. Then click on uploading some files.

[![jv-media-7057-3727b98ada13.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/getting-started-with-github-pages-7057/jv-media-7057-3727b98ada13.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/getting-started-with-github-pages-7057/jv-media-7057-3727b98ada13.png)

Download the files from my example repository:

[Download template site from my GitHub](https://github.com/JustinVerstijnen/JV-RickRoll)

Click "Code" and then click "Download ZIP".

[![jv-media-7057-156c0dd5d8c0.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/getting-started-with-github-pages-7057/jv-media-7057-156c0dd5d8c0.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/getting-started-with-github-pages-7057/jv-media-7057-156c0dd5d8c0.png)

Then upload these files into your own repository.

[![jv-media-7057-7547619b0106.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/getting-started-with-github-pages-7057/jv-media-7057-7547619b0106.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/getting-started-with-github-pages-7057/jv-media-7057-7547619b0106.png)

Your repository should have those three files in the root/main branch now:

[![jv-media-7057-4cf9caf82354.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/getting-started-with-github-pages-7057/jv-media-7057-4cf9caf82354.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/getting-started-with-github-pages-7057/jv-media-7057-4cf9caf82354.png)

---

## Step 3: Enable GitHub Pages

Now we have prepared our repository to host a website, so we can enable the GitHub Pages service. In the repository, go to "Settings":

[![jv-media-7057-db1042e80776.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/getting-started-with-github-pages-7057/jv-media-7057-db1042e80776.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/getting-started-with-github-pages-7057/jv-media-7057-db1042e80776.png)

Then go to "Pages".

[![jv-media-7057-41c9ddafdcce.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/getting-started-with-github-pages-7057/jv-media-7057-41c9ddafdcce.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/getting-started-with-github-pages-7057/jv-media-7057-41c9ddafdcce.png)

We can now build the website by selecting the branch `main` and finishing by clicking "Save".

[![jv-media-7057-c5418618e94d.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/getting-started-with-github-pages-7057/jv-media-7057-c5418618e94d.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/getting-started-with-github-pages-7057/jv-media-7057-c5418618e94d.png)

After waiting a few minutes, the website will be up and running with a `github.io` link. In the meantime, you can continue with Step 4.

---

## Step 4: Linking a custom domain to your GitHub Page

In the meantime, the page will be built, and we can link a custom domain to our repository. You can choose to use the default `github.io` domain, but a custom domain is more scalable and more professional.

On the same blade where you ended Step 3, fill in your custom domain. This can be a normal domain or subdomain. In my case, I will use a subdomain.

[![jv-media-7057-d19da0116b59.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/getting-started-with-github-pages-7057/jv-media-7057-d19da0116b59.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/getting-started-with-github-pages-7057/jv-media-7057-d19da0116b59.png)

Now we have to do a simple DNS change in our domain, linking this name to your GitHub so the whole world knows where to find your page. Head to the DNS hosting provider of your domain and create a CNAME record.

In my case, I created this CNAME record:

| Type record | Name     | Destination                    |
|-------------|----------|--------------------------------|
| CNAME       | rickroll | justinverstijnen.github.io.    |

Make sure to end the destination with a trailing dot `.`. This is required because it is an external domain in the context of your own domain.

[![jv-media-7057-303e0fba36c8.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/getting-started-with-github-pages-7057/jv-media-7057-303e0fba36c8.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/getting-started-with-github-pages-7057/jv-media-7057-303e0fba36c8.png)

The TTL does not really matter. I stuck to the best practice of 60 minutes / 1 hour.

Save your DNS settings and wait for a few minutes. Heading back to GitHub, you will see this in the meantime:

[![jv-media-7057-9ae2180f652a.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/getting-started-with-github-pages-7057/jv-media-7057-9ae2180f652a.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/getting-started-with-github-pages-7057/jv-media-7057-9ae2180f652a.png)

Keep this page open. Then after waiting some minutes, and possibly getting yourself a coffee, you will see a notification that the website is up and running and live:

[![jv-media-7057-e68027be8ea6.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/getting-started-with-github-pages-7057/jv-media-7057-e68027be8ea6.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/getting-started-with-github-pages-7057/jv-media-7057-e68027be8ea6.png)

---

## Step 5: Enabling HTTPS

After the custom domain is successfully validated and configured, we need to enable HTTPS for a secure transfer of data to our site. Otherwise users can get this error when visiting the website:

[![jv-media-7057-f4dd9f174b41.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/getting-started-with-github-pages-7057/jv-media-7057-f4dd9f174b41.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/getting-started-with-github-pages-7057/jv-media-7057-f4dd9f174b41.png)

In the GitHub Pages blade, we have to wait for GitHub linking a certificate to your new website. I have seen cases where this takes a few minutes but also up to a few hours.

[![jv-media-7057-73dffb5abca1.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/getting-started-with-github-pages-7057/jv-media-7057-73dffb5abca1.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/getting-started-with-github-pages-7057/jv-media-7057-73dffb5abca1.png)

After this is done, we can check this checkmark on the GitHub Pages blade:

[![jv-media-7057-de324a01351b.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/getting-started-with-github-pages-7057/jv-media-7057-de324a01351b.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/getting-started-with-github-pages-7057/jv-media-7057-de324a01351b.png)

[![jv-media-7057-3019966d219a.png](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/getting-started-with-github-pages-7057/jv-media-7057-3019966d219a.png)](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/getting-started-with-github-pages-7057/jv-media-7057-3019966d219a.png)

Now the site is fully up and running and secured. Yes, even if we are hosting a meme.

---

## Step 6: Testing the page

After waiting for all the preparations to complete, we can finally test our page on the internet. Go to your custom domain in your favorite browser and test if everything works:

[Watch the demo video](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/getting-started-with-github-pages-7057/jv-media-7057-c52b1efb3407.mp4)

It looks like we are ready and done :).

---

## Knowledge check

{{< quiz >}}
{
  "intro": "Answer these questions to test your understanding of this post. Your answers are not saved or sent anywhere; this is simply a personal knowledge check. If you refresh the page, your answers will be cleared.",
  "questions": [
    {
      "question": "What type of website can you host with GitHub Pages?",
      "reference": "See the section: What is GitHub Pages?",
      "referenceUrl": "#what-is-github-pages",
      "answers": [
        {
          "text": "Complex websites with PHP, APIs, Node.js or Python",
          "correct": false,
          "message": "Incorrect. GitHub Pages is meant for static websites and does not support backend code like PHP, APIs, Node.js or Python."
        },
        {
          "text": "Static websites with frontend code like HTML, CSS, JavaScript and Markdown",
          "correct": true,
          "message": "Correct! GitHub Pages is designed to host static websites directly from a GitHub repository."
        },
        {
          "text": "WordPress websites with a database",
          "correct": false,
          "message": "Incorrect. GitHub Pages does not host WordPress websites with a database."
        }
      ]
    },
    {
      "question": "Which DNS record is used in this guide to link a custom subdomain to GitHub Pages?",
      "reference": "See the section: Linking a custom domain to your GitHub Page",
      "referenceUrl": "#step-4-linking-a-custom-domain-to-your-github-page",
      "answers": [
        {
          "text": "MX record",
          "correct": false,
          "message": "Incorrect. An MX record is used for email routing, not for linking a GitHub Pages website."
        },
        {
          "text": "TXT record",
          "correct": false,
          "message": "Incorrect. A TXT record can be used for verification or policies, but this guide uses a CNAME record for the custom subdomain."
        },
        {
          "text": "CNAME record",
          "correct": true,
          "message": "Correct! The guide links the custom subdomain to GitHub Pages with a CNAME record."
        }
      ]
    }
  ]
}
{{< /quiz >}}

---

## Summary

GitHub Pages provides a simple and reliable way to host static websites for free. It integrates directly with Git, requires no server maintenance, and supports custom domains with HTTPS.

You can easily host documentation, portfolios, memes, and lightweight projects, and it offers a practical hosting solution without added complexity. If backend functionality is required, you will need to combine it with an external service or choose an alternative hosting platform, like Microsoft Azure or AWS.

Thank you for visiting my website and I hope it was helpful.

### Sources

These sources helped me with writing and research for this post:

1. <https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site>
2. <https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/about-custom-domains-and-github-pages>

{{< ads >}}

{{< article-footer >}}
