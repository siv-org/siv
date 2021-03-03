import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://ktoemmjtpzoqhunxvabf.supabase.co'
const SUPABASE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYxMjg0ODgxMiwiZXhwIjoxOTI4NDI0ODEyfQ.CGcmI1V3Wwm9JdQtalhatkLNODRw9mTRJLf-m3sra_w'
export const supabase = createClient(supabaseUrl, SUPABASE_KEY)
