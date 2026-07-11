---
title: "MD-100 + MD-101 Course notes"
slug: "md100-md101-course-notes"
date: 2020-10-09
tags: Concepts
categories:
- Archive
description: "This page contains my older MD-100 and MD-101 notes about Windows 10 and managing modern desktops."
---

These notes cover the main subjects I studied for MD-100 and MD-101 during the Windows 10 and Microsoft Endpoint Manager era. The exams focused on deploying Windows, managing devices and user data, securing endpoints, applying policies and keeping a desktop environment healthy over time.

Some names and individual services belonged specifically to that period. The useful concepts are broader: understand how Windows works, choose an appropriate deployment method, separate user data from the operating system, manage configuration centrally, protect identities and devices, and introduce changes in controlled stages.

## Windows

Before managing Windows at scale, it helps to understand what is happening inside a single device. Windows is not one large application. It is a collection of components that start in a defined order, separate user activity from privileged system activity, store configuration in several places and expose management interfaces for administrators.

The operating system sits between applications and the hardware. Applications normally run in user mode, where they have limited access to the rest of the system. Core operating system components and hardware drivers operate with higher privileges in kernel mode. This separation limits the damage a normal application can cause, although a faulty or vulnerable kernel component can still affect the entire computer.

### Boot

The startup process begins in the device firmware. Older systems use BIOS, while modern systems normally use UEFI. The firmware initializes the hardware, selects a boot device and hands control to the Windows boot environment.

Windows Boot Manager reads the Boot Configuration Data store, usually called BCD, to determine which operating system or recovery entry should be started. The Windows loader then loads the kernel, the hardware abstraction layer, essential drivers and the system registry data needed early in the startup process.

After the kernel has initialized the hardware and core subsystems, Windows starts system processes and services. The logon components can then present the sign-in screen and create a user session.

This sequence explains why startup problems can have very different causes. A device that never reaches Windows may have a firmware or storage problem. A BCD problem can prevent the loader from finding the correct installation. A faulty boot driver can stop Windows later in the process, while a service or profile problem may appear only after sign-in.

Secure Boot adds another control to this process by checking whether trusted software is being loaded during startup. The Trusted Platform Module, or TPM, can protect keys and measurements that are tied to the device. These technologies are also used by features such as BitLocker and Windows Hello for Business.

Windows Recovery Environment provides tools for situations where the normal installation cannot start. Depending on the problem, this environment can be used for startup repair, command-line recovery, restoring a system state, uninstalling a problematic update or resetting the device.

### Processes

A running application is represented by one or more processes. A process receives its own virtual address space and contains one or more threads that perform the actual work.

This separation prevents a normal application from directly reading or changing the memory of every other application. Windows still provides controlled methods for processes to communicate, but access is checked against security boundaries.

Task Manager gives a practical view of processes, resource consumption, startup applications, users and services. It is useful when a device feels slow, an application stops responding or a background process consumes an unusual amount of CPU, memory, disk or network capacity.

A high utilization value is a symptom rather than a complete diagnosis. High CPU may be expected during compilation or installation. High disk activity can be normal during an update. The useful question is whether the behavior matches what the device is supposed to be doing.

### Services

Services are background processes that can start before a user signs in and continue running independently of an interactive session. Windows uses services for functions such as networking, updates, event collection, printing and security.

Each service has a startup type and runs under a security identity. Some services use built-in identities such as Local System, Local Service or Network Service, while business applications may use a dedicated service account.

The selected identity matters because the service receives the permissions of that account. Giving a service more privilege than it needs increases the impact of a compromise. A service account should therefore have a clear purpose, controlled credentials and only the access needed by the application.

Services can depend on each other. Stopping one service may therefore affect several apparently unrelated functions. Before changing a startup type or disabling a service, first understand what uses it.

### Drivers

Drivers allow Windows to communicate with hardware. The operating system provides a standard interface to applications, while the driver translates requests into commands that the device understands.

Drivers run close to the operating system and can have a large effect on stability. An incompatible storage, display or network driver can cause crashes, performance problems or startup failures.

This is why driver readiness belongs in every deployment plan. A device may meet the basic hardware requirements for an operating system and still be unsuitable when an essential driver or business peripheral is not supported.

Device Manager provides a view of installed hardware and driver state. Event logs and reliability information can provide additional clues when hardware repeatedly disconnects or a driver causes instability.

### Registry

