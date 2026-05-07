import Link from 'next/link';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import { ArrowRight, ClipboardCheck, Factory, Microscope, GraduationCap, BarChart3, Cpu, Lock, Globe, Database, Workflow, CheckCircle2, Layers } from 'lucide-react';

const domains = [
  {
    name: 'Quality', color: 'text-emerald-400', border: 'border-emerald-500/20', bg: 'bg-emerald-500/8', icon: ClipboardCheck,
    modules: [
      { name: 'First Article Inspection (FAI)', desc: 'Structured FAI workflows with electronic signoff and ISO 13485 alignment' },
      { name: 'First Pass Yield (FPY)', desc: 'Real-time yield tracking across operations, work centres, and part numbers' },
      { name: 'Statistical Process Control (SPC)', desc: 'Control charts, Cpk analysis, and out-of-control alerts per characteristic' },
      { name: 'Device History Record (DHR)', desc: 'Automated DHR compilation for each production run — FDA 21 CFR Part 820 ready' },
      { name: 'Incoming Inspection', desc: 'Goods-in inspection workflows with pass/fail recording and supplier scorecard' },
      { name: 'Customer Quality Portal', desc: 'Secure, customer-facing view of quality metrics, NCRs, and corrective actions' },
      { name: 'Non-Conformance (NCR)', desc: 'NCR creation, disposition, and CAPA tracking with audit trail' },
    ],
  },
  {
    name: 'Production', color: 'text-blue-400', border: 'border-blue-500/20', bg: 'bg-blue-500/8', icon: Factory,
    modules: [
      { name: 'OEE Dashboard', desc: 'Availability, Performance, and Quality metrics per work centre in real time' },
      { name: 'Scheduling', desc: 'Job scheduling board with capacity constraints and priority management' },
      { name: 'Standard Times', desc: 'Estimated vs. actual hours with M1 ERP integration and variance reporting' },
      { name: 'In-Process Documentation (IPD)', desc: 'Digital work instructions with stage-gating, barcode scanning, and CMM auto-populate' },
      { name: 'Graduation', desc: 'End-of-run certification with electronic signature and job completion workflow' },
      { name: 'Work Orders', desc: 'Work order management with status tracking, operation sequencing, and BOM integration' },
    ],
  },
  {
    name: 'Metrology & CMM', color: 'text-purple-400', border: 'border-purple-500/20', bg: 'bg-purple-500/8', icon: Microscope,
    modules: [
      { name: 'CMM Auto-Population', desc: 'Automated parsing of Renishaw, Hexagon, and Zeiss CMM output files into IPD stages' },
      { name: 'AI Measurement Parser', desc: 'Multi-pass Vision parser with 22/22 accuracy on Arthrex Glenosphere drawings' },
      { name: 'Drawing Management', desc: 'PDF drawing upload with characteristic extraction and revision control' },
      { name: 'Metrology Watchfolder', desc: 'Auto-watch CMM results folder — detects new files, filters TRIAL runs, imports live' },
    ],
  },
  {
    name: 'Intelligence', color: 'text-rose-400', border: 'border-rose-500/20', bg: 'bg-rose-500/8', icon: BarChart3,
    modules: [
      { name: 'CEO Dashboard', desc: 'Real-time executive KPIs: OEE, quality yield, on-time delivery, open NCRs, energy' },
      { name: 'AI Executive Agent', desc: 'Claude-powered briefing agent with MCP server integration — natural language production queries' },
      { name: 'Ops Intelligence', desc: '14 operational intelligence sub-pages: jobs at risk, work centre load, shipping performance' },
      { name: 'Energy Intelligence', desc: 'Per-machine energy consumption monitoring, trend analysis, and anomaly alerts' },
      { name: 'Machine Intelligence', desc: 'OPC UA live data from Haas, Hurco, and Citizen machines — status, alarms, utilisation' },
    ],
  },
  {
    name: 'Training & Compliance', color: 'text-amber-400', border: 'border-amber-500/20', bg: 'bg-amber-500/8', icon: GraduationCap,
    modules: [
      { name: 'Training Enforcement', desc: 'Training gates block stage completion for untrained operators — hard stop, not advisory' },
      { name: 'Trainer / Trainee Tracking', desc: 'Full operator training matrix with trainer sign-off and currency expiry' },
      { name: 'Qualio QMS Integration', desc: 'Bi-directional sync with Qualio: documents, events, training records with circuit breaker resilience' },
      { name: 'Electronic Signatures', desc: 'FDA 21 CFR Part 11 compliant e-signatures with reason capture on every critical action' },
      { name: 'Audit Trail', desc: 'Immutable, timestamped audit log for every create, update, and delete action in the system' },
    ],
  },
  {
    name: 'Platform', color: 'text-cyan-400', border: 'border-cyan-500/20', bg: 'bg-cyan-500/8', icon: Layers,
    modules: [
      { name: 'Role-Based Access Control', desc: 'Granular permissions per module with ADMIN bypass and session audit' },
      { name: 'Mobile PWA', desc: 'Full mobile web app for shop-floor operators: barcode scanning, IPD, training, inspection' },
      { name: 'Digital Signage', desc: '9-screen Firestick network with 559 assets and 24 playlists for production visibility' },
      { name: 'M1 ERP Integration', desc: 'Direct SQL read from Infor ECi M1 for jobs, parts, standard times, and timecards' },
      { name: 'Power BI Integration', desc: 'Embedded Power BI dashboards within the MES interface' },
      { name: 'Cloudflare Tunnel', desc: 'Zero-trust secure remote access — no VPN, no open ports, MFA enforced' },
    ],
  },
];

