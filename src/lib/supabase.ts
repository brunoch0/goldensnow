import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  // Surfaced in dev console — keeps the form from silently failing on misconfig
  console.warn(
    "[Goldensnow] Missing Supabase env vars. Check .env (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY)."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type ServiceType =
  | "general"
  | "360"
  | "OOH"
  | "creative"
  | "production"
  | "dubai37";

export interface LeadInput {
  name: string;
  company?: string;
  email: string;
  phone?: string;
  service_type: ServiceType | string;
  message?: string;
}

/**
 * Submit a lead via the SECURITY DEFINER RPC `submit_goldensnow_lead`.
 * The anon role can only call this function (insert-only) and cannot read the
 * goldensnow_leads table — safer than a direct table insert. Returns {error}.
 */
export async function submitLead(input: LeadInput) {
  const { error } = await supabase.rpc("submit_goldensnow_lead", {
    p_name: input.name,
    p_email: input.email,
    p_company: input.company || null,
    p_phone: input.phone || null,
    p_service_type: input.service_type || null,
    p_message: input.message || null,
  });
  return { error };
}
