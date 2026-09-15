import { useEffect, useRef, useState, useCallback } from "react";
import { Link } from "react-router";
import { Instagram, Volume2, VolumeX, ShoppingBag } from "lucide-react";
import { SectionHeader } from "./section/SectionHeader";
import { CarouselNavButton } from "./section/CarouselNavButton";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { MUSICIANS, type Musician } from "./musiciansData";
import { allProducts } from "./productsData";
import { getPrimaryProductImage } from "./productPresentation";
import { useCart } from "./CartContext";
import { getProductUrl } from "../lib/slug";
import { INSTRUMENT_FRAMING, FRAMING_PADRAO } from "../v2/instrumentFraming";
import { isFotoAmbientada } from "./photoBackdrop";

// MusicosTonante — "Quem toca, conta" (V3 §4). A seção é o feed de Instagram
// da Tonante: cada card é um post (vídeo do músico), com o selo do IG no alto
// e o instrumento marcado como produto na base. O hover toca o vídeo, mostra
// o botão de compra e libera o controle de som; o card em si não é clicável.

/* Só entra quem tem vídeo nosso em public/musicos/. Os demais do
   musiciansData ainda são retrato de banco de imagem com vídeo de amostra do
   Google — mockup de layout, não gente que toca Tonante. Ficam no arquivo de
   dados à espera do material; assim que ganharem um `video: "/musicos/…"`
   aparecem aqui sozinhos. */
const COM_VIDEO = MUSICIANS.filter((m) => m.video?.startsWith("/musicos/"));

/* A ordem do trilho é escolha do Gabriel, não a ordem do arquivo de dados:
   o primeiro quadro da seção abre com o Paulo André e fecha no Alfredo José.
   Quem não estiver listado aqui entra no fim, na ordem em que aparece nos
   dados — assim um músico novo aparece sem precisar mexer nesta lista. */
const ORDEM = ["paulo-andre", "rogerio-alves", "andre-batista", "thiago-nunes", "alfredo"];
const ELENCO = [...COM_VIDEO].sort((a, b) => {
  const ia = ORDEM.indexOf(a.id);
  const ib = ORDEM.indexOf(b.id);
  return (ia < 0 ? ORDEM.length : ia) - (ib < 0 ? ORDEM.length : ib);
});

/* Três voltas do elenco alimentam o loop infinito (ver `normalizar`). */
const VOLTAS = [...ELENCO, ...ELENCO, ...ELENCO];

// ⚠️ PLACEHOLDER: perfil oficial ainda não confirmado pela Oderço.
const PERFIL_HANDLE = "@tonanteinstrumentos";
const PERFIL_URL = "https://instagram.com/tonanteinstrumentos";

/* MusicianCard — o post do feed. O vídeo é o post, o músico é o autor e o
   instrumento é o produto marcado nele.

   O card inteiro NÃO é clicável de propósito: cursor normal, nada de camada
   invisível por cima. Assim cada alvo tem hover próprio — a miniatura mostra o
   nome e leva pra PDP, o botão compra e abre o carrinho, o selo do IG vai pro
   perfil. O modal com a história do músico saiu daqui (vive em
   MusicianStoryModal.tsx, à espera de um gatilho próprio). */
