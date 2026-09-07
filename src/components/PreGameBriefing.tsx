import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, AlertTriangle, ShieldCheck, Terminal, Server, X } from 'lucide-react';

interface PreGameBriefingProps {
  onAcknowledge: () => void;
  isFirstTime?: boolean;
}

export const PreGameBriefing: React.FC<PreGameBriefingProps> = ({ onAcknowledge, isFirstTime = false }) => {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-4xl bg-[#0a0a0a] border border-[#ff0055]/50 rounded-2xl shadow-[0_0_50px_rgba(255,0,85,0.2)] overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="bg-[#111] border-b border-[#ff0055]/30 p-6 flex justify-between items-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[#ff0055]/5 animate-pulse pointer-events-none"></div>
          <div className="flex items-center gap-4 relative z-10">
            <ShieldAlert className="w-10 h-10 text-[#ff0055]" strokeWidth={1.5} />
            <div>
              <h2 className="text-2xl font-black font-mono text-white tracking-widest uppercase">
                System Briefing
              </h2>
              <p className="text-[#ff0055] font-mono text-xs tracking-widest uppercase mt-1">
                Zero Day Educational & Tactical Overview
              </p>
            </div>
          </div>
          {!isFirstTime && (
            <button onClick={onAcknowledge} className="text-[#ff0055]/50 hover:text-[#ff0055] transition-colors relative z-10">
              <X className="w-8 h-8" strokeWidth={2.5} />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto custom-scrollbar flex flex-col gap-8 text-gray-300 font-mono text-sm leading-relaxed">
          
          {/* Section 1 */}
          <div className="flex gap-6">
            <div className="hidden sm:flex flex-col items-center gap-2 text-[#ff0055]/50 pt-1">
              <Server className="w-6 h-6" />
              <div className="w-px h-full bg-[#ff0055]/20"></div>
            </div>
            <div>
              <h3 className="text-white font-bold text-lg mb-3 tracking-wider uppercase border-l-2 border-[#ff0055] pl-3">Understanding the Digital World</h3>
              <p className="mb-4">
                In today's interconnected society, the internet is as vital as electricity or water. From our personal messages and bank accounts to hospitals, grocery supply chains, and power grids—everything relies on digital networks. Unfortunately, this means that digital systems have become a major target for disruptions and criminal activities. 
              </p>
              <p className="mb-4">
                Cybersecurity is no longer just a technical issue for IT departments; it is a fundamental pillar of modern safety. When systems go down, the real-world impact is immediate and severe. Small businesses face bankruptcy, hospitals are forced to turn away patients, and entire cities can experience crippling service outages. 
              </p>
              <ul className="space-y-3 list-none pl-0">
                <li className="flex items-start gap-2">
                  <span className="text-[#ff0055] mt-1">▸</span>
                  <span><strong>Financial Impact:</strong> Online fraud and ransom demands cost the global economy trillions of dollars each year, hurting both large organizations and everyday individuals.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#ff0055] mt-1">▸</span>
                  <span><strong>Service Disruption:</strong> Malicious software can lock important files, preventing doctors from accessing medical records or delaying emergency response times.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#ff0055] mt-1">▸</span>
                  <span><strong>Infrastructure Risk:</strong> Vital community resources like water treatment facilities and energy grids require constant protection from sophisticated digital threats.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Section 2 */}
          <div className="flex gap-6">
            <div className="hidden sm:flex flex-col items-center gap-2 text-[#ff0055]/50 pt-1">
              <AlertTriangle className="w-6 h-6" />
              <div className="w-px h-full bg-[#ff0055]/20"></div>
            </div>
            <div>
              <h3 className="text-white font-bold text-lg mb-3 tracking-wider uppercase border-l-2 border-[#ff0055] pl-3">The Purpose of ZERO DAY</h3>
              <p className="mb-3">
                Automated defenses like firewalls and antivirus programs are important, but they are not enough. The most critical line of defense is human awareness and quick decision-making. People from all backgrounds—not just computer scientists—must understand how to identify threats, respond effectively, and protect their digital environments.
              </p>
              <p className="mb-3">
                <strong>ZERO DAY</strong> was built to bridge this gap. It is an interactive, gamified simulation that allows anyone to experience the fast-paced nature of digital defense in a safe, controlled environment. 
              </p>
              <p>
                By participating in these simulations, you will learn how to spot suspicious activities, manage digital resources under pressure, and understand the critical thinking required to keep systems safe. Whether you are an expert or a beginner, this experience is designed to sharpen your awareness and teach you the value of a strong digital defense.
              </p>
            </div>
          </div>

          {/* Section 3 */}
          <div className="flex gap-6">
            <div className="hidden sm:flex flex-col items-center gap-2 text-[#ff0055]/50 pt-1">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg mb-3 tracking-wider uppercase border-l-2 border-[#ff0055] pl-3">Participation Guidelines</h3>
              <p className="mb-4">
                As you enter the simulation, remember that the scenarios you encounter are inspired by real events. Approach the challenges with curiosity and a willingness to learn. You will be matched with other participants in educational exercises to test your problem-solving skills.
              </p>
              
              {isFirstTime && (
                <div className="bg-[#111] border border-white/10 rounded-lg p-4 font-mono text-xs">
                  <p className="text-[#ff0055] mb-2 font-bold tracking-widest">INITIALIZATION CHECKLIST:</p>
                  <p className="mb-1">1. You are about to enter a live, competitive learning environment.</p>
                  <p className="mb-1">2. Your performance will be tracked through XP (Experience Points) and Coins.</p>
                  <p>3. Have fun, stay sharp, and remember that cybersecurity is a shared responsibility.</p>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Footer */}
        {isFirstTime && (
          <div className="bg-[#111] border-t border-[#ff0055]/30 p-6 flex justify-between items-center mt-auto">
            <div className="flex items-center gap-2 text-[#ff0055]/50 font-mono text-xs">
              <Terminal className="w-4 h-4 animate-pulse" />
              <span>AWAITING CONFIRMATION...</span>
            </div>
            
            <button 
              onClick={onAcknowledge}
              className="bg-[#ff0055] hover:bg-white text-white hover:text-[#ff0055] border-2 border-transparent hover:border-[#ff0055] font-black font-mono tracking-widest uppercase px-8 py-4 rounded-lg shadow-[0_0_20px_rgba(255,0,85,0.4)] hover:shadow-[0_0_30px_rgba(255,255,255,0.6)] transition-all flex items-center gap-3 active:scale-95"
            >
              Acknowledge & Initialize
            </button>
          </div>
        )}

      </motion.div>
    </div>
  );
};
