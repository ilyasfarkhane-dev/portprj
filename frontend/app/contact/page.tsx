"use client"

import type React from "react"
import { useState, useRef } from "react"
import {
  MapPin,
  Phone,
  Mail,
  Send,
  FileText,
  Check,
  Facebook,
  Twitter,
  Linkedin,
  Youtube,
  Calendar,
  MessageSquare,
  ChevronDown,
  Loader,
} from "lucide-react"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import "./styles.css"

// Types
type ContactFormData = {
  nom: string
  email: string
  telephone: string
  typeDemandeId: string
  message: string
  fichiers: File[]
}

type SocialMedia = {
  name: string
  icon: React.ReactNode
  url: string
  color: string
}

type ContactInfo = {
  icon: React.ReactNode
  title: string
  details: string[]
  action?: {
    text: string
    url: string
  }
}

// Composant principal
export default function ContactPage() {
  // États pour le formulaire
  const [formData, setFormData] = useState<ContactFormData>({
    nom: "",
    email: "",
    telephone: "",
    typeDemandeId: "",
    message: "",
    fichiers: [],
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [emailValid, setEmailValid] = useState(true)
  const [newsletterEmail, setNewsletterEmail] = useState("")
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false)
  // Suppression de l'import Google Maps qui causait l'erreur
  const [mapLoaded, setMapLoaded] = useState(false)

  // Références pour le scroll
  const coordonneesRef = useRef<HTMLDivElement>(null)
  const formulaireRef = useRef<HTMLDivElement>(null)
  const reseauxRef = useRef<HTMLDivElement>(null)

  // Intersection Observer pour les animations au scroll
  const [coordonneesRefView, coordonneesInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const [formulaireRefView, formulaireInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const [reseauxRefView, reseauxInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  // Configuration de la carte Google Maps
  const mapContainerStyle = {
    width: "100%",
    height: "400px",
    borderRadius: "8px",
  }

  const center = {
    lat: 20.9175, // Coordonnées approximatives de Nouadhibou
    lng: -17.0568,
  }

  const mapOptions = {
    disableDefaultUI: false,
    zoomControl: true,
    mapTypeControl: true,
    streetViewControl: true,
    styles: [
      {
        featureType: "water",
        elementType: "geometry",
        stylers: [{ color: "#e9e9e9" }, { lightness: 17 }],
      },
      {
        featureType: "landscape",
        elementType: "geometry",
        stylers: [{ color: "#f5f5f5" }, { lightness: 20 }],
      },
    ],
  }

  // Points d'intérêt sur la carte
  const markers = [
    {
      id: 1,
      position: { lat: 20.9175, lng: -17.0568 },
      title: "Port Autonome de Nouadhibou",
      description: "Siège principal du PAN",
    },
    {
      id: 2,
      position: { lat: 20.92, lng: -17.06 },
      title: "Terminal à conteneurs",
      description: "Terminal principal pour le trafic de conteneurs",
    },
    {
      id: 3,
      position: { lat: 20.915, lng: -17.053 },
      title: "Terminal pétrolier",
      description: "Zone dédiée aux hydrocarbures",
    },
  ]

  // Données des réseaux sociaux
  const socialMedia: SocialMedia[] = [
    {
      name: "Facebook",
      icon: <Facebook size={24} />,
      url: "https://facebook.com/portdenouadhibou",
      color: "#1877F2",
    },
    {
      name: "Twitter",
      icon: <Twitter size={24} />,
      url: "https://twitter.com/portdenouadhibou",
      color: "#1DA1F2",
    },
    {
      name: "LinkedIn",
      icon: <Linkedin size={24} />,
      url: "https://linkedin.com/company/portdenouadhibou",
      color: "#0A66C2",
    },
    {
      name: "YouTube",
      icon: <Youtube size={24} />,
      url: "https://youtube.com/portdenouadhibou",
      color: "#FF0000",
    },
  ]

  // Informations de contact
  const contactInfo: ContactInfo[] = [
    {
      icon: <MapPin size={24} className="text-[#D4AF37]" />,
      title: "Adresse",
      details: ["Port Autonome de Nouadhibou", "BP 5, Nouadhibou", "Mauritanie"],
      action: {
        text: "Voir sur Google Maps",
        url: "https://maps.google.com/?q=20.9175,-17.0568",
      },
    },
    {
      icon: <Phone size={24} className="text-[#D4AF37]" />,
      title: "Téléphone",
      details: ["+222 45 74 51 36 (Standard)", "+222 45 74 51 37 (Direction)", "+222 45 74 51 38 (Commercial)"],
    },
    {
      icon: <Mail size={24} className="text-[#D4AF37]" />,
      title: "Email",
      details: ["contact@pan.mr", "commercial@pan.mr", "direction@pan.mr"],
    },
    {
      icon: <Calendar size={24} className="text-[#D4AF37]" />,
      title: "Horaires",
      details: ["Lundi - Jeudi: 8h00 - 17h00", "Vendredi: 8h00 - 12h00", "Samedi - Dimanche: Fermé"],
    },
  ]

  // Types de demandes pour le formulaire
  const typesDemandes = [
    { id: "information", label: "Demande d'information" },
    { id: "commercial", label: "Service commercial" },
    { id: "reclamation", label: "Réclamation" },
    { id: "partenariat", label: "Proposition de partenariat" },
    { id: "presse", label: "Contact presse" },
    { id: "autre", label: "Autre demande" },
  ]

  // Gestionnaires d'événements
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    if (name === "email") {
      validateEmail(value)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files)
      setFormData((prev) => ({ ...prev, fichiers: [...prev.fichiers, ...filesArray] }))
    }
  }

  const removeFile = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      fichiers: prev.fichiers.filter((_, i) => i !== index),
    }))
  }

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    setEmailValid(re.test(email))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!emailValid) return

    setIsSubmitting(true)

    // Simulation d'envoi de formulaire
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsSubmitting(false)
    setIsSubmitted(true)

    // Réinitialisation du formulaire après 3 secondes
    setTimeout(() => {
      setFormData({
        nom: "",
        email: "",
        telephone: "",
        typeDemandeId: "",
        message: "",
        fichiers: [],
      })
      setIsSubmitted(false)
    }, 3000)
  }

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Simulation d'abonnement à la newsletter
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setNewsletterSubmitted(true)

    // Réinitialisation après 3 secondes
    setTimeout(() => {
      setNewsletterEmail("")
      setNewsletterSubmitted(false)
    }, 3000)
  }

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" })
    }
  }

  // Animations avec Framer Motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  }

  return (
    <div className="min-h-screen bg-white">
      {/* En-tête de la page */}
      <div className="relative bg-gradient-to-r from-[#003366] to-[#004F9E] py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="wave-pattern"></div>
        </div>
        <div className="relative max-w-7xl mx-auto text-center">
          <motion.h1
            className="text-4xl font-bold text-white mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Contactez-nous
          </motion.h1>
          <motion.p
            className="text-xl text-white/90 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Nous sommes à votre écoute pour toute demande d'information ou de collaboration
          </motion.p>

          {/* Navigation rapide */}
          <motion.div
            className="flex flex-wrap justify-center gap-4 mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <button
              onClick={() => scrollToSection(coordonneesRef)}
              className="bg-white text-[#003366] px-6 py-2 rounded-full font-medium hover:bg-[#D4AF37] hover:text-white transition-all duration-300"
            >
              Coordonnées
            </button>
            <button
              onClick={() => scrollToSection(formulaireRef)}
              className="bg-[#D4AF37] text-white px-6 py-2 rounded-full font-medium hover:bg-white hover:text-[#003366] transition-all duration-300"
            >
              Formulaire de contact
            </button>
            <button
              onClick={() => scrollToSection(reseauxRef)}
              className="bg-white text-[#003366] px-6 py-2 rounded-full font-medium hover:bg-[#D4AF37] hover:text-white transition-all duration-300"
            >
              Réseaux sociaux
            </button>
          </motion.div>
        </div>
      </div>

      {/* Section 1: Coordonnées et plan d'accès */}
      <section ref={coordonneesRef} className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            ref={coordonneesRefView}
            className="text-center mb-12"
            initial="hidden"
            animate={coordonneesInView ? "visible" : "hidden"}
            variants={containerVariants}
          >
            <motion.h2 className="text-3xl font-bold text-[#003366] mb-4" variants={itemVariants}>
              Coordonnées et plan d'accès
            </motion.h2>
            <motion.p className="text-lg text-gray-600 max-w-3xl mx-auto" variants={itemVariants}>
              Retrouvez toutes les informations pour nous contacter ou nous rendre visite
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* Informations de contact */}
            <motion.div
              ref={coordonneesRefView}
              className="grid grid-cols-1 sm:grid-cols-2 gap-6"
              initial="hidden"
              animate={coordonneesInView ? "visible" : "hidden"}
              variants={containerVariants}
            >
              {contactInfo.map((info, index) => (
                <motion.div
                  key={index}
                  className="bg-[#F5F5F5] p-6 rounded-lg hover:shadow-lg transition-all duration-300"
                  variants={itemVariants}
                >
                  <div className="flex items-center mb-3">
                    {info.icon}
                    <h3 className="text-xl font-semibold text-[#003366] ml-2">{info.title}</h3>
                  </div>
                  <div className="space-y-2">
                    {info.details.map((detail, i) => (
                      <p key={i} className="text-gray-700">
                        {detail}
                      </p>
                    ))}
                    {info.action && (
                      <a
                        href={info.action.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-3 text-[#D4AF37] hover:underline font-medium"
                      >
                        {info.action.text}
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Carte interactive */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="rounded-lg overflow-hidden shadow-lg"
            >
              {/* Remplaçons le code de Google Maps par une solution plus simple */}
              <div className="relative">
                <div className="bg-gray-100 h-[400px] w-full rounded-t-lg overflow-hidden">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3643.1076678108!2d-17.059988885022!3d20.917499986066186!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xc1e969a2a57f3d9%3A0x7c7b1c0e1c7c7b1c!2sPort%20Autonome%20de%20Nouadhibou!5e0!3m2!1sfr!2sfr!4v1616661234567!5m2!1sfr!2sfr"
                    width="100%"
                    height="400"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="rounded-t-lg"
                  ></iframe>
                </div>

                <div className="bg-[#003366] text-white p-4">
                  <h3 className="font-semibold mb-1">Port Autonome de Nouadhibou</h3>
                  <p className="text-sm text-white/80">Consultez notre emplacement sur la carte</p>
                  <a
                    href="https://www.google.com/maps/dir/?api=1&destination=20.9175,-17.0568"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center mt-2 text-[#D4AF37] hover:underline"
                  >
                    <MapPin size={16} className="mr-1" />
                    Obtenir un itinéraire
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section 2: Formulaire de contact */}
      <section ref={formulaireRef} className="py-16 px-4 sm:px-6 lg:px-8 bg-[#F5F5F5]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            ref={formulaireRefView}
            className="text-center mb-12"
            initial="hidden"
            animate={formulaireInView ? "visible" : "hidden"}
            variants={containerVariants}
          >
            <motion.h2 className="text-3xl font-bold text-[#003366] mb-4" variants={itemVariants}>
              Formulaire de contact
            </motion.h2>
            <motion.p className="text-lg text-gray-600 max-w-3xl mx-auto" variants={itemVariants}>
              Envoyez-nous votre demande et nous vous répondrons dans les plus brefs délais
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Formulaire */}
            <motion.div
              className="lg:col-span-2 bg-white rounded-lg shadow-lg p-6 sm:p-8"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              {isSubmitted ? (
                <motion.div
                  className="text-center py-12"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                    <Check className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#003366] mb-2">Message envoyé !</h3>
                  <p className="text-gray-600">
                    Nous avons bien reçu votre demande et nous vous répondrons dans les plus brefs délais.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Nom */}
                    <div>
                      <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-1">
                        Nom complet <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="nom"
                        name="nom"
                        value={formData.nom}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all duration-300"
                        placeholder="Votre nom et prénom"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all duration-300 ${
                          !emailValid && formData.email ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="votre.email@exemple.com"
                      />
                      {!emailValid && formData.email && (
                        <p className="mt-1 text-sm text-red-500">Veuillez entrer une adresse email valide</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Téléphone */}
                    <div>
                      <label htmlFor="telephone" className="block text-sm font-medium text-gray-700 mb-1">
                        Téléphone
                      </label>
                      <input
                        type="tel"
                        id="telephone"
                        name="telephone"
                        value={formData.telephone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all duration-300"
                        placeholder="+222 XX XX XX XX"
                      />
                    </div>

                    {/* Type de demande */}
                    <div>
                      <label htmlFor="typeDemandeId" className="block text-sm font-medium text-gray-700 mb-1">
                        Type de demande <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="typeDemandeId"
                        name="typeDemandeId"
                        value={formData.typeDemandeId}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all duration-300 appearance-none bg-white"
                      >
                        <option value="" disabled>
                          Sélectionnez une option
                        </option>
                        {typesDemandes.map((type) => (
                          <option key={type.id} value={type.id}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={5}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all duration-300"
                      placeholder="Détaillez votre demande ici..."
                    />
                  </div>

                  {/* Upload de fichiers */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pièces jointes (facultatif)</label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-[#D4AF37] transition-all duration-300">
                      <div className="space-y-1 text-center">
                        <FileText className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600">
                          <label
                            htmlFor="file-upload"
                            className="relative cursor-pointer bg-white rounded-md font-medium text-[#D4AF37] hover:text-[#003366] focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-[#D4AF37]"
                          >
                            <span>Télécharger un fichier</span>
                            <input
                              id="file-upload"
                              name="file-upload"
                              type="file"
                              className="sr-only"
                              multiple
                              onChange={handleFileChange}
                            />
                          </label>
                          <p className="pl-1">ou glisser-déposer</p>
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG, PDF jusqu'à 10MB</p>
                      </div>
                    </div>

                    {/* Liste des fichiers */}
                    {formData.fichiers.length > 0 && (
                      <ul className="mt-3 divide-y divide-gray-200 border border-gray-200 rounded-md">
                        {formData.fichiers.map((file, index) => (
                          <li key={index} className="flex items-center justify-between py-3 pl-3 pr-4 text-sm">
                            <div className="flex items-center">
                              <FileText className="flex-shrink-0 h-5 w-5 text-gray-400 mr-2" />
                              <span className="ml-2 flex-1 truncate">{file.name}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeFile(index)}
                              className="ml-4 flex-shrink-0 text-red-500 hover:text-red-700"
                            >
                              Supprimer
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Bouton d'envoi */}
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isSubmitting || !emailValid}
                      className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-[#003366] hover:bg-[#D4AF37] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D4AF37] transition-all duration-300 ${
                        isSubmitting || !emailValid ? "opacity-70 cursor-not-allowed" : ""
                      }`}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" />
                          Envoi en cours...
                        </>
                      ) : (
                        <>
                          <Send className="-ml-1 mr-2 h-5 w-5" />
                          Envoyer le message
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>

            {/* Assistance en ligne */}
            <motion.div
              className="bg-white rounded-lg shadow-lg overflow-hidden"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="bg-[#003366] text-white p-6">
                <h3 className="text-xl font-bold mb-2">Assistance en ligne</h3>
                <p className="text-white/80">Besoin d'une réponse rapide ? Contactez notre équipe d'assistance</p>
              </div>

              <div className="p-6 space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <MessageSquare className="h-6 w-6 text-[#D4AF37]" />
                  </div>
                  <div className="ml-3">
                    <h4 className="text-lg font-medium text-gray-900">Chat en direct</h4>
                    <p className="mt-1 text-gray-600">
                      Discutez avec un conseiller en temps réel du lundi au vendredi, de 8h à 17h.
                    </p>
                    <button className="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#D4AF37] hover:bg-[#003366] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D4AF37] transition-all duration-300">
                      Démarrer un chat
                    </button>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <Phone className="h-6 w-6 text-[#D4AF37]" />
                  </div>
                  <div className="ml-3">
                    <h4 className="text-lg font-medium text-gray-900">Assistance téléphonique</h4>
                    <p className="mt-1 text-gray-600">
                      Appelez notre service client au +222 45 74 51 39 pour une assistance immédiate.
                    </p>
                    <p className="mt-2 text-sm text-gray-500">
                      Disponible du lundi au jeudi de 8h à 17h et le vendredi de 8h à 12h.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <Mail className="h-6 w-6 text-[#D4AF37]" />
                  </div>
                  <div className="ml-3">
                    <h4 className="text-lg font-medium text-gray-900">Email prioritaire</h4>
                    <p className="mt-1 text-gray-600">Pour les demandes urgentes, contactez-nous à l'adresse :</p>
                    <a
                      href="mailto:urgence@pan.mr"
                      className="mt-1 inline-block text-[#003366] font-medium hover:text-[#D4AF37] transition-all duration-300"
                    >
                      urgence@pan.mr
                    </a>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h4 className="text-lg font-medium text-gray-900">FAQ</h4>
                  <div className="mt-3 space-y-4">
                    <div className="border-b border-gray-200 pb-4">
                      <button className="flex justify-between items-center w-full text-left">
                        <span className="text-gray-800 font-medium">Comment suivre l'état de ma demande ?</span>
                        <ChevronDown className="h-5 w-5 text-gray-500" />
                      </button>
                      <div className="mt-2 text-gray-600 text-sm">
                        Vous recevrez un numéro de suivi par email après l'envoi de votre demande. Vous pourrez suivre
                        son état sur notre portail client.
                      </div>
                    </div>
                    <div className="border-b border-gray-200 pb-4">
                      <button className="flex justify-between items-center w-full text-left">
                        <span className="text-gray-800 font-medium">Quel est le délai de réponse habituel ?</span>
                        <ChevronDown className="h-5 w-5 text-gray-500" />
                      </button>
                      <div className="mt-2 text-gray-600 text-sm">
                        Nous nous efforçons de répondre à toutes les demandes dans un délai de 48 heures ouvrables.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section 3: Réseaux sociaux et newsletter */}
      <section ref={reseauxRef} className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            ref={reseauxRefView}
            className="text-center mb-12"
            initial="hidden"
            animate={reseauxInView ? "visible" : "hidden"}
            variants={containerVariants}
          >
            <motion.h2 className="text-3xl font-bold text-[#003366] mb-4" variants={itemVariants}>
              Réseaux sociaux et newsletter
            </motion.h2>
            <motion.p className="text-lg text-gray-600 max-w-3xl mx-auto" variants={itemVariants}>
              Restez connecté avec le Port Autonome de Nouadhibou
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Réseaux sociaux */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <h3 className="text-2xl font-bold text-[#003366] mb-6">Suivez-nous</h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                {socialMedia.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center p-4 rounded-lg bg-white border border-gray-200 hover:shadow-lg transition-all duration-300 hover:border-[#D4AF37]"
                  >
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center mb-3"
                      style={{ backgroundColor: `${social.color}20` }}
                    >
                      <div className="text-[#003366]">{social.icon}</div>
                    </div>
                    <span className="text-gray-800 font-medium">{social.name}</span>
                  </a>
                ))}
              </div>

              <div className="bg-[#F5F5F5] rounded-lg p-6">
                <h4 className="text-xl font-semibold text-[#003366] mb-4">Dernières actualités</h4>

                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-md hover:shadow-md transition-all duration-300">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-[#1877F2] flex items-center justify-center">
                          <Facebook size={20} className="text-white" />
                        </div>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-gray-500">Facebook • Il y a 2 jours</p>
                        <p className="mt-1 text-gray-800">
                          Le Port Autonome de Nouadhibou a accueilli aujourd'hui une délégation internationale pour
                          discuter des nouvelles opportunités commerciales.
                        </p>
                        <a href="#" className="mt-2 inline-block text-sm text-[#D4AF37] hover:underline">
                          Voir le post
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-md hover:shadow-md transition-all duration-300">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-[#1DA1F2] flex items-center justify-center">
                          <Twitter size={20} className="text-white" />
                        </div>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-gray-500">Twitter • Il y a 5 jours</p>
                        <p className="mt-1 text-gray-800">
                          Nouveau record de trafic au Port de Nouadhibou ce mois-ci ! Plus de détails dans notre rapport
                          mensuel.
                        </p>
                        <a href="#" className="mt-2 inline-block text-sm text-[#D4AF37] hover:underline">
                          Voir le tweet
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 text-center">
                  <a
                    href="#"
                    className="inline-block text-[#003366] font-medium hover:text-[#D4AF37] transition-all duration-300"
                  >
                    Voir toutes nos actualités
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Newsletter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h3 className="text-2xl font-bold text-[#003366] mb-6">Abonnez-vous à notre newsletter</h3>

              <div className="bg-[#003366] text-white rounded-lg overflow-hidden">
                <div className="p-6">
                  <p className="mb-4">
                    Recevez nos dernières actualités, événements et opportunités directement dans votre boîte mail.
                  </p>

                  {newsletterSubmitted ? (
                    <div className="bg-white/10 rounded-md p-4 text-center">
                      <Check className="h-8 w-8 text-[#D4AF37] mx-auto mb-2" />
                      <p className="text-white font-medium">Merci pour votre inscription !</p>
                      <p className="text-white/80 text-sm mt-1">Vous recevrez prochainement notre newsletter.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleNewsletterSubmit} className="space-y-4">
                      <div>
                        <label htmlFor="newsletter-email" className="sr-only">
                          Adresse email
                        </label>
                        <input
                          type="email"
                          id="newsletter-email"
                          value={newsletterEmail}
                          onChange={(e) => setNewsletterEmail(e.target.value)}
                          required
                          className="w-full px-4 py-3 border border-white/20 bg-white/10 rounded-md focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all duration-300 text-white placeholder-white/60"
                          placeholder="Votre adresse email"
                        />
                      </div>

                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="privacy"
                            name="privacy"
                            type="checkbox"
                            required
                            className="h-4 w-4 text-[#D4AF37] focus:ring-[#D4AF37] border-white/30 rounded"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="privacy" className="text-white/80">
                            J'accepte de recevoir la newsletter et j'ai lu la{" "}
                            <a href="#" className="text-[#D4AF37] hover:underline">
                              politique de confidentialité
                            </a>
                          </label>
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-[#D4AF37] text-white px-4 py-3 rounded-md font-medium hover:bg-white hover:text-[#003366] transition-all duration-300"
                      >
                        S'abonner à la newsletter
                      </button>
                    </form>
                  )}
                </div>

                <div className="bg-[#002855] p-6">
                  <h4 className="font-semibold mb-3">Pourquoi s'abonner ?</h4>
                  <ul className="space-y-2 text-white/80">
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-[#D4AF37] mr-2 flex-shrink-0" />
                      <span>Actualités exclusives du Port Autonome de Nouadhibou</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-[#D4AF37] mr-2 flex-shrink-0" />
                      <span>Invitations aux événements et conférences</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-[#D4AF37] mr-2 flex-shrink-0" />
                      <span>Opportunités commerciales et appels d'offres</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-[#D4AF37] mr-2 flex-shrink-0" />
                      <span>Rapports et analyses du secteur maritime</span>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}
