import { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "./ui/dialog";
import { useTheme } from "./ThemeProvider";
import { Star, Check, Sparkles, Camera, Video, X as XIcon, Play } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export interface ReviewItem {
  name: string;
  image: string;
  price: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  orderId: string;
  items: ReviewItem[];
  onSubmit: (review: { ratings: Record<string, number>; comment: string; media: { url: string; type: "image" | "video" }[] }) => void;
}

const RATING_LABELS = ["", "Péssimo", "Ruim", "Ok", "Bom", "Excelente"];

const MAX_MEDIA = 6;

export function ReviewModal({ open, onClose, orderId, items, onSubmit }: Props) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark" || resolvedTheme === undefined;
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [hoverRatings, setHoverRatings] = useState<Record<string, number>>({});
  const [comment, setComment] = useState("");
  const [media, setMedia] = useState<{ url: string; type: "image" | "video"; file: File }[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [earnedPoints, setEarnedPoints] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setRatings({});
      setHoverRatings({});
      setComment("");
      setMedia((prev) => {
        prev.forEach((m) => URL.revokeObjectURL(m.url));
        return [];
      });
      setSubmitted(false);
      setEarnedPoints(0);
    }
  }, [open]);

  useEffect(() => () => media.forEach((m) => URL.revokeObjectURL(m.url)), [media]);

  const rated = Object.keys(ratings).length;
  const total = items.length;
  const allRated = rated === total && total > 0;
  const avgRating = rated > 0 ? Object.values(ratings).reduce((a, b) => a + b, 0) / rated : 0;

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const remaining = MAX_MEDIA - media.length;
    const accepted: { url: string; type: "image" | "video"; file: File }[] = [];
    Array.from(files).slice(0, remaining).forEach((file) => {
      const type: "image" | "video" = file.type.startsWith("video") ? "video" : "image";
      accepted.push({ url: URL.createObjectURL(file), type, file });
    });
    setMedia((prev) => [...prev, ...accepted]);
  };

  const removeMedia = (idx: number) =>
    setMedia((prev) => {
      const next = [...prev];
      URL.revokeObjectURL(next[idx].url);
      next.splice(idx, 1);
      return next;
    });

  const baseEarn = total * 5;
  const mediaBonus = media.length > 0 ? 10 : 0;
  const commentBonus = comment.trim().length >= 20 ? 5 : 0;
  const projectedPts = baseEarn + mediaBonus + commentBonus;

  const handleSubmit = () => {
    if (!allRated) return;
    setEarnedPoints(projectedPts);
    onSubmit({
      ratings,
      comment,
      media: media.map(({ url, type }) => ({ url, type })),
    });
    setSubmitted(true);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent
        className="!max-w-[620px] !p-0 !gap-0 !border-0"
        style={{
          background: "var(--surface-1)",
          borderRadius: "var(--radius-card-lg)",
          overflow: "hidden",
          color: isDark ? "#fafafa" : "#0a0a0a",
        }}
      >
        {!submitted ? (
          <>
            <div className="px-6 pt-6 pb-4 flex items-start gap-3" style={{ borderBottom: isDark ? "1px solid rgba(var(--foreground-rgb), 0.06)" : "1px solid rgba(0,0,0,0.06)" }}>
              <div className="flex items-center justify-center flex-shrink-0" style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(250,204,21,0.14)" }}>
                <Star size={18} className="fill-yellow-400 text-yellow-400" />
              </div>
              <div className="flex-1 min-w-0">
                <DialogTitle style={{ fontFamily: "var(--font-family-figtree)", fontSize: "var(--text-base)", fontWeight: 600, color: isDark ? "#fafafa" : "#0a0a0a" }}>
                  Avaliar pedido {orderId}
                </DialogTitle>
                <DialogDescription style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", marginTop: 4, color: isDark ? "rgba(var(--foreground-rgb), 0.6)" : "rgba(0,0,0,0.6)" }}>
                  Sua nota ajuda quem ainda vai comprar · Ganhe até <span style={{ color: "var(--amber-deep)", fontWeight: 700 }}>+{baseEarn + 15} pts</span> com foto + comentário
                </DialogDescription>
              </div>
            </div>

            <div className="px-6 py-4 max-h-[60vh] overflow-y-auto">
              {/* Itens com estrelas */}
              <div className="space-y-2.5">
                {items.map((item, i) => {
                  const key = `${i}-${item.name}`;
                  const rating = ratings[key] ?? 0;
                  const hover = hoverRatings[key] ?? 0;
                  const display = hover || rating;
                  return (
                    <div key={key} className="flex items-center gap-3 p-3" style={{ borderRadius: "var(--radius-card-sm)", background: isDark ? "rgba(var(--foreground-rgb), 0.02)" : "rgba(0,0,0,0.015)", border: isDark ? "1px solid rgba(var(--foreground-rgb), 0.06)" : "1px solid rgba(0,0,0,0.06)" }}>
                      <div className="w-12 h-12 flex-shrink-0 overflow-hidden border border-foreground/5" style={{ borderRadius: "var(--radius-card)", background: "var(--surface-1)" }}>
                        <ImageWithFallback src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="truncate" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)", fontWeight: "var(--font-weight-medium)", color: isDark ? "rgba(var(--foreground-rgb), 0.92)" : "rgba(0,0,0,0.92)" }}>{item.name}</p>
                        <div className="mt-1.5 flex items-center gap-2">
                          <div className="flex items-center gap-0.5">
                            {[1, 2, 3, 4, 5].map((star) => {
                              const filled = display >= star;
                              return (
                                <button
                                  key={star}
                                  type="button"
                                  onMouseEnter={() => setHoverRatings((h) => ({ ...h, [key]: star }))}
                                  onMouseLeave={() => setHoverRatings((h) => ({ ...h, [key]: 0 }))}
                                  onClick={() => setRatings((r) => ({ ...r, [key]: star }))}
                                  className="cursor-pointer p-0.5 transition-transform hover:scale-110"
                                >
                                  <Star size={20} className={filled ? "fill-yellow-400 text-yellow-400" : ""} style={!filled ? { color: isDark ? "rgba(var(--foreground-rgb), 0.2)" : "rgba(0,0,0,0.2)" } : undefined} strokeWidth={1.5} />
                                </button>
                              );
                            })}
                          </div>
                          {display > 0 && (
                            <span className="ml-1" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 600, color: "#facc15" }}>{RATING_LABELS[display]}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Mídia: fotos e vídeos */}
              <div className="mt-5">
                <div className="flex items-center justify-between mb-2">
                  <label style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: isDark ? "rgba(var(--foreground-rgb), 0.55)" : "rgba(0,0,0,0.55)" }}>
                    Fotos e vídeos <span style={{ fontWeight: 500, letterSpacing: "0.04em", color: "#facc15" }}>+10 pts</span>
                  </label>
                  <span style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", color: isDark ? "rgba(var(--foreground-rgb), 0.45)" : "rgba(0,0,0,0.45)" }}>
                    {media.length}/{MAX_MEDIA}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {media.map((m, i) => (
                    <div key={i} className="relative group" style={{ width: 70, height: 70, borderRadius: 10, overflow: "hidden", border: isDark ? "1px solid rgba(var(--foreground-rgb), 0.08)" : "1px solid rgba(0,0,0,0.08)", background: "var(--surface-1)" }}>
                      {m.type === "image" ? (
                        <img src={m.url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <>
                          <video src={m.url} className="w-full h-full object-cover" muted />
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ background: "rgba(0,0,0,0.35)" }}>
                            <Play size={18} className="text-ink-strong fill-white" />
                          </div>
                        </>
                      )}
                      <button
                        type="button"
                        onClick={() => removeMedia(i)}
                        className="absolute top-1 right-1 flex items-center justify-center cursor-pointer transition-all"
                        style={{ width: 18, height: 18, borderRadius: 9999, background: "rgba(0,0,0,0.7)", color: "#fff" }}
                      >
                        <XIcon size={11} />
                      </button>
                    </div>
                  ))}
                  {media.length < MAX_MEDIA && (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex flex-col items-center justify-center gap-1 cursor-pointer transition-all hover:brightness-125"
                      style={{
                        width: 70, height: 70, borderRadius: 10,
                        background: "rgba(200,120,0,0.04)",
                        border: "1.5px dashed rgba(200,120,0,0.38)",
                        color: "var(--amber-deep)",
                      }}
                    >
                      <div className="flex items-center gap-0.5">
                        <Camera size={13} />
                        <Video size={13} />
                      </div>
                      <span style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 700, letterSpacing: "0.04em" }}>Adicionar</span>
                    </button>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  className="hidden"
                  onChange={(e) => { handleFiles(e.target.files); e.target.value = ""; }}
                />
                <p className="mt-2" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", color: isDark ? "rgba(var(--foreground-rgb), 0.4)" : "rgba(0,0,0,0.4)" }}>
                  Mostra o produto na sua setup · Vídeos até 30s
                </p>
              </div>

              {/* Comentário */}
              <div className="mt-5">
                <label className="block mb-1.5" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: isDark ? "rgba(var(--foreground-rgb), 0.55)" : "rgba(0,0,0,0.55)" }}>
                  Conta detalhes <span style={{ fontWeight: 500, letterSpacing: "0.04em", color: "#facc15" }}>+5 pts se 20+ chars</span>
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value.slice(0, 500))}
                  placeholder="Como foi a experiência? Qualidade, entrega, encaixou no setup..."
                  rows={3}
                  className="w-full focus:outline-none focus:border-primary/40 transition-all resize-none"
                  style={{
                    padding: "11px 13px",
                    borderRadius: "var(--radius-card-sm)",
                    border: isDark ? "1px solid rgba(var(--foreground-rgb), 0.08)" : "1px solid rgba(0,0,0,0.08)",
                    background: isDark ? "rgba(var(--foreground-rgb), 0.03)" : "rgba(0,0,0,0.02)",
                    fontFamily: "var(--font-family-inter)",
                    fontSize: "var(--text-sm)",
                    color: isDark ? "rgba(var(--foreground-rgb), 0.92)" : "rgba(0,0,0,0.92)",
                    lineHeight: 1.5,
                  }}
                />
                <p className="mt-1 text-right" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", color: isDark ? "rgba(var(--foreground-rgb), 0.35)" : "rgba(0,0,0,0.35)" }}>{comment.length}/500</p>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 pb-5 pt-3 flex items-center justify-between gap-2.5" style={{ borderTop: isDark ? "1px solid rgba(var(--foreground-rgb), 0.06)" : "1px solid rgba(0,0,0,0.06)" }}>
              <div className="flex items-center gap-2 min-w-0">
                <p className="truncate" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", color: isDark ? "rgba(var(--foreground-rgb), 0.55)" : "rgba(0,0,0,0.55)" }}>
                  {allRated ? (
                    <><Check size={11} className="inline" /> Pronto · Ganhará <span style={{ color: "var(--amber-deep)", fontWeight: 700 }}>+{projectedPts} pts</span></>
                  ) : `${rated}/${total} ${rated === 1 ? "item avaliado" : "itens avaliados"}`}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button type="button" onClick={onClose} className="btn-tonante-ghost min-h-[44px] px-5 py-2 md:min-h-0"
                  style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)", fontWeight: 600 }}>
                  Cancelar
                </button>
                <button type="button" onClick={handleSubmit} disabled={!allRated}
                  className="btn-tonante min-h-[44px] px-5 py-2 md:min-h-0"
                  style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)", fontWeight: 700 }}>
                  Enviar avaliação
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="px-6 py-10 text-center">
            <div className="mx-auto mb-4 flex items-center justify-center" style={{ width: 64, height: 64, borderRadius: 9999, background: "rgba(34,197,94,0.12)" }}>
              <Check size={28} className="text-green-500" strokeWidth={2.5} />
            </div>
            <h3 style={{ fontFamily: "var(--font-family-figtree)", fontSize: "var(--text-lg)", fontWeight: 600, color: isDark ? "#fafafa" : "#0a0a0a" }}>
              Valeu pela avaliação!
            </h3>
            <p className="mt-2" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)", color: isDark ? "rgba(var(--foreground-rgb), 0.6)" : "rgba(0,0,0,0.6)" }}>
              Nota média {avgRating.toFixed(1)} ⭐ · Sua opinião vai ajudar a galera
            </p>
            <div className="mt-5 inline-flex items-center gap-2 px-4 py-2.5" style={{ borderRadius: "var(--radius-card-sm)", background: "rgba(200,120,0,0.10)", border: "1px solid rgba(200,120,0,0.28)" }}>
              <Sparkles size={14} style={{ color: "var(--amber-deep)" }} />
              <span style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 700, color: "var(--amber-deep)" }}>
                +{earnedPoints} Ton Points creditados
              </span>
            </div>
            <div className="mt-6">
              <button type="button" onClick={onClose} className="btn-tonante min-h-[44px] px-5 py-2.5 md:min-h-0"
                style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)", fontWeight: 700 }}>
                Fechar
              </button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
