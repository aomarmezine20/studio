'use client';

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Trash2, Plus, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";

interface Formation {
  id: string;
  title: string;
  description: string;
  category: string;
}

const FormationsAdminPage = () => {
  const [formations, setFormations] = useState<Formation[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentFormation, setCurrentFormation] = useState<Partial<Formation> | null>(null);
  const { toast } = useToast();

  const collectionRef = collection(db, 'formations');

  // Fetch data
  const fetchFormations = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collectionRef);
      const formationsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Formation));
      setFormations(formationsList);
    } catch (error) {
      toast({ title: "Erreur", description: "Impossible de charger les formations.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFormations();
  }, []);

  // Handle form submission (Add or Edit)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentFormation || !currentFormation.title || !currentFormation.description || !currentFormation.category) return;
    
    setSaving(true);
    try {
      if (currentFormation.id) {
        // Update existing formation
        const docRef = doc(db, 'formations', currentFormation.id);
        await updateDoc(docRef, { ...currentFormation, updatedAt: serverTimestamp() });
        toast({ title: "Succès", description: "Formation mise à jour." });
      } else {
        // Add new formation
        await addDoc(collectionRef, { ...currentFormation, createdAt: serverTimestamp() });
        toast({ title: "Succès", description: "Nouvelle formation ajoutée." });
      }
      await fetchFormations(); // Refresh list
      setIsDialogOpen(false);
      setCurrentFormation(null);
    } catch (error) {
      toast({ title: "Erreur", description: "Une erreur est survenue.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  // Handle deletion
  const handleDelete = async (id: string) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette formation ?")) return;
    
    try {
      await deleteDoc(doc(db, 'formations', id));
      toast({ title: "Succès", description: "Formation supprimée." });
      await fetchFormations(); // Refresh list
    } catch (error) {
      toast({ title: "Erreur", description: "Impossible de supprimer la formation.", variant: "destructive" });
    }
  };

  // Open dialog for adding/editing
  const openDialog = (formation: Partial<Formation> | null = null) => {
    setCurrentFormation(formation ? { ...formation } : { title: '', description: '', category: '' });
    setIsDialogOpen(true);
  };

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-6">
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-bold text-primary font-headline">Formations & Coaching</h1>
                <p className="text-muted-foreground">Gérez les programmes de formation et de coaching.</p>
            </div>
            <Button onClick={() => openDialog()} className="gap-2"><Plus size={18} /> Ajouter une Formation</Button>
        </div>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {formations.length > 0 ? formations.map((formation) => (
              <div key={formation.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">{formation.category}</p>
                  <p className="font-bold text-primary">{formation.title}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" onClick={() => openDialog(formation)}><Edit size={16} /></Button>
                  <Button variant="destructive" size="icon" onClick={() => handleDelete(formation.id)}><Trash2 size={16} /></Button>
                </div>
              </div>
            )) : (
                <p className="text-center text-muted-foreground py-8">Aucune formation pour le moment.</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Dialog for Add/Edit Form */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{currentFormation?.id ? 'Modifier la formation' : 'Ajouter une formation'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Titre</Label>
              <Input id="title" value={currentFormation?.title} onChange={(e) => setCurrentFormation({ ...currentFormation, title: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Catégorie</Label>
               <Input id="category" value={currentFormation?.category} onChange={(e) => setCurrentFormation({ ...currentFormation, category: e.target.value })} placeholder="Ex: Atelier méthodologique, Soft skills..." required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" value={currentFormation?.description} onChange={(e) => setCurrentFormation({ ...currentFormation, description: e.target.value })} required />
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)}>Annuler</Button>
              <Button type="submit" disabled={saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Enregistrer
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FormationsAdminPage;
