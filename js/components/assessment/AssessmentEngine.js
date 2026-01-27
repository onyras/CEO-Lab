/**
 * CEO Lab Dashboard - Assessment Engine
 * Generic assessment logic for all 5 assessments
 * Handles Likert scale questions, progression, scoring, and results
 */

import dataService from '../../services/dataService.js';

/**
 * Assessment Engine Class
 * Manages the entire assessment lifecycle
 */
export class AssessmentEngine {
  constructor(config) {
    this.config = config; // Assessment-specific configuration
    this.historyId = null;
    this.currentSectionIndex = 0;
    this.answers = {};
    this.state = 'not_started'; // not_started, in_progress, completed

    this.init();
  }

  /**
   * Initialize the assessment engine
   */
  async init() {
    // Load existing progress if resuming
    const history = await dataService.getAssessmentHistory(this.config.assessmentId);
    const inProgress = history.find(h => h.status === 'in_progress');

    if (inProgress) {
      this.historyId = inProgress.id;
      this.answers = inProgress.answers || {};
      this.currentSectionIndex = this.findCurrentSection();
      this.state = 'in_progress';
    }
  }

  /**
   * Find current section index based on answers
   * @returns {number}
   */
  findCurrentSection() {
    const sections = this.config.sections;
    for (let i = 0; i < sections.length; i++) {
      const sectionId = sections[i].id;
      if (!this.answers[sectionId] || this.answers[sectionId].length === 0) {
        return i;
      }
    }
    return sections.length - 1; // Last section
  }

  /**
   * Start the assessment
   * @returns {Promise<string>} History ID
   */
  async start() {
    if (!this.historyId) {
      const history = await dataService.startAssessment(this.config.assessmentId);
      this.historyId = history.id;
    }
    this.state = 'in_progress';
    await dataService.logActivity('assessment_started', {
      assessmentId: this.config.assessmentId,
      historyId: this.historyId
    });
    return this.historyId;
  }

  /**
   * Get current section
   * @returns {Object} Section configuration
   */
  getCurrentSection() {
    return this.config.sections[this.currentSectionIndex];
  }

  /**
   * Get total number of sections
   * @returns {number}
   */
  getTotalSections() {
    return this.config.sections.length;
  }

  /**
   * Get progress percentage
   * @returns {number} Percentage (0-100)
   */
  getProgress() {
    const total = this.getTotalQuestions();
    const answered = this.getAnsweredQuestions();
    return Math.round((answered / total) * 100);
  }

  /**
   * Get total number of questions across all sections
   * @returns {number}
   */
  getTotalQuestions() {
    return this.config.sections.reduce((total, section) => {
      return total + section.questions.length;
    }, 0);
  }

  /**
   * Get number of answered questions
   * @returns {number}
   */
  getAnsweredQuestions() {
    return Object.values(this.answers).reduce((total, sectionAnswers) => {
      return total + (sectionAnswers ? sectionAnswers.filter(a => a !== null).length : 0);
    }, 0);
  }

  /**
   * Render current section questions
   * @param {HTMLElement} container - Container element
   */
  renderSection(container) {
    const section = this.getCurrentSection();
    const sectionAnswers = this.answers[section.id] || [];

    container.innerHTML = `
      <div class="assessment-section">
        <div class="assessment-section__header">
          <h2 class="font-heading">${this.config.name} - Section ${this.currentSectionIndex + 1} of ${this.getTotalSections()}</h2>
          <h3 class="text-muted">${section.name}</h3>
        </div>

        <div class="assessment-questions">
          ${section.questions.map((question, index) => this.renderQuestion(question, index, sectionAnswers[index])).join('')}
        </div>

        <div class="assessment-section__nav">
          ${this.currentSectionIndex > 0 ? `
            <button class="btn btn-secondary" data-action="prev">
              ← Previous Section
            </button>
          ` : '<div></div>'}

          <button class="btn btn-primary" data-action="next" ${!this.isSectionComplete() ? 'disabled' : ''}>
            ${this.isLastSection() ? 'Complete Assessment' : 'Next Section'} →
          </button>
        </div>
      </div>
    `;

    this.attachEventListeners(container);
  }

  /**
   * Render a single question with Likert scale
   * @param {string} question - Question text
   * @param {number} index - Question index
   * @param {number} currentAnswer - Current answer value (1-5)
   * @returns {string} HTML
   */
  renderQuestion(question, index, currentAnswer = null) {
    const scaleLabels = ['Rarely', 'Occasionally', 'Sometimes', 'Often', 'Always'];
    const questionId = `q-${this.currentSectionIndex}-${index}`;

    return `
      <div class="question" data-question-index="${index}">
        <div class="question__number text-xs text-uppercase text-muted">
          Question ${index + 1} of ${this.getCurrentSection().questions.length}
        </div>
        <div class="question__text">
          ${question}
        </div>

        <div class="question__scale">
          ${[1, 2, 3, 4, 5].map(value => `
            <div class="scale-option">
              <input
                type="radio"
                name="${questionId}"
                id="${questionId}-${value}"
                value="${value}"
                ${currentAnswer === value ? 'checked' : ''}
                class="scale-option__input"
              />
              <label for="${questionId}-${value}" class="scale-option__label">
                <span class="scale-option__circle"></span>
                <span class="scale-option__text-top">${scaleLabels[value - 1]}</span>
                <span class="scale-option__text-bottom">${value}</span>
              </label>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  /**
   * Attach event listeners to the rendered section
   * @param {HTMLElement} container
   */
  attachEventListeners(container) {
    // Radio button changes
    const radios = container.querySelectorAll('input[type="radio"]');
    radios.forEach(radio => {
      radio.addEventListener('change', (e) => {
        const questionIndex = parseInt(e.target.closest('.question').dataset.questionIndex);
        const value = parseInt(e.target.value);
        this.saveAnswer(questionIndex, value);
      });
    });

    // Navigation buttons
    const prevBtn = container.querySelector('[data-action="prev"]');
    const nextBtn = container.querySelector('[data-action="next"]');

    if (prevBtn) {
      prevBtn.addEventListener('click', () => this.previousSection(container));
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => this.nextSection(container));
    }
  }