The Windows Registry is a hierarchical database used by Windows and many applications to store configuration.

Several root hives appear in Registry Editor:

| Hive | Main purpose |
| --- | --- |
| `HKEY_LOCAL_MACHINE` | Computer-wide operating system and application configuration |
| `HKEY_CURRENT_USER` | Settings for the currently signed-in user |
| `HKEY_USERS` | Loaded user registry profiles |
| `HKEY_CLASSES_ROOT` | File associations and component registration |
| `HKEY_CURRENT_CONFIG` | Information about the active hardware profile |

User-specific registry settings are connected to the profile. The `NTUSER.dat` file inside a user profile is loaded as the user's `HKEY_CURRENT_USER` hive during sign-in.

The Registry is powerful because it exposes settings that may not be available in a normal graphical interface. It is also unforgiving. Registry Editor generally accepts a value without checking whether it makes sense for the application that will later read it.

Where possible, use a supported application setting, policy or management interface instead of editing the Registry directly. Direct edits are most useful when the setting is documented and the effect is understood.

### Accounts

Windows can work with several identity types.

A local account exists only on one computer and is stored in the local Security Account Manager database. The account can access local resources according to its group memberships and permissions, but it is not automatically recognized by another computer.

A domain account is stored in Active Directory Domain Services and can be used across domain-joined resources. Kerberos is commonly used for authentication inside an Active Directory domain, with the domain controller acting as a trusted authority for tickets.

The course material also covered Microsoft accounts and Azure Active Directory identities. These introduced cloud-based sign-in, synchronization and device registration scenarios in addition to traditional local and domain identities.

Authentication answers whether an identity is genuine. Authorization determines what that identity can do after authentication.

The Local Security Authority is a central part of this process. The `lsass.exe` process validates credentials, applies local security policy and creates access tokens. An access token contains information such as the user's security identifier, group memberships and privileges. Windows uses that token when checking access to files, Registry keys, processes and other protected objects.

Local groups make common permissions easier to manage. For example, Administrators receive broad control of the device, Remote Desktop Users may sign in through Remote Desktop, and Event Log Readers can view event information without receiving full administrative rights.

The principle remains the same whether access is local or centralized: assign permissions to a role or group where practical instead of managing every user separately.

### UAC

User Account Control separates normal activity from administrative activity.

Even when a user belongs to the local Administrators group, normal applications do not always run with the full administrative token. When an operation requires elevation, Windows can request consent or credentials.

This reduces the chance that every process started by an administrator automatically receives unrestricted control of the device.

UAC is not a replacement for using standard user accounts. It is an additional boundary. Daily work should use the least privilege needed, while administrative tasks should be elevated deliberately.

### Profiles

A user profile combines personal files, application data and user-specific configuration.

Common profile folders include Desktop, Documents, Downloads, Pictures and `AppData`. The `AppData\Roaming` area was designed for application settings that may follow the user in traditional roaming profile scenarios, while other data remains specific to the device.

Windows environments have used several profile models:

- A local profile remains on one device.
- A roaming profile is copied between a server and domain-joined devices.
- A mandatory profile starts from a centrally controlled read-only profile and discards user changes.
- Cloud synchronization and OneDrive-based folder protection can move selected settings and user data without copying the complete legacy profile.

Roaming an entire profile can create long sign-in times and synchronization conflicts, especially when the profile contains large caches or when the user signs in to several devices at the same time.

A modern design should therefore separate the different kinds of state. Important user files can be redirected or synchronized, selected settings can roam, and device-specific caches can remain local.

### Filesystems

A filesystem defines how data is organized and which capabilities are available on a volume.

NTFS is the main Windows filesystem for operating system and general-purpose data volumes. It supports permissions, auditing, encryption, quotas and other features that are not available in simpler filesystems such as FAT32.

ReFS was designed for resilient storage scenarios and integrates with features such as Storage Spaces. The correct filesystem depends on the workload and the Windows edition or platform being used.

Permissions on NTFS files and folders are based on access control entries. These entries can allow or deny actions such as reading, writing, modifying or taking ownership. Permissions are commonly inherited from the parent folder, which makes a consistent folder structure much easier to manage than many unrelated exceptions.

Group membership is cumulative. A user normally receives the combination of allowed permissions granted through the user's account and groups. An explicit deny can override an allow and should be used carefully because it can make effective access difficult to understand.

