# CEO Lab - Component Design System

**Last Updated:** 2026-02-06
**Aligned to:** `design/BRAND.md` (canonical source for colors/fonts)
**Replaces:** DESIGN_SYSTEM.md (archived at `archive/DESIGN_SYSTEM_v1_navy_gold.md`)

**Purpose:** Reusable components and patterns for CEO Lab. ALL sections must use these components — no custom inline styling.

**Design Philosophy:** MIT professor meets Buddhist monk. Rigorous but warm. Spacious and calm.

---

## Color Palette (from BRAND.md)

### Backgrounds
```css
--bg-primary: #F7F3ED        /* Warm beige/cream - main page background */
--bg-white: #FFFFFF          /* White - card and section backgrounds */
--bg-dark: #000000           /* Pure black - dark sections and CTAs */
```

### Text
```css
--text-primary: black        /* Primary text color */
--text-secondary: black/70   /* Secondary text */
--text-muted: black/60       /* Supporting text */
--text-supporting: black/50  /* Small print */
```

### Territory Accents
```css
--nk-blue: #7FABC8          /* Leading Yourself */
--nk-green: #A6BEA4         /* Leading Teams */
--nk-orange: #E08F6A        /* Leading Organizations */
```

### UI
```css
--border-color: black/10     /* Subtle borders */
--cta-bg: #000000           /* Primary CTA background */
--cta-text: #FFFFFF         /* Primary CTA text */
```

---

## Typography (from BRAND.md)

### Font Family
```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif
```
Inter for ALL text. No serif fonts, no secondary font families.

### Hierarchy
- **Hero headline:** `text-[48px] md:text-[52px] lg:text-[56px]` bold, tracking-tight
- **Section headlines:** `text-3xl md:text-4xl` bold
- **Card titles:** `text-lg md:text-xl` semibold
- **Body text:** `text-base (16px)` normal, leading-relaxed
- **Button text:** `text-base` semibold
- **Small/supporting:** `text-sm (14px)` normal, opacity 40-60%

---

## Section Backgrounds (Alternating)

1. Hero — `#F7F3ED` (beige)
2. Problem — `#FFFFFF` (white)
3. Solution — `#F7F3ED` (beige)
4. Dimensions — `#FFFFFF` (white)
5. How It Works — `#F7F3ED` (beige)
6. Social Proof — `#FFFFFF` (white)
7. Pricing — `#F7F3ED` (beige)
8. Final CTA — `#000000` (black)

---

## Component Patterns

### Section Structure
```html
<section className="py-20 px-8 bg-[#F7F3ED]">
  <div className="max-w-6xl mx-auto">
    <h2 className="text-4xl md:text-5xl font-bold text-black text-center mb-6">
      Section Title
    </h2>
    <p className="text-black/60 text-center max-w-2xl mx-auto mb-12">
      Supporting description.
    </p>
    <!-- Content -->
  </div>
</section>
```

### Card Pattern
```html
<div className="bg-white p-8 rounded-lg">
  <h3 className="text-2xl font-bold text-black mb-3">Card Title</h3>
  <p className="text-black/60 mb-4">Card description. 1-2 sentences max.</p>
</div>
```

### Primary CTA Button
```html
<Link className="bg-black text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-black/90 transition-colors">
  Button Text
</Link>
```

### Secondary CTA Button
```html
<Link className="border-2 border-black text-black px-8 py-4 rounded-lg text-lg font-semibold hover:bg-black/5 transition-colors">
  Button Text
</Link>
```

### Dimension Card
```html
<div className="border border-black/10 p-6 rounded-lg hover:border-black/30 transition-colors">
  <div className="text-sm font-semibold text-black/40 mb-1">01</div>
  <h4 className="text-lg font-semibold text-black mb-2">Self-Awareness</h4>
  <p className="text-black/60 text-sm">Recognizing patterns before they run you</p>
</div>
```

### Score Card (Dashboard)
```html
<div className="bg-white p-6 rounded-lg border border-black/10">
  <div className="text-sm text-black/50 mb-1">Leading Yourself</div>
  <div className="text-3xl font-bold text-black">72%</div>
  <div className="w-full bg-black/5 rounded-full h-2 mt-3">
    <div className="bg-[#7FABC8] h-2 rounded-full" style="width: 72%"></div>
  </div>
</div>
```

---

## Spacing Standards

### Section Padding
```css
py-20         /* Standard vertical (80px) */
px-8          /* Standard horizontal */
```

### Container Max-Width
```css
max-w-7xl     /* Navigation, footer */
max-w-6xl     /* Hero, dimension grids */
max-w-5xl     /* Solution, how it works */
max-w-4xl     /* Problem, testimonials, pricing */
```

### Grid Patterns
```css
grid md:grid-cols-2 gap-8      /* 2-column */
grid md:grid-cols-3 gap-12     /* 3-column */
```

---

## Interaction Guidelines

### Hover States
- **Cards:** Border darkens from black/10 to black/30
- **Buttons:** `hover:bg-black/90` (slightly lighter)
- **Links:** `hover:text-black` (from muted to full opacity)

### Transitions
```css
transition-colors    /* Standard for color changes */
```

### Animations
- Fade-ins only. No complex animations.
- Duration: 0.2s ease

---

## Rules

### DO:
- Use beige (#F7F3ED) and white alternating backgrounds
- Keep text black with opacity variations for hierarchy
- Use black for primary CTAs
- Reserve NK colors (blue/green/orange) for territory accents only
- Use rounded-lg for cards and buttons
- Maintain high contrast for accessibility (WCAG AA)

### DON'T:
- Use navy or gold colors (those were the old incorrect design system)
- Use serif fonts (Crimson Pro was the old system)
- Use colorful card borders or backgrounds
- Add complex animations or transitions
- Create one-off custom styles
- Use gradients or heavy shadows

---

## Vibe Check

**Does it feel like:**
- A well-designed clinic? (Immediate trust)
- MIT professor meets Buddhist monk? (Rigorous but warm)
- Room to breathe? (Spacious, calm)
- Professional but approachable? (Not cold, not playful)

**If you need custom styling, you're breaking the system. Rethink the approach.**
