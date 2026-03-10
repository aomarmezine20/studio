
"use client";

import { useState, useEffect } from "react";
import { db, storage } from "@/lib/firebase";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, query, orderBy } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Plus, Pencil, Trash2, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

export default function PartnersAdminPage() {
  const [partners, setPartners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<any>(null);
  const [formLoading, setFormLoading] = useState(false);
  const { toast } = useToast();

  const [name, setName] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "partners"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      setPartners(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      toast({ title: "Erreur", description: "Impossible de charger les partenaires", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName("");
    setWebsiteUrl("");
    setLogoFile(null);
    setLogoPreview(null);
    setEditingPartner(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleEdit = (partner: any) => {
    setEditingPartner(partner);
    setName(partner.name);
    setWebsiteUrl(partner.websiteUrl || "");
    setLogoPreview(partner.logoUrl || null);
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    setFormLoading(true);

    try {
      let logoUrl = editingPartner?.logoUrl || "";
      let logoPath = editingPartner?.logoPath || "";

      if (logoFile) {
        logoPath = `partners/${Date.now()}-${logoFile.name}`;
        const storageRef = ref(storage, logoPath);
        await uploadBytes(storageRef, logoFile);
        logoUrl = await getDownloadURL(storageRef);
      }

      const partnerData = { name, websiteUrl, logoUrl, logoPath, updatedAt: serverTimestamp() };

      if (editingPartner) {
        await updateDoc(doc(db, "partners", editingPartner.id), partnerData);
        toast({ title: "Succès", description: "Partenaire mis à jour" });
      } else {
        await addDoc(collection(db, "partners"), { ...partnerData, createdAt: serverTimestamp() });
        toast({ title: "Succès", description: "Partenaire ajouté" });
      }
      
      setIsDialogOpen(false);
      resetForm();
      fetchPartners();
    } catch (error) {
      toast({ title: "Erreur", description: "Une erreur est survenue", variant: "destructive" });
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (partner: any) => {
    if (!confirm("Voulez-vous vraiment supprimer ce partenaire ?")) return;
    try {
      await deleteDoc(doc(db, "partners", partner.id));
      if (partner.logoPath) {
        const logoRef = ref(storage, partner.logoPath);
        await deleteObject(logoRef);
      }
      toast({ title: "Supprimé", description: "Le partenaire a été supprimé" });
      fetchPartners();
    } catch (error) {
      toast({ title: "Erreur", description: "Impossible de supprimer", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-bold text-primary font-headline">Gestion des Partenaires</h1>
                <p className="text-muted-foreground">Ajoutez et gérez les logos de vos partenaires.</p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
                <DialogTrigger asChild>
                    <Button className="gap-2"><Plus size={20} /> Nouveau Partenaire</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingPartner ? "Modifier le Partenaire" : "Ajouter un Partenaire"}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nom du partenaire</Label>
                            <Input id="name" value={name} onChange={e => setName(e.target.value)} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="websiteUrl">Site web (URL)</Label>
                            <Input id="websiteUrl" type="url" value={websiteUrl} onChange={e => setWebsiteUrl(e.target.value)} placeholder="https://example.com" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="logo">Logo</Label>
                            <Input id="logo" type="file" onChange={handleFileChange} accept="image/*" />
                            {logoPreview && <Image src={logoPreview} alt="Aperçu du logo" width={100} height={100} className="mt-2 rounded-md object-contain" />}
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Annuler</Button>
                            <Button type="submit" disabled={formLoading}>
                                {formLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {editingPartner ? "Enregistrer" : "Ajouter"}
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
                                <TableHead>Logo</TableHead>
                                <TableHead>Nom</TableHead>
                                <TableHead>Site Web</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {partners.map((p) => (
                                <TableRow key={p.id}>
                                    <TableCell>
                                        {p.logoUrl && <Image src={p.logoUrl} alt={p.name} width={60} height={60} className="rounded-sm object-contain"/>}
                                    </TableCell>
                                    <TableCell className="font-medium">{p.name}</TableCell>
                                    <TableCell><a href={p.websiteUrl} target="_blank" className="text-primary hover:underline">{p.websiteUrl}</a></TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button variant="ghost" size="icon" onClick={() => handleEdit(p)}><Pencil size={18} className="text-blue-600" /></Button>
                                        <Button variant="ghost" size="icon" onClick={() => handleDelete(p)}><Trash2 size={18} className="text-red-600" /></Button>
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
