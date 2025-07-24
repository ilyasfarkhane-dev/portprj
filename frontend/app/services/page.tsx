"use client"

import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import {
  Anchor,
  Package,
  RefreshCw,
  Truck,
  Ship,
  Warehouse,
  ChevronRight,
  ChevronLeft,
  Star,
  Send,
  ArrowRight,
  MapPin,
  Phone,
  Mail,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DecorativeBorder } from "@/components/decorative-border"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Services data
const services = [
  {
    id: 1,
    title: "Manutention",
    icon: <Anchor className="w-10 h-10" />,
    description:
      "Services de chargement et déchargement optimisés pour tous types de marchandises avec un matériel spécialisé garantissant une manutention sécurisée et efficace.",
    features: [
      "Chargement et déchargement optimisés",
      "Matériel spécialisé pour manutention sécurisée",
      "Personnel qualifié et expérimenté",
      "Opérations 24/7",
    ],
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    id: 2,
    title: "Transbordements",
    icon: <RefreshCw className="w-10 h-10" />,
    description:
      "Opérations rapides sans stockage intermédiaire permettant une réduction significative des coûts logistiques et une optimisation de la chaîne d'approvisionnement.",
    features: [
      "Opérations rapides sans stockage intermédiaire",
      "Réduction des coûts logistiques",
      "Coordination optimisée",
      "Suivi en temps réel",
    ],
    image: "https://ps1ef2awflipm0dl.public.blob.vercel-storage.com/Pan/Sequence%2003.00_32_29_11.Still016-zHTZCELtq4OvsGfesAGnPt96b4AZRy.png?height=300&width=400",
  },
  {
    id: 3,
    title: "Entreposage",
    icon: <Package className="w-10 h-10" />,
    description:
      "Espaces de stockage diversifiés incluant des zones sous douane, des installations frigorifiques et des entrepôts sécurisés accessibles 24h/24 et 7j/7.",
    features: ["Espaces sous douane", "Zones frigorifiques", "Stockage sécurisé", "Accès 24/7"],
    image: "https://ps1ef2awflipm0dl.public.blob.vercel-storage.com/Pan/Sequence%2003.00_33_50_08.Still017-nOCyDl4gqZL3OF0Ht0OWxWLoC4o0wN.png?height=300&width=400",
  },
  {
    id: 4,
    title: "Transit & Logistique",
    icon: <Truck className="w-10 h-10" />,
    description:
      "Services complets de coordination entre transport maritime et terrestre avec une gestion douanière simplifiée pour fluidifier vos opérations logistiques.",
    features: [
      "Coordination transport maritime/terrestre",
      "Gestion douanière simplifiée",
      "Solutions logistiques intégrées",
      "Suivi administratif complet",
    ],
    image: "https://ps1ef2awflipm0dl.public.blob.vercel-storage.com/Pan/Sequence%2003.00_36_19_14.Still019-D7mdKaxmbN8Nu6wFTYrZdSZ3e7YFFN.png?height=300&width=400",
  },
  {
    id: 5,
    title: "Services aux Navires",
    icon: <Ship className="w-10 h-10" />,
    description:
      "Assistance complète pour les navires incluant le pilotage, le remorquage, l'avitaillement et la fourniture d'eau douce pour garantir des escales optimales.",
    features: ["Pilotage professionnel", "Services de remorquage", "Avitaillement", "Fourniture d'eau douce"],
    image: "https://ps1ef2awflipm0dl.public.blob.vercel-storage.com/Pan/07-bIWhDc55RbVKqEDCsqDYNWloNF4sE9.png?height=300&width=400",
  },
  {
    id: 6,
    title: "Gestion des Terminaux",
    icon: <Warehouse className="w-10 h-10" />,
    description:
      "Exploitation efficace des terminaux spécialisés pour conteneurs, vracs et marchandises diverses avec des équipements modernes et un personnel qualifié.",
    features: ["Terminal conteneurs", "Terminal vracs", "Terminal pêche", "Équipements modernes"],
    image: "https://ps1ef2awflipm0dl.public.blob.vercel-storage.com/Pan/Sequence%2003.00_16_05_05.Still006-x1MOJJCZu8L4FEl481GyhT4vvCHRkJ.png?height=300&width=400",
  },
]

