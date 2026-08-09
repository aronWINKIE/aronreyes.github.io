/* ============================================
   ARON REYES — PREMIUM PORTFOLIO CONTROLLER v4.1
   FIXED: Preloader fallback | Cursor | Magnetic | Tilt | Form | Modal | Particles
   ============================================ */

// ============================================
// PRELOADER — FIXED WITH FALLBACK TIMER
// ============================================
class Preloader {
    constructor() {
        this.el = document.getElementById('preloader');
        this.startTime = Date.now();
        this.minDisplay = 1800;   // Minimum show time (ms)
        this.maxWait = 3500;      // Maximum wait before forcing hide (ms)
        this.hidden = false;
        this.init();
    }
    init() {
        const doHide = () => {
            if (this.hidden) return;
            this.hidden = true;

            const elapsed = Date.now() - this.startTime;
            const remaining = Math.max(0, this.minDisplay - elapsed);

            setTimeout(() => {
                if (this.el) {
                    this.el.classList.add('hidden');
                    setTimeout(() => this.el.remove(), 1000);
                }
                // Dispatch event so slider knows preloader is done
                window.dispatchEvent(new CustomEvent('preloaderDone'));
            }, remaining);
        };

        // Normal: hide when page fully loaded
        window.addEventListener('load', doHide);

        // FALLBACK: force hide after maxWait regardless of load state
        setTimeout(doHide, this.maxWait);
    }
}

// ============================================
// CUSTOM CURSOR
// ============================================
class CustomCursor {
    constructor() {
        this.dot = document.getElementById('cursorDot');
        this.outline = document.getElementById('cursorOutline');
        if (!this.dot || !this.outline) return;

        this.pos = { x: 0, y: 0 };
        this.outlinePos = { x: 0, y: 0 };
        this.isTouch = window.matchMedia('(pointer: coarse)').matches;

        if (this.isTouch) {
            this.dot.style.display = 'none';
            this.outline.style.display = 'none';
            document.body.style.cursor = 'auto';
            return;
        }

        this.init();
    }

    init() {
        document.addEventListener('mousemove', (e) => {
            this.pos.x = e.clientX;
            this.pos.y = e.clientY;
        });

        const hoverables = 'a, button, .magnetic, .project-card, .service-card, .skill-tag, .nav-dot, .arrow-btn, .modal-close';
        document.addEventListener('mouseover', (e) => {
            if (e.target.closest(hoverables)) {
                document.body.classList.add('hovering');
            }
        });
        document.addEventListener('mouseout', (e) => {
            if (e.target.closest(hoverables)) {
                document.body.classList.remove('hovering');
            }
        });

        this.animate();
    }

    animate() {
        this.outlinePos.x += (this.pos.x - this.outlinePos.x) * 0.15;
        this.outlinePos.y += (this.pos.y - this.outlinePos.y) * 0.15;

        this.dot.style.left = this.pos.x + 'px';
        this.dot.style.top = this.pos.y + 'px';
        this.outline.style.left = this.outlinePos.x + 'px';
        this.outline.style.top = this.outlinePos.y + 'px';

        requestAnimationFrame(() => this.animate());
    }
}

// ============================================
// MAGNETIC BUTTONS
// ============================================
class MagneticButtons {
    constructor() {
        this.elements = document.querySelectorAll('.magnetic');
        this.isTouch = window.matchMedia('(pointer: coarse)').matches;
        if (!this.isTouch) this.init();
    }

    init() {
        this.elements.forEach(el => {
            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                el.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
            });
            el.addEventListener('mouseleave', () => {
                el.style.transform = 'translate(0, 0)';
            });
        });
    }
}

// ============================================
// 3D TILT CARDS
// ============================================
class TiltCards {
    constructor() {
        this.cards = document.querySelectorAll('.tilt-card');
        this.isTouch = window.matchMedia('(pointer: coarse)').matches;
        if (!this.isTouch) this.init();
    }

    init() {
        this.cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (y - centerY) / 12;
                const rotateY = (centerX - x) / 12;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px) scale(1.02)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0) scale(1)';
            });
        });
    }
}

