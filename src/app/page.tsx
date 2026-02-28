import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Users, Calendar, Award, Microscope, GraduationCap } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export default function Home() {
  const heroImg = PlaceHolderImages.find(img => img.id === 'hero-bg');
  const directorImg = PlaceHolderImages.find(img => img.id === 'director');

  return (
    <>
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative h-[85vh] flex items-center overflow-hidden">
          <Image
            src={heroImg?.imageUrl || ""}
            alt="ScienceConnect Background"
            fill
            className="object-cover brightness-[0.4]"
            priority
            data-ai-hint="science university research"
          />
          <div className="container relative z-10 text-white space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-secondary/20 border border-secondary/30 text-secondary text-sm font-semibold mb-4 backdrop-blur-sm">
              <Award className="h-4 w-4 mr-2" />
              Excellence Scientifique & Collaboration
            </div>
            <h1 className="text-5xl md:text-7xl font-bold font-headline leading-tight max-w-4xl">
              Façonner le Futur par la <span className="text-secondary">Rigueur Scientifique</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 max-w-2xl leading-relaxed font-light">
              ScienceConnect réunit les meilleurs chercheurs et experts pour promouvoir l'innovation académique et le progrès sociétal.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-primary font-bold px-8 h-14" asChild>
                <Link href="/adhesion">Nous Rejoindre <ArrowRight className="ml-2 h-5 w-5" /></Link>
              </Button>
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10 px-8 h-14" asChild>
                <Link href="/evenements">Découvrir nos Événements</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="bg-primary py-12">
          <div className="container grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "Membres Actifs", value: "500+", icon: Users },
              { label: "Publications", value: "1200+", icon: BookOpen },
              { label: "Événements Annuels", value: "50+", icon: Calendar },
              { label: "Partenaires", value: "30+", icon: Microscope },
            ].map((stat, idx) => (
              <div key={idx} className="flex flex-col items-center text-center space-y-2">
                <stat.icon className="text-secondary h-8 w-8 mb-2" />
                <span className="text-3xl font-bold text-white">{stat.value}</span>
                <span className="text-gray-400 text-sm uppercase tracking-wider">{stat.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Mission / Word from Director */}
        <section className="py-24 bg-white" id="directeur">
          <div className="container grid md:grid-cols-2 gap-16 items-center">
            <div className="relative group">
              <div className="absolute -inset-4 bg-secondary/20 rounded-2xl group-hover:bg-secondary/30 transition-colors -rotate-2"></div>
              <div className="relative h-[600px] rounded-xl overflow-hidden shadow-2xl">
                <Image
                  src={directorImg?.imageUrl || ""}
                  alt="Directeur ScienceConnect"
                  fill
                  className="object-cover"
                  data-ai-hint="academic director portrait"
                />
              </div>
            </div>
            <div className="space-y-8">
              <div className="inline-block p-3 bg-secondary/10 rounded-lg">
                <GraduationCap className="h-8 w-8 text-secondary" />
              </div>
              <h2 className="text-4xl font-bold text-primary font-headline">Mot du Directeur</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed text-lg italic">
                <p>
                  "Bienvenue sur ScienceConnect. Notre mission est de créer un pont entre les disciplines,
                  les générations de chercheurs et les acteurs du monde socio-économique."
                </p>
                <p>
                  "Dans un monde en mutation rapide, la rigueur scientifique et le partage du savoir
                  sont les piliers essentiels d'un développement durable et éclairé."
                </p>
              </div>
              <div className="pt-4">
                <p className="font-bold text-primary text-xl">Pr. Ahmed Alami</p>
                <p className="text-secondary font-medium">Directeur Général, ScienceConnect</p>
              </div>
              <Button variant="link" className="p-0 text-primary font-bold text-lg hover:text-secondary h-auto" asChild>
                <Link href="/a-propos">Lire la suite de nos objectifs <ArrowRight className="ml-2 h-5 w-5" /></Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Areas of Focus */}
        <section className="py-24 bg-muted/50">
          <div className="container space-y-16">
            <div className="text-center space-y-4 max-w-3xl mx-auto">
              <h2 className="text-4xl font-bold text-primary font-headline">Nos Piliers d'Action</h2>
              <p className="text-gray-600 text-lg">
                Nous intervenons sur plusieurs axes stratégiques pour dynamiser l'écosystème scientifique.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "Recherche & Publication",
                  desc: "Édition de revues scientifiques de haut niveau et rapports de diagnostics sectoriels.",
                  icon: BookOpen,
                  link: "/publications"
                },
                {
                  title: "Événements Scientifiques",
                  desc: "Organisation de colloques internationaux, tables rondes et journées d'étude thématiques.",
                  icon: Calendar,
                  link: "/evenements"
                },
                {
                  title: "Formation & Coaching",
                  desc: "Ateliers méthodologiques et accompagnement personnalisé pour les doctorants.",
                  icon: GraduationCap,
                  link: "/formations"
                }
              ].map((pill, idx) => (
                <div key={idx} className="bg-white p-10 rounded-2xl shadow-sm border hover:shadow-xl transition-all hover:-translate-y-2 flex flex-col items-center text-center space-y-6">
                  <div className="w-16 h-16 bg-primary/5 rounded-full flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    <pill.icon size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-primary">{pill.title}</h3>
                  <p className="text-gray-500 leading-relaxed">{pill.desc}</p>
                  <Button variant="outline" className="border-secondary text-secondary hover:bg-secondary hover:text-white" asChild>
                    <Link href={pill.link}>En savoir plus</Link>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-secondary">
          <div className="container text-center space-y-8">
            <h2 className="text-4xl font-bold text-primary font-headline">Prêt à contribuer à la science ?</h2>
            <p className="text-xl text-primary/80 max-w-2xl mx-auto">
              Rejoignez notre réseau international d'experts et participez activement au rayonnement de la recherche scientifique.
            </p>
            <div className="flex justify-center gap-4">
              <Button size="lg" className="bg-primary text-white hover:bg-primary/90 px-10 h-14" asChild>
                <Link href="/adhesion">Adhérer maintenant</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}