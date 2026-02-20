import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer 
} from 'recharts';
import { 
  ArrowLeftIcon, ArrowRightIcon, CpuChipIcon, 
  ExclamationTriangleIcon, ArrowsRightLeftIcon, ChartBarIcon,
  LinkIcon, GlobeAltIcon
} from '@heroicons/react/24/outline';

const StepIndicator = ({ currentStep }) => {
  const steps = [
    { name: 'Synthesis', id: 1 },
    { name: 'Analysis', id: 2 },
    { name: 'Strategy', id: 3 }
  ];
  return (
    <div className="flex items-center justify-center gap-4 mb-8">
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

const Analysis = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { result } = location.state || {};

  if (!result) return <div className="p-20 text-center font-bold dark:bg-slate-950 dark:text-white">Session Expired.</div>;

  const comparison = result.comparison || [];
  const gaps = result.gaps || [];
  const aiSources = result.aiBaseline?.sources || [];
  const hasUserCompetitor = !!result.competitorUrl; 

  const benchmarkData = hasUserCompetitor ? (result.compStructuralAudit || {}) : {
      wordCount: 1650, 
      structure: { h1: 1, h2: 6, h3: 10 } 
  };
  
  const benchmarkLabel = hasUserCompetitor ? "Primary Competitor" : "Market Average";

  const barData = [
    { name: 'Word Depth', you: result.structuralAudit?.wordCount || 0, benchmark: benchmarkData.wordCount || 1200 },
    { name: 'H1 Tags', you: result.structuralAudit?.structure?.h1 || 0, benchmark: benchmarkData.structure?.h1 || 1 },
    { name: 'H2 Tags', you: result.structuralAudit?.structure?.h2 || 0, benchmark: benchmarkData.structure?.h2 || 4 },
    { name: 'H3 Tags', you: result.structuralAudit?.structure?.h3 || 0, benchmark: benchmarkData.structure?.h3 || 6 }
  ];

  return (
    <div className="min-h-screen bg-[#F9FAFF] dark:bg-slate-950 text-[#1A1A3A] dark:text-slate-100 p-6 md:p-10 relative transition-colors duration-300">
      <div className="max-w-6xl mx-auto ">

        <StepIndicator currentStep={2} />
        
        <div className="flex flex-col md:flex-row justify-between items-start gap-6 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="space-y-4 w-full">
             <button onClick={() => navigate(-1)} className="group flex items-center gap-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 font-bold text-xs uppercase tracking-wider transition-colors">
               <ArrowLeftIcon className="w-4 h-4 stroke-[3px] group-hover:-translate-x-1 transition-transform" />
               Back to Synthesis
             </button>
            
            <div className="space-y-1">
                <h1 className="text-4xl font-black tracking-tight dark:text-white leading-tight">
                Landscape <span className="text-indigo-600 dark:text-indigo-400 font-serif italic font-normal">Audit</span>
                </h1>
                <div className="flex flex-col gap-3">
                    <p className="text-slate-400 dark:text-slate-500 font-medium text-md">
                        Analysis performed against <b>{aiSources.length + (hasUserCompetitor ? 1 : 0)} authority sources</b> identified by the AI:
                    </p>
                    {/* INTEGRATED SOURCES LIST */}
                    <div className="flex flex-wrap gap-2">
                        {aiSources.map((source, i) => (
                            <a 
                                key={i} 
                                href={source.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 px-3 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:border-indigo-400 transition-all shadow-sm group"
                            >
                                <GlobeAltIcon className="w-3 h-3 text-slate-400 group-hover:text-indigo-500" />
                                {source.name}
                            </a>
                        ))}
                        {hasUserCompetitor && (
                            <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 rounded-lg text-sm font-bold text-amber-700 dark:text-amber-500 shadow-sm">
                                <LinkIcon className="w-3 h-3" />
                                User Provided
                            </div>
                        )}
                    </div>
                </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 items-end shrink-0">
            <div className="flex items-center gap-2 px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full border border-indigo-100 dark:border-indigo-800">
              <CpuChipIcon className="w-3.5 h-3.5" />
              <span className="text-[10px] font-black uppercase tracking-tighter">Analyzed by {result.modelUsed || 'AI Engine'}</span>
            </div>

            {hasUserCompetitor && result.competitorScore !== null && (
                <div className="bg-white dark:bg-slate-900 px-8 py-4 rounded-2xl border border-rose-100 dark:border-rose-900/30 shadow-sm text-center min-w-[180px]">
                  <p className="text-[10px] font-black text-rose-400 dark:text-rose-500 uppercase tracking-widest mb-2">Direct Comp. Score</p>
                  <p className="text-4xl font-black text-rose-500 leading-none">{result.competitorScore}<span className="text-2xl">%</span></p>
                </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
          
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm space-y-6 transition-colors">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-50 dark:bg-indigo-950/30 rounded-xl text-indigo-600 dark:text-indigo-400"><ChartBarIcon className="w-5 h-5" /></div>
                  <h3 className="font-bold text-lg uppercase tracking-tight dark:text-slate-200">Structural Comparison</h3>
                </div>
                <div className="flex gap-6 text-[10px] font-black uppercase tracking-widest">
                   <div className="flex items-center gap-2 dark:text-slate-400"><div className="w-3 h-3 bg-indigo-600 rounded-sm"/> Your Site</div>
                   <div className="flex items-center gap-2 dark:text-slate-400"><div className="w-3 h-3 bg-slate-300 dark:bg-slate-700 rounded-sm"/> {benchmarkLabel}</div>
                </div>
              </div>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }} barGap={8}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:opacity-10" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11, fontWeight: 700}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                    <RechartsTooltip cursor={{fill: '#f8fafc'}} wrapperStyle={{outline: 'none'}} contentStyle={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} itemStyle={{ fontSize: '12px', fontWeight: 'bold' }} />
                    <Bar dataKey="you" fill="#6366f1" radius={[6, 6, 6, 6]} barSize={24} />
                    <Bar dataKey="benchmark" fill="#cbd5e1" className="dark:fill-slate-700" radius={[6, 6, 6, 6]} barSize={24} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-sm border border-slate-100 dark:border-slate-800 space-y-6 transition-colors">
              <h3 className="font-bold text-sm uppercase tracking-widest flex items-center gap-2 dark:text-slate-300">
                <ArrowsRightLeftIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" /> Multi-Source Signal Evaluation
              </h3>
              <div className="space-y-3">
              {comparison.length > 0 ? comparison.map((item, i) => (
                <div key={i} className="p-4 rounded-2xl border border-slate-50 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex items-center justify-between hover:bg-white dark:hover:bg-slate-800 hover:border-indigo-100 dark:hover:border-indigo-900 transition-all">
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{item.feature}</p>
                  <div className="flex items-center gap-4">
                    <div className="text-right hidden md:block">
                        <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase">Market Check</p>
                        <p className="text-xs font-bold text-slate-600 dark:text-slate-400">{item.compStatus}</p>
                    </div>
                    <div className={`px-4 py-1.5 rounded-full font-black text-xs uppercase tracking-wider ${item.yourStatus === 'Strong' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' : item.yourStatus === 'Weak' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' : 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400'}`}>
                      {item.yourStatus}
                    </div>
                  </div>
                </div>
              )) : <p className="text-slate-400 dark:text-slate-500 italic py-4">No specific signals evaluated.</p>}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="bg-[#1A1A3A] dark:bg-slate-900 text-white rounded-[2.5rem] p-8 shadow-xl flex flex-col h-full justify-between border dark:border-slate-800 transition-colors">
              <div>
                  <h3 className="font-bold flex items-center gap-3 text-sm uppercase tracking-widest mb-8 text-indigo-300 dark:text-indigo-400">
                    <CpuChipIcon className="w-5 h-5" /> Competitive Content Gaps
                  </h3>
                  <div className="space-y-4">
                    {gaps.length > 0 ? gaps.map((gap, i) => (
                      <div key={i} className="p-4 bg-white/10 dark:bg-slate-800/50 rounded-2xl border border-white/10 dark:border-slate-700 flex items-start justify-between gap-4">
                        <div>
                          <p className="font-bold text-sm text-white dark:text-slate-100 leading-tight">{gap.topic}</p>
                          <p className={`text-[9px] font-black uppercase tracking-widest mt-2 ${gap.impact === 'High' ? 'text-rose-400' : 'text-amber-400'}`}>{gap.impact} Priority</p>
                        </div>
                        <ExclamationTriangleIcon className={`w-5 h-5 shrink-0 ${gap.impact === 'High' ? 'text-rose-400' : 'text-amber-400'}`} />
                      </div>
                    )) : <p className="text-indigo-200 dark:text-indigo-400 italic text-sm">No critical gaps detected compared to authority sources.</p>}
                  </div>
              </div>
              
              <div className="pt-8 border-t border-white/10 mt-6">
                  <button 
                    onClick={() => navigate('/recommendations', { state: { result } })} 
                    className="w-full group flex items-center justify-between px-8 py-5 bg-emerald-500 dark:bg-emerald-600 text-[#1A1A3A] dark:text-white rounded-[1.5rem] font-black shadow-lg shadow-emerald-500/20 hover:bg-emerald-400 dark:hover:bg-emerald-500 transition-all active:scale-[0.98]"
                  >
                    <span>Optimization Strategy</span>
                    <ArrowRightIcon className="w-5 h-5 stroke-[3px] group-hover:translate-x-1 transition-transform" />
                  </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analysis;