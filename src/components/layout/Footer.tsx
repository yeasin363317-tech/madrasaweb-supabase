import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Facebook, Youtube, BookOpen, Code2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useData } from '@/contexts/DataContext';

export default function Footer() {
  const { t, isBn } = useLanguage();
  const { data } = useData();
  const { madrasaInfo, websiteSettings } = data;

  return (
    <footer className="bg-primary text-primary-foreground mt-16">
      {/* Islamic pattern strip */}
      <div className="h-1 bg-gradient-to-r from-green-800 via-green-400 to-green-800 opacity-60" />

      <div className="section-padding py-12">
        <div className="container-max grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {/* About */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              {madrasaInfo.logo ? (
                <img src={madrasaInfo.logo} alt="logo" className="w-12 h-12 rounded-full object-cover" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  <BookOpen size={24} className="text-white" />
                </div>
              )}
              <div>
                <h3 className="font-bold text-sm leading-tight">
                  {t(madrasaInfo.name_bn, madrasaInfo.name_en)}
                </h3>
              </div>
            </div>
            <p className="text-sm text-white/80 leading-relaxed">
              {t(madrasaInfo.about_bn, madrasaInfo.about_en)}
            </p>
            {(websiteSettings.facebookUrl || websiteSettings.youtubeUrl) && (
              <div className="flex items-center gap-3 mt-4">
                {websiteSettings.facebookUrl && (
                  <a href={websiteSettings.facebookUrl} target="_blank" rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors">
                    <Facebook size={16} />
                  </a>
                )}
                {websiteSettings.youtubeUrl && (
                  <a href={websiteSettings.youtubeUrl} target="_blank" rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors">
                    <Youtube size={16} />
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-base mb-4 border-b border-white/20 pb-2">
              {t('গুরুত্বপূর্ণ লিঙ্ক', 'Quick Links')}
            </h3>
            <ul className="space-y-2">
              {[
                { to: '/', label: t('হোম', 'Home') },
                { to: '/about', label: t('মাদ্রাসা পরিচিতি', 'About') },
                { to: '/teachers', label: t('শিক্ষকমণ্ডলী', 'Teachers') },
                { to: '/results', label: t('ফলাফল', 'Results') },
                { to: '/notices', label: t('নোটিশ বোর্ড', 'Notices') },
                { to: '/gallery', label: t('গ্যালারি', 'Gallery') },
                { to: '/complaint', label: t('অভিযোগ', 'Complaint') },
                { to: '/privacy-policy', label: t('গোপনীয়তা নীতি', 'Privacy Policy') },
                { to: '/terms', label: t('শর্তাবলী', 'Terms') },
              ].map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-white/80 hover:text-white transition-colors hover:underline">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-base mb-4 border-b border-white/20 pb-2">
              {t('যোগাযোগ', 'Contact Us')}
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-white/80">
                <MapPin size={16} className="mt-0.5 shrink-0" />
                <span>{t(madrasaInfo.address_bn, madrasaInfo.address_en)}</span>
              </li>
              <li>
                <a href={`tel:${madrasaInfo.phone1}`} className="flex items-center gap-3 text-sm text-white/80 hover:text-white transition-colors">
                  <Phone size={16} className="shrink-0" />
                  <span>{madrasaInfo.phone1}</span>
                </a>
              </li>
              {madrasaInfo.phone2 && (
                <li>
                  <a href={`tel:${madrasaInfo.phone2}`} className="flex items-center gap-3 text-sm text-white/80 hover:text-white transition-colors">
                    <Phone size={16} className="shrink-0" />
                    <span>{madrasaInfo.phone2}</span>
                  </a>
                </li>
              )}
              <li>
                <a href={`mailto:${madrasaInfo.email}`} className="flex items-center gap-3 text-sm text-white/80 hover:text-white transition-colors">
                  <Mail size={16} className="shrink-0" />
                  <span>{madrasaInfo.email}</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/20 py-5 px-4">
        <div className="container-max flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/60">
            {isBn ? websiteSettings.footerText_bn : websiteSettings.footerText_en}
          </p>

          {/* Developer Credit Badge — clickable */}
          <a
            href="https://yeasin363317-tech.github.io/Developer-Yeasin-Official/"
            target="_blank"
            rel="noopener noreferrer"
            className="dev-credit-sweep relative overflow-hidden inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-opacity hover:opacity-80"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.06) 100%)',
              border: '1px solid rgba(255,255,255,0.20)',
              backdropFilter: 'blur(8px)',
              color: 'rgba(255,255,255,0.85)',
              boxShadow: '0 2px 12px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.1)',
            }}
          >
            <Code2 size={13} style={{ color: 'rgba(134,239,172,0.9)' }} />
            <span>Created By Developer</span>
            <span style={{ color: 'rgba(134,239,172,1)', fontWeight: 700 }}>Yeasin Arafat</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
