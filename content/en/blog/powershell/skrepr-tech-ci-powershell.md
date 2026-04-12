---
title: "Skrepr Tech CI - PowerShell"
date: 2025-04-24
slug: "skrepr-tech-ci-powershell"
categories:
  - Powershell
tags:
  - Concepts
hidden: true
---
Dit is mijn Collective Intelligence voor mei 2025 over PowerShell. Ik ga hier wat leuke dingen over laten zien, zie de inhoud voor handige links naar de kopteksten.

Aan het einde heb ik nog een leuke praktijkopdracht waarin we een PowerShell module gaan installeren en uitvoeren.

Ik heb mijn best gedaan om de uitleg zo simpel maar duidelijk te geven, ook voor onze niet-technische mensen.

---

## Wat is PowerShell?

Powershell is een shell en script taal en sinds Windows 8/Server 2012 de onderliggende CLI van Windows. Eigenlijk alles in de grafische interface van Windows wordt door Powershell verwerkt, zoals te zien in onderstaande afbeelding:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/skrepr-tech-ci-powershell-1971/jv-media-1971-e591ec9a2438.png)

Klik op "Export configuration settings" en je krijgt:

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
# Zorg ervoor dat je PowerShell uitvoert als Administrator
# Installeer RSAT tools
Write-Host "Installing RSAT tools..."
Add-WindowsCapability -Online -Name "Rsat.RemoteAccess.Tools~~~~0.0.1.0"

# Installeer Remote Desktop Services tools
Write-Host "Installing Remote Desktop Services tools..."
Add-WindowsCapability -Online -Name "Rsat.RemoteDesktopServices.Tools~~~~0.0.1.0"

# Wacht tot de installatie voltooid is
Write-Host "De RSAT en Remote Desktop Services tools zijn geïnstalleerd."

# Optioneel: Controleer of de tools correct zijn geïnstalleerd
Write-Host "Controleren van geïnstalleerde tools..."
Get-WindowsCapability -Online | Where-Object {$_.Name -like "Rsat*" -or $_.Name -like "RemoteDesktopServices*"} | Format-Table -Property Name, State

{{< /card >}}

Ziet er leuk uit, maar wat kun je er nu eigenlijk precies mee en wat levert het gebruik van PowerShell jouw precies op?

- Automatiseren
- Uniforme configuraties
- Tijd
- Beveiliging

---

## Hoe werkt Powershell?

Microsoft heeft vanaf de oorsprong zijn best gedaan om de drempel voor het gebruik van Powershell zo laag mogelijk te maken. Vroeger met CMD en bij Linux zijn alle commando's gekozen op basis van wie de tool maakte. Met Powershell hebben ze hier uniformiteit in gemaakt.

Een Powershell commando ziet er daarom ook altijd als volgt uit:

***Werkwoord - Zelfstandig naamword***
*(verb - noun)*

Voorbeelden:

- Get-Item
- Install-WindowsFeature
- Test-NetConnection
- Write-Host

---

## Windows PowerShell vs. PowerShell

Tegenwoordig zijn er 2 versies van Powershell beschikbaar:

- Windows Powershell
- Powershell

Het verschil hierin is voornamelijk dat Windows Powershell alle commando's voor Windows bevat en de andere Powershell meer uniform is. Deze kan namelijk ook op Linux en Apple geinstalleerd worden.

---

## Commando's vs. Scripts

Nu kunnen we Powershell gebruiken als CLI taal waar we alle taken interactief moeten doen. Hiermee bedoelen we dat je alles zelf moet typen en eventueel een resultaat (output) van commando 1 in een comando 2 of zelfs 3 wil gaan gebruiken. Hiervoor moet je 3 regels typen en op enter klikken. Dit kost tijd en moeite.

Powershell is ook een script-taal en een script is hiermee precies zoals een film ook gemaakt wordt. Er wordt uitgedacht hoe een scene eruit ziet, wat er gebeurd, welke auto er crashed en wie die bestuurt, wie er dood gaat etc. Een Powershell script is niets anders, alleen wat gezelliger.

In een Powershell script kun je bijvoorbeeld alle gebruikers in een systeem ophalen en deze wijzigen. Stel je voor, een bedrijf krijgt naast een .nl domein ook een .com of .be domein en alle gebruikers moeten hierop ook te benaderen zijn.

Nu kun je ervoor kiezen om 500 gebruikers handmatig bij langs te gaan, of een simpel script te maken die dit voor je doet. Om je helemaal over de streep te halen om voor Powershell te gaan:

- **Handmatig**: 500 x 26 seconden is 13.000 seconden en ongeveer 3,5 uur werk
- **Script**: Inloggen 5 min, maken script: 25 min, testen 20 min, script 10 min en ongeveer 1 uur werk

