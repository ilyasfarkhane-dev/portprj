"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import { Ship, Weight, Clock, Users, Anchor, Container, Building2, CircleDollarSign } from "lucide-react"
import { StatsCounter } from "./stats-counter"

const stats = [
  {
    icon: <Ship className="w-8 h-8" />,
    value: 150,
    suffix: "+",
    label: "Navires par mois",
    description: "Trafic maritime mensuel",
  },
  {
    icon: <Weight className="w-8 h-8" />,
    value: 5,
    suffix: "M",
    label: "Tonnes de fret par an",
    description: "Volume annuel traité",
  },
  {
    icon: <Clock className="w-8 h-8" />,
    value: 24,
    suffix: "/7",
    label: "Service continu",
    description: "Disponibilité permanente",
  },
  {
    icon: <Users className="w-8 h-8" />,
    value: 1000,
    suffix: "+",
    label: "Employés",
    description: "Équipe qualifiée",
  },
]

const additionalStats = [
  {
    icon: <Anchor className="w-6 h-6" />,
    value: 12,
    label: "Quais",
  },
  {
    icon: <Container className="w-6 h-6" />,
    value: 500000,
    label: "EVP/an",
  },
  {
    icon: <Building2 className="w-6 h-6" />,
    value: 50000,
    label: "m² stockage",
  },
  {
    icon: <CircleDollarSign className="w-6 h-6" />,
    value: 95,
    suffix: "%",
    label: "Satisfaction",
  },
]

export const StatsSection = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.2], [0, 1])
  const scale = useTransform(scrollYProgress, [0, 0.2], [0.8, 1])

  return (
    <section
      ref={containerRef}
      className="py-24 bg-gradient-to-br from-[#003366] to-[#002244] relative overflow-hidden"
    >
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-[#FFD700]/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-[#008000]/5 rounded-full blur-3xl" />
      </div>

      <motion.div style={{ opacity, scale }} className="container relative">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Chiffres Clés</h2>
          <p className="text-white/80 max-w-2xl mx-auto">
            Des performances qui témoignent de notre engagement envers l'excellence maritime
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 mb-16">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-white/5 rounded-lg blur-lg group-hover:bg-white/10 transition-colors duration-300" />
              <div className="relative p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#FFD700]/10 flex items-center justify-center text-[#FFD700]">
                  {stat.icon}
                </div>
                <div className="text-4xl font-bold text-white mb-2 flex items-center justify-center">
                  <StatsCounter end={stat.value} duration={2000} />
                  <span className="text-[#FFD700]">{stat.suffix}</span>
                </div>
                <div className="text-lg font-semibold text-white mb-1">{stat.label}</div>
                <div className="text-white/60 text-sm">{stat.description}</div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {additionalStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/5 rounded-lg p-4 text-center hover:bg-white/10 transition-colors"
            >
              <div className="text-[#FFD700] mb-2">{stat.icon}</div>
              <div className="text-2xl font-bold text-white">
                <StatsCounter end={stat.value} duration={2000} />
                {stat.suffix}
              </div>
              <div className="text-white/60 text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
