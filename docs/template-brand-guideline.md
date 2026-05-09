# Brand Guidelines Supplement — English Pronunciation Course
> **Document Type:** AI Agent Brand Specification — Supplement  
> **Method:** BMAD Spec-Driven Development / OpenCode  
> **Covers:** 10 missing aspects from initial brand doc  
> **Version:** 1.0.0

---

## 1. LOGO GUIDELINES

### 1.1 Logo Anatomy
```
┌─────────────────────────────────────┐
│  [S]  English Pronunciation Course  │
│        for Spanish Speakers         │
└─────────────────────────────────────┘
  ↑          ↑
Logomark   Logotype
```

**Logomark** — "S" Monogram Circle
- Shape: Perfect circle
- Background fill: `#E91E8C` (Hot Pink Primary)
- Letter: "S", color white `#FFFFFF`, font-weight: 800, font-family: Inter
- Size ratio: letter occupies ~55% of circle diameter
- Minimum size: 24×24px (digital), 8mm (print)

**Logotype** — Wordmark
- Line 1: "English Pronunciation Course" — font-weight: 700, color: `#1A1A2E`
- Line 2: "for Spanish Speakers" — font-weight: 400, color: `#E91E8C`, font-size: 75% of line 1
- Spacing between logomark & logotype: 10px

### 1.2 Logo Variants

| Variant | When to Use |
|---------|-------------|
| **Full (mark + wordmark)** | Header, about page, documents |
| **Mark only** | Favicon, avatar, app icon, small spaces |
| **Wordmark only** | Footer text links, breadcrumbs |
| **Monochrome dark** | Dark backgrounds — white mark + white wordmark |
| **Monochrome light** | Very light / white bg — full color mark + dark wordmark |

### 1.3 Clear Space
```
Minimum clear space around logo = 1× the height of the "S" circle
No other elements, text, or graphics may enter this zone.
```

### 1.4 Logo DON'Ts
- ❌ Do not recolor the "S" mark to anything other than `#E91E8C` or white
- ❌ Do not stretch or distort proportions
- ❌ Do not add drop shadow to the logomark
- ❌ Do not place on a busy photographic background without overlay
- ❌ Do not use font other than Inter for the monogram

---

## 2. FONT PAIRING (Heading vs Body)

### 2.1 Rationale
The UI uses **Inter** as the sole family, but uses **weight contrast** to create hierarchy — not two different typefaces. This is intentional: Inter at 800 weight reads as a display font; at 400 it reads as clean body text.

However, for **marketing pages, landing pages, and hero sections** where greater personality is needed, a two-font system is specified below.

### 2.2 Two-Font Pairing System

| Role | Font | Weight | Notes |
|------|------|--------|-------|
| **Display / Hero Heading** | `Plus Jakarta Sans` | 700–800 | More expressive, geometric warmth |
| **Section Heading (H2–H3)** | `Plus Jakarta Sans` | 600–700 | Consistent with display |
| **Body / UI Text** | `Inter` | 400–500 | Clean, readable, functional |
| **Labels / Badges / Tags** | `Inter` | 500–600 | Small sizes need Inter's clarity |
| **CTA Buttons** | `Inter` | 600 | Action items stay functional |
| **Code / Mono** | `JetBrains Mono` | 400 | Only if technical content shown |

### 2.3 Google Fonts Import
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700;800&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
```

### 2.4 CSS Font Tokens
```css
--font-display: 'Plus Jakarta Sans', -apple-system, sans-serif;
--font-body:    'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
--font-mono:    'JetBrains Mono', 'Courier New', monospace;

/* Heading scale — use --font-display */
--text-hero:   clamp(40px, 6vw, 64px) / 1.1  var(--font-display);
--text-h1:     48px / 1.15  var(--font-display);
--text-h2:     32px / 1.2   var(--font-display);
--text-h3:     22px / 1.3   var(--font-display);

