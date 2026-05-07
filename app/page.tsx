import Link from 'next/link';
import Nav from './components/Nav';
import Footer from './components/Footer';
import { ArrowRight, ShieldCheck, Zap, BarChart3, ClipboardCheck, Cpu, Factory, GraduationCap, Microscope, CheckCircle2, TrendingUp, Users, Lock, Globe } from 'lucide-react';

const modules = [
  { icon: ClipboardCheck, label: 'Quality & FAI', desc: 'First Article Inspection, FPY, SPC, DHR, incoming inspection', color: 'text-emerald-400' },
  { icon: Factory, label: 'Production & OEE', desc: 'Scheduling, OEE tracking, standard times, graduation', color: 'text-blue-400' },
  { icon: Microscope, label: 'Metrology & CMM', desc: 'CMM integration with AI-powered measurement parsing', color: 'text-purple-400' },
  { icon: GraduationCap, label: 'Training Enforcement', desc: 'Operator training gates, trainer/trainee tracking, compliance', color: 'text-amber-400' },
  { icon: BarChart3, label: 'CEO Intelligence', desc: 'Executive dashboard, AI briefings, real-time KPIs', color: 'text-rose-400' },
  { icon: Cpu, label: 'Machine Intelligence', desc: 'OPC UA live machine data, energy monitoring, alerts', color: 'text-cyan-400' },
  { icon: Lock, label: 'Electronic Signatures', desc: 'FDA 21 CFR Part 11 compliant audit trail & e-signatures', color: 'text-violet-400' },
  { icon: Globe, label: 'Customer Quality Portal', desc: 'Customer-facing quality data access and reporting', color: 'text-teal-400' },
];

