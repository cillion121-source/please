
import React, { useState, useEffect } from 'react';
import { AnalysisInput } from '../types';
import { SAMPLE_SCENARIOS, BUSINESS_BACKGROUNDS } from '../constants';
import { 
  Robot, GlobeHemisphereWest, ChartLineUp, ShieldCheck, 
  ArrowRight, Storefront, Lightning, Brain, 
  UserPlus, Buildings, PresentationChart, Users
} from 'phosphor-react';

interface HeroShowcaseProps {
  onScenarioSelect: (input: AnalysisInput) => void;
}

// --- Data for Features ---
const FEATURES = [
  {
    title: "AI Gemini Engine",
    desc: "Google의 최신 LLM 모델이 인구 통계, 소비 패턴 등 수백만 건의 복합 데이터를 인간 전문가처럼 분석하여 최적의 의사결정을 지원합니다.",
    icon: <Robot weight="duotone" size={32} />,
    iconColor: "text-blue-600 dark:text-blue-400",
    color: "from-blue-500 to-cyan-400",
    bg: "bg-blue-50 dark:bg-blue-900/20"
  },
  {
    title: "Real-Time Maps",
    desc: "Google Maps 실시간 API와 연동하여 최신 폐업/개업 현황을 즉시 반영하며, 죽은 상권과 뜨는 상권을 지도 위에서 바로 식별합니다.",
    icon: <GlobeHemisphereWest weight="duotone" size={32} />,
    iconColor: "text-emerald-600 dark:text-emerald-400",
    color: "from-emerald-500 to-teal-400",
    bg: "bg-emerald-50 dark:bg-emerald-900/20"
  },
  {
    title: "Revenue Sim",
    desc: "요일별, 시간대별 유동인구의 이동 경로와 소비 성향을 딥러닝으로 학습하여, 오차 범위 5% 이내의 정밀한 예상 매출 시뮬레이션을 제공합니다.",
    icon: <ChartLineUp weight="duotone" size={32} />,
    iconColor: "text-amber-600 dark:text-amber-400",
    color: "from-amber-500 to-orange-400",
    bg: "bg-amber-50 dark:bg-amber-900/20"
  },
  {
    title: "Risk Radar",
    desc: "주변 동일 업종의 과밀도와 경쟁 강도를 분석하고, 임대료 상승률 및 공실률 추이를 기반으로 잠재적인 창업 위험 요소를 사전에 경고합니다.",
    icon: <ShieldCheck weight="duotone" size={32} />,
    iconColor: "text-rose-600 dark:text-rose-400",
    color: "from-rose-500 to-pink-400",
    bg: "bg-rose-50 dark:bg-rose-900/20"
  }
];

// --- Data for Target Audience ---
const TARGETS = [
  {
    title: "예비 창업자",
    desc: "입지와 유동인구 기반 예상 매출 분석",
    icon: <UserPlus weight="duotone" size={32} />,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-900/20",
    hoverBorder: "group-hover:border-blue-200 dark:group-hover:border-blue-800",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=600&auto=format&fit=crop"
  },
  {
    title: "소상공인/자영업자",
    desc: "매출 감소 원인 분석과 개선 솔루션 추천",
    icon: <Storefront weight="duotone" size={32} />,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-900/20",
    hoverBorder: "group-hover:border-emerald-200 dark:group-hover:border-emerald-800",
    image: "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?q=80&w=600&auto=format&fit=crop"
  },
  {
    title: "프랜차이즈 본사",
    desc: "전국 입지 점수화 및 위험 최소화 분석",
    icon: <Buildings weight="duotone" size={32} />,
    color: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-50 dark:bg-purple-900/20",
    hoverBorder: "group-hover:border-purple-200 dark:group-hover:border-purple-800",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=600&auto=format&fit=crop"
  },
  {
    title: "상권·부동산 컨설턴트",
    desc: "데이터 기반 보고서 자동 생성",
    icon: <PresentationChart weight="duotone" size={32} />,
    color: "text-orange-600 dark:text-orange-400",
    bg: "bg-orange-50 dark:bg-orange-900/20",
    hoverBorder: "group-hover:border-orange-200 dark:group-hover:border-orange-800",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600&auto=format&fit=crop"
  }
];

type TabType = 'targets' | 'features' | 'cases';

