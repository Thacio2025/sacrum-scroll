import type { ContentCategory, QuoteCard } from "@/types/content";
import { DESERT_FATHERS_QUOTES } from "./desert-fathers";
import { SCRIPTURE_QUOTES } from "./scripture-quotes";
import { REST_POOL } from "./quotes-pool";

// Pool completo para análise de autores
const POOL: Omit<QuoteCard, "id">[] = [
  ...DESERT_FATHERS_QUOTES,
  ...SCRIPTURE_QUOTES,
  ...REST_POOL,
];

export interface AuthorProfile {
  name: string;
  category: ContentCategory;
  quoteCount: number;
  displayName: string; // Nome abreviado para exibição
  /** Ex.: "Séc. IV" — para exibição no card */
  century?: string;
}

/** Século de autores conhecidos (para linha Categoria · Século no card). */
const AUTHOR_CENTURY: Record<string, string> = {
  "Santo Agostinho": "Séc. IV",
  "São João Crisóstomo": "Séc. IV",
  "São Gregório Magno": "Séc. VI",
  "São Basílio Magno": "Séc. IV",
  "Santo Ambrósio": "Séc. IV",
  "São Jerônimo": "Séc. IV",
  "Santo Irineu": "Séc. II",
  "São Cipriano": "Séc. III",
  "São João Damasceno": "Séc. VIII",
  "Tertuliano": "Séc. II",
  "São Gregório de Nissa": "Séc. IV",
  "Santa Teresa d'Ávila": "Séc. XVI",
  "São João da Cruz": "Séc. XVI",
  "São Tomás de Aquino": "Séc. XIII",
  "Santo Anselmo": "Séc. XI",
  "São Boaventura": "Séc. XIII",
  "Duns Escoto": "Séc. XIII",
  "Santo Alberto Magno": "Séc. XIII",
  "Santo Afonso Maria de Ligório": "Séc. XVIII",
  "São Bernardo de Claraval": "Séc. XII",
  "São Francisco de Sales": "Séc. XVII",
  "Santo Inácio de Loyola": "Séc. XVI",
  "São Francisco de Assis": "Séc. XIII",
  "Santa Catarina de Sena": "Séc. XIV",
  "Santa Ângela de Foligno": "Séc. XIII",
  "São Leão Magno": "Séc. V",
  "Abba Antônio": "Séc. IV",
  "Abba Poimen": "Séc. V",
  "Abba Macário": "Séc. IV",
  "Abba Arsenius": "Séc. V",
  "Abba Moisés": "Séc. IV",
  "Abba Agathon": "Séc. IV",
  "Abba Pambo": "Séc. IV",
  "Abba Sisoés": "Séc. V",
  "Abba Bessarion": "Séc. IV",
  "Abba Evágrio": "Séc. IV",
  "Abba Isaías": "Séc. V",
};

export function getAuthorCentury(author: string): string | undefined {
  return AUTHOR_CENTURY[author];
}

/** Bio curta para o modal "Sobre o autor". */
const AUTHOR_BIO: Record<string, string> = {
  "Santo Agostinho": "Padre e Doutor da Igreja (354–430). Bispo de Hipona, autor de Confissões e A Cidade de Deus. Mestre da graça e da Trindade.",
  "São João Crisóstomo": "Padre e Doutor da Igreja (c. 347–407). Patriarca de Constantinopla, grande pregador. 'Crisóstomo' significa boca de ouro.",
  "Santa Teresa d'Ávila": "Doutora da Igreja (1515–1582). Reformadora do Carmelo, mística. Autora de O Castelo Interior e Caminho de Perfeição.",
  "São João da Cruz": "Doutor da Igreja (1542–1591). Carmelita, místico. Autor de Subida do Monte Carmelo, Noite escura e Cântico espiritual.",
  "São Tomás de Aquino": "Doutor da Igreja (1225–1274). Dominicano, autor da Suma Teológica. Mestre da escolástica e da razão à serviço da fé.",
  "São Gregório Magno": "Papa e Doutor da Igreja (c. 540–604). Grande pastor e escritor. Regra Pastoral e Diálogos.",
  "São Basílio Magno": "Padre e Doutor da Igreja (330–379). Bispo de Cesareia, mestre da vida monástica e da Trindade.",
  "Santo Ambrósio": "Padre e Doutor da Igreja (c. 340–397). Bispo de Milão, doutrina e hinos. Batizou Santo Agostinho.",
  "São Jerônimo": "Padre e Doutor da Igreja (c. 347–420). Tradutor da Vulgata. 'Ignorar as Escrituras é ignorar Cristo.'",
  "Abba Antônio": "Padre do Deserto (c. 251–356). Pai dos monges, eremita no Egito. Vida narrada por Santo Atanásio.",
  "Abba Poimen": "Padre do Deserto (séc. V). Grande entre os Padres do Deserto. Sabedoria sobre o coração e a oração.",
  "Abba Macário": "Padre do Deserto (c. 300–391). Eremita no Egito. Mestre do silêncio e da humildade.",
  "São Boaventura": "Doutor da Igreja (1221–1274). Franciscano, teólogo. Itinerário da mente a Deus.",
  "Santo Anselmo": "Doutor da Igreja (1033–1109). Arcebispo de Cantuária. 'Creio para entender.'",
  "São Bernardo de Claraval": "Doutor da Igreja (1090–1153). Cisterciense, pregador. Mestre do amor a Cristo e a Maria.",
  "São Francisco de Assis": "Santo (1181/82–1226). Fundador dos Franciscanos. Pobreza, paz e louvor à criação.",
  "Santo Inácio de Loyola": "Santo (1491–1556). Fundador dos Jesuítas. Autor dos Exercícios Espirituais.",
  "Santa Catarina de Sena": "Doutora da Igreja (1347–1380). Dominicana, mística. Padroeira da Itália.",
  "Santo Afonso Maria de Ligório": "Doutor da Igreja (1696–1787). Fundador dos Redentoristas. Considerações sobre a Paixão, moral e misericórdia.",
};

