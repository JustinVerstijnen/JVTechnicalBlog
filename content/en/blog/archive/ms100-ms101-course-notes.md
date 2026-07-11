---
title: "MS-100 + MS-101 Course notes" 
slug: "ms100-ms101-course-notes" 
date: 2021-04-22 
tags: Concepts 
categories:
- Archive
description: "This page contains my older MS-100 and MS-101 notes which became MS-102 later." 
---

These notes cover the main concepts I studied around the MS-100 and MS-101 era of Microsoft 365 administration. The course material focused heavily on identity, access, device management, information governance and security. Product names, portals and individual features have changed over time, but many of the underlying principles are still useful when thinking about how a Microsoft 365 environment should be designed and operated.

The common theme across almost every subject is that Microsoft 365 is not just a collection of applications. Identity connects users to services, device management determines how trusted endpoints are configured, governance controls how information is handled and security tools bring signals from different parts of the environment together.

## Identity

Identity sits at the center of Microsoft 365.

In a traditional on-premises environment, Active Directory Domain Services gives users one identity that can be used across domain-joined computers and internal applications. A cloud identity platform extends that idea beyond the local network. The same identity can be used to access email, collaboration tools, SaaS applications, administrative portals and custom applications.

This central identity makes life easier for users because they do not need a separate username and password for every service. It also makes administration more consistent. When access is managed centrally, disabling one identity can remove access to many connected services at once instead of relying on somebody to remember every separate application account.

That convenience also means identity becomes a very important security boundary. If an attacker gains control of an account, especially an administrative account, the impact can extend across many services. Identity management is therefore not only about creating users and assigning licenses. It is about controlling who can sign in, what they can access and under which conditions that access should be allowed.

Single sign-on is a major part of this model. A user authenticates with a trusted identity provider and can then access connected applications without repeatedly entering credentials. Different applications support different authentication methods, so the way single sign-on is implemented depends on the application.

Common standards include SAML, OAuth 2.0 and OpenID Connect. Some older or internal applications may use other methods, including password-based or Windows-integrated authentication.

The important idea is that central identity should reduce the number of separate credentials without reducing the amount of control administrators have over access.

## Access

Once identities exist, the next challenge is making sure they receive the right access.

A user should have enough access to do their job, but not much more than that. This sounds simple until employees change roles, teams are reorganized, external partners are invited and temporary projects come and go. Access that was correct six months ago may no longer be correct today.

Identity governance helps bring structure to this problem.

External collaboration is a good example. A partner may need access to a shared team, a SharePoint site or an application, but that does not mean the partner should become a normal internal user. Guest access allows external identities to collaborate while remaining separate from the internal workforce.

The useful part is not simply being able to invite a guest. The real challenge is controlling the lifecycle of that access.

An external user may need access only to a specific project and only for a limited period. Terms of use can be presented before access is granted. Access packages can group resources together so that access is requested and approved as one logical package. Connected organizations can help structure collaboration with known external organizations.

Access reviews then provide a way to check whether permissions are still needed.

This is especially useful for groups, applications, privileged roles and guest users. Instead of assuming that access remains correct forever, the organization can periodically ask the relevant owner or reviewer to confirm it.

That turns access management into a lifecycle:

1. Access is requested or assigned.
2. The user receives only the resources that are required.
3. Access is reviewed over time.
4. Access is removed when the user, role or business need changes.

This same principle applies to internal users. A person moving to another department should not automatically keep every permission from the previous role. The longer an organization operates without reviewing access, the more likely it becomes that permissions accumulate.

The goal is not to create as many access rules as possible. The goal is to make access understandable and temporary where appropriate.

## Authentication

A central identity is valuable only when the authentication process is strong enough to protect it.

Passwords alone are a weak foundation because they can be guessed, reused, phished or stolen. The more services that depend on one identity, the more valuable that password becomes to an attacker.

Multi-factor authentication adds another verification step. Instead of relying only on something the user knows, authentication can also require something the user has or another strong verification method.

This does not make every account impossible to compromise, but it significantly changes the attack. A stolen password by itself is no longer enough.

The way MFA is applied also matters. Enabling a security feature individually for hundreds or thousands of users is difficult to manage consistently. Policy-based access is a better model because the organization can define when additional verification is required.

Conditional Access is built around that idea.

Instead of treating every sign-in in exactly the same way, a policy can consider context such as:

- The user or group
- The application being accessed
- The device
- The location
- The sign-in method
- The risk level
- The compliance or trust state of the device

The result of the policy can then be to allow access, block access or require an additional control such as MFA.

This is much more flexible than a simple rule that says every sign-in is either allowed or denied.

A normal user signing in to a familiar application from a managed device may present a different level of risk than an administrator signing in to a management portal from an unknown device. The access decision should be able to reflect that difference.

