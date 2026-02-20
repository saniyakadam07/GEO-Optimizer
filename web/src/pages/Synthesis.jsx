import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  ArrowRightIcon, ArrowLeftIcon, SparklesIcon,
  ChartPieIcon, GlobeAltIcon, LinkIcon, CpuChipIcon,
  ListBulletIcon, TableCellsIcon, DocumentTextIcon,
  HashtagIcon
} from '@heroicons/react/24/outline';

const StepIndicator = ({ currentStep }) => {
  const steps = [
    { name: 'Synthesis', id: 1 },
    { name: 'Analysis', id: 2 },
    { name: 'Strategy', id: 3 }
  ];
  return (
    <div className="flex items-center justify-center gap-4 mb-10">
      {steps.map((step, i) => (
        <React.Fragment key={step.id}>
          <div className={`flex items-center gap-2 ${currentStep === step.id ? 'opacity-100' : 'opacity-50 grayscale'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black shadow-sm ${currentStep === step.id ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
              {step.id}
            </span>
            <span className={`text-[11px] font-black uppercase tracking-widest ${currentStep === step.id ? 'text-indigo-900 dark:text-indigo-400' : 'text-slate-400'}`}>{step.name}</span>
          </div>
          {i < steps.length - 1 && <div className="w-12 h-[2px] bg-slate-100 dark:bg-slate-800" />}
        </React.Fragment>
      ))}
    </div>
  );
};

const Synthesis = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { result } = state || {};

  if (!result) return <div className="min-h-screen flex items-center justify-center text-slate-400 font-bold dark:bg-slate-950">Session Expired. Please restart analysis.</div>;

  return (
    <div className="min-h-screen bg-[#F9FAFF] dark:bg-slate-950 text-[#1A1A3A] dark:text-slate-100 font-sans p-6 md:p-10 relative overflow-hidden transition-colors duration-300">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-50/40 dark:bg-indigo-900/10 blur-[150px] rounded-full -z-10" />

      <div className="relative z-10 max-w-6xl mx-auto space-y-8">
        <StepIndicator currentStep={1} />

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="space-y-2">
            <button onClick={() => navigate('/')} className="group flex items-center gap-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 font-bold text-xs uppercase tracking-wider transition-colors">
              <ArrowLeftIcon className="w-4 h-4 stroke-[3px] group-hover:-translate-x-1 transition-transform" />
              Reset & Start Over
            </button>
            <h1 className="text-4xl font-black tracking-tight text-[#1A1A3A] dark:text-white">
              Intelligence <span className="text-indigo-600 dark:text-indigo-400 font-serif italic font-normal">Synthesis</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium max-w-xl">
              Tailored synthesis for: <span className="text-indigo-900 dark:text-indigo-300 font-bold">"{result.question}"</span>
            </p>
          </div>
          
          <div className="flex flex-col gap-2 items-end">
            <div className="flex items-center gap-2 px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full border border-indigo-100 dark:border-indigo-800">
              <CpuChipIcon className="w-3.5 h-3.5" />
              <span className="text-[10px] font-black uppercase tracking-tighter">Engine: {result.modelUsed || 'AI Engine'}</span>
            </div>
            
            <div className="bg-white dark:bg-slate-900 px-8 py-4 rounded-2xl border border-indigo-50 dark:border-slate-800 shadow-sm text-center min-w-[180px]">
               <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">GEO Readiness</p>
               <p className="text-4xl font-black text-indigo-600 dark:text-indigo-400 leading-none">{result.geoScore}<span className="text-2xl">%</span></p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* AI Response Section */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 shadow-sm border border-slate-100 dark:border-slate-800 relative overflow-hidden h-full">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-400 to-purple-400" />
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-50 dark:bg-slate-800 rounded-xl text-indigo-600 dark:text-indigo-400 shadow-sm">
                    <SparklesIcon className="w-5 h-5 stroke-[2px]" />
                  </div>
                  <h2 className="font-bold text-lg uppercase tracking-tight dark:text-slate-200">AI Baseline Response</h2>
                </div>

                <div className="bg-[#F8FAFC] dark:bg-slate-800/50 rounded-[2rem] p-8 border border-slate-100 dark:border-slate-700 leading-relaxed font-medium text-slate-700 dark:text-slate-300 italic relative min-h-[200px]">
                  <span className="absolute top-4 left-4 text-4xl text-indigo-100 dark:text-slate-700 font-serif">“</span>
                  {result.aiBaseline?.answer || "No synthesis could be generated from the provided content."}
                  <span className="absolute bottom-4 right-4 text-4xl text-indigo-100 dark:text-slate-700 font-serif leading-none">”</span>
                </div>

                {result.aiBaseline?.sources && result.aiBaseline.sources.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                    <LinkIcon className="w-4 h-4" /> Trusted Sources
                  </h4>
                  <div className="grid grid-cols-1 gap-2">
                    {result.aiBaseline.sources.map((source, i) => (
                      <a key={i} href={source.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl text-sm transition-all hover:border-indigo-300 hover:shadow-md group">
                        <div className="flex items-center gap-3 truncate">
                          <span className="text-[10px] font-black text-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 w-6 h-6 flex items-center justify-center rounded-md">{i+1}</span>
                          <span className="font-bold text-slate-700 dark:text-slate-300 truncate">{source.name}</span>
                        </div>
                        <GlobeAltIcon className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 transition-colors" />
                      </a>
                    ))}
                  </div>
                </div>
                )}
              </div>
            </div>
          </div>

          {/* Structural Signal Extraction Section */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-sm h-full flex flex-col transition-colors">
              <div className="flex-1 space-y-8">
                <div className="flex items-center gap-3">
                  <ChartPieIcon className="w-6 h-6 text-purple-500 dark:text-purple-400" />
                  <h3 className="font-bold text-[#1A1A3A] dark:text-slate-200 uppercase tracking-tight">Your Content Anatomy</h3>
                </div>

                {/* Word Count Display */}
                <div className="flex items-center gap-4 bg-indigo-50/50 dark:bg-indigo-900/10 p-5 rounded-2xl border border-indigo-100 dark:border-indigo-800/50">
                  <DocumentTextIcon className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                  <div>
                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Total Word Count</p>
                    <p className="text-3xl font-black text-indigo-900 dark:text-white leading-none mt-1">
                      {result.structuralAudit?.wordCount || 0}
                    </p>
                  </div>
                </div>

                {/* Heading Hierarchy Display */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <HashtagIcon className="w-4 h-4 text-purple-500" />
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Heading Hierarchy</h4>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: 'H1', count: result.structuralAudit?.structure?.h1 || 0, color: 'bg-indigo-600' },
                      { label: 'H2', count: result.structuralAudit?.structure?.h2 || 0, color: 'bg-purple-600' },
                      { label: 'H3', count: result.structuralAudit?.structure?.h3 || 0, color: 'bg-fuchsia-600' }
                    ].map((h, i) => (
                      <div key={i} className="text-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                        <p className={`inline-block px-2 py-0.5 rounded text-[10px] font-black text-white mb-1 ${h.color}`}>{h.label}</p>
                        <p className="text-xl font-bold dark:text-white">{h.count}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pattern Detection Display */}
                <div className="space-y-3">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pattern Detection</h4>
                  <div className="flex flex-wrap gap-2">
                    {result.structuralAudit?.patterns?.length > 0 ? result.structuralAudit.patterns.map((pattern, idx) => (
                      <div key={idx} className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm transition-all hover:border-indigo-300">
                        {pattern === "Lists" && <ListBulletIcon className="w-4 h-4 text-indigo-500" />}
                        {pattern === "Tables" && <TableCellsIcon className="w-4 h-4 text-emerald-500" />}
                        {pattern === "Paragraphs" && <DocumentTextIcon className="w-4 h-4 text-amber-500" />}
                        <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{pattern}</span>
                      </div>
                    )) : (
                      <p className="text-slate-400 italic text-[11px] px-1 font-medium">Standard unstructured text detected.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Navigation Action */}
              <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
                  <button 
                    onClick={() => navigate('/analysis', { state: { result } })}
                    className="group w-full flex items-center justify-between px-8 py-5 bg-[#1A1A3A] dark:bg-indigo-600 text-white rounded-[1.5rem] font-bold shadow-xl hover:bg-black dark:hover:bg-indigo-700 transition-all active:scale-[0.98]"
                  >
                    <span className="uppercase tracking-widest text-xs">Deep Analysis</span>
                    <ArrowRightIcon className="w-5 h-5 stroke-[3px] group-hover:translate-x-1 transition-transform" />
                  </button>
                  <p className="text-center text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mt-4">
                    Step 2: Competitive Benchmarking
                  </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Synthesis;