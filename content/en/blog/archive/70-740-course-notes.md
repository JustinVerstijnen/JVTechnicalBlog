---
title: "70-740 Course notes"
slug: "70-740-course-notes"
date: 2020-01-09
tags: Concepts
categories:
- Archive
description: "This page contains my older 70-740 notes about installing, storing and computing with Windows Server 2016."
---

These notes cover the main subjects from 70-740: Installation, Storage, and Compute with Windows Server 2016. The exam combined operating system deployment, storage, Hyper-V, containers, clustering, backup and monitoring into one large technical foundation.

Some technologies in this article belong specifically to the Windows Server 2016 period. Nano Server, the original Windows container tooling and several deployment workflows changed considerably afterwards. The architecture principles remain useful: keep the server installation as small as practical, separate workloads, design storage around performance and resilience, automate repeatable configuration and test every recovery path before it is needed.

## Installation

A Windows Server deployment starts by understanding the workload rather than immediately clicking through the installation wizard. A domain controller, Hyper-V host, file server and application server have different security, storage and management requirements. The selected edition and installation option should support those requirements without adding unnecessary components.

Windows Server 2016 was available in editions aimed at different scales and feature sets. Standard and Datacenter were the main editions for general server workloads. Datacenter included the broadest virtualization and software-defined datacenter capabilities, while Standard was intended for environments with lighter virtualization requirements. Essentials targeted smaller organizations with a simplified model.

Licensing and installation are related but separate. Installing an edition does not itself grant the right to run it, and changing the workload later can affect both licensing and architecture decisions.

### Options

The two main installation experiences were Server Core and Server with Desktop Experience.

Server with Desktop Experience included the familiar graphical shell and local management tools. It was easier for administrators who depended on local graphical interfaces, but it installed more components and therefore created a larger servicing and attack surface.

Server Core removed most of the graphical desktop while retaining the server roles and management interfaces needed for production workloads. It used fewer resources, required fewer graphical components to be serviced and encouraged remote administration.

The absence of a desktop did not mean that Server Core could not be managed. Server Manager, Microsoft Management Console tools, PowerShell, Windows Admin Center in later environments and other remote tools could administer a Core server from another workstation.

A sensible approach was to use the smallest installation option that supported the workload and the operational team. Installing a graphical interface merely because it felt familiar added components that might never be used.

### Nano

Nano Server was introduced as an even smaller, headless deployment option for selected cloud-style and infrastructure workloads. In its original Windows Server 2016 form, it was built as an image with only the packages and drivers required for its intended role.

Nano Server had no normal local logon experience and was managed remotely. This reduced the footprint but also required administrators to prepare networking, packages, drivers and management access before deployment.

The image could be created through PowerShell or Nano Server Image Builder. Roles and features were added as packages rather than selected later from the normal graphical Add Roles and Features wizard.

Nano Server is best remembered as an example of workload-focused deployment. A server image should contain what the workload needs and little else. The exact Nano Server lifecycle changed after Windows Server 2016, but this principle continued in Server Core, containers and minimal cloud images.

### Roles

Windows Server separates roles from features.

A role describes a primary server function such as Hyper-V, File and Storage Services, DHCP or DNS. Features provide supporting capabilities that may be used by several roles.

Server Manager can install roles and features locally or on another managed server. PowerShell provides the same capability in a repeatable form. This matters when several servers need the same configuration because a documented command or automation workflow is easier to reproduce than a series of manual clicks.

Before installing a role, identify its dependencies, required ports, storage needs, service accounts and recovery method. A role that installs successfully can still be unusable if the surrounding network or identity requirements were not planned.

### DSC

PowerShell Desired State Configuration, or DSC, introduced a declarative approach to server configuration.

Instead of describing every manual step, a configuration describes the intended state. A server can then apply that configuration and report or correct differences.

For example, the desired state may say that a particular role must be installed, a service must be running and a file must have specific content. The Local Configuration Manager on the target system processes the compiled configuration.

