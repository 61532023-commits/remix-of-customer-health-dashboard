import { ChevronRight } from "lucide-react";
import type { Highlight } from "../../data/analytics";
import { RiskBadge, AiSourceChip } from "./RiskBadge";

export function HighlightCard({
  highlight,
  onInspect,
}: {
  highlight: Highlight;
  onInspect: (h: Highlight) => void;
}) {
  return (
    <article className="rounded-lg border border-dashed border-rule bg-surface/60 p-4">
      <div className="flex flex-wrap items-center gap-2">
        <RiskBadge severity={highlight.severity} />
        <AiSourceChip />
        <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint">
          {highlight.window}
        </span>
      </div>
      <h4 className="mt-2.5 font-serif text-base leading-snug text-ink">{highlight.title}</h4>
      <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">{highlight.rationale}</p>
      <div className="mt-3 flex items-center justify-between gap-3">
        <span className="font-mono text-[11px] text-ink-faint">
          pattern confidence {(highlight.confidence * 100).toFixed(0)}% · not a diagnosis
        </span>
        <button
          type="button"
          onClick={() => onInspect(highlight)}
          className="inline-flex items-center gap-1 rounded-md border border-rule px-2.5 py-1 text-xs text-ink transition-colors hover:bg-surface"
        >
          Inspect lineage
          <ChevronRight className="size-3.5" aria-hidden />
        </button>
      </div>
    </article>
  );
}
