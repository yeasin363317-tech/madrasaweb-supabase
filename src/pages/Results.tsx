import { useState } from 'react';
import { Search, FileText, CheckCircle, XCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useData } from '@/contexts/DataContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import type { Result } from '@/types';

export default function Results() {
  const { t } = useLanguage();
  const { data } = useData();
  const [selectedClass, setSelectedClass] = useState('');
  const [roll, setRoll] = useState('');
  const [searchResult, setSearchResult] = useState<Result | null | 'not-found'>('not-found');
  const [searched, setSearched] = useState(false);

  const publishedResults = data.results.filter(r => r.published);

  const handleSearch = () => {
    if (!selectedClass || !roll.trim()) return;
    setSearched(true);
    const found = publishedResults.find(
      r => r.classId === selectedClass && r.roll.trim() === roll.trim()
    );
    setSearchResult(found || 'not-found');
  };

  const getTotalMarks = (result: Result) => ({
    obtained: result.entries.reduce((sum, e) => sum + e.marks, 0),
    total: result.entries.reduce((sum, e) => sum + e.totalMarks, 0),
  });

  const getGrade = (marks: number, total: number) => {
    const pct = (marks / total) * 100;
    if (pct >= 80) return { grade: 'A+', color: 'text-green-600' };
    if (pct >= 70) return { grade: 'A', color: 'text-green-500' };
    if (pct >= 60) return { grade: 'A-', color: 'text-blue-600' };
    if (pct >= 50) return { grade: 'B', color: 'text-blue-500' };
    if (pct >= 40) return { grade: 'C', color: 'text-yellow-600' };
    if (pct >= 33) return { grade: 'D', color: 'text-orange-500' };
    return { grade: 'F', color: 'text-red-500' };
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="bg-primary pattern-bg py-14 px-4 text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-2">
          {t('ফলাফল', 'Student Results')}
        </h1>
        <p className="text-white/75 text-sm">
          {t('ক্লাস ও রোল নম্বর দিয়ে ফলাফল অনুসন্ধান করুন', 'Search results by class and roll number')}
        </p>
      </div>

      <div className="section-padding">
        <div className="container-max max-w-2xl">
          {/* Search Form */}
          <div className="card-base p-8 mb-8">
            <h2 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
              <Search size={20} className="text-primary" />
              {t('ফলাফল অনুসন্ধান', 'Search Result')}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="label-base">{t('ক্লাস নির্বাচন করুন', 'Select Class')}</label>
                <select
                  value={selectedClass}
                  onChange={e => setSelectedClass(e.target.value)}
                  className="input-base"
                >
                  <option value="">{t('-- ক্লাস নির্বাচন করুন --', '-- Select Class --')}</option>
                  {data.classes.map(cls => (
                    <option key={cls.id} value={cls.id}>
                      {t(cls.name_bn, cls.name_en)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label-base">{t('রোল নম্বর', 'Roll Number')}</label>
                <input
                  type="text"
                  value={roll}
                  onChange={e => setRoll(e.target.value)}
                  placeholder={t('রোল নম্বর লিখুন', 'Enter roll number')}
                  className="input-base"
                  onKeyDown={e => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <button
                onClick={handleSearch}
                disabled={!selectedClass || !roll.trim()}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Search size={16} />
                {t('অনুসন্ধান করুন', 'Search Result')}
              </button>
            </div>
          </div>

          {/* Result Display */}
          {searched && (
            <>
              {searchResult === 'not-found' || !searchResult ? (
                <div className="card-base p-8 text-center">
                  <XCircle size={48} className="text-red-400 mx-auto mb-3" />
                  <p className="text-lg font-semibold text-foreground mb-1">
                    {t('ফলাফল পাওয়া যায়নি', 'Result Not Found')}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t('এই ক্লাস ও রোলের জন্য কোনো প্রকাশিত ফলাফল নেই।', 'No published result found for this class and roll.')}
                  </p>
                </div>
              ) : (
                <div className="card-base p-6">
                  <div className="flex items-center gap-3 mb-5 pb-4 border-b border-border">
                    <CheckCircle size={24} className="text-primary" />
                    <div>
                      <h3 className="text-lg font-bold text-foreground">
                        {t(searchResult.studentName_bn, searchResult.studentName_en)}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {t('ক্লাস:', 'Class:')} {searchResult.className} | {t('রোল:', 'Roll:')} {searchResult.roll}
                      </p>
                    </div>
                  </div>

                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-secondary">
                        <th className="text-left px-4 py-3 rounded-l-lg font-semibold text-foreground">
                          {t('বিষয়', 'Subject')}
                        </th>
                        <th className="text-center px-4 py-3 font-semibold text-foreground">
                          {t('প্রাপ্ত নম্বর', 'Marks')}
                        </th>
                        <th className="text-center px-4 py-3 rounded-r-lg font-semibold text-foreground">
                          {t('পূর্ণমান', 'Total')}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {searchResult.entries.map((entry, i) => (
                        <tr key={i} className="hover:bg-secondary/50 transition-colors">
                          <td className="px-4 py-3 font-medium text-foreground">{entry.subject}</td>
                          <td className="px-4 py-3 text-center font-bold text-primary">{entry.marks}</td>
                          <td className="px-4 py-3 text-center text-muted-foreground">{entry.totalMarks}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-primary/5 font-bold">
                        <td className="px-4 py-3 rounded-l-lg">{t('মোট', 'Total')}</td>
                        <td className="px-4 py-3 text-center text-primary">
                          {getTotalMarks(searchResult).obtained}
                        </td>
                        <td className="px-4 py-3 text-center text-muted-foreground rounded-r-lg">
                          {getTotalMarks(searchResult).total}
                        </td>
                      </tr>
                    </tfoot>
                  </table>

                  <div className="mt-4 p-4 bg-secondary rounded-xl flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">{t('শতাংশ', 'Percentage')}</p>
                      <p className="text-lg font-bold text-foreground">
                        {((getTotalMarks(searchResult).obtained / getTotalMarks(searchResult).total) * 100).toFixed(1)}%
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">{t('গ্রেড', 'Grade')}</p>
                      <p className={`text-2xl font-bold ${getGrade(getTotalMarks(searchResult).obtained, getTotalMarks(searchResult).total).color}`}>
                        {getGrade(getTotalMarks(searchResult).obtained, getTotalMarks(searchResult).total).grade}
                      </p>
                    </div>
                  </div>
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
