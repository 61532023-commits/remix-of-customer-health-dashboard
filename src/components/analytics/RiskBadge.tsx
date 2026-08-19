import type { Severity } from "../../data/analytics";

const styles: Record<Severity, string> = {
  flag: "border-alarm/40 text-alarm bg-alarm/8",
  watch: "border-health-warm/50 text-health-warm bg-health-warm/10",
  info: "border-rule text-ink-muted bg-surface",
};

const labels: Record<Severity, string> = {
  flag: "Double-check",
  watch: "Watch",
  info: "Context",
};

export function RiskBadge({ severity, children }: { severity: Severity; children?: React.ReactNode }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] ${styles[severity]}`}
    >
      <span aria-hidden className="size-1.5 rounded-full bg-current" />
      {children ?? labels[severity]}
    </span>
  );
}

/** Small, always-visible provenance chip: this text came from a model, not a chart. */
export function AiSourceChip() {
  return (
    <span className="inline-flex items-center gap-1 rounded-sm border border-dashed border-rule px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint">
      AI observation
    </span>
  );
}
