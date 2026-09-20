import { useLanguage } from '@/contexts/LanguageContext';
import { useData } from '@/contexts/DataContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { BookOpen, Target, Eye, MessageSquare } from 'lucide-react';

export default function About() {
  const { t } = useLanguage();
  const { data } = useData();
  const { madrasaInfo } = data;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <div className="bg-primary pattern-bg py-14 px-4 text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-2">
          {t('মাদ্রাসা পরিচিতি', 'About The Madrasa')}
        </h1>
        <p className="text-white/75 text-sm">
          {t(madrasaInfo.name_bn, madrasaInfo.name_en)}
        </p>
      </div>

      <div className="section-padding">
        <div className="container-max space-y-12">
          {/* About */}
          <div className="card-base p-8">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <BookOpen size={20} className="text-primary" />
              </div>
              <h2 className="text-xl font-bold text-foreground">{t('মাদ্রাসা সম্পর্কে', 'About Madrasa')}</h2>
            </div>
            <p className="text-base text-foreground/80 leading-relaxed">
              {t(madrasaInfo.about_bn, madrasaInfo.about_en)}
            </p>
          </div>

          {/* History */}
          {madrasaInfo.history_bn && (
            <div className="card-base p-8">
              <h2 className="text-xl font-bold text-foreground mb-4">{t('ইতিহাস', 'History')}</h2>
              <p className="text-base text-foreground/80 leading-relaxed whitespace-pre-wrap">
                {t(madrasaInfo.history_bn, madrasaInfo.history_en)}
              </p>
            </div>
          )}

          {/* Mission & Vision */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="card-base p-8 border-l-4 border-primary">
              <div className="flex items-center gap-3 mb-4">
                <Target size={20} className="text-primary" />
                <h2 className="text-xl font-bold text-foreground">{t('মিশন', 'Our Mission')}</h2>
              </div>
              <p className="text-base text-foreground/80 leading-relaxed">
                {t(madrasaInfo.mission_bn, madrasaInfo.mission_en)}
              </p>
            </div>
            <div className="card-base p-8 border-l-4 border-primary">
              <div className="flex items-center gap-3 mb-4">
                <Eye size={20} className="text-primary" />
                <h2 className="text-xl font-bold text-foreground">{t('ভিশন', 'Our Vision')}</h2>
              </div>
              <p className="text-base text-foreground/80 leading-relaxed">
                {t(madrasaInfo.vision_bn, madrasaInfo.vision_en)}
              </p>
            </div>
          </div>

          {/* Principal Message */}
          {madrasaInfo.principalMessage_bn && (
            <div className="card-base p-8 bg-secondary">
              <div className="flex items-center gap-3 mb-6">
                <MessageSquare size={20} className="text-primary" />
                <h2 className="text-xl font-bold text-foreground">{t('অধ্যক্ষের বাণী', "Principal's Message")}</h2>
              </div>
              <div className="flex flex-col sm:flex-row items-start gap-6">
                {madrasaInfo.principalPhoto ? (
                  <img src={madrasaInfo.principalPhoto} alt="principal"
                    className="w-24 h-24 rounded-full object-cover ring-4 ring-primary shrink-0" />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-primary/10 ring-4 ring-primary shrink-0 flex items-center justify-center text-3xl">
                    👨‍🏫
                  </div>
                )}
                <div>
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
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
