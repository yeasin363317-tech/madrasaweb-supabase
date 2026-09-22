import { Link } from 'react-router-dom';
import { useMemo } from 'react';
import type { CSSProperties } from 'react';
import {
  ArrowRight, Phone, Mail, MapPin, Calendar, Bell, GraduationCap, Users,
  Image as ImageIcon, MessageSquare, Target, Eye, Paperclip, Clock, Quote, Search,
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useData } from '@/contexts/DataContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import TeacherCard from '@/components/features/TeacherCard';
import Reveal from '@/components/features/Reveal';
import CountUp from '@/components/features/CountUp';
import SectionHeading from '@/components/features/SectionHeading';
import NoticeTicker from '@/components/features/NoticeTicker';

/** Build optimised srcset for Supabase Storage images.
 *  For the static /hero-banner.jpg we skip transformation.
 */
function buildHeroSrcSet(url: string): { src: string; srcSet: string; sizes: string } {
  const isSupabase = url.includes('/storage/v1/object/public/');
  if (!isSupabase) {
    return { src: url, srcSet: '', sizes: '' };
  }
  const sizes = [480, 768, 1200, 1920];
  const srcSet = sizes
    .map(w => `${url}?width=${w}&format=webp&quality=82 ${w}w`)
    .join(', ');
  return {
    src: `${url}?width=1200&format=webp&quality=82`,
    srcSet,
    sizes: '(max-width: 1024px) 100vw, 50vw',
  };
}

function formatDate(dateStr: string, bn: boolean) {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString(bn ? 'bn-BD' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  } catch {
    return dateStr;
  }
}

const delay = (ms: number) => ({ '--d': `${ms}ms` } as CSSProperties);

