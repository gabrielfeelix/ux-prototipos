import { Dialog, DialogContent, DialogTitle, DialogDescription } from "./ui/dialog";
import { useTheme } from "./ThemeProvider";
import { AlertCircle, X as XIcon } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  destructive = false,
}: Props) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark" || resolvedTheme === undefined;
  const accent = destructive ? "rgba(239,68,68,1)" : "var(--primary)";
  const accentBg = destructive ? "rgba(239,68,68,0.12)" : "rgba(17, 17, 17, 0.08)";
  const Icon = destructive ? AlertCircle : XIcon;

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent
        className="!max-w-[440px] !p-0 !gap-0 !border-0"
        style={{
          background: "var(--surface-1)",
          borderRadius: "var(--radius-card-lg)",
          overflow: "hidden",
          color: isDark ? "#fafafa" : "#0a0a0a",
        }}
      >
        <div className="px-6 pt-6 pb-4 flex items-start gap-3.5">
          <div className="flex items-center justify-center flex-shrink-0" style={{ width: 40, height: 40, borderRadius: 12, background: accentBg }}>
            <Icon size={20} style={{ color: accent }} />
          </div>
          <div className="flex-1 min-w-0 pt-0.5">
            <DialogTitle style={{ fontFamily: "var(--font-family-figtree)", fontSize: "var(--text-base)", fontWeight: 600, lineHeight: 1.3, color: isDark ? "#fafafa" : "#0a0a0a" }}>
              {title}
            </DialogTitle>
            {description && (
              <DialogDescription style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)", lineHeight: 1.5, marginTop: 6, color: isDark ? "rgba(var(--foreground-rgb), 0.6)" : "rgba(0,0,0,0.6)" }}>
                {description}
              </DialogDescription>
            )}
          </div>
        </div>

        <div className="px-6 pb-5 pt-2 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 cursor-pointer hover:brightness-110 transition-all"
            style={{
              borderRadius: 10,
              background: isDark ? "rgba(var(--foreground-rgb), 0.05)" : "rgba(0,0,0,0.04)",
              fontFamily: "var(--font-family-inter)",
              fontSize: "var(--text-sm)",
              fontWeight: 600,
              color: isDark ? "rgba(var(--foreground-rgb), 0.85)" : "rgba(0,0,0,0.85)",
            }}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={() => { onConfirm(); onClose(); }}
            className="px-4 py-2 cursor-pointer hover:brightness-110 transition-all"
            style={{
              borderRadius: 10,
              background: destructive ? "rgb(239,68,68)" : "var(--primary)",
              fontFamily: "var(--font-family-inter)",
              fontSize: "var(--text-sm)",
              fontWeight: 700,
              color: "#ffffff",
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
