#!/usr/bin/env node
/**
 * Build Validation and Health Check Script for App Factory
 * 
 * Provides comprehensive validation and health checking for built Expo apps:
 * - Package.json validation
 * - Dependency verification
 * - Configuration validation
 * - File structure verification
 * - Security checks
 * - Performance recommendations
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Validation severity levels
const SEVERITY = {
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
};

// Required dependencies for Expo apps
const REQUIRED_DEPENDENCIES = [
  'expo',
  'react',
  'react-native'
];

// Recommended dependencies for App Factory apps
const RECOMMENDED_DEPENDENCIES = [
  'react-native-revenuecat',
  '@react-navigation/native',
  'expo-router',
  'expo-linking',
  'expo-constants'
];

// Security-sensitive file patterns
const SECURITY_PATTERNS = [
  /\.env$/,
  /\.env\./,
  /key/i,
  /secret/i,
  /token/i,
  /password/i,
  /credential/i
];

/**
 * Main validation function
 */
async function validateBuild(buildPath) {
  const validation = {
    isValid: true,
    errors: [],
    warnings: [],
    info: [],
    metrics: {},
    recommendations: []
  };

  console.log(`🔍 Validating build at: ${buildPath}\n`);

  try {
    // Core structure validation
    await validateStructure(buildPath, validation);
    
    // Package.json validation
    await validatePackageJson(buildPath, validation);
    
    // Configuration validation
    await validateConfiguration(buildPath, validation);
    
    // Dependencies validation
    await validateDependencies(buildPath, validation);
    
    // Security validation
    await validateSecurity(buildPath, validation);
    
    // Performance validation
    await validatePerformance(buildPath, validation);
    
    // Expo-specific validation
    await validateExpoSetup(buildPath, validation);
    
    // Calculate overall validity
    validation.isValid = validation.errors.length === 0;
    
  } catch (error) {
    validation.errors.push(`Validation failed: ${error.message}`);
    validation.isValid = false;
  }

  return validation;
}

/**
 * Validate basic file structure
 */
async function validateStructure(buildPath, validation) {
  const requiredFiles = [
    'package.json',
    'app.json',
    'App.js'
  ];

  const requiredDirs = [
    'src'
  ];

  // Check required files
  for (const file of requiredFiles) {
    const filePath = path.join(buildPath, file);
    if (!fs.existsSync(filePath)) {
      validation.errors.push(`Missing required file: ${file}`);
    }
  }

  // Check required directories
  for (const dir of requiredDirs) {
    const dirPath = path.join(buildPath, dir);
    if (!fs.existsSync(dirPath)) {
      validation.warnings.push(`Missing recommended directory: ${dir}`);
    }
  }

  // Check for common anti-patterns
  const problematicPaths = [
    'node_modules/.bin',
    '.expo',
    'ios',
    'android'
  ];

  for (const problematicPath of problematicPaths) {
    const fullPath = path.join(buildPath, problematicPath);
    if (fs.existsSync(fullPath)) {
      if (problematicPath === 'ios' || problematicPath === 'android') {
        validation.warnings.push(`Found ${problematicPath} directory - ensure this is needed for Expo managed workflow`);
      }
    }
  }

  validation.info.push('File structure validation completed');
}

/**
 * Validate package.json
 */
