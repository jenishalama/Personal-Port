/* ==========================================================================
   1. Enhanced Navbar & Section Navigation (Intersection Observer & Scroll Spy)
   ========================================================================== */
(function () {
    const navbar        = document.getElementById('navbar');
    const hamburger     = document.getElementById('hamburger');
    const navMenu       = document.getElementById('nav-links');
    const overlay       = document.getElementById('nav-overlay');
    const sections      = document.querySelectorAll('section[id]');
    const navLinks      = document.querySelectorAll('.nav-links a');
    const logoLink      = document.querySelector('.logo a');

    if (!navbar || !navMenu) return;

    /* ── Mobile Menu State Helpers ── */
    function openMenu() {
        hamburger.classList.add('active');
        navMenu.classList.add('open');
        overlay.classList.add('open');
        document.body.style.overflow = 'hidden';
        hamburger.setAttribute('aria-expanded', 'true');
    }

    function closeMenu() {
        hamburger.classList.remove('active');
        navMenu.classList.remove('open');
        overlay.classList.remove('open');
        document.body.style.overflow = '';
        hamburger.setAttribute('aria-expanded', 'false');
    }

    function isMenuOpen() {
        return navMenu.classList.contains('open');
    }

    /* ── Mobile Menu Toggle Listeners ── */
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            isMenuOpen() ? closeMenu() : openMenu();
        });
    }

    if (overlay) {
        overlay.addEventListener('click', closeMenu);
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isMenuOpen()) closeMenu();
    });

    /* ── Active Navigation Highlighting ── */
    let currentActiveId = null;

    /**
     * Highlights exactly one active navigation link at a time
     * and sets aria-current for accessibility.
     */
    function setActiveLink(sectionId) {
        if (!sectionId || currentActiveId === sectionId) return;
        currentActiveId = sectionId;

        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            const isActive = href === `#${sectionId}`;
            link.classList.toggle('active', isActive);
            if (isActive) {
                link.setAttribute('aria-current', 'page');
            } else {
                link.removeAttribute('aria-current');
            }
        });
    }

    /* ── Smooth Scrolling Navigation with Programmatic Lock ── */
    let isManualScrolling = false;
    let manualScrollTimer = null;

    function navigateToSection(targetId) {
        const targetElement = document.getElementById(targetId);
        if (!targetElement && targetId !== 'home') return;

        isManualScrolling = true;
        clearTimeout(manualScrollTimer);

        // Immediate visual feedback on clicked link
        setActiveLink(targetId);

        const navHeight = navbar ? navbar.offsetHeight : 70;
        const targetTop = (targetId === 'home' || !targetElement)
            ? 0
            : Math.max(0, targetElement.offsetTop - navHeight + 4);

        window.scrollTo({
            top: targetTop,
            behavior: 'smooth'
        });

        // Keep the URL clean — remove any hash fragment after scrolling
        history.replaceState(null, '', window.location.pathname);

        // Release scroll lock once smooth scroll animation completes
        manualScrollTimer = setTimeout(() => {
            isManualScrolling = false;
            updateActiveSection();
        }, 800);
    }

    // Attach smooth scroll click listeners to nav links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (isMenuOpen()) closeMenu();

            if (href && href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.slice(1);
                navigateToSection(targetId);
            }
        });
    });

    // Attach smooth scroll to logo link
    if (logoLink) {
        logoLink.addEventListener('click', (e) => {
            const href = logoLink.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                if (isMenuOpen()) closeMenu();
                navigateToSection('home');
            }
        });
    }

    // On page load: strip any existing hash from the URL (e.g., if user bookmarked #about)
    if (window.location.hash) {
        history.replaceState(null, '', window.location.pathname);
    }

    /* ── Intersection Observer for Section Detection ── */
    const visibleSections = new Map();

    function updateActiveSection() {
        if (isManualScrolling) return;

        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;

        // Boundary 1: At or near top of the page -> Always highlight "Home"
        if (scrollY < 90) {
            setActiveLink('home');
            return;
        }

        // Boundary 2: At or near bottom of the page -> Always highlight the last section ("Contact")
        if (windowHeight + scrollY >= documentHeight - 60 && sections.length > 0) {
            const lastSectionId = sections[sections.length - 1].getAttribute('id');
            setActiveLink(lastSectionId);
            return;
        }

        // General case: Determine which intersecting section has the largest visible area
        let bestSectionId = null;
        let maxVisibleHeight = -1;

        visibleSections.forEach((entry, id) => {
            const rect = entry.boundingClientRect;
            const visibleTop = Math.max(0, rect.top);
            const visibleBottom = Math.min(windowHeight, rect.bottom);
            const visibleHeight = Math.max(0, visibleBottom - visibleTop);

            if (visibleHeight > maxVisibleHeight) {
                maxVisibleHeight = visibleHeight;
                bestSectionId = id;
            }
        });

        if (bestSectionId) {
            setActiveLink(bestSectionId);
        }
    }

    if ('IntersectionObserver' in window && sections.length > 0) {
        const observerOptions = {
            root: null,
            // Negative margins focus the detection on the active viewing zone
            rootMargin: '-15% 0px -25% 0px',
            threshold: [0, 0.1, 0.25, 0.5, 0.75, 1.0]
        };

        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const id = entry.target.getAttribute('id');
                if (entry.isIntersecting) {
                    visibleSections.set(id, entry);
                } else {
                    visibleSections.delete(id);
                }
            });
            updateActiveSection();
        }, observerOptions);

        sections.forEach(sec => sectionObserver.observe(sec));
    }

    /* ── Scroll Event: Navbar Glassmorphism & Boundary Checks ── */
    window.addEventListener('scroll', () => {
        // Toggle frosted glass effect when scrolled down (> 30px)
        navbar.classList.toggle('scrolled', window.scrollY > 30);

        // Update active link during scroll (especially near edges)
        updateActiveSection();
    }, { passive: true });

    // Initial check on page load
    navbar.classList.toggle('scrolled', window.scrollY > 30);
    updateActiveSection();
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
