# RoastPush Component Inventory

## Layout Components

### AppShell
- **Purpose**: Root layout wrapper with header and bottom navigation
- **Behavior**: Persistent header with ROAST balance, bottom tab bar with 5 tabs
- **Props**: `children`, `hideNav` (for battle full-screen)

### Header
- **Purpose**: Top bar with logo, balance, and wallet
- **Behavior**: Fixed position, blur backdrop, shows ROAST balance when connected
- **Props**: `showBalance`, `onWalletClick`

### BottomNav
- **Purpose**: Tab navigation for main sections
- **Behavior**: 5 tabs (Home, Battle, Leaderboard, Clips, Profile), Battle tab is prominent
- **Props**: `activeTab`, `onTabChange`

---

## Battle Components

### BattleArena
- **Purpose**: Main battle view during active matches
- **Behavior**: Full-screen, shows both players, prompt, timer, reactions
- **States**: waiting, active, judging, complete
- **Props**: `battle`, `currentRound`, `timeRemaining`

### PlayerCard
- **Purpose**: Display battler info during match
- **Behavior**: Avatar, username, current score, speaking indicator
- **Props**: `player`, `isActive`, `score`, `isSpeaking`

### RoastPromptCard
- **Purpose**: Display current round's roast prompt
- **Behavior**: Dramatic reveal animation, countdown timer bar
- **Props**: `prompt`, `timeLimit`, `timeRemaining`

### VoiceRecorder
- **Purpose**: Record voice roast during turn
- **Behavior**: Hold to record, waveform visualization, max time limit
- **Props**: `maxDuration`, `onRecordComplete`, `isMyTurn`

### TextRoastInput
- **Purpose**: Text input alternative to voice
- **Behavior**: Character limit, submit button, countdown
- **Props**: `maxLength`, `onSubmit`, `disabled`

### RoundTimer
- **Purpose**: Visual countdown for current round
- **Behavior**: Circular progress, color changes at 10s, 5s warning
- **Props**: `totalSeconds`, `remainingSeconds`

### AIJudgeCommentary
- **Purpose**: Display AI scoring with funny commentary
- **Behavior**: Typewriter reveal effect, score breakdown
- **Props**: `scores`, `commentary`, `winner`

### BattleResultModal
- **Purpose**: Post-battle summary and sharing
- **Behavior**: Winner announcement, earnings, clip share CTA
- **Props**: `result`, `earnings`, `clipUrl`, `onClose`

---

## Reaction Components

### EmojiReactionBar
- **Purpose**: Send live reactions during battles
- **Behavior**: Horizontal emoji row, tap to send, count display
- **Props**: `reactions`, `onReact`, `disabled`

### FloatingEmoji
- **Purpose**: Animated emoji floating up screen
- **Behavior**: Rises from tap position, fades out at top
- **Props**: `emoji`, `startPosition`

### ReactionCounter
- **Purpose**: Show aggregated reaction counts
- **Behavior**: Real-time updates, sorted by count
- **Props**: `reactions`

---

## Matchmaking Components

### MatchmakingLoader
- **Purpose**: Finding opponent animation
- **Behavior**: Pulsing fire effect, estimated wait, cancel option
- **Props**: `estimatedWait`, `onCancel`

### TierSelector
- **Purpose**: Choose battle entry tier
- **Behavior**: Bronze/Silver/Gold/Diamond buttons with ROAST amounts
- **Props**: `selectedTier`, `onSelect`, `userBalance`

### QuickMatchButton
- **Purpose**: Primary CTA to start battle
- **Behavior**: Large animated button, disabled without wallet
- **Props**: `onClick`, `disabled`, `loading`

---

## Leaderboard Components

### LeaderboardList
- **Purpose**: Ranked list of top players
- **Behavior**: Pull to refresh, infinite scroll, tab filters
- **Props**: `period` (daily/weekly/alltime), `data`

### LeaderboardCard
- **Purpose**: Single player entry in leaderboard
- **Behavior**: Rank badge, avatar, stats, tap for profile
- **Props**: `rank`, `player`, `stats`

