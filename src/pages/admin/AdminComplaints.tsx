import { useState } from 'react';
import { Trash2, MessageSquare, Eye, X, Hash, User, Phone as PhoneIcon, AlignLeft, Calendar, Send, ChevronDown, Reply, GraduationCap, Users } from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import { useData } from '@/contexts/DataContext';
import { toast } from 'sonner';
import { createPortal } from 'react-dom';
import type { Complaint, ComplaintStatus, ComplaintType } from '@/types';

// ────────────────────────────────────────────────────────────────────────────
// Status config
// ────────────────────────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<ComplaintStatus, { label: string; color: string; bg: string }> = {
  pending: { label: 'Pending', color: 'text-amber-700', bg: 'bg-amber-50' },
  under_review: { label: 'Under Review', color: 'text-blue-700', bg: 'bg-blue-50' },
  resolved: { label: 'Resolved', color: 'text-green-700', bg: 'bg-green-50' },
  rejected: { label: 'Rejected', color: 'text-red-700', bg: 'bg-red-50' },
};

const TYPE_CONFIG: Record<ComplaintType, { label: string; color: string; bg: string; icon: typeof GraduationCap }> = {
  student: { label: 'Student', color: 'text-blue-700', bg: 'bg-blue-50', icon: GraduationCap },
  guardian: { label: 'Guardian', color: 'text-purple-700', bg: 'bg-purple-50', icon: Users },
};

function StatusBadge({ status }: { status: ComplaintStatus }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.color}`}>
      {cfg.label}
    </span>
  );
}

function TypeBadge({ type }: { type: ComplaintType }) {
  const cfg = TYPE_CONFIG[type] || TYPE_CONFIG.student;
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.color}`}>
      <Icon size={11} /> {cfg.label}
    </span>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Complaint Detail Modal
