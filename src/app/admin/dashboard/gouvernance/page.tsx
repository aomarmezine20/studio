"use client";

import React, { useState, useEffect } from 'react';
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const GouvernanceAdminPage = () => {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentMember, setCurrentMember] = useState<any>(null);

  useEffect(() => {
    // Simulate fetching data
    setMembers([
        { name: "Pr. Ahmed Alami", role: "Directeur Général", bio: "Expert en Économie du Développement." },
        { name: "Dr. Sarah Mansour", role: "Secrétaire Générale", bio: "Spécialiste en Management des Organisations." },
        { name: "Pr. Jean Dupont", role: "Responsable du Comité Scientifique", bio: "Chercheur émérite en Sciences Sociales." },
        { name: "Dr. Yassine Benani", role: "Trésorier", bio: "Expert-comptable et consultant financier." },
    ]);
    setLoading(false);
  }, []);

  const handleSaveMember = (member: any) => {
    if (currentMember) {
      // Update existing member
      const updatedMembers = members.map(m => m.name === currentMember.name ? member : m);
      setMembers(updatedMembers);
      toast.success("Profil du membre mis à jour.");
    } else {
      // Add new member
      setMembers([...members, member]);
      toast.success("Nouveau membre ajouté.");
    }
    setCurrentMember(null);
    setIsModalOpen(false);
  };

  const openModal = (member: any = null) => {
    setCurrentMember(member);
    setIsModalOpen(true);
  };

  const handleDeleteMember = (memberName: string) => {
    setMembers(members.filter(m => m.name !== memberName));
    toast.error("Profil du membre supprimé.");
  }

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gérer la Gouvernance</h1>
        <Button onClick={() => openModal()}>Ajouter un membre</Button>
      </div>
      
      <div className="bg-white border rounded-lg shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rôle</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bio</th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {members.map((member) => (
              <tr key={member.name}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{member.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.role}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.bio}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  <Button variant="outline" size="sm" onClick={() => openModal(member)}>Modifier</Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDeleteMember(member.name)}>Supprimer</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <MemberModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSaveMember} 
        member={currentMember}
      />
    </div>
  );
};

const MemberModal = ({ isOpen, onClose, onSave, member }: any) => {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [bio, setBio] = useState("");

  useEffect(() => {
    if (member) {
      setName(member.name);
      setRole(member.role);
      setBio(member.bio);
    } else {
      setName("");
      setRole("");
      setBio("");
    }
  }, [member]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ name, role, bio });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{member ? "Modifier le profil" : "Ajouter un membre"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nom</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Rôle</label>
            <input type="text" value={role} onChange={e => setRole(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Bio</label>
            <input type="text" value={bio} onChange={e => setBio(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="ghost" onClick={onClose}>Annuler</Button>
            <Button type="submit">{member ? "Enregistrer" : "Ajouter"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default GouvernanceAdminPage;
