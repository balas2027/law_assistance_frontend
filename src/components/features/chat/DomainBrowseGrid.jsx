export default function DomainBrowseGrid({ domains }) {
  return (
    <div className="w-full pb-20">
      <p className="font-label-caps text-label-caps text-on-surface-variant mb-4 pl-1">BROWSE BY DOMAIN</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {domains.map((domain) => (
          <button
            key={domain.id}
            className="bg-surface-container-lowest border border-outline-variant/50 rounded-xl p-6 flex flex-col items-center justify-center gap-3 hover:bg-surface-container-low transition-colors duration-200"
          >
            <span className="text-3xl">{domain.icon}</span>
            <span className="font-body-md font-medium text-primary-container">{domain.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