/* Body scale — use --font-body */
--text-body-lg: 18px / 1.7  var(--font-body);
--text-body:    16px / 1.6  var(--font-body);
--text-sm:      14px / 1.5  var(--font-body);
--text-xs:      12px / 1.4  var(--font-body);
```

### 2.5 Pairing Rules for Agent
```
ALWAYS use --font-display for: h1, h2, h3, .hero-title, .section-title
ALWAYS use --font-body for: p, li, label, input, button, span, .badge
NEVER mix fonts within the same text node
NEVER use Plus Jakarta Sans below 16px
```

---

## 3. SPACING SYSTEM (8px Grid)

### 3.1 Base Unit
**Base = 8px.** Every spacing value must be a multiple of 8 (or 4 for micro-spacing).

### 3.2 Spacing Scale
```css
/* === SPACING TOKENS (8px grid) === */
--sp-0:    0px;
--sp-1:    4px;   /* micro — icon gaps, tight padding */
--sp-2:    8px;   /* xs — inline element gaps */
--sp-3:   12px;   /* sm — label to input */
--sp-4:   16px;   /* md — default padding, card internal */
--sp-5:   24px;   /* lg — card padding, section sub-gap */
--sp-6:   32px;   /* xl — between related groups */
--sp-7:   48px;   /* 2xl — section internal spacing */
--sp-8:   64px;   /* 3xl — section to section gap */
--sp-9:   80px;   /* 4xl — hero padding, page sections */
--sp-10: 120px;   /* 5xl — top-level page breathing room */
```

### 3.3 Semantic Spacing Tokens
```css
/* Component-level semantics */
--spacing-component-xs:   var(--sp-2);   /* 8px  — tight components */
--spacing-component-sm:   var(--sp-4);   /* 16px — default component gap */
--spacing-component-md:   var(--sp-5);   /* 24px — comfortable component gap */
--spacing-component-lg:   var(--sp-6);   /* 32px — section sub-divisions */

/* Layout-level semantics */
--spacing-section-sm:     var(--sp-7);   /* 48px — tight sections */
--spacing-section-md:     var(--sp-8);   /* 64px — default sections */
--spacing-section-lg:     var(--sp-9);   /* 80px — generous sections */
--spacing-page:           var(--sp-10);  /* 120px — page-level padding */

/* Inline semantics */
--spacing-gap-tight:      var(--sp-2);   /* 8px  — icon + label */
--spacing-gap-default:    var(--sp-3);   /* 12px — button icon + text */
--spacing-gap-loose:      var(--sp-4);   /* 16px — card header elements */
```

### 3.4 Grid Layout System
```css
/* Container */
--grid-container-max:   1100px;
--grid-container-pad:   var(--sp-5);    /* 24px side padding */

/* Column grids */
--grid-1: repeat(1, 1fr);
--grid-2: repeat(2, 1fr);
--grid-3: repeat(3, 1fr);
--grid-4: repeat(4, 1fr);
--grid-gap-sm: var(--sp-3);   /* 12px */
--grid-gap-md: var(--sp-4);   /* 16px — default */
--grid-gap-lg: var(--sp-5);   /* 24px */
```

### 3.5 Agent Spacing Rules
```
✅ All padding/margin values MUST be multiples of 4px
✅ All gap values between components MUST be multiples of 8px
✅ Section vertical padding MUST use --spacing-section-* tokens
❌ Never use arbitrary px values like 13px, 17px, 22px
❌ Never use rem — use px tokens only for predictability
```

---

## 4. BUTTON STYLES

### 4.1 Button Variants

#### PRIMARY — Main call-to-action
```css
.btn-primary {
  background:    #E91E8C;
  color:         #FFFFFF;
  border:        none;
  border-radius: 9999px;
  padding:       14px 28px;
  font-family:   var(--font-body);
  font-size:     15px;
  font-weight:   600;
  letter-spacing: 0.01em;
  box-shadow:    0 4px 20px rgba(233, 30, 140, 0.35);
  cursor:        pointer;
  display:       inline-flex;
  align-items:   center;
  gap:           8px;
  transition:    all 250ms ease;
}

.btn-primary:hover {
  background:  #C2177A;
  box-shadow:  0 6px 28px rgba(233, 30, 140, 0.45);
  transform:   translateY(-2px);
}

.btn-primary:active {
  transform:   translateY(0px);
  box-shadow:  0 2px 8px rgba(233, 30, 140, 0.25);
}

.btn-primary:focus-visible {
  outline:        2px solid #E91E8C;
  outline-offset: 3px;
}

.btn-primary:disabled {
  opacity:        0.4;
  cursor:         not-allowed;
  transform:      none;
  box-shadow:     none;
}
```

#### SECONDARY — Supporting action
```css
.btn-secondary {
  background:    transparent;
  color:         #E91E8C;
  border:        2px solid #E91E8C;
  border-radius: 9999px;
  padding:       12px 26px;       /* 2px less to compensate border */
  font-family:   var(--font-body);
  font-size:     15px;
  font-weight:   600;
  cursor:        pointer;
  display:       inline-flex;
  align-items:   center;
  gap:           8px;
  transition:    all 250ms ease;
}

