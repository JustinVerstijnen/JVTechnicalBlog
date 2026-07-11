---
title: "70-741 Course notes"
slug: "70-741-course-notes"
date: 2020-02-24
tags: Concepts
categories:
- Archive
description: "This page contains my older 70-741 notes about networking with Windows Server 2016."
---

These notes cover the main subjects from 70-741: Networking with Windows Server 2016. The course moved from IP addressing into DHCP, DNS, IP Address Management, routing, remote access, Network Policy Server, Distributed File System and BranchCache.

The individual server roles are easier to understand when they are treated as parts of one network service. DHCP gives a client its configuration, DNS helps it find services, routing moves traffic between networks and access policies determine which users and devices are allowed to connect.

Some technologies, particularly DirectAccess and several IPv6 transition mechanisms, belong strongly to the Windows Server 2016 period. They remain useful here as historical networking concepts.

## Addressing

Every network service depends on correct IP addressing.

An IPv4 address identifies an interface, while the subnet mask or prefix determines which addresses are local. Traffic for another network is sent to a router, normally through the configured default gateway.

Private IPv4 ranges are used inside networks and are not routed directly across the public internet. Network Address Translation can translate internal addresses when clients communicate externally.

A subnet plan should provide enough addresses without creating unnecessarily large broadcast domains. The plan should also leave space for new sites, device types and services.

Static addresses are appropriate for infrastructure that must remain reachable at a predictable address. Dynamic addresses reduce manual work for clients and are normally supplied by DHCP.

An automatically assigned address in the `169.254.0.0/16` range usually indicates that an IPv4 client could not obtain a normal DHCP lease and fell back to link-local addressing.

### IPv6

IPv6 provides a much larger address space and changes several assumptions from IPv4.

IPv6 commonly uses a `/64` prefix on a normal LAN. Interfaces can have more than one IPv6 address for different scopes and purposes.

Link-local addresses are automatically available on an interface and are used for communication on the local link. Global unicast addresses are routable through the wider IPv6 network. Unique local addresses provide private-style addressing for internal designs. Multicast replaces many broadcast-style functions.

Neighbor Discovery replaces several IPv4 mechanisms, including ARP. Router Advertisements can tell clients about prefixes and default routes.

Stateful DHCPv6 provides addresses and other options through a DHCP server. Stateless configuration allows the client to create its own address from an advertised prefix while DHCPv6 may still provide additional settings.

The correct model depends on the network design and client support.

### Transition

IPv4 and IPv6 can coexist through dual stack, tunneling and translation.

Dual stack gives hosts both protocols and lets applications select the appropriate path.

Technologies such as 6to4, ISATAP and Teredo were designed to tunnel IPv6 through IPv4 networks in different scenarios. NAT64 and DNS64 allow IPv6-only clients to communicate with IPv4 services through translation.

Transition technologies solve a temporary compatibility problem. They should not become an excuse to avoid a clear long-term addressing design.

### Routing

Windows Server can route traffic between interfaces through the Remote Access role.

Static routes are suitable when paths are small and predictable. Dynamic routing protocols exchange reachability information and adapt when the topology changes.

Border Gateway Protocol is used to exchange routes between autonomous systems and appears in larger enterprise, service-provider and hybrid-cloud designs. BGP policy is based on advertised prefixes and path attributes rather than simply selecting the route with the fewest router hops.

A Windows-based router can be useful in labs, branch scenarios and specialized server designs, but the routing role should still be treated as critical infrastructure. Interfaces, forwarding, route persistence, firewall rules and high availability all require planning.

## DHCP

Dynamic Host Configuration Protocol provides clients with IP configuration.

The basic IPv4 exchange is often described as DORA:

1. The client broadcasts a discover message.
2. A DHCP server offers an address.
3. The client requests the selected offer.
4. The server acknowledges the lease.

The server must be authorized in Active Directory in a domain environment before it can normally issue leases. This helps prevent an accidental or unauthorized Windows DHCP server from serving domain clients.

