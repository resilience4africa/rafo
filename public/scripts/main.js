// Main JavaScript for Resilience for Africa's Future Website

document.addEventListener('DOMContentLoaded', function() {
	// Initialize all functionality
	initNavigation();
	initScrollAnimations();
	initCounterAnimations();
	initModal();
	initProjectFilters();
	initFormValidation();
	initSmoothScroll();
	initImageLazyLoading();
	initTabNavigation();
	initNewsletterForm();
	initEnhancedScrollAnimations();
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

// ===== COUNTER ANIMATIONS =====
function initCounterAnimations() {
	const counters = document.querySelectorAll('.impact__number[data-target]');
	if (!counters.length) return;

	const animateCounter = (counter) => {
		const target = parseInt(counter.getAttribute('data-target'), 10);
		const duration = 2000;
		const step = target / (duration / 16);
		let current = 0;
		const timer = setInterval(() => {
			current += step;
			if (current >= target) {
				counter.textContent = target.toLocaleString();
				clearInterval(timer);
			} else {
				counter.textContent = Math.floor(current).toLocaleString();
			}
		}, 16);
	};

	if ('IntersectionObserver' in window) {
		const counterObserver = new IntersectionObserver((entries) => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					animateCounter(entry.target);
					counterObserver.unobserve(entry.target);
				}
			});
		}, { threshold: 0.5 });

		counters.forEach(counter => counterObserver.observe(counter));
	}
}

// ===== MODAL FUNCTIONALITY =====
function initModal() {
	const modalTriggers = document.querySelectorAll('[href="#donate"]');
	const modal = document.getElementById('donate');
	const modalClose = document.querySelectorAll('[data-close-modal]');
	const donationAmounts = document.querySelectorAll('.donation-amount');
	const customAmountInput = document.getElementById('custom-donation');
	if (!modal) return;

	modalTriggers.forEach(trigger => {
		trigger.addEventListener('click', function(event) {
			event.preventDefault();
			openModal(modal);
		});
	});

	modalClose.forEach(closeBtn => {
		closeBtn.addEventListener('click', function() {
			closeModal(modal);
		});
	});

	donationAmounts.forEach(amount => {
		amount.addEventListener('click', function() {
			donationAmounts.forEach(btn => btn.classList.remove('selected'));
			this.classList.add('selected');
			if (customAmountInput) customAmountInput.value = '';
		});
	});

	if (customAmountInput) {
		customAmountInput.addEventListener('input', function() {
			if (this.value) donationAmounts.forEach(btn => btn.classList.remove('selected'));
		});
	}

	document.addEventListener('keydown', function(event) {
		if (event.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') {
			closeModal(modal);
		}
	});
}

function openModal(modal) {
	modal.setAttribute('aria-hidden', 'false');
	document.body.style.overflow = 'hidden';
	const firstFocusable = modal.querySelector('button, input, [tabindex]:not([tabindex="-1"])');
	if (firstFocusable) setTimeout(() => firstFocusable.focus(), 100);
}

function closeModal(modal) {
	modal.setAttribute('aria-hidden', 'true');
	document.body.style.overflow = '';
}

// ===== PROJECT FILTERS =====
function initProjectFilters() {
	const filterTabs = document.querySelectorAll('.filter-tab');
	const projectCards = document.querySelectorAll('.project-card');
	if (!filterTabs.length || !projectCards.length) return;

	filterTabs.forEach(tab => {
		tab.addEventListener('click', function() {
			const filter = this.getAttribute('data-filter');
			filterTabs.forEach(t => {
				t.classList.remove('filter-tab--active');
				t.setAttribute('aria-selected', 'false');
			});
			this.classList.add('filter-tab--active');
			this.setAttribute('aria-selected', 'true');
			filterProjects(filter, projectCards);
		});
	});
}

function filterProjects(filter, projectCards) {
	projectCards.forEach(card => {
		const category = card.getAttribute('data-category');
		if (filter === 'all' || category === filter) {
			card.style.display = 'block';
			setTimeout(() => {
				if (card.classList.contains('animate-on-scroll') && !card.classList.contains('fade-in')) {
					card.classList.add('fade-in');
				}
			}, 100);
		} else {
			card.style.display = 'none';
		}
	});
}

