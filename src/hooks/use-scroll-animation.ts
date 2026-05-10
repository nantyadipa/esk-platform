'use client'

import { useEffect, useRef, useState, useSyncExternalStore } from 'react'

type UseScrollAnimationOptions = {
  threshold?: number
  rootMargin?: string
  staggerDelay?: number
}

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    (onStoreChange) => {
      const mql = window.matchMedia('(prefers-reduced-motion: reduce)')
      mql.addEventListener('change', onStoreChange)
      return () => mql.removeEventListener('change', onStoreChange)
    },
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    () => true
  )
}

export function useScrollAnimation<T extends HTMLElement = HTMLDivElement>({
  threshold = 0.1,
  rootMargin = '0px 0px -50px 0px',
  staggerDelay = 80,
}: UseScrollAnimationOptions = {}) {
  const ref = useRef<T>(null)
  const [isVisible, setIsVisible] = useState(false)
  const prefersReducedMotion = usePrefersReducedMotion()

  const hydrated = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  )

  useEffect(() => {
    if (prefersReducedMotion) return

    const el = ref.current
    if (!el) return

    let mounted = true
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && mounted) {
          setIsVisible(true)
          observer.unobserve(el)
        }
      },
      { threshold, rootMargin }
    )

    observer.observe(el)
    return () => {
      mounted = false
      observer.disconnect()
    }
  }, [threshold, rootMargin, prefersReducedMotion])

  const getAnimationStyles = (index = 0): React.CSSProperties => {
    if (!hydrated || prefersReducedMotion || isVisible) {
      return {}
    }
    const delay = index * staggerDelay
    return {
      opacity: 0,
      transform: 'translateY(20px)',
      transition: `opacity 500ms cubic-bezier(0.0, 0.0, 0.2, 1.0) ${delay}ms, transform 500ms cubic-bezier(0.0, 0.0, 0.2, 1.0) ${delay}ms`,
    }
  }

  return { ref, isVisible, getAnimationStyles }
}
