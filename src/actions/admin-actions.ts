"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function deleteHasilBelbin(id: string) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Tidak memiliki hak akses (Unauthorized)." };
    }

    const { error } = await supabase.from("hasil_belbin").delete().eq("id", id);
    if (error) {
      return { success: false, error: "Gagal menghapus data peserta." };
    }

    revalidatePath("/admin");
    return { success: true };
  } catch {
    return { success: false, error: "Terjadi kesalahan internal pada server." };
  }
}