// ===== FORM VALIDATION =====
function initFormValidation() {
	const forms = document.querySelectorAll('form');
	forms.forEach(form => {
		form.addEventListener('submit', function(event) {
			event.preventDefault();
			if (validateForm(form)) showFormSuccess(form);
		});
		const inputs = form.querySelectorAll('input, textarea, select');
		inputs.forEach(input => {
			input.addEventListener('blur', function() { validateField(this); });
			input.addEventListener('input', function() { clearFieldError(this); });
		});
	});
}

function validateForm(form) {
	let isValid = true;
	const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
	inputs.forEach(input => { if (!validateField(input)) isValid = false; });
	return isValid;
}

function validateField(field) {
	const value = field.value.trim();
	const type = field.type;
	let isValid = true;
	let errorMessage = '';

	if (field.hasAttribute('required') && !value) {
		isValid = false;
		errorMessage = 'This field is required.';
	}
	if (type === 'email' && value) {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(value)) {
			isValid = false;
			errorMessage = 'Please enter a valid email address.';
		}
	}
	if (field.tagName === 'SELECT' && field.hasAttribute('required') && (!value || value === '')) {
		isValid = false;
		errorMessage = 'Please select an option.';
	}

	if (!isValid) showFieldError(field, errorMessage);
	else clearFieldError(field);

	return isValid;
}

function showFieldError(field, message) {
	clearFieldError(field);
	field.classList.add('error');
	field.setAttribute('aria-invalid', 'true');
	const errorElement = document.createElement('div');
	errorElement.className = 'field-error';
	errorElement.textContent = message;
	errorElement.setAttribute('role', 'alert');
	field.parentNode.appendChild(errorElement);
}

function clearFieldError(field) {
	field.classList.remove('error');
	field.setAttribute('aria-invalid', 'false');
	const existingError = field.parentNode.querySelector('.field-error');
	if (existingError) existingError.remove();
}

function showFormSuccess(form) {
	const successMessage = document.createElement('div');
	successMessage.className = 'form-success';
	successMessage.innerHTML = `
		<div class="success-icon">✓</div>
		<h3>Thank You!</h3>
		<p>Your message has been received. We'll get back to you soon.</p>
		<p><small>Note: Placeholder. Wire up with Firebase Functions or preferred form handler.</small></p>
	`;
	form.style.display = 'none';
	form.parentNode.appendChild(successMessage);
	setTimeout(() => {
		form.reset();
		form.style.display = 'block';
		successMessage.remove();
		form.querySelectorAll('.field-error').forEach(e => e.remove());
		form.querySelectorAll('.error').forEach(input => {
			input.classList.remove('error');
			input.setAttribute('aria-invalid', 'false');
		});
	}, 5000);
}

