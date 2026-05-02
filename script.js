document.addEventListener('DOMContentLoaded', () => {

    // =============================================
    // Search Data — sections to search through
    // =============================================
    const searchData = [
        { id: 'home',       label: 'Home',       desc: 'Introduction & hero section',          icon: 'fa-home' },
        { id: 'about',      label: 'About Me',   desc: 'Professional summary & education',     icon: 'fa-smile' },
        { id: 'skills',     label: 'Skills',     desc: 'Languages, frameworks & tools',        icon: 'fa-star' },
        { id: 'experience', label: 'Experience', desc: 'Projects, achievements & certifications', icon: 'fa-briefcase' },
        { id: 'projects',   label: 'Projects',   desc: 'Appointment Booking & E-Commerce app', icon: 'fa-tv' },
        { id: 'contact',    label: 'Contact',    desc: 'Send a message or find social links',  icon: 'fa-envelope' },
    ];

    function buildSearchItem(item, resultContainer) {
        const el = document.createElement('div');
        el.className = 'search-item';
        el.innerHTML = `
            <div class="search-item-icon"><i class="fas ${item.icon}"></i></div>
            <div class="search-item-text">
                <strong>${item.label}</strong>
                <span>${item.desc}</span>
            </div>`;
        el.addEventListener('click', () => {
            const target = document.getElementById(item.id);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
            closeAllSearch();
        });
        resultContainer.appendChild(el);
    }

    function filterResults(query) {
        if (!query.trim()) return [];
        const q = query.toLowerCase();
        return searchData.filter(d =>
            d.label.toLowerCase().includes(q) ||
            d.desc.toLowerCase().includes(q) ||
            d.id.toLowerCase().includes(q)
        );
    }

    function renderResults(results, container) {
        container.innerHTML = '';
        if (results.length === 0) {
            container.innerHTML = '<div class="search-no-results">No sections found. Try "skills", "projects", etc.</div>';
        } else {
            results.forEach(item => buildSearchItem(item, container));
        }
    }

    function closeAllSearch() {
        // Desktop
        desktopDropdown.classList.remove('open');
        desktopInput.value = '';
        clearBtn.classList.remove('visible');
        // Mobile overlay
        mobileOverlay.classList.remove('open');
        mobileInput.value = '';
        mobileResults.innerHTML = '';
    }

    // =============================================
    // Desktop Search
    // =============================================
    const desktopInput   = document.getElementById('search-input');
    const desktopDropdown = document.getElementById('search-dropdown');
    const clearBtn       = document.getElementById('search-clear');

    if (desktopInput) {
        desktopInput.addEventListener('input', () => {
            const q = desktopInput.value;
            clearBtn.classList.toggle('visible', q.length > 0);
            if (q.trim().length === 0) {
                desktopDropdown.classList.remove('open');
                return;
            }
            const results = filterResults(q);
            renderResults(results, desktopDropdown);
            desktopDropdown.classList.add('open');
        });

        desktopInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeAllSearch();
        });
    }

    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            desktopInput.value = '';
            clearBtn.classList.remove('visible');
            desktopDropdown.classList.remove('open');
            desktopInput.focus();
        });
    }

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        const wrapper = document.getElementById('search-wrapper');
        if (wrapper && !wrapper.contains(e.target)) {
            desktopDropdown.classList.remove('open');
        }
    });

    // =============================================
    // Mobile Search Overlay
    // =============================================
    const mobileTrigger = document.getElementById('mobile-search-btn');
    const mobileOverlay = document.getElementById('mobile-search-overlay');
    const mobileInput   = document.getElementById('mobile-search-input');
    const mobileClose   = document.getElementById('mobile-search-close');
    const mobileResults = document.getElementById('mobile-search-results');

    if (mobileTrigger) {
        mobileTrigger.addEventListener('click', () => {
            mobileOverlay.classList.add('open');
            setTimeout(() => mobileInput && mobileInput.focus(), 100);
        });
    }

    if (mobileClose) {
        mobileClose.addEventListener('click', () => {
            mobileOverlay.classList.remove('open');
            mobileInput.value = '';
            mobileResults.innerHTML = '';
        });
    }

    if (mobileInput) {
        mobileInput.addEventListener('input', () => {
            const q = mobileInput.value;
            if (q.trim().length === 0) {
                mobileResults.innerHTML = '';
                return;
            }
            const results = filterResults(q);
            renderResults(results, mobileResults);
        });

        mobileInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                mobileOverlay.classList.remove('open');
                mobileInput.value = '';
                mobileResults.innerHTML = '';
            }
        });
    }

    // =============================================
    // Contact Form — AJAX via Formspree
    // =============================================
    const contactForm = document.getElementById('contact-form');
    const submitBtn   = document.getElementById('submit-btn');
    const toast       = document.getElementById('toast');
    const toastMsg    = document.getElementById('toast-msg');
    const toastIcon   = toast ? toast.querySelector('.toast-icon') : null;

    function showToast(message, type = 'success') {
        if (!toast) return;
        toastMsg.textContent = message;
        toast.className = `toast ${type} show`;
        if (toastIcon) {
            toastIcon.className = type === 'success'
                ? 'toast-icon fas fa-check-circle'
                : 'toast-icon fas fa-exclamation-circle';
        }
        setTimeout(() => { toast.classList.remove('show'); }, 4000);
    }

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

            const data = new FormData(contactForm);

            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: data,
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    showToast('✅ Message sent! I\'ll get back to you soon.', 'success');
                    contactForm.reset();
                } else {
                    const json = await response.json();
                    const errMsg = json.errors ? json.errors.map(e => e.message).join(', ') : 'Something went wrong.';
                    showToast(errMsg, 'error');
                }
            } catch {
                showToast('Network error. Please try again.', 'error');
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Send Message <i class="fas fa-paper-plane"></i>';
            }
        });
    }

    // =============================================
    // Active Navigation Link Highlighting
    // =============================================

    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.sidebar-nav a');

    window.addEventListener('scroll', () => {
        let current = '';
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (scrollY >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // =============================================
    // Smooth Scrolling for Navigation Links
    // =============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // =============================================
    // Reveal Animations on Scroll
    // =============================================
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animateElements = document.querySelectorAll('.card, .hero-text, .section-header');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });
});
