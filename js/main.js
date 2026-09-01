/* ===============================================
   MAIN JS — Jenisha Lama Portfolio
   =============================================== */

/* ── 1. Navbar: scroll-aware bg + hamburger + active link ── */
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

    /* ---------- close on nav link click ---------- */
    allLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (isOpen()) closeMenu();
        });
    });

    /* ---------- scroll: navbar bg + active link ---------- */
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 60);
        highlightActiveLink();
    }, { passive: true });

    function highlightActiveLink () {
        let current = '';
        sections.forEach(section => {
            if (window.scrollY >= section.offsetTop - 130) {
                current = section.getAttribute('id');
            }
        });
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


