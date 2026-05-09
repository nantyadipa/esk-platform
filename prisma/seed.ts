import { PrismaClient } from '../src/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
})

const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Seeding database...')

  const whatsappConfig = await prisma.whatsAppConfig.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      adminPhone: '6281234567890',
      messageTemplate: `Halo, saya mau daftar kelas English Sepulang Kerja.
Nama: {name}
No. HP: {phone}
Kelas: {selectedClass}
Mode: {mode}
Kode Referral: {referralCode}`,
    },
  })
  console.log('Created WhatsApp config:', whatsappConfig.id)

  const course1 = await prisma.course.create({
    data: {
      name: 'General English',
      description: 'Kelas bahasa Inggris umum untuk tingkat pemula hingga menengah. Fokus pada percakapan sehari-hari, tata bahasa praktis, dan kepercayaan diri berbicara.',
      basePrice: 500000,
      discountRate: 0.1,
      numberOfSessions: 8,
      modeAvailable: 'both',
      isActive: true,
    },
  })
  console.log('Created course:', course1.name)

  const course2 = await prisma.course.create({
    data: {
      name: 'TOEFL Preparation',
      description: 'Persiapan tes TOEFL dengan latihan soal intensif, strategi menjawab, dan simulasi tes. Cocok untuk yang ingin skor TOEFL 500+.',
      basePrice: 750000,
      discountRate: 0,
      numberOfSessions: 12,
      modeAvailable: 'online',
      isActive: true,
    },
  })
  console.log('Created course:', course2.name)

  const course3 = await prisma.course.create({
    data: {
      name: 'IELTS Intensive',
      description: 'Program intensif persiapan IELTS dengan fokus pada keempat skill: Listening, Reading, Writing, dan Speaking. Termasuk mock test dan feedback personal.',
      basePrice: 1000000,
      discountRate: 0.15,
      numberOfSessions: 16,
      modeAvailable: 'offline',
      isActive: true,
    },
  })
  console.log('Created course:', course3.name)

  const course4 = await prisma.course.create({
    data: {
      name: 'English for Business',
      description: 'Bahasa Inggris bisnis untuk profesional. Belajar email formal, presentasi, negosiasi, dan komunikasi kantor.',
      basePrice: 600000,
      discountRate: 0.05,
      numberOfSessions: 10,
      modeAvailable: 'both',
      isActive: true,
    },
  })
  console.log('Created course:', course4.name)

  const course5 = await prisma.course.create({
    data: {
      name: 'Trial Class',
      description: 'Coba kelas gratis selama 1 sesi untuk merasakan pengalaman belajar di English Sepulang Kerja.',
      basePrice: 150000,
      discountRate: 1,
      numberOfSessions: 1,
      modeAvailable: 'both',
      isActive: true,
    },
  })
  console.log('Created course:', course5.name)

  console.log('Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
    await pool.end()
  })