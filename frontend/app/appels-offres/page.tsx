"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Search,
  Download,
  ChevronDown,
  ChevronUp,
  Calendar,
  DollarSign,
  Building,
  FileText,
  Clock,
  HelpCircle,
  Send,
  Plus,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { PageHeader } from "@/components/page-header"
import "./styles.css"

// Types
type TenderStatus = "Ouvert" | "Clôturé" | "En évaluation"
type TenderCategory = "BTP" | "Logistique" | "Maintenance" | "Équipement" | "Services" | "Informatique" | "Autre"

interface Tender {
  id: string
  title: string
  description: string
  budget: string
  deadline: string
  company?: string
  documents: { name: string; url: string }[]
  status: TenderStatus
  category: TenderCategory
  expanded?: boolean
}

interface FAQ {
  id: string
  question: string
  answer: string
}

// Données de démonstration
const initialTenders: Tender[] = [
  {
    id: "AO-2023-001",
    title: "Construction d'un nouveau terminal de conteneurs",
    description:
      "Projet de construction d'un terminal de conteneurs moderne avec une capacité de 500,000 EVP par an, incluant des équipements de manutention et systèmes informatiques.",
    budget: "15,000,000 €",
    deadline: "2023-12-15",
    company: "Direction des Infrastructures Portuaires",
    documents: [
      { name: "Cahier des charges", url: "#" },
      { name: "Plans techniques", url: "#" },
      { name: "Formulaire de soumission", url: "#" },
    ],
    status: "Ouvert",
    category: "BTP",
  },
  {
    id: "AO-2023-002",
    title: "Fourniture d'équipements de manutention portuaire",
    description:
      "Acquisition de grues portuaires, chariots élévateurs et équipements de transport pour le terminal polyvalent.",
    budget: "3,500,000 €",
    deadline: "2023-11-30",
    company: "Direction Logistique",
    documents: [
      { name: "Spécifications techniques", url: "#" },
      { name: "Conditions générales", url: "#" },
      { name: "Formulaire de soumission", url: "#" },
    ],
    status: "Ouvert",
    category: "Équipement",
  },
  {
    id: "AO-2023-003",
    title: "Services de maintenance des infrastructures maritimes",
    description:
      "Contrat de maintenance préventive et corrective des quais, jetées et infrastructures maritimes du port pour une durée de 3 ans.",
    budget: "2,800,000 €",
    deadline: "2023-10-15",
    company: "Direction Technique",
    documents: [
      { name: "Cahier des charges", url: "#" },
      { name: "Historique des interventions", url: "#" },
      { name: "Formulaire de soumission", url: "#" },
    ],
    status: "En évaluation",
    category: "Maintenance",
  },
  {
    id: "AO-2023-004",
    title: "Développement d'un système de gestion portuaire intégré",
    description:
      "Conception et implémentation d'un système informatique intégré pour la gestion des opérations portuaires, incluant modules de facturation, suivi des navires et gestion des escales.",
    budget: "1,200,000 €",
    deadline: "2023-09-30",
    company: "Direction des Systèmes d'Information",
    documents: [
      { name: "Cahier des charges", url: "#" },
      { name: "Architecture technique", url: "#" },
      { name: "Formulaire de soumission", url: "#" },
    ],
    status: "Clôturé",
    category: "Informatique",
  },
  {
    id: "AO-2023-005",
    title: "Services de sécurité et surveillance portuaire",
    description:
      "Prestation de services de sécurité et surveillance des installations portuaires 24/7, incluant contrôle d'accès et patrouilles.",
    budget: "950,000 €",
    deadline: "2023-11-20",
    company: "Direction de la Sécurité",
    documents: [
      { name: "Cahier des charges", url: "#" },
      { name: "Plan de sécurité", url: "#" },
      { name: "Formulaire de soumission", url: "#" },
    ],
    status: "Ouvert",
    category: "Services",
  },
]

