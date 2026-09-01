'use client';

import React from 'react';
import { useQuizStore } from '@/store/quizStore';

export default function InventoryModal({ onClose }: { onClose: () => void }) {
  const { inventory } = useQuizStore();
  
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center backdrop-blur-md bg-black/90 p-4">
      <div className="w-full max-w-sm bg-[#0a030d] border border-green-500/50 rounded-xl shadow-[0_0_30px_rgba(34,197,94,0.3)] overflow-hidden flex flex-col font-mono">
        <div className="flex justify-between items-center p-4 border-b border-green-500/30 bg-green-900/20">
          <h2 className="text-xl font-black text-green-400 tracking-widest uppercase">
            ACTIVE INVENTORY
          </h2>
          <button onClick={onClose} className="text-green-400 hover:text-white">X</button>
        </div>
        
        <div className="p-6 text-gray-300 space-y-3">
          {Object.entries(inventory).filter(([_, count]) => count > 0).length === 0 ? (
            <p className="text-gray-500 text-xs italic">No tactical assets acquired yet.</p>
          ) : (
            Object.entries(inventory)
              .filter(([_, count]) => count > 0)
              .map(([key, count], idx) => (
                <div key={idx} className="flex justify-between border-b border-gray-800 pb-2">
                  <span className="capitalize">{key}</span>
                  <span className="text-green-400 font-bold">{count}</span>
                </div>
              ))
          )}
        </div>
      </div>
    </div>
  );
}
