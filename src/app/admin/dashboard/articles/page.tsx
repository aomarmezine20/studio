"use client";

import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase'; // Import auth
import { toast } from 'sonner';

const ArticlesAdminPage = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = auth.currentUser; // Get the current user

    if (!user) {
      toast.error("Vous devez être connecté pour créer un article.");
      return;
    }

    try {
      await addDoc(collection(db, 'articles'), {
        title,
        content,
        createdAt: new Date(),
        createdBy: user.uid, // Add the createdBy field
      });
      toast.success('Article créé avec succès!');
      setTitle('');
      setContent('');
    } catch (error) {
      console.error('Error adding document: ', error);
      toast.error("Erreur lors de la création de l'article.");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Gérer les articles</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block font-medium">Titre</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label htmlFor="content" className="block font-medium">Contenu</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-2 border rounded"
            rows={10}
            required
          />
        </div>
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Créer l'article
        </button>
      </form>
    </div>
  );
};

export default ArticlesAdminPage;
