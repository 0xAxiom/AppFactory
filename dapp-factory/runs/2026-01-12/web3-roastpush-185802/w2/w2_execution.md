# W2 Execution Report: ROAST Token Definition

**Stage**: W2 - Token Role Definition
**Run ID**: web3-roastpush-185802
**Status**: COMPLETE

## Token Role Selection

### Primary Role: SETTLEMENT

ROAST token serves as the **settlement layer** for all RoastPush transactions. This role was selected over alternatives because:

| Role | Fit for RoastPush | Reason |
|------|-------------------|--------|
| ACCESS | Partial | Some features are gated, but core value is in transactions |
| USAGE | Partial | Users spend tokens, but not consumed per-action |
| FEE CAPTURE | Secondary | Fee sharing exists but not primary value prop |
| **SETTLEMENT** | **Primary** | All value exchange denominated in ROAST |
| GOVERNANCE | No | Users don't need voting rights |

**Why Settlement**:
- All battle entries paid in ROAST
- All prizes distributed in ROAST
- All tips transferred in ROAST
- All purchases made in ROAST
- Creates closed-loop economy

## Token Economics Summary

### Supply: 1,000,000,000 ROAST (Fixed)

**Distribution**:
```
Liquidity Pool:      400,000,000 (40%)  - DEX trading liquidity
Prize Pool Reserve:  250,000,000 (25%)  - Battle rewards buffer
Team Treasury:       150,000,000 (15%)  - Operations, vested
Community Rewards:   150,000,000 (15%)  - Airdrops, engagement
Early Contributors:   50,000,000 (5%)   - Advisors, builders
```

### Deflationary Mechanics

1. **Platform Fee Burns**: 50% of protocol fees burned quarterly
2. **Cosmetic Burns**: 10% of cosmetic purchases burned
3. **Fixed Supply**: No minting capability post-launch

### Value Capture Points

| Activity | Fee Rate | Fee Destination |
|----------|----------|-----------------|
| Prize Pool | 5% rake | Protocol treasury |
| Tips | 2% fee | Protocol treasury |
| Cosmetics | 15% margin | Protocol + burn |
| Premium Rooms | Flat fee | Protocol treasury |

## Fee Routing Configuration

### MANDATORY: 75% Creator / 25% Partner

```
Total Protocol Fees: 100%
├── App Creator:     75% (7500 BPS)
└── App Factory:     25% (2500 BPS)
    └── Partner Key: FDYcVLxHkekUFz4M29hCuBH3vbf1aLm62GEFZxLFdGE7
```

**Enforcement**:
- Hardcoded in Bags SDK fee share configuration
- Immutable partner key in token creation
- Onchain enforcement prevents modification
- Applies to all protocol-level fees

### Fee Flow Example

```
User enters 100 ROAST ranked battle
├── 95 ROAST → Prize Pool
└── 5 ROAST → Protocol Fee
    ├── 3.75 ROAST → Creator (75%)
    └── 1.25 ROAST → App Factory Partner (25%)
```

## App Behavior Specification

### With ROAST Balance

| Balance | Unlocked Features |
|---------|-------------------|
| 0 | Free casual play, watching, reacting |
| 10+ | Bronze tier ranked battles |
| 50+ | Silver tier ranked battles |
| 100+ | Gold tier ranked battles |
| 500+ | Diamond tier ranked battles |
| 1000+ | Premium room creation |

### Zero Token Experience

Users without ROAST can still:
- Play unlimited casual (unranked) matches
- Watch live battles
- React with emojis
- Browse leaderboards and clips
- Connect wallet for airdrop eligibility

This ensures new users can experience the app before committing tokens.

### Token Acquisition Paths

1. **Buy**: Purchase ROAST from DEX (Raydium, Jupiter)
2. **Win**: Earn from battle victories
3. **Earn**: Daily logins, referrals, community rewards
4. **Receive**: Tips from audience as performer

## Success Criteria Validation

- [x] Primary token role clearly selected (SETTLEMENT)
- [x] Supply model aligned with token role (fixed, deflationary)
- [x] Fee routing (75%/25%) explicitly configured
- [x] App behavior with/without tokens defined
- [x] Token economics support app sustainability
- [x] Token serves functional purpose, not speculation

## Next Stage

Proceed to W3: UI/UX Design Contract with token integration requirements established.
