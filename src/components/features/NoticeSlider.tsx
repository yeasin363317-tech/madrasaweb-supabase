import { useEffect, useRef, useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Calendar, ArrowRight, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import type { Notice } from '@/types';

interface NoticeSliderProps {
  notices: Notice[];
}

export default function NoticeSlider({ notices }: NoticeSliderProps) {
  const { t } = useLanguage();
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [paused, setPaused] = useState(false);
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const touchStartX = useRef<number | null>(null);

  const count = notices.length;

  const goTo = useCallback((index: number) => {
    if (isTransitioning || count === 0) return;
    setIsTransitioning(true);
    setCurrent((index + count) % count);
    setTimeout(() => setIsTransitioning(false), 400);
  }, [isTransitioning, count]);

  const next = useCallback(() => goTo(current + 1), [goTo, current]);
  const prev = useCallback(() => goTo(current - 1), [goTo, current]);

  // Auto-play — pauses on hover
  useEffect(() => {
    if (count <= 1 || paused) return;
    autoPlayRef.current = setInterval(next, 4500);
    return () => { if (autoPlayRef.current) clearInterval(autoPlayRef.current); };
  }, [next, count, paused]);

  const resetAutoPlay = useCallback(() => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    if (count > 1 && !paused) autoPlayRef.current = setInterval(next, 4500);
  }, [next, count, paused]);

  const handlePrev = () => { prev(); resetAutoPlay(); };
  const handleNext = () => { next(); resetAutoPlay(); };

  const onTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) { diff > 0 ? handleNext() : handlePrev(); }
    touchStartX.current = null;
  };

  if (count === 0) return null;

  const notice = notices[current];

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('bn-BD', {
        year: 'numeric', month: 'long', day: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => { setPaused(false); resetAutoPlay(); }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Slide Container */}
      <div className="overflow-hidden rounded-2xl">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {notices.map((n) => (
            <div
              key={n.id}
              className="min-w-full"
            >
              <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
                {/* Top accent strip */}
                <div className="h-1 bg-gradient-to-r from-primary via-green-400 to-primary/60" />

                <div className="p-5 md:p-6">
                  {/* Icon + date row */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <Bell size={15} className="text-primary" />
                      </div>
                      <span className="text-xs font-semibold text-primary uppercase tracking-wide">
                        {t('নোটিশ', 'Notice')}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Calendar size={12} />
                      <span>{formatDate(n.date)}</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-base md:text-lg font-bold text-foreground mb-2 leading-snug line-clamp-2">
                    {t(n.title_bn, n.title_en)}
                  </h3>

                  {/* Description preview */}
                  {(n.description_bn || n.description_en) && (
                    <p className="text-sm text-foreground/70 leading-relaxed line-clamp-3 mb-4">
                      {t(n.description_bn, n.description_en)}
                    </p>
                  )}

                  {/* Read More */}
                  <Link
                    to="/notices"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline transition-colors"
                  >
                    {t('বিস্তারিত পড়ুন', 'Read More')}
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation controls */}
      {count > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-white hover:bg-secondary border border-border rounded-full flex items-center justify-center shadow-md transition-all hover:scale-105"
            aria-label="Previous notice"
          >
            <ChevronLeft size={17} className="text-foreground" />
          </button>
          <button
            onClick={handleNext}
            className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-white hover:bg-secondary border border-border rounded-full flex items-center justify-center shadow-md transition-all hover:scale-105"
            aria-label="Next notice"
          >
            <ChevronRight size={17} className="text-foreground" />
          </button>
        </>
      )}

      {/* Dots */}
      {count > 1 && (
        <div className="flex justify-center gap-1.5 mt-4">
          {notices.map((_, i) => (
            <button
              key={i}
              onClick={() => { goTo(i); resetAutoPlay(); }}
              className={`rounded-full transition-all duration-300 ${
                i === current
                  ? 'bg-primary w-5 h-2'
                  : 'bg-border hover:bg-primary/40 w-2 h-2'
              }`}
              aria-label={`Go to notice ${i + 1}`}
            />
          ))}
        </div>
      )}

      {/* Progress indicator */}
      {count > 1 && (
        <div className="absolute top-3 right-3 text-xs text-muted-foreground font-medium bg-white/80 px-2 py-0.5 rounded-full border border-border">
          {current + 1} / {count}
        </div>
      )}

      {/* Pause indicator */}
      {paused && count > 1 && (
        <div className="absolute top-3 left-3 text-xs text-muted-foreground font-medium bg-white/80 px-2 py-0.5 rounded-full border border-border flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
          {t('বিরতি', 'Paused')}
        </div>
      )}
    </div>
  );
}
