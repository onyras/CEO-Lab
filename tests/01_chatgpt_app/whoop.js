const heatData = [
  { name: "Energy", score: 74, percentile: 64, confidence: "High" },
  { name: "Purpose & Direction", score: 70, percentile: 52, confidence: "Medium" },
  { name: "Self-Awareness", score: 73, percentile: 60, confidence: "High" },
  { name: "Leading Above the Line", score: 71, percentile: 55, confidence: "Medium" },
  { name: "Emotional Intelligence", score: 80, percentile: 74, confidence: "High" },
  { name: "Grounded Presence", score: 76, percentile: 66, confidence: "Medium" },
  { name: "Trust Formula", score: 84, percentile: 82, confidence: "High" },
  { name: "Psych Safety", score: 79, percentile: 69, confidence: "High" },
  { name: "Multiplier", score: 81, percentile: 73, confidence: "High" },
  { name: "Comms Rhythm", score: 69, percentile: 49, confidence: "Medium" },
  { name: "Team Health", score: 71, percentile: 55, confidence: "Medium" },
  { name: "Delegation", score: 83, percentile: 79, confidence: "High" },
  { name: "Strategy", score: 88, percentile: 90, confidence: "High" },
  { name: "Culture System", score: 77, percentile: 65, confidence: "Medium" },
  { name: "Transitions", score: 73, percentile: 59, confidence: "Medium" },
  { name: "Systems Thinking", score: 79, percentile: 70, confidence: "High" },
  { name: "Org Design", score: 76, percentile: 63, confidence: "Medium" },
  { name: "Governance", score: 58, percentile: 22, confidence: "Low" }
];

const drivers = [
  { title: "Governance rules", note: "Lowest score. Most leverage." },
  { title: "Strategic narrative", note: "Vision repetition is low." },
  { title: "Stress zone control", note: "Energy zone skews overload." }
];

const risks = [
  { title: "Burnout risk", value: 58 },
  { title: "Execution drag", value: 46 },
  { title: "Governance drift", value: 72 }
];

const actions = [
  { title: "Codify decision rights", note: "Write the top 5 decision owners." },
  { title: "Weekly narrative update", note: "10 minutes every Monday." },
  { title: "Energy zone ritual", note: "Identify overload triggers and reset weekly." }
];

const consistency = [
  { name: "Energy", value: 24 },
  { name: "Purpose", value: 26 },
  { name: "Communication", value: 30 },
  { name: "Trust", value: 10 }
];

const models = [
  {
    title: "Leadership Load",
    value: "Overload",
    score: 78,
    note: "High strain + low comms rhythm raises load.",
    tip: "Combines Strain + Communication Rhythm + Decision Friction."
  },
  {
    title: "Trust Half‑Life",
    value: "6 weeks",
    score: 62,
    note: "Trust decays without new feedback loops.",
    tip: "Trust Formula + Psychological Safety + Team Health."
  },
  {
    title: "Execution Drag",
    value: "+22%",
    score: 68,
    note: "Strategy is clear, but cadence slows execution.",
    tip: "Strategic Clarity + Communication Rhythm + Org Design."
  },
  {
    title: "Decision Bottleneck",
    value: "41%",
    score: 41,
    note: "More decisions route through you than healthy.",
    tip: "Delegation + Governance + Communication Rhythm."
  },
  {
    title: "Recovery Efficiency",
    value: "Moderate",
    score: 72,
    note: "You recover, but not predictably.",
    tip: "Energy + Grounded Presence + Emotional Intelligence."
  },
  {
    title: "Leadership Debt",
    value: "30 pts",
    score: 30,
    note: "Gap between top and bottom skills.",
    tip: "Highest sub‑dimension minus lowest."
  },
  {
    title: "Resilience Loop",
    value: "Fragile",
    score: 64,
    note: "Recovery doesn’t compound after hard weeks.",
    tip: "Energy + Grounded Presence + Emotional Intelligence."
  },
  {
    title: "Cohort Signature",
    value: "Strategist‑Heavy",
    score: 81,
    note: "Strong strategy; needs tighter execution cadence.",
    tip: "Compare to CEO cohort archetypes."
  },
  {
    title: "Leadership Elasticity",
    value: "High",
    score: 72,
    note: "Small changes create big gains.",
    tip: "Projected lift per +1 on weakest areas."
  }
];

