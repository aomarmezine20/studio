"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuContent,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";

const sections = [
  {
    title: "Identité",
    items: [
      { title: "Qui sommes-nous", href: "/a-propos" },
      { title: "Mot du Directeur", href: "/a-propos" },
      { title: "Objectifs", href: "/a-propos#objectifs" },
      { title: "Gouvernance", href: "/gouvernance" },
    ],
  },
  {
    title: "Événements",
    items: [
      { title: "Colloques & Conférences", href: "/evenements?cat=colloques" },
      { title: "Journées d’Étude", href: "/evenements?cat=journees" },
      { title: "Séminaires Doctoraux", href: "/evenements?cat=seminaires" },
      { title: "Webinaires", href: "/evenements?cat=webinaires" },
    ],
  },
  {
    title: "Publications",
    items: [
      { title: "Revue REEM", href: "/publications?cat=reem" },
      { title: "Ouvrages Spéciaux", href: "/publications?cat=ouvrages" },
      { title: "Rapports de Recherche", href: "/publications?cat=rapports" },
    ],
  },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-24 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center space-x-3">
            <div className="relative h-16 w-16 overflow-hidden rounded-md">
              <Image 
                src="/logo.jpg" 
                alt="CEEMTS Logo" 
                fill 
                className="object-contain"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="hidden sm:block text-xl font-bold tracking-tight text-primary font-headline leading-none">
                CEEMTS
              </span>
              <span className="hidden md:block text-[10px] text-muted-foreground uppercase font-medium mt-1">
                Centre d'études en économie management
              </span>
            </div>
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center space-x-2">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link href="/" asChild>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Accueil
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              {sections.map((section) => (
                <NavigationMenuItem key={section.title}>
                  <NavigationMenuTrigger>{section.title}</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      {section.items.map((item) => (
                        <ListItem
                          key={item.title}
                          title={item.title}
                          href={item.href}
                        />
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              ))}
               <NavigationMenuItem>
                <Link href="/formations" asChild>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Formations
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/partenaires" asChild>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Partenaires
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/mediatheque" asChild>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Médiathèque
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/contact" asChild>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Contact
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="default" size="sm" className="hidden sm:flex bg-secondary hover:bg-secondary/90 text-primary font-bold" asChild>
            <Link href="/admin/login">Admin</Link>
          </Button>
          
          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[85vw] sm:w-[400px] p-0 flex flex-col">
              <SheetHeader className="p-6 border-b text-left shrink-0">
                <SheetTitle className="text-primary flex items-center gap-3">
                  <div className="relative h-14 w-14">
                    <Image src="/logo.jpg" alt="Logo" fill className="object-contain" />
                  </div>
                  CEEMTS
                </SheetTitle>
              </SheetHeader>
              <ScrollArea className="flex-1 p-6">
                <nav className="flex flex-col gap-8 pb-10">
                  <Link href="/" className="text-xl font-bold text-primary">Accueil</Link>
                  {sections.map((section) => (
                    <div key={section.title} className="flex flex-col gap-4">
                      <h4 className="text-xs font-bold uppercase text-secondary tracking-widest">{section.title}</h4>
                      <div className="flex flex-col gap-3 pl-4 border-l-2 border-muted">
                        {section.items.map((item) => (
                          <Link key={item.title} href={item.href} className="text-base hover:text-primary transition-colors py-1">
                            {item.title}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                  <div className="flex flex-col gap-4 pt-2">
                    <Link href="/formations" className="text-lg font-bold text-primary">Formations</Link>
                    <Link href="/partenaires" className="text-lg font-bold text-primary">Partenaires</Link>
                    <Link href="/mediatheque" className="text-lg font-bold text-primary">Médiathèque</Link>
                    <Link href="/contact" className="text-lg font-bold text-primary">Contact</Link>
                  </div>
                  <div className="pt-6 border-t mt-4">
                    <Button className="bg-secondary text-primary hover:bg-secondary/90 font-bold w-full h-12" asChild>
                      <Link href="/admin/login">Connexion Admin</Link>
                    </Button>
                  </div>
                </nav>
              </ScrollArea>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          href={props.href || "#"}
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-bold leading-none text-primary">{title}</div>
          {children && (
            <p className="line-clamp-2 text-xs leading-snug text-muted-foreground mt-1">
              {children}
            </p>
          )}
        </Link>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";