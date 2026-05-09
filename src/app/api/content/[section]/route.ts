import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'

type Params = {
  params: Promise<{ section: string }>
}

export async function PUT(request: NextRequest, { params }: Params) {
  const { section } = await params
  try {
    const body = await request.json()
    const { content: contentText, imageUrl } = body

    if (!contentText && imageUrl === undefined) {
      return NextResponse.json({ error: 'Data tidak valid' }, { status: 400 })
    }

    const existing = await prisma.content.findFirst({ where: { section } })

    let record
    if (existing) {
      record = await prisma.content.update({
        where: { id: existing.id },
        data: {
          content: contentText ?? existing.content,
          imageUrl: imageUrl !== undefined ? imageUrl : existing.imageUrl,
        },
      })
    } else {
      record = await prisma.content.create({
        data: {
          section,
          content: contentText ?? '',
          imageUrl: imageUrl ?? null,
        },
      })
    }

    revalidatePath('/')
    return NextResponse.json({ id: record.id })
  } catch {
    return NextResponse.json({ error: 'Gagal menyimpan konten' }, { status: 500 })
  }
}