DSC can operate in push or pull scenarios. Push sends a configuration directly to a node. Pull allows nodes to retrieve assigned configurations from a central service.

The important idea is configuration consistency. A server should not depend on somebody remembering every manual setting. The desired state should be documented in a form that can be checked and reapplied.

## Migration

A server migration can be an in-place upgrade, a clean deployment followed by workload migration or a replacement of one role with a newer platform.

An in-place upgrade keeps applications, settings and data where the supported upgrade path allows it. This can reduce migration effort, but it also retains more of the existing configuration and any hidden problems inside it.

A clean deployment provides a more predictable starting point. The workload is installed or migrated to a new server while the old server remains available as a fallback until validation is complete.

The correct method depends on application support, downtime, hardware, domain or forest boundaries, data size and the ability to roll back.

Before moving a role, document:

- Services and dependencies
- Network addresses and firewall requirements
- Service accounts
- Certificates
- Data locations
- Scheduled tasks
- Clients and applications that connect to it
- Backup and recovery procedures

Windows Server Migration Tools could assist with selected roles, settings and data. Other workloads had their own migration methods.

Cross-domain or cross-forest migrations required additional planning because identities, permissions and service dependencies may reference the original security identifiers or domain names.

### Activation

Windows Server supported several activation models.

Retail and OEM activation were associated with individual installations or hardware. Volume environments commonly used Multiple Activation Keys or Key Management Service.

MAK activates a limited number of systems against Microsoft activation services. KMS provides activation through an internal service once the environment meets the required activation threshold.

Active Directory-Based Activation can publish activation information through the domain for supported systems. Automatic Virtual Machine Activation allows supported guest editions to activate through an appropriately licensed Hyper-V host.

The technical model should match the licensing arrangement and the way servers are deployed. An isolated datacenter, a lab and a large domain-connected environment do not necessarily need the same activation method.

## Imaging

Images make repeatable deployment possible.

Windows Imaging Format files can contain one or more Windows images. A deployment process applies the selected image to a volume and then completes configuration for the destination system.

A heavily customized image can shorten the first deployment, but every embedded application, driver and update becomes something that must be maintained. A thinner image is easier to service and can receive frequently changing software later through an automation or management platform.

DISM can inspect, mount and service images. Packages, features, language components and drivers can be added or removed from an offline image before it is deployed.

The Windows Assessment and Deployment Kit supplied deployment and assessment tools. Microsoft Deployment Toolkit provided task sequences and deployment orchestration. The Microsoft Assessment and Planning Toolkit helped inventory environments and assess readiness.

The value of these tools was not merely that they automated installation. They turned deployment into a process with known inputs and repeatable results.

### Updates

Images age quickly when they are not maintained.

A newly deployed server should not require months of updates before it is safe to use. Servicing the image with current cumulative updates reduces the time between installation and production readiness.

Windows Server Update Services can provide centralized approval and reporting for Microsoft updates. Computers can be divided into groups so updates first reach a test population and then broader production groups.

A mixed environment may combine WSUS, Configuration Manager and other servicing tools. The important operational principle is staged deployment. Updates should be tested on representative workloads before the largest production ring receives them.

Windows Defender could also receive security intelligence updates through the chosen update infrastructure. Antivirus exclusions should be limited and documented because an exclusion reduces inspection in the selected path or process.

## Storage

Storage design begins with the workload.

A file server with large sequential transfers has different requirements from a database that performs many small random operations. Capacity is only one dimension. IOPS, throughput, latency, fault tolerance, expandability and recovery all matter.

Windows distinguishes physical disks, partitions, volumes and filesystems. A physical disk may contain one or more partitions. A partition can be formatted as a volume, assigned a drive letter or mount point and exposed to applications through a filesystem.

Modern systems normally use GPT rather than MBR for large disks and UEFI-based deployments. Sector size and alignment also matter for some storage platforms and applications.

### Filesystems

