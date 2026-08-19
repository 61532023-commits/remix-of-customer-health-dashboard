// Demo dataset for the adaptive analytics component system.
// Synthetic records only — no real patient, engineering or citizen data.

export type Severity = "info" | "watch" | "flag";

export interface SourceRecord {
  /** Raw system-of-record identifier. */
  record: string;
  timestamp: string;
  field: string;
  value: string;
  system: string;
}

export interface Highlight {
  id: string;
  severity: Severity;
  title: string;
  /** Plain-language pattern description. Never a decision or diagnosis. */
  rationale: string;
  /** 0-1 model confidence in the *pattern*, not in any conclusion. */
  confidence: number;
  window: string;
  sources: SourceRecord[];
}

export interface Series {
  key: string;
  label: string;
  unit: string;
  /** Oldest first. */
  points: number[];
  /** Reference band considered unremarkable for this measure. */
  band: [number, number];
}

export interface TimelineEvent {
  date: string;
  label: string;
  detail: string;
  kind: "encounter" | "result" | "order" | "note";
}

export interface Entity {
  id: string;
  code: string;
  name: string;
  subtitle: string;
  facts: { label: string; value: string }[];
  series: Series[];
  timeline: TimelineEvent[];
  highlights: Highlight[];
}

export interface Kpi {
  label: string;
  value: string;
  delta: number;
  hint: string;
  /** Sparkline for the KPI, oldest first. */
  points: number[];
}

export interface MacroTrend {
  label: string;
  unit: string;
  points: number[];
  breakdown: { label: string; value: number }[];
}

export interface Domain {
  id: "healthcare" | "engineering" | "government";
  label: string;
  scope: string;
  entityNoun: string;
  systemNoun: string;
  tenant: string;
  regime: string;
  privacy: { label: string; detail: string; state: "verified" | "scoped" }[];
  kpis: Kpi[];
  trends: MacroTrend[];
  entities: Entity[];
  prompts: { micro: string[]; macro: string[] };
}

