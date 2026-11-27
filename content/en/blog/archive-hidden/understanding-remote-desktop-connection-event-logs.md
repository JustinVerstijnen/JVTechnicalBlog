---
title: "Understanding Remote Desktop Connection Event Logs"
slug: "understanding-remote-desktop-connection-event-logs"
date: 2026-11-27
tags:
- Concepts
categories: []
description: "Learn which Windows event logs and event IDs help you investigate Remote Desktop connections, authentication attempts, reconnects, disconnections, and logoffs."
hidden: false
---

Remote Desktop Protocol connections leave information across several Windows event logs. Looking only for one event, such as a successful logon, can therefore give you an incomplete picture of what happened.

For troubleshooting and incident investigation, it is more useful to correlate events from the **Security** log with the operational logs for Remote Desktop Services. Together, these events can help answer the following questions:

- Which account was used?
- Did authentication succeed or fail?
- From which IP address did the connection originate?
- Was a new session created or an existing session reconnected?
- Was the session disconnected or completely logged off?

## RDP event overview

The following table provides a quick overview of the main event logs and event IDs involved in an RDP connection.

| Activity | Event log location | Event IDs |
| --- | --- | --- |
| Logon | Security | 4624, 4625 |
| Logon | TerminalServices-RemoteConnectionManager/Operational | 1149 |
| Logon | RemoteDesktopServices-RdpCoreTS/Operational | 98, 131 |
| Logon and session creation | TerminalServices-LocalSessionManager/Operational | 21, 22, 25 |
| Logoff | Security | 4634, 4647 |
| Logoff or disconnection | TerminalServices-LocalSessionManager/Operational | 23, 40 |

You can find these logs in Event Viewer under the following locations:

- **Windows Logs > Security**
- **Applications and Services Logs > Microsoft > Windows > TerminalServices-RemoteConnectionManager > Operational**
- **Applications and Services Logs > Microsoft > Windows > TerminalServices-LocalSessionManager > Operational**
- **Applications and Services Logs > Microsoft > Windows > RemoteDesktopServices-RdpCoreTS > Operational**

The Security log records authentication and logon activity. The Remote Desktop Services operational logs provide more detail about the connection and session lifecycle.

## Authentication events

The two main authentication events are stored in the Security log.

| Event ID | Log location | Message |
| --- | --- | --- |
| 4624 | Security | An account was successfully logged on |
| 4625 | Security | An account failed to log on |

### Event ID 4624

Event ID 4624 is generated on the destination computer when Windows creates a successful logon session. For a newly established Remote Desktop session, the important value is normally:

- **Logon Type 10: RemoteInteractive**

However, not every Remote Desktop connection creates a new Logon Type 10 event. When someone reconnects to an existing session, you may instead see events associated with reconnecting or unlocking the existing session.

This is why searching only for Event ID 4624 with Logon Type 10 can miss relevant activity.

The **Logon ID** is also important. It is a hexadecimal value that can be used to correlate events belonging to the same logon session, including logon, reconnection, disconnection, and logoff events.

### Event ID 4625

Event ID 4625 records a failed logon attempt. Useful fields include:

- **Account Name**
- **Account Domain**
- **Logon Type**
- **Source Network Address**
- **Failure Reason**
- **Status**
- **Sub Status**

Repeated Event ID 4625 entries with Logon Type 10 can indicate an incorrectly configured account, outdated saved credentials, or repeated attempts to access the system through Remote Desktop.

The **Status** and **Sub Status** values provide more detail about why authentication failed.

## Event ID 4625 status codes

The following status codes can help you identify the cause of a failed authentication attempt.

