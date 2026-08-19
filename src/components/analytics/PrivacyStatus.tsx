import { ShieldCheck, Lock } from "lucide-react";
import type { Domain } from "../../data/analytics";

export function PrivacyStatus({ domain }: { domain: Domain }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="inline-flex items-center gap-1.5 rounded-full border border-rule bg-surface px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-muted">
        <Lock className="size-3" aria-hidden />
        {domain.regime}
      </span>
      {domain.privacy.map((p) => (
        <span
          key={p.label}
          title={p.detail}
          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] ${
            p.state === "verified"
              ? "border-health-hi/30 bg-health-hi/8 text-ink"
              : "border-rule bg-transparent text-ink-faint"
          }`}
        >
          <ShieldCheck className="size-3" aria-hidden />
          {p.label}
        </span>
      ))}
      <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint">
        tenant: {domain.tenant}
      </span>
    </div>
  );
}
