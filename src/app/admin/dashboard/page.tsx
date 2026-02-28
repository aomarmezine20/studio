"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { FileText, Calendar, BookOpen, ImageIcon, MessageSquare, TrendingUp, Clock } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    articles: 0,
    events: 0,
    publications: 0,
    media: 0,
    messages: 0,
  });
  const [recentMessages, setRecentMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [artSnap, eveSnap, pubSnap, medSnap, msgSnap] = await Promise.all([
          getDocs(collection(db, "articles")),
          getDocs(collection(db, "events")),
          getDocs(collection(db, "publications")),
          getDocs(collection(db, "media")),
          getDocs(collection(db, "contactMessages")),
        ]);

        setStats({
          articles: artSnap.size,
          events: eveSnap.size,
          publications: pubSnap.size,
          media: medSnap.size,
          messages: msgSnap.size,
        });

        const recentMsgQuery = query(collection(db, "contactMessages"), orderBy("createdAt", "desc"), limit(5));
        const recentMsgSnap = await getDocs(recentMsgQuery);
        setRecentMessages(recentMsgSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const statCards = [
    { title: "Articles", value: stats.articles, icon: FileText, color: "text-blue-600", bg: "bg-blue-50" },
    { title: "Événements", value: stats.events, icon: Calendar, color: "text-amber-600", bg: "bg-amber-50" },
    { title: "Publications", value: stats.publications, icon: BookOpen, color: "text-emerald-600", bg: "bg-emerald-50" },
    { title: "Médiathèque", value: stats.media, icon: ImageIcon, color: "text-purple-600", bg: "bg-purple-50" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-primary font-headline">Aperçu du Tableau de Bord</h1>
        <p className="text-muted-foreground">Bienvenue dans votre gestionnaire de contenu ScienceConnect.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, i) => (
          <Card key={i} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{card.title}</p>
                <h3 className="text-3xl font-bold text-primary">{card.value}</h3>
              </div>
              <div className={`p-3 rounded-xl ${card.bg} ${card.color}`}>
                <card.icon size={28} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Messages Récents</CardTitle>
              <CardDescription>Les derniers contacts via le formulaire public.</CardDescription>
            </div>
            <MessageSquare className="text-muted-foreground h-5 w-5" />
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Expéditeur</TableHead>
                  <TableHead>Sujet</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentMessages.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground italic">
                      Aucun message récent
                    </TableCell>
                  </TableRow>
                ) : (
                  recentMessages.map((msg) => (
                    <TableRow key={msg.id}>
                      <TableCell className="font-medium">{msg.name}</TableCell>
                      <TableCell>{msg.subject}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {msg.createdAt?.toDate ? format(msg.createdAt.toDate(), "d MMM HH:mm", { locale: fr }) : "N/A"}
                      </TableCell>
                      <TableCell>
                        <Badge variant={msg.status === "read" ? "secondary" : "default"}>
                          {msg.status === "read" ? "Lu" : "Nouveau"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="text-secondary h-5 w-5" />
              <CardTitle>Activités Récentes</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-1 rounded-full bg-blue-500" />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">Nouvel article publié</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock size={12} /> Il y a 2 heures par Admin
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-1 rounded-full bg-amber-500" />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">Événement modifié</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock size={12} /> Hier par Content Manager
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-1 rounded-full bg-emerald-500" />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">Nouveau PDF REEM uploadé</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock size={12} /> Il y a 3 jours par Admin
                  </p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-muted rounded-lg text-xs text-center">
              Toutes vos modifications sont tracées par l'historique de sécurité.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}