const healthcare: Domain = {
  id: "healthcare",
  label: "Healthcare",
  scope: "Meridian General — Cardiology & Acute Care",
  entityNoun: "Patient",
  systemNoun: "Ward operations",
  tenant: "meridian-general",
  regime: "HIPAA / PHI",
  privacy: [
    { label: "Tenant isolated", detail: "Row scope pinned to tenant meridian-general", state: "verified" },
    { label: "PHI minimised", detail: "Identifiers masked outside the care team", state: "verified" },
    { label: "Record-level ACL", detail: "Access limited to the active care relationship", state: "scoped" },
    { label: "Audit logged", detail: "Every highlight expansion is written to the audit trail", state: "verified" },
  ],
  kpis: [
    { label: "Ward bed occupancy", value: "88%", delta: 4, hint: "Cardiology 94% · Acute 81%", points: [78, 80, 79, 83, 85, 84, 88] },
    { label: "Sepsis bundle within 1h", value: "72%", delta: -6, hint: "24 of 33 eligible admissions", points: [84, 83, 80, 79, 76, 74, 72] },
    { label: "CT turnaround (median)", value: "41 min", delta: -9, hint: "Target 45 min · 312 scans", points: [56, 54, 51, 49, 46, 44, 41] },
    { label: "Readmission within 30d", value: "9.4%", delta: 1, hint: "Cardiology cohort, rolling quarter", points: [8.1, 8.4, 8.3, 8.8, 9.0, 9.2, 9.4] },
  ],
  trends: [
    {
      label: "Sepsis alerts per 1,000 bed-days",
      unit: "alerts",
      points: [12, 14, 13, 17, 19, 18, 22, 21],
      breakdown: [
        { label: "Ward 4 — Acute", value: 26 },
        { label: "Ward 2 — Cardiology", value: 18 },
        { label: "Ward 7 — Surgical", value: 11 },
        { label: "Ward 1 — General", value: 8 },
      ],
    },
    {
      label: "CT scan turnaround by shift",
      unit: "min",
      points: [52, 49, 47, 45, 43, 44, 41, 41],
      breakdown: [
        { label: "Night", value: 58 },
        { label: "Evening", value: 44 },
        { label: "Day", value: 36 },
      ],
    },
  ],
  prompts: {
    micro: [
      "Show BP trend since July",
      "Which readings sit outside the reference band?",
      "Summarise the last three encounters",
    ],
    macro: [
      "Which ward has the highest sepsis rate?",
      "How has CT turnaround moved this quarter?",
      "Where is occupancy above 90%?",
    ],
  },
  entities: [
    {
      id: "p4092",
      code: "Patient #4092",
      name: "A. Nyakundi",
      subtitle: "62y · Cardiology follow-up · Care team: Dr. Amado",
      facts: [
        { label: "Admitted", value: "Outpatient" },
        { label: "Last visit", value: "12 Aug 2026" },
        { label: "Active orders", value: "3" },
        { label: "Allergies", value: "Penicillin" },
      ],
      series: [
        { key: "sbp", label: "Systolic BP", unit: "mmHg", points: [128, 131, 134, 133, 139, 142, 147, 151], band: [90, 130] },
        { key: "dbp", label: "Diastolic BP", unit: "mmHg", points: [78, 79, 81, 80, 84, 85, 88, 91], band: [60, 85] },
        { key: "hr", label: "Heart rate", unit: "bpm", points: [72, 74, 71, 76, 78, 75, 80, 82], band: [55, 95] },
        { key: "spo2", label: "SpO₂", unit: "%", points: [98, 98, 97, 98, 97, 97, 96, 97], band: [94, 100] },
      ],
      timeline: [
        { date: "12 Aug 2026", kind: "encounter", label: "Cardiology follow-up", detail: "Reported intermittent morning headaches; medication adherence confirmed." },
        { date: "29 Jul 2026", kind: "result", label: "Lipid panel", detail: "LDL 4.1 mmol/L, HDL 1.0 mmol/L — both moved unfavourably vs. March." },
        { date: "14 Jul 2026", kind: "order", label: "Ambulatory BP monitor", detail: "24h monitoring ordered; device returned 16 Jul." },
        { date: "02 Jun 2026", kind: "note", label: "Nursing note", detail: "Home readings logged twice daily by patient since May." },
      ],
      highlights: [
        {
          id: "h1",
          severity: "flag",
          title: "Elevated cardiovascular risk trend over 6 months",
          rationale:
            "Systolic BP rose from 128 to 151 mmHg across 8 readings while LDL also moved upward. Pattern surfaced for clinician double-check.",
          confidence: 0.82,
          window: "Feb – Aug 2026",
          sources: [
            { record: "OBS-88213", timestamp: "2026-08-12 09:14", field: "Systolic BP", value: "151 mmHg", system: "EHR / Vitals" },
            { record: "OBS-87740", timestamp: "2026-07-22 08:51", field: "Systolic BP", value: "147 mmHg", system: "EHR / Vitals" },
            { record: "LAB-20551", timestamp: "2026-07-29 11:02", field: "LDL", value: "4.1 mmol/L", system: "Lab / Chemistry" },
          ],
        },
        {
          id: "h2",
          severity: "watch",
          title: "Diastolic readings crossed the reference band twice",
          rationale: "Two of the last three diastolic values (88, 91 mmHg) sit above the 85 mmHg band used for this cohort.",
          confidence: 0.64,
          window: "Jul – Aug 2026",
          sources: [
            { record: "OBS-88214", timestamp: "2026-08-12 09:14", field: "Diastolic BP", value: "91 mmHg", system: "EHR / Vitals" },
            { record: "OBS-87741", timestamp: "2026-07-22 08:51", field: "Diastolic BP", value: "88 mmHg", system: "EHR / Vitals" },
          ],
        },
        {
          id: "h3",
          severity: "info",
          title: "Home monitoring adherence is complete",
          rationale: "56 of 56 expected home readings were submitted — the trend above is based on a full series with no gaps.",
          confidence: 0.95,
          window: "Jun – Aug 2026",
          sources: [
            { record: "DEV-1180", timestamp: "2026-08-11 20:03", field: "Submitted readings", value: "56 / 56", system: "Remote monitoring" },
          ],
        },
      ],
    },
    {
      id: "p5518",
      code: "Patient #5518",
      name: "R. Mbeki",
      subtitle: "47y · Post-operative day 3 · Ward 4 — Acute",
      facts: [
        { label: "Admitted", value: "09 Aug 2026" },
        { label: "Bed", value: "4-12B" },
        { label: "Active orders", value: "6" },
        { label: "Allergies", value: "None recorded" },
      ],
      series: [
        { key: "temp", label: "Temperature", unit: "°C", points: [36.7, 36.9, 37.1, 37.4, 37.9, 38.2, 38.4, 38.1], band: [36, 37.5] },
        { key: "hr", label: "Heart rate", unit: "bpm", points: [78, 82, 86, 91, 96, 101, 104, 99], band: [55, 95] },
        { key: "wbc", label: "White cell count", unit: "×10⁹/L", points: [7.2, 7.8, 8.6, 9.9, 11.4, 12.8, 13.1, 12.6], band: [4, 11] },
        { key: "map", label: "Mean arterial pressure", unit: "mmHg", points: [88, 86, 84, 82, 79, 76, 74, 77], band: [70, 100] },
      ],
      timeline: [
        { date: "12 Aug 2026", kind: "result", label: "Blood culture drawn", detail: "Sample sent 06:40; result pending at time of view." },
        { date: "11 Aug 2026", kind: "order", label: "Fluid bolus", detail: "500 mL crystalloid administered 22:10." },
        { date: "10 Aug 2026", kind: "note", label: "Nursing observation", detail: "Wound site warm to touch, dressing changed." },
        { date: "09 Aug 2026", kind: "encounter", label: "Procedure", detail: "Elective laparoscopic repair, uncomplicated." },
      ],
      highlights: [
        {
          id: "h4",
          severity: "flag",
          title: "Infection-risk pattern across three independent measures",
          rationale:
            "Temperature, heart rate and white cell count all trended upward together over 72h. Surfaced for double-check against the sepsis bundle checklist.",
          confidence: 0.88,
          window: "09 – 12 Aug 2026",
          sources: [
            { record: "OBS-91002", timestamp: "2026-08-12 06:00", field: "Temperature", value: "38.4 °C", system: "EHR / Vitals" },
            { record: "LAB-21877", timestamp: "2026-08-12 05:40", field: "WBC", value: "13.1 ×10⁹/L", system: "Lab / Haematology" },
            { record: "OBS-91003", timestamp: "2026-08-12 06:00", field: "Heart rate", value: "104 bpm", system: "EHR / Vitals" },
          ],
        },
        {
          id: "h5",
          severity: "watch",
          title: "Mean arterial pressure drifting toward the lower band",
          rationale: "MAP fell 14 mmHg over three days, reaching 74 mmHg before the fluid bolus.",
          confidence: 0.71,
          window: "09 – 12 Aug 2026",
          sources: [
            { record: "OBS-90881", timestamp: "2026-08-11 21:50", field: "MAP", value: "74 mmHg", system: "EHR / Vitals" },
          ],
        },
      ],
    },
  ],
};

