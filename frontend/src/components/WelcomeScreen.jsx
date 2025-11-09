import React from 'react'
import { MessageCircleIcon } from 'lucide-react'

export default function WelcomeScreen() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center space-y-4 text-slate-400 text-center p-4 md:p-12">
        <MessageCircleIcon className="w-12 h-12 mx-auto text-slate-400 mb-4" /> 
        <h4 className="text-3xl font-semibold">Welcome to Talklia</h4>
        <p className="text-lg">Select a chat to start messaging</p>
    </div>
  )
}
