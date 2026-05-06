"use client";

import React, { useState, useEffect } from 'react';
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { Loader2 } from "lucide-react";

const AdhesionAdminPage = () => {
  const [pageTitle, setPageTitle] = useState("");
  const [pageSubtitle, setPageSubtitle] = useState("");
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);
  const docRef = doc(db, 'singleContent', 'adhesion');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setPageTitle(data.pageTitle || "Rejoindre le Réseau");
          setPageSubtitle(data.pageSubtitle || "Choisissez le niveau d'adhésion qui correspond à votre profil académique ou professionnel.");
          setPlans(data.plans || []);
        } else {
          setPageTitle("Rejoindre le Réseau");
          setPageSubtitle("Choisissez le niveau d'adhésion qui correspond à votre profil académique ou professionnel.");
          setPlans([
            {
              name: "Étudiant / Doctorant",
              price: "25€ / an",
              features: [
                "Accès aux séminaires doctoraux",
                "Réduction sur les frais de colloques"
              ]
            }
          ]);
        }
      } catch (error) {
        toast.error("Erreur de chargement des données.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handlePlanChange = (index: number, field: string, value: any) => {
    const newPlans = [...plans];
    newPlans[index][field] = value;
    setPlans(newPlans);
  };

  const handleFeatureChange = (planIndex: number, featureIndex: number, value: string) => {
    const newPlans = [...plans];
    newPlans[planIndex].features[featureIndex] = value;
    setPlans(newPlans);
  };

  const addFeature = (planIndex: number) => {
    const newPlans = [...plans];
    newPlans[planIndex].features.push("");
    setPlans(newPlans);
  };

  const removeFeature = (planIndex: number, featureIndex: number) => {
    const newPlans = [...plans];
    newPlans[planIndex].features.splice(featureIndex, 1);
    setPlans(newPlans);
  };

  const addPlan = () => {
    setPlans([...plans, { name: "Nouveau Plan", price: "0€ / an", features: [], featured: false }]);
  };

  const removePlan = (index: number) => {
    if (confirm("Voulez-vous vraiment supprimer ce pack ?")) {
      const newPlans = [...plans];
      newPlans.splice(index, 1);
      setPlans(newPlans);
    }
  };

  const movePlanUp = (index: number) => {
    if (index === 0) return;
    const newPlans = [...plans];
    const temp = newPlans[index];
    newPlans[index] = newPlans[index - 1];
    newPlans[index - 1] = temp;
    setPlans(newPlans);
  };

  const movePlanDown = (index: number) => {
    if (index === plans.length - 1) return;
    const newPlans = [...plans];
    const temp = newPlans[index];
    newPlans[index] = newPlans[index + 1];
    newPlans[index + 1] = temp;
    setPlans(newPlans);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await setDoc(docRef, {
        pageTitle,
        pageSubtitle,
        plans,
        updatedAt: serverTimestamp()
      }, { merge: true });
      toast.success("Les modifications ont été enregistrées avec succès !");
    } catch (error) {
      toast.error("Une erreur est survenue lors de l'enregistrement des modifications.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Gérer la page "Adhésion"</h1>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-4 p-6 border rounded-lg bg-white">
          <h2 className="text-lg font-semibold">Contenu de l'en-tête</h2>
          <div>
            <label htmlFor="pageTitle" className="block text-sm font-medium text-gray-700">Titre de la page</label>
            <input 
              type="text" 
              id="pageTitle" 
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              value={pageTitle}
              onChange={(e) => setPageTitle(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="pageSubtitle" className="block text-sm font-medium text-gray-700">Sous-titre de la page</label>
            <input 
              type="text" 
              id="pageSubtitle" 
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" 
              value={pageSubtitle}
              onChange={(e) => setPageSubtitle(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Plans d'adhésion</h2>
            <Button type="button" variant="outline" size="sm" onClick={addPlan}>+ Ajouter un Pack</Button>
          </div>
          {plans.map((plan, planIndex) => (
            <div key={planIndex} className="p-6 border rounded-lg bg-white space-y-4 relative">
              <div className="flex items-center gap-2 absolute top-4 right-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={() => movePlanUp(planIndex)}
                  disabled={planIndex === 0}
                >
                  ↑
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={() => movePlanDown(planIndex)}
                  disabled={planIndex === plans.length - 1}
                >
                  ↓
                </Button>
                <Button 
                  type="button" 
                  variant="destructive" 
                  size="sm" 
                  onClick={() => removePlan(planIndex)}
                >
                  Supprimer
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-10">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nom du plan</label>
                  <input 
                    type="text" 
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    value={plan.name}
                    onChange={(e) => handlePlanChange(planIndex, 'name', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Prix</label>
                  <input 
                    type="text" 
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    value={plan.price}
                    onChange={(e) => handlePlanChange(planIndex, 'price', e.target.value)}
                  />
                </div>
              </div>
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  checked={plan.featured || false}
                  onChange={(e) => handlePlanChange(planIndex, 'featured', e.target.checked)}
                />
                <label className="ml-2 block text-sm text-gray-900">Mettre en avant ce plan</label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Caractéristiques</label>
                <div className="space-y-2 mt-1">
                  {plan.features.map((feature: string, featureIndex: number) => (
                    <div key={featureIndex} className="flex items-center gap-2">
                      <input 
                        type="text" 
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                        value={feature}
                        onChange={(e) => handleFeatureChange(planIndex, featureIndex, e.target.value)}
                      />
                      <Button type="button" variant="destructive" size="sm" onClick={() => removeFeature(planIndex, featureIndex)}>Supprimer</Button>
                    </div>
                  ))}
                </div>
                <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => addFeature(planIndex)}>Ajouter une caractéristique</Button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={saving}>
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Enregistrer les modifications
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AdhesionAdminPage;
