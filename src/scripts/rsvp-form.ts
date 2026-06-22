import type { Attendance, AttendanceLabel, RsvpFormData, RsvpFormErrors } from './types';

const FORM_ID = 'rsvp-form';
const SUCCESS_ID = 'rsvp-success';
const RSVP_ENDPOINT = 'https://script.google.com/macros/s/AKfycbyw35DX3OlVMfYYkD62v0fJMTfAiLlW9OJXlbWXlgjRYQXkKG-PtztWUWmW53ibuCAU/exec';

export function initRsvpForm(): void {
  const form = document.getElementById(FORM_ID);

  if (!(form instanceof HTMLFormElement)) {
    return;
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    hideSuccessMessage();

    const data = getFormData(form);
    const errors = validateForm(data);

    console.debug('RSVP submit attempt:', data, errors);

    renderErrors(form, errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    form.classList.add('is-submitting');

    submitRsvp(form, data)
      .then(() => {
        showSuccessMessage(form);
      })
      .catch((error) => {
        console.error('RSVP submit failed:', error);
        showSuccessMessage(form);
      })
      .finally(() => {
        form.classList.remove('is-submitting');
      });
  });
}

async function submitRsvp(form: HTMLFormElement, data: RsvpFormData): Promise<void> {
  const body = new FormData(form);
  body.set('guestName', data.guestName);
  body.set('attendance', formatAttendance(data.attendance));
  body.set('comment', data.comment);
  body.set('submittedAt', new Date().toISOString());

  console.debug('RSVP request payload:', Object.fromEntries(body.entries()));

  await fetch(RSVP_ENDPOINT, {
    method: 'POST',
    mode: 'no-cors',
    body,
  });
}

export function getFormData(form: HTMLFormElement): RsvpFormData {
  const formData = new FormData(form);
  const attendance = getAttendanceValue(formData.get('attendance'));

  return {
    attendance,
    guestName: String(formData.get('guestName') ?? '').trim(),
    comment: String(formData.get('comment') ?? '').trim(),
  };
}

export function validateForm(data: RsvpFormData): RsvpFormErrors {
  const errors: RsvpFormErrors = {};

  if (!data.attendance) {
    errors.attendance = 'Пожалуйста, выберите один из вариантов.';
  }

  if (!data.guestName) {
    errors.guestName = 'Пожалуйста, укажите имя и фамилию.';
  } else if (data.guestName.length < 2) {
    errors.guestName = 'Имя должно содержать минимум 2 символа.';
  }

  return errors;
}

export function renderErrors(form: HTMLFormElement, errors: RsvpFormErrors): void {
  const errorFields = form.querySelectorAll<HTMLElement>('[data-error-for]');

  errorFields.forEach((field) => {
    const key = field.dataset.errorFor as keyof RsvpFormErrors | undefined;

    if (!key) {
      return;
    }

    const message = errors[key] ?? '';
    const errorElement = field.querySelector<HTMLElement>('.rsvp-form__error');
    const controls = field.querySelectorAll<HTMLInputElement | HTMLFieldSetElement>('input, fieldset');
    field.classList.toggle('is-invalid', Boolean(message));

    if (errorElement) {
      errorElement.textContent = message;
    }

    controls.forEach((control) => {
      control.setAttribute('aria-invalid', String(Boolean(message)));
    });
  });
}

export function showSuccessMessage(form: HTMLFormElement): void {
  const successElement = document.getElementById(SUCCESS_ID);

  form.reset();

  if (successElement) {
    successElement.hidden = false;
  }
}

function hideSuccessMessage(): void {
  const successElement = document.getElementById(SUCCESS_ID);

  if (successElement) {
    successElement.hidden = true;
  }
}

function getAttendanceValue(value: FormDataEntryValue | null): Attendance {
  if (value === 'yes' || value === 'no') {
    return value;
  }

  return '';
}

function formatAttendance(value: Attendance): AttendanceLabel {
  if (value === 'yes') {
    return 'Да, приду';
  }

  if (value === 'no') {
    return 'Нет, не смогу';
  }

  return '';
}
