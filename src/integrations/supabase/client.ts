import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs';

const SUPABASE_URL = 'https://wiqfhqmemoektnuvxirq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndpcWZocW1lbW9la3RudXZ4aXJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI5OTI5OCwiZXhwIjoyMDU4NTY4OTU4fQ.nBgezD7vtgg8SOsX1yBQ1JfPzkIoPizXfbRAfxnS9fc';

// Create Supabase client for the browser
export const supabase = createPagesBrowserClient({
  supabaseUrl: SUPABASE_URL,
  supabaseKey: SUPABASE_ANON_KEY,
});
