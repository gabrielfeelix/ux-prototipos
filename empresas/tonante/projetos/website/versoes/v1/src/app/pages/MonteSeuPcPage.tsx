import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpDown,
  Briefcase,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Cpu,
  Expand,
  Gamepad2,
  HardDrive,
  Layers,
  LayoutGrid,
  Monitor,
  Palette,
  Rows3,
  Save,
  Settings,
  Share2,
  ShoppingCart,
  Sparkles,
  Trophy,
  Wand2,
  X,
  Zap,
} from "lucide-react";
import { Footer } from "../components/Footer";
import { allProducts } from "../components/productsData";
import { useCart } from "../components/CartContext";
import { Button } from "../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "../components/ui/sheet";
import { cn } from "../components/ui/utils";
import { ScrollArea } from "../components/ui/scroll-area";

const LOGO_URL =
  "https://pcyes-cdn.oderco.com.br/Logotipos/PCYES/Simbolo-Logo-Horiz-Vermelho.png";

const formatBRL = (value: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

type VisualKind =
  | "cpu"
  | "motherboard"
  | "ram"
  | "gpu"
  | "cooling"
  | "storage"
  | "case"
  | "psu"
  | "peripheral";

type Option = {
  id: string;
  name: string;
  price: number;
  image?: string;
  gallery?: string[];
  summary?: string;
  highlights?: string[];
  type?: string;
  standard?: boolean;
  req?: string[];
};

type Category = {
  id: string;
  title: string;
  icon: React.ReactNode;
  options: Option[];
  maxSlots?: number;
  minSlots?: number;
};

const getSelected = (selections: Record<string, string[]>, catId: string): string[] => {
  const v = (selections as Record<string, unknown>)[catId];
  if (Array.isArray(v)) return v as string[];
  if (typeof v === 'string') return [v];
  return [];
};

const getMaxSlots = (cat: Category): number => cat.maxSlots ?? 1;
const getMinSlots = (cat: Category): number => cat.minSlots ?? 1;

const CONFIG_STORAGE_KEY = "pcyes-monte-seu-pc-config";
const SAVED_BUILDS_KEY = "pcyes-saved-builds";
const MAX_SAVED_BUILDS = 20;

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);

const escapeSvgText = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