export default function Index() {
  const { t, isBn } = useLanguage();
  const { data, loading } = useData();
  const { madrasaInfo, websiteSettings, teachers, notices, gallery } = data;

  const publishedNotices = notices.filter(n => n.published);
  const photoGallery = gallery.filter(i => i.type === 'photo');

  const heroBannerUrl = websiteSettings.heroBanner || '/hero-banner.jpg';
  const heroImg = useMemo(() => buildHeroSrcSet(heroBannerUrl), [heroBannerUrl]);

  // Two-tone hero title: first word animated green, rest dark
  const heroTitle = ((isBn ? websiteSettings.heroTitle_bn : websiteSettings.heroTitle_en) || '').trim();
  const titleWords = heroTitle.split(/\s+/).filter(Boolean);
  const titleFirst = titleWords[0] || '';
  const titleRest = titleWords.slice(1).join(' ');
  const heroSubtitle = isBn ? websiteSettings.heroSubtitle_bn : websiteSettings.heroSubtitle_en;

  const stats: { value: number | null; label: string; suffix?: string }[] = [
    { value: madrasaInfo.totalStudents || null, label: t('শিক্ষার্থী', 'Students'), suffix: '+' },
    { value: teachers.length, label: t('শিক্ষক', 'Teachers') },
    { value: publishedNotices.length, label: t('নোটিশ', 'Notices') },
    { value: gallery.length, label: t('গ্যালারি', 'Gallery') },
  ];

  const quickLinks = [
    { to: '/notices', label: t('নোটিশ বোর্ড', 'Notice Board'), sub: t('সর্বশেষ বিজ্ঞপ্তি', 'Latest updates'), icon: Bell, tint: 'tint-orange' },
    { to: '/results', label: t('ফলাফল', 'Results'), sub: t('রোল দিয়ে খুঁজুন', 'Search by roll'), icon: GraduationCap, tint: 'tint-blue' },
    { to: '/teachers', label: t('শিক্ষকমণ্ডলী', 'Teachers'), sub: t('আমাদের শিক্ষক', 'Our staff'), icon: Users, tint: 'tint-purple' },
    { to: '/gallery', label: t('গ্যালারি', 'Gallery'), sub: t('ছবি ও ভিডিও', 'Photos & videos'), icon: ImageIcon, tint: 'tint-pink' },
    { to: '/complaint', label: t('অভিযোগ', 'Complaint'), sub: t('অভিযোগ জমা দিন', 'Submit & track'), icon: MessageSquare, tint: 'tint-teal' },
  ];

  const noticeTints = ['tint-orange', 'tint-blue', 'tint-purple'];
  const bento = photoGallery.length >= 5;
  const aboutPhotos = photoGallery.slice(0, 2);

  const contactItems = [
    { icon: MapPin, label: t('ঠিকানা', 'Address'), value: t(madrasaInfo.address_bn, madrasaInfo.address_en), tint: 'tint-green', href: undefined as string | undefined },
    { icon: Phone, label: t('ফোন', 'Phone'), value: [madrasaInfo.phone1, madrasaInfo.phone2].filter(Boolean).join('  •  '), tint: 'tint-blue', href: `tel:${madrasaInfo.phone1}` },
    { icon: Mail, label: t('ইমেইল', 'Email'), value: madrasaInfo.email, tint: 'tint-purple', href: `mailto:${madrasaInfo.email}` },
    { icon: Clock, label: t('অফিস সময়', 'Office Hours'), value: t(madrasaInfo.officeHours_bn, madrasaInfo.officeHours_en), tint: 'tint-orange', href: undefined as string | undefined },
  ].filter(i => i.value);

  return (
    <div className="min-h-screen bg-background overflow-x-clip">
      <Navbar />
      <NoticeTicker notices={publishedNotices} />

      {/* ───────── Hero ───────── */}
      <section
        className="relative overflow-hidden"
        style={{ background: 'linear-gradient(180deg, hsl(var(--green-50)) 0%, hsl(0 0% 100%) 100%)' }}
      >
        <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-primary/10 blur-3xl blob-float" aria-hidden="true" />
        <div className="absolute top-1/3 -right-24 w-96 h-96 rounded-full bg-emerald-300/20 blur-3xl blob-float-slow" aria-hidden="true" />

        <div className="relative max-w-7xl mx-auto px-4 md:px-8 py-10 md:py-16 lg:py-24 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Text */}
          <div className="text-center lg:text-left">
            <span className="eyebrow bg-white anim-rise" style={delay(0)}>
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              {t('বিসমিল্লাহির রাহমানির রাহিম', 'Bismillahir Rahmanir Rahim')}
            </span>

            {loading && !heroTitle ? (
              <div className="mt-5 space-y-3 max-w-xl mx-auto lg:mx-0">
                <div className="skeleton h-10 w-11/12" />
                <div className="skeleton h-10 w-2/3" />
              </div>
            ) : (
              <h1
                className="anim-rise mt-5 text-3xl sm:text-4xl lg:text-5xl xl:text-[3.5rem] font-bold leading-[1.25] text-foreground"
                style={delay(120)}
              >
                <span className="text-gradient">{titleFirst}</span>
                {titleRest ? ' ' : ''}
                {titleRest}
              </h1>
            )}

            {heroSubtitle && (
              <p
                className="anim-rise mt-5 text-base md:text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed"
                style={delay(240)}
              >
                {heroSubtitle}
              </p>
            )}

            <div
              className="anim-rise mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-3"
              style={delay(360)}
            >
              <Link to="/about" className="btn-primary btn-shine">
                {t('মাদ্রাসা সম্পর্কে জানুন', 'About Madrasa')}
                <ArrowRight size={16} />
              </Link>
              <Link to="/results" className="btn-outline">
                <Search size={16} />
                {t('ফলাফল দেখুন', 'Check Results')}
              </Link>
            </div>

            <div
              className="anim-rise mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl mx-auto lg:mx-0"
              style={delay(480)}
            >
              {stats.map((s, i) => (
                <div key={i} className="bg-white/90 backdrop-blur border border-border rounded-2xl px-3 py-3 text-center shadow-sm">
                  <p className="text-xl md:text-2xl font-bold text-primary">
                    {s.value === null ? '—' : <CountUp value={s.value} bn={isBn} suffix={s.suffix} />}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Image */}
          <div className="anim-rise relative max-w-xl w-full mx-auto lg:max-w-none" style={delay(200)}>
            <div className="absolute -inset-3 md:-inset-4 rounded-[2rem] bg-accent rotate-2" aria-hidden="true" />
            <div className="hero-float relative rounded-3xl overflow-hidden border-4 border-white shadow-2xl aspect-[4/3] bg-secondary">
              <img
                src={heroImg.src}
                srcSet={heroImg.srcSet || undefined}
                sizes={heroImg.sizes || undefined}
                alt={t(madrasaInfo.name_bn, madrasaInfo.name_en)}
                // @ts-expect-error fetchpriority is valid HTML but not yet in TS types
                fetchpriority="high"
                loading="eager"
                decoding="sync"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
            </div>

            {madrasaInfo.totalStudents > 0 && (
              <div className="hero-float-slow absolute -left-2 md:-left-8 bottom-8 bg-white rounded-2xl shadow-xl border border-border px-4 py-3 flex items-center gap-3">
                <span className="icon-chip tint tint-green"><GraduationCap size={20} /></span>
                <div>
                  <p className="text-lg font-bold text-foreground leading-none">
                    {madrasaInfo.totalStudents.toLocaleString(isBn ? 'bn-BD' : 'en-US')}+
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">{t('শিক্ষার্থী', 'Students')}</p>
                </div>
              </div>
            )}
            {teachers.length > 0 && (
              <div className="hero-float absolute -right-2 md:-right-6 top-6 bg-white rounded-2xl shadow-xl border border-border px-4 py-3 flex items-center gap-3">
                <span className="icon-chip tint tint-purple"><Users size={20} /></span>
                <div>
                  <p className="text-lg font-bold text-foreground leading-none">
                    {teachers.length.toLocaleString(isBn ? 'bn-BD' : 'en-US')}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">{t('শিক্ষক', 'Teachers')}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ───────── Quick links ───────── */}
      <section className="px-4 md:px-8 py-10">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
          {quickLinks.map((item, i) => {
            const Icon = item.icon;
            return (
              <Reveal key={item.to} delay={i * 70} className={i === 4 ? 'col-span-2 md:col-span-1' : ''}>
                <Link to={item.to} className={`group tint ${item.tint} rounded-2xl p-4 md:p-5 flex items-center gap-3 h-full`}>
                  <span className="icon-chip transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6">
                    <Icon size={20} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-bold text-sm md:text-base leading-tight">{item.label}</span>
                    <span className="block text-xs opacity-70 mt-0.5 truncate">{item.sub}</span>
                  </span>
                  <ArrowRight size={16} className="opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 hidden sm:block" />
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ───────── About ───────── */}
      <section className="py-14 md:py-20 px-4 md:px-8">
        <div className={`max-w-7xl mx-auto grid gap-10 lg:gap-16 items-center ${aboutPhotos.length > 0 ? 'lg:grid-cols-2' : 'max-w-3xl'}`}>
          {aboutPhotos.length > 0 && (
            <Reveal variant="left" className="relative pb-10 pr-6 md:pr-10">
              <div className="rounded-3xl overflow-hidden aspect-[4/3] shadow-xl border-4 border-white bg-secondary">
                <img src={aboutPhotos[0].thumbnail || aboutPhotos[0].url} alt={t(aboutPhotos[0].title_bn, aboutPhotos[0].title_en)} loading="lazy" className="w-full h-full object-cover" />
              </div>
              {aboutPhotos[1] && (
                <div className="absolute right-0 bottom-0 w-1/2 rounded-2xl overflow-hidden aspect-[4/3] shadow-2xl border-4 border-white bg-secondary hero-float-slow">
                  <img src={aboutPhotos[1].thumbnail || aboutPhotos[1].url} alt={t(aboutPhotos[1].title_bn, aboutPhotos[1].title_en)} loading="lazy" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="absolute -z-10 -left-4 top-6 w-full h-full rounded-3xl bg-accent -rotate-2" aria-hidden="true" />
            </Reveal>
          )}

          <Reveal variant="right">
            <span className="eyebrow">{t('পরিচিতি', 'Introduction')}</span>
            <h2 className="section-title mt-3">{t('মাদ্রাসা সম্পর্কে', 'About The Madrasa')}</h2>
            <span className="block w-12 h-1 rounded-full bg-primary mt-3 mb-5" />
            <p className="text-base text-foreground/80 leading-relaxed mb-6 line-clamp-6 whitespace-pre-line">
              {t(madrasaInfo.about_bn, madrasaInfo.about_en)}
            </p>

            <div className="grid sm:grid-cols-2 gap-4 mb-7">
              {[
                { label: t('মিশন', 'Mission'), text: t(madrasaInfo.mission_bn, madrasaInfo.mission_en), icon: Target, tint: 'tint-green' },
                { label: t('ভিশন', 'Vision'), text: t(madrasaInfo.vision_bn, madrasaInfo.vision_en), icon: Eye, tint: 'tint-blue' },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className={`tint ${item.tint} rounded-2xl p-5`}>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="icon-chip !w-9 !h-9"><Icon size={17} /></span>
                      <h3 className="font-bold">{item.label}</h3>
                    </div>
                    <p className="text-sm leading-relaxed text-foreground/75 line-clamp-4">{item.text || '—'}</p>
                  </div>
                );
              })}
            </div>

            <Link to="/about" className="btn-primary">
              {t('আরও জানুন', 'Learn More')}
              <ArrowRight size={16} />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ───────── Results CTA band ───────── */}
      <section className="px-4 md:px-8">
        <Reveal variant="zoom" className="max-w-7xl mx-auto">
          <div
            className="relative overflow-hidden rounded-3xl px-6 py-10 md:px-14 md:py-12 flex flex-col md:flex-row items-center justify-between gap-6 text-white"
            style={{ background: 'linear-gradient(120deg, hsl(var(--green-700)) 0%, hsl(var(--green-600)) 50%, hsl(var(--green-500)) 100%)' }}
          >
            <div className="absolute -top-16 -right-10 w-56 h-56 rounded-full bg-white/10 blur-2xl blob-float" aria-hidden="true" />
            <div className="absolute -bottom-20 left-1/3 w-64 h-64 rounded-full bg-white/10 blur-2xl blob-float-slow" aria-hidden="true" />
            <div className="relative text-center md:text-left">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">{t('পরীক্ষার ফলাফল দেখুন', 'Check Exam Results')}</h2>
              <p className="text-white/85 text-sm md:text-base max-w-xl">
                {t('ক্লাস ও রোল নম্বর দিয়ে খুব সহজেই ফলাফল অনুসন্ধান করুন', 'Search results easily using class and roll number')}
              </p>
            </div>
            <Link
              to="/results"
              className="relative shrink-0 inline-flex items-center gap-2 bg-white text-primary font-bold px-7 py-3.5 rounded-xl shadow-lg hover:-translate-y-0.5 hover:shadow-xl transition-all duration-200"
            >
              <GraduationCap size={18} />
              {t('ফলাফল দেখুন', 'View Results')}
              <ArrowRight size={16} />
            </Link>
          </div>
        </Reveal>
      </section>

      {/* ───────── Latest notices ───────── */}
      <section className="py-14 md:py-20 px-4 md:px-8 mt-14 md:mt-20 bg-secondary/60">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <SectionHeading
              eyebrow={t('সর্বশেষ', 'Latest')}
              title={t('নোটিশ বোর্ড', 'Notice Board')}
              subtitle={t('মাদ্রাসার সকল গুরুত্বপূর্ণ বিজ্ঞপ্তি', 'All important announcements')}
              href="/notices"
              linkLabel={t('সব দেখুন', 'View All')}
              onTint
            />
          </Reveal>

          {publishedNotices.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-2xl border border-border">
              <p className="text-muted-foreground">{t('কোনো নোটিশ নেই', 'No notices yet')}</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {publishedNotices.slice(0, 3).map((notice, i) => (
                <Reveal key={notice.id} delay={i * 100} className="h-full">
                  <Link to="/notices" className="card-base p-5 md:p-6 flex flex-col group h-full">
                    <div className="flex items-center gap-3 mb-4">
                      <span className={`tint ${noticeTints[i % noticeTints.length]} w-10 h-10 rounded-xl flex items-center justify-center shrink-0`}>
                        <Bell size={18} />
                      </span>
                      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Calendar size={12} />
                        {formatDate(notice.date, isBn)}
                      </span>
                    </div>
                    <h3 className="text-base md:text-lg font-bold text-foreground leading-snug mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {t(notice.title_bn, notice.title_en)}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-3 whitespace-pre-line flex-1">
                      {t(notice.description_bn, notice.description_en)}
                    </p>
                    <div className="mt-5 pt-4 border-t border-border flex items-center justify-between text-sm">
                      <span className="font-semibold text-primary flex items-center gap-1">
                        {t('বিস্তারিত', 'Read more')}
                        <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
                      </span>
                      {notice.attachment && <Paperclip size={14} className="text-muted-foreground" />}
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ───────── Principal's message ───────── */}
      {madrasaInfo.principalMessage_bn && (
        <section className="py-14 md:py-20 px-4 md:px-8">
          <Reveal variant="zoom" className="max-w-5xl mx-auto">
            <div className="relative tint tint-green rounded-3xl p-6 md:p-12 grid md:grid-cols-[auto,1fr] gap-8 md:gap-12 items-center overflow-hidden">
              <Quote size={120} className="absolute -top-4 right-6 text-primary/10 rotate-180" aria-hidden="true" />
              <div className="relative flex flex-col items-center text-center">
                {madrasaInfo.principalPhoto ? (
                  <img
                    src={madrasaInfo.principalPhoto}
                    alt="principal"
                    loading="lazy"
                    className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                ) : (
                  <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-white border-4 border-white shadow-lg flex items-center justify-center">
                    <Users size={44} className="text-primary" />
                  </div>
                )}
                {(madrasaInfo.principalName_bn || madrasaInfo.principalName_en) && (
                  <>
                    <p className="mt-4 font-bold text-lg text-foreground">
                      {t(madrasaInfo.principalName_bn, madrasaInfo.principalName_en)}
                    </p>
                    <p className="text-sm text-muted-foreground">{t('অধ্যক্ষ', 'Principal')}</p>
                  </>
                )}
              </div>
              <div className="relative">
                <span className="eyebrow bg-white">{t('অধ্যক্ষের বাণী', "Principal's Message")}</span>
                <blockquote className="mt-4 text-base md:text-lg text-foreground/80 leading-relaxed whitespace-pre-line line-clamp-[9]">
                  {t(madrasaInfo.principalMessage_bn, madrasaInfo.principalMessage_en)}
                </blockquote>
                <Link to="/about" className="inline-flex items-center gap-1.5 mt-5 text-sm font-semibold text-primary hover:underline">
                  {t('সম্পূর্ণ পড়ুন', 'Read full message')} <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </Reveal>
        </section>
      )}

      {/* ───────── Teachers ───────── */}
      {teachers.length > 0 && (
        <section className="py-14 md:py-20 px-4 md:px-8 bg-secondary/60">
          <div className="max-w-7xl mx-auto">
            <Reveal>
              <SectionHeading
                eyebrow={t('আমাদের', 'Our')}
                title={t('শিক্ষকমণ্ডলী', 'Teaching Staff')}
                subtitle={t('অভিজ্ঞ ও যোগ্য শিক্ষকবৃন্দ', 'Experienced and qualified teachers')}
                href="/teachers"
                linkLabel={t('সব দেখুন', 'View All')}
                onTint
              />
            </Reveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {teachers.slice(0, 4).map((teacher, i) => (
                <Reveal key={teacher.id} delay={i * 90} className="h-full">
                  <TeacherCard teacher={teacher} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ───────── Gallery ───────── */}
      {photoGallery.length > 0 && (
        <section className="py-14 md:py-20 px-4 md:px-8">
          <div className="max-w-7xl mx-auto">
            <Reveal>
              <SectionHeading
                eyebrow={t('স্মরণীয় মুহূর্ত', 'Moments')}
                title={t('গ্যালারি', 'Gallery')}
                subtitle={t('মাদ্রাসার ছবি ও মুহূর্ত', 'Photos from our campus')}
                href="/gallery"
                linkLabel={t('সব দেখুন', 'View All')}
              />
            </Reveal>
            <div className={`grid gap-3 md:gap-4 ${bento ? 'grid-cols-2 md:grid-cols-4 md:auto-rows-[190px]' : 'grid-cols-2 md:grid-cols-3'}`}>
              {photoGallery.slice(0, bento ? 5 : 6).map((item, i) => {
                const big = bento && i === 0;
                return (
                  <Reveal
                    key={item.id}
                    variant="zoom"
                    delay={i * 80}
                    className={big ? 'col-span-2 md:row-span-2' : ''}
                  >
                    <Link
                      to="/gallery"
                      className={`group relative block rounded-2xl overflow-hidden bg-muted border border-border w-full ${
                        bento ? (big ? 'aspect-video md:aspect-auto md:h-full' : 'aspect-square md:aspect-auto md:h-full') : 'aspect-[4/3]'
                      }`}
                    >
                      <img
                        src={item.thumbnail || item.url}
                        alt={t(item.title_bn, item.title_en)}
                        loading="lazy"
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <p className="absolute inset-x-0 bottom-0 p-3 md:p-4 text-xs md:text-sm font-medium text-white line-clamp-2 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                        {t(item.title_bn, item.title_en)}
                      </p>
                    </Link>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ───────── Contact ───────── */}
      <section className="py-14 md:py-20 px-4 md:px-8 bg-secondary/60">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <SectionHeading
              eyebrow={t('যোগাযোগ', 'Contact')}
              title={t('আমাদের সাথে যোগাযোগ করুন', 'Get In Touch')}
              subtitle={t('যেকোনো প্রয়োজনে আমাদের সাথে যোগাযোগ করুন', 'Reach out to us for anything you need')}
              align="center"
              onTint
            />
          </Reveal>

          <div className={`grid gap-6 lg:gap-8 ${madrasaInfo.mapEmbed ? 'lg:grid-cols-2' : 'max-w-3xl mx-auto'}`}>
            <div className="grid sm:grid-cols-2 gap-4 content-start">
              {contactItems.map((item, i) => {
                const Icon = item.icon;
                const inner = (
                  <>
                    <span className="icon-chip mb-3"><Icon size={20} /></span>
                    <p className="text-xs font-semibold opacity-70 mb-1">{item.label}</p>
                    <p className="text-sm font-semibold text-foreground break-words">{item.value}</p>
                  </>
                );
                return (
                  <Reveal key={i} delay={i * 80} className="h-full">
                    {item.href ? (
                      <a href={item.href} className={`tint ${item.tint} rounded-2xl p-5 block h-full`}>{inner}</a>
                    ) : (
                      <div className={`tint ${item.tint} rounded-2xl p-5 h-full`}>{inner}</div>
                    )}
                  </Reveal>
                );
              })}
              <Reveal delay={contactItems.length * 80} className="sm:col-span-2">
                <Link to="/contact" className="btn-primary w-full">
                  {t('বিস্তারিত যোগাযোগ তথ্য', 'Full Contact Info')}
                  <ArrowRight size={16} />
                </Link>
              </Reveal>
            </div>

            {madrasaInfo.mapEmbed && (
              <Reveal variant="right">
                <div className="rounded-3xl overflow-hidden border-4 border-white shadow-xl h-full min-h-[300px] aspect-video lg:aspect-auto bg-secondary">
                  <iframe
                    src={madrasaInfo.mapEmbed}
                    className="w-full h-full min-h-[300px]"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Madrasa Location"
                  />
                </div>
              </Reveal>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
