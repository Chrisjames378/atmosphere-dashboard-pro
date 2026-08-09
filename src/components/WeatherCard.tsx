import React from 'react';
import { CloudSun, Wind, Droplets, Gauge, MapPin, Thermometer } from 'lucide-react';
import { TelemetryData } from '../types';

interface WeatherCardProps {
  telemetry: TelemetryData;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({ telemetry }) => {
  return (
    <div className="glass-card p-6 rounded-3xl space-y-4 relative overflow-hidden flex flex-col justify-between border border-slate-800 shadow-xl">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-indigo-400" />
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            {telemetry.location} Telemetry
          </span>
        </div>
        <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded-full border border-emerald-500/30 flex items-center gap-1.5">
          <span className="w-2 h-2 bg-emerald-400 rounded-full animate-ping"></span> Live Station
        </span>
      </div>

      <div className="flex items-baseline justify-between pt-1">
        <div>
          <div className="text-5xl font-black text-white tracking-tight flex items-baseline gap-1">
            {telemetry.temperature}°C
            <span className="text-xs text-slate-400 font-normal">Feels like {telemetry.feelsLike}°C</span>
          </div>
          <p className="text-xs text-indigo-300 mt-1.5 font-medium flex items-center gap-2">
            <span>{telemetry.condition}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Wind className="w-3.5 h-3.5 text-slate-400" /> Wind {telemetry.windSpeed} km/h {telemetry.windDirection}
            </span>
          </p>
        </div>
        <div className="p-3 bg-amber-500/10 rounded-2xl border border-amber-500/20">
          <CloudSun className="w-14 h-14 text-amber-400 drop-shadow-md" />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-800 text-xs">
        <div className="bg-slate-900/60 p-3 rounded-2xl border border-slate-800/80">
          <p className="text-slate-400 text-[11px] flex items-center gap-1">
            <Droplets className="w-3 h-3 text-sky-400" /> Humidity
          </p>
          <p className="font-bold text-white text-base mt-0.5">{telemetry.humidity}%</p>
        </div>

        <div className="bg-slate-900/60 p-3 rounded-2xl border border-slate-800/80">
          <p className="text-slate-400 text-[11px] flex items-center gap-1">
            <Gauge className="w-3 h-3 text-emerald-400" /> Pressure
          </p>
          <p className="font-bold text-white text-base mt-0.5">{telemetry.pressure} hPa</p>
        </div>

        <div className="bg-slate-900/60 p-3 rounded-2xl border border-slate-800/80 col-span-2 sm:col-span-1">
          <p className="text-slate-400 text-[11px] flex items-center gap-1">
            <Thermometer className="w-3 h-3 text-indigo-400" /> Station Dew
          </p>
          <p className="font-bold text-white text-base mt-0.5">{(telemetry.temperature - (100 - telemetry.humidity)/5).toFixed(1)}°C</p>
        </div>
      </div>
    </div>
  );
};
