import type { Highlight } from "../../data/analytics";
import { RiskBadge } from "./RiskBadge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";

export function LineageDrawer({
  highlight,
  scope,
  onOpenChange,
}: {
  highlight: Highlight | null;
  scope: string;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Sheet open={highlight !== null} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full gap-0 overflow-y-auto bg-background sm:max-w-lg">
        {highlight ? (
          <>
            <SheetHeader className="gap-2 border-b border-rule">
              <div className="flex items-center gap-2">
                <RiskBadge severity={highlight.severity} />
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint">
                  lineage &amp; audit
                </span>
              </div>
              <SheetTitle className="font-serif text-lg leading-snug text-ink">
                {highlight.title}
              </SheetTitle>
              <SheetDescription className="text-ink-muted">{highlight.rationale}</SheetDescription>
            </SheetHeader>

            <div className="space-y-6 p-4">
              <dl className="grid grid-cols-2 gap-3 font-mono text-[11px] uppercase tracking-[0.12em] text-ink-faint">
                <div>
                  <dt>Confidence</dt>
                  <dd className="mt-1 text-sm normal-case tracking-normal text-ink">
                    {(highlight.confidence * 100).toFixed(0)}%
                  </dd>
                </div>
                <div>
                  <dt>Window</dt>
                  <dd className="mt-1 text-sm normal-case tracking-normal text-ink">{highlight.window}</dd>
                </div>
                <div className="col-span-2">
                  <dt>Scope</dt>
                  <dd className="mt-1 text-sm normal-case tracking-normal text-ink">{scope}</dd>
                </div>
              </dl>

              <section>
                <h4 className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint">
                  Raw source records
                </h4>
                <ul className="mt-3 divide-y divide-rule border-y border-rule">
                  {highlight.sources.map((s) => (
                    <li key={s.record + s.field} className="py-3">
                      <div className="flex items-baseline justify-between gap-3">
                        <span className="font-mono text-xs text-ink">{s.record}</span>
                        <span className="font-mono text-[11px] text-ink-faint">{s.timestamp}</span>
                      </div>
                      <div className="mt-1 flex items-baseline justify-between gap-3">
                        <span className="text-sm text-ink-muted">{s.field}</span>
                        <span className="text-sm text-ink">{s.value}</span>
                      </div>
                      <span className="mt-1 block font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint">
                        {s.system}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>

              <p className="rounded-md border border-dashed border-rule bg-surface/60 p-3 text-xs leading-relaxed text-ink-muted">
                This highlight is a pattern observation generated from the records above. It makes no
                decision or diagnosis. Verify every value against the system of record before acting.
                This inspection has been written to the audit log.
              </p>
            </div>
          </>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
