import { useState } from 'react';
import { Plus, Edit2, Trash2, X, Check } from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import { useData } from '@/contexts/DataContext';
import { generateId } from '@/lib/storage';
import { toast } from 'sonner';
import type { ClassItem } from '@/types';
import NumberInput from '@/components/features/NumberInput';

export default function AdminClasses() {
  const { data, saveClass, deleteClass } = useData();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<ClassItem | null>(null);
  const [form, setForm] = useState<{ name_bn: string; name_en: string; order: number | '' }>({ name_bn: '', name_en: '', order: 0 });
  const [saving, setSaving] = useState(false);

  const openAdd = () => { setEditing(null); setForm({ name_bn: '', name_en: '', order: data.classes.length + 1 }); setShowForm(true); };
  const openEdit = (c: ClassItem) => { setEditing(c); setForm({ name_bn: c.name_bn, name_en: c.name_en, order: c.order }); setShowForm(true); };

  const handleSave = async () => {
    if (!form.name_bn) { toast.error('Name required'); return; }
    setSaving(true);
    try {
      await saveClass({ ...form, order: Number(form.order) || 0, id: editing?.id || generateId() }, !!editing);
      toast.success(editing ? 'Class updated' : 'Class added');
      setShowForm(false);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    const linked = data.results.filter(r => r.classId === id).length;
    if (!confirm(linked > 0
      ? `এই ক্লাসে ${linked} টি ফলাফল আছে। ক্লাস মুছলে সেগুলো আর ক্লাসের সাথে যুক্ত থাকবে না। তবুও মুছবেন?`
      : 'Delete this class?')) return;
    try {
      await deleteClass(id);
      toast.success('Deleted');
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Delete failed');
    }
  };

  const sorted = [...data.classes].sort((a, b) => a.order - b.order);

  return (
    <AdminLayout>
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Classes</h2>
          <button onClick={openAdd} className="btn-primary text-sm py-2.5 px-4"><Plus size={16} /> Add Class</button>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold">{editing ? 'Edit Class' : 'Add Class'}</h3>
                <button onClick={() => setShowForm(false)}><X size={18} /></button>
              </div>
              <div>
                <label className="label-base">নাম (বাংলা) *</label>
                <input value={form.name_bn} onChange={e => setForm(p => ({ ...p, name_bn: e.target.value }))} className="input-base" placeholder="দাখিল (৬ষ্ঠ)" />
              </div>
              <div>
                <label className="label-base">Name (English)</label>
                <input value={form.name_en} onChange={e => setForm(p => ({ ...p, name_en: e.target.value }))} className="input-base" placeholder="Dakhil (6th)" />
              </div>
              <div>
                <label className="label-base">Order</label>
                <NumberInput value={form.order} onChange={v => setForm(p => ({ ...p, order: v }))} className="input-base" />
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
                <th className="text-left px-5 py-3 font-semibold">Order</th>
                <th className="text-left px-5 py-3 font-semibold">নাম (বাংলা)</th>
                <th className="text-left px-5 py-3 font-semibold">Name (EN)</th>
                <th className="text-right px-5 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {sorted.length === 0 ? (
                <tr><td colSpan={4} className="text-center py-8 text-muted-foreground">No classes</td></tr>
              ) : sorted.map(c => (
                <tr key={c.id} className="hover:bg-secondary/40">
                  <td className="px-5 py-3 text-muted-foreground">{c.order}</td>
                  <td className="px-5 py-3 font-medium">{c.name_bn}</td>
                  <td className="px-5 py-3 text-muted-foreground">{c.name_en}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(c)} className="p-1.5 hover:bg-secondary rounded-lg"><Edit2 size={14} className="text-primary" /></button>
                      <button onClick={() => handleDelete(c.id)} className="p-1.5 hover:bg-red-50 rounded-lg"><Trash2 size={14} className="text-destructive" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
