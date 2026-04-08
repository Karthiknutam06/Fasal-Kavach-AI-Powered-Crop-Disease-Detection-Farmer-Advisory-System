// --- Authentication Guard ---
(function() {
    const isAuth = localStorage.getItem('isAuthenticated') === 'true';
    const path = window.location.pathname;

    const protectedRoutes = [
        'disease-detection.html', 
        'weather.html', 
        'crop-recommendation.html', 
        'yield-prediction.html', 
        'fertilizer.html', 
        'chatbot.html'
    ];

    const isProtected = protectedRoutes.some(route => path.includes(route));

    if (isProtected && !isAuth) {
        window.location.href = 'login.html';
    }
})();

document.addEventListener('DOMContentLoaded', () => {
    const themeBtns = document.querySelectorAll('.theme-btn');
    const dropdownBtn = document.getElementById('modeDropdownBtn');
    const dropdownMenu = document.getElementById('modeDropdownMenu');
    
    // --- Dynamic Sidebar Auth Button Check ---
    const authBtnContainer = document.querySelector('.sidebar .btn-primary');
    if (authBtnContainer) {
        const isAuth = localStorage.getItem('isAuthenticated') === 'true';
        if (isAuth) {
            authBtnContainer.innerHTML = '<i class="ph ph-sign-out"></i> Log Out';
            authBtnContainer.href = '#';
            authBtnContainer.addEventListener('click', (e) => {
                e.preventDefault();
                localStorage.removeItem('isAuthenticated');
                window.location.href = 'login.html';
            });
        } else {
            authBtnContainer.innerHTML = '<i class="ph ph-sign-in"></i> Log In';
            authBtnContainer.href = 'login.html';
        }
    }
    // ------------------------------------------

    // --- Instant Link Interceptor for Protected Routes ---
    document.querySelectorAll('a').forEach(link => {
        const href = link.getAttribute('href');
        if (href) {
            const protectedRoutes = [
                'disease-detection.html', 
                'weather.html', 
                'crop-recommendation.html', 
                'yield-prediction.html', 
                'fertilizer.html', 
                'chatbot.html'
            ];
            const isProtected = protectedRoutes.some(route => href.includes(route));
            const isAuth = localStorage.getItem('isAuthenticated') === 'true';
            
            if (isProtected && !isAuth) {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    window.location.href = 'login.html';
                });
            }
        }
    });
    // -----------------------------------------------------

    // Toggle dropdown
    if (dropdownBtn && dropdownMenu) {
        dropdownBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdownMenu.style.display = dropdownMenu.style.display === 'flex' ? 'none' : 'flex';
        });

        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (!dropdownBtn.contains(e.target) && !dropdownMenu.contains(e.target)) {
                dropdownMenu.style.display = 'none';
            }
        });
    }

    // Load saved theme, defaulting to dark mode
    const savedTheme = localStorage.getItem('fasal-kavach-theme') || 'dark';
    applyTheme(savedTheme);

    themeBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const theme = btn.getAttribute('data-theme');
            applyTheme(theme);
            if(dropdownMenu) dropdownMenu.style.display = 'none';
        });
    });

    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('fasal-kavach-theme', theme);

        // Update active class on dropdown buttons
        if(themeBtns.length > 0) {
            themeBtns.forEach(btn => {
                if (btn.getAttribute('data-theme') === theme) {
                    btn.style.background = 'var(--secondary-color)';
                    btn.style.color = '#fff';
                } else {
                    btn.style.background = 'transparent';
                    btn.style.color = 'var(--text-primary)';
                }
            });
        }
    }

    // --- Google Translate Integration ---
    const gtScript = document.createElement('script');
    gtScript.type = 'text/javascript';
    gtScript.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    document.head.appendChild(gtScript);

    const gtDiv = document.createElement('div');
    gtDiv.id = 'google_translate_element';
    gtDiv.style.display = 'none';
    document.body.appendChild(gtDiv);

    window.googleTranslateElementInit = function() {
      new google.translate.TranslateElement({
          pageLanguage: 'en', 
          includedLanguages: 'en,hi,te,ta,ml,kn',
          autoDisplay: false
      }, 'google_translate_element');
    };

    // Hide Google translate top banner if it appears
    const style = document.createElement('style');
    style.innerHTML = `
        .goog-te-banner-frame.skiptranslate { display: none !important; }
        body { top: 0px !important; }
        .goog-tooltip { display: none !important; }
        .goog-tooltip:hover { display: none !important; }
        .goog-text-highlight { background-color: transparent !important; border: none !important; box-shadow: none !important; }
        #goog-gt-tt { display: none !important; }
    `;
    document.head.appendChild(style);

    const langBtn = document.getElementById('langDropdownBtn');
    const langMenu = document.getElementById('langDropdownMenu');
    
    // Language Dropdown Toggle
    if (langBtn && langMenu) {
        langBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            langMenu.style.display = langMenu.style.display === 'flex' ? 'none' : 'flex';
        });

        document.addEventListener('click', (e) => {
            if (!langBtn.contains(e.target) && !langMenu.contains(e.target)) {
                langMenu.style.display = 'none';
            }
        });

        const currentLangText = document.querySelectorAll('#currentLang');
        let savedLang = localStorage.getItem('fasal-kavach-lang') || 'en';
        
        const langBtns = document.querySelectorAll('.lang-btn');
        langBtns.forEach(btn => {
            if(btn.getAttribute('data-lang') === savedLang) {
                currentLangText.forEach(span => span.textContent = btn.getAttribute('data-lang-name'));
                btn.style.background = 'rgba(255, 255, 255, 0.1)';
            }
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const lang = btn.getAttribute('data-lang');
                
                // Update UI text immediately
                currentLangText.forEach(span => span.textContent = btn.getAttribute('data-lang-name'));
                localStorage.setItem('fasal-kavach-lang', lang);
                
                langBtns.forEach(b => b.style.background = 'transparent');
                btn.style.background = 'rgba(255, 255, 255, 0.1)';

                // Trigger Google Translate silently
                const googleSelect = document.querySelector('select.goog-te-combo');
                if(googleSelect) {
                    googleSelect.value = lang;
                    googleSelect.dispatchEvent(new Event('change'));
                } else {
                    // Fallback to cookie reload if DOM not completely loaded
                    document.cookie = 'googtrans=/en/' + lang + '; path=/';
                    document.cookie = 'googtrans=/en/' + lang + '; domain=.' + location.hostname + '; path=/';
                    location.reload();
                }
                
                langMenu.style.display = 'none';
            });
        });
        
        // Auto-trigger google translate on initial load if not English
        setTimeout(() => {
            if(savedLang !== 'en') {
                const googleSelect = document.querySelector('select.goog-te-combo');
                if(googleSelect) {
                    googleSelect.value = savedLang;
                    googleSelect.dispatchEvent(new Event('change'));
                }
            }
        }, 1500); // 1.5s delay to assure iframe loaded
    }
});