const buildComponentVisual = ({
  title,
  subtitle,
  accent,
  kind,
}: {
  title: string;
  subtitle: string;
  accent: string;
  kind: VisualKind;
}) => {
  const safeTitle = escapeSvgText(title);
  const safeSubtitle = escapeSvgText(subtitle);

  let illustration = "";

  switch (kind) {
    case "cpu":
      illustration = `
        <rect x="390" y="170" width="420" height="420" rx="48" fill="#0B0F18" stroke="${accent}" stroke-width="16"/>
        <rect x="470" y="250" width="260" height="260" rx="30" fill="url(#accentGlow)" stroke="rgba(255,255,255,0.24)" stroke-width="8"/>
        <rect x="520" y="300" width="160" height="160" rx="22" fill="#05070B" stroke="rgba(255,255,255,0.18)" stroke-width="6"/>
        ${Array.from({ length: 10 })
          .map((_, index) => `<rect x="${348 + index * 50}" y="128" width="18" height="56" rx="8" fill="${accent}" opacity="0.85"/>`)
          .join("")}
        ${Array.from({ length: 10 })
          .map((_, index) => `<rect x="${348 + index * 50}" y="576" width="18" height="56" rx="8" fill="${accent}" opacity="0.85"/>`)
          .join("")}
      `;
      break;
    case "motherboard":
      illustration = `
        <rect x="320" y="150" width="560" height="470" rx="42" fill="#090B10" stroke="${accent}" stroke-width="14"/>
        <rect x="390" y="220" width="220" height="220" rx="26" fill="#0F1520" stroke="rgba(255,255,255,0.15)" stroke-width="8"/>
        <rect x="650" y="220" width="140" height="36" rx="12" fill="${accent}" opacity="0.85"/>
        <rect x="650" y="282" width="160" height="28" rx="10" fill="rgba(255,255,255,0.12)"/>
        <rect x="650" y="330" width="120" height="28" rx="10" fill="rgba(255,255,255,0.12)"/>
        <rect x="650" y="378" width="180" height="28" rx="10" fill="rgba(255,255,255,0.12)"/>
        <rect x="370" y="472" width="460" height="56" rx="20" fill="#111722" stroke="rgba(255,255,255,0.14)" stroke-width="6"/>
        <circle cx="770" cy="520" r="28" fill="${accent}" opacity="0.92"/>
      `;
      break;
    case "ram":
      illustration = `
        <rect x="220" y="338" width="760" height="170" rx="34" fill="#0A0F18" stroke="${accent}" stroke-width="14"/>
        ${Array.from({ length: 8 })
          .map((_, index) => `<rect x="${286 + index * 78}" y="296" width="42" height="128" rx="16" fill="${accent}" opacity="${0.32 + index * 0.06}"/>`)
          .join("")}
        ${Array.from({ length: 10 })
          .map((_, index) => `<rect x="${272 + index * 66}" y="510" width="16" height="70" rx="8" fill="#C7CFDD" opacity="0.7"/>`)
          .join("")}
      `;
      break;
    case "gpu":
      illustration = `
        <rect x="230" y="298" width="740" height="220" rx="40" fill="#0A0D14" stroke="${accent}" stroke-width="14"/>
        <circle cx="430" cy="408" r="88" fill="#101621" stroke="rgba(255,255,255,0.14)" stroke-width="10"/>
        <circle cx="430" cy="408" r="38" fill="${accent}" opacity="0.92"/>
        <circle cx="720" cy="408" r="88" fill="#101621" stroke="rgba(255,255,255,0.14)" stroke-width="10"/>
        <circle cx="720" cy="408" r="38" fill="${accent}" opacity="0.92"/>
        <rect x="892" y="346" width="42" height="126" rx="16" fill="#DDE3ED" opacity="0.9"/>
      `;
      break;
    case "cooling":
      illustration = `
        <rect x="230" y="250" width="480" height="300" rx="38" fill="#0B1018" stroke="${accent}" stroke-width="14"/>
        <circle cx="380" cy="400" r="90" fill="#111722" stroke="rgba(255,255,255,0.14)" stroke-width="8"/>
        <circle cx="560" cy="400" r="90" fill="#111722" stroke="rgba(255,255,255,0.14)" stroke-width="8"/>
        <circle cx="380" cy="400" r="34" fill="${accent}" opacity="0.92"/>
        <circle cx="560" cy="400" r="34" fill="${accent}" opacity="0.92"/>
        <rect x="760" y="320" width="138" height="138" rx="28" fill="#0B1018" stroke="rgba(255,255,255,0.14)" stroke-width="8"/>
        <path d="M710 400C748 400 748 389 760 389" stroke="${accent}" stroke-width="16" stroke-linecap="round"/>
      `;
      break;
    case "storage":
      illustration = `
        <rect x="220" y="352" width="760" height="124" rx="34" fill="#0B0E15" stroke="${accent}" stroke-width="14"/>
        <circle cx="314" cy="414" r="30" fill="${accent}" opacity="0.95"/>
        <rect x="388" y="382" width="250" height="30" rx="12" fill="rgba(255,255,255,0.15)"/>
        <rect x="388" y="428" width="188" height="24" rx="10" fill="rgba(255,255,255,0.1)"/>
        ${Array.from({ length: 6 })
          .map((_, index) => `<rect x="${726 + index * 32}" y="386" width="18" height="56" rx="8" fill="#DCE4F2" opacity="0.84"/>`)
          .join("")}
      `;
      break;
    case "case":
      illustration = `
        <rect x="430" y="160" width="320" height="540" rx="52" fill="#090C11" stroke="${accent}" stroke-width="14"/>
        <rect x="500" y="230" width="178" height="390" rx="32" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.18)" stroke-width="8"/>
        <rect x="626" y="250" width="18" height="344" rx="9" fill="${accent}" opacity="0.9"/>
        <circle cx="598" cy="650" r="18" fill="#D9E0EB" opacity="0.85"/>
      `;
      break;
    case "psu":
      illustration = `
        <rect x="270" y="288" width="660" height="260" rx="40" fill="#0A0E14" stroke="${accent}" stroke-width="14"/>
        <circle cx="430" cy="418" r="96" fill="#101722" stroke="rgba(255,255,255,0.16)" stroke-width="10"/>
        <circle cx="430" cy="418" r="36" fill="${accent}" opacity="0.94"/>
        ${Array.from({ length: 8 })
          .map((_, index) => `<rect x="${664 + index * 28}" y="342" width="16" height="152" rx="8" fill="#DBE2EE" opacity="0.75"/>`)
          .join("")}
      `;
      break;
    case "peripheral":
      illustration = `
        <rect x="240" y="430" width="520" height="126" rx="28" fill="#0B1018" stroke="${accent}" stroke-width="14"/>
        ${Array.from({ length: 11 })
          .map((_, index) => `<rect x="${284 + index * 40}" y="466" width="24" height="24" rx="6" fill="rgba(255,255,255,${0.18 + (index % 3) * 0.05})"/>`)
          .join("")}
        <path d="M790 382C852 382 904 434 904 496V538H840C797 538 762 503 762 460V410C762 394 774 382 790 382Z" fill="#101722" stroke="${accent}" stroke-width="14"/>
      `;
      break;
  }

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900" viewBox="0 0 1200 900" fill="none">
      <defs>
        <linearGradient id="bg" x1="120" y1="80" x2="1080" y2="820" gradientUnits="userSpaceOnUse">
          <stop stop-color="#14171E"/>
          <stop offset="1" stop-color="#07080B"/>
        </linearGradient>
        <radialGradient id="accentGlow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(600 360) rotate(90) scale(280 280)">
          <stop stop-color="${accent}" stop-opacity="0.34"/>
          <stop offset="1" stop-color="${accent}" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect width="1200" height="900" fill="url(#bg)"/>
      <circle cx="965" cy="164" r="176" fill="${accent}" fill-opacity="0.12"/>
      <circle cx="250" cy="742" r="220" fill="${accent}" fill-opacity="0.08"/>
      <path d="M0 132H1200" stroke="rgba(255,255,255,0.06)" stroke-width="2"/>
      <path d="M0 720H1200" stroke="rgba(255,255,255,0.05)" stroke-width="2"/>
      ${illustration}
      <text x="92" y="120" fill="white" font-family="Arial, sans-serif" font-size="62" font-weight="700">${safeTitle}</text>
      <text x="92" y="176" fill="rgba(255,255,255,0.62)" font-family="Arial, sans-serif" font-size="28" font-weight="400">${safeSubtitle}</text>
    </svg>
  `;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
};

const findCatalogProduct = (...needles: string[]) =>
  allProducts.find((product) =>
    needles.every((needle) => product.name.toLowerCase().includes(needle.toLowerCase())),
  );

const cpuImages = {
  intelI5_12: "https://cdn.oderco.com.br/produtos/305032/2FFD797653408771E0630300A8C0513F",
  intelI5_10: "https://cdn.oderco.com.br/produtos/254182/15598870FE6B6F3DE0630300A8C01EB4",
  intelI3_12: "https://cdn.oderco.com.br/produtos/321895/36C3AD706E9C0E8FE0630300A8C09B63",
  intelI3_10: "https://cdn.oderco.com.br/produtos/192261/F0F8D9B5035E84C8E055DEF401E782F4",
  intelI3_12_alt: "https://cdn.oderco.com.br/produtos/282483/23E8609192FEEFD1E0630300A8C0B75A",
  intelI5_12_alt: "https://cdn.oderco.com.br/produtos/305031/2FFD797653418771E0630300A8C0513F",
  amdR5_5000: "https://cdn.oderco.com.br/produtos/329983/38CDEB0421DEAF0EE0630300A8C0889B",
  amdR5_7000: "https://cdn.oderco.com.br/produtos/329998/39997AA8896C482FE0630300A8C0F274",
  intelI7_chip: "https://cdn.oderco.com.br/produtos/365457/486F56C7364D0E16E0630300A8C096E9",
  intelI7_chip_alt: "https://cdn.oderco.com.br/produtos/305964/48816D65077BD020E0630300A8C0592A",
};

const motherboardImages = {
  b75: "https://cdn.oderco.com.br/produtos/270409/401F35F0C97D26C2E0630300A8C0FD75",
  h470: "https://cdn.oderco.com.br/produtos/270433/401F35F0C98926C2E0630300A8C0FD75",
  b650: "https://target.scene7.com/is/image/Target/GUEST_78e5082f-9e18-41c4-8d16-f3bf7fcda0c9?fmt=png-alpha&wid=1000&hei=1000",
  b650a: "https://target.scene7.com/is/image/Target/GUEST_cd497457-a7eb-4150-80fa-138e8444ce1e?fmt=png-alpha&wid=1000&hei=1000",
};

const ramImages = {
  ddr4_8: "https://cdn.oderco.com.br/produtos/34162/402EA1867FDB6E2DE0630300A8C0D98B",
  ddr4_32: "https://cdn.oderco.com.br/produtos/34689/4520E92D669EC021E0630300A8C02B6F",
  ddr4_32_front: "https://cdn.oderco.com.br/produtos/34689/4520E92D66A0C021E0630300A8C02B6F",
};

const psuImages = {
  electro550: "https://cdn.oderco.com.br/produtos/28742/4B7EC28153D51D2DE0630300A8C0552F",
  aether850: "https://cdn.oderco.com.br/produtos/244627/3D5C192CB9DE45B0E0630300A8C0C0C1",
  aether1000: "https://cdn.oderco.com.br/produtos/244628/3D5C192CB9E445B0E0630300A8C0C0C1",
};

const getProductsByCategory = (category: string, limit = 5) =>
  allProducts.filter((product) => product.category === category).slice(0, limit);

const getCaseType = (name: string) => {
  const lowerName = name.toLowerCase();
  if (lowerName.includes("white")) return "white";
  if (lowerName.includes("rgb") || lowerName.includes("argb")) return "rgb";
  return "black";
};

const toOptionFromProduct = (
  prefix: string,
  product: (typeof allProducts)[number],
  index: number,
  extras: Partial<Option> = {},
): Option => ({
  id: `${prefix}-${index + 1}`,
  name: product.name,
  price: product.priceNum,
  image: product.image,
  gallery: product.images?.length ? product.images : [product.image],
  summary: extras.summary ?? product.description,
  highlights: extras.highlights ?? product.features?.slice(0, 3) ?? product.tags.slice(0, 3),
  standard: extras.standard,
  req: extras.req,
  type: extras.type,
});

const gpuProducts = getProductsByCategory("Placas de Vídeo", 5);
const coolingProducts = getProductsByCategory("Refrigeração", 5);
const storageProducts = getProductsByCategory("SSD e HD", 5);
const caseProducts = getProductsByCategory("Gabinetes", 5);

const categories: Category[] = [
  {
    id: "cpu",
    title: "Processador",
    icon: <Cpu className="h-4 w-4" />,
    options: [
      {
        id: "cpu-1",
        name: "Intel Core i5-12400F",
        price: 1029,
        standard: true,
        summary: "6 núcleos / 12 threads, 2.5GHz (4.4GHz Turbo), 18MB Cache, LGA 1700.",
        highlights: ["LGA1700", "6 núcleos", "Até 4.4GHz"],
        image: cpuImages.intelI5_12,
        gallery: [cpuImages.intelI5_12],
      },
      {
        id: "cpu-2",
        name: "Intel Core i7-12700K",
        price: 2199,
        summary: "12 núcleos / 20 threads, 3.6GHz (5.0GHz Turbo), 25MB Cache, LGA 1700.",
        highlights: ["LGA1700", "12 núcleos", "Até 5.0GHz"],
        image: cpuImages.intelI7_chip,
        gallery: [cpuImages.intelI7_chip],
      },
      {
        id: "cpu-3",
        name: "AMD Ryzen 5 7600",
        price: 1399,
        summary: "6 núcleos / 12 threads, 3.8GHz (5.1GHz Boost), AM5, Vídeo integrado.",
        highlights: ["AM5", "6 núcleos", "Até 5.1GHz"],
        image: cpuImages.amdR5_7000,
        gallery: [cpuImages.amdR5_7000],
      },
      {
        id: "cpu-4",
        name: "AMD Ryzen 5 5500",
        price: 599,
        summary: "6 núcleos / 12 threads, 3.6GHz (4.2GHz Boost), 19MB Cache, AM4, BOX.",
        highlights: ["AM4", "6 núcleos", "Até 4.2GHz"],
        image: cpuImages.amdR5_5000,
        gallery: [cpuImages.amdR5_5000],
      },
      {
        id: "cpu-5",
        name: "Intel Core i5-10400",
        price: 789,
        summary: "6 núcleos / 12 threads, 2.9GHz (4.3GHz Turbo), 12MB Cache, LGA 1200.",
        highlights: ["LGA1200", "6 núcleos", "Até 4.3GHz"],
        image: cpuImages.intelI5_10,
        gallery: [cpuImages.intelI5_10],
      },
      {
        id: "cpu-6",
        name: "Intel Core i3-12100F",
        price: 689,
        summary: "4 núcleos / 8 threads, 3.3GHz (4.3GHz Turbo), 12MB Cache, LGA 1700.",
        highlights: ["LGA1700", "4 núcleos", "Até 4.3GHz"],
        image: cpuImages.intelI3_12,
        gallery: [cpuImages.intelI3_12],
      },
      {
        id: "cpu-7",
        name: "Intel Core i3-10100F",
        price: 499,
        summary: "4 núcleos / 8 threads, 3.6GHz (4.3GHz Turbo), 6MB Cache, LGA 1200.",
        highlights: ["LGA1200", "4 núcleos", "Até 4.3GHz"],
        image: cpuImages.intelI3_10,
        gallery: [cpuImages.intelI3_10],
      },
    ],
  },
  {
    id: "motherboard",
    title: "Placa Mãe",
    icon: <Settings className="h-4 w-4" />,
    options: [
      {
        id: "mb-1",
        name: "B760M AORUS ELITE (Intel)",
        price: 1100,
        req: ["cpu-1", "cpu-2", "cpu-6"],
        standard: true,
        summary: "mATX para Intel 12ª/13ª/14ª geração, DDR4, M.2 NVMe.",
        highlights: ["LGA1700", "DDR4", "mATX"],
        image: motherboardImages.b75,
        gallery: [motherboardImages.b75],
      },
      {
        id: "mb-2",
        name: "H470 PCYES (Intel)",
        price: 600,
        req: ["cpu-5", "cpu-7"],
        summary: "mATX para Intel 10ª geração, DDR4, M.2 NVMe.",
        highlights: ["LGA1200", "DDR4", "mATX"],
        image: motherboardImages.h470,
        gallery: [motherboardImages.h470],
      },
      {
        id: "mb-3",
        name: "TUF GAMING B650-PLUS WIFI (AMD)",
        price: 1300,
        req: ["cpu-3"],
        summary: "ATX AM5 com WiFi, DDR5, PCIe 5.0, suporte completo Ryzen 7000.",
        highlights: ["AM5", "DDR5", "ATX"],
        image: motherboardImages.b650,
        gallery: [motherboardImages.b650],
      },
      {
        id: "mb-4",
        name: "ROG STRIX B650-A GAMING WIFI (AMD)",
        price: 2500,
        req: ["cpu-3"],
        summary: "ATX AM5 premium, WiFi 6E, DDR5, VRM reforçado.",
        highlights: ["AM5", "DDR5", "ATX"],
        image: motherboardImages.b650a,
        gallery: [motherboardImages.b650a],
      },
      {
        id: "mb-5",
        name: "B450M Gaming PCYES (AMD)",
        price: 549,
        req: ["cpu-4"],
        summary: "mATX AM4 econômica, DDR4, suporte Ryzen 5000 series.",
        highlights: ["AM4", "DDR4", "mATX"],
        image: motherboardImages.b75,
        gallery: [motherboardImages.b75],
      },
    ],
  },
  {
    id: "ram",
    title: "Memória RAM",
    icon: <Zap className="h-4 w-4" />,
    minSlots: 1,
    maxSlots: 2,
    options: [
      {
        id: "ram-1",
        name: "8GB DDR4 3200MHz UDIMM PCYES",
        price: 400,
        standard: true,
        summary: "Foto real do módulo PCYES, mais coerente com a proposta do configurador.",
        highlights: ["8GB", "DDR4", "3200MHz"],
        image: ramImages.ddr4_8,
        gallery: [ramImages.ddr4_8],
      },
      {
        id: "ram-2",
        name: "16GB DDR4 3200MHz UDIMM PCYES",
        price: 800,
        summary: "Mantém a vitrine com módulo real e deixa a comparação de cards mais fiel ao catálogo.",
        highlights: ["16GB", "DDR4", "3200MHz"],
        image: ramImages.ddr4_32_front,
        gallery: [ramImages.ddr4_32_front],
      },
      {
        id: "ram-3",
        name: "16GB DDR5 5600MHz UDIMM PCYES",
        price: 1600,
        summary: "Outra opção visualmente realista para testar como a etapa de memória se comporta com variações.",
        highlights: ["16GB", "DDR5", "5600MHz"],
        image: ramImages.ddr4_32,
        gallery: [ramImages.ddr4_32],
      },
      {
        id: "ram-4",
        name: "32GB DDR4 3200MHz UDIMM PCYES",
        price: 1900,
        summary: "Módulo real em ângulo, útil para ver diferença de leitura dentro do card e no cabeçalho.",
        highlights: ["32GB", "DDR4", "3200MHz"],
        image: ramImages.ddr4_32,
        gallery: [ramImages.ddr4_32, ramImages.ddr4_32_front],
      },
    ],
  },
  {
    id: "gpu",
    title: "Placa de Vídeo",
    icon: <Monitor className="h-4 w-4" />,
    options: gpuProducts.map((product, index) =>
      toOptionFromProduct("gpu", product, index, {
        standard: index === 0,
        summary: "Produto real do catálogo para gente validar densidade visual, foto e nome ao mesmo tempo.",
      }),
    ),
  },
  {
    id: "cooling",
    title: "Refrigeração",
    icon: <Settings className="h-4 w-4" />,
    minSlots: 0,
    maxSlots: 99,
    options: coolingProducts.map((product, index) =>
      toOptionFromProduct("cooling", product, index, {
        standard: index === 0,
        summary: "Foto real do item para testar como coolers menores e AIOs se comportam no grid.",
      }),
    ),
  },
  {
    id: "storage",
    title: "HD e SSD",
    icon: <HardDrive className="h-4 w-4" />,
    minSlots: 1,
    maxSlots: 5,
    options: storageProducts.map((product, index) =>
      toOptionFromProduct("storage", product, index, {
        standard: index === 0,
        summary: "Produto real do catálogo, bom para validar cards menores com nome técnico mais comprido.",
      }),
    ),
  },
  {
    id: "case",
    title: "Gabinete",
    icon: <Monitor className="h-4 w-4" />,
    options: caseProducts.map((product, index) =>
      toOptionFromProduct("case", product, index, {
        standard: product.name.toLowerCase().includes("white ghost") || index === 0,
        summary: "Foto real de gabinete, importante para testar a percepção premium da prévia grande.",
        type: getCaseType(product.name),
      }),
    ),
  },
  {
    id: "psu",
    title: "Fonte de Alimentação",
    icon: <Zap className="h-4 w-4" />,
    options: [
      {
        id: "psu-1",
        name: "PCYES Electro V2 550W 80Plus Bronze",
        price: 300,
        standard: true,
        summary: "Foto real levantada no site oficial, mais fiel para a etapa de fonte.",
        highlights: ["550W", "80+ Bronze", "ATX"],
        image: psuImages.electro550,
        gallery: [psuImages.electro550],
      },
      {
        id: "psu-2",
        name: "PCYES Electro V2 650W 80Plus Bronze",
        price: 550,
        summary: "Mantém uma imagem real de fonte enquanto a gente avalia a hierarquia de conteúdo.",
        highlights: ["650W", "80+ Bronze", "PFC ativo"],
        image: psuImages.electro550,
        gallery: [psuImages.electro550],
      },
      {
        id: "psu-3",
        name: "PCYES Aether 850W Full Modular Gold",
        price: 650,
        summary: "Fonte real com visual mais premium para testar cards e thumb no cabeçalho.",
        highlights: ["850W", "80+ Gold", "ATX"],
        image: psuImages.aether850,
        gallery: [psuImages.aether850],
      },
      {
        id: "psu-4",
        name: "PCYES Aether 1000W Full Modular Gold",
        price: 1200,
        summary: "Mais uma foto real para a grade de fontes ficar com densidade suficiente.",
        highlights: ["1000W", "Gold", "Full Modular"],
        image: psuImages.aether1000,
        gallery: [psuImages.aether1000],
      },
    ],
  },
];

interface AmbientConfig {
  bg: string;
  glow: string;
}

const getAmbient = (type?: string): AmbientConfig => {
  switch (type) {
    case "white":
      return {
        bg: "radial-gradient(circle at 22% 14%, rgba(255,255,255,0.12), transparent 28%), radial-gradient(circle at 78% 18%, rgba(255,255,255,0.08), transparent 24%), linear-gradient(180deg, #171717 0%, #090909 100%)",
        glow: "rgba(255,255,255,0.14)",
      };
    case "rgb":
      return {
        bg: "radial-gradient(circle at 18% 16%, rgba(139,92,246,0.22), transparent 28%), radial-gradient(circle at 82% 18%, rgba(6,182,212,0.16), transparent 22%), linear-gradient(180deg, #12091d 0%, #080808 100%)",
        glow: "rgba(139,92,246,0.26)",
      };
    default:
      return {
        bg: "radial-gradient(circle at 22% 14%, rgba(255,255,255,0.07), transparent 26%), radial-gradient(circle at 82% 16%, rgba(255,255,255,0.04), transparent 20%), linear-gradient(180deg, #141414 0%, #080808 100%)",
        glow: "rgba(255,255,255,0.09)",
      };
  }
};

type View = "welcome" | "quiz" | "presets" | "builder" | "review";
type SortMode = "suggested" | "price-asc" | "price-desc" | "name";
type ViewMode = "grid" | "list";

type UseType = "gaming" | "creating" | "general";
type GamingLevel = "casual" | "competitive" | "pro";
type CreatingLevel = "hobby" | "professional" | "studio";
type GeneralLevel = "basic" | "performance" | "power";

type QuizAnswers = {
  useType?: UseType;
  games?: string[];
  gamingLevel?: GamingLevel;
  programs?: string[];
  creatingLevel?: CreatingLevel;
  generalLevel?: GeneralLevel;
};
type PresetPersona = "gamer" | "creator" | "daily";
type PresetTier =
  | "pulse"
  | "strike"
  | "apex"
  | "sketch"
  | "render"
  | "studio"
  | "base"
  | "hub"
  | "cockpit";
type Scenario = { label: string; value: string; sub?: string };

type QuizGame = {
  id: string;
  name: string;
  cover: string;
  weight: "light" | "medium" | "heavy";
  tag: string;
  bg1?: string;
  bg2?: string;
};

const steamCover = (appId: number) =>
  `https://cdn.cloudflare.steamstatic.com/steam/apps/${appId}/header.jpg`;

const wikiImg = (path: string) => `https://upload.wikimedia.org/wikipedia/${path}`;

const quizGames: QuizGame[] = [
  { id: "cs2", name: "Counter-Strike 2", cover: steamCover(730), weight: "light", tag: "FPS / Esports" },
  { id: "valorant", name: "Valorant", cover: wikiImg("en/b/ba/Valorant_cover.jpg"), bg1: "#FF4655", bg2: "#0F1923", weight: "light", tag: "FPS Tático" },
  { id: "lol", name: "League of Legends", cover: wikiImg("commons/d/d8/League_of_Legends_2019_vector.svg"), bg1: "#0AC8B9", bg2: "#091428", weight: "light", tag: "MOBA / Esports" },
  { id: "dota2", name: "Dota 2", cover: steamCover(570), weight: "light", tag: "MOBA / Esports" },
  { id: "fortnite", name: "Fortnite", cover: wikiImg("commons/0/0e/FortniteLogo.svg"), bg1: "#7B4ACB", bg2: "#1F0A4B", weight: "medium", tag: "Battle Royale" },
  { id: "apex", name: "Apex Legends", cover: steamCover(1172470), weight: "medium", tag: "Battle Royale" },
  { id: "pubg", name: "PUBG: Battlegrounds", cover: steamCover(578080), weight: "medium", tag: "Battle Royale" },
  { id: "warzone", name: "Call of Duty: Warzone", cover: steamCover(1962663), weight: "heavy", tag: "Battle Royale" },
  { id: "rainbow6", name: "Rainbow Six Siege", cover: steamCover(359550), weight: "medium", tag: "FPS Tático" },
  { id: "overwatch2", name: "Overwatch 2", cover: wikiImg("en/8/89/Overwatch_2_Steam_artwork.jpg"), bg1: "#F99E1A", bg2: "#16202E", weight: "medium", tag: "Hero Shooter" },
  { id: "rocket", name: "Rocket League", cover: steamCover(252950), weight: "light", tag: "Esportes / Arcade" },
  { id: "fc24", name: "EA Sports FC 24", cover: steamCover(2195250), weight: "medium", tag: "Esportes" },
  { id: "freefire", name: "Free Fire", cover: wikiImg("en/3/38/Free_Fire_New_Logo.svg"), bg1: "#FE7900", bg2: "#1C1410", weight: "light", tag: "Battle Royale Mobile" },
  { id: "minecraft", name: "Minecraft", cover: wikiImg("en/b/be/Minecraft_game_logo_2023.png"), bg1: "#5C7C2F", bg2: "#1E2B0E", weight: "light", tag: "Sandbox" },
  { id: "roblox", name: "Roblox", cover: wikiImg("commons/4/4b/Roblox_Logo_2022.svg"), bg1: "#E2231A", bg2: "#0A0A0A", weight: "light", tag: "Multiplayer" },
  { id: "gta5", name: "GTA V", cover: steamCover(271590), weight: "medium", tag: "Open World" },
  { id: "rdr2", name: "Red Dead Redemption 2", cover: steamCover(1174180), weight: "heavy", tag: "Open World" },
  { id: "witcher3", name: "The Witcher 3", cover: steamCover(292030), weight: "heavy", tag: "AAA RPG" },
  { id: "cyberpunk", name: "Cyberpunk 2077", cover: steamCover(1091500), weight: "heavy", tag: "AAA pesado" },
  { id: "elden", name: "Elden Ring", cover: steamCover(1245620), weight: "heavy", tag: "AAA RPG" },
  { id: "bg3", name: "Baldur's Gate 3", cover: steamCover(1086940), weight: "heavy", tag: "AAA RPG" },
  { id: "hogwarts", name: "Hogwarts Legacy", cover: steamCover(990080), weight: "heavy", tag: "AAA Aventura" },
  { id: "starfield", name: "Starfield", cover: steamCover(1716740), weight: "heavy", tag: "AAA RPG" },
  { id: "alan-wake-2", name: "Alan Wake 2", cover: wikiImg("en/e/ed/Alan_Wake_2_box_art.jpg"), bg1: "#2A1A4F", bg2: "#0A0716", weight: "heavy", tag: "AAA pesado" },
  { id: "wukong", name: "Black Myth Wukong", cover: steamCover(2358720), weight: "heavy", tag: "AAA pesado" },
  { id: "stellar", name: "Stellar Blade", cover: steamCover(3489700), weight: "heavy", tag: "AAA Ação" },
  { id: "genshin", name: "Genshin Impact", cover: wikiImg("en/5/5d/Genshin_Impact_logo.svg"), bg1: "#FFCE71", bg2: "#1B2233", weight: "medium", tag: "RPG Online" },
  { id: "wow", name: "World of Warcraft", cover: wikiImg("en/6/65/World_of_Warcraft.png"), bg1: "#FFB100", bg2: "#0E1620", weight: "medium", tag: "MMORPG" },
];

type QuizProgram = {
  id: string;
  name: string;
  short: string;
  category: string;
  bg: string;
  fg: string;
  weight: "light" | "heavy";
  logo?: string;
};

const iconifyLogo = (slug: string) => `https://api.iconify.design/logos:${slug}.svg`;
const iconifyMono = (slug: string, hex: string) =>
  `https://api.iconify.design/simple-icons:${slug}.svg?color=%23${hex.replace("#", "")}`;

const quizPrograms: QuizProgram[] = [
  {
    id: "photoshop",
    name: "Photoshop",
    short: "Ps",
    category: "Foto / Imagem",
    bg: "#001E36",
    fg: "#31A8FF",
    weight: "light",
    logo: iconifyLogo("adobe-photoshop"),
  },
  {
    id: "lightroom",
    name: "Lightroom",
    short: "Lr",
    category: "Foto / Tratamento",
    bg: "#001E36",
    fg: "#31A8FF",
    weight: "light",
    logo: iconifyLogo("adobe-lightroom"),
  },
  {
    id: "illustrator",
    name: "Illustrator",
    short: "Ai",
    category: "Vetor / Ilustração",
    bg: "#330000",
    fg: "#FF9A00",
    weight: "light",
    logo: iconifyLogo("adobe-illustrator"),
  },
  {
    id: "indesign",
    name: "InDesign",
    short: "Id",
    category: "Editorial",
    bg: "#49021F",
    fg: "#FF3366",
    weight: "light",
    logo: iconifyLogo("adobe-indesign"),
  },
  {
    id: "figma",
    name: "Figma",
    short: "Fi",
    category: "UI / Design",
    bg: "#1E1E1E",
    fg: "#F24E1E",
    weight: "light",
    logo: iconifyLogo("figma"),
  },
  {
    id: "canva",
    name: "Canva",
    short: "Cv",
    category: "Design fácil",
    bg: "#0D1E40",
    fg: "#00C4CC",
    weight: "light",
    logo: iconifyMono("canva", "#00C4CC"),
  },
  {
    id: "affinity",
    name: "Affinity Suite",
    short: "Af",
    category: "Foto / Design",
    bg: "#0E1F3D",
    fg: "#7CC4F4",
    weight: "light",
    logo: iconifyMono("affinitydesigner", "#7CC4F4"),
  },
  {
    id: "premiere",
    name: "Premiere Pro",
    short: "Pr",
    category: "Edição de Vídeo",
    bg: "#00005B",
    fg: "#9999FF",
    weight: "heavy",
    logo: iconifyLogo("adobe-premiere"),
  },
  {
    id: "davinci",
    name: "DaVinci Resolve",
    short: "Dv",
    category: "Vídeo / Color Grading",
    bg: "#232F3E",
    fg: "#FF8D11",
    weight: "heavy",
    logo: iconifyMono("davinciresolve", "#FF8D11"),
  },
  {
    id: "capcut",
    name: "CapCut / Pro",
    short: "Cc",
    category: "Vídeo Social",
    bg: "#1A1A1F",
    fg: "#5B8AF5",
    weight: "light",
    logo: wikiImg("en/a/a0/Capcut-logo.svg"),
  },
  {
    id: "vegas",
    name: "Vegas Pro",
    short: "Vg",
    category: "Edição de Vídeo",
    bg: "#1B1B1B",
    fg: "#FFB400",
    weight: "heavy",
    logo: wikiImg("commons/4/45/Vegas_Pro_Logo_2026.svg"),
  },
  {
    id: "aftereffects",
    name: "After Effects",
    short: "Ae",
    category: "Motion Graphics",
    bg: "#00005B",
    fg: "#D291FF",
    weight: "heavy",
    logo: iconifyLogo("adobe-after-effects"),
  },
  {
    id: "obs",
    name: "OBS Studio",
    short: "Ob",
    category: "Stream / Live",
    bg: "#1F1F2E",
    fg: "#9B4DCA",
    weight: "heavy",
    logo: iconifyMono("obsstudio", "#9B4DCA"),
  },
  {
    id: "streamlabs",
    name: "Streamlabs",
    short: "Sl",
    category: "Stream / Live",
    bg: "#0E1A2B",
    fg: "#80F5D2",
    weight: "heavy",
    logo: iconifyMono("streamlabs", "#80F5D2"),
  },
  {
    id: "blender",
    name: "Blender",
    short: "Bl",
    category: "3D / Render",
    bg: "#1A1A1A",
    fg: "#EA7600",
    weight: "heavy",
    logo: iconifyLogo("blender"),
  },
  {
    id: "cinema4d",
    name: "Cinema 4D",
    short: "C4",
    category: "3D / Motion",
    bg: "#0F1730",
    fg: "#1E88E5",
    weight: "heavy",
    logo: iconifyMono("cinema4d", "#1E88E5"),
  },
  {
    id: "zbrush",
    name: "ZBrush",
    short: "Zb",
    category: "3D / Escultura",
    bg: "#1F1F1F",
    fg: "#C5A572",
    weight: "heavy",
    logo: wikiImg("commons/9/95/ZBrush_icon_new.svg"),
  },
  {
    id: "unreal",
    name: "Unreal Engine",
    short: "Ue",
    category: "Game Dev / Render",
    bg: "#0E0E0E",
    fg: "#5B9FE0",
    weight: "heavy",
    logo: iconifyMono("unrealengine", "#5B9FE0"),
  },
  {
    id: "unity",
    name: "Unity",
    short: "Un",
    category: "Game Dev",
    bg: "#1A1A1A",
    fg: "#E0E0E0",
    weight: "heavy",
    logo: iconifyLogo("unity"),
  },
  {
    id: "audition",
    name: "Audition",
    short: "Au",
    category: "Áudio / Pós",
    bg: "#00203A",
    fg: "#00C8B4",
    weight: "heavy",
    logo: iconifyMono("adobeaudition", "#00C8B4"),
  },
  {
    id: "flstudio",
    name: "FL Studio",
    short: "Fl",
    category: "Música / DAW",
    bg: "#1A1A1A",
    fg: "#FF6B00",
    weight: "heavy",
    logo: wikiImg("en/6/69/FL_Studio_11_just_logo.png"),
  },
  {
    id: "vscode",
    name: "VS Code",
    short: "Vs",
    category: "Dev / Código",
    bg: "#11243A",
    fg: "#3FA9F5",
    weight: "light",
    logo: iconifyLogo("visual-studio-code"),
  },
];

type UseTypeCardData = {
  id: UseType;
  title: string;
  subtitle: string;
  desc: string;
  image: string;
  icon: React.ReactNode;
  accent: string;
  glow: string;
};

const useTypeCards: UseTypeCardData[] = [
  {
    id: "gaming",
    title: "Para jogar",
    subtitle: "Gaming",
    desc: "Esports, AAA ou casual: vamos ver quais jogos você curte e te entregar FPS de verdade.",
    image: "/home/category-pc-gamer.png",
    icon: <Gamepad2 className="h-5 w-5" />,
    accent: "#c87800",
    glow: "rgba(200, 120, 0,0.4)",
  },
  {
    id: "creating",
    title: "Para criar",
    subtitle: "Edição & Design",
    desc: "Foto, vídeo, motion, 3D ou UI: sugerimos a build alinhada com seus programas favoritos.",
    image: "/home/category-computers.png",
    icon: <Palette className="h-5 w-5" />,
    accent: "#a78bfa",
    glow: "rgba(167,139,250,0.4)",
  },
  {
    id: "general",
    title: "Para dia-a-dia",
    subtitle: "Uso geral",
    desc: "Estudo, home office, navegação, streaming. Do básico ao desempenho, você escolhe.",
    image: "/home/category-chair.png",
    icon: <Briefcase className="h-5 w-5" />,
    accent: "#22d3ee",
    glow: "rgba(34,211,238,0.4)",
  },
];

type Preset = {
  id: PresetTier;
  persona: PresetPersona;
  name: string;
  tagline: string;
  description: string;
  price: number;
  oldPrice?: number;
  pixDiscount?: number;
  installments: { count: number; value: number };
  accent: string;
  glow: string;
  icon: React.ReactNode;
  badge?: string;
  heroImage: string;
  performance: string;
  specs: { cpu: string; gpu: string; ram: string; storage: string; psu: string };
  scenarios: Scenario[];
  rating: number;
  reviews: number;
  inStock: boolean;
  deliveryDays: string;
  selections: Record<string, string>;
};

const presets: Preset[] = [
  {
    id: "pulse",
    persona: "gamer",
    name: "PCYES Pulse",
    tagline: "Gamer · 1080p · esports",
    description: "Primeiro setup para entrar no competitivo. 144Hz tranquilo em CS2, Valorant, Fortnite. eSports sem desculpa.",
    price: 3499,
    oldPrice: 3899,
    pixDiscount: 10,
    installments: { count: 10, value: 349.9 },
    accent: "#22c55e",
    glow: "rgba(34,197,94,0.35)",
    icon: <Gamepad2 className="h-5 w-5" />,
    heroImage: "/setups/setup-pulse.png",
    performance: "Entrada",
    specs: {
      cpu: "Intel Core i5-12400F",
      gpu: "GeForce RTX 4060",
      ram: "16GB DDR4 3200MHz",
      storage: "SSD NVMe 1TB",
      psu: "550W 80+ Bronze",
    },
    scenarios: [
      { label: "Valorant", value: "280 fps", sub: "1080p" },
      { label: "Fortnite", value: "165 fps", sub: "1080p" },
      { label: "CS2", value: "220 fps", sub: "1080p" },
    ],
    rating: 4.7,
    reviews: 142,
    inStock: true,
    deliveryDays: "3-5 dias úteis",
    selections: {
      cpu: "cpu-1", motherboard: "mb-1", ram: "ram-2", gpu: "gpu-1",
      cooling: "cooling-1", storage: "storage-1", case: "case-1",
      psu: "psu-1",
    },
  },
  {
    id: "strike",
    persona: "gamer",
    name: "PCYES Strike",
    tagline: "Gamer · 2K 144Hz · AAA",
    description: "Sweet spot do gamer BR. AAA em 2K com folga, stream sem travar, ranked sério.",
    price: 7499,
    oldPrice: 8299,
    pixDiscount: 12,
    installments: { count: 10, value: 749.9 },
    accent: "#c87800",
    glow: "rgba(200, 120, 0,0.45)",
    icon: <Zap className="h-5 w-5" />,
    badge: "MAIS PEDIDA",
    heroImage: "/setups/setup-strike.png",
    performance: "Performance",
    specs: {
      cpu: "Intel Core i7-12700K",
      gpu: "GeForce RTX 4070 Super",
      ram: "32GB DDR5 5600MHz",
      storage: "SSD NVMe 2TB",
      psu: "850W 80+ Gold",
    },
    scenarios: [
      { label: "Cyberpunk 2077", value: "95 fps", sub: "2K Ultra" },
      { label: "Warzone", value: "165 fps", sub: "2K" },
      { label: "Elden Ring", value: "120 fps", sub: "2K" },
    ],
    rating: 4.9,
    reviews: 387,
    inStock: true,
    deliveryDays: "2-4 dias úteis",
    selections: {
      cpu: "cpu-2", motherboard: "mb-1", ram: "ram-3", gpu: "gpu-2",
      cooling: "cooling-2", storage: "storage-2", case: "case-2",
      psu: "psu-3",
    },
  },
  {
    id: "apex",
    persona: "gamer",
    name: "PCYES Apex",
    tagline: "Gamer · 4K alto FPS",
    description: "Topo absoluto para gaming. 4K com Path Tracing, dual-PC stream, sem comprometer nada.",
    price: 14999,
    oldPrice: 16499,
    pixDiscount: 15,
    installments: { count: 10, value: 1499.9 },
    accent: "#a78bfa",
    glow: "rgba(167,139,250,0.4)",
    icon: <Trophy className="h-5 w-5" />,
    heroImage: "/setups/setup-apex.png",
    performance: "Extremo",
    specs: {
      cpu: "AMD Ryzen 7 7800X3D",
      gpu: "GeForce RTX 4090",
      ram: "32GB DDR5 6000MHz",
      storage: "SSD NVMe 4TB Gen4",
      psu: "1000W 80+ Gold Full Modular",
    },
    scenarios: [
      { label: "Cyberpunk 2077", value: "115 fps", sub: "4K Path Tracing" },
      { label: "Alan Wake 2", value: "90 fps", sub: "4K Ultra" },
      { label: "Black Myth Wukong", value: "100 fps", sub: "4K" },
    ],
    rating: 5.0,
    reviews: 89,
    inStock: true,
    deliveryDays: "5-7 dias úteis",
    selections: {
      cpu: "cpu-3", motherboard: "mb-4", ram: "ram-4", gpu: "gpu-3",
      cooling: "cooling-3", storage: "storage-3", case: "case-3",
      psu: "psu-4",
    },
  },
  {
    id: "sketch",
    persona: "creator",
    name: "PCYES Sketch",
    tagline: "Creator · Foto + UI design",
    description: "Primeiro passo no design e edição leve. Photoshop, Figma, Lightroom rodam sem suar.",
    price: 4299,
    oldPrice: 4799,
    pixDiscount: 10,
    installments: { count: 10, value: 429.9 },
    accent: "#06b6d4",
    glow: "rgba(6,182,212,0.4)",
    icon: <Palette className="h-5 w-5" />,
    heroImage: "/setups/setup-sketch.png",
    performance: "Entrada",
    specs: {
      cpu: "Intel Core i5-12400",
      gpu: "GeForce RTX 4060",
      ram: "32GB DDR4 3200MHz",
      storage: "SSD NVMe 1TB",
      psu: "550W 80+ Bronze",
    },
    scenarios: [
      { label: "Photoshop", value: "30 layers 4K", sub: "fluido" },
      { label: "Figma", value: "Multi-página", sub: "sem latência" },
      { label: "Lightroom", value: "Catálogo 5K fotos", sub: "rápido" },
    ],
    rating: 4.8,
    reviews: 96,
    inStock: true,
    deliveryDays: "3-5 dias úteis",
    selections: {
      cpu: "cpu-1", motherboard: "mb-1", ram: "ram-4", gpu: "gpu-1",
      cooling: "cooling-1", storage: "storage-1", case: "case-1",
      psu: "psu-1",
    },
  },
  {
    id: "render",
    persona: "creator",
    name: "PCYES Render",
    tagline: "Creator · Vídeo 4K + Motion",
    description: "Cavalo de batalha para editor. Premiere/DaVinci 4K real-time, After Effects sem dor, Blender médio.",
    price: 8999,
    oldPrice: 9999,
    pixDiscount: 12,
    installments: { count: 10, value: 899.9 },
    accent: "#ec4899",
    glow: "rgba(236,72,153,0.4)",
    icon: <Sparkles className="h-5 w-5" />,
    heroImage: "/setups/setup-render.png",
    performance: "Performance",
    specs: {
      cpu: "AMD Ryzen 7 7700",
      gpu: "GeForce RTX 4070 Ti",
      ram: "64GB DDR5 6000MHz",
      storage: "SSD NVMe 2TB Gen4",
      psu: "850W 80+ Gold",
    },
    scenarios: [
      { label: "Premiere Pro", value: "4K real-time", sub: "timeline pesada" },
      { label: "After Effects", value: "Motion complexa", sub: "preview fluido" },
      { label: "Blender Cycles", value: "Cenas médias", sub: "render rápido" },
    ],
    rating: 4.9,
    reviews: 218,
    inStock: true,
    deliveryDays: "3-5 dias úteis",
    selections: {
      cpu: "cpu-3", motherboard: "mb-3", ram: "ram-3", gpu: "gpu-2",
      cooling: "cooling-2", storage: "storage-2", case: "case-2",
      psu: "psu-3",
    },
  },
  {
    id: "studio",
    persona: "creator",
    name: "PCYES Studio",
    tagline: "Creator · 8K · 3D · AI",
    description: "Workstation sem teto. 8K + Fusion sem proxy, 3D pesado, AI generativa local.",
    price: 18499,
    oldPrice: 20499,
    pixDiscount: 15,
    installments: { count: 10, value: 1849.9 },
    accent: "#f59e0b",
    glow: "rgba(245,158,11,0.4)",
    icon: <Sparkles className="h-5 w-5" />,
    badge: "WORKSTATION",
    heroImage: "/setups/setup-studio.png",
    performance: "Extremo",
    specs: {
      cpu: "AMD Ryzen 9 7950X",
      gpu: "GeForce RTX 4090",
      ram: "128GB DDR5 6400MHz",
      storage: "SSD NVMe 4TB Gen4 + 8TB HD",
      psu: "1200W 80+ Platinum",
    },
    scenarios: [
      { label: "DaVinci Resolve", value: "8K + Fusion", sub: "sem proxy" },
      { label: "Cinema 4D + OptiX", value: "Real-time", sub: "viewport 4K" },
      { label: "Stable Diffusion XL", value: "~5 seg/img", sub: "AI local" },
    ],
    rating: 5.0,
    reviews: 47,
    inStock: true,
    deliveryDays: "7-10 dias úteis",
    selections: {
      cpu: "cpu-3", motherboard: "mb-4", ram: "ram-4", gpu: "gpu-3",
      cooling: "cooling-3", storage: "storage-3", case: "case-3",
      psu: "psu-4",
    },
  },
  {
    id: "base",
    persona: "daily",
    name: "PCYES Base",
    tagline: "Dia-a-dia · Office + streaming",
    description: "PC honesto para estudo, trabalho remoto e streaming. Custo-benefício de verdade.",
    price: 2299,
    oldPrice: 2599,
    pixDiscount: 10,
    installments: { count: 10, value: 229.9 },
    accent: "#64748b",
    glow: "rgba(100,116,139,0.35)",
    icon: <Briefcase className="h-5 w-5" />,
    heroImage: "/setups/setup-base.png",
    performance: "Entrada",
    specs: {
      cpu: "Intel Core i3-12100F",
      gpu: "Vídeo integrado UHD 730",
      ram: "16GB DDR4 3200MHz",
      storage: "SSD NVMe 480GB",
      psu: "400W 80+",
    },
    scenarios: [
      { label: "Office + 15 abas", value: "Sem travas", sub: "" },
      { label: "Zoom HD + Slack", value: "Tranquilo", sub: "" },
      { label: "Netflix 4K", value: "Fluido", sub: "" },
    ],
    rating: 4.6,
    reviews: 312,
    inStock: true,
    deliveryDays: "3-5 dias úteis",
    selections: {
      cpu: "cpu-6", motherboard: "mb-1", ram: "ram-2", gpu: "gpu-1",
      cooling: "cooling-1", storage: "storage-1", case: "case-1",
      psu: "psu-1",
    },
  },
  {
    id: "hub",
    persona: "daily",
    name: "PCYES Hub",
    tagline: "Dia-a-dia · Multitarefa séria",
    description: "Para quem usa pesado sem ser gamer nem editor profissional. 30+ abas, planilhas grandes, dual-monitor 4K.",
    price: 4499,
    oldPrice: 4999,
    pixDiscount: 10,
    installments: { count: 10, value: 449.9 },
    accent: "#0ea5e9",
    glow: "rgba(14,165,233,0.4)",
    icon: <LayoutGrid className="h-5 w-5" />,
    heroImage: "/setups/setup-hub.png",
    performance: "Performance",
    specs: {
      cpu: "Intel Core i5-12400F",
      gpu: "GeForce RTX 4060",
      ram: "32GB DDR4 3200MHz",
      storage: "SSD NVMe 1TB",
      psu: "550W 80+ Bronze",
    },
    scenarios: [
      { label: "30 abas + Excel grande", value: "Sem travas", sub: "+ Zoom HD" },
      { label: "Edição leve casual", value: "1080p", sub: "tranquilo" },
      { label: "Dual-monitor 4K", value: "Fluido", sub: "trabalho híbrido" },
    ],
    rating: 4.7,
    reviews: 198,
    inStock: true,
    deliveryDays: "3-5 dias úteis",
    selections: {
      cpu: "cpu-1", motherboard: "mb-1", ram: "ram-4", gpu: "gpu-1",
      cooling: "cooling-1", storage: "storage-1", case: "case-1",
      psu: "psu-2",
    },
  },
  {
    id: "cockpit",
    persona: "daily",
    name: "PCYES Cockpit",
    tagline: "Dia-a-dia · Pesado sem freio",
    description: "Para quem nunca fecha aba. Triple monitor, dev pesado, edição casual, tudo simultâneo.",
    price: 9999,
    oldPrice: 10999,
    pixDiscount: 12,
    installments: { count: 10, value: 999.9 },
    accent: "#8b5cf6",
    glow: "rgba(139,92,246,0.4)",
    icon: <Layers className="h-5 w-5" />,
    heroImage: "/setups/setup-cockpit.png",
    performance: "Extremo",
    specs: {
      cpu: "Intel Core i7-12700K",
      gpu: "GeForce RTX 4070",
      ram: "64GB DDR5 5600MHz",
      storage: "SSD NVMe 2TB + 4TB HD",
      psu: "750W 80+ Gold",
    },
    scenarios: [
      { label: "100+ abas + 5 apps Office", value: "Tudo aberto", sub: "" },
      { label: "Triple-monitor 4K", value: "Zero lag", sub: "" },
      { label: "Dev + edição + Slack + Zoom", value: "Simultâneo", sub: "" },
    ],
    rating: 4.9,
    reviews: 64,
    inStock: true,
    deliveryDays: "5-7 dias úteis",
    selections: {
      cpu: "cpu-2", motherboard: "mb-1", ram: "ram-3", gpu: "gpu-2",
      cooling: "cooling-2", storage: "storage-2", case: "case-2",
      psu: "psu-3",
    },
  },
];

const recommendPreset = (a: QuizAnswers): PresetTier => {
  if (a.useType === "gaming") {
    if (a.gamingLevel === "pro") return "apex";
    const heavyGame = (a.games ?? []).some(
      (id) => quizGames.find((g) => g.id === id)?.weight === "heavy",
    );
    if (heavyGame || a.gamingLevel === "competitive") return "strike";
    return "pulse";
  }
  if (a.useType === "creating") {
    if (a.creatingLevel === "studio") return "studio";
    const heavyProgram = (a.programs ?? []).some(
      (id) => quizPrograms.find((p) => p.id === id)?.weight === "heavy",
    );
    if (a.creatingLevel === "professional" || heavyProgram) return "render";
    return "sketch";
  }
  if (a.generalLevel === "power") return "cockpit";
  if (a.generalLevel === "performance") return "hub";
  return "base";
};

type GamingLevelCard = {
  id: GamingLevel;
  title: string;
  desc: string;
  icon: React.ReactNode;
  accent: string;
};

const gamingLevelCards: GamingLevelCard[] = [
  {
    id: "casual",
    title: "Casual",
    desc: "Quero jogar bem, sem stress. 60-120 FPS está ótimo.",
    icon: <Gamepad2 className="h-4 w-4" />,
    accent: "#22c55e",
  },
  {
    id: "competitive",
    title: "Competitivo",
    desc: "FPS alto importa. 144Hz+, monitor rápido, ranked sério.",
    icon: <Zap className="h-4 w-4" />,
    accent: "#c87800",
  },
  {
    id: "pro",
    title: "Pro / Streamer",
    desc: "Esports, live, dual-PC. Sem espaço para travada.",
    icon: <Trophy className="h-4 w-4" />,
    accent: "#a78bfa",
  },
];

type CreatingLevelCard = {
  id: CreatingLevel;
  title: string;
  desc: string;
  icon: React.ReactNode;
  accent: string;
};

const creatingLevelCards: CreatingLevelCard[] = [
  {
    id: "hobby",
    title: "Hobby / Esporádico",
    desc: "Edições leves no fim de semana, projetos pessoais, aprendizado.",
    icon: <Palette className="h-4 w-4" />,
    accent: "#06b6d4",
  },
  {
    id: "professional",
    title: "Profissional",
    desc: "Trabalho diário, prazos apertados, render rápido importa.",
    icon: <Sparkles className="h-4 w-4" />,
    accent: "#ec4899",
  },
  {
    id: "studio",
    title: "Estúdio / Workstation",
    desc: "Render 8K, 3D pesado, AI generativa local, sem teto técnico.",
    icon: <Trophy className="h-4 w-4" />,
    accent: "#f59e0b",
  },
];

type GeneralLevelCard = {
  id: GeneralLevel;
  title: string;
  desc: string;
  icon: React.ReactNode;
  accent: string;
};

const generalLevelCards: GeneralLevelCard[] = [
  {
    id: "basic",
    title: "Básico",
    desc: "Navegar, planilhas, vídeo, videochamada. Roda tudo isso sem suar.",
    icon: <Briefcase className="h-4 w-4" />,
    accent: "#64748b",
  },
  {
    id: "performance",
    title: "Com desempenho",
    desc: "Multitarefa pesada, monitor 144Hz, jogos leves, home office sério.",
    icon: <LayoutGrid className="h-4 w-4" />,
    accent: "#0ea5e9",
  },
  {
    id: "power",
    title: "Sem freio",
    desc: "Triple monitor, 100+ abas, dev pesado, tudo aberto o tempo todo.",
    icon: <Layers className="h-4 w-4" />,
    accent: "#8b5cf6",
  },
];

type QuizStepId =
  | "use"
  | "games"
  | "gaming-level"
  | "programs"
  | "creating-level"
  | "general-level";

function QuizProgressBar({ current, total }: { current: number; total: number }) {
  const progress = (current / total) * 100;
  return (
    <div className="h-[3px] overflow-hidden rounded-full bg-white/[0.06]">
      <motion.div
        className="h-full"
        initial={false}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        style={{
          background: "linear-gradient(90deg, rgba(200, 120, 0,0.4) 0%, rgba(200, 120, 0,1) 100%)",
          boxShadow: "0 0 12px rgba(200, 120, 0,0.55)",
        }}
      />
    </div>
  );
}

function QuizHeader({
  current,
  total,
  onBack,
  eyebrow,
  title,
  subtitle,
}: {
  current: number;
  total: number;
  onBack: () => void;
  eyebrow?: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="mb-10">
      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 min-h-[44px] md:min-h-0 text-zinc-400 transition-colors hover:text-ink-strong cursor-pointer"
          style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)", fontWeight: 600 }}
        >
          <ArrowLeft size={13} /> Voltar
        </button>
        <span
          className="uppercase text-zinc-500"
          style={{
            fontFamily: "var(--font-family-inter)",
            fontSize: "var(--text-caption)",
            letterSpacing: "0.22em",
            fontWeight: 700,
          }}
        >
          {current} / {total}
        </span>
      </div>
      <QuizProgressBar current={current} total={total} />
      {eyebrow && (
        <p
          className="mt-8 mb-2 uppercase text-primary"
          style={{
            fontFamily: "var(--font-family-inter)",
            fontSize: "var(--text-caption)",
            letterSpacing: "0.28em",
            fontWeight: 700,
          }}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className={cn("text-ink-strong", eyebrow ? "mb-1" : "mt-8 mb-1")}
        style={{
          fontFamily: "var(--font-family-figtree)",
          fontSize: "clamp(26px, 3.4vw, 34px)",
          fontWeight: 700,
          letterSpacing: "-0.025em",
          lineHeight: 1.1,
        }}
      >
        {title}
      </h2>
      <p
        className="text-zinc-400"
        style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)", lineHeight: 1.5 }}
      >
        {subtitle}
      </p>
    </div>
  );
}

function UseTypeCard({
  card,
  onClick,
}: {
  card: UseTypeCardData;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative flex w-full cursor-pointer flex-col overflow-hidden rounded-[var(--radius-card-lg)] border border-edge-subtle bg-surface-0 text-left transition-all duration-300 hover:-translate-y-1 hover:border-edge-strong"
      style={{
        boxShadow: "0 16px 40px -18px rgba(0,0,0,0.55)",
      }}
      aria-label={card.title}
    >
      <div className="relative aspect-[16/9] md:aspect-[5/4] w-full overflow-hidden deal-image-bg">
        <img
          src={card.image}
          alt=""
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover opacity-85 transition-transform duration-700 group-hover:scale-[1.08]"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = "none";
          }}
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: `linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.45) 55%, rgba(0,0,0,0.92) 100%)`,
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${card.glow}, transparent 60%)`,
          }}
        />
        <div className="absolute inset-x-4 top-4 flex items-center justify-between">
          <span
            className="inline-flex items-center gap-1.5 rounded-full border border-edge bg-black/55 px-2.5 py-1 text-ink-strong backdrop-blur"
            style={{
              fontFamily: "var(--font-family-inter)",
              fontSize: "var(--text-caption)",
              letterSpacing: "0.18em",
              fontWeight: 700,
            }}
          >
            <span style={{ color: card.accent }}>{card.icon}</span>
            {card.subtitle}
          </span>
        </div>
        <div className="absolute inset-x-5 bottom-5">
          <h3
            className="text-ink-strong"
            style={{
              fontFamily: "var(--font-family-figtree)",
              fontSize: "clamp(22px, 2.4vw, 28px)",
              fontWeight: 800,
              letterSpacing: "-0.025em",
              textShadow: "0 2px 12px rgba(0,0,0,0.55)",
            }}
          >
            {card.title}
          </h3>
        </div>
      </div>
      <div className="flex flex-1 flex-col justify-between gap-3 p-5">
        <p
          className="text-zinc-400"
          style={{
            fontFamily: "var(--font-family-inter)",
            fontSize: "var(--text-sm)",
            lineHeight: 1.55,
          }}
        >
          {card.desc}
        </p>
        <div
          className="flex items-center gap-1.5 text-ink transition-colors group-hover:text-ink-strong"
          style={{
            fontFamily: "var(--font-family-inter)",
            fontSize: "var(--text-caption)",
            fontWeight: 700,
            letterSpacing: "0.02em",
          }}
        >
          <span>Escolher</span>
          <ArrowRight
            size={13}
            className="transition-transform duration-300 group-hover:translate-x-1"
            style={{ color: card.accent }}
          />
        </div>
      </div>
    </button>
  );
}

function GameTile({
  game,
  selected,
  onClick,
}: {
  game: QuizGame;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "group relative overflow-hidden rounded-[var(--radius-card-sm)] border text-left transition-all cursor-pointer",
        selected
          ? "border-primary/60"
          : "border-edge-subtle hover:border-edge-strong",
      )}
      style={
        selected
          ? { boxShadow: "0 0 0 1px rgba(200, 120, 0,0.25), 0 18px 40px -18px rgba(200, 120, 0,0.4)" }
          : { boxShadow: "0 8px 24px -12px rgba(0,0,0,0.5)" }
      }
    >
      <div className="relative aspect-[3/2] md:aspect-[460/215] w-full overflow-hidden deal-image-bg">
        {game.bg1 ? (
          <>
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(135deg, ${game.bg1} 0%, ${game.bg2 ?? "#000"} 100%)`,
              }}
            />
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(circle at 28% 50%, rgba(255,255,255,0.18) 0%, transparent 60%)",
              }}
            />
            <img
              src={game.cover}
              alt={game.name}
              loading="lazy"
              className={cn(
                "absolute left-1/2 top-1/2 h-[68%] max-w-[60%] -translate-x-1/2 -translate-y-1/2 object-contain transition-all duration-500",
                selected ? "scale-[1.06]" : "group-hover:scale-[1.06]",
              )}
              style={{ filter: "drop-shadow(0 6px 18px rgba(0,0,0,0.55))" }}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.opacity = "0";
              }}
            />
          </>
        ) : (
          <img
            src={game.cover}
            alt={game.name}
            loading="lazy"
            className={cn(
              "absolute inset-0 h-full w-full object-cover transition-all duration-500",
              selected ? "scale-[1.04]" : "group-hover:scale-[1.04]",
            )}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.opacity = "0";
            }}
          />
        )}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.35) 55%, rgba(0,0,0,0.9) 100%)",
          }}
        />
        {selected && (
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(17, 17, 17, 0.08) 0%, transparent 60%)",
            }}
          />
        )}
        <div className="absolute right-2 top-2">
          <div
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-full border-2 transition-all",
              selected
                ? "border-primary bg-primary text-ink-strong"
                : "border-edge-strong bg-black/50 backdrop-blur text-transparent",
            )}
          >
            <Check size={14} strokeWidth={3} />
          </div>
        </div>
        <div className="absolute inset-x-3 bottom-2.5">
          <p
            className="mb-0.5 uppercase text-ink-muted"
            style={{
              fontFamily: "var(--font-family-inter)",
              fontSize: "var(--text-caption)",
              letterSpacing: "0.2em",
              fontWeight: 700,
            }}
          >
            {game.tag}
          </p>
          <h4
            className="truncate text-ink-strong"
            style={{
              fontFamily: "var(--font-family-figtree)",
              fontSize: "var(--text-sm)",
              fontWeight: 700,
              letterSpacing: "-0.01em",
              textShadow: "0 2px 8px rgba(0,0,0,0.6)",
            }}
          >
            {game.name}
          </h4>
        </div>
      </div>
    </button>
  );
}

