import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Menu, X, Phone, Mail, BookOpen, ShieldCheck, Code2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useData } from '@/contexts/DataContext';
import LanguageToggle from '@/components/features/LanguageToggle';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { t } = useLanguage();
  const { data } = useData();
  const location = useLocation();

  // Fix: scroll to top whenever route changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    setMobileOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { to: '/', label: t('হোম', 'Home') },
    { to: '/about', label: t('মাদ্রাসা পরিচিতি', 'About') },
    { to: '/teachers', label: t('শিক্ষকমণ্ডলী', 'Teachers') },
    { to: '/results', label: t('ফলাফল', 'Results') },
    { to: '/notices', label: t('নোটিশ বোর্ড', 'Notices') },
    { to: '/gallery', label: t('গ্যালারি', 'Gallery') },
    { to: '/contact', label: t('যোগাযোগ', 'Contact') },
  ];

  const adminLink = { to: '/admin/login', label: t('প্রশাসন', 'Admin Panel') };

  const isActive = (to: string) => location.pathname === to;

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-border">
      {/* Top bar */}
      <div className="bg-primary text-primary-foreground py-1.5 px-4">
        <div className="container-max flex items-center justify-between text-xs gap-4">
          <div className="flex items-center gap-4 flex-wrap">
            <a href={`tel:${data.madrasaInfo.phone1}`} className="flex items-center gap-1.5 hover:opacity-80 transition-opacity">
              <Phone size={11} />
              <span>{data.madrasaInfo.phone1}</span>
            </a>
            <a href={`mailto:${data.madrasaInfo.email}`} className="flex items-center gap-1.5 hover:opacity-80 transition-opacity hidden sm:flex">
              <Mail size={11} />
              <span>{data.madrasaInfo.email}</span>
            </a>
          </div>

          <div className="flex items-center gap-3">
            {/* Developer Credit Badge — top bar (desktop) */}
            <a
              href="https://yeasin363317-tech.github.io/Developer-Yeasin-Official/"
              target="_blank"
              rel="noopener noreferrer"
              className="dev-credit-sweep relative overflow-hidden hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold transition-opacity hover:opacity-80"
              style={{
                background: 'rgba(255,255,255,0.12)',
                border: '1px solid rgba(255,255,255,0.22)',
                backdropFilter: 'blur(6px)',
                color: 'rgba(255,255,255,0.80)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1)',
              }}
            >
              <Code2 size={10} style={{ color: 'rgba(134,239,172,0.9)' }} />
              <span>Dev:</span>
              <span style={{ color: 'rgba(187,247,208,1)', fontWeight: 700 }}>Yeasin Arafat</span>
            </a>
            <LanguageToggle />
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div className="px-4 py-3">
        <div className="container-max flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            {data.madrasaInfo.logo ? (
              <img src={data.madrasaInfo.logo} alt="logo" className="w-10 h-10 rounded-full object-cover" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                <BookOpen size={20} className="text-primary-foreground" />
              </div>
            )}
            <div className="hidden sm:block">
              <p className="text-sm font-bold text-primary leading-tight">
                {t(data.madrasaInfo.name_bn, data.madrasaInfo.name_en)}
              </p>
              <p className="text-xs text-muted-foreground">
                {t('ফাজিল মাদ্রাসা', 'Fazil Madrasa')}
              </p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(link.to)
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-foreground hover:bg-accent hover:text-accent-foreground hover:-translate-y-px'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to={adminLink.to}
              className="ml-1 flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-all duration-200 border border-border hover:border-primary/40 hover:-translate-y-px"
            >
              <ShieldCheck size={14} />
              {adminLink.label}
            </Link>
          </nav>

          {/* Mobile toggle */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-accent transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-border px-4 py-3">
          <nav className="flex flex-col gap-1">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive(link.to)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-accent'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/complaint"
              onClick={() => setMobileOpen(false)}
              className="px-4 py-3 rounded-lg text-sm font-medium text-destructive hover:bg-red-50 transition-all duration-150"
            >
              {t('অভিযোগ', 'Complaint')}
            </Link>
            <Link
              to="/admin/login"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:bg-accent transition-all duration-150 border border-border mt-1"
            >
              <ShieldCheck size={14} />
              {adminLink.label}
            </Link>

            {/* Developer Credit — mobile menu bottom */}
            <div className="mt-2 pt-2 border-t border-border">
              <a
                href="https://yeasin363317-tech.github.io/Developer-Yeasin-Official/"
                target="_blank"
                rel="noopener noreferrer"
                className="dev-credit-sweep relative overflow-hidden inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold transition-opacity hover:opacity-70"
                style={{
                  background: 'linear-gradient(135deg, hsl(145 63% 30% / 0.10) 0%, hsl(145 63% 30% / 0.05) 100%)',
                  border: '1px solid hsl(145 63% 30% / 0.25)',
                  color: 'hsl(145 63% 25%)',
                }}
              >
                <Code2 size={11} className="text-primary" />
                <span className="text-muted-foreground">Created By</span>
                <span className="text-primary font-bold">Yeasin Arafat</span>
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
