import Link from 'next/link';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import { ArrowRight, CheckCircle2, Building2 } from 'lucide-react';

const tiers = [
  {
    name: 'Essential', price: '€32,000', period: 'per site / per year', highlight: false,
    desc: 'Core production and quality operations for CDMOs moving off spreadsheets.',
    modules: ['Quality (FAI, FPY, NCR, Incoming Inspection)', 'Production (Work Orders, OEE, Scheduling)', 'Standard Times', 'Training Enforcement', 'Mobile PWA', 'Electronic Signatures & Audit Trail', 'Role-Based Access Control', 'M1 ERP Integration (read)'],
  },
  {
    name: 'Professional', price: '€58,000', period: 'per site / per year', highlight: true, badge: 'Most Popular',
    desc: 'Full platform for CDMOs running CMM metrology, customer quality portals, and advanced analytics.',
    modules: ['Everything in Essential, plus:', 'Metrology & CMM Auto-Population', 'AI Drawing Parser', 'Energy Intelligence', 'Customer Quality Portal', 'SPC & Advanced Analytics', 'Machine Intelligence (OPC UA)', 'Device History Record (DHR)', 'In-Process Documentation (IPD)'],
  },
  {
    name: 'Enterprise', price: '€95,000', period: 'per site / per year', highlight: false,
    desc: 'Full intelligence layer for CEOs, C-Suite, and multi-site operations.',
    modules: ['Everything in Professional, plus:', 'CEO Intelligence Dashboard', 'AI Executive Agent (MCP Server)', 'Ops Intelligence (14 sub-pages)', 'Custom ERP Integration', 'Dedicated Customer Success Manager', 'Priority support SLA (4-hour response)', 'Multi-site licensing (60–70% for additional sites)'],
  },
];

