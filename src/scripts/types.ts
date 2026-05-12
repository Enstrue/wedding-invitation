export type Attendance = 'yes' | 'no' | '';

export type DrinkPreference =
  | 'redWine'
  | 'whiteWine'
  | 'sparklingWine'
  | 'vodka'
  | 'cognac'
  | 'nonAlcoholic';

export interface RsvpFormData {
  attendance: Attendance;
  guestName: string;
  drinks: DrinkPreference[];
  comment: string;
}

export type RsvpFormErrors = Partial<Record<keyof Pick<RsvpFormData, 'attendance' | 'guestName' | 'drinks'>, string>>;