// ────────────────────────────────────────────────────────────────────────────
function ComplaintDetailModal({ complaint, onClose }: {
  complaint: Complaint;
  onClose: () => void;
}) {
  const { deleteComplaint, updateComplaintStatus, updateComplaintReply } = useData();
  const [status, setStatus] = useState<ComplaintStatus>(complaint.status);
  const [reply, setReply] = useState(complaint.adminReply || '');
  const [savingStatus, setSavingStatus] = useState(false);
  const [savingReply, setSavingReply] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const formattedDate = new Date(complaint.createdAt).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });

  const handleStatusChange = async (newStatus: ComplaintStatus) => {
    setStatus(newStatus);
    setSavingStatus(true);
    try {
      await updateComplaintStatus(complaint.id, newStatus);
      toast.success('Status updated');
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Failed');
      setStatus(complaint.status);
    } finally {
      setSavingStatus(false);
    }
  };

  const handleSaveReply = async () => {
    setSavingReply(true);
    try {
      await updateComplaintReply(complaint.id, reply);
      toast.success('Reply saved');
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Failed');
    } finally {
      setSavingReply(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this complaint permanently?')) return;
    setDeleting(true);
    try {
      await deleteComplaint(complaint.id);
      toast.success('Deleted');
      onClose();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Delete failed');
      setDeleting(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-border bg-secondary/40 sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <MessageSquare size={17} className="text-primary" />
            <h3 className="font-bold text-base">Complaint Details</h3>
          </div>
          <div className="flex items-center gap-2 flex-wrap justify-end">
            <TypeBadge type={complaint.complaintType || 'student'} />
            <StatusBadge status={status} />
            <button onClick={onClose} className="p-1.5 hover:bg-white rounded-lg transition-colors"><X size={16} /></button>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Info grid */}
          <div className="space-y-3">
            {[
              { icon: Hash, label: 'Tracking ID (Record ID)', value: complaint.id, mono: true },
              { icon: User, label: 'Name', value: complaint.name },
              { icon: PhoneIcon, label: 'Mobile', value: complaint.mobile, isPhone: true },
              { icon: AlignLeft, label: 'Subject', value: complaint.subject, bold: true },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                  <item.icon size={14} className="text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-0.5">{item.label}</p>
                  {item.isPhone ? (
                    <a href={`tel:${item.value}`} className="text-sm font-medium text-primary hover:underline">{item.value}</a>
                  ) : (
                    <p className={`text-sm ${item.mono ? 'font-mono' : ''} ${item.bold ? 'font-bold text-foreground' : 'font-medium text-foreground'}`}>{item.value}</p>
                  )}
                </div>
              </div>
            ))}
            {/* Complaint Type row */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                <Users size={14} className="text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-0.5">Complaint Type</p>
                <TypeBadge type={complaint.complaintType || 'student'} />
              </div>
            </div>
          </div>

          {/* Message */}
          <div className="rounded-xl bg-secondary p-4">
            <p className="text-xs font-semibold text-muted-foreground mb-2">Message</p>
            <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{complaint.message}</p>
          </div>

          {/* Date */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar size={12} />
            <span>Submitted: {formattedDate}</span>
          </div>

          {/* Status changer */}
          <div className="border border-border rounded-xl p-4 space-y-3">
            <p className="text-sm font-bold text-foreground">Change Status</p>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(STATUS_CONFIG) as ComplaintStatus[]).map(s => (
                <button
                  key={s}
                  onClick={() => handleStatusChange(s)}
                  disabled={savingStatus}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold border-2 transition-all ${
                    status === s
                      ? `${STATUS_CONFIG[s].bg} ${STATUS_CONFIG[s].color} border-current`
                      : 'bg-white text-muted-foreground border-border hover:border-primary/40'
                  } disabled:opacity-60`}
                >
                  {STATUS_CONFIG[s].label}
                </button>
              ))}
            </div>
          </div>

          {/* Admin Reply */}
          <div className="border border-border rounded-xl p-4 space-y-3">
            <p className="text-sm font-bold text-foreground flex items-center gap-2">
              <Reply size={14} className="text-primary" /> Admin Reply
            </p>
            <textarea
              value={reply}
              onChange={e => setReply(e.target.value)}
              placeholder="Type a reply for the complainant..."
              rows={3}
              className="input-base resize-none text-sm"
            />
            <button
              onClick={handleSaveReply}
              disabled={savingReply}
              className="btn-primary text-sm py-2 px-4 disabled:opacity-60"
            >
              <Send size={13} /> {savingReply ? 'Saving...' : 'Save Reply'}
            </button>
          </div>

          {/* Delete */}
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-destructive border border-destructive hover:bg-destructive hover:text-white transition-all disabled:opacity-60"
          >
            <Trash2 size={14} />
            {deleting ? 'Deleting...' : 'Delete Complaint'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Main Component
// ────────────────────────────────────────────────────────────────────────────
export default function AdminComplaints() {
  const { data } = useData();
  const [statusFilter, setStatusFilter] = useState<'all' | ComplaintStatus>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | ComplaintType>('all');
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [search, setSearch] = useState('');

  const filtered = data.complaints.filter(c => {
    const statusMatch = statusFilter === 'all' || c.status === statusFilter;
    const typeMatch = typeFilter === 'all' || c.complaintType === typeFilter;
    const searchMatch = !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.trackingId || '').toLowerCase().includes(search.toLowerCase()) ||
      c.subject.toLowerCase().includes(search.toLowerCase()) ||
      c.mobile.includes(search);
    return statusMatch && typeMatch && searchMatch;
  });

  const counts = {
    all: data.complaints.length,
    pending: data.complaints.filter(c => c.status === 'pending').length,
    under_review: data.complaints.filter(c => c.status === 'under_review').length,
    resolved: data.complaints.filter(c => c.status === 'resolved').length,
    rejected: data.complaints.filter(c => c.status === 'rejected').length,
    student: data.complaints.filter(c => c.complaintType === 'student').length,
    guardian: data.complaints.filter(c => c.complaintType === 'guardian').length,
  };

  return (
    <AdminLayout>
      <div className="space-y-5">
        <h2 className="text-xl font-bold">Complaints Management</h2>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Total', value: counts.all, color: 'bg-secondary' },
            { label: 'Pending', value: counts.pending, color: 'bg-amber-50' },
            { label: 'Under Review', value: counts.under_review, color: 'bg-blue-50' },
            { label: 'Resolved', value: counts.resolved, color: 'bg-green-50' },
          ].map((s, i) => (
            <div key={i} className={`card-base p-4 text-center ${s.color}`}>
              <p className="text-2xl font-bold text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Type breakdown */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Student Complaints', value: counts.student, icon: GraduationCap, color: 'bg-blue-50 text-blue-700' },
            { label: 'Guardian Complaints', value: counts.guardian, icon: Users, color: 'bg-purple-50 text-purple-700' },
          ].map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={i} className={`card-base p-4 flex items-center gap-3 ${s.color}`}>
                <Icon size={22} />
                <div>
                  <p className="text-xl font-bold">{s.value}</p>
                  <p className="text-xs font-medium opacity-80">{s.label}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Search */}
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, tracking ID, mobile, or subject..."
          className="input-base"
        />

        {/* Type filter */}
        <div className="flex gap-2 flex-wrap">
          {([
            { key: 'all', label: `All Types (${counts.all})` },
            { key: 'student', label: `Student (${counts.student})` },
            { key: 'guardian', label: `Guardian (${counts.guardian})` },
          ] as const).map(f => (
            <button
              key={f.key}
              onClick={() => setTypeFilter(f.key)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${typeFilter === f.key ? 'bg-primary text-primary-foreground' : 'bg-secondary text-foreground hover:bg-accent'}`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Status filter tabs */}
        <div className="flex gap-2 flex-wrap">
          {([
            { key: 'all', label: `All Status (${counts.all})` },
            { key: 'pending', label: `Pending (${counts.pending})` },
            { key: 'under_review', label: `Under Review (${counts.under_review})` },
            { key: 'resolved', label: `Resolved (${counts.resolved})` },
            { key: 'rejected', label: `Rejected (${counts.rejected})` },
          ] as const).map(f => (
            <button
              key={f.key}
              onClick={() => setStatusFilter(f.key)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${statusFilter === f.key ? 'bg-foreground text-background' : 'bg-secondary text-foreground hover:bg-accent'}`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* List */}
        {filtered.length === 0 ? (
          <div className="text-center py-12 bg-secondary rounded-2xl">
            <MessageSquare size={40} className="text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No complaints found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(c => (
              <div
                key={c.id}
                className={`card-base p-5 cursor-pointer hover:shadow-md transition-all duration-200 border-l-4 ${
                  c.status === 'resolved' ? 'border-green-400' :
                  c.status === 'rejected' ? 'border-red-400' :
                  c.status === 'under_review' ? 'border-blue-400' :
                  'border-amber-400'
                }`}
                onClick={() => setSelectedComplaint(c)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <p className="font-bold text-sm text-foreground">{c.name}</p>
                      <span className="text-xs text-muted-foreground">•</span>
                      <p className="text-xs text-muted-foreground">{c.mobile}</p>
                      {c.id && (
                        <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-0.5 rounded-full">{c.id}</span>
                      )}
                      <TypeBadge type={c.complaintType || 'student'} />
                      <StatusBadge status={c.status} />
                    </div>
                    <p className="text-sm font-semibold text-primary mb-1">{c.subject}</p>
                    <p className="text-sm text-foreground/75 leading-relaxed line-clamp-2">{c.message}</p>
                    {c.adminReply && (
                      <div className="mt-2 text-xs text-muted-foreground bg-secondary/60 rounded-lg px-3 py-1.5 line-clamp-1">
                        <span className="font-semibold text-primary">Reply:</span> {c.adminReply}
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(c.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                  <div className="shrink-0 flex items-center gap-1.5">
                    <Eye size={15} className="text-primary" />
                    <ChevronDown size={13} className="text-muted-foreground -rotate-90" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedComplaint && (
        <ComplaintDetailModal
          complaint={selectedComplaint}
          onClose={() => setSelectedComplaint(null)}
        />
      )}
    </AdminLayout>
  );
}
