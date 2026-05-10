import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { whatsappConfigs } from '@/db/schema'
import { revalidatePath } from 'next/cache'
import { eq } from 'drizzle-orm'

export async function GET() {
  try {
    const configs = await db.select().from(whatsappConfigs).limit(1)
    return NextResponse.json(configs[0] || { adminPhone: '', messageTemplate: '' })
  } catch {
    return NextResponse.json({ error: 'Gagal mengambil konfigurasi' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { adminPhone, messageTemplate } = body

    if (!adminPhone) {
      return NextResponse.json({ error: 'No. WhatsApp admin wajib diisi' }, { status: 400 })
    }

    const existing = await db.select().from(whatsappConfigs).limit(1)

    if (existing[0]) {
      await db.update(whatsappConfigs).set({
        adminPhone,
        messageTemplate: messageTemplate || existing[0].messageTemplate,
      }).where(eq(whatsappConfigs.id, existing[0].id))
    } else {
      await db.insert(whatsappConfigs).values({ adminPhone, messageTemplate: messageTemplate || '' })
    }

    revalidatePath('/admin/settings')
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Gagal menyimpan konfigurasi' }, { status: 500 })
  }
}
