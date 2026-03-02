import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function MembershipPage() {
  const plans = [
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
  ];

  return (
    <>
      <Navbar />
      <main className="flex-grow bg-muted/30">
        <section className="bg-primary py-20 text-white">
          <div className="container text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold font-headline">Rejoindre le Réseau</h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Choisissez le niveau d'adhésion qui correspond à votre profil académique ou professionnel.
            </p>
          </div>
        </section>

        <section className="py-20">
          <div className="container grid md:grid-cols-3 gap-8">
            {plans.map((plan, idx) => (
              <div 
                key={idx} 
                className={`p-8 rounded-2xl border bg-white shadow-sm flex flex-col ${plan.featured ? 'ring-2 ring-secondary scale-105 z-10' : ''}`}
              >
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-primary mb-2">{plan.name}</h3>
                  <p className="text-3xl font-bold text-secondary">{plan.price}</p>
                </div>
                <ul className="space-y-4 mb-8 flex-grow">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex gap-3 text-sm text-muted-foreground">
                      <Check className="text-green-500 h-5 w-5 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button className={plan.featured ? "bg-secondary hover:bg-secondary/90 text-primary font-bold w-full" : "w-full"} asChild>
                  <Link href="/contact">Postuler Maintenant <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
