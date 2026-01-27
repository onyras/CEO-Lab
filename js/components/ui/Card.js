/**
 * CEO Lab Dashboard - Card Component
 * Reusable card container used throughout the dashboard
 */

/**
 * Card Component
 * Creates a styled card element with optional variants
 *
 * @param {Object} options - Card configuration
 * @param {string} options.variant - Card style variant ('default', 'elevated', 'interactive', 'bordered')
 * @param {string} options.padding - Padding size ('sm', 'md', 'lg')
 * @param {string} options.className - Additional CSS classes
 * @param {string} options.onClick - Click handler for interactive cards
 * @param {string} options.ariaLabel - Accessibility label
 * @returns {HTMLElement} Card element
 */
export class Card {
  constructor(options = {}) {
    this.options = {
      variant: 'default',
      padding: 'md',
      className: '',
      onClick: null,
      ariaLabel: null,
      ...options
    };

    this.element = this.create();
  }

  /**
   * Create the card element
   * @returns {HTMLElement}
   */
  create() {
    const card = document.createElement('div');
    card.className = this.buildClassName();

    if (this.options.ariaLabel) {
      card.setAttribute('aria-label', this.options.ariaLabel);
    }

    if (this.options.onClick) {
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      card.addEventListener('click', this.options.onClick);
      card.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.options.onClick(e);
        }
      });
    }

    return card;
  }

  /**
   * Build CSS class names based on options
   * @returns {string}
   */
  buildClassName() {
    const classes = ['card'];

    // Add variant class
    if (this.options.variant !== 'default') {
      classes.push(`card--${this.options.variant}`);
    }

    // Add padding class
    classes.push(`card--padding-${this.options.padding}`);

    // Add custom classes
    if (this.options.className) {
      classes.push(this.options.className);
    }

    return classes.join(' ');
  }

  /**
   * Set card content
   * @param {string|HTMLElement} content
   */
  setContent(content) {
    if (typeof content === 'string') {
      this.element.innerHTML = content;
    } else if (content instanceof HTMLElement) {
      this.element.innerHTML = '';
      this.element.appendChild(content);
    }
  }

  /**
   * Append content to card
   * @param {string|HTMLElement} content
   */
  appendContent(content) {
    if (typeof content === 'string') {
      this.element.insertAdjacentHTML('beforeend', content);
    } else if (content instanceof HTMLElement) {
      this.element.appendChild(content);
    }
  }

  /**
   * Get the card element
   * @returns {HTMLElement}
   */
  getElement() {
    return this.element;
  }

  /**
   * Destroy the card
   */
  destroy() {
    if (this.options.onClick) {
      this.element.removeEventListener('click', this.options.onClick);
    }
    this.element.remove();
  }
}

/**
 * Helper function to create a simple card
 * @param {string} content - HTML content
 * @param {Object} options - Card options
 * @returns {HTMLElement}
 */
export function createCard(content, options = {}) {
  const card = new Card(options);
  card.setContent(content);
  return card.getElement();
}

/**
 * Create a card with header and body sections
 * @param {Object} config
 * @param {string} config.title - Card title
 * @param {string} config.subtitle - Optional subtitle
 * @param {string} config.body - Body content
 * @param {string} config.footer - Optional footer content
 * @param {Object} config.options - Card options
 * @returns {HTMLElement}
 */
export function createStructuredCard(config) {
  const { title, subtitle, body, footer, options = {} } = config;

  const card = new Card(options);

  // Build header
  let headerHTML = '';
  if (title || subtitle) {
    headerHTML = `
      <div class="card__header">
        ${title ? `<h3 class="card__title">${title}</h3>` : ''}
        ${subtitle ? `<p class="card__subtitle text-muted">${subtitle}</p>` : ''}
      </div>
    `;
  }

  // Build body
  const bodyHTML = body ? `<div class="card__body">${body}</div>` : '';

  // Build footer
  const footerHTML = footer ? `<div class="card__footer">${footer}</div>` : '';

  card.setContent(headerHTML + bodyHTML + footerHTML);
  return card.getElement();
}

/**
 * Create a card with icon
 * @param {Object} config
 * @param {string} config.icon - Icon (emoji or SVG)
 * @param {string} config.title - Card title
 * @param {string} config.description - Description text
 * @param {string} config.action - Optional action button HTML
 * @param {Object} config.options - Card options
 * @returns {HTMLElement}
 */
export function createIconCard(config) {
  const { icon, title, description, action, options = {} } = config;

  const card = new Card({ ...options, variant: 'interactive' });

  const html = `
    <div class="card__icon">${icon}</div>
    <div class="card__content">
      <h4 class="card__title">${title}</h4>
      ${description ? `<p class="card__description text-muted">${description}</p>` : ''}
      ${action ? `<div class="card__action">${action}</div>` : ''}
    </div>
  `;

  card.setContent(html);
  return card.getElement();
}

/**
 * Create a stat card with metric display
 * @param {Object} config
 * @param {string} config.label - Stat label
 * @param {string|number} config.value - Stat value
 * @param {string} config.change - Optional change indicator (+5%)
 * @param {string} config.icon - Optional icon
 * @param {Object} config.options - Card options
 * @returns {HTMLElement}
 */
export function createStatCard(config) {
  const { label, value, change, icon, options = {} } = config;

  const card = new Card({ ...options, variant: 'bordered' });

  const html = `
    <div class="stat-card">
      ${icon ? `<div class="stat-card__icon">${icon}</div>` : ''}
      <div class="stat-card__content">
        <div class="stat-card__value">${value}</div>
        <div class="stat-card__label text-muted">${label}</div>
        ${change ? `<div class="stat-card__change">${change}</div>` : ''}
      </div>
    </div>
  `;

  card.setContent(html);
  return card.getElement();
}

export default Card;