.btn-secondary:hover {
  background:  #FFF0F7;
  border-color: #C2177A;
  color:        #C2177A;
  transform:    translateY(-1px);
}

.btn-secondary:active {
  transform:   translateY(0);
  background:  #FCE4F0;
}
```

#### GHOST — Subtle / tertiary action
```css
.btn-ghost {
  background:    transparent;
  color:         #6B7280;
  border:        none;
  border-radius: 9999px;
  padding:       12px 20px;
  font-family:   var(--font-body);
  font-size:     14px;
  font-weight:   500;
  cursor:        pointer;
  display:       inline-flex;
  align-items:   center;
  gap:           6px;
  transition:    all 200ms ease;
}

.btn-ghost:hover {
  background:  #FFF0F7;
  color:       #E91E8C;
}
```

#### ICON-ONLY — Compact icon button
```css
.btn-icon {
  background:    transparent;
  border:        1px solid #F3E4EC;
  border-radius: 50%;
  width:         40px;
  height:        40px;
  display:       flex;
  align-items:   center;
  justify-content: center;
  color:         #6B7280;
  cursor:        pointer;
  transition:    all 200ms ease;
}

.btn-icon:hover {
  background:   #FFF0F7;
  color:        #E91E8C;
  border-color: #E91E8C;
}
```

### 4.2 Button Sizes
```css
/* Size modifiers */
.btn-sm  { padding: 8px 18px;  font-size: 13px; }
.btn-md  { padding: 14px 28px; font-size: 15px; } /* default */
.btn-lg  { padding: 18px 36px; font-size: 17px; }
```

### 4.3 Button with Icon Pattern
```
[Icon]  Label Text        ← icon LEFT: navigation, filter
Label Text  [Icon →]      ← icon RIGHT: CTA, next step (preferred for primary)
```

---

## 5. CARD & SHADOW STYLES

### 5.1 Card Variants

#### BASE CARD — Default container
```css
.card {
  background:    #FFFFFF;
  border:        1px solid #F3E4EC;
  border-radius: 16px;
  padding:       24px;
  box-shadow:    0 1px 3px rgba(233,30,140,0.06), 0 1px 2px rgba(0,0,0,0.04);
  transition:    box-shadow 250ms ease, transform 250ms ease;
}

.card:hover {
  box-shadow:  0 4px 16px rgba(233,30,140,0.12), 0 2px 8px rgba(0,0,0,0.04);
  transform:   translateY(-2px);
}
```

#### FEATURE CARD — 4-grid feature badges
```css
.card-feature {
  background:    #FFFFFF;
  border:        1px solid #F3E4EC;
  border-radius: 16px;
  padding:       20px 16px;
  text-align:    center;
  box-shadow:    0 1px 3px rgba(233,30,140,0.06);
}
```

#### SECTION CARD — Course section list items
```css
.card-section {
  background:    #FFFFFF;
  border:        1px solid #F3E4EC;
  border-radius: 20px;
  padding:       24px 28px;
  display:       flex;
  align-items:   flex-start;
  gap:           20px;
  box-shadow:    0 2px 8px rgba(233,30,140,0.06);
  transition:    all 250ms ease;
}