const matrixData = [
  { name: "Governance", impact: 92, control: 78 },
  { name: "Energy", impact: 76, control: 66 },
  { name: "Communication", impact: 70, control: 84 },
  { name: "Team Health", impact: 64, control: 55 }
];

const heat = document.getElementById("heat");
const driversEl = document.getElementById("drivers");
const risksEl = document.getElementById("risks");
const actionsEl = document.getElementById("actions");
const consistencyEl = document.getElementById("consistency");
const matrix = document.getElementById("matrix");
const modelsEl = document.getElementById("models");
const evidenceEl = document.getElementById("evidence");
const ladderEl = document.getElementById("ladder");
const whatifSlider = document.getElementById("whatifSlider");
const whatifDelta = document.getElementById("whatifDelta");
const whatifScore = document.getElementById("whatifScore");
const paydownEl = document.getElementById("paydown");
const trajectoryValue = document.getElementById("trajectoryValue");
const trajectoryNote = document.getElementById("trajectoryNote");
const leverageValue = document.getElementById("leverageValue");
const leverageNote = document.getElementById("leverageNote");
const selfOverviewEl = document.getElementById("selfOverview");

function scoreToColor(score) {
  const hue = 120 - score * 1.1;
  return `hsl(${hue}, 70%, 30%)`;
}

heatData.forEach(item => {
  const el = document.createElement("div");
  el.className = "heat__item";
  el.style.borderColor = scoreToColor(item.score);
  el.innerHTML = `
    <div class="heat__score">${item.score}</div>
    <div class="heat__name">${item.name}</div>
    <div class="heat__meta">Percentile: ${item.percentile}%</div>
    <div class="heat__meta">Confidence: ${item.confidence}</div>
  `;
  heat.appendChild(el);
});

const selfOverview = [
  {
    title: "Energy Management",
    score: 74,
    hint: "Deep work exists, but stress zone control drifts.",
    meta: "Deep work + stress zone balance"
  },
  {
    title: "Purpose & Direction",
    score: 70,
    hint: "Zone of genius is clear but not protected enough.",
    meta: "Genius alignment + purpose clarity"
  },
  {
    title: "Self-Awareness",
    score: 73,
    hint: "Pattern recognition is decent; blind spots still leak.",
    meta: "Bias + trigger awareness"
  },
  {
    title: "Leading Above the Line",
    score: 71,
    hint: "Curiosity appears, recovery is not consistent.",
    meta: "Response style + recovery speed"
  },
  {
    title: "Emotional Intelligence",
    score: 80,
    hint: "Emotions are named and expressed cleanly.",
    meta: "Emotion naming + clean expression"
  },
  {
    title: "Grounded Presence",
    score: 76,
    hint: "Practice exists; stillness cadence can improve.",
    meta: "Stillness + listening level"
  }
];

if (selfOverviewEl) {
  selfOverview.forEach(item => {
    const card = document.createElement("div");
    card.className = "self__card";
    const circumference = 2 * Math.PI * 25;
    const offset = circumference - (item.score / 100) * circumference;
    card.innerHTML = `
      <div class="self__meta">${item.meta}</div>
      <div class="self__title">${item.title}</div>
      <div class="self__viz">
        <svg viewBox="0 0 60 60" class="self__ring">
          <circle class="self__ring-bg" cx="30" cy="30" r="25" />
          <circle class="self__ring-fg" cx="30" cy="30" r="25" style="stroke-dasharray:${circumference};stroke-dashoffset:${offset}" />
        </svg>
        <div class="self__meter"><div class="self__meter-fill" style="width:${item.score}%"></div></div>
      </div>
      <div class="self__hint">${item.hint}</div>
    `;
    selfOverviewEl.appendChild(card);
  });
}

drivers.forEach(item => {
  const el = document.createElement("div");
  el.className = "driver__item";
  el.innerHTML = `<strong>${item.title}</strong><div class="small">${item.note}</div>`;
  driversEl.appendChild(el);
});

risks.forEach(item => {
  const el = document.createElement("div");
  el.className = "risk__item";
  el.innerHTML = `<strong>${item.title}</strong><div class="small">${item.value}%</div>`;
  risksEl.appendChild(el);
});

