// Konstantin Method Dashboard - Advanced Interactive Version
// Features: Dynamic data loading, modals, what-if scenarios, peer comparison

// ========================================
// Data Management
// ========================================

let peerOverlayEnabled = false;
let historicalComparisonEnabled = false;

// Embedded data (inline to avoid CORS issues when opening directly)
const dashboardData = {
  "user": {
    "id": "user_001",
    "name": "Sarah Chen",
    "email": "sarah@techco.com",
    "role": "CEO",
    "company": {
      "name": "TechCo",
      "stage": "Series A",
      "team_size": 22,
      "industry": "SaaS"
    },
    "completed_at": "2026-02-04T10:30:00Z",
    "confidence_score": 94
  },
  "current_assessment": {
    "id": "assessment_008",
    "date": "2026-02-04",
    "overall_score": 76,
    "percentile": 84,
    "delta_30d": 4,
    "territories": {
      "self": {
        "score": 81,
        "subdimensions": {
          "energy": 88,
          "resilience": 82,
          "strategy": 79,
          "time": 84,
          "focus": 85,
          "renewal": 72
        }
      },
      "teams": {
        "score": 74,
        "subdimensions": {
          "hiring": 76,
          "delegation": 68,
          "feedback": 71,
          "meetings": 80,
          "culture": 75,
          "motivation": 74
        }
      },
      "organizations": {
        "score": 73,
        "subdimensions": {
          "vision": 83,
          "execution": 67,
          "systems": 70,
          "decisions": 77,
          "communication": 75,
          "scaling": 71
        }
      }
    },
    "readiness": 82,
    "strain": 34,
    "consistency": 78,
    "archetype": {
      "name": "The Focused Operator",
      "description": "You excel at personal discipline and driving clarity, but can over-index on doing vs. delegating. Strong vision paired with execution gaps suggests you're ready to scale through others."
    },
    "blind_spot": {
      "name": "Delegation Reluctance",
      "description": "Your high energy and focus make you effective at execution, but delegation scores reveal a 16-point gap. This is costing you ~12 hours/week that could be spent on strategic work.",
      "impact_hours": 12,
      "impact_cost": 48000
    },
    "growth_edge": {
      "name": "Systems Builder",
      "description": "Your vision clarity (83) + decision speed (77) position you perfectly to build repeatable systems. Focus here unlocks organizational scale without personal burnout."
    }
  },
  "historical_assessments": [
    {"id": "assessment_001", "date": "2025-11-12", "overall_score": 72, "territories": { "self": 77, "teams": 71, "organizations": 69 }},
    {"id": "assessment_002", "date": "2025-11-19", "overall_score": 73, "territories": { "self": 78, "teams": 71, "organizations": 70 }},
    {"id": "assessment_003", "date": "2025-11-26", "overall_score": 73, "territories": { "self": 78, "teams": 72, "organizations": 70 }},
    {"id": "assessment_004", "date": "2025-12-03", "overall_score": 74, "territories": { "self": 79, "teams": 72, "organizations": 71 }},
    {"id": "assessment_005", "date": "2025-12-10", "overall_score": 74, "territories": { "self": 79, "teams": 72, "organizations": 71 }},
    {"id": "assessment_006", "date": "2025-12-17", "overall_score": 75, "territories": { "self": 80, "teams": 73, "organizations": 72 }},
    {"id": "assessment_007", "date": "2026-01-07", "overall_score": 75, "territories": { "self": 80, "teams": 73, "organizations": 72 }},
    {"id": "assessment_008", "date": "2026-02-04", "overall_score": 76, "territories": { "self": 81, "teams": 74, "organizations": 73 }}
  ],
  "trendlines": {
    "readiness": [75, 76, 78, 79, 80, 79, 81, 80, 82, 83, 82, 82],
    "strain": [42, 40, 38, 35, 36, 34, 33, 35, 34, 32, 33, 34],
    "consistency": [70, 72, 73, 74, 75, 76, 75, 77, 78, 77, 78, 78],
    "weeks": ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8", "W9", "W10", "W11", "W12"]
  },
  "question_drivers": [
    {
      "rank": 1,
      "title": "Deep work hours per week",
      "cluster": "Energy + Focus cluster (8 questions)",
      "score": 88,
      "leverage": "High leverage: Maintain 15+ hours/week to sustain 85+ scores",
      "questions": [
        { "id": 12, "text": "How many hours of uninterrupted deep work do you achieve weekly?", "answer": 5, "weight": 1.2 },
        { "id": 13, "text": "Do you block time for strategic thinking?", "answer": 5, "weight": 1.0 }
      ]
    },
    {
      "rank": 2,
      "title": "Strategic clarity and communication",
      "cluster": "Vision + Communication cluster (12 questions)",
      "score": 83,
      "leverage": "High leverage: Monthly all-hands increases this 8-10 points",
      "questions": [
        { "id": 67, "text": "Is your company vision clear and documented?", "answer": 5, "weight": 1.3 },
        { "id": 68, "text": "Can every team member articulate the vision?", "answer": 4, "weight": 1.1 }
      ]
    },
    {
      "rank": 3,
      "title": "Delegation and ownership clarity",
      "cluster": "Delegation cluster (9 questions)",
      "score": 68,
      "leverage": "Critical leverage: Biggest bottleneck—fixing adds 12 hrs/week",
      "questions": [
        { "id": 34, "text": "Do you delegate strategic work, not just tactical tasks?", "answer": 2, "weight": 1.4 },
        { "id": 35, "text": "Do you have clear ownership documentation?", "answer": 3, "weight": 1.2 },
        { "id": 36, "text": "How often do you review what could be delegated?", "answer": 2, "weight": 1.1 }
      ]
    }
  ],
  "benchmark": {
    "mean": 68,
    "median": 71,
    "std_dev": 9.2,
    "p10": 55,
    "p25": 63,
    "p50": 71,
    "p75": 78,
    "p90": 82,
    "p95": 86,
    "sample_size": 2847,
    "filters": {
      "role": "CEO",
      "stage": ["Seed", "Series A", "Series B"],
      "team_size": "10-50"
    }
  },
  "peer_comparison": {
    "overall": {
      "you": 76,
      "peer_median": 71,
      "peer_top10": 82,
      "your_percentile": 84
    },
    "territories": {
      "self": { "you": 81, "peer": 74, "diff": 7 },
      "teams": { "you": 74, "peer": 72, "diff": 2 },
      "organizations": { "you": 73, "peer": 69, "diff": 4 }
    }
  },
  "ai_insights": [
    {
      "id": "insight_001",
      "title": "Your meetings are structured, but your delegation isn't",
      "description": "Meeting discipline (80) is 12 points higher than delegation (68). You've systematized how you gather input but not how you distribute work. This asymmetry creates bottlenecks.",
      "confidence": 0.92,
      "impact": "high",
      "action": "Create a delegation review ritual (like your meeting cadence)"
    },
    {
      "id": "insight_002",
      "title": "Vision clarity without execution rigor is creating team confusion",
      "description": "Your vision score (83) outpaces execution systems (67) by 16 points—the largest gap in your profile. Teams know where to go but not how to get there reliably.",
      "confidence": 0.89,
      "impact": "high",
      "action": "Document your top 5 processes as simple checklists"
    },
    {
      "id": "insight_003",
      "title": "You're a 'high output, low recovery' leader",
      "description": "Energy (88) and Focus (85) are peak, but Renewal (72) lags. This 16-point spread predicts burnout risk within 6-9 months without intervention.",
      "confidence": 0.87,
      "impact": "critical",
      "action": "Block 1 hour daily for recovery (non-negotiable)"
    }
  ],
  "leverage_matrix": [
    { "dimension": "Energy", "impact": 90, "control": 85, "territory": "self" },
    { "dimension": "Focus", "impact": 85, "control": 90, "territory": "self" },
    { "dimension": "Time", "impact": 75, "control": 80, "territory": "self" },
    { "dimension": "Renewal", "impact": 70, "control": 75, "territory": "self" },
    { "dimension": "Delegation", "impact": 85, "control": 60, "territory": "teams" },
    { "dimension": "Feedback", "impact": 75, "control": 70, "territory": "teams" },
    { "dimension": "Hiring", "impact": 70, "control": 75, "territory": "teams" },
    { "dimension": "Motivation", "impact": 65, "control": 65, "territory": "teams" },
    { "dimension": "Execution", "impact": 90, "control": 50, "territory": "organizations" },
    { "dimension": "Systems", "impact": 85, "control": 55, "territory": "organizations" },
    { "dimension": "Vision", "impact": 80, "control": 80, "territory": "organizations" },
    { "dimension": "Communication", "impact": 70, "control": 60, "territory": "organizations" }
  ]
};

