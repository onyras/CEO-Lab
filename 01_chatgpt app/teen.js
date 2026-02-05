const heatmapData = [
  {
    name: "Energy Management",
    score: 76,
    territory: "You",
    detail: "You can focus well, but you don’t protect focus time enough.",
    evidence: [
      "Focus protection scored low",
      "Recovery habits are strong",
      "Sleep is okay but inconsistent"
    ]
  },
  {
    name: "Self-Awareness",
    score: 74,
    territory: "You",
    detail: "You know your main pattern, but you miss some blind spots.",
    evidence: [
      "Driver clarity is high",
      "Bias tracking is low",
      "Zone of Genius time is medium"
    ]
  },
  {
    name: "Above the Line",
    score: 72,
    territory: "You",
    detail: "You recover, but not quickly every time.",
    evidence: [
      "You notice reactivity",
      "Recovery speed is slow",
      "You choose curiosity often"
    ]
  },
  {
    name: "Emotional Fluidity",
    score: 82,
    territory: "You",
    detail: "You can name your feelings and be open.",
    evidence: [
      "Emotion naming is strong",
      "Vulnerability is strong",
      "Anger expression is good"
    ]
  },
  {
    name: "Contemplative Practice",
    score: 78,
    territory: "You",
    detail: "You practice, but not super deep yet.",
    evidence: [
      "Practice frequency is solid",
      "Depth is medium",
      "Retreats are rare"
    ]
  },
  {
    name: "Stress Design",
    score: 64,
    territory: "You",
    detail: "Stress resets are missing, so pressure builds up.",
    evidence: [
      "Stress awareness is ok",
      "Stress reset habits are weak",
      "Burnout signs are not tracked"
    ]
  },
  {
    name: "Trust Formula",
    score: 84,
    territory: "Team",
    detail: "People trust you and believe you.",
    evidence: [
      "Reliability is high",
      "Credibility is strong",
      "Intimacy is solid"
    ]
  },
  {
    name: "Psychological Safety",
    score: 79,
    territory: "Team",
    detail: "Bad news reaches you fast, but people still hold back.",
    evidence: [
      "Bad news speed is good",
      "Dissent is medium",
      "Mistakes are handled ok"
    ]
  },
  {
    name: "Multiplier Behavior",
    score: 81,
    territory: "Team",
    detail: "You ask good questions and lift people up.",
    evidence: [
      "You ask more than tell",
      "You stretch people",
      "You invest in ownership"
    ]
  },
  {
    name: "Communication Rhythm",
    score: 69,
    territory: "Team",
    detail: "Updates are not regular, so people feel drift.",
    evidence: [
      "Weekly tactical is weak",
      "Monthly strategy is weak",
      "Vision repetition is low"
    ]
  },
  {
    name: "Team Health",
    score: 71,
    territory: "Team",
    detail: "Team works, but conflict and accountability are not strong.",
    evidence: [
      "Conflict is avoided",
      "Commitment is medium",
      "Peer accountability is low"
    ]
  },
  {
    name: "Accountability & Delegation",
    score: 83,
    territory: "Team",
    detail: "You delegate well and don’t rescue people too much.",
    evidence: [
      "Decision spread is strong",
      "Delegation clarity is high",
      "Feedback cadence is good"
    ]
  },
  {
    name: "Strategic Clarity",
    score: 88,
    territory: "Org",
    detail: "Your strategy is very clear.",
    evidence: [
      "One-sentence strategy is aligned",
      "Traps avoided",
      "Positioning is strong"
    ]
  },
  {
    name: "Culture as System",
    score: 77,
    territory: "Org",
    detail: "Culture exists, but it isn’t enforced every day.",
    evidence: [
      "Values enforcement is weak",
      "Rituals are ok",
      "Hiring for values is medium"
    ]
  },
  {
    name: "Three Transitions",
    score: 73,
    territory: "Org",
    detail: "You balance doing work and building the system.",
    evidence: [
      "Time on business is ok",
      "Strategic calendar is ok",
      "Execution delegation is solid"
    ]
  },
  {
    name: "Systems Thinking",
    score: 79,
    territory: "Org",
    detail: "You see patterns, not just single problems.",
    evidence: [
      "Root causes are found",
      "Feedback loops are used",
      "System thinking is strong"
    ]
  },
  {
    name: "Organizational Design",
    score: 76,
    territory: "Org",
    detail: "Structure is decent, but role clarity is missing.",
    evidence: [
      "Role clarity is low",
      "Decision rights are unclear",
      "Org chart is updated"
    ]
  },
  {
    name: "Board & Governance",
    score: 58,
    territory: "Org",
    detail: "Rules and decision rights are not clear enough.",
    evidence: [
      "Board meetings are rare",
      "Decision rights are weak",
      "Board mix is incomplete"
    ]
  }
];