function MusicianCard({ m, autoPlay }: { m: Musician; autoPlay: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hover, setHover] = useState(false);
  const [comSom, setComSom] = useState(false);
  const [ctaHover, setCtaHover] = useState(false);
  const { addItem, setIsOpen } = useCart();
  const produto = allProducts.find((p) => p.id === m.productId);

  /* Em ponteiro fino o vídeo só toca com o mouse em cima: cinco reels rodando
     juntos comem CPU e brigam pela atenção. Onde não há hover (toque) o
     autoplay da viewport continua valendo — ver `autoPlay` na seção. */
  const tocando = hover || autoPlay;
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (!tocando) {
      v.pause();
      setComSom(false); // sai o mouse, volta o mudo
      return;
    }
    /* O trilho carrega três voltas do elenco, então há ~15 <video> na página.
       Com `preload` ligado eles disputam as 6 conexões que o browser abre por
       origem e o vídeo sob o mouse trava no poster esperando a sua vez — por
       isso o elemento é `preload="none"` e a carga só começa aqui. Como o
       primeiro play() cai num elemento sem nenhum dado, ele pode não pegar:
       repetimos quando o vídeo avisa que já tem frame. */
    const tentar = () => {
      const p = v.play();
      if (p) p.catch(() => {}); // autoplay bloqueado: fica no frame do poster
    };
    tentar();
    v.addEventListener("loadeddata", tentar);
    v.addEventListener("canplay", tentar);
    return () => {
      v.removeEventListener("loadeddata", tentar);
      v.removeEventListener("canplay", tentar);
    };
  }, [tocando]);

  // o som é sempre uma escolha do visitante; autoplay com áudio o browser barra
  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = !comSom;
  }, [comSom]);

  const comprar = () => {
    if (!produto) return;
    addItem({ id: produto.id, name: produto.name, price: produto.price, image: getPrimaryProductImage(produto) });
    setIsOpen(true);
  };

  const fotoProduto = produto ? getPrimaryProductImage(produto) : "";
  /* Recorte de estúdio aparece inteiro, com o branco sumindo no branco da
     miniatura; foto ambientada preenche o quadro (ver photoBackdrop.ts). */
  const fotoDeCatalogo = !isFotoAmbientada(fotoProduto);
  /* O dy da tabela serve pro card grande, que encosta o instrumento no rodapé;
     aqui a miniatura é quadrada e o instrumento fica centrado, então só o zoom
     interessa. Teto de 2.6 pra foto de margem muito larga não estourar. */
  const zoomThumb = Math.min(
    (produto && INSTRUMENT_FRAMING[produto.id]?.[0]) ?? FRAMING_PADRAO[0],
    2.6,
  );

  const igUrl = m.instagram ? `https://instagram.com/${m.instagram.replace("@", "")}` : undefined;
  const igIcon = <Instagram size={22} strokeWidth={1.8} color="#ffffff" style={{ filter: "drop-shadow(0 1px 6px rgba(0,0,0,0.55))" }} />;

  return (
    <div
      className="group/post flex-shrink-0"
      /* 4 cards inteiros + um pedaço do 5º sempre cabem no trilho; 434px (a
         medida da referência) é o teto, atingido só em telas muito largas.
         128 = 3 vãos internos + o vão do 5º + o pedaço que fica aparecendo. */
      style={{ width: "clamp(260px, calc((100% - 128px) / 4), 434px)" }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div
        className="relative overflow-hidden"
        style={{ aspectRatio: "434 / 543", borderRadius: 16, background: "var(--surface-2)" }}
      >
        {m.video ? (
          <video
            ref={videoRef}
            src={m.video}
            poster={m.photo}
            muted
            loop
            playsInline
            preload="none"
            className="absolute inset-0 h-full w-full object-cover transition-[scale] duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/post:scale-[1.03]"
          />
        ) : (
          <ImageWithFallback
            src={m.photo}
            alt={`${m.name} — ${m.role}`}
            className="absolute inset-0 h-full w-full object-cover transition-[scale] duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/post:scale-[1.03]"
          />
        )}

        {/* véus: o de cima sustenta o crédito e os ícones, o de baixo sustenta
            a miniatura e o botão. Sem eles nada se lê sobre foto clara. */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-[2] h-[32%]"
          style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.60) 0%, rgba(0,0,0,0.18) 55%, transparent 100%)" }}
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-[40%]"
          style={{ background: "linear-gradient(to top, rgba(0,0,0,0.70) 0%, rgba(0,0,0,0.22) 50%, transparent 100%)" }}
        />

        {/* crédito do músico no alto, que é onde um post do Instagram assina o
            autor. Ficava na base e o balão da miniatura caía em cima dele. */}
        <div className="pointer-events-none absolute inset-x-4 top-4 z-[3] pr-20">
          <p style={{ fontFamily: "var(--font-family-figtree)", fontWeight: 700, fontSize: 17, color: "#fff", margin: 0, lineHeight: 1.2, textShadow: "0 1px 8px rgba(0,0,0,0.45)" }}>
            {m.name}
          </p>
          {m.city && (
            <p style={{ fontFamily: "var(--font-family-inter)", fontSize: 12.5, color: "rgba(255,255,255,0.82)", margin: "2px 0 0", textShadow: "0 1px 8px rgba(0,0,0,0.45)" }}>
              {m.city}
            </p>
          )}
        </div>

        {/* som — só faz sentido com o vídeo rodando, então aparece no hover */}
        {m.video && (
          <button
            type="button"
            onClick={() => setComSom((s) => !s)}
            aria-label={comSom ? "Desligar o som" : "Ligar o som"}
            aria-pressed={comSom}
            className="absolute right-[52px] top-[7px] z-[4] flex h-9 w-9 cursor-pointer items-center justify-center rounded-full opacity-0 transition-opacity duration-200 group-hover/post:opacity-100"
            style={{ background: "rgba(17,17,17,0.45)", backdropFilter: "blur(6px)", border: "none", color: "#fff" }}
          >
            {comSom ? <Volume2 size={16} strokeWidth={2} /> : <VolumeX size={16} strokeWidth={2} />}
          </button>
        )}

        {/* selo do Instagram — sempre visível, é o que marca o card como post */}
        {igUrl ? (
          <a
            href={igUrl}
            target="_blank"
            rel="noreferrer"
            aria-label={`Instagram de ${m.name}`}
            className="absolute right-4 top-4 z-[4] transition-opacity duration-200 hover:opacity-70"
          >
            {igIcon}
          </a>
        ) : (
          <span aria-hidden="true" className="pointer-events-none absolute right-4 top-4 z-[4]">
            {igIcon}
          </span>
        )}

        {/* miniatura do instrumento = o produto marcado no post. Leva pra PDP e
            diz o nome num balãozinho, porque 52px de foto não identificam nada. */}
        {produto && (
          <div className="absolute bottom-4 left-4 z-[6] transition-[translate] duration-[420ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/post:-translate-y-[64px]">
            <Link
              to={getProductUrl(produto)}
              aria-label={`Ver ${produto.name}`}
              className="peer/thumb flex h-[66px] w-[50px] items-center justify-center overflow-hidden transition-[scale] duration-200 hover:scale-105"
              style={{ borderRadius: 10, background: "#fff", boxShadow: "0 4px 16px rgba(0,0,0,0.30)" }}
            >
              {/* A foto do Magento é quadrada com o instrumento ocupando pouco
                  mais de 20% dela — em 52px isso vira um risco invisível. O
                  zoom de instrumentFraming (medido offline por produto) traz o
                  instrumento pra ~58% do quadro; `multiply` casa o branco da
                  foto com o branco da miniatura. A miniatura é RETRATO (50×66)
                  e não quadrada porque instrumento é objeto vertical: no
                  quadrado sobrava branco dos dois lados e sobrava pouca altura
                  pro que importa. A âncora em 62% puxa o enquadramento pro
                  corpo — ampliar pelo centro pega o meio do braço, que é um
                  risco sem identidade.
                  Foto nossa (`/produtos/…`) é fotográfica, com fundo de
                  verdade: preenche o quadrado e não multiplica nada. */}
              <ImageWithFallback
                src={fotoProduto}
                alt=""
                className={fotoDeCatalogo ? "h-full w-full object-contain" : "h-full w-full object-cover"}
                style={
                  fotoDeCatalogo
                    ? { mixBlendMode: "multiply", scale: String(zoomThumb), transformOrigin: "50% 62%" }
                    : undefined
                }
              />
            </Link>
            {/* o nome de catálogo do Magento é quilométrico ("Violão Elétrico
                Coral 41\" - Tampo Sólido EM Spruce - …") e estourava o card,
                que é overflow:hidden. O balão usa o nome curto do instrumento e
                ainda assim tem teto de largura e pode quebrar em duas linhas. */}
            <span
              role="tooltip"
              className="pointer-events-none absolute bottom-[calc(100%+8px)] left-0 opacity-0 transition-opacity duration-200 peer-hover/thumb:opacity-100"
              /* `display: block` é obrigatório: num <span> inline que quebra em
                 duas linhas o fundo e o padding se partem por linha. */
              style={{ display: "block", width: "max-content", background: "#111111", color: "#fff", borderRadius: 8, padding: "6px 10px", fontFamily: "var(--font-family-inter)", fontSize: 12.5, fontWeight: 600, lineHeight: 1.35, maxWidth: 190, border: "1px solid rgba(255,255,255,0.14)", boxShadow: "0 6px 18px rgba(0,0,0,0.45)" }}
            >
              {m.instrumentLabel}
            </span>
          </div>
        )}

        {/* Botão de compra: surge da base no hover e joga direto no carrinho.
            Mesmo comportamento do CTA flutuante do ProductCardV2 — branco que
            inverte pra preto sob o mouse —, pra comprar ser o mesmo gesto em
            qualquer lugar do site. */}
        {produto && (
          <button
            type="button"
            onClick={comprar}
            onMouseEnter={() => setCtaHover(true)}
            onMouseLeave={() => setCtaHover(false)}
            className="absolute inset-x-4 bottom-4 z-[4] flex h-12 translate-y-3 cursor-pointer items-center justify-center gap-2 rounded-pill opacity-0 transition-[translate,opacity,background-color,color] duration-[420ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/post:translate-y-0 group-hover/post:opacity-100"
            style={{
              background: ctaHover ? "var(--ink-strong)" : "#ffffff",
              color: ctaHover ? "#ffffff" : "var(--ink-strong)",
              border: "none",
              padding: "6px 16px",
              boxShadow: "0 10px 28px rgba(0,0,0,0.30)",
              fontFamily: "var(--font-family-inter)", fontSize: 14, fontWeight: 600,
            }}
          >
            <ShoppingBag size={16} strokeWidth={2.1} />
            Comprar agora
          </button>
        )}
      </div>
    </div>
  );
}

