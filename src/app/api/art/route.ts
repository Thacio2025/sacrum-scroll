/**
 * Imagens via Wikimedia Commons API.
 * Regra: retrato específico do autor (termos em inglês) OU paisagem (natureza).
 * Licenças no Commons são majoritariamente domínio público ou CC (atribuição quando exigido).
 */

const COMMONS_API = "https://commons.wikimedia.org/w/api.php";
const FILE_NAMESPACE = 6; // namespace para ficheiros no Commons

/** Termos de busca no Commons para retratos dos autores (inglês). */
const AUTHOR_IMAGE_TERMS: Record<string, string[]> = {
  "Santo Agostinho": ["Saint Augustine portrait", "Augustine of Hippo"],
  "São João Crisóstomo": ["John Chrysostom portrait"],
  "São Tomás de Aquino": ["Thomas Aquinas portrait"],
  "Santa Teresa d'Ávila": ["Teresa of Avila portrait"],
  "São João da Cruz": ["John of the Cross portrait"],
  "São Gregório Magno": ["Pope Gregory the Great portrait"],
  "São Basílio Magno": ["Basil the Great portrait"],
  "Santo Ambrósio": ["Ambrose of Milan portrait"],
  "São Jerônimo": ["Saint Jerome portrait"],
  "Santo Irineu": ["Irenaeus portrait"],
  "São Cipriano": ["Cyprian portrait"],
  "São João Damasceno": ["John Damascene portrait"],
  "São Boaventura": ["Bonaventure portrait"],
  "Santo Anselmo": ["Anselm of Canterbury portrait"],
  "Santo Alberto Magno": ["Albert the Great portrait"],
  "Duns Escoto": ["Duns Scotus portrait"],
  "Abba Antônio": ["Saint Anthony the Great", "Anthony of Egypt"],
  "Abba Macário": ["Macarius of Egypt"],
  "Abba Arsenius": ["Arsenius the Great"],
  "Santo Afonso Maria de Ligório": ["Alphonsus Liguori portrait", "Saint Alphonsus"],
  "São Bernardo de Claraval": ["Bernard of Clairvaux portrait", "Saint Bernard"],
  "São Francisco de Sales": ["Francis de Sales portrait", "Saint Francis de Sales"],
  "Santo Inácio de Loyola": ["Ignatius of Loyola portrait", "Saint Ignatius"],
  "São Francisco de Assis": ["Francis of Assisi portrait", "Saint Francis"],
  "Santa Catarina de Sena": ["Catherine of Siena portrait", "Saint Catherine of Siena"],
  "Santa Ângela de Foligno": ["Angela of Foligno", "Blessed Angela"],
  "São Leão Magno": ["Pope Leo the Great", "Leo I portrait"],
};

/** Paisagens para fallback. */
const NATURE_TERMS = [
  "mountain landscape",
  "forest landscape",
  "valley landscape",
  "countryside landscape",
  "seascape",
  "sunset landscape",
];

function hash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

function getAuthorTerms(author: string): string[] {
  return AUTHOR_IMAGE_TERMS[author] ?? [];
}

interface CommonsPage {
  pageid?: number;
  title?: string;
  imageinfo?: Array<{ url?: string; thumburl?: string; thumbwidth?: number }>;
}

interface CommonsQueryResponse {
  query?: { pages?: Record<string, CommonsPage> };
}

/** Busca imagens no Commons e retorna lista de URLs. */
async function searchCommonsImages(query: string, limit = 30): Promise<{ url: string; title?: string }[]> {
  const params = new URLSearchParams({
    action: "query",
    generator: "search",
    gsrsearch: query,
    gsrnamespace: String(FILE_NAMESPACE),
    gsrlimit: String(limit),
    prop: "imageinfo",
    iiprop: "url",
    iiurlwidth: "1200",
    format: "json",
    origin: "*",
  });

  const res = await fetch(`${COMMONS_API}?${params.toString()}`, {
    next: { revalidate: 3600 },
    headers: { "User-Agent": "SacrumScroll/1.0 (https://sacrumscroll.netlify.app; contact for feedback)" },
  });

  if (!res.ok) return [];

  const data = (await res.json()) as CommonsQueryResponse;
  const pages = data.query?.pages;
  if (!pages || typeof pages !== "object") return [];

  const results: { url: string; title?: string }[] = [];
  for (const page of Object.values(pages)) {
    const url = page.imageinfo?.[0]?.url;
    if (url) results.push({ url, title: page.title ?? undefined });
  }
  return results;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const seed = searchParams.get("seed") ?? String(Date.now());
  const author = searchParams.get("author") ?? "";

  try {
    let results: { url: string; title?: string }[] = [];
    let usedQuery = "";

    // 1) Tentar retrato do autor no Commons
    const authorTerms = getAuthorTerms(author);
    if (authorTerms.length > 0) {
      for (const query of authorTerms) {
        const list = await searchCommonsImages(query, 25);
        if (list.length >= 3) {
          results = list;
          usedQuery = query;
          break;
        }
      }
    }

    // 2) Se não achou autor, usar paisagens
    if (results.length === 0) {
      for (const query of NATURE_TERMS) {
        const list = await searchCommonsImages(query, 25);
        if (list.length > 0) {
          results = list;
          usedQuery = query;
          break;
        }
      }
    }

    if (results.length === 0) {
      return Response.json({ imageUrl: null, title: null });
    }

    const index = hash(seed + usedQuery) % results.length;
    const chosen = results[index]!;

    return Response.json({
      imageUrl: chosen.url,
      title: chosen.title ?? (author || "Nature"),
      objectID: null,
    });
  } catch (e) {
    console.error("Art API (Commons) error", e);
    return Response.json({ imageUrl: null, title: null }, { status: 500 });
  }
}
