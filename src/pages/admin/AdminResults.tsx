import { useMemo, useRef, useState } from 'react';
import {
  Plus, Edit2, Trash2, X, Check, Eye, EyeOff, Send, BookOpen, ArrowLeft, List,
  FileText, Search, Copy,
} from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import { useData } from '@/contexts/DataContext';
import { generateId } from '@/lib/storage';
import { getTotals, getGrade } from '@/lib/grade';
import NumberInput from '@/components/features/NumberInput';
import { toast } from 'sonner';
import { createPortal } from 'react-dom';
import type { Result, ResultEntry, ClassItem } from '@/types';

type EntryDraft = { subject: string; marks: number | ''; totalMarks: number | '' };

const byRoll = (a: Result, b: Result) => a.roll.localeCompare(b.roll, undefined, { numeric: true });

// ────────────────────────────────────────────────────────────────────────────
// View Result Modal
// ────────────────────────────────────────────────────────────────────────────
function ViewResultModal({ result, onClose }: { result: Result; onClose: () => void }) {
  const { obtained, total, pct } = getTotals(result.entries);
  const grade = getGrade(pct).grade;

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
                  <span className="text-base font-bold text-primary">{obtained} / {total}</span>
                  <span className="text-xs bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded-full">{Math.round(pct)}%</span>
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
//   • New result → subjects are pre-filled from the previous student of the class,
//     or from the Subjects list — no need to re-type them every time.
//   • "Save & Next" keeps the subjects, clears name/marks and bumps the roll number.
// ────────────────────────────────────────────────────────────────────────────
function ResultFormModal({
  cls, editing, onClose, onSave,
}: {
  cls: ClassItem;
  editing: Result | null;
  onClose: () => void;
  onSave: (result: Result, isEdit: boolean) => Promise<void>;
}) {
  const { data } = useData();
  const nameRef = useRef<HTMLInputElement>(null);

  // Most recently added result of this class (used as a subject template)
  const previous = useMemo(() => {
    const list = data.results
      .filter(r => r.classId === cls.id && r.entries.length > 0 && r.id !== editing?.id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return list[0] || null;
  }, [data.results, cls.id, editing?.id]);

  // Subjects of this class + subjects that are not tied to any class
  const subjectPool = useMemo(
    () => data.subjects.filter(s => !s.classId || s.classId === cls.id),
    [data.subjects, cls.id]
  );

  const templateFromPrevious = (): EntryDraft[] =>
    (previous?.entries || []).map(e => ({ subject: e.subject, marks: '', totalMarks: e.totalMarks }));
  const templateFromSubjects = (): EntryDraft[] =>
    subjectPool.map(s => ({ subject: s.name_bn, marks: '', totalMarks: 100 }));

  const [saving, setSaving] = useState(false);
  const [bulkTotal, setBulkTotal] = useState<number | ''>('');
  const [form, setForm] = useState<{ studentName_bn: string; studentName_en: string; roll: string; entries: EntryDraft[] }>(() => ({
    studentName_bn: editing?.studentName_bn || '',
    studentName_en: editing?.studentName_en || '',
    roll: editing?.roll || '',
    entries: editing
      ? editing.entries.map(e => ({ ...e }))
      : previous ? templateFromPrevious() : templateFromSubjects(),
  }));

  const addEntry = () => setForm(p => ({ ...p, entries: [...p.entries, { subject: '', marks: '', totalMarks: 100 }] }));
  const removeEntry = (i: number) => setForm(p => ({ ...p, entries: p.entries.filter((_, idx) => idx !== i) }));
  const updateEntry = (i: number, patch: Partial<EntryDraft>) =>
    setForm(p => ({ ...p, entries: p.entries.map((e, idx) => (idx === i ? { ...e, ...patch } : e)) }));

  const applyPrevious = () => setForm(p => ({ ...p, entries: templateFromPrevious() }));
  const addFromSubjectList = () => {
    const have = new Set(form.entries.map(e => e.subject.trim()));
    const extra = templateFromSubjects().filter(e => !have.has(e.subject.trim()));
    if (extra.length === 0) { toast.info('Subjects list থেকে নতুন কোনো বিষয় নেই'); return; }
    setForm(p => ({ ...p, entries: [...p.entries.filter(e => e.subject.trim() || e.marks !== ''), ...extra] }));
  };
  const applyBulkTotal = () => {
    if (bulkTotal === '' || bulkTotal <= 0) return;
    setForm(p => ({ ...p, entries: p.entries.map(e => ({ ...e, totalMarks: bulkTotal })) }));
  };

  const handleSave = async (addNext: boolean) => {
    if (!form.studentName_bn.trim() || !form.roll.trim()) { toast.error('নাম ও রোল নম্বর আবশ্যক (Name and Roll are required)'); return; }

    const dup = data.results.find(r => r.classId === cls.id && r.roll.trim() === form.roll.trim() && r.id !== editing?.id);
    if (dup) { toast.error(`রোল ${form.roll} এই ক্লাসে আগেই আছে (${dup.studentName_bn})`); return; }

    const rows = form.entries.filter(e => e.subject.trim() || e.marks !== '');
    if (rows.some(e => !e.subject.trim())) { toast.error('কোনো বিষয়ের নাম ফাঁকা আছে'); return; }
    const over = rows.find(e => e.marks !== '' && Number(e.marks) > Number(e.totalMarks || 100));
    if (over) { toast.error(`"${over.subject}" এর প্রাপ্ত নম্বর পূর্ণমানের চেয়ে বেশি`); return; }
    const blank = rows.filter(e => e.marks === '').length;
    if (blank > 0 && !confirm(`${blank} টি বিষয়ে নম্বর ফাঁকা — সেগুলো 0 ধরা হবে। এগিয়ে যাবেন?`)) return;

    const normalised: ResultEntry[] = rows.map(e => ({
      subject: e.subject.trim(),
      marks: e.marks === '' ? 0 : Number(e.marks),
      totalMarks: e.totalMarks === '' ? 100 : Number(e.totalMarks),
    }));

    const result: Result = {
      id: editing?.id || generateId(),
      studentName_bn: form.studentName_bn.trim(),
      studentName_en: form.studentName_en.trim(),
      classId: cls.id,
      className: cls.name_bn,
      roll: form.roll.trim(),
      entries: normalised,
      published: editing ? editing.published : false,
      createdAt: editing?.createdAt || new Date().toISOString(),
    };

    setSaving(true);
    try {
      await onSave(result, !!editing);
      if (editing || !addNext) {
        toast.success(editing ? 'Result updated' : 'Result saved as draft');
        onClose();
      } else {
        toast.success(`${result.studentName_bn} — saved`);
        const n = Number(form.roll);
        setForm(p => ({
          studentName_bn: '',
          studentName_en: '',
          roll: /^\d+$/.test(p.roll.trim()) && !isNaN(n) ? String(n + 1) : '',
          entries: p.entries.map(e => ({ ...e, marks: '' })),
        }));
        setTimeout(() => nameRef.current?.focus(), 50);
      }
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  return createPortal(
    // Backdrop click intentionally does NOT close the form, so typed data is never lost by accident.
    <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-2xl">
        <div className="p-5 border-b border-border flex items-center justify-between sticky top-0 bg-white z-10">
          <div>
            <h3 className="font-bold">{editing ? 'Edit Result' : 'Add Result'}</h3>
            <p className="text-xs text-primary font-semibold mt-0.5">{cls.name_bn}</p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-secondary rounded-lg" aria-label="Close"><X size={18} /></button>
        </div>

        <div className="p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label-base">শিক্ষার্থীর নাম (বাংলা) *</label>
              <input ref={nameRef} value={form.studentName_bn} onChange={e => setForm(p => ({ ...p, studentName_bn: e.target.value }))} className="input-base" placeholder="নাম লিখুন" />
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
              <input value={form.roll} onChange={e => setForm(p => ({ ...p, roll: e.target.value }))} className="input-base" placeholder="যেমন: 101" inputMode="numeric" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
              <label className="label-base mb-0">বিষয় ও নম্বর ({form.entries.length})</label>
              <div className="flex items-center gap-3 flex-wrap">
                {previous && (
                  <button type="button" onClick={applyPrevious} className="text-xs text-primary flex items-center gap-1 font-semibold hover:underline" title="আগের শিক্ষার্থীর বিষয়গুলো ব্যবহার করুন">
                    <Copy size={13} /> আগের মতো
                  </button>
                )}
                {subjectPool.length > 0 && (
                  <button type="button" onClick={addFromSubjectList} className="text-xs text-primary flex items-center gap-1 font-semibold hover:underline">
                    <BookOpen size={13} /> Subject list থেকে
                  </button>
                )}
                <button type="button" onClick={addEntry} className="text-xs text-primary flex items-center gap-1 font-semibold hover:underline">
                  <Plus size={13} /> বিষয় যোগ
                </button>
              </div>
            </div>

            {/* Auto-complete for subject names */}
            <datalist id="subject-suggestions">
              {data.subjects.map(s => <option key={s.id} value={s.name_bn} />)}
            </datalist>

            {form.entries.length > 0 && (
              <div className="flex items-center gap-2 mb-2 text-xs text-muted-foreground">
                <span>সব বিষয়ের পূর্ণমান:</span>
                <NumberInput value={bulkTotal} onChange={setBulkTotal} min={1} placeholder="100" className="input-base !py-1 !px-2 w-20 text-sm" />
                <button type="button" onClick={applyBulkTotal} className="px-2.5 py-1 rounded-lg bg-secondary hover:bg-accent font-semibold text-foreground">Apply</button>
              </div>
            )}

            <div className="space-y-2">
              {form.entries.map((entry, i) => (
                <div key={i} className="flex flex-col sm:flex-row gap-2">
                  <input
                    list="subject-suggestions"
                    placeholder="বিষয়ের নাম"
                    value={entry.subject}
                    onChange={e => updateEntry(i, { subject: e.target.value })}
                    className="input-base w-full sm:flex-1 min-w-0"
                  />
                  <div className="flex gap-2 items-center">
                    <NumberInput
                      placeholder="নম্বর"
                      value={entry.marks}
                      onChange={v => updateEntry(i, { marks: v })}
                      className="input-base w-full sm:w-24" min={0}
                    />
                    <NumberInput
                      placeholder="পূর্ণমান"
                      value={entry.totalMarks}
                      onChange={v => updateEntry(i, { totalMarks: v })}
                      className="input-base w-full sm:w-24" min={1}
                    />
                    <button type="button" onClick={() => removeEntry(i)} className="p-2 text-destructive hover:bg-red-50 rounded-lg shrink-0" aria-label="Remove subject"><X size={15} /></button>
                  </div>
                </div>
              ))}
              {form.entries.length === 0 && (
                <p className="text-sm text-muted-foreground py-3 text-center bg-secondary rounded-lg">উপরের বাটনে ক্লিক করে বিষয় যোগ করুন</p>
              )}
            </div>
          </div>

          {!editing && (
            <p className="text-xs text-muted-foreground bg-amber-50 border border-amber-200 rounded-lg px-4 py-2.5">
              ⚠ নতুন ফলাফল ড্রাফট হিসেবে সংরক্ষিত হবে। পরে Publish করুন। <b>Save &amp; Next</b> চাপলে বিষয়গুলো থেকে যাবে, রোল +১ হবে।
            </p>
          )}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            {!editing && (
              <button onClick={() => handleSave(true)} disabled={saving} className="btn-primary flex-1 disabled:opacity-60">
                <Check size={15} /> {saving ? 'Saving...' : 'Save & Next'}
              </button>
            )}
            <button
              onClick={() => handleSave(false)}
              disabled={saving}
              className={`${editing ? 'btn-primary' : 'btn-outline'} flex-1 disabled:opacity-60`}
            >
              {editing ? <><Check size={15} /> {saving ? 'Saving...' : 'Update'}</> : 'Save & Close'}
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
function ClassResultsView({ cls, onBack }: { cls: ClassItem; onBack: () => void }) {
  const { data, saveResult, deleteResult, deleteResults, setResultsPublished } = useData();
  const [tab, setTab] = useState<'all' | 'draft' | 'published'>('all');
  const [query, setQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Result | null>(null);
  const [viewing, setViewing] = useState<Result | null>(null);
  const [busy, setBusy] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const allResults = data.results.filter(r => r.classId === cls.id);
  const drafts = allResults.filter(r => !r.published);
  const published = allResults.filter(r => r.published);

  const displayed = useMemo(() => {
    const base = tab === 'draft' ? drafts : tab === 'published' ? published : allResults;
    const q = query.trim().toLowerCase();
    const filtered = q
      ? base.filter(r => `${r.studentName_bn} ${r.studentName_en} ${r.roll}`.toLowerCase().includes(q))
      : base;
    return [...filtered].sort(byRoll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.results, cls.id, tab, query]);

  const selectedIds = displayed.filter(r => selected.has(r.id)).map(r => r.id);
  const allSelected = displayed.length > 0 && selectedIds.length === displayed.length;

  const toggleOne = (id: string) =>
    setSelected(prev => { const n = new Set(prev); if (n.has(id)) n.delete(id); else n.add(id); return n; });
  const toggleAll = () =>
    setSelected(allSelected ? new Set() : new Set(displayed.map(r => r.id)));

  const run = async (fn: () => Promise<void>, okMsg: string) => {
    setBusy(true);
    try { await fn(); toast.success(okMsg); setSelected(new Set()); }
    catch (e: unknown) { toast.error(e instanceof Error ? e.message : 'Failed'); }
    finally { setBusy(false); }
  };

  const handleTogglePublish = (r: Result) =>
    run(() => setResultsPublished([r.id], !r.published), r.published ? 'Unpublished' : 'Published');

  const handlePublishAllDrafts = () => {
    if (drafts.length === 0) { toast.info('কোনো ড্রাফট নেই'); return; }
    if (!confirm(`${cls.name_bn} এর ${drafts.length} টি ড্রাফট ফলাফল Publish করবেন?`)) return;
    run(() => setResultsPublished(drafts.map(r => r.id), true), `${drafts.length} টি ফলাফল Publish হয়েছে`);
  };

  const handleBulk = (publish: boolean) => {
    if (selectedIds.length === 0) return;
    run(() => setResultsPublished(selectedIds, publish), `${selectedIds.length} টি ${publish ? 'Publish' : 'Unpublish'} হয়েছে`);
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;
    if (!confirm(`নির্বাচিত ${selectedIds.length} টি ফলাফল মুছে ফেলবেন? এটি ফেরানো যাবে না।`)) return;
    run(() => deleteResults(selectedIds), `${selectedIds.length} টি মুছে ফেলা হয়েছে`);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this result?')) return;
    try { await deleteResult(id); toast.success('Deleted'); }
    catch (e: unknown) { toast.error(e instanceof Error ? e.message : 'Delete failed'); }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 rounded-xl hover:bg-secondary transition-colors" aria-label="Back">
            <ArrowLeft size={18} className="text-foreground" />
          </button>
          <div>
            <h2 className="text-xl font-bold text-foreground">{cls.name_bn}</h2>
            <p className="text-xs text-muted-foreground">{cls.name_en || 'Result Management'}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {drafts.length > 0 && (
            <button
              onClick={handlePublishAllDrafts}
              disabled={busy}
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

      {/* Tabs + search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex gap-2 flex-wrap">
          {([
            { key: 'all', label: `সব (${allResults.length})` },
            { key: 'draft', label: `Draft (${drafts.length})` },
            { key: 'published', label: `Published (${published.length})` },
          ] as const).map(t => (
            <button
              key={t.key}
              onClick={() => { setTab(t.key); setSelected(new Set()); }}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${tab === t.key ? 'bg-primary text-primary-foreground shadow-sm' : 'bg-secondary text-foreground hover:bg-accent'}`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-64">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="নাম বা রোল খুঁজুন..." className="input-base !pl-9 !py-2 text-sm" />
        </div>
      </div>

      {/* Bulk action bar */}
      {selectedIds.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap bg-primary/5 border border-primary/20 rounded-xl px-4 py-3">
          <span className="text-sm font-semibold text-primary mr-auto">{selectedIds.length} টি নির্বাচিত</span>
          <button disabled={busy} onClick={() => handleBulk(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold disabled:opacity-60">
            <Send size={13} /> Publish
          </button>
          <button disabled={busy} onClick={() => handleBulk(false)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary text-foreground text-xs font-semibold disabled:opacity-60">
            <EyeOff size={13} /> Unpublish
          </button>
          <button disabled={busy} onClick={handleBulkDelete} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-destructive text-xs font-semibold disabled:opacity-60">
            <Trash2 size={13} /> Delete
          </button>
          <button onClick={() => setSelected(new Set())} className="p-1.5 rounded-lg hover:bg-secondary" aria-label="Clear selection"><X size={14} /></button>
        </div>
      )}

      <div className="card-base overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary">
              <tr>
                <th className="pl-5 py-3 w-8">
                  <input type="checkbox" checked={allSelected} onChange={toggleAll} className="w-4 h-4 accent-primary" aria-label="Select all" />
                </th>
                <th className="text-left px-4 py-3 font-semibold">Student</th>
                <th className="text-left px-4 py-3 font-semibold">Roll</th>
                <th className="text-center px-4 py-3 font-semibold">Subjects</th>
                <th className="text-center px-4 py-3 font-semibold">Status</th>
                <th className="text-right px-5 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {displayed.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-muted-foreground">
                    {query ? 'কোনো মিল পাওয়া যায়নি' : tab === 'draft' ? 'কোনো ড্রাফট নেই' : tab === 'published' ? 'কোনো প্রকাশিত ফলাফল নেই' : 'এই ক্লাসে কোনো ফলাফল নেই'}
                  </td>
                </tr>
              ) : displayed.map(r => (
                <tr key={r.id} className={`transition-colors ${selected.has(r.id) ? 'bg-primary/5' : 'hover:bg-secondary/40'}`}>
                  <td className="pl-5 py-4">
                    <input type="checkbox" checked={selected.has(r.id)} onChange={() => toggleOne(r.id)} className="w-4 h-4 accent-primary" aria-label="Select" />
                  </td>
                  <td className="px-4 py-4">
                    <p className="font-semibold text-foreground">{r.studentName_bn}</p>
                    {r.studentName_en && <p className="text-xs text-muted-foreground">{r.studentName_en}</p>}
                  </td>
                  <td className="px-4 py-4 font-medium">{r.roll}</td>
                  <td className="px-4 py-4 text-center">
                    <span className="text-xs font-semibold text-muted-foreground bg-secondary px-2 py-1 rounded-full">{r.entries.length}</span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className={r.published ? 'badge-green' : 'badge-yellow'}>{r.published ? 'Published' : 'Draft'}</span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1.5">
                      <button onClick={() => setViewing(r)} className="p-1.5 hover:bg-secondary rounded-lg" title="View">
                        <Eye size={15} className="text-blue-500" />
                      </button>
                      <button disabled={busy} onClick={() => handleTogglePublish(r)} className="p-1.5 hover:bg-secondary rounded-lg disabled:opacity-50" title={r.published ? 'Unpublish' : 'Publish'}>
                        {r.published ? <EyeOff size={15} className="text-muted-foreground" /> : <Send size={15} className="text-primary" />}
                      </button>
                      <button onClick={() => { setEditing(r); setShowForm(true); }} className="p-1.5 hover:bg-secondary rounded-lg" title="Edit">
                        <Edit2 size={15} className="text-primary" />
                      </button>
                      <button onClick={() => handleDelete(r.id)} className="p-1.5 hover:bg-red-50 rounded-lg" title="Delete">
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
  cls, onOpen, onAddResult,
}: {
  cls: ClassItem;
  onOpen: () => void;
  onAddResult: () => void;
}) {
  const { data, setResultsPublished } = useData();
  const [publishing, setPublishing] = useState(false);

  const results = data.results.filter(r => r.classId === cls.id);
  const drafts = results.filter(r => !r.published);
  const published = results.filter(r => r.published);

  const handlePublishAll = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (drafts.length === 0) { toast.info('কোনো ড্রাফট নেই'); return; }
    setPublishing(true);
    try {
      await setResultsPublished(drafts.map(r => r.id), true);
      toast.success(`${cls.name_bn}: ${drafts.length} টি ফলাফল Publish হয়েছে`);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed');
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="card-base overflow-hidden hover:border-primary/30 hover:shadow-md transition-all duration-200">
      <div className="h-1 bg-gradient-to-r from-primary via-green-400 to-primary/50" />
      <div className="p-5">
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
          <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full">{results.length} Results</span>
        </div>

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
            <div className="col-span-2 text-center text-xs text-muted-foreground py-1.5 bg-secondary rounded-xl">কোনো ফলাফল নেই</div>
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
  const { data, saveResult, setResultsPublished } = useData();
  const [openClassId, setOpenClassId] = useState<string | null>(null);
  const [addForClass, setAddForClass] = useState<ClassItem | null>(null);
  const [publishingAll, setPublishingAll] = useState(false);

  const sortedClasses = [...data.classes].sort((a, b) => a.order - b.order);
  const allDrafts = data.results.filter(r => !r.published);

  const handlePublishEverything = async () => {
    if (allDrafts.length === 0) { toast.info('কোনো ড্রাফট নেই'); return; }
    if (!confirm(`সব ক্লাসের মোট ${allDrafts.length} টি ড্রাফট ফলাফল একসাথে Publish করবেন?`)) return;
    setPublishingAll(true);
    try {
      await setResultsPublished(allDrafts.map(r => r.id), true);
      toast.success(`${allDrafts.length} টি ফলাফল Publish হয়েছে`);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Failed');
    } finally {
      setPublishingAll(false);
    }
  };

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
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <h2 className="text-xl font-bold">Result Management</h2>
            <p className="text-sm text-muted-foreground mt-0.5">ক্লাস অনুযায়ী ফলাফল পরিচালনা করুন</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-muted-foreground bg-secondary px-3 py-1.5 rounded-full font-medium">
              <FileText size={11} className="inline mr-1" />
              {data.results.length} Total Results
            </span>
            {allDrafts.length > 0 && (
              <button
                onClick={handlePublishEverything}
                disabled={publishingAll}
                className="flex items-center gap-1.5 py-2 px-4 text-sm font-semibold rounded-xl bg-primary text-primary-foreground hover:brightness-110 transition-all disabled:opacity-60"
              >
                <Send size={14} /> {publishingAll ? 'Publishing...' : `Publish All Drafts (${allDrafts.length})`}
              </button>
            )}
          </div>
        </div>

        {data.results.length > 0 && (
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'মোট ফলাফল', value: data.results.length, color: 'bg-secondary' },
              { label: 'Draft', value: allDrafts.length, color: 'bg-amber-50' },
              { label: 'Published', value: data.results.length - allDrafts.length, color: 'bg-green-50' },
            ].map((s, i) => (
              <div key={i} className={`${s.color} rounded-xl p-3 text-center`}>
                <p className="text-xl font-bold text-foreground">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        )}

        {sortedClasses.length === 0 ? (
          <div className="text-center py-16 bg-secondary rounded-2xl">
            <BookOpen size={44} className="text-muted-foreground mx-auto mb-3" />
            <p className="font-semibold text-foreground mb-1">কোনো ক্লাস নেই</p>
            <p className="text-sm text-muted-foreground">Admin → Classes থেকে ক্লাস তৈরি করুন।</p>
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
