"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Calendar, FileText, Play } from "lucide-react"
import Image from "next/image"
import { mediaApi, multimediaApi } from "@/lib/api"

interface MediaItem {
  id: number
  title: string
  description: string
  periode: string
  image_path: string
  created_at?: string
  updated_at?: string
}

interface MultimediaItem {
  id: number
  title: string
  file_path: string
  file_type: 'image' | 'video'
  created_at: string
  updated_at: string
}

export const NewsMediaSection = () => {
  const [activeNews, setActiveNews] = useState(0)
  const [selectedMedia, setSelectedMedia] = useState<number | null>(null)
  const [news, setNews] = useState<MediaItem[]>([])
  const [multimediaItems, setMultimediaItems] = useState<MultimediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMultimedia, setLoadingMultimedia] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [multimediaError, setMultimediaError] = useState<string | null>(null)

  // Fetch media data from backend
  useEffect(() => {
    const fetchMedia = async () => {
      try {
        setLoading(true)
        setError(null)
        console.log('Fetching media from backend for news section...')
        const data = await mediaApi.getAll()
        console.log('Fetched media data for news section:', data)
        setNews(data)
      } catch (err) {
        console.error('Error fetching media for news section:', err)
        setError(err instanceof Error ? err.message : 'Erreur lors du chargement des données')
      } finally {
        setLoading(false)
      }
    }

    fetchMedia()
  }, [])

  // Fetch multimedia data from backend
  useEffect(() => {
    const fetchMultimedia = async () => {
      try {
        setLoadingMultimedia(true)
        setMultimediaError(null)
        console.log('Fetching multimedia from backend for gallery section...')
        const data = await multimediaApi.getAll()
        console.log('Fetched multimedia data for gallery section:', data)
        setMultimediaItems(data)
      } catch (err) {
        console.error('Error fetching multimedia for gallery section:', err)
        setMultimediaError(err instanceof Error ? err.message : 'Erreur lors du chargement des données multimedia')
      } finally {
        setLoadingMultimedia(false)
      }
    }

    fetchMultimedia()
  }, [])

  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return '/placeholder.svg?height=400&width=600'
    
    // If the path already starts with /uploads/, use it as is
    if (imagePath.startsWith('/uploads/')) {
      return `http://localhost:5000${imagePath}`
    }
    
    // Otherwise, add the /uploads/ prefix
    return `http://localhost:5000/uploads/${imagePath}`
  }

  const getMultimediaUrl = (filePath: string) => {
    if (!filePath) return '/placeholder.svg?height=400&width=600'
    
    // If the path already starts with /uploads/, use it as is
    if (filePath.startsWith('/uploads/')) {
      return `http://localhost:5000${filePath}`
    }
    
    // Otherwise, add the /uploads/ prefix
    return `http://localhost:5000/uploads/${filePath}`
  }

  if (loading) {
    return (
      <section className="py-24 relative overflow-hidden">
        <div className="container relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center space-y-4 mb-16"
          >
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Actualités et Médias</h2>
            <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
              Restez informé des dernières actualités et événements du Port Autonome de Nouadhibou
            </p>
          </motion.div>
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-500">Chargement des actualités...</div>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-24 relative overflow-hidden">
        <div className="container relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center space-y-4 mb-16"
          >
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Actualités et Médias</h2>
            <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
              Restez informé des dernières actualités et événements du Port Autonome de Nouadhibou
            </p>
          </motion.div>
          <div className="flex justify-center items-center h-64">
            <div className="text-red-500">Erreur: {error}</div>
          </div>
        </div>
      </section>
    )
  }

  if (news.length === 0) {
    return (
      <section className="py-24 relative overflow-hidden">
        <div className="container relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center space-y-4 mb-16"
          >
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Actualités et Médias</h2>
            <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
              Restez informé des dernières actualités et événements du Port Autonome de Nouadhibou
            </p>
          </motion.div>
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-500">Aucune actualité disponible</div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Animated circles */}
        <motion.div
          className="absolute w-[800px] h-[800px] rounded-full bg-[#004F9E]/5"
          style={{
            top: "-400px",
            left: "-200px",
          }}
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full bg-[#008A3C]/5"
          style={{
            bottom: "-300px",
            right: "-100px",
          }}
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 15,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />

        {/* Animated lines */}
        <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
          <motion.path
            d="M0,100 Q300,150 600,100 T1200,100"
            fill="none"
            stroke="#FFD700"
            strokeWidth="2"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
          <motion.path
            d="M0,200 Q300,250 600,200 T1200,200"
            fill="none"
            stroke="#004F9E"
            strokeWidth="2"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{
              duration: 4,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
              delay: 1,
            }}
          />
        </svg>

        {/* Floating dots */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-[#FFD700]"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: 0.2,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="container relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center space-y-4 mb-16"
        >
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Actualités et Médias</h2>
          <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
            Restez informé des dernières actualités et événements du Port Autonome de Nouadhibou
          </p>
        </motion.div>

        {/* News Carousel */}
        <div className="relative mb-16">
          <div className="overflow-hidden rounded-lg shadow-xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeNews}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                className="relative aspect-[21/9]"
              >
                <Image
                  src={getImageUrl(news[activeNews].image_path)}
                  alt={news[activeNews].title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <div className="flex items-center gap-2 text-white/80 mb-2">
                    <FileText className="w-5 h-5" />
                    <span>{news[activeNews].periode}</span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">{news[activeNews].title}</h3>
                  <p className="text-white/90 max-w-2xl">{news[activeNews].description}</p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <button
            onClick={() => setActiveNews((prev) => (prev === 0 ? news.length - 1 : prev - 1))}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors"
            aria-label="Article précédent"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={() => setActiveNews((prev) => (prev === news.length - 1 ? 0 : prev + 1))}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors"
            aria-label="Article suivant"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Media Gallery */}
        <div className="relative backdrop-blur-sm bg-white/50 p-8 rounded-xl">
          <h3 className="text-2xl font-bold mb-6">Galerie Multimédia</h3>
          
          {loadingMultimedia ? (
            <div className="flex justify-center items-center h-32">
              <div className="text-gray-500">Chargement de la galerie multimedia...</div>
            </div>
          ) : multimediaError ? (
            <div className="flex justify-center items-center h-32">
              <div className="text-red-500">Erreur: {multimediaError}</div>
            </div>
          ) : multimediaItems.length === 0 ? (
            <div className="flex justify-center items-center h-32">
              <div className="text-gray-500">Aucun multimedia disponible</div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {multimediaItems.map((media) => (
                <motion.div
                  key={media.id}
                  whileHover={{ scale: 1.05 }}
                  className="relative aspect-video rounded-lg overflow-hidden cursor-pointer shadow-lg"
                  onClick={() => setSelectedMedia(media.id)}
                >
                  {media.file_type === "video" ? (
                    // For videos, show video thumbnail with play button overlay
                    <div className="relative w-full h-full">
                      <video 
                        src={getMultimediaUrl(media.file_path)}
                        className="w-full h-full object-cover"
                        muted
                        preload="metadata"
                        onLoadedData={(e) => {
                          // Set the current time to 1 second to get a thumbnail
                          e.currentTarget.currentTime = 1
                        }}
                        onError={(e) => {
                          console.error('Error loading video thumbnail:', media.file_path)
                          // Fallback to placeholder if video fails to load
                          const container = e.currentTarget.parentElement
                          if (container) {
                            container.innerHTML = `
                              <div class="w-full h-full bg-gray-200 flex items-center justify-center">
                                <div class="text-center">
                                  <div class="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center mx-auto mb-2">
                                    <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                      <path d="M8 5v10l8-5-8-5z"/>
                                    </svg>
                                  </div>
                                  <p class="text-xs text-gray-600">${media.title}</p>
                                </div>
                              </div>
                            `
                          }
                        }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                        <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                          <Play className="w-6 h-6 text-blue-600" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    // For images, show the actual image
                    <Image 
                      src={getMultimediaUrl(media.file_path)} 
                      alt={media.title} 
                      fill 
                      className="object-cover"
                      onError={(e) => {
                        console.error('Error loading multimedia image:', media.file_path)
                        e.currentTarget.src = '/placeholder.svg?height=400&width=600'
                      }}
                    />
                  )}
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <p className="text-white font-medium">{media.title}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Media Lightbox */}
        <AnimatePresence>
          {selectedMedia && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
              onClick={() => setSelectedMedia(null)}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="relative max-w-5xl w-full aspect-video"
                onClick={(e) => e.stopPropagation()}
              >
                {(() => {
                  const selectedItem = multimediaItems.find((m) => m.id === selectedMedia)
                  if (!selectedItem) return null
                  
                  if (selectedItem.file_type === "video") {
                    return (
                      <video 
                        controls 
                        className="w-full h-full object-contain"
                        src={getMultimediaUrl(selectedItem.file_path)}
                      >
                        Votre navigateur ne supporte pas la lecture de vidéos.
                      </video>
                    )
                  } else {
                    return (
                      <Image
                        src={getMultimediaUrl(selectedItem.file_path)}
                        alt={selectedItem.title}
                        fill
                        className="object-contain"
                        onError={(e) => {
                          console.error('Error loading multimedia image in lightbox:', selectedItem.file_path)
                          e.currentTarget.src = '/placeholder.svg?height=400&width=600'
                        }}
                      />
                    )
                  }
                })()}
                
                <button
                  onClick={() => setSelectedMedia(null)}
                  className="absolute top-4 right-4 text-white hover:text-gray-300 bg-black/50 rounded-full w-8 h-8 flex items-center justify-center"
                >
                  ✕
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
