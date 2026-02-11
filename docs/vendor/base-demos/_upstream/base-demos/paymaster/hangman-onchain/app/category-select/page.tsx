'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Word {
  word: string;
  description: string;
  hints: string[];
}

interface Category {
  name: string;
  words: Word[];
}

interface Categories {
  categories: Category[];
}

export default function CategorySelect() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await fetch('/wordCategories.json');
        const data: Categories = await response.json();
        setCategories(data.categories);
      } catch (error) {
        console.error('Error loading categories:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  const handleCategorySelect = (categoryName: string) => {
    router.push(`/game/${encodeURIComponent(categoryName)}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-background p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Choose a Category</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Select a category to start playing Hangman
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <button
              key={category.name}
              onClick={() => handleCategorySelect(category.name)}
              className="group relative bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-4 text-center">
                  {category.name}
                </h2>
                <div className="space-y-2">
                  <p className="text-gray-600 dark:text-gray-300 text-center">
                    {category.words.length} words to guess
                  </p>
                  <div className="flex justify-center items-center space-x-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Sample words:
                    </span>
                    <span className="text-sm font-medium">
                      {category.words
                        .slice(0, 2)
                        .map((w) => w.word)
                        .join(', ')}
                    </span>
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 bg-blue-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
            </button>
          ))}
        </div>

        {/* Back Button */}
        <div className="text-center mt-8">
          <button
            onClick={() => router.push('/')}
            className="px-6 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors duration-200"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
