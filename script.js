// projects array
const projects = [
  {
    title: "Coin Modeling",
    tag: "Creative",
    description:
      "Documentation for an experimental process converting photos of ancient coins into tangible 3D objects.",
    stack: ["Blender", "HTML"],
    url: "https://alicmc.github.io/coins/",
    githubUrl: "https://github.com/alicmc/coin-modeling",
    media: createDemoMedia("Coin Modeling"),
  },
  {
    title: "Smishing Test",
    tag: "Cybersecurity",
    description:
      "A SMShing simulation script designed to carry out internal phishing campaigns.",
    stack: ["Python", "Web APIs"],
    url: "#",
    githubUrl: "https://github.com/alicmc/smishing-test",
    media: createDemoMedia("Smishing Test"),
  },
  {
    title: "Virtual Kitchen",
    tag: "Web Dev",
    description:
      "A simple dashboard to track pantry inventory and come up with recipes.",
    stack: ["HTML", "JavaScript", "CSS"],
    url: "https://w3stu.cs.jmu.edu/mileacax/cs343/project/",
    githubUrl: "https://github.com/alicmc/virtual-kitchen",
    media: createDemoMedia("Virtual Kitchen"),
  },
  {
    title: "AOE Points",
    tag: "Product",
    description:
      "A React-based Electron App to track members' points and send out automated emails.",
    stack: ["JavaScript", "React", "Electron App"],
    url: "#",
    githubUrl: "https://github.com/alicmc/aoe-points",
    media: createDemoMedia("AOE Points"),
  },
  {
    title: "Animal Classifier",
    tag: "ML",
    description:
      "Experimental code using vision transformers to classify a small animal dataset.",
    stack: ["Python", "Numpy", "TensorFlow"],
    url: "#",
    githubUrl: "https://github.com/alicmc/animal-classifier",
    media: createDemoMedia("Animal Classifier"),
  },
  {
    title: "Refugee Services",
    tag: "Product",
    description:
      "A web app connecting refugees to service providers around them.",
    stack: ["Flutter", "SQL", "RESTful APIs"],
    url: "#",
    githubUrl: "https://github.com/alicmc/refugee-services",
    media: createDemoMedia("Refugee Services"),
  },
];