Legacy authentication protocols are an important part of this discussion because older protocols often do not support modern authentication controls in the same way. Keeping an old protocol enabled for one forgotten application can create a path around stronger controls that protect the rest of the environment.

A good authentication strategy therefore combines strong authentication, modern protocols and policy-based access.

Password protection, self-service password reset and smart lockout can support that strategy as well. The goal is not only to make passwords more complicated. It is to reduce the dependency on passwords and make recovery safer when a credential is lost or compromised.

## Privilege

Administrative access deserves more protection than normal user access.

A user account that can read email has a different impact from an account that can change identity settings, security policies or tenant-wide configuration. The more powerful the role, the more carefully it should be assigned and used.

Role-based administration helps by separating responsibilities.

A helpdesk administrator may need to reset passwords but does not need full control over every service. A groups administrator needs to manage groups. A billing administrator handles subscriptions and purchasing. A global reader may need broad visibility without the ability to make changes.

The exact roles are less important than the principle: do not use the most powerful role for every administrative task.

Global administrative access should be limited. Powerful accounts should use strong authentication and should not be used for ordinary daily work.

This is where privileged identity management becomes valuable.

Instead of giving somebody permanent administrative rights, a role can be made eligible and activated only when needed. The activation can be time-limited and may require extra controls such as MFA, approval or justification.

This is commonly described as just-in-time access.

The advantage is simple. If an account is compromised while it does not have an active privileged role, the attacker does not automatically inherit permanent administrative power.

Privileged work should also be separated from normal browsing and productivity where possible. An administrator who uses the same session for email, web browsing and highly sensitive management tasks creates more opportunities for a compromise to reach privileged credentials.

A dedicated administrative workstation or hardened administrative environment reduces that exposure by separating sensitive work from everyday activity.

The overall goal is to reduce standing privilege.

Administrative access should be:

- Assigned to the correct role
- Used only when needed
- Protected with strong authentication
- Monitored
- Reviewed
- Removed when it is no longer required

The strongest role should not be the default tool for getting work done.

## Risk

Authentication policies can define what should happen under normal conditions, but some sign-ins deserve additional attention because they look unusual.

Identity risk systems use signals to detect behavior that may indicate a compromised account. A sign-in may originate from an unexpected location, follow a suspicious pattern or involve credentials that appear to have been exposed.

The useful part is not only detecting that risk. The environment should also have a response.

A risky sign-in may require stronger authentication. A risky user may be required to reset a password through a trusted recovery process. A sufficiently serious event may result in access being blocked until the identity can be investigated.

This makes identity security more dynamic.

Instead of relying only on static rules, access decisions can respond to what is happening around the account.

Risk should still be investigated in context. An unusual sign-in is not automatically an attack, and a normal-looking sign-in is not automatically safe. Risk signals are inputs into the access decision rather than perfect answers on their own.

The best result comes from combining identity signals with device state, application access, user behavior and broader security monitoring.

## Trust

The move towards cloud services and mobile work changed the traditional idea of the network perimeter.

A user may work from home, from a mobile device or from a partner location. Applications may run in a datacenter, in a public cloud or as SaaS services. Data can move between all of these environments.

That makes the old assumption of "inside the network is trusted, outside the network is untrusted" much less useful.

Zero Trust starts from a different position.

Every access request should be evaluated based on the available context. Identity, device state, location, application, data sensitivity and unusual behavior can all contribute to the decision.

Three principles are particularly useful.

First, verify explicitly. Do not grant access only because a device is connected to a familiar network. Use the available signals to authenticate and authorize the request.

Second, use least privilege. Give users, services and administrators only the access they actually need, and prefer temporary privilege where practical.

Third, assume breach. Design the environment with the expectation that an account or device may eventually be compromised. Segmentation, monitoring and limited privilege reduce the amount of damage that one compromise can cause.

Zero Trust is therefore not one product or one policy.

It applies across several layers.

Identities need strong authentication and controlled access. Devices need to be managed and evaluated. Applications need to be monitored and given appropriate permissions. Data should be classified and protected. Infrastructure should be hardened and monitored. Networks should be segmented so that one compromised system does not automatically provide unrestricted access to everything else.

The useful way to think about Zero Trust is as a design principle that connects many separate security controls.

## Applications

Modern authentication is also important when applications need to work with user identities.

An application should not need to collect and store a user's password simply to access another service on that user's behalf.

OAuth 2.0 and OpenID Connect solve different parts of this problem.

OAuth 2.0 is primarily an authorization framework. It allows an application to receive permission to access a resource without the user handing over the password for that resource.

OpenID Connect adds an identity layer on top of OAuth 2.0 and allows an application to authenticate the user.

A simplified flow looks like this:

1. The user authenticates with the identity provider.
2. The identity provider issues a token.
3. The application receives the token.
4. The application validates the token and uses the information it contains to make an access decision.

