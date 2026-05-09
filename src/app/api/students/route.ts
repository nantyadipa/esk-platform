import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { studentSchema } from '@/lib/validations'
import { revalidatePath } from 'next/cache'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const courseId = searchParams.get('courseId')
    const status = searchParams.get('status')

    const where: Record<string, unknown> = {}
    if (courseId) where.selectedCourseId = courseId
    if (status) where.status = status

    const students = await prisma.student.findMany({
      where,
      include: { selectedCourse: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(students)
  } catch {
    return NextResponse.json({ error: 'Gagal mengambil data siswa' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = studentSchema.parse(body)

    const student = await prisma.student.create({
      data: {
        name: data.name,
        phone: data.phone,
        selectedCourseId: data.selectedCourseId || null,
        mode: data.mode,
        referralCode: data.referralCode || null,
        status: data.status,
        notes: data.notes || null,
      },
    })

    revalidatePath('/admin/students')
    return NextResponse.json({ id: student.id }, { status: 201 })
  } catch (e) {
    if (e instanceof Error && e.name === 'ZodError') {
      return NextResponse.json({ error: 'Data tidak valid' }, { status: 400 })
    }
    return NextResponse.json({ error: 'Gagal membuat data siswa' }, { status: 500 })
  }
}