// Load data on page load
function loadDashboardData() {
  // Data is now embedded, so just initialize
  setTimeout(() => {
    initializeDashboard();
  }, 500);
}

// Initialize all dashboard components
function initializeDashboard() {
  // Hide loading screen
  setTimeout(() => {
    document.getElementById('loadingScreen').classList.add('hidden');
  }, 800);

  // Populate hero section
  document.getElementById('userName').textContent = dashboardData.user.name;
  document.getElementById('completionDate').textContent = new Date(dashboardData.current_assessment.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  document.getElementById('confidenceScore').textContent = dashboardData.user.confidence_score + '%';

  // Populate score card
  document.getElementById('overallScore').textContent = dashboardData.current_assessment.overall_score;
  document.getElementById('percentile').textContent = `${dashboardData.current_assessment.percentile}th Percentile`;
  const delta = dashboardData.current_assessment.delta_30d;
  const deltaEl = document.getElementById('delta30d');
  deltaEl.textContent = `${delta > 0 ? '+' : ''}${delta} pts last 30 days`;
  deltaEl.className = `delta ${delta >= 0 ? 'positive' : 'negative'}`;

  // Draw rings
  drawRing('readinessRing', dashboardData.current_assessment.readiness, '#7FABC8');
  drawRing('strainRing', dashboardData.current_assessment.strain, '#D4A574');
  drawRing('consistencyRing', dashboardData.current_assessment.consistency, '#8FB996');

  // Populate territories
  populateTerritories();

  // Populate heatmap
  populateHeatmap();

  // Draw radar
  drawRadarChart();

  // Populate AI insights
  populateAIInsights();

  // Populate question drivers
  populateQuestionDrivers();

  // Draw trends
  drawTrendsChart();

  // Draw leverage matrix
  drawLeverageMatrix();

  // Populate footer
  document.getElementById('footerDate').textContent = new Date(dashboardData.current_assessment.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  document.getElementById('sampleSize').textContent = dashboardData.benchmark.sample_size.toLocaleString();

  // Setup event listeners
  setupEventListeners();
}

// ========================================
// Territory Cards with Dynamic Content
// ========================================

function populateTerritories() {
  const container = document.getElementById('territoryCards');
  const territories = [
    { name: 'Leading Yourself', key: 'self', color: '#7FABC8' },
    { name: 'Leading Teams', key: 'teams', color: '#8FB996' },
    { name: 'Leading Organizations', key: 'organizations', color: '#D4A574' }
  ];

  territories.forEach(territory => {
    const data = dashboardData.current_assessment.territories[territory.key];
    const card = document.createElement('div');
    card.className = 'territory-card';
    card.innerHTML = `
      <div class="territory-header">
        <h3>${territory.name}</h3>
        <span class="territory-score">${data.score}</span>
      </div>
      <div class="progress-bar">
        <div class="progress-fill" data-percent="${data.score}" style="width: ${data.score}%; background: ${territory.color};"></div>
      </div>
      <p class="territory-insight">${getInsightForTerritory(territory.key, data.score)}</p>
    `;
    container.appendChild(card);
  });
}

function getInsightForTerritory(key, score) {
  const insights = {
    self: 'Strong self-management with excellent energy and focus discipline. Consider deeper renewal practices.',
    teams: 'Solid team leadership. Delegation and feedback could unlock 15% more capacity with targeted improvement.',
    organizations: 'Vision clarity is high. Execution systems need refinement to match your strategic ambition.'
  };
  return insights[key];
}

// ========================================
// Heatmap Population
// ========================================

function populateHeatmap() {
  const container = document.getElementById('heatmapContainer');
  const territories = [
    { name: 'Leading Yourself', key: 'self' },
    { name: 'Leading Teams', key: 'teams' },
    { name: 'Leading Organizations', key: 'organizations' }
  ];

  territories.forEach(territory => {
    const group = document.createElement('div');
    group.className = 'heatmap-group';

    const title = document.createElement('h3');
    title.className = 'heatmap-group-title';
    title.textContent = territory.name;
    group.appendChild(title);

    const cells = document.createElement('div');
    cells.className = 'heatmap-cells';

    const data = dashboardData.current_assessment.territories[territory.key];
    Object.entries(data.subdimensions).forEach(([dim, score]) => {
      const cell = document.createElement('div');
      cell.className = `heatmap-cell ${getScoreClass(score)}`;
      cell.innerHTML = `
        <div class="cell-name">${capitalize(dim)}</div>
        <div class="cell-score">${score}</div>
        <div class="cell-note">${getNoteForScore(score)}</div>
      `;
      cell.onclick = () => openDimensionModal(capitalize(dim), score, territory.name);
      cells.appendChild(cell);
    });

    group.appendChild(cells);
    container.appendChild(group);
  });
}

function getScoreClass(score) {
  if (score >= 80) return 'score-high';
  if (score >= 70) return 'score-medium';
  return 'score-low';
}

function getNoteForScore(score) {
  if (score >= 80) return 'Excellent performance';
  if (score >= 70) return 'Good, room to grow';
  return 'High leverage area';
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// ========================================
// AI Insights Population
// ========================================

function populateAIInsights() {
  const container = document.getElementById('aiInsights');
  dashboardData.ai_insights.forEach((insight, index) => {
    const card = document.createElement('div');
    card.className = 'insight-card-small';
    card.innerHTML = `
      <div class="insight-number">0${index + 1}</div>
      <div class="confidence-badge">${Math.round(insight.confidence * 100)}% confidence</div>
      <h4>${insight.title}</h4>
      <p>${insight.description}</p>
    `;
    container.appendChild(card);
  });
}

// ========================================
// Question Drivers Population
// ========================================

function populateQuestionDrivers() {
  const container = document.getElementById('driversContainer');
  dashboardData.question_drivers.forEach(driver => {
    const item = document.createElement('div');
    item.className = 'driver-item';
    item.innerHTML = `
      <div class="driver-rank">${driver.rank}</div>
      <div class="driver-content">
        <h4>${driver.title}</h4>
        <p class="driver-cluster">${driver.cluster}</p>
        <div class="driver-leverage">${driver.leverage}</div>
      </div>
      <div class="driver-score">${driver.score}</div>
    `;
    item.onclick = () => openDriverModal(driver);
    container.appendChild(item);
  });
}

// ========================================
// Ring Charts
// ========================================

function drawRing(canvasId, value, color) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const radius = 70;
  const lineWidth = 16;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Background ring
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.05)';
  ctx.lineWidth = lineWidth;
  ctx.stroke();

  // Value ring (animated)
  const startAngle = -Math.PI / 2;
  const endAngle = startAngle + (2 * Math.PI * value / 100);

  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, startAngle, endAngle);
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.lineCap = 'round';
  ctx.stroke();
}

