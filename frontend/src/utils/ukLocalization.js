// Apple Eats UK - British Localization, Stoke-on-Trent Postcode Catchment & Natasha's Law Compliance
// Jurisdiction: England & Wales (Food Standards Agency, Ofcom National Numbering Plan, The Food Information Regulations 2019)

/**
 * 14 MANDATORY ALLERGENS UNDER UK NATASHA'S LAW (Food Information Regulations 2019)
 */
export const MANDATORY_ALLERGENS_14 = [
  { id: 'celery', name: 'Celery', code: 'CEL', description: 'Includes celery stalks, leaves, seeds and celeriac' },
  { id: 'gluten', name: 'Cereals containing gluten', code: 'GLU', description: 'Wheat, rye, barley, oats, spelt, khorasan' },
  { id: 'crustaceans', name: 'Crustaceans', code: 'CRU', description: 'Prawns, crabs, lobster, scampi, crayfish' },
  { id: 'eggs', name: 'Eggs', code: 'EGG', description: 'Eggs and products containing eggs' },
  { id: 'fish', name: 'Fish', code: 'FSH', description: 'Freshwater and sea fish, fish oils, gelatin' },
  { id: 'lupin', name: 'Lupin', code: 'LUP', description: 'Lupin seeds and flour in breads and pastries' },
  { id: 'milk', name: 'Milk', code: 'MLK', description: 'Cow, sheep and goat milk, butter, cheese, lactose' },
  { id: 'molluscs', name: 'Molluscs', code: 'MOL', description: 'Mussels, clams, oysters, squid, snails' },
  { id: 'mustard', name: 'Mustard', code: 'MUS', description: 'Liquid mustard, mustard powder, seeds' },
  { id: 'peanuts', name: 'Peanuts', code: 'PNT', description: 'Groundnuts, peanut butter, arachis oil' },
  { id: 'sesame', name: 'Sesame', code: 'SES', description: 'Sesame seeds, tahini, sesame oil' },
  { id: 'soya', name: 'Soybeans', code: 'SOY', description: 'Tofu, soya milk, edamame, soy protein' },
  { id: 'sulphites', name: 'Sulphur dioxide / Sulphites', code: 'SUL', description: 'Preservatives in dried fruit, wine, cider (>10mg/kg)' },
  { id: 'nuts', name: 'Tree nuts', code: 'NUT', description: 'Almonds, hazelnuts, walnuts, cashews, pecans, Brazil, pistachios' }
];

/**
 * COMPLETE STOKE-ON-TRENT POSTAL DISTRICTS (ST1 through ST12)
 */
export const STOKE_POSTCODE_DISTRICTS = [
  { code: "ST1", name: "Hanley & City Centre, Cobridge", minDelivery: 10.00, eta: "20–30 mins" },
  { code: "ST2", name: "Bentilee, Abbey Hulton, Bucknall", minDelivery: 10.00, eta: "20–30 mins" },
  { code: "ST3", name: "Longton, Meir, Blurton, Weston Coyney", minDelivery: 12.00, eta: "25–35 mins" },
  { code: "ST4", name: "Fenton, Stoke Station, Penkhull", minDelivery: 10.00, eta: "15–25 mins" },
  { code: "ST5", name: "Newcastle-under-Lyme, Keele, Silverdale", minDelivery: 10.00, eta: "20–30 mins" },
  { code: "ST6", name: "Burslem, Tunstall, Smallthorne", minDelivery: 12.00, eta: "25–35 mins" },
  { code: "ST7", name: "Kidsgrove, Talke, Alsager", minDelivery: 15.00, eta: "30–40 mins" },
  { code: "ST8", name: "Biddulph, Knypersley", minDelivery: 15.00, eta: "35–45 mins" },
  { code: "ST9", name: "Werrington, Endon, Stockton Brook", minDelivery: 15.00, eta: "30–40 mins" },
  { code: "ST10", name: "Cheadle, Alton, Tean Valley", minDelivery: 18.00, eta: "40–50 mins" },
  { code: "ST11", name: "Blythe Bridge, Forsbrook, Tean", minDelivery: 15.00, eta: "30–40 mins" },
  { code: "ST12", name: "Trentham, Barlaston", minDelivery: 15.00, eta: "30–40 mins" }
];

/**
 * ROYAL MAIL POSTCODE VALIDATION & NORMALIZATION
 */
