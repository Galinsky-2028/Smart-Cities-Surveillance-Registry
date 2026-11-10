import { notFound } from "next/navigation";
import { BillDemo } from "../../../components/bill-demo";
import { DEMO_SCENARIOS, type DemoScenario } from "../../../lib/bill-model";

export const metadata = { title: "Fictional Harborview scenario" };
export default async function ScenarioPage({ params }: {params: Promise<{scenario: string}>}) {
  const { scenario } = await params;
  if (!DEMO_SCENARIOS.includes(scenario as DemoScenario)) notFound();
  return <BillDemo key={scenario} initialScenario={scenario as DemoScenario} />;
}
