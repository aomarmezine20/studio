"use client";

import { useState, useEffect } from "react";
import { db, storage } from "@/lib/firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, UploadCloud } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

const DirectorMessagePage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [existingImagePath, setExistingImagePath] = useState<string | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const docRef = doc(db, 'singleContent', 'directorMessage');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setTitle(data.title || "");
          setContent(data.content || "");
          setExistingImageUrl(data.imageUrl || null);
          setImagePreview(data.imageUrl || null);
          setExistingImagePath(data.imagePath || null);
        }
      } catch (error) {
        toast({ title: "Erreur", description: "Impossible de charger les données.", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [toast]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      let imageUrl = existingImageUrl;
      let imagePath = existingImagePath;

      // Handle image upload if a new file is selected
      if (imageFile) {
        // Delete old image if it exists
        if (existingImagePath) {
          try {
            const oldImageRef = ref(storage, existingImagePath);
            await deleteObject(oldImageRef);
          } catch (deleteError) {
             // If the old file doesn't exist, we can ignore the error
            console.warn("Could not delete old image, it might not exist:", deleteError);
          }
        }
        
        // Upload new image
        imagePath = `director/${Date.now()}-${imageFile.name}`;
        const storageRef = ref(storage, imagePath);
        await uploadBytes(storageRef, imageFile);
        imageUrl = await getDownloadURL(storageRef);
      }

      const dataToSave = {
        title,
        content,
        imageUrl,
        imagePath,
        updatedAt: serverTimestamp(),
      };

      await setDoc(docRef, dataToSave, { merge: true });

      toast({ title: "Succès", description: "Le message a été mis à jour." });
      // update state after successful save
      setImageFile(null);
      setExistingImageUrl(imageUrl);
      setExistingImagePath(imagePath);

    } catch (error) {
      console.error(error);
      toast({ title: "Erreur", description: "Une erreur est survenue lors de la sauvegarde.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary font-headline">Mot du Directeur</h1>
        <p className="text-muted-foreground">Mettez à jour le message et la photo du directeur.</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl">
        <div className="space-y-2">
          <Label htmlFor="title">Titre du message</Label>
          <Input id="title" value={title} onChange={e => setTitle(e.target.value)} required />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="content">Contenu du message</Label>
          <Textarea 
            id="content" 
            value={content} 
            onChange={e => setContent(e.target.value)}
            className="min-h-[200px]"
            rows={12}
            required
          />
        </div>

        <div className="space-y-4">
            <Label htmlFor="image">Photo du directeur</Label>
            <div className="flex items-center gap-6">
                <div className="relative w-40 h-40 rounded-lg overflow-hidden border-2 border-dashed flex items-center justify-center bg-muted/50">
                    {imagePreview ? (
                        <Image src={imagePreview} alt="Aperçu" fill className="object-cover" />
                    ) : (
                        <UploadCloud className="w-12 h-12 text-muted-foreground/50" />
                    )}
                </div>
                <Input 
                    id="image" 
                    type="file" 
                    onChange={handleFileChange} 
                    accept="image/*"
                    className="max-w-xs"
                />
            </div>
        </div>

        <Button type="submit" disabled={saving}>
          {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Enregistrer les modifications
        </Button>
      </form>
    </div>
  );
};

export default DirectorMessagePage;
