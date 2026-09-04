(function () {
    const navbar    = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu   = document.getElementById('nav-links');
    const overlay   = document.getElementById('nav-overlay');
    const sections  = document.querySelectorAll('section[id]');
    const allLinks  = document.querySelectorAll('.nav-links a');
    const navOnlyLinks = document.querySelectorAll('.nav-links a:not(.nav-cta)');

    /* ---------- helpers ---------- */
    function openMenu () {
        hamburger.classList.add('active');
        navMenu.classList.add('open');
        overlay.classList.add('open');
        document.body.style.overflow = 'hidden';
        hamburger.setAttribute('aria-expanded', 'true');
    }

    function closeMenu () {
        hamburger.classList.remove('active');
        navMenu.classList.remove('open');
        overlay.classList.remove('open');
        document.body.style.overflow = '';
        hamburger.setAttribute('aria-expanded', 'false');
    }

    function isOpen () {
        return navMenu.classList.contains('open');
    }

    /* ---------- hamburger click ---------- */
    hamburger.addEventListener('click', () => {
        isOpen() ? closeMenu() : openMenu();
    });

    /* ---------- overlay click closes menu ---------- */
    overlay.addEventListener('click', closeMenu);

    /* ---------- Escape key closes menu ---------- */
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isOpen()) closeMenu();
    });

    /* ---------- click handling with smooth scroll & immediate feedback ---------- */
    let isClickScrolling = false;
    let clickScrollTimer = null;

    allLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (isOpen()) closeMenu();

            if (href && href.startsWith('#')) {
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    isClickScrolling = true;
                    clearTimeout(clickScrollTimer);

                    // Immediately show active state on clicked link
                    navOnlyLinks.forEach(l => l.classList.toggle('active', l === link));

                    const navHeight = navbar ? navbar.offsetHeight : 70;
                    const targetTop = href === '#home' ? 0 : (target.offsetTop - navHeight + 8);

                    window.scrollTo({
                        top: targetTop,
                        behavior: 'smooth'
                    });

                    if (history.pushState) {
                        history.pushState(null, null, href);
                    }

                    // Release lock after smooth scroll animation completes
                    clickScrollTimer = setTimeout(() => {
                        isClickScrolling = false;
                        highlightActiveLink();
                    }, 800);
                }
            }
        });
    });

    /* ---------- scroll: navbar bg + active link ---------- */
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 60);
        highlightActiveLink();
    }, { passive: true });

    function highlightActiveLink () {
        if (isClickScrolling) return;

        let current = '';
        const scrollPosition = window.scrollY;
        const scrollBottom = window.innerHeight + scrollPosition;
        const pageHeight = document.documentElement.scrollHeight;

        // If user is at or near the bottom of page, highlight the last section (Contact)
        if (scrollBottom >= pageHeight - 80 && sections.length > 0) {
            current = sections[sections.length - 1].getAttribute('id');
        } else {
            sections.forEach(section => {
                if (scrollPosition >= section.offsetTop - 140) {
                    current = section.getAttribute('id');
                }
            });
        }

        if (!current && sections.length > 0) {
            current = sections[0].getAttribute('id');
        }

        navOnlyLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
        });
    }

    highlightActiveLink();
})();


/* ── 2. Scroll-reveal animations ── */
(function () {
    const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

    if (!revealEls.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
    });

    revealEls.forEach(el => observer.observe(el));
})();


/* ── 3. Smooth cursor glow on hero ── */
(function () {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    let cursorGlow = document.createElement('div');
    cursorGlow.style.cssText = `
        position: absolute;
        width: 260px;
        height: 260px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(154, 106, 122, 0.12) 0%, transparent 70%);
        pointer-events: none;
        transform: translate(-50%, -50%);
        transition: left 0.4s ease, top 0.4s ease;
        z-index: 0;
    `;
    hero.appendChild(cursorGlow);

    hero.addEventListener('mousemove', (e) => {
        const rect = hero.getBoundingClientRect();
        cursorGlow.style.left = (e.clientX - rect.left) + 'px';
        cursorGlow.style.top  = (e.clientY - rect.top)  + 'px';
    });

    hero.addEventListener('mouseleave', () => {
        cursorGlow.style.opacity = '0';
    });
    hero.addEventListener('mouseenter', () => {
        cursorGlow.style.opacity = '1';
    });
})();


/* ── 4. Button ripple on click ── */
(function () {
    function createRipple(e) {
        const btn = e.currentTarget;
        const existing = btn.querySelector('.btn-ripple');
        if (existing) existing.remove();

        const circle = document.createElement('span');
        const diameter = Math.max(btn.clientWidth, btn.clientHeight);
        const rect = btn.getBoundingClientRect();

        circle.className = 'btn-ripple';
        circle.style.cssText = `
            width: ${diameter}px;
            height: ${diameter}px;
            left: ${e.clientX - rect.left - diameter / 2}px;
            top:  ${e.clientY - rect.top  - diameter / 2}px;
        `;
        btn.appendChild(circle);
        circle.addEventListener('animationend', () => circle.remove());
    }

    document.querySelectorAll('.primary-btn, .secondary-btn').forEach(btn => {
        btn.addEventListener('click', createRipple);
    });
})();


/* ── 5. Project card mouse-tracking radial shine ── */
(function () {
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width  * 100).toFixed(1);
            const y = ((e.clientY - rect.top)  / rect.height * 100).toFixed(1);
            card.style.setProperty('--mouse-x', `${x}%`);
            card.style.setProperty('--mouse-y', `${y}%`);
        });
    });
})();


/* ── 6. Staggered scroll-in for .stagger-child groups ── */
(function () {
    const staggerEls = document.querySelectorAll('.stagger-child');
    if (!staggerEls.length) return;

    // Group siblings by parent so we can apply ordered delays
    const groups = new Map();
    staggerEls.forEach(el => {
        const parent = el.parentElement;
        if (!groups.has(parent)) groups.set(parent, []);
        groups.get(parent).push(el);
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const siblings = groups.get(el.parentElement) || [el];
            const idx = siblings.indexOf(el);
            const baseDelay = parseFloat(el.style.transitionDelay || '0') * 1000;
            const extraDelay = idx * 75; // 75 ms stagger between each sibling
            setTimeout(() => {
                el.classList.add('visible');
            }, baseDelay + extraDelay);
            observer.unobserve(el);
        });
    }, {
        threshold: 0.10,
        rootMargin: '0px 0px -30px 0px'
    });

    staggerEls.forEach(el => observer.observe(el));
})();


/* ── 7. Counter-up animation for [data-count] elements ── */
(function () {
    const counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    function animateCount(el) {
        const target = parseInt(el.getAttribute('data-count'), 10);
        const suffix = el.getAttribute('data-suffix') || '';
        const duration = 1400;
        const start = performance.now();

        function update(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            el.textContent = Math.round(eased * target) + suffix;
            if (progress < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCount(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(el => observer.observe(el));
})();
