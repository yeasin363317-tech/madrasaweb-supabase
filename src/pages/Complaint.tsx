import { useState } from 'react';
import { MessageSquare, CheckCircle, Search, Hash, Calendar, Clock, Reply, Users, GraduationCap } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useData } from '@/contexts/DataContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import PageHeader from '@/components/layout/PageHeader';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import type { ComplaintStatus, ComplaintType } from '@/types';

// ────────────────────────────────────────────────────────────────────────────
// Status display helper
// ────────────────────────────────────────────────────────────────────────────
const STATUS_INFO: Record<ComplaintStatus, { label_bn: string; label_en: string; color: string; bg: string }> = {
  pending: { label_bn: 'অপেক্ষমাণ', label_en: 'Pending', color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200' },
  under_review: { label_bn: 'পর্যালোচনাধীন', label_en: 'Under Review', color: 'text-blue-700', bg: 'bg-blue-50 border-blue-200' },
  resolved: { label_bn: 'সমাধান হয়েছে', label_en: 'Resolved', color: 'text-green-700', bg: 'bg-green-50 border-green-200' },
  rejected: { label_bn: 'প্রত্যাখ্যাত', label_en: 'Rejected', color: 'text-red-700', bg: 'bg-red-50 border-red-200' },
};

function StatusPill({ status, isBn }: { status: ComplaintStatus; isBn: boolean }) {
  const info = STATUS_INFO[status];
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border ${info.bg} ${info.color}`}>
      {isBn ? info.label_bn : info.label_en}
    </span>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// My Complaints search section
// ────────────────────────────────────────────────────────────────────────────
interface ComplaintRecord {
  id: string;
  tracking_id: string;
  name: string;
  complaint_type: string;
  subject: string;
  message: string;
  status: ComplaintStatus;
  admin_reply: string;
  created_at: string;
  updated_at: string;
}

function MyComplaints() {
  const { t, isBn } = useLanguage();
  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<ComplaintRecord[] | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) { toast.error(t('Tracking ID বা মোবাইল নম্বর লিখুন', 'Enter Tracking ID or Mobile number')); return; }
    setSearching(true);
    setSearched(false);
    try {
      // Search by database record ID (exact) OR mobile number (exact)
      const { data, error } = await supabase
        .from('complaints')
        .select('id, tracking_id, name, complaint_type, subject, message, status, admin_reply, created_at, updated_at')
        .or(`id.eq.${trimmed},mobile.eq.${trimmed}`)
        .order('created_at', { ascending: false });

      console.log('[Complaint Search] query:', trimmed, '| results:', data?.length ?? 0, '| error:', error);
      if (error) throw error;
      setResults(data as ComplaintRecord[]);
    } catch (e: unknown) {
      console.error('[Complaint Search] failed:', e);
      toast.error(e instanceof Error ? e.message : t('অনুসন্ধান ব্যর্থ', 'Search failed'));
    } finally {
      setSearching(false);
      setSearched(true);
    }
  };

  const formatDate = (d: string) => {
    try { return new Date(d).toLocaleDateString(isBn ? 'bn-BD' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' }); }
    catch { return d; }
  };

  return (
    <div className="space-y-5">
      <form onSubmit={handleSearch} className="flex gap-3">
        <div className="relative flex-1">
          <Hash size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={t('Tracking ID অথবা মোবাইল নম্বর দিয়ে সার্চ করুন', 'Search by Tracking ID or Mobile number')}
            className="input-base pl-9 w-full"
          />
        </div>
        <button type="submit" disabled={searching} className="btn-primary px-5 disabled:opacity-60">
          <Search size={16} /> {searching ? t('খুঁজছে...', 'Searching...') : t('খুঁজুন', 'Search')}
        </button>
      </form>

      <p className="text-xs text-muted-foreground bg-secondary px-4 py-2.5 rounded-xl">
        💡 {t('অভিযোগ জমা দেওয়ার পর প্রাপ্ত Tracking ID (ডেটাবেজ রেকর্ড ID) দিয়ে অনুসন্ধান করুন, অথবা আপনার মোবাইল নম্বর ব্যবহার করুন।',
          'Search using the Tracking ID (database record ID) received after submission, or use your mobile number.')}
      </p>

      {searched && results !== null && (
        results.length === 0 ? (
          <div className="text-center py-10 bg-secondary rounded-2xl">
            <Search size={36} className="text-muted-foreground mx-auto mb-3" />
            <p className="font-semibold text-foreground">{t('কোনো অভিযোগ পাওয়া যায়নি', 'No complaints found')}</p>
            <p className="text-sm text-muted-foreground mt-1">{t('Tracking ID বা মোবাইল নম্বর পুনরায় যাচাই করুন।', 'Please verify your Tracking ID or mobile number.')}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {results.map(c => (
              <div key={c.id} className="card-base overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-primary to-green-400" />
                <div className="p-5 space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                      <span className="text-xs font-mono font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                        {c.id}
                      </span>
                      {c.complaint_type && (
                        <span className={`ml-2 text-xs font-semibold px-2.5 py-1 rounded-full ${
                          c.complaint_type === 'guardian' ? 'bg-purple-50 text-purple-700' : 'bg-blue-50 text-blue-700'
                        }`}>
                          {c.complaint_type === 'guardian'
                            ? t('অভিভাবক', 'Guardian')
                            : t('শিক্ষার্থী', 'Student')}
                        </span>
                      )}
                      <h4 className="font-bold text-foreground mt-2">{c.subject}</h4>
                    </div>
                    <StatusPill status={c.status} isBn={isBn} />
                  </div>

                  {/* Message */}
                  <div className="bg-secondary rounded-xl p-4">
                    <p className="text-xs font-semibold text-muted-foreground mb-1.5">{t('অভিযোগ', 'Complaint')}</p>
                    <p className="text-sm text-foreground leading-relaxed">{c.message}</p>
                  </div>

                  {/* Admin reply */}
                  {c.admin_reply && (
                    <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
                      <p className="text-xs font-semibold text-primary mb-1.5 flex items-center gap-1.5">
                        <Reply size={12} /> {t('কর্তৃপক্ষের জবাব', 'Admin Reply')}
                      </p>
                      <p className="text-sm text-foreground leading-relaxed">{c.admin_reply}</p>
                    </div>
                  )}

                  {/* Dates */}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                    <span className="flex items-center gap-1"><Calendar size={11} /> {t('জমা', 'Submitted')}: {formatDate(c.created_at)}</span>
                    {c.updated_at && c.updated_at !== c.created_at && (
                      <span className="flex items-center gap-1"><Clock size={11} /> {t('আপডেট', 'Updated')}: {formatDate(c.updated_at)}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Main Page
// ────────────────────────────────────────────────────────────────────────────
export default function Complaint() {
  const { t } = useLanguage();
  const { saveComplaint } = useData();
  const [tab, setTab] = useState<'submit' | 'track'>('submit');
  const [submittedTrackingId, setSubmittedTrackingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: '', mobile: '', complaintType: 'student' as ComplaintType, subject: '', message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.mobile || !form.subject || !form.message) {
      toast.error(t('সকল তথ্য পূরণ করুন', 'Please fill all fields'));
      return;
    }
    setSubmitting(true);
    try {
      const { trackingId } = await saveComplaint({ name: form.name, mobile: form.mobile, complaintType: form.complaintType, subject: form.subject, message: form.message });
      setSubmittedTrackingId(trackingId);
      toast.success(t('অভিযোগ সফলভাবে জমা হয়েছে', 'Complaint submitted successfully'));
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : t('জমা ব্যর্থ হয়েছে', 'Submission failed'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <PageHeader title={t('অভিযোগ ব্যবস্থাপনা', 'Complaint Management')} subtitle={t('অভিযোগ জমা দিন এবং আপনার অভিযোগের অবস্থা জানুন', 'Submit complaints and track their status')} />

      <div className="section-padding">
        <div className="container-max max-w-2xl">
          {/* Tab switcher */}
          <div className="flex bg-secondary rounded-2xl p-1.5 mb-6 gap-1">
            {([
              { key: 'submit', label_bn: 'অভিযোগ জমা দিন', label_en: 'Submit Complaint', icon: MessageSquare },
              { key: 'track', label_bn: 'আমার অভিযোগ', label_en: 'My Complaints', icon: Search },
            ] as const).map(({ key, label_bn, label_en, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold transition-all ${
                  tab === key ? 'bg-white shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon size={15} />
                {t(label_bn, label_en)}
              </button>
            ))}
          </div>

          {/* Submit tab */}
          {tab === 'submit' && (
            <>
              {submittedTrackingId ? (
                <div className="card-base p-10 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={36} className="text-green-600" />
                  </div>
                  <h2 className="text-xl font-bold text-foreground mb-2">
                    {t('অভিযোগ জমা হয়েছে!', 'Complaint Submitted!')}
                  </h2>
                  <p className="text-sm text-muted-foreground mb-5">
                    {t('আপনার অভিযোগ সফলভাবে জমা হয়েছে। কর্তৃপক্ষ শীঘ্রই পর্যালোচনা করবেন।',
                      'Your complaint has been submitted. The authority will review it soon.')}
                  </p>
                  {/* Tracking ID */}
                  <div className="bg-primary/5 border border-primary/20 rounded-xl px-6 py-4 mb-6">
                    <p className="text-xs font-semibold text-muted-foreground mb-1">{t('আপনার Tracking ID', 'Your Tracking ID')}</p>
                    <p className="text-base font-bold font-mono text-primary tracking-wider break-all">{submittedTrackingId}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {t('এটি ডেটাবেজ রেকর্ড ID সংরক্ষণ করুন। অভিযোগের অবস্থা জানতে ব্যবহার করুন।',
                        'Save this database record ID to track your complaint status.')}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => { setTab('track'); }}
                      className="btn-outline flex-1"
                    >
                      <Search size={15} /> {t('অবস্থা জানুন', 'Track Status')}
                    </button>
                    <button
                      onClick={() => { setSubmittedTrackingId(null); setForm({ name: '', mobile: '', complaintType: 'student', subject: '', message: '' }); }}
                      className="btn-primary flex-1"
                    >
                      {t('আরেকটি অভিযোগ', 'Submit Another')}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="card-base p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <MessageSquare size={22} className="text-primary" />
                    <h2 className="text-xl font-bold text-foreground">{t('অভিযোগ ফর্ম', 'Complaint Form')}</h2>
                  </div>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label className="label-base">{t('আপনার নাম', 'Your Name')} *</label>
                      <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                        placeholder={t('নাম লিখুন', 'Enter your name')} className="input-base" required />
                    </div>
                    <div>
                      <label className="label-base">{t('মোবাইল নম্বর', 'Mobile Number')} *</label>
                      <input type="tel" value={form.mobile} onChange={e => setForm({ ...form, mobile: e.target.value })}
                        placeholder={t('মোবাইল নম্বর লিখুন', 'Enter mobile number')} className="input-base" required />
                    </div>
                    <div>
                      <label className="label-base">{t('অভিযোগকারীর ধরন', 'Complainant Type')} *</label>
                      <div className="grid grid-cols-2 gap-3 mt-1">
                        {([
                          { value: 'student', icon: GraduationCap, label_bn: 'শিক্ষার্থী', label_en: 'Student' },
                          { value: 'guardian', icon: Users, label_bn: 'অভিভাবক', label_en: 'Guardian' },
                        ] as const).map(opt => {
                          const Icon = opt.icon;
                          const isSelected = form.complaintType === opt.value;
                          return (
                            <button
                              key={opt.value}
                              type="button"
                              onClick={() => setForm({ ...form, complaintType: opt.value })}
                              className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border-2 text-sm font-semibold transition-all ${
                                isSelected
                                  ? 'border-primary bg-primary/5 text-primary'
                                  : 'border-border bg-white text-muted-foreground hover:border-primary/40'
                              }`}
                            >
                              <Icon size={16} className={isSelected ? 'text-primary' : 'text-muted-foreground'} />
                              {t(opt.label_bn, opt.label_en)}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    <div>
                      <label className="label-base">{t('বিষয়', 'Subject')} *</label>
                      <input type="text" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })}
                        placeholder={t('অভিযোগের বিষয় লিখুন', 'Enter complaint subject')} className="input-base" required />
                    </div>
                    <div>
                      <label className="label-base">{t('বার্তা', 'Message')} *</label>
                      <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                        placeholder={t('আপনার অভিযোগ বিস্তারিত লিখুন', 'Describe your complaint in detail')}
                        rows={5} className="input-base resize-none" required />
                    </div>
                    <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-60">
                      {submitting ? t('জমা হচ্ছে...', 'Submitting...') : t('অভিযোগ জমা দিন', 'Submit Complaint')}
                    </button>
                  </form>
                </div>
              )}
            </>
          )}

          {/* Track tab */}
          {tab === 'track' && (
            <div className="card-base p-6">
              <div className="flex items-center gap-3 mb-5">
                <Search size={20} className="text-primary" />
                <h2 className="text-lg font-bold text-foreground">{t('আমার অভিযোগ', 'My Complaints')}</h2>
              </div>
              <MyComplaints />
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
