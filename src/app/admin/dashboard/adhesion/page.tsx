"use client";

import React, { useState, useEffect } from 'react';
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const AdhesionAdminPage = () => {
  const [pageTitle, setPageTitle] = useState("");
  const [pageSubtitle, setPageSubtitle] = useState("");
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching data
    setPageTitle("Rejoindre le Réseau");
    setPageSubtitle("Choisissez le niveau d'adhésion qui correspond à votre profil académique ou professionnel.");
    setPlans([
      {
        name: "Étudiant / Doctorant",
        price: "25€ / an",
        features: [
          "Accès aux séminaires doctoraux",
          "Réduction sur les frais de colloques",
          "Newsletter scientifique bimensuelle",
          "Accès aux ateliers méthodologiques"
        ]
      },
      {
        name: "Chercheur / Enseignant",
        price: "60€ / an",
        featured: true,
        features: [
          "Publication prioritaire dans REEM",
          "Droit de vote à l'Assemblée Générale",
          "Accès complet à la base de données",
          "Participation aux comités scientifiques",
          "Networking avec experts internationaux"
        ]
      },
      {
        name: "Institutionnel",
        price: "Sur devis",
        features: [
          "Partenariat stratégique",
          "Accès pour 10+ membres",
          "Logo sur nos supports de communication",
          "Organisation d'événements conjoints"
        ]
      }
    ]);
    setLoading(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log("Saving data:", { pageTitle, pageSubtitle, plans });
      toast.success("Les modifications ont été enregistrées avec succès !");
    } catch (error) {
      toast.error("Une erreur est survenue lors de l'enregistrement des modifications.");
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
          <h2 class="text-lg font-semibold">Contenu de l'en-tête</h2>
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
          <h2 class="text-lg font-semibold">Plans d'adhésion</h2>
          {plans.map((plan, planIndex) => (
            <div key={planIndex} className="p-6 border rounded-lg bg-white space-y-4">
              <div className="grid grid-cols-2 gap-4">
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
          <Button type="submit" >
            Enregistrer les modifications
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AdhesionAdminPage;
