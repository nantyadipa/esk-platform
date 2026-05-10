import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { contents } from '@/db/schema'
import { asc, eq } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const section = searchParams.get('section')

    const records = await db
      .select()
      .from(contents)
      .where(section ? eq(contents.section, section) : undefined)
      .orderBy(asc(contents.section))

    return NextResponse.json(records)
  } catch {
    return NextResponse.json({ error: 'Gagal mengambil data konten' }, { status: 500 })
  }
}
