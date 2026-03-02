
'use client';

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useCollection, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy } from "firebase/firestore";
import { useFirestore } from "@/firebase";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Loader2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function EventsPublicPage() {
  const firestore = useFirestore();
  const [searchTerm, setSearchTerm] = useState("");

  const eventsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, "events"), orderBy("date", "desc"));
  }, [firestore]);

  const { data: events, isLoading } = useCollection(eventsQuery);

  const filteredEvents = events?.filter(event => 
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

        <section className="py-12 bg-muted/30 min-h-[60vh]">
          <div className="container space-y-8">
            <div className="max-w-md relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input 
                placeholder="Rechercher un événement..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {isLoading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="animate-spin text-primary h-8 w-8" />
              </div>
            ) : filteredEvents && filteredEvents.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredEvents.map((event) => (
                  <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <CardHeader className="p-0 h-48 bg-primary/5 flex items-center justify-center relative">
                      <Calendar size={48} className="text-primary/20" />
                      <Badge className="absolute top-4 right-4" variant="secondary">
                        {event.category}
                      </Badge>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                      <CardTitle className="line-clamp-2 text-primary">{event.title}</CardTitle>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Calendar size={14} className="text-secondary" />
                          {event.date}
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin size={14} className="text-secondary" />
                          {event.location}
                        </div>
                      </div>
                      <p className="text-sm line-clamp-3 text-gray-600">
                        {event.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 text-muted-foreground">
                Aucun événement trouvé pour le moment.
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
