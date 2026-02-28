"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Loader2, Send, Lightbulb, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { aiPoweredContactFormFaq, type AIPoweredContactFormFaqOutput } from "@/ai/flows/ai-powered-contact-form-faq";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

const formSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  subject: z.string().min(5, "Le sujet doit être plus explicite"),
  message: z.string().min(10, "Le message est trop court"),
});

export function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<AIPoweredContactFormFaqOutput['suggestions']>([]);
  const [isTyping, setIsTyping] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const messageValue = form.watch("message");

  // AI Suggestions debounced
  useEffect(() => {
    if (messageValue.length < 15) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setIsTyping(true);
        const res = await aiPoweredContactFormFaq({ query: messageValue });
        setSuggestions(res.suggestions);
      } catch (err) {
        console.error("AI FAQ Suggestion error", err);
      } finally {
        setIsTyping(false);
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [messageValue]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      await addDoc(collection(db, "contactMessages"), {
        ...values,
        createdAt: serverTimestamp(),
        status: "unread"
      });
      toast({
        title: "Message envoyé",
        description: "Nous avons bien reçu votre demande et reviendrons vers vous rapidement.",
      });
      form.reset();
      setSuggestions([]);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi du message.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid lg:grid-cols-5 gap-8">
      <div className="lg:col-span-3">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom Complet</FormLabel>
                    <FormControl>
                      <Input placeholder="Jean Dupont" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="jean@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sujet</FormLabel>
                  <FormControl>
                    <Input placeholder="Adhésion, Partenariat, REEM..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Comment pouvons-nous vous aider ?" 
                      className="min-h-[200px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full h-12 text-lg" disabled={loading}>
              {loading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <>
                  Envoyer le message <Send className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          </form>
        </Form>
      </div>

      <div className="lg:col-span-2 space-y-4">
        <Card className="border-secondary/30 bg-secondary/5 h-full">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2 text-primary">
              <Lightbulb className="text-secondary" /> Suggestions IA
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isTyping && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground animate-pulse">
                <Loader2 className="h-4 w-4 animate-spin" /> Analyse de votre message...
              </div>
            )}
            {!isTyping && suggestions.length === 0 && (
              <p className="text-sm text-muted-foreground italic">
                Tapez votre message pour voir des réponses suggérées de notre FAQ automatiquement.
              </p>
            )}
            {suggestions.map((s, i) => (
              <div key={i} className="p-4 bg-white rounded-lg border shadow-sm space-y-2 animate-in fade-in slide-in-from-right-4">
                <h5 className="font-bold text-sm text-primary">{s.title}</h5>
                <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                  {s.content}
                </p>
                <Button variant="link" size="sm" className="p-0 h-auto text-xs text-secondary">
                  Lire la réponse complète
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}