async function validatePackageJson(buildPath, validation) {
  const packagePath = path.join(buildPath, 'package.json');
  
  if (!fs.existsSync(packagePath)) {
    validation.errors.push('package.json not found');
    return;
  }

  try {
    const packageContent = fs.readFileSync(packagePath, 'utf8');
    const packageJson = JSON.parse(packageContent);

    // Validate basic fields
    if (!packageJson.name) {
      validation.errors.push('package.json missing "name" field');
    }

    if (!packageJson.version) {
      validation.warnings.push('package.json missing "version" field');
    }

    if (!packageJson.scripts) {
      validation.errors.push('package.json missing "scripts" field');
    } else {
      // Validate required scripts
      const requiredScripts = ['start'];
      for (const script of requiredScripts) {
        if (!packageJson.scripts[script]) {
          validation.errors.push(`package.json missing "${script}" script`);
        }
      }
    }

    // Validate dependencies
    if (!packageJson.dependencies) {
      validation.errors.push('package.json missing "dependencies" field');
    }

    // Check for deprecated packages
    const deprecatedPackages = [
      'react-native-vector-icons',
      'react-native-gesture-handler-v1'
    ];

    const allDeps = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies
    };

    for (const [depName, depVersion] of Object.entries(allDeps)) {
      if (deprecatedPackages.includes(depName)) {
        validation.warnings.push(`Deprecated package found: ${depName}`);
      }
      
      // Check for wildcard versions
      if (typeof depVersion === 'string' && (depVersion.includes('*') || depVersion.includes('latest'))) {
        validation.warnings.push(`Wildcard version found for ${depName}: ${depVersion}`);
      }
    }

    validation.info.push('package.json validation completed');

  } catch (error) {
    validation.errors.push(`Invalid package.json: ${error.message}`);
  }
}

/**
 * Validate Expo configuration
 */
async function validateConfiguration(buildPath, validation) {
  const appJsonPath = path.join(buildPath, 'app.json');
  const appConfigJsPath = path.join(buildPath, 'app.config.js');
  const appConfigTsPath = path.join(buildPath, 'app.config.ts');

  let configFound = false;
  let expoConfig = null;

  // Try app.json first
  if (fs.existsSync(appJsonPath)) {
    try {
      const appJsonContent = fs.readFileSync(appJsonPath, 'utf8');
      const appJson = JSON.parse(appJsonContent);
      
      if (appJson.expo) {
        expoConfig = appJson.expo;
        configFound = true;
      }
    } catch (error) {
      validation.errors.push(`Invalid app.json: ${error.message}`);
      return;
    }
  }

  // Check for dynamic config files
  if (!configFound) {
    if (fs.existsSync(appConfigJsPath) || fs.existsSync(appConfigTsPath)) {
      validation.info.push('Dynamic Expo config detected (app.config.js/ts)');
      configFound = true;
    }
  }

  if (!configFound) {
    validation.errors.push('No Expo configuration found (app.json or app.config.js)');
    return;
  }

  // Validate Expo config if we have it
  if (expoConfig) {
    // Required fields
    if (!expoConfig.name) {
      validation.errors.push('Expo config missing "name" field');
    }

    if (!expoConfig.slug) {
      validation.errors.push('Expo config missing "slug" field');
    }

    if (!expoConfig.version) {
      validation.warnings.push('Expo config missing "version" field');
    }

    // Platform validation
    if (!expoConfig.platforms) {
      validation.warnings.push('Expo config missing "platforms" field');
    } else {
      const expectedPlatforms = ['ios', 'android'];
      for (const platform of expectedPlatforms) {
        if (!expoConfig.platforms.includes(platform)) {
          validation.warnings.push(`Expo config missing "${platform}" platform`);
        }
      }
    }

    // iOS configuration
    if (expoConfig.ios) {
      if (!expoConfig.ios.bundleIdentifier) {
        validation.warnings.push('iOS config missing "bundleIdentifier"');
      }

      if (!expoConfig.ios.deploymentTarget) {
        validation.info.push('iOS config missing "deploymentTarget" - will use Expo default');
      }
    }

    // Android configuration
    if (expoConfig.android) {
      if (!expoConfig.android.package) {
        validation.warnings.push('Android config missing "package" field');
      }

      if (!expoConfig.android.versionCode) {
        validation.warnings.push('Android config missing "versionCode"');
      }
    }

    // RevenueCat integration check
    const hasRevenuecat = expoConfig.plugins?.some(plugin => 
      typeof plugin === 'string' ? plugin.includes('revenuecat') : 
      (plugin && plugin[0] && plugin[0].includes('revenuecat'))
    );

    if (!hasRevenuecat) {
      validation.recommendations.push('Consider adding RevenueCat plugin for subscription management');
    }
  }

  validation.info.push('Configuration validation completed');
}

/**
 * Validate dependencies
 */
