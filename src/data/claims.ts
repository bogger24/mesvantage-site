/**
 * The claims register.
 *
 * Every factual assertion on this site lives here exactly once, with its source, its method,
 * who verified it and when. Pages import claims; pages never hardcode a number.
 *
 * This exists because the site previously shipped four unsourced outcome claims
 * (90d / ~70% / ~75% / €0), one of which was false, and a hero that said "three weeks to four
 * days" (~81%) while the band two sections below said "~70%". Both were written in good faith.
 * Neither could survive a hostile reader, and nothing in the codebase stopped them.
 *
 * The rule, enforced by scripts/check-claims.mjs at build time:
 *   a statistic rendered outside an <Evidence> wrapper fails the build.
 *
 * Adding a claim is deliberately tedious. That is the point.
 */

/** How much weight a claim carries, and what it must therefore disclose. */
export type EvidenceToken =
  /** Measured at the founding customer. Must state metric, period, method, and who signed it off. */
  | 'MEASURED'
  /** From the validation record. Must state scope and date, and carry the point-in-time caveat. */
  | 'VALIDATED'
  /** External or third-party. Must carry publisher, date, and a live link. */
  | 'SOURCED'
  /** Our own estimate. Must expose inputs and be labelled illustrative. */
  | 'MODELLED'
  /** Not shipped. Must say "not yet available" and name a target. */
  | 'ROADMAP';

export type ClaimStatus =
  /** Evidence artefact exists and has been checked. Safe to publish. */
  | 'verified'
  /** Believed true, evidence artefact not yet produced. Publishable only if the wording is hedged. */
  | 'needs-evidence'
  /** Explicitly retired. Kept here so nobody reinstates it without reading why. */
  | 'retired';

export interface Claim {
  id: string;
  /** What renders. Keep it a count wherever possible — a reader can argue with a percentage. */
  value: string;
  label: string;
  context?: string;
  token: EvidenceToken;
  status: ClaimStatus;
  /** The full defensible sentence. If this cannot be written, the claim cannot be published. */
  statement: string;
  source: string;
  method?: string;
  caveat?: string;
  verifiedOn?: string;
  verifiedBy?: string;
  /** For retired claims: why it was removed, so the reasoning outlives the person who removed it. */
  retiredReason?: string;
}

