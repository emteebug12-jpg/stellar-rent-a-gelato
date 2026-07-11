"use client";

import { useMemo, useState } from "react";
import { ShieldButton } from "@/components/ShieldButton";
import { fetchContractTTL } from "@/lib/gelatoClient";

type StatusTone = "Healthy" | "Warning" | "Critical";

export default function HomePage() {
  const [contractId, setContractId] = useState("CA3...replace-with-contract-id");
  const [ttl, setTtl] = useState<number | null>(null);
  const [status, setStatus] = useState<StatusTone>("Healthy");
  const [loading, setLoading] = useState(false);

  const healthPercent = useMemo(() => {
    if (ttl === null) {
      return 100;
    }
    if (ttl > 6000) {
      return 100;
    }
    if (ttl > 3000) {
      return 70;
    }
    return 35;
  }, [ttl]);

  const inspectContract = async () => {
    setLoading(true);
    const nextTtl = await fetchContractTTL(contractId);
    setTtl(nextTtl);
    setStatus(nextTtl > 6000 ? "Healthy" : nextTtl > 3000 ? "Warning" : "Critical");
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-slate-100">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <header className="flex flex-col gap-4 rounded-3xl border border-slate-800 bg-slate-900/70 p-8 shadow-2xl shadow-black/30">
          <p className="text-sm uppercase tracking-[0.35em] text-emerald-400">Stellar Rent Gelato</p>
          <h1 className="text-4xl font-semibold">Preserve ledger TTL with autonomous keeper coverage.</h1>
          <p className="max-w-2xl text-lg text-slate-400">
            Register targets, inspect live TTL health, and keep your state alive with a transparent contributor-friendly workflow.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <ShieldButton />
            <button
              onClick={inspectContract}
              className="rounded-full bg-emerald-500 px-5 py-2 font-medium text-slate-950 transition hover:bg-emerald-400"
            >
              {loading ? "Inspecting..." : "Inspect TTL"}
            </button>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-8">
            <label className="mb-2 block text-sm font-medium text-slate-300" htmlFor="contractId">
              Contract identifier
            </label>
            <input
              id="contractId"
              value={contractId}
              onChange={(event) => setContractId(event.target.value)}
              className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none ring-0"
              placeholder="Enter contract id"
            />
            <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
              <div className="mb-3 flex items-center justify-between text-sm text-slate-400">
                <span>TTL health status</span>
                <span className="font-semibold text-slate-200">{status}</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-slate-800">
                <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${healthPercent}%` }} />
              </div>
              <p className="mt-3 text-sm text-slate-500">
                Current TTL: {ttl === null ? "Awaiting inspection" : `${ttl} ledgers`}
              </p>
            </div>
          </div>

          <aside className="rounded-3xl border border-slate-800 bg-slate-900/70 p-8">
            <h2 className="text-xl font-semibold">Contributor checklist</h2>
            <ul className="mt-4 space-y-3 text-sm text-slate-400">
              <li>• Connect Freighter to authorize contract interactions.</li>
              <li>• Register a preservation target with a TTL threshold.</li>
              <li>• Let the keeper daemon refresh the footprint before expiry.</li>
            </ul>
          </aside>
        </section>
      </div>
    </main>
  );
}
