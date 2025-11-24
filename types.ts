export interface BatteryManager extends EventTarget {
  charging: boolean;
  chargingTime: number;
  dischargingTime: number;
  level: number;
  addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
  removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
}

export interface NetworkInformation extends EventTarget {
  downlink?: number;
  effectiveType?: string;
  rtt?: number;
  saveData?: boolean;
  type?: string;
}

// Extend Navigator to include non-standard APIs
declare global {
  interface Navigator {
    getBattery?: () => Promise<BatteryManager>;
    connection?: NetworkInformation;
    mozConnection?: NetworkInformation;
    webkitConnection?: NetworkInformation;
    deviceMemory?: number;
  }
}

export interface DeviceData {
  ua: string;
  browser: { name: string; version: string; engine: string };
  os: { name: string; version: string; platform: string };
  device: { vendor: string; model: string; type: string };
  cpu: { architecture: string; cores: number };
  gpu: { vendor: string; renderer: string };
  screen: { width: number; height: number; colorDepth: number; pixelRatio: number; orientation: string };
  network: { ip: string; type: string; downlink: number; rtt: number };
  battery: { level: number; charging: boolean };
  location: { lat: number; lng: number; city?: string; country?: string };
  fingerprint: string;
}