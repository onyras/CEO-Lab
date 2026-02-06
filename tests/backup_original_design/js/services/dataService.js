/**
 * CEO Lab Dashboard - Data Service
 * Abstraction layer for all data access
 * Phase 1: Returns mock data
 * Phase 2: Swap internals with Supabase calls - components unchanged
 */

import { mockData, getAssessmentById, getAssessmentHistory, getFrameworksByPillar, getCompletedFrameworks, getRecentActivity, getHighPriorityInsights, getUserProgress } from '../mockData.js';

// Configuration flag - set to false in Phase 2
const USE_MOCK_DATA = true;

/**
 * Data Service API
 * All methods return Promises to match real async API behavior
 */

export const dataService = {
  // ============================================
  // USER METHODS
  // ============================================

  /**
   * Get current user profile
   * @returns {Promise<Object>} User object
   */
  async getUser() {
    if (USE_MOCK_DATA) {
      return Promise.resolve(mockData.user);
    }
    // Phase 2: Replace with Supabase
    // const { data, error } = await supabase.auth.getUser();
    // return data.user;
  },

  /**
   * Update user profile
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object>} Updated user object
   */
  async updateUser(updates) {
    if (USE_MOCK_DATA) {
      Object.assign(mockData.user, updates);
      return Promise.resolve(mockData.user);
    }
    // Phase 2: Replace with Supabase
    // const { data, error } = await supabase
    //   .from('users')
    //   .update(updates)
    //   .eq('id', userId);
    // return data;
  },

  /**
   * Get user statistics
   * @returns {Promise<Object>} User stats object
   */
  async getUserStats() {
    if (USE_MOCK_DATA) {
      return Promise.resolve(mockData.user.stats);
    }
    // Phase 2: Calculate from database
  },

  // ============================================
  // ASSESSMENT METHODS
  // ============================================

  /**
   * Get all available assessments
   * @returns {Promise<Array>} Array of assessment objects
   */
  async getAssessments() {
    if (USE_MOCK_DATA) {
      return Promise.resolve(mockData.assessments);
    }
    // Phase 2: Replace with Supabase
    // const { data, error } = await supabase.from('assessments').select('*');
    // return data;
  },

  /**
   * Get specific assessment by ID
   * @param {string} assessmentId
   * @returns {Promise<Object>} Assessment object
   */
  async getAssessment(assessmentId) {
    if (USE_MOCK_DATA) {
      return Promise.resolve(getAssessmentById(assessmentId));
    }
    // Phase 2: Replace with Supabase
    // const { data, error } = await supabase
    //   .from('assessments')
    //   .select('*')
    //   .eq('id', assessmentId)
    //   .single();
    // return data;
  },

  /**
   * Get user's assessment history
   * @param {string} assessmentId - Optional, filter by assessment
   * @returns {Promise<Array>} Array of history objects
   */
  async getAssessmentHistory(assessmentId = null) {
    if (USE_MOCK_DATA) {
      if (assessmentId) {
        return Promise.resolve(getAssessmentHistory(assessmentId));
      }
      return Promise.resolve(mockData.assessmentHistory);
    }
    // Phase 2: Replace with Supabase
    // let query = supabase
    //   .from('assessment_history')
    //   .select('*')
    //   .eq('user_id', userId);
    // if (assessmentId) {
    //   query = query.eq('assessment_id', assessmentId);
    // }
    // const { data, error } = await query;
    // return data;
  },

  /**
   * Start a new assessment attempt
   * @param {string} assessmentId
   * @returns {Promise<Object>} New history object
   */
  async startAssessment(assessmentId) {
    if (USE_MOCK_DATA) {
      const newHistory = {
        id: `history-${Date.now()}`,
        assessmentId,
        userId: mockData.user.id,
        startedAt: new Date().toISOString(),
        completedAt: null,
        status: 'in_progress',
        currentSection: null,
        answers: {},
        progress: {
          sectionsCompleted: 0,
          totalSections: 0,
          questionsAnswered: 0,
          totalQuestions: 0,
          percentage: 0
        }
      };
      mockData.assessmentHistory.push(newHistory);
      return Promise.resolve(newHistory);
    }
    // Phase 2: Replace with Supabase
    // const { data, error } = await supabase
    //   .from('assessment_history')
    //   .insert({
    //     assessment_id: assessmentId,
    //     user_id: userId,
    //     started_at: new Date().toISOString(),
    //     status: 'in_progress'
    //   });
    // return data;
  },

  /**
   * Save assessment answers
   * @param {string} historyId
   * @param {Object} answers - Section answers
   * @param {Object} progress - Progress tracking
   * @returns {Promise<Object>} Updated history object
   */
  async saveAssessmentAnswers(historyId, answers, progress) {
    if (USE_MOCK_DATA) {
      const history = mockData.assessmentHistory.find(h => h.id === historyId);
      if (history) {
        history.answers = { ...history.answers, ...answers };
        history.progress = progress;
        history.status = progress.percentage === 100 ? 'completed' : 'in_progress';
        if (history.status === 'completed') {
          history.completedAt = new Date().toISOString();
        }
      }
      return Promise.resolve(history);
    }
    // Phase 2: Replace with Supabase
    // const { data, error } = await supabase
    //   .from('assessment_history')
    //   .update({ answers, progress })
    //   .eq('id', historyId);
    // return data;
  },

  /**
   * Complete assessment and save results
   * @param {string} historyId
   * @param {Object} results - Calculated results
   * @returns {Promise<Object>} Updated history object with results
   */
  async completeAssessment(historyId, results) {
    if (USE_MOCK_DATA) {
      const history = mockData.assessmentHistory.find(h => h.id === historyId);
      if (history) {
        history.status = 'completed';
        history.completedAt = new Date().toISOString();
        history.results = results;
      }
      return Promise.resolve(history);
    }
    // Phase 2: Replace with Supabase
    // const { data, error } = await supabase
    //   .from('assessment_history')
    //   .update({
    //     status: 'completed',
    //     completed_at: new Date().toISOString(),
    //     results
    //   })
    //   .eq('id', historyId);
    // return data;
  },

  // ============================================
  // FRAMEWORK METHODS
  // ============================================

  /**
   * Get all frameworks
   * @param {string} pillar - Optional filter by pillar (self/teams/orgs)
   * @returns {Promise<Array>} Array of framework objects
   */
  async getFrameworks(pillar = null) {
    if (USE_MOCK_DATA) {
      if (pillar) {
        return Promise.resolve(getFrameworksByPillar(pillar));
      }
      return Promise.resolve(mockData.frameworks);
    }
    // Phase 2: Replace with Supabase
    // let query = supabase.from('frameworks').select('*');
    // if (pillar) {
    //   query = query.eq('pillar', pillar);
    // }
    // const { data, error } = await query;
    // return data;
  },

  /**
   * Get specific framework by ID
   * @param {string} frameworkId
   * @returns {Promise<Object>} Framework object
   */
  async getFramework(frameworkId) {
    if (USE_MOCK_DATA) {
      return Promise.resolve(mockData.frameworks.find(f => f.id === frameworkId));
    }
    // Phase 2: Replace with Supabase
    // const { data, error } = await supabase
    //   .from('frameworks')
    //   .select('*')
    //   .eq('id', frameworkId)
    //   .single();
    // return data;
  },

  /**
   * Mark framework as completed
   * @param {string} frameworkId
   * @returns {Promise<Object>} Updated framework object
   */
  async markFrameworkComplete(frameworkId) {
    if (USE_MOCK_DATA) {
      const framework = mockData.frameworks.find(f => f.id === frameworkId);
      if (framework) {
        framework.completed = true;
        framework.completedAt = new Date().toISOString();
      }
      return Promise.resolve(framework);
    }
    // Phase 2: Replace with Supabase
    // const { data, error } = await supabase
    //   .from('user_framework_progress')
    //   .upsert({
    //     user_id: userId,
    //     framework_id: frameworkId,
    //     completed: true,
    //     completed_at: new Date().toISOString()
    //   });
    // return data;
  },

  /**
   * Get user's framework progress
   * @returns {Promise<Object>} Progress summary
   */
  async getFrameworkProgress() {
    if (USE_MOCK_DATA) {
      const completed = getCompletedFrameworks().length;
      const total = mockData.frameworks.length;
      return Promise.resolve({
        completed,
        total,
        percentage: Math.round((completed / total) * 100)
      });
    }
    // Phase 2: Calculate from database
  },

  // ============================================
  // ACTIVITY & INSIGHTS METHODS
  // ============================================

  /**
   * Get recent user activity
   * @param {number} limit - Number of items to return
   * @returns {Promise<Array>} Array of activity objects
   */
  async getRecentActivity(limit = 5) {
    if (USE_MOCK_DATA) {
      return Promise.resolve(getRecentActivity(limit));
    }
    // Phase 2: Replace with Supabase
    // const { data, error } = await supabase
    //   .from('user_activity')
    //   .select('*')
    //   .eq('user_id', userId)
    //   .order('timestamp', { ascending: false })
    //   .limit(limit);
    // return data;
  },

  /**
   * Log user activity
   * @param {string} type - Activity type
   * @param {Object} metadata - Additional data
   * @returns {Promise<Object>} Created activity object
   */
  async logActivity(type, metadata) {
    if (USE_MOCK_DATA) {
      const activity = {
        type,
        timestamp: new Date().toISOString(),
        ...metadata
      };
      mockData.weeklyActivity.currentWeek.activities.unshift(activity);
      return Promise.resolve(activity);
    }
    // Phase 2: Replace with Supabase
    // const { data, error } = await supabase
    //   .from('user_activity')
    //   .insert({
    //     user_id: userId,
    //     type,
    //     metadata,
    //     timestamp: new Date().toISOString()
    //   });
    // return data;
  },

  /**
   * Get personalized insights
   * @param {string} priority - Optional filter by priority
   * @returns {Promise<Array>} Array of insight objects
   */
  async getInsights(priority = null) {
    if (USE_MOCK_DATA) {
      if (priority) {
        return Promise.resolve(mockData.insights.filter(i => i.priority === priority));
      }
      return Promise.resolve(mockData.insights);
    }
    // Phase 2: Replace with AI-generated insights
  },

  /**
   * Dismiss an insight
   * @param {string} insightId
   * @returns {Promise<boolean>} Success status
   */
  async dismissInsight(insightId) {
    if (USE_MOCK_DATA) {
      const index = mockData.insights.findIndex(i => i.id === insightId);
      if (index !== -1) {
        mockData.insights.splice(index, 1);
      }
      return Promise.resolve(true);
    }
    // Phase 2: Replace with Supabase
  },

  // ============================================
  // GOALS METHODS
  // ============================================

  /**
   * Get user goals
   * @returns {Promise<Array>} Array of goal objects
   */
  async getGoals() {
    if (USE_MOCK_DATA) {
      return Promise.resolve(mockData.goals);
    }
    // Phase 2: Replace with Supabase
    // const { data, error } = await supabase
    //   .from('user_goals')
    //   .select('*')
    //   .eq('user_id', userId);
    // return data;
  },

  /**
   * Create new goal
   * @param {Object} goal - Goal object
   * @returns {Promise<Object>} Created goal
   */
  async createGoal(goal) {
    if (USE_MOCK_DATA) {
      const newGoal = {
        id: `goal-${Date.now()}`,
        ...goal,
        current: 0,
        percentage: 0
      };
      mockData.goals.push(newGoal);
      return Promise.resolve(newGoal);
    }
    // Phase 2: Replace with Supabase
  },

  /**
   * Update goal progress
   * @param {string} goalId
   * @param {number} current - Current value
   * @returns {Promise<Object>} Updated goal
   */
  async updateGoalProgress(goalId, current) {
    if (USE_MOCK_DATA) {
      const goal = mockData.goals.find(g => g.id === goalId);
      if (goal) {
        goal.current = current;
        goal.percentage = Math.round((current / goal.target) * 100);
        if (goal.percentage >= 100) {
          goal.achieved = true;
          goal.achievedAt = new Date().toISOString();
        }
      }
      return Promise.resolve(goal);
    }
    // Phase 2: Replace with Supabase
  },

  // ============================================
  // WEEKLY METRICS METHODS
  // ============================================

  /**
   * Get current week activity data
   * @returns {Promise<Object>} Weekly activity summary
   */
  async getWeeklyActivity() {
    if (USE_MOCK_DATA) {
      return Promise.resolve(mockData.weeklyActivity.currentWeek);
    }
    // Phase 2: Calculate from database
  },

  /**
   * Update current streak
   * @returns {Promise<number>} Current streak count
   */
  async updateStreak() {
    if (USE_MOCK_DATA) {
      // Simple mock - just return current value
      return Promise.resolve(mockData.user.stats.currentStreak);
    }
    // Phase 2: Calculate based on last login dates
  }
};

// ============================================
// EXPORT DEFAULT
// ============================================

export default dataService;
