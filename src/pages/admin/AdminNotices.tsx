import { useState } from 'react';
import { Plus, Edit2, Trash2, X, Check, Eye, EyeOff, Paperclip } from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import { useData } from '@/contexts/DataContext';
import { generateId } from '@/lib/storage';
import { toast } from 'sonner';
import FileUpload from '@/components/features/FileUpload';
import { todayLocal } from '@/lib/utils';
import type { Notice } from '@/types';

const emptyNotice = () => ({
  title_bn: '', title_en: '', description_bn: '', description_en: '',
  date: todayLocal(), attachment: '', published: false,
});

export default function AdminNotices() {
  const { data, saveNotice, deleteNotice, toggleNoticePublished } = useData();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Notice | null>(null);
  const [form, setForm] = useState(emptyNotice());
  const [saving, setSaving] = useState(false);

  const openAdd = () => { setEditing(null); setForm(emptyNotice()); setShowForm(true); };
  const openEdit = (n: Notice) => {
    setEditing(n);
    setForm({
      title_bn: n.title_bn, title_en: n.title_en,
      description_bn: n.description_bn, description_en: n.description_en,
      date: n.date, attachment: n.attachment || '', published: n.published,
    });
    setShowForm(true);
  };

  const handleSave = async (publish: boolean) => {
    if (!form.title_bn) { toast.error('Title required'); return; }
    const notice: Notice = {
      ...form,
      id: editing?.id || generateId(),
      published: publish,
      createdAt: editing?.createdAt || new Date().toISOString(),
    };
    setSaving(true);
    try {
      await saveNotice(notice, !!editing);
      toast.success(editing ? 'Notice updated' : publish ? 'Notice published' : 'Saved as draft');
      setShowForm(false);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleTogglePublish = async (id: string, current: boolean) => {
    try {
      await toggleNoticePublished(id, !current);
      toast.success(!current ? 'Published' : 'Unpublished');
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Failed');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this notice?')) return;
    try {
      await deleteNotice(id);
      toast.success('Deleted');
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Delete failed');
    }
  };

  const f = (key: string, val: string | boolean) => setForm(p => ({ ...p, [key]: val }));

  return (
    <AdminLayout>
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Notices</h2>
          <button onClick={openAdd} className="btn-primary text-sm py-2.5 px-4">
            <Plus size={16} /> Add Notice
          </button>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="p-5 border-b border-border flex items-center justify-between sticky top-0 bg-white z-10">
                <h3 className="font-bold">{editing ? 'Edit Notice' : 'Add Notice'}</h3>
                <button onClick={() => setShowForm(false)} className="p-1.5 hover:bg-secondary rounded-lg">
                  <X size={18} />
                </button>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <label className="label-base">শিরোনাম (বাংলা) *</label>
                  <input value={form.title_bn} onChange={e => f('title_bn', e.target.value)} className="input-base" />
                </div>
                <div>
                  <label className="label-base">Title (English)</label>
                  <input value={form.title_en} onChange={e => f('title_en', e.target.value)} className="input-base" />
                </div>
                <div>
                  <label className="label-base">তারিখ</label>
                  <input type="date" value={form.date} onChange={e => f('date', e.target.value)} className="input-base" />
                </div>
                <div>
                  <label className="label-base">বিবরণ (বাংলা)</label>
                  <textarea value={form.description_bn} onChange={e => f('description_bn', e.target.value)} rows={4} className="input-base resize-none" />
                </div>
                <div>
                  <label className="label-base">Description (English)</label>
                  <textarea value={form.description_en} onChange={e => f('description_en', e.target.value)} rows={4} className="input-base resize-none" />
                </div>

                {/* Attachment upload */}
                <div>
                  <label className="label-base flex items-center gap-1.5">
                    <Paperclip size={14} /> Attachment (Optional — image or PDF)
                  </label>
                  <FileUpload
                    bucket="notices"
                    currentUrl={form.attachment}
                    accept="image/jpeg,image/jpg,image/png,image/webp,application/pdf"
                    label="Upload Attachment"
                    previewType="image"
                    onUploaded={url => f('attachment', url)}
                    onRemoved={() => f('attachment', '')}
                  />
                  {form.attachment && form.attachment.endsWith('.pdf') && (
                    <a
                      href={form.attachment}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-primary hover:underline mt-1 inline-flex items-center gap-1"
                    >
                      <Paperclip size={12} /> View PDF
                    </a>
                  )}
                </div>

                <div className="flex gap-3 pt-2">
                  <button onClick={() => handleSave(true)} disabled={saving} className="btn-primary flex-1 disabled:opacity-60">
                    <Check size={15} /> {saving ? 'Saving...' : 'Publish'}
                  </button>
                  <button onClick={() => handleSave(false)} disabled={saving} className="btn-outline flex-1 disabled:opacity-60">
                    Save Draft
                  </button>
                  <button onClick={() => setShowForm(false)} className="px-4 py-3 bg-secondary rounded-lg text-sm font-semibold">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="card-base overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary">
                <tr>
                  <th className="text-left px-5 py-3 font-semibold">শিরোনাম</th>
                  <th className="text-left px-5 py-3 font-semibold">তারিখ</th>
                  <th className="text-center px-5 py-3 font-semibold">Attach</th>
                  <th className="text-center px-5 py-3 font-semibold">Status</th>
                  <th className="text-right px-5 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {data.notices.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-muted-foreground">No notices</td>
                  </tr>
                ) : data.notices.map(n => (
                  <tr key={n.id} className="hover:bg-secondary/40">
                    <td className="px-5 py-4 font-medium max-w-xs truncate">{n.title_bn}</td>
                    <td className="px-5 py-4 text-muted-foreground whitespace-nowrap">
                      {new Date(n.date).toLocaleDateString('en-GB')}
                    </td>
                    <td className="px-5 py-4 text-center">
                      {n.attachment ? (
                        <a href={n.attachment} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center text-primary hover:text-primary/70">
                          <Paperclip size={14} />
                        </a>
                      ) : (
                        <span className="text-muted-foreground/40">—</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span className={n.published ? 'badge-green' : 'badge-yellow'}>
                        {n.published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleTogglePublish(n.id, n.published)}
                          className="p-1.5 hover:bg-secondary rounded-lg"
                          title={n.published ? 'Unpublish' : 'Publish'}
                        >
                          {n.published
                            ? <EyeOff size={14} className="text-muted-foreground" />
                            : <Eye size={14} className="text-primary" />}
                        </button>
                        <button onClick={() => openEdit(n)} className="p-1.5 hover:bg-secondary rounded-lg">
                          <Edit2 size={14} className="text-primary" />
                        </button>
                        <button onClick={() => handleDelete(n.id)} className="p-1.5 hover:bg-red-50 rounded-lg">
                          <Trash2 size={14} className="text-destructive" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
