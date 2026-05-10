'use server'

import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { courses as coursesTable, contents, students } from '@/db/schema'
import { courseSchema } from '@/lib/validations'
import { eq, asc } from 'drizzle-orm'
import type { ActionResult } from '@/types'

export async function getCourses() {
  const records = await db.select().from(coursesTable).orderBy(asc(coursesTable.basePrice))
  return records.map((c) => ({
    ...c,
    basePrice: Number(c.basePrice),
    discountRate: Number(c.discountRate),
  }))
}

export async function getActiveCourses() {
  const records = await db.select().from(coursesTable).where(eq(coursesTable.isActive, true)).orderBy(asc(coursesTable.basePrice))
  return records.map((c) => ({
    ...c,
    basePrice: Number(c.basePrice),
    discountRate: Number(c.discountRate),
  }))
}

export async function getContentSection(section: string): Promise<string> {
  const records = await db.select().from(contents).where(eq(contents.section, section)).limit(1)
  return records[0]?.content ?? ''
}

export async function getAllContent() {
  const records = await db.select().from(contents)
  return records.reduce<Record<string, string>>((acc, r) => {
    acc[r.section] = r.content
    return acc
  }, {})
}

function toCourseValues(data: { name: string; description: string; basePrice: number; discountRate: number; numberOfSessions: number; modeAvailable: 'online' | 'offline' | 'both'; isActive?: boolean }) {
  return {
    name: data.name,
    description: data.description,
    basePrice: String(data.basePrice),
    discountRate: String(data.discountRate),
    numberOfSessions: data.numberOfSessions,
    modeAvailable: data.modeAvailable,
    isActive: data.isActive ?? true,
  }
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

    const [course] = await db.insert(coursesTable).values(toCourseValues(data)).returning({ id: coursesTable.id })
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

    const [course] = await db.update(coursesTable).set(toCourseValues(data)).where(eq(coursesTable.id, id)).returning({ id: coursesTable.id })
    revalidatePath('/')
    return { success: true, data: { id: course.id } }
  } catch {
    return { success: false, error: 'Gagal memperbarui kursus. Coba lagi ya.' }
  }
}

export async function deleteCourse(id: string): Promise<ActionResult<null>> {
  try {
    await db.update(students).set({ selectedCourseId: null }).where(eq(students.selectedCourseId, id))
    await db.delete(coursesTable).where(eq(coursesTable.id, id))
    revalidatePath('/')
    return { success: true }
  } catch {
    return { success: false, error: 'Gagal menghapus kursus. Coba lagi ya.' }
  }
}
