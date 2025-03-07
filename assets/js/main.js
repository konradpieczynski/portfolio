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
    loadContent('education', 'sections/education.html');
    loadContent('courses', 'sections/courses.html');
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


    // Preloader
    window.addEventListener('load', function() {
        document.querySelector('body').classList.remove('ss-preload');
        document.querySelector('#preloader').style.display = 'none';
        
        // Inicjalizacja przycisku "wróć do góry"
        handleScrollToTopButton();
        window.addEventListener('scroll', handleScrollToTopButton);
    });

    // Smooth Scrolling
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

    // Obsługa przycisku "wróć do góry"
    function handleScrollToTopButton() {
        const goTopButton = document.querySelector('.ss-go-top');
        
        if (window.pageYOffset > 800) {
            goTopButton.classList.add('link-is-visible');
        } else {
            goTopButton.classList.remove('link-is-visible');
        }
    }

    // Funkcja do ładowania zawartości HTML
    async function loadContent(elementId, filePath) {
        try {
            const response = await fetch(filePath);
            if (!response.ok) {
                throw new Error(`Błąd HTTP: ${response.status}`);
            }
            const content = await response.text();
            document.getElementById(elementId).innerHTML = extractBodyContent(content);
            return Promise.resolve();
        } catch (error) {
            console.error(`Błąd ładowania ${filePath}:`, error);
            return Promise.reject(error);
        }
    }

    // Funkcja do wyodrębniania zawartości sekcji body
    function extractBodyContent(html) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const body = doc.querySelector('body');
        return body ? body.innerHTML : html;
    }

    // Ładowanie wszystkich sekcji po załadowaniu strony
    document.addEventListener('DOMContentLoaded', function() {
        loadContent('header-section', 'sections/header.html').then(() => {
            // Uruchom setupMenu dopiero po załadowaniu nagłówka
            setupMenu();
        });
        
        loadContent('about', 'sections/about.html');
        loadContent('skills', 'sections/skills.html');
        loadContent('experience', 'sections/experience.html');
        loadContent('education', 'sections/education.html');
        loadContent('projects', 'sections/projects.html');
        loadContent('contact', 'sections/contact.html');

        // Dodaj obsługę zgody na cookies
        setupCookieConsent();
    });

    function setupMenu() {
        // Wyszukaj wstawiony przycisk po faktycznym wczytaniu nagłówka
        const menuToggle = document.querySelector('.header-menu-toggle');
        const headerNav = document.querySelector('.header-nav');
        const closeButton = document.querySelector('.header-nav__close');
        
        // Obsługa przycisku menu
        if (menuToggle) {
            menuToggle.addEventListener('click', function(e) {
                e.preventDefault();
                this.classList.toggle('is-clicked');
                headerNav.classList.toggle('menu-is-open');
                document.body.classList.toggle('menu-is-open');
            });
        }
        
        // Obsługa przycisku zamknięcia - naprawiony kod
        if (closeButton) {
            console.log('Znaleziono przycisk zamknięcia:', closeButton);
            
            closeButton.addEventListener('click', function(e) {
                console.log('Kliknięto przycisk zamknięcia');
                e.preventDefault();
                
                // Usuwamy klasy odpowiedzialne za otwarcie menu
                if (menuToggle) menuToggle.classList.remove('is-clicked');
                if (headerNav) headerNav.classList.remove('menu-is-open');
                document.body.classList.remove('menu-is-open');
            });
        } else {
            console.error('Nie znaleziono przycisku zamknięcia');
        }
        
        // Zamykanie menu po kliknięciu w link
        const headerLinks = document.querySelectorAll('.header-nav__list a');
        headerLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (menuToggle) menuToggle.classList.remove('is-clicked');
                if (headerNav) headerNav.classList.remove('menu-is-open');
                document.body.classList.remove('menu-is-open');
            });
        });
        
        // Dodajemy śledzenie aktywnej sekcji podczas przewijania
        window.addEventListener('scroll', highlightActiveSection);
    }
    
    // Funkcja wyróżniająca aktywną sekcję w menu
    function highlightActiveSection() {
        // Pobierz wszystkie sekcje
        const sections = document.querySelectorAll('section');
        // Sprawdź, czy sekcje zostały już załadowane
        if (sections.length === 0) return;
        
        const navItems = document.querySelectorAll('.header-nav__list li');
        
        // Sprawdź pozycję przewijania
        const scrollPosition = window.scrollY + window.innerHeight / 2; // Używamy połowy wysokości okna
        
        // Znajdź aktualną sekcję
        let currentSection = null;
        
        // Sprawdzamy każdą sekcję od góry do dołu
        for (let i = 0; i < sections.length; i++) {
            const section = sections[i];
            if (scrollPosition >= section.offsetTop) {
                currentSection = section;
            } else {
                break;
            }
        }
        
        // Jeśli znaleziono aktywną sekcję, podświetl ją w menu
        if (currentSection) {
            const sectionId = currentSection.getAttribute('id');
            
            // Usuń klasę 'current' ze wszystkich elementów menu
            navItems.forEach(item => item.classList.remove('current'));
            
            // Dodaj klasę 'current' do odpowiedniego elementu menu
            const correspondingNavItem = document.querySelector(`.header-nav__list li a[href="#${sectionId}"]`);
            if (correspondingNavItem) {
                correspondingNavItem.parentElement.classList.add('current');
            }
        }
    }

    // Lepsze wywołanie funkcji po załadowaniu wszystkich treści
    function initHighlighting() {
        // Upewnij się, że wszystkie sekcje są załadowane
        if (document.querySelectorAll('section').length > 0) {
            highlightActiveSection();
            window.addEventListener('scroll', highlightActiveSection);
        } else {
            // Jeśli sekcje nie są jeszcze załadowane, spróbuj ponownie za chwilę
            setTimeout(initHighlighting, 200);
        }
    }

    // Uruchamiamy inicjalizację po pełnym załadowaniu strony
    window.addEventListener('load', () => {
        // Daj trochę czasu na załadowanie wszystkich sekcji
        setTimeout(initHighlighting, 500);
    });

