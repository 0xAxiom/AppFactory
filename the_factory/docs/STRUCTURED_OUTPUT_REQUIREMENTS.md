# Structured Output Requirements for Stages 02-09

**Status**: MANDATORY
**Applies to**: All stages 02 through 09
**Purpose**: Ensure machine-extractable data for downstream consumption

---

## Overview

All pipeline stages (02-09) MUST emit structured, machine-extractable JSON fields for data consumed downstream by:
- Market research aggregation (`scripts/aggregate_market_research.sh`)
- Build contract synthesis (`scripts/build_contract_synthesis.sh`)
- UI/UX verification (`scripts/verify_uiux_implementation.sh`)

**Narrative-only output is NOT acceptable where structured data is required.**

---

## Required Field Paths by Stage

### Stage 02: Product Specification

**Required Fields** (MUST exist at these exact paths):
```json
{
  "product_specification": {
    "app_concept": {
      "core_value_proposition": "string - One sentence value prop",
      "tagline": "string - Marketing tagline"
    },
    "competitive_analysis": {
      "positioning": "string - How app differentiates"
    },
    "core_features": {
      "mvp_features": ["array of MVP feature strings"]
    }
  }
}
```

**Consumed by**: Market research aggregation, Build contract synthesis

---

### Stage 04: Monetization Strategy

**Required Fields** (MUST exist at these exact paths):
```json
{
  "monetization_strategy": {
    "pricing_strategy": {
      "monthly_subscription": {
        "price": "string - e.g. '$4.99'"
      },
      "annual_subscription": {
        "price": "string - e.g. '$39.99'"
      },
      "trial_strategy": {
        "duration": "string - e.g. '7 days'"
      }
    },
    "business_model": {
      "free_tier": {
        "features": ["array of free feature strings"]
      }
    }
  }
}
```

**Consumed by**: Market research aggregation, Build contract synthesis, Stage 10 RevenueCat configuration

---

### Stage 08: Brand Identity

**Required Fields** (MUST exist at these exact paths):
```json
{
  "brand_identity": {
    "brand_strategy": {
      "brand_name": {
        "final_name": "string - Final brand name"
      },
      "brand_personality": {
        "core_attributes": ["array of personality trait strings"]
      },
      "brand_positioning": {
        "value_proposition": "string - Brand value proposition"
      }
    },
    "visual_identity": {
      "color_palette": {
        "primary_colors": [
          {
            "hex_value": "string - e.g. '#1A1A2E'"
          }
        ]
      }
    },
    "messaging_framework": {
      "core_messages": {
        "primary_tagline": "string - Brand tagline"
      }
    }
  }
}
```

**Consumed by**: Market research aggregation, Build contract synthesis, Stage 10 theme generation

---

### Stage 09: Release Planning + ASO

**Required Fields** (MUST exist at these exact paths):
```json
{
  "release_planning": {
    "aso_package": {
      "ios_app_store": {
        "app_name": "string - App Store display name",
        "subtitle": "string - App Store subtitle",
        "keywords": "string - Comma-separated keywords",
        "description": "string - Full app description",
        "primary_category": "string - e.g. 'Utilities'"
      },
      "keyword_strategy": {
        "primary_keywords": ["array of primary keyword strings"]
      }
    },
    "launch_strategy": {
      "release_approach": "string - e.g. 'soft_launch'"
    }
  }
}
```

**Consumed by**: Market research aggregation, Build contract synthesis, Stage 10 app.json configuration

---

## Validation Rule

Before a stage is marked complete, verify:

1. **Field Existence**: All required fields exist in the JSON output
2. **Non-Empty Values**: Fields contain actual data, not empty strings or null
3. **Correct Types**: Arrays are arrays, strings are strings
4. **Path Correctness**: Fields are at the exact specified paths

---

## Enforcement

### At Stage Execution Time

Each stage template MUST include a validation step that checks:
```bash
# Example validation check (pseudo-code)
required_fields=(
  "product_specification.app_concept.core_value_proposition"
  "product_specification.competitive_analysis.positioning"
)

for field in "${required_fields[@]}"; do
  value=$(jq -r ".$field" stage02.json)
  if [[ -z "$value" || "$value" == "null" ]]; then
    echo "MISSING REQUIRED FIELD: $field"
    exit 1
  fi
done
```

### At Aggregation Time

The market research aggregator will:
1. Try primary path first
2. If primary fails, try fallback path
3. If both fail, emit warning to `market-research-warnings.md`
4. Never silently output "Not available"

---

## Fallback Paths (For Backward Compatibility)

If primary paths are not found, these fallback paths are attempted:

| Stage | Field | Primary Path | Fallback Path |
|-------|-------|--------------|---------------|
| 02 | core_value_proposition | `product_specification.app_concept.core_value_proposition` | `product_specification.core_value_proposition` |
| 04 | monthly_price | `monetization_strategy.pricing_strategy.monthly_subscription.price` | `monetization.pricing_strategy.monthly_subscription.price` |
| 08 | brand_name | `brand_identity.brand_strategy.brand_name.final_name` | `brand.name` |
| 09 | app_store_name | `release_planning.aso_package.ios_app_store.app_name` | `aso.app_store_name` |

**WARNING**: Using fallback paths triggers a warning in `market-research-warnings.md`. Stage outputs SHOULD use primary paths.

---

## NO SILENT DEGRADATION

If ANY field extraction falls back to a secondary path or returns "Not available":

1. A warning MUST be logged to console
2. A warning artifact MUST be written to `market-research-warnings.md`
3. The warning MUST specify:
   - Which stage had the issue
   - Which field failed
   - Which paths were attempted
   - Remediation steps

**Silent "Not available" outputs are NOT acceptable.**

---

## Compliance Verification

Run the following to check a stage's output compliance:

```bash
# Check Stage 02 compliance
python3 -c "
import json
import sys

with open('stage02.json') as f:
    data = json.load(f)

required = [
    'product_specification.app_concept.core_value_proposition',
    'product_specification.app_concept.tagline',
    'product_specification.competitive_analysis.positioning'
]

for path in required:
    keys = path.split('.')
    val = data
    for k in keys:
        val = val.get(k) if isinstance(val, dict) else None
    if not val:
        print(f'MISSING: {path}')
        sys.exit(1)

print('All required fields present')
"
```

---

*Document created 2026-01-09*
*This is a binding specification for all pipeline stages.*
