const defaultConfig = {
    business_name: 'Shree Ram Tiffin Services',
    tagline: 'Ghar ka swaad, har din aap ke paas',
    tiffin_price: 'Rs 60',
    phone_1: '94673-49976',
    phone_2: '93505-00872',
    location_text: 'Near Sanjeevani Hospital, Sirsa',
    background_color: '#0d0d0d',
    accent_color: '#FF6B35',
    text_color: '#ffffff',
    card_color: 'rgba(255,255,255,0.08)',
    secondary_action_color: '#25D366',
    font_family: 'Outfit',
    font_size: 16
};

function adjustColor(hex, amount) {
    const clean = hex.replace('#', '');
    const num = parseInt(clean, 16);
    const r = Math.min(255, Math.max(0, (num >> 16) + amount));
    const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + amount));
    const b = Math.min(255, Math.max(0, (num & 0x0000ff) + amount));
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

function setText(id, value) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = value;
    }
}

function applyConfig(config) {
    const c = { ...defaultConfig, ...config };

    setText('heroTagline', `"${c.tagline}"`);
    setText('heroPriceDisplay', c.tiffin_price);
    setText('contactPhone1', c.phone_1);
    setText('contactPhone2', c.phone_2);
    setText('contactLocation', c.location_text);
    setText('mapLocation', c.location_text);
    setText('contactMapText', `${c.location_text}, Haryana`);
    setText('footerBrand', c.business_name);
    setText('footerTagline', `"${c.tagline}"`);
    setText('plan-daily-price', c.tiffin_price);

    const parts = c.business_name.split(' ');
    const shortName = parts.slice(0, 2).join(' ');
    setText('hero-business-name', shortName);
    setText('nav-brand', shortName);

    document.documentElement.style.background = c.background_color;
    document.body.style.background = c.background_color;

    document.querySelectorAll('[style*="color:#FF6B35"], [style*="color: #FF6B35"]').forEach((element) => {
        element.style.color = c.accent_color;
    });

    document.querySelectorAll('.btn-primary').forEach((element) => {
        element.style.background = `linear-gradient(135deg, ${c.accent_color}, ${adjustColor(c.accent_color, -30)})`;
    });

    const appRoot = document.querySelector('.app-root');
    if (appRoot) {
        appRoot.style.fontFamily = `${c.font_family}, Outfit, sans-serif`;
        appRoot.style.fontSize = `${c.font_size || 16}px`;
    }
}

function initElementSdk() {
    if (!window.elementSdk) {
        applyConfig(defaultConfig);
        return;
    }

    window.elementSdk.init({
        defaultConfig,
        onConfigChange: async (config) => {
            applyConfig(config);
        },
        mapToCapabilities: (config) => {
            const c = { ...defaultConfig, ...config };
            return {
                recolorables: [
                    { get: () => c.background_color, set: (value) => window.elementSdk.setConfig({ background_color: value }) },
                    { get: () => c.card_color === defaultConfig.card_color ? '#1a1a1a' : c.card_color, set: (value) => window.elementSdk.setConfig({ card_color: value }) },
                    { get: () => c.text_color, set: (value) => window.elementSdk.setConfig({ text_color: value }) },
                    { get: () => c.accent_color, set: (value) => window.elementSdk.setConfig({ accent_color: value }) },
                    { get: () => c.secondary_action_color, set: (value) => window.elementSdk.setConfig({ secondary_action_color: value }) }
                ],
                borderables: [],
                fontEditable: {
                    get: () => c.font_family,
                    set: (value) => window.elementSdk.setConfig({ font_family: value })
                },
                fontSizeable: {
                    get: () => c.font_size,
                    set: (value) => window.elementSdk.setConfig({ font_size: value })
                }
            };
        },
        mapToEditPanelValues: (config) => {
            const c = { ...defaultConfig, ...config };
            return new Map([
                ['business_name', c.business_name],
                ['tagline', c.tagline],
                ['tiffin_price', c.tiffin_price],
                ['phone_1', c.phone_1],
                ['phone_2', c.phone_2],
                ['location_text', c.location_text]
            ]);
        }
    });
}

function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.anim-fade-up, .anim-slide-left, .anim-slide-right, .anim-scale');
    if (!animatedElements.length) {
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    animatedElements.forEach((element) => observer.observe(element));

    window.setTimeout(() => {
        document.querySelectorAll('#home .anim-fade-up, #home .anim-scale').forEach((element) => {
            element.classList.add('visible');
        });
    }, 100);
}

function initMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    const menuToggle = document.getElementById('menuToggle');
    const menuClose = document.getElementById('menuClose');

    if (!mobileMenu || !menuToggle || !menuClose) {
        return;
    }

    menuToggle.addEventListener('click', () => mobileMenu.classList.add('open'));
    menuClose.addEventListener('click', () => mobileMenu.classList.remove('open'));

    document.querySelectorAll('.mobile-nav').forEach((link) => {
        link.addEventListener('click', () => mobileMenu.classList.remove('open'));
    });
}

function initOrderForm() {
    const form = document.getElementById('orderForm');
    const successOverlay = document.getElementById('orderSuccess');
    const closeButton = document.getElementById('closeSuccess');

    if (!form || !successOverlay || !closeButton) {
        return;
    }

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const name = document.getElementById('orderName')?.value.trim();
        const phone = document.getElementById('orderPhone')?.value.trim();
        const address = document.getElementById('orderAddress')?.value.trim();

        if (!name || !phone || !address) {
            return;
        }

        successOverlay.classList.add('show');
        form.reset();
    });

    closeButton.addEventListener('click', () => {
        successOverlay.classList.remove('show');
    });
}

function initNavbarScroll() {
    const appRoot = document.getElementById('appRoot');
    const navbar = document.getElementById('navbar');

    if (!appRoot || !navbar) {
        return;
    }

    appRoot.addEventListener('scroll', () => {
        navbar.style.background = appRoot.scrollTop > 50 ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0.25)';
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initElementSdk();
    initScrollAnimations();
    initMobileMenu();
    initOrderForm();
    initNavbarScroll();

    if (window.lucide?.createIcons) {
        window.lucide.createIcons();
    }
});
