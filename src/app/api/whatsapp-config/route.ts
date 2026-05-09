import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function GET() {
  try {
    const config = await prisma.whatsAppConfig.findFirst()
    return NextResponse.json(config || { adminPhone: '', messageTemplate: '' })
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

    const existing = await prisma.whatsAppConfig.findFirst()

    if (existing) {
      await prisma.whatsAppConfig.update({
        where: { id: existing.id },
        data: { adminPhone, messageTemplate: messageTemplate || existing.messageTemplate },
      })
    } else {
      await prisma.whatsAppConfig.create({
        data: { adminPhone, messageTemplate: messageTemplate || '' },
      })
    }

    revalidatePath('/admin/settings')
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Gagal menyimpan konfigurasi' }, { status: 500 })
  }
}