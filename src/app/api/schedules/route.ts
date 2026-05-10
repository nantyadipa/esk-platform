import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { schedules, courses as coursesTable, scheduleStudents, students } from '@/db/schema'
import { scheduleSchema } from '@/lib/validations'
import { revalidatePath } from 'next/cache'
import { eq, asc, inArray, and } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const courseId = searchParams.get('courseId')

    const conditions = []
    if (courseId) conditions.push(eq(schedules.courseId, courseId))

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
          modeAvailable: coursesTable.modeAvailable,
        },
      })
      .from(schedules)
      .innerJoin(coursesTable, eq(schedules.courseId, coursesTable.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(asc(schedules.date))

    const scheduleIds = records.map((r) => r.id)

    const studentLinks = scheduleIds.length > 0
      ? await db
          .select({
            scheduleId: scheduleStudents.scheduleId,
            studentId: scheduleStudents.studentId,
            studentName: students.name,
          })
          .from(scheduleStudents)
          .innerJoin(students, eq(scheduleStudents.studentId, students.id))
          .where(inArray(scheduleStudents.scheduleId, scheduleIds))
      : []

    const studentsBySchedule: Record<string, { student: { id: string; name: string } }[]> = {}
    for (const link of studentLinks) {
      if (!studentsBySchedule[link.scheduleId]) studentsBySchedule[link.scheduleId] = []
      studentsBySchedule[link.scheduleId].push({ student: { id: link.studentId, name: link.studentName } })
    }

    const result = records.map((r) => ({
      ...r,
      students: studentsBySchedule[r.id] || [],
    }))

    return NextResponse.json(result)
  } catch {
    return NextResponse.json({ error: 'Gagal mengambil data jadwal' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = scheduleSchema.parse(body)

    const [schedule] = await db.insert(schedules).values({
      courseId: data.courseId,
      date: data.date,
      startTime: data.startTime,
      endTime: data.endTime,
      meetingNumber: data.meetingNumber,
      zoomLink: data.zoomLink || null,
      mode: data.mode,
      notes: data.notes || null,
    }).returning({ id: schedules.id })

    if (data.studentIds?.length) {
      await db.insert(scheduleStudents).values(
        data.studentIds.map((studentId: string) => ({
          scheduleId: schedule.id,
          studentId,
        }))
      )
    }

    revalidatePath('/admin/schedules')
    return NextResponse.json({ id: schedule.id }, { status: 201 })
  } catch (e) {
    if (e instanceof Error && e.name === 'ZodError') {
      return NextResponse.json({ error: 'Data tidak valid' }, { status: 400 })
    }
    return NextResponse.json({ error: 'Gagal membuat jadwal' }, { status: 500 })
  }
}
