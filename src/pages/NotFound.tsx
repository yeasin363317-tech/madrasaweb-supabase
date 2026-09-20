import { Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Home, BookOpen } from 'lucide-react';

export default function NotFound() {
  const location = useLocation();

  useEffect(() => {
    console.error('404 Error: User attempted to access non-existent route:', location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
          <BookOpen size={36} className="text-primary" />
        </div>
        <h1 className="text-6xl font-bold text-primary mb-3">৪০৪</h1>
        <p className="text-xl font-semibold text-foreground mb-2">পৃষ্ঠা পাওয়া যায়নি</p>
        <p className="text-muted-foreground text-sm mb-8">
          আপনি যে পৃষ্ঠাটি খুঁজছেন তা বিদ্যমান নয় বা সরানো হয়েছে।
        </p>
        <Link to="/" className="btn-primary inline-flex">
          <Home size={16} /> হোম পেজে ফিরুন
        </Link>
      </div>
    </div>
  );
}
