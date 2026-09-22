import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  subtitle?: string;
  href?: string;
  linkLabel?: string;
  align?: 'left' | 'center';
  onTint?: boolean; // eyebrow gets a white pill when the section has a tinted background
}

export default function SectionHeading({
  eyebrow, title, subtitle, href, linkLabel, align = 'left', onTint = false,
}: SectionHeadingProps) {
  const center = align === 'center';
  return (
    <div className={`mb-8 md:mb-10 flex gap-4 ${center ? 'flex-col items-center text-center' : 'items-end justify-between'}`}>
      <div className={center ? 'max-w-2xl' : ''}>
        <span className={`eyebrow ${onTint ? 'bg-white' : ''}`}>{eyebrow}</span>
        <h2 className="section-title mt-3">{title}</h2>
        <span className={`block w-12 h-1 rounded-full bg-primary mt-3 ${center ? 'mx-auto' : ''}`} />
        {subtitle && <p className="section-subtitle">{subtitle}</p>}
      </div>
      {href && linkLabel && (
        <Link to={href} className="group text-sm font-semibold text-primary flex items-center gap-1 shrink-0 hover:underline">
          {linkLabel}
          <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
        </Link>
      )}
    </div>
  );
}
