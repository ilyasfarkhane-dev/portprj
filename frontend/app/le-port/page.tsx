"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { ChevronRight, Users, FileText, BarChart, Award, Building, Anchor, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DecorativeBorder } from "@/components/decorative-border"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function PortPage() {
  const [activeTimelineItem, setActiveTimelineItem] = useState(0)
  const [showOrganigramme, setShowOrganigramme] = useState(false)

  const timelineItems = [
    {
      year: "1955",
      icon: <Building className="w-5 h-5" />,
      title: "Construction du premier quai",
      description: "Début des travaux d'infrastructure portuaire à Nouadhibou.",
    },
    {
      year: "1968",
      icon: <Anchor className="w-5 h-5" />,
      title: "Développement des infrastructures de pêche",
      description: "Extension des installations pour soutenir l'industrie de la pêche.",
    },
    {
      year: "2014",
      icon: <Shield className="w-5 h-5" />,
      title: "Extension du port avec nouvelles plateformes RO-RO",
      description: "Modernisation majeure des infrastructures pour accueillir plus de navires.",
    },
    {
      year: "2025",
      icon: <Award className="w-5 h-5" />,
      title: "Modernisation et digitalisation en cours",
      description: "Projet de transformation numérique et d'optimisation des opérations portuaires.",
    },
  ]

  // Animation variants for framer-motion
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  }

  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  useEffect(() => {
    // Auto-rotate timeline items every 4 seconds
    const interval = setInterval(() => {
      setActiveTimelineItem((prev) => (prev + 1) % timelineItems.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [timelineItems.length])

  return (
    <main className="flex-1 pt-16">
      {/* BLOC 1 - Mot du Directeur Général */}
      <section className="relative py-24 overflow-hidden bg-gradient-to-br from-[#003366] to-[#0077B6]">
        {/* Animated wave background */}
        <div className="absolute inset-0 opacity-10">
          <svg className="absolute bottom-0 left-0 w-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path
              fill="#D4AF37"
              d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
              className="animate-wave"
            ></path>
          </svg>
        </div>

        <div className="container relative">
          <motion.div
            className="grid md:grid-cols-2 gap-12 items-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerChildren}
          >
            <motion.div variants={fadeIn} className="text-center md:text-left">
              <h2 className="text-3xl font-bold tracking-tighter mb-6 text-white">Mot du Directeur Général</h2>
              <div className="relative mb-8 p-6 bg-white/10 backdrop-blur-sm rounded-lg border-l-4 border-[#D4AF37]">
                <motion.div
                  className="absolute -left-0.5 top-0 w-1 h-full bg-[#D4AF37]"
                  animate={{
                    height: ["0%", "100%", "0%"],
                    top: ["0%", "0%", "100%"],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                />
                <p className="text-white italic text-lg">
                  "Cher visiteur, bienvenue au Port Autonome de Nouadhibou. Notre mission est de garantir une
                  connectivité maritime optimale tout en favorisant la croissance économique régionale."
                </p>
              </div>
              <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                <Button
                  size="lg"
                  className="bg-white text-[#003366] hover:bg-[#D4AF37] hover:text-white transition-all duration-300"
                >
                  En savoir plus
                </Button>
              </motion.div>
            </motion.div>

            <motion.div variants={fadeIn} className="flex justify-center">
              <div className="relative">
                <div className="absolute -inset-1 rounded-full bg-[#D4AF37] blur-md animate-pulse" />
                <div className="relative rounded-full border-4 border-[#D4AF37] overflow-hidden w-74 h-74">
                  <Image
                    src="https://ps1ef2awflipm0dl.public.blob.vercel-storage.com/Pan/pt2-1sg0HKFYxqmltVdN198UBRO5j0rOw2.png?height=156&width=156"
                    alt="Directeur Général"
                    width={256}
                    height={256}
                    className="object-cover"
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <DecorativeBorder />

      {/* BLOC 2 - Présentation du Port */}
      <section className="py-24 bg-[#F5F5F5]">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold tracking-tighter mb-4 text-[#003366]">Présentation du Port</h2>
            <p className="max-w-2xl mx-auto text-gray-600">
              Découvrez l'histoire et l'évolution du Port Autonome de Nouadhibou, ainsi que son impact socio-économique
              sur la région.
            </p>
          </motion.div>

          {/* Sous-section : Histoire et Évolution */}
          <div className="mb-20">
            <h3 className="text-2xl font-bold text-[#003366] mb-8 text-center">Histoire et Évolution</h3>

            {/* Timeline interactive */}
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gray-200" />

              {/* Timeline dots */}
              <div className="relative flex justify-center mb-12">
                <div className="flex space-x-8 md:space-x-16">
                  {timelineItems.map((item, index) => (
                    <motion.button
                      key={item.year}
                      className={`relative z-10 flex flex-col items-center`}
                      onClick={() => setActiveTimelineItem(index)}
                      whileHover={{ scale: 1.1 }}
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                          activeTimelineItem === index
                            ? "bg-[#D4AF37] text-white scale-125"
                            : "bg-white text-[#003366] border-2 border-[#003366]"
                        }`}
                      >
                        {item.icon}
                      </div>
                      <span
                        className={`mt-2 font-bold ${
                          activeTimelineItem === index ? "text-[#D4AF37]" : "text-[#003366]"
                        }`}
                      >
                        {item.year}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Timeline content */}
              <motion.div
                className="bg-white rounded-lg shadow-lg p-8 max-w-3xl mx-auto"
                key={activeTimelineItem}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#003366]/10 flex items-center justify-center text-[#003366] shrink-0">
                    {timelineItems[activeTimelineItem].icon}
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-[#003366] mb-2">{timelineItems[activeTimelineItem].title}</h4>
                    <p className="text-gray-600">{timelineItems[activeTimelineItem].description}</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Sous-section : Intégration Socio-Économique */}
          <div>
            <h3 className="text-2xl font-bold text-[#003366] mb-8 text-center">Intégration Socio-Économique</h3>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                className="relative"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                {/* Circular chart placeholder - in a real implementation, this would be a proper chart */}
                <div className="aspect-square max-w-md mx-auto relative">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <circle cx="50" cy="50" r="40" fill="#003366" />
                    <path d="M50,50 L50,10 A40,40 0 0,1 85,65 Z" fill="#D4AF37" />
                    <path d="M50,50 L85,65 A40,40 0 0,1 15,65 Z" fill="#0077B6" />
                    <path d="M50,50 L15,65 A40,40 0 0,1 50,10 Z" fill="#00965e" />
                    <circle cx="50" cy="50" r="20" fill="white" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[#003366] font-bold text-lg">Impact Économique</span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="space-y-6">
                  <div className="bg-[#0077B6] rounded-lg p-6 text-white">
                    <div className="flex items-center gap-4 mb-2">
                      <Building className="w-8 h-8 text-[#D4AF37]" />
                      <h4 className="text-xl font-bold">Premier employeur de Nouadhibou</h4>
                    </div>
                    <p>
                      Le Port Autonome de Nouadhibou est le plus grand employeur de la région, offrant des milliers
                      d'emplois directs et indirects.
                    </p>
                  </div>

                  <div className="bg-[#0077B6] rounded-lg p-6 text-white">
                    <div className="flex items-center gap-4 mb-2">
                      <BarChart className="w-8 h-8 text-[#D4AF37]" />
                      <h4 className="text-xl font-bold">80% des exportations liées à la pêche</h4>
                    </div>
                    <p>
                      Le port joue un rôle crucial dans l'économie nationale en facilitant la majorité des exportations
                      de produits de la pêche.
                    </p>
                  </div>

                  <div className="bg-[#0077B6] rounded-lg p-6 text-white">
                    <div className="flex items-center gap-4 mb-2">
                      <Users className="w-8 h-8 text-[#D4AF37]" />
                      <h4 className="text-xl font-bold">+50 partenaires privés</h4>
                    </div>
                    <p>
                      Un réseau étendu de partenaires commerciaux et industriels contribue au dynamisme économique du
                      port.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <DecorativeBorder />

      {/* BLOC 3 - Gouvernance */}
      <section className="py-24 bg-white">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold tracking-tighter mb-4 text-[#003366]">Gouvernance</h2>
            <p className="max-w-2xl mx-auto text-gray-600">
              Découvrez la structure organisationnelle et les instances dirigeantes du Port Autonome de Nouadhibou.
            </p>
          </motion.div>

          <Tabs defaultValue="conseil" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="conseil" className="text-lg">
                Conseil d'Administration
              </TabsTrigger>
              <TabsTrigger value="direction" className="text-lg">
                Direction Générale
              </TabsTrigger>
            </TabsList>

            <TabsContent value="conseil">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-8"
              >
                <div className="overflow-hidden rounded-lg shadow-lg">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-[#A8D8FF] text-white shadow-sm">
                        <th className="py-4 px-6 text-left">Rôle</th>
                        <th className="py-4 px-6 text-left">Attributions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="bg-white">
                        <td className="py-4 px-6 font-medium">Président</td>
                        <td className="py-4 px-6">Direction stratégique et supervision des activités du port</td>
                      </tr>
                      <tr className="bg-[#F7F7F7]">
                        <td className="py-4 px-6 font-medium">Membres</td>
                        <td className="py-4 px-6">Représentants des ministères et des acteurs économiques</td>
                      </tr>
                      <tr className="bg-white">
                        <td className="py-4 px-6 font-medium">Secrétariat</td>
                        <td className="py-4 px-6">Coordination administrative et suivi des décisions</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-[#003366]">Attributions principales</h3>
                  <ul className="grid md:grid-cols-2 gap-4">
                    <li className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#003366]/10 flex items-center justify-center text-[#003366] shrink-0">
                        <ChevronRight className="w-5 h-5" />
                      </div>
                      <span>Définition de la politique générale du port</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#003366]/10 flex items-center justify-center text-[#003366] shrink-0">
                        <ChevronRight className="w-5 h-5" />
                      </div>
                      <span>Approbation du budget et des comptes</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#003366]/10 flex items-center justify-center text-[#003366] shrink-0">
                        <ChevronRight className="w-5 h-5" />
                      </div>
                      <span>Validation des projets d'investissement</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#003366]/10 flex items-center justify-center text-[#003366] shrink-0">
                        <ChevronRight className="w-5 h-5" />
                      </div>
                      <span>Supervision des performances opérationnelles</span>
                    </li>
                  </ul>
                </div>

                <Accordion type="single" collapsible>
                  <AccordionItem value="article">
                    <AccordionTrigger className="text-[#003366] font-medium">
                      Extrait réglementaire (Article 7 du décret 83.186)
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="p-4 bg-[#F7F7F7] rounded-md border-l-4 border-[#003366] italic">
                        "Le Conseil d'Administration est investi des pouvoirs les plus étendus pour agir en toute
                        circonstance au nom du Port Autonome de Nouadhibou. Il définit la politique générale du Port et
                        veille à sa mise en œuvre."
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </motion.div>
            </TabsContent>

            <TabsContent value="direction">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-8"
              >
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="overflow-hidden shadow-lg bg-gradient-to-b from-[#A8D8FF] to-white">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-[#003366] flex items-center justify-center text-white shrink-0">
                          <Users className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="text-xl font-bold text-[#003366] mb-2">Direction Générale</h4>
                          <p className="text-gray-700 mb-4">
                            La Direction Générale assure la gestion quotidienne du port et met en œuvre les décisions du
                            Conseil d'Administration.
                          </p>
                          <Button
                            onClick={() => setShowOrganigramme(!showOrganigramme)}
                            className="bg-[#003366] hover:bg-[#0077B6]"
                          >
                            {showOrganigramme ? "Masquer l'organigramme" : "Voir l'organigramme"}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="overflow-hidden shadow-lg bg-gradient-to-b from-[#A8D8FF] to-white">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-[#003366] flex items-center justify-center text-white shrink-0">
                          <FileText className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="text-xl font-bold text-[#003366] mb-2">Missions principales</h4>
                          <ul className="space-y-2">
                            <li className="flex items-center gap-2">
                              <ChevronRight className="w-4 h-4 text-[#0077B6]" />
                              <span>Gestion opérationnelle du port</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <ChevronRight className="w-4 h-4 text-[#0077B6]" />
                              <span>Développement commercial et marketing</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <ChevronRight className="w-4 h-4 text-[#0077B6]" />
                              <span>Maintenance des infrastructures</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <ChevronRight className="w-4 h-4 text-[#0077B6]" />
                              <span>Gestion des ressources humaines</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Organigramme interactif */}
                {showOrganigramme && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mt-8 p-6 bg-[#F7F7F7] rounded-lg shadow-inner"
                  >
                    <h3 className="text-xl font-bold text-[#003366] mb-6 text-center">
                      Organigramme du Port Autonome de Nouadhibou
                    </h3>

                    {/* Niveau 1: Direction Générale */}
                    <div className="flex justify-center mb-8">
                      <motion.div
                        className="relative p-4 rounded-lg bg-[#003366] text-white text-center w-64"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-[#D4AF37] flex items-center justify-center">
                          <Users className="w-4 h-4 text-white" />
                        </div>
                        <h4 className="font-bold mt-2">Directeur Général</h4>
                        <p className="text-sm mt-1">Supervise l'ensemble des activités du PAN</p>
                      </motion.div>
                    </div>

                    {/* Ligne de connexion */}
                    <div className="w-0.5 h-8 bg-[#D4AF37] mx-auto -mt-4 mb-4"></div>

                    {/* Niveau 2: DGA */}
                    <div className="flex justify-center mb-8">
                      <motion.div
                        className="relative p-4 rounded-lg bg-[#0077B6] text-white text-center w-64"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                      >
                        <h4 className="font-bold">Directeur Général Adjoint</h4>
                        <p className="text-sm mt-1">Assiste le DG dans la gestion globale</p>
                      </motion.div>
                    </div>

                    {/* Ligne de connexion */}
                    <div className="w-0.5 h-8 bg-[#D4AF37] mx-auto -mt-4 mb-4"></div>

                    {/* Niveau 3: Structures rattachées */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                      {[
                        { title: "Cellule Études & Développement", icon: <FileText className="w-4 h-4" /> },
                        { title: "Conseiller Technique", icon: <Building className="w-4 h-4" /> },
                        { title: "Assistante du DG", icon: <Users className="w-4 h-4" /> },
                        { title: "Cellule Documentation", icon: <FileText className="w-4 h-4" /> },
                      ].map((item, index) => (
                        <motion.div
                          key={item.title}
                          className="p-3 rounded-lg bg-[#003366]/80 text-white text-center"
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.6 + index * 0.1 }}
                        >
                          <div className="w-8 h-8 rounded-full bg-[#D4AF37]/20 flex items-center justify-center mx-auto mb-2">
                            {item.icon}
                          </div>
                          <h5 className="font-medium text-sm">{item.title}</h5>
                        </motion.div>
                      ))}
                    </div>

                    {/* Ligne de connexion */}
                    <div className="w-full h-0.5 bg-[#D4AF37] mx-auto mb-4"></div>

                    {/* Niveau 4: Directions Opérationnelles */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {[
                        { title: "Direction Administrative et Financière", icon: <FileText className="w-4 h-4" /> },
                        { title: "Direction Exploitation", icon: <Anchor className="w-4 h-4" /> },
                        { title: "Direction Commerciale", icon: <BarChart className="w-4 h-4" /> },
                        { title: "Direction Technique", icon: <Building className="w-4 h-4" /> },
                      ].map((item, index) => (
                        <motion.div
                          key={item.title}
                          className="p-3 rounded-lg bg-[#0077B6]/80 text-white text-center"
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.8 + index * 0.1 }}
                        >
                          <div className="w-8 h-8 rounded-full bg-[#D4AF37]/20 flex items-center justify-center mx-auto mb-2">
                            {item.icon}
                          </div>
                          <h5 className="font-medium text-sm">{item.title}</h5>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <DecorativeBorder />

      {/* CTA Section */}
      <section className="py-16">
        <div className="container">
          <div className="rounded-2xl bg-[#003366] p-8 md:p-12">
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter text-white sm:text-4xl">
                  Vous souhaitez en savoir plus?
                </h2>
                <p className="text-white/90 md:text-xl">
                  Contactez-nous pour obtenir des informations détaillées sur le Port Autonome de Nouadhibou.
                </p>
              </div>
              <div className="flex flex-col gap-4 min-[400px]:flex-row lg:justify-end">
                <Button size="lg" className="bg-[#D4AF37] text-[#003366] hover:bg-[#D4AF37]/90">
                  Nous contacter
                </Button>
                <Button size="lg" variant="outline" className="text-[#003366] border-white hover:bg-white/10">
                  Télécharger la brochure
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
