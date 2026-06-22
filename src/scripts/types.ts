export type Attendance = 'yes' | 'no' | '';

export type AttendanceLabel = 'Да, приду' | 'Нет, не смогу' | '';

export interface RsvpFormData {
  attendance: Attendance;
  guestName: string;
  comment: string;
}

export type RsvpFormErrors = Partial<Record<keyof Pick<RsvpFormData, 'attendance' | 'guestName'>, string>>;
