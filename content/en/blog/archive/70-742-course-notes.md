---
title: "70-742 Course notes"
slug: "70-742-course-notes"
date: 2020-05-14
tags: Concepts
categories:
- Archive
description: "This page contains my older 70-742 notes about identity with Windows Server 2016."
---

These notes cover the main subjects from 70-742: Identity with Windows Server 2016. The course focused on Active Directory Domain Services, users and groups, service accounts, replication, Group Policy, certificates, federation and rights management.

Active Directory is easier to manage when it is treated as an identity system rather than a directory full of user accounts. Its database, DNS records, replication topology, sites, policies and certificate services all contribute to how users and computers authenticate and receive access.

Some federation and rights-management workflows in this article reflect the Windows Server 2016 era. The foundational concepts remain useful.

## Directory

Active Directory Domain Services stores identities and configuration in a distributed directory.

A domain is an administrative and replication boundary containing objects such as users, computers, groups and organizational units.

A tree is a set of domains in a contiguous DNS namespace. A forest contains one or more domain trees and forms the main security and schema boundary.

Domains inside one forest share the schema, configuration partition and global catalog and have transitive trust relationships.

An organizational unit, or OU, is a container used for delegation, organization and Group Policy targeting. It is not a security boundary. An administrator with sufficient rights at the domain level can still control objects inside an OU.

The directory database is stored in `NTDS.dit`. SYSVOL stores shared policy and script information that must be available across domain controllers.

Active Directory depends on DNS. Clients use service records to locate domain controllers, Kerberos services and global catalogs. A domain controller with broken DNS configuration may appear healthy locally while clients cannot find it correctly.

### Controllers

A domain controller hosts writable or read-only directory partitions and provides authentication and directory services.

Installing the AD DS role prepares the server. Promotion then creates a new forest, adds a domain to an existing forest or adds another domain controller to an existing domain.

A production domain normally has more than one domain controller so authentication and directory services do not depend on one server.

A Global Catalog server holds a full writable copy of its own domain partitions and a partial attribute set for objects in other forest domains. This helps users and applications search the forest and supports universal group membership during sign-in.

The first domain controller in a forest establishes several defaults, but later controllers should share service responsibility. DNS and Global Catalog placement should match sites and application requirements.

A domain controller should use stable networking and reliable name resolution. It should not depend on an external DNS resolver for the Active Directory namespace.

### RODC

A Read-Only Domain Controller hosts read-only copies of directory partitions and is designed for locations where physical security or administrative control is limited.

Changes cannot originate on the RODC and replicate back into the writable directory.

The Password Replication Policy controls which account credentials may be cached locally. Allowed accounts can sign in when the WAN connection is unavailable after their credentials have been cached. Denied accounts always depend on a reachable writable domain controller.

Administrative role separation allows a local technician to manage the server without becoming a domain administrator.

The RODC can also host read-only DNS zones and provide local authentication and name resolution in a branch.

The design should carefully decide which credentials may be cached. Highly privileged accounts should normally remain excluded.

### IFM

Install from Media can seed a new domain controller from a recent directory backup or installation media rather than transferring every directory object across the network.

The new controller still contacts an existing domain controller for current changes and normal promotion, but the initial data can reduce WAN use.

Installation media must be created from a suitable domain controller and protected because it contains directory information.

### Cloning

Domain controller cloning allows a supported virtual domain controller to be copied through a controlled process.

The source controller must meet the cloning requirements and use only clone-compatible applications and services. A cloning configuration file defines the new name, network settings and site.

Cloning is different from casually copying a running domain controller virtual machine. Active Directory relies on unique identities and replication state. Unsupported copying can create serious directory problems.

Modern virtualization safeguards also protect supported domain controllers against some rollback scenarios, but backup and cloning should still use documented methods.

### Demotion

A domain controller should be demoted cleanly before it is removed.

Demotion transfers or removes directory responsibilities, updates metadata and allows other controllers to learn that the server is no longer part of replication.