NTFS is the general-purpose Windows filesystem used for operating system and data volumes. It supports access control lists, auditing, compression, quotas, EFS and a broad set of application scenarios.

ReFS was designed with resilience and large-scale storage scenarios in mind. It uses integrity features and works closely with Storage Spaces. Feature support differed from NTFS, so ReFS was not simply a drop-in replacement for every volume.

The filesystem should be chosen for the workload and supported feature set. A volume hosting an application that depends on an NTFS feature should not be converted to ReFS merely because ReFS sounds newer.

### Shares

Windows file services can expose data through SMB and NFS.

SMB is the normal Windows file-sharing protocol and supports features such as transparent failover, encryption, multichannel and continuous availability in suitable server configurations.

NFS is useful when Unix or Linux clients require a native file-sharing protocol.

Access over an SMB share is evaluated through both share permissions and NTFS permissions. The most restrictive effective result applies.

A common operational model is to keep the share permission broad enough for the intended audience and manage detailed access through NTFS groups and inheritance. Whatever model is chosen should be consistent and documented.

Permissions are easier to manage when assigned to groups rather than directly to users. Folder structures should inherit normal access wherever possible, with exceptions kept small and understandable.

### Virtual disks

VHD and VHDX files represent virtual hard disks.

VHDX supports larger capacities and includes improvements for resilience and modern storage alignment. Virtual disks can be fixed-size, dynamically expanding or differencing.

A fixed disk reserves its capacity immediately and provides predictable allocation. A dynamically expanding disk grows as data is written but still has a configured maximum. A differencing disk stores changes relative to a parent image and is useful for some lab or image scenarios, although long differencing chains add dependency and management risk.

Pass-through disks expose a physical disk directly to a virtual machine. They reduce abstraction but also remove several capabilities available with virtual disk files, so they are less flexible for normal Hyper-V management.

Checkpoints capture a virtual machine state for temporary rollback. They are useful during controlled changes but should not be confused with backups. A checkpoint remains dependent on the original virtual disk chain and does not protect against loss of the host storage.

### Pools

Storage Spaces groups physical disks into a storage pool and creates virtual disks on top of that pool.

The virtual disk layout determines how data is distributed:

- Simple maximizes capacity and performance without resilience.
- Mirror keeps additional copies and provides good performance with lower usable capacity.
- Parity stores recovery information more efficiently but has different write-performance characteristics.

Storage tiers can combine faster and slower media. Frequently accessed data can remain on a performance tier while colder data is placed on a capacity tier.

The pool can be expanded by adding supported disks. Capacity planning should leave room for repair operations and growth rather than allocating every available byte on the first day.

### Deduplication

Data Deduplication reduces storage consumption by identifying repeated chunks of data and storing shared copies.

It is particularly useful for workloads with large amounts of similar content, such as deployment images, software repositories, general file shares and some virtualization libraries.

Deduplication is a post-processing system. Data is written normally and later optimized according to policy. Frequently accessed portions can remain unoptimized or be recalled transparently.

The feature should be enabled only for supported workloads. Databases and other applications with their own storage behavior may not be suitable.

A backup product must understand the deduplicated volume or protect it through a supported Windows mechanism. Monitoring should include optimization rate, savings, job state and available capacity.

### iSCSI

iSCSI transports block storage commands over IP networks.

The target exposes virtual disks or logical units. The initiator connects to those targets and presents the storage to Windows as locally attached block devices.

Because iSCSI depends on the network, storage traffic should be designed with suitable bandwidth, redundancy and isolation.

Multipath I/O provides multiple paths between the server and storage. If one network adapter, switch or path fails, another can remain available. The device-specific multipath configuration must match the storage platform.

Internet Storage Name Service can assist with discovery in larger iSCSI environments, although static target configuration is often sufficient in smaller deployments.

Datacenter Bridging and technologies such as RDMA can improve selected converged networking scenarios by controlling traffic classes and reducing CPU overhead.

### Replica

Storage Replica synchronizes block-level changes between servers or clusters.

