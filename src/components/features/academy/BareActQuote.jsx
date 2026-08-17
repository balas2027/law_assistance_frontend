export default function BareActQuote({ children }) {
  return (
    <section className="bg-[#FAFAF7] border-l-4 border-primary p-6 rounded-r-xl shadow-sm border border-outline-variant relative overflow-hidden">
      <div className="absolute top-0 right-0 bg-primary text-white text-xs font-label-caps px-3 py-1 rounded-bl-lg opacity-80">
        BARE ACT
      </div>
      <div className="font-citation text-citation text-on-surface leading-relaxed pr-16">{children}</div>
    </section>
  );
}
