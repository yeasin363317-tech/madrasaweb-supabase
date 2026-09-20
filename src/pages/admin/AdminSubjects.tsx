import { useState } from 'react';
import { Plus, Edit2, Trash2, X, Check } from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import { useData } from '@/contexts/DataContext';
import { generateId } from '@/lib/storage';
import { toast } from 'sonner';
import type { Subject } from '@/types';

export default function AdminSubjects() {
  const { data, saveSubject, deleteSubject } = useData();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Subject | null>(null);
  const [form, setForm] = useState({ name_bn: '', name_en: '', classId: '' });
  const [saving, setSaving] = useState(false);

  const openAdd = () => { setEditing(null); setForm({ name_bn: '', name_en: '', classId: '' }); setShowForm(true); };
  const openEdit = (s: Subject) => { setEditing(s); setForm({ name_bn: s.name_bn, name_en: s.name_en, classId: s.classId }); setShowForm(true); };

  const handleSave = async () => {
    if (!form.name_bn) { toast.error('Name required'); return; }
    setSaving(true);
    try {
      await saveSubject({ ...form, id: editing?.id || generateId() }, !!editing);
      toast.success(editing ? 'Updated' : 'Added');
      setShowForm(false);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete?')) return;
    try {
      await deleteSubject(id);
      toast.success('Deleted');
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Delete failed');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Subjects</h2>
          <button onClick={openAdd} className="btn-primary text-sm py-2.5 px-4"><Plus size={16} /> Add Subject</button>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold">{editing ? 'Edit Subject' : 'Add Subject'}</h3>
                <button onClick={() => setShowForm(false)}><X size={18} /></button>
              </div>
              <div>
                <label className="label-base">নাম (বাংলা) *</label>
                <input value={form.name_bn} onChange={e => setForm(p => ({ ...p, name_bn: e.target.value }))} className="input-base" />
              </div>
              <div>
                <label className="label-base">Name (EN)</label>
                <input value={form.name_en} onChange={e => setForm(p => ({ ...p, name_en: e.target.value }))} className="input-base" />
              </div>
              <div>
                <label className="label-base">Class (Optional)</label>
                <select value={form.classId} onChange={e => setForm(p => ({ ...p, classId: e.target.value }))} className="input-base">
                  <option value="">-- All Classes --</option>
                  {[...data.classes].sort((a, b) => a.order - b.order).map(c => (
                    <option key={c.id} value={c.id}>{c.name_bn}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3">
                <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 disabled:opacity-60">
                  <Check size={15} /> {saving ? 'Saving...' : 'Save'}
                </button>
                <button onClick={() => setShowForm(false)} className="btn-outline flex-1">Cancel</button>
              </div>
            </div>
          </div>
        )}

        <div className="card-base overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-secondary">
              <tr>
                <th className="text-left px-5 py-3 font-semibold">নাম (বাংলা)</th>
                <th className="text-left px-5 py-3 font-semibold">Name (EN)</th>
                <th className="text-left px-5 py-3 font-semibold">Class</th>
                <th className="text-right px-5 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {data.subjects.length === 0 ? (
                <tr><td colSpan={4} className="text-center py-8 text-muted-foreground">No subjects</td></tr>
              ) : data.subjects.map(s => {
                const cls = data.classes.find(c => c.id === s.classId);
                return (
                  <tr key={s.id} className="hover:bg-secondary/40">
                    <td className="px-5 py-3 font-medium">{s.name_bn}</td>
                    <td className="px-5 py-3 text-muted-foreground">{s.name_en}</td>
                    <td className="px-5 py-3 text-muted-foreground">{cls?.name_bn || 'All'}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEdit(s)} className="p-1.5 hover:bg-secondary rounded-lg"><Edit2 size={14} className="text-primary" /></button>
                        <button onClick={() => handleDelete(s.id)} className="p-1.5 hover:bg-red-50 rounded-lg"><Trash2 size={14} className="text-destructive" /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
