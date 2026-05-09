import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { studentSchema } from '@/lib/validations'
import { revalidatePath } from 'next/cache'

type Params = {
  params: Promise<{ id: string }>
}

export async function GET(_request: NextRequest, { params }: Params) {
  const { id } = await params
  try {
    const student = await prisma.student.findUnique({
      where: { id },
      include: { selectedCourse: { select: { id: true, name: true } } },
    })
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

    const student = await prisma.student.update({
      where: { id },
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
    return NextResponse.json({ id: student.id })
  } catch {
    return NextResponse.json({ error: 'Gagal memperbarui data siswa' }, { status: 500 })
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const { id } = await params
  try {
    await prisma.student.delete({ where: { id } })
    revalidatePath('/admin/students')
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Gagal menghapus siswa' }, { status: 500 })
  }
}