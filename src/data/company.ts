/**
 * Statutory company details.
 *
 * Section 151 of the Companies Act 2014 requires an Irish company to state its registered
 * name, its place of registration, its registration number and its registered office address
 * on its websites. The site currently states the first two and not the last two.
 *
 * These are deliberately EMPTY rather than guessed. A wrong registration number on a public
 * website is worse than an absent one — it is a false statement of a filed fact, and it is the
 * kind of detail a procurement or legal reviewer checks against the CRO register precisely
 * because it is trivially checkable.
 *
 * Fill both in and the footer renders the statutory line automatically. Until then the build
 * prints a warning (scripts/check-company.mjs) so the gap stays visible instead of settling in.
 */
export const company = {
  legalName: 'MESvantage Limited',
  placeOfRegistration: 'Ireland',

  /** CRO number, digits only, e.g. '123456'. */
  registrationNumber: '',

  /** Registered office, single line, e.g. 'Unit 1, Somewhere Business Park, Co. Limerick, V94 XXXX'. */
  registeredOffice: '',

  email: 'hello@mesvantage.com',
  securityEmail: 'security@mesvantage.com',
} as const;

export const hasStatutoryDetails =
  company.registrationNumber.length > 0 && company.registeredOffice.length > 0;
