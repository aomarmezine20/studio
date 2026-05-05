import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin } from "lucide-react";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export function Footer() {
  const [settings, setSettings] = useState({
    address: "CEEMTS, Casablanca, Maroc",
    phone: "+212 (0) 5XX XX XX XX",
    email: "contact@ceemts.org",
    facebook: "#",
    twitter: "#",
    linkedin: "#"
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docRef = doc(db, 'singleContent', 'settings');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setSettings({
            address: data.address || settings.address,
            phone: data.phone || settings.phone,
            email: data.email || settings.email,
            facebook: data.facebook || settings.facebook,
            twitter: data.twitter || settings.twitter,
            linkedin: data.linkedin || settings.linkedin
          });
        }
      } catch (error) {
        console.error("Failed to fetch settings:", error);
      }
    };
    fetchSettings();
  }, []);
  return (
    <footer className="bg-primary text-white pt-16 pb-8">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        <div className="space-y-6">
          <Link href="/" className="flex items-center space-x-3">
            <div className="relative h-16 w-16 overflow-hidden rounded-md bg-white p-1">
              <Image src="/logo.jpg" alt="CEEMTS" fill className="object-contain" />
            </div>
            <span className="text-2xl font-bold font-headline tracking-tighter">CEEMTS</span>
          </Link>
          <p className="text-gray-300 text-sm leading-relaxed">
            Centre d'études en économie management et transformations sociétales. 
            Promouvoir la recherche d'excellence et la diffusion du savoir académique.
          </p>
          <div className="flex space-x-4">
            <a href={settings.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-secondary transition-colors"><Facebook size={20} /></a>
            <a href={settings.twitter} target="_blank" rel="noopener noreferrer" className="hover:text-secondary transition-colors"><Twitter size={20} /></a>
            <a href={settings.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-secondary transition-colors"><Linkedin size={20} /></a>
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
            <li><Link href="/publications?cat=reem" className="hover:text-secondary transition-colors">Revue REEM</Link></li>
            <li><Link href="/adhesion" className="hover:text-secondary transition-colors">Devenir membre</Link></li>
            <li><Link href="/contact" className="hover:text-secondary transition-colors">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-bold mb-6 font-headline border-b border-white/10 pb-2">Contact</h4>
          <ul className="space-y-4 text-gray-300 text-sm">
            <li className="flex items-start space-x-3">
              <MapPin className="text-secondary shrink-0" size={18} />
              <span>{settings.address}</span>
            </li>
            <li className="flex items-center space-x-3">
              <Phone className="text-secondary shrink-0" size={18} />
              <span>{settings.phone}</span>
            </li>
            <li className="flex items-center space-x-3">
              <Mail className="text-secondary shrink-0" size={18} />
              <span>{settings.email}</span>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="container mx-auto px-4 mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-xs text-gray-400 gap-4">
        <p>© {new Date().getFullYear()} CEEMTS. Tous droits réservés.</p>
        <div className="flex space-x-6">
          <Link href="/mentions-legales" className="hover:text-white">Mentions Légales</Link>
          <Link href="/confidentialite" className="hover:text-white">Confidentialité</Link>
        </div>
      </div>
    </footer>
  );
}