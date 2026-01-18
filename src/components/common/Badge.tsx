import { CEFRLevel } from '@/types/Word';

interface BadgeProps {
  level: CEFRLevel;
  size?: 'sm' | 'md' | 'lg';
}

const levelColors: Record<CEFRLevel, string> = {
  A1: 'bg-cefr-a1 text-white',
  A2: 'bg-cefr-a2 text-white',
  B1: 'bg-cefr-b1 text-white',
  B2: 'bg-cefr-b2 text-white',
  C1: 'bg-cefr-c1 text-white',
  C2: 'bg-cefr-c2 text-white',
  Unknown: 'bg-cefr-unknown text-white',
};

const levelLabels: Record<CEFRLevel, string> = {
  A1: 'A1 - Beginner',
  A2: 'A2 - Elementary',
  B1: 'B1 - Intermediate',
  B2: 'B2 - Upper Intermediate',
  C1: 'C1 - Advanced',
  C2: 'C2 - Proficient',
  Unknown: 'Unknown',
};

export function Badge({ level, size = 'md' }: BadgeProps): React.ReactElement {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  };

  return (
    <span
      className={`inline-flex items-center font-semibold rounded-full ${levelColors[level]} ${sizeClasses[size]}`}
      title={levelLabels[level]}
    >
      {level}
    </span>
  );
}
