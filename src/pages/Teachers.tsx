import { useLanguage } from '@/contexts/LanguageContext';
import { useData } from '@/contexts/DataContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import PageHeader from '@/components/layout/PageHeader';
import TeacherCard from '@/components/features/TeacherCard';
import Reveal from '@/components/features/Reveal';
import { Users } from 'lucide-react';

export default function Teachers() {
  const { t } = useLanguage();
  const { data } = useData();
  const { teachers } = data;

  return (
    <div className="min-h-screen bg-background overflow-x-clip">
      <Navbar />

      <PageHeader title={t('শিক্ষকমণ্ডলী', 'Teaching Staff')} subtitle={t('আমাদের অভিজ্ঞ ও যোগ্য শিক্ষকবৃন্দ', 'Our experienced and qualified teachers')} />

      <div className="section-padding">
        <div className="container-max">
          {teachers.length === 0 ? (
            <div className="text-center py-16 bg-secondary rounded-2xl">
              <Users size={48} className="text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-semibold text-foreground mb-2">
                {t('কোনো শিক্ষক তথ্য নেই', 'No teacher information')}
              </p>
              <p className="text-muted-foreground text-sm">
                {t('শীঘ্রই আপডেট করা হবে', 'Will be updated soon')}
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {teachers.map((teacher, i) => (
                <Reveal key={teacher.id} delay={Math.min(i, 7) * 80} className="h-full">
                  <TeacherCard teacher={teacher} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
