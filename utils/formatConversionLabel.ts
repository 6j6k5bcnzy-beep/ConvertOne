import { translations } from "../constants/i18n";

export const formatConversionLabel = (
  key: string,
  lang: "fr" | "en"
) => {
  const [from, to] = key.split("_to_");
  const t = translations[lang];

  if (!from || !to) return key;

  const fromLabel = t.units[from] ?? from;
  const toLabel = t.units[to] ?? to;

  return `${fromLabel} → ${toLabel}`;
};
