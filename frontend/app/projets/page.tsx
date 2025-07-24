"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import {
  Calendar,
  Clock,
  Building,
  ChevronRight,
  ArrowRight,
  Play,
  Download,
  Layers,
  Ship,
  Database,
  Cog,
  Zap,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Projets en cours data
const currentProjects = [
  {
    id: "quai-commerce",
    name: "Réhabilitation du quai de commerce et de sa digue d'accès",
    objective: "Modernisation et renforcement des équipements",
    startDate: "Avril 2025",
    duration: "15 mois",
    executor: "China Road and Bridge Corporation (CRBC)",
    progress: 35,
    image: "/placeholder.svg?height=400&width=600&text=Quai%20de%20Commerce",
    details: [
      "Renforcement de la structure du quai pour accueillir des navires de plus grande capacité",
      "Rénovation complète de la digue d'accès pour améliorer la sécurité",
      "Installation de nouveaux équipements de manutention",
      "Modernisation des réseaux électriques et hydrauliques",
    ],
  },
  {
    id: "terminal-conteneurs",
    name: "Extension du terminal à conteneurs",
    objective: "Augmentation de la capacité de stockage et de traitement",
    startDate: "Janvier 2025",
    duration: "24 mois",
    executor: "Port Engineering Consortium",
    progress: 15,
    image: "/placeholder.svg?height=400&width=600&text=Terminal%20Conteneurs",
    details: [
      "Création de 5 hectares supplémentaires de surface de stockage",
      "Installation de 2 nouveaux portiques de quai",
      "Mise en place d'un système de gestion automatisé des conteneurs",
      "Construction d'un nouveau poste à quai de 350 mètres",
    ],
  },
  {
    id: "dragage-chenal",
    name: "Dragage et élargissement du chenal d'accès",
    objective: "Amélioration de l'accessibilité pour les grands navires",
    startDate: "Mars 2025",
    duration: "12 mois",
    executor: "Dredging International",
    progress: 20,
    image: "/placeholder.svg?height=400&width=600&text=Dragage%20Chenal",
    details: [
      "Approfondissement du chenal à -14 mètres",
      "Élargissement à 200 mètres pour faciliter les manœuvres",
      "Sécurisation des berges et installation de nouveaux systèmes de balisage",
      "Mise en place d'un système de surveillance en temps réel des profondeurs",
    ],
  },
  {
    id: "zone-logistique",
    name: "Développement de la zone logistique intégrée",
    objective: "Création d'une plateforme logistique multimodale",
    startDate: "Septembre 2025",
    duration: "30 mois",
    executor: "Mauritanian Development Consortium",
    progress: 5,
    image: "/placeholder.svg?height=400&width=600&text=Zone%20Logistique",
    details: [
      "Construction d'entrepôts modernes sur une surface de 25 hectares",
      "Mise en place d'une connexion ferroviaire directe",
      "Création d'un centre de services pour les transporteurs",
      "Installation d'un système de gestion intégrée des flux logistiques",
    ],
  },
]

// Projets futurs data
const futureProjects = [
  {
    id: "quai-profond",
    name: "Quai profond (-12m CM)",
    image: "/placeholder.svg?height=400&width=600&text=Quai%20Profond",
    objective: "Accueillir des navires de grande capacité, éliminer le transbordement en rade",
    planning: "Études techniques prévues en 2025",
    impact: "Augmentation du trafic maritime, réduction des coûts de logistique",
    icon: <Ship className="w-10 h-10" />,
  },
  {
    id: "digitalisation",
    name: "Digitalisation des services portuaires",
    image: "/placeholder.svg?height=400&width=600&text=Digitalisation",
    objective: "Automatisation de la gestion des escales, facturation en ligne, suivi des cargaisons",
    planning: "Lancement du programme en 2025",
    impact: "Simplification des processus, gain de temps pour les clients",
    icon: <Database className="w-10 h-10" />,
  },
  {
    id: "modernisation",
    name: "Modernisation des services portuaires",
    image: "/placeholder.svg?height=400&width=600&text=Modernisation",
    objective: "Création de nouvelles infrastructures, optimisation des opérations portuaires",
    planning: "Études et mise en œuvre entre 2025 et 2026",
    impact: "Amélioration de la logistique portuaire, réduction des délais d'attente",
    icon: <Cog className="w-10 h-10" />,
  },
  {
    id: "energie-verte",
    name: "Transition énergétique du port",
    image: "/placeholder.svg?height=400&width=600&text=Energie%20Verte",
    objective: "Installation de panneaux solaires, électrification des quais, réduction de l'empreinte carbone",
    planning: "Déploiement progressif 2025-2028",
    impact: "Réduction de 40% des émissions de CO2, économies d'énergie significatives",
    icon: <Zap className="w-10 h-10" />,
  },
]