Tokens make it possible to separate authentication from the application itself.

This also allows the organization to apply central controls such as MFA, Conditional Access and account lifecycle management without requiring every application to invent its own identity system.

The broader lesson is that identity should be treated as a shared platform service.

Applications should integrate with trusted identity standards rather than creating isolated authentication systems wherever possible.

## Deployment

Microsoft 365 administration is not only about identities and cloud services. The endpoint environment also needs to move with the organization.

A modern deployment should be treated as a process rather than one large migration weekend.

Before deploying a new operating system or productivity suite, start by understanding the current environment. Which devices are in use? Which applications are business-critical? Which drivers or integrations may cause problems? Which users represent the different types of work performed in the organization?

Inventory comes first because it is difficult to plan a migration around systems you do not know exist.

Once the inventory is clear, applications and devices can be prioritized. Critical applications deserve more testing than software that is rarely used. Compatibility problems can then be identified before they affect the entire organization.

A sensible deployment flow looks roughly like this:

1. Inventory devices, applications and dependencies.
2. Check hardware and application readiness.
3. Review identity and network requirements.
4. Prepare productivity applications and business software.
5. Plan the migration of user files and settings.
6. Update security and compliance configuration.
7. Start with a representative pilot group.
8. Expand the rollout in controlled stages.
9. Train users on the changes that affect their work.

The pilot group is important because a technically successful deployment can still fail when it is tested only with IT staff.

A representative pilot should include different departments, device types and working styles. The purpose is not only to find technical bugs. It is also to discover process issues and user impact before the rollout becomes large.

Deployment is therefore a combination of technology, testing and communication.

## Devices

As work became more mobile, device management moved from being an optional extra to becoming part of the security model.

A managed device can receive configuration, applications, security settings and compliance policies from a central platform. This gives administrators a more consistent way to support laptops, desktops, phones and tablets, regardless of whether the device is inside the office.

Planning device management starts with choosing the management model.

An organization may use cloud-based management, an existing on-premises management platform or a combination of both. The right model depends on the devices, applications and infrastructure already in place.

The important part is to avoid creating overlapping control without understanding which platform is responsible for which setting.

If the same device receives one configuration from traditional policy and a conflicting configuration from a mobile device management platform, troubleshooting becomes difficult. Policy ownership should therefore be planned before large-scale enrollment begins.

Infrastructure also matters.

Cloud management reduces the need for local management servers, but the endpoints still need reliable connectivity to cloud services. Moving software distribution, updates and management traffic to the internet can also change bandwidth requirements.

Technologies such as peer-to-peer delivery optimization can reduce repeated downloads by allowing devices to share content locally where appropriate.

Device policies should follow the same principle as identity policies: configure what is required for security and operations without adding unnecessary complexity.

The goal is a consistent device state that can be understood and evaluated.

That can include:

- Security settings
- Update requirements
- Encryption
- Application deployment
- Device restrictions
- Compliance requirements
- Remote actions when a device is lost or no longer trusted

Device management becomes especially important in a Zero Trust model because the identity of the user is only one part of the access decision. The condition of the device matters as well.

## Governance

A productive cloud environment generates a lot of information.

Email, documents, chats and collaboration data can contain business records, personal information and other sensitive content. That information should not be kept forever without a reason, but it also should not disappear before legal, regulatory or business requirements allow it.

Information governance is about controlling that lifecycle.

Retention policies define how information should be kept and when it may be removed. Retention labels allow information to be classified so that different rules can be applied to different types of content.

The key difference is scope.

A policy can apply broadly to a workload, location or group of content. A label can be applied to specific information so that the content carries a particular retention or record-management behavior.

The exact configuration depends on the workload, but the underlying questions remain the same:

- What information are we storing?
- Why do we need to keep it?
- How long should it remain available?
- When should it be deleted?
- Who is allowed to change that decision?
- What happens when the organization is required to preserve information for an investigation or legal process?

Microsoft 365 workloads also provide service-level recovery and preservation features.

Exchange can retain recoverable items and provide archive and hold capabilities. SharePoint and OneDrive can maintain versions and provide recycle-bin or restoration features. These features are useful, but they should not be confused with a complete governance strategy.

Recovery answers the question "how do we get something back?"

Retention answers the question "how long are we required or allowed to keep it?"

Records management answers the question "which information must be controlled as an official record?"

Those are related problems, but they are not the same problem.

A good governance design begins with business and compliance requirements and then uses the platform controls to enforce them.

## Email

Email remains one of the most common paths used for impersonation and phishing, so domain authentication is an important part of protecting a mail environment.

Three technologies are commonly used together: SPF, DKIM and DMARC.

SPF publishes which mail systems are authorized to send email for a domain. The receiving system can compare the source of the message with the policy published in DNS.

