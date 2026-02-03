# CEO Lab - Design System

**Purpose:** This document defines reusable components and patterns for CEO Lab. ALL sections must use these components—no custom inline styling.

**Design Philosophy:** MIT professor meets Buddhist monk. Rigorous but warm. Spacious and calm.

---

## Color Palette

### Primary Colors
```css
--ceo-navy: #0A1628        /* Deep navy - primary text, dark backgrounds */
--ceo-white: #FFFFFF       /* Pure white - cards, buttons */
--ceo-gold: #D4AF37        /* Soft gold - accents, CTAs, emphasis */
--ceo-off-white: #F8F9FA   /* Off-white - alternating section backgrounds */
--ceo-gray-light: #E8E9EB  /* Light gray - subtle borders */
--ceo-gray: #6B7280        /* Medium gray - supporting text */
```

### Usage Guidelines
- **Navy:** Primary text color, hero headlines, dark section backgrounds
- **Gold:** Section titles, CTAs, emphasis words, hover states
- **White:** Card backgrounds, button text, light section backgrounds
- **Off-white:** Alternating section backgrounds (creates rhythm without contrast)
- **Gray:** Body text, descriptions, subtle UI elements

### NK Brand Colors (Legacy - Keep for Reference)
```css
--nk-blue: #7FABC8
--nk-green: #A6BEA4
--nk-yellow: #C6A55B
--nk-orange: #E08F6A
--nk-lilac: #C7B9D3
```

---

## Typography

### Font Families
- **Serif:** Crimson Pro (headlines, pull quotes, large text)
- **Sans-serif:** DM Sans (body text, UI elements, navigation)

### Hierarchy

**Section Title (Uppercase Label)**
```css
font-family: DM Sans
font-size: 12px
font-weight: 600
text-transform: uppercase
letter-spacing: 1.5px
color: var(--ceo-gold)
```
Example: "INTRODUCING CEO LAB"

**Section Subtitle (Main Headline)**
```css
font-family: Crimson Pro
font-size: 48px
font-weight: 400 /* lighter for elegance */
line-height: 1.2
color: var(--ceo-navy)
```
Use `<em>` for emphasis words (colored gold)

**Body Text**
```css
font-size: 18px
line-height: 1.8
color: var(--ceo-navy)
max-width: 800px /* for readability */
```

**Supporting Text**
```css
font-size: 15px
color: var(--ceo-gray)
```

---

## Spacing Standards

### Section Padding
- **Standard:** `padding: 120px 0;` (generous whitespace)
- **Large:** `padding: 160px 0;` (hero, final CTA)
- **Mobile:** Use `clamp(60px, 10vw, 120px)` for responsive padding

### Container Max-Width
- **Default:** `max-width: 1200px;`
- **Narrow:** `max-width: 900px;` (prose sections, testimonials)
- **Wide:** `max-width: 1400px;` (dimension grids)

### Grid Gaps
- **Card grids:** `gap: 32px;`
- **Dimension groups:** `gap: 80px;` (vertical spacing between groups)

---

## Component Patterns

### Section Structure

**Standard Section (White Background)**
```html
<section class="section">
  <div class="container">
    <p class="section__title">SECTION LABEL</p>
    <h2 class="section__subtitle">Main Headline <em>with Gold Emphasis</em></h2>
    <p class="section__description">Short supporting text.</p>

    <!-- Content here -->
  </div>
</section>
```

**Off-White Section (Alternating Background)**
```html
<section class="section section--off-white">
  <!-- Same structure -->
</section>
```

**Dark Section (Navy Background)**
```html
<section class="section section--dark">
  <!-- Same structure, text automatically white -->
</section>
```

---

### Card Components

**Feature Card (Minimal)**
```html
<div class="assessment-card">
  <div class="assessment-card__content">
    <h3 class="assessment-card__title">Card Title</h3>
    <p class="assessment-card__desc">Short description. 1-2 sentences max.</p>
  </div>
</div>
```
- Subtle gray border
- Gold border on hover
- No colorful variants (uniform aesthetic)

**Dimension Card**
```html
<div class="dimension-card">
  <div class="dimension-card__number">01</div>
  <h4 class="dimension-card__title">Energy Management</h4>
  <p class="dimension-card__desc">Protecting time for high-value deep work vs. reactive firefighting</p>
</div>
```
- Bottom border only (minimal)
- Gold number
- One line description

**Step Card**
```html
<div class="step-card">
  <div class="step-card__number">1</div>
  <h3 class="step-card__title">Assess</h3>
  <p class="step-card__desc">Complete your baseline assessment</p>
</div>
```
- Circular number badge
- Navy background with gold text
- Center-aligned

---

### Prose Section

