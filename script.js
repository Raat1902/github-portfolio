(() => {
  const body = document.body;
  const themeToggle = document.getElementById('themeToggle');
  const savedTheme = localStorage.getItem('rania-theme');
  if (savedTheme === 'dark') body.dataset.theme = 'dark';

  themeToggle?.addEventListener('click', () => {
    const isDark = body.dataset.theme === 'dark';
    if (isDark) {
      delete body.dataset.theme;
      localStorage.setItem('rania-theme', 'light');
    } else {
      body.dataset.theme = 'dark';
      localStorage.setItem('rania-theme', 'dark');
    }
  });

  const menuButton = document.getElementById('menuButton');
  const navLinks = document.getElementById('navLinks');
  menuButton?.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });
  navLinks?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuButton?.setAttribute('aria-expanded', 'false');
  }));

  const scrollProgress = document.getElementById('scrollProgress');
  const updateProgress = () => {
    if (!scrollProgress) return;
    const height = document.documentElement.scrollHeight - window.innerHeight;
    const progress = height > 0 ? (window.scrollY / height) * 100 : 0;
    scrollProgress.style.width = `${progress}%`;
  };
  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: .12 });
  document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

  const filterButtons = document.querySelectorAll('.filter');
  const searchInput = document.getElementById('projectSearch');
  const cards = [...document.querySelectorAll('.project-card')];
  const emptyState = document.getElementById('emptyState');
  let activeFilter = 'all';

  const updateProjects = () => {
    const query = (searchInput?.value || '').trim().toLowerCase();
    let visible = 0;
    cards.forEach((card) => {
      const categoryMatch = activeFilter === 'all' || card.dataset.category === activeFilter;
      const queryMatch = !query || card.dataset.search.includes(query) || card.textContent.toLowerCase().includes(query);
      const show = categoryMatch && queryMatch;
      card.hidden = !show;
      if (show) visible += 1;
    });
    if (emptyState) emptyState.hidden = visible > 0;
  };

  filterButtons.forEach((button) => button.addEventListener('click', () => {
    activeFilter = button.dataset.filter;
    filterButtons.forEach((item) => item.classList.toggle('active', item === button));
    updateProjects();
  }));
  searchInput?.addEventListener('input', updateProjects);

  const setText = (id, value) => {
    const node = document.getElementById(id);
    if (node && Number.isFinite(value)) node.textContent = value;
  };
  fetch('https://api.github.com/users/Raat1902')
    .then((response) => response.ok ? response.json() : Promise.reject())
    .then((profile) => {
      setText('repoCount', profile.public_repos);
      setText('liveRepos', profile.public_repos);
      setText('liveFollowers', profile.followers);
    })
    .catch(() => {});

  fetch('https://api.github.com/users/Raat1902/repos?per_page=100')
    .then((response) => response.ok ? response.json() : Promise.reject())
    .then((repos) => {
      const stars = repos.reduce((total, repo) => total + (repo.stargazers_count || 0), 0);
      setText('liveStars', stars);
    })
    .catch(() => {});
})();
