import { useLanguage } from '@/contexts/LanguageContext';
import { useData } from '@/contexts/DataContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Shield } from 'lucide-react';

export default function PrivacyPolicy() {
  const { t, isBn } = useLanguage();
  const { data } = useData();

  const content = isBn ? data.privacyPolicy_bn : data.privacyPolicy_en;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="bg-primary pattern-bg py-14 px-4 text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-2">
          {t('গোপনীয়তা নীতি', 'Privacy Policy')}
        </h1>
      </div>

      <div className="section-padding">
        <div className="container-max max-w-3xl">
          <div className="card-base p-8">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
              <Shield size={24} className="text-primary" />
              <h2 className="text-xl font-bold text-foreground">
                {t('গোপনীয়তা নীতি', 'Privacy Policy')}
              </h2>
            </div>
            <div className="prose prose-sm max-w-none text-foreground/80 leading-relaxed whitespace-pre-wrap">
              {content}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
