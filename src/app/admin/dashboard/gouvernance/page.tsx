"use client";

import React, { useState, useEffect } from 'react';
import { db } from "@/lib/firebase";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, query, orderBy } from "firebase/firestore";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Plus, Pencil, Trash2 } from "lucide-react";

const GouvernanceAdminPage = () => {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentMember, setCurrentMember] = useState<any>(null);
  const [formLoading, setFormLoading] = useState(false);

  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [bio, setBio] = useState("");

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "governance"), orderBy("createdAt", "asc"));
      const snap = await getDocs(q);
      setMembers(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      toast.error("Impossible de charger les membres.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      const memberData = { name, role, bio, updatedAt: serverTimestamp() };
      if (currentMember) {
        await updateDoc(doc(db, "governance", currentMember.id), memberData);
        toast.success("Membre mis à jour.");
      } else {
        await addDoc(collection(db, "governance"), { ...memberData, createdAt: serverTimestamp() });
        toast.success("Nouveau membre ajouté.");
      }
      setIsModalOpen(false);
      fetchMembers();
    } catch (error) {
      toast.error("Une erreur est survenue.");
    } finally {
      setFormLoading(false);
    }
  };

  const openModal = (member: any = null) => {
    setCurrentMember(member);
    setName(member?.name || "");
    setRole(member?.role || "");
    setBio(member?.bio || "");
    setIsModalOpen(true);
  };

  const handleDeleteMember = async (id: string) => {
    if (!confirm("Supprimer ce membre du bureau ?")) return;
    try {
      await deleteDoc(doc(db, "governance", id));
      toast.success("Membre supprimé.");
      fetchMembers();
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
          <h1 className="text-3xl font-bold text-primary font-headline">Gestion de la Gouvernance</h1>
          <p className="text-muted-foreground">Membres du bureau et instances décisionnelles.</p>
        </div>
        <Button onClick={() => openModal()} className="gap-2"><Plus size={20} /> Ajouter un membre</Button>
      </div>
      
      <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rôle</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bio</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {members.map((member) => (
              <tr key={member.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{member.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.role}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-xs truncate">{member.bio}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  <Button variant="ghost" size="icon" onClick={() => openModal(member)}><Pencil size={18} className="text-blue-600" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDeleteMember(member.id)}><Trash2 size={18} className="text-red-600" /></Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{currentMember ? "Modifier le profil" : "Ajouter un membre"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveMember} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom complet</Label>
              <Input id="name" value={name} onChange={e => setName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Rôle (ex: Directeur, Secrétaire...)</Label>
              <Input id="role" value={role} onChange={e => setRole(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bref bio / Expertise</Label>
              <Textarea id="bio" value={bio} onChange={e => setBio(e.target.value)} rows={3} required />
            </div>
            <DialogFooter className="pt-4">
              <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Annuler</Button>
              <Button type="submit" disabled={formLoading}>
                {formLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {currentMember ? "Enregistrer" : "Ajouter"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GouvernanceAdminPage;
