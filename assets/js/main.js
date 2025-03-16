// Główne funkcje pomocnicze
async function loadContent(elementId, filePath) {
    try {
        const response = await fetch(filePath);
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }
        const content = await response.text();
        document.getElementById(elementId).innerHTML = extractBodyContent(content);
        return Promise.resolve();
    } catch (error) {
        console.error(`Błąd ładowania ${filePath}:`, error);
        return Promise.reject(error);
    }
}

function extractBodyContent(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const body = doc.querySelector('body');
    return body ? body.innerHTML : html;
}

// Funkcje związane z animacją i efektami przewijania
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

function handleScrollToTopButton() {
    const goTopButton = document.querySelector('.ss-go-top');
    
    if (goTopButton) {
        if (window.pageYOffset > 800) {
            goTopButton.classList.add('link-is-visible');
        } else {
            goTopButton.classList.remove('link-is-visible');
        }
    }
}

function highlightActiveSection() {
    const sections = document.querySelectorAll('section');
    if (sections.length === 0) return;
    
    const navItems = document.querySelectorAll('.header-nav__list li');
    const scrollPosition = window.scrollY + window.innerHeight / 2;
    
    let currentSection = null;
    
    for (let i = 0; i < sections.length; i++) {
        const section = sections[i];
        if (scrollPosition >= section.offsetTop) {
            currentSection = section;
        } else {
            break;
        }
    }
    
    if (currentSection) {
        const sectionId = currentSection.getAttribute('id');
        
        navItems.forEach(item => item.classList.remove('current'));
        
        const correspondingNavItem = document.querySelector(`.header-nav__list li a[href="#${sectionId}"]`);
        if (correspondingNavItem) {
            correspondingNavItem.parentElement.classList.add('current');
        }
    }
}

// Ustawienia płynnego przewijania
function setupSmoothScrolling() {
    document.querySelectorAll('.smoothscroll').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetID = this.getAttribute('href');
            const targetSection = document.querySelector(targetID);
            
            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Obsługa menu
function setupMenu() {
    const menuToggle = document.querySelector('.header-menu-toggle');
    const headerNav = document.querySelector('.header-nav');
    const closeButton = document.querySelector('.header-nav__close');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function(e) {
            e.preventDefault();
            this.classList.toggle('is-clicked');
            headerNav.classList.toggle('menu-is-open');
            document.body.classList.toggle('menu-is-open');
        });
    }
    
    if (closeButton) {
        closeButton.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (menuToggle) menuToggle.classList.remove('is-clicked');
            if (headerNav) headerNav.classList.remove('menu-is-open');
            document.body.classList.remove('menu-is-open');
        });
    }
    
    // Zamykanie menu po kliknięciu w link, ale nie dla menu języka
    const headerLinks = document.querySelectorAll('.header-nav__list a');
    headerLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (!this.closest('.language-dropdown')) {
                if (menuToggle) menuToggle.classList.remove('is-clicked');
                if (headerNav) headerNav.classList.remove('menu-is-open');
                document.body.classList.remove('menu-is-open');
            }
        });
    });
    
    // Obsługa menu rozwijanego języków na urządzeniach mobilnych
    setupMobileLanguageMenu();
}

function setupMobileLanguageMenu() {
    const languageSelector = document.getElementById('language-selector');
    const languageDropdown = document.querySelector('.language-dropdown');
    
    if (!languageSelector || !languageDropdown) return;
    
    // Wykrywanie czy urządzenie jest mobilne
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    
    if (isMobile) {
        languageSelector.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            languageDropdown.classList.toggle('is-open');
        });
        
        document.addEventListener('click', function(e) {
            if (!languageDropdown.contains(e.target)) {
                languageDropdown.classList.remove('is-open');
            }
        });
        
        const languageLinks = document.querySelectorAll('.language-menu a');
        languageLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.stopPropagation();
                // changeLanguage jest wywoływana przez onclick w HTML
            });
        });
    }
}

