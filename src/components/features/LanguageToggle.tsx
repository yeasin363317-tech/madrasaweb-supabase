import { useLanguage } from '@/contexts/LanguageContext';

export default function LanguageToggle() {
  const { lang, toggleLanguage } = useLanguage();
  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-1.5 bg-secondary hover:bg-accent text-foreground border border-border rounded-full px-3 py-1.5 text-xs font-semibold transition-all duration-200"
      aria-label="Toggle language"
    >
      <span className={lang === 'bn' ? 'text-primary font-bold' : 'opacity-50'}>বাং</span>
      <span className="w-px h-3 bg-border" />
      <span className={lang === 'en' ? 'text-primary font-bold' : 'opacity-50'}>EN</span>
    </button>
  );
}