If a controller is permanently lost and cannot be demoted, metadata cleanup removes the stale server, NTDS settings, connections and related records.

Before forced removal, confirm whether the lost controller held FSMO roles, Global Catalog responsibilities, DNS zones or application dependencies.

Removing the final domain controller in a domain or forest is a larger operation and should be treated as a decommissioning project rather than a normal server replacement.

## FSMO

Most Active Directory changes use multi-master replication, but five operations are assigned to single role holders to avoid conflicting changes.

Two roles exist once per forest.

The Schema Master controls updates to the schema. Schema extensions add or modify object classes and attributes and should be treated as controlled forest-wide changes.

The Domain Naming Master controls adding and removing domains and application directory partitions in the forest.

Three roles exist once per domain.

The RID Master allocates pools of relative identifiers to domain controllers. A domain controller combines a RID with the domain identifier to create a unique security identifier for a new security principal.

The PDC Emulator processes several time-sensitive and compatibility functions. It is the preferred source for recent password changes, the normal target for Group Policy editing, the domain time authority and an important participant in account lockout behavior.

The Infrastructure Master maintains cross-domain object references. Its placement matters mainly in multi-domain forests when not every domain controller is a Global Catalog.

Role holders can be transferred during planned maintenance. A role is seized only when the previous holder will not return.

Seizing a role is not a normal load-balancing action. The old controller should not be returned to the environment without proper cleanup after a role has been seized away from it.

## Objects

Users, computers and groups are directory objects with attributes, security descriptors and unique identifiers.

A naming standard makes objects easier to search, automate and audit. Display names can remain friendly while logon names, service accounts and computer names follow a predictable operational convention.

Organizational units should be designed around delegation and policy rather than copied blindly from an organization chart. A department may change frequently, while the management boundary for servers, clients or privileged accounts may remain stable.

### Users

A user account has authentication information and attributes used by applications and administration.

Accounts can be created through graphical tools, command-line utilities or PowerShell.

PowerShell becomes especially useful for bulk operations. Data from a CSV file can be validated and used to create accounts consistently, assign group memberships and populate attributes.

Automation should include error handling and a clear source of truth. A script that creates five hundred incorrect accounts consistently is not a successful automation.

Templates or copied users can provide defaults, but inherited group membership and profile settings should be reviewed rather than accepted automatically.

When an employee leaves, disabling the account is often the first reversible action. Data ownership, group membership, delegated access and application assignments should be handled through an offboarding process before final deletion.

### Computers

A computer account represents the trust relationship between a domain member and the domain.

The account has its own password, maintained automatically by the computer. A broken secure channel can cause domain sign-in and policy problems even when the user's credentials are correct.

Computer accounts can be prestaged in the intended OU before deployment. This gives the device the correct delegation and policy location from its first domain join.

Offline Domain Join creates a provisioning package that can join a computer to the domain without contacting a domain controller during the join itself. The device still requires connectivity later to use normal domain services.

This is useful for remote deployment and image workflows where direct domain connectivity is not available at the exact joining stage.

### Rights

User rights define operating system actions such as signing in locally, signing in through Remote Desktop, backing up files, changing the system time or running as a service.

These are different from permissions on a file or directory object.

A user may have permission to read a folder but still lack the user right required to sign in to the server hosting it.

User rights are normally assigned through groups and policy. Powerful rights such as debugging programs, taking ownership or acting as part of the operating system should be restricted carefully.

## Groups

Groups make permissions and administration scalable.

A security group can receive permissions. A distribution group is intended mainly for messaging and is not used as a normal security principal.

Group scope determines where members can come from and where the group can be used.

A global group normally contains accounts or other global groups from its own domain and can receive permissions across trusted domains.

A domain local group can contain members from trusted domains and is normally used to receive permissions on resources in its own domain.

