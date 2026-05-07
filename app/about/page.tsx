'use client';

import { useState } from 'react';
import Link from 'next/link';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import { ArrowRight, MapPin, Mail, Calendar, CheckCircle2, Factory, Building2 } from 'lucide-react';

function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [type, setType] = useState<'demo' | 'contact'>('demo');

  if (submitted) {
    return (
      <div className="p-8 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 text-center">
        <CheckCircle2 size={40} className="text-emerald-400 mx-auto mb-4" />
        <h3 className="text-white font-bold text-xl mb-2">Message received.</h3>
        <p className="text-slate-400">{type === 'demo' ? "We'll be in touch within 24 hours to arrange a time." : "We'll respond within 1 business day."}</p>
      </div>
    );
  }

  return (
    <form id="contact" className="space-y-5" onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}>
      <div className="flex gap-3 p-1 bg-white/5 rounded-xl">
        {([{ id: 'demo', label: 'Book a Demo' }, { id: 'contact', label: 'General Enquiry' }] as const).map(({ id, label }) => (
          <button key={id} type="button" onClick={() => setType(id)} className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${type === id ? 'bg-blue-500 text-white' : 'text-slate-400 hover:text-white'}`}>{label}</button>
        ))}
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-slate-400 text-xs font-medium mb-1.5">Your name</label>
          <input required type="text" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-blue-500/60 transition-colors" placeholder="Patrick Byrnes" />
        </div>
        <div>
          <label className="block text-slate-400 text-xs font-medium mb-1.5">Email address</label>
          <input required type="email" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-blue-500/60 transition-colors" placeholder="you@company.com" />
        </div>
      </div>
      <div>
        <label className="block text-slate-400 text-xs font-medium mb-1.5">Company</label>
        <input required type="text" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-blue-500/60 transition-colors" placeholder="Acme Medical CDMO Ltd" />
      </div>
      {type === 'demo' && (
        <div>
          <label className="block text-slate-400 text-xs font-medium mb-1.5">Company size</label>
          <select className="w-full px-4 py-3 rounded-xl bg-[#0D1B2E] border border-white/10 text-slate-300 text-sm focus:outline-none focus:border-blue-500/60 transition-colors">
            <option value="">Select…</option>
            <option>Under 50 employees</option>
            <option>50–100 employees</option>
            <option>100–250 employees</option>
            <option>250–500 employees</option>
            <option>500+ employees</option>
          </select>
        </div>
      )}
      <div>
        <label className="block text-slate-400 text-xs font-medium mb-1.5">{type === 'demo' ? 'What are you currently using for production tracking?' : 'Your message'}</label>
        <textarea rows={4} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-blue-500/60 transition-colors resize-none" placeholder={type === 'demo' ? 'Spreadsheets, legacy MES, nothing yet…' : 'Tell us what you need…'} />
      </div>
      <button type="submit" className="w-full py-4 bg-blue-500 hover:bg-blue-400 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20">
        {type === 'demo' ? 'Request a Demo' : 'Send Message'} <ArrowRight size={18} />
      </button>
      <p className="text-slate-600 text-xs text-center">No CRM. No drip campaign. A human will reply.</p>
    </form>
  );
}

export default function AboutPage() {
  return (
    <>
      <Nav />
      <main className="pt-16">
        <section className="py-24 grid-bg relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-violet-600/8 to-transparent pointer-events-none" />
          <div className="relative max-w-7xl mx-auto px-6">
            <div className="max-w-3xl">
              <p className="text-violet-400 font-semibold text-sm mb-4 tracking-wide uppercase">About MESvantage</p>
              <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight">Built by a CDMO CEO who couldn&apos;t find what he needed.</h1>
              <p className="text-xl text-slate-400 leading-relaxed">MESvantage didn&apos;t start as a software company. It started as a manufacturing problem.</p>
            </div>
          </div>
        </section>

        <section className="py-24 bg-[#060E1C]">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <div className="w-16 h-16 rounded-2xl bg-blue-500/15 flex items-center justify-center mb-8"><Factory size={28} className="text-blue-400" /></div>
                <h2 className="text-3xl font-bold text-white mb-6">The founding story</h2>
                <div className="space-y-4 text-slate-400 text-lg leading-relaxed">
                  <p>Croom Medical manufactures 250,000 orthopaedic knee systems per year in County Limerick, Ireland. We run ISO 13485, we operate under FDA 21 CFR Part 11, and we supply the world&apos;s largest orthopaedic OEMs.</p>
                  <p>When I looked for an MES for our environment, the options were: a €200k enterprise system designed for Fortune 500 companies, a no-code platform that required us to build our own MES from scratch, or spreadsheets. None of those was acceptable.</p>
                  <p>So we built it ourselves. Over two years, running live in our own production environment — validated, FDA-auditable, with 50+ modules covering everything from CMM auto-population to AI executive briefings.</p>
                  <p className="text-slate-300 font-medium">Then we realised: every other CDMO in the world has the same problem. MESvantage is the answer we built for ourselves, now available to you.</p>
                </div>
                <div className="mt-8 pt-8 border-t border-white/8">
                  <div className="text-white font-bold text-lg">Patrick Byrnes</div>
                  <div className="text-slate-500 text-sm">CEO — Croom Medical & MESvantage Limited</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Founded', value: '2026', sub: 'MESvantage Limited, Ireland' },
                  { label: 'Validated', value: '2026', sub: 'IQ/OQ/PQ at Croom Medical' },
                  { label: 'Customer #1', value: 'Live', sub: '250k knees/yr, FDA regulated' },
                  { label: 'Modules', value: '50+', sub: 'All production-proven' },
                ].map(({ label, value, sub }) => (
                  <div key={label} className="p-6 rounded-xl border border-white/8 bg-[#0D1B2E]">
                    <div className="text-slate-500 text-xs mb-1">{label}</div>
                    <div className="text-2xl font-extrabold text-white mb-1">{value}</div>
                    <div className="text-slate-500 text-xs">{sub}</div>
                  </div>
                ))}
                <div className="col-span-2 p-6 rounded-xl border border-white/8 bg-[#0D1B2E]">
                  <div className="flex items-start gap-3">
                    <MapPin size={16} className="text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-white font-semibold text-sm mb-1">MESvantage Limited</div>
                      <div className="text-slate-500 text-xs">County Limerick, Ireland</div>
                      <div className="text-slate-500 text-xs">Registered at Companies Registration Office (CRO)</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-[#060E1C]">
          <div className="max-w-4xl mx-auto px-6">
            <div className="p-8 rounded-2xl border border-amber-500/20 bg-amber-500/5">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-500/15 flex items-center justify-center flex-shrink-0"><Building2 size={22} className="text-amber-400" /></div>
                <div>
                  <h3 className="text-white font-bold text-xl mb-3">Croom Medical — Founding Customer</h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-4">Croom Medical holds a Founding Customer Agreement with MESvantage Limited — a permanent rate in exchange for commercial support: case study rights, warm introductions to qualifying CDMOs, and Product Advisory Board participation.</p>
                  <div className="flex flex-wrap gap-3">
                    {['Permanent founding rate', '3% annual inflation cap', '3–5 warm intros/year', 'First access to new modules'].map((item) => (
                      <span key={item} className="flex items-center gap-1.5 text-amber-400/80 text-xs"><CheckCircle2 size={12} />{item}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="demo" className="py-24 grid-bg">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-start">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Book a 20-minute demo.</h2>
                <p className="text-slate-400 text-lg leading-relaxed mb-8">You&apos;ll be talking to Patrick — the CEO who built it and runs it in production. Not a sales rep. Not a pre-sales engineer reading slides. The live system, 20 minutes, no pressure.</p>
                <div className="space-y-4">
                  {[
                    { icon: Calendar, text: '20 minutes via Google Meet or Microsoft Teams' },
                    { icon: Factory, text: 'Live production system at 250,000 knee systems/year' },
                    { icon: CheckCircle2, text: 'No sales pipeline. No follow-up unless you ask.' },
                    { icon: Mail, text: 'Response within 24 hours guaranteed' },
                  ].map(({ icon: Icon, text }) => (
                    <div key={text} className="flex items-center gap-3 text-slate-300 text-sm">
                      <Icon size={16} className="text-blue-400 flex-shrink-0" />{text}
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-8 rounded-2xl border border-white/8 bg-[#0D1B2E]">
                <ContactForm />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
