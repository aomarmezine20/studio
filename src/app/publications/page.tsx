
'use client';

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useCollection, useMemoFirebase, useFirestore } from "@/firebase";
import { collection, query, orderBy } from "firebase/firestore";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Loader2, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PublicationsPublicPage() {
  const firestore = useFirestore();

  const publicationsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, "publications"), orderBy("createdAt", "desc"));
  }, [firestore]);

  const { data: publications, isLoading } = useCollection(publicationsQuery);

  return (
    <>
      <Navbar />
      <main className="flex-grow">
        <section className="bg-primary py-20 text-white">
          <div className="container text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold font-headline">Production & Publications</h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Découvrez nos revues scientifiques, ouvrages et rapports de recherche.
            </p>
          </div>
        </section>

        <section className="py-20 min-h-[50vh]">
          <div className="container">
            {isLoading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="animate-spin text-primary h-8 w-8" />
              </div>
            ) : publications && publications.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {publications.map((pub) => (
                  <Card key={pub.id} className="flex flex-col">
                    <CardHeader className="pb-4">
                      <div className="flex justify-between items-start mb-2">
                        <Badge variant="outline" className="bg-secondary/10 text-secondary border-secondary/20">
                          {pub.category}
                        </Badge>
                        <BookOpen size={20} className="text-muted-foreground" />
                      </div>
                      <CardTitle className="text-lg text-primary">{pub.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow space-y-4">
                      <p className="text-sm text-muted-foreground line-clamp-4 leading-relaxed">
                        {pub.description}
                      </p>
                      <Button className="w-full gap-2" variant="outline" asChild>
                        <a href="#" target="_blank">
                          <Download size={16} /> Consulter le PDF
                        </a>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 text-muted-foreground italic">
                Aucune publication disponible pour le moment.
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
