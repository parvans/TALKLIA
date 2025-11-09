import React from 'react'

export default function UserLoadingSkeleton() {
    return (
        <div className="space-y-2">
            {
                [1, 2, 3, 4, 5].map((item) => (
                    <div key={item} className="bg-slate-800/50 p-4 rounded-lg animate-pulse">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full bg-slate-600"></div>
                            <div className="flex-1">
                                <div className="w-1/2 h-4 bg-slate-600 mb-2"></div>
                                <div className="w-1/3 h-4 bg-slate-600"></div>
                            </div>
                        </div>
                    </div>
                ))

            }
        </div>
    )
}
