---
title: "Deep dive into networks"
date: 2024-11-11
slug: "deep-dive-into-networks"
tags:
- Concepts
- Knowledge check
categories:
  - Networking
description: "A practical guide to designing a network that is clear, scalable, resilient, secure and easy to operate."
---

## Planning

A network design should start with the outcome, not with a shopping list.

Before selecting switches, access points or other hardware, first work out what the network actually needs to do. How many users and devices will connect to it? Which services are important? How much downtime is acceptable? Are there multiple buildings or locations? Which devices should be separated from each other? Who will manage the environment after the project is finished?

You do not need every answer on day one, but the important requirements should be clear before the technical design starts.

It also helps to define what success looks like and attach realistic deadlines to the work. A project is not finished just because the equipment has been installed. Time is also needed for testing, documentation and fixing issues that only become visible after the network is in use.

Try to design for the environment you expect in a few years, without building something unnecessarily complicated today. Leave room for additional switches, new VLANs, more wireless clients and extra locations, but keep the current design understandable.

The best network designs are usually predictable. Someone who understands one part of the environment should be able to understand the next part without learning a completely different design.

## Cabling

Cabling is part of the network design.

A rack can contain excellent hardware and still be difficult to support when nobody can quickly see where a cable starts, where it ends or what it is used for.

Good cable management makes troubleshooting faster and reduces the chance of disconnecting the wrong device during maintenance. It also makes future changes much easier.

A few simple standards go a long way.

Use a consistent color scheme when that adds value. For example, you may use different colors for management connections, access points, voice devices, servers or uplinks. The exact colors do not matter. Consistency does.

Use cable lengths that fit the connection. A cable should have enough room for safe routing and maintenance, but large loops of unused cable make a rack harder to work in.

Bundle cables carefully and use reusable hook and loop straps where possible. They are easier to reopen than permanent cable ties and make future changes less annoying.

Keep network and power cabling separated where practical. This improves organization and can reduce unwanted electromagnetic interference, especially around higher power equipment and longer cable runs.

Most importantly, label the physical network.

Patch panels, important uplinks and both ends of critical cables should be identifiable without manually tracing a cable through a rack. The labels should also match the documentation.

A good physical installation should be easy to read. You should be able to open a rack and understand the broad structure before touching anything.

## Topology

As a network grows, the way switches are connected becomes more important.

A long daisy chain can work, but every downstream switch depends on the switches and uplinks in front of it. One failure can therefore disconnect a large part of the network.

A more predictable design gives access switches a direct path towards a central switching layer.

In larger environments, it helps to think in three logical layers: access, distribution and core.

The access layer connects endpoints such as computers, phones, printers, cameras and access points.

The distribution layer connects access switches and is often a logical control point for routing and policy.

The core moves traffic between the major parts of the network and should focus on fast, stable and predictable forwarding.

Not every environment needs three physically separate layers. In many small and medium sized networks, the core and distribution functions are combined into a collapsed core.

The important part is not the number of boxes. It is the role each part of the network plays.

A good topology should make one question easy to answer:

Where will this traffic go?

When the path between access, distribution and core is clear, troubleshooting becomes much easier.

## Core

The central switching layer becomes the foundation for the rest of the network.

For a small environment, one capable managed switch may be enough. For a larger or more critical environment, one central device can become an unnecessary single point of failure.

A collapsed core is often a practical middle ground. One or two central Layer 3 switches provide the main switching and routing functions while access switches connect directly to them.

Useful capabilities at the central layer can include:

- Layer 3 routing
- Sufficient uplink capacity
- Support for redundant links
- Secure management
- Monitoring
- Power over Ethernet where it is actually needed
- Enough capacity for future growth

Do not select a switch only by port count. Uplink speed, forwarding capacity, available power, redundancy options and operational features can matter just as much.

When downtime has a meaningful impact, consider a redundant central design. Two core or distribution switches can provide alternative paths for access switches and important services.