actions.forEach(item => {
  const el = document.createElement("div");
  el.className = "list__item";
  el.innerHTML = `<strong>${item.title}</strong><div class="small">${item.note}</div>`;
  actionsEl.appendChild(el);
});

consistency.forEach(item => {
  const row = document.createElement("div");
  row.className = "domain";
  row.innerHTML = `
    <span>${item.name}</span>
    <div class="bar"><div class="bar__fill" style="width:${item.value}%"></div></div>
    <strong>${item.value}%</strong>
  `;
  consistencyEl.appendChild(row);
});

models.forEach(item => {
  const el = document.createElement("div");
  el.className = "model";
  el.innerHTML = `
    <div class="model__row">
      <span class="model__title">${item.title}
        <span class="tip">?
          <span class="tip__text">${item.tip}</span>
        </span>
      </span>
      <span class="model__value">${item.value}</span>
    </div>
    <div class="model__bar"><div class="model__fill" style="width:${item.score}%"></div></div>
    <div class="small">${item.note}</div>
  `;
  modelsEl.appendChild(el);
});

trajectoryValue.textContent = "Moderate";
trajectoryNote.textContent = "Low Energy + high volatility in Purpose increase risk.";
leverageValue.textContent = "+4.8";
leverageNote.textContent = "Improving Governance by +10 lifts overall score fastest.";

const evidence = [
  {
    title: "Leadership Load",
    items: [
      "Strain 61 (moderate)",
      "Communication Rhythm 69 (low)",
      "Decision Bottleneck 41% (high)"
    ]
  },
  {
    title: "Trust Half‑Life",
    items: [
      "Trust Formula 84 (high)",
      "Psych Safety 79 (good)",
      "Team Health 71 (medium)"
    ]
  },
  {
    title: "Execution Drag",
    items: [
      "Strategic Clarity 88 (elite)",
      "Comms Rhythm 69 (low)",
      "Org Design 76 (medium)"
    ]
  },
  {
    title: "Recovery Efficiency",
    items: [
      "Energy 74 (good)",
      "Grounded Presence 76 (good)",
      "Emotional Intelligence 80 (good)"
    ]
  }
];

evidence.forEach(item => {
  const card = document.createElement("div");
  card.className = "evidence__item";
  card.innerHTML = `
    <div class="evidence__title">${item.title}</div>
    <div class="evidence__list">
      ${item.items.map(text => `<div>${text}</div>`).join("")}
    </div>
  `;
  evidenceEl.appendChild(card);
});

const ladderData = [
  {
    title: "Communication Rhythm",
    fact: "Score 69 (49th percentile)",
    interpretation: "Strategy exists but cadence is irregular.",
    impact: "Execution slows by ~22% over 90 days."
  },
  {
    title: "Governance",
    fact: "Score 58 (22nd percentile)",
    interpretation: "Decision rights are unclear and board cadence is weak.",
    impact: "Leaders wait for approvals, scaling slows."
  },
  {
    title: "Purpose & Direction",
    fact: "Score 70 (52nd percentile)",
    interpretation: "Zone of genius is known but not fully protected.",
    impact: "Motivation and focus dip under pressure."
  }
];

ladderData.forEach(item => {
  const row = document.createElement("div");
  row.className = "ladder__row";
  row.innerHTML = `
    <div class="ladder__title">${item.title}</div>
    <div><span class="ladder__label">Fact</span> ${item.fact}</div>
    <div><span class="ladder__label">Interpretation</span> ${item.interpretation}</div>
    <div><span class="ladder__label">Impact</span> ${item.impact}</div>
  `;
  ladderEl.appendChild(row);
});

function updateWhatIf(value) {
  const baseScore = 78;
  const elasticity = 0.48;
  const projected = (baseScore + value * elasticity).toFixed(1);
  whatifDelta.textContent = `+${value}`;
  whatifScore.textContent = projected;
}

whatifSlider.addEventListener("input", (e) => {
  updateWhatIf(Number(e.target.value));
});

updateWhatIf(Number(whatifSlider.value));

