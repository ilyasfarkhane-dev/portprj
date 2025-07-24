"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { infrastructureApi } from "@/lib/api"

const infrastructurePoints = [
  {
    id: "quai-1",
    title: "Terminal Conteneurs",
    description: "Capacité de 500,000 EVP par an",
    x: 30,
    y: 40,
  },
  {
    id: "quai-2",
    title: "Terminal Vraquier",
    description: "Profondeur de 14 mètres",
    x: 50,
    y: 60,
  },
  {
    id: "quai-3",
    title: "Terminal Pêche",
    description: "Zone dédiée à la pêche industrielle",
    x: 70,
    y: 30,
  },
  {
    id: "zone-1",
    title: "Zone de Stockage",
    description: "50,000 m² d'espace de stockage",
    x: 45,
    y: 35,
  },
  {
    id: "zone-3",
    title: "Zone Maintenance",
    description: "Ateliers et services techniques",
    x: 55,
    y: 55,
  },
]

export const InfrastructureMap = () => {
  const [selectedPoint, setSelectedPoint] = useState<string | null>(null)
  const [hoveredPoint, setHoveredPoint] = useState<string | null>(null)
  const [mapImageUrl, setMapImageUrl] = useState<string>("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMapImage = async () => {
      try {
        setLoading(true)
        console.log('Fetching map data from backend...')
        const data = await infrastructureApi.get()
        console.log('Fetched map data:', data)
        console.log('Data type:', typeof data)
        console.log('Data keys:', Object.keys(data || {}))
        
        if (data && data.image_path) {
          const fullImageUrl = `http://localhost:5000/uploads/${data.image_path}`
          console.log('Setting map image URL to:', fullImageUrl)
          setMapImageUrl(fullImageUrl)
        } else {
          console.log('No image_path found in data')
        }
      } catch (err) {
        console.error('Error fetching map image:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchMapImage()
  }, [])

  if (loading) {
    return (
      <section className="py-24 bg-gray-50">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center space-y-4 mb-12"
          >
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Nos Infrastructures</h2>
            <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
              Découvrez nos installations portuaires modernes
            </p>
          </motion.div>
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-500">Chargement de la carte...</div>
          </div>
        </div>
      </section>
    )
  }

  if (!mapImageUrl) {
    return (
      <section className="py-24 bg-gray-50">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center space-y-4 mb-12"
          >
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Nos Infrastructures</h2>
            <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
              Découvrez nos installations portuaires modernes
            </p>
          </motion.div>
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-500">Aucune image de carte disponible</div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-24 bg-gray-50">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center space-y-4 mb-12"
        >
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Nos Infrastructures</h2>
          <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
            Découvrez nos installations portuaires modernes
          </p>
        </motion.div>

        <div className="relative aspect-[16/9] rounded-lg overflow-hidden">
          {console.log('Rendering map with image URL:', mapImageUrl)}
          <Image
            src={mapImageUrl}
            alt="Carte du port"
            fill
            className="object-cover"
          />
          {infrastructurePoints.map((point) => (
            <motion.div
              key={point.id}
              className="absolute"
              style={{ left: `${point.x}%`, top: `${point.y}%` }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
              <button
                className="relative"
                onMouseEnter={() => setHoveredPoint(point.id)}
                onMouseLeave={() => setHoveredPoint(null)}
                onClick={() => setSelectedPoint(point.id === selectedPoint ? null : point.id)}
              >
                <div
                  className={`w-6 h-6 rounded-full border-2 transition-all duration-300 ${
                    selectedPoint === point.id || hoveredPoint === point.id
                      ? "bg-[#004F9E] border-white scale-125"
                      : "bg-white border-[#004F9E]"
                  }`}
                />

                {/* Ripple effect */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <span className="animate-ripple" />
                  <span className="animate-ripple delay-300" />
                </div>
              </button>

              {(selectedPoint === point.id || hoveredPoint === point.id) && (
                <Card className="absolute z-10 p-4 w-64 -translate-x-1/2 -translate-y-full mb-2">
                  <h3 className="font-semibold text-[#004F9E]">{point.title}</h3>
                  <p className="text-sm text-gray-500">{point.description}</p>
                </Card>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
