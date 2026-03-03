import React from 'react'

export default function Callpage() {
  return (
    <div className="min-h-[100%] flex items-center justify-center bg-gray-50 px-6">
      <div className="text-center space-y-4 p-6 bg-white border border-gray-100 shadow-xl rounded-3xl max-w-sm w-full">
        
        {/* Phone/Calling Icon */}
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 text-green-600 rounded-2xl mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-gray-800">Call Feature</h1>
        
        <p className="text-gray-500 leading-relaxed">
          The calling dashboard is <span className="font-semibold text-green-600">under development</span>. 
          Voice and Video calls are coming soon!
        </p>

        {/* Status indicator */}
        <div className="flex items-center justify-center gap-2 pt-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
          <span className="text-sm font-medium text-gray-400 uppercase tracking-widest">In Progress</span>
        </div>

        <button 
          onClick={() => window.history.back()}
          className="mt-6 w-full py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-all active:scale-95"
        >
          Go Back
        </button>
      </div>
    </div>
  )
}