DKIM adds a cryptographic signature to the message. The receiving system retrieves the corresponding public key from DNS and can use it to verify that the signed parts of the message were not modified after signing.

DMARC builds on SPF and DKIM by adding alignment and a domain-level policy.

Alignment matters because a message can technically pass SPF or DKIM while still presenting a different address to the user. DMARC checks whether the authenticated domain aligns with the domain visible to the recipient.

The domain owner can also publish a policy that tells receiving systems how messages that fail DMARC should be handled. Reporting can then provide visibility into which systems are sending mail for the domain and which messages are failing authentication.

These technologies are strongest when used together.

SPF identifies authorized sending infrastructure. DKIM protects message authenticity through signing. DMARC ties those results back to the visible sender domain and adds policy and reporting.

None of them should be treated as a complete anti-phishing solution on its own, but together they form an important foundation for domain protection.

## Cloud

Cloud applications provide flexibility, but they also create visibility challenges.

Users can often start using a SaaS application without involving IT. From the user's perspective, this may be convenient. From the security team's perspective, it creates a question: where is company data going and which applications are processing it?

This is often called Shadow IT.

A Cloud Access Security Broker, or CASB, helps create visibility and control between users and cloud services.

The exact capabilities vary, but the main goals are usually similar.

First, discover which cloud applications are being used. You cannot evaluate the risk of an application you do not know exists.

Second, protect sensitive information. If company data is uploaded to a cloud service, the organization should understand what that data is and whether the service is appropriate for it.

Third, detect unusual behavior. A sudden mass download, impossible access pattern or other abnormal activity may indicate that an account or application has been compromised.

Fourth, evaluate the risk and compliance characteristics of cloud applications.

The goal is not to block every service that was not purchased by IT. The goal is to understand what is being used and make informed decisions about which applications are trusted, restricted or replaced.

Cloud security works best when identity, application behavior and data protection are considered together.

## Threats

Attackers do not care which Microsoft 365 product an organization thinks is most important.

They look for the easiest path.

That path may begin with a phishing email, a stolen password, a vulnerable endpoint or a poorly controlled cloud application. Once access is gained, the attacker may move between identity, devices, email, applications and data.

This is why threat protection should not be designed as a set of isolated tools.

Email security can detect a malicious message. Endpoint protection can detect suspicious activity on a device. Identity systems can detect unusual sign-ins. Cloud application monitoring can identify abnormal behavior. When these signals are brought together, the security team gains a much better view of the complete attack.

A typical attack can move through several phases.

The attacker gathers information about the target. A user is then tricked or a credential is stolen. The attacker tries to expand access, maintain persistence and reach valuable information.

Security controls should therefore exist at several stages:

- Reduce the chance of initial access
- Detect suspicious activity
- Limit privilege
- Prevent lateral movement
- Protect sensitive data
- Investigate what happened
- Recover safely

User awareness remains part of that model because technical controls cannot remove every possible social-engineering attack.

The objective is not to believe that one product will stop every attack. The objective is to create overlapping controls so that one failure does not automatically become a complete compromise.

## Monitoring

Security controls are useful only when the organization can see what they are doing.

A central security experience helps administrators understand signals across identities, data, devices and applications.

One useful concept is the security posture score.

A score can highlight recommended improvements and provide a way to track progress over time. It should not be treated as an absolute measurement of whether an environment is secure, but it can help identify configuration gaps and prioritize work.

Reporting should also be considered across several layers.

Identity reports can show sign-in and risk activity. Device reports can show compliance and endpoint status. Data reports can show how information is being protected. Application reports can show usage and suspicious behavior.

The real value comes from connecting those signals.

A risky sign-in becomes more interesting when the same user also performs an unusual download. A device alert becomes more serious when it is followed by suspicious account activity.

Monitoring therefore supports both prevention and investigation.

A healthy security process asks:

- What changed?
- Which identities were involved?
- Which devices were involved?
- Which applications and data were accessed?
- Was the activity expected?
- Which control should prevent the same problem from becoming worse next time?

The goal is not to collect every possible log forever.

The goal is to collect useful signals, make them understandable and turn them into actions.

## Summary

The MS-100 and MS-101 course material covered a wide part of the Microsoft 365 environment, but the subjects connect to each other more closely than the separate exam topics suggest.

Identity provides the foundation. Authentication protects that identity. Conditional access decides when access should be granted. Privileged access management protects the most powerful roles. Device management adds another trust signal. Governance controls the lifecycle of information. Email authentication protects the domain. Cloud application controls provide visibility outside the traditional perimeter. Threat protection and monitoring then connect signals across the environment.

The most useful lesson is that none of these areas should be designed in isolation.

A strong Microsoft 365 environment is built by connecting identity, devices, applications, data and security operations into one consistent model.

{{< ads >}}

{{< article-footer >}}