### RankBadge
- **Purpose**: Visual rank indicator
- **Behavior**: Gold/silver/bronze for top 3, numbers for rest
- **Props**: `rank`

---

## Clip Components

### ClipGrid
- **Purpose**: Grid of battle clip previews
- **Behavior**: Masonry layout, tap to play, lazy loading
- **Props**: `clips`, `onClipSelect`

### ClipPreview
- **Purpose**: Single clip thumbnail card
- **Behavior**: 9:16 ratio, play button, view count, share icons
- **Props**: `clip`, `onPlay`, `onShare`

### ClipPlayer
- **Purpose**: Full-screen vertical video player
- **Behavior**: Auto-play, swipe for next, share overlay
- **Props**: `clipUrl`, `onClose`, `onShare`

### ShareSheet
- **Purpose**: Platform share options
- **Behavior**: TikTok, Instagram Reels, X, Copy Link
- **Props**: `clipUrl`, `onShare`, `onClose`

---

## Profile Components

### ProfileHeader
- **Purpose**: User profile summary
- **Behavior**: Avatar, username, stats summary, edit button
- **Props**: `user`, `isOwnProfile`

### StatsGrid
- **Purpose**: Player statistics display
- **Behavior**: Grid of stat cards (wins, losses, earnings, rank)
- **Props**: `stats`

### BattleHistory
- **Purpose**: List of past battles
- **Behavior**: Chronological list, win/loss indicator, clip links
- **Props**: `battles`

### AchievementBadges
- **Purpose**: Unlocked achievements display
- **Behavior**: Badge grid, tap for details
- **Props**: `achievements`

---

## Web3 Components

### WalletButton
- **Purpose**: Wallet connection toggle
- **Behavior**: Shows connect/address/balance states
- **Props**: `connected`, `address`, `balance`, `onClick`

### WalletModal
- **Purpose**: Wallet selection and options
- **Behavior**: List supported wallets, connection flow
- **Props**: `open`, `onClose`, `onConnect`

### TokenBalanceDisplay
- **Purpose**: Show ROAST balance with icon
- **Behavior**: Compact format, tap for details
- **Props**: `balance`, `onClick`

### TransactionConfirmModal
- **Purpose**: Pre-sign transaction details
- **Behavior**: Shows amount, action, fees, confirm/cancel
- **Props**: `action`, `amount`, `fee`, `onConfirm`, `onCancel`

### TransactionStatusToast
- **Purpose**: Signing and confirmation feedback
- **Behavior**: Pending/success/error states with tx link
- **Props**: `status`, `txSignature`, `message`

### EntryFeeSelector
- **Purpose**: Choose ranked battle tier
- **Behavior**: Tier cards with ROAST amounts
- **Props**: `tiers`, `selected`, `onSelect`, `balance`

### TipModal
- **Purpose**: Send tip to performer
- **Behavior**: Quick amounts + custom, confirm flow
- **Props**: `recipient`, `onTip`, `onClose`

### WithdrawPanel
- **Purpose**: Withdraw earnings from app
- **Behavior**: Balance display, amount input, confirm
- **Props**: `availableBalance`, `onWithdraw`

---

## Shared Components

### Button
- **Variants**: primary, secondary, ghost, danger
- **Sizes**: sm, md, lg
- **States**: default, hover, active, disabled, loading

### Input
- **Types**: text, number, search
- **States**: default, focus, error, disabled

### Modal
- **Features**: Backdrop blur, close button, animations
- **Props**: `open`, `onClose`, `title`, `children`

### Toast
- **Types**: success, error, warning, info
- **Features**: Auto-dismiss, action button, dismiss button

### Avatar
- **Features**: Image with fallback, size variants, online indicator
- **Props**: `src`, `fallback`, `size`, `online`

### Badge
- **Variants**: default, success, error, warning
- **Props**: `variant`, `children`

### Skeleton
- **Purpose**: Loading placeholder
- **Variants**: text, avatar, card, list

### EmptyState
- **Purpose**: No content placeholder
- **Props**: `icon`, `title`, `description`, `action`
