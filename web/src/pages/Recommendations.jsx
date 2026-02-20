import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { 
  LightBulbIcon, ArrowPathIcon,
  SparklesIcon, ChatBubbleLeftRightIcon, BookOpenIcon, ArrowLeftIcon, CpuChipIcon,
  ArrowPathRoundedSquareIcon,
  CheckCircleIcon
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


const Recommendations = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { result } = location.state || {};
  const [isRetrying, setIsRetrying] = useState(false);

  if (!result) return <div className="p-20 text-center font-bold dark:bg-slate-950 dark:text-white">Session Expired.</div>;

  console.log("API Result Checklist Data:", result.checklist);

  const storageKey = result.url ? `geo-checklist-${btoa(result.url).substring(0, 12)}` : null;

  const getInitialChecklist = () => {
      let baseList = [];
      if (result.checklist && Array.isArray(result.checklist) && result.checklist.length > 0) {
          console.log("Using dynamic checklist from AI result.");
          baseList = result.checklist;
      } else {
          console.warn("AI checklist missing or empty. Using hardcoded fallback.");
          baseList = [
              { id: 1, task: "Ensure target keyword appears in H1 tag." },
              { id: 2, task: "Add structured data schema to page." },
              { id: 3, task: "Improve content depth and comprehensive coverage." },
              { id: 4, task: "Add clear, direct answers to potential user questions." },
              { id: 5, task: "Cite authoritative sources to improve credibility." }
          ];
      }

      let initializedList = baseList.map((item, index) => ({ 
          id: item.id || index + 1, 
          task: item.task, 
          done: false 
      }));

      if (storageKey) {
          const savedRaw = localStorage.getItem(storageKey);
          if (savedRaw) {
              try {
                  const savedList = JSON.parse(savedRaw);
                  console.log("Found saved checklist state in LocalStorage.");

                  initializedList = initializedList.map(newItem => {
                      const savedMatchingItem = savedList.find(savedItem => savedItem.task === newItem.task);
                      return savedMatchingItem ? { ...newItem, done: savedMatchingItem.done } : newItem;
                  });
              } catch (e) {
                  console.error("Could not parse saved checklist", e);
              }
          }
      }
      
      return initializedList;
  };

  const [checklist, setChecklist] = useState(getInitialChecklist);

  useEffect(() => {
      if (storageKey && checklist) {
          localStorage.setItem(storageKey, JSON.stringify(checklist));
      }
  }, [checklist, storageKey]);

  const toggleChecklistItem = (id) => {
    setChecklist(prevList => 
      prevList.map(item => 
        item.id === id ? { ...item, done: !item.done } : item
      )
    );
  };


  const currentModel = result.modelUsed;
  const isCurrentlyLlama = currentModel === 'llama-3.3-70b-versatile' || currentModel === 'llama';
  const alternativeModel = isCurrentlyLlama ? 'gemini-1.5-flash' : 'llama'; 
  const alternativeLabel = isCurrentlyLlama ? 'Gemini 1.5 Flash' : 'Llama 3.3 (Groq)';

  const aiRecommendations = result?.recommendations || [];
   const extraRecommendations = [
    { 
      title: "Direct Answer Box", 
      detail: `Based on your score of ${result.geoScore}%, we recommend adding a 2-3 sentence 'Direct Answer' block immediately under your main heading.`, 
      impact: "High", 
      icon: <ChatBubbleLeftRightIcon className="w-6 h-6" /> 
    },
    { 
      title: "Entity-First Schema", 
      detail: "Integrate JSON-LD schema specifically defining the concepts found in your content anatomy.", 
      impact: "Medium", 
      icon: <BookOpenIcon className="w-6 h-6" /> 
    }
  ];
  const allRecommendations = [...aiRecommendations, ...extraRecommendations];


  const handleTryAlternative = async () => {
    setIsRetrying(true);
    const loadToast = toast.loading(`Initiating ${alternativeLabel} Engine...`);

    try {
      const prompt = `
        Task: You are a Dual-Mode GEO Analysis Engine.
        Input Site Content (for Audit): Provided via context.
        User Question (for independent answer): "${result.question}"

        Return a strict JSON object:
        {
          "geoScore": number (0-100),
          "competitorScore": ${result.competitorUrl ? 'number (0-100)' : 'null'},
          "comparison": [
            { "feature": "string", "yourStatus": "Strong/Weak/Missing", "compStatus": "Strong/Weak/Missing", "winner": "you/competitor/tie" }
          ],
          "gaps": [{"topic": "string", "status": "Missing", "impact": "High/Medium/Low"}],
          // UPDATED: Added checklist request for re-runs
          "checklist": [
            {"task": "Specific actionable task 1 based on content analysis", "id": 1},
            {"task": "Specific actionable task 2 based on content analysis", "id": 2},
            {"task": "Specific actionable task 3 based on content analysis", "id": 3},
            {"task": "Specific actionable task 4 based on content analysis", "id": 4},
            {"task": "Specific actionable task 5 based on content analysis", "id": 5}
          ],
          "aiBaseline": { 
            "answer": "Independent answer with citations [1], [2], [3].", 
            "format": "Summary",
            "entities": ["Concept 1"],
            "sources": [
              { "id": "[1]", "name": "Source Name", "url": "https://url.com" }
            ]
          },
          "recommendations": [{"title": "string", "detail": "string", "impact": "High/Medium/Low"}]
        }
        Output MUST be valid JSON.
      `;

      let parsedData;

      if (alternativeModel.includes('gemini')) {
        const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const res = await model.generateContent(prompt);
        parsedData = JSON.parse(res.response.text().replace(/```json|```/g, "").trim());
      } else {
        const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json', 
            'Authorization': `Bearer ${import.meta.env.VITE_GROQ_API_KEY}` 
          },
          body: JSON.stringify({ 
            model: "llama-3.3-70b-versatile",
            messages: [
              { role: "system", content: "You are a GEO analysis expert. Respond only in JSON." },
              { role: "user", content: prompt }
            ],
            response_format: { type: "json_object" }
          })
        });
        const data = await res.json();
        parsedData = JSON.parse(data.choices[0].message.content);
      }

      toast.success(`${alternativeLabel} Synthesis Ready!`, { id: loadToast });

      navigate('/synthesis', { 
        state: { 
          result: { 
            ...parsedData, 
            url: result.url, 
            competitorUrl: result.competitorUrl, 
            question: result.question, 
            structuralAudit: result.structuralAudit, 
            compStructuralAudit: result.compStructuralAudit,
            modelUsed: alternativeModel 
          } 
        } 
      });

    } catch (error) {
      toast.error("Retry Failed: " + error.message, { id: loadToast });
    } finally {
      setIsRetrying(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFF] dark:bg-slate-950 text-[#1A1A3A] dark:text-slate-100 p-6 md:p-10 font-sans transition-colors duration-300">
      <Toaster position="top-center" />
      <div className="max-w-5xl mx-auto space-y-4">

        <StepIndicator currentStep={3} />

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="space-y-3">
            <button onClick={() => navigate(-1)} className="group flex items-center gap-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 font-bold text-xs uppercase tracking-wider transition-colors">
              <ArrowLeftIcon className="w-4 h-4 stroke-[3px] group-hover:-translate-x-1 transition-transform" />
              Back to Analysis
            </button>
            <h1 className="text-4xl font-black tracking-tight dark:text-white text-indigo-600">
              Optimization <span className="text-indigo-600 dark:text-indigo-400 font-serif italic font-normal">Strategy</span>
            </h1>
          </div>

          <div className="flex items-center gap-2 px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full border border-indigo-100 dark:border-indigo-800 self-start md:self-end">
              <CpuChipIcon className="w-3.5 h-3.5" />
              <span className="text-[10px] font-black uppercase tracking-tighter">Strategized by {result.modelUsed || 'AI Engine'}</span>
          </div>
        </div>

        {/* Interactive Checklist Block */}
        <div className="bg-[#1A1A3A] dark:bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl border border-indigo-900 dark:border-slate-800 transition-colors">
          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500/20 rounded-xl">
                 <SparklesIcon className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-emerald-400">Interactive GEO Checklist</h3>
            </div>
            
            <div className="bg-black/30 dark:bg-slate-950/50 backdrop-blur-md rounded-2xl border border-white/10 p-6 font-medium text-sm leading-relaxed text-indigo-100 shadow-inner">
              <p className="text-slate-400 text-xs mb-4">Click items to mark them as complete. Progress is saved locally for this URL.</p>
              <ul className="space-y-3">
                {checklist.map((item) => (
                  <li 
                    key={item.id} 
                    onClick={() => toggleChecklistItem(item.id)}
                    className="flex items-start gap-3 p-3 bg-white/5 rounded-xl transition-all cursor-pointer hover:bg-white/10 active:scale-[0.99] group select-none"
                  >
                    {item.done ? (
                      <CheckCircleIcon className="w-6 h-6 text-emerald-400 shrink-0 transition-transform group-hover:scale-110" />
                    ) : (
                      <div className="w-6 h-6 rounded-full border-2 border-slate-500 shrink-0 transition-colors group-hover:border-indigo-400" />
                    )}
                    
                    <span className={`transition-all ${item.done ? 'text-slate-400 line-through decoration-emerald-500/50' : 'text-white'}`}>
                      {item.task}
                    </span>
                  </li>
                ))}
              </ul>
              {checklist.length > 0 && checklist.every(i => i.done) && (
                 <p className="text-center text-emerald-400 text-xs font-bold mt-6 animate-pulse">
                    🎉 All items complete! You are ready for re-analysis.
                 </p>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {allRecommendations.map((rec, index) => (
            <div key={index} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] p-8 shadow-sm group hover:shadow-md transition-all hover:border-indigo-100 dark:hover:border-indigo-900">
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all text-indigo-500 dark:text-indigo-400 shadow-sm">
                  {rec.icon || <LightBulbIcon className="w-6 h-6 stroke-[2px]" />}
                </div>
                <span className={`text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-wider ${rec.impact === 'High' ? 'bg-orange-50 dark:bg-orange-950/30 text-orange-600' : rec.impact === 'Medium' ? 'bg-amber-50 dark:bg-amber-950/30 text-amber-600' : 'bg-blue-50 dark:bg-blue-950/30 text-blue-600'}`}>
                  {rec.impact} Impact
                </span>
              </div>
              <h3 className="font-black text-lg mb-3 text-[#1A1A3A] dark:text-white">{rec.title}</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-medium">{rec.detail}</p>
            </div>
          ))}
        </div>

        {/* FOOTER ACTION BUTTONS */}
        <div className="bg-white dark:bg-slate-900 border border-indigo-50 dark:border-slate-800 rounded-[2.5rem] p-12 text-center space-y-8 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-indigo-50/30 dark:bg-indigo-900/10 blur-[100px] -z-10" />
            <div>
               <h2 className="text-3xl font-black text-[#1A1A3A] dark:text-white mb-2">Audit Complete.</h2>
               <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto text-sm font-medium">Cross-reference this data or reset to start a fresh analysis.</p>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                <button 
                  onClick={() => navigate('/')}
                  className="group px-10 py-5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-[1.5rem] font-bold transition-all hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center gap-3 active:scale-[0.98] w-full md:w-auto"
                >
                  <ArrowPathIcon className="w-5 h-5 stroke-[2.5px] group-hover:rotate-180 transition-transform duration-500" />
                  Start New Analysis
                </button>

                <button 
                  onClick={handleTryAlternative}
                  disabled={isRetrying}
                  className="group px-10 py-5 bg-[#1A1A3A] dark:bg-indigo-600 text-white rounded-[1.5rem] font-bold shadow-xl hover:bg-black dark:hover:bg-indigo-700 transition-all flex items-center gap-3 active:scale-[0.98] w-full md:w-auto disabled:opacity-50"
                >
                  <ArrowPathRoundedSquareIcon className={`w-5 h-5 ${isRetrying ? 'animate-spin' : ''}`} />
                  {isRetrying ? 'Switching Engines...' : `Try same with ${alternativeLabel}`}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Recommendations;