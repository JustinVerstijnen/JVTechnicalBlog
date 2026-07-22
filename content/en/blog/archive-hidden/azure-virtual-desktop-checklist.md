| # | Check | 1 | 2 | 3 | Notes |
| --- | --- | --- | --- | --- | --- |
|  | First login |  |  |  |  |
| 1.1 | Was downloading and setting up the Microsoft Remote Desktop app successful? |  |  |  |  |
| 1.2 | Was the MFA challenge successful? |  |  |  |  |
| 1.3 | Was the first login completed successfully without errors? |  |  |  |  |
|  | Windows experience |  |  |  |  |
| 2.1 | Is the Windows display language set to Dutch everywhere? Check this in at least 10 Windows screens |  |  |  |  |
| 2.2 | Is the Windows taskbar layout configured as desired? |  |  |  |  |
| 2.3 | Are the correct shortcuts pinned to the taskbar? |  |  |  |  |
| 2.4 | Are the correct application shortcuts available on the desktop? |  |  |  |  |
| 2.5 | Are all required modern applications available? (Notepad, Calculator, Snipping Tool, etc.) |  |  |  |  |
| 2.6 | Verify with GPResult that all correct Group Policies have been applied |  |  |  |  |
| 2.7 | Is the Winget application available? Test by running winget in cmd; it should not return an error |  |  |  |  |
|  | Shared folders / Windows Explorer / SharePoint |  |  |  |  |
| 3.1 | Is Windows Explorer functioning properly? |  |  |  |  |
| 3.2 | Are all required network drives present? (Such as T: or W:) |  |  |  |  |
| 3.3 | Are all required Microsoft SharePoint folders available? |  |  |  |  |
| 3.4 | Is the data on the network drives accessible? |  |  |  |  |
| 3.5 | Is the data on the Microsoft SharePoint folders accessible? |  |  |  |  |
| 3.6 | Is it possible to save files in the user profile? (Desktop/Documents/Pictures/Downloads) |  |  |  |  |
| 3.7 | Is Microsoft OneDrive automatically signed in? |  |  |  |  |
| 3.8 | Are Desktop/Pictures/Documents automatically synced with Microsoft OneDrive? |  |  |  |  |
|  | Second login |  |  |  |  |
| 4.1 | Was the second login successful without errors? |  |  |  |  |
| 4.2 | Were all files and settings retained? |  |  |  |  |
|  | End-user system restrictions |  |  |  |  |
| 5.1 | Are all system restrictions applied correctly? |  |  |  |  |
| 5.2 | Is the user not a local administrator? |  |  |  |  |
| 5.3 | Is the user unable to install system applications? |  |  |  |  |
| 5.4 | Is the user unable to shut down the system? |  |  |  |  |
| 5.5 | Is the user unable to open sensitive Control Panel items? |  |  |  |  |
| 5.6 | Is the user unable to run cmd and PowerShell? |  |  |  |  |
| 5.7 | Is it impossible for the end user to make system changes? Try to creatively test whether the system can be compromised |  |  |  |  |
|  | Administrator system restrictions |  |  |  |  |
| 6.1 | Are all system restrictions removed when logged in as Administrator? |  |  |  |  |
| 6.2 | Is the FSLogix profile correctly NOT loaded when logged in as Administrator? |  |  |  |  |
| 6.3 | Is it possible to run CMD and PowerShell as Administrator? |  |  |  |  |
|  | Applications |  |  |  |  |
|  | Based on this application list, presence and functionality must be tested for each application |  |  |  |  |
| 7.1 | Are all required applications installed? |  |  |  |  |
| 7.2 | Are all required applications functioning properly? |  |  |  |  |
|  | Microsoft 365 experience |  |  |  |  |
| 8.1 | Is Microsoft Outlook functioning properly? |  |  |  |  |
| 8.2 | Is Microsoft Teams functioning properly? |  |  |  |  |
| 8.3 | Is Microsoft Word functioning properly? |  |  |  |  |
| 8.4 | Is Microsoft PowerPoint functioning properly? |  |  |  |  |
| 8.5 | Is Microsoft Excel functioning properly? |  |  |  |  |
| 8.6 | Is Microsoft Edge functioning properly? |  |  |  |  |
| 8.7 | Is Microsoft OneDrive functioning properly and installed for all users? Test with at least 2 users |  |  |  |  |
| 8.8 | Is MFA bypassed in the remote desktop environment? |  |  |  |  |
|  | Performance |  |  |  |  |
| 9.1 | Is the speed of the remote environment satisfactory? |  |  |  |  |
| 9.2 | Are there no work-disrupting delays present? |  |  |  |  |
| 9.3 | Are there no delays when typing, using the mouse, or opening applications? |  |  |  |  |
|  | Working from home / remote work |  |  |  |  |
| 10.1 | Is it possible to work from home/remotely? |  |  |  |  |
| 10.2 | Is the speed/performance satisfactory when working from home/remotely? |  |  |  |  |
|  | Summary |  |  |  |  |
|  | In your opinion, is the environment ready for deployment? |  |  |  |  |
|  | We also ask for some human insight here—besides the points above, there may be other improvements to address before wider rollout. |  |  |  |  |