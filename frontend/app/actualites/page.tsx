"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import {
  Calendar,
  Clock,
  MapPin,
  Search,
  ChevronRight,
  Download,
  Play,
  X,
  ExternalLink,
  Share2,
  Tag,
  Grid,
  List,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PageHeader } from "@/components/page-header"

// Types
type PressReleaseCategory = "Infrastructures" | "Opérations" | "Partenariats" | "Événements" | "Réglementations"
type EventStatus = "À venir" | "En cours" | "Passé"
type MediaCategory = "Infrastructures" | "Événements" | "Reportages" | "Activités maritimes"
type MediaType = "image" | "video"

interface PressRelease {
  id: string
  title: string
  date: string
  category: PressReleaseCategory
  summary: string
  content: string
  image: string
}

interface Event {
  id: string
  title: string
  date: string
  time: string
  location: string
  description: string
  status: EventStatus
  image: string
  detailedDescription?: string
  speakers?: { name: string; role: string; image: string }[]
  registrationLink?: string
}

interface Media {
  id: string
  title: string
  type: MediaType
  category: MediaCategory
  date: string
  url: string
  thumbnail: string
  description: string
}

// Données de démonstration
const pressReleases: PressRelease[] = [
  {
    id: "pr-001",
    title: "Le Port Autonome de Nouadhibou signe un accord de partenariat stratégique avec le Port de Rotterdam",
    date: "2023-11-15",
    category: "Partenariats",
    summary:
      "Un accord historique a été signé entre le PAN et le Port de Rotterdam pour renforcer la coopération technique et commerciale.",
    content: `
      <p>Le Port Autonome de Nouadhibou (PAN) a signé aujourd'hui un accord de partenariat stratégique avec le Port de Rotterdam, premier port d'Europe, marquant une étape importante dans le développement des infrastructures portuaires mauritaniennes.</p>
      
      <p>Cet accord, signé en présence du Ministre des Pêches et de l'Économie Maritime, vise à renforcer la coopération technique et commerciale entre les deux ports. Il prévoit notamment :</p>
      
      <ul>
        <li>Un transfert de compétences et de savoir-faire dans la gestion portuaire</li>
        <li>Une assistance technique pour la modernisation des infrastructures du PAN</li>
        <li>Le développement de corridors logistiques entre l'Europe et l'Afrique de l'Ouest</li>
        <li>Des programmes de formation pour le personnel du PAN</li>
      </ul>
      
      <p>"Ce partenariat stratégique ouvre de nouvelles perspectives pour le développement du Port Autonome de Nouadhibou et renforce son positionnement comme hub maritime régional", a déclaré le Directeur Général du PAN lors de la cérémonie de signature.</p>
      
      <p>Les premières actions concrètes de ce partenariat devraient être mises en œuvre dès le premier trimestre 2024, avec l'arrivée d'une équipe d'experts du Port de Rotterdam pour une mission d'évaluation et de conseil.</p>
    `,
    image: "/placeholder.svg?height=400&width=600&text=Signature+de+partenariat",
  },
  {
    id: "pr-002",
    title: "Inauguration du nouveau terminal à conteneurs du Port Autonome de Nouadhibou",
    date: "2023-10-20",
    category: "Infrastructures",
    summary:
      "Le PAN a inauguré son nouveau terminal à conteneurs d'une capacité de 500,000 EVP par an, renforçant sa position stratégique en Afrique de l'Ouest.",
    content: `
      <p>Le Port Autonome de Nouadhibou a officiellement inauguré aujourd'hui son nouveau terminal à conteneurs, un projet majeur qui renforce considérablement les capacités portuaires de la Mauritanie.</p>
      
      <p>D'une superficie de 25 hectares et doté d'équipements de dernière génération, ce terminal offre une capacité annuelle de 500,000 EVP (Équivalent Vingt Pieds), positionnant le PAN comme un acteur majeur du transport maritime en Afrique de l'Ouest.</p>
      
      <p>Les caractéristiques principales du nouveau terminal incluent :</p>
      
      <ul>
        <li>Un quai de 450 mètres avec un tirant d'eau de 14 mètres, permettant d'accueillir des navires de grande capacité</li>
        <li>4 portiques de quai et 8 portiques de parc de dernière génération</li>
        <li>Un système de gestion opérationnelle entièrement informatisé</li>
        <li>Des installations respectueuses de l'environnement, incluant des équipements électriques à faible émission</li>
      </ul>
      
      <p>La cérémonie d'inauguration s'est déroulée en présence du Président de la République Islamique de Mauritanie, qui a souligné l'importance stratégique de cette infrastructure pour le développement économique du pays.</p>
      
      <p>"Ce terminal à conteneurs représente un investissement de 150 millions de dollars et marque une étape décisive dans la modernisation de nos infrastructures portuaires", a déclaré le Directeur Général du PAN.</p>
      
      <p>Les premières opérations commerciales débuteront dès la semaine prochaine avec l'accueil d'un premier porte-conteneurs de la compagnie Maersk.</p>
    `,
    image: "/placeholder.svg?height=400&width=600&text=Terminal+Conteneurs",
  },
  {
    id: "pr-003",
    title: "Le Port Autonome de Nouadhibou obtient la certification ISO 9001:2015",
    date: "2023-09-05",
    category: "Opérations",
    summary:
      "Le PAN a obtenu la certification ISO 9001:2015 pour son système de management de la qualité, confirmant son engagement envers l'excellence opérationnelle.",
    content: `
      <p>Le Port Autonome de Nouadhibou (PAN) a officiellement obtenu la certification ISO 9001:2015 pour son système de management de la qualité, à l'issue d'un audit rigoureux mené par Bureau Veritas.</p>
      
      <p>Cette certification internationale reconnue confirme l'engagement du PAN envers l'excellence opérationnelle et la satisfaction client. Elle couvre l'ensemble des activités portuaires, incluant :</p>
      
      <ul>
        <li>La gestion des escales de navires</li>
        <li>Les opérations de manutention</li>
        <li>Le stockage et l'entreposage</li>
        <li>Les services aux usagers du port</li>
      </ul>
      
      <p>"L'obtention de cette certification est le fruit d'un travail collectif et d'une démarche d'amélioration continue engagée depuis plusieurs années", a déclaré le Directeur Général du PAN lors de la cérémonie de remise du certificat.</p>
      
      <p>Le PAN devient ainsi l'un des premiers ports d'Afrique de l'Ouest à obtenir cette certification, renforçant son positionnement comme port de référence dans la région.</p>
      
      <p>La certification ISO 9001:2015 s'inscrit dans une stratégie globale de modernisation et d'amélioration des performances du port, qui inclut également des démarches en cours pour l'obtention des certifications ISO 14001 (management environnemental) et ISO 45001 (santé et sécurité au travail).</p>
    `,
    image: "/placeholder.svg?height=400&width=600&text=Certification+ISO",
  },
  {
    id: "pr-004",
    title: "Lancement du programme de digitalisation des opérations portuaires",
    date: "2023-08-12",
    category: "Opérations",
    summary:
      "Le PAN lance un ambitieux programme de digitalisation visant à optimiser les opérations portuaires et améliorer la qualité de service.",
    content: `
      <p>Le Port Autonome de Nouadhibou a officiellement lancé aujourd'hui son programme de digitalisation des opérations portuaires, une initiative stratégique visant à moderniser ses processus et à améliorer la qualité de service offerte aux usagers.</p>
      
      <p>Ce programme, baptisé "Smart Port Nouadhibou", représente un investissement de 12 millions de dollars sur trois ans et comprend plusieurs volets :</p>
      
      <ul>
        <li>Déploiement d'un Port Community System (PCS) pour faciliter les échanges d'information entre les différents acteurs de la communauté portuaire</li>
        <li>Mise en place d'un système de gestion des terminaux (TOS) de dernière génération</li>
        <li>Automatisation des procédures administratives et douanières</li>
        <li>Développement d'applications mobiles pour les usagers du port</li>
        <li>Installation de capteurs IoT pour la surveillance en temps réel des infrastructures</li>
      </ul>
      
      <p>"La digitalisation est un levier essentiel pour améliorer notre compétitivité et offrir un service de qualité à nos clients", a souligné le Directeur Général du PAN lors de la cérémonie de lancement.</p>
      
      <p>La première phase du programme, qui concerne le déploiement du Port Community System, sera opérationnelle dès janvier 2024. L'ensemble du programme devrait être finalisé d'ici fin 2025.</p>
      
      <p>Cette initiative s'inscrit dans la stratégie nationale de modernisation des infrastructures portuaires et de promotion de l'économie numérique en Mauritanie.</p>
    `,
    image: "/placeholder.svg?height=400&width=600&text=Digitalisation",
  },
  {
    id: "pr-005",
    title: "Le Port Autonome de Nouadhibou accueille le plus grand porte-conteneurs de son histoire",
    date: "2023-07-25",
    category: "Opérations",
    summary:
      "Le MSC Ambition, d'une capacité de 13,000 EVP, a fait escale au PAN, marquant une étape importante dans le développement du port.",
    content: `
      <p>Le Port Autonome de Nouadhibou a accueilli hier le MSC Ambition, le plus grand porte-conteneurs ayant jamais fait escale dans ses installations. Ce navire de la compagnie Mediterranean Shipping Company (MSC), d'une capacité de 13,000 EVP (Équivalent Vingt Pieds), mesure 366 mètres de long et 51 mètres de large.</p>
      
      <p>Cette escale historique a été rendue possible grâce aux récents travaux de dragage et d'extension des infrastructures portuaires, qui permettent désormais au PAN d'accueillir des navires de très grande capacité.</p>
      
      <p>Les opérations de déchargement et chargement, qui ont mobilisé l'ensemble des équipes du terminal à conteneurs, se sont déroulées avec succès :</p>
      
      <ul>
        <li>1,500 conteneurs déchargés</li>
        <li>1,200 conteneurs chargés</li>
        <li>Opérations réalisées en moins de 36 heures</li>
      </ul>
      
      <p>"L'accueil de ce navire démontre la capacité du Port Autonome de Nouadhibou à s'adapter aux évolutions du transport maritime international et à répondre aux besoins des plus grands armateurs mondiaux", a déclaré le Directeur des Opérations du PAN.</p>
      
      <p>Cette escale marque également le début d'une nouvelle ligne régulière reliant l'Asie à l'Afrique de l'Ouest, avec un passage hebdomadaire au PAN, renforçant ainsi le positionnement du port comme hub régional.</p>
    `,
    image: "/placeholder.svg?height=400&width=600&text=MSC+Ambition",
  },
  {
    id: "pr-006",
    title: "Nouvelles mesures de sécurité et de sûreté au Port Autonome de Nouadhibou",
    date: "2023-06-10",
    category: "Réglementations",
    summary: "Le PAN renforce ses dispositifs de sécurité et de sûreté conformément aux standards internationaux ISPS.",
    content: `
      <p>Le Port Autonome de Nouadhibou annonce la mise en œuvre de nouvelles mesures de sécurité et de sûreté dans l'ensemble de ses installations, conformément aux exigences du Code International pour la Sûreté des Navires et des Installations Portuaires (ISPS).</p>
      
      <p>Ces mesures, qui entreront en vigueur le 1er juillet 2023, comprennent :</p>
      
      <ul>
        <li>Renforcement des contrôles d'accès aux zones portuaires</li>
        <li>Déploiement d'un système de vidéosurveillance avancé couvrant l'ensemble du port</li>
        <li>Mise en place d'une nouvelle procédure d'identification pour tous les usagers du port</li>
        <li>Création d'une unité spéciale de sûreté portuaire opérationnelle 24h/24</li>
        <li>Exercices réguliers de simulation d'incidents de sûreté</li>
      </ul>
      
      <p>"La sécurité et la sûreté sont des priorités absolues pour le Port Autonome de Nouadhibou. Ces nouvelles mesures nous permettent de nous conformer aux standards internationaux les plus exigeants et d'offrir un environnement sécurisé à l'ensemble de nos usagers", a déclaré le Responsable Sûreté du PAN.</p>
      
      <p>Une campagne d'information et de sensibilisation sera menée auprès de tous les acteurs de la communauté portuaire pour faciliter la mise en œuvre de ces nouvelles dispositions.</p>
      
      <p>Le PAN invite tous les usagers à prendre connaissance des nouvelles procédures d'accès disponibles sur son site internet et à anticiper leurs démarches pour l'obtention des nouveaux badges d'accès.</p>
    `,
    image: "/placeholder.svg?height=400&width=600&text=Sécurité+Portuaire",
  },
]