Share permissions add another layer when a folder is accessed over the network. Local access is evaluated with NTFS permissions. Network access is evaluated against both share and NTFS permissions, with the most restrictive effective result applying.

A practical design often keeps share permissions broad enough for the intended audience and uses NTFS permissions for the detailed folder structure. The exact model matters less than being consistent and knowing where access is controlled.

Robocopy can copy large directory structures and preserve data such as timestamps, security information and ownership when the correct options are used. It is therefore useful during file migrations where a normal drag-and-drop copy would lose metadata or permissions.

### Encryption

Windows provides encryption at different layers.

BitLocker encrypts an entire volume. It protects data at rest when a device or disk is lost, stolen or removed. The TPM can release the encryption key when the expected boot state is detected, while a recovery key provides an alternative when the normal protector cannot be used.

Recovery keys should be stored somewhere that remains accessible when the device itself is unavailable. In managed environments, that normally means a directory or management platform rather than a document on the encrypted computer.

Encrypting File System, or EFS, encrypts individual files for a user. EFS and BitLocker solve different problems. BitLocker protects the volume as a whole, while EFS is tied more closely to a user's certificate and selected files.

EFS requires careful certificate and recovery planning. Losing the private key can make the data inaccessible even when the disk itself is healthy.

### Storage

Windows sees physical disks, partitions, volumes and filesystems as related but separate layers.

A physical disk can contain one or more partitions. A partition can be formatted as a volume with a filesystem and assigned a drive letter or mount point. Applications then work with the filesystem rather than directly with disk sectors.

Storage Spaces adds a software-defined layer across multiple physical disks. Disks are grouped into a pool, and virtual disks can then be created with a resilience layout.

A simple layout provides capacity without redundancy. A mirror keeps additional copies of data, while parity stores recovery information more efficiently but introduces different performance characteristics.

The best choice depends on whether the priority is capacity, performance or fault tolerance. Redundancy also does not replace backup. Mirroring a deleted or corrupted file simply reproduces the same problem across the copies.

### Networking

A Windows device needs a valid IP configuration before it can communicate with other systems.

The IP address identifies the device interface, while the subnet mask determines which addresses are considered local. Traffic for another network is sent to the default gateway. DNS translates names into addresses so users and applications do not need to remember IP addresses.

These settings can be assigned manually or provided by DHCP.

Windows also uses network profiles to apply different behavior to different environments. A domain profile is selected when the device recognizes its Active Directory domain. Private and public profiles represent increasingly less trusted networks.

The profile affects discovery and firewall behavior. A public network should normally expose fewer services than a trusted private or domain environment.

Windows Defender Firewall filters traffic based on direction, protocol, port, application, address and profile. A rule can allow or block specific traffic instead of switching the complete firewall off when one application does not work.

Troubleshooting should move through the network in layers. First check the adapter and link. Then check the address, subnet, gateway and DNS settings. Test local communication before testing a remote service. A successful ping also does not prove that a particular application port is reachable.

Wireless adds another layer of stored profiles, authentication and radio conditions. A device may see a network but still fail because of an incorrect security method, certificate, proxy, driver or policy.

Remote access methods such as VPN and Remote Desktop depend on both network connectivity and authorization. A correctly configured tunnel does not automatically give a user access to every internal resource.

### Virtualization

Hyper-V allows a Windows device to host virtual machines.

A virtual machine receives virtual processors, memory, disks and network adapters while sharing the physical host. This makes it possible to run isolated operating systems for development, testing or specialized workloads.

Generation 1 virtual machines use a more traditional virtual hardware model, while Generation 2 virtual machines use UEFI-based virtual firmware and support features such as Secure Boot.

Hyper-V virtual switches define how virtual machines connect:

| Switch type | Connectivity |
| --- | --- |
| External | Connects virtual machines to a physical network adapter |
| Internal | Connects virtual machines to each other and to the host |
| Private | Connects virtual machines only to each other |

Virtual hard disks commonly use VHD or VHDX formats. VHDX was designed for newer platforms and provides advantages such as larger capacity and better resilience against certain interruptions.

Virtualization is useful, but the host still needs enough CPU, memory, storage and network capacity for all running guests. A virtual machine does not remove the underlying hardware limits.

### Events

Windows records operational information in event logs.

The System log contains operating system and driver events. The Application log contains events written by applications. The Security log contains audited security activity when the relevant auditing policy is enabled.