async function validateDependencies(buildPath, validation) {
  const packagePath = path.join(buildPath, 'package.json');
  
  if (!fs.existsSync(packagePath)) {
    return; // Already handled in package.json validation
  }

  try {
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    const dependencies = packageJson.dependencies || {};

    // Check required dependencies
    for (const requiredDep of REQUIRED_DEPENDENCIES) {
      if (!dependencies[requiredDep]) {
        validation.errors.push(`Missing required dependency: ${requiredDep}`);
      }
    }

    // Check recommended dependencies
    let missingRecommended = 0;
    for (const recommendedDep of RECOMMENDED_DEPENDENCIES) {
      if (!dependencies[recommendedDep]) {
        missingRecommended++;
        validation.info.push(`Missing recommended dependency: ${recommendedDep}`);
      }
    }

    if (missingRecommended > 0) {
      validation.recommendations.push(`Consider adding ${missingRecommended} recommended dependencies for better functionality`);
    }

    // Check node_modules
    const nodeModulesPath = path.join(buildPath, 'node_modules');
    if (!fs.existsSync(nodeModulesPath)) {
      validation.warnings.push('node_modules directory not found - run "npm install"');
    } else {
      // Quick dependency count
      try {
        const nodeModulesEntries = fs.readdirSync(nodeModulesPath);
        const depCount = nodeModulesEntries.filter(entry => !entry.startsWith('.')).length;
        validation.metrics.installedDependencies = depCount;
        validation.info.push(`Found ${depCount} installed dependencies`);
      } catch (error) {
        validation.warnings.push(`Could not read node_modules: ${error.message}`);
      }
    }

    validation.info.push('Dependencies validation completed');

  } catch (error) {
    validation.errors.push(`Dependency validation failed: ${error.message}`);
  }
}

/**
 * Validate security aspects
 */
async function validateSecurity(buildPath, validation) {
  const issues = [];

  // Check for sensitive files
  const files = getAllFiles(buildPath);
  
  for (const file of files) {
    const fileName = path.basename(file);
    
    // Check for sensitive file patterns
    for (const pattern of SECURITY_PATTERNS) {
      if (pattern.test(fileName)) {
        issues.push(`Potentially sensitive file found: ${file}`);
      }
    }

    // Check file contents for sensitive data
    if (file.endsWith('.js') || file.endsWith('.ts') || file.endsWith('.json')) {
      try {
        const content = fs.readFileSync(file, 'utf8');
        
        // Check for hardcoded secrets
        const sensitivePatterns = [
          /api[_-]?key\s*[=:]\s*['"][^'"]+['"]/i,
          /secret[_-]?key\s*[=:]\s*['"][^'"]+['"]/i,
          /password\s*[=:]\s*['"][^'"]+['"]/i,
          /token\s*[=:]\s*['"][^'"]+['"]/i
        ];

        for (const pattern of sensitivePatterns) {
          if (pattern.test(content)) {
            validation.errors.push(`Potential hardcoded secret in ${file}`);
            break;
          }
        }
      } catch (error) {
        // Skip files we can't read
      }
    }
  }

  // Check package.json for security vulnerabilities (if npm audit is available)
  try {
    const packagePath = path.join(buildPath, 'package.json');
    if (fs.existsSync(packagePath) && fs.existsSync(path.join(buildPath, 'node_modules'))) {
      try {
        execSync('npm audit --audit-level high --json', { 
          cwd: buildPath, 
          stdio: 'pipe',
          timeout: 30000 
        });
        validation.info.push('No high-severity security vulnerabilities found');
      } catch (error) {
        validation.warnings.push('Security audit found issues - run "npm audit" for details');
      }
    }
  } catch (error) {
    validation.info.push('npm audit not available - consider running security checks manually');
  }

  validation.info.push('Security validation completed');
}

/**
 * Validate performance aspects
 */
