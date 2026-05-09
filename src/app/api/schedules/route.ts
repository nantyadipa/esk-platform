import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { scheduleSchema } from '@/lib/validations'
import { revalidatePath } from 'next/cache'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const courseId = searchParams.get('courseId')

    const where: Record<string, unknown> = {}
    if (courseId) where.courseId = courseId

    const schedules = await prisma.schedule.findMany({
      where,
      include: {
        course: { select: { id: true, name: true, modeAvailable: true } },
        students: { include: { student: { select: { id: true, name: true } } } },
      },
      orderBy: { date: 'asc' },
    })

    return NextResponse.json(schedules)
  } catch {
    return NextResponse.json({ error: 'Gagal mengambil data jadwal' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = scheduleSchema.parse(body)

    const schedule = await prisma.schedule.create({
      data: {
        courseId: data.courseId,
        date: data.date,
        startTime: data.startTime,
        endTime: data.endTime,
        meetingNumber: data.meetingNumber,
        zoomLink: data.zoomLink || null,
        mode: data.mode,
        notes: data.notes || null,
        students: {
          create: data.studentIds.map((studentId) => ({
            studentId,
          })),
        },
      },
      include: {
        course: { select: { id: true, name: true } },
        students: { include: { student: { select: { id: true, name: true } } } },
      },
    })

    revalidatePath('/admin/schedules')
    return NextResponse.json({ id: schedule.id }, { status: 201 })
  } catch (e) {
    if (e instanceof Error && e.name === 'ZodError') {
      return NextResponse.json({ error: 'Data tidak valid' }, { status: 400 })
    }
    return NextResponse.json({ error: 'Gagal membuat jadwal' }, { status: 500 })
  }
}