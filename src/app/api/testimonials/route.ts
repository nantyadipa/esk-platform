import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { testimonials } from '@/db/schema'
import { asc } from 'drizzle-orm'

export async function GET() {
  try {
    const records = await db.select().from(testimonials).orderBy(asc(testimonials.sortOrder))
    return NextResponse.json(records)
  } catch {
    return NextResponse.json({ error: 'Gagal mengambil testimoni' }, { status: 500 })
  }
}
