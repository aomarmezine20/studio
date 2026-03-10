'use client';

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Trash2, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

// Define the types for our data
interface ObjectiveItem {
  id: number;
  title: string;
  desc: string;
}

interface AboutContent {
  mainDescription: string;
  objectives: ObjectiveItem[];
}

const AboutAdminPage = () => {
  const [content, setContent] = useState<AboutContent>({ mainDescription: '', objectives: [] });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const docRef = doc(db, 'singleContent', 'aboutPage');

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setContent(docSnap.data() as AboutContent);
        } else {
          // Initialize with default structure if it doesn't exist
          setContent({
            mainDescription: 'ScienceConnect est une association scientifique internationale qui s\'est donné pour mission de catalyser la recherche académique et de faciliter les échanges entre chercheurs de tous horizons.',
            objectives: [
              { id: 1, title: "Excellence", desc: "Promouvoir des standards de recherche rigoureux et éthiques." },
              { id: 2, title: "Collaboration", desc: "Créer des réseaux de recherche interdisciplinaires et internationaux." },
              { id: 3, title: "Innovation", desc: "Soutenir les projets de recherche novateurs et à fort impact social." },
            ]
          });
        }
      } catch (error) {
        toast({ title: "Erreur", description: "Impossible de charger les données.", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [toast]);

  // Handle changes in the main description
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(prev => ({ ...prev, mainDescription: e.target.value }));
  };

  // Handle changes in the objective fields
  const handleObjectiveChange = (index: number, field: 'title' | 'desc', value: string) => {
    const updatedObjectives = [...content.objectives];
    updatedObjectives[index] = { ...updatedObjectives[index], [field]: value };
    setContent(prev => ({ ...prev, objectives: updatedObjectives }));
  };

  // Add a new objective item
  const handleAddObjective = () => {
    const newObjective: ObjectiveItem = {
      id: Date.now(), // Use timestamp for a unique ID
      title: 'Nouveau Titre',
      desc: 'Nouvelle description'
    };
    setContent(prev => ({ ...prev, objectives: [...prev.objectives, newObjective] }));
  };

  // Remove an objective item
  const handleRemoveObjective = (index: number) => {
    const updatedObjectives = content.objectives.filter((_, i) => i !== index);
    setContent(prev => ({ ...prev, objectives: updatedObjectives }));
  };

  // Save all changes to Firestore
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await setDoc(docRef, { ...content, updatedAt: serverTimestamp() }, { merge: true });
      toast({ title: "Succès", description: "La page \"À Propos\" a été mise à jour." });
    } catch (error) {
      toast({ title: "Erreur", description: "Une erreur est survenue.", variant: "destructive" });
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
        <h1 className="text-3xl font-bold text-primary font-headline">Page "À Propos"</h1>
        <p className="text-muted-foreground">Modifiez la description principale et les objectifs de la page.</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-8">
        <Card>
          <CardHeader><CardTitle>Description Principale</CardTitle></CardHeader>
          <CardContent>
            <Textarea 
              value={content.mainDescription}
              onChange={handleDescriptionChange}
              rows={5}
              required
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Objectifs</CardTitle>
            <Button type="button" size="sm" onClick={handleAddObjective} className="gap-2">
              <Plus size={18} /> Ajouter
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {content.objectives.map((obj, index) => (
              <div key={obj.id} className="grid grid-cols-1 md:grid-cols-[1fr_2fr_auto] gap-4 p-4 border rounded-lg">
                <div className="space-y-2">
                  <Label>Titre de l'objectif</Label>
                  <Input 
                    value={obj.title} 
                    onChange={(e) => handleObjectiveChange(index, 'title', e.target.value)} 
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description de l'objectif</Label>
                  <Input 
                    value={obj.desc} 
                    onChange={(e) => handleObjectiveChange(index, 'desc', e.target.value)} 
                  />
                </div>
                <Button 
                  type="button" 
                  variant="destructive" 
                  size="icon"
                  onClick={() => handleRemoveObjective(index)}
                  className="self-end"
                >
                  <Trash2 size={18} />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
        
        <Button type="submit" disabled={saving} size="lg">
          {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Enregistrer toutes les modifications
        </Button>
      </form>
    </div>
  );
};

export default AboutAdminPage;
