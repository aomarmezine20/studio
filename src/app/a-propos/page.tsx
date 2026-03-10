'use client';

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Microscope, Target, Users, Award, MessageCircle, Loader2 } from "lucide-react";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const iconMap = {
    Target: Target,
    Users: Users,
    Award: Award,
    Default: Microscope
};


function DirectorMessage() {
  const [message, setMessage] = useState<{ title: string; content: string; imageUrl: string; } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const docRef = doc(db, 'singleContent', 'directorMessage');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setMessage(docSnap.data() as { title: string; content: string; imageUrl: string; });
        }
      } catch (error) {
        console.error("Failed to fetch director message:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMessage();
  }, []);

  if (loading) {
    return <div className="flex justify-center py-10"><Loader2 className="animate-spin text-primary" /></div>;
  }

  if (!message) {
    return null;
  }

  return (
    <section className="py-20 bg-muted/30">
      <div className="container">
        <div className="grid md:grid-cols-3 gap-12 items-center">
          <div className="relative w-full h-80 md:h-full rounded-2xl overflow-hidden shadow-xl min-h-[300px]">
            {message.imageUrl && 
              <Image 
                src={message.imageUrl} 
                alt="Photo du directeur" 
                fill 
                className="object-cover"
              />
            }
          </div>
          <div className="md:col-span-2">
            <Card className="shadow-lg border-t-4 border-primary">
              <CardHeader className="text-center">
                <MessageCircle className="mx-auto h-12 w-12 text-primary/30" />
                <CardTitle className="text-3xl font-bold text-primary font-headline mt-4">{message.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-center text-muted-foreground leading-relaxed whitespace-pre-line">
                {message.content}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}

// Define the types for our data
interface ObjectiveItem {
  id: number;
  title: string;
  desc: string;
  icon?: keyof typeof iconMap;
}

interface AboutContent {
  mainDescription: string;
  objectives: ObjectiveItem[];
}


export default function AboutPage() {
  const heroImg = PlaceHolderImages.find(img => img.id === 'hero-bg');
  const [content, setContent] = useState<AboutContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
        setLoading(true);
        try {
            const docRef = doc(db, 'singleContent', 'aboutPage');
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setContent(docSnap.data() as AboutContent);
            }
        } catch (error) {
            console.error("Failed to fetch about page content:", error);
        } finally {
            setLoading(false);
        }
    };
    fetchContent();
  }, []);

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

        <DirectorMessage />

        <section className="py-20">
          <div className="container grid lg:grid-cols-2 gap-12 items-center">
            {loading ? <Loader2 className="animate-spin text-primary" /> : 
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-primary font-headline" id="objectifs">Notre Mission</h2>
              <p className="text-muted-foreground leading-relaxed">
                {content?.mainDescription}
              </p>
              <div className="grid gap-6">
                {content?.objectives.map((item, i) => {
                  const Icon = iconMap[item.icon || 'Default'];
                  return (
                    <div key={i} className="flex gap-4">
                      <div className="p-3 bg-secondary/10 rounded-lg text-secondary h-fit">
                        <Icon size={24} />
                      </div>
                      <div>
                        <h4 className="font-bold text-primary">{item.title}</h4>
                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>}
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
