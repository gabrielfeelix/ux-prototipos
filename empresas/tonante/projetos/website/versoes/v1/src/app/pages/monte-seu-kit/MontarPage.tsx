/* "Quero montar meu kit" — o builder.
 *
 * O combo builder já existia como seção da home (components/MonteSeuKit.tsx):
 * receitas clicáveis que resolvem produtos reais do catálogo e deixam o cliente
 * marcar e desmarcar add-ons. Ele nunca teve rota própria, então só encontrava
 * quem descia a home inteira.
 *
 * Aqui ele ganha página. O componente não foi duplicado nem reescrito: quem
 * chega pelo caminho do meio vê a mesma ferramenta, e um conserto nela conserta
 * os dois lugares. */

import { useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";
import { MonteSeuKit } from "../../components/MonteSeuKit";

export function MontarPage() {
  const navigate = useNavigate();
  return (
    <main className="bg-white">
      <div className="mx-auto max-w-[1280px] px-4 pt-10 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => navigate("/monte-seu-kit")}
          className="inline-flex items-center gap-2 text-[0.9375rem] text-foreground/60 transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </button>
      </div>
      <MonteSeuKit />
    </main>
  );
}
