import { createBrowserClient } from '@supabase/ssr'
import { Database } from '@/types/database.types'

export function createClient() {
  return createBrowserClient<Database>(
    'https://wbrepnefggojyolspxzj.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndicmVwbmVmZ2dvanlvbHNweHpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1NzEwMTEsImV4cCI6MjA3OTE0NzAxMX0.XLIXEyMw9k4uZbwI_q2KNd0bleKXJYH7lG2s-nZMTxg'
  )
}
