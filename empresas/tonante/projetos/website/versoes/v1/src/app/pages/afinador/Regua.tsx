/* Regua — o medidor do modo "Ouvir".
 *
 * Não é o ponteiro de relógio dos afinadores de pedal: é uma régua de luthier,
 * com risquinho a cada 5 cents e risco cheio a cada 25. A escolha é de assunto,
 * não de estilo — quem afina está medindo distância até um alvo, e régua é o
 * instrumento que mede distância. Também lê melhor no celular do que um arco.
 *
 * ±5 cents é a faixa verde. É a tolerância honesta: abaixo disso o ouvido
 * humano não separa as duas notas e o microfone do celular já não separa. */

const LIMITE = 50; // cents mostrados pra cada lado
const TOLERANCIA = 5;

type Props = {
  /** null = nada chegando no microfone */
  cents: number | null;
  nota: string | null;
  latino: string | null;
  ordinal: string | null;
  hz: number | null;
  estado: "desligado" | "pedindo" | "ouvindo" | "negado";
};

export function Regua({ cents, nota, latino, ordinal, hz, estado }: Props) {
  const preso = cents === null ? 0 : Math.max(-LIMITE, Math.min(LIMITE, cents));
  const afinada = cents !== null && Math.abs(cents) <= TOLERANCIA;
  const temSinal = cents !== null && nota !== null;

  const recado =
    estado === "pedindo" ? "Liberando o microfone…"
    : estado === "negado" ? "O microfone ficou bloqueado. Libere nas permissões do navegador e tente de novo."
    : !temSinal ? "Toque uma corda perto do microfone."
    : afinada ? "Afinada."
    : cents! < 0 ? "Está baixa. Aperte a tarraxa devagar."
    : "Está alta. Solte a tarraxa devagar.";

  const cor = afinada ? "var(--buy-green)" : temSinal ? "#F0B24A" : "rgba(242,234,217,0.34)";

  return (
    <div
      className="rounded-[14px] px-5 py-5"
      style={{
        background: "rgba(255,247,232,0.035)",
        border: `1px solid ${afinada ? "rgba(27,184,99,0.42)" : "rgba(255,238,210,0.12)"}`,
        transition: "border-color .3s ease",
      }}
    >
      <div className="flex items-end justify-between gap-4">
        <div className="flex items-baseline gap-3">
          <span
            style={{
              fontFamily: "var(--font-family-figtree)",
              fontSize: 52,
              lineHeight: 0.9,
              fontWeight: 500,
              color: temSinal ? "#F2EAD9" : "rgba(242,234,217,0.3)",
              transition: "color .2s linear",
            }}
          >
            {nota ?? "—"}
          </span>
          {temSinal && (
            <span style={{ fontFamily: "var(--font-family-inter)", fontSize: 13, color: "rgba(242,234,217,0.55)" }}>
              {ordinal} · {latino}
            </span>
          )}
        </div>
        <div className="text-right">
          <div
            style={{
              fontFamily: "var(--font-family-inter)",
              fontSize: 22,
              fontWeight: 700,
              fontVariantNumeric: "tabular-nums",
              color: cor,
              transition: "color .2s linear",
            }}
          >
            {temSinal ? `${cents! > 0 ? "+" : ""}${cents!.toFixed(0)}` : "––"}
            <span style={{ fontSize: 12, fontWeight: 600, opacity: 0.7 }}> cents</span>
          </div>
          {hz !== null && (
            <div style={{ fontFamily: "var(--font-family-inter)", fontSize: 11.5, color: "rgba(242,234,217,0.36)", fontVariantNumeric: "tabular-nums" }}>
              {hz.toFixed(1)} Hz
            </div>
          )}
        </div>
      </div>

      {/* a régua */}
      <div className="relative mt-5 h-[52px]">
        {/* faixa de tolerância */}
        <div
          className="absolute top-0 h-[34px] rounded-[3px]"
          style={{
            left: `${50 - (TOLERANCIA / LIMITE) * 50}%`,
            width: `${(TOLERANCIA / LIMITE) * 100}%`,
            background: afinada ? "rgba(27,184,99,0.22)" : "rgba(255,238,210,0.05)",
            transition: "background-color .3s ease",
          }}
        />
        {Array.from({ length: 21 }, (_, i) => {
          const c = -LIMITE + i * 5;
          const cheio = c % 25 === 0;
          return (
            <div
              key={c}
              className="absolute top-0"
              style={{
                left: `${((c + LIMITE) / (LIMITE * 2)) * 100}%`,
                width: 1,
                height: cheio ? 34 : 17,
                background: cheio ? "rgba(242,234,217,0.5)" : "rgba(242,234,217,0.2)",
                transform: "translateX(-0.5px)",
              }}
            />
          );
        })}

        {/* agulha */}
        <div
          className="absolute top-[-6px]"
          style={{
            left: `${((preso + LIMITE) / (LIMITE * 2)) * 100}%`,
            transform: "translateX(-50%)",
            opacity: temSinal ? 1 : 0.25,
            /* linear e curto: mola faz a agulha passar do alvo e o visitante
               persegue o overshoot em vez da nota */
            transition: "left .09s linear, opacity .2s linear",
          }}
        >
          <div style={{ width: 2, height: 46, background: cor, borderRadius: 1, boxShadow: `0 0 12px ${cor}` }} />
        </div>

        <div className="absolute bottom-0 flex w-full justify-between" style={{ fontFamily: "var(--font-family-inter)", fontSize: 10.5, color: "rgba(242,234,217,0.3)" }}>
          <span>−50</span>
          <span>0</span>
          <span>+50</span>
        </div>
      </div>

      <p
        className="mt-4"
        style={{
          fontFamily: "var(--font-family-inter)",
          fontSize: 13.5,
          lineHeight: 1.5,
          color: afinada ? "var(--buy-green)" : "rgba(242,234,217,0.62)",
          transition: "color .2s linear",
        }}
      >
        {recado}
      </p>
    </div>
  );
}
