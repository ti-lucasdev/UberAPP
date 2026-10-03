import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

export const supabaseConfigured = Boolean(url && publishableKey)

// Keep the interface renderable before local Supabase configuration exists.
export const supabase = createClient(
  url || 'https://missing-project.supabase.co',
  publishableKey || 'missing-publishable-key',
)
