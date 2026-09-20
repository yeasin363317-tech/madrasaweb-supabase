import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { DataProvider } from '@/contexts/DataContext';
import AdminGuard from '@/components/features/AdminGuard';
import { lazy, Suspense } from 'react';

// ─── Lazy-loaded Public Pages ────────────────────────────────────────────────
const Index         = lazy(() => import('./pages/Index'));
const About         = lazy(() => import('./pages/About'));
const Teachers      = lazy(() => import('./pages/Teachers'));
const TeacherDetail = lazy(() => import('./pages/TeacherDetail'));
const Results       = lazy(() => import('./pages/Results'));
const Notices       = lazy(() => import('./pages/Notices'));
const Gallery       = lazy(() => import('./pages/Gallery'));
const Complaint     = lazy(() => import('./pages/Complaint'));
const Contact       = lazy(() => import('./pages/Contact'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsConditions = lazy(() => import('./pages/TermsConditions'));
const NotFound      = lazy(() => import('./pages/NotFound'));

// ─── Lazy-loaded Admin Pages ─────────────────────────────────────────────────
const AdminLogin           = lazy(() => import('./pages/AdminLogin'));
const AdminDashboard       = lazy(() => import('./pages/admin/Dashboard'));
const AdminTeachers        = lazy(() => import('./pages/admin/AdminTeachers'));
const AdminResults         = lazy(() => import('./pages/admin/AdminResults'));
const AdminClasses         = lazy(() => import('./pages/admin/AdminClasses'));
const AdminSubjects        = lazy(() => import('./pages/admin/AdminSubjects'));
const AdminNotices         = lazy(() => import('./pages/admin/AdminNotices'));
const AdminGallery         = lazy(() => import('./pages/admin/AdminGallery'));
const AdminComplaints      = lazy(() => import('./pages/admin/AdminComplaints'));
const AdminMadrasaInfo     = lazy(() => import('./pages/admin/AdminMadrasaInfo'));
const AdminWebsiteSettings = lazy(() => import('./pages/admin/AdminWebsiteSettings'));
const AdminPrivacyPolicy   = lazy(() => import('./pages/admin/AdminPrivacyPolicy'));
const AdminTerms           = lazy(() => import('./pages/admin/AdminTerms'));

// ─── Minimal page-level loading skeleton ────────────────────────────────────
function PageLoader() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
        <p className="text-sm text-muted-foreground font-medium">লোড হচ্ছে...</p>
      </div>
    </div>
  );
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,   // 5 min — reduces redundant refetches
      gcTime: 10 * 60 * 1000,     // 10 min cache
      retry: 1,
    },
  },
});

// Animated route wrapper — re-mounts on path change for fade-in
function AnimatedRoutes() {
  const location = useLocation();

  return (
    <div key={location.pathname} className="page-transition-enter">
      <Suspense fallback={<PageLoader />}>
        <Routes location={location}>
          {/* Public Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/teachers" element={<Teachers />} />
          <Route path="/teachers/:id" element={<TeacherDetail />} />
          <Route path="/results" element={<Results />} />
          <Route path="/notices" element={<Notices />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/complaint" element={<Complaint />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsConditions />} />

          {/* Admin Auth */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Protected Admin Routes */}
          <Route path="/admin" element={<AdminGuard><AdminDashboard /></AdminGuard>} />
          <Route path="/admin/teachers" element={<AdminGuard><AdminTeachers /></AdminGuard>} />
          <Route path="/admin/results" element={<AdminGuard><AdminResults /></AdminGuard>} />
          <Route path="/admin/classes" element={<AdminGuard><AdminClasses /></AdminGuard>} />
          <Route path="/admin/subjects" element={<AdminGuard><AdminSubjects /></AdminGuard>} />
          <Route path="/admin/notices" element={<AdminGuard><AdminNotices /></AdminGuard>} />
          <Route path="/admin/gallery" element={<AdminGuard><AdminGallery /></AdminGuard>} />
          <Route path="/admin/complaints" element={<AdminGuard><AdminComplaints /></AdminGuard>} />
          <Route path="/admin/madrasa-info" element={<AdminGuard><AdminMadrasaInfo /></AdminGuard>} />
          <Route path="/admin/settings" element={<AdminGuard><AdminWebsiteSettings /></AdminGuard>} />
          <Route path="/admin/privacy-policy" element={<AdminGuard><AdminPrivacyPolicy /></AdminGuard>} />
          <Route path="/admin/terms" element={<AdminGuard><AdminTerms /></AdminGuard>} />

          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner position="top-right" richColors />
      <DataProvider>
        <LanguageProvider>
          <BrowserRouter>
            <AnimatedRoutes />
          </BrowserRouter>
        </LanguageProvider>
      </DataProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
