import Link from 'next/link';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import { ArrowRight, ShieldCheck, FileText, Lock, Eye, CheckCircle2, ClipboardList, Server, KeyRound } from 'lucide-react';

const part11Controls = [
  { control: 'Electronic Signatures', detail: 'Every critical action requires a signed reason capture. Signatures are cryptographically bound to the record, timestamp, and user identity. Cannot be copied or reused.', icon: KeyRound },
  { control: 'Immutable Audit Trail', detail: 'Every create, update, and delete operation is logged with user ID, timestamp, original value, and new value. The audit table has no UPDATE or DELETE permissions — append-only by design.', icon: Eye },
  { control: 'Access Controls', detail: 'Role-based permissions system with granular module-level access. Sessions expire on inactivity. All access events logged. MFA via Microsoft SSO (Entra ID) enforced.', icon: Lock },
  { control: 'System Access Security', detail: 'Zero-trust remote access via Cloudflare Tunnel — no open inbound ports, no VPN required. TLS 1.3 enforced. CSRF protection on all state-changing requests.', icon: Server },
  { control: 'Record Integrity', detail: 'PDFs (Device History Records, IPD packages) are SHA-256 hashed and timestamped at generation. Hash is embedded in the footer of every printed document for verification.', icon: FileText },
  { control: 'Operational System Checks', detail: 'Date/time stamps verified against system clock. User authority verified before every signature. Sequence of events maintained. Cannot pre-date or backdate records.', icon: ClipboardList },
];

const validationPhases = [
  { phase: 'IQ', name: 'Installation Qualification', desc: 'Verifies the system is installed correctly, all components are present and configured as specified, and the infrastructure meets documented requirements.', tests: 11 },
  { phase: 'OQ', name: 'Operational Qualification', desc: 'Verifies each functional requirement of the system operates as specified across normal, boundary, and exception conditions.', tests: 191 },
  { phase: 'PQ', name: 'Performance Qualification', desc: 'Verifies the system performs consistently under real production conditions across complete end-to-end workflows.', tests: 19 },
];