const events: Event[] = [
  {
    id: "evt-001",
    title: "Forum International sur le Transport Maritime en Afrique de l'Ouest",
    date: "2023-12-15",
    time: "09:00 - 17:00",
    location: "Centre de Conférences du PAN, Nouadhibou",
    description:
      "Forum réunissant les acteurs majeurs du transport maritime en Afrique de l'Ouest pour discuter des enjeux et perspectives du secteur.",
    status: "À venir",
    image: "/placeholder.svg?height=400&width=600&text=Forum+Maritime",
    detailedDescription: `
      <p>Le Port Autonome de Nouadhibou organise le premier Forum International sur le Transport Maritime en Afrique de l'Ouest, un événement majeur qui réunira les principaux acteurs du secteur maritime régional.</p>
      
      <p>Ce forum abordera les thématiques suivantes :</p>
      <ul>
        <li>Développement des infrastructures portuaires en Afrique de l'Ouest</li>
        <li>Intégration régionale et corridors de transport</li>
        <li>Digitalisation et innovation dans le secteur maritime</li>
        <li>Enjeux environnementaux et transition énergétique</li>
        <li>Sécurité et sûreté maritimes</li>
      </ul>
      
      <p>Programme de la journée :</p>
      <ul>
        <li>09:00 - 09:30 : Accueil des participants</li>
        <li>09:30 - 10:00 : Cérémonie d'ouverture</li>
        <li>10:00 - 12:30 : Sessions plénières</li>
        <li>12:30 - 14:00 : Déjeuner networking</li>
        <li>14:00 - 16:30 : Ateliers thématiques</li>
        <li>16:30 - 17:00 : Conclusions et clôture</li>
      </ul>
    `,
    speakers: [
      {
        name: "Dr. Amadou Diallo",
        role: "Ministre des Transports de Mauritanie",
        image: "/placeholder.svg?height=100&width=100&text=Dr.+Diallo",
      },
      {
        name: "Mme. Fatima Mbengue",
        role: "Directrice Générale du Port de Dakar",
        image: "/placeholder.svg?height=100&width=100&text=Mme.+Mbengue",
      },
      {
        name: "M. Jean-Pierre Lacoste",
        role: "Vice-Président de CMA CGM Afrique",
        image: "/placeholder.svg?height=100&width=100&text=M.+Lacoste",
      },
    ],
    registrationLink: "#",
  },
  {
    id: "evt-002",
    title: "Journée Portes Ouvertes du Port Autonome de Nouadhibou",
    date: "2023-11-25",
    time: "10:00 - 16:00",
    location: "Port Autonome de Nouadhibou",
    description:
      "Une journée pour découvrir les installations et les métiers du port, avec des visites guidées et des animations pour tous les publics.",
    status: "À venir",
    image: "/placeholder.svg?height=400&width=600&text=Portes+Ouvertes",
    detailedDescription: `
      <p>Le Port Autonome de Nouadhibou ouvre ses portes au grand public pour une journée exceptionnelle de découverte de ses installations et de ses métiers.</p>
      
      <p>Au programme :</p>
      <ul>
        <li>Visites guidées des terminaux et des installations portuaires</li>
        <li>Démonstrations d'équipements portuaires</li>
        <li>Expositions sur l'histoire et le développement du port</li>
        <li>Ateliers de découverte des métiers portuaires</li>
        <li>Animations pour les enfants</li>
        <li>Stands d'information des différents acteurs de la communauté portuaire</li>
      </ul>
      
      <p>Informations pratiques :</p>
      <ul>
        <li>Entrée gratuite sur inscription préalable</li>
        <li>Départs des visites guidées toutes les heures</li>
        <li>Restauration disponible sur place</li>
        <li>Parking visiteurs à l'entrée principale du port</li>
      </ul>
      
      <p>Cette journée s'inscrit dans la politique d'ouverture et de transparence du Port Autonome de Nouadhibou, qui souhaite faire découvrir au grand public son rôle essentiel dans l'économie nationale et régionale.</p>
    `,
    registrationLink: "#",
  },
  {
    id: "evt-003",
    title: "Séminaire sur la sécurité maritime et la protection de l'environnement",
    date: "2023-10-18",
    time: "09:30 - 16:30",
    location: "Salle de conférence du PAN",
    description:
      "Séminaire technique destiné aux professionnels du secteur maritime sur les enjeux de sécurité et de protection environnementale.",
    status: "Passé",
    image: "/placeholder.svg?height=400&width=600&text=Séminaire+Sécurité",
    detailedDescription: `
      <p>Le Port Autonome de Nouadhibou a organisé un séminaire technique sur la sécurité maritime et la protection de l'environnement, réunissant plus de 80 professionnels du secteur.</p>
      
      <p>Ce séminaire a abordé les thématiques suivantes :</p>
      <ul>
        <li>Réglementation internationale en matière de sécurité maritime</li>
        <li>Prévention des pollutions marines</li>
        <li>Gestion des déchets portuaires</li>
        <li>Plans d'intervention d'urgence</li>
        <li>Nouvelles technologies pour la surveillance environnementale</li>
      </ul>
      
      <p>Les présentations ont été assurées par des experts nationaux et internationaux, notamment des représentants de l'Organisation Maritime Internationale (OMI) et de l'Association Internationale des Ports (IAPH).</p>
      
      <p>À l'issue du séminaire, une série de recommandations a été formulée pour renforcer la sécurité maritime et la protection de l'environnement dans les ports mauritaniens.</p>
      
      <p>Les présentations et documents du séminaire sont disponibles en téléchargement sur l'espace documentaire du site web du PAN.</p>
    `,
  },
  {
    id: "evt-004",
    title: "Cérémonie de remise des certificats de formation aux opérateurs portuaires",
    date: "2023-09-30",
    time: "11:00 - 13:00",
    location: "Centre de formation du PAN",
    description:
      "Cérémonie officielle de remise des certificats aux opérateurs ayant suivi le programme de formation aux métiers portuaires.",
    status: "Passé",
    image: "/placeholder.svg?height=400&width=600&text=Remise+Certificats",
    detailedDescription: `
      <p>Le Port Autonome de Nouadhibou a organisé une cérémonie officielle de remise des certificats aux 45 opérateurs portuaires ayant suivi avec succès le programme de formation aux métiers portuaires.</p>
      
      <p>Ce programme de formation, d'une durée de 6 mois, a couvert les domaines suivants :</p>
      <ul>
        <li>Opérations de manutention portuaire</li>
        <li>Conduite d'engins spécialisés</li>
        <li>Sécurité et prévention des risques</li>
        <li>Gestion logistique portuaire</li>
        <li>Techniques de stockage et d'entreposage</li>
      </ul>
      
      <p>La cérémonie s'est déroulée en présence du Directeur Général du PAN, du Directeur de la Formation Professionnelle et des représentants des entreprises partenaires du programme.</p>
      
      <p>"Ce programme de formation s'inscrit dans notre stratégie de développement des compétences locales et de professionnalisation des métiers portuaires", a souligné le Directeur Général du PAN dans son allocution.</p>
      
      <p>Une nouvelle session de formation débutera en janvier 2024, avec un objectif de 60 opérateurs formés.</p>
    `,
  },
  {
    id: "evt-005",
    title: "Conférence sur les énergies renouvelables dans le secteur portuaire",
    date: "2023-08-22",
    time: "14:00 - 17:30",
    location: "Hôtel Sahara, Nouadhibou",
    description:
      "Conférence sur l'intégration des énergies renouvelables dans les opérations portuaires et la transition énergétique du secteur maritime.",
    status: "Passé",
    image: "/placeholder.svg?height=400&width=600&text=Énergies+Renouvelables",
    detailedDescription: `
      <p>Le Port Autonome de Nouadhibou, en partenariat avec l'Agence Nationale pour les Énergies Renouvelables, a organisé une conférence sur l'intégration des énergies renouvelables dans le secteur portuaire.</p>
      
      <p>Cette conférence a réuni plus de 100 participants, incluant des représentants des autorités portuaires, des entreprises du secteur énergétique, des institutions financières et des experts internationaux.</p>
      
      <p>Les principales thématiques abordées ont été :</p>
      <ul>
        <li>Potentiel des énergies solaire et éolienne dans les zones portuaires</li>
        <li>Électrification des quais et réduction des émissions des navires</li>
        <li>Expériences internationales de ports verts</li>
        <li>Mécanismes de financement des projets d'énergie renouvelable</li>
        <li>Cadre réglementaire et incitatif</li>
      </ul>
      
      <p>À l'issue de la conférence, le PAN a annoncé le lancement d'une étude de faisabilité pour l'installation d'un parc solaire de 5 MW destiné à alimenter ses installations, avec un objectif de réduction de 30% de son empreinte carbone d'ici 2025.</p>
    `,
  },
  {
    id: "evt-006",
    title: "Atelier de formation sur le Code ISPS",
    date: "2023-07-10",
    time: "09:00 - 17:00",
    location: "Centre de formation du PAN",
    description:
      "Formation destinée au personnel de sûreté du port sur l'application du Code International pour la Sûreté des Navires et des Installations Portuaires.",
    status: "Passé",
    image: "/placeholder.svg?height=400&width=600&text=Formation+ISPS",
    detailedDescription: `
      <p>Le Port Autonome de Nouadhibou a organisé un atelier de formation de trois jours sur le Code International pour la Sûreté des Navires et des Installations Portuaires (ISPS), destiné à son personnel de sûreté.</p>
      
      <p>Cette formation, dispensée par des experts certifiés de l'Organisation Maritime Internationale (OMI), a couvert les aspects suivants :</p>
      <ul>
        <li>Cadre réglementaire du Code ISPS</li>
        <li>Évaluation et plan de sûreté des installations portuaires</li>
        <li>Procédures de contrôle d'accès et de surveillance</li>
        <li>Gestion des incidents de sûreté</li>
        <li>Coopération avec les navires et les autorités</li>
        <li>Exercices et entraînements</li>
      </ul>
      
      <p>Au total, 25 agents du PAN ont participé à cette formation et ont reçu une certification officielle reconnue au niveau international.</p>
      
      <p>"Cette formation s'inscrit dans notre démarche continue d'amélioration de la sûreté portuaire et de conformité aux standards internationaux", a déclaré le Responsable Sûreté du PAN.</p>
      
      <p>Une série d'exercices pratiques sera organisée dans les prochains mois pour tester l'application des connaissances acquises lors de cette formation.</p>
    `,
  },
]

