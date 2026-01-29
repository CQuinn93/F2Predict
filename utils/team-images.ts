// Team image mappings - maps country codes to asset image paths
// Handles naming variations in asset files

export const getTeamImage = (countryCode: string): any => {
  const imageMap: Record<string, any> = {
    // Main teams
    US: require('@/assets/images/USA.svg'),
    CA: require('@/assets/images/Canada.svg'),
    MX: require('@/assets/images/Mexico.svg'),
    BR: require('@/assets/images/Brazil.svg'),
    AR: require('@/assets/images/Argentina.svg'),
    FR: require('@/assets/images/France.svg'),
    DE: require('@/assets/images/Germany.svg'),
    ES: require('@/assets/images/Spain.svg'),
    IT: require('@/assets/images/Italy.svg'),
    NL: require('@/assets/images/Netherlands.svg'),
    BE: require('@/assets/images/Belgium.svg'),
    PT: require('@/assets/images/Portugal.svg'),
    GB: require('@/assets/images/England.svg'),
    SC: require('@/assets/images/Scotland.svg'),
    HR: require('@/assets/images/Croatia.svg'),
    AT: require('@/assets/images/Austria.svg'),
    CH: require('@/assets/images/Switzerland.svg'),
    DK: require('@/assets/images/Denmark.svg'),
    NO: require('@/assets/images/Norway.svg'),
    SE: require('@/assets/images/Sweden.svg'),
    PL: require('@/assets/images/Poland.svg'),
    // AFC teams
    JP: require('@/assets/images/Japan.svg'),
    KR: require('@/assets/images/South Korea.svg'),
    SA: require('@/assets/images/Saudi Arabia.svg'),
    AU: require('@/assets/images/Australia.svg'),
    IR: require('@/assets/images/Iran.svg'),
    QA: require('@/assets/images/Qatar.svg'),
    JO: require('@/assets/images/Jordan.svg'),
    UZ: require('@/assets/images/Uzbekistan.svg'),
    // CAF teams
    SN: require('@/assets/images/Senegal.svg'),
    MA: require('@/assets/images/Morroco.svg'), // Note: typo in filename
    EG: require('@/assets/images/Egypt.svg'),
    NG: require('@/assets/images/South Africa.svg'), // May need Nigeria specific
    GH: require('@/assets/images/Ghana.svg'),
    TN: require('@/assets/images/Tunisia.svg'),
    CI: require('@/assets/images/Ivory Coast.svg'),
    DZ: require('@/assets/images/Algeria.svg'),
    ZA: require('@/assets/images/South Africa.svg'),
    CV: require('@/assets/images/Cape Verde.svg'),
    // CONCACAF teams
    JM: require('@/assets/images/Jamaica.svg'),
    CR: require('@/assets/images/USA.svg'), // May need Costa Rica specific
    HT: require('@/assets/images/Haiti.svg'),
    PA: require('@/assets/images/Panama.svg'),
    CW: require('@/assets/images/Curacao.svg'),
    // CONMEBOL teams
    UY: require('@/assets/images/Uruguay.svg'),
    CL: require('@/assets/images/USA.svg'), // May need Chile specific
    CO: require('@/assets/images/Colombia.svg'),
    EC: require('@/assets/images/Ecuador.svg'),
    PY: require('@/assets/images/Paraguay.svg'),
    PE: require('@/assets/images/USA.svg'), // May need Peru specific
    // OFC teams
    NZ: require('@/assets/images/New Zeland.svg'), // Note: typo in filename
    // Placeholder teams
    TBD_UEFA_A: require('@/assets/images/USA.svg'), // Placeholder
    TBD_UEFA_B: require('@/assets/images/USA.svg'), // Placeholder
    TBD_UEFA_C: require('@/assets/images/USA.svg'), // Placeholder
    TBD_UEFA_D: require('@/assets/images/USA.svg'), // Placeholder
    TBD_IC_2: require('@/assets/images/USA.svg'), // Placeholder
    TBD_PLAYOFF_1: require('@/assets/images/USA.svg'), // Placeholder
  };

  return imageMap[countryCode] || require('@/assets/images/USA.svg'); // Default fallback
};
