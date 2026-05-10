import type { InferSelectModel } from 'drizzle-orm'
import type { courses, students, schedules, contents, admins, whatsappConfigs, companyImages, testimonials } from '@/db/schema'

export type ActionResult<T> = {
  success: boolean
  data?: T
  error?: string
}

export type Course = InferSelectModel<typeof courses>
export type Student = InferSelectModel<typeof students>
export type Schedule = InferSelectModel<typeof schedules>
export type Content = InferSelectModel<typeof contents>
export type Admin = InferSelectModel<typeof admins>
export type WhatsAppConfig = InferSelectModel<typeof whatsappConfigs>
export type CompanyImage = InferSelectModel<typeof companyImages>
export type Testimonial = InferSelectModel<typeof testimonials>
