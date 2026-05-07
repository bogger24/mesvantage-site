import Link from 'next/link';
import { Zap } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#060E1C] border-t border-white/8">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 font-bold text-white mb-4">
              <div className="w-7 h-7 rounded-lg bg-blue-500 flex items-center justify-center">
                <Zap size={14} className="text-white" />
              </div>
              <span>MESvantage</span>
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed">
              Manufacturing execution system built inside a live orthopaedic CDMO. FDA validated. Ships complete.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Product</h4>
            <ul className="space-y-2.5">
              {[
                { href: '/product', label: 'Overview' },
                { href: '/product#quality', label: 'Quality' },
                { href: '/product#production', label: 'Production' },
                { href: '/product#metrology', label: 'Metrology & CMM' },
                { href: '/product#intelligence', label: 'Intelligence' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-slate-500 hover:text-slate-300 text-sm transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Company</h4>
            <ul className="space-y-2.5">
              {[
                { href: '/about', label: 'About' },
                { href: '/pricing', label: 'Pricing' },
                { href: '/about#demo', label: 'Book a Demo' },
                { href: '/about#contact', label: 'Contact' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-slate-500 hover:text-slate-300 text-sm transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Compliance</h4>
            <ul className="space-y-2.5">
              {[
                { href: '/compliance', label: 'FDA 21 CFR Part 11' },
                { href: '/compliance#validation', label: 'IQ/OQ/PQ Validation' },
                { href: '/compliance#iso', label: 'ISO 13485' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-slate-500 hover:text-slate-300 text-sm transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-600 text-sm">
            © {new Date().getFullYear()} MESvantage Limited. Registered in Ireland.
          </p>
          <p className="text-slate-600 text-xs">
            County Limerick, Ireland · Built at Croom Medical
          </p>
        </div>
      </div>
    </footer>
  );
}
