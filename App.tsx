
import React, { useState, useCallback, useEffect } from 'react';
import InputSection from './components/InputSection';
import Dashboard from './components/Dashboard';
import LoadingScreen from './components/LoadingScreen';
import AuthModal from './components/AuthModal';
import HistoryModal from './components/HistoryModal';
import MyPageModal from './components/MyPageModal';
import HeroShowcase from './components/HeroShowcase'; 
import CaseStudySlider from './components/CaseStudySlider'; 
import { AnalysisInput, AnalysisResult, LoadingStage, RecommendationInput, RecommendationResult, HistoryItem } from './types';
import { analyzeLocation, recommendLocations } from './services/geminiService';
import { BUSINESS_BACKGROUNDS } from './constants';
import { 
  ChartBar, Buildings, Target, Storefront, User, UserPlus, ClockCounterClockwise, CaretDown, CheckCircle, MapPin, ChartLineUp, Coin, Smiley, Question, Users, DeviceMobile, DownloadSimple, ShareNetwork
} from 'phosphor-react';

// --- Sub-Components ---

const StatCard: React.FC<{ label: string; value: string; icon: React.ReactNode }> = ({ label, value, icon }) => (
  <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/70 dark:bg-slate-800/70 backdrop-blur-md border border-slate-200/60 dark:border-slate-700 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group w-full md:w-auto justify-center md:justify-start">
    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <div className="text-left">
      <div className="text-xl font-extrabold text-slate-800 dark:text-white leading-none mb-1">{value}</div>
      <div className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">{label}</div>
    </div>
  </div>
);

const FAQItem: React.FC<{ question: string; answer: string }> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm transition-all hover:border-blue-300 dark:hover:border-blue-700 hover:bg-white/80 dark:hover:bg-slate-800/80 h-fit">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="w-full flex justify-between items-center p-4 text-left focus:outline-none gap-3"
      >
        <span className="font-bold text-slate-800 dark:text-white text-sm md:text-base flex items-center gap-2">
          <span className="shrink-0 w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xs">Q</span>
          {question}
        </span>
        <div className={`transform transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-180' : ''}`}>
           <CaretDown className="text-slate-400" size={16} />
        </div>
      </button>
      <div className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="p-4 pt-0 text-sm text-slate-600 dark:text-slate-300 leading-relaxed pl-12 border-t border-slate-100 dark:border-slate-700/50 mt-2 pt-3">
          {answer}
        </div>
      </div>
    </div>
  );
};

