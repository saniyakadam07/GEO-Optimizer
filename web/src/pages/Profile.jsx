import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  getDocs, 
  limit, 
  doc, 
  deleteDoc, 
  writeBatch 
} from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { 
  ClockIcon, 
  GlobeAltIcon, 
  ChatBubbleLeftEllipsisIcon,
  ChevronRightIcon,
  ShieldCheckIcon,
  TrashIcon,
  ArrowPathIcon,
  CpuChipIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const Profile = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = auth.currentUser;

  const fetchHistory = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const q = query(
        collection(db, "userHistory"),
        where("userId", "==", user.uid),
        orderBy("timestamp", "desc"),
        limit(20)
      );
      const querySnapshot = await getDocs(q);
      const docs = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setHistory(docs);
    } catch (error) {
      console.error("Error fetching history:", error);
      if (error.code === 'failed-precondition') {
        toast.error("Database index is still building...");
      } else {
        toast.error("Failed to load history.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [user]);

  // --- RECONSTRUCTED NAVIGATION LOGIC ---
  const handleViewReport = (log) => {
    toast.success("Synchronizing intelligence data...", { position: 'top-center' });
    
    // This reconstructed object ensures Synthesis.jsx receives all saved data
    const reconstructedResult = log.fullReport ? {
      ...log.fullReport,
      url: log.targetUrl, // Mapping back to key names expected by Synthesis
      question: log.question,
      modelUsed: log.modelUsed,
      geoScore: log.geoScore
    } : log;

    navigate('/synthesis', { state: { result: reconstructedResult } });
  };

  // --- TOAST CONFIRMATION FOR DELETION ---
  const confirmDeleteLog = (id) => {
    toast((t) => (
      <div className="flex flex-col gap-4 p-1 min-w-[280px]">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />
          </div>
          <span className="font-bold text-slate-800 dark:text-slate-100 text-sm">Delete intelligence log?</span>
        </div>
        <div className="flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800 pt-3">
          <button 
            onClick={() => toast.dismiss(t.id)}
            className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-all"
          >
            Cancel
          </button>
          <button 
            onClick={() => {
              toast.dismiss(t.id);
              executeDeleteLog(id);
            }}
            className="px-4 py-2 text-xs font-black bg-red-500 text-white rounded-xl shadow-lg hover:bg-red-600 transition-all"
          >
            Delete
          </button>
        </div>
      </div>
    ), { 
        duration: 5000, 
        position: 'top-center',
        style: { borderRadius: '20px', background: '#fff', padding: '12px' } 
    });
  };

  const executeDeleteLog = async (id) => {
    const deleteToast = toast.loading("Purging from cloud storage...", { position: 'top-center' });
    try {
      await deleteDoc(doc(db, "userHistory", id));
      setHistory(prev => prev.filter(item => item.id !== id));
      toast.success("Log permanently deleted", { id: deleteToast });
    } catch (error) {
      toast.error("Failed to delete log", { id: deleteToast });
    }
  };

  // --- TOAST CONFIRMATION FOR CLEAR ALL ---
  const confirmClearAll = () => {
    if (history.length === 0) return;
    toast((t) => (
      <div className="flex flex-col gap-4 p-1 min-w-[320px]">
        <div className="space-y-1 text-center">
          <h4 className="font-black text-red-600 uppercase tracking-tighter text-base">Wipe Entire History?</h4>
          <p className="text-xs text-slate-500 font-medium">This will permanently delete all analysis reports.</p>
        </div>
        <div className="flex items-center gap-2 pt-2 border-t border-slate-50">
          <button onClick={() => toast.dismiss(t.id)} className="flex-1 py-2.5 text-xs font-bold text-slate-400">Keep Logs</button>
          <button 
            onClick={() => { toast.dismiss(t.id); executeClearAll(); }}
            className="flex-1 py-2.5 text-xs font-black bg-red-600 text-white rounded-xl shadow-lg"
          >
            Confirm Wipe
          </button>
        </div>
      </div>
    ), { duration: 6000, position: 'top-center' });
  };

  const executeClearAll = async () => {
    const clearToast = toast.loading("Clearing database...", { position: 'top-center' });
    const batch = writeBatch(db);
    history.forEach((log) => batch.delete(doc(db, "userHistory", log.id)));
    try {
      await batch.commit();
      setHistory([]);
      toast.success("History cleared successfully", { id: clearToast });
    } catch (error) {
      toast.error("Batch deletion failed", { id: clearToast });
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFF] dark:bg-slate-950 text-[#1A1A3A] dark:text-slate-100 p-6 md:p-10 transition-colors duration-300 font-sans">
      <Toaster position="top-center" reverseOrder={false} />
      
      <div className="max-w-5xl mx-auto space-y-10">
        
        {/* --- USER PROFILE HEADER --- */}
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="h-24 w-24 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 p-1 shadow-lg">
              <div className="h-full w-full rounded-full bg-white dark:bg-slate-900 flex items-center justify-center overflow-hidden">
                {user?.photoURL ? (
                  <img src={user.photoURL} alt="User" className="h-full w-full object-cover" />
                ) : (
                  <span className="text-3xl font-black text-indigo-600">{user?.email?.[0].toUpperCase()}</span>
                )}
              </div>
            </div>
            <div className="text-center md:text-left space-y-1">
              <h1 className="text-2xl font-black tracking-tight">{user?.displayName || "GEO Researcher"}</h1>
              <p className="text-slate-400 font-medium text-sm">{user?.email}</p>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-full text-[10px] font-black uppercase tracking-widest mt-2">
                <ShieldCheckIcon className="w-3 h-3" /> Professional Access
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center md:items-end gap-2 px-8 py-4 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800">
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Reports Generated</p>
             <p className="text-4xl font-black text-indigo-600 dark:text-indigo-400">{history.length}</p>
          </div>
        </div>

        {/* --- HISTORY LIST SECTION --- */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-600 rounded-lg text-white shadow-lg">
                <ClockIcon className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold uppercase tracking-tight">Intelligence Logs</h2>
            </div>
            
            {history.length > 0 && (
              <button onClick={confirmClearAll} className="text-[10px] font-black text-red-400 hover:text-red-600 uppercase tracking-widest transition-colors flex items-center gap-2 bg-red-50 dark:bg-red-900/10 px-4 py-2 rounded-full">
                <TrashIcon className="w-4 h-4" /> Clear All History
              </button>
            )}
          </div>

          {loading ? (
            <div className="grid gap-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-32 w-full bg-white dark:bg-slate-900 animate-pulse rounded-[2rem] border border-slate-100 dark:border-slate-800" />
              ))}
            </div>
          ) : history.length > 0 ? (
            <div className="grid gap-4">
              {history.map((log) => (
                <div key={log.id} className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-500/50 transition-all group flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-3 overflow-hidden">
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                        <GlobeAltIcon className="w-4 h-4 shrink-0" />
                        <p className="text-xs font-bold truncate max-w-[200px] md:max-w-md uppercase tracking-tight">{log.targetUrl}</p>
                      </div>
                      <span className="flex items-center gap-1 px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-[9px] font-black uppercase text-slate-500 rounded-md">
                        <CpuChipIcon className="w-3 h-3" /> {log.modelUsed || 'Gemini'}
                      </span>
                    </div>
                    
                    <div className="flex items-start gap-2 text-slate-600 dark:text-slate-300">
                      <ChatBubbleLeftEllipsisIcon className="w-4 h-4 shrink-0 mt-1" />
                      <p className="text-sm font-medium italic line-clamp-2">"{log.question}"</p>
                    </div>
                    <p className="text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase">
                      Logged: {log.timestamp?.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-4 md:pt-0 border-slate-50 dark:border-slate-800">
                    <div className="text-right">
                      <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">GEO Score</p>
                      <p className="text-3xl font-black text-indigo-600 dark:text-indigo-400">{log.geoScore}%</p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                       <button onClick={() => confirmDeleteLog(log.id)} className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all" title="Delete Log">
                         <TrashIcon className="w-5 h-5" />
                       </button>
                       <button 
                         onClick={() => handleViewReport(log)}
                         className="flex items-center gap-2 px-6 py-3 bg-slate-900 dark:bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-600 dark:hover:bg-indigo-700 transition-all shadow-lg active:scale-95"
                       >
                         View Report <ChevronRightIcon className="w-4 h-4" />
                       </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-white dark:bg-slate-900 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center space-y-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-full">
                <ArrowPathIcon className="w-8 h-8 text-slate-300 animate-pulse" />
              </div>
              <div className="space-y-1">
                <p className="text-slate-500 dark:text-slate-400 font-bold text-lg">No analysis history found.</p>
                <p className="text-slate-400 dark:text-slate-500 text-sm">Run your first GEO synthesis to populate your activity logs.</p>
              </div>
              <button onClick={() => navigate('/dashboard')} className="mt-4 px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg hover:bg-indigo-700 transition-all">Go to Dashboard</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;