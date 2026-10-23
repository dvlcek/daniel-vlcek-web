// Fill from the operator's confirmed registration and contracts, then review
// the notices before setting reviewed to true. The public brand is not a legal name.
export const legalDetails: {
  reviewed: boolean;
  jurisdiction: "SK" | "AT" | null;
  legalName: string | null;
  legalForm: string | null;
  address: string | null;
  residenceAddress: string | null;
  businessId: string | null;
  registrationNumber: string | null;
  registerAndCourt: string | null;
  taxId: string | null;
  vatId: string | null;
  vatRegistration: string | null;
  phone: string | null;
  supervisoryAuthority: string | null;
  chamber: string | null;
  professionalRules: string | null;
  retentionPolicy: string | null;
  hostingAndDatabase: string | null;
  transferSafeguards: string | null;
  registrySource: string | null;
  registryVerifiedAt: string | null;
  taxSource: string | null;
  vatSource: string | null;
} = {
  reviewed: false,
  jurisdiction: "SK",
  legalName: "VLKO Ventures s. r. o.",
  legalForm: "Spoločnosť s ručením obmedzeným",
  address: "Karpatské námestie 7770/10A\n831 06 Bratislava – mestská časť Rača\nSlovenská republika",
  residenceAddress: null,
  businessId: "57790647",
  registrationNumber: "Oddiel Sro, vložka č. 202436/B",
  registerAndCourt: "Obchodný register Mestského súdu Bratislava III",
  taxId: "2123125521",
  vatId: "SK2123125521",
  vatRegistration: "Registered under § 7a of the Slovak VAT Act since 24 August 2026.",
  phone: null,
  supervisoryAuthority: "Slovenská obchodná inšpekcia\nInšpektorát SOI pre Bratislavský kraj\nBajkalská 21/A, P. O. BOX č. 5\n820 07 Bratislava",
  chamber: null,
  professionalRules: null,
  retentionPolicy: null,
  hostingAndDatabase: null,
  transferSafeguards: null,
  registrySource: "https://www.orsr.sk/vypis.asp?ID=771082&SID=2&P=0",
  registryVerifiedAt: "2026-10-03",
  taxSource: "https://report.financnasprava.sk/ds_dsrdp.zip",
  vatSource: "https://report.financnasprava.sk/ds_dphs.zip",
};

export const legalContactEmail = "hello@danielvlko.com";
