'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { SidebarProvider, Sidebar, SidebarContent, SidebarHeader, SidebarFooter, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarGroup, SidebarGroupLabel, SidebarGroupContent } from "@/components/ui/sidebar";
import { LayoutDashboard, FileText, Calendar, BookOpen, Image as ImageIcon, Users, LogOut, Globe, Microscope, Settings, Info, MessageSquare, Building, GraduationCap } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Toaster } from "@/components/ui/toaster";

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        router.push("/admin/login");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/admin/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden bg-muted/30">
        <Sidebar className="border-r shadow-sm">
          <SidebarHeader className="p-4 border-b">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="p-1.5 bg-primary rounded-lg text-secondary group-hover:scale-110 transition-transform">
                <Microscope size={20} />
              </div>
              <span className="font-bold text-primary text-lg">CEEMTS Admin</span>
            </Link>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Principal</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <Link href="/admin/dashboard" asChild>
                      <SidebarMenuButton tooltip="Dashboard"><LayoutDashboard /><span>Dashboard</span></SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>Gestion de Contenu</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <Link href="/admin/dashboard/articles" asChild>
                      <SidebarMenuButton tooltip="Articles"><FileText /><span>Articles</span></SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <Link href="/admin/dashboard/evenements" asChild>
                      <SidebarMenuButton tooltip="Événements"><Calendar /><span>Événements</span></SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <Link href="/admin/dashboard/publications" asChild>
                      <SidebarMenuButton tooltip="Publications"><BookOpen /><span>Publications</span></SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <Link href="/admin/dashboard/formations" asChild>
                      <SidebarMenuButton tooltip="Formations"><GraduationCap /><span>Formations</span></SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <Link href="/admin/dashboard/experts" asChild>
                      <SidebarMenuButton tooltip="Experts"><Users /><span>Experts</span></SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <Link href="/admin/dashboard/gouvernance" asChild>
                      <SidebarMenuButton tooltip="Gouvernance"><Users /><span>Gouvernance</span></SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <Link href="/admin/dashboard/partenaires" asChild>
                      <SidebarMenuButton tooltip="Partenaires"><Building /><span>Partenaires</span></SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <Link href="/admin/dashboard/media" asChild>
                      <SidebarMenuButton tooltip="Médiathèque"><ImageIcon /><span>Médiathèque</span></SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>Site Web</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <Link href="/admin/dashboard/homepage" asChild>
                      <SidebarMenuButton tooltip="Accueil"><Globe /><span>Page d'accueil</span></SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                   <SidebarMenuItem>
                    <Link href="/admin/dashboard/a-propos" asChild>
                      <SidebarMenuButton tooltip="À Propos"><Info /><span>Page À Propos</span></SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                   <SidebarMenuItem>
                    <Link href="/admin/dashboard/mot-du-directeur" asChild>
                      <SidebarMenuButton tooltip="Mot du Directeur"><MessageSquare /><span>Mot du Directeur</span></SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <Link href="/admin/dashboard/users" asChild>
                      <SidebarMenuButton tooltip="Admins"><Users /><span>Utilisateurs</span></SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="p-4 border-t">
            <div className="flex flex-col gap-2">
              <div className="text-xs text-muted-foreground truncate px-2 italic">
                {user.email}
              </div>
              <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Déconnexion
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>
        <main className="flex-1 overflow-y-auto p-8 relative">
          {children}
        </main>
        <Toaster />
      </div>
    </SidebarProvider>
  );
}