A universal group can contain accounts and groups from multiple forest domains and can receive permissions throughout the forest. Universal membership is stored in the Global Catalog, so changes should be considered in multi-site environments.

A common resource-access model is AGDLP:

- Accounts are placed in Global groups.
- Global groups are placed in Domain Local groups.
- Permissions are assigned to the Domain Local groups.

In a multi-domain design, AGUDLP introduces Universal groups between the global and domain local layers.

The benefit is separation of meaning. A global group describes who the people are, while a domain local group describes what access is granted to a resource.

Nested groups should remain understandable. Deep or circular-looking membership makes troubleshooting access difficult even when Active Directory can technically process it.

Group membership can also be controlled through Group Policy for selected local groups. Restricted Groups and Group Policy Preferences solve different management scenarios and should be tested so they do not unexpectedly replace required members.

## Services

Applications and Windows services often need an identity.

A normal user account can technically run a service, but it introduces password-expiration, interactive sign-in and lifecycle problems.

A managed service account is designed for one computer and allows Windows and Active Directory to manage the password.

A group Managed Service Account can be authorized for several computers, making it useful for farms or clustered services that need the same identity.

The Key Distribution Service root key must exist before gMSAs can generate passwords. The account defines which computers are allowed to retrieve the managed password.

The service then uses the account without an administrator manually setting or rotating a password.

A service account should not receive normal interactive sign-in unless the workload explicitly requires it. Permissions should be limited to the service and resources it needs.

### SPN

A Service Principal Name maps a Kerberos service instance to the account under which the service runs.

The SPN contains a service class and service name, often including the host and optional port.

Kerberos uses the SPN to determine which account owns the service and therefore which key can decrypt the service ticket.

Duplicate or missing SPNs cause authentication failures and may lead applications to fall back to another method.

SPNs should be registered on the correct computer or service account and checked before manually adding new entries.

### Delegation

Kerberos delegation allows a front-end service to access another service on behalf of a user.

Unconstrained delegation gives broad capability and creates significant exposure if the delegated system is compromised.

Constrained delegation limits the account to specified back-end services.

Resource-based constrained delegation places the decision on the back-end resource and simplifies several cross-domain and deployment scenarios.

Delegation solves the double-hop problem, but it should be granted only where an application genuinely needs to pass a user's identity to another service.

The service accounts, SPNs and supported authentication flow must align. Configuring a delegation checkbox without understanding the application path rarely fixes the underlying problem.

## Policies

Account policies define password, lockout and Kerberos behavior.

The normal domain account policy should be configured at domain scope so domain controllers apply one consistent default.

Password policy includes minimum length, history, age and complexity behavior. Longer passwords and resistance to common or breached passwords matter more than requiring users to create predictable variations every few weeks.

Account lockout can slow password guessing but may also be abused to deny service to users. Threshold, duration and reset values should reflect the threat and support process.

Kerberos policy controls ticket lifetimes and renewal behavior. Defaults are usually appropriate unless an application or security requirement has been evaluated carefully.

Fine-Grained Password Policies allow different password and lockout settings for selected users or global security groups in one domain.

They are useful for privileged or service populations that require a different policy, but too many policies make the effective result difficult to understand.

The resultant policy is determined through precedence, and the target should be verified rather than assumed.

## Maintenance

Active Directory is a distributed database and needs operational maintenance even when replication appears healthy.

### Database

The directory database reuses free space internally after objects are removed. Offline defragmentation can create a compact database file but requires stopping directory services and is rarely routine maintenance.

Snapshots created through `ntdsutil` can provide a point-in-time view of directory data for comparison. They are not a normal writable restore and should not replace backup.

The Active Directory Recycle Bin preserves additional information for deleted objects and allows supported objects to be restored without an authoritative system-state restore.

It should be enabled as a forest-wide decision and included in the recovery process.

### Backup

A system-state backup of a domain controller protects the directory database, SYSVOL, registry and other required system components.

