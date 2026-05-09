import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | KirtiBuildWell',
  description: 'Privacy policy for KirtiBuildWell.'
}

export default function PrivacyPage() {
  return (
    <section className="container mx-auto px-4 py-16 md:px-6 md:py-24">
      <div className="max-w-3xl space-y-6">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold/90">Legal</p>
        <h1 className="font-display text-4xl font-semibold text-white md:text-5xl">Privacy Policy</h1>
        <p className="text-white/65">
          We collect only the information needed to respond to enquiries, schedule visits, and improve the website experience.
        </p>
        <p className="text-white/65">
          Contact details are used for communication related to your request and are not sold to third parties.
        </p>
      </div>
    </section>
  )
}