The exact design depends on the platform, but the principle is simple: one failed cable or one failed central switch should not disconnect an entire environment when the business requires higher availability.

Redundancy does add complexity, so it should be intentional. Extra cables without a clear design can create loops and unpredictable traffic paths.

## Segmentation

A flat network is easy to build, but it becomes harder to control as it grows.

Segmentation separates devices into logical groups with their own purpose and policy.

In many enterprise networks, one VLAN maps to one IP subnet and one Layer 2 broadcast domain. Traffic inside that VLAN can be switched locally, while traffic between VLANs must be routed by a Layer 3 device.

This creates useful control points.

Instead of placing every device in the same network, you can separate groups such as:

- User devices
- Voice devices
- Printers
- Servers
- Access points
- Cameras and other IoT devices
- Guest or public wireless clients
- Network management interfaces

The exact number of VLANs depends on the environment. More VLANs do not automatically create a better design. Every VLAN should have a clear reason to exist.

Segmentation also makes policy easier to apply. A guest network can be prevented from reaching internal systems. Voice traffic can receive the treatment it needs. Management interfaces can be reachable only from trusted administration networks.

A dedicated management network is especially useful for infrastructure such as switches, access points, firewalls and controllers.

The VLAN number itself is not important. Some environments use familiar conventions such as VLAN 99 for management, while others use a completely different standard. What matters is that the design is consistent, controlled and documented.

The same applies to addressing standards. You do not need a complicated formula, but a multi site environment becomes easier to operate when site numbers, VLAN purposes and management ranges follow a predictable structure.

Do not make the addressing scheme so clever that nobody understands it without a spreadsheet.

## Resilience

Redundant links are useful, but Layer 2 redundancy must be controlled.

When multiple active paths form a loop, Ethernet frames can circulate through the network. Broadcast and unknown unicast traffic may be replicated repeatedly, which can make the network unstable or unusable.

Spanning Tree Protocol prevents this by building a loop free Layer 2 topology.

Switches exchange Bridge Protocol Data Units, or BPDUs, and elect a root bridge. The election is based on the bridge ID. The switch with the best bridge ID becomes the root, and other switches calculate their preferred path towards it.

Redundant paths that are not currently needed can be placed in a non forwarding state. If the active topology changes, another path can become available.

The root bridge should be chosen intentionally. Leaving the election entirely to default values can produce a working network, but not necessarily the traffic paths you wanted.

Modern networks commonly use faster spanning tree variants such as Rapid Spanning Tree Protocol. The exact implementation differs between platforms, but the goal stays the same: keep Layer 2 redundancy without allowing loops.

Do not design around a promised failover time unless you have tested it in the actual environment. Convergence depends on the protocol, topology and failure type.

Default gateway redundancy is a separate topic.

When two Layer 3 devices can provide the gateway for a VLAN, a first hop redundancy protocol can present a shared virtual gateway address to clients. One device is responsible for forwarding at a given time and another can take over when needed.

VRRP is one example of a standards based protocol for this purpose.

This reduces dependence on one physical gateway, but it should not be described as guaranteed zero downtime. Failover still depends on the protocol, timers, topology and the way the failure occurs.

Redundancy is valuable only when it is tested.

A second uplink, second switch or second gateway that has never been part of a controlled failover test is still an assumption.

## Switching

Several switching features become important once the basic topology is in place.

Access ports normally connect endpoints and are assigned to the VLAN that endpoint should use.

Trunk links carry multiple VLANs between network devices, for example between switches or towards infrastructure that needs access to several VLANs.

Only carry VLANs where they are actually needed. A trunk does not need to transport every VLAN in the environment.

Port security can also add another layer of control at the access edge.

A switch may be able to:

- Allow only specific MAC addresses
- Learn and remember approved MAC addresses
- Limit the number of MAC addresses on a port
- Disable or restrict a port when the policy is violated

