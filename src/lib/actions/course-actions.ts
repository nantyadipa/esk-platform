'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/db'
import { courseSchema } from '@/lib/validations'
import type { ActionResult } from '@/types'

export async function createCourse(formData: FormData): Promise<ActionResult<{ id: string }>> {
  try {
    const data = courseSchema.parse({
      name: formData.get('name'),
      description: formData.get('description'),
      basePrice: formData.get('basePrice'),
      discountRate: formData.get('discountRate'),
      numberOfSessions: formData.get('numberOfSessions'),
      modeAvailable: formData.get('modeAvailable'),
    })

    const course = await prisma.course.create({ data })
    revalidatePath('/')
    return { success: true, data: { id: course.id } }
  } catch (error) {
    return { success: false, error: 'Gagal membuat kursus. Coba lagi ya.' }
  }
}

export async function updateCourse(id: string, formData: FormData): Promise<ActionResult<{ id: string }>> {
  try {
    const data = courseSchema.parse({
      name: formData.get('name'),
      description: formData.get('description'),
      basePrice: formData.get('basePrice'),
      discountRate: formData.get('discountRate'),
      numberOfSessions: formData.get('numberOfSessions'),
      modeAvailable: formData.get('modeAvailable'),
    })

    const course = await prisma.course.update({ where: { id }, data })
    revalidatePath('/')
    return { success: true, data: { id: course.id } }
  } catch (error) {
    return { success: false, error: 'Gagal memperbarui kursus. Coba lagi ya.' }
  }
}

export async function deleteCourse(id: string): Promise<ActionResult<null>> {
  try {
    await prisma.course.delete({ where: { id } })
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Gagal menghapus kursus. Coba lagi ya.' }
  }
}