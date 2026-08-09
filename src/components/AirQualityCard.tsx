import React from 'react';
import { Activity, Wind, Flame, ShieldAlert, Sparkles } from 'lucide-react';
import { TelemetryData } from '../types';

interface AirQualityCardProps {
  telemetry: TelemetryData;
}

export const AirQualityCard: React.FC<AirQualityCardProps> = ({ telemetry }) => {
  const getAqiBadgeColor = (aqi: number) => {
    if (aqi < 50) return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    if (aqi < 100) return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
    return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
  };

  return (
    <div className="glass-card p-6 rounded-3xl space-y-4 flex flex-col justify-between border border-slate-800 shadow-xl">
      <div className="flex justify-between items-center">
        <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <Activity className="w-4 h-4 text-emerald-400" /> Air Quality & Greenhouse Gases
        </span>
        <span className={`px-2.5 py-1 text-xs font-bold rounded-full border ${getAqiBadgeColor(telemetry.aqi)}`}>
          US AQI: {telemetry.aqi} ({telemetry.aqiCategory})
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800">
          <p className="text-xs text-slate-400 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-teal-400" /> CO₂ Column
          </p>
          <p className="text-xl font-black text-teal-300 mt-1">{telemetry.co2} ppm</p>
          <span className="text-[10px] text-slate-500">Global Mean ~421 ppm</span>
        </div>

        <div className="bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800">
          <p className="text-xs text-slate-400 flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-amber-400" /> Methane (CH₄)
          </p>
          <p className="text-xl font-black text-amber-300 mt-1">{telemetry.methane} ppb</p>
          <span className="text-[10px] text-slate-500">Tropospheric Column</span>
        </div>

        <div className="bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800">
          <p className="text-xs text-slate-400 flex items-center gap-1">
            <Wind className="w-3.5 h-3.5 text-emerald-400" /> Pollen & Allergens
          </p>
          <p className="text-base font-extrabold text-emerald-300 mt-1">{telemetry.pollen}</p>
          <span className="text-[10px] text-slate-500">Local Bio-Telemetry</span>
        </div>

        <div className="bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800">
          <p className="text-xs text-slate-400 flex items-center gap-1">
            <ShieldAlert className="w-3.5 h-3.5 text-sky-400" /> Ground Ozone (O₃)
          </p>
          <p className="text-xl font-black text-sky-300 mt-1">{telemetry.ozone} ppb</p>
          <span className="text-[10px] text-slate-500">PM2.5: {telemetry.pm25} µg/m³</span>
        </div>
      </div>

      <div className="pt-2 border-t border-slate-800/80 flex justify-between items-center text-[11px] text-slate-400">
        <span>PM10 Fine Particulate: <strong className="text-slate-200">{telemetry.pm10} µg/m³</strong></span>
        <span className="text-emerald-400 font-semibold">Sensor Health: Nominal</span>
      </div>
    </div>
  );
};
