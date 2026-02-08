export const TOKEN_GUARD_ADDRESS = "0x932d47Dc16429aF18a471C3929a06e389664e755" as const;

export const TOKEN_GUARD_ABI = [
  // ERC20
  { type: "function", name: "name", inputs: [], outputs: [{ type: "string" }], stateMutability: "view" },
  { type: "function", name: "symbol", inputs: [], outputs: [{ type: "string" }], stateMutability: "view" },
  { type: "function", name: "decimals", inputs: [], outputs: [{ type: "uint8" }], stateMutability: "view" },
  { type: "function", name: "totalSupply", inputs: [], outputs: [{ type: "uint256" }], stateMutability: "view" },
  { type: "function", name: "balanceOf", inputs: [{ name: "account", type: "address" }], outputs: [{ type: "uint256" }], stateMutability: "view" },
  { type: "function", name: "allowance", inputs: [{ name: "owner", type: "address" }, { name: "spender", type: "address" }], outputs: [{ type: "uint256" }], stateMutability: "view" },
  { type: "function", name: "owner", inputs: [], outputs: [{ type: "address" }], stateMutability: "view" },
  { type: "function", name: "complianceOfficer", inputs: [], outputs: [{ type: "address" }], stateMutability: "view" },
  { type: "function", name: "nextRecordId", inputs: [], outputs: [{ type: "uint256" }], stateMutability: "view" },

  // Identity
  { type: "function", name: "getIdentity", inputs: [{ name: "account", type: "address" }], outputs: [
    { name: "level", type: "uint8" }, { name: "jurisdiction", type: "string" },
    { name: "attestedAt", type: "uint256" }, { name: "attestedBy", type: "address" },
    { name: "frozen", type: "bool" }, { name: "dailyLimit", type: "uint256" },
    { name: "spentToday", type: "uint256" }
  ], stateMutability: "view" },
  { type: "function", name: "identityProviders", inputs: [{ name: "", type: "address" }], outputs: [{ type: "bool" }], stateMutability: "view" },
  { type: "function", name: "allowlist", inputs: [{ name: "", type: "address" }], outputs: [{ type: "bool" }], stateMutability: "view" },

  // Audit trail
  { type: "function", name: "getAuditRecord", inputs: [{ name: "recordId", type: "uint256" }], outputs: [
    { name: "from", type: "address" }, { name: "to", type: "address" },
    { name: "amount", type: "uint256" }, { name: "timestamp", type: "uint256" },
    { name: "status", type: "uint8" }, { name: "reason", type: "string" }
  ], stateMutability: "view" },

  // Policy
  { type: "function", name: "policy", inputs: [], outputs: [
    { name: "requireKYC", type: "bool" }, { name: "minKYCLevel", type: "uint8" },
    { name: "allowlistOnly", type: "bool" }, { name: "jurisdictionRestrictions", type: "bool" },
    { name: "maxTransferAmount", type: "uint256" }, { name: "defaultDailyLimit", type: "uint256" },
    { name: "auditTrailEnabled", type: "bool" }, { name: "transferApprovalRequired", type: "bool" }
  ], stateMutability: "view" },

  // Check
  { type: "function", name: "isTransferAllowed", inputs: [
    { name: "from", type: "address" }, { name: "to", type: "address" }, { name: "amount", type: "uint256" }
  ], outputs: [{ type: "bool" }], stateMutability: "view" },

  // Write
  { type: "function", name: "transfer", inputs: [{ name: "to", type: "address" }, { name: "amount", type: "uint256" }], outputs: [{ type: "bool" }], stateMutability: "nonpayable" },
  { type: "function", name: "approve", inputs: [{ name: "spender", type: "address" }, { name: "amount", type: "uint256" }], outputs: [{ type: "bool" }], stateMutability: "nonpayable" },
  { type: "function", name: "attestIdentity", inputs: [
    { name: "account", type: "address" }, { name: "level", type: "uint8" },
    { name: "jurisdiction", type: "string" }, { name: "dailyLimit", type: "uint256" }
  ], outputs: [], stateMutability: "nonpayable" },
  { type: "function", name: "freezeAccount", inputs: [{ name: "account", type: "address" }, { name: "reason", type: "string" }], outputs: [], stateMutability: "nonpayable" },
  { type: "function", name: "unfreezeAccount", inputs: [{ name: "account", type: "address" }], outputs: [], stateMutability: "nonpayable" },
  { type: "function", name: "updateAllowlist", inputs: [{ name: "account", type: "address" }, { name: "status", type: "bool" }], outputs: [], stateMutability: "nonpayable" },
  { type: "function", name: "blockJurisdiction", inputs: [{ name: "jurisdiction", type: "string" }, { name: "blocked", type: "bool" }], outputs: [], stateMutability: "nonpayable" },
  { type: "function", name: "updateIdentityProvider", inputs: [{ name: "provider", type: "address" }, { name: "status", type: "bool" }], outputs: [], stateMutability: "nonpayable" },
  { type: "function", name: "setKYCRequired", inputs: [{ name: "required", type: "bool" }, { name: "minLevel", type: "uint8" }], outputs: [], stateMutability: "nonpayable" },
  { type: "function", name: "setAllowlistOnly", inputs: [{ name: "enabled", type: "bool" }], outputs: [], stateMutability: "nonpayable" },
  { type: "function", name: "setJurisdictionRestrictions", inputs: [{ name: "enabled", type: "bool" }], outputs: [], stateMutability: "nonpayable" },
  { type: "function", name: "setMaxTransferAmount", inputs: [{ name: "amount", type: "uint256" }], outputs: [], stateMutability: "nonpayable" },
  { type: "function", name: "setDefaultDailyLimit", inputs: [{ name: "limit", type: "uint256" }], outputs: [], stateMutability: "nonpayable" },
  { type: "function", name: "setAuditTrail", inputs: [{ name: "enabled", type: "bool" }], outputs: [], stateMutability: "nonpayable" },

  // Events
  { type: "event", name: "Transfer", inputs: [{ name: "from", type: "address", indexed: true }, { name: "to", type: "address", indexed: true }, { name: "value", type: "uint256" }] },
  { type: "event", name: "IdentityAttested", inputs: [{ name: "account", type: "address", indexed: true }, { name: "level", type: "uint8" }, { name: "jurisdiction", type: "string" }, { name: "provider", type: "address", indexed: true }] },
  { type: "event", name: "AccountFrozen", inputs: [{ name: "account", type: "address", indexed: true }, { name: "reason", type: "string" }] },
  { type: "event", name: "TransferRecorded", inputs: [{ name: "recordId", type: "uint256", indexed: true }, { name: "from", type: "address", indexed: true }, { name: "to", type: "address", indexed: true }, { name: "amount", type: "uint256" }, { name: "status", type: "uint8" }] },
] as const;
