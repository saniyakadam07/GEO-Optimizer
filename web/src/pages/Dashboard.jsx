import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { 
  GlobeAltIcon, ChatBubbleLeftRightIcon, 
  ArrowRightIcon, ChartBarIcon, CpuChipIcon
} from '@heroicons/react/24/outline';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { db } from '../firebase'; 
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const Dashboard = ({ user }) => {
  const navigate = useNavigate();

  const [urls, setUrls] = useState(['']);
  const [competitors, setCompetitors] = useState(['']);
  const [questions, setQuestions] = useState(['']);
  const [selectedModel, setSelectedModel] = useState('gemini-2.5-flash'); 
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (index, value, setter) => {
    setter((prev) => {
      const newArr = [...prev];
      newArr[index] = value;
      return newArr;
    });
  };

  const extractSignals = (markdown) => {
    if (!markdown) return null;
    const lines = markdown.split('\n');
    const wordCount = markdown.split(/\s+/).filter(Boolean).length;
    
    const h1 = lines.filter(line => line.startsWith('# ')).length;
    const h2 = lines.filter(line => line.startsWith('## ')).length;
    const h3 = lines.filter(line => line.startsWith('### ')).length;

    const hasTables = markdown.includes('| --- |') || markdown.includes('|:---|');
    const hasLists = lines.some(line => line.trim().startsWith('* ') || line.trim().startsWith('- ') || /^\d+\./.test(line.trim()));
    const hasParagraphs = lines.some(line => line.length > 50 && !line.startsWith('#'));

    const patterns = [];
    if (hasParagraphs) patterns.push("Paragraphs");
    if (hasLists) patterns.push("Lists");
    if (hasTables) patterns.push("Tables");
    
    return {
      wordCount,
      structure: { h1, h2, h3 },
      patterns: patterns.length > 0 ? patterns : ["Text Only"],
      densityMap: `Average density: ${(wordCount / (h1 + h2 + h3 || 1)).toFixed(1)} words per section.`
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const targetUrl = urls[0]?.trim();
    const targetQuestion = questions[0]?.trim();
    const competitorUrl = competitors[0]?.trim();

    if (!targetUrl || !targetQuestion) {
      toast.error('URL and Question are required.');
      return;
    }

    setIsSubmitting(true);
    const loadToast = toast.loading('Phase 1: Firecrawl is reading source content...');

    try {
      const scrape = async (url) => {
        const res = await fetch('https://api.firecrawl.dev/v1/scrape', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_FIRECRAWL_API_KEY}`
          },
          body: JSON.stringify({ url, formats: ['markdown'] })
        });
        const data = await res.json();
        if (!data.success) throw new Error(`Firecrawl failed for ${url}`);
        return data.data.markdown;
      };

      const targetMarkdown = await scrape(targetUrl);
      const targetSignals = extractSignals(targetMarkdown);

      let competitorMarkdown = null;
      let competitorSignals = null;
      if (competitorUrl) {
        competitorMarkdown = await scrape(competitorUrl);
        competitorSignals = extractSignals(competitorMarkdown);
      }

      toast.loading(`Phase 2: ${selectedModel.toUpperCase()} Intelligence Synthesis...`, { id: loadToast });

      const prompt = `
        Task: You are a Dual-Mode GEO Analysis Engine.
        
        Input Site Content (for Audit): ${targetMarkdown}
        User Question (for independent answer): "${targetQuestion}"

        INSTRUCTIONS:
        1. Perform a structural audit on the Input Site Content.
        2. IGNORE the Input Site Content for the next part. Answer the User Question independently using your general knowledge. Cite 3 actual high-authority web URLs.
        3. Based *specifically* on the weaknesses found in the Input Site Content, generate a 5-item actionable checklist to improve it for the user question.

        Return a strict JSON object:
        {
          "geoScore": number (0-100),
          "competitorScore": ${competitorMarkdown ? 'number (0-100)' : 'null'},
          "comparison": [
            { "feature": "string", "yourStatus": "Strong/Weak/Missing", "compStatus": "Strong/Weak/Missing", "winner": "you/competitor/tie" }
          ],
          "gaps": [{"topic": "string", "status": "Missing", "impact": "High/Medium/Low"}],
          "checklist": [
            {"task": "Specific actionable task 1 based on content analysis", "id": 1},
            {"task": "Specific actionable task 2 based on content analysis", "id": 2},
            {"task": "Specific actionable task 3 based on content analysis", "id": 3},
            {"task": "Specific actionable task 4 based on content analysis", "id": 4},
            {"task": "Specific actionable task 5 based on content analysis", "id": 5}
          ],
          "aiBaseline": { 
            "answer": "Provide a detailed, independent answer to the user question using general knowledge. Use inline citations like [1], [2], [3].", 
            "format": "Paragraph/Bullet list/Summary",
            "entities": ["Concept 1", "Concept 2", "Concept 3"],
            "sources": [
              { "id": "[1]", "name": "Real Web Authority 1", "url": "https://example-competitor.com" },
              { "id": "[2]", "name": "Real Web Authority 2", "url": "https://another-authority.com" },
              { "id": "[3]", "name": "Real Web Authority 3", "url": "https://third-source.com" }
            ]
          },
          "recommendations": [{"title": "string", "detail": "string", "impact": "High/Medium/Low"}]
        }
      `;

      let parsedData;

      if (selectedModel.includes('gemini')) {
        const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: selectedModel });
        const result = await model.generateContent(prompt);
        const cleanJson = result.response.text().replace(/```json|```/g, "").trim();
        parsedData = JSON.parse(cleanJson);
      } 
      else if (selectedModel.includes('llama')) {
        const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json', 
            'Authorization': `Bearer ${import.meta.env.VITE_GROQ_API_KEY}` 
          },
          body: JSON.stringify({ 
            model: "llama-3.3-70b-versatile",
            messages: [
              { role: "system", content: "You are a GEO analysis expert. You must respond in valid JSON format including all requested fields." },
              { role: "user", content: prompt }
            ],
            response_format: { type: "json_object" },
            temperature: 0.1 
          })
        });
        
        const data = await res.json();
        if (data.error) throw new Error(`Groq Error: ${data.error.message}`);
        parsedData = JSON.parse(data.choices[0].message.content);
      }

      if (user && parsedData) { 
        try {
          await addDoc(collection(db, "userHistory"), {
            userId: user.uid,
            targetUrl,
            question: targetQuestion,
            geoScore: parsedData.geoScore || 0, 
            modelUsed: selectedModel,
            timestamp: serverTimestamp(),
            fullReport: {
              ...parsedData,
              structuralAudit: targetSignals,
              compStructuralAudit: competitorSignals,
              competitorUrl: competitorUrl || null
            }
          });
        } catch (dbError) {
          console.error("Firebase Save Error:", dbError);
        }
      }

      toast.success('Synthesis Complete!', { id: loadToast });
      
      navigate('/synthesis', { 
        state: { 
          result: { 
            ...parsedData, 
            url: targetUrl, 
            competitorUrl, 
            question: targetQuestion, 
            structuralAudit: targetSignals, 
            compStructuralAudit: competitorSignals, 
            modelUsed: selectedModel 
          } 
        } 
      });

    } catch (error) {
      console.error("Pipeline Error:", error);
      toast.error("Error: " + error.message, { id: loadToast });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFF] dark:bg-slate-950 text-[#1A1A3A] dark:text-slate-100 p-6 md:p-10 relative overflow-hidden transition-colors duration-500">
      <Toaster position="top-center" />
      
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-5%] w-[45%] h-[50%] bg-indigo-100/40 dark:bg-indigo-900/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[10%] right-[-5%] w-[35%] h-[45%] bg-purple-100/30 dark:bg-purple-900/10 blur-[100px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto space-y-6">
        <div className="text-center space-y-2 pt-4 mb-8">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[#1A1A3A] dark:text-white leading-tight">
            What will you <span className="text-indigo-600 dark:text-indigo-400 font-serif italic font-normal">optimize</span> today?
          </h1>
          <p className="text-slate-400 dark:text-slate-500 max-w-xl mx-auto text-sm md:text-base font-medium">
            Benchmark your content visibility against AI search algorithms.
          </p>
        </div>

        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-3xl border border-white dark:border-slate-800 rounded-[2.5rem] shadow-[0_20px_50px_rgba(79,70,229,0.05)] p-8 transition-all">
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
              <div className="space-y-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-2">
                    <GlobeAltIcon className="w-5 h-5 text-indigo-600" />
                    <h3 className="font-bold text-[#1A1A3A] dark:text-white">Target URL</h3>
                  </div>
                  <input
                    type="url"
                    placeholder="https://your-site.com/landing-page"
                    value={urls[0]}
                    onChange={(e) => updateField(0, e.target.value, setUrls)}
                    className="w-full bg-[#F5F7FF] dark:bg-slate-800/50 border border-indigo-100 dark:border-slate-700 rounded-2xl px-6 py-4 outline-none focus:bg-white dark:focus:bg-slate-800 focus:ring-8 focus:ring-indigo-500/5 transition-all text-sm dark:text-white shadow-sm"
                    required
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-2">
                    <ChartBarIcon className="w-5 h-5 text-amber-500" />
                    <h3 className="font-bold text-[#1A1A3A] dark:text-white">Competitor (Optional)</h3>
                  </div>
                  <input
                    type="url"
                    value={competitors[0]}
                    onChange={(e) => updateField(0, e.target.value, setCompetitors)}
                    placeholder="https://competitor.com/ranking-page"
                    className="w-full bg-[#F5F7FF] dark:bg-slate-800/50 border border-indigo-100 dark:border-slate-700 rounded-2xl px-6 py-4 outline-none focus:bg-white dark:focus:bg-slate-800 focus:ring-8 focus:ring-indigo-500/5 transition-all text-sm dark:text-white shadow-sm"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-2">
                    <CpuChipIcon className="w-5 h-5 text-purple-600" />
                    <h3 className="font-bold text-[#1A1A3A] dark:text-white">Intelligence Engine</h3>
                  </div>
                  <div className="relative">
                    <select 
                      value={selectedModel}
                      onChange={(e) => setSelectedModel(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-indigo-100 dark:border-slate-700 rounded-2xl px-6 py-4 pr-12 outline-none focus:ring-8 focus:ring-indigo-500/5 transition-all font-semibold text-gray-700 dark:text-white cursor-pointer shadow-sm appearance-none"
                    >
                      <option value="gemini-2.5-flash">Gemini 2.5 Flash</option>
                      <option value="llama-3.3-70b-versatile">Llama 3.3 (Groq)</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-5 text-gray-400 dark:text-slate-500">
                      <svg className="h-6 w-6 fill-current" viewBox="0 0 20 20">
                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-2">
                  <ChatBubbleLeftRightIcon className="w-5 h-5 text-indigo-600" />
                  <h3 className="font-bold text-[#1A1A3A] dark:text-white">Analysis Intent</h3>
                </div>
                <div className="space-y-2">
                  <p className="text-[13px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-bold px-1">What question should the AI answer?</p>
                  <textarea
                    rows="10"
                    placeholder="Example: How does my software's enterprise security features compare to the top 3 competitors?"
                    value={questions[0]}
                    onChange={(e) => updateField(0, e.target.value, setQuestions)}
                    className="w-full bg-[#F5F7FF] dark:bg-slate-800/50 border border-indigo-100 dark:border-slate-700 rounded-[2rem] px-8 py-7 outline-none focus:bg-white dark:focus:bg-slate-800 focus:ring-8 focus:ring-indigo-500/5 transition-all text-sm leading-relaxed resize-none dark:text-white shadow-inner"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative w-full md:w-auto px-16 py-5 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white rounded-2xl font-bold shadow-2xl shadow-indigo-200 dark:shadow-none hover:shadow-indigo-400 transition-all hover:-translate-y-1 active:translate-y-0 disabled:opacity-50"
              >
                <div className="flex items-center justify-center gap-3">
                  <span className="text-lg">
                    {isSubmitting ? 'Engaging Engine...' : 'Run Synthesis'}
                  </span>
                  {!isSubmitting && (
                    <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  )}
                </div>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;