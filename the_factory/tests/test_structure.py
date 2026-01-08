#!/usr/bin/env python3
"""
Test App Factory repository structure and requirements.
"""

import os
import sys
import json
from pathlib import Path

# Add parent directory to path to import appfactory modules
sys.path.insert(0, str(Path(__file__).parent.parent))

def test_claude_md_exists():
    """Test that CLAUDE.md exists and has required headings."""
    claude_md_path = Path(__file__).parent.parent / "CLAUDE.md"
    assert claude_md_path.exists(), "CLAUDE.md not found"
    
    with open(claude_md_path, 'r') as f:
        content = f.read()
    
    required_headings = [
        "## ARCHITECTURE: CLAUDE IS THE BUILDER (AGENT-NATIVE)",
        "## COMMAND INTERFACE", 
        "## RUN DIRECTORY CONTRACT",
        "## DEFINITION OF DONE"
    ]
    
    for heading in required_headings:
        assert heading in content, f"Missing required heading: {heading}"
    
    print("✓ CLAUDE.md has required structure")

def test_readme_quickstart():
    """Test that README.md contains agent-native quickstart."""
    readme_path = Path(__file__).parent.parent / "README.md"
    assert readme_path.exists(), "README.md not found"
    
    with open(readme_path, 'r') as f:
        content = f.read()
    
    assert "run app factory" in content, "README missing 'run app factory' quickstart"
    assert "Quickstart" in content, "README missing Quickstart section"
    
    print("✓ README.md has agent-native quickstart")

def test_agent_templates_exist():
    """Test that agent templates exist for stages 01 and 10."""
    templates_dir = Path(__file__).parent.parent / "templates" / "agents"
    
    stage01_template = templates_dir / "01_market_research.md"
    stage10_template = templates_dir / "10_app_builder.md"
    
    assert stage01_template.exists(), "Stage 01 template not found"
    assert stage10_template.exists(), "Stage 10 template not found"
    
    # Check that templates don't contain forbidden patterns
    with open(stage01_template, 'r') as f:
        stage01_content = f.read()
    
    forbidden_patterns = [
        "respond with ONLY JSON",
        "Output raw JSON"
    ]
    
    for pattern in forbidden_patterns:
        assert pattern.lower() not in stage01_content.lower(), f"Stage 01 template contains forbidden pattern: {pattern}"
    
    # Check that templates contain required patterns
    assert "AGENT-NATIVE EXECUTION" in stage01_content, "Stage 01 template missing AGENT-NATIVE EXECUTION"
    assert "Write:" in stage01_content, "Stage 01 template missing file write instructions"
    
    print("✓ Agent templates exist and are agent-native compatible")

def test_appfactory_utilities():
    """Test that appfactory utilities exist and are importable."""
    try:
        import appfactory.schema_validate
        import appfactory.render_markdown
        import appfactory.paths
        import appfactory.logging_utils
        print("✓ All appfactory utilities importable")
    except ImportError as e:
        assert False, f"Failed to import appfactory utilities: {e}"

def test_schema_validate_cli():
    """Test that schema validation CLI works."""
    # Use existing fixtures
    fixtures_dir = Path(__file__).parent / "fixtures"
    stage01_sample = fixtures_dir / "stage01_sample.json"
    
    # Use existing schema
    schema_path = Path(__file__).parent.parent / "schemas" / "stage01.json"
    
    if not stage01_sample.exists() or not schema_path.exists():
        print("⚠ Schema validation test skipped - missing fixtures")
        return
    
    # Test that files can be loaded
    import appfactory.schema_validate
    from appfactory.schema_validate import load_json
    
    try:
        schema = load_json(str(schema_path))
        data = load_json(str(stage01_sample))
        print("✓ Schema validation utility works (file loading)")
    except Exception as e:
        assert False, f"Schema validation failed: {e}"

def test_directory_structure():
    """Test that repository has expected structure."""
    project_root = Path(__file__).parent.parent
    
    required_dirs = [
        "appfactory",
        "templates",
        "runbooks", 
        "docs",
        "runs"
    ]
    
    for dirname in required_dirs:
        dir_path = project_root / dirname
        assert dir_path.exists() and dir_path.is_dir(), f"Required directory missing: {dirname}"
    
    required_files = [
        "CLAUDE.md",
        "README.md", 
        "LICENSE"
    ]
    
    for filename in required_files:
        file_path = project_root / filename
        assert file_path.exists() and file_path.is_file(), f"Required file missing: {filename}"
    
    print("✓ Repository structure is correct")

def test_no_conflicting_files():
    """Test that old conflicting files have been removed."""
    project_root = Path(__file__).parent.parent
    
    removed_paths = [
        "bin",
        "builders", 
        "scripts",
        "PIPELINE.md",
        "SHIP_REPORT.md",
        "pipeline.yaml"
    ]
    
    for path_name in removed_paths:
        path = project_root / path_name
        assert not path.exists(), f"Old conflicting file/directory still exists: {path_name}"
    
    print("✓ Old conflicting files removed")

def run_all_tests():
    """Run all tests."""
    tests = [
        test_claude_md_exists,
        test_readme_quickstart,
        test_agent_templates_exist,
        test_appfactory_utilities,
        test_schema_validate_cli,
        test_directory_structure,
        test_no_conflicting_files
    ]
    
    failed = 0
    
    for test in tests:
        try:
            test()
        except Exception as e:
            print(f"❌ {test.__name__}: {e}")
            failed += 1
    
    if failed == 0:
        print(f"\n✅ All {len(tests)} tests passed")
        return True
    else:
        print(f"\n❌ {failed}/{len(tests)} tests failed")
        return False

if __name__ == "__main__":
    success = run_all_tests()
    sys.exit(0 if success else 1)