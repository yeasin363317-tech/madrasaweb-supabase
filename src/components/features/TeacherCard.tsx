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
    <div className="card-base overflow-hidden flex flex-col text-center group h-full">
      <div className="h-20 tint tint-green !rounded-none !border-0 group-hover:!transform-none relative overflow-hidden">
        <div className="absolute -right-6 -top-8 w-28 h-28 rounded-full bg-white/50" aria-hidden="true" />
        <div className="absolute left-4 -bottom-10 w-24 h-24 rounded-full bg-white/40" aria-hidden="true" />
      </div>

      <div className="px-5 pb-6 -mt-12 flex flex-col items-center flex-1">
        <div className="w-24 h-24 rounded-full overflow-hidden bg-secondary ring-4 ring-white shadow-md mb-4 transition-transform duration-500 group-hover:scale-105">
          {teacher.photo ? (
            <img
              src={teacher.photo}
              alt={teacher.name_bn}
              loading="lazy"
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
          <p className="text-sm font-semibold text-primary mb-1">
            {t(teacher.designation_bn, teacher.designation_en)}
          </p>
        )}
        <p className="text-sm text-muted-foreground mb-5 leading-relaxed line-clamp-2 min-h-[1.25rem]">
          {t(teacher.qualification_bn, teacher.qualification_en)}
        </p>
        <Link
          to={`/teachers/${teacher.id}`}
          className="mt-auto flex items-center gap-2 text-sm font-semibold text-primary hover:bg-primary hover:text-primary-foreground px-5 py-2 rounded-full border border-primary transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
        >
          <Eye size={15} />
          {t('বিস্তারিত দেখুন', 'View Details')}
        </Link>
      </div>
    </div>
  );
}
