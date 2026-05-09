import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Use | KirtiBuildWell',
  description: 'Terms of use for KirtiBuildWell.'
}

export default function TermsPage() {
  return (
    <section className="container mx-auto px-4 py-16 md:px-6 md:py-24">
      <div className="max-w-3xl space-y-6">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold/90">Legal</p>
        <h1 className="font-display text-4xl font-semibold text-white md:text-5xl">Terms of Use</h1>
        <p className="text-white/65">
          This website is provided for general information and enquiry submission. Project details may change without notice.
        </p>
        <p className="text-white/65">
          By using this site, you agree to use the information responsibly and to contact the team directly for verified project specifics.
        </p>
      </div>
    </section>
  )
}