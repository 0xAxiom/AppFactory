#!/usr/bin/env python3
"""
App Factory command line interface module.

This allows running: 
  python -m appfactory.schema_validate <args>
  python -m appfactory.intake_generator <args>
"""

import sys

if __name__ == "__main__":
    # Check if this is being called as intake_generator module
    if 'intake_generator' in ' '.join(sys.argv):
        from .intake_generator import main as intake_main
        # Remove the module name from args for intake_generator
        if len(sys.argv) > 1 and sys.argv[1] == 'intake_generator':
            sys.argv = [sys.argv[0]] + sys.argv[2:]
        intake_main()
    else:
        from .schema_validate import main as validate_main
        validate_main()