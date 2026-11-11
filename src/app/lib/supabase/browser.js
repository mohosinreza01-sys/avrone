"use client";

import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseConfig } from "@/lib/supabase/config";

let client;

export function createSupabaseBrowserClient() {
  if (!client) {
    const { url, key } = getSupabaseConfig();
    client = createBrowserClient(url, key);
  }
  return client;
}
