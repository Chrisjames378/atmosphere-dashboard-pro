import React, { useState } from 'react';
import { Bell, ShieldAlert, X, Check, Sliders } from 'lucide-react';

export interface AlertThresholds {
  maxAqi: number;
  maxTemp: number;
  maxCo2: number;
  enabled: boolean;
}

interface ThresholdsModalProps {
  thresholds: AlertThresholds;
  onSave: (newThresholds: AlertThresholds) => void;
  onClose: () => void;
}

export const ThresholdsModal: React.FC<ThresholdsModalProps> = ({ thresholds, onSave, onClose }) => {
  const [maxAqi, setMaxAqi] = useState(thresholds.maxAqi);
  const [maxTemp, setMaxTemp] = useState(thresholds.maxTemp);
  const [maxCo2, setMaxCo2] = useState(thresholds.maxCo2);
  const [enabled, setEnabled] = useState(thresholds.enabled);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ maxAqi, maxTemp, maxCo2, enabled });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden p-6 space-y-6">
        
        {/* Header */}
        <div className="flex justify-between items-center pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Telemetry Alert Thresholds</h3>
              <p className="text-xs text-slate-400">Receive warning banners when limits are breached</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Global Toggle */}
          <div className="flex justify-between items-center p-3 bg-slate-950 rounded-2xl border border-slate-800">
            <span className="text-xs font-bold text-slate-200 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400" /> Enable Threshold Warnings
            </span>
            <input
              type="checkbox"
              checked={enabled}
              onChange={(e) => setEnabled(e.target.checked)}
              className="w-4 h-4 accent-indigo-500 cursor-pointer rounded"
            />
          </div>

          {/* AQI Threshold */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-medium">Max Air Quality Index (AQI):</span>
              <span className="text-amber-400 font-bold font-mono">{maxAqi} AQI</span>
            </div>
            <input
              type="range"
              min="20"
              max="150"
              step="5"
              value={maxAqi}
              onChange={(e) => setMaxAqi(Number(e.target.value))}
              className="w-full accent-amber-500 bg-slate-950 rounded-lg cursor-pointer h-2"
            />
            <p className="text-[10px] text-slate-500">Alert triggers when local AQI exceeds {maxAqi}.</p>
          </div>

          {/* Temp Threshold */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-medium">Max Temperature Alert (°C):</span>
              <span className="text-rose-400 font-bold font-mono">{maxTemp}°C</span>
            </div>
            <input
              type="range"
              min="20"
              max="45"
              step="1"
              value={maxTemp}
              onChange={(e) => setMaxTemp(Number(e.target.value))}
              className="w-full accent-rose-500 bg-slate-950 rounded-lg cursor-pointer h-2"
            />
            <p className="text-[10px] text-slate-500">Alert triggers when heat exceeds {maxTemp}°C.</p>
          </div>

          {/* CO2 Threshold */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-medium">Max CO₂ Concentration (ppm):</span>
              <span className="text-purple-400 font-bold font-mono">{maxCo2} ppm</span>
            </div>
            <input
              type="range"
              min="400"
              max="500"
              step="5"
              value={maxCo2}
              onChange={(e) => setMaxCo2(Number(e.target.value))}
              className="w-full accent-purple-500 bg-slate-950 rounded-lg cursor-pointer h-2"
            />
            <p className="text-[10px] text-slate-500">Alert triggers when atmospheric CO₂ exceeds {maxCo2} ppm.</p>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 shadow-lg"
            >
              <Check className="w-4 h-4" />
              <span>Save Settings</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