const driverData = [
  {
    title: "Deep Work Protection",
    impact: "You lose focus time too often.",
    fix: "Block 3 deep work sessions each week."
  },
  {
    title: "Strategy Updates",
    impact: "People don’t hear the plan enough.",
    fix: "Send a 10‑minute weekly update."
  },
  {
    title: "Governance Rules",
    impact: "Decisions slow down because rules are fuzzy.",
    fix: "Write down who decides the top 5 things."
  }
];

const riskData = [
  { name: "Burnout Risk", value: 58 },
  { name: "Trust Risk", value: 34 },
  { name: "Execution Risk", value: 46 },
  { name: "Governance Risk", value: 72 }
];

const actions = [
  {
    title: "Fix Governance",
    note: "Set clear decision rules and meet the board monthly."
  },
  {
    title: "Build Stress Reset",
    note: "Pick 2 recovery rituals and do them weekly."
  },
  {
    title: "Weekly Strategy Note",
    note: "Share the plan every week so people stay aligned."
  }
];

const heatmap = document.getElementById("heatmap");
const driverGrid = document.getElementById("driverGrid");
const riskGrid = document.getElementById("riskGrid");
const actionsGrid = document.getElementById("actions");

const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modalTitle");
const modalBody = document.getElementById("modalBody");
const modalList = document.getElementById("modalList");
const modalClose = document.getElementById("modalClose");

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
      <div class="heatmap-card__meta">${item.territory}</div>
      <div class="heatmap-card__meta">${item.detail}</div>
    `;
    card.addEventListener("click", () => openModal(item));
    heatmap.appendChild(card);
  });
}

function openModal(item) {
  modalTitle.textContent = item.name;
  modalBody.textContent = item.detail;
  modalList.innerHTML = "";
  item.evidence.forEach(text => {
    const row = document.createElement("div");
    row.className = "modal__item";
    row.textContent = text;
    modalList.appendChild(row);
  });
  modal.classList.add("show");
}

modalClose.addEventListener("click", () => modal.classList.remove("show"));
modal.addEventListener("click", (event) => {
  if (event.target === modal) {
    modal.classList.remove("show");
  }
});

function initDrivers() {
  driverData.forEach(item => {
    const card = document.createElement("div");
    card.className = "driver-card";
    card.innerHTML = `
      <div class="driver-card__title">${item.title}</div>
      <div class="driver-card__impact">Why it matters: ${item.impact}</div>
      <div class="driver-card__impact"><strong>Fix:</strong> ${item.fix}</div>
    `;
    driverGrid.appendChild(card);
  });
}

function initRisk() {
  riskData.forEach(item => {
    const card = document.createElement("div");
    card.className = "risk-card";
    card.innerHTML = `
      <div class="risk-card__label">${item.name}</div>
      <div class="risk-card__value">${item.value}</div>
      <div class="risk-card__bar"><div class="risk-card__fill" style="width:${item.value}%"></div></div>
    `;
    riskGrid.appendChild(card);
  });
}

function initActions() {
  actions.forEach(item => {
    const card = document.createElement("div");
    card.className = "action-card";
    card.innerHTML = `
      <div class="driver-card__title">${item.title}</div>
      <p>${item.note}</p>
    `;
    actionsGrid.appendChild(card);
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

initHeatmap();
initDrivers();
initRisk();
initActions();
initBars();
initRings();
