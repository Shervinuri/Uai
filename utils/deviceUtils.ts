import { UAParser } from 'ua-parser-js';
import { DeviceData } from '../types';

export const getIP = async (): Promise<{ ip: string; city?: string; country?: string }> => {
  try {
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    return { ip: data.ip, city: data.city, country: data.country_name };
  } catch (e) {
    return { ip: 'Hidden/VPN', city: 'Unknown', country: 'Unknown' };
  }
};

export const getGPUInfo = (): { vendor: string; renderer: string } => {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return { vendor: 'Unknown', renderer: 'Unknown' };

    const debugInfo = (gl as WebGLRenderingContext).getExtension('WEBGL_debug_renderer_info');
    if (!debugInfo) return { vendor: 'Unknown', renderer: 'Unknown' };

    const vendor = (gl as WebGLRenderingContext).getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
    const renderer = (gl as WebGLRenderingContext).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);

    return { vendor: vendor || 'Generic', renderer: renderer || 'Generic' };
  } catch (e) {
    return { vendor: 'Error', renderer: 'Error' };
  }
};

export const generateFingerprint = (data: Partial<DeviceData>): string => {
  const str = JSON.stringify({
    ua: data.ua,
    screen: data.screen,
    gpu: data.gpu,
    cpu: data.cpu,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
  });
  
  // Simple hash for demo purposes (DJB2)
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) + str.charCodeAt(i); 
  }
  return (hash >>> 0).toString(16).toUpperCase();
};

export const collectDeviceData = async (): Promise<DeviceData> => {
  const parser = new UAParser();
  const result = parser.getResult();
  const gpu = getGPUInfo();
  const ipData = await getIP();

  // Battery
  let batteryData = { level: -1, charging: false };
  if (navigator.getBattery) {
    try {
      const bat = await navigator.getBattery();
      batteryData = { level: bat.level * 100, charging: bat.charging };
    } catch (e) { /* ignore */ }
  }

  // Network
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  
  return {
    ua: result.ua,
    browser: {
      name: result.browser.name || 'Unknown',
      version: result.browser.version || 'Unknown',
      engine: result.engine.name || 'Unknown'
    },
    os: {
      name: result.os.name || 'Unknown',
      version: result.os.version || 'Unknown',
      platform: navigator.platform
    },
    device: {
      vendor: result.device.vendor || 'PC/Generic',
      model: result.device.model || 'Unknown Device',
      type: result.device.type || 'Desktop'
    },
    cpu: {
      architecture: result.cpu.architecture || 'Unknown',
      cores: navigator.hardwareConcurrency || 0
    },
    gpu: gpu,
    screen: {
      width: window.screen.width,
      height: window.screen.height,
      colorDepth: window.screen.colorDepth,
      pixelRatio: window.devicePixelRatio,
      orientation: screen.orientation ? screen.orientation.type : 'Unknown'
    },
    network: {
      ip: ipData.ip,
      type: connection?.effectiveType || 'Unknown',
      downlink: connection?.downlink || 0,
      rtt: connection?.rtt || 0
    },
    battery: batteryData,
    location: {
      lat: 0, 
      lng: 0,
      city: ipData.city,
      country: ipData.country
    },
    fingerprint: ''
  };
};