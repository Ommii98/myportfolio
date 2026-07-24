/**
 * Hariom Vishwakarma | Portfolio Script Engine
 * Fully featured premium custom component loaders, animations, and state managers.
 */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. LOADING SCREEN CONTROLLER
    // ==========================================
    const loadingScreen = document.getElementById('loading-screen');
    const loadPct = document.getElementById('load-pct');
    const loadProgress = document.getElementById('load-progress');
    
    let progress = 0;
    const progressInterval = setInterval(() => {
        // Fast increment initially, slowing down at the end
        if (progress < 70) {
            progress += Math.floor(Math.random() * 15) + 5;
        } else if (progress < 90) {
            progress += Math.floor(Math.random() * 4) + 1;
        } else {
            progress += 1;
        }
        
        if (progress >= 100) {
            progress = 100;
            clearInterval(progressInterval);
            
            // Fade out loader screen
            setTimeout(() => {
                loadingScreen.style.opacity = '0';
                loadingScreen.style.visibility = 'hidden';
                // Trigger reveal animations on hero
                document.querySelectorAll('.hero-sec .animate-reveal').forEach(el => {
                    el.classList.add('revealed');
                });
            }, 400);
        }
        
        loadPct.textContent = `${progress}%`;
        loadProgress.style.width = `${progress}%`;
    }, 80);

    // ==========================================
    // 2. THEME CONTROLLER & CLIP TRANSITION
    // ==========================================
    const themeToggler = document.getElementById('theme-toggler');
    const transitionOverlay = document.getElementById('theme-transition-overlay');
    
    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('portfolio-theme', theme);
    }
    
    if (themeToggler) {
        themeToggler.addEventListener('click', (e) => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const targetTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            // Get mouse position for visual clip transition origin
            const x = e.clientX;
            const y = e.clientY;
            
            transitionOverlay.style.setProperty('--cx', `${x}px`);
            transitionOverlay.style.setProperty('--cy', `${y}px`);
            
            // Start overlay transition clip path expansion
            transitionOverlay.style.backgroundColor = targetTheme === 'dark' ? '#0a0c10' : '#f8fafc';
            transitionOverlay.classList.add('animating');
            
            setTimeout(() => {
                setTheme(targetTheme);
                // Clean up transition overlays
                setTimeout(() => {
                    transitionOverlay.classList.remove('animating');
                }, 400);
            }, 400);
        });
    }

    // ==========================================
    // 3. CUSTOM MOUSE CURSOR TRAILER
    // ==========================================
    const cursorDot = document.getElementById('custom-cursor-dot');
    const cursorOutline = document.getElementById('custom-cursor-outline');
    
    let mouseX = 0, mouseY = 0; // Target coordinates
    let outlineX = 0, outlineY = 0; // Lerp coordinates
    
    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Instant cursor dot repositioning
        if (cursorDot) {
            cursorDot.style.left = `${mouseX}px`;
            cursorDot.style.top = `${mouseY}px`;
        }
    });
    
    // Smooth trailing interpolation loop
    function animateCursor() {
        // Simple linear interpolation (lerp)
        const delay = 8; // Adjust speed factor (higher is slower)
        outlineX += (mouseX - outlineX) / delay;
        outlineY += (mouseY - outlineY) / delay;
        
        if (cursorOutline) {
            cursorOutline.style.left = `${outlineX}px`;
            cursorOutline.style.top = `${outlineY}px`;
        }
        
        requestAnimationFrame(animateCursor);
    }
    animateCursor();
    
    // Toggle active cursor state on hoverable elements
    const hoverables = 'a, button, input, select, textarea, .glass-panel, .expand-toggle-btn, .proj-tab, .filter-btn';
    
    document.addEventListener('mouseover', (e) => {
        if (e.target.closest(hoverables)) {
            cursorDot.classList.add('cursor-hover');
            cursorOutline.classList.add('cursor-hover');
        }
    });
    
    document.addEventListener('mouseout', (e) => {
        if (e.target.closest(hoverables)) {
            cursorDot.classList.remove('cursor-hover');
            cursorOutline.classList.remove('cursor-hover');
        }
    });

    // ==========================================
    // 4. SPOTLIGHT GLOW EFFECT (CARD MOVEMENT)
    // ==========================================
    document.addEventListener('mousemove', (e) => {
        const panels = document.querySelectorAll('.glass-panel');
        panels.forEach(panel => {
            const rect = panel.getBoundingClientRect();
            // Calculate cursor offset position relative to card boundaries
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            panel.style.setProperty('--x', `${x}px`);
            panel.style.setProperty('--y', `${y}px`);
        });
    });

    // ==========================================
    // 5. 3D TILT EFFECT ON CARDS
    // ==========================================
    const tiltElements = document.querySelectorAll('#profile-card-3d, .project-mac-card');
    
    tiltElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const width = rect.width;
            const height = rect.height;
            
            // Calculate absolute coordinate offset percentage from card center
            const mouseX = e.clientX - rect.left - (width / 2);
            const mouseY = e.clientY - rect.top - (height / 2);
            
            const rotateX = -10 * (mouseY / (height / 2)); // Tilt angles capped at +/- 10 degrees
            const rotateY = 10 * (mouseX / (width / 2));
            
            el.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        
        el.addEventListener('mouseleave', () => {
            el.style.transform = 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        });
    });

    // ==========================================
    // 6. TYPEWRITER ANECDOTE ON HERO
    // ==========================================
    const typewriter = document.getElementById('typewriter');
    if (typewriter) {
        const words = JSON.parse(typewriter.getAttribute('data-words') || '[]');
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        
        function type() {
            const currentWord = words[wordIndex];
            if (isDeleting) {
                typewriter.textContent = currentWord.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typewriter.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
            }
            
            let typeSpeed = isDeleting ? 40 : 80;
            
            if (!isDeleting && charIndex === currentWord.length) {
                typeSpeed = 1500; // Pause at end of typed word
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                typeSpeed = 500; // Pause before typing next word
            }
            
            setTimeout(type, typeSpeed);
        }
        
        setTimeout(type, 1000);
    }

    // ==========================================
    // 7. FLOATING NAVBAR NAVIGATION CONTROL
    // ==========================================
    const navbar = document.getElementById('sticky-navbar');
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        // Hide navbar on scroll down, show on scroll up
        if (currentScrollY > lastScrollY && currentScrollY > 150) {
            navbar.classList.add('navbar-hidden');
        } else {
            navbar.classList.remove('navbar-hidden');
        }
        lastScrollY = currentScrollY;
    });

    // Mobile nav toggles
    const menuToggle = document.getElementById('menu-toggle-btn');
    const mobileNav = document.getElementById('mobile-nav');
    const mobileNavClose = document.getElementById('mobile-nav-close');
    
    function toggleMobileNav() {
        const isOpen = mobileNav.classList.contains('open');
        mobileNav.classList.toggle('open');
        menuToggle.setAttribute('aria-expanded', !isOpen);
    }
    
    if (menuToggle) menuToggle.addEventListener('click', toggleMobileNav);
    if (mobileNavClose) mobileNavClose.addEventListener('click', toggleMobileNav);
    
    // Close mobile menu on clicking any navigation link
    document.querySelectorAll('.mobile-link').forEach(link => {
        link.addEventListener('click', () => {
            mobileNav.classList.remove('open');
            menuToggle.setAttribute('aria-expanded', 'false');
        });
    });

    // Nav active link tracking highlight on scroll
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');
    
    window.addEventListener('scroll', () => {
        let activeId = 'home';
        const scrollPosition = window.scrollY + 200; // Offset calculation
        
        sections.forEach(sec => {
            const top = sec.offsetTop;
            const height = sec.offsetHeight;
            if (scrollPosition >= top && scrollPosition < top + height) {
                activeId = sec.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${activeId}`) {
                link.classList.add('active');
            }
        });
    });

    // ==========================================
    // 8. SKILLS CATEGORY FILTER & SEARCH INTERACTIVE
    // ==========================================
    const skillsSearch = document.getElementById('skills-search-input');
    const skillsFilters = document.getElementById('skills-filters');
    const skillCards = document.querySelectorAll('.skill-interactive-card');
    
    let activeSkillCat = 'all';
    let activeSkillQuery = '';
    
    function filterSkills() {
        skillCards.forEach(card => {
            const name = card.getAttribute('data-name').toLowerCase();
            const cat = card.getAttribute('data-category');
            
            const matchesCat = (activeSkillCat === 'all' || cat === activeSkillCat);
            const matchesSearch = (name.includes(activeSkillQuery));
            
            if (matchesCat && matchesSearch) {
                card.classList.remove('skill-hidden');
            } else {
                card.classList.add('skill-hidden');
            }
        });
    }
    
    if (skillsSearch) {
        skillsSearch.addEventListener('input', () => {
            activeSkillQuery = skillsSearch.value.toLowerCase().trim();
            filterSkills();
        });
    }
    
    if (skillsFilters) {
        skillsFilters.addEventListener('click', (e) => {
            const btn = e.target.closest('.filter-btn');
            if (!btn) return;
            
            skillsFilters.querySelectorAll('.filter-btn').forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-selected', 'false');
            });
            btn.classList.add('active');
            btn.setAttribute('aria-selected', 'true');
            
            activeSkillCat = btn.getAttribute('data-category');
            filterSkills();
        });
    }

    // ==========================================
    // 9. EXPAND TIMELINE EXPERIENCE CARDS
    // ==========================================
    document.querySelectorAll('.expandable-card').forEach(card => {
        const toggleBtn = card.querySelector('.expand-toggle-btn');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                const isExpanded = card.classList.contains('expanded');
                card.classList.toggle('expanded');
                
                if (isExpanded) {
                    toggleBtn.innerHTML = '<i class="fas fa-chevron-down"></i> Details';
                } else {
                    toggleBtn.innerHTML = '<i class="fas fa-chevron-up"></i> Hide';
                }
            });
        }
    });

    // ==========================================
    // 10. PROJECTS FILTER, SEARCH & SORT SYSTEM
    // ==========================================
    const projSearch = document.getElementById('projects-search-input');
    const projFilters = document.getElementById('project-filters');
    const projSort = document.getElementById('project-sort');
    const projGrid = document.getElementById('projects-grid');
    const projCards = Array.from(document.querySelectorAll('.project-mac-card'));
    
    let activeProjFilter = 'all';
    let activeProjSearch = '';
    
    function filterProjects() {
        projCards.forEach(card => {
            const name = card.getAttribute('data-name');
            const brief = card.querySelector('.proj-brief').textContent.toLowerCase();
            const tech = card.getAttribute('data-tech');
            
            const matchesFilter = (activeProjFilter === 'all' || tech.includes(activeProjFilter));
            const matchesSearch = (name.includes(activeProjSearch) || brief.includes(activeProjSearch) || tech.includes(activeProjSearch));
            
            if (matchesFilter && matchesSearch) {
                card.classList.remove('proj-hidden');
            } else {
                card.classList.add('proj-hidden');
            }
        });
    }
    
    if (projSearch) {
        projSearch.addEventListener('input', () => {
            activeProjSearch = projSearch.value.toLowerCase().trim();
            filterProjects();
        });
    }
    
    if (projFilters) {
        projFilters.addEventListener('click', (e) => {
            const tab = e.target.closest('.proj-tab');
            if (!tab) return;
            
            projFilters.querySelectorAll('.proj-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            activeProjFilter = tab.getAttribute('data-filter');
            filterProjects();
        });
    }
    
    if (projSort && projGrid) {
        projSort.addEventListener('change', () => {
            const val = projSort.value;
            const sorted = [...projCards].sort((a, b) => {
                if (val === 'name') {
                    return a.getAttribute('data-name').localeCompare(b.getAttribute('data-name'));
                } else {
                    // Newest sort
                    return new Date(b.getAttribute('data-date')) - new Date(a.getAttribute('data-date'));
                }
            });
            
            projGrid.innerHTML = '';
            sorted.forEach(c => projGrid.appendChild(c));
        });
    }

    // ==========================================
    // 11. GENERATE INTERACTIVE GITHUB HEATMAP
    // ==========================================
    const githubGrid = document.getElementById('github-contrib-grid');
    if (githubGrid) {
        // Generate contribution cells for 53 weeks * 7 days = 371 cells
        for (let i = 0; i < 371; i++) {
            const cell = document.createElement('div');
            cell.className = 'day-cell';
            
            // Randomly simulate levels, with higher probability for level 0 & 1 to look organic
            const rand = Math.random() * 100;
            let level = 0;
            if (rand > 85) level = 4;
            else if (rand > 70) level = 3;
            else if (rand > 50) level = 2;
            else if (rand > 25) level = 1;
            
            cell.classList.add(`level-${level}`);
            
            // Show tooltips on hover
            const commits = level === 0 ? 'No' : level * 2 + Math.floor(Math.random() * 2);
            cell.setAttribute('title', `${commits} contributions on simulated date`);
            
            githubGrid.appendChild(cell);
        }
    }

    // ==========================================
    // 12. TESTIMONIALS SLIDER
    // ==========================================
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.carousel-dot');
    const prevBtn = document.getElementById('prev-test-btn');
    const nextBtn = document.getElementById('next-test-btn');
    let currentSlide = 0;
    
    function showSlide(index) {
        slides.forEach((s, idx) => {
            s.classList.remove('active');
            dots[idx].classList.remove('active');
        });
        
        currentSlide = (index + slides.length) % slides.length;
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }
    
    if (prevBtn) prevBtn.addEventListener('click', () => showSlide(currentSlide - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => showSlide(currentSlide + 1));
    
    dots.forEach((dot, idx) => {
        dot.addEventListener('click', () => showSlide(idx));
    });
    
    // Auto-slide testimonials every 6 seconds
    setInterval(() => {
        showSlide(currentSlide + 1);
    }, 6000);

    // ==========================================
    // 13. PRINT RESUME FUNCTIONALITY
    // ==========================================
    const btnPrint = document.getElementById('btn-print-resume');
    if (btnPrint) {
        btnPrint.addEventListener('click', () => {
            window.print();
        });
    }

    // ==========================================
    // 14. TOAST ALERTS SYSTEM
    // ==========================================
    const toastContainer = document.getElementById('toast-container');
    
    function triggerToast(message, type = 'success') {
        if (!toastContainer) return;
        
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        let iconClass = 'fa-check-circle';
        if (type === 'error') iconClass = 'fa-exclamation-circle';
        else if (type === 'info') iconClass = 'fa-info-circle';
        
        toast.innerHTML = `
            <i class="toast-icon fas ${iconClass}"></i>
            <span>${message}</span>
        `;
        
        toastContainer.appendChild(toast);
        
        // Remove toast automatically after 4 seconds
        setTimeout(() => {
            toast.classList.add('toast-closing');
            toast.addEventListener('animationend', () => {
                toast.remove();
            });
        }, 4000);
    }

    // ==========================================
    // 15. CONTACT FORM SUBMIT & ACTIONS
    // ==========================================
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const nameEl = document.getElementById('name');
            const emailEl = document.getElementById('email');
            const msgEl = document.getElementById('message');
            
            const name = nameEl.value.trim();
            const email = emailEl.value.trim();
            const message = msgEl.value.trim();
            
            let hasError = false;
            
            // Clean active errors
            document.querySelectorAll('.form-element').forEach(el => el.classList.remove('has-error'));
            
            if (!name) {
                document.getElementById('name-error').parentElement.classList.add('has-error');
                hasError = true;
            }
            if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                document.getElementById('email-error').parentElement.classList.add('has-error');
                hasError = true;
            }
            if (!message) {
                document.getElementById('message-error').parentElement.classList.add('has-error');
                hasError = true;
            }
            
            if (hasError) {
                triggerToast('Please complete all form requirements.', 'error');
                return;
            }
            
            // mailto fallback client link
            const subject = encodeURIComponent(`Portfolio inquiry from ${name}`);
            const body = encodeURIComponent(
                `Name: ${name}\n` +
                `Email: ${email}\n\n` +
                `Message:\n${message}\n\n` +
                `--- Sent from Hariom Vishwakarma Portfolio ---`
            );
            
            triggerToast('Connecting to your local email client...', 'info');
            
            setTimeout(() => {
                window.location.href = `mailto:hariomvishwakarma8076@gmail.com?subject=${subject}&body=${body}`;
                triggerToast('Mail client loading. Message sent!', 'success');
                contactForm.reset();
            }, 800);
        });
    }
    
    // Copy email action
    const emailCopyBtn = document.getElementById('copy-email-btn');
    if (emailCopyBtn) {
        emailCopyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText('hariomvishwakarma8076@gmail.com')
                .then(() => {
                    triggerToast('Email copied to clipboard!', 'success');
                })
                .catch(() => {
                    triggerToast('Failed to copy text.', 'error');
                });
        });
    }

    // Dynamic vCard download action
    const vcardBtn = document.getElementById('btn-vcard-download');
    if (vcardBtn) {
        vcardBtn.addEventListener('click', () => {
            const vcardContent = 
                "BEGIN:VCARD\r\n" +
                "VERSION:3.0\r\n" +
                "FN:Hariom Vishwakarma\r\n" +
                "TITLE:Full Stack Developer\r\n" +
                "TEL;TYPE=CELL:+918076381345\r\n" +
                "EMAIL;TYPE=PREF,INTERNET:hariomvishwakarma8076@gmail.com\r\n" +
                "URL:https://github.com/Ommii98\r\n" +
                "ADR;TYPE=HOME:;;Jaunpur;Uttar Pradesh;;India\r\n" +
                "END:VCARD";
            
            const blob = new Blob([vcardContent], { type: 'text/vcard;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'Hariom_Vishwakarma.vcf');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            triggerToast('Contact details vCard downloaded!', 'success');
        });
    }

    // ==========================================
    // 16. COMMAND PALETTE (CTRL+K SEARCH)
    // ==========================================
    const cmdPalette = document.getElementById('cmd-palette');
    const cmdTrigger = document.getElementById('cmd-trigger-btn');
    const cmdSearch = document.getElementById('cmd-search-input');
    const cmdResults = document.getElementById('cmd-palette-results');
    
    const cmdData = [
        { label: 'Go to Home', desc: 'Scroll up to main landing banner', action: 'scroll', target: 'home', icon: 'fa-home', shortcut: 'G H' },
        { label: 'Go to About Me', desc: 'Read professional narrative & academic details', action: 'scroll', target: 'about', icon: 'fa-user-tie', shortcut: 'G A' },
        { label: 'Go to Technical Skills', desc: 'Review dev tools search grids', action: 'scroll', target: 'skills', icon: 'fa-star', shortcut: 'G S' },
        { label: 'Go to Professional Experience', desc: 'Inspect work timeline & projects', action: 'scroll', target: 'experience', icon: 'fa-briefcase', shortcut: 'G E' },
        { label: 'Go to Key Projects', desc: 'Show e-commerce & medical web platforms', action: 'scroll', target: 'projects', icon: 'fa-code', shortcut: 'G P' },
        { label: 'Go to GitHub Activity', desc: 'Review commits & contributions', action: 'scroll', target: 'github', icon: 'fa-github', shortcut: 'G G' },
        { label: 'Go to Contact Section', desc: 'Send direct email inquiries', action: 'scroll', target: 'contact', icon: 'fa-envelope', shortcut: 'G C' },
        { label: 'Download Resume PDF', desc: 'Directly download resume CV', action: 'download-resume', icon: 'fa-download', shortcut: 'D R' },
        { label: 'Toggle Light/Dark Theme', desc: 'Switch visual look color themes', action: 'theme', icon: 'fa-circle-half-stroke', shortcut: 'T T' },
    ];
    
    let activeResultIdx = 0;
    
    function toggleCmdPalette() {
        if (!cmdPalette) return;
        const isOpen = cmdPalette.classList.contains('open');
        if (isOpen) {
            cmdPalette.classList.remove('open');
        } else {
            cmdPalette.classList.add('open');
            setTimeout(() => cmdSearch && cmdSearch.focus(), 50);
            renderCmdResults(cmdData);
        }
    }
    
    function renderCmdResults(items) {
        if (!cmdResults) return;
        cmdResults.innerHTML = '';
        activeResultIdx = 0;
        
        if (items.length === 0) {
            cmdResults.innerHTML = '<div class="search-no-results" style="padding: 20px; text-align: center;">No matches found.</div>';
            return;
        }
        
        items.forEach((item, idx) => {
            const el = document.createElement('div');
            el.className = `cmd-item ${idx === 0 ? 'focused' : ''}`;
            el.setAttribute('role', 'option');
            el.setAttribute('aria-selected', idx === 0 ? 'true' : 'false');
            
            el.innerHTML = `
                <div class="cmd-item-icon"><i class="fas ${item.icon}"></i></div>
                <div class="cmd-item-text">
                    <strong>${item.label}</strong>
                    <span>${item.desc}</span>
                </div>
                <div class="cmd-item-shortcut">${item.shortcut || ''}</div>
            `;
            
            el.addEventListener('click', () => triggerCmdAction(item));
            cmdResults.appendChild(el);
        });
    }
    
    function triggerCmdAction(item) {
        toggleCmdPalette();
        
        if (item.action === 'scroll') {
            const target = document.getElementById(item.target);
            if (target) target.scrollIntoView({ behavior: 'smooth' });
        } else if (item.action === 'download-resume') {
            document.getElementById('btn-download-resume')?.click();
        } else if (item.action === 'theme') {
            document.getElementById('theme-toggler')?.click();
        }
    }
    
    // Command Search filter
    if (cmdSearch) {
        cmdSearch.addEventListener('input', () => {
            const q = cmdSearch.value.toLowerCase().trim();
            if (!q) {
                renderCmdResults(cmdData);
                return;
            }
            const filtered = cmdData.filter(d => 
                d.label.toLowerCase().includes(q) || 
                d.desc.toLowerCase().includes(q)
            );
            renderCmdResults(filtered);
        });
    }
    
    // Global Keyboard listener for Ctrl+K
    window.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            toggleCmdPalette();
        }
        
        if (!cmdPalette || !cmdPalette.classList.contains('open')) return;
        
        const items = cmdResults.querySelectorAll('.cmd-item');
        
        if (e.key === 'Escape') {
            toggleCmdPalette();
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            items[activeResultIdx]?.classList.remove('focused');
            items[activeResultIdx]?.setAttribute('aria-selected', 'false');
            activeResultIdx = (activeResultIdx + 1) % items.length;
            items[activeResultIdx]?.classList.add('focused');
            items[activeResultIdx]?.setAttribute('aria-selected', 'true');
            items[activeResultIdx]?.scrollIntoView({ block: 'nearest' });
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            items[activeResultIdx]?.classList.remove('focused');
            items[activeResultIdx]?.setAttribute('aria-selected', 'false');
            activeResultIdx = (activeResultIdx - 1 + items.length) % items.length;
            items[activeResultIdx]?.classList.add('focused');
            items[activeResultIdx]?.setAttribute('aria-selected', 'true');
            items[activeResultIdx]?.scrollIntoView({ block: 'nearest' });
        } else if (e.key === 'Enter') {
            e.preventDefault();
            const focusedItem = items[activeResultIdx];
            if (focusedItem) {
                const label = focusedItem.querySelector('strong').textContent;
                const match = cmdData.find(d => d.label === label);
                if (match) triggerCmdAction(match);
            }
        }
    });
    
    if (cmdTrigger) cmdTrigger.addEventListener('click', toggleCmdPalette);
    
    // Click outside to close Command Palette
    cmdPalette?.addEventListener('click', (e) => {
        if (e.target === cmdPalette) toggleCmdPalette();
    });

    // ==========================================
    // 17. PROJECTS CASE STUDIES VIEWER MODAL
    // ==========================================
    const caseModal = document.getElementById('case-study-modal');
    const caseOverlay = document.getElementById('case-modal-overlay');
    const closeCaseBtn = document.getElementById('close-case-modal');
    const caseDetails = document.getElementById('case-study-details');
    
    const caseStudyData = {
        hospital: {
            tag: 'Full Stack Integration',
            title: 'Appointment Booking System',
            duration: '4 Months (2024)',
            teamSize: '1 (Solo Developer)',
            status: 'Completed / Active repo',
            desc: 'A robust medical operations workflow app that facilitates doctor availability alignments, slot selections, patient profiles, and medical status logs.',
            features: [
                'Triple Auth Security: Split dashboards & routes for Patients, Doctors, and Administrators.',
                'Interactive Schedulers: Dynamic slot selection grids preventing double-bookings.',
                'Alerts System: In-app real-time indicator flags for appointments approvals.'
            ],
            architecture: [
                { title: 'Frontend Layer', desc: 'React Client utilizing context states and responsive grid classes.' },
                { title: 'API Gateway', desc: 'Express Router handling session tokens and payload verification.' },
                { title: 'Database Store', desc: 'MongoDB collections storing patient charts and appointment logs.' }
            ],
            challenges: 'Managing concurrent reservation transactions when multiple patients attempt to book the exact same slot.',
            solutions: 'Implemented database schema indexes and atomic transaction constraints in MongoDB to reject duplicate slots safely, notifying the latter user instantly.'
        },
        ecommerce: {
            tag: 'MEAN Stack Commerce',
            title: 'E-Commerce Forever Hub',
            duration: '3 Months (2024)',
            teamSize: '1 (Solo Developer)',
            status: 'Completed / Active repo',
            desc: 'A secure, responsive retail shop application with real-time cart controls, JWT account security guards, dynamic catalog filters, and checkout workflows.',
            features: [
                'JWT Guards: Client-side routing checks on profile settings and cart checkouts.',
                'Dynamic Catalog: Real-time keyword parsing, pricing ranges, and category tag filters.',
                'Payment Simulator: Simulated sandbox checks showing checkout successes and database log updates.'
            ],
            architecture: [
                { title: 'Frontend Framework', desc: 'Angular Client utilizing component states and service pipelines.' },
                { title: 'Backend Runtime', desc: 'Node.js Express backend serving dynamic product indexes.' },
                { title: 'Database', desc: 'MongoDB catalog indexing with pre-computed aggregate reviews.' }
            ],
            challenges: 'Ensuring state consistency in user cart variables when switching screens or refreshing pages.',
            solutions: 'Implemented an Angular state caching service synchronized with local storage elements to seamlessly recover cart selections on page load.'
        }
    };
    
    document.querySelectorAll('.view-case-study').forEach(btn => {
        btn.addEventListener('click', () => {
            const key = btn.getAttribute('data-project');
            const data = caseStudyData[key];
            if (!data || !caseModal || !caseDetails) return;
            
            caseDetails.innerHTML = `
                <div class="case-header">
                    <span class="case-tag">${data.tag}</span>
                    <h2>${data.title}</h2>
                </div>
                
                <div class="case-meta-list">
                    <div class="meta-item">
                        <span>Timeline</span>
                        <span>${data.duration}</span>
                    </div>
                    <div class="meta-item">
                        <span>Team Size</span>
                        <span>${data.teamSize}</span>
                    </div>
                    <div class="meta-item">
                        <span>Status</span>
                        <span>${data.status}</span>
                    </div>
                </div>

                <div class="case-body-sec">
                    <h3>Project Description</h3>
                    <p>${data.desc}</p>
                </div>

                <div class="case-body-sec">
                    <h3>Key Features</h3>
                    <ul class="exp-bullet-points">
                        ${data.features.map(f => `<li>${f}</li>`).join('')}
                    </ul>
                </div>

                <div class="case-body-sec">
                    <h3>Application Architecture</h3>
                    <div class="case-architecture-grid">
                        ${data.architecture.map(arch => `
                            <div class="arch-node">
                                <strong>${arch.title}</strong>
                                <p>${arch.desc}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="case-body-sec">
                    <h3>Engineering Challenges</h3>
                    <p>${data.challenges}</p>
                </div>

                <div class="case-body-sec">
                    <h3>Applied Solutions</h3>
                    <p>${data.solutions}</p>
                </div>
            `;
            
            caseModal.classList.add('open');
        });
    });
    
    function closeCaseModal() {
        caseModal?.classList.remove('open');
    }
    
    closeCaseBtn?.addEventListener('click', closeCaseModal);
    caseOverlay?.addEventListener('click', closeCaseModal);
    
    // Close case modal on escape key
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeCaseModal();
    });

    // ==========================================
    // 18. INTERSECTION OBSERVER FOR SCROLL REVEALS
    // ==========================================
    const revealOptions = {
        threshold: 0.15,
        rootMargin: '0px'
    };
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                
                // If it is the skills dashboard wrapper, start loading progress widths
                if (entry.target.classList.contains('skills-dashboard-wrapper')) {
                    entry.target.querySelectorAll('.skill-prog-fill').forEach(fill => {
                        fill.style.width = fill.getAttribute('data-width');
                    });
                }
                
                revealObserver.unobserve(entry.target);
            }
        });
    }, revealOptions);
    
    document.querySelectorAll('.animate-on-scroll, .skills-dashboard-wrapper').forEach(el => {
        el.classList.add('animate-on-scroll');
        revealObserver.observe(el);
    });

    // Back to top click actions
    document.getElementById('back-to-top-btn')?.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});