### Scopes

A scope defines the address range and configuration for one subnet.

The scope includes the pool of addresses, subnet mask, exclusions, reservations, lease duration and options.

An exclusion removes a range from normal dynamic allocation. A reservation maps a client identifier or MAC address to a predictable address while still delivering the configuration through DHCP.

Common options include:

- Default gateway
- DNS servers
- DNS domain name
- Time or boot service information where required
- Vendor or user class options for specialized clients

The lease duration controls how long a client may use an address before renewal. Short leases return addresses quickly in networks with frequent client turnover. Long leases reduce renewal traffic in stable networks.

A superscope groups several IPv4 scopes for a physical network that contains more than one logical subnet. A multicast scope provides addresses for multicast applications rather than normal unicast clients.

A clean design normally uses one normal scope per routed subnet.

### DNS

DHCP and DNS often work together.

A DHCP server can register address records for clients and remove them when leases expire. The update behavior should match the security model of the DNS zone.

Name protection helps prevent one client type from overwriting a name used by another client. Credentials may be configured for secure dynamic updates so records are owned consistently rather than by individual DHCP server computer accounts.

The interaction should be tested during lease renewal, client replacement and device decommissioning. Stale DNS records can make a healthy DHCP service appear unreliable.

### Policies

DHCP policies apply different settings based on client characteristics.

A policy can evaluate attributes such as vendor class, user class, relay information, client identifier or MAC address and then assign a different address range, options or lease behavior.

This is useful for separating phones, deployment clients or other device classes without operating a completely separate DHCP server.

Policies should remain understandable. If every exception becomes a new policy, it becomes difficult to predict which configuration a client will receive.

### Relay

DHCP clients begin with broadcasts, and routers do not normally forward broadcasts between subnets.

A DHCP relay agent receives the client message and forwards it as unicast to a DHCP server. The server uses the relay information to identify the originating subnet and select the correct scope.

This allows central DHCP servers to serve many routed networks without placing a server in every subnet.

The relay configuration must point to the correct servers, and the network and firewall must allow the required traffic in both directions.

### PXE

Preboot Execution Environment allows a device to start a deployment workflow from the network before a normal operating system is installed.

The client uses DHCP-related discovery to find boot services and download a network boot program.

DHCP and deployment roles may run on the same server or on separate systems. The configuration must avoid conflicting assumptions about which service answers which part of the request.

IP helper or relay configuration is generally more flexible than embedding deployment-specific options into every DHCP scope because the relay can forward the required discovery traffic to the appropriate services.

### Failover

Windows Server DHCP failover replicates IPv4 lease information and scope configuration between two partner servers.

Load-balance mode allows both partners to serve clients. Hot-standby mode keeps one partner ready to take over selected scopes.

The Maximum Client Lead Time helps determine how long one partner can extend a lease without confirming the state with the other partner.

Failover protects lease availability but does not remove the need to back up configuration, monitor replication state and plan for maintenance.

The Server 2016 implementation applied to IPv4 rather than DHCPv6.

### Database

The DHCP database contains leases, reservations and related state.

Windows performs automatic database maintenance and keeps backup information, but administrators should still know where backups are stored and how to restore or migrate the service.

Export and import can move DHCP configuration between servers. Migration should preserve authorization, credentials, failover relationships and DNS update behavior.

Troubleshooting begins by checking server authorization, service state, scope activation, available addresses, relay configuration, event logs and network reachability.

A scope with no free addresses and a client on the wrong VLAN can produce similar symptoms from the user's perspective, so evidence should be collected at each layer.

## DNS

Domain Name System maps names to records and creates the naming foundation used by Active Directory and most applications.

A DNS client asks a recursive resolver to find an answer. The resolver may already have the result in cache. Otherwise it follows referrals through the DNS hierarchy or forwards the request to another resolver.

An authoritative server hosts the zone containing the requested name. A recursive server finds answers on behalf of clients. One Windows DNS server can perform both functions for different queries.

