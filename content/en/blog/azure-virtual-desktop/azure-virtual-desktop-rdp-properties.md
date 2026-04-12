---
title: "Azure Virtual Desktop RDP Properties"
date: 2025-11-27
slug: "azure-virtual-desktop-rdp-properties"
categories:
  - Azure Virtual Desktop
tags:
  - Concepts
description: >
  In this post, we will be looking at the most popular different RDP Properties we can use in Azure Virtual Desktop.I will be talking about...
---
In this post, we will be looking at the most popular different RDP Properties we can use in Azure Virtual Desktop.

I will be talking about local PC's and remote PC's alot, where the remote PC is of course the Azure Virtual Desktop host and the local PC is the device you can physically touch.

---

## What are RDP properties?

RDP properties are specific settings to change your RDP experience. This can be to play sound on the remote or local PC, enable or disable printer redirection, enable or disable clipboard between computers and what to do if connection is lost.

In the previous years, this was also the case for normal RDP files or connections to Remote Desktop Services, but Azure Virtual Desktop brings this to a nice and centralized system which we can change to our and our users' preference.

---

## How to configure RDP properties

The 3 most popular RDP properties which I also used a lot in the past are these below.

### Clipboard redirection

*redirectclipboard:i:0*

This setting enables or disables if we are allowed to use the clipboard between the local PC and the remote PC. We can find this on the tab "Device redirection":

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-virtual-desktop-rdp-properties-4401/jv-media-4401-e9aca44e07ad.png)

The default option is "disabled", so text and files are not transferable between computers. Enabling this means that users this can do, but we trade in some security. We can configure this in the Azure Portal GUI or by changing the setting on the "Advanced Settings" tab.

### Display RDP connection bar

*displayconnectionbar:i:0*

We can hide the RDP connection bar by default for users. They can only bring it up with the shortcut "CTRL+ALT+HOME". This makes the user experience a bit better as they don't have that connection bar in place for the whole session. By default, this option is enabled, so 1.

There is no way to configure this in the GUI, only through the advanced settings. This also doesn't have official AVD support but can confirm it works like expected.

### Drive redirection

*drivestoredirect:s:dynamicdrives*

Changing the drive redirection setting ensures that drives are only redirected when you want this. We can use the option "DynamicDrives" which only redirects drives that are connected after the RDP session is connected.

## My most used RDP settings

My full and most used configuration is here:

{{< card code=true header="**POWERSHELL**" lang="powershell" >}}
audioqualitymode:i:2;displayconnectionbar:i:0;drivestoredirect:s:dynamicdrives;usbdevicestoredirect:s:*;redirectclipboard:i:0;redirectprinters:i:1;audiomode:i:0;videoplaybackmode:i:1;devicestoredirect:s:*;redirectcomports:i:1;redirectsmartcards:i:1;enablecredsspsupport:i:1;redirectwebauthn:i:1;use multimon:i:1;enablerdsaadauth:i:0;autoreconnection enabled:i:1;audiocapturemode:i:1;camerastoredirect:s:*;screen mode id:i:2
{{< /card >}}

Mostly the default configuration, but I like the Connection bar hided by default.

---

## The location to change RDP properties

We can find the RDP properties in the hostpool of your environment, and then on "RDP properties":

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-virtual-desktop-rdp-properties-4401/jv-media-4401-5784a654d692.png)

We can find the advanced options at the "Advanced" page:

