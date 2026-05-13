/**
 * Shared behaviour for gallery subpages (portrete, evenimente, produse, travel).
 * Handles: smooth scroll, scroll progress, preloader, cursor glow, blur-to-sharp
 * loading, entrance animations, image tilt, lightbox (open/close/navigate),
 * touch swipe, keyboard nav.
 *
 * Page-specific markup contract:
 *   #scroll-progress, #preloader, #cursor-glow, .gallery-item[onclick="openLightbox('...')"],
 *   #lightbox / #lightbox-img / #lightbox-prev / #lightbox-next / #lightbox-spinner / #lightbox-counter
 */
(function () {
    'use strict';

    function waitForLibraries(callback) {
        if (typeof gsap !== 'undefined' && typeof Lenis !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            callback();
        } else {
            setTimeout(function () { waitForLibraries(callback); }, 50);
        }
    }

    waitForLibraries(function () {
        gsap.registerPlugin(ScrollTrigger);

        const lenis = new Lenis({
            duration: 1.2,
            easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
            orientation: 'vertical',
            smoothWheel: true
        });
        function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
        requestAnimationFrame(raf);
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
        gsap.ticker.lagSmoothing(0);

        // Scroll progress bar
        const scrollProgress = document.getElementById('scroll-progress');
        if (scrollProgress) {
            window.addEventListener('scroll', function () {
                const scrollTop = window.scrollY;
                const docHeight = document.documentElement.scrollHeight - window.innerHeight;
                scrollProgress.style.width = (scrollTop / docHeight) * 100 + '%';
            }, { passive: true });
        }

        // Blur-to-sharp image loading
        function initBlurLoad() {
            document.querySelectorAll('.gallery-item img').forEach(function (img) {
                img.classList.add('img-blur-load');
                if (img.complete) {
                    img.classList.add('loaded');
                } else {
                    img.addEventListener('load', function () { img.classList.add('loaded'); });
                }
            });
        }

        // Preloader
        function hidePreloaderAndInit() {
            const preloader = document.getElementById('preloader');
            if (preloader) preloader.classList.add('hidden');
            initAnimations();
            initBlurLoad();
        }
        if (document.readyState === 'complete') {
            setTimeout(hidePreloaderAndInit, 300);
        } else {
            window.addEventListener('load', function () { setTimeout(hidePreloaderAndInit, 300); });
        }

        // Cursor glow (desktop only)
        const cursorGlow = document.getElementById('cursor-glow');
        if (window.innerWidth > 768 && cursorGlow) {
            document.addEventListener('mousemove', function (e) {
                gsap.to(cursorGlow, { x: e.clientX, y: e.clientY, duration: 0.5, ease: 'power2.out' });
            });
        }

        // Entrance animations
        function initAnimations() {
            gsap.from('header', { y: -50, opacity: 0, duration: 0.8, ease: 'power2.out' });
            gsap.from('section.py-16 > *', { y: 40, opacity: 0, duration: 0.8, stagger: 0.15, ease: 'power2.out' });
            gsap.from('.gallery-item', {
                y: 60, opacity: 0, duration: 0.8, stagger: 0.1, ease: 'power2.out',
                scrollTrigger: { trigger: '.grid', start: 'top 85%' }
            });
            gsap.from('section.pb-24.text-center a', {
                y: 30, opacity: 0, duration: 0.8, ease: 'power2.out',
                scrollTrigger: { trigger: 'section.pb-24.text-center', start: 'top 90%' }
            });
        }

        // Image tilt on hover
        document.querySelectorAll('.gallery-item').forEach(function (item) {
            item.addEventListener('mousemove', function (e) {
                const rect = item.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;
                gsap.to(item.querySelector('img'), {
                    rotateY: x * 10, rotateX: -y * 10, duration: 0.5, ease: 'power2.out'
                });
            });
            item.addEventListener('mouseleave', function () {
                gsap.to(item.querySelector('img'), { rotateY: 0, rotateX: 0, duration: 0.5, ease: 'power2.out' });
            });
        });

        // Lightbox
        const galleryItems = document.querySelectorAll('.gallery-item');
        let currentIndex = 0;
        let touchStartX = 0;
        let touchEndX = 0;

        function getItemSrc(item) {
            const onclick = item.getAttribute('onclick');
            if (!onclick) return null;
            const m = onclick.match(/'([^']+)'/);
            return m ? m[1] : null;
        }

        function updateCounter() {
            const counter = document.getElementById('lightbox-counter');
            if (counter) counter.textContent = (currentIndex + 1) + ' / ' + galleryItems.length;
        }

        function openLightbox(src) {
            const items = Array.from(galleryItems);
            currentIndex = items.findIndex(function (item) { return getItemSrc(item) === src; });
            if (currentIndex < 0) currentIndex = 0;

            const img = document.getElementById('lightbox-img');
            const spinner = document.getElementById('lightbox-spinner');
            img.style.visibility = 'hidden';
            img.src = '';
            if (spinner) spinner.style.display = 'flex';
            document.getElementById('lightbox').classList.add('active');
            document.body.style.overflow = 'hidden';
            updateCounter();

            const newImg = new Image();
            newImg.onload = function () {
                img.src = src;
                if (spinner) spinner.style.display = 'none';
                img.style.visibility = 'visible';
                gsap.fromTo('#lightbox-img', { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, ease: 'power2.out' });
            };
            newImg.src = src;
        }

        function closeLightbox() {
            gsap.to('#lightbox-img', {
                scale: 0.8, opacity: 0, duration: 0.3, ease: 'power2.in',
                onComplete: function () {
                    document.getElementById('lightbox').classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        }

        function navigateLightbox(direction) {
            currentIndex += direction;
            if (currentIndex < 0) currentIndex = galleryItems.length - 1;
            if (currentIndex >= galleryItems.length) currentIndex = 0;

            const src = getItemSrc(galleryItems[currentIndex]);
            const img = document.getElementById('lightbox-img');
            const spinner = document.getElementById('lightbox-spinner');
            img.style.visibility = 'hidden';
            img.src = '';
            if (spinner) spinner.style.display = 'flex';
            updateCounter();

            const newImg = new Image();
            newImg.onload = function () {
                img.src = src;
                if (spinner) spinner.style.display = 'none';
                img.style.visibility = 'visible';
                gsap.fromTo('#lightbox-img', { opacity: 0, x: direction * 50 }, { opacity: 1, x: 0, duration: 0.3, ease: 'power2.out' });
            };
            newImg.src = src;
        }

        // Expose for inline onclick handlers
        window.openLightbox = openLightbox;
        window.closeLightbox = closeLightbox;
        window.navigateLightbox = navigateLightbox;

        // Touch swipe
        const lightboxEl = document.getElementById('lightbox');
        if (lightboxEl) {
            lightboxEl.addEventListener('touchstart', function (e) { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
            lightboxEl.addEventListener('touchend', function (e) {
                touchEndX = e.changedTouches[0].screenX;
                const diff = touchStartX - touchEndX;
                if (Math.abs(diff) > 50) navigateLightbox(diff > 0 ? 1 : -1);
            }, { passive: true });
        }

        // Keyboard navigation
        document.addEventListener('keydown', function (e) {
            const lb = document.getElementById('lightbox');
            if (!lb || !lb.classList.contains('active')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') navigateLightbox(-1);
            if (e.key === 'ArrowRight') navigateLightbox(1);
        });
    });
})();
