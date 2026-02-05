const heatmapData = [
  {
    name: "Energy Management",
    score: 74,
    territory: "Yourself",
    detail: "Deep work exists, but stress zone control is inconsistent.",
    evidence: [
      "Q1: Deep work hours 3.2/5",
      "Q4: Recharge breaks 4.0/5",
      "Q5: Stress zone awareness 2.9/5"
    ]
  },
  {
    name: "Purpose & Direction",
    score: 70,
    territory: "Yourself",
    detail: "Zone of Genius is known, but not fully protected.",
    evidence: [
      "Q8: Zone of Genius clarity 4.0/5",
      "Q9: Time in zone 3.1/5",
      "Q11: Work alignment 3.0/5"
    ]
  },
  {
    name: "Self-Awareness",
    score: 73,
    territory: "Yourself",
    detail: "Pattern recognition is decent; bias tracking is weaker.",
    evidence: [
      "Q12: Pattern recognition 3.6/5",
      "Q13: Bias awareness 2.9/5",
      "Q15: Feedback seeking 3.1/5"
    ]
  },
  {
    name: "Leading Above the Line",
    score: 71,
    territory: "Yourself",
    detail: "Curiosity appears, but recovery is not consistent.",
    evidence: [
      "Q18: Reactivity recognition 3.5/5",
      "Q19: Recovery speed 2.9/5",
      "Q22: Curiosity vs blame 3.8/5"
    ]
  },
  {
    name: "Emotional Intelligence",
    score: 80,
    territory: "Yourself",
    detail: "Naming emotions and vulnerability are strong.",
    evidence: [
      "Q23: Emotion naming 4.2/5",
      "Q26: Vulnerability 4.1/5",
      "Q27: Anger handling 3.6/5"
    ]
  },
  {
    name: "Grounded Presence",
    score: 76,
    territory: "Yourself",
    detail: "Practice exists; stillness could be more consistent.",
    evidence: [
      "Q28: Practice existence 3.8/5",
      "Q29: Stillness frequency 3.6/5",
      "Q32: Listening level 3.7/5"
    ]
  },
  {
    name: "Trust Formula",
    score: 84,
    territory: "Teams",
    detail: "Reliability and intimacy are above cohort.",
    evidence: [
      "Credibility 4.2/5",
      "Reliability 4.4/5",
      "Intimacy 3.9/5"
    ]
  },
  {
    name: "Psychological Safety",
    score: 79,
    territory: "Teams",
    detail: "Bad news reaches you quickly; dissent can deepen.",
    evidence: [
      "Bad news speed 4.2/5",
      "Dissent welcome 3.1/5",
      "Mistake response 3.7/5"
    ]
  },
  {
    name: "Multiplier Behavior",
    score: 81,
    territory: "Teams",
    detail: "Question-first leadership is strong.",
    evidence: [
      "Question/answer ratio 4.1/5",
      "Challenger behavior 3.8/5",
      "Investor mindset 3.9/5"
    ]
  },
  {
    name: "Communication Rhythm",
    score: 69,
    territory: "Teams",
    detail: "Strategic narrative cadence is irregular.",
    evidence: [
      "Weekly tactical 3.1/5",
      "Monthly strategic 2.7/5",
      "Vision repetition 2.6/5"
    ]
  },
  {
    name: "Team Health",
    score: 71,
    territory: "Teams",
    detail: "Commitment and accountability need reinforcement.",
    evidence: [
      "Conflict capacity 3.2/5",
      "Commitment buy-in 3.4/5",
      "Peer accountability 2.9/5"
    ]
  },
  {
    name: "Accountability & Delegation",
    score: 83,
    territory: "Teams",
    detail: "Decision distribution is healthy, rescue pattern is low.",
    evidence: [
      "Decision distribution 4.2/5",
      "Delegation clarity 4.0/5",
      "Feedback frequency 3.9/5"
    ]
  },
  {
    name: "Strategic Clarity",
    score: 88,
    territory: "Org",
    detail: "Strategy is crisp and repeatable.",
    evidence: [
      "Strategy sentence alignment 4.5/5",
      "Strategy trap avoidance 4.0/5",
      "Competitive positioning 4.2/5"
    ]
  },
  {
    name: "Culture as System",
    score: 77,
    territory: "Org",
    detail: "Culture is shaped but not enforced consistently.",
    evidence: [
      "Values enforcement 3.1/5",
      "Cultural rituals 3.7/5",
      "Hiring for values 3.8/5"
    ]
  },
  {
    name: "Three Transitions",
    score: 73,
    territory: "Org",
    detail: "Operating vs. architecting is balanced.",
    evidence: [
      "Time ON business 3.6/5",
      "Strategic calendar 3.4/5",
      "Execution delegation 3.7/5"
    ]
  },
  {
    name: "Systems Thinking",
    score: 79,
    territory: "Org",
    detail: "Pattern recognition is strong.",
    evidence: [
      "Root-cause analysis 4.0/5",
      "Feedback loops 3.6/5",
      "Systemic diagnosis 3.9/5"
    ]
  },
  {
    name: "Organizational Design",
    score: 76,
    territory: "Org",
    detail: "Structure is solid; roles can clarify.",
    evidence: [
      "Role clarity 3.3/5",
      "Decision rights 3.0/5",
      "Org chart freshness 3.8/5"
    ]
  },
  {
    name: "Board & Governance",
    score: 58,
    territory: "Org",
    detail: "Governance cadence and decision rights need clarity.",
    evidence: [
      "Board cadence 2.2/5",
      "Decision rights 2.1/5",
      "Board composition 2.8/5"
    ]
  }
];