// Données pour la vidéo de présentation
const presentationVideo = {
  title: "Vision stratégique 2025-2030",
  description:
    "Découvrez les grands axes de développement du Port Autonome de Nouadhibou pour les 5 prochaines années.",
  thumbnail: "/placeholder.svg?height=720&width=1280&text=Vidéo%20Présentation",
  duration: "3:45",
}

// Decorative Border component
const DecorativeBorder = () => <div className="border-b border-gray-200 my-8" />

export default function ProjetsPage() {
  const [activeProject, setActiveProject] = useState<string | null>(null)
  const [timelineProgress, setTimelineProgress] = useState(0)
  const [videoPlaying, setVideoPlaying] = useState(false)
  const [flippedCards, setFlippedCards] = useState<string[]>([])
  const [selectedTab, setSelectedTab] = useState("en-cours")

  const timelineRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress: timelineScrollProgress } = useScroll({
    target: timelineRef,
    offset: ["start end", "end start"],
  })

  const { scrollYProgress: headerScrollProgress } = useScroll({
    target: headerRef,
    offset: ["start start", "end start"],
  })

  const headerOpacity = useTransform(headerScrollProgress, [0, 1], [1, 0])
  const headerY = useTransform(headerScrollProgress, [0, 1], [0, 100])

  // Update timeline progress based on scroll
  useEffect(() => {
    const unsubscribe = timelineScrollProgress.onChange((v) => {
      setTimelineProgress(v * 100)
    })
    return () => unsubscribe()
  }, [timelineScrollProgress])

  // Toggle card flip
  const toggleCardFlip = (id: string) => {
    setFlippedCards((prev) => (prev.includes(id) ? prev.filter((cardId) => cardId !== id) : [...prev, id]))
  }

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
      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <motion.section
          ref={headerRef}
          className="relative h-[60vh] flex items-center justify-center overflow-hidden"
          style={{ opacity: headerOpacity, y: headerY }}
        >
          <div className="absolute inset-0 z-0">
            <Image
              src="/placeholder.svg?height=1080&width=1920&text=Projets%20et%20Développements"
              alt="Projets et Développements"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-[#003366]/70" />
          </div>

          <div className="container relative z-10 text-center text-white">
            <motion.h1
              className="text-5xl md:text-6xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Projets & Développements
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl font-light mb-8 max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              Découvrez les projets qui façonnent l'avenir du Port Autonome de Nouadhibou
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="flex flex-wrap justify-center gap-4"
            >
              <Button
                size="lg"
                className="bg-[#D4AF37] text-[#003366] hover:bg-white transition-all duration-300 group"
                onClick={() => {
                  document.getElementById("travaux-en-cours")?.scrollIntoView({ behavior: "smooth" })
                }}
              >
                <span className="relative">
                  Découvrir nos projets
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#003366] group-hover:w-full transition-all duration-300"></span>
                </span>
                <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-[#003366] transition-all duration-300"
                onClick={() => setVideoPlaying(true)}
              >
                <Play className="mr-2 w-5 h-5" />
                Voir la présentation
              </Button>
            </motion.div>
          </div>
        </motion.section>

        <DecorativeBorder />

        {/* Navigation Tabs */}
        <section className="py-8 bg-[#F5F5F5]">
          <div className="container">
            <Tabs defaultValue="en-cours" className="w-full" onValueChange={setSelectedTab}>
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="en-cours" className="text-lg">
                  Travaux en cours
                </TabsTrigger>
                <TabsTrigger value="futurs" className="text-lg">
                  Projets futurs
                </TabsTrigger>
              </TabsList>

              <TabsContent value="en-cours">
                {/* Section 1: Travaux en cours */}
                <section id="travaux-en-cours" className="py-12">
                  <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeIn}
                    className="text-center mb-16"
                  >
                    <h2 className="text-3xl md:text-4xl font-bold text-[#003366] mb-4">Travaux en cours</h2>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                      Découvrez les projets actuellement en développement pour moderniser et étendre les capacités du
                      port.
                    </p>
                  </motion.div>

                  {/* Timeline interactive */}
                  <div ref={timelineRef} className="relative mb-16">
                    {/* Timeline progress bar */}
                    <div className="absolute left-0 right-0 top-1/2 h-1 bg-gray-200 -translate-y-1/2">
                      <motion.div className="h-full bg-[#D4AF37]" style={{ width: `${timelineProgress}%` }} />
                    </div>

                    {/* Timeline projects */}
                    <div className="relative flex justify-between items-center">
                      {currentProjects.map((project, index) => (
                        <motion.div
                          key={project.id}
                          className="relative"
                          initial={{ opacity: 0, scale: 0.8 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.2 }}
                        >
                          <button
                            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                              activeProject === project.id
                                ? "bg-[#D4AF37] text-white scale-125 shadow-lg"
                                : "bg-white text-[#003366] border-2 border-[#003366] hover:border-[#D4AF37]"
                            }`}
                            onClick={() => setActiveProject(project.id === activeProject ? null : project.id)}
                            aria-label={`Voir détails du projet ${project.name}`}
                          >
                            {index + 1}
                          </button>

                          <div className="absolute top-16 left-1/2 -translate-x-1/2 whitespace-nowrap font-medium text-sm text-[#003366]">
                            {project.startDate}
                          </div>

                          {/* Progress indicator */}
                          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-16">
                            <div className="text-xs text-center text-[#003366] font-bold">{project.progress}%</div>
                            <Progress value={project.progress} className="h-2" />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Project details */}
                  <AnimatePresence>
                    {activeProject && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mb-16 overflow-hidden"
                      >
                        {currentProjects.map(
                          (project) =>
                            project.id === activeProject && (
                              <div key={project.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                                <div className="grid md:grid-cols-2 gap-6">
                                  <div className="relative aspect-video">
                                    <Image
                                      src={project.image || "/placeholder.svg"}
                                      alt={project.name}
                                      fill
                                      className="object-cover"
                                    />
                                    <div className="absolute top-4 right-4 bg-[#D4AF37] text-white px-3 py-1 rounded-full text-sm font-bold">
                                      {project.progress}% Complété
                                    </div>
                                  </div>

                                  <div className="p-6">
                                    <h3 className="text-2xl font-bold text-[#003366] mb-4">{project.name}</h3>
                                    <p className="text-gray-600 mb-6">{project.objective}</p>

                                    <div className="grid grid-cols-2 gap-4 mb-6">
                                      <div className="flex items-center gap-2">
                                        <Calendar className="w-5 h-5 text-[#D4AF37]" />
                                        <div>
                                          <div className="text-xs text-gray-500">Début des travaux</div>
                                          <div className="font-medium">{project.startDate}</div>
                                        </div>
                                      </div>

                                      <div className="flex items-center gap-2">
                                        <Clock className="w-5 h-5 text-[#D4AF37]" />
                                        <div>
                                          <div className="text-xs text-gray-500">Durée</div>
                                          <div className="font-medium">{project.duration}</div>
                                        </div>
                                      </div>

                                      <div className="flex items-center gap-2 col-span-2">
                                        <Building className="w-5 h-5 text-[#D4AF37]" />
                                        <div>
                                          <div className="text-xs text-gray-500">Exécutant</div>
                                          <div className="font-medium">{project.executor}</div>
                                        </div>
                                      </div>
                                    </div>

                                    <h4 className="text-lg font-bold text-[#003366] mb-3">
                                      Caractéristiques du projet
                                    </h4>
                                    <ul className="space-y-2">
                                      {project.details.map((detail, index) => (
                                        <li key={index} className="flex items-start">
                                          <ChevronRight className="w-5 h-5 text-[#D4AF37] mr-2 shrink-0 mt-0.5" />
                                          <span>{detail}</span>
                                        </li>
                                      ))}
                                    </ul>

                                    <div className="mt-6 flex justify-end">
                                      <Button className="bg-[#0077B6] hover:bg-[#0077B6]/80 text-white">
                                        Télécharger la fiche projet
                                        <Download className="ml-2 w-4 h-4" />
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ),
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Projects cards */}
                  <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={containerVariants}
                    className="grid md:grid-cols-2 gap-6"
                  >
                    {currentProjects.map((project, index) => (
                      <motion.div
                        key={project.id}
                        custom={index}
                        variants={cardVariants}
                        whileHover={{ y: -10, transition: { duration: 0.2 } }}
                        className="h-full"
                      >
                        <Card className="h-full overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300">
                          <div className="relative h-48">
                            <Image
                              src={project.image || "/placeholder.svg"}
                              alt={project.name}
                              fill
                              className="object-cover transition-transform duration-300 hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            <div className="absolute bottom-0 left-0 right-0 p-4">
                              <h3 className="text-xl font-bold text-white">{project.name}</h3>
                            </div>
                          </div>

                          <CardContent className="p-6">
                            <div className="flex justify-between items-center mb-4">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-[#D4AF37]" />
                                <span className="text-sm text-gray-600">{project.startDate}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-[#D4AF37]" />
                                <span className="text-sm text-gray-600">{project.duration}</span>
                              </div>
                            </div>

                            <p className="text-gray-600 mb-4 line-clamp-2">{project.objective}</p>

                            <div className="flex justify-between items-center">
                              <div className="w-2/3">
                                <div className="text-xs text-gray-500 mb-1">Avancement</div>
                                <Progress value={project.progress} className="h-2" />
                              </div>

                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-[#0077B6] hover:text-[#003366] p-0"
                                onClick={() => setActiveProject(project.id)}
                              >
                                Détails <ChevronRight className="w-4 h-4 ml-1" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </motion.div>
                </section>
              </TabsContent>

              <TabsContent value="futurs">
                {/* Section 2: Futurs Projets */}
                <section id="futurs-projets" className="py-12">
                  <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeIn}
                    className="text-center mb-16"
                  >
                    <h2 className="text-3xl md:text-4xl font-bold text-[#003366] mb-4">Futurs Projets</h2>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                      Explorez les projets stratégiques qui définiront l'avenir du Port Autonome de Nouadhibou.
                    </p>
                  </motion.div>

                  {/* 3D Flip Cards */}
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                    {futureProjects.map((project, index) => (
                      <motion.div
                        key={project.id}
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="h-[400px] perspective"
                      >
                        <div
                          className={`relative w-full h-full transition-transform duration-700 transform-style-3d cursor-pointer ${
                            flippedCards.includes(project.id) ? "rotate-y-180" : ""
                          }`}
                          onClick={() => toggleCardFlip(project.id)}
                        >
                          {/* Front of card */}
                          <div className="absolute inset-0 backface-hidden">
                            <Card className="h-full overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300">
                              <div className="relative h-3/5">
                                <Image
                                  src={project.image || "/placeholder.svg"}
                                  alt={project.name}
                                  fill
                                  className="object-cover transition-transform duration-500 hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm p-2 rounded-full">
                                  <div className="text-[#003366]">{project.icon}</div>
                                </div>
                              </div>

                              <CardContent className="p-6 h-2/5 flex flex-col justify-between">
                                <h3 className="text-xl font-bold text-[#003366]">{project.name}</h3>

                                <Button className="mt-4 bg-[#0077B6] hover:bg-[#0077B6]/80 text-white w-full">
                                  Détails
                                  <ChevronRight className="ml-2 w-4 h-4" />
                                </Button>
                              </CardContent>
                            </Card>
                          </div>

                          {/* Back of card */}
                          <div className="absolute inset-0 backface-hidden rotate-y-180">
                            <Card className="h-full overflow-hidden border-none shadow-lg bg-[#003366] text-white">
                              <CardContent className="p-6 h-full flex flex-col">
                                <div className="flex justify-between items-start mb-4">
                                  <h3 className="text-xl font-bold">{project.name}</h3>
                                  <button
                                    className="text-white/80 hover:text-white"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      toggleCardFlip(project.id)
                                    }}
                                  >
                                    <X className="w-5 h-5" />
                                  </button>
                                </div>

                                <div className="space-y-4 flex-grow">
                                  <div>
                                    <h4 className="text-[#D4AF37] text-sm font-bold mb-1">Objectif</h4>
                                    <p className="text-white/90 text-sm">{project.objective}</p>
                                  </div>

                                  <div>
                                    <h4 className="text-[#D4AF37] text-sm font-bold mb-1">Planification</h4>
                                    <p className="text-white/90 text-sm">{project.planning}</p>
                                  </div>

                                  <div>
                                    <h4 className="text-[#D4AF37] text-sm font-bold mb-1">Impact attendu</h4>
                                    <p className="text-white/90 text-sm">{project.impact}</p>
                                  </div>
                                </div>

                                <Button
                                  variant="outline"
                                  className="mt-4 border-white text-white hover:bg-white hover:text-[#003366]"
                                >
                                  Télécharger la fiche projet
                                  <Download className="ml-2 w-4 h-4" />
                                </Button>
                              </CardContent>
                            </Card>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Vision stratégique */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="bg-[#222222] rounded-xl shadow-lg overflow-hidden text-white"
                  >
                    <div className="grid md:grid-cols-2">
                      <div className="relative aspect-video">
                        <Image
                          src={presentationVideo.thumbnail || "/placeholder.svg"}
                          alt={presentationVideo.title}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                          <Button
                            className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-full w-16 h-16 flex items-center justify-center"
                            onClick={() => setVideoPlaying(true)}
                          >
                            <Play className="w-8 h-8" />
                          </Button>
                        </div>
                        <div className="absolute bottom-4 right-4 bg-black/70 px-2 py-1 rounded text-xs">
                          {presentationVideo.duration}
                        </div>
                      </div>

                      <div className="p-8 flex flex-col justify-center">
                        <h3 className="text-2xl font-bold text-[#D4AF37] mb-4">{presentationVideo.title}</h3>
                        <p className="text-white/80 mb-6">{presentationVideo.description}</p>

                        <div className="space-y-4">
                          <div className="flex items-start">
                            <div className="w-10 h-10 rounded-full bg-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] shrink-0 mr-4">
                              <Layers className="w-5 h-5" />
                            </div>
                            <div>
                              <h4 className="font-bold">Développement des infrastructures</h4>
                              <p className="text-white/70 text-sm">
                                Extension des capacités portuaires et modernisation des équipements
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start">
                            <div className="w-10 h-10 rounded-full bg-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] shrink-0 mr-4">
                              <Database className="w-5 h-5" />
                            </div>
                            <div>
                              <h4 className="font-bold">Transformation numérique</h4>
                              <p className="text-white/70 text-sm">
                                Digitalisation des processus et services portuaires
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start">
                            <div className="w-10 h-10 rounded-full bg-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] shrink-0 mr-4">
                              <Zap className="w-5 h-5" />
                            </div>
                            <div>
                              <h4 className="font-bold">Transition énergétique</h4>
                              <p className="text-white/70 text-sm">
                                Réduction de l'empreinte carbone et adoption d'énergies renouvelables
                              </p>
                            </div>
                          </div>
                        </div>

                        <Button
                          className="mt-6 bg-[#D4AF37] hover:bg-[#D4AF37]/80 text-[#003366]"
                          onClick={() => setVideoPlaying(true)}
                        >
                          Voir la présentation complète
                          <Play className="ml-2 w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                </section>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        <DecorativeBorder />

        {/* Plan stratégique */}
        <section className="py-24 bg-white">
          <div className="container">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-[#003366] mb-4">Plan stratégique 2025-2030</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Découvrez les axes stratégiques qui guideront le développement du port pour les 5 prochaines années.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Card className="h-full overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border-t-4 border-[#003366]">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 rounded-full bg-[#003366]/10 flex items-center justify-center text-[#003366] mb-6">
                      <Ship className="w-8 h-8" />
                    </div>

                    <h3 className="text-xl font-bold text-[#003366] mb-4">Axe 1: Développement des infrastructures</h3>
                    <p className="text-gray-600 mb-6">
                      Modernisation et extension des capacités portuaires pour répondre aux besoins croissants du
                      commerce maritime international.
                    </p>

                    <ul className="space-y-2 mb-6">
                      <li className="flex items-start">
                        <ChevronRight className="w-5 h-5 text-[#D4AF37] mr-2 shrink-0 mt-0.5" />
                        <span>Construction de nouveaux quais à grande profondeur</span>
                      </li>
                      <li className="flex items-start">
                        <ChevronRight className="w-5 h-5 text-[#D4AF37] mr-2 shrink-0 mt-0.5" />
                        <span>Extension du terminal à conteneurs</span>
                      </li>
                      <li className="flex items-start">
                        <ChevronRight className="w-5 h-5 text-[#D4AF37] mr-2 shrink-0 mt-0.5" />
                        <span>Modernisation des équipements de manutention</span>
                      </li>
                    </ul>

                    <div className="flex justify-end">
                      <Button variant="ghost" className="text-[#003366] hover:text-[#0077B6] p-0">
                        En savoir plus <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card className="h-full overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border-t-4 border-[#0077B6]">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 rounded-full bg-[#0077B6]/10 flex items-center justify-center text-[#0077B6] mb-6">
                      <Database className="w-8 h-8" />
                    </div>

                    <h3 className="text-xl font-bold text-[#003366] mb-4">Axe 2: Transformation numérique</h3>
                    <p className="text-gray-600 mb-6">
                      Digitalisation des processus et services portuaires pour améliorer l'efficacité opérationnelle et
                      la qualité de service.
                    </p>

                    <ul className="space-y-2 mb-6">
                      <li className="flex items-start">
                        <ChevronRight className="w-5 h-5 text-[#D4AF37] mr-2 shrink-0 mt-0.5" />
                        <span>Mise en place d'un Port Community System</span>
                      </li>
                      <li className="flex items-start">
                        <ChevronRight className="w-5 h-5 text-[#D4AF37] mr-2 shrink-0 mt-0.5" />
                        <span>Automatisation des procédures administratives</span>
                      </li>
                      <li className="flex items-start">
                        <ChevronRight className="w-5 h-5 text-[#D4AF37] mr-2 shrink-0 mt-0.5" />
                        <span>Développement d'applications mobiles pour les usagers</span>
                      </li>
                    </ul>

                    <div className="flex justify-end">
                      <Button variant="ghost" className="text-[#003366] hover:text-[#0077B6] p-0">
                        En savoir plus <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Card className="h-full overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border-t-4 border-[#D4AF37]">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 rounded-full bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] mb-6">
                      <Zap className="w-8 h-8" />
                    </div>

                    <h3 className="text-xl font-bold text-[#003366] mb-4">Axe 3: Transition énergétique</h3>
                    <p className="text-gray-600 mb-6">
                      Réduction de l'empreinte carbone et adoption d'énergies renouvelables pour un port plus
                      respectueux de l'environnement.
                    </p>

                    <ul className="space-y-2 mb-6">
                      <li className="flex items-start">
                        <ChevronRight className="w-5 h-5 text-[#D4AF37] mr-2 shrink-0 mt-0.5" />
                        <span>Installation de panneaux solaires sur les bâtiments</span>
                      </li>
                      <li className="flex items-start">
                        <ChevronRight className="w-5 h-5 text-[#D4AF37] mr-2 shrink-0 mt-0.5" />
                        <span>Électrification des quais pour les navires à quai</span>
                      </li>
                      <li className="flex items-start">
                        <ChevronRight className="w-5 h-5 text-[#D4AF37] mr-2 shrink-0 mt-0.5" />
                        <span>Acquisition d'équipements à faible émission de carbone</span>
                      </li>
                    </ul>

                    <div className="flex justify-end">
                      <Button variant="ghost" className="text-[#003366] hover:text-[#0077B6] p-0">
                        En savoir plus <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
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
                <h2 className="text-3xl font-bold text-white mb-4">Vous souhaitez en savoir plus?</h2>
                <p className="text-white/80 mb-6">
                  Téléchargez notre plan stratégique complet ou contactez-nous pour discuter des opportunités de
                  collaboration.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button className="bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-[#003366] font-medium">
                    Télécharger le plan stratégique
                    <Download className="ml-2 w-4 h-4" />
                  </Button>
                  <Button variant="outline" className="border-white text-[#003366] hover:bg-white hover:text-[#003366]">
                    Nous contacter
                    <ArrowRight className="ml-2 w-4 h-4" />
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
                  src="/placeholder.svg?height=400&width=600&text=Port%20Autonome%20de%20Nouadhibou"
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
                    src="/placeholder.svg?height=720&width=1280&text=Vidéo%20de%20présentation"
                    alt="Vidéo de présentation"
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
      </main>
    </div>
  )
}

// Add CSS for 3D card flip effect
const styles = `
.perspective {
  perspective: 1000px;
}

.transform-style-3d {
  transform-style: preserve-3d;
}

.backface-hidden {
  backface-visibility: hidden;
}

.rotate-y-180 {
  transform: rotateY(180deg);
}
`

// Add the styles to the document
export function StyleRegistry() {
  return (
    <style jsx global>
      {styles}
    </style>
  )
}