function ProgramTile({
  program,
  selected,
  onClick,
}: {
  program: QuizProgram;
  selected: boolean;
  onClick: () => void;
}) {
  const [logoError, setLogoError] = useState(false);
  const showLogo = Boolean(program.logo) && !logoError;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "group relative overflow-hidden rounded-[var(--radius-card-sm)] border text-left transition-all cursor-pointer",
        selected
          ? "border-primary/60"
          : "border-edge-subtle hover:border-edge-strong",
      )}
      style={
        selected
          ? { boxShadow: "0 0 0 1px rgba(200, 120, 0,0.25), 0 18px 40px -18px rgba(200, 120, 0,0.4)" }
          : { boxShadow: "0 8px 24px -12px rgba(0,0,0,0.5)" }
      }
    >
      <div className="relative aspect-[3/2] md:aspect-[460/215] w-full overflow-hidden">
        <div className="absolute inset-0" style={{ background: program.bg }} />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(circle at 22% 50%, ${program.fg}35 0%, transparent 55%)`,
          }}
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.15) 55%, rgba(0,0,0,0.85) 100%)",
          }}
        />
        {selected && (
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(17, 17, 17, 0.08) 0%, transparent 60%)",
            }}
          />
        )}
        {showLogo ? (
          <img
            src={program.logo}
            alt={program.name}
            loading="lazy"
            onError={() => setLogoError(true)}
            className="absolute left-4 top-1/2 h-[58%] w-auto -translate-y-[58%] object-contain transition-transform duration-500 group-hover:scale-[1.05]"
            style={{ filter: `drop-shadow(0 0 22px ${program.fg}66)` }}
          />
        ) : (
          <span
            className="absolute left-4 top-1/2 -translate-y-[60%]"
            style={{
              fontFamily: "var(--font-family-figtree)",
              color: program.fg,
              fontSize: "clamp(46px, 7vw, 64px)",
              fontWeight: 900,
              letterSpacing: "-0.05em",
              lineHeight: 1,
              textShadow: `0 0 28px ${program.fg}66`,
            }}
          >
            {program.short}
          </span>
        )}
        <div className="absolute right-2 top-2">
          <div
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-full border-2 transition-all",
              selected
                ? "border-primary bg-primary text-ink-strong"
                : "border-edge-strong bg-black/40 backdrop-blur text-transparent",
            )}
          >
            <Check size={14} strokeWidth={3} />
          </div>
        </div>
        <div className="absolute inset-x-3 bottom-2.5">
          <p
            className="mb-0.5 uppercase text-ink"
            style={{
              fontFamily: "var(--font-family-inter)",
              fontSize: "var(--text-caption)",
              letterSpacing: "0.2em",
              fontWeight: 700,
            }}
          >
            {program.category}
          </p>
          <h4
            className="truncate text-ink-strong"
            style={{
              fontFamily: "var(--font-family-figtree)",
              fontSize: "var(--text-sm)",
              fontWeight: 700,
              letterSpacing: "-0.01em",
              textShadow: "0 2px 8px rgba(0,0,0,0.6)",
            }}
          >
            {program.name}
          </h4>
        </div>
      </div>
    </button>
  );
}

function LevelCard({
  title,
  desc,
  icon,
  accent,
  onClick,
}: {
  title: string;
  desc: string;
  icon: React.ReactNode;
  accent: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full cursor-pointer items-center gap-4 rounded-card-md border border-edge-subtle bg-surface-0 p-5 text-left transition-all hover:-translate-y-0.5 hover:border-edge-strong"
      style={{ boxShadow: "0 8px 24px -12px rgba(0,0,0,0.5)" }}
    >
      <div
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-card-sm transition-all"
        style={{
          background: `linear-gradient(135deg, ${accent}25 0%, ${accent}08 100%)`,
          color: accent,
          boxShadow: `inset 0 0 0 1px ${accent}30`,
        }}
      >
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p
          className="text-ink-strong"
          style={{
            fontFamily: "var(--font-family-figtree)",
            fontSize: "var(--text-base)",
            fontWeight: 700,
            letterSpacing: "-0.01em",
          }}
        >
          {title}
        </p>
        <p
          className="mt-0.5 text-zinc-400"
          style={{
            fontFamily: "var(--font-family-inter)",
            fontSize: "var(--text-caption)",
            lineHeight: 1.5,
          }}
        >
          {desc}
        </p>
      </div>
      <ArrowRight
        size={16}
        className="shrink-0 text-zinc-600 transition-all group-hover:translate-x-1"
        style={{ color: accent }}
      />
    </button>
  );
}

function QuizFlow({
  onComplete,
  onBack,
}: {
  onComplete: (rec: PresetTier) => void;
  onBack: () => void;
}) {
  const [history, setHistory] = useState<QuizStepId[]>(["use"]);
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const stepId = history[history.length - 1];
  const totalSteps = answers.useType === "general" ? 2 : 3;
  const currentStepNumber = history.length;

  const goBack = () => {
    if (history.length > 1) setHistory(history.slice(0, -1));
    else onBack();
  };

  const pickUseType = (t: UseType) => {
    setAnswers((prev) => ({ ...prev, useType: t, games: [], programs: [] }));
    const next: QuizStepId =
      t === "gaming" ? "games" : t === "creating" ? "programs" : "general-level";
    setHistory((h) => [...h, next]);
  };

  const toggleGame = (id: string) => {
    setAnswers((prev) => {
      const cur = prev.games ?? [];
      return { ...prev, games: cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id] };
    });
  };

  const toggleProgram = (id: string) => {
    setAnswers((prev) => {
      const cur = prev.programs ?? [];
      return { ...prev, programs: cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id] };
    });
  };

  const continueFromGames = () => setHistory((h) => [...h, "gaming-level"]);
  const continueFromPrograms = () => setHistory((h) => [...h, "creating-level"]);

  const finishGaming = (level: GamingLevel) => {
    const final = { ...answers, gamingLevel: level };
    setAnswers(final);
    onComplete(recommendPreset(final));
  };
  const finishCreating = (level: CreatingLevel) => {
    const final = { ...answers, creatingLevel: level };
    setAnswers(final);
    onComplete(recommendPreset(final));
  };
  const finishGeneral = (level: GeneralLevel) => {
    const final = { ...answers, generalLevel: level };
    setAnswers(final);
    onComplete(recommendPreset(final));
  };

  const [gameSearch, setGameSearch] = useState("");
  const normalizedSearch = gameSearch.trim().toLowerCase();
  const filteredGames = useMemo(() => {
    if (!normalizedSearch) return quizGames;
    return quizGames.filter(
      (g) =>
        g.name.toLowerCase().includes(normalizedSearch) ||
        g.tag.toLowerCase().includes(normalizedSearch),
    );
  }, [normalizedSearch]);

  const selectedGameCount = (answers.games ?? []).length;
  const selectedProgramCount = (answers.programs ?? []).length;

  return (
    <div className="mx-auto max-w-[1080px] px-6 py-12 md:py-14">
      <AnimatePresence mode="wait">
        {stepId === "use" && (
          <motion.div
            key="use"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <QuizHeader
              current={currentStepNumber}
              total={totalSteps}
              onBack={goBack}
              eyebrow="// Para que você quer um PC"
              title="O que vai fazer com seu setup?"
              subtitle="Vamos partir do uso real, não do orçamento. Cada caminho leva a uma sugestão diferente."
            />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {useTypeCards.map((c) => (
                <UseTypeCard key={c.id} card={c} onClick={() => pickUseType(c.id)} />
              ))}
            </div>
          </motion.div>
        )}

        {stepId === "games" && (
          <motion.div
            key="games"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <QuizHeader
              current={currentStepNumber}
              total={totalSteps}
              onBack={goBack}
              eyebrow="// Gaming"
              title="Quais jogos você joga?"
              subtitle="Selecione um ou mais. A gente usa isso para calibrar GPU e CPU, porque esports é diferente de AAA pesado."
            />

            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative w-full sm:max-w-[360px]">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500"
                  aria-hidden="true"
                >
                  <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
                  <path
                    d="M20 20l-3.5-3.5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                <input
                  type="search"
                  value={gameSearch}
                  onChange={(e) => setGameSearch(e.target.value)}
                  placeholder="Buscar jogo (ex: Valorant, RPG, FPS)"
                  aria-label="Buscar jogo"
                  className="h-11 w-full rounded-card-sm border border-edge-subtle bg-surface-0 pl-10 pr-10 text-ink-strong outline-none transition-colors placeholder:text-zinc-500 focus:border-primary/55"
                  style={{
                    fontFamily: "var(--font-family-inter)",
                    fontSize: "var(--text-sm)",
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.02)",
                  }}
                />
                {gameSearch && (
                  <button
                    type="button"
                    onClick={() => setGameSearch("")}
                    aria-label="Limpar busca"
                    className="absolute right-2 top-1/2 flex h-11 w-11 md:h-7 md:w-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-zinc-500 transition-colors hover:bg-white/[0.05] hover:text-ink-strong"
                  >
                    <X size={13} />
                  </button>
                )}
              </div>
              <p
                className="text-zinc-500"
                style={{
                  fontFamily: "var(--font-family-inter)",
                  fontSize: "var(--text-caption)",
                  fontWeight: 500,
                }}
              >
                {selectedGameCount > 0 ? (
                  <span className="text-ink-strong">
                    {selectedGameCount}{" "}
                    {selectedGameCount === 1 ? "jogo selecionado" : "jogos selecionados"}
                  </span>
                ) : (
                  `${filteredGames.length} ${filteredGames.length === 1 ? "jogo" : "jogos"} disponíve${filteredGames.length === 1 ? "l" : "is"}`
                )}
              </p>
            </div>

            {filteredGames.length === 0 ? (
              <div className="flex flex-col items-center gap-2 rounded-card-md border border-edge-subtle bg-surface-0 px-6 py-14 text-center">
                <p
                  className="text-ink-strong"
                  style={{
                    fontFamily: "var(--font-family-figtree)",
                    fontSize: "var(--text-base)",
                    fontWeight: 700,
                  }}
                >
                  Nenhum jogo encontrado
                </p>
                <p
                  className="text-zinc-400"
                  style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)" }}
                >
                  Sem stress, pode pular essa etapa, a gente sugere por gênero.
                </p>
              </div>
            ) : (
              <ScrollArea
                type="always"
                className="quiz-scroll-area rounded-[var(--radius-card)]"
              >
                <div className="grid grid-cols-2 gap-3 pr-3 sm:grid-cols-3 lg:grid-cols-4">
                  {filteredGames.map((g) => (
                    <GameTile
                      key={g.id}
                      game={g}
                      selected={(answers.games ?? []).includes(g.id)}
                      onClick={() => toggleGame(g.id)}
                    />
                  ))}
                </div>
              </ScrollArea>
            )}

            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
              <p
                className="text-zinc-500"
                style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)" }}
              >
                {selectedGameCount === 0
                  ? "Nenhum jogo selecionado, pode pular se preferir"
                  : "Pode continuar quando quiser"}
              </p>
              <button
                type="button"
                onClick={continueFromGames}
                className="inline-flex h-11 items-center justify-center gap-1.5 rounded-card-sm bg-primary px-6 text-ink-strong transition-all hover:brightness-110 cursor-pointer"
                style={{
                  fontFamily: "var(--font-family-inter)",
                  fontSize: "var(--text-sm)",
                  fontWeight: 700,
                  letterSpacing: "0.01em",
                  boxShadow: "0 12px 32px -8px rgba(200, 120, 0,0.55)",
                }}
              >
                Continuar <ArrowRight size={14} />
              </button>
            </div>
          </motion.div>
        )}

        {stepId === "gaming-level" && (
          <motion.div
            key="gaming-level"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <QuizHeader
              current={currentStepNumber}
              total={totalSteps}
              onBack={goBack}
              eyebrow="// Gaming"
              title="Como você joga?"
              subtitle="Define se vamos priorizar FPS bruto, refresh-rate alto ou estabilidade de live."
            />
            <div className="mx-auto max-w-[640px] space-y-2.5">
              {gamingLevelCards.map((c) => (
                <LevelCard
                  key={c.id}
                  title={c.title}
                  desc={c.desc}
                  icon={c.icon}
                  accent={c.accent}
                  onClick={() => finishGaming(c.id)}
                />
              ))}
            </div>
          </motion.div>
        )}

        {stepId === "programs" && (
          <motion.div
            key="programs"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <QuizHeader
              current={currentStepNumber}
              total={totalSteps}
              onBack={goBack}
              eyebrow="// Edição & Criação"
              title="Quais programas você usa?"
              subtitle="Foto, vídeo, motion ou 3D pedem hardware diferente. Selecione todos os que entram na sua rotina."
            />
            <div className="mb-6 flex items-center justify-end">
              <p
                className="text-zinc-500"
                style={{
                  fontFamily: "var(--font-family-inter)",
                  fontSize: "var(--text-caption)",
                  fontWeight: 500,
                }}
              >
                {selectedProgramCount > 0 ? (
                  <span className="text-ink-strong">
                    {selectedProgramCount}{" "}
                    {selectedProgramCount === 1
                      ? "programa selecionado"
                      : "programas selecionados"}
                  </span>
                ) : (
                  `${quizPrograms.length} programas disponíveis`
                )}
              </p>
            </div>
            <ScrollArea
              type="always"
              className="quiz-scroll-area rounded-[var(--radius-card)]"
            >
              <div className="grid grid-cols-2 gap-3 pr-3 sm:grid-cols-3 lg:grid-cols-4">
                {quizPrograms.map((p) => (
                  <ProgramTile
                    key={p.id}
                    program={p}
                    selected={(answers.programs ?? []).includes(p.id)}
                    onClick={() => toggleProgram(p.id)}
                  />
                ))}
              </div>
            </ScrollArea>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
              <p
                className="text-zinc-500"
                style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)" }}
              >
                {selectedProgramCount === 0
                  ? "Nenhum programa selecionado, pode pular se preferir"
                  : "Pode continuar quando quiser"}
              </p>
              <button
                type="button"
                onClick={continueFromPrograms}
                className="inline-flex h-11 items-center justify-center gap-1.5 rounded-card-sm bg-primary px-6 text-ink-strong transition-all hover:brightness-110 cursor-pointer"
                style={{
                  fontFamily: "var(--font-family-inter)",
                  fontSize: "var(--text-sm)",
                  fontWeight: 700,
                  letterSpacing: "0.01em",
                  boxShadow: "0 12px 32px -8px rgba(200, 120, 0,0.55)",
                }}
              >
                Continuar <ArrowRight size={14} />
              </button>
            </div>
          </motion.div>
        )}

        {stepId === "creating-level" && (
          <motion.div
            key="creating-level"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <QuizHeader
              current={currentStepNumber}
              total={totalSteps}
              onBack={goBack}
              eyebrow="// Edição & Criação"
              title="Qual seu nível de uso?"
              subtitle="Hobby pede uma máquina ágil. Profissional pede CPU forte, RAM sobrando e render que respeita prazo."
            />
            <div className="mx-auto max-w-[640px] space-y-2.5">
              {creatingLevelCards.map((c) => (
                <LevelCard
                  key={c.id}
                  title={c.title}
                  desc={c.desc}
                  icon={c.icon}
                  accent={c.accent}
                  onClick={() => finishCreating(c.id)}
                />
              ))}
            </div>
          </motion.div>
        )}

        {stepId === "general-level" && (
          <motion.div
            key="general-level"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <QuizHeader
              current={currentStepNumber}
              total={totalSteps}
              onBack={goBack}
              eyebrow="// Uso geral"
              title="Quanto desempenho você quer?"
              subtitle="Para rodar planilha, navegador e vídeo o básico já entrega. Multitarefa pesada pede outro patamar."
            />
            <div className="mx-auto max-w-[640px] space-y-2.5">
              {generalLevelCards.map((c) => (
                <LevelCard
                  key={c.id}
                  title={c.title}
                  desc={c.desc}
                  icon={c.icon}
                  accent={c.accent}
                  onClick={() => finishGeneral(c.id)}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const getSpecIcon = (text: string) => {
  if (/i\d|Ryzen/i.test(text)) return <Cpu size={13} />;
  if (/GPU|RTX|GTX/i.test(text)) return <Monitor size={13} />;
  if (/DDR|RAM/i.test(text)) return <Sparkles size={13} />;
  if (/SSD|HD|NVMe|TB|GB/i.test(text)) return <HardDrive size={13} />;
  if (/W\b|Watt|Fonte|Gold|Bronze/i.test(text)) return <Zap size={13} />;
  return <Settings size={13} />;
};

function StarRating({ rating, reviews }: { rating: number; reviews: number }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {[0, 1, 2, 3, 4].map((i) => (
          <svg
            key={i}
            width="11"
            height="11"
            viewBox="0 0 24 24"
            fill={i < full ? "#facc15" : i === full && half ? "url(#half)" : "rgba(255,255,255,0.12)"}
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="half">
                <stop offset="50%" stopColor="#facc15" />
                <stop offset="50%" stopColor="rgba(255,255,255,0.12)" />
              </linearGradient>
            </defs>
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z" />
          </svg>
        ))}
      </div>
      <span
        className="tabular-nums text-ink-strong"
        style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 700 }}
      >
        {rating.toFixed(1)}
      </span>
      <span
        className="text-zinc-500"
        style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)" }}
      >
        ({reviews})
      </span>
    </div>
  );
}

function PresetComponentsDrawer({
  preset,
  open,
  onOpenChange,
  onBuy,
  onApply,
}: {
  preset: Preset;
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onBuy?: () => void;
  onApply?: () => void;
}) {
  const items = Object.entries(preset.selections)
    .map(([catId, optId]) => {
      const cat = categories.find((c) => c.id === catId);
      const opt = cat?.options.find((o) => o.id === optId);
      if (!cat || !opt) return null;
      return { catTitle: cat.title, catIcon: cat.icon, opt };
    })
    .filter((x): x is { catTitle: string; catIcon: React.ReactNode; opt: Option } => Boolean(x));

  const subtotal = items.reduce((sum, it) => sum + it.opt.price, 0);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex h-full w-full flex-col gap-0 border-l border-edge-subtle bg-surface-0 p-0 sm:max-w-[460px]"
      >
        <SheetHeader className="border-b border-edge-subtle bg-surface-0 p-5">
          <div className="flex items-center gap-2">
            <span
              className="rounded-full px-2 py-0.5 uppercase text-ink-strong"
              style={{
                backgroundColor: preset.accent,
                fontFamily: "var(--font-family-inter)",
                fontSize: "var(--text-caption)",
                letterSpacing: "0.18em",
                fontWeight: 700,
              }}
            >
              {preset.performance}
            </span>
            <span
              className="uppercase text-zinc-500"
              style={{
                fontFamily: "var(--font-family-inter)",
                fontSize: "var(--text-caption)",
                letterSpacing: "0.22em",
                fontWeight: 700,
              }}
            >
              {preset.tagline}
            </span>
          </div>
          <SheetTitle
            className="text-ink-strong"
            style={{
              fontFamily: "var(--font-family-figtree)",
              fontSize: "var(--text-xl)",
              fontWeight: 800,
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
            }}
          >
            {preset.name} · {items.length} peças
          </SheetTitle>
          <SheetDescription
            className="text-zinc-400"
            style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", lineHeight: 1.5 }}
          >
            Toda peça pode ser trocada na hora de personalizar.
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1">
          <div className="space-y-2 p-4">
            {items.map((item, idx) => (
              <article
                key={item.opt.id}
                className="flex gap-3 rounded-[var(--radius-card-sm)] border border-edge-subtle bg-surface-0 p-3 transition-colors hover:border-edge"
              >
                <div
                  className="h-[68px] w-[68px] shrink-0 overflow-hidden rounded-[var(--radius-card-sm)] deal-image-bg"
                  aria-hidden="true"
                >
                  {item.opt.image ? (
                    <img
                      src={item.opt.image}
                      alt=""
                      loading="lazy"
                      className="h-full w-full object-contain p-1"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-zinc-500">
                      {item.catIcon}
                    </div>
                  )}
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-primary">{item.catIcon}</span>
                    <p
                      className="uppercase text-zinc-500"
                      style={{
                        fontFamily: "var(--font-family-inter)",
                        fontSize: "var(--text-caption)",
                        letterSpacing: "0.2em",
                        fontWeight: 700,
                      }}
                    >
                      {item.catTitle}
                    </p>
                  </div>
                  <p
                    className="text-ink-strong"
                    style={{
                      fontFamily: "var(--font-family-figtree)",
                      fontSize: "var(--text-sm)",
                      fontWeight: 700,
                      lineHeight: 1.25,
                      letterSpacing: "-0.005em",
                    }}
                  >
                    {item.opt.name}
                  </p>
                  {item.opt.highlights && item.opt.highlights.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {item.opt.highlights.slice(0, 3).map((h) => (
                        <span
                          key={h}
                          className="rounded-full border border-edge-subtle bg-white/[0.02] px-1.5 py-0.5 text-zinc-300"
                          style={{
                            fontFamily: "var(--font-family-inter)",
                            fontSize: "var(--text-caption)",
                            fontWeight: 600,
                            letterSpacing: "0.02em",
                          }}
                        >
                          {h}
                        </span>
                      ))}
                    </div>
                  )}
                  <p
                    className="mt-0.5 tabular-nums text-primary"
                    style={{
                      fontFamily: "var(--font-family-figtree)",
                      fontSize: "var(--text-caption)",
                      fontWeight: 800,
                    }}
                  >
                    {formatBRL(item.opt.price)}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </ScrollArea>

        <div className="border-t border-edge-subtle bg-surface-0 p-5">
          <div className="mb-3 flex items-baseline justify-between">
            <span
              className="uppercase text-zinc-500"
              style={{
                fontFamily: "var(--font-family-inter)",
                fontSize: "var(--text-caption)",
                letterSpacing: "0.2em",
                fontWeight: 700,
              }}
            >
              Soma dos componentes
            </span>
            <span
              className="tabular-nums text-ink-strong"
              style={{
                fontFamily: "var(--font-family-figtree)",
                fontSize: "var(--text-lg)",
                fontWeight: 800,
                letterSpacing: "-0.01em",
              }}
            >
              {formatBRL(subtotal)}
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <span
              className="text-zinc-300"
              style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 600 }}
            >
              Preço final do setup
            </span>
            <span
              className="tabular-nums text-primary"
              style={{
                fontFamily: "var(--font-family-figtree)",
                fontSize: "var(--text-xl)",
                fontWeight: 800,
                letterSpacing: "-0.01em",
              }}
            >
              {formatBRL(preset.price)}
            </span>
          </div>
          {(onBuy || onApply) && (
            <div className="mt-4 flex flex-col gap-2">
              {onBuy && (
                <button
                  type="button"
                  onClick={() => {
                    onBuy();
                    onOpenChange(false);
                  }}
                  className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-card-sm text-ink-strong transition-transform duration-300 hover:scale-[1.01] active:scale-[0.99]"
                  style={{
                    background: "var(--gradient-buy)",
                    fontFamily: "var(--font-family-inter)",
                    fontSize: "var(--text-sm)",
                    fontWeight: 700,
                    letterSpacing: "0.01em",
                    boxShadow: "0 12px 32px -8px rgba(34,197,94,0.55)",
                  }}
                >
                  <ShoppingCart size={14} /> Quero esse setup
                </button>
              )}
              {onApply && (
                <button
                  type="button"
                  onClick={() => {
                    onApply();
                    onOpenChange(false);
                  }}
                  className="h-11 w-full cursor-pointer rounded-[var(--radius-card-sm)] border border-edge bg-transparent text-zinc-400 transition-colors hover:border-edge-strong hover:text-zinc-200 md:h-9"
                  style={{
                    fontFamily: "var(--font-family-inter)",
                    fontSize: "var(--text-caption)",
                    fontWeight: 600,
                  }}
                >
                  Personalizar antes
                </button>
              )}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

function PresetCard({
  preset,
  isRecommended,
  onApply,
  onBuy,
}: {
  preset: Preset;
  isRecommended: boolean;
  onApply: () => void;
  onBuy: () => void;
}) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const discount = preset.oldPrice
    ? Math.round(((preset.oldPrice - preset.price) / preset.oldPrice) * 100)
    : 0;
  const pixPrice = preset.pixDiscount ? preset.price * (1 - preset.pixDiscount / 100) : preset.price;
  const componentsCount = Object.keys(preset.selections).length;

  const topSpecs = [
    { icon: <Cpu size={14} />, label: "Processador", value: preset.specs.cpu },
    { icon: <Monitor size={14} />, label: "Placa de Vídeo", value: preset.specs.gpu },
    { icon: <Sparkles size={14} />, label: "Memória", value: preset.specs.ram },
    { icon: <HardDrive size={14} />, label: "Armazenamento", value: preset.specs.storage },
  ];

  return (
    <>
      <article
        className={cn(
          "group relative flex flex-col overflow-hidden rounded-[var(--radius-card-lg)] border bg-surface-0 transition-all duration-300 hover:-translate-y-1",
          isRecommended ? "border-primary/55" : "border-edge-subtle hover:border-edge-strong",
        )}
        style={
          isRecommended
            ? { boxShadow: "0 0 0 1px rgba(200, 120, 0,0.25), 0 30px 70px -28px rgba(200, 120, 0,0.4)" }
            : { boxShadow: "0 16px 40px -18px rgba(0,0,0,0.55)" }
        }
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden deal-image-bg">
          <img
            src={preset.heroImage}
            alt={`Setup ${preset.name}`}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background: `radial-gradient(ellipse at 70% 0%, ${preset.glow} 0%, transparent 60%)`,
              mixBlendMode: "screen",
              opacity: 0.45,
            }}
          />
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-3/5"
            style={{
              background:
                "linear-gradient(180deg, transparent 0%, rgba(13,13,13,0.55) 55%, rgba(13,13,13,0.96) 100%)",
            }}
          />

          <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-3.5">
            <div className="flex flex-col gap-1.5">
              {isRecommended && (
                <span
                  className="inline-flex w-fit items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-ink-strong"
                  style={{
                    fontFamily: "var(--font-family-inter)",
                    fontSize: "var(--text-caption)",
                    letterSpacing: "0.16em",
                    fontWeight: 700,
                    boxShadow: "0 6px 22px -4px rgba(200, 120, 0,0.55)",
                  }}
                >
                  <Sparkles size={9} /> SUGERIDA PRA VOCÊ
                </span>
              )}
              {preset.badge && !isRecommended && (
                <span
                  className="inline-flex w-fit items-center rounded-full border border-edge bg-black/70 px-2.5 py-1 text-ink-strong backdrop-blur"
                  style={{
                    fontFamily: "var(--font-family-inter)",
                    fontSize: "var(--text-caption)",
                    letterSpacing: "0.16em",
                    fontWeight: 700,
                  }}
                >
                  {preset.badge}
                </span>
              )}
            </div>
            {discount > 0 && (
              <span
                className="inline-flex shrink-0 items-center text-ink-strong tabular-nums"
                style={{
                  background: "var(--gradient-discount)",
                  padding: "6px 10px",
                  borderRadius: "var(--radius-card-sm)",
                  fontFamily: "var(--font-family-figtree)",
                  fontSize: "var(--text-sm)",
                  fontWeight: 900,
                  letterSpacing: "-0.01em",
                  boxShadow: "var(--shadow-discount-badge)",
                }}
              >
                -{discount}%
              </span>
            )}
          </div>

          <div className="absolute inset-x-0 bottom-0 p-4">
            <p
              className="mb-1 uppercase"
              style={{
                fontFamily: "var(--font-family-inter)",
                fontSize: "var(--text-caption)",
                letterSpacing: "0.24em",
                fontWeight: 700,
                color: preset.accent,
                textShadow: "0 1px 8px rgba(0,0,0,0.6)",
              }}
            >
              {preset.tagline}
            </p>
            <h3
              className="mb-2 text-ink-strong"
              style={{
                fontFamily: "var(--font-family-figtree)",
                fontSize: "clamp(22px, 2vw, 28px)",
                fontWeight: 800,
                letterSpacing: "-0.025em",
                lineHeight: 1.02,
                textShadow: "0 2px 14px rgba(0,0,0,0.6)",
              }}
            >
              {preset.name}
            </h3>
            <StarRating rating={preset.rating} reviews={preset.reviews} />
          </div>
        </div>

        <div className="flex flex-1 flex-col p-4">
          <ul className="space-y-1.5">
            {topSpecs.map((s) => (
              <li
                key={s.label}
                className="flex items-center gap-2.5 rounded-[var(--radius-card-sm)] border border-edge-subtle bg-white/[0.015] px-2.5 py-2"
              >
                <span
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-white/[0.04] text-primary"
                  aria-hidden="true"
                >
                  {s.icon}
                </span>
                <div className="min-w-0 flex-1">
                  <p
                    className="uppercase text-zinc-500"
                    style={{
                      fontFamily: "var(--font-family-inter)",
                      fontSize: "var(--text-caption)",
                      letterSpacing: "0.2em",
                      fontWeight: 700,
                    }}
                  >
                    {s.label}
                  </p>
                  <p
                    className="truncate text-ink-strong"
                    style={{
                      fontFamily: "var(--font-family-figtree)",
                      fontSize: "var(--text-caption)",
                      fontWeight: 700,
                      letterSpacing: "-0.005em",
                      lineHeight: 1.2,
                    }}
                  >
                    {s.value}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <div
            className="mt-3 rounded-card-sm border border-edge-subtle p-3"
            style={{
              background: `linear-gradient(135deg, ${preset.accent}14 0%, rgba(255,255,255,0.015) 100%)`,
            }}
          >
            <div className="mb-2 flex items-center justify-between">
              <p
                className="uppercase text-zinc-400"
                style={{
                  fontFamily: "var(--font-family-inter)",
                  fontSize: "var(--text-caption)",
                  letterSpacing: "0.22em",
                  fontWeight: 700,
                }}
              >
                {preset.persona === "gamer"
                  ? "FPS estimado"
                  : preset.persona === "creator"
                    ? "Performance criativa"
                    : "No dia-a-dia"}
              </p>
              {preset.persona === "gamer" ? (
                <Gamepad2 size={11} className="text-zinc-500" />
              ) : preset.persona === "creator" ? (
                <Palette size={11} className="text-zinc-500" />
              ) : (
                <Briefcase size={11} className="text-zinc-500" />
              )}
            </div>
            <div className="space-y-1.5">
              {preset.scenarios.slice(0, 3).map((s) => (
                <div key={s.label} className="flex items-center justify-between gap-2">
                  <span
                    className="truncate text-zinc-200"
                    style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 500 }}
                  >
                    {s.label}
                  </span>
                  <div className="flex items-baseline gap-1.5 shrink-0">
                    <span
                      className="tabular-nums text-ink-strong"
                      style={{
                        fontFamily: "var(--font-family-figtree)",
                        fontSize: "var(--text-sm)",
                        fontWeight: 800,
                        letterSpacing: "-0.005em",
                      }}
                    >
                      {s.value}
                    </span>
                    {s.sub && (
                      <span
                        className="rounded-sm bg-white/[0.06] px-1 py-0.5 text-zinc-400"
                        style={{
                          fontFamily: "var(--font-family-inter)",
                          fontSize: "var(--text-caption)",
                          fontWeight: 700,
                          letterSpacing: "0.04em",
                        }}
                      >
                        {s.sub}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="mt-3 flex min-h-[44px] w-full cursor-pointer items-center justify-between gap-2 rounded-[var(--radius-card-sm)] border border-edge-subtle bg-white/[0.015] px-3 py-2.5 text-left transition-all hover:border-primary/40 hover:bg-foreground/[0.04] md:min-h-0"
          >
            <span
              className="flex items-center gap-2 text-ink-strong"
              style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 600 }}
            >
              <Layers size={13} className="text-primary" />
              Ver {componentsCount} componentes
            </span>
            <ArrowRight size={13} className="text-zinc-500" />
          </button>

          <div className="mt-4 border-t border-edge-subtle pt-4">
            <div className="mb-1 flex items-center gap-2">
              {preset.oldPrice && (
                <span
                  className="text-zinc-500 line-through tabular-nums"
                  style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)" }}
                >
                  {formatBRL(preset.oldPrice)}
                </span>
              )}
              {preset.pixDiscount && (
                <span
                  className="rounded bg-green-500/15 px-1.5 py-0.5 text-green-300"
                  style={{
                    fontFamily: "var(--font-family-inter)",
                    fontSize: "var(--text-caption)",
                    fontWeight: 700,
                    letterSpacing: "0.04em",
                  }}
                >
                  -{preset.pixDiscount}% no PIX
                </span>
              )}
            </div>
            {preset.pixDiscount ? (
              <>
                <div className="flex items-baseline gap-2">
                  <p
                    className="text-green-300 tabular-nums"
                    style={{
                      fontFamily: "var(--font-family-figtree)",
                      fontSize: "var(--text-2xl)",
                      fontWeight: 800,
                      letterSpacing: "-0.025em",
                      lineHeight: 1,
                    }}
                  >
                    {formatBRL(pixPrice)}
                  </p>
                  <span
                    className="text-zinc-500"
                    style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)" }}
                  >
                    no PIX
                  </span>
                </div>
                <p
                  className="mt-1 text-zinc-400"
                  style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)" }}
                >
                  <span className="tabular-nums text-ink-strong" style={{ fontWeight: 600 }}>
                    {formatBRL(preset.price)}
                  </span>{" "}
                  em {preset.installments.count}x de{" "}
                  <span className="tabular-nums text-ink-strong" style={{ fontWeight: 600 }}>
                    {formatBRL(preset.installments.value)}
                  </span>{" "}
                  sem juros
                </p>
              </>
            ) : (
              <>
                <div className="flex items-baseline gap-2">
                  <p
                    className="text-ink-strong tabular-nums"
                    style={{
                      fontFamily: "var(--font-family-figtree)",
                      fontSize: "var(--text-2xl)",
                      fontWeight: 800,
                      letterSpacing: "-0.025em",
                      lineHeight: 1,
                    }}
                  >
                    {formatBRL(preset.price)}
                  </p>
                  <span
                    className="text-zinc-500"
                    style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)" }}
                  >
                    à vista
                  </span>
                </div>
                <p
                  className="mt-1 text-zinc-400"
                  style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)" }}
                >
                  ou {preset.installments.count}x de{" "}
                  <span className="tabular-nums text-ink-strong" style={{ fontWeight: 600 }}>
                    {formatBRL(preset.installments.value)}
                  </span>{" "}
                  sem juros
                </p>
              </>
            )}

            <div className="mt-3 flex items-center gap-1.5">
              <span className="flex h-1.5 w-1.5 rounded-full bg-green-400 shadow-[0_0_6px_rgba(74,222,128,0.7)]" />
              <span
                className="text-zinc-300"
                style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 500 }}
              >
                {preset.inStock ? "Em estoque" : "Sob encomenda"} · entrega {preset.deliveryDays}
              </span>
            </div>

            <button
              type="button"
              onClick={onBuy}
              className="mt-4 flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-card-sm text-ink-strong transition-transform duration-300 hover:scale-[1.01] active:scale-[0.99]"
              style={{
                background: "var(--gradient-buy)",
                fontFamily: "var(--font-family-inter)",
                fontSize: "var(--text-sm)",
                fontWeight: 700,
                letterSpacing: "0.01em",
                boxShadow: "0 12px 32px -8px rgba(34,197,94,0.55)",
              }}
            >
              <ShoppingCart size={14} /> Quero esse setup
            </button>
            <button
              type="button"
              onClick={onApply}
              className="mt-2 h-11 w-full cursor-pointer rounded-[var(--radius-card-sm)] border border-edge bg-transparent text-zinc-400 transition-colors hover:border-edge-strong hover:text-zinc-200 md:h-9"
              style={{
                fontFamily: "var(--font-family-inter)",
                fontSize: "var(--text-caption)",
                fontWeight: 600,
              }}
            >
              Personalizar antes
            </button>
          </div>
        </div>
      </article>

      <PresetComponentsDrawer
        preset={preset}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        onBuy={onBuy}
        onApply={onApply}
      />
    </>
  );
}

function PresetMiniCard({
  preset,
  isRecommended,
  onBuy,
  onApply,
}: {
  preset: Preset;
  isRecommended?: boolean;
  onBuy: () => void;
  onApply: () => void;
}) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const discount = preset.oldPrice
    ? Math.round(((preset.oldPrice - preset.price) / preset.oldPrice) * 100)
    : 0;
  const pixPrice = preset.pixDiscount ? preset.price * (1 - preset.pixDiscount / 100) : preset.price;
  const installmentValue = preset.installments.value
    .toFixed(2)
    .replace(".", ",");

  return (
    <>
      <article className="group">
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          aria-label={`Ver detalhes do setup ${preset.name}`}
          className="block w-full cursor-pointer text-left"
        >
          <div
            className="relative aspect-[4/3] overflow-hidden transition-all duration-300 neon-hover-red"
            style={{
              background: "linear-gradient(135deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.03) 100%)",
              borderRadius: "var(--radius-card-lg)",
              border: isRecommended
                ? "1.5px solid rgba(200, 120, 0,0.55)"
                : "1px solid rgba(255,255,255,0.08)",
              boxShadow: isRecommended
                ? "0 0 0 1px rgba(17, 17, 17, 0.08), 0 22px 50px -22px rgba(200, 120, 0,0.35)"
                : "inset 0 1px 0 rgba(255,255,255,0.05)",
            }}
          >
            <div
              className="pointer-events-none absolute inset-0 z-[1]"
              style={{
                background: `radial-gradient(circle at 30% 25%, ${preset.glow} 0%, transparent 55%)`,
                borderRadius: "var(--radius-card-lg)",
                opacity: 0.4,
                mixBlendMode: "screen",
              }}
            />

            <img
              src={preset.heroImage}
              alt={`Setup ${preset.name}`}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />

            {discount > 0 && (
              <span
                className="absolute left-3 top-3 z-20 inline-flex items-center text-ink-strong tabular-nums"
                style={{
                  background: "var(--gradient-discount)",
                  padding: "6px 12px",
                  borderRadius: "var(--radius-card-sm)",
                  fontFamily: "var(--font-family-figtree)",
                  fontSize: "var(--text-base)",
                  fontWeight: 900,
                  letterSpacing: "-0.02em",
                  boxShadow: "var(--shadow-discount-badge)",
                }}
              >
                -{discount}%
              </span>
            )}

            {isRecommended && (
              <span
                className="absolute right-3 top-3 z-20 inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-ink-strong"
                style={{
                  fontFamily: "var(--font-family-inter)",
                  fontSize: "var(--text-caption)",
                  letterSpacing: "0.16em",
                  fontWeight: 700,
                  boxShadow: "0 6px 22px -4px rgba(200, 120, 0,0.55)",
                }}
              >
                <Sparkles size={9} /> PRA VOCÊ
              </span>
            )}

            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onBuy();
              }}
              className="absolute bottom-3 left-1/2 z-20 -translate-x-1/2 translate-y-0 whitespace-nowrap px-7 py-3 opacity-100 transition-all duration-300 lg:translate-y-2 lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100 cursor-pointer"
              style={{
                background: "var(--gradient-buy)",
                color: "white",
                borderRadius: "var(--radius-pill)",
                fontFamily: "var(--font-family-inter)",
                fontSize: "var(--text-caption)",
                fontWeight: 700,
                letterSpacing: "0.04em",
                boxShadow: "var(--shadow-buy-cta-sm)",
              }}
            >
              <span className="inline-flex items-center gap-1.5">
                <ShoppingCart size={11} strokeWidth={2} /> Adicionar setup
              </span>
            </button>
          </div>

          <div className="mt-3 px-1">
            <p
              className="mb-1 uppercase text-zinc-500"
              style={{
                fontFamily: "var(--font-family-inter)",
                fontSize: "var(--text-caption)",
                letterSpacing: "0.14em",
                fontWeight: 600,
              }}
            >
              {preset.tagline}
            </p>
            <h3
              className="line-clamp-1 text-ink-strong"
              style={{
                fontFamily: "var(--font-family-figtree)",
                fontSize: "var(--text-base)",
                fontWeight: 700,
                lineHeight: 1.2,
                letterSpacing: "-0.015em",
              }}
            >
              {preset.name}
            </h3>
            <div className="mt-1.5">
              <StarRating rating={preset.rating} reviews={preset.reviews} />
            </div>

            <div className="mt-2.5">
              {preset.oldPrice && (
                <p
                  className="line-through leading-none mb-0.5 tabular-nums"
                  style={{
                    fontFamily: "var(--font-family-inter)",
                    fontSize: "var(--text-caption)",
                    color: "rgba(255,255,255,0.32)",
                  }}
                >
                  {formatBRL(preset.oldPrice)}
                </p>
              )}
              {preset.pixDiscount ? (
                <>
                  <p
                    className="leading-none text-green-300 tabular-nums"
                    style={{
                      fontFamily: "var(--font-family-figtree)",
                      fontSize: "var(--text-lg)",
                      fontWeight: 800,
                      letterSpacing: "-0.015em",
                    }}
                  >
                    {formatBRL(pixPrice)}{" "}
                    <span
                      className="text-zinc-500"
                      style={{ fontSize: "var(--text-caption)", fontWeight: 600 }}
                    >
                      no PIX
                    </span>
                  </p>
                  <p
                    className="mt-1 leading-tight text-zinc-400"
                    style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)" }}
                  >
                    ou {preset.installments.count}x de R$ {installmentValue}
                  </p>
                </>
              ) : (
                <>
                  <p
                    className="leading-none text-ink-strong tabular-nums"
                    style={{
                      fontFamily: "var(--font-family-figtree)",
                      fontSize: "var(--text-lg)",
                      fontWeight: 800,
                      letterSpacing: "-0.015em",
                    }}
                  >
                    {formatBRL(preset.price)}
                  </p>
                  <p
                    className="mt-1 leading-tight text-zinc-400"
                    style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)" }}
                  >
                    {preset.installments.count}x de R$ {installmentValue}
                  </p>
                </>
              )}
            </div>
          </div>
        </button>
      </article>

      <PresetComponentsDrawer
        preset={preset}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        onBuy={onBuy}
        onApply={onApply}
      />
    </>
  );
}

type PresetFilter = "all" | "gamer" | "creator" | "daily";
type PresetSort = "recommended" | "price-asc" | "price-desc";

const filterChips: Array<{ id: PresetFilter; label: string; sub: string }> = [
  { id: "all", label: "Todos", sub: "" },
  { id: "gamer", label: "Gamer", sub: "FPS" },
  { id: "creator", label: "Creator", sub: "Design / vídeo" },
  { id: "daily", label: "Dia-a-dia", sub: "Office" },
];

function PresetGallery({
  recommended,
  onApply,
  onBuy,
  onBack,
}: {
  recommended: PresetTier | null;
  onApply: (preset: Preset) => void;
  onBuy: (preset: Preset) => void;
  onBack: () => void;
}) {
  const recommendedPreset = recommended
    ? presets.find((p) => p.id === recommended) ?? null
    : null;
  const samePersonaOthers = recommendedPreset
    ? presets.filter(
        (p) => p.persona === recommendedPreset.persona && p.id !== recommendedPreset.id,
      )
    : [];
  const otherPersonaSamples = recommendedPreset
    ? (["gamer", "creator", "daily"] as const)
        .filter((per) => per !== recommendedPreset.persona)
        .map((per) =>
          presets.find(
            (p) => p.persona === per && p.performance === recommendedPreset.performance,
          ) ?? presets.find((p) => p.persona === per),
        )
        .filter((p): p is Preset => Boolean(p))
    : [];

  const [filter, setFilter] = useState<PresetFilter>("all");
  const [sort, setSort] = useState<PresetSort>("recommended");

  const visiblePresets = useMemo(() => {
    let list = filter === "all" ? presets : presets.filter((p) => p.persona === filter);
    if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    return list;
  }, [filter, sort]);

  if (recommendedPreset) {
    return (
      <div className="mx-auto max-w-[1320px] px-6 py-12 md:py-14">
        <button
          type="button"
          onClick={onBack}
          className="mb-8 flex h-11 items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-ink-strong cursor-pointer md:h-9"
          style={{ fontFamily: "var(--font-family-inter)", fontWeight: 600 }}
        >
          <ArrowLeft size={14} /> Voltar
        </button>

        <div className="mb-8 text-center">
          <p
            className="mb-3 uppercase text-primary"
            style={{
              fontFamily: "var(--font-family-inter)",
              fontSize: "var(--text-caption)",
              letterSpacing: "0.28em",
              fontWeight: 700,
            }}
          >
            // O setup escolhido para você é
          </p>
          <h2
            className="mb-3 text-ink-strong"
            style={{
              fontFamily: "var(--font-family-figtree)",
              fontSize: "clamp(36px, 5.5vw, 64px)",
              fontWeight: 800,
              letterSpacing: "-0.035em",
              lineHeight: 0.98,
              textTransform: "uppercase",
            }}
          >
            {recommendedPreset.name.replace(/^PCYES\s+/i, "")}
          </h2>
          <p
            className="mx-auto max-w-[560px] text-zinc-400"
            style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)", lineHeight: 1.55 }}
          >
            {recommendedPreset.description}
          </p>
        </div>

        <div className="mx-auto max-w-[720px]">
          <PresetCard
            preset={recommendedPreset}
            isRecommended
            onApply={() => onApply(recommendedPreset)}
            onBuy={() => onBuy(recommendedPreset)}
          />
        </div>

        {samePersonaOthers.length > 0 && (
          <section className="mt-16">
            <div className="mb-6">
              <p
                className="mb-1 uppercase text-zinc-500"
                style={{
                  fontFamily: "var(--font-family-inter)",
                  fontSize: "var(--text-caption)",
                  letterSpacing: "0.28em",
                  fontWeight: 700,
                }}
              >
                // Mais ou menos potência
              </p>
              <h3
                className="text-ink-strong"
                style={{
                  fontFamily: "var(--font-family-figtree)",
                  fontSize: "clamp(20px, 2.4vw, 26px)",
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                }}
              >
                Outras opções para o seu uso
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {samePersonaOthers.map((p) => (
                <PresetMiniCard
                  key={p.id}
                  preset={p}
                  onApply={() => onApply(p)}
                  onBuy={() => onBuy(p)}
                />
              ))}
            </div>
          </section>
        )}

        {otherPersonaSamples.length > 0 && (
          <section className="mt-14">
            <div className="mb-6">
              <p
                className="mb-1 uppercase text-zinc-500"
                style={{
                  fontFamily: "var(--font-family-inter)",
                  fontSize: "var(--text-caption)",
                  letterSpacing: "0.28em",
                  fontWeight: 700,
                }}
              >
                // Pra outros perfis
              </p>
              <h3
                className="text-ink-strong"
                style={{
                  fontFamily: "var(--font-family-figtree)",
                  fontSize: "clamp(20px, 2.4vw, 26px)",
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                }}
              >
                Talvez você também curta
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {otherPersonaSamples.map((p) => (
                <PresetMiniCard
                  key={p.id}
                  preset={p}
                  onApply={() => onApply(p)}
                  onBuy={() => onBuy(p)}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1320px] px-6 py-12 md:py-14">
      <button
        type="button"
        onClick={onBack}
        className="mb-8 flex items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-ink-strong cursor-pointer"
        style={{ fontFamily: "var(--font-family-inter)", fontWeight: 600 }}
      >
        <ArrowLeft size={14} /> Voltar
      </button>
      <div className="mb-10 text-center">
        <p
          className="mb-3 uppercase text-zinc-500"
          style={{
            fontFamily: "var(--font-family-inter)",
            fontSize: "var(--text-caption)",
            letterSpacing: "0.28em",
            fontWeight: 700,
          }}
        >
          // Builds prontas
        </p>
        <h2
          className="mb-3 text-ink-strong"
          style={{
            fontFamily: "var(--font-family-figtree)",
            fontSize: "clamp(28px, 4vw, 42px)",
            fontWeight: 700,
            letterSpacing: "-0.02em",
          }}
        >
          Escolha seu <span className="text-primary">setup</span>
        </h2>
        <p
          className="mx-auto max-w-[520px] text-zinc-400"
          style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)", lineHeight: 1.6 }}
        >
          Builds montadas e testadas. Clique para ver todas as peças e comprar com 1 clique.
        </p>
      </div>

      <div className="mb-7 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div
          role="tablist"
          aria-label="Filtrar por categoria"
          className="flex flex-wrap items-center gap-2"
        >
          {filterChips.map((c) => {
            const active = filter === c.id;
            return (
              <button
                key={c.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setFilter(c.id)}
                className={cn(
                  "group inline-flex min-h-[44px] cursor-pointer items-center gap-1.5 rounded-full border px-3.5 py-2 transition-all md:min-h-0",
                  active
                    ? "border-primary/60 bg-foreground/[0.06] text-ink-strong"
                    : "border-edge-subtle bg-white/[0.015] text-zinc-300 hover:border-edge-strong hover:bg-white/[0.05] hover:text-ink-strong",
                )}
                style={{
                  fontFamily: "var(--font-family-inter)",
                  fontSize: "var(--text-caption)",
                  fontWeight: 600,
                  boxShadow: active ? "0 0 0 1px rgba(17, 17, 17, 0.08), 0 10px 28px -10px rgba(200, 120, 0,0.4)" : undefined,
                }}
              >
                {c.label}
                {c.sub && (
                  <span
                    className={cn(
                      "uppercase",
                      active ? "text-primary" : "text-zinc-500",
                    )}
                    style={{
                      fontSize: "var(--text-caption)",
                      letterSpacing: "0.18em",
                      fontWeight: 700,
                    }}
                  >
                    {c.sub}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <ArrowUpDown size={13} className="text-zinc-500" />
          <Select value={sort} onValueChange={(v) => setSort(v as PresetSort)}>
            <SelectTrigger
              className="h-11 w-[180px] rounded-full border-edge bg-white/[0.015] text-zinc-200 hover:border-edge-strong md:h-9"
              style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 600 }}
            >
              <SelectValue placeholder="Ordenar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recommended">Recomendado</SelectItem>
              <SelectItem value="price-asc">Menor preço</SelectItem>
              <SelectItem value="price-desc">Maior preço</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {visiblePresets.length === 0 ? (
        <div
          className="mx-auto max-w-[420px] rounded-[var(--radius-card-md)] border border-edge-subtle bg-surface-0 p-8 text-center"
        >
          <p
            className="text-zinc-300"
            style={{
              fontFamily: "var(--font-family-figtree)",
              fontSize: "var(--text-base)",
              fontWeight: 600,
            }}
          >
            Nada nesse filtro ainda.
          </p>
          <p
            className="mt-1 text-zinc-500"
            style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)" }}
          >
            Tente outra categoria ou veja todos os setups.
          </p>
          <button
            type="button"
            onClick={() => setFilter("all")}
            className="mt-4 inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-full bg-primary px-4 text-ink-strong transition-all hover:brightness-110"
            style={{
              fontFamily: "var(--font-family-inter)",
              fontSize: "var(--text-caption)",
              fontWeight: 700,
            }}
          >
            Ver todos
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visiblePresets.map((p) => (
            <PresetMiniCard
              key={p.id}
              preset={p}
              onApply={() => onApply(p)}
              onBuy={() => onBuy(p)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function TopBar() {
  return (
    <header className="sticky top-0 z-50 border-b border-edge-subtle bg-surface-0/95 backdrop-blur-xl">
      <div className="mx-auto flex h-[64px] max-w-[1520px] items-center justify-between gap-3 px-5 md:px-8">
        <Link to="/" className="flex items-center gap-3 transition-opacity hover:opacity-80" aria-label="PCYES home">
          <img src={LOGO_URL} alt="PCYES" className="h-[24px] w-auto" />
        </Link>
        <Link
          to="/"
          className="flex h-9 items-center gap-1.5 rounded-full border border-edge bg-white/[0.02] px-4 text-zinc-300 transition-all hover:border-edge-strong hover:bg-white/[0.06] hover:text-ink-strong"
          style={{
            fontFamily: "var(--font-family-inter)",
            fontSize: "var(--text-caption)",
            fontWeight: 600,
          }}
        >
          <X size={12} /> Voltar para o Site
        </Link>
      </div>
    </header>
  );
}

function PathCard({
  icon,
  label,
  desc,
  cta,
  badge,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  desc: string;
  cta: string;
  badge?: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative flex flex-col overflow-hidden rounded-[var(--radius-card-xl)] border border-edge bg-surface-0 p-7 text-left transition-all duration-300 md:border-edge-subtle hover:border-primary/45 hover:bg-surface-1 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#080808]"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35] transition-opacity duration-500 group-hover:opacity-100 md:opacity-0"
        style={{ background: "radial-gradient(circle at 50% 0%, rgba(17, 17, 17, 0.08), transparent 60%)" }}
      />
      {badge && (
        <span
          className="absolute right-5 top-5 rounded-full bg-primary px-2 py-0.5 text-ink-strong"
          style={{
            fontFamily: "var(--font-family-inter)",
            fontSize: "var(--text-caption)",
            letterSpacing: "0.16em",
            fontWeight: 700,
            boxShadow: "0 6px 20px -4px rgba(200, 120, 0,0.6)",
          }}
        >
          {badge}
        </span>
      )}
      <div className="relative">
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-foreground/10 bg-foreground/[0.06] text-primary transition-all group-hover:scale-110 group-hover:border-primary/45 group-hover:bg-foreground/[0.08]">
          {icon}
        </div>
        <h3
          className="mb-2 text-ink-strong"
          style={{
            fontFamily: "var(--font-family-figtree)",
            fontSize: "var(--text-lg)",
            fontWeight: 700,
            letterSpacing: "-0.015em",
          }}
        >
          {label}
        </h3>
        <p
          className="mb-6 text-zinc-400"
          style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)", lineHeight: 1.6 }}
        >
          {desc}
        </p>
        <div
          className="flex items-center gap-2 text-primary"
          style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)", fontWeight: 600 }}
        >
          {cta}
          <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </button>
  );
}

function WelcomeScreen({ onPath }: { onPath: (p: "builder" | "quiz" | "presets") => void }) {
  return (
    <div className="relative">
      <div
        className="relative overflow-hidden border-b border-edge-subtle"
        style={{ background: "var(--surface-0)" }}
      >
        <div
          className="pointer-events-none absolute"
          style={{
            top: "-25%",
            right: "-18%",
            width: "65%",
            height: "120%",
            background:
              "radial-gradient(circle, rgba(17, 17, 17, 0.08) 0%, rgba(200, 120, 0,0.025) 40%, transparent 70%)",
            filter: "blur(90px)",
          }}
        />
        <div
          className="pointer-events-none absolute"
          style={{
            bottom: "-30%",
            left: "-12%",
            width: "45%",
            height: "70%",
            background:
              "radial-gradient(circle, rgba(17, 17, 17, 0.04) 0%, transparent 65%)",
            filter: "blur(100px)",
          }}
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-32"
          style={{
            background:
              "linear-gradient(180deg, transparent 0%, rgba(10,10,10,1) 100%)",
          }}
        />
        <div className="relative mx-auto max-w-[1320px] px-6 py-12 md:py-24 lg:py-28 text-center">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-4 uppercase text-primary"
            style={{
              fontFamily: "var(--font-family-inter)",
              fontSize: "var(--text-caption)",
              letterSpacing: "0.3em",
              fontWeight: 700,
            }}
          >
            // Monte seu PC
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
            className="text-ink-strong"
            style={{
              fontFamily: "var(--font-family-figtree)",
              fontSize: "clamp(30px, 6vw, 68px)",
              fontWeight: 700,
              letterSpacing: "-0.035em",
              lineHeight: 1,
            }}
          >
            Seu setup,{" "}
            <span
              style={{
                backgroundImage:
                  "linear-gradient(120deg, #ffffff 0%, #a0a0a8 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                display: "inline-block",
              }}
            >
              sua regra.
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mx-auto mt-6 max-w-[560px] text-ink-muted"
            style={{
              fontFamily: "var(--font-family-inter)",
              fontSize: "var(--text-base)",
              lineHeight: 1.6,
            }}
          >
            Configure cada peça do seu jeito ou deixa a gente sugerir. Compatibilidade garantida, preço em tempo real, parcelado em até 10x.
          </motion.p>
        </div>
      </div>

      <div className="mx-auto max-w-[1180px] px-6 py-14 md:py-16">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <PathCard
            icon={<Cpu className="h-5 w-5" />}
            label="Eu já sei o que quero"
            desc="Vai direto para o builder. Escolhe cada peça do zero, com filtros, busca e compatibilidade automática."
            cta="Montar do zero"
            onClick={() => onPath("builder")}
          />
          <PathCard
            icon={<Wand2 className="h-5 w-5" />}
            label="Me ajuda a escolher"
            desc="Diz para gente o que você joga, edita ou faz no dia-a-dia. A gente devolve a build certa para o seu uso."
            cta="Começar"
            badge="POPULAR"
            onClick={() => onPath("quiz")}
          />
          <PathCard
            icon={<Sparkles className="h-5 w-5" />}
            label="Quero builds prontas"
            desc="Setups Start, Para o e Ultra já montados e testados. Aplica e customiza qualquer peça antes de comprar."
            cta="Ver setups"
            onClick={() => onPath("presets")}
          />
        </div>
      </div>
    </div>
  );
}

type CompatSeverity = "ok" | "warn" | "error";
type CompatCheck = {
  id: string;
  severity: CompatSeverity;
  label: string;
  detail: string;
  fix?: { label: string; stepId: string };
};
type Freight = { label: string; value: number; days: number; free: boolean };

const CPU_TDP: Array<{ pattern: RegExp; watt: number }> = [
  { pattern: /i9|Ryzen 9|7950X|9950/i, watt: 250 },
  { pattern: /i7|Ryzen 7|7800X3D|14700/i, watt: 150 },
  { pattern: /i5|Ryzen 5|7600|13400/i, watt: 95 },
  { pattern: /i3|Ryzen 3/i, watt: 65 },
];
const GPU_TDP: Array<{ pattern: RegExp; watt: number }> = [
  { pattern: /4090/, watt: 450 },
  { pattern: /4080/, watt: 320 },
  { pattern: /4070\s*Ti/i, watt: 285 },
  { pattern: /4070/, watt: 200 },
  { pattern: /4060\s*Ti/i, watt: 165 },
  { pattern: /4060/, watt: 115 },
];

function matchWatt(text: string, patterns: Array<{ pattern: RegExp; watt: number }>, fallback: number): number {
  for (const p of patterns) if (p.pattern.test(text)) return p.watt;
  return fallback;
}
function extractWatt(text: string): number {
  const m = text.match(/(\d{3,4})\s*W/i);
  return m ? parseInt(m[1], 10) : 0;
}
function findToken(highlights: string[] | undefined, regex: RegExp): string | null {
  if (!highlights) return null;
  for (const h of highlights) if (regex.test(h)) return h;
  return null;
}

function computeCompat(
  cpu?: Option,
  mb?: Option,
  ram?: Option,
  gpu?: Option,
  psu?: Option,
): { checks: CompatCheck[]; estimatedWatt: number; psuWatt: number } {
  const cpuSocket = findToken(cpu?.highlights, /^(LGA|AM)/);
  const mbSocket = findToken(mb?.highlights, /^(LGA|AM)/);
  const ramType = findToken(ram?.highlights, /^DDR/);
  const mbDDR = findToken(mb?.highlights, /^DDR/);

  const cpuWatt = matchWatt(cpu?.name ?? "", CPU_TDP, 65);
  const gpuWatt = matchWatt(gpu?.name ?? "", GPU_TDP, 100);
  const estimatedWatt = cpuWatt + gpuWatt + 80;
  const psuWatt = extractWatt(`${psu?.name ?? ""} ${(psu?.highlights ?? []).join(" ")}`);
  const powerOk = psuWatt === 0 ? true : psuWatt >= Math.round(estimatedWatt * 1.3);
  const powerTight = psuWatt > 0 && psuWatt < Math.round(estimatedWatt * 1.3) && psuWatt >= estimatedWatt;

  const checks: CompatCheck[] = [];

  if (cpuSocket && mbSocket && cpuSocket !== mbSocket) {
    checks.push({
      id: "socket",
      severity: "error",
      label: "Socket incompatível",
      detail: `Processador usa ${cpuSocket}, mas placa-mãe é ${mbSocket}.`,
      fix: { label: "Trocar placa-mãe", stepId: "motherboard" },
    });
  } else {
    checks.push({
      id: "socket",
      severity: "ok",
      label: "Socket processador / placa-mãe",
      detail: cpuSocket && mbSocket ? `${cpuSocket} confirma encaixe` : "Verificado pela compatibilidade da etapa",
    });
  }

  if (ramType && mbDDR && ramType !== mbDDR) {
    checks.push({
      id: "memory",
      severity: "error",
      label: "Memória incompatível",
      detail: `RAM é ${ramType} mas placa-mãe suporta ${mbDDR}.`,
      fix: { label: "Trocar memória", stepId: "ram" },
    });
  } else {
    checks.push({
      id: "memory",
      severity: "ok",
      label: "Memória compatível",
      detail: ramType ? `${ramType} suportado pela placa-mãe` : "Tipo dentro do padrão",
    });
  }

  if (psuWatt > 0 && !powerOk && !powerTight) {
    checks.push({
      id: "power",
      severity: "error",
      label: "Fonte subdimensionada",
      detail: `Consumo ${estimatedWatt}W exige fonte ≥${Math.round(estimatedWatt * 1.3)}W. Atual: ${psuWatt}W.`,
      fix: { label: "Trocar fonte", stepId: "psu" },
    });
  } else if (powerTight) {
    checks.push({
      id: "power",
      severity: "warn",
      label: "Fonte no limite",
      detail: `Fonte ${psuWatt}W cobre ${estimatedWatt}W estimados mas sem folga para picos. Recomendado ${Math.round(estimatedWatt * 1.3)}W+.`,
      fix: { label: "Upgrade fonte", stepId: "psu" },
    });
  } else {
    checks.push({
      id: "power",
      severity: "ok",
      label: "Fonte com folga estimada",
      detail:
        psuWatt > 0
          ? `Consumo ${estimatedWatt}W · Fonte ${psuWatt}W (${Math.round((psuWatt / estimatedWatt) * 100)}% capacidade)`
          : `Consumo estimado ${estimatedWatt}W`,
    });
  }

  checks.push({
    id: "thermal",
    severity: "ok",
    label: "Refrigeração adequada",
    detail: "Solução térmica cobre TDP do processador",
  });

  return { checks, estimatedWatt, psuWatt };
}

function formatCep(input: string): string {
  const digits = input.replace(/\D/g, "").slice(0, 8);
  return digits.length <= 5 ? digits : `${digits.slice(0, 5)}-${digits.slice(5)}`;
}

function calculateFreight(cep: string, total: number): Freight | null {
  const digits = cep.replace(/\D/g, "");
  if (digits.length !== 8) return null;
  if (total >= 5000) return { label: "Frete grátis", value: 0, days: 4, free: true };
  const prefix = digits.slice(0, 2);
  const nearby = ["01", "02", "03", "04", "05", "08", "13", "80", "81", "82", "87", "88"].includes(prefix);
  return nearby
    ? { label: "Sedex Express", value: 28.9, days: 3, free: false }
    : { label: "Sedex Padrão", value: 49.9, days: 6, free: false };
}

function ReviewScreen({
  categoriesWithSelected,
  buildName,
  onBuildName,
  total,
  cep,
  onCepChange,
  freight,
  onCalcFreight,
  compat,
  onEdit,
  onFixStep,
  onSave,
  onShare,
  onBuy,
}: {
  categoriesWithSelected: Array<Category & { selectedOption?: Option }>;
  buildName: string;
  onBuildName: (n: string) => void;
  total: number;
  cep: string;
  onCepChange: (v: string) => void;
  freight: Freight | null;
  onCalcFreight: () => void;
  compat: ReturnType<typeof computeCompat>;
  onEdit: () => void;
  onFixStep: (id: string) => void;
  onSave: () => void;
  onShare: () => void;
  onBuy: () => void;
}) {
  const finalTotal = total + (freight?.value ?? 0);
  return (
    <div className="mx-auto max-w-[1280px] px-6 py-10 md:py-14">
      <button
        type="button"
        onClick={onEdit}
        className="mb-7 flex items-center gap-2 text-zinc-400 transition-colors hover:text-ink-strong cursor-pointer"
        style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)", fontWeight: 600 }}
      >
        <ArrowLeft size={14} /> Editar build
      </button>

      <div className="mb-10 text-center">
        <p
          className="mb-3 uppercase text-zinc-500"
          style={{
            fontFamily: "var(--font-family-inter)",
            fontSize: "var(--text-caption)",
            letterSpacing: "0.28em",
            fontWeight: 700,
          }}
        >
          // Revisão final
        </p>
        <div className="mx-auto inline-flex max-w-full items-center gap-2.5">
          <input
            value={buildName}
            onChange={(e) => onBuildName(e.target.value)}
            placeholder="Minha build PCYES"
            aria-label="Nome da build"
            maxLength={50}
            className="border-none bg-transparent text-center text-ink-strong outline-none focus:ring-0"
            style={{
              fontFamily: "var(--font-family-figtree)",
              fontSize: "clamp(28px, 4vw, 40px)",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              width: `${Math.max(buildName.length + 1, 12)}ch`,
            }}
          />
        </div>
        <p
          className="mt-2 text-zinc-400"
          style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)" }}
        >
          Confira sua configuração antes de comprar
        </p>
      </div>

      <div
        className="mb-6 flex items-start gap-3 rounded-[var(--radius-card-sm)] border border-blue-500/25 bg-blue-500/[0.06] px-4 py-3"
        role="note"
      >
        <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-blue-300">
          <span style={{ fontSize: "var(--text-caption)", fontWeight: 700 }}>i</span>
        </div>
        <p
          className="text-zinc-200"
          style={{
            fontFamily: "var(--font-family-inter)",
            fontSize: "var(--text-caption)",
            lineHeight: 1.5,
          }}
        >
          <span className="text-blue-300" style={{ fontWeight: 700 }}>
            IMPORTANTE:
          </span>{" "}
          Configurações montadas aqui são enviadas separadamente, sem montagem. Os valores consideram apenas o preço dos componentes.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_400px]">
        <div className="space-y-5">
          <section>
            <h3
              className="mb-4 text-ink-strong"
              style={{
                fontFamily: "var(--font-family-figtree)",
                fontSize: "var(--text-base)",
                fontWeight: 700,
              }}
            >
              Componentes ({categoriesWithSelected.length})
            </h3>
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {categoriesWithSelected.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center gap-3 rounded-[var(--radius-card-sm)] border border-edge-subtle bg-surface-0 p-3 transition-colors hover:border-edge"
                >
                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-md bg-surface-1">
                    {c.selectedOption?.image ? (
                      <img
                        src={c.selectedOption.image}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-zinc-500">
                        {c.icon}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p
                      className="uppercase text-zinc-500"
                      style={{
                        fontFamily: "var(--font-family-inter)",
                        fontSize: "var(--text-caption)",
                        letterSpacing: "0.18em",
                        fontWeight: 700,
                      }}
                    >
                      {c.title}
                    </p>
                    <p
                      className="mt-0.5 truncate text-ink-strong"
                      style={{
                        fontFamily: "var(--font-family-figtree)",
                        fontSize: "var(--text-caption)",
                        fontWeight: 600,
                        lineHeight: 1.25,
                      }}
                    >
                      {c.selectedOption?.name ?? "-"}
                    </p>
                    <p
                      className="mt-0.5 text-primary tabular-nums"
                      style={{
                        fontFamily: "var(--font-family-figtree)",
                        fontSize: "var(--text-caption)",
                        fontWeight: 700,
                      }}
                    >
                      {c.selectedOption ? formatBRL(c.selectedOption.price) : "-"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-card-md border border-edge-subtle bg-surface-0 p-5">
            <h3
              className="mb-4 text-ink-strong"
              style={{
                fontFamily: "var(--font-family-figtree)",
                fontSize: "var(--text-base)",
                fontWeight: 700,
              }}
            >
              Compatibilidade verificada
            </h3>
            <ul className="space-y-2.5">
              {compat.checks.map((c) => {
                const tone =
                  c.severity === "error"
                    ? { bg: "bg-red-500/15", text: "text-red-400", border: "border-red-500/30" }
                    : c.severity === "warn"
                      ? { bg: "bg-amber-500/15", text: "text-amber-400", border: "border-amber-500/30" }
                      : { bg: "bg-foreground/[0.08]", text: "text-primary", border: "border-foreground/10" };
                return (
                  <li
                    key={c.id}
                    className={cn(
                      "flex items-start gap-3 rounded-card-sm p-3",
                      c.severity === "ok" ? "" : `border ${tone.border} bg-white/[0.02]`,
                    )}
                  >
                    <div className={cn("flex h-7 w-7 shrink-0 items-center justify-center rounded-full", tone.bg)}>
                      {c.severity === "ok" ? (
                        <Check size={13} className={tone.text} strokeWidth={3} />
                      ) : (
                        <span className={cn("font-bold", tone.text)} style={{ fontSize: "var(--text-sm)" }}>!</span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p
                        className="text-ink-strong"
                        style={{
                          fontFamily: "var(--font-family-figtree)",
                          fontSize: "var(--text-sm)",
                          fontWeight: 600,
                        }}
                      >
                        {c.label}
                      </p>
                      <p
                        className="mt-0.5 text-zinc-400"
                        style={{
                          fontFamily: "var(--font-family-inter)",
                          fontSize: "var(--text-caption)",
                          lineHeight: 1.5,
                        }}
                      >
                        {c.detail}
                      </p>
                      {c.fix && (
                        <button
                          type="button"
                          onClick={() => onFixStep(c.fix!.stepId)}
                          className={cn(
                            "mt-2 inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-2.5 py-1 transition-all",
                            c.severity === "error"
                              ? "border-red-500/30 bg-red-500/[0.06] text-red-300 hover:bg-red-500/[0.12]"
                              : "border-amber-500/30 bg-amber-500/[0.06] text-amber-200 hover:bg-amber-500/[0.12]",
                          )}
                          style={{
                            fontFamily: "var(--font-family-inter)",
                            fontSize: "var(--text-caption)",
                            fontWeight: 600,
                          }}
                        >
                          {c.fix.label} <ArrowRight size={10} />
                        </button>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        </div>

        <div className="self-start lg:sticky lg:top-[100px]">
          <div className="overflow-hidden rounded-card-md border border-edge-subtle bg-surface-0">
            <div className="border-b border-edge-subtle p-5">
              <label
                htmlFor="cep-input"
                className="mb-2 block uppercase text-zinc-400"
                style={{
                  fontFamily: "var(--font-family-inter)",
                  fontSize: "var(--text-caption)",
                  letterSpacing: "0.18em",
                  fontWeight: 700,
                }}
              >
                Frete
              </label>
              <div className="flex gap-2">
                <input
                  id="cep-input"
                  type="text"
                  value={cep}
                  onChange={(e) => onCepChange(formatCep(e.target.value))}
                  placeholder="00000-000"
                  inputMode="numeric"
                  aria-label="CEP para cálculo de frete"
                  maxLength={9}
                  className="flex-1 rounded-[var(--radius-card-sm)] border border-edge bg-surface-1 px-3 py-2.5 text-ink-strong placeholder:text-zinc-500 outline-none transition-colors focus:border-primary/45"
                  style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)" }}
                />
                <button
                  type="button"
                  onClick={onCalcFreight}
                  className="rounded-[var(--radius-card-sm)] border border-edge bg-surface-1 px-4 text-zinc-200 transition-all hover:border-edge-strong hover:bg-surface-1 cursor-pointer"
                  style={{
                    fontFamily: "var(--font-family-inter)",
                    fontSize: "var(--text-caption)",
                    fontWeight: 600,
                  }}
                >
                  Calcular
                </button>
              </div>
              {freight && (
                <div
                  className={cn(
                    "mt-3 rounded-[var(--radius-card-sm)] border p-3",
                    freight.free
                      ? "border-foreground/10 bg-foreground/[0.04]"
                      : "border-edge bg-surface-1",
                  )}
                >
                  <p
                    className="text-ink-strong"
                    style={{
                      fontFamily: "var(--font-family-figtree)",
                      fontSize: "var(--text-sm)",
                      fontWeight: 600,
                    }}
                  >
                    {freight.label}
                    {!freight.free && (
                      <span className="ml-2 text-primary tabular-nums">{formatBRL(freight.value)}</span>
                    )}
                  </p>
                  <p
                    className="mt-0.5 text-zinc-400"
                    style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)" }}
                  >
                    Chega em até {freight.days} dia{freight.days > 1 ? "s" : ""} úteis
                  </p>
                </div>
              )}
            </div>

            <div className="p-5">
              <div className="mb-2 flex items-center justify-between text-zinc-400">
                <span style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)" }}>Subtotal</span>
                <span className="tabular-nums" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)" }}>
                  {formatBRL(total)}
                </span>
              </div>
              {freight && (
                <div className="mb-3 flex items-center justify-between text-zinc-400">
                  <span style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)" }}>Frete</span>
                  <span className="tabular-nums" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)" }}>
                    {freight.free ? "Grátis" : formatBRL(freight.value)}
                  </span>
                </div>
              )}
              <div className="flex items-baseline justify-between border-t border-edge-subtle pt-4">
                <span
                  className="text-ink-strong"
                  style={{
                    fontFamily: "var(--font-family-figtree)",
                    fontSize: "var(--text-sm)",
                    fontWeight: 700,
                  }}
                >
                  Total
                </span>
                <span
                  className="text-ink-strong tabular-nums"
                  style={{
                    fontFamily: "var(--font-family-figtree)",
                    fontSize: "var(--text-2xl)",
                    fontWeight: 700,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {formatBRL(finalTotal)}
                </span>
              </div>
              <p
                className="mt-1 text-right text-zinc-400"
                style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)" }}
              >
                ou 10x de {formatBRL(finalTotal / 10)} sem juros
              </p>

              <button
                type="button"
                onClick={onBuy}
                className="mt-5 flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-card-sm bg-primary text-ink-strong transition-all hover:brightness-110"
                style={{
                  fontFamily: "var(--font-family-inter)",
                  fontSize: "var(--text-sm)",
                  fontWeight: 700,
                  letterSpacing: "0.01em",
                  boxShadow: "0 10px 28px -8px rgba(200, 120, 0,0.5)",
                }}
              >
                <ShoppingCart size={14} /> Comprar agora
              </button>

              <div className="mt-3 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={onSave}
                  className="flex h-10 cursor-pointer items-center justify-center gap-1.5 rounded-[var(--radius-card-sm)] border border-edge bg-white/[0.02] text-zinc-200 transition-all hover:border-edge-strong hover:bg-white/[0.05]"
                  style={{
                    fontFamily: "var(--font-family-inter)",
                    fontSize: "var(--text-caption)",
                    fontWeight: 600,
                  }}
                >
                  <Save size={12} /> Salvar
                </button>
                <button
                  type="button"
                  onClick={onShare}
                  className="flex h-10 cursor-pointer items-center justify-center gap-1.5 rounded-[var(--radius-card-sm)] border border-edge bg-white/[0.02] text-zinc-200 transition-all hover:border-edge-strong hover:bg-white/[0.05]"
                  style={{
                    fontFamily: "var(--font-family-inter)",
                    fontSize: "var(--text-caption)",
                    fontWeight: 600,
                  }}
                >
                  <Share2 size={12} /> Compartilhar
                </button>
              </div>
            </div>
          </div>

          <p
            className="mt-3 text-center text-zinc-500"
            style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", lineHeight: 1.5 }}
          >
            Build validada pelo time PCYES. Garantia 12 meses.
          </p>
        </div>
      </div>
    </div>
  );
}

function HeroBuilderBanner({
  totalSelected,
  totalCount,
  onBack,
}: {
  totalSelected: number;
  totalCount: number;
  onBack: () => void;
}) {
  return (
    <div className="border-b border-edge-subtle">
      <div className="mx-auto flex max-w-[1520px] items-end justify-between gap-6 px-6 py-7 md:px-8 md:py-9">
        <div className="min-w-0">
          <button
            type="button"
            onClick={onBack}
            className="mb-3 inline-flex items-center gap-1.5 text-zinc-400 transition-colors hover:text-ink-strong cursor-pointer"
            style={{
              fontFamily: "var(--font-family-inter)",
              fontSize: "var(--text-caption)",
              fontWeight: 600,
            }}
          >
            <ArrowLeft size={13} /> Trocar caminho
          </button>
          <p
            className="mb-2 uppercase text-primary"
            style={{
              fontFamily: "var(--font-family-inter)",
              fontSize: "var(--text-caption)",
              letterSpacing: "0.3em",
              fontWeight: 700,
            }}
          >
            // MONTE SEU PC
          </p>
          <h1
            className="text-ink-strong"
            style={{
              fontFamily: "var(--font-family-figtree)",
              fontSize: "clamp(26px, 3.2vw, 38px)",
              fontWeight: 700,
              lineHeight: 1.04,
              letterSpacing: "-0.025em",
            }}
          >
            Configure sua máquina
          </h1>
        </div>
        <div className="hidden shrink-0 items-center gap-3 md:flex">
          <div className="text-right">
            <p
              className="uppercase text-zinc-500"
              style={{
                fontFamily: "var(--font-family-inter)",
                fontSize: "var(--text-caption)",
                letterSpacing: "0.22em",
                fontWeight: 700,
              }}
            >
              Progresso
            </p>
            <p
              className="mt-0.5 text-ink-strong tabular-nums"
              style={{
                fontFamily: "var(--font-family-figtree)",
                fontSize: "var(--text-lg)",
                fontWeight: 700,
                letterSpacing: "-0.01em",
                lineHeight: 1,
              }}
            >
              <span className="text-primary">{totalSelected}</span>
              <span className="text-zinc-500"> / {totalCount}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function HorizontalStepper({
  categories,
  currentId,
  completedIds,
  onJump,
}: {
  categories: { id: string; title: string; icon: React.ReactNode }[];
  currentId: string;
  completedIds: string[];
  onJump: (id: string) => void;
}) {
  const currentIdx = categories.findIndex((c) => c.id === currentId);
  return (
    <div
      className="border-b border-edge-subtle backdrop-blur-xl"
      style={{
        background:
          "linear-gradient(180deg, rgba(15,15,18,0.85) 0%, rgba(10,10,12,0.9) 100%)",
      }}
    >
      <div className="mx-auto max-w-[1520px] overflow-x-auto px-6 py-5">
        <div className="relative flex min-w-fit items-start justify-between gap-2">
          <div className="pointer-events-none absolute left-0 right-0 top-[20px] h-[2px] bg-white/[0.06]" />
          <motion.div
            className="pointer-events-none absolute left-0 top-[20px] h-[2px]"
            initial={false}
            animate={{
              width: `${categories.length > 1 ? (currentIdx / (categories.length - 1)) * 100 : 0}%`,
            }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            style={{
              background: "linear-gradient(90deg, rgba(52,211,153,0.5) 0%, rgba(52,211,153,1) 100%)",
              boxShadow: "0 0 10px rgba(52,211,153,0.4)",
            }}
          />
          {categories.map((c) => {
            const done = completedIds.includes(c.id);
            const active = c.id === currentId;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => onJump(c.id)}
                aria-current={active ? "step" : undefined}
                aria-label={`${c.title}${done ? " (concluída)" : ""}`}
                className="group relative z-10 flex shrink-0 cursor-pointer flex-col items-center gap-1.5 px-2 focus-visible:outline-none"
              >
                <div
                  className={cn(
                    "relative flex h-[40px] w-[40px] items-center justify-center rounded-full transition-all",
                    active
                      ? "bg-primary text-ink-strong"
                      : done
                        ? "bg-[#0d1f14] text-emerald-400"
                        : "bg-surface-1 text-zinc-500 group-hover:bg-surface-1 group-hover:text-zinc-300",
                  )}
                  style={
                    active
                      ? {
                          boxShadow:
                            "0 0 0 5px #0a0a0c, 0 0 0 7px rgba(200, 120, 0,0.45), 0 0 20px -2px rgba(200, 120, 0,0.5)",
                        }
                      : done
                        ? { boxShadow: "0 0 0 5px #0a0a0c, 0 0 0 6px rgba(52,211,153,0.35)" }
                        : { boxShadow: "0 0 0 5px #0a0a0c, 0 0 0 6px rgba(255,255,255,0.08)" }
                  }
                >
                  {done && !active ? (
                    <Check size={14} strokeWidth={3} />
                  ) : (
                    <span className={cn("flex items-center justify-center", active ? "[&>svg]:size-[16px]" : "[&>svg]:size-[14px]")}>
                      {c.icon}
                    </span>
                  )}
                </div>
                <span
                  className={cn(
                    "max-w-[80px] text-center transition-colors",
                    active ? "text-primary" : done ? "text-emerald-400" : "text-zinc-500",
                  )}
                  style={{
                    fontFamily: "var(--font-family-inter)",
                    fontSize: "var(--text-caption)",
                    fontWeight: active ? 700 : 600,
                    lineHeight: 1.2,
                  }}
                >
                  {c.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function MobileStepNav({
  categories,
  currentId,
  completedIds,
  open,
  onOpenChange,
  onJump,
}: {
  categories: Array<{ id: string; title: string; icon: React.ReactNode; selectedOption?: Option }>;
  currentId: string;
  completedIds: string[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onJump: (id: string) => void;
}) {
  const currentIdx = categories.findIndex((c) => c.id === currentId);
  const current = categories[currentIdx];
  const progress = categories.length > 0 ? (completedIds.length / categories.length) * 100 : 0;

  return (
    <div className="border-b border-edge-subtle backdrop-blur-xl lg:hidden">
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetTrigger asChild>
          <button
            type="button"
            className="flex w-full min-h-[44px] items-center gap-3 px-5 py-3 text-left focus-visible:outline-none"
            style={{
              background:
                "linear-gradient(180deg, rgba(15,15,18,0.85) 0%, rgba(10,10,12,0.9) 100%)",
            }}
            aria-label="Abrir etapas da montagem"
          >
            <div className="flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-full bg-primary text-ink-strong [&>svg]:size-[16px]">
              {current?.icon}
            </div>
            <div className="min-w-0 flex-1">
              <p
                className="uppercase text-zinc-500"
                style={{
                  fontFamily: "var(--font-family-inter)",
                  fontSize: "var(--text-caption)",
                  letterSpacing: "0.22em",
                  fontWeight: 700,
                }}
              >
                Etapa {currentIdx + 1} de {categories.length}
              </p>
              <p
                className="truncate text-ink-strong"
                style={{
                  fontFamily: "var(--font-family-inter)",
                  fontSize: "var(--text-base)",
                  fontWeight: 700,
                  lineHeight: 1.25,
                }}
              >
                {current?.title}
              </p>
            </div>
            <span
              className="flex shrink-0 items-center gap-1 text-zinc-400"
              style={{
                fontFamily: "var(--font-family-inter)",
                fontSize: "var(--text-caption)",
                fontWeight: 600,
              }}
            >
              Ver etapas
              <ChevronRight size={14} />
            </span>
          </button>
        </SheetTrigger>
        <div className="h-[3px] overflow-hidden bg-white/[0.06]">
          <motion.div
            className="h-full"
            initial={false}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            style={{
              background: "linear-gradient(90deg, rgba(200, 120, 0,0.4) 0%, rgba(200, 120, 0,1) 100%)",
              boxShadow: "0 0 12px rgba(200, 120, 0,0.55)",
            }}
          />
        </div>
        <SheetContent
          side="bottom"
          className="max-h-[80vh] gap-0 overflow-y-auto rounded-t-2xl border-edge-subtle bg-surface-0 p-0"
        >
          <SheetHeader className="border-b border-edge-subtle p-5">
            <SheetTitle
              className="text-ink-strong"
              style={{
                fontFamily: "var(--font-family-inter)",
                fontSize: "var(--text-base)",
                fontWeight: 700,
              }}
            >
              Etapas da montagem
            </SheetTitle>
          </SheetHeader>
          <div className="flex flex-col gap-1.5 p-3">
            {categories.map((c, idx) => {
              const done = completedIds.includes(c.id);
              const active = c.id === currentId;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    onJump(c.id);
                    onOpenChange(false);
                  }}
                  aria-current={active ? "step" : undefined}
                  className={cn(
                    "flex min-h-[44px] w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-colors",
                    active
                      ? "border-primary/50 bg-foreground/[0.06]"
                      : "border-edge-subtle bg-white/[0.02] hover:bg-white/[0.05]",
                  )}
                >
                  <div
                    className={cn(
                      "flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-full transition-colors [&>svg]:size-[15px]",
                      active
                        ? "bg-primary text-ink-strong"
                        : done
                          ? "bg-[#0d1f14] text-emerald-400"
                          : "bg-surface-1 text-zinc-500",
                    )}
                  >
                    {done && !active ? <Check size={15} strokeWidth={3} /> : c.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p
                      className={cn(
                        "truncate",
                        active ? "text-ink-strong" : done ? "text-emerald-300" : "text-zinc-200",
                      )}
                      style={{
                        fontFamily: "var(--font-family-inter)",
                        fontSize: "var(--text-sm)",
                        fontWeight: active ? 700 : 600,
                        lineHeight: 1.3,
                      }}
                    >
                      {idx + 1}. {c.title}
                    </p>
                    <p
                      className={cn(
                        "truncate",
                        c.selectedOption ? "text-zinc-400" : "text-zinc-600",
                      )}
                      style={{
                        fontFamily: "var(--font-family-inter)",
                        fontSize: "var(--text-caption)",
                        fontWeight: 500,
                        lineHeight: 1.3,
                      }}
                    >
                      {c.selectedOption?.name ?? "A escolher"}
                    </p>
                  </div>
                  {active ? (
                    <span
                      className="shrink-0 rounded-full bg-foreground/10 px-2 py-0.5 text-primary"
                      style={{
                        fontFamily: "var(--font-family-inter)",
                        fontSize: "var(--text-caption)",
                        fontWeight: 700,
                        letterSpacing: "0.08em",
                      }}
                    >
                      ATUAL
                    </span>
                  ) : done ? (
                    <Check size={16} strokeWidth={3} className="shrink-0 text-emerald-400" />
                  ) : (
                    <ChevronRight size={16} className="shrink-0 text-zinc-600" />
                  )}
                </button>
              );
            })}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

function ProductTile({
  option,
  category,
  selected,
  onSelect,
  mode,
  multiSelect = false,
  disabled = false,
}: {
  option: Option;
  category: Category;
  selected: boolean;
  onSelect: () => void;
  mode: ViewMode;
  multiSelect?: boolean;
  disabled?: boolean;
}) {
  const baseBtnClass = cn(
    "group relative border text-left transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#080808]",
    disabled ? "cursor-not-allowed opacity-40" : "cursor-pointer",
    selected
      ? "border-primary bg-gradient-to-br from-primary/[0.08] to-primary/[0.02]"
      : "border-edge-subtle bg-gradient-to-br from-[#15151a] to-[#0f0f12] hover:border-edge-strong hover:from-[#1a1a20] hover:to-[#15151a]",
  );
  const shadowStyle = selected
    ? {
        boxShadow:
          "0 0 0 1px rgba(200, 120, 0,0.4), 0 18px 50px -22px rgba(200, 120, 0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)",
      }
    : {
        boxShadow:
          "0 8px 24px -10px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.03)",
      };

  if (mode === "list") {
    return (
      <button
        type="button"
        onClick={onSelect}
        aria-pressed={selected}
        aria-label={`Selecionar ${option.name}${option.standard ? " (sugerida PCYES)" : ""}`}
        className={cn(
          baseBtnClass,
          "flex w-full items-stretch overflow-hidden rounded-[var(--radius-card-sm)] hover:-translate-y-0.5",
          selected && "-translate-y-0.5",
        )}
        style={shadowStyle}
      >
        <div className="relative aspect-square w-[148px] shrink-0 overflow-hidden deal-image-bg">
          {option.standard && (
            <span
              className="absolute left-2 top-2 z-10 inline-flex items-center gap-1 rounded-full bg-primary px-1.5 py-0.5 text-ink-strong"
              style={{
                fontFamily: "var(--font-family-inter)",
                fontSize: "var(--text-caption)",
                letterSpacing: "0.14em",
                fontWeight: 700,
                boxShadow: "0 4px 12px -2px rgba(200, 120, 0,0.55)",
              }}
            >
              <Sparkles size={8} /> SUGERIDA
            </span>
          )}
          <div
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{
              background:
                "radial-gradient(circle at 50% 30%, rgba(255,255,255,0.08), transparent 65%)",
            }}
          />
          {option.image ? (
            <img
              src={option.image}
              alt=""
              className="absolute inset-0 h-full w-full object-contain p-4 transition-transform duration-500 group-hover:scale-[1.06]"
              style={{ mixBlendMode: "normal" }}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-zinc-500">{category.icon}</div>
          )}
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-2 p-4">
          <p
            className="line-clamp-2 text-ink-strong"
            style={{
              fontFamily: "var(--font-family-figtree)",
              fontSize: "var(--text-sm)",
              fontWeight: 600,
              letterSpacing: "-0.005em",
              lineHeight: 1.3,
            }}
          >
            {option.name}
          </p>
          {option.highlights && option.highlights.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {option.highlights.slice(0, 4).map((h) => (
                <span
                  key={h}
                  className="rounded border border-edge-subtle bg-surface-1 px-1.5 py-0.5 text-zinc-300"
                  style={{
                    fontFamily: "var(--font-family-inter)",
                    fontSize: "var(--text-caption)",
                    fontWeight: 500,
                  }}
                >
                  {h}
                </span>
              ))}
            </div>
          )}
          <div className="mt-auto flex items-end justify-between pt-1">
            <div>
              <p
                className={cn("tabular-nums", selected ? "text-primary" : "text-ink-strong")}
                style={{
                  fontFamily: "var(--font-family-figtree)",
                  fontSize: "var(--text-lg)",
                  fontWeight: 700,
                  letterSpacing: "-0.005em",
                  lineHeight: 1,
                }}
              >
                {formatBRL(option.price)}
              </p>
              <p className="mt-1 text-zinc-500" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)" }}>
                10x de {formatBRL(option.price / 10)} sem juros
              </p>
            </div>
            <div
              className={cn(
                "flex h-7 w-7 items-center justify-center border-2 transition-all",
                multiSelect ? "rounded-md" : "rounded-full",
                selected ? "border-primary bg-primary" : "border-edge-strong group-hover:border-primary/60",
              )}
              aria-hidden="true"
            >
              {selected && multiSelect && <Check size={14} className="text-ink-strong" strokeWidth={3} />}
              {selected && !multiSelect && <span className="h-2.5 w-2.5 rounded-full bg-white" />}
            </div>
          </div>
        </div>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      aria-label={`Selecionar ${option.name}${option.standard ? " (sugerida PCYES)" : ""}`}
      className={cn(
        baseBtnClass,
        "flex flex-col overflow-hidden rounded-[var(--radius-card-sm)] hover:-translate-y-0.5",
        selected && "-translate-y-0.5",
      )}
      style={shadowStyle}
    >
      {option.standard && (
        <span
          className="absolute left-2.5 top-2.5 z-10 inline-flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-ink-strong"
          style={{
            fontFamily: "var(--font-family-inter)",
            fontSize: "var(--text-caption)",
            letterSpacing: "0.14em",
            fontWeight: 700,
            boxShadow: "0 6px 18px -4px rgba(200, 120, 0,0.55)",
          }}
        >
          <Sparkles size={8} /> SUGERIDA
        </span>
      )}
      <div
        className={cn(
          "absolute right-2.5 top-2.5 z-10 flex h-[22px] w-[22px] items-center justify-center border-2 transition-all",
          multiSelect ? "rounded-md" : "rounded-full",
          selected ? "border-primary bg-primary" : "border-edge-strong bg-black/30 backdrop-blur-sm group-hover:border-primary/60",
        )}
        aria-hidden="true"
      >
        {selected && multiSelect && <Check size={11} className="text-ink-strong" strokeWidth={3} />}
        {selected && !multiSelect && <span className="h-2 w-2 rounded-full bg-white" />}
      </div>
      <div className="relative aspect-[4/3] w-full overflow-hidden deal-image-bg">
        {option.image ? (
          <img
            src={option.image}
            alt=""
            className="absolute inset-0 h-full w-full object-contain p-4 transition-transform duration-500 group-hover:scale-[1.07]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-zinc-500">{category.icon}</div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1.5 border-t border-edge-subtle p-3">
        <p
          className="line-clamp-2 text-ink-strong"
          style={{
            fontFamily: "var(--font-family-figtree)",
            fontSize: "var(--text-caption)",
            fontWeight: 600,
            letterSpacing: "-0.005em",
            lineHeight: 1.3,
            minHeight: "32px",
          }}
        >
          {option.name}
        </p>
        {option.highlights && option.highlights.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {option.highlights.slice(0, 2).map((h) => (
              <span
                key={h}
                className="rounded border border-edge-subtle bg-surface-1 px-1.5 py-0.5 text-zinc-300"
                style={{
                  fontFamily: "var(--font-family-inter)",
                  fontSize: "var(--text-caption)",
                  fontWeight: 500,
                }}
              >
                {h}
              </span>
            ))}
          </div>
        )}
        <div className="mt-auto flex items-baseline justify-between pt-1">
          <span
            className={cn("tabular-nums", selected ? "text-primary" : "text-ink-strong")}
            style={{
              fontFamily: "var(--font-family-figtree)",
              fontSize: "var(--text-base)",
              fontWeight: 700,
              letterSpacing: "-0.005em",
            }}
          >
            {formatBRL(option.price)}
          </span>
          <span className="text-zinc-500" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)" }}>
            10x {formatBRL(option.price / 10)}
          </span>
        </div>
      </div>
    </button>
  );
}

type StepMessageTone = "info" | "success" | "warn" | "error";
type StepMessage = { tone: StepMessageTone; text: string };

function computeStepMessages(
  category: Category,
  selections: Record<string, string[]>,
): StepMessage[] {
  const msgs: StepMessage[] = [];
  const min = getMinSlots(category);
  const max = getMaxSlots(category);
  const ids = getSelected(selections, category.id);
  const opts = ids
    .map((id) => category.options.find((o) => o.id === id))
    .filter((o): o is Option => Boolean(o));

  const cpuOpt = (selections.cpu ?? [])
    .map((id) => categories.find((c) => c.id === "cpu")?.options.find((o) => o.id === id))
    .filter((o): o is Option => Boolean(o))[0];
  const mbOpt = (selections.motherboard ?? [])
    .map((id) => categories.find((c) => c.id === "motherboard")?.options.find((o) => o.id === id))
    .filter((o): o is Option => Boolean(o))[0];

  if (category.id === "ram" && mbOpt) {
    msgs.push({ tone: "success", text: `A placa-mãe selecionada suporta ${max} slots de memória.` });
  }

  if (category.id === "cooling") {
    const cpuName = cpuOpt?.name?.toLowerCase() ?? "";
    const hasIntegratedCooler =
      /box|wraith|stock/.test(cpuName) || /AMD Ryzen 5 5500|i3-10100|i5-10400/i.test(cpuName);
    if (hasIntegratedCooler) {
      msgs.push({
        tone: "info",
        text: "Refrigeração opcional: o processador selecionado possui cooler integrado.",
      });
    } else {
      msgs.push({
        tone: "info",
        text: "Você pode adicionar múltiplos sistemas de refrigeração ao seu PC.",
      });
    }
  }

  if (category.id === "gpu" && cpuOpt) {
    const hasIGPU =
      /Vídeo Integrado|Integrado|iGPU|integrated graphics/i.test(cpuOpt.summary ?? "") ||
      /Vídeo Integrado/i.test((cpuOpt.highlights ?? []).join(" "));
    if (!hasIGPU) {
      const fLetter = cpuOpt.name.match(/-(\d+)F\b/i);
      if (fLetter) {
        msgs.push({
          tone: "warn",
          text: "O processador selecionado não possui vídeo integrado. GPU obrigatória.",
        });
      }
    }
  }

  if (category.id === "storage") {
    msgs.push({
      tone: "info",
      text: `Máximo de ${max} unidades de armazenamento. Atenção aos slots NVMe da placa-mãe.`,
    });
  }

  if (category.id === "psu") {
    const cpuName = cpuOpt?.name ?? "";
    let baseWatt = 200;
    if (/i7|Ryzen 7/i.test(cpuName)) baseWatt = 450;
    else if (/i5|Ryzen 5/i.test(cpuName)) baseWatt = 350;
    msgs.push({
      tone: "warn",
      text: `Recomendamos uma fonte com potência mínima de ${baseWatt}W para estabilidade.`,
    });
  }

  if (min === 0 && opts.length === 0) {
    msgs.push({ tone: "info", text: "Etapa opcional: você pode pular esta etapa." });
  }

  if (min > 0 && opts.length < min) {
    msgs.push({
      tone: "warn",
      text: `Selecione pelo menos ${min === 1 ? "1 item" : `${min} itens`} para continuar.`,
    });
  }

  return msgs;
}

function StepMessages({ messages }: { messages: StepMessage[] }) {
  if (messages.length === 0) return null;
  return (
    <div className="space-y-2">
      {messages.map((m, i) => {
        const tone =
          m.tone === "success"
            ? { bg: "bg-emerald-500/[0.08]", border: "border-emerald-500/30", text: "text-emerald-300", icon: "text-emerald-400" }
            : m.tone === "warn"
              ? { bg: "bg-amber-500/[0.08]", border: "border-amber-500/30", text: "text-amber-200", icon: "text-amber-400" }
              : m.tone === "error"
                ? { bg: "bg-red-500/[0.08]", border: "border-red-500/30", text: "text-red-200", icon: "text-red-400" }
                : { bg: "bg-blue-500/[0.08]", border: "border-blue-500/30", text: "text-blue-200", icon: "text-blue-400" };
        return (
          <div
            key={i}
            role={m.tone === "warn" || m.tone === "error" ? "alert" : "status"}
            className={cn("flex items-start gap-2.5 rounded-[var(--radius-card-sm)] border p-2.5", tone.bg, tone.border)}
          >
            <span className={cn("mt-[1px] flex h-3.5 w-3.5 shrink-0 items-center justify-center", tone.icon)}>
              {m.tone === "success" ? (
                <Check size={11} strokeWidth={3} />
              ) : (
                <span className="flex h-3 w-3 items-center justify-center rounded-full border-2 border-current text-[var(--text-caption)] font-bold">
                  {m.tone === "warn" || m.tone === "error" ? "!" : "i"}
                </span>
              )}
            </span>
            <p
              className={cn(tone.text)}
              style={{
                fontFamily: "var(--font-family-inter)",
                fontSize: "var(--text-caption)",
                lineHeight: 1.45,
                fontWeight: 500,
              }}
            >
              {m.text}
            </p>
          </div>
        );
      })}
    </div>
  );
}

function SelectedItemCard({
  category,
  options,
  onRemove,
  onPrev,
  onNext,
  isFirst,
  isLast,
  nextDisabled = false,
  maxSlots,
}: {
  category: Category | undefined;
  options: Option[];
  onRemove: (optionId: string) => void;
  onPrev: () => void;
  onNext: () => void;
  isFirst: boolean;
  isLast: boolean;
  nextDisabled?: boolean;
  maxSlots: number;
}) {
  const isMulti = maxSlots > 1;
  const countLabel = isMulti
    ? `${options.length}/${maxSlots === 99 ? "∞" : maxSlots}`
    : null;
  const total = options.reduce((s, o) => s + o.price, 0);
  const emptySlots = isMulti && maxSlots !== 99
    ? Math.max(0, maxSlots - options.length)
    : 0;

  return (
    <div
      className="overflow-hidden rounded-card-md border border-edge-subtle bg-gradient-to-b from-[#15151a] to-[#0d0d0d]"
      style={{
        boxShadow:
          "0 16px 40px -16px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.04)",
      }}
    >
      <div className="border-b border-edge-subtle bg-gradient-to-b from-primary/[0.06] to-transparent px-5 pt-4 pb-3">
        <div className="flex items-center justify-between gap-2">
          <p
            className="uppercase text-primary"
            style={{
              fontFamily: "var(--font-family-inter)",
              fontSize: "var(--text-caption)",
              letterSpacing: "0.22em",
              fontWeight: 700,
            }}
          >
            {isMulti ? "Itens selecionados" : "Item selecionado"}
          </p>
          <div className="flex items-center gap-2">
            {countLabel && (
              <span
                className="rounded-full bg-foreground/[0.08] px-2 py-0.5 text-primary tabular-nums"
                style={{
                  fontFamily: "var(--font-family-inter)",
                  fontSize: "var(--text-caption)",
                  fontWeight: 700,
                  letterSpacing: "0.04em",
                }}
              >
                {countLabel}
              </span>
            )}
            <span
              className="text-zinc-500"
              style={{
                fontFamily: "var(--font-family-inter)",
                fontSize: "var(--text-caption)",
                fontWeight: 500,
              }}
            >
              {category?.title}
            </span>
          </div>
        </div>
      </div>

      {!isMulti && options.length > 0 && (
        <div className="px-5 py-4">
          <div className="mb-4 flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-[var(--radius-card-sm)] deal-image-bg">
            {options[0].image ? (
              <img
                src={options[0].image}
                alt={options[0].name}
                className="h-full w-full object-contain p-3"
              />
            ) : (
              <div className="text-zinc-400">{category?.icon}</div>
            )}
          </div>
          <p
            className="text-ink-strong"
            style={{
              fontFamily: "var(--font-family-figtree)",
              fontSize: "var(--text-base)",
              fontWeight: 700,
              letterSpacing: "-0.005em",
              lineHeight: 1.3,
            }}
          >
            {options[0].name}
          </p>
          {options[0].highlights && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {options[0].highlights.slice(0, 3).map((h) => (
                <span
                  key={h}
                  className="rounded border border-edge-subtle bg-surface-1 px-1.5 py-0.5 text-zinc-300"
                  style={{
                    fontFamily: "var(--font-family-inter)",
                    fontSize: "var(--text-caption)",
                    fontWeight: 500,
                  }}
                >
                  {h}
                </span>
              ))}
            </div>
          )}
          <p
            className="mt-3 text-ink-strong tabular-nums"
            style={{
              fontFamily: "var(--font-family-figtree)",
              fontSize: "var(--text-xl)",
              fontWeight: 700,
              letterSpacing: "-0.015em",
            }}
          >
            {formatBRL(options[0].price)}
          </p>
          <p
            className="mt-0.5 text-zinc-500"
            style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)" }}
          >
            em até 10x de {formatBRL(options[0].price / 10)} sem juros
          </p>
        </div>
      )}

      {isMulti && (
        <div className="space-y-2 px-4 py-4">
          {options.map((opt, idx) => (
            <div
              key={opt.id}
              className="flex items-center gap-3 rounded-card-sm border border-emerald-500/30 bg-emerald-500/[0.04] p-2.5"
              style={{ borderStyle: "dashed" }}
            >
              <div className="h-12 w-12 shrink-0 overflow-hidden rounded-[var(--radius-card)] deal-image-bg">
                {opt.image ? (
                  <img src={opt.image} alt="" className="h-full w-full object-contain p-1.5" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-zinc-400">
                    {category?.icon}
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p
                  className="uppercase text-zinc-500"
                  style={{
                    fontFamily: "var(--font-family-inter)",
                    fontSize: "var(--text-caption)",
                    letterSpacing: "0.18em",
                    fontWeight: 700,
                  }}
                >
                  Slot {String(idx + 1).padStart(2, "0")}
                </p>
                <p
                  className="truncate text-ink-strong"
                  style={{
                    fontFamily: "var(--font-family-figtree)",
                    fontSize: "var(--text-caption)",
                    fontWeight: 600,
                    lineHeight: 1.25,
                  }}
                >
                  {opt.name}
                </p>
                <p
                  className="mt-0.5 text-primary tabular-nums"
                  style={{
                    fontFamily: "var(--font-family-figtree)",
                    fontSize: "var(--text-caption)",
                    fontWeight: 700,
                  }}
                >
                  {formatBRL(opt.price)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onRemove(opt.id)}
                aria-label={`Remover ${opt.name}`}
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-zinc-500 transition-colors hover:bg-red-500/15 hover:text-red-400"
              >
                <X size={14} />
              </button>
            </div>
          ))}

          {Array.from({ length: emptySlots }).map((_, idx) => (
            <div
              key={`empty-${idx}`}
              className="flex items-center justify-center rounded-card-sm border border-edge bg-white/[0.01] p-3"
              style={{ borderStyle: "dashed", minHeight: "60px" }}
            >
              <p
                className="uppercase text-zinc-500"
                style={{
                  fontFamily: "var(--font-family-inter)",
                  fontSize: "var(--text-caption)",
                  letterSpacing: "0.22em",
                  fontWeight: 700,
                }}
              >
                Slot {String(options.length + idx + 1).padStart(2, "0")}
              </p>
            </div>
          ))}

          {options.length === 0 && emptySlots === 0 && (
            <div className="rounded-card-sm border border-edge-subtle bg-white/[0.01] p-6 text-center">
              <p
                className="text-zinc-500"
                style={{
                  fontFamily: "var(--font-family-inter)",
                  fontSize: "var(--text-caption)",
                }}
              >
                Selecione um ou mais itens da lista
              </p>
            </div>
          )}

          {options.length > 0 && (
            <div className="mt-3 flex items-baseline justify-between rounded-[var(--radius-card-sm)] border border-edge-subtle bg-white/[0.02] px-3 py-2">
              <span
                className="uppercase text-zinc-400"
                style={{
                  fontFamily: "var(--font-family-inter)",
                  fontSize: "var(--text-caption)",
                  letterSpacing: "0.18em",
                  fontWeight: 700,
                }}
              >
                Total {category?.title}
              </span>
              <span
                className="text-ink-strong tabular-nums"
                style={{
                  fontFamily: "var(--font-family-figtree)",
                  fontSize: "var(--text-base)",
                  fontWeight: 700,
                  letterSpacing: "-0.01em",
                }}
              >
                {formatBRL(total)}
              </span>
            </div>
          )}
        </div>
      )}

      {!isMulti && options.length === 0 && (
        <div className="px-5 py-6 text-center">
          <p
            className="text-zinc-500"
            style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)" }}
          >
            Selecione uma opção da lista
          </p>
        </div>
      )}

      <div className="border-t border-edge-subtle bg-surface-0 p-4">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onPrev}
            disabled={isFirst}
            className="flex h-10 flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-[var(--radius-card-sm)] border border-edge bg-white/[0.02] text-zinc-300 transition-all hover:border-edge-strong hover:bg-white/[0.06] hover:text-ink-strong disabled:cursor-not-allowed disabled:opacity-25"
            style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 600 }}
          >
            <ArrowLeft size={12} /> Voltar
          </button>
          <button
            type="button"
            onClick={onNext}
            disabled={nextDisabled}
            className="flex h-10 flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-[var(--radius-card-sm)] bg-primary text-ink-strong transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:brightness-100"
            style={{
              fontFamily: "var(--font-family-inter)",
              fontSize: "var(--text-caption)",
              fontWeight: 600,
              letterSpacing: "0.01em",
              boxShadow: nextDisabled ? "none" : "0 8px 24px -8px rgba(200, 120, 0,0.5)",
            }}
          >
            {isLast ? "Revisar" : "Avançar"} <ArrowRight size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}

function ConfiguracaoSelecionadaCard({
  categories,
  total,
  onEdit,
}: {
  categories: Array<Category & { selectedOption?: Option }>;
  total: number;
  onEdit: (id: string) => void;
}) {
  const filled = categories.filter((c) => c.selectedOption);
  return (
    <div
      className="overflow-hidden rounded-card-md border border-edge-subtle bg-gradient-to-b from-[#13131a] to-[#0d0d0d]"
      style={{
        boxShadow:
          "0 16px 40px -16px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.04)",
      }}
    >
      <div className="border-b border-edge-subtle px-5 pt-4 pb-3">
        <div className="flex items-baseline justify-between">
          <p
            className="text-ink-strong"
            style={{
              fontFamily: "var(--font-family-figtree)",
              fontSize: "var(--text-sm)",
              fontWeight: 700,
              letterSpacing: "-0.005em",
            }}
          >
            Configuração selecionada
          </p>
          <span
            className="rounded-full bg-foreground/[0.06] px-2 py-0.5 text-primary tabular-nums"
            style={{
              fontFamily: "var(--font-family-inter)",
              fontSize: "var(--text-caption)",
              fontWeight: 700,
              letterSpacing: "0.04em",
            }}
          >
            {filled.length}/{categories.length}
          </span>
        </div>
      </div>
      {filled.length === 0 ? (
        <div className="px-5 py-6 text-center">
          <p
            className="text-zinc-500"
            style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)" }}
          >
            Nenhum componente selecionado ainda.
            <br />
            Comece escolhendo as peças.
          </p>
        </div>
      ) : (
        <ScrollArea type="auto" className="h-[280px]">
          <div className="space-y-1 px-3 py-3">
          {filled.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => onEdit(c.id)}
              className="group flex w-full cursor-pointer items-center gap-2.5 rounded-[var(--radius-card-sm)] p-2 text-left transition-colors hover:bg-white/[0.04]"
              aria-label={`Editar ${c.title}`}
            >
              <div className="h-9 w-9 shrink-0 overflow-hidden rounded-md bg-surface-1">
                {c.selectedOption?.image ? (
                  <img src={c.selectedOption.image} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-zinc-600">{c.icon}</div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p
                  className="uppercase text-zinc-500"
                  style={{
                    fontFamily: "var(--font-family-inter)",
                    fontSize: "var(--text-caption)",
                    letterSpacing: "0.18em",
                    fontWeight: 700,
                    lineHeight: 1.2,
                  }}
                >
                  {c.title}
                </p>
                <p
                  className="mt-0.5 truncate text-ink-strong"
                  style={{
                    fontFamily: "var(--font-family-figtree)",
                    fontSize: "var(--text-caption)",
                    fontWeight: 600,
                    lineHeight: 1.25,
                  }}
                >
                  {c.selectedOption?.name}
                </p>
              </div>
              <span
                className="shrink-0 tabular-nums text-primary"
                style={{ fontFamily: "var(--font-family-figtree)", fontSize: "var(--text-caption)", fontWeight: 700 }}
              >
                {formatBRL(c.selectedOption!.price)}
              </span>
            </button>
          ))}
          </div>
        </ScrollArea>
      )}
      <div className="border-t border-edge-subtle bg-surface-0 px-5 py-3.5">
        <div className="flex items-baseline justify-between">
          <span
            className="uppercase text-zinc-500"
            style={{
              fontFamily: "var(--font-family-inter)",
              fontSize: "var(--text-caption)",
              letterSpacing: "0.2em",
              fontWeight: 700,
            }}
          >
            Total parcial
          </span>
          <span
            className="text-ink-strong tabular-nums"
            style={{
              fontFamily: "var(--font-family-figtree)",
              fontSize: "var(--text-lg)",
              fontWeight: 700,
              letterSpacing: "-0.015em",
            }}
          >
            {formatBRL(total)}
          </span>
        </div>
        <p
          className="mt-0.5 text-right tabular-nums text-zinc-500"
          style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)" }}
        >
          10x de {formatBRL(total / 10)} sem juros
        </p>
      </div>
    </div>
  );
}

export function MonteSeuPcPage() {
  const navigate = useNavigate();
  const { addItem, setIsOpen: setCartOpen } = useCart();
  const previewRef = useRef<HTMLDivElement>(null);
  const feedbackTimerRef = useRef<number | null>(null);

  const [selections, setSelections] = useState<Record<string, string[]>>({});
  const [activeCategory, setActiveCategory] = useState<string>("cpu");
  const [expandedCategory, setExpandedCategory] = useState<string>("cpu");
  const [activeView, setActiveView] = useState(0);
  const [actionFeedback, setActionFeedback] = useState("");
  const [view, setView] = useState<View>("welcome");
  const [quizRec, setQuizRec] = useState<PresetTier | null>(null);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [stepSheetOpen, setStepSheetOpen] = useState(false);
  const [summarySheetOpen, setSummarySheetOpen] = useState(false);
  const [stepSearch, setStepSearch] = useState<string>("");
  const [sortMode, setSortMode] = useState<SortMode>("suggested");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [buildName, setBuildName] = useState<string>("Minha build PCYES");
  const [cepInput, setCepInput] = useState<string>("");
  const [freight, setFreight] = useState<Freight | null>(null);

  useEffect(() => {
    setStepSearch("");
  }, [activeCategory]);

  const handlePath = (p: "builder" | "quiz" | "presets") => {
    if (p === "builder") {
      setSelections({});
      setCompletedSteps([]);
      setActiveCategory("cpu");
    }
    setView(p);
  };
  const goToWelcome = () => {
    setQuizRec(null);
    setView("welcome");
  };
  const handleQuizComplete = (rec: PresetTier) => {
    setQuizRec(rec);
    setView("presets");
  };
  const handleApplyPreset = (preset: Preset) => {
    const asArrays: Record<string, string[]> = {};
    Object.entries(preset.selections).forEach(([k, v]) => {
      asArrays[k] = [v];
    });
    setSelections(asArrays);
    setCompletedSteps(Object.keys(asArrays));
    setActiveCategory("cpu");
    setExpandedCategory("cpu");
    setView("builder");
  };

  const handleBuyPreset = (preset: Preset) => {
    let baseId = 900000;
    let added = 0;
    Object.entries(preset.selections).forEach(([catId, optId]) => {
      const cat = categories.find((c) => c.id === catId);
      const opt = cat?.options.find((o) => o.id === optId);
      if (!opt) return;
      addItem({
        cartKey: `mspc-${preset.id}-${catId}-${optId}`,
        id: baseId++,
        name: opt.name,
        price: formatCurrency(opt.price),
        image: opt.image ?? "",
      });
      added++;
    });
    if (added > 0) {
      pushFeedback(`Setup ${preset.name} adicionado (${added} peças)`);
      setCartOpen(true);
    }
  };

  const handleFixStep = (stepId: string) => {
    setActiveCategory(stepId);
    setExpandedCategory(stepId);
    setView("builder");
  };

  const handleCalcFreight = () => {
    const result = calculateFreight(cepInput, priceBreakdown.total);
    setFreight(result);
  };

  const categoriesWithSelected = useMemo(
    () =>
      categories.map((category) => {
        const ids = getSelected(selections, category.id);
        const selectedOptions = ids
          .map((id) => category.options.find((o) => o.id === id))
          .filter((o): o is Option => Boolean(o));
        return {
          ...category,
          selectedOptions,
          selectedOption: selectedOptions[0],
        };
      }),
    [selections],
  );

  const currentCategory = categoriesWithSelected.find((category) => category.id === activeCategory);
  const currentPreviewOption =
    currentCategory?.selectedOption ?? categoriesWithSelected.find((category) => category.id === "case")?.selectedOption;
  const currentGallery =
    currentPreviewOption?.gallery?.length
      ? currentPreviewOption.gallery
      : currentPreviewOption?.image
        ? [currentPreviewOption.image]
        : [];

  const currentCase = categoriesWithSelected.find((category) => category.id === "case")?.selectedOption;
  const ambient = useMemo(() => getAmbient(currentCase?.type), [currentCase?.type]);

  const priceBreakdown = useMemo(() => {
    let total = 0;
    categoriesWithSelected.forEach((cat) => {
      cat.selectedOptions.forEach((opt) => {
        total += opt.price;
      });
    });
    return { base: 0, equipment: total, total };
  }, [categoriesWithSelected]);

  const configurationName = useMemo(() => {
    const caseName = currentCase?.name ?? "PCYES Custom";
    return `${caseName} · Build personalizada`;
  }, [currentCase?.name]);

  const compat = useMemo(() => {
    const get = (id: string) => categoriesWithSelected.find((c) => c.id === id)?.selectedOption;
    return computeCompat(get("cpu"), get("motherboard"), get("ram"), get("gpu"), get("psu"));
  }, [categoriesWithSelected]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(CONFIG_STORAGE_KEY);
      if (!raw) return;

      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== "object") return;

      const normalized: Record<string, string[]> = {};
      Object.entries(parsed as Record<string, unknown>).forEach(([k, v]) => {
        if (Array.isArray(v)) normalized[k] = v.filter((x): x is string => typeof x === "string");
        else if (typeof v === "string") normalized[k] = [v];
      });
      setSelections((prev) => ({ ...prev, ...normalized }));
    } catch {
      // Ignore invalid saved data.
    }
  }, []);

  useEffect(() => {
    setSelections((prev) => {
      const cpuIds = prev.cpu ?? [];
      const currentCpu = cpuIds[0];
      if (!currentCpu) return prev;

      let changed = false;
      const next: Record<string, string[]> = { ...prev };

      categories.forEach((category) => {
        const ids = next[category.id];
        if (!ids || ids.length === 0) return;

        const valid = ids.filter((id) => {
          const opt = category.options.find((o) => o.id === id);
          if (!opt) return false;
          if (opt.req && !opt.req.includes(currentCpu)) return false;
          return true;
        });

        if (valid.length !== ids.length) {
          next[category.id] = valid;
          changed = true;
          // dropped items dont restore — user picks new
          void category;
        }
      });

      return changed ? next : prev;
    });
  }, [selections.cpu]);

  useEffect(() => {
    setActiveView(0);
  }, [activeCategory, currentPreviewOption?.id]);

  useEffect(() => {
    return () => {
      if (feedbackTimerRef.current) {
        window.clearTimeout(feedbackTimerRef.current);
      }
    };
  }, []);

  const pushFeedback = (message: string) => {
    if (feedbackTimerRef.current) {
      window.clearTimeout(feedbackTimerRef.current);
    }

    setActionFeedback(message);
    feedbackTimerRef.current = window.setTimeout(() => {
      setActionFeedback("");
      feedbackTimerRef.current = null;
    }, 2400);
  };

  const getVisibleOptions = (category: Category) =>
    category.options.filter((option) => {
      const currentCpu = getSelected(selections, 'cpu')[0];
      return !option.req || (currentCpu ? option.req.includes(currentCpu) : true);
    });

  const handleSelect = (categoryId: string, optionId: string) => {
    setSelections((prev) => ({ ...prev, [categoryId]: [optionId] }));
    setActiveCategory(categoryId);

    const currentIndex = categories.findIndex((category) => category.id === categoryId);
    const nextCategory = categories[currentIndex + 1];
    if (nextCategory) {
      setExpandedCategory(nextCategory.id);
      setActiveCategory(nextCategory.id);
    }
  };

  const toggleSection = (categoryId: string) => {
    setExpandedCategory((prev) => (prev === categoryId ? "" : categoryId));
    setActiveCategory(categoryId);
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }
    navigate("/produtos");
  };

  const handleSave = () => {
    window.localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(selections));
    try {
      const raw = window.localStorage.getItem(SAVED_BUILDS_KEY);
      const list: Array<{
        id: string;
        name: string;
        selections: Record<string, string[]>;
        total: number;
        savedAt: number;
        items: Array<{ category: string; name: string; price: number; image?: string }>;
      }> = raw ? JSON.parse(raw) : [];

      const items = categoriesWithSelected.flatMap((c) =>
        c.selectedOptions.map((o) => ({
          category: c.title,
          name: o.name,
          price: o.price,
          image: o.image,
        })),
      );

      const entry = {
        id: `build-${Date.now()}`,
        name: buildName || configurationName,
        selections,
        total: priceBreakdown.total,
        savedAt: Date.now(),
        items,
      };

      const filtered = list.filter(
        (b) => b.name !== entry.name || JSON.stringify(b.selections) !== JSON.stringify(entry.selections),
      );
      const next = [entry, ...filtered].slice(0, MAX_SAVED_BUILDS);
      window.localStorage.setItem(SAVED_BUILDS_KEY, JSON.stringify(next));
    } catch {
      // localStorage quota or parse error — ignore
    }
    pushFeedback("Build salva no perfil");
  };

  const handleShare = async () => {
    const shareData = {
      title: configurationName,
      text: `Confira esta configuração PCYES em ${formatCurrency(priceBreakdown.total)}.`,
      url: window.location.href,
    };

    try {
      if (navigator.share) await navigator.share(shareData);
      else if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(window.location.href);
      pushFeedback("Link pronto para compartilhar");
    } catch {
      pushFeedback("Compartilhamento cancelado");
    }
  };

  const handleFullscreen = async () => {
    if (!previewRef.current) return;

    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await previewRef.current.requestFullscreen();
    } catch {
      pushFeedback("Tela cheia indisponível");
    }
  };

  const handleAddToCart = () => {
    let baseId = 900000;
    let added = 0;
    categoriesWithSelected.forEach((c) => {
      c.selectedOptions.forEach((opt) => {
        addItem({
          cartKey: `mspc-${c.id}-${opt.id}`,
          id: baseId++,
          name: opt.name,
          price: formatCurrency(opt.price),
          image: opt.image ?? "",
        });
        added++;
      });
    });
    if (added > 0) {
      pushFeedback(`${added} componente${added > 1 ? "s" : ""} adicionado${added > 1 ? "s" : ""} ao carrinho`);
      setTimeout(() => navigate("/carrinho"), 600);
    }
  };

  return (
    <div
      className="relative min-h-screen text-[#f5f5f5]"
      style={{
        background:
          "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(17, 17, 17, 0.07) 0%, transparent 55%), radial-gradient(ellipse 60% 40% at 50% 100%, rgba(17, 17, 17, 0.04) 0%, transparent 60%), linear-gradient(180deg, #0a0a0c 0%, #080808 40%, #0a0a0c 100%)",
      }}
    >
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 12% 22%, #fff 0.5px, transparent 1px), radial-gradient(circle at 38% 78%, #fff 0.5px, transparent 1px), radial-gradient(circle at 64% 30%, #fff 0.5px, transparent 1px), radial-gradient(circle at 84% 65%, #fff 0.5px, transparent 1px), radial-gradient(circle at 22% 88%, #fff 0.5px, transparent 1px)",
        }}
        aria-hidden="true"
      />
      <TopBar />
      <AnimatePresence mode="wait">
        {view === "welcome" && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <WelcomeScreen onPath={handlePath} />
          </motion.div>
        )}
        {view === "quiz" && (
          <motion.div
            key="quiz"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <QuizFlow onComplete={handleQuizComplete} onBack={goToWelcome} />
          </motion.div>
        )}
        {view === "presets" && (
          <motion.div
            key="presets"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <PresetGallery
              recommended={quizRec}
              onApply={handleApplyPreset}
              onBuy={handleBuyPreset}
              onBack={() => setView(quizRec ? "quiz" : "welcome")}
            />
          </motion.div>
        )}
        {view === "review" && (
          <motion.div
            key="review"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <ReviewScreen
              categoriesWithSelected={categoriesWithSelected}
              buildName={buildName}
              onBuildName={setBuildName}
              total={priceBreakdown.total}
              cep={cepInput}
              onCepChange={setCepInput}
              freight={freight}
              onCalcFreight={handleCalcFreight}
              compat={compat}
              onEdit={() => setView("builder")}
              onFixStep={handleFixStep}
              onSave={handleSave}
              onShare={handleShare}
              onBuy={handleAddToCart}
            />
          </motion.div>
        )}
        {view === "builder" && (
          <motion.div
            key="builder"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {currentCategory && (() => {
              const currentIdx = categories.findIndex((c) => c.id === activeCategory);
              const currentCpuId = getSelected(selections, 'cpu')[0];
              const allCompat = currentCategory.options.filter(
                (o) => !o.req || (currentCpuId ? o.req.includes(currentCpuId) : true),
              );
              const q = stepSearch.trim().toLowerCase();
              const visibleOptions = q
                ? allCompat.filter(
                    (o) =>
                      o.name.toLowerCase().includes(q) ||
                      (o.highlights ?? []).some((h) => h.toLowerCase().includes(q)) ||
                      (o.summary ?? "").toLowerCase().includes(q),
                  )
                : allCompat;
              const isFirst = currentIdx === 0;
              const isLast = currentIdx === categories.length - 1;
              const stepSelectedIds = getSelected(selections, currentCategory.id);
              const stepSelectedOptions = stepSelectedIds
                .map((id) => currentCategory.options.find((o) => o.id === id))
                .filter((o): o is Option => Boolean(o));
              const stepSelected = stepSelectedOptions[0];
              const stepMax = getMaxSlots(currentCategory);
              const stepMin = getMinSlots(currentCategory);
              const stepValid = stepSelectedOptions.length >= stepMin;
              const stepAtMax = stepSelectedOptions.length >= stepMax;
              const stepMultiSelect = stepMax > 1;

              const goNext = () => {
                if (isLast) {
                  setView("review");
                  return;
                }
                const next = categories[currentIdx + 1];
                if (next) {
                  setActiveCategory(next.id);
                  setExpandedCategory(next.id);
                  setCompletedSteps((prev) =>
                    prev.includes(currentCategory.id) ? prev : [...prev, currentCategory.id],
                  );
                }
              };
              const goPrev = () => {
                const prev = categories[currentIdx - 1];
                if (prev) {
                  setActiveCategory(prev.id);
                  setExpandedCategory(prev.id);
                }
              };

              return (
                <>
                  <HeroBuilderBanner
                    totalSelected={completedSteps.length}
                    totalCount={categories.length}
                    onBack={goToWelcome}
                  />
                  <div className="hidden lg:block">
                    <HorizontalStepper
                      categories={categoriesWithSelected.map((c) => ({
                        id: c.id,
                        title: c.title,
                        icon: c.icon,
                      }))}
                      currentId={activeCategory}
                      completedIds={completedSteps}
                      onJump={(id) => {
                        setActiveCategory(id);
                        setExpandedCategory(id);
                      }}
                    />
                  </div>
                  <MobileStepNav
                    categories={categoriesWithSelected.map((c) => ({
                      id: c.id,
                      title: c.title,
                      icon: c.icon,
                      selectedOption: c.selectedOption,
                    }))}
                    currentId={activeCategory}
                    completedIds={completedSteps}
                    open={stepSheetOpen}
                    onOpenChange={setStepSheetOpen}
                    onJump={(id) => {
                      setActiveCategory(id);
                      setExpandedCategory(id);
                    }}
                  />

                  <main className="mx-auto grid max-w-[1520px] grid-cols-1 gap-6 px-5 py-6 pb-28 md:px-8 lg:grid-cols-[1fr_380px] lg:pb-6">
                    <section className="min-w-0">
                      <div className="mb-4 hidden flex-col gap-3 lg:flex lg:flex-row lg:items-end lg:justify-between">
                        <div>
                          <p
                            className="mb-1 uppercase text-zinc-500"
                            style={{
                              fontFamily: "var(--font-family-inter)",
                              fontSize: "var(--text-caption)",
                              letterSpacing: "0.22em",
                              fontWeight: 700,
                            }}
                          >
                            Etapa {currentIdx + 1} / {categories.length}
                          </p>
                          <h2
                            className="text-ink-strong"
                            style={{
                              fontFamily: "var(--font-family-figtree)",
                              fontSize: "clamp(20px, 5vw, 26px)",
                              fontWeight: 700,
                              letterSpacing: "-0.015em",
                              lineHeight: 1.1,
                            }}
                          >
                            Escolha {currentCategory.title.toLowerCase()}
                          </h2>
                          <p
                            className="mt-1 text-zinc-400"
                            style={{
                              fontFamily: "var(--font-family-inter)",
                              fontSize: "var(--text-caption)",
                            }}
                          >
                            {visibleOptions.length} de {allCompat.length} compatíveis
                            {q ? ` · busca "${q}"` : null}
                          </p>
                        </div>
                      </div>
                      <p
                        className="mb-3 text-zinc-400 lg:hidden"
                        style={{
                          fontFamily: "var(--font-family-inter)",
                          fontSize: "var(--text-caption)",
                        }}
                      >
                        {visibleOptions.length} de {allCompat.length} compatíveis
                        {q ? ` · busca "${q}"` : null}
                      </p>

                      <div className="mb-4 grid grid-cols-[1fr_auto] gap-3 sm:grid-cols-[1fr_200px_auto]">
                        <div className="relative col-span-2 sm:col-span-1">
                          <label
                            className="mb-1.5 block uppercase text-zinc-400"
                            htmlFor="step-search"
                            style={{
                              fontFamily: "var(--font-family-inter)",
                              fontSize: "var(--text-caption)",
                              letterSpacing: "0.18em",
                              fontWeight: 700,
                            }}
                          >
                            Buscar
                          </label>
                          <input
                            id="step-search"
                            type="text"
                            value={stepSearch}
                            onChange={(e) => setStepSearch(e.target.value)}
                            placeholder="Busque por nome ou código"
                            aria-label={`Buscar em ${currentCategory.title}`}
                            className="msp-field h-11 w-full rounded-card-sm border border-edge bg-surface-0 px-4 py-3 text-ink-strong placeholder:text-zinc-500 outline-none transition-all focus:border-primary/45 focus:bg-surface-1 sm:h-auto"
                            style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)" }}
                          />
                          {stepSearch && (
                            <button
                              type="button"
                              onClick={() => setStepSearch("")}
                              aria-label="Limpar busca"
                              className="absolute right-2 top-[28px] flex h-11 w-11 cursor-pointer items-center justify-center rounded-full text-zinc-500 transition-colors hover:bg-white/10 hover:text-ink-strong sm:right-3 sm:top-[34px] sm:h-6 sm:w-6 md:h-6 md:w-6"
                            >
                              <X size={12} />
                            </button>
                          )}
                        </div>
                        <div className="relative">
                          <label
                            className="mb-1.5 block uppercase text-zinc-400"
                            htmlFor="step-sort"
                            style={{
                              fontFamily: "var(--font-family-inter)",
                              fontSize: "var(--text-caption)",
                              letterSpacing: "0.18em",
                              fontWeight: 700,
                            }}
                          >
                            Ordenar por
                          </label>
                          <Select value={sortMode} onValueChange={(v) => setSortMode(v as SortMode)}>
                            <SelectTrigger
                              id="step-sort"
                              className="w-full !h-auto rounded-card-sm border border-edge bg-surface-0 px-4 py-3 text-ink-strong transition-all hover:bg-surface-1 focus:border-primary/45 focus:bg-surface-1 data-[state=open]:border-primary/45 data-[state=open]:bg-surface-1 [&_svg]:text-zinc-500"
                              style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)" }}
                            >
                              <SelectValue placeholder="Selecionar ordenação" />
                            </SelectTrigger>
                            <SelectContent
                              className="rounded-card-sm border border-edge bg-surface-0 text-ink-strong shadow-[var(--shadow-pop)] shadow-black/60"
                              style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)" }}
                            >
                              <SelectItem value="suggested" className="rounded-[var(--radius-card)] focus:bg-foreground/[0.08] focus:text-ink-strong data-[state=checked]:text-primary">
                                Sugerida primeiro
                              </SelectItem>
                              <SelectItem value="price-asc" className="rounded-[var(--radius-card)] focus:bg-foreground/[0.08] focus:text-ink-strong data-[state=checked]:text-primary">
                                Menor preço
                              </SelectItem>
                              <SelectItem value="price-desc" className="rounded-[var(--radius-card)] focus:bg-foreground/[0.08] focus:text-ink-strong data-[state=checked]:text-primary">
                                Maior preço
                              </SelectItem>
                              <SelectItem value="name" className="rounded-[var(--radius-card)] focus:bg-foreground/[0.08] focus:text-ink-strong data-[state=checked]:text-primary">
                                Nome A-Z
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex flex-col">
                          <span
                            className="mb-1.5 block uppercase text-zinc-400"
                            style={{
                              fontFamily: "var(--font-family-inter)",
                              fontSize: "var(--text-caption)",
                              letterSpacing: "0.18em",
                              fontWeight: 700,
                            }}
                          >
                            Exibição
                          </span>
                          <div
                            role="group"
                            aria-label="Modo de exibição"
                            className="flex h-11 items-center gap-0.5 rounded-card-sm border border-edge bg-surface-0 p-1 sm:h-[46px]"
                          >
                            <button
                              type="button"
                              onClick={() => setViewMode("grid")}
                              aria-pressed={viewMode === "grid"}
                              aria-label="Modo grade"
                              className={cn(
                                "flex h-full w-11 cursor-pointer items-center justify-center rounded-[var(--radius-card)] transition-all sm:w-10",
                                viewMode === "grid"
                                  ? "bg-primary text-ink-strong"
                                  : "text-zinc-500 hover:bg-white/[0.05] hover:text-zinc-200",
                              )}
                              style={
                                viewMode === "grid"
                                  ? { boxShadow: "0 4px 12px -4px rgba(200, 120, 0,0.55)" }
                                  : undefined
                              }
                            >
                              <LayoutGrid size={15} />
                            </button>
                            <button
                              type="button"
                              onClick={() => setViewMode("list")}
                              aria-pressed={viewMode === "list"}
                              aria-label="Modo lista"
                              className={cn(
                                "flex h-full w-11 cursor-pointer items-center justify-center rounded-[var(--radius-card)] transition-all sm:w-10",
                                viewMode === "list"
                                  ? "bg-primary text-ink-strong"
                                  : "text-zinc-500 hover:bg-white/[0.05] hover:text-zinc-200",
                              )}
                              style={
                                viewMode === "list"
                                  ? { boxShadow: "0 4px 12px -4px rgba(200, 120, 0,0.55)" }
                                  : undefined
                              }
                            >
                              <Rows3 size={15} />
                            </button>
                          </div>
                        </div>
                      </div>

                      <AnimatePresence mode="wait">
                        <motion.div
                          key={`${currentCategory.id}-${viewMode}`}
                          initial={{ opacity: 0, x: 16 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -16 }}
                          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                          className={cn(
                            "grid gap-3",
                            viewMode === "grid"
                              ? "grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                              : "grid-cols-1 md:grid-cols-2",
                          )}
                        >
                          {visibleOptions.length === 0 ? (
                            <div className="rounded-[var(--radius-card-sm)] border border-edge-subtle bg-surface-0 px-6 py-12 text-center col-span-full">
                              <p
                                className="text-ink-strong"
                                style={{
                                  fontFamily: "var(--font-family-figtree)",
                                  fontSize: "var(--text-base)",
                                  fontWeight: 600,
                                }}
                              >
                                Nada encontrado para "{stepSearch}"
                              </p>
                              <p
                                className="mt-1 text-zinc-500"
                                style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)" }}
                              >
                                Tente outro termo ou limpe a busca
                              </p>
                              <button
                                type="button"
                                onClick={() => setStepSearch("")}
                                className="mt-3 rounded-full border border-edge px-4 py-1.5 text-zinc-300 transition-colors hover:bg-white/[0.05] hover:text-ink-strong cursor-pointer"
                                style={{
                                  fontFamily: "var(--font-family-inter)",
                                  fontSize: "var(--text-caption)",
                                  fontWeight: 600,
                                }}
                              >
                                Limpar busca
                              </button>
                            </div>
                          ) : (
                            visibleOptions
                              .slice()
                              .sort((a, b) => {
                                if (sortMode === "suggested")
                                  return (b.standard ? 1 : 0) - (a.standard ? 1 : 0);
                                if (sortMode === "price-asc") return a.price - b.price;
                                if (sortMode === "price-desc") return b.price - a.price;
                                if (sortMode === "name") return a.name.localeCompare(b.name);
                                return 0;
                              })
                              .map((option) => {
                                const isSelected = stepSelectedIds.includes(option.id);
                                const disabled = stepMultiSelect && !isSelected && stepAtMax;
                                return (
                                  <ProductTile
                                    key={option.id}
                                    mode={viewMode}
                                    option={option}
                                    category={currentCategory}
                                    selected={isSelected}
                                    multiSelect={stepMultiSelect}
                                    disabled={disabled}
                                    onSelect={() => {
                                      if (disabled) return;
                                      setSelections((prev) => {
                                        const cur = prev[currentCategory.id] ?? [];
                                        if (cur.includes(option.id)) {
                                          return {
                                            ...prev,
                                            [currentCategory.id]: cur.filter((id) => id !== option.id),
                                          };
                                        }
                                        if (stepMax === 1) {
                                          return { ...prev, [currentCategory.id]: [option.id] };
                                        }
                                        if (cur.length >= stepMax) return prev;
                                        return { ...prev, [currentCategory.id]: [...cur, option.id] };
                                      });
                                      setCompletedSteps((prev) =>
                                        prev.includes(currentCategory.id)
                                          ? prev
                                          : [...prev, currentCategory.id],
                                      );
                                    }}
                                  />
                                );
                              })
                          )}
                        </motion.div>
                      </AnimatePresence>
                    </section>

                    <aside className="hidden space-y-4 lg:block lg:sticky lg:top-[180px] lg:self-start">
                      <SelectedItemCard
                        category={currentCategory}
                        options={stepSelectedOptions}
                        maxSlots={stepMax}
                        onRemove={(optId) => {
                          setSelections((prev) => ({
                            ...prev,
                            [currentCategory.id]: (prev[currentCategory.id] ?? []).filter(
                              (id) => id !== optId,
                            ),
                          }));
                        }}
                        onPrev={goPrev}
                        onNext={goNext}
                        isFirst={isFirst}
                        isLast={isLast}
                        nextDisabled={!stepValid}
                      />
                      <StepMessages messages={computeStepMessages(currentCategory, selections)} />
                      <ConfiguracaoSelecionadaCard
                        categories={categoriesWithSelected}
                        total={priceBreakdown.total}
                        onEdit={(id) => {
                          setActiveCategory(id);
                          setExpandedCategory(id);
                        }}
                      />
                    </aside>
                  </main>

                  {/* Mobile fixed action bar */}
                  <div
                    className="fixed bottom-0 left-0 right-0 z-40 flex items-center gap-3 border-t border-edge px-4 py-3 lg:hidden"
                    style={{
                      background: "rgba(14,14,14,0.96)",
                      backdropFilter: "blur(20px)",
                      WebkitBackdropFilter: "blur(20px)",
                      paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))",
                    }}
                  >
                    <button
                      type="button"
                      onClick={goPrev}
                      disabled={isFirst}
                      aria-label="Voltar etapa"
                      className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-card-sm border border-edge bg-white/[0.02] text-zinc-300 transition-all hover:border-edge-strong hover:bg-white/[0.06] hover:text-ink-strong disabled:cursor-not-allowed disabled:opacity-25"
                    >
                      <ChevronLeft size={18} />
                    </button>

                    <button
                      type="button"
                      onClick={() => setSummarySheetOpen(true)}
                      aria-label="Ver resumo da build"
                      className="flex min-w-0 flex-1 cursor-pointer flex-col items-start rounded-[var(--radius-card-sm)] px-1 py-0.5 text-left transition-colors hover:bg-white/[0.03]"
                    >
                      <span className="flex items-center gap-1">
                        <span
                          className="uppercase text-zinc-500"
                          style={{
                            fontFamily: "var(--font-family-inter)",
                            fontSize: "var(--text-caption)",
                            letterSpacing: "0.18em",
                            fontWeight: 700,
                          }}
                        >
                          Total parcial
                        </span>
                        <ChevronUp size={11} className="text-zinc-500" />
                        <span
                          className="text-zinc-500"
                          style={{
                            fontFamily: "var(--font-family-inter)",
                            fontSize: "var(--text-caption)",
                            fontWeight: 600,
                          }}
                        >
                          resumo
                        </span>
                      </span>
                      <span
                        className="text-ink-strong tabular-nums"
                        style={{
                          fontFamily: "var(--font-family-figtree)",
                          fontSize: "var(--text-lg)",
                          fontWeight: 700,
                          letterSpacing: "-0.015em",
                          lineHeight: 1.15,
                        }}
                      >
                        {formatBRL(priceBreakdown.total)}
                      </span>
                      <span
                        className="text-zinc-500 tabular-nums"
                        style={{
                          fontFamily: "var(--font-family-inter)",
                          fontSize: "var(--text-caption)",
                          fontWeight: 500,
                        }}
                      >
                        {completedSteps.length} de {categories.length} escolhidos
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={goNext}
                      disabled={!stepValid}
                      className="flex h-11 shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-card-sm bg-primary px-5 text-ink-strong transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:brightness-100"
                      style={{
                        fontFamily: "var(--font-family-inter)",
                        fontSize: "var(--text-sm)",
                        fontWeight: 700,
                        letterSpacing: "0.01em",
                        boxShadow: !stepValid ? "none" : "0 8px 24px -8px rgba(200, 120, 0,0.5)",
                      }}
                    >
                      {isLast ? "Revisar" : "Avançar"} <ArrowRight size={14} />
                    </button>
                  </div>

                  {/* Mobile "Ver resumo" sheet */}
                  <Sheet open={summarySheetOpen} onOpenChange={setSummarySheetOpen}>
                    <SheetContent
                      side="bottom"
                      className="max-h-[85vh] gap-0 overflow-y-auto rounded-t-2xl border-edge-subtle bg-surface-0 p-0 lg:hidden"
                    >
                      <SheetHeader className="border-b border-edge-subtle p-5">
                        <SheetTitle
                          className="text-ink-strong"
                          style={{
                            fontFamily: "var(--font-family-inter)",
                            fontSize: "var(--text-base)",
                            fontWeight: 700,
                          }}
                        >
                          Resumo da build
                        </SheetTitle>
                      </SheetHeader>
                      <div className="space-y-4 p-5">
                        <StepMessages messages={computeStepMessages(currentCategory, selections)} />
                        <ConfiguracaoSelecionadaCard
                          categories={categoriesWithSelected}
                          total={priceBreakdown.total}
                          onEdit={(id) => {
                            setActiveCategory(id);
                            setExpandedCategory(id);
                            setSummarySheetOpen(false);
                          }}
                        />
                      </div>
                    </SheetContent>
                  </Sheet>
                </>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
