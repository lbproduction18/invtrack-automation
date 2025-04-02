
<<<<<<< HEAD
// src/integrations/supabase/client.ts
import { createClient } from '@supabase/supabase-js';

// Supabase project details
const SUPABASE_URL = 'https://wiqfhqmemoektnuvxirq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndpcWqZocW1lbW9la3RudXZ4aXJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI5OTI5NTgsImV4cCI6MjA1ODU2ODk1OH0.nBgezD7vtgg8SOsX1yBQ1JfPzkIoPizXfbRAfxnS9fc';

// Create and export the Supabase client with updated auth options
export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
    db: {
      schema: 'public',
    },
  }
);

console.log('Supabase client initialized with URL:', SUPABASE_URL);
=======
import { createClient } from "@supabase/supabase-js";

async function createSupabaseClient() {
  const SUPABASE_URL = "https://wiqfhqmemoektnuvxirq.supabase.co";
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndpcWZocW1lbW9la3RudXZ4aXJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI5OTI5NTgsImV4cCI6MjA1ODU2ODk1OH0.nBgezD7vtgg8SOsX1yBQ1JfPzkIoPizXfbRAfxnS9fc';
  
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      storage: localStorage,
      autoRefreshToken: true,
      persistSession: true,
    }
  });
}
>>>>>>> 6b5993f1bcac404afe97193a94c652548468ab62

