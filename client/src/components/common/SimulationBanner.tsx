import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Mail, CheckCircle2, ExternalLink, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const SimulationBanner: React.FC = () => {
  const { simulationNotice, clearSimulationNotice } = useAuth();
  const navigate = useNavigate();

  if (!simulationNotice) return null;

  const handleSimulateClick = () => {
    clearSimulationNotice();
    navigate(simulationNotice);
  };

  return (
    <div className="bg-gradient-to-r from-brand-900/90 to-purple-900/90 border-b border-brand-500/30 text-slate-100 px-4 py-3 shadow-lg flex items-center justify-between text-sm backdrop-blur-md relative z-40">
      <div className="flex items-center gap-3">
        <div className="p-1.5 bg-brand-500/20 rounded-lg text-brand-300">
          <Mail className="w-4 h-4 animate-pulse" />
        </div>
        <div>
          <span className="font-semibold text-brand-200">Email Verification Simulation:</span>
          <span className="ml-2 text-slate-300 hidden sm:inline">
            In production, a link is sent via SMTP. Click below to verify instantly!
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={handleSimulateClick}
          className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-500 hover:bg-brand-400 text-white rounded-lg text-xs font-semibold shadow-md transition-colors"
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          Simulate 1-Click Verify
          <ExternalLink className="w-3 h-3 ml-0.5" />
        </button>
        <button
          onClick={clearSimulationNotice}
          className="p-1 text-slate-400 hover:text-white rounded-lg"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
