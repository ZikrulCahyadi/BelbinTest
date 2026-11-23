import { createClient } from "@/lib/supabase/server";
import { AdminTable, type BelbinRecord } from "@/components/AdminTable";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("hasil_belbin")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm">
        Gagal memuat data dari database: {error.message}
      </div>
    );
  }

  return <AdminTable initialData={(data ?? []) as BelbinRecord[]} />;
}
