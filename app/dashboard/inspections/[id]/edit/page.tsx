import { getInspection } from "../../actions/actions";
import { DoInspectionForm } from "./components/do-inspection-form";
import { notFound } from "next/navigation";
import { getSites } from "@/app/dashboard/sites/actions/actions";

export const dynamic = "force-dynamic";

export default async function EditInspectionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const inspectionPromise = getInspection(id);
  const sitesPromise = getSites();

  const [inspectionResult, sitesResult] = await Promise.all([
    inspectionPromise,
    sitesPromise,
  ]);

  if (!inspectionResult) {
    notFound();
  }

  return (
    <DoInspectionForm
      // @ts-expect-error - this is a temporary fix to get the inspection to display
      inspection={inspectionResult?.data}
      // @ts-expect-error - this is a temporary fix to get the sites to display
      sites={sitesResult?.data}
    />
  );
}
