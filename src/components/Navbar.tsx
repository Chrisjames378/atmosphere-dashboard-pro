import React, { useState } from 'react';
import { CloudSun, Coins, Satellite, BarChart3, Bot, Search, MapPin, RefreshCw, LayoutDashboard } from 'lucide-react';
import { INITIAL_PRESET_LOCATIONS } from '../data/mockData';

interface NavbarProps {
  activeTab: 'overview' | 'exchange' | 'satellite' | 'analytics' | 'advisor';
  setActiveTab: (tab: 'overview' | 'exchange' | 'satellite' | 'analytics' | 'advisor') => void;
  creditsBalance: number;
  selectedLocation: string;
  onLocationChange: (loc: string) => void;
  onRefreshTelemetry: () => void;
  isRefreshing: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  creditsBalance,
  selectedLocation,
  onLocationChange,
  onRefreshTelemetry,
  isRefreshing,
}) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [customInput, setCustomInput] = useState('');

  const handleCustomSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customInput.trim()) {
      onLocationChange(customInput.trim());
      setIsSearchOpen(false);
      setCustomInput('');
    }
  };

  return (
    <header className="glass-card p-4 md:p-6 rounded-2xl shadow-xl space-y-4 border border-slate-800">
      <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-4">
        
        {/* Brand & Title */}
        <div className="flex items-center gap-3">
          <div 
            onClick={() => setActiveTab('overview')} 
            className="p-3 bg-indigo-600/30 rounded-xl border border-indigo-500/30 text-indigo-400 cursor-pointer hover:bg-indigo-600/40 transition"
          >
            <CloudSun className="w-8 h-8 text-indigo-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight bg-gradient-to-r from-white via-indigo-100 to-sky-300 bg-clip-text text-transparent">
                Atmosphere Dashboard Pro
              </h1>
              <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 text-[10px] font-bold rounded-full border border-indigo-500/30">
                v2.4 Live
              </span>
            </div>
            <p className="text-xs text-slate-400">Next-Gen Environmental, Satellite & Carbon Telemetry</p>
          </div>
        </div>

        {/* Location Station Selector & Controls */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          
          {/* Station dropdown / Search */}
          <div className="relative">
            <div className="flex items-center bg-slate-900/80 rounded-xl border border-slate-700/80 px-3 py-1.5 text-xs text-slate-200">
              <MapPin className="w-3.5 h-3.5 text-indigo-400 mr-2 shrink-0" />
              <select
                value={selectedLocation}
                onChange={(e) => onLocationChange(e.target.value)}
                className="bg-transparent text-white font-semibold text-xs focus:outline-none cursor-pointer pr-1"
              >
                {INITIAL_PRESET_LOCATIONS.map((loc) => (
                  <option key={loc} value={loc} className="bg-slate-900 text-slate-200">
                    {loc}
                  </option>
                ))}
              </select>
              
              <button
                type="button"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="ml-2 p-1 text-slate-400 hover:text-white transition"
                title="Search Custom Location"
              >
                <Search className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Custom Location Search Modal/Popover */}
            {isSearchOpen && (
              <div className="absolute right-0 mt-2 w-72 p-3 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 animate-in fade-in zoom-in-95">
                <form onSubmit={handleCustomSearchSubmit} className="flex gap-2">
                  <input
                    type="text"
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                    placeholder="e.g. Zurich, Switzerland"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-lg transition"
                  >
                    Go
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* Refresh Telemetry */}
          <button
            onClick={onRefreshTelemetry}
            disabled={isRefreshing}
            className="p-2 bg-slate-900/80 hover:bg-slate-800/80 border border-slate-700/80 text-slate-300 rounded-xl transition flex items-center justify-center"
            title="Refresh Telemetry"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-indigo-400' : ''}`} />
          </button>

          {/* Carbon Credit Wallet Balance Badge */}
          <button
            onClick={() => setActiveTab('exchange')}
            className={`px-3.5 py-2 rounded-xl transition font-bold text-xs flex items-center gap-2 border shadow-lg ${
              activeTab === 'exchange'
                ? 'bg-emerald-600 text-white border-emerald-400'
                : 'bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 border-emerald-500/40'
            }`}
          >
            <Coins className="w-4 h-4 text-emerald-400" />
            <span>Carbon Exchange</span>
            <span
              id="nav-credit-badge"
              className="px-2 py-0.5 bg-emerald-950 text-emerald-300 rounded-full text-[11px] border border-emerald-500/40 font-mono"
            >
              {creditsBalance}
            </span>
          </button>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <nav className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-800 text-xs">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition ${
            activeTab === 'overview'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('exchange')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition ${
            activeTab === 'exchange'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Coins className="w-4 h-4 text-emerald-400" />
          <span>Carbon Exchange</span>
        </button>

        <button
          onClick={() => setActiveTab('satellite')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition ${
            activeTab === 'satellite'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Satellite className="w-4 h-4" />
          <span>Satellite & Radar</span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition ${
            activeTab === 'analytics'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Trends & Analytics</span>
        </button>

        <button
          onClick={() => setActiveTab('advisor')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition ${
            activeTab === 'advisor'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Bot className="w-4 h-4 text-sky-400" />
          <span>AI Climate Advisor</span>
        </button>
      </nav>
    </header>
  );
};
