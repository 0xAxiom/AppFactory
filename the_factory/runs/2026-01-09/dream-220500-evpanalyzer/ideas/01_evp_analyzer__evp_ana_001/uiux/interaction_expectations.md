# EVP Analyzer - Interaction Expectations

## Gesture Patterns

### Tap
| Target | Feedback | Action |
|--------|----------|--------|
| Buttons | Haptic light | Execute action |
| RecordButton | Haptic medium | Start/stop recording |
| SessionCard | Haptic light | Navigate to session |
| AnomalyMarker | Haptic light | Jump to timestamp |
| TagChip | Haptic light | Show tag detail |

### Long Press
| Target | Feedback | Action |
|--------|----------|--------|
| SessionCard | Haptic medium | Show context menu |
| Tag | Haptic medium | Show edit/delete options |

### Pan (Horizontal Drag)
| Target | Feedback | Action |
|--------|----------|--------|
| Timeline | None | Scrub playback position |
| Waveform | None | Scrub timeline |
| SessionCard | Haptic warning (at threshold) | Reveal delete action |

### Pinch
| Target | Feedback | Action |
|--------|----------|--------|
| Waveform | None | Zoom timeline |
| Spectrogram | None | Zoom view |

---

## Screen Transitions

| From | To | Animation | Duration |
|------|------|-----------|----------|
| Home | Record | fullScreenModal (slide up) | 300ms |
| Log | Session | push (slide left) | 250ms |
| Session | Tag | modal (partial sheet) | 250ms |
| Session | Export | modal (partial sheet) | 250ms |
| Any | Paywall | formSheet (partial slide) | 300ms |
| Any | Onboarding | fullScreenModal | 300ms |

---

## Loading States

### Session Loading
**Display**: Skeleton waveform with shimmer
**Duration**: Until audio file loaded and waveform data extracted

### Spectrogram Processing
**Display**: Progress indicator with percentage
**Duration**: ~1-3 seconds depending on recording length

### Export
**Display**: Progress bar with percentage
**Duration**: Varies with file size

### Recording Start
**Display**: Brief initialization (RecordButton state change)
**Duration**: <500ms

---

## Playback Behavior

### Play/Pause
- Tap play → Audio starts, playhead moves
- Tap pause → Audio stops, playhead freezes at position

### Scrubbing
- Drag timeline → Playhead follows, audio seeks
- Release → Playback resumes from new position (if was playing)

### Loop Selection
- Select segment → Loop icon appears
- Tap loop → Audio loops selected segment

---

## Recording Behavior

### Start Recording
1. Tap RecordButton
2. Microphone activates (brief initialization)
3. Button changes to recording state (red with pulse)
4. Live waveform begins rendering
5. Timer starts counting up

### Stop Recording
1. Tap RecordButton (or Stop button)
2. Recording ends
3. Brief processing indicator
4. Session saved
5. Navigate to session detail

### Background Recording
- Screen dims → Recording continues
- App backgrounded → Recording continues (with notification)
- Return to app → Waveform resumes live display

---

## Error States

### Microphone Permission Denied
**Display**: Full-screen message with settings button
**Action**: Tap settings → Open system settings

### Storage Full
**Display**: Alert dialog
**Action**: Cannot start recording, prompt to delete sessions

### Recording Interrupted
**Display**: Toast notification
**Action**: Session saved up to interruption point

---

## Haptic Patterns

| Context | Pattern |
|---------|---------|
| Button tap | Light impact |
| Record start | Medium impact |
| Record stop | Medium impact |
| Delete swipe threshold | Warning (notificationWarning) |
| Anomaly detected (optional) | Light impact |
| Error | Error (notificationError) |

---

## Reduce Motion Behavior

When "Reduce Motion" is enabled:

- Waveform renders at reduced frame rate (15fps)
- Recording pulse replaced with static indicator
- Screen transitions use crossfade instead of slides
- No shimmer on loading skeletons
