"use client";

import React, { useState, useEffect } from 'react';
import { db } from "@/lib/firebase";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, query, orderBy } from "firebase/firestore";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Plus, Pencil, Trash2 } from "lucide-react";

const ExpertsAdminPage = () => {
  const [experts, setExperts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentExpert, setCurrentExpert] = useState<any>(null);
  const [formLoading, setFormLoading] = useState(false);

  const [name, setName] = useState("");
  const [field, setField] = useState("");
  const [focus, setFocus] = useState("");

  useEffect(() => {
    fetchExperts();
  }, []);

  const fetchExperts = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "experts"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      setExperts(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      toast.error("Impossible de charger les experts.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveExpert = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      const expertData = { name, field, focus, updatedAt: serverTimestamp() };
      if (currentExpert) {
        await updateDoc(doc(db, "experts", currentExpert.id), expertData);
        toast.success("Profil de l'expert mis à jour.");
      } else {
        await addDoc(collection(db, "experts"), { ...expertData, createdAt: serverTimestamp() });
        toast.success("Nouvel expert ajouté.");
      }
      setIsModalOpen(false);
      fetchExperts();
    } catch (error) {
      toast.error("Une erreur est survenue.");
    } finally {
      setFormLoading(false);
    }
  };

  const openModal = (expert: any = null) => {
    setCurrentExpert(expert);
    setName(expert?.name || "");
    setField(expert?.field || "");
    setFocus(expert?.focus || "");
    setIsModalOpen(true);
  };

  const handleDeleteExpert = async (id: string) => {
    if (!confirm("Supprimer cet expert ?")) return;
    try {
      await deleteDoc(doc(db, "experts", id));
      toast.success("Expert supprimé.");
      fetchExperts();
    } catch (error) {
      toast.error("Erreur lors de la suppression.");
    }
  };

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary font-headline">Gestion des Experts</h1>
          <p className="text-muted-foreground">Annuaire des chercheurs et spécialistes.</p>
        </div>
        <Button onClick={() => openModal()} className="gap-2"><Plus size={20} /> Ajouter un expert</Button>
      </div>
      
      <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Domaine</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Spécialités</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {experts.map((expert) => (
              <tr key={expert.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{expert.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{expert.field}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{expert.focus}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  <Button variant="ghost" size="icon" onClick={() => openModal(expert)}><Pencil size={18} className="text-blue-600" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDeleteExpert(expert.id)}><Trash2 size={18} className="text-red-600" /></Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{currentExpert ? "Modifier l'expert" : "Ajouter un expert"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveExpert} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom</Label>
              <Input id="name" value={name} onChange={e => setName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="field">Domaine d'expertise</Label>
              <Input id="field" value={field} onChange={e => setField(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="focus">Spécialités (séparées par des virgules)</Label>
              <Input id="focus" value={focus} onChange={e => setFocus(e.target.value)} required />
            </div>
            <DialogFooter className="pt-4">
              <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Annuler</Button>
              <Button type="submit" disabled={formLoading}>
                {formLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {currentExpert ? "Enregistrer" : "Ajouter"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ExpertsAdminPage;