const mediaGallery: Media[] = [
  {
    id: "med-001",
    title: "Vue aérienne du Port Autonome de Nouadhibou",
    type: "image",
    category: "Infrastructures",
    date: "2023-10-15",
    url: "/placeholder.svg?height=800&width=1200&text=Vue+Aérienne+PAN",
    thumbnail: "/placeholder.svg?height=400&width=600&text=Vue+Aérienne+PAN",
    description:
      "Vue aérienne des installations du Port Autonome de Nouadhibou montrant l'ensemble des terminaux et infrastructures.",
  },
  {
    id: "med-002",
    title: "Opérations de déchargement au terminal à conteneurs",
    type: "image",
    category: "Activités maritimes",
    date: "2023-09-20",
    url: "/placeholder.svg?height=800&width=1200&text=Terminal+Conteneurs",
    thumbnail: "/placeholder.svg?height=400&width=600&text=Terminal+Conteneurs",
    description: "Opérations de déchargement d'un porte-conteneurs au nouveau terminal du PAN.",
  },
  {
    id: "med-003",
    title: "Signature de l'accord de partenariat avec le Port de Rotterdam",
    type: "image",
    category: "Événements",
    date: "2023-11-15",
    url: "/placeholder.svg?height=800&width=1200&text=Signature+Partenariat",
    thumbnail: "/placeholder.svg?height=400&width=600&text=Signature+Partenariat",
    description:
      "Cérémonie officielle de signature de l'accord de partenariat stratégique entre le PAN et le Port de Rotterdam.",
  },
  {
    id: "med-004",
    title: "Présentation du plan de développement 2023-2030",
    type: "video",
    category: "Événements",
    date: "2023-08-05",
    url: "/placeholder.svg?height=720&width=1280&text=Vidéo:+Plan+Développement",
    thumbnail: "/placeholder.svg?height=400&width=600&text=Plan+Développement",
    description:
      "Vidéo de présentation du plan stratégique de développement du Port Autonome de Nouadhibou pour la période 2023-2030.",
  },
  {
    id: "med-005",
    title: "Reportage sur les métiers portuaires",
    type: "video",
    category: "Reportages",
    date: "2023-07-12",
    url: "/placeholder.svg?height=720&width=1280&text=Vidéo:+Métiers+Portuaires",
    thumbnail: "/placeholder.svg?height=400&width=600&text=Métiers+Portuaires",
    description: "Reportage sur les différents métiers et professions exercés au sein du Port Autonome de Nouadhibou.",
  },
  {
    id: "med-006",
    title: "Nouveau quai de pêche industrielle",
    type: "image",
    category: "Infrastructures",
    date: "2023-06-30",
    url: "/placeholder.svg?height=800&width=1200&text=Quai+Pêche",
    thumbnail: "/placeholder.svg?height=400&width=600&text=Quai+Pêche",
    description: "Le nouveau quai dédié à la pêche industrielle, d'une longueur de 300 mètres.",
  },
  {
    id: "med-007",
    title: "Exercice de sécurité maritime",
    type: "image",
    category: "Activités maritimes",
    date: "2023-05-18",
    url: "/placeholder.svg?height=800&width=1200&text=Exercice+Sécurité",
    thumbnail: "/placeholder.svg?height=400&width=600&text=Exercice+Sécurité",
    description:
      "Exercice de simulation d'incident de sécurité maritime réalisé en collaboration avec la Marine Nationale.",
  },
  {
    id: "med-008",
    title: "Interview du Directeur Général du PAN",
    type: "video",
    category: "Reportages",
    date: "2023-04-25",
    url: "/placeholder.svg?height=720&width=1280&text=Vidéo:+Interview+DG",
    thumbnail: "/placeholder.svg?height=400&width=600&text=Interview+DG",
    description:
      "Interview exclusive du Directeur Général du Port Autonome de Nouadhibou sur les projets de développement et les perspectives du port.",
  },
  {
    id: "med-009",
    title: "Visite officielle du Ministre des Transports",
    type: "image",
    category: "Événements",
    date: "2023-03-10",
    url: "/placeholder.svg?height=800&width=1200&text=Visite+Ministre",
    thumbnail: "/placeholder.svg?height=400&width=600&text=Visite+Ministre",
    description:
      "Visite officielle du Ministre des Transports pour l'inspection des nouvelles infrastructures du port.",
  },
  {
    id: "med-010",
    title: "Opérations de remorquage",
    type: "image",
    category: "Activités maritimes",
    date: "2023-02-15",
    url: "/placeholder.svg?height=800&width=1200&text=Remorquage",
    thumbnail: "/placeholder.svg?height=400&width=600&text=Remorquage",
    description: "Les remorqueurs du PAN en action lors de l'assistance à un navire de commerce.",
  },
  {
    id: "med-011",
    title: "Documentaire sur l'histoire du Port de Nouadhibou",
    type: "video",
    category: "Reportages",
    date: "2023-01-20",
    url: "/placeholder.svg?height=720&width=1280&text=Vidéo:+Histoire+du+Port",
    thumbnail: "/placeholder.svg?height=400&width=600&text=Histoire+du+Port",
    description: "Documentaire retraçant l'histoire et l'évolution du Port Autonome de Nouadhibou depuis sa création.",
  },
  {
    id: "med-012",
    title: "Terminal pétrolier",
    type: "image",
    category: "Infrastructures",
    date: "2022-12-05",
    url: "/placeholder.svg?height=800&width=1200&text=Terminal+Pétrolier",
    thumbnail: "/placeholder.svg?height=400&width=600&text=Terminal+Pétrolier",
    description: "Vue du terminal pétrolier du Port Autonome de Nouadhibou avec ses installations de stockage.",
  },
]

