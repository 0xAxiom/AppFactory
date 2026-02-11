#!/usr/bin/env node
/**
 * Supabase Project Mapper
 * 
 * Maps all known Supabase projects to their purposes and connects them to AppFactory services.
 * 
 * Usage: node scripts/supabase-mapper.mjs [--update]
 */

// Known Supabase projects (from MEMORY.md)
const KNOWN_PROJECTS = [
  {
    name: 'devportal-prod-db',
    purpose: 'factoryapp.dev backend',
    status: 'mapped',
    service: 'factoryapp.dev'
  },
  {
    name: 'appfactory-prod', 
    purpose: 'appfactory.fun backend',
    status: 'mapped',
    service: 'appfactory.fun'
  },
  {
    name: 'factory-credits',
    purpose: 'Unknown - possibly credit/payment system',
    status: 'unmapped',
    service: 'unknown'
  },
  {
    name: 'launchbot',
    purpose: 'Unknown - possibly bot service',
    status: 'unmapped', 
    service: 'unknown'
  },
  {
    name: 'MeltedMindz\'s Project',
    purpose: 'Unknown - general/test project',
    status: 'unmapped',
    service: 'unknown'
  }
];

function displayProjectMap() {
  console.log('🗺️  AppFactory Supabase Project Map\n');
  console.log('='.repeat(60));
  
  const mapped = KNOWN_PROJECTS.filter(p => p.status === 'mapped');
  const unmapped = KNOWN_PROJECTS.filter(p => p.status === 'unmapped');
  
  console.log(`\n✅ MAPPED (${mapped.length})`);
  mapped.forEach(project => {
    console.log(`  ${project.name}`);
    console.log(`    └── ${project.service} (${project.purpose})\n`);
  });
  
  console.log(`❓ UNMAPPED (${unmapped.length})`);
  unmapped.forEach(project => {
    console.log(`  ${project.name}`);
    console.log(`    └── ${project.purpose}\n`);
  });
  
  console.log('='.repeat(60));
  console.log(`Total: ${KNOWN_PROJECTS.length} projects`);
  console.log(`Coverage: ${Math.round((mapped.length / KNOWN_PROJECTS.length) * 100)}%`);
  
  if (unmapped.length > 0) {
    console.log('\n💡 Next steps:');
    console.log('  1. Check Supabase dashboard for project descriptions');
    console.log('  2. Look for environment variables referencing unmapped projects');
    console.log('  3. Update this script when purposes are discovered');
  }
}

function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--help')) {
    console.log('Usage: node scripts/supabase-mapper.mjs [--update]');
    console.log('\nOptions:');
    console.log('  --update    Mark this as a documentation update');
    return;
  }
  
  displayProjectMap();
  
  if (args.includes('--update')) {
    console.log('\n📝 Project map updated! Consider adding this to documentation.');
  }
}

main();