### Resolution

Root hints identify the root DNS servers used when the resolver needs to begin an iterative lookup.

A forwarder sends unresolved queries to another DNS server. Conditional forwarders apply only to selected domain names and are useful for partner, forest or specialized namespace resolution.

A delegation tells resolvers that authority for a child namespace is hosted by another set of name servers.

Recursion should be available only where it is required. An internet-facing authoritative DNS server should not automatically become an open recursive resolver for unknown clients.

The DNS socket pool randomizes the source ports used for queries and makes some cache-poisoning attacks more difficult. Cache locking reduces the chance that cached records are overwritten before their normal lifetime expires.

Response Rate Limiting can reduce the usefulness of the DNS server in amplification attacks by limiting repeated similar responses.

### Zones

A primary zone is writable on the hosting server.

An Active Directory-integrated zone stores zone data in AD DS and can replicate through the directory to selected domain controllers. This supports multi-master updates and secure dynamic updates.

A secondary zone is a read-only copy received through zone transfer from an authoritative server. It provides additional availability without becoming a writable source.

A stub zone contains selected records that identify authoritative servers for another namespace. It helps a resolver keep track of where that namespace is hosted.

The GlobalNames zone was designed to provide limited single-label name resolution as a transition from WINS-style environments. A normal DNS namespace with fully qualified names remains easier to scale and understand.

Zone transfers should be restricted to approved servers. Active Directory-integrated replication normally removes the need for traditional zone transfers between domain controllers hosting the same integrated zone.

### Records

Common resource records include:

| Record | Purpose |
| --- | --- |
| A | Maps a name to an IPv4 address |
| AAAA | Maps a name to an IPv6 address |
| CNAME | Creates an alias for another name |
| MX | Identifies mail exchangers |
| NS | Identifies authoritative name servers |
| PTR | Maps an address back to a name |
| SRV | Locates a service |
| TXT | Stores text used by several verification and policy systems |
| SOA | Describes the zone authority and timing values |

Active Directory depends heavily on SRV records to help clients locate domain controllers and services.

Round robin returns records in varying order when several records share the same name. It can distribute requests but does not by itself check service health or preserve application state.

Record aging and scavenging remove stale dynamically registered records. The no-refresh and refresh intervals should be coordinated with DHCP leases and client update behavior so valid records are not removed prematurely.

### Policies

DNS policies in Windows Server 2016 can change responses based on conditions.

Client subnet, time of day, transport protocol, query name and other criteria can select a policy. Zone scopes can contain different versions of records, while recursion scopes define different recursive behavior.

This enables scenarios such as:

- Split-brain DNS for internal and external clients
- Geographic or subnet-based responses
- Time-based redirection
- Traffic distribution
- Query filtering
- Sinkhole responses for known malicious names

DNS policies add flexibility but also make resolution less obvious. The normal zone contents no longer tell the complete story, so policy order and scope must be documented.

### DNSSEC

DNS Security Extensions add origin authentication and integrity to DNS data.

A signed zone publishes signatures and DNSKEY records. A chain of trust allows a validating resolver to check that the answer came from the expected signed zone and was not changed in transit.

Key signing keys and zone signing keys divide signing responsibilities. Trust anchors allow validating servers to establish where the trusted chain begins.

DNSSEC does not encrypt the query or response. It validates authenticity and integrity.

DANE uses DNSSEC-protected TLSA records to publish information about the certificates or keys expected for a service. Its usefulness depends on DNSSEC validation throughout the path.

### Logging

DNS audit logs record configuration changes. Analytical logs provide detailed query and response events but can generate significant volume.

Debug logging can assist with temporary troubleshooting but should not be enabled broadly without considering performance and storage.

Performance tuning should begin with measured behavior. Cache use, recursion design, zone placement, network latency and client configuration often matter more than a single server setting.

## IPAM

IP Address Management provides a central view of address space and Windows DNS and DHCP infrastructure.

