import { useState } from 'react';

interface Props {
  label?: string;
  variant?: 'primary' | 'ghost' | 'nav';
}

type FormState = 'idle' | 'submitting' | 'success' | 'error';

export default function LeadCaptureModal({
  label = 'Download Product Overview',
  variant = 'primary',
}: Props) {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<FormState>('idle');
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const buttonClass =
    variant === 'primary'
      ? 'bg-accent hover:bg-accent-dark text-white font-semibold px-8 py-3.5 rounded-md transition-colors'
      : variant === 'ghost'
      ? 'border border-white/30 hover:border-white text-white font-semibold px-8 py-3.5 rounded-md transition-colors'
      : 'bg-accent hover:bg-accent-dark text-white text-sm font-semibold px-4 py-2 rounded-md transition-colors';

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState('submitting');
    setErrorMsg('');

    const apiKey = import.meta.env.PUBLIC_CONVERTKIT_API_KEY;
    const formId = import.meta.env.PUBLIC_CONVERTKIT_FORM_ID;

    // Dev fallback: if no ConvertKit vars, simulate success
    if (!apiKey || !formId) {
      setTimeout(() => setState('success'), 800);
      return;
    }

    try {
      const res = await fetch(
        `https://api.convertkit.com/v3/forms/${formId}/subscribe`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ api_key: apiKey, first_name: firstName, email }),
        }
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setState('success');
    } catch {
      setState('error');
      setErrorMsg('Something went wrong. Please email us at hello@mesvantage.com.');
    }
  }

  function close() {
    setOpen(false);
    setTimeout(() => {
      setState('idle');
      setFirstName('');
      setEmail('');
      setErrorMsg('');
    }, 200);
  }

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={buttonClass}>
        {label}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && close()}
        >
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
            <button
              type="button"
              onClick={close}
              className="absolute top-4 right-4 text-ink/30 hover:text-ink transition-colors"
              aria-label="Close"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {state === 'success' ? (
              <div className="text-center py-6">
                <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-5">
                  <svg className="w-7 h-7 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-navy mb-2">Check your inbox</h3>
                <p className="text-ink/60 text-sm leading-relaxed">
                  Your product overview is on its way — it should arrive within a minute.
                  <br />Can't find it? Check your spam folder.
                </p>
              </div>
            ) : (
              <>
                <h3 className="text-xl font-bold text-navy mb-1">Download the Product Overview</h3>
                <p className="text-sm text-ink/60 mb-6">
                  We'll send the 2-page PDF to your inbox. No spam, unsubscribe any time.
                </p>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-ink mb-1.5" htmlFor="ck-first-name">
                      First name
                    </label>
                    <input
                      id="ck-first-name"
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full border border-border rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors"
                      placeholder="Patrick"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-ink mb-1.5" htmlFor="ck-email">
                      Work email
                    </label>
                    <input
                      id="ck-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full border border-border rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors"
                      placeholder="you@company.com"
                    />
                  </div>
                  {errorMsg && (
                    <p className="text-red-500 text-sm bg-red-50 border border-red-100 rounded-md px-3 py-2">
                      {errorMsg}
                    </p>
                  )}
                  <button
                    type="submit"
                    disabled={state === 'submitting'}
                    className="w-full bg-accent hover:bg-accent-dark disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded-md transition-colors"
                  >
                    {state === 'submitting' ? 'Sending…' : 'Send me the PDF →'}
                  </button>
                  <p className="text-xs text-ink/40 text-center">
                    By submitting you agree to receive occasional product updates.
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
