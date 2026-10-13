import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://qrbvrelhpmvfvkujjgtt.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_J7W7CL-QniKTeRT5vSGlug_NKncCVZu';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