These controls can stop some accidental or unauthorized connections, but MAC addresses are not strong identities and can be spoofed.

For environments that need stronger network access control, technologies such as 802.1X can authenticate users or devices before allowing normal network access.

Another useful feature is DHCP relay.

DHCP clients initially rely on broadcast traffic, and broadcasts do not normally cross routed VLAN boundaries. A DHCP relay function on the Layer 3 gateway can forward the request to a central DHCP server.

This allows one DHCP service to provide addresses to multiple VLANs without placing a separate DHCP server in every subnet.

The server can use relay information to determine which client network the request came from and select the correct address pool.

The main lesson is that switching features should support the design rather than become the design.

Start with a clear topology and clear segmentation. Then add the features needed to make that design work safely and predictably.

## Management

A switch is not ready for production only because it forwards traffic.

It also needs to be manageable.

At minimum, make sure network devices have a secure and predictable management method. SSH is commonly used for encrypted command line access and should be preferred over older unencrypted management protocols.

Management access should come from trusted administration networks rather than being open from every user VLAN.

A practical management standard can include:

- A predictable hostname
- A documented management address
- Secure remote access
- Central authentication where available
- Time synchronization
- Logging
- Monitoring
- Useful interface descriptions

The exact configuration differs between platforms, but the operational goal is always the same.

A network device should be easy to find, easy to identify and easy to troubleshoot.

Interface descriptions are especially underrated. A port called `uplink to floor 2 switch` is far more useful during an incident than an empty description.

Good management standards save time every time something changes.

## Monitoring

A network should not become visible only when users complain.

Monitoring gives you a baseline of how the environment normally behaves and helps you spot changes before they turn into larger problems.

Useful network monitoring can include:

- Device availability
- Interface status
- Throughput
- Errors
- Discards
- Resource usage
- Environmental information when the hardware supports it

SNMP is still widely used for this.

An OID, or Object Identifier, identifies a specific managed value.

A MIB, or Management Information Base, describes groups of managed objects and helps software understand what those OIDs represent.

An SNMP walk can query a section of the available OID tree and is useful when discovering which information a device exposes.

The monitoring platform, not the OID itself, normally decides when a value should trigger a warning or alert.

SNMP versions also matter.

SNMPv1 is old and provides very limited security.

SNMPv2c is still common and uses community strings, but it does not provide modern message encryption.

SNMPv3 can provide user based authentication and message privacy when configured with the appropriate security level.

For new deployments, SNMPv3 is generally the better choice when both the device and monitoring platform support it.

Use read only access where possible and restrict management protocols to trusted source networks.

In environments with multiple physical sites, you do not necessarily need a complete monitoring server at every location.

A local probe, collector or agent can often gather data on site and send the results to a central monitoring platform. This can reduce the amount of management traffic crossing the WAN and can provide better visibility when a site connection becomes unstable.

The right design depends on the monitoring platform and how independently each location needs to operate.

The most valuable part of monitoring is history.

A throughput value at one moment tells you very little. A graph covering days or months can show whether an uplink is normally busy, whether errors started after a change or whether traffic patterns are slowly growing towards a capacity problem.

Monitoring turns troubleshooting from guessing into comparing.

## Wireless

Wireless design is radio design.

An access point can be excellent on paper and still perform badly when it is installed in the wrong place.

Wi-Fi commonly operates across several frequency bands, including 2.4 GHz, 5 GHz and, on supported modern equipment and in regions where it is available, 6 GHz.

As a general rule, lower frequencies tend to propagate farther and pass through obstacles more easily, while higher frequency bands can provide more available channel capacity.

That does not mean one band is always better than another. The right result depends on the building, client devices, channel plan and required capacity.

Channel planning matters because nearby access points share radio airtime.

Two access points placed close to each other should not blindly use the same channel and power settings. The goal is to create useful coverage cells without causing unnecessary interference.

In the 2.4 GHz band, a deployment using 20 MHz channels often uses a non overlapping channel plan such as 1, 6 and 11, but the available channels and best plan depend on local regulations and the environment.

