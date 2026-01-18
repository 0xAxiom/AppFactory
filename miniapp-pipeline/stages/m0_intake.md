# Stage M0: Intent Normalization

## Purpose

Transform raw user input into a structured mini app concept that can drive the rest of the pipeline.

## Input

- Raw user description (any format, any length)

## Process

1. **Extract Core Value**
   - What does this app do?
   - What problem does it solve?
   - What makes it valuable in a social context?

2. **Identify Target Users**
   - Who will use this?
   - What's their context?
   - How do they discover it?

3. **Determine Core Loop**
   - What's the primary user action?
   - What happens after?
   - How does it encourage return usage?

4. **Classify Category**
   - Select from valid Base categories
   - Consider primary use case

5. **Assess Onchain Requirements**
   - Does this need wallet connection?
   - Does this involve transactions?
   - Default to "none" unless explicit

## Output

File: `artifacts/inputs/normalized_prompt.md`

```markdown
# Mini App Concept

## Name
[Suggested name, max 32 chars]

## Tagline
[One-line description, max 30 chars]

## Description
[Detailed description, max 170 chars for manifest]

## Target Users
[Who will use this app and why]

## Core Loop
1. [User does X]
2. [App responds with Y]
3. [User shares/returns because Z]

## Category
[One of: games, social, finance, utility, productivity, health-fitness, news-media, music, shopping, education, developer-tools, entertainment, art-creativity]

## Tags
- [tag1]
- [tag2]
- [max 5 tags, lowercase, no spaces]

## Sharing Context
[How will users discover this? How will they share it?]

## Onchain Requirements
[none / wallet-connection / transactions / smart-contracts]

## Additional Notes
[Any constraints, preferences, or context from user]
```

## Validation

- [ ] Name is ≤32 characters
- [ ] Tagline is ≤30 characters
- [ ] Description is ≤170 characters
- [ ] Category is valid
- [ ] Tags are ≤5, all lowercase, no spaces
- [ ] Core loop is defined
- [ ] Onchain requirement is explicit

## Examples

### Input: Simple Social App
```
I want an app where friends can share what they're grateful for each day
```

### Output:
```markdown
# Mini App Concept

## Name
Daily Gratitude

## Tagline
Share what you're thankful for

## Description
A simple app to share one thing you're grateful for each day with your friends. See what others appreciate and spread positivity.

## Target Users
- People who want to practice gratitude
- Friend groups looking for positive interaction
- Anyone seeking daily mindfulness prompts

## Core Loop
1. User opens app and sees prompt
2. User writes their gratitude (text, optional photo)
3. Post appears in friends' feeds
4. Friends react and share their own

## Category
social

## Tags
- gratitude
- daily
- friends
- mindfulness
- social

## Sharing Context
Users share their gratitude posts which appear as mini app embeds. Friends tap to join and share their own.

## Onchain Requirements
none
```

### Input: App with Crypto
```
tip jar where fans can send me USDC for my content
```

### Output:
```markdown
# Mini App Concept

## Name
Creator Tip Jar

## Tagline
Support creators with USDC

## Description
A simple tip jar for creators. Fans can send USDC directly to show appreciation for content they love.

## Target Users
- Content creators seeking monetization
- Fans who want to support creators
- Anyone wanting easy crypto tipping

## Core Loop
1. Creator shares their tip jar link
2. Fan taps and sees creator profile
3. Fan selects tip amount
4. Fan confirms USDC transaction
5. Creator receives notification

## Category
finance

## Tags
- tipping
- creator
- usdc
- support
- payments

## Sharing Context
Creators embed tip jar in posts. Fans tap to open and tip directly.

## Onchain Requirements
transactions

## Additional Notes
Requires wallet connection. Uses USDC on Base. Consider minimum tip amounts.
```

## Error Cases

### Too Vague
Input: "an app"

Response: Ask clarifying questions:
- What should the app do?
- Who is it for?
- What's the main action users take?

### Multiple Ideas
Input: "a game and a tip jar and a poll app"

Response: Ask user to pick one to start:
- Which is the priority?
- Should we build them separately?
- Can they be combined into one coherent app?

## Next Stage

Output feeds into Stage M1 (Template Selection & Scaffold Plan).