// GDPR Cookie Consent
function setupCookieConsent() {
    const cookieNotice = document.getElementById('cookie-notice');
    const acceptAllBtn = document.getElementById('cookie-accept-all');
    const acceptNecessaryBtn = document.getElementById('cookie-accept-necessary');
    const settingsBtn = document.getElementById('cookie-settings');
    
    const cookieConsent = localStorage.getItem('cookieConsent');
    
    if (!cookieConsent) {
        setTimeout(() => {
            if (cookieNotice) cookieNotice.classList.add('show');
        }, 1500);
    } else {
        if (cookieConsent === 'all') {
            enableAllCookies();
        } else if (cookieConsent === 'necessary') {
            enableNecessaryCookies();
        }
    }
    
    if (acceptAllBtn) {
        acceptAllBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'all');
            cookieNotice.classList.remove('show');
            enableAllCookies();
        });
    }
    
    if (acceptNecessaryBtn) {
        acceptNecessaryBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'necessary');
            cookieNotice.classList.remove('show');
            enableNecessaryCookies();
        });
    }
    
    if (settingsBtn) {
        settingsBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'necessary');
            cookieNotice.classList.remove('show');
            enableNecessaryCookies();
        });
    }
    
    function enableAllCookies() {
        // Implementacja włączania wszystkich cookies
    }
    
    function enableNecessaryCookies() {
        // Implementacja włączania niezbędnych cookies
    }
}

// Obsługa wielojęzyczności
async function fetchLanguageData(lang) {
    try {
        const response = await fetch(`languages/${lang}.json`);
        if (!response.ok) {
            console.error(`Failed to load language file: ${lang}.json`);
            if (lang !== 'en') {
                return fetchLanguageData('en');
            }
            return {};
        }
        return response.json();
    } catch (error) {
        console.error(`Error fetching language data:`, error);
        return {};
    }
}

function updateContent(langData) {
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (langData[key]) {
            element.innerHTML = langData[key];
        }
    });
    
    document.querySelectorAll('[data-i18n-alt]').forEach(element => {
        const key = element.getAttribute('data-i18n-alt');
        if (langData[key]) {
            element.setAttribute('alt', langData[key]);
        }
    });
    
    document.querySelectorAll('[data-i18n-title]').forEach(element => {
        const key = element.getAttribute('data-i18n-title');
        if (langData[key]) {
            element.setAttribute('title', langData[key]);
        }
    });

    const cvLink = document.getElementById('cv-download-link');
    if (cvLink && langData['CVPath']) {
        cvLink.setAttribute('href', langData['CVPath']);
    }
}

function setLanguagePreference(lang) {
    localStorage.setItem('language', lang);
    location.reload();
}

function changeLanguage(lang) {
    setLanguagePreference(lang);
}

function updateLanguageFlag() {
    const userPreferredLanguage = localStorage.getItem('language') || 'en';
    const currentFlag = document.getElementById('current-language-flag');
    if (currentFlag) {
        currentFlag.src = `assets/images/flags/${userPreferredLanguage}.png`;
        currentFlag.alt = userPreferredLanguage === 'en' ? 'English' : 'Polski';
    }
}

// Funkcja inicjalizująca wszystkie moduły
async function initializeApp() {
    // Ładowanie sekcji
    await loadContent('header-section', 'sections/header.html');
    setupMenu();
    
    // Ładowanie pozostałych sekcji równolegle
    const sections = [
        ['about', 'sections/about.html'],
        ['skills', 'sections/skills.html'],
        ['experience', 'sections/experience.html'],
        ['education', 'sections/education.html'],
        ['courses', 'sections/courses.html'],
        ['projects', 'sections/projects.html'],
        ['contact', 'sections/contact.html']
    ];
    
    await Promise.all(sections.map(([id, path]) => loadContent(id, path)));
    
    // Ustawienie języka
    const userPreferredLanguage = localStorage.getItem('language') || 'en';
    const langData = await fetchLanguageData(userPreferredLanguage);
    updateContent(langData);
    updateLanguageFlag();
    
    // Inicjalizacja wszystkich pozostałych funkcji
    setupSmoothScrolling();
    setupCookieConsent();
    
    // Obsługa animacji i przewijania
    animateOnScroll();
    handleScrollToTopButton();
    
    // Odłóż inicjalizację podświetlania sekcji, aby dać czas na załadowanie
    setTimeout(() => {
        highlightActiveSection();
        window.addEventListener('scroll', () => {
            animateOnScroll();
            handleScrollToTopButton();
            highlightActiveSection();
        });
    }, 500);
    
    // Usuń klasę preloadera
    document.querySelector('body').classList.remove('ss-preload');
    const preloader = document.querySelector('#preloader');
    if (preloader) preloader.style.display = 'none';
}

// Uruchomienie aplikacji po załadowaniu dokumentu
document.addEventListener('DOMContentLoaded', initializeApp);