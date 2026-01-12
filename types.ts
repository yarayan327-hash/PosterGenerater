
export type MoodStyle = 'Soft' | 'Excited' | 'Calm';
export type Gender = 'Boy' | 'Girl' | 'No Character';
export type AgeRange = 'Preschool (3-6)' | 'Child (7-12)' | 'Teen (13+)';

export interface FormData {
  studentName: string;
  classDays: string[];
  classTime: string;
  classLink: string;
  teacherName?: string;
  moodStyle: MoodStyle;
  gender: Gender;
  ageRange: AgeRange;
}

export const ARABIC_DAYS = [
  'الأحد',
  'الاثنين',
  'الثلاثاء',
  'الأربعاء',
  'الخميس',
  'الجمعة',
  'السبت'
];
