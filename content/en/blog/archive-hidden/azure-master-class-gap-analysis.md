Idea for a 2026 update of the Azure Master Class. For ARM, Terraform and Bicep I know have deep dive guides for getting started with them.

---

## Module 3: Governance

Expand:

- Resource lifecycle design
- Resource group design principles
- Moving resources and planning dependencies
- Subscription design principles

Do not repeat the existing RBAC, Policy and tagging explanations.

---

## Module 4: Resiliency and redundancy

Highest-priority expansion:

- Azure Site Recovery
- Planned, unplanned and test failover
- Recovery plans
- Backup policies
- Retention
- Restore testing
- Backup versus replication
- High availability versus disaster recovery

---

## Module 5: Storage

Optional expansion:

- Storage decision table
- Advanced file-storage options such as Azure NetApp Files
- Restore and data-protection strategy where it is specific to storage

Most old storage notes are already covered.

---

## Module 6: Networking

Highest-priority expansion:

- Hub-and-spoke architecture as a full pattern
- Azure Load Balancer
- Azure Traffic Manager
- Traffic Manager routing methods
- Global versus regional traffic distribution
- One complete load-balancing decision table

This is probably the module with the best opportunity for architect-level improvement.

---

## Module 7: Virtual machines and scale sets

Add:

- Azure Virtual Desktop architecture overview
- Azure Batch
- HPC architecture overview

Optional:

- A compute-service selection flowchart that links to Module 8

---

## Module 8: Application services and containers

Highest-priority expansion:

- Azure Service Bus
- Azure Event Hubs
- Messaging patterns
- Event Grid comparison
- Service Bus versus Event Hubs versus Event Grid
- Optional: Azure Relay

This may justify renaming the module to include integration or messaging.

---

## Module 9: Databases and AI

Expand:

- SQL service selection
- SQL Database versus Managed Instance versus SQL on VM
- Elastic Pool use cases
- Purchasing and sizing concepts

No need to repeat the existing database introductions.

---

## Module 10: Monitoring and security

Expand slightly:

- The different layers of Azure logging
- Diagnostic settings as a routing mechanism
- Platform logs versus guest OS logs versus application logs

The old monitoring notes are otherwise less useful than the current Master Class.

---

## Module 11: Infrastructure as Code and DevOps

The old certification notes do not add much here.

The current Master Class is already considerably more complete.

---

# Suggested order of work

If the goal is maximum value for the least amount of duplicated writing, I would work in this order:

1. Messaging: Service Bus, Event Hubs and Event Grid comparison
2. Disaster recovery: Azure Site Recovery and backup strategy
3. Networking: Traffic Manager, Load Balancer and global load-balancing decision guidance
4. Networking: full hub-and-spoke architecture
5. Identity: Identity Protection and risk
6. Databases: SQL architecture decision guide
7. Compute: Azure Virtual Desktop
8. Compute: Azure Batch and HPC
9. Governance: resource lifecycle and resource group design
10. Monitoring: logging layers and diagnostic settings

---

# Final recommendation

Do not try to migrate the old Word notes document by document.

The Master Class is already structured better than the certification archive. Copying the old document structure would create duplicate information and make the knowledge source feel like a collection of exam notes again.

Instead, use the old notes to add three things to the current Master Class:

1. Missing services that still fill a genuine knowledge gap
2. Architecture patterns that connect multiple services
3. Decision guidance that explains when to choose one service over another

That will move the Master Class from a collection of Azure explanations towards a real architecture knowledge base.