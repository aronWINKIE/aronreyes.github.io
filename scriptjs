/* ============================================
   ARON REYES - SLIDE PORTFOLIO CONTROLLER
   Typing Effect | Smooth Transitions | Navigation
   ============================================ */

class PortfolioSlider {
    constructor() {
        this.currentSlide = 0;
        this.totalSlides = 5;
        this.isAnimating = false;
        this.typingSpeed = 45;
        this.typingDelay = 300;

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
        this.startTyping(0);
        this.animateSkillBars(2);
    }

    bindEvents() {
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowDown' || e.key === 'ArrowRight' || e.key === ' ') {
                e.preventDefault();
                this.nextSlide();
            } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
                e.preventDefault();
                this.prevSlide();
            }
        });

        // Wheel navigation with debounce
        let wheelTimeout;
        document.addEventListener('wheel', (e) => {
            if (this.isAnimating) return;
            clearTimeout(wheelTimeout);
            wheelTimeout = setTimeout(() => {
                if (e.deltaY > 30) {
                    this.nextSlide();
                } else if (e.deltaY < -30) {
                    this.prevSlide();
                }
            }, 50);
        }, { passive: true });

        // Touch navigation
        let touchStartY = 0;
        document.addEventListener('touchstart', (e) => {
            touchStartY = e.touches[0].clientY;
        }, { passive: true });

        document.addEventListener('touchend', (e) => {
            if (this.isAnimating) return;
            const touchEndY = e.changedTouches[0].clientY;
            const diff = touchStartY - touchEndY;
            if (Math.abs(diff) > 50) {
                if (diff > 0) this.nextSlide();
                else this.prevSlide();
            }
        }, { passive: true });

        // Nav dots
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goToSlide(index));
        });

        // Top nav links
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const slideIndex = parseInt(link.dataset.slide);
                this.goToSlide(slideIndex);
            });
        });

        // Arrow buttons
        this.arrowUp.addEventListener('click', () => this.prevSlide());
        this.arrowDown.addEventListener('click', () => this.nextSlide());
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
        const direction = index > this.currentSlide ? 'next' : 'prev';

        // Update slides
        this.slides.forEach((slide, i) => {
            slide.classList.remove('active', 'prev', 'next');
            if (i === index) {
                slide.classList.add('active');
            } else if (i < index) {
                slide.classList.add('prev');
            } else {
                slide.classList.add('next');
            }
        });

        this.currentSlide = index;
        this.updateUI();

        // Start typing for new slide
        setTimeout(() => {
            this.startTyping(index);
            if (index === 2) this.animateSkillBars(2);
        }, 400);

        // Reset animation lock
        setTimeout(() => {
            this.isAnimating = false;
        }, 800);
    }

    updateUI() {
        // Update dots
        this.dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === this.currentSlide);
        });

        // Update counter
        if (this.currentCounter) {
            this.currentCounter.textContent = String(this.currentSlide + 1).padStart(2, '0');
        }

        // Update nav links
        this.navLinks.forEach(link => {
            const linkSlide = parseInt(link.dataset.slide);
            link.classList.toggle('active', linkSlide === this.currentSlide);
        });

        // Update arrows
        if (this.arrowUp) this.arrowUp.disabled = this.currentSlide === 0;
        if (this.arrowDown) this.arrowDown.disabled = this.currentSlide === this.totalSlides - 1;
    }

    /* ============================================
       TYPING EFFECT
       ============================================ */
    startTyping(slideIndex) {
        const slide = this.slides[slideIndex];
        if (!slide) return;

        const typeElements = slide.querySelectorAll('.type-text');

        typeElements.forEach((el, i) => {
            const text = el.dataset.text || '';
            const cursor = el.nextElementSibling;

            // Reset
            el.textContent = '';
            if (cursor) cursor.classList.add('typing');

            // Delayed start for each element
            setTimeout(() => {
                this.typeText(el, text, 0, () => {
                    if (cursor) {
                        cursor.classList.remove('typing');
                        // Add three dots animation after typing
                        this.animateDots(el, cursor);
                    }
                });
            }, i * this.typingDelay);
        });
    }

    typeText(element, text, index, callback) {
        if (index < text.length) {
            element.textContent += text.charAt(index);
            setTimeout(() => {
                this.typeText(element, text, index + 1, callback);
            }, this.typingSpeed + Math.random() * 20);
        } else {
            if (callback) callback();
        }
    }

    animateDots(element, cursor) {
        // If the text ends with "...", animate them appearing one by one
        const text = element.textContent;
        if (text.includes('...')) {
            const baseText = text.replace('...', '');
            element.textContent = baseText;

            setTimeout(() => { element.textContent = baseText + '.'; }, 200);
            setTimeout(() => { element.textContent = baseText + '..'; }, 400);
            setTimeout(() => { element.textContent = baseText + '...'; }, 600);
        }
    }

    /* ============================================
       SKILL BARS ANIMATION
       ============================================ */
    animateSkillBars(slideIndex) {
        const slide = this.slides[slideIndex];
        if (!slide) return;

        const skillItems = slide.querySelectorAll('.skill-item');
        skillItems.forEach((item, i) => {
            const level = item.dataset.level;
            const fill = item.querySelector('.skill-fill');
            if (fill && level) {
                fill.style.width = '0%';
                setTimeout(() => {
                    fill.style.width = level + '%';
                }, 300 + i * 150);
            }
        });
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    new PortfolioSlider();

    console.log('%c👋 Aron Reyes Portfolio', 'color: #c75b3a; font-size: 14px; font-weight: bold; font-family: monospace;');
    console.log('%cBuilt with ❤️ and AI assistance', 'color: #6b7b8e; font-size: 11px; font-family: monospace;');
});