const faqs: FAQ[] = [
  {
    id: "faq-1",
    question: "Comment soumettre une offre en ligne ?",
    answer:
      "Pour soumettre une offre en ligne, vous devez d'abord créer un compte sur notre plateforme. Ensuite, accédez à l'appel d'offres qui vous intéresse, téléchargez les documents nécessaires, et cliquez sur le bouton 'Soumettre une offre'. Remplissez le formulaire en ligne et téléchargez tous les documents requis dans les formats spécifiés (généralement PDF). Une confirmation vous sera envoyée par email après la soumission.",
  },
  {
    id: "faq-2",
    question: "Quels sont les délais de traitement des soumissions ?",
    answer:
      "Le traitement des soumissions suit un calendrier précis indiqué dans chaque appel d'offres. En général, l'évaluation technique prend 2 à 3 semaines après la date limite de soumission, suivie par l'évaluation financière (1 à 2 semaines). Les résultats sont communiqués dans un délai de 4 à 6 semaines après la clôture de l'appel d'offres, selon la complexité du projet.",
  },
  {
    id: "faq-3",
    question: "Comment récupérer un dossier d'appel d'offres ?",
    answer:
      "Les dossiers d'appels d'offres peuvent être récupérés de deux façons : en ligne via notre plateforme (téléchargement gratuit ou payant selon l'appel d'offres) ou physiquement auprès du Service des Marchés Publics du Port Autonome de Nouadhibou. Pour la version physique, vous devrez présenter une pièce d'identité et, dans certains cas, payer des frais de dossier non remboursables.",
  },
  {
    id: "faq-4",
    question: "Quels critères sont utilisés pour l'évaluation des offres ?",
    answer:
      "L'évaluation des offres repose sur plusieurs critères : conformité administrative (documents requis), capacité technique (expérience, qualifications, méthodologie), capacité financière (chiffre d'affaires, garanties) et offre financière (prix proposé). La pondération de ces critères varie selon la nature du projet et est détaillée dans chaque dossier d'appel d'offres.",
  },
  {
    id: "faq-5",
    question: "Quels sont les contacts du service des marchés publics ?",
    answer:
      "Le Service des Marchés Publics du Port Autonome de Nouadhibou est joignable par email à marches@pan.mr, par téléphone au +222 45 74 51 36, ou en personne à notre siège (Bâtiment administratif, 2ème étage). Les horaires d'ouverture sont du lundi au jeudi de 8h à 17h et le vendredi de 8h à 12h.",
  },
  {
    id: "faq-6",
    question: "Comment puis-je être informé des nouveaux appels d'offres ?",
    answer:
      "Pour être informé des nouveaux appels d'offres, vous pouvez vous inscrire à notre newsletter sur la page d'accueil du site, suivre nos publications officielles dans les journaux nationaux, ou créer un compte sur notre plateforme avec des alertes personnalisées par secteur d'activité.",
  },
  {
    id: "faq-7",
    question: "Est-il possible de visiter les sites concernés par les appels d'offres ?",
    answer:
      "Oui, des visites de sites sont organisées pour la plupart des appels d'offres concernant des travaux ou des services sur site. Les dates de ces visites sont indiquées dans le dossier d'appel d'offres. La participation est généralement obligatoire et un certificat de visite vous sera remis, à joindre à votre offre.",
  },
]

const eligibilityDocuments = [
  {
    id: "doc-1",
    title: "Documents administratifs",
    items: [
      "Registre de commerce (copie certifiée)",
      "Attestation fiscale à jour",
      "Attestation de la CNSS",
      "Déclaration sur l'honneur de non-faillite",
      "Procuration du signataire (si nécessaire)",
    ],
  },
  {
    id: "doc-2",
    title: "Capacités techniques",
    items: [
      "Liste des projets similaires réalisés",
      "CV des experts clés",
      "Certifications professionnelles",
      "Liste des équipements disponibles",
      "Méthodologie d'exécution",
    ],
  },
  {
    id: "doc-3",
    title: "Capacités financières",
    items: [
      "États financiers des 3 dernières années",
      "Chiffre d'affaires minimum requis",
      "Garantie de soumission",
      "Ligne de crédit bancaire (si nécessaire)",
      "Plan de financement du projet",
    ],
  },
  {
    id: "doc-4",
    title: "Offre technique",
    items: [
      "Mémoire technique détaillé",
      "Planning d'exécution",
      "Plan d'assurance qualité",
      "Mesures environnementales et sociales",
      "Plan de gestion des risques",
    ],
  },
]

