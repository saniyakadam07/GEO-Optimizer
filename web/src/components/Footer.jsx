import React from 'react';

const Footer = () => (
  <footer className="border-t border-indigo-50 dark:border-slate-800 bg-white dark:bg-slate-900 py-10 mt-auto z-10 relative transition-colors duration-300">
    <div className="max-w-7xl mx-auto px-6 text-center">

      <p className="text-[#1A1A3A] dark:text-slate-300 font-medium text-sm mb-4">
        © {new Date().getFullYear()} GEO-Optimizer Platform. <span className="text-indigo-600 dark:text-indigo-400">Built for the Future of Search.</span>
      </p>

      <div className="inline-flex flex-wrap justify-center gap-x-6 gap-y-2 px-6 py-3 bg-[#F9FAFF] dark:bg-slate-800 rounded-full border border-indigo-50 dark:border-slate-700">
        <span className="flex items-center text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mr-2"></span>
          Firecrawl Engine
        </span>
        <span className="flex items-center text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mr-2"></span>
          Firebase Cloud
        </span>
        <span className="flex items-center text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mr-2"></span>
          Multi-Model Architecture
        </span>
      </div>

    </div>
  </footer>
);

export default Footer;