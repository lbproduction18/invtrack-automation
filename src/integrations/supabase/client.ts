
// src/integrations/supabase/client.tssdf
import { createClient  } from '@supabase/supabase-js';


// Create and export the Supabase client with updated auth options
export const supabase = createClient(

  "https://wiqfhqmemoektnuvxirq.supabase.co",
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndpcWqZocW1lbW9la3RudXZ4aXJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI5OTI5NTgsImV4cCI6MjA1ODU2ODk1OH0.nBgezD7vtgg8SOsX1yBQ1JfPzkIoPizXfbRAfxnS9fc',
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


