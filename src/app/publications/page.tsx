
'use client';

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useCollection, useMemoFirebase, useFirestore } from "@/firebase";
import { collection, query, orderBy } from "firebase/firestore";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Loader2, BookOpen, FilterX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function PublicationsContent() {
  const firestore = useFirestore();
  const searchParams = useSearchParams();
  const catParam = searchParams.get('cat');

  const categoryMap: Record<string, string> = {
    'reem': 'Revue REEM',
    'ouvrages': 'Ouvrages Spéciaux',
    'rapports': 'Rapports de Recherche'
  };

  const activeCategory = catParam ? categoryMap[catParam] : null;

  const publicationsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, "publications"), orderBy("createdAt", "desc"));
  }, [firestore]);

  const { data: publications, isLoading } = useCollection(publicationsQuery);

  const filteredPubs = publications?.filter(pub => 
    activeCategory ? pub.category === activeCategory : true
  );

  return (
    <section className="py-20 min-h-[50vh]">
      <div className="container">
        {activeCategory && (
          <div className="mb-10 flex items-center justify-between border-b pb-4">
            <h2 className="text-2xl font-bold text-primary">{activeCategory}</h2>
            <Badge variant="secondary" className="px-3 py-1">Catégorie Active</Badge>
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-primary h-8 w-8" />
          </div>
        ) : filteredPubs && filteredPubs.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPubs.map((pub) => (
              <Card key={pub.id} className="flex flex-col border-none shadow-md hover:shadow-xl transition-all">
                <CardHeader className="pb-4 bg-muted/20 rounded-t-lg">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="outline" className="bg-secondary/10 text-secondary border-secondary/20">
                      {pub.category}
                    </Badge>
                    <BookOpen size={20} className="text-primary/40" />
                  </div>
                  <CardTitle className="text-lg text-primary font-headline leading-snug h-14 overflow-hidden">
                    {pub.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-grow space-y-6 pt-6">
                  <p className="text-sm text-muted-foreground line-clamp-4 leading-relaxed italic">
                    {pub.description}
                  </p>
                  <Button className="w-full gap-2 bg-primary hover:bg-primary/90" asChild>
                    <a href={pub.pdfUrl || "#"} target="_blank" rel="noopener noreferrer">
                      <Download size={16} /> Consulter le PDF
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-muted-foreground flex flex-col items-center gap-4">
            <FilterX size={48} className="opacity-20" />
            <p>Aucune publication disponible pour le moment dans cette catégorie.</p>
          </div>
        )}
      </div>
    </section>
  );
}

export default function PublicationsPublicPage() {
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

        <Suspense fallback={<div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary" /></div>}>
          <PublicationsContent />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
