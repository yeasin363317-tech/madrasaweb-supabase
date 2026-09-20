import { Link } from 'react-router-dom';
import { useMemo } from 'react';
import { ArrowRight, Phone, Mail, MapPin, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useData } from '@/contexts/DataContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import NoticeSlider from '@/components/features/NoticeSlider';
import GallerySlider from '@/components/features/GallerySlider';
import TeacherSlider from '@/components/features/TeacherSlider';
import AnimatedSection from '@/components/features/AnimatedSection';

/** Build optimised srcset for Supabase Storage images.
 *  For the static /hero-banner.jpg we skip transformation.
 */
function buildHeroSrcSet(url: string): { src: string; srcSet: string; sizes: string } {
  const isSupabase = url.includes('/storage/v1/object/public/');
  if (!isSupabase) {
    return { src: url, srcSet: '', sizes: '' };
  }
  // Supabase image transform params
  const sizes = [480, 768, 1200, 1920];
  const srcSet = sizes
    .map(w => `${url}?width=${w}&format=webp&quality=82 ${w}w`)
    .join(', ');
  return {
    src: `${url}?width=1200&format=webp&quality=82`,
    srcSet,
    sizes: '(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 100vw',
  };
}

export default function Index() {
  const { t, isBn } = useLanguage();
  const { data } = useData();
  const { madrasaInfo, websiteSettings, teachers, notices, gallery } = data;

  const publishedNotices = notices.filter(n => n.published);
  const photoGallery = gallery.filter(i => i.type === 'photo');

  const heroBannerUrl = websiteSettings.heroBanner || '/hero-banner.jpg';
  const heroImg = useMemo(() => buildHeroSrcSet(heroBannerUrl), [heroBannerUrl]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden min-h-[58vh] flex items-center">
        {/* Hero image — eager, high priority, no lazy-load */}
        <img
          src={heroImg.src}
          srcSet={heroImg.srcSet || undefined}
          sizes={heroImg.sizes || undefined}
          alt="Hero Banner"
          // @ts-expect-error fetchpriority is valid HTML but not yet in TS types
          fetchpriority="high"
          loading="eager"
          decoding="sync"
          className="absolute inset-0 w-full h-full object-cover object-center"
          style={{ zIndex: 0 }}
        />
        <div className="absolute inset-0 bg-primary/75" />
        <div className="absolute inset-0 pattern-bg" />
        <div className="relative z-10 w-full px-4 py-14 md:py-20">
          <div className="container-max text-center text-primary-foreground">
            <div
              className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-5"
              style={{ animation: 'page-fade-in 500ms ease 100ms both' }}
            >
              <span className="w-2 h-2 rounded-full bg-green-300 animate-pulse" />
              {t('বিসমিল্লাহির রাহমানির রাহিম', 'Bismillahir Rahmanir Rahim')}
            </div>
            <h1
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 leading-tight"
              style={{ animation: 'page-fade-in 500ms ease 200ms both' }}
            >
              {isBn ? websiteSettings.heroTitle_bn : websiteSettings.heroTitle_en}
            </h1>
            <p
              className="text-base md:text-lg text-white/85 max-w-2xl mx-auto mb-7 leading-relaxed"
              style={{ animation: 'page-fade-in 500ms ease 300ms both' }}
            >
              {isBn ? websiteSettings.heroSubtitle_bn : websiteSettings.heroSubtitle_en}
            </p>
            <div
              className="flex flex-wrap items-center justify-center gap-3"
              style={{ animation: 'page-fade-in 500ms ease 400ms both' }}
            >
              <Link to="/about" className="btn-primary bg-white text-primary hover:bg-white/90">
                {t('মাদ্রাসা সম্পর্কে জানুন', 'About Madrasa')}
                <ArrowRight size={16} />
              </Link>
              <Link to="/contact" className="btn-outline border-white text-white hover:bg-white hover:text-primary">
                {t('যোগাযোগ করুন', 'Contact Us')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Banner */}
      <section className="bg-white border-b border-border shadow-sm">
        <div className="container-max px-4 py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-center divide-x divide-border">
            {[
              { value: madrasaInfo.totalStudents || '—', label: t('মোট শিক্ষার্থী', 'Total Students') },
              { value: teachers.length, label: t('শিক্ষকমণ্ডলী', 'Teachers') },
              { value: notices.filter(n => n.published).length, label: t('নোটিশ', 'Notices') },
              { value: gallery.length, label: t('গ্যালারি', 'Gallery Items') },
            ].map((stat, i) => (
              <div key={i} className="py-3">
                <p className="text-2xl font-bold text-primary">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Gallery Slider */}
      {photoGallery.length > 0 && (
        <section className="bg-gray-900">
          <GallerySlider items={photoGallery} />
        </section>
      )}

      {/* Introduction */}
      <AnimatedSection as="section" className="py-12 px-4">
        <div className="container-max">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <span className="text-xs font-semibold text-primary uppercase tracking-widest bg-secondary px-3 py-1 rounded-full">
                {t('পরিচিতি', 'Introduction')}
              </span>
              <h2 className="section-title mt-3 mb-3">
                {t('মাদ্রাসা সম্পর্কে', 'About The Madrasa')}
              </h2>
              <p className="text-base text-foreground/80 leading-relaxed mb-4">
                {t(madrasaInfo.about_bn, madrasaInfo.about_en)}
              </p>
              <Link to="/about" className="btn-outline">
                {t('আরও জানুন', 'Learn More')}
                <ChevronRight size={16} />
              </Link>
            </div>
            <div className="bg-secondary rounded-2xl p-6 pattern-bg">
              <div className="space-y-3">
                {[
                  { label: t('মিশন', 'Mission'), text: t(madrasaInfo.mission_bn, madrasaInfo.mission_en) },
                  { label: t('ভিশন', 'Vision'), text: t(madrasaInfo.vision_bn, madrasaInfo.vision_en) },
                ].map((item, i) => (
                  <div key={i} className="bg-white rounded-xl p-4 shadow-sm">
                    <h4 className="text-sm font-bold text-primary mb-1">{item.label}</h4>
                    <p className="text-sm text-foreground/75 leading-relaxed">{item.text || '—'}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Latest Notices */}
      <AnimatedSection as="section" className="py-10 px-4 bg-secondary">
        <div className="container-max">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-xs font-semibold text-primary uppercase tracking-widest bg-white px-3 py-1 rounded-full">
                {t('সর্বশেষ', 'Latest')}
              </span>
              <h2 className="section-title mt-2">{t('নোটিশ বোর্ড', 'Notice Board')}</h2>
            </div>
            <Link to="/notices" className="text-sm font-semibold text-primary hover:underline flex items-center gap-1">
              {t('সব দেখুন', 'View All')} <ArrowRight size={14} />
            </Link>
          </div>
          {publishedNotices.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-2xl">
              <p className="text-muted-foreground">{t('কোনো নোটিশ নেই', 'No notices yet')}</p>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto px-6">
              <NoticeSlider notices={publishedNotices} />
            </div>
          )}
        </div>
      </AnimatedSection>

      {/* Teacher Showcase Slider */}
      {teachers.length > 0 && (
        <AnimatedSection as="section" className="py-10 px-4">
          <div className="container-max">
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-xs font-semibold text-primary uppercase tracking-widest bg-secondary px-3 py-1 rounded-full">
                  {t('আমাদের', 'Our')}
                </span>
                <h2 className="section-title mt-2">{t('শিক্ষকমণ্ডলী', 'Teaching Staff')}</h2>
              </div>
              <Link to="/teachers" className="text-sm font-semibold text-primary hover:underline flex items-center gap-1">
                {t('সব দেখুন', 'View All')} <ArrowRight size={14} />
              </Link>
            </div>
            <div className="px-5">
              <TeacherSlider teachers={teachers} />
            </div>
          </div>
        </AnimatedSection>
      )}

      {/* Principal Message */}
      {madrasaInfo.principalMessage_bn && (
        <AnimatedSection as="section" className="bg-secondary py-12 px-4">
          <div className="container-max">
            <div className="max-w-3xl mx-auto text-center">
              <span className="text-xs font-semibold text-primary uppercase tracking-widest bg-white px-3 py-1 rounded-full">
                {t('অধ্যক্ষের বাণী', "Principal's Message")}
              </span>
              <div className="mt-6 flex flex-col items-center">
                {madrasaInfo.principalPhoto ? (
                  <img src={madrasaInfo.principalPhoto} alt="principal"
                    className="w-20 h-20 rounded-full object-cover ring-4 ring-primary mb-4" />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-primary/10 ring-4 ring-primary mb-4 flex items-center justify-center">
                    <span className="text-3xl">👨‍🏫</span>
                  </div>
                )}
                <blockquote className="text-base text-foreground/80 leading-relaxed italic mb-4">
                  "{t(madrasaInfo.principalMessage_bn, madrasaInfo.principalMessage_en)}"
                </blockquote>
                <p className="font-bold text-foreground">
                  — {t(madrasaInfo.principalName_bn, madrasaInfo.principalName_en)}
                </p>
                <p className="text-sm text-muted-foreground">{t('অধ্যক্ষ', 'Principal')}</p>
              </div>
            </div>
          </div>
        </AnimatedSection>
      )}

      {/* Contact Section */}
      <AnimatedSection as="section" className="py-10 px-4 bg-white">
        <div className="container-max">
          <div className="text-center mb-6">
            <span className="text-xs font-semibold text-primary uppercase tracking-widest bg-secondary px-3 py-1 rounded-full">
              {t('যোগাযোগ', 'Contact')}
            </span>
            <h2 className="section-title mt-2">{t('আমাদের সাথে যোগাযোগ করুন', 'Get In Touch')}</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {[
              { icon: MapPin, label: t('ঠিকানা', 'Address'), value: t(madrasaInfo.address_bn, madrasaInfo.address_en) },
              { icon: Phone, label: t('ফোন', 'Phone'), value: madrasaInfo.phone1 },
              { icon: Mail, label: t('ইমেইল', 'Email'), value: madrasaInfo.email },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="card-base p-5 text-center">
                  <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3 transition-transform duration-200 group-hover:scale-110">
                    <Icon size={18} className="text-primary" />
                  </div>
                  <p className="text-xs font-semibold text-muted-foreground mb-1">{item.label}</p>
                  <p className="text-sm font-medium text-foreground">{item.value}</p>
                </div>
              );
            })}
          </div>
          <div className="text-center mt-5">
            <Link to="/contact" className="btn-primary">
              {t('বিস্তারিত যোগাযোগ তথ্য', 'Full Contact Info')}
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </AnimatedSection>

      <Footer />
    </div>
  );
}
