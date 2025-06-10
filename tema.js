(() => {
    'use strict';

    const getStoredTheme = () => localStorage.getItem('theme');
    const setStoredTheme = theme => localStorage.setItem('theme', theme);

    const getPreferredTheme = () => {
        const storedTheme = getStoredTheme();
        if (storedTheme) {
            return storedTheme;
        }
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    };

    const setTheme = theme => {
        const navbar = document.querySelector('.navbar');

        if (theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.documentElement.setAttribute('data-bs-theme', 'dark');
            navbar.classList.remove('navbar-light');
            navbar.classList.add('navbar-dark');
        } else if (theme === 'light') {
            document.documentElement.setAttribute('data-bs-theme', 'light');
            navbar.classList.remove('navbar-dark');
            navbar.classList.add('navbar-light');
        } else {
            document.documentElement.setAttribute('data-bs-theme', 'dark');
            navbar.classList.remove('navbar-light');
            navbar.classList.add('navbar-dark');
        }
    };

    setTheme(getPreferredTheme());

    const showActiveTheme = (theme, focus = false) => {
        document.querySelectorAll('[data-bs-theme-value]').forEach(element => {
            element.classList.add('opacity-50');
            element.setAttribute('aria-pressed', 'false');
        });

        const btnToActive = document.querySelector(`[data-bs-theme-value="${theme}"]`);
        btnToActive.classList.remove('opacity-50');
        btnToActive.setAttribute('aria-pressed', 'true');
    };

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        const storedTheme = getStoredTheme();
        if (storedTheme !== 'light' && storedTheme !== 'dark') {
            setTheme(getPreferredTheme());
        }
    });

    window.addEventListener('DOMContentLoaded', () => {
        showActiveTheme(getPreferredTheme());

        document.querySelectorAll('[data-bs-theme-value]')
            .forEach(toggle => {
                toggle.addEventListener('click', () => {
                    const theme = toggle.getAttribute('data-bs-theme-value');
                    setStoredTheme(theme);
                    setTheme(theme);
                    showActiveTheme(theme, true);
                });
            });
    });
    
})();

