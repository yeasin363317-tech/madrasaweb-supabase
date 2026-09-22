import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useData } from '@/contexts/DataContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Reveal from '@/components/features/Reveal';
import PageHeader from '@/components/layout/PageHeader';

export default function Contact() {
  const { t } = useLanguage();
  const { data } = useData();
  const { madrasaInfo } = data;

  const contacts = [
    {
      icon: MapPin,
      label: t('ঠিকানা', 'Address'),
      value: t(madrasaInfo.address_bn, madrasaInfo.address_en),
      href: undefined,
    },
    {
      icon: Phone,
      label: t('ফোন ১', 'Phone 1'),
      value: madrasaInfo.phone1,
      href: `tel:${madrasaInfo.phone1}`,
    },
    {
      icon: Phone,
      label: t('ফোন ২', 'Phone 2'),
      value: madrasaInfo.phone2,
      href: `tel:${madrasaInfo.phone2}`,
    },
    {
      icon: Mail,
      label: t('ইমেইল', 'Email'),
      value: madrasaInfo.email,
      href: `mailto:${madrasaInfo.email}`,
    },
    {
      icon: Clock,
      label: t('অফিস সময়', 'Office Hours'),
      value: t(madrasaInfo.officeHours_bn || 'শনি–বৃহস্পতি: সকাল ৮টা – বিকাল ৪টা', madrasaInfo.officeHours_en || 'Sat–Thu: 8:00 AM – 4:00 PM'),
      href: undefined,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <PageHeader title={t('যোগাযোগ', 'Contact Us')} subtitle={t('আমাদের সাথে যোগাযোগ করুন', 'Get in touch with us')} />

      <div className="section-padding">
        <div className="container-max">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Contact Info */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-foreground mb-6">
                {t('যোগাযোগের তথ্য', 'Contact Information')}
              </h2>
              {contacts.map((c, i) => {
                const Icon = c.icon;
                return (
                  <Reveal key={i} delay={i * 70}>
                  <div className="card-base p-5 flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl tint tint-green flex items-center justify-center shrink-0 hover:!transform-none">
                      <Icon size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground mb-0.5">{c.label}</p>
                      {c.href ? (
                        <a href={c.href} className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                          {c.value}
                        </a>
                      ) : (
                        <p className="text-sm font-medium text-foreground">{c.value}</p>
                      )}
                    </div>
                  </div>
                  </Reveal>
                );
              })}
            </div>

            {/* Map */}
            <Reveal variant="right">
              <h2 className="text-xl font-bold text-foreground mb-6">
                {t('মানচিত্রে আমাদের অবস্থান', 'Our Location on Map')}
              </h2>
              <div className="rounded-2xl overflow-hidden border border-border shadow-sm aspect-video bg-secondary">
                {madrasaInfo.mapEmbed ? (
                  <iframe
                    src={madrasaInfo.mapEmbed}
                    className="w-full h-full"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Madrasa Location"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      <MapPin size={48} className="mx-auto mb-3" />
                      <p className="text-sm">{t('মানচিত্র উপলব্ধ নয়', 'Map not available')}</p>
                    </div>
                  </div>
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
