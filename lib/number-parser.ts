export function parseAbbreviatedNumber(value: string | number): number {
  if (typeof value === 'number') return value;

  const normalized = value.trim().toUpperCase();
  const match = normalized.match(/^([\d.]+)([KM]?)$/);

  if (!match) throw new Error(`Invalid number format: ${value}`);

  const num = parseFloat(match[1]);
  const suffix = match[2];

  switch (suffix) {
    case 'K':
      return num * 1_000;
    case 'M':
      return num * 1_000_000;
    default:
      return num;
  }
}
