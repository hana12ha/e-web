import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://vatifvnzbfdxjmvrwadv.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_Uo1rnI4Zai_1mfK7WCGsKA_xOjN9kml'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