async function validatePerformance(buildPath, validation) {
  // Check bundle size indicators
  const packagePath = path.join(buildPath, 'package.json');
  if (fs.existsSync(packagePath)) {
    try {
      const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
      const depCount = Object.keys(packageJson.dependencies || {}).length;
      
      validation.metrics.dependencyCount = depCount;
      
      if (depCount > 50) {
        validation.warnings.push(`High dependency count (${depCount}) may affect bundle size`);
      } else if (depCount < 10) {
        validation.info.push(`Low dependency count (${depCount}) - good for performance`);
      }
    } catch (error) {
      validation.warnings.push(`Could not analyze dependency count: ${error.message}`);
    }
  }

  // Check for performance anti-patterns in source files
  const srcPath = path.join(buildPath, 'src');
  if (fs.existsSync(srcPath)) {
    const sourceFiles = getAllFiles(srcPath).filter(file => 
      file.endsWith('.js') || file.endsWith('.ts') || file.endsWith('.tsx')
    );

    let performanceIssues = 0;

    for (const file of sourceFiles) {
      try {
        const content = fs.readFileSync(file, 'utf8');
        
        // Check for performance anti-patterns
        const antiPatterns = [
          { pattern: /console\.log/g, message: 'console.log statements found' },
          { pattern: /debugger/g, message: 'debugger statements found' },
          { pattern: /\.bind\(/g, message: 'Function binding in render (potential performance issue)' }
        ];

        for (const antiPattern of antiPatterns) {
          const matches = content.match(antiPattern.pattern);
          if (matches && matches.length > 5) {
            performanceIssues++;
            validation.warnings.push(`${antiPattern.message} in ${path.relative(buildPath, file)}`);
          }
        }
      } catch (error) {
        // Skip files we can't read
      }
    }

    validation.metrics.sourceFileCount = sourceFiles.length;
    validation.info.push(`Analyzed ${sourceFiles.length} source files`);
  }

  validation.info.push('Performance validation completed');
}

/**
 * Validate Expo-specific setup
 */
async function validateExpoSetup(buildPath, validation) {
  const packagePath = path.join(buildPath, 'package.json');
  
  if (!fs.existsSync(packagePath)) {
    return; // Already handled elsewhere
  }

  try {
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };

    // Check Expo SDK version
    const expoVersion = dependencies.expo;
    if (expoVersion) {
      // Extract version number
      const versionMatch = expoVersion.match(/(\d+)\./);
      if (versionMatch) {
        const majorVersion = parseInt(versionMatch[1], 10);
        validation.metrics.expoSdkVersion = majorVersion;
        
        if (majorVersion < 49) {
          validation.warnings.push(`Expo SDK ${majorVersion} is outdated - consider upgrading`);
        } else {
          validation.info.push(`Using Expo SDK ${majorVersion}`);
        }
      }
    }

    // Check for Expo Router setup
    const hasExpoRouter = dependencies['expo-router'];
    if (hasExpoRouter) {
      validation.info.push('Expo Router detected for navigation');
      
      // Check for app directory structure
      const appDirPath = path.join(buildPath, 'app');
      if (!fs.existsSync(appDirPath)) {
        validation.warnings.push('Expo Router detected but no app/ directory found');
      }
    }

    // Check for conflicting navigation libraries
    const navigationLibs = ['@react-navigation/native', 'expo-router'];
    const foundNavLibs = navigationLibs.filter(lib => dependencies[lib]);
    
    if (foundNavLibs.length > 1) {
      validation.warnings.push(`Multiple navigation libraries detected: ${foundNavLibs.join(', ')}`);
    }

    // Check for Expo CLI in project
    if (dependencies['@expo/cli']) {
      validation.info.push('Local Expo CLI detected');
    } else {
      validation.recommendations.push('Consider adding @expo/cli as a dev dependency for consistent builds');
    }

    validation.info.push('Expo-specific validation completed');

  } catch (error) {
    validation.errors.push(`Expo validation failed: ${error.message}`);
  }
}

/**
 * Get all files recursively from a directory
 */
function getAllFiles(dirPath) {
  const files = [];
  
  if (!fs.existsSync(dirPath)) {
    return files;
  }

  function traverse(currentPath) {
    try {
      const entries = fs.readdirSync(currentPath);
      
      for (const entry of entries) {
        // Skip common directories we don't need to scan
        if (['node_modules', '.git', '.expo', 'ios', 'android'].includes(entry)) {
          continue;
        }

        const fullPath = path.join(currentPath, entry);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          traverse(fullPath);
        } else {
          files.push(fullPath);
        }
      }
    } catch (error) {
      // Skip directories we can't read
    }
  }

  traverse(dirPath);
  return files;
}