```html
<div class="prose">
  <p>Professional athletes review game footage...</p>
  <p>You're running a company...</p>
  <p>Most CEOs operate without a scoreboard...</p>
</div>
```
- Max-width 800px
- Generous line height (1.8)
- First paragraph slightly larger/bolder

---

### Pull Quote

```html
<blockquote class="pull-quote">
  "You can't improve what you don't measure. And guessing isn't good enough anymore."
</blockquote>
```
- Serif font, italic, 32px
- Gold top/bottom borders
- Center-aligned
- Max-width 800px

---

### Testimonial

```html
<div class="testimonial">
  <p class="testimonial__quote">
    "Before CEO Lab, I was making decisions based on anxiety, not data..."
  </p>
  <div class="testimonial__author">Sarah Chen</div>
  <div class="testimonial__role">Founder & CEO, Series A SaaS (40-person team)</div>
</div>
```
- White card on navy background
- Large serif quote with gold opening mark
- Max-width 900px, centered

---

### Buttons

**Primary CTA (Gold)**
```html
<a href="#" class="btn-primary">
  Take the Free Assessment
</a>
```
```css
background: var(--ceo-gold)
color: white
padding: 16px 32px
border-radius: 8px
font-weight: 600
```

**Secondary CTA (Outline)**
```html
<a href="#" class="btn-secondary">
  Book a Demo Call
</a>
```
```css
background: transparent
color: var(--ceo-navy)
border: 2px solid var(--ceo-navy)
padding: 16px 32px
```

---

## Layout Patterns

### Grid Layouts

**Feature Grid (3-column)**
```css
.assessment-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 32px;
}
```

**Dimension Grid (2-column)**
```css
.dimension-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 32px;
}
```

**Step Grid (3-column)**
```css
.step-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 48px;
}
```

---

## Interaction Guidelines

### Hover States
- **Cards:** Subtle lift (`translateY(-2px)`), gold border
- **Buttons:** Darken background, minimal lift
- **Links:** Underline on hover only

### Animations
- **Minimal:** Fade-ins only, no complex animations
- **Duration:** 0.2s ease (quick, professional)
- **Avoid:** Parallax, sliding, rotating, complex transitions

### Accessibility
- **Contrast:** Minimum WCAG AA (4.5:1 for body text)
- **Focus states:** Visible keyboard navigation
- **Alt text:** Required for all images
- **Semantic HTML:** Proper heading hierarchy

---

## Background Alternation Pattern

1. Hero - White
2. Problem - Off-white
3. Solution - White
4. 18 Dimensions - Off-white
5. How It Works - White
6. Social Proof - Navy (dramatic contrast)
7. Pricing - White
8. Final CTA - Off-white

Creates visual rhythm without harsh transitions.

---

## Component Rules

### DO:
✓ Use generous whitespace (120px+ section padding)
✓ Keep colors minimal (navy, gold, white, gray)
✓ Use serif for headlines, sans for body
✓ Make CTAs prominent with gold
✓ Use subtle hover states
✓ Maintain visual hierarchy
✓ Keep cards minimal (subtle borders)

### DON'T:
✗ Use Monaco monospace or terminal aesthetic
✗ Use colorful card borders (blue, green, orange, etc.)
✗ Add complex animations or transitions
✗ Use tight spacing (feels cramped)
✗ Use all caps for body text
✗ Create one-off custom styles
✗ Use gradients or shadows heavily

---

## Design Checklist

Before launching a new section:

1. **Spacing:** Does it have generous padding (120px+)?
2. **Typography:** Is hierarchy clear (uppercase label → serif headline → body)?
3. **Colors:** Using only navy, gold, white, gray?
4. **Cards:** Subtle borders, gold on hover?
5. **Whitespace:** Does it feel spacious and calm?
6. **Consistency:** Following existing patterns?
7. **Accessibility:** Meets WCAG AA contrast ratios?
8. **Mobile:** Responsive without breaking?

---

## Vibe Check

**Does it feel like:**
- A well-designed clinic? (Immediate trust)
- MIT professor meets Buddhist monk? (Rigorous but warm)
- Room to breathe? (Spacious, calm)
- Professional but approachable? (Not cold, not playful)

**Red flags:**
- Feels cluttered or busy
- Colors feel playful or casual
- Typography feels trendy or gimmicky
- Spacing feels cramped
- Too many visual elements competing

---

## Next Steps

When creating new sections:
1. Choose section background (white, off-white, or navy)
2. Add section title (uppercase, gold)
3. Add section subtitle (serif, navy, with gold emphasis)
4. Add supporting text if needed (1-2 sentences max)
5. Use appropriate card pattern from this system
6. Verify spacing is generous (120px+ padding)
7. Check mobile responsiveness

**If you need custom styling, you're breaking the system. Rethink the approach.**
