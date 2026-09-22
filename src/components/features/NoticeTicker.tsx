import { Link } from 'react-router-dom';
import { Bell } from 'lucide-react';
import type { CSSProperties } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import type { Notice } from '@/types';

/** Slim scrolling strip with the latest notice titles. */
export default function NoticeTicker({ notices }: { notices: Notice[] }) {
  const { t } = useLanguage();
  if (notices.length === 0) return null;

  const items = notices.slice(0, 6);
  const duration = Math.max(24, items.length * 14);

  const renderItems = (keyPrefix: string) =>
    items.map(n => (
      <Link
        key={`${keyPrefix}-${n.id}`}
        to="/notices"
        className="flex items-center gap-3 px-6 text-sm text-foreground/80 hover:text-primary transition-colors whitespace-nowrap"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
        {t(n.title_bn, n.title_en)}
      </Link>
    ));

  return (
    <div className="ticker bg-white border-b border-border">
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center gap-3 h-11">
        <span className="flex items-center gap-1.5 bg-primary text-primary-foreground text-xs font-bold px-3 py-1.5 rounded-full shrink-0">
          <Bell size={12} />
          {t('সর্বশেষ নোটিশ', 'Latest Notice')}
        </span>
        <div className="overflow-hidden flex-1" style={{ maskImage: 'linear-gradient(90deg, transparent, #000 4%, #000 96%, transparent)' }}>
          <div className="ticker-track" style={{ '--ticker-duration': `${duration}s` } as CSSProperties}>
            {renderItems('a')}
            {renderItems('b')}
          </div>
        </div>
      </div>
    </div>
  );
}
