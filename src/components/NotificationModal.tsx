import React, { useState, useEffect } from 'react';
import { Bell, ShieldCheck, X, Check, Clock, Sparkles, Send, Award, Leaf, Target, AlertCircle } from 'lucide-react';
import { NotificationService, ReminderSettings } from '../utils/notificationService';

interface NotificationModalProps {
  settings: ReminderSettings;
  onSave: (newSettings: ReminderSettings) => void;
  onClose: () => void;
  onAddCredits?: (amount: number, reason: string) => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  settings,
  onSave,
  onClose,
  onAddCredits,
}) => {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [enabled, setEnabled] = useState(settings.enabled);
  const [dailyEcoAction, setDailyEcoAction] = useState(settings.dailyEcoAction);
  const [dailyBonus, setDailyBonus] = useState(settings.dailyBonus);
  const [climateGoalProgress, setClimateGoalProgress] = useState(settings.climateGoalProgress);
  const [frequencyMinutes, setFrequencyMinutes] = useState(settings.frequencyMinutes);
  const [testSentMsg, setTestSentMsg] = useState<string | null>(null);

  useEffect(() => {
    setPermission(NotificationService.getPermission());
  }, []);

  const handleRequestPermission = async () => {
    const res = await NotificationService.requestPermission();
    setPermission(res);
    if (res === 'granted') {
      setEnabled(true);
      setTestSentMsg('Web Notification permissions granted! You will now receive daily reminders.');
      setTimeout(() => setTestSentMsg(null), 4000);
    } else if (res === 'denied') {
      setTestSentMsg('Browser notification permission was denied. In-app banner reminders will be used as a fallback.');
      setTimeout(() => setTestSentMsg(null), 5000);
    }
  };

  const handleSendTestEcoAction = () => {
    const sent = NotificationService.sendEcoActionReminder();
    if (sent) {
      setTestSentMsg('Sent Web Notification: "Time to Log Your Daily Eco-Actions!"');
    } else {
      setTestSentMsg('Triggered Fallback In-App Reminder: Time to log your daily eco-actions!');
    }
    setTimeout(() => setTestSentMsg(null), 4000);
  };

  const handleSendTestBonus = () => {
    const sent = NotificationService.sendBonusReminder();
    if (onAddCredits) {
      onAddCredits(25, 'Daily Reminder Bonus Claim');
    }
    if (sent) {
      setTestSentMsg('Sent Web Notification & awarded +25 Bonus Carbon Credits!');
    } else {
      setTestSentMsg('Awarded +25 Bonus Carbon Credits for claiming daily notification reward!');
    }
    setTimeout(() => setTestSentMsg(null), 4000);
  };

  const handleSendTestGoal = () => {
    const sent = NotificationService.sendGoalProgressReminder();
    if (sent) {
      setTestSentMsg('Sent Web Notification: "Atmosphere Climate Roadmap Update"');
    } else {
      setTestSentMsg('Triggered Fallback In-App Reminder: Check your 7-Day Climate Roadmap!');
    }
    setTimeout(() => setTestSentMsg(null), 4000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      enabled,
      dailyEcoAction,
      dailyBonus,
      climateGoalProgress,
      frequencyMinutes,
      lastTriggered: new Date().toISOString(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden p-6 space-y-6">
        
        {/* Modal Header */}
        <div className="flex justify-between items-center pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Browser Notifications & Reminders</h3>
              <p className="text-xs text-slate-400">Web Notifications API for daily eco-action tracking</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feedback Alert Toast */}
        {testSentMsg && (
          <div className="p-3 bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 text-xs rounded-xl flex items-center gap-2 animate-in fade-in">
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{testSentMsg}</span>
          </div>
        )}

        {/* Permission Banner */}
        <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-sky-400" />
              <span className="text-xs font-bold text-slate-200">Browser Notification Status</span>
            </div>
            <span
              className={`px-2 py-0.5 text-[10px] font-bold rounded font-mono ${
                permission === 'granted'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : permission === 'denied'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              }`}
            >
              {permission.toUpperCase()}
            </span>
          </div>

          {permission !== 'granted' ? (
            <div className="flex items-center justify-between pt-1">
              <p className="text-[11px] text-slate-400">
                Grant browser permissions to receive native desktop & mobile popups.
              </p>
              <button
                onClick={handleRequestPermission}
                className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl transition shrink-0"
              >
                Enable Permission
              </button>
            </div>
          ) : (
            <p className="text-[11px] text-slate-400">
              Native Web Notification API permissions are active. Reminders will show as OS desktop alerts.
            </p>
          )}
        </div>

        {/* Main Settings Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Master Switch */}
          <div className="flex justify-between items-center p-3.5 bg-slate-950 rounded-2xl border border-slate-800">
            <span className="text-xs font-bold text-slate-200 flex items-center gap-2">
              <Bell className="w-4 h-4 text-emerald-400" /> Enable Automatic Eco Reminders
            </span>
            <input
              type="checkbox"
              checked={enabled}
              onChange={(e) => setEnabled(e.target.checked)}
              className="w-4 h-4 accent-emerald-500 cursor-pointer rounded"
            />
          </div>

          {/* Reminder Categories */}
          <div className="space-y-2 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Select Reminder Topics
            </span>

            {/* Topic 1 */}
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-300 flex items-center gap-2">
                <Leaf className="w-3.5 h-3.5 text-emerald-400" /> Daily Eco-Action Log Prompt
              </span>
              <input
                type="checkbox"
                checked={dailyEcoAction}
                onChange={(e) => setDailyEcoAction(e.target.checked)}
                className="w-3.5 h-3.5 accent-emerald-500 cursor-pointer rounded"
              />
            </div>

            {/* Topic 2 */}
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-300 flex items-center gap-2">
                <Award className="w-3.5 h-3.5 text-amber-400" /> Daily Carbon Credit Bonus Claim
              </span>
              <input
                type="checkbox"
                checked={dailyBonus}
                onChange={(e) => setDailyBonus(e.target.checked)}
                className="w-3.5 h-3.5 accent-emerald-500 cursor-pointer rounded"
              />
            </div>

            {/* Topic 3 */}
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-300 flex items-center gap-2">
                <Target className="w-3.5 h-3.5 text-sky-400" /> 7-Day Climate Roadmap Progress
              </span>
              <input
                type="checkbox"
                checked={climateGoalProgress}
                onChange={(e) => setClimateGoalProgress(e.target.checked)}
                className="w-3.5 h-3.5 accent-emerald-500 cursor-pointer rounded"
              />
            </div>
          </div>

          {/* Test Dispatch Controls */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Test Web Notifications Now
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={handleSendTestEcoAction}
                className="p-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-[11px] text-slate-300 font-semibold transition flex flex-col items-center gap-1 text-center"
              >
                <Leaf className="w-4 h-4 text-emerald-400" />
                <span>Test Eco Log</span>
              </button>
              <button
                type="button"
                onClick={handleSendTestBonus}
                className="p-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-[11px] text-slate-300 font-semibold transition flex flex-col items-center gap-1 text-center"
              >
                <Award className="w-4 h-4 text-amber-400" />
                <span>Claim +25 Bonus</span>
              </button>
              <button
                type="button"
                onClick={handleSendTestGoal}
                className="p-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-[11px] text-slate-300 font-semibold transition flex flex-col items-center gap-1 text-center"
              >
                <Target className="w-4 h-4 text-sky-400" />
                <span>Test Roadmap</span>
              </button>
            </div>
          </div>

          {/* Action Buttons */}
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
              className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 shadow-lg"
            >
              <Check className="w-4 h-4" />
              <span>Save Reminder Rules</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
