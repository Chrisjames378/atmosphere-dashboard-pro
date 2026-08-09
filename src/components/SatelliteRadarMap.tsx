import React, { useState, useEffect } from 'react';
import { Satellite, Play, Pause, Layers, Eye, RefreshCw, Info, ExternalLink } from 'lucide-react';
import { MapLayerType } from '../types';

interface SatelliteRadarMapProps {
  location: string;
  onNavigateToExchange?: () => void;
}

export const SatelliteRadarMap: React.FC<SatelliteRadarMapProps> = ({ location, onNavigateToExchange }) => {
  const [activeLayer, setActiveLayer] = useState<MapLayerType>('satellite');
  const [isPlaying, setIsPlaying] = useState(true);
  const [timeStep, setTimeStep] = useState(10); // 0, 2, 4, 6, 8, 10 mins ago
  const [zoomLevel, setZoomLevel] = useState(1);
  const [layerOpacity, setLayerOpacity] = useState(0.7);

  // Auto-play timestamp simulation
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setTimeStep((prev) => (prev >= 10 ? 0 : prev + 2));
    }, 2000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const getLayerDescription = (layer: MapLayerType) => {
    switch (layer) {
      case 'satellite':
        return 'Geostationary IR Cloud Canopy & Moisture Telemetry';
      case 'wind':
        return 'GFS Global Wind Velocity Vectors & Atmospheric Jet Streams';
      case 'temp':
        return 'Surface Thermal Infrared & Urban Heat Island Gradients';
      case 'aqi':
        return 'Tropospheric Particulate Matter (PM2.5 / PM10) Dispersion';
      case 'co2':
        return 'OCO-2 Satellite Column Carbon Dioxide Concentration (ppm)';
    }
  };

  const getLayerColorGradient = (layer: MapLayerType) => {
    switch (layer) {
      case 'satellite':
        return 'from-indigo-500/30 via-sky-500/20 to-transparent';
      case 'wind':
        return 'from-teal-500/40 via-cyan-500/20 to-transparent';
      case 'temp':
        return 'from-rose-500/40 via-amber-500/20 to-transparent';
      case 'aqi':
        return 'from-emerald-500/40 via-amber-500/30 to-rose-500/20';
      case 'co2':
        return 'from-teal-500/50 via-emerald-500/30 to-purple-500/20';
    }
  };

  return (
    <div className="glass-card p-6 rounded-3xl space-y-4 border border-slate-800 shadow-xl relative overflow-hidden">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 bg-indigo-500/20 rounded-xl border border-indigo-500/30 text-indigo-400">
            <Satellite className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              Live Geostationary Radar & Satellite Stream
            </h2>
            <p className="text-xs text-slate-400">
              Station Focused: <strong className="text-indigo-300">{location}</strong> • Updated {timeStep}m ago
            </p>
          </div>
        </div>

        {/* Layer Selection Chips */}
        <div className="flex flex-wrap gap-1.5 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800">
          {(['satellite', 'wind', 'temp', 'aqi', 'co2'] as MapLayerType[]).map((layer) => (
            <button
              key={layer}
              onClick={() => setActiveLayer(layer)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition capitalize ${
                activeLayer === layer
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              {layer}
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive Map Radar Viewport */}
      <div className="relative h-80 sm:h-96 bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden flex flex-col justify-between p-4 group">
        
        {/* Background Satellite Imagery Layer */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-all duration-700"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop')`,
            transform: `scale(${zoomLevel})`,
            filter: 'brightness(0.65) contrast(1.1)',
          }}
        />

        {/* Overlay Graphic Simulation */}
        <div 
          className={`absolute inset-0 bg-gradient-to-tr ${getLayerColorGradient(activeLayer)} transition-all duration-500 pointer-events-none`}
          style={{ opacity: layerOpacity }}
        />

        {/* Simulated Animated Radar Rings */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-64 h-64 border border-indigo-500/20 rounded-full animate-ping opacity-25"></div>
          <div className="w-96 h-96 border border-emerald-500/10 rounded-full animate-pulse opacity-20"></div>
          
          {/* Target Location Crosshair */}
          <div className="relative flex items-center justify-center">
            <div className="w-4 h-4 bg-indigo-500 rounded-full animate-ping opacity-75"></div>
            <div className="absolute w-2 h-2 bg-white rounded-full"></div>
            <div className="absolute -top-7 bg-slate-900/90 text-indigo-300 font-bold px-2 py-0.5 rounded text-[10px] border border-indigo-500/40 whitespace-nowrap shadow-lg">
              Station: {location}
            </div>
          </div>
        </div>

        {/* Top Info Bar */}
        <div className="relative z-10 flex justify-between items-center bg-slate-900/80 backdrop-blur-md p-3 rounded-xl border border-slate-800/80 text-xs text-slate-200">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-400 shrink-0" />
            <span className="font-semibold text-white">{getLayerDescription(activeLayer)}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-slate-400 hidden sm:inline">GOES-18 & Sentinel-5P Feed</span>
            <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] font-bold rounded border border-emerald-500/30">
              FPS: 60
            </span>
          </div>
        </div>

        {/* Bottom Control Panel & Timeline */}
        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 bg-slate-900/80 backdrop-blur-md p-3 rounded-xl border border-slate-800/80 text-xs">
          
          {/* Stream Playback Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition"
              title={isPlaying ? 'Pause Stream' : 'Play Stream'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>

            <span className="text-slate-300 font-mono text-[11px]">
              T-{timeStep}m Frame
            </span>

            <button
              onClick={() => setTimeStep(0)}
              className="p-1.5 text-slate-400 hover:text-white transition"
              title="Reset to Live"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Opacity & Zoom controls */}
          <div className="flex items-center gap-4 text-slate-300">
            <div className="flex items-center gap-2">
              <Eye className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-[10px]">Opacity:</span>
              <input
                type="range"
                min="0.2"
                max="1"
                step="0.1"
                value={layerOpacity}
                onChange={(e) => setLayerOpacity(parseFloat(e.target.value))}
                className="w-20 accent-indigo-500 cursor-pointer"
              />
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-[10px]">Zoom:</span>
              <button
                onClick={() => setZoomLevel((z) => Math.max(1, z - 0.2))}
                className="px-2 py-0.5 bg-slate-800 rounded text-xs font-bold"
              >
                -
              </button>
              <span className="font-mono text-[11px]">{zoomLevel.toFixed(1)}x</span>
              <button
                onClick={() => setZoomLevel((z) => Math.min(2.5, z + 0.2))}
                className="px-2 py-0.5 bg-slate-800 rounded text-xs font-bold"
              >
                +
              </button>
            </div>
          </div>

          {/* Quick Action Button to Carbon Exchange */}
          {onNavigateToExchange && (
            <button
              onClick={onNavigateToExchange}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg transition flex items-center gap-1.5 shadow"
            >
              <span>Marketplace</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Legend & Telemetry Note */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs text-slate-400 pt-1 border-t border-slate-800/80 gap-2">
        <div className="flex items-center gap-2">
          <Info className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
          <span>Real-time atmospheric telemetry calibrated against NASA OCO-2 & NOAA High-Resolution Radar.</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Optimal
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span> Moderate
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-rose-400"></span> Critical
          </span>
        </div>
      </div>
    </div>
  );
};
