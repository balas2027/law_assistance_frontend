export default function SourceCitation({ label, children }) {
  return (
    <span className="font-citation text-[13px] bg-surface-container-low px-1.5 py-0.5 rounded border-b-2 border-secondary-container text-primary cursor-pointer hover:bg-surface-container transition-colors inline-block leading-none">
      {label}
      {children}
    </span>
  );
}
