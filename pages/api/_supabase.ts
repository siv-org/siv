import { createClient } from '@supabase/supabase-js'

const { SUPABASE_ADMIN_KEY, SUPABASE_DB_URL } = process.env

if (!SUPABASE_ADMIN_KEY) throw new TypeError('SUPABASE_ADMIN_KEY undefined')
if (!SUPABASE_DB_URL) throw new TypeError('SUPABASE_ADMIN_KEY undefined')

export const supabase = createClient(SUPABASE_DB_URL, SUPABASE_ADMIN_KEY)
