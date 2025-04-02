// src/integrations/supabase/client.ts
// (Si ce fichier est régénéré automatiquement, vous devrez peut-être
// l'adapter dans le code qui le génère, mais voici un exemple qui fonctionne.)

import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types';

// Remplacez par l'URL de votre projet Supabase :
const SUPABASE_URL = 'https://votre-projet.supabase.co';
// Remplacez par votre clé anonyme publique (public anon key) :
const SUPABASE_ANON_KEY = 'votre_cle_anon_key';

// Si vous avez défini une interface Database dans '../types',
// vous pouvez la passer en paramètre générique au createClient :
export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  {
    persistSession: true,
    autoRefreshToken: true,
    db: {
      schema: 'public',
    },
  }
);

console.log('Supabase client initialized with URL:', SUPABASE_URL);