const integrations = [
  { name: 'Infor ECi M1', desc: 'ERP', icon: Database },
  { name: 'Qualio QMS', desc: 'Quality Management', icon: ClipboardCheck },
  { name: 'Power BI', desc: 'Analytics', icon: BarChart3 },
  { name: 'OPC UA', desc: 'Machine Connectivity', icon: Cpu },
  { name: 'Cloudflare', desc: 'Zero Trust Access', icon: Lock },
  { name: 'Mitutoyo MCOSMOS', desc: 'CMM Software', icon: Microscope },
  { name: 'Haas Multigrind', desc: 'CNC Grinders', icon: Workflow },
  { name: 'Hurco VM10i', desc: 'Machining Centre', icon: Factory },
];

export default function ProductPage() {
  return (
    <>
      <Nav />
      <main className="pt-16">
        <section className="py-24 grid-bg relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-600/8 to-transparent pointer-events-none" />
          <div className="relative max-w-7xl mx-auto px-6">
            <div className="max-w-3xl">
              <p className="text-blue-400 font-semibold text-sm mb-4 tracking-wide uppercase">Product Overview</p>
              <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
                50+ modules. Built complete. <span className="text-gradient">Shipped production-ready.</span>
              </h1>
              <p className="text-xl text-slate-400 leading-relaxed mb-8">
                Every module in MESvantage was built to solve a real operational problem at a live 250,000 knee systems per year CDMO. Nothing is a concept. Everything ships.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/about#demo" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-400 text-white font-semibold rounded-xl transition-all">
                  Book a Demo <ArrowRight size={16} />
                </Link>
                <Link href="/compliance" className="inline-flex items-center gap-2 px-6 py-3 border border-white/15 hover:border-white/30 text-white font-medium rounded-xl transition-all hover:bg-white/5">
                  See Compliance Details
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-[#060E1C]">
          <div className="max-w-7xl mx-auto px-6 space-y-12">
            {domains.map(({ name, color, border, bg, icon: Icon, modules }) => (
              <div key={name} className={`rounded-2xl border ${border} ${bg} p-8`}>
                <div className="flex items-center gap-3 mb-8">
                  <Icon size={22} className={color} />
                  <h2 className={`text-2xl font-bold ${color}`}>{name}</h2>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {modules.map(({ name: mName, desc }) => (
                    <div key={mName} className="p-4 rounded-xl bg-white/3 border border-white/5">
                      <div className="flex items-start gap-2 mb-2">
                        <CheckCircle2 size={14} className={`${color} mt-0.5 flex-shrink-0`} />
                        <h3 className="text-white text-sm font-semibold">{mName}</h3>
                      </div>
                      <p className="text-slate-500 text-xs leading-relaxed pl-5">{desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="py-24 grid-bg">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Architecture</h2>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto">Modern, containerised, and designed for isolated deployment per customer.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
              {[
                { icon: Globe, label: 'React 18 + Vite', sub: 'Frontend', color: 'text-blue-400', bg: 'bg-blue-500/10' },
                { icon: Database, label: 'Node.js + Express', sub: 'API Server', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                { icon: Database, label: 'PostgreSQL 15', sub: 'Database', color: 'text-purple-400', bg: 'bg-purple-500/10' },
                { icon: Cpu, label: 'Redis 7', sub: 'Cache & Queues', color: 'text-amber-400', bg: 'bg-amber-500/10' },
              ].map(({ icon: Icon, label, sub, color, bg }) => (
                <div key={label} className="p-6 rounded-xl border border-white/8 bg-[#0D1B2E] text-center">
                  <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center mx-auto mb-3`}><Icon size={22} className={color} /></div>
                  <div className="text-white font-semibold text-sm">{label}</div>
                  <div className="text-slate-500 text-xs">{sub}</div>
                </div>
              ))}
            </div>
            <div className="p-6 rounded-xl border border-white/8 bg-[#0D1B2E]">
              <p className="text-slate-400 text-sm text-center leading-relaxed max-w-3xl mx-auto">
                Each customer deployment runs in <span className="text-white font-medium">fully isolated Docker containers</span> on their own compute instance. No multi-tenant database. No shared compute. New environments provisioned via <span className="text-white font-medium">Terraform in under 30 minutes</span>.
              </p>
            </div>
          </div>
        </section>

        <section className="py-24 bg-[#060E1C]">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">Integrations</h2>
              <p className="text-slate-400">Native integrations with the tools your plant already uses.</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {integrations.map(({ name, desc, icon: Icon }) => (
                <div key={name} className="p-5 rounded-xl border border-white/8 bg-[#0D1B2E] flex flex-col items-center text-center gap-3">
                  <Icon size={22} className="text-slate-400" />
                  <div>
                    <div className="text-white text-sm font-semibold">{name}</div>
                    <div className="text-slate-500 text-xs">{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 grid-bg">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to see it live?</h2>
            <p className="text-slate-400 text-lg mb-8">20 minutes with the founder. The live production system. No slides.</p>
            <Link href="/about#demo" className="inline-flex items-center gap-2 px-8 py-4 bg-blue-500 hover:bg-blue-400 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-500/20">
              Book a Demo <ArrowRight size={18} />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
