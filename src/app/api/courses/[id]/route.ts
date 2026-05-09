import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { courseSchema } from '@/lib/validations'
import { revalidatePath } from 'next/cache'

type Params = {
  params: Promise<{ id: string }>
}

export async function GET(request: NextRequest, { params }: Params) {
  const { id } = await params
  try {
    const course = await prisma.course.findUnique({ where: { id } })
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

    const course = await prisma.course.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        basePrice: data.basePrice,
        discountRate: data.discountRate,
        numberOfSessions: data.numberOfSessions,
        modeAvailable: data.modeAvailable,
        isActive: data.isActive,
      },
    })

    revalidatePath('/')
    return NextResponse.json({ id: course.id })
  } catch {
    return NextResponse.json({ error: 'Gagal memperbarui kursus' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  const { id } = await params
  try {
    await prisma.student.updateMany({
      where: { selectedCourseId: id },
      data: { selectedCourseId: null },
    })
    await prisma.schedule.deleteMany({ where: { courseId: id } })
    await prisma.course.delete({ where: { id } })
    revalidatePath('/')
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Gagal menghapus kursus' }, { status: 500 })
  }
}