A non-authoritative restore returns the controller to a known backup state and then allows normal replication to update it from other domain controllers.

An authoritative restore marks selected objects or data so the restored version replicates outward as the version that should win.

The appropriate method depends on whether the controller itself failed or whether valid directory objects were deleted or corrupted throughout replication.

Restoring a very old domain controller backup can violate directory lifetime and replication assumptions. Backup retention should align with Active Directory's supported recovery limits.

Recovery procedures should be practiced in an isolated environment. A forest recovery is not the time to discover that nobody knows the Directory Services Restore Mode password or where the system-state backups are stored.

### Metadata

A failed domain controller that cannot return must be cleaned from the directory.

Metadata cleanup removes the server object, NTDS settings and replication references. DNS records, sites, services and application configuration should also be checked.

If the controller held FSMO roles, those roles may need to be seized. If it was a DNS server or Global Catalog, clients and sites may need replacement services.

The cleanup process should begin only after confirming that the old server will not be brought back.

## Replication

Active Directory uses multi-master replication for most writable directory data.

Domain controllers replicate naming contexts through connection objects generated by the Knowledge Consistency Checker or configured manually.

Within a site, replication is optimized for speed and frequent convergence. Between sites, site links, costs, schedules and transport assumptions control how replication uses WAN connections.

Change notification and scheduled polling help partners learn about updates. Update sequence numbers and invocation identifiers allow controllers to track which changes have already been received.

Replication metadata is more useful than simply comparing timestamps because clocks can differ and one object may contain attributes updated independently on different controllers.

Tools such as `repadmin` and directory event logs help identify failures, lingering objects and topology problems.

### Sites

An Active Directory site represents one or more well-connected IP subnets.

Clients use their subnet to find the nearest site and prefer suitable domain controllers and services in that location.

If subnets are missing or assigned incorrectly, clients may authenticate across slow WAN links even when a local domain controller exists.

Site links describe connectivity between sites. Cost expresses preference, while schedule and replication interval control when normal intersite replication occurs.

Site link bridging assumes that site links are transitively routable. Designs with restricted network paths may need explicit control rather than relying on the default assumption.

Bridgehead servers handle intersite replication traffic. The KCC normally selects them automatically.

A site design should follow network connectivity, not office naming alone.

### RODC replication

An RODC receives directory changes from writable partners but does not originate normal changes.

The Password Replication Policy controls credential caching. The administrator can review which credentials have been cached and which accounts authenticated through the RODC.

Prepopulating selected credentials can prepare a branch for WAN failure. Sensitive accounts should remain denied.

A stolen RODC can be removed while identifying the accounts whose credentials were cached so those passwords can be reset.

## Forests

A single forest provides the simplest identity, schema and trust model.

Additional domains may be used for namespace, administrative or historical requirements, but they add domain controllers, policies, replication and operational complexity.

A separate forest creates a stronger identity and schema boundary. It may be appropriate for isolation, acquisition, administrative separation or incompatible directory requirements.

Domain and forest functional levels enable directory capabilities after all relevant domain controllers support the required Windows Server version.

Raising a functional level should be planned because older domain controller versions can no longer participate afterwards.

The forest root domain has special significance because it is created first and contains forest-wide administrative groups. Some designs use an empty-root model, while many environments keep the first domain as the normal production root.

The best design is normally the simplest one that meets the actual boundary requirements.

## Trusts

A trust allows authentication relationships between domains or forests.

Domains inside one forest use automatic transitive trusts. External trusts connect specific domains. Forest trusts connect forest namespaces. Realm trusts support Kerberos relationships with compatible non-Windows realms.

A one-way trust direction describes which side trusts identities from the other side. Access still requires permissions on the resource.

Trust authentication can be forest-wide or selective. Selective authentication requires explicit permission for trusted identities to authenticate to selected computers or services.

A shortcut trust can improve authentication paths between domains in a complex forest.

Trusts do not merge directories. User objects, groups, policies and administration remain in their original domains or forests.

