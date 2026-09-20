import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Increase warning limit (supabase-js is large)
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: {
          // React core — loaded first, cached long-term
          'react-core': ['react', 'react-dom', 'react-router-dom'],
          // Supabase — large but shared across all pages
          'supabase': ['@supabase/supabase-js'],
          // UI toolkit — shadcn + radix
          'ui-lib': ['@radix-ui/react-dialog', '@radix-ui/react-tooltip',
                     '@radix-ui/react-select', '@radix-ui/react-label',
                     'lucide-react', 'sonner'],
          // Admin pages bundle — only loaded for /admin routes
          'admin': [
            './src/pages/admin/Dashboard',
            './src/pages/admin/AdminTeachers',
            './src/pages/admin/AdminResults',
            './src/pages/admin/AdminClasses',
            './src/pages/admin/AdminSubjects',
            './src/pages/admin/AdminNotices',
            './src/pages/admin/AdminGallery',
            './src/pages/admin/AdminComplaints',
            './src/pages/admin/AdminMadrasaInfo',
            './src/pages/admin/AdminWebsiteSettings',
            './src/pages/admin/AdminPrivacyPolicy',
            './src/pages/admin/AdminTerms',
          ],
        },
      },
    },
  },
});