// Equipment data
const equipments = [
  {
    id: 1,
    title: "Zone de pesage 100 tonnes",
    description: "Infrastructure moderne permettant le pesage précis des marchandises jusqu'à 100 tonnes",
    image: "https://ps1ef2awflipm0dl.public.blob.vercel-storage.com/Pan/STOCK-c6ZJInTYY4XyiZ7qvSRoWkV17Ml3BU.png?height=500&width=800",
  },
  {
    id: 2,
    title: "Stockage frigorifique",
    description:
      "Installations frigorifiques de dernière génération pour la conservation optimale des produits périssables",
    image: "https://ps1ef2awflipm0dl.public.blob.vercel-storage.com/Pan/frigo-34qB2XLTz6n2AFskdXCMfa1oIRn3NP.png?height=500&width=800",
  },
  {
    id: 3,
    title: "Remorquage en action",
    description: "Service de remorquage professionnel assurant la sécurité des manœuvres portuaires",
    image: "https://ps1ef2awflipm0dl.public.blob.vercel-storage.com/Pan/21-78XXMQCYsG0NhYChC9ClftG6hUW7pu.png?height=500&width=800",
  },
  {
    id: 4,
    title: "Terminal conteneurs",
    description: "Terminal moderne équipé pour la gestion efficace des conteneurs avec des équipements de pointe",
    image: "https://ps1ef2awflipm0dl.public.blob.vercel-storage.com/Pan/18-ntnAEsuiv7HPMSf4qgjr9to76fqE6b.png?height=500&width=800",
  },
]

// Testimonials data
const testimonials = [
  {
    id: 1,
    name: "Compagnie Maritime Internationale",
    role: "Partenaire depuis 2015",
    content:
      "La qualité des services et l'efficacité des opérations du Port Autonome de Nouadhibou ont considérablement amélioré notre chaîne logistique. Un partenaire fiable et professionnel.",
    rating: 5,
    logo: "https://ps1ef2awflipm0dl.public.blob.vercel-storage.com/Pan/Sequence%2003.00_31_54_23.Still015-axKiYCi0Wny47r7GNh1dp5sNy9w5Hh.png?height=80&width=200",
  },
  {
    id: 2,
    name: "Global Shipping Solutions",
    role: "Client régulier",
    content:
      "Nous apprécions particulièrement la réactivité des équipes et la qualité des infrastructures qui permettent d'optimiser nos opérations de transport maritime.",
    rating: 4,
    logo: "https://ps1ef2awflipm0dl.public.blob.vercel-storage.com/Pan/DSC07645-vd392AhTkFFVqj8vbTX2XYT5Q5KvgR.JPG?height=80&width=200",
  },
  {
    id: 3,
    name: "Pêcheries Atlantiques",
    role: "Exportateur",
    content:
      "Les installations frigorifiques et les services de manutention spécialisés pour les produits de la pêche sont d'une qualité exceptionnelle, garantissant la fraîcheur de nos produits.",
    rating: 5,
    logo: "https://ps1ef2awflipm0dl.public.blob.vercel-storage.com/Pan/DSC07657-GK16mKSdxiq1TTqns74BBikLXOUfy9.JPG?height=80&width=200",
  },
]

// Typing effect component
const TypingEffect = ({ text }: { text: string }) => {
  const [displayText, setDisplayText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText((prev) => prev + text[currentIndex])
        setCurrentIndex((prev) => prev + 1)
      }, 100)

      return () => clearTimeout(timeout)
    }
  }, [currentIndex, text])

  return <span>{displayText}</span>
}

// Star rating component
const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className={`w-5 h-5 ${i < rating ? "text-[#FFD700] fill-[#FFD700]" : "text-gray-300"}`} />
      ))}
    </div>
  )
}

