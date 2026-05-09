import { NextRequest, NextResponse } from 'next/server'
import { getCourses } from '@/lib/actions/course-actions'
import { courseSchema } from '@/lib/validations'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const courses = await getCourses()
    return NextResponse.json(courses)
  } catch {
    return NextResponse.json({ error: 'Gagal mengambil data kursus' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = courseSchema.parse(body)

    const course = await prisma.course.create({
      data: {
        name: data.name,
        description: data.description,
        basePrice: data.basePrice,
        discountRate: data.discountRate,
        numberOfSessions: data.numberOfSessions,
        modeAvailable: data.modeAvailable,
        isActive: data.isActive ?? true,
      },
    })

    revalidatePath('/')
    return NextResponse.json({ id: course.id }, { status: 201 })
  } catch (e) {
    if (e instanceof Error && e.message.includes('ZodError')) {
      return NextResponse.json({ error: 'Data tidak valid' }, { status: 400 })
    }
    return NextResponse.json({ error: 'Gagal membuat kursus' }, { status: 500 })
  }
}