Synchronous replication waits for both locations to confirm a write and is intended for low-latency links where near-zero data loss is required. Asynchronous replication acknowledges locally and sends changes to the remote location afterwards, allowing greater distance at the cost of a possible recovery gap.

Storage Replica can support server-to-server, cluster-to-cluster and stretch-cluster scenarios.

Replication is not a backup. A deletion or corruption can also be replicated. The environment still needs independent recovery points.

## Hyper-V

Hyper-V provides hardware virtualization in Windows Server.

A Hyper-V host allocates processor, memory, storage and networking resources to virtual machines while maintaining isolation between guests.

Planning begins with the workloads. Count not only virtual processors and memory but also storage IOPS, network throughput, backup windows, failover capacity and growth.

A host that can run all virtual machines during normal operation may still be undersized if another host fails and those workloads need to restart elsewhere.

### Machines

Generation 1 virtual machines use legacy virtual hardware and BIOS-style firmware. Generation 2 virtual machines use UEFI-based firmware, synthetic devices and features such as Secure Boot.

Generation 2 is normally preferred for supported modern operating systems. Generation 1 remains useful for older guests or specific compatibility requirements.

Integration Services improve communication between host and guest. They support time synchronization, graceful shutdown, heartbeat, backup integration and other management functions.

Windows guests include the appropriate integration components. Linux and FreeBSD guests require supported integration capabilities for their distribution and release.

Enhanced Session Mode provides a richer local connection experience for suitable Windows guests. PowerShell Direct allows an administrator on the host to run PowerShell inside a supported Windows guest without depending on the guest network.

Nested virtualization exposes virtualization extensions to a virtual machine so the guest can run Hyper-V or another supported nested workload. This is useful for labs, training and some container scenarios, but it adds overhead and design limitations.

Discrete Device Assignment can map selected PCI Express devices directly to a virtual machine. The hardware and driver must support this model, and the device is no longer available for normal host use while assigned.

### Memory

Static memory assigns a fixed amount to the virtual machine.

Dynamic Memory allows Hyper-V to adjust assigned memory between configured minimum, startup and maximum values. The host considers guest demand and configured priority when distributing available memory.

Smart Paging provides temporary disk-backed memory during specific restart situations when the host cannot immediately provide the configured startup amount. It is not a normal substitute for physical RAM.

Non-Uniform Memory Access matters on larger hosts. Processor and memory are divided into NUMA nodes, and a virtual machine performs best when its virtual processors and memory can remain local to a suitable node.

Resource Metering records historical resource use per virtual machine. It can assist with capacity planning, chargeback and troubleshooting.

### Storage

Hyper-V storage can use local disks, SMB shares, Cluster Shared Volumes, iSCSI and other supported block or file platforms.

Virtual Fibre Channel exposes supported Fibre Channel connectivity to a guest. Storage Quality of Service can limit or reserve IOPS so one virtual machine does not dominate a shared storage system.

Production checkpoints use guest-aware backup technology to create a data-consistent point. Standard checkpoints save memory and device state and are better suited to development and test scenarios.

Virtual disks should be placed according to performance and recovery requirements. Keeping every workload on one large volume may be simple, but it can also create one contention and failure domain.

### Networking

A Hyper-V virtual switch connects virtual network adapters.

An external switch connects guests to a physical network adapter. An internal switch connects guests to each other and to the host. A private switch connects guests only to each other.

Synthetic adapters provide normal high-performance virtual networking. Legacy adapters emulate older hardware and were mainly useful for old operating systems or pre-boot scenarios.

VLANs can isolate traffic on a shared virtual switch. More advanced network virtualization can separate overlapping tenant address spaces from the provider network.

MAC addresses can be assigned dynamically or statically. Static assignments are useful when an application or network policy depends on a stable address, but duplicate MAC addresses must be prevented.

