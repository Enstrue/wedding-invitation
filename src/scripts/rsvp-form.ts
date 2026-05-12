import type { Attendance, DrinkPreference, RsvpFormData, RsvpFormErrors } from './types';

const FORM_ID = 'rsvp-form';
const SUCCESS_ID = 'rsvp-success';

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

    renderErrors(form, errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    console.log('RSVP response:', data);
    showSuccessMessage(form);
  });
}

export function getFormData(form: HTMLFormElement): RsvpFormData {
  const formData = new FormData(form);
  const attendance = getAttendanceValue(formData.get('attendance'));
  const drinks = formData
    .getAll('drinks')
    .map((drink) => String(drink))
    .filter(isDrinkPreference);

  return {
    attendance,
    guestName: String(formData.get('guestName') ?? '').trim(),
    drinks,
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

  if (data.attendance === 'yes' && data.drinks.length === 0) {
    errors.drinks = 'Пожалуйста, выберите хотя бы один напиток.';
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

function isDrinkPreference(value: string): value is DrinkPreference {
  return ['redWine', 'whiteWine', 'sparklingWine', 'vodka', 'cognac', 'nonAlcoholic'].includes(value);
}
