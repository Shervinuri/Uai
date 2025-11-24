import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full py-6 mt-12 bg-shen-black border-t border-gray-800 flex justify-center items-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-900 to-transparent opacity-50 pointer-events-none"></div>
      
      <a 
        href="https://T.me/shervini" 
        target="_blank" 
        rel="noopener noreferrer"
        className="relative z-10 group"
      >
        <span 
          className="text-lg font-bold tracking-widest transition-all duration-300"
          style={{
            fontFamily: 'Arimo, sans-serif',
            background: 'linear-gradient(45deg, #ffffff 30%, #888888 50%, #000000 80%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundSize: '200% 200%',
            animation: 'shine 3s linear infinite',
          }}
        >
          Exclusive SHΞN™ made
        </span>
        <div className="h-[1px] w-0 group-hover:w-full bg-shen-accent transition-all duration-300 mx-auto mt-1"></div>
      </a>

      <style>{`
        @keyframes shine {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </footer>
  );
};

export default Footer;