.card-section:hover {
  border-color: #E91E8C;
  box-shadow:   0 4px 20px rgba(233,30,140,0.14);
  transform:    translateY(-2px);
}
```

#### ELEVATED CARD — Highlighted / featured content
```css
.card-elevated {
  background:    #FFFFFF;
  border:        1px solid #E8C9DC;
  border-radius: 20px;
  padding:       32px;
  box-shadow:    0 8px 32px rgba(233,30,140,0.14), 0 4px 12px rgba(0,0,0,0.06);
}
```

#### TINTED CARD — Soft pink background variant
```css
.card-tinted {
  background:    #FFF0F7;
  border:        1px solid #F3E4EC;
  border-radius: 16px;
  padding:       24px;
  box-shadow:    none;
}
```

### 5.2 Shadow Token System
```css
/* === SHADOW TOKENS === */
--shadow-none:    none;
--shadow-xs:      0 1px 2px rgba(233,30,140,0.04);
--shadow-sm:      0 1px 3px rgba(233,30,140,0.06),  0 1px 2px  rgba(0,0,0,0.04);
--shadow-md:      0 4px 16px rgba(233,30,140,0.10), 0 2px 6px  rgba(0,0,0,0.04);
--shadow-lg:      0 8px 32px rgba(233,30,140,0.14), 0 4px 12px rgba(0,0,0,0.06);
--shadow-xl:      0 16px 48px rgba(233,30,140,0.18),0 8px 20px rgba(0,0,0,0.08);
--shadow-cta:     0 4px 20px rgba(233,30,140,0.35);
--shadow-cta-lg:  0 8px 32px rgba(233,30,140,0.45);
--shadow-focus:   0 0 0 3px rgba(233,30,140,0.25);
--shadow-inset:   inset 0 1px 3px rgba(0,0,0,0.06);
```

### 5.3 Agent Card Rules
```
✅ ALL cards must have border: 1px solid var(--color-border)
✅ ALL interactive cards must have :hover with translateY(-2px)
✅ Shadow tint color MUST be based on pink rgba(233,30,140,x), not gray
✅ Border-radius MUST be minimum --radius-lg (16px) for cards
❌ Never use gray box-shadow on this brand
❌ Never use border-radius below 12px on cards
```

---

## 6. ICON SET & ILLUSTRATION STYLE

### 6.1 Icon Library
**Primary:** [Lucide Icons](https://lucide.dev) — outline/line style  
**Fallback:** Heroicons (outline variant)

### 6.2 Icon Style Rules
```
Style:         Outline (stroke), NOT filled
Stroke width:  1.5px (default), 2px for emphasis
Size scale:
  --icon-xs:   14px  → badges, inline text
  --icon-sm:   16px  → buttons, labels
  --icon-md:   20px  → cards, feature items   ← default
  --icon-lg:   24px  → section headers, nav
  --icon-xl:   32px  → hero decorative

Color rules:
  Active / accent:  #E91E8C  (primary pink)
  Default / muted:  #6B7280  (secondary text)
  On dark bg:       #FFFFFF
  Disabled:         #D1D5DB
```

### 6.3 Icon Usage Map
| Icon | Context | Lucide Name |
|------|---------|-------------|
| ✓ Check circle | Feature badges, completion | `circle-check` |
| 🔊 Volume/Speaker | Audio, pronunciation | `volume-2` |
| 👤 Person | Instructor, user avatar | `user` |
| 〰 Waves | Audio sections, sound | `waves` |
| → Arrow right | CTA buttons, navigation | `arrow-right` |
| 🌐 Globe | Language switcher | `globe` |
| ▶ Play | Start lesson, audio play | `play-circle` |
| 📖 Book | Course materials | `book-open` |
| ⭐ Star | Progress, achievement | `star` |
| ⚙ Settings | Account, preferences | `settings` |

### 6.4 Icon Wrapper (Circle Background)
```css
.icon-wrapper {
  width:           48px;
  height:          48px;
  background:      #FCE4F0;    /* --color-bg-icon */
  border-radius:   50%;
  display:         flex;
  align-items:     center;
  justify-content: center;
  flex-shrink:     0;
}

