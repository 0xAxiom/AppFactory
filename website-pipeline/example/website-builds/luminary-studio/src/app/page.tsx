'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProjectCard } from '@/components/sections/project-card';
import { getFeaturedProjects } from '@/lib/data/projects';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
};

const staggerContainer = {
  animate: {
    transition: { staggerChildren: 0.1 },
  },
};

export default function HomePage() {
  const featuredProjects = getFeaturedProjects();

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={staggerContainer}
    >
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center px-4">
        <div className="container max-w-4xl text-center">
          <motion.h1
            variants={fadeInUp}
            className="text-5xl md:text-7xl font-bold tracking-tight mb-6"
          >
            Brands that resonate.
          </motion.h1>
          <motion.p
            variants={fadeInUp}
            className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto"
          >
            We design brand identities for companies with something to say.
            Premium craft, startup velocity.
          </motion.p>
          <motion.div variants={fadeInUp} className="flex gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/work">
                View Work
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/contact">Start a Project</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Featured Work Section */}
      <section className="py-24 px-4">
        <div className="container">
          <motion.div
            variants={fadeInUp}
            className="flex items-baseline justify-between mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold">Selected Work</h2>
            <Link
              href="/work"
              className="text-muted-foreground hover:text-foreground transition-colors hidden sm:inline-flex items-center gap-1"
            >
              View all
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </motion.div>
          <motion.div
            variants={staggerContainer}
            className="grid md:grid-cols-2 gap-8"
          >
            {featuredProjects.slice(0, 4).map((project) => (
              <motion.div key={project.slug} variants={fadeInUp}>
                <ProjectCard project={project} />
              </motion.div>
            ))}
          </motion.div>
          <motion.div variants={fadeInUp} className="mt-12 text-center sm:hidden">
            <Button asChild variant="outline">
              <Link href="/work">View all work</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-24 px-4 bg-muted/50">
        <div className="container max-w-4xl text-center">
          <motion.h2
            variants={fadeInUp}
            className="text-3xl md:text-4xl font-bold mb-6"
          >
            Everything from logo to launch.
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="text-lg text-muted-foreground mb-10"
          >
            Brand Identity · Visual Systems · Brand Guidelines · Packaging Design
          </motion.p>
          <motion.div variants={fadeInUp}>
            <Button asChild variant="outline">
              <Link href="/services">
                Explore Services
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-24 px-4">
        <div className="container max-w-3xl text-center">
          <motion.blockquote variants={fadeInUp}>
            <p className="text-2xl md:text-3xl font-medium mb-8 text-balance">
              &ldquo;Luminary didn&apos;t just design our brand—they helped us discover
              who we really are. The result exceeded every expectation.&rdquo;
            </p>
            <footer className="text-muted-foreground">
              <cite className="not-italic">
                <span className="font-medium text-foreground">Sarah Chen</span>
                <br />
                CEO, Nexus Technologies
              </cite>
            </footer>
          </motion.blockquote>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-foreground text-background">
        <div className="container max-w-3xl text-center">
          <motion.h2
            variants={fadeInUp}
            className="text-3xl md:text-4xl font-bold mb-6"
          >
            Ready to build something great?
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="text-lg opacity-80 mb-10"
          >
            Tell us about your project and let&apos;s see if we&apos;re a good fit.
          </motion.p>
          <motion.div variants={fadeInUp}>
            <Button
              asChild
              size="lg"
              className="bg-background text-foreground hover:bg-background/90"
            >
              <Link href="/contact">Start a Project</Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
}
