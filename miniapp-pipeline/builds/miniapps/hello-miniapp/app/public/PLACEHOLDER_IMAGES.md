# Placeholder Images

This directory should contain the following images for your mini app:

## Required Images

| File | Dimensions | Format | Notes |
|------|-----------|--------|-------|
| `icon.png` | 1024x1024 | PNG | No transparency, app icon |
| `splash.png` | 200x200 | PNG | Loading screen image |
| `hero.png` | 1200x630 | PNG/JPG | Hero image (1.91:1 ratio) |
| `og.png` | 1200x630 | PNG/JPG | Open Graph social image |
| `screenshots/1.png` | 1284x2778 | PNG | Portrait app screenshot |

## Creating Placeholder Images

You can create simple placeholder images using:

### Option 1: Online Tool
Use https://placeholder.com or similar:
- `https://via.placeholder.com/1024x1024/3B82F6/FFFFFF?text=Icon`
- `https://via.placeholder.com/200x200/3B82F6/FFFFFF?text=Splash`
- etc.

### Option 2: Command Line (ImageMagick)
```bash
# Icon (1024x1024)
convert -size 1024x1024 xc:#3B82F6 -fill white -gravity center \
  -pointsize 80 -annotate 0 "Hello\nMini App" icon.png

# Splash (200x200)
convert -size 200x200 xc:#3B82F6 -fill white -gravity center \
  -pointsize 20 -annotate 0 "Hello" splash.png

# Hero (1200x630)
convert -size 1200x630 xc:#3B82F6 -fill white -gravity center \
  -pointsize 60 -annotate 0 "Hello Mini App" hero.png

# OG (1200x630)
convert -size 1200x630 xc:#3B82F6 -fill white -gravity center \
  -pointsize 60 -annotate 0 "Hello Mini App" og.png

# Screenshot (1284x2778)
mkdir -p screenshots
convert -size 1284x2778 xc:#F9FAFB -fill "#3B82F6" -gravity center \
  -pointsize 100 -annotate 0 "App Screenshot" screenshots/1.png
```

### Option 3: Figma/Canva
Create properly branded images in your design tool of choice.

## For Production

Replace these placeholders with actual branded images before publishing your mini app.
