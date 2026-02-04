// Konstantin Method Dashboard - Visualizations
// All charts rendered with vanilla JavaScript and Canvas API

// ========================================
// 1. Ring Charts (Readiness, Strain, Consistency)
// ========================================

function drawRing(canvasId, value, color) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const radius = 70;
  const lineWidth = 16;

  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Background ring
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.05)';
  ctx.lineWidth = lineWidth;
  ctx.stroke();

  // Value ring
  const startAngle = -Math.PI / 2; // Start at top
  const endAngle = startAngle + (2 * Math.PI * value / 100);

  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, startAngle, endAngle);
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.lineCap = 'round';
  ctx.stroke();
}

// Draw all three rings
drawRing('readinessRing', 82, '#7FABC8');
drawRing('strainRing', 34, '#D4A574');
drawRing('consistencyRing', 78, '#8FB996');

// ========================================
// 2. Radar Chart (Leadership Signature)
// ========================================

function drawRadarChart() {
  const canvas = document.getElementById('radarChart');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const radius = 180;

  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Data: Leading Yourself, Leading Teams, Leading Organizations
  const labels = ['Leading Yourself', 'Leading Teams', 'Leading Organizations'];
  const values = [81, 74, 73]; // Territory scores
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

  // Leading Yourself (top)
  ctx.fillText('Leading Yourself', centerX, centerY - labelRadius);

  // Leading Teams (bottom-right)
  const angle1 = (Math.PI * 2 / numPoints) * 1 - Math.PI / 2;
  const x1 = centerX + labelRadius * Math.cos(angle1);
  const y1 = centerY + labelRadius * Math.sin(angle1);
  ctx.fillText('Leading Teams', x1, y1);

  // Leading Organizations (bottom-left)
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

drawRadarChart();

// ========================================
// 3. Trendlines Chart (12 weeks)
// ========================================

function drawTrendsChart() {
  const canvas = document.getElementById('trendsChart');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const padding = 60;
  const chartWidth = canvas.width - padding * 2;
  const chartHeight = canvas.height - padding * 2;

  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Mock data for 12 weeks
  const weeks = Array.from({length: 12}, (_, i) => `W${i+1}`);
  const readiness = [75, 76, 78, 79, 80, 79, 81, 80, 82, 83, 82, 82];
  const strain = [42, 40, 38, 35, 36, 34, 33, 35, 34, 32, 33, 34];
  const consistency = [70, 72, 73, 74, 75, 76, 75, 77, 78, 77, 78, 78];

  const numPoints = weeks.length;
  const stepX = chartWidth / (numPoints - 1);

  // Helper function to get Y position
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

  drawLine(readiness, '#7FABC8', 'Readiness');
  drawLine(strain, '#D4A574', 'Strain');
  drawLine(consistency, '#8FB996', 'Consistency');

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

  // Draw legend
  const legendX = canvas.width - padding - 150;
  const legendY = padding + 20;
  const legendSpacing = 30;

  ctx.textAlign = 'left';
  ctx.font = '600 13px Inter';

  // Readiness
  ctx.fillStyle = '#7FABC8';
  ctx.fillRect(legendX, legendY, 20, 3);
  ctx.fillStyle = '#000';
  ctx.fillText('Readiness', legendX + 28, legendY + 2);

  // Strain
  ctx.fillStyle = '#D4A574';
  ctx.fillRect(legendX, legendY + legendSpacing, 20, 3);
  ctx.fillStyle = '#000';
  ctx.fillText('Strain', legendX + 28, legendY + legendSpacing + 2);

  // Consistency
  ctx.fillStyle = '#8FB996';
  ctx.fillRect(legendX, legendY + legendSpacing * 2, 20, 3);
  ctx.fillStyle = '#000';
  ctx.fillText('Consistency', legendX + 28, legendY + legendSpacing * 2 + 2);
}

drawTrendsChart();

// ========================================
// 4. Distribution Chart (Benchmark)
// ========================================

function drawDistributionChart() {
  const canvas = document.getElementById('distributionChart');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const padding = 60;
  const chartWidth = canvas.width - padding * 2;
  const chartHeight = canvas.height - padding * 2;

  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Normal distribution data (simplified bell curve)
  const scores = [];
  const frequencies = [];

  for (let score = 30; score <= 100; score += 2) {
    scores.push(score);
    // Simplified normal distribution centered at 68
    const mean = 68;
    const stdDev = 9.2;
    const frequency = Math.exp(-Math.pow(score - mean, 2) / (2 * Math.pow(stdDev, 2)));
    frequencies.push(frequency);
  }

  const maxFreq = Math.max(...frequencies);
  const barWidth = chartWidth / scores.length;

  // Draw bars
  for (let i = 0; i < scores.length; i++) {
    const x = padding + barWidth * i;
    const height = (frequencies[i] / maxFreq) * chartHeight;
    const y = canvas.height - padding - height;

    // Highlight user's score
    if (scores[i] >= 74 && scores[i] <= 78) {
      ctx.fillStyle = '#7FABC8';
    } else {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
    }

    ctx.fillRect(x, y, barWidth - 1, height);
  }

  // Draw marker for user's score (76)
  const userScore = 76;
  const userIndex = scores.findIndex(s => s >= userScore);
  const markerX = padding + barWidth * userIndex;

  ctx.beginPath();
  ctx.moveTo(markerX, padding);
  ctx.lineTo(markerX, canvas.height - padding);
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 2;
  ctx.setLineDash([5, 5]);
  ctx.stroke();
  ctx.setLineDash([]);

  // Draw label
  ctx.font = '700 14px Inter';
  ctx.fillStyle = '#000';
  ctx.textAlign = 'center';
  ctx.fillText('You: 76', markerX, padding - 10);

  // Draw X-axis
  ctx.beginPath();
  ctx.moveTo(padding, canvas.height - padding);
  ctx.lineTo(canvas.width - padding, canvas.height - padding);
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
  ctx.lineWidth = 1;
  ctx.stroke();

  // X-axis labels
  ctx.font = '500 12px Inter';
  ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
  ctx.textAlign = 'center';

  for (let score = 40; score <= 90; score += 10) {
    const index = scores.findIndex(s => s >= score);
    const x = padding + barWidth * index;
    ctx.fillText(score, x, canvas.height - padding + 20);
  }

  // Y-axis label
  ctx.save();
  ctx.translate(padding - 40, canvas.height / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.textAlign = 'center';
  ctx.fillText('Frequency', 0, 0);
  ctx.restore();

  // X-axis label
  ctx.fillText('Overall Leadership Score', canvas.width / 2, canvas.height - 20);
}

drawDistributionChart();

// ========================================
// 5. Leverage Matrix (Impact vs Control)
// ========================================

function drawLeverageMatrix() {
  const canvas = document.getElementById('leverageMatrix');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const padding = 80;
  const size = canvas.width - padding * 2;

  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw grid
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
  ctx.lineWidth = 1;

  // Vertical center line
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2, padding);
  ctx.lineTo(canvas.width / 2, canvas.height - padding);
  ctx.stroke();

  // Horizontal center line
  ctx.beginPath();
  ctx.moveTo(padding, canvas.height / 2);
  ctx.lineTo(canvas.width - padding, canvas.height / 2);
  ctx.stroke();

  // Draw outer box
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
  ctx.lineWidth = 2;
  ctx.strokeRect(padding, padding, size, size);

  // Draw axes labels
  ctx.font = '600 14px Inter';
  ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
  ctx.textAlign = 'center';

  // X-axis (Control)
  ctx.fillText('Low Control', padding + size * 0.25, canvas.height - padding + 30);
  ctx.fillText('High Control', padding + size * 0.75, canvas.height - padding + 30);

  // Y-axis (Impact)
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

  // Title
  ctx.font = '700 14px Inter';
  ctx.fillStyle = '#000';
  ctx.textAlign = 'center';
  ctx.fillText('CONTROL →', canvas.width / 2, canvas.height - 15);

  ctx.save();
  ctx.translate(20, canvas.height / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText('IMPACT →', 0, 0);
  ctx.restore();

  // Data points: [control (0-100), impact (0-100), label, color]
  const dataPoints = [
    // Leading Yourself (blue)
    [85, 90, 'Energy', '#7FABC8'],
    [90, 85, 'Focus', '#7FABC8'],
    [80, 75, 'Time', '#7FABC8'],
    [75, 70, 'Renewal', '#7FABC8'],

    // Leading Teams (green)
    [60, 85, 'Delegation', '#8FB996'],
    [70, 75, 'Feedback', '#8FB996'],
    [75, 70, 'Hiring', '#8FB996'],
    [65, 65, 'Motivation', '#8FB996'],

    // Leading Organizations (orange)
    [50, 90, 'Execution', '#D4A574'],
    [55, 85, 'Systems', '#D4A574'],
    [80, 80, 'Vision', '#D4A574'],
    [60, 70, 'Communication', '#D4A574']
  ];

  // Draw quadrant labels
  ctx.font = '600 11px Inter';
  ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.textAlign = 'center';

  ctx.fillText('HIGH LEVERAGE', padding + size * 0.75, padding + size * 0.25);
  ctx.fillText('QUICK WINS', padding + size * 0.25, padding + size * 0.25);
  ctx.fillText('DELEGATE', padding + size * 0.25, padding + size * 0.75);
  ctx.fillText('MAINTAIN', padding + size * 0.75, padding + size * 0.75);

  // Draw points
  dataPoints.forEach(([control, impact, label, color]) => {
    const x = padding + (control / 100) * size;
    const y = canvas.height - padding - (impact / 100) * size;

    // Point
    ctx.beginPath();
    ctx.arc(x, y, 8, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Label
    ctx.font = '600 11px Inter';
    ctx.fillStyle = '#000';
    ctx.textAlign = 'center';
    ctx.fillText(label, x, y - 16);
  });
}

drawLeverageMatrix();

// ========================================
// Animation & Interactivity
// ========================================

// Animate progress bars on load
document.addEventListener('DOMContentLoaded', () => {
  const progressBars = document.querySelectorAll('.progress-fill');

  setTimeout(() => {
    progressBars.forEach(bar => {
      const percent = bar.getAttribute('data-percent');
      bar.style.width = percent + '%';
    });
  }, 300);
});

// Smooth scroll for any internal links (if added)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// Print functionality (optional)
window.addEventListener('beforeprint', () => {
  document.body.style.background = 'white';
});

window.addEventListener('afterprint', () => {
  document.body.style.background = '#F7F3ED';
});

console.log('Konstantin Method Dashboard loaded successfully');
console.log('All visualizations rendered');
