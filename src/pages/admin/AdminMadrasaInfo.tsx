import { useState } from 'react';
import { Save } from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import { useData } from '@/contexts/DataContext';
import { toast } from 'sonner';
import FileUpload from '@/components/features/FileUpload';

export default function AdminMadrasaInfo() {
  const { data, saveMadrasaInfo } = useData();
  const [form, setForm] = useState({ 
    ...data.madrasaInfo,
    officeHours_bn: data.madrasaInfo.officeHours_bn || 'শনি–বৃহস্পতি: সকাল ৮টা – বিকাল ৪টা',
    officeHours_en: data.madrasaInfo.officeHours_en || 'Sat–Thu: 8:00 AM – 4:00 PM',
  });
  const [saving, setSaving] = useState(false);

  const f = (key: string, val: string | number) => setForm(p => ({ ...p, [key]: val }));

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveMadrasaInfo(form);
      toast.success('Madrasa information saved');
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-3xl">
        <h2 className="text-xl font-bold">Madrasa Information</h2>

        <div className="card-base p-6 space-y-5">
          <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wide border-b border-border pb-2">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label-base">মাদ্রাসার নাম (বাংলা)</label>
              <input value={form.name_bn} onChange={e => f('name_bn', e.target.value)} className="input-base" />
            </div>
            <div>
              <label className="label-base">Madrasa Name (English)</label>
              <input value={form.name_en} onChange={e => f('name_en', e.target.value)} className="input-base" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label-base">Email</label>
              <input type="email" value={form.email} onChange={e => f('email', e.target.value)} className="input-base" />
            </div>
            <div>
              <label className="label-base">Madrasa Logo</label>
              <FileUpload
                bucket="madrasa"
                currentUrl={form.logo}
                accept="image/jpeg,image/jpg,image/png,image/webp"
                label="Upload Logo"
                previewType="image"
                onUploaded={url => f('logo', url)}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label-base">Phone 1</label>
              <input value={form.phone1} onChange={e => f('phone1', e.target.value)} className="input-base" />
            </div>
            <div>
              <label className="label-base">Phone 2</label>
              <input value={form.phone2} onChange={e => f('phone2', e.target.value)} className="input-base" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label-base">ঠিকানা (বাংলা)</label>
              <textarea value={form.address_bn} onChange={e => f('address_bn', e.target.value)} rows={2} className="input-base resize-none" />
            </div>
            <div>
              <label className="label-base">Address (English)</label>
              <textarea value={form.address_en} onChange={e => f('address_en', e.target.value)} rows={2} className="input-base resize-none" />
            </div>
          </div>
          <div>
            <label className="label-base">Total Students (Manual)</label>
            <input type="number" value={form.totalStudents} onChange={e => f('totalStudents', Number(e.target.value))} className="input-base w-40" min={0} />
          </div>
        </div>

        <div className="card-base p-6 space-y-5">
          <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wide border-b border-border pb-2">About & History</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label-base">মাদ্রাসা সম্পর্কে (বাংলা)</label>
              <textarea value={form.about_bn} onChange={e => f('about_bn', e.target.value)} rows={4} className="input-base resize-none" />
            </div>
            <div>
              <label className="label-base">About (English)</label>
              <textarea value={form.about_en} onChange={e => f('about_en', e.target.value)} rows={4} className="input-base resize-none" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label-base">ইতিহাস (বাংলা)</label>
              <textarea value={form.history_bn} onChange={e => f('history_bn', e.target.value)} rows={4} className="input-base resize-none" />
            </div>
            <div>
              <label className="label-base">History (English)</label>
              <textarea value={form.history_en} onChange={e => f('history_en', e.target.value)} rows={4} className="input-base resize-none" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label-base">মিশন (বাংলা)</label>
              <textarea value={form.mission_bn} onChange={e => f('mission_bn', e.target.value)} rows={3} className="input-base resize-none" />
            </div>
            <div>
              <label className="label-base">Mission (English)</label>
              <textarea value={form.mission_en} onChange={e => f('mission_en', e.target.value)} rows={3} className="input-base resize-none" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label-base">ভিশন (বাংলা)</label>
              <textarea value={form.vision_bn} onChange={e => f('vision_bn', e.target.value)} rows={3} className="input-base resize-none" />
            </div>
            <div>
              <label className="label-base">Vision (English)</label>
              <textarea value={form.vision_en} onChange={e => f('vision_en', e.target.value)} rows={3} className="input-base resize-none" />
            </div>
          </div>
        </div>

        <div className="card-base p-6 space-y-5">
          <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wide border-b border-border pb-2">Principal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label-base">অধ্যক্ষের নাম (বাংলা)</label>
              <input value={form.principalName_bn} onChange={e => f('principalName_bn', e.target.value)} className="input-base" />
            </div>
            <div>
              <label className="label-base">Principal Name (English)</label>
              <input value={form.principalName_en} onChange={e => f('principalName_en', e.target.value)} className="input-base" />
            </div>
          </div>
          <div>
            <label className="label-base">Principal Photo</label>
            <FileUpload
              bucket="madrasa"
              currentUrl={form.principalPhoto}
              accept="image/jpeg,image/jpg,image/png,image/webp"
              label="Upload Principal Photo"
              previewType="image"
              onUploaded={url => f('principalPhoto', url)}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label-base">অধ্যক্ষের বাণী (বাংলা)</label>
              <textarea value={form.principalMessage_bn} onChange={e => f('principalMessage_bn', e.target.value)} rows={5} className="input-base resize-none" />
            </div>
            <div>
              <label className="label-base">Principal Message (English)</label>
              <textarea value={form.principalMessage_en} onChange={e => f('principalMessage_en', e.target.value)} rows={5} className="input-base resize-none" />
            </div>
          </div>
        </div>

        <div className="card-base p-6 space-y-4">
          <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wide border-b border-border pb-2">Office Hours</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label-base">অফিস সময় (বাংলা)</label>
              <input value={form.officeHours_bn} onChange={e => f('officeHours_bn', e.target.value)} className="input-base" placeholder="শনি–বৃহস্পতি: সকাল ৮টা – বিকাল ৪টা" />
            </div>
            <div>
              <label className="label-base">Office Hours (English)</label>
              <input value={form.officeHours_en} onChange={e => f('officeHours_en', e.target.value)} className="input-base" placeholder="Sat–Thu: 8:00 AM – 4:00 PM" />
            </div>
          </div>
        </div>

        <div className="card-base p-6 space-y-4">
          <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wide border-b border-border pb-2">Google Map</h3>
          <div>
            <label className="label-base">Google Maps Embed URL</label>
            <input value={form.mapEmbed} onChange={e => f('mapEmbed', e.target.value)} className="input-base" placeholder="https://www.google.com/maps/embed?pb=..." />
            <p className="text-xs text-muted-foreground mt-1">Google Maps → Share → Embed a map → Copy the src URL</p>
          </div>
        </div>

        <button onClick={handleSave} disabled={saving} className="btn-primary disabled:opacity-60">
          <Save size={16} /> {saving ? 'Saving...' : 'Save All Changes'}
        </button>
      </div>
    </AdminLayout>
  );
}