More transmit power is not automatically better.

An access point can sometimes be heard by a client from farther away than the client can transmit back. Large cells can also create more contention with neighboring access points.

Wireless design therefore needs to consider both coverage and capacity.

Building materials matter as well.

Metal can strongly reflect or block radio signals. Concrete, dense walls, glass and other materials can also attenuate a signal.

Do not place access points only by looking for an empty spot on a ceiling plan.

Think about:

- Where people actually use the network
- How many clients are expected
- Which applications they use
- Which obstacles are between the client and access point
- How neighboring access points overlap
- Whether the antenna pattern matches the area

Antenna design changes the coverage pattern.

Omnidirectional antennas spread energy across a broad area.

Directional antennas focus coverage towards a specific area and can be useful in corridors, warehouses, outdoor links, large halls or seating areas.

In very large venues, directional coverage can divide a large audience into smaller radio cells instead of trying to cover everything from a huge number of overlapping omnidirectional access points.

The orientation of the access point also matters because the antenna pattern is designed around a specific mounting position.

Install access points in the orientation recommended for their antenna design.

Finally, validate the design after installation.

A floor plan is still a prediction. The real building may contain materials, interference and client behavior that were not visible during planning.

Check the live environment for signal quality, roaming, channel utilization, interference and real client performance.

The building always gets the final vote.

## Documentation

A network diagram should reduce confusion.

Trying to place the complete environment on one page often produces a drawing that looks impressive from a distance but becomes useless during troubleshooting.

Split large environments into logical views.

For example:

- Overview
- Core
- Switching
- Servers
- Internet edge
- Wireless
- Individual sites
- Security zones

The overview should show how the main parts connect.

Detailed pages can then show the information needed for a specific area.

Group related devices visually. A rack, site, switch stack, DMZ or network zone can be placed inside a clearly named container.

Use consistent shapes and line styles.

A switch should look like a switch everywhere in the documentation. Physical connections should be distinguishable from logical relationships when both are shown.

Do not rely on color alone.

The diagram should still make sense when printed, viewed in grayscale or opened by someone who does not distinguish every color easily.

Show the information that helps people understand the design:

- Device names
- Important uplinks
- Link speeds where relevant
- Redundant paths
- VLAN or network references
- Interface names where they add value

Do not turn the diagram into a full configuration dump.

Detailed configuration belongs in configuration management, backups or supporting documentation.

Most importantly, keep the documentation current.

An outdated diagram can be worse than no diagram because people may trust information that is no longer true.

Updating documentation should be part of the change itself.

## Validation

The last step is checking whether the original goals were actually achieved.

Do not stop at "the network is online."

Test the parts that mattered in the design.

Can users reach the services they need?

Are networks that should be separated actually separated?

Does a failed uplink behave as expected?

Does the backup gateway take over?

Does spanning tree choose the intended topology?

Does monitoring notice when an important interface goes down?

Can another engineer understand the diagrams and port descriptions?

Are labels correct?

Can the environment be expanded without redesigning everything?

A network design is not finished when the last cable is connected.

It is finished when the result has been tested, documented and handed over in a way that someone else can support.

The strongest network designs are not necessarily the most complicated ones.

They are the ones that remain understandable when something fails.

---

## Knowledge check

