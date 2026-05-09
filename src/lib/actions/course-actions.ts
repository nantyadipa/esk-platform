'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/db'
import { courseSchema } from '@/lib/validations'
import type { ActionResult } from '@/types'

export async function getCourses() {
  const courses = await prisma.course.findMany({
    orderBy: { basePrice: 'asc' },
  })
  return courses.map((c) => ({
    ...c,
    basePrice: Number(c.basePrice),
    discountRate: Number(c.discountRate),
  }))
}

export async function getActiveCourses() {
  const courses = await prisma.course.findMany({
    where: { isActive: true },
    orderBy: { basePrice: 'asc' },
  })
  return courses.map((c) => ({
    ...c,
    basePrice: Number(c.basePrice),
    discountRate: Number(c.discountRate),
  }))
}

export async function getContentSection(section: string): Promise<string> {
  const record = await prisma.content.findFirst({ where: { section } })
  return record?.content ?? ''
}

export async function getAllContent() {
  const records = await prisma.content.findMany()
  return records.reduce<Record<string, string>>((acc, r) => {
    acc[r.section] = r.content
    return acc
  }, {})
}

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
  } catch {
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
  } catch {
    return { success: false, error: 'Gagal memperbarui kursus. Coba lagi ya.' }
  }
}

export async function deleteCourse(id: string): Promise<ActionResult<null>> {
  try {
    await prisma.course.delete({ where: { id } })
    revalidatePath('/')
    return { success: true }
  } catch {
    return { success: false, error: 'Gagal menghapus kursus. Coba lagi ya.' }
  }
}