import Link from "next/link";
import { Microscope, Mail, Phone, MapPin, Facebook, Twitter, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-primary text-white pt-16 pb-8">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        <div className="space-y-6">
          <Link href="/" className="flex items-center space-x-2">
            <Microscope className="h-8 w-8 text-secondary" />
            <span className="text-2xl font-bold font-headline">ScienceConnect</span>
          </Link>
          <p className="text-gray-300 text-sm leading-relaxed">
            Association scientifique dédiée à la promotion de la recherche d'excellence, 
            facilitant les échanges académiques et la diffusion du savoir à l'échelle internationale.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-secondary transition-colors"><Facebook size={20} /></a>
            <a href="#" className="hover:text-secondary transition-colors"><Twitter size={20} /></a>
            <a href="#" className="hover:text-secondary transition-colors"><Linkedin size={20} /></a>
          </div>
        </div>

        <div>
          <h4 className="text-lg font-bold mb-6 font-headline border-b border-white/10 pb-2">Navigation</h4>
          <ul className="space-y-3 text-gray-300 text-sm">
            <li><Link href="/a-propos" className="hover:text-secondary transition-colors">Qui sommes-nous</Link></li>
            <li><Link href="/evenements" className="hover:text-secondary transition-colors">Événements</Link></li>
            <li><Link href="/publications" className="hover:text-secondary transition-colors">Publications</Link></li>
            <li><Link href="/formations" className="hover:text-secondary transition-colors">Formations</Link></li>
            <li><Link href="/mediatheque" className="hover:text-secondary transition-colors">Médiathèque</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-bold mb-6 font-headline border-b border-white/10 pb-2">Ressources</h4>
          <ul className="space-y-3 text-gray-300 text-sm">
            <li><Link href="/reem" className="hover:text-secondary transition-colors">Revue REEM</Link></li>
            <li><Link href="/adhesion" className="hover:text-secondary transition-colors">Devenir membre</Link></li>
            <li><Link href="/faq" className="hover:text-secondary transition-colors">FAQ</Link></li>
            <li><Link href="/contact" className="hover:text-secondary transition-colors">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-bold mb-6 font-headline border-b border-white/10 pb-2">Contact</h4>
          <ul className="space-y-4 text-gray-300 text-sm">
            <li className="flex items-start space-x-3">
              <MapPin className="text-secondary shrink-0" size={18} />
              <span>123 Avenue de la Recherche, 75005 Paris, France</span>
            </li>
            <li className="flex items-center space-x-3">
              <Phone className="text-secondary shrink-0" size={18} />
              <span>+33 1 23 45 67 89</span>
            </li>
            <li className="flex items-center space-x-3">
              <Mail className="text-secondary shrink-0" size={18} />
              <span>contact@scienceconnect.org</span>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="container mx-auto px-4 mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-xs text-gray-400 gap-4">
        <p>© {new Date().getFullYear()} ScienceConnect. Tous droits réservés.</p>
        <div className="flex space-x-6">
          <Link href="/mentions-legales" className="hover:text-white">Mentions Légales</Link>
          <Link href="/confidentialite" className="hover:text-white">Confidentialité</Link>
        </div>
      </div>
    </footer>
  );
}