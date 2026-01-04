export function formatNumber(
  value: number,
  options?: {
    maxDecimals?: number;
    scientificMin?: number;
    scientificMax?: number;
  }
) {
  const {
    maxDecimals = 6,
    scientificMin = 1e-6,
    scientificMax = 1e9,
  } = options || {};

  if (value === 0) return "0";

  const abs = Math.abs(value);

  if (abs < scientificMin || abs >= scientificMax) {
    const exponent = Math.floor(Math.log10(abs));
    const mantissa = value / Math.pow(10, exponent);

    return `${mantissa.toFixed(3)
  .replace(/\.?0+$/, "")} × 10${formatExponent(exponent)}`;
  }


  return value
    .toFixed(maxDecimals)
    .replace(/\.?0+$/, ""); 
}

function formatExponent(exp: number) {
  const superscripts: Record<string, string> = {
    "-": "⁻",
    "0": "⁰",
    "1": "¹",
    "2": "²",
    "3": "³",
    "4": "⁴",
    "5": "⁵",
    "6": "⁶",
    "7": "⁷",
    "8": "⁸",
    "9": "⁹",
  };

  return exp
    .toString()
    .split("")
    .map((c) => superscripts[c] || c)
    .join("");
}
