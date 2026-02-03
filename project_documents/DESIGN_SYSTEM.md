# CEO Lab - Design System

**Purpose:** This document defines reusable components and patterns. ALL sections must use these components—no custom inline styling.

---

## Section Structure

### Standard Section
```html
<section class="section">
    <div class="container">
        <p class="section__title">> ceo-lab --[command]</p>
        <h2 class="section__subtitle">Main Headline <em>with Emphasis</em></h2>
        <p class="section__description">Short supporting text. One sentence max.</p>

        <!-- Content here -->
    </div>
</section>
```

### Dark Section
```html
<section class="section section--dark">
    <!-- Same structure as above -->
</section>
```

---

## Card Components

### Assessment Card
```html
<div class="assessment-grid">
    <a href="#" class="assessment-card assessment-card--blue">
        <div class="assessment-card__image">
            <img src="..." alt="...">
        </div>
        <div class="assessment-card__content">
            <h3 class="assessment-card__title">Card Title</h3>
            <p class="assessment-card__desc">Short description. 1-2 sentences max.</p>
            <span class="assessment-card__time">8 min</span>
        </div>
    </a>
</div>
```

**Available colors:**
- `assessment-card--blue`
- `assessment-card--green`
- `assessment-card--orange`
- `assessment-card--yellow`
- `assessment-card--purple`

---

## Typography Hierarchy

### Headings
- **section__title**: Terminal command style ("> ceo-lab --command")
- **section__subtitle**: Main headline (use `<em>` for emphasis words)
- **section__description**: Supporting text (1 sentence, max 20 words)
- **assessment-card__title**: Card headline
- **assessment-card__desc**: Card description (1-2 sentences, max 30 words total)

### Text Guidelines
- **Titles do the work** - they should be punchy and clear on their own
- **Body text supports** - it should NOT be the main message
- **Default max:** 1-2 sentences per text block
- **If you need more:** You're doing it wrong. Rethink the structure.

---

## Layout Patterns

### Grid Layouts
```html
<!-- 3-column grid -->
<div class="assessment-grid">
    <!-- Cards here -->
</div>

<!-- 2-column grid -->
<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 32px;">
    <!-- Content here -->
</div>
```

---

## Color Usage

### Brand Colors (CSS variables)
- `var(--nk-blue)` - #7FABC8
- `var(--nk-green)` - #A6BEA4
- `var(--nk-lilac)` - #C7B9D3
- Primary background: #F7F3ED (light mode)
- Primary text: #000000

### Card Color Mapping
- Blue: Self-leadership, focus, clarity
- Green: Teams, growth, progress
- Orange: Strategy, decision-making
- Yellow: Trust, relationships
- Purple: Insights, reflection

---

## Spacing Standards

### Section Padding
- Standard section: `padding: 80px 0;`
- Large section: `padding: 120px 0;`

### Container Max-Width
- Default: `max-width: 1200px;`
- Narrow: `max-width: 900px;` (for text-heavy sections)

### Grid Gaps
- Card grids: `gap: 32px;`
- Content grids: `gap: 24px;`

---

## Component Rules

### DO:
✓ Use existing classes (section, section__title, assessment-card, etc.)
✓ Keep text minimal (titles = 3-5 words, descriptions = 1-2 sentences)
✓ Use established color palette
✓ Follow grid patterns
✓ Make cards stand out with clear hierarchy

### DON'T:
✗ Create custom inline styles (use classes)
✗ Write paragraphs of text (use punchy titles instead)
✗ Use colors outside the brand palette
✗ Create one-off component variations
✗ Make supporting text the main message

---

## Next Steps

When creating new sections:
1. Choose a section type (standard or dark)
2. Add section__title (terminal command)
3. Add section__subtitle (punchy, 3-5 words)
4. Add section__description (1 sentence support)
5. Use assessment-card grid for content
6. Keep ALL text minimal

**If you need custom styling, you're breaking the system. Rethink the approach.**
