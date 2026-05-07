export type ActionResult<T> = {
  success: boolean
  data?: T
  error?: string
}

export type Course = {
  id: string
  name: string
  description: string
  basePrice: number
  discountRate: number
  numberOfSessions: number
  modeAvailable: 'online' | 'offline' | 'both'
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export type Student = {
  id: string
  name: string
  phone: string
  selectedCourseId: string | null
  mode: 'online' | 'offline'
  referralCode: string | null
  status: 'aktif' | 'tidak_aktif' | 'trial'
  notes: string | null
  createdAt: Date
  updatedAt: Date
}

export type Schedule = {
  id: string
  courseId: string
  date: Date
  startTime: Date
  endTime: Date
  meetingNumber: number
  zoomLink: string | null
  mode: 'online' | 'offline'
  notes: string | null
  createdAt: Date
  updatedAt: Date
}

export type Content = {
  id: string
  section: string
  contentType: 'text' | 'rich_text' | 'json'
  content: string
  imageUrl: string | null
  createdAt: Date
  updatedAt: Date
}

export type Admin = {
  id: string
  email: string
  role: 'admin'
  createdAt: Date
  updatedAt: Date
}

export type WhatsAppConfig = {
  id: string
  adminPhone: string
  messageTemplate: string
  updatedAt: Date
}