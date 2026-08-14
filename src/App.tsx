import React, { useState, useEffect, useCallback } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { Navbar } from './components/Navbar';
import { WeatherCard } from './components/WeatherCard';
import { AirQualityCard } from './components/AirQualityCard';
import { EcoActionLogger } from './components/EcoActionLogger';
import { SatelliteRadarMap } from './components/SatelliteRadarMap';
import { CarbonExchange } from './components/CarbonExchange';
import { AnalyticsView } from './components/AnalyticsView';
import { ClimateAdvisor } from './components/ClimateAdvisor';
import { ThresholdsModal, AlertThresholds } from './components/ThresholdsModal';
import { AlertBanner } from './components/AlertBanner';
import { ExportModal } from './components/ExportModal';
import { NotificationModal } from './components/NotificationModal';
import { DEFAULT_REMINDER_SETTINGS, ReminderSettings } from './utils/notificationService';
import { Footer } from './components/Footer';
import { INITIAL_TRANSACTIONS } from './data/mockData';
import { TelemetryData, CarbonTransaction } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<'overview' | 'exchange' | 'satellite' | 'analytics' | 'advisor'>('overview');
  
  // Wallet state persistent in localStorage as atmosphere_credits
  const [creditsBalance, setCreditsBalance] = useState<number>(() => {
    const stored = localStorage.getItem('atmosphere_credits');
    return stored ? parseInt(stored, 10) : 125;
  });

  const [transactions, setTransactions] = useState<CarbonTransaction[]>(() => {
    const stored = localStorage.getItem('atmosphere_transactions');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return INITIAL_TRANSACTIONS;
      }
    }
    return INITIAL_TRANSACTIONS;
  });

  const [selectedLocation, setSelectedLocation] = useState<string>('San Francisco, USA');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Live Stream auto-refresh toggle state
  const [isLiveStream, setIsLiveStream] = useState<boolean>(false);

  // Modals & Alert Thresholds State
  const [thresholds, setThresholds] = useState<AlertThresholds>({
    maxAqi: 50,
    maxTemp: 30,
    maxCo2: 430,
    enabled: true,
  });
  const [isThresholdsOpen, setIsThresholdsOpen] = useState<boolean>(false);
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);
  const [isAlertDismissed, setIsAlertDismissed] = useState<boolean>(false);

  const [reminderSettings, setReminderSettings] = useState<ReminderSettings>(() => {
    try {
      const stored = localStorage.getItem('atmosphere_reminders');
      return stored ? JSON.parse(stored) : DEFAULT_REMINDER_SETTINGS;
    } catch {
      return DEFAULT_REMINDER_SETTINGS;
    }
  });

  // Default fallback telemetry
  const [telemetry, setTelemetry] = useState<TelemetryData>({
    location: 'San Francisco, USA',
    temperature: 18,
    feelsLike: 20,
    condition: 'Partly Cloudy',
    windSpeed: 14,
    windDirection: 'SW',
    humidity: 74,
    pressure: 1018,
    aqi: 28,
    aqiCategory: 'Good',
    co2: '421.4',
    methane: 1912,
    ozone: 32,
    pollen: 'Low (Grass)',
    pm25: '5.6',
    pm10: '12.4',
    lastUpdated: new Date().toISOString(),
  });

  // Fetch telemetry from backend API
  const fetchTelemetry = useCallback(async (loc: string) => {
    setIsRefreshing(true);
    try {
      const res = await fetch(`/api/telemetry?location=${encodeURIComponent(loc)}`);
      if (res.ok) {
        const data = await res.json();
        setTelemetry(data);
      }
    } catch (err) {
      console.error('Failed to fetch telemetry:', err);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchTelemetry(selectedLocation);
    setIsAlertDismissed(false);
  }, [selectedLocation, fetchTelemetry]);

  // Live Stream 5-second Auto Refresh Interval
  useEffect(() => {
    if (!isLiveStream) return;

    const interval = setInterval(() => {
      // Small realistic fluctuations to simulate live satellite streaming radar
      setTelemetry((prev) => {
        const tempDelta = (Math.random() - 0.45) * 0.4;
        const newTemp = Math.round((prev.temperature + tempDelta) * 10) / 10;
        const aqiDelta = Math.floor((Math.random() - 0.48) * 3);
        const newAqi = Math.max(10, prev.aqi + aqiDelta);
        const newCo2 = (parseFloat(prev.co2) + (Math.random() - 0.48) * 0.2).toFixed(1);

        return {
          ...prev,
          temperature: newTemp,
          feelsLike: Math.round((newTemp + 2) * 10) / 10,
          aqi: newAqi,
          aqiCategory: newAqi <= 50 ? 'Good' : newAqi <= 100 ? 'Moderate' : 'Unhealthy',
          co2: newCo2,
          windSpeed: Math.max(5, Math.min(45, Math.round(prev.windSpeed + (Math.random() - 0.5) * 2))),
          lastUpdated: new Date().toISOString(),
        };
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [isLiveStream]);

  // Persist credits
  const updateCredits = useCallback((newBalance: number) => {
    setCreditsBalance(newBalance);
    localStorage.setItem('atmosphere_credits', newBalance.toString());
  }, []);

  // Add credits helper
  const addCredits = useCallback((amount: number, reason: string) => {
    setCreditsBalance((prev) => {
      const next = prev + amount;
      localStorage.setItem('atmosphere_credits', next.toString());
      return next;
    });

    const newTx: CarbonTransaction = {
      id: 'tx-' + Date.now(),
      title: reason,
      type: 'earn',
      amount,
      date: new Date().toLocaleString('sv').slice(0, 16),
      details: 'Logged via Atmosphere Eco Logger',
    };

    setTransactions((prev) => {
      const updated = [newTx, ...prev];
      localStorage.setItem('atmosphere_transactions', JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Redeem credits helper
  const redeemCredits = useCallback((amount: number, projectTitle: string): boolean => {
    let success = false;
    setCreditsBalance((prev) => {
      if (prev < amount) {
        success = false;
        return prev;
      }
      success = true;
      const next = prev - amount;
      localStorage.setItem('atmosphere_credits', next.toString());
      return next;
    });

    if (success) {
      const newTx: CarbonTransaction = {
        id: 'tx-' + Date.now(),
        title: projectTitle,
        type: 'redeem',
        amount: -amount,
        date: new Date().toLocaleString('sv').slice(0, 16),
        details: 'Verified Retirement / Redemption',
      };

      setTransactions((prev) => {
        const updated = [newTx, ...prev];
        localStorage.setItem('atmosphere_transactions', JSON.stringify(updated));
        return updated;
      });
    }

    return success;
  }, []);

  return (
    <div className="p-4 md:p-8 min-h-screen flex flex-col justify-between max-w-7xl mx-auto w-full space-y-6">
      
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        creditsBalance={creditsBalance}
        selectedLocation={selectedLocation}
        onLocationChange={setSelectedLocation}
        onRefreshTelemetry={() => fetchTelemetry(selectedLocation)}
        isRefreshing={isRefreshing}
        isLiveStream={isLiveStream}
        onToggleLiveStream={() => setIsLiveStream(!isLiveStream)}
        onOpenThresholds={() => setIsThresholdsOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
      />

      {/* Threshold Alert Banner */}
      {!isAlertDismissed && (
        <AlertBanner
          telemetry={telemetry}
          thresholds={thresholds}
          onOpenThresholds={() => setIsThresholdsOpen(true)}
          onDismiss={() => setIsAlertDismissed(true)}
        />
      )}

      {/* Main View Switcher */}
      <main className="space-y-6">
        
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Top 3 Metric Cards Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <WeatherCard telemetry={telemetry} />
              <AirQualityCard telemetry={telemetry} />
              <EcoActionLogger onAddCredits={addCredits} creditsBalance={creditsBalance} />
            </div>

            {/* Satellite & Radar Live Map Preview */}
            <SatelliteRadarMap
              location={telemetry.location}
              onNavigateToExchange={() => setActiveTab('exchange')}
            />
          </div>
        )}

        {/* CARBON EXCHANGE TAB */}
        {activeTab === 'exchange' && (
          <CarbonExchange
            creditsBalance={creditsBalance}
            transactions={transactions}
            onRedeemCredits={redeemCredits}
            onAddCredits={addCredits}
          />
        )}

        {/* SATELLITE & RADAR MAP TAB */}
        {activeTab === 'satellite' && (
          <div className="animate-in fade-in duration-300">
            <SatelliteRadarMap
              location={telemetry.location}
              onNavigateToExchange={() => setActiveTab('exchange')}
            />
          </div>
        )}

        {/* ANALYTICS TAB */}
        {activeTab === 'analytics' && (
          <AnalyticsView location={telemetry.location} />
        )}

        {/* AI CLIMATE ADVISOR TAB */}
        {activeTab === 'advisor' && (
          <ClimateAdvisor telemetry={telemetry} onAddCredits={addCredits} />
        )}

      </main>

      {/* Threshold Settings Modal */}
      {isThresholdsOpen && (
        <ThresholdsModal
          thresholds={thresholds}
          onSave={(newT) => {
            setThresholds(newT);
            setIsAlertDismissed(false);
          }}
          onClose={() => setIsThresholdsOpen(false)}
        />
      )}

      {/* Export & Share Modal */}
      {isExportOpen && (
        <ExportModal
          telemetry={telemetry}
          transactions={transactions}
          creditsBalance={creditsBalance}
          onClose={() => setIsExportOpen(false)}
        />
      )}

      {/* Browser Reminders & Web Notifications Modal */}
      {isNotificationsOpen && (
        <NotificationModal
          settings={reminderSettings}
          onSave={(newSettings) => {
            setReminderSettings(newSettings);
            localStorage.setItem('atmosphere_reminders', JSON.stringify(newSettings));
          }}
          onClose={() => setIsNotificationsOpen(false)}
          onAddCredits={addCredits}
        />
      )}

      {/* Footer */}
      <Footer />

      {/* Vercel Web Analytics */}
      <Analytics />

    </div>
  );
}

