import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { 
  ChatBubbleLeftRightIcon, XMarkIcon, PaperAirplaneIcon, SparklesIcon, UserIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const GeneralChatbot = ({ user }) => {
  if (!user) return null;

  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const [messages, setMessages] = useState([
    { role: 'ai', content: `Hello ${user.displayName || 'there'}! I'm your AI assistant. How can I help you today?` }
  ]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
  
    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

      const historyMessagesForApi = messages.slice(1, messages.length);

      const historyForApi = historyMessagesForApi.map(msg => ({
        role: msg.role === 'ai' ? 'model' : 'user',
        parts: [{ text: msg.content }],
      }));

      const chat = model.startChat({
        history: historyForApi, 
        generationConfig: { maxOutputTokens: 500 },
      });

      const result = await chat.sendMessage(input);
      const response = await result.response;
      const text = response.text();

      setMessages(prev => [...prev, { role: 'ai', content: text }]);

    } catch (error) {
      console.error("Chatbot Error:", error);
      const errorMessage = error.message?.includes('429') 
        ? "I'm getting too many requests right now. Please try again in a moment." 
        : "Sorry, I encountered an issue connecting to the AI service.";
        
      toast.error("AI Service Error");
      setMessages(prev => [...prev, { role: 'ai', content: errorMessage }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] font-sans antialiased">
      {isOpen && (
        <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl border border-indigo-50/50 dark:border-slate-800 flex flex-col mb-4 overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300 transition-colors w-[calc(100vw-3rem)] sm:w-[400px] h-[calc(100vh-7rem)] max-h-[600px]">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 flex items-center justify-between text-white rounded-t-[2rem]">
            <div className="flex items-center gap-3">
              <div className="p-1.5 bg-white/20 rounded-lg"><SparklesIcon className="w-5 h-5 text-white" /></div>
              <div><h3 className="font-bold text-sm leading-tight">AI Assistant</h3><p className="text-[10px] text-indigo-100 opacity-80">Powered by Gemini</p></div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-100 hover:text-white transition-colors bg-white/10 p-2 rounded-full hover:bg-white/20"><XMarkIcon className="w-5 h-5" /></button>
          </div>

          <div className="flex-1 p-5 overflow-y-auto bg-[#F9FAFF] dark:bg-slate-950 space-y-6 transition-colors scrollbar-thin scrollbar-thumb-indigo-100 dark:scrollbar-thumb-slate-800">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'ai' && (
                   <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center shrink-0 self-start shadow-sm mt-1"><SparklesIcon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /></div>
                )}
                <div className={`p-4 rounded-2xl text-sm max-w-[85%] leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-br-sm' : 'bg-white dark:bg-slate-900 border border-indigo-50 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-bl-sm'}`}>
                  {msg.content.split('**').map((part, index) => index % 2 === 1 ? <strong key={index}>{part}</strong> : part)}
                </div>
                 {msg.role === 'user' && (
                   <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-700 flex items-center justify-center shrink-0 self-start shadow-sm mt-1"><UserIcon className="w-4 h-4 text-slate-500 dark:text-slate-300" /></div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3 justify-start">
                 <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center shrink-0 self-end shadow-sm animate-pulse"><SparklesIcon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /></div>
                  <div className="p-4 bg-white dark:bg-slate-900 border border-indigo-50 dark:border-slate-800 rounded-2xl rounded-bl-sm shadow-sm text-sm text-slate-400 flex items-center gap-1">Thinking<span className="animate-bounce">.</span><span className="animate-bounce delay-100">.</span><span className="animate-bounce delay-200">.</span></div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSend} className="p-4 bg-white dark:bg-slate-900 border-t border-indigo-50 dark:border-slate-800 flex items-center gap-3 transition-colors rounded-b-[2rem]">
            <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type your message..." disabled={isLoading} className="flex-1 bg-slate-100 dark:bg-slate-800 border-transparent rounded-xl px-4 py-3 outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-300 dark:focus:border-indigo-700 focus:ring-4 focus:ring-indigo-500/10 text-sm transition-all dark:text-white placeholder:text-slate-400" />
            <button type="submit" disabled={isLoading || !input.trim()} className="p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-200 dark:shadow-none active:scale-95 bg-gradient-to-r from-indigo-600 to-purple-600"><PaperAirplaneIcon className="w-5 h-5 -rotate-45 translate-x-[2px] -translate-y-[1px]" /></button>
          </form>
        </div>
      )}
      <button onClick={() => setIsOpen(!isOpen)} className="group p-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full shadow-2xl shadow-indigo-900/30 transition-all hover:scale-105 active:scale-95 flex items-center justify-center relative overflow-hidden">
         <div className={`absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-md`}></div>
         <ChatBubbleLeftRightIcon className={`w-7 h-7 transition-transform duration-300 ${isOpen ? 'rotate-90 opacity-0 absolute' : 'rotate-0 opacity-100'}`} />
         <XMarkIcon className={`w-7 h-7 transition-transform duration-300 ${isOpen ? 'rotate-0 opacity-100' : '-rotate-90 opacity-0 absolute'}`} />
      </button>
    </div>
  );
};

export default GeneralChatbot;