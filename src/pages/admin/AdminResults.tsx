import { useState } from 'react';
import { Plus, Edit2, Trash2, X, Check, Eye, EyeOff, Send, BookOpen, ChevronRight, ArrowLeft, List, FileText } from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import { useData } from '@/contexts/DataContext';
import { generateId } from '@/lib/storage';
import { toast } from 'sonner';
import { createPortal } from 'react-dom';
import type { Result, ResultEntry, ClassItem } from '@/types';

// ────────────────────────────────────────────────────────────────────────────
// View Result Modal
// ────────────────────────────────────────────────────────────────────────────
function ViewResultModal({ result, onClose }: { result: Result; onClose: () => void }) {
  const totalObtained = result.entries.reduce((s, e) => s + Number(e.marks), 0);
  const totalMax = result.entries.reduce((s, e) => s + Number(e.totalMarks), 0);
  const pct = totalMax > 0 ? Math.round((totalObtained / totalMax) * 100) : 0;
  const grade = pct >= 80 ? 'A+' : pct >= 70 ? 'A' : pct >= 60 ? 'A-' : pct >= 50 ? 'B' : pct >= 40 ? 'C' : pct >= 33 ? 'D' : 'F';

  return createPortal(
    <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b border-border px-6 py-4 flex items-center justify-between z-10">
          <h3 className="font-bold text-base">Result Details</h3>
          <button onClick={onClose} className="p-1.5 hover:bg-secondary rounded-lg"><X size={18} /></button>
        </div>
        <div className="p-6 space-y-4">
          <div className="bg-secondary rounded-xl p-4 space-y-2">
            {[
              { label: 'শিক্ষার্থীর নাম', value: result.studentName_bn },
              result.studentName_en ? { label: 'Student Name (EN)', value: result.studentName_en } : null,
              { label: 'ক্লাস', value: result.className },
              { label: 'রোল নম্বর', value: result.roll },
              { label: 'Status', value: result.published ? '✅ Published' : '📝 Draft' },
            ].filter(Boolean).map((item, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-muted-foreground font-medium">{item!.label}</span>
                <span className="font-semibold text-foreground">{item!.value}</span>
              </div>
            ))}
          </div>
          {result.entries.length > 0 ? (
            <div className="rounded-xl border border-border overflow-hidden">
              <div className="bg-secondary px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">বিষয়ভিত্তিক নম্বর</div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-secondary/50 border-b border-border">
                    <th className="text-left px-4 py-2 font-semibold text-muted-foreground">বিষয়</th>
                    <th className="text-center px-4 py-2 font-semibold text-muted-foreground">প্রাপ্ত</th>
                    <th className="text-center px-4 py-2 font-semibold text-muted-foreground">পূর্ণমান</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {result.entries.map((entry, i) => (
                    <tr key={i} className="hover:bg-secondary/30">
                      <td className="px-4 py-2.5 font-medium">{entry.subject || '—'}</td>
                      <td className="px-4 py-2.5 text-center font-bold text-primary">{entry.marks}</td>
                      <td className="px-4 py-2.5 text-center text-muted-foreground">{entry.totalMarks}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="bg-primary/5 px-4 py-3 flex items-center justify-between border-t border-border">
                <span className="text-sm font-bold text-foreground">মোট নম্বর</span>
                <div className="flex items-center gap-3">
                  <span className="text-base font-bold text-primary">{totalObtained} / {totalMax}</span>
                  <span className="text-xs bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded-full">{pct}%</span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary text-primary-foreground">{grade}</span>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-center text-sm text-muted-foreground py-4 bg-secondary rounded-xl">কোনো বিষয় যোগ করা হয়নি।</p>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Add / Edit Result Modal
// ────────────────────────────────────────────────────────────────────────────
function ResultFormModal({
  cls, editing, onClose, onSave,
}: {
  cls: ClassItem;
  editing: Result | null;
  onClose: () => void;
  onSave: (result: Result, isEdit: boolean) => Promise<void>;
}) {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    studentName_bn: editing?.studentName_bn || '',
    studentName_en: editing?.studentName_en || '',
    roll: editing?.roll || '',
    entries: editing ? editing.entries.map(e => ({ ...e })) : [] as ResultEntry[],
  });

  const addEntry = () => setForm(p => ({ ...p, entries: [...p.entries, { subject: '', marks: '' as unknown as number, totalMarks: 100 }] }));
  const removeEntry = (i: number) => setForm(p => ({ ...p, entries: p.entries.filter((_, idx) => idx !== i) }));
  const updateEntry = (i: number, field: keyof ResultEntry, value: string | number) =>
    setForm(p => ({ ...p, entries: p.entries.map((e, idx) => idx === i ? { ...e, [field]: value } : e) }));

  const handleSave = async () => {
    if (!form.studentName_bn || !form.roll) { toast.error('Name and Roll are required'); return; }
    const normalisedEntries: ResultEntry[] = form.entries.map(e => ({
      subject: e.subject,
      marks: e.marks === ('' as unknown as number) ? 0 : Number(e.marks),
      totalMarks: e.totalMarks === ('' as unknown as number) ? 100 : Number(e.totalMarks),
    }));
    const result: Result = {
      id: editing?.id || generateId(),
      studentName_bn: form.studentName_bn,
      studentName_en: form.studentName_en,
      classId: cls.id,
      className: cls.name_bn,
      roll: form.roll,
      entries: normalisedEntries,
      published: editing ? editing.published : false,
      createdAt: editing?.createdAt || new Date().toISOString(),
    };
    setSaving(true);
    try {
      await onSave(result, !!editing);
      toast.success(editing ? 'Result updated' : 'Result saved as draft');
      onClose();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="p-5 border-b border-border flex items-center justify-between sticky top-0 bg-white z-10">
          <div>
            <h3 className="font-bold">{editing ? 'Edit Result' : 'Add Result'}</h3>
            <p className="text-xs text-primary font-semibold mt-0.5">{cls.name_bn}</p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-secondary rounded-lg"><X size={18} /></button>
        </div>
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-base">শিক্ষার্থীর নাম (বাংলা) *</label>
              <input value={form.studentName_bn} onChange={e => setForm(p => ({ ...p, studentName_bn: e.target.value }))} className="input-base" placeholder="নাম লিখুন" />
            </div>
            <div>
              <label className="label-base">Student Name (EN)</label>
              <input value={form.studentName_en} onChange={e => setForm(p => ({ ...p, studentName_en: e.target.value }))} className="input-base" placeholder="English name" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-base">ক্লাস</label>
              <input value={cls.name_bn} disabled className="input-base bg-secondary cursor-not-allowed text-muted-foreground" />
            </div>
            <div>
              <label className="label-base">রোল নম্বর *</label>
              <input value={form.roll} onChange={e => setForm(p => ({ ...p, roll: e.target.value }))} className="input-base" placeholder="যেমন: 101" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="label-base mb-0">বিষয় ও নম্বর</label>
              <button onClick={addEntry} className="text-xs text-primary flex items-center gap-1 font-semibold hover:underline">
                <Plus size={13} /> বিষয় যোগ করুন
              </button>
            </div>
            <div className="space-y-2">
              {form.entries.map((entry, i) => (
                <div key={i} className="flex flex-col sm:flex-row gap-2">
                  <input
                    placeholder="বিষয়ের নাম"
                    value={entry.subject}
                    onChange={e => updateEntry(i, 'subject', e.target.value)}
                    className="input-base w-full sm:flex-1 min-w-0"
                  />
                  <div className="flex gap-2 items-center">
                    <input
                      type="number" placeholder="নম্বর"
                      value={entry.marks === ('' as unknown as number) ? '' : entry.marks}
                      onChange={e => updateEntry(i, 'marks', e.target.value === '' ? ('' as unknown as number) : Number(e.target.value))}
                      className="input-base w-full sm:w-24" min={0}
                    />
                    <input
                      type="number" placeholder="পূর্ণমান"
                      value={entry.totalMarks === ('' as unknown as number) ? '' : entry.totalMarks}
                      onChange={e => updateEntry(i, 'totalMarks', e.target.value === '' ? ('' as unknown as number) : Number(e.target.value))}
                      className="input-base w-full sm:w-24" min={1}
                    />
                    <button onClick={() => removeEntry(i)} className="p-2 text-destructive hover:bg-red-50 rounded-lg shrink-0"><X size={15} /></button>
                  </div>
                </div>
              ))}
              {form.entries.length === 0 && (
                <p className="text-sm text-muted-foreground py-3 text-center bg-secondary rounded-lg">উপরের বাটনে ক্লিক করে বিষয় যোগ করুন</p>
              )}
            </div>
          </div>

          <p className="text-xs text-muted-foreground bg-amber-50 border border-amber-200 rounded-lg px-4 py-2.5">
            ⚠ নতুন ফলাফল ড্রাফট হিসেবে সংরক্ষিত হবে। পরে Publish করুন।
          </p>
          <div className="flex gap-3 pt-2">
            <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 disabled:opacity-60">
              <Check size={15} /> {saving ? 'Saving...' : editing ? 'Update' : 'Save Draft'}
            </button>
            <button onClick={onClose} className="btn-outline flex-1">Cancel</button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Class Results Detail View (when a class card is opened)
// ────────────────────────────────────────────────────────────────────────────
function ClassResultsView({
  cls, onBack,
}: {
  cls: ClassItem;
  onBack: () => void;
}) {
  const { data, saveResult, deleteResult, toggleResultPublished } = useData();
  const [tab, setTab] = useState<'all' | 'draft' | 'published'>('all');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Result | null>(null);
  const [viewing, setViewing] = useState<Result | null>(null);
  const [publishing, setPublishing] = useState(false);

  const allResults = data.results.filter(r => r.classId === cls.id);
  const drafts = allResults.filter(r => !r.published);
  const published = allResults.filter(r => r.published);
  const displayed = tab === 'draft' ? drafts : tab === 'published' ? published : allResults;

  const handleTogglePublish = async (id: string, current: boolean) => {
    try {
      await toggleResultPublished(id, !current);
      toast.success(!current ? 'Published' : 'Unpublished');
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Failed');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this result?')) return;
    try {
      await deleteResult(id);
      toast.success('Deleted');
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Delete failed');
    }
  };

  const handleBulkPublish = async () => {
    if (drafts.length === 0) { toast.info('No drafts to publish'); return; }
    if (!confirm(`Publish all ${drafts.length} draft results for ${cls.name_bn}?`)) return;
    setPublishing(true);
    try {
      await Promise.all(drafts.map(r => toggleResultPublished(r.id, true)));
      toast.success(`${drafts.length} results published`);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Failed');
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Back + header */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 rounded-xl hover:bg-secondary transition-colors">
            <ArrowLeft size={18} className="text-foreground" />
          </button>
          <div>
            <h2 className="text-xl font-bold text-foreground">{cls.name_bn}</h2>
            <p className="text-xs text-muted-foreground">{cls.name_en || 'Result Management'}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {drafts.length > 0 && (
            <button
              onClick={handleBulkPublish}
              disabled={publishing}
              className="flex items-center gap-1.5 py-2.5 px-4 text-sm font-semibold rounded-xl border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all disabled:opacity-60"
            >
              <Send size={15} /> Publish All Drafts ({drafts.length})
            </button>
          )}
          <button onClick={() => { setEditing(null); setShowForm(true); }} className="btn-primary text-sm py-2.5 px-4">
            <Plus size={16} /> Add Result
          </button>
        </div>
      </div>

      {/* Tab filter */}
      <div className="flex gap-2">
        {([
          { key: 'all', label: `সব (${allResults.length})` },
          { key: 'draft', label: `Draft (${drafts.length})` },
          { key: 'published', label: `Published (${published.length})` },
        ] as const).map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${tab === t.key ? 'bg-primary text-primary-foreground shadow-sm' : 'bg-secondary text-foreground hover:bg-accent'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Results table */}
      <div className="card-base overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary">
              <tr>
                <th className="text-left px-5 py-3 font-semibold">Student</th>
                <th className="text-left px-5 py-3 font-semibold">Roll</th>
                <th className="text-center px-5 py-3 font-semibold">Subjects</th>
                <th className="text-center px-5 py-3 font-semibold">Status</th>
                <th className="text-right px-5 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {displayed.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-muted-foreground">
                    {tab === 'draft' ? 'কোনো ড্রাফট নেই' : tab === 'published' ? 'কোনো প্রকাশিত ফলাফল নেই' : 'এই ক্লাসে কোনো ফলাফল নেই'}
                  </td>
                </tr>
              ) : displayed.map(r => (
                <tr key={r.id} className="hover:bg-secondary/40 transition-colors">
                  <td className="px-5 py-4">
                    <p className="font-semibold text-foreground">{r.studentName_bn}</p>
                    {r.studentName_en && <p className="text-xs text-muted-foreground">{r.studentName_en}</p>}
                  </td>
                  <td className="px-5 py-4 font-medium">{r.roll}</td>
                  <td className="px-5 py-4 text-center">
                    <span className="text-xs font-semibold text-muted-foreground bg-secondary px-2 py-1 rounded-full">{r.entries.length}</span>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <span className={r.published ? 'badge-green' : 'badge-yellow'}>{r.published ? 'Published' : 'Draft'}</span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1.5">
                      <button onClick={() => setViewing(r)} className="p-1.5 hover:bg-secondary rounded-lg" title="View">
                        <Eye size={15} className="text-blue-500" />
                      </button>
                      <button onClick={() => handleTogglePublish(r.id, r.published)} className="p-1.5 hover:bg-secondary rounded-lg" title={r.published ? 'Unpublish' : 'Publish'}>
                        {r.published ? <EyeOff size={15} className="text-muted-foreground" /> : <Send size={15} className="text-primary" />}
                      </button>
                      <button onClick={() => { setEditing(r); setShowForm(true); }} className="p-1.5 hover:bg-secondary rounded-lg">
                        <Edit2 size={15} className="text-primary" />
                      </button>
                      <button onClick={() => handleDelete(r.id)} className="p-1.5 hover:bg-red-50 rounded-lg">
                        <Trash2 size={15} className="text-destructive" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <ResultFormModal
          cls={cls}
          editing={editing}
          onClose={() => { setShowForm(false); setEditing(null); }}
          onSave={saveResult}
        />
      )}
      {viewing && <ViewResultModal result={viewing} onClose={() => setViewing(null)} />}
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Class Card
// ────────────────────────────────────────────────────────────────────────────
function ClassResultCard({
  cls,
  onOpen,
  onAddResult,
}: {
  cls: ClassItem;
  onOpen: () => void;
  onAddResult: () => void;
}) {
  const { data, toggleResultPublished, saveResult } = useData();
  const [publishing, setPublishing] = useState(false);

  const results = data.results.filter(r => r.classId === cls.id);
  const drafts = results.filter(r => !r.published);
  const published = results.filter(r => r.published);

  const handlePublishAll = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (drafts.length === 0) { toast.info('No drafts to publish'); return; }
    setPublishing(true);
    try {
      await Promise.all(drafts.map(r => toggleResultPublished(r.id, true)));
      toast.success(`${drafts.length} results published for ${cls.name_bn}`);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed');
    } finally {
      setPublishing(false);
    }
  };

  // Suppress unused variable warning
  void saveResult;

  return (
    <div className="card-base overflow-hidden hover:border-primary/30 hover:shadow-md transition-all duration-200">
      {/* Card top accent */}
      <div className="h-1 bg-gradient-to-r from-primary via-green-400 to-primary/50" />

      <div className="p-5">
        {/* Title row */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <BookOpen size={18} className="text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-foreground text-base leading-tight">{cls.name_bn}</h3>
              {cls.name_en && <p className="text-xs text-muted-foreground">{cls.name_en}</p>}
            </div>
          </div>
          <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full">
            {results.length} Results
          </span>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {[
            { label: 'Total', value: results.length, color: 'bg-secondary text-foreground' },
            { label: 'Draft', value: drafts.length, color: 'bg-amber-50 text-amber-700' },
            { label: 'Published', value: published.length, color: 'bg-green-50 text-green-700' },
          ].map((s, i) => (
            <div key={i} className={`${s.color} rounded-xl px-3 py-2.5 text-center`}>
              <p className="text-lg font-bold leading-none">{s.value}</p>
              <p className="text-xs font-medium mt-0.5 opacity-75">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={e => { e.stopPropagation(); onAddResult(); }}
            className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:brightness-110 transition-all"
          >
            <Plus size={13} /> Add Result
          </button>
          <button
            onClick={e => { e.stopPropagation(); onOpen(); }}
            className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-secondary text-foreground text-xs font-semibold hover:bg-accent transition-all"
          >
            <List size={13} /> View All
          </button>
          {drafts.length > 0 && (
            <button
              onClick={handlePublishAll}
              disabled={publishing}
              className="col-span-2 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border-2 border-primary text-primary text-xs font-semibold hover:bg-primary hover:text-white transition-all disabled:opacity-60"
            >
              <Send size={13} /> {publishing ? 'Publishing...' : `Publish ${drafts.length} Draft${drafts.length > 1 ? 's' : ''}`}
            </button>
          )}
          {results.length === 0 && (
            <div className="col-span-2 text-center text-xs text-muted-foreground py-1.5 bg-secondary rounded-xl">
              কোনো ফলাফল নেই
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Main Component — Cards View
// ────────────────────────────────────────────────────────────────────────────
export default function AdminResults() {
  const { data, saveResult } = useData();
  const [openClassId, setOpenClassId] = useState<string | null>(null);
  const [addForClass, setAddForClass] = useState<ClassItem | null>(null);

  const sortedClasses = [...data.classes].sort((a, b) => a.order - b.order);

  // If a class detail view is open
  if (openClassId) {
    const cls = data.classes.find(c => c.id === openClassId);
    if (cls) return (
      <AdminLayout>
        <ClassResultsView cls={cls} onBack={() => setOpenClassId(null)} />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <h2 className="text-xl font-bold">Result Management</h2>
            <p className="text-sm text-muted-foreground mt-0.5">ক্লাস অনুযায়ী ফলাফল পরিচালনা করুন</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground bg-secondary px-3 py-1.5 rounded-full font-medium">
              <FileText size={11} className="inline mr-1" />
              {data.results.length} Total Results
            </span>
          </div>
        </div>

        {/* Summary strip */}
        {data.results.length > 0 && (
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'মোট ফলাফল', value: data.results.length, color: 'bg-secondary' },
              { label: 'Draft', value: data.results.filter(r => !r.published).length, color: 'bg-amber-50' },
              { label: 'Published', value: data.results.filter(r => r.published).length, color: 'bg-green-50' },
            ].map((s, i) => (
              <div key={i} className={`${s.color} rounded-xl p-3 text-center`}>
                <p className="text-xl font-bold text-foreground">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Class cards grid */}
        {sortedClasses.length === 0 ? (
          <div className="text-center py-16 bg-secondary rounded-2xl">
            <BookOpen size={44} className="text-muted-foreground mx-auto mb-3" />
            <p className="font-semibold text-foreground mb-1">কোনো ক্লাস নেই</p>
            <p className="text-sm text-muted-foreground">
              Admin → Classes থেকে ক্লাস তৈরি করুন।
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedClasses.map(cls => (
              <ClassResultCard
                key={cls.id}
                cls={cls}
                onOpen={() => setOpenClassId(cls.id)}
                onAddResult={() => setAddForClass(cls)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Quick Add Modal (from card button) */}
      {addForClass && (
        <ResultFormModal
          cls={addForClass}
          editing={null}
          onClose={() => setAddForClass(null)}
          onSave={saveResult}
        />
      )}
    </AdminLayout>
  );
}
