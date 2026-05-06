
'use client';

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useCollection, useMemoFirebase, useFirestore } from "@/firebase";
import { collection, query, orderBy, where } from "firebase/firestore";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Loader2, Search, FilterX, Link as LinkIcon, ExternalLink, Info } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useState, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function EventsContent() {
  const firestore = useFirestore();
  const searchParams = useSearchParams();
  const catParam = searchParams.get('cat');
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  const categoryMap: Record<string, string> = {
    'colloques': 'Colloques et Conférences',
    'journees': 'Journées d’Étude',
    'seminaires': 'Séminaires Doctoraux',
    'webinaires': 'Webinaires'
  };

  const activeCategory = catParam ? categoryMap[catParam] : null;

  const eventsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    let baseQuery = query(collection(firestore, "events"), orderBy("date", "desc"));
    if (activeCategory) {
      // Use client-side filtering if you don't want to manage indexes for every combo
      // but here we just fetch all and filter for simplicity in MVP
    }
    return baseQuery;
  }, [firestore]);

  const { data: events, isLoading } = useCollection(eventsQuery);

  const filteredEvents = events?.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = activeCategory ? event.category === activeCategory : true;
    return matchesSearch && matchesCat;
  });

  return (
    <section className="py-12 bg-muted/30 min-h-[60vh]">
      <div className="container space-y-8">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="w-full max-w-md relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input 
              placeholder="Rechercher un événement..." 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {activeCategory && (
            <Badge variant="secondary" className="px-4 py-2 text-sm gap-2">
              Filtre: {activeCategory}
            </Badge>
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-primary h-8 w-8" />
          </div>
        ) : filteredEvents && filteredEvents.length > 0 ? (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event) => (
              <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow border-t-4 border-t-primary">
                <CardHeader className="p-0 h-48 bg-primary/5 flex items-center justify-center relative">
                  <Calendar size={48} className="text-primary/20" />
                  <Badge className="absolute top-4 right-4" variant="secondary">
                    {event.category}
                  </Badge>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <CardTitle className="line-clamp-2 text-primary font-headline h-14">{event.title}</CardTitle>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-secondary" />
                      {event.date}
                    </div>
                    <div className="flex items-center gap-2">
                      {event.category === 'Webinaires' ? (
                        <>
                          <LinkIcon size={14} className="text-secondary" />
                          <a href={event.location.startsWith('http') ? event.location : `https://${event.location}`} target="_blank" rel="noopener noreferrer" className="text-secondary hover:underline truncate">
                            {event.location}
                          </a>
                        </>
                      ) : (
                        <>
                          <MapPin size={14} className="text-secondary" />
                          <span className="truncate">{event.location}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <p className="text-sm line-clamp-3 text-gray-600">
                    {event.description}
                  </p>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button variant="outline" className="w-full gap-2" onClick={() => setSelectedEvent(event)}>
                    <Info size={16} />
                    Voir les détails
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <Dialog open={!!selectedEvent} onOpenChange={(open) => !open && setSelectedEvent(null)}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              {selectedEvent && (
                <>
                  <DialogHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary">{selectedEvent.category}</Badge>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar size={14} />
                        {selectedEvent.date}
                      </div>
                    </div>
                    <DialogTitle className="text-2xl font-headline text-primary leading-tight">
                      {selectedEvent.title}
                    </DialogTitle>
                  </DialogHeader>
                  
                  <div className="space-y-6 py-4">
                    <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                      {selectedEvent.category === 'Webinaires' ? (
                        <div className="flex flex-col gap-1 w-full">
                          <span className="font-semibold flex items-center gap-2 text-primary">
                            <LinkIcon size={16} /> Lien de la réunion
                          </span>
                          <a href={selectedEvent.location.startsWith('http') ? selectedEvent.location : `https://${selectedEvent.location}`} target="_blank" rel="noopener noreferrer" className="text-secondary hover:underline flex items-center gap-1 break-all">
                            {selectedEvent.location}
                            <ExternalLink size={12} />
                          </a>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-1 w-full">
                          <span className="font-semibold flex items-center gap-2 text-primary">
                            <MapPin size={16} /> Lieu
                          </span>
                          <span className="text-gray-700">{selectedEvent.location}</span>
                          <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedEvent.location)}`} target="_blank" rel="noopener noreferrer" className="text-secondary hover:underline text-sm flex items-center gap-1 mt-1">
                            Voir sur la carte <ExternalLink size={12} />
                          </a>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-lg mb-2">Description</h4>
                      <div className="text-gray-700 whitespace-pre-line leading-relaxed">
                        {selectedEvent.description}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </DialogContent>
          </Dialog>
          </>
        ) : (
          <div className="text-center py-20 text-muted-foreground flex flex-col items-center gap-4">
            <FilterX size={48} className="opacity-20" />
            <p>Aucun événement trouvé dans cette catégorie.</p>
          </div>
        )}
      </div>
    </section>
  );
}

export default function EventsPublicPage() {
  return (
    <>
      <Navbar />
      <main className="flex-grow">
        <section className="bg-primary py-20 text-white">
          <div className="container text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold font-headline">Événements Scientifiques</h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Retrouvez nos prochains colloques, conférences et séminaires.
            </p>
          </div>
        </section>

        <Suspense fallback={<div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary" /></div>}>
          <EventsContent />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