NIC Teaming combines adapters for resilience and, depending on the mode, traffic distribution. Switch Embedded Teaming integrates teaming into the Hyper-V virtual switch and supports modern technologies such as RDMA in suitable designs.

Virtual Machine Queue allows a physical adapter to direct traffic for virtual adapters into separate processor queues. RDMA reduces CPU involvement in suitable storage and cluster traffic. Bandwidth management and QoS can prevent one workload from consuming every available link.

These features should be enabled according to hardware support and measured need. More offload settings do not automatically mean better performance.

## Containers

Windows containers package an application and its dependencies into an isolated environment that shares parts of the host operating system.

A container image is a read-only set of filesystem layers. A running container adds a writable layer on top. When the container is removed, that writable layer disappears unless data was stored in a persistent location.

Windows Server containers provide process and namespace isolation while sharing the host kernel. Hyper-V isolated containers add a small virtual machine boundary around each container for stronger isolation or kernel compatibility.

The host and image versions must follow the compatibility rules for the selected isolation model.

Docker tooling was commonly used to pull images, create containers, inspect them, map ports, attach storage and publish new image layers.

An image tag identifies a version or variant. Tags should be deliberate rather than relying only on `latest`, because production deployment should be able to reproduce the exact application image that was tested.

Containers are not small virtual machines. A virtual machine packages a complete operating system and kernel, while a container packages the application environment around a shared or isolated host kernel.

Persistent state should be separated from the disposable container layer. Configuration, secrets and application data need their own controlled storage and lifecycle.

## Availability

High availability is the ability to continue providing a service when a component fails. It is different from backup and disaster recovery.

A highly available service may survive a node failure but still replicate accidental deletion. A backup may recover deleted data but take too long for a service that requires immediate continuity. A complete design uses the right combination.

### Backup

Windows Server Backup can protect files, volumes, system state and selected bare-metal recovery information.

The required backup depends on the server role. A file server needs data and permission recovery. A Hyper-V host requires a supported host or guest backup design. Active Directory requires system-state-aware protection. Web and application servers may also depend on external databases, certificates and configuration.

A backup is useful only if it can be restored.

Restore testing should verify not only that files appear in the backup catalog but also that applications start, identities and permissions remain correct and dependencies are available.

### Monitoring

Performance Monitor collects counters from Windows subsystems and applications.

Processor utilization, available memory, disk latency, queue length, network throughput and application-specific counters can help explain workload behavior.

Resource Monitor provides a live view of CPU, memory, disk and network activity. Event Viewer provides operational and diagnostic events. Server Manager shows role and server state across managed systems.

A single counter rarely proves a root cause. High disk latency may result from storage pressure, a backup job or insufficient memory causing paging. Monitoring should compare several related counters and establish a normal baseline.

Data Collector Sets can record counters, events and configuration over time. Historical data is far more useful than opening Task Manager after the problem has already disappeared.

Thresholds should match the workload. A brief CPU peak can be normal, while sustained latency during a business-critical transaction may require investigation.

### Clustering

Failover Clustering groups independent servers into nodes that cooperate to provide highly available roles.

Cluster validation checks hardware, networking, storage and configuration. A production cluster should use supported components and pass the relevant validation tests.

The cluster database keeps configuration consistent between nodes. Cluster networks carry management, client, storage or heartbeat traffic according to the design.

Quorum determines whether enough members remain available for the cluster to continue operating. Dynamic quorum adjusts node votes as membership changes. A witness adds an additional vote to help clusters make a decision during a partition.

Witness options include disk witness, file share witness and cloud witness. The correct choice depends on node count, storage and site design.

Cluster Shared Volumes allow multiple nodes to access the same clustered storage namespace. They are widely used for clustered Hyper-V and Scale-Out File Server workloads.

Cluster-Aware Updating coordinates patching by moving or draining workloads, updating a node and returning it to service before continuing with the next node.

A cluster operating system rolling upgrade allows supported Hyper-V clusters to move between Windows Server versions in stages while workloads remain available.

### Files