export default function PricingPage() {
  return (
    <>
      <Nav />
      <main className="pt-16">
        <section className="py-24 grid-bg relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-600/8 to-transparent pointer-events-none" />
          <div className="relative max-w-4xl mx-auto px-6 text-center">
            <p className="text-blue-400 font-semibold text-sm mb-4 tracking-wide uppercase">Pricing</p>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight">Per site. Not per user.</h1>
            <p className="text-xl text-slate-400 leading-relaxed">Your entire team is included. Pricing is per manufacturing site, per year. No seat limits. No surprise overages. Infrastructure is your data — billed transparently at ~€150–200/month per site.</p>
          </div>
        </section>

        <section className="py-16 bg-[#060E1C]">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {tiers.map(({ name, price, period, desc, highlight, badge, modules }) => (
                <div key={name} className={`relative rounded-2xl p-8 flex flex-col ${highlight ? 'border-2 border-blue-500/60 bg-blue-500/8 glow-blue' : 'border border-white/8 bg-[#0D1B2E]'}`}>
                  {badge && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                      <span className="px-4 py-1 bg-blue-500 text-white text-xs font-bold rounded-full">{badge}</span>
                    </div>
                  )}
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-white mb-1">{name}</h2>
                    <div className="text-4xl font-extrabold text-white mb-1">{price}</div>
                    <div className="text-slate-500 text-sm mb-3">{period}</div>
                    <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
                  </div>
                  <ul className="space-y-2.5 mb-8 flex-1">
                    {modules.map((mod) => (
                      <li key={mod} className={`flex items-start gap-2.5 text-sm ${mod.startsWith('Everything') ? 'text-blue-400 font-semibold' : 'text-slate-300'}`}>
                        {!mod.startsWith('Everything') && <CheckCircle2 size={14} className="text-emerald-400 flex-shrink-0 mt-0.5" />}
                        {mod}
                      </li>
                    ))}
                  </ul>
                  <Link href="/about#demo" className={`w-full py-3.5 rounded-xl text-sm font-semibold text-center transition-all block ${highlight ? 'bg-blue-500 hover:bg-blue-400 text-white shadow-lg shadow-blue-500/20' : 'border border-white/15 hover:border-white/30 text-white hover:bg-white/5'}`}>
                    Request a Quote
                  </Link>
                </div>
              ))}
            </div>
            <p className="text-center text-slate-500 text-sm mt-6">All prices in EUR. Annual subscription, billed annually. Multi-site discounts available.</p>
          </div>
        </section>

        <section className="py-24 grid-bg">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              <div>
                <h2 className="text-3xl font-bold text-white mb-4">One-time Implementation Fee</h2>
                <p className="text-slate-400 text-lg leading-relaxed mb-8">A single onboarding fee covers everything needed to be live, compliant, and operator-trained. This is not a consulting engagement — it is a fixed-price delivery with defined outcomes.</p>
                <div className="space-y-3">
                  {[{ size: '< 100 employees', fee: '€12,000' }, { size: '100–250 employees', fee: '€20,000' }, { size: '250–500 employees', fee: '€35,000' }].map(({ size, fee }) => (
                    <div key={size} className="flex items-center justify-between p-4 rounded-xl border border-white/8 bg-[#0D1B2E]">
                      <span className="text-slate-300 text-sm">{size}</span>
                      <span className="text-white font-bold">{fee}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-8 rounded-2xl border border-white/8 bg-[#0D1B2E]">
                <h3 className="text-white font-bold text-xl mb-6">What&apos;s included</h3>
                <ul className="space-y-3">
                  {['Infrastructure provisioning (Docker, cloud, networking)', 'Data migration from existing system or spreadsheets', 'Staff training — operators, supervisors, QA team', 'Full IQ/OQ/PQ validation execution at your site', 'Validation Summary Report signed by MESvantage', 'Go-live support (minimum 2 weeks)'].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-slate-300 text-sm">
                      <CheckCircle2 size={15} className="text-emerald-400 flex-shrink-0 mt-0.5" />{item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 bg-[#060E1C]">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">Infrastructure transparency</h2>
              <p className="text-slate-400 text-lg">Your deployment is isolated. You know exactly what it costs to run.</p>
            </div>
            <div className="rounded-2xl border border-white/8 bg-[#0D1B2E] overflow-hidden">
              <table className="w-full text-sm">
                <thead className="border-b border-white/8">
                  <tr>
                    <th className="text-left py-3 px-6 text-slate-400 font-medium">Component</th>
                    <th className="text-left py-3 px-6 text-slate-400 font-medium">Spec</th>
                    <th className="text-right py-3 px-6 text-slate-400 font-medium">Monthly cost</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { component: 'Compute', spec: 'API server + Nginx (t3.medium)', cost: '~€35' },
                    { component: 'Database', spec: 'RDS PostgreSQL (db.t3.medium)', cost: '~€60' },
                    { component: 'Cache', spec: 'ElastiCache Redis (cache.t3.micro)', cost: '~€20' },
                    { component: 'Storage & Backups', spec: 'S3, nightly, 30-day retention', cost: '~€20' },
                  ].map(({ component, spec, cost }, i) => (
                    <tr key={component} className={`border-b border-white/5 ${i % 2 === 0 ? '' : 'bg-white/[0.02]'}`}>
                      <td className="py-3.5 px-6 text-white font-medium">{component}</td>
                      <td className="py-3.5 px-6 text-slate-400">{spec}</td>
                      <td className="py-3.5 px-6 text-slate-300 text-right">{cost}</td>
                    </tr>
                  ))}
                  <tr className="bg-white/3 font-semibold">
                    <td className="py-4 px-6 text-white">Total infrastructure</td>
                    <td className="py-4 px-6 text-slate-400">Per customer, per month</td>
                    <td className="py-4 px-6 text-emerald-400 text-right">~€135–200</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-center text-slate-500 text-sm mt-4">Infrastructure cost is included in the subscription price. You see it because transparency builds trust.</p>
          </div>
        </section>

        <section className="py-20 grid-bg">
          <div className="max-w-4xl mx-auto px-6">
            <div className="p-8 rounded-2xl border border-amber-500/20 bg-amber-500/5 flex flex-col md:flex-row gap-6 items-start">
              <div className="w-12 h-12 rounded-xl bg-amber-500/15 flex items-center justify-center flex-shrink-0"><Building2 size={22} className="text-amber-400" /></div>
              <div>
                <h3 className="text-white font-bold text-xl mb-2">Founding Customer Programme</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-3">The first 3 customers to sign before Q3 2026 will be offered a <strong className="text-white">Founding Customer rate</strong> — a permanent pricing lock in exchange for logo rights, a case study, and 3–5 warm introductions to other CDMOs per year. Limited to 3 seats.</p>
                <Link href="/about#contact" className="text-amber-400 hover:text-amber-300 text-sm font-semibold inline-flex items-center gap-1 transition-colors">
                  Enquire about founding customer pricing <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-[#060E1C]">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Pricing is a conversation.</h2>
            <p className="text-slate-400 text-lg mb-8">A 20-minute demo first. Pricing detail follows. No pressure, no pipeline CRM on your name.</p>
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
