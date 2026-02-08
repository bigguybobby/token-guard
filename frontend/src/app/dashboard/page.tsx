"use client";
import { useState } from "react";
import { ConnectKitButton } from "connectkit";
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { formatUnits, parseUnits, isAddress } from "viem";
import { TOKEN_GUARD_ADDRESS, TOKEN_GUARD_ABI } from "@/config/contract";

const KYC_LABELS = ["None", "Basic", "Enhanced", "Institutional"];
const STATUS_LABELS = ["Pending", "Approved", "Rejected", "Executed"];
const STATUS_COLORS = ["text-yellow-400", "text-green-400", "text-red-400", "text-blue-400"];

type Tab = "overview" | "transfer" | "identity" | "policy" | "audit" | "allowlist";

export default function Dashboard() {
  const [tab, setTab] = useState<Tab>("overview");
  const { address, isConnected } = useAccount();

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: "overview", label: "Overview", icon: "📊" },
    { id: "transfer", label: "Transfer", icon: "💸" },
    { id: "identity", label: "Identity", icon: "🪪" },
    { id: "policy", label: "Policy", icon: "⚙️" },
    { id: "audit", label: "Audit Trail", icon: "📋" },
    { id: "allowlist", label: "Allowlist", icon: "✅" },
  ];

  return (
    <div className="min-h-screen bg-gray-950">
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🛡️</span>
            <div>
              <h1 className="text-xl font-bold">TokenGuard</h1>
              <p className="text-xs text-gray-400">Compliance-Ready ERC20</p>
            </div>
          </div>
          <ConnectKitButton />
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition ${
                tab === t.id
                  ? "bg-emerald-600 text-white"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }`}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {tab === "overview" && <OverviewTab address={address} isConnected={isConnected} />}
        {tab === "transfer" && <TransferTab />}
        {tab === "identity" && <IdentityTab />}
        {tab === "policy" && <PolicyTab />}
        {tab === "audit" && <AuditTab />}
        {tab === "allowlist" && <AllowlistTab />}
      </div>
    </div>
  );
}

/* ─── Card Component ──────────────────────────────────────────────── */
function Card({ title, children, className = "" }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-gray-900 border border-gray-800 rounded-xl p-6 ${className}`}>
      <h3 className="text-sm font-semibold text-gray-400 mb-4 uppercase tracking-wider">{title}</h3>
      {children}
    </div>
  );
}

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}

