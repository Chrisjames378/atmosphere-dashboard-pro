import React, { useState } from 'react';
import { Bot, Send, Sparkles, User, AlertCircle, RefreshCw, Lightbulb } from 'lucide-react';
import { TelemetryData, AdvisorMessage } from '../types';

interface ClimateAdvisorProps {
  telemetry: TelemetryData;
}

export const ClimateAdvisor: React.FC<ClimateAdvisorProps> = ({ telemetry }) => {
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
    <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4 max-w-4xl mx-auto shadow-2xl flex flex-col h-[650px]">
      
      {/* Header */}
      <div className="flex justify-between items-center pb-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-sky-500/20 rounded-2xl border border-sky-500/30 text-sky-400">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              Atmosphere AI Climate Advisor
            </h2>
            <p className="text-xs text-slate-400">Powered by Gemini 3.6 Flash • Calibrated for {telemetry.location}</p>
          </div>
        </div>

        <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 text-[10px] font-bold rounded-full border border-emerald-500/30 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-emerald-400" /> Active AI
        </span>
      </div>

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
      <div className="flex-1 overflow-y-auto space-y-4 p-3 bg-slate-950/60 rounded-2xl border border-slate-800/80">
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
          <div className="flex items-center gap-2 text-xs text-sky-400 p-3 bg-slate-900/80 rounded-xl border border-slate-800 w-fit animate-pulse">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>Gemini AI is analyzing atmospheric telemetry...</span>
          </div>
        )}
      </div>

      {/* Input Box */}
      <form onSubmit={handleSubmit} className="flex gap-2 pt-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask AI Advisor about local air quality, carbon offsets, or satellite telemetry..."
          className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-indigo-500"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="px-5 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition flex items-center gap-2 shadow-lg"
        >
          <span>Send</span>
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
