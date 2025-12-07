
import React, { useState, useEffect } from 'react';
import { 
  BUSINESS_TYPES, OPERATING_HOURS, CITIES, DISTRICTS, DONGS, 
  BUDGET_RANGES, TARGET_AGES, PARKING_OPTIONS 
} from '../constants';
import { AnalysisInput, RecommendationInput } from '../types';
import { MapPin, MagnifyingGlass, Target, Faders, BellRinging, CaretDown, Storefront, List, PencilSimple } from 'phosphor-react';

interface InputSectionProps {
  onAnalyze: (input: AnalysisInput) => void;
  onRecommend: (input: RecommendationInput) => void;
  isAnalyzing: boolean;
  presetData?: {
    type: 'analysis' | 'recommendation';
    input: AnalysisInput | RecommendationInput;
  } | null;
}

const QUICK_TYPES = [
  { name: "편의점", icon: "🏪" },
  { name: "카페", icon: "☕" },
  { name: "치킨/호프", icon: "🍗" },
  { name: "한식", icon: "🍚" },
  { name: "중식", icon: "🍜" },
  { name: "일식", icon: "🍱" },
  { name: "양식", icon: "🍝" },
  { name: "분식", icon: "🍙" },
  { name: "베이커리", icon: "🥖" },
  { name: "미용실", icon: "💇" },
  { name: "네일", icon: "💅" },
  { name: "헬스장", icon: "💪" },
  { name: "부동산", icon: "🏠" },
  { name: "학원", icon: "📚" },
];

