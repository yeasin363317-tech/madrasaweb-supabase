
import { useScrollReveal } from '@/hooks/useScrollReveal';
import type { ReactNode, CSSProperties } from 'react';

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  delay?: number; // ms
  as?: keyof JSX.IntrinsicElements;
}

export default function AnimatedSection({
  children,
  className = '',
  style,
  delay = 0,
  as: Tag = 'div',
}: AnimatedSectionProps) {
  const { ref, visible } = useScrollReveal();

  return (
    <Tag
      ref={ref}
      className={className}
      style={{
        ...style,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(22px)',
        transition: `opacity 380ms ease ${delay}ms, transform 380ms ease ${delay}ms`,
        willChange: 'opacity, transform',
      }}
    >
      {children}
    </Tag>
  );
}