  /**
   * Save answer for current question
   * @param {number} questionIndex
   * @param {number} value
   */
  async saveAnswer(questionIndex, value) {
    const section = this.getCurrentSection();
    if (!this.answers[section.id]) {
      this.answers[section.id] = [];
    }
    this.answers[section.id][questionIndex] = value;

    // Auto-save to data service
    const progress = {
      sectionsCompleted: this.getCompletedSections(),
      totalSections: this.getTotalSections(),
      questionsAnswered: this.getAnsweredQuestions(),
      totalQuestions: this.getTotalQuestions(),
      percentage: this.getProgress()
    };

    await dataService.saveAssessmentAnswers(this.historyId, this.answers, progress);

    // Update navigation button state
    this.updateNavigationState();
  }

  /**
   * Update navigation button enabled/disabled state
   */
  updateNavigationState() {
    const nextBtn = document.querySelector('[data-action="next"]');
    if (nextBtn) {
      nextBtn.disabled = !this.isSectionComplete();
    }
  }

  /**
   * Check if current section is complete
   * @returns {boolean}
   */
  isSectionComplete() {
    const section = this.getCurrentSection();
    const sectionAnswers = this.answers[section.id] || [];
    return sectionAnswers.length === section.questions.length &&
           sectionAnswers.every(a => a !== null && a !== undefined);
  }

  /**
   * Get number of completed sections
   * @returns {number}
   */
  getCompletedSections() {
    return this.config.sections.filter(section => {
      const sectionAnswers = this.answers[section.id] || [];
      return sectionAnswers.length === section.questions.length;
    }).length;
  }

  /**
   * Check if on last section
   * @returns {boolean}
   */
  isLastSection() {
    return this.currentSectionIndex === this.config.sections.length - 1;
  }

  /**
   * Go to previous section
   * @param {HTMLElement} container
   */
  previousSection(container) {
    if (this.currentSectionIndex > 0) {
      this.currentSectionIndex--;
      this.renderSection(container);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  /**
   * Go to next section or complete assessment
   * @param {HTMLElement} container
   */
  async nextSection(container) {
    if (!this.isSectionComplete()) {
      this.showToast('Please answer all questions before continuing');
      return;
    }

    if (this.isLastSection()) {
      await this.complete();
    } else {
      this.currentSectionIndex++;
      this.renderSection(container);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  /**
   * Calculate results based on answers
   * @returns {Object} Results object
   */
  calculateResults() {
    const results = {
      totalScore: 0,
      maxScore: 0,
      percentage: 0,
      breakdown: {}
    };

    // Calculate section scores
    this.config.sections.forEach(section => {
      const sectionAnswers = this.answers[section.id] || [];
      const sectionScore = sectionAnswers.reduce((sum, answer) => sum + answer, 0);
      const maxSectionScore = section.questions.length * 5;

      results.breakdown[section.id] = {
        score: sectionScore,
        maxScore: maxSectionScore,
        percentage: Math.round((sectionScore / maxSectionScore) * 100)
      };

      results.totalScore += sectionScore;
      results.maxScore += maxSectionScore;
    });

    results.percentage = Math.round((results.totalScore / results.maxScore) * 100);

    // Apply assessment-specific scoring logic
    if (this.config.calculateCustomResults) {
      Object.assign(results, this.config.calculateCustomResults(this.answers, results));
    }

    return results;
  }

  /**
   * Complete the assessment
   */
  async complete() {
    const results = this.calculateResults();
    await dataService.completeAssessment(this.historyId, results);
    await dataService.logActivity('assessment_completed', {
      assessmentId: this.config.assessmentId,
      historyId: this.historyId,
      score: results.totalScore
    });

    this.state = 'completed';

    // Navigate to results page
    window.location.href = `/assessment-results.html?id=${this.historyId}`;
  }

  /**
   * Show toast notification
   * @param {string} message
   */
  showToast(message) {
    // Simple toast implementation
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('toast--show');
    }, 10);

    setTimeout(() => {
      toast.classList.remove('toast--show');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  /**
   * Destroy the engine and clean up
   */
  destroy() {
    this.answers = {};
    this.currentSectionIndex = 0;
    this.state = 'not_started';
  }
}

export default AssessmentEngine;
