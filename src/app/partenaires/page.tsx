
"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Building } from "lucide-react";
import Image from "next/image";

export default function PartnersPublicPage() {
  const [partners, setPartners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const q = query(collection(db, "partners"), orderBy("createdAt", "asc"));
        const snap = await getDocs(q);
        setPartners(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Failed to fetch partners:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPartners();
  }, []);

  return (
    <>
      <Navbar />
      <main className="flex-grow">
        <section className="bg-primary py-20 text-white">
          <div className="container text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold font-headline">Nos Partenaires</h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Nous sommes fiers de collaborer avec des institutions et organisations de premier plan.
            </p>
          </div>
        </section>

        <section className="py-20">
          <div className="container">
            {loading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="animate-spin text-primary h-12 w-12" />
              </div>
            ) : partners.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {partners.map((p) => (
                  <a key={p.id} href={p.websiteUrl} target="_blank" rel="noopener noreferrer" className="group">
                    <Card className="h-full flex flex-col items-center justify-center p-6 hover:shadow-xl transition-shadow hover:border-primary/50">
                        <div className="relative w-full h-24 mb-4">
                            <Image 
                                src={p.logoUrl} 
                                alt={`Logo de ${p.name}`} 
                                fill
                                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                                className="object-contain group-hover:scale-105 transition-transform"
                            />
                        </div>
                        <p className="text-center font-semibold text-primary/80 group-hover:text-primary">{p.name}</p>
                    </Card>
                  </a>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 text-muted-foreground flex flex-col items-center gap-4">
                <Building size={48} className="opacity-20" />
                <p>Aucun partenaire à afficher pour le moment.</p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
