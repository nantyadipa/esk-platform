'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/auth'
import { db } from '@/lib/db'
import { admins } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/')
}

export async function updateAdminPasswordHash(email: string, password: string): Promise<{ success: boolean; error?: string }> {
  try {
    await db.update(admins).set({ passwordHash: password }).where(eq(admins.email, email))
    return { success: true }
  } catch {
    return { success: false, error: 'Gagal menyimpan password ke database.' }
  }
}