const engineering: Domain = {
  id: "engineering",
  label: "Engineering",
  scope: "Grid Reliability — Northern Interconnect",
  entityNoun: "Asset",
  systemNoun: "Fleet operations",
  tenant: "northern-grid",
  regime: "SOC 2 / OT isolation",
  privacy: [
    { label: "Tenant isolated", detail: "Telemetry scoped to operator northern-grid", state: "verified" },
    { label: "OT network segregated", detail: "Read-only replica; no control-plane access", state: "verified" },
    { label: "Asset-level ACL", detail: "Visible to the assigned maintenance crew", state: "scoped" },
    { label: "Audit logged", detail: "Lineage expansions recorded per engineer", state: "verified" },
  ],
  kpis: [
    { label: "Fleet availability", value: "96.2%", delta: -1, hint: "3 assets in derated state", points: [97.8, 97.5, 97.4, 97.0, 96.8, 96.4, 96.2] },
    { label: "Mean time to repair", value: "6.4 h", delta: -12, hint: "Down from 7.3h last quarter", points: [7.9, 7.6, 7.3, 7.1, 6.9, 6.6, 6.4] },
    { label: "Unplanned outages", value: "11", delta: 3, hint: "Rolling 30 days", points: [7, 8, 8, 9, 10, 10, 11] },
    { label: "Backlog > 30 days", value: "24", delta: 6, hint: "Work orders awaiting parts", points: [14, 16, 17, 19, 21, 23, 24] },
  ],
  trends: [
    {
      label: "Vibration exceedances per 1,000 run-hours",
      unit: "events",
      points: [4, 5, 5, 7, 8, 9, 11, 12],
      breakdown: [
        { label: "Substation N-4", value: 19 },
        { label: "Substation N-1", value: 12 },
        { label: "Substation N-9", value: 7 },
        { label: "Substation N-6", value: 4 },
      ],
    },
    {
      label: "Work-order cycle time",
      unit: "h",
      points: [31, 29, 30, 27, 26, 25, 23, 22],
      breakdown: [
        { label: "Parts-blocked", value: 48 },
        { label: "Crew-blocked", value: 27 },
        { label: "Clear", value: 14 },
      ],
    },
  ],
  prompts: {
    micro: ["Show vibration trend since July", "Which readings breached tolerance?", "Summarise the last three work orders"],
    macro: ["Which substation has the most exceedances?", "How has MTTR moved this quarter?", "Where is availability below 95%?"],
  },
  entities: [
    {
      id: "tx-118",
      code: "Asset TX-118",
      name: "Transformer TX-118",
      subtitle: "Substation N-4 · 132 kV · In service since 2011",
      facts: [
        { label: "State", value: "Derated" },
        { label: "Last service", value: "04 Jun 2026" },
        { label: "Open work orders", value: "2" },
        { label: "Criticality", value: "Tier 1" },
      ],
      series: [
        { key: "temp", label: "Winding temperature", unit: "°C", points: [61, 63, 64, 67, 70, 73, 76, 79], band: [40, 75] },
        { key: "vib", label: "Vibration RMS", unit: "mm/s", points: [1.8, 1.9, 2.1, 2.4, 2.6, 3.0, 3.3, 3.6], band: [0, 2.8] },
        { key: "load", label: "Load factor", unit: "%", points: [72, 74, 76, 78, 80, 83, 85, 87], band: [0, 90] },
        { key: "dga", label: "Dissolved gas (H₂)", unit: "ppm", points: [24, 26, 27, 31, 36, 42, 49, 55], band: [0, 40] },
      ],
      timeline: [
        { date: "12 Aug 2026", kind: "result", label: "DGA sample", detail: "Hydrogen at 55 ppm, above the 40 ppm screening threshold." },
        { date: "31 Jul 2026", kind: "order", label: "Work order WO-4471", detail: "Cooling fan bank inspection scheduled, awaiting parts." },
        { date: "18 Jul 2026", kind: "note", label: "Crew note", detail: "Audible hum reported during evening peak." },
        { date: "04 Jun 2026", kind: "encounter", label: "Planned service", detail: "Oil top-up and bushing torque check completed." },
      ],
      highlights: [
        {
          id: "e1",
          severity: "flag",
          title: "Degradation pattern across thermal and gas measures",
          rationale:
            "Winding temperature, vibration and dissolved hydrogen all rose together over eight sampling periods. Flagged for engineer double-check before derating changes.",
          confidence: 0.86,
          window: "Feb – Aug 2026",
          sources: [
            { record: "TEL-55120", timestamp: "2026-08-12 04:00", field: "Winding temp", value: "79 °C", system: "SCADA historian" },
            { record: "LAB-DGA-771", timestamp: "2026-08-12 10:20", field: "H₂", value: "55 ppm", system: "Oil lab" },
            { record: "TEL-55121", timestamp: "2026-08-12 04:00", field: "Vibration RMS", value: "3.6 mm/s", system: "Condition monitoring" },
          ],
        },
        {
          id: "e2",
          severity: "watch",
          title: "Load factor climbing toward the operating ceiling",
          rationale: "Load factor moved from 72% to 87% while cooling capacity remains under inspection.",
          confidence: 0.69,
          window: "May – Aug 2026",
          sources: [{ record: "TEL-55102", timestamp: "2026-08-11 19:00", field: "Load factor", value: "87 %", system: "SCADA historian" }],
        },
      ],
    },
  ],
};

