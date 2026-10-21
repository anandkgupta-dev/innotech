export type SupportedLanguage = 'en' | 'hi';

export type TextScale = 'normal' | 'large' | 'xlarge';

export interface WorkflowStep {
  id: number;
  titleEn: string;
  titleHi: string;
  descEn: string;
  descHi: string;
  icon: string;
  badgeEn: string;
  badgeHi: string;
}

export interface RedFlagAlert {
  titleEn: string;
  titleHi: string;
  warningEn: string;
  warningHi: string;
  actionEn: string;
  actionHi: string;
  emergencyNumber: string;
}

export interface DemoPatientPreview {
  id: string;
  name: string;
  age: number;
  gender: string;
  department: string;
  primaryComplaint: string;
}
