// Import our new components
import GitHubStats from './js/components/github-stats.js';
import AIQuoteGenerator from './js/components/ai-quotes.js';
import SmartContactForm from './js/components/contact-form.js';

// TYPING ANIMATION
class TypeWriter {
    constructor(element, words, speed = 100, delay = 2000) {
        this.element = element;
        this.words = words;
        this.speed = speed;
        this.delay = delay;
        this.wordIndex = 0;
        this.charIndex = 0;
        this.isDeleting = false;
        this.timer = null;
    }

    type() {
        const currentWord = this.words[this.wordIndex];
        const isComplete = this.charIndex === currentWord.length;

        if (this.isDeleting) {
            // Deleting text
            this.element.textContent = currentWord.substring(0, this.charIndex - 1);
            this.charIndex--;
        } else {
            // Typing text
            this.element.textContent = currentWord.substring(0, this.charIndex + 1);
            this.charIndex++;
        }

        // Determine next action
        let typeSpeed = this.speed;

        if (!this.isDeleting && this.charIndex === currentWord.length) {
            // Word complete - pause
            typeSpeed = this.delay;
            this.isDeleting = true;
        } else if (this.isDeleting && this.charIndex === 0) {
            // Word deleted - move to next
            this.isDeleting = false;
            this.wordIndex = (this.wordIndex + 1) % this.words.length;
            typeSpeed = 500; // Pause before typing next word
        }

        this.timer = setTimeout(() => this.type(), typeSpeed);
    }

    start() {
        this.type();
    }

    stop() {
        clearTimeout(this.timer);
    }
}

// Initialize Typing Animation
document.addEventListener('DOMContentLoaded', () => {
    const typedElement = document.getElementById('typed-text');
    if (typedElement) {
        const words = [
            'Building AI for the Future',
            'Creating with Code',
            'Learning Every Day',
            'Dreaming Big',
            'Making AI Accessible'
        ];
        
        const typeWriter = new TypeWriter(typedElement, words, 100, 2000);
        typeWriter.start();
    }

    // Fade-in animations for sections
    const fadeElements = document.querySelectorAll('.fade-in');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    fadeElements.forEach(element => {
        observer.observe(element);
    });

    // ... rest of your existing code
});

// Initialize components when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // 1. GitHub Stats
    const githubStats = new GitHubStats('iArthur04');
    githubStats.render('githubStatsContainer');

    // 2. AI Quote Generator
    const aiQuotes = new AIQuoteGenerator();
    aiQuotes.render('aiQuoteContainer');

    // 3. Smart Contact Form
    const contactForm = new SmartContactForm();
    contactForm.render('contactFormContainer');

    // 4. Mobile Navigation Toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // 5. Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // 6. Console Easter Egg
    console.log(`
%c🚀 Welcome to Arthur's AI Portfolio! %c
%cThis site is powered by:
- GitHub API
- AI Quote Generation
- Real-time interactivity
- Future: OpenAI integration! %c
`, 
    'background: #6C63FF; color: white; font-size: 20px; padding: 10px; border-radius: 5px;',
    'background: transparent;',
    'background: #0A0A1A; color: #6C63FF; font-size: 14px; padding: 10px;',
    'background: transparent;'
    );

    // 7. Add loading animation
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Handle errors globally
window.addEventListener('error', (e) => {
    console.error('Global error caught:', e.message);
    // You can add error tracking here later
});

// Performance monitoring
if ('performance' in window) {
    const perfData = performance.getTiming ? {
        loadTime: performance.timing.loadEventEnd - performance.timing.navigationStart,
        domReady: performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart
    } : null;
    
    if (perfData) {
        console.log('⚡ Performance:', perfData);
    }
}

// In script.js
document.addEventListener('DOMContentLoaded', () => {
    // Update footer with current date
    const lastUpdated = document.getElementById('lastUpdated');
    if (lastUpdated) {
        const now = new Date();
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        lastUpdated.textContent = now.toLocaleDateString('en-US', options);
    }
});