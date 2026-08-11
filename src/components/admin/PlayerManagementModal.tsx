'use client';

import React, { useState } from 'react';
import { Player, PlayerRole } from '@/types/admin';
import { X, UserPlus, Shield, Building2, User, Hash, AlertCircle } from 'lucide-react';

interface PlayerManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPlayer: (player: Omit<Player, 'status' | 'score' | 'joinedAt'>) => void;
  departments: string[];
}

export const PlayerManagementModal: React.FC<PlayerManagementModalProps> = ({
  isOpen,
  onClose,
  onAddPlayer,
  departments,
}) => {
  const [empId, setEmpId] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [department, setDepartment] = useState(departments[0] || 'Engineering');
  const [role, setRole] = useState<PlayerRole>('Player');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!empId.trim() || !name.trim() || !username.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    onAddPlayer({
      empId: empId.trim(),
      name: name.trim(),
      username: username.trim().replace(/^@/, ''),
      department,
      role,
    });

    // Reset form
    setEmpId('');
    setName('');
    setUsername('');
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-lg bg-[#0a030d] rounded-2xl border-2 border-[#ff0055]/60 p-6 lg:p-8 shadow-[0_0_50px_rgba(255,0,85,0.4)] relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-[#1a051d] text-zinc-400 hover:text-white hover:border-[#ff0055] border border-transparent transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <UserPlus className="w-5 h-5 text-[#ff0055]" />
            <span className="text-xs font-mono font-bold text-[#ff0055] uppercase tracking-widest">
              CONTROL ROOM REGISTRATION
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            Register New Player / Personnel
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Assign employee credentials and permissions for the cyber-emulator grid.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/60 border border-red-600 text-xs text-red-400 flex items-center gap-2 font-mono">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Employee ID & Role Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Emp ID */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-semibold text-zinc-300 flex items-center gap-1">
                <Hash className="w-3.5 h-3.5 text-[#ff0055]" />
                <span>EMPLOYEE ID *</span>
              </label>
              <input
                type="text"
                value={empId}
                onChange={(e) => setEmpId(e.target.value)}
                placeholder="EMP-456"
                required
                className="w-full px-3.5 py-2.5 bg-[#050008] rounded-xl border border-[#ff0055]/40 text-white placeholder-zinc-500 text-xs font-mono focus:outline-none focus:border-[#ff0055] focus:ring-1 focus:ring-[#ff0055]/30 transition-all"
              />
            </div>

            {/* Role */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-semibold text-zinc-300 flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-[#ff0055]" />
                <span>ROLE *</span>
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as PlayerRole)}
                className="w-full px-3.5 py-2.5 bg-[#050008] rounded-xl border border-[#ff0055]/40 text-white text-xs font-mono focus:outline-none focus:border-[#ff0055] transition-all cursor-pointer"
              >
                <option value="Player">Player</option>
                <option value="Admin">Admin</option>
                <option value="Guard">Guard</option>
                <option value="VIP">VIP</option>
              </select>
            </div>
          </div>

          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-semibold text-zinc-300 flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-[#ff0055]" />
              <span>FULL NAME *</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Seong Gi-hun"
              required
              className="w-full px-3.5 py-2.5 bg-[#050008] rounded-xl border border-[#ff0055]/40 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-[#ff0055] focus:ring-1 focus:ring-[#ff0055]/30 transition-all"
            />
          </div>

          {/* Username & Department Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Username */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-semibold text-zinc-300 flex items-center gap-1">
                <span>@</span>
                <span>USERNAME *</span>
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="player456"
                required
                className="w-full px-3.5 py-2.5 bg-[#050008] rounded-xl border border-[#ff0055]/40 text-white placeholder-zinc-500 text-xs font-mono focus:outline-none focus:border-[#ff0055] focus:ring-1 focus:ring-[#ff0055]/30 transition-all"
              />
            </div>

            {/* Department */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-semibold text-zinc-300 flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-[#ff0055]" />
                <span>DEPARTMENT *</span>
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#050008] rounded-xl border border-[#ff0055]/40 text-white text-xs font-mono focus:outline-none focus:border-[#ff0055] transition-all cursor-pointer"
              >
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
                <option value="Operations">Operations</option>
                <option value="Intelligence">Intelligence</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-300 text-xs font-mono hover:bg-zinc-800 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#ff0055] to-[#e60039] hover:from-[#e60039] hover:to-[#ff0055] text-white text-xs font-bold font-mono uppercase tracking-wider shadow-[0_0_15px_#ff0055] border border-white/20 transition-all active:scale-95"
            >
              Add Player
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
