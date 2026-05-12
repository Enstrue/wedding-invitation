const REVEAL_SELECTOR = '[data-reveal]';
const VISIBLE_CLASS = 'is-visible';

export function initRevealOnScroll(): void {
  const elements = Array.from(document.querySelectorAll<HTMLElement>(REVEAL_SELECTOR));

  if (elements.length === 0) {
    return;
  }

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    elements.forEach((element) => {
      element.classList.add(VISIBLE_CLASS);
    });
    return;
  }

  if (!('IntersectionObserver' in window)) {
    elements.forEach((element) => {
      element.classList.add(VISIBLE_CLASS);
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add(VISIBLE_CLASS);
        observer.unobserve(entry.target);
      });
    },
    {
      root: null,
      rootMargin: '0px 0px -12% 0px',
      threshold: 0.16,
    },
  );

  elements.forEach((element) => {
    observer.observe(element);
  });
}
