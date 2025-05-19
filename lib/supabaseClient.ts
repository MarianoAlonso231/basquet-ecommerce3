import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://reifcbczirhrxnlnqiwx.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJlaWZjYmN6aXJocnhubG5xaXd4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc1MjYyMDQsImV4cCI6MjA2MzEwMjIwNH0.sK1iKVVtz_yjnEflO8I8ddeo2zXItGClIB7L09waaqo'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)