// --- Dynamic Background Component ---
const DynamicBackground: React.FC<{ currentInput: AnalysisInput | null, currentRecInput: RecommendationInput | null }> = ({ currentInput, currentRecInput }) => {
  const [bgImage, setBgImage] = useState(BUSINESS_BACKGROUNDS['default']);

  useEffect(() => {
    let type = 'default';
    if (currentInput && currentInput.businessType) {
      type = currentInput.businessType;
    } else if (currentRecInput && currentRecInput.businessType) {
      type = currentRecInput.businessType;
    }
    
    // Find matching background or fallback to default
    const matchedBg = Object.entries(BUSINESS_BACKGROUNDS).find(([key]) => type.includes(key))?.[1] || BUSINESS_BACKGROUNDS[type] || BUSINESS_BACKGROUNDS['default'];
    setBgImage(matchedBg);
  }, [currentInput, currentRecInput]);

  return (
    <>
      {/* Background Image Layer */}
      <div 
        className="fixed top-0 left-0 w-full h-full z-0 transition-all duration-1000 ease-in-out"
        style={{
          backgroundImage: `url('${bgImage}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      ></div>

      {/* Overlay Layer - Lighter in light mode, Darker in dark mode */}
      <div className="fixed top-0 left-0 w-full h-full z-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm"></div>

      {/* Decorative Grid Pattern (New) */}
      <div className="fixed inset-0 z-0 opacity-[0.4] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
      </div>

      {/* Animated Gradients */}
      <div className="fixed top-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-400/10 rounded-full blur-[100px] animate-blob pointer-events-none z-0 mix-blend-multiply dark:mix-blend-overlay"></div>
      <div className="fixed bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-400/10 rounded-full blur-[100px] animate-blob animation-delay-2000 pointer-events-none z-0 mix-blend-multiply dark:mix-blend-overlay"></div>
    </>
  );
};

// --- Main App Component ---

interface UserData {
  name: string;
  email: string;
  type: 'member' | 'guest';
}

const App: React.FC = () => {
  const [loadingStage, setLoadingStage] = useState<LoadingStage>(LoadingStage.IDLE);
  
  // Auth State
  const [user, setUser] = useState<UserData | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isMyPageModalOpen, setIsMyPageModalOpen] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // States for Analysis
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [currentInput, setCurrentInput] = useState<AnalysisInput | null>(null);
  
  // States for Recommendation
  const [recResult, setRecResult] = useState<RecommendationResult | null>(null);
  const [currentRecInput, setCurrentRecInput] = useState<RecommendationInput | null>(null);

  const [presetData, setPresetData] = useState<{ type: 'analysis' | 'recommendation', input: AnalysisInput | RecommendationInput } | null>(null);

  const safePushState = (data: any, title: string, url: string) => {
    try {
      if (window.location.protocol === 'blob:' || window.location.href.startsWith('blob:')) {
        return;
      }
      window.history.pushState(data, title, url);
    } catch (e) {
      console.debug("Skipping URL update in restricted env", e);
    }
  };

  // --- Persistence Logic ---
  
  useEffect(() => {
    const session = localStorage.getItem('biz_session');
    if (session) {
      try {
        setUser(JSON.parse(session));
      } catch (e) {
        console.error("Failed to restore session", e);
        localStorage.removeItem('biz_session');
      }
    }
  }, []);

  useEffect(() => {
    if (user?.email && user.type === 'member') {
      const savedHistory = localStorage.getItem(`biz_history_${user.email}`);
      if (savedHistory) {
        try {
          setHistory(JSON.parse(savedHistory));
        } catch (e) {
          console.error("Failed to load history", e);
        }
      } else {
        setHistory([]);
      }
    } else {
      setHistory([]);
    }
  }, [user]);

  // --- Handlers ---

  const handleLogin = (userData: UserData) => {
    setUser(userData);
    if (userData.type === 'member') {
        localStorage.setItem('biz_session', JSON.stringify(userData));
    }
  };

  const handleLogout = () => {
    setUser(null);
    setHistory([]); 
    localStorage.removeItem('biz_session');
    setIsMyPageModalOpen(false);
  };

  const handleUpdateUser = (newName: string) => {
    if (!user) return;
    const updatedUser = { ...user, name: newName };
    setUser(updatedUser);
    
    if (user.type === 'member') {
      localStorage.setItem('biz_session', JSON.stringify(updatedUser));
      try {
        const storedUsers = localStorage.getItem('biz_users');
        if (storedUsers) {
          const users = JSON.parse(storedUsers);
          const index = users.findIndex((u: any) => u.email === user.email);
          if (index !== -1) {
            users[index].name = newName;
            localStorage.setItem('biz_users', JSON.stringify(users));
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleReset = () => {
    setResult(null);
    setRecResult(null);
    setLoadingStage(LoadingStage.IDLE);
    setCurrentInput(null);
    setCurrentRecInput(null);
    safePushState({}, '', window.location.pathname);
  };

  const handleSaveReport = () => {
    if (!result && !recResult) {
        alert("저장할 분석 결과가 없습니다.");
        return;
    }
    
    if (confirm("현재 분석 리포트를 PDF로 저장하시겠습니까?\n\n(인쇄 미리보기 화면에서 'PDF로 저장'을 선택해주세요.)")) {
        // Give UI a moment to respond
        setTimeout(() => {
            window.print();
        }, 100);
    }
  };

  const handleGlobalShare = async () => {
    const currentUrl = window.location.href;
    const title = recResult ? 'BizInsight AI - 입지 추천 결과' : `BizInsight AI - 상권 분석`;
    const text = "AI 기반 상권 분석 리포트를 확인해보세요.";

    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: text,
          url: currentUrl
        });
        return;
      } catch (err) {
        // Fallback to clipboard if share cancelled or failed
        if ((err as Error).name === 'AbortError') return;
      }
    }

    try {
      await navigator.clipboard.writeText(currentUrl);
      alert("🔗 링크가 복사되었습니다.");
    } catch (err) {
      prompt("이 브라우저에서는 자동 복사가 지원되지 않습니다. 아래 링크를 복사하세요:", currentUrl);
    }
  };

  const addToHistory = (type: 'analysis' | 'recommendation', input: any, data: any) => {
    if (user?.type === 'member') {
      const now = new Date();
      const newItem: HistoryItem = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        dateStr: now.toLocaleDateString() + ' ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type,
        input,
        result: data,
        title: type === 'analysis' 
          ? `${(input as AnalysisInput).address.split(' ').slice(0, 2).join(' ')} - ${(input as AnalysisInput).businessType}`
          : `${(input as RecommendationInput).city} ${(input as RecommendationInput).district} - ${(input as RecommendationInput).businessType}`,
        subtitle: type === 'analysis' ? '상권 분석 리포트' : '입지 추천 리포트'
      };
      
      setHistory(prev => {
        const newHistory = [newItem, ...prev];
        if (user.email) {
            localStorage.setItem(`biz_history_${user.email}`, JSON.stringify(newHistory));
        }
        return newHistory;
      });
    }
  };

  const updateUrlParams = (mode: 'analysis' | 'recommendation', data: any) => {
    const params = new URLSearchParams();
    params.set('mode', mode);

    if (mode === 'analysis') {
      params.set('addr', data.address);
      params.set('type', data.businessType);
      params.set('hours', data.hours);
      params.set('radius', data.radius || '500m');
    } else {
      params.set('type', data.businessType);
      params.set('city', data.city);
      params.set('dist', data.district);
      if (data.dong) params.set('dong', data.dong);
      params.set('hours', data.hours);
      params.set('budget', data.budget);
      params.set('age', data.targetAge);
      params.set('park', data.parking);
    }
    
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    safePushState({ path: newUrl }, '', newUrl);
  };

  const handleAnalyze = useCallback(async (input: AnalysisInput, isRestore: boolean = false) => {
    if (!isRestore) {
        handleReset();
    }
    setCurrentInput(input);
    setLoadingStage(LoadingStage.ANALYZING_TRAFFIC);
    
    if (!isRestore) {
        updateUrlParams('analysis', input);
    }

    const stageTimer = setInterval(() => {
      setLoadingStage(prev => {
        if (prev === LoadingStage.ANALYZING_TRAFFIC) return LoadingStage.CHECKING_COMPETITION;
        if (prev === LoadingStage.CHECKING_COMPETITION) return LoadingStage.CALCULATING_REVENUE;
        if (prev === LoadingStage.CALCULATING_REVENUE) return LoadingStage.FINALIZING;
        return prev;
      });
    }, 1500);

    try {
      const data = await analyzeLocation(input);
      clearInterval(stageTimer);
      setLoadingStage(LoadingStage.COMPLETE);
      setTimeout(() => {
        setResult(data);
        if (!isRestore) addToHistory('analysis', input, data);
        setLoadingStage(LoadingStage.IDLE);
      }, 500);
    } catch (error) {
      clearInterval(stageTimer);
      console.error(error);
      setLoadingStage(LoadingStage.ERROR);
      alert("분석 중 오류가 발생했습니다.");
      setLoadingStage(LoadingStage.IDLE);
    }
  }, [user]);

  const handleRecommend = useCallback(async (input: RecommendationInput, isRestore: boolean = false) => {
    if (!isRestore) {
        handleReset();
    }
    setCurrentRecInput(input);
    setLoadingStage(LoadingStage.ANALYZING_TRAFFIC);
    
    if (!isRestore) {
        updateUrlParams('recommendation', input);
    }

    const stageTimer = setInterval(() => {
        setLoadingStage(prev => prev === LoadingStage.ANALYZING_TRAFFIC ? LoadingStage.FINALIZING : prev);
    }, 2000);

    try {
      const data = await recommendLocations(input);
      clearInterval(stageTimer);
      setLoadingStage(LoadingStage.COMPLETE);
      setTimeout(() => {
        setRecResult(data);
        if (!isRestore) addToHistory('recommendation', input, data);
        setLoadingStage(LoadingStage.IDLE);
      }, 500);
    } catch (error) {
        clearInterval(stageTimer);
        setLoadingStage(LoadingStage.ERROR);
        alert("추천 중 오류가 발생했습니다.");
        setLoadingStage(LoadingStage.IDLE);
    }
  }, [user]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const mode = params.get('mode');

    if (mode === 'analysis') {
      const address = params.get('addr');
      const businessType = params.get('type');
      const hours = params.get('hours');
      const radius = params.get('radius');

      if (address && businessType) {
        const input: AnalysisInput = { 
            address, 
            businessType, 
            hours: hours || '24시간',
            radius: (radius as '250m' | '500m' | '1km') || '500m'
        };
        setTimeout(() => handleAnalyze(input, true), 100);
      }
    } else if (mode === 'recommendation') {
      const businessType = params.get('type');
      const city = params.get('city');
      const district = params.get('dist');
      const dong = params.get('dong') || '전체';
      
      if (businessType && city && district) {
          const input: RecommendationInput = {
              businessType,
              city,
              district,
              dong,
              hours: params.get('hours') || '24시간',
              budget: params.get('budget') || '제한 없음',
              targetAge: params.get('age') || '전 연령층',
              parking: params.get('park') || '상관 없음'
          };
          setTimeout(() => handleRecommend(input, true), 100);
      }
    }
  }, []);

  const handleSampleClick = (sampleInput: AnalysisInput) => {
    setPresetData({ type: 'analysis', input: sampleInput }); 
    handleAnalyze(sampleInput);
  };

  const handleLoadHistory = (item: HistoryItem) => {
    handleReset();
    setPresetData({ type: item.type, input: item.input });
    
    if (item.type === 'analysis') {
        updateUrlParams('analysis', item.input);
        setResult(item.result as AnalysisResult);
        setCurrentInput(item.input as AnalysisInput);
    } else {
        updateUrlParams('recommendation', item.input);
        setRecResult(item.result as RecommendationResult);
        setCurrentRecInput(item.input as RecommendationInput);
    }
  };

  const handleDeleteHistory = (id: string) => {
    if (confirm("이 기록을 삭제하시겠습니까?")) {
      setHistory(prev => {
        const newHistory = prev.filter(item => item.id !== id);
        if (user?.email) {
            localStorage.setItem(`biz_history_${user.email}`, JSON.stringify(newHistory));
        }
        return newHistory;
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-900 dark:text-slate-100 transition-colors duration-300 relative overflow-x-hidden">
      
      {/* Dynamic Background */}
      <div className="print:hidden">
        <DynamicBackground currentInput={currentInput} currentRecInput={currentRecInput} />
      </div>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        onLogin={handleLogin}
      />

      <HistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        history={history}
        onLoad={handleLoadHistory}
        onDelete={handleDeleteHistory}
      />

      <MyPageModal
        isOpen={isMyPageModalOpen}
        onClose={() => setIsMyPageModalOpen(false)}
        user={user}
        historyCount={history.length}
        onLogout={handleLogout}
        onUpdateUser={handleUpdateUser}
        onUpgrade={() => {
          setIsMyPageModalOpen(false);
          setIsAuthModalOpen(true);
        }}
      />

      {/* Navbar - HIdden on Print */}
      <header className="fixed top-0 w-full z-50 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border-b border-white/20 dark:border-slate-800 transition-all print:hidden">
        <div className="max-w-7xl mx-auto px-6 h-16 md:h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-3 cursor-pointer group" onClick={() => handleReset()}>
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 md:p-2.5 rounded-xl text-white shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform duration-300">
              <Buildings size={22} weight="fill" className="md:w-6 md:h-6" />
            </div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight">
              BizInsight <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-500">AI</span>
            </h1>
          </div>
          <div className="flex items-center gap-4">
             {(result || recResult) && (
               <>
                <button 
                  onClick={handleSaveReport}
                  className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold transition-colors bg-white/50 dark:bg-slate-800/50 px-4 py-2 rounded-xl border border-slate-200/50 dark:border-slate-700/50 hover:bg-white dark:hover:bg-slate-800"
                >
                  <DownloadSimple size={18} weight="fill" /> 
                  <span className="hidden sm:inline">PDF 저장</span>
                </button>
                <button 
                  onClick={handleGlobalShare}
                  className="flex items-center gap-2 text-slate-500 hover:text-purple-600 font-bold transition-colors bg-white/50 dark:bg-slate-800/50 px-4 py-2 rounded-xl border border-slate-200/50 dark:border-slate-700/50 hover:bg-white dark:hover:bg-slate-800"
                  title="리포트 공유하기"
                >
                  <ShareNetwork size={18} weight="fill" /> 
                  <span className="hidden sm:inline">공유하기</span>
                </button>
               </>
             )}

             {user ? (
               <div className="flex items-center gap-3 pl-6 border-l border-slate-200 dark:border-slate-700/50">
                  <div className="text-right hidden sm:block">
                     <p className="text-sm font-extrabold">{user.name}님</p>
                     <p className="text-xs font-medium text-slate-500">{user.type === 'guest' ? 'Guest Access' : 'Premium Member'}</p>
                  </div>
                  
                  {user.type === 'member' && (
                    <button 
                        onClick={() => setIsHistoryModalOpen(true)}
                        className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all mr-1"
                        title="분석 기록"
                    >
                        <ClockCounterClockwise size={22} weight="bold" />
                    </button>
                  )}

                  <div 
                    onClick={() => setIsMyPageModalOpen(true)}
                    className={`w-10 h-10 md:w-11 md:h-11 rounded-full flex items-center justify-center text-white text-lg font-bold shadow-lg cursor-pointer hover:scale-105 active:scale-95 transition-all ring-2 ring-white dark:ring-slate-800 ${user.type === 'guest' ? 'bg-slate-400' : 'bg-gradient-to-br from-blue-500 to-purple-600'}`}
                    title="마이페이지"
                  >
                     {user.type === 'guest' ? <User size={20} /> : user.name[0]}
                  </div>
               </div>
             ) : (
               <button 
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center gap-2 px-5 py-2.5 md:px-6 md:py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all active:scale-95 active:translate-y-0 text-sm md:text-base"
               >
                 <UserPlus size={18} weight="fill" />
                 <span>시작하기</span>
               </button>
             )}
          </div>
        </div>
      </header>

      <main className="flex-1 relative z-10 pt-20 md:pt-24 pb-12">
        {/* --- LANDING PAGE --- */}
        {!result && !recResult && loadingStage === LoadingStage.IDLE && (
          <div className="animate-fade-in">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
              
              {/* 1. Hero Section (Compact & Dense) */}
              <section className="text-center relative max-w-5xl mx-auto mb-10 pt-4 px-4 w-full">
                {/* Decoration: Hero Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[600px] h-[300px] bg-blue-400/20 blur-[120px] rounded-full -z-10 pointer-events-none"></div>

                {/* Decorative Floating Elements (Grouped) */}
                
                {/* Left Floating Group: Consumer Persona */}
                <div className="absolute top-1/2 -translate-y-1/2 -left-4 lg:-left-48 hidden lg:flex items-start gap-4 animate-bounce-slow z-10">
                    {/* Avatar */}
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white shadow-lg border-4 border-white dark:border-slate-700 mt-4 shrink-0">
                        <Smiley size={32} weight="fill" />
                    </div>
                    
                    {/* Combined Bubble */}
                    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl p-6 rounded-[2.5rem] rounded-tl-none shadow-2xl border border-white/40 dark:border-slate-700 relative max-w-[260px]">
                        <div className="space-y-3">
                            <div className="flex items-start gap-2.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0 mt-2"></div>
                                <p className="text-sm font-bold text-slate-700 dark:text-slate-200 leading-snug">"음... 괜찮은 상권 어디 없을까? 🤔"</p>
                            </div>
                            <div className="flex items-start gap-2.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0 mt-2"></div>
                                <p className="text-sm font-bold text-slate-700 dark:text-slate-200 leading-snug">"주말 유동인구가 많아야 할 텐데... 👥"</p>
                            </div>
                            <div className="flex items-start gap-2.5">
                                 <div className="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0 mt-2"></div>
                                <p className="text-sm font-bold text-slate-700 dark:text-slate-200 leading-snug">"요즘 뜨는 핫플은 어디지? 검색해볼까 📱"</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Floating Group: Business Owner Persona */}
                <div className="absolute top-1/2 -translate-y-1/2 -right-4 lg:-right-48 hidden lg:flex flex-row-reverse items-start gap-4 animate-bounce-slow z-10" style={{ animationDelay: '1.5s' }}>
                    {/* Avatar */}
                     <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg border-4 border-white dark:border-slate-700 mt-4 shrink-0">
                        <Storefront size={32} weight="fill" />
                    </div>

                    {/* Combined Bubble */}
                    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl p-6 rounded-[2.5rem] rounded-tr-none shadow-2xl border border-white/40 dark:border-slate-700 relative max-w-[260px] text-right">
                        <div className="space-y-3">
                             <div className="flex items-start gap-2.5 justify-end">
                                <p className="text-sm font-bold text-slate-700 dark:text-slate-200 leading-snug">"우리 가게 매출, 미리 알 수 있다면... 📉"</p>
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0 mt-2"></div>
                            </div>
                            <div className="flex items-start gap-2.5 justify-end">
                                <p className="text-sm font-bold text-slate-700 dark:text-slate-200 leading-snug">"권리금 5천만원... 적정한 금액일까? 💸"</p>
                                 <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0 mt-2"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50/80 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold text-xs md:text-sm mb-4 border border-blue-100 dark:border-blue-800 animate-fade-in-up shadow-sm backdrop-blur-sm relative z-10">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                  </span>
                  AI Powered Location Intelligence
                </div>
                
                <h2 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-4 tracking-tight leading-[1.15] animate-fade-in-up animation-delay-100 relative z-10">
                  데이터로 증명하는<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600">성공적인 창업의 시작</span>
                </h2>
                
                <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-8 leading-relaxed font-medium animate-fade-in-up animation-delay-200 relative z-10">
                   유동인구 분석, 경쟁사 현황, 예상 매출 시뮬레이션까지.<br className="hidden md:block"/> 
                   AI가 빅데이터를 분석하여 최적의 의사결정을 지원합니다.
                </p>

                 {/* Stats Floating Bar - Compact */}
                <div className="flex flex-col md:flex-row flex-wrap justify-center gap-3 animate-fade-in-up animation-delay-300 w-full max-w-3xl mx-auto relative z-10">
                  <StatCard label="누적 분석 리포트" value="15,847+" icon={<ChartBar size={18} weight="fill" />} />
                  <StatCard label="예측 정확도" value="94.2%" icon={<Target size={18} weight="fill" />} />
                  <StatCard label="제휴 브랜드" value="120+" icon={<Storefront size={18} weight="fill" />} />
                </div>
              </section>

              {/* 2. Unified Hero Showcase (Reduced Margins) */}
              <section className="w-full relative z-20 mb-10 animate-fade-in-up animation-delay-400">
                  <HeroShowcase onScenarioSelect={handleSampleClick} />
              </section>

              {/* 3. Input Section (Enhanced & Compact) */}
              <section className="w-full max-w-4xl mx-auto mb-10 relative z-20 animate-fade-in-up animation-delay-500">
                 {/* Decorative Elements around Input */}
                 <div className="absolute -left-12 top-1/2 -translate-y-1/2 text-slate-200 dark:text-slate-800 opacity-50 pointer-events-none hidden lg:block">
                     <Buildings size={120} weight="thin" />
                 </div>
                 <div className="absolute -right-12 top-1/2 -translate-y-1/2 text-slate-200 dark:text-slate-800 opacity-50 pointer-events-none hidden lg:block">
                     <MapPin size={120} weight="thin" />
                 </div>

                 <InputSection 
                    onAnalyze={handleAnalyze}
                    onRecommend={handleRecommend}
                    isAnalyzing={loadingStage !== LoadingStage.IDLE}
                    presetData={presetData}
                  />

                  {/* Trust Badge Strip */}
                  <div className="mt-4 flex justify-center items-center gap-6 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                         <CheckCircle weight="fill" className="text-blue-500" /> Powered by Google Gemini
                      </div>
                      <div className="h-3 w-px bg-slate-300"></div>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                         <CheckCircle weight="fill" className="text-green-500" /> Google Maps Data
                      </div>
                      <div className="h-3 w-px bg-slate-300"></div>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                         <CheckCircle weight="fill" className="text-purple-500" /> Public Data Portal
                      </div>
                  </div>
              </section>

              {/* 4. FAQ (Grid Layout for density) */}
              <section className="w-full max-w-4xl mx-auto mb-12 animate-fade-in-up animation-delay-600">
                 <div className="flex items-center justify-between mb-6 px-2">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                       <div className="w-1 h-6 bg-blue-600 rounded-full"></div> 자주 묻는 질문
                    </h3>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FAQItem question="분석 데이터는 얼마나 정확한가요?" answer="AI 모델이 공공 데이터(소상공인시장진흥공단, 통계청)와 실시간 지도 데이터를 교차 검증하여 약 90% 이상의 신뢰도를 제공합니다. 상권의 최신 트렌드를 반영합니다." />
                    <FAQItem question="비용은 무료인가요?" answer="네, 기본적인 상권 분석 및 입지 추천 기능은 현재 모두 무료로 제공되고 있습니다. 추후 심층 분석 프리미엄 기능이 추가될 예정입니다." />
                    <FAQItem question="어떤 업종까지 분석 가능한가요?" answer="카페, 음식점, 편의점, 미용실 등 소상공인 주요 업종을 지원하며, 지속적으로 카테고리를 확장하고 있습니다. 기타 업종도 AI가 추론 가능합니다." />
                    <FAQItem question="분석 결과는 저장되나요?" answer="로그인 시 '마이페이지' 및 '분석 기록'에서 과거 리포트를 언제든지 다시 확인할 수 있습니다. 게스트 모드는 저장이 지원되지 않습니다." />
                 </div>
              </section>

              {/* Footer (Compact) */}
              <footer className="text-center text-slate-400 dark:text-slate-500 text-xs py-6 border-t border-slate-200 dark:border-slate-800 w-full max-w-5xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center gap-2">
                    <p className="font-medium">© 2024 BizInsight AI. All rights reserved.</p>
                    <p className="opacity-70">본 서비스의 분석 결과는 참고용이며, 실제 투자 책임은 본인에게 있습니다.</p>
                </div>
              </footer>
            </div>
          </div>
        )}

        {/* --- ANALYSIS DASHBOARD --- */}
        {(result || recResult || loadingStage !== LoadingStage.IDLE) && (
           <div className="max-w-[1600px] mx-auto p-4 md:p-6 lg:p-8 animate-fade-in pb-20">
              {loadingStage !== LoadingStage.IDLE ? (
                 <div className="min-h-[70vh] flex items-center justify-center bg-white/60 dark:bg-slate-800/60 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl border border-white/20 dark:border-slate-700/50">
                   <LoadingScreen stage={loadingStage} />
                 </div>
              ) : (
                <>
                  {/* Compact Slider ABOVE Dashboard - Hidden on Print */}
                  <div className="print:hidden">
                    <CaseStudySlider onScenarioSelect={handleSampleClick} compact={true} />
                  </div>

                  <Dashboard 
                    result={result || undefined} 
                    recommendationResult={recResult || undefined}
                    address={currentInput?.address} 
                    businessType={currentInput?.businessType}
                    onBack={handleReset}
                  />
                </>
              )}
           </div>
        )}
      </main>
    </div>
  );
};

export default App;