| Error | Cause |
| --- | --- |
| `0xC0000064` | The username is misspelled or the account does not exist. |
| `0xC000006A` | The supplied password is incorrect. |
| `0xC000006D` | The username or authentication information is incorrect. |
| `0xC0000234` | The user account is currently locked out. |
| `0xC0000072` | The user account is currently disabled. |
| `0xC000006F` | The user tried to sign in outside the permitted logon hours. |
| `0xC0000070` | The user tried to sign in from an unauthorized workstation. |
| `0xC0000193` | The user account has expired. |
| `0xC0000071` | The user's password has expired. |
| `0xC0000133` | The clocks on the computer and domain controller are too far out of sync. |
| `0xC0000224` | The user must change their password at the next logon. |
| `0xC000015B` | The user has not been granted the requested logon type on the computer. |

An Event ID 4625 can include both a **Status** and **Sub Status** value. The general status may be `0xC000006D`, while the sub-status provides the more specific cause. For example:

```text
Status:     0xC000006D
Sub Status: 0xC000006A
```

In this example, the general authentication attempt failed because the username or authentication information was incorrect. The sub-status clarifies that the supplied password was incorrect.

For an RDP logon, status code `0xC000015B` often means that the account does not have the **Allow log on through Remote Desktop Services** user right, or that it is affected by **Deny log on through Remote Desktop Services**.

## Event ID 4648

Event ID 4648 is generated when a process attempts to log on using explicitly supplied credentials. The event can show:

- The account already signed in to the source computer
- The account whose credentials were supplied
- The target server
- The process that requested the logon

This event is not specific to RDP. It can also be generated by applications, administrative tools, scripts, scheduled tasks, and other processes that use explicit credentials. Correlate it with Remote Desktop events from the source and destination computers before treating it as evidence of an RDP connection.

## Events 4778 and 4779

Event ID 4778 records a reconnection to an existing session. Event ID 4779 records a session disconnection without a complete logoff.

These events can contain the following information:

- Account name and domain
- Logon ID
- Session name
- Client computer name
- Client IP address

The session name commonly resembles `RDP-Tcp#3`. These events are particularly useful when a user closes the Remote Desktop client without signing out, then reconnects to the same session later.

## Remote Desktop Services operational events

The operational event logs provide supporting information that is not always available in the Security log.

| Event ID | Event log | Meaning |
| --- | --- | --- |
| 1149 | TerminalServices-RemoteConnectionManager/Operational | Remote Desktop Services received a successful user-authentication event |
| 98 | RemoteDesktopServices-RdpCoreTS/Operational | Provides information about the RDP connection and protocol processing |
| 131 | RemoteDesktopServices-RdpCoreTS/Operational | Records information about the incoming RDP connection |
| 21 | TerminalServices-LocalSessionManager/Operational | A session logon succeeded |
| 22 | TerminalServices-LocalSessionManager/Operational | The session shell started |
| 23 | TerminalServices-LocalSessionManager/Operational | The session logged off |
| 25 | TerminalServices-LocalSessionManager/Operational | An existing session was reconnected |
| 40 | TerminalServices-LocalSessionManager/Operational | A session was disconnected |

Event ID 21 helps confirm that the authenticated account successfully entered a session. Event ID 22 records that the interactive shell started.

Event ID 25 is useful for identifying a reconnection to a session that already existed. Event IDs 23 and 40 help distinguish a complete logoff from a disconnection.

Event ID 1149 should not be used by itself to prove that a complete interactive session was created. Correlate it with Security Event ID 4624 and LocalSessionManager Event IDs 21 and 22.

## Disconnection versus logoff

A disconnection and a logoff are not the same:

- During a **disconnection**, the session can remain active on the destination computer. Applications may continue running, and the user may reconnect later.
- During a **logoff**, Windows closes the user session and ends the processes running within it.

This difference matters when building a timeline. A connection on Monday and a reconnection on Tuesday may belong to the same Windows session rather than two separate logons.

Useful event combinations include:

- **4779 or LocalSessionManager 40:** The session was disconnected.
- **4778 or LocalSessionManager 25:** The user reconnected to an existing session.
- **4647, 4634, or LocalSessionManager 23:** The session was logged off or ended.

Event ID 4647 indicates that a user initiated the logoff process. Event ID 4634 confirms that the logon session was terminated and no longer exists.

## Correlating an RDP session

