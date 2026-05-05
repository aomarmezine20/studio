"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const SettingsPage = () => {
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [facebook, setFacebook] = useState("");
  const [twitter, setTwitter] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const docRef = doc(db, 'singleContent', 'settings');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setAddress(data.address || "CEEMTS, Casablanca, Maroc");
          setPhone(data.phone || "+212 (0) 5XX XX XX XX");
          setEmail(data.email || "contact@ceemts.org");
          setFacebook(data.facebook || "#");
          setTwitter(data.twitter || "#");
          setLinkedin(data.linkedin || "#");
        } else {
          setAddress("CEEMTS, Casablanca, Maroc");
          setPhone("+212 (0) 5XX XX XX XX");
          setEmail("contact@ceemts.org");
          setFacebook("#");
          setTwitter("#");
          setLinkedin("#");
        }
      } catch (error) {
        toast.error("Impossible de charger les paramètres.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await setDoc(docRef, {
        address,
        phone,
        email,
        facebook,
        twitter,
        linkedin,
        updatedAt: serverTimestamp()
      }, { merge: true });
      toast.success("Les paramètres ont été mis à jour avec succès.");
    } catch (error) {
      toast.error("Erreur lors de l'enregistrement des paramètres.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-muted-foreground"><Loader2 className="w-8 h-8 animate-spin mx-auto" /></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary font-headline">Paramètres</h1>
        <p className="text-muted-foreground">Gérez les informations de contact globales du site.</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl bg-white p-6 border rounded-lg shadow-sm">
        <h2 className="text-xl font-bold text-primary mb-4">Informations de Contact</h2>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="address">Adresse physique</Label>
            <Input id="address" value={address} onChange={e => setAddress(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Téléphone</Label>
            <Input id="phone" value={phone} onChange={e => setPhone(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email de contact</Label>
            <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
        </div>

        <h2 className="text-xl font-bold text-primary mb-4 pt-4 border-t">Réseaux Sociaux</h2>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="facebook">Lien Facebook</Label>
            <Input id="facebook" value={facebook} onChange={e => setFacebook(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="twitter">Lien Twitter / X</Label>
            <Input id="twitter" value={twitter} onChange={e => setTwitter(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="linkedin">Lien LinkedIn</Label>
            <Input id="linkedin" value={linkedin} onChange={e => setLinkedin(e.target.value)} />
          </div>
        </div>

        <div className="pt-4 border-t">
          <Button type="submit" disabled={saving}>
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Enregistrer les modifications
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SettingsPage;
