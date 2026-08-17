export default function ModuleMasteryRing({ percent }) {
  return (
    <div className="relative w-32 h-32 mx-auto flex items-center justify-center">
      <svg className="w-full h-full -rotate-90 absolute top-0 left-0" viewBox="0 0 100 100">
        <circle cx="50" cy="50" fill="none" r="45" stroke="#eeeeeb" strokeWidth="4" />
        <circle
          className="transition-all duration-1000 ease-out"
          cx="50"
          cy="50"
          fill="none"
          r="45"
          stroke="#fe9832"
          strokeDasharray="283"
          strokeDashoffset={283 - (percent / 100) * 283}
          strokeLinecap="round"
          strokeWidth="4"
        />
      </svg>
      <div className="text-center z-10 flex flex-col items-center">
        <span className="font-h1 text-[28px] font-bold text-primary">{percent}%</span>
        <span className="text-xs text-on-surface-variant">Completed</span>
      </div>
      <div className="absolute inset-[-8px] border-[1px] border-dashed border-outline-variant rounded-full animate-spin-slow opacity-50" />
    </div>
  );
}