const paydownPlan = [
  { title: "30 Days", note: "Reduce leadership debt by 10 points.", value: 33 },
  { title: "60 Days", note: "Reduce leadership debt by 20 points.", value: 66 },
  { title: "90 Days", note: "Close the gap completely.", value: 100 }
];

paydownPlan.forEach(item => {
  const row = document.createElement("div");
  row.className = "paydown__row";
  row.innerHTML = `
    <div class="paydown__title">${item.title}</div>
    <div class="small">${item.note}</div>
    <div class="paydown__bar"><div class="paydown__fill" style="width:${item.value}%"></div></div>
  `;
  paydownEl.appendChild(row);
});

const careerData = [
  { title: "Career Leverage Index", value: "82", note: "High influence potential in senior roles." },
  { title: "Market Signal", value: "Strong", note: "Strategy + trust stack signals executive readiness." },
  { title: "Risk Flag", value: "Governance Gap", note: "Limits investor-facing or scale roles." },
  { title: "Comp Readiness", value: "Top 20%", note: "Near premium band; needs governance lift." }
];

const roleFit = [
  { title: "Strategy CEO / Founder", value: 86, note: "Strong fit now." },
  { title: "Scale CEO (100+)", value: 68, note: "Needs governance + cadence." },
  { title: "COO / Operator", value: 72, note: "Decent fit; comms rhythm can improve." }
];

const rolePath = [
  { title: "Step 1: Governance", value: 40, note: "Define decision rights + board cadence." },
  { title: "Step 2: Cadence", value: 65, note: "Weekly narrative + monthly strategic meeting." },
  { title: "Step 3: Scale Readiness", value: 85, note: "Org design + delegation stability." }
];

const proofSheet = [
  {
    label: "Strengths You Can Claim",
    title: "Strategic Clarity + Trust",
    items: [
      "Strategy score 88 (90th percentile)",
      "Trust Formula 84 (82nd percentile)",
      "Decision distribution is healthy"
    ]
  },
  {
    label: "Gaps You Should Own",
    title: "Governance + Cadence",
    items: [
      "Governance 58 (22nd percentile)",
      "Communication rhythm 69 (49th percentile)",
      "Decision friction 41% (high)"
    ]
  },
  {
    label: "Story for Career Growth",
    title: "From Strategist to Scale Leader",
    items: [
      "90-day governance uplift plan",
      "Weekly narrative cadence implemented",
      "Volatility reduced in energy system"
    ]
  }
];

const careerEl = document.getElementById("career");
const rolefitEl = document.getElementById("rolefit");
const rolepathEl = document.getElementById("rolepath");
const proofEl = document.getElementById("proof");

careerEl.innerHTML = `
  <div class="career__grid">
    ${careerData.map(item => `
      <div class="career__card">
        <div class="small">${item.title}</div>
        <div class="career__value">${item.value}</div>
        <div class="small">${item.note}</div>
      </div>
    `).join("")}
  </div>
`;

roleFit.forEach(item => {
  const row = document.createElement("div");
  row.className = "rolefit__item";
  row.innerHTML = `
    <div><strong>${item.title}</strong></div>
    <div class="small">${item.note}</div>
    <div class="rolefit__bar"><div class="rolefit__fill" style="width:${item.value}%"></div></div>
  `;
  rolefitEl.appendChild(row);
});

rolePath.forEach(item => {
  const row = document.createElement("div");
  row.className = "rolepath__item";
  row.innerHTML = `
    <div><strong>${item.title}</strong></div>
    <div class="small">${item.note}</div>
    <div class="rolepath__bar"><div class="rolepath__fill" style="width:${item.value}%"></div></div>
  `;
  rolepathEl.appendChild(row);
});

proofEl.innerHTML = `
  <div class="proof__grid">
    ${proofSheet.map(card => `
      <div class="proof__card">
        <div class="proof__label">${card.label}</div>
        <div class="proof__title">${card.title}</div>
        <div class="proof__list">
          ${card.items.map(item => `<div>${item}</div>`).join("")}
        </div>
      </div>
    `).join("")}
  </div>
`;

