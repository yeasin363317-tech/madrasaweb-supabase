import { useMemo, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useData } from '@/contexts/DataContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import PageHeader from '@/components/layout/PageHeader';
import NoticeCard from '@/components/features/NoticeCard';
import Reveal from '@/components/features/Reveal';
import { Bell, Search, X } from 'lucide-react';

export default function Notices() {
  const { t } = useLanguage();
  const { data } = useData();
  const [query, setQuery] = useState('');

  const publishedNotices = useMemo(
    () => data.notices
      .filter(n => n.published)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [data.notices]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return publishedNotices;
    return publishedNotices.filter(n =>
      `${n.title_bn} ${n.title_en} ${n.description_bn} ${n.description_en}`.toLowerCase().includes(q)
    );
  }, [publishedNotices, query]);

  return (
    <div className="min-h-screen bg-background overflow-x-clip">
      <Navbar />

      <PageHeader
        title={t('নোটিশ বোর্ড', 'Notice Board')}
        subtitle={t('সকল গুরুত্বপূর্ণ নোটিশ ও বিজ্ঞপ্তি', 'All important notices and announcements')}
      />

      <div className="section-padding">
        <div className="max-w-4xl mx-auto">
          {publishedNotices.length === 0 ? (
            <div className="text-center py-16 bg-secondary rounded-3xl">
              <Bell size={48} className="text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-semibold text-foreground mb-2">
                {t('কোনো নোটিশ নেই', 'No notices available')}
              </p>
              <p className="text-muted-foreground text-sm">
                {t('নতুন নোটিশ প্রকাশিত হলে এখানে দেখা যাবে।', 'New notices will appear here when published.')}
              </p>
            </div>
          ) : (
            <>
              <Reveal>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                  <div className="relative flex-1 max-w-md">
                    <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      value={query}
                      onChange={e => setQuery(e.target.value)}
                      placeholder={t('নোটিশ খুঁজুন...', 'Search notices...')}
                      className="input-base !pl-11 !pr-10"
                    />
                    {query && (
                      <button
                        onClick={() => setQuery('')}
                        aria-label="Clear"
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-muted-foreground hover:bg-secondary"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {t(`মোট ${filtered.length.toLocaleString('bn-BD')} টি নোটিশ`, `${filtered.length} notice(s)`)}
                  </p>
                </div>
              </Reveal>

              {filtered.length === 0 ? (
                <div className="text-center py-14 bg-secondary rounded-3xl">
                  <Search size={40} className="text-muted-foreground mx-auto mb-3" />
                  <p className="font-semibold text-foreground">{t('কোনো নোটিশ পাওয়া যায়নি', 'No matching notices')}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filtered.map((notice, i) => (
                    <Reveal key={notice.id} delay={Math.min(i, 5) * 60}>
                      <NoticeCard notice={notice} expanded />
                    </Reveal>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
