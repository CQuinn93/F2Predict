// Country code to flag emoji mapping
export const getCountryFlag = (countryCode: string): string => {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
};

// Common country codes mapping
export const countryNames: Record<string, string> = {
  US: 'USA',
  MX: 'Mexico',
  GB: 'United Kingdom',
  FR: 'France',
  DE: 'Germany',
  ES: 'Spain',
  IT: 'Italy',
  BR: 'Brazil',
  AR: 'Argentina',
  JP: 'Japan',
  KR: 'South Korea',
  AU: 'Australia',
  CA: 'Canada',
  NL: 'Netherlands',
  BE: 'Belgium',
  PT: 'Portugal',
  RU: 'Russia',
  SA: 'Saudi Arabia',
  EG: 'Egypt',
  NG: 'Nigeria',
  ZA: 'South Africa',
  CN: 'China',
  IN: 'India',
};
