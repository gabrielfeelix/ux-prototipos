import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "./ui/dialog";
import type { UserAddress } from "./AuthContext";
import { MapPin } from "lucide-react";
import { FieldLabel, FieldInput } from "./section";

interface Props {
  open: boolean;
  onClose: () => void;
  initial?: UserAddress | null;
  onSubmit: (data: Omit<UserAddress, "id">) => void;
}

const EMPTY: Omit<UserAddress, "id"> = {
  label: "",
  street: "",
  number: "",
  complement: "",
  neighborhood: "",
  city: "",
  state: "",
  cep: "",
  isDefault: false,
};

function maskCep(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 8);
  if (d.length <= 5) return d;
  return `${d.slice(0, 5)}-${d.slice(5)}`;
}

export function AddressFormModal({ open, onClose, initial, onSubmit }: Props) {
  const [data, setData] = useState<Omit<UserAddress, "id">>(EMPTY);

  useEffect(() => {
    if (open) {
      if (initial) {
        const { id: _id, ...rest } = initial;
        setData(rest);
      } else {
        setData(EMPTY);
      }
    }
  }, [open, initial]);

  const valid = !!data.label && !!data.street && !!data.number && !!data.neighborhood && !!data.city && !!data.state && data.cep.replace(/\D/g, "").length === 8;

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent
        className="!max-w-[560px] !p-0 !gap-0 !border-0"
        style={{
          background: "var(--surface-1)",
          borderRadius: "var(--radius-card-lg)",
          overflow: "hidden",
          color: "var(--ink-strong)",
        }}
      >
        <div className="px-6 pt-6 pb-4 flex items-center gap-3" style={{ borderBottom: "1px solid var(--edge-subtle)" }}>
          <div className="flex items-center justify-center" style={{ width: 36, height: 36, borderRadius: "var(--radius-card-sm)", background: "var(--surface-2)", border: "1px solid var(--edge-subtle)" }}>
            <MapPin size={18} style={{ color: "var(--amber-deep)" }} />
          </div>
          <div className="flex-1 min-w-0">
            <DialogTitle style={{ fontFamily: "var(--font-family-figtree)", fontSize: "var(--text-lg)", fontWeight: 700, letterSpacing: "-0.01em", color: "var(--ink-strong)" }}>
              {initial ? "Editar endereço" : "Adicionar endereço"}
            </DialogTitle>
            <DialogDescription style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", color: "var(--ink-muted)" }}>
              Será usado nas suas compras e entregas.
            </DialogDescription>
          </div>
        </div>

        <form
          onSubmit={(e) => { e.preventDefault(); if (valid) { onSubmit(data); onClose(); } }}
          className="px-6 py-5 grid grid-cols-12 gap-4"
        >
          <div className="col-span-12 sm:col-span-6">
            <FieldLabel required>Nome do endereço</FieldLabel>
            <FieldInput
              autoFocus
              placeholder="Casa, Trabalho..."
              value={data.label}
              onChange={(e) => setData((d) => ({ ...d, label: e.target.value }))}
            />
          </div>
          <div className="col-span-12 sm:col-span-6">
            <FieldLabel required>CEP</FieldLabel>
            <FieldInput
              placeholder="00000-000"
              value={data.cep}
              onChange={(e) => setData((d) => ({ ...d, cep: maskCep(e.target.value) }))}
              inputMode="numeric"
            />
          </div>
          <div className="col-span-12 sm:col-span-9">
            <FieldLabel required>Logradouro</FieldLabel>
            <FieldInput
              placeholder="Av. Paranavaí"
              value={data.street}
              onChange={(e) => setData((d) => ({ ...d, street: e.target.value }))}
            />
          </div>
          <div className="col-span-12 sm:col-span-3">
            <FieldLabel required>Número</FieldLabel>
            <FieldInput
              placeholder="1906"
              value={data.number}
              onChange={(e) => setData((d) => ({ ...d, number: e.target.value }))}
            />
          </div>
          <div className="col-span-12 sm:col-span-6">
            <FieldLabel>Complemento <span style={{ color: "rgba(var(--foreground-rgb), 0.35)", fontWeight: 500, letterSpacing: "0.04em", textTransform: "none" }}>(opcional)</span></FieldLabel>
            <FieldInput
              placeholder="Sala, apto..."
              value={data.complement || ""}
              onChange={(e) => setData((d) => ({ ...d, complement: e.target.value }))}
            />
          </div>
          <div className="col-span-12 sm:col-span-6">
            <FieldLabel required>Bairro</FieldLabel>
            <FieldInput
              placeholder="Parque Industrial"
              value={data.neighborhood}
              onChange={(e) => setData((d) => ({ ...d, neighborhood: e.target.value }))}
            />
          </div>
          <div className="col-span-12 sm:col-span-8">
            <FieldLabel required>Cidade</FieldLabel>
            <FieldInput
              placeholder="Maringá"
              value={data.city}
              onChange={(e) => setData((d) => ({ ...d, city: e.target.value }))}
            />
          </div>
          <div className="col-span-12 sm:col-span-4">
            <FieldLabel required>UF</FieldLabel>
            <FieldInput
              maxLength={2}
              placeholder="PR"
              value={data.state}
              onChange={(e) => setData((d) => ({ ...d, state: e.target.value.toUpperCase() }))}
            />
          </div>

          <label className="col-span-12 flex items-center gap-2.5 cursor-pointer select-none mt-1">
            <input
              type="checkbox"
              checked={data.isDefault}
              onChange={(e) => setData((d) => ({ ...d, isDefault: e.target.checked }))}
              className="accent-primary"
              style={{ width: 16, height: 16 }}
            />
            <span style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)", color: "var(--ink-strong)" }}>
              Definir como endereço padrão
            </span>
          </label>

          <div className="col-span-12 flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="btn-tonante-ghost min-h-[44px] px-5 py-2 md:min-h-0"
              style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)", fontWeight: 600 }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!valid}
              className="btn-tonante min-h-[44px] px-5 py-2 md:min-h-0"
              style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)", fontWeight: 700 }}
            >
              {initial ? "Salvar" : "Adicionar"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
