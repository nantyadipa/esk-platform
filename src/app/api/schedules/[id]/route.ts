import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { scheduleSchema } from '@/lib/validations'
import { revalidatePath } from 'next/cache'

type Params = {
  params: Promise<{ id: string }>
}

export async function GET(_request: NextRequest, { params }: Params) {
  const { id } = await params
  try {
    const schedule = await prisma.schedule.findUnique({
      where: { id },
      include: {
        course: { select: { id: true, name: true } },
        students: { include: { student: { select: { id: true, name: true } } } },
      },
    })
    if (!schedule) {
      return NextResponse.json({ error: 'Jadwal tidak ditemukan' }, { status: 404 })
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

    await prisma.scheduleStudent.deleteMany({ where: { scheduleId: id } })

    const schedule = await prisma.schedule.update({
      where: { id },
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
    return NextResponse.json({ id: schedule.id })
  } catch {
    return NextResponse.json({ error: 'Gagal memperbarui jadwal' }, { status: 500 })
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const { id } = await params
  try {
    await prisma.schedule.delete({ where: { id } })
    revalidatePath('/admin/schedules')
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Gagal menghapus jadwal' }, { status: 500 })
  }
}