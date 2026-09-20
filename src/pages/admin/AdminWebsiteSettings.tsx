import { useState } from 'react';
import { Save } from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import { useData } from '@/contexts/DataContext';
import { toast } from 'sonner';
import FileUpload from '@/components/features/FileUpload';

export default function AdminWebsiteSettings() {
  const { data, saveWebsiteSettings } = useData();
  const [form, setForm] = useState({ ...data.websiteSettings });
  const [saving, setSaving] = useState(false);

  const f = (key: string, val: string) => setForm(p => ({ ...p, [key]: val }));

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveWebsiteSettings(form);
      toast.success('Website settings saved');
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-3xl">
        <h2 className="text-xl font-bold">Website Settings</h2>

        <div className="card-base p-6 space-y-5">
          <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wide border-b border-border pb-2">Hero Banner</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label-base">Hero Title (বাংলা)</label>
              <input value={form.heroTitle_bn} onChange={e => f('heroTitle_bn', e.target.value)} className="input-base" />
            </div>
            <div>
              <label className="label-base">Hero Title (English)</label>
              <input value={form.heroTitle_en} onChange={e => f('heroTitle_en', e.target.value)} className="input-base" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label-base">Hero Subtitle (বাংলা)</label>
              <textarea value={form.heroSubtitle_bn} onChange={e => f('heroSubtitle_bn', e.target.value)} rows={3} className="input-base resize-none" />
            </div>
            <div>
              <label className="label-base">Hero Subtitle (English)</label>
              <textarea value={form.heroSubtitle_en} onChange={e => f('heroSubtitle_en', e.target.value)} rows={3} className="input-base resize-none" />
            </div>
          </div>
          <div>
            <label className="label-base">Hero Banner Image</label>
            <FileUpload
              bucket="hero"
              currentUrl={form.heroBanner.startsWith('/') ? '' : form.heroBanner}
              accept="image/jpeg,image/jpg,image/png,image/webp"
              label="Upload Banner Image"
              previewType="image"
              onUploaded={url => f('heroBanner', url)}
            />
            {form.heroBanner && (
              <p className="text-xs text-muted-foreground mt-1 truncate">Current: {form.heroBanner}</p>
            )}
          </div>
        </div>

        <div className="card-base p-6 space-y-5">
          <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wide border-b border-border pb-2">Footer & Social</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label-base">Footer Text (বাংলা)</label>
              <input value={form.footerText_bn} onChange={e => f('footerText_bn', e.target.value)} className="input-base" />
            </div>
            <div>
              <label className="label-base">Footer Text (English)</label>
              <input value={form.footerText_en} onChange={e => f('footerText_en', e.target.value)} className="input-base" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label-base">Facebook URL</label>
              <input value={form.facebookUrl} onChange={e => f('facebookUrl', e.target.value)} className="input-base" placeholder="https://facebook.com/..." />
            </div>
            <div>
              <label className="label-base">YouTube URL</label>
              <input value={form.youtubeUrl} onChange={e => f('youtubeUrl', e.target.value)} className="input-base" placeholder="https://youtube.com/..." />
            </div>
          </div>
        </div>

        <div className="card-base p-6">
          <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wide border-b border-border pb-3 mb-4">Admin Credentials</h3>
          <p className="text-sm text-muted-foreground bg-secondary p-3 rounded-lg">
            Admin credentials are managed in Supabase (Authentication > Users). To change the admin password, use the Supabase dashboard.
          </p>
        </div>

        <button onClick={handleSave} disabled={saving} className="btn-primary disabled:opacity-60">
          <Save size={16} /> {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </AdminLayout>
  );
}