/* Size variants */
.icon-wrapper-sm  { width: 32px; height: 32px; }
.icon-wrapper-md  { width: 48px; height: 48px; } /* default */
.icon-wrapper-lg  { width: 64px; height: 64px; }
```

### 6.5 Illustration Style
Since the UI is clean and minimal, **illustrations are not the primary visual language** — icons and typography carry the weight. If illustrations are needed:

```
Style:         Flat, minimal, geometric
Color palette: Strictly use brand palette (hot pink, blush, white, near-black)
Line weight:   Match icon stroke width (1.5–2px)
Characters:    Friendly, diverse, no specific ethnicity implied
Avoid:         3D renders, photo-realistic, complex gradients, dark themes
Format:        SVG preferred, optimize for < 20KB
```

---

## 7. PHOTOGRAPHY STYLE & TONE

### 7.1 Photography Direction
Since this is an online language course with an instructor named Sarra, photography should feel **personal, warm, and trustworthy** — not stock-photo corporate.

### 7.2 Subject Matter
| Category | Guidelines |
|----------|------------|
| **Instructor (Sarra)** | Natural lighting, warm background, direct eye contact with camera, relaxed and approachable — NOT formal studio pose |
| **Students / Learners** | Diverse Spanish-speaking backgrounds, engaged expressions, realistic learning contexts (laptop, phone, headphones) |
| **Environment** | Home office, café, bright indoor spaces — NOT bland corporate offices |
| **Devices** | Show product UI on device mockups where needed |

### 7.3 Technical Style
```
Color grading:   Warm tones — slight pink/amber shift, not cold/blue
Contrast:        Soft contrast — avoid harsh blacks
Saturation:      Natural to slightly lifted — never desaturated
Composition:     Subject off-center (rule of thirds), breathing room
Background:      Clean, blurred, or color-matched to brand palette
Aspect ratios:   16:9 (hero banners), 1:1 (avatars), 4:3 (cards)
```

### 7.4 Overlay Treatment (when using photo on text)
```css
/* Pink-tinted overlay for text legibility */
.photo-overlay {
  background: linear-gradient(
    180deg,
    rgba(253, 232, 242, 0.0) 0%,
    rgba(253, 232, 242, 0.7) 60%,
    rgba(253, 232, 242, 0.95) 100%
  );
}
```

### 7.5 What to Avoid
- ❌ Cold, blue-tinted photography
- ❌ Generic stock photos (hands on keyboard, fake smiles)
- ❌ Dark or moody photography
- ❌ Photos with heavy text overlaid directly (use overlay treatment)
- ❌ Heavily filtered / Instagram-style effects

---

## 8. VOICE & TONE (Bahasa Komunikasi)

### 8.1 Brand Personality Pillars
| Pillar | Description |
|--------|-------------|
| **Warm** | Berbicara seperti guru yang supportif, bukan robot |
| **Clear** | Kalimat pendek, langsung ke poin, tidak bertele-tele |
| **Encouraging** | Selalu positif terhadap progress, tidak menghakimi |
| **Expert but Human** | Menunjukkan keahlian tanpa terasa intimidating |
| **Culturally aware** | Menghormati latar belakang Spanish speaker |

### 8.2 Tone Spectrum Per Context
| Context | Tone | Contoh |
|---------|------|--------|
| Hero / Landing | Inspiring, confident | "Master English Pronunciation" |
| Onboarding | Warm, welcoming | "Welcome! Let's start your journey." |
| Lesson content | Clear, instructive | "Notice how your tongue placement changes here." |
| Progress / Achievement | Celebratory, encouraging | "Great job! You've completed Section 2." |
| Error / Empty state | Gentle, helpful | "Hmm, something went wrong. Let's try again." |
| CTA buttons | Action-driven, direct | "Start Learning →", "Try This Exercise" |
| Tooltips / Help | Concise, friendly | "Click to hear the pronunciation." |

### 8.3 Language Rules
```
✅ Use "you" / "your" — personal, not distant
✅ Active voice: "Complete the quiz" NOT "The quiz should be completed"
✅ Short sentences: max 20 words per sentence in UI copy
✅ Use contractions: "Let's", "You'll", "It's" — sounds natural
✅ Bilingual labels acceptable: e.g. "Sección 1 / Section 1"
❌ Avoid jargon: "phoneme", "prosody" — explain in plain language
❌ Avoid negative framing: "Don't worry..." → "You've got this!"
❌ Avoid passive voice in CTAs
❌ Avoid exclamation mark overuse (max 1 per screen)
```

### 8.4 Microcopy Examples
| Element | ✅ Use | ❌ Avoid |
|---------|--------|---------|
| Empty state | "No lessons yet — start with Section 1!" | "No data found" |
| Loading | "Getting your lesson ready..." | "Loading..." |
| Error | "Something went wrong. Please try again." | "Error 500" |
| Success | "You did it! Section complete." | "Success" |
| Button | "Start Learning →" | "Submit" |
| Placeholder | "Type your name..." | "Enter value" |

---

## 9. MICRO-INTERACTIONS & ANIMATION

### 9.1 Animation Principles
```
1. PURPOSE — every animation communicates something (state change, attention, feedback)
2. SPEED — fast enough not to block, slow enough to be perceived
3. SUBTLETY — enhance, never distract
4. CONSISTENCY — same element type = same animation
```

### 9.2 Duration & Easing Tokens
```css
/* Durations */
--duration-instant:  100ms;   /* state flips, toggles */
--duration-fast:     150ms;   /* hover in */
--duration-base:     250ms;   /* hover out, most transitions */
--duration-moderate: 350ms;   /* cards, panels appearing */
--duration-slow:     500ms;   /* page sections, hero entrance */
--duration-xslow:    700ms;   /* splash, onboarding */

