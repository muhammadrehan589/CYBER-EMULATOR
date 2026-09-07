'use client';

import React, { useState } from 'react';
import { User, ShieldAlert, Ban, Edit3 } from 'lucide-react';

interface UserData {
  empId: string;
  name: string;
  username: string;
  role: string;
  status: string;
  warningMessage?: string;
  banUntil?: string;
  forceUsernameChange?: boolean;
}

interface Props {
  users: UserData[];
  onAction: (user: UserData, action: 'warning' | 'ban' | 'force_rename') => void;
}

export const AdminUserTable: React.FC<Props> = ({ users, onAction }) => {
  return (
    <div className="w-full bg-[#0a0a0a] border border-[#ff0055]/30 rounded-xl overflow-hidden shadow-[0_0_20px_rgba(255,0,85,0.1)]">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-300 font-mono">
          <thead className="bg-[#ff0055]/10 text-[#ff0055] uppercase text-xs tracking-widest border-b border-[#ff0055]/30">
            <tr>
              <th className="px-4 py-3">Player</th>
              <th className="px-4 py-3">Role & Status</th>
              <th className="px-4 py-3">Moderation State</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.empId} className="border-b border-[#ff0055]/10 hover:bg-[#ff0055]/5 transition-colors">
                <td className="px-4 py-3">
                  <div className="font-bold text-white">{user.name}</div>
                  <div className="text-xs text-gray-500">@{user.username} | {user.empId}</div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-col gap-1">
                    <span className="inline-block px-2 py-0.5 bg-gray-800 text-gray-300 rounded text-[10px] w-fit">{user.role}</span>
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] w-fit ${user.status === 'active' ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'}`}>
                      {user.status}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-xs">
                  {user.banUntil && new Date(user.banUntil) > new Date() && (
                    <div className="text-red-500 mb-1">Banned until {new Date(user.banUntil).toLocaleDateString()}</div>
                  )}
                  {user.forceUsernameChange && (
                    <div className="text-purple-400 mb-1">Rename Forced</div>
                  )}
                  {user.warningMessage && (
                    <div className="text-yellow-500 truncate max-w-[150px]" title={user.warningMessage}>
                      Warned: {user.warningMessage}
                    </div>
                  )}
                  {!user.banUntil && !user.forceUsernameChange && !user.warningMessage && (
                    <span className="text-gray-600">Clean</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right space-x-2">
                  <button 
                    onClick={() => onAction(user, 'warning')}
                    className="p-1.5 bg-yellow-950/50 text-yellow-500 hover:bg-yellow-900 rounded border border-yellow-700/50 transition-colors"
                    title="Send Warning"
                  >
                    <ShieldAlert className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => onAction(user, 'force_rename')}
                    className="p-1.5 bg-purple-950/50 text-purple-400 hover:bg-purple-900 rounded border border-purple-700/50 transition-colors"
                    title="Force Rename"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => onAction(user, 'ban')}
                    className="p-1.5 bg-red-950/50 text-red-500 hover:bg-red-900 rounded border border-red-700/50 transition-colors"
                    title="Temp Ban"
                  >
                    <Ban className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-gray-500">No users found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
