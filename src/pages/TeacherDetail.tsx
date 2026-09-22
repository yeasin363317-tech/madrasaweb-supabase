import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Phone, Mail, User, Briefcase } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useData } from '@/contexts/DataContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import PageHeader from '@/components/layout/PageHeader';

export default function TeacherDetail() {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();
  const { data } = useData();
  const teacher = data.teachers.find(tc => tc.id === id);

  if (!teacher) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="section-padding text-center">
          <p className="text-lg text-muted-foreground">{t('শিক্ষক পাওয়া যায়নি', 'Teacher not found')}</p>
          <Link to="/teachers" className="btn-primary mt-4 inline-flex">
            <ArrowLeft size={16} /> {t('ফিরে যান', 'Go Back')}
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <PageHeader title={t('শিক্ষক বিবরণ', 'Teacher Details')} />

      <div className="section-padding">
        <div className="container-max max-w-2xl">
          <Link to="/teachers" className="inline-flex items-center gap-2 text-sm text-primary hover:underline mb-6">
            <ArrowLeft size={16} /> {t('সকল শিক্ষক', 'All Teachers')}
          </Link>

          <div className="card-base p-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8">
              <div className="w-28 h-28 rounded-full overflow-hidden bg-secondary ring-4 ring-primary/20 shrink-0">
                {teacher.photo ? (
                  <img src={teacher.photo} alt={teacher.name_bn} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User size={48} className="text-muted-foreground" />
                  </div>
                )}
              </div>
              <div className="text-center sm:text-left">
                <h2 className="text-2xl font-bold text-foreground mb-1">
                  {t(teacher.name_bn, teacher.name_en)}
                </h2>
                {(teacher.designation_bn || teacher.designation_en) && (
                  <p className="text-base text-primary font-bold mb-1">
                    {t(teacher.designation_bn, teacher.designation_en)}
                  </p>
                )}
                <p className="text-sm text-muted-foreground font-medium">
                  {t(teacher.qualification_bn, teacher.qualification_en)}
                </p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              {(teacher.designation_bn || teacher.designation_en) && (
                <div className="flex items-center gap-3 p-4 bg-secondary rounded-xl">
                  <Briefcase size={18} className="text-primary shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">{t('পদবী', 'Designation')}</p>
                    <p className="text-sm font-semibold text-foreground">
                      {t(teacher.designation_bn, teacher.designation_en)}
                    </p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3 p-4 bg-secondary rounded-xl">
                <Phone size={18} className="text-primary shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">{t('মোবাইল', 'Mobile')}</p>
                  <a href={`tel:${teacher.mobile}`} className="text-sm font-semibold text-foreground hover:text-primary transition-colors">
                    {teacher.mobile || '—'}
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-secondary rounded-xl">
                <Mail size={18} className="text-primary shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">{t('ইমেইল', 'Email')}</p>
                  <a href={`mailto:${teacher.email}`} className="text-sm font-semibold text-foreground hover:text-primary transition-colors break-all">
                    {teacher.email || '—'}
                  </a>
                </div>
              </div>
            </div>

            {(teacher.about_bn || teacher.about_en) && (
              <div>
                <h3 className="text-base font-bold text-foreground mb-3 border-b border-border pb-2">
                  {t('সম্পর্কে', 'About')}
                </h3>
                <p className="text-sm text-foreground/80 leading-relaxed">
                  {t(teacher.about_bn, teacher.about_en)}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
