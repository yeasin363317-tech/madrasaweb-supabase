import { useLanguage } from '@/contexts/LanguageContext';

export default function LanguageToggle() {
  const { lang, toggleLanguage } = useLanguage();
  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 text-white rounded-full px-3 py-1 text-xs font-semibold transition-all duration-200"
      aria-label="Toggle language"
    >
      <span className={lang === 'bn' ? 'opacity-100' : 'opacity-50'}>বাং</span>
      <span className="w-px h-3 bg-white/40" />
      <span className={lang === 'en' ? 'opacity-100' : 'opacity-50'}>EN</span>
    </button>
  );
}
