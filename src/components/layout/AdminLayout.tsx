import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  LayoutDashboard, Users, FileText, BookOpen, Tag, Bell, Image, MessageSquare,
  Info, Settings, Shield, ScrollText, LogOut, Menu, ChevronRight
} from 'lucide-react';
import { adminLogout } from '@/lib/auth';
import { toast } from 'sonner';

const menuItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { to: '/admin/teachers', label: 'Teachers', icon: Users },
  { to: '/admin/results', label: 'Results', icon: FileText },
  { to: '/admin/classes', label: 'Classes', icon: BookOpen },
  { to: '/admin/subjects', label: 'Subjects', icon: Tag },
  { to: '/admin/notices', label: 'Notices', icon: Bell },
  { to: '/admin/gallery', label: 'Gallery', icon: Image },
  { to: '/admin/complaints', label: 'Complaints', icon: MessageSquare },
  { to: '/admin/madrasa-info', label: 'Madrasa Info', icon: Info },
  { to: '/admin/settings', label: 'Website Settings', icon: Settings },
  { to: '/admin/privacy-policy', label: 'Privacy Policy', icon: Shield },
  { to: '/admin/terms', label: 'Terms & Conditions', icon: ScrollText },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await adminLogout();
      toast.success('Logged out successfully');
      navigate('/admin/login');
    } catch {
      toast.error('Logout failed');
    }
  };

  const isActive = (item: typeof menuItems[0]) => {
    if (item.exact) return location.pathname === item.to;
    return location.pathname.startsWith(item.to);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-sidebar-border">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-sidebar-primary flex items-center justify-center">
            <BookOpen size={16} className="text-sidebar-primary-foreground" />
          </div>
          <div>
            <p className="text-xs font-bold text-sidebar-foreground leading-tight">Admin Panel</p>
            <p className="text-xs text-muted-foreground">Madrasa</p>
          </div>
        </Link>
      </div>
      <nav className="flex-1 p-3 overflow-y-auto space-y-0.5">
        {menuItems.map(item => {
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setSidebarOpen(false)}
              className={`admin-sidebar-link ${isActive(item) ? 'active' : ''}`}
            >
              <Icon size={16} />
              <span>{item.label}</span>
              {isActive(item) && <ChevronRight size={14} className="ml-auto" />}
            </Link>
          );
        })}
      </nav>
      <div className="p-3 border-t border-sidebar-border">
        <button onClick={handleLogout} className="admin-sidebar-link w-full text-destructive hover:bg-red-50">
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-60 bg-sidebar shrink-0 border-r border-sidebar-border">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <aside className="relative w-64 bg-sidebar h-full shadow-xl">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-border px-4 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-accent transition-colors"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={20} />
            </button>
            <h1 className="text-sm font-semibold text-foreground">
              {menuItems.find(m => isActive(m))?.label || 'Admin'}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/" className="text-xs text-primary hover:underline">View Site</Link>
            <button onClick={handleLogout} className="p-2 rounded-lg hover:bg-red-50 text-destructive transition-colors">
              <LogOut size={16} />
            </button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
