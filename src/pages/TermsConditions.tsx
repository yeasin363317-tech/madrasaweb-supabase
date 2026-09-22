import { useLanguage } from '@/contexts/LanguageContext';
import { useData } from '@/contexts/DataContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import PageHeader from '@/components/layout/PageHeader';
import { ScrollText } from 'lucide-react';

export default function TermsConditions() {
  const { t, isBn } = useLanguage();
  const { data } = useData();

  const content = isBn ? data.termsConditions_bn : data.termsConditions_en;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <PageHeader title={t('ব্যবহারের শর্তাবলী', 'Terms & Conditions')} />

      <div className="section-padding">
        <div className="container-max max-w-3xl">
          <div className="card-base p-8">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
              <ScrollText size={24} className="text-primary" />
              <h2 className="text-xl font-bold text-foreground">
                {t('শর্তাবলী', 'Terms & Conditions')}
              </h2>
            </div>
            <div className="text-foreground/80 leading-relaxed whitespace-pre-wrap text-sm">
              {content}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
