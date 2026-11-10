export const BILL_TITLE = "Smart Cities and Surveillance Accountability Act of 2025";
export type DemoScenario = "proposal" | "lookback" | "annual-review";
export const DEMO_SCENARIOS: DemoScenario[] = ["proposal", "lookback", "annual-review"];

function parseDate(value: string): Date {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) throw new Error("Choose a valid calendar date.");
  const date = new Date(value + "T00:00:00Z");
  if (!Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== value) {
    throw new Error("Choose a valid calendar date.");
  }
  return date;
}
export function addDays(value: string, days: number): string {
  const date = parseDate(value);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}
export function addMonths(value: string, months: number): string {
  const date = parseDate(value);
  const day = date.getUTCDate();
  date.setUTCDate(1);
  date.setUTCMonth(date.getUTCMonth() + months);
  const lastDay = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0)).getUTCDate();
  date.setUTCDate(Math.min(day, lastDay));
  return date.toISOString().slice(0, 10);
}
export function lookbackTimeline(enactment: string) {
  const year = parseDate(enactment).getUTCFullYear();
  if (year < 1900 || year > 2090) throw new Error("Choose a hypothetical enactment year from 1900 to 2090.");
  const approval = addDays(enactment, 365);
  const extension = [addDays(approval, 90), addMonths(enactment, 15)].sort()[0];
  return {
    start: addMonths(enactment, -120), end: addDays(enactment, -1),
    inventory: addDays(enactment, 180), approval, extension,
  };
}
export function annualTimeline(year: number) {
  if (!Number.isInteger(year) || year < 2000 || year > 2090) throw new Error("Choose a reporting year from 2000 to 2090.");
  const end = `${year}-12-31`;
  const due = addDays(end, 90);
  return { end, due, publicUntil: addMonths(due, 60) };
}

export const BILL_REQUIREMENTS = [
  { id: "approval", section: "§101(a)", title: "Let the public see and shape a proposal", text: "Publish the impact report and proposed use policy at least 30 days before the decision. Hold a public hearing, record community input, and obtain governing-body approval for specified uses.", qualifier: "The draft generally calls for at least 10 business days of hearing notice. That wording is guidance, not an unconditional calendar rule." },
  { id: "inventory", section: "§101(c)", title: "Make surveillance visible", text: "Publish an inventory of approved technologies in use, their capabilities, general areas of use, and applicable policies. The draft says the inventory should be updated at least quarterly.", qualifier: "General areas provide accountability without publishing sensitive operational details or personal surveillance data." },
  { id: "reporting", section: "§102(a), (c)", title: "Review actual use every year", text: "Publish an annual report within 90 days of the calendar or specified fiscal year’s end, covering use, effectiveness, costs, sharing, complaints, audits, and retention. Review it in an open meeting and keep the report publicly accessible for at least five years.", qualifier: "An agency-reported figure and an independently verified finding are different kinds of evidence." },
  { id: "lookback", section: "§103(a), (b)", title: "Review legacy systems, not people’s movements", text: "Review technologies used in public spaces during the ten years before enactment that remain relevant to continued use, possible redeployment, or retained data. Publish the inventory and compliance plans within 180 days. Obtain approval for continued use within 365 days or cease unapproved use.", qualifier: "A single formally granted extension is limited to 90 days and cannot exceed the draft’s 15-month outer limit. This is not a direction to retain ten years of surveillance footage." },
  { id: "policy", section: "§104; §202", title: "Make safeguards inspectable", text: "Show authorized and prohibited uses, retention schedules, sharing permissions, access safeguards, oversight responsibilities, and supporting evidence. The draft’s default maximum for routine personal surveillance data is 30 days, subject to its exceptions.", qualifier: "That rule does not delete public policies, reports, or accountability history after 30 days. A stated policy or reported purge is not proof of physical deletion." },
  { id: "judicial", section: "§201; §203", title: "Show judicial oversight in aggregate", text: "Explain the proposed warrant requirement and its limited exceptions. Show public aggregate warrant and emergency-use statistics when supported by sources.", qualifier: "Emergency targeted surveillance generally requires an application for retroactive judicial approval within 48 hours. Case identities and raw surveillance records do not belong in this public explorer." },
] as const;
