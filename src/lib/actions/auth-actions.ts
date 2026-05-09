'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/auth'

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/')
}