Without an IPAM system, information often becomes spread across spreadsheets, DHCP consoles, DNS zones and personal notes. That makes it difficult to know which addresses are free, who changed a scope or where a static address is used.

IPAM combines several functions:

- Discovering managed servers
- Tracking address blocks and ranges
- Monitoring utilization
- Managing selected DHCP and DNS settings
- Auditing address and configuration activity
- Delegating administration through role-based access

The IPAM server maintains its own database. Windows Internal Database can be sufficient for smaller installations, while SQL Server can support designs that require an external database.

Provisioning can use Group Policy to configure the firewall rules and access settings required on managed servers. Manual provisioning is possible but requires the same permissions to be configured consistently.

Server discovery identifies DNS, DHCP and domain controller systems in the configured scope. Administrators then select which discovered servers are managed.

Address blocks represent larger assigned spaces. Ranges and subnets divide those blocks into usable networks. Individual addresses can be tracked as dynamic, static, reserved or otherwise categorized.

Utilization reporting helps identify scopes that are nearly exhausted and ranges that have been allocated but remain unused.

IPAM can manage servers across supported trust and forest designs when permissions and connectivity are configured. Role-based access allows responsibilities to be split between address-space administrators, DHCP operators, DNS operators and auditors.

Virtual address spaces help separate overlapping provider or tenant networks in virtualized environments.

IPAM is not a replacement for a clear addressing standard. It is a system for recording and operating that standard.

## Access

Remote access allows users, sites and administrators to reach resources across untrusted or routed networks.

The Remote Access role can provide routing, NAT, VPN, site-to-site connectivity and DirectAccess functionality.

### NAT

Network Address Translation maps addresses between networks.

Source NAT allows many private clients to share one or more external addresses. Destination NAT or port forwarding maps incoming traffic to an internal service.

NAT is useful for address conservation and boundary design, but it is not a security policy by itself. Firewall rules still determine which traffic is permitted.

### VPN

A remote-access VPN creates an encrypted tunnel for an individual client. A site-to-site VPN connects networks through gateways.

Windows Server 2016 supported several VPN protocols:

- PPTP was simple and widely compatible but represented an older and weaker security model.
- L2TP combined tunneling with IPsec protection.
- SSTP carried VPN traffic over HTTPS and could traverse networks that allowed normal web traffic.
- IKEv2 supported modern IPsec behavior and VPN Reconnect scenarios.

The selected protocol affects certificates, firewall ports, client support and resilience.

Authentication can use passwords, certificates, smart cards, EAP methods or combinations enforced through NPS policy.

A connection profile can preconfigure servers, routes, authentication and user experience. Split tunneling sends only selected traffic through the VPN, while force tunneling sends client internet traffic through the organizational network as well.

The choice should reflect security inspection, bandwidth, privacy and application routing.

### DirectAccess

DirectAccess provided seamless, always-on connectivity for supported domain-joined clients.

The client established protected IPv6-based connectivity automatically rather than waiting for the user to start a traditional VPN session. This allowed administrators to manage remote computers even when the user had not signed in.

The design depended on Active Directory, Group Policy, DNS, certificates or supported simplified deployment choices, public reachability and suitable transition technologies when the underlying internet path was IPv4.

DirectAccess could use IP-HTTPS, Teredo or 6to4 according to the client network and configuration.

The wizard simplified deployment, while advanced designs allowed multiple sites, load balancing, stronger certificate integration and more specific infrastructure servers.

Troubleshooting required checking client policy, name resolution, certificates, IPsec, transition adapters, network location detection and server reachability.

DirectAccess is an important historical example of device-centric remote access. It connected and managed the computer automatically rather than making connectivity depend entirely on user action.

## NPS

Network Policy Server implements RADIUS services in Windows Server.

A RADIUS client is a network device or access server that sends authentication and accounting requests to NPS. Typical clients include VPN servers, wireless controllers, switches and remote access gateways.

