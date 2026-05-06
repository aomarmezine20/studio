'use client';

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ContactForm } from "@/components/contact/ContactForm";
import { Mail, Phone, MapPin, Clock, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function ContactPage() {
  const [settings, setSettings] = useState({
    address: "CEEMTS, Casablanca, Maroc",
    phone: "+212 (0) 5XX XX XX XX",
    email: "contact@ceemts.org"
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docRef = doc(db, 'singleContent', 'settings');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setSettings({
            address: data.address || "CEEMTS, Casablanca, Maroc",
            phone: data.phone || "+212 (0) 5XX XX XX XX",
            email: data.email || "contact@ceemts.org"
          });
        }
      } catch (error) {
        console.error("Failed to fetch settings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="flex-grow flex items-center justify-center min-h-[50vh]">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
        </main>
        <Footer />
      </>
    );
  }
  return (
    <>
      <Navbar />
      <main className="flex-grow">
        <section className="bg-primary py-20 text-white">
          <div className="container text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold font-headline">Contactez-nous</h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Vous avez une question sur nos publications, nos événements ou l'adhésion ? 
              Notre équipe est à votre écoute.
            </p>
          </div>
        </section>

        <section className="py-20">
          <div className="container grid lg:grid-cols-3 gap-12">
            <div className="space-y-8">
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-primary font-headline">Coordonnées</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-secondary/10 rounded-lg text-secondary">
                      <MapPin size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-primary">Adresse</h4>
                      <p className="text-muted-foreground whitespace-pre-line">{settings.address}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-secondary/10 rounded-lg text-secondary">
                      <Phone size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-primary">Téléphone</h4>
                      <p className="text-muted-foreground">{settings.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-secondary/10 rounded-lg text-secondary">
                      <Mail size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-primary">Email</h4>
                      <p className="text-muted-foreground">{settings.email}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-secondary/10 rounded-lg text-secondary">
                      <Clock size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-primary">Horaires</h4>
                      <p className="text-muted-foreground">Lun - Ven: 09:00 - 18:00</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-muted rounded-2xl border">
                <h3 className="font-bold text-primary mb-4">Adhésion & Partenariat</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Pour les demandes spécifiques concernant les nouvelles adhésions ou les 
                  partenariats institutionnels, veuillez contacter le secrétariat général.
                </p>
                <a href={`mailto:${settings.email}`} className="text-secondary font-bold hover:underline">
                  {settings.email}
                </a>
              </div>
            </div>

            <div className="lg:col-span-2">
              <ContactForm />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}