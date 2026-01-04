export const parseLocalizedNumber = (raw: string): number | null => {
  if (!raw) return null;

  // accepte virgule ou point
  const normalized = raw.replace(",", ".");

  // autorise uniquement chiffres + 1 point
  if (!/^\d*\.?\d*$/.test(normalized)) return null;

  const value = Number(normalized);
  return isNaN(value) ? null : value;
};
