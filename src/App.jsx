import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-slate-100 selection:bg-purple-500 selection:text-white">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full filter blur-3xl pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/20 rounded-full filter blur-3xl pointer-events-none animate-pulse delay-1000"></div>

      <div className="relative z-10 w-full max-w-md bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl transition-all duration-300 hover:border-slate-700/80">
        
        {/* Header Section */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-semibold tracking-wider uppercase">
            Tailwind CSS v4 + PostCSS
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-indigo-200 to-purple-400 bg-clip-text text-transparent">
            Law Assistance
          </h1>
          <p className="text-slate-400 text-sm">
            Frontend Boilerplate Environment Initialized Successfully
          </p>
        </div>

        {/* Status Check / Test Indicator */}
        <div className="mt-8 p-4 rounded-2xl bg-slate-950/85 border border-slate-850 flex items-center justify-between">
          <span className="text-sm font-medium text-slate-300">Vite + React Integration</span>
          <span className="flex h-3 w-3 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
        </div>

        {/* Counter Testing Interactive State */}
        <div className="mt-6 flex flex-col items-center justify-center space-y-4">
          <button
            onClick={() => setCount((c) => c + 1)}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 cursor-pointer"
          >
            Run Interactive Test
          </button>
          
          <div className="text-center">
            <p className="text-xs text-slate-500 uppercase tracking-widest">Click Register</p>
            <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
              {count} {count === 1 ? 'click' : 'clicks'} verified
            </p>
          </div>
        </div>

        {/* Verification Checklist */}
        <div className="mt-8 border-t border-slate-800/80 pt-6 space-y-3">
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Features Verified</h2>
          <ul className="space-y-2 text-sm text-slate-300">
            <li className="flex items-center gap-2.5">
              <svg className="h-5 w-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>Utility Class Processing (PostCSS)</span>
            </li>
            <li className="flex items-center gap-2.5">
              <svg className="h-5 w-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>Vite Hot Module Replacement (HMR)</span>
            </li>
            <li className="flex items-center gap-2.5">
              <svg className="h-5 w-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>State & Event Handling</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default App
