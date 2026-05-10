'use server'

import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { companyImages } from '@/db/schema'
import { createClient } from '@/lib/auth'
import { eq, asc, sql } from 'drizzle-orm'
import type { ActionResult } from '@/types'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_FILE_SIZE = 500 * 1024

export async function getCompanyImages() {
  const records = await db.select().from(companyImages).orderBy(asc(companyImages.sortOrder))
  return records
}

export async function uploadCompanyImage(formData: FormData): Promise<ActionResult<{ id: string }>> {
  try {
    const file = formData.get('file') as File | null
    const altText = formData.get('altText') as string | null

    if (!file || !altText?.trim()) {
      return { success: false, error: 'File dan alt text wajib diisi.' }
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return { success: false, error: 'Tipe file tidak didukung. Gunakan JPEG, PNG, atau WebP.' }
    }

    if (file.size > MAX_FILE_SIZE) {
      return { success: false, error: 'Ukuran file terlalu besar. Maksimum 500KB.' }
    }

    const supabase = await createClient()
    const ext = file.name.split('.').pop()
    const fileName = `${crypto.randomUUID()}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from('company-images')
      .upload(fileName, file, { contentType: file.type })

    if (uploadError) {
      return { success: false, error: 'Gagal mengupload gambar.' }
    }

    const { data: urlData } = supabase.storage.from('company-images').getPublicUrl(fileName)
    const url = urlData.publicUrl

    const [maxResult] = await db.select({ max: sql<number>`COALESCE(MAX(${companyImages.sortOrder}), -1)` }).from(companyImages)
    const nextOrder = maxResult.max + 1

    const [record] = await db.insert(companyImages).values({
      url,
      altText: altText.trim(),
      sortOrder: nextOrder,
    }).returning({ id: companyImages.id })

    revalidatePath('/')
    revalidatePath('/admin/content/company-photos')
    return { success: true, data: { id: record.id } }
  } catch {
    return { success: false, error: 'Gagal mengupload gambar. Coba lagi ya.' }
  }
}

export async function deleteCompanyImage(id: string): Promise<ActionResult<null>> {
  try {
    const [image] = await db.select().from(companyImages).where(eq(companyImages.id, id)).limit(1)
    if (!image) return { success: false, error: 'Gambar tidak ditemukan.' }

    const supabase = await createClient()
    const path = image.url.split('/').pop()
    if (path) {
      await supabase.storage.from('company-images').remove([path])
    }

    await db.delete(companyImages).where(eq(companyImages.id, id))
    revalidatePath('/')
    revalidatePath('/admin/content/company-photos')
    return { success: true }
  } catch {
    return { success: false, error: 'Gagal menghapus gambar. Coba lagi ya.' }
  }
}
