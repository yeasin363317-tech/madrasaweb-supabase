import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useData } from '@/contexts/DataContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import PageHeader from '@/components/layout/PageHeader';
import Reveal from '@/components/features/Reveal';
import CountUp from '@/components/features/CountUp';
import { BookOpen, Target, Eye, Landmark, Users, GraduationCap, Quote, ArrowRight } from 'lucide-react';

export default function About() {
  const { t, isBn } = useLanguage();
  const { data } = useData();
  const { madrasaInfo, teachers } = data;

  const stats = [
    { icon: GraduationCap, label: t('শিক্ষার্থী', 'Students'), value: madrasaInfo.totalStudents, suffix: '+', tint: 'tint-green' },
    { icon: Users, label: t('শিক্ষক', 'Teachers'), value: teachers.length, suffix: '', tint: 'tint-purple' },
  ].filter(s => s.value > 0);

  return (
    <div className="min-h-screen bg-background overflow-x-clip">
      <Navbar />

      <PageHeader title={t('মাদ্রাসা পরিচিতি', 'About The Madrasa')} subtitle={t(madrasaInfo.name_bn, madrasaInfo.name_en)} />

      <div className="section-padding">
        <div className="max-w-5xl mx-auto space-y-10 md:space-y-14">
          {/* About */}
          <Reveal>
            <div className="card-base p-6 md:p-10">
              <div className="flex items-center gap-3 mb-5">
                <span className="icon-chip tint tint-green"><BookOpen size={20} /></span>
                <h2 className="text-xl md:text-2xl font-bold text-foreground">{t('মাদ্রাসা সম্পর্কে', 'About Madrasa')}</h2>
              </div>
              <p className="text-base md:text-[17px] text-foreground/80 leading-[1.9] whitespace-pre-line">
                {t(madrasaInfo.about_bn, madrasaInfo.about_en)}
              </p>

              {stats.length > 0 && (
                <div className="mt-8 pt-6 border-t border-border grid grid-cols-2 gap-4 max-w-md">
                  {stats.map((s, i) => {
                    const Icon = s.icon;
                    return (
                      <div key={i} className={`tint ${s.tint} rounded-2xl p-4 flex items-center gap-3 hover:!transform-none`}>
                        <span className="icon-chip"><Icon size={18} /></span>
                        <div>
                          <p className="text-xl font-bold leading-none"><CountUp value={s.value} bn={isBn} suffix={s.suffix} /></p>
                          <p className="text-xs opacity-75 mt-1">{s.label}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </Reveal>

          {/* History */}
          {madrasaInfo.history_bn && (
            <Reveal>
              <div className="card-base p-6 md:p-10 relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-green-600 to-emerald-300" aria-hidden="true" />
                <div className="flex items-center gap-3 mb-5">
                  <span className="icon-chip tint tint-orange"><Landmark size={20} /></span>
                  <h2 className="text-xl md:text-2xl font-bold text-foreground">{t('ইতিহাস', 'Our History')}</h2>
                </div>
                <p className="text-base md:text-[17px] text-foreground/80 leading-[1.9] whitespace-pre-line">
                  {t(madrasaInfo.history_bn, madrasaInfo.history_en)}
                </p>
              </div>
            </Reveal>
          )}

          {/* Mission & Vision */}
          <div className="grid md:grid-cols-2 gap-5 md:gap-6">
            {[
              { title: t('মিশন', 'Our Mission'), text: t(madrasaInfo.mission_bn, madrasaInfo.mission_en), icon: Target, tint: 'tint-green' },
              { title: t('ভিশন', 'Our Vision'), text: t(madrasaInfo.vision_bn, madrasaInfo.vision_en), icon: Eye, tint: 'tint-blue' },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <Reveal key={i} delay={i * 120} className="h-full">
                  <div className={`tint ${item.tint} rounded-3xl p-6 md:p-8 h-full`}>
                    <span className="icon-chip mb-4"><Icon size={22} /></span>
                    <h2 className="text-xl font-bold mb-3">{item.title}</h2>
                    <p className="text-base leading-relaxed text-foreground/80">{item.text || '—'}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>

          {/* Principal message */}
          {madrasaInfo.principalMessage_bn && (
            <Reveal variant="zoom">
              <div className="relative card-base p-6 md:p-10 overflow-hidden bg-secondary/50">
                <Quote size={110} className="absolute -top-2 right-6 text-primary/10 rotate-180" aria-hidden="true" />
                <div className="relative flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-10">
                  <div className="flex flex-col items-center text-center shrink-0">
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
                  <div>
                    <span className="eyebrow bg-white">{t('অধ্যক্ষের বাণী', "Principal's Message")}</span>
                    <blockquote className="mt-4 text-base md:text-[17px] text-foreground/80 leading-[1.9] whitespace-pre-line">
                      {t(madrasaInfo.principalMessage_bn, madrasaInfo.principalMessage_en)}
                    </blockquote>
                  </div>
                </div>
              </div>
            </Reveal>
          )}

          {/* CTA */}
          <Reveal>
            <div className="text-center">
              <Link to="/contact" className="btn-primary">
                {t('যোগাযোগ করুন', 'Contact Us')}
                <ArrowRight size={16} />
              </Link>
            </div>
          </Reveal>
        </div>
      </div>

      <Footer />
    </div>
  );
}