// ========================================
// Radar Chart with Peer Overlay
// ========================================

function drawRadarChart() {
  const canvas = document.getElementById('radarChart');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const radius = 180;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const labels = ['Leading Yourself', 'Leading Teams', 'Leading Organizations'];
  const values = [
    dashboardData.current_assessment.territories.self.score,
    dashboardData.current_assessment.territories.teams.score,
    dashboardData.current_assessment.territories.organizations.score
  ];
  const numPoints = values.length;

  // Draw background web
  const levels = 5;
  for (let i = 1; i <= levels; i++) {
    const levelRadius = (radius / levels) * i;
    ctx.beginPath();

    for (let j = 0; j <= numPoints; j++) {
      const angle = (Math.PI * 2 / numPoints) * j - Math.PI / 2;
      const x = centerX + levelRadius * Math.cos(angle);
      const y = centerY + levelRadius * Math.sin(angle);

      if (j === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }

    ctx.closePath();
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  // Draw axes
  for (let i = 0; i < numPoints; i++) {
    const angle = (Math.PI * 2 / numPoints) * i - Math.PI / 2;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);

    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(x, y);
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.15)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  // Draw peer overlay if enabled
  if (peerOverlayEnabled) {
    const peerValues = [
      dashboardData.peer_comparison.territories.self.peer,
      dashboardData.peer_comparison.territories.teams.peer,
      dashboardData.peer_comparison.territories.organizations.peer
    ];

    ctx.beginPath();
    for (let i = 0; i <= numPoints; i++) {
      const index = i % numPoints;
      const angle = (Math.PI * 2 / numPoints) * index - Math.PI / 2;
      const value = peerValues[index];
      const distance = (radius / 100) * value;
      const x = centerX + distance * Math.cos(angle);
      const y = centerY + distance * Math.sin(angle);

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.closePath();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  // Draw value polygon
  ctx.beginPath();
  for (let i = 0; i <= numPoints; i++) {
    const index = i % numPoints;
    const angle = (Math.PI * 2 / numPoints) * index - Math.PI / 2;
    const value = values[index];
    const distance = (radius / 100) * value;
    const x = centerX + distance * Math.cos(angle);
    const y = centerY + distance * Math.sin(angle);

    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.closePath();
  ctx.fillStyle = 'rgba(127, 171, 200, 0.2)';
  ctx.fill();
  ctx.strokeStyle = '#7FABC8';
  ctx.lineWidth = 3;
  ctx.stroke();

  // Draw points
  for (let i = 0; i < numPoints; i++) {
    const angle = (Math.PI * 2 / numPoints) * i - Math.PI / 2;
    const value = values[i];
    const distance = (radius / 100) * value;
    const x = centerX + distance * Math.cos(angle);
    const y = centerY + distance * Math.sin(angle);

    ctx.beginPath();
    ctx.arc(x, y, 6, 0, 2 * Math.PI);
    ctx.fillStyle = '#7FABC8';
    ctx.fill();
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  // Draw labels
  ctx.font = '600 14px Inter';
  ctx.fillStyle = '#000';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const labelRadius = radius + 40;

  ctx.fillText('Leading Yourself', centerX, centerY - labelRadius);

  const angle1 = (Math.PI * 2 / numPoints) * 1 - Math.PI / 2;
  const x1 = centerX + labelRadius * Math.cos(angle1);
  const y1 = centerY + labelRadius * Math.sin(angle1);
  ctx.fillText('Leading Teams', x1, y1);

  const angle2 = (Math.PI * 2 / numPoints) * 2 - Math.PI / 2;
  const x2 = centerX + labelRadius * Math.cos(angle2);
  const y2 = centerY + labelRadius * Math.sin(angle2);
  ctx.fillText('Leading Organizations', x2, y2);

  // Draw score labels
  ctx.font = '700 16px Inter';
  ctx.fillStyle = '#7FABC8';

  for (let i = 0; i < numPoints; i++) {
    const angle = (Math.PI * 2 / numPoints) * i - Math.PI / 2;
    const value = values[i];
    const distance = (radius / 100) * value;
    const x = centerX + (distance + 25) * Math.cos(angle);
    const y = centerY + (distance + 25) * Math.sin(angle);

    ctx.fillText(value, x, y);
  }
}

// ========================================
// Trends Chart
// ========================================

function drawTrendsChart() {
  const canvas = document.getElementById('trendsChart');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const padding = 60;
  const chartWidth = canvas.width - padding * 2;
  const chartHeight = canvas.height - padding * 2;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const trendData = dashboardData.trendlines;
  const weeks = trendData.weeks;
  const numPoints = weeks.length;
  const stepX = chartWidth / (numPoints - 1);

  function getY(value) {
    return canvas.height - padding - (chartHeight * value / 100);
  }

  // Draw grid lines
  for (let i = 0; i <= 5; i++) {
    const y = padding + (chartHeight / 5) * i;
    ctx.beginPath();
    ctx.moveTo(padding, y);
    ctx.lineTo(canvas.width - padding, y);
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  // Draw lines
  function drawLine(data, color, label) {
    ctx.beginPath();
    for (let i = 0; i < numPoints; i++) {
      const x = padding + stepX * i;
      const y = getY(data[i]);

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.stroke();

    // Draw points
    for (let i = 0; i < numPoints; i++) {
      const x = padding + stepX * i;
      const y = getY(data[i]);

      ctx.beginPath();
      ctx.arc(x, y, 4, 0, 2 * Math.PI);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }

  drawLine(trendData.readiness, '#7FABC8', 'Readiness');
  drawLine(trendData.strain, '#D4A574', 'Strain');
  drawLine(trendData.consistency, '#8FB996', 'Consistency');

  // Draw X-axis labels
  ctx.font = '500 12px Inter';
  ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
  ctx.textAlign = 'center';

  for (let i = 0; i < numPoints; i++) {
    const x = padding + stepX * i;
    ctx.fillText(weeks[i], x, canvas.height - padding + 20);
  }

  // Draw Y-axis labels
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';

  for (let i = 0; i <= 5; i++) {
    const y = padding + (chartHeight / 5) * i;
    const value = 100 - (i * 20);
    ctx.fillText(value, padding - 10, y);
  }
}

// ========================================
// Leverage Matrix
// ========================================

function drawLeverageMatrix() {
  const canvas = document.getElementById('leverageMatrix');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const padding = 80;
  const size = canvas.width - padding * 2;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw grid
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
  ctx.lineWidth = 1;

  ctx.beginPath();
  ctx.moveTo(canvas.width / 2, padding);
  ctx.lineTo(canvas.width / 2, canvas.height - padding);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(padding, canvas.height / 2);
  ctx.lineTo(canvas.width - padding, canvas.height / 2);
  ctx.stroke();

  ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
  ctx.lineWidth = 2;
  ctx.strokeRect(padding, padding, size, size);

  // Draw axes labels
  ctx.font = '600 14px Inter';
  ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
  ctx.textAlign = 'center';

  ctx.fillText('Low Control', padding + size * 0.25, canvas.height - padding + 30);
  ctx.fillText('High Control', padding + size * 0.75, canvas.height - padding + 30);

  ctx.save();
  ctx.translate(padding - 40, padding + size * 0.25);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText('High Impact', 0, 0);
  ctx.restore();

  ctx.save();
  ctx.translate(padding - 40, padding + size * 0.75);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText('Low Impact', 0, 0);
  ctx.restore();

  // Draw quadrant labels
  ctx.font = '600 11px Inter';
  ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.fillText('HIGH LEVERAGE', padding + size * 0.75, padding + size * 0.25);
  ctx.fillText('QUICK WINS', padding + size * 0.25, padding + size * 0.25);
  ctx.fillText('DELEGATE', padding + size * 0.25, padding + size * 0.75);
  ctx.fillText('MAINTAIN', padding + size * 0.75, padding + size * 0.75);

  // Draw points
  const colorMap = {
    'self': '#7FABC8',
    'teams': '#8FB996',
    'organizations': '#D4A574'
  };

  dashboardData.leverage_matrix.forEach(point => {
    const x = padding + (point.control / 100) * size;
    const y = canvas.height - padding - (point.impact / 100) * size;

    ctx.beginPath();
    ctx.arc(x, y, 8, 0, 2 * Math.PI);
    ctx.fillStyle = colorMap[point.territory];
    ctx.fill();
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.font = '600 11px Inter';
    ctx.fillStyle = '#000';
    ctx.textAlign = 'center';
    ctx.fillText(point.dimension, x, y - 16);
  });

  // Update legend
  const legend = document.getElementById('matrixLegend');
  legend.innerHTML = `
    <div class="legend-item">
      <div class="legend-dot" style="background: #7FABC8;"></div>
      <span>Leading Yourself</span>
    </div>
    <div class="legend-item">
      <div class="legend-dot" style="background: #8FB996;"></div>
      <span>Leading Teams</span>
    </div>
    <div class="legend-item">
      <div class="legend-dot" style="background: #D4A574;"></div>
      <span>Leading Organizations</span>
    </div>
  `;
}

// ========================================
// Modal System
// ========================================

function openModal(content) {
  document.getElementById('modalBody').innerHTML = content;
  document.getElementById('modalOverlay').classList.remove('hidden');
}

function closeModal() {
  document.getElementById('modalOverlay').classList.add('hidden');
}

function openScoreBreakdown() {
  const content = `
    <h2>Overall Score Breakdown</h2>
    <p style="margin-bottom: 24px; color: rgba(0,0,0,0.6);">Your score of <strong>76</strong> is calculated from 18 sub-dimensions across three territories.</p>

    <div style="margin-bottom: 32px;">
      <h3 style="font-size: 18px; margin-bottom: 12px;">Territory Weights</h3>
      <ul style="list-style: none; padding: 0;">
        <li style="margin-bottom: 8px;">Leading Yourself: <strong>81</strong> (33% weight)</li>
        <li style="margin-bottom: 8px;">Leading Teams: <strong>74</strong> (33% weight)</li>
        <li style="margin-bottom: 8px;">Leading Organizations: <strong>73</strong> (34% weight)</li>
      </ul>
    </div>

    <div style="background: rgba(127,171,200,0.1); padding: 16px; border-radius: 8px;">
      <h4 style="font-size: 16px; margin-bottom: 8px;">Calculation</h4>
      <p style="font-size: 14px; color: rgba(0,0,0,0.7);">
        (81 × 0.33) + (74 × 0.33) + (73 × 0.34) = <strong>76</strong>
      </p>
    </div>

    <p style="margin-top: 24px; font-size: 14px; color: rgba(0,0,0,0.6);">
      You're in the <strong>84th percentile</strong> compared to 2,847 peer CEOs.
    </p>
  `;
  openModal(content);
}

function openDimensionModal(dimension, score, territory) {
  const content = `
    <h2>${dimension}</h2>
    <p style="margin-bottom: 16px; color: rgba(0,0,0,0.6);">${territory}</p>

    <div style="margin-bottom: 32px;">
      <div style="font-size: 48px; font-weight: 700; margin-bottom: 8px;">${score}</div>
      <div style="display: flex; gap: 8px; align-items: center;">
        <div style="flex: 1; height: 8px; background: rgba(0,0,0,0.1); border-radius: 4px;">
          <div style="width: ${score}%; height: 100%; background: #7FABC8; border-radius: 4px;"></div>
        </div>
        <span style="font-size: 14px; color: rgba(0,0,0,0.6);">${score}%</span>
      </div>
    </div>

    <div style="background: rgba(247,243,237,1); padding: 20px; border-radius: 12px; margin-bottom: 24px;">
      <h3 style="font-size: 16px; margin-bottom: 12px;">What this measures</h3>
      <p style="font-size: 14px; line-height: 1.6; color: rgba(0,0,0,0.7);">
        ${getDimensionDescription(dimension)}
      </p>
    </div>

    <div>
      <h3 style="font-size: 16px; margin-bottom: 12px;">Improve this score</h3>
      <ul style="padding-left: 20px; font-size: 14px; line-height: 1.8; color: rgba(0,0,0,0.7);">
        ${getImprovementTips(dimension)}
      </ul>
    </div>
  `;
  openModal(content);
}

function openDriverModal(driver) {
  const content = `
    <h2>${driver.title}</h2>
    <p style="margin-bottom: 24px; color: rgba(0,0,0,0.6);">${driver.cluster}</p>

    <div style="margin-bottom: 32px;">
      <div style="font-size: 48px; font-weight: 700; margin-bottom: 8px;">${driver.score}</div>
      <div style="background: rgba(127,171,200,0.1); padding: 12px 16px; border-radius: 8px;">
        ${driver.leverage}
      </div>
    </div>

    <div>
      <h3 style="font-size: 18px; margin-bottom: 16px;">Contributing Questions</h3>
      ${driver.questions.map((q, i) => `
        <div style="background: white; border: 1px solid rgba(0,0,0,0.1); border-radius: 8px; padding: 16px; margin-bottom: 12px;">
          <div style="font-size: 14px; font-weight: 600; margin-bottom: 8px; color: rgba(0,0,0,0.8);">
            Q${i+1}: ${q.text}
          </div>
          <div style="display: flex; align-items: center; gap: 12px;">
            <span style="font-size: 12px; color: rgba(0,0,0,0.5);">Your answer:</span>
            <div style="display: flex; gap: 4px;">
              ${[1,2,3,4,5].map(val => `
                <div style="width: 12px; height: 12px; border-radius: 50%; background: ${val <= q.answer ? '#7FABC8' : 'rgba(0,0,0,0.1)'};"></div>
              `).join('')}
            </div>
            <span style="font-size: 12px; font-weight: 600; color: #7FABC8;">${q.answer}/5</span>
          </div>
        </div>
      `).join('')}
    </div>
  `;
  openModal(content);
}

function getDimensionDescription(dimension) {
  const descriptions = {
    'Energy': 'Your capacity to sustain high performance, including physical health, mental clarity, and vitality.',
    'Delegation': 'How effectively you distribute ownership and empower others to take on meaningful work.',
    'Execution': 'Your ability to turn vision into reality through consistent action and delivery.',
    'Vision': 'Clarity of strategic direction and ability to inspire others toward a compelling future.',
    'Default': 'This dimension measures a core aspect of leadership effectiveness.'
  };
  return descriptions[dimension] || descriptions['Default'];
}

function getImprovementTips(dimension) {
  const tips = {
    'Energy': '<li>Block 1 hour daily for deep work</li><li>Establish a morning routine</li><li>Track sleep and exercise weekly</li>',
    'Delegation': '<li>Weekly delegation review (Friday 4pm)</li><li>Create ownership documents</li><li>Delegate strategic work, not just tactical</li>',
    'Execution': '<li>Document your top 5 processes</li><li>Create simple checklists</li><li>Weekly progress reviews</li>',
    'Default': '<li>Set specific goals for this dimension</li><li>Track progress weekly</li><li>Find an accountability partner</li>'
  };
  return tips[dimension] || tips['Default'];
}

// ========================================
// What-If Scenario Engine
// ========================================

function toggleWhatIfMode() {
  const panel = document.getElementById('whatIfPanel');
  const btn = document.getElementById('whatIfToggleText');

  if (panel.classList.contains('hidden')) {
    panel.classList.remove('hidden');
    btn.textContent = 'Hide What-If Scenarios';
    initializeWhatIfScenarios();
  } else {
    panel.classList.add('hidden');
    btn.textContent = 'Try What-If Scenarios';
  }
}

function initializeWhatIfScenarios() {
  const sliders = ['delegation', 'execution', 'renewal'];

  sliders.forEach(dimension => {
    const slider = document.getElementById(`${dimension}Slider`);
    const valueDisplay = document.getElementById(`${dimension}Value`);

    slider.addEventListener('input', (e) => {
      valueDisplay.textContent = e.target.value;
      updateScenarioProjections();
    });
  });
}

function updateScenarioProjections() {
  const delegation = parseInt(document.getElementById('delegationSlider').value);
  const execution = parseInt(document.getElementById('executionSlider').value);
  const renewal = parseInt(document.getElementById('renewalSlider').value);

  // Calculate impacts
  const delegationDelta = delegation - 68;
  const executionDelta = execution - 67;
  const renewalDelta = renewal - 72;

  // Project new overall score (simplified model)
  const currentScore = 76;
  const newScore = currentScore + Math.round((delegationDelta + executionDelta + renewalDelta) / 6);

  // Project time reclaimed (delegation = 1pt = 0.75 hrs/week)
  const timeReclaimed = Math.round(delegationDelta * 0.75);

  // Project readiness change
  const readinessDelta = Math.round(renewalDelta * 0.5);
  const newReadiness = 82 + readinessDelta;

  // Update UI
  document.getElementById('projectedScore').textContent = newScore;
  document.getElementById('projectedDelta').textContent = newScore !== currentScore ? `(${newScore > currentScore ? '+' : ''}${newScore - currentScore})` : '—';
  document.getElementById('projectedDelta').className = newScore > currentScore ? 'projection-delta' : 'projection-delta negative';

  document.getElementById('projectedTime').textContent = timeReclaimed !== 0 ? `${Math.abs(timeReclaimed)} hrs/week ${timeReclaimed > 0 ? 'saved' : 'lost'}` : '0 hrs';

  document.getElementById('projectedReadiness').textContent = newReadiness;
  document.getElementById('projectedReadinessDelta').textContent = readinessDelta !== 0 ? `(${readinessDelta > 0 ? '+' : ''}${readinessDelta})` : '—';

  // Update impact messages
  if (delegationDelta > 0) {
    document.getElementById('delegationImpact').textContent = `+${timeReclaimed} hours/week reclaimed for strategic work`;
  } else {
    document.getElementById('delegationImpact').textContent = '';
  }

  if (executionDelta > 0) {
    document.getElementById('executionImpact').textContent = `Team clarity improves, reducing friction`;
  } else {
    document.getElementById('executionImpact').textContent = '';
  }

  if (renewalDelta > 0) {
    document.getElementById('renewalImpact').textContent = `Burnout risk reduced by ${Math.round(renewalDelta * 2)}%`;
  } else {
    document.getElementById('renewalImpact').textContent = '';
  }
}

// ========================================
// Event Listeners
// ========================================

function setupEventListeners() {
  // Historical comparison toggle
  document.getElementById('historicalToggle').addEventListener('change', (e) => {
    historicalComparisonEnabled = e.target.checked;
    // Redraw charts with historical overlay
    console.log('Historical comparison:', historicalComparisonEnabled);
  });

  // Peer overlay toggle
  document.getElementById('peerOverlayToggle').addEventListener('change', (e) => {
    peerOverlayEnabled = e.target.checked;
    drawRadarChart();
  });

  // Trends chart line toggles
  document.querySelectorAll('.trends-controls input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', () => {
      drawTrendsChart();
    });
  });
}

// ========================================
// Initialize on Load
// ========================================

document.addEventListener('DOMContentLoaded', () => {
  loadDashboardData();
});