Event Viewer can filter these logs by source, level, event ID and time. The event text should be treated as evidence rather than an automatic final answer. A visible error may be the result of an earlier failure elsewhere.

Reliability history provides another useful view by placing application failures, update events and hardware problems on a timeline.

At scale, logs can be collected centrally so that administrators can compare many devices and detect recurring patterns instead of opening each computer separately.

### Recovery

Recovery planning should separate operating system recovery from user-data recovery.

A broken boot configuration may be fixed with startup tools. A damaged Windows installation may require repair or reset. A deleted user file may need a recycle bin, version history, backup or cloud restore.

System Restore can roll back selected system changes, but it is not a full backup of user data. Reset can reinstall Windows while offering different options for retaining or removing user files. A clean installation starts from a new operating system state and requires applications and configuration to be applied again.

A support process should know which recovery method matches the incident. Reinstalling a device is unnecessary when only one file was deleted, while restoring one file does not solve a corrupted operating system.

## Editions

Windows editions provide different feature sets for different audiences.

Home was intended for consumer use. Pro added business features such as domain-related management, BitLocker, Group Policy and Hyper-V. Enterprise added broader security and management capabilities for centrally managed organizations. Specialized workstation and education editions targeted other scenarios.

The exact feature matrix changed over time, so an edition should be selected by checking the capabilities required for management, security, virtualization and application compatibility rather than assuming that every business device needs the highest edition.

Activation confirms that the installed edition has a valid license. The course covered digital licensing, product keys, volume activation and subscription-based edition activation.

Deployment and licensing are connected but not identical. Installing an edition does not automatically grant a license, and assigning a license does not fix a device that was deployed with an incompatible edition or activation method.

## Deployment

Windows can be introduced to a device through several deployment methods. The correct method depends on whether the device is new, whether existing applications and user state should be retained, and how much control the organization needs over the installation.

### Clean installation

A clean installation starts with a fresh operating system.

This is common for a new device, a wipe-and-load migration or a device that needs to return to a known state. The advantage is that old applications, temporary data and configuration problems are not automatically carried into the new installation.

The cost is that applications, settings and user data must be restored afterwards. A clean deployment therefore needs a plan for drivers, applications, configuration, identity, data and activation.

### Upgrade

An in-place upgrade keeps supported applications, user data and much of the existing configuration while replacing the operating system version.

This can reduce migration effort, but it also preserves more of the old environment. An unsupported application, driver or damaged configuration can therefore continue to cause problems after the upgrade.

Before an upgrade, check the supported source version, destination edition, available storage, firmware, drivers, security software and business applications. A device should also have a recovery path if the upgrade cannot complete.

The choice between clean installation and in-place upgrade is not simply about which method is faster. It is a balance between preserving state and returning the device to a predictable baseline.

### Images

Traditional deployment commonly uses a Windows image, often stored in WIM format. The image contains the operating system files that will be applied to the destination device.

An image can remain close to the standard Microsoft installation media, or it can be customized with language packs, applications, drivers and updates. Heavy customization can shorten the first deployment but increases image maintenance.

DISM can service both online and offline Windows images. An online image is the currently running installation. An offline image is mounted into a folder so that packages, drivers or features can be changed before deployment.

Language packs are packages that must match the operating system version they are intended for. Adding them to an image can help create a consistent deployment for users in different regions.

The general lesson is that every item added to an image becomes something that must be maintained. Where possible, keep the base image simple and apply frequently changing applications and policy through a management platform.

### Migration

User State Migration Tool, or USMT, moves selected user files and settings between Windows installations.

`ScanState` collects the user state from the source. `LoadState` applies it to the destination. XML files define which applications, documents and settings should be included or excluded.

USMT is useful in a wipe-and-load deployment where the operating system must be replaced but the user experience should not start from zero.

A migration plan should answer several questions before running a tool:

- Which users are in scope?
- Which files and settings are business-relevant?
- Where will the migration store be kept?
- Is the device online or offline during capture?
- Which applications exist on the destination?
- How will the result be validated?

Migration tools do not remove the need to classify data. Copying every cache and temporary file can make the migration slower without helping the user.

### Provisioning

A provisioning package changes the configuration of an existing Windows installation without deploying a complete custom image.

Windows Configuration Designer can create a package containing settings such as device naming, wireless profiles, certificates, applications and enrollment information.

This is useful when a device already has a suitable Windows installation but needs to be transformed into an organizational device.

