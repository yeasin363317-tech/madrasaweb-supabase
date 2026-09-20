import { Calendar, Paperclip } from 'lucide-react';
import type { Notice } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';

interface NoticeCardProps {
  notice: Notice;
  expanded?: boolean;
}

export default function NoticeCard({ notice, expanded = false }: NoticeCardProps) {
  const { t } = useLanguage();
  const formattedDate = new Date(notice.date).toLocaleDateString('bn-BD', {
    year: 'numeric', month: 'long', day: 'numeric'
  });
  const formattedDateEn = new Date(notice.date).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
    <div className="card-base p-5 hover:border-primary/50 cursor-default">
      <div className="flex items-start justify-between gap-3 mb-2">
        <h3 className="text-base font-bold text-foreground leading-snug flex-1">
          {t(notice.title_bn, notice.title_en)}
        </h3>
        <span className="badge-green shrink-0">{t('প্রকাশিত', 'Published')}</span>
      </div>
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
        <Calendar size={12} />
        <span>{t(formattedDate, formattedDateEn)}</span>
      </div>
      {expanded && (
        <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">
          {t(notice.description_bn, notice.description_en)}
        </p>
      )}
      {!expanded && notice.description_bn && (
        <p className="text-sm text-muted-foreground line-clamp-2">
          {t(notice.description_bn, notice.description_en)}
        </p>
      )}
      {notice.attachment && (
        <a
          href={notice.attachment}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 mt-3 text-xs text-primary hover:underline"
        >
          <Paperclip size={12} />
          {t('সংযুক্তি দেখুন', 'View Attachment')}
        </a>
      )}
    </div>
  );
}
