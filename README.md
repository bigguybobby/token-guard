# 🛡️ TokenGuard — Compliance-Ready ERC20 with Built-In Audit Trail

> Built for SURGE × Moltbook Hackathon — Track 3: Compliance-Ready Tokenization
> $50K Prize Pool | Deadline: Feb 19, 2026

## Features
- **ERC20 Token** with full compliance layer
- **Identity Attestation** — KYC levels (None/Basic/Enhanced/Institutional) with jurisdiction tracking
- **Account Freezing** — Compliance officer can freeze/unfreeze accounts with reasons
- **Allowlists** — Toggle allowlist-only mode for restricted transfers
- **KYC Requirements** — Configurable minimum KYC level for transfers
- **Jurisdiction Restrictions** — Block transfers to/from sanctioned jurisdictions
- **Max Transfer Limits** — Per-transaction amount caps
- **Daily Spending Limits** — Per-account daily transfer caps with auto-reset
- **On-Chain Audit Trail** — Every transfer recorded with status, timestamp, and rejection reason
- **Policy Engine** — Owner-configurable compliance policies
- **Transfer Pre-check** — `isTransferAllowed()` view function

## Deployed
- **Celo Sepolia:** `0x932d47Dc16429aF18a471C3929a06e389664e755`

## Tests
26/26 passing — ERC20, identity, freezing, allowlist, KYC, jurisdictions, limits, audit trail, access control

## Tech Stack
- Solidity 0.8.20 + Foundry
- Next.js + TypeScript + Tailwind (frontend)
- wagmi + viem + ConnectKit

## Why TokenGuard?
Tokens need compliance to be taken seriously. TokenGuard makes compliance a first-class feature — not an afterthought. Built-in audit trails, identity verification, and configurable policy engines make it possible to issue tokens that are actually ready for real-world use.