/* ─── Overview Tab ────────────────────────────────────────────────── */
function OverviewTab({ address, isConnected }: { address?: `0x${string}`; isConnected: boolean }) {
  const { data: tokenName } = useReadContract({ address: TOKEN_GUARD_ADDRESS, abi: TOKEN_GUARD_ABI, functionName: "name" });
  const { data: tokenSymbol } = useReadContract({ address: TOKEN_GUARD_ADDRESS, abi: TOKEN_GUARD_ABI, functionName: "symbol" });
  const { data: totalSupply } = useReadContract({ address: TOKEN_GUARD_ADDRESS, abi: TOKEN_GUARD_ABI, functionName: "totalSupply" });
  const { data: balance } = useReadContract({ address: TOKEN_GUARD_ADDRESS, abi: TOKEN_GUARD_ABI, functionName: "balanceOf", args: address ? [address] : undefined });
  const { data: owner } = useReadContract({ address: TOKEN_GUARD_ADDRESS, abi: TOKEN_GUARD_ABI, functionName: "owner" });
  const { data: compOfficer } = useReadContract({ address: TOKEN_GUARD_ADDRESS, abi: TOKEN_GUARD_ABI, functionName: "complianceOfficer" });
  const { data: nextRecordId } = useReadContract({ address: TOKEN_GUARD_ADDRESS, abi: TOKEN_GUARD_ABI, functionName: "nextRecordId" });
  const { data: policyData } = useReadContract({ address: TOKEN_GUARD_ADDRESS, abi: TOKEN_GUARD_ABI, functionName: "policy" });
  const { data: identity } = useReadContract({ address: TOKEN_GUARD_ADDRESS, abi: TOKEN_GUARD_ABI, functionName: "getIdentity", args: address ? [address] : undefined });

  const fmt = (v: bigint | undefined) => v !== undefined ? formatUnits(v, 18) : "—";
  const short = (a: string | undefined) => a ? `${a.slice(0, 6)}…${a.slice(-4)}` : "—";

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card title="Token">
          <Stat label="Name" value={tokenName as string || "—"} sub={tokenSymbol as string || ""} />
        </Card>
        <Card title="Total Supply">
          <Stat label="Circulating" value={Number(fmt(totalSupply as bigint)).toLocaleString()} sub={tokenSymbol as string || "TG"} />
        </Card>
        <Card title="Your Balance">
          <Stat label={isConnected ? "Connected" : "Not Connected"} value={isConnected ? Number(fmt(balance as bigint)).toLocaleString() : "—"} sub={tokenSymbol as string || ""} />
        </Card>
        <Card title="Audit Records">
          <Stat label="Total Records" value={nextRecordId !== undefined ? nextRecordId.toString() : "—"} />
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card title="Roles">
          <div className="space-y-3">
            <div><span className="text-xs text-gray-500">Owner:</span> <span className="text-sm font-mono text-emerald-400">{short(owner as string)}</span></div>
            <div><span className="text-xs text-gray-500">Compliance Officer:</span> <span className="text-sm font-mono text-blue-400">{short(compOfficer as string)}</span></div>
            {isConnected && identity && (
              <div className="mt-4 pt-4 border-t border-gray-800">
                <p className="text-xs text-gray-500 mb-2">Your Identity</p>
                <div className="flex flex-wrap gap-2">
                  <span className={`px-2 py-1 rounded text-xs ${(identity as unknown as [number])[0] > 0 ? "bg-emerald-900 text-emerald-300" : "bg-gray-800 text-gray-500"}`}>
                    KYC: {KYC_LABELS[(identity as unknown as [number])[0]]}
                  </span>
                  <span className="px-2 py-1 rounded text-xs bg-gray-800 text-gray-300">
                    {(identity as unknown as [number, string])[1] || "No jurisdiction"}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs ${(identity as unknown as [number, string, bigint, string, boolean])[4] ? "bg-red-900 text-red-300" : "bg-green-900 text-green-300"}`}>
                    {(identity as unknown as [number, string, bigint, string, boolean])[4] ? "🔒 Frozen" : "✅ Active"}
                  </span>
                </div>
              </div>
            )}
          </div>
        </Card>

        <Card title="Active Policies">
          {policyData ? (
            <div className="grid grid-cols-2 gap-3">
              {[
                ["KYC Required", (policyData as unknown as [boolean])[0]],
                ["Allowlist Only", (policyData as unknown as [boolean, number, boolean])[2]],
                ["Jurisdiction Checks", (policyData as unknown as [boolean, number, boolean, boolean])[3]],
                ["Audit Trail", (policyData as unknown as [boolean, number, boolean, boolean, bigint, bigint, boolean])[6]],
              ].map(([label, active]) => (
                <div key={label as string} className={`px-3 py-2 rounded-lg text-sm ${active ? "bg-emerald-900/50 text-emerald-300 border border-emerald-800" : "bg-gray-800/50 text-gray-500 border border-gray-700"}`}>
                  {active ? "✅" : "⬜"} {label as string}
                </div>
              ))}
            </div>
          ) : <p className="text-gray-500">Loading…</p>}
        </Card>
      </div>

      <Card title="Contract Info">
        <div className="flex flex-wrap gap-4 text-sm">
          <div><span className="text-gray-500">Address:</span> <a href={`https://sepolia.celoscan.io/address/${TOKEN_GUARD_ADDRESS}`} target="_blank" className="font-mono text-emerald-400 hover:underline">{short(TOKEN_GUARD_ADDRESS)}</a></div>
          <div><span className="text-gray-500">Network:</span> <span className="text-gray-300">Celo Sepolia</span></div>
          <div><span className="text-gray-500">Track:</span> <span className="text-purple-400">SURGE Hackathon — Compliance-Ready Tokenization</span></div>
        </div>
      </Card>
    </div>
  );
}

/* ─── Transfer Tab ────────────────────────────────────────────────── */
function TransferTab() {
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: confirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const send = () => {
    if (!isAddress(to) || !amount) return;
    writeContract({ address: TOKEN_GUARD_ADDRESS, abi: TOKEN_GUARD_ABI, functionName: "transfer", args: [to as `0x${string}`, parseUnits(amount, 18)] });
  };

  // Pre-check
  const { address } = useAccount();
  const { data: allowed } = useReadContract({
    address: TOKEN_GUARD_ADDRESS, abi: TOKEN_GUARD_ABI, functionName: "isTransferAllowed",
    args: address && isAddress(to) && amount ? [address, to as `0x${string}`, parseUnits(amount, 18)] : undefined,
  });

  return (
    <Card title="Transfer Tokens">
      <div className="space-y-4 max-w-lg">
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Recipient Address</label>
          <input value={to} onChange={(e) => setTo(e.target.value)} placeholder="0x..." className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-sm font-mono focus:border-emerald-500 outline-none" />
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Amount (TG)</label>
          <input value={amount} onChange={(e) => setAmount(e.target.value)} type="number" placeholder="0.0" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-sm font-mono focus:border-emerald-500 outline-none" />
        </div>
        {to && isAddress(to) && amount && (
          <div className={`text-sm px-3 py-2 rounded-lg ${allowed ? "bg-emerald-900/30 text-emerald-400" : "bg-red-900/30 text-red-400"}`}>
            {allowed ? "✅ Transfer pre-check: ALLOWED" : "❌ Transfer pre-check: BLOCKED by policy"}
          </div>
        )}
        <button onClick={send} disabled={isPending || confirming} className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-medium py-2.5 rounded-lg transition">
          {isPending ? "Signing…" : confirming ? "Confirming…" : "Send Tokens"}
        </button>
        {isSuccess && <p className="text-sm text-emerald-400">✅ Transfer confirmed! <a href={`https://sepolia.celoscan.io/tx/${hash}`} target="_blank" className="underline">View on Celoscan</a></p>}
      </div>
    </Card>
  );
}

/* ─── Identity Tab ────────────────────────────────────────────────── */
function IdentityTab() {
  const [lookupAddr, setLookupAddr] = useState("");
  const [attestAddr, setAttestAddr] = useState("");
  const [kycLevel, setKycLevel] = useState("1");
  const [jurisdiction, setJurisdiction] = useState("");
  const [dailyLimit, setDailyLimit] = useState("");
  const [freezeAddr, setFreezeAddr] = useState("");
  const [freezeReason, setFreezeReason] = useState("");

  const { data: identity } = useReadContract({
    address: TOKEN_GUARD_ADDRESS, abi: TOKEN_GUARD_ABI, functionName: "getIdentity",
    args: isAddress(lookupAddr) ? [lookupAddr as `0x${string}`] : undefined,
  });

  const { writeContract: attest, isPending: attesting } = useWriteContract();
  const { writeContract: freeze, isPending: freezing } = useWriteContract();
  const { writeContract: unfreeze, isPending: unfreezing } = useWriteContract();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card title="Lookup Identity">
        <div className="space-y-4">
          <input value={lookupAddr} onChange={(e) => setLookupAddr(e.target.value)} placeholder="0x..." className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-sm font-mono focus:border-emerald-500 outline-none" />
          {identity && (
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">KYC Level</span><span className={`font-medium ${(identity as unknown as [number])[0] > 0 ? "text-emerald-400" : "text-gray-500"}`}>{KYC_LABELS[(identity as unknown as [number])[0]]}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Jurisdiction</span><span className="text-gray-300">{(identity as unknown as [number, string])[1] || "—"}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Attested</span><span className="text-gray-300">{(identity as unknown as [number, string, bigint])[2] > 0n ? new Date(Number((identity as unknown as [number, string, bigint])[2]) * 1000).toLocaleDateString() : "Never"}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Provider</span><span className="text-gray-300 font-mono text-xs">{(identity as unknown as [number, string, bigint, string])[3]?.slice(0, 10)}…</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Status</span><span className={`font-medium ${(identity as unknown as [number, string, bigint, string, boolean])[4] ? "text-red-400" : "text-green-400"}`}>{(identity as unknown as [number, string, bigint, string, boolean])[4] ? "🔒 Frozen" : "✅ Active"}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Daily Limit</span><span className="text-gray-300">{formatUnits((identity as unknown as [number, string, bigint, string, boolean, bigint])[5], 18)} TG</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Spent Today</span><span className="text-gray-300">{formatUnits((identity as unknown as [number, string, bigint, string, boolean, bigint, bigint])[6], 18)} TG</span></div>
            </div>
          )}
        </div>
      </Card>

      <Card title="Attest Identity (Provider Only)">
        <div className="space-y-3">
          <input value={attestAddr} onChange={(e) => setAttestAddr(e.target.value)} placeholder="Account address" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-sm font-mono focus:border-emerald-500 outline-none" />
          <select value={kycLevel} onChange={(e) => setKycLevel(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-sm focus:border-emerald-500 outline-none">
            {KYC_LABELS.map((l, i) => <option key={i} value={i}>{l}</option>)}
          </select>
          <input value={jurisdiction} onChange={(e) => setJurisdiction(e.target.value)} placeholder="Jurisdiction (e.g. US, PL, CH)" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-sm focus:border-emerald-500 outline-none" />
          <input value={dailyLimit} onChange={(e) => setDailyLimit(e.target.value)} placeholder="Daily limit (0 = use default)" type="number" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-sm font-mono focus:border-emerald-500 outline-none" />
          <button disabled={attesting || !isAddress(attestAddr)} onClick={() => attest({ address: TOKEN_GUARD_ADDRESS, abi: TOKEN_GUARD_ABI, functionName: "attestIdentity", args: [attestAddr as `0x${string}`, parseInt(kycLevel), jurisdiction, parseUnits(dailyLimit || "0", 18)] })} className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium py-2.5 rounded-lg transition">
            {attesting ? "Attesting…" : "Attest Identity"}
          </button>
        </div>
      </Card>

      <Card title="Freeze Account (Compliance)">
        <div className="space-y-3">
          <input value={freezeAddr} onChange={(e) => setFreezeAddr(e.target.value)} placeholder="Account address" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-sm font-mono focus:border-emerald-500 outline-none" />
          <input value={freezeReason} onChange={(e) => setFreezeReason(e.target.value)} placeholder="Reason for freezing" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-sm focus:border-emerald-500 outline-none" />
          <div className="flex gap-2">
            <button disabled={freezing || !isAddress(freezeAddr)} onClick={() => freeze({ address: TOKEN_GUARD_ADDRESS, abi: TOKEN_GUARD_ABI, functionName: "freezeAccount", args: [freezeAddr as `0x${string}`, freezeReason] })} className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-medium py-2.5 rounded-lg transition">
              {freezing ? "…" : "🔒 Freeze"}
            </button>
            <button disabled={unfreezing || !isAddress(freezeAddr)} onClick={() => unfreeze({ address: TOKEN_GUARD_ADDRESS, abi: TOKEN_GUARD_ABI, functionName: "unfreezeAccount", args: [freezeAddr as `0x${string}`] })} className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-medium py-2.5 rounded-lg transition">
              {unfreezing ? "…" : "🔓 Unfreeze"}
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}

/* ─── Policy Tab ──────────────────────────────────────────────────── */
function PolicyTab() {
  const { data: policyData } = useReadContract({ address: TOKEN_GUARD_ADDRESS, abi: TOKEN_GUARD_ABI, functionName: "policy" });
  const { writeContract, isPending } = useWriteContract();

  const [maxTransfer, setMaxTransfer] = useState("");
  const [dailyLimit, setDailyLimit] = useState("");
  const [blockJur, setBlockJur] = useState("");

  const p = policyData as [boolean, number, boolean, boolean, bigint, bigint, boolean, boolean] | undefined;

  const toggle = (fn: string, current: boolean) => {
    const fnMap: Record<string, { functionName: string; args: unknown[] }> = {
      "KYC": { functionName: "setKYCRequired", args: [!current, current ? 0 : 1] },
      "Allowlist": { functionName: "setAllowlistOnly", args: [!current] },
      "Jurisdiction": { functionName: "setJurisdictionRestrictions", args: [!current] },
      "Audit": { functionName: "setAuditTrail", args: [!current] },
    };
    const m = fnMap[fn];
    if (m) writeContract({ address: TOKEN_GUARD_ADDRESS, abi: TOKEN_GUARD_ABI, functionName: m.functionName as "setKYCRequired", args: m.args as [boolean, number] });
  };

  return (
    <div className="space-y-6">
      <Card title="Policy Toggles (Owner Only)">
        {p ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { label: "KYC Required", key: "KYC", active: p[0], desc: `Min level: ${KYC_LABELS[p[1]]}` },
              { label: "Allowlist Only", key: "Allowlist", active: p[2], desc: "Only allowlisted can transfer" },
              { label: "Jurisdiction Checks", key: "Jurisdiction", active: p[3], desc: "Block sanctioned jurisdictions" },
              { label: "Audit Trail", key: "Audit", active: p[6], desc: "Record all transfers on-chain" },
            ].map((item) => (
              <button key={item.key} onClick={() => toggle(item.key, item.active)} disabled={isPending} className={`p-4 rounded-xl text-left border transition ${item.active ? "bg-emerald-900/30 border-emerald-700 hover:bg-emerald-900/50" : "bg-gray-800/50 border-gray-700 hover:bg-gray-800"}`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{item.active ? "✅" : "⬜"}</span>
                  <span className="font-medium text-sm">{item.label}</span>
                </div>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </button>
            ))}
          </div>
        ) : <p className="text-gray-500">Loading…</p>}
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Max Transfer Amount">
          <div className="space-y-3">
            <p className="text-xs text-gray-500">Current: {p ? (p[4] > 0n ? formatUnits(p[4], 18) + " TG" : "Unlimited") : "—"}</p>
            <input value={maxTransfer} onChange={(e) => setMaxTransfer(e.target.value)} type="number" placeholder="New max (0=unlimited)" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-sm font-mono focus:border-emerald-500 outline-none" />
            <button onClick={() => writeContract({ address: TOKEN_GUARD_ADDRESS, abi: TOKEN_GUARD_ABI, functionName: "setMaxTransferAmount", args: [parseUnits(maxTransfer || "0", 18)] })} disabled={isPending} className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-medium py-2 rounded-lg transition text-sm">
              Update
            </button>
          </div>
        </Card>

        <Card title="Default Daily Limit">
          <div className="space-y-3">
            <p className="text-xs text-gray-500">Current: {p ? (p[5] > 0n ? formatUnits(p[5], 18) + " TG" : "Unlimited") : "—"}</p>
            <input value={dailyLimit} onChange={(e) => setDailyLimit(e.target.value)} type="number" placeholder="New limit (0=unlimited)" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-sm font-mono focus:border-emerald-500 outline-none" />
            <button onClick={() => writeContract({ address: TOKEN_GUARD_ADDRESS, abi: TOKEN_GUARD_ABI, functionName: "setDefaultDailyLimit", args: [parseUnits(dailyLimit || "0", 18)] })} disabled={isPending} className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-medium py-2 rounded-lg transition text-sm">
              Update
            </button>
          </div>
        </Card>
      </div>

      <Card title="Block Jurisdiction">
        <div className="flex gap-3 max-w-lg">
          <input value={blockJur} onChange={(e) => setBlockJur(e.target.value)} placeholder="Country code (e.g. KP)" className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-sm focus:border-emerald-500 outline-none" />
          <button onClick={() => { writeContract({ address: TOKEN_GUARD_ADDRESS, abi: TOKEN_GUARD_ABI, functionName: "blockJurisdiction", args: [blockJur, true] }); setBlockJur(""); }} disabled={isPending || !blockJur} className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-medium px-4 py-2 rounded-lg transition text-sm">
            Block
          </button>
          <button onClick={() => { writeContract({ address: TOKEN_GUARD_ADDRESS, abi: TOKEN_GUARD_ABI, functionName: "blockJurisdiction", args: [blockJur, false] }); setBlockJur(""); }} disabled={isPending || !blockJur} className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-medium px-4 py-2 rounded-lg transition text-sm">
            Unblock
          </button>
        </div>
      </Card>
    </div>
  );
}

/* ─── Audit Trail Tab ─────────────────────────────────────────────── */
function AuditTab() {
  const { data: nextId } = useReadContract({ address: TOKEN_GUARD_ADDRESS, abi: TOKEN_GUARD_ABI, functionName: "nextRecordId" });
  const count = Number(nextId || 0);

  // Fetch last 10 records
  const ids = Array.from({ length: Math.min(count, 10) }, (_, i) => count - 1 - i);

  return (
    <Card title={`Audit Trail (${count} records)`}>
      {count === 0 ? (
        <p className="text-gray-500">No audit records yet. Make a transfer to create one.</p>
      ) : (
        <div className="space-y-2">
          {ids.map((id) => (
            <AuditRow key={id} recordId={id} />
          ))}
        </div>
      )}
    </Card>
  );
}

function AuditRow({ recordId }: { recordId: number }) {
  const { data } = useReadContract({
    address: TOKEN_GUARD_ADDRESS, abi: TOKEN_GUARD_ABI, functionName: "getAuditRecord",
    args: [BigInt(recordId)],
  });
  if (!data) return <div className="animate-pulse bg-gray-800 h-12 rounded-lg" />;
  const [from, to, amount, timestamp, status, reason] = data as [string, string, bigint, bigint, number, string];
  const short = (a: string) => `${a.slice(0, 6)}…${a.slice(-4)}`;

  return (
    <div className="flex items-center gap-4 bg-gray-800/50 rounded-lg px-4 py-3 text-sm">
      <span className="text-xs text-gray-500 w-8">#{recordId}</span>
      <span className="font-mono text-xs text-gray-400">{short(from)}</span>
      <span className="text-gray-600">→</span>
      <span className="font-mono text-xs text-gray-400">{short(to)}</span>
      <span className="font-medium text-white">{Number(formatUnits(amount, 18)).toLocaleString()} TG</span>
      <span className={`text-xs font-medium ${STATUS_COLORS[status]}`}>{STATUS_LABELS[status]}</span>
      {reason && <span className="text-xs text-red-400">({reason})</span>}
      <span className="text-xs text-gray-600 ml-auto">{new Date(Number(timestamp) * 1000).toLocaleString()}</span>
    </div>
  );
}

/* ─── Allowlist Tab ───────────────────────────────────────────────── */
function AllowlistTab() {
  const [addr, setAddr] = useState("");
  const [checkAddr, setCheckAddr] = useState("");
  const { writeContract, isPending } = useWriteContract();

  const { data: isAllowlisted } = useReadContract({
    address: TOKEN_GUARD_ADDRESS, abi: TOKEN_GUARD_ABI, functionName: "allowlist",
    args: isAddress(checkAddr) ? [checkAddr as `0x${string}`] : undefined,
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card title="Manage Allowlist (Compliance)">
        <div className="space-y-3">
          <input value={addr} onChange={(e) => setAddr(e.target.value)} placeholder="Account address" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-sm font-mono focus:border-emerald-500 outline-none" />
          <div className="flex gap-2">
            <button disabled={isPending || !isAddress(addr)} onClick={() => writeContract({ address: TOKEN_GUARD_ADDRESS, abi: TOKEN_GUARD_ABI, functionName: "updateAllowlist", args: [addr as `0x${string}`, true] })} className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-medium py-2.5 rounded-lg transition">
              ✅ Add
            </button>
            <button disabled={isPending || !isAddress(addr)} onClick={() => writeContract({ address: TOKEN_GUARD_ADDRESS, abi: TOKEN_GUARD_ABI, functionName: "updateAllowlist", args: [addr as `0x${string}`, false] })} className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-medium py-2.5 rounded-lg transition">
              ❌ Remove
            </button>
          </div>
        </div>
      </Card>

      <Card title="Check Allowlist Status">
        <div className="space-y-3">
          <input value={checkAddr} onChange={(e) => setCheckAddr(e.target.value)} placeholder="Account address" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-sm font-mono focus:border-emerald-500 outline-none" />
          {isAddress(checkAddr) && isAllowlisted !== undefined && (
            <div className={`text-sm px-3 py-2 rounded-lg ${isAllowlisted ? "bg-emerald-900/30 text-emerald-400" : "bg-gray-800 text-gray-500"}`}>
              {isAllowlisted ? "✅ Allowlisted" : "⬜ Not on allowlist"}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
