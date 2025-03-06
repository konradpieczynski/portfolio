// This file contains the main JavaScript logic for the portfolio website.
// It includes functions to load content dynamically into the sections of the website.

async function loadContent(elementId, filePath) {
    try {
        const response = await fetch(filePath);
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }
        const content = await response.text();
        document.getElementById(elementId).innerHTML = extractBodyContent(content);
    } catch (error) {
        console.error(`Error loading ${filePath}:`, error);
    }
}

function extractBodyContent(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const body = doc.querySelector('body');
    return body ? body.innerHTML : html;
}

document.addEventListener('DOMContentLoaded', function() {
    loadContent('header-section', 'sections/header.html');
    loadContent('about', 'sections/about.html');
    loadContent('skills', 'sections/skills.html');
    loadContent('experience', 'sections/experience.html');
    loadContent('projects', 'sections/projects.html');
    loadContent('contact', 'sections/contact.html');
});

// Animacja elementów przy przewijaniu
function animateOnScroll() {
    const elements = document.querySelectorAll('.slide-up');
    
    elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementPosition < windowHeight - 100) {
            element.classList.add('is-visible');
        }
    });
}

// Pokaż/ukryj przycisk "wróć do góry"
function handleScrollToTopButton() {
    const goTopButton = document.querySelector('.ss-go-top');
    
    if (window.pageYOffset > 800) {
        goTopButton.classList.add('link-is-visible');
    } else {
        goTopButton.classList.remove('link-is-visible');
    }
}

// Obsługa przełączania menu mobilnego
function setupMobileMenu() {
    const toggleButton = document.querySelector('.header-menu-toggle');
    const navMenu = document.querySelector('.header-nav');
    
    if (toggleButton) {
        toggleButton.addEventListener('click', function() {
            this.classList.toggle('is-clicked');
            navMenu.classList.toggle('menu-is-open');
        });
    }
}

// Uruchom funkcje po załadowaniu strony
window.addEventListener('load', () => {
    setupMobileMenu();
    animateOnScroll();
    handleScrollToTopButton();
    
    // Nasłuchuj przewijania strony
    window.addEventListener('scroll', () => {
        animateOnScroll();
        handleScrollToTopButton();
    });
});