export default function ServicesPage() {
  const [activeEquipment, setActiveEquipment] = useState(0)
  const [activeTestimonial, setActiveTestimonial] = useState(0)
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    service: "",
    message: "",
  })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [showPulse, setShowPulse] = useState(false)

  const headerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: headerRef,
    offset: ["start start", "end start"],
  })

  const headerOpacity = useTransform(scrollYProgress, [0, 1], [1, 0])
  const headerY = useTransform(scrollYProgress, [0, 1], [0, 100])

  // Auto-rotate equipment carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveEquipment((prev) => (prev + 1) % equipments.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 8000)

    return () => clearInterval(interval)
  }, [])

  // Show pulse effect on contact button after 5 seconds
  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowPulse(true)
    }, 5000)

    return () => clearTimeout(timeout)
  }, [])

  // Form validation
  const validateForm = () => {
    const errors: Record<string, string> = {}

    if (!formState.name) errors.name = "Le nom est requis"
    if (!formState.email) {
      errors.email = "L'email est requis"
    } else if (!/\S+@\S+\.\S+/.test(formState.email)) {
      errors.email = "Format d'email invalide"
    }
    if (!formState.service) errors.service = "Veuillez sélectionner un service"
    if (!formState.message) errors.message = "Le message est requis"

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      // Form submission logic would go here
      alert("Formulaire envoyé avec succès!")
      setFormState({
        name: "",
        email: "",
        service: "",
        message: "",
      })
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormState((prev) => ({ ...prev, [name]: value }))

    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 pt-16">
        {/* Header Section with Parallax */}
        <motion.section
          ref={headerRef}
          className="relative h-[70vh] flex items-center justify-center overflow-hidden"
          style={{ opacity: headerOpacity, y: headerY }}
        >
          <div className="absolute inset-0 z-0">
            <Image
              src="https://ps1ef2awflipm0dl.public.blob.vercel-storage.com/Pan/Sequence%2003.00_41_26_03.Still024-waz37AWc1vEiQxyCzTsS2jJPyxCTIZ.png?height=1080&width=1920"
              alt="Activités portuaires"
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
              Services & Activités
            </motion.h1>

            <motion.div
              className="text-2xl md:text-3xl font-light mb-8 h-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <TypingEffect text="Optimisation, Sécurité, Performance" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.8 }}
            >
              <Button
                size="lg"
                className="bg-[#FFD700] text-[#003366] hover:bg-white transition-all duration-300 group"
              >
                <span className="relative">
                  Découvrez nos services
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#003366] group-hover:w-full transition-all duration-300"></span>
                </span>
                <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </motion.div>
          </div>
        </motion.section>

        <DecorativeBorder />

        {/* Nos Services Section */}
        <section id="services" className="py-24 bg-[#F7F7F7]">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-[#003366] mb-4">Nos Services</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Le Port Autonome de Nouadhibou propose une gamme complète de services portuaires et logistiques pour
                répondre à tous vos besoins.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -10, transition: { duration: 0.2 } }}
                  className="h-full"
                >
                  <Card className="h-full overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-0 h-full flex flex-col">
                      <div className="bg-[#003366] p-6 text-white flex items-center">
                        <div className="mr-4 text-[#FFD700]">{service.icon}</div>
                        <h3 className="text-xl font-bold">{service.title}</h3>
                      </div>

                      <div className="p-6 flex-grow">
                        <p className="text-gray-600 mb-4">{service.description}</p>
                        <ul className="space-y-2">
                          {service.features.map((feature, i) => (
                            <li key={i} className="flex items-start">
                              <ChevronRight className="w-5 h-5 text-[#0077B6] mr-2 shrink-0 mt-0.5" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                     
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <DecorativeBorder />

        {/* Équipements & Infrastructures Section */}
        <section id="equipements" className="py-24 bg-white relative overflow-hidden">
          {/* Parallax background elements */}
          <div className="absolute inset-0 pointer-events-none">
            <motion.div
              className="absolute top-0 left-0 w-64 h-64 rounded-full bg-[#A8D8FF]/20"
              style={{
                y: useTransform(scrollYProgress, [0, 1], [0, 100]),
                x: useTransform(scrollYProgress, [0, 1], [0, -50]),
              }}
            />
            <motion.div
              className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-[#FFD700]/10"
              style={{
                y: useTransform(scrollYProgress, [0, 1], [0, -150]),
                x: useTransform(scrollYProgress, [0, 1], [0, 50]),
              }}
            />
          </div>

          <div className="container relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-[#003366] mb-4">Équipements & Infrastructures</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Découvrez nos installations modernes et nos équipements de pointe qui garantissent des opérations
                portuaires efficaces et sécurisées.
              </p>
            </motion.div>

            <div className="relative">
              {/* Equipment Carousel */}
              <div className="relative overflow-hidden rounded-xl shadow-xl aspect-[16/9] max-w-5xl mx-auto">
                <AnimatePresence mode="wait">
                  {equipments.map(
                    (equipment, index) =>
                      index === activeEquipment && (
                        <motion.div
                          key={equipment.id}
                          initial={{ opacity: 0, x: 100 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -100 }}
                          transition={{ duration: 0.5 }}
                          className="absolute inset-0"
                        >
                          <Image
                            src={equipment.image || "/placeholder.svg"}
                            alt={equipment.title}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                            <h3 className="text-2xl font-bold mb-2">{equipment.title}</h3>
                            <p className="text-white/90">{equipment.description}</p>
                          </div>
                        </motion.div>
                      ),
                  )}
                </AnimatePresence>

                {/* Navigation buttons */}
                <button
                  onClick={() => setActiveEquipment((prev) => (prev === 0 ? equipments.length - 1 : prev - 1))}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors z-10"
                  aria-label="Précédent"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                <button
                  onClick={() => setActiveEquipment((prev) => (prev + 1) % equipments.length)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors z-10"
                  aria-label="Suivant"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>

              {/* Indicators */}
              <div className="flex justify-center mt-6 space-x-2">
                {equipments.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveEquipment(index)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      index === activeEquipment ? "bg-[#FFD700] scale-125" : "bg-gray-300"
                    }`}
                    aria-label={`Voir équipement ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            <div className="text-center mt-12">
              <Button className="bg-[#003366] hover:bg-[#0077B6] text-white transition-all duration-300">
                Voir tous les équipements
              </Button>
            </div>
          </div>
        </section>

        <DecorativeBorder />

        {/* Témoignages & Partenaires Section */}
        <section id="temoignages" className="py-24 bg-[#F7F7F7]">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-[#003366] mb-4">Partenaires</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Découvrez ce que nos partenaires disent de nos services et de notre collaboration.
              </p>
            </motion.div>

            
            {/* Partners logos */}
            <div className="mt-16">
              <h3 className="text-xl font-bold text-[#003366] text-center mb-8">Nos Partenaires</h3>
              <div className="flex flex-wrap justify-center gap-8">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: i * 0.1 }}
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    className="w-32 h-20 bg-white rounded-lg shadow-md flex items-center justify-center p-4"
                  >
                    <Image
                      src={`/placeholder.svg?height=60&width=100&text=Logo ${i}`}
                      alt={`Partenaire ${i}`}
                      width={100}
                      height={60}
                      className="object-contain"
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <DecorativeBorder />

        {/* Contact & Demande de Devis Section */}
        <section id="contact" className="py-24 bg-white">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-[#003366] mb-4">Contact & Demande de Devis</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Contactez-nous pour obtenir plus d'informations sur nos services ou pour demander un devis personnalisé.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-12 items-start">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="bg-[#F7F7F7] rounded-xl p-8">
                  <h3 className="text-2xl font-bold text-[#003366] mb-6">Nos Coordonnées</h3>

                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-[#003366] flex items-center justify-center text-white shrink-0">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-[#003366]">Adresse</h4>
                        <p className="text-gray-600">
                          Port Autonome de Nouadhibou
                          <br />
                          BP 5, Nouadhibou
                          <br />
                          Mauritanie
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-[#003366] flex items-center justify-center text-white shrink-0">
                        <Phone className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-[#003366]">Téléphone</h4>
                        <p className="text-gray-600">+222 45 74 51 11</p>
                        <p className="text-gray-600">+222 45 74 51 12 (Urgences)</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-[#003366] flex items-center justify-center text-white shrink-0">
                        <Mail className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-[#003366]">Email</h4>
                        <p className="text-gray-600">contact@pan.mr</p>
                        <p className="text-gray-600">services@pan.mr</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8">
                    <h4 className="font-bold text-[#003366] mb-4">Horaires d'ouverture</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Lundi - Vendredi</span>
                        <span>8h00 - 17h00</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Samedi</span>
                        <span>8h00 - 12h00</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Dimanche</span>
                        <span>Fermé</span>
                      </div>
                      <div className="flex justify-between font-medium text-[#003366] mt-2">
                        <span>Services portuaires</span>
                        <span>24h/24 - 7j/7</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="bg-white rounded-xl shadow-lg p-8">
                  <h3 className="text-2xl font-bold text-[#003366] mb-6">Demande de Devis</h3>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Nom / Entreprise *
                      </label>
                      <Input
                        id="name"
                        name="name"
                        value={formState.name}
                        onChange={handleInputChange}
                        className={`border-gray-300 focus:border-[#0077B6] focus:ring focus:ring-[#0077B6]/20 transition-all ${
                          formErrors.name ? "border-red-500" : ""
                        }`}
                      />
                      {formErrors.name && <p className="mt-1 text-sm text-red-500">{formErrors.name}</p>}
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email *
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formState.email}
                        onChange={handleInputChange}
                        className={`border-gray-300 focus:border-[#0077B6] focus:ring focus:ring-[#0077B6]/20 transition-all ${
                          formErrors.email ? "border-red-500" : ""
                        }`}
                      />
                      {formErrors.email && <p className="mt-1 text-sm text-red-500">{formErrors.email}</p>}
                    </div>

                    <div>
                      <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-1">
                        Service concerné *
                      </label>
                      <select
                        id="service"
                        name="service"
                        value={formState.service}
                        onChange={handleInputChange}
                        className={`w-full rounded-md border-gray-300 focus:border-[#0077B6] focus:ring focus:ring-[#0077B6]/20 transition-all ${
                          formErrors.service ? "border-red-500" : ""
                        }`}
                      >
                        <option value="">Sélectionnez un service</option>
                        {services.map((service) => (
                          <option key={service.id} value={service.title}>
                            {service.title}
                          </option>
                        ))}
                      </select>
                      {formErrors.service && <p className="mt-1 text-sm text-red-500">{formErrors.service}</p>}
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                        Message *
                      </label>
                      <Textarea
                        id="message"
                        name="message"
                        rows={5}
                        value={formState.message}
                        onChange={handleInputChange}
                        className={`border-gray-300 focus:border-[#0077B6] focus:ring focus:ring-[#0077B6]/20 transition-all ${
                          formErrors.message ? "border-red-500" : ""
                        }`}
                      />
                      {formErrors.message && <p className="mt-1 text-sm text-red-500">{formErrors.message}</p>}
                    </div>

                    <div className="pt-4">
                      <Button
                        type="submit"
                        className={`w-full bg-[#003366] hover:bg-[#0077B6] text-white transition-all duration-300 ${
                          showPulse ? "animate-pulse" : ""
                        }`}
                      >
                        <Send className="mr-2 w-5 h-5" />
                        Nous Contacter
                      </Button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-24 bg-[#F7F7F7]">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-[#003366] mb-4">Questions Fréquentes</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Retrouvez les réponses aux questions les plus fréquemment posées sur nos services.
              </p>
            </motion.div>

            <div className="max-w-3xl mx-auto">
              <Tabs defaultValue="general" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-8">
                  <TabsTrigger value="general">Général</TabsTrigger>
                  <TabsTrigger value="services">Services</TabsTrigger>
                  <TabsTrigger value="tarifs">Tarifs</TabsTrigger>
                </TabsList>

                <TabsContent value="general">
                  <div className="space-y-4">
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="item-1">
                        <AccordionTrigger className="text-[#003366] font-medium">
                          Quels sont les horaires d'ouverture du port?
                        </AccordionTrigger>
                        <AccordionContent>
                          Les services administratifs du port sont ouverts du lundi au vendredi de 8h00 à 17h00 et le
                          samedi de 8h00 à 12h00. Les opérations portuaires fonctionnent 24h/24 et 7j/7.
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="item-2">
                        <AccordionTrigger className="text-[#003366] font-medium">
                          Comment puis-je accéder au port?
                        </AccordionTrigger>
                        <AccordionContent>
                          L'accès au port est réglementé. Les visiteurs doivent obtenir une autorisation préalable
                          auprès de l'administration portuaire. Les professionnels doivent disposer d'un badge d'accès.
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="item-3">
                        <AccordionTrigger className="text-[#003366] font-medium">
                          Quels documents sont nécessaires pour utiliser les services du port?
                        </AccordionTrigger>
                        <AccordionContent>
                          Les documents requis varient selon le type de service. En général, vous aurez besoin des
                          documents d'identification du navire, des manifestes de cargaison, des documents douaniers et
                          des autorisations spécifiques selon la nature des marchandises.
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                </TabsContent>

                <TabsContent value="services">
                  <div className="space-y-4">
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="item-1">
                        <AccordionTrigger className="text-[#003366] font-medium">
                          Quels types de navires peuvent accoster au port?
                        </AccordionTrigger>
                        <AccordionContent>
                          Le Port Autonome de Nouadhibou peut accueillir une grande variété de navires, notamment les
                          porte-conteneurs, les vraquiers, les navires de pêche industrielle, les pétroliers et les
                          navires de transport de passagers.
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="item-2">
                        <AccordionTrigger className="text-[#003366] font-medium">
                          Proposez-vous des services de réparation navale?
                        </AccordionTrigger>
                        <AccordionContent>
                          Oui, le port dispose d'installations pour les réparations mineures. Pour les réparations
                          majeures, nous travaillons avec des partenaires spécialisés qui peuvent intervenir sur site.
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="item-3">
                        <AccordionTrigger className="text-[#003366] font-medium">
                          Comment réserver un service de manutention?
                        </AccordionTrigger>
                        <AccordionContent>
                          Les services de manutention peuvent être réservés en contactant notre service d'exploitation
                          au moins 48 heures à l'avance. Vous pouvez également effectuer une demande en ligne via notre
                          plateforme dédiée.
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                </TabsContent>

                <TabsContent value="tarifs">
                  <div className="space-y-4">
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="item-1">
                        <AccordionTrigger className="text-[#003366] font-medium">
                          Comment obtenir une grille tarifaire complète?
                        </AccordionTrigger>
                        <AccordionContent>
                          La grille tarifaire complète est disponible sur demande auprès de notre service commercial.
                          Vous pouvez également la télécharger depuis notre espace usagers en ligne.
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="item-2">
                        <AccordionTrigger className="text-[#003366] font-medium">
                          Proposez-vous des tarifs préférentiels pour les clients réguliers?
                        </AccordionTrigger>
                        <AccordionContent>
                          Oui, nous proposons des tarifs dégressifs pour nos clients réguliers ainsi que des contrats
                          annuels avec des conditions avantageuses. Contactez notre service commercial pour plus
                          d'informations.
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="item-3">
                        <AccordionTrigger className="text-[#003366] font-medium">
                          Quels sont les modes de paiement acceptés?
                        </AccordionTrigger>
                        <AccordionContent>
                          Nous acceptons les paiements par virement bancaire, chèque certifié et espèces pour les petits
                          montants. Les clients réguliers peuvent également bénéficier d'un compte client avec
                          facturation mensuelle.
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
