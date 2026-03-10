'use client';

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface HomePageContent {
  heroTitle: string;
  heroSubtitle: string;
}

const HomepageAdminPage = () => {
  const [content, setContent] = useState<HomePageContent>({ heroTitle: '', heroSubtitle: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const docRef = doc(db, 'singleContent', 'homepage');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setContent(docSnap.data() as HomePageContent);
        } else {
          // Initialize with default values if the document doesn't exist
          setContent({
            heroTitle: "Façonner le Futur par la Rigueur Scientifique",
            heroSubtitle: "ScienceConnect réunit les meilleurs chercheurs et experts pour promouvoir l'innovation académique et le progrès sociétal."
          });
        }
      } catch (error) {
        toast({ title: "Erreur", description: "Impossible de charger les données de la page d'accueil.", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setContent(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await setDoc(docRef, { ...content, updatedAt: serverTimestamp() }, { merge: true });
      toast({ title: "Succès", description: "Le contenu de la page d'accueil a été mis à jour." });
    } catch (error) {
      toast({ title: "Erreur", description: "Une erreur est survenue lors de la sauvegarde.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary font-headline">Page d'Accueil</h1>
        <p className="text-muted-foreground">Modifiez les textes principaux de la page d'accueil.</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl">
        <div className="space-y-2">
          <Label htmlFor="heroTitle">Titre Principal (H1)</Label>
          <Textarea 
            id="heroTitle"
            value={content.heroTitle}
            onChange={handleInputChange}
            rows={3}
            required
            className="text-lg"
          />
           <p className="text-xs text-muted-foreground">Note: Le mot "Rigueur Scientifique" sera automatiquement stylisé.</p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="heroSubtitle">Sous-titre</Label>
          <Textarea 
            id="heroSubtitle"
            value={content.heroSubtitle}
            onChange={handleInputChange}
            rows={4}
            required
          />
        </div>

        <Button type="submit" disabled={saving} size="lg">
          {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Enregistrer les modifications
        </Button>
      </form>
    </div>
  );
};

export default HomepageAdminPage;
