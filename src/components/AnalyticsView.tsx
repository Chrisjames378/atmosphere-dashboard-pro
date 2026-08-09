import React, { useState } from 'react';
import { BarChart3, TrendingUp, Sparkles, Activity, DollarSign } from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  LineChart,
  Line,
} from 'recharts';
import { HISTORICAL_ATMOSPHERIC_DATA } from '../data/mockData';

interface AnalyticsViewProps {
  location: string;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ location }) => {
  const [metricMode, setMetricMode] = useState<'co2' | 'aqi' | 'market'>('co2');

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="glass-card p-6 rounded-3xl border border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-indigo-400" /> Historical Atmospheric & Carbon Market Trends
          </h2>
          <p className="text-xs text-slate-400">
            Station Telemetry Analytics for <strong className="text-indigo-300">{location}</strong> • NOAA & WMO Aligned
          </p>
        </div>

        <div className="flex bg-slate-900/90 p-1 rounded-2xl border border-slate-800 text-xs">
          <button
            onClick={() => setMetricMode('co2')}
            className={`px-3 py-1.5 rounded-xl font-bold transition ${
              metricMode === 'co2' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            CO₂ & Temp
          </button>
          <button
            onClick={() => setMetricMode('aqi')}
            className={`px-3 py-1.5 rounded-xl font-bold transition ${
              metricMode === 'aqi' ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            AQI & CH₄
          </button>
          <button
            onClick={() => setMetricMode('market')}
            className={`px-3 py-1.5 rounded-xl font-bold transition ${
              metricMode === 'market' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Carbon Price ($/t)
          </button>
        </div>
      </div>

      {/* Main Chart Area */}
      <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex justify-between items-center text-xs">
          <span className="font-bold text-slate-300 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            {metricMode === 'co2' && 'Tropospheric CO₂ Concentration (ppm) vs Temperature (°C)'}
            {metricMode === 'aqi' && 'Air Quality Index (AQI) & Methane Concentration (ppb)'}
            {metricMode === 'market' && 'Global Carbon Offset Price ($/tonne CO₂e)'}
          </span>
          <span className="text-slate-500 font-mono text-[11px]">2026 YTD Stream</span>
        </div>

        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            {metricMode === 'co2' ? (
              <AreaChart data={HISTORICAL_ATMOSPHERIC_DATA}>
                <defs>
                  <linearGradient id="co2Gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                <YAxis domain={[415, 425]} stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                  labelStyle={{ color: '#f8fafc', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="co2" name="CO₂ (ppm)" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#co2Gradient)" />
              </AreaChart>
            ) : metricMode === 'aqi' ? (
              <BarChart data={HISTORICAL_ATMOSPHERIC_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                  labelStyle={{ color: '#f8fafc', fontWeight: 'bold' }}
                />
                <Bar dataKey="aqi" name="US AQI Index" fill="#14b8a6" radius={[6, 6, 0, 0]} />
              </BarChart>
            ) : (
              <LineChart data={HISTORICAL_ATMOSPHERIC_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                <YAxis domain={[10, 25]} stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                  labelStyle={{ color: '#f8fafc', fontWeight: 'bold' }}
                />
                <Line type="monotone" dataKey="creditsPrice" name="Price ($/t)" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Grid of Key Analytical Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-5 rounded-3xl border border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-xs text-slate-400">
            <span>CO₂ Annual Growth</span>
            <Sparkles className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-black text-white">+2.3 ppm/yr</div>
          <p className="text-[11px] text-indigo-300">Acceleration rate within global baseline standards.</p>
        </div>

        <div className="glass-card p-5 rounded-3xl border border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-xs text-slate-400">
            <span>Methane Anomaly Index</span>
            <Activity className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-300">1,912 ppb</div>
          <p className="text-[11px] text-slate-400">Tropospheric CH₄ column monitoring nominal.</p>
        </div>

        <div className="glass-card p-5 rounded-3xl border border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-xs text-slate-400">
            <span>Carbon Offsets Retired</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">220,000+ tCO₂e</div>
          <p className="text-[11px] text-emerald-300">Across verified Gold Standard projects worldwide.</p>
        </div>
      </div>

    </div>
  );
};