function initBars() {
  document.querySelectorAll(".domain").forEach(card => {
    const score = Number(card.dataset.score || 0);
    const fill = card.querySelector(".bar__fill");
    if (fill && score) fill.style.width = `${score}%`;
  });

  document.querySelectorAll(".bar__fill[data-value]").forEach(bar => {
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

function initSparkline() {
  document.querySelectorAll(".sparkline").forEach(svg => {
    const points = (svg.dataset.points || "").split(",").map(Number);
    const width = 260;
    const height = 90;
    const pad = 8;
    const max = Math.max(...points);
    const min = Math.min(...points);

    const scaleX = (i) => pad + (i / (points.length - 1)) * (width - pad * 2);
    const scaleY = (val) => {
      const range = max - min || 1;
      return height - pad - ((val - min) / range) * (height - pad * 2);
    };

    const d = points.map((val, idx) => `${idx === 0 ? "M" : "L"}${scaleX(idx)},${scaleY(val)}`).join(" ");

    svg.innerHTML = `<path d="${d}" fill="none" stroke="${getComputedStyle(document.body).color}" stroke-width="2" />`;
  });
}

function initArea() {
  document.querySelectorAll(".area").forEach(svg => {
    const points = (svg.dataset.points || "").split(",").map(Number);
    const width = 520;
    const height = 170;
    const pad = 12;
    const max = Math.max(...points);
    const min = Math.min(...points);

    const scaleX = (i) => pad + (i / (points.length - 1)) * (width - pad * 2);
    const scaleY = (val) => {
      const range = max - min || 1;
      return height - pad - ((val - min) / range) * (height - pad * 2);
    };

    const d = points.map((val, idx) => `${idx === 0 ? "M" : "L"}${scaleX(idx)},${scaleY(val)}`).join(" ");
    const area = `${d} L ${width - pad},${height - pad} L ${pad},${height - pad} Z`;

    svg.innerHTML = `
      <path d="${area}" fill="rgba(127,171,200,0.25)" />
      <path d="${d}" fill="none" stroke="${getComputedStyle(document.body).color}" stroke-width="2" />
    `;
  });
}

function initDual() {
  document.querySelectorAll(".dual").forEach(svg => {
    const a = (svg.dataset.a || "").split(",").map(Number);
    const b = (svg.dataset.b || "").split(",").map(Number);
    const width = 520;
    const height = 170;
    const pad = 12;
    const all = [...a, ...b];
    const max = Math.max(...all);
    const min = Math.min(...all);

    const scaleX = (i) => pad + (i / (a.length - 1)) * (width - pad * 2);
    const scaleY = (val) => {
      const range = max - min || 1;
      return height - pad - ((val - min) / range) * (height - pad * 2);
    };

    const path = (arr) => arr.map((val, idx) => `${idx === 0 ? "M" : "L"}${scaleX(idx)},${scaleY(val)}`).join(" ");

    svg.innerHTML = `
      <path d="${path(a)}" fill="none" stroke="${getComputedStyle(document.documentElement).getPropertyValue('--accent')}" stroke-width="2" />
      <path d="${path(b)}" fill="none" stroke="${getComputedStyle(document.documentElement).getPropertyValue('--accent-3')}" stroke-width="2" />
    `;
  });
}

function initBarsChart() {
  document.querySelectorAll(".bars").forEach(svg => {
    const points = (svg.dataset.points || "").split(",").map(Number);
    const width = 520;
    const height = 170;
    const pad = 12;
    const max = Math.max(...points);

    const barWidth = (width - pad * 2) / points.length - 6;

    svg.innerHTML = points.map((val, idx) => {
      const x = pad + idx * (barWidth + 6);
      const h = (val / max) * (height - pad * 2);
      const y = height - pad - h;
      return `<rect x="${x}" y="${y}" width="${barWidth}" height="${h}" fill="rgba(255,255,255,0.18)" />`;
    }).join("");
  });
}

function initMatrix() {
  matrixData.forEach(item => {
    const dot = document.createElement("div");
    dot.className = "matrix-dot";
    dot.style.left = `calc(${item.control}% - 5px)`;
    dot.style.top = `calc(${100 - item.impact}% - 5px)`;
    const label = document.createElement("div");
    label.className = "matrix-dot__label";
    label.textContent = item.name;
    dot.appendChild(label);
    matrix.appendChild(dot);
  });
}

initBars();
initRings();
initSparkline();
initArea();
initDual();
initBarsChart();
initMatrix();
