import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Loader2, Check, AlertCircle, X, ImagePlus, Film, Upload as UploadIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/i18n/LanguageContext";
import {
  resizeImage,
  uploadPhoto,
  uploadVideo,
  isHeic,
  isVideo,
  MAX_FILES,
  MAX_INPUT_BYTES,
} from "@/lib/photoUpload";

type PhotoStatus = "pending" | "resizing" | "uploading" | "done" | "error";

interface SelectedPhoto {
  id: string;
  file: File;
  previewUrl: string;
  isVideo: boolean;
  status: PhotoStatus;
  uploadProgress?: number; // 0–1, byte progress while a video is uploading
  error?: string;
}

const PhotoUploadSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { toast } = useToast();
  const { t } = useTranslation();

  const [photos, setPhotos] = useState<SelectedPhoto[]>([]);
  const [uploaderName, setUploaderName] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState<{ current: number; total: number } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keep a ref to the current photos so the unmount cleanup revokes every URL.
  const photosRef = useRef<SelectedPhoto[]>([]);
  photosRef.current = photos;
  useEffect(() => {
    return () => {
      photosRef.current.forEach((p) => URL.revokeObjectURL(p.previewUrl));
    };
  }, []);

  // Warn before leaving while a batch is uploading.
  useEffect(() => {
    if (!isUploading) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isUploading]);

  const update = (id: string, patch: Partial<SelectedPhoto>) =>
    setPhotos((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    e.target.value = ""; // allow re-selecting the same file later

    setPhotos((prev) => {
      const seen = new Set(prev.map((p) => `${p.file.name}:${p.file.size}:${p.file.lastModified}`));
      const next = [...prev];
      let rejectedHeic = false;
      let rejectedType = false;
      let rejectedSize = false;

      for (const file of files) {
        if (next.length >= MAX_FILES) {
          toast({
            title: t("photos.tooManyFiles", { max: String(MAX_FILES) }),
            variant: "destructive",
          });
          break;
        }
        const video = isVideo(file);
        if (isHeic(file)) {
          rejectedHeic = true;
          continue;
        }
        if (!video && !file.type.startsWith("image/")) {
          rejectedType = true;
          continue;
        }
        // Videos stream straight to Drive, so they have no size cap. Images
        // are decoded into a canvas in the browser, so keep their guard.
        if (!video && file.size > MAX_INPUT_BYTES) {
          rejectedSize = true;
          continue;
        }
        const key = `${file.name}:${file.size}:${file.lastModified}`;
        if (seen.has(key)) continue;
        seen.add(key);
        next.push({
          id: `${key}:${next.length}`,
          file,
          previewUrl: URL.createObjectURL(file),
          isVideo: video,
          status: "pending",
        });
      }

      if (rejectedHeic) toast({ title: t("photos.heicWarning"), variant: "destructive" });
      else if (rejectedType) toast({ title: t("photos.invalidType"), variant: "destructive" });
      else if (rejectedSize) toast({ title: t("photos.fileTooLarge"), variant: "destructive" });

      return next;
    });
  };

  const removePhoto = (id: string) => {
    setPhotos((prev) => {
      const target = prev.find((p) => p.id === id);
      if (target) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((p) => p.id !== id);
    });
  };

  const uploadOne = async (photo: SelectedPhoto) => {
    try {
      let result;
      if (photo.isVideo) {
        // Videos stream straight to Drive via a resumable session.
        update(photo.id, { status: "uploading", uploadProgress: 0, error: undefined });
        result = await uploadVideo({
          file: photo.file,
          uploaderName,
          onProgress: (fraction) => update(photo.id, { uploadProgress: fraction }),
        });
      } else {
        // Images are resized/re-encoded, then sent base64 to the script.
        update(photo.id, { status: "resizing", error: undefined });
        const blob = await resizeImage(photo.file);
        update(photo.id, { status: "uploading" });
        result = await uploadPhoto({
          blob,
          filename: photo.file.name,
          mimeType: "image/jpeg",
          uploaderName,
        });
      }
      if (result.ok) {
        update(photo.id, { status: "done" });
        return result.unconfirmed ? "unconfirmed" : "ok";
      }
      update(photo.id, { status: "error", error: result.error });
      return "error";
    } catch (err) {
      update(photo.id, {
        status: "error",
        error: err instanceof Error ? err.message : String(err),
      });
      return "error";
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    const queue = photos.filter((p) => p.status !== "done");
    if (queue.length === 0) return;

    setIsUploading(true);
    let okCount = 0;
    let unconfirmed = false;
    let failed = 0;

    for (let i = 0; i < queue.length; i++) {
      setProgress({ current: i + 1, total: queue.length });
      const outcome = await uploadOne(queue[i]);
      if (outcome === "ok") okCount++;
      else if (outcome === "unconfirmed") {
        okCount++;
        unconfirmed = true;
      } else failed++;
    }

    setProgress(null);
    setIsUploading(false);

    if (failed === 0 && unconfirmed) {
      toast({ title: t("photos.successTitle"), description: t("photos.uploadedUnconfirmed") });
    } else if (failed === 0) {
      toast({
        title: t("photos.successTitle"),
        description: t("photos.successDesc", { count: String(okCount) }),
      });
    } else if (okCount > 0) {
      toast({
        title: t("photos.partialSuccess"),
        description: t("photos.partialDesc", { ok: String(okCount), failed: String(failed) }),
        variant: "destructive",
      });
    } else {
      toast({
        title: t("shared.submissionFailed"),
        description: t("shared.tryAgainLater"),
        variant: "destructive",
      });
    }
  };

  const pendingCount = photos.filter((p) => p.status !== "done").length;

  return (
    <section ref={ref} className="section-padding gradient-sage">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <p className="decorative-flourish mb-4">📷</p>
          <h2 className="font-serif text-4xl md:text-5xl font-light text-foreground mb-4">
            {t("photos.title")}
          </h2>
          <div className="decorative-line mb-6" />
          <p className="text-muted-foreground font-light">{t("photos.subtitle")}</p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          onSubmit={handleUpload}
          className="space-y-6 bg-white/50 backdrop-blur-sm p-8 rounded-lg shadow-lg"
        >
          <div>
            <label
              htmlFor="uploaderName"
              className="block text-sm uppercase tracking-widest text-primary mb-2 font-sans font-semibold"
            >
              {t("photos.yourName")}
            </label>
            <input
              type="text"
              id="uploaderName"
              value={uploaderName}
              onChange={(e) => setUploaderName(e.target.value)}
              placeholder={t("photos.namePlaceholder")}
              disabled={isUploading}
              className="w-full px-4 py-3 bg-white border border-gray-300 focus:border-primary focus:outline-none transition-colors font-sans text-foreground disabled:opacity-50"
            />
          </div>

          <input
            ref={inputRef}
            type="file"
            accept="image/*,video/*"
            multiple
            onChange={handleSelect}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={isUploading || photos.length >= MAX_FILES}
            className="w-full py-8 border-2 border-dashed border-primary/40 rounded-lg flex flex-col items-center justify-center gap-2 text-primary hover:border-primary hover:bg-primary/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ImagePlus className="w-8 h-8" />
            <span className="font-sans text-sm tracking-widest uppercase">
              {t("photos.selectPhotos")}
            </span>
            <span className="text-xs text-muted-foreground">
              {t("photos.maxFilesHint", { max: String(MAX_FILES) })}
            </span>
          </button>

          {photos.length > 0 && (
            <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
              {photos.map((photo) => (
                <div
                  key={photo.id}
                  className="relative aspect-square rounded-md overflow-hidden bg-gray-100 group"
                >
                  {photo.isVideo ? (
                    <video
                      src={photo.previewUrl}
                      className="w-full h-full object-cover"
                      muted
                      playsInline
                      preload="metadata"
                    />
                  ) : (
                    <img
                      src={photo.previewUrl}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  )}
                  {photo.isVideo && (
                    <div className="absolute bottom-1 left-1 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center pointer-events-none">
                      <Film className="w-3 h-3" />
                    </div>
                  )}
                  {(photo.status === "resizing" || photo.status === "uploading") && (
                    <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center gap-1">
                      <Loader2 className="w-6 h-6 text-white animate-spin" />
                      {photo.isVideo &&
                        photo.status === "uploading" &&
                        photo.uploadProgress !== undefined && (
                          <span className="text-[11px] font-sans text-white tabular-nums">
                            {Math.round(photo.uploadProgress * 100)}%
                          </span>
                        )}
                    </div>
                  )}
                  {photo.status === "done" && (
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <Check className="w-7 h-7 text-white" />
                    </div>
                  )}
                  {photo.status === "error" && (
                    <button
                      type="button"
                      onClick={() => uploadOne(photo)}
                      title={photo.error || t("photos.retry")}
                      className="absolute inset-0 bg-red-900/50 flex flex-col items-center justify-center gap-1 text-white"
                    >
                      <AlertCircle className="w-6 h-6" />
                      <span className="text-[10px] uppercase tracking-wide">
                        {t("photos.retry")}
                      </span>
                    </button>
                  )}
                  {!isUploading && photo.status !== "done" && (
                    <button
                      type="button"
                      onClick={() => removePhoto(photo.id)}
                      aria-label={t("photos.removeAria")}
                      className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="text-center pt-2">
            <button
              type="submit"
              disabled={isUploading || pendingCount === 0}
              className="w-full py-4 bg-primary text-primary-foreground font-sans text-base tracking-widest uppercase hover:bg-primary/90 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isUploading && progress ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {t("photos.uploadingProgress", {
                    current: String(progress.current),
                    total: String(progress.total),
                  })}
                </>
              ) : (
                <>
                  <UploadIcon className="w-5 h-5" />
                  {t("photos.uploadButton")}
                </>
              )}
            </button>
          </div>
        </motion.form>
      </div>
    </section>
  );
};

export default PhotoUploadSection;
