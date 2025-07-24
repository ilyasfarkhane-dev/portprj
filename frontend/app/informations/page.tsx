"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  Download,
  ChevronRight,
  Search,
  FileText,
  Ship,
  Anchor,
  Package,
  Truck,
  Clock,
  DollarSign,
  FileCheck,
  HelpCircle,
  MessageSquare,
  MapPin,
  Plus,
  Minus,
  ExternalLink,
  Calendar,
  Users,
  Clipboard,
  CheckCircle,
  AlertCircle,
  Info,
  X,
} from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DecorativeBorder } from "@/components/decorative-border"

// Données pour les tarifs portuaires
const portFees = [
  {
    category: "Droits de port",
    items: [
      { service: "Droit d'entrée", unit: "Tonnage brut", tarif: "0.25 USD/TJB", notes: "Minimum 100 USD" },
      { service: "Droit de séjour", unit: "Jour", tarif: "0.10 USD/TJB/jour", notes: "Après 5 jours" },
      { service: "Droit de balisage", unit: "Entrée", tarif: "0.15 USD/TJB", notes: "Payable à chaque entrée" },
    ],
  },
  {
    category: "Frais de manutention",
    items: [
      { service: "Conteneur 20'", unit: "Unité", tarif: "120 USD", notes: "Chargement ou déchargement" },
      { service: "Conteneur 40'", unit: "Unité", tarif: "180 USD", notes: "Chargement ou déchargement" },
      { service: "Marchandises générales", unit: "Tonne", tarif: "8 USD/tonne", notes: "Selon nature" },
    ],
  },
  {
    category: "Frais de stockage",
    items: [
      { service: "Zone de transit", unit: "m²/jour", tarif: "0.50 USD/m²/jour", notes: "Après 7 jours" },
      { service: "Entrepôt couvert", unit: "m²/jour", tarif: "1.20 USD/m²/jour", notes: "Selon disponibilité" },
      { service: "Conteneur plein", unit: "Unité/jour", tarif: "15-25 USD/jour", notes: "Selon taille" },
    ],
  },
  {
    category: "Services auxiliaires",
    items: [
      { service: "Fourniture d'eau", unit: "m³", tarif: "5 USD/m³", notes: "Minimum 10m³" },
      { service: "Fourniture d'électricité", unit: "kWh", tarif: "0.30 USD/kWh", notes: "Selon disponibilité" },
      { service: "Remorquage", unit: "Opération", tarif: "500-1500 USD", notes: "Selon tonnage" },
    ],
  },
]

// Données pour les procédures douanières
const customsProcedures = [
  {
    id: "import",
    title: "Procédures d'importation",
    steps: [
      {
        title: "Déclaration préalable",
        description: "Soumission électronique de la déclaration d'importation via le système SYDONIA",
        documents: ["Connaissement maritime (B/L)", "Facture commerciale", "Liste de colisage", "Certificat d'origine"],
        deadline: "24h avant l'arrivée du navire",
        icon: <FileText className="h-8 w-8 text-[#D4AF37]" />,
      },
      {
        title: "Inspection et contrôle",
        description: "Vérification physique des marchandises par les services douaniers",
        documents: ["Déclaration d'importation", "Autorisation spécifique (si applicable)"],
        deadline: "Pendant le déchargement",
        icon: <Search className="h-8 w-8 text-[#D4AF37]" />,
      },
      {
        title: "Paiement des droits et taxes",
        description: "Règlement des droits de douane et taxes applicables",
        documents: ["Avis de liquidation", "Preuve de paiement"],
        deadline: "Avant la mainlevée",
        icon: <DollarSign className="h-8 w-8 text-[#D4AF37]" />,
      },
      {
        title: "Mainlevée et enlèvement",
        description: "Autorisation de sortie des marchandises du port",
        documents: ["Bon à délivrer (BAD)", "Quittance de paiement"],
        deadline: "Dans les 7 jours après mainlevée",
        icon: <Truck className="h-8 w-8 text-[#D4AF37]" />,
      },
    ],
  },
  {
    id: "export",
    title: "Procédures d'exportation",
    steps: [
      {
        title: "Déclaration d'exportation",
        description: "Enregistrement de la déclaration d'exportation via SYDONIA",
        documents: ["Facture commerciale", "Liste de colisage", "Certificat d'origine"],
        deadline: "48h avant chargement",
        icon: <FileCheck className="h-8 w-8 text-[#D4AF37]" />,
      },
      {
        title: "Contrôle documentaire",
        description: "Vérification des documents d'exportation",
        documents: ["Licence d'exportation (si applicable)", "Certificats spécifiques"],
        deadline: "24h avant chargement",
        icon: <Clipboard className="h-8 w-8 text-[#D4AF37]" />,
      },
      {
        title: "Inspection physique",
        description: "Vérification des marchandises à exporter (si applicable)",
        documents: ["Déclaration d'exportation", "Autorisation d'embarquement"],
        deadline: "Avant chargement",
        icon: <Search className="h-8 w-8 text-[#D4AF37]" />,
      },
      {
        title: "Validation et chargement",
        description: "Autorisation finale d'exportation et chargement",
        documents: ["Bon d'embarquement", "Manifeste d'exportation"],
        deadline: "Selon planning navire",
        icon: <Ship className="h-8 w-8 text-[#D4AF37]" />,
      },
    ],
  },
]

// Données pour les instructions aux armateurs
const shipOperatorInstructions = [
  {
    id: 1,
    title: "Pré-enregistrement de l'escale",
    description: "Soumission des informations du navire et de la cargaison",
    details:
      "L'agent maritime doit soumettre une demande d'escale au moins 72 heures avant l'arrivée prévue du navire. Cette demande doit inclure les détails du navire, l'estimation de l'heure d'arrivée (ETA), la nature et le volume de la cargaison, ainsi que les besoins spécifiques en termes de services portuaires.",
    documents: [
      "Formulaire de demande d'escale",
      "Manifeste de cargaison",
      "Déclaration de sûreté",
      "Liste d'équipage",
    ],
    deadline: "72 heures avant l'arrivée",
    icon: <Calendar className="h-10 w-10 text-[#D4AF37]" />,
  },
  {
    id: 2,
    title: "Attribution d'un poste à quai",
    description: "Coordination avec les autorités portuaires pour l'amarrage",
    details:
      "Sur la base des informations fournies et de la disponibilité des infrastructures, le PAN attribuera un poste à quai spécifique. L'agent maritime sera informé de cette attribution et devra confirmer l'acceptation des conditions d'amarrage. Des ajustements peuvent être nécessaires en fonction du trafic portuaire.",
    documents: ["Confirmation d'attribution de poste", "Plan d'amarrage"],
    deadline: "48 heures avant l'arrivée",
    icon: <Anchor className="h-10 w-10 text-[#D4AF37]" />,
  },
  {
    id: 3,
    title: "Formalités d'arrivée",
    description: "Procédures douanières et d'immigration à l'arrivée",
    details:
      "Dès l'arrivée du navire, les autorités (douanes, immigration, santé) procéderont aux formalités obligatoires. L'agent maritime doit s'assurer que tous les documents nécessaires sont disponibles et que le capitaine du navire est prêt à recevoir les autorités. Ces formalités doivent être complétées avant le début des opérations commerciales.",
    documents: [
      "Déclaration générale",
      "Déclaration maritime de santé",
      "Liste des passagers",
      "Déclaration des provisions de bord",
    ],
    deadline: "À l'arrivée du navire",
    icon: <Users className="h-10 w-10 text-[#D4AF37]" />,
  },
  {
    id: 4,
    title: "Opérations de chargement/déchargement",
    description: "Coordination des opérations de manutention",
    details:
      "Les opérations de chargement et déchargement doivent être coordonnées avec les services de manutention du port. L'agent doit s'assurer que toutes les autorisations nécessaires ont été obtenues et que les règles de sécurité sont respectées. Un plan de chargement/déchargement doit être soumis et approuvé avant le début des opérations.",
    documents: [
      "Plan de chargement/déchargement",
      "Autorisations spéciales (marchandises dangereuses)",
      "Rapport journalier d'opérations",
    ],
    deadline: "24 heures avant le début des opérations",
    icon: <Package className="h-10 w-10 text-[#D4AF37]" />,
  },
  {
    id: 5,
    title: "Formalités de départ et paiements",
    description: "Procédures de sortie et règlement des frais portuaires",
    details:
      "Avant le départ du navire, toutes les formalités de sortie doivent être complétées et tous les frais portuaires doivent être réglés. L'agent maritime doit obtenir une autorisation de départ auprès des autorités portuaires et s'assurer que le capitaine dispose de tous les documents nécessaires pour le voyage suivant.",
    documents: [
      "Autorisation de départ",
      "Facture des services portuaires",
      "Reçu de paiement",
      "Déclaration de sortie",
    ],
    deadline: "6 heures avant le départ",
    icon: <FileCheck className="h-10 w-10 text-[#D4AF37]" />,
  },
]

