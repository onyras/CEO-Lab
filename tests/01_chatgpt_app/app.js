const heatmapData = [
  { name: "Energy Management", score: 76, territory: "Yourself", detail: "Deep work and recovery rhythm are strong, but protection is inconsistent." },
  { name: "Self-Awareness", score: 74, territory: "Yourself", detail: "Driver clarity is high; bias tracking is weaker." },
  { name: "Above the Line", score: 72, territory: "Yourself", detail: "Curiosity is present, recovery speed could improve." },
  { name: "Emotional Fluidity", score: 82, territory: "Yourself", detail: "Naming emotions and vulnerability are strong." },
  { name: "Contemplative Practice", score: 78, territory: "Yourself", detail: "Consistent ritual with room for depth." },
  { name: "Stress Design", score: 64, territory: "Yourself", detail: "Stress calibration lacks weekly rhythm." },
  { name: "Trust Formula", score: 84, territory: "Teams", detail: "Reliability and intimacy are above cohort." },
  { name: "Psychological Safety", score: 79, territory: "Teams", detail: "Bad news reaches you quickly; dissent can deepen." },
  { name: "Multiplier Behavior", score: 81, territory: "Teams", detail: "Question-first leadership is strong." },
  { name: "Communication Rhythm", score: 69, territory: "Teams", detail: "Strategic narrative cadence is irregular." },
  { name: "Team Health", score: 71, territory: "Teams", detail: "Commitment and accountability need reinforcement." },
  { name: "Accountability & Delegation", score: 83, territory: "Teams", detail: "Decision distribution is healthy, rescue pattern is low." },
  { name: "Strategic Clarity", score: 88, territory: "Org", detail: "Strategy is crisp and repeatable." },
  { name: "Culture as System", score: 77, territory: "Org", detail: "Culture is shaped but not enforced consistently." },
  { name: "Three Transitions", score: 73, territory: "Org", detail: "Operating vs. architecting is balanced." },
  { name: "Systems Thinking", score: 79, territory: "Org", detail: "Pattern recognition is strong." },
  { name: "Organizational Design", score: 76, territory: "Org", detail: "Structure is solid; roles can clarify." },
  { name: "Board & Governance", score: 58, territory: "Org", detail: "Governance cadence and decision rights need clarity." }
];

const driverData = [
  {
    title: "Deep Work Protection",
    cluster: "Energy Management",
    impact: "Your focus protection scores 2.8/5. This alone pulled the territory down by 4 points.",
    opportunity: "+3 points if you block 3 weekly deep work sessions."
  },
  {
    title: "Driver Origin Awareness",
    cluster: "Self-Awareness",
    impact: "You identify your driver, but can’t trace its origin consistently.",
    opportunity: "+2 points by clarifying origin story with coach journaling."
  },
  {
    title: "Strategic Narrative Cadence",
    cluster: "Communication Rhythm",
    impact: "Vision repetition scored 2.6/5. Teams perceive drift even with clear strategy.",
    opportunity: "+5 points by adding a weekly 10-min narrative update."
  },
  {
    title: "Governance Decision Rights",
    cluster: "Board & Governance",
    impact: "Decision rights scored 2.1/5, the single lowest question cluster.",
    opportunity: "+6 points by codifying 5 decision domains."
  },
  {
    title: "Stress Calibration",
    cluster: "Stress Design",
    impact: "You recognize overload but lack a weekly recovery system.",
    opportunity: "+4 points with a two-day recovery ritual."
  },
  {
    title: "Feedback Loop Cadence",
    cluster: "Team Health",
    impact: "360 feedback exists but isn’t rhythmic.",
    opportunity: "+3 points by adding monthly pulse checks."
  }
];

const matrixData = [
  { name: "Governance", impact: 92, control: 78 },
  { name: "Stress Design", impact: 76, control: 66 },
  { name: "Communication", impact: 70, control: 84 },
  { name: "Team Health", impact: 64, control: 55 },
  { name: "Strategic Clarity", impact: 60, control: 70 },
  { name: "Trust Formula", impact: 58, control: 72 }
];

const heatmap = document.getElementById("heatmap");
const driverGrid = document.getElementById("driverGrid");
const matrix = document.getElementById("matrix");

function scoreToColor(score) {
  const hue = (score * 1.2);
  return `hsl(${hue}, 55%, 85%)`;
}

function initHeatmap() {
  heatmapData.forEach(item => {
    const card = document.createElement("div");
    card.className = "heatmap-card";
    card.style.background = scoreToColor(item.score);
    card.innerHTML = `
      <div class="heatmap-card__title">${item.name}</div>
      <div class="heatmap-card__score">${item.score}</div>
      <div class="heatmap-card__meta">${item.territory} Territory</div>
      <div class="heatmap-card__meta">${item.detail}</div>
    `;
    heatmap.appendChild(card);
  });
}

function initDrivers() {
  driverData.forEach(item => {
    const card = document.createElement("div");
    card.className = "driver-card";
    card.innerHTML = `
      <div class="driver-card__title">${item.title}</div>
      <div class="driver-card__meta">${item.cluster}</div>
      <div class="driver-card__impact">${item.impact}</div>
      <div class="driver-card__impact"><strong>Leverage:</strong> ${item.opportunity}</div>
    `;
    driverGrid.appendChild(card);
  });
}

