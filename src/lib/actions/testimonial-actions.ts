'use server'

import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { testimonials } from '@/db/schema'
import { createClient } from '@/lib/auth'
import { eq, asc, sql } from 'drizzle-orm'
import { z } from 'zod'
import type { ActionResult } from '@/types'

const testimonialSchema = z.object({
  name: z.string().min(1, 'Nama wajib diisi.'),
  origin: z.string().min(1, 'Asal/pekerjaan wajib diisi.'),
  quote: z.string().min(1, 'Testimoni wajib diisi.'),
  rating: z.coerce.number().int().min(1).max(5),
  isActive: z.boolean().optional().default(true),
})

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_FILE_SIZE = 500 * 1024

export async function getTestimonials() {
  const records = await db.select().from(testimonials).orderBy(asc(testimonials.sortOrder))
  return records
}

export async function getActiveTestimonials() {
  const records = await db.select().from(testimonials)
    .where(eq(testimonials.isActive, true))
    .orderBy(asc(testimonials.sortOrder))
  return records
}

export async function createTestimonial(formData: FormData): Promise<ActionResult<{ id: string }>> {
  try {
    const raw = {
      name: formData.get('name'),
      origin: formData.get('origin'),
      quote: formData.get('quote'),
      rating: formData.get('rating'),
      isActive: formData.get('isActive') === 'true',
    }

    const data = testimonialSchema.parse(raw)
    const photo = formData.get('photo') as File | null
    let photoUrl: string | null = null

    if (photo && photo.size > 0) {
      if (!ALLOWED_TYPES.includes(photo.type)) {
        return { success: false, error: 'Tipe file foto tidak didukung. Gunakan JPEG, PNG, atau WebP.' }
      }
      if (photo.size > MAX_FILE_SIZE) {
        return { success: false, error: 'Ukuran file foto terlalu besar. Maksimum 500KB.' }
      }

      const supabase = await createClient()
      const ext = photo.name.split('.').pop()
      const fileName = `${crypto.randomUUID()}.${ext}`

      const { error: uploadError } = await supabase.storage
        .from('testimonial-photos')
        .upload(fileName, photo, { contentType: photo.type })

      if (uploadError) {
        return { success: false, error: 'Gagal mengupload foto.' }
      }

      const { data: urlData } = supabase.storage.from('testimonial-photos').getPublicUrl(fileName)
      photoUrl = urlData.publicUrl
    }

    const [maxResult] = await db.select({ max: sql<number>`COALESCE(MAX(${testimonials.sortOrder}), -1)` }).from(testimonials)
    const nextOrder = maxResult.max + 1

    const [record] = await db.insert(testimonials).values({
      name: data.name,
      origin: data.origin,
      quote: data.quote,
      rating: data.rating,
      photoUrl,
      isActive: data.isActive,
      sortOrder: nextOrder,
    }).returning({ id: testimonials.id })

    revalidatePath('/')
    revalidatePath('/admin/content/testimonials')
    return { success: true, data: { id: record.id } }
  } catch {
    return { success: false, error: 'Gagal membuat testimoni. Coba lagi ya.' }
  }
}

export async function updateTestimonial(id: string, formData: FormData): Promise<ActionResult<null>> {
  try {
    const raw = {
      name: formData.get('name'),
      origin: formData.get('origin'),
      quote: formData.get('quote'),
      rating: formData.get('rating'),
      isActive: formData.get('isActive') === 'true',
    }

    const data = testimonialSchema.parse(raw)
    const photo = formData.get('photo') as File | null
    const removePhoto = formData.get('removePhoto') === 'true'
    let photoUrl: string | null = null

    const [current] = await db.select().from(testimonials).where(eq(testimonials.id, id)).limit(1)
    if (!current) return { success: false, error: 'Testimoni tidak ditemukan.' }

    const supabase = await createClient()

    if (removePhoto) {
      if (current.photoUrl) {
        const path = current.photoUrl.split('/').pop()
        if (path) await supabase.storage.from('testimonial-photos').remove([path])
      }
      photoUrl = null
    } else if (photo && photo.size > 0) {
      if (!ALLOWED_TYPES.includes(photo.type)) {
        return { success: false, error: 'Tipe file foto tidak didukung. Gunakan JPEG, PNG, atau WebP.' }
      }
      if (photo.size > MAX_FILE_SIZE) {
        return { success: false, error: 'Ukuran file foto terlalu besar. Maksimum 500KB.' }
      }

      if (current.photoUrl) {
        const oldPath = current.photoUrl.split('/').pop()
        if (oldPath) await supabase.storage.from('testimonial-photos').remove([oldPath])
      }

      const ext = photo.name.split('.').pop()
      const fileName = `${crypto.randomUUID()}.${ext}`

      const { error: uploadError } = await supabase.storage
        .from('testimonial-photos')
        .upload(fileName, photo, { contentType: photo.type })

      if (uploadError) {
        return { success: false, error: 'Gagal mengupload foto.' }
      }

      const { data: urlData } = supabase.storage.from('testimonial-photos').getPublicUrl(fileName)
      photoUrl = urlData.publicUrl
    }

    const updateData: Record<string, unknown> = {
      name: data.name,
      origin: data.origin,
      quote: data.quote,
      rating: data.rating,
      isActive: data.isActive,
    }
    if (photoUrl !== null) {
      updateData.photoUrl = photoUrl
    }

    await db.update(testimonials).set(updateData).where(eq(testimonials.id, id))
    revalidatePath('/')
    revalidatePath('/admin/content/testimonials')
    return { success: true }
  } catch {
    return { success: false, error: 'Gagal memperbarui testimoni. Coba lagi ya.' }
  }
}

export async function deleteTestimonial(id: string): Promise<ActionResult<null>> {
  try {
    const [testimonial] = await db.select().from(testimonials).where(eq(testimonials.id, id)).limit(1)
    if (!testimonial) return { success: false, error: 'Testimoni tidak ditemukan.' }

    if (testimonial.photoUrl) {
      const supabase = await createClient()
      const path = testimonial.photoUrl.split('/').pop()
      if (path) {
        await supabase.storage.from('testimonial-photos').remove([path])
      }
    }

    await db.delete(testimonials).where(eq(testimonials.id, id))
    revalidatePath('/')
    revalidatePath('/admin/content/testimonials')
    return { success: true }
  } catch {
    return { success: false, error: 'Gagal menghapus testimoni. Coba lagi ya.' }
  }
}

export async function toggleTestimonialStatus(id: string): Promise<ActionResult<null>> {
  try {
    const [testimonial] = await db.select().from(testimonials).where(eq(testimonials.id, id)).limit(1)
    if (!testimonial) return { success: false, error: 'Testimoni tidak ditemukan.' }

    await db.update(testimonials).set({ isActive: !testimonial.isActive }).where(eq(testimonials.id, id))
    revalidatePath('/')
    revalidatePath('/admin/content/testimonials')
    return { success: true }
  } catch {
    return { success: false, error: 'Gagal mengubah status testimoni. Coba lagi ya.' }
  }
}
