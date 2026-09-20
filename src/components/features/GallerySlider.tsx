import { useEffect, useRef, useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import type { GalleryItem } from '@/types';

interface GallerySliderProps {
  items: GalleryItem[];
}

export default function GallerySlider({ items }: GallerySliderProps) {
  const { t } = useLanguage();
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const touchStartX = useRef<number | null>(null);

  const photoItems = items.filter(i => i.type === 'photo');
  const count = photoItems.length;

  const goTo = useCallback((index: number) => {
    if (isTransitioning || count === 0) return;
    setIsTransitioning(true);
    setCurrent((index + count) % count);
    setTimeout(() => setIsTransitioning(false), 400);
  }, [isTransitioning, count]);

  const next = useCallback(() => goTo(current + 1), [goTo, current]);
  const prev = useCallback(() => goTo(current - 1), [goTo, current]);

  // Auto-play
  useEffect(() => {
    if (count <= 1) return;
    autoPlayRef.current = setInterval(next, 4000);
    return () => { if (autoPlayRef.current) clearInterval(autoPlayRef.current); };
  }, [next, count]);

  const resetAutoPlay = useCallback(() => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    if (count > 1) autoPlayRef.current = setInterval(next, 4000);
  }, [next, count]);

  const handlePrev = () => { prev(); resetAutoPlay(); };
  const handleNext = () => { next(); resetAutoPlay(); };
  const handleDot = (i: number) => { goTo(i); resetAutoPlay(); };

  // Touch / swipe
  const onTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) { diff > 0 ? handleNext() : handlePrev(); }
    touchStartX.current = null;
  };

  if (count === 0) return null;

  return (
    /* Premium border wrapper */
    <div className="px-4 py-5 bg-gray-900">
      <div
        className="relative overflow-hidden mx-auto max-w-5xl"
        style={{
          borderRadius: '1rem',
          border: '2px solid rgba(255,255,255,0.10)',
          boxShadow: '0 8px 40px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.04) inset',
        }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* Slides */}
        <div className="relative w-full" style={{ paddingBottom: '48%' }}>
          {photoItems.map((item, i) => (
            <div
              key={item.id}
              className={`absolute inset-0 transition-opacity duration-500 ${
                i === current ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              <img
                src={item.thumbnail || item.url}
                alt={t(item.title_bn, item.title_en)}
                className="w-full h-full object-cover"
                loading={i === 0 ? 'eager' : 'lazy'}
              />
              {/* Caption */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/65 to-transparent px-6 py-4">
                <p className="text-white font-semibold text-sm md:text-base drop-shadow">
                  {t(item.title_bn, item.title_en)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation arrows */}
        {count > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 md:w-11 md:h-11 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all duration-150 hover:scale-105"
              aria-label="Previous"
            >
              <ChevronLeft size={20} className="text-foreground" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 md:w-11 md:h-11 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all duration-150 hover:scale-105"
              aria-label="Next"
            >
              <ChevronRight size={20} className="text-foreground" />
            </button>
          </>
        )}

        {/* Dots */}
        {count > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5">
            {photoItems.map((_, i) => (
              <button
                key={i}
                onClick={() => handleDot(i)}
                className={`rounded-full transition-all duration-300 ${
                  i === current
                    ? 'bg-white w-5 h-2'
                    : 'bg-white/50 hover:bg-white/75 w-2 h-2'
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
