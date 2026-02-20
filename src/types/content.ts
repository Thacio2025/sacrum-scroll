export type ContentCategory = "patristic" | "scholastic" | "mystic" | "liturgy";

export interface QuoteCard {
  id: string;
  category: ContentCategory;
  author: string;
  source?: string;
  text: string;
  imageUrl?: string | null;
  imageTitle?: string;
}

export type LiturgicalSeason =
  | "ordinary"
  | "advent"
  | "christmas"
  | "lent"
  | "passion"
  | "easter";
