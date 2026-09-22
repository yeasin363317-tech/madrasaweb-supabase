import { useRef, useState } from 'react';
import { Search, CheckCircle, XCircle, Download, Printer, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';
import { useData } from '@/contexts/DataContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import PageHeader from '@/components/layout/PageHeader';
import { getTotals, getGrade } from '@/lib/grade';
import type { Result } from '@/types';

/** "০০৫" / " 5 " / "05"  ->  "5"  (Bangla digits and leading zeros are tolerated) */
function normalizeRoll(v: string): string {
  const ascii = v.trim().replace(/[০-৯]/g, d => String('০১২৩৪৫৬৭৮৯'.indexOf(d)));
  return /^\d+$/.test(ascii) ? String(Number(ascii)) : ascii.toLowerCase();
}

export default function Results() {
  const { t, isBn } = useLanguage();
  const { data, dataReady } = useData();
  const { madrasaInfo } = data;
  const [selectedClass, setSelectedClass] = useState('');
  const [roll, setRoll] = useState('');
  const [searchResult, setSearchResult] = useState<Result | 'not-found'>('not-found');
  const [searched, setSearched] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const publishedResults = data.results.filter(r => r.published);

  const handleSearch = () => {
    if (!selectedClass || !roll.trim()) return;
    setSearched(true);
    const wanted = normalizeRoll(roll);
    const found = publishedResults.find(r => r.classId === selectedClass && normalizeRoll(r.roll) === wanted);
    setSearchResult(found || 'not-found');
  };

  const handleDownloadPdf = async () => {
    if (!cardRef.current || searchResult === 'not-found') return;
    setDownloading(true);
    try {
      if (document.fonts?.ready) await document.fonts.ready;
      // Loaded on demand so the main bundle stays small
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([import('html2canvas'), import('jspdf')]);
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true,
        logging: false,
        windowWidth: 900, // same layout on phone and desktop
      });
      const pdf = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();
      const margin = 12;
      let w = pageW - margin * 2;
      let h = (canvas.height * w) / canvas.width;
      if (h > pageH - margin * 2) { // keep everything on one page
        h = pageH - margin * 2;
        w = (canvas.width * h) / canvas.height;
      }
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', (pageW - w) / 2, margin, w, h);
      const safeRoll = searchResult.roll.replace(/[^\w-]+/g, '') || 'result';
      pdf.save(`Result_Roll-${safeRoll}.pdf`);
      toast.success(t('PDF ডাউনলোড হয়েছে', 'PDF downloaded'));
    } catch (err) {
      console.error('PDF generation failed', err);
      toast.error(t('PDF তৈরি করা যায়নি। প্রিন্ট অপশন ব্যবহার করুন।', 'Could not create the PDF. Please use Print instead.'));
    } finally {
      setDownloading(false);
    }
  };

  const totals = searchResult !== 'not-found' ? getTotals(searchResult.entries) : null;
  const grade = totals ? getGrade(totals.pct) : null;

  return (
    <div className="min-h-screen bg-background">
      <div className="no-print"><Navbar /></div>

      <div className="no-print">
        <PageHeader title={t('ফলাফল', 'Student Results')} subtitle={t('ক্লাস ও রোল নম্বর দিয়ে ফলাফল অনুসন্ধান করুন', 'Search results by class and roll number')} />
      </div>

      <div className="section-padding">
        <div className="container-max max-w-2xl">
          {/* Search Form */}
          <div className="card-base p-6 md:p-8 mb-8 no-print">
            <h2 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
              <Search size={20} className="text-primary" />
              {t('ফলাফল অনুসন্ধান', 'Search Result')}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="label-base">{t('ক্লাস নির্বাচন করুন', 'Select Class')}</label>
                <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)} className="input-base">
                  <option value="">{t('-- ক্লাস নির্বাচন করুন --', '-- Select Class --')}</option>
                  {[...data.classes].sort((a, b) => a.order - b.order).map(cls => (
                    <option key={cls.id} value={cls.id}>{t(cls.name_bn, cls.name_en)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label-base">{t('রোল নম্বর', 'Roll Number')}</label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={roll}
                  onChange={e => setRoll(e.target.value)}
                  placeholder={t('রোল নম্বর লিখুন', 'Enter roll number')}
                  className="input-base"
                  onKeyDown={e => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <button
                onClick={handleSearch}
                disabled={!selectedClass || !roll.trim() || !dataReady}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {dataReady ? <Search size={16} /> : <Loader2 size={16} className="animate-spin" />}
                {dataReady ? t('অনুসন্ধান করুন', 'Search Result') : t('লোড হচ্ছে...', 'Loading...')}
              </button>
            </div>
          </div>

          {/* Result Display */}
          {searched && (
            searchResult === 'not-found' ? (
              <div className="card-base p-8 text-center">
                <XCircle size={48} className="text-red-400 mx-auto mb-3" />
                <p className="text-lg font-semibold text-foreground mb-1">{t('ফলাফল পাওয়া যায়নি', 'Result Not Found')}</p>
                <p className="text-sm text-muted-foreground">
                  {t('এই ক্লাস ও রোলের জন্য কোনো প্রকাশিত ফলাফল নেই।', 'No published result found for this class and roll.')}
                </p>
              </div>
            ) : (
              <>
                <div className="flex flex-wrap items-center justify-end gap-2 mb-3 no-print">
                  <button onClick={handleDownloadPdf} disabled={downloading} className="btn-primary !py-2.5 !px-5 text-sm disabled:opacity-60">
                    {downloading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                    {downloading ? t('তৈরি হচ্ছে...', 'Preparing...') : t('PDF ডাউনলোড', 'Download PDF')}
                  </button>
                  <button onClick={() => window.print()} className="btn-outline !py-2.5 !px-5 text-sm">
                    <Printer size={16} />
                    {t('প্রিন্ট', 'Print')}
                  </button>
                </div>

                {/* ───── Printable result sheet (this block becomes the PDF) ───── */}
                <div ref={cardRef} className="bg-white border border-border rounded-2xl p-6 md:p-8 shadow-sm">
                  <div className="text-center pb-5 mb-5 border-b-2 border-primary/30">
                    {madrasaInfo.logo && (
                      <img src={madrasaInfo.logo} alt="" className="w-16 h-16 rounded-full object-cover mx-auto mb-2" />
                    )}
                    <h2 className="text-lg md:text-xl font-bold text-foreground leading-snug">
                      {t(madrasaInfo.name_bn, madrasaInfo.name_en)}
                    </h2>
                    {madrasaInfo.address_bn && (
                      <p className="text-xs text-muted-foreground mt-1">{t(madrasaInfo.address_bn, madrasaInfo.address_en)}</p>
                    )}
                    <p className="inline-block mt-3 px-4 py-1 rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                      {t('ফলাফল পত্র', 'Result Sheet')}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 mb-5">
                    <CheckCircle size={24} className="text-primary shrink-0" />
                    <div className="min-w-0">
                      <h3 className="text-lg font-bold text-foreground">
                        {t(searchResult.studentName_bn, searchResult.studentName_en || searchResult.studentName_bn)}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {t('ক্লাস:', 'Class:')} {searchResult.className} &nbsp;|&nbsp; {t('রোল:', 'Roll:')} {searchResult.roll}
                      </p>
                    </div>
                  </div>

                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-secondary">
                        <th className="text-left px-4 py-3 rounded-l-lg font-semibold text-foreground">{t('বিষয়', 'Subject')}</th>
                        <th className="text-center px-4 py-3 font-semibold text-foreground">{t('প্রাপ্ত নম্বর', 'Marks')}</th>
                        <th className="text-center px-4 py-3 rounded-r-lg font-semibold text-foreground">{t('পূর্ণমান', 'Total')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {searchResult.entries.map((entry, i) => (
                        <tr key={i}>
                          <td className="px-4 py-3 font-medium text-foreground">{entry.subject}</td>
                          <td className="px-4 py-3 text-center font-bold text-primary">{entry.marks}</td>
                          <td className="px-4 py-3 text-center text-muted-foreground">{entry.totalMarks}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-primary/5 font-bold">
                        <td className="px-4 py-3 rounded-l-lg">{t('মোট', 'Total')}</td>
                        <td className="px-4 py-3 text-center text-primary">{totals?.obtained}</td>
                        <td className="px-4 py-3 text-center text-muted-foreground rounded-r-lg">{totals?.total}</td>
                      </tr>
                    </tfoot>
                  </table>

                  <div className="mt-4 p-4 bg-secondary rounded-xl flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">{t('শতাংশ', 'Percentage')}</p>
                      <p className="text-lg font-bold text-foreground">{totals ? totals.pct.toFixed(1) : '0.0'}%</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">{t('গ্রেড', 'Grade')}</p>
                      <p className={`text-2xl font-bold ${grade?.color}`}>{grade?.grade}</p>
                    </div>
                  </div>

                  <p className="text-[11px] text-muted-foreground text-center mt-5">
                    {t('এটি ওয়েবসাইট থেকে প্রাপ্ত অনলাইন ফলাফল।', 'Online result generated from the madrasa website.')}{' '}
                    {new Date().toLocaleDateString(isBn ? 'bn-BD' : 'en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
              </>
            )
          )}
        </div>
      </div>

      <div className="no-print"><Footer /></div>
    </div>
  );
}
