
'use client';

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useCollection, useMemoFirebase, useFirestore } from "@/firebase";
import { collection, query, orderBy } from "firebase/firestore";
import { Loader2, Image as ImageIcon, Play, FileText } from "lucide-react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

export default function MediathequePublicPage() {
  const firestore = useFirestore();

  const mediaQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, "media"), orderBy("createdAt", "desc"));
  }, [firestore]);

  const { data: mediaItems, isLoading } = useCollection(mediaQuery);

  return (
    <>
      <Navbar />
      <main className="flex-grow">
        <section className="bg-primary py-20 text-white">
          <div className="container text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold font-headline">Médiathèque</h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Ressources multimédias, photos de colloques et supports pédagogiques.
            </p>
          </div>
        </section>

        <section className="py-20 min-h-[50vh]">
          <div className="container">
            {isLoading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="animate-spin text-primary h-8 w-8" />
              </div>
            ) : mediaItems && mediaItems.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {mediaItems.map((item) => (
                  <Card key={item.id} className="group overflow-hidden border-none shadow-sm cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-0 relative aspect-square bg-muted">
                      {item.type === 'image' ? (
                        <Image 
                          src={item.url} 
                          alt={item.altText || item.fileName} 
                          fill 
                          className="object-cover transition-transform group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-2">
                          {item.type === 'video' ? <Play size={40} /> : <FileText size={40} />}
                          <span className="text-xs font-medium px-4 text-center truncate w-full">{item.fileName}</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white text-xs font-bold uppercase tracking-widest">Voir</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 text-muted-foreground">
                La médiathèque est en cours de mise à jour.
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
