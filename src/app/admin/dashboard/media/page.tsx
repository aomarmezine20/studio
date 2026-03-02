
"use client";

import { useState, useEffect } from "react";
import { useFirestore } from "@/firebase";
import { collection, getDocs, addDoc, deleteDoc, doc, serverTimestamp, query, orderBy } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Plus, Trash2, Image as ImageIcon, Video, FileText, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

export default function MediaAdminPage() {
  const firestore = useFirestore();
  const [media, setMedia] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const { toast } = useToast();

  const [fileName, setFileName] = useState("");
  const [url, setUrl] = useState("");
  const [type, setType] = useState("image");
  const [altText, setAltText] = useState("");

  useEffect(() => {
    if (firestore) fetchMedia();
  }, [firestore]);

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const q = query(collection(firestore!, "media"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      setMedia(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      toast({ title: "Erreur", description: "Impossible de charger la médiathèque", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleAddMedia = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firestore) return;
    setFormLoading(true);
    try {
      await addDoc(collection(firestore, "media"), {
        fileName,
        url,
        type,
        altText,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      toast({ title: "Succès", description: "Média ajouté à la bibliothèque" });
      setFileName("");
      setUrl("");
      setAltText("");
      fetchMedia();
    } catch (error) {
      toast({ title: "Erreur", description: "Une erreur est survenue", variant: "destructive" });
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer ce média ?")) return;
    try {
      await deleteDoc(doc(firestore!, "media", id));
      toast({ title: "Supprimé", description: "Média retiré de la bibliothèque" });
      fetchMedia();
    } catch (error) {
      toast({ title: "Erreur", description: "Impossible de supprimer", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-primary font-headline">Médiathèque</h1>
        <p className="text-muted-foreground">Gérez vos images, vidéos et documents PDF.</p>
      </div>

      <Card>
        <CardHeader><CardTitle>Ajouter un nouveau média</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleAddMedia} className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <div className="space-y-2">
              <Label>Nom du fichier</Label>
              <Input value={fileName} onChange={e => setFileName(e.target.value)} placeholder="Ex: Photo Colloque 2023" required />
            </div>
            <div className="space-y-2">
              <Label>URL</Label>
              <Input value={url} onChange={e => setUrl(e.target.value)} placeholder="https://..." required />
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="image">Image</SelectItem>
                  <SelectItem value="video">Vidéo (Lien)</SelectItem>
                  <SelectItem value="pdf">Document PDF</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" disabled={formLoading} className="w-full">
              {formLoading ? <Loader2 className="animate-spin h-4 w-4" /> : <Plus className="mr-2" />} Ajouter
            </Button>
          </form>
        </CardContent>
      </Card>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary" /></div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {media.map((item) => (
            <div key={item.id} className="group relative aspect-square bg-muted rounded-lg overflow-hidden border">
              {item.type === 'image' ? (
                <Image src={item.url} alt={item.fileName} fill className="object-cover" />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                  {item.type === 'video' ? <Video size={32} /> : <FileText size={32} />}
                  <span className="text-[10px] mt-2 px-2 text-center truncate w-full font-bold uppercase">{item.type}</span>
                </div>
              )}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button variant="destructive" size="icon" className="h-8 w-8" onClick={() => handleDelete(item.id)}>
                  <Trash2 size={14} />
                </Button>
                <a href={item.url} target="_blank" className="p-2 bg-white rounded-md text-primary hover:bg-white/90">
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
