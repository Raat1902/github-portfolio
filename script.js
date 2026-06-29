
(() => {
  const root = document.documentElement;
  const savedTheme = localStorage.getItem("ra-portfolio-theme");
  if (savedTheme === "dark") root.setAttribute("data-theme", "dark");

  const themeToggle = document.getElementById("themeToggle");
  themeToggle?.addEventListener("click", () => {
    const isDark = root.getAttribute("data-theme") === "dark";
    if (isDark) {
      root.removeAttribute("data-theme");
      localStorage.setItem("ra-portfolio-theme", "light");
    } else {
      root.setAttribute("data-theme", "dark");
      localStorage.setItem("ra-portfolio-theme", "dark");
    }
  });

  const menuButton = document.getElementById("menuButton");
  const navLinks = document.getElementById("navLinks");
  menuButton?.addEventListener("click", () => {
    const opened = navLinks.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(opened));
    document.body.classList.toggle("menu-open", opened);
  });
  navLinks?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      menuButton?.setAttribute("aria-expanded", "false");
      document.body.classList.remove("menu-open");
    });
  });

  const path = window.location.pathname.split("/").pop() || "index.html";
  const page = path === "index.html" || path === "" ? "home" : path.replace(".html", "");
  document.querySelectorAll("[data-nav]").forEach((link) => {
    if (link.dataset.nav === page) link.classList.add("active");
  });

  const progress = document.getElementById("scrollProgress");
  const updateProgress = () => {
    if (!progress) return;
    const total = document.documentElement.scrollHeight - window.innerHeight;
    const pct = total > 0 ? (window.scrollY / total) * 100 : 0;
    progress.style.width = `${Math.min(100, Math.max(0, pct))}%`;
  };
  window.addEventListener("scroll", updateProgress, { passive: true });
  updateProgress();

  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.13 });
    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("in-view"));
  }

  const filterButtons = document.querySelectorAll(".filter-button");
  const projectCards = document.querySelectorAll(".project-card");
  const search = document.getElementById("projectSearch");
  const empty = document.getElementById("emptyProjects");
  let activeFilter = "all";

  const updateProjects = () => {
    if (!projectCards.length) return;
    const term = (search?.value || "").trim().toLowerCase();
    let visible = 0;
    projectCards.forEach((card) => {
      const matchesFilter = activeFilter === "all" || card.dataset.category === activeFilter;
      const matchesSearch = !term || (card.dataset.search || "").includes(term);
      const show = matchesFilter && matchesSearch;
      card.hidden = !show;
      if (show) visible += 1;
    });
    if (empty) empty.hidden = visible !== 0;
  };

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeFilter = button.dataset.filter || "all";
      filterButtons.forEach((item) => item.classList.toggle("active", item === button));
      updateProjects();
    });
  });
  search?.addEventListener("input", updateProjects);

  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();