const InputSection: React.FC<InputSectionProps> = ({ onAnalyze, onRecommend, isAnalyzing, presetData }) => {
  const [activeTab, setActiveTab] = useState<'analysis' | 'recommendation'>('analysis');

  // Analysis State
  const [address, setAddress] = useState('');
  const [businessType, setBusinessType] = useState(BUSINESS_TYPES[0]);
  const [isCustomBusiness, setIsCustomBusiness] = useState(false); // New state for direct input mode
  const [hours, setHours] = useState(OPERATING_HOURS[0]);
  const [radius, setRadius] = useState<'250m' | '500m' | '1km'>('500m');

  // Recommendation State
  const [recBusinessType, setRecBusinessType] = useState('');
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');
  const [dong, setDong] = useState('');
  const [recHours, setRecHours] = useState(OPERATING_HOURS[0]);
  const [budget, setBudget] = useState(BUDGET_RANGES[0]);
  const [targetAge, setTargetAge] = useState(TARGET_AGES[0]);
  const [parking, setParking] = useState(PARKING_OPTIONS[0]);

  // Handle Preset Load
  useEffect(() => {
    if (presetData) {
      if (presetData.type === 'analysis') {
        const input = presetData.input as AnalysisInput;
        setActiveTab('analysis');
        setAddress(input.address);
        
        // Handle custom business type check
        if (BUSINESS_TYPES.includes(input.businessType)) {
            setBusinessType(input.businessType);
            setIsCustomBusiness(false);
        } else {
            setBusinessType(input.businessType);
            setIsCustomBusiness(true);
        }

        setHours(input.hours);
        setRadius(input.radius || '500m');
      } else {
        const input = presetData.input as RecommendationInput;
        setActiveTab('recommendation');
        setRecBusinessType(input.businessType);
        setCity(input.city);
        setDistrict(input.district);
        setDong(input.dong || '전체');
        setRecHours(input.hours);
        setBudget(input.budget);
        setTargetAge(input.targetAge);
        setParking(input.parking);
      }
    }
  }, [presetData]);

  const handleAnalysisSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (address.trim().length < 3) return alert("주소를 올바르게 입력해주세요.");
    if (!businessType.trim()) return alert("업종을 입력해주세요.");
    onAnalyze({ address, businessType, hours, radius });
  };

  const handleRecommendSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recBusinessType) return alert("업종을 선택해주세요.");
    if (!city) return alert("시를 선택해주세요.");
    if (!district) return alert("구를 선택해주세요.");
    
    const selectedDong = dong || '전체';
    
    onRecommend({
      businessType: recBusinessType,
      city: city === '전체' ? '전체 지역' : city,
      district: district === '전체' ? '전체' : district,
      dong: selectedDong === '전체' ? '전체' : selectedDong,
      hours: recHours,
      budget,
      targetAge,
      parking
    });
  };

  const currentDistricts = city && city !== '전체' ? (DISTRICTS[city] || []) : [];
  const currentDongs = district && district !== '전체' ? (DONGS[district] || []) : [];

  return (
    <div className="relative z-10">
      {/* Glassmorphism Container */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl p-1 rounded-[2rem] shadow-2xl border border-white/50 dark:border-slate-700/50">
        
        {/* Tab Switcher */}
        <div className="flex p-1.5 bg-slate-100/50 dark:bg-slate-800/50 rounded-[1.5rem] mb-6 relative">
          <div 
            className={`absolute top-1.5 bottom-1.5 rounded-[1.2rem] bg-white dark:bg-slate-700 shadow-md transition-all duration-300 ease-spring ${
              activeTab === 'analysis' ? 'left-1.5 w-[calc(50%-0.375rem)]' : 'left-[calc(50%+0.375rem)] w-[calc(50%-0.75rem)]'
            }`}
          ></div>
          <button
            onClick={() => setActiveTab('analysis')}
            className={`flex-1 py-3 px-6 rounded-[1.2rem] font-bold text-sm md:text-base flex items-center justify-center gap-2 transition-all relative z-10 ${
              activeTab === 'analysis'
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
            }`}
          >
            <MapPin weight={activeTab === 'analysis' ? "fill" : "bold"} size={18} /> 주소로 상권 분석
          </button>
          <button
            onClick={() => setActiveTab('recommendation')}
            className={`flex-1 py-3 px-6 rounded-[1.2rem] font-bold text-sm md:text-base flex items-center justify-center gap-2 transition-all relative z-10 ${
              activeTab === 'recommendation'
                ? 'text-purple-600 dark:text-purple-400'
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
            }`}
          >
            <MagnifyingGlass weight={activeTab === 'recommendation' ? "bold" : "regular"} size={18} /> 업종별 입지 추천
          </button>
        </div>

        <div className="px-6 pb-6 pt-2">
          {activeTab === 'analysis' ? (
            /* --- ANALYSIS FORM --- */
            <div className="animate-fade-in space-y-6">
               <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-extrabold text-slate-800 dark:text-white mb-1">상권 상세 분석</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">원하는 위치의 매출 잠재력을 확인하세요.</p>
                  </div>
                  <div className="hidden sm:flex text-[11px] font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 rounded-full items-center gap-1.5 border border-blue-100 dark:border-blue-800">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                      </span>
                      실시간 데이터 연동
                  </div>
               </div>
               
               <form onSubmit={handleAnalysisSubmit} className="space-y-6">
                  <div className="space-y-2 group">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1 group-focus-within:text-blue-600 transition-colors">창업 희망 주소</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="예: 서울시 강남구 테헤란로 1"
                        className="block w-full pl-4 pr-4 py-4 text-lg font-medium border-2 border-slate-100 dark:border-slate-700 rounded-2xl bg-slate-50/50 dark:bg-slate-800/50 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30 focus:border-blue-500 outline-none transition-all placeholder-slate-300 dark:text-white dark:placeholder-slate-600"
                        disabled={isAnalyzing}
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                        <MapPin size={24} weight="duotone" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    <div className="md:col-span-5 space-y-2 group">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">업종</label>
                      <div className="relative">
                        {!isCustomBusiness ? (
                            <>
                                <select
                                value={businessType}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    if (val === 'DIRECT_INPUT') {
                                        setIsCustomBusiness(true);
                                        setBusinessType('');
                                    } else {
                                        setBusinessType(val);
                                    }
                                }}
                                className="block w-full pl-4 pr-10 py-3.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 appearance-none focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium dark:text-white cursor-pointer hover:border-blue-300"
                                disabled={isAnalyzing}
                                >
                                {BUSINESS_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                <option value="DIRECT_INPUT" className="font-bold text-blue-600 bg-blue-50 dark:bg-slate-700 dark:text-blue-300">✏️ 직접 입력하기...</option>
                                </select>
                                <CaretDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                            </>
                        ) : (
                            <div className="relative animate-fade-in">
                                <input 
                                    type="text"
                                    value={businessType}
                                    onChange={(e) => setBusinessType(e.target.value)}
                                    placeholder="업종을 입력하세요 (예: 꽃집)"
                                    className="block w-full pl-4 pr-10 py-3.5 border-2 border-blue-500 dark:border-blue-400 rounded-xl bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-200 outline-none transition-all font-medium dark:text-white"
                                    autoFocus
                                    disabled={isAnalyzing}
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsCustomBusiness(false);
                                        setBusinessType(BUSINESS_TYPES[0]);
                                    }}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                                    title="목록에서 선택"
                                >
                                    <List size={20} weight="bold" />
                                </button>
                            </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="md:col-span-4 space-y-2 group">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">영업 시간</label>
                      <div className="relative">
                        <select
                          value={hours}
                          onChange={(e) => setHours(e.target.value)}
                          className="block w-full pl-4 pr-10 py-3.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 appearance-none focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium dark:text-white cursor-pointer hover:border-blue-300"
                          disabled={isAnalyzing}
                        >
                          {OPERATING_HOURS.map(h => <option key={h} value={h}>{h}</option>)}
                        </select>
                        <CaretDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                      </div>
                    </div>

                    <div className="md:col-span-3 space-y-2 group">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1 flex items-center gap-1">반경 <Faders /></label>
                      <div className="relative">
                        <select
                          value={radius}
                          onChange={(e) => setRadius(e.target.value as any)}
                          className="block w-full pl-4 pr-10 py-3.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 appearance-none focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium dark:text-white cursor-pointer hover:border-blue-300"
                          disabled={isAnalyzing}
                        >
                          <option value="250m">250m</option>
                          <option value="500m">500m</option>
                          <option value="1km">1km</option>
                        </select>
                        <CaretDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                      </div>
                    </div>
                  </div>
                  
                  {/* Quick Select Chips */}
                  <div className="pt-2">
                      <p className="text-[11px] text-slate-400 font-bold mb-3 uppercase tracking-wider">인기 업종 빠른 선택</p>
                      <div className="flex flex-wrap gap-2">
                          {QUICK_TYPES.map((type) => (
                              <button
                                  key={type.name}
                                  type="button"
                                  onClick={() => {
                                      setBusinessType(type.name);
                                      setIsCustomBusiness(false);
                                  }}
                                  className={`px-3 py-1.5 rounded-lg text-sm border flex items-center gap-1.5 transition-all active:scale-95 ${
                                      businessType === type.name 
                                      ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/30' 
                                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-blue-300 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                                  }`}
                              >
                                  <span>{type.icon}</span>{type.name}
                              </button>
                          ))}
                      </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isAnalyzing || address.length < 2}
                    className={`w-full py-4 rounded-2xl font-bold text-lg text-white shadow-xl transition-all duration-300 transform active:scale-[0.98] ${
                        isAnalyzing 
                        ? 'bg-slate-400 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 bg-[length:200%_100%] hover:bg-[100%_0] animate-shimmer shadow-blue-500/30'
                    }`}
                  >
                    {isAnalyzing ? (
                         <div className="flex items-center justify-center gap-2">
                             <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                             <span>데이터 분석 중...</span>
                         </div>
                    ) : (
                        '무료 상권 분석 시작하기'
                    )}
                  </button>
               </form>
            </div>
          ) : (
            /* --- RECOMMENDATION FORM --- */
            <div className="animate-fade-in space-y-6">
               <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-extrabold text-slate-800 dark:text-white mb-1">최적 입지 추천</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">내 조건에 딱 맞는 최고의 장소를 찾아드립니다.</p>
                  </div>
               </div>
               
               <form onSubmit={handleRecommendSubmit} className="space-y-6">
                  <div className="space-y-2 group">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">업종 선택</label>
                    <div className="relative">
                      <select
                        value={recBusinessType}
                        onChange={(e) => setRecBusinessType(e.target.value)}
                        className="block w-full pl-4 pr-10 py-4 text-lg font-medium border-2 border-slate-100 dark:border-slate-700 rounded-2xl bg-slate-50/50 dark:bg-slate-800/50 focus:ring-4 focus:ring-purple-100 dark:focus:ring-purple-900/30 focus:border-purple-500 outline-none transition-all dark:text-white cursor-pointer"
                        disabled={isAnalyzing}
                      >
                        <option value="">업종을 선택해주세요</option>
                        {BUSINESS_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                      <Storefront className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={24} weight="duotone"/>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2 group">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">지역 (시)</label>
                      <div className="relative">
                        <select
                          value={city}
                          onChange={(e) => { setCity(e.target.value); setDistrict(''); setDong(''); }}
                          className="block w-full p-3.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 appearance-none focus:ring-2 focus:ring-purple-500 outline-none transition-all dark:text-white hover:border-purple-300"
                        >
                          <option value="">시 선택</option>
                          <option value="전체">전체</option>
                          {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <CaretDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                      </div>
                    </div>
                    <div className="space-y-2 group">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">지역 (구)</label>
                      <div className="relative">
                        <select
                          value={district}
                          onChange={(e) => { setDistrict(e.target.value); setDong(''); }}
                          className="block w-full p-3.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 appearance-none focus:ring-2 focus:ring-purple-500 outline-none transition-all dark:text-white hover:border-purple-300 disabled:opacity-50"
                          disabled={!city || city === '전체'}
                        >
                          <option value="">구 선택</option>
                          {city && city !== '전체' && <option value="전체">전체</option>}
                          {currentDistricts.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                        <CaretDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                      </div>
                    </div>
                    <div className="space-y-2 group">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">지역 (동)</label>
                      <div className="relative">
                        <select
                          value={dong}
                          onChange={(e) => setDong(e.target.value)}
                          className="block w-full p-3.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 appearance-none focus:ring-2 focus:ring-purple-500 outline-none transition-all dark:text-white hover:border-purple-300 disabled:opacity-50"
                          disabled={!district || district === '전체'}
                        >
                          <option value="">동 선택</option>
                          {district && district !== '전체' && <option value="전체">전체</option>}
                          {currentDongs.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                        <CaretDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2 group">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">월 임대료 예산</label>
                      <div className="relative">
                          <select
                            value={budget}
                            onChange={(e) => setBudget(e.target.value)}
                            className="block w-full p-3.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 appearance-none focus:ring-2 focus:ring-purple-500 outline-none transition-all dark:text-white hover:border-purple-300"
                          >
                            {BUDGET_RANGES.map(b => <option key={b} value={b}>{b}</option>)}
                          </select>
                          <CaretDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                      </div>
                     </div>
                     <div className="space-y-2 group">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">주요 타겟층</label>
                      <div className="relative">
                          <select
                            value={targetAge}
                            onChange={(e) => setTargetAge(e.target.value)}
                            className="block w-full p-3.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 appearance-none focus:ring-2 focus:ring-purple-500 outline-none transition-all dark:text-white hover:border-purple-300"
                          >
                            {TARGET_AGES.map(a => <option key={a} value={a}>{a}</option>)}
                          </select>
                          <CaretDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                      </div>
                     </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isAnalyzing}
                    className={`w-full py-4 rounded-2xl font-bold text-lg text-white shadow-xl transition-all duration-300 transform active:scale-[0.98] ${
                        isAnalyzing 
                        ? 'bg-slate-400 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-[length:200%_100%] hover:bg-[100%_0] animate-shimmer shadow-purple-500/30'
                    }`}
                  >
                     {isAnalyzing ? (
                        <div className="flex items-center justify-center gap-2">
                             <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                             <span>입지 탐색 중...</span>
                         </div>
                     ) : (
                        <span className="flex items-center justify-center gap-2">
                           <Target weight="fill" size={20}/> 최적 입지 추천받기
                        </span>
                     )}
                  </button>
               </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InputSection;
