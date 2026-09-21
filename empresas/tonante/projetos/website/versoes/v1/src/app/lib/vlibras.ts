/* VLibras — tradutor de Libras oficial do governo federal (vlibras.gov.br).

   O botão de acessibilidade do header era um placeholder: abria nada. Em vez
   de inventar um painel de contraste/fonte caseiro, a loja passa a chamar o
   plugin do gov.br, que traduz o conteúdo da página para Libras com o avatar
   da Hosana. É o mesmo widget que roda nos sites do governo.

   O script é pesado (avatar 3D em WebGL) e mora num CDN de terceiro, então
   quem nunca pediu Libras não paga por ele: nada é carregado no boot. A
   primeira chamada de `abrirVLibras` injeta o markup que o plugin exige, baixa
   o script e abre o painel. As chamadas seguintes apenas clicam no botão do
   próprio widget, que alterna entre aberto e fechado.

   Quem usou uma vez não precisa pedir de novo: o uso fica anotado no
   navegador e `restaurarVLibras` (chamada no RootLayout) remonta o widget nas
   visitas seguintes, com o botão flutuante do plugin já na tela. Sem isso o
   botão sumia a cada F5 — carregar sob demanda cobrava o pedido toda vez de
   quem depende de Libras para navegar. */

const SCRIPT_SRC = "https://vlibras.gov.br/app/vlibras-plugin.js";
const CHAVE_USO = "tonante-vlibras";
const ROOT_PATH = "https://vlibras.gov.br/app";

declare global {
  interface Window {
    VLibras?: { Widget: new (rootPath: string | Record<string, unknown>) => unknown };
  }
}

let carregando: Promise<void> | null = null;

/* O plugin não aceita um container qualquer: ele procura os atributos `vw`,
   `vw-access-button` e `vw-plugin-wrapper` no documento. */
function montarMarkup() {
  if (document.querySelector("[vw]")) return;

  const raiz = document.createElement("div");
  raiz.setAttribute("vw", "");
  raiz.className = "enabled";
  raiz.innerHTML = `
    <div vw-access-button class="active"></div>
    <div vw-plugin-wrapper>
      <div class="vw-plugin-top-wrapper"></div>
    </div>
  `;
  document.body.appendChild(raiz);
}

function carregarScript(): Promise<void> {
  if (carregando) return carregando;

  carregando = new Promise<void>((resolve, reject) => {
    if (window.VLibras) { resolve(); return; }

    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => { carregando = null; reject(new Error("VLibras indisponível")); };
    document.head.appendChild(script);
  });

  return carregando;
}

/* O plugin não expõe API de abrir: quem abre o painel é o botão dele. Da v7
   em diante esse botão mora num shadow root (`#vlibras-access-wrapper`), fora
   do alcance de um querySelector comum — daí a descida explícita. O markup
   `[vw]` acima continua sendo o container onde o painel é montado.

   Além disso o botão só nasce alguns frames depois do `new`: sem a espera, o
   clique cai no vazio e o painel nunca abre. */
function esperarBotao(timeout = 15000): Promise<HTMLElement> {
  return new Promise((resolve, reject) => {
    const limite = Date.now() + timeout;

    const tentar = () => {
      const wrapper = document.getElementById("vlibras-access-wrapper");
      const botao =
        wrapper?.shadowRoot?.getElementById("vlibras-button") ??
        document.querySelector<HTMLElement>("[vw-access-button]");

      if (botao && wrapper?.shadowRoot) { resolve(botao); return; }
      if (Date.now() > limite) {
        if (botao) { resolve(botao); return; }
        reject(new Error("VLibras não montou o botão"));
        return;
      }
      requestAnimationFrame(tentar);
    };

    tentar();
  });
}

/* O botão do plugin nasce com `right: 10px`; o do WhatsApp flutua na mesma
   borda com 56px de lado. Com as medidas de fábrica os centros ficavam a 30px
   e a 48px da borda, e a coluna saía torta. Cada um cedeu metade: o WhatsApp
   encostou (right-3/md:right-4, em WhatsAppFab) e o VLibras recuou pra cá.
   O estilo vai dentro do shadow root porque é lá que o botão mora — daqui de
   fora nenhuma folha de estilo alcança. */
const CSS_ALINHAMENTO = `
  #vlibras-access { right: 19px; }
  @media (min-width: 768px) { #vlibras-access { right: 23px; } }
`;

function alinharComWhatsApp(raiz: ShadowRoot) {
  if (raiz.getElementById("tonante-vlibras-alinhamento")) return;

  const estilo = document.createElement("style");
  estilo.id = "tonante-vlibras-alinhamento";
  estilo.textContent = CSS_ALINHAMENTO;
  raiz.appendChild(estilo);
}

let widget: unknown = null;

/** Põe o widget na tela (botão flutuante do plugin), sem abrir o painel. */
async function montarWidget(): Promise<HTMLElement> {
  montarMarkup();
  await carregarScript();

  if (!widget && window.VLibras) widget = new window.VLibras.Widget(ROOT_PATH);

  const botao = await esperarBotao();

  const raiz = document.getElementById("vlibras-access-wrapper")?.shadowRoot;
  if (raiz) alinharComWhatsApp(raiz);

  return botao;
}

/** Abre (ou fecha) o painel do VLibras, carregando o plugin na primeira vez. */
export async function abrirVLibras() {
  const botao = await montarWidget();

  /* Anotado só quando alguém pede de fato — montar sozinho na visita seguinte
     é devolver o que a pessoa já escolheu, não empurrar o plugin. */
  try { localStorage.setItem(CHAVE_USO, "1"); } catch { /* navegação privada */ }

  botao.click();
}

/** Remonta o widget para quem já usou Libras nesta loja. Silencioso: se o CDN
 *  do governo estiver fora, a loja segue e o ícone do header continua valendo. */
export function restaurarVLibras() {
  let usou = false;
  try { usou = localStorage.getItem(CHAVE_USO) === "1"; } catch { return; }
  if (!usou) return;

  montarWidget().catch(() => {});
}
