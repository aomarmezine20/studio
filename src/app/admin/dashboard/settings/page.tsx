'use client';

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Construction } from "lucide-react";

const SettingsPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary font-headline">Paramètres</h1>
        <p className="text-muted-foreground">Gérez les paramètres généraux de votre site.</p>
      </div>
      <Card className="border-dashed border-2">
        <CardHeader className="text-center">
            <div className="mx-auto bg-muted/50 w-fit p-4 rounded-full">
                <Construction className="w-12 h-12 text-muted-foreground" />
            </div>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-lg font-semibold text-muted-foreground">Page en construction</p>
          <p className="text-sm text-muted-foreground mt-2">
            Cette section est en cours de développement. Bientôt, vous pourrez gérer ici les configurations globales de votre site.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;
