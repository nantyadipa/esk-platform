import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { courses as coursesTable } from '@/db/schema'
import { courseSchema } from '@/lib/validations'
import { revalidatePath } from 'next/cache'
import { eq } from 'drizzle-orm'

export async function GET() {
  try {
    const records = await db.select().from(coursesTable).orderBy(coursesTable.createdAt)
    return NextResponse.json(records.map((c) => ({
      ...c,
      basePrice: Number(c.basePrice),
      discountRate: Number(c.discountRate),
    })))
  } catch {
    return NextResponse.json({ error: 'Gagal mengambil data kursus' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = courseSchema.parse(body)

    const [course] = await db.insert(coursesTable).values({
      name: data.name,
      description: data.description,
      basePrice: String(data.basePrice),
      discountRate: String(data.discountRate),
      numberOfSessions: data.numberOfSessions,
      modeAvailable: data.modeAvailable,
      isActive: data.isActive ?? true,
    }).returning({ id: coursesTable.id })

    revalidatePath('/')
    return NextResponse.json({ id: course.id }, { status: 201 })
  } catch (e) {
    if (e instanceof Error && e.message.includes('ZodError')) {
      return NextResponse.json({ error: 'Data tidak valid' }, { status: 400 })
    }
    return NextResponse.json({ error: 'Gagal membuat kursus' }, { status: 500 })
  }
}
