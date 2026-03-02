
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Users, Shield, Award } from "lucide-react";

export default function GovernancePage() {
  const council = [
    { name: "Pr. Ahmed Alami", role: "Directeur Général", bio: "Expert en Économie du Développement." },
    { name: "Dr. Sarah Mansour", role: "Secrétaire Générale", bio: "Spécialiste en Management des Organisations." },
    { name: "Pr. Jean Dupont", role: "Responsable du Comité Scientifique", bio: "Chercheur émérite en Sciences Sociales." },
    { name: "Dr. Yassine Benani", role: "Trésorier", bio: "Expert-comptable et consultant financier." },
  ];

  return (
    <>
      <Navbar />
      <main className="flex-grow">
        <section className="bg-primary py-20 text-white">
          <div className="container text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold font-headline">Gouvernance</h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              L'organisation et les instances décisionnelles de ScienceConnect.
            </p>
          </div>
        </section>

        <section className="py-20">
          <div className="container space-y-16">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-8 bg-white border rounded-2xl shadow-sm space-y-4">
                <Users className="text-secondary h-10 w-10" />
                <h3 className="text-xl font-bold text-primary">Assemblée Générale</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Instance souveraine réunissant tous les membres actifs pour définir les orientations stratégiques.
                </p>
              </div>
              <div className="p-8 bg-white border rounded-2xl shadow-sm space-y-4">
                <Shield className="text-secondary h-10 w-10" />
                <h3 className="text-xl font-bold text-primary">Bureau Exécutif</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Assure la gestion quotidienne et la mise en œuvre des projets validés par le conseil.
                </p>
              </div>
              <div className="p-8 bg-white border rounded-2xl shadow-sm space-y-4">
                <Award className="text-secondary h-10 w-10" />
                <h3 className="text-xl font-bold text-primary">Comité Scientifique</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Garantit la rigueur et la qualité académique des publications et des événements.
                </p>
              </div>
            </div>

            <div className="space-y-8">
              <h2 className="text-3xl font-bold text-primary text-center">Membres du Bureau</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {council.map((member, i) => (
                  <div key={i} className="text-center space-y-2 p-6 rounded-xl bg-muted/50">
                    <div className="w-20 h-20 bg-primary/10 rounded-full mx-auto flex items-center justify-center text-primary mb-4">
                      <Users size={32} />
                    </div>
                    <h4 className="font-bold text-primary">{member.name}</h4>
                    <p className="text-xs font-bold text-secondary uppercase tracking-wider">{member.role}</p>
                    <p className="text-xs text-muted-foreground">{member.bio}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
