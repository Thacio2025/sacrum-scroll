/**
 * Prompts seguros para geração de imagens via Pollinations.ai.
 * Regra: sempre "fully clothed, no nudity, modest, family friendly" para pessoas.
 * Para paisagem: "no people" para evitar qualquer figura.
 */

const SAFE_SUFFIX = ", religious art, fully clothed, modest, no nudity, family friendly, classical painting style";
const LANDSCAPE_SUFFIX = ", serene, peaceful, no people";

/** Prompt em inglês para retrato do autor (santo/padre). Usado em cards e avatares. */
export const AUTHOR_SAFE_PROMPTS: Record<string, string> = {
  "Santo Agostinho": `Saint Augustine of Hippo portrait${SAFE_SUFFIX}`,
  "São João Crisóstomo": `Saint John Chrysostom portrait${SAFE_SUFFIX}`,
  "São Tomás de Aquino": `Saint Thomas Aquinas portrait${SAFE_SUFFIX}`,
  "Santa Teresa d'Ávila": `Saint Teresa of Avila portrait${SAFE_SUFFIX}`,
  "São João da Cruz": `Saint John of the Cross portrait${SAFE_SUFFIX}`,
  "São Gregório Magno": `Pope Gregory the Great portrait${SAFE_SUFFIX}`,
  "São Basílio Magno": `Saint Basil the Great portrait${SAFE_SUFFIX}`,
  "Santo Ambrósio": `Saint Ambrose of Milan portrait${SAFE_SUFFIX}`,
  "São Jerônimo": `Saint Jerome portrait${SAFE_SUFFIX}`,
  "Santo Irineu": `Saint Irenaeus portrait${SAFE_SUFFIX}`,
  "São Cipriano": `Saint Cyprian portrait${SAFE_SUFFIX}`,
  "São João Damasceno": `Saint John Damascene portrait${SAFE_SUFFIX}`,
  "São Boaventura": `Saint Bonaventure portrait${SAFE_SUFFIX}`,
  "Santo Anselmo": `Saint Anselm of Canterbury portrait${SAFE_SUFFIX}`,
  "Santo Alberto Magno": `Saint Albert the Great portrait${SAFE_SUFFIX}`,
  "Duns Escoto": `John Duns Scotus portrait${SAFE_SUFFIX}`,
  "Abba Antônio": `Saint Anthony the Great desert father portrait${SAFE_SUFFIX}`,
  "Abba Poimen": `Christian desert monk portrait, elderly, robes${SAFE_SUFFIX}`,
  "Abba Moisés": `Christian desert monk portrait, robes${SAFE_SUFFIX}`,
  "Abba Macário": `Saint Macarius of Egypt portrait${SAFE_SUFFIX}`,
  "Abba Arsenius": `Saint Arsenius the Great portrait${SAFE_SUFFIX}`,
  "Abba Agathon": `Christian desert monk portrait, robes${SAFE_SUFFIX}`,
  "Abba Pambo": `Christian desert monk portrait, robes${SAFE_SUFFIX}`,
  "Abba Sisoés": `Christian desert monk portrait, robes${SAFE_SUFFIX}`,
  "Abba João, o Anão": `Christian desert monk portrait, robes${SAFE_SUFFIX}`,
  "Abba Bessarion": `Christian desert monk portrait, robes${SAFE_SUFFIX}`,
  "Abba Evágrio": `Christian desert monk portrait, robes${SAFE_SUFFIX}`,
  "Abba José de Panefó": `Christian desert monk portrait, robes${SAFE_SUFFIX}`,
  "Abba Nisteros": `Christian desert monk portrait, robes${SAFE_SUFFIX}`,
  "Abba Isaías": `Christian desert monk portrait, robes${SAFE_SUFFIX}`,
  "Abba Teodoro": `Christian desert monk portrait, robes${SAFE_SUFFIX}`,
  "Abba Pior": `Christian desert monk portrait, robes${SAFE_SUFFIX}`,
  "Abba Or": `Christian desert monk portrait, robes${SAFE_SUFFIX}`,
  "Abba Ammoes": `Christian desert monk portrait, robes${SAFE_SUFFIX}`,
  "Abba Alónio": `Christian desert monk portrait, robes${SAFE_SUFFIX}`,
  "Abba Daniel": `Christian desert monk portrait, robes${SAFE_SUFFIX}`,
  "Abba Nau": `Christian desert monk portrait, robes${SAFE_SUFFIX}`,
  "Abba José": `Christian desert monk portrait, robes${SAFE_SUFFIX}`,
};

/** Prompt para fallback: apenas natureza, sem pessoas. */
export const NATURE_SAFE_PROMPT = `Serene landscape, mountains or forest, soft light, peaceful${LANDSCAPE_SUFFIX}`;

export function getAuthorSafePrompt(author: string): string | null {
  return AUTHOR_SAFE_PROMPTS[author] ?? null;
}
