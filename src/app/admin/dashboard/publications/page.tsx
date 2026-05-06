"use client";

import { useState, useEffect } from "react";
import { db, auth, storage } from "@/lib/firebase";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, query, orderBy } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Plus, Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function PublicationsAdminPage() {
  const [publications, setPublications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPub, setEditingPub] = useState<any>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const { toast } = useToast();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Revue REEM");
  const [pdfUrl, setPdfUrl] = useState("");

  const publicationCategories = [
    'Revue REEM',
    'Ouvrages Spéciaux',
    'Rapports de Recherche'
  ];

  useEffect(() => {
    fetchPublications();
  }, []);

  const fetchPublications = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "publications"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      setPublications(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      toast({ title: "Erreur", description: "Impossible de charger les publications", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setCategory("Revue REEM");
    setPdfUrl("");
    setPdfFile(null);
    setUploadProgress(null);
    setEditingPub(null);
  };

  const handleEdit = (pub: any) => {
    setEditingPub(pub);
    setTitle(pub.title);
    setDescription(pub.description);
    setCategory(pub.category || "Revue REEM");
    setPdfUrl(pub.pdfUrl || "");
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) {
        toast({ title: "Erreur", description: "Vous devez être connecté.", variant: "destructive" });
        return;
    }
    
    setFormLoading(true);
    try {
      let finalPdfUrl = pdfUrl;

      // Handle PDF (Base64)
      if (pdfFile) {
        // Firestore limit is 1MB. Base64 adds ~33% overhead.
        // So we should stay below ~700KB for the raw file.
        if (pdfFile.size > 800 * 1024) {
          toast({ 
            title: "Fichier trop volumineux", 
            description: "Le PDF dépasse 800KB. Pour garantir la stabilité, il sera envoyé sur le serveur de stockage.",
            variant: "default" 
          });
          
          // Fallback to Storage for large files
          const storageRef = ref(storage, `publications/${Date.now()}_${pdfFile.name}`);
          const uploadTask = uploadBytesResumable(storageRef, pdfFile);
          finalPdfUrl = await new Promise((resolve, reject) => {
            uploadTask.on('state_changed', null, (error) => reject(error), async () => {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              resolve(downloadURL);
            });
          });
        } else {
          // Small file: Use Base64 as requested
          const reader = new FileReader();
          finalPdfUrl = await new Promise((resolve) => {
            reader.onload = () => resolve(reader.result as string);
            reader.readAsDataURL(pdfFile);
          });
        }
      }

      const pubData = { title, description, category, pdfUrl: finalPdfUrl, updatedAt: serverTimestamp() };

      if (editingPub) {
        await updateDoc(doc(db, "publications", editingPub.id), pubData);
        toast({ title: "Succès", description: "Publication mise à jour" });
      } else {
        await addDoc(collection(db, "publications"), { ...pubData, createdAt: serverTimestamp(), createdBy: user.uid });
        toast({ title: "Succès", description: "Publication ajoutée" });
      }
      setIsDialogOpen(false);
      resetForm();
      fetchPublications();
    } catch (error) {
      console.error("Submission error:", error);
      toast({ title: "Erreur", description: "Une erreur est survenue lors de l'envoi.", variant: "destructive" });
    } finally {
      setFormLoading(false);
      setUploadProgress(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Voulez-vous vraiment supprimer cette publication ?")) return;
    try {
      await deleteDoc(doc(db, "publications", id));
      toast({ title: "Supprimé", description: "La publication a été supprimée" });
      fetchPublications();
    } catch (error) {
      toast({ title: "Erreur", description: "Impossible de supprimer", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-bold text-primary font-headline">Gestion des Publications</h1>
                <p className="text-muted-foreground">Gérez les revues, ouvrages et rapports.</p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
                <DialogTrigger asChild>
                    <Button className="gap-2"><Plus size={20} /> Nouvelle Publication</Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>{editingPub ? "Modifier la Publication" : "Ajouter une Publication"}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Titre</Label>
                            <Input id="title" value={title} onChange={e => setTitle(e.target.value)} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="category">Catégorie</Label>
                            <Select value={category} onValueChange={setCategory} required>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {publicationCategories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="pdfFile">Fichier PDF (Revue)</Label>
                            <div className="flex gap-4 items-center">
                                <Input 
                                    id="pdfFile" 
                                    type="file" 
                                    accept="application/pdf" 
                                    onChange={e => setPdfFile(e.target.files?.[0] || null)} 
                                />
                                {pdfUrl && !pdfFile && (
                                    <span className="text-xs text-green-600 font-medium">Fichier déjà présent</span>
                                )}
                            </div>
                            {uploadProgress !== null && (
                                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                                    <div className="bg-primary h-2.5 rounded-full transition-all" style={{ width: `${uploadProgress}%` }}></div>
                                    <p className="text-[10px] text-right mt-1">{Math.round(uploadProgress)}%</p>
                                </div>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="pdfUrl">Ou Lien externe (Optionnel)</Label>
                            <Input id="pdfUrl" value={pdfUrl} onChange={e => setPdfUrl(e.target.value)} placeholder="https://..." />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Description / Abstract</Label>
                            <Textarea id="description" value={description} onChange={e => setDescription(e.target.value)} rows={5} required />
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Annuler</Button>
                            <Button type="submit" disabled={formLoading}>
                                {formLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {editingPub ? "Enregistrer" : "Publier"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>

        <Card>
            <CardContent className="p-0">
                {loading ? (
                    <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary" /></div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Titre</TableHead>
                                <TableHead>Catégorie</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {publications.map((pub) => (
                                <TableRow key={pub.id}>
                                    <TableCell className="font-medium max-w-xs truncate">{pub.title}</TableCell>
                                    <TableCell>{pub.category}</TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button variant="ghost" size="icon" onClick={() => handleEdit(pub)}><Pencil size={18} className="text-blue-600" /></Button>
                                        <Button variant="ghost" size="icon" onClick={() => handleDelete(pub.id)}><Trash2 size={18} className="text-red-600" /></Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
    </div>
  );
}
