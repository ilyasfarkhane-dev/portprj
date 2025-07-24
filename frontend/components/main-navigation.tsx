"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"

type SubMenuItem = {
  label: string
  href: string
}

type MenuItem = {
  label: string
  href: string
  submenu?: SubMenuItem[]
}

const menuItems: MenuItem[] = [
  { label: "Accueil", href: "/" },
  {
    label: "Le Port",
    href: "/le-port",
    submenu: [
      { label: "Présentation", href: "/le-port/presentation" },
      { label: "Gouvernance", href: "/le-port/gouvernance" },
      { label: "Mot du Directeur Général", href: "/le-port/directeur" },
    ],
  },
  {
    label: "Services & Activités",
    href: "/services",
    submenu: [
      { label: "Opérations portuaires", href: "/services/operations" },
      { label: "Services aux navires", href: "/services/navires" },
      { label: "Services aux marchandises", href: "/services/marchandises" },
      { label: "Pêche industrielle", href: "/services/peche" },
      { label: "Location de terrains", href: "/services/location" },
    ],
  },
  {
    label: "Infrastructures",
    href: "/infrastructures",
    submenu: [
      { label: "Quais et Installations", href: "/infrastructures/quais" },
      { label: "Zones de stockage et entrepôts", href: "/infrastructures/stockage" },
      { label: "Installations de maintenance", href: "/infrastructures/maintenance" },
      { label: "Réseaux routiers et accès", href: "/infrastructures/reseaux" },
      { label: "Outils et équipements", href: "/infrastructures/equipements" },
    ],
  },
  {
    label: "Projets & Développements",
    href: "/projets",
    submenu: [
      { label: "Projets en cours", href: "/projets/en-cours" },
      { label: "Projets futurs", href: "/projets/futurs" },
      { label: "Plan stratégique", href: "/projets/plan-strategique" },
      { label: "Partenariats", href: "/projets/partenariats" },
      { label: "Investissements", href: "/projets/investissements" },
    ],
  },
  {
    label: "Informations & Réglementation",
    href: "/informations",
    submenu: [
      { label: "Règlement portuaire", href: "/informations/reglement" },
      { label: "Procédures douanières", href: "/informations/douanes" },
      { label: "Sûreté et sécurité", href: "/informations/securite" },
      { label: "Tarification", href: "/informations/tarifs" },
      { label: "Documents utiles", href: "/informations/documents" },
    ],
  },
  {
    label: "Appels d'Offres",
    href: "/appels-offres",
    submenu: [
      { label: "Appels d'offres en cours", href: "/appels-offres/en-cours" },
      { label: "Résultats", href: "/appels-offres/resultats" },
      { label: "Procédures", href: "/appels-offres/procedures" },
      { label: "Fournisseurs", href: "/appels-offres/fournisseurs" },
    ],
  },
  {
    label: "Actualités & Médias",
    href: "/actualites",
    submenu: [
      { label: "Communiqués de presse", href: "/actualites/communiques" },
      { label: "Événements", href: "/actualites/evenements" },
      { label: "Galerie photos", href: "/actualites/photos" },
      { label: "Vidéos", href: "/actualites/videos" },
      { label: "Publications", href: "/actualites/publications" },
    ],
  },
  { label: "Contact", href: "/contact" },
]

