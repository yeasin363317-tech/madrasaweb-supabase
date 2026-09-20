import { useState } from 'react';
import { Save } from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import { useData } from '@/contexts/DataContext';
import { toast } from 'sonner';

export default function AdminPrivacyPolicy() {
  const { data, savePagesContent } = useData();
  const [bn, setBn] = useState(data.privacyPolicy_bn);
  const [en, setEn] = useState(data.privacyPolicy_en);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await savePagesContent(bn, en, data.termsConditions_bn, data.termsConditions_en);
      toast.success('Privacy policy saved');
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-5 max-w-4xl">
        <h2 className="text-xl font-bold">Privacy Policy</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="card-base p-5 space-y-3">
            <label className="label-base text-base">গোপনীয়তা নীতি (বাংলা)</label>
            <textarea value={bn} onChange={e => setBn(e.target.value)} rows={20} className="input-base resize-none font-mono text-xs" />
          </div>
          <div className="card-base p-5 space-y-3">
            <label className="label-base text-base">Privacy Policy (English)</label>
            <textarea value={en} onChange={e => setEn(e.target.value)} rows={20} className="input-base resize-none font-mono text-xs" />
          </div>
        </div>
        <button onClick={handleSave} disabled={saving} className="btn-primary disabled:opacity-60">
          <Save size={16} /> {saving ? 'Saving...' : 'Save Privacy Policy'}
        </button>
      </div>
    </AdminLayout>
  );
}
