# 🛡️ TokenGuard — SURGE × Moltbook Hackathon Submission

## Track: 3 — Compliance-Ready Tokenization
**Prize: $10,000 in $SURGE Tokens**

---

## Basic Information

**Project Title:** TokenGuard

**Short Description:** Compliance-ready ERC20 token with built-in KYC attestation, allowlists, jurisdiction restrictions, daily spending limits, and a complete on-chain audit trail — making token compliance a first-class feature, not an afterthought.

**Long Description:**

TokenGuard is a compliance-ready ERC20 token that makes the agent internet economically real by embedding regulatory compliance directly into the token contract. Instead of bolting compliance onto existing tokens as an afterthought, TokenGuard makes it native.

**The Problem:** As tokenized economies scale, compliance becomes the bottleneck. Projects either ignore it (and get shut down) or add it as a clunky wrapper (and lose composability). The agent internet needs tokens that are compliant by default.

**Our Solution — TokenGuard embeds compliance at the protocol level:**

1. **Identity Attestation (4-Tier KYC):** Identity providers attest accounts with KYC levels (None → Basic → Enhanced → Institutional) and jurisdiction codes. This enables verifiable, on-chain identity without centralized KYC providers.

2. **Configurable Policy Engine:** Token owners set policies — require KYC, enable allowlist-only mode, restrict jurisdictions, set max transfer amounts, configure daily spending limits. All toggleable on-chain.

3. **On-Chain Audit Trail:** Every transfer is recorded with full metadata — sender, recipient, amount, timestamp, status (Executed/Rejected), and rejection reason. This creates a complete, immutable compliance record.

4. **Transfer Pre-Check:** The `isTransferAllowed()` view function lets wallets, agents, and dApps check compliance BEFORE attempting a transfer — preventing failed transactions and improving UX.

5. **Account Freezing:** Compliance officers can freeze/unfreeze accounts with documented reasons, enabling rapid response to suspicious activity.

6. **Jurisdiction Restrictions:** Block transfers to/from sanctioned jurisdictions using ISO country codes.

**Why the token model is NOT a gimmick:**
- Compliance is enforced at the transfer level — every token transfer goes through policy checks
- The audit trail creates real accountability — not just for regulators but for the community
- Identity attestations are permissionless — any registered identity provider can attest
- Daily limits and max transfer amounts prevent large-scale exploitation
- The policy engine is configurable — tokens can start permissive and tighten as they scale

**How incentives drive real usage:**
- Identity providers are incentivized to provide quality attestations (reputation at stake)
- Projects adopting TokenGuard gain regulatory credibility
- The audit trail enables compliance-as-a-service business models
- Configurable policies allow progressive compliance as regulations evolve

---

## Technology & Category Tags
- Compliance, Tokenization, ERC20, KYC, Identity, Audit Trail, Policy Engine
- Solidity, Foundry, Next.js, TypeScript, wagmi, viem, ConnectKit

---

## Submission Checklist

### ✅ Working Demo
- Contract deployed on Celo Sepolia: `0x932d47Dc16429aF18a471C3929a06e389664e755`
- Interactive frontend with 6 tabs: Overview, Transfer, Identity, Policy, Audit Trail, Allowlist
- All features functional via wallet connection

### ✅ Code Repository
- GitHub: https://github.com/bigguybobby/token-guard
- Open source, MIT License
- 52/52 tests passing
- 100% line coverage, 100% statement, 97.6% branch, 100% function
- Slither static analysis: no critical/high findings

### ✅ Clear Token Model
- ERC20 with compliance layer — not a wrapper, not an oracle
- Policy enforcement at transfer level
- On-chain audit trail for every transaction
- Configurable by token owner, not hardcoded

---

## Video Script (60 seconds)

"TokenGuard is a compliance-ready ERC20 that makes the agent internet economically real.

The problem: tokens need compliance to survive, but bolting it on breaks composability.

Our solution: TokenGuard embeds compliance natively. Four-tier KYC attestation. Allowlists. Jurisdiction restrictions. Daily spending limits. And a complete on-chain audit trail for every transfer.

[Show dashboard — Overview tab with policy toggles]

Every transfer goes through the policy engine. If a transfer violates any rule, it's rejected with a reason — and that rejection is recorded on-chain.

[Show Transfer tab with pre-check]

Identity providers can attest accounts on-chain. Project owners can toggle policies as regulations evolve. And the audit trail gives you a complete, immutable compliance record.

[Show Audit Trail tab]

52 tests, 100% coverage, Slither clean. Built for Track 3 — Compliance-Ready Tokenization.

TokenGuard. Compliance as a feature, not an afterthought."

---

## X (Twitter) Post Template

🛡️ TokenGuard — Compliance-Ready ERC20 with Built-In Audit Trail

Built for @Surgexyz_ × @lablabai Hackathon — Track 3

✅ 4-tier KYC attestation
✅ Allowlists & jurisdiction restrictions
✅ On-chain audit trail for every transfer
✅ 52 tests, 100% coverage

Demo: [VERCEL_URL]
Submission: [LABLAB_URL]

#SURGEHackathon #Web3 #Compliance

---

## Slide Deck Outline

1. **Title:** TokenGuard — Compliance-Ready ERC20
2. **Problem:** Token compliance is an afterthought → projects get shut down or lose composability
3. **Solution:** Native compliance layer — KYC, allowlists, jurisdictions, audit trail
4. **Architecture:** ERC20 → Policy Engine → Audit Trail → Identity Registry
5. **Demo:** Dashboard screenshots (6 tabs)
6. **Token Model:** Not a gimmick — enforced at transfer level, creates real accountability
7. **Technical:** 52 tests, 100% coverage, Slither clean, Foundry + Next.js
8. **Team:** Smart contract security researcher, prior audits (Pinto, Alchemix, Threshold, SSV)