const driverData = [
  {
    title: "Deep Work Protection",
    cluster: "Energy Management",
    impact: "Focus protection scored 2.8/5. This alone pulled the territory down by 4 points.",
    opportunity: "+3 points if you block 3 weekly deep work sessions."
  },
  {
    title: "Driver Origin Awareness",
    cluster: "Purpose & Direction",
    impact: "Driver is identified, but origin story isn’t fully integrated.",
    opportunity: "+2 points by clarifying origin with coach journaling."
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
    title: "Purpose Alignment",
    cluster: "Purpose & Direction",
    impact: "Zone of Genius is clear but not protected consistently.",
    opportunity: "+4 points by aligning weekly calendar to genius work."
  },
  {
    title: "Feedback Loop Cadence",
    cluster: "Team Health",
    impact: "360 feedback exists but isn’t rhythmic.",
    opportunity: "+3 points by adding monthly pulse checks."
  }
];

const riskData = [
  { name: "Burnout Risk", value: 58, note: "Energy zone drift + recovery volatility" },
  { name: "Trust Decay", value: 34, note: "Safety trending stable" },
  { name: "Execution Drag", value: 46, note: "Communication cadence" },
  { name: "Governance Drift", value: 72, note: "Board & decision rights" }
];

const velocityData = [
  { name: "Readiness", value: "+0.7 / week", projection: "Projected 87 in 12 weeks" },
  { name: "Strain", value: "-0.2 / week", projection: "Projected 58 in 12 weeks" },
  { name: "Consistency", value: "+0.9 / week", projection: "Projected 83 in 12 weeks" }
];

const consistencyData = [
  { name: "Energy Management", volatility: 22 },
  { name: "Purpose & Direction", volatility: 26 },
  { name: "Self-Awareness", volatility: 18 },
  { name: "Leading Above the Line", volatility: 28 },
  { name: "Emotional Intelligence", volatility: 12 },
  { name: "Grounded Presence", volatility: 16 },
  { name: "Trust Formula", volatility: 10 },
  { name: "Psychological Safety", volatility: 18 },
  { name: "Multiplier Behavior", volatility: 15 },
  { name: "Communication Rhythm", volatility: 30 }
];

const outcomeData = [
  { name: "Execution Cycle Time", value: "-18%", note: "High strategic clarity correlates with faster execution." },
  { name: "Retention Risk", value: "-12%", note: "High trust formula predicts lower attrition." },
  { name: "Decision Latency", value: "+21%", note: "Governance gaps add decision drag." },
  { name: "Team Alignment", value: "+14%", note: "Improved with weekly narrative cadence." }
];

const coachData = [
  {
    title: "Governance Cadence",
    detail: "Install a monthly board rhythm and define decision rights for the top five decisions.",
    time: "2 hrs / week",
    impact: "+8 Governance"
  },
  {
    title: "Energy Zone Ritual",
    detail: "Weekly stress zone reset + protected deep work blocks.",
    time: "45 min / week",
    impact: "+7 Energy Management"
  },
  {
    title: "Narrative Rhythm",
    detail: "Weekly 10-min update to cascade strategic clarity to the full org.",
    time: "20 min / week",
    impact: "+6 Communication Rhythm"
  }
];

