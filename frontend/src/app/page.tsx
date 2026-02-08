import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-4">
      <div className="max-w-2xl text-center space-y-8">
        <div className="text-7xl">🛡️</div>
        <h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
          TokenGuard
        </h1>
        <p className="text-xl text-gray-400">
          Compliance-Ready ERC20 with Built-In Audit Trail
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          {[
            { icon: "🪪", label: "KYC Levels", desc: "4-tier identity" },
            { icon: "✅", label: "Allowlists", desc: "Transfer restrictions" },
            { icon: "🌍", label: "Jurisdictions", desc: "Sanction compliance" },
            { icon: "📋", label: "Audit Trail", desc: "On-chain records" },
            { icon: "🔒", label: "Account Freeze", desc: "Compliance actions" },
            { icon: "📊", label: "Daily Limits", desc: "Spending caps" },
            { icon: "⚙️", label: "Policy Engine", desc: "Configurable rules" },
            { icon: "🔍", label: "Pre-Check", desc: "Transfer validation" },
          ].map((f) => (
            <div key={f.label} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <div className="text-2xl mb-2">{f.icon}</div>
              <div className="font-medium text-white">{f.label}</div>
              <div className="text-xs text-gray-500">{f.desc}</div>
            </div>
          ))}
        </div>
        <div className="flex gap-4 justify-center">
          <Link href="/dashboard" className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-8 py-3 rounded-xl transition text-lg">
            Launch Dashboard
          </Link>
          <a href="https://github.com/bigguybobby/token-guard" target="_blank" className="bg-gray-800 hover:bg-gray-700 text-white font-medium px-8 py-3 rounded-xl transition text-lg">
            GitHub
          </a>
        </div>
        <div className="text-xs text-gray-600 space-y-1">
          <p>Deployed on Celo Sepolia • 26/26 Tests Passing • Slither Clean</p>
          <p>Built for SURGE × Moltbook Hackathon — Track 3: Compliance-Ready Tokenization</p>
        </div>
      </div>
    </div>
  );
}
