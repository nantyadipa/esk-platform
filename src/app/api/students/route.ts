import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { students, courses as coursesTable } from '@/db/schema'
import { studentSchema } from '@/lib/validations'
import { revalidatePath } from 'next/cache'
import { eq, desc, and } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const courseId = searchParams.get('courseId')
    const status = searchParams.get('status')

    const validStatuses = ['aktif', 'tidak_aktif', 'trial'] as const
    const conditions = []
    if (courseId) conditions.push(eq(students.selectedCourseId, courseId))
    if (status && validStatuses.includes(status as any)) conditions.push(eq(students.status, status as typeof validStatuses[number]))

    const records = await db
      .select({
        id: students.id,
        name: students.name,
        phone: students.phone,
        selectedCourseId: students.selectedCourseId,
        mode: students.mode,
        referralCode: students.referralCode,
        status: students.status,
        notes: students.notes,
        createdAt: students.createdAt,
        updatedAt: students.updatedAt,
        selectedCourse: {
          id: coursesTable.id,
          name: coursesTable.name,
        },
      })
      .from(students)
      .leftJoin(coursesTable, eq(students.selectedCourseId, coursesTable.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(students.createdAt))

    return NextResponse.json(records)
  } catch {
    return NextResponse.json({ error: 'Gagal mengambil data siswa' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = studentSchema.parse(body)

    const [student] = await db.insert(students).values({
      name: data.name,
      phone: data.phone,
      selectedCourseId: data.selectedCourseId || null,
      mode: data.mode,
      referralCode: data.referralCode || null,
      status: data.status,
      notes: data.notes || null,
    }).returning({ id: students.id })

    revalidatePath('/admin/students')
    return NextResponse.json({ id: student.id }, { status: 201 })
  } catch (e) {
    if (e instanceof Error && e.name === 'ZodError') {
      return NextResponse.json({ error: 'Data tidak valid' }, { status: 400 })
    }
    return NextResponse.json({ error: 'Gagal membuat data siswa' }, { status: 500 })
  }
}
