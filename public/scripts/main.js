// Main JavaScript for Resilience for Africa's Future Website

document.addEventListener('DOMContentLoaded', function() {
	// Initialize all functionality
	initNavigation();
	initScrollAnimations();
	initSmoothScroll();
	initImageLazyLoading();
	initAccessibilityEnhancements();
	initPerformanceOptimizations();

	console.log('Resilience for Africa website fully initialized');
});

// ===== NAVIGATION =====
function initNavigation() {
	const navToggle = document.querySelector('.nav__toggle');
	const navMenu = document.querySelector('.nav__menu');
	const navLinks = document.querySelectorAll('.nav__link');
	if (!navToggle || !navMenu) return;

	navToggle.addEventListener('click', function() {
		const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
		navToggle.setAttribute('aria-expanded', !isExpanded);
		navMenu.setAttribute('data-visible', !isExpanded);
		document.body.style.overflow = !isExpanded ? 'hidden' : '';
	});

	navLinks.forEach(link => {
		link.addEventListener('click', function() {
			navToggle.setAttribute('aria-expanded', 'false');
			navMenu.setAttribute('data-visible', 'false');
			document.body.style.overflow = '';
		});
	});

	document.addEventListener('click', function(event) {
		if (!navToggle.contains(event.target) && !navMenu.contains(event.target)) {
			navToggle.setAttribute('aria-expanded', 'false');
			navMenu.setAttribute('data-visible', 'false');
			document.body.style.overflow = '';
		}
	});

	document.addEventListener('keydown', function(event) {
		if (event.key === 'Escape') {
			navToggle.setAttribute('aria-expanded', 'false');
			navMenu.setAttribute('data-visible', 'false');
			document.body.style.overflow = '';
		}
	});
}

// ===== SCROLL ANIMATIONS =====
function initScrollAnimations() {
	const animatedElements = document.querySelectorAll('.animate-on-scroll');
	if (!animatedElements.length) return;

	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
		animatedElements.forEach(element => element.classList.add('fade-in'));
		return;
	}

	if ('IntersectionObserver' in window) {
		const observer = new IntersectionObserver((entries) => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					entry.target.classList.add('fade-in');
					observer.unobserve(entry.target);
				}
			});
		}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

		animatedElements.forEach(el => observer.observe(el));
	} else {
		animatedElements.forEach(el => el.classList.add('fade-in'));
	}
}

// ===== SMOOTH SCROLL =====
function initSmoothScroll() {
	const scrollLinks = document.querySelectorAll('a[href^="#"]');
	scrollLinks.forEach(link => {
		link.addEventListener('click', function(event) {
			const targetId = this.getAttribute('href');
			const targetElement = document.querySelector(targetId);
			if (targetElement) {
				event.preventDefault();
				const header = document.querySelector('.header');
				const headerHeight = header ? header.offsetHeight : 0;
				const top = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight - 20;
				window.scrollTo({ top, behavior: 'smooth' });
			}
		});
	});
}

// ===== IMAGE LAZY LOADING =====
function initImageLazyLoading() {
	const lazyImages = document.querySelectorAll('img[loading="lazy"]');
	if (!lazyImages.length) return;

	if ('IntersectionObserver' in window) {
		const imageObserver = new IntersectionObserver((entries) => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					const img = entry.target;
					img.classList.add('loaded');
					imageObserver.unobserve(img);
				}
			});
		});
		lazyImages.forEach(img => imageObserver.observe(img));
	} else {
		lazyImages.forEach(img => img.classList.add('loaded'));
	}
}

// ===== ACCESSIBILITY ENHANCEMENTS =====
function initAccessibilityEnhancements() {
	const skipLinks = document.querySelectorAll('.skip-link');
	skipLinks.forEach(link => {
		link.addEventListener('click', function(event) {
			event.preventDefault();
			const target = document.querySelector(this.getAttribute('href'));
			if (target) {
				target.setAttribute('tabindex', '-1');
				target.focus();
				target.scrollIntoView({ behavior: 'smooth' });
			}
		});
	});

}

// ===== PERFORMANCE OPTIMIZATIONS =====
function initPerformanceOptimizations() {
	const elementsWithBgImages = document.querySelectorAll('[data-bg-image]');
	if ('IntersectionObserver' in window && elementsWithBgImages.length) {
		const bgImageObserver = new IntersectionObserver((entries) => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					const element = entry.target;
					const imageUrl = element.getAttribute('data-bg-image');
					const img = new Image();
					img.onload = () => {
						element.style.backgroundImage = `url(${imageUrl})`;
						element.classList.add('bg-loaded');
					};
					img.src = imageUrl;
					bgImageObserver.unobserve(element);
				}
			});
		});
		elementsWithBgImages.forEach(el => bgImageObserver.observe(el));
	}

	// Preload critical images
	['/assets/images/logo.svg'].forEach(src => {
		const link = document.createElement('link');
		link.rel = 'preload';
		link.as = 'image';
		link.href = src;
		document.head.appendChild(link);
	});
}

// ===== SERVICE WORKER REGISTRATION =====
if ('serviceWorker' in navigator) {
	window.addEventListener('load', function() {
		navigator.serviceWorker.register('/sw.js')
			.then(() => console.log('ServiceWorker registration successful'))
			.catch(() => console.log('ServiceWorker registration failed'));
	});
}

