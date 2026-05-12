interface CountdownElements {
  root: HTMLElement;
  days: HTMLElement;
  hours: HTMLElement;
  minutes: HTMLElement;
  seconds: HTMLElement;
}

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

export function initCountdown(): void {
  const root = document.querySelector<HTMLElement>('[data-countdown]');

  if (!root) {
    return;
  }

  const targetDate = getTargetDate(root);
  const elements = getCountdownElements(root);

  if (!targetDate || !elements) {
    return;
  }

  updateCountdown(elements, targetDate);
  window.setInterval(() => updateCountdown(elements, targetDate), SECOND);
}

function getTargetDate(root: HTMLElement): Date | null {
  const value = root.dataset.targetDate;

  if (!value) {
    return null;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function getCountdownElements(root: HTMLElement): CountdownElements | null {
  const days = root.querySelector<HTMLElement>('[data-countdown-days]');
  const hours = root.querySelector<HTMLElement>('[data-countdown-hours]');
  const minutes = root.querySelector<HTMLElement>('[data-countdown-minutes]');
  const seconds = root.querySelector<HTMLElement>('[data-countdown-seconds]');

  if (!days || !hours || !minutes || !seconds) {
    return null;
  }

  return {
    root,
    days,
    hours,
    minutes,
    seconds,
  };
}

function updateCountdown(elements: CountdownElements, targetDate: Date): void {
  const remaining = Math.max(targetDate.getTime() - Date.now(), 0);
  const days = Math.floor(remaining / DAY);
  const hours = Math.floor((remaining % DAY) / HOUR);
  const minutes = Math.floor((remaining % HOUR) / MINUTE);
  const seconds = Math.floor((remaining % MINUTE) / SECOND);

  elements.days.textContent = String(days).padStart(3, '0');
  elements.hours.textContent = formatTimePart(hours);
  elements.minutes.textContent = formatTimePart(minutes);
  elements.seconds.textContent = formatTimePart(seconds);
  elements.root.classList.toggle('is-finished', remaining === 0);
}

function formatTimePart(value: number): string {
  return String(value).padStart(2, '0');
}
