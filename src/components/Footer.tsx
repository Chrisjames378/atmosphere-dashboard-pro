import React from 'react';
import { Satellite, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-8 pt-6 border-t border-slate-800 text-center text-xs text-slate-500 space-y-2">
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 text-slate-400 font-medium">
        <span className="flex items-center gap-1.5">
          <Satellite className="w-3.5 h-3.5 text-indigo-400" /> Geostationary Radar Telemetry active
        </span>
        <span className="hidden sm:inline">•</span>
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Verra VCS & Gold Standard Audited
        </span>
      </div>
      <p>
        Atmosphere Dashboard Pro • High Sierra & Modern Browser Compatible Static Application Stack
      </p>
    </footer>
  );
};