// ============================================
// HERO PARTICLE NETWORK
// ============================================
class ParticleNetwork {
    constructor() {
        this.canvas = document.getElementById('heroParticles');
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.maxParticles = 60;
        this.connectionDist = 120;
        this.isActive = false;

        this.resize();
        this.init();

        window.addEventListener('resize', () => this.resize());

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((m) => {
                const slide = m.target;
                if (slide.classList.contains('active') && slide.dataset.index === '0') {
                    this.isActive = true;
                    this.animate();
                } else if (!slide.classList.contains('active') && slide.dataset.index === '0') {
                    this.isActive = false;
                }
            });
        });

        const heroSlide = document.querySelector('.slide[data-index="0"]');
        if (heroSlide) observer.observe(heroSlide, { attributes: true, attributeFilter: ['class'] });

        if (heroSlide && heroSlide.classList.contains('active')) {
            this.isActive = true;
            this.animate();
        }
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    init() {
        for (let i = 0; i < this.maxParticles; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 2 + 1
            });
        }
    }

    animate() {
        if (!this.isActive) return;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles.forEach((p, i) => {
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0 || p.x > this.canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > this.canvas.height) p.vy *= -1;

            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fillStyle = 'rgba(199, 91, 58, 0.4)';
            this.ctx.fill();

            for (let j = i + 1; j < this.particles.length; j++) {
                const p2 = this.particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < this.connectionDist) {
                    const opacity = (1 - dist / this.connectionDist) * 0.15;
                    this.ctx.beginPath();
                    this.ctx.moveTo(p.x, p.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.strokeStyle = `rgba(199, 91, 58, ${opacity})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.stroke();
                }
            }
        });

        requestAnimationFrame(() => this.animate());
    }
}

// ============================================
// PORTFOLIO SLIDER
// ============================================
class PortfolioSlider {
    constructor() {
        this.currentSlide = 0;
        this.totalSlides = 5;
        this.isAnimating = false;
        this.typingSpeed = 40;
        this.typingDelay = 250;
        this.typingInProgress = false;
        this.typedSlides = new Set();
        this.preloaderDone = false;

        this.slides = document.querySelectorAll('.slide');
        this.dots = document.querySelectorAll('.nav-dot');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.arrowUp = document.getElementById('arrowUp');
        this.arrowDown = document.getElementById('arrowDown');
        this.currentCounter = document.querySelector('.slide-counter .current');

        this.init();
    }

    init() {
        this.bindEvents();
        this.updateUI();

        // Wait for preloader before starting typing
        window.addEventListener('preloaderDone', () => {
            this.preloaderDone = true;
            setTimeout(() => {
                if (!this.typedSlides.has(0)) {
                    this.startTyping(0);
                    this.typedSlides.add(0);
                }
            }, 300);
        });

        // Fallback: if preloader event missed, start after 4s
        setTimeout(() => {
            if (!this.preloaderDone && !this.typedSlides.has(0)) {
                this.startTyping(0);
                this.typedSlides.add(0);
            }
        }, 4000);

        const ctaBtn = document.getElementById('ctaBtn');
        if (ctaBtn) {
            ctaBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.goToSlide(4);
            });
        }
    }

    bindEvents() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowDown' || e.key === 'ArrowRight' || e.key === ' ') {
                e.preventDefault();
                this.nextSlide();
            } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
                e.preventDefault();
                this.prevSlide();
            } else if (e.key === 'Home') {
                e.preventDefault();
                this.goToSlide(0);
            } else if (e.key === 'End') {
                e.preventDefault();
                this.goToSlide(this.totalSlides - 1);
            }
        });

        let wheelTimeout;
        document.addEventListener('wheel', (e) => {
            if (this.isAnimating) return;
            clearTimeout(wheelTimeout);
            wheelTimeout = setTimeout(() => {
                if (e.deltaY > 30) this.nextSlide();
                else if (e.deltaY < -30) this.prevSlide();
            }, 50);
        }, { passive: true });

        let touchStartY = 0;
        let touchStartTime = 0;
        document.addEventListener('touchstart', (e) => {
            touchStartY = e.touches[0].clientY;
            touchStartTime = Date.now();
        }, { passive: true });
        document.addEventListener('touchend', (e) => {
            if (this.isAnimating) return;
            const diff = touchStartY - e.changedTouches[0].clientY;
            const timeDiff = Date.now() - touchStartTime;
            if (Math.abs(diff) > 50 && timeDiff < 500) {
                diff > 0 ? this.nextSlide() : this.prevSlide();
            }
        }, { passive: true });

        this.dots.forEach((dot, i) => {
            dot.addEventListener('click', () => this.goToSlide(i));
        });

        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.goToSlide(parseInt(link.dataset.slide));
            });
        });

        if (this.arrowUp) this.arrowUp.addEventListener('click', () => this.prevSlide());
        if (this.arrowDown) this.arrowDown.addEventListener('click', () => this.nextSlide());
    }

    nextSlide() {
        if (this.currentSlide < this.totalSlides - 1) {
            this.goToSlide(this.currentSlide + 1);
        }
    }

    prevSlide() {
        if (this.currentSlide > 0) {
            this.goToSlide(this.currentSlide - 1);
        }
    }

    goToSlide(index) {
        if (this.isAnimating || index === this.currentSlide) return;
        if (index < 0 || index >= this.totalSlides) return;

        this.isAnimating = true;

        this.slides.forEach((slide, i) => {
            slide.classList.remove('active', 'prev', 'next');
            if (i === index) slide.classList.add('active');
            else if (i < index) slide.classList.add('prev');
            else slide.classList.add('next');
        });

        this.currentSlide = index;
        this.updateUI();

        setTimeout(() => {
            if (!this.typedSlides.has(index)) {
                this.startTyping(index);
                this.typedSlides.add(index);
            }
            if (index === 2) {
                this.animateSkillBars();
                this.animateStatCounters();
            }
            if (index === 1) this.animateStatCounters();
        }, 500);

        setTimeout(() => {
            this.isAnimating = false;
        }, 800);
    }

    updateUI() {
        this.dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === this.currentSlide);
        });
        if (this.currentCounter) {
            this.currentCounter.textContent = String(this.currentSlide + 1).padStart(2, '0');
        }
        this.navLinks.forEach(link => {
            link.classList.toggle('active', parseInt(link.dataset.slide) === this.currentSlide);
        });
        if (this.arrowUp) this.arrowUp.disabled = this.currentSlide === 0;
        if (this.arrowDown) this.arrowDown.disabled = this.currentSlide === this.totalSlides - 1;
    }

    async startTyping(slideIndex) {
        const slide = this.slides[slideIndex];
        if (!slide) return;

        const typeElements = slide.querySelectorAll('.type-text, .type-paragraph');

        for (let i = 0; i < typeElements.length; i++) {
            const el = typeElements[i];
            let text = el.dataset.text || '';
            const cursor = el.nextElementSibling;

            const hasDots = text.endsWith('...');
            if (hasDots) text = text.slice(0, -3);

            el.textContent = '';
            if (cursor) {
                cursor.style.display = 'inline';
                cursor.classList.add('typing');
            }

            for (let j = 0; j < text.length; j++) {
                el.textContent += text.charAt(j);
                await this.sleep(this.typingSpeed + Math.random() * 20);
            }

            if (hasDots) {
                await this.sleep(200);
                el.textContent = text + '.';
                await this.sleep(200);
                el.textContent = text + '..';
                await this.sleep(200);
                el.textContent = text + '...';
            }

            if (cursor) {
                cursor.classList.remove('typing');
                if (i < typeElements.length - 1) {
                    cursor.style.display = 'none';
                }
            }

            await this.sleep(this.typingDelay);
        }
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    animateSkillBars() {
        const slide = this.slides[2];
        if (!slide) return;

        const skillItems = slide.querySelectorAll('.skill-item');
        skillItems.forEach((item, i) => {
            const level = item.dataset.level;
            const fill = item.querySelector('.skill-fill');
            if (fill && level) {
                fill.style.width = '0%';
                setTimeout(() => {
                    fill.style.width = level + '%';
                }, 400 + i * 150);
            }
        });
    }

    animateStatCounters() {
        const slide = this.slides[this.currentSlide];
        if (!slide) return;

        const statNums = slide.querySelectorAll('.stat-num[data-target]');
        statNums.forEach(stat => {
            const target = parseInt(stat.dataset.target);
            let current = 0;
            const increment = target / 30;
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                stat.textContent = Math.floor(current);
            }, 40);
        });
    }
}

// ============================================
// MATRIX WAVE (Contact Slide)
// ============================================
class MatrixWave {
    constructor() {
        this.canvas = document.getElementById('matrixCanvas');
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.chars = ['.', '·', '∙', '•', '◦', '○', '◌', '/', '<', '>', '{', '}', ';', ':'];
        this.resize();
        this.init();
        this.isActive = false;

        window.addEventListener('resize', () => this.resize());

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.target.classList.contains('active') && 
                    mutation.target.dataset.index === '4') {
                    this.isActive = true;
                    this.animate();
                } else if (!mutation.target.classList.contains('active') && 
                           mutation.target.dataset.index === '4') {
                    this.isActive = false;
                }
            });
        });

        document.querySelectorAll('.slide').forEach(slide => {
            observer.observe(slide, { attributes: true, attributeFilter: ['class'] });
        });

        const contactSlide = document.querySelector('.slide[data-index="4"]');
        if (contactSlide && contactSlide.classList.contains('active')) {
            this.isActive = true;
            this.animate();
        }
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight * 0.45;
    }

    init() {
        for (let i = 0; i < 120; i++) {
            this.spawnParticle(true);
        }
    }

    spawnParticle(randomY = false) {
        const x = Math.random() * this.canvas.width;
        const y = randomY ? Math.random() * this.canvas.height : -10;
        const wavePhase = (x / this.canvas.width) * Math.PI * 3;
        const waveAmp = this.canvas.height * 0.35;
        const targetY = this.canvas.height - waveAmp * Math.sin(wavePhase) - (Math.random() * 40);

        this.particles.push({
            x, y, targetY,
            char: this.chars[Math.floor(Math.random() * this.chars.length)],
            speed: 0.5 + Math.random() * 1.5,
            size: 1.5 + Math.random() * 2.5,
            alpha: 0,
            maxAlpha: 0.15 + Math.random() * 0.35,
            fadeIn: true,
            settled: false,
            settleTimer: 0,
            drift: (Math.random() - 0.5) * 0.3
        });
    }

    animate() {
        if (!this.isActive) return;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        if (this.particles.length < 200 && Math.random() > 0.85) {
            this.spawnParticle();
        }

        this.particles.forEach((p, i) => {
            if (p.fadeIn) {
                p.alpha += 0.02;
                if (p.alpha >= p.maxAlpha) {
                    p.alpha = p.maxAlpha;
                    p.fadeIn = false;
                }
            }

            if (!p.settled) {
                const dist = p.targetY - p.y;
                if (dist > 5) {
                    p.y += p.speed * (dist / 100 + 0.5);
                    p.x += p.drift;
                } else {
                    p.settled = true;
                }
            } else {
                p.y += Math.sin(Date.now() * 0.001 + p.x * 0.01) * 0.2;
                p.settleTimer++;
                if (p.settleTimer > 200 + Math.random() * 300) {
                    p.alpha -= 0.015;
                }
            }

            this.ctx.font = `${p.size}px JetBrains Mono, monospace`;
            this.ctx.fillStyle = `rgba(100, 160, 200, ${p.alpha})`;
            this.ctx.fillText(p.char, p.x, p.y);

            if (p.alpha <= 0 && !p.fadeIn) {
                this.particles.splice(i, 1);
            }
        });

        requestAnimationFrame(() => this.animate());
    }
}

// ============================================
// CONTACT FORM
// ============================================
class ContactForm {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.submitBtn = document.getElementById('submitBtn');
        this.successMsg = document.getElementById('formSuccess');
        if (!this.form) return;
        this.init();
    }

    init() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));

        const inputs = this.form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearError(input));
        });
    }

    validateField(field) {
        const group = field.closest('.form-group');
        let valid = true;

        if (field.hasAttribute('required') && !field.value.trim()) {
            valid = false;
        }
        if (field.type === 'email' && field.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(field.value)) valid = false;
        }

        if (!valid) {
            group.classList.add('error');
        } else {
            group.classList.remove('error');
        }

        return valid;
    }

    clearError(field) {
        const group = field.closest('.form-group');
        if (group) group.classList.remove('error');
    }

    handleSubmit(e) {
        e.preventDefault();

        const inputs = this.form.querySelectorAll('input[required], select[required], textarea[required]');
        let allValid = true;

        inputs.forEach(input => {
            if (!this.validateField(input)) allValid = false;
        });

        if (!allValid) return;

        this.submitBtn.classList.add('sending');
        this.submitBtn.disabled = true;

        setTimeout(() => {
            this.submitBtn.classList.remove('sending');
            this.submitBtn.disabled = false;
            this.form.reset();
            this.successMsg.classList.add('show');

            setTimeout(() => {
                this.successMsg.classList.remove('show');
            }, 5000);
        }, 2000);
    }
}

// ============================================
// PROJECT MODAL
// ============================================
class ProjectModal {
    constructor() {
        this.modal = document.getElementById('projectModal');
        this.overlay = this.modal?.querySelector('.modal-overlay');
        this.closeBtn = document.getElementById('modalClose');
        this.body = document.getElementById('modalBody');
        this.cards = document.querySelectorAll('.project-card');

        this.projectData = {
            silangbrew: {
                title: 'Upland Kafé',
                tag: 'Landing Page',
                problem: 'A local coffee shop in Silang needed an online presence to attract customers and showcase their menu.',
                solution: 'Built a warm, inviting single-page website with smooth scroll navigation, responsive design, and a modern menu grid.',
                result: 'Clean, fast-loading site that works on all devices. Perfect template for local businesses.',
                tech: ['HTML5', 'CSS3', 'JavaScript', 'Responsive Design'],
                links: [
    { text: 'View Live', url: 'https://aronwinkie.github.io/aronreyes.github.io/Upland_Kafé/', icon: 'fa-external-link-alt' },
    { text: 'View Code', url: 'https://github.com/aronWINKIE/aronreyes.github.io/tree/main/Upland_Kafé', icon: 'fa-code' }
]
            },
            taskflow: {
                title: 'TaskFlow',
                tag: 'Web Application',
                problem: 'People need a simple, fast task manager that works offline and persists data without a backend.',
                solution: 'Developed a fully functional task manager using vanilla JavaScript with localStorage for data persistence.',
                result: 'Zero-setup productivity tool with filters, stats, and animations. All data stays on the device.',
                tech: ['JavaScript', 'localStorage', 'CSS Animations', 'DOM Manipulation'],
                links: [
    { text: 'View Live', url: 'https://aronwinkie.github.io/aronreyes.github.io/taskflow/', icon: 'fa-external-link-alt' },
    { text: 'View Code', url: 'https://github.com/aronWINKIE/aronreyes.github.io/tree/main/taskflow', icon: 'fa-code' }
]
            },
            kusina: {
                title: 'Kusina Box',
                tag: 'E-Commerce Demo',
                problem: 'Filipino food businesses need affordable e-commerce solutions without complex backends.',
                solution: 'Created a complete frontend e-commerce experience with cart management, quantity controls, and checkout flow.',
                result: 'Fully interactive shopping experience. Ready to integrate with payment APIs like PayMongo or Stripe.',
                tech: ['HTML5', 'CSS3', 'JavaScript', 'Cart Logic'],
                links: [
    { text: 'View Live', url: 'https://aronwinkie.github.io/aronreyes.github.io/kusina-ph/', icon: 'fa-external-link-alt' },
    { text: 'View Code', url: 'https://github.com/aronWINKIE/aronreyes.github.io/tree/main/kusina-ph', icon: 'fa-code' }
]
            }
        };

        if (this.modal) this.init();
    }

    init() {
        this.cards.forEach(card => {
            card.addEventListener('click', () => {
                const project = card.dataset.project;
                if (project && this.projectData[project]) {
                    this.open(this.projectData[project]);
                }
            });
        });

        this.closeBtn?.addEventListener('click', () => this.close());
        this.overlay?.addEventListener('click', () => this.close());
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.close();
        });
    }

    open(data) {
        this.body.innerHTML = `
            <h2>${data.title}</h2>
            <span class="modal-tag">${data.tag}</span>
            <div class="modal-section">
                <h4>The Problem</h4>
                <p>${data.problem}</p>
            </div>
            <div class="modal-section">
                <h4>The Solution</h4>
                <p>${data.solution}</p>
            </div>
            <div class="modal-section">
                <h4>The Result</h4>
                <p>${data.result}</p>
            </div>
            <div class="modal-section">
                <h4>Tech Stack</h4>
                <div class="modal-tech">
                    ${data.tech.map(t => `<span>${t}</span>`).join('')}
                </div>
            </div>
            <div class="modal-links">
                ${data.links.map(l => `
                    <a href="${l.url}" target="_blank">
                        <i class="fas ${l.icon}"></i> ${l.text}
                    </a>
                `).join('')}
            </div>
        `;
        this.modal.classList.add('active');
        this.modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    close() {
        this.modal.classList.remove('active');
        this.modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }
}

// ============================================
// AVAILABILITY MANAGER
// ============================================
class AvailabilityManager {
    constructor() {
        this.badge = document.getElementById('availabilityBadge');
    }

    setAvailable() {
        if (!this.badge) return;
        this.badge.classList.remove('limited');
        this.badge.querySelector('.status-text').textContent = 'Available for projects';
    }

    setLimited() {
        if (!this.badge) return;
        this.badge.classList.add('limited');
        this.badge.querySelector('.status-text').textContent = 'Limited availability';
    }
}

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    new Preloader();
    new CustomCursor();
    new MagneticButtons();
    new TiltCards();
    new ParticleNetwork();
    window.slider = new PortfolioSlider();
    new MatrixWave();
    new ContactForm();
    new ProjectModal();
    new AvailabilityManager();

    console.log('%c👋 Anthony Reyes Portfolio v4.1', 'color: #c75b3a; font-size: 14px; font-weight: bold; font-family: monospace;');
    console.log('%cPremium interactive experience loaded', 'color: #6b7b8e; font-size: 11px; font-family: monospace;');
});