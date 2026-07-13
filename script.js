// Navigation Toggle (Mobile)
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Close nav when link is clicked
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});

// Smooth scroll for navigation
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

// Dynamic year in footer
document.addEventListener('DOMContentLoaded', () => {
    const yearSpan = document.createElement('span');
    yearSpan.textContent = new Date().getFullYear();
    // We'll add footer later
});

// Console greeting (Easter egg)
console.log(`
%c🚀 Welcome to Arthur's Portfolio! %c
%cI'm building my AI empire. Want to join? Check out my GitHub: https://github.com/iArthur04 %c
`, 
'background: #6C63FF; color: white; font-size: 20px; padding: 10px; border-radius: 5px;',
'background: transparent;',
'background: #0A0A1A; color: #6C63FF; font-size: 14px; padding: 10px;',
'background: transparent;'
);

// Track user engagement (for your analytics later)
// This is how you'll eventually build AI that understands users
const userData = {
    pageLoadTime: new Date().toISOString(),
    screenSize: `${window.innerWidth}x${window.innerHeight}`,
    userAgent: navigator.userAgent
};

console.log('📊 User Data Collected:', userData);

// Coming soon: GitHub API integration!
// We'll add this later to show your real-time GitHub stats