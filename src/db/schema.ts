import { pgTable, pgEnum, uuid, text, numeric, integer, boolean, timestamp, unique } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

export const modeAvailable = pgEnum('ModeAvailable', ['online', 'offline', 'both'])
export const studentMode = pgEnum('StudentMode', ['online', 'offline'])
export const studentStatus = pgEnum('StudentStatus', ['aktif', 'tidak_aktif', 'trial'])
export const scheduleMode = pgEnum('ScheduleMode', ['online', 'offline'])
export const contentType = pgEnum('ContentType', ['text', 'rich_text', 'json'])
export const adminRole = pgEnum('AdminRole', ['admin'])

export const courses = pgTable('Course', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  basePrice: numeric('basePrice', { precision: 10, scale: 0 }).notNull(),
  discountRate: numeric('discountRate', { precision: 3, scale: 2 }).default('0').notNull(),
  numberOfSessions: integer('numberOfSessions').notNull(),
  modeAvailable: modeAvailable('modeAvailable').default('both').notNull(),
  isActive: boolean('isActive').default(true).notNull(),
  createdAt: timestamp('createdAt', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updatedAt', { withTimezone: true }).defaultNow().notNull(),
})

export const coursesRelations = relations(courses, ({ many }) => ({
  students: many(students),
  schedules: many(schedules),
}))

export const students = pgTable('Student', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  phone: text('phone').notNull(),
  selectedCourseId: uuid('selectedCourseId').references(() => courses.id),
  mode: studentMode('mode').default('online').notNull(),
  referralCode: text('referralCode'),
  status: studentStatus('status').default('aktif').notNull(),
  notes: text('notes'),
  createdAt: timestamp('createdAt', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updatedAt', { withTimezone: true }).defaultNow().notNull(),
})

export const studentsRelations = relations(students, ({ one, many }) => ({
  selectedCourse: one(courses, {
    fields: [students.selectedCourseId],
    references: [courses.id],
  }),
  schedules: many(scheduleStudents),
}))

export const schedules = pgTable('Schedule', {
  id: uuid('id').primaryKey().defaultRandom(),
  courseId: uuid('courseId').notNull().references(() => courses.id),
  date: timestamp('date', { withTimezone: true }).notNull(),
  startTime: timestamp('startTime', { withTimezone: true }).notNull(),
  endTime: timestamp('endTime', { withTimezone: true }).notNull(),
  meetingNumber: integer('meetingNumber').notNull(),
  zoomLink: text('zoomLink'),
  mode: scheduleMode('mode').default('online').notNull(),
  notes: text('notes'),
  createdAt: timestamp('createdAt', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updatedAt', { withTimezone: true }).defaultNow().notNull(),
})

export const schedulesRelations = relations(schedules, ({ one, many }) => ({
  course: one(courses, {
    fields: [schedules.courseId],
    references: [courses.id],
  }),
  students: many(scheduleStudents),
}))

export const scheduleStudents = pgTable('ScheduleStudent', {
  id: uuid('id').primaryKey().defaultRandom(),
  scheduleId: uuid('scheduleId').notNull().references(() => schedules.id, { onDelete: 'cascade' }),
  studentId: uuid('studentId').notNull().references(() => students.id, { onDelete: 'cascade' }),
}, (t) => [
  unique().on(t.scheduleId, t.studentId),
])

export const scheduleStudentsRelations = relations(scheduleStudents, ({ one }) => ({
  schedule: one(schedules, {
    fields: [scheduleStudents.scheduleId],
    references: [schedules.id],
  }),
  student: one(students, {
    fields: [scheduleStudents.studentId],
    references: [students.id],
  }),
}))

export const contents = pgTable('Content', {
  id: uuid('id').primaryKey().defaultRandom(),
  section: text('section').notNull(),
  contentType: contentType('contentType').default('rich_text').notNull(),
  content: text('content').notNull(),
  imageUrl: text('imageUrl'),
  createdAt: timestamp('createdAt', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updatedAt', { withTimezone: true }).defaultNow().notNull(),
})

export const admins = pgTable('Admin', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  passwordHash: text('passwordHash').notNull(),
  role: adminRole('role').default('admin').notNull(),
  createdAt: timestamp('createdAt', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updatedAt', { withTimezone: true }).defaultNow().notNull(),
})

export const whatsappConfigs = pgTable('WhatsAppConfig', {
  id: uuid('id').primaryKey().defaultRandom(),
  adminPhone: text('adminPhone').notNull(),
  messageTemplate: text('messageTemplate').notNull(),
  updatedAt: timestamp('updatedAt', { withTimezone: true }).defaultNow().notNull(),
})