const government: Domain = {
  id: "government",
  label: "Government",
  scope: "Permits & Licensing — Metro Region",
  entityNoun: "Case",
  systemNoun: "Service operations",
  tenant: "metro-permits",
  regime: "GDPR / PII",
  privacy: [
    { label: "Tenant isolated", detail: "Case scope pinned to agency metro-permits", state: "verified" },
    { label: "PII minimised", detail: "Applicant identity masked in aggregate views", state: "verified" },
    { label: "Case-level ACL", detail: "Visible to the assigned caseworker and supervisor", state: "scoped" },
    { label: "Audit logged", detail: "Statutory record of every inspection view", state: "verified" },
  ],
  kpis: [
    { label: "Cases within SLA", value: "81%", delta: -4, hint: "Target 90% · 1,204 open cases", points: [89, 88, 86, 85, 84, 82, 81] },
    { label: "Median decision time", value: "18 d", delta: 5, hint: "Statutory limit 30 days", points: [13, 14, 15, 15, 16, 17, 18] },
    { label: "Appeal rate", value: "6.1%", delta: -2, hint: "Of decisions issued this quarter", points: [7.4, 7.1, 6.9, 6.6, 6.4, 6.2, 6.1] },
    { label: "Backlog over 60 days", value: "137", delta: 11, hint: "Concentrated in Zoning", points: [92, 99, 108, 115, 124, 131, 137] },
  ],
  trends: [
    {
      label: "New applications per week",
      unit: "cases",
      points: [180, 195, 188, 210, 232, 241, 260, 274],
      breakdown: [
        { label: "Zoning", value: 96 },
        { label: "Building", value: 78 },
        { label: "Trade licence", value: 61 },
        { label: "Events", value: 39 },
      ],
    },
    {
      label: "Days to first review",
      unit: "d",
      points: [6, 6, 7, 8, 8, 9, 10, 11],
      breakdown: [
        { label: "Zoning", value: 15 },
        { label: "Building", value: 9 },
        { label: "Events", value: 4 },
      ],
    },
  ],
  prompts: {
    micro: ["Show processing timeline since July", "Which steps exceeded their target?", "Summarise the last three actions"],
    macro: ["Which category has the largest backlog?", "How has decision time moved this quarter?", "Where are we below the SLA target?"],
  },
  entities: [
    {
      id: "c-88214",
      code: "Case #88214",
      name: "Zoning variance — 14 Rowan St",
      subtitle: "Filed 21 Jun 2026 · Caseworker: J. Otieno",
      facts: [
        { label: "Status", value: "Under review" },
        { label: "Days open", value: "59" },
        { label: "Open actions", value: "2" },
        { label: "Statutory limit", value: "30 d" },
      ],
      series: [
        { key: "queue", label: "Days in queue", unit: "d", points: [2, 6, 11, 19, 28, 39, 49, 59], band: [0, 30] },
        { key: "touch", label: "Caseworker touches", unit: "count", points: [1, 2, 2, 3, 3, 4, 4, 5], band: [0, 12] },
        { key: "docs", label: "Documents outstanding", unit: "count", points: [4, 4, 3, 3, 2, 2, 2, 2], band: [0, 1] },
      ],
      timeline: [
        { date: "11 Aug 2026", kind: "note", label: "Applicant contacted", detail: "Second reminder issued for the survey drawing." },
        { date: "28 Jul 2026", kind: "order", label: "Referred to inspection", detail: "Site inspection booked for 19 Aug." },
        { date: "09 Jul 2026", kind: "result", label: "Completeness check", detail: "Two documents still outstanding." },
        { date: "21 Jun 2026", kind: "encounter", label: "Application filed", detail: "Submitted through the online portal." },
      ],
      highlights: [
        {
          id: "g1",
          severity: "flag",
          title: "Case has passed the statutory limit with documents outstanding",
          rationale:
            "59 days in queue against a 30-day limit, with two documents unresolved since July. Surfaced for supervisor double-check.",
          confidence: 0.91,
          window: "Jun – Aug 2026",
          sources: [
            { record: "CASE-88214", timestamp: "2026-08-19 08:00", field: "Days open", value: "59", system: "Case management" },
            { record: "DOC-4412", timestamp: "2026-07-09 14:30", field: "Outstanding docs", value: "2", system: "Document intake" },
          ],
        },
        {
          id: "g2",
          severity: "watch",
          title: "Low touch frequency relative to comparable cases",
          rationale: "5 caseworker touches over 59 days, against a median of 9 for zoning variances of similar complexity.",
          confidence: 0.58,
          window: "Jun – Aug 2026",
          sources: [{ record: "CASE-88214", timestamp: "2026-08-11 16:12", field: "Touches", value: "5", system: "Case management" }],
        },
      ],
    },
  ],
};

export const domains: Domain[] = [healthcare, engineering, government];

export function getDomain(id: Domain["id"]): Domain {
  return domains.find((d) => d.id === id) ?? healthcare;
}
