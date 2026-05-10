'use client'

import Image from 'next/image'
import { CalendarClock, Award, BadgePercent, FileCheck } from 'lucide-react'
import { useScrollAnimation } from '@/hooks/use-scroll-animation'
import type { CompanyImage } from '@/types'

type CompanyProfileProps = {
  images: CompanyImage[]
}

const valueProps = [
  {
    icon: CalendarClock,
    title: 'Jadwal Fleksibel',
    desc: 'Atur jadwal belajar sesuai waktu luangmu. Tersedia kelas sore dan malam hari.',
  },
  {
    icon: Award,
    title: 'Pengajar Berpengalaman',
    desc: 'Diajar oleh tutor profesional dengan pengalaman mengajar minimal 5 tahun.',
  },
  {
    icon: BadgePercent,
    title: 'Biaya Terjangkau',
    desc: 'Harga kursus kompetitif dengan diskon spesial. Kualitas terbaik, harga terbaik.',
  },
  {
    icon: FileCheck,
    title: 'Sertifikat Resmi',
    desc: 'Dapatkan sertifikat kelulusan yang recognized setelah menyelesaikan program.',
  },
]

function ValuePropCard({ icon: Icon, title, desc, index }: { icon: typeof CalendarClock; title: string; desc: string; index: number }) {
  const { ref, getAnimationStyles } = useScrollAnimation()

  return (
    <div
      ref={ref}
      data-testid={`company-value-card-${index + 1}`}
      className="bg-white rounded-[16px] border border-[var(--color-border)] p-6 text-center hover:shadow-[var(--shadow-md)] hover:-translate-y-1 transition-all duration-250"
      style={getAnimationStyles(index * 80)}
    >
      <div className="w-16 h-16 rounded-full bg-[var(--color-bg-icon)] flex items-center justify-center mx-auto mb-4 shadow-[inset_0_0_0_1px_rgba(183,110,121,0.08)]">
        <Icon className="w-8 h-8 text-[var(--color-text-accent)]" strokeWidth={1.5} />
      </div>
      <h3 className="font-display font-bold text-lg text-[var(--color-text-primary)] mb-2">
        {title}
      </h3>
      <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
        {desc}
      </p>
    </div>
  )
}

export function CompanyProfile({ images }: CompanyProfileProps) {
  const { ref: sectionRef, getAnimationStyles } = useScrollAnimation()

  return (
    <section data-testid="company-profile-section" className="max-w-[1100px] mx-auto px-6 py-16 md:py-20">
      <div ref={sectionRef} style={getAnimationStyles()}>
        <h2 className="font-display font-bold text-3xl md:text-4xl text-[var(--color-text-primary)] text-center mb-4">
          Tentang ESK
        </h2>
        <p className="text-[var(--color-text-secondary)] text-center max-w-2xl mx-auto mb-10 leading-relaxed">
          English Sepulang Kerja adalah platform les bahasa Inggris yang dirancang khusus untuk para profesional, mahasiswa, dan
          siapa saja yang ingin meningkatkan kemampuan bahasa Inggris tanpa mengganggu aktivitas utama. Kami percaya belajar bahasa
          Inggris harus fleksibel, terjangkau, dan menyenangkan.
        </p>
      </div>

      {images.length > 0 && (
        <div className="mb-14" data-testid="company-gallery">
          <div className="flex flex-col lg:flex-row gap-4 items-start">
            <div className="grid grid-cols-2 gap-3 flex-1">
              {images.slice(0, 2).map((img, i) => (
                <div
                  key={img.id}
                  data-testid={`company-photo-${i + 1}`}
                  className="relative rounded-[16px] overflow-hidden aspect-square bg-[var(--color-bg-tinted)] shadow-[var(--shadow-sm)]"
                >
                  <Image
                    src={img.url}
                    alt={img.altText}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 50vw, 25vw"
                    unoptimized
                  />
                </div>
              ))}
            </div>
            <div className="flex-1 bg-white rounded-[16px] border border-[var(--color-border)] p-6 shadow-[var(--shadow-sm)]">
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                Kami percaya belajar bahasa Inggris harus fleksibel, terjangkau, dan menyenangkan.
                Dengan pengajar berpengalaman dan metode yang terstruktur, ESK siap membantu kamu
                mencapai tujuan bahasa Inggrismu — tanpa harus mengorbankan waktu kerja atau kuliah.
              </p>
            </div>
          </div>
          {images.length > 2 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              {images.slice(2).map((img, i) => (
                <div
                  key={img.id}
                  data-testid={`company-photo-${i + 3}`}
                  className="relative rounded-[16px] overflow-hidden aspect-[16/9] bg-[var(--color-bg-tinted)] shadow-[var(--shadow-sm)]"
                >
                  <Image
                    src={img.url}
                    alt={img.altText}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 50vw, 25vw"
                    unoptimized
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {valueProps.map((prop, i) => (
          <ValuePropCard key={prop.title} {...prop} index={i} />
        ))}
      </div>
    </section>
  )
}
