import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { schedules, courses as coursesTable, scheduleStudents, students } from '@/db/schema'
import { scheduleSchema } from '@/lib/validations'
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
        id: schedules.id,
        courseId: schedules.courseId,
        date: schedules.date,
        startTime: schedules.startTime,
        endTime: schedules.endTime,
        meetingNumber: schedules.meetingNumber,
        zoomLink: schedules.zoomLink,
        mode: schedules.mode,
        notes: schedules.notes,
        createdAt: schedules.createdAt,
        updatedAt: schedules.updatedAt,
        course: {
          id: coursesTable.id,
          name: coursesTable.name,
        },
      })
      .from(schedules)
      .innerJoin(coursesTable, eq(schedules.courseId, coursesTable.id))
      .where(eq(schedules.id, id))
      .limit(1)

    if (records.length === 0) {
      return NextResponse.json({ error: 'Jadwal tidak ditemukan' }, { status: 404 })
    }

    const studentLinks = await db
      .select({
        studentId: scheduleStudents.studentId,
        studentName: students.name,
      })
      .from(scheduleStudents)
      .innerJoin(students, eq(scheduleStudents.studentId, students.id))
      .where(eq(scheduleStudents.scheduleId, id))

    const schedule = {
      ...records[0],
      students: studentLinks.map((l) => ({ student: { id: l.studentId, name: l.studentName } })),
    }

    return NextResponse.json(schedule)
  } catch {
    return NextResponse.json({ error: 'Gagal mengambil data jadwal' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  const { id } = await params
  try {
    const body = await request.json()
    const data = scheduleSchema.parse(body)

    await db.delete(scheduleStudents).where(eq(scheduleStudents.scheduleId, id))

    const [schedule] = await db.update(schedules).set({
      courseId: data.courseId,
      date: data.date,
      startTime: data.startTime,
      endTime: data.endTime,
      meetingNumber: data.meetingNumber,
      zoomLink: data.zoomLink || null,
      mode: data.mode,
      notes: data.notes || null,
    }).where(eq(schedules.id, id)).returning({ id: schedules.id })

    if (data.studentIds?.length) {
      await db.insert(scheduleStudents).values(
        data.studentIds.map((studentId: string) => ({
          scheduleId: id,
          studentId,
        }))
      )
    }

    revalidatePath('/admin/schedules')
    return NextResponse.json({ id: schedule.id })
  } catch {
    return NextResponse.json({ error: 'Gagal memperbarui jadwal' }, { status: 500 })
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const { id } = await params
  try {
    await db.delete(scheduleStudents).where(eq(scheduleStudents.scheduleId, id))
    await db.delete(schedules).where(eq(schedules.id, id))
    revalidatePath('/admin/schedules')
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Gagal menghapus jadwal' }, { status: 500 })
  }
}
