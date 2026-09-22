import { useData } from '@/contexts/DataContext';
import AdminLayout from '@/components/layout/AdminLayout';
import { Users, FileText, Bell, Image, MessageSquare, GraduationCap, Edit3, Check, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import NumberInput from '@/components/features/NumberInput';
import { useNavigate } from 'react-router-dom';

interface ClickableStatCardProps {
  icon: React.ElementType;
  value: number | string;
  label: string;
  color: 'green' | 'blue' | 'orange' | 'purple' | 'red';
  to: string;
}

const colorMap = {
  green: { bg: 'bg-green-100', text: 'text-primary', badge: 'bg-primary/10' },
  blue: { bg: 'bg-blue-100', text: 'text-blue-600', badge: 'bg-blue-50' },
  orange: { bg: 'bg-orange-100', text: 'text-orange-600', badge: 'bg-orange-50' },
  purple: { bg: 'bg-purple-100', text: 'text-purple-600', badge: 'bg-purple-50' },
  red: { bg: 'bg-red-100', text: 'text-red-600', badge: 'bg-red-50' },
};

function ClickableStatCard({ icon: Icon, value, label, color, to }: ClickableStatCardProps) {
  const navigate = useNavigate();
  const c = colorMap[color];

  return (
    <button
      onClick={() => navigate(to)}
      className="card-base p-5 text-left w-full group hover:border-primary/40 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
    >
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl ${c.bg} ${c.text} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-200`}>
          <Icon size={22} />
        </div>
        <div className="flex-1 min-w-0">
          <p className={`text-2xl font-bold ${c.text}`}>{value}</p>
          <p className="text-sm font-medium text-muted-foreground leading-tight">{label}</p>
        </div>
        <ChevronRight size={16} className="text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all duration-200 shrink-0" />
      </div>
    </button>
  );
}

export default function AdminDashboard() {
  const { data, saveMadrasaInfo } = useData();
  const navigate = useNavigate();
  const [editingStudents, setEditingStudents] = useState(false);
  const [studentCount, setStudentCount] = useState<number | ''>(data.madrasaInfo.totalStudents);
  const [saving, setSaving] = useState(false);

  const publishedResults = data.results.filter(r => r.published).length;
  const publishedNotices = data.notices.filter(n => n.published).length;
  const unresolvedComplaints = data.complaints.filter(c => !c.resolved).length;

  const saveStudentCount = async () => {
    setSaving(true);
    try {
      await saveMadrasaInfo({ ...data.madrasaInfo, totalStudents: Number(studentCount) || 0 });
      setEditingStudents(false);
      toast.success('Student count updated');
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-foreground mb-1">Dashboard Overview</h2>
          <p className="text-sm text-muted-foreground">Welcome to the Madrasa Admin Panel — click any card to manage</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <ClickableStatCard
            icon={Users}
            value={data.teachers.length}
            label="Total Teachers"
            color="green"
            to="/admin/teachers"
          />
          <ClickableStatCard
            icon={FileText}
            value={publishedResults}
            label="Published Results"
            color="blue"
            to="/admin/results"
          />
          <ClickableStatCard
            icon={Bell}
            value={publishedNotices}
            label="Published Notices"
            color="orange"
            to="/admin/notices"
          />
          <ClickableStatCard
            icon={Image}
            value={data.gallery.length}
            label="Gallery Items"
            color="purple"
            to="/admin/gallery"
          />
          <ClickableStatCard
            icon={MessageSquare}
            value={unresolvedComplaints}
            label="Pending Complaints"
            color="red"
            to="/admin/complaints"
          />

          {/* Total Students — editable inline, also clickable to madrasa info */}
          <div
            role="button"
            tabIndex={0}
            onClick={() => navigate('/admin/madrasa-info')}
            onKeyDown={e => { if (e.key === 'Enter') navigate('/admin/madrasa-info'); }}
            className="card-base p-5 text-left w-full group cursor-pointer hover:border-primary/40 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 border border-green-100"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-100 text-primary flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-200">
                <GraduationCap size={22} />
              </div>
              <div className="flex-1" onClick={e => e.stopPropagation()}>
                {editingStudents ? (
                  <div className="flex items-center gap-2">
                    <NumberInput
                      value={studentCount}
                      onChange={setStudentCount}
                      className="input-base py-1.5 text-lg font-bold w-24"
                      min={0}
                      autoFocus
                      onClick={e => e.stopPropagation()}
                    />
                    <button
                      onClick={e => { e.stopPropagation(); saveStudentCount(); }}
                      disabled={saving}
                      className="p-1.5 bg-primary text-primary-foreground rounded-lg disabled:opacity-60"
                    >
                      <Check size={14} />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <p className="text-2xl font-bold text-primary">{data.madrasaInfo.totalStudents || '—'}</p>
                    <button
                      onClick={e => { e.stopPropagation(); setStudentCount(data.madrasaInfo.totalStudents); setEditingStudents(true); }}
                      className="p-1 hover:bg-secondary rounded"
                    >
                      <Edit3 size={13} className="text-muted-foreground" />
                    </button>
                  </div>
                )}
                <p className="text-sm font-medium text-primary/80">Total Students</p>
              </div>
              <ChevronRight size={16} className="text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all duration-200 shrink-0" />
            </div>
          </div>
        </div>

        {/* Recent Complaints — each row clickable */}
        {data.complaints.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-foreground">Recent Complaints</h3>
              <button
                onClick={() => navigate('/admin/complaints')}
                className="text-sm text-primary font-semibold hover:underline flex items-center gap-1"
              >
                View All <ChevronRight size={14} />
              </button>
            </div>
            <div className="card-base overflow-hidden">
              <div className="divide-y divide-border">
                {data.complaints.slice(0, 5).map(c => (
                  <button
                    key={c.id}
                    onClick={() => navigate('/admin/complaints')}
                    className="w-full px-5 py-4 flex items-start justify-between gap-4 text-left hover:bg-secondary/40 transition-colors"
                  >
                    <div>
                      <p className="text-sm font-semibold text-foreground">{c.name} — {c.subject}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{c.message}</p>
                    </div>
                    <span className={c.resolved ? 'badge-green' : 'badge-red'}>
                      {c.resolved ? 'Resolved' : 'Pending'}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
