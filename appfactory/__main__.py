#!/usr/bin/env python3
"""
App Factory command line interface module.

This allows running: python -m appfactory.schema_validate <args>
"""

import sys
from .schema_validate import main

if __name__ == "__main__":
    main()