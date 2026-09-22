import { Calendar, Paperclip, Download } from 'lucide-react';
import type { Notice } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';

interface NoticeCardProps {
  notice: Notice;
  expanded?: boolean;
}

const IMAGE_RE = /\.(jpe?g|png|webp|gif|avif)(\?.*)?$/i;

export default function NoticeCard({ notice, expanded = false }: NoticeCardProps) {
  const { t, isBn } = useLanguage();
  const d = new Date(notice.date);
  const valid = !isNaN(d.getTime());
  const locale = isBn ? 'bn-BD' : 'en-US';
  const fullDate = valid
    ? d.toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' })
    : notice.date;
  const day = valid ? d.toLocaleDateString(locale, { day: 'numeric' }) : '';
  const month = valid ? d.toLocaleDateString(locale, { month: 'short' }) : '';
  const year = valid ? d.toLocaleDateString(locale, { year: 'numeric' }) : '';
  const isImage = !!notice.attachment && IMAGE_RE.test(notice.attachment);

  return (
    <article className="card-base p-5 md:p-6 flex gap-4 md:gap-5 hover:border-primary/40">
      {valid && (
        <div className="tint tint-green hidden sm:flex flex-col items-center justify-center w-[72px] shrink-0 self-start rounded-2xl py-3 text-center hover:!transform-none">
          <span className="text-2xl font-bold leading-none">{day}</span>
          <span className="text-xs font-semibold mt-1">{month}</span>
          <span className="text-[10px] opacity-70 mt-0.5">{year}</span>
        </div>
      )}

      <div className="flex-1 min-w-0">
        <h3 className="text-base md:text-lg font-bold text-foreground leading-snug">
          {t(notice.title_bn, notice.title_en)}
        </h3>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1.5 mb-3 sm:hidden">
          <Calendar size={12} />
          <span>{fullDate}</span>
        </div>

        {expanded && (notice.description_bn || notice.description_en) && (
          <p className="text-sm md:text-[15px] text-foreground/80 leading-relaxed whitespace-pre-wrap mt-2">
            {t(notice.description_bn, notice.description_en)}
          </p>
        )}
        {!expanded && notice.description_bn && (
          <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
            {t(notice.description_bn, notice.description_en)}
          </p>
        )}

        {notice.attachment && isImage && expanded && (
          <a href={notice.attachment} target="_blank" rel="noopener noreferrer" className="block mt-4 group">
            <img
              src={notice.attachment}
              alt={t(notice.title_bn, notice.title_en)}
              loading="lazy"
              className="rounded-2xl border border-border max-h-80 w-auto max-w-full object-contain bg-secondary transition-transform duration-300 group-hover:scale-[1.01]"
            />
          </a>
        )}

        {notice.attachment && (
          <a
            href={notice.attachment}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-4 text-sm font-semibold text-primary bg-secondary hover:bg-accent px-4 py-2 rounded-xl transition-colors"
          >
            {isImage ? <Paperclip size={14} /> : <Download size={14} />}
            {t('সংযুক্তি দেখুন', 'View Attachment')}
          </a>
        )}
      </div>
    </article>
  );
}