{{< quiz >}}
{
  "intro": "Answer these question(s) to test your understanding of this post. Your answers are not saved or sent anywhere; this is simply a personal knowledge check. If you refresh the page, your answers will be cleared.",
  "questions": [
    {
      "question": "What should be the starting point of a network design?",
      "reference": "Planning",
      "referenceUrl": "#planning",
      "answers": [
        {
          "text": "Selecting the switches and access points",
          "correct": false,
          "message": "Incorrect. Hardware selection should follow the requirements of the network."
        },
        {
          "text": "Understanding what the network needs to achieve",
          "correct": true,
          "message": "Correct! A good network design starts with the required outcome."
        },
        {
          "text": "Creating VLANs for every device type",
          "correct": false,
          "message": "Incorrect. Segmentation decisions should follow the actual requirements."
        },
        {
          "text": "Choosing the fastest available uplink speed",
          "correct": false,
          "message": "Incorrect. Capacity is important, but it is not the starting point of the design."
        }
      ]
    },
    {
      "question": "Why should long switch daisy chains generally be avoided?",
      "reference": "Topology",
      "referenceUrl": "#topology",
      "answers": [
        {
          "text": "They prevent VLANs from working",
          "correct": false,
          "message": "Incorrect. VLANs can still work across a daisy chain."
        },
        {
          "text": "They make every switch operate at half speed",
          "correct": false,
          "message": "Incorrect. That is not an automatic result of a daisy chain."
        },
        {
          "text": "Downstream switches become dependent on the switches and uplinks in front of them",
          "correct": true,
          "message": "Correct! A failure higher in the chain can disconnect multiple downstream switches."
        },
        {
          "text": "They cannot be monitored",
          "correct": false,
          "message": "Incorrect. They can be monitored, but the topology can still create unnecessary dependencies."
        }
      ]
    },
    {
      "question": "What problem does Spanning Tree Protocol help prevent?",
      "reference": "Resilience",
      "referenceUrl": "#resilience",
      "answers": [
        {
          "text": "Duplicate IP addresses",
          "correct": false,
          "message": "Incorrect. STP does not manage IP addressing."
        },
        {
          "text": "Layer 2 switching loops",
          "correct": true,
          "message": "Correct! STP creates a loop-free Layer 2 topology while allowing redundant paths to exist."
        },
        {
          "text": "DHCP scope exhaustion",
          "correct": false,
          "message": "Incorrect. STP does not manage DHCP address pools."
        },
        {
          "text": "Wireless interference",
          "correct": false,
          "message": "Incorrect. STP is a wired Layer 2 loop prevention protocol."
        }
      ]
    },
    {
      "question": "What does DHCP relay allow you to do?",
      "reference": "Switching",
      "referenceUrl": "#switching",
      "answers": [
        {
          "text": "Use one central DHCP service for clients in multiple routed VLANs",
          "correct": true,
          "message": "Correct! DHCP relay forwards client requests across Layer 3 boundaries to a DHCP server."
        },
        {
          "text": "Remove the need for DHCP scopes",
          "correct": false,
          "message": "Incorrect. The DHCP server still needs the correct address pools or scopes."
        },
        {
          "text": "Allow all broadcasts to cross every router",
          "correct": false,
          "message": "Incorrect. DHCP relay forwards specific DHCP traffic rather than all broadcasts."
        },
        {
          "text": "Replace DNS in a segmented network",
          "correct": false,
          "message": "Incorrect. DHCP relay and DNS provide different functions."
        }
      ]
    },
    {
      "question": "Why is increasing wireless transmit power not always the best solution?",
      "reference": "Wireless",
      "referenceUrl": "#wireless",
      "answers": [
        {
          "text": "Higher transmit power disables 5 GHz",
          "correct": false,
          "message": "Incorrect. Transmit power does not automatically disable a frequency band."
        },
        {
          "text": "Large cells can create more contention, and clients may not be able to transmit back over the same distance",
          "correct": true,
          "message": "Correct! Wireless communication is two-way, and excessive transmit power can also increase interference."
        },
        {
          "text": "Access points stop supporting VLANs at high power",
          "correct": false,
          "message": "Incorrect. VLAN support is unrelated to transmit power."
        },
        {
          "text": "Higher transmit power always reduces the available bandwidth to zero",
          "correct": false,
          "message": "Incorrect. The problem is mainly cell design, interference and client communication."
        }
      ]
    }
  ]
}
{{< /quiz >}}

---

{{< ads >}}

{{< article-footer >}}