// ===== SMOOTH SCROLL =====
function initSmoothScroll() {
	const scrollLinks = document.querySelectorAll('a[href^="#"]');
	scrollLinks.forEach(link => {
		link.addEventListener('click', function(event) {
			const targetId = this.getAttribute('href');
			const targetElement = document.querySelector(targetId);
			if (targetElement && targetId !== '#donate') {
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

// ===== TAB NAVIGATION (Blog page) =====
function initTabNavigation() {
	const tabButtons = document.querySelectorAll('.tab-btn');
	const tabPanels = document.querySelectorAll('[role="tabpanel"]');
	if (!tabButtons.length || !tabPanels.length) return;

	tabButtons.forEach(button => {
		button.addEventListener('click', function() {
			const targetPanel = document.getElementById(this.getAttribute('aria-controls'));
			tabButtons.forEach(btn => {
				btn.classList.remove('tab-btn--active');
				btn.setAttribute('aria-selected', 'false');
			});
			this.classList.add('tab-btn--active');
			this.setAttribute('aria-selected', 'true');

			tabPanels.forEach(panel => { panel.style.display = 'none'; });
			if (targetPanel) targetPanel.style.display = 'block';
		});
	});
}

// ===== NEWSLETTER FORM =====
function initNewsletterForm() {
	const newsletterForm = document.getElementById('newsletter-form');
	if (!newsletterForm) return;

	newsletterForm.addEventListener('submit', function(event) {
		event.preventDefault();
		const emailInput = this.querySelector('input[type="email"]');
		const submitBtn = this.querySelector('button[type="submit"]');
		if (!emailInput.value) {
			showNotification('Please enter your email address.', 'error');
			return;
		}
		submitBtn.innerHTML = 'Subscribing...';
		submitBtn.disabled = true;
		setTimeout(() => {
			showNotification('Thank you for subscribing to our newsletter!', 'success');
			emailInput.value = '';
			submitBtn.innerHTML = 'Subscribe';
			submitBtn.disabled = false;
		}, 1500);
	});
}

// ===== ENHANCED SCROLL ANIMATIONS =====
function initEnhancedScrollAnimations() {
	const timelineItems = document.querySelectorAll('.timeline__item');
	if (timelineItems.length && 'IntersectionObserver' in window) {
		const timelineObserver = new IntersectionObserver((entries) => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					entry.target.classList.add('timeline__item--visible');
					timelineObserver.unobserve(entry.target);
				}
			});
		}, { threshold: 0.3 });
		timelineItems.forEach(item => timelineObserver.observe(item));
	}

	const gridContainers = document.querySelectorAll('.team__grid, .partners__grid');
	gridContainers.forEach(grid => {
		if ('IntersectionObserver' in window) {
			const gridObserver = new IntersectionObserver((entries) => {
				entries.forEach(entry => {
					if (entry.isIntersecting) {
						const items = entry.target.querySelectorAll('.team-member, .partner-logo');
						items.forEach((item, index) => setTimeout(() => item.classList.add('fade-in'), index * 100));
						gridObserver.unobserve(entry.target);
					}
				});
			}, { threshold: 0.2 });
			gridObserver.observe(grid);
		}
	});
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

	document.addEventListener('keydown', function(event) {
		const activeModal = document.querySelector('.modal[aria-hidden="false"]');
		if (!activeModal) return;
		if (event.key === 'Tab') trapFocus(event, activeModal);
	});
}

function trapFocus(event, container) {
	const focusableElements = container.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
	const firstElement = focusableElements[0];
	const lastElement = focusableElements[focusableElements.length - 1];
	if (event.shiftKey) {
		if (document.activeElement === firstElement) {
			lastElement.focus();
			event.preventDefault();
		}
	} else {
		if (document.activeElement === lastElement) {
			firstElement.focus();
			event.preventDefault();
		}
	}
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
	['/assets/images/hero-bg.jpg', '/assets/images/logo.svg'].forEach(src => {
		const link = document.createElement('link');
		link.rel = 'preload';
		link.as = 'image';
		link.href = src;
		document.head.appendChild(link);
	});
}

// ===== NOTIFICATION SYSTEM =====
function showNotification(message, type = 'info') {
	document.querySelectorAll('.notification').forEach(n => n.remove());
	const notification = document.createElement('div');
	notification.className = `notification notification--${type}`;
	notification.setAttribute('role', 'alert');
	notification.innerHTML = `
		<div class="notification__content">
			<span class="notification__message">${message}</span>
			<button class="notification__close" aria-label="Close notification">
				<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
				</svg>
			</button>
		</div>
	`;
	document.body.appendChild(notification);
	setTimeout(() => notification.classList.add('notification--visible'), 100);
	const autoHideTimer = setTimeout(() => hideNotification(notification), 5000);
	notification.querySelector('.notification__close').addEventListener('click', () => {
		clearTimeout(autoHideTimer);
		hideNotification(notification);
	});
}

function hideNotification(notification) {
	notification.classList.remove('notification--visible');
	setTimeout(() => notification.parentNode && notification.parentNode.removeChild(notification), 300);
}

// ===== SERVICE WORKER REGISTRATION =====
if ('serviceWorker' in navigator) {
	window.addEventListener('load', function() {
		navigator.serviceWorker.register('/sw.js')
			.then(() => console.log('ServiceWorker registration successful'))
			.catch(() => console.log('ServiceWorker registration failed'));
	});
}

// Export functions (optional)
window.ResilienceWebsite = {
	openModal,
	closeModal,
	filterProjects,
	validateForm,
	showNotification,
	hideNotification
};