A provisioning package should still be protected and tested because it may contain sensitive configuration. The fact that it is easier to apply than a full image does not make every setting low-risk.

### Autopilot

Windows Autopilot moves more of the deployment process into cloud management.

Instead of building and maintaining a separate image for every device type, the organization registers a device identity and assigns a deployment profile. During the out-of-box experience, the user connects the device, signs in and receives the intended enrollment and configuration.

The hardware identity links the physical device to the deployment service. The deployment profile controls parts of the setup experience and defines how the device joins the organization's identity and management environment.

Intune can then apply configuration profiles, compliance policies, applications and security settings.

Autopilot does not mean that a device configures itself without dependencies. The process still relies on a supported Windows edition, internet connectivity, identity, licensing, assigned profiles and reachable cloud services.

It is best understood as a modern orchestration method. The original Windows installation normally remains the starting point, while organizational configuration is applied during enrollment.

A reset scenario can return a managed device to an organizationally ready state without repeating every manual setup step. This is useful when a device changes user or needs remediation, but the behavior should be tested with the applications and policies used in the environment.

### Pilot

Every deployment method should begin with a pilot.

The pilot group should represent real variations in the environment: different hardware, departments, applications, locations and working styles. Testing only with IT devices often misses the combinations that create problems for normal users.

A pilot should validate more than installation success. Check authentication, user data, applications, printers, network access, security policy, performance, recovery and support procedures.

The rollout can then expand through deployment rings. Each ring increases the audience while leaving time to observe problems before the change reaches every device.

## Enrollment

Device identity determines which management and access models can be used.

A workgroup device is managed locally unless another management agent is installed. A domain-joined device trusts Active Directory Domain Services and receives traditional domain policy. An Azure Active Directory joined device uses a cloud identity relationship. A hybrid joined device participates in both the on-premises and cloud identity environments.

Registration is lighter than join. A registered personal device can be associated with a work identity without becoming a fully organizational device.

The correct model depends on application dependencies, network access, management tools and ownership.

A personally owned device may receive limited application-level protection. A corporate device may be fully enrolled, configured and evaluated for compliance. Mixing those models without clear ownership leads to confusing user expectations and privacy concerns.

Enrollment should therefore answer both a technical and an organizational question: who owns this device, and what level of control is appropriate?

## Management

Windows can be configured locally, through Active Directory Group Policy, through mobile device management or through a combination of systems.

### Local

Local management is useful for standalone devices and exceptions.

Local Users and Groups, Local Security Policy, Registry Editor and Local Group Policy expose many settings directly on the computer. PowerShell and command-line tools make the same kind of work repeatable.

The weakness of purely local management is consistency. A setting changed manually on one device is easy to forget and difficult to audit across hundreds of devices.

Local configuration is therefore best used for testing, troubleshooting or systems that genuinely cannot be managed centrally.

`gpresult` and Resultant Set of Policy help show which policy settings are affecting a device or user. This is useful because the final configuration may be the result of local settings, domain policies and management profiles rather than one visible source.

### Group Policy

Group Policy provides centralized configuration for Active Directory joined devices.

Policies can target users or computers and can be linked to sites, domains and organizational units. Processing order, security filtering, inheritance and conflicts determine the effective result.

A good Group Policy design uses a small number of well-named policies with clear scope. One enormous policy is hard to troubleshoot, while hundreds of tiny policies can make processing and ownership difficult to understand.

Local Group Policy is processed before domain-based Group Policy. Domain policies can therefore override local settings when they configure the same value, subject to the normal processing and enforcement rules.

### MDM

Mobile device management applies settings through a management service rather than relying only on traditional domain connectivity.

Intune can enroll devices and assign configuration profiles, compliance policies, applications and remote actions. Windows exposes many manageable settings through configuration service providers, which allow the management platform to configure operating system components.

MDM is especially useful for internet-based and cloud-joined devices because management does not depend on a direct connection to an on-premises domain controller.

The management model should still be planned. Two systems configuring the same setting can create conflict. The organization should decide which workloads are controlled by Group Policy, Configuration Manager or Intune and how that responsibility will move over time.

### Co-management

Co-management allows an existing Configuration Manager device to also be managed through Intune.

Workloads can be moved in stages instead of requiring one immediate migration. For example, compliance policy may move to the cloud while application deployment remains in the existing platform.

This staged approach is useful when the organization has mature on-premises processes but wants cloud-based access and management capabilities.

