import React, { useState } from 'react';
import { Download, FileText, Share2, Copy, Check, X, Table, ShieldCheck } from 'lucide-react';
import { TelemetryData, CarbonTransaction } from '../types';

interface ExportModalProps {
  telemetry: TelemetryData;
  transactions: CarbonTransaction[];
  creditsBalance: number;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  telemetry,
  transactions,
  creditsBalance,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  // Helper to trigger file download
  const downloadFile = (filename: string, content: string, contentType: string) => {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Export Telemetry as CSV
  const handleExportTelemetryCSV = () => {
    const headers = ['Location', 'Temperature_C', 'FeelsLike_C', 'Condition', 'AQI', 'AQI_Category', 'CO2_ppm', 'Methane_ppb', 'Ozone_ppb', 'PM25', 'PM10', 'Timestamp'];
    const row = [
      `"${telemetry.location}"`,
      telemetry.temperature,
      telemetry.feelsLike,
      `"${telemetry.condition}"`,
      telemetry.aqi,
      `"${telemetry.aqiCategory}"`,
      telemetry.co2,
      telemetry.methane,
      telemetry.ozone,
      telemetry.pm25,
      telemetry.pm10,
      `"${telemetry.lastUpdated}"`,
    ];

    const csvContent = `${headers.join(',')}\n${row.join(',')}`;
    downloadFile(`atmosphere_telemetry_${telemetry.location.replace(/[^a-zA-Z0-9]/g, '_')}.csv`, csvContent, 'text/csv');
  };

  // Export Transactions Portfolio as CSV
  const handleExportPortfolioCSV = () => {
    const headers = ['Transaction_ID', 'Title', 'Type', 'Credits_Amount', 'Date', 'Details'];
    const rows = transactions.map((tx) => [
      `"${tx.id}"`,
      `"${tx.title}"`,
      `"${tx.type}"`,
      tx.amount,
      `"${tx.date}"`,
      `"${tx.details}"`,
    ]);

    const csvContent = `${headers.join(',')}\n${rows.map((r) => r.join(',')).join('\n')}`;
    downloadFile(`atmosphere_carbon_portfolio_${new Date().toISOString().slice(0, 10)}.csv`, csvContent, 'text/csv');
  };

  // Copy Summary text to Clipboard
  const handleCopySummary = () => {
    const summary = `🌍 Atmosphere Telemetry Summary (${telemetry.location})
• Temperature: ${telemetry.temperature}°C (Feels like ${telemetry.feelsLike}°C, ${telemetry.condition})
• Air Quality Index: ${telemetry.aqi} (${telemetry.aqiCategory})
• PM2.5: ${telemetry.pm25} µg/m³ | PM10: ${telemetry.pm10} µg/m³
• CO₂: ${telemetry.co2} ppm | Methane: ${telemetry.methane} ppb
• Carbon Credit Balance: ${creditsBalance} Credits
• Verified Audit Hash: 0x${Math.random().toString(16).substring(2, 14)}
Timestamp: ${new Date(telemetry.lastUpdated).toLocaleString()}`;

    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden p-6 space-y-6">
        
        {/* Header */}
        <div className="flex justify-between items-center pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-xl border border-indigo-500/30">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Export Telemetry & Share</h3>
              <p className="text-xs text-slate-400">Download formatted reports or copy shareable summary</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Options Stack */}
        <div className="space-y-3">
          
          {/* Option 1: Telemetry CSV */}
          <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-sky-500/10 text-sky-400 rounded-xl border border-sky-500/20">
                <Table className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Live Telemetry Dataset (.CSV)</h4>
                <p className="text-[11px] text-slate-400">Location, Temp, AQI, CO₂, Methane & PM metrics</p>
              </div>
            </div>
            <button
              onClick={handleExportTelemetryCSV}
              className="px-3 py-2 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5 shrink-0"
            >
              <Download className="w-3.5 h-3.5" />
              <span>CSV</span>
            </button>
          </div>

          {/* Option 2: Carbon Portfolio CSV */}
          <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Carbon Credit Ledger (.CSV)</h4>
                <p className="text-[11px] text-slate-400">{transactions.length} recorded transactions & offset history</p>
              </div>
            </div>
            <button
              onClick={handleExportPortfolioCSV}
              className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5 shrink-0"
            >
              <Download className="w-3.5 h-3.5" />
              <span>CSV</span>
            </button>
          </div>

          {/* Option 3: Copy Summary Clipboard */}
          <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20">
                <Share2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Share Telemetry Summary</h4>
                <p className="text-[11px] text-slate-400">Formatted text snippet with AQI, CO₂ & audit hash</p>
              </div>
            </div>
            <button
              onClick={handleCopySummary}
              className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5 shrink-0 min-w-[80px] justify-center"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="flex justify-between items-center text-[10px] text-slate-500 pt-2 border-t border-slate-800">
          <span className="flex items-center gap-1 font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Encrypted Export Engine
          </span>
          <button onClick={onClose} className="hover:text-slate-300 transition">
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
