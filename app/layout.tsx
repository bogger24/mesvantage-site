import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'MESvantage — MES Built Inside a Live CDMO',
  description: 'The only manufacturing execution system purpose-built and FDA-validated inside a live orthopaedic CDMO. 50+ modules. FDA 21 CFR Part 11. ISO 13485. Production from day one.',
  keywords: 'MES, manufacturing execution system, CDMO, medical device, FDA 21 CFR Part 11, ISO 13485, orthopaedic',
  openGraph: {
    title: 'MESvantage — MES Built Inside a Live CDMO',
    description: 'The only MES purpose-built and FDA-validated inside a live orthopaedic CDMO. 250,000 knee systems/year.',
    type: 'website',
    url: 'https://mesvantage.com',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MESvantage — MES Built Inside a Live CDMO',
    description: 'The only MES purpose-built and FDA-validated inside a live orthopaedic CDMO.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#0A1628] text-slate-100 antialiased">
        {children}
      </body>
    </html>
  );
}
