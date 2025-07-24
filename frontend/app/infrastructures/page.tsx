"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"
import {
  Anchor,
  Ship,
  Package,
  Truck,
  Warehouse,
  ChevronRight,
  Plus,
  Minus,
  Download,
  ArrowRight,
  Play,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
// import { MainNavigation } from "@/components/main-navigation" // Removed
// import { DecorativeBorder } from "@/components/decorative-border" // Removed

// Quais data
const quais = [
  {
    id: "quai-commerce",
    name: "Quai de Commerce",
    description: "Quai principal dédié aux activités commerciales et au transport de marchandises diverses.",
    length: "350m",
    depth: "-9m",
    activity: "Commerce général",
    status: "Opérationnel",
    coordinates: { x: 25, y: 35 },
    image: "https://ps1ef2awflipm0dl.public.blob.vercel-storage.com/Pan/24-y0O21jIhM1XpxcKOVQTCHv3ZdP2X7O.png?height=400&width=600",
    details: [
      "Capacité d'accueil: Navires jusqu'à 30 000 tonnes",
      "Équipements: 2 grues mobiles, 4 chariots élévateurs",
      "Trafic annuel: 1,2 million de tonnes",
      "Spécialité: Conteneurs et marchandises diverses",
    ],
  },
  {
    id: "quai-peche",
    name: "Quai de Pêche Industrielle",
    description:
      "Infrastructure spécialisée pour les navires de pêche industrielle avec installations de déchargement rapide.",
    length: "280m",
    depth: "-7m",
    activity: "Pêche industrielle",
    status: "Opérationnel",
    coordinates: { x: 45, y: 25 },
    image: "https://ps1ef2awflipm0dl.public.blob.vercel-storage.com/Pan/22-BjwgaD8NToPko4ZvYc2ynZO0apBCDh.png?height=400&width=600",
    details: [
      "Capacité d'accueil: Chalutiers et navires de pêche",
      "Équipements: Systèmes de déchargement spécialisés",
      "Trafic annuel: 800 000 tonnes de produits de la mer",
      "Spécialité: Traitement et conditionnement des produits de la pêche",
    ],
  },
  {
    id: "quai-petrolier",
    name: "Terminal Pétrolier",
    description: "Terminal spécialisé pour le déchargement des produits pétroliers avec systèmes de sécurité avancés.",
    length: "200m",
    depth: "-12m",
    activity: "Produits pétroliers",
    status: "Opérationnel",
    coordinates: { x: 65, y: 40 },
    image: "https://ps1ef2awflipm0dl.public.blob.vercel-storage.com/Pan/Sequence%2003.00_35_03_17.Still018-sGB6xxRv8cvRWwTvSLjy7MaZKHGOrO.png?height=400&width=600",
    details: [
      "Capacité d'accueil: Pétroliers jusqu'à 50 000 tonnes",
      "Équipements: Bras de chargement, systèmes anti-incendie",
      "Capacité de stockage: 100 000 m³",
      "Spécialité: Hydrocarbures et produits raffinés",
    ],
  },
  
  
]

// Zones de stockage data
const stockageZones = [
  {
    id: "zone-conteneurs",
    name: "Terminal à Conteneurs",
    capacity: "15 000 EVP",
    surface: "80 000 m²",
    type: "Conteneurs",
    services: ["Stockage sécurisé", "Suivi électronique", "Manutention 24/7", "Inspection douanière"],
    image: "https://ps1ef2awflipm0dl.public.blob.vercel-storage.com/Pan/18-ntnAEsuiv7HPMSf4qgjr9to76fqE6b.png?height=400&width=600",
  },
  {
    id: "zone-frigorifique",
    name: "Entrepôts Frigorifiques",
    capacity: "25 000 tonnes",
    surface: "12 000 m²",
    type: "Produits périssables",
    services: [
      "Température contrôlée (-25°C à +5°C)",
      "Traçabilité HACCP",
      "Zones de préparation",
      "Quai de chargement dédié",
    ],
    image: "https://ps1ef2awflipm0dl.public.blob.vercel-storage.com/Pan/frigo-34qB2XLTz6n2AFskdXCMfa1oIRn3NP.png?height=400&width=600",
  },
  
]

// Installations de maintenance data
const maintenanceInstallations = [
  {
    id: "cale-seche",
    name: "Cale Sèche Principale",
    capacity: "Navires jusqu'à 150m",
    services: ["Réparation de coque", "Maintenance moteur", "Peinture industrielle", "Soudure spécialisée"],
    equipment: [
      "Grues 50 tonnes",
      "Équipements de levage",
      "Ateliers spécialisés",
      "Systèmes de nettoyage haute pression",
    ],
    beforeImage: "https://ps1ef2awflipm0dl.public.blob.vercel-storage.com/Pan/DJI_20250321211145_0087_D-APHvzsH2YTMKyZbjyhVjjUT4JS4V0U.JPG?height=400&width=600&text=Avant",
    afterImage: "https://ps1ef2awflipm0dl.public.blob.vercel-storage.com/Pan/DJI_20250321211145_0087_D-APHvzsH2YTMKyZbjyhVjjUT4JS4V0U.JPG?height=400&width=600&text=Après",
  },
  {
    id: "atelier-mecanique",
    name: "Atelier Mécanique Naval",
    capacity: "Maintenance simultanée de 5 navires",
    services: ["Réparation moteurs marins", "Systèmes de propulsion", "Électronique de bord", "Hydraulique marine"],
    equipment: ["Bancs d'essai moteur", "Outillage spécialisé", "Diagnostic électronique", "Pièces détachées"],
    beforeImage: "https://ps1ef2awflipm0dl.public.blob.vercel-storage.com/Pan/Sequence%2003.00_16_05_05.Still006-iBbtFsFgXNkAI59NSRhi6kvuecryv3.png?height=400&width=600&text=Avant",
    afterImage: "https://ps1ef2awflipm0dl.public.blob.vercel-storage.com/Pan/Sequence%2003.00_16_05_05.Still006-iBbtFsFgXNkAI59NSRhi6kvuecryv3.png?height=400&width=600&text=Après",
  },
  {
    id: "chantier-naval",
    name: "Chantier Naval",
    capacity: "Construction de navires jusqu'à 80m",
    services: ["Construction navale", "Rénovation complète", "Conversion de navires", "Allongement de coques"],
    equipment: ["Découpe laser", "Soudure automatisée", "Grues lourdes", "Ateliers de fabrication"],
    beforeImage: "https://ps1ef2awflipm0dl.public.blob.vercel-storage.com/Pan/Sequence%2003.00_16_05_05.Still006-iBbtFsFgXNkAI59NSRhi6kvuecryv3.png?height=400&width=600&text=Avant",
    afterImage: "https://ps1ef2awflipm0dl.public.blob.vercel-storage.com/Pan/Sequence%2003.00_16_05_05.Still006-iBbtFsFgXNkAI59NSRhi6kvuecryv3.png?height=400&width=600&text=Après",
  },
]

// Réseaux logistiques data
const logisticsNetworks = [
  {
    id: "reseau-routier",
    name: "Réseau Routier",
    description: "Connexion directe aux principales routes nationales avec voies dédiées pour poids lourds.",
    details: ["Accès direct à la RN2", "Voies dédiées poids lourds", "Parkings sécurisés", "Stations-service"],
    coordinates: [
      { x: 20, y: 80 },
      { x: 30, y: 70 },
      { x: 40, y: 60 },
      { x: 50, y: 50 },
    ],
  },
  {
    id: "reseau-ferroviaire",
    name: "Réseau Ferroviaire",
    description: "Connexion ferroviaire directe avec le réseau national pour transport de marchandises.",
    details: [
      "Terminal ferroviaire dédié",
      "Connexion au réseau national",
      "Capacité: 20 wagons/jour",
      "Chargement automatisé",
    ],
    coordinates: [
      { x: 60, y: 80 },
      { x: 70, y: 70 },
      { x: 80, y: 60 },
      { x: 90, y: 50 },
    ],
  },
  {
    id: "zone-logistique",
    name: "Zone Logistique Intégrée",
    description:
      "Plateforme multimodale permettant l'optimisation des flux de marchandises entre différents modes de transport.",
    details: ["Surface: 25 000 m²", "Entrepôts modulables", "Services douaniers sur site", "Systèmes de tracking"],
    coordinates: [
      { x: 50, y: 30 },
      { x: 60, y: 35 },
      { x: 70, y: 40 },
      { x: 80, y: 45 },
    ],
  },
]

// Équipements data
const equipments = [
  {
    id: "grues-mobiles",
    name: "Grues Mobiles Portuaires",
    description: "Grues de haute capacité pour le chargement et déchargement rapide des navires.",
    specs: ["Capacité: jusqu'à 150 tonnes", "Portée: 46m", "Hauteur: 42m", "Mobilité complète sur le port"],
    count: 4,
    image: "/placeholder.svg?height=400&width=600",
  },
  {
    id: "portiques",
    name: "Portiques à Conteneurs",
    description: "Portiques spécialisés pour la manutention efficace des conteneurs.",
    specs: ["Capacité: 40 tonnes", "Hauteur: 50m", "Cadence: 30 conteneurs/heure", "Système anti-balancement"],
    count: 3,
    image: "/placeholder.svg?height=400&width=600",
  },
  {
    id: "reachstackers",
    name: "Reach Stackers",
    description: "Équipements mobiles pour la manipulation des conteneurs dans les zones de stockage.",
    specs: ["Capacité: 45 tonnes", "Hauteur de gerbage: 5 conteneurs", "Mobilité tout-terrain", "Cabine ergonomique"],
    count: 6,
    image: "/placeholder.svg?height=400&width=600",
  },
  {
    id: "chariots",
    name: "Chariots Élévateurs",
    description: "Flotte de chariots élévateurs pour la manutention de charges diverses.",
    specs: [
      "Capacité: 2 à 16 tonnes",
      "Hauteur de levage: jusqu'à 6m",
      "Motorisation diesel/électrique",
      "Accessoires spécialisés",
    ],
    count: 15,
    image: "/placeholder.svg?height=400&width=600",
  },
  {
    id: "convoyeurs",
    name: "Systèmes de Convoyeurs",
    description: "Réseaux de convoyeurs pour le transport automatisé des marchandises en vrac.",
    specs: ["Longueur totale: 2,5 km", "Capacité: 2000 tonnes/heure", "Contrôle automatisé", "Systèmes anti-poussière"],
    count: 1,
    image: "/placeholder.svg?height=400&width=600",
  },
]

export default function InfrastructuresPage() {
  const [activeQuai, setActiveQuai] = useState<string | null>(null)
  const [hoveredQuai, setHoveredQuai] = useState<string | null>(null)
  const [selectedStockage, setSelectedStockage] = useState(0)
  const [selectedMaintenance, setSelectedMaintenance] = useState(0)
  const [showBeforeAfter, setShowBeforeAfter] = useState<boolean>(false)
  const [mapZoom, setMapZoom] = useState(1)
  const [selectedEquipment, setSelectedEquipment] = useState(0)
  const [videoPlaying, setVideoPlaying] = useState(false)

  const headerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: headerRef,
    offset: ["start start", "end start"],
  })

  const headerOpacity = useTransform(scrollYProgress, [0, 1], [1, 0])
  const headerY = useTransform(scrollYProgress, [0, 1], [0, 100])

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
      },
    }),
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/*
      <header className="fixed top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo%20PAN%201-Yo8elef7v6SBTT8yebsFH1Ppk8Mxen.png"
              alt="PAN Logo"
              width={120}
              height={50}
              className="h-12 w-auto"
            />
          </Link>

          <div className="flex items-center gap-4">
            <MainNavigation />
            <Button
              variant="default"
              className="bg-[#003366] hover:bg-[#003366]/90 text-white font-medium transition-all duration-300 hover:shadow-md"
            >
              Espace Usagers
            </Button>
          </div>
        </div>
      </header>
      */}

      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <motion.section
          ref={headerRef}
          className="relative h-[60vh] flex items-center justify-center overflow-hidden"
          style={{ opacity: headerOpacity, y: headerY }}
        >
          <div className="absolute inset-0 z-0">
            <Image
              src="https://ps1ef2awflipm0dl.public.blob.vercel-storage.com/Pan/webpan-B2gN32EU4zbwtTtuW6ohMoKcIlAkWb.gif?height=1080&width=1920&text=Port%20Infrastructure"
              alt="Infrastructures portuaires"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-[#003366]/60" />
          </div>

          <div className="container relative z-10 text-center text-white">
            <motion.h1
              className="text-5xl md:text-6xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Infrastructures
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl font-light mb-8 max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              Découvrez les installations modernes et performantes du Port Autonome de Nouadhibou
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="flex flex-wrap justify-center gap-4"
            >
              <Button size="lg" className="bg-[#D4AF37] text-[#003366] hover:bg-white transition-all duration-300">
                Explorer nos infrastructures
                <ChevronRight className="ml-2 w-5 h-5" />
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="border-white text-[#003366] hover:bg-white hover:text-[#003366] transition-all duration-300"
              >
                Télécharger la brochure
                <Download className="ml-2 w-5 h-5" />
              </Button>
            </motion.div>
          </div>
        </motion.section>

        {/* <DecorativeBorder /> */}

        {/* Section 1: Quais et Installations */}
        <section id="quais" className="py-24 bg-[#F5F5F5]">
          <div className="container">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-[#003366] mb-4">Quais et Installations</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Découvrez nos quais spécialisés et installations portuaires conçus pour répondre à tous types de navires
                et de marchandises.
              </p>
            </motion.div>

            {/* Carte interactive */}
            <div className="mb-16">
              <motion.div
                className="relative aspect-[16/9] rounded-xl overflow-hidden shadow-lg border border-gray-200"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
              >
                <Image
                  src="https://ps1ef2awflipm0dl.public.blob.vercel-storage.com/Pan/2020-cf72lQMKtRJQjKSWzadZ6vJt3TCle9.JPG?height=720&width=1280&text=Carte%20du%20Port"
                  alt="Carte du port"
                  fill
                  className="object-cover"
                />

                {/* Points interactifs sur la carte */}
                {quais.map((quai) => (
                  <motion.div
                    key={quai.id}
                    className="absolute"
                    style={{
                      left: `${quai.coordinates.x}%`,
                      top: `${quai.coordinates.y}%`,
                      zIndex: activeQuai === quai.id || hoveredQuai === quai.id ? 10 : 5,
                    }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  >
                    <button
                      className="relative"
                      onMouseEnter={() => setHoveredQuai(quai.id)}
                      onMouseLeave={() => setHoveredQuai(null)}
                      onClick={() => setActiveQuai(quai.id === activeQuai ? null : quai.id)}
                      aria-label={`Voir détails du ${quai.name}`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full border-2 transition-all duration-300 ${
                          activeQuai === quai.id || hoveredQuai === quai.id
                            ? "bg-[#D4AF37] border-white scale-125"
                            : "bg-white border-[#003366]"
                        }`}
                      >
                        <Anchor
                          className={`w-4 h-4 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${
                            activeQuai === quai.id || hoveredQuai === quai.id ? "text-white" : "text-[#003366]"
                          }`}
                        />
                      </div>

                      {/* Ripple effect */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        <span className="absolute w-8 h-8 rounded-full border-2 border-[#D4AF37] animate-ping opacity-75"></span>
                      </div>
                    </button>

                    {/* Info popup */}
                    {(activeQuai === quai.id || hoveredQuai === quai.id) && (
                      <motion.div
                        className="absolute z-20 w-64 bg-white rounded-lg shadow-lg p-4 -translate-x-1/2 -translate-y-full mb-2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                      >
                        <h3 className="font-bold text-[#003366] text-lg">{quai.name}</h3>
                        <div className="flex justify-between text-sm text-gray-600 mt-1 mb-2">
                          <span>Longueur: {quai.length}</span>
                          <span>Profondeur: {quai.depth}</span>
                        </div>
                        <p className="text-sm text-gray-600">{quai.description}</p>
                        <div className="mt-2 pt-2 border-t border-gray-100 flex justify-between items-center">
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full ${
                              quai.status === "Opérationnel"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {quai.status}
                          </span>
                          <button
                            className="text-xs text-[#003366] hover:text-[#D4AF37] transition-colors flex items-center"
                            onClick={(e) => {
                              e.stopPropagation()
                              setActiveQuai(quai.id)
                            }}
                          >
                            Détails <ChevronRight className="w-3 h-3 ml-1" />
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                ))}

                {/* Contrôles de zoom */}
                <div className="absolute bottom-4 right-4 flex flex-col bg-white rounded-lg shadow-md">
                  <button
                    className="p-2 hover:bg-gray-100 transition-colors border-b border-gray-200"
                    onClick={() => setMapZoom(Math.min(mapZoom + 0.2, 2))}
                    aria-label="Zoom in"
                  >
                    <Plus className="w-5 h-5 text-[#003366]" />
                  </button>
                  <button
                    className="p-2 hover:bg-gray-100 transition-colors"
                    onClick={() => setMapZoom(Math.max(mapZoom - 0.2, 0.6))}
                    aria-label="Zoom out"
                  >
                    <Minus className="w-5 h-5 text-[#003366]" />
                  </button>
                </div>

                {/* Légende */}
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-md">
                  <h4 className="text-sm font-bold text-[#003366] mb-2">Légende</h4>
                  <div className="flex items-center text-xs text-gray-700 mb-1">
                    <div className="w-3 h-3 rounded-full bg-[#D4AF37] mr-2"></div>
                    <span>Quai actif</span>
                  </div>
                  <div className="flex items-center text-xs text-gray-700">
                    <div className="w-3 h-3 rounded-full bg-white border border-[#003366] mr-2"></div>
                    <span>Quai disponible</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Détails des quais */}
            <AnimatePresence>
              {activeQuai && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mb-16 overflow-hidden"
                >
                  <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    {quais.map(
                      (quai) =>
                        quai.id === activeQuai && (
                          <div key={quai.id} className="grid md:grid-cols-2 gap-6">
                            <div className="relative aspect-video">
                              <Image
                                src={quai.image || "/placeholder.svg"}
                                alt={quai.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="p-6">
                              <h3 className="text-2xl font-bold text-[#003366] mb-2">{quai.name}</h3>
                              <p className="text-gray-600 mb-4">{quai.description}</p>

                              <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="bg-[#F5F5F5] p-3 rounded-lg">
                                  <h4 className="text-sm font-bold text-[#003366] mb-1">Longueur</h4>
                                  <p className="text-lg">{quai.length}</p>
                                </div>
                                <div className="bg-[#F5F5F5] p-3 rounded-lg">
                                  <h4 className="text-sm font-bold text-[#003366] mb-1">Profondeur</h4>
                                  <p className="text-lg">{quai.depth}</p>
                                </div>
                                <div className="bg-[#F5F5F5] p-3 rounded-lg">
                                  <h4 className="text-sm font-bold text-[#003366] mb-1">Activité</h4>
                                  <p className="text-lg">{quai.activity}</p>
                                </div>
                                <div className="bg-[#F5F5F5] p-3 rounded-lg">
                                  <h4 className="text-sm font-bold text-[#003366] mb-1">Statut</h4>
                                  <p
                                    className={`text-lg ${
                                      quai.status === "Opérationnel" ? "text-green-600" : "text-yellow-600"
                                    }`}
                                  >
                                    {quai.status}
                                  </p>
                                </div>
                              </div>

                              <h4 className="text-lg font-bold text-[#003366] mb-3">Caractéristiques</h4>
                              <ul className="space-y-2">
                                {quai.details.map((detail, index) => (
                                  <li key={index} className="flex items-start">
                                    <ChevronRight className="w-5 h-5 text-[#D4AF37] mr-2 shrink-0 mt-0.5" />
                                    <span>{detail}</span>
                                  </li>
                                ))}
                              </ul>

                              <div className="mt-6 flex justify-end">
                                <Button
                                  className="bg-[#003366] hover:bg-[#003366]/80 text-white"
                                  onClick={() => setActiveQuai(null)}
                                >
                                  Fermer
                                </Button>
                              </div>
                            </div>
                          </div>
                        ),
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Liste des quais */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={containerVariants}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {quais.map((quai, index) => (
                <motion.div
                  key={quai.id}
                  custom={index}
                  variants={cardVariants}
                  whileHover={{ y: -10, transition: { duration: 0.2 } }}
                  className="h-full"
                >
                  <Card className="h-full overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="relative h-48">
                      <Image src={quai.image || "/placeholder.svg"} alt={quai.name} fill className="object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="text-xl font-bold text-white">{quai.name}</h3>
                      </div>
                    </div>

                    <CardContent className="p-6">
                      <div className="flex justify-between text-sm text-gray-600 mb-4">
                        <span>Longueur: {quai.length}</span>
                        <span>Profondeur: {quai.depth}</span>
                      </div>

                      <p className="text-gray-600 mb-4 line-clamp-2">{quai.description}</p>

                      <div className="flex justify-between items-center">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            quai.status === "Opérationnel"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {quai.status}
                        </span>

                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-[#003366] hover:text-[#D4AF37] p-0"
                          onClick={() => setActiveQuai(quai.id)}
                        >
                          Détails <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* <DecorativeBorder /> */}

        {/* Section 2: Zones de stockage et entrepôts */}
        <section id="stockage" className="py-24 bg-white">
          <div className="container">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-[#003366] mb-4">Zones de stockage et entrepôts</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Découvrez nos installations de stockage modernes et sécurisées, adaptées à tous types de marchandises.
              </p>
            </motion.div>

            {/* Infographie capacité totale */}
            <motion.div
              className="mb-16 bg-[#F5F5F5] rounded-xl p-8 shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-2xl font-bold text-[#003366] text-center mb-8">Capacité totale de stockage</h3>

              <div className="grid md:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg p-6 text-center shadow-md">
                  <div className="w-16 h-16 rounded-full bg-[#003366]/10 flex items-center justify-center text-[#003366] mx-auto mb-4">
                    <Package className="w-8 h-8" />
                  </div>
                  <div className="text-3xl font-bold text-[#D4AF37]">15 000</div>
                  <div className="text-sm text-gray-600">EVP Conteneurs</div>
                </div>

                <div className="bg-white rounded-lg p-6 text-center shadow-md">
                  <div className="w-16 h-16 rounded-full bg-[#003366]/10 flex items-center justify-center text-[#003366] mx-auto mb-4">
                    <Warehouse className="w-8 h-8" />
                  </div>
                  <div className="text-3xl font-bold text-[#D4AF37]">172 000</div>
                  <div className="text-sm text-gray-600">m² Surface totale</div>
                </div>

                <div className="bg-white rounded-lg p-6 text-center shadow-md">
                  <div className="w-16 h-16 rounded-full bg-[#003366]/10 flex items-center justify-center text-[#003366] mx-auto mb-4">
                    <Ship className="w-8 h-8" />
                  </div>
                  <div className="text-3xl font-bold text-[#D4AF37]">125 000</div>
                  <div className="text-sm text-gray-600">Tonnes Vrac</div>
                </div>

                <div className="bg-white rounded-lg p-6 text-center shadow-md">
                  <div className="w-16 h-16 rounded-full bg-[#003366]/10 flex items-center justify-center text-[#003366] mx-auto mb-4">
                    <Truck className="w-8 h-8" />
                  </div>
                  <div className="text-3xl font-bold text-[#D4AF37]">80 000</div>
                  <div className="text-sm text-gray-600">m³ Liquides</div>
                </div>
              </div>
            </motion.div>

            {/* Zones de stockage */}
            <div className="grid md:grid-cols-2 gap-8 mb-16">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="relative aspect-square rounded-xl overflow-hidden shadow-lg">
                  <Image
                    src={stockageZones[selectedStockage].image || "/placeholder.svg"}
                    alt={stockageZones[selectedStockage].name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="text-2xl font-bold mb-2">{stockageZones[selectedStockage].name}</h3>
                    <div className="flex justify-between text-white/90 mb-2">
                      <span>Capacité: {stockageZones[selectedStockage].capacity}</span>
                      <span>Surface: {stockageZones[selectedStockage].surface}</span>
                    </div>
                    <p className="text-white/80">Type: {stockageZones[selectedStockage].type}</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="h-full flex flex-col">
                  <h3 className="text-2xl font-bold text-[#003366] mb-6">Services disponibles</h3>

                  <div className="bg-[#F5F5F5] rounded-xl p-6 flex-grow">
                    <ul className="space-y-4">
                      {stockageZones[selectedStockage].services.map((service, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-start"
                        >
                          <div className="w-8 h-8 rounded-full bg-[#D4AF37] flex items-center justify-center text-white shrink-0 mr-4">
                            <Check className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-medium">{service}</p>
                          </div>
                        </motion.li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-6">
                    <h4 className="text-lg font-bold text-[#003366] mb-4">Sélectionner une zone de stockage</h4>
                    <div className="flex flex-wrap gap-2">
                      {stockageZones.map((zone, index) => (
                        <button
                          key={zone.id}
                          className={`px-4 py-2 rounded-lg transition-all ${
                            selectedStockage === index
                              ? "bg-[#003366] text-white"
                              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                          }`}
                          onClick={() => setSelectedStockage(index)}
                        >
                          {zone.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Carte des zones de stockage */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              <div className="p-6 bg-[#003366] text-white">
                <h3 className="text-xl font-bold">Carte des zones de stockage</h3>
                <p className="text-white/80">Localisez nos différentes zones de stockage sur le plan du port</p>
              </div>

              <div className="relative aspect-[21/9]">
                <Image
                  src="https://ps1ef2awflipm0dl.public.blob.vercel-storage.com/Pan/Sequence%2003.00_16_05_05.Still006-x1MOJJCZu8L4FEl481GyhT4vvCHRkJ.png?height=500&width=1000&text=Carte%20des%20zones%20de%20stockage"
                  alt="Carte des zones de stockage"
                  fill
                  className="object-cover"
                />

                {/* Points interactifs sur la carte */}
                {stockageZones.map((zone, index) => (
                  <button
                    key={zone.id}
                    className={`absolute w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                      selectedStockage === index
                        ? "bg-[#D4AF37] text-white scale-125"
                        : "bg-white text-[#003366] border-2 border-[#003366]"
                    }`}
                    style={{
                      left: `${20 + index * 15}%`,
                      top: `${30 + (index % 2) * 20}%`,
                    }}
                    onClick={() => setSelectedStockage(index)}
                    aria-label={`Sélectionner ${zone.name}`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* <DecorativeBorder /> */}

        {/* Section 3: Installations de maintenance et chantiers navals */}
        <section id="maintenance" className="py-24 bg-[#F5F5F5]">
          <div className="container">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-[#003366] mb-4">
                Installations de maintenance et chantiers navals
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Découvrez nos infrastructures dédiées à la maintenance et à la réparation navale, équipées des
                technologies les plus avancées.
              </p>
            </motion.div>

            {/* Installations de maintenance */}
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              {maintenanceInstallations.map((installation, index) => (
                <motion.div
                  key={installation.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`rounded-xl overflow-hidden shadow-lg border-2 transition-all ${
                    selectedMaintenance === index
                      ? "border-[#D4AF37] scale-105 shadow-xl"
                      : "border-transparent hover:border-[#003366]/30"
                  }`}
                  onClick={() => setSelectedMaintenance(index)}
                >
                  <div className="relative h-48">
                    <Image
                      src={showBeforeAfter ? installation.beforeImage : installation.afterImage}
                      alt={installation.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-xl font-bold text-white">{installation.name}</h3>
                    </div>
                  </div>

                  <div className="p-6 bg-white">
                    <p className="text-sm text-gray-600 mb-4">Capacité: {installation.capacity}</p>

                    <h4 className="font-bold text-[#003366] mb-2">Services proposés:</h4>
                    <ul className="space-y-1 mb-4">
                      {installation.services.slice(0, 2).map((service, i) => (
                        <li key={i} className="flex items-start text-sm">
                          <ChevronRight className="w-4 h-4 text-[#D4AF37] mr-1 shrink-0 mt-0.5" />
                          <span>{service}</span>
                        </li>
                      ))}
                      {installation.services.length > 2 && (
                        <li className="text-sm text-[#003366] italic">
                          + {installation.services.length - 2} autres services
                        </li>
                      )}
                    </ul>

                    <div className="flex justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-[#003366] border-[#003366] hover:bg-[#003366] hover:text-white"
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedMaintenance(index)
                          setShowBeforeAfter(!showBeforeAfter)
                        }}
                      >
                        {showBeforeAfter ? "Voir Après" : "Voir Avant"}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Détails de l'installation sélectionnée */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              <div className="grid md:grid-cols-2">
                <div className="relative">
                  <div className="relative aspect-square">
                    <Image
                      src={maintenanceInstallations[selectedMaintenance].afterImage || "/placeholder.svg"}
                      alt={maintenanceInstallations[selectedMaintenance].name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="absolute inset-0 flex items-center justify-center">
                    <Button
                      className="bg-[#D4AF37]/80 hover:bg-[#D4AF37] text-white"
                      onClick={() => setVideoPlaying(true)}
                    >
                      <Play className="w-5 h-5 mr-2" />
                      Voir la vidéo
                    </Button>
                  </div>
                </div>

                <div className="p-8">
                  <h3 className="text-2xl font-bold text-[#003366] mb-4">
                    {maintenanceInstallations[selectedMaintenance].name}
                  </h3>

                  <div className="mb-6">
                    <h4 className="font-bold text-[#003366] mb-2">Capacité</h4>
                    <p className="text-gray-600">{maintenanceInstallations[selectedMaintenance].capacity}</p>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-bold text-[#003366] mb-2">Services proposés</h4>
                    <ul className="space-y-2">
                      {maintenanceInstallations[selectedMaintenance].services.map((service, index) => (
                        <li key={index} className="flex items-start">
                          <ChevronRight className="w-5 h-5 text-[#D4AF37] mr-2 shrink-0 mt-0.5" />
                          <span>{service}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-bold text-[#003366] mb-2">Équipements disponibles</h4>
                    <ul className="space-y-2">
                      {maintenanceInstallations[selectedMaintenance].equipment.map((equipment, index) => (
                        <li key={index} className="flex items-start">
                          <ChevronRight className="w-5 h-5 text-[#D4AF37] mr-2 shrink-0 mt-0.5" />
                          <span>{equipment}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-8 flex justify-end">
                    <Button className="bg-[#003366] hover:bg-[#003366]/80 text-white">
                      Demander un devis
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Modal vidéo */}
            <AnimatePresence>
              {videoPlaying && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
                  onClick={() => setVideoPlaying(false)}
                >
                  <motion.div
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0.9 }}
                    className="relative max-w-5xl w-full aspect-video bg-black"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="w-full h-full flex items-center justify-center">
                      <Image
                        src="/placeholder.svg?height=720&width=1280&text=Vidéo%20de%20maintenance"
                        alt="Vidéo de maintenance"
                        width={1280}
                        height={720}
                        className="max-w-full max-h-full"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Play className="w-16 h-16 text-white/50" />
                      </div>
                    </div>
                    <button
                      onClick={() => setVideoPlaying(false)}
                      className="absolute top-4 right-4 text-white hover:text-gray-300 bg-black/50 rounded-full p-2"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* <DecorativeBorder /> */}

        {/* Section 4: Réseaux routiers, ferroviaires et accès logistiques */}
        <section id="reseaux" className="py-24 bg-white">
          <div className="container">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-[#003366] mb-4">
                Réseaux routiers et accès logistiques
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Découvrez les connexions logistiques du port avec les réseaux routiers et ferroviaires pour un transport
                fluide des marchandises.
              </p>
            </motion.div>

            {/* Carte des réseaux */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-16"
            >
              <div className="relative aspect-[21/9] rounded-xl overflow-hidden shadow-lg">
                <Image
                  src="https://ps1ef2awflipm0dl.public.blob.vercel-storage.com/Pan/R%C3%A9seaux%20routiers-YYyP8oYaX9skaq9Yfquch1RB4yXWNm.JPG?height=500&width=1000&text=Carte%20des%20réseaux%20logistiques"
                  alt="Carte des réseaux logistiques"
                  fill
                  className="object-cover"
                />

                {/* Lignes animées pour les réseaux */}
                <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  {logisticsNetworks.map((network) => (
                    <motion.path
                      key={network.id}
                      d={`M${network.coordinates.map((c) => `${c.x},${c.y}`).join(" L")}`}
                      fill="none"
                      stroke={network.id === "reseau-routier" ? "#D4AF37" : "#003366"}
                      strokeWidth="3"
                      initial={{ pathLength: 0, opacity: 0 }}
                      whileInView={{ pathLength: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 2, ease: "easeInOut" }}
                    />
                  ))}
                </svg>

                {/* Légende */}
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-md">
                  <h4 className="text-sm font-bold text-[#003366] mb-2">Légende</h4>
                  <div className="flex items-center text-xs text-gray-700 mb-1">
                    <div className="w-4 h-1 bg-[#D4AF37] mr-2"></div>
                    <span>Réseau routier</span>
                  </div>
                  <div className="flex items-center text-xs text-gray-700">
                    <div className="w-4 h-1 bg-[#003366] mr-2"></div>
                    <span>Réseau ferroviaire</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Réseaux logistiques */}
            <div className="grid md:grid-cols-3 gap-8">
              {logisticsNetworks.map((network, index) => (
                <motion.div
                  key={network.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="h-full overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="p-6 bg-[#003366] text-white">
                      <h3 className="text-xl font-bold">{network.name}</h3>
                    </div>

                    <CardContent className="p-6">
                      <p className="text-gray-600 mb-6">{network.description}</p>

                      <h4 className="font-bold text-[#003366] mb-3">Caractéristiques</h4>
                      <ul className="space-y-2">
                        {network.details.map((detail, i) => (
                          <li key={i} className="flex items-start">
                            <ChevronRight className="w-5 h-5 text-[#D4AF37] mr-2 shrink-0 mt-0.5" />
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* <DecorativeBorder /> */}

        {/* Section 5: Outils et équipements disponibles */}
        <section id="equipements" className="py-24 bg-[#F5F5F5]">
          <div className="container">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-[#003366] mb-4">Outils et équipements disponibles</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Découvrez notre parc d'équipements modernes pour la manutention et le transport des marchandises.
              </p>
            </motion.div>

            {/* Équipement sélectionné */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-16"
            >
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="grid md:grid-cols-2">
                  <div className="relative aspect-square">
                    <Image
                      src={equipments[selectedEquipment].image || "/placeholder.svg"}
                      alt={equipments[selectedEquipment].name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-4 right-4 bg-[#D4AF37] text-white px-3 py-1 rounded-full text-sm font-bold">
                      {equipments[selectedEquipment].count} unités
                    </div>
                  </div>

                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-[#003366] mb-4">{equipments[selectedEquipment].name}</h3>
                    <p className="text-gray-600 mb-6">{equipments[selectedEquipment].description}</p>

                    <h4 className="font-bold text-[#003366] mb-3">Spécifications techniques</h4>
                    <ul className="space-y-2 mb-8">
                      {equipments[selectedEquipment].specs.map((spec, index) => (
                        <li key={index} className="flex items-start">
                          <ChevronRight className="w-5 h-5 text-[#D4AF37] mr-2 shrink-0 mt-0.5" />
                          <span>{spec}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="flex justify-end">
                      <Button className="bg-[#003366] hover:bg-[#003366]/80 text-white">
                        Télécharger la fiche technique
                        <Download className="ml-2 w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Liste des équipements */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {equipments.map((equipment, index) => (
                <motion.button
                  key={equipment.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className={`relative rounded-lg overflow-hidden aspect-square shadow-md ${
                    selectedEquipment === index ? "ring-4 ring-[#D4AF37]" : "hover:ring-2 hover:ring-[#003366]/50"
                  }`}
                  onClick={() => setSelectedEquipment(index)}
                >
                  <Image
                    src={equipment.image || "/placeholder.svg"}
                    alt={equipment.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <h4 className="text-sm font-bold text-white">{equipment.name}</h4>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-[#003366]">
          <div className="container">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl font-bold text-white mb-4">Besoin d'informations supplémentaires?</h2>
                <p className="text-white/80 mb-6">
                  Notre équipe est à votre disposition pour répondre à toutes vos questions concernant nos
                  infrastructures et services.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button className="bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-[#003366] font-medium">
                    Nous contacter
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                  <Button variant="outline" className="border-white text-[#003366] hover:bg-white hover:text-[#003366]">
                    Télécharger la brochure
                    <Download className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative h-64 rounded-xl overflow-hidden"
              >
                <Image
                  src="https://ps1ef2awflipm0dl.public.blob.vercel-storage.com/Pan/webpan-B2gN32EU4zbwtTtuW6ohMoKcIlAkWb.gif?height=400&width=600&text=Port%20Autonome%20de%20Nouadhibou"
                  alt="Port Autonome de Nouadhibou"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <Button
                    className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white"
                    onClick={() => setVideoPlaying(true)}
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Voir la vidéo de présentation
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      {/*
      <footer className="border-t bg-gray-50">
        <div className="container py-12">
          <div className="grid gap-8 lg:grid-cols-4">
            <div className="space-y-4">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo%20PAN%201-Yo8elef7v6SBTT8yebsFH1Ppk8Mxen.png"
                alt="PAN Logo"
                width={120}
                height={50}
                className="h-12 w-auto"
              />
              <p className="text-sm text-gray-500">
                Port Autonome de Nouadhibou
                <br />
                BP 5, Nouadhibou
                <br />
                Mauritanie
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Services</h3>
              <ul className="space-y-2 text-sm text-gray-500">
                <li>Amarrage</li>
                <li>Navigation</li>
                <li>Manutention</li>
                <li>Logistique</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Informations</h3>
              <ul className="space-y-2 text-sm text-gray-500">
                <li>Tarifs</li>
                <li>Horaires</li>
                <li>Réglementations</li>
                <li>FAQ</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-sm text-gray-500">
                <li>Tél: +222 45 74 51 11</li>
                <li>Email: contact@pan.mr</li>
                <li>Urgences: +222 45 74 51 12</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-gray-500">
            <p>© {new Date().getFullYear()} Port Autonome de Nouadhibou. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
      */}
    </div>
  )
}

// Check component for the list items
const Check = ({ className }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}
