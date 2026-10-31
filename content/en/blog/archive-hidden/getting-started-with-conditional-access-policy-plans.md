---
title: "Getting started with Conditional Access Policy Plans"
date: 2026-10-31
slug: "getting-started-with-conditional-access-policy-plans"
categories:
  - Microsoft Entra
tags:
  - Step by Step guides
  - Knowledge check
description: "Learn how Microsoft Entra Conditional Access Policy Plans organize multiple rules into a layered security baseline, with a practical lab and examples from my existing Conditional Access policies."
---

In this guide I will dive into the new Microsoft Entra Conditional Access Policy Plans feature which is in preview and show how to configure a plan with multiple rules. I will also use the Conditional Access policies from my own environment to explain why a secure tenant needs several policies working together, and how Policy Plans can help us organize those policies around a clear baseline. Which can be used for multiple tenants.

We will go through this new feature step by step, look at the migration options, verify results in sign-in logs, and cover important preview limitations. However, the feature is still in preview at the time of writing, so do not perform these tasks in a production environment yet.

---

## The solution described

Conditional Access is one of my favorite security features in Microsoft Entra. With it, we can decide which users, devices and applications are allowed to access company resources and under which conditions.

Over time, however, an environment can end up with many policies containing exactly the same group assignments or emergency access exclusions. Maintaining those repeated settings is time consuming, and a small mistake can have a big impact on user access.

Policy Plans add a way to organize related Conditional Access rules in one place. A plan contains three main parts:

- Plan details: The name, description, tags and owners of the plan.
- Shared conditions: The identities, resources, exclusions and other conditions that must apply to every rule in the plan.
- Rules: The individual scenarios with their own grant or session controls.

A plan does not replace the Conditional Access enforcement engine. During sign-in, each rule is evaluated independently, together with all existing standalone Conditional Access policies. A user must satisfy every applicable enforced rule and policy. A Policy Plan is a way to organize related controls, not a shortcut that replaces the need for multiple controls.

For this guide I will use one lab group and create two report-only rules:

| Object | Name | Purpose |
| --- | --- | --- |
| User group | SG-CA-PolicyPlans-Lab | Contains only test users |
| Emergency access account/group | Existing emergency access identity | Excluded from the plan |
| Policy plan | CA - Lab - Protect user sign-ins | Shared targeting and exclusions |
| Rule 1 | Require MFA for lab users | Requires MFA for the lab group |
| Rule 2 | Require compliant Windows device | Checks Windows device compliance |

<!-- Screenshot to capture: Policy Plans landing page with a sample plan and its shared conditions/rules. -->