const competitors = [
  { name: 'Tulip', price: '$12k–$30k/yr', problem: 'You buy lego bricks — you still have to build the MES yourself' },
  { name: 'Plex (Rockwell)', price: '$50k–$500k+/yr', problem: '12–18 month implementation. Inaccessible to CDMOs under 500 people' },
  { name: 'Siemens Opcenter', price: '$200k–$1M+/yr', problem: 'Fortune 500 only. Not designed for CDMOs' },
  { name: 'MasterControl', price: 'QMS only', problem: 'QMS-centric. No OEE, scheduling, machine intel, or energy' },
];

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <section className="relative min-h-screen flex items-center pt-16 overflow-hidden grid-bg">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-transparent pointer-events-none" />
          <div className="relative max-w-7xl mx-auto px-6 py-24 lg:py-32">
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-semibold mb-8">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live in production · FDA 21 CFR Part 11 Validated · ISO 13485
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.05] tracking-tight mb-6">
                The MES built <span className="text-gradient">inside a live plant.</span>
              </h1>
              <p className="text-xl md:text-2xl text-slate-400 leading-relaxed mb-10 max-w-3xl">
                MESvantage is the only manufacturing execution system purpose-built and FDA-validated inside a live orthopaedic CDMO — 250,000 knee systems per year. Not a demo environment. Not a proof of concept.{' '}
                <span className="text-slate-200 font-medium">Production, day one.</span>
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/about#demo" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-500 hover:bg-blue-400 text-white font-semibold rounded-xl transition-all text-lg shadow-lg shadow-blue-500/20">
                  Book a 20-Minute Demo <ArrowRight size={20} />
                </Link>
                <Link href="/product" className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-white/15 hover:border-white/30 text-white font-medium rounded-xl transition-all text-lg hover:bg-white/5">
                  See the Product
                </Link>
              </div>
            </div>
            <div className="mt-16 pt-10 border-t border-white/8 grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { value: '250k', label: 'Knee systems/year at founding customer' },
                { value: '50+', label: 'Feature modules, production-proven' },
                { value: '<30 min', label: 'New customer deployment via Terraform' },
                { value: '96%', label: 'Gross margin at steady state' },
              ].map(({ value, label }) => (
                <div key={value}>
                  <div className="text-3xl font-extrabold text-white mb-1">{value}</div>
                  <div className="text-slate-500 text-sm">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 bg-[#060E1C]">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">The gap nobody else owns</h2>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto">Every major MES vendor either targets Fortune 500 enterprises or requires you to build your own. MESvantage is the first purpose-built, out-of-the-box MES for medical device CDMOs.</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/8">
                    <th className="text-left py-3 px-4 text-slate-400 font-medium">Competitor</th>
                    <th className="text-left py-3 px-4 text-slate-400 font-medium">Pricing</th>
                    <th className="text-left py-3 px-4 text-slate-400 font-medium">The problem</th>
                  </tr>
                </thead>
                <tbody>
                  {competitors.map((c, i) => (
                    <tr key={c.name} className={`border-b border-white/5 ${i % 2 === 0 ? '' : 'bg-white/[0.02]'}`}>
                      <td className="py-3.5 px-4 font-medium text-slate-300">{c.name}</td>
                      <td className="py-3.5 px-4 text-slate-400">{c.price}</td>
                      <td className="py-3.5 px-4 text-slate-400">{c.problem}</td>
                    </tr>
                  ))}
                  <tr className="bg-blue-500/10 border border-blue-500/20">
                    <td className="py-4 px-4 font-bold text-blue-300">MESvantage</td>
                    <td className="py-4 px-4 text-blue-300 font-semibold">€32k–€95k/yr</td>
                    <td className="py-4 px-4 text-emerald-400 font-medium">
                      <span className="flex items-center gap-2"><CheckCircle2 size={15} /> Built inside a real 250k-knees/yr plant. FDA validated. Ships complete.</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="py-24 grid-bg">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Why CDMOs choose MESvantage</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: Factory, color: 'bg-blue-500/15 text-blue-400', border: 'hover:border-blue-500/30', title: 'Built inside a live plant', body: 'Every feature was designed, tested, and validated under real production conditions — 250,000 orthopaedic implants per year, ISO 13485, FDA audit-ready. No vaporware. No pilot environment. Production from day one.' },
                { icon: ShieldCheck, color: 'bg-emerald-500/15 text-emerald-400', border: 'hover:border-emerald-500/30', title: 'FDA validated on day one', body: 'Full IQ/OQ/PQ validation documentation transfers with every deployment. No 12-month validation cycle. Electronic signatures, immutable audit trail, and 21 CFR Part 11 controls are baked in — not bolted on.' },
                { icon: Zap, color: 'bg-violet-500/15 text-violet-400', border: 'hover:border-violet-500/30', title: 'Siloed SaaS is a compliance feature', body: "Your data never co-mingles with another manufacturer's stack. Your own compute, database, and storage — fully isolated. FDA auditors and ISO 13485 QA teams prefer it this way. It's your compliance advantage." },
              ].map(({ icon: Icon, color, border, title, body }) => (
                <div key={title} className={`p-8 rounded-2xl border border-white/8 bg-[#0D1B2E] ${border} transition-colors`}>
                  <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center mb-5`}><Icon size={24} /></div>
                  <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
                  <p className="text-slate-400 leading-relaxed">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 bg-[#060E1C]">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">50+ modules. One platform.</h2>
                <p className="text-slate-400 text-lg">Every module ships complete and production-proven.</p>
              </div>
              <Link href="/product" className="flex-shrink-0 inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-medium text-sm transition-colors">
                Full product overview <ArrowRight size={16} />
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {modules.map(({ icon: Icon, label, desc, color }) => (
                <div key={label} className="p-5 rounded-xl border border-white/6 bg-[#0D1B2E] hover:border-white/15 transition-colors">
                  <Icon size={20} className={`${color} mb-3`} />
                  <h4 className="text-white font-semibold text-sm mb-1.5">{label}</h4>
                  <p className="text-slate-500 text-xs leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 grid-bg">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Built for medical device CDMOs</h2>
                <p className="text-slate-400 text-lg leading-relaxed mb-8">If you manufacture orthopaedic implants, surgical instruments, or medical devices under ISO 13485 and FDA-regulated conditions, MESvantage was designed for your environment.</p>
                <ul className="space-y-3">
                  {['50–500 employees', 'ISO 13485 certified (required)', 'FDA 21 CFR Part 11 scope (preferred)', 'Replacing spreadsheets, legacy MES, or no system', 'Ireland, EU, and US markets'].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-slate-300">
                      <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0" />{item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Users, label: '300–500', sub: 'Qualifying CDMOs globally', bg: 'bg-blue-500/10', ic: 'text-blue-400' },
                  { icon: TrendingUp, label: '€78k', sub: 'Year 1 cash per Professional customer', bg: 'bg-emerald-500/10', ic: 'text-emerald-400' },
                  { icon: Zap, label: '<30 min', sub: 'New environment provisioned via Terraform', bg: 'bg-violet-500/10', ic: 'text-violet-400' },
                  { icon: ShieldCheck, label: 'IQ/OQ/PQ', sub: 'Validation docs transfer with every deployment', bg: 'bg-amber-500/10', ic: 'text-amber-400' },
                ].map(({ icon: Icon, label, sub, bg, ic }) => (
                  <div key={label} className="p-6 rounded-xl border border-white/8 bg-[#0D1B2E]">
                    <div className={`w-10 h-10 rounded-lg ${bg} flex items-center justify-center mb-4`}><Icon size={20} className={ic} /></div>
                    <div className="text-2xl font-bold text-white mb-1">{label}</div>
                    <div className="text-slate-500 text-xs">{sub}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 bg-[#060E1C]">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-semibold mb-8">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
              20-minute demo · No sales pressure · Real product
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">See the only MES that was validated before you booked the demo.</h2>
            <p className="text-slate-400 text-lg mb-10 max-w-2xl mx-auto">A peer-to-peer conversation with a CDMO that built it. No slides. No sandbox data. The live production system.</p>
            <Link href="/about#demo" className="inline-flex items-center gap-2 px-10 py-5 bg-blue-500 hover:bg-blue-400 text-white font-bold rounded-xl transition-all text-lg shadow-lg shadow-blue-500/25">
              Book a 20-Minute Demo <ArrowRight size={20} />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
