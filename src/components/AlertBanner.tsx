import React from 'react';
import { ShieldAlert, AlertTriangle, X, Sliders, Thermometer, Wind } from 'lucide-react';
import { TelemetryData } from '../types';
import { AlertThresholds } from './ThresholdsModal';

interface AlertBannerProps {
  telemetry: TelemetryData;
  thresholds: AlertThresholds;
  onOpenThresholds: () => void;
  onDismiss: () => void;
}

export const AlertBanner: React.FC<AlertBannerProps> = ({
  telemetry,
  thresholds,
  onOpenThresholds,
  onDismiss,
}) => {
  if (!thresholds.enabled) return null;

  const alerts: { type: string; title: string; desc: string; icon: React.ReactNode; color: string }[] = [];

  if (telemetry.aqi > thresholds.maxAqi) {
    alerts.push({
      type: 'aqi',
      title: `High Air Quality Warning (${telemetry.aqi} AQI)`,
      desc: `Current AQI in ${telemetry.location} exceeds threshold limit (${thresholds.maxAqi}). Wear an N95 mask outdoors.`,
      icon: <Wind className="w-4 h-4 text-amber-400" />,
      color: 'border-amber-500/50 bg-amber-950/40 text-amber-200',
    });
  }

  if (telemetry.temperature > thresholds.maxTemp) {
    alerts.push({
      type: 'temp',
      title: `Excessive Heat Warning (${telemetry.temperature}°C)`,
      desc: `Temperature in ${telemetry.location} exceeds safety threshold (${thresholds.maxTemp}°C). Stay hydrated and minimize direct sun exposure.`,
      icon: <Thermometer className="w-4 h-4 text-rose-400" />,
      color: 'border-rose-500/50 bg-rose-950/40 text-rose-200',
    });
  }

  const co2Num = parseFloat(telemetry.co2);
  if (!isNaN(co2Num) && co2Num > thresholds.maxCo2) {
    alerts.push({
      type: 'co2',
      title: `Elevated CO₂ Concentration (${telemetry.co2} ppm)`,
      desc: `Atmospheric CO₂ level in ${telemetry.location} exceeds target limit (${thresholds.maxCo2} ppm). Consider logging carbon offset actions.`,
      icon: <AlertTriangle className="w-4 h-4 text-purple-400" />,
      color: 'border-purple-500/50 bg-purple-950/40 text-purple-200',
    });
  }

  if (alerts.length === 0) return null;

  return (
    <div className="space-y-2 animate-in slide-in-from-top duration-300">
      {alerts.map((item, idx) => (
        <div
          key={idx}
          className={`p-4 rounded-2xl border ${item.color} shadow-lg flex items-start justify-between gap-3 backdrop-blur-md`}
        >
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-700/60 shrink-0">
              {item.icon}
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider">{item.title}</span>
                <span className="px-1.5 py-0.2 bg-rose-500/20 text-rose-300 text-[9px] font-mono font-bold rounded">
                  BREACH
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-snug">{item.desc}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onOpenThresholds}
              className="px-2.5 py-1 bg-slate-900/80 hover:bg-slate-800 text-slate-200 text-[11px] font-semibold rounded-lg border border-slate-700 transition flex items-center gap-1"
            >
              <Sliders className="w-3 h-3 text-amber-400" />
              <span className="hidden sm:inline">Settings</span>
            </button>
            <button
              onClick={onDismiss}
              className="p-1 text-slate-400 hover:text-white transition rounded-lg hover:bg-slate-900/60"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