export function getAuthorBio(author: string): string | undefined {
  return AUTHOR_BIO[author];
}

/**
 * Extrai autores únicos do pool e conta quantas citações cada um tem.
 */
function extractAuthors(): Map<string, AuthorProfile> {
  const authorMap = new Map<string, AuthorProfile>();

  POOL.forEach((quote) => {
    const existing = authorMap.get(quote.author);
    if (existing) {
      existing.quoteCount++;
    } else {
      authorMap.set(quote.author, {
        name: quote.author,
        category: quote.category,
        quoteCount: 1,
        displayName: getDisplayName(quote.author),
      });
    }
  });

  return authorMap;
}

/**
 * Gera nome abreviado para exibição nos círculos de perfil.
 */
function getDisplayName(fullName: string): string {
  // Padres do Deserto: "Abba Antônio" -> "A. Antônio"
  if (fullName.startsWith("Abba ")) {
    const name = fullName.replace("Abba ", "");
    if (name.includes(", ")) {
      return name.split(", ")[0]!;
    }
    return name.length > 12 ? name.substring(0, 10) + "..." : name;
  }

  // Santos: "Santo Agostinho" -> "S. Agostinho"
  if (fullName.startsWith("Santo ")) {
    return "S. " + fullName.replace("Santo ", "");
  }
  if (fullName.startsWith("Santa ")) {
    return "S. " + fullName.replace("Santa ", "").split(" ")[0];
  }
  if (fullName.startsWith("São ")) {
    return "S. " + fullName.replace("São ", "");
  }

  // Escritura: "Salmos" -> "Salmos"
  // Outros: manter como está, mas truncar se muito longo
  return fullName.length > 15 ? fullName.substring(0, 13) + "..." : fullName;
}

/**
 * Lista de autores principais (priorizados para exibição).
 * Ordenados por importância/relevância.
 */
const PRIORITY_AUTHORS = [
  // Padres do Deserto (principais)
  "Abba Antônio",
  "Abba Poimen",
  "Abba Macário",
  "Abba Arsenius",
  "Abba Sisoés",
  "Abba Agathon",
  "Abba Pambo",
  "Abba Moisés",
  // Padres da Igreja
  "Santo Agostinho",
  "São João Crisóstomo",
  "São Gregório Magno",
  "São Basílio Magno",
  "Santo Ambrósio",
  "São Jerônimo",
  // Místicos
  "Santa Teresa d'Ávila",
  "São João da Cruz",
  // Escolásticos
  "São Tomás de Aquino",
  "Santo Anselmo",
  "São Boaventura",
  // Escritura (principais livros)
  "Salmos",
  "Provérbios",
  "Mateus",
  "João",
];

/**
 * Retorna lista de autores principais para exibição na barra de perfis.
 * Ordena por prioridade, depois por quantidade de citações.
 */
export function getMainAuthors(): AuthorProfile[] {
  const allAuthors = extractAuthors();
  const prioritySet = new Set(PRIORITY_AUTHORS);
  
  const priority: AuthorProfile[] = [];
  const others: AuthorProfile[] = [];

  allAuthors.forEach((author) => {
    if (prioritySet.has(author.name)) {
      priority.push(author);
    } else {
      others.push(author);
    }
  });

  // Ordena prioridade pela ordem em PRIORITY_AUTHORS
  priority.sort((a, b) => {
    const idxA = PRIORITY_AUTHORS.indexOf(a.name);
    const idxB = PRIORITY_AUTHORS.indexOf(b.name);
    return idxA - idxB;
  });

  // Ordena outros por quantidade de citações (mais citações primeiro)
  others.sort((a, b) => b.quoteCount - a.quoteCount);

  // Retorna: prioridade + outros (limitado a ~25 autores principais)
  return [...priority, ...others.slice(0, Math.max(0, 25 - priority.length))];
}

/**
 * Retorna todos os autores (sem limite).
 */
export function getAllAuthors(): AuthorProfile[] {
  const allAuthors = extractAuthors();
  return Array.from(allAuthors.values()).sort((a, b) => b.quoteCount - a.quoteCount);
}

/**
 * Busca citações de um autor específico no pool.
 */
export function getQuotesByAuthor(authorName: string): number[] {
  const indices: number[] = [];
  POOL.forEach((quote, index) => {
    if (quote.author === authorName) {
      indices.push(index);
    }
  });
  return indices;
}