Met dit voorbeeld hebben we dus 2,5 uur bespaard door Powershell te gaan gebruiken. Hoe complex ziet zo'n script er dan uit?

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
$allegebruikers     = Get-Mailbox
$nieuwedomeinalias  = "@justinverstijnen.be"

foreach ($user in $allegebruikers) {
  $primaryEmail = $user.PrimarySmtpAddress.ToString()
  $newAlias = $primaryEmail.Split('@')[0] + $nieuwedomeinalias
  Set-Mailbox $user.Identity -EmailAddresses @{Add=$newAlias} }
{{< /card >}}

Lijkt complex maar is redelijk simpel na de uitleg, toch?

---

## Variabelen, Strings en Booleans

Belangrijke componenten in Powershell zijn variabelen, strings en booleans. Vast wel eens van gehoord maar wat zijn het precies?

|  |  |  |
| --- | --- | --- |
| **Component** | **Extra uitleg** | **Voorbeeld** |
| Variabele | Een object die steeds anders kan zijn op basis van input of error/succes | $allegebruikers   $user   $resultaat |
| String | Een stuk tekst. Vaak gebruikt voor output om deze naar een variabele of nieuw commando te schrijven. | "info@justinverstijnen.nl"   "Succes"   "Error" |
| Boolean | Een waarde die waar of niet waar kan zijn | $true   $false |

---

## Scripts vs. Modules

Nu hebben we scripts en modules in Powershell. 2 begrippen die op elkaar lijken maar net iets anders zijn;

- **Script:** Een script is een enkele harde lijst met taken en zal Powershell altijd van A tot Z uitvoeren
- **Module:** Een module is een interactieve lijst met taken en kan zich aanpassen aan de gebruiker met eigen functies. Zo kun je zelf commando's maken met functions die weer onderliggend Powershell eigen commando's/scripts uitvoeren voor het resultaat.

De taal van een module ziet er ongeveer zo uit:

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
# Functie 1: Welkomstbericht
function Get-WelcomeMessage {
    param (
        [string]$Name
    )
    if ($Name) {
        return "Welkom, $Name!"
    } else {
        return "Welkom, onbekende gebruiker!"
    }
}

# Functie 2: Optellen van twee getallen
function Add-Numbers {
    param (
        [int]$Number1,
        [int]$Number2
    )
    return $Number1 + $Number2
}
{{< /card >}}

Een module moet altijd geinstalleerd worden in Powershell, en scripts kunnen direct vanaf een bestand uitgevoerd worden.

---

## Powershell Tools

Er zijn verschillende tools om Powershell scripts en modules te schrijven. Deze kunnen van simpel naar complex gaan en je bent vrij om te kiezen welke je wilt gebruiken. Ik raad zelf aan om Windows **Powershell ISE** of **VS Code** te gebruiken, dit vanwege de ingebouwde foutcorrectie en aanbevelingen die jouw code verbetert alsof je in Word een aantal spelvauten maakt;

Een aantal voorbeelden van gratis software;

- Windows Kladblok
- Notepad++
- Windows Powershell ISE (Integrated Scripting Environment)
- Visual Studio Code

---

## Praktijkvoorbeelden Powershell bij Skrepr Tech

Bij Skrepr Tech gebruik ik voor een paar dingen PowerShell om taken makkelijk uit te voeren en te automatiseren:

- AVD gebruikers Cameranu
  - Ik heb hier een script gemaakt om met 1 druk op de knop alle AVD gebruikers te exporteren naar een CSV/Excel bestand voor de facturatie
- Emailadressen toevoegen Cameranu
  - Ik heb een script gemaakt die elke nacht alle gebruikers ophaalt en het invoerveld "Email" invult
- Schijfopruiming diverse klanten
  - Bij een aantal klanten draait er een script op de server die eenmaal per week bepaalde mappen opschoont en bijvoorbeeld de laatste 90 versies bewaard
- AVD images maken
  - Ik gebruik bij het maken van AVD images een script die de machine compleet naar het Nederlands zet, de juiste tijdzone instelt en het optimalisatiescript uitvoert
- AVD images voorbereiden
  - Voor het voorbereiden van images, controleren op en verwijderen van pakketten die het voorbereiden verstoren
- Backup als de grafische interface niet werkt om verschillende redenen

---

## De JVCollectiveIntelligenceMay2025 Powershell module

Om een kleine hands-on demo te geven van Powershell heb ik speciaal voor deze CI een Powershell module gemaakt die te installeren is. Dit is niet moeilijk.

Om de module te installeren kun PowerShell starten op je Windows apparaat en de commando's invullen.

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/skrepr-tech-ci-powershell-1971/jv-media-1971-eb5a8dfdb79e.png)