export default function ActualitesMediaPage() {
  // États pour les filtres et la recherche
  const [pressReleaseSearchTerm, setPressReleaseSearchTerm] = useState("")
  const [pressReleaseCategoryFilter, setPressReleaseCategoryFilter] = useState<PressReleaseCategory | "Tous">("Tous")
  const [filteredPressReleases, setFilteredPressReleases] = useState<PressRelease[]>(pressReleases)

  const [eventStatusFilter, setEventStatusFilter] = useState<EventStatus | "Tous">("Tous")
  const [filteredEvents, setFilteredEvents] = useState<Event[]>(events)

  const [mediaCategoryFilter, setMediaCategoryFilter] = useState<MediaCategory | "Tous">("Tous")
  const [mediaTypeFilter, setMediaTypeFilter] = useState<MediaType | "Tous">("Tous")
  const [filteredMedia, setFilteredMedia] = useState<Media[]>(mediaGallery)

  // État pour les modales et lightbox
  const [selectedPressRelease, setSelectedPressRelease] = useState<PressRelease | null>(null)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)

  // État pour l'affichage de la galerie (grille ou liste)
  const [galleryView, setGalleryView] = useState<"grid" | "list">("grid")

  // Effet pour filtrer les communiqués de presse
  useEffect(() => {
    let results = pressReleases

    if (pressReleaseSearchTerm) {
      results = results.filter(
        (pr) =>
          pr.title.toLowerCase().includes(pressReleaseSearchTerm.toLowerCase()) ||
          pr.summary.toLowerCase().includes(pressReleaseSearchTerm.toLowerCase()),
      )
    }

    if (pressReleaseCategoryFilter !== "Tous") {
      results = results.filter((pr) => pr.category === pressReleaseCategoryFilter)
    }

    setFilteredPressReleases(results)
  }, [pressReleaseSearchTerm, pressReleaseCategoryFilter])

  // Effet pour filtrer les événements
  useEffect(() => {
    let results = events

    if (eventStatusFilter !== "Tous") {
      results = results.filter((event) => event.status === eventStatusFilter)
    }

    setFilteredEvents(results)
  }, [eventStatusFilter])

  // Effet pour filtrer les médias
  useEffect(() => {
    let results = mediaGallery

    if (mediaCategoryFilter !== "Tous") {
      results = results.filter((media) => media.category === mediaCategoryFilter)
    }

    if (mediaTypeFilter !== "Tous") {
      results = results.filter((media) => media.type === mediaTypeFilter)
    }

    setFilteredMedia(results)
  }, [mediaCategoryFilter, mediaTypeFilter])

  // Fonction pour formater les dates
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString("fr-FR", options)
  }

  // Fonction pour ajouter un événement au calendrier
  const addToCalendar = (event: Event) => {
    // Logique pour générer un lien iCalendar ou Google Calendar
    alert(`Événement "${event.title}" ajouté à votre calendrier`)
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

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Hero Section */}
      <PageHeader
        title="Actualités & Médias"
        description="Restez informé des dernières actualités, événements et découvrez notre galerie multimédia"
      />

      {/* Contenu principal */}
      <main className="flex-grow max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-12">
        <Tabs defaultValue="communiques" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="communiques" className="text-lg">
              Communiqués de presse
            </TabsTrigger>
            <TabsTrigger value="evenements" className="text-lg">
              Événements
            </TabsTrigger>
            <TabsTrigger value="galerie" className="text-lg">
              Galerie multimédia
            </TabsTrigger>
          </TabsList>

          {/* Section 1: Communiqués de presse */}
          <TabsContent value="communiques">
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
              <motion.div variants={itemVariants} className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-[#003366] mb-6">Communiqués de presse</h2>

                {/* Filtres */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <Input
                      type="text"
                      placeholder="Rechercher un communiqué..."
                      className="pl-10"
                      value={pressReleaseSearchTerm}
                      onChange={(e) => setPressReleaseSearchTerm(e.target.value)}
                    />
                  </div>

                  <Select
                    value={pressReleaseCategoryFilter}
                    onValueChange={(value) => setPressReleaseCategoryFilter(value as PressReleaseCategory | "Tous")}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Filtrer par catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Tous">Toutes les catégories</SelectItem>
                      <SelectItem value="Infrastructures">Infrastructures</SelectItem>
                      <SelectItem value="Opérations">Opérations</SelectItem>
                      <SelectItem value="Partenariats">Partenariats</SelectItem>
                      <SelectItem value="Événements">Événements</SelectItem>
                      <SelectItem value="Réglementations">Réglementations</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Liste des communiqués */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPressReleases.length > 0 ? (
                    filteredPressReleases.map((pr) => (
                      <motion.div
                        key={pr.id}
                        variants={itemVariants}
                        whileHover={{ y: -5, transition: { duration: 0.2 } }}
                      >
                        <Card className="h-full overflow-hidden shadow-md hover:shadow-lg transition-all duration-300">
                          <div className="relative h-48">
                            <Image
                              src={pr.image || "/placeholder.svg"}
                              alt={pr.title}
                              fill
                              className="object-cover transition-transform duration-500 hover:scale-110"
                            />
                            <div className="absolute top-2 right-2">
                              <Badge className="bg-[#D4AF37] text-white hover:bg-[#C09A2C]">{pr.category}</Badge>
                            </div>
                          </div>

                          <CardContent className="p-4">
                            <div className="text-sm text-gray-500 mb-2 flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              {formatDate(pr.date)}
                            </div>
                            <h3 className="text-lg font-bold text-[#003366] mb-2 line-clamp-2">{pr.title}</h3>
                            <p className="text-gray-600 mb-4 line-clamp-3">{pr.summary}</p>
                            <Button
                              className="w-full bg-[#003366] hover:bg-[#004f9e] text-white"
                              onClick={() => setSelectedPressRelease(pr)}
                            >
                              Lire plus
                              <ChevronRight className="ml-1 h-4 w-4" />
                            </Button>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-8">
                      <p className="text-gray-500">Aucun communiqué ne correspond à vos critères de recherche.</p>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          </TabsContent>

          {/* Section 2: Événements */}
          <TabsContent value="evenements">
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
              <motion.div variants={itemVariants} className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-[#003366] mb-6">Événements et conférences</h2>

                {/* Filtres */}
                <div className="flex justify-end mb-8">
                  <Select
                    value={eventStatusFilter}
                    onValueChange={(value) => setEventStatusFilter(value as EventStatus | "Tous")}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filtrer par statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Tous">Tous les événements</SelectItem>
                      <SelectItem value="À venir">À venir</SelectItem>
                      <SelectItem value="En cours">En cours</SelectItem>
                      <SelectItem value="Passé">Passés</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Timeline des événements */}
                <div className="relative">
                  {/* Ligne verticale de la timeline */}
                  <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 transform md:-translate-x-1/2"></div>

                  {filteredEvents.length > 0 ? (
                    <div className="space-y-12">
                      {filteredEvents.map((event, index) => (
                        <motion.div
                          key={event.id}
                          variants={itemVariants}
                          className={`relative ${index % 2 === 0 ? "md:pr-12" : "md:pl-12"} md:w-1/2 ${index % 2 === 0 ? "md:ml-auto" : "md:mr-auto"} pl-10 md:pl-0`}
                        >
                          {/* Point sur la timeline */}
                          <div className="absolute left-0 md:left-0 top-0 w-8 h-8 rounded-full bg-[#003366] border-4 border-white shadow-md transform md:translate-x-0 md:-translate-x-1/2 flex items-center justify-center">
                            <Calendar className="h-4 w-4 text-white" />
                          </div>

                          <Card
                            className={`overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 ${
                              event.status === "À venir"
                                ? "border-l-4 border-green-500"
                                : event.status === "En cours"
                                  ? "border-l-4 border-blue-500"
                                  : "border-l-4 border-gray-300"
                            }`}
                          >
                            <div className="relative h-48">
                              <Image
                                src={event.image || "/placeholder.svg"}
                                alt={event.title}
                                fill
                                className="object-cover transition-transform duration-500 hover:scale-110"
                              />
                              <div className="absolute top-2 right-2">
                                <Badge
                                  className={
                                    event.status === "À venir"
                                      ? "bg-green-500 text-white"
                                      : event.status === "En cours"
                                        ? "bg-blue-500 text-white"
                                        : "bg-gray-500 text-white"
                                  }
                                >
                                  {event.status}
                                </Badge>
                              </div>
                            </div>

                            <CardContent className="p-4">
                              <div className="flex flex-wrap gap-2 mb-2">
                                <div className="text-sm text-gray-500 flex items-center">
                                  <Calendar className="h-4 w-4 mr-1 text-[#D4AF37]" />
                                  {formatDate(event.date)}
                                </div>
                                <div className="text-sm text-gray-500 flex items-center">
                                  <Clock className="h-4 w-4 mr-1 text-[#D4AF37]" />
                                  {event.time}
                                </div>
                                <div className="text-sm text-gray-500 flex items-center">
                                  <MapPin className="h-4 w-4 mr-1 text-[#D4AF37]" />
                                  {event.location}
                                </div>
                              </div>

                              <h3 className="text-lg font-bold text-[#003366] mb-2">{event.title}</h3>
                              <p className="text-gray-600 mb-4">{event.description}</p>

                              <div className="flex flex-wrap gap-2">
                                <Button
                                  className="bg-[#003366] hover:bg-[#004f9e] text-white"
                                  onClick={() => setSelectedEvent(event)}
                                >
                                  Détails
                                  <ChevronRight className="ml-1 h-4 w-4" />
                                </Button>

                                {event.status === "À venir" && (
                                  <Button
                                    variant="outline"
                                    className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37]/10"
                                    onClick={() => addToCalendar(event)}
                                  >
                                    <Calendar className="mr-1 h-4 w-4" />
                                    Ajouter à mon agenda
                                  </Button>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">Aucun événement ne correspond à vos critères de recherche.</p>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          </TabsContent>

          {/* Section 3: Galerie multimédia */}
          <TabsContent value="galerie">
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
              <motion.div variants={itemVariants} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                  <h2 className="text-2xl font-bold text-[#003366] mb-4 md:mb-0">Galerie photos et vidéos</h2>

                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant={galleryView === "grid" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setGalleryView("grid")}
                        className={galleryView === "grid" ? "bg-[#003366]" : ""}
                      >
                        <Grid className="h-4 w-4 mr-1" />
                        Grille
                      </Button>
                      <Button
                        variant={galleryView === "list" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setGalleryView("list")}
                        className={galleryView === "list" ? "bg-[#003366]" : ""}
                      >
                        <List className="h-4 w-4 mr-1" />
                        Liste
                      </Button>
                    </div>

                    <Select
                      value={mediaTypeFilter}
                      onValueChange={(value) => setMediaTypeFilter(value as MediaType | "Tous")}
                    >
                      <SelectTrigger className="w-full md:w-40">
                        <SelectValue placeholder="Type de média" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Tous">Tous les types</SelectItem>
                        <SelectItem value="image">Photos</SelectItem>
                        <SelectItem value="video">Vidéos</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select
                      value={mediaCategoryFilter}
                      onValueChange={(value) => setMediaCategoryFilter(value as MediaCategory | "Tous")}
                    >
                      <SelectTrigger className="w-full md:w-48">
                        <SelectValue placeholder="Catégorie" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Tous">Toutes les catégories</SelectItem>
                        <SelectItem value="Infrastructures">Infrastructures</SelectItem>
                        <SelectItem value="Événements">Événements</SelectItem>
                        <SelectItem value="Reportages">Reportages</SelectItem>
                        <SelectItem value="Activités maritimes">Activités maritimes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Galerie en mode grille ou liste */}
                {filteredMedia.length > 0 ? (
                  galleryView === "grid" ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {filteredMedia.map((media) => (
                        <motion.div
                          key={media.id}
                          variants={itemVariants}
                          whileHover={{ y: -5, transition: { duration: 0.2 } }}
                          className="cursor-pointer"
                          onClick={() => {
                            setSelectedMedia(media)
                            setIsLightboxOpen(true)
                          }}
                        >
                          <div className="relative group overflow-hidden rounded-lg shadow-md">
                            <div className="aspect-square relative">
                              <Image
                                src={media.thumbnail || "/placeholder.svg"}
                                alt={media.title}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                              />
                              {media.type === "video" && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <div className="bg-black/50 rounded-full p-3">
                                    <Play className="h-8 w-8 text-white" />
                                  </div>
                                </div>
                              )}

                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300"></div>

                              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                <h3 className="text-white font-medium text-sm line-clamp-1">{media.title}</h3>
                                <div className="flex justify-between items-center mt-1">
                                  <Badge className="bg-[#D4AF37] text-white text-xs">{media.category}</Badge>
                                  <span className="text-white/80 text-xs">{formatDate(media.date)}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredMedia.map((media) => (
                        <motion.div
                          key={media.id}
                          variants={itemVariants}
                          className="cursor-pointer"
                          onClick={() => {
                            setSelectedMedia(media)
                            setIsLightboxOpen(true)
                          }}
                        >
                          <Card className="overflow-hidden shadow-md hover:shadow-lg transition-all duration-300">
                            <div className="flex flex-col md:flex-row">
                              <div className="relative md:w-1/3">
                                <div className="aspect-video md:h-full relative">
                                  <Image
                                    src={media.thumbnail || "/placeholder.svg"}
                                    alt={media.title}
                                    fill
                                    className="object-cover"
                                  />
                                  {media.type === "video" && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                      <div className="bg-black/50 rounded-full p-2">
                                        <Play className="h-6 w-6 text-white" />
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>

                              <CardContent className="p-4 md:w-2/3">
                                <div className="flex justify-between items-start mb-2">
                                  <h3 className="text-lg font-bold text-[#003366]">{media.title}</h3>
                                  <Badge
                                    className={
                                      media.type === "video" ? "bg-blue-500 text-white" : "bg-[#D4AF37] text-white"
                                    }
                                  >
                                    {media.type === "video" ? "Vidéo" : "Photo"}
                                  </Badge>
                                </div>

                                <div className="flex flex-wrap gap-2 mb-2 text-sm text-gray-500">
                                  <span className="flex items-center">
                                    <Calendar className="h-4 w-4 mr-1 text-[#D4AF37]" />
                                    {formatDate(media.date)}
                                  </span>
                                  <span className="flex items-center">
                                    <Tag className="h-4 w-4 mr-1 text-[#D4AF37]" />
                                    {media.category}
                                  </span>
                                </div>

                                <p className="text-gray-600">{media.description}</p>
                              </CardContent>
                            </div>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  )
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Aucun média ne correspond à vos critères de recherche.</p>
                  </div>
                )}
              </motion.div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Modales et Lightbox */}
      {/* Modal pour les communiqués de presse */}
      <Dialog open={!!selectedPressRelease} onOpenChange={(open) => !open && setSelectedPressRelease(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedPressRelease && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl text-[#003366]">{selectedPressRelease.title}</DialogTitle>
                <div className="flex justify-between items-center mt-2">
                  <Badge className="bg-[#D4AF37] text-white">{selectedPressRelease.category}</Badge>
                  <span className="text-gray-500">{formatDate(selectedPressRelease.date)}</span>
                </div>
              </DialogHeader>

              <div className="relative h-64 md:h-80 my-4">
                <Image
                  src={selectedPressRelease.image || "/placeholder.svg"}
                  alt={selectedPressRelease.title}
                  fill
                  className="object-cover rounded-md"
                />
              </div>

              <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: selectedPressRelease.content }} />

              <DialogFooter className="flex flex-col sm:flex-row gap-2 justify-between items-center">
                <div className="flex gap-2">
                  <Button variant="outline" className="border-[#D4AF37] text-[#D4AF37]">
                    <Download className="mr-2 h-4 w-4" />
                    Télécharger le PDF
                  </Button>
                  <Button variant="outline">
                    <Share2 className="mr-2 h-4 w-4" />
                    Partager
                  </Button>
                </div>
                <Button onClick={() => setSelectedPressRelease(null)}>Fermer</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal pour les événements */}
      <Dialog open={!!selectedEvent} onOpenChange={(open) => !open && setSelectedEvent(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedEvent && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl text-[#003366]">{selectedEvent.title}</DialogTitle>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge
                    className={
                      selectedEvent.status === "À venir"
                        ? "bg-green-500 text-white"
                        : selectedEvent.status === "En cours"
                          ? "bg-blue-500 text-white"
                          : "bg-gray-500 text-white"
                    }
                  >
                    {selectedEvent.status}
                  </Badge>
                </div>
              </DialogHeader>

              <div className="relative h-64 md:h-80 my-4">
                <Image
                  src={selectedEvent.image || "/placeholder.svg"}
                  alt={selectedEvent.title}
                  fill
                  className="object-cover rounded-md"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="bg-gray-50 p-3 rounded-md flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-[#D4AF37]" />
                  <div>
                    <div className="text-sm text-gray-500">Date</div>
                    <div className="font-medium">{formatDate(selectedEvent.date)}</div>
                  </div>
                </div>

                <div className="bg-gray-50 p-3 rounded-md flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-[#D4AF37]" />
                  <div>
                    <div className="text-sm text-gray-500">Heure</div>
                    <div className="font-medium">{selectedEvent.time}</div>
                  </div>
                </div>

                <div className="bg-gray-50 p-3 rounded-md flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-[#D4AF37]" />
                  <div>
                    <div className="text-sm text-gray-500">Lieu</div>
                    <div className="font-medium">{selectedEvent.location}</div>
                  </div>
                </div>
              </div>

              <div
                className="prose max-w-none mb-4"
                dangerouslySetInnerHTML={{ __html: selectedEvent.detailedDescription || selectedEvent.description }}
              />

              {selectedEvent.speakers && selectedEvent.speakers.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-[#003366] mb-3">Intervenants</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {selectedEvent.speakers.map((speaker, index) => (
                      <div key={index} className="flex items-center p-3 bg-gray-50 rounded-md">
                        <div className="relative w-12 h-12 rounded-full overflow-hidden mr-3">
                          <Image
                            src={speaker.image || "/placeholder.svg"}
                            alt={speaker.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-medium">{speaker.name}</div>
                          <div className="text-sm text-gray-500">{speaker.role}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <DialogFooter className="flex flex-col sm:flex-row gap-2 justify-between items-center">
                <div className="flex gap-2">
                  {selectedEvent.status === "À venir" && (
                    <>
                      {selectedEvent.registrationLink && (
                        <Button className="bg-[#D4AF37] hover:bg-[#C09A2C] text-white">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          S'inscrire
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        className="border-[#003366] text-[#003366]"
                        onClick={() => addToCalendar(selectedEvent)}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        Ajouter à mon agenda
                      </Button>
                    </>
                  )}
                </div>
                <Button onClick={() => setSelectedEvent(null)}>Fermer</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Lightbox pour la galerie */}
      <Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen} className="lightbox-dialog">
        <DialogContent className="max-w-5xl p-0 bg-black/90 border-none">
          {selectedMedia && (
            <div className="relative">
              <button
                className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
                onClick={() => setIsLightboxOpen(false)}
              >
                <X className="h-6 w-6" />
              </button>

              <div className="p-4 md:p-8 flex flex-col items-center">
                <div className="relative w-full max-h-[70vh] flex items-center justify-center mb-4">
                  {selectedMedia.type === "image" ? (
                    <Image
                      src={selectedMedia.url || "/placeholder.svg"}
                      alt={selectedMedia.title}
                      width={1200}
                      height={800}
                      className="max-h-[70vh] w-auto object-contain"
                    />
                  ) : (
                    <div className="relative aspect-video w-full max-w-4xl">
                      <div className="absolute inset-0 flex items-center justify-center bg-black">
                        <Image
                          src={selectedMedia.thumbnail || "/placeholder.svg"}
                          alt={selectedMedia.title}
                          fill
                          className="object-contain opacity-50"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-full w-16 h-16 flex items-center justify-center">
                            <Play className="h-8 w-8" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="w-full text-white">
                  <h3 className="text-xl font-bold mb-2">{selectedMedia.title}</h3>
                  <div className="flex flex-wrap gap-3 mb-2">
                    <Badge className="bg-[#D4AF37] text-white">{selectedMedia.category}</Badge>
                    <Badge
                      className={selectedMedia.type === "video" ? "bg-blue-500 text-white" : "bg-gray-500 text-white"}
                    >
                      {selectedMedia.type === "video" ? "Vidéo" : "Photo"}
                    </Badge>
                    <span className="text-white/80 text-sm flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {formatDate(selectedMedia.date)}
                    </span>
                  </div>
                  <p className="text-white/80">{selectedMedia.description}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
