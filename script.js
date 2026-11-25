(function () {
    'use strict';

    var navToggle       = document.getElementById('navToggle');
    var navLinks        = document.getElementById('navLinks');
    var pages           = document.querySelectorAll('.page');
    var navLinkElements = document.querySelectorAll('.nav-link');
    var allPageLinks    = document.querySelectorAll('[data-page]');
    var bottomNavItems  = document.querySelectorAll('.bottom-nav .nav-item');

    /* ── Navigate to a page by id ── */
    function navigateTo(pageId) {
        // Hide all pages, show the target
        pages.forEach(function (page) { page.classList.remove('active'); });
        var target = document.getElementById(pageId);
        if (target) { target.classList.add('active'); }

        // Update desktop nav active state
        navLinkElements.forEach(function (link) {
            link.classList.remove('active');
            link.removeAttribute('aria-current');
            if (link.getAttribute('data-page') === pageId) {
                link.classList.add('active');
                link.setAttribute('aria-current', 'page');
            }
        });

        // Update bottom nav active state
        bottomNavItems.forEach(function (item) {
            item.classList.toggle('active', item.getAttribute('data-page') === pageId);
        });

        // Close mobile menu if open
        if (navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            navToggle.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    /* ── Attach click to every [data-page] element ── */
    function handlePageLink(e) {
        var pageId = e.currentTarget.getAttribute('data-page');
        if (pageId) {
            e.preventDefault();
            navigateTo(pageId);
            if (history.pushState) {
                history.pushState(null, null, '#' + pageId);
            }
        }
    }

    allPageLinks.forEach(function (el) {
        el.addEventListener('click', handlePageLink);
    });

    /* ── Keyboard support for filter tabs ── */
    document.querySelectorAll('.tab').forEach(function (tab) {
        tab.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                tab.click();
            }
        });
    });

    /* ── Hamburger toggle ── */
    navToggle.addEventListener('click', function () {
        var isOpen = navLinks.classList.toggle('active');
        navToggle.classList.toggle('active');
        navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    /* ── Browser back/forward ── */
    window.addEventListener('popstate', function () {
        var hash = window.location.hash.replace('#', '');
        navigateTo(hash && document.getElementById(hash) ? hash : 'home');
    });

    /* ── Product search filter ── */
    window.filterProducts = function (query) {
        var q = query.toLowerCase();
        document.querySelectorAll('.product-card').forEach(function (card) {
            card.style.display = card.innerText.toLowerCase().includes(q) ? '' : 'none';
        });
    };

    /* ── Product category tab filter ── */
    window.setTab = function (el, category) {
        document.querySelectorAll('.tab').forEach(function (t) { t.classList.remove('active'); });
        el.classList.add('active');
        document.querySelectorAll('.product-card').forEach(function (card) {
            card.style.display = (category === 'All' || card.dataset.category === category) ? '' : 'none';
        });
    };

    /* ── Init: read URL hash on load ── */
    (function init() {
        var hash = window.location.hash.replace('#', '');
        navigateTo(hash && document.getElementById(hash) ? hash : 'home');
    })();

})();
