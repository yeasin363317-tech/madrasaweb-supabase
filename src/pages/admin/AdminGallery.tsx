import { useState } from 'react';
import { Plus, Trash2, X, Check, Image as ImageIcon, Video } from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import { useData } from '@/contexts/DataContext';
import { generateId } from '@/lib/storage';
import { toast } from 'sonner';
import FileUpload from '@/components/features/FileUpload';
import type { GalleryItem } from '@/types';

const emptyForm = () => ({
  type: 'photo' as 'photo' | 'video',
  title_bn: '', title_en: '', url: '', thumbnail: '',
});

export default function AdminGallery() {
  const { data, saveGalleryItem, deleteGalleryItem } = useData();
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyForm());

  const handleSave = async () => {
    if (!form.title_bn || !form.url) {
      toast.error('শিরোনাম এবং ফাইল আবশ্যক');
      return;
    }
    setSaving(true);
    try {
      const item: GalleryItem = { ...form, id: generateId(), createdAt: new Date().toISOString() };
      await saveGalleryItem(item);
      toast.success('Gallery item added');
      setShowForm(false);
      setForm(emptyForm());
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this item?')) return;
    try {
      await deleteGalleryItem(id);
      toast.success('Deleted');
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Delete failed');
    }
  };

  const handleTypeChange = (t: 'photo' | 'video') => {
    setForm(p => ({ ...p, type: t, url: '', thumbnail: '' }));
  };

  return (
    <AdminLayout>
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Gallery</h2>
          <button onClick={() => { setForm(emptyForm()); setShowForm(true); }} className="btn-primary text-sm py-2.5 px-4">
            <Plus size={16} /> Add Item
          </button>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold">Add Gallery Item</h3>
                <button onClick={() => setShowForm(false)} className="p-1.5 hover:bg-secondary rounded-lg"><X size={18} /></button>
              </div>

              {/* Type toggle */}
              <div>
                <label className="label-base">Type</label>
                <div className="flex gap-3">
                  {(['photo', 'video'] as const).map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => handleTypeChange(t)}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 text-sm font-semibold transition-all ${
                        form.type === t
                          ? 'border-primary bg-secondary text-primary'
                          : 'border-border text-muted-foreground hover:border-primary/50'
                      }`}
                    >
                      {t === 'photo' ? <ImageIcon size={16} /> : <Video size={16} />}
                      {t === 'photo' ? 'Photo' : 'Video'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="label-base">শিরোনাম (বাংলা) *</label>
                <input
                  value={form.title_bn}
                  onChange={e => setForm(p => ({ ...p, title_bn: e.target.value }))}
                  className="input-base"
                />
              </div>
              <div>
                <label className="label-base">Title (English)</label>
                <input
                  value={form.title_en}
                  onChange={e => setForm(p => ({ ...p, title_en: e.target.value }))}
                  className="input-base"
                />
              </div>

              {/* File upload */}
              <div>
                <label className="label-base">
                  {form.type === 'photo' ? 'Photo File *' : 'Video File *'}
                </label>
                <FileUpload
                  bucket="gallery"
                  currentUrl={form.url}
                  accept={
                    form.type === 'photo'
                      ? 'image/jpeg,image/jpg,image/png,image/webp'
                      : 'video/mp4,video/webm'
                  }
                  label={form.type === 'photo' ? 'Upload Photo' : 'Upload Video'}
                  previewType={form.type}
                  onUploaded={url => setForm(p => ({ ...p, url }))}
                  onThumbnailGenerated={url => setForm(p => ({ ...p, thumbnail: url }))}
                />
              </div>

              {form.type === 'photo' && (
                <div>
                  <label className="label-base">Thumbnail (Optional — smaller preview image)</label>
                  <FileUpload
                    bucket="gallery"
                    currentUrl={form.thumbnail}
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    label="Upload Thumbnail"
                    previewType="image"
                    onUploaded={url => setForm(p => ({ ...p, thumbnail: url }))}
                  />
                </div>
              )}

              <div className="flex gap-3 pt-1">
                <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 disabled:opacity-60">
                  <Check size={15} /> {saving ? 'Saving...' : 'Save'}
                </button>
                <button onClick={() => setShowForm(false)} className="btn-outline flex-1">Cancel</button>
              </div>
            </div>
          </div>
        )}

        {data.gallery.length === 0 ? (
          <div className="text-center py-12 bg-secondary rounded-2xl text-muted-foreground">
            <ImageIcon size={40} className="mx-auto mb-3" />
            <p>No gallery items added yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {data.gallery.map(item => (
              <div key={item.id} className="card-base overflow-hidden group">
                <div className="aspect-video bg-secondary relative">
                  {item.type === 'photo' ? (
                    <img src={item.thumbnail || item.url} alt={item.title_bn} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary/10 relative overflow-hidden">
                      {item.thumbnail ? (
                        <img src={item.thumbnail} alt={item.title_bn} className="w-full h-full object-cover" />
                      ) : (
                        <Video size={32} className="text-primary" />
                      )}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-9 h-9 rounded-full bg-black/50 flex items-center justify-center">
                          <span className="text-white text-sm ml-0.5">▶</span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      item.type === 'photo' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {item.type}
                    </span>
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-xs font-semibold text-foreground truncate mb-2">{item.title_bn}</p>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="w-full flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold text-destructive border border-destructive rounded-lg hover:bg-destructive hover:text-white transition-all"
                  >
                    <Trash2 size={12} /> Delete
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