const cohortData = [
  { name: "First-time Founders", value: 74 },
  { name: "Series A CEOs", value: 81 },
  { name: "Technical Founders", value: 69 },
  { name: "Solo Entrepreneurs", value: 77 }
];

const timelineData = [
  { title: "Phase 1: Overload", note: "Weeks 1–4: Strain climbed while communication cadence dropped." },
  { title: "Phase 2: Correction", note: "Weeks 5–8: Trust formula lifted; readiness stabilized." },
  { title: "Phase 3: Stabilization", note: "Weeks 9–12: Consistency rose; governance gap surfaced." }
];

const recommendations = [
  {
    title: "Codify Governance",
    note: "Board cadence + decision rights unlocks strategic scale.",
    meta: "Framework: CEO Test"
  },
  {
    title: "Install Weekly Narrative",
    note: "Creates org-wide alignment and lowers execution drift.",
    meta: "Framework: Communication Rhythm"
  },
  {
    title: "Energy Zone Ritual",
    note: "Stress zone control stabilizes performance across all domains.",
    meta: "Framework: Energy Management"
  }
];

const heatmap = document.getElementById("heatmap");
const selfGrid = document.getElementById("selfGrid");
const driverGrid = document.getElementById("driverGrid");
const riskGrid = document.getElementById("riskGrid");
const velocityGrid = document.getElementById("velocityGrid");
const consistency = document.getElementById("consistency");
const outcomeGrid = document.getElementById("outcomeGrid");
const coachGrid = document.getElementById("coachGrid");
const cohortGrid = document.getElementById("cohortGrid");
const timeline = document.getElementById("timeline");
const recommendationsGrid = document.getElementById("recommendations");
const matrix = document.getElementById("matrix");

const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modalTitle");
const modalBody = document.getElementById("modalBody");
const modalList = document.getElementById("modalList");
const modalClose = document.getElementById("modalClose");

const selfCategories = [
  {
    title: "Energy Management",
    score: 74,
    interpretation: "You focus well, but stress zone control is inconsistent.",
    visualization: "Deep work + stress zone balance"
  },
  {
    title: "Purpose & Direction",
    score: 70,
    interpretation: "You know your zone of genius but don’t protect it enough.",
    visualization: "Zone-of-genius alignment"
  },
  {
    title: "Self-Awareness",
    score: 73,
    interpretation: "You notice patterns, but blind spots still leak decisions.",
    visualization: "Bias + trigger awareness"
  },
  {
    title: "Leading Above the Line",
    score: 71,
    interpretation: "Curiosity appears, but recovery is not consistent.",
    visualization: "Recovery speed + response style"
  },
  {
    title: "Emotional Intelligence",
    score: 80,
    interpretation: "You name emotions and show vulnerability effectively.",
    visualization: "Emotion naming + clean expression"
  },
  {
    title: "Grounded Presence",
    score: 76,
    interpretation: "Practice exists; stillness could be more consistent.",
    visualization: "Stillness cadence + listening level"
  }
];

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
    card.addEventListener("click", () => openModal(item));
    heatmap.appendChild(card);
  });
}

