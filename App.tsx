import React, { useEffect, useState, useRef } from 'react';
import { 
  FiSmartphone, FiCpu, FiWifi, FiMapPin, FiBattery, FiCode, FiEye, FiShield, FiAlertTriangle
} from 'react-icons/fi';
import Footer from './components/Footer';
import InfoBlock, { DataRow } from './components/InfoBlock';
import { collectDeviceData, generateFingerprint } from './utils/deviceUtils';
import { DeviceData, BatteryManager } from './types';

const App: React.FC = () => {
  const [data, setData] = useState<DeviceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initial Data Load
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate "scanning" delay for effect
        await new Promise(resolve => setTimeout(resolve, 800));
        const deviceData = await collectDeviceData();
        deviceData.fingerprint = generateFingerprint(deviceData);
        setData(deviceData);
        setLoading(false);
      } catch (err) {
        console.error("Initialization Failed:", err);
        setError("CRITICAL_FAILURE: Unable to probe device sensors.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Real-time Battery Monitoring
  useEffect(() => {
    // Only run if we have data and API support
    if (loading || error || !navigator.getBattery) return;

    let batteryManager: BatteryManager | null = null;

    const updateBatteryState = () => {
      if (!batteryManager) return;
      
      setData(prevData => {
        if (!prevData) return null;
        // Deep copy to ensure React detects change
        return {
          ...prevData,
          battery: {
            level: Math.round(batteryManager!.level * 100),
            charging: batteryManager!.charging
          }
        };
      });
    };

    navigator.getBattery().then(bat => {
      batteryManager = bat;
      // Attach Listeners
      bat.addEventListener('levelchange', updateBatteryState);
      bat.addEventListener('chargingchange', updateBatteryState);
      // Initial sync
      updateBatteryState();
    }).catch(e => {
      console.warn("Battery API Access Denied:", e);
    });

    // Cleanup
    return () => {
      if (batteryManager) {
        batteryManager.removeEventListener('levelchange', updateBatteryState);
        batteryManager.removeEventListener('chargingchange', updateBatteryState);
      }
    };
  }, [loading, error]);

  if (loading) {
    return (
      <div className="min-h-screen bg-shen-black flex flex-col items-center justify-center p-4">
        <div className="text-shen-accent font-mono text-2xl animate-pulse mb-4">
          INITIALIZING_MONITOR_PROTOCOL...
        </div>
        <div className="w-64 h-1 bg-gray-800 rounded overflow-hidden">
          <div className="h-full bg-shen-accent animate-progress"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-shen-black flex flex-col items-center justify-center p-4 text-center">
        <FiAlertTriangle className="text-red-500 mb-4" size={64} />
        <h1 className="text-2xl font-bold text-red-500 mb-2">SYSTEM ERROR</h1>
        <p className="text-gray-400 font-mono mb-6">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-red-900/20 border border-red-500 text-red-400 rounded hover:bg-red-900/40 transition-colors"
        >
          RETRY_CONNECTION
        </button>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="min-h-screen bg-shen-black text-gray-200 font-sans selection:bg-shen-accent selection:text-black flex flex-col">
      
      {/* Header */}
      <header className="p-6 border-b border-gray-800 bg-shen-black/90 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tighter text-white">
              SHΞN™ <span className="text-shen-accent">AGENT MONITOR</span>
            </h1>
            <p className="text-xs text-gray-500 font-mono mt-1">
              SYSTEM_ID: {data.fingerprint.substring(0, 8)}
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded bg-shen-accent/10 border border-shen-accent/20">
            <div className="w-2 h-2 rounded-full bg-shen-accent animate-ping"></div>
            <span className="text-xs font-mono text-shen-accent">LIVE_TRACKING</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Warning Banner */}
          <div className="mb-8 p-4 rounded-lg bg-red-900/10 border border-red-900/30 flex items-start gap-4 animate-fade-in">
            <FiShield className="text-red-500 mt-1 shrink-0" size={24} />
            <div>
              <h2 className="text-red-400 font-bold uppercase tracking-wide text-sm">Privacy Exposure Alert</h2>
              <p className="text-gray-400 text-sm mt-1">
                This is a demonstration of how easily your device fingerprint, hardware identifiers, and location can be extracted by any website you visit without explicit login.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Device Identity */}
            <InfoBlock title="Device Identity" icon={FiSmartphone} delay={100}>
              <DataRow label="Vendor" value={data.device.vendor} highlight={data.device.vendor !== 'PC/Generic'} />
              <DataRow label="Model" value={data.device.model} highlight={data.device.model !== 'Unknown Device'} />
              <DataRow label="Type" value={data.device.type} />
              <DataRow label="Memory (RAM)" value={`${navigator.deviceMemory || '?'} GB`} />
            </InfoBlock>

            {/* Operating System & Browser */}
            <InfoBlock title="Software Engine" icon={FiCode} delay={200}>
              <DataRow label="OS Name" value={data.os.name} />
              <DataRow label="OS Version" value={data.os.version} />
              <DataRow label="Platform" value={data.os.platform} mono />
              <DataRow label="Browser" value={`${data.browser.name} ${data.browser.version}`} />
              <DataRow label="Engine" value={data.browser.engine} />
            </InfoBlock>

            {/* Hardware Graphics */}
            <InfoBlock title="Hardware / GPU" icon={FiCpu} delay={300}>
              <DataRow label="CPU Cores" value={data.cpu.cores} />
              <DataRow label="Architecture" value={data.cpu.architecture} />
              <DataRow label="GPU Vendor" value={data.gpu.vendor} />
              <DataRow label="GPU Renderer" value={data.gpu.renderer} highlight />
            </InfoBlock>

            {/* Display */}
            <InfoBlock title="Display Metrics" icon={FiEye} delay={400}>
              <DataRow label="Resolution" value={`${data.screen.width} x ${data.screen.height}`} highlight />
              <DataRow label="Color Depth" value={`${data.screen.colorDepth}-bit`} />
              <DataRow label="Pixel Ratio" value={`${data.screen.pixelRatio}x`} />
              <DataRow label="Orientation" value={data.screen.orientation} />
            </InfoBlock>

            {/* Network & Location */}
            <InfoBlock title="Network & Geo" icon={FiMapPin} delay={500} alert>
              <DataRow label="Public IP" value={data.network.ip} mono highlight />
              <DataRow label="Location" value={`${data.location.city || 'Unknown'}, ${data.location.country || 'Unknown'}`} />
              <DataRow label="Connection" value={data.network.type} />
              <DataRow label="Downlink" value={`${data.network.downlink} Mbps`} />
            </InfoBlock>

            {/* Battery & Status */}
            <InfoBlock title="Power Status" icon={FiBattery} delay={600}>
              <div className="mb-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-400">BATTERY LEVEL</span>
                  <span className={`font-mono ${data.battery.charging ? 'text-shen-accent animate-pulse' : 'text-white'}`}>
                    {data.battery.level >= 0 ? `${data.battery.level}%` : 'N/A'}
                    {data.battery.charging && ' ⚡'}
                  </span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 ${data.battery.level < 20 ? 'bg-red-500' : 'bg-shen-accent'}`}
                    style={{ width: `${data.battery.level >= 0 ? data.battery.level : 0}%` }}
                  ></div>
                </div>
              </div>
              
              <DataRow label="Charging Status" value={data.battery.charging ? 'Active' : 'Discharging'} />
              <DataRow label="Language" value={navigator.language} />
              <DataRow label="Cookies Enabled" value={navigator.cookieEnabled ? 'Yes' : 'No'} />
            </InfoBlock>

          </div>

          {/* Raw UA String */}
          <div className="mt-8 p-6 rounded-xl border border-gray-800 bg-gray-900/30 backdrop-blur">
            <h3 className="text-gray-500 text-sm font-bold uppercase mb-2">Raw User Agent String</h3>
            <p className="font-mono text-xs md:text-sm text-shen-accent break-all leading-relaxed">
              {data.ua}
            </p>
          </div>

        </div>
      </main>

      <Footer />

      <style>{`
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          50% { opacity: 0.5; }
          100% { top: 100%; opacity: 0; }
        }
        .animate-scan {
          animation: scan 3s linear infinite;
        }
        @keyframes progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        .animate-progress {
          animation: progress 1s ease-out forwards;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .glow {
          text-shadow: 0 0 10px rgba(0, 255, 65, 0.3);
        }
      `}</style>
    </div>
  );
};

export default App;