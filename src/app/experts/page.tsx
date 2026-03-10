'use client';

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Microscope, Mail, Linkedin, Loader2, UserX } from "lucide-react";
import { useFirestore, useMemoFirebase, useCollection } from "@/firebase";
import { collection, query, orderBy } from "firebase/firestore";

export default function ExpertsPage() {
  const firestore = useFirestore();

  const expertsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, "experts"), orderBy("createdAt", "desc"));
  }, [firestore]);

  const { data: experts, isLoading } = useCollection(expertsQuery);

  return (
    <>
      <Navbar />
      <main className="flex-grow">
        <section className="bg-primary py-20 text-white">
          <div className="container text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold font-headline text-white">Annuaire des Experts</h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Retrouvez les chercheurs et spécialistes membres de notre réseau.
            </p>
          </div>
        </section>

        <section className="py-20 min-h-[50vh]">
          <div className="container">
            {isLoading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="animate-spin text-primary h-10 w-10" />
              </div>
            ) : experts && experts.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {experts.map((expert, i) => (
                  <Card key={expert.id} className="hover:border-secondary transition-all hover:shadow-lg border-t-4 border-t-primary">
                    <CardHeader className="flex flex-row items-center gap-4">
                      <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center text-secondary">
                        <Microscope size={24} />
                      </div>
                      <div>
                        <CardTitle className="text-lg text-primary">{expert.name}</CardTitle>
                        <Badge variant="secondary" className="mt-1">{expert.field}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        <strong>Spécialités :</strong> {expert.focus}
                      </p>
                      <div className="flex gap-4 pt-2">
                        <button className="text-muted-foreground hover:text-primary transition-colors"><Mail size={18} /></button>
                        <button className="text-muted-foreground hover:text-primary transition-colors"><Linkedin size={18} /></button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 text-muted-foreground flex flex-col items-center gap-4">
                <UserX size={48} className="opacity-20" />
                <p>Aucun expert n'est enregistré dans l'annuaire pour le moment.</p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
