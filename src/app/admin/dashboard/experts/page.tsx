"use client";

import React, { useState, useEffect } from 'react';
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const ExpertsAdminPage = () => {
  const [experts, setExperts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentExpert, setCurrentExpert] = useState<any>(null);

  useEffect(() => {
    // Simulate fetching data
    setExperts([
      { name: "Pr. Ahmed Alami", field: "Économie", focus: "Développement durable, Économie Circulaire" },
      { name: "Dr. Sarah Mansour", field: "Management", focus: "RH, Transformation digitale" },
      { name: "Pr. Jean Dupont", field: "Sociologie", focus: "Inégalités sociales, Éducation" },
      { name: "Dr. Leila Kadiri", field: "Finance", focus: "Marchés émergents, Microfinance" },
    ]);
    setLoading(false);
  }, []);

  const handleSaveExpert = (expert: any) => {
    if (currentExpert) {
      // Update existing expert
      const updatedExperts = experts.map(e => e.name === currentExpert.name ? expert : e);
      setExperts(updatedExperts);
      toast.success("Profil de l'expert mis à jour.");
    } else {
      // Add new expert
      setExperts([...experts, expert]);
      toast.success("Nouvel expert ajouté.");
    }
    setCurrentExpert(null);
    setIsModalOpen(false);
  };

  const openModal = (expert: any = null) => {
    setCurrentExpert(expert);
    setIsModalOpen(true);
  };

  const handleDeleteExpert = (expertName: string) => {
    setExperts(experts.filter(e => e.name !== expertName));
    toast.error("Profil de l'expert supprimé.");
  }

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gérer les Experts</h1>
        <Button onClick={() => openModal()}>Ajouter un expert</Button>
      </div>
      
      <div className="bg-white border rounded-lg shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Domaine</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Spécialités</th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {experts.map((expert) => (
              <tr key={expert.name}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{expert.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{expert.field}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{expert.focus}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  <Button variant="outline" size="sm" onClick={() => openModal(expert)}>Modifier</Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDeleteExpert(expert.name)}>Supprimer</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ExpertModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSaveExpert} 
        expert={currentExpert}
      />
    </div>
  );
};

const ExpertModal = ({ isOpen, onClose, onSave, expert }: any) => {
  const [name, setName] = useState("");
  const [field, setField] = useState("");
  const [focus, setFocus] = useState("");

  useEffect(() => {
    if (expert) {
      setName(expert.name);
      setField(expert.field);
      setFocus(expert.focus);
    } else {
      setName("");
      setField("");
      setFocus("");
    }
  }, [expert]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ name, field, focus });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{expert ? "Modifier le profil" : "Ajouter un expert"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nom</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Domaine</label>
            <input type="text" value={field} onChange={e => setField(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Spécialités</label>
            <input type="text" value={focus} onChange={e => setFocus(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="ghost" onClick={onClose}>Annuler</Button>
            <Button type="submit">{expert ? "Enregistrer" : "Ajouter"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default ExpertsAdminPage;
