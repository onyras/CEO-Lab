# CEO Lab - Brand Guidelines

**Last Updated:** 2026-02-20

This document defines the official CEO Lab branding extracted from the live landing page.

---

## Color Palette

### Background Colors
```css
--bg-primary: #F7F3ED        /* Warm beige/cream - main page background */
--bg-white: #FFFFFF          /* White - card and section backgrounds */
--bg-dark: #000000           /* Pure black - dark sections and CTAs */
```

### Text Colors
```css
--text-primary: black        /* Primary text color */
--text-secondary: black/70   /* Secondary text (70% opacity) */
--text-muted: black/60       /* Muted text (60% opacity) */
--text-supporting: black/50  /* Supporting/small text (50% opacity) */
```

### NK Brand Accent Colors
```css
--nk-blue: #7FABC8          /* Blue - "Leading Yourself" accents */
--nk-green: #A6BEA4         /* Green - "Leading Teams" accents */
--nk-orange: #E08F6A        /* Orange - "Leading Organizations" accents */
```

### UI Elements
```css
--border-color: black/10     /* Subtle borders (10% opacity) */
--cta-bg: #000000           /* Primary CTA background */
--cta-text: #FFFFFF         /* Primary CTA text */
--cta-hover: black/90       /* CTA hover state (90% opacity) */
```

---

## Typography

### Font Family
```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif
```
- **Primary:** Inter (all weights)
- Clean, modern, highly readable at all sizes

### Font Weights (Nova-style)
- `font-bold` (700) - Main headlines
- `font-semibold` (600) - Subheadings, CTAs
- `font-medium` (500) - Navigation, button text
- `font-normal` (400) - Body text, descriptions

### Font Sizes (Nova-inspired)

**Hero Headline:**
```css
text-[48px] md:text-[52px] lg:text-[56px]
leading-[1.1]
tracking-tight
font-bold
```
Example: "A measurement system for your leadership development"

**Hero Subtitle:**
```css
text-base md:text-lg (16-18px)
leading-relaxed
font-normal
opacity-60
```
Example: "CEO Lab tracks your growth across 18 leadership dimensions..."

**Section Headlines:**
```css
text-3xl md:text-4xl (30-36px)
leading-tight
font-bold
```

**Card/Subsection Titles:**
```css
text-lg md:text-xl (18-20px)
font-semibold
```

**Body Text:**
```css
text-base (16px)
leading-relaxed
font-normal
```

**Button Text:**
```css
text-base (16px)
font-semibold
```

**Small Text / Supporting:**
```css
text-sm (14px)
font-normal
opacity-50-70
```
Example: "Also available for Teams & Organizations"

**Section Labels (Dashboard):**
```css
font-mono text-sm (14px)
uppercase
tracking-[0.12em]
text-black/50
```
Example: "YOUR OVERALL SCORE"

**Micro Labels (Charts Only):**
```css
text-xs (12px) — only inside SVGs and data visualizations
```

---

## Component Patterns

### Primary CTA Button
```html
<Link href="#" className="bg-black text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-black/90 transition-colors">
  Button Text
</Link>
```

### Secondary CTA Button
```html
<Link href="#" className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white/10 transition-colors">
  Button Text
</Link>
```

### Section Header Pattern
```html
<h2 className="text-4xl md:text-5xl font-bold text-black text-center mb-6">
  Section Title
</h2>
```

### Card Pattern
```html
<div className="bg-white p-8 rounded-lg">
  <h3 className="text-2xl font-bold text-black mb-3">Card Title</h3>
  <p className="text-black/60 mb-4">Card description</p>
</div>
```

---

## Color Usage Guidelines

### Section Backgrounds (Alternating Pattern)
1. Hero - `#F7F3ED` (beige)
2. Problem - `#FFFFFF` (white)
3. Solution - `#F7F3ED` (beige)
4. 18 Dimensions - `#FFFFFF` (white)
5. How It Works - `#F7F3ED` (beige)
6. Social Proof - `#FFFFFF` (white)
7. Pricing - `#F7F3ED` (beige)
8. Final CTA - `#000000` (black)

