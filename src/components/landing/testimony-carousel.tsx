'use client'

import { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'
import { useScrollAnimation } from '@/hooks/use-scroll-animation'
import type { Testimonial } from '@/types'

type TestimonyCarouselProps = {
  testimonials: Testimonial[]
}

function SlideCard({ t, index }: { t: Testimonial; index: number }) {
  const nameInitial = t.name ? t.name.charAt(0) : '?'

  return (
    <div className="embla__slide min-w-0 flex-[0_0_100%]" data-index={index}>
      <div className="bg-white rounded-[20px] border border-[var(--color-border)] p-6 md:p-6 shadow-[var(--shadow-md)] mx-6 md:mx-10 flex flex-col gap-3">
        <p className="text-[var(--color-text-primary)] leading-relaxed italic text-sm md:text-sm line-clamp-4">
          &ldquo;{t.quote}&rdquo;
        </p>

        <div className="flex gap-0.5">
          {Array.from({ length: 5 }, (_, i) => (
            <Star
              key={i}
              className={`w-3.5 h-3.5 ${i < t.rating ? 'text-[#F4C4A6] fill-[#F4C4A6]' : 'text-[var(--color-border)]'}`}
              strokeWidth={1.5}
            />
          ))}
        </div>

        <div className="flex items-center gap-3 mt-auto">
          {t.photoUrl ? (
            <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 relative">
              <Image src={t.photoUrl} alt={t.name} fill className="object-cover" sizes="48px" unoptimized />
            </div>
          ) : (
            <div className="w-12 h-12 rounded-full bg-[var(--color-bg-icon)] flex items-center justify-center flex-shrink-0">
              <span className="font-display font-bold text-[var(--color-text-accent)] text-xs">{nameInitial}</span>
            </div>
          )}
          <div>
            <p className="font-semibold text-[var(--color-text-primary)] text-sm">{t.name}</p>
            <p className="text-xs text-[var(--color-text-secondary)]">{t.origin}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export function TestimonyCarousel({ testimonials }: TestimonyCarouselProps) {
  const { ref: sectionRef, getAnimationStyles } = useScrollAnimation()
  const isCarousel = testimonials.length > 3
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [progress, setProgress] = useState(0)

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: 'center' },
    isCarousel ? [Autoplay({ delay: 3000, stopOnInteraction: true, stopOnMouseEnter: true })] : []
  )

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
    setProgress(0)
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    emblaApi.on('select', onSelect)
    const id = requestAnimationFrame(() => {
      setSelectedIndex(emblaApi.selectedScrollSnap())
    })
    return () => cancelAnimationFrame(id)
  }, [emblaApi, onSelect])

  useEffect(() => {
    if (!emblaApi || !isCarousel) return
    const tick = () => {
      setProgress((p) => {
        if (p >= 100) return 100
        return Math.min(p + 100 / 60 / 3, 100)
      })
    }
    const interval = setInterval(tick, 1000 / 60)
    return () => clearInterval(interval)
  }, [emblaApi, isCarousel])

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  if (testimonials.length === 0) return null

  return (
    <section data-testid="testimony-section" className="max-w-[1100px] mx-auto px-6 py-16 md:py-20">
      <div ref={sectionRef} style={getAnimationStyles()}>
        <h2 className="font-display font-bold text-3xl md:text-4xl text-[var(--color-text-primary)] text-center mb-10">
          Apa Kata Mereka
        </h2>
      </div>

      {isCarousel ? (
        <div className="relative max-w-2xl mx-auto" data-testid="testimony-carousel">
          <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[var(--color-bg-page)] to-transparent z-10 pointer-events-none rounded-l-[20px]" />
          <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[var(--color-bg-page)] to-transparent z-10 pointer-events-none rounded-r-[20px]" />
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {testimonials.map((t, i) => (
                <SlideCard key={t.id} t={t} index={i} />
              ))}
            </div>
          </div>

          <button
            onClick={scrollPrev}
            data-testid="carousel-prev-btn"
            className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border border-[var(--color-border)] shadow-[var(--shadow-sm)] flex items-center justify-center text-[var(--color-text-secondary)] hover:text-[var(--color-text-accent)] hover:border-[var(--color-border-strong)] transition-all cursor-pointer z-20"
            aria-label="Sebelumnya"
          >
            <ChevronLeft className="w-5 h-5" strokeWidth={1.5} />
          </button>
          <button
            onClick={scrollNext}
            data-testid="carousel-next-btn"
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border border-[var(--color-border)] shadow-[var(--shadow-sm)] flex items-center justify-center text-[var(--color-text-secondary)] hover:text-[var(--color-text-accent)] hover:border-[var(--color-border-strong)] transition-all cursor-pointer z-20"
            aria-label="Selanjutnya"
          >
            <ChevronRight className="w-5 h-5" strokeWidth={1.5} />
          </button>

          <div className="flex flex-col items-center gap-2 mt-6">
            <div className="flex gap-2" role="tablist" aria-label="Pilih testimonial">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => emblaApi?.scrollTo(i)}
                  data-testid={`carousel-dot-${i + 1}`}
                  className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                    i === selectedIndex
                      ? 'bg-[var(--color-primary)] w-6'
                      : 'bg-[var(--color-border)] hover:bg-[var(--color-border-strong)]'
                  }`}
                  role="tab"
                  aria-selected={i === selectedIndex}
                  aria-label={`Testimonial ${i + 1}`}
                />
              ))}
            </div>
            <div className="w-48 h-1 rounded-full bg-[var(--color-border)] overflow-hidden">
              <div
                className="h-full bg-[var(--color-primary)] rounded-full transition-[width] duration-100 linear"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      ) : (
        <div
          data-testid="testimony-static"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto"
        >
          {testimonials.map((t) => (
            <SlideCard key={t.id} t={t} index={0} />
          ))}
        </div>
      )}
    </section>
  )
}