A practical investigation should combine events by timestamp, account, source address, session name, and Logon ID.

A typical new connection may produce a sequence similar to:

1. Event IDs 98 or 131 record activity associated with the incoming RDP connection.
2. Event ID 1149 records Remote Desktop authentication activity.
3. Event ID 4624 records a successful logon with Logon Type 10.
4. Event ID 21 records that the session logon succeeded.
5. Event ID 22 records that the session shell started.
6. Event ID 4779 or Event ID 40 records a later disconnection.
7. Event ID 4778 or Event ID 25 records a reconnection.
8. Event IDs 4647, 4634, or 23 record the eventual logoff.

Not every environment produces every event in this exact order. Audit policy, Windows version, session state, and log retention can affect what is available. The sequence should therefore be treated as a correlation model rather than a fixed signature.

## Reviewing events with PowerShell

The following read-only PowerShell command retrieves relevant Security events from the last seven days:

```powershell
$StartTime = (Get-Date).AddDays(-7)
$EventIds = 4624, 4625, 4634, 4647, 4648, 4778, 4779

Get-WinEvent -FilterHashtable @{
    LogName   = 'Security'
    Id        = $EventIds
    StartTime = $StartTime
} | Select-Object TimeCreated, Id, MachineName, Message |
    Sort-Object TimeCreated
```

To retrieve session lifecycle events from the Remote Desktop Services operational log:

```powershell
$StartTime = (Get-Date).AddDays(-7)
$LogName = 'Microsoft-Windows-TerminalServices-LocalSessionManager/Operational'
$EventIds = 21, 22, 23, 25, 40

Get-WinEvent -FilterHashtable @{
    LogName   = $LogName
    Id        = $EventIds
    StartTime = $StartTime
} | Select-Object TimeCreated, Id, MachineName, Message |
    Sort-Object TimeCreated
```

For authentication events from RemoteConnectionManager:

```powershell
$StartTime = (Get-Date).AddDays(-7)
$LogName = 'Microsoft-Windows-TerminalServices-RemoteConnectionManager/Operational'

Get-WinEvent -FilterHashtable @{
    LogName   = $LogName
    Id        = 1149
    StartTime = $StartTime
} | Select-Object TimeCreated, Id, MachineName, Message |
    Sort-Object TimeCreated
```

To retrieve RdpCoreTS events:

```powershell
$StartTime = (Get-Date).AddDays(-7)
$LogName = 'Microsoft-Windows-RemoteDesktopServices-RdpCoreTS/Operational'
$EventIds = 98, 131

Get-WinEvent -FilterHashtable @{
    LogName   = $LogName
    Id        = $EventIds
    StartTime = $StartTime
} | Select-Object TimeCreated, Id, MachineName, Message |
    Sort-Object TimeCreated
```

These commands return the complete event messages so you can inspect account names, addresses, session identifiers, and failure information. Run them in an elevated PowerShell session if access to the Security log is denied.

## Summary

Investigating an RDP connection requires more than searching for Event ID 4624. By correlating Security events with the RemoteConnectionManager, RdpCoreTS, and LocalSessionManager operational logs, you can distinguish authentication attempts, new sessions, reconnects, disconnections, and complete logoffs. When authentication fails, the Status and Sub Status values in Event ID 4625 help identify the underlying cause.

Thank you for reading this post and I hope it was helpful!

{{% alert title="Sources 📖" color="info" %}}
These sources helped me by writing and research for this post;

1. https://frsecure.com/blog/rdp-connection-event-logs/
2. https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/auditing/event-4624
3. https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/auditing/event-4625
4. https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/auditing/event-4634
5. https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/auditing/event-4647
6. https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/auditing/event-4778
7. https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/auditing/event-4779
8. https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/auditing/basic-audit-logon-events
9. https://learn.microsoft.com/en-us/troubleshoot/windows-server/remote/log-files-to-troubleshoot-rds-issues
{{% /alert %}}

{{< ads >}}

{{< article-footer >}}