export default function AppelsOffres() {
  const [tenders, setTenders] = useState<Tender[]>(initialTenders)
  const [filteredTenders, setFilteredTenders] = useState<Tender[]>(initialTenders)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<TenderStatus | "Tous">("Tous")
  const [categoryFilter, setCategoryFilter] = useState<TenderCategory | "Tous">("Tous")
  const [faqSearchTerm, setFaqSearchTerm] = useState("")
  const [filteredFaqs, setFilteredFaqs] = useState<FAQ[]>(faqs)
  const [isSubmissionDialogOpen, setIsSubmissionDialogOpen] = useState(false)
  const [selectedTender, setSelectedTender] = useState<Tender | null>(null)

  // Effet pour filtrer les appels d'offres
  useEffect(() => {
    let results = tenders

    // Filtre par terme de recherche
    if (searchTerm) {
      results = results.filter(
        (tender) =>
          tender.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tender.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filtre par statut
    if (statusFilter !== "Tous") {
      results = results.filter((tender) => tender.status === statusFilter)
    }

    // Filtre par catégorie
    if (categoryFilter !== "Tous") {
      results = results.filter((tender) => tender.category === categoryFilter)
    }

    setFilteredTenders(results)
  }, [searchTerm, statusFilter, categoryFilter, tenders])

  // Effet pour filtrer les FAQs
  useEffect(() => {
    if (faqSearchTerm) {
      const results = faqs.filter(
        (faq) =>
          faq.question.toLowerCase().includes(faqSearchTerm.toLowerCase()) ||
          faq.answer.toLowerCase().includes(faqSearchTerm.toLowerCase()),
      )
      setFilteredFaqs(results)
    } else {
      setFilteredFaqs(faqs)
    }
  }, [faqSearchTerm])

  // Fonction pour basculer l'expansion d'un appel d'offres
  const toggleTenderExpansion = (id: string) => {
    setTenders((prevTenders) =>
      prevTenders.map((tender) => (tender.id === id ? { ...tender, expanded: !tender.expanded } : tender)),
    )
  }

  // Fonction pour ouvrir le dialogue de soumission
  const openSubmissionDialog = (tender: Tender) => {
    setSelectedTender(tender)
    setIsSubmissionDialogOpen(true)
  }

  // Animation variants
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
      transition: { type: "spring", stiffness: 100 },
    },
  }

  // Fonction pour obtenir la couleur du badge de statut
  const getStatusColor = (status: TenderStatus) => {
    switch (status) {
      case "Ouvert":
        return "bg-green-100 text-green-800 hover:bg-green-200"
      case "Clôturé":
        return "bg-red-100 text-red-800 hover:bg-red-200"
      case "En évaluation":
        return "bg-amber-100 text-amber-800 hover:bg-amber-200"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200"
    }
  }

  // Fonction pour obtenir l'icône de catégorie
  const getCategoryIcon = (category: TenderCategory) => {
    switch (category) {
      case "BTP":
        return <Building className="h-5 w-5 text-[#D4AF37]" />
      case "Logistique":
        return <Clock className="h-5 w-5 text-[#D4AF37]" />
      case "Maintenance":
        return <FileText className="h-5 w-5 text-[#D4AF37]" />
      case "Équipement":
        return <DollarSign className="h-5 w-5 text-[#D4AF37]" />
      case "Services":
        return <Calendar className="h-5 w-5 text-[#D4AF37]" />
      case "Informatique":
        return <FileText className="h-5 w-5 text-[#D4AF37]" />
      default:
        return <FileText className="h-5 w-5 text-[#D4AF37]" />
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Hero Section */}
      <PageHeader
        title="Appels d'Offres"
        description="Consultez les opportunités d'affaires et participez aux appels d'offres du Port Autonome de Nouadhibou"
      />

      {/* Contenu principal */}
      <main className="flex-grow max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-12">
        <Tabs defaultValue="marches" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="marches" className="text-lg">
              Marchés en cours
            </TabsTrigger>
            <TabsTrigger value="documents" className="text-lg">
              Documents & Critères
            </TabsTrigger>
            <TabsTrigger value="faq" className="text-lg">
              FAQ
            </TabsTrigger>
          </TabsList>

          {/* Section 1: Marchés en cours et procédures de soumission */}
          <TabsContent value="marches">
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
              <motion.div variants={itemVariants} className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-[#003366] mb-6">Marchés en cours et procédures de soumission</h2>

                {/* Filtres */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <Input
                      type="text"
                      placeholder="Rechercher un appel d'offres..."
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  <Select
                    value={statusFilter}
                    onValueChange={(value) => setStatusFilter(value as TenderStatus | "Tous")}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Filtrer par statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Tous">Tous les statuts</SelectItem>
                      <SelectItem value="Ouvert">Ouvert</SelectItem>
                      <SelectItem value="En évaluation">En évaluation</SelectItem>
                      <SelectItem value="Clôturé">Clôturé</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select
                    value={categoryFilter}
                    onValueChange={(value) => setCategoryFilter(value as TenderCategory | "Tous")}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Filtrer par catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Tous">Toutes les catégories</SelectItem>
                      <SelectItem value="BTP">BTP</SelectItem>
                      <SelectItem value="Logistique">Logistique</SelectItem>
                      <SelectItem value="Maintenance">Maintenance</SelectItem>
                      <SelectItem value="Équipement">Équipement</SelectItem>
                      <SelectItem value="Services">Services</SelectItem>
                      <SelectItem value="Informatique">Informatique</SelectItem>
                      <SelectItem value="Autre">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Liste des appels d'offres */}
                <div className="space-y-4">
                  {filteredTenders.length > 0 ? (
                    filteredTenders.map((tender) => (
                      <motion.div
                        key={tender.id}
                        className={cn(
                          "border rounded-lg overflow-hidden transition-all duration-300",
                          tender.expanded ? "shadow-lg" : "shadow-sm hover:shadow-md",
                        )}
                        layout
                      >
                        <div
                          className="p-4 cursor-pointer flex flex-col md:flex-row md:items-center justify-between bg-[#F5F5F5]"
                          onClick={() => toggleTenderExpansion(tender.id)}
                        >
                          <div className="flex items-start space-x-3">
                            <div className="mt-1">{getCategoryIcon(tender.category)}</div>
                            <div>
                              <h3 className="text-lg font-semibold text-[#003366]">{tender.title}</h3>
                              <p className="text-sm text-gray-600 mt-1">Référence: {tender.id}</p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-3 mt-3 md:mt-0">
                            <Badge className={getStatusColor(tender.status)}>{tender.status}</Badge>
                            <Badge variant="outline" className="bg-white">
                              {tender.category}
                            </Badge>
                            <span className="text-sm font-medium">
                              Échéance: {new Date(tender.deadline).toLocaleDateString("fr-FR")}
                            </span>
                            {tender.expanded ? (
                              <ChevronUp className="h-5 w-5 text-gray-500" />
                            ) : (
                              <ChevronDown className="h-5 w-5 text-gray-500" />
                            )}
                          </div>
                        </div>

                        {tender.expanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="p-4 bg-white border-t"
                          >
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              <div className="md:col-span-2">
                                <h4 className="font-semibold text-[#003366] mb-2">Description</h4>
                                <p className="text-gray-700 mb-4">{tender.description}</p>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                  <div>
                                    <h4 className="font-semibold text-[#003366] mb-2">Budget prévisionnel</h4>
                                    <p className="text-gray-700 flex items-center">
                                      <DollarSign className="h-4 w-4 mr-1 text-[#D4AF37]" />
                                      {tender.budget}
                                    </p>
                                  </div>

                                  <div>
                                    <h4 className="font-semibold text-[#003366] mb-2">Date limite</h4>
                                    <p className="text-gray-700 flex items-center">
                                      <Calendar className="h-4 w-4 mr-1 text-[#D4AF37]" />
                                      {new Date(tender.deadline).toLocaleDateString("fr-FR")}
                                    </p>
                                  </div>
                                </div>

                                {tender.company && (
                                  <div className="mb-4">
                                    <h4 className="font-semibold text-[#003366] mb-2">Entreprise adjudicatrice</h4>
                                    <p className="text-gray-700 flex items-center">
                                      <Building className="h-4 w-4 mr-1 text-[#D4AF37]" />
                                      {tender.company}
                                    </p>
                                  </div>
                                )}
                              </div>

                              <div className="bg-[#F5F5F5] p-4 rounded-lg">
                                <h4 className="font-semibold text-[#003366] mb-3">Documents disponibles</h4>
                                <ul className="space-y-2">
                                  {tender.documents.map((doc, index) => (
                                    <li key={index}>
                                      <Button
                                        variant="outline"
                                        className="w-full justify-start hover:bg-[#D4AF37]/10"
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          // Logique de téléchargement
                                        }}
                                      >
                                        <Download className="h-4 w-4 mr-2 text-[#D4AF37]" />
                                        {doc.name}
                                      </Button>
                                    </li>
                                  ))}
                                </ul>

                                <div className="mt-4">
                                  <Button
                                    className="w-full bg-[#D4AF37] hover:bg-[#C09A2C] text-white"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      openSubmissionDialog(tender)
                                    }}
                                  >
                                    Soumettre une offre
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">Aucun appel d'offres ne correspond à vos critères.</p>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          </TabsContent>

          {/* Section 2: Documents et critères d'éligibilité */}
          <TabsContent value="documents">
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
              <motion.div variants={itemVariants} className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-[#003366] mb-6">Documents et critères d'éligibilité</h2>

                {/* Infographie du processus */}
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-[#003366] mb-4">Processus de soumission</h3>
                  <div className="relative">
                    <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gray-200 transform -translate-y-1/2 z-0"></div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      {[
                        { step: 1, title: "Téléchargement", desc: "Téléchargez le dossier d'appel d'offres" },
                        { step: 2, title: "Préparation", desc: "Préparez votre offre technique et financière" },
                        { step: 3, title: "Soumission", desc: "Soumettez votre offre avant la date limite" },
                        { step: 4, title: "Évaluation", desc: "Attendez les résultats de l'évaluation" },
                      ].map((item, index) => (
                        <div key={index} className="relative z-10 flex flex-col items-center">
                          <div className="w-12 h-12 rounded-full bg-[#003366] text-white flex items-center justify-center font-bold text-lg mb-2">
                            {item.step}
                          </div>
                          <h4 className="font-semibold text-[#003366] mb-1">{item.title}</h4>
                          <p className="text-sm text-center text-gray-600">{item.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Accordéons des documents */}
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-[#003366] mb-4">Documents requis</h3>
                  <Accordion type="single" collapsible className="w-full">
                    {eligibilityDocuments.map((doc) => (
                      <AccordionItem key={doc.id} value={doc.id} className="border rounded-lg mb-3 overflow-hidden">
                        <AccordionTrigger className="px-4 py-3 hover:bg-[#F5F5F5] hover:no-underline">
                          <div className="flex items-center">
                            <FileText className="h-5 w-5 mr-2 text-[#D4AF37]" />
                            <span className="font-medium">{doc.title}</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 py-3 bg-[#F5F5F5]">
                          <ul className="space-y-2">
                            {doc.items.map((item, index) => (
                              <li key={index} className="flex items-start">
                                <div className="h-5 w-5 mr-2 flex-shrink-0">
                                  <Checkbox id={`${doc.id}-item-${index}`} />
                                </div>
                                <Label htmlFor={`${doc.id}-item-${index}`} className="text-gray-700">
                                  {item}
                                </Label>
                              </li>
                            ))}
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>

                {/* Téléchargement du guide */}
                <div className="bg-[#F5F5F5] p-6 rounded-lg">
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-[#003366] mb-2">Guide officiel de soumission</h3>
                      <p className="text-gray-600 mb-4 md:mb-0">
                        Téléchargez notre guide complet pour préparer votre offre selon les normes requises
                      </p>
                    </div>
                    <Button className="bg-[#D4AF37] hover:bg-[#C09A2C] text-white">
                      <Download className="h-4 w-4 mr-2" />
                      Télécharger le guide
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </TabsContent>

          {/* Section 3: Foire aux questions (FAQ) */}
          <TabsContent value="faq">
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
              <motion.div variants={itemVariants} className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-[#003366] mb-6">Foire aux questions (FAQ)</h2>

                {/* Recherche FAQ */}
                <div className="relative mb-8">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    type="text"
                    placeholder="Rechercher une question..."
                    className="pl-10"
                    value={faqSearchTerm}
                    onChange={(e) => setFaqSearchTerm(e.target.value)}
                  />
                </div>

                {/* Liste des questions */}
                <div className="space-y-4">
                  {filteredFaqs.length > 0 ? (
                    <Accordion type="single" collapsible className="w-full">
                      {filteredFaqs.map((faq) => (
                        <AccordionItem key={faq.id} value={faq.id} className="border rounded-lg mb-3 overflow-hidden">
                          <AccordionTrigger className="px-4 py-3 hover:bg-[#F5F5F5] hover:no-underline">
                            <div className="flex items-center text-left">
                              <HelpCircle className="h-5 w-5 mr-2 text-[#D4AF37] flex-shrink-0" />
                              <span className="font-medium">{faq.question}</span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="px-4 py-3 bg-[#F5F5F5]">
                            <p className="text-gray-700">{faq.answer}</p>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">Aucune question ne correspond à votre recherche.</p>
                    </div>
                  )}
                </div>

                {/* Poser une question */}
                <div className="mt-8 p-6 bg-[#F5F5F5] rounded-lg">
                  <h3 className="text-xl font-semibold text-[#003366] mb-4">Vous ne trouvez pas de réponse ?</h3>
                  <p className="text-gray-600 mb-4">
                    Posez-nous directement votre question et nous vous répondrons dans les plus brefs délais.
                  </p>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="bg-[#D4AF37] hover:bg-[#C09A2C] text-white">
                        <HelpCircle className="h-4 w-4 mr-2" />
                        Poser une question
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle>Poser une question</DialogTitle>
                        <DialogDescription>
                          Remplissez le formulaire ci-dessous pour nous soumettre votre question.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="name" className="text-right">
                            Nom
                          </Label>
                          <Input id="name" className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="email" className="text-right">
                            Email
                          </Label>
                          <Input id="email" type="email" className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="subject" className="text-right">
                            Sujet
                          </Label>
                          <Input id="subject" className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="question" className="text-right">
                            Question
                          </Label>
                          <Textarea id="question" className="col-span-3" rows={4} />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit" className="bg-[#D4AF37] hover:bg-[#C09A2C] text-white">
                          <Send className="h-4 w-4 mr-2" />
                          Envoyer
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </motion.div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Dialogue de soumission d'offre */}
      <Dialog open={isSubmissionDialogOpen} onOpenChange={setIsSubmissionDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Soumettre une offre</DialogTitle>
            <DialogDescription>
              {selectedTender && `Référence: ${selectedTender.id} - ${selectedTender.title}`}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="company" className="text-right">
                Entreprise
              </Label>
              <Input id="company" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="contact" className="text-right">
                Contact
              </Label>
              <Input id="contact" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input id="email" type="email" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                Téléphone
              </Label>
              <Input id="phone" className="col-span-3" />
            </div>
            <Separator className="my-2" />
            <div className="space-y-2">
              <Label>Documents à joindre</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="border rounded-lg p-3 bg-[#F5F5F5]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 mr-2 text-[#D4AF37]" />
                      <span>Offre technique</span>
                    </div>
                    <Button variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-1" />
                      Ajouter
                    </Button>
                  </div>
                </div>
                <div className="border rounded-lg p-3 bg-[#F5F5F5]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 mr-2 text-[#D4AF37]" />
                      <span>Offre financière</span>
                    </div>
                    <Button variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-1" />
                      Ajouter
                    </Button>
                  </div>
                </div>
                <div className="border rounded-lg p-3 bg-[#F5F5F5]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 mr-2 text-[#D4AF37]" />
                      <span>Documents administratifs</span>
                    </div>
                    <Button variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-1" />
                      Ajouter
                    </Button>
                  </div>
                </div>
                <div className="border rounded-lg p-3 bg-[#F5F5F5]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 mr-2 text-[#D4AF37]" />
                      <span>Autres documents</span>
                    </div>
                    <Button variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-1" />
                      Ajouter
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="notes" className="text-right pt-2">
                Notes
              </Label>
              <Textarea id="notes" className="col-span-3" rows={3} placeholder="Informations complémentaires..." />
            </div>
            <div className="flex items-center space-x-2 col-span-full">
              <Checkbox id="terms" />
              <Label htmlFor="terms" className="text-sm">
                J'accepte les conditions générales et certifie l'exactitude des informations fournies
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSubmissionDialogOpen(false)}>
              Annuler
            </Button>
            <Button className="bg-[#D4AF37] hover:bg-[#C09A2C] text-white">
              <Send className="h-4 w-4 mr-2" />
              Soumettre l'offre
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