### Text Color Hierarchy
- **Headlines:** `text-black` (full opacity)
- **Body text:** `text-black/70` (readable, slightly softer)
- **Descriptions:** `text-black/60` (supporting information)
- **Section labels:** `text-black/50` (monospace uppercase labels)
- **Small print:** `text-black/50` (de-emphasized)
- **Minimum contrast:** `text-black/35` (absolute floor — nothing below this)

### Accent Color Usage
- **Blue (#7FABC8):** "Leading Yourself" territory indicators
- **Green (#A6BEA4):** "Leading Teams" territory indicators
- **Orange (#E08F6A):** "Leading Organizations" territory indicators
- Used sparingly as border accents, not for backgrounds

---

## Layout Standards

### Container Max-Width
```css
max-w-7xl    /* Navigation, footer */
max-w-6xl    /* Hero, dimensions grid */
max-w-5xl    /* Solution, how it works */
max-w-4xl    /* Problem, testimonials, pricing */
```

### Section Padding
```css
py-20        /* Standard section vertical padding */
px-8         /* Standard horizontal padding */
```

### Grid Patterns
```css
/* 2-column grid */
grid md:grid-cols-2 gap-8

/* 3-column grid */
grid md:grid-cols-3 gap-12
```

---

## Interaction States

### Hover Effects
- **Buttons:** `hover:bg-black/90` (slightly lighter)
- **Links:** `hover:text-black` (from muted to full opacity)
- **Borders:** `hover:border-black` (from subtle to visible)

### Transitions
```css
transition-colors    /* For color changes */
transition-all       /* For multi-property changes */
```

---

## Design Principles

1. **Simple & Clean:** Black text on white/beige, minimal color
2. **High Contrast:** Strong hierarchy with opacity variations
3. **Warm & Professional:** Beige background softens the black/white
4. **Accent Colors Sparingly:** NK colors used only for territory markers
5. **No Gradients:** Flat colors throughout
6. **Sharp & Clear:** Bold typography, clear CTAs

---

## Do's and Don'ts

### DO:
✓ Use beige (#F7F3ED) and white alternating backgrounds
✓ Keep text black with opacity variations for hierarchy
✓ Use black for primary CTAs
✓ Reserve NK colors (blue/green/orange) for territory accents only
✓ Use rounded corners (rounded-lg) for cards and buttons
✓ Maintain high contrast for accessibility

### DON'T:
✗ Add custom font families without updating this doc
✗ Use gold or navy colors (those were incorrect)
✗ Use NK accent colors for large backgrounds
✗ Mix too many colors - keep it minimal
✗ Create low-contrast text combinations
✗ Override the clean, simple aesthetic

---

## Quick Reference

**Main Palette:**
- Background: `#F7F3ED` or `#FFFFFF`
- Text: `black` with opacity variants
- CTAs: `black` background, `white` text
- Accents: `#7FABC8`, `#A6BEA4`, `#E08F6A`

**Typography:**
- Font: Inter (all text)
- Hero: `text-[48px] md:text-[52px] lg:text-[56px]` bold
- Subtitle: `text-base md:text-lg` normal, 60% opacity
- Sections: `text-3xl md:text-4xl` bold
- Body: `text-base` normal
- Buttons: `text-base` semibold
- Small: `text-sm` normal, 50-70% opacity
- Section labels: `font-mono text-sm` uppercase, `tracking-[0.12em]`, 50% opacity
- Micro (charts only): `text-xs`, never below `text-black/35`

**Spacing:**
- Sections: `py-20`
- Cards: `p-8`
- Buttons: `px-8 py-4`
- Gaps: `gap-8` or `gap-12`

---

**END OF BRAND GUIDELINES**
