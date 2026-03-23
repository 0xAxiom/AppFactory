#!/usr/bin/env node

/**
 * PR Triage Script for AppFactory
 *
 * Helps manage the 105+ open PRs by categorizing them and providing bulk actions.
 *
 * Usage:
 *   node scripts/pr-triage.js list           # List PRs by category
 *   node scripts/pr-triage.js duplicates     # Find duplicate dependency PRs
 *   node scripts/pr-triage.js critical       # Show critical PRs needing review
 *   node scripts/pr-triage.js old            # Show PRs older than 7 days
 */

import { execSync } from 'child_process';

const CATEGORIES = {
  SECURITY: ['security', 'vulnerability', 'audit'],
  DEPS: ['dep', 'update', 'bump', 'chore(deps)', 'chore: update'],
  CRITICAL: ['critical', 'fix:', 'bug', 'constructor'],
  CI: ['ci:', 'workflow', 'github actions', 'test'],
  DOCS: ['docs:', 'readme', 'documentation'],
  FEATURE: ['feat:', 'feature', 'add'],
  CHORE: ['chore:', 'cleanup', 'hygiene'],
};

function getPRs() {
  try {
    const output = execSync(
      'gh pr list --limit 200 --state open --json number,title,createdAt,author --repo MeltedMindz/AppFactory',
      {
        encoding: 'utf8',
      }
    );
    return JSON.parse(output);
  } catch (error) {
    console.error('Error fetching PRs:', error.message);
    console.log('Make sure you have gh CLI installed and authenticated');
    process.exit(1);
  }
}

function categorizePR(title) {
  const lower = title.toLowerCase();

  for (const [category, keywords] of Object.entries(CATEGORIES)) {
    if (keywords.some((keyword) => lower.includes(keyword))) {
      return category;
    }
  }
  return 'OTHER';
}

function findDuplicates(prs) {
  const groups = {};

  prs.forEach((pr) => {
    // Group by similar dependency update patterns
    const title = pr.title.toLowerCase();
    let key = 'other';

    if (title.includes('update') && title.includes('dep')) {
      key = 'dependency-updates';
    } else if (title.includes('security') || title.includes('vulnerability')) {
      key = 'security-fixes';
    } else if (title.includes('typescript') || title.includes('@types')) {
      key = 'typescript-updates';
    } else if (title.includes('eslint') || title.includes('prettier')) {
      key = 'tooling-updates';
    } else if (title.includes('anthropic') || title.includes('@anthropic')) {
      key = 'anthropic-updates';
    }

    if (!groups[key]) groups[key] = [];
    groups[key].push(pr);
  });

  return groups;
}

function isOld(createdAt, days = 7) {
  const created = new Date(createdAt);
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  return created < cutoff;
}

function main() {
  const command = process.argv[2] || 'list';
  const prs = getPRs();

  console.log(`Found ${prs.length} open PRs\n`);

  switch (command) {
    case 'list': {
      const categories = {};
      prs.forEach((pr) => {
        const category = categorizePR(pr.title);
        if (!categories[category]) categories[category] = [];
        categories[category].push(pr);
      });

      Object.entries(categories)
        .sort(([, a], [, b]) => b.length - a.length)
        .forEach(([category, categoryPRs]) => {
          console.log(`${category} (${categoryPRs.length}):`);
          categoryPRs.slice(0, 3).forEach((pr) => {
            console.log(`  #${pr.number}: ${pr.title}`);
          });
          if (categoryPRs.length > 3) {
            console.log(`  ... and ${categoryPRs.length - 3} more`);
          }
          console.log();
        });
      break;
    }

    case 'duplicates': {
      const groups = findDuplicates(prs);
      Object.entries(groups)
        .filter(([, group]) => group.length > 1)
        .forEach(([type, group]) => {
          console.log(`${type.toUpperCase()} (${group.length} PRs):`);
          group.forEach((pr) => {
            console.log(`  #${pr.number}: ${pr.title} (${pr.author.login})`);
          });
          console.log();
        });
      break;
    }

    case 'critical': {
      const critical = prs.filter(
        (pr) => categorizePR(pr.title) === 'CRITICAL'
      );
      console.log(`${critical.length} Critical PRs:`);
      critical.forEach((pr) => {
        console.log(`  #${pr.number}: ${pr.title}`);
        console.log(
          `    Created: ${new Date(pr.createdAt).toLocaleDateString()}`
        );
      });
      break;
    }

    case 'old': {
      const old = prs.filter((pr) => isOld(pr.createdAt));
      console.log(`${old.length} PRs older than 7 days:`);
      old.forEach((pr) => {
        console.log(`  #${pr.number}: ${pr.title}`);
        console.log(
          `    Created: ${new Date(pr.createdAt).toLocaleDateString()}`
        );
      });
      break;
    }

    default:
      console.log(
        'Usage: node scripts/pr-triage.js [list|duplicates|critical|old]'
      );
  }

  console.log('\nSuggested next steps:');
  console.log('1. Review and merge critical security fixes');
  console.log('2. Consolidate duplicate dependency PRs (close older ones)');
  console.log('3. Set up automated dependency updates to prevent backlog');
  console.log('4. Consider PR templates and review automation');
}

main();
