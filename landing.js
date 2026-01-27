/**
 * CEO Lab - Landing Page JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
    initMobileNav();
    initSmoothScroll();
    initBenefitsPopup();
    initDelayedBenefitsSlide();
    initProcessStepsAnimation();
});

/**
 * Mobile Navigation Toggle
 */
function initMobileNav() {
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
                navLinks.classList.remove('active');
            }
        });

        // Close menu when clicking a link
        const links = navLinks.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
    }
}

/**
 * Smooth Scroll for Anchor Links
 */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');

            // Skip empty or just # links
            if (href === '#' || href === '') return;

            const target = document.querySelector(href);

            if (target) {
                e.preventDefault();

                const navHeight = document.querySelector('.nav').offsetHeight;
                const targetPosition = target.offsetTop - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Benefits Slide
 */
function initBenefitsPopup() {
    const slide = document.getElementById('benefitsSlide');
    const trigger = document.getElementById('benefitsTrigger');

    if (!slide || !trigger) return;

    // Toggle slide on click
    trigger.addEventListener('click', () => {
        slide.classList.toggle('expanded');
    });
}

/**
 * Delayed Benefits Slide - Show after 3 seconds
 */
function initDelayedBenefitsSlide() {
    const slide = document.getElementById('benefitsSlide');

    if (!slide) return;

    // Show benefits slide after 3 seconds
    setTimeout(() => {
        slide.classList.add('visible');
    }, 3000);
}

/**
 * Process Steps Staggered Animation
 * Framer Motion-style animation that triggers when section comes into view
 */
function initProcessStepsAnimation() {
    const processSteps = document.querySelectorAll('.process-step');

    if (!processSteps.length) return;

    // Intersection Observer options - trigger when 30% of section is visible
    const options = {
        root: null,
        rootMargin: '0px',
        threshold: 0.3
    };

    // Callback function
    const callback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add animate-in class to trigger animation
                entry.target.classList.add('animate-in');
                // Optional: unobserve after animation to prevent re-triggering
                observer.unobserve(entry.target);
            }
        });
    };

    // Create observer
    const observer = new IntersectionObserver(callback, options);

    // Observe each step
    processSteps.forEach(step => {
        observer.observe(step);
    });
}
