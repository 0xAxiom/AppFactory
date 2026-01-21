'use client';

import { motion } from 'framer-motion';
import { Sparkles, Zap, Shield, ArrowRight } from 'lucide-react';
import { WalletButton } from '@/components/WalletButton';

/**
 * Home Page
 *
 * Landing page for the dApp example. Demonstrates:
 * - Framer Motion animations
 * - Tailwind CSS styling
 * - Responsive layout
 * - Wallet connection button
 */

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-black/50 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-primary" />
              <span className="font-bold text-lg">dApp Example</span>
            </div>
            <WalletButton />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl sm:text-6xl font-bold mb-6">
              Build{' '}
              <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                Decentralized
              </span>{' '}
              Apps
            </h1>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              This is a minimal dApp example from App Factory. It demonstrates
              the structure and patterns you should expect from full builds.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button className="px-8 py-4 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
              Get Started <ArrowRight className="w-4 h-4" />
            </button>
            <button className="px-8 py-4 border border-white/20 rounded-lg font-medium hover:bg-white/5 transition-colors">
              View Documentation
            </button>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-secondary/30">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-center mb-12"
          >
            What This Example Includes
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: 'Next.js App Router',
                description:
                  'Modern React server components with file-based routing',
              },
              {
                icon: Sparkles,
                title: 'Framer Motion',
                description: 'Smooth animations and transitions for better UX',
              },
              {
                icon: Shield,
                title: 'TypeScript',
                description: 'Full type safety for reliable, maintainable code',
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-xl bg-secondary border border-white/10 hover:border-primary/50 transition-colors"
              >
                <feature.icon className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-white/10">
        <div className="max-w-6xl mx-auto text-center text-gray-400">
          <p>
            Built with{' '}
            <a
              href="https://github.com/MeltedMindz/AppFactory"
              className="text-primary hover:underline"
            >
              App Factory
            </a>
          </p>
        </div>
      </footer>
    </main>
  );
}
