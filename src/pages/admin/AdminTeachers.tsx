import { useState } from 'react';
import { Plus, Edit2, Trash2, User, X, Check } from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import { useData } from '@/contexts/DataContext';
import { generateId } from '@/lib/storage';
import { toast } from 'sonner';
import FileUpload from '@/components/features/FileUpload';
import type { Teacher } from '@/types';

const emptyTeacher = (): Omit<Teacher, 'id' | 'createdAt'> => ({
  name_bn: '', name_en: '',
  designation_bn: '', designation_en: '',
  qualification_bn: '', qualification_en: '',
  mobile: '', email: '', about_bn: '', about_en: '', photo: '',
});

export default function AdminTeachers() {
  const { data, saveTeacher, deleteTeacher } = useData();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Teacher | null>(null);
  const [form, setForm] = useState(emptyTeacher());
  const [saving, setSaving] = useState(false);

  const openAdd = () => { setEditing(null); setForm(emptyTeacher()); setShowForm(true); };
  const openEdit = (t: Teacher) => { setEditing(t); setForm({ ...t }); setShowForm(true); };

  const handleSave = async () => {
    if (!form.name_bn) { toast.error('নাম আবশ্যক'); return; }
    setSaving(true);
    try {
      const teacher: Teacher = {
        ...form,
        id: editing?.id || generateId(),
        createdAt: editing?.createdAt || new Date().toISOString(),
      };
      await saveTeacher(teacher, !!editing);
      toast.success(editing ? 'Teacher updated' : 'Teacher added');
      setShowForm(false);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this teacher?')) return;
    try {
      await deleteTeacher(id);
      toast.success('Teacher deleted');
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Delete failed');
    }
  };

  const f = (key: keyof typeof form, val: string) => setForm(p => ({ ...p, [key]: val }));

  return (
    <AdminLayout>
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">Teachers</h2>
          <button onClick={openAdd} className="btn-primary text-sm py-2.5 px-4">
            <Plus size={16} /> Add Teacher
          </button>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="p-6 border-b border-border flex items-center justify-between sticky top-0 bg-white z-10">
                <h3 className="text-lg font-bold">{editing ? 'Edit Teacher' : 'Add Teacher'}</h3>
                <button onClick={() => setShowForm(false)} className="p-2 hover:bg-secondary rounded-lg"><X size={18} /></button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label-base">নাম (বাংলা) *</label>
                    <input value={form.name_bn} onChange={e => f('name_bn', e.target.value)} className="input-base" placeholder="মাওলানা..." />
                  </div>
                  <div>
                    <label className="label-base">Name (English)</label>
                    <input value={form.name_en} onChange={e => f('name_en', e.target.value)} className="input-base" placeholder="Mawlana..." />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label-base">পদবী (বাংলা)</label>
                    <input value={form.designation_bn} onChange={e => f('designation_bn', e.target.value)} className="input-base" placeholder="সহকারী অধ্যাপক..." />
                  </div>
                  <div>
                    <label className="label-base">Designation (English)</label>
                    <input value={form.designation_en} onChange={e => f('designation_en', e.target.value)} className="input-base" placeholder="Assistant Professor..." />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label-base">যোগ্যতা (বাংলা)</label>
                    <input value={form.qualification_bn} onChange={e => f('qualification_bn', e.target.value)} className="input-base" />
                  </div>
                  <div>
                    <label className="label-base">Qualification (EN)</label>
                    <input value={form.qualification_en} onChange={e => f('qualification_en', e.target.value)} className="input-base" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label-base">Mobile</label>
                    <input value={form.mobile} onChange={e => f('mobile', e.target.value)} className="input-base" placeholder="+880..." />
                  </div>
                  <div>
                    <label className="label-base">Email</label>
                    <input value={form.email} onChange={e => f('email', e.target.value)} className="input-base" type="email" />
                  </div>
                </div>
                <div>
                  <label className="label-base">Teacher Photo</label>
                  <FileUpload
                    bucket="teachers"
                    currentUrl={form.photo}
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    label="Upload Photo"
                    previewType="image"
                    onUploaded={url => f('photo', url)}
                  />
                </div>
                <div>
                  <label className="label-base">সম্পর্কে (বাংলা)</label>
                  <textarea value={form.about_bn} onChange={e => f('about_bn', e.target.value)} className="input-base resize-none" rows={3} />
                </div>
                <div>
                  <label className="label-base">About (English)</label>
                  <textarea value={form.about_en} onChange={e => f('about_en', e.target.value)} className="input-base resize-none" rows={3} />
                </div>
                <div className="flex gap-3 pt-2">
                  <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 disabled:opacity-60">
                    <Check size={16} /> {saving ? 'Saving...' : editing ? 'Update' : 'Save'}
                  </button>
                  <button onClick={() => setShowForm(false)} className="btn-outline flex-1">Cancel</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {data.teachers.length === 0 ? (
          <div className="text-center py-12 bg-secondary rounded-2xl text-muted-foreground">No teachers added yet</div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.teachers.map(teacher => (
              <div key={teacher.id} className="card-base p-5">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-secondary overflow-hidden shrink-0">
                    {teacher.photo ? (
                      <img src={teacher.photo} alt={teacher.name_bn} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User size={20} className="text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-foreground truncate">{teacher.name_bn}</p>
                    {teacher.designation_bn && (
                      <p className="text-xs font-semibold text-primary truncate">{teacher.designation_bn}</p>
                    )}
                    <p className="text-xs text-muted-foreground truncate">{teacher.qualification_bn}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{teacher.mobile}</p>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <button onClick={() => openEdit(teacher)} className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-primary border border-primary rounded-lg hover:bg-primary hover:text-white transition-all">
                    <Edit2 size={13} /> Edit
                  </button>
                  <button onClick={() => handleDelete(teacher.id)} className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-destructive border border-destructive rounded-lg hover:bg-destructive hover:text-white transition-all">
                    <Trash2 size={13} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