/**
 * Format validation results for display
 */
function formatResults(validation) {
  console.log('\n' + '='.repeat(60));
  console.log('📋 BUILD VALIDATION RESULTS');
  console.log('='.repeat(60));

  // Overall status
  if (validation.isValid) {
    console.log('✅ BUILD VALID - Ready for preview/deployment');
  } else {
    console.log('❌ BUILD INVALID - Issues must be resolved');
  }

  // Metrics
  if (Object.keys(validation.metrics).length > 0) {
    console.log('\n📊 Metrics:');
    for (const [key, value] of Object.entries(validation.metrics)) {
      console.log(`   ${key}: ${value}`);
    }
  }

  // Errors
  if (validation.errors.length > 0) {
    console.log('\n❌ Errors (must fix):');
    validation.errors.forEach(error => console.log(`   • ${error}`));
  }

  // Warnings
  if (validation.warnings.length > 0) {
    console.log('\n⚠️  Warnings (should fix):');
    validation.warnings.forEach(warning => console.log(`   • ${warning}`));
  }

  // Recommendations
  if (validation.recommendations.length > 0) {
    console.log('\n💡 Recommendations:');
    validation.recommendations.forEach(rec => console.log(`   • ${rec}`));
  }

  // Info
  if (validation.info.length > 0) {
    console.log('\n📝 Info:');
    validation.info.forEach(info => console.log(`   • ${info}`));
  }

  console.log('\n' + '='.repeat(60));
  
  return validation.isValid;
}

/**
 * CLI interface
 */
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    console.log(`
🔍 App Factory Build Validator

Usage: node validate_build.js <BUILD_PATH> [options]

Arguments:
  BUILD_PATH    Path to the build directory (required)

Options:
  --json        Output results in JSON format
  --quiet       Only show errors and warnings
  --help, -h    Show this help message

Examples:
  node validate_build.js builds/01_myapp__myapp_001
  node validate_build.js builds/06_habitapp/abc123def456/app --json
  node validate_build.js ../builds/myapp --quiet

Validation Categories:
  • File Structure    - Required files and directories
  • Package.json      - Dependencies and scripts
  • Configuration     - Expo and app configuration
  • Security          - Sensitive files and hardcoded secrets
  • Performance      - Bundle size and code patterns
  • Expo Integration  - SDK version and setup

Exit Codes:
  0  - Build is valid
  1  - Build has errors
  2  - Validation failed
`);
    process.exit(0);
  }

  const buildPath = args[0];
  const outputJson = args.includes('--json');
  const quiet = args.includes('--quiet');

  if (!buildPath) {
    console.error('❌ Build path is required');
    process.exit(2);
  }

  if (!fs.existsSync(buildPath)) {
    console.error(`❌ Build path does not exist: ${buildPath}`);
    process.exit(2);
  }

  try {
    const validation = await validateBuild(buildPath);
    
    if (outputJson) {
      console.log(JSON.stringify(validation, null, 2));
    } else {
      if (!quiet) {
        formatResults(validation);
      } else {
        // Quiet mode - only errors and warnings
        if (validation.errors.length > 0) {
          console.log('❌ Errors:');
          validation.errors.forEach(error => console.log(`   • ${error}`));
        }
        if (validation.warnings.length > 0) {
          console.log('⚠️  Warnings:');
          validation.warnings.forEach(warning => console.log(`   • ${warning}`));
        }
        if (validation.errors.length === 0 && validation.warnings.length === 0) {
          console.log('✅ No errors or warnings found');
        }
      }
    }

    // Exit with appropriate code
    process.exit(validation.isValid ? 0 : 1);

  } catch (error) {
    console.error(`❌ Validation failed: ${error.message}`);
    process.exit(2);
  }
}

// Run CLI if this script is executed directly
if (require.main === module) {
  main();
}

module.exports = { validateBuild, formatResults };