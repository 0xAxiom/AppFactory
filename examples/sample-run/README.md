# Sample Run Example

This directory would contain a complete, sanitized example run of the App Factory pipeline to help users understand the expected outputs and quality standards.

## Example Structure

```
sample-run/
├── spec/
│   ├── 00_intake.md              # Example intake with context
│   ├── 01_market_research.md     # Market research with 10 ideas
│   ├── 02_ideas.md               # Generated app ideas 
│   ├── 02_idea_selection.md      # Human selection with rationale
│   ├── 03_pricing.md             # Pricing research analysis
│   ├── 04_product_spec.md        # Complete product specification
│   ├── 05_ux_flows.md            # UX design and user flows
│   ├── 06_monetization.md        # RevenueCat integration plan
│   ├── 07_architecture.md        # Technical architecture
│   ├── 08_builder_handoff.md     # Implementation preparation
│   ├── 09_polish_checklist.md    # Quality and polish requirements
│   ├── 10_brand.md               # Brand identity and store assets
│   └── 11_release_checklist.md   # QA and release preparation
└── README.md                     # This file
```

## Purpose

This example run demonstrates:
- Expected quality and depth of agent outputs
- Proper idea selection with clear rationale  
- Complete specification development
- Standards compliance throughout
- Professional documentation quality

## Note

To keep the repository size manageable, the complete example files are not included in the initial template. They can be generated using the demo script:

```bash
./scripts/demo.sh
```

This creates a working example that showcases the full pipeline capabilities.