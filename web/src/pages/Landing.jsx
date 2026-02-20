import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  SparklesIcon, 
  CpuChipIcon, 
  RocketLaunchIcon, 
  ShieldCheckIcon,
  GlobeAltIcon,
  ChevronRightIcon,
  ArrowsRightLeftIcon,
  ChartPieIcon,
  BeakerIcon,
  CommandLineIcon
} from '@heroicons/react/24/outline';

const Landing = () => {
  const navigate = useNavigate();

  const globalImpactStats = [
    { 
      label: "Websites Analyzed", 
      value: "28,400+", 
      detail: "Real-time structural audits completed",
      icon: <GlobeAltIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
    },
    { 
      label: "Citations Optimized", 
      value: "1.2M+", 
      detail: "Semantic entities mapped for AI",
      icon: <SparklesIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
    },
    { 
      label: "GEO Success Rate", 
      value: "94%", 
      detail: "Avg. increase in AI summary inclusion",
      icon: <ShieldCheckIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
    }
  ];

  const pipelineSteps = [
    {
      step: "01",
      name: "Dual-Model Synthesis",
      desc: "Simulate responses using Gemini and Llama to identify where your brand is being filtered or cited.",
      icon: <CpuChipIcon className="w-6 h-6" />
    },
    {
      step: "02",
      name: "Semantic Signal Audit",
      desc: "Deep-dive into H1-H3 hierarchy and technical entity density used by AI crawlers for index anchoring.",
      icon: <CommandLineIcon className="w-6 h-6" />
    },
    {
      step: "03",
      name: "Roadmap Generation",
      desc: "Receive specific markdown and structural fixes to boost your citation probability in AI summaries.",
      icon: <RocketLaunchIcon className="w-6 h-6" />
    }
  ];

  return (
    <div className="min-h-screen bg-[#F9FAFF] dark:bg-slate-950 text-[#1A1A3A] dark:text-slate-100 font-sans selection:bg-indigo-100 transition-colors duration-300">
      
      {/* --- HERO SECTION --- */}
      <section className="relative pt-28 pb-32 px-6 overflow-hidden text-center">
        <div className="absolute top-0 -right-20 w-[500px] h-[500px] bg-indigo-200/30 dark:bg-indigo-500/10 blur-[120px] rounded-full -z-10 animate-pulse" />
        <div className="absolute bottom-0 -left-20 w-[500px] h-[500px] bg-purple-100/40 dark:bg-purple-500/10 blur-[120px] rounded-full -z-10" />

        <div className="max-w-7xl mx-auto space-y-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-indigo-100 dark:border-slate-800 rounded-full shadow-sm">
            <BeakerIcon className="w-4 h-4 text-indigo-500" />
            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">Enterprise Dual-Model GEO v3.0</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] dark:text-white">
            AI SEARCH IS <br />
            THE NEW <span className="text-indigo-600 dark:text-indigo-400 italic font-serif font-normal">SERP</span>
          </h1>

          <p className="max-w-3xl mx-auto text-slate-500 dark:text-slate-400 text-lg md:text-xl font-medium leading-relaxed">
            Ten blue links are a thing of the past. Our engine audits your site across the industry's leading <span className="text-[#1A1A3A] dark:text-slate-100 font-bold underline decoration-indigo-300">Intelligence Layers</span> to ensure your brand becomes the primary citation.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-6 pt-6">
            <button 
              onClick={() => navigate('/dashboard')}
              className="group px-10 py-5 bg-[#1A1A3A] dark:bg-indigo-600 text-white rounded-2xl font-bold shadow-2xl hover:bg-black dark:hover:bg-indigo-700 transition-all hover:-translate-y-1 flex items-center gap-3 active:scale-95"
            >
              Start Dual-Model Audit <ChevronRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* --- GLOBAL IMPACT STATS --- */}
      <section className="max-w-7xl mx-auto px-6 -mt-16 relative z-30">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {globalImpactStats.map((stat, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 border border-indigo-50 dark:border-slate-800 shadow-2xl shadow-indigo-100/40 dark:shadow-none flex flex-col items-center text-center space-y-4 hover:-translate-y-2 transition-all duration-300">
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl">{stat.icon}</div>
              <div>
                <p className="text-4xl font-black text-[#1A1A3A] dark:text-white tracking-tighter">{stat.value}</p>
                <p className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mt-2">{stat.label}</p>
              </div>
              <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">{stat.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- DUAL ENGINE HIGHLIGHT --- */}
      <section className="max-w-7xl mx-auto px-6 py-20 relative overflow-hidden">
        {/* Central Divider Decor */}
        <div className="hidden lg:block absolute left-1/2 top-1/4 bottom-1/4 w-[1px] bg-gradient-to-b from-transparent via-indigo-200 to-transparent dark:via-indigo-800 z-10" />

        <div className="text-center mb-4">
          <p className="text-4xl font-bold dark:text-white tracking-tight">Intelligence Benchmarked at Scale</p>
        </div>

        <div className="flex flex-col lg:flex-row items-stretch gap-12 lg:gap-0 relative">
          
          {/* Gemini Side: Gradient Surface */}
          <div className="flex-1 lg:pr-16 py-4 flex flex-col items-center lg:items-end text-center lg:text-right group">
            <div className="space-y-4 max-w-md">
              <div className="inline-flex p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-200 dark:shadow-none group-hover:scale-110 transition-transform">
                <SparklesIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-4xl font-black text-[#1A1A3A] dark:text-white">Gemini 2.5 Flash</h3>
              <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed">
                Google's state-of-the-art engine. Purpose-built for <span className="text-indigo-600 font-bold">deep semantic synthesis</span>.
              </p>
              <div className="flex items-center justify-center lg:justify-end gap-2 ">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500">Multimodal Optimized</span>
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              </div>
            </div>
          </div>

          {/* Llama Side: Glassmorphic Borderless */}
          <div className="flex-1 lg:pl-16 py-4 flex flex-col items-center lg:items-start text-center lg:text-left group">
            <div className="space-y-4 max-w-md">
              <div className="inline-flex p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm group-hover:scale-110 transition-transform">
                <CpuChipIcon className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-4xl font-black text-[#1A1A3A] dark:text-white">Llama 3.3 (Groq)</h3>
              <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed">
                The open-weights powerhouse. Leverages <span className="text-indigo-600 font-bold">Groq's LPU architecture</span> for ultra-low latency structural reasoning.
              </p>
              <div className="flex items-center justify-center lg:justify-start gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Real-time Inference</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* --- PIPELINE SECTION --- */}
      <section className="max-w-7xl mx-auto px-6 py-20 space-y-20">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold tracking-tight text-[#1A1A3A] dark:text-white">The GEO Optimization Pipeline</h2>
          <p className="text-slate-400 font-medium">Quantifying your readiness for the LLM-driven web.</p>
          <div className="w-20 h-1 bg-indigo-600 dark:bg-indigo-500 mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          <div className="hidden md:block absolute top-1/4 left-0 w-full h-0.5 border-t-2 border-dashed border-slate-200 dark:border-slate-800 -z-10" />
          
          {pipelineSteps.map((item, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm space-y-6 relative hover:border-indigo-200 dark:hover:border-indigo-500/50 transition-colors group">
              <div className="w-12 h-12 bg-[#1A1A3A] dark:bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg group-hover:bg-indigo-600 dark:group-hover:bg-indigo-500 transition-colors">
                {item.icon}
              </div>
              <div>
                <span className="text-[10px] font-black text-indigo-400 dark:text-indigo-300 uppercase tracking-widest">Stage {item.step}</span>
                <h3 className="text-xl font-bold text-[#1A1A3A] dark:text-white mt-1">{item.name}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-3 leading-relaxed font-medium">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- FEATURE HIGHLIGHTS --- */}
      <section className="bg-[#1A1A3A] dark:bg-slate-900 rounded-[4rem] mx-4 py-24 px-6 text-white overflow-hidden relative shadow-3xl border border-transparent dark:border-slate-800">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold leading-tight">
              Don't just rank. <br />
              <span className="text-indigo-400 italic font-serif">Be the Primary Citation.</span>
            </h2>
            <div className="space-y-6">
              {[
                { t: "Deep Content Anatomy", d: "Analysis of H1-H3 tagging and word depth benchmarks.", icon: <ChartPieIcon className="text-indigo-400" /> },
                { t: "Gap Detection Intelligence", d: "Find entities missing from your content that competitors are using.", icon: <CpuChipIcon className="text-purple-400" /> },
                { t: "Cross-Model Benchmarking", d: "See how Llama and Gemini interpret your site architecture differently.", icon: <GlobeAltIcon className="text-emerald-400" /> }
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="mt-1 w-6 h-6">{item.icon}</div>
                  <div>
                    <h4 className="font-bold text-lg text-white">{item.t}</h4>
                    <p className="text-indigo-200/60 text-sm font-medium">{item.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
             <div className="bg-white/5 border border-white/10 p-4 rounded-[2rem] backdrop-blur-3xl">
                <div className="flex items-center gap-2 mb-4 px-2">
                   <div className="w-3 h-3 rounded-full bg-rose-500" />
                   <div className="w-3 h-3 rounded-full bg-amber-500" />
                   <div className="w-3 h-3 rounded-full bg-emerald-500" />
                   <div className="ml-4 h-4 w-32 bg-white/10 rounded-full" />
                </div>
                <div className="space-y-4 p-4 font-mono text-xs text-indigo-100">
                   <div className="h-4 w-3/4 bg-white/5 rounded" />
                   <div className="h-4 w-full bg-indigo-500/20 rounded animate-pulse" />
                   <div className="h-4 w-2/3 bg-white/5 rounded" />
                   <div className="pt-4 border-t border-white/10">
                      <p className="text-emerald-400"># DUAL-MODEL CONSENSUS: 85%</p>
                      <p className="text-slate-500 mt-2">// Insight: Optimized for both Gemini & Llama crawlers</p>
                   </div>
                </div>
             </div>
             <div className="absolute -bottom-6 -right-6 bg-indigo-600 p-6 rounded-3xl shadow-2xl rotate-3 border border-indigo-400">
                <p className="text-[10px] font-black uppercase mb-1 tracking-tighter">Model Coverage</p>
                <p className="text-3xl font-black italic">Dual Hybrid</p>
             </div>
          </div>
        </div>
      </section>

      {/* --- FINAL CTA --- */}
      <section className="py-32 px-6 text-center">
        <div className="max-w-3xl mx-auto space-y-10">
          <h2 className="text-5xl font-bold tracking-tighter text-[#1A1A3A] dark:text-white">Future-proof your content for the AI Web.</h2>
          <button 
            onClick={() => navigate('/dashboard')}
            className="px-12 py-6 bg-indigo-600 text-white rounded-2xl font-black text-lg shadow-2xl shadow-indigo-100 dark:shadow-none hover:bg-indigo-700 transition-all hover:scale-105 active:scale-95 flex items-center gap-4 mx-auto"
          >
            Launch GEO Pipeline <RocketLaunchIcon className="w-6 h-6" />
          </button>
        </div>
      </section>
    </div>
  );
};

export default Landing;