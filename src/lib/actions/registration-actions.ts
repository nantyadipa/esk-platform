'use server'

import { prisma } from '@/lib/db'
import { registrationFormSchema } from '@/lib/validations'
import type { ActionResult } from '@/types'

const HCAPTCHA_VERIFY_URL = 'https://hcaptcha.com/siteverify'

export async function verifyHCaptcha(token: string): Promise<boolean> {
  const secret = process.env.HCAPTCHA_SECRET
  if (!secret) return true

  const response = await fetch(HCAPTCHA_VERIFY_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `response=${token}&secret=${secret}`,
  })

  const data = await response.json()
  return data.success === true
}

export async function generateWhatsAppURL(formData: FormData): Promise<ActionResult<{ url: string }>> {
  try {
    const hcaptchaToken = formData.get('hcaptchaToken') as string | null
    if (hcaptchaToken) {
      const isValid = await verifyHCaptcha(hcaptchaToken)
      if (!isValid) {
        return { success: false, error: 'Verifikasi captcha gagal. Coba lagi ya.' }
      }
    }

    const data = registrationFormSchema.parse({
      name: formData.get('name'),
      phone: formData.get('phone'),
      selectedClass: formData.get('selectedClass'),
      mode: formData.get('mode'),
      referralCode: formData.get('referralCode') || undefined,
    })

    const config = await prisma.whatsAppConfig.findFirst()
    if (!config) {
      return { success: false, error: 'Konfigurasi WhatsApp tidak ditemukan.' }
    }

    const message = [
      `Halo, saya mau daftar kelas English Sepulang Kerja.`,
      `Nama: ${data.name}`,
      `No. HP: ${data.phone}`,
      `Kelas: ${data.selectedClass}`,
      `Mode: ${data.mode}`,
      `Kode Referral: ${data.referralCode || '-'}`,
    ].join('\n')

    const encodedPhone = config.adminPhone.replace(/[^0-9]/g, '')
    const encodedMessage = encodeURIComponent(message)
    const url = `https://wa.me/${encodedPhone}?text=${encodedMessage}`

    return { success: true, data: { url } }
  } catch {
    return { success: false, error: 'Ada yang salah. Coba lagi ya.' }
  }
}