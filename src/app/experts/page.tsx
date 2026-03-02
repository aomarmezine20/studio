
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Microscope, Mail, Linkedin } from "lucide-react";

export default function ExpertsPage() {
  const experts = [
    { name: "Pr. Ahmed Alami", field: "Économie", focus: "Développement durable, Économie Circulaire" },
    { name: "Dr. Sarah Mansour", field: "Management", focus: "RH, Transformation digitale" },
    { name: "Pr. Jean Dupont", field: "Sociologie", focus: "Inégalités sociales, Éducation" },
    { name: "Dr. Leila Kadiri", field: "Finance", focus: "Marchés émergents, Microfinance" },
  ];

  return (
    <>
      <Navbar />
      <main className="flex-grow">
        <section className="bg-primary py-20 text-white">
          <div className="container text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold font-headline">Annuaire des Experts</h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Retrouvez les chercheurs et spécialistes membres de notre réseau.
            </p>
          </div>
        </section>

        <section className="py-20">
          <div className="container">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {experts.map((expert, i) => (
                <Card key={i} className="hover:border-secondary transition-colors">
                  <CardHeader className="flex flex-row items-center gap-4">
                    <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center text-secondary">
                      <Microscope size={24} />
                    </div>
                    <div>
                      <CardTitle className="text-lg text-primary">{expert.name}</CardTitle>
                      <Badge variant="secondary" className="mt-1">{expert.field}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      <strong>Spécialités :</strong> {expert.focus}
                    </p>
                    <div className="flex gap-4 pt-2">
                      <button className="text-muted-foreground hover:text-primary transition-colors"><Mail size={18} /></button>
                      <button className="text-muted-foreground hover:text-primary transition-colors"><Linkedin size={18} /></button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
