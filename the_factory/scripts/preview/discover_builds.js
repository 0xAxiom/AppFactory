#!/usr/bin/env node
/**
 * Build Discovery Script for App Factory Preview
 * 
 * Scans builds/ directory for valid Expo apps and returns structured metadata.
 * Implements Expo best practices for build validation.
 */

const fs = require('fs');
const path = require('path');

// Determine the correct builds directory relative to script location
const SCRIPT_DIR = __dirname;
const FACTORY_ROOT = path.resolve(SCRIPT_DIR, '../..');
const BUILDS_DIR = path.join(FACTORY_ROOT, 'builds');

/**
 * Check if a directory contains a valid Expo app
 */
function validateExpoBuild(buildPath) {
  const validation = {
    isValid: false,
    errors: [],
    warnings: [],
    config: null,
    packageJson: null,
    entryPoint: null
  };

  try {
    // Check for package.json
    const packageJsonPath = path.join(buildPath, 'package.json');
    if (!fs.existsSync(packageJsonPath)) {
      validation.errors.push('Missing package.json');
      return validation;
    }

    let packageJson;
    try {
      packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      validation.packageJson = packageJson;
    } catch (error) {
      validation.errors.push(`Invalid package.json: ${error.message}`);
      return validation;
    }

    // Check for Expo dependency
    const hasExpo = packageJson.dependencies?.expo || packageJson.devDependencies?.expo;
    if (!hasExpo) {
      validation.errors.push('Expo not found in dependencies');
      return validation;
    }

    // Check for Expo configuration
    let expoConfig = null;
    
    // Check app.json
    const appJsonPath = path.join(buildPath, 'app.json');
    if (fs.existsSync(appJsonPath)) {
      try {
        const appJson = JSON.parse(fs.readFileSync(appJsonPath, 'utf8'));
        if (appJson.expo) {
          expoConfig = appJson.expo;
        }
      } catch (error) {
        validation.warnings.push(`Invalid app.json: ${error.message}`);
      }
    }

    // Check app.config.js/ts
    const configJsPath = path.join(buildPath, 'app.config.js');
    const configTsPath = path.join(buildPath, 'app.config.ts');
    if (fs.existsSync(configJsPath) || fs.existsSync(configTsPath)) {
      validation.warnings.push('Dynamic config detected - may require build-time evaluation');
    }

    // Check package.json expo config
    if (!expoConfig && packageJson.expo) {
      expoConfig = packageJson.expo;
    }

    if (!expoConfig) {
      validation.errors.push('No Expo configuration found');
      return validation;
    }

    validation.config = expoConfig;

    // Validate entry point
    const mainEntry = packageJson.main;
    if (!mainEntry) {
      validation.warnings.push('No main entry point specified');
    } else {
      // Check common entry patterns
      const entryPatterns = [
        mainEntry,
        'App.js',
        'App.tsx', 
        'index.js',
        'index.tsx',
        'expo-router/entry'
      ];

      let foundEntry = null;
      for (const pattern of entryPatterns) {
        const fullPath = path.join(buildPath, pattern);
        if (pattern === 'expo-router/entry' || fs.existsSync(fullPath)) {
          foundEntry = pattern;
          break;
        }
      }

      validation.entryPoint = foundEntry;
      
      if (!foundEntry && mainEntry !== 'expo-router/entry') {
        validation.warnings.push(`Entry point not found: ${mainEntry}`);
      }
    }

    // Check for required scripts
    const scripts = packageJson.scripts || {};
    if (!scripts.start) {
      validation.errors.push('Missing "start" script');
    } else if (!scripts.start.includes('expo start')) {
      validation.warnings.push('Start script does not use "expo start"');
    }

    // Validation passed if no errors
    validation.isValid = validation.errors.length === 0;
    
  } catch (error) {
    validation.errors.push(`Validation failed: ${error.message}`);
  }

  return validation;
}

/**
 * Extract build metadata
 */
function extractBuildMetadata(buildPath, dirName) {
  const metadata = {
    id: dirName,
    path: path.relative(FACTORY_ROOT, buildPath),
    absolutePath: buildPath,
    name: null,
    description: null,
    version: null,
    lastModified: null,
    size: null,
    hasSubBuilds: false,
    subBuilds: []
  };

  try {
    const stats = fs.statSync(buildPath);
    metadata.lastModified = stats.mtime.toISOString();
    
    // Check if this is a build with sub-builds (like the hash-based structure)
    const entries = fs.readdirSync(buildPath);
    const subBuildDirs = entries.filter(entry => {
      const entryPath = path.join(buildPath, entry);
      const entryStat = fs.statSync(entryPath);
      return entryStat.isDirectory() && /^[a-f0-9]{16}$/.test(entry); // Hash pattern
    });

    if (subBuildDirs.length > 0) {
      metadata.hasSubBuilds = true;
      metadata.subBuilds = subBuildDirs.map(subDir => {
        const subPath = path.join(buildPath, subDir, 'app'); // Check for app subdirectory
        return {
          id: subDir,
          path: path.relative(FACTORY_ROOT, fs.existsSync(subPath) ? subPath : path.join(buildPath, subDir)),
          absolutePath: fs.existsSync(subPath) ? subPath : path.join(buildPath, subDir)
        };
      });
    }

    // Try to extract name and description from package.json
    const packageJsonPath = path.join(buildPath, 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      try {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        metadata.name = packageJson.name;
        metadata.description = packageJson.description;
        metadata.version = packageJson.version;
      } catch (error) {
        // Ignore package.json parsing errors for metadata
      }
    }

    // Calculate directory size (shallow)
    try {
      let totalSize = 0;
      const items = fs.readdirSync(buildPath);
      for (const item of items) {
        const itemPath = path.join(buildPath, item);
        const itemStats = fs.statSync(itemPath);
        if (itemStats.isFile()) {
          totalSize += itemStats.size;
        }
      }
      metadata.size = totalSize;
    } catch (error) {
      // Ignore size calculation errors
    }

  } catch (error) {
    // Ignore metadata extraction errors
  }

  return metadata;
}

