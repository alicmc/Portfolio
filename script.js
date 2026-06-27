// projects array
const projects = [
  {
    title: "Coin Modeling",
    tag: "Creative",
    description:
      "Documentation for an experimental process converting photos of ancient coins into tangible 3D objects.",
    stack: ["Blender", "HTML"],
    accent: "85, 245, 223",
    url: "https://alicmc.github.io/coins/",
  },
  {
    title: "Smishing Test",
    tag: "Cybersecurity",
    description:
      "A simple SMShing simulation script designed to carry out internal phishing campaigns.",
    stack: ["Python", "Web APIs"],
    accent: "255, 230, 109",
    url: "https://github.com/alicmc/SmishingTest",
  },
  {
    title: "Virtual Kitchen",
    tag: "Web Dev",
    description:
      "A simple dashboard to track pantry inventory and come up with recipes.",
    stack: ["HTML", "JavaScript", "CSS"],
    accent: "255, 103, 180",
    url: "https://w3stu.cs.jmu.edu/mileacax/cs343/project/",
  },
  {
    title: "AOE Points",
    tag: "Product",
    description:
      "A simple Electron App to track members' points and send out automated emails.",
    stack: ["JavaScript", "React", "Electron App"],
    accent: "137, 255, 157",
    url: "#",
  },
  {
    title: "Animal Classifier",
    tag: "ML",
    description:
      "Experimental code using vision transformers to classify a small animal dataset.",
    stack: ["Python", "Numpy", "TensorFlow"],
    accent: "116, 157, 255",
    url: "https://github.com/alicmc/MLProj2",
  },
  {
    title: "Refugee Services",
    tag: "Product",
    description:
      "A simple app connecting refugees to service providers around them.",
    stack: ["Flutter", "SQL", "RESTful APIs"],
    accent: "255, 143, 88",
    url: "#",
  },
];

// redering projects
const grid = document.querySelector("#project-grid");
const count = document.querySelector("#project-count");
const filterButtons = [...document.querySelectorAll(".filter")];
const shuffleButton = document.querySelector("#shuffle-projects");
let currentFilter = "all";
let activeProjects = [...projects];

function renderProjects(items) {
  grid.innerHTML = items
    .map(
      (project, index) => `
    <article class="project-card reveal visible" style="--card-rgb: ${project.accent}">
      <a href="${project.url}" aria-label="Open ${project.title} project">
        <div class="project-top">
          <span class="project-index">${String(index + 1).padStart(2, "0")}</span>
          <span class="project-tag">${project.tag}</span>
        </div>
        <div>
          <h3>${project.title}</h3>
          <p>${project.description}</p>
          <div class="project-stack" aria-label="Technologies">
            ${project.stack.map((tech) => `<span>${tech}</span>`).join("")}
          </div>
        </div>
      </a>
    </article>
  `,
    )
    .join("");

  count.textContent = items.length;
  bindCardGlow();
}

function applyFilter(filter) {
  currentFilter = filter;
  activeProjects =
    filter === "all"
      ? [...projects]
      : projects.filter((project) => project.tag === filter);
  renderProjects(activeProjects);
  filterButtons.forEach((button) => {
    const isActive = button.dataset.filter === filter;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
}

function bindCardGlow() {
  document.querySelectorAll(".project-card").forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${event.clientX - rect.left}px`);
      card.style.setProperty("--my", `${event.clientY - rect.top}px`);
    });
  });
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => applyFilter(button.dataset.filter));
});

shuffleButton.addEventListener("click", () => {
  activeProjects = [...activeProjects].sort(() => Math.random() - 0.5);
  renderProjects(activeProjects);
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 },
);

document.querySelectorAll(".reveal").forEach((element, index) => {
  element.style.transitionDelay = `${Math.min(index * 55, 360)}ms`;
  revealObserver.observe(element);
});

function initTypewriter() {
  const typingText = document.querySelector("[data-typing-text]");

  if (!typingText) {
    return;
  }

  const fullText =
    typingText.dataset.typingText || typingText.textContent.trim();
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (prefersReducedMotion) {
    typingText.textContent = fullText;
    typingText.classList.add("typing-complete");
    return;
  }

  typingText.textContent = "";

  let index = 0;
  const typeNextCharacter = () => {
    typingText.textContent = fullText.slice(0, index);
    index += 1;

    if (index <= fullText.length) {
      const pause = fullText[index - 2] === "," ? 150 : 24 + Math.random() * 36;
      window.setTimeout(typeNextCharacter, pause);
      return;
    }

    typingText.classList.add("typing-complete");
  };

  window.setTimeout(typeNextCharacter, 520);
}

const canvas = document.querySelector("#sky");
const ctx = canvas.getContext("2d");
let stars = [];
let pointer = { x: 0.5, y: 0.5 };
let reducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

function resizeSky() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.floor(window.innerWidth * dpr);
  canvas.height = Math.floor(window.innerHeight * dpr);
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const starCount = Math.min(
    180,
    Math.max(72, Math.floor(window.innerWidth / 8)),
  );
  stars = Array.from({ length: starCount }, (_, index) => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    r: Math.random() * 1.8 + 0.45,
    speed: Math.random() * 0.24 + 0.05,
    twinkle: Math.random() * Math.PI * 2,
    points: index % 7 === 0 ? 4 : 0,
    color: ["#fff8e8", "#55f5df", "#ff67b4", "#ffe66d"][index % 4],
  }));
}

function drawStar(star, time) {
  const driftX = (pointer.x - 0.5) * star.speed * 34;
  const driftY = (pointer.y - 0.5) * star.speed * 24;
  const x = star.x + driftX;
  const y = star.y + driftY;
  const pulse = reducedMotion
    ? 1
    : 0.58 + Math.sin(time * 0.002 + star.twinkle) * 0.32;

  ctx.save();
  ctx.globalAlpha = Math.max(0.25, pulse);
  ctx.fillStyle = star.color;
  ctx.shadowBlur = star.points ? 18 : 8;
  ctx.shadowColor = star.color;

  if (star.points) {
    ctx.translate(x, y);
    ctx.rotate(time * 0.0002 + star.twinkle);
    ctx.beginPath();
    for (let i = 0; i < 8; i += 1) {
      const radius = i % 2 === 0 ? star.r * 4.5 : star.r;
      const angle = (Math.PI * 2 * i) / 8;
      ctx.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
    }
    ctx.closePath();
    ctx.fill();
  } else {
    ctx.beginPath();
    ctx.arc(x, y, star.r, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

function animateSky(time = 0) {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  stars.forEach((star) => drawStar(star, time));
  requestAnimationFrame(animateSky);
}

window.addEventListener("pointermove", (event) => {
  pointer = {
    x: event.clientX / window.innerWidth,
    y: event.clientY / window.innerHeight,
  };
});

window.addEventListener("resize", resizeSky);

resizeSky();
animateSky();
renderProjects(projects);
initTypewriter();