const HeroShowcase: React.FC<HeroShowcaseProps> = ({ onScenarioSelect }) => {
  const [activeTab, setActiveTab] = useState<TabType>('targets');
  const [isPaused, setIsPaused] = useState(false);
  
  // Only use the first 3 scenarios
  const displayScenarios = SAMPLE_SCENARIOS.slice(0, 3);

  // Auto-slide functionality
  useEffect(() => {
    if (isPaused) return;

    const tabs: TabType[] = ['targets', 'features', 'cases'];
    const timer = setInterval(() => {
      setActiveTab(current => {
        const currentIndex = tabs.indexOf(current);
        const nextIndex = (currentIndex + 1) % tabs.length;
        return tabs[nextIndex];
      });
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, [isPaused]);

  const getTransform = () => {
    switch(activeTab) {
      case 'targets': return 'translateX(0%)';
      case 'features': return 'translateX(-100%)';
      case 'cases': return 'translateX(-200%)';
      default: return 'translateX(0%)';
    }
  };

  const getTabIndicatorPosition = () => {
    switch(activeTab) {
      case 'targets': return 'left-1.5 w-[160px]';
      case 'features': return 'left-[166px] w-[140px]'; 
      case 'cases': return 'left-[306px] w-[140px]';
      default: return 'left-1.5 w-[160px]';
    }
  };

  return (
    <div 
      className="w-full max-w-6xl mx-auto mb-10 animate-fade-in px-4"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Tab Menu */}
      <div className="flex justify-center mb-8">
        <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-md p-1.5 rounded-full border border-white/40 dark:border-slate-700 shadow-lg inline-flex relative">
           {/* Animated Background Indicator */}
           <div 
             className={`absolute top-1.5 bottom-1.5 rounded-full bg-blue-600 shadow-md transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${getTabIndicatorPosition()}`}
           ></div>
           
           <button
             onClick={() => setActiveTab('targets')}
             className={`relative z-10 w-[160px] py-2 rounded-full text-sm font-bold transition-colors flex items-center justify-center gap-2 ${
               activeTab === 'targets' ? 'text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
             }`}
           >
             <Users weight={activeTab === 'targets' ? "fill" : "bold"} /> 누구를 위한 서비스?
           </button>
           
           <button
             onClick={() => setActiveTab('features')}
             className={`relative z-10 w-[140px] py-2 rounded-full text-sm font-bold transition-colors flex items-center justify-center gap-2 ${
               activeTab === 'features' ? 'text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
             }`}
           >
             <Brain weight={activeTab === 'features' ? "fill" : "bold"} /> 핵심 기술 소개
           </button>

           <button
             onClick={() => setActiveTab('cases')}
             className={`relative z-10 w-[140px] py-2 rounded-full text-sm font-bold transition-colors flex items-center justify-center gap-2 ${
               activeTab === 'cases' ? 'text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
             }`}
           >
             <Lightning weight={activeTab === 'cases' ? "fill" : "bold"} /> 실시간 분석 예시
           </button>
        </div>
      </div>

      {/* Slider Viewport */}
      <div className="relative overflow-hidden min-h-[420px] rounded-3xl">
         <div 
            className="flex transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] w-full h-full"
            style={{ transform: getTransform() }}
         >
            {/* Slide 1: Target Audience */}
            <div className="min-w-full px-1">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 h-full">
                    {TARGETS.map((target, idx) => (
                    <div 
                        key={idx}
                        className="group relative h-[400px] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-slate-200 dark:border-slate-700"
                    >
                        {/* Background Image */}
                        <div 
                            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                            style={{ backgroundImage: `url('${target.image}')` }}
                        ></div>
                        
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-slate-900/60 group-hover:bg-slate-900/50 transition-colors duration-300"></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80"></div>
                        
                        {/* Content */}
                        <div className="relative z-10 p-6 h-full flex flex-col items-center justify-center text-center">
                            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                                {/* Force icon to be white */}
                                {React.cloneElement(target.icon as React.ReactElement, { color: 'white' })}
                            </div>
                            
                            <h3 className="text-2xl font-bold text-white mb-3 shadow-sm tracking-tight">
                              {target.title}
                            </h3>
                            <p className="text-sm text-slate-100 leading-relaxed font-medium opacity-90">
                              {target.desc}
                            </p>
                        </div>
                    </div>
                    ))}
                </div>
            </div>

            {/* Slide 2: Features Grid */}
            <div className="min-w-full px-1">
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 h-full">
                    {FEATURES.map((feat, idx) => (
                       <div key={idx} className={`relative group h-full rounded-2xl border border-slate-100 dark:border-slate-700 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden bg-white dark:bg-slate-800 p-6 flex flex-col items-center text-center justify-center`}>
                          <div className={`absolute inset-0 bg-gradient-to-br ${feat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                          
                          {/* Icon Container */}
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110 shadow-sm ${feat.bg}`}>
                             <div className={`${feat.iconColor}`}>
                               {feat.icon}
                             </div>
                          </div>

                          <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-3">{feat.title}</h3>
                          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed word-keep-all">
                            {feat.desc}
                          </p>
                       </div>
                    ))}
                 </div>
            </div>

            {/* Slide 3: Case Studies */}
            <div className="min-w-full px-1">
                <div className="w-full h-full flex items-center justify-center">
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                      {displayScenarios.map((scenario, idx) => {
                          const bgImage = BUSINESS_BACKGROUNDS[scenario.input.businessType] || BUSINESS_BACKGROUNDS['default'];
                          return (
                            <div 
                              key={`${idx}-${scenario.title}`}
                              onClick={() => onScenarioSelect(scenario.input as AnalysisInput)}
                              className="relative w-full h-[400px] rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] group border border-white/20 dark:border-slate-700"
                            >
                               <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent z-10"></div>
                               <div 
                                 className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                 style={{ backgroundImage: `url('${bgImage}')` }}
                               ></div>
                               
                               <div className="absolute inset-0 p-6 flex flex-col justify-end z-20 text-white">
                                  <div className="bg-white/20 backdrop-blur-md w-fit px-2.5 py-1 rounded-lg text-[11px] font-bold mb-auto border border-white/30 flex items-center gap-1.5 shadow-sm">
                                     <Storefront size={12} weight="fill" />
                                     {scenario.input.businessType}
                                  </div>
                                  <h4 className="text-xl font-bold mb-2 leading-tight shadow-sm text-white">{scenario.title}</h4>
                                  <p className="text-sm text-slate-200 line-clamp-2 opacity-90 mb-4 font-medium">
                                     {scenario.description}
                                  </p>
                                  <div className="flex items-center gap-1.5 text-blue-300 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                     분석 결과 보기 <ArrowRight weight="bold" />
                                  </div>
                               </div>
                            </div>
                          );
                      })}
                   </div>
                </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default HeroShowcase;