Beide gearceerde versies op Windows kun je hiervoor gebruiken.

In elk zwart vakje op deze pagina heb je rechts bovenin een kopieer-knop waarmee je makkelijk vanuit dit venster de commando's kan kopieren en in PowerShell plakken. Om tekst te plakken in een PowerShell venster hoef je alleen maar in het venster de rechtermuisklik in te drukken. Na het plakken druk je op Enter en het commando wordt uitgevoerd.

Heb je een Apple apparaat? Balen voor jou. Je kan Powershell 7 dan hier downloaden: <https://learn.microsoft.com/en-us/powershell/scripting/install/installing-powershell-on-macos?view=powershell-7.5#installation-via-direct-download>

Let op: de werking op Mac is niet getest.

### Stap 1: De module installeren

Open Powershell en voer het volgende commando uit:

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
Install-Module JVCollectiveIntelligenceMay2025 -Scope CurrentUser
{{< /card >}}

Powershell zal nu vragen of je zeker weet of de module geïnstalleerd mag worden. Druk eenmaal of tweemaal op **y** en druk op Enter.

Dit installeert de module die ik gemaakt heb waarmee we wat leuke commando's kunnen uitvoeren die het verduidelijken wat Powershell doet op basis van de input.

### Stap 2: Uitvoeren toestaan

Standaard heeft PowerShell een zogeheten uitvoerings-restrictie. Deze zorgt ervoor dat een gebruiker niet zomaar van alles kan uitvoeren op de computer. Zie het als een toegangscontrole voordat je een gebouw in mag in het echte leven.

Deze kunnen we voor de tijd van onze CI tijdelijk uitschakelen met het volgende commando:

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
Set-ExecutionPolicy Unrestricted -Scope Process
{{< /card >}}

Dit schakelt de toegangscontrole tijdelijk uit voor alleen ons venster. Bij wegklikken van het venster staat deze controle weer aan.

### Stap 3: De module laden

Nu kunnen we echt beginnen met de module inladen. Zie dit als het openen van een Word bestand waarna je eraan kan werken.

Dit doe je met dit commando:

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
Import-Module JVCollectiveIntelligenceMay2025
{{< /card >}}

Als dit gelukt is zonder foutmeldingen, dan kunnen we de commando's van de module gebruiken.

Krijg je bij deze stap een foutmelding, roep dan even.

### Stap 4: De module testen

Laten we nu eens testen of de module succesvol ingeladen is:

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
Test-ModuleJVCI
{{< /card >}}

Als je nu een bericht voor je krijgt dat de module succesvol geladen is kunnen we beginnen. Wordt de module niet gevonden, dan is er iets mis en roep dan even.

### Stap 5: De module informatie verlenen

{{% alert color="info" %}}
Je mag er bij deze stap voor kiezen om niet je echte gegevens te gebruiken. Vul hier dan neppe informatie in, dit verandert verder niets aan de uitkomst.
{{% /alert %}}

Wanneer de module wel succesvol geladen is kun je het onderstaande commando uitvoeren. Powershell vraagt nu om je naam:

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
Set-NameJVCI
{{< /card >}}

PowerShell reageert nu terug met jouw ingevulde naam omdat je hem dit hebt verteld. Dit wordt opgeslagen in een variabele.

Daarna kun je het volgende commando invullen. Powershell vraagt nu om je geboortejaar:

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
Set-BirthYearJVCI
{{< /card >}}

Nu weet Powershell hoe oud je bent en kan hiermee verdere berekeningen uitvoeren.

Daarna kun je het volgende commando invullen:

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
Set-FavoriteColorJVCI
{{< /card >}}

Nu weet Powershell ook jouw favoriete kleur, en kan daardoor de tekst hierop aanpassen.

### Stap 6: De resultaten uitdraaien

Nu we PowerShell van alles over onszelf hebben verteld kunnen we dit uitdraaien. Dit doe je door het laatste commando uit te voeren:

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
Write-SummaryJVCI
{{< /card >}}

Je krijgt nu een overzicht met alles wat je hebt ingevuld, in jouw aangegeven favoriete kleur. Dit geeft weer wat je met Powershell onder andere zou kunnen doen. Informatie ophalen op basis van input, weergeven, dupliceren en berekeningen op uitvoeren.

Deze module geeft op een vrij simpele manier weer wat de mogelijkheden zijn van PowerShell, maar is wel rekening gehouden om dit zo snel en makkelijk mogelijk te doen. In echte gevallen zal een module of script veel uitgebreider zijn.

Bedankt voor het bijwonen van mijn CI, en de informatie blijft voorlopig beschikbaar op deze website. Mocht je nog een keer deze gids en de bijbehorende informatie willen volgen kan dat!

---

{{< ads >}}

{{< article-footer >}}
