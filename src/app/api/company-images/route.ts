import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { companyImages } from '@/db/schema'
import { asc } from 'drizzle-orm'

export async function GET() {
  try {
    const records = await db.select().from(companyImages).orderBy(asc(companyImages.sortOrder))
    return NextResponse.json(records)
  } catch {
    return NextResponse.json({ error: 'Gagal mengambil foto' }, { status: 500 })
  }
}
