import { Link } from 'react-router-dom';
import { User, Eye } from 'lucide-react';
import { useState } from 'react';
import type { Teacher } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';

interface TeacherCardProps {
  teacher: Teacher;
}

export default function TeacherCard({ teacher }: TeacherCardProps) {
  const { t } = useLanguage();
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <div className="card-base p-5 flex flex-col items-center text-center group">
      <div className="w-24 h-24 rounded-full overflow-hidden bg-accent mb-4 ring-4 ring-border group-hover:ring-primary transition-all duration-300">
        {teacher.photo ? (
          <img
            src={teacher.photo}
            alt={teacher.name_bn}
            onLoad={() => setImgLoaded(true)}
            className="w-full h-full object-cover transition-opacity duration-300"
            style={{ opacity: imgLoaded ? 1 : 0 }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-secondary">
            <User size={36} className="text-muted-foreground" />
          </div>
        )}
      </div>
      <h3 className="text-base font-bold text-foreground mb-0.5">
        {t(teacher.name_bn, teacher.name_en)}
      </h3>
      {(teacher.designation_bn || teacher.designation_en) && (
        <p className="text-sm font-semibold text-primary mb-0.5">
          {t(teacher.designation_bn, teacher.designation_en)}
        </p>
      )}
      <p className="text-sm text-muted-foreground mb-4 leading-relaxed line-clamp-2">
        {t(teacher.qualification_bn, teacher.qualification_en)}
      </p>
      <Link
        to={`/teachers/${teacher.id}`}
        className="flex items-center gap-2 text-sm font-semibold text-primary hover:bg-primary hover:text-primary-foreground px-4 py-2 rounded-lg border border-primary transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
      >
        <Eye size={15} />
        {t('বিস্তারিত দেখুন', 'View Details')}
      </Link>
    </div>
  );
}
