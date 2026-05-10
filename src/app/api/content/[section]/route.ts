import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { contents } from '@/db/schema'
import { revalidatePath } from 'next/cache'
import { eq } from 'drizzle-orm'

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

    const existing = await db.select().from(contents).where(eq(contents.section, section)).limit(1)

    let record: { id: string }
    if (existing[0]) {
      const [updated] = await db.update(contents).set({
        content: contentText ?? existing[0].content,
        imageUrl: imageUrl !== undefined ? imageUrl : existing[0].imageUrl,
      }).where(eq(contents.id, existing[0].id)).returning({ id: contents.id })
      record = updated
    } else {
      const [created] = await db.insert(contents).values({
        section,
        content: contentText ?? '',
        imageUrl: imageUrl ?? null,
      }).returning({ id: contents.id })
      record = created
    }

    revalidatePath('/')
    return NextResponse.json({ id: record.id })
  } catch {
    return NextResponse.json({ error: 'Gagal menyimpan konten' }, { status: 500 })
  }
}