/* Easing */
--ease-out:      cubic-bezier(0.0, 0.0, 0.2, 1.0);  /* elements entering */
--ease-in:       cubic-bezier(0.4, 0.0, 1.0, 1.0);  /* elements leaving */
--ease-in-out:   cubic-bezier(0.4, 0.0, 0.2, 1.0);  /* position changes */
--ease-spring:   cubic-bezier(0.34, 1.56, 0.64, 1); /* bouncy CTA, success */
--ease-linear:   linear;                              /* progress bars, loaders */
```

### 9.3 Component Interaction Patterns

#### Buttons
```css
/* Primary button hover */
transition: background var(--duration-fast) var(--ease-out),
            box-shadow var(--duration-base) var(--ease-out),
            transform   var(--duration-base) var(--ease-out);
:hover  → translateY(-2px), shadow increase
:active → translateY(0), shadow compress, scale(0.98)
:focus  → box-shadow: var(--shadow-focus)
```

#### Cards
```css
/* Card hover lift */
transition: transform var(--duration-base) var(--ease-out),
            box-shadow var(--duration-base) var(--ease-out),
            border-color var(--duration-fast) var(--ease-out);
:hover → translateY(-4px), --shadow-md, border tint toward primary
```

#### Page Load / Section Entrance
```css
@keyframes fadeSlideUp {
  from {
    opacity:   0;
    transform: translateY(16px);
  }
  to {
    opacity:   1;
    transform: translateY(0);
  }
}

