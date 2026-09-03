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


