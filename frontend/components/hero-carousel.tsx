"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { heroApi } from "@/lib/api"

type HeroSlide = {
  id: number
  title: string
  description: string
  link_button: string
  image_path: string
}

export const HeroCarousel = () => {
  const [slides, setSlides] = useState<HeroSlide[]>([])
  const [current, setCurrent] = useState(0)
  const [autoplay, setAutoplay] = useState(true)
  const [isLoading, setIsLoading] = useState(true)

  // Helper function to safely construct image URL
  const getImageUrl = (imagePath: string | null | undefined) => {
    if (!imagePath || imagePath === 'null' || imagePath === 'undefined' || imagePath === '') {
      return "/placeholder.svg"
    }
    try {
      // Add /uploads/ prefix if the imagePath doesn't start with /
      const path = imagePath.startsWith('/') ? imagePath : `/uploads/${imagePath}`
      const url = `http://localhost:5000${path}`
      new URL(url) // Validate URL
      return url
    } catch (error) {
      return "/placeholder.svg"
    }
  }

  // Load hero data from backend
  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const data = await heroApi.getAll()
        console.log('Hero carousel data loaded:', data)
        setSlides(data)
        if (data.length > 0) {
          setCurrent(0)
        }
        setIsLoading(false)
      } catch (error) {
        console.error('Error loading hero data:', error)
        setIsLoading(false)
      }
    }

    fetchHeroData()
  }, [])

  useEffect(() => {
    if (!autoplay || slides.length === 0) return
    const timer = setInterval(() => {
      setCurrent((current) => (current === slides.length - 1 ? 0 : current + 1))
    }, 5000)
    return () => clearInterval(timer)
  }, [autoplay, slides.length])

  const previousSlide = () => {
    if (slides.length === 0) return
    setCurrent(current === 0 ? slides.length - 1 : current - 1)
    setAutoplay(false)
  }

  const nextSlide = () => {
    if (slides.length === 0) return
    setCurrent(current === slides.length - 1 ? 0 : current + 1)
    setAutoplay(false)
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="relative h-screen w-full overflow-hidden bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#008A3C] mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du carrousel...</p>
        </div>
      </div>
    )
  }

  // Show empty state
  if (slides.length === 0) {
    return (
      <div className="relative h-screen w-full overflow-hidden bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-xl">Aucun slide disponible</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          className="absolute inset-0"
        >
          <Image
            src={getImageUrl(slides[current].image_path)}
            alt={slides[current].title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-4">
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-5xl md:text-7xl font-bold mb-4"
            >
              {slides[current].title}
            </motion.h1>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-lg md:text-xl mb-8 max-w-2xl"
            >
              {slides[current].description}
            </motion.p>
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.9 }}>
              <Button 
                size="lg" 
                className="bg-[#008A3C] hover:bg-[#008A3C]/90 text-white px-8"
                onClick={() => window.open(slides[current].link_button, '_blank')}
              >
                En savoir plus
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Controls */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrent(index)
              setAutoplay(false)
            }}
            className={`w-3 h-3 rounded-full transition-all ${
              index === current ? "bg-white scale-125" : "bg-white/50"
            }`}
          />
        ))}
      </div>

      <button
        onClick={previousSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </div>
  )
}
