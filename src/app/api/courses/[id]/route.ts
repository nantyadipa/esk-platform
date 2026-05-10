import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { courses as coursesTable, students, schedules, scheduleStudents } from '@/db/schema'
import { courseSchema } from '@/lib/validations'
import { revalidatePath } from 'next/cache'
import { eq } from 'drizzle-orm'

type Params = {
  params: Promise<{ id: string }>
}

export async function GET(_request: NextRequest, { params }: Params) {
  const { id } = await params
  try {
    const records = await db.select().from(coursesTable).where(eq(coursesTable.id, id)).limit(1)
    const course = records[0]
    if (!course) {
      return NextResponse.json({ error: 'Kursus tidak ditemukan' }, { status: 404 })
    }
    return NextResponse.json({
      ...course,
      basePrice: Number(course.basePrice),
      discountRate: Number(course.discountRate),
    })
  } catch {
    return NextResponse.json({ error: 'Gagal mengambil data kursus' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  const { id } = await params
  try {
    const body = await request.json()
    const data = courseSchema.parse(body)

    const [course] = await db.update(coursesTable).set({
      name: data.name,
      description: data.description,
      basePrice: String(data.basePrice),
      discountRate: String(data.discountRate),
      numberOfSessions: data.numberOfSessions,
      modeAvailable: data.modeAvailable,
      isActive: data.isActive,
    }).where(eq(coursesTable.id, id)).returning({ id: coursesTable.id })

    revalidatePath('/')
    return NextResponse.json({ id: course.id })
  } catch {
    return NextResponse.json({ error: 'Gagal memperbarui kursus' }, { status: 500 })
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const { id } = await params
  try {
    await db.update(students).set({ selectedCourseId: null }).where(eq(students.selectedCourseId, id))
    const schedRecords = await db.select({ id: schedules.id }).from(schedules).where(eq(schedules.courseId, id))
    for (const s of schedRecords) {
      await db.delete(scheduleStudents).where(eq(scheduleStudents.scheduleId, s.id))
    }
    await db.delete(schedules).where(eq(schedules.courseId, id))
    await db.delete(coursesTable).where(eq(coursesTable.id, id))
    revalidatePath('/')
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Gagal menghapus kursus' }, { status: 500 })
  }
}
