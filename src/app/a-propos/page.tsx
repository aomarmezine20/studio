import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Microscope, Target, Users, Award } from "lucide-react";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export default function AboutPage() {
  const heroImg = PlaceHolderImages.find(img => img.id === 'hero-bg');

  return (
    <>
      <Navbar />
      <main className="flex-grow">
        <section className="bg-primary py-20 text-white">
          <div className="container text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold font-headline">À Propos de ScienceConnect</h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Une communauté d'experts dédiée au progrès scientifique et au partage des connaissances.
            </p>
          </div>
        </section>

        <section className="py-20">
          <div className="container grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-primary font-headline" id="objectifs">Notre Mission</h2>
              <p className="text-muted-foreground leading-relaxed">
                ScienceConnect est une association scientifique internationale qui s'est donné pour mission de catalyser la recherche académique et de faciliter les échanges entre chercheurs de tous horizons.
              </p>
              <div className="grid gap-6">
                {[
                  { icon: Target, title: "Excellence", desc: "Promouvoir des standards de recherche rigoureux et éthiques." },
                  { icon: Users, title: "Collaboration", desc: "Créer des réseaux de recherche interdisciplinaires et internationaux." },
                  { icon: Award, title: "Innovation", desc: "Soutenir les projets de recherche novateurs et à fort impact social." },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="p-3 bg-secondary/10 rounded-lg text-secondary h-fit">
                      <item.icon size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-primary">{item.title}</h4>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-xl">
              <Image 
                src={heroImg?.imageUrl || ""} 
                alt="Research Team" 
                fill 
                className="object-cover"
                data-ai-hint="scientific collaboration"
              />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
