# CEO Lab Templates

Modular HTML components for the CEO Lab website.

## Directory Structure

```
templates/
├── README.md                      # This file
├── nav.html                       # Navigation bar
├── footer.html                    # Site footer
├── hero.html                      # Hero section
├── section-header.html            # Section title/subtitle
├── how-card.html                  # "How It Works" step card
├── tool-card.html                 # Feature/tool card
├── pricing-card.html              # Pricing tier card
├── testimonial-card.html          # Customer testimonial
├── dashboard-chart.html           # Progress chart
├── pillar-card.html               # Pillar score card
├── dashboard-action-card.html     # Dashboard quick action
├── notification-item.html         # Notification list item
├── cta-section.html               # Call-to-action section
└── buttons.html                   # Button styles reference
```

## Component Categories

### 1. Global Components
**Used on every page**
- `nav.html` - Top navigation with mobile menu
- `footer.html` - Site footer with links

### 2. Landing Page Components
**For marketing pages (index, product, etc.)**
- `hero.html` - Hero section with headline + CTA
- `section-header.html` - Section titles with command-line aesthetic
- `how-card.html` - Step-by-step process cards
- `tool-card.html` - Feature showcase cards
- `pricing-card.html` - Pricing tier cards (Free, Pro, Premium)
- `testimonial-card.html` - Customer testimonials
- `cta-section.html` - Conversion sections

### 3. Dashboard Components
**For member area**
- `dashboard-chart.html` - 6-month progress chart
- `pillar-card.html` - Individual pillar scores
- `dashboard-action-card.html` - Quick action cards
- `notification-item.html` - Notification list items

### 4. UI Elements
**Reusable elements**
- `buttons.html` - All button variations

---

## Usage Guide

### How to Use Templates

Each template file contains:
1. **HTML structure** - Ready to copy/paste
2. **Customization variables** - Documented in comments
3. **Example content** - Shows how it should look

### Integration Approaches

#### Option 1: Manual Copy/Paste
```html
<!-- Copy from template and paste into your page -->
<div class="tool-card">
    <!-- Customize content here -->
</div>
```

#### Option 2: Server-Side Includes (SSI)
```html
<!--#include file="templates/nav.html" -->
```

#### Option 3: JavaScript Template System
```javascript
fetch('templates/nav.html')
    .then(response => response.text())
    .then(html => {
        document.getElementById('nav-container').innerHTML = html;
    });
```

#### Option 4: Build System (Recommended for Production)
Use a static site generator like:
- **11ty (Eleventy)** - Simple, uses Nunjucks
- **Hugo** - Fast, uses Go templates
- **Astro** - Modern, component-based

---

## Customization Variables

Each template lists variables to customize at the top:

```html
<!-- Hero Section Module -->
<!-- Variables to customize:
    - hero__pretitle: Command-line style prefix text
    - hero__title: Main headline (use <em> for italics)
    - hero__subtitle: Subheadline text
    - btn-link: CTA button link
    - btn-text: CTA button text
-->
```

---

## Grid Layouts

### How It Works Grid
```html
<div class="how-it-works-grid">
    <!-- Add 3 how-card.html modules -->
</div>
```

### Tools Grid
```html
<div class="tools-grid">
    <!-- Add 4+ tool-card.html modules -->
</div>
```

### Pricing Grid
```html
<div class="pricing-grid">
    <!-- Add 3 pricing-card.html modules (Free, Pro, Premium) -->
</div>
```

### Testimonials Grid
```html
<div class="testimonial-grid">
    <!-- Add 3+ testimonial-card.html modules -->
</div>
```

### Dashboard Pillars
```html
<div class="dashboard-preview__pillars">
    <!-- Add 3 pillar-card.html modules -->
</div>
```

### Quick Actions Grid
```html
<div class="quick-actions">
    <!-- Add 4 dashboard-action-card.html modules -->
</div>
```

---

## NK Brand Standards

### Typography
```css
--font-heading: 'Crimson Pro', serif;
--font-body: 'DM Sans', sans-serif;
```

### Colors
```css
--primary-bg: #F7F3ED;       /* Off-white background */
--text-primary: #000000;     /* Black text */
--text-secondary: #666666;   /* Gray text */
--accent-blue: #7FABC8;      /* Primary accent */
--accent-green: #A6BEA4;     /* Secondary accent */
--border: #E0DDD6;           /* Border color */
--white: #FFFFFF;            /* White */
--success: #4CAF50;          /* Green (positive trends) */
--warning: #FF9800;          /* Orange (due dates) */
```

### Command-Line Aesthetic
Always use this format for section titles:
```html
<p class="section__title">> ceo-lab --[command]</p>
```

Examples:
- `> ceo-lab --track`
- `> ceo-lab --how`
- `> ceo-lab --pricing`
- `> ceo-lab --features`
- `> ceo-lab --proof`

---

## Page Templates

### Landing Page Structure
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <!-- Meta, fonts, styles -->
</head>
<body>
    <!-- nav.html -->
    <!-- hero.html -->
    <!-- how-it-works section -->
    <!-- dashboard-preview section -->
    <!-- features section -->
    <!-- pricing section -->
    <!-- testimonials section -->
    <!-- cta-section.html -->
    <!-- footer.html -->
</body>
</html>
```

### Dashboard Structure
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <!-- Meta, fonts, styles -->
</head>
<body>
    <header class="header">
        <!-- Dashboard nav (different from public nav) -->
    </header>

    <main class="container">
        <section class="welcome">
            <!-- Greeting -->
        </section>

        <section class="progress-card">
            <!-- dashboard-chart.html -->
        </section>

        <section class="quick-actions">
            <!-- 4x dashboard-action-card.html -->
        </section>

        <section class="notifications">
            <!-- notification-item.html -->
        </section>
    </main>
</body>
</html>
```

---

## Responsive Breakpoints

```css
/* Mobile First */
@media (max-width: 480px) {
    /* Mobile styles */
}

@media (max-width: 768px) {
    /* Tablet styles */
}

@media (min-width: 769px) {
    /* Desktop styles */
}
```

All grids automatically stack on mobile using `grid-template-columns: repeat(auto-fit, minmax(Xpx, 1fr))`.

---

## Assets Required

### Images
```
assets/
├── images/
│   ├── nk_logo.png                    # NK logo
│   ├── assessments/
│   │   ├── ceo-test.svg
│   │   ├── zone-of-genius.svg
│   │   ├── five-drivers.svg
│   │   └── trust-formula.svg
│   ├── tools/
│   │   ├── beautiful-mind.svg
│   │   ├── frameworks-library.svg
│   │   ├── progress-dashboard.svg
│   │   └── ai-analysis.svg
│   └── newsletter/
│       ├── deep-work.svg
│       └── building-trust.svg
```

### Fonts
- **Crimson Pro** - Google Fonts (headings)
- **DM Sans** - Google Fonts (body)

### Icons
- All icons use inline SVG (no external icon library needed)

---

## Next Steps

### To Build a New Page:
1. Copy page structure from this README
2. Include `nav.html` and `footer.html`
3. Add relevant section modules
4. Customize content variables
5. Test responsive behavior

### To Add a New Component:
1. Create new `.html` file in `templates/`
2. Add documentation comments at top
3. Include example usage
4. Update this README
5. Add to appropriate category

---

## Questions?

**Email:** nikolas@forchiefs.com
**Website:** nikolaskonstantin.com

Built with vanilla HTML/CSS/JS following NK brand guidelines.
