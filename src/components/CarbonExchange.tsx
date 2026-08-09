import React, { useState } from 'react';
import { Coins, ShieldCheck, ArrowUpRight, ArrowDownLeft, TreePine, Award, Filter, DollarSign, ExternalLink, CheckCircle, Sparkles } from 'lucide-react';
import { OFFSET_PROJECTS } from '../data/mockData';
import { CarbonTransaction, OffsetProject } from '../types';

interface CarbonExchangeProps {
  creditsBalance: number;
  transactions: CarbonTransaction[];
  onRedeemCredits: (amount: number, projectTitle: string) => boolean;
  onAddCredits: (amount: number, reason: string) => void;
}

export const CarbonExchange: React.FC<CarbonExchangeProps> = ({
  creditsBalance,
  transactions,
  onRedeemCredits,
  onAddCredits,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'earn' | 'redeem'>('all');
  const [selectedProject, setSelectedProject] = useState<OffsetProject | null>(null);
  const [purchaseAmount, setPurchaseAmount] = useState<number>(10);
  const [certificateSuccess, setCertificateSuccess] = useState<string | null>(null);
  const [buySellModal, setBuySellModal] = useState<'buy' | 'sell' | null>(null);
  const [tradeCredits, setTradeCredits] = useState<number>(50);

  const filteredTransactions = transactions.filter((tx) => {
    if (filterType === 'earn') return tx.type === 'earn' || tx.type === 'buy';
    if (filterType === 'redeem') return tx.type === 'redeem' || tx.type === 'sell';
    return true;
  });

  const handleFundProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject) return;

    const totalCost = selectedProject.pricePerCredit * purchaseAmount;
    const success = onRedeemCredits(
      totalCost,
      `Funded ${purchaseAmount}x Credits in ${selectedProject.title}`
    );

    if (success) {
      setCertificateSuccess(
        `Successfully retired ${purchaseAmount * 100} kg CO₂e for "${selectedProject.title}"! Verified Certificate Generated.`
      );
      setSelectedProject(null);
      setTimeout(() => setCertificateSuccess(null), 5000);
    } else {
      alert(`Insufficient Carbon Credits! You need ${totalCost} credits, but have ${creditsBalance}.`);
    }
  };

  const handleExecuteTrade = (e: React.FormEvent) => {
    e.preventDefault();
    const paypalTxId = 'PP-' + Math.random().toString(36).substring(2, 10).toUpperCase();
    if (buySellModal === 'buy') {
      onAddCredits(tradeCredits, `PayPal Purchase (${tradeCredits} Carbon Credits - Ref #${paypalTxId})`);
      setCertificateSuccess(`PayPal Payment Verified! Added ${tradeCredits} Carbon Credits for $${(tradeCredits * 0.18).toFixed(2)} USD (PayPal Ref: ${paypalTxId}).`);
    } else if (buySellModal === 'sell') {
      const success = onRedeemCredits(tradeCredits, `PayPal Payout (${tradeCredits} Carbon Credits - Ref #${paypalTxId})`);
      if (success) {
        setCertificateSuccess(`PayPal Deposit Transferred! Sent $${(tradeCredits * 0.18).toFixed(2)} USD to your connected PayPal account (Ref: ${paypalTxId}).`);
      } else {
        alert('Insufficient credits to sell!');
      }
    }
    setBuySellModal(null);
    setTimeout(() => setCertificateSuccess(null), 6000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Top Banner & Wallet Overview */}
      <div className="glass-card p-6 rounded-3xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-indigo-950/50 border border-emerald-500/30 shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="p-2.5 bg-emerald-500/20 rounded-xl border border-emerald-500/30 text-emerald-400">
              <Coins className="w-6 h-6" />
            </span>
            <h2 className="text-2xl font-black text-white tracking-tight">Carbon Credits Exchange & Marketplace</h2>
          </div>
          <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
            Trade, retire, and earn verified carbon offset credits. 1 Carbon Credit represents 100kg CO₂ equivalent sequestered or prevented from entering the atmosphere.
          </p>
        </div>

        {/* Credit Balance Box */}
        <div className="bg-slate-950/80 p-5 rounded-2xl border border-emerald-500/40 w-full md:w-auto flex flex-col items-center md:items-end justify-center">
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Your Active Wallet</span>
          <div className="text-4xl font-black text-emerald-400 font-mono tracking-tight my-1">
            {creditsBalance} <span className="text-sm font-normal text-slate-300">Credits</span>
          </div>
          <span className="text-[11px] text-emerald-300 font-medium">Est. Value: ${(creditsBalance * 0.18).toFixed(2)} USD</span>
          
          <div className="flex gap-2 mt-3">
            <button
              onClick={() => setBuySellModal('buy')}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition flex items-center gap-1 shadow"
            >
              <ArrowDownLeft className="w-3.5 h-3.5" /> Buy Credits
            </button>
            <button
              onClick={() => setBuySellModal('sell')}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl transition flex items-center gap-1 border border-slate-700"
            >
              <ArrowUpRight className="w-3.5 h-3.5" /> Sell Credits
            </button>
          </div>
        </div>
      </div>

      {/* Success Notification Banner */}
      {certificateSuccess && (
        <div className="p-4 bg-emerald-500/20 border border-emerald-400/40 rounded-2xl text-emerald-200 font-bold text-xs flex items-center justify-between shadow-xl animate-in zoom-in-95">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{certificateSuccess}</span>
          </div>
          <Award className="w-5 h-5 text-emerald-400 shrink-0" />
        </div>
      )}

      {/* Verified Offset Projects Catalog */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <TreePine className="w-5 h-5 text-emerald-400" /> Verified Carbon Offset Projects
            </h3>
            <p className="text-xs text-slate-400">Directly fund audited planetary restoration initiatives using your Carbon Credits.</p>
          </div>
          <span className="text-xs text-slate-400 font-semibold hidden sm:inline">Verra & Gold Standard Compliant</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {OFFSET_PROJECTS.map((project) => (
            <div
              key={project.id}
              className="glass-card rounded-3xl overflow-hidden border border-slate-800 hover:border-emerald-500/40 transition flex flex-col justify-between group"
            >
              {/* Image & Category Overlay */}
              <div className="relative h-44 bg-slate-950 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                
                <div className="absolute top-3 left-3 px-2.5 py-1 bg-slate-900/80 backdrop-blur-md text-emerald-300 font-bold text-[10px] rounded-full border border-emerald-500/30">
                  {project.category}
                </div>

                <div className="absolute top-3 right-3 px-2 py-1 bg-emerald-950/90 text-white font-mono font-bold text-xs rounded-lg border border-emerald-500/40">
                  {project.pricePerCredit} Credits / Unit
                </div>

                <div className="absolute bottom-3 left-3 right-3">
                  <h4 className="text-base font-extrabold text-white">{project.title}</h4>
                  <p className="text-xs text-indigo-200 font-medium">{project.location}</p>
                </div>
              </div>

              {/* Description & Funding Progress */}
              <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                <p className="text-xs text-slate-300 leading-relaxed">{project.description}</p>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>Funding Progress</span>
                    <span className="text-emerald-400 font-bold">{project.fundedPercentage}% Funded</span>
                  </div>
                  <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                      style={{ width: `${project.fundedPercentage}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800">
                  <span className="text-slate-400 text-[11px] flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> {project.verifier}
                  </span>
                  
                  <button
                    onClick={() => setSelectedProject(project)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5 shadow"
                  >
                    <Sparkles className="w-3.5 h-3.5" /> Fund Project
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transaction History & Audit Trail */}
      <div className="glass-card p-6 rounded-3xl space-y-4 border border-slate-800">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-400" /> Wallet Activity & Transaction Ledger
            </h3>
            <p className="text-xs text-slate-400">Auditable record of all credits earned, redeemed, or traded.</p>
          </div>

          <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400 ml-2" />
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1 rounded-lg transition font-semibold ${
                filterType === 'all' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterType('earn')}
              className={`px-3 py-1 rounded-lg transition font-semibold ${
                filterType === 'earn' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Earned
            </button>
            <button
              onClick={() => setFilterType('redeem')}
              className={`px-3 py-1 rounded-lg transition font-semibold ${
                filterType === 'redeem' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Redeemed
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/80 text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Transaction Title</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-900/40 transition">
                  <td className="py-3.5 px-4 font-bold text-white flex items-center gap-2">
                    {tx.amount > 0 ? (
                      <ArrowDownLeft className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <ArrowUpRight className="w-4 h-4 text-rose-400 shrink-0" />
                    )}
                    {tx.title}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      tx.amount > 0 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                    }`}>
                      {tx.type}
                    </span>
                  </td>
                  <td className={`py-3.5 px-4 font-mono font-bold text-sm ${
                    tx.amount > 0 ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                    {tx.amount > 0 ? `+${tx.amount}` : tx.amount} Credits
                  </td>
                  <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">{tx.date}</td>
                  <td className="py-3.5 px-4 text-slate-400">{tx.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Fund Project Modal */}
      {selectedProject && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 p-6 rounded-3xl max-w-lg w-full space-y-4 shadow-2xl">
            <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
              <TreePine className="w-5 h-5 text-emerald-400" /> Retire Credits for {selectedProject.title}
            </h3>
            
            <p className="text-xs text-slate-300 leading-relaxed">{selectedProject.description}</p>

            <form onSubmit={handleFundProject} className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Number of Credit Units to Retire
                </label>
                <input
                  type="number"
                  min="1"
                  max="500"
                  value={purchaseAmount}
                  onChange={(e) => setPurchaseAmount(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm font-mono text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Unit Cost:</span>
                  <span className="text-white font-mono">{selectedProject.pricePerCredit} Credits / Unit</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>CO₂ Offset Yield:</span>
                  <span className="text-emerald-400 font-bold font-mono">{(purchaseAmount * 100).toLocaleString()} kg CO₂e</span>
                </div>
                <div className="flex justify-between text-slate-200 font-bold text-sm border-t border-slate-800 pt-2">
                  <span>Total Credit Cost:</span>
                  <span className="text-emerald-400 font-mono">{selectedProject.pricePerCredit * purchaseAmount} Credits</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedProject(null)}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition"
                >
                  Confirm Retirement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PayPal Buy / Sell Modal */}
      {buySellModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 p-6 rounded-3xl max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <h3 className="text-lg font-extrabold text-white flex items-center gap-2 capitalize">
                <DollarSign className="w-5 h-5 text-amber-400" /> {buySellModal} via PayPal
              </h3>
              <span className="px-2 py-0.5 bg-sky-500/20 text-sky-300 text-[10px] font-bold rounded-full border border-sky-500/30">
                PayPal Checkout
              </span>
            </div>
            
            <form onSubmit={handleExecuteTrade} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Credit Quantity
                </label>
                <input
                  type="number"
                  min="10"
                  max="1000"
                  step="10"
                  value={tradeCredits}
                  onChange={(e) => setTradeCredits(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm font-mono text-white focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Market Price:</span>
                  <span className="text-white font-mono">$0.18 USD / Credit</span>
                </div>
                <div className="flex justify-between text-slate-200 font-bold text-sm border-t border-slate-800 pt-2">
                  <span>{buySellModal === 'buy' ? 'Total PayPal Charge:' : 'Total PayPal Deposit:'}</span>
                  <span className="text-amber-400 font-mono font-extrabold">${(tradeCredits * 0.18).toFixed(2)} USD</span>
                </div>
              </div>

              {/* PayPal Payment Method Badge */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-2">
                <div className="flex items-center justify-between text-slate-300 font-bold">
                  <span className="flex items-center gap-1.5">
                    <span className="text-sky-400 font-extrabold italic">Pay</span><span className="text-blue-500 font-extrabold italic">Pal</span>
                    <span>Direct Gateway</span>
                  </span>
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                </div>
                <p className="text-[10px] text-slate-400 leading-snug">
                  {buySellModal === 'buy'
                    ? 'Instant credit delivery. Billed in USD via PayPal account or Debit/Credit card.'
                    : 'Instant USD transfer directly to your connected PayPal email account.'}
                </p>
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setBuySellModal(null)}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl transition flex items-center justify-center gap-1.5 shadow-lg"
                >
                  <span>{buySellModal === 'buy' ? 'Pay with PayPal' : 'Transfer to PayPal'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
