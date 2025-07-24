import Link from "next/link"
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Twitter } from "lucide-react"

export function MainFooter() {
  return (
    <footer className="bg-[#003366] text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* À propos */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-[#D4AF37]">Port Autonome de Nouadhibou</h3>
            <p className="mb-4 text-sm leading-relaxed">
              Le Port Autonome de Nouadhibou est la principale infrastructure portuaire de Mauritanie, offrant des
              services maritimes et logistiques de qualité pour soutenir le commerce international et le développement
              économique de la région.
            </p>
            <div className="flex space-x-4 mt-4">
              <Link href="https://facebook.com" className="hover:text-[#D4AF37] transition-colors">
                <Facebook size={20} />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="https://twitter.com" className="hover:text-[#D4AF37] transition-colors">
                <Twitter size={20} />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="https://linkedin.com" className="hover:text-[#D4AF37] transition-colors">
                <Linkedin size={20} />
                <span className="sr-only">LinkedIn</span>
              </Link>
              <Link href="https://instagram.com" className="hover:text-[#D4AF37] transition-colors">
                <Instagram size={20} />
                <span className="sr-only">Instagram</span>
              </Link>
            </div>
          </div>

          {/* Liens rapides */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-[#D4AF37]">Liens rapides</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/le-port" className="hover:text-[#D4AF37] transition-colors text-sm">
                  Le Port
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-[#D4AF37] transition-colors text-sm">
                  Services & Activités
                </Link>
              </li>
              <li>
                <Link href="/infrastructures" className="hover:text-[#D4AF37] transition-colors text-sm">
                  Infrastructures
                </Link>
              </li>
              <li>
                <Link href="/projets" className="hover:text-[#D4AF37] transition-colors text-sm">
                  Projets & Développements
                </Link>
              </li>
              <li>
                <Link href="/informations" className="hover:text-[#D4AF37] transition-colors text-sm">
                  Informations & Réglementation
                </Link>
              </li>
              <li>
                <Link href="/appels-offres" className="hover:text-[#D4AF37] transition-colors text-sm">
                  Appels d'Offres
                </Link>
              </li>
              <li>
                <Link href="/actualites" className="hover:text-[#D4AF37] transition-colors text-sm">
                  Actualités & Médias
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-[#D4AF37]">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin size={18} className="mr-2 mt-1 text-[#D4AF37]" />
                <span className="text-sm">BP 5, Nouadhibou, Mauritanie</span>
              </li>
              <li className="flex items-center">
                <Phone size={18} className="mr-2 text-[#D4AF37]" />
                <span className="text-sm">+222 45 74 51 36</span>
              </li>
              <li className="flex items-center">
                <Mail size={18} className="mr-2 text-[#D4AF37]" />
                <span className="text-sm">contact@pan.mr</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-[#D4AF37]">Newsletter</h3>
            <p className="mb-4 text-sm">
              Abonnez-vous à notre newsletter pour recevoir les dernières actualités et informations.
            </p>
            <form className="flex flex-col space-y-2">
              <input
                type="email"
                placeholder="Votre email"
                className="px-4 py-2 rounded text-gray-800 text-sm"
                required
              />
              <button
                type="submit"
                className="bg-[#D4AF37] hover:bg-[#c09c31] text-white px-4 py-2 rounded transition-colors text-sm"
              >
                S'abonner
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm">
          <p>© {new Date().getFullYear()} Port Autonome de Nouadhibou. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  )
}
