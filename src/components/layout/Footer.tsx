import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Facebook, Youtube, BookOpen, Code2, Clock } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useData } from '@/contexts/DataContext';

export default function Footer() {
  const { t, isBn } = useLanguage();
  const { data } = useData();
  const { madrasaInfo, websiteSettings } = data;

  const links = [
    { to: '/', label: t('হোম', 'Home') },
    { to: '/about', label: t('মাদ্রাসা পরিচিতি', 'About') },
    { to: '/teachers', label: t('শিক্ষকমণ্ডলী', 'Teachers') },
    { to: '/results', label: t('ফলাফল', 'Results') },
    { to: '/notices', label: t('নোটিশ বোর্ড', 'Notices') },
    { to: '/gallery', label: t('গ্যালারি', 'Gallery') },
    { to: '/complaint', label: t('অভিযোগ', 'Complaint') },
    { to: '/privacy-policy', label: t('গোপনীয়তা নীতি', 'Privacy Policy') },
    { to: '/terms', label: t('শর্তাবলী', 'Terms') },
  ];

  return (
    <footer className="bg-secondary border-t border-border mt-16">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
        {/* About */}
        <div className="lg:col-span-5">
          <div className="flex items-center gap-3 mb-4">
            {madrasaInfo.logo ? (
              <img src={madrasaInfo.logo} alt="logo" className="w-12 h-12 rounded-full object-cover" />
            ) : (
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                <BookOpen size={22} className="text-primary-foreground" />
              </div>
            )}
            <h3 className="font-bold text-base leading-tight text-foreground">
              {t(madrasaInfo.name_bn, madrasaInfo.name_en)}
            </h3>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4">
            {t(madrasaInfo.about_bn, madrasaInfo.about_en)}
          </p>
          {(websiteSettings.facebookUrl || websiteSettings.youtubeUrl) && (
            <div className="flex items-center gap-3 mt-4">
              {websiteSettings.facebookUrl && (
                <a href={websiteSettings.facebookUrl} target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white border border-border text-primary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                  <Facebook size={16} />
                </a>
              )}
              {websiteSettings.youtubeUrl && (
                <a href={websiteSettings.youtubeUrl} target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white border border-border text-primary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                  <Youtube size={16} />
                </a>
              )}
            </div>
          )}
        </div>

        {/* Quick links */}
        <div className="lg:col-span-3">
          <h3 className="font-bold text-base mb-4 text-foreground">
            {t('গুরুত্বপূর্ণ লিঙ্ক', 'Quick Links')}
          </h3>
          <ul className="grid grid-cols-2 lg:grid-cols-1 gap-x-4 gap-y-2">
            {links.map(link => (
              <li key={link.to}>
                <Link to={link.to} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div className="lg:col-span-4">
          <h3 className="font-bold text-base mb-4 text-foreground">
            {t('যোগাযোগ', 'Contact Us')}
          </h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-3 text-sm text-muted-foreground">
              <MapPin size={16} className="mt-0.5 shrink-0 text-primary" />
              <span>{t(madrasaInfo.address_bn, madrasaInfo.address_en)}</span>
            </li>
            <li>
              <a href={`tel:${madrasaInfo.phone1}`} className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors">
                <Phone size={16} className="shrink-0 text-primary" />
                <span>{madrasaInfo.phone1}</span>
              </a>
            </li>
            {madrasaInfo.phone2 && (
              <li>
                <a href={`tel:${madrasaInfo.phone2}`} className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors">
                  <Phone size={16} className="shrink-0 text-primary" />
                  <span>{madrasaInfo.phone2}</span>
                </a>
              </li>
            )}
            <li>
              <a href={`mailto:${madrasaInfo.email}`} className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors break-all">
                <Mail size={16} className="shrink-0 text-primary" />
                <span>{madrasaInfo.email}</span>
              </a>
            </li>
            {(madrasaInfo.officeHours_bn || madrasaInfo.officeHours_en) && (
              <li className="flex items-start gap-3 text-sm text-muted-foreground">
                <Clock size={16} className="mt-0.5 shrink-0 text-primary" />
                <span>{t(madrasaInfo.officeHours_bn, madrasaInfo.officeHours_en)}</span>
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="border-t border-border bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground text-center sm:text-left">
            {isBn ? websiteSettings.footerText_bn : websiteSettings.footerText_en}
          </p>
          <a
            href="https://yeasin363317-tech.github.io/Developer-Yeasin-Official/"
            target="_blank"
            rel="noopener noreferrer"
            className="dev-credit-sweep relative overflow-hidden inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold bg-secondary border border-border hover:border-primary/40 transition-colors"
          >
            <Code2 size={13} className="text-primary" />
            <span className="text-muted-foreground">Created By Developer</span>
            <span className="text-primary font-bold">Yeasin Arafat</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
