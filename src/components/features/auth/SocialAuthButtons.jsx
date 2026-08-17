export default function SocialAuthButtons({ provider }) {
  const buttons =
    provider === 'linkedin'
      ? [
          { id: 'google', label: 'Sign up with Google', mark: 'G' },
          { id: 'linkedin', label: 'Sign up with LinkedIn', mark: 'in' },
        ]
      : [];

  return (
    <div className="flex flex-col gap-4 mb-8">
      {buttons.map((btn) => (
        <button
          key={btn.id}
          className="w-full h-12 rounded-full border border-outline text-primary font-label-caps text-label-caps flex items-center justify-center gap-3 hover:bg-surface-container-low transition-colors duration-200"
        >
          <span className="w-5 h-5 rounded-full bg-primary-container text-white flex items-center justify-center text-[11px] font-bold">
            {btn.mark}
          </span>
          {btn.label}
        </button>
      ))}
    </div>
  );
}