{{% alert title="Info" color="info" %}}
For the official feature description and limitations, see [Microsoft's Conditional Access Policy Plans documentation](https://learn.microsoft.com/en-us/entra/identity/conditional-access/concept-conditional-access-policy-plans).
{{% /alert %}}

---

## Why one Conditional Access policy is never the whole baseline

I often see Conditional Access discussed as if enabling a single MFA policy is enough to secure a Microsoft 365 tenant. MFA is an essential part of the picture, but it does not cover every scenario. A sign-in can come from an unmanaged device, use an outdated authentication method, involve a risky identity, or originate from a location we do not expect. These are different situations, and they often require different decisions.

This is why I approach Conditional Access as a layered security baseline. Rather than trying to build one enormous policy, I use separate policies with focused objectives. For example, one rule can require MFA, another can require a compliant device, and another can block an authentication flow. When more than one enforced policy applies to a sign-in, every applicable requirement must be met. A successful MFA challenge does not override a device compliance requirement or a block decision.

Policy Plans fit nicely into that approach. They let us collect related Conditional Access rules into a logical plan, reuse shared targeting and exclusions, and document which security objective the rules support. For me, that makes Policy Plans a useful foundation for managing a baseline made up of multiple policies. It does not mean that every policy should be forced into one plan. Different user populations, applications and security objectives may need separate plans or standalone policies.

The key distinction is simple: the baseline is the complete set of security decisions we want to apply; a Policy Plan is a way to organize some of those decisions. Conditional Access remains a combination of individually evaluated policies and rules working together.

## My existing policies as a practical example

In my environment, I currently have the following nine Conditional Access policies, all shown as enabled in the Microsoft Entra admin center:

| Existing policy | Security area suggested by its name |
| --- | --- |
| JV-Allow-MFAforAdminPortals | MFA for administrative portals |
| JV-Allow-RequireCompliantMFA | MFA and device compliance |
| JV-Block-365InsiderRisks | Insider-risk-related access |
| JV-Block-DeviceCodeFlow | Device code authentication flow |
| JV-Block-Devices | Device-related access restrictions |
| JV-Block-LegacyAuthentication | Legacy authentication |
| JV-Block-RiskyUsersSignins | Risky users or sign-ins |
| JV-Block-UnknownCountries | Location-based access restrictions |
| JV-Block-WindowsAzureServiceMGMTApi | Access to a management-related cloud resource |

<!-- Screenshot to insert: My existing nine enabled Conditional Access policies in Microsoft Entra. -->

These names illustrate the different layers I want in a Conditional Access strategy. The screenshot shows policy names and states, not their complete assignments, exclusions, grant controls or licensing. The descriptions above are therefore interpretations of the names, not a verified assessment of how each policy is configured or whether it is effective. Also, `Allow` in a policy name does not mean it overrides another policy that blocks access.

### Turning those policies into a baseline plan

If I wanted to organize this environment with Policy Plans, I would first group the policies by security objective. The following is an example design to investigate, not a ready-to-apply migration map:

| Candidate plan or approach | Existing policies to review | What I would verify first |
| --- | --- | --- |
| CA - Baseline - User and device access | JV-Allow-RequireCompliantMFA, JV-Block-Devices | Whether users, resources and device requirements are compatible |
| CA - Baseline - Authentication flows | JV-Block-LegacyAuthentication, JV-Block-DeviceCodeFlow | Whether the identities and exclusions can safely be shared |
| CA - Baseline - Privileged access | JV-Allow-MFAforAdminPortals, JV-Block-WindowsAzureServiceMGMTApi | Whether the protected resources and administrator scope really overlap |
| CA - Baseline - Risk-based access | JV-Block-RiskyUsersSignins, JV-Block-365InsiderRisks | The exact risk conditions, supported controls and required licenses |
| Keep standalone for now | JV-Block-UnknownCountries | The location-condition limitation in Policy Plans preview |

This organization could give us several smaller, understandable plans rather than one large collection of unrelated rules. Within each candidate plan, I would put only truly common assignments and exclusions into shared conditions. Anything that differs, such as a specific application, device platform, authentication flow or grant control, belongs at rule level.

It is important to review the actual policy configuration before grouping anything. Two policies with similar names may target completely different users, and merging them without checking shared conditions could unintentionally broaden their scope. I would also keep the location-based policy separate during the preview because Microsoft documents a limitation concerning location conditions and instant IP enforcement.

For a production baseline, I would document the purpose of every policy, its owner, targeted identities and applications, exclusions, grant and session controls, licensing requirements and expected sign-in behavior. Only then would I decide which policies make sense together in a Policy Plan. The lab below demonstrates this method with two new rules and a safely scoped test group.

---

## Step 1: Check the requirements

Before creating the plan, we first need to make sure we have the correct permissions and licensing.

- A Microsoft Entra tenant with the appropriate Conditional Access licensing (generally Microsoft Entra ID P1 or a qualifying bundle such as Microsoft 365 Business Premium).
- An account with the Conditional Access Administrator role to create or change a Policy Plan.
- One or more separate test accounts. Don't use your daily administrator account as the only test account.
- An existing emergency access account which is excluded from restrictive access policies.
- For the second example rule, a Windows test device that is registered and marked compliant by Intune, if you want to evaluate a successful compliant-device sign-in.

Risk-based policies require additional licensing, but we won't use them in this basic lab.

I strongly recommend documenting your current policies and using Report-only mode throughout this guide. You don't want to discover a configuration mistake after locking out everyone in your tenant.

---

## Step 2: Create the security group

We will start by preparing our test users so we don't accidentally target all users in the environment.

Go to the Microsoft Entra admin center: [https://entra.microsoft.com](https://entra.microsoft.com).

Navigate to Entra ID -> Groups -> All groups and click New group.

Create the following group:

| Setting | Value |
| --- | --- |
| Group type | Security |
| Group name | SG-CA-PolicyPlans-Lab |
| Membership type | Assigned |
| Members | Only your dedicated test account(s) |

Click Create, open the new group and verify that only the intended test users are members.

<!-- Screenshot to capture: The lab security group with its membership. -->

I use a dedicated group because it makes the scope very clear. You can remove all test users from this group if you need to stop targeting them while investigating the configuration, although you should still manage rule state directly for a proper rollback.

---

## Step 3: Create the Conditional Access Policy Plan

We can now create our first plan.

In the Entra admin center, navigate to Entra ID -> Conditional Access -> Policy plans (Preview).

Click Create policy to create a custom plan, rather than selecting a template.

Fill in the plan details:

| Setting | Value |
| --- | --- |
| Name | CA - Lab - Protect user sign-ins |
| Description | Lab plan to test shared user targeting and two independent Conditional Access rules |
| Tags | Optional; for example Lab |
| Owner | Your administrator account or the responsible security team |

The owner field documents who is responsible for this plan. It does not grant permission to change the plan. Administrator roles still determine who can edit the configuration.

<!-- Screenshot to capture: Create policy plan form with plan details. -->

Click through to configure the shared conditions.

---

## Step 4: Configure the shared conditions

Shared conditions are the main improvement of this new feature. Instead of repeating the same assignments in multiple policies, we put the settings that every rule has in common here.

For our example, configure the following:

| Shared condition | Configuration |
| --- | --- |
| Include identities | Group SG-CA-PolicyPlans-Lab |
| Exclude identities | Your emergency access account or group |
| Resources | Leave unconfigured at the shared level |
| Device platform | Leave unconfigured at the shared level |
| Named locations | Leave unconfigured |

Under Add users, agents or workload identities, include the lab group. Under the exclusions, select your existing emergency access identity.

<!-- Screenshot to capture: Shared conditions showing the included lab group and excluded emergency account. -->

There are some things to remember here:

- Conditions configured at the plan level are inherited by every rule.
- An individual rule cannot remove a shared exclusion.
- A rule cannot narrow the identities included at the plan level; additional exclusions are possible.
- All users is not available as shared targeting. For broad targeting, configure identities at rule level instead.
- All resources can only be selected inside a rule.
- Shared identity targeting cannot mix different identity types such as users and agents.

In this guide, we keep the shared conditions simple. The different grant controls will be configured in the rules themselves.

---

## Step 5: Create the first rule - Require MFA

After configuring the shared conditions, click Continue to configure the first rule.

Give the rule the following configuration:

| Setting | Value |
| --- | --- |
| Name | Require MFA for lab users |
| State | Report-only |
| Identities | Inherit the shared lab group |
| Resources | All resources |
| Grant control | Require multifactor authentication |

Do not enable the rule for enforcement yet. Report-only lets us inspect its result without introducing a new access requirement for the test users.

Review the rule, confirm the shared exclusions and create the plan.

<!-- Screenshot to capture: First rule configuration showing Report-only and Require MFA. -->

The rule is now part of our plan, but the plan can still contain additional rules for other scenarios.

---

## Step 6: Add a second rule - Require a compliant Windows device

We will now add a second rule for the same group of users.

Open your new plan, select Edit plan and add another rule.

Configure the rule as follows:

| Setting | Value |
| --- | --- |
| Name | Require compliant Windows device |
| State | Report-only |
| Identities | Inherit the shared lab group |
| Resources | All resources |
| Device platforms | Include Windows |
| Grant control | Require device to be marked as compliant |

<!-- Screenshot to capture: Second rule with Windows device platform and compliant device grant control. -->

Our policy structure now looks like this:

| Part | Configured condition |
| --- | --- |
| Plan | Includes the lab group; excludes emergency access identities |
| Rule 1 | Requires MFA when this rule applies |
| Rule 2 | Requires compliant Windows devices when this rule applies |

Both rules inherit the same lab group and emergency access exclusions. We don't have to duplicate these assignments each time.

One thing that is very important: rules don't override each other. When a Windows sign-in matches both rules, both grant requirements apply if you later enable the rules. A successful MFA prompt doesn't cancel the compliant device requirement.

---

## Step 7: Test the Policy Plan using sign-in logs

Now that we have our plan ready, we should verify its behavior before enabling it.

Sign in with one of the test users and access an application such as Microsoft 365. For the second rule, also test a compliant Windows device and, if available, a noncompliant Windows device.

Navigate to Entra ID -> Monitoring & health -> Sign-in logs and open the sign-in event belonging to the test account.

Open the Conditional Access information for that event. The individual rules from the Policy Plan should appear separately in the Conditional Access evaluation.

For our lab, verify at least these scenarios:

| Sign-in | What to check |
| --- | --- |
| Lab user on a compliant Windows device | The MFA and Windows compliance rule evaluations |
| Lab user on a noncompliant Windows device | Report-only result of the compliance rule |
| Lab user on another platform | Whether the Windows-specific rule is out of scope |
| User outside the lab group | Whether the new plan rules are not applicable |
| Emergency access identity | Whether the shared exclusion is respected |

<!-- Screenshot to capture: Sign-in log Conditional Access tab showing the two plan rules and report-only results. -->

{{% alert title="Warning" color="warning" %}}
Report-only is not enforcement. Existing standalone policies can still enforce access and the report-only result is not a guarantee of what every future session will do. Check actual sign-in events, relevant token/session behavior, and your tenant's existing policies before turning rules on.
{{% /alert %}}

---

## Step 8: Migrating existing Conditional Access policies (optional)

Most organizations already have many Conditional Access policies. Creating a fresh plan is easy, but moving existing policies needs a little more attention. In my own list of nine enabled policies, I would start with a small pair that genuinely shares the same objective and targeting, rather than migrating everything at once.

Microsoft provides a migration experience to help identify overlapping assignments and conditions. Use the proposed baseline groupings above only as a starting point for reviewing candidates; do not choose policies for migration based on their names alone.

Go to Entra ID -> Conditional Access -> Policies.

Look for the Migrate to Conditional Access Policy plans (Preview) banner and click Get started.

1. Select a small number of related policies with a similar security objective.
2. Click Merge policies into a plan.
3. Review the suggested shared conditions and individual rules.
4. Give the proposed plan a clear name and inspect every exclusion, application, and grant control.
5. Click Create policy plan when the suggested configuration is correct.
6. Open the new plan, verify its settings and change its initial rules from Off to Report-only for validation.

<!-- Screenshot to capture: Migration wizard suggesting shared conditions from existing policies. -->

The important part is that the migration experience does not modify your original policies. Those policies remain as they were and continue to be evaluated. Migrated rules start in `Off`, so change them to `Report-only` only when you are ready to validate them.

After the new rules have been validated, you can consider enabling them and disabling their original counterparts as part of a controlled change. Don't automatically delete your original policies just because a migration wizard created a plan.

---

## Step 9: Important preview limitations

The concept is promising, but there are still some limitations to consider:

- The feature is in preview and behavior, UI or capabilities may change.
- Shared exclusions cannot be removed at rule level.
- Plan-level identity targeting cannot be narrowed by a rule; design shared conditions carefully.
- All resources is available at the individual rule level, not at the shared conditions level.
- Each rule and every applicable standalone policy must be satisfied; there is no priority or override mechanism between them.
- Microsoft documents a specific location-condition limitation during the preview: users targeted by policy plans using Location receive one-hour access tokens without an instant IP enforcement check. Evaluate this carefully before using a plan for location-sensitive security controls.

I would not use the migration feature to change a large production Conditional Access environment in one action. Start with a small set of policies that you know well. For example, I would review the actual scopes of `JV-Block-LegacyAuthentication` and `JV-Block-DeviceCodeFlow` before considering an authentication-flows plan. I would leave `JV-Block-UnknownCountries` standalone until I have specifically assessed the preview location limitation.

---

## Step 10: Troubleshooting (optional)

### The Policy Plans menu isn't visible

Check your administrator role, tenant availability and licensing first. The feature is still in preview, so menu availability may vary. Verify the latest Microsoft documentation before concluding that your tenant has a configuration problem.

### The rule affects more users than expected

Review the shared identity targeting and any rule-level additions or exclusions. Remember that shared conditions apply to all rules in the plan.

### My sign-in doesn't show the rule

Check that the user belongs to the test group, the resource and device conditions actually match, and the rule is in Report-only or On rather than Off. Make sure you inspect the correct sign-in event and allow for log processing time.

### A new plan conflicts with an existing policy

This is expected behavior: plans don't replace standalone policies. Check the Conditional Access tab in sign-in logs and compare all applicable grant controls. Every applicable enforced policy and plan rule must be satisfied. If a sign-in gets blocked even after satisfying MFA, look for other matching controls such as device compliance or an explicit block.

---

## Knowledge check

{{< quiz >}}
{
  "intro": "Answer these question(s) to test your understanding of this post. Your answers are not saved or sent anywhere; this is simply a personal knowledge check. If you refresh the page, your answers will be cleared.",
  "questions": [
    {
      "question": "What is the purpose of shared conditions in a Conditional Access Policy Plan?",
      "reference": "See the section: The solution described",
      "referenceUrl": "#the-solution-described",
      "answers": [
        {
          "text": "To define common assignments and exclusions once for related rules",
          "correct": true,
          "message": "Correct! All rules inherit the shared conditions."
        },
        {
          "text": "To disable all existing Conditional Access policies",
          "correct": false,
          "message": "Incorrect. Existing policies continue to operate independently."
        },
        {
          "text": "To replace multifactor authentication",
          "correct": false,
          "message": "Incorrect. MFA remains a grant control in individual rules."
        }
      ]
    },
    {
      "question": "What happens to existing policies when using the migration wizard?",
      "reference": "See the section: Step 8: Migrating existing Conditional Access policies (optional)",
      "referenceUrl": "#step-8-migrating-existing-conditional-access-policies-optional",
      "answers": [
        {
          "text": "They are deleted immediately",
          "correct": false,
          "message": "Incorrect. The originals remain unchanged."
        },
        {
          "text": "They remain unchanged and continue to be evaluated",
          "correct": true,
          "message": "Correct! Validate the proposed plan before retiring older policies."
        },
        {
          "text": "They automatically become Report-only",
          "correct": false,
          "message": "Incorrect. The migration doesn't alter the original policy state."
        }
      ]
    },
    {
      "question": "Why is a single MFA policy not a complete Conditional Access baseline?",
      "reference": "See the section: Why one Conditional Access policy is never the whole baseline",
      "referenceUrl": "#why-one-conditional-access-policy-is-never-the-whole-baseline",
      "answers": [
        {
          "text": "Because MFA is only one control, and separate policies may also be needed for device trust, risky sign-ins and authentication methods",
          "correct": true,
          "message": "Correct! Each applicable Conditional Access rule contributes to the overall decision."
        },
        {
          "text": "Because a Policy Plan automatically overrides all standalone policies",
          "correct": false,
          "message": "Incorrect. Plans and standalone policies are evaluated independently."
        },
        {
          "text": "Because all nine policies must be merged into one plan",
          "correct": false,
          "message": "Incorrect. Only policies with suitable shared conditions should be grouped."
        }
      ]
    },
    {
      "question": "Why should we use Report-only when creating a new plan?",
      "reference": "See the section: Step 7: Test the Policy Plan using sign-in logs",
      "referenceUrl": "#step-7-test-the-policy-plan-using-sign-in-logs",
      "answers": [
        {
          "text": "It allows evaluation without enforcing the new rules",
          "correct": true,
          "message": "Correct! Review real sign-in results before changing to On."
        },
        {
          "text": "It prevents the rules from being logged",
          "correct": false,
          "message": "Incorrect. Report-only results are visible in sign-in logs."
        },
        {
          "text": "It disables existing policies",
          "correct": false,
          "message": "Incorrect. Existing policies remain effective."
        }
      ]
    }
  ]
}
{{< /quiz >}}

---

## Summary

Conditional Access Policy Plans give us a new way to keep related configurations organized. By defining shared assignments and exclusions once, we can reduce repeated configuration and make it easier to see which rules support the same security objective.

My nine existing policies are a good reminder of why I prefer a layered Conditional Access baseline. MFA, device requirements, authentication-flow restrictions and risk or location controls address different access scenarios. No individual policy should be treated as the complete solution. Policy Plans can help structure these layers, but they do not replace standalone policies or change how the Conditional Access engine evaluates them.

I would start with a lab group and `Report-only` rules, review actual sign-in results and then migrate small, genuinely related sets of policies. Keep location-sensitive controls and other preview limitations in mind, and do not retire existing policies before the replacement rules have been fully validated.

Thank you for reading this page and I hope it was helpful.

{{% alert title="Sources 📖" color="info" %}}
These sources helped me by writing and research for this post:

1. https://learn.microsoft.com/en-us/entra/identity/conditional-access/concept-conditional-access-policy-plans
2. https://learn.microsoft.com/en-us/entra/identity/conditional-access/how-to-create-conditional-access-policy-plan
3. https://learn.microsoft.com/en-us/entra/identity/conditional-access/how-to-migrate-conditional-access-policy-plan
4. https://learn.microsoft.com/en-us/entra/identity/conditional-access/overview
5. https://learn.microsoft.com/en-us/entra/identity/conditional-access/concept-conditional-access-policies
{{% /alert %}}

{{< ads >}}

{{< article-footer >}}
