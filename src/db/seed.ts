import 'dotenv/config'
import { db } from './index'
import { whatsappConfigs, courses } from './schema'
import { eq } from 'drizzle-orm'

async function main() {
  console.log('Seeding database...')

  const existingConfigs = await db.select().from(whatsappConfigs).limit(1)

  if (existingConfigs.length === 0) {
    await db.insert(whatsappConfigs).values({
      adminPhone: '6281234567890',
      messageTemplate: `Halo, saya mau daftar kelas English Sepulang Kerja.
Nama: {name}
No. HP: {phone}
Kelas: {selectedClass}
Mode: {mode}
Kode Referral: {referralCode}`,
    })
    console.log('Created WhatsApp config')
  }

  const existingCourses = await db.select().from(courses).limit(1)

  if (existingCourses.length === 0) {
    await db.insert(courses).values([
      {
        name: 'General English',
        description: 'Kelas bahasa Inggris umum untuk tingkat pemula hingga menengah. Fokus pada percakapan sehari-hari, tata bahasa praktis, dan kepercayaan diri berbicara.',
        basePrice: '500000',
        discountRate: '0.1',
        numberOfSessions: 8,
        modeAvailable: 'both',
        isActive: true,
      },
      {
        name: 'TOEFL Preparation',
        description: 'Persiapan tes TOEFL dengan latihan soal intensif, strategi menjawab, dan simulasi tes. Cocok untuk yang ingin skor TOEFL 500+.',
        basePrice: '750000',
        discountRate: '0',
        numberOfSessions: 12,
        modeAvailable: 'online',
        isActive: true,
      },
      {
        name: 'IELTS Intensive',
        description: 'Program intensif persiapan IELTS dengan fokus pada keempat skill: Listening, Reading, Writing, dan Speaking. Termasuk mock test dan feedback personal.',
        basePrice: '1000000',
        discountRate: '0.15',
        numberOfSessions: 16,
        modeAvailable: 'offline',
        isActive: true,
      },
      {
        name: 'English for Business',
        description: 'Bahasa Inggris bisnis untuk profesional. Belajar email formal, presentasi, negosiasi, dan komunikasi kantor.',
        basePrice: '600000',
        discountRate: '0.05',
        numberOfSessions: 10,
        modeAvailable: 'both',
        isActive: true,
      },
      {
        name: 'Trial Class',
        description: 'Coba kelas gratis selama 1 sesi untuk merasakan pengalaman belajar di English Sepulang Kerja.',
        basePrice: '150000',
        discountRate: '1',
        numberOfSessions: 1,
        modeAvailable: 'both',
        isActive: true,
      },
    ])
    console.log('Created 5 courses')
  }

  console.log('Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('Seed failed:', e)
    process.exit(1)
  })
