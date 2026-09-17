/* Consulta de CNPJ na API pública do CNPJ.ws.
   Grátis, sem chave, mas limitada a 3 consultas por minuto por IP — daí o
   cache e a validação de dígito local: só gasta requisição em CNPJ que já
   passou no cálculo, e nunca consulta o mesmo número duas vezes. */

const API = "https://publica.cnpj.ws/cnpj";

export interface CnaeOption {
  /** Subclasse no formato oficial, ex.: "1099-6/99". */
  codigo: string;
  descricao: string;
}

export interface CnpjAddress {
  /** Logradouro com tipo e número já montados, ex.: "RUA ABRAMO ROCCO, 334". */
  logradouro: string;
  complemento?: string;
  bairro: string;
  cep: string;
  municipio: string;
  uf: string;
}

export interface CnpjLookupResult {
  cnpj: string;
  razaoSocial: string;
  nomeFantasia?: string;
  situacao: string;
  endereco: CnpjAddress;
  /** Só as inscrições ativas, a do estado da matriz primeiro. */
  inscricoesEstaduais: string[];
  atividadePrincipal: CnaeOption;
  atividadesSecundarias: CnaeOption[];
}

/** Só os dígitos, no máximo 14. */
export function stripCnpj(value: string): string {
  return value.replace(/\D/g, "").slice(0, 14);
}

