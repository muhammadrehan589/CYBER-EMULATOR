'use client';

import React, { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface Props {
  user: any;
  action: 'warning' | 'ban' | 'force_rename';
  onClose: () => void;
  onConfirm: (payload: any) => Promise<void>;
}

export const UserModerationModal: React.FC<Props> = ({ user, action, onClose, onConfirm }) => {
  const [loading, setLoading] = useState(false);
  const [warningMsg, setWarningMsg] = useState('');
  const [banDays, setBanDays] = useState(1);

  const handleSubmit = async () => {
    setLoading(true);
    let payload: any = {};
    if (action === 'warning') {
      payload = { warningMessage: warningMsg };
    } else if (action === 'ban') {
      const banUntil = new Date();
      banUntil.setDate(banUntil.getDate() + banDays);
      payload = { banUntil };
    } else if (action === 'force_rename') {
      payload = { forceUsernameChange: true };
    }

    await onConfirm(payload);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-[#0a0a0a] border border-[#ff0055] rounded-xl w-full max-w-md shadow-[0_0_40px_rgba(255,0,85,0.2)] overflow-hidden font-mono">
        <div className="p-4 border-b border-[#ff0055]/30 flex justify-between items-center bg-[#ff0055]/10">
          <h2 className="text-[#ff0055] font-bold uppercase flex items-center gap-2 tracking-widest">
            <AlertTriangle className="w-5 h-5" />
            {action === 'warning' && 'Issue Warning'}
            {action === 'ban' && 'Temporary Ban'}
            {action === 'force_rename' && 'Force Rename'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="text-sm text-gray-300">
            Target: <span className="font-bold text-white">@{user.username}</span> ({user.name})
          </div>

          {action === 'warning' && (
            <div className="space-y-2">
              <label className="text-xs text-[#ff0055] uppercase tracking-wider">Warning Message</label>
              <textarea 
                value={warningMsg}
                onChange={(e) => setWarningMsg(e.target.value)}
                className="w-full bg-black border border-gray-700 text-white p-3 rounded focus:outline-none focus:border-yellow-500 min-h-[100px]"
                placeholder="E.g., Your username is inappropriate. Please change it."
              />
            </div>
          )}

          {action === 'ban' && (
            <div className="space-y-2">
              <label className="text-xs text-[#ff0055] uppercase tracking-wider">Ban Duration (Days)</label>
              <input 
                type="number" 
                min={1}
                max={365}
                value={banDays}
                onChange={(e) => setBanDays(parseInt(e.target.value) || 1)}
                className="w-full bg-black border border-gray-700 text-white p-3 rounded focus:outline-none focus:border-red-500"
              />
            </div>
          )}

          {action === 'force_rename' && (
            <p className="text-sm text-gray-400">
              The user will be required to choose a new username upon their next login. They will not be able to access the dashboard until they comply.
            </p>
          )}

          <div className="pt-4 flex justify-end gap-3">
            <button 
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-gray-400 hover:text-white transition-colors uppercase text-xs tracking-wider"
            >
              Cancel
            </button>
            <button 
              onClick={handleSubmit}
              disabled={loading}
              className="px-6 py-2 bg-[#ff0055] hover:bg-white text-white hover:text-[#ff0055] font-bold rounded uppercase text-xs tracking-wider transition-colors disabled:opacity-50"
            >
              {loading ? 'Executing...' : 'Execute'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
