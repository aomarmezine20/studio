'use client';

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Upload, ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import imageCompression from "browser-image-compression";

interface HomePageContent {
  heroTitle: string;
  heroSubtitle: string;
  heroImageUrl?: string;
  aboutHeaderTitle: string;
  aboutHeaderSubtitle: string;
  aboutTitle: string;
  aboutDescription: string;
  aboutImageUrl?: string;
}

const HomepageAdminPage = () => {
  const [content, setContent] = useState<HomePageContent>({ 
    heroTitle: '', 
    heroSubtitle: '',
    aboutHeaderTitle: '',
    aboutHeaderSubtitle: '',
    aboutTitle: '',
    aboutDescription: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [heroImageFile, setHeroImageFile] = useState<File | null>(null);
  const [aboutImageFile, setAboutImageFile] = useState<File | null>(null);
  const [heroPreview, setHeroPreview] = useState<string | null>(null);
  const [aboutPreview, setAboutPreview] = useState<string | null>(null);
  const { toast } = useToast();

  const docRef = doc(db, 'singleContent', 'homepage');
  const aboutRef = doc(db, 'singleContent', 'aboutPage');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [homeSnap, aboutSnap] = await Promise.all([
          getDoc(docRef),
          getDoc(aboutRef)
        ]);

        if (homeSnap.exists()) {
          const homeData = homeSnap.data();
          setContent(prev => ({ ...prev, heroTitle: homeData.heroTitle, heroSubtitle: homeData.heroSubtitle, heroImageUrl: homeData.heroImageUrl }));
          setHeroPreview(homeData.heroImageUrl || null);
        }

        if (aboutSnap.exists()) {
          const aboutData = aboutSnap.data();
          setContent(prev => ({ 
            ...prev, 
            aboutHeaderTitle: aboutData.aboutHeaderTitle || "À Propos de CEEMTS",
            aboutHeaderSubtitle: aboutData.aboutHeaderSubtitle || "Une communauté d'experts dédiée au progrès scientifique.",
            aboutTitle: aboutData.aboutTitle || "Qui sommes-nous ?", 
            aboutDescription: aboutData.mainDescription || "", 
            aboutImageUrl: aboutData.aboutImageUrl 
          }));
          setAboutPreview(aboutData.aboutImageUrl || null);
        }
      } catch (error) {
        console.error("Error fetching homepage content:", error);
        toast({ title: "Erreur", description: "Impossible de charger les données.", variant: "destructive" });
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
      // Handle Hero Image
      if (heroImageFile) {
        const options = { maxSizeMB: 0.2, maxWidthOrHeight: 1200, useWebWorker: false };
        const compressed = await imageCompression(heroImageFile, options);
        const reader = new FileReader();
        content.heroImageUrl = await new Promise((resolve) => {
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(compressed);
        });
      }

      // Handle About Image
      if (aboutImageFile) {
        const options = { maxSizeMB: 0.1, maxWidthOrHeight: 800, useWebWorker: false };
        const compressed = await imageCompression(aboutImageFile, options);
        const reader = new FileReader();
        content.aboutImageUrl = await new Promise((resolve) => {
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(compressed);
        });
      }

      await Promise.all([
        setDoc(docRef, { 
          heroTitle: content.heroTitle, 
          heroSubtitle: content.heroSubtitle, 
          heroImageUrl: content.heroImageUrl,
          updatedAt: serverTimestamp() 
        }, { merge: true }),
        setDoc(aboutRef, { 
          aboutHeaderTitle: content.aboutHeaderTitle,
          aboutHeaderSubtitle: content.aboutHeaderSubtitle,
          aboutTitle: content.aboutTitle,
          mainDescription: content.aboutDescription,
          aboutImageUrl: content.aboutImageUrl,
          updatedAt: serverTimestamp() 
        }, { merge: true })
      ]);

      toast({ title: "Succès", description: "Le contenu a été mis à jour." });
      setHeroImageFile(null);
      setAboutImageFile(null);
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

        <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
          <Label>Image d'arrière-plan (Hero)</Label>
          <div className="flex items-center gap-4">
            <div className="relative w-32 h-20 bg-muted rounded overflow-hidden">
              {heroPreview ? <Image src={heroPreview} alt="Hero" fill className="object-cover" /> : <ImageIcon className="m-auto h-full text-muted-foreground/30" />}
            </div>
            <Input type="file" onChange={(e) => {
              if (e.target.files?.[0]) {
                setHeroImageFile(e.target.files[0]);
                setHeroPreview(URL.createObjectURL(e.target.files[0]));
              }
            }} accept="image/*" />
          </div>
        </div>

        <div className="pt-8 border-t space-y-6">
          <h2 className="text-xl font-bold">Page "À Propos" (Entête)</h2>
          <div className="space-y-2">
            <Label htmlFor="aboutHeaderTitle">Titre de l'entête</Label>
            <Input id="aboutHeaderTitle" value={content.aboutHeaderTitle} onChange={handleInputChange} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="aboutHeaderSubtitle">Sous-titre de l'entête</Label>
            <Input id="aboutHeaderSubtitle" value={content.aboutHeaderSubtitle} onChange={handleInputChange} required />
          </div>

          <h2 className="text-xl font-bold pt-4">Section "Qui sommes-nous ?"</h2>
          
          <div className="space-y-2">
            <Label htmlFor="aboutTitle">Titre</Label>
            <Input id="aboutTitle" value={content.aboutTitle} onChange={handleInputChange} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="aboutDescription">Description</Label>
            <Textarea id="aboutDescription" value={content.aboutDescription} onChange={handleInputChange} rows={6} required />
          </div>

          <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
            <Label>Image "Qui sommes-nous"</Label>
            <div className="flex items-center gap-4">
              <div className="relative w-32 h-32 bg-muted rounded overflow-hidden">
                {aboutPreview ? <Image src={aboutPreview} alt="About" fill className="object-cover" /> : <ImageIcon className="m-auto h-full text-muted-foreground/30" />}
              </div>
              <Input type="file" onChange={(e) => {
                if (e.target.files?.[0]) {
                  setAboutImageFile(e.target.files[0]);
                  setAboutPreview(URL.createObjectURL(e.target.files[0]));
                }
              }} accept="image/*" />
            </div>
          </div>
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
