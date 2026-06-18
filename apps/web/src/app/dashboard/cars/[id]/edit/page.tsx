import { RequireAuth } from "@/features/auth/components/require-auth";
import { EditCarView } from "@/features/cars/components/edit-car-view";

export default async function EditCarPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <RequireAuth>
      <EditCarView id={id} />
    </RequireAuth>
  );
}
