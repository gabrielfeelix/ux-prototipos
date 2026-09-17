"use client";

import { useEffect, useState } from "react";
import { useCart } from "./CartContext";

/* Botão flutuante de WhatsApp — atendimento humano no canto inferior direito.
   O número ainda não existe: NUMERO é placeholder e precisa ser trocado pelo
   da central quando a linha estiver no ar. Aparece depois de um respiro pra
   não competir com a primeira dobra. */

const NUMERO = "5544999999999"; // TODO: número real do atendimento Tonante
const MENSAGEM = "Olá! Vim pelo site da Tonante e preciso de ajuda para escolher um instrumento.";

export function WhatsAppFab() {
  const [visivel, setVisivel] = useState(false);
  /* Com o carrinho aberto o botão desce pra baixo do overlay: ele é o único
     elemento fixo acima do drawer e do modal de brinde, e ficava boiando por
     cima de quem estava fechando a compra. */
  const { isOpen: carrinhoAberto } = useCart();

  useEffect(() => {
    const t = setTimeout(() => setVisivel(true), 1200);
    return () => clearTimeout(t);
  }, []);

  return (
    <a
      href={`https://wa.me/${NUMERO}?text=${encodeURIComponent(MENSAGEM)}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar com o atendimento no WhatsApp"
      className={`group/wa fixed bottom-5 right-5 ${carrinhoAberto ? "z-[40]" : "z-[90]"} flex h-14 w-14 items-center justify-center rounded-full transition-[transform,box-shadow,opacity,margin]  duration-[420ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-105 active:scale-95 md:bottom-7 md:right-7`}
      style={{
        /* a PDP levanta o botão quando a barra de compra do celular sobe, pela
           variável --fab-lift: os dois moram em cantos diferentes da árvore. */
        marginBottom: "var(--fab-lift, 0px)",
        background: "#25D366",
        boxShadow: "0 10px 30px -10px rgba(37,211,102,0.65), 0 2px 8px rgba(17,17,17,0.18)",
        opacity: visivel ? 1 : 0,
        transform: visivel ? "translateY(0)" : "translateY(12px)",
        pointerEvents: visivel ? "auto" : "none",
      }}
    >
      {/* glifo oficial do WhatsApp (lucide não tem marca) */}
      <svg width="28" height="28" viewBox="0 0 24 24" fill="#fff" aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.247-.694.247-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884a9.82 9.82 0 016.988 2.896 9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.885-9.885 9.885M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.359.101 11.945c0 2.096.549 4.142 1.595 5.945L0 24l6.305-1.654a11.94 11.94 0 005.71 1.454h.006c6.585 0 11.946-5.359 11.949-11.945A11.86 11.86 0 0020.52 3.45" />
      </svg>

      {/* rótulo aparece no hover, como no header */}
      <span
        className="pointer-events-none absolute right-full mr-3 hidden translate-x-2 whitespace-nowrap rounded-pill px-3 py-2 opacity-0 transition-[opacity,translate] duration-[420ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/wa:translate-x-0 group-hover/wa:opacity-100 md:block"
        style={{
          background: "var(--ink-strong)", color: "#fff",
          fontFamily: "var(--font-family-inter)", fontSize: "13.5px", fontWeight: 600,
        }}
      >
        Falar com um músico
      </span>
    </a>
  );
}
