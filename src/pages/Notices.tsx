import { useLanguage } from '@/contexts/LanguageContext';
import { useData } from '@/contexts/DataContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import NoticeCard from '@/components/features/NoticeCard';
import { Bell } from 'lucide-react';

export default function Notices() {
  const { t } = useLanguage();
  const { data } = useData();
  const publishedNotices = data.notices.filter(n => n.published).sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="bg-primary pattern-bg py-14 px-4 text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-2">
          {t('নোটিশ বোর্ড', 'Notice Board')}
        </h1>
        <p className="text-white/75 text-sm">
          {t('সকল গুরুত্বপূর্ণ নোটিশ ও বিজ্ঞপ্তি', 'All important notices and announcements')}
        </p>
      </div>

      <div className="section-padding">
        <div className="container-max">
          {publishedNotices.length === 0 ? (
            <div className="text-center py-16 bg-secondary rounded-2xl">
              <Bell size={48} className="text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-semibold text-foreground mb-2">
                {t('কোনো নোটিশ নেই', 'No notices available')}
              </p>
              <p className="text-muted-foreground text-sm">
                {t('নতুন নোটিশ প্রকাশিত হলে এখানে দেখা যাবে।', 'New notices will appear here when published.')}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {publishedNotices.map(notice => (
                <NoticeCard key={notice.id} notice={notice} expanded />
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
