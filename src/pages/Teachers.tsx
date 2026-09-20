import { useLanguage } from '@/contexts/LanguageContext';
import { useData } from '@/contexts/DataContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import TeacherCard from '@/components/features/TeacherCard';
import { Users } from 'lucide-react';

export default function Teachers() {
  const { t } = useLanguage();
  const { data } = useData();
  const { teachers } = data;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="bg-primary pattern-bg py-14 px-4 text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-2">
          {t('শিক্ষকমণ্ডলী', 'Teaching Staff')}
        </h1>
        <p className="text-white/75 text-sm">
          {t('আমাদের অভিজ্ঞ ও যোগ্য শিক্ষকবৃন্দ', 'Our experienced and qualified teachers')}
        </p>
      </div>

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
              {teachers.map(teacher => (
                <TeacherCard key={teacher.id} teacher={teacher} />
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
