# Contributing to App Factory Builder

This guide covers development setup, coding standards, and contribution workflows for the App Factory Builder system.

## Development Setup

### Prerequisites
- **Flutter SDK**: Latest stable channel
- **Dart SDK**: Included with Flutter
- **Python 3.8+**: For CLI and pipeline components
- **Claude CLI**: For testing integration
- **Git**: Version control

### Environment Setup

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd app-factory
   ./scripts/install.sh
   ```

2. **Flutter Setup**
   ```bash
   # Verify Flutter installation
   flutter doctor
   
   # Install required Flutter packages
   flutter pub global activate coverage
   flutter pub global activate pana
   ```

3. **Development Tools**
   ```bash
   # Python development dependencies
   pip install -r requirements-dev.txt
   
   # Pre-commit hooks
   pre-commit install
   ```

4. **Environment Variables**
   ```bash
   # Add to your shell profile (.bashrc, .zshrc, etc.)
   export APPFACTORY_DEV_MODE=true
   export APPFACTORY_DEBUG=true
   export FLUTTER_ROOT=/path/to/flutter
   ```

### IDE Configuration

**VS Code** (recommended)
```json
// .vscode/settings.json
{
  "dart.flutterSdkPath": "/path/to/flutter",
  "python.defaultInterpreterPath": "/usr/bin/python3",
  "files.associations": {
    "*.md.template": "markdown",
    "*.dart.template": "dart"
  },
  "editor.formatOnSave": true,
  "dart.enableSdkFormatter": true
}
```

**VS Code Extensions**
- Dart
- Flutter
- Python
- markdownlint
- Better Comments

## Running Tests

### Full Test Suite
```bash
# Run all tests
./scripts/test_cli.sh

# Run with coverage
./scripts/test_cli.sh --coverage
```

### Builder-Specific Tests
```bash
# Builder unit tests
python -m pytest builders/tests/ -v

# Template validation
./scripts/validate_templates.sh

# Generated app tests
./scripts/test_generated_apps.sh
```

### Integration Tests
```bash
# End-to-end pipeline test
APPFACTORY_TEST_MODE=1 ./bin/appfactory run test-project
./bin/appfactory build --run runs/*/test-project

# Validate generated app
cd runs/*/test-project/app
flutter analyze
flutter test
```

## Code Standards

### Python Code Standards

**Formatter**: Black
```bash
# Format code
black scripts/ builders/

# Check formatting
black --check scripts/ builders/
```

**Linting**: Flake8
```bash
# Lint code
flake8 scripts/ builders/
```

**Type Hints**: Required for all functions
```python
def parse_spec_file(file_path: str) -> Dict[str, Any]:
    """Parse specification file and return structured data."""
    pass
```

### Dart Code Standards

**Formatter**: dart format
```bash
# Format Dart code in templates
find builders/templates -name "*.dart.template" -exec dart format {} \;
```

**Linting**: Follow Flutter best practices
```yaml
# analysis_options.yaml for generated projects
include: package:flutter_lints/flutter.yaml

linter:
  rules:
    avoid_print: true
    prefer_const_constructors: true
    use_key_in_widget_constructors: true
