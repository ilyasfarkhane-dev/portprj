"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { histoireApi } from "@/lib/api"

type HistoireEvent = {
  id: number
  title: string
  description: string
  periode: string
  image_path: string
}

export const PortStory = () => {
  const [events, setEvents] = useState<HistoireEvent[]>([])
  const [selectedEvent, setSelectedEvent] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  // Helper for image URL
  const getImageUrl = (imagePath: string | null | undefined) => {
    if (!imagePath || imagePath === 'null' || imagePath === 'undefined' || imagePath === '') {
      return "/placeholder.svg"
    }
    try {
      const path = imagePath.startsWith('/') ? imagePath : `/uploads/${imagePath}`
      const url = `http://localhost:5000${path}`
      new URL(url)
      return url
    } catch {
      return "/placeholder.svg"
    }
  }

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await histoireApi.getAll()
        setEvents(data)
        setSelectedEvent(0)
      } catch (error) {
        setEvents([])
      } finally {
        setIsLoading(false)
      }
    }
    fetchEvents()
  }, [])

  if (isLoading) {
    return (
      <section className="py-24 relative overflow-hidden">
        <div className="container flex items-center justify-center min-h-[300px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#008A3C] mx-auto mb-4"></div>
          <span className="ml-2 text-gray-600">Chargement de l'histoire...</span>
        </div>
      </section>
    )
  }

  if (events.length === 0) {
    return (
      <section className="py-24 relative overflow-hidden">
        <div className="container text-center text-gray-500 text-xl">Aucun événement trouvé dans l'histoire du port.</div>
      </section>
    )
  }

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center space-y-4 mb-12"
        >
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Notre Histoire</h2>
          <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
            Plus de 60 ans d&apos;excellence maritime au service du développement
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div className="space-y-9">
            {events.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <Card
                  className={`p-6 cursor-pointer transition-all hover:shadow-lg ${
                    selectedEvent === index ? "border-[#004F9E] bg-blue-50/50" : ""
                  }`}
                  onClick={() => setSelectedEvent(index)}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-2xl font-bold text-[#004F9E]">{event.periode}</span>
                    <div>
                      <h3 className="font-semibold">{event.title}</h3>
                      <p className="text-gray-500">{event.description}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="sticky top-24">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedEvent}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="relative aspect-[4/3] rounded-lg overflow-hidden"
              >
                <Image
                  src={getImageUrl(events[selectedEvent].image_path)}
                  alt={`Port de Nouadhibou en ${events[selectedEvent].periode}`}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <div className="font-bold text-xl mb-2">{events[selectedEvent].periode}</div>
                  <p className="text-white/90">{events[selectedEvent].description}</p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
