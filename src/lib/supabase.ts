import { createClient } from "@supabase/supabase-js";

// Fall back to harmless placeholders when the env vars are absent so `createClient`
// doesn't throw "supabaseUrl is required" at build time. This only triggers in
// environments missing the vars (e.g. Vercel Preview deploys, which are scoped to
// Production only) — there the build completes with a data-less client instead of
// crashing. Production has the real vars, so its behavior is unchanged.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://placeholder.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "placeholder-key";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Public client — for reads (respects RLS)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const supabase = createClient<any>(supabaseUrl, supabaseAnonKey);

// Admin client — for server-side writes (bypasses RLS)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const supabaseAdmin = createClient<any>(
  supabaseUrl,
  supabaseServiceKey ?? supabaseAnonKey // fall back to anon if key not set yet
);
