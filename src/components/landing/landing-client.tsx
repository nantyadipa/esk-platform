'use client'

import { useState } from 'react'
import { CourseCard } from './course-card'
import { RegistrationForm } from './registration-form'

type Course = {
  id: string
  name: string
  description: string
  basePrice: number
  discountRate: number
  numberOfSessions: number
  modeAvailable: 'online' | 'offline' | 'both'
  isActive: boolean
}

type LandingClientProps = {
  courses: Course[]
}

export function LandingClient({ courses }: LandingClientProps) {
  const [showForm, setShowForm] = useState(false)
  const [selectedCourseName, setSelectedCourseName] = useState<string | undefined>()

  const activeCourses = courses.filter((c) => c.isActive)

  const handleSelectCourse = (_courseId: string, courseName: string) => {
    setSelectedCourseName(courseName)
    setShowForm(true)
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setSelectedCourseName(undefined)
  }

  const handleOpenFormBlank = () => {
    setSelectedCourseName(undefined)
    setShowForm(true)
  }

  return (
    <>
      <section id="harga-kelas" data-testid="courses-section" className="max-w-[1100px] mx-auto px-6 py-12">
        <h3 className="font-display font-bold text-2xl text-[var(--color-text-primary)] mb-2 text-center">
          Harga & Kelas
        </h3>
        <p className="text-center text-[var(--color-text-secondary)] mb-8">
          Pilih kelas yang sesuai dengan kebutuhanmu.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeCourses.map((course) => (
            <CourseCard
              key={course.id}
              id={course.id}
              name={course.name}
              description={course.description}
              basePrice={course.basePrice}
              discountRate={course.discountRate}
              numberOfSessions={course.numberOfSessions}
              modeAvailable={course.modeAvailable}
              onSelect={handleSelectCourse}
            />
          ))}
        </div>

        <div className="text-center mt-8">
          <button
            data-testid="open-registration-form"
            onClick={handleOpenFormBlank}
            className="inline-flex items-center gap-2 bg-[var(--color-primary)] text-white px-8 py-4 rounded-full text-base font-semibold shadow-[var(--shadow-cta)] hover:bg-[var(--color-primary-dark)] hover:shadow-[var(--shadow-cta-lg)] hover:-translate-y-0.5 transition-all cursor-pointer"
          >
            Daftar Sekarang
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </section>

      {showForm && (
        <RegistrationForm
          courses={activeCourses.map((c) => ({ id: c.id, name: c.name }))}
          selectedCourseName={selectedCourseName}
          onClose={handleCloseForm}
        />
      )}
    </>
  )
}