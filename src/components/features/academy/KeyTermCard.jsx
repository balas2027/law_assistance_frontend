export default function KeyTermCard({ term }) {
  return (
    <div className="bg-surface-container-low border border-outline-variant p-5 rounded-lg hover:border-primary transition-colors group cursor-pointer shadow-sm">
      <h4 className="font-bold text-on-surface mb-2 group-hover:text-primary">{term.title}</h4>
      <p className="text-sm text-on-surface-variant leading-relaxed">{term.description}</p>
    </div>
  );
}
