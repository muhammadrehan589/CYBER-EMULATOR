'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { io } from 'socket.io-client';

interface UserData {
  _id: string;
  empId: string;
  username?: string;
  email?: string;
  isOnline?: boolean;
  loginHistory?: Date[];
  metrics?: {
    correctAnswers: number;
    wrongAnswers: number;
    duelsPlayed: number;
    duelsWon: number;
  };
}

export default function SysadminPage() {
  const router = useRouter();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const socketRef = React.useRef<any>(null);

  useEffect(() => {
    const s = io(process.env.NEXT_PUBLIC_SOCKET_URL || `http://${window.location.hostname}:3001`, {
      transports: ['websocket', 'polling'],
    });
    socketRef.current = s;
    return () => { s.disconnect(); };
  }, []);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoadingData(true);
      const res = await fetch('/api/sysadmin/users');
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      } else if (res.status === 401) {
        router.push('/sysadmin/login');
      }
    } catch (err) {
      console.error('Failed to fetch users', err);
    } finally {
      setLoadingData(false);
    }
  };

  const handleDownload = async (username: string, type: 'logins' | 'metrics' | 'evaluations') => {
    try {
      const res = await fetch(`/api/sysadmin/export/csv?username=${encodeURIComponent(username)}&type=${type}`);
      if (!res.ok) throw new Error('Download failed');
      
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${username}_${type}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Error downloading CSV:', err);
      alert('Failed to download CSV');
    }
  };

  const handleForceRename = async (userId: string, empId: string, currentUsername?: string) => {
    if (!confirm(`Force a username change for ${currentUsername || empId}?`)) return;
    try {
      const res = await fetch('/api/sysadmin/force-rename', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      if (res.ok) {
        alert('Warning issued! User will be prompted to rename.');
        if (socketRef.current) {
          socketRef.current.emit('admin_force_rename', { targetEmpId: empId });
        }
      } else {
        alert('Failed to issue warning.');
      }
    } catch (e) {
      alert('Error issuing warning.');
    }
  };

  if (loadingData) {
    return <div className="min-h-screen bg-[#0a030d] text-white flex items-center justify-center font-mono">LOADING ADMIN ARCHIVES...</div>;
  }

  const filteredUsers = users.filter(user => {
    const query = searchQuery.toLowerCase();
    const empIdMatch = user.empId?.toLowerCase().includes(query) || false;
    const nameMatch = user.username?.toLowerCase().includes(query) || false;
    const emailMatch = user.email?.toLowerCase().includes(query) || false;
    return empIdMatch || nameMatch || emailMatch;
  });

  return (
    <div className="min-h-screen bg-[#0a030d] text-white font-mono p-8 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-[#ff0055]/20 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-[#ff0055] tracking-tight drop-shadow-[0_0_10px_rgba(255,0,85,0.4)] uppercase">
              Sysadmin Overview
            </h1>
            <p className="text-sm text-zinc-400 mt-1">Global User Database & Telemetry Export</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => { window.location.href = '/api/sysadmin/export/all?type=logins'; }}
              className="px-4 py-2 bg-emerald-900/30 border border-emerald-500/50 hover:bg-emerald-500/20 text-emerald-400 rounded text-sm font-bold tracking-wide transition-all uppercase flex items-center gap-2"
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M14 11V14H2V11M8 2V11M8 11L5 8M8 11L11 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              All Logins (CSV)
            </button>
            <button 
              onClick={() => { window.location.href = '/api/sysadmin/export/all?type=scores'; }}
              className="px-4 py-2 bg-[#ff0055]/10 border border-[#ff0055]/30 hover:bg-[#ff0055]/20 text-[#ff0055] rounded text-sm font-bold tracking-wide transition-all uppercase flex items-center gap-2"
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M14 11V14H2V11M8 2V11M8 11L5 8M8 11L11 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              All Scores (CSV)
            </button>
            <button 
              onClick={() => { window.location.href = '/api/sysadmin/export/all?type=evaluations'; }}
              className="px-4 py-2 bg-blue-900/30 border border-blue-500/50 hover:bg-blue-500/20 text-blue-400 rounded text-sm font-bold tracking-wide transition-all uppercase flex items-center gap-2"
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M14 11V14H2V11M8 2V11M8 11L5 8M8 11L11 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Evaluations (CSV)
            </button>
            <button 
              onClick={() => router.push('/')}
              className="px-4 py-2 bg-zinc-900 border border-zinc-700 hover:border-zinc-500 rounded text-sm font-bold tracking-wide transition-all uppercase flex items-center gap-2"
            >
              <span className="text-[#ff0055]">{'<'}</span> Back to Hub
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-[#0e0411]/80 backdrop-blur-xl border border-zinc-800 rounded-xl p-4 shadow-lg flex items-center gap-3">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-500">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            placeholder="Search by Username, Email, or Emp ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent border-none text-zinc-200 focus:outline-none focus:ring-0 placeholder-zinc-600"
          />
        </div>

        <div className="bg-[#0e0411]/80 backdrop-blur-xl border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto cyber-scrollbar">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-[#1a0815] text-[#ff0055] uppercase tracking-wider text-xs font-bold border-b border-zinc-800">
                <tr>
                  <th className="px-6 py-5">Status</th>
                  <th className="px-6 py-5">Emp ID</th>
                  <th className="px-6 py-5">Email</th>
                  <th className="px-6 py-5">Username</th>
                  <th className="px-6 py-5">Total Logins</th>
                  <th className="px-6 py-5">Correct Answers</th>
                  <th className="px-6 py-5">Duels Won</th>
                  <th className="px-6 py-5 text-center">Actions</th>
                  <th className="px-6 py-5 text-right">Data Export</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {filteredUsers.map(user => (
                  <tr key={user._id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-2.5 h-2.5 rounded-full ${user.isOnline ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-red-500/30'}`} />
                        <span className="text-xs font-semibold text-zinc-400">{user.isOnline ? 'ONLINE' : 'OFFLINE'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-zinc-300">{user.empId || <span className="text-zinc-600 font-normal italic">N/A</span>}</td>
                    <td className="px-6 py-4 text-zinc-400 text-sm">{user.email || <span className="text-zinc-600 font-normal italic">No email</span>}</td>
                    <td className="px-6 py-4 font-bold text-[#ff0055]">{user.username || <span className="text-zinc-600 font-normal italic">Unregistered</span>}</td>
                    <td className="px-6 py-4 font-semibold">{user.loginHistory?.length || 0}</td>
                    <td className="px-6 py-4 font-semibold text-emerald-400">{user.metrics?.correctAnswers || 0}</td>
                    <td className="px-6 py-4 font-semibold text-amber-400">{user.metrics?.duelsWon || 0}</td>
                    <td className="px-6 py-4 text-center">
                       <button
                         onClick={() => handleForceRename(user._id, user.empId, user.username)}
                         className="px-3 py-1 text-xs font-bold bg-amber-500/10 border border-amber-500/30 text-amber-500 hover:bg-amber-500 hover:text-black rounded transition-all"
                       >
                         WARN / RENAME
                       </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {user.username ? (
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleDownload(user.username!, 'logins')}
                            className="px-3 py-1.5 text-xs font-bold bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 rounded-lg transition-colors border border-zinc-700 flex items-center gap-1"
                          >
                            <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M14 11V14H2V11M8 2V11M8 11L5 8M8 11L11 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            LOGINS
                          </button>
                          <button
                            onClick={() => handleDownload(user.username!, 'metrics')}
                            className="px-3 py-1.5 text-xs font-bold bg-[#ff0055]/10 border border-[#ff0055]/30 hover:bg-[#ff0055] text-[#ff0055] hover:text-white rounded-lg transition-all flex items-center gap-1"
                          >
                            <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M14 11V14H2V11M8 2V11M8 11L5 8M8 11L11 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            METRICS
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-zinc-600 italic">No data</span>
                      )}
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-zinc-500 font-semibold">
                      NO USER RECORDS FOUND IN MAINFRAME.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
