import { useRef, useState, useCallback } from 'react';
import { Upload, X, Loader2, Image as ImageIcon, Film, Play } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface FileUploadProps {
  bucket: string;
  currentUrl?: string;
  accept?: string;
  label?: string;
  previewType?: 'image' | 'video' | 'auto';
  onUploaded: (url: string) => void;
  onRemoved?: () => void;
  /** Called with a generated thumbnail data-URL when a video is selected */
  onThumbnailGenerated?: (dataUrl: string) => void;
  className?: string;
}

/** Extract a thumbnail from a video Blob at ~0.5 s using a hidden canvas */
function extractVideoThumbnail(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.muted = true;
    video.playsInline = true;
    video.preload = 'metadata';
    const url = URL.createObjectURL(file);
    video.src = url;

    video.onloadeddata = () => {
      video.currentTime = 0.5;
    };

    video.onseeked = () => {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 360;
      const ctx = canvas.getContext('2d');
      if (!ctx) { URL.revokeObjectURL(url); reject(new Error('canvas')); return; }
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.82);
      URL.revokeObjectURL(url);
      resolve(dataUrl);
    };

    video.onerror = () => { URL.revokeObjectURL(url); reject(new Error('video load error')); };
  });
}

/** Upload a data-URL blob to Supabase storage, returns public URL */
async function uploadDataUrl(dataUrl: string, bucket: string): Promise<string> {
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  const path = `thumb-${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`;
  const { error } = await supabase.storage.from(bucket).upload(path, blob, {
    contentType: 'image/jpeg',
    cacheControl: '3600',
    upsert: true,
  });
  if (error) throw error;
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

export default function FileUpload({
  bucket,
  currentUrl = '',
  accept = 'image/jpeg,image/jpg,image/png,image/webp',
  label = 'Upload Image',
  previewType = 'auto',
  onUploaded,
  onRemoved,
  onThumbnailGenerated,
  className = '',
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string>(currentUrl);
  const [thumbPreview, setThumbPreview] = useState<string>('');

  const isVideo = useCallback((url: string) => {
    if (previewType === 'video') return true;
    if (previewType === 'image') return false;
    return url.includes('.mp4') || url.includes('.webm') || url.includes('video');
  }, [previewType]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size: images ≤ 10MB, videos ≤ 50MB
    const maxSize = file.type.startsWith('video/') ? 50 * 1024 * 1024 : 10 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error(`File too large. Max ${file.type.startsWith('video/') ? '50MB' : '10MB'}.`);
      return;
    }

    // Show local preview immediately
    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);

    setUploading(true);

    // For videos: generate thumbnail before uploading
    if (file.type.startsWith('video/')) {
      try {
        const thumbDataUrl = await extractVideoThumbnail(file);
        setThumbPreview(thumbDataUrl);

        // Upload thumbnail to storage and emit URL
        const thumbPublicUrl = await uploadDataUrl(thumbDataUrl, bucket);
        onThumbnailGenerated?.(thumbPublicUrl);
      } catch {
        // Thumbnail generation is best-effort — don't block the upload
        console.warn('Thumbnail generation failed');
      }
    }

    try {
      const ext = file.name.split('.').pop();
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(path, file, { upsert: true, cacheControl: '3600' });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from(bucket).getPublicUrl(path);
      setPreview(data.publicUrl);
      onUploaded(data.publicUrl);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Upload failed');
      setPreview(currentUrl); // revert
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const handleRemove = () => {
    setPreview('');
    setThumbPreview('');
    onUploaded('');
    onRemoved?.();
    if (inputRef.current) inputRef.current.value = '';
  };

  const showingVideo = preview && isVideo(preview);

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Preview */}
      {preview && (
        <div className="relative inline-block">
          {showingVideo ? (
            /* Show the auto-generated thumbnail (or a placeholder) instead of loading <video> */
            <div className="relative h-32 rounded-xl border border-border overflow-hidden bg-black flex items-center justify-center min-w-[12rem]">
              {thumbPreview ? (
                <img src={thumbPreview} alt="thumbnail" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                  <Film size={32} className="text-primary/60" />
                </div>
              )}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-black/50 flex items-center justify-center">
                  <Play size={18} className="text-white ml-0.5" fill="white" />
                </div>
              </div>
            </div>
          ) : (
            <img
              src={preview}
              alt="Preview"
              className="h-32 rounded-xl border border-border object-cover bg-secondary"
            />
          )}
          <button
            type="button"
            onClick={handleRemove}
            className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-md"
            title="Remove"
          >
            <X size={12} />
          </button>
        </div>
      )}

      {/* Upload Button */}
      <div>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
          id={`file-upload-${bucket}-${label}`}
        />
        <label
          htmlFor={`file-upload-${bucket}-${label}`}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-dashed text-sm font-semibold cursor-pointer transition-all select-none
            ${uploading
              ? 'border-primary/40 text-primary/60 bg-secondary cursor-not-allowed'
              : 'border-primary/30 text-primary hover:border-primary hover:bg-primary/5'
            }`}
        >
          {uploading ? (
            <><Loader2 size={15} className="animate-spin" /> Uploading...</>
          ) : (
            <>
              {accept.includes('video') ? <Film size={15} /> : <ImageIcon size={15} />}
              <Upload size={14} />
              {preview ? 'Replace File' : label}
            </>
          )}
        </label>
        <p className="text-xs text-muted-foreground mt-1">
          {accept.includes('video')
            ? 'JPG, PNG, WEBP, MP4, WEBM · Max 50MB'
            : 'JPG, PNG, WEBP · Max 10MB'}
        </p>
      </div>
    </div>
  );
}
