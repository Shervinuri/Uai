import React from 'react';
import { IconType } from 'react-icons';

interface InfoBlockProps {
  title: string;
  icon: IconType;
  children: React.ReactNode;
  delay?: number;
  alert?: boolean;
}

const InfoBlock: React.FC<InfoBlockProps> = ({ title, icon: Icon, children, delay = 0, alert = false }) => {
  return (
    <div 
      className={`
        relative overflow-hidden rounded-xl border p-6 backdrop-blur-sm
        transition-all duration-700 ease-out transform translate-y-4 opacity-0 animate-fade-in-up
        ${alert ? 'border-red-900/50 bg-red-900/10' : 'border-gray-800 bg-gray-900/40 hover:border-shen-accent/50'}
      `}
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
    >
      <div className="absolute top-0 right-0 p-4 opacity-20">
        <Icon size={48} className={alert ? "text-red-500" : "text-shen-accent"} />
      </div>
      
      <div className="flex items-center gap-3 mb-4">
        <Icon size={24} className={alert ? "text-red-500" : "text-shen-accent"} />
        <h3 className={`font-mono text-lg font-bold uppercase tracking-wider ${alert ? "text-red-400" : "text-gray-200"}`}>
          {title}
        </h3>
      </div>
      
      <div className="space-y-3 relative z-10">
        {children}
      </div>

      {/* Scanning Line Effect */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-shen-accent to-transparent opacity-20 animate-scan pointer-events-none"></div>
    </div>
  );
};

export const DataRow: React.FC<{ label: string; value: string | number; mono?: boolean; highlight?: boolean }> = ({ label, value, mono = false, highlight = false }) => (
  <div className="flex justify-between items-start border-b border-gray-800/50 pb-2 last:border-0 last:pb-0">
    <span className="text-gray-500 text-sm font-semibold">{label}</span>
    <span className={`text-right text-sm ${mono ? 'font-mono' : 'font-sans'} ${highlight ? 'text-shen-accent font-bold glow' : 'text-gray-300'}`}>
      {value}
    </span>
  </div>
);

export default InfoBlock;