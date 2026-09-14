"use client";

import { createContext, useContext, type ReactNode } from "react";

/* Variante visual do card de produto. "v2" é o padrão do site (card sobre
   branco puro); "classic" é o card antigo, usado só na home em /legado. */
export type CardVariant = "classic" | "v2";

const CardVariantContext = createContext<CardVariant>("v2");

export const useCardVariant = () => useContext(CardVariantContext);

export function CardVariantProvider({ variant, children }: { variant: CardVariant; children: ReactNode }) {
  return <CardVariantContext.Provider value={variant}>{children}</CardVariantContext.Provider>;
}
