'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import type { Project } from '@/lib/data/projects';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="group"
    >
      <Link href={`/work/${project.slug}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-muted mb-4">
          <Image
            src={project.heroImage}
            alt={project.heroAlt}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{project.industry}</span>
            <span aria-hidden="true">·</span>
            <span>{project.year}</span>
          </div>
          <h3 className="text-xl font-semibold group-hover:text-muted-foreground transition-colors">
            {project.title}
          </h3>
          <p className="text-muted-foreground line-clamp-2">
            {project.excerpt}
          </p>
          <span className="inline-flex items-center text-sm font-medium gap-1 group-hover:gap-2 transition-all">
            View Case Study
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </span>
        </div>
      </Link>
    </motion.article>
  );
}
