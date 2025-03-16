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
    const menuToggle = document.querySelector('.header-menu-toggle');
    const headerNav = document.querySelector('.header-nav');
    const closeButton = document.querySelector('.header-nav__close');
    const body = document.body;
    
    if (!menuToggle || !headerNav || !closeButton) {
        console.error("Elementy menu nie zostały znalezione!");
        return;
    }
    
    // Dodanie nasłuchiwania zdarzeń dla przycisku menu
    menuToggle.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Przełączanie klas
        menuToggle.classList.toggle('is-clicked');
        headerNav.classList.toggle('menu-is-open');
        body.classList.toggle('menu-is-open');
        
        console.log('Menu toggle clicked!', {
            menuToggleClicked: menuToggle.classList.contains('is-clicked'),
            menuIsOpen: headerNav.classList.contains('menu-is-open')
        });
    });
    
    // Dodanie nasłuchiwania zdarzeń dla przycisku zamknięcia
    closeButton.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Usuwanie klas
        menuToggle.classList.remove('is-clicked');
        headerNav.classList.remove('menu-is-open');
        body.classList.remove('menu-is-open');
        
        console.log('Close button clicked!');
    });
    
    // Zamykanie menu po kliknięciu w link nawigacyjny
    const navLinks = document.querySelectorAll('.header-nav__list a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            menuToggle.classList.remove('is-clicked');
            headerNav.classList.remove('menu-is-open');
            body.classList.remove('menu-is-open');
        });
    });
}

// Obsługa menu rozwijanego języków na urządzeniach mobilnych
function setupMobileLanguageMenu() {
    const languageSelector = document.getElementById('language-selector');
    const languageDropdown = document.querySelector('.language-dropdown');
    
    if (!languageSelector || !languageDropdown) return;
    
    // Wykrywanie czy urządzenie jest mobilne
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    
    if (isMobile) {
        // Usunięcie domyślnego zachowania
        languageSelector.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            languageDropdown.classList.toggle('is-open');
        });
        
        // Zamykanie menu po kliknięciu poza nim
        document.addEventListener('click', function(e) {
            if (!languageDropdown.contains(e.target)) {
                languageDropdown.classList.remove('is-open');
            }
        });
        
        // Modyfikacja zachowania linków językowych
        const languageLinks = document.querySelectorAll('.language-menu a');
        languageLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.stopPropagation();
                // Funkcja changeLanguage jest wywoływana przez onclick w HTML
            });
        });
    }
}

// Upewnij się, że funkcja jest wywoływana po załadowaniu DOM
document.addEventListener('DOMContentLoaded', function() {
    setupMobileMenu();
    setupMobileLanguageMenu();
});

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

    // Call updateContent() on page load
    window.addEventListener('DOMContentLoaded', async () => {
    const userPreferredLanguage = localStorage.getItem('language') || 'en';
    const langData = await fetchLanguageData(userPreferredLanguage);
    updateContent(langData);
    });

    document.addEventListener('DOMContentLoaded', function() {    
        loadContent('header-section', 'sections/header.html').then(() => {
            setupMenu();
        });
        
        loadContent('about', 'sections/about.html');
        loadContent('skills', 'sections/skills.html');
        loadContent('experience', 'sections/experience.html');
        loadContent('education', 'sections/education.html');
        loadContent('courses', 'sections/courses.html');
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

// Function to update content based on selected language
function updateContent(langData) {
    // Aktualizacja tekstu w elementach
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (langData[key]) {
            element.innerHTML = langData[key];
        }
    });
    
    // Aktualizacja atrybutów alt dla obrazów
    document.querySelectorAll('[data-i18n-alt]').forEach(element => {
        const key = element.getAttribute('data-i18n-alt');
        if (langData[key]) {
            element.setAttribute('alt', langData[key]);
        }
    });
    
    // Aktualizacja atrybutów title
    document.querySelectorAll('[data-i18n-title]').forEach(element => {
        const key = element.getAttribute('data-i18n-title');
        if (langData[key]) {
            element.setAttribute('title', langData[key]);
        }
    });

    // Aktualizacja linku do CV
    const cvLink = document.getElementById('cv-download-link');
    if (cvLink && langData['CVPath']) {
        cvLink.setAttribute('href', langData['CVPath']);
    }
}

// Function to set the language preference
function setLanguagePreference(lang) {
    localStorage.setItem('language', lang);
    location.reload();
}

// Function to fetch language data
async function fetchLanguageData(lang) {
    try {
        const response = await fetch(`languages/${lang}.json`);
        if (!response.ok) {
            console.error(`Failed to load language file: ${lang}.json`);
            // Fallback to English if requested language is not available
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

// Function to change language
function changeLanguage(lang) {
    setLanguagePreference(lang);
    // Przeładowanie strony nastąpi w setLanguagePreference()
}

// Call updateContent() on page load
window.addEventListener('DOMContentLoaded', async () => {
    const userPreferredLanguage = localStorage.getItem('language') || 'en';
    const langData = await fetchLanguageData(userPreferredLanguage);
    updateContent(langData);
    
    // Aktualizacja flagi języka przy ładowaniu strony
    const currentFlag = document.getElementById('current-language-flag');
    if (currentFlag) {
        currentFlag.src = `assets/images/flags/${userPreferredLanguage}.png`;
        currentFlag.alt = userPreferredLanguage === 'en' ? 'English' : 'Polski';
    }
});