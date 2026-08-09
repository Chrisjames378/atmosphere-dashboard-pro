import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { WeatherCard } from './components/WeatherCard';
import { AirQualityCard } from './components/AirQualityCard';
import { EcoActionLogger } from './components/EcoActionLogger';
import { SatelliteRadarMap } from './components/SatelliteRadarMap';
import { CarbonExchange } from './components/CarbonExchange';
import { AnalyticsView } from './components/AnalyticsView';
import { ClimateAdvisor } from './components/ClimateAdvisor';
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
  }, [selectedLocation, fetchTelemetry]);

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
      />

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
          <ClimateAdvisor telemetry={telemetry} />
        )}

      </main>

      {/* Footer */}
      <Footer />

    </div>
  );
}
