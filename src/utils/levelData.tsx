import type { TalentLevel } from '@/types/Talent';

export const levelData: {
  value: TalentLevel;
  label: string;
}[] = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
  { value: 'professional_master', label: 'Professional/Master' },
];