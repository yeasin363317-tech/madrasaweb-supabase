import { useEffect, useRef, useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import type { Teacher } from '@/types';

interface TeacherSliderProps {
  teachers: Teacher[];
}

export default function TeacherSlider({ teachers }: TeacherSliderProps) {
  const { t } = useLanguage();
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [paused, setPaused] = useState(false);
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const touchStartX = useRef<number | null>(null);

  const count = teachers.length;

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
    autoPlayRef.current = setInterval(next, 3500);
    return () => { if (autoPlayRef.current) clearInterval(autoPlayRef.current); };
  }, [next, count, paused]);

  const resetAutoPlay = useCallback(() => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    if (count > 1 && !paused) autoPlayRef.current = setInterval(next, 3500);
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
          {teachers.map((teacher) => (
            <div key={teacher.id} className="min-w-full">
              <Link
                to={`/teachers/${teacher.id}`}
                className="block bg-white rounded-2xl border border-border shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200"
              >
                {/* Top accent strip */}
                <div className="h-1 bg-gradient-to-r from-primary via-green-400 to-primary/60" />

                <div className="p-5 md:p-6 flex flex-col sm:flex-row items-center sm:items-start gap-5">
                  {/* Photo */}
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden bg-accent ring-4 ring-primary/20 shrink-0">
                    {teacher.photo ? (
                      <img
                        src={teacher.photo}
                        alt={teacher.name_bn}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-secondary">
                        <User size={36} className="text-muted-foreground" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="text-base md:text-lg font-bold text-foreground leading-snug mb-1">
                      {t(teacher.name_bn, teacher.name_en)}
                    </h3>

                    {(teacher.designation_bn || teacher.designation_en) && (
                      <p className="text-sm font-semibold text-primary mb-1">
                        {t(teacher.designation_bn, teacher.designation_en)}
                      </p>
                    )}

                    {(teacher.qualification_bn || teacher.qualification_en) && (
                      <p className="text-sm text-muted-foreground mb-2 leading-relaxed">
                        {t(teacher.qualification_bn, teacher.qualification_en)}
                      </p>
                    )}

                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline transition-colors">
                      {t('বিস্তারিত দেখুন', 'View Profile')}
                      <ChevronRight size={13} />
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      {count > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-white hover:bg-secondary border border-border rounded-full flex items-center justify-center shadow-md transition-all hover:scale-105"
            aria-label="Previous teacher"
          >
            <ChevronLeft size={17} className="text-foreground" />
          </button>
          <button
            onClick={handleNext}
            className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-white hover:bg-secondary border border-border rounded-full flex items-center justify-center shadow-md transition-all hover:scale-105"
            aria-label="Next teacher"
          >
            <ChevronRight size={17} className="text-foreground" />
          </button>
        </>
      )}

      {/* Dots */}
      {count > 1 && (
        <div className="flex justify-center gap-1.5 mt-4">
          {teachers.map((_, i) => (
            <button
              key={i}
              onClick={() => { goTo(i); resetAutoPlay(); }}
              className={`rounded-full transition-all duration-300 ${
                i === current
                  ? 'bg-primary w-5 h-2'
                  : 'bg-border hover:bg-primary/40 w-2 h-2'
              }`}
              aria-label={`Go to teacher ${i + 1}`}
            />
          ))}
        </div>
      )}

      {/* Progress counter */}
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
