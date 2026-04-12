---
title: "How to Export Active Directory (AD) users fast and easy"
date: 2024-11-14
slug: "how-to-export-active-directory-ad-users-fast-and-easy"
categories:
  - Powershell
tags:
  - Tools and Scripts
---
Sometimes we need to export all of our AD users. The one time for applying changes, sometimes for monitoring the inventory but often for licensing purposes.

At this page I will show you how to export all your AD users fast and easy.

---

---

## The Export AD users script:

For the fast pass, I uploaded the script to my Github page:

[Download script from GitHub](https://github.com/JustinVerstijnen/JV-ExportADUsers)

---

## How to export the AD users by hand

To export the users without using a script, navigate to your Active Directory management server and open up Powershell. We will do all the action the script above does, but then by hand and type in every command separately.

Type in the first command to ensure the correct module is loaded:

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
Import-Module ActiveDirectory
{{< /card >}}

Then we can execute the command to query all AD users:

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
$adusers = Get-ADUser -filter * -Properties UserPrincipalName,Mobile,Givenname,sn,name | select UserPrincipalName,Mobile,Givenname,sn,name
{{< /card >}}

This saves all the users in the $adusers variable. Now let's print this list:

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
$adusers
{{< /card >}}

This shows all users in the PowerShell window itself, but we are able to export this to a CSV file:

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
$adusers | Export-Csv "C:\Users\$env:USERNAME\Desktop\AD_Export.csv" -NTI -Delimiter ";"
{{< /card >}}

This gives us a nice and "Excel-ready" export of all the AD users. It is also very clean, but you can add or remove extra attributes from Active Directory from the second command.

For a complete list of all the attributes that can be used, visit [this Microsoft Learn article](https://learn.microsoft.com/en-us/powershell/scripting/learn/ps101/03-discovering-objects?view=powershell-7.5#active-directory).

---

## Summary

This page shows an easy way to export all your AD users in a great and readable way. It also has some possibilities for customization but it shows how to do it in the most simple way possible. I also included a automatic way and a manual/by hand way to learnexactly what happens.

Thank you for reading and I hope it was helpful.

### Sources

These sources helped me by writing and research for this post;

1. <https://learn.microsoft.com/en-us/powershell/module/activedirectory/get-aduser?view=windowsserver2025-ps#filter>
2. <https://learn.microsoft.com/en-us/powershell/scripting/learn/ps101/03-discovering-objects?view=powershell-7.5#active-directory>

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
