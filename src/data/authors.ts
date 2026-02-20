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
