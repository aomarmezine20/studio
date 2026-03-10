'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { GraduationCap, Loader2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface Formation {
  id: string;
  title: string;
  description: string;
  category: string;
}

interface GroupedFormations {
    [category: string]: Formation[];
}

export default function FormationsPage() {
  const [formations, setFormations] = useState<GroupedFormations>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFormations = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, 'formations'), orderBy('category'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const formationsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Formation));
        
        // Group formations by category
        const grouped = formationsList.reduce((acc, formation) => {
            const category = formation.category || 'Autres';
            if (!acc[category]) {
                acc[category] = [];
            }
            acc[category].push(formation);
            return acc;
        }, {} as GroupedFormations);

        setFormations(grouped);

      } catch (error) {
        console.error("Failed to fetch formations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFormations();
  }, []);

  return (
    <>
      <Navbar />
      <main className="flex-grow">
        <section className="bg-primary py-20 text-white">
          <div className="container text-center space-y-4">
            <GraduationCap className="mx-auto h-16 w-16 text-secondary"/>
            <h1 className="text-4xl md:text-5xl font-bold font-headline">Formations & Coaching</h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Développez vos compétences avec nos programmes de formation et d'accompagnement sur mesure.
            </p>
          </div>
        </section>

        <section className="py-20">
          <div className="container max-w-4xl mx-auto">
            {loading ? (
              <div className="flex justify-center"><Loader2 className="w-12 h-12 animate-spin text-primary" /></div>
            ) : Object.keys(formations).length > 0 ? (
                <Accordion type="multiple" defaultValue={Object.keys(formations)} className="w-full space-y-4">
                    {Object.entries(formations).map(([category, items]) => (
                        <Card key={category} className="overflow-hidden">
                             <AccordionItem value={category} className="border-none">
                                <AccordionTrigger className="bg-muted/50 px-6 py-4 text-lg font-bold text-primary hover:no-underline">
                                   {category}
                                </AccordionTrigger>
                                <AccordionContent className="p-0">
                                    <div className="divide-y">
                                        {items.map(formation => (
                                            <div key={formation.id} className="p-6">
                                                <h3 className="font-semibold text-lg text-primary/90">{formation.title}</h3>
                                                <p className="text-muted-foreground mt-2 whitespace-pre-line">{formation.description}</p>
                                            </div>
                                        ))}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </Card>
                    ))}
                </Accordion>
            ) : (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground">Aucune formation n'est disponible pour le moment.</p>
                <p className="text-muted-foreground">Revenez bientôt ou contactez-nous pour des demandes spécifiques.</p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