/**
 * Discover all valid builds
 */
function discoverBuilds() {
  const results = {
    buildsDirectory: BUILDS_DIR,
    totalBuilds: 0,
    validBuilds: 0,
    builds: [],
    errors: []
  };

  try {
    if (!fs.existsSync(BUILDS_DIR)) {
      results.errors.push(`Builds directory not found: ${BUILDS_DIR}`);
      return results;
    }

    const entries = fs.readdirSync(BUILDS_DIR);
    const buildDirs = entries.filter(entry => {
      const entryPath = path.join(BUILDS_DIR, entry);
      try {
        return fs.statSync(entryPath).isDirectory();
      } catch {
        return false;
      }
    });

    results.totalBuilds = buildDirs.length;

    for (const dirName of buildDirs) {
      const buildPath = path.join(BUILDS_DIR, dirName);
      const metadata = extractBuildMetadata(buildPath, dirName);
      
      // For builds with sub-builds, validate each sub-build
      if (metadata.hasSubBuilds) {
        for (const subBuild of metadata.subBuilds) {
          const validation = validateExpoBuild(subBuild.absolutePath);
          const buildInfo = {
            ...metadata,
            id: `${metadata.id}/${subBuild.id}`,
            path: subBuild.path,
            absolutePath: subBuild.absolutePath,
            validation,
            isSubBuild: true,
            parentId: metadata.id,
            subBuildId: subBuild.id
          };
          
          results.builds.push(buildInfo);
          if (validation.isValid) {
            results.validBuilds++;
          }
        }
      } else {
        // Single build directory
        const validation = validateExpoBuild(buildPath);
        const buildInfo = {
          ...metadata,
          validation,
          isSubBuild: false
        };
        
        results.builds.push(buildInfo);
        if (validation.isValid) {
          results.validBuilds++;
        }
      }
    }

    // Sort builds by last modified (newest first)
    results.builds.sort((a, b) => {
      const aTime = new Date(a.lastModified || 0);
      const bTime = new Date(b.lastModified || 0);
      return bTime.getTime() - aTime.getTime();
    });

  } catch (error) {
    results.errors.push(`Discovery failed: ${error.message}`);
  }

  return results;
}

// CLI usage
if (require.main === module) {
  const args = process.argv.slice(2);
  const outputFormat = args.includes('--json') ? 'json' : 'readable';
  const showInvalid = args.includes('--show-invalid');

  const results = discoverBuilds();

  if (outputFormat === 'json') {
    console.log(JSON.stringify(results, null, 2));
  } else {
    console.log(`\n🏗️  App Factory Build Discovery\n`);
    console.log(`Builds Directory: ${results.buildsDirectory}`);
    console.log(`Total Builds: ${results.totalBuilds}`);
    console.log(`Valid Builds: ${results.validBuilds}\n`);

    if (results.errors.length > 0) {
      console.log(`❌ Errors:`);
      results.errors.forEach(error => console.log(`   ${error}`));
      console.log();
    }

    if (results.builds.length === 0) {
      console.log(`No builds found. Run 'build <IDEA_NAME>' to create a build first.`);
      return;
    }

    console.log(`📱 Available Builds:\n`);
    
    results.builds.forEach((build, index) => {
      const isValid = build.validation.isValid;
      const icon = isValid ? '✅' : '❌';
      const prefix = build.isSubBuild ? '  └─' : '';
      
      if (isValid || showInvalid) {
        console.log(`${icon} ${prefix}${build.id}`);
        if (build.name && build.name !== build.id) {
          console.log(`   Name: ${build.name}`);
        }
        if (build.description) {
          console.log(`   Description: ${build.description}`);
        }
        console.log(`   Path: ${build.path}`);
        
        if (!isValid) {
          console.log(`   Errors:`);
          build.validation.errors.forEach(error => console.log(`     • ${error}`));
        }
        
        if (build.validation.warnings.length > 0) {
          console.log(`   Warnings:`);
          build.validation.warnings.forEach(warning => console.log(`     • ${warning}`));
        }
        
        console.log();
      }
    });

    if (!showInvalid && results.builds.some(b => !b.validation.isValid)) {
      console.log(`Use --show-invalid to see builds with validation errors.`);
    }
  }
}

module.exports = { discoverBuilds, validateExpoBuild, extractBuildMetadata };