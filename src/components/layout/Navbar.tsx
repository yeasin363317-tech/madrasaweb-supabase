import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  Menu, X, BookOpen, ShieldCheck, Code2,
  Home, Info, Users, GraduationCap, Bell, Images, Phone, MessageSquare,
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useData } from '@/contexts/DataContext';
import LanguageToggle from '@/components/features/LanguageToggle';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const { t } = useLanguage();
  const { data } = useData();
  const location = useLocation();

  // Scroll to top whenever the route changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    setMobileOpen(false);
  }, [location.pathname]);

  // Shadow + reading progress
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 12);
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(h > 0 ? Math.min(100, Math.round((y / h) * 100)) : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { to: '/', label: t('হোম', 'Home'), icon: Home },
    { to: '/about', label: t('পরিচিতি', 'About'), icon: Info },
    { to: '/teachers', label: t('শিক্ষকমণ্ডলী', 'Teachers'), icon: Users },
    { to: '/results', label: t('ফলাফল', 'Results'), icon: GraduationCap },
    { to: '/notices', label: t('নোটিশ', 'Notices'), icon: Bell },
    { to: '/gallery', label: t('গ্যালারি', 'Gallery'), icon: Images },
    { to: '/contact', label: t('যোগাযোগ', 'Contact'), icon: Phone },
    { to: '/complaint', label: t('অভিযোগ', 'Complaint'), icon: MessageSquare },
  ];

  const isActive = (to: string) => location.pathname === to;

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        scrolled
          ? 'bg-white/90 backdrop-blur-md border-border shadow-[0_4px_20px_rgba(16,24,40,0.07)]'
          : 'bg-white border-transparent'
      }`}
    >
      <div
        className={`max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between gap-4 transition-all duration-300 ${
          scrolled ? 'h-14 md:h-16' : 'h-16 md:h-[76px]'
        }`}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 min-w-0 group">
          {data.madrasaInfo.logo ? (
            <img
              src={data.madrasaInfo.logo}
              alt="logo"
              className="w-10 h-10 md:w-11 md:h-11 rounded-full object-cover shrink-0 transition-transform duration-300 group-hover:rotate-6"
            />
          ) : (
            <div className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-primary flex items-center justify-center shrink-0">
              <BookOpen size={20} className="text-primary-foreground" />
            </div>
          )}
          <div className="min-w-0">
            <p className="text-sm md:text-base font-bold text-foreground leading-tight truncate max-w-[200px] sm:max-w-[320px]">
              {t(data.madrasaInfo.name_bn, data.madrasaInfo.name_en)}
            </p>
            <p className="text-[11px] md:text-xs text-muted-foreground">
              {t('ফাজিল মাদ্রাসা', 'Fazil Madrasa')}
            </p>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden xl:flex items-center gap-1">
          {navLinks.map(link => {
            const Icon = link.icon;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  isActive(link.to)
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-foreground/80 hover:bg-secondary hover:text-primary'
                }`}
              >
                <Icon size={15} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 shrink-0">
          <LanguageToggle />
          <Link
            to="/admin/login"
            className="hidden xl:flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium text-muted-foreground border border-border hover:border-primary/40 hover:text-primary transition-all duration-200"
          >
            <ShieldCheck size={15} />
            {t('এডমিন', 'Admin')}
          </Link>
          <button
            className="xl:hidden p-2 rounded-xl hover:bg-secondary transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile / tablet menu (animated open/close) */}
      <div
        className="xl:hidden grid bg-white"
        style={{
          gridTemplateRows: mobileOpen ? '1fr' : '0fr',
          visibility: mobileOpen ? 'visible' : 'hidden',
          transition: `grid-template-rows 300ms ease, visibility 0s linear ${mobileOpen ? '0s' : '300ms'}`,
        }}
      >
        <div className="overflow-hidden">
          <div className="border-t border-border px-4 py-3 shadow-lg">
            <nav className="grid grid-cols-2 gap-2 max-w-xl mx-auto">
              {navLinks.map(link => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150 ${
                      isActive(link.to)
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-foreground hover:bg-accent'
                    }`}
                  >
                    <Icon size={16} />
                    {link.label}
                  </Link>
                );
              })}
              <Link
                to="/admin/login"
                onClick={() => setMobileOpen(false)}
                className="col-span-2 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground border border-border"
              >
                <ShieldCheck size={15} />
                {t('এডমিন প্যানেল', 'Admin Panel')}
              </Link>
            </nav>
            <div className="mt-3 pt-3 border-t border-border text-center">
              <a
                href="https://yeasin363317-tech.github.io/Developer-Yeasin-Official/"
                target="_blank"
                rel="noopener noreferrer"
                className="dev-credit-sweep relative overflow-hidden inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold bg-secondary border border-border"
              >
                <Code2 size={11} className="text-primary" />
                <span className="text-muted-foreground">Created By</span>
                <span className="text-primary font-bold">Yeasin Arafat</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Reading progress */}
      <div
        className="absolute left-0 bottom-[-1px] h-[3px] w-full origin-left bg-gradient-to-r from-green-600 to-emerald-400 pointer-events-none"
        style={{ transform: `scaleX(${progress / 100})`, transition: 'transform 120ms linear' }}
        aria-hidden="true"
      />
    </header>
  );
}