function createDemoMedia(title) {
  return [
    {
      type: "image",
      src: "#",
      alt: `${title} interface screenshot placeholder`,
      caption: "Main interface screenshot",
    },
    {
      type: "video",
      src: "#",
      poster: "#",
      caption: "Short demo walkthrough",
    },
    {
      type: "image",
      src: "#",
      alt: `${title} feature detail placeholder`,
      caption: "Feature detail screenshot",
    },
  ];
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function projectHref(project) {
  if (project.url !== "#") {
    return project.url;
  }

  return `project.html?project=${encodeURIComponent(slugify(project.title))}`;
}

function findProjectBySlug(slug) {
  return projects.find((project) => slugify(project.title) === slug);
}

// redering projects
const grid = document.querySelector("#project-grid");
const count = document.querySelector("#project-count");
const projectToolbar = document.querySelector(".project-toolbar");
const shuffleButton = document.querySelector("#shuffle-projects");
let currentFilter = "all";
let activeProjects = [...projects];

function hashString(value) {
  return [...value].reduce(
    (hash, char) => Math.imul(31, hash) + char.charCodeAt(0) || 0,
    0,
  );
}

function hslToRgb(hue, saturation, lightness) {
  const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation;
  const huePrime = hue / 60;
  const x = chroma * (1 - Math.abs((huePrime % 2) - 1));
  const [r1, g1, b1] =
    huePrime < 1
      ? [chroma, x, 0]
      : huePrime < 2
        ? [x, chroma, 0]
        : huePrime < 3
          ? [0, chroma, x]
          : huePrime < 4
            ? [0, x, chroma]
            : huePrime < 5
              ? [x, 0, chroma]
              : [chroma, 0, x];
  const match = lightness - chroma / 2;

  return [r1, g1, b1].map((channel) => Math.round((channel + match) * 255));
}

function projectAccent(title) {
  const hash = Math.abs(hashString(title));
  const palette = [
    [178, 0.72, 0.58],
    [214, 0.74, 0.62],
    [258, 0.68, 0.66],
    [316, 0.72, 0.64],
    [22, 0.78, 0.62],
    [48, 0.82, 0.6],
    [138, 0.68, 0.58],
    [332, 0.76, 0.62],
  ];
  const [baseHue, saturation, lightness] = palette[hash % palette.length];
  const hue = baseHue + (((hash >> 8) % 15) - 7);

  return hslToRgb(hue % 360, saturation, lightness).join(", ");
}

function renderProjects(items) {
  grid.innerHTML = items
    .map(
      (project, index) => `
    <article class="project-card reveal visible" style="--card-rgb: ${projectAccent(project.title)}">
      <a href="${projectHref(project)}" aria-label="Open ${project.title} project">
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

function renderFilters() {
  const tags = [...new Set(projects.map((project) => project.tag))].sort();

  projectToolbar.innerHTML = ["all", ...tags]
    .map((filter) => {
      const isActive = filter === currentFilter;
      const label = filter === "all" ? "All" : filter;

      return `
        <button
          class="filter${isActive ? " active" : ""}"
          type="button"
          data-filter="${filter}"
          aria-pressed="${isActive}"
        >
          ${label}
        </button>
      `;
    })
    .join("");

  projectToolbar.querySelectorAll(".filter").forEach((button) => {
    button.addEventListener("click", () => applyFilter(button.dataset.filter));
  });
}

function applyFilter(filter) {
  currentFilter = filter;
  activeProjects =
    filter === "all"
      ? [...projects]
      : projects.filter((project) => project.tag === filter);
  renderProjects(activeProjects);
  projectToolbar.querySelectorAll(".filter").forEach((button) => {
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

if (shuffleButton) {
  shuffleButton.addEventListener("click", () => {
    activeProjects = [...activeProjects].sort(() => Math.random() - 0.5);
    renderProjects(activeProjects);
  });
}

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

function renderProjectPage() {
  const detail = document.querySelector("#project-detail");

  if (!detail) {
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const project = findProjectBySlug(params.get("project") || "");
  const title = document.querySelector("#project-title");
  const description = document.querySelector("#project-description");
  const tag = document.querySelector("#project-tag");
  const stack = document.querySelector("#project-stack");
  const githubLink = document.querySelector("#project-github");
  const mediaGrid = document.querySelector("#project-media-grid");

  if (!project) {
    if (title) {
      title.textContent = "Project not found";
    }

    if (description) {
      description.textContent =
        "This project page could not be matched to the portfolio data.";
    }

    return;
  }

  document.title = `${project.title} | Alice`;
  detail.style.setProperty("--card-rgb", projectAccent(project.title));

  if (title) {
    title.textContent = project.title;
  }

  if (description) {
    description.textContent = project.description;
  }

  if (tag) {
    tag.textContent = project.tag;
  }

  if (stack) {
    stack.innerHTML = "";
    project.stack.forEach((tech) => {
      const item = document.createElement("span");
      item.textContent = tech;
      stack.append(item);
    });
  }

  if (githubLink) {
    githubLink.href = project.githubUrl;
    githubLink.hidden = !project.githubUrl;
  }

  renderProjectMedia(project, mediaGrid);
}

function renderProjectMedia(project, container) {
  if (!container) {
    return;
  }

  container.innerHTML = "";
  const mediaItems = project.media || [];

  mediaItems.forEach((media, index) => {
    const figure = document.createElement("figure");
    figure.className = "project-media-item";
    figure.style.setProperty(
      "--media-index",
      `"${String(index + 1).padStart(2, "0")}"`,
    );

    const hasRealSource = media.src && media.src !== "#";

    if (media.type === "video" && hasRealSource) {
      const video = document.createElement("video");
      video.controls = true;
      video.preload = "metadata";
      video.src = media.src;

      if (media.poster && media.poster !== "#") {
        video.poster = media.poster;
      }

      figure.append(video);
    } else if (media.type === "image" && hasRealSource) {
      const image = document.createElement("img");
      image.src = media.src;
      image.alt = media.alt || `${project.title} demo image`;
      image.loading = "lazy";
      figure.append(image);
    } else {
      const placeholder = document.createElement("div");
      placeholder.className = `project-media-placeholder ${media.type === "video" ? "video" : "image"}`;
      placeholder.setAttribute("role", "img");
      placeholder.setAttribute(
        "aria-label",
        media.type === "video"
          ? `${project.title} demo video placeholder`
          : media.alt || `${project.title} demo image placeholder`,
      );
      placeholder.innerHTML = `
        <span>${media.type === "video" ? "Demo video" : "Demo photo"}</span>
        <strong>${project.title}</strong>
      `;
      figure.append(placeholder);
    }

    const caption = document.createElement("figcaption");
    caption.textContent = media.caption || `Demo asset ${index + 1}`;
    figure.append(caption);
    container.append(figure);
  });
}

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
if (grid && count && projectToolbar) {
  renderFilters();
  renderProjects(projects);
}
renderProjectPage();
initTypewriter();