export function MainNavigation() {
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const navRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  const handleMouseEnter = (label: string) => {
    setActiveSubmenu(label)
  }

  const handleMouseLeave = () => {
    // Don't close submenu immediately
  }

  const handleClickOutside = (event: MouseEvent) => {
    if (navRef.current && !navRef.current.contains(event.target as Node)) {
      setActiveSubmenu(null)
      setMobileMenuOpen(false)
    }
  }

  // Close submenus when clicking outside
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Check if a link is active (current page or subpage)
  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/"
    }
    return pathname.startsWith(href)
  }

  // Check if a submenu contains the active link
  const hasActiveChild = (item: MenuItem) => {
    if (!item.submenu) return false
    return item.submenu.some((subItem) => pathname === subItem.href)
  }

  return (
    <div ref={navRef} className="relative">
      {/* Desktop Navigation */}
      <nav className="hidden lg:block mx-auto">
        <ul className="flex space-x-0 justify-center">
          {menuItems.map((item) => (
            <li
              key={item.label}
              className="relative"
              onMouseEnter={() => handleMouseEnter(item.label)}
              onMouseLeave={handleMouseLeave}
            >
              <Link
                href={item.href}
                className={cn(
                  "px-2 py-1 text-xs font-medium rounded-md transition-all flex items-center",
                  "hover:text-[#00965e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00965e]",
                  isActive(item.href) || hasActiveChild(item)
                    ? "text-[#00965e] after:content-[''] after:block after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-2/3 after:h-0.5 after:bg-[#00965e]"
                    : "text-gray-700",
                  activeSubmenu === item.label ? "bg-gray-50" : "",
                )}
              >
                <span>{item.label}</span>
                {item.submenu && (
                  <ChevronDown
                    className={cn(
                      "ml-0.5 h-2.5 w-2.5 transition-transform duration-300",
                      activeSubmenu === item.label ? "rotate-180 text-[#00965e]" : "",
                    )}
                  />
                )}
              </Link>

              {item.submenu && (
                <AnimatePresence>
                  {activeSubmenu === item.label && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.2 }}
                      className="absolute left-0 mt-1 w-56 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 z-50 overflow-hidden"
                    >
                      <motion.div
                        className="py-1"
                        initial="hidden"
                        animate="visible"
                        variants={{
                          visible: {
                            transition: {
                              staggerChildren: 0.05,
                            },
                          },
                          hidden: {},
                        }}
                      >
                        {item.submenu.map((subItem) => (
                          <motion.div
                            key={subItem.label}
                            variants={{
                              visible: { opacity: 1, x: 0 },
                              hidden: { opacity: 0, x: -10 },
                            }}
                          >
                            <Link
                              href={subItem.href}
                              className={cn(
                                "block px-4 py-2 text-sm transition-colors border-l-2",
                                pathname === subItem.href
                                  ? "border-[#00965e] bg-gray-50 text-[#00965e] font-medium"
                                  : "border-transparent text-gray-700 hover:text-[#00965e] hover:bg-gray-50 hover:border-[#00965e]/50",
                              )}
                            >
                              {subItem.label}
                            </Link>
                          </motion.div>
                        ))}
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* Mobile Navigation Button */}
      <button
        className="lg:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#00965e]"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label="Menu principal"
        aria-expanded={mobileMenuOpen}
      >
        <AnimatePresence mode="wait">
          {mobileMenuOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="h-6 w-6" />
            </motion.div>
          ) : (
            <motion.div
              key="menu"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Menu className="h-6 w-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </button>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="lg:hidden absolute top-12 left-0 right-0 bg-white shadow-lg z-50 overflow-hidden rounded-md"
          >
            <div className="py-2 max-h-[80vh] overflow-y-auto">
              {menuItems.map((item) => (
                <MobileMenuItem
                  key={item.label}
                  item={item}
                  isActive={isActive(item.href)}
                  hasActiveChild={hasActiveChild(item)}
                  pathname={pathname}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const MobileMenuItem = ({
  item,
  isActive,
  hasActiveChild,
  pathname,
}: {
  item: MenuItem
  isActive: boolean
  hasActiveChild: boolean
  pathname: string
}) => {
  const [isOpen, setIsOpen] = useState(isActive || hasActiveChild)

  return (
    <div className="border-b border-gray-100 last:border-0">
      {item.submenu ? (
        <>
          <button
            className={cn(
              "flex items-center justify-between w-full text-left py-3 px-4 transition-colors",
              isActive || hasActiveChild ? "text-[#00965e] font-medium" : "text-gray-700",
            )}
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
          >
            <span className="font-medium">{item.label}</span>
            <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
              <ChevronDown className="h-4 w-4" />
            </motion.div>
          </button>
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-gray-50"
              >
                {item.submenu.map((subItem) => (
                  <Link
                    key={subItem.label}
                    href={subItem.href}
                    className={cn(
                      "block py-2 px-8 text-sm border-l-2 transition-colors",
                      pathname === subItem.href
                        ? "border-[#00965e] text-[#00965e] font-medium"
                        : "border-gray-200 text-gray-600 hover:text-[#00965e] hover:border-[#00965e]/50",
                    )}
                  >
                    {subItem.label}
                  </Link>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </>
      ) : (
        <Link
          href={item.href}
          className={cn(
            "block py-3 px-4 font-medium transition-colors",
            isActive ? "text-[#00965e]" : "text-gray-700 hover:text-[#00965e]",
          )}
        >
          {item.label}
        </Link>
      )}
    </div>
  )
}
