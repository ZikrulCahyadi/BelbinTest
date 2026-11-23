import { createClient } from "@supabase/supabase-js";

/**
 * Supabase client dengan service role / secret key.
 * HANYA boleh dipakai di server (Server Actions / Route Handlers).
 * Secret key tidak boleh diekspos ke client component.
 */
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SECRET_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY (atau SUPABASE_SECRET_KEY) wajib dikonfigurasi di server."
    );
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
