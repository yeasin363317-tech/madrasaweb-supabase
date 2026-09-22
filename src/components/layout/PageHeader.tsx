import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import type { CSSProperties } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

export default function PageHeader({ title, subtitle }: PageHeaderProps) {
  const { t } = useLanguage();
  const d = (ms: number) => ({ '--d': `${ms}ms` } as CSSProperties);

  return (
    <div className="page-hero relative overflow-hidden">
      <div className="absolute -top-20 -left-16 w-64 h-64 rounded-full bg-primary/10 blur-3xl blob-float" aria-hidden="true" />
      <div className="absolute -bottom-24 -right-12 w-72 h-72 rounded-full bg-emerald-300/20 blur-3xl blob-float-slow" aria-hidden="true" />
      <div className="relative max-w-3xl mx-auto">
        <nav className="anim-rise flex items-center justify-center gap-1.5 text-xs text-muted-foreground mb-3" style={d(0)}>
          <Link to="/" className="flex items-center gap-1 hover:text-primary transition-colors">
            <Home size={12} /> {t('হোম', 'Home')}
          </Link>
          <ChevronRight size={12} />
          <span className="text-foreground font-medium">{title}</span>
        </nav>
        <h1 className="anim-rise text-3xl md:text-4xl font-bold text-foreground" style={d(100)}>
          {title}
        </h1>
        {subtitle && (
          <p className="anim-rise text-muted-foreground text-sm md:text-base mt-2" style={d(200)}>
            {subtitle}
          </p>
        )}
        <span className="anim-rise block w-14 h-1 rounded-full bg-primary mx-auto mt-4" style={d(300)} />
      </div>
    </div>
  );
}
