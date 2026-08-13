import React, { useState } from 'react';
import { Award, ShieldCheck, Download, Printer, Copy, Check, X, QrCode, Sparkles, TreePine, ExternalLink } from 'lucide-react';
import { CarbonCertificate } from '../types';

interface CarbonCertificateModalProps {
  certificate: CarbonCertificate;
  onClose: () => void;
}

export const CarbonCertificateModal: React.FC<CarbonCertificateModalProps> = ({ certificate, onClose }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyHash = () => {
    navigator.clipboard.writeText(certificate.verificationHash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-emerald-500/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[90vh]">
        
        {/* Modal Controls Bar */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-800 bg-slate-950/60 print:hidden">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-400" />
            <span className="text-sm font-bold text-white tracking-wide">Verified Carbon Offset Certificate</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5 text-emerald-400" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Inner Canvas (Printable Area) */}
        <div className="p-8 space-y-6 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950/40 overflow-y-auto">
          
          {/* Certificate Header Stamp */}
          <div className="border-4 border-double border-emerald-500/30 p-8 rounded-2xl bg-slate-950/80 relative shadow-inner space-y-6">
            
            {/* Corner Decorative Accents */}
            <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-emerald-400" />
            <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-emerald-400" />
            <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-emerald-400" />
            <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-emerald-400" />

            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-semibold tracking-wider">
                <ShieldCheck className="w-4 h-4" /> ISO 14064-3 COMPLIANT RECORD
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-emerald-400 tracking-tight font-serif uppercase">
                Certificate of Carbon Retirement
              </h1>
              <p className="text-xs text-slate-400 font-mono">Serial No: {certificate.serialNumber}</p>
            </div>

            {/* Main Statement */}
            <div className="text-center space-y-3 py-4 border-y border-slate-800/80">
              <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold">This official certificate attests that</p>
              <div className="text-xl font-bold text-white tracking-wide underline decoration-emerald-500/50 decoration-2 underline-offset-4">
                {certificate.beneficiaryName}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed max-w-lg mx-auto">
                has permanently retired <span className="font-bold text-emerald-400 font-mono text-sm">{certificate.co2RetiredKg} kg CO₂e</span> ({certificate.creditsRetired} Verified Carbon Credits) from the global carbon atmosphere pool, supporting the ecological project:
              </p>
              <div className="text-base font-bold text-teal-300 bg-slate-900/90 py-2 px-4 rounded-xl border border-teal-500/30 inline-block shadow-md">
                {certificate.projectTitle}
              </div>
            </div>

            {/* Certificate Details Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-left text-xs bg-slate-900/60 p-4 rounded-xl border border-slate-800">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-semibold">Project Location</span>
                <span className="text-slate-200 font-medium">{certificate.location}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-semibold">Issuing Verifier</span>
                <span className="text-slate-200 font-medium">{certificate.verifier}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-semibold">Retirement Date</span>
                <span className="text-slate-200 font-mono">{certificate.issueDate}</span>
              </div>
            </div>

            {/* Verification Hash & Badge */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-2">
              <div className="space-y-1 w-full md:w-auto">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-mono block">Registry Verification Hash</span>
                <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 text-[11px] font-mono text-slate-300">
                  <span className="truncate max-w-[240px] md:max-w-[280px]">{certificate.verificationHash}</span>
                  <button
                    onClick={handleCopyHash}
                    className="p-1 hover:text-white text-slate-400 transition"
                    title="Copy Verification Hash"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Verified Seal Stamp */}
              <div className="flex items-center gap-3 bg-emerald-950/40 border border-emerald-500/40 p-3 rounded-2xl shadow-lg shrink-0">
                <div className="p-2 bg-emerald-500/20 rounded-xl text-emerald-400 border border-emerald-500/30">
                  <TreePine className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">VERIFIED RETIRED</div>
                  <div className="text-[9px] text-slate-400 font-mono">Atmosphere Carbon Registry</div>
                </div>
              </div>
            </div>

          </div>

          <div className="text-center text-[10px] text-slate-500 print:hidden">
            This retirement record is immutable and permanently registered on the Atmosphere Public Climate Ledger.
          </div>

        </div>

      </div>
    </div>
  );
};
