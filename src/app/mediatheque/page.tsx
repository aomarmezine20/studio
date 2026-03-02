
'use client';

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useCollection, useMemoFirebase, useFirestore } from "@/firebase";
import { collection, query, orderBy } from "firebase/firestore";
import { Loader2, Image as ImageIcon, Play, FileText, LayoutGrid, Camera, Video as VideoIcon } from "lucide-react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useState } from "react";

export default function MediathequePublicPage() {
  const firestore = useFirestore();
  const [activeTab, setActiveTab] = useState("all");

  const mediaQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, "media"), orderBy("createdAt", "desc"));
  }, [firestore]);

  const { data: mediaItems, isLoading } = useCollection(mediaQuery);

  const filteredMedia = mediaItems?.filter(item => {
    if (activeTab === "all") return true;
    return item.type === activeTab;
  });

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

        <section className="py-12 min-h-[50vh]">
          <div className="container space-y-10">
            <Tabs defaultValue="all" className="w-full flex flex-col items-center" onValueChange={setActiveTab}>
              <TabsList className="bg-muted p-1 rounded-full h-12">
                <TabsTrigger value="all" className="rounded-full px-8 gap-2 data-[state=active]:bg-primary data-[state=active]:text-white">
                  <LayoutGrid size={16} /> Tout
                </TabsTrigger>
                <TabsTrigger value="image" className="rounded-full px-8 gap-2 data-[state=active]:bg-primary data-[state=active]:text-white">
                  <Camera size={16} /> Photothèque
                </TabsTrigger>
                <TabsTrigger value="video" className="rounded-full px-8 gap-2 data-[state=active]:bg-primary data-[state=active]:text-white">
                  <VideoIcon size={16} /> Vidéothèque
                </TabsTrigger>
                <TabsTrigger value="pdf" className="rounded-full px-8 gap-2 data-[state=active]:bg-primary data-[state=active]:text-white">
                  <FileText size={16} /> Documents
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {isLoading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="animate-spin text-primary h-8 w-8" />
              </div>
            ) : filteredMedia && filteredMedia.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {filteredMedia.map((item) => (
                  <Card key={item.id} className="group overflow-hidden border-none shadow-sm cursor-pointer hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                    <CardContent className="p-0 relative aspect-square bg-muted">
                      {item.type === 'image' ? (
                        <Image 
                          src={item.url} 
                          alt={item.altText || item.fileName} 
                          fill 
                          className="object-cover transition-transform group-hover:scale-110"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-3 bg-primary/5">
                          {item.type === 'video' ? (
                            <div className="p-4 bg-secondary/10 rounded-full text-secondary">
                              <Play size={40} fill="currentColor" />
                            </div>
                          ) : (
                            <div className="p-4 bg-primary/10 rounded-full text-primary">
                              <FileText size={40} />
                            </div>
                          )}
                          <span className="text-sm font-bold px-4 text-center truncate w-full text-primary uppercase tracking-tighter">
                            {item.fileName}
                          </span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-primary/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-4 text-center">
                        <span className="text-white text-xs font-bold uppercase tracking-[0.2em]">Ouvrir</span>
                        <p className="text-white/80 text-[10px] line-clamp-2">{item.fileName}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 text-muted-foreground bg-muted/20 rounded-2xl border-2 border-dashed">
                <p className="text-lg">Aucun média disponible dans cette catégorie.</p>
                <p className="text-sm">Veuillez consulter les autres sections de la médiathèque.</p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