function initSelfOverview() {
  if (!selfGrid) return;
  selfCategories.forEach(item => {
    const card = document.createElement("div");
    card.className = "self-card";
    const circumference = 2 * Math.PI * 25;
    const offset = circumference - (item.score / 100) * circumference;
    card.innerHTML = `
      <div class="self-card__meta">${item.visualization}</div>
      <div class="self-card__title">${item.title}</div>
      <div class="self-card__viz">
        <svg viewBox="0 0 60 60" class="self-card__ring">
          <circle class="self-card__ring-bg" cx="30" cy="30" r="25" />
          <circle class="self-card__ring-fg" cx="30" cy="30" r="25" style="stroke-dasharray:${circumference};stroke-dashoffset:${offset}" />
        </svg>
        <div class="self-card__meter"><div class="self-card__meter-fill" style="width:${item.score}%"></div></div>
      </div>
      <div class="self-card__hint">${item.interpretation}</div>
    `;
    selfGrid.appendChild(card);
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
      <div class="driver-card__meta">${item.cluster}</div>
      <div class="driver-card__impact">${item.impact}</div>
      <div class="driver-card__impact"><strong>Leverage:</strong> ${item.opportunity}</div>
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
      <div class="risk-card__note">${item.note}</div>
    `;
    riskGrid.appendChild(card);
  });
}

function initVelocity() {
  velocityData.forEach(item => {
    const card = document.createElement("div");
    card.className = "velocity-card";
    card.innerHTML = `
      <div class="velocity-card__label">${item.name}</div>
      <div class="velocity-card__value">${item.value}</div>
      <div class="velocity-card__meta">${item.projection}</div>
    `;
    velocityGrid.appendChild(card);
  });
}

function initConsistency() {
  consistencyData.forEach(item => {
    const row = document.createElement("div");
    row.className = "consistency-row";
    row.innerHTML = `
      <div>${item.name}</div>
      <div class="consistency-bar"><div class="consistency-fill" style="width:${item.volatility}%"></div></div>
      <div>${item.volatility}%</div>
    `;
    consistency.appendChild(row);
  });
}

function initOutcome() {
  outcomeData.forEach(item => {
    const card = document.createElement("div");
    card.className = "outcome-card";
    card.innerHTML = `
      <div class="outcome-card__label">${item.name}</div>
      <div class="outcome-card__value">${item.value}</div>
      <div class="outcome-card__note">${item.note}</div>
    `;
    outcomeGrid.appendChild(card);
  });
}

function initCoach() {
  coachData.forEach(item => {
    const card = document.createElement("div");
    card.className = "coach-card";
    card.innerHTML = `
      <div class="coach-card__title">${item.title}</div>
      <p>${item.detail}</p>
      <div class="coach-card__meta">Time: ${item.time} • Impact: ${item.impact}</div>
    `;
    coachGrid.appendChild(card);
  });
}

function initCohorts() {
  cohortData.forEach(item => {
    const card = document.createElement("div");
    card.className = "cohort-card";
    card.innerHTML = `
      <div class="cohort-card__label">${item.name}</div>
      <div class="cohort-card__value">${item.value}</div>
      <div class="cohort-card__bar"><div class="cohort-card__fill" style="width:${item.value}%"></div></div>
    `;
    cohortGrid.appendChild(card);
  });
}

function initTimeline() {
  timelineData.forEach(item => {
    const card = document.createElement("div");
    card.className = "timeline-card";
    card.innerHTML = `
      <div class="timeline-card__title">${item.title}</div>
      <div class="timeline-card__note">${item.note}</div>
    `;
    timeline.appendChild(card);
  });
}

function initRecommendations() {
  recommendations.forEach(item => {
    const card = document.createElement("div");
    card.className = "action-card";
    card.innerHTML = `
      <div class="action-card__title">${item.title}</div>
      <p>${item.note}</p>
      <div class="action-card__meta">${item.meta}</div>
    `;
    recommendationsGrid.appendChild(card);
  });
}

function initBars() {
  document.querySelectorAll(".territory-card").forEach(card => {
    const score = Number(card.dataset.score || 0);
    const fill = card.querySelector(".bar__fill");
    fill.style.width = `${score}%`;
  });

  document.querySelectorAll(".friction__fill").forEach(bar => {
    const value = Number(bar.dataset.value || 0);
    bar.style.width = `${value}%`;
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

    svg.innerHTML = `
      <polygon points="${basePoints.map(p => `${p.x},${p.y}`).join(" ")}" fill="none" stroke="rgba(0,0,0,0.2)" stroke-width="1" />
      <polygon points="${basePoints.map(p => `${p.x},${p.y}`).join(" ")}" fill="rgba(0,0,0,0.02)" />
      <polygon points="${points.map(p => `${p.x},${p.y}`).join(" ")}" fill="rgba(0,0,0,0.1)" stroke="black" stroke-width="2" />
      ${points.map(p => `<circle cx="${p.x}" cy="${p.y}" r="4" fill="black" />`).join("")}
    `;
  });
}

function initMatrix() {
  const matrixData = [
    { name: "Governance", impact: 92, control: 78 },
    { name: "Purpose & Direction", impact: 76, control: 66 },
    { name: "Communication", impact: 70, control: 84 },
    { name: "Team Health", impact: 64, control: 55 },
    { name: "Strategic Clarity", impact: 60, control: 70 },
    { name: "Trust Formula", impact: 58, control: 72 }
  ];

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
initSelfOverview();
initDrivers();
initRisk();
initVelocity();
initConsistency();
initOutcome();
initCoach();
initCohorts();
initTimeline();
initRecommendations();
initBars();
initRings();
initRadar();
initMatrix();
