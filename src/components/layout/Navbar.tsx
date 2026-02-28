"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { Menu, X, Microscope } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const sections = [
  {
    title: "Identité",
    items: [
      { title: "Qui sommes-nous", href: "/a-propos" },
      { title: "Mot du Directeur", href: "/a-propos#directeur" },
      { title: "Objectifs", href: "/a-propos#objectifs" },
      { title: "Adhésion", href: "/adhesion" },
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
      { title: "Revue REEM", href: "/publications/reem" },
      { title: "Ouvrages Spéciaux", href: "/publications/ouvrages" },
      { title: "Rapports de Recherche", href: "/publications/rapports" },
    ],
  },
  {
    title: "Expertise",
    items: [
      { title: "Gouvernance", href: "/gouvernance" },
      { title: "Annuaire des Experts", href: "/experts" },
      { title: "Partenariats", href: "/partenariats" },
    ],
  },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-20 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center space-x-2">
            <Microscope className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold tracking-tight text-primary font-headline">
              Science<span className="text-secondary">Connect</span>
            </span>
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center space-x-4">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link href="/" legacyBehavior passHref>
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
                <Link href="/mediatheque" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Médiathèque
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/contact" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Contact
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" className="hidden sm:flex" asChild>
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
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-4 mt-8">
                <Link href="/" className="text-lg font-semibold">Accueil</Link>
                {sections.map((section) => (
                  <div key={section.title} className="flex flex-col gap-2">
                    <h4 className="text-sm font-bold uppercase text-muted-foreground">{section.title}</h4>
                    {section.items.map((item) => (
                      <Link key={item.title} href={item.href} className="pl-4 text-base hover:text-primary transition-colors">
                        {item.title}
                      </Link>
                    ))}
                  </div>
                ))}
                <Link href="/mediatheque" className="text-lg font-semibold">Médiathèque</Link>
                <Link href="/contact" className="text-lg font-semibold">Contact</Link>
              </nav>
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
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";