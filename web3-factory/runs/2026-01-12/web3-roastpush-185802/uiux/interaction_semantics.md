# RoastPush Interaction Semantics

## User Intent to Blockchain Action Mapping

### Connect Wallet
**User Intent**: "I want to start playing ranked battles"
**UI Trigger**: Tap "Connect Wallet" button in header or on entry modal
**Blockchain Action**: None (wallet adapter connection only)
**Feedback Flow**:
1. Wallet selection modal appears
2. User selects wallet (Phantom, Solflare, etc.)
3. Wallet app opens for approval
4. On approval: header updates to show address + balance
5. On rejection: toast "Connection cancelled"

---

### Enter Ranked Battle
**User Intent**: "I want to compete for ROAST rewards"
**UI Trigger**: Select tier → Tap "Enter Battle"
**Blockchain Action**: Transfer ROAST tokens to battle escrow
**Feedback Flow**:
1. Entry fee confirmation modal shows amount + fees
2. "Confirm in Phantom" instruction appears
3. Wallet opens for signature
4. Pending state: "Entering battle..."
5. Success: Transition to matchmaking
6. Failure: Toast with retry option

---

### Record Roast (Voice)
**User Intent**: "Deliver my roast during my turn"
**UI Trigger**: Hold record button → Release to submit
**Blockchain Action**: None (audio processed server-side, scored by AI)
**Feedback Flow**:
1. Button press: Recording indicator + waveform
2. Timer counts down remaining time
3. Release: "Submitting..." spinner
4. AI processes: "Judging your roast..."
5. Score reveal with animation

---

### Send Emoji Reaction
**User Intent**: "React to this roast"
**UI Trigger**: Tap emoji in reaction bar
**Blockchain Action**: None (real-time via WebSocket)
**Feedback Flow**:
1. Emoji animates up from tap position
2. Counter increments
3. All viewers see reaction in real-time
4. Haptic feedback on send

---

### Tip Performer
**User Intent**: "Send ROAST to this roaster"
**UI Trigger**: Tap tip button → Select amount → Confirm
**Blockchain Action**: Transfer ROAST from user to performer wallet
**Feedback Flow**:
1. Tip amount selector appears
2. Selected amount shows with 2% fee
3. "Confirm in wallet" instruction
4. Pending: "Sending tip..."
5. Success: Toast "Tipped X ROAST to @username"
6. Recipient sees notification

---

### Share Clip
**User Intent**: "Post this battle clip to social media"
**UI Trigger**: Tap share icon on clip → Select platform
**Blockchain Action**: None (clip URL sharing)
**Feedback Flow**:
1. Share sheet opens with platform options
2. TikTok/Instagram/X opens with pre-filled content
3. User completes share in native app
4. Return to RoastPush: Success toast (if detectable)

---

### Claim Prize
**User Intent**: "Receive my battle winnings"
**UI Trigger**: Automatic on battle completion
**Blockchain Action**: Transfer ROAST from escrow to winner wallet
**Feedback Flow**:
1. Battle ends: Winner announcement
2. "Prize incoming..." notification
3. Balance updates with +X ROAST
4. Tx link available in earnings history

---

### Withdraw Earnings
**User Intent**: "Move ROAST to my external wallet"
**UI Trigger**: Profile → Wallet → Withdraw → Enter amount → Confirm
**Blockchain Action**: Transfer ROAST from app custody to user wallet
**Feedback Flow**:
1. Available balance shown
2. Enter amount (max button available)
3. Network fee estimate displayed
4. Confirm triggers wallet signing
5. Pending: "Processing withdrawal..."
6. Success: Toast with tx link

---

### Purchase Cosmetic
**User Intent**: "Buy premium arena/theme/cosmetic"
**UI Trigger**: Shop → Select item → Confirm purchase
**Blockchain Action**: Transfer ROAST to shop contract (10% burned)
**Feedback Flow**:
1. Item details with ROAST price
2. Confirm purchase modal
3. Wallet signature requested
4. Success: Item unlocked immediately
5. Toast: "Unlocked [Item Name]!"

---

## Transaction State Management

### Optimistic Updates
Actions that update UI before blockchain confirmation:
- Battle entry (matched immediately after signature)
- Tip sent (recipient notified immediately)
- Cosmetic purchase (item unlocked immediately)

### Pessimistic Updates
Actions that wait for confirmation:
- Withdrawal (balance updates after confirmation)
- Prize claims (shown as pending until confirmed)

### Rollback Handling
If optimistic transaction fails:
- Show error toast with explanation
- Revert UI state
- Offer retry action
- Log for debugging

---

## Error States by Category

### Wallet Errors
| Error | Message | Action |
|-------|---------|--------|
| Not connected | "Connect wallet to continue" | Connect button |
| Wrong network | "Switch to Solana mainnet" | Network switch button |
| Rejected signature | "Transaction cancelled" | Retry button |
| Wallet locked | "Unlock your wallet" | Open wallet button |

### Balance Errors
| Error | Message | Action |
|-------|---------|--------|
| Insufficient ROAST | "Not enough ROAST for this action" | Buy ROAST link |
| Insufficient SOL (fees) | "Need SOL for network fees" | Deposit SOL link |

### Network Errors
| Error | Message | Action |
|-------|---------|--------|
| RPC timeout | "Network slow. Please wait..." | Auto-retry |
| Transaction failed | "Transaction failed to confirm" | Retry button |
| Rate limited | "Too many requests. Wait a moment." | Countdown timer |

### Battle Errors
| Error | Message | Action |
|-------|---------|--------|
| Opponent disconnected | "Opponent left. You win by default!" | Claim prize |
| Audio failure | "Mic access denied" | Settings link |
| Timeout | "Time's up!" | Auto-submit |

---

## Progressive Disclosure

### Level 1: Casual Users (No Wallet)
- Play free battles
- Watch and react
- View leaderboards
- **Hidden**: Entry fees, earnings, advanced settings

### Level 2: Connected Users
- All Level 1 features
- Enter ranked battles
- Tip performers
- View earnings
- **Hidden**: Detailed transaction history, gas settings

### Level 3: Power Users
- All Level 2 features
- Detailed tx history with explorer links
- Custom RPC settings
- Advanced wallet management
- Export transaction history

### Disclosure Triggers
- Wallet connection: Level 1 → Level 2
- First transaction: Show detailed view option
- Profile settings: Reveal power user options
