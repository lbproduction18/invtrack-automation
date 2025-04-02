
async function createSupabaseClient() {
  const { createClient } = await import("@supabase/supabase-js");

  const SUPABASE_URL = "https://wiqfhqmemoektnuvxirq.supabase.co";
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndpcWqZocW1lbW9la3RudXZ4aXJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI5OTI5NTgsImV4cCI6MjA1ODU2ODk1OH0.nBgezD7vtgg8SOsX1yBQ1JfPzkIoPizXfbRAfxnS9fc';
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

export const supabase = await createSupabaseClient();