export function MusicosTonante() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  // vídeos só rodam com a seção na tela e sem modal aberto
  const [naTela, setNaTela] = useState(false);
  /* Onde existe ponteiro fino quem manda no play é o hover do card. Onde não
     existe (toque), nada acionaria o vídeo — aí o autoplay da viewport
     continua valendo. */
  const [semHover, setSemHover] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const ler = () => setSemHover(!mq.matches);
    ler();
    mq.addEventListener("change", ler);
    return () => mq.removeEventListener("change", ler);
  }, []);

  /* Carrossel infinito: o trilho carrega três voltas do elenco e o visitante
     fica sempre na do meio. Quando ele se afasta dela, a posição salta uma
     volta inteira — como o conteúdo é idêntico, o salto é invisível.
     A correção só roda depois que a rolagem PARA (150ms sem evento): mexer em
     scrollLeft no meio de um `behavior: "smooth"` cancela a animação e trava a
     seta no meio do caminho. */
  const normalizar = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const volta = el.scrollWidth / 3;
    if (volta <= 0) return;
    if (el.scrollLeft < volta * 0.5) el.scrollLeft += volta;
    else if (el.scrollLeft > volta * 1.5) el.scrollLeft -= volta;
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    // começa na volta do meio, pra haver elenco dos dois lados desde o início
    const ir = () => { el.scrollLeft = el.scrollWidth / 3; };
    ir();
    const ro = new ResizeObserver(ir);
    ro.observe(el);

    let t: ReturnType<typeof setTimeout>;
    const onScroll = () => { clearTimeout(t); t = setTimeout(normalizar, 150); };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => { ro.disconnect(); el.removeEventListener("scroll", onScroll); clearTimeout(t); };
  }, [normalizar]);

  const scrollBy = useCallback((dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.round(el.clientWidth * 0.9), behavior: "smooth" });
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => setNaTela(e.isIntersecting),
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={sectionRef} style={{ background: "var(--surface-0)", paddingTop: "var(--space-section-md)" }}>
      <div className="mx-auto w-full px-5 md:px-12" style={{ maxWidth: "1680px" }}>
        <div className="mb-8 flex flex-wrap items-end justify-between gap-6">
          <div>
            <SectionHeader eyebrow="Músicos Tonante" title="Quem toca, conta" size="lg" weight={700} />
            <p style={{ fontFamily: "var(--font-family-inter)", fontSize: 15, color: "var(--ink-soft)", margin: "14px 0 0" }}>
              Histórias reais de quem faz música com a gente · <strong style={{ color: "var(--amber-deep)", fontWeight: 700 }}>#FeitaDeHistorias</strong>
            </p>
          </div>

          {/* A seção é o feed da Tonante, então ela se apresenta como um perfil. */}
          <div className="hidden items-center gap-4 md:flex">
            <a href={PERFIL_URL} target="_blank" rel="noreferrer" className="flex items-center gap-3" style={{ textDecoration: "none" }}>
              <span className="flex h-14 w-14 items-center justify-center rounded-full" style={{ background: "linear-gradient(45deg, #f9ce34 5%, #ee2a7b 55%, #6228d7 100%)", padding: 2.5 }}>
                <span className="flex h-full w-full items-center justify-center overflow-hidden rounded-full" style={{ background: "#fff" }}>
                  <img src="/brand/tonante-symbol-black.png" alt="" className="h-7 w-7 object-contain" />
                </span>
              </span>
              <span style={{ fontFamily: "var(--font-family-inter)", fontSize: 14.5, fontWeight: 600, color: "var(--ink-strong)" }}>
                {PERFIL_HANDLE}
              </span>
            </a>
            <a
              href={PERFIL_URL}
              target="_blank"
              rel="noreferrer"
              className="transition-opacity duration-200 hover:opacity-85"
              style={{ background: "#111111", color: "#fff", borderRadius: 999, padding: "11px 26px", fontFamily: "var(--font-family-inter)", fontSize: 13.5, fontWeight: 700, textDecoration: "none" }}
            >
              Seguir
            </a>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full px-5 md:px-12" style={{ maxWidth: "1680px" }}>
        {/* O trilho sangra até a borda direita da tela: o 5º card fica pela
            metade e é ele que convida a arrastar. O cabeçalho acima continua
            no container de 1680, pra não desalinhar com as outras seções. */}
        <div className="group/trilho relative" style={{ marginRight: "calc(50% - 50vw)" }}>
          <div
            ref={trackRef}
            className="shelf-track flex overflow-x-auto pb-2"
            style={{ scrollbarWidth: "none", gap: 22 }}
          >
            {VOLTAS.map((m, i) => (
              <MusicianCard
                key={`${m.id}-${i}`}
                m={m}
                autoPlay={naTela && semHover}
              />
            ))}
          </div>

          {/* As setas flutuam sobre foto, não sobre o fundo da página: a borda
             hairline do DS some contra um card claro e a seta some junto —
             daí a sombra mais firme só aqui. */}
          <CarouselNavButton
            direction="left"
            onClick={() => scrollBy(-1)}
            className="absolute left-4 top-1/2 z-[6] -translate-y-1/2 opacity-0 shadow-[0_4px_18px_rgba(0,0,0,0.28)] transition-opacity duration-200 group-hover/trilho:opacity-100"
          />
          <CarouselNavButton
            direction="right"
            onClick={() => scrollBy(1)}
            className="absolute top-1/2 z-[6] -translate-y-1/2 opacity-0 shadow-[0_4px_18px_rgba(0,0,0,0.28)] transition-opacity duration-200 group-hover/trilho:opacity-100"
            style={{ right: 80 }}
          />
        </div>
      </div>

    </section>
  );
}