// Données pour les FAQ importateurs/exportateurs
const faqItems = [
  {
    question: "Quels sont les documents requis pour l'importation de marchandises?",
    answer:
      "Pour importer des marchandises via le Port Autonome de Nouadhibou, vous devez fournir: un connaissement maritime (B/L), une facture commerciale, une liste de colisage, un certificat d'origine, et une déclaration d'importation via le système SYDONIA. Des documents supplémentaires peuvent être requis selon la nature des marchandises (certificats sanitaires, phytosanitaires, etc.).",
  },
  {
    question: "Comment calculer les droits de douane pour mes importations?",
    answer:
      "Les droits de douane sont calculés sur la valeur CAF (Coût, Assurance, Fret) des marchandises. Le taux varie selon la catégorie de produits, conformément au tarif douanier mauritanien. En général, les taux varient de 0% à 20%. À cela s'ajoutent la TVA (16%) et diverses taxes spécifiques. Pour un calcul précis, consultez le service des douanes ou utilisez le simulateur disponible sur le portail douanier.",
  },
  {
    question: "Quel est le délai moyen de dédouanement des marchandises?",
    answer:
      "Le délai moyen de dédouanement varie de 2 à 5 jours ouvrables, selon la nature des marchandises et la complexité des procédures. Ce délai peut être réduit si tous les documents sont correctement préparés à l'avance et si les déclarations électroniques sont soumises dans les délais. Le statut de votre dédouanement peut être suivi via le système SYDONIA.",
  },
  {
    question: "Existe-t-il des procédures simplifiées pour les opérateurs réguliers?",
    answer:
      "Oui, les importateurs et exportateurs réguliers peuvent bénéficier du statut d'Opérateur Économique Agréé (OEA), qui offre des procédures simplifiées et accélérées. Pour obtenir ce statut, vous devez déposer une demande auprès de la Direction Générale des Douanes et répondre à certains critères de fiabilité et de conformité. Les avantages incluent un dédouanement prioritaire et des contrôles réduits.",
  },
  {
    question: "Comment obtenir un certificat d'origine pour mes exportations?",
    answer:
      "Les certificats d'origine sont délivrés par la Chambre de Commerce, d'Industrie et d'Agriculture de Mauritanie (CCIAM). Pour l'obtenir, vous devez soumettre une demande accompagnée de la facture commerciale, de la liste de colisage et d'une preuve de l'origine mauritanienne des produits. Le traitement prend généralement 1 à 2 jours ouvrables. Des frais administratifs s'appliquent selon la valeur des marchandises.",
  },
  {
    question: "Quelles sont les restrictions à l'importation et à l'exportation?",
    answer:
      "Certains produits sont soumis à des restrictions ou interdictions. Pour l'importation: armes et munitions (autorisation spéciale), produits pharmaceutiques (autorisation du Ministère de la Santé), produits alimentaires (contrôle sanitaire). Pour l'exportation: espèces protégées, biens culturels, certaines ressources naturelles. Consultez la liste complète sur le site des douanes mauritaniennes ou contactez le service réglementaire du PAN.",
  },
  {
    question: "Comment gérer les litiges douaniers?",
    answer:
      "En cas de litige avec les services douaniers, vous pouvez d'abord tenter une résolution à l'amiable avec l'inspecteur en charge de votre dossier. Si le désaccord persiste, vous pouvez soumettre une réclamation écrite au Directeur Régional des Douanes. Pour les cas plus complexes, la Commission de Conciliation et d'Expertise Douanière peut être saisie. Il est recommandé de consulter un transitaire agréé ou un avocat spécialisé.",
  },
  {
    question: "Quels sont les délais de franchise d'entreposage au port?",
    answer:
      "Le Port Autonome de Nouadhibou offre une franchise d'entreposage de 7 jours pour les marchandises générales et de 5 jours pour les conteneurs, à compter de la date de déchargement. Au-delà de cette période, des frais de magasinage sont appliqués selon le barème en vigueur. Pour les marchandises spéciales ou dangereuses, des conditions particulières peuvent s'appliquer.",
  },
]

// Données pour les points d'intérêt du port
const portMapPoints = [
  {
    id: 1,
    name: "Terminal à conteneurs",
    description: "Capacité de 50,000 EVP par an, équipé de 2 portiques de quai",
    coordinates: { x: 35, y: 30 },
    icon: <Package className="h-6 w-6" />,
  },
  {
    id: 2,
    name: "Quai de commerce",
    description: "Longueur de 450m, tirant d'eau de 10m, capacité d'accueil de navires jusqu'à 30,000 tonnes",
    coordinates: { x: 50, y: 25 },
    icon: <Ship className="h-6 w-6" />,
  },
  {
    id: 3,
    name: "Terminal pétrolier",
    description: "Capacité de stockage de 50,000 m³, tirant d'eau de 12m",
    coordinates: { x: 65, y: 40 },
    icon: <Truck className="h-6 w-6" />,
  },
  {
    id: 4,
    name: "Zone de stockage",
    description: "Surface de 15 hectares, entrepôts couverts et aires de stockage à ciel ouvert",
    coordinates: { x: 45, y: 50 },
    icon: <Package className="h-6 w-6" />,
  },
  {
    id: 5,
    name: "Poste de contrôle douanier",
    description: "Services douaniers et contrôles réglementaires",
    coordinates: { x: 30, y: 60 },
    icon: <FileCheck className="h-6 w-6" />,
  },
  {
    id: 6,
    name: "Administration portuaire",
    description: "Bureaux administratifs, services aux usagers",
    coordinates: { x: 20, y: 45 },
    icon: <Users className="h-6 w-6" />,
  },
  {
    id: 7,
    name: "Terminal de pêche",
    description: "Installations spécialisées pour les navires de pêche, capacité de traitement de 500 tonnes/jour",
    coordinates: { x: 75, y: 60 },
    icon: <Anchor className="h-6 w-6" />,
  },
]

