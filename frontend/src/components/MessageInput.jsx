import React from 'react'

export default function MessageInput() {
  return (
    <div className="flex items-center bg-slate-800 p-4 border-t border-slate-700/60">
        <input type="text" placeholder="Type a message" className="w-full bg-slate-700 rounded-full px-4 py-2 focus:outline-none" />
        <button className="w-10 h-10 flex items-center justify-center rounded-full bg-cyan-500 hover:bg-cyan-600 transition-colors ml-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-slate-900">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0112 3c2.066 0 4.116.837 5.269 2.724L21 12m-3 0h-9m3 0l-3-3m3 3l9-9" />
            </svg>
        </button>


    </div>
  )
}
