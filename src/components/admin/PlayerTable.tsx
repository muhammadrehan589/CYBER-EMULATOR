'use client';

import React from 'react';
import { Player, PlayerStatus } from '@/types/admin';
import { 
  Search, 
  Filter, 
  UserX, 
  UserCheck, 
  Activity, 
  ShieldAlert, 
  ShieldCheck,
  Building2,
  ChevronRight
} from 'lucide-react';

interface PlayerTableProps {
  players: Player[];
  selectedPlayer: Player | null;
  onSelectPlayer: (player: Player) => void;
  onToggleStatus: (empId: string) => void;
  onOpenAddModal: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedDepartment: string;
  onDepartmentChange: (dept: string) => void;
  departments: string[];
}

export const PlayerTable: React.FC<PlayerTableProps> = ({
  players,
  selectedPlayer,
  onSelectPlayer,
  onToggleStatus,
  onOpenAddModal,
  searchQuery,
  onSearchChange,
  selectedDepartment,
  onDepartmentChange,
  departments,
}) => {
  return (
    <div className="w-full bg-[#0a030d]/80 rounded-2xl border border-[#ff0055]/30 p-6 backdrop-blur-xl shadow-[0_0_30px_rgba(255,0,85,0.15)] flex flex-col space-y-5">
      {/* Controls Bar: Search, Department Filter, Add Player Button */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Search & Department Filters */}
        <div className="flex flex-1 flex-col sm:flex-row items-center gap-3">
          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#ff0055]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by ID, Name, Username..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#050008] rounded-xl border border-[#ff0055]/30 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-[#ff0055] focus:ring-1 focus:ring-[#ff0055]/40 transition-all"
            />
          </div>

          {/* Department Select Dropdown */}
          <div className="relative w-full sm:w-52">
            <Filter className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <select
              value={selectedDepartment}
              onChange={(e) => onDepartmentChange(e.target.value)}
              className="w-full pl-10 pr-8 py-2.5 bg-[#050008] rounded-xl border border-[#ff0055]/30 text-white text-xs focus:outline-none focus:border-[#ff0055] transition-all appearance-none cursor-pointer"
            >
              <option value="ALL">All Departments</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Add Player Action Button */}
        <button
          onClick={onOpenAddModal}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#ff0055] to-[#e60039] hover:from-[#e60039] hover:to-[#ff0055] text-white text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2 shadow-[0_0_15px_#ff0055] border border-white/20 transition-all active:scale-95"
        >
          + Add New Player
        </button>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-[#050008]">
        <table className="w-full text-left text-xs text-zinc-300 border-collapse">
          {/* Table Header */}
          <thead className="bg-[#120414] border-b border-[#ff0055]/30 text-[11px] uppercase tracking-wider font-mono text-[#ff0055]">
            <tr>
              <th className="p-3.5 pl-4">EMP ID</th>
              <th className="p-3.5">NAME & USERNAME</th>
              <th className="p-3.5">DEPARTMENT</th>
              <th className="p-3.5">ROLE</th>
              <th className="p-3.5">SCORE</th>
              <th className="p-3.5">STATUS</th>
              <th className="p-3.5 pr-4 text-right">ACTIONS</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-zinc-800/80">
            {players.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-zinc-500 font-mono text-xs">
                  No records match the current filter criteria.
                </td>
              </tr>
            ) : (
              players.map((player) => {
                const isSelected = selectedPlayer?.empId === player.empId;
                const isSuspended = player.status === 'suspended';

                return (
                  <tr
                    key={player.empId}
                    onClick={() => onSelectPlayer(player)}
                    className={`transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[#1e0720] border-l-4 border-l-[#ff0055]'
                        : 'hover:bg-[#120315]'
                    }`}
                  >
                    {/* Employee ID */}
                    <td className="p-3.5 pl-4 font-mono font-bold text-white">
                      {player.empId}
                    </td>

                    {/* Name & Username */}
                    <td className="p-3.5">
                      <div className="flex flex-col">
                        <span className="font-semibold text-white">{player.name}</span>
                        <span className="text-[10px] font-mono text-zinc-400">@{player.username}</span>
                      </div>
                    </td>

                    {/* Department */}
                    <td className="p-3.5">
                      <div className="flex items-center gap-1.5 text-zinc-300">
                        <Building2 className="w-3.5 h-3.5 text-zinc-500" />
                        <span>{player.department}</span>
                      </div>
                    </td>

                    {/* Role Badge */}
                    <td className="p-3.5">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                          player.role === 'Admin'
                            ? 'bg-[#ff0055]/20 text-[#ff0055] border border-[#ff0055]/50'
                            : player.role === 'VIP'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                            : player.role === 'Guard'
                            ? 'bg-red-900/40 text-red-400 border border-red-800'
                            : 'bg-zinc-800 text-zinc-300'
                        }`}
                      >
                        {player.role}
                      </span>
                    </td>

                    {/* Score */}
                    <td className="p-3.5 font-mono font-bold text-white">
                      {player.score.toLocaleString()} PTS
                    </td>

                    {/* Status Badge */}
                    <td className="p-3.5">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                          isSuspended
                            ? 'bg-red-950/80 text-red-500 border border-red-600/50 animate-pulse'
                            : 'bg-emerald-950/80 text-emerald-400 border border-emerald-600/50'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${isSuspended ? 'bg-red-500' : 'bg-emerald-400'}`} />
                        {player.status.toUpperCase()}
                      </span>
                    </td>

                    {/* Action Buttons */}
                    <td className="p-3.5 pr-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2">
                        {/* Select Log Button */}
                        <button
                          onClick={() => onSelectPlayer(player)}
                          title="View Activity Log"
                          className={`p-1.5 rounded-lg border transition-all ${
                            isSelected
                              ? 'bg-[#ff0055] text-white border-[#ff0055]'
                              : 'bg-zinc-900 border-zinc-700 text-zinc-300 hover:border-[#ff0055] hover:text-[#ff0055]'
                          }`}
                        >
                          <Activity className="w-3.5 h-3.5" />
                        </button>

                        {/* Suspend / Activate Toggle Button */}
                        <button
                          onClick={() => onToggleStatus(player.empId)}
                          title={isSuspended ? 'Reactivate Player' : 'Suspend Player'}
                          className={`p-1.5 rounded-lg border transition-all ${
                            isSuspended
                              ? 'bg-emerald-950 text-emerald-400 border-emerald-600 hover:bg-emerald-900'
                              : 'bg-red-950 text-red-400 border-red-600 hover:bg-red-900'
                          }`}
                        >
                          {isSuspended ? (
                            <UserCheck className="w-3.5 h-3.5" />
                          ) : (
                            <UserX className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
