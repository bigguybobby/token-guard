// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title TokenGuard — Compliance-Ready ERC20 with Built-In Audit Trail
/// @notice ERC20 token with allowlists, transfer restrictions, identity attestations,
///         on-chain audit trail, and configurable policy engine
/// @dev Built for SURGE × Moltbook Hackathon — Track 3: Compliance-Ready Tokenization
contract TokenGuard {
    // ─── ERC20 State ─────────────────────────────────────────────────────

    string public name;
    string public symbol;
    uint8 public constant decimals = 18;
    uint256 public totalSupply;

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    // ─── Compliance State ────────────────────────────────────────────────

    enum KYCLevel { None, Basic, Enhanced, Institutional }
    enum TransferStatus { Pending, Approved, Rejected, Executed }

    struct Identity {
        KYCLevel level;
        string jurisdiction;     // ISO country code
        uint256 attestedAt;
        address attestedBy;      // identity provider
        bool frozen;
        uint256 dailyLimit;      // max transfer per day (0 = unlimited)
        uint256 spentToday;
        uint256 lastResetDay;
    }

    struct TransferRecord {
        address from;
        address to;
        uint256 amount;
        uint256 timestamp;
        TransferStatus status;
        string reason;           // rejection reason if any
    }

    struct Policy {
        bool requireKYC;
        KYCLevel minKYCLevel;
        bool allowlistOnly;
        bool jurisdictionRestrictions;
        uint256 maxTransferAmount;    // per transaction (0 = unlimited)
        uint256 defaultDailyLimit;
        bool auditTrailEnabled;
        bool transferApprovalRequired;
    }

    // ─── Mappings ────────────────────────────────────────────────────────

    mapping(address => Identity) public identities;
    mapping(address => bool) public allowlist;
    mapping(string => bool) public blockedJurisdictions;
    mapping(address => bool) public identityProviders;
    mapping(uint256 => TransferRecord) public auditTrail;

    uint256 public nextRecordId;
    Policy public policy;
    address public owner;
    address public complianceOfficer;

    // ─── Events ──────────────────────────────────────────────────────────

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    event IdentityAttested(address indexed account, KYCLevel level, string jurisdiction, address indexed provider);
    event AccountFrozen(address indexed account, string reason);
    event AccountUnfrozen(address indexed account);
    event TransferRecorded(uint256 indexed recordId, address indexed from, address indexed to, uint256 amount, TransferStatus status);
    event PolicyUpdated(string field);
    event AllowlistUpdated(address indexed account, bool status);
    event JurisdictionBlocked(string jurisdiction, bool blocked);
    event IdentityProviderUpdated(address indexed provider, bool status);

    // ─── Modifiers ───────────────────────────────────────────────────────

    modifier onlyOwner() {
        require(msg.sender == owner, "not owner");
        _;
    }

    modifier onlyCompliance() {
        require(msg.sender == complianceOfficer || msg.sender == owner, "not compliance");
        _;
    }

    modifier onlyIdentityProvider() {
        require(identityProviders[msg.sender], "not identity provider");
        _;
    }

    // ─── Constructor ─────────────────────────────────────────────────────

    constructor(
        string memory _name,
        string memory _symbol,
        uint256 _initialSupply,
        address _complianceOfficer
    ) {
        name = _name;
        symbol = _symbol;
        owner = msg.sender;
        complianceOfficer = _complianceOfficer;
        identityProviders[msg.sender] = true;

        // Default policy: permissive
        policy = Policy({
            requireKYC: false,
            minKYCLevel: KYCLevel.None,
            allowlistOnly: false,
            jurisdictionRestrictions: false,
            maxTransferAmount: 0,
            defaultDailyLimit: 0,
            auditTrailEnabled: true,
            transferApprovalRequired: false
        });

        // Mint initial supply to deployer
        balanceOf[msg.sender] = _initialSupply;
        totalSupply = _initialSupply;
        emit Transfer(address(0), msg.sender, _initialSupply);
    }

    // ─── Identity Management ─────────────────────────────────────────────

    function attestIdentity(
        address account,
        KYCLevel level,
        string calldata jurisdiction,
        uint256 dailyLimit
    ) external onlyIdentityProvider {
        identities[account] = Identity({
            level: level,
            jurisdiction: jurisdiction,
            attestedAt: block.timestamp,
            attestedBy: msg.sender,
            frozen: false,
            dailyLimit: dailyLimit > 0 ? dailyLimit : policy.defaultDailyLimit,
            spentToday: 0,
            lastResetDay: block.timestamp / 1 days
        });
        emit IdentityAttested(account, level, jurisdiction, msg.sender);
    }

    function freezeAccount(address account, string calldata reason) external onlyCompliance {
        identities[account].frozen = true;
        emit AccountFrozen(account, reason);
    }

    function unfreezeAccount(address account) external onlyCompliance {
        identities[account].frozen = false;
        emit AccountUnfrozen(account);
    }

    // ─── Policy Management ───────────────────────────────────────────────

    function setKYCRequired(bool required, KYCLevel minLevel) external onlyOwner {
        policy.requireKYC = required;
        policy.minKYCLevel = minLevel;
        emit PolicyUpdated("KYC");
    }

    function setAllowlistOnly(bool enabled) external onlyOwner {
        policy.allowlistOnly = enabled;
        emit PolicyUpdated("allowlist");
    }

    function setJurisdictionRestrictions(bool enabled) external onlyOwner {
        policy.jurisdictionRestrictions = enabled;
        emit PolicyUpdated("jurisdiction");
    }

    function setMaxTransferAmount(uint256 amount) external onlyOwner {
        policy.maxTransferAmount = amount;
        emit PolicyUpdated("maxTransfer");
    }

    function setDefaultDailyLimit(uint256 limit) external onlyOwner {
        policy.defaultDailyLimit = limit;
        emit PolicyUpdated("dailyLimit");
    }

    function setAuditTrail(bool enabled) external onlyOwner {
        policy.auditTrailEnabled = enabled;
        emit PolicyUpdated("auditTrail");
    }

    function setTransferApprovalRequired(bool required) external onlyOwner {
        policy.transferApprovalRequired = required;
        emit PolicyUpdated("transferApproval");
    }

    // ─── Access Control ──────────────────────────────────────────────────

    function updateAllowlist(address account, bool status) external onlyCompliance {
        allowlist[account] = status;
        emit AllowlistUpdated(account, status);
    }

    function blockJurisdiction(string calldata jurisdiction, bool blocked) external onlyCompliance {
        blockedJurisdictions[jurisdiction] = blocked;
        emit JurisdictionBlocked(jurisdiction, blocked);
    }

    function updateIdentityProvider(address provider, bool status) external onlyOwner {
        identityProviders[provider] = status;
        emit IdentityProviderUpdated(provider, status);
    }

    // ─── Compliance Check ────────────────────────────────────────────────

    function _checkCompliance(address from, address to, uint256 amount) internal returns (bool, string memory) {
        // Frozen check
        if (identities[from].frozen) return (false, "sender frozen");
        if (identities[to].frozen) return (false, "recipient frozen");

        // Allowlist check
        if (policy.allowlistOnly) {
            if (!allowlist[from]) return (false, "sender not allowlisted");
            if (!allowlist[to]) return (false, "recipient not allowlisted");
        }

        // KYC check
        if (policy.requireKYC) {
            if (uint8(identities[from].level) < uint8(policy.minKYCLevel))
                return (false, "sender KYC insufficient");
            if (uint8(identities[to].level) < uint8(policy.minKYCLevel))
                return (false, "recipient KYC insufficient");
        }

        // Jurisdiction check
        if (policy.jurisdictionRestrictions) {
            if (blockedJurisdictions[identities[from].jurisdiction])
                return (false, "sender jurisdiction blocked");
            if (blockedJurisdictions[identities[to].jurisdiction])
                return (false, "recipient jurisdiction blocked");
        }

        // Max transfer check
        if (policy.maxTransferAmount > 0 && amount > policy.maxTransferAmount)
            return (false, "exceeds max transfer");

        // Daily limit check
        if (identities[from].dailyLimit > 0) {
            uint256 today = block.timestamp / 1 days;
            if (today > identities[from].lastResetDay) {
                identities[from].spentToday = 0;
                identities[from].lastResetDay = today;
            }
            if (identities[from].spentToday + amount > identities[from].dailyLimit)
                return (false, "exceeds daily limit");
            identities[from].spentToday += amount;
        }

        return (true, "");
    }

    // ─── ERC20 Functions ─────────────────────────────────────────────────

    function approve(address spender, uint256 amount) external returns (bool) {
        allowance[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    function transfer(address to, uint256 amount) external returns (bool) {
        return _transfer(msg.sender, to, amount);
    }

    function transferFrom(address from, address to, uint256 amount) external returns (bool) {
        uint256 allowed = allowance[from][msg.sender];
        if (allowed != type(uint256).max) {
            require(allowed >= amount, "insufficient allowance");
            allowance[from][msg.sender] = allowed - amount;
        }
        return _transfer(from, to, amount);
    }

    function _transfer(address from, address to, uint256 amount) internal returns (bool) {
        require(from != address(0), "from zero");
        require(to != address(0), "to zero");
        require(balanceOf[from] >= amount, "insufficient balance");

        // Compliance check
        (bool compliant, string memory reason) = _checkCompliance(from, to, amount);

        if (policy.auditTrailEnabled) {
            uint256 recordId = nextRecordId++;
            auditTrail[recordId] = TransferRecord({
                from: from,
                to: to,
                amount: amount,
                timestamp: block.timestamp,
                status: compliant ? TransferStatus.Executed : TransferStatus.Rejected,
                reason: reason
            });
            emit TransferRecorded(recordId, from, to, amount, compliant ? TransferStatus.Executed : TransferStatus.Rejected);
        }

        require(compliant, reason);

        balanceOf[from] -= amount;
        balanceOf[to] += amount;
        emit Transfer(from, to, amount);
        return true;
    }

    // ─── View Functions ──────────────────────────────────────────────────

    function getIdentity(address account) external view returns (
        KYCLevel level,
        string memory jurisdiction,
        uint256 attestedAt,
        address attestedBy,
        bool frozen,
        uint256 dailyLimit,
        uint256 spentToday
    ) {
        Identity storage id = identities[account];
        return (id.level, id.jurisdiction, id.attestedAt, id.attestedBy, id.frozen, id.dailyLimit, id.spentToday);
    }

    function getAuditRecord(uint256 recordId) external view returns (
        address from,
        address to,
        uint256 amount,
        uint256 timestamp,
        TransferStatus status,
        string memory reason
    ) {
        TransferRecord storage r = auditTrail[recordId];
        return (r.from, r.to, r.amount, r.timestamp, r.status, r.reason);
    }

    function isTransferAllowed(address from, address to, uint256 amount) external view returns (bool) {
        if (identities[from].frozen || identities[to].frozen) return false;
        if (policy.allowlistOnly && (!allowlist[from] || !allowlist[to])) return false;
        if (policy.requireKYC) {
            if (uint8(identities[from].level) < uint8(policy.minKYCLevel)) return false;
            if (uint8(identities[to].level) < uint8(policy.minKYCLevel)) return false;
        }
        if (policy.jurisdictionRestrictions) {
            if (blockedJurisdictions[identities[from].jurisdiction]) return false;
            if (blockedJurisdictions[identities[to].jurisdiction]) return false;
        }
        if (policy.maxTransferAmount > 0 && amount > policy.maxTransferAmount) return false;
        return true;
    }
}