/** Formata progressivamente enquanto digita: 00.000.000/0000-00 */
export function formatCnpj(value: string): string {
  const d = stripCnpj(value);
  if (d.length <= 2) return d;
  if (d.length <= 5) return `${d.slice(0, 2)}.${d.slice(2)}`;
  if (d.length <= 8) return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5)}`;
  if (d.length <= 12) return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8)}`;
  return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8, 12)}-${d.slice(12)}`;
}

/* Dígito verificador: soma ponderada mod 11, resto < 2 vira 0. O primeiro DV
   usa pesos 5..2 seguidos de 9..2; o segundo repete com um peso a mais. */
function checkDigit(digits: string, weights: number[]): number {
  const sum = weights.reduce((acc, w, i) => acc + Number(digits[i]) * w, 0);
  const rest = sum % 11;
  return rest < 2 ? 0 : 11 - rest;
}

export function isValidCnpj(value: string): boolean {
  const d = stripCnpj(value);
  if (d.length !== 14) return false;
  /* Sequências repetidas passam no cálculo mas não existem na Receita. */
  if (/^(\d)\1{13}$/.test(d)) return false;
  if (checkDigit(d, [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]) !== Number(d[12])) return false;
  return checkDigit(d, [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]) === Number(d[13]);
}

/* A Receita devolve tudo em caixa alta. Caixa alta longa é lida letra por letra
   em vez de pela silhueta da palavra, e "APISNUTRI PRODUTOS ALIMENTICIOS LTDA"
   vira um bloco. Título mantém as siglas que só existem em caixa alta. */
const SIGLAS = new Set(["LTDA", "ME", "EPP", "EIRELI", "MEI", "SA", "S/A", "S.A", "S.A.", "CIA", "EPP.", "LTDA.", "II", "III", "IV"]);
const MINUSCULAS = new Set(["de", "da", "do", "das", "dos", "e", "em", "para", "a", "o"]);

export function toTitleCase(value: string): string {
  return value
    .toLowerCase()
    .split(/\s+/)
    .map((word, i) => {
      const upper = word.toUpperCase();
      if (SIGLAS.has(upper)) return upper;
      if (i > 0 && MINUSCULAS.has(word)) return word;
      return word.replace(/^([a-zà-ú])/, (c) => c.toUpperCase());
    })
    .join(" ");
}

export class CnpjLookupError extends Error {
  /* Erro de limite é o único que vale a pena o usuário tentar de novo. */
  readonly retryable: boolean;
  constructor(message: string, retryable = false) {
    super(message);
    this.retryable = retryable;
  }
}

const cache = new Map<string, CnpjLookupResult>();

interface CnpjWsAtividade {
  id?: string;
  subclasse?: string;
  descricao?: string;
}

interface CnpjWsResponse {
  razao_social?: string;
  estabelecimento?: {
    nome_fantasia?: string | null;
    situacao_cadastral?: string;
    tipo_logradouro?: string | null;
    logradouro?: string | null;
    numero?: string | null;
    complemento?: string | null;
    bairro?: string | null;
    cep?: string | null;
    cidade?: { nome?: string };
    estado?: { sigla?: string; id?: number };
    atividade_principal?: CnpjWsAtividade;
    atividades_secundarias?: CnpjWsAtividade[];
    inscricoes_estaduais?: {
      inscricao_estadual?: string;
      ativo?: boolean;
      estado?: { id?: number };
    }[];
  };
}

function formatCep(raw: string): string {
  const d = raw.replace(/\D/g, "");
  return d.length === 8 ? `${d.slice(0, 5)}-${d.slice(5)}` : raw;
}

function toCnae(a?: CnpjWsAtividade): CnaeOption | null {
  if (!a?.descricao) return null;
  return { codigo: a.subclasse ?? a.id ?? "", descricao: a.descricao };
}

export async function lookupCnpj(value: string): Promise<CnpjLookupResult> {
  const cnpj = stripCnpj(value);
  if (!isValidCnpj(cnpj)) throw new CnpjLookupError("CNPJ inválido. Confira os números.");

  const cached = cache.get(cnpj);
  if (cached) return cached;

  let response: Response;
  try {
    response = await fetch(`${API}/${cnpj}`);
  } catch {
    throw new CnpjLookupError("Sem conexão com a Receita agora. Tente de novo.", true);
  }

  if (response.status === 429) {
    throw new CnpjLookupError("Muitas consultas seguidas. Espere um minuto e tente de novo.", true);
  }
  if (response.status === 404) {
    throw new CnpjLookupError("CNPJ não encontrado na Receita Federal.");
  }
  if (!response.ok) {
    throw new CnpjLookupError("Não foi possível consultar esse CNPJ agora.", true);
  }

  const data = (await response.json()) as CnpjWsResponse;
  const estab = data.estabelecimento;
  const situacao = estab?.situacao_cadastral ?? "";

  /* Baixada, suspensa e inapta não podem comprar pra revender. */
  if (situacao.toLowerCase() !== "ativa") {
    throw new CnpjLookupError(`Esse CNPJ está ${situacao.toLowerCase() || "irregular"} na Receita Federal.`);
  }

  /* O endereço da Receita é o único que vale: a entrega da conta PJ vai pra
     ele, então não faz sentido pedir logradouro ao usuário. */
  const rua = [estab?.tipo_logradouro, estab?.logradouro].filter(Boolean).join(" ").trim();
  const numero = estab?.numero?.replace(/^0+/, "") || "s/n";

  const principal = toCnae(estab?.atividade_principal);
  if (!principal) throw new CnpjLookupError("A Receita não retornou a atividade dessa empresa.", true);

  /* Inscrições de outros estados existem (filiais), mas quem fatura é a UF do
     estabelecimento — ela vem primeiro. */
  const ufId = estab?.estado?.id;
  const inscricoes = (estab?.inscricoes_estaduais ?? [])
    .filter((ie) => ie.ativo && ie.inscricao_estadual)
    .sort((a, b) => Number(b.estado?.id === ufId) - Number(a.estado?.id === ufId))
    .map((ie) => ie.inscricao_estadual as string);

  const result: CnpjLookupResult = {
    cnpj,
    razaoSocial: data.razao_social ?? "",
    nomeFantasia: estab?.nome_fantasia ?? undefined,
    situacao,
    endereco: {
      logradouro: rua ? `${rua}, ${numero}` : "",
      complemento: estab?.complemento ?? undefined,
      bairro: estab?.bairro ?? "",
      cep: formatCep(estab?.cep ?? ""),
      municipio: estab?.cidade?.nome ?? "",
      uf: estab?.estado?.sigla ?? "",
    },
    inscricoesEstaduais: inscricoes,
    atividadePrincipal: principal,
    atividadesSecundarias: (estab?.atividades_secundarias ?? []).map(toCnae).filter((c): c is CnaeOption => !!c),
  };
  cache.set(cnpj, result);
  return result;
}