export const claims = {
  'plant-volume': {
    id: 'plant-volume',
    value: '250,000',
    label: 'Knee systems a year',
    context: 'The plant it was built in',
    token: 'MEASURED',
    status: 'needs-evidence',
    statement:
      'MESvantage was built inside, and is in daily use at, an orthopaedic contract manufacturer producing approximately 250,000 knee systems a year.',
    source: 'Croom Medical annual production volume.',
    method: 'Annual unit output for the knee product family.',
    caveat:
      'Needs a dated figure and a named person at Croom to stand behind it before it is presented as precise.',
  },

  'module-count': {
    id: 'module-count',
    value: '74',
    label: 'Modules',
    context: 'Across seven domains',
    token: 'MEASURED',
    status: 'verified',
    statement:
      'The product has 74 feature modules across seven domains: Operations, Quality, Supply Chain, Intelligence, Communications, People and Admin.',
    source: 'Feature directory count in the MES client, packages/client/src/features.',
    method: 'Directory count, cross-checked against the route table and the sidebar navigation.',
    caveat:
      'Counts what is built, not what is live at any one customer. Per-module status is shown on the platform page.',
    verifiedOn: '2026-07-27',
    verifiedBy: 'Patrick Byrnes',
  },

  'validation-tests': {
    id: 'validation-tests',
    value: '226 / 226',
    label: 'Test cases passed',
    context: 'Validation exercise, March 2026',
    token: 'VALIDATED',
    status: 'needs-evidence',
    statement:
      'In March 2026 a formal validation exercise was executed for MESvantage at our founding customer’s site: 226 of 226 test cases executed and passed.',
    source: 'Validation Summary Report, March 2026.',
    caveat:
      'Point-in-time qualification of that configuration. The system deploys continuously, so this must always be published alongside the change-control statement.',
  },

  'validation-rtm': {
    id: 'validation-rtm',
    value: '175 / 175',
    label: 'Requirements traced',
    context: 'In the traceability matrix',
    token: 'VALIDATED',
    status: 'needs-evidence',
    statement:
      'All 175 requirements were traced in the requirements traceability matrix for that exercise.',
    source: 'Requirements Traceability Matrix, March 2026.',
    caveat: 'Same point-in-time caveat as the test-case count.',
  },

  'ortho-vendor-count': {
    id: 'ortho-vendor-count',
    value: '0',
    label: 'Vendors with an ortho reference',
    context: 'Other than us — see method',
    token: 'SOURCED',
    status: 'verified',
    statement:
      'We are not aware of another MES vendor with a named orthopaedic implant machining customer.',
    source:
      'Internal 18-vendor MES benchmark, July 2026, drawing on approximately 300 sources.',
    method:
      'Eighteen platforms reviewed against thirty dimensions. Named reference customers checked for orthopaedic implant machining specifically. Straumann on Apriso is dental; Integer on Critical Manufacturing is cardiac and vascular.',
    caveat:
      'An absence-of-evidence claim, and we say so. Always published with the invitation: if you can name one, tell us and we will publish it here.',
    verifiedOn: '2026-07-27',
    verifiedBy: 'Patrick Byrnes',
  },

  'price-essential': {
    id: 'price-essential',
    value: '€32,000',
    label: 'Essential, per site per year',
    token: 'MODELLED',
    status: 'verified',
    statement: 'Essential tier list price is €32,000 per site per year.',
    source: 'MESvantage price list.',
    caveat: 'List price. Per site, not per user. Design-partner terms are available.',
    verifiedOn: '2026-07-27',
    verifiedBy: 'Patrick Byrnes',
  },

  'price-professional': {
    id: 'price-professional',
    value: '€58,000',
    label: 'Professional, per site per year',
    token: 'MODELLED',
    status: 'verified',
    statement: 'Professional tier list price is €58,000 per site per year.',
    source: 'MESvantage price list.',
    caveat: 'List price. Per site, not per user. Design-partner terms are available.',
    verifiedOn: '2026-07-27',
    verifiedBy: 'Patrick Byrnes',
  },

  'price-enterprise': {
    id: 'price-enterprise',
    value: '€95,000',
    label: 'Enterprise, per site per year',
    token: 'MODELLED',
    status: 'verified',
    statement: 'Enterprise tier list price is €95,000 per site per year.',
    source: 'MESvantage price list.',
    caveat: 'List price. Per site, not per user. Design-partner terms are available.',
    verifiedOn: '2026-07-27',
    verifiedBy: 'Patrick Byrnes',
  },

  'implementation-fee': {
    id: 'implementation-fee',
    value: '€12,000–€35,000',
    label: 'One-time implementation',
    token: 'MODELLED',
    status: 'verified',
    statement:
      'Implementation is quoted per engagement and typically falls between €12,000 and €35,000 depending on site size.',
    source: 'MESvantage price list.',
    caveat: 'Indicative range, quoted per engagement.',
    verifiedOn: '2026-07-27',
    verifiedBy: 'Patrick Byrnes',
  },

  'time-to-live': {
    id: 'time-to-live',
    value: '10–14 weeks',
    label: 'To first signed traveller',
    token: 'MODELLED',
    status: 'needs-evidence',
    statement:
      'Our target implementation time is 10 to 14 weeks, measured from contract signature to the first electronic traveller signed in production.',
    source: 'MESvantage implementation plan.',
    caveat:
      'This is our plan, based on our own deployment. It has not yet been demonstrated at a second site, and we say so.',
  },

  // ---------------------------------------------------------------------------
  // Retired. Kept deliberately: the reasoning has to outlive the cleanup.
  // ---------------------------------------------------------------------------

  'RETIRED-validation-budget': {
    id: 'RETIRED-validation-budget',
    value: '€0',
    label: 'Validation Budget',
    token: 'MODELLED',
    status: 'retired',
    statement: 'RETIRED — was published as "€0 Validation Budget · IQ/OQ/PQ already passed".',
    source: '—',
    retiredReason:
      'False and dangerous. Under ISO 13485 §4.1.6 and the FDA QMSR, validating software for its intended use is the device manufacturer’s obligation and cannot be discharged by a supplier. Telling a regulated buyer their validation budget is zero is the claim a VP of Quality disqualifies you for, and the one a plaintiff’s lawyer reads back to you.',
  },

  'RETIRED-audit-prep': {
    id: 'RETIRED-audit-prep',
    value: '~70%',
    label: 'Faster Audit Prep',
    token: 'MEASURED',
    status: 'retired',
    statement:
      'RETIRED — was published as "~70% Faster Audit Prep" while the hero on the same page said audit prep went from three weeks to four days (~81%).',
    source: '—',
    retiredReason:
      'Neither figure was measured, so reconciling them would only have made them consistently unsourced. The replacement is a claim of kind, not magnitude, until the measurement exists: baseline QA labour hours for the two audits before go-live versus the two after, method documented and signed by Croom’s quality manager. If the measured figure turns out to be lower than the one we published, we publish the lower one.',
  },

  'RETIRED-fai-cycle': {
    id: 'RETIRED-fai-cycle',
    value: '~75%',
    label: 'FAI Cycle Reduction',
    token: 'MEASURED',
    status: 'retired',
    statement: 'RETIRED — was published as "~75% FAI Cycle Reduction".',
    source: '—',
    retiredReason:
      'Unsourced. Returns only with a defined start and end event and a measured before and after.',
  },
} as const satisfies Record<string, Claim>;

export type ClaimId = keyof typeof claims;

export function getClaim(id: ClaimId): Claim {
  return claims[id];
}

/** Claims that may appear on a public page. */
export function publishableClaims(): Claim[] {
  return Object.values(claims).filter((c) => c.status !== 'retired');
}

export function retiredClaims(): Claim[] {
  return Object.values(claims).filter((c) => c.status === 'retired');
}
