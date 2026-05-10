'use client'

import { useState } from 'react'
import { Sparkles } from 'lucide-react'
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
      <section id="harga-kelas" data-testid="courses-section" className="max-w-[1100px] mx-auto px-6 py-16 md:py-20">
        <div className="text-center mb-10">
          <h3 className="font-display font-bold text-3xl md:text-4xl text-[var(--color-text-primary)] mb-3">
            Harga & Kelas
          </h3>
          <div className="flex items-center justify-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-[var(--color-primary)]" strokeWidth={1.5} />
            <p className="text-[var(--color-text-secondary)]">
              Pilih kelas yang sesuai dengan kebutuhanmu.
            </p>
            <Sparkles className="w-4 h-4 text-[var(--color-primary)]" strokeWidth={1.5} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeCourses.map((course, i) => (
            <div
              key={course.id}
              className={`animate-[fadeSlideUp_500ms_cubic-bezier(0.0,0.0,0.2,1.0)_${i * 80}ms_both]`}
            >
              <CourseCard
                id={course.id}
                name={course.name}
                description={course.description}
                basePrice={course.basePrice}
                discountRate={course.discountRate}
                numberOfSessions={course.numberOfSessions}
                modeAvailable={course.modeAvailable}
                onSelect={handleSelectCourse}
                isFeatured={i === 0}
              />
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <button
            data-testid="open-registration-form"
            onClick={handleOpenFormBlank}
            className="inline-flex items-center gap-2 bg-[var(--color-primary)] text-white px-8 py-4 rounded-full text-base font-semibold shadow-[var(--shadow-cta)] hover:bg-[var(--color-primary-dark)] hover:shadow-[var(--shadow-cta-lg)] hover:-translate-y-0.5 hover:scale-[1.02] transition-all cursor-pointer"
          >
            Daftar Sekarang
            <span aria-hidden="true">&rarr;</span>
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
