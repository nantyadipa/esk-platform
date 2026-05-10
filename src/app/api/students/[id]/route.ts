import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { students, courses as coursesTable, scheduleStudents } from '@/db/schema'
import { studentSchema } from '@/lib/validations'
import { revalidatePath } from 'next/cache'
import { eq } from 'drizzle-orm'

type Params = {
  params: Promise<{ id: string }>
}

export async function GET(_request: NextRequest, { params }: Params) {
  const { id } = await params
  try {
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
      .where(eq(students.id, id))
      .limit(1)

    const student = records[0]
    if (!student) {
      return NextResponse.json({ error: 'Siswa tidak ditemukan' }, { status: 404 })
    }
    return NextResponse.json(student)
  } catch {
    return NextResponse.json({ error: 'Gagal mengambil data siswa' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  const { id } = await params
  try {
    const body = await request.json()
    const data = studentSchema.parse(body)

    const [student] = await db.update(students).set({
      name: data.name,
      phone: data.phone,
      selectedCourseId: data.selectedCourseId || null,
      mode: data.mode,
      referralCode: data.referralCode || null,
      status: data.status,
      notes: data.notes || null,
    }).where(eq(students.id, id)).returning({ id: students.id })

    revalidatePath('/admin/students')
    return NextResponse.json({ id: student.id })
  } catch {
    return NextResponse.json({ error: 'Gagal memperbarui data siswa' }, { status: 500 })
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const { id } = await params
  try {
    await db.delete(scheduleStudents).where(eq(scheduleStudents.studentId, id))
    await db.delete(students).where(eq(students.id, id))
    revalidatePath('/admin/students')
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Gagal menghapus siswa' }, { status: 500 })
  }
}