![](https://sajvwebsiteblobstorage.blob.core.windows.net/blog/azure-virtual-desktop-rdp-properties-4401/jv-media-4401-a959f4d87150.png)

---

## Full list of RDP properties

Here is a list with all RDP properties published, with the support for Azure Virtual Desktop and RDP files considered.

All RDP options are in the convention: *option:type:value*

You can search through the list with the search button, and support for AVD and seperate .RDP files is added.

RDP Settings Table

| Property | Type | Value (by default) | Support AVD | Support RDP | Description |
| --- | --- | --- | --- | --- | --- |
|
| `administrativesession` | i | 0 | No | Yes | Connect to the administrative session (console) of the remote computer. 0 - Do not use the administrative session  1 - Connect to the administrative session |
| `allowdesktopcomposition` | i | 0 | No | Yes | Determines whether desktop composition (needed for Aero) is permitted when you log on to the remote computer. 0 - Disable desktop composition in the remote session  1 - Desktop composition is permitted |
| `allowfontsmoothing` | i | 0 | No | Yes | Determines whether font smoothing may be used in the remote session. 0 - Disable font smoothing in the remote session  1 - Font smoothing is permitted |
| `alternatefulladdress` | s |  | No | Yes | Specifies an alternate name or IP address of the remote computer that you want to connect to. Will be overruled by RDP+. |
| `alternateshell` | s |  | No | Yes | Specifies a program to be started automatically when you connect to a remote computer. The value should be a valid path to an executable file. This setting only works when connecting to Windows Server instances. |
| `audiocapturemode` | i | 0 | No | Yes | Determines how sounds captured (recorded) on the local computer are handled when you are connected to the remote computer. 0 - Do not capture audio from the local computer  1 - Capture audio from the local computer and send to the remote computer |
| `audiomode` | i | 0 | No | Yes | Determines how sounds on a remote computer are handled when you are connected to the remote computer. 0 - Play sounds on the local computer  1 - Play sounds on the remote computer  2 - Do not play sounds |
| `audioqualitymode` | i | 0 | No | Yes | Determines the quality of the audio played in the remote session. 0 - Dynamically adjust audio quality based on available bandwidth  1 - Always use medium audio quality  2 - Always use uncompressed audio quality |
| `authenticationlevel` | i | 2 | No | Yes | Determines what should happen when server authentication fails. 0 - If server authentication fails, connect without giving a warning  1 - If server authentication fails, do not connect  2 - If server authentication fails, show a warning and allow the user to connect or not  3 - Server authentication is not required  This setting will be overruled by RDP+. |
| `autoreconnectmaxretries` | i | 20 | No | Yes | Determines the maximum number of times the client computer will try to. |
| `autoreconnectionenabled` | i | 1 | No | Yes | Determines whether the client computer will automatically try to reconnect to the remote computer if the connection is dropped. 0 - Do not attempt to reconnect  1 - Attempt to reconnect |
| `bandwidthautodetect` | i | 1 | No | Yes | Enables the option for automatic detection of the network type. Used in conjunction with networkautodetect. Also see connection type. 0 - Do not enable the option for automatic network detection  1 - Enable the option for automatic network detection |
| `bitmapcachepersistenable` | i | 1 | No | Yes | Determines whether bitmaps are cached on the local computer (disk-based cache). Bitmap caching can improve the performance of your remote session. 0 - Do not cache bitmaps  1 - Cache bitmaps |
| `bitmapcachesize` | i | 1500 | No | Yes | Specifies the size in kilobytes of the memory-based bitmap cache. The maximum value is 32000. |
| `camerastoredirect` | s |  | No | Yes | Determines which cameras to redirect. This setting uses a semicolon-delimited list of KSCATEGORY\_VIDEO\_CAMERA interfaces of cameras enabled for redirection.No |
| `compression` | i | 1 | No | Yes | Determines whether the connection should use bulk compression. 0 - Do not use bulk compression  1 - Use bulk compression |
| `connecttoconsole` | i | 0 | No | Yes | Connect to the console session of the remote computer.   0 - Connect to a normal session  1 - Connect to the console screen |
| `connectiontype` | i | 2 | No | Yes | Specifies pre-defined performance settings for the Remote Desktop session. 1 - Modem (56 Kbps)  2 - Low-speed broadband (256 Kbps - 2 Mbps)  3 - Satellite (2 Mbps - 16 Mbps with high latency)  4 - High-speed broadband (2 Mbps - 10 Mbps)  5 - WAN (10 Mbps or higher with high latency)  6 - LAN (10 Mbps or higher)  7 - Automatic bandwidth detection. Requires bandwidthautodetect. By itself, this setting does nothing. When selected in the RDC GUI, this option changes several performance related settings (themes, animation, font smoothing, etcetera). These separate settings always overrule the connection type setting. |
| `desktopsizeid` | i | 0 | Yes | Yes | Specifies pre-defined dimensions of the Remote Desktop session. 0 - 640x480  1 - 800x600  2 - 1024x768  3 - 1280x1024  4 - 1600x1200  This setting is ignored when either /w and /h, or desktopwidth and desktopheight are already specified. |
| `desktopheight` | i | 600 | Yes | Yes | The height (in pixels) of the Remote Desktop session. |
| `desktopwidth` | i | 800 | Yes | Yes | The width (in pixels) of the Remote Desktop session. |
| `devicestoredirect` | s |  | No | Yes | Determines which supported Plug and Play devices on the client computer will be redirected and available in the remote session. No value specified - Do not redirect any supported Plug and Play devices.  \* - Redirect all supported Plug and Play devices, including ones that are connected later.  DynamicDevices - Redirect any supported Plug and Play devices that are connected later.  The hardware ID for one or more Plug and Play devices - Redirect the specified supported Plug and Play device(s) |
| `disablefullwindowdrag` | i | 1 | No | Yes | Determines whether window content is displayed when you drag the window to a new location. 0 - Show the contents of the window while dragging  1 - Show an outline of the window while dragging |
| `disablemenuanims` | i | 1 | No | Yes | Determines whether menus and windows can be displayed with animation effects in the remote session. 0 - Menu and window animation is permitted  1 - No menu and window animation |
| `disablethemes` | i | 0 | No | Yes | Determines whether themes are permitted when you log on to the remote computer. 0 - Themes are permitted  1 - Disable theme in the remote session |
| `disablewallpaper` | i | 1 | No | Yes | Determines whether the desktop background is displayed in the remote session. 0 - Display the wallpaper   1 - Do not show any wallpaper |
| `disableconnectionsharing` | i | 0 | No | Yes | Determines whether a new Terminal Server session is started with every launch of a RemoteApp to the same computer and with the same credentials. 0 - No new session is started. The currently active session of the user is shared  1 - A new login session is started for the RemoteApp |
| `disableremoteappcapscheck` | i | 0 | No | Yes | Specifies whether the Remote Desktop client should check the remote computer for RemoteApp capabilities. 0 - Check the remote computer for RemoteApp capabilities before logging in  1 - Do not check the remote computer for RemoteApp capabilities |
| `displayconnectionbar` | i | 1 | No | Yes | Determines whether the connection bar appears when you are in full screen mode. Press CTRL+ALT+HOME to bring it back temporarily. 0 - Do not show the connection bar  1 - Show the connection bar Will be overruled by RDP+ when using the parameter. |
| `domain` | s |  | No | Yes | Configures the domain of the user. |
| `drivestoredirect` | s |  | No | Yes | Determines which local disk drives on the client computer will be redirected and available in the remote session. No value specified - Do not redirect any drives.  \* - Redirect all disk drives, including drives that are connected later.  DynamicDrives - Redirect any drives that are connected later. |
| `enablecredsspsupport` | i | 1 | No | Yes | Determines whether Remote Desktop will use CredSSP for authentication if it's available. 0 - Do not use CredSSP, even if the operating system supports it  1 - Use CredSSP, if the operating system supports it |
| `enablesuperpan` | i | 0 | No | Yes | Determines whether SuperPan is enabled or disabled. SuperPan allows the user to navigate a remote desktop in full-screen mode without scroll bars, when the dimensions of the remote desktop are larger than the dimensions of the current client window. The user can point to the window border, and the desktop view will scroll automatically in that direction. 0 - Do not use SuperPan. The remote session window is sized to the client window size.  1 - Enable SuperPan. The remote session window is sized to the dimensions specified through /w and /h, or through desktopwidth and desktopheight. |
| `encoderedirectedvideocapture` | i | 1 | No | Yes | Enables or disables encoding of redirected video. 0 - Disable encoding of redirected video  1 - Enable encoding of redirected video |
| `fulladdress` | s |  | No | Yes | Specifies the name or IP address (and optional port) of the remote computer that you want to connect to. |
| `gatewaycredentialssource` | i | 4 | No | Yes | Specifies the credentials that should be used to validate the connection with the RD Gateway. 0 - Ask for password (NTLM)  1 - Use smart card  4 - Allow user to select later |
| `gatewayhostname` | s |  | No | Yes | Specifies the hostname of the RD Gateway. |
| `gatewayprofileusagemethod` | i | 0 | No | Yes | Determines the RD Gateway authentication method to be used. 0 - Use the default profile mode, as specified by the administrator  1 - Use explicit settings |
| `gatewayusagemethod` | i | 4 | No | Yes | Specifies if and how to use a Gateway) server. 0 - Do not use an RD Gateway server  1 - Always use an RD Gateway, even for local connections  2 - Use the RD Gateway if a direct connection cannot be made to the remote computer (i.e. bypass for local addresses)  3 - Use the default RD Gateway settings |
| `keyboardhook` | i | 2 | Yes | Yes | Determines how Windows key combinations are applied when you are connected to a remote computer. 0 - Windows key combinations are applied on the local computer  1 - Windows key combinations are applied on the remote computer  2 - Windows key combinations are applied in full-screen mode only |
| `negotiate security layer` | i | 1 | No | Yes | Determines whether the level of security is negotiated. 0 - Security layer negotiation is not enabled and the session is started by using Secure Sockets Layer (SSL)  1 - Security layer negotiation is enabled and the session is started by using x.224 encryption |
| `networkautodetect` | i | 1 | No | Yes | Determines whether to use auomatic network bandwidth detection or not. Requires the option bandwidthautodetect to be set and correlates with connection type 7. 0 - Use automatic network bandwitdh detection  1 - Do not use automatic network bandwitdh detection |
| `password51` | b |  | No | Yes | The user password in a binary hash value. |
| `pinconnectionbar` | i | 1 | No | Yes | Determines whether or not the connection bar should be pinned to the top of the remote session upon connection when in full screen mode. 0 - The connection bar should not be pinned to the top of the remote session  1 - The connection bar should be pinned to the top of the remote session |
| `promptforcredentials` | i | 0 | No | Yes | Determines whether Remote Desktop Connection will prompt for credentials when connecting to a remote computer for which the credentials have been previously saved. 0 - Remote Desktop will use the saved credentials and will not prompt for credentials.  1 - Remote Desktop will prompt for credentials. This setting is ignored by RDP+. |
| `promptforcredentialsonclient` | i | 0 | No | Yes | Determines whether Remote Desktop Connection will prompt for credentials when connecting to a server that does not support server authentication.   0 - Remote Desktop will not prompt for credentials  1 - Remote Desktop will prompt for credentials |
| `promptcredentialonce` | i | 1 | No | Yes | When connecting through an RD Gateway, determines whether RDC should use the same credentials for both the RD Gateway and the remote computer. 0 - Remote Desktop will not use the same credentials  1 - Remote Desktop will use the same credentials for both the RD gateway and the remote computer |
| `publicmode` | i | 0 | No | Yes | Determines whether Remote Desktop Connection will be started in public mode. 0 - Remote Desktop will not start in public mode  1 - Remote Desktop will start in public mode and will not save any user data (credentials, bitmap cache, MRU) on the local machine |
| `redirectclipboard` | i | 1 | Yes | Yes | Determines whether the clipboard on the client computer will be redirected and available in the remote session and vice versa. 0 - Do not redirect the clipboard  1 - Redirect the clipboard |
| `redirectcomports` | i | 0 | Yes | Yes | Determines whether the COM (serial) ports on the client computer will be redirected and available in the remote session. 0 - The COM ports on the local computer are not available in the remote session  1 - The COM ports on the local computer are available in the remote session |
| `redirectdirectx` | i | 1 | No | Yes | Determines whether DirectX will be enabled for the remote session. 0 - Do not enable DirectX rendering  1 - Enable DirectX rendering in the remote session |
| `redirectedvideocaptureencodingquality` | i | 0 | No | Yes | Controls the quality of encoded video. 0 - High compression video. Quality may suffer when there's a lot of motion  1 - Medium compression  2 - Low compression video with high picture quality |
| `redirectlocation` | i | 0 | No | Yes | Determines whether the location of the local device will be redirected and available in the remote session. 0 - The remote session uses the location of the remote computer  1 - The remote session uses the location of the local device |
| `redirectposdevices` | i | 0 | No | Yes | Determines whether Microsoft Point of Service (POS) for .NET devices connected to the client computer will be redirected and available in the remote session. 0 - The POS devices from the local computer are not available in the remote session  1 - The POS devices from the local computer are available in the remote session |
| `redirectprinters` | i | 1 | Yes | Yes | Determines whether printers configured on the client computer will be redirected and available in the remote session. 0 - The printers on the local computer are not available in the remote session  1 - The printers on the local computer are available in the remote session |
| `redirectsmartcards` | i | 1 | Yes | Yes | Determines whether smart card devices on the client computer will be redirected and available in the remote session. 0 - The smart card device on the local computer is not available in the remote session  1 - The smart card device on the local computer is available in the remote session |
| `redirectwebauthn` | i | 1 | Yes | Yes | Determines whether WebAuthn requests on the remote computer will be redirected to the local computer allowing the use of local authenticators (such as Windows Hello for Business and security key). 0 - WebAuthn requests from the remote session aren't sent to the local computer for authentication and must be completed in the remote session  1 - WebAuthn requests from the remote session are sent to the local computer for authentication |
| `remoteapplicationicon` | s |  | No | Yes | the file name of an icon file to be displayed in the while starting the RemoteApp. By default RDC will show the standard Note: Only .ico files are supported.No |
| `remoteapplicationmode` | i | 0 | No | Yes | Determines whether a RemoteApp shoud be launched when connecting 0 - Use a normal session and do not start a RemoteApp  1 - Connect and launch a RemoteApp |
| `remoteapplicationname` | s |  | No | Yes | the name of the RemoteApp in the Remote Desktop interface while starting the RemoteApp. |
| `remoteapplicationprogram` | s |  | No | Yes | Specifies the alias or executable name of the RemoteApp. |
| `screenmodeid` | i | 2 | Yes | Yes | Determines whether the remote session window appears full screen when you connect to the remote computer. 1 - The remote session will appear in a window  2 - The remote session will appear full screen |
| `selectedmonitors` | s |  | Yes | Yes | Specifies which local displays to use for the remote session. The selected displays must be contiguous. Requires use multimon to be set to 1. Comma separated list of machine-specific display IDs. You can retrieve IDs by calling mstsc.exe /l. The first ID listed will be set as the primary display in the session. Defaults to all displays. |
| `serverport` | i | 3389 | No | Yes | Defines an alternate default port for the Remote Desktop connection. Will be overruled by any port number appended to the server name. |
| `sessionbpp` | i | 32 | No | Yes | Determines the color depth (in bits) on the remote computer when you connect. 8 - 256 colors (8 bit)  15 - High color (15 bit)  16 - High color (16 bit)  24 - True color (24 bit)  32 - Highest quality (32 bit) |
| `shellworkingdirectory` | s |  | No | Yes | The working directory on the remote computer to be used if an alternate shell is specified. |
| `signature` | s |  | No | Yes | The encoded signature when using .rdp file signing. |
| `signscope` | s |  | No | Yes | Comma-delimited list of .rdp file settings for which the signature is generated when using .rdp file signing. |
| `smartsizing` | i | 0 | Yes | Yes | Determines whether the client computer should scale the content on the remote computer to fit the window size of the client computer when the window is resized. 0 - The client window display will not be scaled when resized  1 - The client window display will automatically be scaled when resized |
| `spanmonitors` | i | 0 | No | Yes | Determines whether the remote session window will be spanned across multiple monitors when you connect to the remote computer. 0 - Monitor spanning is not enabled  1 - Monitor spanning is enabled |
| `superpanaccelerationfactor` | i | 1 | No | Yes | Specifies the number of pixels that the screen view scrolls in a given direction for every pixel of mouse movement by the client when in SuperPan mode. |
| `usbdevicestoredirect` | s |  | Yes | Yes | which supported RemoteFX USB devices on the client computer will be redirected and available in the remote session when you connect to a remote session that supports RemoteFX USB redirection. No value specified - Do not redirect any supported RemoteFX USB devices  \* - Redirect all supported RemoteFX USB devices for redirection that are not |
| `usemultimon` | i | 0 | Yes | Yes | Determines whether the session should use true multiple monitor support when connecting to the remote computer. 0 - Do not enable multiple monitor support  1 - Enable multiple monitor support |
| `username` | s |  | No | Yes | the name of the user account that will be used to log on to the remote computer. |
| `videoplaybackmode` | i | 1 | No | Yes | Determines whether RDC will use RDP efficient multimedia streaming for video playback. 0 - Do not use RDP efficient multimedia streaming for video playback  1 - Use RDP efficient multimedia streaming for video playback when possible |
| `winposstr` | s | 0,3,0,0,800,600 | No | Yes | Specifies the position and dimensions of the session window on the client computer. |
| `workspaceid` | s |  | No | Yes | This setting defines the RemoteApp and Desktop ID associated with the RDP file that contains this setting. |

---

## Summary

This page contains a lot of different RDP settings which we can still use today. Some of the RDP settings are categorized by Microsoft as not supported but will do their work in Azure Virtual Desktop too, for example the option to hide the connection bar by default.

### Sources

These sources helped me by writing and research for this post;

1. <https://learn.microsoft.com/en-us/azure/virtual-desktop/rdp-properties>

Thank you for reading this post and I hope it was helpful!

{{< ads >}}

{{< article-footer >}}
