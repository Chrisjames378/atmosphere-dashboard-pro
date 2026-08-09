import React, { useState } from 'react';
import { Leaf, Sun, Bike, Trees, Recycle, Zap, PlusCircle, CheckCircle2, Award } from 'lucide-react';
import { ECO_ACTION_ITEMS } from '../data/mockData';
import { EcoAction } from '../types';

interface EcoActionLoggerProps {
  onAddCredits: (amount: number, reason: string) => void;
  creditsBalance: number;
}

export const EcoActionLogger: React.FC<EcoActionLoggerProps> = ({ onAddCredits, creditsBalance }) => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [customTitle, setCustomTitle] = useState('');
  const [customCredits, setCustomCredits] = useState(10);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'sun':
        return <Sun className="w-4 h-4 text-amber-400" />;
      case 'bike':
        return <Bike className="w-4 h-4 text-emerald-400" />;
      case 'trees':
        return <Trees className="w-4 h-4 text-teal-400" />;
      case 'recycle':
        return <Recycle className="w-4 h-4 text-sky-400" />;
      default:
        return <Zap className="w-4 h-4 text-indigo-400" />;
    }
  };

  const handleLog = (action: EcoAction) => {
    onAddCredits(action.credits, action.title);
    setToastMessage(`+${action.credits} Carbon Credits awarded for "${action.title}"!`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customTitle.trim() && customCredits > 0) {
      onAddCredits(customCredits, customTitle.trim());
      setToastMessage(`+${customCredits} Carbon Credits awarded for "${customTitle.trim()}"!`);
      setCustomTitle('');
      setIsCustomModalOpen(false);
      setTimeout(() => setToastMessage(null), 3500);
    }
  };

  return (
    <div className="glass-card p-6 rounded-3xl space-y-4 bg-gradient-to-br from-emerald-950/40 via-slate-900/90 to-slate-950 border border-emerald-500/30 shadow-xl relative overflow-hidden flex flex-col justify-between">
      
      {/* Toast Banner */}
      {toastMessage && (
        <div className="absolute top-2 left-2 right-2 bg-emerald-500 text-slate-950 font-bold px-4 py-2.5 rounded-2xl shadow-2xl z-20 flex items-center justify-between text-xs animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-slate-950 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <Award className="w-4 h-4 text-slate-950 shrink-0" />
        </div>
      )}

      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
            <Leaf className="w-4 h-4 text-emerald-400" /> Eco Action Logger
          </span>
          <span className="text-xs text-emerald-300 font-mono font-bold bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-500/40">
            Wallet: {creditsBalance} Credits
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Log verified sustainable daily actions to earn tradeable Carbon Credits redeemable in the marketplace or for certified tree planting.
        </p>
      </div>

      {/* Preset Action Buttons */}
      <div className="space-y-2 pt-2">
        {ECO_ACTION_ITEMS.slice(0, 3).map((action) => (
          <button
            key={action.id}
            onClick={() => handleLog(action)}
            className="w-full py-2.5 px-3.5 bg-slate-900/80 hover:bg-emerald-950/60 text-white font-bold text-xs rounded-xl transition flex items-center justify-between border border-slate-700/80 hover:border-emerald-500/50 group"
          >
            <span className="flex items-center gap-2.5">
              {getIcon(action.iconName)}
              <span className="group-hover:text-emerald-200 transition">{action.title}</span>
            </span>
            <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 font-mono rounded-lg border border-emerald-500/30 text-[11px]">
              +{action.credits} Credits
            </span>
          </button>
        ))}
      </div>

      {/* Custom Action Trigger */}
      <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
        <button
          onClick={() => setIsCustomModalOpen(true)}
          className="text-xs text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1.5 transition"
        >
          <PlusCircle className="w-3.5 h-3.5" /> Log Custom Eco Activity
        </button>
        <span className="text-[10px] text-slate-400">Verra Standard Compliant</span>
      </div>

      {/* Custom Log Modal */}
      {isCustomModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 p-6 rounded-3xl max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
              <Leaf className="w-5 h-5 text-emerald-400" /> Log Custom Eco Action
            </h3>
            <form onSubmit={handleCustomSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Activity Title / Description
                </label>
                <input
                  type="text"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  placeholder="e.g. Installed LED lighting retrofit or home composting"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Estimated Carbon Impact (Credits to Claim)
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={customCredits}
                  onChange={(e) => setCustomCredits(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                  required
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCustomModalOpen(false)}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition"
                >
                  Claim Credits
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
