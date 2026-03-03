import React from 'react'

export default function Postpage() {
  return (
    <div className="min-h-[100%] flex items-center justify-center bg-gray-50 px-6">
      <div className="text-center space-y-5 p-5  bg-white border border-gray-100 shadow-xl rounded-3xl max-w-sm w-full">
        
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
        </div>

        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-gray-800">Post Feed</h1>
          <p className="text-gray-500 leading-relaxed">
            We're building a space for your stories. The <span className="font-semibold text-blue-600">Post Page</span> is coming soon!
          </p>
        </div>

        <div className="flex flex-col gap-2 pt-1 opacity-40">
          <div className="h-3 w-full bg-gray-200 rounded-full animate-pulse"></div>
          <div className="h-3 w-3/4 mx-auto bg-gray-200 rounded-full animate-pulse"></div>
        </div>

        <button 
          onClick={() => window.history.back()}
          className="mt-4 w-full py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-blue-500/20"
        >
          Go Back
        </button>

        <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em]">Version 1.0.0 • In Development</p>
      </div>
    </div>
  )
}