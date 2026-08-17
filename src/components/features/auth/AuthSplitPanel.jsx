import Icon from '../../ui/Icon';

export default function AuthSplitPanel() {
  return (
    <div className="hidden lg:flex flex-col w-[45%] bg-primary-container text-on-primary p-margin-desktop relative overflow-hidden justify-between">
      <div className="absolute inset-0 z-0 opacity-20 bg-gradient-to-br from-primary-container via-primary-container/90 to-primary-container" />
      <div className="absolute inset-0 bg-gradient-to-b from-primary-container/80 via-primary-container/90 to-primary-container z-0" />

      <div className="relative z-10 flex items-center gap-3">
        <Icon name="account_balance" size={32} className="text-secondary-container" />
        <span className="font-h2 text-h2 text-on-primary">NyayaAI</span>
      </div>

      <div className="relative z-10 flex flex-col gap-6 max-w-lg mt-24">
        <div className="w-16 h-16 rounded-full border-[2px] border-secondary-container/30 border-t-secondary-container chakra-spin mb-4" />
        <h1 className="font-h1 text-h1 text-on-primary">Join 10,000+ legal scholars.</h1>
        <p className="font-body-lg text-body-lg text-on-primary-container">
          Experience the next generation of institutional-grade legal research. Fast, precise, and unequivocally reliable.
        </p>
      </div>

      <div className="relative z-10 flex items-center gap-4 mt-auto">
        <div className="flex -space-x-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-10 h-10 rounded-full border-2 border-primary-container bg-surface-variant flex items-center justify-center text-primary-container font-bold text-sm"
            >
              {['AS', 'RF', 'SP'][i]}
            </div>
          ))}
        </div>
        <div className="flex flex-col">
          <span className="font-label-caps text-label-caps text-on-primary">Trusted by</span>
          <span className="font-body-md text-body-md text-on-primary-container text-sm">Top Tier Firms &amp; Universities</span>
        </div>
      </div>
    </div>
  );
}
