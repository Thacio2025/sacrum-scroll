import type { LiturgicalSeason } from "@/types/content";

/**
 * Aproximação simples do tempo litúrgico pela data.
 * Para produção, considere integrar uma API de calendário litúrgico.
 */
export function getLiturgicalSeason(date: Date = new Date()): LiturgicalSeason {
  const month = date.getMonth();
  const day = date.getDate();
  const year = date.getFullYear();

  // Advento: 4º domingo antes do Natal até 24 dez
  // Simplificado: dezembro até dia 24
  if (month === 11 && day <= 24) return "advent";

  // Tempo do Natal: 25 dez até Batismo do Senhor (domingo após Epifania)
  if (month === 11 && day >= 25) return "christmas";
  if (month === 0 && day <= 6) return "christmas";

  // Quaresma: Quarta-feira de Cinzas até Quinta-feira Santa (aproximado por datas móveis)
  const easter = getEasterSunday(year);
  const ashWednesday = addDays(easter, -46);
  const holyThursday = addDays(easter, -3);
  if (date >= ashWednesday && date < holyThursday) return "lent";

  // Paixão: Semana Santa
  const passionSunday = addDays(easter, -7);
  if (date >= passionSunday && date < easter) return "passion";

  // Páscoa: domingo de Páscoa até Pentecostes (50 dias)
  const pentecost = addDays(easter, 49);
  if (date >= easter && date <= pentecost) return "easter";

  return "ordinary";
}

function getEasterSunday(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31) - 1;
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month, day);
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}
