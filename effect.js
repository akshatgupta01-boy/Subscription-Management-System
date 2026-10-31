
/* =========================================
   BRIGHTLOOP — INTERACTIVE EFFECTS
========================================= */

document.addEventListener("DOMContentLoaded", () => {

  // 1. Reveal sections when scrolling
  const revealElements = document.querySelectorAll(
    ".dashboard-card, .dashboard-panel, " +
    ".table-section, .transactions-panel, " +
    ".stat-card, .summary-card, .metric-card"
  );

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    revealElements.forEach((element) => {
      element.classList.add("reveal");
      observer.observe(element);
    });
  }

  // 2. Staggered card animations
  document.querySelectorAll(
    ".dashboard-stats, .dashboard-grid"
  ).forEach((container) => {
    container.querySelectorAll(
      ".dashboard-card, .dashboard-panel"
    ).forEach((card, index) => {
      card.style.setProperty(
        "--card-delay",
        `${index * 100}ms`
      );
    });
  });

  // 3. Subtle 3D card movement
  const cards = document.querySelectorAll(
    ".dashboard-card, .stat-card, .summary-card, .metric-card"
  );

  const supportsHover = window.matchMedia(
    "(hover: hover) and (pointer: fine)"
  ).matches;

  if (supportsHover &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {

    cards.forEach((card) => {

      card.addEventListener("mousemove", (event) => {
        const rect = card.getBoundingClientRect();

        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;

        const rotateX = (0.5 - y) * 5;
        const rotateY = (x - 0.5) * 5;

        card.style.transform =
          `perspective(900px) rotateX(${rotateX}deg) ` +
          `rotateY(${rotateY}deg) translateY(-4px)`;
      });

      card.addEventListener("mouseleave", () => {
        card.style.transform = "";
      });

    });
  }

  // 4. Button ripple effect
  document.querySelectorAll("button").forEach((button) => {

    button.addEventListener("click", (event) => {

      const ripple = document.createElement("span");

      const rect = button.getBoundingClientRect();

      const size = Math.max(rect.width, rect.height);

      ripple.className = "button-ripple";

      ripple.style.width = `${size}px`;
      ripple.style.height = `${size}px`;

      ripple.style.left =
        `${event.clientX - rect.left - size / 2}px`;

      ripple.style.top =
        `${event.clientY - rect.top - size / 2}px`;

      button.appendChild(ripple);

      setTimeout(() => ripple.remove(), 600);

    });

  });

});
