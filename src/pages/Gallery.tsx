import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useData } from '@/contexts/DataContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Image as ImageIcon, Video, X } from 'lucide-react';
import type { GalleryItem } from '@/types';

type Filter = 'all' | 'photo' | 'video';

function GalleryCard({ item, onClick }: { item: GalleryItem; onClick: () => void }) {
  const { t } = useLanguage();
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      className="rounded-xl overflow-hidden bg-secondary aspect-square group cursor-pointer relative select-none"
      style={{
        transition: 'transform 240ms ease, box-shadow 240ms ease',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px) scale(1.02)';
        (e.currentTarget as HTMLDivElement).style.boxShadow = '0 10px 30px rgba(0,0,0,0.14)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.transform = '';
        (e.currentTarget as HTMLDivElement).style.boxShadow = '';
      }}
      onClick={onClick}
    >
      {item.type === 'photo' ? (
        <>
          <img
            src={item.thumbnail || item.url}
            alt={t(item.title_bn, item.title_en)}
            onLoad={() => setLoaded(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400"
            style={{ opacity: loaded ? 1 : 0, transition: 'opacity 320ms ease, transform 400ms ease' }}
          />
          {/* skeleton while loading */}
          {!loaded && (
            <div className="absolute inset-0 bg-secondary animate-pulse" />
          )}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-end">
            <p className="p-3 text-xs font-medium text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 w-full bg-gradient-to-t from-black/60 to-transparent">
              {t(item.title_bn, item.title_en)}
            </p>
          </div>
        </>
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-primary/10 relative overflow-hidden">
          {item.thumbnail ? (
            <img
              src={item.thumbnail}
              alt={t(item.title_bn, item.title_en)}
              onLoad={() => setLoaded(true)}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400"
              style={{ opacity: loaded ? 1 : 0, transition: 'opacity 320ms ease, transform 400ms ease' }}
            />
          ) : (
            <div className="w-full h-full bg-primary/10" />
          )}
          {/* Play overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-black/50 group-hover:bg-black/70 flex items-center justify-center transition-all duration-200 group-hover:scale-110">
              <span className="text-white text-xl ml-1">▶</span>
            </div>
          </div>
          {/* Title always visible at bottom */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
            <p className="text-xs font-medium text-white truncate">
              {t(item.title_bn, item.title_en)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Gallery() {
  const { t } = useLanguage();
  const { data } = useData();
  const [filter, setFilter] = useState<Filter>('all');
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null);

  const filtered = data.gallery.filter(item =>
    filter === 'all' ? true : item.type === filter
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="bg-primary pattern-bg py-14 px-4 text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-2">
          {t('গ্যালারি', 'Gallery')}
        </h1>
        <p className="text-white/75 text-sm">
          {t('ছবি ও ভিডিও সংগ্রহ', 'Photo and video collection')}
        </p>
      </div>

      <div className="section-padding">
        <div className="container-max">
          {/* Filter Tabs */}
          <div className="flex items-center gap-2 mb-8 flex-wrap">
            {(['all', 'photo', 'video'] as Filter[]).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                  filter === f
                    ? 'bg-primary text-primary-foreground shadow-sm scale-105'
                    : 'bg-secondary text-foreground hover:bg-accent hover:-translate-y-0.5'
                }`}
              >
                {f === 'photo' && <ImageIcon size={15} />}
                {f === 'video' && <Video size={15} />}
                {f === 'all' && t('সব', 'All')}
                {f === 'photo' && t('ছবি', 'Photos')}
                {f === 'video' && t('ভিডিও', 'Videos')}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-16 bg-secondary rounded-2xl">
              <ImageIcon size={48} className="text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-semibold text-foreground">
                {t('কোনো গ্যালারি আইটেম নেই', 'No gallery items')}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtered.map((item, idx) => (
                <div
                  key={item.id}
                  style={{
                    opacity: 0,
                    animation: `page-fade-in 350ms ease ${idx * 60}ms both`,
                  }}
                >
                  <GalleryCard item={item} onClick={() => setLightbox(item)} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Lightbox — rendered via portal so position:fixed always works */}
      {lightbox && createPortal(
        <div
          className="fixed inset-0 bg-black/90 z-[9999] flex items-center justify-center p-4"
          style={{ animation: 'page-fade-in 200ms ease both' }}
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-all duration-200 hover:scale-110"
            onClick={e => { e.stopPropagation(); setLightbox(null); }}
          >
            <X size={20} />
          </button>
          <div
            onClick={e => e.stopPropagation()}
            className="max-w-4xl w-full flex flex-col items-center"
            style={{ maxHeight: '90dvh', maxWidth: 'min(56rem, 95vw)' }}
          >
            {lightbox.type === 'photo' ? (
              <img
                src={lightbox.url}
                alt={t(lightbox.title_bn, lightbox.title_en)}
                className="w-full rounded-xl object-contain"
                style={{ maxHeight: '80dvh', animation: 'page-fade-in 300ms ease 50ms both' }}
              />
            ) : (
              <div className="w-full rounded-xl overflow-hidden bg-black" style={{ aspectRatio: '16/9' }}>
                {/* Video only loads when lightbox opens */}
                <video
                  src={lightbox.url}
                  className="w-full h-full"
                  controls
                  autoPlay
                  preload="metadata"
                  playsInline
                />
              </div>
            )}
            <p
              className="text-white text-center mt-4 font-medium text-sm md:text-base"
              style={{ animation: 'page-fade-in 300ms ease 100ms both' }}
            >
              {t(lightbox.title_bn, lightbox.title_en)}
            </p>
          </div>
        </div>,
        document.body
      )}

      <Footer />
    </div>
  );
}
