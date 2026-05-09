import { z } from 'zod'

export const registrationFormSchema = z.object({
  name: z.string().min(1, 'Nama tidak boleh kosong'),
  phone: z.string().min(8, 'No. WhatsApp tidak valid').max(15, 'No. WhatsApp tidak valid'),
  selectedClass: z.string().min(1, 'Pilih kelas terlebih dahulu'),
  mode: z.enum(['online', 'offline'], { message: 'Pilih mode kelas' }),
  referralCode: z.string().optional(),
})

export type RegistrationFormData = z.infer<typeof registrationFormSchema>

export const courseSchema = z.object({
  name: z.string().min(1, 'Nama kursus tidak boleh kosong'),
  description: z.string().min(1, 'Deskripsi tidak boleh kosong'),
  basePrice: z.coerce.number().min(0, 'Harga tidak valid'),
  discountRate: z.coerce.number().min(0).max(1, 'Diskon tidak valid'),
  numberOfSessions: z.coerce.number().int().min(1, 'Jumlah pertemuan minimal 1'),
  modeAvailable: z.enum(['online', 'offline', 'both']),
  isActive: z.boolean().optional().default(true),
})

export type CourseFormData = z.infer<typeof courseSchema>

export const studentSchema = z.object({
  name: z.string().min(1, 'Nama tidak boleh kosong'),
  phone: z.string().min(8, 'No. WhatsApp tidak valid'),
  selectedCourseId: z.string().min(1, 'Pilih kursus terlebih dahulu'),
  mode: z.enum(['online', 'offline']),
  status: z.enum(['aktif', 'tidak_aktif', 'trial']),
  referralCode: z.string().optional(),
  notes: z.string().optional(),
})

export type StudentFormData = z.infer<typeof studentSchema>

export const scheduleSchema = z.object({
  courseId: z.string().min(1, 'Pilih kursus terlebih dahulu'),
  date: z.coerce.date(),
  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
  meetingNumber: z.coerce.number().int().min(1),
  zoomLink: z.string().optional(),
  mode: z.enum(['online', 'offline']),
  notes: z.string().optional(),
  studentIds: z.array(z.string()).min(1, 'Pilih minimal 1 siswa'),
})

export type ScheduleFormData = z.infer<typeof scheduleSchema>