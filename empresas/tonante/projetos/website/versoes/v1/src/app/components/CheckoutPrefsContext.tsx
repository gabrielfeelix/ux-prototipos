import { createContext, useContext, useState, type Dispatch, type ReactNode, type SetStateAction } from "react";

interface CheckoutPrefs {
  appliedCoupon: string | null;
  setAppliedCoupon: Dispatch<SetStateAction<string | null>>;
  pointsApplied: boolean;
  setPointsApplied: Dispatch<SetStateAction<boolean>>;
  pointsToUse: number;
  setPointsToUse: Dispatch<SetStateAction<number>>;
}

const CheckoutPrefsContext = createContext<CheckoutPrefs | null>(null);

export function useCheckoutPrefs() {
  const ctx = useContext(CheckoutPrefsContext);
  if (!ctx) throw new Error("useCheckoutPrefs must be used within CheckoutPrefsProvider");
  return ctx;
}

export function CheckoutPrefsProvider({ children }: { children: ReactNode }) {
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [pointsApplied, setPointsApplied] = useState(false);
  const [pointsToUse, setPointsToUse] = useState(0);
  return (
    <CheckoutPrefsContext.Provider
      value={{ appliedCoupon, setAppliedCoupon, pointsApplied, setPointsApplied, pointsToUse, setPointsToUse }}
    >
      {children}
    </CheckoutPrefsContext.Provider>
  );
}
