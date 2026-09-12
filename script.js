/**
 * Interactive Navigation Menu Logic
 * Features:
 *  - Dynamic navbar style change on scroll (glassmorphism & compact height)
 *  - Real-time scroll progress indicator bar
 *  - ScrollSpy active link highlighting
 *  - Menu item hover interactions
 *  - Theme / Accent color palette customizer
 *  - Responsive mobile drawer with animated hamburger morph
 */

document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.getElementById('navbar');
    const scrollProgressBar = document.getElementById('scrollProgress');
    const menuBtn = document.getElementById('menuBtn');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-link');
    const themeButtons = document.querySelectorAll('.theme-btn');
    const sections = document.querySelectorAll('section[id]');

    /* ===================================================
       1. SCROLL BEHAVIOR & PROGRESS BAR
    =================================================== */
    function handleScroll() {
        const scrollY = window.scrollY;
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        
        // Toggle navbar scrolled style
        if (scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Update scroll progress bar width percentage
        if (scrollProgressBar && windowHeight > 0) {
            const progress = (scrollY / windowHeight) * 100;
            scrollProgressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
        }

        // ScrollSpy: highlight active link according to current viewport section
        updateActiveNavOnScroll(scrollY);
    }

    // ScrollSpy function
    function updateActiveNavOnScroll(currentScrollY) {
        if (!sections.length) return;

        let currentSectionId = '';
        const scrollOffset = 140; // Offset for fixed navbar + threshold

        sections.forEach(section => {
            const sectionTop = section.offsetTop - scrollOffset;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (currentScrollY >= sectionTop && currentScrollY < sectionTop + sectionHeight) {
                currentSectionId = sectionId;
            }
        });

        // If user is at very top of page
        if (currentScrollY < 100 && sections.length > 0) {
            currentSectionId = sections[0].getAttribute('id');
        }

        if (currentSectionId) {
            navItems.forEach(link => {
                const href = link.getAttribute('href');
                if (href === `#${currentSectionId}` || href.endsWith(`#${currentSectionId}`)) {
                    link.classList.add('active');
                } else if (href && href.startsWith('#')) {
                    link.classList.remove('active');
                }
            });
        }
    }

    // Optimized scroll listener with requestAnimationFrame
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                handleScroll();
                ticking = false;
            });
            ticking = true;
        }
    });

    // Run once on load
    handleScroll();

    /* ===================================================
       2. MOBILE MENU & HAMBURGER TOGGLE
    =================================================== */
    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = navLinks.classList.toggle('active');
            menuBtn.classList.toggle('open', isOpen);
            menuBtn.setAttribute('aria-expanded', isOpen);
        });

        // Close menu when clicking on any link (desktop or mobile)
        document.querySelectorAll('.nav-link, .dropdown-item').forEach(link => {
            link.addEventListener('click', (e) => {
                // If it's a dropdown toggle on mobile, let user open dropdown first
                const parentItem = link.closest('.has-dropdown');
                if (window.innerWidth <= 860 && parentItem && link.classList.contains('dropdown-toggle')) {
                    e.preventDefault();
                    parentItem.classList.toggle('mobile-open');
                    return;
                }

                navLinks.classList.remove('active');
                menuBtn.classList.remove('open');
                menuBtn.setAttribute('aria-expanded', 'false');
            });
        });

        // Close mobile drawer when clicking outside
        document.addEventListener('click', (e) => {
            if (!navbar.contains(e.target) && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                menuBtn.classList.remove('open');
                menuBtn.setAttribute('aria-expanded', 'false');
            }
        });

        // Close mobile menu on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                menuBtn.classList.remove('open');
                menuBtn.setAttribute('aria-expanded', 'false');
            }
        });
    }

    /* ===================================================
       3. INTERACTIVE THEME / COLOR ACCENT SWITCHER
    =================================================== */
    function setTheme(themeName) {
        if (themeName === 'cyan') {
            document.documentElement.removeAttribute('data-theme');
        } else {
            document.documentElement.setAttribute('data-theme', themeName);
        }

        themeButtons.forEach(btn => {
            const isMatch = btn.getAttribute('data-theme-name') === themeName;
            btn.classList.toggle('active', isMatch);
            btn.setAttribute('aria-pressed', isMatch);
        });

        localStorage.setItem('preferredTheme', themeName);
    }

    themeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const theme = btn.getAttribute('data-theme-name');
            setTheme(theme);
        });
    });

    // Load saved theme if exists
    const savedTheme = localStorage.getItem('preferredTheme') || 'cyan';
    setTheme(savedTheme);

    /* ===================================================
       4. SMOOTH SCROLL FOR IN-PAGE ANCHORS
    =================================================== */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    /* ===================================================
       5. MICRO-INTERACTION SOUND/TILT EFFECT (Optional Hover Polish)
    =================================================== */
    navItems.forEach(item => {
        item.addEventListener('mouseenter', function () {
            // Subtle interactive feedback on hover
            this.style.transition = 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)';
        });
    });
});