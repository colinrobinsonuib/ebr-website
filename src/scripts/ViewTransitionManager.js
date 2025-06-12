export class ViewTransitionManager {
	constructor() {
		this.visibleElements = new Set();
		this.observer = null;
		this.beforePreparationListener = () => this.markVisibilityState()	;
		this.init();
	}

	init() {
		// Create intersection observer to track visible elements
		this.observer = new IntersectionObserver((entries) => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					this.visibleElements.add(entry.target);
				} else {
					this.visibleElements.delete(entry.target);
				}
			});
		}, {
			rootMargin: '50px',
			threshold: 0.1
		});

		this.observeElements();

		// Handle view transitions
		document.addEventListener('astro:before-preparation', this.beforePreparationListener);

	}

	observeElements() {
		const elementsWithTransitions = document.querySelectorAll('[data-astro-transition-scope]');
		elementsWithTransitions.forEach(el => this.observer.observe(el));
	}

	markVisibilityState() {
		document.removeEventListener('astro:before-preparation', this.beforePreparationListener);
		document.querySelectorAll('[data-astro-transition-scope]').forEach(el => {
			if (!this.visibleElements.has(el)) {
				el.setAttribute('data-astro-transition-scope', 'false');
			}
		});
	}

	destroy() {
		if (this.observer) {
			this.observer.disconnect();
		}
	}
}