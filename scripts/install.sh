#!/bin/bash
# App Factory Installation Script
# Provides streamlined setup for optimal developer experience

set -euo pipefail

# Colors for output (maximum compatibility)
readonly RED='\033[0;31m'
readonly GREEN='\033[0;32m'
readonly YELLOW='\033[1;33m'
readonly BLUE='\033[0;34m'
readonly NC='\033[0m' # No Color

# OS Detection
readonly OS_TYPE=$(uname -s)
readonly ARCH=$(uname -m)

# Installation configuration
readonly MIN_PYTHON_VERSION="3.8"
readonly CLAUDE_INSTALL_URL="https://docs.anthropic.com/claude/docs/claude-cli"

# Utility functions
log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
log_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# Check if we're in the right directory
check_install_location() {
    if [[ ! -f "bin/appfactory" ]] || [[ ! -d "templates" ]]; then
        log_error "Installation must be run from App Factory root directory"
        log_error "Please run: cd app-factory && ./scripts/install.sh"
        exit 1
    fi
}

# Check OS compatibility
check_os_compatibility() {
    log_info "Detected OS: $OS_TYPE ($ARCH)"
    
    case "$OS_TYPE" in
        "Darwin")
            log_success "macOS detected - full compatibility"
            ;;
        "Linux")
            log_success "Linux detected - full compatibility"
            ;;
        "MINGW"*|"CYGWIN"*|"MSYS"*)
            log_warning "Windows detected - limited compatibility"
            log_warning "Consider using Windows Subsystem for Linux (WSL)"
            ;;
        *)
            log_warning "Unknown OS detected - proceeding with caution"
            ;;
    esac
}

# Check Python version
check_python() {
    log_info "Checking Python installation..."
    
    if ! command -v python3 &> /dev/null; then
        log_error "Python 3 not found"
        case "$OS_TYPE" in
            "Darwin")
                log_info "Install with: brew install python3"
                log_info "Or download from: https://python.org/downloads/"
                ;;
            "Linux")
                log_info "Install with: sudo apt install python3 python3-pip"
                log_info "Or: sudo yum install python3 python3-pip"
                ;;
        esac
        return 1
    fi
    
    local python_version
    python_version=$(python3 -c "import sys; print(f'{sys.version_info.major}.{sys.version_info.minor}')")
    
    if [[ "$(printf '%s\n' "$MIN_PYTHON_VERSION" "$python_version" | sort -V | head -n1)" != "$MIN_PYTHON_VERSION" ]]; then
        log_error "Python $python_version found, but $MIN_PYTHON_VERSION+ required"
        return 1
    fi
    
    log_success "Python $python_version - compatible"
    return 0
}

# Check Claude CLI
check_claude() {
    log_info "Checking Claude CLI installation..."
    
    if ! command -v claude &> /dev/null; then
        log_warning "Claude CLI not found"
        log_info "Claude CLI is required for pipeline execution"
        log_info "Installation guide: $CLAUDE_INSTALL_URL"
        log_info ""
        log_info "Quick install options:"
        case "$OS_TYPE" in
            "Darwin")
                log_info "  • npm install -g @anthropic-ai/claude-cli"
                log_info "  • brew install claude-cli (if available)"
                ;;
            "Linux")
                log_info "  • npm install -g @anthropic-ai/claude-cli"
                log_info "  • Download binary from Anthropic"
                ;;
        esac
        return 1
    fi
    
    local claude_version
    claude_version=$(claude --version 2>/dev/null || echo "unknown")
    log_success "Claude CLI found - $claude_version"
    return 0
}

# Setup directory permissions
setup_permissions() {
    log_info "Setting up directory permissions..."
    
    # Make scripts executable
    if [[ -d "scripts" ]]; then
        chmod +x scripts/*.sh 2>/dev/null || true
    fi
    
    # Make main binary executable
    if [[ -f "bin/appfactory" ]]; then
        chmod +x bin/appfactory
    else
        log_error "Main binary bin/appfactory not found"
        return 1
    fi
    
    log_success "Permissions configured"
}

# Create XDG-compliant directories
setup_config_dirs() {
    log_info "Setting up configuration directories..."
    
    local config_dir="${XDG_CONFIG_HOME:-$HOME/.config}/appfactory"
    local data_dir="${XDG_DATA_HOME:-$HOME/.local/share}/appfactory"
    local cache_dir="${XDG_CACHE_HOME:-$HOME/.cache}/appfactory"
    
    mkdir -p "$config_dir" "$data_dir" "$cache_dir"
    
    log_success "Configuration directories ready:"
    log_info "  Config: $config_dir"
    log_info "  Data: $data_dir"
    log_info "  Cache: $cache_dir"
}

# Test installation
test_installation() {
    log_info "Testing App Factory installation..."
    
    # Test basic CLI functionality
    if ./bin/appfactory doctor >/dev/null 2>&1; then
        log_success "App Factory CLI test passed"
    else
        log_warning "CLI test failed - try running: ./bin/appfactory doctor"
    fi
}

# Show next steps
show_next_steps() {
    echo ""
    log_success "App Factory installation complete!"
    echo ""
    echo -e "${BLUE}Next steps:${NC}"
    echo "  1. Run dependency check:    ./bin/appfactory doctor"
    echo "  2. Start interactive mode:  ./bin/appfactory"
    echo "  3. Create your first app:   Select option 1 from menu"
    echo ""
    
    if ! command -v claude &> /dev/null; then
        echo -e "${YELLOW}⚠ Don't forget to install Claude CLI for full functionality${NC}"
        echo "  Installation guide: $CLAUDE_INSTALL_URL"
        echo ""
    fi
    
    echo -e "${BLUE}Need help?${NC}"
    echo "  • Documentation: ./bin/appfactory help"
    echo "  • README: cat README.md"
    echo "  • Issues: https://github.com/anthropics/claude-code/issues"
}

# Main installation flow
main() {
    echo -e "${BLUE}App Factory Installation${NC}"
    echo "=========================="
    echo ""
    
    local overall_success=true
    
    # Core checks
    check_install_location
    check_os_compatibility
    
    # Dependency checks (non-blocking for partial installs)
    if ! check_python; then
        overall_success=false
    fi
    
    if ! check_claude; then
        overall_success=false
    fi
    
    # Setup (always runs)
    setup_permissions
    setup_config_dirs
    
    # Final test
    test_installation
    
    # Results
    if [[ "$overall_success" == "true" ]]; then
        show_next_steps
        exit 0
    else
        echo ""
        log_warning "Installation completed with missing dependencies"
        log_info "App Factory will work in stub mode until dependencies are installed"
        show_next_steps
        exit 2  # Partial success
    fi
}

# Run installation
main "$@"