DNS resolution, time, ports and name suffix routing must work before a trust can be used reliably.

## GroupPolicy

Group Policy applies central configuration to users and computers.

A Group Policy Object contains computer and user settings. The object is linked to a site, domain or OU, and its scope is further controlled through security filtering and optional WMI filters.

The basic processing order is Local, Site, Domain and Organizational Unit, often remembered as LSDOU.

Later settings normally win when several policies configure the same value, although inheritance blocking, enforcement, loopback processing and setting-specific behavior can change the result.

Policies linked to nested OUs are processed from parent to child. Link order determines precedence when several GPOs are linked at the same level.

The Default Domain Policy and Default Domain Controllers Policy provide baseline domain settings. Keeping them focused on their intended purposes makes recovery and troubleshooting easier. Additional settings should normally use clearly named separate GPOs.

### Processing

Security filtering determines whether the user or computer has permission to read and apply the GPO.

A WMI filter evaluates device information such as operating system version or hardware. WMI filters are powerful but can slow processing and are often avoidable through better OU or group targeting.

Enforced links prevent lower containers from overriding selected policy. Block Inheritance stops normal policies from higher containers but does not stop enforced links.

Loopback processing applies user settings according to the computer's OU. Replace mode ignores the user's normal user-GPO list and uses the computer location. Merge mode combines both, with the computer-linked user settings receiving later precedence.

Loopback is useful for kiosks, Remote Desktop Session Hosts and other computers where the user experience should be based mainly on the device.

Slow-link detection can change which client-side extensions are processed across limited connections.

`gpresult`, Resultant Set of Policy, event logs and the Group Policy Results wizard show the effective policy and processing history.

### Preferences

Group Policy Preferences configure items such as mapped drives, shortcuts, files, scheduled tasks, local users and registry values.

Preferences can use item-level targeting based on group membership, IP range, operating system, registry information and other conditions.

Unlike policy settings, preferences often tattoo a setting: removing the GPO may not automatically return the previous value unless the item was configured to remove itself when no longer applied.

Actions such as Create, Replace, Update and Delete determine how the preference item changes the destination.

Preferences improve flexibility but should not be used to store reusable passwords or other secrets.

### Delegation

GPO creation, editing, linking and reporting can be delegated separately.

A team may be allowed to edit approved GPOs without receiving permission to link them anywhere. Another team may link existing policies to a particular OU.

Separating these rights reduces the chance that one delegated administrator can introduce an uncontrolled domain-wide setting.

Backups preserve the GPO contents and can be imported into another GPO. Starter GPOs provide templates for selected Administrative Template settings.

Every GPO should have an owner, purpose, scope and rollback plan.

## Certificates

Active Directory Certificate Services provides a public key infrastructure for issuing and managing certificates.

A certificate binds a public key to an identity or service name. The corresponding private key must remain protected.

Certificates can support authentication, encryption, signing, TLS, EFS, smart cards, VPN and many other services.

Trust depends on the certification authority chain. A client trusts a certificate when it trusts the issuing CA path, the certificate is valid for the intended purpose and revocation checks do not indicate that it has been revoked.

### Hierarchy

A root CA is the trust anchor.

An enterprise CA integrates with Active Directory and certificate templates. A standalone CA has less directory integration and is useful for offline roots or isolated issuance scenarios.

A common enterprise hierarchy uses an offline standalone root CA and one or more online enterprise subordinate issuing CAs.

Keeping the root offline reduces exposure of the most important private key. The root is brought online only for controlled operations such as signing subordinate CA certificates or publishing a new revocation list.

A single-tier hierarchy is simpler but exposes the root during normal issuance. A multi-tier hierarchy increases operational work but separates trust from day-to-day certificate enrollment.

The hierarchy should match the organization's scale and recovery ability. A complicated PKI that nobody can maintain is not automatically safer.

### Templates

