import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const section = searchParams.get('section')

    const where: Record<string, unknown> = {}
    if (section) where.section = section

    const content = await prisma.content.findMany({
      where,
      orderBy: { section: 'asc' },
    })

    return NextResponse.json(content)
  } catch {
    return NextResponse.json({ error: 'Gagal mengambil data konten' }, { status: 500 })
  }
}