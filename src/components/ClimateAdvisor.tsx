import React, { useState } from 'react';
import { Bot, Send, Sparkles, User, AlertCircle, RefreshCw, Lightbulb, Sliders, Calendar, CheckCircle2, Flame, Thermometer, Wind, Trees, ArrowRight, Award } from 'lucide-react';
import { TelemetryData, AdvisorMessage } from '../types';

interface ClimateAdvisorProps {
  telemetry: TelemetryData;
  onAddCredits?: (amount: number, reason: string) => void;
}

export const ClimateAdvisor: React.FC<ClimateAdvisorProps> = ({ telemetry, onAddCredits }) => {
  const [activeSubTab, setActiveSubTab] = useState<'chat' | 'simulator' | 'plan'>('chat');

  // AI Chat state
  const [messages, setMessages] = useState<AdvisorMessage[]>([
    {
      id: 'm1',
      sender: 'assistant',
      text: `Hello! I am your **Atmosphere AI Climate Advisor**. I analyze real-time station telemetry for **${telemetry.location}** (AQI: ${telemetry.aqi}, CO₂: ${telemetry.co2} ppm, Temp: ${telemetry.temperature}°C). \n\nHow can I help you today? You can ask about local air quality impact, solar carbon offsets, atmospheric science, or eco action recommendations!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Scenario Simulator state
  const [tempDelta, setTempDelta] = useState<number>(1.5);
  const [aqiTarget, setAqiTarget] = useState<number>(75);
  const [co2Target, setCo2Target] = useState<number>(450);
  const [greenCoverage, setGreenCoverage] = useState<number>(25);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simReport, setSimReport] = useState<string | null>(null);

  // 7-Day Action Plan state
  const [completedDays, setCompletedDays] = useState<number[]>([]);

  const ACTION_PLAN_DAYS = [
    { day: 1, title: 'Energy Audit & Peak Load Reduction', credits: 15, desc: 'Shift high-energy appliances (AC/laundry) to off-peak hours based on local grid telemetry.' },
    { day: 2, title: 'Zero-Emission Commute Challenge', credits: 20, desc: 'Walk, cycle, or use electric mass transit for all trips under 5km today.' },
    { day: 3, title: 'Micro-Forest Planting & Greenery', credits: 25, desc: 'Plant native flora or support urban canopy reforestation projects in your neighborhood.' },
    { day: 4, title: 'HVAC Filter & Air Quality Maintenance', credits: 10, desc: 'Inspect home MERV air filters to reduce indoor PM2.5 particulate accumulation.' },
    { day: 5, title: 'Plant-Based Nutrition Day', credits: 15, desc: 'Substitute animal protein with low-carbon plant alternatives for 3 meals.' },
    { day: 6, title: 'Water Conservation & Rainwater Catchment', credits: 15, desc: 'Install low-flow aerators or set up rainwater harvesting for home garden irrigation.' },
    { day: 7, title: 'Solar Offset Verification & Community Share', credits: 30, desc: 'Log community solar generation metrics and claim verified Carbon Credits.' },
  ];

  const toggleCompleteDay = (dayNum: number, creditsReward: number, title: string) => {
    if (completedDays.includes(dayNum)) {
      setCompletedDays(completedDays.filter(d => d !== dayNum));
    } else {
      setCompletedDays([...completedDays, dayNum]);
      if (onAddCredits) {
        onAddCredits(creditsReward, `Completed Day ${dayNum} Action: ${title}`);
      }
    }
  };

  const handleRunSimulation = async () => {
    setIsSimulating(true);
    setSimReport(null);

    try {
      const res = await fetch('/api/gemini/simulate-scenario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tempDelta,
          aqiTarget,
          co2Target,
          greenCoverage,
          location: telemetry.location,
        }),
      });

      const data = await res.json();
      setSimReport(data.analysis || 'Simulation analysis completed.');
    } catch (err) {
      console.error('Simulation error:', err);
      setSimReport(`### Climate Scenario Simulation Report for ${telemetry.location}
- **Temperature Delta**: +${tempDelta}°C
- **Projected AQI**: ${aqiTarget} (${aqiTarget > 100 ? 'Unhealthy' : 'Moderate'})
- **Atmospheric CO₂ Target**: ${co2Target} ppm
- **Urban Canopy**: ${greenCoverage}%

#### Key Insights:
1. Urban heat island intensity increases heat wave days by **${(tempDelta * 2.1).toFixed(1)} days/year**.
2. Particulate exposure requires localized HEPA filtration during peak summer months.
3. Reforestation yield could sequester up to **${(greenCoverage * 12).toLocaleString()} tonnes CO₂e/year**.`);
    } finally {
      setIsSimulating(false);
    }
  };

  const PRESET_PROMPTS = [
    `Analyze health recommendations for ${telemetry.location} based on current AQI (${telemetry.aqi}).`,
    'How many carbon credits can I earn by installing rooftop solar panels?',
    'Explain the atmospheric significance of tropospheric Methane (CH₄) levels.',
    'What are the best certified carbon offset projects to fund right now?',
  ];

  const sendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMsg: AdvisorMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/gemini/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: textToSend,
          telemetryData: telemetry,
        }),
      });

      const data = await response.json();

      const aiText = data.text || data.fallbackAnswer || 'Unable to connect to Climate Advisor service.';

      const assistantMsg: AdvisorMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: aiText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error(err);
      const errorMsg: AdvisorMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: `**Telemetry Advisor Analysis**: Current AQI for ${telemetry.location} is **${telemetry.aqi}** (${telemetry.aqiCategory}). Atmospheric CO₂ stands at **${telemetry.co2} ppm**. To optimize your carbon footprint, log solar generation or eco-transit commuting in the Carbon Exchange.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4 max-w-4xl mx-auto shadow-2xl flex flex-col min-h-[650px]">
      
      {/* Header & Sub-Tab Navigation */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-sky-500/20 rounded-2xl border border-sky-500/30 text-sky-400">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              Atmosphere AI Climate Advisor & Simulator
            </h2>
            <p className="text-xs text-slate-400">Powered by Gemini 3.6 Flash • Calibrated for {telemetry.location}</p>
          </div>
        </div>

        {/* Sub-Tab Selector */}
        <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-2xl border border-slate-800 text-xs w-full md:w-auto">
          <button
            onClick={() => setActiveSubTab('chat')}
            className={`flex-1 md:flex-initial px-3 py-1.5 rounded-xl font-bold transition flex items-center justify-center gap-1.5 ${
              activeSubTab === 'chat' ? 'bg-sky-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span>AI Advisor</span>
          </button>
          <button
            onClick={() => setActiveSubTab('simulator')}
            className={`flex-1 md:flex-initial px-3 py-1.5 rounded-xl font-bold transition flex items-center justify-center gap-1.5 ${
              activeSubTab === 'simulator' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sliders className="w-3.5 h-3.5 text-amber-400" />
            <span>Scenario Simulator</span>
          </button>
          <button
            onClick={() => setActiveSubTab('plan')}
            className={`flex-1 md:flex-initial px-3 py-1.5 rounded-xl font-bold transition flex items-center justify-center gap-1.5 ${
              activeSubTab === 'plan' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-emerald-400" />
            <span>7-Day Plan</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: AI CHAT ADVISOR */}
      {activeSubTab === 'chat' && (
        <div className="flex flex-col flex-1 space-y-3">
          {/* Preset Prompt Suggestions */}
          <div className="flex flex-wrap gap-2 pt-1">
            {PRESET_PROMPTS.map((promptText, idx) => (
              <button
                key={idx}
                onClick={() => sendMessage(promptText)}
                disabled={isLoading}
                className="px-3 py-1.5 bg-slate-900/80 hover:bg-indigo-950/60 text-slate-300 hover:text-white text-xs rounded-xl border border-slate-800 hover:border-indigo-500/40 transition flex items-center gap-1.5 text-left"
              >
                <Lightbulb className="w-3 h-3 text-amber-400 shrink-0" />
                <span className="truncate max-w-[220px]">{promptText}</span>
              </button>
            ))}
          </div>

          {/* Message Chat List */}
          <div className="flex-1 overflow-y-auto space-y-4 p-3 bg-slate-950/60 rounded-2xl border border-slate-800/80 max-h-[420px]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div
                  className={`p-2 rounded-xl shrink-0 ${
                    msg.sender === 'user'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-800 text-sky-400 border border-slate-700'
                  }`}
                >
                  {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div
                  className={`max-w-[80%] p-4 rounded-2xl text-xs leading-relaxed space-y-1 ${
                    msg.sender === 'user'
                      ? 'bg-indigo-600 text-white rounded-tr-none'
                      : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'
                  }`}
                >
                  <div className="whitespace-pre-wrap font-sans">{msg.text}</div>
                  <div
                    className={`text-[9px] text-right mt-1 font-mono ${
                      msg.sender === 'user' ? 'text-indigo-200' : 'text-slate-500'
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 text-sky-400 text-xs p-3 bg-slate-900/60 rounded-2xl border border-slate-800 w-fit">
                <RefreshCw className="w-4 h-4 animate-spin text-sky-400" />
                <span>Atmosphere AI is calculating telemetry & generating report...</span>
              </div>
            )}
          </div>

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="flex gap-2 pt-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Ask Gemini about ${telemetry.location} air quality, carbon credits, or climate solutions...`}
              disabled={isLoading}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500/50"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="px-5 py-3 bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white font-bold text-xs rounded-2xl transition flex items-center gap-1.5 shrink-0 shadow-lg"
            >
              <Send className="w-4 h-4" />
              <span>Ask</span>
            </button>
          </form>
        </div>
      )}

      {/* VIEW 2: WHAT-IF CLIMATE SCENARIO SIMULATOR */}
      {activeSubTab === 'simulator' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Interactive Sliders Panel */}
            <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-amber-400" /> Simulation Parameters
                </h3>
                <span className="text-[10px] text-slate-400 font-mono">{telemetry.location}</span>
              </div>

              {/* Slider 1: Temp Delta */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium flex items-center gap-1">
                    <Thermometer className="w-3.5 h-3.5 text-rose-400" /> Global Warming Delta:
                  </span>
                  <span className="text-rose-400 font-bold font-mono">+{tempDelta}°C</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="4.0"
                  step="0.1"
                  value={tempDelta}
                  onChange={(e) => setTempDelta(Number(e.target.value))}
                  className="w-full accent-rose-500 bg-slate-900 rounded-lg cursor-pointer h-2"
                />
              </div>

              {/* Slider 2: Target AQI */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium flex items-center gap-1">
                    <Wind className="w-3.5 h-3.5 text-amber-400" /> Projected AQI Index:
                  </span>
                  <span className="text-amber-400 font-bold font-mono">{aqiTarget} AQI</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="200"
                  step="5"
                  value={aqiTarget}
                  onChange={(e) => setAqiTarget(Number(e.target.value))}
                  className="w-full accent-amber-500 bg-slate-900 rounded-lg cursor-pointer h-2"
                />
              </div>

              {/* Slider 3: CO2 ppm */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-purple-400" /> CO₂ Concentration:
                  </span>
                  <span className="text-purple-400 font-bold font-mono">{co2Target} ppm</span>
                </div>
                <input
                  type="range"
                  min="400"
                  max="550"
                  step="5"
                  value={co2Target}
                  onChange={(e) => setCo2Target(Number(e.target.value))}
                  className="w-full accent-purple-500 bg-slate-900 rounded-lg cursor-pointer h-2"
                />
              </div>

              {/* Slider 4: Urban Canopy % */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium flex items-center gap-1">
                    <Trees className="w-3.5 h-3.5 text-emerald-400" /> Urban Greenery Canopy:
                  </span>
                  <span className="text-emerald-400 font-bold font-mono">{greenCoverage}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="60"
                  step="5"
                  value={greenCoverage}
                  onChange={(e) => setGreenCoverage(Number(e.target.value))}
                  className="w-full accent-emerald-500 bg-slate-900 rounded-lg cursor-pointer h-2"
                />
              </div>

              <button
                onClick={handleRunSimulation}
                disabled={isSimulating}
                className="w-full py-3 bg-gradient-to-r from-indigo-600 via-sky-600 to-emerald-600 hover:from-indigo-500 hover:to-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2 mt-2"
              >
                {isSimulating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Simulating Environmental Impacts...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Run Gemini AI Climate Simulation</span>
                  </>
                )}
              </button>
            </div>

            {/* Simulation Report Display */}
            <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 space-y-3 overflow-y-auto max-h-[380px]">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-sky-400" /> Projected Impact Report
                </h3>
                <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 text-[10px] font-bold rounded-full">
                  Gemini Predictive Engine
                </span>
              </div>

              {simReport ? (
                <div className="text-xs text-slate-300 space-y-2 whitespace-pre-wrap font-sans leading-relaxed">
                  {simReport}
                </div>
              ) : (
                <div className="h-48 flex flex-col items-center justify-center text-center p-6 space-y-2 text-slate-500">
                  <Sliders className="w-8 h-8 text-slate-600 animate-pulse" />
                  <p className="text-xs">Adjust the climate parameters on the left and click "Run Simulation" to model climate impacts for {telemetry.location}.</p>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* VIEW 3: 7-DAY ECO ACTION PLAN */}
      {activeSubTab === 'plan' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="flex justify-between items-center bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-400" /> Personalized 7-Day Carbon Reduction Roadmap
              </h3>
              <p className="text-xs text-slate-400">Customized for {telemetry.location} (AQI: {telemetry.aqi}, Temp: {telemetry.temperature}°C). Earn wallet credits for completed actions!</p>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-400">Progress:</div>
              <div className="text-base font-black text-emerald-400 font-mono">
                {completedDays.length} / 7 <span className="text-xs font-normal text-slate-400">Days</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[380px] overflow-y-auto">
            {ACTION_PLAN_DAYS.map((task) => {
              const isDone = completedDays.includes(task.day);
              return (
                <div
                  key={task.day}
                  onClick={() => toggleCompleteDay(task.day, task.credits, task.title)}
                  className={`p-4 rounded-2xl border cursor-pointer transition flex items-start justify-between gap-3 ${
                    isDone
                      ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-200'
                      : 'bg-slate-900/60 hover:bg-slate-900 border-slate-800 text-slate-200'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold font-mono ${
                        isDone ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-300'
                      }`}>
                        Day {task.day}
                      </span>
                      <h4 className="text-xs font-bold text-white">{task.title}</h4>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">{task.desc}</p>
                  </div>

                  <div className="flex flex-col items-end justify-between shrink-0 h-full">
                    <div className="flex items-center gap-1 text-emerald-400 font-mono font-bold text-xs">
                      <Award className="w-3.5 h-3.5" /> +{task.credits}
                    </div>
                    <div className={`mt-2 p-1 rounded-full ${isDone ? 'text-emerald-400' : 'text-slate-600'}`}>
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};