NPS can act as a RADIUS server and make the policy decision itself, or as a RADIUS proxy and forward requests to another RADIUS group.

Connection Request Policies decide whether a request is processed locally or forwarded. Network Policies decide whether access is allowed and which settings are returned.

Conditions can include group membership, access server type, time, authentication method and other request attributes.

Constraints define requirements such as the allowed EAP method. Settings can return VLAN or session information to the access device.

Certificates are important for EAP-TLS, PEAP and server authentication. The certificate name, purpose, trust chain and private key must match the selected authentication design.

RADIUS accounting records start, stop and interim session information. Logs can be written to files or a database for audit and usage analysis.

Templates make shared RADIUS clients, secrets, health policies and other settings easier to reuse.

Policies for wired, wireless and VPN access should be separated clearly so one change does not unintentionally affect every access method.

## Publishing

Web Application Proxy provides reverse proxy and preauthentication capabilities for selected web applications.

It is commonly associated with AD FS, where it publishes federation services or claims-aware applications to external clients without placing the internal application directly on the internet.

The proxy terminates external connections and forwards permitted requests to the internal service. Certificates, name resolution, federation trust and firewall rules must all align.

Preauthentication allows identity policy to be applied before traffic reaches the internal application. Pass-through publishing forwards traffic without that additional claims-based gate.

A reverse proxy reduces direct exposure but does not remove the need to patch and secure the application behind it.

## Files

Distributed File System provides a logical namespace and replication for file services.

DFS Namespaces give users one consistent path even when data is hosted on several servers. A domain-based namespace stores configuration in Active Directory and can have several namespace servers.

Folders in the namespace point to one or more folder targets. Clients receive referrals that direct them to an appropriate target according to site cost and target state.

DFS Replication synchronizes folder contents between servers through a multi-master replication engine.

Remote Differential Compression transfers changed portions of files rather than always sending the entire file. A staging folder temporarily stores files prepared for replication.

Replication groups define members, replicated folders, connections, schedules and bandwidth.

DFS Replication is not simultaneous file locking across sites. If the same file is changed independently on two servers, conflict handling selects a winning version and preserves the losing version according to the conflict process.

Staging and conflict folders need capacity and monitoring. A full staging area or long replication backlog can reduce performance and delay convergence.

Database cloning can speed deployment of a new DFS Replication member by pre-seeding data and importing the replication database through the supported process.

A namespace improves path resilience, while DFS Replication provides additional copies. Neither replaces independent backup.

## BranchCache

BranchCache reduces repeated WAN transfers between a central content server and clients in a branch office.

When one client downloads supported content, the content is divided into blocks and identified through hashes. Later clients can retrieve matching blocks from a local cache after receiving authorization from the original content server.

Distributed cache mode stores content across client computers. Hosted cache mode uses a designated server in the branch.

Distributed mode requires no branch server but depends on client availability. Hosted mode provides a more predictable cache for larger branches.

BranchCache can work with supported SMB and HTTP-based content. Group Policy or command-line configuration enables the clients and selects the mode.

The cache does not bypass authorization. The central server still confirms that the requesting client is allowed to access the content.

BranchCache and DFS Replication solve different problems. DFS Replication maintains server copies of folder data, while BranchCache accelerates client access to content that remains centrally controlled.

## Summary

70-741 shows how several Windows Server roles combine into one network platform.

Addressing and routing create reachability. DHCP gives clients the configuration they need. DNS gives services stable names. IPAM records and operates the address, DHCP and DNS environment. Remote Access and NPS extend controlled connectivity to users, devices and locations. DFS and BranchCache improve how file services are presented and consumed across sites.

The most important lesson is that network services depend on each other.

A client with a valid address but incorrect DNS still appears offline to the user. A working VPN without an access policy can expose too much. A replicated file service without monitoring can silently build a backlog.

Reliable networking comes from designing the complete path and then monitoring every dependency along it.

{{< ads >}}

{{< article-footer >}}
