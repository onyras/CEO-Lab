/**
 * CEO Lab - Hero 3D Scroll Animation
 * Converts scroll position into 3D transforms
 */

class HeroScrollAnimation {
    constructor() {
        this.container = document.querySelector('.hero-scroll-container');
        this.header = document.querySelector('.hero-header');
        this.card = document.querySelector('.hero-3d-card');

        if (!this.container || !this.header || !this.card) return;

        this.isMobile = window.innerWidth <= 768;
        this.init();
    }

    init() {
        // Check mobile on resize
        window.addEventListener('resize', () => {
            this.isMobile = window.innerWidth <= 768;
        });

        // Scroll animation
        window.addEventListener('scroll', () => this.handleScroll(), { passive: true });

        // Initial state
        this.handleScroll();
    }

    handleScroll() {
        const rect = this.container.getBoundingClientRect();
        const containerTop = rect.top;
        const containerHeight = rect.height;
        const windowHeight = window.innerHeight;

        // Calculate scroll progress (0 to 1)
        // Progress is 0 when container top is at bottom of viewport
        // Progress is 1 when container top is at top of viewport
        const scrollProgress = Math.max(0, Math.min(1,
            1 - (containerTop / windowHeight)
        ));

        // Apply transforms
        this.animateHeader(scrollProgress);
        this.animateCard(scrollProgress);
    }

    animateHeader(progress) {
        // Move header up as we scroll (0 to -100px)
        const translateY = -progress * 100;
        this.header.style.transform = `translateY(${translateY}px)`;
    }

    animateCard(progress) {
        // Rotation: 20deg to 0deg
        const rotateX = 20 - (progress * 20);

        // Scale: 1.05 to 1 (desktop) or 0.7 to 0.9 (mobile)
        let scale;
        if (this.isMobile) {
            scale = 0.7 + (progress * 0.2); // 0.7 to 0.9
        } else {
            scale = 1.05 - (progress * 0.05); // 1.05 to 1
        }

        this.card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) scale(${scale})`;
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new HeroScrollAnimation());
} else {
    new HeroScrollAnimation();
}