export default function CompliancePage() {
  return (
    <>
      <Nav />
      <main className="pt-16">
        <section className="py-24 grid-bg relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-600/8 to-transparent pointer-events-none" />
          <div className="relative max-w-7xl mx-auto px-6">
            <div className="max-w-3xl">
              <p className="text-emerald-400 font-semibold text-sm mb-4 tracking-wide uppercase">Compliance</p>
              <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
                FDA 21 CFR Part 11 isn&apos;t a checkbox. <span className="text-gradient-green">It&apos;s how we ship.</span>
              </h1>
              <p className="text-xl text-slate-400 leading-relaxed mb-8">
                MESvantage was designed under FDA 21 CFR Part 11 requirements from the first line of code. Every electronic record, every signature, every audit trail entry was implemented to satisfy a real regulatory requirement — not retrofitted to pass a checklist.
              </p>
              <Link href="/about#demo" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-400 text-white font-semibold rounded-xl transition-all">
                Request Validation Package <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>

        <section className="py-10 bg-[#060E1C] border-y border-white/5">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-wrap items-center justify-center gap-8">
              {[
                { label: 'FDA 21 CFR Part 11', sub: 'Electronic Records & Signatures' },
                { label: 'ISO 13485:2016', sub: 'Medical Devices QMS' },
                { label: 'IQ/OQ/PQ', sub: '221 tests · 100% pass rate' },
                { label: 'ISO 13485 Validated', sub: 'At live customer site' },
              ].map(({ label, sub }) => (
                <div key={label} className="flex items-center gap-3">
                  <ShieldCheck size={18} className="text-emerald-400 flex-shrink-0" />
                  <div>
                    <div className="text-white text-sm font-semibold">{label}</div>
                    <div className="text-slate-500 text-xs">{sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 grid-bg">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">21 CFR Part 11 Technical Controls</h2>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto">Every Part 11 control is implemented at the platform level — available to every module, every customer, without additional configuration.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {part11Controls.map(({ control, detail, icon: Icon }) => (
                <div key={control} className="p-6 rounded-2xl border border-white/8 bg-[#0D1B2E]">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-4"><Icon size={18} className="text-emerald-400" /></div>
                  <h3 className="text-white font-bold text-base mb-2">{control}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 bg-[#060E1C]">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Validation: IQ / OQ / PQ</h2>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto">Full validation was executed at Croom Medical — a live ISO 13485 certified, FDA-regulated orthopaedic CDMO. The validation package is transferable to every new customer deployment.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6 mb-10">
              {validationPhases.map(({ phase, name, desc, tests }) => (
                <div key={phase} className="p-8 rounded-2xl border border-emerald-500/20 bg-emerald-500/5">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-4xl font-extrabold text-emerald-400">{phase}</span>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold">PASS</span>
                  </div>
                  <h3 className="text-white font-bold text-lg mb-3">{name}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-4">{desc}</p>
                  <div className="text-slate-300 text-sm font-medium"><span className="text-white text-xl font-bold">{tests}</span> test cases executed</div>
                </div>
              ))}
            </div>
            <div className="p-6 rounded-xl border border-white/8 bg-[#0D1B2E] text-center">
              <p className="text-slate-400 text-sm max-w-2xl mx-auto">
                <span className="text-white font-semibold">221 total test cases. 100% pass rate.</span>{' '}
                3 documented deviations, all formally closed with impact assessment. Validation documentation available for review under NDA during the sales process.
              </p>
            </div>
          </div>
        </section>

        <section className="py-24 grid-bg">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">ISO 13485 Alignment</h2>
                <p className="text-slate-400 text-lg leading-relaxed mb-8">MESvantage was designed and operated inside an ISO 13485:2016 certified QMS. The system directly supports the production, measurement, and monitoring requirements of clause 7.</p>
                <ul className="space-y-3">
                  {[
                    'Clause 4.2 — Document and record control (DHR, audit trail)',
                    'Clause 7.4 — Purchasing control (incoming inspection)',
                    'Clause 7.5 — Production and service control (work orders, IPD, graduation)',
                    'Clause 7.6 — Control of monitoring and measuring equipment (CMM, metrology)',
                    'Clause 8.2 — Monitoring and measurement (OEE, FPY, SPC)',
                    'Clause 8.3 — Control of non-conforming product (NCR, holds)',
                    'Clause 8.5 — Improvement (CAPA tracking, customer quality portal)',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-slate-300 text-sm">
                      <CheckCircle2 size={15} className="text-emerald-400 flex-shrink-0 mt-0.5" />{item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-8 rounded-2xl border border-white/8 bg-[#0D1B2E]">
                <h3 className="text-white font-bold text-xl mb-6">Validation Package Included</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">Every new customer deployment ships with a complete validation documentation package:</p>
                <ul className="space-y-3">
                  {['Validation Master Plan (VMP)', 'User Requirements Specification (URS)', 'Functional Requirements Specification (FRS)', 'IQ Protocol + Executed Report', 'OQ Protocol + Executed Report (191 tests)', 'PQ Protocol + Executed Report', 'Traceability Matrix (requirements → test cases)', 'Deviation Log with impact assessments', 'Validation Summary Report'].map((doc) => (
                    <li key={doc} className="flex items-center gap-3 text-slate-300 text-sm">
                      <FileText size={14} className="text-blue-400 flex-shrink-0" />{doc}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 pt-6 border-t border-white/8">
                  <p className="text-slate-500 text-xs">Delivered as part of the onboarding and implementation package. Customer site execution and sign-off is included in the implementation fee.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-[#060E1C]">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Talk to a CDMO that has been through your audit.</h2>
            <p className="text-slate-400 text-lg mb-8">We know what FDA and ISO 13485 auditors ask for. We built the system to answer those questions before they&apos;re asked.</p>
            <Link href="/about#demo" className="inline-flex items-center gap-2 px-8 py-4 bg-blue-500 hover:bg-blue-400 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-500/20">
              Book a 20-Minute Demo <ArrowRight size={18} />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