The important part is workload ownership. A co-managed device should not receive two conflicting authorities for the same area without a deliberate precedence design.

### Profiles

A device configuration profile groups settings that should be assigned to a defined population.

Examples include security restrictions, wireless configuration, VPN settings, certificates and browser configuration. Profiles make these settings repeatable and reduce the need for users or support staff to configure every device manually.

Assignment should follow the purpose of the setting. User-focused configuration can target users, while hardware or security baselines often make more sense at device scope.

Before broad assignment, test how the profile behaves on different Windows editions and device states. A setting that is unsupported may be ignored, while two settings that control the same behavior can create an unexpected result.

## Security

Endpoint security combines hardware trust, operating system protection, identity controls and centralized policy.

No single control is enough. Disk encryption does not stop phishing. MFA does not fix a vulnerable driver. Antivirus does not prevent an administrator from granting excessive permissions.

### Defender

Microsoft Defender Antivirus provides antimalware protection in Windows. It monitors files, processes and behavior and can receive security intelligence updates independently of major operating system releases.

A centrally managed environment should define how real-time protection, exclusions, scanning and reporting are configured.

Exclusions deserve particular care. They may solve a performance or compatibility problem, but they also create areas that receive less inspection. An exclusion should be specific, documented and based on a known application requirement.

Attack surface reduction and exploit protection add controls beyond traditional file scanning. The aim is to limit common behaviors used during an attack, even when the exact malicious file has not been seen before.

### Firewall

Windows Defender Firewall protects the device on domain, private and public networks.

Rules can be based on application, service, protocol, port, address and direction. This is more precise than disabling the firewall when one application cannot communicate.

A troubleshooting process should determine what traffic the application needs, which profile is active and whether the block occurs locally or elsewhere in the network.

### BitLocker

BitLocker protects data when a device is powered off or a drive is removed.

A managed rollout should define encryption method, protectors, recovery-key storage and the response to recovery events. Devices should be checked for readiness before enforcement, especially when firmware or TPM state is inconsistent.

BitLocker should be combined with secure startup, strong sign-in and remote management. Encryption protects the stored data but does not stop an attacker who has already signed in with a valid account.

### Hello

Windows Hello for Business replaces reusable password-based sign-in with a device-bound key protected by a gesture such as a PIN or biometric verification.

The PIN is not simply a short password sent to a server. It unlocks cryptographic material protected on the device. This limits the usefulness of stealing the PIN without also possessing the enrolled device.

Deployment depends on identity, device registration, trust model and policy. Biometrics add convenience, but the underlying key-based authentication model is the more important security improvement.

### LAPS

Local administrator accounts can become a widespread weakness when every device uses the same password.

Local Administrator Password Solution rotates a unique local administrator password for each managed device and stores it in an authorized directory location.

This allows support staff to recover local access when needed without maintaining one shared credential across the environment.

Access to retrieve those passwords should itself be limited and audited.

### Compliance

A compliance policy evaluates whether a managed device meets defined requirements.

Examples include encryption, operating system version, password configuration or threat state. Noncompliance is a management signal. It becomes an access control when Conditional Access requires the device to be compliant before allowing access to an application.

This connection is important. Intune determines device state, while the identity platform evaluates whether that state is acceptable for the requested access.

A compliance policy should include a realistic remediation period and user communication. Immediately blocking every device for a minor configuration delay may create more operational disruption than security value.

### Access

Conditional Access combines signals such as user, application, device state, location and risk.

For managed desktops, this makes it possible to require stronger authentication or a compliant device for sensitive applications.

Policies should be introduced carefully. Start in a reporting or limited pilot mode, protect emergency access accounts and confirm that service accounts and unsupported clients are not accidentally blocked.

Legacy authentication should be reduced because it cannot participate in many modern access controls.

## Applications

Application management includes acquisition, packaging, deployment, configuration and removal.

Windows applications may come from a store, a traditional installer, a line-of-business package or an enterprise deployment platform. The installation format influences how the application can be detected, updated and removed.

Store applications use a packaged model with controlled installation and update behavior. Traditional Win32 applications may require custom command lines, detection rules and dependencies.

Sideloading allows a trusted application package to be installed outside the public store. This is useful for internal applications, but package signing and trust must be managed correctly.

Application deployment should also include version ownership. Installing software once is not the end of the lifecycle. The organization needs a method to update, replace and remove it.

