import { createClient } from '@supabase/supabase-js'

const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYyOTIzOTgyNiwiZXhwIjoxOTQ0ODE1ODI2fQ.3NtNuMd72YFBal-ooivlUFN_OzVjDb5gV1TQ2uuTZBs'

const SUPABASE_URL = 'https://vlbwtrpetpygmszmlwkm.supabase.co'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
