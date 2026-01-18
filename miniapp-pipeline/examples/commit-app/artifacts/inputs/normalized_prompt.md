# Mini App Concept

## Name
Commit

## Tagline
Stake ETH on your goals

## Description
Set goals, stake crypto, get an accountability partner to verify. Complete your goal and get your stake back. Fail and lose it. Put your money where your mouth is.

## Target Users
- Productivity enthusiasts who want skin in the game
- People trying to build habits (gym, reading, coding)
- Friends who want to hold each other accountable
- Anyone who responds to financial incentives

## Core Loop
1. User creates a goal with a deadline
2. Stakes ETH (0.001 - 0.1 ETH range)
3. Selects a friend as accountability partner (by FID)
4. When deadline arrives:
   - Partner verifies completion → Stake returned
   - Partner verifies failure → Stake forfeited (5% protocol fee, 95% to partner)
   - No verification within 48h → Auto-return to creator

## Category
productivity

## Tags
["goals", "accountability", "staking", "productivity", "social"]

## Sharing Context
Users share when they:
- Create a bold commitment ("I'm staking 0.05 ETH that I'll ship my app by Friday!")
- Complete a goal (achievement unlock moment)
- Challenge friends to commit to something

## Onchain Requirements
- Wallet connection required
- ETH transfers for staking
- Could use smart contract for trustless escrow (v2)
- Initial version: custodial escrow via backend

## Revenue Model
- 5% protocol fee on forfeited stakes
- Future: Premium features (private goals, multiple partners, recurring commitments)

## Competitive Advantage
- Native to Farcaster social graph (easy partner selection)
- Low Base fees make micro-stakes viable
- Social proof and public accountability
- Simple UX compared to DeFi staking