A File Server for General Use provides highly available traditional file shares through an active node.

Scale-Out File Server provides active-active access to continuously available SMB shares and is designed for application workloads such as Hyper-V or SQL Server storage rather than normal end-user document shares.

Guest clustering places cluster nodes inside virtual machines. Shared VHDX, virtual Fibre Channel or other supported shared-storage methods can provide the storage required by the guest cluster.

A cluster without a traditional network name can be useful for selected infrastructure roles that do not require a client access point.

### S2D

Storage Spaces Direct combines local drives from cluster nodes into shared software-defined storage.

A hyper-converged design runs virtual machines and storage on the same nodes. A disaggregated design separates the storage cluster from the compute cluster and exposes storage over SMB.

The hardware, drives, networking and firmware must be designed as one supported system. Cache and capacity media are distributed across nodes, and resilience is provided by the storage layout.

Storage Spaces Direct reduces dependence on a separate SAN, but it does not remove the need for capacity planning, fault-domain design, monitoring and backup.

### Failover

Cluster roles can have preferred owners, failover thresholds and restart policies.

VM Monitoring can watch a service or event inside a virtual machine and trigger recovery when the guest is running but the monitored workload is unhealthy.

Node Fairness balances virtual machines across nodes when one node becomes more heavily loaded.

Site-aware and stretch clusters understand fault domains across racks or locations. Storage Replica can synchronize data between sites, while quorum and preferred-site configuration determine how the cluster behaves during a site failure.

Every automated failover policy should be tested. A workload that starts on another node but cannot reach its database or network is not truly available.

### Replica

Hyper-V Replica asynchronously copies virtual machine changes to another Hyper-V host or cluster.

It is designed for disaster recovery rather than shared-storage failover. The replica remains offline until a planned, test or unplanned failover is initiated.

A test failover verifies recovery without affecting the normal protected virtual machine. A planned failover coordinates the transition while both sides are available. An unplanned failover is used when the primary side cannot be reached.

Replication frequency and retained recovery points determine the possible data-loss window and available rollback choices.

### Migration

Live Migration moves a running virtual machine between compatible hosts with little interruption.

Shared-nothing Live Migration can move compute and storage without requiring both hosts to use the same shared storage. Storage Migration moves the virtual disks while the virtual machine remains on the same host.

Authentication can use CredSSP or constrained delegation. CredSSP is straightforward for an interactive single hop. Kerberos constrained delegation supports remote orchestration when configured correctly.

Quick Migration saves the virtual machine state, moves ownership and restores it on another node. It causes more interruption than Live Migration but has different compatibility requirements.

Export and import provide another way to move or copy virtual machines. Import modes can register the existing files, restore them or copy them into a new location.

Network health protection can move a clustered virtual machine when the current node loses required network connectivity. Drain on shutdown moves roles before a planned node shutdown.

### NLB

Network Load Balancing distributes client connections across several independent Windows servers.

It is suitable for stateless or externally synchronized services where each node can handle a request.

Port rules define the protocol, port range, filtering mode and affinity. Affinity controls whether requests from a client continue to use the same node.

Unicast, multicast and IGMP multicast modes determine how the cluster MAC address is handled on the network. The network switching design must support the selected mode.

NLB is not the same as Failover Clustering. NLB distributes traffic across active nodes, while Failover Clustering transfers ownership of a clustered role when a node fails.

## Summary

70-740 connected many server technologies that are often studied separately.

Installation choices determine the footprint that must be secured and maintained. Imaging and DSC make configuration repeatable. Storage design connects filesystems, permissions, pools, deduplication and replication to the needs of the workload. Hyper-V turns those resources into isolated virtual machines, while containers provide a lighter application model.

Backup, monitoring, clustering, replication and migration then determine how well the environment can survive change and failure.

The central lesson is that a server is not complete when the role installs successfully. It must also be supportable, recoverable, measurable and able to operate within the availability requirements of the service it hosts.

{{< ads >}}

{{< article-footer >}}