export const UK_POSTCODE_REGEX = /^([Gg][Ii][Rr] 0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([A-Za-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9][A-Za-z]?))))\s?[0-9][A-Za-z]{2})$/;
export const STOKE_CATCHMENT_REGEX = /^ST([1-9]|1[0-2])\s*([0-9][A-Z]{2})?$/i;

export function normalizePostcode(raw) {
  if (!raw || typeof raw !== 'string') return '';
  const clean = raw.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (clean.length <= 4) return clean; // e.g. "ST1" or "ST12"
  return `${clean.slice(0, -3)} ${clean.slice(-3)}`;
}

export function validateStokePostcode(postcode) {
  if (!postcode || typeof postcode !== 'string') return false;
  const formatted = normalizePostcode(postcode);
  return STOKE_CATCHMENT_REGEX.test(formatted);
}

export function getStokePostcodeDetails(postcode) {
  if (!postcode) {
    return { isValid: false, isStokeCatchment: false, formatted: '', district: '', error: 'Postcode is required.' };
  }
  const formatted = normalizePostcode(postcode);
  const districtMatch = formatted.match(/^(ST(1[0-2]|[1-9]))(?:\s|$)/i);
  const isStokeCatchment = Boolean(districtMatch);
  const isValidUK = UK_POSTCODE_REGEX.test(formatted) || STOKE_CATCHMENT_REGEX.test(formatted);
  const district = districtMatch ? districtMatch[1].toUpperCase() : '';

  let error = null;
  if (!isValidUK) {
    error = 'Please enter a valid UK postcode (e.g. ST4 7PW).';
  } else if (!isStokeCatchment) {
    error = `Postcode ${formatted} is outside our Stoke delivery area (ST1–ST12). Switch to Collection or enter a Stoke address.`;
  }

  return { isValid: isValidUK && isStokeCatchment, isValidUK, isStokeCatchment, district, formatted, error };
}

/**
 * OFCOM COMPLIANT TELEPHONE FORMATTING & VALIDATION
 */
export const STOKE_LANDLINE_REGEX = /^(?:(?:\+44\s?1782|01782)[\s.-]?\d{3}[\s.-]?\d{3}|(?:\+44\s?1782|01782)[\s.-]?\d{6})$/;
export const UK_MOBILE_REGEX = /^(?:(?:\+44\s?7\d{3}|07\d{3})[\s.-]?\d{3}[\s.-]?\d{3}|(?:\+44\s?7\d{3}|07\d{3})[\s.-]?\d{6})$/;

export function formatUKPhone(raw) {
  if (!raw) return '';
  let digits = String(raw).replace(/[^\d+]/g, '');
  if (digits.startsWith('+44')) {
    digits = '0' + digits.slice(3);
  }
  // Stoke Landline: 01782 XXXXXX
  if (digits.startsWith('01782') && digits.length === 11) {
    return `${digits.slice(0, 5)} ${digits.slice(5)}`;
  }
  // UK Mobile: 07XXX XXXXXX
  if (digits.startsWith('07') && digits.length === 11) {
    return `${digits.slice(0, 5)} ${digits.slice(5)}`;
  }
  return raw;
}

export function validateUKPhone(phone) {
  if (!phone) return { isValid: false, type: 'unknown', error: 'Telephone number is required.' };
  const clean = String(phone).trim();
  const isStoke = STOKE_LANDLINE_REGEX.test(clean);
  const isMobile = UK_MOBILE_REGEX.test(clean);
  if (isStoke) return { isValid: true, type: 'landline', formatted: formatUKPhone(clean), error: null };
  if (isMobile) return { isValid: true, type: 'mobile', formatted: formatUKPhone(clean), error: null };
  return { isValid: false, type: 'invalid', error: 'Please enter a valid UK mobile (07...) or Stoke landline (01782...).' };
}

/**
 * BRITISH DATE & TIME FORMATTERS
 */
export const formatUKDate = (date) => new Intl.DateTimeFormat('en-GB', {
  day: '2-digit',
  month: 'short',
  year: 'numeric'
}).format(new Date(date));

export const formatUKTime12 = (date) => new Intl.DateTimeFormat('en-GB', {
  hour: 'numeric',
  minute: '2-digit',
  hour12: true
}).format(new Date(date)).toLowerCase(); // "6:53 pm"

export const formatUKTime24 = (date) => new Intl.DateTimeFormat('en-GB', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: false
}).format(new Date(date)); // "18:53"

export const NATASHAS_LAW_14_ALLERGENS = MANDATORY_ALLERGENS_14;
export { formatGBP } from './currency.js';