```

### Shell Script Standards

**Formatter**: shfmt
```bash
# Format shell scripts
shfmt -w scripts/*.sh
```

**Linting**: shellcheck
```bash
# Lint shell scripts
shellcheck scripts/*.sh
```

### Documentation Standards

**Markdown**: Follow CommonMark spec
```bash
# Lint markdown
markdownlint README.md builders/
```

**Code Documentation**: Required for all public functions
```python
def generate_flutter_app(specs: SpecificationSet) -> BuildResult:
    """
    Generate Flutter app from specifications.
    
    Args:
        specs: Parsed and validated specification set
        
    Returns:
        BuildResult containing generated files and metadata
        
    Raises:
        BuildError: If generation fails
        ValidationError: If specs are invalid
    """
```

## Contribution Workflows

### Feature Development

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/builder-react-native
   ```

2. **Implement with Tests**
   ```bash
   # Write tests first (TDD approach)
   touch builders/tests/test_react_native_builder.py
   
   # Implement feature
   touch builders/implementations/react_native_builder.py
   
   # Run tests
   python -m pytest builders/tests/test_react_native_builder.py -v
   ```

3. **Update Documentation**
   ```bash
   # Update relevant docs
   vim builders/README.md
   vim builders/ARCHITECTURE.md
   ```

4. **Test Integration**
   ```bash
   # Full integration test
   ./scripts/test_cli.sh
   
   # Generated app validation
   ./scripts/test_generated_apps.sh --platform react_native
   ```

### Bug Fixes

1. **Reproduce Bug**
   ```bash
   # Create minimal test case
   touch builders/tests/test_bug_reproduction.py
   
   # Document expected vs actual behavior
   ```

2. **Fix with Test Coverage**
   ```bash
   # Implement fix
   vim builders/implementations/flutter_builder.py
   
   # Verify fix
   python -m pytest builders/tests/test_bug_reproduction.py -v
   ```

3. **Regression Testing**
   ```bash
   # Ensure no regressions
   ./scripts/test_cli.sh --full
   ```

### Adding New Templates

1. **Template Structure**
   ```bash
   # Create template files
   mkdir -p builders/templates/flutter/screens/new_screen/
   touch builders/templates/flutter/screens/new_screen/screen.dart.template
   ```

2. **Template Variables**
   ```dart
   // Use consistent template variable format
   class {{screen_name}}Screen extends StatelessWidget {
     const {{screen_name}}Screen({Key? key}) : super(key: key);
     
     @override
     Widget build(BuildContext context) {
       return Scaffold(
         appBar: AppBar(title: Text('{{screen_title}}')),
         body: {{screen_body}},
       );
     }
   }
   ```

3. **Template Tests**
   ```python
   def test_new_screen_template():
       """Test new screen template rendering."""
       context = {
           'screen_name': 'Settings',
           'screen_title': 'App Settings',
           'screen_body': 'SettingsBody()',
       }
       result = render_template('new_screen/screen.dart.template', context)
       assert 'class SettingsScreen' in result
       assert 'App Settings' in result
   ```

### Quality Gates

All contributions must pass:

1. **Automated Tests**
   ```bash
   # All tests must pass
   ./scripts/test_cli.sh
   ```

2. **Code Quality**
   ```bash
   # Formatting
   black --check .
   dart format --set-exit-if-changed builders/templates/
   
   # Linting
   flake8 .
   markdownlint .
   ```

3. **Generated App Quality**
   ```bash
   # Generated apps must compile and pass tests
   ./scripts/test_generated_apps.sh --strict
   ```

4. **Standards Compliance**
   ```bash
   # Validate against mobile app standards
   ./scripts/validate_standards_compliance.sh
   ```

### Performance Testing

1. **Generation Performance**
   ```bash
   # Measure builder performance
   ./scripts/benchmark_builder.sh
   ```

2. **Generated App Performance**
   ```bash
   # Test generated app startup time
   ./scripts/test_app_performance.sh
   ```

## Debugging

### Builder Issues

```bash
# Enable debug logging
export APPFACTORY_DEBUG=true
export APPFACTORY_BUILDER_DEBUG=true

# Run with verbose output
./bin/appfactory build --verbose --dry-run

# Check builder logs
tail -f ~/.cache/appfactory/builder.log
```

### Template Issues

```bash
# Validate template syntax
./scripts/validate_templates.sh builders/templates/flutter/

# Test template rendering
python -c "
from builders.core.template_engine import TemplateEngine
engine = TemplateEngine()
result = engine.render_file('path/to/template.dart.template', {'key': 'value'})
print(result)
"
```

### Generated App Issues

```bash
# Analyze generated code
cd runs/*/project/app
flutter analyze

# Run generated tests
flutter test

# Check specific issues
flutter doctor
flutter clean && flutter pub get
```

## Review Process

### Pre-Review Checklist

- [ ] Tests pass locally
- [ ] Code follows style guidelines
- [ ] Documentation updated
- [ ] Generated apps compile and run
- [ ] Standards compliance verified
- [ ] Performance impact assessed

### Code Review Guidelines

**For Reviewers:**
- Focus on correctness and maintainability
- Verify generated apps meet quality standards
- Check template variable consistency
- Validate error handling and edge cases
- Ensure backwards compatibility

**For Authors:**
- Provide context for complex changes
- Include test output in PR description
- Document any breaking changes
- Show before/after generated code examples

### Merge Requirements

1. **Approval**: Minimum 2 approvals from maintainers
2. **CI**: All automated checks pass
3. **Documentation**: Updated for user-facing changes
4. **Testing**: Comprehensive test coverage
5. **Standards**: Generated apps meet compliance requirements

## Common Development Tasks

### Adding Support for New Specification Fields

1. **Update Spec Parser**
   ```python
   # builders/core/parsers/product_spec_parser.py
   def parse_product_spec(content: str) -> ProductSpec:
       # Add new field parsing
       pass
   ```

2. **Update Templates**
   ```dart
   // builders/templates/flutter/services/service.dart.template
   // Use new specification field
   {{#if new_field}}
   // Implementation using new field
   {{/if}}
   ```

3. **Update Tests**
   ```python
   def test_new_field_parsing():
       spec_content = """
       ## New Field
       Field value here
       """
       result = parse_product_spec(spec_content)
       assert result.new_field == "Field value here"
   ```

### Improving Generated Code Quality

1. **Analyze Generated Apps**
   ```bash
   # Find common patterns that need improvement
   ./scripts/analyze_generated_code.sh
   ```

2. **Update Templates**
   ```dart
   // Improve template implementation
   // Add better error handling, performance optimizations
   ```

3. **Add Quality Checks**
   ```python
   # builders/quality/analyzers/dart_analyzer.py
   def analyze_dart_code(file_content: str) -> List[QualityIssue]:
       # Add new quality checks
       pass
   ```

### Debugging CI Failures

```bash
# Reproduce CI environment locally
docker run -it ubuntu:20.04
apt-get update && apt-get install -y python3 python3-pip git
git clone <repo>
# Run same commands as CI
```

## Release Process

### Version Updates
```bash
# Update version in setup.py and package files
vim setup.py
vim builders/__init__.py

# Update CHANGELOG
vim CHANGELOG.md

# Tag release
git tag -a v1.2.0 -m "Release v1.2.0"
git push origin v1.2.0
```

### Documentation Updates
```bash
# Ensure all docs reflect new features
vim README.md
vim builders/README.md
vim builders/ARCHITECTURE.md

# Update examples
./scripts/update_examples.sh
```

---

**Questions or Issues?** Open an issue in the repository or contact the maintainers.

**Want to Contribute?** We welcome contributions! Please read this guide and feel free to ask questions.