function initBars() {
  document.querySelectorAll(".territory-card").forEach(card => {
    const score = Number(card.dataset.score || 0);
    const fill = card.querySelector(".bar__fill");
    fill.style.width = `${score}%`;
  });
}

function initRings() {
  document.querySelectorAll(".ring__svg").forEach(svg => {
    const score = Number(svg.dataset.score || 0);
    const circle = svg.querySelector(".ring__fg");
    const circumference = 2 * Math.PI * 50;
    const offset = circumference - (score / 100) * circumference;
    circle.style.strokeDasharray = `${circumference}`;
    circle.style.strokeDashoffset = `${offset}`;
  });
}

function initSparklines() {
  document.querySelectorAll(".sparkline").forEach(svg => {
    const points = (svg.dataset.points || "").split(",").map(Number);
    if (!points.length) return;
    const max = Math.max(...points);
    const min = Math.min(...points);
    const width = 300;
    const height = 120;
    const pad = 10;

    const scaleX = (idx) => pad + (idx / (points.length - 1)) * (width - pad * 2);
    const scaleY = (val) => {
      const range = max - min || 1;
      return height - pad - ((val - min) / range) * (height - pad * 2);
    };

    const d = points.map((val, idx) => `${idx === 0 ? "M" : "L"}${scaleX(idx)},${scaleY(val)}`).join(" ");

    svg.innerHTML = `
      <path d="${d}" fill="none" stroke="black" stroke-width="2" />
      <circle cx="${scaleX(points.length - 1)}" cy="${scaleY(points[points.length - 1])}" r="4" fill="black" />
    `;
  });
}

function initDistribution() {
  document.querySelectorAll(".distribution").forEach(svg => {
    const bucket = Number(svg.dataset.bucket || 0);
    const width = 320;
    const height = 140;
    const points = [];
    for (let i = 0; i <= 20; i++) {
      const x = (i / 20) * width;
      const mean = width * 0.55;
      const variance = width * 0.18;
      const y = Math.exp(-Math.pow(x - mean, 2) / (2 * Math.pow(variance, 2))) * 100;
      points.push({ x, y });
    }
    const maxY = Math.max(...points.map(p => p.y));
    const scaleY = (y) => height - (y / maxY) * 100 - 20;
    const d = points.map((p, idx) => `${idx === 0 ? "M" : "L"}${p.x},${scaleY(p.y)}`).join(" ");

    const markerX = (bucket / 100) * width;

    svg.innerHTML = `
      <path d="${d}" fill="none" stroke="black" stroke-width="2" />
      <line x1="${markerX}" x2="${markerX}" y1="20" y2="120" stroke="black" stroke-dasharray="4 4" />
    `;
  });
}

function initRadar() {
  document.querySelectorAll(".radar").forEach(svg => {
    const scores = (svg.dataset.scores || "").split(",").map(Number);
    const width = 320;
    const height = 300;
    const centerX = width / 2;
    const centerY = height / 2 + 10;
    const maxRadius = 110;

    const angles = [
      (-90 * Math.PI) / 180,
      (30 * Math.PI) / 180,
      (150 * Math.PI) / 180
    ];

    const points = scores.map((score, idx) => {
      const radius = (score / 100) * maxRadius;
      return {
        x: centerX + Math.cos(angles[idx]) * radius,
        y: centerY + Math.sin(angles[idx]) * radius
      };
    });

    const basePoints = angles.map(angle => {
      return {
        x: centerX + Math.cos(angle) * maxRadius,
        y: centerY + Math.sin(angle) * maxRadius
      };
    });

    const polygon = points.map((p, idx) => `${idx === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ") + " Z";
    const base = basePoints.map((p, idx) => `${idx === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ") + " Z";

    svg.innerHTML = `
      <polygon points="${basePoints.map(p => `${p.x},${p.y}`).join(" ")}" fill="none" stroke="rgba(0,0,0,0.2)" stroke-width="1" />
      <polygon points="${basePoints.map(p => `${p.x},${p.y}`).join(" ")}" fill="rgba(0,0,0,0.02)" />
      <path d="${polygon}" fill="rgba(0,0,0,0.1)" stroke="black" stroke-width="2" />
      <circle cx="${points[0].x}" cy="${points[0].y}" r="4" fill="black" />
      <circle cx="${points[1].x}" cy="${points[1].y}" r="4" fill="black" />
      <circle cx="${points[2].x}" cy="${points[2].y}" r="4" fill="black" />
    `;
  });
}

function initMatrix() {
  matrixData.forEach(item => {
    const dot = document.createElement("div");
    dot.className = "matrix-dot";
    const x = item.control;
    const y = item.impact;
    dot.style.left = `calc(${x}% - 6px)`;
    dot.style.top = `calc(${100 - y}% - 6px)`;
    const label = document.createElement("div");
    label.className = "matrix-dot__label";
    label.textContent = item.name;
    dot.appendChild(label);
    matrix.appendChild(dot);
  });
}

initHeatmap();
initDrivers();
initBars();
initRings();
initSparklines();
initDistribution();
initRadar();
initMatrix();