export default function InformationsPage() {
  const [activeTab, setActiveTab] = useState("tarifs")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [activeTimelineStep, setActiveTimelineStep] = useState(1)
  const [selectedMapPoint, setSelectedMapPoint] = useState<number | null>(null)
  const [showChatHelp, setShowChatHelp] = useState(false)
  const [mapZoom, setMapZoom] = useState(1)

  const timelineRef = useRef<HTMLDivElement>(null)

  // Filtrer les tarifs en fonction de la recherche et de la catégorie
  const filteredFees = portFees
    .filter((category) => selectedCategory === "all" || category.category === selectedCategory)
    .map((category) => ({
      ...category,
      items: category.items.filter(
        (item) =>
          item.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.tarif.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    }))
    .filter((category) => category.items.length > 0)

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="relative bg-[#003366] py-20">
          <div className="container relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-3xl mx-auto text-center text-white"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Informations & Réglementation</h1>
              <p className="text-xl opacity-90 mb-8">
                Toutes les informations essentielles sur les tarifs, procédures et réglementations du Port Autonome de
                Nouadhibou
              </p>

              <div className="flex flex-wrap justify-center gap-4">
                <Button
                  size="lg"
                  className="bg-[#D4AF37] text-[#003366] hover:bg-white transition-all duration-300"
                  onClick={() => {
                    setActiveTab("tarifs")
                    document.getElementById("main-content")?.scrollIntoView({ behavior: "smooth" })
                  }}
                >
                  Consulter les tarifs
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-[#003366] transition-all duration-300"
                  onClick={() => {
                    setActiveTab("procedures")
                    document.getElementById("main-content")?.scrollIntoView({ behavior: "smooth" })
                  }}
                >
                  Voir les procédures
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </motion.div>
          </div>

          <div className="absolute bottom-0 left-0 right-0">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-auto">
              <path
                fill="#ffffff"
                fillOpacity="1"
                d="M0,288L48,272C96,256,192,224,288,213.3C384,203,480,213,576,229.3C672,245,768,267,864,261.3C960,256,1056,224,1152,208C1248,192,1344,192,1392,192L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
              ></path>
            </svg>
          </div>
        </section>

        <DecorativeBorder />

        {/* Main Content with Tabs */}
        <section id="main-content" className="py-12 bg-white">
          <div className="container">
            <Tabs defaultValue="tarifs" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-8">
                <TabsTrigger value="tarifs" className="text-base">
                  <DollarSign className="mr-2 h-4 w-4" />
                  Tarifs & Douanes
                </TabsTrigger>
                <TabsTrigger value="armateurs" className="text-base">
                  <Ship className="mr-2 h-4 w-4" />
                  Instructions Armateurs
                </TabsTrigger>
                <TabsTrigger value="importateurs" className="text-base">
                  <Package className="mr-2 h-4 w-4" />
                  Guide Import/Export
                </TabsTrigger>
                <TabsTrigger value="plan" className="text-base">
                  <MapPin className="mr-2 h-4 w-4" />
                  Plan du Port
                </TabsTrigger>
              </TabsList>

              {/* Section 1: Tarifs et procédures douanières */}
              <TabsContent value="tarifs">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                  <div className="lg:col-span-1">
                    <Card className="sticky top-24">
                      <CardHeader>
                        <CardTitle className="text-[#003366]">Filtres</CardTitle>
                        <CardDescription>Affinez votre recherche</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <label htmlFor="search" className="text-sm font-medium mb-1 block">
                            Rechercher
                          </label>
                          <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                            <Input
                              id="search"
                              placeholder="Rechercher un tarif..."
                              className="pl-9"
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-sm font-medium mb-1 block">Catégorie</label>
                          <div className="space-y-2">
                            <div className="flex items-center">
                              <input
                                type="radio"
                                id="all"
                                name="category"
                                checked={selectedCategory === "all"}
                                onChange={() => setSelectedCategory("all")}
                                className="h-4 w-4 text-[#003366]"
                              />
                              <label htmlFor="all" className="ml-2 text-sm">
                                Toutes les catégories
                              </label>
                            </div>

                            {portFees.map((category, index) => (
                              <div key={index} className="flex items-center">
                                <input
                                  type="radio"
                                  id={`category-${index}`}
                                  name="category"
                                  checked={selectedCategory === category.category}
                                  onChange={() => setSelectedCategory(category.category)}
                                  className="h-4 w-4 text-[#003366]"
                                />
                                <label htmlFor={`category-${index}`} className="ml-2 text-sm">
                                  {category.category}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="pt-4">
                          <Button
                            className="w-full bg-[#003366] hover:bg-[#003366]/90"
                            onClick={() => {
                              setSearchTerm("")
                              setSelectedCategory("all")
                            }}
                          >
                            Réinitialiser les filtres
                          </Button>
                        </div>

                        <div className="pt-4 border-t">
                          <h3 className="font-medium text-[#003366] mb-2">Documents utiles</h3>
                          <ul className="space-y-2">
                            <li>
                              <Button variant="ghost" className="w-full justify-start text-left" asChild>
                                <Link href="#" className="flex items-center">
                                  <FileText className="mr-2 h-4 w-4 text-[#D4AF37]" />
                                  <span>Grille tarifaire complète (PDF)</span>
                                </Link>
                              </Button>
                            </li>
                            <li>
                              <Button variant="ghost" className="w-full justify-start text-left" asChild>
                                <Link href="#" className="flex items-center">
                                  <FileText className="mr-2 h-4 w-4 text-[#D4AF37]" />
                                  <span>Guide des procédures douanières</span>
                                </Link>
                              </Button>
                            </li>
                            <li>
                              <Button variant="ghost" className="w-full justify-start text-left" asChild>
                                <Link href="#" className="flex items-center">
                                  <FileText className="mr-2 h-4 w-4 text-[#D4AF37]" />
                                  <span>Formulaires administratifs</span>
                                </Link>
                              </Button>
                            </li>
                          </ul>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button
                          variant="outline"
                          className="w-full border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37]/10"
                          onClick={() => setShowChatHelp(true)}
                        >
                          <HelpCircle className="mr-2 h-4 w-4" />
                          Besoin d'aide ?
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>

                  <div className="lg:col-span-3">
                    <motion.div
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      variants={fadeIn}
                      className="mb-8"
                    >
                      <h2 className="text-3xl font-bold text-[#003366] mb-4">Tarifs et procédures douanières</h2>
                      <p className="text-gray-600">
                        Consultez les tarifs portuaires en vigueur et les procédures douanières applicables au Port
                        Autonome de Nouadhibou. Tous les tarifs sont indiqués en USD et sont susceptibles d'être
                        modifiés. Pour toute information complémentaire, veuillez contacter le service commercial.
                      </p>
                    </motion.div>

                    <div className="mb-8">
                      <Tabs defaultValue="tarifs-portuaires" className="w-full">
                        <TabsList className="mb-6">
                          <TabsTrigger value="tarifs-portuaires">Tarifs portuaires</TabsTrigger>
                          <TabsTrigger value="procedures-douanieres">Procédures douanières</TabsTrigger>
                        </TabsList>

                        <TabsContent value="tarifs-portuaires">
                          {filteredFees.length > 0 ? (
                            <motion.div
                              initial="hidden"
                              whileInView="visible"
                              viewport={{ once: true }}
                              variants={staggerContainer}
                              className="space-y-8"
                            >
                              {filteredFees.map((category, categoryIndex) => (
                                <motion.div key={categoryIndex} variants={itemVariant}>
                                  <Card>
                                    <CardHeader className="bg-[#F5F5F5]">
                                      <CardTitle className="text-[#003366] flex items-center">
                                        <DollarSign className="mr-2 h-5 w-5 text-[#D4AF37]" />
                                        {category.category}
                                      </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-0">
                                      <Table>
                                        <TableHeader>
                                          <TableRow>
                                            <TableHead>Service</TableHead>
                                            <TableHead>Unité</TableHead>
                                            <TableHead>Tarif</TableHead>
                                            <TableHead>Notes</TableHead>
                                          </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                          {category.items.map((item, itemIndex) => (
                                            <TableRow key={itemIndex}>
                                              <TableCell className="font-medium">{item.service}</TableCell>
                                              <TableCell>{item.unit}</TableCell>
                                              <TableCell>{item.tarif}</TableCell>
                                              <TableCell className="text-gray-500">{item.notes}</TableCell>
                                            </TableRow>
                                          ))}
                                        </TableBody>
                                      </Table>
                                    </CardContent>
                                  </Card>
                                </motion.div>
                              ))}
                            </motion.div>
                          ) : (
                            <div className="text-center py-12 bg-gray-50 rounded-lg">
                              <Search className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun résultat trouvé</h3>
                              <p className="text-gray-500 max-w-md mx-auto">
                                Aucun tarif ne correspond à votre recherche. Essayez de modifier vos critères ou de
                                réinitialiser les filtres.
                              </p>
                            </div>
                          )}

                          <div className="mt-8 flex justify-between items-center">
                            <p className="text-sm text-gray-500">Dernière mise à jour: 15 mars 2025</p>
                            <Button className="bg-[#003366] hover:bg-[#003366]/90">
                              <Download className="mr-2 h-4 w-4" />
                              Télécharger la grille tarifaire complète
                            </Button>
                          </div>
                        </TabsContent>

                        <TabsContent value="procedures-douanieres">
                          <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={staggerContainer}
                            className="space-y-8"
                          >
                            {customsProcedures.map((procedure, index) => (
                              <motion.div key={procedure.id} variants={itemVariant}>
                                <Card>
                                  <CardHeader className="bg-[#F5F5F5]">
                                    <CardTitle className="text-[#003366]">{procedure.title}</CardTitle>
                                    <CardDescription>
                                      Suivez ces étapes pour compléter vos formalités douanières
                                    </CardDescription>
                                  </CardHeader>
                                  <CardContent className="pt-6">
                                    <ol className="relative border-l border-gray-200">
                                      {procedure.steps.map((step, stepIndex) => (
                                        <li key={stepIndex} className="mb-10 ml-6">
                                          <span className="absolute flex items-center justify-center w-10 h-10 bg-[#003366] rounded-full -left-5 ring-4 ring-white">
                                            {step.icon}
                                          </span>
                                          <h3 className="flex items-center mb-1 text-lg font-semibold text-[#003366]">
                                            {step.title}
                                            <Badge
                                              variant="outline"
                                              className="ml-3 text-xs font-medium border-[#D4AF37] text-[#D4AF37]"
                                            >
                                              Étape {stepIndex + 1}
                                            </Badge>
                                          </h3>
                                          <time className="block mb-2 text-sm font-normal leading-none text-gray-500">
                                            Délai: {step.deadline}
                                          </time>
                                          <p className="mb-4 text-base font-normal text-gray-600">{step.description}</p>
                                          <div className="mb-4">
                                            <h4 className="text-sm font-medium text-gray-900 mb-2">
                                              Documents requis:
                                            </h4>
                                            <ul className="space-y-1 text-gray-600">
                                              {step.documents.map((doc, docIndex) => (
                                                <li key={docIndex} className="flex items-start">
                                                  <ChevronRight className="h-4 w-4 text-[#D4AF37] mr-2 mt-0.5 shrink-0" />
                                                  <span>{doc}</span>
                                                </li>
                                              ))}
                                            </ul>
                                          </div>
                                        </li>
                                      ))}
                                    </ol>
                                  </CardContent>
                                  <CardFooter className="bg-gray-50 flex justify-between">
                                    <Button variant="outline">
                                      <FileText className="mr-2 h-4 w-4" />
                                      Télécharger le guide détaillé
                                    </Button>
                                    <Button className="bg-[#003366] hover:bg-[#003366]/90">
                                      <ExternalLink className="mr-2 h-4 w-4" />
                                      Accéder au système SYDONIA
                                    </Button>
                                  </CardFooter>
                                </Card>
                              </motion.div>
                            ))}
                          </motion.div>

                          <div className="mt-8 p-6 bg-[#003366]/5 rounded-lg">
                            <div className="flex items-start">
                              <Info className="h-6 w-6 text-[#003366] mr-4 shrink-0 mt-1" />
                              <div>
                                <h3 className="text-lg font-medium text-[#003366] mb-2">Information importante</h3>
                                <p className="text-gray-600 mb-4">
                                  Les procédures douanières peuvent être sujettes à modification. Il est recommandé de
                                  vérifier les informations les plus récentes auprès des services douaniers ou de votre
                                  transitaire avant d'initier vos opérations d'import/export.
                                </p>
                                <div className="flex flex-wrap gap-4">
                                  <Button variant="outline" className="border-[#003366] text-[#003366]">
                                    <HelpCircle className="mr-2 h-4 w-4" />
                                    Contacter un conseiller
                                  </Button>
                                  <Button className="bg-[#003366] hover:bg-[#003366]/90">
                                    <FileText className="mr-2 h-4 w-4" />
                                    Guide complet des procédures
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Section 2: Instructions pour les armateurs et opérateurs */}
              <TabsContent value="armateurs">
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeIn}
                  className="mb-12 text-center max-w-3xl mx-auto"
                >
                  <h2 className="text-3xl font-bold text-[#003366] mb-4">
                    Instructions pour les armateurs et opérateurs
                  </h2>
                  <p className="text-gray-600">
                    Guide complet des procédures à suivre pour les armateurs et opérateurs de navires utilisant les
                    installations du Port Autonome de Nouadhibou. Suivez ces étapes pour assurer une escale efficace et
                    conforme aux réglementations.
                  </p>
                </motion.div>

                <div className="mb-16">
                  <div ref={timelineRef} className="relative">
                    {/* Timeline navigation */}
                    <div className="flex justify-between mb-8 relative">
                      <div className="absolute left-0 right-0 top-1/2 h-1 bg-gray-200 -translate-y-1/2 z-0"></div>

                      {shipOperatorInstructions.map((step, index) => (
                        <button
                          key={step.id}
                          className={`relative z-10 flex flex-col items-center transition-all duration-300 ${
                            activeTimelineStep === step.id ? "scale-110" : "opacity-70 hover:opacity-100"
                          }`}
                          onClick={() => setActiveTimelineStep(step.id)}
                        >
                          <div
                            className={`w-14 h-14 rounded-full flex items-center justify-center mb-2 transition-all ${
                              activeTimelineStep === step.id
                                ? "bg-[#003366] text-white ring-4 ring-[#003366]/20"
                                : "bg-white text-[#003366] border-2 border-[#003366]"
                            }`}
                          >
                            {index + 1}
                          </div>
                          <span
                            className={`text-sm font-medium text-center max-w-[100px] transition-all ${
                              activeTimelineStep === step.id ? "text-[#003366]" : "text-gray-500"
                            }`}
                          >
                            {step.title.split(" ")[0]}
                          </span>
                        </button>
                      ))}
                    </div>

                    {/* Timeline content */}
                    <AnimatePresence mode="wait">
                      {shipOperatorInstructions.map(
                        (step) =>
                          activeTimelineStep === step.id && (
                            <motion.div
                              key={step.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -20 }}
                              transition={{ duration: 0.3 }}
                            >
                              <Card className="border-t-4 border-[#003366]">
                                <CardHeader>
                                  <div className="flex items-center mb-2">
                                    <div className="w-12 h-12 rounded-full bg-[#003366]/10 flex items-center justify-center mr-4">
                                      {step.icon}
                                    </div>
                                    <div>
                                      <CardTitle className="text-2xl text-[#003366]">{step.title}</CardTitle>
                                      <CardDescription className="text-base">{step.description}</CardDescription>
                                    </div>
                                  </div>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                  <div>
                                    <h3 className="text-lg font-medium text-[#003366] mb-2">Détails de la procédure</h3>
                                    <p className="text-gray-600">{step.details}</p>
                                  </div>

                                  <div>
                                    <h3 className="text-lg font-medium text-[#003366] mb-2">Documents requis</h3>
                                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                      {step.documents.map((doc, index) => (
                                        <li key={index} className="flex items-start bg-gray-50 p-3 rounded-md">
                                          <FileText className="h-5 w-5 text-[#D4AF37] mr-3 shrink-0 mt-0.5" />
                                          <span>{doc}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>

                                  <div className="flex items-center p-4 bg-[#003366]/5 rounded-lg">
                                    <Clock className="h-6 w-6 text-[#D4AF37] mr-4 shrink-0" />
                                    <div>
                                      <h3 className="font-medium text-[#003366]">Délai important</h3>
                                      <p className="text-gray-600">{step.deadline}</p>
                                    </div>
                                  </div>
                                </CardContent>
                                <CardFooter className="flex justify-between bg-gray-50">
                                  <div className="flex gap-2">
                                    {step.id > 1 && (
                                      <Button variant="outline" onClick={() => setActiveTimelineStep(step.id - 1)}>
                                        <ChevronRight className="mr-2 h-4 w-4 rotate-180" />
                                        Étape précédente
                                      </Button>
                                    )}

                                    {step.id < shipOperatorInstructions.length && (
                                      <Button
                                        className="bg-[#003366] hover:bg-[#003366]/90"
                                        onClick={() => setActiveTimelineStep(step.id + 1)}
                                      >
                                        Étape suivante
                                        <ChevronRight className="ml-2 h-4 w-4" />
                                      </Button>
                                    )}
                                  </div>

                                  <Button variant="outline" className="border-[#D4AF37] text-[#D4AF37]">
                                    <Download className="mr-2 h-4 w-4" />
                                    Télécharger le formulaire
                                  </Button>
                                </CardFooter>
                              </Card>
                            </motion.div>
                          ),
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8 mt-12">
                  <Card>
                    <CardHeader className="bg-[#F5F5F5]">
                      <CardTitle className="text-[#003366]">
                        <Ship className="inline-block mr-2 h-5 w-5 text-[#D4AF37]" />
                        Guide complet pour les armateurs
                      </CardTitle>
                      <CardDescription>
                        Téléchargez notre guide détaillé pour les armateurs et opérateurs de navires
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <ul className="space-y-4">
                        <li className="flex items-start">
                          <FileText className="h-5 w-5 text-[#D4AF37] mr-3 shrink-0 mt-0.5" />
                          <div>
                            <h4 className="font-medium">Guide des procédures d'escale</h4>
                            <p className="text-sm text-gray-500">Format PDF - 2.5 MB</p>
                          </div>
                        </li>
                        <li className="flex items-start">
                          <FileText className="h-5 w-5 text-[#D4AF37] mr-3 shrink-0 mt-0.5" />
                          <div>
                            <h4 className="font-medium">Formulaires administratifs</h4>
                            <p className="text-sm text-gray-500">Format ZIP - 1.8 MB</p>
                          </div>
                        </li>
                        <li className="flex items-start">
                          <FileText className="h-5 w-5 text-[#D4AF37] mr-3 shrink-0 mt-0.5" />
                          <div>
                            <h4 className="font-medium">Réglementations portuaires</h4>
                            <p className="text-sm text-gray-500">Format PDF - 3.2 MB</p>
                          </div>
                        </li>
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full bg-[#003366] hover:bg-[#003366]/90">
                        <Download className="mr-2 h-4 w-4" />
                        Télécharger tous les documents
                      </Button>
                    </CardFooter>
                  </Card>

                  <Card>
                    <CardHeader className="bg-[#F5F5F5]">
                      <CardTitle className="text-[#003366]">
                        <MessageSquare className="inline-block mr-2 h-5 w-5 text-[#D4AF37]" />
                        Besoin d'assistance ?
                      </CardTitle>
                      <CardDescription>Contactez nos services pour un accompagnement personnalisé</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div className="flex items-start">
                          <Users className="h-5 w-5 text-[#D4AF37] mr-3 shrink-0 mt-0.5" />
                          <div>
                            <h4 className="font-medium">Service des Opérations Maritimes</h4>
                            <p className="text-sm text-gray-500">
                              Pour toute question relative aux escales et opérations portuaires
                            </p>
                            <p className="text-sm font-medium mt-1">+222 45 74 51 20 | operations@pan.mr</p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <Clock className="h-5 w-5 text-[#D4AF37] mr-3 shrink-0 mt-0.5" />
                          <div>
                            <h4 className="font-medium">Horaires de service</h4>
                            <p className="text-sm text-gray-500">Lundi au Vendredi: 8h00 - 17h00</p>
                            <p className="text-sm text-gray-500">Permanence 24/7 pour les urgences</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-[#003366]">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Demander un accompagnement
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </TabsContent>

              {/* Section 3: Guides pour les importateurs et exportateurs */}
              <TabsContent value="importateurs">
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeIn}
                  className="mb-12 text-center max-w-3xl mx-auto"
                >
                  <h2 className="text-3xl font-bold text-[#003366] mb-4">
                    Guides pour les importateurs et exportateurs
                  </h2>
                  <p className="text-gray-600">
                    Toutes les informations nécessaires pour faciliter vos opérations d'importation et d'exportation via
                    le Port Autonome de Nouadhibou. Consultez nos guides détaillés et accédez aux formulaires requis.
                  </p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-8 mb-12">
                  <Card className="border-t-4 border-[#003366]">
                    <CardHeader>
                      <div className="w-12 h-12 rounded-full bg-[#003366]/10 flex items-center justify-center mb-4">
                        <Package className="h-6 w-6 text-[#003366]" />
                      </div>
                      <CardTitle className="text-[#003366]">Guide d'importation</CardTitle>
                      <CardDescription>Procédures et formalités pour l'importation de marchandises</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 mb-6">
                        <li className="flex items-start">
                          <ChevronRight className="h-5 w-5 text-[#D4AF37] mr-2 shrink-0 mt-0.5" />
                          <span>Déclarations douanières</span>
                        </li>
                        <li className="flex items-start">
                          <ChevronRight className="h-5 w-5 text-[#D4AF37] mr-2 shrink-0 mt-0.5" />
                          <span>Droits et taxes applicables</span>
                        </li>
                        <li className="flex items-start">
                          <ChevronRight className="h-5 w-5 text-[#D4AF37] mr-2 shrink-0 mt-0.5" />
                          <span>Procédures d'inspection</span>
                        </li>
                        <li className="flex items-start">
                          <ChevronRight className="h-5 w-5 text-[#D4AF37] mr-2 shrink-0 mt-0.5" />
                          <span>Enlèvement des marchandises</span>
                        </li>
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full bg-[#003366] hover:bg-[#003366]/90">
                        <FileText className="mr-2 h-4 w-4" />
                        Consulter le guide complet
                      </Button>
                    </CardFooter>
                  </Card>

                  <Card className="border-t-4 border-[#D4AF37]">
                    <CardHeader>
                      <div className="w-12 h-12 rounded-full bg-[#D4AF37]/10 flex items-center justify-center mb-4">
                        <Ship className="h-6 w-6 text-[#D4AF37]" />
                      </div>
                      <CardTitle className="text-[#003366]">Guide d'exportation</CardTitle>
                      <CardDescription>Procédures et formalités pour l'exportation de marchandises</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 mb-6">
                        <li className="flex items-start">
                          <ChevronRight className="h-5 w-5 text-[#D4AF37] mr-2 shrink-0 mt-0.5" />
                          <span>Déclarations d'exportation</span>
                        </li>
                        <li className="flex items-start">
                          <ChevronRight className="h-5 w-5 text-[#D4AF37] mr-2 shrink-0 mt-0.5" />
                          <span>Certificats d'origine</span>
                        </li>
                        <li className="flex items-start">
                          <ChevronRight className="h-5 w-5 text-[#D4AF37] mr-2 shrink-0 mt-0.5" />
                          <span>Contrôles réglementaires</span>
                        </li>
                        <li className="flex items-start">
                          <ChevronRight className="h-5 w-5 text-[#D4AF37] mr-2 shrink-0 mt-0.5" />
                          <span>Procédures d'embarquement</span>
                        </li>
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-[#003366]">
                        <FileText className="mr-2 h-4 w-4" />
                        Consulter le guide complet
                      </Button>
                    </CardFooter>
                  </Card>

                  <Card className="border-t-4 border-gray-200">
                    <CardHeader>
                      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                        <FileCheck className="h-6 w-6 text-gray-600" />
                      </div>
                      <CardTitle className="text-[#003366]">Formulaires et documents</CardTitle>
                      <CardDescription>Accédez à tous les formulaires et documents nécessaires</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 mb-6">
                        <li className="flex items-start">
                          <ChevronRight className="h-5 w-5 text-[#D4AF37] mr-2 shrink-0 mt-0.5" />
                          <span>Formulaires douaniers</span>
                        </li>
                        <li className="flex items-start">
                          <ChevronRight className="h-5 w-5 text-[#D4AF37] mr-2 shrink-0 mt-0.5" />
                          <span>Demandes d'autorisation</span>
                        </li>
                        <li className="flex items-start">
                          <ChevronRight className="h-5 w-5 text-[#D4AF37] mr-2 shrink-0 mt-0.5" />
                          <span>Certificats et attestations</span>
                        </li>
                        <li className="flex items-start">
                          <ChevronRight className="h-5 w-5 text-[#D4AF37] mr-2 shrink-0 mt-0.5" />
                          <span>Modèles de déclaration</span>
                        </li>
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full" variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        Télécharger les formulaires
                      </Button>
                    </CardFooter>
                  </Card>
                </div>

                <div className="mb-12">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-[#003366] flex items-center">
                        <HelpCircle className="mr-2 h-5 w-5 text-[#D4AF37]" />
                        FAQ - Questions fréquemment posées
                      </CardTitle>
                      <CardDescription>
                        Trouvez rapidement des réponses aux questions les plus courantes
                      </CardDescription>
                    </CardHeader>
                    \
                    <CardContent className="pt-6">
                      <Accordion type="single" collapsible className="w-full">
                        {faqItems.map((item, index) => (
                          <AccordionItem key={index} value={`item-${index}`}>
                            <AccordionTrigger className="text-left hover:text-[#003366] hover:no-underline">
                              {item.question}
                            </AccordionTrigger>
                            <AccordionContent className="text-gray-600">{item.answer}</AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </CardContent>
                    <CardFooter className="bg-gray-50 flex justify-between">
                      <p className="text-sm text-gray-500">Vous ne trouvez pas la réponse à votre question ?</p>
                      <Button className="bg-[#003366] hover:bg-[#003366]/90">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Contacter un expert
                      </Button>
                    </CardFooter>
                  </Card>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <Card className="bg-[#003366] text-white">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <AlertCircle className="mr-2 h-5 w-5 text-[#D4AF37]" />
                        Restrictions et réglementations spéciales
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="mb-4">
                        Certaines marchandises sont soumises à des restrictions ou interdictions
                        d'importation/exportation, ou nécessitent des autorisations spéciales.
                      </p>

                      <div className="space-y-4">
                        <div className="p-4 bg-white/10 rounded-lg">
                          <h4 className="font-medium text-[#D4AF37] mb-2">Produits soumis à autorisation</h4>
                          <ul className="space-y-1">
                            <li className="flex items-start">
                              <ChevronRight className="h-4 w-4 text-[#D4AF37] mr-2 shrink-0 mt-0.5" />
                              <span>Produits pharmaceutiques et médicaments</span>
                            </li>
                            <li className="flex items-start">
                              <ChevronRight className="h-4 w-4 text-[#D4AF37] mr-2 shrink-0 mt-0.5" />
                              <span>Produits chimiques et dangereux</span>
                            </li>
                            <li className="flex items-start">
                              <ChevronRight className="h-4 w-4 text-[#D4AF37] mr-2 shrink-0 mt-0.5" />
                              <span>Équipements de télécommunication</span>
                            </li>
                          </ul>
                        </div>

                        <div className="p-4 bg-white/10 rounded-lg">
                          <h4 className="font-medium text-[#D4AF37] mb-2">Produits interdits</h4>
                          <ul className="space-y-1">
                            <li className="flex items-start">
                              <ChevronRight className="h-4 w-4 text-[#D4AF37] mr-2 shrink-0 mt-0.5" />
                              <span>Armes et munitions (sans autorisation)</span>
                            </li>
                            <li className="flex items-start">
                              <ChevronRight className="h-4 w-4 text-[#D4AF37] mr-2 shrink-0 mt-0.5" />
                              <span>Espèces animales et végétales protégées</span>
                            </li>
                            <li className="flex items-start">
                              <ChevronRight className="h-4 w-4 text-[#D4AF37] mr-2 shrink-0 mt-0.5" />
                              <span>Produits contrefaits</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button
                        variant="outline"
                        className="w-full border-white text-white hover:bg-white hover:text-[#003366]"
                      >
                        <FileText className="mr-2 h-4 w-4" />
                        Consulter la liste complète
                      </Button>
                    </CardFooter>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-[#003366] flex items-center">
                        <CheckCircle className="mr-2 h-5 w-5 text-[#D4AF37]" />
                        Ressources utiles
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-start p-4 bg-gray-50 rounded-lg">
                          <ExternalLink className="h-5 w-5 text-[#D4AF37] mr-3 shrink-0 mt-0.5" />
                          <div>
                            <h4 className="font-medium">Direction Générale des Douanes</h4>
                            <p className="text-sm text-gray-500 mb-2">
                              Informations officielles sur les procédures douanières
                            </p>
                            <Button variant="outline" size="sm" className="text-xs" asChild>
                              <Link href="#" target="_blank">
                                Visiter le site
                              </Link>
                            </Button>
                          </div>
                        </div>

                        <div className="flex items-start p-4 bg-gray-50 rounded-lg">
                          <ExternalLink className="h-5 w-5 text-[#D4AF37] mr-3 shrink-0 mt-0.5" />
                          <div>
                            <h4 className="font-medium">Chambre de Commerce de Mauritanie</h4>
                            <p className="text-sm text-gray-500 mb-2">
                              Informations sur les certificats d'origine et formalités commerciales
                            </p>
                            <Button variant="outline" size="sm" className="text-xs" asChild>
                              <Link href="#" target="_blank">
                                Visiter le site
                              </Link>
                            </Button>
                          </div>
                        </div>

                        <div className="flex items-start p-4 bg-gray-50 rounded-lg">
                          <ExternalLink className="h-5 w-5 text-[#D4AF37] mr-3 shrink-0 mt-0.5" />
                          <div>
                            <h4 className="font-medium">Système SYDONIA</h4>
                            <p className="text-sm text-gray-500 mb-2">
                              Plateforme de déclaration douanière électronique
                            </p>
                            <Button variant="outline" size="sm" className="text-xs" asChild>
                              <Link href="#" target="_blank">
                                Accéder au système
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full bg-[#003366] hover:bg-[#003366]/90">
                        <Download className="mr-2 h-4 w-4" />
                        Télécharger le guide complet
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </TabsContent>

              {/* Section 4: Accès et plan du port */}
              <TabsContent value="plan">
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeIn}
                  className="mb-12 text-center max-w-3xl mx-auto"
                >
                  <h2 className="text-3xl font-bold text-[#003366] mb-4">Accès et plan du port</h2>
                  <p className="text-gray-600">
                    Explorez le plan interactif du Port Autonome de Nouadhibou pour localiser les différentes
                    infrastructures et faciliter votre accès au port.
                  </p>
                </motion.div>

                <div className="mb-8">
                  <Card>
                    <CardContent className="p-0 relative">
                      <div className="relative aspect-[16/9] md:aspect-[21/9] overflow-hidden">
                        <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                          <Image
                            src="/placeholder.svg?height=800&width=1600&text=Plan%20du%20Port"
                            alt="Plan du Port"
                            fill
                            className="object-cover"
                          />

                          {/* Points d'intérêt sur la carte */}
                          {portMapPoints.map((point) => (
                            <div
                              key={point.id}
                              className={`absolute transition-all duration-300 ${
                                selectedMapPoint === point.id ? "z-20 scale-110" : "z-10 hover:scale-110"
                              }`}
                              style={{
                                left: `${point.coordinates.x}%`,
                                top: `${point.coordinates.y}%`,
                                transform: "translate(-50%, -50%)",
                              }}
                            >
                              <button
                                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                                  selectedMapPoint === point.id
                                    ? "bg-[#D4AF37] text-white"
                                    : "bg-white text-[#003366] border-2 border-[#003366] hover:border-[#D4AF37]"
                                }`}
                                onClick={() => setSelectedMapPoint(point.id === selectedMapPoint ? null : point.id)}
                                aria-label={`Voir détails de ${point.name}`}
                              >
                                {point.icon}
                              </button>

                              {selectedMapPoint === point.id && (
                                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 bg-white p-3 rounded-lg shadow-lg z-30">
                                  <h4 className="font-medium text-[#003366] mb-1">{point.name}</h4>
                                  <p className="text-sm text-gray-600">{point.description}</p>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Contrôles de zoom */}
                      <div className="absolute top-4 right-4 flex flex-col bg-white rounded-lg shadow-md">
                        <button
                          className="p-2 hover:bg-gray-100 rounded-t-lg"
                          onClick={() => setMapZoom(Math.min(mapZoom + 0.2, 2))}
                          aria-label="Zoom in"
                        >
                          <Plus className="h-5 w-5 text-[#003366]" />
                        </button>
                        <div className="h-px bg-gray-200" />
                        <button
                          className="p-2 hover:bg-gray-100 rounded-b-lg"
                          onClick={() => setMapZoom(Math.max(mapZoom - 0.2, 1))}
                          aria-label="Zoom out"
                        >
                          <Minus className="h-5 w-5 text-[#003366]" />
                        </button>
                      </div>
                    </CardContent>
                    <CardFooter className="bg-gray-50 flex justify-between">
                      <div className="flex items-center">
                        <Button variant="outline" size="sm" className="mr-2">
                          <Download className="mr-2 h-4 w-4" />
                          Télécharger le plan
                        </Button>
                        <Button variant="outline" size="sm">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Ouvrir dans Google Maps
                        </Button>
                      </div>

                      <div className="flex items-center text-sm text-gray-500">
                        <span>Cliquez sur les points d'intérêt pour plus d'informations</span>
                      </div>
                    </CardFooter>
                  </Card>
                </div>

                <div className="grid md:grid-cols-2 gap-8 mb-12">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-[#003366]">
                        <MapPin className="inline-block mr-2 h-5 w-5 text-[#D4AF37]" />
                        Accès au port
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div>
                          <h3 className="font-medium text-[#003366] mb-2">Adresse</h3>
                          <p className="text-gray-600">
                            Port Autonome de Nouadhibou
                            <br />
                            BP 5, Nouadhibou
                            <br />
                            Mauritanie
                          </p>
                        </div>

                        <div>
                          <h3 className="font-medium text-[#003366] mb-2">Coordonnées GPS</h3>
                          <p className="text-gray-600">
                            Latitude: 20.9175° N<br />
                            Longitude: 17.0511° W
                          </p>
                        </div>

                        <div>
                          <h3 className="font-medium text-[#003366] mb-2">Accès routier</h3>
                          <p className="text-gray-600 mb-2">
                            Le port est accessible par la route nationale N2 reliant Nouakchott à Nouadhibou.
                          </p>
                          <ul className="space-y-1">
                            <li className="flex items-start">
                              <ChevronRight className="h-4 w-4 text-[#D4AF37] mr-2 shrink-0 mt-0.5" />
                              <span>Depuis Nouakchott: 470 km (environ 5-6 heures)</span>
                            </li>
                            <li className="flex items-start">
                              <ChevronRight className="h-4 w-4 text-[#D4AF37] mr-2 shrink-0 mt-0.5" />
                              <span>Depuis l'aéroport de Nouadhibou: 15 km (environ 20 minutes)</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-[#003366]">
                        <Info className="inline-block mr-2 h-5 w-5 text-[#D4AF37]" />
                        Informations pratiques
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div>
                          <h3 className="font-medium text-[#003366] mb-2">Horaires d'ouverture</h3>
                          <p className="text-gray-600 mb-2">Les services administratifs du port sont ouverts:</p>
                          <ul className="space-y-1">
                            <li className="flex items-start">
                              <ChevronRight className="h-4 w-4 text-[#D4AF37] mr-2 shrink-0 mt-0.5" />
                              <span>Lundi au Jeudi: 8h00 - 17h00</span>
                            </li>
                            <li className="flex items-start">
                              <ChevronRight className="h-4 w-4 text-[#D4AF37] mr-2 shrink-0 mt-0.5" />
                              <span>Vendredi: 8h00 - 12h00</span>
                            </li>
                          </ul>
                          <p className="text-gray-600 mt-2">Les opérations portuaires fonctionnent 24h/24, 7j/7.</p>
                        </div>

                        <div>
                          <h3 className="font-medium text-[#003366] mb-2">Contacts</h3>
                          <ul className="space-y-1">
                            <li className="flex items-start">
                              <ChevronRight className="h-4 w-4 text-[#D4AF37] mr-2 shrink-0 mt-0.5" />
                              <span>Téléphone: +222 45 74 51 11</span>
                            </li>
                            <li className="flex items-start">
                              <ChevronRight className="h-4 w-4 text-[#D4AF37] mr-2 shrink-0 mt-0.5" />
                              <span>Email: contact@pan.mr</span>
                            </li>
                            <li className="flex items-start">
                              <ChevronRight className="h-4 w-4 text-[#D4AF37] mr-2 shrink-0 mt-0.5" />
                              <span>Urgences: +222 45 74 51 12</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="bg-[#003366] text-white rounded-lg p-8">
                  <div className="grid md:grid-cols-2 gap-8 items-center">
                    <div>
                      <h3 className="text-2xl font-bold mb-4">Besoin d'informations supplémentaires ?</h3>
                      <p className="text-white/80 mb-6">
                        Notre équipe est à votre disposition pour vous fournir toutes les informations nécessaires sur
                        l'accès au port et ses infrastructures.
                      </p>
                      <div className="flex flex-wrap gap-4">
                        <Button className="bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-[#003366]">
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Nous contacter
                        </Button>
                        <Button
                          variant="outline"
                          className="border-white text-white hover:bg-white hover:text-[#003366]"
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Télécharger la brochure
                        </Button>
                      </div>
                    </div>

                    <div className="relative h-64 rounded-lg overflow-hidden">
                      <Image
                        src="/placeholder.svg?height=400&width=600&text=Port%20Autonome%20de%20Nouadhibou"
                        alt="Port Autonome de Nouadhibou"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        <DecorativeBorder />

        {/* CTA Section */}
        <section className="py-16 bg-[#F5F5F5]">
          <div className="container">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl font-bold text-[#003366] mb-4">Besoin d'assistance ?</h2>
              <p className="text-gray-600">
                Notre équipe est à votre disposition pour vous accompagner dans vos démarches et répondre à toutes vos
                questions concernant les procédures portuaires et douanières.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-[#003366]/10 flex items-center justify-center mb-4">
                    <MessageSquare className="h-6 w-6 text-[#003366]" />
                  </div>
                  <CardTitle className="text-[#003366]">Contacter un conseiller</CardTitle>
                  <CardDescription>Obtenez une assistance personnalisée pour vos démarches</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-6">
                    Nos conseillers sont disponibles pour vous aider à comprendre les procédures et répondre à vos
                    questions spécifiques.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-[#003366] hover:bg-[#003366]/90">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Contacter un conseiller
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-[#D4AF37]/10 flex items-center justify-center mb-4">
                    <Download className="h-6 w-6 text-[#D4AF37]" />
                  </div>
                  <CardTitle className="text-[#003366]">Télécharger les guides</CardTitle>
                  <CardDescription>Accédez à tous nos guides et documents explicatifs</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-6">
                    Téléchargez nos guides détaillés pour comprendre les procédures douanières et portuaires étape par
                    étape.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-[#003366]">
                    <Download className="mr-2 h-4 w-4" />
                    Accéder aux guides
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                    <ExternalLink className="h-6 w-6 text-gray-600" />
                  </div>
                  <CardTitle className="text-[#003366]">Services en ligne</CardTitle>
                  <CardDescription>Effectuez vos démarches administratives en ligne</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-6">
                    Utilisez nos services en ligne pour soumettre vos demandes, suivre vos dossiers et accéder à vos
                    documents.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" variant="outline">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Accéder aux services
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>

        {/* Chat d'aide */}
        <AnimatePresence>
          {showChatHelp && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed bottom-8 right-8 z-50 w-96 bg-white rounded-lg shadow-xl overflow-hidden"
            >
              <div className="bg-[#003366] text-white p-4 flex justify-between items-center">
                <div className="flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  <h3 className="font-medium">Assistance en ligne</h3>
                </div>
                <button className="text-white/80 hover:text-white" onClick={() => setShowChatHelp(false)}>
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-4 h-80 overflow-y-auto bg-gray-50">
                <div className="flex items-start mb-4">
                  <div className="w-8 h-8 rounded-full bg-[#003366] flex items-center justify-center text-white shrink-0 mr-2">
                    PAN
                  </div>
                  <div className="bg-white p-3 rounded-lg shadow-sm max-w-[80%]">
                    <p className="text-gray-800">
                      Bonjour ! Comment puis-je vous aider aujourd'hui concernant les informations et réglementations du
                      Port Autonome de Nouadhibou ?
                    </p>
                  </div>
                </div>

                <div className="flex items-start justify-end mb-4">
                  <div className="bg-[#003366] p-3 rounded-lg shadow-sm max-w-[80%] text-white">
                    <p>Je cherche des informations sur les tarifs portuaires.</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 shrink-0 ml-2">
                    Vous
                  </div>
                </div>

                <div className="flex items-start mb-4">
                  <div className="w-8 h-8 rounded-full bg-[#003366] flex items-center justify-center text-white shrink-0 mr-2">
                    PAN
                  </div>
                  <div className="bg-white p-3 rounded-lg shadow-sm max-w-[80%]">
                    <p className="text-gray-800">
                      Vous pouvez consulter tous nos tarifs portuaires dans la section "Tarifs & Douanes". Vous y
                      trouverez les droits de port, frais de manutention, frais de stockage et services auxiliaires.
                      Souhaitez-vous des informations sur une catégorie spécifique ?
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 border-t">
                <div className="flex">
                  <Input placeholder="Tapez votre message..." className="mr-2" />
                  <Button className="bg-[#003366] hover:bg-[#003366]/90">Envoyer</Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}