User data should be separated from application binaries where practical. OneDrive and folder redirection can protect common user folders and make device replacement easier, while application caches can remain local.

Enterprise State Roaming was used to synchronize selected Windows settings for cloud identities. Like traditional roaming profiles, it was intended to improve continuity between devices, but it did not replace a full user-data strategy.

## Updates

Windows servicing separates different kinds of change.

Quality updates address security and reliability and are delivered regularly. Feature updates move the device to a newer Windows release. Drivers and updates for other Microsoft products can follow their own approval and deployment behavior.

A healthy update process balances speed and risk. Security fixes should not wait indefinitely, but deploying every change to all devices at the same moment gives the organization little time to detect compatibility problems.

Windows Update for Business introduced policy-based control over when managed devices receive updates from the Microsoft update service. Administrators could configure deferrals, deadlines, restart behavior and deployment rings without hosting every update package locally.

Update rings divide devices into stages.

A small early ring receives the change first. A broader pilot ring follows after observation, and the largest production ring receives the update when confidence is higher. Critical devices may have their own timing based on operational requirements.

The rings should contain representative devices rather than only volunteers who all use the same hardware.

Delivery Optimization reduces repeated internet downloads by allowing Windows content to be shared between suitable devices. This can reduce WAN usage, but the boundary and bandwidth settings should match the network design.

The course also used Windows Analytics and Desktop Analytics for inventory, compatibility and deployment readiness. Those names belonged to that period, but the lasting concept is still useful: use real device and application data to decide which systems are ready before a large upgrade.

Monitoring the update result is as important as assigning the policy. Check installation failures, restart state, compatibility holds and devices that have stopped reporting.

## Operations

A managed desktop environment needs an operating model after deployment.

### Monitoring

Inventory provides a view of hardware, software, driver and operating system versions. Compliance reporting shows whether devices meet policy. Security reporting adds information about malware, vulnerabilities and risky behavior.

These views should lead to action. A dashboard that shows fifty outdated devices is useful only when somebody owns the process for contacting users, fixing the deployment or replacing unsupported hardware.

Event logs, update reports and management telemetry provide different parts of the picture. A support engineer should know where each type of evidence is collected.

### Remote support

Remote Desktop provides a full remote session when it is enabled and the user is authorized. Quick Assist is designed for interactive support where the user can allow a helper to view or control the current session.

The choice depends on whether the user is present, how the device is connected and what the support policy allows.

Remote support should use trusted identities and should not become a way to bypass normal administrative controls.

### Troubleshooting

A consistent troubleshooting process is more valuable than memorizing one fix for every symptom.

Start by defining the problem precisely. Determine what changed, which users and devices are affected and whether the issue can be reproduced.

Then collect evidence before making several unrelated changes. Event logs, Task Manager, network tests, `gpresult`, Device Manager and management reports all answer different questions.

Change one layer at a time and record the result. If a problem disappears after five simultaneous changes, the underlying cause remains unknown and may return later.

### Maintenance

Routine maintenance includes updates, security scans, storage health, policy evaluation and cleanup.

Automatic Maintenance can schedule background tasks when the device is available. Enterprise management adds broader reporting and control, but the device still needs enough online time to receive policy and complete maintenance.

A laptop that is powered on for only a few minutes before every meeting may remain technically managed while repeatedly missing updates and scans.

### Lifecycle

Every device eventually reaches the end of its useful life.

A replacement process should preserve required user data, remove organizational access, reset or wipe the old device and update inventory records.

Retiring a device from one management portal is not always enough. The identity object, Autopilot registration, encryption recovery information and application assignments may all have their own lifecycle.

The same applies when a device changes user. Reassigning the computer without removing the previous user's data and access can create both privacy and support problems.

## Summary

MD-100 and MD-101 connected the internal operation of Windows with the larger process of managing a desktop fleet.

Windows itself provides the foundations: boot, processes, services, drivers, identities, profiles, permissions, networking, encryption and recovery. Deployment methods then place that operating system on a device while preserving or rebuilding the required user state. Enrollment connects the device to a management and identity model. Policies, security controls, applications and update rings keep the environment consistent after deployment.

The most important lesson is that desktop management is a lifecycle rather than a one-time installation.

A device must be planned, deployed, enrolled, configured, protected, monitored, updated, supported and eventually retired. The more predictable each stage becomes, the easier the complete environment is to operate.

{{< ads >}}

{{< article-footer >}}
