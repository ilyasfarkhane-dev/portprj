"use client"

import { motion } from "framer-motion"
import { Anchor, Ship, Package, MapPin, Warehouse, Compass, ConeIcon as Crane, Container } from "lucide-react"
import { Card } from "@/components/ui/card"
import { WaveBackground } from "./wave-background"

const services = [
  {
    icon: <Anchor className="w-8 h-8" />,
    title: "Amarrage",
    description: "Services d'amarrage et d'accostage pour tous types de navires",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    icon: <Ship className="w-8 h-8" />,
    title: "Navigation",
    description: "Assistance à la navigation et services de pilotage",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    icon: <Package className="w-8 h-8" />,
    title: "Manutention",
    description: "Services de manutention et de stockage des marchandises",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    icon: <MapPin className="w-8 h-8" />,
    title: "Logistique",
    description: "Solutions logistiques intégrées et transport multimodal",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    icon: <Warehouse className="w-8 h-8" />,
    title: "Stockage",
    description: "Espaces de stockage sécurisés et modernes",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    icon: <Compass className="w-8 h-8" />,
    title: "Pilotage",
    description: "Services de pilotage maritime professionnel",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    icon: <Crane className="w-8 h-8" />,
    title: "Remorquage",
    description: "Services de remorquage et assistance maritime",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    icon: <Container className="w-8 h-8" />,
    title: "Terminal Conteneurs",
    description: "Gestion moderne des conteneurs et marchandises",
    image: "/placeholder.svg?height=200&width=300",
  },
]

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
    },
  }),
}

export const ServicesSection = () => {
  return (
    <section id="services" className="py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      <WaveBackground />

      <div className="container relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center space-y-4 mb-16"
        >
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-[#003366]">
            Nos Services Portuaires
          </h2>
          <p className="mx-auto max-w-[700px] text-gray-600 md:text-xl">
            Des solutions complètes et modernes pour répondre à vos besoins logistiques et maritimes
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              custom={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={cardVariants}
            >
              <Card className="group relative overflow-hidden h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-br from-[#003366]/80 to-[#008000]/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="relative p-6 h-full flex flex-col">
                  <div className="mb-4 transform transition-transform duration-300 group-hover:scale-110">
                    <div className="w-16 h-16 rounded-full bg-[#003366]/10 flex items-center justify-center text-[#003366] group-hover:text-[#FFD700] transition-colors">
                      {service.icon}
                    </div>
                  </div>

                  <h3 className="text-xl font-bold mb-2 text-[#003366] group-hover:text-white transition-colors relative">
                    {service.title}
                  </h3>

                  <p className="text-gray-600 group-hover:text-white/90 transition-colors relative">
                    {service.description}
                  </p>

                 
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
