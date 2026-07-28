#!/usr/bin/env node
/**
 * Keeps the statutory-details gap visible.
 *
 * Section 151 of the Companies Act 2014 requires an Irish company's websites to carry its
 * registered number and registered office. src/data/company.ts holds them and they are empty,
 * so the footer omits the line rather than printing a guess.
 *
 * This warns rather than fails: blocking every deploy on a detail only Patrick can supply
 * would mean the first person to hit it disables the check. It is loud, it names the file,
 * and it is the last thing printed by the build.
 */
import { readFileSync } from 'node:fs';

const src = readFileSync(new URL('../src/data/company.ts', import.meta.url), 'utf8');
const read = (key) => (src.match(new RegExp(`${key}:\\s*'([^']*)'`)) ?? [, ''])[1];

const missing = [
  ['registrationNumber', 'CRO registered number'],
  ['registeredOffice', 'registered office address'],
].filter(([key]) => read(key).length === 0);

if (missing.length === 0) {
  console.log('✓ statutory company details present — footer renders the s.151 line');
  process.exit(0);
}

const list = missing.map(([, label]) => label).join(' and the ');
console.warn('');
console.warn('⚠ STATUTORY DETAILS MISSING — the footer is omitting the Companies Act line.');
console.warn(`  Missing: the ${list}.`);
console.warn('  Fill in src/data/company.ts and the footer renders it automatically.');
console.warn('');
console.warn('  Section 151 of the Companies Act 2014 requires an Irish company to state its');
console.warn('  registered number and registered office on its websites. This is left blank');
console.warn('  rather than guessed: a wrong number is a false statement of a filed fact, and');
console.warn('  it is checkable against the CRO register in about fifteen seconds — which is');
console.warn('  exactly why a procurement reviewer checks it.');
console.warn('');