// GDPR Cookie Consent
function setupCookieConsent() {
    const cookieNotice = document.getElementById('cookie-notice');
    const acceptAllBtn = document.getElementById('cookie-accept-all');
    const acceptNecessaryBtn = document.getElementById('cookie-accept-necessary');
    const settingsBtn = document.getElementById('cookie-settings');
    
    // Sprawdź, czy użytkownik już dokonał wyboru
    const cookieConsent = localStorage.getItem('cookieConsent');
    
    if (!cookieConsent) {
        // Jeśli nie ma zapisanej zgody, pokaż baner
        setTimeout(() => {
            cookieNotice.classList.add('show');
        }, 1500);
    } else {
        // Jeśli zgoda jest już zapisana, zastosuj odpowiednie ustawienia
        if (cookieConsent === 'all') {
            enableAllCookies();
        } else if (cookieConsent === 'necessary') {
            enableNecessaryCookies();
        }
    }
    
    // Obsługa kliknięcia "Akceptuj wszystkie"
    if (acceptAllBtn) {
        acceptAllBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'all');
            cookieNotice.classList.remove('show');
            enableAllCookies();
        });
    }
    
    // Obsługa kliknięcia "Tylko niezbędne"
    if (acceptNecessaryBtn) {
        acceptNecessaryBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'necessary');
            cookieNotice.classList.remove('show');
            enableNecessaryCookies();
        });
    }
    
    // Obsługa kliknięcia "Ustawienia"
    if (settingsBtn) {
        settingsBtn.addEventListener('click', () => {
            // W przyszłości tutaj można dodać otwieranie modalu z ustawieniami
            localStorage.setItem('cookieConsent', 'necessary');
            cookieNotice.classList.remove('show');
            enableNecessaryCookies();
        });
    }
    
    // Funkcje włączające odpowiednie cookies
    function enableAllCookies() {
        
    }
    
    function enableNecessaryCookies() {
    }
}