/* Staggered entrance for course section cards */
.section-card:nth-child(1) { animation: fadeSlideUp 500ms var(--ease-out) 0ms   both; }
.section-card:nth-child(2) { animation: fadeSlideUp 500ms var(--ease-out) 80ms  both; }
.section-card:nth-child(3) { animation: fadeSlideUp 500ms var(--ease-out) 160ms both; }
.section-card:nth-child(4) { animation: fadeSlideUp 500ms var(--ease-out) 240ms both; }
```

#### Badge / Label Pulse (for "Professional Course" badge)
```css
@keyframes subtlePulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(233, 30, 140, 0.0); }
  50%       { box-shadow: 0 0 0 6px rgba(233, 30, 140, 0.08); }
}
.badge-professional {
  animation: subtlePulse 3s var(--ease-in-out) infinite;
}
```

#### Progress / Completion (checkmark animation)
```css
@keyframes checkDraw {
  from { stroke-dashoffset: 24; }
  to   { stroke-dashoffset: 0; }
}
.check-icon path {
  stroke-dasharray:  24;
  stroke-dashoffset: 24;
  animation: checkDraw 300ms var(--ease-spring) forwards;
}
```

#### Audio Play Button (ripple effect)
```css
@keyframes audioRipple {
  from { transform: scale(1);   opacity: 0.5; }
  to   { transform: scale(1.8); opacity: 0; }
}
.btn-audio::after {
  content:   '';
  position:  absolute;
  inset:     0;
  border-radius: 50%;
  background: rgba(233, 30, 140, 0.3);
  animation: audioRipple 1.2s var(--ease-out) infinite;
}
```

### 9.4 Reduced Motion
```css
/* Always include — accessibility requirement */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration:   0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration:  0.01ms !important;
    scroll-behavior:      auto !important;
  }
}
```

---

## 10. DARK MODE CONSIDERATION

### 10.1 Strategy
The brand uses a **warm pink-tinted light theme** as default. Dark mode must preserve the brand's pink identity while ensuring legibility and warmth — **NOT a cold, generic dark theme**.

### 10.2 Dark Mode Color Tokens
```css
@media (prefers-color-scheme: dark) {
  :root {
    /* Backgrounds — warm dark, not pure black */
    --color-bg-page:     #1A0F15;   /* Very dark warm plum */
    --color-bg-hero:     #220D1A;   /* Dark pink-tinted hero */
    --color-bg-surface:  #2A1520;   /* Card surfaces */
    --color-bg-card:     #2E1825;   /* Slightly lighter card */
    --color-bg-icon:     #3D1F2E;   /* Icon wrapper dark pink */

    /* Text — inverted hierarchy */
    --color-text-primary:   #F9F0F5;  /* Near white, warm tint */
    --color-text-secondary: #C4A0B4;  /* Muted pink-gray */
    --color-text-muted:     #8B6070;  /* Subdued text */
    --color-text-accent:    #F472B6;  /* Lighter pink for dark bg */

    /* Primary — brighter on dark */
    --color-primary:       #F472B6;   /* Lighter hot pink — readable on dark */
    --color-primary-dark:  #E91E8C;   /* Original pink as "dark" hover */
    --color-primary-light: #FBCFE8;   /* Very light for dark bg badges */

    /* Borders — subtle on dark */
    --color-border:        #3D2030;
    --color-border-strong: #5A2D44;

    /* Shadows — deeper on dark */
    --shadow-sm:  0 1px 3px rgba(0,0,0,0.3);
    --shadow-md:  0 4px 16px rgba(0,0,0,0.4), 0 0 0 1px rgba(244,114,182,0.08);
    --shadow-lg:  0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(244,114,182,0.10);
    --shadow-cta: 0 4px 20px rgba(244,114,182,0.4);

    /* Gradients — dark version */
    --gradient-hero:  linear-gradient(180deg, #220D1A 0%, #1A0F15 60%, #120A10 100%);
    --gradient-card:  linear-gradient(135deg, #2A1520 0%, #2E1825 100%);
  }
}
```

### 10.3 Dark Mode Component Adjustments

| Component | Light Mode | Dark Mode Adjustment |
|-----------|-----------|----------------------|
| **Navbar** | White bg + light border | `#2A1520` bg + `#3D2030` border |
| **Hero** | Blush pink gradient | Warm dark plum gradient |
| **Cards** | White + pink border | `#2A1520` + `#3D2030` border |
| **Primary button** | `#E91E8C` | `#F472B6` (lighter for contrast) |
| **Ghost button** | Pink border + pink text | `#F472B6` border + text |
| **Section labels** | `#E91E8C` text | `#F472B6` text |
| **Icon wrappers** | `#FCE4F0` bg | `#3D1F2E` bg |
| **Badge "Professional"** | White bg + border | `#2E1825` bg + `#3D2030` border |

### 10.4 Manual Toggle (Class-based override)
```css
/* For manual dark mode toggle (ignore system preference) */
[data-theme="dark"]  { /* same vars as @media dark above */ }
[data-theme="light"] { /* force light even if system is dark */ }
```

### 10.5 Dark Mode Agent Rules
```
✅ Always test contrast ratio: text on dark bg must be ≥ 4.5:1 (WCAG AA)
✅ Primary pink MUST be lightened to #F472B6 on dark backgrounds
✅ Dark backgrounds must use warm tones (#1A0F15), never pure black (#000000)
✅ All shadow tokens must be redefined for dark mode (increase opacity)
❌ Never use the light mode pink (#E91E8C) directly on dark bg for body text
❌ Never use pure white (#FFFFFF) as text on dark — use warm near-white (#F9F0F5)
❌ Never invert images or logos — use the white/light variant of the logo mark
```

---

## APPENDIX: AGENT QUICK-REFERENCE CARD

```
BRAND: English Pronunciation Course for Spanish Speakers
─────────────────────────────────────────────────────────
PRIMARY COLOR:    #E91E8C  (Hot Pink)
PRIMARY DARK:     #C2177A  (CTA hover)
PRIMARY LIGHT:    #F472B6  (Dark mode primary)
BG DEFAULT:       #FDF5F8  (Warm off-white)
TEXT PRIMARY:     #1A1A2E
TEXT SECONDARY:   #6B7280
BORDER:           #F3E4EC

FONT DISPLAY:     Plus Jakarta Sans (600, 700, 800)
FONT BODY:        Inter (400, 500, 600)

BASE GRID:        8px
BORDER-RADIUS:    Pill=9999px | Card=16–20px | Badge=8px
TRANSITION:       250ms ease (default)

LOGO MARK:        "S" white on #E91E8C circle, 36×36px
ICON STYLE:       Lucide outline, stroke 1.5px, --icon-md=20px
SHADOW TINT:      Always pink-based rgba(233,30,140,x)
DARK BG:          #1A0F15 (warm dark plum, NOT #000000)
─────────────────────────────────────────────────────────
```

---

*Brand Guidelines Supplement v1.0.0 — fokus 10 aspek yang belum ada*  
*Gunakan bersama `brand-guidelines.md` (v1.0.0)*