Certificate templates define subject information, key usage, cryptographic settings, validity, enrollment permissions and whether private keys may be exported or archived.

Enterprise CAs issue certificates from published templates.

Autoenrollment can automatically request and renew certificates for users and computers through Group Policy.

Template permissions should separate who may read, enroll and autoenroll. Granting enrollment on a powerful authentication template to a broad group can create an unintended privilege path.

Template versions provide different capabilities and compatibility.

### Enrollment

Certificates can be requested through the Certificates console, command-line tools, web enrollment, autoenrollment, Network Device Enrollment Service or application-specific methods.

The subject and Subject Alternative Name must match the service. A web server certificate with the wrong DNS name will not become valid simply because it was issued by a trusted CA.

Private keys should be generated and stored in a suitable provider, preferably hardware-backed where the threat model requires it.

Key archival allows selected encryption private keys to be recovered by authorized key recovery agents. It should be used only where business recovery requirements justify the added sensitivity.

### Revocation

A CA publishes Certificate Revocation Lists containing certificates that should no longer be trusted.

CRL Distribution Point extensions tell clients where the lists can be retrieved. Authority Information Access can identify issuer certificates and Online Certificate Status Protocol responders.

An offline root still needs to publish valid revocation information before its CRL expires.

Revocation design should remain reachable from every relying network. A certificate can be technically valid yet unusable when the client cannot check the required revocation endpoint.

CA backup includes the CA database, configuration and private key. Restoring the server without the issuing key does not restore the same CA identity.

## Federation

Active Directory Federation Services provides claims-based federation.

Instead of giving an external application direct access to the directory password, AD FS authenticates the user and issues a signed security token containing claims.

A relying party trusts tokens from the federation service. A claims provider supplies or authenticates identities.

Claims can describe information such as user identifier, group, email address or other attributes. Claim rules transform directory information into the claim set expected by the application.

Certificates protect several parts of the service:

- The service communication certificate protects HTTPS.
- The token-signing certificate signs issued tokens.
- The token-decrypting certificate protects encrypted token content where used.

A federation server farm provides availability. Farm members share configuration through the supported database model.

Web Application Proxy publishes AD FS externally and acts as the federation proxy. External clients connect to the proxy rather than directly to the internal federation servers.

Federation trusts do not work merely because two servers are installed. Names, certificates, time synchronization, DNS, endpoints and claim rules must all align.

AD FS solves application federation and claims scenarios. It should not be confused with a normal Active Directory domain or forest trust.

## Rights

Active Directory Rights Management Services protects supported documents and messages through usage rights.

Traditional file permissions control access to the file in its storage location. Rights management travels with the protected content and can continue to restrict actions after the file has been copied elsewhere.

A rights policy template may allow a user to read content while preventing printing, editing or forwarding.

The AD RMS cluster issues licenses and protects content encryption keys. A service connection point helps domain clients discover the service.

Applications must support the rights-management format and enforcement. Rights management cannot stop every possible way of capturing information, such as photographing a screen, but it can significantly reduce normal redistribution and misuse.

The service requires careful recovery planning because protected information may depend on the cluster keys and configuration long after the original server was deployed.

## Summary

70-742 connects directory structure, authentication and policy into one identity platform.

Domain controllers store and replicate the directory. Sites and DNS help clients locate the correct services. Users, computers, groups and managed service accounts represent identities with different lifecycles. Kerberos, SPNs and delegation allow applications to use those identities securely.

Group Policy turns directory placement into configuration, while Certificate Services adds public key trust. AD FS extends identity to claims-based applications, and AD RMS adds controls to supported information.

The central lesson is that Active Directory should be designed for recovery and delegation from the beginning.

A directory may continue working for years with informal naming, permanent privilege and untested backups, but every future migration or outage becomes harder. A predictable structure, limited administration, healthy replication and tested recovery make identity dependable rather than merely available.

{{< ads >}}

{{< article-footer >}}
