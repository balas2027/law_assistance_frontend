import FeatureCard from './FeatureCard';

const FEATURES = [
  {
    id: 'ask',
    icon: 'chat_bubble',
    title: 'Ask & Get Answers',
    description:
      'Ask questions in plain English or regional languages and get accurate answers grounded in BNS, BNSS, and BSA.',
  },
  {
    id: 'docs',
    icon: 'description',
    title: 'Understand Documents',
    description:
      'Upload legal notices, contracts, or FIRs. NyayaAI will summarize the contents and explain your obligations and rights.',
  },
  {
    id: 'learn',
    icon: 'menu_book',
    title: 'Learn the Law',
    description:
      'Access structured courses on the Indian Constitution, Fundamental Rights, and key civic duties designed for non-lawyers.',
    accent: 'saffron',
    glow: 'saffron',
  },
];

export default function FeatureGrid() {
  return (
    <section className="py-20 bg-white border-y border-surface-variant relative">
      <div className="max-w-[1200px] mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="text-center mb-16">
          <h2 className="font-h2 text-h2 text-primary mb-4">Empowering citizens through clarity.</h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">
            We bridge the gap between complex legal jargon and everyday understanding, providing tools to navigate the Indian legal landscape confidently.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {FEATURES.map((feature) => (
            <FeatureCard key={feature.id} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
}
