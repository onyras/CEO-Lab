/**
 * CEO Lab Dashboard - The Konstantin Method
 */

import dataService from './services/dataService.js';

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', async () => {
  await initDashboard();
  setupEventListeners();
});

// ============================================
// DASHBOARD INITIALIZATION
// ============================================

async function initDashboard() {
  try {
    // Load user data
    const user = await dataService.getUser();

    // Update UI
    updateUserName(user);

  } catch (error) {
    console.error('Error initializing dashboard:', error);
  }
}

// ============================================
// USER INFO
// ============================================

function updateUserName(user) {
  const nameElement = document.getElementById('userName');
  if (nameElement) {
    nameElement.textContent = user.firstName;
  }
}

// ============================================
// EVENT LISTENERS
// ============================================

function setupEventListeners() {
  // User menu dropdown
  const userMenuBtn = document.getElementById('userMenuBtn');
  const userContainer = userMenuBtn?.parentElement;

  if (userMenuBtn && userContainer) {
    userMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      userContainer.classList.toggle('nav__user--open');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!userContainer.contains(e.target)) {
        userContainer.classList.remove('nav__user--open');
      }
    });
  }
}
