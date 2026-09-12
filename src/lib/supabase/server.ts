import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

/**
 * Creates a server-side Supabase client for Server Components, Route Handlers,
 * and Server Actions, seamlessly integrating with Next.js HTTP-only cookies.
 */
export function createServerSupabaseClient() {
  if (!isSupabaseConfigured) {
    return null;
  }

  const cookieStore = cookies();

  return createServerClient(supabaseUrl!, supabaseAnonKey!, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value, ...options });
        } catch {
          // In Server Components, `cookies().set()` cannot be called directly.
          // The middleware `updateSession` refreshes user sessions instead.
        }
      },
      remove(name: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value: "", ...options, maxAge: 0 });
        } catch {
          // Ignored in Server Components
        }
      },
    },
  });
}

/**
 * Creates a server-only Supabase administrative client using the Service Role Key.
 * NEVER expose this client or the service role key to the browser.
 */
export function createAdminSupabaseClient() {
  if (typeof window !== "undefined") {
    throw new Error("SECURITY VIOLATION: createAdminSupabaseClient cannot be used in client environments.");
  }

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    return null;
  }

  return createSupabaseClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
